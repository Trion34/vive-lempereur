import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OpeningBeatPage } from '../../pages/OpeningBeatPage';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { mockGameState, mockBattleState } from '../helpers/mockFactories';
import { GamePhase, BattlePhase } from '../../types';
import { BattleConfigProvider } from '../../contexts/BattleConfigContext';
import type { BattleConfig } from '../../data/battles/types';

// Register Rivoli config so getBattleConfig works
import '../../data/battles/rivoli';

// Mock persistence
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  saveGlory: vi.fn(),
  loadGlory: vi.fn(() => 0),
  deleteSave: vi.fn(),
  setActiveProfile: vi.fn(),
}));

// Mock CinematicOverlay — jsdom cannot run its animation/portal logic
vi.mock('../../components/overlays/CinematicOverlay', () => ({
  CinematicOverlay: vi.fn(() => null),
}));

// Mock useCinematic — OpeningBeatPage relies on this heavily
const mockLaunchSplash = vi.fn();
const mockDestroyCinematic = vi.fn();
const mockHandleSplashProceed = vi.fn();

let mockSplashText: string | null = null;
let mockCinematicConfig: unknown = null;

vi.mock('../../hooks/useCinematic', () => ({
  useCinematic: () => ({
    splashText: mockSplashText,
    cinematicConfig: mockCinematicConfig,
    cinematicRef: { current: null },
    handleSplashProceed: mockHandleSplashProceed,
    launchSplash: mockLaunchSplash,
    launchCinematic: vi.fn(),
    destroyCinematic: mockDestroyCinematic,
  }),
}));

/** Minimal BattleConfig for testing -- only the fields OpeningBeatPage accesses. */
function makeBattleConfig(overrides: Partial<BattleConfig> = {}): BattleConfig {
  return {
    id: 'rivoli',
    meta: { title: 'BATTLE OF RIVOLI', date: '14 January 1797', playerUnit: '14th demi-brigade', enemyUnit: 'Austrian column' },
    opening: { narrative: '', splashText: 'Fate Beckons...', choiceLabel: 'Take your place in the line', choiceDesc: '' },
    npcs: [],
    roles: { officer: 'leclerc' },
    script: [],
    init: {
      enemy: { range: 100, strength: 300, quality: 'line', morale: 'steady', lineIntegrity: 50, artillery: false, cavalryThreat: false },
      ext: { battlePart: 1, wagonDamage: 0, gorgeMercyCount: 0, batteryCharged: false, gorgeTarget: '', meleeStage: 0 },
      startingVolley: 1,
      lineMorale: 'steady',
    },
    volleys: [],
    encounters: {},
    storyBeats: {},
    outcomes: {},
    labels: { storyBeats: {}, linePhases: {}, meleePhases: {}, volleyMaxes: {} },
    ...overrides,
  } as BattleConfig;
}

/** Wrapper that provides BattleConfigContext for OpeningBeatPage. */
function renderWithConfig(config: BattleConfig | null = makeBattleConfig()) {
  return render(
    <BattleConfigProvider value={config}>
      <OpeningBeatPage />
    </BattleConfigProvider>,
  );
}

describe('OpeningBeatPage', () => {
  beforeEach(() => {
    // Reset mock state
    mockSplashText = null;
    mockCinematicConfig = null;
    mockLaunchSplash.mockClear();
    mockDestroyCinematic.mockClear();
    mockHandleSplashProceed.mockClear();
    useUiStore.getState().resetUi();
  });

  // ----- Rendering -----

  it('renders without crashing when battleState exists', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Line,
      log: [{ turn: 0, type: 'narrative', text: 'The sun rises over the plateau.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = renderWithConfig();
    expect(container.querySelector('.battle-header')).toBeInTheDocument();
  });

  it('renders null when battleState is missing', () => {
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: undefined });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = renderWithConfig();
    expect(container.innerHTML).toBe('');
  });

  it('renders null when gameState is null', () => {
    useGameStore.setState({ gameState: null });

    const { container } = renderWithConfig();
    expect(container.innerHTML).toBe('');
  });

  // ----- Splash launch -----

  it('launches splash on mount with battle config splash text', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Dawn breaks.\n\nThe drums beat.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    expect(mockLaunchSplash).toHaveBeenCalledTimes(1);
    expect(mockLaunchSplash).toHaveBeenCalledWith(
      'Fate Beckons...',
      expect.any(Function),
    );
  });

  it('uses custom splash text from battle config', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text here.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const config = makeBattleConfig({
      opening: { narrative: '', splashText: 'To Arms!', choiceLabel: 'March', choiceDesc: 'Forward.' },
    });
    renderWithConfig(config);

    expect(mockLaunchSplash).toHaveBeenCalledWith('To Arms!', expect.any(Function));
  });

  it('does not re-launch splash when already showing splash', () => {
    // Simulate splash already visible
    mockSplashText = 'Already showing';

    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    // Should not call launchSplash because splashText is truthy
    expect(mockLaunchSplash).not.toHaveBeenCalled();
  });

  it('does not re-launch splash when cinematic is showing', () => {
    // Simulate cinematic already active
    mockCinematicConfig = { title: 'Test', chunks: [], choices: [] };

    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    expect(mockLaunchSplash).not.toHaveBeenCalled();
  });

  // ----- Cinematic config generation -----

  it('launchSplash callback produces correct cinematic config', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Dawn breaks.\n\nThe drums beat.\n\nForward march.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    // Extract the cinematic config factory (second arg to launchSplash)
    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();

    expect(config.title).toBe('BATTLE OF RIVOLI');
    expect(config.subtitle).toBe('14 January 1797');
    expect(config.chunks).toEqual(['Dawn breaks.', 'The drums beat.', 'Forward march.']);
    expect(config.choices).toHaveLength(1);
    expect(config.choices[0].id).toBe('begin');
    expect(config.choices[0].label).toBe('Take your place in the line');
  });

  it('uses custom choice label from battle config', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Some text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const config = makeBattleConfig({
      opening: { narrative: '', splashText: 'Go', choiceLabel: 'Enter the fray', choiceDesc: 'Fight!' },
    });
    renderWithConfig(config);

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const cinematicCfg = configFn();
    expect(cinematicCfg.choices[0].label).toBe('Enter the fray');
    expect(cinematicCfg.choices[0].desc).toBe('Fight!');
  });

  it('splits log text into chunks by double-newline', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Paragraph one.\n\nParagraph two.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    expect(config.chunks).toEqual(['Paragraph one.', 'Paragraph two.']);
  });

  it('handles empty log gracefully', () => {
    const bs = mockBattleState({ log: [] });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    expect(config.chunks).toEqual([]);
  });

  it('filters out blank chunks from log text', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Start.\n\n\n\nEnd.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    // Blank paragraphs between double-newlines should be filtered out
    expect(config.chunks.every((c: string) => c.trim().length > 0)).toBe(true);
  });

  // ----- Choice callback / state transition -----

  it('onChoice clears showOpeningBeat and destroys cinematic', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ showOpeningBeat: true });

    renderWithConfig();

    // Extract onChoice from the cinematic config
    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    config.onChoice();

    expect(mockDestroyCinematic).toHaveBeenCalled();
    expect(useUiStore.getState().showOpeningBeat).toBe(false);
  });

  it('onChoice sets lastRenderedTurn to -1', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });
    useUiStore.setState({ lastRenderedTurn: 5 });

    renderWithConfig();

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    config.onChoice();

    expect(useUiStore.getState().lastRenderedTurn).toBe(-1);
  });

  it('onChoice sets phaseLogStart to current log length', () => {
    const bs = mockBattleState({
      log: [
        { turn: 0, type: 'narrative', text: 'Entry 1.' },
        { turn: 1, type: 'narrative', text: 'Entry 2.' },
        { turn: 2, type: 'narrative', text: 'Entry 3.' },
      ],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    config.onChoice();

    expect(useUiStore.getState().phaseLogStart).toBe(3);
  });

  // ----- SplashOverlay rendering -----

  it('renders SplashOverlay when splashText is set', () => {
    mockSplashText = 'Fate Beckons...';

    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    // SplashOverlay renders via portal to document.body
    expect(screen.getByText('Fate Beckons...')).toBeInTheDocument();
    expect(screen.getByText('Click to continue')).toBeInTheDocument();
  });

  it('does not render SplashOverlay when splashText is null', () => {
    mockSplashText = null;

    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    expect(screen.queryByText('Click to continue')).not.toBeInTheDocument();
  });

  // ----- Overlay toggles -----

  it('renders BattleHeader with all overlay buttons', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = renderWithConfig();
    expect(container.querySelector('.battle-header')).toBeInTheDocument();
    expect(screen.getByTitle('Journal')).toBeInTheDocument();
    expect(screen.getByTitle('Character')).toBeInTheDocument();
    expect(screen.getByTitle('Inventory')).toBeInTheDocument();
    expect(screen.getByTitle('Settings')).toBeInTheDocument();
    expect(screen.getByTitle('Restart')).toBeInTheDocument();
  });

  it('shows journal overlay when journal button clicked', async () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Some log text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const journalBtn = screen.getByTitle('Journal');
    await userEvent.click(journalBtn);

    // The BattleJournal overlay should now be visible
    expect(screen.getByText('Some log text.')).toBeInTheDocument();
  });

  it('toggles journal overlay off on second click', async () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Journal text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const journalBtn = screen.getByTitle('Journal');
    await userEvent.click(journalBtn); // open
    await userEvent.click(journalBtn); // close

    // Journal text should no longer be rendered
    expect(screen.queryByText('Journal text.')).not.toBeInTheDocument();
  });

  it('shows character panel when character button clicked', async () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const charBtn = screen.getByTitle('Character');
    await userEvent.click(charBtn);

    // Character panel renders player name
    expect(screen.getByText('Pierre')).toBeInTheDocument();
  });

  it('shows inventory panel when inventory button clicked', async () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const invBtn = screen.getByTitle('Inventory');
    await userEvent.click(invBtn);

    // Inventory panel renders equipment (Charleville M1777 is the display name)
    expect(screen.getByText('Charleville M1777')).toBeInTheDocument();
  });

  it('switching overlays closes the previous one', async () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Log entry.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    // Open journal
    const journalBtn = screen.getByTitle('Journal');
    await userEvent.click(journalBtn);
    expect(screen.getByText('Log entry.')).toBeInTheDocument();

    // Open character (should close journal)
    const charBtn = screen.getByTitle('Character');
    await userEvent.click(charBtn);

    // Journal content no longer rendered, character panel is
    expect(screen.queryByText('Log entry.')).not.toBeInTheDocument();
    expect(screen.getByText('Pierre')).toBeInTheDocument();
  });

  // ----- Settings button -----

  it('settings button sets showSettings in uiStore', async () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig();

    const settingsBtn = screen.getByTitle('Settings');
    await userEvent.click(settingsBtn);

    expect(useUiStore.getState().showSettings).toBe(true);
  });

  // ----- Fallback labels -----

  it('falls back to default labels when battle config is null', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Default text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    renderWithConfig(null);

    // launchSplash should use fallback 'Fate Beckons...'
    expect(mockLaunchSplash).toHaveBeenCalledWith('Fate Beckons...', expect.any(Function));

    const configFn = mockLaunchSplash.mock.calls[0][1];
    const config = configFn();
    expect(config.title).toBe('BATTLE');
    expect(config.subtitle).toBe('');
    expect(config.choices[0].label).toBe('Take your place in the line');
  });

  // ----- Cleanup -----

  it('calls destroyCinematic on unmount', () => {
    const bs = mockBattleState({
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { unmount } = renderWithConfig();
    unmount();

    expect(mockDestroyCinematic).toHaveBeenCalled();
  });

  // ----- Phase label in header -----

  it('displays phase label from battle config labels', () => {
    const bs = mockBattleState({
      phase: BattlePhase.Line,
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const config = makeBattleConfig({
      labels: {
        storyBeats: {},
        linePhases: { 1: 'THE OPENING VOLLEYS' },
        meleePhases: {},
        volleyMaxes: { 1: 4 },
      },
    });
    renderWithConfig(config);

    expect(screen.getByText(/THE OPENING VOLLEYS/)).toBeInTheDocument();
  });

  it('displays turn counter from battleState', () => {
    const bs = mockBattleState({
      turn: 7,
      log: [{ turn: 0, type: 'narrative', text: 'Text.' }],
    });
    const gs = mockGameState({ phase: GamePhase.Battle, battleState: bs });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Battle });

    const { container } = renderWithConfig();

    const turnCounter = container.querySelector('.turn-counter');
    expect(turnCounter).toBeInTheDocument();
    expect(turnCounter!.textContent).toContain('7');
  });
});
