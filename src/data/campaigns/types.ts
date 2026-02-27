import type {
  MilitaryRank,
  NPCRole,
  CampActivityId,
  CampConditions,
  CampState,
  PlayerCharacter,
  NPC,
  CampEvent,
  CampActivityResult,
} from '../../types';

// === Campaign Node (ordered sequence of campaign events) ===

export type CampaignNode =
  | { type: 'interlude'; interludeId: string }
  | { type: 'camp'; campId: string }
  | { type: 'battle'; battleId: string };

// === Campaign Definition (data-driven, mirrors BattleConfig pattern) ===

export interface CampaignDef {
  id: string;
  title: string;
  npcs: NPCTemplate[];
  sequence: CampaignNode[];
  camps: Record<string, CampConfig>;
  interludes: Record<string, InterludeDef>;
  replacementPool: NPCTemplate[];
}

// === Camp config (moved from battle types) ===

export interface CampConfig {
  id: string;
  title: string;
  actionsTotal: number;
  weather: CampConditions['weather'];
  supplyLevel: CampConditions['supplyLevel'];
  openingNarrative: string;
  forcedEvents: ForcedEventConfig[];
  randomEvents: RandomEventConfig[];
  activityNarratives?: Partial<Record<CampActivityId, string[]>>;
}

export interface ForcedEventConfig {
  id: string;
  /** Actions remaining threshold */
  triggerAt: number;
  getEvent: (state: CampState, player: PlayerCharacter) => CampEvent;
  resolveChoice: (
    state: CampState,
    player: PlayerCharacter,
    npcs: NPC[],
    choiceId: string,
    checkPassed: boolean,
  ) => CampActivityResult;
}

export interface RandomEventConfig {
  id: string;
  /** Probability weight */
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
