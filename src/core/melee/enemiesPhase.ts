import {
  BattleState,
  MeleeActionId,
  MeleeState,
  BodyPart,
  LogEntry,
  MoraleChange,
} from '../../types';
import {
  ACTION_DEFS,
  DAMAGE_FATIGUE_RATE,
  snapshotOf,
  pushAction,
  playerToCombatant,
  oppToCombatant,
  allyToCombatant,
  oppSpendStamina,
  shortName,
} from './effects';
import { chooseMeleeAI, chooseEnemyTarget } from './opponents';
import { resolveGenericAttack } from './genericAttack';
import { isOpponentDefeated } from './waveManager';
import {
  SECOND_WIND_ROLL_RANGE,
  SECOND_WIND_THRESHOLD,
  SECOND_WIND_FATIGUE_REDUCTION,
} from './roundTypes';
import type { MeleeRoundResult, EnemiesPhaseResult } from './roundTypes';

// ============================================================
// ENEMIES PHASE — resolve enemy AI actions
// ============================================================

/** @mutates state.player (health, stamina, fatigue), ms (allies, roundLog, playerStunned, lastOppAttacked) */
export function resolveEnemiesPhase(
  state: BattleState,
  ms: MeleeState,
  playerAction: MeleeActionId,
  playerGuarding: boolean,
  playerBlockChance: number,
  allyGuarding: Map<string, number>,
  playerStunned: boolean,
  turn: number,
): EnemiesPhaseResult {
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let playerHealthDelta = 0;
  const allyDeaths: MeleeRoundResult['allyDeaths'] = [];
  let battleEnd: EnemiesPhaseResult['battleEnd'];

  const liveEnemiesAfterAllies = ms.activeEnemies.filter((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });

  for (const idx of liveEnemiesAfterAllies) {
    if (state.player.health <= 0) break;

    const opp = ms.opponents[idx];
    if (opp.stunned) {
      log.push({ turn, type: 'result', text: `${shortName(opp.name)} stunned.` });
      continue;
    }

    const ai = chooseMeleeAI(opp, state);
    const aiDef = ACTION_DEFS[ai.action];

    const enemyTarget = chooseEnemyTarget(opp, state.player, ms.allies);

    oppSpendStamina(opp, aiDef);

    if (ai.action === MeleeActionId.Respite) {
      opp.stamina = Math.min(opp.maxStamina, opp.stamina + 30);
      log.push({ turn, type: 'result', text: `${shortName(opp.name)} catches breath.` });
      pushAction(
        ms,
        {
          actorName: opp.name,
          actorSide: 'enemy',
          targetName: enemyTarget.name,
          targetSide: 'enemy',
          action: ai.action,
          hit: true,
          damage: 0,
        },
        opp,
        opp,
      );
      continue;
    }
    if (ai.action === MeleeActionId.SecondWind) {
      const oppEndRoll = opp.strength + Math.random() * SECOND_WIND_ROLL_RANGE;
      const oppSwSuccess = oppEndRoll > SECOND_WIND_THRESHOLD;
      if (oppSwSuccess) {
        const reduction = Math.round(opp.maxFatigue * SECOND_WIND_FATIGUE_REDUCTION);
        opp.fatigue = Math.max(0, opp.fatigue - reduction);
        log.push({
          turn,
          type: 'result',
          text: `${shortName(opp.name)} catches a second wind.`,
        });
      } else {
        log.push({ turn, type: 'result', text: `${shortName(opp.name)} gasps for breath.` });
      }
      pushAction(
        ms,
        {
          actorName: opp.name,
          actorSide: 'enemy',
          targetName: enemyTarget.name,
          targetSide: 'enemy',
          action: ai.action,
          hit: oppSwSuccess,
          damage: 0,
        },
        opp,
        opp,
      );
      continue;
    }
    if (ai.action === MeleeActionId.Guard) {
      log.push({ turn, type: 'result', text: `${shortName(opp.name)} guards.` });
      pushAction(
        ms,
        {
          actorName: opp.name,
          actorSide: 'enemy',
          targetName: enemyTarget.name,
          targetSide: 'enemy',
          action: ai.action,
          hit: false,
          damage: 0,
        },
        opp,
        opp,
      );
      continue;
    }

    if (!aiDef.isAttack) continue;

    // Attacking the player
    if (enemyTarget.type === 'player') {
      ms.lastOppAttacked = true;
      const result = resolveGenericAttack(
        oppToCombatant(opp),
        playerToCombatant(state.player),
        null,
        ai.action,
        ai.bodyPart,
        turn,
        {
          side: 'enemy',
          targetSide: 'player',
          targetGuarding: playerGuarding,
          targetBlockChance: playerBlockChance,
          freeAttack:
            playerAction === MeleeActionId.Respite ||
            playerAction === MeleeActionId.Reload ||
            playerAction === MeleeActionId.SecondWind ||
            playerAction === MeleeActionId.UseCanteen ||
            playerStunned,
        },
      );
      log.push(...result.log);
      if (result.hit) {
        state.player.health = Math.max(0, state.player.health - result.damage);
        state.player.stamina = Math.max(0, state.player.stamina - result.staminaDrain);
        state.player.fatigue = Math.min(
          state.player.maxFatigue,
          state.player.fatigue +
            result.fatigueDrain +
            Math.round(result.damage * DAMAGE_FATIGUE_RATE),
        );
        playerHealthDelta -= result.damage;
        if (result.damage > 0)
          moraleChanges.push({
            amount: -(result.damage / 3),
            reason: `Hit by ${shortName(opp.name)}`,
            source: 'event',
          });
        if (result.staminaDrain > 0)
          moraleChanges.push({
            amount: -3,
            reason: `Staggered by ${shortName(opp.name)}`,
            source: 'event',
          });
        const stunRoll = (ai.bodyPart === BodyPart.Head ? 0.3 : 0) + aiDef.stunBonus;
        if (stunRoll > 0 && Math.random() < stunRoll) {
          ms.playerStunned = 1;
          moraleChanges.push({ amount: -5, reason: 'Stunned!', source: 'event' });
        }
      }
      pushAction(ms, result.roundAction, opp, state.player);

      if (state.player.health <= 0) {
        battleEnd = 'defeat';
        break;
      }
    } else {
      // Attacking an ally
      const targetAlly = ms.allies.find((a) => a.id === enemyTarget.id);
      if (!targetAlly || !targetAlly.alive || targetAlly.health <= 0) continue;

      const allyBlockChance = allyGuarding.get(targetAlly.id) || 0;
      const result = resolveGenericAttack(
        oppToCombatant(opp),
        allyToCombatant(targetAlly),
        targetAlly,
        ai.action,
        ai.bodyPart,
        turn,
        {
          side: 'enemy',
          targetSide: 'ally',
          targetGuarding: allyBlockChance > 0,
          targetBlockChance: allyBlockChance,
        },
      );
      log.push(...result.log);
      if (result.hit) {
        targetAlly.health -= result.damage;
        targetAlly.stamina = Math.max(0, targetAlly.stamina - result.staminaDrain);
        targetAlly.fatigue = Math.min(
          targetAlly.maxFatigue,
          targetAlly.fatigue +
            result.fatigueDrain +
            Math.round(result.damage * DAMAGE_FATIGUE_RATE),
        );
        if (result.targetKilled) targetAlly.health = 0;
      }
      pushAction(ms, result.roundAction, opp, targetAlly);

      // Ally death check
      if (targetAlly.health <= 0 && targetAlly.alive) {
        targetAlly.alive = false;
        const isNamed = targetAlly.type === 'named';
        allyDeaths.push({ name: targetAlly.name, npcId: targetAlly.npcId, isNamed });
        if (isNamed) {
          log.push({
            turn,
            type: 'event',
            text: `${targetAlly.name} goes down! The loss hits you like a physical blow.`,
          });
          moraleChanges.push({ amount: -8, reason: `${targetAlly.name} fell`, source: 'event' });
        } else {
          log.push({ turn, type: 'event', text: `${targetAlly.name} falls.` });
          moraleChanges.push({ amount: -3, reason: 'Ally fell', source: 'event' });
        }
        ms.roundLog.push({
          eventType: 'defeat',
          actorName: targetAlly.name,
          actorSide: 'ally',
          targetName: targetAlly.name,
          targetSide: 'ally',
          action: MeleeActionId.Guard,
          hit: false,
          damage: 0,
          narrative: isNamed ? `${targetAlly.name} goes down` : `${targetAlly.name} falls`,
          actorAfter: snapshotOf(targetAlly),
          targetAfter: snapshotOf(targetAlly),
        });
      }
    }
  }

  return { log, moraleChanges, playerHealthDelta, allyDeaths, battleEnd };
}
