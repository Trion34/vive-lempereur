import {
  BattleState,
  MoraleThreshold,
  LogEntry,
  MoraleChange,
  ScriptedFireResult,
} from '../../types';
import type { VolleyConfig } from '../../data/battles/types';

// === Morale accuracy multipliers ===
const SHAKEN_ACCURACY_MULT = 0.85;
const WAVERING_ACCURACY_MULT = 0.7;
const BREAKING_ACCURACY_MULT = 0.4;

// ============================================================
// FIRE NARRATIVES (per volley x outcome)
// ============================================================

type FireOutcome = 'hit_seen' | 'hit_unseen' | 'miss_seen' | 'miss_unseen';

function getFireNarrative(volleyIdx: number, outcome: FireOutcome, _state: BattleState): string {
  const narratives: Record<number, Record<FireOutcome, string>> = {
    0: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    1: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    2: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    3: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    4: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    5: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    6: {
      hit_seen: 'Hit. Target down.',
      hit_unseen: 'Fired. Result unknown.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    // Gorge fire narratives are handled by resolveGorgeFire — these are fallbacks
    7: {
      hit_seen: 'Hit. Gorge.',
      hit_unseen: 'Fired into gorge.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    8: {
      hit_seen: 'Hit. Gorge.',
      hit_unseen: 'Fired into gorge.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    9: {
      hit_seen: 'Hit. Gorge.',
      hit_unseen: 'Fired into gorge.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
    10: {
      hit_seen: 'Hit. Gorge.',
      hit_unseen: 'Fired into gorge.',
      miss_seen: 'Miss.',
      miss_unseen: 'Fired.',
    },
  };

  return narratives[volleyIdx]?.[outcome] || 'The volley crashes out.';
}

// ============================================================
// SCRIPTED FIRE RESOLUTION (hit/miss + perception)
// ============================================================

export function resolveScriptedFire(
  state: BattleState,
  volleys: VolleyConfig[],
): ScriptedFireResult {
  const def = volleys[state.scriptedVolley - 1].def;
  const { player } = state;
  const turn = state.turn;

  // Accuracy
  let accuracy = def.fireAccuracyBase;
  accuracy += player.musketry / 500;

  // Morale modifier
  if (player.moraleThreshold === MoraleThreshold.Shaken) accuracy *= SHAKEN_ACCURACY_MULT;
  else if (player.moraleThreshold === MoraleThreshold.Wavering) accuracy *= WAVERING_ACCURACY_MULT;
  else if (player.moraleThreshold === MoraleThreshold.Breaking) accuracy *= BREAKING_ACCURACY_MULT;

  accuracy = Math.min(0.9, Math.max(0.05, accuracy));

  const hitRoll = Math.random();
  const hit = hitRoll < accuracy;

  // Perception
  let perceptionChance = def.perceptionBase;
  perceptionChance += player.musketry / 200;
  perceptionChance = Math.min(0.95, Math.max(0.05, perceptionChance));

  const perceptionRoll = Math.random();
  const perceived = perceptionRoll < perceptionChance;

  // Enemy damage
  const enemyDamage = hit ? 2.5 : 0;

  // Morale + narrative
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  const volleyIdx = state.scriptedVolley - 1;

  if (hit && perceived) {
    moraleChanges.push({ amount: 4, reason: 'You saw your man fall', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'hit_seen', state), type: 'result' });
  } else if (hit && !perceived) {
    moraleChanges.push({ amount: 1, reason: 'Fired with the volley', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'hit_unseen', state), type: 'result' });
  } else if (!hit && perceived) {
    moraleChanges.push({ amount: -1, reason: 'You saw your shot miss', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'miss_seen', state), type: 'result' });
  } else {
    moraleChanges.push({ amount: 1, reason: 'Fired with the volley', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'miss_unseen', state), type: 'result' });
  }

  return { hit, perceived, accuracy, perceptionRoll, enemyDamage, moraleChanges, log };
}
