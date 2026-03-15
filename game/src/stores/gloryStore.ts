import { create } from 'zustand';
import { saveGlory } from '../core/persistence';
import type { ProfileData } from './profileStore';

interface GloryStore {
  glory: number;
  lifetimeGlory: number;
  glorySpent: Record<string, number>;

  // Actions
  loadFromProfile: (profile: ProfileData) => void;
  addGlory: (amount: number) => void;
  spendGlory: (amount: number, category: string) => boolean;
  resetToLifetime: () => void;
}

export const useGloryStore = create<GloryStore>((set, get) => ({
  glory: 0,
  lifetimeGlory: 0,
  glorySpent: {},

  loadFromProfile: (profile) => {
    set({
      glory: profile.currentGlory,
      lifetimeGlory: profile.lifetimeGlory,
      glorySpent: {},
    });
    saveGlory(profile.currentGlory);
  },

  addGlory: (amount) => {
    const { glory, lifetimeGlory } = get();
    const nextGlory = glory + amount;
    const nextLifetime = lifetimeGlory + amount;
    set({ glory: nextGlory, lifetimeGlory: nextLifetime });
    saveGlory(nextGlory);
  },

  spendGlory: (amount, category) => {
    const { glory, glorySpent } = get();
    if (glory < amount) return false;
    const next = glory - amount;
    set({
      glory: next,
      glorySpent: { ...glorySpent, [category]: (glorySpent[category] || 0) + amount },
    });
    saveGlory(next);
    return true;
  },

  resetToLifetime: () => {
    const { lifetimeGlory } = get();
    set({ glory: lifetimeGlory, glorySpent: {} });
    saveGlory(lifetimeGlory);
  },
}));
