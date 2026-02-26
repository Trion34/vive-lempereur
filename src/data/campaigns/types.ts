import type { MilitaryRank, NPCRole, CampActivityId } from '../../types/enums';
import type { CampState } from '../../types/camp';
import type { PlayerCharacter } from '../../types/player';
import type { CampEvent, CampActivityResult } from '../../types/camp';

// === Campaign Node (ordered sequence of campaign events) ===

export type CampaignNode =
  | { type: 'interlude'; interludeId: string }
  | { type: 'camp'; campId: string }
  | { type: 'battle'; battleId: string };

// === Campaign Definition (data-driven, mirrors BattleConfig pattern) ===

export interface CampaignDef {
  id: string;
  title: string;
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
  weather: string;
  supplyLevel: string;
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
    choiceId: string,
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
    choiceId: string,
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
  baseStats: {
    valor: number;
    morale: number;
    maxMorale: number;
    relationship: number;
  };
}
