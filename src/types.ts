// === Morale (in-battle psychological meter — the fraying rope) ===

export enum MoraleThreshold {
  Steady = 'steady',       // 75-100%
  Shaken = 'shaken',       // 40-75%
  Wavering = 'wavering',   // 15-40%
  Breaking = 'breaking',   // 0-15%
}

export function getMoraleThreshold(morale: number, max: number): MoraleThreshold {
  const pct = morale / max;
  if (pct >= 0.75) return MoraleThreshold.Steady;
  if (pct >= 0.40) return MoraleThreshold.Shaken;
  if (pct >= 0.15) return MoraleThreshold.Wavering;
  return MoraleThreshold.Breaking;
}

// === Health thresholds ===

export enum HealthState {
  Unhurt = 'unhurt',
  Wounded = 'wounded',
  BadlyWounded = 'badly_wounded',
  Critical = 'critical',
}

export function getHealthState(health: number, max: number): HealthState {
  const pct = health / max;
  if (pct >= 0.75) return HealthState.Unhurt;
  if (pct >= 0.40) return HealthState.Wounded;
  if (pct >= 0.15) return HealthState.BadlyWounded;
  return HealthState.Critical;
}

// === Stamina thresholds ===

export enum StaminaState {
  Fresh = 'fresh',
  Tired = 'tired',
  Exhausted = 'exhausted',
  Spent = 'spent',
}

export function getStaminaState(stamina: number, max: number): StaminaState {
  const pct = stamina / max;
  if (pct >= 0.75) return StaminaState.Fresh;
  if (pct >= 0.40) return StaminaState.Tired;
  if (pct >= 0.15) return StaminaState.Exhausted;
  return StaminaState.Spent;
}

// === Drill Step (the 4-step volley cycle) ===

export enum DrillStep {
  Load = 'load',
  Present = 'present',
  Fire = 'fire',
  Endure = 'endure',
}

export const DRILL_ORDER: DrillStep[] = [
  DrillStep.Load,
  DrillStep.Present,
  DrillStep.Fire,
  DrillStep.Endure,
];

// === Soldier ===

export interface Soldier {
  id: string;
  name: string;
  rank: 'private' | 'corporal' | 'sergeant';
  valor: number;             // persistent stat (nerve/battle-hardness)
  morale: number;            // in-battle meter (drains/recovers)
  maxMorale: number;
  threshold: MoraleThreshold;
  alive: boolean;
  wounded: boolean;
  routing: boolean;
  musketLoaded: boolean;
  experience: number;
  relationship: number;
}

// === Officer ===

export interface Officer {
  name: string;
  rank: string;
  alive: boolean;
  wounded: boolean;
  mounted: boolean;
  status: string;
}

// === Player ===

export interface Player {
  name: string;
  // Persistent stat — rolled against for brave actions
  valor: number;
  // In-battle meter (the fraying rope)
  morale: number;
  maxMorale: number;
  moraleThreshold: MoraleThreshold;
  // Secondary meters
  health: number;
  maxHealth: number;
  healthState: HealthState;
  stamina: number;
  maxStamina: number;
  staminaState: StaminaState;
  // State
  musketLoaded: boolean;
  alive: boolean;
  routing: boolean;
  experience: number;
  heldFire: boolean;
  fumbledLoad: boolean;
  // Internal tracking (not displayed in battle)
  ncoApproval: number;
  duckedLastTurn: boolean;
  duckCount: number;
  prayerCount: number;
  canteenUses: number;
  turnsWithEmptyMusket: number;
  reputation: number;
}

// === Actions ===

export enum ActionId {
  // PRESENT step actions
  AimCarefully = 'aim_carefully',
  PresentArms = 'present_arms',
  HoldPosition = 'hold_position',
  // FIRE step actions
  Fire = 'fire',
  SnapShot = 'snap_shot',
  HoldFire = 'hold_fire',
  // ENDURE step actions
  StandFirm = 'stand_firm',
  SteadyNeighbour = 'steady_neighbour',
  Duck = 'duck',
  Pray = 'pray',
  DrinkWater = 'drink_water',
  HoldPosition_endure = 'hold_position_endure',
  // Fumble path
  GoThroughMotions = 'go_through_motions',
}

export interface Action {
  id: ActionId;
  name: string;
  description: string;
  minThreshold: MoraleThreshold;
  available: boolean;
  drillStep: DrillStep;
}

// === Battle State ===

export enum BattlePhase {
  Intro = 'intro',
  Line = 'line',
  Charge = 'charge',
  Melee = 'melee',
  Crisis = 'crisis',       // legacy (unused in scripted path)
  Individual = 'individual', // legacy
}

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
  filesDeep: number;
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

export enum ChargeChoiceId {
  // Encounter 1: Pierre dies
  DontLookBack = 'dont_look_back',
  KeepCharging = 'keep_charging',
  ScreamHisName = 'scream_his_name',
  Falter = 'falter',
  // Encounter 2: JB stumbles
  HaulHimUp = 'haul_him_up',
  ShoutAtHim = 'shout_at_him',
  LeaveHim = 'leave_him',
  // Encounter 3: First enemy
  MeetHeadOn = 'meet_head_on',
  DodgeFallInLine = 'dodge_fall_in_line',
  ButtStrikeCharge = 'butt_strike_charge',
}

export interface ChargeChoice {
  id: ChargeChoiceId;
  label: string;
  description: string;
  available: boolean;
}

// === Phase 3: Melee ===

export enum MeleeStance {
  Aggressive = 'aggressive',
  Balanced = 'balanced',
  Defensive = 'defensive',
}

export enum MeleeActionId {
  BayonetThrust = 'bayonet_thrust',
  AggressiveLunge = 'aggressive_lunge',
  ButtStrike = 'butt_strike',
  Feint = 'feint',
  Guard = 'guard',
  Dodge = 'dodge',
  Respite = 'respite',
}

export enum BodyPart {
  Head = 'head',
  Torso = 'torso',
  Arms = 'arms',
  Legs = 'legs',
}

export interface MeleeOpponent {
  name: string;
  type: 'conscript' | 'line' | 'veteran' | 'sergeant';
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  stunned: boolean;
  stunnedTurns: number;
  feinted: boolean;
  armInjured: boolean;
  legInjured: boolean;
  description: string;
}

export interface MeleeState {
  opponents: MeleeOpponent[];
  currentOpponent: number;
  playerStance: MeleeStance;
  playerFeinted: boolean;
  playerRiposte: boolean;
  playerStunned: number;
  exchangeCount: number;
  selectingStance: boolean;
  selectingTarget: boolean;
  selectedAction?: MeleeActionId;
  killCount: number;
  jbAliveInMelee: boolean;
  valorTempBonus: number;
  maxExchanges: number;
}

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
  weather: 'clear' | 'rain' | 'fog' | 'smoke';
  timeOfDay: string;
  battleOver: boolean;
  outcome: 'pending' | 'victory' | 'defeat' | 'rout' | 'survived' | 'cavalry_victory';
  crisisTurn: number;
  volleysFired: number;
  lastLoadResult?: LoadResult;
  // Scripted Phase 1
  scriptedVolley: number;          // 0=not scripted, 1-4=current volley
  aimCarefullySucceeded: boolean;
  jbCrisisResolved: boolean;
  jbCrisisOutcome?: 'steadied' | 'failed' | 'ignored' | 'worsened';
  // Phase 2: Charge
  chargeEncounter: number;         // 0=not in charge, 1-3=current encounter
  // Phase 3: Melee
  meleeState?: MeleeState;
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

// === Events ===

export enum ShockEventType {
  NeighbourKilled = 'neighbour_killed',
  CavalryFlank = 'cavalry_flank',
  OfficerDown = 'officer_down',
  CannonballLane = 'cannonball_lane',
  ArtilleryBarrage = 'artillery_barrage',
  FriendWounded = 'friend_wounded',
}

export enum RecoveryEventType {
  SuccessfulVolley = 'successful_volley',
  DrumsRally = 'drums_rally',
  NCORally = 'nco_rally',
  NeighbourSteady = 'neighbour_steady',
  LullInFire = 'lull_in_fire',
}

export interface BattleEvent {
  type: ShockEventType | RecoveryEventType;
  description: string;
  moraleEffect: number;
  triggered: boolean;
  targetNeighbour?: 'leftNeighbour' | 'rightNeighbour';
}
