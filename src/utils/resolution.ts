import type { Resolution } from '../stores/settingsStore';

export const RESOLUTIONS: { value: Resolution; label: string; w: number; h: number }[] = [
  { value: '1280x720', label: '1280 \u00d7 720', w: 1280, h: 720 },
  { value: '1440x900', label: '1440 \u00d7 900', w: 1440, h: 900 },
  { value: '1600x900', label: '1600 \u00d7 900', w: 1600, h: 900 },
  { value: '1920x1080', label: '1920 \u00d7 1080', w: 1920, h: 1080 },
  { value: '2560x1440', label: '2560 \u00d7 1440', w: 2560, h: 1440 },
];

export const DEFAULT_RESOLUTION: Resolution = '1920x1080';

export function detectBestResolution(): Resolution {
  // Use CSS-pixel viewport (accounts for OS DPI scaling),
  // not screen.width/height which reports physical pixels
  const availW = window.innerWidth;
  const availH = window.innerHeight;

  // Walk descending, return largest that fits
  for (let i = RESOLUTIONS.length - 1; i >= 0; i--) {
    const r = RESOLUTIONS[i];
    if (r.w <= availW && r.h <= availH) {
      return r.value;
    }
  }

  return DEFAULT_RESOLUTION;
}

/** Base design resolution — camp and other UIs were authored at this size. */
const BASE_WIDTH = 1280;

export function applyResolution(resolution: Resolution): void {
  const game = document.getElementById('game');
  if (!game) return;

  const res = RESOLUTIONS.find((r) => r.value === resolution);
  if (!res) return;

  document.body.classList.add('fixed-resolution');
  game.style.width = `${res.w}px`;
  game.style.height = `${res.h}px`;

  // Scale factor used by phase CSS (e.g. camp zoom) to keep proportions
  const scale = res.w / BASE_WIDTH;
  game.style.setProperty('--game-scale', scale.toFixed(4));

  // Shrink to fit if the game box is larger than the browser viewport
  fitToViewport(game, res.w, res.h);
}

/**
 * If the game box exceeds the viewport (e.g. browser chrome on a 1080p
 * monitor), scale it down with CSS zoom so it fits without clipping.
 */
function fitToViewport(game: HTMLElement, w: number, h: number): void {
  const fitScale = Math.min(1, window.innerWidth / w, window.innerHeight / h);
  game.style.zoom = fitScale < 1 ? String(fitScale) : '';
}
