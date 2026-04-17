import { describe, it, expect } from 'vitest';
import { spliceNodeIntoEdge, type SpliceTarget } from '../utils/spliceNodeIntoEdge';
import { PASSE_DIX_SCENE } from '@game/data/battles/voltri/vnScenes/passeDix';
import type { VNScene } from '@game/types/vnTypes';

function reachableSet(scene: VNScene): Set<string> {
  const seen = new Set<string>();
  const q = [scene.startNode];
  while (q.length) {
    const id = q.shift()!;
    if (seen.has(id) || !scene.nodes[id]) continue;
    seen.add(id);
    const n = scene.nodes[id];
    if (typeof n.next === 'string') q.push(n.next);
    if (n.choices) {
      for (const c of n.choices) {
        q.push(c.nextId);
        if (c.gameCheck) {
          q.push(c.gameCheck.passNode);
          q.push(c.gameCheck.failNode);
        }
      }
    }
    if (n.gameConditionNext) {
      for (const b of n.gameConditionNext) q.push(b.nextId);
    }
  }
  return seen;
}

function isLinear(n: VNScene['nodes'][string]): boolean {
  return !(n.choices?.length) && !(n.gameConditionNext?.length);
}

/** Enumerate every insertable edge in a scene — matches buildTree's insertable=true set. */
function enumerateInsertableEdges(scene: VNScene): SpliceTarget[] {
  const edges: SpliceTarget[] = [];
  for (const [nodeId, node] of Object.entries(scene.nodes)) {
    if (node.choices) {
      node.choices.forEach((c, ci) => {
        if (c.gameCheck) {
          edges.push({ kind: 'pass', srcNodeId: nodeId, srcChoiceIdx: ci, targetNodeId: c.gameCheck.passNode });
          edges.push({ kind: 'fail', srcNodeId: nodeId, srcChoiceIdx: ci, targetNodeId: c.gameCheck.failNode });
        } else {
          edges.push({ kind: 'choice-target', srcNodeId: nodeId, srcChoiceIdx: ci, targetNodeId: c.nextId });
        }
      });
    }
    if (node.gameConditionNext) {
      node.gameConditionNext.forEach((b, bi) => {
        edges.push({ kind: 'condition', srcNodeId: nodeId, srcConditionIdx: bi, targetNodeId: b.nextId });
      });
    }
    if (typeof node.next === 'string') {
      edges.push({ kind: 'next', srcNodeId: nodeId, targetNodeId: node.next });
    }
  }
  return edges;
}

describe('spliceNodeIntoEdge', () => {
  it('does not mutate the input scene', () => {
    const before = JSON.stringify(PASSE_DIX_SCENE);
    spliceNodeIntoEdge(PASSE_DIX_SCENE, 'intro_2', {
      kind: 'next',
      srcNodeId: 'watch_1',
      targetNodeId: 'watch_2',
    });
    expect(JSON.stringify(PASSE_DIX_SCENE)).toBe(before);
  });

  it('inserts a linear node into a linear edge', () => {
    const result = spliceNodeIntoEdge(PASSE_DIX_SCENE, 'intro_2', {
      kind: 'next',
      srcNodeId: 'watch_1',
      targetNodeId: 'watch_2',
    });
    // intro_1 bypasses intro_2 (→ felix_invite directly)
    expect(result.nodes.intro_1.next).toBe('felix_invite');
    // watch_1 now points to intro_2
    expect(result.nodes.watch_1.next).toBe('intro_2');
    // intro_2 points to watch_2
    expect(result.nodes.intro_2.next).toBe('watch_2');
  });

  it('rewires a pass branch when inserted on it', () => {
    const result = spliceNodeIntoEdge(PASSE_DIX_SCENE, 'intro_2', {
      kind: 'pass',
      srcNodeId: 'dice_roll',
      srcChoiceIdx: 0,
      targetNodeId: 'win_1',
    });
    const gc = result.nodes.dice_roll.choices![0].gameCheck!;
    expect(gc.passNode).toBe('intro_2');
    expect(result.nodes.dice_roll.choices![0].nextId).toBe('intro_2'); // invariant
    expect(result.nodes.intro_2.next).toBe('win_1');
  });

  it('promotes oldNext to startNode when the startNode is moved', () => {
    // Scenario that was orphaning the Join/Watch/Decline branches in production.
    const result = spliceNodeIntoEdge(PASSE_DIX_SCENE, 'intro_1', {
      kind: 'next',
      srcNodeId: 'empty_felix',
      targetNodeId: 'empty_end',
    });
    expect(result.startNode).toBe('intro_2');
    const reached = reachableSet(result);
    const orphans = Object.keys(result.nodes).filter((id) => !reached.has(id));
    expect(orphans).toEqual([]);
  });

  it('never orphans nodes — brute-force across every (linear node × insertable edge) pair', () => {
    const allNodeIds = Object.keys(PASSE_DIX_SCENE.nodes);
    const linearNodeIds = allNodeIds.filter((id) => isLinear(PASSE_DIX_SCENE.nodes[id]));
    const edges = enumerateInsertableEdges(PASSE_DIX_SCENE);

    const failures: Array<{ draggedId: string; edge: SpliceTarget; orphans: string[] }> = [];
    for (const draggedId of linearNodeIds) {
      for (const edge of edges) {
        // Same skip rules the UI enforces: can't splice onto an edge connected to the dragged node.
        if (edge.srcNodeId === draggedId || edge.targetNodeId === draggedId) continue;
        const result = spliceNodeIntoEdge(PASSE_DIX_SCENE, draggedId, edge);
        const reached = reachableSet(result);
        const orphans = allNodeIds.filter((id) => !reached.has(id));
        if (orphans.length > 0) failures.push({ draggedId, edge, orphans });
      }
    }

    if (failures.length > 0) {
      const msg = failures
        .slice(0, 5)
        .map((f) => `drag ${f.draggedId} → ${f.edge.kind} [${f.edge.srcNodeId} → ${f.edge.targetNodeId}] orphans: ${f.orphans.join(', ')}`)
        .join('\n');
      throw new Error(`${failures.length} orphan-creating combos:\n${msg}`);
    }
    expect(failures).toEqual([]);
  });
});
