import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveGenericAttack } from '../../core/melee/genericAttack';
import type { CombatantRef } from '../../core/melee/effects';
import { ACTION_DEFS, BASE_HIT_RATES, BODY_PART_DEFS } from '../../core/melee/effects';
import { MeleeActionId, BodyPart, MeleeStance } from '../../types';
import type { MeleeOpponent, MeleeAlly } from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePlayerRef(overrides: Partial<CombatantRef> = {}): CombatantRef {
  return {
    name: 'Jean-Pierre Duval',
    health: 100,
    maxHealth: 125,
    stamina: 200,
    maxStamina: 400,
    fatigue: 0,
    maxFatigue: 200,
    morale: 80,
    maxMorale: 100,
    strength: 40,
    elan: 35,
    musketry: 35,
    type: 'player',
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    ...overrides,
  };
}

function makeEnemyRef(
  type: string = 'conscript',
  overrides: Partial<CombatantRef> = {},
): CombatantRef {
  return {
    name: 'Austrian conscript — Hans Vogl',
    health: 80,
    maxHealth: 80,
    stamina: 180,
    maxStamina: 180,
    fatigue: 0,
    maxFatigue: 180,
    morale: 80,
    maxMorale: 80,
    strength: 40,
    elan: 35,
    musketry: 30,
    type,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    ...overrides,
  };
}

function makeAllyRef(overrides: Partial<CombatantRef> = {}): CombatantRef {
  return {
    name: 'Pierre Lenoir',
    health: 90,
    maxHealth: 100,
    stamina: 180,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 180,
    morale: 100,
    maxMorale: 100,
    strength: 40,
    elan: 45,
    musketry: 30,
    type: 'ally',
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    ...overrides,
  };
}

function makeOpponentMut(overrides: Partial<MeleeOpponent> = {}): MeleeOpponent {
  return {
    name: 'Austrian conscript — Hans Vogl',
    type: 'conscript',
    health: 80,
    maxHealth: 80,
    stamina: 180,
    maxStamina: 180,
    fatigue: 0,
    maxFatigue: 180,
    strength: 40,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A test opponent.',
    ...overrides,
  };
}

function makeAllyMut(overrides: Partial<MeleeAlly> = {}): MeleeAlly {
  return {
    id: 'pierre',
    name: 'Pierre Lenoir',
    type: 'named',
    health: 90,
    maxHealth: 100,
    stamina: 180,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 180,
    strength: 40,
    elan: 45,
    alive: true,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A test ally.',
    personality: 'cautious',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

let randomSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  randomSpy = vi.spyOn(Math, 'random');
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// resolveGenericAttack
// ===========================================================================
describe('resolveGenericAttack', () => {
  // =========================================================================
  // 1. Non-attack actions return early (no damage)
  // =========================================================================
  describe('non-attack actions', () => {
    it('Respite returns early with no damage and a log entry', () => {
      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.Respite,
        BodyPart.Torso,
        1,
        { side: 'player' },
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.staminaDrain).toBe(0);
      expect(result.fatigueDrain).toBe(0);
      expect(result.targetKilled).toBe(false);
      expect(result.log).toHaveLength(1);
      expect(result.log[0].text).toContain('catches breath');
      expect(result.roundAction.action).toBe(MeleeActionId.Respite);
      expect(result.roundAction.hit).toBe(false);
    });

    it('Guard returns early with no damage and a log entry', () => {
      const attacker = makeEnemyRef();
      const target = makePlayerRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.Guard,
        BodyPart.Torso,
        2,
        { side: 'enemy', targetSide: 'player' },
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.log).toHaveLength(1);
      expect(result.log[0].text).toContain('guards');
      expect(result.roundAction.action).toBe(MeleeActionId.Guard);
    });

    it('any non-attack action (Reload) returns early with empty log', () => {
      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.Reload,
        BodyPart.Torso,
        3,
        { side: 'player' },
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.log).toHaveLength(0);
      expect(result.roundAction.hit).toBe(false);
    });
  });

  // =========================================================================
  // 2. Hit calculation per combatant type
  // =========================================================================
  describe('hit calculation by combatant type', () => {
    it('player attacker uses calcHitChance when stance is provided', () => {
      // Force a hit (Math.random returns 0 which is always < any positive hitChance)
      randomSpy.mockReturnValue(0);

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        makeOpponentMut(),
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBeGreaterThan(0);
    });

    it('ally attacker uses elan-based hit formula', () => {
      // Ally with elan=45: baseHit = 0.4 + 45/200 = 0.625
      // BayonetThrust hitBonus = 0, Torso hitMod = 0, no arm penalty
      // hitChance = min(0.8, max(0.1, 0.625)) = 0.625, then clamped by fatigue bonus
      // Force a hit:
      randomSpy.mockReturnValue(0);

      const attacker = makeAllyRef({ elan: 45 });
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        makeOpponentMut(),
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'ally', targetSide: 'enemy' },
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBeGreaterThan(0);
    });

    it('enemy (conscript) attacker uses BASE_HIT_RATES for conscript', () => {
      // conscript base hit: 0.35, BayonetThrust hitBonus = 0, Torso hitMod = 0
      // hitChance = min(0.85, max(0.15, 0.35)) = 0.35
      // Force a miss: Math.random returns 0.99 > 0.35
      randomSpy.mockReturnValue(0.99);

      const attacker = makeEnemyRef('conscript');
      const target = makePlayerRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
    });

    it('enemy (veteran) has higher hit rate than conscript', () => {
      // Both fresh, no injuries, Torso, BayonetThrust
      // Conscript: 0.35, Veteran: 0.55
      // Use random = 0.50 => conscript misses, veteran hits
      randomSpy.mockReturnValue(0.50);

      const conscriptAttacker = makeEnemyRef('conscript');
      const veteranAttacker = makeEnemyRef('veteran', { name: 'Vet — Karl' });
      const target = makePlayerRef();

      const conscriptResult = resolveGenericAttack(
        conscriptAttacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      // Reset mock for the second call
      randomSpy.mockReturnValue(0.50);

      const veteranResult = resolveGenericAttack(
        veteranAttacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      expect(conscriptResult.hit).toBe(false); // 0.50 >= 0.35
      expect(veteranResult.hit).toBe(true);    // 0.50 < 0.55
    });
  });

  // =========================================================================
  // 3. ButtStrike: stamina drain, no HP damage, stun chance
  // =========================================================================
  describe('ButtStrike', () => {
    it('deals no HP damage but returns staminaDrain on hit', () => {
      // Force hit (random < hitChance), then force no stun
      randomSpy
        .mockReturnValueOnce(0)    // hit roll => hit
        .mockReturnValueOnce(0.5)  // randRange for stDrain
        .mockReturnValueOnce(0.99); // stun roll => no stun

      const attacker = makePlayerRef({ strength: 40 });
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.ButtStrike,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBe(0);
      expect(result.staminaDrain).toBeGreaterThan(0);
      expect(result.special).toBe('');
      expect(targetMut.stunned).toBe(false);
    });

    it('can stun the target when stun roll succeeds', () => {
      // Force hit, randRange mid-value, then force stun
      randomSpy
        .mockReturnValueOnce(0)    // hit roll => hit
        .mockReturnValueOnce(0.5)  // randRange for stDrain
        .mockReturnValueOnce(0);   // stun roll => 0 < stunChance => stunned

      const attacker = makePlayerRef({ strength: 40 });
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.ButtStrike,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.hit).toBe(true);
      expect(result.special).toBe(' Stunned!');
      expect(targetMut.stunned).toBe(true);
      expect(targetMut.stunnedTurns).toBe(1);
    });

    it('scales staminaDrain with attacker strength', () => {
      // High-strength attacker: strength=100 => multiplier = 0.75 + 100/200 = 1.25
      // Low-strength attacker: strength=20 => multiplier = 0.75 + 20/200 = 0.85
      // Use same random values to compare
      const rolls = [0, 0.5, 0.99]; // hit, randRange midpoint, no stun

      randomSpy
        .mockReturnValueOnce(rolls[0])
        .mockReturnValueOnce(rolls[1])
        .mockReturnValueOnce(rolls[2]);

      const strongAttacker = makePlayerRef({ strength: 100 });
      const target = makeEnemyRef();
      const result1 = resolveGenericAttack(
        strongAttacker,
        target,
        makeOpponentMut(),
        MeleeActionId.ButtStrike,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      randomSpy
        .mockReturnValueOnce(rolls[0])
        .mockReturnValueOnce(rolls[1])
        .mockReturnValueOnce(rolls[2]);

      const weakAttacker = makePlayerRef({ strength: 20 });
      const result2 = resolveGenericAttack(
        weakAttacker,
        target,
        makeOpponentMut(),
        MeleeActionId.ButtStrike,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result1.staminaDrain).toBeGreaterThan(result2.staminaDrain);
    });
  });

  // =========================================================================
  // 4. Feint: stamina + fatigue drain, no HP damage
  // =========================================================================
  describe('Feint', () => {
    it('deals no HP damage but returns staminaDrain and fatigueDrain', () => {
      // Force hit, then randRange calls for stDrain and ftDrain
      randomSpy
        .mockReturnValueOnce(0)    // hit roll => hit
        .mockReturnValueOnce(0.5)  // randRange for stDrain (25-35 range)
        .mockReturnValueOnce(0.5); // randRange for ftDrain (20-30 range)

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.Feint,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBe(0);
      expect(result.staminaDrain).toBeGreaterThanOrEqual(25);
      expect(result.staminaDrain).toBeLessThanOrEqual(35);
      expect(result.fatigueDrain).toBeGreaterThanOrEqual(20);
      expect(result.fatigueDrain).toBeLessThanOrEqual(30);
      expect(result.targetKilled).toBe(false);
    });

    it('player-side feint has correct log text format', () => {
      randomSpy
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5);

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.Feint,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.log[0].text).toContain('Feint connects');
      expect(result.log[0].type).toBe('result');
    });
  });

  // =========================================================================
  // 5. Blocking / guard mechanics
  // =========================================================================
  describe('blocking / guard mechanics', () => {
    it('blocks the attack when targetGuarding and block roll succeeds', () => {
      randomSpy
        .mockReturnValueOnce(0)    // hit roll => hit
        .mockReturnValueOnce(0);   // block roll => 0 < targetBlockChance => blocked

      const attacker = makeEnemyRef();
      const target = makePlayerRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player', targetGuarding: true, targetBlockChance: 0.5 },
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.roundAction.blocked).toBe(true);
      expect(result.log[0].text).toContain('blocked');
    });

    it('reduces damage by 15% when block fails (guard broken)', () => {
      // Force hit, force block fail, then control randRange for damage calc
      // Targeting Torso so no head/arm/leg injury rolls are consumed
      randomSpy
        .mockReturnValueOnce(0)     // hit roll => hit
        .mockReturnValueOnce(0.99)  // block roll => fails (0.99 >= 0.5)
        .mockReturnValueOnce(0.5);  // randRange for damage

      const attacker = makeEnemyRef('line', { strength: 40 });
      const target = makePlayerRef();

      // Attack WITH targetGuarding (block fails => 85% damage)
      const guardedResult = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player', targetGuarding: true, targetBlockChance: 0.5 },
      );

      // Attack WITHOUT targetGuarding (full damage), same random seeds
      randomSpy
        .mockReturnValueOnce(0)     // hit roll
        .mockReturnValueOnce(0.5);  // randRange for damage

      const unguardedResult = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      // Guarded but broken should be 85% of unguarded
      expect(guardedResult.damage).toBe(Math.round(unguardedResult.damage * 0.85));
      expect(guardedResult.log.some((e) => e.text.includes('Guard broken'))).toBe(true);
    });
  });

  // =========================================================================
  // 6. Injury system
  // =========================================================================
  describe('injury system', () => {
    it('head shot can cause instant kill (targetKilled)', () => {
      // Force hit, randRange for damage, then head kill roll succeeds
      randomSpy
        .mockReturnValueOnce(0)     // hit roll => hit
        .mockReturnValueOnce(0.5)   // randRange for damage
        .mockReturnValueOnce(0.05); // head kill roll => 0.05 < 0.1 => Killed

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.BayonetThrust,
        BodyPart.Head,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.special).toBe(' Killed.');
      expect(result.targetKilled).toBe(true);
      expect(result.damage).toBeGreaterThan(0);
    });

    it('head shot can cause stun when kill roll fails', () => {
      // Force hit, randRange for damage, head kill fails, head stun succeeds
      randomSpy
        .mockReturnValueOnce(0)     // hit roll => hit
        .mockReturnValueOnce(0.5)   // randRange for damage
        .mockReturnValueOnce(0.5)   // head kill roll => 0.5 >= 0.1 => no kill
        .mockReturnValueOnce(0);    // head stun roll => 0 < 0.35 + stunBonus => stun

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.BayonetThrust,
        BodyPart.Head,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.special).toBe(' Stunned!');
      expect(result.targetKilled).toBe(false);
      expect(targetMut.stunned).toBe(true);
      expect(targetMut.stunnedTurns).toBe(1);
    });

    it('arm hit can cause arm injury (15% chance)', () => {
      // Force hit, randRange for damage, arm injury roll succeeds
      randomSpy
        .mockReturnValueOnce(0)     // hit roll => hit
        .mockReturnValueOnce(0.5)   // randRange for damage
        .mockReturnValueOnce(0.1);  // arm injury roll => 0.1 < 0.15 => injured

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.BayonetThrust,
        BodyPart.Arms,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.special).toBe(' Arm injured.');
      expect(targetMut.armInjured).toBe(true);
    });

    it('leg hit can cause leg injury (10% chance)', () => {
      // Force hit, randRange for damage, leg injury roll succeeds
      randomSpy
        .mockReturnValueOnce(0)     // hit roll => hit
        .mockReturnValueOnce(0.5)   // randRange for damage
        .mockReturnValueOnce(0.05); // leg injury roll => 0.05 < 0.1 => injured

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.BayonetThrust,
        BodyPart.Legs,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.special).toBe(' Leg injured.');
      expect(targetMut.legInjured).toBe(true);
    });

    it('torso hit does not cause special injuries', () => {
      // Force hit, randRange for damage
      randomSpy
        .mockReturnValueOnce(0)     // hit roll => hit
        .mockReturnValueOnce(0.5);  // randRange for damage

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const targetMut = makeOpponentMut();
      const result = resolveGenericAttack(
        attacker,
        target,
        targetMut,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.special).toBe('');
      expect(result.targetKilled).toBe(false);
      expect(targetMut.armInjured).toBe(false);
      expect(targetMut.legInjured).toBe(false);
    });
  });

  // =========================================================================
  // 7. Miss scenarios
  // =========================================================================
  describe('miss scenarios', () => {
    it('returns miss result when random roll exceeds hit chance', () => {
      // Force a miss: random = 0.99 which should exceed most hit chances
      randomSpy.mockReturnValue(0.99);

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.staminaDrain).toBe(0);
      expect(result.fatigueDrain).toBe(0);
      expect(result.special).toBe('');
      expect(result.targetKilled).toBe(false);
      expect(result.roundAction.bodyPart).toBe(BodyPart.Torso);
    });

    it('player miss log says "Miss."', () => {
      randomSpy.mockReturnValue(0.99);

      const attacker = makePlayerRef();
      const target = makeEnemyRef();
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
      );

      expect(result.log[0].text).toBe('Miss.');
    });

    it('enemy miss log includes attacker and target names', () => {
      randomSpy.mockReturnValue(0.99);

      const attacker = makeEnemyRef('line', { name: 'Franz — Line' });
      const target = makePlayerRef({ name: 'Jean-Pierre Duval' });
      const result = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      expect(result.log[0].text).toContain('Franz');
      expect(result.log[0].text).toContain('misses');
      expect(result.log[0].text).toContain('Jean-Pierre Duval');
    });

    it('arm injury reduces hit chance (enemy attacker)', () => {
      // armInjured applies -0.1 penalty to hit chance
      // conscript base: 0.35 - 0.1 = 0.25, Torso hitMod = 0
      // Set random to 0.30: injured misses (0.30 >= 0.25), healthy hits (0.30 < 0.35)
      randomSpy.mockReturnValue(0.30);

      const injuredAttacker = makeEnemyRef('conscript', { armInjured: true });
      const healthyAttacker = makeEnemyRef('conscript');
      const target = makePlayerRef();

      const injuredResult = resolveGenericAttack(
        injuredAttacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      randomSpy.mockReturnValue(0.30);

      const healthyResult = resolveGenericAttack(
        healthyAttacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      expect(injuredResult.hit).toBe(false);
      expect(healthyResult.hit).toBe(true);
    });
  });

  // =========================================================================
  // Additional: free attack damage reduction
  // =========================================================================
  describe('free attack and damage modifiers', () => {
    it('freeAttack reduces damage to 70%', () => {
      // Force hit, same randRange seed for both
      randomSpy
        .mockReturnValueOnce(0)     // hit roll (free attack)
        .mockReturnValueOnce(0.5)   // randRange for damage (free attack)
        .mockReturnValueOnce(0)     // hit roll (normal)
        .mockReturnValueOnce(0.5);  // randRange for damage (normal)

      const attacker = makeEnemyRef('line', { strength: 40 });
      const target = makePlayerRef();

      const freeResult = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player', freeAttack: true },
      );

      const normalResult = resolveGenericAttack(
        attacker,
        target,
        null,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        1,
        { side: 'enemy', targetSide: 'player' },
      );

      expect(freeResult.damage).toBe(Math.round(normalResult.damage * 0.7));
    });
  });

  // =========================================================================
  // Additional: roundAction structure
  // =========================================================================
  describe('roundAction structure', () => {
    it('includes actorName, actorSide, targetName, targetSide, action fields', () => {
      randomSpy.mockReturnValue(0); // force hit

      const attacker = makePlayerRef({ name: 'Duval' });
      const target = makeEnemyRef('line', { name: 'Franz' });
      const result = resolveGenericAttack(
        attacker,
        target,
        makeOpponentMut({ name: 'Franz' }),
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        5,
        { side: 'player', targetSide: 'enemy', stance: MeleeStance.Aggressive },
      );

      expect(result.roundAction.actorName).toBe('Duval');
      expect(result.roundAction.actorSide).toBe('player');
      expect(result.roundAction.targetName).toBe('Franz');
      expect(result.roundAction.targetSide).toBe('enemy');
      expect(result.roundAction.action).toBe(MeleeActionId.BayonetThrust);
      expect(result.roundAction.bodyPart).toBe(BodyPart.Torso);
      expect(result.roundAction.hit).toBe(true);
      expect(result.roundAction.damage).toBe(result.damage);
    });
  });
});
