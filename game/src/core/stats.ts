// Unified d100 stat check system for combat and camp
import { FatigueTier, getFatigueTier } from '../types';
import type { Player, PlayerCharacter, NumericStatKey } from '../types';

// === Utility functions ===

/** Clamp a value between min and max */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Clamp a stat value to [0, 100] */
export function clampStat(value: number): number {
  return clamp(value, 0, 100);
}

/** Roll 1-100 (d100) */
export function rollD100(): number {
  return Math.floor(Math.random() * 100) + 1;
}

/** Convert internal roll-under values to display-as-roll-over (higher = better).
 *  Internal: roll 30, target 45 → pass (30 <= 45).
 *  Display:  roll 71, target 56 → pass (71 >= 56). */
export function displayRoll(roll: number): number {
  return 101 - roll;
}
export function displayTarget(target: number): number {
  return 101 - target;
}

// === Type-safe dynamic stat access ===

const NUMERIC_STAT_KEYS: ReadonlySet<string> = new Set<NumericStatKey>([
  'valor',
  'musketry',
  'elan',
  'strength',
  'endurance',
  'constitution',
  'charisma',
  'intelligence',
  'awareness',
  'soldierRep',
  'officerRep',
  'napoleonRep',
]);

function isNumericStat(stat: string): stat is NumericStatKey {
  return NUMERIC_STAT_KEYS.has(stat);
}

export function getPlayerStat(player: Player | PlayerCharacter, stat: string): number {
  if (isNumericStat(stat)) return player[stat];
  return 0;
}

export function setPlayerStat(player: Player | PlayerCharacter, stat: string, value: number): void {
  if (isNumericStat(stat)) {
    player[stat] = value;
  }
}

export function adjustPlayerStat(
  player: Player | PlayerCharacter,
  stat: string,
  delta: number,
): void {
  if (isNumericStat(stat)) {
    player[stat] = clampStat(player[stat] + delta);
  }
}

// === Stat check system ===

interface StatCheckResult {
  success: boolean;
  roll: number;
  target: number;
  margin: number; // positive = how much succeeded by, negative = failed by
  /** True when stat was high enough to skip the roll entirely */
  autoSuccess?: boolean;
}

/** Difficulty scale 0-100: higher = harder. Value = stat level that gives a 50/50 chance. */
export enum Difficulty {
  Easy = 35,
  Standard = 50,
  Hard = 65,
  Heroic = 80,
}

/** Auto-success threshold: skip the roll if stat exceeds difficulty by this much */
const AUTO_SUCCESS_MARGIN = 35;

/** Roll d100 against a stat value with modifier and difficulty (0-100, higher = harder) */
export function rollStat(
  statValue: number,
  modifier: number = 0,
  difficulty: Difficulty | number = Difficulty.Standard,
): StatCheckResult {
  const target = clamp(statValue + modifier - difficulty + 50, 5, 95);
  const autoSuccess = statValue >= difficulty + AUTO_SUCCESS_MARGIN;
  if (autoSuccess) {
    return { success: true, roll: 0, target, margin: target, autoSuccess: true };
  }
  const roll = rollD100();
  return {
    success: roll <= target,
    roll,
    target,
    margin: target - roll,
    autoSuccess: false,
  };
}

/** Fatigue debuff applied to combat stat checks based on fatigue tier */
export function getFatigueDebuff(fatigue: number, maxFatigue: number): number {
  const tier = getFatigueTier(fatigue, maxFatigue);
  switch (tier) {
    case FatigueTier.Fresh:
      return 0;
    case FatigueTier.Winded:
      return -10;
    case FatigueTier.Fatigued:
      return -30;
    case FatigueTier.Exhausted:
      return -50;
  }
}
