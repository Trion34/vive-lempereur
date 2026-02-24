// ============================================================
// VOLLEY DEFINITIONS
// ============================================================

export const VOLLEY_RANGES = [120, 80, 50, 25, 100, 60, 40, 200, 200, 200, 200] as const;

interface VolleyDef {
  range: number;
  fireAccuracyBase: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number; // scripted damage to enemy strength from the line's volley
}

export const VOLLEY_DEFS: VolleyDef[] = [
  {
    // Volley 1: 120 paces — first exchange
    range: 120,
    fireAccuracyBase: 0.2,

    perceptionBase: 0.15,
    enemyReturnFireChance: 0.15,
    enemyReturnFireDamage: [8, 14],
    enemyLineDamage: 6,
  },
  {
    // Volley 2: 80 paces — the test
    range: 80,
    fireAccuracyBase: 0.35,

    perceptionBase: 0.3,
    enemyReturnFireChance: 0.25,
    enemyReturnFireDamage: [10, 18],
    enemyLineDamage: 10,
  },
  {
    // Volley 3: 50 paces — the storm
    range: 50,
    fireAccuracyBase: 0.5,

    perceptionBase: 0.7,
    enemyReturnFireChance: 0.4,
    enemyReturnFireDamage: [14, 24],
    enemyLineDamage: 15,
  },
  {
    // Volley 4: 25 paces — point blank
    range: 25,
    fireAccuracyBase: 0.7,

    perceptionBase: 0.95,
    enemyReturnFireChance: 0.5,
    enemyReturnFireDamage: [16, 28],
    enemyLineDamage: 20,
  },
  {
    // Volley 5: 100 paces — fresh column, tired defenders
    range: 100,
    fireAccuracyBase: 0.3,

    perceptionBase: 0.2,
    enemyReturnFireChance: 0.2,
    enemyReturnFireDamage: [8, 14],
    enemyLineDamage: 8,
  },
  {
    // Volley 6: 60 paces — Pontare fallen, right exposed
    range: 60,
    fireAccuracyBase: 0.45,

    perceptionBase: 0.4,
    enemyReturnFireChance: 0.3,
    enemyReturnFireDamage: [10, 20],
    enemyLineDamage: 12,
  },
  {
    // Volley 7: 40 paces — desperate, surrounded
    range: 40,
    fireAccuracyBase: 0.6,

    perceptionBase: 0.8,
    enemyReturnFireChance: 0.45,
    enemyReturnFireDamage: [14, 26],
    enemyLineDamage: 16,
  },
  {
    // Volley 8: 200 paces — first gorge volley, shooting gallery
    range: 200,
    fireAccuracyBase: 0.5,

    perceptionBase: 0.9,
    enemyReturnFireChance: 0.02,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 10,
  },
  {
    // Volley 9: 200 paces — Austrians try to climb, easy pickings
    range: 200,
    fireAccuracyBase: 0.5,

    perceptionBase: 0.9,
    enemyReturnFireChance: 0.03,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 10,
  },
  {
    // Volley 10: 200 paces — column disintegrating, fewer targets
    range: 200,
    fireAccuracyBase: 0.5,

    perceptionBase: 0.9,
    enemyReturnFireChance: 0.05,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 8,
  },
  {
    // Volley 11: 200 paces — final volley, wagon guaranteed
    range: 200,
    fireAccuracyBase: 0.5,

    perceptionBase: 0.9,
    enemyReturnFireChance: 0.05,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 8,
  },
];
