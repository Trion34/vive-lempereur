import {
  MeleeActionId,
  MeleeState,
  LogEntry,
} from '../../types';
import {
  ACTION_DEFS,
  DAMAGE_FATIGUE_RATE,
  snapshotOf,
  pushAction,
  allyToCombatant,
  oppToCombatant,
  shortName,
} from './effects';
import { chooseAllyAI } from './opponents';
import { resolveGenericAttack } from './genericAttack';
import { isOpponentDefeated, backfillEnemies } from './waveManager';
import {
  SECOND_WIND_ROLL_RANGE,
  SECOND_WIND_THRESHOLD,
  SECOND_WIND_FATIGUE_REDUCTION,
  FATIGUE_ACCUMULATION_RATE,
  ELAN_BLOCK_DIVISOR,
} from './roundTypes';
import type { AlliesPhaseResult } from './roundTypes';

// ============================================================
// ALLIES PHASE — resolve ally AI actions + check enemy defeats
// ============================================================

/** @mutates ms (allies, opponents, roundLog, killCount) */
export function resolveAlliesPhase(
  ms: MeleeState,
  turn: number,
): AlliesPhaseResult {
  const log: LogEntry[] = [];
  const allyGuarding = new Map<string, number>();
  let enemyDefeats = 0;

  const liveAllies = ms.allies.filter((a) => a.alive && a.health > 0);

  for (const ally of liveAllies) {
    if (ally.stunned || ally.health <= 0 || !ally.alive) continue;

    const currentLiveEnemies = ms.activeEnemies.filter((i) => {
      const o = ms.opponents[i];
      return o.health > 0 && !isOpponentDefeated(o);
    });
    if (currentLiveEnemies.length === 0) break;

    const aiChoice = chooseAllyAI(ally, ms.opponents, currentLiveEnemies);
    const targetIdx = aiChoice.targetIndex;
    const target = ms.opponents[targetIdx];

    // Ally stamina cost + fatigue
    const allyActionDef = ACTION_DEFS[aiChoice.action];
    const legMult = ally.legInjured ? 1.5 : 1.0;
    const allyCost = Math.round(allyActionDef.stamina * legMult);
    ally.stamina = Math.max(0, ally.stamina - allyCost);
    if (allyCost > 0)
      ally.fatigue = Math.min(ally.maxFatigue, ally.fatigue + Math.round(allyCost * FATIGUE_ACCUMULATION_RATE));

    if (aiChoice.action === MeleeActionId.Guard) {
      allyGuarding.set(ally.id, Math.max(0.05, Math.min(0.8, 0.1 + ally.elan / ELAN_BLOCK_DIVISOR)));
      log.push({ turn, type: 'result', text: `${ally.name} raises guard.` });
      pushAction(
        ms,
        {
          actorName: ally.name,
          actorSide: 'ally',
          targetName: target.name,
          targetSide: 'enemy',
          action: aiChoice.action,
          hit: false,
          damage: 0,
        },
        ally,
        target,
      );
      continue;
    }

    if (aiChoice.action === MeleeActionId.Respite) {
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + 30);
      log.push({ turn, type: 'result', text: `${ally.name} catches breath.` });
      pushAction(
        ms,
        {
          actorName: ally.name,
          actorSide: 'ally',
          targetName: target.name,
          targetSide: 'enemy',
          action: aiChoice.action,
          hit: true,
          damage: 0,
        },
        ally,
        target,
      );
      continue;
    }

    if (aiChoice.action === MeleeActionId.SecondWind) {
      const allyEndRoll = ally.elan + Math.random() * SECOND_WIND_ROLL_RANGE;
      const allySwSuccess = allyEndRoll > SECOND_WIND_THRESHOLD;
      if (allySwSuccess) {
        const reduction = Math.round(ally.maxFatigue * SECOND_WIND_FATIGUE_REDUCTION);
        ally.fatigue = Math.max(0, ally.fatigue - reduction);
        log.push({ turn, type: 'result', text: `${ally.name} finds a second wind.` });
      } else {
        log.push({ turn, type: 'result', text: `${ally.name} gasps for breath.` });
      }
      pushAction(
        ms,
        {
          actorName: ally.name,
          actorSide: 'ally',
          targetName: target.name,
          targetSide: 'enemy',
          action: aiChoice.action,
          hit: allySwSuccess,
          damage: 0,
        },
        ally,
        target,
      );
      continue;
    }

    const result = resolveGenericAttack(
      allyToCombatant(ally),
      oppToCombatant(target),
      target,
      aiChoice.action,
      aiChoice.bodyPart,
      turn,
      { side: 'ally', targetSide: 'enemy' },
    );
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE),
      );
      if (result.targetKilled) target.health = 0;
    }
    pushAction(ms, result.roundAction, ally, target);

    // Check defeat
    if (isOpponentDefeated(target)) {
      for (let i = ms.roundLog.length - 1; i >= 0; i--) {
        if (ms.roundLog[i].targetName === target.name && ms.roundLog[i].hit) {
          ms.roundLog[i].targetKilled = true;
          break;
        }
      }
      log.push({ turn, type: 'event', text: `${shortName(target.name)} down.` });
      ms.roundLog.push({
        eventType: 'defeat',
        actorName: target.name,
        actorSide: 'enemy',
        targetName: target.name,
        targetSide: 'enemy',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
        narrative: `${shortName(target.name)} is down`,
        actorAfter: snapshotOf(target),
        targetAfter: snapshotOf(target),
      });
      ms.killCount += 1;
      enemyDefeats += 1;
    }
  }

  // Backfill enemies from pool after ally kills
  backfillEnemies(ms, turn, log);

  return { log, allyGuarding, enemyDefeats };
}
