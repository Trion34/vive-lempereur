import {
  BattleState, ActionId, DrillStep, MoraleThreshold,
  LogEntry, MoraleChange, Action, ScriptedFireResult,
  getMoraleThreshold, AutoVolleyResult,
  getHealthState,
} from '../types';
import { rollValor, rollGraduatedValor, applyMoraleChanges, rollAutoLoad, updateLineMorale } from './morale';
import { getAvailableActions } from './actions';
import { clampStat, rollD100 } from './stats';

// ============================================================
// VOLLEY DEFINITIONS
// ============================================================

export const VOLLEY_RANGES = [120, 80, 50, 25, 100, 60, 40, 200, 200, 200, 200] as const;

interface VolleyDef {
  range: number;
  fireAccuracyBase: number;
  aimBonus: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number;        // scripted damage to enemy strength from the line's volley
  restrictedActions: ActionId[];
}

export const VOLLEY_DEFS: VolleyDef[] = [
  { // Volley 1: 120 paces — first exchange
    range: 120,
    fireAccuracyBase: 0.20,
    aimBonus: 0.10,
    perceptionBase: 0.15,
    enemyReturnFireChance: 0.15,
    enemyReturnFireDamage: [8, 14],
    enemyLineDamage: 6,
    restrictedActions: [ActionId.HoldFire],
  },
  { // Volley 2: 80 paces — the test
    range: 80,
    fireAccuracyBase: 0.35,
    aimBonus: 0.12,
    perceptionBase: 0.30,
    enemyReturnFireChance: 0.25,
    enemyReturnFireDamage: [10, 18],
    enemyLineDamage: 10,
    restrictedActions: [],
  },
  { // Volley 3: 50 paces — the storm
    range: 50,
    fireAccuracyBase: 0.50,
    aimBonus: 0.15,
    perceptionBase: 0.70,
    enemyReturnFireChance: 0.40,
    enemyReturnFireDamage: [14, 24],
    enemyLineDamage: 15,
    restrictedActions: [],
  },
  { // Volley 4: 25 paces — point blank
    range: 25,
    fireAccuracyBase: 0.70,
    aimBonus: 0.10,
    perceptionBase: 0.95,
    enemyReturnFireChance: 0.50,
    enemyReturnFireDamage: [16, 28],
    enemyLineDamage: 20,
    restrictedActions: [],
  },
  { // Volley 5: 100 paces — fresh column, tired defenders
    range: 100,
    fireAccuracyBase: 0.30,
    aimBonus: 0.10,
    perceptionBase: 0.20,
    enemyReturnFireChance: 0.20,
    enemyReturnFireDamage: [8, 14],
    enemyLineDamage: 8,
    restrictedActions: [ActionId.HoldFire],
  },
  { // Volley 6: 60 paces — Pontare fallen, right exposed
    range: 60,
    fireAccuracyBase: 0.45,
    aimBonus: 0.12,
    perceptionBase: 0.40,
    enemyReturnFireChance: 0.30,
    enemyReturnFireDamage: [10, 20],
    enemyLineDamage: 12,
    restrictedActions: [],
  },
  { // Volley 7: 40 paces — desperate, surrounded
    range: 40,
    fireAccuracyBase: 0.60,
    aimBonus: 0.12,
    perceptionBase: 0.80,
    enemyReturnFireChance: 0.45,
    enemyReturnFireDamage: [14, 26],
    enemyLineDamage: 16,
    restrictedActions: [],
  },
  { // Volley 8: 200 paces — first gorge volley, shooting gallery
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.02,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 10,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
  { // Volley 9: 200 paces — Austrians try to climb, easy pickings
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.03,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 10,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
  { // Volley 10: 200 paces — column disintegrating, fewer targets
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.05,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 8,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
  { // Volley 11: 200 paces — final volley, wagon guaranteed
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.05,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 8,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
];

// ============================================================
// SCRIPTED FIRE RESOLUTION (hit/miss + perception)
// ============================================================

export function resolveScriptedFire(state: BattleState, actionId: ActionId): ScriptedFireResult {
  const def = VOLLEY_DEFS[state.scriptedVolley - 1];
  const { player } = state;
  const turn = state.turn;

  // Accuracy
  let accuracy = def.fireAccuracyBase;
  if (state.aimCarefullySucceeded) accuracy += def.aimBonus;
  accuracy += player.musketry / 500;
  if (player.heldFire) accuracy += 0.15;

  // Morale modifier
  if (player.moraleThreshold === MoraleThreshold.Shaken) accuracy *= 0.85;
  else if (player.moraleThreshold === MoraleThreshold.Wavering) accuracy *= 0.7;
  else if (player.moraleThreshold === MoraleThreshold.Breaking) accuracy *= 0.4;

  // SnapShot penalty
  if (actionId === ActionId.SnapShot) accuracy *= 0.3;

  accuracy = Math.min(0.90, Math.max(0.05, accuracy));

  const hitRoll = Math.random();
  const hit = hitRoll < accuracy;

  // Perception
  let perceptionChance = def.perceptionBase;
  if (state.aimCarefullySucceeded) perceptionChance += 0.15;
  perceptionChance += player.musketry / 200;
  perceptionChance = Math.min(0.95, Math.max(0.05, perceptionChance));

  const perceptionRoll = Math.random();
  const perceived = perceptionRoll < perceptionChance;

  // Enemy damage
  const enemyDamage = hit ? (player.heldFire ? 5 : 2.5) : 0;

  // Morale + narrative
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  const volleyIdx = state.scriptedVolley - 1;

  if (actionId === ActionId.SnapShot) {
    log.push({ turn, text: 'Snap shot. Wild.', type: 'result' });
    moraleChanges.push({ amount: -1, reason: 'Fired wild', source: 'action' });
  } else if (hit && perceived) {
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
    accuracy = 0.60 + (player.musketry / 500) + (player.awareness / 500);
    accuracy = Math.min(0.90, Math.max(0.30, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      enemyDamage = 5;
      moraleChanges.push({ amount: 2, reason: 'Your shot found its mark in the column', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Hit. Column.',
      });
    } else {
      moraleChanges.push({ amount: 1, reason: 'Fired into the gorge', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Fired into column.',
      });
    }
  } else if (target === 'officers') {
    // Medium accuracy — picking out a specific target
    accuracy = 0.30 + (player.musketry / 300) + (player.awareness / 400);
    accuracy = Math.min(0.70, Math.max(0.15, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      enemyDamage = 3;
      moraleChanges.push({ amount: 5, reason: 'You shot an Austrian officer', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Hit. Officer down.',
      });
    } else {
      moraleChanges.push({ amount: -1, reason: 'Missed the officer \u2014 wasted the shot', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Missed officer.',
      });
    }
  } else if (target === 'wagon') {
    // Hard accuracy — small, specific target
    accuracy = 0.15 + (player.musketry / 250) + (player.awareness / 350);
    accuracy = Math.min(0.50, Math.max(0.10, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      const damage = 30 + Math.random() * 15;
      state.wagonDamage += damage;
      enemyDamage = 0;

      if (state.wagonDamage >= 100) {
        // DETONATION
        state.wagonDamage = 100;
        state.enemy.strength = Math.max(0, state.enemy.strength - 30);
        moraleChanges.push({ amount: 15, reason: 'The ammunition wagon DETONATES', source: 'action' });
        log.push({ turn, type: 'result',
          text: 'WAGON DETONATION. The gorge erupts.',
        });
      } else {
        moraleChanges.push({ amount: 3, reason: 'Hit the wagon \u2014 something caught', source: 'action' });
        const pct = Math.round(state.wagonDamage);
        log.push({ turn, type: 'result',
          text: `Hit wagon. [Wagon damage: ${pct}%]`,
        });
      }
    } else {
      moraleChanges.push({ amount: 0, reason: 'Missed the wagon', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Missed wagon.',
      });
    }
  }

  // Clear target
  state.gorgeTarget = undefined;

  return { hit, perceived: true, accuracy, perceptionRoll: 0, enemyDamage, moraleChanges, log };
}

// ============================================================
// GORGE PRESENT RESOLUTION (target selection, Part 3)
// ============================================================

function resolveGorgePresent(
  state: BattleState, action: ActionId, volleyIdx: number
): { moraleChanges: MoraleChange[]; log: LogEntry[] } {
  const def = VOLLEY_DEFS[volleyIdx];
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];

  state.player.stamina = Math.max(0, state.player.stamina - 6);

  if (action === ActionId.TargetColumn) {
    state.gorgeTarget = 'column';
    log.push({ turn: state.turn, type: 'action',
      text: 'You aim into the packed ranks. At this range, into that mass, you can hardly miss. You pick a point in the white-coated column and hold steady.',
    });
  } else if (action === ActionId.TargetOfficers) {
    state.gorgeTarget = 'officers';
    log.push({ turn: state.turn, type: 'action',
      text: 'You scan the gorge for the gorget, the sash, the man waving a sword. There \u2014 an officer trying to rally his men. You settle the front sight on him and hold your breath.',
    });
  } else if (action === ActionId.TargetWagon) {
    state.gorgeTarget = 'wagon';
    log.push({ turn: state.turn, type: 'action',
      text: 'The ammunition wagon. Tilted on the gorge road, horses dead in the traces. You can see the powder kegs through the shattered sideboards. One good hit and...',
    });
  } else if (action === ActionId.ShowMercy) {
    state.gorgeTarget = undefined;
    state.gorgeMercyCount += 1;
    moraleChanges.push({ amount: 3, reason: 'Compassion \u2014 you lowered your musket', source: 'action' });
    moraleChanges.push({ amount: -2, reason: 'Disobeying the order to fire', source: 'action' });
    log.push({ turn: state.turn, type: 'action',
      text: 'You lower your musket. The men around you fire \u2014 the line pours its volley into the gorge \u2014 but your finger stays off the trigger.\n\nThese men are beaten. They are dying in a trap. You will not add to it.\n\nNo one notices. Or if they notice, no one says anything. Not here. Not now.',
    });
    // Line still fires even when player shows mercy
    state.enemy.strength = Math.max(0, state.enemy.strength - def.enemyLineDamage * 0.7);
    state.enemy.lineIntegrity = Math.max(0, state.enemy.lineIntegrity - def.enemyLineDamage * 0.5);
  }

  return { moraleChanges, log };
}

// ============================================================
// AUTO-RESOLVE GORGE VOLLEY (Part 3 auto-play)
// ============================================================

export function resolveAutoGorgeVolley(
  state: BattleState, volleyIdx: number, targetAction: ActionId
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
    state.player.heldFire = false;
    state.player.duckedLastTurn = false;
    state.volleysFired += 1;

    // Line damage
    const lineDmg = def.enemyLineDamage;
    state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - fireResult.enemyDamage);
    state.enemy.lineIntegrity = Math.max(0, state.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7);
  } else {
    // ShowMercy: line damage already applied in resolveGorgePresent, mark musket unfired
    state.player.musketLoaded = false;
    state.volleysFired += 1;
  }

  // Scripted events (FIRE step)
  const fireEvents = resolveScriptedEvents(state, DrillStep.Fire, targetAction);
  narratives.push(...fireEvents.log);
  moraleChanges.push(...fireEvents.moraleChanges);

  // Gorge: inject ENDURE events (no actual ENDURE step — one-sided)
  const endureEvents = resolveScriptedEvents(state, DrillStep.Endure, targetAction);
  narratives.push(...endureEvents.log);
  moraleChanges.push(...endureEvents.moraleChanges);

  const endureNarrative = getVolleyNarrative(volleyIdx, DrillStep.Endure, state);
  if (endureNarrative) {
    narratives.push({ turn, text: endureNarrative, type: 'narrative' });
  }

  // NO valor roll, NO return fire, NO line integrity roll (gorge is one-sided)

  // --- APPLY MORALE ---
  const { newMorale, threshold } = applyMoraleChanges(
    state.player.morale, state.player.maxMorale, moraleChanges, state.player.valor
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
  const loadResult = rollAutoLoad(state.player.morale, state.player.maxMorale, state.player.valor, state.player.musketry);
  state.lastLoadResult = loadResult;
  if (loadResult.success) {
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    state.player.turnsWithEmptyMusket = 0;
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

// ============================================================
// FIRE NARRATIVES (per volley × outcome)
// ============================================================

type FireOutcome = 'hit_seen' | 'hit_unseen' | 'miss_seen' | 'miss_unseen';

function getFireNarrative(volleyIdx: number, outcome: FireOutcome, _state: BattleState): string {
  const narratives: Record<number, Record<FireOutcome, string>> = {
    0: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    1: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    2: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    3: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    4: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    5: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    6: { hit_seen: 'Hit. Target down.', hit_unseen: 'Fired. Result unknown.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    // Gorge fire narratives are handled by resolveGorgeFire — these are fallbacks
    7: { hit_seen: 'Hit. Gorge.', hit_unseen: 'Fired into gorge.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    8: { hit_seen: 'Hit. Gorge.', hit_unseen: 'Fired into gorge.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    9: { hit_seen: 'Hit. Gorge.', hit_unseen: 'Fired into gorge.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
    10: { hit_seen: 'Hit. Gorge.', hit_unseen: 'Fired into gorge.', miss_seen: 'Miss.', miss_unseen: 'Fired.' },
  };

  return narratives[volleyIdx]?.[outcome] || 'The volley crashes out.';
}

// ============================================================
// VOLLEY NARRATIVES (per volley × drill step)
// ============================================================

export function getVolleyNarrative(
  volleyIdx: number, step: DrillStep, state: BattleState
): string {
  const range = VOLLEY_DEFS[volleyIdx].range;

  // FIRE narratives (captain's order — appears before fire resolution)
  if (step === DrillStep.Fire) {
    const fireOrders: Record<number, string> = {
      0: `"Feu!"`,
      1: `"FIRE!"`,
      2: `"FIRE!"`,
      3: `"Tirez!"`,
      4: `"Feu!"`,
      5: `"FIRE!"`,
      6: `"TIREZ!"`,
      7: `"Fire at will!"`,
      8: `"Again!"`,
      9: `"Fire!"`,
      10: `"Final volley!"`,
    };
    return fireOrders[volleyIdx] || '"FIRE!"';
  }

  // PRESENT narratives
  if (step === DrillStep.Present) {
    const presentNarratives: Record<number, string> = {
      0: `Present arms. ${range} paces.`,
      1: `Present. 80 paces.`,
      2: `Present. 50 paces.`,
      3: `Present. 25 paces. Last volley.`,
      4: `Present. ${range} paces. Fresh column.`,
      5: `Present. 60 paces. Right flank open.`,
      6: `Present. 40 paces. Last volley.`,
      7: `Fire at will. Gorge below.`,
      8: `Reload. More targets below.`,
      9: `Column breaking. Wagon visible.`,
      10: `Last column. Wagon exposed.`,
    };
    let text = presentNarratives[volleyIdx] || '';

    if (state.player.moraleThreshold === MoraleThreshold.Shaken) {
      text += ' Hands unsteady.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Wavering) {
      text += ' Want to run.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Breaking) {
      text += ' Can\'t stop shaking.';
    }
    return text;
  }

  // ENDURE narratives
  if (step === DrillStep.Endure) {
    const endureNarratives: Record<number, string> = {
      0: 'Return fire.',
      1: 'Return fire.',
      2: 'Return fire. Men fall.',
      3: 'Fix bayonets.',
      4: 'Return fire. Fresh muskets.',
      5: 'Return fire. Surrounded.',
      6: 'Bonaparte on the ridge. Counterattack ordered.',
      7: 'Scattered return fire from below.',
      8: 'Screams from below.',
      9: 'Wounded call for help.',
      10: 'Silence. It\'s over.',
    };
    return endureNarratives[volleyIdx] || '';
  }

  return '';
}

// ============================================================
// SCRIPTED EVENTS (per volley × drill step)
// ============================================================

export function resolveScriptedEvents(
  state: BattleState, step: DrillStep, actionId: ActionId
): { log: LogEntry[]; moraleChanges: MoraleChange[] } {
  const volleyIdx = state.scriptedVolley - 1;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  // === VOLLEY 1 EVENTS ===
  if (volleyIdx === 0) {
    if (step === DrillStep.Fire) {
      // Successful volley recovery
      log.push({ turn, text: 'First volley hit.', type: 'event' });
      moraleChanges.push({ amount: 2, reason: 'First volley struck home', source: 'recovery' });
    }
    if (step === DrillStep.Endure) {
      // Sounds of battle from the right flank
      log.push({ turn, text: 'Fighting on the right.', type: 'event' });
      moraleChanges.push({ amount: -4, reason: 'Sounds of battle on the right', source: 'event' });
      // Range pressure + recovery (replaces passive drain system during scripted phase)
      moraleChanges.push({ amount: -2, reason: 'Under fire at medium range', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
      // Neighbour contagion
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        const t = getMoraleThreshold(state.line.leftNeighbour.morale, state.line.leftNeighbour.maxMorale);
        moraleChanges.push({ amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0, reason: `${state.line.leftNeighbour.name} stands firm`, source: 'contagion' });
      }
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        const t = getMoraleThreshold(state.line.rightNeighbour.morale, state.line.rightNeighbour.maxMorale);
        moraleChanges.push({ amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0, reason: `${state.line.rightNeighbour.name} stands firm`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 2 EVENTS ===
  if (volleyIdx === 1) {
    if (step === DrillStep.Fire) {
      // First visible casualty in your section
      log.push({ turn, text: 'Man killed nearby.', type: 'event' });
      moraleChanges.push({ amount: -3, reason: 'Man killed in your section', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 3);
    }
    if (step === DrillStep.Endure) {
      // Range pressure + recovery
      moraleChanges.push({ amount: -3, reason: 'Enemy at close range', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums hold steady', source: 'recovery' });
      // Neighbour contagion
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        moraleChanges.push({ amount: 2, reason: `${state.line.leftNeighbour.name} stands firm`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 3 EVENTS ===
  if (volleyIdx === 2) {
    if (step === DrillStep.Present) {
      // Pierre is grazed — wounded but keeps fighting
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.wounded) {
        log.push({ turn, type: 'event', text: 'Pierre hit. Shoulder. Still fighting.' });
        moraleChanges.push({ amount: -6, reason: 'Pierre is hit — wounded but fighting', source: 'event' });
        state.line.leftNeighbour.wounded = true;
        state.line.leftNeighbour.morale = Math.max(0, state.line.leftNeighbour.morale - 15);
        state.line.casualtiesThisTurn += 1;
      }

      // Officer dismounts
      if (state.line.officer.alive && state.line.officer.mounted) {
        state.line.officer.mounted = false;
        state.line.officer.status = 'On foot, rallying';
      }

    }
    if (step === DrillStep.Endure) {
      // Artillery ceases — too close
      state.enemy.artillery = false;
      log.push({ turn, text: 'Artillery silent. Too close.', type: 'event' });

      // Reports of pressure on the left
      log.push({ turn, text: 'Left flank under pressure.', type: 'event' });
      moraleChanges.push({ amount: -5, reason: 'Left flank under pressure', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({ turn, text: 'Leclerc: "Steady, Fourteenth!"', type: 'event' });
        moraleChanges.push({ amount: 4, reason: 'Captain rallies the line', source: 'recovery' });
      }
      // Range pressure + contagion
      moraleChanges.push({ amount: -4, reason: 'Enemy at close range', source: 'passive' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        moraleChanges.push({ amount: state.line.leftNeighbour.wounded ? 1 : 2, reason: `${state.line.leftNeighbour.name} holds the line`, source: 'contagion' });
      }
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        const t = getMoraleThreshold(state.line.rightNeighbour.morale, state.line.rightNeighbour.maxMorale);
        const amt = t === MoraleThreshold.Steady || t === MoraleThreshold.Shaken ? 1 : -2;
        moraleChanges.push({ amount: amt, reason: `${state.line.rightNeighbour.name} ${amt > 0 ? 'holds on' : 'is trembling'}`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 4 EVENTS ===
  if (volleyIdx === 3) {
    if (step === DrillStep.Present) {
      // Enemy at point blank, left flank news
      log.push({ turn, type: 'event', text: 'Enemy charging. Left flank breaking.' });
      moraleChanges.push({ amount: -4, reason: 'The enemy is charging', source: 'event' });
      moraleChanges.push({ amount: -3, reason: 'Left flank is breaking', source: 'event' });
      state.enemy.morale = 'charging';
    }
    if (step === DrillStep.Endure) {
      // Bayonets fixed
      log.push({ turn, type: 'event', text: 'Bayonets fixed.' });

      // Pierre fixes bayonet
      if (state.line.leftNeighbour?.alive) {
        log.push({ turn, type: 'event', text: 'Pierre fixes bayonet. Still fighting.' });
        moraleChanges.push({ amount: 2, reason: 'Pierre\'s courage', source: 'recovery' });
      }

      // Range pressure at point blank
      moraleChanges.push({ amount: -5, reason: 'Point blank — they\'re right there', source: 'passive' });
    }
  }

  // === VOLLEY 5 EVENTS (Part 2) ===
  if (volleyIdx === 4) {
    if (step === DrillStep.Present) {
      // Vukassovich artillery resumes
      state.enemy.artillery = true;
      log.push({ turn, type: 'event', text: 'Vukassovich guns open.' });
      moraleChanges.push({ amount: -5, reason: 'Vukassovich\'s artillery resumes', source: 'event' });
      log.push({ turn, type: 'event', text: 'Mass\u00e9na still fighting.' });
      moraleChanges.push({ amount: 3, reason: 'Mass\u00e9na\'s presence steadies the line', source: 'recovery' });
    }
    if (step === DrillStep.Endure) {
      // Reuss attacking the Pontare
      log.push({ turn, type: 'event', text: 'Reuss attacks the Pontare.' });
      moraleChanges.push({ amount: -4, reason: 'Reuss attacking the Pontare', source: 'event' });
      moraleChanges.push({ amount: -2, reason: 'Under fire \u2014 tired arms, fresh enemy', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({ turn, type: 'event', text: 'Pierre reloads beside you.' });
        moraleChanges.push({ amount: 2, reason: `${state.line.leftNeighbour.name} holds the line`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 6 EVENTS (Part 2) ===
  if (volleyIdx === 5) {
    if (step === DrillStep.Present) {
      // Pontare has fallen
      log.push({ turn, type: 'event', text: 'Pontare fallen. Right flank exposed.' });
      moraleChanges.push({ amount: -6, reason: 'The Pontare has fallen \u2014 right flank exposed', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({ turn, type: 'event', text: 'Leclerc: "Hold the line!"' });
        moraleChanges.push({ amount: 3, reason: 'Captain rallies the line', source: 'recovery' });
      }
    }
    if (step === DrillStep.Endure) {
      // Lusignan spotted — surrounded
      log.push({ turn, type: 'event', text: 'Lusignan at Affi. Surrounded.' });
      moraleChanges.push({ amount: -8, reason: 'Surrounded \u2014 Lusignan at Affi', source: 'event' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({ turn, type: 'event', text: 'Pierre: "We\'ve been in worse."' });
        moraleChanges.push({ amount: 3, reason: 'Pierre: "We\'ve been in worse"', source: 'contagion' });
      }
      // Range pressure
      moraleChanges.push({ amount: -3, reason: 'Under fire at close range \u2014 exhausted', source: 'passive' });
    }
  }

  // === VOLLEY 7 EVENTS (Part 2) ===
  if (volleyIdx === 6) {
    if (step === DrillStep.Present) {
      // Men breaking in rear
      log.push({ turn, type: 'event', text: 'Men breaking in the rear.' });
      moraleChanges.push({ amount: -5, reason: 'Men breaking in the rear', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 8);
    }
    if (step === DrillStep.Endure) {
      // Napoleon orders counterattack — the great reversal
      log.push({ turn, type: 'event', text: 'Bonaparte on the ridge. Counterattack ordered.' });
      moraleChanges.push({ amount: 10, reason: 'Napoleon orders the counterattack', source: 'recovery' });
      if (state.line.officer.alive) {
        log.push({ turn, type: 'event', text: 'Leclerc: "To the ridge!"' });
        moraleChanges.push({ amount: 5, reason: 'Captain: "To the ridge!"', source: 'recovery' });
      }
      // Range pressure (but offset by the massive recovery)
      moraleChanges.push({ amount: -4, reason: 'Under fire at close range', source: 'passive' });
    }
  }

  // === VOLLEY 8 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 7) {
    if (step === DrillStep.Endure) {
      log.push({ turn, type: 'event', text: 'Men surrendering below. Column still advancing.' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({ turn, type: 'event', text: 'Pierre: "Butcher\'s work." Reloads anyway.' });
      }
      moraleChanges.push({ amount: -1, reason: 'Minimal return fire \u2014 but the horror begins', source: 'passive' });
    }
  }

  // === VOLLEY 9 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 8) {
    if (step === DrillStep.Endure) {
      log.push({ turn, type: 'event', text: 'Screams from below.' });
      moraleChanges.push({ amount: -3, reason: 'The sound of trapped men dying', source: 'event' });
      if (state.player.awareness > 40) {
        log.push({ turn, type: 'event', text: 'A boy among the dying.' });
        moraleChanges.push({ amount: -2, reason: 'A boy among the dying', source: 'event' });
      }
    }
  }

  // === VOLLEY 10 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 9) {
    if (step === DrillStep.Endure) {
      log.push({ turn, type: 'event', text: 'Cries for help. Some men stop firing.' });
      moraleChanges.push({ amount: -4, reason: 'This is no longer battle \u2014 it\'s slaughter', source: 'event' });
      if (state.gorgeMercyCount > 0) {
        log.push({ turn, type: 'event', text: 'You showed mercy.' });
        moraleChanges.push({ amount: 3, reason: 'At least you showed mercy', source: 'recovery' });
      }
    }
  }

  // === VOLLEY 11 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 10) {
    if (step === DrillStep.Endure) {
      if (state.wagonDamage < 100) {
        // Scripted wagon detonation — artillery hits it
        log.push({ turn, type: 'event', text: 'Artillery hits wagon. DETONATION.' });
        state.wagonDamage = 100;
        state.enemy.strength = Math.max(0, state.enemy.strength - 30);
        moraleChanges.push({ amount: 10, reason: 'The ammunition wagon detonates \u2014 artillery hit', source: 'event' });
      } else {
        // Already detonated by player
        log.push({ turn, type: 'event', text: 'The gorge is silent. White flags.' });
        moraleChanges.push({ amount: 3, reason: 'The gorge falls silent', source: 'recovery' });
      }
    }
  }

  return { log, moraleChanges };
}

// ============================================================
// SCRIPTED RETURN FIRE (ENDURE step)
// ============================================================

export function resolveScriptedReturnFire(
  state: BattleState, volleyIdx: number
): { moraleChanges: MoraleChange[]; log: LogEntry[]; healthDamage: number } {
  const def = VOLLEY_DEFS[volleyIdx];
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  let healthDamage = 0;

  let hitChance = state.player.duckedLastTurn ? def.enemyReturnFireChance * 0.3 : def.enemyReturnFireChance;
  // Front rank: +15% return fire chance during Part 1 (most exposed position)
  if (state.player.frontRank && state.battlePart === 1) {
    hitChance += 0.15;
  }

  if (Math.random() < hitChance) {
    const [min, max] = def.enemyReturnFireDamage;
    healthDamage = min + Math.floor(Math.random() * (max - min));

    // Fatal hit check (only at close range — volleys 3-4; volleys 1-2 are wounds only)
    const fatalChance = volleyIdx >= 2 ? 0.12 : 0;
    if (fatalChance > 0 && Math.random() < fatalChance) {
      healthDamage = 999; // Will trigger death
      log.push({ turn: state.turn, text: 'Fatal hit.', type: 'event' });
    } else {
      moraleChanges.push({ amount: -8, reason: 'You\'ve been hit', source: 'event' });
      const wounds = ['arm', 'shoulder', 'thigh', 'side', 'hand'];
      const wound = wounds[Math.floor(Math.random() * wounds.length)];
      log.push({ turn: state.turn, type: 'event', text: `Hit. ${wound}. Still standing.` });
    }
  }

  return { moraleChanges, log, healthDamage };
}

// ============================================================
// SCRIPTED AVAILABLE ACTIONS
// ============================================================

export function getScriptedAvailableActions(state: BattleState): Action[] {
  const volleyIdx = state.scriptedVolley - 1;
  if (volleyIdx < 0 || volleyIdx > 10) return getAvailableActions(state);

  // Gorge-specific actions (Part 3)
  if (state.battlePart === 3) {
    if (state.drillStep === DrillStep.Present) {
      return [
        { id: ActionId.TargetColumn, name: 'Target the Column',
          description: 'Fire into the packed ranks below. Easy target. Devastating.',
          minThreshold: MoraleThreshold.Breaking, available: true, drillStep: DrillStep.Present },
        { id: ActionId.TargetOfficers, name: 'Target an Officer',
          description: 'Pick out the man with the gorget and sash. Harder shot \u2014 bigger effect.',
          minThreshold: MoraleThreshold.Shaken, available: true, drillStep: DrillStep.Present },
        { id: ActionId.TargetWagon, name: 'Target the Ammo Wagon',
          description: 'The powder wagon, tilted on the gorge road. One good hit...',
          minThreshold: MoraleThreshold.Shaken, available: state.wagonDamage < 100, drillStep: DrillStep.Present },
        { id: ActionId.ShowMercy, name: 'Show Mercy',
          description: 'Lower your musket. These men are already beaten. The line fires without you.',
          minThreshold: MoraleThreshold.Breaking, available: true, drillStep: DrillStep.Present },
      ];
    }
    if (state.drillStep === DrillStep.Fire) {
      return [
        { id: ActionId.Fire, name: 'Fire', description: 'Fire into the gorge.',
          minThreshold: MoraleThreshold.Breaking, available: true, drillStep: DrillStep.Fire },
      ];
    }
    return getAvailableActions(state);
  }

  // Normal scripted volleys (Parts 1 & 2)
  let actions = getAvailableActions(state);
  const def = VOLLEY_DEFS[volleyIdx];

  // Remove restricted actions for this volley
  actions = actions.filter(a => !def.restrictedActions.includes(a.id));


  return actions;
}

// ============================================================
// LINE INTEGRITY ROLL (auto-play)
// ============================================================

export function rollLineIntegrity(
  state: BattleState, volleyIdx: number
): { integrityChange: number; enemyExtraDamage: number; narrative: string } {
  const def = VOLLEY_DEFS[volleyIdx];

  // French roll: base = lineIntegrity × 0.6 + officer bonus + drums bonus
  const officerBonus = state.line.officer.alive ? 10 : 0;
  const drumsBonus = state.line.drumsPlaying ? 5 : 0;
  const frenchBase = state.line.lineIntegrity * 0.6 + officerBonus + drumsBonus;
  const frenchRoll = rollD100();

  // Austrian roll: base = enemy strength × 0.5 + range pressure
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

export function resolveAutoVolley(
  state: BattleState, volleyIdx: number
): AutoVolleyResult {
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

  // --- FIRE: Auto-select PresentArms + Fire ---
  const fireOrder = getVolleyNarrative(volleyIdx, DrillStep.Fire, state);
  if (fireOrder) {
    narratives.push({ turn, text: fireOrder, type: 'narrative' });
  }

  // Resolve scripted fire (auto: always Fire, not SnapShot or HoldFire)
  state.aimCarefullySucceeded = false; // no manual aim in auto-play
  const fireResult = resolveScriptedFire(state, ActionId.Fire);
  moraleChanges.push(...fireResult.moraleChanges);
  narratives.push(...fireResult.log);
  state.player.musketLoaded = false;
  state.player.heldFire = false;
  state.player.duckedLastTurn = false;
  state.volleysFired += 1;

  // Scripted enemy damage
  const lineDmg = def.enemyLineDamage;
  state.enemy.strength = Math.max(0, state.enemy.strength - lineDmg - fireResult.enemyDamage);
  state.enemy.lineIntegrity = Math.max(0, state.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7);

  // Scripted events (FIRE step)
  const fireEvents = resolveScriptedEvents(state, DrillStep.Fire, ActionId.Fire);
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
  const endureEvents = resolveScriptedEvents(state, DrillStep.Endure, ActionId.StandFirm);
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
    state.enemy.lineIntegrity = Math.max(0, state.enemy.lineIntegrity - lineResult.enemyExtraDamage * 0.7);
  }
  narratives.push({ turn, text: lineResult.narrative, type: 'event' });

  // --- APPLY MORALE ---
  const { newMorale, threshold } = applyMoraleChanges(
    state.player.morale, state.player.maxMorale, moraleChanges, state.player.valor
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
  const loadResult = rollAutoLoad(state.player.morale, state.player.maxMorale, state.player.valor, state.player.musketry);
  state.lastLoadResult = loadResult;
  if (loadResult.success) {
    state.player.musketLoaded = true;
    state.player.fumbledLoad = false;
    state.player.turnsWithEmptyMusket = 0;
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
