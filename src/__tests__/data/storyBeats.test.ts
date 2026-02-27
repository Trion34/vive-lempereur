import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BattlePhase, ChargeChoiceId, ChargeEncounterId, DrillStep } from '../../types/enums';
import type { BattleState, MeleeState } from '../../types';
import { mockBattleState, DEFAULT_EXT } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Mock melee module — createMeleeState & resetMeleeHistory are called by
// Battery (beat 1) and MeleeTransition (beat 6)
// ---------------------------------------------------------------------------
vi.mock('../../core/melee', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    createMeleeState: vi.fn((): MeleeState => ({
      opponents: [
        {
          id: 0,
          name: 'Austrian Soldier',
          tier: 'line',
          description: 'A whitecoat charges.',
          health: 80,
          maxHealth: 80,
          stamina: 100,
          maxStamina: 100,
          morale: 60,
          maxMorale: 100,
          stance: 'balanced',
          stunned: 0,
          alive: true,
          strength: 40,
          baseHitChance: 0.45,
          baseDamage: [8, 16],
        },
      ],
      currentOpponent: 0,
      playerStance: 'balanced',
      playerRiposte: false,
      playerStunned: 0,
      exchangeCount: 0,
      selectingStance: false,
      selectingTarget: false,
      killCount: 0,
      valorTempBonus: 0,
      maxExchanges: 12,
      allies: [],
      activeEnemies: [0],
      enemyPool: [],
      maxActiveEnemies: 1,
      reinforcementInterval: 3,
    } as unknown as MeleeState)),
    resetMeleeHistory: vi.fn(),
  };
});

// Mock stats module — rollStat is called by FollowTheScreams (beat 2)
vi.mock('../../core/stats', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollStat: vi.fn(() => ({ success: true, roll: 30, target: 50, margin: 20 })),
    rollD100: vi.fn(() => 50),
  };
});

// Mock morale module — rollValor is called by WoundedSergeant (beat 5)
vi.mock('../../core/morale', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollValor: vi.fn(() => ({ success: true, roll: 20, target: 40 })),
  };
});

import { rollStat } from '../../core/stats';
import { rollValor } from '../../core/morale';
import { createMeleeState, resetMeleeHistory } from '../../core/melee';
import { RIVOLI_STORY_BEATS } from '../../data/battles/rivoli/storyBeats';

const mockedRollStat = vi.mocked(rollStat);
const mockedRollValor = vi.mocked(rollValor);
const mockedCreateMeleeState = vi.mocked(createMeleeState);
const mockedResetMeleeHistory = vi.mocked(resetMeleeHistory);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a BattleState with both neighbours alive. */
function aliveState(overrides: Partial<BattleState> = {}): BattleState {
  return mockBattleState({
    phase: BattlePhase.StoryBeat,
    ...overrides,
  });
}

/** Create a BattleState with Pierre (left neighbour) dead. */
function pierreDeadState(overrides: Partial<BattleState> = {}): BattleState {
  const base = aliveState(overrides);
  if (base.line.leftNeighbour) base.line.leftNeighbour.alive = false;
  return base;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RIVOLI_STORY_BEATS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: stat checks succeed
    mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
    mockedRollValor.mockReturnValue({ success: true, roll: 20, target: 40 });
  });

  it('has 6 story beat definitions keyed 1-6', () => {
    const keys = Object.keys(RIVOLI_STORY_BEATS).map(Number).sort((a, b) => a - b);
    expect(keys).toEqual([1, 2, 3, 4, 5, 6]);
  });

  // ================================================================
  // Beat 1 — Battery
  // ================================================================
  describe('Beat 1 — Battery', () => {
    const beat = RIVOLI_STORY_BEATS[1];

    it('ChargeBattery sets phase to Melee and batteryCharged to true', () => {
      const state = aliveState({ ext: { ...DEFAULT_EXT, battlePart: 1 } });
      const result = beat.resolveChoice(state, ChargeChoiceId.ChargeBattery);

      expect(state.phase).toBe(BattlePhase.Melee);
      expect(state.ext.batteryCharged).toBe(true);
      expect(state.ext.meleeStage).toBe(2);
      expect(state.chargeEncounter).toBe(0);
      expect(state.enemy.range).toBe(0);
      expect(mockedResetMeleeHistory).toHaveBeenCalled();
      expect(mockedCreateMeleeState).toHaveBeenCalled();
      expect(result.log.length).toBeGreaterThan(0);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
    });

    it('HoldBack sets batteryCharged to false and transitions to StoryBeat (Massena)', () => {
      const state = aliveState({ ext: { ...DEFAULT_EXT, battlePart: 1 } });
      const result = beat.resolveChoice(state, ChargeChoiceId.HoldBack);

      expect(state.ext.batteryCharged).toBe(false);
      expect(state.phase).toBe(BattlePhase.StoryBeat);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.Massena);
      expect(state.player.soldierRep).toBe(45); // 50 - 5
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -3 })]),
      );
    });
  });

  // ================================================================
  // Beat 2 — Masséna
  // ================================================================
  describe('Beat 2 — Masséna', () => {
    const beat = RIVOLI_STORY_BEATS[2];

    it('TendWounds grants health and stamina deltas', () => {
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.TendWounds);

      expect(result.healthDelta).toBe(15);
      expect(result.staminaDelta).toBe(30);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      // Transition fields
      expect(state.ext.battlePart).toBe(2);
      expect(state.phase).toBe(BattlePhase.Line);
      expect(state.drillStep).toBe(DrillStep.Present);
      expect(state.scriptedVolley).toBe(5);
    });

    it('CheckComrades boosts soldierRep and Pierre morale when alive', () => {
      const state = aliveState();
      const pierreMoraleBefore = state.line.leftNeighbour!.morale;
      const result = beat.resolveChoice(state, ChargeChoiceId.CheckComrades);

      expect(state.player.soldierRep).toBe(53); // 50 + 3
      expect(state.line.leftNeighbour!.morale).toBe(pierreMoraleBefore + 10);
      expect(result.staminaDelta).toBe(15);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 8 })]),
      );
      // Transition to Part 2
      expect(state.ext.battlePart).toBe(2);
      expect(state.phase).toBe(BattlePhase.Line);
    });

    it('FollowTheScreams success boosts soldierRep and morale', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 20, target: 50, margin: 30 });
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.FollowTheScreams);

      expect(state.player.soldierRep).toBe(53); // 50 + 3
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
      expect(state.phase).toBe(BattlePhase.Line);
    });

    it('FollowTheScreams failure gives negative morale change', () => {
      mockedRollStat.mockReturnValue({ success: false, roll: 80, target: 50, margin: -30 });
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.FollowTheScreams);

      // soldierRep unchanged on failure
      expect(state.player.soldierRep).toBe(50);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
      // Still transitions to Part 2
      expect(state.ext.battlePart).toBe(2);
    });
  });

  // ================================================================
  // Beat 3 — Gorge
  // ================================================================
  describe('Beat 3 — Gorge', () => {
    const beat = RIVOLI_STORY_BEATS[3];

    it('AcceptOrder transitions to Part 3 line phase at the gorge', () => {
      const state = aliveState({ ext: { ...DEFAULT_EXT, battlePart: 2 } });
      const result = beat.resolveChoice(state, ChargeChoiceId.AcceptOrder);

      expect(state.ext.battlePart).toBe(3);
      expect(state.scriptedVolley).toBe(8);
      expect(state.phase).toBe(BattlePhase.Line);
      expect(state.drillStep).toBe(DrillStep.Present);
      expect(state.ext.wagonDamage).toBe(0);
      expect(state.ext.gorgeMercyCount).toBe(0);
      expect(state.enemy.range).toBe(200);
      expect(state.enemy.quality).toBe('column');
      expect(state.enemy.morale).toBe('trapped');
      expect(state.enemy.artillery).toBe(false);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
    });
  });

  // ================================================================
  // Beat 4 — Aftermath
  // ================================================================
  describe('Beat 4 — Aftermath', () => {
    const beat = RIVOLI_STORY_BEATS[4];

    it('HelpWounded drains stamina, boosts morale and soldierRep, sets battleOver', () => {
      const state = aliveState({ ext: { ...DEFAULT_EXT, gorgeMercyCount: 0 } });
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpWounded);

      expect(result.staminaDelta).toBe(-30);
      expect(result.healthDelta).toBe(0);
      expect(state.player.soldierRep).toBe(55); // 50 + 5
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 8 })]),
      );
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('gorge_victory');
    });

    it('FindComrades boosts neighbour relationships when both alive', () => {
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.FindComrades);

      expect(state.line.leftNeighbour!.relationship).toBe(60); // 50 + 10
      expect(state.line.rightNeighbour!.relationship).toBe(50); // 40 + 10
      expect(result.staminaDelta).toBe(30);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
      expect(state.battleOver).toBe(true);
    });

    it('SitDown grants health and stamina recovery', () => {
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.SitDown);

      expect(result.healthDelta).toBe(10);
      expect(result.staminaDelta).toBe(45);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('gorge_victory');
    });
  });

  // ================================================================
  // Beat 5 — Wounded Sergeant
  // ================================================================
  describe('Beat 5 — Wounded Sergeant', () => {
    const beat = RIVOLI_STORY_BEATS[5];

    it('always sets ncoPresent to false', () => {
      const state = aliveState();
      expect(state.line.ncoPresent).toBe(true);
      beat.resolveChoice(state, ChargeChoiceId.KeepYourHead);
      expect(state.line.ncoPresent).toBe(false);
    });

    it('TakeCommand success boosts soldierRep, officerRep, valor, lineIntegrity, and earns grace', () => {
      mockedRollValor.mockReturnValue({ success: true, roll: 10, target: 40 });
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.TakeCommand);

      expect(state.player.soldierRep).toBe(58); // 50 + 8
      expect(state.player.officerRep).toBe(65); // 50 + 15
      expect(state.player.valor).toBe(43); // 40 + 3
      expect(state.line.lineIntegrity).toBe(75); // 70 + 5
      expect(state.graceEarned).toBe(true);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 8 })]),
      );
      expect(result.staminaDelta).toBe(-15);
    });

    it('TakeCommand failure gives small rep boost and negative morale', () => {
      mockedRollValor.mockReturnValue({ success: false, roll: 90, target: 40 });
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.TakeCommand);

      expect(state.player.soldierRep).toBe(53); // 50 + 3
      expect(state.player.officerRep).toBe(55); // 50 + 5
      expect(state.graceEarned).toBe(false);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -3 })]),
      );
    });

    it('RallyTheLine success boosts soldierRep and morale', () => {
      mockedRollValor.mockReturnValue({ success: true, roll: 15, target: 30 });
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.RallyTheLine);

      expect(state.player.soldierRep).toBe(53); // 50 + 3
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
    });

    it('KeepYourHead reduces soldierRep and officerRep', () => {
      const state = aliveState();
      const result = beat.resolveChoice(state, ChargeChoiceId.KeepYourHead);

      expect(state.player.soldierRep).toBe(47); // 50 - 3
      expect(state.player.officerRep).toBe(45); // 50 - 5
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
    });
  });

  // ================================================================
  // Beat 6 — Melee Transition
  // ================================================================
  describe('Beat 6 — Melee Transition', () => {
    const beat = RIVOLI_STORY_BEATS[6];

    it('FixBayonets transitions to Melee phase with correct state', () => {
      const state = aliveState({ ext: { ...DEFAULT_EXT, battlePart: 1 } });
      const result = beat.resolveChoice(state, ChargeChoiceId.FixBayonets);

      expect(state.phase).toBe(BattlePhase.Melee);
      expect(state.ext.meleeStage).toBe(1);
      expect(state.scriptedVolley).toBe(0);
      expect(state.drillStep).toBe(DrillStep.Endure);
      expect(state.enemy.range).toBe(0);
      expect(state.enemy.morale).toBe('charging');
      expect(state.chargeEncounter).toBe(0);
      expect(mockedResetMeleeHistory).toHaveBeenCalled();
      expect(mockedCreateMeleeState).toHaveBeenCalledWith(state, 'terrain', 'terrain');
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(result.log.length).toBeGreaterThan(0);
    });
  });

  // ================================================================
  // Narrative generation
  // ================================================================
  describe('getNarrative', () => {
    it('each beat produces non-empty narrative text', () => {
      for (const [, beat] of Object.entries(RIVOLI_STORY_BEATS)) {
        const state = aliveState({ ext: { ...DEFAULT_EXT, batteryCharged: true } });
        const narrative = beat.getNarrative(state);
        expect(narrative.length).toBeGreaterThan(50);
      }
    });

    it('Aftermath (beat 4) narrative differs based on batteryCharged flag', () => {
      const beat = RIVOLI_STORY_BEATS[4];
      const charged = beat.getNarrative(
        aliveState({ ext: { ...DEFAULT_EXT, batteryCharged: true } }),
      );
      const held = beat.getNarrative(
        aliveState({ ext: { ...DEFAULT_EXT, batteryCharged: false } }),
      );
      expect(charged).toContain('Retook the battery');
      expect(held).toContain('Held the line');
    });

    it('Masséna (beat 2) narrative differs when Pierre is alive vs dead', () => {
      const beat = RIVOLI_STORY_BEATS[2];
      const alive = beat.getNarrative(aliveState());
      const dead = beat.getNarrative(pierreDeadState());
      expect(alive).toContain('Still here');
      expect(dead).toContain('empty');
    });
  });

  // ================================================================
  // getChoices
  // ================================================================
  describe('getChoices', () => {
    it('each beat provides at least one available choice', () => {
      for (const [, beat] of Object.entries(RIVOLI_STORY_BEATS)) {
        const state = aliveState();
        const choices = beat.getChoices(state);
        expect(choices.length).toBeGreaterThanOrEqual(1);
        for (const choice of choices) {
          expect(choice.id).toBeTruthy();
          expect(choice.label).toBeTruthy();
          expect(choice.available).toBe(true);
        }
      }
    });
  });
});
