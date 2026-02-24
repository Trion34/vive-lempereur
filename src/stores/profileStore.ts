import { create } from 'zustand';
import { setActiveProfile } from '../core/persistence';

const PROFILES_KEY = 'the_little_soldier_profiles';

export interface ProfileData {
  id: 1 | 2 | 3;
  playerName: string;
  lifetimeGlory: number;
  currentGlory: number;
  lastPlayed: number | null;
}

interface ProfileStore {
  profiles: [ProfileData, ProfileData, ProfileData];
  activeProfileId: 1 | 2 | 3 | null;

  loadProfiles: () => void;
  selectProfile: (id: 1 | 2 | 3) => void;
  deselectProfile: () => void;
  updateProfile: (id: 1 | 2 | 3, data: Partial<ProfileData>) => void;
  resetProfile: (id: 1 | 2 | 3) => void;
}

function defaultProfile(id: 1 | 2 | 3): ProfileData {
  return {
    id,
    playerName: '',
    lifetimeGlory: id === 3 ? 100 : 0,
    currentGlory: id === 3 ? 100 : 0,
    lastPlayed: null,
  };
}

function defaultProfiles(): [ProfileData, ProfileData, ProfileData] {
  return [defaultProfile(1), defaultProfile(2), defaultProfile(3)];
}

function persistProfiles(profiles: [ProfileData, ProfileData, ProfileData]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Failed to persist profiles:', error);
  }
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profiles: defaultProfiles(),
  activeProfileId: null,

  loadProfiles: () => {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ProfileData[];
        if (Array.isArray(parsed) && parsed.length === 3) {
          set({ profiles: parsed as [ProfileData, ProfileData, ProfileData] });
          return;
        }
      } catch {
        // Fall through to defaults
      }
    }

    // Migration: if old flat glory key exists but no profiles key, migrate into slot 1
    const oldGlory = localStorage.getItem('the_little_soldier_glory');
    const oldSave = localStorage.getItem('the_little_soldier_save');
    if (oldGlory !== null || oldSave !== null) {
      const profiles = defaultProfiles();
      if (oldGlory !== null) {
        const glory = Math.max(0, parseInt(oldGlory, 10) || 0);
        profiles[0].lifetimeGlory = glory;
        profiles[0].currentGlory = glory;
      }
      if (oldSave !== null) {
        // Try to extract player name from old save
        try {
          const saveData = JSON.parse(oldSave);
          if (saveData?.gameState?.player?.name) {
            profiles[0].playerName = saveData.gameState.player.name;
          }
        } catch {
          // ignore
        }
        profiles[0].lastPlayed = Date.now();
      }
      persistProfiles(profiles);
      set({ profiles });
      return;
    }

    // No existing data — use defaults
    const profiles = defaultProfiles();
    persistProfiles(profiles);
    set({ profiles });
  },

  selectProfile: (id) => {
    setActiveProfile(id);
    set({ activeProfileId: id });
  },

  deselectProfile: () => {
    setActiveProfile(null);
    set({ activeProfileId: null });
  },

  updateProfile: (id, data) => {
    const profiles = [...get().profiles] as [ProfileData, ProfileData, ProfileData];
    const idx = id - 1;
    profiles[idx] = { ...profiles[idx], ...data };
    persistProfiles(profiles);
    set({ profiles });
  },

  resetProfile: (id) => {
    const profiles = [...get().profiles] as [ProfileData, ProfileData, ProfileData];
    const idx = id - 1;
    profiles[idx] = defaultProfile(id);
    persistProfiles(profiles);
    set({ profiles });

    // Clear namespaced save and glory for this profile
    localStorage.removeItem(`the_little_soldier_save_p${id}`);
    localStorage.removeItem(`the_little_soldier_glory_p${id}`);
  },
}));
