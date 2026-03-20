import {
  BattleState,
  MeleeActionId,
  MeleeState,
  BodyPart,
  LogEntry,
  MoraleChange,
  RoundAction,
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
import { getMeleeTuning } from './tuning';
import { updateMomentum, resetMomentum } from './momentum';
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
    const tuning = getMeleeTuning(state);
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      BodyPart.Torso,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte,
        tuning, attackerMomentum: ms.playerMomentum, attackerStamina: state.player.stamina, targetStamina: target.stamina },
    );
    // Free-strike log enrichment
    if (ms.freeStrikeUsedThisRound && result.log.length > 0) {
      result.log[result.log.length - 1].text = 'Free Strike! ' + result.log[result.log.length - 1].text;
    }
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You wrong-foot your opponent', source: 'action' });
      // Stamina-drain-only hits (Feint) do NOT reset momentum in v2
    }
    // Update player momentum after Feint
    if (tuning.momentumEnabled) {
      const prevMomentum = ms.playerMomentum;
      const mRef = { momentum: ms.playerMomentum, freeStrikeReady: ms.playerFreeStrikeReady };
      updateMomentum(mRef, result.hit);
      ms.playerMomentum = mRef.momentum;
      ms.playerFreeStrikeReady = mRef.freeStrikeReady;
      result.roundAction.momentumAfter = ms.playerMomentum;
      result.roundAction.freeStrikeEarned = (prevMomentum === 2 && ms.playerMomentum === 3);
      if (ms.freeStrikeUsedThisRound) {
        result.roundAction.freeStrikeUsed = true;
        ms.freeStrikeUsedThisRound = false;
      }
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
    const tuning = getMeleeTuning(state);
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
      { momentum: tuning.momentumEnabled ? ms.playerMomentum : undefined },
    );
    const shootFatigueBonus = -getFatigueDebuff(target.fatigue, target.maxFatigue) / 100;
    let hitChance = baseHitChance + shootFatigueBonus;
    // Zero-stamina hit penalty (v2 only — classic has zeroStaminaHitPenalty = 0)
    if (tuning.zeroStaminaHitPenalty > 0 && state.player.stamina <= 0) {
      hitChance -= tuning.zeroStaminaHitPenalty;
    }
    hitChance = Math.max(0.05, Math.min(0.95, hitChance));
    const hit = Math.random() < Math.max(0.1, hitChance);
    if (hit) {
      let dmg = calcDamage(
        playerAction,
        bp,
        state.player.fatigue,
        state.player.maxFatigue,
        state.player.strength,
        tuning.bodyPartDefs,
      );
      // Zero-stamina damage taken bonus (v2 only)
      if (tuning.zeroStaminaDamageTakenBonus > 0 && target.stamina <= 0) {
        dmg = Math.round(dmg * (1 + tuning.zeroStaminaDamageTakenBonus));
      }
      // Momentum damage bonus (v2 only)
      if (tuning.momentumEnabled && ms.playerMomentum >= 2) {
        dmg = Math.round(dmg * 1.15);
      }
      // Riposte damage bonus (v2 only — classic has riposteEnabled = false)
      if (ms.playerRiposte && tuning.riposteEnabled) {
        dmg = Math.round(dmg * 1.25);
      }
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
      // V2 enriched log tags for Shoot
      let shootTag = '';
      if (tuning.version === 'v2') {
        if (tuning.momentumEnabled && ms.playerMomentum >= 2) shootTag += ' (Momentum)';
        if (ms.playerRiposte && tuning.riposteEnabled) shootTag += ' (Riposte)';
      }
      const shootPrefix = ms.freeStrikeUsedThisRound ? 'Free Strike! ' : '';
      log.push({
        turn,
        type: 'result',
        text: `${shootPrefix}Shot hits ${shortName(target.name)}. ${PART_NAMES[bp]}.${special}${shootTag}`,
      });
      const shootHitAction: RoundAction = {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: target.name,
        targetSide: 'enemy',
        action: playerAction,
        bodyPart: bp,
        hit: true,
        damage: dmg,
        special: special || undefined,
      };
      // Reset target momentum only if HP damage exceeds threshold
      if (tuning.momentumEnabled) {
        const threshold = target.maxHealth * tuning.momentumResetThreshold;
        if (dmg > threshold) {
          shootHitAction.momentumBroken = target.momentum > 0;
          resetMomentum(target);
        }
      }
      pushAction(ms, shootHitAction, state.player, target);
    } else {
      const missPrefix = ms.freeStrikeUsedThisRound ? 'Free Strike! ' : '';
      const exhaustedTag = (tuning.version === 'v2' && state.player.stamina <= 0) ? ' (Exhausted)' : '';
      log.push({ turn, type: 'result', text: `${missPrefix}Shot misses.${exhaustedTag}` });
      const shootMissAction: RoundAction = {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: target.name,
        targetSide: 'enemy',
        action: playerAction,
        bodyPart: bp,
        hit: false,
        damage: 0,
      };
      pushAction(ms, shootMissAction, state.player, target);
    }
    // Update player momentum after Shoot
    if (tuning.momentumEnabled) {
      const prevMomentum = ms.playerMomentum;
      const mRef = { momentum: ms.playerMomentum, freeStrikeReady: ms.playerFreeStrikeReady };
      updateMomentum(mRef, hit);
      ms.playerMomentum = mRef.momentum;
      ms.playerFreeStrikeReady = mRef.freeStrikeReady;
      // Patch momentum metadata on the last-pushed round action
      const lastAction = ms.roundLog[ms.roundLog.length - 1];
      lastAction.momentumAfter = ms.playerMomentum;
      lastAction.freeStrikeEarned = (prevMomentum === 2 && ms.playerMomentum === 3);
      if (ms.freeStrikeUsedThisRound) {
        lastAction.freeStrikeUsed = true;
        ms.freeStrikeUsedThisRound = false;
      }
    }
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.ButtStrike && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const tuning = getMeleeTuning(state);
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      BodyPart.Torso,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte,
        tuning, attackerMomentum: ms.playerMomentum, attackerStamina: state.player.stamina, targetStamina: target.stamina },
    );
    // Free-strike log enrichment
    if (ms.freeStrikeUsedThisRound && result.log.length > 0) {
      result.log[result.log.length - 1].text = 'Free Strike! ' + result.log[result.log.length - 1].text;
    }
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
      // Stamina-drain-only hits (ButtStrike) do NOT reset momentum in v2
    }
    // Update player momentum after ButtStrike
    if (tuning.momentumEnabled) {
      const prevMomentum = ms.playerMomentum;
      const mRef = { momentum: ms.playerMomentum, freeStrikeReady: ms.playerFreeStrikeReady };
      updateMomentum(mRef, result.hit);
      ms.playerMomentum = mRef.momentum;
      ms.playerFreeStrikeReady = mRef.freeStrikeReady;
      result.roundAction.momentumAfter = ms.playerMomentum;
      result.roundAction.freeStrikeEarned = (prevMomentum === 2 && ms.playerMomentum === 3);
      if (ms.freeStrikeUsedThisRound) {
        result.roundAction.freeStrikeUsed = true;
        ms.freeStrikeUsedThisRound = false;
      }
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (pDef.isAttack && playerBodyPart && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const tuning = getMeleeTuning(state);
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      playerBodyPart,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte,
        tuning, attackerMomentum: ms.playerMomentum, attackerStamina: state.player.stamina, targetStamina: target.stamina },
    );
    // Free-strike log enrichment
    if (ms.freeStrikeUsedThisRound && result.log.length > 0) {
      result.log[result.log.length - 1].text = 'Free Strike! ' + result.log[result.log.length - 1].text;
    }
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE),
      );
      if (result.damage > 0) {
        moraleChanges.push({
          amount: result.damage / 4,
          reason: 'Your strike connects',
          source: 'action',
        });
        // Reset target momentum only if HP damage exceeds threshold
        if (tuning.momentumEnabled) {
          const threshold = target.maxHealth * tuning.momentumResetThreshold;
          if (result.damage > threshold) {
            result.roundAction.momentumBroken = target.momentum > 0;
            resetMomentum(target);
          }
        }
      }
      if (result.staminaDrain > 0)
        moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
      if (result.targetKilled) target.health = 0;
    }
    // Update player momentum after normal attack
    if (tuning.momentumEnabled) {
      const prevMomentum = ms.playerMomentum;
      const mRef = { momentum: ms.playerMomentum, freeStrikeReady: ms.playerFreeStrikeReady };
      updateMomentum(mRef, result.hit);
      ms.playerMomentum = mRef.momentum;
      ms.playerFreeStrikeReady = mRef.freeStrikeReady;
      result.roundAction.momentumAfter = ms.playerMomentum;
      result.roundAction.freeStrikeEarned = (prevMomentum === 2 && ms.playerMomentum === 3);
      if (ms.freeStrikeUsedThisRound) {
        result.roundAction.freeStrikeUsed = true;
        ms.freeStrikeUsedThisRound = false;
      }
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
  const killTuning = getMeleeTuning(state);
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
      // Kill stamina refund (v2 only — classic has killStaminaRefund = 0)
      if (killTuning.killStaminaRefund > 0) {
        state.player.stamina = Math.min(
          state.player.maxStamina,
          state.player.stamina + killTuning.killStaminaRefund,
        );
        // Tag the most recent player hit with the refund amount
        for (let i = ms.roundLog.length - 1; i >= 0; i--) {
          if (ms.roundLog[i].actorSide === 'player' && ms.roundLog[i].hit) {
            ms.roundLog[i].killRefund = killTuning.killStaminaRefund;
            break;
          }
        }
        log.push({ turn, type: 'result', text: `Stamina refunded (+${killTuning.killStaminaRefund}).` });
      }
    }
  }

  // Backfill enemies from pool after player kills
  backfillEnemies(ms, turn, log);

  return { log, moraleChanges, playerGuarding, playerBlockChance, enemyDefeats };
}
