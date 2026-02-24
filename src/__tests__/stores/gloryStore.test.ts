import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGloryStore } from '../../stores/gloryStore';
import type { ProfileData } from '../../stores/profileStore';

vi.mock('../../core/persistence', () => ({
  saveGlory: vi.fn(),
}));

function makeProfile(overrides: Partial<ProfileData> = {}): ProfileData {
  return {
    id: 1,
    playerName: 'Test',
    lifetimeGlory: 20,
    currentGlory: 15,
    lastPlayed: null,
    ...overrides,
  };
}

describe('gloryStore', () => {
  beforeEach(() => {
    useGloryStore.setState({ glory: 0, lifetimeGlory: 0, glorySpent: {} });
  });

  describe('loadFromProfile', () => {
    it('loads glory and lifetime from profile data', () => {
      const profile = makeProfile({ lifetimeGlory: 30, currentGlory: 25 });
      useGloryStore.getState().loadFromProfile(profile);

      expect(useGloryStore.getState().glory).toBe(25);
      expect(useGloryStore.getState().lifetimeGlory).toBe(30);
    });

    it('clears glorySpent on load', () => {
      useGloryStore.setState({ glorySpent: { musketry: 5 } });
      useGloryStore.getState().loadFromProfile(makeProfile());

      expect(useGloryStore.getState().glorySpent).toEqual({});
    });
  });

  describe('addGlory', () => {
    it('increments both glory and lifetimeGlory', () => {
      useGloryStore.setState({ glory: 10, lifetimeGlory: 20 });
      useGloryStore.getState().addGlory(3);

      expect(useGloryStore.getState().glory).toBe(13);
      expect(useGloryStore.getState().lifetimeGlory).toBe(23);
    });
  });

  describe('spendGlory', () => {
    it('decrements glory but not lifetime', () => {
      useGloryStore.setState({ glory: 10, lifetimeGlory: 20 });
      const result = useGloryStore.getState().spendGlory(3, 'musketry');

      expect(result).toBe(true);
      expect(useGloryStore.getState().glory).toBe(7);
      expect(useGloryStore.getState().lifetimeGlory).toBe(20);
    });

    it('returns false when insufficient glory', () => {
      useGloryStore.setState({ glory: 2, lifetimeGlory: 20 });
      const result = useGloryStore.getState().spendGlory(5, 'musketry');

      expect(result).toBe(false);
      expect(useGloryStore.getState().glory).toBe(2);
    });

    it('tracks spending by category', () => {
      useGloryStore.setState({ glory: 10, lifetimeGlory: 20 });
      useGloryStore.getState().spendGlory(2, 'musketry');
      useGloryStore.getState().spendGlory(1, 'elan');
      useGloryStore.getState().spendGlory(1, 'musketry');

      expect(useGloryStore.getState().glorySpent).toEqual({ musketry: 3, elan: 1 });
    });
  });

  describe('resetToLifetime', () => {
    it('resets glory to lifetimeGlory and clears glorySpent', () => {
      useGloryStore.setState({ glory: 5, lifetimeGlory: 20, glorySpent: { musketry: 3 } });
      useGloryStore.getState().resetToLifetime();

      expect(useGloryStore.getState().glory).toBe(20);
      expect(useGloryStore.getState().glorySpent).toEqual({});
    });
  });
});
