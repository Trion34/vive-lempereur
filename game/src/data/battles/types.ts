import type {
  Action,
  BattleState,
  BattleExt,
  LineMoraleState,
  LogEntry,
  MoraleChange,
  ChargeChoice,
  EncounterConfig,
  NPC,
  EnemyState,
  DrillStep,
  ChargeChoiceId,
} from '../../types';
import { MeleeContext } from '../../types';

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

  /** UI labels for header display */
  labels: BattleLabels;
  /** Returns available actions for special volley phases (e.g., gorge target selection).
   *  If absent, no special actions are available. */
  getAvailableActions?: (state: BattleState) => Action[];

  /** Optional post-melee transition handler. Called when melee concludes (survived/victory/max rounds).
   *  Mutates state to push narrative and set phase. Return true if handled (skip generic script-based transition). */
  postMeleeTransition?: (state: BattleState, meleeContext: MeleeContext) => boolean;

  /** Optional camp-to-battle flag sync. Called during transitionToBattle to map camp flags onto battle ext. */
  syncCampFlags?: (battleState: BattleState, campFlags: Record<string, boolean>) => void;

  /** Optional custom gorge-style fire resolver (target-based fire, e.g., Rivoli Part 3). */
  resolveCustomFire?: (state: BattleState, volleys: VolleyConfig[]) => import('../../types').ScriptedFireResult;

  /** Optional custom gorge-style present resolver (target selection, e.g., Rivoli Part 3). */
  resolveCustomPresent?: (state: BattleState, action: import('../../types').ActionId, volleyIdx: number, volleys: VolleyConfig[]) => { moraleChanges: import('../../types').MoraleChange[]; log: import('../../types').LogEntry[] };
}

// === Battle labels (for UI header) ===

export interface BattleLabels {
  /** Story beat title labels keyed by encounter ID */
  storyBeats: Record<number, string>;
  /** Encounter subtitle labels keyed by encounter ID */
  encounterTitles?: Record<number, string>;
  /** Line phase labels keyed by battle part number */
  linePhases: Record<number, string>;
  /** Melee phase labels keyed by melee stage number */
  meleePhases: Record<number, string>;
  /** Max volley number per battle part (for "Volley X of Y" display) */
  volleyMaxes: Record<number, number>;
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
  meleeContext: MeleeContext;
}

export interface SetupSegment {
  type: 'setup';
  /** Mutate state for the next phase */
  apply: (state: BattleState) => void;
}

// === Volley config ===

/** Pure data describing volley mechanics — authorable in the lab */
export interface VolleyMechanics {
  range: number;
  fireAccuracyBase: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number;
  narratives: {
    present: string;
    fireOrder: string;
    endure: string;
    fireHit: string[];
    fireMiss: string[];
  };
  returnFire?: {
    frontRankBonus?: number;
    fatalChance?: number;
  };
  staminaCost?: number;
  staminaRecovery?: number;
}

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
  /** Stamina drained per volley. If absent, defaults to 12. */
  staminaCost?: number;
  /** Stamina recovered per volley. If absent, defaults to 4. */
  staminaRecovery?: number;
  /** Optional structured mechanics data — when present, overrides def + narratives fields */
  mechanics?: VolleyMechanics;
}

export interface VolleyDef {
  range: number;
  fireAccuracyBase: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number;
}

/**
 * Build a VolleyConfig from VolleyMechanics (lab-authored data).
 * Events slot is a no-op — scripted events are wired separately.
 */
export function buildVolleyConfigFromMechanics(mechanics: VolleyMechanics): VolleyConfig {
  return {
    def: {
      range: mechanics.range,
      fireAccuracyBase: mechanics.fireAccuracyBase,
      perceptionBase: mechanics.perceptionBase,
      enemyReturnFireChance: mechanics.enemyReturnFireChance,
      enemyReturnFireDamage: mechanics.enemyReturnFireDamage,
      enemyLineDamage: mechanics.enemyLineDamage,
    },
    narratives: mechanics.narratives,
    events: () => ({ log: [], moraleChanges: [] }),
    returnFire: mechanics.returnFire,
    staminaCost: mechanics.staminaCost,
    staminaRecovery: mechanics.staminaRecovery,
    mechanics,
  };
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
  virtueChange?: number;
}

// === Battle init config ===

export interface BattleInitConfig {
  /** Initial enemy state */
  enemy: EnemyState;
  /** Battle-specific initial values */
  ext: BattleExt;
  /** Starting scripted volley (1-based) */
  startingVolley: number;
  /** Initial line morale label */
  lineMorale: LineMoraleState;
}

// === Battle roles ===

export interface BattleRoles {
  leftNeighbour?: string;
  rightNeighbour?: string;
  officer: string;
  nco?: string;
}
