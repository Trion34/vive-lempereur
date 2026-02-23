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
  const screenW = window.screen.width;
  const screenH = window.screen.height;

  // Walk descending, return largest that fits
  for (let i = RESOLUTIONS.length - 1; i >= 0; i--) {
    const r = RESOLUTIONS[i];
    if (r.w <= screenW && r.h <= screenH) {
      return r.value;
    }
  }

  return DEFAULT_RESOLUTION;
}

export function applyResolution(resolution: Resolution): void {
  const game = document.getElementById('game');
  if (!game) return;

  const res = RESOLUTIONS.find((r) => r.value === resolution);
  if (!res) return;

  document.body.classList.add('fixed-resolution');
  game.style.width = `${res.w}px`;
  game.style.height = `${res.h}px`;
}
