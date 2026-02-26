import {
  BattlePhase,
  DrillStep,
  ActionId,
  MoraleThreshold,
  ChargeChoiceId,
} from './enums';
import { Player, Soldier, Officer } from './player';
import type { MeleeState } from './melee';

// === Actions ===

export interface Action {
  id: ActionId;
  name: string;
  description: string;
  minThreshold: MoraleThreshold;
  available: boolean;
  drillStep: DrillStep;
}

// === Battle State ===

export interface EnemyState {
  range: number;
  strength: number;
  quality: string;
  morale: string;
  lineIntegrity: number;
  artillery: boolean;
  cavalryThreat: boolean;
}

export interface LineState {
  leftNeighbour: Soldier | null;
  rightNeighbour: Soldier | null;
  officer: Officer;
  lineIntegrity: number;
  lineMorale: string;
  drumsPlaying: boolean;
  ncoPresent: boolean;
  casualtiesThisTurn: number;
}

export interface LoadAnimationStep {
  svgId: string;
  label: string;
  success: boolean;
  duration: number;
}

export interface LoadResult {
  success: boolean;
  rollValue: number;
  targetValue: number;
  narrativeSteps: LoadAnimationStep[];
}

export interface ScriptedFireResult {
  hit: boolean;
  perceived: boolean;
  accuracy: number;
  perceptionRoll: number;
  enemyDamage: number;
  moraleChanges: MoraleChange[];
  log: LogEntry[];
}

// === Phase 2: Charge ===

export interface ChargeChoice {
  id: ChargeChoiceId;
  label: string;
  description: string;
  available: boolean;
}

// === Auto-Play Valor Roll ===

export type ValorOutcome = 'great_success' | 'pass' | 'fail' | 'critical_fail';

export interface ValorRollResult {
  roll: number;
  target: number;
  outcome: ValorOutcome;
  moraleChange: number;
  narrative: string;
}

export interface AutoVolleyResult {
  volleyIdx: number;
  narratives: LogEntry[];
  valorRoll: ValorRollResult | null;
  lineIntegrityChange: number;
  playerDied: boolean;
  healthDamage: number;
  moraleTotal: number;
}

export interface LogEntry {
  turn: number;
  text: string;
  type: 'narrative' | 'action' | 'event' | 'morale' | 'result' | 'order';
}

export interface MoraleChange {
  amount: number;
  reason: string;
  source: 'passive' | 'event' | 'action' | 'contagion' | 'recovery';
}

// === Battle State ===

export interface BattleState {
  phase: BattlePhase;
  turn: number;
  drillStep: DrillStep;
  player: Player;
  line: LineState;
  enemy: EnemyState;
  log: LogEntry[];
  availableActions: Action[];
  pendingMoraleChanges: MoraleChange[];
  battleOver: boolean;
  outcome:
    | 'pending'
    | 'victory'
    | 'defeat'
    | 'rout'
    | 'survived'
    | 'cavalry_victory'
    | 'part1_complete'
    | 'part2_gorge_setup'
    | 'gorge_victory';
  crisisTurn: number;
  volleysFired: number;
  lastLoadResult?: LoadResult;
  lastValorRoll?: ValorRollResult;
  // Scripted Phase 1
  scriptedVolley: number; // 0=not scripted, 1-4=current volley
  // Phase 2: Story Beat
  chargeEncounter: number; // 0=not in story beat, 1=battery, 2=masséna, 3=gorge, 4=aftermath
  // Phase 3: Melee
  meleeState?: MeleeState;
  /** Battle-specific extended state. Typed per-battle via config. */
  ext: Record<string, number | boolean | string>;
  // Auto-play Part 1
  autoPlayActive: boolean; // true during Part 1 auto-play
  autoPlayVolleyCompleted: number; // 0-3, for save/resume
  graceEarned: boolean; // transient flag: TakeCommand success grants grace
}
