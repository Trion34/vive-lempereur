import {
  BattleState,
  DrillStep,
  LogEntry,
  MoraleChange,
} from '../../types';
import { RIVOLI_VOLLEYS } from '../../data/battles/rivoli/volleys';

// ============================================================
// SCRIPTED EVENTS — adapter that delegates to config
// ============================================================

export function resolveScriptedEvents(
  state: BattleState,
  step: DrillStep,
): { log: LogEntry[]; moraleChanges: MoraleChange[] } {
  const volleyIdx = state.scriptedVolley - 1;
  const volleyConfig = RIVOLI_VOLLEYS[volleyIdx];
  if (!volleyConfig?.events) return { log: [], moraleChanges: [] };
  return volleyConfig.events(state, step);
}

// ============================================================
// SCRIPTED RETURN FIRE (ENDURE step) — reads returnFire from config
// ============================================================

export function resolveScriptedReturnFire(
  state: BattleState,
  volleyIdx: number,
): { moraleChanges: MoraleChange[]; log: LogEntry[]; healthDamage: number } {
  const volleyConfig = RIVOLI_VOLLEYS[volleyIdx];
  if (!volleyConfig) return { moraleChanges: [], log: [], healthDamage: 0 };

  const def = volleyConfig.def;
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  let healthDamage = 0;

  let hitChance = def.enemyReturnFireChance;

  // Front rank bonus from config
  const frontRankBonus = volleyConfig.returnFire?.frontRankBonus ?? 0;
  if (state.player.frontRank && frontRankBonus > 0 && state.ext.battlePart === 1) {
    hitChance += frontRankBonus;
  }

  if (Math.random() < hitChance) {
    const [min, max] = def.enemyReturnFireDamage;
    healthDamage = min + Math.floor(Math.random() * (max - min));

    // Fatal hit check from config
    const fatalChance = volleyConfig.returnFire?.fatalChance ?? 0;
    if (fatalChance > 0 && Math.random() < fatalChance) {
      healthDamage = 999;
      log.push({ turn: state.turn, text: 'Fatal hit.', type: 'event' });
    } else {
      moraleChanges.push({ amount: -8, reason: "You've been hit", source: 'event' });
      const wounds = ['arm', 'shoulder', 'thigh', 'side', 'hand'];
      const wound = wounds[Math.floor(Math.random() * wounds.length)];
      log.push({ turn: state.turn, type: 'event', text: `Hit. ${wound}. Still standing.` });
    }
  }

  return { moraleChanges, log, healthDamage };
}
