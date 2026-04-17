import type { VNScene, DialogueNode } from '@game/types/vnTypes';
import type { SpliceTarget } from './spliceNodeIntoEdge';

/**
 * Remove every incoming reference to nodeId. The node itself stays in the scene
 * but becomes unreachable from startNode. Predecessors are rewired to bypass
 * the node where possible (linear next → node.next, gameCheck/choice → oldNext
 * if available) and condition branches that point to it are dropped.
 *
 * When a choice or gameCheck reference can't resolve cleanly (the disconnected
 * node had no linear next), a fresh stub end node is created as the fallback
 * target — the choice/gameCheck always needs a valid target.
 *
 * If nodeId is the scene's startNode, the start torch is passed to its old
 * next so the scene remains traversable.
 */
export function disconnectNode(scene: VNScene, nodeId: string): VNScene {
  const s: VNScene = structuredClone(scene);
  const target = s.nodes[nodeId];
  if (!target) return s;
  const oldNext: string | null =
    typeof target.next === 'string' ? target.next : null;

  if (s.startNode === nodeId && oldNext) {
    s.startNode = oldNext;
  }

  // Lazy stub: only create once, and only if something actually needs it.
  let stubId: string | null = null;
  const getStubId = (): string => {
    if (stubId) return stubId;
    const newId = `end_${Math.random().toString(36).slice(2, 8)}`;
    s.nodes[newId] = { id: newId, speaker: 'narrator', text: '', next: null };
    stubId = newId;
    return newId;
  };
  const resolveTarget = (): string => oldNext ?? getStubId();

  for (const [id, node] of Object.entries(s.nodes)) {
    if (id === nodeId) continue;
    if (node.next === nodeId) node.next = oldNext;
    if (node.choices) {
      for (const c of node.choices) {
        if (c.gameCheck) {
          if (c.gameCheck.passNode === nodeId) {
            c.gameCheck.passNode = resolveTarget();
          }
          if (c.gameCheck.failNode === nodeId) {
            c.gameCheck.failNode = resolveTarget();
          }
          c.nextId = c.gameCheck.passNode;
        } else if (c.nextId === nodeId) {
          c.nextId = resolveTarget();
        }
      }
    }
    if (node.gameConditionNext) {
      node.gameConditionNext = node.gameConditionNext
        .map((b) => (b.nextId === nodeId ? { ...b, nextId: oldNext ?? b.nextId } : b))
        .filter((b) => b.nextId !== nodeId);
    }
  }

  return s;
}

/**
 * Copy a node under a new id. The clone has no incoming references — it's an
 * orphan by design, ready to be wired into a new position. Outgoing refs
 * (next, choices, conditions) are preserved.
 */
export function duplicateNode(
  scene: VNScene,
  nodeId: string,
  newId: string,
): VNScene {
  const s: VNScene = structuredClone(scene);
  const src = s.nodes[nodeId];
  if (!src) return s;
  const clone: DialogueNode = { ...structuredClone(src), id: newId };
  s.nodes[newId] = clone;
  return s;
}

/**
 * Remove a single edge. Only 'next' and 'condition' edges are removable without
 * inventing stub nodes — choice/gameCheck edges require a target. Returns the
 * scene unchanged for unsupported edge kinds.
 */
export function removeEdge(scene: VNScene, edge: SpliceTarget): VNScene {
  const s: VNScene = structuredClone(scene);
  const from = s.nodes[edge.srcNodeId];
  if (!from) return s;

  if (edge.kind === 'next') {
    from.next = null;
  } else if (edge.kind === 'condition' && edge.srcConditionIdx !== undefined && from.gameConditionNext) {
    from.gameConditionNext = from.gameConditionNext.filter(
      (_, i) => i !== edge.srcConditionIdx,
    );
  }

  return s;
}

/** Edge kinds whose targets can be safely severed without invalid state. */
export function isEdgeRemovable(edge: SpliceTarget): boolean {
  return edge.kind === 'next' || edge.kind === 'condition';
}
