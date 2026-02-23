import { GamePhase } from './enums';
import type { PlayerCharacter, NPC } from './player';
import type { BattleState } from './battle';
import type { CampState } from './camp';

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
