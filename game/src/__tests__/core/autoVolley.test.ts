import { describe, it, expect } from 'vitest';
import { resolveAutoVolley, resolveAutoGorgeVolley } from '../../core/volleys/autoVolley';
import { mockBattleState } from '../helpers/mockFactories';
import { ActionId, DrillStep } from '../../types';
import type { VolleyConfig, VolleyDef } from '../../data/battles/types';
import type { BattleState } from '../../types';

// ---------------------------------------------------------------------------
// Mock volley configs
// ---------------------------------------------------------------------------

const mockVolleyDef: VolleyDef = {
  range: 150,
  fireAccuracyBase: 0.3,
  perceptionBase: 0.3,
  enemyReturnFireChance: 0.0, // eliminates randomness in basic tests
  enemyReturnFireDamage: [0, 0],
  enemyLineDamage: 5,
};

const mockVolley: VolleyConfig = {
  def: mockVolleyDef,
  narratives: {
    fireOrder: 'Fire!',
    present: 'Present arms.',
    endure: 'Hold the line.',
    fireHit: ['Shot hits.'],
    fireMiss: ['Shot misses.'],
  },
  events: () => ({ log: [], moraleChanges: [] }),
};

/** A volley that guarantees lethal return fire. */
const lethalVolleyDef: VolleyDef = {
  range: 150,
  fireAccuracyBase: 0.3,
  perceptionBase: 0.3,
  enemyReturnFireChance: 1.0,
  enemyReturnFireDamage: [50, 50],
  enemyLineDamage: 5,
};

const lethalVolley: VolleyConfig = {
  def: lethalVolleyDef,
  narratives: {
    fireOrder: 'Fire!',
    present: 'Present arms.',
    endure: 'Hold the line.',
    fireHit: ['Shot hits.'],
    fireMiss: ['Shot misses.'],
  },
  events: () => ({ log: [], moraleChanges: [] }),
  returnFire: {
    frontRankBonus: 0,
    fatalChance: 0,
  },
};

const mockVolleys: VolleyConfig[] = [mockVolley];
const lethalVolleys: VolleyConfig[] = [lethalVolley];

// ---------------------------------------------------------------------------
// resolveAutoVolley
// ---------------------------------------------------------------------------

describe('resolveAutoVolley', () => {
  it('returns a result with volleyIdx matching the input', () => {
    const state = mockBattleState();
    const result = resolveAutoVolley(state, 0, mockVolleys);

    expect(result.volleyIdx).toBe(0);
  });

  it('produces narratives (non-empty narratives array)', () => {
    const state = mockBattleState();
    const result = resolveAutoVolley(state, 0, mockVolleys);

    expect(result.narratives.length).toBeGreaterThan(0);
  });

  it('includes a valorRoll in the result (not null)', () => {
    const state = mockBattleState();
    const result = resolveAutoVolley(state, 0, mockVolleys);

    expect(result.valorRoll).not.toBeNull();
    expect(result.valorRoll).toHaveProperty('outcome');
    expect(result.valorRoll).toHaveProperty('moraleChange');
    expect(result.valorRoll).toHaveProperty('narrative');
  });

  it('modifies player stamina (net drain of 8 for standard volley)', () => {
    const state = mockBattleState();
    const startStamina = state.player.stamina; // 200

    resolveAutoVolley(state, 0, mockVolleys);

    // Net drain: 12 cost - 4 recovery = 8
    expect(state.player.stamina).toBe(startStamina - 8);
  });

  it('player musket ends up loaded (even if fumble, auto-play resolves it)', () => {
    const state = mockBattleState();
    resolveAutoVolley(state, 0, mockVolleys);

    expect(state.player.musketLoaded).toBe(true);
  });

  it('pushes narratives to state.log', () => {
    const state = mockBattleState();
    const logLengthBefore = state.log.length;
    const result = resolveAutoVolley(state, 0, mockVolleys);

    expect(state.log.length).toBeGreaterThan(logLengthBefore);
    // The narratives returned should be the same ones pushed to the log
    expect(state.log.length).toBe(logLengthBefore + result.narratives.length);
  });

  it('sets playerDied=true and state.player.alive=false when player health reaches 0', () => {
    const state = mockBattleState({
      player: {
        ...mockBattleState().player,
        health: 1,
      },
    });
    const result = resolveAutoVolley(state, 0, lethalVolleys);

    expect(result.playerDied).toBe(true);
    expect(state.player.alive).toBe(false);
    expect(state.player.health).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// resolveAutoGorgeVolley
// ---------------------------------------------------------------------------

describe('resolveAutoGorgeVolley', () => {
  it('returns a result with valorRoll=null (gorge has no valor roll)', () => {
    const state = mockBattleState();
    const result = resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    expect(result.valorRoll).toBeNull();
  });

  it('returns lineIntegrityChange=0 (gorge has no line integrity roll)', () => {
    const state = mockBattleState();
    const result = resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    expect(result.lineIntegrityChange).toBe(0);
  });

  it('has lighter stamina cost than standard volley (9 total: 6 present + 3 gorge)', () => {
    const state = mockBattleState();
    const startStamina = state.player.stamina; // 200

    resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    // resolveGorgePresent drains 6, then the gorge volley itself drains 3 = 9 total
    // Still lighter than a standard volley's 8 net + fire steps
    expect(state.player.stamina).toBe(startStamina - 9);
  });

  it('player musket ends up loaded after gorge volley', () => {
    const state = mockBattleState();
    resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    expect(state.player.musketLoaded).toBe(true);
  });

  it('returns volleyIdx matching the input', () => {
    const state = mockBattleState();
    const result = resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    expect(result.volleyIdx).toBe(0);
  });

  it('produces narratives (non-empty narratives array)', () => {
    const state = mockBattleState();
    const result = resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    expect(result.narratives.length).toBeGreaterThan(0);
  });

  it('pushes narratives to state.log', () => {
    const state = mockBattleState();
    const logLengthBefore = state.log.length;
    const result = resolveAutoGorgeVolley(state, 0, ActionId.TargetColumn, mockVolleys);

    expect(state.log.length).toBeGreaterThan(logLengthBefore);
    expect(state.log.length).toBe(logLengthBefore + result.narratives.length);
  });
});
