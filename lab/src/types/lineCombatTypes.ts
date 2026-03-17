/* ------------------------------------------------------------------ */
/*  Line Combat Module — authorable unit for the Line Battle Lab       */
/* ------------------------------------------------------------------ */

export interface LabVolleyDef {
  range: number;                           // paces (25-200)
  fireAccuracyBase: number;                // 0-1
  perceptionBase: number;                  // 0-1
  enemyReturnFireChance: number;           // 0-1
  enemyReturnFireDamage: [number, number]; // [min, max]
  enemyLineDamage: number;                 // flat damage to enemy line
}

export interface LabVolleyNarratives {
  present: string;
  fireOrder: string;
  endure: string;
  fireHit: string[];
  fireMiss: string[];
}

export interface LabReturnFireConfig {
  frontRankBonus: number;   // added to return fire if player is front rank
  fatalChance: number;      // instant-kill probability
}

export interface LabStaminaConfig {
  cost: number;             // stamina drained per volley (default 12)
  recovery: number;         // stamina recovered per volley (default 4)
}

export interface LabVolleyEntry {
  id: string;
  def: LabVolleyDef;
  narratives: LabVolleyNarratives;
  returnFire: LabReturnFireConfig;
  stamina: LabStaminaConfig;
  notes: string;             // designer notes (not exported to game)
  eventDescription: string;  // human-readable intent for Claude to implement as code
}

export type VolleyMode = 'standard' | 'gorge';

export interface StateHints {
  expectedEnemyStrength: [number, number];
  expectedPlayerHealth: [number, number];
  ncoPresent: boolean | null;       // null = don't care
  artilleryActive: boolean | null;
  entryNotes: string;
  exitNotes: string;
}

export interface LineCombatModule {
  id: string;
  name: string;
  description: string;
  tags: string[];
  mode: VolleyMode;
  volleys: LabVolleyEntry[];
  stateHints: StateHints;
  notes: string;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}
