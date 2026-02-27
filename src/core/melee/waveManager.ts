import {
  BattleState,
  MeleeState,
  MeleeOpponent,
  MeleeActionId,
  LogEntry,
} from '../../types';
import { snapshotOf, shortName } from './effects';
import { makeAlly } from './encounters';

/** Check if an opponent is defeated */
export function isOpponentDefeated(opp: MeleeOpponent): boolean {
  return opp.health <= 0;
}

/**
 * Process wave events for the current round.
 * Adds allies, increases max enemies, backfills from pool.
 * Returns log entries for narrative beats.
 */
export function processWaveEvents(ms: MeleeState, turn: number, npcs: BattleState['line'], roles: BattleState['roles']): LogEntry[] {
  const log: LogEntry[] = [];

  for (let i = 0; i < ms.waveEvents.length; i++) {
    if (ms.processedWaves.includes(i)) continue;
    const wave = ms.waveEvents[i];
    if (ms.roundNumber < wave.atRound) continue;

    // Check NPC alive condition
    if (wave.conditionNpcAlive) {
      const npcId = wave.conditionNpcAlive;
      let alive = true;
      if (npcId === roles.leftNeighbour) alive = npcs.leftNeighbour?.alive ?? false;
      else if (npcId === roles.rightNeighbour) alive = npcs.rightNeighbour?.alive ?? false;
      if (!alive) {
        ms.processedWaves.push(i);
        continue;
      }
    }

    ms.processedWaves.push(i);

    if (wave.action === 'add_ally' && wave.allyTemplate) {
      const ally = makeAlly(wave.allyTemplate);
      // Carry over wound status from line phase
      if (ally.npcId === roles.leftNeighbour && npcs.leftNeighbour?.wounded) {
        ally.armInjured = true;
      }
      ms.allies.push(ally);
      log.push({ turn, type: 'event', text: wave.narrative });
      ms.roundLog.push({
        eventType: 'arrival',
        actorName: ally.name,
        actorSide: 'ally',
        targetName: ally.name,
        targetSide: 'ally',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
        narrative: wave.narrative,
        actorAfter: snapshotOf(ally),
        targetAfter: snapshotOf(ally),
      });
    } else if (wave.action === 'increase_max_enemies' && wave.newMaxEnemies) {
      ms.maxActiveEnemies = wave.newMaxEnemies;
      log.push({ turn, type: 'event', text: wave.narrative });
    }
  }

  // Backfill active enemies from pool (when enemies die or max increases)
  backfillEnemies(ms, turn, log);

  return log;
}

/** Pull enemies from pool into active combat up to maxActiveEnemies */
export function backfillEnemies(ms: MeleeState, turn: number, log: LogEntry[]) {
  const liveActiveCount = ms.activeEnemies.filter((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  }).length;

  let toFill = ms.maxActiveEnemies - liveActiveCount;
  while (toFill > 0 && ms.enemyPool.length > 0) {
    const nextIdx = ms.enemyPool.shift()!;
    ms.activeEnemies.push(nextIdx);
    const opp = ms.opponents[nextIdx];
    const sName = shortName(opp.name);
    log.push({ turn, type: 'event', text: `${sName} joins the fight.` });
    ms.roundLog.push({
      eventType: 'arrival',
      actorName: opp.name,
      actorSide: 'enemy',
      targetName: opp.name,
      targetSide: 'enemy',
      action: MeleeActionId.Guard,
      hit: false,
      damage: 0,
      narrative: `${sName} joins the fight`,
      actorAfter: snapshotOf(opp),
      targetAfter: snapshotOf(opp),
    });
    toFill--;
  }
}
