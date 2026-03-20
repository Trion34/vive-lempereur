import { MeleeActionId, MeleeStance, BodyPart, MeleeContext } from './enums';

export type OpponentType = 'conscript' | 'line' | 'veteran' | 'sergeant';

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
  fatigue: number;
  maxFatigue: number;
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

/** Meter snapshot captured after a RoundAction's mutations are applied */
export interface CombatantSnapshot {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  morale?: number; // only present for player
  maxMorale?: number; // only present for player
}

export interface RoundAction {
  /** Event discriminator (absent = 'action' for save compat) */
  eventType?: 'action' | 'arrival' | 'defeat';

  actorName: string;
  actorSide: 'player' | 'ally' | 'enemy';
  targetName: string;

  /** Explicit target side (eliminates guessing in animation) */
  targetSide?: 'player' | 'ally' | 'enemy';

  action: MeleeActionId;
  bodyPart?: BodyPart;
  hit: boolean;
  damage: number;
  special?: string;
  blocked?: boolean;
  targetKilled?: boolean;
  actorAfter?: CombatantSnapshot;
  targetAfter?: CombatantSnapshot;

  /** Display text for arrival/defeat events */
  narrative?: string;

  // --- V2 visual-feedback metadata (populated only when momentum is enabled) ---
  momentumAfter?: number;
  freeStrikeEarned?: boolean;
  momentumBroken?: boolean;
  riposteEarned?: boolean;
  killRefund?: number;
  freeStrikeUsed?: boolean;
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
  context: MeleeContext;
  opponents: OpponentTemplate[];
  allies: AllyTemplate[];
  maxExchanges: number;
  initialActiveEnemies?: number;
  maxActiveEnemies?: number;
  waveEvents?: WaveEvent[];
}

export interface OpponentTemplate {
  name: string;
  type: OpponentType;
  health: [number, number];
  stamina: [number, number];
  strength: number;
  description: string;
}

export interface MeleeOpponent {
  name: string;
  type: OpponentType;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  strength: number;
  stunned: boolean;
  stunnedTurns: number;
  armInjured: boolean;
  legInjured: boolean;
  description: string;
  momentum: number;
  freeStrikeReady: boolean;
  /** Player actions this opponent has observed (cap 6, v2 only) */
  observedPlayerActions: MeleeActionId[];
  /** 0-100, affects AI aggression (v2 only) */
  temperament: number;
}

export interface MeleeState {
  opponents: MeleeOpponent[];
  currentOpponent: number;
  playerStance: MeleeStance;
  playerRiposte: boolean;
  playerStunned: number;
  exchangeCount: number;
  selectingStance: boolean;
  selectingTarget: boolean;
  selectedAction?: MeleeActionId;
  killCount: number;
  valorTempBonus: number;
  maxExchanges: number;
  meleeContext: MeleeContext;
  lastOppAttacked: boolean;
  playerGuarding: boolean;
  oppGuarding: boolean;
  // Combat field state
  allies: MeleeAlly[];
  activeEnemies: number[];
  roundNumber: number;
  playerTargetIndex: number;
  roundLog: RoundAction[];
  maxActiveEnemies: number;
  enemyPool: number[];
  processedWaves: number[];
  waveEvents: WaveEvent[];
  reloadProgress: number; // 0=empty, 1=halfway, 2→loaded
  playerMomentum: number;
  playerFreeStrikeReady: boolean;
  freeStrikeUsedThisRound?: boolean;
}
