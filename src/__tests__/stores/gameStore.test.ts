import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GamePhase } from '../../types';
import { mockGameState, mockBattleState, mockCampState } from '../helpers/mockFactories';

// Mock persistence module
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(),
}));

// Mock gameLoop module
vi.mock('../../core/gameLoop', () => ({
  createNewGame: vi.fn(),
  transitionToCamp: vi.fn(),
  transitionToBattle: vi.fn(),
  handleBattleVictory: vi.fn(),
  advanceToNextNode: vi.fn(),
}));

// Mock uiStore module — use vi.hoisted so the fn is available in the hoisted vi.mock factory
const { mockSetState } = vi.hoisted(() => ({
  mockSetState: vi.fn(),
}));
vi.mock('../../stores/uiStore', () => ({
  useUiStore: { setState: mockSetState },
}));

import { useGameStore } from '../../stores/gameStore';
import { saveGame, loadGame } from '../../core/persistence';
import {
  createNewGame,
  transitionToCamp,
  transitionToBattle,
  handleBattleVictory,
  advanceToNextNode,
} from '../../core/gameLoop';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({ gameState: null, phase: GamePhase.Battle });
    vi.clearAllMocks();
  });

  describe('startNewGame', () => {
    it('calls createNewGame, sets state and phase', () => {
      const gs = mockGameState({ phase: GamePhase.Camp });
      vi.mocked(createNewGame).mockReturnValue(gs);

      const result = useGameStore.getState().startNewGame();

      expect(createNewGame).toHaveBeenCalledOnce();
      expect(result).toBe(gs);
      expect(useGameStore.getState().gameState).toBe(gs);
      expect(useGameStore.getState().phase).toBe(GamePhase.Camp);
    });
  });

  describe('loadSavedGame', () => {
    it('calls loadGame and sets state when data exists', () => {
      const gs = mockGameState({ phase: GamePhase.Camp });
      vi.mocked(loadGame).mockReturnValue(gs);

      const result = useGameStore.getState().loadSavedGame();

      expect(loadGame).toHaveBeenCalledOnce();
      expect(result).toBe(gs);
      expect(useGameStore.getState().gameState).toBe(gs);
      expect(useGameStore.getState().phase).toBe(GamePhase.Camp);
    });

    it('sets store phase from saved game so AppRoot routes correctly', () => {
      const gs = mockGameState({ phase: GamePhase.Battle });
      vi.mocked(loadGame).mockReturnValue(gs);

      useGameStore.getState().loadSavedGame();

      // AppRoot subscribes to phase — setting it triggers reactive routing
      expect(useGameStore.getState().phase).toBe(GamePhase.Battle);
      expect(useGameStore.getState().gameState).toBe(gs);
    });

    it('returns null when no save exists', () => {
      vi.mocked(loadGame).mockReturnValue(null);

      const result = useGameStore.getState().loadSavedGame();

      expect(loadGame).toHaveBeenCalledOnce();
      expect(result).toBeNull();
      expect(useGameStore.getState().gameState).toBeNull();
    });
  });

  describe('saveCurrentGame', () => {
    it('calls saveGame with current gameState', () => {
      const gs = mockGameState();
      useGameStore.setState({ gameState: gs });

      useGameStore.getState().saveCurrentGame();

      expect(saveGame).toHaveBeenCalledOnce();
      expect(saveGame).toHaveBeenCalledWith(gs);
    });

    it('does nothing when gameState is null', () => {
      useGameStore.getState().saveCurrentGame();

      expect(saveGame).not.toHaveBeenCalled();
    });
  });

  describe('setGameState', () => {
    it('sets gameState and syncs phase', () => {
      const gs = mockGameState({ phase: GamePhase.Camp });

      useGameStore.getState().setGameState(gs);

      expect(useGameStore.getState().gameState).toBe(gs);
      expect(useGameStore.getState().phase).toBe(GamePhase.Camp);
    });
  });

  describe('transitionToPhase', () => {
    it('calls transitionToCamp when transitioning to Camp', () => {
      const gs = mockGameState();
      useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

      useGameStore.getState().transitionToPhase(GamePhase.Camp);

      expect(transitionToCamp).toHaveBeenCalledOnce();
      expect(transitionToCamp).toHaveBeenCalledWith(gs);
      expect(useGameStore.getState().phase).toBe(GamePhase.Camp);
    });

    it('calls transitionToBattle when transitioning to Battle', () => {
      const gs = mockGameState({ phase: GamePhase.Camp });
      useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });

      useGameStore.getState().transitionToPhase(GamePhase.Battle);

      expect(transitionToBattle).toHaveBeenCalledOnce();
      expect(transitionToBattle).toHaveBeenCalledWith(gs);
      expect(useGameStore.getState().phase).toBe(GamePhase.Battle);
    });

    it('does nothing when gameState is null', () => {
      useGameStore.getState().transitionToPhase(GamePhase.Camp);

      expect(transitionToCamp).not.toHaveBeenCalled();
      expect(transitionToBattle).not.toHaveBeenCalled();
      // Phase should remain unchanged
      expect(useGameStore.getState().phase).toBe(GamePhase.Battle);
    });
  });

  describe('advanceCampaign', () => {
    it('calls handleBattleVictory, advanceToNextNode, saveGame, and updates store', () => {
      const gs = mockGameState({ phase: GamePhase.Camp });
      useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

      useGameStore.getState().advanceCampaign();

      expect(handleBattleVictory).toHaveBeenCalledOnce();
      expect(handleBattleVictory).toHaveBeenCalledWith(gs);
      expect(advanceToNextNode).toHaveBeenCalledOnce();
      expect(advanceToNextNode).toHaveBeenCalledWith(gs);
      expect(saveGame).toHaveBeenCalledOnce();
      expect(saveGame).toHaveBeenCalledWith(gs);
      // Store should be updated with a spread copy
      expect(useGameStore.getState().gameState).not.toBeNull();
    });

    it('sets uiStore opening beat state when advancing to a battle', () => {
      const bs = mockBattleState();
      const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
      useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

      useGameStore.getState().advanceCampaign();

      expect(mockSetState).toHaveBeenCalledWith({
        showOpeningBeat: true,
        lastRenderedTurn: -1,
        phaseLogStart: 0,
      });
    });

    it('does not set uiStore opening beat when not advancing to a battle', () => {
      const gs = mockGameState({ phase: GamePhase.Camp, battleState: undefined });
      useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

      useGameStore.getState().advanceCampaign();

      expect(mockSetState).not.toHaveBeenCalled();
    });

    it('does nothing when gameState is null', () => {
      useGameStore.getState().advanceCampaign();

      expect(handleBattleVictory).not.toHaveBeenCalled();
      expect(advanceToNextNode).not.toHaveBeenCalled();
      expect(saveGame).not.toHaveBeenCalled();
    });
  });

  describe('advanceToNext', () => {
    it('calls advanceToNextNode, saveGame, and updates store', () => {
      const gs = mockGameState({ phase: GamePhase.Camp });
      useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });

      useGameStore.getState().advanceToNext();

      expect(advanceToNextNode).toHaveBeenCalledOnce();
      expect(advanceToNextNode).toHaveBeenCalledWith(gs);
      expect(saveGame).toHaveBeenCalledOnce();
      expect(saveGame).toHaveBeenCalledWith(gs);
      expect(useGameStore.getState().gameState).not.toBeNull();
    });

    it('does not call handleBattleVictory', () => {
      const gs = mockGameState();
      useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

      useGameStore.getState().advanceToNext();

      expect(handleBattleVictory).not.toHaveBeenCalled();
    });

    it('sets uiStore opening beat state when advancing to a battle', () => {
      const bs = mockBattleState();
      const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
      useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

      useGameStore.getState().advanceToNext();

      expect(mockSetState).toHaveBeenCalledWith({
        showOpeningBeat: true,
        lastRenderedTurn: -1,
        phaseLogStart: 0,
      });
    });

    it('does nothing when gameState is null', () => {
      useGameStore.getState().advanceToNext();

      expect(advanceToNextNode).not.toHaveBeenCalled();
      expect(saveGame).not.toHaveBeenCalled();
    });
  });

  describe('getPlayer', () => {
    it('returns player from gameState', () => {
      const gs = mockGameState();
      useGameStore.setState({ gameState: gs });

      const player = useGameStore.getState().getPlayer();

      expect(player).toBe(gs.player);
    });

    it('returns null when no gameState', () => {
      const player = useGameStore.getState().getPlayer();

      expect(player).toBeNull();
    });
  });

  describe('getBattleState', () => {
    it('returns battleState from gameState', () => {
      const bs = mockBattleState();
      const gs = mockGameState({ battleState: bs });
      useGameStore.setState({ gameState: gs });

      const result = useGameStore.getState().getBattleState();

      expect(result).toBe(bs);
    });

    it('returns null when gameState has no battleState', () => {
      const gs = mockGameState({ battleState: undefined });
      useGameStore.setState({ gameState: gs });

      const result = useGameStore.getState().getBattleState();

      expect(result).toBeNull();
    });
  });

  describe('getCampState', () => {
    it('returns campState from gameState', () => {
      const cs = mockCampState();
      const gs = mockGameState({ campState: cs });
      useGameStore.setState({ gameState: gs });

      const result = useGameStore.getState().getCampState();

      expect(result).toBe(cs);
    });

    it('returns null when gameState has no campState', () => {
      const gs = mockGameState({ campState: undefined });
      useGameStore.setState({ gameState: gs });

      const result = useGameStore.getState().getCampState();

      expect(result).toBeNull();
    });
  });

  describe('getNpcs', () => {
    it('returns npcs array from gameState', () => {
      const gs = mockGameState();
      useGameStore.setState({ gameState: gs });

      const npcs = useGameStore.getState().getNpcs();

      expect(npcs).toBe(gs.npcs);
    });

    it('returns empty array when no gameState', () => {
      const npcs = useGameStore.getState().getNpcs();

      expect(npcs).toEqual([]);
    });
  });

  describe('getCampaign', () => {
    it('returns campaign from gameState', () => {
      const gs = mockGameState();
      useGameStore.setState({ gameState: gs });

      const campaign = useGameStore.getState().getCampaign();

      expect(campaign).toBe(gs.campaign);
    });

    it('returns null when no gameState', () => {
      const campaign = useGameStore.getState().getCampaign();

      expect(campaign).toBeNull();
    });
  });
});
