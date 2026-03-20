/* ------------------------------------------------------------------ */
/*  Melee Tuning — configurable constants for melee combat             */
/*                                                                     */
/*  CLASSIC_TUNING reproduces current game behavior exactly.           */
/*  V2_TUNING introduces improved pacing and new mechanics.            */
/*  getMeleeTuning(state) reads from BattleState.meleeTuning or falls  */
/*  back to CLASSIC_TUNING.                                            */
/* ------------------------------------------------------------------ */

import { BodyPart } from '../../types/enums';
import type { BattleState } from '../../types/battle';

// ============================================================
// Body-part tuning subset
// ============================================================

export interface BodyPartTuning {
  hitMod: number;
  damageRange: [number, number];
}

// ============================================================
// Respite recovery tuning
// ============================================================

export interface RespiteRecovery {
  /** Stamina recovered when taking Respite (positive number) */
  stamina: number;
}

// ============================================================
// Full tuning interface
// ============================================================

export interface MeleeTuning {
  /** Label for debugging / display */
  version: 'classic' | 'v2';

  /** Stamina passively restored per round (0 = off) */
  passiveStaminaRegen: number;

  /** Stamina refunded on kill (0 = off) */
  killStaminaRefund: number;

  /** Hit-chance penalty at 0 stamina (subtracted from hit rate) */
  zeroStaminaHitPenalty: number;

  /** Bonus damage-taken multiplier at 0 stamina (e.g. 0.25 = +25%) */
  zeroStaminaDamageTakenBonus: number;

  /** Global multiplier on all stamina costs (1.0 = normal) */
  staminaCostMultiplier: number;

  /** Enable momentum: consecutive hits grant escalating bonuses */
  momentumEnabled: boolean;

  /** Enable riposte: successful Guard grants counter-attack next turn */
  riposteEnabled: boolean;

  /** Damage reduction fraction while guarding (0.15 = 15% less) */
  guardDamageReduction: number;

  /** Per-round chance to recover from arm/leg injury (0 = never) */
  injuryRecoveryChance: number;

  /** Global animation speed multiplier (higher = faster) */
  animationSpeedMultiplier: number;

  /** HP damage must exceed this fraction of maxHealth to reset momentum (0 = any) */
  momentumResetThreshold: number;

  /** Respite action recovery values */
  respiteRecovery: RespiteRecovery;

  /** Body-part hit modifiers and damage ranges */
  bodyPartDefs: Record<BodyPart, BodyPartTuning>;
}

// ============================================================
// CLASSIC_TUNING — matches current game behavior exactly
// ============================================================

export const CLASSIC_TUNING: MeleeTuning = {
  version: 'classic',

  passiveStaminaRegen: 0,
  killStaminaRefund: 0,
  zeroStaminaHitPenalty: 0,
  zeroStaminaDamageTakenBonus: 0,
  staminaCostMultiplier: 1.0,

  momentumEnabled: false,
  riposteEnabled: false,
  momentumResetThreshold: 0,

  guardDamageReduction: 0.15,
  injuryRecoveryChance: 0,
  animationSpeedMultiplier: 1.0,

  respiteRecovery: {
    stamina: 35,
  },

  // Exact values from BODY_PART_DEFS in effects.ts
  bodyPartDefs: {
    [BodyPart.Head]: { hitMod: -0.25, damageRange: [25, 35] },
    [BodyPart.Torso]: { hitMod: 0, damageRange: [15, 25] },
    [BodyPart.Arms]: { hitMod: -0.1, damageRange: [10, 15] },
    [BodyPart.Legs]: { hitMod: -0.15, damageRange: [10, 20] },
  },
};

// ============================================================
// V2_TUNING — improved pacing for the lab / future game updates
// ============================================================

export const V2_TUNING: MeleeTuning = {
  version: 'v2',

  passiveStaminaRegen: 8,
  killStaminaRefund: 15,
  zeroStaminaHitPenalty: 0.15,
  zeroStaminaDamageTakenBonus: 0.25,
  staminaCostMultiplier: 0.9,

  momentumEnabled: true,
  riposteEnabled: true,
  momentumResetThreshold: 0.15,

  guardDamageReduction: 0.2,
  injuryRecoveryChance: 0.08,
  animationSpeedMultiplier: 1.5,

  respiteRecovery: {
    stamina: 40,
  },

  // Tighter damage ranges for more predictable combat
  bodyPartDefs: {
    [BodyPart.Head]: { hitMod: -0.2, damageRange: [27, 33] },
    [BodyPart.Torso]: { hitMod: 0, damageRange: [17, 23] },
    [BodyPart.Arms]: { hitMod: -0.08, damageRange: [11, 14] },
    [BodyPart.Legs]: { hitMod: -0.12, damageRange: [12, 18] },
  },
};

// ============================================================
// Runtime helper
// ============================================================

/** Read tuning from BattleState, falling back to CLASSIC_TUNING. */
export function getMeleeTuning(state: BattleState): MeleeTuning {
  return state.meleeTuning ?? CLASSIC_TUNING;
}
