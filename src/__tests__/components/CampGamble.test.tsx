import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CampActionPanel } from '../../components/camp/CampActionPanel';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { mockGameState, mockCampState } from '../helpers/mockFactories';
import { CampActivityId, GamePhase } from '../../types';

// Mock persistence
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => ({ glory: 0, spent: {} })),
  addGlory: vi.fn(),
}));

describe('CampActionPanel — Gamble (Passe-dix)', () => {
  const mockOnActivity = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useUiStore.getState().resetUi();

    const camp = mockCampState();
    const gs = mockGameState({ phase: GamePhase.Camp, campState: camp });
    useGameStore.setState({ gameState: gs, phase: GamePhase.Camp });
  });

  it('shows Gamble as unlocked in the Socialize menu', () => {
    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    const gambleBtn = screen.getByText('Gamble');
    expect(gambleBtn).toBeInTheDocument();
    // Should NOT have opacity 0.4 (locked)
    const btn = gambleBtn.closest('button');
    expect(btn?.style.opacity).not.toBe('0.4');
  });

  it('navigates to Passe-dix sub-view when Gamble is clicked', () => {
    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    fireEvent.click(screen.getByText('Gamble'));

    // Should now show the Passe-dix header
    expect(screen.getByText('PASSE-DIX')).toBeInTheDocument();
    expect(screen.getByText('STAKE')).toBeInTheDocument();
    expect(screen.getByText('CALL')).toBeInTheDocument();
  });

  it('shows three stake options', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    expect(screen.getByText('Cautious')).toBeInTheDocument();
    expect(screen.getByText('Fair')).toBeInTheDocument();
    expect(screen.getByText('Reckless')).toBeInTheDocument();
  });

  it('shows Passe and Manque bet buttons', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    expect(screen.getByText('Passe')).toBeInTheDocument();
    expect(screen.getByText('Over 10')).toBeInTheDocument();
    expect(screen.getByText('Manque')).toBeInTheDocument();
    expect(screen.getByText('10 or under')).toBeInTheDocument();
  });

  it('calls onActivity with Gamble and stake:bet when Passe is clicked', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    // Default stake is 'medium'
    fireEvent.click(screen.getByText('Passe'));
    expect(mockOnActivity).toHaveBeenCalledWith(CampActivityId.Gamble, 'medium:passe');
  });

  it('calls onActivity with Gamble and stake:bet when Manque is clicked', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    fireEvent.click(screen.getByText('Manque'));
    expect(mockOnActivity).toHaveBeenCalledWith(CampActivityId.Gamble, 'medium:manque');
  });

  it('changes stake when a different stake button is clicked', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    // Click High stake
    fireEvent.click(screen.getByText('Reckless'));
    // Now click Passe — should use high stake
    fireEvent.click(screen.getByText('Passe'));
    expect(mockOnActivity).toHaveBeenCalledWith(CampActivityId.Gamble, 'high:passe');
  });

  it('has a BACK button that returns to parent', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    const backBtn = screen.getByText('BACK');
    expect(backBtn).toBeInTheDocument();
    fireEvent.click(backBtn);

    // campActionSub should be reset to null
    expect(useUiStore.getState().campActionSub).toBeNull();
  });

  it('hides stake and bet buttons after result is shown', () => {
    useUiStore.setState({
      campActionSub: 'gamble',
      campActionResult: {
        text: 'You won the pot!',
        changes: ['soldierRep: +3'],
      },
    });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    // Should still show header and BACK
    expect(screen.getByText('PASSE-DIX')).toBeInTheDocument();
    expect(screen.getByText('BACK')).toBeInTheDocument();

    // Bet buttons should be hidden
    expect(screen.queryByText('Passe')).not.toBeInTheDocument();
    expect(screen.queryByText('Manque')).not.toBeInTheDocument();
    expect(screen.queryByText('STAKE')).not.toBeInTheDocument();

    // Result text should be visible
    expect(screen.getByText('You won the pot!')).toBeInTheDocument();
  });

  it('shows flavor text before betting', () => {
    useUiStore.setState({ campActionSub: 'gamble' });

    render(
      <CampActionPanel categoryId={CampActivityId.Socialize} onActivity={mockOnActivity} />,
    );

    expect(screen.getByText(/Passe-dix\. Three dice/)).toBeInTheDocument();
  });
});
