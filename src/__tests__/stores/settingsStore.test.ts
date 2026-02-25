import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore } from '../../stores/settingsStore';
import * as resolution from '../../utils/resolution';

const STORAGE_KEY = 'the_little_soldier_settings';

describe('settingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset store to defaults
    useSettingsStore.setState({
      musicVolume: 0.3,
      sfxVolume: 0.8,
      muted: false,
      textSize: 'normal',
      resolution: '1920x1080',
      screenShake: true,
      autoPlaySpeed: 'normal',
      autoPauseStoryBeats: true,
    });
  });

  describe('defaults', () => {
    it('has 1920x1080 as default resolution', () => {
      expect(useSettingsStore.getState().resolution).toBe('1920x1080');
    });
  });

  describe('loadSettings', () => {
    it('preserves valid saved resolution', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ resolution: '1280x720' }),
      );
      useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().resolution).toBe('1280x720');
    });

    it('preserves 2560x1440 resolution', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ resolution: '2560x1440' }),
      );
      useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().resolution).toBe('2560x1440');
    });

    it('migrates auto to detectBestResolution result', () => {
      const spy = vi.spyOn(resolution, 'detectBestResolution').mockReturnValue('1600x900');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ resolution: 'auto' }),
      );
      useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().resolution).toBe('1600x900');
      spy.mockRestore();
    });

    it('uses 1920x1080 default when localStorage is empty', () => {
      useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().resolution).toBe('1920x1080');
    });

    it('uses defaults when localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().resolution).toBe('1920x1080');
    });
  });

  describe('resetDefaults', () => {
    it('uses detectBestResolution for reset resolution', () => {
      const spy = vi.spyOn(resolution, 'detectBestResolution').mockReturnValue('1440x900');
      useSettingsStore.getState().updateSetting('resolution', '2560x1440');
      useSettingsStore.getState().resetDefaults();
      expect(useSettingsStore.getState().resolution).toBe('1440x900');
      spy.mockRestore();
    });
  });

  describe('updateSetting', () => {
    it('persists resolution changes to localStorage', () => {
      useSettingsStore.getState().updateSetting('resolution', '1600x900');
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(saved.resolution).toBe('1600x900');
    });
  });
});
