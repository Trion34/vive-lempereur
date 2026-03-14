import { describe, it, expect } from 'vitest';
import { ActionId, DrillStep, MoraleThreshold } from '../../types';
import { resolveMeleeRout } from '../../core/battle';
import { mockBattleState } from '../helpers/mockFactories';

describe('resolveMeleeRout', () => {
  it('returns a new state (does not mutate input)', () => {
    const input = mockBattleState();
    const result = resolveMeleeRout(input);
    expect(result).not.toBe(input);
    expect(input.battleOver).toBe(false);
  });

  it('sets battleOver to true', () => {
    const state = mockBattleState();
    const result = resolveMeleeRout(state);
    expect(result.battleOver).toBe(true);
  });

  it('sets outcome to rout', () => {
    const state = mockBattleState();
    const result = resolveMeleeRout(state);
    expect(result.outcome).toBe('rout');
  });

  it('clears available actions', () => {
    const state = mockBattleState({
      availableActions: [{
        id: ActionId.Fire, name: 'Fire', description: 'Fire your musket',
        minThreshold: MoraleThreshold.Breaking, available: true,
        drillStep: DrillStep.Fire,
      }],
    });
    const result = resolveMeleeRout(state);
    expect(result.availableActions).toEqual([]);
  });

  it('appends rout narrative to the log', () => {
    const state = mockBattleState({ log: [] });
    const result = resolveMeleeRout(state);
    expect(result.log).toHaveLength(1);
    expect(result.log[0].type).toBe('narrative');
    expect(result.log[0].text).toContain('shame');
  });

  it('preserves the turn number in the log entry', () => {
    const state = mockBattleState({ turn: 7 });
    const result = resolveMeleeRout(state);
    expect(result.log[result.log.length - 1].turn).toBe(7);
  });

  it('does not modify player health or morale', () => {
    const state = mockBattleState();
    const originalHealth = state.player.health;
    const originalMorale = state.player.morale;
    const result = resolveMeleeRout(state);
    expect(result.player.health).toBe(originalHealth);
    expect(result.player.morale).toBe(originalMorale);
  });
});
