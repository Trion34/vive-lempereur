// Unified d100 stat check system for combat and camp

export interface StatCheckResult {
  success: boolean;
  roll: number;
  target: number;
  margin: number; // positive = how much succeeded by, negative = failed by
}

export enum Difficulty {
  Trivial = 30,
  Easy = 15,
  Standard = 0,
  Hard = -15,
  VeryHard = -30,
  NearImpossible = -45,
}

// Roll d100 against a stat value with modifier and difficulty
export function rollStat(
  statValue: number,
  modifier: number = 0,
  difficulty: Difficulty | number = Difficulty.Standard,
): StatCheckResult {
  const target = Math.min(95, Math.max(5, statValue + modifier + difficulty));
  const roll = Math.floor(Math.random() * 100) + 1;
  return {
    success: roll <= target,
    roll,
    target,
    margin: target - roll,
  };
}

// Fatigue debuff applied to stat checks when fatigued
export function getFatigueDebuff(fatigue: number, maxFatigue: number): number {
  const pct = fatigue / maxFatigue;
  if (pct >= 0.75) return 0;      // Fresh: no penalty
  if (pct >= 0.40) return -5;     // Tired: -5
  if (pct >= 0.15) return -15;    // Exhausted: -15
  return -25;                      // Spent: -25
}

// Clamp a stat value to [0, 100]
export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

// Roll against multiple stats (average them, then apply modifier/difficulty)
export function rollCombinedStat(
  stats: number[],
  modifier: number = 0,
  difficulty: Difficulty | number = Difficulty.Standard,
): StatCheckResult {
  const avg = stats.reduce((a, b) => a + b, 0) / stats.length;
  return rollStat(avg, modifier, difficulty);
}
