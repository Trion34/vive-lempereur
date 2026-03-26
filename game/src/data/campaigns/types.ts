import type {
  NumericStatKey,
  AttributeId,
  MilitaryRank,
  NPCRole,
  CampActivityId,
  CampConditions,
  CampState,
  CampEventCategory,
  PlayerCharacter,
  NPC,
  CampEvent,
  CampActivityResult,
} from '../../types';

// === Campaign Node (ordered sequence of campaign events) ===

export type CampaignNode =
  | { type: 'interlude'; interludeId: string }
  | { type: 'camp'; campId: string }
  | { type: 'battle'; battleId: string }
  | { type: 'vn'; sceneId: string };

// === VN Scene Definition ===
// Full playable VN scene for use in CampaignDef.vnScenes.

import type { VNScene } from '../../types/vnTypes';

export type VNSceneDef = VNScene;

// === Campaign Definition (data-driven, mirrors BattleConfig pattern) ===

export interface CampaignDef {
  id: string;
  title: string;
  npcs: NPCTemplate[];
  sequence: CampaignNode[];
  camps: Record<string, CampConfig>;
  interludes: Record<string, InterludeDef>;
  vnScenes?: Record<string, VNSceneDef>;
  replacementPool: NPCTemplate[];
}

// === Declarative Camp Events ===

/** Pure-data outcome for one choice path */
export interface EventOutcome {
  narrative: string;
  statChanges?: Partial<Record<NumericStatKey, number>>;
  moraleChange?: number;
  staminaChange?: number;
  healthChange?: number;
  sousChange?: number;
  virtueChange?: number;
  npcRelationshipChanges?: { npcId: string; delta: number }[];
  flagChanges?: Record<string, boolean>;
  playerFields?: Partial<Record<'frontRank', boolean>>;
}

export interface ChoiceLock {
  requireAttribute?: AttributeId;
  requireSous?: number;
  lockedMessage?: string;
}

export interface DeclarativeEventChoice {
  id: string;
  label: string;
  description: string;
  statCheck?: { stat: NumericStatKey; difficulty: number };
  lock?: ChoiceLock;
  pass: EventOutcome;
  fail?: EventOutcome;
}

export interface DeclarativeCampEvent {
  id: string;
  title: string;
  category: CampEventCategory;
  narrative: string;
  choices: DeclarativeEventChoice[];
}

// === Event Config (union of declarative + imperative) ===

export interface DeclarativeForcedEventConfig {
  kind: 'declarative';
  id: string;
  triggerAt: number;
  condition?: (state: CampState, player: PlayerCharacter) => boolean;
  event: DeclarativeCampEvent;
}

export interface ImperativeForcedEventConfig {
  kind: 'imperative';
  id: string;
  triggerAt: number;
  condition?: (state: CampState, player: PlayerCharacter) => boolean;
  getEvent: (state: CampState, player: PlayerCharacter) => CampEvent;
  resolveChoice: (
    state: CampState,
    player: PlayerCharacter,
    npcs: NPC[],
    choiceId: string,
    checkPassed: boolean,
  ) => CampActivityResult;
}

export interface VNForcedEventConfig {
  kind: 'vn';
  id: string;
  triggerAt: number;
  condition?: (state: CampState, player: PlayerCharacter) => boolean;
  scene: VNScene;
  /** Splash screen title (defaults to scene.title) */
  title?: string;
}

export type AnyForcedEventConfig = DeclarativeForcedEventConfig | ImperativeForcedEventConfig | VNForcedEventConfig;

export interface DeclarativeRandomEventConfig {
  kind: 'declarative';
  id: string;
  weight: number;
  event: DeclarativeCampEvent;
}

export interface ImperativeRandomEventConfig {
  kind: 'imperative';
  id: string;
  weight: number;
  getEvent: (state: CampState, player: PlayerCharacter) => CampEvent;
  resolveChoice: (
    state: CampState,
    player: PlayerCharacter,
    npcs: NPC[],
    choiceId: string,
    checkPassed: boolean,
  ) => CampActivityResult;
}

export interface VNRandomEventConfig {
  kind: 'vn';
  id: string;
  weight: number;
  scene: VNScene;
  /** Splash screen title (defaults to scene.title) */
  title?: string;
}

export type AnyRandomEventConfig = DeclarativeRandomEventConfig | ImperativeRandomEventConfig | VNRandomEventConfig;

// === Camp config ===

export interface CampConfig {
  id: string;
  title: string;
  actionsTotal: number;
  weather: CampConditions['weather'];
  supplyLevel: CampConditions['supplyLevel'];
  openingNarrative: string;
  forcedEvents: AnyForcedEventConfig[];
  randomEvents: AnyRandomEventConfig[];
  /** Probability (0-1) of a random event firing per action. Defaults to 0.4. */
  randomEventChance?: number;
  activityNarratives?: Partial<Record<CampActivityId, string[]>>;
}

// === Interlude ===

export interface InterludeDef {
  fromBattle: string;
  toBattle: string;
  narrative: string[];
  splashText: string;
}

// === NPC Templates ===

export interface NPCTemplate {
  id: string;
  name: string;
  role: NPCRole;
  rank: MilitaryRank;
  personality: string;
  /** Narrative shown on a successful socialize activity with this NPC */
  socializeNarrative?: string;
  baseStats: {
    valor: number;
    morale: number;
    maxMorale: number;
    relationship: number;
  };
}
