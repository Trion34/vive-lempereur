import { describe, it, expect } from 'vitest';
import { PASSE_DIX_SCENE } from '../../data/battles/voltri/vnScenes/passeDix';
import type { DialogueNode, VNChoice } from '../../types/vnTypes';

describe('Passe-Dix VN Scene structure', () => {
  const { nodes, startNode } = PASSE_DIX_SCENE;

  it('has a valid start node', () => {
    expect(nodes[startNode]).toBeDefined();
  });

  it('all node next references resolve', () => {
    for (const [id, node] of Object.entries(nodes)) {
      if (node.next !== null && node.next !== undefined) {
        expect(nodes[node.next], `node "${id}" references missing node "${node.next}"`).toBeDefined();
      }
    }
  });

  it('all choice nextId references resolve', () => {
    for (const [id, node] of Object.entries(nodes)) {
      if (node.choices) {
        for (const choice of node.choices) {
          if (!choice.gameCheck) {
            expect(nodes[choice.nextId], `choice in "${id}" references missing node "${choice.nextId}"`).toBeDefined();
          }
        }
      }
    }
  });

  it('all gameCheck passNode/failNode references resolve', () => {
    for (const [id, node] of Object.entries(nodes)) {
      if (node.choices) {
        for (const choice of node.choices) {
          if (choice.gameCheck) {
            expect(nodes[choice.gameCheck.passNode], `gameCheck in "${id}" references missing passNode "${choice.gameCheck.passNode}"`).toBeDefined();
            expect(nodes[choice.gameCheck.failNode], `gameCheck in "${id}" references missing failNode "${choice.gameCheck.failNode}"`).toBeDefined();
          }
        }
      }
    }
  });

  it('all gameConditionNext references resolve', () => {
    for (const [id, node] of Object.entries(nodes)) {
      if (node.gameConditionNext) {
        for (const branch of node.gameConditionNext) {
          expect(nodes[branch.nextId], `condition branch in "${id}" references missing node "${branch.nextId}"`).toBeDefined();
        }
      }
    }
  });

  it('has no orphaned nodes (all reachable from start)', () => {
    const visited = new Set<string>();
    const queue = [startNode];
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const node = nodes[id];
      if (!node) continue;
      if (node.next) queue.push(node.next);
      if (node.choices) {
        for (const c of node.choices) {
          queue.push(c.nextId);
          if (c.gameCheck) {
            queue.push(c.gameCheck.passNode);
            queue.push(c.gameCheck.failNode);
          }
        }
      }
      if (node.gameConditionNext) {
        for (const b of node.gameConditionNext) queue.push(b.nextId);
      }
    }
    const allIds = Object.keys(nodes);
    const orphans = allIds.filter((id) => !visited.has(id));
    expect(orphans, `orphaned nodes: ${orphans.join(', ')}`).toHaveLength(0);
  });

  it('has terminal nodes (next === null, no choices)', () => {
    const terminals = Object.values(nodes).filter(
      (n) => n.next === null && (!n.choices || n.choices.length === 0),
    );
    expect(terminals.length).toBeGreaterThan(0);
  });

  it('join_route uses gameConditionNext with minSous: 2', () => {
    const route = nodes['join_route'];
    expect(route.gameConditionNext).toBeDefined();
    expect(route.gameConditionNext![0].minSous).toBe(2);
    expect(route.gameConditionNext![0].nextId).toBe('join_sit');
    expect(route.next).toBe('empty_purse');
  });

  it('win path has correct gameEffects', () => {
    const win = nodes['win_2'];
    expect(win.gameEffect).toBeDefined();
    expect(win.gameEffect!.statChanges?.soldierRep).toBe(1);
    expect(win.gameEffect!.moraleChange).toBe(3);
    expect(win.gameEffect!.sousChange).toBe(3);
    expect(win.gameEffect!.npcRelationshipChanges).toEqual([{ npcId: 'felix', delta: 10 }]);
    expect(win.gameEffect!.flagChanges?.gambling_accepted).toBe(true);
  });

  it('lose path has correct gameEffects', () => {
    const lose = nodes['lose_2'];
    expect(lose.gameEffect).toBeDefined();
    expect(lose.gameEffect!.moraleChange).toBe(-1);
    expect(lose.gameEffect!.sousChange).toBe(-2);
    expect(lose.gameEffect!.npcRelationshipChanges).toEqual([{ npcId: 'felix', delta: 5 }]);
    expect(lose.gameEffect!.flagChanges?.gambling_accepted).toBe(true);
  });

  it('empty purse path has morale -1 and no gambling_accepted flag', () => {
    const empty = nodes['empty_purse'];
    expect(empty.gameEffect).toBeDefined();
    expect(empty.gameEffect!.moraleChange).toBe(-1);
    expect(empty.gameEffect!.flagChanges).toBeUndefined();
  });

  it('watch path has correct gameEffects', () => {
    const watch = nodes['watch_2'];
    expect(watch.gameEffect).toBeDefined();
    expect(watch.gameEffect!.moraleChange).toBe(1);
    expect(watch.gameEffect!.npcRelationshipChanges).toEqual([{ npcId: 'felix', delta: 3 }]);
    expect(watch.gameEffect!.flagChanges?.gambling_accepted).toBe(true);
  });

  it('decline path has no gameEffects', () => {
    const decline1 = nodes['decline_1'];
    const declineFelix = nodes['decline_felix'];
    const declineEnd = nodes['decline_end'];
    expect(decline1.gameEffect).toBeUndefined();
    expect(declineFelix.gameEffect).toBeUndefined();
    expect(declineEnd.gameEffect).toBeUndefined();
  });

  it('dice_roll has a gameCheck on its choice', () => {
    const diceRoll = nodes['dice_roll'];
    expect(diceRoll.choices).toHaveLength(1);
    expect(diceRoll.choices![0].gameCheck).toBeDefined();
    expect(diceRoll.choices![0].gameCheck!.passNode).toBe('win_1');
    expect(diceRoll.choices![0].gameCheck!.failNode).toBe('lose_1');
  });

  it('scene metadata is valid', () => {
    expect(PASSE_DIX_SCENE.id).toBe('voltri_passe_dix');
    expect(PASSE_DIX_SCENE.title).toBe('The Passe-Dix Game');
    expect(PASSE_DIX_SCENE.mood).toBe('night_camp');
    expect(PASSE_DIX_SCENE.cast).toContain('felix');
  });
});
