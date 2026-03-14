import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntroPage } from '../../pages/IntroPage';
import { useGameStore } from '../../stores/gameStore';
import { useGloryStore } from '../../stores/gloryStore';
import { useProfileStore } from '../../stores/profileStore';
import { GamePhase, MilitaryRank, CampaignPhase } from '../../types';

// Mock persistence — jsdom has no real localStorage persistence layer
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  saveGlory: vi.fn(),
  loadGlory: vi.fn(() => 0),
  deleteSave: vi.fn(),
  setActiveProfile: vi.fn(),
}));

// Mock gameLoop — completeCharacterCreation mutates state
const mockCompleteCharacterCreation = vi.fn((gs: Record<string, unknown>) => {
  gs.needsCharacterCreation = false;
});
vi.mock('../../core/gameLoop', () => ({
  createNewGame: vi.fn(),
  completeCharacterCreation: (gs: Record<string, unknown>) => mockCompleteCharacterCreation(gs),
  transitionToCamp: vi.fn(),
  transitionToBattle: vi.fn(),
  handleBattleVictory: vi.fn(),
  advanceToNextNode: vi.fn(),
}));

// Register campaign config
import '../../data/campaigns/italy';

/** Build a fresh intro-phase GameState for each test. */
function makeIntroGameState() {
  return {
    phase: GamePhase.Camp,
    needsCharacterCreation: true,
    player: {
      name: 'Soldier',
      rank: MilitaryRank.Private,
      valor: 40,
      musketry: 35,
      elan: 35,
      strength: 40,
      endurance: 40,
      constitution: 45,
      charisma: 30,
      intelligence: 30,
      awareness: 35,
      health: 100,
      morale: 100,
      stamina: 100,
      grace: 0,
      soldierRep: 50,
      officerRep: 50,
      napoleonRep: 0,
      frontRank: false,
      attributes: {},
      virtue: 0,
      sous: 0,
      equipment: {
        musket: 'Charleville 1777',
        bayonet: 'Socket bayonet',
        musketCondition: 70,
        uniformCondition: 50,
      },
    },
    npcs: [],
    campaign: {
      campaignId: 'italy',
      sequenceIndex: 0,
      phase: CampaignPhase.Battle,
      battlesCompleted: 0,
      currentBattle: 'rivoli',
      nextBattle: '',
      daysInCampaign: 0,
      npcDeaths: [],
      replacementsUsed: [],
    },
  };
}

describe('IntroPage', () => {
  beforeEach(() => {
    mockCompleteCharacterCreation.mockClear();
    useGloryStore.setState({ glory: 0, lifetimeGlory: 0, glorySpent: {} });
    useProfileStore.setState({
      activeProfileId: 1,
      profiles: [
        { id: 1, playerName: '', lifetimeGlory: 0, currentGlory: 0, lastPlayed: null },
        { id: 2, playerName: '', lifetimeGlory: 0, currentGlory: 0, lastPlayed: null },
        { id: 3, playerName: '', lifetimeGlory: 100, currentGlory: 100, lastPlayed: null },
      ],
    });
    useGameStore.setState({
      gameState: makeIntroGameState() as any,
      phase: GamePhase.Camp,
    });
  });

  // ----- Rendering -----

  it('renders without crashing', () => {
    const { container } = render(<IntroPage />);
    expect(container.querySelector('.intro-container')).toBeInTheDocument();
  });

  it('renders Character Sheet title', () => {
    render(<IntroPage />);
    expect(screen.getByText('Character Sheet')).toBeInTheDocument();
  });

  it('renders the name input with default value', () => {
    render(<IntroPage />);
    const input = screen.getByPlaceholderText('Enter your name...') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('John');
  });

  it('renders the Begin button', () => {
    render(<IntroPage />);
    expect(screen.getByText('Begin')).toBeInTheDocument();
  });

  it('renders all stat sections', () => {
    render(<IntroPage />);
    expect(screen.getByText('Arms')).toBeInTheDocument();
    expect(screen.getByText('Physical')).toBeInTheDocument();
    expect(screen.getByText('Mental')).toBeInTheDocument();
    expect(screen.getByText('Spirit')).toBeInTheDocument();
  });

  it('renders all nine stats', () => {
    render(<IntroPage />);
    expect(screen.getByText('Musketry')).toBeInTheDocument();
    expect(screen.getByText('\u00c9lan')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('Endurance')).toBeInTheDocument();
    expect(screen.getByText('Constitution')).toBeInTheDocument();
    expect(screen.getByText('Charisma')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Awareness')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
  });

  it('renders stat default values', () => {
    render(<IntroPage />);
    // Musketry=35, Elan=35, Awa=35 (3x), Str=40, End=40, Val=40 (3x), Con=45, Cha=30, Int=30 (2x)
    const vals = screen.getAllByText(/^\d+$/, { selector: '.intro-stat-val' });
    const numbers = vals.map((el) => Number(el.textContent));
    // Should have 9 stat values rendered
    expect(numbers).toHaveLength(9);
    // Verify expected stat values are present
    expect(numbers.filter((n) => n === 35)).toHaveLength(3); // Musketry, Elan, Awareness
    expect(numbers.filter((n) => n === 40)).toHaveLength(3); // Strength, Endurance, Valor
    expect(numbers.filter((n) => n === 45)).toHaveLength(1); // Constitution
    expect(numbers.filter((n) => n === 30)).toHaveLength(2); // Charisma, Intelligence
  });

  // ----- Glory banner -----

  it('renders GLORY banner with 0 glory', () => {
    render(<IntroPage />);
    expect(screen.getByText('GLORY')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Earned through valorous deeds across campaigns.')).toBeInTheDocument();
  });

  it('renders GLORY banner with available glory', () => {
    useGloryStore.setState({ glory: 10, lifetimeGlory: 10 });
    render(<IntroPage />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Each stat increase costs 1 Glory.')).toBeInTheDocument();
  });

  // ----- Grace banner -----

  it('renders GRACE banner at 0/2', () => {
    render(<IntroPage />);
    expect(screen.getByText('GRACE')).toBeInTheDocument();
    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

  it('disables Buy Grace button when glory is insufficient', () => {
    render(<IntroPage />);
    const btn = screen.getByText('Buy Grace (5 Glory)');
    expect(btn).toBeDisabled();
  });

  it('enables Buy Grace button when glory >= 5', () => {
    useGloryStore.setState({ glory: 5, lifetimeGlory: 5 });
    render(<IntroPage />);
    const btn = screen.getByText('Buy Grace (5 Glory)');
    expect(btn).not.toBeDisabled();
  });

  it('buying grace decreases glory by 5 and increases grace', async () => {
    useGloryStore.setState({ glory: 10, lifetimeGlory: 10 });
    render(<IntroPage />);

    const btn = screen.getByText('Buy Grace (5 Glory)');
    await userEvent.click(btn);

    // Glory decreased
    expect(useGloryStore.getState().glory).toBe(5);
    // Grace count shown as 1 / 2
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('disables Buy Grace when grace is at cap (2)', async () => {
    // Set grace to 2 on the player
    const gs = makeIntroGameState();
    gs.player.grace = 2;
    useGameStore.setState({ gameState: gs as any });
    useGloryStore.setState({ glory: 10, lifetimeGlory: 10 });

    render(<IntroPage />);
    const btn = screen.getByText('Buy Grace (5 Glory)');
    expect(btn).toBeDisabled();
    expect(screen.getByText('Grace is full.')).toBeInTheDocument();
  });

  // ----- Coin Purse banner -----

  it('renders COIN PURSE banner', () => {
    render(<IntroPage />);
    expect(screen.getByText('COIN PURSE')).toBeInTheDocument();
    expect(screen.getByText('0 sous')).toBeInTheDocument();
  });

  it('disables Buy Sous button when glory is 0', () => {
    render(<IntroPage />);
    const btn = screen.getByText('Buy Sous (1 Glory)');
    expect(btn).toBeDisabled();
  });

  it('enables Buy Sous button when glory >= 1', () => {
    useGloryStore.setState({ glory: 3, lifetimeGlory: 3 });
    render(<IntroPage />);
    const btn = screen.getByText('Buy Sous (1 Glory)');
    expect(btn).not.toBeDisabled();
  });

  it('buying sous decreases glory by 1 and adds 10 sous', async () => {
    useGloryStore.setState({ glory: 3, lifetimeGlory: 3 });
    render(<IntroPage />);

    const btn = screen.getByText('Buy Sous (1 Glory)');
    await userEvent.click(btn);

    expect(useGloryStore.getState().glory).toBe(2);
    expect(screen.getByText('10 sous')).toBeInTheDocument();
  });

  // ----- Rank select -----

  it('shows Private rank as active and Officer as disabled', () => {
    render(<IntroPage />);
    const privateBtn = screen.getByText('Private');
    const officerBtn = screen.getByText('Officer');
    expect(privateBtn).toBeInTheDocument();
    expect(officerBtn).toBeDisabled();
  });

  // ----- Stat changes with glory -----

  it('stat increase buttons are disabled when glory is 0', () => {
    render(<IntroPage />);
    // All "+" buttons should be disabled
    const plusBtns = screen.getAllByText('+');
    plusBtns.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('stat decrease buttons are disabled with no glory spent', () => {
    render(<IntroPage />);
    // All "-" buttons should be disabled (nothing spent to refund)
    const minusBtns = screen.getAllByText('-');
    minusBtns.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('stat increase works when glory is available', async () => {
    useGloryStore.setState({ glory: 5, lifetimeGlory: 5 });
    render(<IntroPage />);

    // Click the first "+" button (Musketry)
    const plusBtns = screen.getAllByText('+');
    await userEvent.click(plusBtns[0]);

    // Glory should decrease by 1
    expect(useGloryStore.getState().glory).toBe(4);
    // Musketry was 35, now should be 40 (step = 5)
    const player = useGameStore.getState().gameState!.player;
    expect(player.musketry).toBe(40);
  });

  it('stat decrease refunds glory after increase', async () => {
    useGloryStore.setState({ glory: 5, lifetimeGlory: 5 });
    render(<IntroPage />);

    // Increase then decrease Musketry
    const plusBtns = screen.getAllByText('+');
    const minusBtns = screen.getAllByText('-');
    await userEvent.click(plusBtns[0]); // Musketry +5 → 40, glory 4
    await userEvent.click(minusBtns[0]); // Musketry -5 → 35, glory 5

    expect(useGloryStore.getState().glory).toBe(5);
    const player = useGameStore.getState().gameState!.player;
    expect(player.musketry).toBe(35);
  });

  // ----- Name input -----

  it('allows changing the name', async () => {
    render(<IntroPage />);
    const input = screen.getByPlaceholderText('Enter your name...') as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, 'Napoleon');
    expect(input.value).toBe('Napoleon');
  });

  it('disables Begin when name is empty', async () => {
    render(<IntroPage />);
    const input = screen.getByPlaceholderText('Enter your name...');
    await userEvent.clear(input);

    const beginBtn = screen.getByText('Begin');
    expect(beginBtn).toBeDisabled();
  });

  it('enables Begin when name is non-empty', () => {
    render(<IntroPage />);
    // Default name is 'John'
    const beginBtn = screen.getByText('Begin');
    expect(beginBtn).not.toBeDisabled();
  });

  // ----- Begin button -----

  it('clicking Begin calls completeCharacterCreation', async () => {
    render(<IntroPage />);

    const beginBtn = screen.getByText('Begin');
    await userEvent.click(beginBtn);

    expect(mockCompleteCharacterCreation).toHaveBeenCalledTimes(1);
  });

  it('clicking Begin sets the player name on gameState', async () => {
    render(<IntroPage />);

    const input = screen.getByPlaceholderText('Enter your name...');
    await userEvent.clear(input);
    await userEvent.type(input, 'Dupont');

    const beginBtn = screen.getByText('Begin');
    await userEvent.click(beginBtn);

    const player = useGameStore.getState().gameState!.player;
    expect(player.name).toBe('Dupont');
  });

  // ----- Null state -----

  it('renders null when gameState has no player', () => {
    useGameStore.setState({ gameState: null });
    const { container } = render(<IntroPage />);
    // StatsStep returns null when player is missing; IntroPage still renders container
    // but stats step is absent
    expect(container.querySelector('#intro-stats-step')).not.toBeInTheDocument();
  });

  // ----- Test screen button -----

  it('renders test screen button', () => {
    const { container } = render(<IntroPage />);
    expect(container.querySelector('#btn-test-screen')).toBeInTheDocument();
  });

  it('renders hidden test screen div', () => {
    const { container } = render(<IntroPage />);
    const testScreen = container.querySelector('#test-screen') as HTMLElement;
    expect(testScreen).toBeInTheDocument();
    expect(testScreen.style.display).toBe('none');
  });

  // ----- Attributes section -----

  it('shows Literate attribute as disabled (coming soon)', () => {
    render(<IntroPage />);
    const attrBtn = screen.getByText('Literate');
    expect(attrBtn).toBeDisabled();
  });

  // ----- Multiple glory interactions -----

  it('multiple stat increases deplete glory correctly', async () => {
    useGloryStore.setState({ glory: 3, lifetimeGlory: 3 });
    render(<IntroPage />);

    const plusBtns = screen.getAllByText('+');
    // Increase Musketry (+5), Strength (+5), Valor (+5)
    await userEvent.click(plusBtns[0]); // Musketry → 40, glory 2
    await userEvent.click(plusBtns[2]); // Strength → 45, glory 1
    await userEvent.click(plusBtns[8]); // Valor → 45, glory 0

    expect(useGloryStore.getState().glory).toBe(0);

    const player = useGameStore.getState().gameState!.player;
    expect(player.musketry).toBe(40);
    expect(player.strength).toBe(45);
    expect(player.valor).toBe(45);

    // All + buttons should now be disabled (no glory)
    const updatedPlusBtns = screen.getAllByText('+');
    updatedPlusBtns.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('stat cannot be increased beyond its max', async () => {
    // Max for Musketry is 70; set it close to max
    const gs = makeIntroGameState();
    gs.player.musketry = 70; // already at max
    useGameStore.setState({ gameState: gs as any });
    useGloryStore.setState({ glory: 10, lifetimeGlory: 10 });

    render(<IntroPage />);

    // The Musketry "+" button should be disabled (already at max 70)
    // Musketry is the first stat cell
    const plusBtns = screen.getAllByText('+');
    // First plus is Musketry
    expect(plusBtns[0]).toBeDisabled();
  });
});
