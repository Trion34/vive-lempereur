import {
  BattleState,
  MeleeActionId,
  MeleeState,
  BodyPart,
  LogEntry,
  MoraleChange,
} from '../../types';
import { getFatigueDebuff } from '../stats';
import {
  STANCE_MODS,
  ACTION_DEFS,
  DAMAGE_FATIGUE_RATE,
  PART_NAMES,
  snapshotOf,
  pushAction,
  playerToCombatant,
  oppToCombatant,
  shortName,
} from './effects';
import { calcHitChance, calcDamage } from './hitCalc';
import { resolveGenericAttack } from './genericAttack';
import { isOpponentDefeated, backfillEnemies } from './waveManager';
import {
  SECOND_WIND_ROLL_RANGE,
  SECOND_WIND_THRESHOLD,
  SECOND_WIND_FATIGUE_REDUCTION,
  ELAN_BLOCK_DIVISOR,
  CANTEEN_HP_RESTORE,
} from './roundTypes';
import type { PlayerPhaseResult } from './roundTypes';

// ============================================================
// PLAYER PHASE — resolve player action + check enemy defeats
// ============================================================

/** @mutates state.player, ms (opponents, roundLog, killCount, reloadProgress, playerRiposte) */
export function resolvePlayerPhase(
  state: BattleState,
  ms: MeleeState,
  playerAction: MeleeActionId,
  playerBodyPart: BodyPart | undefined,
  playerTargetIdx: number,
  liveEnemyIndices: number[],
  playerStunned: boolean,
  turn: number,
): PlayerPhaseResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let enemyDefeats = 0;

  const pDef = ACTION_DEFS[playerAction];
  const sDef = STANCE_MODS[ms.playerStance];

  // Track player defensive state for this round
  const playerGuarding = playerAction === MeleeActionId.Guard && !playerStunned;
  let playerBlockChance = 0;
  if (playerGuarding) {
    const fatigueDebuffPct = getFatigueDebuff(state.player.fatigue, state.player.maxFatigue) / 100;
    playerBlockChance = Math.max(
      0.05,
      Math.min(0.95, 0.1 + sDef.defense + state.player.elan / ELAN_BLOCK_DIVISOR + fatigueDebuffPct),
    );
  }

  // === PLAYER ACTS ===
  if (playerStunned) {
    log.push({ turn, type: 'result', text: "Stunned. Can't act." });
  } else if (playerAction === MeleeActionId.Respite) {
    log.push({ turn, type: 'action', text: 'Catching breath.' });
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: true,
        damage: 0,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.Feint && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      BodyPart.Torso,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You wrong-foot your opponent', source: 'action' });
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.Reload) {
    ms.reloadProgress += 1;
    if (ms.reloadProgress >= 2) {
      state.player.musketLoaded = true;
      ms.reloadProgress = 0;
      log.push({ turn, type: 'action', text: 'Ram ball home. Prime the pan. Musket loaded.' });
    } else {
      log.push({ turn, type: 'action', text: 'Bite cartridge. Pour powder. Half loaded.' });
    }
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: false,
        damage: 0,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.SecondWind) {
    const endRoll = state.player.endurance + Math.random() * SECOND_WIND_ROLL_RANGE;
    const success = endRoll > SECOND_WIND_THRESHOLD;
    if (success) {
      const reduction = Math.round(state.player.maxFatigue * SECOND_WIND_FATIGUE_REDUCTION);
      state.player.fatigue = Math.max(0, state.player.fatigue - reduction);
      log.push({
        turn,
        type: 'action',
        text: 'Second wind. The burning eases. You can breathe again.',
      });
    } else {
      log.push({
        turn,
        type: 'action',
        text: "You try to steady your breathing — but the exhaustion won't release its grip.",
      });
    }
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: success,
        damage: 0,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.UseCanteen) {
    const hpRestore = CANTEEN_HP_RESTORE;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + hpRestore);
    state.player.canteenUses += 1;
    log.push({
      turn,
      type: 'action',
      text: 'You uncork the canteen and drink. The water is warm and tastes of tin, but it steadies you.',
    });
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: true,
        damage: hpRestore,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.Shoot && state.player.musketLoaded && liveEnemyIndices.length > 0) {
    state.player.musketLoaded = false;
    ms.reloadProgress = 0;
    const target = liveEnemyIndices.includes(playerTargetIdx)
      ? ms.opponents[playerTargetIdx]
      : ms.opponents[liveEnemyIndices[0]];
    const bp = playerBodyPart || BodyPart.Torso;
    const baseHitChance = calcHitChance(
      state.player.musketry,
      state.player.morale,
      state.player.maxMorale,
      ms.playerStance,
      playerAction,
      bp,
      ms.playerRiposte,
      state.player.fatigue,
      state.player.maxFatigue,
    );
    const shootFatigueBonus = -getFatigueDebuff(target.fatigue, target.maxFatigue) / 100;
    const hitChance = Math.max(0.05, Math.min(0.95, baseHitChance + shootFatigueBonus));
    const hit = Math.random() < Math.max(0.1, hitChance);
    if (hit) {
      const dmg = calcDamage(
        playerAction,
        bp,
        state.player.fatigue,
        state.player.maxFatigue,
        state.player.strength,
      );
      target.health -= dmg;
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + Math.round(dmg * DAMAGE_FATIGUE_RATE),
      );
      moraleChanges.push({
        amount: dmg / 3,
        reason: 'Musket ball found its mark',
        source: 'action',
      });
      let special = '';
      if (bp === BodyPart.Head && Math.random() < 0.25) {
        target.health = 0;
        special = ' Killed.';
      }
      log.push({
        turn,
        type: 'result',
        text: `Shot hits ${shortName(target.name)}. ${PART_NAMES[bp]}.${special}`,
      });
      pushAction(
        ms,
        {
          actorName: state.player.name,
          actorSide: 'player',
          targetName: target.name,
          targetSide: 'enemy',
          action: playerAction,
          bodyPart: bp,
          hit: true,
          damage: dmg,
          special: special || undefined,
        },
        state.player,
        target,
      );
    } else {
      log.push({ turn, type: 'result', text: 'Shot misses.' });
      pushAction(
        ms,
        {
          actorName: state.player.name,
          actorSide: 'player',
          targetName: target.name,
          targetSide: 'enemy',
          action: playerAction,
          bodyPart: bp,
          hit: false,
          damage: 0,
        },
        state.player,
        target,
      );
    }
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.ButtStrike && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      BodyPart.Torso,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (pDef.isAttack && playerBodyPart && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      playerBodyPart,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE),
      );
      if (result.damage > 0)
        moraleChanges.push({
          amount: result.damage / 4,
          reason: 'Your strike connects',
          source: 'action',
        });
      if (result.staminaDrain > 0)
        moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
      if (result.targetKilled) target.health = 0;
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.Guard) {
    log.push({ turn, type: 'action', text: 'You raise your guard.' });
    const guardTargetIdx = liveEnemyIndices.length > 0
      ? (liveEnemyIndices.includes(playerTargetIdx) ? playerTargetIdx : liveEnemyIndices[0])
      : undefined;
    const guardTarget = guardTargetIdx !== undefined ? ms.opponents[guardTargetIdx] : undefined;
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: guardTarget?.name ?? '',
        targetSide: 'enemy',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
      },
      state.player,
      guardTarget || state.player,
    );
  }

  // Check for enemy defeats after player acts
  for (const idx of liveEnemyIndices) {
    const opp = ms.opponents[idx];
    if (isOpponentDefeated(opp)) {
      for (let i = ms.roundLog.length - 1; i >= 0; i--) {
        if (ms.roundLog[i].targetName === opp.name && ms.roundLog[i].hit) {
          ms.roundLog[i].targetKilled = true;
          break;
        }
      }
      log.push({ turn, type: 'event', text: `${shortName(opp.name)} down.` });
      ms.roundLog.push({
        eventType: 'defeat',
        actorName: opp.name,
        actorSide: 'enemy',
        targetName: opp.name,
        targetSide: 'enemy',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
        narrative: `${shortName(opp.name)} is down`,
        actorAfter: snapshotOf(opp),
        targetAfter: snapshotOf(opp),
      });
      ms.killCount += 1;
      enemyDefeats += 1;
    }
  }

  // Backfill enemies from pool after player kills
  backfillEnemies(ms, turn, log);

  return { log, moraleChanges, playerGuarding, playerBlockChance, enemyDefeats };
}
