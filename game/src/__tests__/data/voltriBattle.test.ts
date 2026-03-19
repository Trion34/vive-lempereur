import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  BattlePhase,
  ChargeChoiceId,
  ChargeEncounterId,
  MeleeContext,
} from '../../types/enums';
import type { BattleState, MeleeState, VoltriExt } from '../../types';
import { mockBattleState, DEFAULT_VOLTRI_EXT } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Mock melee module — createMeleeState & resetMeleeHistory are called by
// FixBayonets (beat 10)
// ---------------------------------------------------------------------------
vi.mock('../../core/melee', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    createMeleeState: vi.fn((): MeleeState => ({
      opponents: [
        {
          id: 0,
          name: 'Austrian conscript',
          tier: 'conscript',
          description: 'A young Austrian stumbles through the olive grove.',
          health: 60,
          maxHealth: 60,
          stamina: 160,
          maxStamina: 160,
          morale: 50,
          maxMorale: 100,
          stance: 'balanced',
          stunned: 0,
          alive: true,
          strength: 35,
          baseHitChance: 0.4,
          baseDamage: [6, 12],
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
      maxExchanges: 8,
      allies: [],
      activeEnemies: [0],
      enemyPool: [],
      maxActiveEnemies: 1,
      reinforcementInterval: 3,
    } as unknown as MeleeState)),
    resetMeleeHistory: vi.fn(),
  };
});

// Mock morale module — rollValor is called by LineBreaks and CavalryScare
vi.mock('../../core/morale', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollValor: vi.fn(() => ({ success: true, roll: 20, target: 40 })),
  };
});

// Mock stats module — rollStat is called by CoastalRoad (constitution check)
vi.mock('../../core/stats', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollStat: vi.fn(() => ({ success: true, roll: 30, target: 50, margin: 20 })),
  };
});

// Mock persistence — imported transitively
vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => ({ glory: 0, spent: {} })),
  addGlory: vi.fn(),
}));

import { rollValor } from '../../core/morale';
import { rollStat } from '../../core/stats';
import { createMeleeState, resetMeleeHistory } from '../../core/melee';
// Import voltri config to trigger registration side-effect
import '../../data/battles/voltri';
// Import italy campaign (provides NPC templates used by voltri)
import '../../data/campaigns/italy';
import { VOLTRI_STORY_BEATS } from '../../data/battles/voltri/storyBeats';
import { VOLTRI_VOLLEYS } from '../../data/battles/voltri/volleys';
import { VOLTRI_ENCOUNTERS, PEGLI_ROSTER } from '../../data/battles/voltri/encounters';
import { getBattleConfig } from '../../data/battles/registry';

const mockedRollValor = vi.mocked(rollValor);
const mockedRollStat = vi.mocked(rollStat);
const mockedCreateMeleeState = vi.mocked(createMeleeState);
const mockedResetMeleeHistory = vi.mocked(resetMeleeHistory);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function voltriState(overrides: Omit<Partial<BattleState>, 'ext'> & { ext?: VoltriExt } = {}): BattleState {
  return mockBattleState({
    configId: 'voltri',
    phase: BattlePhase.StoryBeat,
    ext: { ...DEFAULT_VOLTRI_EXT },
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Voltri Battle Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: stat checks succeed
    mockedRollValor.mockReturnValue({ success: true, roll: 20, target: 40 });
    mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
  });

  // ================================================================
  // STORY BEATS — structure
  // ================================================================

  describe('VOLTRI_STORY_BEATS', () => {
    it('has 8 story beat definitions keyed 10-17', () => {
      const keys = Object.keys(VOLTRI_STORY_BEATS).map(Number).sort((a, b) => a - b);
      expect(keys).toEqual([10, 11, 12, 13, 14, 15, 16, 17]);
    });

    it('each beat provides at least one available choice', () => {
      for (const [, beat] of Object.entries(VOLTRI_STORY_BEATS)) {
        const state = voltriState({ chargeEncounter: beat.id });
        const choices = beat.getChoices(state);
        expect(choices.length).toBeGreaterThanOrEqual(1);
        for (const choice of choices) {
          expect(choice.id).toBeTruthy();
          expect(choice.label).toBeTruthy();
          expect(choice.available).toBe(true);
        }
      }
    });

    it('each beat produces non-empty narrative text', () => {
      for (const [, beat] of Object.entries(VOLTRI_STORY_BEATS)) {
        const state = voltriState({ chargeEncounter: beat.id });
        const narrative = beat.getNarrative(state);
        expect(narrative.length).toBeGreaterThan(50);
      }
    });
  });

  // ================================================================
  // Beat 10 — Fix Bayonets
  // ================================================================

  describe('Beat 10 — Fix Bayonets', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriFixBayonets];

    it('has a single VoltriFixBayonets choice', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriFixBayonets });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(1);
      expect(choices[0].id).toBe(ChargeChoiceId.VoltriFixBayonets);
    });

    it('transitions to Melee phase with Skirmish context', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriFixBayonets });
      const result = beat.resolveChoice(state, ChargeChoiceId.VoltriFixBayonets);

      expect(state.phase).toBe(BattlePhase.Melee);
      expect(state.ext.meleeStage).toBe(1);
      expect(state.scriptedVolley).toBe(0);
      expect(state.enemy.range).toBe(0);
      expect(state.enemy.morale).toBe('charging');
      expect(state.chargeEncounter).toBe(0);
      expect(mockedResetMeleeHistory).toHaveBeenCalled();
      expect(mockedCreateMeleeState).toHaveBeenCalledWith(
        state,
        MeleeContext.Skirmish,
        'pegli_hills',
      );
      expect(state.meleeState).toBeDefined();
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(result.log.length).toBeGreaterThan(0);
    });
  });

  // ================================================================
  // Beat 11 — The Line Breaks
  // ================================================================

  describe('Beat 11 — The Line Breaks', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriLineBreaks];

    it('has two choices: FallBack and CoverRetreat', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriLineBreaks });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(2);
      expect(choices.map((c) => c.id)).toEqual([
        ChargeChoiceId.FallBack,
        ChargeChoiceId.CoverRetreat,
      ]);
    });

    it('FallBack: morale +3, stamina -15, chains to CoastalRoad (12)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriLineBreaks });
      const result = beat.resolveChoice(state, ChargeChoiceId.FallBack);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(result.staminaDelta).toBe(-15);
      expect(result.healthDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });

    it('CoverRetreat success: soldierRep +3, morale +5, stamina -15, chains to 12', () => {
      mockedRollValor.mockReturnValue({ success: true, roll: 10, target: 40 });
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriLineBreaks });
      const result = beat.resolveChoice(state, ChargeChoiceId.CoverRetreat);

      expect(state.player.soldierRep).toBe(53); // 50 + 3
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
      expect(result.staminaDelta).toBe(-15);
      expect(result.healthDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });

    it('CoverRetreat failure: health -8, morale -2, stamina -15, chains to 12', () => {
      mockedRollValor.mockReturnValue({ success: false, roll: 90, target: 40 });
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriLineBreaks });
      const result = beat.resolveChoice(state, ChargeChoiceId.CoverRetreat);

      expect(state.player.soldierRep).toBe(50); // unchanged on failure
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
      expect(result.healthDelta).toBe(-8);
      expect(result.staminaDelta).toBe(-15);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });

  });

  // ================================================================
  // Beat 12 — The Coastal Road
  // ================================================================

  describe('Beat 12 — The Coastal Road', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad];

    it('has two choices: HelpStragglers and KeepMoving', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCoastalRoad });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(2);
      expect(choices.map((c) => c.id)).toEqual([
        ChargeChoiceId.HelpStragglers,
        ChargeChoiceId.KeepMoving,
      ]);
    });

    it('HelpStragglers success: soldierRep +2, stamina -10, chains to WoundedSoldier (15)', () => {
      mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCoastalRoad });
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpStragglers);

      expect(state.player.soldierRep).toBe(52); // 50 + 2
      expect(result.staminaDelta).toBe(-10);
      expect(result.healthDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedSoldier);
      expect((state.ext as import('../../types').VoltriExt).separated).toBe(true);
    });

    it('HelpStragglers failure: stamina -20, health -5, chains to WoundedSoldier (15)', () => {
      mockedRollStat.mockReturnValue({ success: false, roll: 80, target: 50, margin: -30 });
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCoastalRoad });
      const result = beat.resolveChoice(state, ChargeChoiceId.HelpStragglers);

      expect(state.player.soldierRep).toBe(50); // unchanged on failure
      expect(result.staminaDelta).toBe(-20);
      expect(result.healthDelta).toBe(-5);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriWoundedSoldier);
      expect((state.ext as import('../../types').VoltriExt).separated).toBe(true);
    });

    it('KeepMoving: morale -2, chains to CavalryScare (13)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCoastalRoad });
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

  describe('Beat 13 — Cavalry Scare', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCavalryScare];

    it('has two choices: StandFirm and ScatterAndHide', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCavalryScare });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(2);
      expect(choices.map((c) => c.id)).toEqual([
        ChargeChoiceId.StandFirm,
        ChargeChoiceId.ScatterAndHide,
      ]);
    });

    it('StandFirm success: morale +5, chains to DawnSavona (14)', () => {
      mockedRollValor.mockReturnValue({ success: true, roll: 15, target: 40 });
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCavalryScare });
      const result = beat.resolveChoice(state, ChargeChoiceId.StandFirm);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 5 })]),
      );
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });

    it('StandFirm failure: health -6, morale -3, chains to DawnSavona (14)', () => {
      mockedRollValor.mockReturnValue({ success: false, roll: 85, target: 40 });
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCavalryScare });
      const result = beat.resolveChoice(state, ChargeChoiceId.StandFirm);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -3 })]),
      );
      expect(result.healthDelta).toBe(-6);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });

    it('ScatterAndHide: morale -2, soldierRep -1, chains to DawnSavona (14)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCavalryScare });
      const result = beat.resolveChoice(state, ChargeChoiceId.ScatterAndHide);

      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: -2 })]),
      );
      expect(state.player.soldierRep).toBe(49); // 50 - 1
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });
  });

  // ================================================================
  // Beat 14 — Dawn at Savona
  // ================================================================

  describe('Beat 14 — Dawn at Savona', () => {
    const beat = VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona];

    it('has two choices: CollapseAndSleep and FindYourUnit', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriDawnSavona });
      const choices = beat.getChoices(state);
      expect(choices).toHaveLength(2);
      expect(choices.map((c) => c.id)).toEqual([
        ChargeChoiceId.CollapseAndSleep,
        ChargeChoiceId.FindYourUnit,
      ]);
    });

    it('CollapseAndSleep: health +10, stamina +20, morale +3, battleOver=true, outcome=survived', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriDawnSavona });
      const result = beat.resolveChoice(state, ChargeChoiceId.CollapseAndSleep);

      expect(result.healthDelta).toBe(10);
      expect(result.staminaDelta).toBe(20);
      expect(result.moraleChanges).toEqual(
        expect.arrayContaining([expect.objectContaining({ amount: 3 })]),
      );
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });

    it('FindYourUnit: soldierRep +2, officerRep +2, battleOver=true, outcome=survived', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriDawnSavona });
      const result = beat.resolveChoice(state, ChargeChoiceId.FindYourUnit);

      expect(state.player.soldierRep).toBe(52); // 50 + 2
      expect(state.player.officerRep).toBe(52); // 50 + 2
      expect(result.healthDelta).toBe(0);
      expect(result.staminaDelta).toBe(0);
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });

  });

  // ================================================================
  // Story Beat Sequence — chaining
  // ================================================================

  describe('Story beat sequence chains correctly', () => {
    it('Beat 11 chains to 12 (LineBreaks → CoastalRoad)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriLineBreaks });
      VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriLineBreaks].resolveChoice(
        state,
        ChargeChoiceId.FallBack,
      );
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCoastalRoad);
    });

    it('Beat 12 chains to 13 (CoastalRoad → CavalryScare)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCoastalRoad });
      VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCoastalRoad].resolveChoice(
        state,
        ChargeChoiceId.KeepMoving,
      );
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriCavalryScare);
    });

    it('Beat 13 chains to 14 (CavalryScare → DawnSavona)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriCavalryScare });
      VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriCavalryScare].resolveChoice(
        state,
        ChargeChoiceId.ScatterAndHide,
      );
      expect(state.chargeEncounter).toBe(ChargeEncounterId.VoltriDawnSavona);
    });

    it('Beat 14 ends the battle (DawnSavona → battleOver)', () => {
      const state = voltriState({ chargeEncounter: ChargeEncounterId.VoltriDawnSavona });
      VOLTRI_STORY_BEATS[ChargeEncounterId.VoltriDawnSavona].resolveChoice(
        state,
        ChargeChoiceId.CollapseAndSleep,
      );
      expect(state.battleOver).toBe(true);
      expect(state.outcome).toBe('survived');
    });
  });

  // ================================================================
  // VOLLEYS
  // ================================================================

  describe('VOLTRI_VOLLEYS', () => {
    it('has 2 volley configs', () => {
      expect(VOLTRI_VOLLEYS).toHaveLength(2);
    });

    it('volley 1 has range 150 and correct accuracy base', () => {
      const v1 = VOLTRI_VOLLEYS[0];
      expect(v1.def.range).toBe(150);
      expect(v1.def.fireAccuracyBase).toBe(0.15);
      expect(v1.def.perceptionBase).toBe(0.1);
      expect(v1.def.enemyReturnFireChance).toBe(0.1);
      expect(v1.def.enemyReturnFireDamage).toEqual([5, 10]);
      expect(v1.def.enemyLineDamage).toBe(4);
    });

    it('volley 2 has range 100 and higher accuracy', () => {
      const v2 = VOLTRI_VOLLEYS[1];
      expect(v2.def.range).toBe(100);
      expect(v2.def.fireAccuracyBase).toBe(0.25);
      expect(v2.def.perceptionBase).toBe(0.2);
      expect(v2.def.enemyReturnFireChance).toBe(0.18);
      expect(v2.def.enemyReturnFireDamage).toEqual([7, 13]);
      expect(v2.def.enemyLineDamage).toBe(6);
    });

    it('each volley has valid narrative strings', () => {
      for (const volley of VOLTRI_VOLLEYS) {
        expect(volley.narratives.fireOrder.length).toBeGreaterThan(0);
        expect(volley.narratives.present.length).toBeGreaterThan(0);
        expect(volley.narratives.endure.length).toBeGreaterThan(0);
        expect(volley.narratives.fireHit.length).toBeGreaterThan(0);
        expect(volley.narratives.fireMiss.length).toBeGreaterThan(0);
      }
    });

    it('each volley has an events function', () => {
      for (const volley of VOLTRI_VOLLEYS) {
        expect(typeof volley.events).toBe('function');
      }
    });

    it('each volley has returnFire config with frontRankBonus', () => {
      for (const volley of VOLTRI_VOLLEYS) {
        expect(volley.returnFire).toBeDefined();
        expect(volley.returnFire!.frontRankBonus).toBe(0.1);
        expect(volley.returnFire!.fatalChance).toBe(0);
      }
    });
  });

  // ================================================================
  // ENCOUNTERS
  // ================================================================

  describe('VOLTRI_ENCOUNTERS', () => {
    it('pegli_hills encounter exists', () => {
      expect(VOLTRI_ENCOUNTERS['pegli_hills']).toBeDefined();
    });

    it('pegli_hills has Skirmish context', () => {
      expect(VOLTRI_ENCOUNTERS['pegli_hills'].context).toBe(MeleeContext.Skirmish);
    });

    it('pegli_hills has 3 opponent templates', () => {
      expect(PEGLI_ROSTER).toHaveLength(3);
      expect(VOLTRI_ENCOUNTERS['pegli_hills'].opponents).toHaveLength(3);
    });

    it('opponent templates have valid health and stamina ranges', () => {
      for (const opp of PEGLI_ROSTER) {
        expect(opp.name.length).toBeGreaterThan(0);
        expect(opp.type).toBeTruthy();
        expect(opp.health[0]).toBeLessThanOrEqual(opp.health[1]);
        expect(opp.health[0]).toBeGreaterThan(0);
        expect(opp.stamina[0]).toBeLessThanOrEqual(opp.stamina[1]);
        expect(opp.stamina[0]).toBeGreaterThan(0);
        expect(opp.strength).toBeGreaterThan(0);
        expect(opp.description.length).toBeGreaterThan(0);
      }
    });

    it('pegli_hills has maxExchanges of 8', () => {
      expect(VOLTRI_ENCOUNTERS['pegli_hills'].maxExchanges).toBe(8);
    });

    it('pegli_hills has no allies', () => {
      expect(VOLTRI_ENCOUNTERS['pegli_hills'].allies).toEqual([]);
    });

    it('pegli_hills has 1 initial and max active enemy', () => {
      expect(VOLTRI_ENCOUNTERS['pegli_hills'].initialActiveEnemies).toBe(1);
      expect(VOLTRI_ENCOUNTERS['pegli_hills'].maxActiveEnemies).toBe(1);
    });
  });

  // ================================================================
  // BATTLE CONFIG (registered in registry)
  // ================================================================

  describe('Voltri battle config', () => {
    it('config is registered with id "voltri"', () => {
      const config = getBattleConfig('voltri');
      expect(config).toBeDefined();
      expect(config.id).toBe('voltri');
    });

    it('has correct meta data', () => {
      const config = getBattleConfig('voltri');
      expect(config.meta.title).toBe('BATTLE OF VOLTRI');
      expect(config.meta.date).toBe('10 April 1796');
      expect(config.meta.playerUnit).toContain('14th');
      expect(config.meta.enemyUnit).toContain('Austrian');
    });

    it('script has correct segment types in order', () => {
      const config = getBattleConfig('voltri');
      expect(config.script.length).toBe(10);
      expect(config.script[0].type).toBe('volleys');
      expect(config.script[1].type).toBe('story_beat');
      expect(config.script[2].type).toBe('melee');
      expect(config.script[3].type).toBe('story_beat');
      expect(config.script[4].type).toBe('story_beat');
      expect(config.script[5].type).toBe('story_beat');
      expect(config.script[6].type).toBe('story_beat');
      expect(config.script[7].type).toBe('story_beat');
      expect(config.script[8].type).toBe('story_beat');
      expect(config.script[9].type).toBe('story_beat');
    });

    it('has labels for story beats', () => {
      const config = getBattleConfig('voltri');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriFixBayonets]).toBe('FIX BAYONETS');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriLineBreaks]).toBe('THE LINE BREAKS');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriCoastalRoad]).toBe('THE COASTAL ROAD');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriCavalryScare]).toBe('CAVALRY SCARE');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriDawnSavona]).toBe('DAWN AT SAVONA');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriWoundedSoldier]).toBe('THE WOUNDED SOLDIER');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriWoundedCanteen]).toBe('THE WOUNDED SOLDIER');
      expect(config.labels.storyBeats[ChargeEncounterId.VoltriHomestead]).toBe('THE HOMESTEAD');
    });

    it('has volleys, encounters, storyBeats, outcomes, opening', () => {
      const config = getBattleConfig('voltri');
      expect(config.volleys).toHaveLength(2);
      expect(config.encounters['pegli_hills']).toBeDefined();
      expect(Object.keys(config.storyBeats)).toHaveLength(8);
      expect(config.outcomes['survived']).toBeDefined();
      expect(config.outcomes['defeat_melee']).toBeDefined();
      expect(config.outcomes['defeat_line']).toBeDefined();
      expect(config.outcomes['rout']).toBeDefined();
      expect(config.opening).toBeDefined();
      expect(config.opening.narrative.length).toBeGreaterThan(50);
      expect(config.opening.splashText).toBeTruthy();
      expect(config.opening.choiceLabel).toBeTruthy();
    });

    it('has NPC roles defined', () => {
      const config = getBattleConfig('voltri');
      expect(config.roles.leftNeighbour).toBeUndefined();
      expect(config.roles.rightNeighbour).toBeUndefined();
      expect(config.roles.officer).toBe('vidal');
      expect(config.roles.nco).toBe('morin');
    });

    it('has NPCs populated from templates', () => {
      const config = getBattleConfig('voltri');
      expect(config.npcs.length).toBeGreaterThan(0);
      const ids = config.npcs.map((n) => n.id);
      expect(ids).toContain('morin');
      expect(ids).toContain('vidal');
    });

    it('init sets starting enemy state for Voltri', () => {
      const config = getBattleConfig('voltri');
      expect(config.init.enemy.range).toBe(150);
      expect(config.init.enemy.strength).toBe(100);
      expect(config.init.enemy.quality).toBe('line');
      expect(config.init.enemy.morale).toBe('advancing');
      expect(config.init.enemy.artillery).toBe(false);
      expect(config.init.enemy.cavalryThreat).toBe(false);
    });

    it('init ext has correct defaults', () => {
      const config = getBattleConfig('voltri');
      expect(config.init.ext.battlePart).toBe(1);
      expect(config.init.ext.meleeStage).toBe(0);
    });

    it('outcome text is non-empty for all outcomes', () => {
      const config = getBattleConfig('voltri');
      for (const [key, outcome] of Object.entries(config.outcomes)) {
        expect(outcome.title.length, `${key} title`).toBeGreaterThan(0);
        expect(outcome.narrative.length, `${key} narrative`).toBeGreaterThan(50);
      }
    });
  });
});
