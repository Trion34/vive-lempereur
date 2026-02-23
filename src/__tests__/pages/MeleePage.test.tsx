import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeleePage } from '../../pages/MeleePage';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { mockGameState, mockBattleState } from '../helpers/mockFactories';
import type { MeleeState } from '../../types';
import { GamePhase, BattlePhase, MeleeStance } from '../../types';

// Mock persistence
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => ({ glory: 0, spent: {} })),
  addGlory: vi.fn(),
}));

// Mock useMeleeAnimation — imperative DOM not testable in jsdom
vi.mock('../../hooks/useMeleeAnimation', () => ({
  useMeleeAnimation: () => ({
    animateSkirmishRound: vi.fn(async () => {}),
    animateReload: vi.fn(async () => {}),
    floatPlayerDeltas: vi.fn(),
    animatingRef: { current: false },
  }),
}));

// Mock useMeleeHotkeys
vi.mock('../../hooks/useMeleeHotkeys', () => ({
  useMeleeHotkeys: vi.fn(),
}));

function makeMeleeState(): MeleeState {
  return {
    opponents: [
      {
        name: 'Austrian Grenadier',
        type: 'line',
        health: 80,
        maxHealth: 80,
        stamina: 100,
        maxStamina: 100,
        fatigue: 0,
        maxFatigue: 200,
        strength: 40,
        stunned: false,
        stunnedTurns: 0,
        armInjured: false,
        legInjured: false,
        description: 'A line infantry soldier',
      },
    ],
    currentOpponent: 0,
    activeEnemies: [0],
    allies: [],
    roundNumber: 1,
    playerStance: MeleeStance.Balanced,
    roundLog: [],
    playerTargetIndex: 0,
    reloadProgress: 0,
    playerRiposte: false,
    playerStunned: 0,
    exchangeCount: 0,
    selectingStance: false,
    selectingTarget: false,
    killCount: 0,
    valorTempBonus: 0,
    maxExchanges: 20,
    meleeContext: 'battery',
    lastOppAttacked: false,
    playerGuarding: false,
    oppGuarding: false,
    maxActiveEnemies: 3,
    enemyPool: [],
    processedWaves: [],
    waveEvents: [],
  } as unknown as MeleeState;
}

describe('MeleePage', () => {
  beforeEach(() => {
    useUiStore.getState().resetUi();
  });

  it('renders null when battleState is missing', () => {
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: undefined });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<MeleePage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders null when meleeState is missing', () => {
    const bs = mockBattleState({ phase: BattlePhase.Melee });
    // No meleeState
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<MeleePage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the skirmish field when meleeState exists', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Melee,
      meleeState: makeMeleeState(),
      battleOver: false,
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = render(<MeleePage />);
    expect(container.querySelector('#skirmish-field')).toBeInTheDocument();
  });

  it('shows BattleOverScreen when battleOver=true', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Melee,
      meleeState: makeMeleeState(),
      battleOver: true,
      outcome: 'victory',
      pendingMoraleChanges: [],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    render(<MeleePage />);
    expect(screen.getByText('Pierre \u2014 Victory')).toBeInTheDocument();
  });
});
