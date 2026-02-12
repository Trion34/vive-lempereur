// Musket volley sound effects — pooled audio elements for reliable playback

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
  const sound = pool.find(a => a.paused) || pool[0];
  sound.currentTime = 0;
  sound.volume = volume;
  sound.play().catch(() => {});
}

/** Friendly volley — close, loud */
export function playVolleySound() {
  play('/assets/sfx/volley-distant.mp3', 0.85);
}

/** Enemy volley — distant, quieter */
export function playDistantVolleySound() {
  play('/assets/sfx/volley-distant.mp3', 0.5);
}

// Pre-create pools on import so audio data is loaded before first use
createPool('/assets/sfx/volley-distant.mp3');
