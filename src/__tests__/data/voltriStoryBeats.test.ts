import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BattlePhase, ChargeChoiceId, ChargeEncounterId, MeleeContext } from '../../types/enums';
import type { BattleState, MeleeState, VoltriExt } from '../../types';
import { isVoltriExt } from '../../types';
import { mockBattleState, DEFAULT_VOLTRI_EXT } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Mock melee module — createMeleeState & resetMeleeHistory are called by
// VoltriFixBayonets (beat 10)
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
          description: 'A whitecoat scrambles through the olive trees.',
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

// Mock stats module — rollStat is called by CoastalRoad, WoundedSoldier, Homestead
vi.mock('../../core/stats', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollStat: vi.fn(() => ({ success: true, roll: 30, target: 50, margin: 20 })),
    rollD100: vi.fn(() => 50),
  };
});

// Mock morale module — rollValor is called by LineBreaks, CavalryScare
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
import { VOLTRI_STORY_BEATS } from '../../data/battles/voltri/storyBeats';

const mockedRollStat = vi.mocked(rollStat);
const mockedRollValor = vi.mocked(rollValor);
const mockedCreateMeleeState = vi.mocked(createMeleeState);
const mockedResetMeleeHistory = vi.mocked(resetMeleeHistory);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a BattleState configured for Voltri story beats. */
function voltriState(overrides: Partial<BattleState> = {}): BattleState {
  const { ext: extOverrides, ...restOverrides } = overrides;
  return mockBattleState({
    phase: BattlePhase.StoryBeat,
    configId: 'voltri',
    ext: { ...DEFAULT_VOLTRI_EXT, ...extOverrides },
    ...restOverrides,
  });
}

/** Narrow state.ext to VoltriExt (safe in these tests since we always construct with DEFAULT_VOLTRI_EXT). */
function ext(state: BattleState): VoltriExt {
  if (isVoltriExt(state.ext)) return state.ext;
  throw new Error('Expected VoltriExt');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('VOLTRI_STORY_BEATS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: stat checks and valor checks succeed
    mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
    mockedRollValor.mockReturnValue({ success: true, roll: 20, target: 40 });
  });

  it('has 8 story beat definitions keyed by Voltri encounter IDs', () => {
    const keys = Object.keys(VOLTRI_STORY_BEATS).map(Number).sort((a, b) => a - b);
    expect(keys).toEqual([
      ChargeEncounterId.VoltriFixBayonets,    // 10
      ChargeEncounterId.VoltriLineBreaks,     // 11
      ChargeEncounterId.VoltriCoastalRoad,    // 12
      ChargeEncounterId.VoltriCavalryScare,   // 13
      ChargeEncounterId.VoltriDawnSavona,     // 14
      ChargeEncounterId.VoltriWoundedSoldier, // 15
      ChargeEncounterId.VoltriHomestead,      // 16
      ChargeEncounterId.VoltriWoundedCanteen, // 17
    ]);
  });

  // ================================================================
  // Narrative generation
  // ================================================================
  describe('getNarrative', () => {
    it('each beat produces non-empty narrative text', () => {
      for (const [, beat] of Object.entries(VOLTRI_STORY_BEATS)) {
        const state = voltriState();
        const narrative = beat.getNarrative(state);
        expect(narrative.length).toBeGreaterThan(50);
      }
    });

    it('CoastalRoad narrative uses "a soldier" when felixMet is false', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: false } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('a soldier');
    });

    it('CoastalRoad narrative uses "Felix Martel" when felixMet is true', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: true } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('Felix Martel');
    });

    it('WoundedSoldier narrative uses "Felix" when felixMet is true', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: true } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('Felix');
      expect(narrative).toContain('Should have stayed with the cards');
    });

    it('WoundedSoldier narrative uses "The man" when felixMet is false', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: false } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('The man');
      expect(narrative).toContain('Help me');
    });

    it('WoundedCanteen narrative shows water available when canteenUses > 0', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];
      const state = voltriState();
      state.player.canteenUses = 2;
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('water left');
    });

    it('WoundedCanteen narrative shows empty when canteenUses = 0', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];
      const state = voltriState();
      state.player.canteenUses = 0;
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('empty');
    });

    it('Homestead narrative includes felix clause when felixSurvived and felixMet', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixSurvived: true, felixMet: true } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('Felix');
    });

    it('Homestead narrative omits felix clause when felixSurvived is false', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixSurvived: false } });
      const narrative = beat.getNarrative(state);
      expect(narrative).not.toContain('fading');
    });

    it('DawnSavona narrative shows separated version when separated is true', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('straggler');
      expect(narrative).toContain('Where the hell have you been');
    });

    it('DawnSavona narrative shows column version when separated is false', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: false } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('column stumbles');
      expect(narrative).not.toContain('straggler');
    });

    it('DawnSavona narrative includes felix when separated and felixSurvived', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true, felixSurvived: true, felixMet: true } });
      const narrative = beat.getNarrative(state);
      expect(narrative).toContain('Felix');
    });
  });

  // ================================================================
  // getChoices
  // ================================================================
  describe('getChoices', () => {
    it('each beat provides at least one available choice', () => {
      for (const [, beat] of Object.entries(VOLTRI_STORY_BEATS)) {
        const state = voltriState();
        state.player.canteenUses = 2; // Ensure canteen choice is available
        const choices = beat.getChoices(state);
        expect(choices.length).toBeGreaterThanOrEqual(1);
        for (const choice of choices) {
          expect(choice.id).toBeTruthy();
          expect(choice.label).toBeTruthy();
          expect(typeof choice.description).toBe('string');
          expect(typeof choice.available).toBe('boolean');
        }
      }
    });

    it('FixBayonets has 1 choice: VoltriFixBayonets', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriFixBayonets];
      const choices = beat.getChoices(voltriState());
      expect(choices).toHaveLength(1);
      expect(choices[0].id).toBe(ChargeChoiceId.VoltriFixBayonets);
      expect(choices[0].available).toBe(true);
    });

    it('LineBreaks has 2 choices: FallBack and CoverRetreat', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriLineBreaks];
      const choices = beat.getChoices(voltriState());
      expect(choices).toHaveLength(2);
      expect(choices.map(c => c.id)).toEqual([ChargeChoiceId.FallBack, ChargeChoiceId.CoverRetreat]);
      expect(choices.every(c => c.available)).toBe(true);
    });

    it('CoastalRoad has 2 choices: HelpStragglers and KeepMoving', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      const choices = beat.getChoices(voltriState());
      expect(choices).toHaveLength(2);
      expect(choices.map(c => c.id)).toEqual([ChargeChoiceId.HelpStragglers, ChargeChoiceId.KeepMoving]);
    });

    it('CavalryScare has 2 choices: StandFirm and ScatterAndHide', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCavalryScare];
      const choices = beat.getChoices(voltriState());
      expect(choices).toHaveLength(2);
      expect(choices.map(c => c.id)).toEqual([ChargeChoiceId.StandFirm, ChargeChoiceId.ScatterAndHide]);
    });

    it('WoundedSoldier has 2 choices: TendWoundsVoltri and LeaveWounded', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];
      const choices = beat.getChoices(voltriState());
      expect(choices).toHaveLength(2);
      expect(choices.map(c => c.id)).toEqual([ChargeChoiceId.TendWoundsVoltri, ChargeChoiceId.LeaveWounded]);
    });

    it('WoundedCanteen ShareCanteen is available when canteenUses > 0', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];
      const state = voltriState();
      state.player.canteenUses = 2;
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(2);
      const shareChoice = choices.find(c => c.id === ChargeChoiceId.ShareCanteen)!;
      expect(shareChoice.available).toBe(true);
    });

    it('WoundedCanteen ShareCanteen is unavailable when canteenUses = 0', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];
      const state = voltriState();
      state.player.canteenUses = 0;
      const choices = beat.getChoices(state);
      const shareChoice = choices.find(c => c.id === ChargeChoiceId.ShareCanteen)!;
      expect(shareChoice.available).toBe(false);
      const conserveChoice = choices.find(c => c.id === ChargeChoiceId.ConserveSupplies)!;
      expect(conserveChoice.available).toBe(true);
    });

    it('Homestead shows friendly choices when ligurianGirlSaved is true', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(2);
      expect(choices.map(c => c.id)).toEqual([ChargeChoiceId.RestHere, ChargeChoiceId.MoveOnAtDawn]);
    });

    it('Homestead shows hostile choices when ligurianGirlSaved is false', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(3);
      expect(choices.map(c => c.id)).toEqual([
        ChargeChoiceId.ApproachHomestead,
        ChargeChoiceId.ShelterInBarn,
        ChargeChoiceId.AvoidHomestead,
      ]);
    });

    it('DawnSavona has 2 choices: CollapseAndSleep and FindYourUnit', () => {
      const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      const choices = beat.getChoices(voltriState());
      expect(choices).toHaveLength(2);
      expect(choices.map(c => c.id)).toEqual([ChargeChoiceId.CollapseAndSleep, ChargeChoiceId.FindYourUnit]);
    });
  });

  // ================================================================
  // Beat 10 — Fix Bayonets
  // ================================================================
  describe('Beat 10 — Fix Bayonets (VoltriFixBayonets)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriFixBayonets];

    it('transitions to Melee phase with meleeStage 1', () => {
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.VoltriFixBayonets);

      expect(state.phase).toBe(BattlePhase.Melee);
      expect(state.ext.meleeStage).toBe(1);
      expect(state.scriptedVolley).toBe(0);
      expect(state.enemy.range).toBe(0);
      expect(state.enemy.morale).toBe('charging');
      expect(state.chargeEncounter).toBe(0);
      expect(mockedResetMeleeHistory).toHaveBeenCalled();
      expect(mockedCreateMeleeState).toHaveBeenCalledWith(state, MeleeContext.Skirmish, 'pegli_hills');
      expect(result.log.length).toBeGreaterThan(0);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
    });

    it('log includes skirmish event and first opponent narrative', () => {
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.VoltriFixBayonets);

      const eventLog = result.log.find(l => l.type === 'event');
      expect(eventLog).toBeDefined();
      expect(eventLog!.text).toContain('SKIRMISH');

      const narrativeLog = result.log.find(l => l.type === 'narrative');
      expect(narrativeLog).toBeDefined();
      expect(narrativeLog!.text).toContain('faces you');
    });
  });

  // ================================================================
  // Beat 11 — The Line Breaks
  // ================================================================
  describe('Beat 11 — The Line Breaks (VoltriLineBreaks)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriLineBreaks];

    it('FallBack gives orderly retreat with positive morale and stamina cost', () => {
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.FallBack);

      expect(result.log.length).toBeGreaterThan(0);
      expect(result.log[0].text).toContain('fall back');
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(-15);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });

    it('CoverRetreat success gives +5 morale and +3 soldierRep', () => {
      mockedRollValor.mockReturnValue({ success: true, roll: 15, target: 35 });
      const state = voltriState();
      const repBefore = state.player.soldierRep;
      const result = beat.resolveChoice(state, ChargeChoiceId.CoverRetreat);

      expect(result.log[0].text).toContain('passed');
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
      expect(state.player.soldierRep).toBe(repBefore + 3);
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(-15);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });

    it('CoverRetreat failure gives -2 morale and -8 health', () => {
      mockedRollValor.mockReturnValue({ success: false, roll: 80, target: 35 });
      const state = voltriState();
      const repBefore = state.player.soldierRep;
      const result = beat.resolveChoice(state, ChargeChoiceId.CoverRetreat);

      expect(result.log[0].text).toContain('failed');
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
      expect(state.player.soldierRep).toBe(repBefore); // No rep change on failure
      expect(result.healthDelta).toBe(-8);
      expect(result.staminaDelta).toBe(-15);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });
  });

  // ================================================================
  // Beat 12 — The Coastal Road
  // ================================================================
  describe('Beat 12 — The Coastal Road (VoltriCoastalRoad)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];

    it('HelpStragglers success sets separated, gives -10 stamina, +2 soldierRep', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState();
      const repBefore = state.player.soldierRep;
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpStragglers);

      expect(ext(state).separated).toBe(true);
      expect(state.player.soldierRep).toBe(repBefore + 2);
      expect(result.staminaDelta).toBe(-10);
      expect(result.healthDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedSoldier);
    });

    it('HelpStragglers failure sets separated, gives -20 stamina and -5 health', () => {
      mockedRollStat.mockReturnValue({ success: false, roll: 80, target: 50, margin: -30 });
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpStragglers);

      expect(ext(state).separated).toBe(true);
      expect(result.staminaDelta).toBe(-20);
      expect(result.healthDelta).toBe(-5);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedSoldier);
    });

    it('HelpStragglers uses "Felix" in log when felixMet is true', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: true } });
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpStragglers);
      expect(result.log[0].text).toContain('Felix');
    });

    it('HelpStragglers uses "the man" in log when felixMet is false', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: false } });
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpStragglers);
      expect(result.log[0].text).toContain('the man');
    });

    it('KeepMoving gives -2 morale and transitions to CavalryScare', () => {
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.KeepMoving);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCavalryScare);
    });
  });

  // ================================================================
  // Beat 13 — Cavalry Scare
  // ================================================================
  describe('Beat 13 — Cavalry Scare (VoltriCavalryScare)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCavalryScare];

    it('StandFirm success gives +5 morale', () => {
      mockedRollValor.mockReturnValue({ success: true, roll: 15, target: 40 });
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.StandFirm);

      expect(result.log[0].text).toContain('passed');
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });

    it('StandFirm failure gives -3 morale and -6 health', () => {
      mockedRollValor.mockReturnValue({ success: false, roll: 80, target: 40 });
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.StandFirm);

      expect(result.log[0].text).toContain('failed');
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -3 })]),
      );
      expect(result.healthDelta).toBe(-6);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });

    it('ScatterAndHide gives -2 morale and -1 soldierRep', () => {
      const state = voltriState();
      const repBefore = state.player.soldierRep;
      const result = beat.resolveChoice(state, ChargeChoiceId.ScatterAndHide);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
      expect(state.player.soldierRep).toBe(repBefore - 1);
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });
  });

  // ================================================================
  // Beat 15 — Wounded Soldier
  // ================================================================
  describe('Beat 15 — Wounded Soldier (VoltriWoundedSoldier)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];

    it('TendWoundsVoltri success gives +3 morale, -5 stamina, +5 virtue, +2 felixTendScore', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.TendWoundsVoltri);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(result.staminaDelta).toBe(-5);
      expect(result.healthDelta).toBe(0);
      expect(result.virtueChange).toBe(5);
      expect(ext(state).felixTendScore).toBe(2);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedCanteen);
    });

    it('TendWoundsVoltri failure gives -10 stamina and +3 virtue', () => {
      mockedRollStat.mockReturnValue({ success: false, roll: 80, target: 50, margin: -30 });
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.TendWoundsVoltri);

      expect(result.staminaDelta).toBe(-10);
      expect(result.healthDelta).toBe(0);
      expect(result.virtueChange).toBe(3);
      expect(ext(state).felixTendScore).toBe(0); // No increment on failure
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedCanteen);
    });

    it('TendWoundsVoltri does not change soldierRep (soldierRep is set in CoastalRoad)', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState();
      const repBefore = state.player.soldierRep;
      beat.resolveChoice(state, ChargeChoiceId.TendWoundsVoltri);

      expect(state.player.soldierRep).toBe(repBefore);
    });

    it('LeaveWounded gives -5 morale, -10 virtue, sets felixSurvived false, transitions to Homestead', () => {
      const state = voltriState();
      const result = beat.resolveChoice(state, ChargeChoiceId.LeaveWounded);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -5 })]),
      );
      expect(result.virtueChange).toBe(-10);
      expect(ext(state).felixSurvived).toBe(false);
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriHomestead);
    });

    it('LeaveWounded uses "Felix" in log when felixMet is true', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: true } });
      const result = beat.resolveChoice(state, ChargeChoiceId.LeaveWounded);
      expect(result.log[0].text).toContain('Felix');
    });

    it('LeaveWounded uses "the soldier" in log when felixMet is false', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixMet: false } });
      const result = beat.resolveChoice(state, ChargeChoiceId.LeaveWounded);
      expect(result.log[0].text).toContain('The man');
    });
  });

  // ================================================================
  // Beat 17 — Wounded Canteen
  // ================================================================
  describe('Beat 17 — Wounded Canteen (VoltriWoundedCanteen)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];

    it('ShareCanteen decrements canteenUses, +1 felixTendScore, +2 morale, +3 virtue', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 2 } });
      state.player.canteenUses = 2;
      const result = beat.resolveChoice(state, ChargeChoiceId.ShareCanteen);

      expect(state.player.canteenUses).toBe(1);
      expect(ext(state).felixTendScore).toBe(3);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 2 })]),
      );
      expect(result.virtueChange).toBe(3);
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
    });

    it('ShareCanteen does not reduce canteenUses below 0', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 2 } });
      state.player.canteenUses = 0;
      beat.resolveChoice(state, ChargeChoiceId.ShareCanteen);
      expect(state.player.canteenUses).toBe(0);
    });

    it('ConserveSupplies gives -1 morale and 0 virtue change', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 0 } });
      state.player.canteenUses = 2;
      const result = beat.resolveChoice(state, ChargeChoiceId.ConserveSupplies);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -1 })]),
      );
      expect(result.virtueChange).toBe(0);
    });

    it('felix survives when felixTendScore >= 2 after canteen', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 2 } });
      state.player.canteenUses = 2;
      beat.resolveChoice(state, ChargeChoiceId.ShareCanteen);

      // felixTendScore is now 3 (2 + 1 from ShareCanteen)
      expect(ext(state).felixSurvived).toBe(true);
    });

    it('felix dies when felixTendScore is 0 after ConserveSupplies', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 0 } });
      state.player.canteenUses = 2;
      const result = beat.resolveChoice(state, ChargeChoiceId.ConserveSupplies);

      expect(ext(state).felixSurvived).toBe(false);
      // Death log is added
      const deathLog = result.log.find(l => l.type === 'narrative' && l.text.includes('stops'));
      expect(deathLog).toBeDefined();
      // Additional morale penalty for death
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -3, reason: expect.stringContaining('died') })]),
      );
    });

    it('felix survives when felixTendScore >= 2 after ConserveSupplies', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 2 } });
      state.player.canteenUses = 2;
      const result = beat.resolveChoice(state, ChargeChoiceId.ConserveSupplies);

      expect(ext(state).felixSurvived).toBe(true);
      const surviveLog = result.log.find(l => l.type === 'narrative' && l.text.includes('manages to stand'));
      expect(surviveLog).toBeDefined();
    });

    it('always transitions to Homestead', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 2 } });
      state.player.canteenUses = 2;
      beat.resolveChoice(state, ChargeChoiceId.ShareCanteen);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriHomestead);
    });

    it('ConserveSupplies also transitions to Homestead', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 0 } });
      state.player.canteenUses = 0;
      beat.resolveChoice(state, ChargeChoiceId.ConserveSupplies);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriHomestead);
    });
  });

  // ================================================================
  // Beat 16 — The Homestead
  // ================================================================
  describe('Beat 16 — The Homestead (VoltriHomestead)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];

    // --- Friendly path (ligurianGirlSaved = true) ---
    describe('friendly path (ligurianGirlSaved)', () => {
      it('RestHere gives +15 health, +20 stamina, +5 morale', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.RestHere);

        expect(result.healthDelta).toBe(15);
        expect(result.staminaDelta).toBe(20);
        expect(result.moraleChanges).toEqual(
          expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
        );
        expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
      });

      it('RestHere log mentions the lemon seller recognition', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.RestHere);
        expect(result.log[0].text).toContain('lemon seller');
      });

      it('RestHere log includes Felix treatment when felixSurvived and felixMet', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true, felixSurvived: true, felixMet: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.RestHere);
        expect(result.log[0].text).toContain('Felix');
      });

      it('MoveOnAtDawn gives +5 health, +8 stamina, +3 morale', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.MoveOnAtDawn);

        expect(result.healthDelta).toBe(5);
        expect(result.staminaDelta).toBe(8);
        expect(result.moraleChanges).toEqual(
          expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
        );
        expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
      });

      it('MoveOnAtDawn mentions Felix staying when felixSurvived and felixMet', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true, felixSurvived: true, felixMet: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.MoveOnAtDawn);
        expect(result.log[0].text).toContain('Felix');
        expect(result.log[0].text).toContain('stays');
      });
    });

    // --- Hostile path (ligurianGirlSaved = false) ---
    describe('hostile path (ligurianGirlSaved = false)', () => {
      it('ApproachHomestead success gives +8 health, +12 stamina, +3 morale', () => {
        mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
        const result = beat.resolveChoice(state, ChargeChoiceId.ApproachHomestead);

        expect(result.log[0].text).toContain('passed');
        expect(result.healthDelta).toBe(8);
        expect(result.staminaDelta).toBe(12);
        expect(result.moraleChanges).toEqual(
          expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
        );
        expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
      });

      it('ApproachHomestead failure gives -5 stamina, -2 morale', () => {
        mockedRollStat.mockReturnValue({ success: false, roll: 80, target: 50, margin: -30 });
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
        const result = beat.resolveChoice(state, ChargeChoiceId.ApproachHomestead);

        expect(result.log[0].text).toContain('failed');
        expect(result.healthDelta).toBe(0);
        expect(result.staminaDelta).toBe(-5);
        expect(result.moraleChanges).toEqual(
          expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
        );
        expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
      });

      it('ApproachHomestead success mentions Felix when felixSurvived and felixMet', () => {
        mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false, felixSurvived: true, felixMet: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.ApproachHomestead);
        expect(result.log[0].text).toContain('Felix');
      });

      it('ShelterInBarn gives +3 stamina, +1 morale', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
        const result = beat.resolveChoice(state, ChargeChoiceId.ShelterInBarn);

        expect(result.healthDelta).toBe(0);
        expect(result.staminaDelta).toBe(3);
        expect(result.moraleChanges).toEqual(
          expect.arrayContaining([expect.objectContaining({ amount: 1 })]),
        );
        expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
      });

      it('ShelterInBarn mentions Felix when felixSurvived and felixMet', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false, felixSurvived: true, felixMet: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.ShelterInBarn);
        expect(result.log[0].text).toContain('Felix');
      });

      it('AvoidHomestead gives -10 stamina, -3 morale', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
        const result = beat.resolveChoice(state, ChargeChoiceId.AvoidHomestead);

        expect(result.healthDelta).toBe(0);
        expect(result.staminaDelta).toBe(-10);
        expect(result.moraleChanges).toEqual(
          expect.arrayContaining([expect.objectContaining({ amount: -3 })]),
        );
        expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
      });

      it('AvoidHomestead mentions Felix when felixSurvived and felixMet', () => {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false, felixSurvived: true, felixMet: true } });
        const result = beat.resolveChoice(state, ChargeChoiceId.AvoidHomestead);
        expect(result.log[0].text).toContain('Felix');
      });
    });

    it('all paths transition to VoltriDawnSavona', () => {
      // Friendly: RestHere
      let state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } });
      beat.resolveChoice(state, ChargeChoiceId.RestHere);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);

      // Friendly: MoveOnAtDawn
      state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } });
      beat.resolveChoice(state, ChargeChoiceId.MoveOnAtDawn);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);

      // Hostile: ApproachHomestead
      state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
      beat.resolveChoice(state, ChargeChoiceId.ApproachHomestead);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);

      // Hostile: ShelterInBarn
      state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
      beat.resolveChoice(state, ChargeChoiceId.ShelterInBarn);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);

      // Hostile: AvoidHomestead
      state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } });
      beat.resolveChoice(state, ChargeChoiceId.AvoidHomestead);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });
  });

  // ================================================================
  // Beat 14 — Dawn at Savona
  // ================================================================
  describe('Beat 14 — Dawn at Savona (VoltriDawnSavona)', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];

    it('CollapseAndSleep (column path) gives +10 health, +20 stamina, +3 morale', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: false } });
      const result = beat.resolveChoice(state, ChargeChoiceId.CollapseAndSleep);

      expect(result.healthDelta).toBe(10);
      expect(result.staminaDelta).toBe(20);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });

    it('CollapseAndSleep (separated path) gives same deltas', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true } });
      const result = beat.resolveChoice(state, ChargeChoiceId.CollapseAndSleep);

      expect(result.healthDelta).toBe(10);
      expect(result.staminaDelta).toBe(20);
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });

    it('CollapseAndSleep (separated + felixSurvived) log mentions surgeons', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true, felixSurvived: true, felixMet: true } });
      const result = beat.resolveChoice(state, ChargeChoiceId.CollapseAndSleep);
      expect(result.log[0].text).toContain('surgeons');
    });

    it('FindYourUnit (column path) gives +2 soldierRep and +2 officerRep', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: false } });
      const repBefore = state.player.soldierRep;
      const officerRepBefore = state.player.officerRep;
      const result = beat.resolveChoice(state, ChargeChoiceId.FindYourUnit);

      expect(state.player.soldierRep).toBe(repBefore + 2);
      expect(state.player.officerRep).toBe(officerRepBefore + 2);
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
      expect(result.log.length).toBeGreaterThan(0);
    });

    it('FindYourUnit (separated path) gives +3 soldierRep and +2 officerRep', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true } });
      const repBefore = state.player.soldierRep;
      const officerRepBefore = state.player.officerRep;
      const result = beat.resolveChoice(state, ChargeChoiceId.FindYourUnit);

      expect(state.player.soldierRep).toBe(repBefore + 3);
      expect(state.player.officerRep).toBe(officerRepBefore + 2);
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
      expect(result.log.length).toBeGreaterThan(0);
    });

    it('FindYourUnit (separated + felixSurvived) mentions carrying the wounded man', () => {
      const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true, felixSurvived: true, felixMet: true } });
      const result = beat.resolveChoice(state, ChargeChoiceId.FindYourUnit);
      expect(result.log[0].text).toContain('Felix');
    });

    it('all choices produce closing narrative about Bonaparte', () => {
      const state1 = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: false } });
      const result1 = beat.resolveChoice(state1, ChargeChoiceId.CollapseAndSleep);
      const closingLog1 = result1.log.find(l => l.type === 'narrative' && l.text.includes('Bonaparte'));
      expect(closingLog1).toBeDefined();

      const state2 = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, separated: true } });
      const result2 = beat.resolveChoice(state2, ChargeChoiceId.FindYourUnit);
      const closingLog2 = result2.log.find(l => l.type === 'narrative' && l.text.includes('Bonaparte'));
      expect(closingLog2).toBeDefined();
    });

    it('always sets battleOver to true and outcome to survived', () => {
      const choices = [ChargeChoiceId.CollapseAndSleep, ChargeChoiceId.FindYourUnit];
      for (const choiceId of choices) {
        const state = voltriState();
        beat.resolveChoice(state, choiceId);
        expect(state.battleOver).toBe(true);
        expect(state.outcome).toBe('survived');
      }
    });
  });

  // ================================================================
  // Result structure validation
  // ================================================================
  describe('resolveChoice result structure', () => {
    it('every resolveChoice returns valid StoryBeatResult fields', () => {
      // Beat 10: VoltriFixBayonets — single choice
      const beat10 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriFixBayonets];
      const r10 = beat10.resolveChoice(voltriState(), ChargeChoiceId.VoltriFixBayonets);
      expect(Array.isArray(r10.log)).toBe(true);
      expect(Array.isArray(r10.moraleChanges)).toBe(true);
      expect(typeof r10.healthDelta).toBe('number');
      expect(typeof r10.staminaDelta).toBe('number');

      // Beat 11: both choices
      const beat11 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriLineBreaks];
      for (const cid of [ChargeChoiceId.FallBack, ChargeChoiceId.CoverRetreat]) {
        const r = beat11.resolveChoice(voltriState(), cid);
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
        expect(typeof r.healthDelta).toBe('number');
        expect(typeof r.staminaDelta).toBe('number');
      }

      // Beat 12: both choices
      const beat12 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      for (const cid of [ChargeChoiceId.HelpStragglers, ChargeChoiceId.KeepMoving]) {
        const r = beat12.resolveChoice(voltriState(), cid);
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
      }

      // Beat 13: both choices
      const beat13 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCavalryScare];
      for (const cid of [ChargeChoiceId.StandFirm, ChargeChoiceId.ScatterAndHide]) {
        const r = beat13.resolveChoice(voltriState(), cid);
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
      }

      // Beat 15: both choices
      const beat15 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];
      for (const cid of [ChargeChoiceId.TendWoundsVoltri, ChargeChoiceId.LeaveWounded]) {
        const r = beat15.resolveChoice(voltriState(), cid);
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
      }

      // Beat 17: both choices
      const beat17 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];
      for (const cid of [ChargeChoiceId.ShareCanteen, ChargeChoiceId.ConserveSupplies]) {
        const state = voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, felixTendScore: 2 } });
        state.player.canteenUses = 2;
        const r = beat17.resolveChoice(state, cid);
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
      }

      // Beat 16: all 5 choices (friendly + hostile)
      const beat16 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];
      for (const cid of [ChargeChoiceId.RestHere, ChargeChoiceId.MoveOnAtDawn]) {
        const r = beat16.resolveChoice(
          voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: true } }),
          cid,
        );
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
      }
      for (const cid of [ChargeChoiceId.ApproachHomestead, ChargeChoiceId.ShelterInBarn, ChargeChoiceId.AvoidHomestead]) {
        const r = beat16.resolveChoice(
          voltriState({ ext: { ...DEFAULT_VOLTRI_EXT, ligurianGirlSaved: false } }),
          cid,
        );
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
      }

      // Beat 14: both choices
      const beat14 = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      for (const cid of [ChargeChoiceId.CollapseAndSleep, ChargeChoiceId.FindYourUnit]) {
        const r = beat14.resolveChoice(voltriState(), cid);
        expect(Array.isArray(r.log)).toBe(true);
        expect(r.log.length).toBeGreaterThan(0);
        expect(typeof r.healthDelta).toBe('number');
        expect(typeof r.staminaDelta).toBe('number');
      }
    });
  });

  // ================================================================
  // Path integration — column path transitions
  // ================================================================
  describe('column path transitions', () => {
    it('KeepMoving → CavalryScare → DawnSavona → battleOver', () => {
      // CoastalRoad: KeepMoving
      const state = voltriState();
      const coastalBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      coastalBeat.resolveChoice(state, ChargeChoiceId.KeepMoving);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCavalryScare);

      // CavalryScare: StandFirm
      const cavalryBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCavalryScare];
      cavalryBeat.resolveChoice(state, ChargeChoiceId.StandFirm);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);

      // DawnSavona: CollapseAndSleep
      const dawnBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      dawnBeat.resolveChoice(state, ChargeChoiceId.CollapseAndSleep);
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });
  });

  // ================================================================
  // Path integration — separation path transitions
  // ================================================================
  describe('separation path transitions', () => {
    it('HelpStragglers → WoundedSoldier → WoundedCanteen → Homestead → DawnSavona → battleOver', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState();

      // CoastalRoad: HelpStragglers
      const coastalBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      coastalBeat.resolveChoice(state, ChargeChoiceId.HelpStragglers);
      expect(ext(state).separated).toBe(true);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedSoldier);

      // WoundedSoldier: TendWoundsVoltri
      const woundedBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];
      woundedBeat.resolveChoice(state, ChargeChoiceId.TendWoundsVoltri);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedCanteen);

      // WoundedCanteen: ShareCanteen
      state.player.canteenUses = 2;
      const canteenBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedCanteen];
      canteenBeat.resolveChoice(state, ChargeChoiceId.ShareCanteen);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriHomestead);
      expect(ext(state).felixSurvived).toBe(true); // felixTendScore = 2 + 1 = 3

      // Homestead: ShelterInBarn (hostile path since ligurianGirlSaved defaults false)
      const homesteadBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriHomestead];
      homesteadBeat.resolveChoice(state, ChargeChoiceId.ShelterInBarn);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);

      // DawnSavona: FindYourUnit
      const dawnBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];
      dawnBeat.resolveChoice(state, ChargeChoiceId.FindYourUnit);
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });

    it('HelpStragglers → LeaveWounded skips canteen and goes to Homestead', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState();

      // CoastalRoad: HelpStragglers
      const coastalBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];
      coastalBeat.resolveChoice(state, ChargeChoiceId.HelpStragglers);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedSoldier);

      // WoundedSoldier: LeaveWounded — skips canteen
      const woundedBeat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriWoundedSoldier];
      woundedBeat.resolveChoice(state, ChargeChoiceId.LeaveWounded);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriHomestead);
      expect(ext(state).felixSurvived).toBe(false);
    });
  });
});
