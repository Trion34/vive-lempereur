/**
 * VN Scene Interpreter — pure logic for game-aware VN scenes.
 * No React, no side effects — fully testable.
 */

import type { PlayerCharacter, NPC, NumericStatKey } from '../types';
import type { VNChoice, VNGameEffect, VNConditionBranch, DialogueNode } from '../types/vnTypes';
import { hasAttribute } from '../types/player';
import { rollStat, displayRoll, displayTarget, getPlayerStat, adjustPlayerStat } from './stats';

// === Types ===

export interface VNGameContext {
  player: PlayerCharacter;
  npcs: NPC[];
  campFlags: Record<string, boolean>;
}

export interface VNRollDisplay {
  stat: string;
  roll: number;
  target: number;
  passed: boolean;
  autoSuccess?: boolean;
}

export interface VNSceneResult {
  statChanges: Partial<Record<NumericStatKey, number>>;
  moraleChange: number;
  staminaChange: number;
  healthChange: number;
  sousChange: number;
  virtueChange: number;
  npcChanges: { npcId: string; relationship: number }[];
  flagChanges: Record<string, boolean>;
  rollDisplays: VNRollDisplay[];
}

// === Factory ===

export function createEmptyResult(): VNSceneResult {
  return {
    statChanges: {},
    moraleChange: 0,
    staminaChange: 0,
    healthChange: 0,
    sousChange: 0,
    virtueChange: 0,
    npcChanges: [],
    flagChanges: {},
    rollDisplays: [],
  };
}

// === Effect Accumulation ===

export function accumulateEffect(result: VNSceneResult, effect: VNGameEffect): VNSceneResult {
  const out = { ...result };

  // Stat changes: additive merge
  if (effect.statChanges) {
    out.statChanges = { ...result.statChanges };
    for (const [stat, delta] of Object.entries(effect.statChanges)) {
      const key = stat as NumericStatKey;
      out.statChanges[key] = (out.statChanges[key] ?? 0) + (delta ?? 0);
    }
  }

  // Meters: additive
  out.moraleChange = result.moraleChange + (effect.moraleChange ?? 0);
  out.staminaChange = result.staminaChange + (effect.staminaChange ?? 0);
  out.healthChange = result.healthChange + (effect.healthChange ?? 0);
  out.sousChange = result.sousChange + (effect.sousChange ?? 0);
  out.virtueChange = result.virtueChange + (effect.virtueChange ?? 0);

  // NPC changes: accumulate per NPC
  if (effect.npcRelationshipChanges) {
    const npcMap = new Map<string, number>();
    for (const c of result.npcChanges) npcMap.set(c.npcId, (npcMap.get(c.npcId) ?? 0) + c.relationship);
    for (const c of effect.npcRelationshipChanges) npcMap.set(c.npcId, (npcMap.get(c.npcId) ?? 0) + c.delta);
    out.npcChanges = Array.from(npcMap.entries()).map(([npcId, relationship]) => ({ npcId, relationship }));
  }

  // Flags: later values override
  if (effect.flagChanges) {
    out.flagChanges = { ...result.flagChanges, ...effect.flagChanges };
  }

  return out;
}

/** Recompute accumulated effects by replaying visited nodes.
 *  Caller should pass [...history, currentNodeId] to include the current node. */
export function recomputeEffects(visitedNodeIds: string[], nodes: Record<string, DialogueNode>): VNSceneResult {
  let result = createEmptyResult();
  for (const nodeId of visitedNodeIds) {
    const node = nodes[nodeId];
    if (node?.gameEffect) {
      result = accumulateEffect(result, node.gameEffect);
    }
  }
  return result;
}

// === Effective Context ===

/** Overlay accumulated effects onto base game state for mid-scene evaluation.
 *  Does NOT mutate base — returns a new object. */
export function buildEffectiveContext(base: VNGameContext, accumulated: VNSceneResult): VNGameContext {
  // Clone player with overlaid stats/meters/sous
  const player = { ...base.player };

  // Overlay stat changes
  for (const [stat, delta] of Object.entries(accumulated.statChanges)) {
    adjustPlayerStat(player, stat, delta ?? 0);
  }

  // Overlay meters
  player.morale = player.morale + accumulated.moraleChange;
  player.stamina = player.stamina + accumulated.staminaChange;
  player.health = player.health + accumulated.healthChange;
  player.sous = player.sous + accumulated.sousChange;
  player.virtue = player.virtue + accumulated.virtueChange;

  // Overlay NPC relationship deltas
  const npcs = base.npcs.map((npc) => {
    const change = accumulated.npcChanges.find((c) => c.npcId === npc.id);
    if (!change) return npc;
    return { ...npc, relationship: npc.relationship + change.relationship };
  });

  // Overlay flags
  const campFlags = { ...base.campFlags, ...accumulated.flagChanges };

  return { player, npcs, campFlags };
}

// === Choice Lock Evaluation ===

export function evaluateChoiceLock(
  choice: VNChoice,
  context: VNGameContext,
): { locked: boolean; message?: string } {
  const lock = choice.gameLock;
  if (!lock) return { locked: false };

  if (lock.requireAttribute && !hasAttribute(context.player, lock.requireAttribute)) {
    return { locked: true, message: lock.lockedMessage };
  }
  if (lock.requireSous !== undefined && context.player.sous < lock.requireSous) {
    return { locked: true, message: lock.lockedMessage };
  }
  if (lock.requireFlag && !context.campFlags[lock.requireFlag]) {
    return { locked: true, message: lock.lockedMessage };
  }

  return { locked: false };
}

// === Condition Branch Evaluation ===

/** Evaluate condition branches against game state. First match wins, returns null if none match. */
export function evaluateConditionBranches(
  branches: VNConditionBranch[],
  context: VNGameContext,
): string | null {
  for (const branch of branches) {
    let matches = true;

    if (branch.flag && !context.campFlags[branch.flag]) matches = false;
    if (branch.minStat) {
      const val = getPlayerStat(context.player, branch.minStat.stat);
      if (val < branch.minStat.value) matches = false;
    }
    if (branch.minSous !== undefined && context.player.sous < branch.minSous) matches = false;

    if (matches) return branch.nextId;
  }
  return null;
}

// === Stat Check Execution ===

export function executeStatCheck(
  check: { stat: NumericStatKey; difficulty: number; passNode: string; failNode: string },
  context: VNGameContext,
): { passed: boolean; nextNode: string; rollDisplay: VNRollDisplay } {
  const statVal = getPlayerStat(context.player, check.stat) || 30;
  const result = rollStat(statVal, 0, check.difficulty);
  const passed = result.success;
  return {
    passed,
    nextNode: passed ? check.passNode : check.failNode,
    rollDisplay: {
      stat: check.stat.charAt(0).toUpperCase() + check.stat.slice(1),
      roll: displayRoll(result.roll),
      target: displayTarget(result.target),
      passed,
      autoSuccess: result.autoSuccess,
    },
  };
}
