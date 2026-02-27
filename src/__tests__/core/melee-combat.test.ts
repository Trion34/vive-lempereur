import { describe, it, expect, vi, afterEach } from 'vitest';
import { calcHitChance } from '../../core/melee/hitCalc';
import { resolveGenericAttack } from '../../core/melee/genericAttack';
import { resolveMeleeRound } from '../../core/melee/round';
import type { CombatantRef } from '../../core/melee/effects';
import {
  MeleeStance,
  MeleeActionId,
  MeleeContext,
  BodyPart,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  BattlePhase,
  DrillStep,
} from '../../types';
import type { Player, BattleState, MeleeState, MeleeOpponent } from '../../types';

// ---------------------------------------------------------------------------
// Helpers: minimal mock objects
// ---------------------------------------------------------------------------

function mockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: 'Test Soldier',
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    morale: 80,
    maxMorale: 100,
    moraleThreshold: MoraleThreshold.Steady,
    health: 100,
    maxHealth: 120,
    healthState: HealthState.Unhurt,
    stamina: 200,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 200,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 0,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 3,
    ...overrides,
  };
}

function mockOpponent(overrides: Partial<MeleeOpponent> = {}): MeleeOpponent {
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

function mockCombatantRef(overrides: Partial<CombatantRef> = {}): CombatantRef {
  return {
    name: 'Test Soldier',
    health: 100,
    maxHealth: 120,
    stamina: 200,
    maxStamina: 200,
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

function mockMeleeState(opponents: MeleeOpponent[]): MeleeState {
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
  };
}

function mockBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const player = mockPlayer();
  const opp = mockOpponent();
  const { ext: extOverrides, ...restOverrides } = overrides;
  return {
    phase: BattlePhase.Melee,
    turn: 1,
    drillStep: DrillStep.Endure,
    player,
    line: {
      leftNeighbour: null,
      rightNeighbour: null,
      officer: { name: 'Capitaine', rank: 'captain', alive: true, wounded: false, mounted: true, status: 'commanding' },
      lineIntegrity: 80,
      lineMorale: 'resolute',
      drumsPlaying: true,
      ncoPresent: true,
      casualtiesThisTurn: 0,
    },
    enemy: {
      range: 0,
      strength: 100,
      quality: 'line',
      morale: 'steady',
      lineIntegrity: 50,
      artillery: false,
      cavalryThreat: false,
    },
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 0,
    chargeEncounter: 0,
    meleeState: mockMeleeState([opp]),
    ext: {
      battlePart: 1,
      batteryCharged: false,
      meleeStage: 1,
      wagonDamage: 0,
      gorgeMercyCount: 0,
      gorgeTarget: '',
      ...extOverrides,
    },
    configId: 'rivoli',
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    ...restOverrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// calcHitChance
// ===========================================================================
describe('calcHitChance', () => {
  it('returns a value in [0, 1]', () => {
    for (let i = 0; i < 100; i++) {
      const result = calcHitChance(
        Math.random() * 100,
        80,
        100,
        MeleeStance.Balanced,
        MeleeActionId.BayonetThrust,
        BodyPart.Torso,
        false,
        0,
        200,
      );
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    }
  });

  it('clamped to at least 0.05', () => {
    // Very low stats, worst stance, worst action, hardest body part, no riposte, max fatigue
    const result = calcHitChance(
      0,
      1,
      100,
      MeleeStance.Defensive,
      MeleeActionId.AggressiveLunge,
      BodyPart.Head,
      false,
      200,
      200,
    );
    expect(result).toBeGreaterThanOrEqual(0.05);
  });

  it('clamped to at most 0.95', () => {
    // Max stats, best stance, riposte, best body part, no fatigue
    const result = calcHitChance(
      100,
      100,
      100,
      MeleeStance.Aggressive,
      MeleeActionId.ButtStrike,
      BodyPart.Torso,
      true,
      0,
      200,
    );
    expect(result).toBeLessThanOrEqual(0.95);
  });

  it('higher elan (skillStat) increases hit chance', () => {
    const low = calcHitChance(
      10,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    const high = calcHitChance(
      90,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    expect(high).toBeGreaterThan(low);
  });

  it('Aggressive stance increases hit chance vs Defensive', () => {
    const aggressive = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Aggressive,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    const defensive = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Defensive,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    expect(aggressive).toBeGreaterThan(defensive);
  });

  it('targeting Head reduces hit chance', () => {
    const torso = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    const head = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Head,
      false,
      0,
      200,
    );
    expect(torso).toBeGreaterThan(head);
  });

  it('riposte increases hit chance', () => {
    const noRiposte = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    const riposte = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      true,
      0,
      200,
    );
    expect(riposte).toBeGreaterThan(noRiposte);
  });

  it('high fatigue reduces hit chance', () => {
    const fresh = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      0,
      200,
    );
    const exhausted = calcHitChance(
      40,
      80,
      100,
      MeleeStance.Balanced,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      false,
      200,
      200,
    );
    expect(fresh).toBeGreaterThan(exhausted);
  });
});

// ===========================================================================
// resolveGenericAttack
// ===========================================================================
describe('resolveGenericAttack', () => {
  it('with forced hit (random=0) deals damage for a normal attack', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const attacker = mockCombatantRef({ type: 'player' });
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });
    const result = resolveGenericAttack(
      attacker,
      target,
      null,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );
    expect(result.hit).toBe(true);
    expect(result.damage).toBeGreaterThan(0);
    expect(result.log.length).toBeGreaterThan(0);
    expect(result.roundAction.hit).toBe(true);
  });

  it('with forced miss (random=1) deals no damage', () => {
    // random() returning values close to 1 ensures miss
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const attacker = mockCombatantRef({ type: 'line' });
    const target = mockCombatantRef({ name: 'Player', type: 'player' });
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
    expect(result.roundAction.hit).toBe(false);
  });

  it('Guard action does not deal damage', () => {
    const attacker = mockCombatantRef();
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });
    const result = resolveGenericAttack(
      attacker,
      target,
      null,
      MeleeActionId.Guard,
      BodyPart.Torso,
      1,
      { side: 'player', targetSide: 'enemy' },
    );
    expect(result.hit).toBe(false);
    expect(result.damage).toBe(0);
    expect(result.targetKilled).toBe(false);
  });

  it('Respite action does not deal damage', () => {
    const attacker = mockCombatantRef();
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });
    const result = resolveGenericAttack(
      attacker,
      target,
      null,
      MeleeActionId.Respite,
      BodyPart.Torso,
      1,
      { side: 'player', targetSide: 'enemy' },
    );
    expect(result.hit).toBe(false);
    expect(result.damage).toBe(0);
  });

  it('result contains a valid roundAction', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const attacker = mockCombatantRef();
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });
    const result = resolveGenericAttack(
      attacker,
      target,
      null,
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );
    expect(result.roundAction.actorName).toBe(attacker.name);
    expect(result.roundAction.actorSide).toBe('player');
    expect(result.roundAction.action).toBe(MeleeActionId.BayonetThrust);
  });

  it('ButtStrike hit sets staminaDrain > 0 and damage = 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const attacker = mockCombatantRef();
    const opp = mockOpponent();
    const target = mockCombatantRef({ name: opp.name, type: 'conscript' });
    const result = resolveGenericAttack(
      attacker,
      target,
      opp,
      MeleeActionId.ButtStrike,
      BodyPart.Torso,
      1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );
    expect(result.hit).toBe(true);
    expect(result.damage).toBe(0);
    expect(result.staminaDrain).toBeGreaterThan(0);
  });
});

// ===========================================================================
// resolveMeleeRound
// ===========================================================================
describe('resolveMeleeRound', () => {
  it('advances exchangeCount', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = mockBattleState();
    const before = state.meleeState!.exchangeCount;
    resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);
    expect(state.meleeState!.exchangeCount).toBe(before + 1);
  });

  it('advances roundNumber', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = mockBattleState();
    const before = state.meleeState!.roundNumber;
    resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);
    expect(state.meleeState!.roundNumber).toBe(before + 1);
  });

  it('produces a valid MeleeRoundResult', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = mockBattleState();
    const result = resolveMeleeRound(state, MeleeActionId.Guard, undefined, 0);
    expect(result).toHaveProperty('log');
    expect(result).toHaveProperty('moraleChanges');
    expect(result).toHaveProperty('playerHealthDelta');
    expect(result).toHaveProperty('playerStaminaDelta');
    expect(result).toHaveProperty('allyDeaths');
    expect(result).toHaveProperty('enemyDefeats');
    expect(Array.isArray(result.log)).toBe(true);
    expect(Array.isArray(result.moraleChanges)).toBe(true);
    expect(Array.isArray(result.allyDeaths)).toBe(true);
    expect(typeof result.enemyDefeats).toBe('number');
  });

  it('Guard action applies stamina cost to player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = mockBattleState();
    const staminaBefore = state.player.stamina;
    resolveMeleeRound(state, MeleeActionId.Guard, undefined, 0);
    expect(state.player.stamina).toBeLessThan(staminaBefore);
  });

  it('returns victory when all enemies are defeated', () => {
    // Force a hit with enough damage to kill the single opponent
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const opp = mockOpponent({ health: 1, maxHealth: 1 });
    const state = mockBattleState({
      meleeState: mockMeleeState([opp]),
    });
    const result = resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);
    expect(result.battleEnd).toBe('victory');
  });

  it('returns defeat when player health drops to 0', () => {
    // random=0 forces all attacks to hit; player at 1 HP will die from enemy attack.
    // Use Respite so the player does not block (Guard would block with random=0).
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const opp = mockOpponent({ health: 80, maxHealth: 80 });
    const state = mockBattleState({
      player: mockPlayer({ health: 1, maxHealth: 120 }),
      meleeState: mockMeleeState([opp]),
    });
    const result = resolveMeleeRound(state, MeleeActionId.Respite, undefined, 0);
    expect(state.player.health).toBeLessThanOrEqual(0);
    expect(result.battleEnd).toBe('defeat');
  });

  it('returns survived when player is low HP, killed enemies, and more remain', () => {
    // Setup: two opponents — one nearly dead (player will kill it), one healthy.
    // killCount starts at 1; after the kill it becomes 2, meeting the >= 2 threshold.
    // Player has enough HP to survive the round but ends below 25.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const dyingOpp = mockOpponent({ name: 'Dying — Target', health: 1, maxHealth: 80 });
    const aliveOpp = mockOpponent({ name: 'Healthy — Survivor', health: 80, maxHealth: 80 });
    const ms = mockMeleeState([dyingOpp, aliveOpp]);
    ms.killCount = 1; // will become 2 when the dying opp is killed
    const state = mockBattleState({
      // Player needs enough health to survive the enemy counter-attack but end below 25
      player: mockPlayer({ health: 24, maxHealth: 120, elan: 80 }),
      meleeState: ms,
    });
    // Player attacks the dying opponent (index 0) — guaranteed hit at random=0 kills it.
    // Then the healthy opponent attacks, but player should survive (Guard is not used,
    // so the hit will land, but 24 HP gives a buffer).
    // We use mockReturnValue(0) which forces hits but also minimizes damage variance.
    const result = resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);
    // The dying opponent should be dead
    expect(result.enemyDefeats).toBeGreaterThanOrEqual(1);
    expect(ms.killCount).toBeGreaterThanOrEqual(2);
    // Player should be alive but low
    expect(state.player.health).toBeGreaterThan(0);
    expect(state.player.health).toBeLessThan(25);
    expect(result.battleEnd).toBe('survived');
  });

  it('returns survived only when killCount >= 2 and enemies remain', () => {
    // Same as survived test but killCount starts at 0, so after one kill it is only 1.
    // This should NOT trigger survived — verifies the threshold.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const dyingOpp = mockOpponent({ name: 'Dying — Target', health: 1, maxHealth: 80 });
    const aliveOpp = mockOpponent({ name: 'Healthy — Survivor', health: 80, maxHealth: 80 });
    const ms = mockMeleeState([dyingOpp, aliveOpp]);
    ms.killCount = 0; // after kill will be 1, below the >= 2 threshold
    const state = mockBattleState({
      player: mockPlayer({ health: 24, maxHealth: 120, elan: 80 }),
      meleeState: ms,
    });
    const result = resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);
    expect(result.enemyDefeats).toBeGreaterThanOrEqual(1);
    expect(ms.killCount).toBe(1);
    // Should NOT be survived because killCount < 2
    expect(result.battleEnd).not.toBe('survived');
  });
});
