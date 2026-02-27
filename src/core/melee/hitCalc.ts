import { MeleeStance, MeleeActionId, BodyPart } from '../../types';
import { getFatigueDebuff } from '../stats';
import { STANCE_MODS, ACTION_DEFS, BODY_PART_DEFS } from './effects';
import { randRange } from './encounters';

// ============================================================
// HIT / DAMAGE CALCULATION
// ============================================================

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
  const moralePenalty = (1 - morale / maxMorale) * 0.15;
  const staminaDebuffPct = getFatigueDebuff(fatigue, maxFatigue) / 100; // 0 / -0.05 / -0.15 / -0.25
  const raw =
    0.35 +
    STANCE_MODS[stance].attack +
    ACTION_DEFS[action].hitBonus +
    BODY_PART_DEFS[bodyPart].hitMod +
    (riposte ? 0.15 : 0) +
    skillStat / 120 -
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
  const strengthMod = action === MeleeActionId.Shoot ? 1.0 : 0.75 + strength / 200;
  const dmg = Math.round(randRange(lo, hi) * ACTION_DEFS[action].damageMod * strengthMod);
  return Math.max(1, dmg);
}

