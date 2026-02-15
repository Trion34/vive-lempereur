// === Threshold constants (shared across morale, health, stamina) ===

export const THRESHOLD_HIGH = 0.75;
export const THRESHOLD_MID = 0.40;
export const THRESHOLD_LOW = 0.15;

// === Game Phase (top-level state machine) ===

export enum GamePhase {
  Camp = 'camp',
  Battle = 'battle',
}

// === Military Rank ===

export enum MilitaryRank {
  Private = 'private',
  Corporal = 'corporal',
  Sergeant = 'sergeant',
  Lieutenant = 'lieutenant',
  Captain = 'captain',
}

// === Morale (in-battle psychological meter — the fraying rope) ===

export enum MoraleThreshold {
  Steady = 'steady',       // 75-100%
  Shaken = 'shaken',       // 40-75%
  Wavering = 'wavering',   // 15-40%
  Breaking = 'breaking',   // 0-15%
}

export function getMoraleThreshold(morale: number, max: number): MoraleThreshold {
  const pct = morale / max;
  if (pct >= THRESHOLD_HIGH) return MoraleThreshold.Steady;
  if (pct >= THRESHOLD_MID) return MoraleThreshold.Shaken;
  if (pct >= THRESHOLD_LOW) return MoraleThreshold.Wavering;
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
  if (pct >= THRESHOLD_HIGH) return HealthState.Unhurt;
  if (pct >= THRESHOLD_MID) return HealthState.Wounded;
  if (pct >= THRESHOLD_LOW) return HealthState.BadlyWounded;
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
  if (pct >= THRESHOLD_HIGH) return StaminaState.Fresh;
  if (pct >= THRESHOLD_MID) return StaminaState.Tired;
  if (pct >= THRESHOLD_LOW) return StaminaState.Exhausted;
  return StaminaState.Spent;
}

// === Drill Step (the 4-step volley cycle) ===

export enum DrillStep {
  Load = 'load',
  Present = 'present',
  Fire = 'fire',
  Endure = 'endure',
}


// === Equipment ===

export interface Equipment {
  musket: string;
  bayonet: string;
  musketCondition: number;   // 0-100
  uniformCondition: number;  // 0-100
}

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

// === Player (in-battle state) ===

export interface Player {
  name: string;
  // Primary stats
  valor: number;
  dexterity: number;
  strength: number;
  endurance: number;
  constitution: number;
  charisma: number;
  intelligence: number;
  awareness: number;
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

// === PlayerCharacter (persistent across battles/camp — 3 stat tiers) ===

export interface PlayerCharacter {
  name: string;
  rank: MilitaryRank;
  // Primary stats (core combat)
  valor: number;
  dexterity: number;
  strength: number;
  // Secondary stats (resilience)
  endurance: number;
  constitution: number;
  // Tertiary stats (social/mental)
  charisma: number;
  intelligence: number;
  awareness: number;
  // Persistent meters
  health: number;     // 0-100, HIGH=good (same scale as battle)
  morale: number;     // 0-100, HIGH=good (same scale as battle)
  stamina: number;    // 0-100, HIGH=good (100=Fresh, 0=Spent)
  grace: number;       // 0-2, consumable extra life
  experience: number;
  reputation: number;
  ncoApproval: number;
  // Equipment
  equipment: Equipment;
}

// === NPC System ===

export enum NPCRole {
  Neighbour = 'neighbour',
  Officer = 'officer',
  NCO = 'nco',
}

export enum NPCPersonality {
  Stoic = 'stoic',
  Nervous = 'nervous',
  Bitter = 'bitter',
  Ambitious = 'ambitious',
}

export interface NPC {
  id: string;
  name: string;
  role: NPCRole;
  personality: NPCPersonality;
  rank: MilitaryRank;
  relationship: number;    // -100 to 100
  trust: number;           // 0 to 100
  alive: boolean;
  wounded: boolean;
  morale: number;
  maxMorale: number;
  // Stats (simplified for NPCs)
  valor: number;
  experience: number;
}

// === Actions ===

export enum ActionId {
  // PRESENT step actions
  AimCarefully = 'aim_carefully',
  PresentArms = 'present_arms',
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
  // Fumble path
  GoThroughMotions = 'go_through_motions',
  // GORGE PRESENT step actions
  TargetColumn = 'target_column',
  TargetOfficers = 'target_officers',
  TargetWagon = 'target_wagon',
  ShowMercy = 'show_mercy',
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
  StoryBeat = 'storybeat',  // parchment-style narrative choices (battery overrun)
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
  // Battery story beat
  ChargeBattery = 'charge_battery',
  HoldBack = 'hold_back',
  // Masséna story beat
  TendWounds = 'tend_wounds',
  CheckComrades = 'check_comrades',
  ScavengeAmmo = 'scavenge_ammo',
  // Gorge story beat
  AcceptOrder = 'accept_order',
  // Wounded Sergeant story beat (mid-Part 1)
  TakeCommand = 'take_command',
  RallyTheLine = 'rally_the_line',
  KeepYourHead = 'keep_your_head',
  // Melee transition story beat (end of Part 1 auto-play)
  FixBayonets = 'fix_bayonets',
  // Aftermath story beat (post-gorge)
  HelpWounded = 'help_wounded',
  FindComrades = 'find_comrades',
  SitDown = 'sit_down',
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
  Shoot = 'shoot',
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
  meleeContext: 'terrain' | 'battery';
  lastOppAttacked: boolean;
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
  outcome: 'pending' | 'victory' | 'defeat' | 'rout' | 'survived' | 'cavalry_victory' | 'part1_complete' | 'part2_gorge_setup' | 'gorge_victory';
  crisisTurn: number;
  volleysFired: number;
  lastLoadResult?: LoadResult;
  lastValorRoll?: ValorRollResult;
  // Scripted Phase 1
  scriptedVolley: number;          // 0=not scripted, 1-4=current volley
  aimCarefullySucceeded: boolean;
  jbCrisisResolved: boolean;
  jbCrisisOutcome?: 'steadied' | 'failed' | 'ignored' | 'shaken';
  // Phase 2: Story Beat
  chargeEncounter: number;         // 0=not in story beat, 1=battery, 2=masséna, 3=gorge, 4=aftermath
  // Phase 3: Melee
  meleeState?: MeleeState;
  // Part tracking
  battlePart: 1 | 2 | 3;
  batteryCharged: boolean;
  meleeStage: number;              // 1 = first melee, 2 = battery melee
  // Part 3: Gorge
  wagonDamage: number;             // cumulative, 0-100, detonates at 100
  gorgeTarget?: 'column' | 'officers' | 'wagon';  // stored during PRESENT, consumed during FIRE
  gorgeMercyCount: number;         // tracks how many times player showed mercy
  // Auto-play Part 1
  autoPlayActive: boolean;          // true during Part 1 auto-play
  autoPlayVolleyCompleted: number;  // 0-3, for save/resume
  graceEarned: boolean;             // transient flag: TakeCommand success grants grace
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
  LullInFire = 'lull_in_fire',
}

export interface BattleEvent {
  type: ShockEventType | RecoveryEventType;
  description: string;
  moraleEffect: number;
  triggered: boolean;
  targetNeighbour?: 'leftNeighbour' | 'rightNeighbour';
}

// === Camp System ===

export enum CampActivityId {
  Rest = 'rest',
  Train = 'train',
  Socialize = 'socialize',
  WriteLetters = 'write_letters',
  Gamble = 'gamble',
  Drill = 'drill',
  MaintainEquipment = 'maintain_equipment',
  Scout = 'scout',
  Pray = 'pray',
}

export interface CampActivity {
  id: CampActivityId;
  name: string;
  description: string;
  staminaCost: number;
  available: boolean;
  requiresTarget?: boolean;  // e.g. Socialize requires NPC target
}

export interface CampActivityResult {
  log: CampLogEntry[];
  statChanges: Partial<Record<string, number>>;
  npcChanges?: { npcId: string; relationship: number; trust: number }[];
  staminaChange: number;
  moraleChange: number;
  healthChange?: number;  // positive = healing
}

export interface CampLogEntry {
  day: number;
  text: string;
  type: 'narrative' | 'activity' | 'event' | 'result';
}

export enum CampEventCategory {
  Disease = 'disease',
  Desertion = 'desertion',
  Weather = 'weather',
  Supply = 'supply',
  Interpersonal = 'interpersonal',
  Orders = 'orders',
  Rumour = 'rumour',
}

export interface CampEventChoice {
  id: string;
  label: string;
  description: string;
  statCheck?: { stat: string; difficulty: number };
}

export interface CampEventResult {
  log: CampLogEntry[];
  statChanges: Partial<Record<string, number>>;
  moraleChange: number;
  npcChanges?: { npcId: string; relationship: number; trust: number }[];
}

export interface CampEvent {
  id: string;
  category: CampEventCategory;
  title: string;
  narrative: string;
  choices: CampEventChoice[];
  resolved: boolean;
}

export interface CampConditions {
  weather: 'clear' | 'rain' | 'snow' | 'cold';
  supplyLevel: 'abundant' | 'adequate' | 'scarce' | 'critical';
  campMorale: 'high' | 'steady' | 'low' | 'mutinous';
  location: string;
}

export interface CampState {
  day: number;
  maxDays: number;
  activitiesPerDay: number;
  activitiesRemaining: number;
  conditions: CampConditions;
  log: CampLogEntry[];
  pendingEvent?: CampEvent;
  completedActivities: CampActivityId[];
  triggeredEvents: string[];  // Event IDs already shown this camp
  health: number;    // 0-100, HIGH=good
  stamina: number;   // 0-100, HIGH=good (same scale everywhere)
  morale: number;    // 0-100, HIGH=good
  context: 'pre-battle' | 'post-battle';
}

// === Game State (top-level wrapper) ===

export interface GameState {
  phase: GamePhase;
  player: PlayerCharacter;
  npcs: NPC[];
  battleState?: BattleState;
  campState?: CampState;
  campaign: CampaignState;
}

export interface CampaignState {
  battlesCompleted: number;
  currentBattle: string;
  nextBattle: string;
  daysInCampaign: number;
}
