import {
  BattleState,
  MeleeActionId,
  BodyPart,
  LogEntry,
  MoraleChange,
} from '../../types';
import {
  STANCE_MODS,
  ACTION_DEFS,
} from './effects';
import { isOpponentDefeated, processWaveEvents } from './waveManager';
import { FATIGUE_ACCUMULATION_RATE } from './roundTypes';
import { resolvePlayerPhase } from './playerPhase';
import { resolveAlliesPhase } from './alliesPhase';
import { resolveEnemiesPhase } from './enemiesPhase';
import { getMeleeTuning } from './tuning';
import { recordPlayerAction } from './opponents';

import type { MeleeRoundResult } from './roundTypes';

// ============================================================
// MAIN ORCHESTRATOR
// ============================================================

/**
 * Resolve one round of melee combat.
 * Turn order: Player -> each alive ally -> each alive enemy.
 * @mutates state — modifies state.player (health/stamina/fatigue), state.meleeState, and opponents in place
 */
export function resolveMeleeRound(
  state: BattleState,
  playerAction: MeleeActionId,
  playerBodyPart: BodyPart | undefined,
  playerTargetIdx: number,
): MeleeRoundResult {
  const ms = state.meleeState!;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let playerHealthDelta = 0;
  let playerStaminaDelta = 0;
  let enemyDefeats = 0;
  let battleEnd: MeleeRoundResult['battleEnd'];

  ms.roundLog = [];
  ms.roundNumber += 1;

  // Process wave events (reinforcements, enemy escalation)
  const waveLogs = processWaveEvents(ms, turn, state.line, state.roles);
  log.push(...waveLogs);

  const tuning = getMeleeTuning(state);

  // Passive stamina regen (v2 only — classic has passiveStaminaRegen = 0)
  if (tuning.passiveStaminaRegen > 0) {
    state.player.stamina = Math.min(state.player.maxStamina, state.player.stamina + tuning.passiveStaminaRegen);
    for (const opp of ms.opponents) {
      opp.stamina = Math.min(opp.maxStamina, opp.stamina + tuning.passiveStaminaRegen);
    }
    for (const ally of ms.allies) {
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + tuning.passiveStaminaRegen);
    }
  }

  const pDef = ACTION_DEFS[playerAction];
  const sDef = STANCE_MODS[ms.playerStance];

  // Tick stuns on all combatants (before action resolution)
  if (ms.playerStunned > 0) ms.playerStunned -= 1;
  for (const opp of ms.opponents) {
    if (opp.stunned) {
      opp.stunnedTurns -= 1;
      if (opp.stunnedTurns <= 0) opp.stunned = false;
    }
  }
  for (const ally of ms.allies) {
    if (ally.stunned) {
      ally.stunnedTurns -= 1;
      if (ally.stunnedTurns <= 0) ally.stunned = false;
    }
  }

  // Injury recovery tick (v2 only — classic has injuryRecoveryChance = 0)
  if (tuning.injuryRecoveryChance > 0) {
    for (const opp of ms.opponents) {
      if (opp.armInjured && Math.random() < tuning.injuryRecoveryChance) opp.armInjured = false;
      if (opp.legInjured && Math.random() < tuning.injuryRecoveryChance) opp.legInjured = false;
    }
    for (const ally of ms.allies) {
      if (ally.armInjured && Math.random() < tuning.injuryRecoveryChance) ally.armInjured = false;
      if (ally.legInjured && Math.random() < tuning.injuryRecoveryChance) ally.legInjured = false;
    }
  }

  const playerStunned = ms.playerStunned > 0;

  // Player stamina cost + fatigue accumulation
  let playerStamCost: number;
  if (playerStunned) {
    playerStamCost = Math.round(sDef.staminaCost * tuning.staminaCostMultiplier);
  } else if (playerAction === MeleeActionId.Respite) {
    // Respite: recover tuning amount, minus stance cost
    playerStamCost = -tuning.respiteRecovery.stamina
      + Math.round(sDef.staminaCost * tuning.staminaCostMultiplier);
  } else if (tuning.momentumEnabled && ms.playerFreeStrikeReady && pDef.isAttack) {
    // Free strike: waive action stamina cost, still pay stance cost
    playerStamCost = Math.round(sDef.staminaCost * tuning.staminaCostMultiplier);
    ms.freeStrikeUsedThisRound = true;
    ms.playerFreeStrikeReady = false;
  } else {
    playerStamCost = Math.round((pDef.stamina + sDef.staminaCost) * tuning.staminaCostMultiplier);
  }
  playerStaminaDelta = -playerStamCost;
  state.player.stamina = Math.max(
    0,
    Math.min(state.player.maxStamina, state.player.stamina - playerStamCost),
  );
  if (playerStamCost > 0) {
    state.player.fatigue = Math.min(
      state.player.maxFatigue,
      state.player.fatigue + Math.round(playerStamCost * FATIGUE_ACCUMULATION_RATE),
    );
  }

  // Track guard state for UI overlay
  ms.playerGuarding = playerAction === MeleeActionId.Guard && !playerStunned;

  // Get list of live active enemies
  const liveEnemyIndices = ms.activeEnemies.filter((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });

  // Capture active enemies before player phase (for v2 observed-action tracking)
  const prePhaseActiveEnemies = [...ms.activeEnemies];

  // === PLAYER PHASE ===
  const playerResult = resolvePlayerPhase(
    state, ms, playerAction, playerBodyPart, playerTargetIdx,
    liveEnemyIndices, playerStunned, turn,
  );
  log.push(...playerResult.log);
  moraleChanges.push(...playerResult.moraleChanges);
  enemyDefeats += playerResult.enemyDefeats;

  // Track player action: global history (classic) + per-opponent (v2)
  recordPlayerAction(playerAction);
  if (tuning.version === 'v2') {
    for (const idx of prePhaseActiveEnemies) {
      const opp = ms.opponents[idx];
      if (opp.health > 0 && opp.observedPlayerActions !== undefined) {
        opp.observedPlayerActions.push(playerAction);
        if (opp.observedPlayerActions.length > 6) opp.observedPlayerActions.shift();
      }
    }
  }

  // === ALLIES PHASE ===
  const alliesResult = resolveAlliesPhase(state, ms, turn);
  log.push(...alliesResult.log);
  enemyDefeats += alliesResult.enemyDefeats;

  // === ENEMIES PHASE ===
  const enemiesResult = resolveEnemiesPhase(
    state, ms, playerAction,
    playerResult.playerGuarding, playerResult.playerBlockChance,
    alliesResult.allyGuarding, playerStunned, turn,
  );
  log.push(...enemiesResult.log);
  moraleChanges.push(...enemiesResult.moraleChanges);
  playerHealthDelta += enemiesResult.playerHealthDelta;
  if (enemiesResult.battleEnd) battleEnd = enemiesResult.battleEnd;

  // === END-OF-ROUND CHECKS ===
  ms.exchangeCount += 1;

  const anyActiveAlive = ms.activeEnemies.some((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });
  if (!anyActiveAlive && ms.enemyPool.length === 0) battleEnd = 'victory';

  if (state.player.health <= 0) battleEnd = 'defeat';

  if (
    !battleEnd &&
    enemyDefeats > 0 &&
    state.player.health < 25 &&
    ms.killCount >= 2 &&
    (anyActiveAlive || ms.enemyPool.length > 0)
  ) {
    battleEnd = 'survived';
  }

  // Sync currentOpponent to first live active enemy
  const firstLiveActive = ms.activeEnemies.find((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });
  if (firstLiveActive !== undefined) {
    ms.currentOpponent = firstLiveActive;
  }

  // Clear transient free-strike flag at end of round
  ms.freeStrikeUsedThisRound = undefined;

  return {
    log,
    moraleChanges,
    playerHealthDelta,
    playerStaminaDelta,
    allyDeaths: enemiesResult.allyDeaths,
    enemyDefeats,
    battleEnd,
  };
}
