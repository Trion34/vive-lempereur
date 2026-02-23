// Background music system — phase-based track switching with crossfade

type TrackId = 'dreams' | 'battle';

const TRACKS: Record<TrackId, string> = {
  dreams: '/assets/music/dreams.mp3',
  battle: '/assets/music/battle.mp3',
};

const FADE_MS = 1500;
const FADE_STEP_MS = 50;

let currentTrack: TrackId | null = null;
let currentAudio: HTMLAudioElement | null = null;
let masterVolume = 0.3;
let muted = false;
let started = false;

// Pre-create audio elements for instant switching
const audioElements: Record<TrackId, HTMLAudioElement> = {
  dreams: createAudioElement('dreams'),
  battle: createAudioElement('battle'),
};

function createAudioElement(id: TrackId): HTMLAudioElement {
  const audio = new Audio(TRACKS[id]);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;
  return audio;
}

function effectiveVolume(): number {
  return muted ? 0 : masterVolume;
}

/** Crossfade to a new track, or do nothing if already playing it */
export function switchTrack(trackId: TrackId) {
  if (trackId === currentTrack && started) return;

  const newAudio = audioElements[trackId];
  const oldAudio = currentAudio;
  const oldTrack = currentTrack;

  currentTrack = trackId;
  currentAudio = newAudio;

  if (!started) {
    // Before user interaction — attempt play but don't mark started
    // (browser will likely block; ensureStarted() handles real unlock)
    newAudio.volume = effectiveVolume();
    newAudio.play().catch(() => {});
    return;
  }

  // Fade out old, fade in new
  newAudio.volume = 0;
  newAudio.currentTime = 0;
  newAudio.play().catch(() => {});

  const steps = FADE_MS / FADE_STEP_MS;
  let step = 0;

  const fadeInterval = setInterval(() => {
    step++;
    const progress = step / steps;

    // Fade in new
    newAudio.volume = Math.min(effectiveVolume(), progress * effectiveVolume());

    // Fade out old
    if (oldAudio && oldTrack !== trackId) {
      oldAudio.volume = Math.max(0, (1 - progress) * effectiveVolume());
    }

    if (step >= steps) {
      clearInterval(fadeInterval);
      newAudio.volume = effectiveVolume();
      if (oldAudio && oldTrack !== trackId) {
        oldAudio.pause();
        oldAudio.volume = 0;
      }
    }
  }, FADE_STEP_MS);
}

/** Toggle mute state. Returns new muted value. */
export function toggleMute(): boolean {
  muted = !muted;
  if (currentAudio) {
    currentAudio.volume = effectiveVolume();
  }
  return muted;
}

export function isMuted(): boolean {
  return muted;
}

/** Set master volume (0–1). */
export function setVolume(v: number) {
  masterVolume = Math.max(0, Math.min(1, v));
  if (currentAudio) {
    currentAudio.volume = effectiveVolume();
  }
}

export function getVolume(): number {
  return masterVolume;
}

/** Call on first user interaction to unlock audio elements in gesture context. */
export function ensureStarted() {
  if (started) return;
  started = true;
  // Unlock ALL audio elements during user gesture context
  for (const [id, audio] of Object.entries(audioElements) as [TrackId, HTMLAudioElement][]) {
    if (id === currentTrack) {
      audio.volume = effectiveVolume();
      audio.play().catch(() => {});
    } else {
      // Briefly play at zero volume to unlock, then pause
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {});
    }
  }
}
