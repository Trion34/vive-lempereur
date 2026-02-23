import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AppRoot } from '../../AppRoot';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { mockGameState, mockBattleState } from '../helpers/mockFactories';
import { GamePhase, BattlePhase, MeleeStance } from '../../types';

// Mock persistence to prevent actual localStorage access
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => 10),
  addGlory: vi.fn(),
  saveGlory: vi.fn(),
  resetGlory: vi.fn(),
}));

// Mock gameLoop — createNewGame is called by the store's startNewGame action
vi.mock('../../core/gameLoop', () => ({
  createNewGame: vi.fn(),
  createBattleFromCharacter: vi.fn(),
  transitionToPreBattleCamp: vi.fn(),
  transitionToBattle: vi.fn(),
}));

// Mock useCinematic to avoid DOM-dependent splash/cinematic logic in page components
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

// Mock useMeleeAnimation to return no-op async functions
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

describe('AppRoot routing', () => {
  beforeEach(() => {
    // Reset stores to clean state before each test
    useGameStore.setState({ gameState: null, phase: GamePhase.Battle });
    useUiStore.getState().resetUi();

    // Override startNewGame to be a no-op that returns the current gameState
    // This prevents AppRoot's useEffect from overriding our test state
    const origStartNewGame = useGameStore.getState().startNewGame;
    useGameStore.setState({
      startNewGame: () => useGameStore.getState().gameState!,
    } as any);
  });

  it('renders null when gameState is not initialized', () => {
    useGameStore.setState({ gameState: null });
    const { container } = render(<AppRoot />);
    // AppRoot returns null before gameState exists, but startNewGame runs in useEffect
    // so we check that initially there's at most the DevToolsPanel
    expect(container.querySelector('.phase-line')).toBeNull();
    expect(container.querySelector('.phase-camp')).toBeNull();
  });

  it('renders IntroPage for BattlePhase.Intro', () => {
    const bs = mockBattleState({ phase: BattlePhase.Intro });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showOpeningBeat: false, showCredits: false });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-intro')).toBeInTheDocument();
  });

  it('renders CampPage for GamePhase.Camp', () => {
    const gs = mockGameState({ phase: GamePhase.Camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ showOpeningBeat: false, showCredits: false });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-camp')).toBeInTheDocument();
  });

  it('renders LinePage for BattlePhase.Line', () => {
    const bs = mockBattleState({ phase: BattlePhase.Line });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showOpeningBeat: false, showCredits: false });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-line')).toBeInTheDocument();
  });

  it('renders OpeningBeatPage when showOpeningBeat=true and BattlePhase.Line', () => {
    const bs = mockBattleState({ phase: BattlePhase.Line });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showOpeningBeat: true, showCredits: false });

    const { container } = render(<AppRoot />);
    // OpeningBeatPage renders in .phase-charge
    expect(container.querySelector('.phase-charge')).toBeInTheDocument();
  });

  it('renders StoryBeatPage for BattlePhase.StoryBeat', () => {
    const bs = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: 1 });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showOpeningBeat: false, showCredits: false });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-charge')).toBeInTheDocument();
  });

  it('renders MeleePage for BattlePhase.Melee', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Melee,
      meleeState: {
        opponents: [],
        activeEnemies: [],
        allies: [],
        roundNumber: 1,
        playerStance: MeleeStance.Balanced,
        roundLog: [],
        currentOpponent: 0,
        playerRiposte: false,
        playerStunned: 0,
        exchangeCount: 0,
        selectingStance: false,
        selectingTarget: false,
        killCount: 0,
        valorTempBonus: 0,
        maxExchanges: 20,
        meleeContext: 'battery' as const,
        lastOppAttacked: false,
        playerGuarding: false,
        oppGuarding: false,
        playerTargetIndex: 0,
        maxActiveEnemies: 3,
        enemyPool: [],
        processedWaves: [],
        waveEvents: [],
        reloadProgress: 0,
      },
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showOpeningBeat: false, showCredits: false });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-melee')).toBeInTheDocument();
  });

  it('renders CreditsScreen when showCredits=true', () => {
    const bs = mockBattleState({ battleOver: true, outcome: 'victory' });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showCredits: true });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-credits')).toBeInTheDocument();
  });
});
