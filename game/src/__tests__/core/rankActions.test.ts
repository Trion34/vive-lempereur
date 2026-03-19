import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MilitaryRank, DrillStep, LineActionId, MoraleThreshold } from '../../types';
import { getAvailableLineActions, hasMinRank } from '../../core/volleys/actions';
import {
  resolveAimedShot,
  resolveFireWithVolley,
  resolveSteadyYourFile,
  resolveKeepHeadDown,
  resolveConcentrateFire,
  resolveSpreadFire,
  resolveHoldFire,
  resolveCloseRanks,
  resolveDoubleTime,
  resolveAdvance,
  resolveHoldPosition,
  resolveFallBack,
  resolveRefuseFlank,
  resolveOrderDrums,
  resolveSilenceDrums,
  resolveFixBayonetsEarly,
  resolveRequestSupport,
  resolveLineAction,
} from '../../core/volleys/rankActions';
import { RIVOLI_VOLLEYS } from '../../data/battles/rivoli/volleys';
import { mockBattleState } from '../helpers/mockFactories';

// ============================================================
// hasMinRank
// ============================================================

describe('hasMinRank', () => {
  it('Private has no rank above Private', () => {
    expect(hasMinRank(MilitaryRank.Private, MilitaryRank.Corporal)).toBe(false);
    expect(hasMinRank(MilitaryRank.Private, MilitaryRank.Private)).toBe(true);
  });

  it('Corporal meets Corporal requirement', () => {
    expect(hasMinRank(MilitaryRank.Corporal, MilitaryRank.Corporal)).toBe(true);
    expect(hasMinRank(MilitaryRank.Corporal, MilitaryRank.Sergeant)).toBe(false);
  });

  it('Captain meets all requirements', () => {
    expect(hasMinRank(MilitaryRank.Captain, MilitaryRank.Private)).toBe(true);
    expect(hasMinRank(MilitaryRank.Captain, MilitaryRank.Captain)).toBe(true);
  });

  it('Sergeant meets Corporal and Sergeant but not Lieutenant', () => {
    expect(hasMinRank(MilitaryRank.Sergeant, MilitaryRank.Corporal)).toBe(true);
    expect(hasMinRank(MilitaryRank.Sergeant, MilitaryRank.Sergeant)).toBe(true);
    expect(hasMinRank(MilitaryRank.Sergeant, MilitaryRank.Lieutenant)).toBe(false);
  });
});

// ============================================================
// getAvailableLineActions
// ============================================================

describe('getAvailableLineActions', () => {
  it('returns empty for Private', () => {
    const state = mockBattleState({ playerRank: MilitaryRank.Private });
    expect(getAvailableLineActions(state, DrillStep.Fire)).toEqual([]);
    expect(getAvailableLineActions(state, DrillStep.Endure)).toEqual([]);
    expect(getAvailableLineActions(state, DrillStep.Present)).toEqual([]);
    expect(getAvailableLineActions(state, DrillStep.Load)).toEqual([]);
  });

  it('returns empty for Part 3 (gorge uses separate system)', () => {
    const state = mockBattleState({ playerRank: MilitaryRank.Captain, battlePart: 3 });
    expect(getAvailableLineActions(state, DrillStep.Fire)).toEqual([]);
  });

  describe('Corporal', () => {
    it('gets FIRE choices: AimedShot + FireWithVolley', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Corporal });
      const actions = getAvailableLineActions(state, DrillStep.Fire);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.AimedShot);
      expect(ids).toContain(LineActionId.FireWithVolley);
    });

    it('gets ENDURE choices: SteadyYourFile + KeepHeadDown', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Corporal });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.SteadyYourFile);
      expect(ids).toContain(LineActionId.KeepHeadDown);
    });

    it('gets no PRESENT or LOAD choices', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Corporal });
      expect(getAvailableLineActions(state, DrillStep.Present)).toEqual([]);
      expect(getAvailableLineActions(state, DrillStep.Load)).toEqual([]);
    });
  });

  describe('Sergeant', () => {
    it('gets PRESENT choices including fire direction', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Sergeant });
      const actions = getAvailableLineActions(state, DrillStep.Present);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.ConcentrateFire);
      expect(ids).toContain(LineActionId.SpreadFire);
      expect(ids).toContain(LineActionId.HoldFire);
    });

    it('cannot hold fire if held volley bonus already active', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Sergeant,
        rankState: {
          heldVolleyBonus: true,
          refuseFlankTurns: 0,
          holdCount: 0,
          fixedBayonetsEarly: false,
          requestSupportCooldown: 0,
          refuseFlankUsed: false,
          rangeModifier: 0,
        },
      });
      const actions = getAvailableLineActions(state, DrillStep.Present);
      const ids = actions.map((a) => a.id);
      expect(ids).not.toContain(LineActionId.HoldFire);
      expect(ids).toContain(LineActionId.ConcentrateFire);
      expect(ids).toContain(LineActionId.SpreadFire);
    });

    it('gets LOAD choice: DoubleTime', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Sergeant });
      const actions = getAvailableLineActions(state, DrillStep.Load);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.DoubleTime);
    });

    it('gets ENDURE: CloseRanks in addition to Corporal actions', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Sergeant });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.CloseRanks);
      expect(ids).toContain(LineActionId.SteadyYourFile);
      expect(ids).toContain(LineActionId.KeepHeadDown);
    });
  });

  describe('Lieutenant', () => {
    it('gets movement PRESENT choices', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Lieutenant });
      const actions = getAvailableLineActions(state, DrillStep.Present);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.Advance);
      expect(ids).toContain(LineActionId.HoldPosition);
      expect(ids).toContain(LineActionId.FallBack);
      // Also inherits sergeant choices
      expect(ids).toContain(LineActionId.ConcentrateFire);
    });

    it('gets RefuseFlank only when integrity < 60 and not used', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Lieutenant,
        line: {
          ...mockBattleState().line,
          lineIntegrity: 55, // < 60
        },
      });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.RefuseFlank);
    });

    it('does not get RefuseFlank when integrity >= 60', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Lieutenant,
        line: {
          ...mockBattleState().line,
          lineIntegrity: 70,
        },
      });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      expect(ids).not.toContain(LineActionId.RefuseFlank);
    });

    it('does not get RefuseFlank when already used', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Lieutenant,
        line: {
          ...mockBattleState().line,
          lineIntegrity: 55,
        },
        rankState: {
          ...mockBattleState().rankState,
          refuseFlankUsed: true,
        },
      });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      expect(ids).not.toContain(LineActionId.RefuseFlank);
    });
  });

  describe('Captain', () => {
    it('gets all PRESENT choices', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Captain });
      const actions = getAvailableLineActions(state, DrillStep.Present);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.HoldHoldFire);
      expect(ids).toContain(LineActionId.Advance);
      expect(ids).toContain(LineActionId.ConcentrateFire);
    });

    it('gets FIRE doctrine choices', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Captain });
      const actions = getAvailableLineActions(state, DrillStep.Fire);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.FireByRank);
      expect(ids).toContain(LineActionId.FireAtWill);
      expect(ids).toContain(LineActionId.StandardVolley);
      // Also inherits Corporal
      expect(ids).toContain(LineActionId.AimedShot);
    });

    it('gets drum control at ENDURE', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Captain });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      // drums are playing by default
      expect(ids).toContain(LineActionId.SilenceDrums);
      expect(ids).not.toContain(LineActionId.OrderDrums);
    });

    it('gets OrderDrums when drums are off', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Captain,
        line: { ...mockBattleState().line, drumsPlaying: false },
      });
      const actions = getAvailableLineActions(state, DrillStep.Endure);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.OrderDrums);
      expect(ids).not.toContain(LineActionId.SilenceDrums);
    });

    it('gets strategic orders at LOAD', () => {
      const state = mockBattleState({ playerRank: MilitaryRank.Captain });
      const actions = getAvailableLineActions(state, DrillStep.Load);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(LineActionId.FixBayonetsEarly);
      expect(ids).toContain(LineActionId.RequestSupport);
      expect(ids).toContain(LineActionId.DoubleTime); // inherited
    });

    it('hides FixBayonets after use', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Captain,
        rankState: { ...mockBattleState().rankState, fixedBayonetsEarly: true },
      });
      const actions = getAvailableLineActions(state, DrillStep.Load);
      const ids = actions.map((a) => a.id);
      expect(ids).not.toContain(LineActionId.FixBayonetsEarly);
    });

    it('hides RequestSupport on cooldown', () => {
      const state = mockBattleState({
        playerRank: MilitaryRank.Captain,
        rankState: { ...mockBattleState().rankState, requestSupportCooldown: 2 },
      });
      const actions = getAvailableLineActions(state, DrillStep.Load);
      const ids = actions.map((a) => a.id);
      expect(ids).not.toContain(LineActionId.RequestSupport);
    });
  });
});

// ============================================================
// RESOLVER FUNCTIONS
// ============================================================

describe('Rank action resolvers', () => {
  let state: ReturnType<typeof mockBattleState>;

  beforeEach(() => {
    state = mockBattleState({
      playerRank: MilitaryRank.Captain,
      scriptedVolley: 1,
    });
  });

  describe('Corporal actions', () => {
    it('resolveAimedShot sets musket unloaded and increments volleysFired', () => {
      const initialVolleys = state.volleysFired;
      resolveAimedShot(state, RIVOLI_VOLLEYS);
      expect(state.player.musketLoaded).toBe(false);
      expect(state.volleysFired).toBe(initialVolleys + 1);
    });

    it('resolveAimedShot returns log and moraleChanges', () => {
      const result = resolveAimedShot(state, RIVOLI_VOLLEYS);
      expect(result.log.length).toBeGreaterThan(0);
      expect(result.moraleChanges.length).toBeGreaterThan(0);
    });

    it('resolveFireWithVolley delegates to standard fire', () => {
      const result = resolveFireWithVolley(state, RIVOLI_VOLLEYS);
      expect(result.log.length).toBeGreaterThan(0);
      expect(state.player.musketLoaded).toBe(false);
    });

    it('resolveSteadyYourFile costs 5 stamina', () => {
      const initial = state.player.stamina;
      resolveSteadyYourFile(state);
      expect(state.player.stamina).toBe(initial - 5);
    });

    it('resolveSteadyYourFile produces log output', () => {
      const result = resolveSteadyYourFile(state);
      expect(result.log.length).toBeGreaterThan(0);
    });

    it('resolveKeepHeadDown is a no-op that returns log', () => {
      const result = resolveKeepHeadDown(state);
      expect(result.log.length).toBeGreaterThan(0);
      expect(result.moraleChanges).toEqual([]);
    });
  });

  describe('Sergeant actions', () => {
    it('resolveConcentrateFire sets enemyDamageModifier', () => {
      const result = resolveConcentrateFire(state);
      expect(result.enemyDamageModifier).toBe(0.3);
      expect(result.integrityModifier).toBe(-2);
    });

    it('resolveSpreadFire is standard (no modifiers)', () => {
      const result = resolveSpreadFire(state);
      expect(result.enemyDamageModifier).toBeUndefined();
    });

    it('resolveHoldFire sets heldVolleyBonus and skips fire', () => {
      resolveHoldFire(state);
      expect(state.rankState.heldVolleyBonus).toBe(true);
    });

    it('resolveHoldFire returns skipFire: true', () => {
      const result = resolveHoldFire(state);
      expect(result.skipFire).toBe(true);
    });

    it('resolveCloseRanks costs 8 stamina and returns halve modifier', () => {
      const initial = state.player.stamina;
      const result = resolveCloseRanks(state);
      expect(state.player.stamina).toBe(initial - 8);
      expect(result.integrityModifier).toBe(0.5);
    });

    it('resolveDoubleTime costs 6 stamina and returns guaranteedLoad', () => {
      const initial = state.player.stamina;
      const result = resolveDoubleTime(state);
      expect(state.player.stamina).toBe(initial - 6);
      expect(result.guaranteedLoad).toBe(true);
    });
  });

  describe('Lieutenant actions', () => {
    it('resolveAdvance costs 10 stamina and sets negative range modifier', () => {
      const initial = state.player.stamina;
      resolveAdvance(state);
      expect(state.player.stamina).toBe(initial - 10);
      expect(state.rankState.rangeModifier).toBe(-40);
    });

    it('resolveHoldPosition resets range modifier', () => {
      state.rankState.rangeModifier = -40;
      resolveHoldPosition(state);
      expect(state.rankState.rangeModifier).toBe(0);
    });

    it('resolveFallBack costs 5 stamina and sets positive range modifier', () => {
      const initial = state.player.stamina;
      resolveFallBack(state);
      expect(state.player.stamina).toBe(initial - 5);
      expect(state.rankState.rangeModifier).toBe(40);
    });

    it('resolveRefuseFlank sets 2 turns and marks used', () => {
      resolveRefuseFlank(state);
      expect(state.rankState.refuseFlankTurns).toBe(2);
      expect(state.rankState.refuseFlankUsed).toBe(true);
    });
  });

  describe('Captain actions', () => {
    it('resolveOrderDrums turns drums on', () => {
      state.line.drumsPlaying = false;
      resolveOrderDrums(state);
      expect(state.line.drumsPlaying).toBe(true);
    });

    it('resolveSilenceDrums turns drums off', () => {
      state.line.drumsPlaying = true;
      resolveSilenceDrums(state);
      expect(state.line.drumsPlaying).toBe(false);
    });

    it('resolveFixBayonetsEarly sets the flag', () => {
      resolveFixBayonetsEarly(state);
      expect(state.rankState.fixedBayonetsEarly).toBe(true);
    });

    it('resolveRequestSupport sets cooldown and boosts integrity', () => {
      const initial = state.line.lineIntegrity;
      resolveRequestSupport(state);
      expect(state.rankState.requestSupportCooldown).toBe(3);
      expect(state.line.lineIntegrity).toBe(initial + 5);
    });
  });

  describe('resolveLineAction dispatcher', () => {
    it('dispatches all LineActionId values without throwing', () => {
      const allIds = Object.values(LineActionId);
      for (const id of allIds) {
        const s = mockBattleState({
          playerRank: MilitaryRank.Captain,
          scriptedVolley: 1,
        });
        const result = resolveLineAction(s, id, RIVOLI_VOLLEYS);
        expect(result).toBeDefined();
        expect(result.log).toBeDefined();
        expect(result.moraleChanges).toBeDefined();
      }
    });
  });
});
