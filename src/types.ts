// === Threshold constants ===

export const THRESHOLD_HIGH = 0.75;
// Health & Morale use uneven thresholds (75/40/15)
export const THRESHOLD_MID = 0.40;
export const THRESHOLD_LOW = 0.15;
// Stamina uses even tier thresholds (75/50/25)
export const STAMINA_THRESHOLD_MID = 0.50;
export const STAMINA_THRESHOLD_LOW = 0.25;

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
  if (pct >= STAMINA_THRESHOLD_MID) return StaminaState.Tired;
  if (pct >= STAMINA_THRESHOLD_LOW) return StaminaState.Exhausted;
  return StaminaState.Spent;
}

export function getStaminaPoolSize(endurance: number): number {
  return 30 + Math.round(1.5 * endurance);
}

export function getHealthPoolSize(constitution: number): number {
  return 30 + Math.round(1.5 * constitution);
}

export function getStaminaTierInfo(stamina: number, max: number): { points: number; poolSize: number } {
  const poolSize = Math.round(max / 4);
  const tierFloor = max * (
    stamina >= max * 0.75 ? 0.75 :
    stamina >= max * 0.50 ? 0.50 :
    stamina >= max * 0.25 ? 0.25 : 0
  );
  return { points: Math.round(stamina - tierFloor), poolSize };
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
  musketry: number;
  elan: number;
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
  heldFire: boolean;
  fumbledLoad: boolean;
  // Internal tracking (not displayed in battle)
  soldierRep: number;
  officerRep: number;
  napoleonRep: number;
  frontRank: boolean;
  duckedLastTurn: boolean;
  duckCount: number;
  prayerCount: number;
  canteenUses: number;
  turnsWithEmptyMusket: number;
}

// === PlayerCharacter (persistent across battles/camp — 3 stat tiers) ===

export interface PlayerCharacter {
  name: string;
  rank: MilitaryRank;
  // Arms (trained military skills)
  musketry: number;
  elan: number;
  // Physical
  strength: number;
  endurance: number;
  constitution: number;
  // Mental
  charisma: number;
  intelligence: number;
  awareness: number;
  // Spirit
  valor: number;
  // Persistent meters
  health: number;     // 0-100, HIGH=good (same scale as battle)
  morale: number;     // 0-100, HIGH=good (same scale as battle)
  stamina: number;    // 0-100, HIGH=good (100=Fresh, 0=Spent)
  grace: number;       // 0-2, consumable extra life
  soldierRep: number;   // 0-100, how rank-and-file see you
  officerRep: number;   // 0-100, how officers/NCOs view your discipline
  napoleonRep: number;  // 0-100, whether Napoleon knows you exist
  // Flags
  frontRank: boolean;
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
  alive: boolean;
  wounded: boolean;
  morale: number;
  maxMorale: number;
  // Stats (simplified for NPCs)
  valor: number;
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

export type MeleeMode = 'sequential' | 'skirmish';

export type AllyPersonality = 'aggressive' | 'balanced' | 'cautious';

export interface MeleeAlly {
  id: string;
  name: string;
  type: 'named' | 'generic';
  npcId?: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  strength: number;
  elan: number;
  alive: boolean;
  stunned: boolean;
  stunnedTurns: number;
  armInjured: boolean;
  legInjured: boolean;
  description: string;
  personality: AllyPersonality;
}

export interface AllyTemplate {
  id: string;
  name: string;
  type: 'named' | 'generic';
  npcId?: string;
  health: [number, number];
  stamina: [number, number];
  strength: number;
  elan: number;
  personality: AllyPersonality;
  description: string;
}

export interface RoundAction {
  actorName: string;
  actorSide: 'player' | 'ally' | 'enemy';
  targetName: string;
  action: MeleeActionId;
  bodyPart?: BodyPart;
  hit: boolean;
  damage: number;
  special?: string;
}

export interface WaveEvent {
  atRound: number;
  action: 'add_ally' | 'increase_max_enemies';
  allyTemplate?: AllyTemplate;
  newMaxEnemies?: number;
  narrative: string;
  /** If set, only triggers if NPC with this id is alive */
  conditionNpcAlive?: string;
}

export interface EncounterConfig {
  mode: MeleeMode;
  context: 'terrain' | 'battery';
  opponents: OpponentTemplate[];
  allies: AllyTemplate[];
  maxExchanges: number;
  initialActiveEnemies?: number;
  maxActiveEnemies?: number;
  waveEvents?: WaveEvent[];
}

export interface OpponentTemplate {
  name: string;
  type: 'conscript' | 'line' | 'veteran' | 'sergeant';
  health: [number, number];
  stamina: [number, number];
  strength: number;
  description: string;
}

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
  Respite = 'respite',
  Shoot = 'shoot',
  Reload = 'reload',
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
  strength: number;
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
  valorTempBonus: number;
  maxExchanges: number;
  meleeContext: 'terrain' | 'battery';
  lastOppAttacked: boolean;
  playerGuarding: boolean;
  oppGuarding: boolean;
  // Skirmish fields
  mode: MeleeMode;
  allies: MeleeAlly[];
  activeEnemies: number[];
  roundNumber: number;
  playerTargetIndex: number;
  roundLog: RoundAction[];
  maxActiveEnemies: number;
  enemyPool: number[];
  processedWaves: number[];
  waveEvents: WaveEvent[];
  reloadProgress: number;  // 0=empty, 1=halfway, 2→loaded
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
  battleOver: boolean;
  outcome: 'pending' | 'victory' | 'defeat' | 'rout' | 'survived' | 'cavalry_victory' | 'part1_complete' | 'part2_gorge_setup' | 'gorge_victory';
  crisisTurn: number;
  volleysFired: number;
  lastLoadResult?: LoadResult;
  lastValorRoll?: ValorRollResult;
  // Scripted Phase 1
  scriptedVolley: number;          // 0=not scripted, 1-4=current volley
  aimCarefullySucceeded: boolean;
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
  MaintainEquipment = 'maintain_equipment',
  Exercise = 'exercise',
  ArmsTraining = 'arms_training',
  Duties = 'duties',
}

// === Strain System (camp-only) ===

export enum StrainTier {
  Rested = 'rested',       // 0-30
  Strained = 'strained',   // 31-65
  Overworked = 'overworked', // 66-100
}

export function getStrainTier(strain: number): StrainTier {
  if (strain <= 30) return StrainTier.Rested;
  if (strain <= 65) return StrainTier.Strained;
  return StrainTier.Overworked;
}

export function getStrainPenalties(tier: StrainTier): { staminaPenalty: number; moralePenalty: number } {
  switch (tier) {
    case StrainTier.Rested: return { staminaPenalty: 0, moralePenalty: 0 };
    case StrainTier.Strained: return { staminaPenalty: 5, moralePenalty: 2 };
    case StrainTier.Overworked: return { staminaPenalty: 15, moralePenalty: 5 };
  }
}

export type RestSubActivity = 'lay_about' | 'bathe' | 'pray';

export type ExerciseSubActivity = 'fatigue_duty' | 'wrestle' | 'run';

export type ArmsTrainingSubActivity =
  | 'solo_musketry' | 'solo_elan'
  | 'comrades_musketry' | 'comrades_elan'
  | 'officers_musketry' | 'officers_elan';

export type DutySubActivity = 'drill' | 'volunteer' | 'check_equipment' | 'tend_wounded';

export interface ArmsTrainingTierConfig {
  cap: number;
  repRequired: number;
  repField: 'soldierRep' | 'officerRep';
  maxChance: number;
}

export const ARMS_TRAINING_TIERS: Record<'solo' | 'comrades' | 'officers', ArmsTrainingTierConfig> = {
  solo: { cap: 50, repRequired: 0, repField: 'soldierRep', maxChance: 80 },
  comrades: { cap: 70, repRequired: 20, repField: 'soldierRep', maxChance: 85 },
  officers: { cap: 85, repRequired: 50, repField: 'officerRep', maxChance: 90 },
};

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
  npcChanges?: { npcId: string; relationship: number }[];
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
  staminaChange?: number;
  npcChanges?: { npcId: string; relationship: number }[];
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
  day: number;              // kept for log entries (always 1)
  actionsTotal: number;
  actionsRemaining: number;
  conditions: CampConditions;
  log: CampLogEntry[];
  pendingEvent?: CampEvent;
  completedActivities: CampActivityId[];
  triggeredEvents: string[];  // Event IDs already shown this camp
  health: number;    // 0-100, HIGH=good
  stamina: number;   // 0-100, HIGH=good (same scale everywhere)
  morale: number;    // 0-100, HIGH=good
  strain: number;    // 0-100, camp-only (resets each camp stay)
  batheCooldown: number;   // 0 = available, decrements each activity
  prayedThisCamp: boolean; // true after first pray, blocks further use
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
