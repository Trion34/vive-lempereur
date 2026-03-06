import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CampPage } from '../../pages/CampPage';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { mockGameState, mockCampState } from '../helpers/mockFactories';
import { GamePhase } from '../../types';

// Mock persistence
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => ({ glory: 0, spent: {} })),
  addGlory: vi.fn(),
}));

// Mock useCinematic — camp prologue uses this
const mockLaunchCinematic = vi.fn();
vi.mock('../../hooks/useCinematic', () => ({
  useCinematic: () => ({
    splashText: null,
    cinematicConfig: null,
    cinematicRef: { current: null },
    handleSplashProceed: vi.fn(),
    launchSplash: vi.fn(),
    launchCinematic: mockLaunchCinematic,
    destroyCinematic: vi.fn(),
  }),
}));

describe('CampPage', () => {
  beforeEach(() => {
    useUiStore.getState().resetUi();
    mockLaunchCinematic.mockClear();
  });

  it('renders null when gameState is missing', () => {
    useGameStore.setState({ gameState: null, phase: GamePhase.Camp });

    const { container } = render(<CampPage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders null when campState is missing', () => {
    const gs = mockGameState({ phase: GamePhase.Camp });
    // No campState set
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });

    const { container } = render(<CampPage />);
    expect(container.innerHTML).toBe('');
  });

  it('renders camp page when campState and gameState are both present', () => {
    const camp = mockCampState();
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ campIntroSeen: true });

    const { container } = render(<CampPage />);
    // Should render camp content (not null)
    expect(container.innerHTML).not.toBe('');
  });

  it('renders camp body after intro is seen', () => {
    const camp = mockCampState();
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ campIntroSeen: true });

    render(<CampPage />);
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Conditions')).toBeInTheDocument();
    expect(screen.getByText('Camp Log')).toBeInTheDocument();
  });

  it('renders location from camp conditions', () => {
    const camp = mockCampState({ conditions: { location: 'Rivoli Plateau', weather: 'cold', supplyLevel: 'scarce', campMorale: 'low' } });
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ campIntroSeen: true });

    render(<CampPage />);
    expect(screen.getByText('Rivoli Plateau')).toBeInTheDocument();
  });

  it('renders camp log entries', () => {
    const camp = mockCampState({
      log: [
        { day: 1, text: 'The regiment arrives at camp.', type: 'narrative' },
        { day: 1, text: 'You set up your tent.', type: 'activity' },
      ],
    });
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ campIntroSeen: true });

    render(<CampPage />);
    // Log is collapsed by default — entries should not be visible
    expect(screen.queryByText('The regiment arrives at camp.')).not.toBeInTheDocument();

    // Click the "Camp Log" toggle to expand
    fireEvent.click(screen.getByText('Camp Log'));
    expect(screen.getByText('The regiment arrives at camp.')).toBeInTheDocument();
    expect(screen.getByText('You set up your tent.')).toBeInTheDocument();
  });

  it('opens Character panel when portrait is clicked', () => {
    const camp = mockCampState();
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ campIntroSeen: true });

    render(<CampPage />);
    // Character panel should not be visible initially
    expect(screen.queryByText('Valor')).not.toBeInTheDocument();

    // Click the portrait area
    const portrait = screen.getByText(gs.player.name).closest('.camp-header-portrait')!;
    fireEvent.click(portrait);

    // Character panel should now be visible with stat rows
    expect(screen.getByText('Valor')).toBeInTheDocument();
    expect(screen.getByText('View Inventory')).toBeInTheDocument();
  });

  it('switches from Character panel to Inventory panel via View Inventory button', () => {
    const camp = mockCampState();
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
    useUiStore.setState({ campIntroSeen: true });

    render(<CampPage />);

    // Open Character panel
    const portrait = screen.getByText(gs.player.name).closest('.camp-header-portrait')!;
    fireEvent.click(portrait);

    // Click View Inventory button
    fireEvent.click(screen.getByText('View Inventory'));

    // Character panel should be gone, Inventory panel should be open
    expect(screen.queryByText('View Inventory')).not.toBeInTheDocument();
    // Inventory panel shows equipment condition header
    expect(screen.getByText('Charleville M1777')).toBeInTheDocument();
  });
});
