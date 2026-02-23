import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RESOLUTIONS, DEFAULT_RESOLUTION, detectBestResolution, applyResolution } from '../../utils/resolution';

describe('resolution utility', () => {
  describe('RESOLUTIONS', () => {
    it('has 5 entries', () => {
      expect(RESOLUTIONS).toHaveLength(5);
    });

    it('does not include auto', () => {
      const values = RESOLUTIONS.map((r) => r.value);
      expect(values).not.toContain('auto');
    });

    it('includes 2560x1440', () => {
      const values = RESOLUTIONS.map((r) => r.value);
      expect(values).toContain('2560x1440');
    });

    it('is sorted ascending by width', () => {
      for (let i = 1; i < RESOLUTIONS.length; i++) {
        expect(RESOLUTIONS[i].w).toBeGreaterThan(RESOLUTIONS[i - 1].w);
      }
    });
  });

  describe('DEFAULT_RESOLUTION', () => {
    it('is 1920x1080', () => {
      expect(DEFAULT_RESOLUTION).toBe('1920x1080');
    });
  });

  describe('detectBestResolution', () => {
    function mockViewport(w: number, h: number) {
      Object.defineProperty(window, 'innerWidth', { value: w, writable: true, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: h, writable: true, configurable: true });
    }

    it('returns 1280x720 for a 1366x768 viewport', () => {
      mockViewport(1366, 768);
      expect(detectBestResolution()).toBe('1280x720');
    });

    it('returns exact match for 1920x1080 viewport', () => {
      mockViewport(1920, 1080);
      expect(detectBestResolution()).toBe('1920x1080');
    });

    it('returns 2560x1440 for a 2560x1440 viewport', () => {
      mockViewport(2560, 1440);
      expect(detectBestResolution()).toBe('2560x1440');
    });

    it('returns 2560x1440 for a 3840x2160 (4K) viewport', () => {
      mockViewport(3840, 2160);
      expect(detectBestResolution()).toBe('2560x1440');
    });

    it('returns DEFAULT_RESOLUTION for a very small viewport', () => {
      mockViewport(800, 600);
      expect(detectBestResolution()).toBe(DEFAULT_RESOLUTION);
    });

    it('accounts for DPI scaling (1920 physical at 110% = 1745 CSS px)', () => {
      mockViewport(1745, 982);
      expect(detectBestResolution()).toBe('1600x900');
    });
  });

  describe('applyResolution', () => {
    let gameEl: HTMLDivElement;

    beforeEach(() => {
      gameEl = document.createElement('div');
      gameEl.id = 'game';
      document.body.appendChild(gameEl);
      document.body.classList.remove('fixed-resolution');
    });

    afterEach(() => {
      gameEl.remove();
    });

    it('sets fixed-resolution class on body', () => {
      applyResolution('1920x1080');
      expect(document.body.classList.contains('fixed-resolution')).toBe(true);
    });

    it('sets correct width and height on #game', () => {
      applyResolution('1280x720');
      expect(gameEl.style.width).toBe('1280px');
      expect(gameEl.style.height).toBe('720px');
    });

    it('applies 2560x1440 correctly', () => {
      applyResolution('2560x1440');
      expect(gameEl.style.width).toBe('2560px');
      expect(gameEl.style.height).toBe('1440px');
    });

    it('does nothing if #game is missing', () => {
      gameEl.remove();
      // Should not throw
      expect(() => applyResolution('1920x1080')).not.toThrow();
    });
  });
});
