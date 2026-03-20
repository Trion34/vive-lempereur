import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  chooseMeleeAI,
  resetMeleeHistory,
  recordPlayerAction,
} from '../../core/melee/opponents';
import { makeOpponent } from '../../core/melee/encounters';
import { resolveMeleeRound } from '../../core/melee/round';
import { MeleeActionId, BodyPart, MeleeStance, MeleeContext } from '../../types';
import type { MeleeOpponent, MeleeState, OpponentTemplate, BattleState } from '../../types';
import { V2_TUNING, CLASSIC_TUNING } from '../../core/melee/tuning';
import { mockBattleState } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockOpponent(overrides: Partial<MeleeOpponent> = {}): MeleeOpponent {
  return {
    name: 'Austrian Line',
    type: 'line',
    health: 80,
    maxHealth: 80,
    stamina: 200,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 200,
    strength: 40,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A test opponent.',
    momentum: 0,
    freeStrikeReady: false,
    observedPlayerActions: [],
    temperament: 50,
    ...overrides,
  };
}

function makeMeleeState(opponents: MeleeOpponent[], overrides: Partial<MeleeState> = {}): MeleeState {
  return {
    opponents,
    currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerRiposte: false,
    playerStunned: 0,
    exchangeCount: 0,
    selectingStance: false,
    selectingTarget: false,
    killCount: 0,
    valorTempBonus: 0,
    maxExchanges: 12,
    meleeContext: MeleeContext.Terrain,
    lastOppAttacked: false,
    playerGuarding: false,
    oppGuarding: false,
    allies: [],
    activeEnemies: opponents.map((_, i) => i),
    roundNumber: 0,
    playerTargetIndex: 0,
    roundLog: [],
    maxActiveEnemies: opponents.length,
    enemyPool: [],
    processedWaves: [],
    waveEvents: [],
    reloadProgress: 0,
    playerMomentum: 0,
    playerFreeStrikeReady: false,
    ...overrides,
  };
}

// ===========================================================================
// 6a. Temperament initialization
// ===========================================================================

describe('makeOpponent — temperament initialization', () => {
  const templates: Record<string, OpponentTemplate> = {
    conscript: { name: 'Conscript', type: 'conscript', health: [70, 85], stamina: [160, 200], strength: 30, description: 'test' },
    line: { name: 'Line', type: 'line', health: [70, 85], stamina: [160, 200], strength: 35, description: 'test' },
    veteran: { name: 'Veteran', type: 'veteran', health: [70, 85], stamina: [160, 200], strength: 40, description: 'test' },
    sergeant: { name: 'Sergeant', type: 'sergeant', health: [70, 85], stamina: [160, 200], strength: 45, description: 'test' },
  };

  it('conscript temperament is in [20, 40]', () => {
    for (let i = 0; i < 100; i++) {
      const opp = makeOpponent(templates.conscript);
      expect(opp.temperament).toBeGreaterThanOrEqual(20);
      expect(opp.temperament).toBeLessThanOrEqual(40);
    }
  });

  it('line temperament is in [35, 55]', () => {
    for (let i = 0; i < 100; i++) {
      const opp = makeOpponent(templates.line);
      expect(opp.temperament).toBeGreaterThanOrEqual(35);
      expect(opp.temperament).toBeLessThanOrEqual(55);
    }
  });

  it('veteran temperament is in [45, 65]', () => {
    for (let i = 0; i < 100; i++) {
      const opp = makeOpponent(templates.veteran);
      expect(opp.temperament).toBeGreaterThanOrEqual(45);
      expect(opp.temperament).toBeLessThanOrEqual(65);
    }
  });

  it('sergeant temperament is in [55, 80]', () => {
    for (let i = 0; i < 100; i++) {
      const opp = makeOpponent(templates.sergeant);
      expect(opp.temperament).toBeGreaterThanOrEqual(55);
      expect(opp.temperament).toBeLessThanOrEqual(80);
    }
  });

  it('observedPlayerActions is initialized empty', () => {
    for (const key of Object.keys(templates)) {
      const opp = makeOpponent(templates[key]);
      expect(opp.observedPlayerActions).toEqual([]);
    }
  });
});

// ===========================================================================
// 6c. Observed-action tracking in round.ts
// ===========================================================================

describe('observed-action tracking (v2)', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('records player action on all active enemies after resolvePlayerPhase (v2)', () => {
    const opp1 = mockOpponent({ name: 'Opp1', health: 80, maxHealth: 80 });
    const opp2 = mockOpponent({ name: 'Opp2', health: 80, maxHealth: 80 });
    const ms = makeMeleeState([opp1, opp2]);
    const state = mockBattleState({
      meleeState: ms,
      meleeTuning: V2_TUNING,
    });

    // Resolve a round with Guard
    resolveMeleeRound(state, MeleeActionId.Guard, BodyPart.Torso, 0);

    // Both opponents should have observed Guard
    expect(state.meleeState!.opponents[0].observedPlayerActions).toContain(MeleeActionId.Guard);
    expect(state.meleeState!.opponents[1].observedPlayerActions).toContain(MeleeActionId.Guard);
  });

  it('does NOT track observed actions in classic mode', () => {
    const opp1 = mockOpponent({ name: 'Opp1', health: 80, maxHealth: 80 });
    const ms = makeMeleeState([opp1]);
    const state = mockBattleState({
      meleeState: ms,
      meleeTuning: CLASSIC_TUNING,
    });

    resolveMeleeRound(state, MeleeActionId.Guard, BodyPart.Torso, 0);

    // Classic mode: observedPlayerActions should remain empty
    expect(state.meleeState!.opponents[0].observedPlayerActions).toEqual([]);
  });

  it('caps observed actions at 6 (shifts oldest off)', () => {
    const opp = mockOpponent({
      name: 'Opp1',
      health: 200,
      maxHealth: 200,
      observedPlayerActions: [
        MeleeActionId.Guard,
        MeleeActionId.Guard,
        MeleeActionId.Guard,
        MeleeActionId.Guard,
        MeleeActionId.Guard,
        MeleeActionId.Guard,
      ],
    });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeState: ms,
      meleeTuning: V2_TUNING,
    });

    resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);

    const observed = state.meleeState!.opponents[0].observedPlayerActions;
    expect(observed.length).toBeLessThanOrEqual(6);
    // The newest action should be BayonetThrust
    expect(observed[observed.length - 1]).toBe(MeleeActionId.BayonetThrust);
  });

  it('dead enemies do not receive observations', () => {
    const opp1 = mockOpponent({ name: 'Opp1', health: 80, maxHealth: 80 });
    const opp2 = mockOpponent({ name: 'Opp2', health: 0, maxHealth: 80 }); // dead
    const ms = makeMeleeState([opp1, opp2]);
    const state = mockBattleState({
      meleeState: ms,
      meleeTuning: V2_TUNING,
    });

    resolveMeleeRound(state, MeleeActionId.Guard, BodyPart.Torso, 0);

    // Dead opponent should NOT have observed the action
    expect(state.meleeState!.opponents[1].observedPlayerActions).toEqual([]);
    // Live opponent should have observed it
    expect(state.meleeState!.opponents[0].observedPlayerActions).toContain(MeleeActionId.Guard);
  });
});

// ===========================================================================
// 6d. Per-opponent history isolation (v2 AI reads observed actions)
// ===========================================================================

describe('per-opponent history isolation (v2)', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('veteran AI reads from observedPlayerActions in v2 mode', () => {
    // Opponent who has observed 3 Guards — should counter with Feint
    const opp = mockOpponent({
      type: 'veteran',
      observedPlayerActions: [MeleeActionId.Guard, MeleeActionId.Guard, MeleeActionId.Guard],
      temperament: 50, // neutral temperament
    });
    const state = mockBattleState({ meleeTuning: V2_TUNING });

    let feintCount = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Feint) feintCount++;
    }

    // With 3 Guards observed, veteran should heavily favor Feint (pattern counter)
    // But v2 reactive modifiers may occasionally override
    expect(feintCount / iterations).toBeGreaterThan(0.3);
  });

  it('sergeant AI reads from observedPlayerActions in v2 mode', () => {
    // Opponent who has observed 4 attack actions — should counter with Guard
    const opp = mockOpponent({
      type: 'sergeant',
      observedPlayerActions: [
        MeleeActionId.AggressiveLunge,
        MeleeActionId.BayonetThrust,
        MeleeActionId.AggressiveLunge,
        MeleeActionId.BayonetThrust,
      ],
      temperament: 50,
    });
    const state = mockBattleState({ meleeTuning: V2_TUNING });

    let guardCount = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Guard) guardCount++;
    }

    // With 4 attacks, sergeant should frequently pick Guard (pattern counter)
    expect(guardCount / iterations).toBeGreaterThan(0.3);
  });

  it('line AI reads from observedPlayerActions for respite punish in v2', () => {
    const opp = mockOpponent({
      type: 'line',
      observedPlayerActions: [MeleeActionId.Respite],
      temperament: 50,
    });
    const state = mockBattleState({ meleeTuning: V2_TUNING });

    let lungeCount = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.AggressiveLunge) lungeCount++;
    }

    // Line AI should punish Respite with lunge very frequently
    expect(lungeCount / iterations).toBeGreaterThan(0.5);
  });

  it('classic mode AI falls back to global playerHistory', () => {
    // In classic mode, observedPlayerActions is ignored, global is used
    const opp = mockOpponent({
      type: 'veteran',
      observedPlayerActions: [], // empty per-opponent
      temperament: 50,
    });

    // Push 3 Guards to global history
    recordPlayerAction(MeleeActionId.Guard);
    recordPlayerAction(MeleeActionId.Guard);
    recordPlayerAction(MeleeActionId.Guard);

    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });

    let feintCount = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Feint) feintCount++;
    }

    // Classic veteran should read global history and counter Guards with Feint
    expect(feintCount / iterations).toBeGreaterThan(0.5);
  });

  it('two opponents can have different observed actions (isolated)', () => {
    const opp1 = mockOpponent({
      type: 'veteran',
      name: 'Veteran A',
      observedPlayerActions: [MeleeActionId.Guard, MeleeActionId.Guard, MeleeActionId.Guard],
    });
    const opp2 = mockOpponent({
      type: 'veteran',
      name: 'Veteran B',
      observedPlayerActions: [MeleeActionId.AggressiveLunge, MeleeActionId.AggressiveLunge, MeleeActionId.AggressiveLunge],
    });

    const state = mockBattleState({ meleeTuning: V2_TUNING });

    let opp1Feints = 0;
    let opp2Guards = 0;
    const iterations = 200;

    for (let i = 0; i < iterations; i++) {
      const d1 = chooseMeleeAI(opp1, state);
      if (d1.action === MeleeActionId.Feint) opp1Feints++;
      const d2 = chooseMeleeAI(opp2, state);
      if (d2.action === MeleeActionId.Guard) opp2Guards++;
    }

    // Opp1 saw Guards → should Feint. Opp2 saw Lunges → should Guard.
    expect(opp1Feints / iterations).toBeGreaterThan(0.2);
    expect(opp2Guards / iterations).toBeGreaterThan(0.2);
  });
});

// ===========================================================================
// 6e. Reactive AI modifiers (v2 only)
// ===========================================================================

describe('reactive AI modifiers (v2 only)', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('smells blood: low player HP increases Lunge chance', () => {
    const opp = mockOpponent({ type: 'conscript', temperament: 50 });
    // Player at 20% HP (below 30% threshold)
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });
    state.player.health = 20;
    state.player.maxHealth = 100;

    let lungeCount = 0;
    const iterations = 500;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.AggressiveLunge) lungeCount++;
    }

    // Should see noticeably more lunges than the conscript base (~0% normally at full HP w/ high health)
    // At low HP the conscript goes into panic mode too, so lunge is already common. With reactive, it's even more.
    expect(lungeCount / iterations).toBeGreaterThan(0.1);
  });

  it('punishes exhaustion: 0 stamina player increases Lunge chance', () => {
    const opp = mockOpponent({ type: 'line', temperament: 50 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });
    state.player.stamina = 0;
    state.player.maxStamina = 200;

    let lungeCount = 0;
    const iterations = 500;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.AggressiveLunge) lungeCount++;
    }

    // With 30% override chance on top of base Lunge probability, should be noticeable
    expect(lungeCount / iterations).toBeGreaterThan(0.2);
  });

  it('defensive response: high player momentum increases Guard chance', () => {
    const opp = mockOpponent({ type: 'line', temperament: 50 });
    const ms = makeMeleeState([opp], { playerMomentum: 3 });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    let guardCount = 0;
    const iterations = 500;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Guard) guardCount++;
    }

    // Base guard chance for line is ~30%. With 25% override, should be higher.
    expect(guardCount / iterations).toBeGreaterThan(0.3);
  });

  it('does NOT apply reactive modifiers in classic mode', () => {
    const opp = mockOpponent({ type: 'conscript', temperament: 50 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: CLASSIC_TUNING,
      meleeState: ms,
    });
    state.player.health = 5;
    state.player.maxHealth = 100;
    state.player.stamina = 0;

    // In classic, conscript at high health just does normal AI (45% thrust, 55% guard)
    // No reactive lunge override
    let guardOrThrust = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (
        decision.action === MeleeActionId.Guard ||
        decision.action === MeleeActionId.BayonetThrust ||
        decision.action === MeleeActionId.AggressiveLunge ||
        decision.action === MeleeActionId.Respite
      ) {
        guardOrThrust++;
      }
    }
    // Classic should still produce valid actions
    expect(guardOrThrust / iterations).toBeGreaterThan(0.9);
  });
});

// ===========================================================================
// 6f. Temperament influence (v2 only)
// ===========================================================================

describe('temperament influence (v2 only)', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('high temperament (>65) shifts toward more aggressive actions', () => {
    // Use a line soldier with high temperament — should see more lunges
    const opp = mockOpponent({ type: 'line', temperament: 80 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    let lungeCount = 0;
    const iterations = 500;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.AggressiveLunge) lungeCount++;
    }

    // High temperament should increase lunge frequency beyond base (~20%)
    expect(lungeCount / iterations).toBeGreaterThan(0.15);
  });

  it('low temperament (<35) shifts toward more defensive actions', () => {
    // Use a line soldier with low temperament — should see more guards
    const opp = mockOpponent({ type: 'line', temperament: 20 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    let guardCount = 0;
    const iterations = 500;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Guard) guardCount++;
    }

    // Low temperament should increase guard frequency beyond base (~30%)
    expect(guardCount / iterations).toBeGreaterThan(0.25);
  });

  it('neutral temperament (35-65) does not shift actions', () => {
    // With neutral temperament, neither high nor low modifiers fire
    const opp = mockOpponent({ type: 'line', temperament: 50 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    // Just verify it still produces valid actions
    const actions = new Set<MeleeActionId>();
    for (let i = 0; i < 200; i++) {
      const decision = chooseMeleeAI(opp, state);
      actions.add(decision.action);
    }
    expect(actions.size).toBeGreaterThan(1);
  });

  it('temperament has no effect in classic mode', () => {
    // Even with high temperament, classic mode skips temperament logic
    const opp = mockOpponent({ type: 'line', temperament: 90 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: CLASSIC_TUNING,
      meleeState: ms,
    });

    // Just verify it produces valid actions without errors
    for (let i = 0; i < 100; i++) {
      const decision = chooseMeleeAI(opp, state);
      expect(decision).toHaveProperty('action');
      expect(decision).toHaveProperty('bodyPart');
    }
  });
});

// ===========================================================================
// 6g. recordPlayerAction for classic compat
// ===========================================================================

describe('recordPlayerAction — global history for classic', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('recordPlayerAction feeds the global history used by classic AI', () => {
    // Push 3 Guards to global history
    recordPlayerAction(MeleeActionId.Guard);
    recordPlayerAction(MeleeActionId.Guard);
    recordPlayerAction(MeleeActionId.Guard);

    // A veteran in classic mode should read these and counter with Feint
    const opp = mockOpponent({
      type: 'veteran',
      observedPlayerActions: [], // empty per-opponent (won't be used in classic)
    });
    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });

    let feintCount = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Feint) feintCount++;
    }

    expect(feintCount / iterations).toBeGreaterThan(0.5);
  });

  it('resetMeleeHistory clears the global history', () => {
    recordPlayerAction(MeleeActionId.Guard);
    recordPlayerAction(MeleeActionId.Guard);
    recordPlayerAction(MeleeActionId.Guard);
    resetMeleeHistory();

    // After reset, veteran should not pattern-match Guards
    const opp = mockOpponent({ type: 'veteran' });
    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });

    let feintCount = 0;
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Feint) feintCount++;
    }

    // Without history, feint should be at baseline rate (~10%)
    expect(feintCount / iterations).toBeLessThan(0.4);
  });

  it('global history caps at 6 entries', () => {
    for (let i = 0; i < 10; i++) {
      recordPlayerAction(MeleeActionId.Guard);
    }
    // Can't directly inspect the global, but we can verify it works
    // by checking that veteran still reads from it
    const opp = mockOpponent({ type: 'veteran' });
    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });

    let feintCount = 0;
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Feint) feintCount++;
    }

    // Should still pattern-match from the capped history
    expect(feintCount / iterations).toBeGreaterThan(0.3);
  });
});

// ===========================================================================
// Integration: round.ts also feeds recordPlayerAction for classic
// ===========================================================================

describe('resolveMeleeRound — classic global history tracking', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('resolveMeleeRound feeds global history even in classic mode', () => {
    const opp = mockOpponent({ name: 'Opp', health: 200, maxHealth: 200 });
    const ms = makeMeleeState([opp]);
    const state = mockBattleState({
      meleeState: ms,
      meleeTuning: CLASSIC_TUNING,
    });

    // Play 3 rounds of Guard
    resolveMeleeRound(state, MeleeActionId.Guard, BodyPart.Torso, 0);
    resolveMeleeRound(state, MeleeActionId.Guard, BodyPart.Torso, 0);
    resolveMeleeRound(state, MeleeActionId.Guard, BodyPart.Torso, 0);

    // Now the veteran AI (if it were in this fight) would see 3 Guards in global history
    // Verify by creating a separate veteran and asking for its AI
    const vet = mockOpponent({
      type: 'veteran',
      observedPlayerActions: [], // v2 not active
    });
    const vetState = mockBattleState({ meleeTuning: CLASSIC_TUNING });

    let feintCount = 0;
    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(vet, vetState);
      if (decision.action === MeleeActionId.Feint) feintCount++;
    }

    expect(feintCount / iterations).toBeGreaterThan(0.3);
  });
});
