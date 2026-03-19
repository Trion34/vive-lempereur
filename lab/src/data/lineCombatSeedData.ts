import type {
  LineCombatModule,
  LabVolleyEntry,
  LabVolleyNarratives,
  LabReturnFireConfig,
  LabStaminaConfig,
} from '../types/lineCombatTypes';
import { createDefaultReturnFire } from '../stores/lineCombatStore';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let _counter = 0;
function seedUid(): string {
  return `seed-${(++_counter).toString(36)}`;
}

function makeVolley(
  range: number,
  acc: number,
  perc: number,
  retChance: number,
  retDmg: [number, number],
  lineDmg: number,
  narr: LabVolleyNarratives,
  retFire: LabReturnFireConfig,
  stamina: LabStaminaConfig,
  notes: string,
  eventDesc: string,
): LabVolleyEntry {
  return {
    id: seedUid(),
    def: { range, fireAccuracyBase: acc, perceptionBase: perc, enemyReturnFireChance: retChance, enemyReturnFireDamage: retDmg, enemyLineDamage: lineDmg },
    narratives: narr,
    returnFire: retFire,
    stamina,
    notes,
    eventDescription: eventDesc,
  };
}

/* ------------------------------------------------------------------ */
/*  Seed modules — generic example line combat scenarios               */
/* ------------------------------------------------------------------ */

export function createSeedModules(): LineCombatModule[] {
  _counter = 0; // Reset for deterministic IDs
  const ts = new Date().toISOString();
  return [
    {
      id: 'example-opening',
      name: 'Example: Opening Engagement',
      description: 'First exchange. 120-25 paces, standard drill.',
      tags: ['example', 'standard'],
      mode: 'standard',
      volleys: [
        makeVolley(120, 0.20, 0.15, 0.15, [8, 14], 6,
          { present: 'Present arms. 120 paces.', fireOrder: '"Feu!"', endure: 'Return fire.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Opening volley — long range', 'First volley hit event. Neighbour morale contagion.'),
        makeVolley(80, 0.35, 0.30, 0.25, [10, 18], 10,
          { present: 'Present. 80 paces.', fireOrder: '"FIRE!"', endure: 'Return fire.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Closing range', 'Man killed nearby event. Neighbour steadied.'),
        makeVolley(50, 0.50, 0.70, 0.40, [14, 24], 15,
          { present: 'Present. 50 paces.', fireOrder: '"FIRE!"', endure: 'Return fire. Men fall.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0.12 }, { cost: 12, recovery: 4 },
          'Crisis volley — high casualties', 'A neighbour takes a wound. Officer dismounts. Artillery silenced. Left flank pressure.'),
        makeVolley(25, 0.70, 0.95, 0.50, [16, 28], 20,
          { present: 'Present. 25 paces. Last volley.', fireOrder: '"Tirez!"', endure: 'Fix bayonets.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0.12 }, { cost: 12, recovery: 4 },
          'Point blank — final volley before melee', 'Enemy charging. Left flank breaking. Bayonets fixed.'),
      ],
      stateHints: { expectedEnemyStrength: [80, 100], expectedPlayerHealth: [60, 100], ncoPresent: true, artilleryActive: true, entryNotes: 'Battle start. NCO present, artillery active.', exitNotes: 'Transitions to melee.' },
      notes: 'Standard mode. 4 volleys with escalating intensity.',
      createdAt: ts, updatedAt: ts,
    },
    {
      id: 'example-grinding',
      name: 'Example: Grinding Defense',
      description: 'Fresh enemy column. 100-40 paces, standard drill. Exhausted defenders.',
      tags: ['example', 'standard'],
      mode: 'standard',
      volleys: [
        makeVolley(100, 0.30, 0.20, 0.20, [8, 14], 8,
          { present: 'Present. 100 paces. Fresh column.', fireOrder: '"Feu!"', endure: 'Return fire. Fresh muskets.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 14, recovery: 4 },
          'Fresh enemy column', "Enemy guns open. A general's presence steadies the line."),
        makeVolley(60, 0.45, 0.40, 0.30, [10, 20], 12,
          { present: 'Present. 60 paces. Right flank open.', fireOrder: '"FIRE!"', endure: 'Return fire. Surrounded.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 14, recovery: 4 },
          'Flanked position', 'Support fallen. Right flank exposed. Surrounded.'),
        makeVolley(40, 0.60, 0.80, 0.45, [14, 26], 16,
          { present: 'Present. 40 paces. Last volley.', fireOrder: '"TIREZ!"', endure: 'Counterattack ordered.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 14, recovery: 4 },
          'Desperate — surrounded', 'Men breaking in the rear. Counterattack ordered from the ridge.'),
      ],
      stateHints: { expectedEnemyStrength: [80, 100], expectedPlayerHealth: [30, 70], ncoPresent: false, artilleryActive: true, entryNotes: 'Player is exhausted from prior engagement. NCO down.', exitNotes: 'Transitions to story beat.' },
      notes: 'Higher stamina cost (14). Player carries wounds from prior phase.',
      createdAt: ts, updatedAt: ts,
    },
    {
      id: 'example-gorge',
      name: 'Example: Elevated Fire (Gorge)',
      description: 'Shooting down into a gorge. 200 paces, gorge mode (target selection).',
      tags: ['example', 'gorge'],
      mode: 'gorge',
      volleys: [
        makeVolley(200, 0.50, 0.90, 0.02, [3, 6], 10,
          { present: 'Fire at will. Gorge below.', fireOrder: '"Fire at will!"', endure: 'Scattered return fire.', fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'First gorge volley', 'Men surrendering below. Column still advancing.'),
        makeVolley(200, 0.50, 0.90, 0.03, [3, 6], 10,
          { present: 'Reload. More targets below.', fireOrder: '"Again!"', endure: 'Screams from below.', fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'Easy pickings', 'Screams from below. A boy among the dying (awareness > 40).'),
        makeVolley(200, 0.50, 0.90, 0.05, [3, 6], 8,
          { present: 'Column breaking. Wagon visible.', fireOrder: '"Fire!"', endure: 'Wounded call for help.', fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'Column disintegrating', 'Cries for help. Some men stop firing. Mercy morale boost if shown.'),
        makeVolley(200, 0.50, 0.90, 0.05, [3, 6], 8,
          { present: 'Last column. Wagon exposed.', fireOrder: '"Final volley!"', endure: "Silence. It's over.", fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'Final volley', 'Wagon detonation if not already destroyed. White flags.'),
      ],
      stateHints: { expectedEnemyStrength: [60, 100], expectedPlayerHealth: [30, 60], ncoPresent: false, artilleryActive: false, entryNotes: 'Player on ridge above gorge. No ENDURE step for return fire.', exitNotes: 'Transitions to aftermath story beat.' },
      notes: 'Gorge mode — player selects targets (column, officers, wagon, mercy). Low return fire, low stamina cost.',
      createdAt: ts, updatedAt: ts,
    },
    {
      id: 'example-tutorial',
      name: 'Example: Tutorial Battle',
      description: 'Tutorial battle. 2 volleys at 150-100 paces.',
      tags: ['example', 'tutorial'],
      mode: 'standard',
      volleys: [
        makeVolley(150, 0.15, 0.10, 0.10, [5, 10], 4,
          { present: 'Present arms. 150 paces.', fireOrder: '"Feu!" The sergeant\'s voice.', endure: 'Return fire from the tree line.', fireHit: ['Hit. An enemy stumbles among the trees.'], fireMiss: ['Miss. The ball clips branches overhead.'] },
          { frontRankBonus: 0.10, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Tutorial opening volley', 'First volley — smoke rolls. Sergeant steadies the line.'),
        makeVolley(100, 0.25, 0.20, 0.18, [7, 13], 6,
          { present: 'Present. 100 paces.', fireOrder: '"FIRE!" The line erupts.', endure: 'Return fire. Ball hits nearby.', fireHit: ['Hit. Target down in the scrub.'], fireMiss: ['Miss. Smoke obscures.'] },
          { frontRankBonus: 0.10, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Tutorial closing volley', 'Second volley hits home. Man killed two files over. Line integrity loss.'),
      ],
      stateHints: { expectedEnemyStrength: [80, 100], expectedPlayerHealth: [80, 100], ncoPresent: true, artilleryActive: false, entryNotes: 'Tutorial battle. Player is fresh.', exitNotes: 'Transitions to story beat.' },
      notes: 'Tutorial battle — lower intensity, gentler introduction.',
      createdAt: ts, updatedAt: ts,
    },
  ];
}
