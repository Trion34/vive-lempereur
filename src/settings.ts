// Settings system — persistent user preferences with overlay UI

import { setVolume, getVolume, isMuted, toggleMute } from './music';
import { $ } from './ui/dom';

export type Resolution = 'auto' | '1280x720' | '1440x900' | '1600x900' | '1920x1080';

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
  resolution: 'auto',
  screenShake: true,
  autoPlaySpeed: 'normal',
  autoPauseStoryBeats: true,
};

const STORAGE_KEY = 'the_little_soldier_settings';

const RESOLUTIONS: { value: Resolution; label: string; w?: number; h?: number }[] = [
  { value: 'auto', label: 'Fill Window' },
  { value: '1280x720', label: '1280 \u00d7 720', w: 1280, h: 720 },
  { value: '1440x900', label: '1440 \u00d7 900', w: 1440, h: 900 },
  { value: '1600x900', label: '1600 \u00d7 900', w: 1600, h: 900 },
  { value: '1920x1080', label: '1920 \u00d7 1080', w: 1920, h: 1080 },
];

let settings: Settings = { ...DEFAULTS };

// ---- Persistence ----

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate old fullscreen boolean to resolution
      if ('fullscreen' in parsed && !('resolution' in parsed)) {
        delete parsed.fullscreen;
      }
      return { ...DEFAULTS, ...parsed };
    }
  } catch { /* corrupt data — use defaults */ }
  return { ...DEFAULTS };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// ---- Public getters ----

export function getSettings(): Readonly<Settings> { return settings; }

export function getSfxVolume(): number { return settings.muted ? 0 : settings.sfxVolume; }

export function getScreenShakeEnabled(): boolean { return settings.screenShake; }

const SPEED_MULTIPLIERS: Record<Settings['autoPlaySpeed'], number> = {
  slow: 1.6,
  normal: 1.0,
  fast: 0.5,
};

export function getAutoPlaySpeedMultiplier(): number {
  return SPEED_MULTIPLIERS[settings.autoPlaySpeed];
}

export function getTextSizeClass(): string {
  if (settings.textSize === 'small') return 'text-size-small';
  if (settings.textSize === 'large') return 'text-size-large';
  return '';
}

/** Update muted state from external quick-mute toggle */
export function setMuted(muted: boolean) {
  settings.muted = muted;
  save();
}

// ---- Apply settings to the live app ----

export function applySettings() {
  // Music volume
  setVolume(settings.musicVolume);

  // Mute sync — align music module's mute state with settings
  if (settings.muted !== isMuted()) toggleMute();

  // Text size class on game root
  const game = document.getElementById('game');
  if (game) {
    game.classList.remove('text-size-small', 'text-size-large');
    const cls = getTextSizeClass();
    if (cls) game.classList.add(cls);
  }

  // Resolution
  applyResolution();
}

function applyResolution() {
  const game = document.getElementById('game');
  if (!game) return;

  const res = RESOLUTIONS.find(r => r.value === settings.resolution);

  if (!res || settings.resolution === 'auto') {
    // Fill window mode
    document.body.classList.remove('fixed-resolution');
    game.style.width = '';
    game.style.height = '';
  } else {
    // Fixed resolution mode
    document.body.classList.add('fixed-resolution');
    game.style.width = `${res.w}px`;
    game.style.height = `${res.h}px`;
  }
}

// ---- UI Rendering ----

function renderResolutionButtons(): string {
  const auto = RESOLUTIONS[0];
  const fixed = RESOLUTIONS.slice(1);
  return `
    <div class="settings-resolution-grid" id="set-resolution">
      <button class="settings-res-btn settings-res-auto ${settings.resolution === auto.value ? 'active' : ''}" data-val="${auto.value}">${auto.label}</button>
      <div class="settings-res-fixed">
        ${fixed.map(r => `<button class="settings-res-btn ${settings.resolution === r.value ? 'active' : ''}" data-val="${r.value}">${r.label}</button>`).join('')}
      </div>
    </div>
  `;
}

export function renderSettingsOverlay() {
  const overlay = $('settings-overlay');
  overlay.innerHTML = `
    <div class="settings-panel">
      <h2 class="settings-title">Settings</h2>
      <button class="settings-close" id="settings-close">&times;</button>

      <div class="settings-tabs">
        <button class="settings-tab active" data-tab="audio">Audio</button>
        <button class="settings-tab" data-tab="display">Display</button>
        <button class="settings-tab" data-tab="gameplay">Gameplay</button>
      </div>

      <!-- Audio -->
      <div class="settings-section active" id="settings-audio">
        <div class="settings-row">
          <span class="settings-label">Music Volume</span>
          <div class="settings-slider-wrap">
            <input type="range" class="settings-slider" id="set-music-vol" min="0" max="100" value="${Math.round(settings.musicVolume * 100)}">
            <span class="settings-slider-val" id="set-music-vol-val">${Math.round(settings.musicVolume * 100)}%</span>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label">SFX Volume</span>
          <div class="settings-slider-wrap">
            <input type="range" class="settings-slider" id="set-sfx-vol" min="0" max="100" value="${Math.round(settings.sfxVolume * 100)}">
            <span class="settings-slider-val" id="set-sfx-vol-val">${Math.round(settings.sfxVolume * 100)}%</span>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label">Master Mute</span>
          <button class="settings-toggle ${settings.muted ? '' : 'on'}" id="set-mute" title="Toggle mute"></button>
        </div>
      </div>

      <!-- Display -->
      <div class="settings-section" id="settings-display">
        <div class="settings-row settings-row-block">
          <span class="settings-label">Resolution</span>
          ${renderResolutionButtons()}
        </div>
        <div class="settings-row">
          <span class="settings-label">Text Size</span>
          <div class="settings-btn-group" id="set-text-size">
            <button data-val="small" class="${settings.textSize === 'small' ? 'active' : ''}">S</button>
            <button data-val="normal" class="${settings.textSize === 'normal' ? 'active' : ''}">N</button>
            <button data-val="large" class="${settings.textSize === 'large' ? 'active' : ''}">L</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label">Screen Shake</span>
          <button class="settings-toggle ${settings.screenShake ? 'on' : ''}" id="set-screenshake" title="Toggle screen shake"></button>
        </div>
      </div>

      <!-- Gameplay -->
      <div class="settings-section" id="settings-gameplay">
        <div class="settings-row">
          <span class="settings-label">Auto-play Speed</span>
          <div class="settings-btn-group" id="set-speed">
            <button data-val="slow" class="${settings.autoPlaySpeed === 'slow' ? 'active' : ''}">Slow</button>
            <button data-val="normal" class="${settings.autoPlaySpeed === 'normal' ? 'active' : ''}">Normal</button>
            <button data-val="fast" class="${settings.autoPlaySpeed === 'fast' ? 'active' : ''}">Fast</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label">Pause at Story</span>
          <button class="settings-toggle ${settings.autoPauseStoryBeats ? 'on' : ''}" id="set-pause-story" title="Toggle pause at story beats"></button>
        </div>
      </div>

      <button class="settings-reset" id="settings-reset">Reset Defaults</button>
    </div>
  `;
}

// ---- Toggle overlay ----

export function toggleSettings() {
  const overlay = $('settings-overlay');
  const isOpen = overlay.classList.contains('open');
  if (isOpen) {
    overlay.classList.remove('open');
  } else {
    renderSettingsOverlay();
    wireSettingsListeners();
    overlay.classList.add('open');
  }
}

// ---- Wire listeners inside the overlay ----

function wireSettingsListeners() {
  // Close
  document.getElementById('settings-close')?.addEventListener('click', () => toggleSettings());

  // Close on backdrop click
  $('settings-overlay').addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('settings-overlay')) toggleSettings();
  });

  // Tabs
  const tabs = document.querySelectorAll('.settings-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
      const target = (tab as HTMLElement).dataset.tab;
      document.getElementById(`settings-${target}`)?.classList.add('active');
    });
  });

  // Music volume
  const musicSlider = document.getElementById('set-music-vol') as HTMLInputElement;
  musicSlider?.addEventListener('input', () => {
    settings.musicVolume = parseInt(musicSlider.value) / 100;
    const valEl = document.getElementById('set-music-vol-val');
    if (valEl) valEl.textContent = `${musicSlider.value}%`;
    applySettings();
    save();
  });

  // SFX volume
  const sfxSlider = document.getElementById('set-sfx-vol') as HTMLInputElement;
  sfxSlider?.addEventListener('input', () => {
    settings.sfxVolume = parseInt(sfxSlider.value) / 100;
    const valEl = document.getElementById('set-sfx-vol-val');
    if (valEl) valEl.textContent = `${sfxSlider.value}%`;
    save();
  });

  // Mute toggle (note: toggle is "on" when NOT muted)
  document.getElementById('set-mute')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    settings.muted = btn.classList.contains('on'); // was on (not muted) → now muted
    btn.classList.toggle('on');
    applySettings();
    save();
  });

  // Resolution buttons
  document.querySelectorAll('#set-resolution .settings-res-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#set-resolution .settings-res-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.resolution = (btn as HTMLElement).dataset.val as Resolution;
      applySettings();
      save();
    });
  });

  // Text size button group
  document.querySelectorAll('#set-text-size button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#set-text-size button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.textSize = (btn as HTMLElement).dataset.val as Settings['textSize'];
      applySettings();
      save();
    });
  });

  // Screen shake
  document.getElementById('set-screenshake')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    btn.classList.toggle('on');
    settings.screenShake = btn.classList.contains('on');
    save();
  });

  // Auto-play speed
  document.querySelectorAll('#set-speed button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#set-speed button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      settings.autoPlaySpeed = (btn as HTMLElement).dataset.val as Settings['autoPlaySpeed'];
      save();
    });
  });

  // Pause at story beats
  document.getElementById('set-pause-story')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    btn.classList.toggle('on');
    settings.autoPauseStoryBeats = btn.classList.contains('on');
    save();
  });

  // Reset
  document.getElementById('settings-reset')?.addEventListener('click', () => {
    settings = { ...DEFAULTS };
    save();
    applySettings();
    renderSettingsOverlay();
    wireSettingsListeners();
  });
}

// ---- Init (call once at app start) ----

export function initSettings() {
  settings = load();
}
