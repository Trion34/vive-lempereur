import {
  BattleState,
  LineActionId,
  MoraleThreshold,
  LogEntry,
  MoraleChange,
} from '../../types';
import { rollStat, clampStat } from '../stats';
import { VOLLEY_DEFS } from './constants';
import { resolveScriptedFire } from './fire';
import { resolveScriptedReturnFire } from './events';
import { rollAutoLoad } from '../morale';

// ============================================================
// RANK ACTION RESULT
// ============================================================

export interface RankActionResult {
  /** Narratives to push to the battle log */
  log: LogEntry[];
  /** Morale changes to accumulate */
  moraleChanges: MoraleChange[];
  /** If true, FIRE step should be skipped this volley (Hold Fire) */
  skipFire?: boolean;
  /** Modifier to enemy line damage this volley */
  enemyDamageModifier?: number;
  /** Modifier to line integrity change this volley */
  integrityModifier?: number;
  /** If true, load is guaranteed success (Double Time) */
  guaranteedLoad?: boolean;
  /** Direct health damage to player */
  healthDamage?: number;
  /** Override accuracy for aimed shot */
  accuracyModifier?: number;
  /** If true, return fire chance is reduced (Refuse Flank) */
  returnFireReduction?: number;
}

// ============================================================
// CORPORAL ACTIONS
// ============================================================

/**
 * Aimed Shot: Enhanced personal musketry.
 * Uses musketry/300 instead of /500 for accuracy bonus.
 * Miss penalty: -2 morale.
 */
export function resolveAimedShot(state: BattleState): RankActionResult {
  const { player } = state;
  const turn = state.turn;
  const def = VOLLEY_DEFS[state.scriptedVolley - 1];
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  // Enhanced accuracy calculation (musketry/300 instead of /500)
  let accuracy = def.fireAccuracyBase;
  accuracy += player.musketry / 300; // Enhanced vs standard /500

  // Morale modifier
  if (player.moraleThreshold === MoraleThreshold.Shaken) accuracy *= 0.85;
  else if (player.moraleThreshold === MoraleThreshold.Wavering) accuracy *= 0.7;
  else if (player.moraleThreshold === MoraleThreshold.Breaking) accuracy *= 0.4;

  accuracy = Math.min(0.9, Math.max(0.05, accuracy));

  const hitRoll = Math.random();
  const hit = hitRoll < accuracy;

  // Perception — always perceived for aimed shot (you're looking)
  const enemyDamage = hit ? 2.5 : 0;

  if (hit) {
    moraleChanges.push({ amount: 5, reason: 'Aimed shot — your man fell', source: 'action' });
    log.push({ turn, text: 'You took aim. Hit. Target down.', type: 'result' });
  } else {
    moraleChanges.push({ amount: -2, reason: 'Aimed and missed — wasted the shot', source: 'action' });
    log.push({ turn, text: 'You took careful aim... and missed.', type: 'result' });
  }

  // Apply enemy damage directly (same as resolveScriptedFire)
  const lineDmg = def.enemyLineDamage;
  state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - enemyDamage);
  state.enemy.lineIntegrity = Math.max(
    0,
    state.enemy.lineIntegrity - (lineDmg + enemyDamage) * 0.7,
  );
  state.player.musketLoaded = false;
  state.volleysFired += 1;

  return { log, moraleChanges };
}

/**
 * Fire with the Volley: Standard auto-resolve.
 * Delegates to existing resolveScriptedFire.
 */
export function resolveFireWithVolley(state: BattleState): RankActionResult {
  const result = resolveScriptedFire(state);
  const def = VOLLEY_DEFS[state.scriptedVolley - 1];

  // Apply enemy damage (same as autoVolley)
  const lineDmg = def.enemyLineDamage;
  state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - result.enemyDamage);
  state.enemy.lineIntegrity = Math.max(
    0,
    state.enemy.lineIntegrity - (lineDmg + result.enemyDamage) * 0.7,
  );
  state.player.musketLoaded = false;
  state.volleysFired += 1;

  return { log: result.log, moraleChanges: result.moraleChanges };
}

/**
 * Steady Your File: Charisma roll to boost neighbour morale.
 * Success: +5 morale to left & right neighbours.
 * Fail: no effect. Costs 5 stamina.
 */
export function resolveSteadyYourFile(state: BattleState): RankActionResult {
  const { player } = state;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  // Stamina cost
  state.player.stamina = Math.max(0, state.player.stamina - 5);

  const check = rollStat(player.charisma);

  if (check.success) {
    // Boost neighbours
    for (const n of [state.line.leftNeighbour, state.line.rightNeighbour]) {
      if (n && n.alive && !n.routing) {
        n.morale = Math.min(n.maxMorale, n.morale + 5);
      }
    }
    moraleChanges.push({ amount: 2, reason: 'Steadied your file', source: 'action' });
    log.push({ turn, text: '"Steady, lads!" Your neighbours take heart.', type: 'action' });
  } else {
    log.push({ turn, text: 'You try to steady the men beside you. No one hears.', type: 'action' });
  }

  return { log, moraleChanges };
}

/**
 * Keep Your Head Down: Standard endure (no-op, auto-resolve proceeds normally).
 */
export function resolveKeepHeadDown(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  log.push({ turn: state.turn, text: 'You keep your head down and endure.', type: 'action' });
  return { log, moraleChanges: [] };
}

// ============================================================
// SERGEANT ACTIONS
// ============================================================

/**
 * Concentrate Fire: +30% enemy line damage this volley, -2 line integrity.
 * Sets a modifier consumed during fire resolution.
 */
export function resolveConcentrateFire(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn: state.turn,
    text: '"Concentrate! Same point — FIRE!" The section aims together.',
    type: 'order',
  });

  return { log, moraleChanges, enemyDamageModifier: 0.3, integrityModifier: -2 };
}

/**
 * Spread Fire: Standard fire across the enemy line (no-op modifier).
 */
export function resolveSpreadFire(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  log.push({ turn: state.turn, text: '"As you bear — FIRE!"', type: 'order' });
  return { log, moraleChanges: [] };
}

/**
 * Hold Fire: Skip FIRE step, store bonus for next volley.
 * +50% damage and +0.15 accuracy on the next volley.
 */
export function resolveHoldFire(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.rankState.heldVolleyBonus = true;

  log.push({
    turn: state.turn,
    text: '"Hold your fire! HOLD!" The men grip their muskets, waiting.',
    type: 'order',
  });
  moraleChanges.push({ amount: -2, reason: 'Holding fire under enemy advance', source: 'action' });

  return { log, moraleChanges, skipFire: true };
}

/**
 * Close Ranks: Halve line integrity loss this volley.
 * Costs 8 stamina.
 */
export function resolveCloseRanks(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.player.stamina = Math.max(0, state.player.stamina - 8);

  log.push({
    turn: state.turn,
    text: '"Close up! Fill the gaps!" The line tightens.',
    type: 'order',
  });
  moraleChanges.push({ amount: 1, reason: 'Line closes ranks', source: 'action' });

  return { log, moraleChanges, integrityModifier: 0.5 }; // 0.5 = halve integrity loss
}

/**
 * Double Time: Guaranteed load success, costs 6 stamina + 2 morale.
 */
export function resolveDoubleTime(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.player.stamina = Math.max(0, state.player.stamina - 6);
  moraleChanges.push({ amount: -2, reason: 'Double time — pushing exhausted men', source: 'action' });

  log.push({
    turn: state.turn,
    text: '"Faster! Double time!" The section reloads at pace.',
    type: 'order',
  });

  return { log, moraleChanges, guaranteedLoad: true };
}

// ============================================================
// LIEUTENANT ACTIONS
// ============================================================

/**
 * Advance: Shift effective range closer by one VOLLEY_DEFS increment.
 * Better accuracy, more return fire. Costs 10 stamina.
 */
export function resolveAdvance(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.player.stamina = Math.max(0, state.player.stamina - 10);
  state.rankState.rangeModifier = -40; // One increment closer (e.g. 120→80)

  log.push({
    turn: state.turn,
    text: '"Forward! Close the distance!" The line steps forward.',
    type: 'order',
  });
  moraleChanges.push({ amount: 1, reason: 'Advancing — taking the fight to them', source: 'action' });

  return { log, moraleChanges };
}

/**
 * Hold Position: Standard range (reset modifier).
 */
export function resolveHoldPosition(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  state.rankState.rangeModifier = 0;
  log.push({ turn: state.turn, text: '"Hold position! Steady!"', type: 'order' });
  return { log, moraleChanges: [] };
}

/**
 * Fall Back: Shift effective range farther by one increment.
 * Less return fire, weaker volley. Costs 5 stamina.
 */
export function resolveFallBack(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.player.stamina = Math.max(0, state.player.stamina - 5);
  state.rankState.rangeModifier = 40; // One increment farther

  log.push({
    turn: state.turn,
    text: '"Fall back! Open the distance!" The line gives ground.',
    type: 'order',
  });
  moraleChanges.push({ amount: -1, reason: 'Falling back', source: 'action' });

  return { log, moraleChanges };
}

/**
 * Refuse the Flank: -15% return fire for 2 volleys. One use per battle part.
 */
export function resolveRefuseFlank(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.rankState.refuseFlankTurns = 2;
  state.rankState.refuseFlankUsed = true;

  log.push({
    turn: state.turn,
    text: '"Refuse the flank! Wheel right!" The exposed side angles back.',
    type: 'order',
  });
  moraleChanges.push({ amount: 2, reason: 'Flank secured', source: 'action' });

  return { log, moraleChanges, returnFireReduction: 0.15 };
}

// ============================================================
// CAPTAIN ACTIONS
// ============================================================

/**
 * Hold... Hold... Fire!: Delay fire for accuracy/damage bonus.
 * Each hold: +0.10 accuracy, +20% enemyLineDamage.
 * Enemy gets a free return fire roll per hold. Max 2 holds.
 */
export function resolveHoldHoldFire(state: BattleState): RankActionResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  const volleyIdx = state.scriptedVolley - 1;

  state.rankState.holdCount = Math.min(2, state.rankState.holdCount + 1);

  log.push({
    turn,
    text: `"HOLD..." The enemy closes. Your men grip their muskets.`,
    type: 'order',
  });

  // Free return fire during hold
  const returnFire = resolveScriptedReturnFire(state, volleyIdx);
  if (returnFire.healthDamage > 0) {
    state.player.health = Math.max(0, state.player.health - returnFire.healthDamage);
  }
  moraleChanges.push(...returnFire.moraleChanges);
  log.push(...returnFire.log);

  moraleChanges.push({
    amount: -3,
    reason: 'Holding fire while enemy advances',
    source: 'action',
  });

  return {
    log,
    moraleChanges,
    healthDamage: returnFire.healthDamage,
    accuracyModifier: state.rankState.holdCount * 0.10,
    enemyDamageModifier: state.rankState.holdCount * 0.20,
  };
}

/**
 * Fire by Rank: Two half-strength volleys (front rank, then rear).
 */
export function resolveFireByRank(state: BattleState): RankActionResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn,
    text: '"Front rank — FIRE!" A half-volley crashes out. "Rear rank — FIRE!" The second follows.',
    type: 'order',
  });

  // Two half-volleys (total damage similar to standard, but split)
  const result1 = resolveScriptedFire(state);
  // Reload between shots not needed narratively
  state.player.musketLoaded = true; // temporarily for second shot
  const result2 = resolveScriptedFire(state);

  const def = VOLLEY_DEFS[state.scriptedVolley - 1];
  const lineDmg = def.enemyLineDamage;
  // Each half-volley does 50% of line damage + personal damage
  const totalEnemy = result1.enemyDamage * 0.5 + result2.enemyDamage * 0.5;
  state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - totalEnemy);
  state.enemy.lineIntegrity = Math.max(
    0,
    state.enemy.lineIntegrity - (lineDmg + totalEnemy) * 0.7,
  );
  state.player.musketLoaded = false;
  state.volleysFired += 1;

  moraleChanges.push(...result1.moraleChanges, ...result2.moraleChanges);
  log.push(...result1.log, ...result2.log);

  return { log, moraleChanges };
}

/**
 * Fire at Will: Higher total damage, but -5 line integrity from disorder.
 */
export function resolveFireAtWill(state: BattleState): RankActionResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn,
    text: '"Fire at will!" The discipline breaks — but the weight of fire is devastating.',
    type: 'order',
  });

  // Standard fire but with 30% bonus damage
  const result = resolveScriptedFire(state);
  const def = VOLLEY_DEFS[state.scriptedVolley - 1];
  const lineDmg = def.enemyLineDamage * 1.3;
  state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - result.enemyDamage);
  state.enemy.lineIntegrity = Math.max(
    0,
    state.enemy.lineIntegrity - (lineDmg + result.enemyDamage) * 0.7,
  );
  state.player.musketLoaded = false;
  state.volleysFired += 1;

  // Integrity penalty from disorder
  state.line.lineIntegrity = clampStat(state.line.lineIntegrity - 5);

  moraleChanges.push(...result.moraleChanges);
  log.push(...result.log);

  return { log, moraleChanges, integrityModifier: -5 };
}

/**
 * Standard Volley: Current behaviour (delegates to FireWithVolley).
 */
export function resolveStandardVolley(state: BattleState): RankActionResult {
  return resolveFireWithVolley(state);
}

/**
 * Order the Drums: Drums on. +5 integrity roll, +2 morale recovery.
 */
export function resolveOrderDrums(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  state.line.drumsPlaying = true;
  log.push({
    turn: state.turn,
    text: '"Drums up!" The drummers beat the pas de charge.',
    type: 'order',
  });
  return { log, moraleChanges: [{ amount: 2, reason: 'Drums beating', source: 'action' }] };
}

/**
 * Silence the Drums: Drums off. Protect the drummers.
 */
export function resolveSilenceDrums(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  state.line.drumsPlaying = false;
  log.push({
    turn: state.turn,
    text: '"Drums down! Get the boys behind the line."',
    type: 'order',
  });
  return { log, moraleChanges: [] };
}

/**
 * Fix Bayonets Early: Prepare for melee. Bonus to first melee round.
 */
export function resolveFixBayonetsEarly(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.rankState.fixedBayonetsEarly = true;

  log.push({
    turn: state.turn,
    text: '"Fix... bayonets!" The steel clicks onto the muzzles. The men know what it means.',
    type: 'order',
  });
  moraleChanges.push({ amount: 3, reason: 'Bayonets fixed — ready for the charge', source: 'action' });

  return { log, moraleChanges };
}

/**
 * Request Support: Call on adjacent unit. Small integrity boost. 3-volley cooldown.
 */
export function resolveRequestSupport(state: BattleState): RankActionResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  state.rankState.requestSupportCooldown = 3;
  state.line.lineIntegrity = clampStat(state.line.lineIntegrity + 5);

  log.push({
    turn: state.turn,
    text: '"Send to the 32nd — we need support on the right!" A runner goes.',
    type: 'order',
  });
  moraleChanges.push({ amount: 2, reason: 'Support requested', source: 'action' });

  return { log, moraleChanges };
}

// ============================================================
// DISPATCHER — resolve any LineActionId
// ============================================================

export function resolveLineAction(
  state: BattleState,
  actionId: LineActionId,
): RankActionResult {
  switch (actionId) {
    // Corporal
    case LineActionId.AimedShot: return resolveAimedShot(state);
    case LineActionId.FireWithVolley: return resolveFireWithVolley(state);
    case LineActionId.SteadyYourFile: return resolveSteadyYourFile(state);
    case LineActionId.KeepHeadDown: return resolveKeepHeadDown(state);
    // Sergeant
    case LineActionId.ConcentrateFire: return resolveConcentrateFire(state);
    case LineActionId.SpreadFire: return resolveSpreadFire(state);
    case LineActionId.HoldFire: return resolveHoldFire(state);
    case LineActionId.CloseRanks: return resolveCloseRanks(state);
    case LineActionId.DoubleTime: return resolveDoubleTime(state);
    // Lieutenant
    case LineActionId.Advance: return resolveAdvance(state);
    case LineActionId.HoldPosition: return resolveHoldPosition(state);
    case LineActionId.FallBack: return resolveFallBack(state);
    case LineActionId.RefuseFlank: return resolveRefuseFlank(state);
    // Captain
    case LineActionId.HoldHoldFire: return resolveHoldHoldFire(state);
    case LineActionId.FireByRank: return resolveFireByRank(state);
    case LineActionId.FireAtWill: return resolveFireAtWill(state);
    case LineActionId.StandardVolley: return resolveStandardVolley(state);
    case LineActionId.OrderDrums: return resolveOrderDrums(state);
    case LineActionId.SilenceDrums: return resolveSilenceDrums(state);
    case LineActionId.FixBayonetsEarly: return resolveFixBayonetsEarly(state);
    case LineActionId.RequestSupport: return resolveRequestSupport(state);
  }
}
