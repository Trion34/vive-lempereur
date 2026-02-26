import type { BattleState, LogEntry, MoraleChange } from '../../../types';
import { DrillStep, MoraleThreshold } from '../../../types/enums';
import { getMoraleThreshold } from '../../../types/thresholds';
import type { VolleyConfig, VolleyEventResult } from '../types';

// ============================================================
// Per-volley event functions (extracted from volleys/events.ts switch)
// ============================================================

function volley1Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Fire) {
    log.push({ turn, text: 'First volley hit.', type: 'event' });
    moraleChanges.push({ amount: 2, reason: 'First volley struck home', source: 'recovery' });
  }
  if (step === DrillStep.Endure) {
    log.push({ turn, text: 'Fighting on the right.', type: 'event' });
    moraleChanges.push({ amount: -4, reason: 'Sounds of battle on the right', source: 'event' });
    moraleChanges.push({ amount: -2, reason: 'Under fire at medium range', source: 'passive' });
    moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
      const t = getMoraleThreshold(
        state.line.leftNeighbour.morale,
        state.line.leftNeighbour.maxMorale,
      );
      moraleChanges.push({
        amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0,
        reason: `${state.line.leftNeighbour.name} stands firm`,
        source: 'contagion',
      });
    }
    if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
      const t = getMoraleThreshold(
        state.line.rightNeighbour.morale,
        state.line.rightNeighbour.maxMorale,
      );
      moraleChanges.push({
        amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0,
        reason: `${state.line.rightNeighbour.name} stands firm`,
        source: 'contagion',
      });
    }
  }
  return { log, moraleChanges };
}

function volley2Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Fire) {
    log.push({ turn, text: 'Man killed nearby.', type: 'event' });
    moraleChanges.push({ amount: -3, reason: 'Man killed in your section', source: 'event' });
    state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 3);
  }
  if (step === DrillStep.Endure) {
    moraleChanges.push({ amount: -3, reason: 'Enemy at close range', source: 'passive' });
    moraleChanges.push({ amount: 2, reason: 'The drums hold steady', source: 'recovery' });
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
      moraleChanges.push({
        amount: 2,
        reason: `${state.line.leftNeighbour.name} stands firm`,
        source: 'contagion',
      });
    }
  }
  return { log, moraleChanges };
}

function volley3Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Present) {
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.wounded) {
      log.push({ turn, type: 'event', text: 'Pierre hit. Shoulder. Still fighting.' });
      moraleChanges.push({
        amount: -6,
        reason: 'Pierre is hit \u2014 wounded but fighting',
        source: 'event',
      });
      state.line.leftNeighbour.wounded = true;
      state.line.leftNeighbour.morale = Math.max(0, state.line.leftNeighbour.morale - 15);
      state.line.casualtiesThisTurn += 1;
    }
    if (state.line.officer.alive && state.line.officer.mounted) {
      state.line.officer.mounted = false;
      state.line.officer.status = 'On foot, rallying';
    }
  }
  if (step === DrillStep.Endure) {
    state.enemy.artillery = false;
    log.push({ turn, text: 'Artillery silent. Too close.', type: 'event' });
    log.push({ turn, text: 'Left flank under pressure.', type: 'event' });
    moraleChanges.push({ amount: -5, reason: 'Left flank under pressure', source: 'event' });
    state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);
    if (state.line.officer.alive) {
      log.push({ turn, text: 'Leclerc: "Steady, Fourteenth!"', type: 'event' });
      moraleChanges.push({ amount: 4, reason: 'Captain rallies the line', source: 'recovery' });
    }
    moraleChanges.push({ amount: -4, reason: 'Enemy at close range', source: 'passive' });
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
      moraleChanges.push({
        amount: state.line.leftNeighbour.wounded ? 1 : 2,
        reason: `${state.line.leftNeighbour.name} holds the line`,
        source: 'contagion',
      });
    }
    if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
      const t = getMoraleThreshold(
        state.line.rightNeighbour.morale,
        state.line.rightNeighbour.maxMorale,
      );
      const amt = t === MoraleThreshold.Steady || t === MoraleThreshold.Shaken ? 1 : -2;
      moraleChanges.push({
        amount: amt,
        reason: `${state.line.rightNeighbour.name} ${amt > 0 ? 'holds on' : 'is trembling'}`,
        source: 'contagion',
      });
    }
  }
  return { log, moraleChanges };
}

function volley4Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Present) {
    log.push({ turn, type: 'event', text: 'Enemy charging. Left flank breaking.' });
    moraleChanges.push({ amount: -4, reason: 'The enemy is charging', source: 'event' });
    moraleChanges.push({ amount: -3, reason: 'Left flank is breaking', source: 'event' });
    state.enemy.morale = 'charging';
  }
  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Bayonets fixed.' });
    if (state.line.leftNeighbour?.alive) {
      log.push({ turn, type: 'event', text: 'Pierre fixes bayonet. Still fighting.' });
      moraleChanges.push({ amount: 2, reason: "Pierre's courage", source: 'recovery' });
    }
    moraleChanges.push({
      amount: -5,
      reason: "Point blank \u2014 they're right there",
      source: 'passive',
    });
  }
  return { log, moraleChanges };
}

function volley5Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Present) {
    state.enemy.artillery = true;
    log.push({ turn, type: 'event', text: 'Vukassovich guns open.' });
    moraleChanges.push({
      amount: -5,
      reason: "Vukassovich's artillery resumes",
      source: 'event',
    });
    log.push({ turn, type: 'event', text: 'Mass\u00e9na still fighting.' });
    moraleChanges.push({
      amount: 3,
      reason: "Mass\u00e9na's presence steadies the line",
      source: 'recovery',
    });
  }
  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Reuss attacks the Pontare.' });
    moraleChanges.push({ amount: -4, reason: 'Reuss attacking the Pontare', source: 'event' });
    moraleChanges.push({
      amount: -2,
      reason: 'Under fire \u2014 tired arms, fresh enemy',
      source: 'passive',
    });
    moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
      log.push({ turn, type: 'event', text: 'Pierre reloads beside you.' });
      moraleChanges.push({
        amount: 2,
        reason: `${state.line.leftNeighbour.name} holds the line`,
        source: 'contagion',
      });
    }
  }
  return { log, moraleChanges };
}

function volley6Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Present) {
    log.push({ turn, type: 'event', text: 'Pontare fallen. Right flank exposed.' });
    moraleChanges.push({
      amount: -6,
      reason: 'The Pontare has fallen \u2014 right flank exposed',
      source: 'event',
    });
    state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);
    if (state.line.officer.alive) {
      log.push({ turn, type: 'event', text: 'Leclerc: "Hold the line!"' });
      moraleChanges.push({ amount: 3, reason: 'Captain rallies the line', source: 'recovery' });
    }
  }
  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Lusignan at Affi. Surrounded.' });
    moraleChanges.push({
      amount: -8,
      reason: 'Surrounded \u2014 Lusignan at Affi',
      source: 'event',
    });
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
      log.push({ turn, type: 'event', text: 'Pierre: "We\'ve been in worse."' });
      moraleChanges.push({
        amount: 3,
        reason: 'Pierre: "We\'ve been in worse"',
        source: 'contagion',
      });
    }
    moraleChanges.push({
      amount: -3,
      reason: 'Under fire at close range \u2014 exhausted',
      source: 'passive',
    });
  }
  return { log, moraleChanges };
}

function volley7Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Present) {
    log.push({ turn, type: 'event', text: 'Men breaking in the rear.' });
    moraleChanges.push({ amount: -5, reason: 'Men breaking in the rear', source: 'event' });
    state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 8);
  }
  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Bonaparte on the ridge. Counterattack ordered.' });
    moraleChanges.push({
      amount: 10,
      reason: 'Napoleon orders the counterattack',
      source: 'recovery',
    });
    if (state.line.officer.alive) {
      log.push({ turn, type: 'event', text: 'Leclerc: "To the ridge!"' });
      moraleChanges.push({ amount: 5, reason: 'Captain: "To the ridge!"', source: 'recovery' });
    }
    moraleChanges.push({ amount: -4, reason: 'Under fire at close range', source: 'passive' });
  }
  return { log, moraleChanges };
}

function volley8Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Men surrendering below. Column still advancing.' });
    if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
      log.push({ turn, type: 'event', text: 'Pierre: "Butcher\'s work." Reloads anyway.' });
    }
    moraleChanges.push({
      amount: -1,
      reason: 'Minimal return fire \u2014 but the horror begins',
      source: 'passive',
    });
  }
  return { log, moraleChanges };
}

function volley9Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Screams from below.' });
    moraleChanges.push({ amount: -3, reason: 'The sound of trapped men dying', source: 'event' });
    if (state.player.awareness > 40) {
      log.push({ turn, type: 'event', text: 'A boy among the dying.' });
      moraleChanges.push({ amount: -2, reason: 'A boy among the dying', source: 'event' });
    }
  }
  return { log, moraleChanges };
}

function volley10Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Endure) {
    log.push({ turn, type: 'event', text: 'Cries for help. Some men stop firing.' });
    moraleChanges.push({
      amount: -4,
      reason: "This is no longer battle \u2014 it's slaughter",
      source: 'event',
    });
    if ((state.ext.gorgeMercyCount as number) > 0) {
      log.push({ turn, type: 'event', text: 'You showed mercy.' });
      moraleChanges.push({ amount: 3, reason: 'At least you showed mercy', source: 'recovery' });
    }
  }
  return { log, moraleChanges };
}

function volley11Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Endure) {
    if ((state.ext.wagonDamage as number) < 100) {
      log.push({ turn, type: 'event', text: 'Artillery hits wagon. DETONATION.' });
      state.ext.wagonDamage = 100;
      state.enemy.strength = Math.max(0, state.enemy.strength - 30);
      moraleChanges.push({
        amount: 10,
        reason: 'The ammunition wagon detonates \u2014 artillery hit',
        source: 'event',
      });
    } else {
      log.push({ turn, type: 'event', text: 'The gorge is silent. White flags.' });
      moraleChanges.push({ amount: 3, reason: 'The gorge falls silent', source: 'recovery' });
    }
  }
  return { log, moraleChanges };
}

function noEvents(): VolleyEventResult {
  return { log: [], moraleChanges: [] };
}

// ============================================================
// RIVOLI VOLLEY CONFIGS
// ============================================================

export const RIVOLI_VOLLEYS: VolleyConfig[] = [
  {
    // Volley 1: 120 paces — first exchange
    def: {
      range: 120,
      fireAccuracyBase: 0.2,
      perceptionBase: 0.15,
      enemyReturnFireChance: 0.15,
      enemyReturnFireDamage: [8, 14],
      enemyLineDamage: 6,
    },
    narratives: {
      fireOrder: '"Feu!"',
      present: 'Present arms. 120 paces.',
      endure: 'Return fire.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley1Events,
    returnFire: { frontRankBonus: 0.15, fatalChance: 0 },
  },
  {
    // Volley 2: 80 paces — the test
    def: {
      range: 80,
      fireAccuracyBase: 0.35,
      perceptionBase: 0.3,
      enemyReturnFireChance: 0.25,
      enemyReturnFireDamage: [10, 18],
      enemyLineDamage: 10,
    },
    narratives: {
      fireOrder: '"FIRE!"',
      present: 'Present. 80 paces.',
      endure: 'Return fire.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley2Events,
    returnFire: { frontRankBonus: 0.15, fatalChance: 0 },
  },
  {
    // Volley 3: 50 paces — the storm
    def: {
      range: 50,
      fireAccuracyBase: 0.5,
      perceptionBase: 0.7,
      enemyReturnFireChance: 0.4,
      enemyReturnFireDamage: [14, 24],
      enemyLineDamage: 15,
    },
    narratives: {
      fireOrder: '"FIRE!"',
      present: 'Present. 50 paces.',
      endure: 'Return fire. Men fall.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley3Events,
    returnFire: { frontRankBonus: 0.15, fatalChance: 0.12 },
  },
  {
    // Volley 4: 25 paces — point blank
    def: {
      range: 25,
      fireAccuracyBase: 0.7,
      perceptionBase: 0.95,
      enemyReturnFireChance: 0.5,
      enemyReturnFireDamage: [16, 28],
      enemyLineDamage: 20,
    },
    narratives: {
      fireOrder: '"Tirez!"',
      present: 'Present. 25 paces. Last volley.',
      endure: 'Fix bayonets.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley4Events,
    returnFire: { frontRankBonus: 0.15, fatalChance: 0.12 },
  },
  {
    // Volley 5: 100 paces — fresh column, tired defenders
    def: {
      range: 100,
      fireAccuracyBase: 0.3,
      perceptionBase: 0.2,
      enemyReturnFireChance: 0.2,
      enemyReturnFireDamage: [8, 14],
      enemyLineDamage: 8,
    },
    narratives: {
      fireOrder: '"Feu!"',
      present: 'Present. 100 paces. Fresh column.',
      endure: 'Return fire. Fresh muskets.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley5Events,
  },
  {
    // Volley 6: 60 paces — Pontare fallen, right exposed
    def: {
      range: 60,
      fireAccuracyBase: 0.45,
      perceptionBase: 0.4,
      enemyReturnFireChance: 0.3,
      enemyReturnFireDamage: [10, 20],
      enemyLineDamage: 12,
    },
    narratives: {
      fireOrder: '"FIRE!"',
      present: 'Present. 60 paces. Right flank open.',
      endure: 'Return fire. Surrounded.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley6Events,
  },
  {
    // Volley 7: 40 paces — desperate, surrounded
    def: {
      range: 40,
      fireAccuracyBase: 0.6,
      perceptionBase: 0.8,
      enemyReturnFireChance: 0.45,
      enemyReturnFireDamage: [14, 26],
      enemyLineDamage: 16,
    },
    narratives: {
      fireOrder: '"TIREZ!"',
      present: 'Present. 40 paces. Last volley.',
      endure: 'Bonaparte on the ridge. Counterattack ordered.',
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    events: volley7Events,
  },
  {
    // Volley 8: 200 paces — first gorge volley
    def: {
      range: 200,
      fireAccuracyBase: 0.5,
      perceptionBase: 0.9,
      enemyReturnFireChance: 0.02,
      enemyReturnFireDamage: [3, 6],
      enemyLineDamage: 10,
    },
    narratives: {
      fireOrder: '"Fire at will!"',
      present: 'Fire at will. Gorge below.',
      endure: 'Scattered return fire from below.',
      fireHit: ['Hit. Gorge.'],
      fireMiss: ['Miss.'],
    },
    events: volley8Events,
  },
  {
    // Volley 9: 200 paces — easy pickings
    def: {
      range: 200,
      fireAccuracyBase: 0.5,
      perceptionBase: 0.9,
      enemyReturnFireChance: 0.03,
      enemyReturnFireDamage: [3, 6],
      enemyLineDamage: 10,
    },
    narratives: {
      fireOrder: '"Again!"',
      present: 'Reload. More targets below.',
      endure: 'Screams from below.',
      fireHit: ['Hit. Gorge.'],
      fireMiss: ['Miss.'],
    },
    events: volley9Events,
  },
  {
    // Volley 10: 200 paces — column disintegrating
    def: {
      range: 200,
      fireAccuracyBase: 0.5,
      perceptionBase: 0.9,
      enemyReturnFireChance: 0.05,
      enemyReturnFireDamage: [3, 6],
      enemyLineDamage: 8,
    },
    narratives: {
      fireOrder: '"Fire!"',
      present: 'Column breaking. Wagon visible.',
      endure: 'Wounded call for help.',
      fireHit: ['Hit. Gorge.'],
      fireMiss: ['Miss.'],
    },
    events: volley10Events,
  },
  {
    // Volley 11: 200 paces — final volley
    def: {
      range: 200,
      fireAccuracyBase: 0.5,
      perceptionBase: 0.9,
      enemyReturnFireChance: 0.05,
      enemyReturnFireDamage: [3, 6],
      enemyLineDamage: 8,
    },
    narratives: {
      fireOrder: '"Final volley!"',
      present: 'Last column. Wagon exposed.',
      endure: "Silence. It's over.",
      fireHit: ['Hit. Gorge.'],
      fireMiss: ['Miss.'],
    },
    events: volley11Events,
  },
];

// Re-export for backward compat: VOLLEY_DEFS and VOLLEY_RANGES
export const RIVOLI_VOLLEY_DEFS = RIVOLI_VOLLEYS.map((v) => v.def);
export const RIVOLI_VOLLEY_RANGES = RIVOLI_VOLLEYS.map((v) => v.def.range);
