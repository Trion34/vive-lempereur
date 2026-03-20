import {
  BattlePhase,
  DrillStep,
  ActionId,
  MoraleThreshold,
  ChargeChoiceId,
  MilitaryRank,
  Formation,
} from './enums';
import { Player, Soldier, Officer } from './player';
import type { MeleeState } from './melee';
import type { MeleeTuning } from '../core/melee/tuning';
import type { BattleRoles } from '../data/battles/types';

export const WAGON_DAMAGE_CAP = 100;
export const WAGON_DETONATION_STRENGTH_PENALTY = 30;

// === Battle-specific ext state ===
// BattleExt is the base — shared fields only. Per-battle interfaces extend it.
// BattleState.ext is typed as BattleExt; narrow with isRivoliExt()/isVoltriExt().

// === Formation shape (shared between core and UI) ===

export interface FormationShape {
  cols: number;
  rows: number;
  label: string;
  pattern?: 'solid' | 'hollow' | 'scattered';
  gap?: number;
  wallThickness?: number;
}

export type GorgeTarget = '' | 'column' | 'officers' | 'wagon';

/** Base ext interface — only fields accessed by generic (non-battle-specific) code. */
export interface BattleExt {
  battlePart: number; // 1, 2, or 3
  meleeStage: number; // 0, 1, or 2
}

export interface RivoliExt extends BattleExt {
  batteryCharged: boolean;
  wagonDamage: number; // 0-100
  gorgeTarget: GorgeTarget;
  gorgeMercyCount: number; // 0+
}

export interface VoltriExt extends BattleExt {
  /** Player separated from column (helped straggler on Coastal Road) */
  separated: boolean;
  /** Felix survived the wounded soldier encounter */
  felixSurvived: boolean;
  /** Player interacted with Felix at camp (gambling) */
  felixMet: boolean;
  /** Player saved the Ligurian girl at camp */
  ligurianGirlSaved: boolean;
  /** Accumulated wound-tending score for Felix */
  felixTendScore: number;
}

/** Type guard: check if ext is RivoliExt */
export function isRivoliExt(ext: BattleExt): ext is RivoliExt {
  return 'batteryCharged' in ext;
}

/** Type guard: check if ext is VoltriExt */
export function isVoltriExt(ext: BattleExt): ext is VoltriExt {
  return 'separated' in ext;
}

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

// === Rank Agency State ===

export interface RankState {
  heldVolleyBonus: boolean;
  refuseFlankTurns: number;
  holdCount: number;
  fixedBayonetsEarly: boolean;
  requestSupportCooldown: number;
  refuseFlankUsed: boolean;
  rangeModifier: number;
}

// === Battle State ===

export interface BattleState {
  /** Battle config ID for registry lookup (e.g., 'rivoli') */
  configId: string;
  phase: BattlePhase;
  turn: number;
  drillStep: DrillStep;
  player: Player;
  roles: BattleRoles;
  line: LineState;
  enemy: EnemyState;
  log: LogEntry[];
  availableActions: Action[];
  pendingMoraleChanges: MoraleChange[];
  battleOver: boolean;
  outcome: 'pending' | 'victory' | 'defeat' | 'rout' | 'survived';
  crisisTurn: number;
  volleysFired: number;
  lastLoadResult?: LoadResult;
  lastValorRoll?: ValorRollResult;
  // Scripted Phase 1
  scriptedVolley: number; // 0=not scripted, 1-4=current volley
  // Phase 2: Story Beat
  chargeEncounter: number; // See ChargeEncounterId: 0=None, 1=Battery, 2=Massena, 3=Gorge, 4=Aftermath, 5=WoundedSergeant, 6=FixBayonets
  // Phase 3: Melee
  meleeState?: MeleeState;
  /** Optional melee tuning config. Undefined = CLASSIC_TUNING. */
  meleeTuning?: MeleeTuning;
  /** Battle-specific extended state. Narrow with isRivoliExt()/isVoltriExt(). */
  ext: BattleExt;
  // Auto-play Part 1
  autoPlayActive: boolean; // true during Part 1 auto-play
  autoPlayVolleyCompleted: number; // 0-3, for save/resume
  /** Index into battleConfig.script — used by generic script-driven auto-play for save/resume */
  scriptSegmentIndex?: number;
  graceEarned: boolean; // transient flag: TakeCommand success grants grace
  /** Accumulated virtue change from story beats (applied at syncBattleToCharacter) */
  pendingVirtueChange: number;
  // Rank-agency system
  playerRank: MilitaryRank;
  rankState: RankState;
  formation: Formation;
  formationChosen: boolean;
}
