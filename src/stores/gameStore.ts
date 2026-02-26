import { create } from 'zustand';
import type { GameState, BattleState, CampState, PlayerCharacter, NPC, CampaignState } from '../types';
import { GamePhase } from '../types';
import {
  createNewGame,
  transitionToPreBattleCamp,
  transitionToBattle,
  transitionToPostBattleCamp,
  transitionToInterlude,
  transitionToNextBattle,
  isCampaignLastBattle,
} from '../core/gameLoop';
import { saveGame, loadGame } from '../core/persistence';

interface GameStore {
  // State
  gameState: GameState | null;
  phase: GamePhase;

  // Actions
  startNewGame: () => GameState;
  loadSavedGame: () => GameState | null;
  saveCurrentGame: () => void;
  setGameState: (gs: GameState) => void;
  transitionToPhase: (phase: GamePhase) => void;

  // Campaign actions
  advanceCampaign: () => void;
  continueToInterlude: () => void;
  continueToNextBattle: () => void;
  isLastBattle: () => boolean;

  // Convenience getters (derived from gameState)
  getPlayer: () => PlayerCharacter | null;
  getBattleState: () => BattleState | null;
  getCampState: () => CampState | null;
  getNpcs: () => NPC[];
  getCampaign: () => CampaignState | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  phase: GamePhase.Battle,

  startNewGame: () => {
    const gs = createNewGame();
    set({ gameState: gs, phase: gs.phase });
    return gs;
  },

  loadSavedGame: () => {
    const gs = loadGame();
    if (gs) {
      set({ gameState: gs, phase: gs.phase });
    }
    return gs;
  },

  saveCurrentGame: () => {
    const { gameState } = get();
    if (gameState) {
      saveGame(gameState);
    }
  },

  setGameState: (gs: GameState) => {
    set({ gameState: gs, phase: gs.phase });
  },

  transitionToPhase: (phase: GamePhase) => {
    const { gameState } = get();
    if (!gameState) return;

    if (phase === GamePhase.Camp) {
      transitionToPreBattleCamp(gameState);
    } else if (phase === GamePhase.Battle) {
      transitionToBattle(gameState);
    }

    set({ gameState: { ...gameState }, phase });
  },

  advanceCampaign: () => {
    const { gameState } = get();
    if (!gameState) return;

    transitionToPostBattleCamp(gameState);
    saveGame(gameState);
    set({ gameState: { ...gameState }, phase: gameState.phase });
  },

  continueToInterlude: () => {
    const { gameState } = get();
    if (!gameState) return;

    transitionToInterlude(gameState);
    saveGame(gameState);
    set({ gameState: { ...gameState }, phase: gameState.phase });
  },

  continueToNextBattle: () => {
    const { gameState } = get();
    if (!gameState) return;

    transitionToNextBattle(gameState);
    saveGame(gameState);
    set({ gameState: { ...gameState }, phase: gameState.phase });
  },

  isLastBattle: () => {
    const { gameState } = get();
    if (!gameState) return true;
    return isCampaignLastBattle(gameState);
  },

  getPlayer: () => get().gameState?.player ?? null,
  getBattleState: () => get().gameState?.battleState ?? null,
  getCampState: () => get().gameState?.campState ?? null,
  getNpcs: () => get().gameState?.npcs ?? [],
  getCampaign: () => get().gameState?.campaign ?? null,
}));
