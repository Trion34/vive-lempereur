import type { VNScene, DialogueNode } from '@game/types/vnTypes';

export type SpliceEdgeKind = 'next' | 'choice-target' | 'pass' | 'fail' | 'condition';

export interface SpliceTarget {
  kind: SpliceEdgeKind;
  srcNodeId: string;
  srcChoiceIdx?: number;
  srcConditionIdx?: number;
  targetNodeId: string;
}

/**
 * Splice a linear node into an existing edge. Returns a new scene.
 *
 * Step 1: bypass draggedId wherever it's referenced (its predecessors now
 * point to draggedId's old next).
 * Step 2: insert draggedId at the target edge (edge source → draggedId → targetNodeId).
 *
 * If draggedId is the scene's startNode, scene.startNode is updated to the
 * old next — otherwise the old successor becomes unreachable.
 */
export function spliceNodeIntoEdge(
  scene: VNScene,
  draggedId: string,
  edge: SpliceTarget,
): VNScene {
  const s: VNScene = structuredClone(scene);
  const dragged = s.nodes[draggedId];
  if (!dragged) return s;

  const oldNext: string | null =
    typeof dragged.next === 'string' ? dragged.next : null;

  // If we're moving the startNode, hand the start torch to oldNext.
  if (s.startNode === draggedId && oldNext) {
    s.startNode = oldNext;
  }

  // Step 1: bypass draggedId in every predecessor reference.
  for (const [nodeId, node] of Object.entries(s.nodes)) {
    if (nodeId === draggedId) continue;
    if (node.next === draggedId) node.next = oldNext;
    if (node.choices) {
      for (const c of node.choices) {
        if (c.gameCheck) {
          if (c.gameCheck.passNode === draggedId) {
            c.gameCheck.passNode = oldNext ?? c.gameCheck.passNode;
          }
          if (c.gameCheck.failNode === draggedId) {
            c.gameCheck.failNode = oldNext ?? c.gameCheck.failNode;
          }
          c.nextId = c.gameCheck.passNode;
        } else if (c.nextId === draggedId) {
          c.nextId = oldNext ?? c.nextId;
        }
      }
    }
    if (node.gameConditionNext) {
      node.gameConditionNext = node.gameConditionNext
        .map((b) => (b.nextId === draggedId ? { ...b, nextId: oldNext ?? b.nextId } : b))
        .filter((b) => b.nextId !== draggedId);
    }
  }

  // Step 2: insert draggedId at the target edge.
  s.nodes[draggedId].next = edge.targetNodeId;
  const from: DialogueNode | undefined = s.nodes[edge.srcNodeId];
  if (!from) return s;

  switch (edge.kind) {
    case 'next':
      from.next = draggedId;
      break;
    case 'choice-target': {
      const idx = edge.srcChoiceIdx;
      if (idx !== undefined && from.choices?.[idx]) {
        from.choices[idx].nextId = draggedId;
      }
      break;
    }
    case 'pass': {
      const idx = edge.srcChoiceIdx;
      const gc = idx !== undefined ? from.choices?.[idx]?.gameCheck : undefined;
      if (idx !== undefined && gc) {
        gc.passNode = draggedId;
        from.choices![idx].nextId = draggedId; // maintain nextId = passNode invariant
      }
      break;
    }
    case 'fail': {
      const idx = edge.srcChoiceIdx;
      const gc = idx !== undefined ? from.choices?.[idx]?.gameCheck : undefined;
      if (idx !== undefined && gc) {
        gc.failNode = draggedId;
      }
      break;
    }
    case 'condition': {
      const idx = edge.srcConditionIdx;
      if (idx !== undefined && from.gameConditionNext?.[idx]) {
        from.gameConditionNext[idx].nextId = draggedId;
      }
      break;
    }
  }

  return s;
}
