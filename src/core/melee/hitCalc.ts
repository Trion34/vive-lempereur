import { MeleeStance, MeleeActionId, BodyPart } from '../../types';
import { getFatigueDebuff } from '../stats';
import { STANCE_MODS, ACTION_DEFS, BODY_PART_DEFS } from './effects';
import { randRange } from './encounters';

// ============================================================
// HIT / DAMAGE CALCULATION
// ============================================================

const BASE_MELEE_HIT = 0.35;
const SKILL_HIT_DIVISOR = 120;
const RIPOSTE_BONUS = 0.15;
const MORALE_HIT_PENALTY_SCALE = 0.15;
const STRENGTH_DAMAGE_BASE = 0.75;
const STRENGTH_DAMAGE_DIVISOR = 200;

export function calcHitChance(
  skillStat: number,
  morale: number,
  maxMorale: number,
  stance: MeleeStance,
  action: MeleeActionId,
  bodyPart: BodyPart,
  riposte: boolean,
  fatigue: number,
  maxFatigue: number,
): number {
  const moralePenalty = (1 - morale / maxMorale) * MORALE_HIT_PENALTY_SCALE;
  const staminaDebuffPct = getFatigueDebuff(fatigue, maxFatigue) / 100; // 0 / -0.10 / -0.30 / -0.50
  const raw =
    BASE_MELEE_HIT +
    STANCE_MODS[stance].attack +
    ACTION_DEFS[action].hitBonus +
    BODY_PART_DEFS[bodyPart].hitMod +
    (riposte ? RIPOSTE_BONUS : 0) +
    skillStat / SKILL_HIT_DIVISOR -
    moralePenalty +
    staminaDebuffPct; // negative values reduce hit chance
  return Math.max(0.05, Math.min(0.95, raw));
}

export function calcDamage(
  action: MeleeActionId,
  bodyPart: BodyPart,
  _fatigue: number,
  _maxFatigue: number,
  strength: number = 40,
): number {
  const [lo, hi] = BODY_PART_DEFS[bodyPart].damageRange;
  const strengthMod = action === MeleeActionId.Shoot ? 1.0 : STRENGTH_DAMAGE_BASE + strength / STRENGTH_DAMAGE_DIVISOR;
  const dmg = Math.round(randRange(lo, hi) * ACTION_DEFS[action].damageMod * strengthMod);
  return Math.max(1, dmg);
}

