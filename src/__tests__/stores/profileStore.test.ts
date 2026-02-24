import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfileStore } from '../../stores/profileStore';

// Mock persistence module's setActiveProfile
vi.mock('../../core/persistence', () => ({
  setActiveProfile: vi.fn(),
}));

describe('profileStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store to default state
    useProfileStore.setState({
      profiles: [
        { id: 1, playerName: '', lifetimeGlory: 0, currentGlory: 0, lastPlayed: null },
        { id: 2, playerName: '', lifetimeGlory: 0, currentGlory: 0, lastPlayed: null },
        { id: 3, playerName: '', lifetimeGlory: 100, currentGlory: 100, lastPlayed: null },
      ],
      activeProfileId: null,
    });
  });

  describe('loadProfiles', () => {
    it('creates default profiles when no data exists', () => {
      useProfileStore.getState().loadProfiles();
      const { profiles } = useProfileStore.getState();

      expect(profiles).toHaveLength(3);
      expect(profiles[0].id).toBe(1);
      expect(profiles[0].lifetimeGlory).toBe(0);
      expect(profiles[1].id).toBe(2);
      expect(profiles[1].lifetimeGlory).toBe(0);
      expect(profiles[2].id).toBe(3);
      expect(profiles[2].lifetimeGlory).toBe(100);
    });

    it('loads existing profiles from localStorage', () => {
      const saved = [
        { id: 1, playerName: 'Jean', lifetimeGlory: 15, currentGlory: 10, lastPlayed: 1000 },
        { id: 2, playerName: '', lifetimeGlory: 0, currentGlory: 0, lastPlayed: null },
        { id: 3, playerName: 'Dev', lifetimeGlory: 100, currentGlory: 95, lastPlayed: 2000 },
      ];
      localStorage.setItem('the_little_soldier_profiles', JSON.stringify(saved));

      useProfileStore.getState().loadProfiles();
      const { profiles } = useProfileStore.getState();

      expect(profiles[0].playerName).toBe('Jean');
      expect(profiles[0].lifetimeGlory).toBe(15);
      expect(profiles[2].playerName).toBe('Dev');
    });

    it('migrates from old flat glory key into slot 1', () => {
      localStorage.setItem('the_little_soldier_glory', '25');

      useProfileStore.getState().loadProfiles();
      const { profiles } = useProfileStore.getState();

      expect(profiles[0].lifetimeGlory).toBe(25);
      expect(profiles[0].currentGlory).toBe(25);
      expect(profiles[1].lifetimeGlory).toBe(0);
      expect(profiles[2].lifetimeGlory).toBe(100);
    });

    it('migrates player name from old save data', () => {
      const oldSave = JSON.stringify({
        version: '0.3.0',
        gameState: { player: { name: 'Pierre' } },
        timestamp: Date.now(),
      });
      localStorage.setItem('the_little_soldier_save', oldSave);

      useProfileStore.getState().loadProfiles();
      const { profiles } = useProfileStore.getState();

      expect(profiles[0].playerName).toBe('Pierre');
    });
  });

  describe('selectProfile', () => {
    it('sets the active profile ID', () => {
      useProfileStore.getState().selectProfile(2);
      expect(useProfileStore.getState().activeProfileId).toBe(2);
    });
  });

  describe('deselectProfile', () => {
    it('clears the active profile ID', () => {
      useProfileStore.getState().selectProfile(1);
      useProfileStore.getState().deselectProfile();
      expect(useProfileStore.getState().activeProfileId).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('updates a specific profile field', () => {
      useProfileStore.getState().loadProfiles();
      useProfileStore.getState().updateProfile(1, { playerName: 'Jean-Baptiste' });

      const { profiles } = useProfileStore.getState();
      expect(profiles[0].playerName).toBe('Jean-Baptiste');
    });

    it('persists updates to localStorage', () => {
      useProfileStore.getState().loadProfiles();
      useProfileStore.getState().updateProfile(2, { lifetimeGlory: 42, currentGlory: 30 });

      const raw = localStorage.getItem('the_little_soldier_profiles');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed[1].lifetimeGlory).toBe(42);
      expect(parsed[1].currentGlory).toBe(30);
    });

    it('updates lastPlayed timestamp', () => {
      useProfileStore.getState().loadProfiles();
      const now = Date.now();
      useProfileStore.getState().updateProfile(1, { lastPlayed: now });

      expect(useProfileStore.getState().profiles[0].lastPlayed).toBe(now);
    });
  });

  describe('resetProfile', () => {
    it('resets a profile to defaults', () => {
      useProfileStore.getState().loadProfiles();
      useProfileStore.getState().updateProfile(1, {
        playerName: 'Jean',
        lifetimeGlory: 50,
        currentGlory: 30,
        lastPlayed: Date.now(),
      });

      useProfileStore.getState().resetProfile(1);
      const { profiles } = useProfileStore.getState();

      expect(profiles[0].playerName).toBe('');
      expect(profiles[0].lifetimeGlory).toBe(0);
      expect(profiles[0].currentGlory).toBe(0);
      expect(profiles[0].lastPlayed).toBeNull();
    });

    it('resets slot 3 to dev defaults (100 glory)', () => {
      useProfileStore.getState().loadProfiles();
      useProfileStore.getState().updateProfile(3, { lifetimeGlory: 200, playerName: 'Dev' });

      useProfileStore.getState().resetProfile(3);
      const { profiles } = useProfileStore.getState();

      expect(profiles[2].lifetimeGlory).toBe(100);
      expect(profiles[2].playerName).toBe('');
    });

    it('clears namespaced save and glory keys', () => {
      localStorage.setItem('the_little_soldier_save_p1', 'data');
      localStorage.setItem('the_little_soldier_glory_p1', '25');

      useProfileStore.getState().loadProfiles();
      useProfileStore.getState().resetProfile(1);

      expect(localStorage.getItem('the_little_soldier_save_p1')).toBeNull();
      expect(localStorage.getItem('the_little_soldier_glory_p1')).toBeNull();
    });
  });
});
