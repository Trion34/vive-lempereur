import { describe, it, expect, vi } from 'vitest';
import { pickWeightedRandom } from '../../core/camp';
import type { AnyRandomEventConfig } from '../../data/campaigns/types';

function makeEvent(id: string, weight: number): AnyRandomEventConfig {
  return {
    kind: 'imperative',
    id,
    weight,
    getEvent: vi.fn(),
    resolveChoice: vi.fn(),
  };
}

describe('pickWeightedRandom', () => {
  it('returns the only item in a single-element array', () => {
    const events = [makeEvent('a', 1)];
    expect(pickWeightedRandom(events).id).toBe('a');
  });

  it('respects weights — high-weight item picked more often', () => {
    const heavy = makeEvent('heavy', 100);
    const light = makeEvent('light', 1);
    const events = [heavy, light];

    const counts: Record<string, number> = { heavy: 0, light: 0 };
    for (let i = 0; i < 200; i++) {
      counts[pickWeightedRandom(events).id]++;
    }

    // With 100:1 weighting, heavy should dominate
    expect(counts.heavy).toBeGreaterThan(counts.light);
  });

  it('handles equal weights — both items should be picked', () => {
    const a = makeEvent('a', 1);
    const b = makeEvent('b', 1);
    const events = [a, b];

    const counts: Record<string, number> = { a: 0, b: 0 };
    for (let i = 0; i < 200; i++) {
      counts[pickWeightedRandom(events).id]++;
    }

    // With equal weights, both should be picked at least some of the time
    expect(counts.a).toBeGreaterThan(0);
    expect(counts.b).toBeGreaterThan(0);
  });

  it('falls back to uniform random when all weights are zero', () => {
    const a = makeEvent('a', 0);
    const b = makeEvent('b', 0);
    const events = [a, b];

    const counts: Record<string, number> = { a: 0, b: 0 };
    for (let i = 0; i < 200; i++) {
      counts[pickWeightedRandom(events).id]++;
    }

    // Both should be picked at least once with uniform fallback
    expect(counts.a).toBeGreaterThan(0);
    expect(counts.b).toBeGreaterThan(0);
  });

  it('always returns a valid event from the array', () => {
    const events = [makeEvent('a', 3), makeEvent('b', 7), makeEvent('c', 5)];
    const validIds = new Set(events.map((e) => e.id));

    for (let i = 0; i < 50; i++) {
      const result = pickWeightedRandom(events);
      expect(validIds.has(result.id)).toBe(true);
    }
  });
});
