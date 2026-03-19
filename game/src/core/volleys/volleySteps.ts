/**
 * Per-step volley resolution for rank-based agency.
 *
 * When the player has rank > Private, the auto-play loop calls these
 * per-step functions instead of the monolithic resolveAutoVolley().
 * Between steps, the loop can pause for player input when rank actions
 * are available.
 *
 * Each step function mutates BattleState in-place and returns narratives
 * + morale changes, matching resolveAutoVolley's behavior.
 */

import {
  BattleState,
  DrillStep,
  MoraleThreshold,
  LogEntry,
  MoraleChange,
  getHealthState,
  getMoraleThreshold,
} from '../../types';
import type { VolleyConfig } from '../../data/battles/types';
import { clampStat, rollD100 } from '../stats';
import { rollGraduatedValor, applyMoraleChanges, rollAutoLoad, updateLineMorale } from '../morale';
import { resolveScriptedFire } from './fire';
import { resolveScriptedEvents, resolveScriptedReturnFire } from './events';
import { getVolleyNarrative } from './narrative';

// ============================================================
// STEP RESULT (shared return type for all step functions)
// ============================================================

export interface StepResult {
  narratives: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDamage: number;
}

// ============================================================
// PRESENT STEP
// ============================================================

/**
 * Resolve the PRESENT step: push volley narrative.
 * If rank actions were chosen (concentrate/spread/hold/advance/etc.),
 * their results should be applied before calling this.
 */
export function resolvePresent(state: BattleState, volleyIdx: number, volleys: VolleyConfig[]): StepResult {
  const turn = state.turn;
  const narratives: LogEntry[] = [];
  const def = volleys[volleyIdx].def;

  // Lock enemy range (with lieutenant modifier)
  const effectiveRange = Math.max(25, def.range + (state.rankState.rangeModifier || 0));
  state.enemy.range = effectiveRange;

  const presentNarrative = getVolleyNarrative(volleyIdx, DrillStep.Present, state, volleys);
  if (presentNarrative) {
    narratives.push({ turn, text: presentNarrative, type: 'narrative' });
  }

  return { narratives, moraleChanges: [], healthDamage: 0 };
}

// ============================================================
// FIRE STEP
// ============================================================

/**
 * Resolve the FIRE step: fire resolution + scripted events.
 * If rank actions handled fire (AimedShot, FireByRank, etc.),
 * skip the standard fire resolution — pass `skipStandardFire: true`.
 *
 * @param options.skipStandardFire - If true, don't call resolveScriptedFire
 * @param options.enemyDamageModifier - Multiplier bonus to enemy line damage (e.g. 0.3 for +30%)
 * @param options.accuracyModifier - Bonus to accuracy (from held volley or captain hold)
 */
export function resolveFire(
  state: BattleState,
  volleyIdx: number,
  options: {
    skipStandardFire?: boolean;
    enemyDamageModifier?: number;
    accuracyModifier?: number;
  } | undefined,
  volleys: VolleyConfig[],
): StepResult {
  const turn = state.turn;
  const narratives: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  const def = volleys[volleyIdx].def;

  // Fire narrative
  const fireOrder = getVolleyNarrative(volleyIdx, DrillStep.Fire, state, volleys);
  if (fireOrder) {
    narratives.push({ turn, text: fireOrder, type: 'narrative' });
  }

  if (!options?.skipStandardFire) {
    // Standard fire resolution
    const fireResult = resolveScriptedFire(state, volleys);
    moraleChanges.push(...fireResult.moraleChanges);
    narratives.push(...fireResult.log);
    state.player.musketLoaded = false;
    state.volleysFired += 1;

    // Enemy damage (with held volley bonus and concentrate fire modifier)
    let lineDmgMultiplier = 1.0;
    if (state.rankState.heldVolleyBonus) {
      lineDmgMultiplier += 0.5;
      state.rankState.heldVolleyBonus = false;
    }
    if (options?.enemyDamageModifier) {
      lineDmgMultiplier += options.enemyDamageModifier;
    }

    const lineDmg = def.enemyLineDamage * lineDmgMultiplier;
    state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - fireResult.enemyDamage);
    state.enemy.lineIntegrity = Math.max(
      0,
      state.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7,
    );
  }

  // Scripted events (FIRE step)
  const fireEvents = resolveScriptedEvents(state, DrillStep.Fire, volleys);
  narratives.push(...fireEvents.log);
  moraleChanges.push(...fireEvents.moraleChanges);

  return { narratives, moraleChanges, healthDamage: 0 };
}

// ============================================================
// VALOR ROLL (always automatic)
// ============================================================

export function resolveValor(state: BattleState): StepResult & { valorRoll: ReturnType<typeof rollGraduatedValor> } {
  const turn = state.turn;
  const narratives: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDamage = 0;

  const difficultyMod = (state.line.lineIntegrity - 100) * 0.3;
  const valorRoll = rollGraduatedValor(state.player.valor, difficultyMod);
  moraleChanges.push({ amount: valorRoll.moraleChange, reason: 'Valor check', source: 'action' });
  narratives.push({ turn, text: valorRoll.narrative, type: 'event' });

  // Critical fail: 20% chance of minor wound
  if (valorRoll.outcome === 'critical_fail' && Math.random() < 0.2) {
    const woundDmg = 5 + Math.floor(Math.random() * 5);
    healthDamage += woundDmg;
    state.player.health = Math.max(0, state.player.health - woundDmg);
    state.player.healthState = getHealthState(state.player.health, state.player.maxHealth);
    narratives.push({ turn, text: 'Stumbled. Minor wound.', type: 'event' });
  }

  return { narratives, moraleChanges, healthDamage, valorRoll };
}

// ============================================================
// ENDURE STEP
// ============================================================

/**
 * Resolve the ENDURE step: scripted events + return fire.
 * If rank actions handled endure (SteadyYourFile, CloseRanks, RefuseFlank),
 * their results should be applied before or after this.
 *
 * @param options.returnFireReduction - Reduce return fire chance (e.g. 0.15 for Refuse Flank)
 */
export function resolveEndure(
  state: BattleState,
  volleyIdx: number,
  options: {
    returnFireReduction?: number;
  } | undefined,
  volleys: VolleyConfig[],
): StepResult {
  const turn = state.turn;
  const narratives: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDamage = 0;

  // Scripted events (ENDURE step)
  const endureEvents = resolveScriptedEvents(state, DrillStep.Endure, volleys);
  narratives.push(...endureEvents.log);
  moraleChanges.push(...endureEvents.moraleChanges);

  // ENDURE narrative
  const endureNarrative = getVolleyNarrative(volleyIdx, DrillStep.Endure, state, volleys);
  if (endureNarrative) {
    narratives.push({ turn, text: endureNarrative, type: 'narrative' });
  }

  // Return fire (with refuse flank reduction)
  const returnFire = resolveScriptedReturnFire(state, volleyIdx, volleys);

  // Apply refuse flank turn reduction
  const reduction = options?.returnFireReduction ?? 0;
  const refuseFlankReduction = state.rankState.refuseFlankTurns > 0 ? 0.15 : 0;
  const totalReduction = Math.min(0.5, reduction + refuseFlankReduction);

  if (totalReduction > 0 && returnFire.healthDamage > 0) {
    // Reduce damage by percentage
    const reducedDamage = Math.round(returnFire.healthDamage * (1 - totalReduction));
    healthDamage += reducedDamage;
    state.player.health = Math.max(0, state.player.health - reducedDamage);
  } else if (returnFire.healthDamage > 0) {
    healthDamage += returnFire.healthDamage;
    state.player.health = Math.max(0, state.player.health - returnFire.healthDamage);
  }
  state.player.healthState = getHealthState(state.player.health, state.player.maxHealth);

  moraleChanges.push(...returnFire.moraleChanges);
  narratives.push(...returnFire.log);

  // Tick refuse flank turns
  if (state.rankState.refuseFlankTurns > 0) {
    state.rankState.refuseFlankTurns -= 1;
  }

  // Tick request support cooldown
  if (state.rankState.requestSupportCooldown > 0) {
    state.rankState.requestSupportCooldown -= 1;
  }

  // Reset hold count (captain)
  state.rankState.holdCount = 0;

  return { narratives, moraleChanges, healthDamage };
}

// ============================================================
// LINE INTEGRITY ROLL (always automatic)
// ============================================================

export function resolveLineIntegrity(
  state: BattleState,
  volleyIdx: number,
  options: {
    integrityModifier?: number; // Multiplier for integrity loss (0.5 = halve) or flat add
  } | undefined,
  volleys: VolleyConfig[],
): StepResult & { integrityChange: number } {
  const def = volleys[volleyIdx].def;
  const narratives: LogEntry[] = [];
  const turn = state.turn;

  // French roll
  const officerBonus = state.line.officer.alive ? 10 : 0;
  // Lieutenant Officer's Presence: if captain down and player is Lieutenant+
  const officerPresenceBonus = (!state.line.officer.alive && state.playerRank === 'lieutenant' || state.playerRank === 'captain')
    ? 10 + state.player.charisma / 50
    : 0;
  const drumsBonus = state.line.drumsPlaying ? 5 : 0;
  const frenchBase = state.line.lineIntegrity * 0.6 + officerBonus + officerPresenceBonus + drumsBonus;
  const frenchRoll = rollD100();

  // Austrian roll
  const rangePressure = Math.max(0, (200 - def.range) / 4);
  const austrianBase = state.enemy.strength * 0.5 + rangePressure;
  const austrianRoll = rollD100();

  const frenchTotal = frenchBase + (frenchRoll / 100) * 20;
  const austrianTotal = austrianBase + (austrianRoll / 100) * 20;

  let integrityChange = 0;
  let enemyExtraDamage = 0;
  let narrative: string;

  if (frenchTotal >= austrianTotal) {
    enemyExtraDamage = 2 + Math.floor(Math.random() * 3);
    narrative = 'Line holds.';
  } else {
    integrityChange = -(3 + Math.floor(Math.random() * 4));

    // Apply integrity modifier (e.g. CloseRanks halves loss)
    if (options?.integrityModifier && options.integrityModifier > 0 && options.integrityModifier < 1) {
      integrityChange = Math.round(integrityChange * options.integrityModifier);
    }

    narrative = 'Line wavers. Gaps open.';
  }

  state.line.lineIntegrity = clampStat(state.line.lineIntegrity + integrityChange);
  if (enemyExtraDamage > 0) {
    state.enemy.strength = Math.max(0, state.enemy.strength - enemyExtraDamage);
    state.enemy.lineIntegrity = Math.max(0, state.enemy.lineIntegrity - enemyExtraDamage * 0.7);
  }
  narratives.push({ turn, text: narrative, type: 'event' });

  return { narratives, moraleChanges: [], healthDamage: 0, integrityChange };
}

// ============================================================
// APPLY MORALE (always automatic)
// ============================================================

export function applyVolleyMorale(
  state: BattleState,
  volleyIdx: number,
  moraleChanges: MoraleChange[],
  volleys: VolleyConfig[],
): StepResult & { moraleTotal: number } {
  const def = volleys[volleyIdx].def;
  const turn = state.turn;
  const narratives: LogEntry[] = [];

  // Apply morale
  const { newMorale, threshold } = applyMoraleChanges(
    state.player.morale,
    state.player.maxMorale,
    moraleChanges,
    state.player.valor,
  );
  state.player.morale = newMorale;
  state.player.moraleThreshold = threshold;

  // Neighbour morale update
  for (const n of [state.line.leftNeighbour, state.line.rightNeighbour]) {
    if (!n?.alive || n.routing) continue;
    let drain = -1;
    if (def.range < 100) drain = -2;
    if (state.enemy.artillery) drain -= 1;
    if (state.player.moraleThreshold === MoraleThreshold.Steady) drain += 2;
    else if (state.player.moraleThreshold === MoraleThreshold.Wavering) drain -= 1;
    else if (state.player.moraleThreshold === MoraleThreshold.Breaking) drain -= 2;
    n.morale = Math.max(0, Math.min(n.maxMorale, n.morale + drain));
    n.threshold = getMoraleThreshold(n.morale, n.maxMorale);
  }

  updateLineMorale(state);

  // Stamina cost
  const isPartTwo = volleyIdx >= 4 && volleyIdx <= 6;
  const staminaCost = isPartTwo ? 14 : 12;
  const staminaRecovery = 4;
  state.player.stamina = Math.max(0, state.player.stamina - staminaCost);
  state.player.stamina = Math.min(state.player.maxStamina, state.player.stamina + staminaRecovery);

  // Morale summary
  const total = moraleChanges.reduce((sum, c) => sum + c.amount, 0);
  if (Math.round(total) !== 0) {
    narratives.push({
      turn,
      text: `Morale ${total > 0 ? 'recovered' : 'lost'}: ${total > 0 ? '+' : ''}${Math.round(total)}`,
      type: 'morale',
    });
  }

  return { narratives, moraleChanges: [], healthDamage: 0, moraleTotal: Math.round(total) };
}

// ============================================================
// LOAD STEP
// ============================================================

/**
 * Resolve the LOAD step.
 * @param options.guaranteedLoad - If true, load always succeeds (Double Time)
 */
export function resolveLoad(
  state: BattleState,
  options?: { guaranteedLoad?: boolean },
): StepResult {
  const turn = state.turn;
  const narratives: LogEntry[] = [];

  const loadResult = rollAutoLoad(
    state.player.morale,
    state.player.maxMorale,
    state.player.valor,
    state.player.musketry,
  );

  if (options?.guaranteedLoad) {
    loadResult.success = true;
  }

  state.lastLoadResult = loadResult;
  if (loadResult.success) {
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    narratives.push({ turn, text: 'Loaded.', type: 'action' });
  } else {
    state.player.musketLoaded = false;
    state.player.fumbledLoad = true;
    narratives.push({ turn, text: 'Fumbled reload.', type: 'result' });
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    narratives.push({ turn, text: 'Reloaded.', type: 'action' });
  }

  return { narratives, moraleChanges: [], healthDamage: 0 };
}
