// Barrel re-exports — backwards-compatible with the old single types.ts

// Enums and constants are consumed directly from their source modules by tests.
// Only re-export what production code needs through this barrel.

// Enums
export {
  GamePhase,
  CampaignPhase,
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
  RivoliExt,
} from './battle';
export type { ValorOutcome } from './battle';

// Melee types
export type {
  MeleeAlly,
  AllyTemplate,
  CombatantSnapshot,
  RoundAction,
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
  CampActivity,
  CampActivityResult,
  CampLogEntry,
  CampEventResult,
  CampEvent,
  CampConditions,
  CampState,
} from './camp';
export { ARMS_TRAINING_TIERS } from './camp';

// Campaign types
export type { GameState, CampaignState } from './campaign';
