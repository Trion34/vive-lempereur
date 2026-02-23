import {
  BattleState,
  ActionId,
  MoraleThreshold,
  LogEntry,
  MoraleChange,
  ScriptedFireResult,
} from '../../types';
import { VOLLEY_DEFS } from './constants';

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

export function resolveScriptedFire(state: BattleState): ScriptedFireResult {
  const def = VOLLEY_DEFS[state.scriptedVolley - 1];
  const { player } = state;
  const turn = state.turn;

  // Accuracy
  let accuracy = def.fireAccuracyBase;
  accuracy += player.musketry / 500;

  // Morale modifier
  if (player.moraleThreshold === MoraleThreshold.Shaken) accuracy *= 0.85;
  else if (player.moraleThreshold === MoraleThreshold.Wavering) accuracy *= 0.7;
  else if (player.moraleThreshold === MoraleThreshold.Breaking) accuracy *= 0.4;

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

// ============================================================
// GORGE FIRE RESOLUTION (target-based, Part 3)
// ============================================================

export function resolveGorgeFire(state: BattleState): ScriptedFireResult {
  const { player } = state;
  const turn = state.turn;
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  const target = state.gorgeTarget;

  let hit = false;
  let accuracy = 0;
  let enemyDamage = 0;

  if (target === 'column') {
    // High accuracy — shooting into packed ranks
    accuracy = 0.6 + player.musketry / 500 + player.awareness / 500;
    accuracy = Math.min(0.9, Math.max(0.3, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      enemyDamage = 5;
      moraleChanges.push({
        amount: 2,
        reason: 'Your shot found its mark in the column',
        source: 'action',
      });
      log.push({ turn, type: 'result', text: 'Hit. Column.' });
    } else {
      moraleChanges.push({ amount: 1, reason: 'Fired into the gorge', source: 'action' });
      log.push({ turn, type: 'result', text: 'Fired into column.' });
    }
  } else if (target === 'officers') {
    // Medium accuracy — picking out a specific target
    accuracy = 0.3 + player.musketry / 300 + player.awareness / 400;
    accuracy = Math.min(0.7, Math.max(0.15, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      enemyDamage = 3;
      moraleChanges.push({ amount: 5, reason: 'You shot an Austrian officer', source: 'action' });
      log.push({ turn, type: 'result', text: 'Hit. Officer down.' });
    } else {
      moraleChanges.push({
        amount: -1,
        reason: 'Missed the officer \u2014 wasted the shot',
        source: 'action',
      });
      log.push({ turn, type: 'result', text: 'Missed officer.' });
    }
  } else if (target === 'wagon') {
    // Hard accuracy — small, specific target
    accuracy = 0.15 + player.musketry / 250 + player.awareness / 350;
    accuracy = Math.min(0.5, Math.max(0.1, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      const damage = 30 + Math.random() * 15;
      state.wagonDamage += damage;
      enemyDamage = 0;

      if (state.wagonDamage >= 100) {
        // DETONATION
        state.wagonDamage = 100;
        state.enemy.strength = Math.max(0, state.enemy.strength - 30);
        moraleChanges.push({
          amount: 15,
          reason: 'The ammunition wagon DETONATES',
          source: 'action',
        });
        log.push({ turn, type: 'result', text: 'WAGON DETONATION. The gorge erupts.' });
      } else {
        moraleChanges.push({
          amount: 3,
          reason: 'Hit the wagon \u2014 something caught',
          source: 'action',
        });
        const pct = Math.round(state.wagonDamage);
        log.push({ turn, type: 'result', text: `Hit wagon. [Wagon damage: ${pct}%]` });
      }
    } else {
      moraleChanges.push({ amount: 0, reason: 'Missed the wagon', source: 'action' });
      log.push({ turn, type: 'result', text: 'Missed wagon.' });
    }
  }

  // Clear target
  state.gorgeTarget = undefined;

  return { hit, perceived: true, accuracy, perceptionRoll: 0, enemyDamage, moraleChanges, log };
}

// ============================================================
// GORGE PRESENT RESOLUTION (target selection, Part 3)
// ============================================================

export function resolveGorgePresent(
  state: BattleState,
  action: ActionId,
  volleyIdx: number,
): { moraleChanges: MoraleChange[]; log: LogEntry[] } {
  const def = VOLLEY_DEFS[volleyIdx];
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];

  state.player.stamina = Math.max(0, state.player.stamina - 6);

  if (action === ActionId.TargetColumn) {
    state.gorgeTarget = 'column';
    log.push({
      turn: state.turn,
      type: 'action',
      text: 'You aim into the packed ranks. At this range, into that mass, you can hardly miss. You pick a point in the white-coated column and hold steady.',
    });
  } else if (action === ActionId.TargetOfficers) {
    state.gorgeTarget = 'officers';
    log.push({
      turn: state.turn,
      type: 'action',
      text: 'You scan the gorge for the gorget, the sash, the man waving a sword. There \u2014 an officer trying to rally his men. You settle the front sight on him and hold your breath.',
    });
  } else if (action === ActionId.TargetWagon) {
    state.gorgeTarget = 'wagon';
    log.push({
      turn: state.turn,
      type: 'action',
      text: 'The ammunition wagon. Tilted on the gorge road, horses dead in the traces. You can see the powder kegs through the shattered sideboards. One good hit and...',
    });
  } else if (action === ActionId.ShowMercy) {
    state.gorgeTarget = undefined;
    state.gorgeMercyCount += 1;
    moraleChanges.push({
      amount: 3,
      reason: 'Compassion \u2014 you lowered your musket',
      source: 'action',
    });
    moraleChanges.push({ amount: -2, reason: 'Disobeying the order to fire', source: 'action' });
    log.push({
      turn: state.turn,
      type: 'action',
      text: 'You lower your musket. The men around you fire \u2014 the line pours its volley into the gorge \u2014 but your finger stays off the trigger.\n\nThese men are beaten. They are dying in a trap. You will not add to it.\n\nNo one notices. Or if they notice, no one says anything. Not here. Not now.',
    });
    // Line still fires even when player shows mercy
    state.enemy.strength = Math.max(0, state.enemy.strength - def.enemyLineDamage * 0.7);
    state.enemy.lineIntegrity = Math.max(0, state.enemy.lineIntegrity - def.enemyLineDamage * 0.5);
  }

  return { moraleChanges, log };
}
