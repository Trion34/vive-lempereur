import {
  BattleState,
  ActionId,
  DrillStep,
  MoraleThreshold,
  LogEntry,
  MoraleChange,
  AutoVolleyResult,
  getMoraleThreshold,
  getHealthState,
} from '../../types';
import { rollGraduatedValor, applyMoraleChanges, rollAutoLoad, updateLineMorale } from '../morale';
import { clampStat, rollD100 } from '../stats';
import { VOLLEY_DEFS } from './constants';
import { resolveScriptedFire, resolveGorgeFire, resolveGorgePresent } from './fire';
import { resolveScriptedEvents, resolveScriptedReturnFire } from './events';
import { getVolleyNarrative } from './narrative';

// ============================================================
// LINE INTEGRITY ROLL (auto-play)
// ============================================================

export function rollLineIntegrity(
  state: BattleState,
  volleyIdx: number,
): { integrityChange: number; enemyExtraDamage: number; narrative: string } {
  const def = VOLLEY_DEFS[volleyIdx];

  // French roll: base = lineIntegrity x 0.6 + officer bonus + drums bonus
  const officerBonus = state.line.officer.alive ? 10 : 0;
  const drumsBonus = state.line.drumsPlaying ? 5 : 0;
  const frenchBase = state.line.lineIntegrity * 0.6 + officerBonus + drumsBonus;
  const frenchRoll = rollD100();

  // Austrian roll: base = enemy strength x 0.5 + range pressure
  const rangePressure = Math.max(0, (200 - def.range) / 4); // closer = more pressure
  const austrianBase = state.enemy.strength * 0.5 + rangePressure;
  const austrianRoll = rollD100();

  const frenchTotal = frenchBase + (frenchRoll / 100) * 20;
  const austrianTotal = austrianBase + (austrianRoll / 100) * 20;

  let integrityChange = 0;
  let enemyExtraDamage = 0;
  let narrative: string;

  if (frenchTotal >= austrianTotal) {
    // French line holds — enemy takes extra damage
    enemyExtraDamage = 2 + Math.floor(Math.random() * 3);
    narrative = 'Line holds.';
  } else {
    // Line integrity degrades
    integrityChange = -(3 + Math.floor(Math.random() * 4)); // -3 to -6
    narrative = 'Line wavers. Gaps open.';
  }

  return { integrityChange, enemyExtraDamage, narrative };
}

// ============================================================
// AUTO-RESOLVE FULL VOLLEY (auto-play)
// ============================================================

export function resolveAutoVolley(state: BattleState, volleyIdx: number): AutoVolleyResult {
  const def = VOLLEY_DEFS[volleyIdx];
  const turn = state.turn;
  const narratives: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDamage = 0;
  let playerDied = false;

  // Lock enemy range
  state.enemy.range = def.range;

  // --- PRESENT: Push volley narrative ---
  const presentNarrative = getVolleyNarrative(volleyIdx, DrillStep.Present, state);
  if (presentNarrative) {
    narratives.push({ turn, text: presentNarrative, type: 'narrative' });
  }

  // --- FIRE ---
  const fireOrder = getVolleyNarrative(volleyIdx, DrillStep.Fire, state);
  if (fireOrder) {
    narratives.push({ turn, text: fireOrder, type: 'narrative' });
  }

  const fireResult = resolveScriptedFire(state);
  moraleChanges.push(...fireResult.moraleChanges);
  narratives.push(...fireResult.log);
  state.player.musketLoaded = false;
  state.volleysFired += 1;

  // Scripted enemy damage
  const lineDmg = def.enemyLineDamage;
  state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - fireResult.enemyDamage);
  state.enemy.lineIntegrity = Math.max(
    0,
    state.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7,
  );

  // Scripted events (FIRE step)
  const fireEvents = resolveScriptedEvents(state, DrillStep.Fire);
  narratives.push(...fireEvents.log);
  moraleChanges.push(...fireEvents.moraleChanges);

  // --- GRADUATED VALOR ROLL ---
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

  // --- ENDURE: Scripted events + return fire ---
  const endureEvents = resolveScriptedEvents(state, DrillStep.Endure);
  narratives.push(...endureEvents.log);
  moraleChanges.push(...endureEvents.moraleChanges);

  // ENDURE narrative
  const endureNarrative = getVolleyNarrative(volleyIdx, DrillStep.Endure, state);
  if (endureNarrative) {
    narratives.push({ turn, text: endureNarrative, type: 'narrative' });
  }

  // Return fire
  const returnFire = resolveScriptedReturnFire(state, volleyIdx);
  if (returnFire.healthDamage > 0) {
    healthDamage += returnFire.healthDamage;
    state.player.health = Math.max(0, state.player.health - returnFire.healthDamage);
    state.player.healthState = getHealthState(state.player.health, state.player.maxHealth);
  }
  moraleChanges.push(...returnFire.moraleChanges);
  narratives.push(...returnFire.log);

  // --- LINE INTEGRITY ROLL ---
  const lineResult = rollLineIntegrity(state, volleyIdx);
  state.line.lineIntegrity = clampStat(state.line.lineIntegrity + lineResult.integrityChange);
  if (lineResult.enemyExtraDamage > 0) {
    state.enemy.strength = Math.max(0, state.enemy.strength - lineResult.enemyExtraDamage);
    state.enemy.lineIntegrity = Math.max(
      0,
      state.enemy.lineIntegrity - lineResult.enemyExtraDamage * 0.7,
    );
  }
  narratives.push({ turn, text: lineResult.narrative, type: 'event' });

  // --- APPLY MORALE ---
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

  // Update line morale string
  updateLineMorale(state);

  // Stamina cost — net drain per volley (tired troops arrive at melee worn down)
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

  // --- LOAD (between volleys) ---
  const loadResult = rollAutoLoad(
    state.player.morale,
    state.player.maxMorale,
    state.player.valor,
    state.player.musketry,
  );
  state.lastLoadResult = loadResult;
  if (loadResult.success) {
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    narratives.push({ turn, text: 'Loaded.', type: 'action' });
  } else {
    state.player.musketLoaded = false;
    state.player.fumbledLoad = true;
    narratives.push({ turn, text: 'Fumbled reload.', type: 'result' });
    // Fumble resolves immediately in auto-play — line covers
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    narratives.push({ turn, text: 'Reloaded.', type: 'action' });
  }

  // Death check
  if (state.player.health <= 0) {
    state.player.alive = false;
    playerDied = true;
  }

  // Push all narratives to log
  state.log.push(...narratives);

  return {
    volleyIdx,
    narratives,
    valorRoll,
    lineIntegrityChange: lineResult.integrityChange,
    playerDied,
    healthDamage,
    moraleTotal: Math.round(total),
  };
}

// ============================================================
// AUTO-RESOLVE GORGE VOLLEY (Part 3 auto-play)
// ============================================================

export function resolveAutoGorgeVolley(
  state: BattleState,
  volleyIdx: number,
  targetAction: ActionId,
): AutoVolleyResult {
  const def = VOLLEY_DEFS[volleyIdx];
  const turn = state.turn;
  const narratives: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDamage = 0;
  let playerDied = false;

  // Lock range
  state.enemy.range = def.range;

  // --- PRESENT: resolve gorge target ---
  const presentResult = resolveGorgePresent(state, targetAction, volleyIdx);
  moraleChanges.push(...presentResult.moraleChanges);
  narratives.push(...presentResult.log);

  // --- FIRE: resolve gorge fire (unless ShowMercy, which already handled line fire) ---
  if (targetAction !== ActionId.ShowMercy) {
    const fireResult = resolveGorgeFire(state);
    moraleChanges.push(...fireResult.moraleChanges);
    narratives.push(...fireResult.log);
    state.player.musketLoaded = false;
    state.volleysFired += 1;

    // Line damage
    const lineDmg = def.enemyLineDamage;
    state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - fireResult.enemyDamage);
    state.enemy.lineIntegrity = Math.max(
      0,
      state.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7,
    );
  } else {
    // ShowMercy: line damage already applied in resolveGorgePresent, mark musket unfired
    state.player.musketLoaded = false;
    state.volleysFired += 1;
  }

  // Scripted events (FIRE step)
  const fireEvents = resolveScriptedEvents(state, DrillStep.Fire);
  narratives.push(...fireEvents.log);
  moraleChanges.push(...fireEvents.moraleChanges);

  // Gorge: inject ENDURE events (no actual ENDURE step — one-sided)
  const endureEvents = resolveScriptedEvents(state, DrillStep.Endure);
  narratives.push(...endureEvents.log);
  moraleChanges.push(...endureEvents.moraleChanges);

  const endureNarrative = getVolleyNarrative(volleyIdx, DrillStep.Endure, state);
  if (endureNarrative) {
    narratives.push({ turn, text: endureNarrative, type: 'narrative' });
  }

  // NO valor roll, NO return fire, NO line integrity roll (gorge is one-sided)

  // --- APPLY MORALE ---
  const { newMorale, threshold } = applyMoraleChanges(
    state.player.morale,
    state.player.maxMorale,
    moraleChanges,
    state.player.valor,
  );
  state.player.morale = newMorale;
  state.player.moraleThreshold = threshold;

  // Neighbour morale update (minimal — gorge is low-stress for neighbours)
  for (const n of [state.line.leftNeighbour, state.line.rightNeighbour]) {
    if (!n?.alive || n.routing) continue;
    let drain = 0; // gorge: minimal pressure
    if (state.player.moraleThreshold === MoraleThreshold.Steady) drain += 1;
    else if (state.player.moraleThreshold === MoraleThreshold.Breaking) drain -= 1;
    n.morale = Math.max(0, Math.min(n.maxMorale, n.morale + drain));
    n.threshold = getMoraleThreshold(n.morale, n.maxMorale);
  }

  updateLineMorale(state);

  // Stamina cost (gorge: lighter than line combat)
  state.player.stamina = Math.max(0, state.player.stamina - 3);

  // Morale summary
  const total = moraleChanges.reduce((sum, c) => sum + c.amount, 0);
  if (Math.round(total) !== 0) {
    narratives.push({
      turn,
      text: `Morale ${total > 0 ? 'recovered' : 'lost'}: ${total > 0 ? '+' : ''}${Math.round(total)}`,
      type: 'morale',
    });
  }

  // --- LOAD ---
  const loadResult = rollAutoLoad(
    state.player.morale,
    state.player.maxMorale,
    state.player.valor,
    state.player.musketry,
  );
  state.lastLoadResult = loadResult;
  if (loadResult.success) {
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    narratives.push({ turn, text: 'Loaded.', type: 'action' });
  } else {
    state.player.musketLoaded = false;
    state.player.fumbledLoad = true;
    narratives.push({ turn, text: 'Fumbled reload.', type: 'result' });
    // Fumble resolves immediately — gorge is low-pressure
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    narratives.push({ turn, text: 'Reloaded.', type: 'action' });
  }

  // Push all narratives to log
  state.log.push(...narratives);

  return {
    volleyIdx,
    narratives,
    valorRoll: null,
    lineIntegrityChange: 0,
    playerDied,
    healthDamage,
    moraleTotal: Math.round(total),
  };
}
