import { describe, it, expect } from 'vitest';
import { ENCOUNTER_DEFS } from '../../data/encounters';
import type { BattleState } from '../../types';
import { BattlePhase, DrillStep, MoraleThreshold, HealthState, FatigueTier } from '../../types';

function mockBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const { ext: extOverrides, ...restOverrides } = overrides;
  return {
    phase: BattlePhase.StoryBeat,
    drillStep: DrillStep.Fire,
    player: {
      name: 'Pierre',
      valor: 40,
      musketry: 35,
      elan: 35,
      strength: 40,
      endurance: 40,
      constitution: 45,
      charisma: 30,
      intelligence: 30,
      awareness: 35,
      morale: 60,
      maxMorale: 100,
      moraleThreshold: MoraleThreshold.Wavering,
      health: 80,
      maxHealth: 125,
      healthState: HealthState.Unhurt,
      stamina: 200,
      maxStamina: 400,
      fatigue: 0,
      maxFatigue: 400,
      fatigueTier: FatigueTier.Fresh,
      musketLoaded: true,
      alive: true,
      routing: false,
      fumbledLoad: false,
      soldierRep: 50,
      officerRep: 50,
      napoleonRep: 0,
      frontRank: false,
      canteenUses: 3,
    },
    enemy: {
      range: 50,
      strength: 300,
      quality: 'line',
      morale: 'steady',
      lineIntegrity: 50,
      artillery: false,
      cavalryThreat: false,
    },
    line: {
      lineIntegrity: 70,
      regimentStrength: 400,
      regimentMorale: 'steady',
      formation: 'line',
      actionsTaken: 0,
      frontRankLosses: 0,
      leftNeighbour: { name: 'Pierre', alive: true, morale: 60, maxMorale: 100, relationship: 50 },
      rightNeighbour: { name: 'JB', alive: true, morale: 40, maxMorale: 100, relationship: 40 },
    },
    soldiers: [],
    officers: [],
    log: [],
    turn: 5,
    volleysFired: 3,
    battleOver: false,
    outcome: 'victory',
    ext: {
      battlePart: 1,
      batteryCharged: true,
      meleeStage: 0,
      wagonDamage: 0,
      gorgeMercyCount: 0,
      gorgeTarget: '',
      ...extOverrides,
    },
    ...restOverrides,
  } as BattleState;
}

describe('ENCOUNTER_DEFS', () => {
  it('has 6 encounter definitions', () => {
    expect(ENCOUNTER_DEFS).toHaveLength(6);
  });

  it('encounter ids are 1-6 without duplicates', () => {
    const ids = ENCOUNTER_DEFS.map((e) => e.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6]);
  });

  describe.each(ENCOUNTER_DEFS)('encounter $id', (def) => {
    it('produces non-empty narrative', () => {
      const state = mockBattleState({ chargeEncounter: def.id });
      const narrative = def.getNarrative(state);
      expect(narrative.length).toBeGreaterThan(50);
    });

    it('produces at least 1 choice with valid id', () => {
      const state = mockBattleState({ chargeEncounter: def.id });
      const choices = def.getChoices(state);
      expect(choices.length).toBeGreaterThanOrEqual(1);
      for (const choice of choices) {
        expect(choice.id).toBeTruthy();
        expect(choice.label).toBeTruthy();
        expect(choice.available).toBe(true);
      }
    });
  });

  describe('dynamic narratives', () => {
    it('Masséna (id=2) differs when Pierre alive vs dead', () => {
      const alive = mockBattleState({
        chargeEncounter: 2,
        line: {
          lineIntegrity: 70,
          regimentStrength: 400,
          regimentMorale: 'steady',
          formation: 'line',
          actionsTaken: 0,
          frontRankLosses: 0,
          leftNeighbour: { name: 'Pierre', alive: true, morale: 60, maxMorale: 100, relationship: 50 },
          rightNeighbour: { name: 'JB', alive: true, morale: 40, maxMorale: 100, relationship: 40 },
        } as unknown as BattleState['line'],
      });
      const dead = mockBattleState({
        chargeEncounter: 2,
        line: {
          lineIntegrity: 70,
          regimentStrength: 400,
          regimentMorale: 'steady',
          formation: 'line',
          actionsTaken: 0,
          frontRankLosses: 0,
          leftNeighbour: { name: 'Pierre', alive: false, morale: 0, maxMorale: 100, relationship: 50 },
          rightNeighbour: { name: 'JB', alive: true, morale: 40, maxMorale: 100, relationship: 40 },
        } as unknown as BattleState['line'],
      });

      const massena = ENCOUNTER_DEFS.find((e) => e.id === 2)!;
      const narrativeAlive = massena.getNarrative(alive);
      const narrativeDead = massena.getNarrative(dead);
      expect(narrativeAlive).not.toEqual(narrativeDead);
      expect(narrativeAlive).toContain('Still here');
      expect(narrativeDead).toContain('empty');
    });

    it('Aftermath (id=4) differs based on batteryCharged', () => {
      const aftermath = ENCOUNTER_DEFS.find((e) => e.id === 4)!;
      const charged = aftermath.getNarrative(mockBattleState({ ext: { batteryCharged: true } }));
      const held = aftermath.getNarrative(mockBattleState({ ext: { batteryCharged: false } }));
      expect(charged).toContain('Retook the battery');
      expect(held).toContain('Held the line');
    });
  });
});
