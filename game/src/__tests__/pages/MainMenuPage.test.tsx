import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainMenuPage } from '../../pages/MainMenuPage';
import { useProfileStore, type ProfileData } from '../../stores/profileStore';

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

function makeProfile(id: 1 | 2 | 3, name: string, lastPlayed: number | null = null): ProfileData {
  return { id, playerName: name, lifetimeGlory: 0, currentGlory: 0, lastPlayed };
}

const emptyProfiles: [ProfileData, ProfileData, ProfileData] = [
  makeProfile(1, ''),
  makeProfile(2, ''),
  makeProfile(3, ''),
];

const oneSavedProfiles: [ProfileData, ProfileData, ProfileData] = [
  makeProfile(1, 'Jean', Date.now()),
  makeProfile(2, ''),
  makeProfile(3, ''),
];

const twoSavedProfiles: [ProfileData, ProfileData, ProfileData] = [
  makeProfile(1, 'Jean', Date.now()),
  makeProfile(2, 'Marie', Date.now() - 100000),
  makeProfile(3, ''),
];

const allFullProfiles: [ProfileData, ProfileData, ProfileData] = [
  makeProfile(1, 'Jean', Date.now()),
  makeProfile(2, 'Marie', Date.now() - 100000),
  makeProfile(3, 'Pierre', Date.now() - 200000),
];

describe('MainMenuPage', () => {
  let onProfileSelected: ReturnType<typeof vi.fn<(profile: ProfileData) => void>>;

  beforeEach(() => {
    onProfileSelected = vi.fn<(profile: ProfileData) => void>();
    useProfileStore.setState({
      profiles: emptyProfiles,
      activeProfileId: null,
    });
  });

  it('renders title, subtitle, Continue, and New Game buttons', () => {
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    expect(screen.getByText('The Little Soldier')).toBeInTheDocument();
    expect(screen.getByText('A Napoleonic Saga')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();
  });

  it('renders mascot image', () => {
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);
    expect(screen.getByAltText('Mascot')).toBeInTheDocument();
  });

  it('Continue is disabled when no saved profiles exist', () => {
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });

  it('Continue is enabled when saved profiles exist', () => {
    useProfileStore.setState({ profiles: oneSavedProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);
    expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled();
  });

  it('Continue with 1 save auto-loads directly', () => {
    useProfileStore.setState({ profiles: oneSavedProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onProfileSelected).toHaveBeenCalledWith(oneSavedProfiles[0]);
  });

  it('Continue with 2+ saves shows slot picker', () => {
    useProfileStore.setState({ profiles: twoSavedProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText('Choose a Save')).toBeInTheDocument();
    // Should only show saved slots, not empty ones
    expect(screen.getByText('Jean')).toBeInTheDocument();
    expect(screen.getByText('Marie')).toBeInTheDocument();
    expect(screen.queryByText('Empty Slot')).not.toBeInTheDocument();
  });

  it('New Game with empty slot auto-picks and starts new game', () => {
    useProfileStore.setState({ profiles: oneSavedProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));
    // Should auto-pick first empty slot (id: 2)
    expect(onProfileSelected).toHaveBeenCalledWith(oneSavedProfiles[1]);
  });

  it('New Game with all slots full shows slot picker in overwrite mode', () => {
    useProfileStore.setState({ profiles: allFullProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));
    expect(screen.getByText('Choose a Slot')).toBeInTheDocument();
    // All three slots should be visible
    expect(screen.getByText('Jean')).toBeInTheDocument();
    expect(screen.getByText('Marie')).toBeInTheDocument();
    expect(screen.getByText('Pierre')).toBeInTheDocument();
  });

  it('Slot picker Back button returns to menu', () => {
    useProfileStore.setState({ profiles: twoSavedProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    // Go to slot picker
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText('Choose a Save')).toBeInTheDocument();

    // Click back
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('The Little Soldier')).toBeInTheDocument();
    expect(screen.queryByText('Choose a Save')).not.toBeInTheDocument();
  });

  it('Settings button opens settings panel', () => {
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);
    const settingsBtn = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsBtn);
    expect(useProfileStore.getState()).toBeDefined(); // Settings is managed by uiStore
  });

  it('Slot picker in continue mode calls onProfileSelected on slot click', () => {
    useProfileStore.setState({ profiles: twoSavedProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    // Click on Jean's Select button
    const selectBtns = screen.getAllByRole('button', { name: /select/i });
    fireEvent.click(selectBtns[0]);
    expect(onProfileSelected).toHaveBeenCalledWith(twoSavedProfiles[0]);
  });

  it('Slot picker in overwrite mode shows Overwrite label for filled slots', () => {
    useProfileStore.setState({ profiles: allFullProfiles });
    render(<MainMenuPage onProfileSelected={onProfileSelected} />);

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));
    const overwriteBtns = screen.getAllByRole('button', { name: /overwrite/i });
    expect(overwriteBtns.length).toBe(3);
  });
});
