import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- Global mocks for music.ts ---
vi.mock('../music', () => ({
  switchTrack: vi.fn(),
  ensureStarted: vi.fn(),
  setVolume: vi.fn(),
  setMuted: vi.fn(),
  getVolume: vi.fn(() => 0.3),
  getMuted: vi.fn(() => false),
}));

// --- Global mocks for audio.ts ---
vi.mock('../audio', () => ({
  playVolleySound: vi.fn(),
  playDistantVolleySound: vi.fn(),
  playHitSound: vi.fn(),
  playMissSound: vi.fn(),
  playBlockSound: vi.fn(),
  playMusketShotSound: vi.fn(),
  playRicochetSound: vi.fn(),
}));
