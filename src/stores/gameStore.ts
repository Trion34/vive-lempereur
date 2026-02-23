import { create } from 'zustand';
import type { GameState, BattleState, CampState, PlayerCharacter, NPC, CampaignState } from '../types';
import { GamePhase } from '../types';
import { createNewGame, createBattleFromCharacter, transitionToPreBattleCamp, transitionToBattle } from '../core/gameLoop';
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

  getPlayer: () => get().gameState?.player ?? null,
  getBattleState: () => get().gameState?.battleState ?? null,
  getCampState: () => get().gameState?.campState ?? null,
  getNpcs: () => get().gameState?.npcs ?? [],
  getCampaign: () => get().gameState?.campaign ?? null,
}));
