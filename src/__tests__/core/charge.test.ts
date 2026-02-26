import { describe, it, expect, vi } from 'vitest';
import { getChargeEncounter, resolveChargeChoice } from '../../core/charge';
import { mockBattleState } from '../helpers/mockFactories';
import type { StoryBeatConfig } from '../../data/battles/types';
import { ChargeChoiceId } from '../../types';

const mockStoryBeats: Record<number, StoryBeatConfig> = {
  1: {
    id: 1,
    getNarrative: vi.fn(() => 'Battery narrative'),
    getChoices: vi.fn(() => [
      { id: ChargeChoiceId.ChargeBattery, label: 'Charge!', description: 'Rush forward', available: true },
    ]),
    resolveChoice: vi.fn(() => ({
      log: [{ turn: 1, text: 'You charged', type: 'action' as const }],
      moraleChanges: [{ amount: 5, reason: 'Charged', source: 'action' as const }],
      healthDelta: -10,
      staminaDelta: -20,
    })),
  },
  2: {
    id: 2,
    getNarrative: vi.fn(() => 'Massena narrative'),
    getChoices: vi.fn(() => [
      { id: ChargeChoiceId.TendWounds, label: 'Rest', description: 'Take a break', available: true },
    ]),
    resolveChoice: vi.fn(() => ({
      log: [],
      moraleChanges: [],
      healthDelta: 0,
      staminaDelta: 0,
    })),
  },
};

describe('getChargeEncounter', () => {
  it('returns narrative and choices from the matching story beat config', () => {
    const state = mockBattleState({ chargeEncounter: 2 });
    const result = getChargeEncounter(state, mockStoryBeats);

    expect(result.narrative).toBe('Massena narrative');
    expect(result.choices).toEqual([
      { id: ChargeChoiceId.TendWounds, label: 'Rest', description: 'Take a break', available: true },
    ]);
  });

  it('falls back to beat id=1 (battery) when the chargeEncounter does not exist in the config', () => {
    const state = mockBattleState({ chargeEncounter: 999 });
    const result = getChargeEncounter(state, mockStoryBeats);

    expect(result.narrative).toBe('Battery narrative');
    expect(result.choices).toEqual([
      { id: ChargeChoiceId.ChargeBattery, label: 'Charge!', description: 'Rush forward', available: true },
    ]);
  });

  it('passes the battle state to getNarrative and getChoices', () => {
    const state = mockBattleState({ chargeEncounter: 1 });
    getChargeEncounter(state, mockStoryBeats);

    expect(mockStoryBeats[1].getNarrative).toHaveBeenCalledWith(state);
    expect(mockStoryBeats[1].getChoices).toHaveBeenCalledWith(state);
  });
});

describe('resolveChargeChoice', () => {
  it('delegates to the story beat resolveChoice and returns the result with nextEncounter=0', () => {
    const state = mockBattleState({ chargeEncounter: 1 });
    const result = resolveChargeChoice(state, ChargeChoiceId.ChargeBattery, mockStoryBeats);

    expect(result).toEqual({
      log: [{ turn: 1, text: 'You charged', type: 'action' }],
      moraleChanges: [{ amount: 5, reason: 'Charged', source: 'action' }],
      healthDelta: -10,
      staminaDelta: -20,
      nextEncounter: 0,
    });
  });

  it('returns empty result when chargeEncounter does not exist in config', () => {
    const state = mockBattleState({ chargeEncounter: 999 });
    const result = resolveChargeChoice(state, ChargeChoiceId.ChargeBattery, mockStoryBeats);

    expect(result).toEqual({
      log: [],
      moraleChanges: [],
      healthDelta: 0,
      staminaDelta: 0,
      nextEncounter: 0,
    });
  });

  it('passes state and choiceId to resolveChoice', () => {
    const state = mockBattleState({ chargeEncounter: 2 });
    resolveChargeChoice(state, ChargeChoiceId.TendWounds, mockStoryBeats);

    expect(mockStoryBeats[2].resolveChoice).toHaveBeenCalledWith(state, ChargeChoiceId.TendWounds);
  });
});
