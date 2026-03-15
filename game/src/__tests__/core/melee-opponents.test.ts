import { describe, it, expect, beforeEach } from 'vitest';
import {
  chooseMeleeAI,
  chooseAllyAI,
  chooseEnemyTarget,
  resetMeleeHistory,
} from '../../core/melee/opponents';
import { MeleeActionId, BodyPart, MeleeStance } from '../../types';
import type { MeleeOpponent, MeleeAlly } from '../../types';
import { mockBattleState } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Helpers: minimal mock objects
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
    elan: 35,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    ...overrides,
  } as MeleeOpponent;
}

function mockAlly(overrides: Partial<MeleeAlly> = {}): MeleeAlly {
  return {
    id: 'pierre',
    name: 'Pierre',
    type: 'named',
    personality: 'aggressive',
    health: 80,
    maxHealth: 80,
    stamina: 200,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 200,
    elan: 45,
    alive: true,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    ...overrides,
  } as MeleeAlly;
}

const ALL_ACTIONS = Object.values(MeleeActionId);
const ALL_BODY_PARTS = Object.values(BodyPart);

// ---------------------------------------------------------------------------
// chooseMeleeAI
// ---------------------------------------------------------------------------

describe('chooseMeleeAI', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('stunned opponents always Guard', () => {
    const opp = mockOpponent({ type: 'line', stunned: true, stunnedTurns: 1 });
    const state = mockBattleState();

    for (let i = 0; i < 50; i++) {
      const decision = chooseMeleeAI(opp, state);
      expect(decision.action).toBe(MeleeActionId.Guard);
      expect(decision.bodyPart).toBe(BodyPart.Torso);
    }
  });

  it('low stamina (<=15) opponents use Respite', () => {
    const opp = mockOpponent({ type: 'veteran', stamina: 15 });
    const state = mockBattleState();

    for (let i = 0; i < 50; i++) {
      const decision = chooseMeleeAI(opp, state);
      expect(decision.action).toBe(MeleeActionId.Respite);
      expect(decision.bodyPart).toBe(BodyPart.Torso);
    }
  });

  it('conscript at low HP (<30%) returns Respite or AggressiveLunge with expected distribution', () => {
    const opp = mockOpponent({
      type: 'conscript',
      health: 20,
      maxHealth: 80,
      // Ensure fatigue doesn't trigger SecondWind
      fatigue: 0,
      maxFatigue: 200,
    });
    const state = mockBattleState();

    let respiteCount = 0;
    let lungeCount = 0;
    const iterations = 200;

    for (let i = 0; i < iterations; i++) {
      const decision = chooseMeleeAI(opp, state);
      if (decision.action === MeleeActionId.Respite) respiteCount++;
      if (decision.action === MeleeActionId.AggressiveLunge) lungeCount++;
    }

    // Source code: 60% Respite, 40% AggressiveLunge
    // Allow generous margins for randomness
    expect(respiteCount / iterations).toBeGreaterThan(0.4);
    expect(lungeCount / iterations).toBeGreaterThan(0.2);
    // Together they should account for the vast majority of results
    expect((respiteCount + lungeCount) / iterations).toBeGreaterThan(0.9);
  });

  it('returns a valid AIDecision with action and bodyPart fields', () => {
    const types = ['conscript', 'line', 'veteran', 'sergeant'] as const;
    const state = mockBattleState();

    for (const type of types) {
      const opp = mockOpponent({ type });
      for (let i = 0; i < 30; i++) {
        const decision = chooseMeleeAI(opp, state);
        expect(decision).toHaveProperty('action');
        expect(decision).toHaveProperty('bodyPart');
        expect(ALL_ACTIONS).toContain(decision.action);
        expect(ALL_BODY_PARTS).toContain(decision.bodyPart);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// chooseAllyAI
// ---------------------------------------------------------------------------

describe('chooseAllyAI', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('targets weakest enemy across multiple iterations', () => {
    const enemies = [
      mockOpponent({ health: 80, maxHealth: 80 }),  // index 0: full HP
      mockOpponent({ health: 20, maxHealth: 80 }),  // index 1: weakest
      mockOpponent({ health: 60, maxHealth: 80 }),  // index 2: moderate
    ];
    const liveEnemyIndices = [0, 1, 2];
    const ally = mockAlly({ personality: 'aggressive' });

    const targetCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
    const iterations = 200;

    for (let i = 0; i < iterations; i++) {
      const decision = chooseAllyAI(ally, enemies, liveEnemyIndices);
      targetCounts[decision.targetIndex]++;
    }

    // The weakest enemy (index 1) should be targeted the most
    // since findWeakestEnemy is always called for all personality types
    expect(targetCounts[1]).toBeGreaterThan(targetCounts[0]);
    expect(targetCounts[1]).toBeGreaterThan(targetCounts[2]);
    // Weakest target should be picked almost exclusively (it's always the weakest)
    expect(targetCounts[1] / iterations).toBeGreaterThan(0.9);
  });

  it('stunned allies Guard', () => {
    const ally = mockAlly({ stunned: true, stunnedTurns: 1 });
    const enemies = [mockOpponent()];
    const liveEnemyIndices = [0];

    for (let i = 0; i < 50; i++) {
      const decision = chooseAllyAI(ally, enemies, liveEnemyIndices);
      expect(decision.action).toBe(MeleeActionId.Guard);
      expect(decision.bodyPart).toBe(BodyPart.Torso);
    }
  });

  it('low stamina (<=15) allies use Respite', () => {
    const ally = mockAlly({ stamina: 15 });
    const enemies = [mockOpponent()];
    const liveEnemyIndices = [0];

    for (let i = 0; i < 50; i++) {
      const decision = chooseAllyAI(ally, enemies, liveEnemyIndices);
      expect(decision.action).toBe(MeleeActionId.Respite);
      expect(decision.bodyPart).toBe(BodyPart.Torso);
    }
  });

  it('returns a valid AllyAIDecision with targetIndex in liveEnemyIndices', () => {
    const enemies = [
      mockOpponent(),
      mockOpponent({ health: 50, maxHealth: 80 }),
      mockOpponent({ health: 30, maxHealth: 80 }),
    ];
    const liveEnemyIndices = [0, 2]; // index 1 is dead
    const personalities = ['aggressive', 'balanced', 'cautious'] as const;

    for (const personality of personalities) {
      const ally = mockAlly({ personality });
      for (let i = 0; i < 30; i++) {
        const decision = chooseAllyAI(ally, enemies, liveEnemyIndices);
        expect(decision).toHaveProperty('action');
        expect(decision).toHaveProperty('bodyPart');
        expect(decision).toHaveProperty('targetIndex');
        expect(ALL_ACTIONS).toContain(decision.action);
        expect(ALL_BODY_PARTS).toContain(decision.bodyPart);
        expect(liveEnemyIndices).toContain(decision.targetIndex);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// chooseEnemyTarget
// ---------------------------------------------------------------------------

describe('chooseEnemyTarget', () => {
  beforeEach(() => {
    resetMeleeHistory();
  });

  it('returns player when no allies are alive', () => {
    const opp = mockOpponent({ type: 'line' });
    const state = mockBattleState();
    const deadAllies = [
      mockAlly({ id: 'a1', alive: false, health: 0 }),
      mockAlly({ id: 'a2', alive: true, health: 0 }),
    ];

    for (let i = 0; i < 30; i++) {
      const target = chooseEnemyTarget(opp, state.player, deadAllies);
      expect(target.type).toBe('player');
      expect(target.id).toBe('player');
      expect(target.name).toBe(state.player.name);
    }
  });

  it('sergeant targets player preferentially (>50% of the time)', () => {
    const opp = mockOpponent({ type: 'sergeant' });
    const state = mockBattleState();
    const allies = [
      mockAlly({ id: 'a1', name: 'Ally One', alive: true, health: 80, maxHealth: 80 }),
      mockAlly({ id: 'a2', name: 'Ally Two', alive: true, health: 80, maxHealth: 80 }),
    ];

    let playerTargetCount = 0;
    const iterations = 200;

    for (let i = 0; i < iterations; i++) {
      const target = chooseEnemyTarget(opp, state.player, allies);
      if (target.type === 'player') playerTargetCount++;
    }

    // Sergeant has 70% base chance to target player, plus some random picks
    // that may also land on player. Should be well above 50%.
    expect(playerTargetCount / iterations).toBeGreaterThan(0.5);
  });

  it('returns a valid EnemyTargetRef with type and name', () => {
    const types = ['conscript', 'line', 'veteran', 'sergeant'] as const;
    const state = mockBattleState();
    const allies = [
      mockAlly({ id: 'a1', name: 'Ally One', alive: true, health: 60, maxHealth: 80 }),
      mockAlly({ id: 'a2', name: 'Ally Two', alive: true, health: 40, maxHealth: 80 }),
    ];

    const validNames = new Set([state.player.name, 'Ally One', 'Ally Two']);
    const validIds = new Set(['player', 'a1', 'a2']);

    for (const type of types) {
      const opp = mockOpponent({ type });
      for (let i = 0; i < 30; i++) {
        const target = chooseEnemyTarget(opp, state.player, allies);
        expect(target).toHaveProperty('type');
        expect(target).toHaveProperty('id');
        expect(target).toHaveProperty('name');
        expect(['player', 'ally']).toContain(target.type);
        expect(validNames).toContain(target.name);
        expect(validIds).toContain(target.id);
      }
    }
  });
});
