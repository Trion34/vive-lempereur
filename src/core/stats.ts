// Unified d100 stat check system for combat and camp
import { THRESHOLD_HIGH, THRESHOLD_MID, THRESHOLD_LOW } from '../types';
import type { Player, PlayerCharacter } from '../types';

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

// === Type-safe dynamic stat access ===

type NumericStatKey = 'valor' | 'dexterity' | 'strength' | 'endurance'
  | 'constitution' | 'charisma' | 'intelligence' | 'awareness';

const NUMERIC_STAT_KEYS: ReadonlySet<string> = new Set<NumericStatKey>([
  'valor', 'dexterity', 'strength', 'endurance',
  'constitution', 'charisma', 'intelligence', 'awareness',
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

export function adjustPlayerStat(player: Player | PlayerCharacter, stat: string, delta: number): void {
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
}

export enum Difficulty {
  Easy = 15,
  Standard = 0,
  Hard = -15,
}

/** Roll d100 against a stat value with modifier and difficulty */
export function rollStat(
  statValue: number,
  modifier: number = 0,
  difficulty: Difficulty | number = Difficulty.Standard,
): StatCheckResult {
  const target = clamp(statValue + modifier + difficulty, 5, 95);
  const roll = rollD100();
  return {
    success: roll <= target,
    roll,
    target,
    margin: target - roll,
  };
}

/** Stamina debuff applied to stat checks when low on stamina */
export function getStaminaDebuff(stamina: number, maxStamina: number): number {
  const pct = stamina / maxStamina;
  if (pct >= THRESHOLD_HIGH) return 0;      // Fresh: no penalty
  if (pct >= THRESHOLD_MID) return -5;      // Tired: -5
  if (pct >= THRESHOLD_LOW) return -15;     // Exhausted: -15
  return -25;                                // Spent: -25
}
