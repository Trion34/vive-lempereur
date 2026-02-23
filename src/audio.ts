// Musket volley sound effects — pooled audio elements for reliable playback

import { getSfxVolume } from './settings';

const POOL_SIZE = 4;
const pools: Map<string, HTMLAudioElement[]> = new Map();

function createPool(src: string): HTMLAudioElement[] {
  const pool: HTMLAudioElement[] = [];
  for (let i = 0; i < POOL_SIZE; i++) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    pool.push(audio);
  }
  pools.set(src, pool);
  return pool;
}

function play(src: string, volume = 1.0) {
  let pool = pools.get(src);
  if (!pool) pool = createPool(src);

  // Find an element that isn't currently playing, or reuse the oldest
  const sound = pool.find((a) => a.paused) || pool[0];
  sound.currentTime = 0;
  sound.volume = volume * getSfxVolume();
  sound.play().catch(() => {
    /* autoplay blocked — expected */
  });
}

/** Friendly volley — close, loud */
export function playVolleySound() {
  play('/assets/sfx/volley-distant.mp3', 0.85);
}

/** Enemy volley — distant, quieter */
export function playDistantVolleySound() {
  play('/assets/sfx/volley-distant.mp3', 0.5);
}

// ---- UI click sound (Map Thump — synthesized via Web Audio API) ----

let clickCtx: AudioContext | null = null;

function playClickSound() {
  if (!clickCtx) clickCtx = new AudioContext();
  const ac = clickCtx;
  if (ac.state === 'suspended') ac.resume();

  const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
  }
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const gain = ac.createGain();
  src.buffer = buf;
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  gain.gain.value = 0.5 * getSfxVolume();
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start();
}

// Global button click sound — plays on any <button> click
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('button')) {
    playClickSound();
  }
});

// ---- Melee combat sounds ----

/** Melee hit — blade/bayonet connects */
export function playHitSound() {
  play('/assets/sfx/hit.mp3', 0.8);
}

/** Melee miss — swing through air */
export function playMissSound() {
  play('/assets/sfx/miss.mp3', 0.7);
}

/** Block — guard absorbs a hit */
export function playBlockSound() {
  play('/assets/sfx/block.mp3', 0.75);
}

/** Musket shot — Shoot action */
export function playMusketShotSound() {
  play('/assets/sfx/musket-shot.mp3', 0.85);
}

/** Musket shot miss — ricochet */
export function playRicochetSound() {
  play('/assets/sfx/ricochet.mp3', 0.75);
}

// Pre-create pools on import so audio data is loaded before first use
createPool('/assets/sfx/volley-distant.mp3');
createPool('/assets/sfx/hit.mp3');
createPool('/assets/sfx/miss.mp3');
createPool('/assets/sfx/block.mp3');
createPool('/assets/sfx/musket-shot.mp3');
createPool('/assets/sfx/ricochet.mp3');
