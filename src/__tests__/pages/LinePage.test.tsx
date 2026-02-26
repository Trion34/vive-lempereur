import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinePage } from '../../pages/LinePage';
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

// Mock useCinematic
vi.mock('../../hooks/useCinematic', () => ({
  useCinematic: () => ({
    splashText: null,
    cinematicConfig: null,
    cinematicRef: { current: null },
    handleSplashProceed: vi.fn(),
    launchSplash: vi.fn(),
    launchCinematic: vi.fn(),
    destroyCinematic: vi.fn(),
  }),
}));

describe('LinePage', () => {
  beforeEach(() => {
    useUiStore.getState().resetUi();
  });

  it('renders null when battleState is missing', () => {
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: undefined });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<LinePage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the battle header and player condition panel', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Line,
      scriptedVolley: 1,
      autoPlayActive: false,
      availableActions: [],
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<LinePage />);
    expect(container.querySelector('#player-panel')).toBeInTheDocument();
    expect(screen.getByText('Your Condition')).toBeInTheDocument();
  });

  it('renders the Begin button at turn 1', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Line,
      ext: { battlePart: 1 },
      scriptedVolley: 1,
      autoPlayActive: false,
      availableActions: [],
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    render(<LinePage />);
    expect(screen.getByText('Begin')).toBeInTheDocument();
  });

  it('shows BattleOverScreen when battleOver is true', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Line,
      battleOver: true,
      outcome: 'defeat',
      autoPlayActive: false,
      availableActions: [],
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    render(<LinePage />);
    expect(screen.getByText('Pierre \u2014 Killed in Action')).toBeInTheDocument();
  });
});
