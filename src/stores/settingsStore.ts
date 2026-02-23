import { create } from 'zustand';
import { detectBestResolution } from '../utils/resolution';

export type Resolution = '1280x720' | '1440x900' | '1600x900' | '1920x1080' | '2560x1440';

export interface Settings {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  textSize: 'small' | 'normal' | 'large';
  resolution: Resolution;
  screenShake: boolean;
  autoPlaySpeed: 'slow' | 'normal' | 'fast';
  autoPauseStoryBeats: boolean;
}

const DEFAULTS: Settings = {
  musicVolume: 0.3,
  sfxVolume: 0.8,
  muted: false,
  textSize: 'normal',
  resolution: '1920x1080',
  screenShake: true,
  autoPlaySpeed: 'normal',
  autoPauseStoryBeats: true,
};

const STORAGE_KEY = 'the_little_soldier_settings';

interface SettingsStore extends Settings {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  loadSettings: () => void;
  saveSettings: () => void;
  resetDefaults: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULTS,

  updateSetting: (key, value) => {
    set({ [key]: value } as Partial<Settings>);
    // Auto-persist
    const state = get();
    const toSave: Settings = {
      musicVolume: state.musicVolume,
      sfxVolume: state.sfxVolume,
      muted: state.muted,
      textSize: state.textSize,
      resolution: state.resolution,
      screenShake: state.screenShake,
      autoPlaySpeed: state.autoPlaySpeed,
      autoPauseStoryBeats: state.autoPauseStoryBeats,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  },

  loadSettings: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Migrate old fullscreen boolean
        if ('fullscreen' in parsed && !('resolution' in parsed)) {
          delete parsed.fullscreen;
        }
        // Migrate 'auto' → detected best resolution
        if (parsed.resolution === 'auto') {
          parsed.resolution = detectBestResolution();
        }
        set({ ...DEFAULTS, ...parsed });
      } else {
        // No saved settings — detect best resolution for this screen
        set({ ...DEFAULTS, resolution: detectBestResolution() });
      }
    } catch {
      set({ ...DEFAULTS });
    }
  },

  saveSettings: () => {
    const state = get();
    const toSave: Settings = {
      musicVolume: state.musicVolume,
      sfxVolume: state.sfxVolume,
      muted: state.muted,
      textSize: state.textSize,
      resolution: state.resolution,
      screenShake: state.screenShake,
      autoPlaySpeed: state.autoPlaySpeed,
      autoPauseStoryBeats: state.autoPauseStoryBeats,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  },

  resetDefaults: () => {
    const defaults = { ...DEFAULTS, resolution: detectBestResolution() };
    set(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  },
}));
