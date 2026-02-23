import { create } from 'zustand';
import { loadGlory, saveGlory, resetGlory as resetGloryPersistence } from '../core/persistence';

interface GloryStore {
  glory: number;
  glorySpent: Record<string, number>;

  // Actions
  loadFromStorage: () => void;
  addGlory: (amount: number) => void;
  spendGlory: (amount: number, category: string) => boolean;
  resetGlory: () => void;
}

const GLORY_DEFAULT = 10;

export const useGloryStore = create<GloryStore>((set, get) => ({
  glory: GLORY_DEFAULT,
  glorySpent: {},

  loadFromStorage: () => {
    set({ glory: loadGlory() });
  },

  addGlory: (amount) => {
    const next = get().glory + amount;
    set({ glory: next });
    saveGlory(next);
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

  resetGlory: () => {
    resetGloryPersistence();
    set({ glory: GLORY_DEFAULT, glorySpent: {} });
  },
}));
