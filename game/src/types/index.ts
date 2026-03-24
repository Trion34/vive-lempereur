// Barrel re-exports — all imports should use this file.
// Do not import from subdirectories directly.

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
  MeleeContext,
  MeleeActionId,
  BodyPart,
  CampActivityId,
  CampEventCategory,
  ChargeEncounterId,
  Formation,
  LineActionId,
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
  NumericStatKey,
  AttributeId,
  Soldier,
  Officer,
  Player,
  PlayerCharacter,
  NPC,
} from './player';
export { hasAttribute } from './player';

// Battle types
export type {
  FormationShape,
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
  BattleExt,
  RivoliExt,
  VoltriExt,
  RankState,
} from './battle';
export type { ValorOutcome, GorgeTarget } from './battle';
export { WAGON_DAMAGE_CAP, WAGON_DETONATION_STRENGTH_PENALTY, isRivoliExt, isVoltriExt } from './battle';

// Melee types
export type {
  OpponentType,
  MeleeAlly,
  AllyTemplate,
  CombatantSnapshot,
  RoundAction,
  EncounterConfig,
  OpponentTemplate,
  MeleeOpponent,
  MeleeState,
  WaveEvent,
} from './melee';

// Melee tuning types
export type { MeleeTuning, BodyPartTuning, RespiteRecovery } from '../core/melee/tuning';

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

// VN types
export * from './vnTypes';
