import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AppRoot } from '../../AppRoot';
import { useGameStore } from '../../stores/gameStore';
import { useGloryStore } from '../../stores/gloryStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useUiStore } from '../../stores/uiStore';
import { useProfileStore } from '../../stores/profileStore';
import { mockGameState, mockBattleState } from '../helpers/mockFactories';
import { GamePhase, BattlePhase, MeleeStance, MeleeContext } from '../../types';

// Mock persistence to prevent actual localStorage access
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => 0),
  addGlory: vi.fn(),
  saveGlory: vi.fn(),
  deleteSave: vi.fn(),
  setActiveProfile: vi.fn(),
  getActiveProfile: vi.fn(() => null),
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

// Mock resolution utility
const mockApplyResolution = vi.fn();
vi.mock('../../utils/resolution', () => ({
  applyResolution: (...args: unknown[]) => mockApplyResolution(...args),
  detectBestResolution: () => '1920x1080',
  RESOLUTIONS: [
    { value: '1280x720', label: '1280 \u00d7 720', w: 1280, h: 720 },
    { value: '1920x1080', label: '1920 \u00d7 1080', w: 1920, h: 1080 },
  ],
  DEFAULT_RESOLUTION: '1920x1080',
}));

describe('AppRoot routing', () => {
  beforeEach(() => {
    // Reset stores to clean state before each test
    useGameStore.setState({ gameState: null, phase: GamePhase.Battle });
    useUiStore.getState().resetUi();
    mockApplyResolution.mockClear();

    // Override startNewGame to be a no-op that returns the current gameState
    // This prevents AppRoot's useEffect from overriding our test state
    const origStartNewGame = useGameStore.getState().startNewGame;
    useGameStore.setState({
      startNewGame: () => useGameStore.getState().gameState!,
    } as any);

    // Set a profile as active by default (so we don't get the profile screen)
    useProfileStore.setState({ activeProfileId: 1 });
  });

  it('renders ProfilePage when no profile is selected', () => {
    useProfileStore.setState({ activeProfileId: null });
    const gs = mockGameState({ phase: GamePhase.Camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });

    const { container } = render(<AppRoot />);
    expect(container.querySelector('.phase-profile')).toBeInTheDocument();
  });

  it('renders null when gameState is not initialized', () => {
    useGameStore.setState({ gameState: null });
    const { container } = render(<AppRoot />);
    // AppRoot returns null before gameState exists
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
        meleeContext: MeleeContext.Battery,
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

  it('calls applyResolution with current resolution on mount', () => {
    useSettingsStore.setState({ resolution: '1280x720' });
    const gs = mockGameState({ phase: GamePhase.Camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });

    render(<AppRoot />);
    expect(mockApplyResolution).toHaveBeenCalledWith('1280x720');
  });
});
