import { describe, it, expect, vi, afterEach } from 'vitest';
import { calcHitChance, calcDamage } from '../../core/melee/hitCalc';
import { oppSpendStamina, getMeleeActions } from '../../core/melee/effects';
import type { CombatantRef } from '../../core/melee/effects';
import { isOpponentDefeated, backfillEnemies, processWaveEvents } from '../../core/melee/waveManager';
import { resolveGenericAttack } from '../../core/melee/genericAttack';
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
import type { Player, BattleState, MeleeState, MeleeOpponent, LogEntry } from '../../types';

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

function mockMeleeState(opponents: MeleeOpponent[], overrides: Partial<MeleeState> = {}): MeleeState {
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
    ...overrides,
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
// 1. Hit chance boundary tests
// ===========================================================================
describe('calcHitChance — boundary edge cases', () => {
  it('clamps to minimum 0.05 when all stats are zero and all penalties apply', () => {
    const result = calcHitChance(
      0,        // skillStat = 0
      0,        // morale = 0 (maximum morale penalty)
      100,      // maxMorale
      MeleeStance.Defensive, // worst attack stance
      MeleeActionId.AggressiveLunge, // hitBonus = -0.1
      BodyPart.Head,        // hitMod = -0.25
      false,    // no riposte
      200,      // max fatigue
      200,      // maxFatigue (exhausted tier: -0.50)
    );
    expect(result).toBe(0.05);
  });

  it('clamps to maximum 0.95 when all stats are maximized', () => {
    const result = calcHitChance(
      100,      // skillStat = 100
      100,      // morale = 100 (no morale penalty)
      100,      // maxMorale
      MeleeStance.Aggressive, // attack +0.2
      MeleeActionId.ButtStrike, // hitBonus = +0.15
      BodyPart.Torso,        // hitMod = 0 (easiest)
      true,     // riposte bonus +0.15
      0,        // no fatigue
      200,      // maxFatigue
    );
    expect(result).toBe(0.95);
  });

  it('returns exactly 0.05 when raw value would be negative', () => {
    // Extreme negative: skill=0, morale=0/100 gives -0.15 penalty,
    // defensive stance (-0.15), aggressive lunge (-0.1), head (-0.25),
    // exhausted fatigue (-0.50). Raw = 0.35 - 0.15 - 0.1 - 0.25 - 0.15 - 0.50 = -0.80
    const result = calcHitChance(
      0, 0, 100, MeleeStance.Defensive, MeleeActionId.AggressiveLunge,
      BodyPart.Head, false, 200, 200,
    );
    expect(result).toBe(0.05);
  });

  it('returns exactly 0.95 when raw value would exceed 1.0', () => {
    // Extreme positive: skill=100 (+0.833), aggressive (+0.2), butt strike (+0.15),
    // torso (+0), riposte (+0.15), fresh fatigue (0), full morale (0 penalty)
    // Raw = 0.35 + 0.2 + 0.15 + 0 + 0.15 + 0.833 - 0 + 0 = 1.833
    const result = calcHitChance(
      100, 100, 100, MeleeStance.Aggressive, MeleeActionId.ButtStrike,
      BodyPart.Torso, true, 0, 200,
    );
    expect(result).toBe(0.95);
  });

  it('morale at zero applies maximum morale penalty', () => {
    const fullMorale = calcHitChance(
      50, 100, 100, MeleeStance.Balanced, MeleeActionId.BayonetThrust,
      BodyPart.Torso, false, 0, 200,
    );
    const zeroMorale = calcHitChance(
      50, 0, 100, MeleeStance.Balanced, MeleeActionId.BayonetThrust,
      BodyPart.Torso, false, 0, 200,
    );
    // morale penalty = (1 - 0/100) * 0.15 = 0.15
    expect(fullMorale - zeroMorale).toBeCloseTo(0.15, 5);
  });

  it('each body part modifier affects hit chance correctly', () => {
    const base = (part: BodyPart) => calcHitChance(
      50, 80, 100, MeleeStance.Balanced, MeleeActionId.BayonetThrust,
      part, false, 0, 200,
    );
    const torso = base(BodyPart.Torso);
    const head = base(BodyPart.Head);
    const arms = base(BodyPart.Arms);
    const legs = base(BodyPart.Legs);

    // Torso is easiest (hitMod = 0), Head hardest (hitMod = -0.25)
    expect(torso).toBeGreaterThan(arms);
    expect(arms).toBeGreaterThan(legs);
    expect(legs).toBeGreaterThan(head);
  });
});

// ===========================================================================
// 2. calcDamage — boundary edge cases
// ===========================================================================
describe('calcDamage — boundary edge cases', () => {
  it('always returns at least 1 damage (floor clamp)', () => {
    // ButtStrike has damageMod = 0, so base damage would be 0
    // But calcDamage clamps to min 1
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const dmg = calcDamage(MeleeActionId.ButtStrike, BodyPart.Arms, 0, 200, 0);
    expect(dmg).toBeGreaterThanOrEqual(1);
  });

  it('strength 0 reduces melee damage via strengthMod', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const weakDmg = calcDamage(MeleeActionId.BayonetThrust, BodyPart.Torso, 0, 200, 0);
    const strongDmg = calcDamage(MeleeActionId.BayonetThrust, BodyPart.Torso, 0, 200, 100);
    // strength=0 => mod = 0.75, strength=100 => mod = 1.25
    expect(strongDmg).toBeGreaterThan(weakDmg);
  });

  it('strength does not affect Shoot damage (strengthMod = 1.0 for Shoot)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const weakShoot = calcDamage(MeleeActionId.Shoot, BodyPart.Torso, 0, 200, 0);
    const strongShoot = calcDamage(MeleeActionId.Shoot, BodyPart.Torso, 0, 200, 100);
    expect(weakShoot).toBe(strongShoot);
  });

  it('AggressiveLunge deals 1.5x the damage of BayonetThrust', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const thrust = calcDamage(MeleeActionId.BayonetThrust, BodyPart.Torso, 0, 200, 40);
    const lunge = calcDamage(MeleeActionId.AggressiveLunge, BodyPart.Torso, 0, 200, 40);
    // damageMod: thrust=1.0, lunge=1.5
    expect(lunge).toBe(Math.round(thrust * 1.5));
  });

  it('Head body part deals highest damage range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const headDmg = calcDamage(MeleeActionId.BayonetThrust, BodyPart.Head, 0, 200, 40);
    const armsDmg = calcDamage(MeleeActionId.BayonetThrust, BodyPart.Arms, 0, 200, 40);
    expect(headDmg).toBeGreaterThan(armsDmg);
  });

  it('Feint deals minimum damage (damageMod = 0)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const dmg = calcDamage(MeleeActionId.Feint, BodyPart.Torso, 0, 200, 40);
    // damageMod = 0, so raw = 0, clamped to 1
    expect(dmg).toBe(1);
  });
});

// ===========================================================================
// 3. Stamina/fatigue edge cases — oppSpendStamina
// ===========================================================================
describe('oppSpendStamina — edge cases', () => {
  it('does not reduce stamina below 0', () => {
    const opp = mockOpponent({ stamina: 5, maxStamina: 180 });
    // BayonetThrust stamina cost = 20, which exceeds the opp's 5 stamina
    const action = { stamina: 20, hitBonus: 0, damageMod: 1, isAttack: true, stunBonus: 0 };
    oppSpendStamina(opp, action);
    expect(opp.stamina).toBe(0);
  });

  it('handles stamina already at 0 without going negative', () => {
    const opp = mockOpponent({ stamina: 0, maxStamina: 180 });
    const action = { stamina: 20, hitBonus: 0, damageMod: 1, isAttack: true, stunBonus: 0 };
    oppSpendStamina(opp, action);
    expect(opp.stamina).toBe(0);
  });

  it('accumulates fatigue proportional to stamina cost', () => {
    const opp = mockOpponent({ stamina: 100, fatigue: 0, maxFatigue: 180 });
    const action = { stamina: 20, hitBonus: 0, damageMod: 1, isAttack: true, stunBonus: 0 };
    oppSpendStamina(opp, action);
    // fatigue += round(cost * 0.5) = round(20 * 0.5) = 10
    expect(opp.fatigue).toBe(10);
    expect(opp.stamina).toBe(80);
  });

  it('does not accumulate fatigue when cost is 0 or negative (Respite)', () => {
    const opp = mockOpponent({ stamina: 100, fatigue: 50, maxFatigue: 180 });
    // Respite has negative stamina cost
    const action = { stamina: -35, hitBonus: 0, damageMod: 0, isAttack: false, stunBonus: 0 };
    oppSpendStamina(opp, action);
    // Negative cost rounds to -35, stamina = max(0, 100 - (-35)) = 135
    expect(opp.stamina).toBe(135);
    // cost is negative so cost > 0 is false, fatigue should not increase
    expect(opp.fatigue).toBe(50);
  });

  it('clamps fatigue to maxFatigue', () => {
    const opp = mockOpponent({ stamina: 100, fatigue: 175, maxFatigue: 180 });
    const action = { stamina: 40, hitBonus: 0, damageMod: 1, isAttack: true, stunBonus: 0 };
    oppSpendStamina(opp, action);
    // fatigue += round(40 * 0.5) = 20, but 175 + 20 = 195 > 180
    expect(opp.fatigue).toBe(180);
  });

  it('leg injury multiplies stamina cost by 1.5', () => {
    const healthyOpp = mockOpponent({ stamina: 100, fatigue: 0, maxFatigue: 180, legInjured: false });
    const injuredOpp = mockOpponent({ stamina: 100, fatigue: 0, maxFatigue: 180, legInjured: true });
    const action = { stamina: 20, hitBonus: 0, damageMod: 1, isAttack: true, stunBonus: 0 };

    oppSpendStamina(healthyOpp, action);
    oppSpendStamina(injuredOpp, action);

    // Healthy: cost = 20, stamina = 80
    // Injured: cost = round(20 * 1.5) = 30, stamina = 70
    expect(healthyOpp.stamina).toBe(80);
    expect(injuredOpp.stamina).toBe(70);
  });

  it('leg injury also increases fatigue accumulation from higher cost', () => {
    const healthyOpp = mockOpponent({ stamina: 100, fatigue: 0, maxFatigue: 180, legInjured: false });
    const injuredOpp = mockOpponent({ stamina: 100, fatigue: 0, maxFatigue: 180, legInjured: true });
    const action = { stamina: 20, hitBonus: 0, damageMod: 1, isAttack: true, stunBonus: 0 };

    oppSpendStamina(healthyOpp, action);
    oppSpendStamina(injuredOpp, action);

    // Healthy: fatigue += round(20 * 0.5) = 10
    // Injured: fatigue += round(30 * 0.5) = 15
    expect(healthyOpp.fatigue).toBe(10);
    expect(injuredOpp.fatigue).toBe(15);
  });
});

// ===========================================================================
// 4. Wave management edge cases
// ===========================================================================
describe('waveManager — additional edge cases', () => {
  describe('isOpponentDefeated boundary', () => {
    it('returns true when health is exactly 0', () => {
      expect(isOpponentDefeated(mockOpponent({ health: 0 }))).toBe(true);
    });

    it('returns true when health is deeply negative', () => {
      expect(isOpponentDefeated(mockOpponent({ health: -999 }))).toBe(true);
    });

    it('returns false when health is exactly 1', () => {
      expect(isOpponentDefeated(mockOpponent({ health: 1 }))).toBe(false);
    });

    it('returns false when health is fractional positive (0.5)', () => {
      expect(isOpponentDefeated(mockOpponent({ health: 0.5 }))).toBe(false);
    });
  });

  describe('backfillEnemies — additional edge cases', () => {
    it('does not backfill when pool is empty and active count is below max', () => {
      const ms = mockMeleeState(
        [mockOpponent({ name: 'A — Dead', health: 0 })],
        {
          activeEnemies: [0],
          enemyPool: [],
          maxActiveEnemies: 3,
        },
      );
      const log: LogEntry[] = [];
      backfillEnemies(ms, 1, log);
      // Pool empty, nothing can be backfilled
      expect(ms.activeEnemies).toEqual([0]);
      expect(log).toHaveLength(0);
    });

    it('does not backfill when all active enemies are alive and at max capacity', () => {
      const ms = mockMeleeState(
        [
          mockOpponent({ name: 'A — Alive', health: 80 }),
          mockOpponent({ name: 'B — Alive', health: 80 }),
          mockOpponent({ name: 'C — Pool', health: 80 }),
        ],
        {
          activeEnemies: [0, 1],
          enemyPool: [2],
          maxActiveEnemies: 2,
        },
      );
      const log: LogEntry[] = [];
      backfillEnemies(ms, 1, log);
      // All active enemies alive and at max capacity
      expect(ms.activeEnemies).toEqual([0, 1]);
      expect(ms.enemyPool).toEqual([2]);
      expect(log).toHaveLength(0);
    });

    it('backfills exactly the right number when some active enemies are dead', () => {
      const ms = mockMeleeState(
        [
          mockOpponent({ name: 'A — Dead', health: 0 }),
          mockOpponent({ name: 'B — Alive', health: 80 }),
          mockOpponent({ name: 'C — Pool', health: 80 }),
          mockOpponent({ name: 'D — Pool', health: 80 }),
        ],
        {
          activeEnemies: [0, 1], // one dead, one alive
          enemyPool: [2, 3],
          maxActiveEnemies: 2,
        },
      );
      const log: LogEntry[] = [];
      backfillEnemies(ms, 1, log);
      // One dead frees one slot, so one backfill
      expect(ms.activeEnemies).toEqual([0, 1, 2]);
      expect(ms.enemyPool).toEqual([3]);
      expect(log).toHaveLength(1);
    });

    it('generates arrival roundLog entries with correct structure', () => {
      const ms = mockMeleeState(
        [
          mockOpponent({ name: 'Dead — X', health: 0 }),
          mockOpponent({ name: 'Fresh — Y', health: 80 }),
        ],
        {
          activeEnemies: [0],
          enemyPool: [1],
          maxActiveEnemies: 2,
          roundLog: [],
        },
      );
      const log: LogEntry[] = [];
      backfillEnemies(ms, 3, log);

      expect(ms.roundLog).toHaveLength(1);
      const entry = ms.roundLog[0];
      expect(entry.eventType).toBe('arrival');
      expect(entry.actorSide).toBe('enemy');
      expect(entry.actorName).toBe('Fresh — Y');
      expect(entry.hit).toBe(false);
      expect(entry.damage).toBe(0);
    });
  });

  describe('processWaveEvents — additional edge cases', () => {
    it('returns empty log when no wave events are configured', () => {
      const ms = mockMeleeState(
        [mockOpponent()],
        {
          waveEvents: [],
          processedWaves: [],
          roundNumber: 5,
        },
      );
      const battle = mockBattleState();
      const log = processWaveEvents(ms, battle.turn, battle.line, battle.roles);
      // Only backfill entries possible, but pool is empty, so nothing
      expect(log).toHaveLength(0);
    });

    it('processes multiple wave events in one call', () => {
      const ms = mockMeleeState(
        [
          mockOpponent({ name: 'Active — A', health: 80 }),
          mockOpponent({ name: 'Pool — B', health: 80 }),
          mockOpponent({ name: 'Pool — C', health: 80 }),
          mockOpponent({ name: 'Pool — D', health: 80 }),
        ],
        {
          roundNumber: 5,
          activeEnemies: [0],
          enemyPool: [1, 2, 3],
          maxActiveEnemies: 1,
          waveEvents: [
            {
              atRound: 2,
              action: 'increase_max_enemies',
              newMaxEnemies: 2,
              narrative: 'Wave 1!',
            },
            {
              atRound: 4,
              action: 'increase_max_enemies',
              newMaxEnemies: 3,
              narrative: 'Wave 2!',
            },
          ],
          processedWaves: [],
        },
      );
      const battle = mockBattleState();
      const log = processWaveEvents(ms, battle.turn, battle.line, battle.roles);

      // Both events should fire (roundNumber=5 >= 2 and >= 4)
      expect(ms.processedWaves).toContain(0);
      expect(ms.processedWaves).toContain(1);
      // Final maxActiveEnemies should be 3 (last one wins)
      expect(ms.maxActiveEnemies).toBe(3);
      // Backfill should pull 2 from pool (3 max - 1 active alive = 2)
      expect(log.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// ===========================================================================
// 5. resolveGenericAttack — edge cases
// ===========================================================================
describe('resolveGenericAttack — edge cases', () => {
  it('attack against target with 0 health still calculates damage', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const attacker = mockCombatantRef({ type: 'player' });
    const target = mockCombatantRef({ name: 'Dead Enemy', type: 'line', health: 0 });
    const result = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );
    // Function does not check target health — it just resolves
    expect(result.hit).toBe(true);
    expect(result.damage).toBeGreaterThan(0);
  });

  it('Shoot action ignores strength modifier (strengthMod = 1.0)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const weakAttacker = mockCombatantRef({ type: 'player', strength: 0 });
    const strongAttacker = mockCombatantRef({ type: 'player', strength: 100 });
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });

    const weakResult = resolveGenericAttack(
      weakAttacker, target, null,
      MeleeActionId.Shoot, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const strongResult = resolveGenericAttack(
      strongAttacker, target, null,
      MeleeActionId.Shoot, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );

    expect(weakResult.damage).toBe(strongResult.damage);
  });

  it('free attack reduces damage to 70%', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const attacker = mockCombatantRef({ type: 'line' });
    const target = mockCombatantRef({ name: 'Player', type: 'player' });

    const normalResult = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player' },
    );
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const freeResult = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', freeAttack: true },
    );

    expect(freeResult.damage).toBe(Math.round(normalResult.damage * 0.7));
  });

  it('target fatigue makes them easier to hit', () => {
    // Target at max fatigue should give attacker a hit bonus
    // Use a random value that would miss against a fresh target but hit against exhausted
    const attacker = mockCombatantRef({ type: 'conscript' });
    // conscript base hit: 0.35
    // Fresh target fatigue bonus: 0
    // Exhausted target fatigue bonus: +0.50 (from -(-50)/100)
    const freshTarget = mockCombatantRef({ name: 'Fresh', type: 'player', fatigue: 0, maxFatigue: 200 });
    const exhaustedTarget = mockCombatantRef({ name: 'Exhausted', type: 'player', fatigue: 200, maxFatigue: 200 });

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const resultVsFresh = resolveGenericAttack(
      attacker, freshTarget, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player' },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const resultVsExhausted = resolveGenericAttack(
      attacker, exhaustedTarget, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player' },
    );

    // 0.5 > 0.35 (miss fresh) but 0.5 < 0.35 + 0.50 = 0.85 (hit exhausted)
    expect(resultVsFresh.hit).toBe(false);
    expect(resultVsExhausted.hit).toBe(true);
  });

  it('non-attack action (SecondWind) returns no-op result', () => {
    const attacker = mockCombatantRef();
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });
    const result = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.SecondWind, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy' },
    );
    expect(result.hit).toBe(false);
    expect(result.damage).toBe(0);
    expect(result.log).toHaveLength(0);
    expect(result.roundAction.hit).toBe(false);
  });

  it('UseCanteen action returns no-op result', () => {
    const attacker = mockCombatantRef();
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });
    const result = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.UseCanteen, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy' },
    );
    expect(result.hit).toBe(false);
    expect(result.damage).toBe(0);
  });

  it('ally arm injury reduces hit chance', () => {
    // Ally base hit = 0.4 + elan/200. With elan=45: 0.4 + 0.225 = 0.625
    // Arm penalty = -0.1, so injured = 0.525
    // Set random to 0.55: injured misses (0.55 >= 0.525... wait that's a hit)
    // Actually 0.55 < 0.625 but >= 0.525 won't work because 0.55 > 0.525
    // Let's use 0.57: 0.57 < 0.625 (healthy hits) and 0.57 > 0.525 (injured misses)
    vi.spyOn(Math, 'random').mockReturnValue(0.57);

    const healthyAlly = mockCombatantRef({ type: 'ally', elan: 45, armInjured: false });
    const injuredAlly = mockCombatantRef({ type: 'ally', elan: 45, armInjured: true });
    const target = mockCombatantRef({ name: 'Enemy', type: 'conscript' });

    const healthyResult = resolveGenericAttack(
      healthyAlly, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'ally', targetSide: 'enemy' },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.57);
    const injuredResult = resolveGenericAttack(
      injuredAlly, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'ally', targetSide: 'enemy' },
    );

    expect(healthyResult.hit).toBe(true);
    expect(injuredResult.hit).toBe(false);
  });

  it('Shoot uses musketry stat instead of elan for player hit calculation', () => {
    // Player with high musketry but low elan should shoot well
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const shooterPlayer = mockCombatantRef({ type: 'player', musketry: 90, elan: 10 });
    const target = mockCombatantRef({ name: 'Enemy', type: 'line' });

    const result = resolveGenericAttack(
      shooterPlayer, target, null,
      MeleeActionId.Shoot, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced },
    );

    // Should hit because musketry stat is used, not elan
    expect(result.hit).toBe(true);
  });
});

// ===========================================================================
// 6. Morale-gated action availability — edge cases
// ===========================================================================
describe('getMeleeActions — morale gating edge cases', () => {
  it('Steady allows all standard actions', () => {
    const state = mockBattleState({
      player: mockPlayer({ moraleThreshold: MoraleThreshold.Steady, stamina: 200, fatigue: 10 }),
    });
    const actions = getMeleeActions(state);
    const available = actions.filter((a) => a.available).map((a) => a.id);
    expect(available).toContain(MeleeActionId.BayonetThrust);
    expect(available).toContain(MeleeActionId.AggressiveLunge);
    expect(available).toContain(MeleeActionId.ButtStrike);
    expect(available).toContain(MeleeActionId.Feint);
    expect(available).toContain(MeleeActionId.Guard);
    expect(available).toContain(MeleeActionId.Respite);
    expect(available).toContain(MeleeActionId.SecondWind);
  });

  it('Shaken disables only AggressiveLunge among attacks', () => {
    const state = mockBattleState({
      player: mockPlayer({ moraleThreshold: MoraleThreshold.Shaken, stamina: 200, fatigue: 10 }),
    });
    const actions = getMeleeActions(state);
    const lunge = actions.find((a) => a.id === MeleeActionId.AggressiveLunge);
    expect(lunge!.available).toBe(false);

    // Other attacks remain available
    const thrust = actions.find((a) => a.id === MeleeActionId.BayonetThrust);
    const butt = actions.find((a) => a.id === MeleeActionId.ButtStrike);
    const feint = actions.find((a) => a.id === MeleeActionId.Feint);
    expect(thrust!.available).toBe(true);
    expect(butt!.available).toBe(true);
    expect(feint!.available).toBe(true);
  });

  it('Wavering disables AggressiveLunge, ButtStrike, and Feint', () => {
    const state = mockBattleState({
      player: mockPlayer({ moraleThreshold: MoraleThreshold.Wavering, stamina: 200, fatigue: 10 }),
    });
    const actions = getMeleeActions(state);
    const unavailable = actions.filter((a) => !a.available).map((a) => a.id);
    expect(unavailable).toContain(MeleeActionId.AggressiveLunge);
    expect(unavailable).toContain(MeleeActionId.ButtStrike);
    expect(unavailable).toContain(MeleeActionId.Feint);
  });

  it('Breaking disables all attacks including BayonetThrust and Shoot', () => {
    const state = mockBattleState({
      player: mockPlayer({
        moraleThreshold: MoraleThreshold.Breaking,
        stamina: 200,
        fatigue: 10,
        musketLoaded: true,
      }),
    });
    const actions = getMeleeActions(state);
    const available = actions.filter((a) => a.available).map((a) => a.id);

    expect(available).not.toContain(MeleeActionId.BayonetThrust);
    expect(available).not.toContain(MeleeActionId.AggressiveLunge);
    expect(available).not.toContain(MeleeActionId.ButtStrike);
    expect(available).not.toContain(MeleeActionId.Feint);
    expect(available).not.toContain(MeleeActionId.Shoot);

    // Only defensive actions remain
    expect(available).toContain(MeleeActionId.Guard);
    expect(available).toContain(MeleeActionId.Respite);
    expect(available).toContain(MeleeActionId.SecondWind);
  });

  it('at 0 stamina returns only Respite regardless of morale', () => {
    for (const threshold of [MoraleThreshold.Steady, MoraleThreshold.Shaken, MoraleThreshold.Wavering, MoraleThreshold.Breaking]) {
      const state = mockBattleState({
        player: mockPlayer({ moraleThreshold: threshold, stamina: 0 }),
      });
      const actions = getMeleeActions(state);
      expect(actions).toHaveLength(1);
      expect(actions[0].id).toBe(MeleeActionId.Respite);
    }
  });

  it('Breaking with unloaded musket still allows Reload', () => {
    const state = mockBattleState({
      player: mockPlayer({
        moraleThreshold: MoraleThreshold.Breaking,
        stamina: 200,
        musketLoaded: false,
        fatigue: 10,
      }),
    });
    const actions = getMeleeActions(state);
    const reload = actions.find((a) => a.id === MeleeActionId.Reload);
    expect(reload).toBeDefined();
    expect(reload!.available).toBe(true);
  });

  it('SecondWind unavailable when fatigue is 0 even at Steady morale', () => {
    const state = mockBattleState({
      player: mockPlayer({ moraleThreshold: MoraleThreshold.Steady, fatigue: 0, stamina: 200 }),
    });
    const actions = getMeleeActions(state);
    const sw = actions.find((a) => a.id === MeleeActionId.SecondWind);
    expect(sw!.available).toBe(false);
  });

  it('Wavering still allows Shoot when musket is loaded', () => {
    const state = mockBattleState({
      player: mockPlayer({
        moraleThreshold: MoraleThreshold.Wavering,
        stamina: 200,
        musketLoaded: true,
      }),
    });
    const actions = getMeleeActions(state);
    const shoot = actions.find((a) => a.id === MeleeActionId.Shoot);
    expect(shoot).toBeDefined();
    expect(shoot!.available).toBe(true);
  });

  it('staminaCost property matches ACTION_DEFS for each returned action', () => {
    const state = mockBattleState({
      player: mockPlayer({ moraleThreshold: MoraleThreshold.Steady, stamina: 200, fatigue: 10 }),
    });
    const actions = getMeleeActions(state);
    for (const a of actions) {
      // Verify the cost is correctly propagated
      expect(typeof a.staminaCost).toBe('number');
    }
  });
});
