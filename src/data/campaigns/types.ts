import type { MilitaryRank, NPCRole } from '../../types/enums';

// === Campaign Definition (data-driven, mirrors BattleConfig pattern) ===

export interface CampaignDef {
  id: string;
  title: string;
  battles: CampaignBattleEntry[];
  interludes: Record<string, InterludeDef>;
  replacementPool: NPCTemplate[];
}

export interface CampaignBattleEntry {
  battleId: string;
  title: string;
  subtitle: string;
  implemented: boolean;
}

export interface InterludeDef {
  fromBattle: string;
  toBattle: string;
  narrative: string[];
  splashText: string;
}

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
