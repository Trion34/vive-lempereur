import type {
  BattleState,
  RivoliExt,
  LogEntry,
  MoraleChange,
  ChargeChoice,
  EncounterConfig,
  NPC,
  EnemyState,
  DrillStep,
  ChargeChoiceId,
} from '../../types';

// === Top-level battle config ===

export interface BattleConfig {
  /** Unique battle identifier: 'rivoli', 'montenotte', etc. */
  id: string;
  /** UI-facing metadata */
  meta: BattleMeta;

  /** All NPCs available for this battle */
  npcs: NPC[];
  /** Who fills left/right/officer positions */
  roles: BattleRoles;

  /** Ordered sequence of battle phases */
  script: BattleSegment[];
  /** Initial state when battle begins */
  init: BattleInitConfig;

  /** Per-volley config: parameters + narratives + events */
  volleys: VolleyConfig[];

  /** Melee encounter definitions */
  encounters: Record<string, EncounterConfig>;

  /** Narrative choice points keyed by encounter id */
  storyBeats: Record<number, StoryBeatConfig>;

  /** Battle-over text per ending */
  outcomes: Record<string, OutcomeConfig>;
  /** Opening narrative + splash screen */
  opening: OpeningConfig;
}

// === Battle metadata ===

export interface BattleMeta {
  title: string;
  date: string;
  playerUnit: string;
  enemyUnit: string;
  historicalNote?: string;
}

// === Opening / Outcomes ===

export interface OpeningConfig {
  narrative: string;
  splashText: string;
  choiceLabel: string;
  choiceDesc: string;
}

export interface OutcomeConfig {
  title: string;
  narrative: string | ((state: BattleState) => string);
}

// === Battle script segments ===

export type BattleSegment =
  | VolleyBatchSegment
  | StoryBeatSegment
  | MeleeSegment
  | SetupSegment;

export interface VolleyBatchSegment {
  type: 'volleys';
  /** First volley index (0-based) */
  startIdx: number;
  /** Last volley index (inclusive) */
  endIdx: number;
  /** Standard = load/fire/endure; Gorge = target selection */
  mode: 'standard' | 'gorge';
}

export interface StoryBeatSegment {
  type: 'story_beat';
  /** Maps to storyBeats[id] in the config */
  id: number;
  /** Dynamically insert segments after this beat resolves */
  getFollowUp?: (state: BattleState) => BattleSegment[];
}

export interface MeleeSegment {
  type: 'melee';
  /** Maps to encounters[key] in the config */
  encounterKey: string;
  meleeContext: string;
}

export interface SetupSegment {
  type: 'setup';
  /** Mutate state for the next phase */
  apply: (state: BattleState) => void;
}

// === Volley config ===

export interface VolleyConfig {
  /** Combat parameters */
  def: VolleyDef;
  /** Narrative text per drill step */
  narratives: {
    fireOrder: string;
    present: string;
    endure: string;
    fireHit: string[];
    fireMiss: string[];
  };
  /** Scripted events per volley */
  events: (state: BattleState, step: DrillStep) => VolleyEventResult;
  /** Return fire overrides */
  returnFire?: {
    frontRankBonus?: number;
    fatalChance?: number;
  };
}

export interface VolleyDef {
  range: number;
  fireAccuracyBase: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number;
}

export interface VolleyEventResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
}

// === Story beat config ===

export interface StoryBeatConfig {
  id: number;
  /** Generate narrative text (may check NPC state) */
  getNarrative: (state: BattleState) => string;
  /** Generate available choices (may gate on state) */
  getChoices: (state: BattleState) => ChargeChoice[];
  /** Resolve a player's choice */
  resolveChoice: (state: BattleState, choiceId: ChargeChoiceId) => StoryBeatResult;
}

export interface StoryBeatResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
}

// === Battle init config ===

export interface BattleInitConfig {
  /** Initial enemy state */
  enemy: EnemyState;
  /** Battle-specific initial values */
  ext: RivoliExt;
  /** Starting scripted volley (1-based) */
  startingVolley: number;
  /** Initial line morale label */
  lineMorale: string;
}

// === Battle roles ===

export interface BattleRoles {
  leftNeighbour?: string;
  rightNeighbour?: string;
  officer: string;
  nco?: string;
}
