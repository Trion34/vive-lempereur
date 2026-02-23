// Barrel re-exports — backwards-compatible with the old single types.ts

// Constants
export {
  THRESHOLD_HIGH,
  THRESHOLD_MID,
  THRESHOLD_LOW,
  FATIGUE_THRESHOLD_WINDED,
  FATIGUE_THRESHOLD_FATIGUED,
  FATIGUE_THRESHOLD_EXHAUSTED,
} from './constants';

// Enums
export {
  GamePhase,
  MilitaryRank,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  DrillStep,
  ActionId,
  BattlePhase,
  NPCRole,
  ChargeChoiceId,
  MeleeStance,
  MeleeActionId,
  BodyPart,
  CampActivityId,
  CampEventCategory,
} from './enums';

// Threshold/pool runtime functions
export {
  getMoraleThreshold,
  getHealthState,
  getStaminaPoolSize,
  getHealthPoolSize,
  getFatigueTier,
  getFatigueTierFill,
  getFatigueTierColor,
} from './thresholds';

// Player types
export type {
  Equipment,
  Soldier,
  Officer,
  Player,
  PlayerCharacter,
  NPC,
} from './player';

// Battle types
export type {
  Action,
  EnemyState,
  LineState,
  LoadAnimationStep,
  LoadResult,
  ScriptedFireResult,
  ChargeChoice,
  ValorRollResult,
  AutoVolleyResult,
  LogEntry,
  MoraleChange,
  BattleState,
} from './battle';
export type { ValorOutcome } from './battle';

// Melee types
export type {
  AllyPersonality,
  MeleeAlly,
  AllyTemplate,
  CombatantSnapshot,
  RoundAction,
  WaveEvent,
  EncounterConfig,
  OpponentTemplate,
  MeleeOpponent,
  MeleeState,
} from './melee';

// Camp types
export type {
  RestSubActivity,
  ExerciseSubActivity,
  ArmsTrainingSubActivity,
  DutySubActivity,
  ArmsTrainingTierConfig,
  CampActivity,
  CampActivityResult,
  CampLogEntry,
  CampEventChoice,
  CampEventResult,
  CampEvent,
  CampConditions,
  CampState,
} from './camp';
export { ARMS_TRAINING_TIERS } from './camp';

// Campaign types
export type { GameState, CampaignState } from './campaign';
