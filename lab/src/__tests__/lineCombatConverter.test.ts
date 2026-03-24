import { describe, it, expect } from 'vitest';
import { labVolleyToMechanics } from '../utils/lineCombatConverter';
import type { LabVolleyEntry } from '../types/lineCombatTypes';
import { createDefaultVolley } from '../stores/lineCombatStore';

/* ------------------------------------------------------------------ */
/*  Fixtures                                                           */
/* ------------------------------------------------------------------ */

function makeLabVolley(overrides?: Partial<LabVolleyEntry>): LabVolleyEntry {
  return { ...createDefaultVolley('test-v1'), ...overrides };
}

/* ------------------------------------------------------------------ */
/*  labVolleyToMechanics                                               */
/* ------------------------------------------------------------------ */

describe('labVolleyToMechanics', () => {
  it('maps def fields to top-level mechanics fields', () => {
    const lab = makeLabVolley({
      def: {
        range: 75,
        fireAccuracyBase: 0.45,
        perceptionBase: 0.30,
        enemyReturnFireChance: 0.25,
        enemyReturnFireDamage: [10, 18],
        enemyLineDamage: 12,
      },
    });
    const m = labVolleyToMechanics(lab);
    expect(m.range).toBe(75);
    expect(m.fireAccuracyBase).toBe(0.45);
    expect(m.perceptionBase).toBe(0.30);
    expect(m.enemyReturnFireChance).toBe(0.25);
    expect(m.enemyReturnFireDamage).toEqual([10, 18]);
    expect(m.enemyLineDamage).toBe(12);
  });

  it('maps narratives into nested narratives object', () => {
    const lab = makeLabVolley({
      narratives: {
        present: 'Steady, men.',
        fireOrder: '"Feu!"',
        endure: 'They fire back.',
        fireHit: ['Hit one!', 'Hit two!'],
        fireMiss: ['Wide.', 'Short.'],
      },
    });
    const m = labVolleyToMechanics(lab);
    expect(m.narratives.present).toBe('Steady, men.');
    expect(m.narratives.fireOrder).toBe('"Feu!"');
    expect(m.narratives.endure).toBe('They fire back.');
    expect(m.narratives.fireHit).toEqual(['Hit one!', 'Hit two!']);
    expect(m.narratives.fireMiss).toEqual(['Wide.', 'Short.']);
  });

  it('includes returnFire when frontRankBonus or fatalChance is non-zero', () => {
    const lab = makeLabVolley({
      returnFire: { frontRankBonus: 0.15, fatalChance: 0.05 },
    });
    const m = labVolleyToMechanics(lab);
    expect(m.returnFire).toEqual({ frontRankBonus: 0.15, fatalChance: 0.05 });
  });

  it('omits returnFire when both values are zero', () => {
    const lab = makeLabVolley({
      returnFire: { frontRankBonus: 0, fatalChance: 0 },
    });
    const m = labVolleyToMechanics(lab);
    expect(m.returnFire).toBeUndefined();
  });

  it('includes returnFire when only fatalChance is non-zero', () => {
    const lab = makeLabVolley({
      returnFire: { frontRankBonus: 0, fatalChance: 0.10 },
    });
    const m = labVolleyToMechanics(lab);
    expect(m.returnFire).toEqual({ frontRankBonus: 0, fatalChance: 0.10 });
  });

  it('maps stamina cost and recovery', () => {
    const lab = makeLabVolley({
      stamina: { cost: 20, recovery: 6 },
    });
    const m = labVolleyToMechanics(lab);
    expect(m.staminaCost).toBe(20);
    expect(m.staminaRecovery).toBe(6);
  });

  it('works with default volley (round-trip sanity)', () => {
    const lab = createDefaultVolley('default-test');
    const m = labVolleyToMechanics(lab);
    // Should produce a valid VolleyMechanics with no crashes
    expect(m.range).toBe(100);
    expect(m.narratives.present).toBe('Present arms.');
    expect(m.returnFire).toEqual({ frontRankBonus: 0.15, fatalChance: 0 });
    expect(m.staminaCost).toBe(12);
    expect(m.staminaRecovery).toBe(4);
  });
});
