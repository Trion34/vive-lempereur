import { describe, it, expect } from 'vitest';
import { getVolleyNarrative } from '../../core/volleys/narrative';
import type { BattleState } from '../../types';
import { DrillStep, MoraleThreshold } from '../../types';
import { mockBattleState } from '../helpers/mockFactories';
import type { VolleyConfig } from '../../data/battles/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal VolleyConfig array for deterministic tests (no dependency on Rivoli data). */
function makeTestVolleys(): VolleyConfig[] {
  return [
    {
      def: {
        range: 120,
        fireAccuracyBase: 0.2,
        perceptionBase: 0.15,
        enemyReturnFireChance: 0.15,
        enemyReturnFireDamage: [8, 14],
        enemyLineDamage: 6,
      },
      narratives: {
        fireOrder: 'Fire volley one!',
        present: 'Present arms at 120 paces.',
        endure: 'Return fire incoming.',
        fireHit: ['Hit.'],
        fireMiss: ['Miss.'],
      },
      events: () => ({ log: [], moraleChanges: [] }),
    },
    {
      def: {
        range: 80,
        fireAccuracyBase: 0.35,
        perceptionBase: 0.3,
        enemyReturnFireChance: 0.25,
        enemyReturnFireDamage: [10, 18],
        enemyLineDamage: 10,
      },
      narratives: {
        fireOrder: 'Fire volley two!',
        present: 'Present arms at 80 paces.',
        endure: 'Brace for return fire.',
        fireHit: ['Hit.'],
        fireMiss: ['Miss.'],
      },
      events: () => ({ log: [], moraleChanges: [] }),
    },
  ];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getVolleyNarrative', () => {
  const volleys = makeTestVolleys();

  // --- Fire step ---

  describe('Fire step', () => {
    it('returns the fireOrder narrative for volley index 0', () => {
      const state = mockBattleState({ player: { moraleThreshold: MoraleThreshold.Steady } as BattleState['player'] });
      const result = getVolleyNarrative(0, DrillStep.Fire, state, volleys);
      expect(result).toBe('Fire volley one!');
    });

    it('returns the fireOrder narrative for volley index 1', () => {
      const state = mockBattleState();
      const result = getVolleyNarrative(1, DrillStep.Fire, state, volleys);
      expect(result).toBe('Fire volley two!');
    });
  });

  // --- Present step ---

  describe('Present step', () => {
    it('returns base present narrative when morale is Steady', () => {
      const state = mockBattleState({
        player: { moraleThreshold: MoraleThreshold.Steady } as BattleState['player'],
      });
      const result = getVolleyNarrative(0, DrillStep.Present, state, volleys);
      expect(result).toBe('Present arms at 120 paces.');
    });

    it('does not append a morale suffix when morale is Steady', () => {
      const state = mockBattleState({
        player: { moraleThreshold: MoraleThreshold.Steady } as BattleState['player'],
      });
      const result = getVolleyNarrative(0, DrillStep.Present, state, volleys);
      expect(result).not.toContain('Hands unsteady');
      expect(result).not.toContain('Want to run');
      expect(result).not.toContain("Can't stop shaking");
    });
  });

  // --- Endure step ---

  describe('Endure step', () => {
    it('returns the endure narrative', () => {
      const state = mockBattleState();
      const result = getVolleyNarrative(0, DrillStep.Endure, state, volleys);
      expect(result).toBe('Return fire incoming.');
    });

    it('returns different endure text for a different volley index', () => {
      const state = mockBattleState();
      const result = getVolleyNarrative(1, DrillStep.Endure, state, volleys);
      expect(result).toBe('Brace for return fire.');
    });
  });

  // --- Morale suffixes on Present ---

  describe('morale suffix on Present step', () => {
    it('appends "Hands unsteady." when morale is Shaken', () => {
      const state = mockBattleState({
        player: { moraleThreshold: MoraleThreshold.Shaken } as BattleState['player'],
      });
      const result = getVolleyNarrative(0, DrillStep.Present, state, volleys);
      expect(result).toBe('Present arms at 120 paces. Hands unsteady.');
    });

    it('appends "Want to run." when morale is Wavering', () => {
      const state = mockBattleState({
        player: { moraleThreshold: MoraleThreshold.Wavering } as BattleState['player'],
      });
      const result = getVolleyNarrative(1, DrillStep.Present, state, volleys);
      expect(result).toBe('Present arms at 80 paces. Want to run.');
    });

    it('appends "Can\'t stop shaking." when morale is Breaking', () => {
      const state = mockBattleState({
        player: { moraleThreshold: MoraleThreshold.Breaking } as BattleState['player'],
      });
      const result = getVolleyNarrative(0, DrillStep.Present, state, volleys);
      expect(result).toBe("Present arms at 120 paces. Can't stop shaking.");
    });
  });

  // --- Invalid / out-of-range volley index ---

  describe('invalid volley index', () => {
    it('returns empty string for an index beyond the array length', () => {
      const state = mockBattleState();
      const result = getVolleyNarrative(99, DrillStep.Fire, state, volleys);
      expect(result).toBe('');
    });

    it('returns empty string for a negative index', () => {
      const state = mockBattleState();
      const result = getVolleyNarrative(-1, DrillStep.Present, state, volleys);
      expect(result).toBe('');
    });
  });

  // --- Different volley indices produce different narratives ---

  describe('different volley indices produce different narratives', () => {
    it('Fire step text differs between volley 0 and volley 1', () => {
      const state = mockBattleState();
      const fire0 = getVolleyNarrative(0, DrillStep.Fire, state, volleys);
      const fire1 = getVolleyNarrative(1, DrillStep.Fire, state, volleys);
      expect(fire0).not.toBe(fire1);
    });

    it('Present step text differs between volley 0 and volley 1', () => {
      const state = mockBattleState({
        player: { moraleThreshold: MoraleThreshold.Steady } as BattleState['player'],
      });
      const present0 = getVolleyNarrative(0, DrillStep.Present, state, volleys);
      const present1 = getVolleyNarrative(1, DrillStep.Present, state, volleys);
      expect(present0).not.toBe(present1);
    });
  });

  // --- Unhandled step returns empty string ---

  describe('unhandled drill step', () => {
    it('returns empty string for Load step (not handled by narrative)', () => {
      const state = mockBattleState();
      const result = getVolleyNarrative(0, DrillStep.Load, state, volleys);
      expect(result).toBe('');
    });
  });
});
