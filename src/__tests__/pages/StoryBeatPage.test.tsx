import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { StoryBeatPage } from '../../pages/StoryBeatPage';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { mockGameState, mockBattleState } from '../helpers/mockFactories';
import { GamePhase, BattlePhase } from '../../types';

// Mock persistence
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => ({ glory: 0, spent: {} })),
  addGlory: vi.fn(),
}));

// Mock useCinematic — the page relies on this heavily
const mockLaunchSplash = vi.fn();
const mockLaunchCinematic = vi.fn();
vi.mock('../../hooks/useCinematic', () => ({
  useCinematic: () => ({
    splashText: null,
    cinematicConfig: null,
    cinematicRef: { current: null },
    handleSplashProceed: vi.fn(),
    launchSplash: mockLaunchSplash,
    launchCinematic: mockLaunchCinematic,
    destroyCinematic: vi.fn(),
  }),
}));

describe('StoryBeatPage', () => {
  beforeEach(() => {
    useUiStore.getState().resetUi();
    mockLaunchSplash.mockClear();
    mockLaunchCinematic.mockClear();
  });

  it('renders without crashing when battleState exists', () => {
    const bs = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: 1,
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<StoryBeatPage />);
    // StoryBeatPage renders a BattleHeader
    expect(container.querySelector('.battle-header')).toBeInTheDocument();
  });

  it('renders null when battleState is missing', () => {
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: undefined });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<StoryBeatPage />);
    expect(container.innerHTML).toBe('');
  });

  it('launches cinematic for story beat', () => {
    const bs = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: 1,
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    render(<StoryBeatPage />);
    // The page should launch a splash for the encounter
    expect(mockLaunchSplash).toHaveBeenCalled();
  });
});
