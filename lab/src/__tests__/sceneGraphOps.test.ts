import { describe, it, expect } from 'vitest';
import { disconnectNode, duplicateNode, removeEdge, isEdgeRemovable } from '../utils/sceneGraphOps';
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
    if (n.choices) for (const c of n.choices) {
      q.push(c.nextId);
      if (c.gameCheck) { q.push(c.gameCheck.passNode); q.push(c.gameCheck.failNode); }
    }
    if (n.gameConditionNext) for (const b of n.gameConditionNext) q.push(b.nextId);
  }
  return seen;
}

describe('disconnectNode', () => {
  it('does not mutate the input', () => {
    const before = JSON.stringify(PASSE_DIX_SCENE);
    disconnectNode(PASSE_DIX_SCENE, 'watch_1');
    expect(JSON.stringify(PASSE_DIX_SCENE)).toBe(before);
  });

  it('makes a mid-chain node unreachable while preserving the rest', () => {
    const result = disconnectNode(PASSE_DIX_SCENE, 'watch_1');
    const reached = reachableSet(result);
    expect(reached.has('watch_1')).toBe(false);
    // Watch branch bypasses watch_1 (felix_invite choice 1 now points to watch_2)
    expect(result.nodes.felix_invite.choices![1].nextId).toBe('watch_2');
    // Everything else stays reachable
    const orphans = Object.keys(result.nodes).filter((id) => !reached.has(id) && id !== 'watch_1');
    expect(orphans).toEqual([]);
  });

  it('hands the start torch to oldNext when disconnecting the startNode', () => {
    const result = disconnectNode(PASSE_DIX_SCENE, 'intro_1');
    expect(result.startNode).toBe('intro_2');
    const reached = reachableSet(result);
    const orphans = Object.keys(result.nodes).filter((id) => !reached.has(id) && id !== 'intro_1');
    expect(orphans).toEqual([]);
  });

  it('drops condition branches that point to the disconnected node', () => {
    // join_route has: next: empty_purse, condition: { minSous: 2 → join_sit }.
    // Disconnect join_sit (no linear next→oldNext is dice_roll, so condition gets rewired, not dropped).
    const result = disconnectNode(PASSE_DIX_SCENE, 'join_sit');
    const cond = result.nodes.join_route.gameConditionNext!;
    expect(cond.find((b) => b.nextId === 'join_sit')).toBeUndefined();
    // Rewired to oldNext (dice_roll)
    expect(cond[0].nextId).toBe('dice_roll');
  });
});

describe('duplicateNode', () => {
  it('creates a copy with a new id that is orphaned', () => {
    const result = duplicateNode(PASSE_DIX_SCENE, 'intro_1', 'intro_1_copy');
    expect(result.nodes.intro_1_copy).toBeDefined();
    expect(result.nodes.intro_1_copy.id).toBe('intro_1_copy');
    expect(result.nodes.intro_1_copy.text).toBe(result.nodes.intro_1.text);
    // Original unchanged
    expect(result.nodes.intro_1.id).toBe('intro_1');
    // Copy is an orphan (no incoming references since we only added a new node)
    const reached = reachableSet(result);
    expect(reached.has('intro_1_copy')).toBe(false);
  });

  it('preserves outgoing references (choices, next)', () => {
    const result = duplicateNode(PASSE_DIX_SCENE, 'felix_invite', 'felix_invite_v2');
    expect(result.nodes.felix_invite_v2.choices).toHaveLength(3);
    expect(result.nodes.felix_invite_v2.choices![0].nextId).toBe('join_route');
  });
});

describe('removeEdge', () => {
  it('severs a next edge by setting srcNode.next = null', () => {
    const result = removeEdge(PASSE_DIX_SCENE, {
      kind: 'next',
      srcNodeId: 'intro_2',
      targetNodeId: 'felix_invite',
    });
    expect(result.nodes.intro_2.next).toBeNull();
  });

  it('drops a condition branch', () => {
    const result = removeEdge(PASSE_DIX_SCENE, {
      kind: 'condition',
      srcNodeId: 'join_route',
      srcConditionIdx: 0,
      targetNodeId: 'join_sit',
    });
    expect(result.nodes.join_route.gameConditionNext).toEqual([]);
  });

  it('leaves the scene unchanged for unsupported edge kinds', () => {
    const before = JSON.stringify(PASSE_DIX_SCENE);
    const result = removeEdge(PASSE_DIX_SCENE, {
      kind: 'choice-target',
      srcNodeId: 'felix_invite',
      srcChoiceIdx: 0,
      targetNodeId: 'join_route',
    });
    expect(JSON.stringify(result)).toBe(before);
  });
});

describe('isEdgeRemovable', () => {
  it('returns true only for next and condition', () => {
    expect(isEdgeRemovable({ kind: 'next', srcNodeId: 'a', targetNodeId: 'b' })).toBe(true);
    expect(isEdgeRemovable({ kind: 'condition', srcNodeId: 'a', srcConditionIdx: 0, targetNodeId: 'b' })).toBe(true);
    expect(isEdgeRemovable({ kind: 'choice-target', srcNodeId: 'a', srcChoiceIdx: 0, targetNodeId: 'b' })).toBe(false);
    expect(isEdgeRemovable({ kind: 'pass', srcNodeId: 'a', srcChoiceIdx: 0, targetNodeId: 'b' })).toBe(false);
    expect(isEdgeRemovable({ kind: 'fail', srcNodeId: 'a', srcChoiceIdx: 0, targetNodeId: 'b' })).toBe(false);
  });
});
