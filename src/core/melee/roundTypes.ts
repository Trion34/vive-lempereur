import type { LogEntry, MoraleChange } from '../../types';

// === SecondWind tuning constants ===
export const SECOND_WIND_ROLL_RANGE = 50;
export const SECOND_WIND_THRESHOLD = 60;
export const SECOND_WIND_FATIGUE_REDUCTION = 0.25;

// === Combat constants (used for player + ally) ===
export const FATIGUE_ACCUMULATION_RATE = 0.5;
export const ELAN_BLOCK_DIVISOR = 85;
export const CANTEEN_HP_RESTORE = 20;

// ============================================================
// Phase result types
// ============================================================

export interface MeleeRoundResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  playerHealthDelta: number;
  playerStaminaDelta: number;
  allyDeaths: { name: string; npcId?: string; isNamed: boolean }[];
  enemyDefeats: number;
  battleEnd?: 'victory' | 'defeat' | 'survived';
}

export interface PlayerPhaseResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  playerGuarding: boolean;
  playerBlockChance: number;
  enemyDefeats: number;
}

export interface AlliesPhaseResult {
  log: LogEntry[];
  allyGuarding: Map<string, number>;
  enemyDefeats: number;
}

export interface EnemiesPhaseResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  playerHealthDelta: number;
  allyDeaths: MeleeRoundResult['allyDeaths'];
  battleEnd?: 'defeat';
}
