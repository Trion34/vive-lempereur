import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolveScriptedFire, resolveGorgeFire } from '../../core/volleys/fire';
import { VOLLEY_DEFS } from '../../core/volleys/constants';
import type {
  BattleState,
  Player,
  EnemyState,
  LineState,
  Soldier,
  Officer,
  LogEntry,
  MoraleChange,
} from '../../types';
import {
  BattlePhase,
  DrillStep,
  MoraleThreshold,
  HealthState,
  FatigueTier,
} from '../../types';

// ---------------------------------------------------------------------------
// Helpers: minimal mock objects (matching morale.test.ts pattern)
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
    health: 125,
    maxHealth: 125,
    healthState: HealthState.Unhurt,
    stamina: 400,
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
    canteenUses: 0,
    ...overrides,
  };
}

function mockOfficer(overrides: Partial<Officer> = {}): Officer {
  return {
    name: 'Leclerc',
    rank: 'Capt.',
    alive: true,
    wounded: false,
    mounted: true,
    status: 'Mounted, steady',
    ...overrides,
  };
}

function mockSoldier(overrides: Partial<Soldier> = {}): Soldier {
  return {
    id: 'soldier-1',
    name: 'Pierre',
    rank: 'private',
    valor: 40,
    morale: 80,
    maxMorale: 100,
    threshold: MoraleThreshold.Steady,
    alive: true,
    wounded: false,
    routing: false,
    musketLoaded: true,
    relationship: 50,
    ...overrides,
  };
}

function mockLine(overrides: Partial<LineState> = {}): LineState {
  return {
    leftNeighbour: mockSoldier({ id: 'left', name: 'Pierre' }),
    rightNeighbour: mockSoldier({ id: 'right', name: 'Jean-Baptiste' }),
    officer: mockOfficer(),
    lineIntegrity: 100,
    lineMorale: 'resolute',
    drumsPlaying: true,
    ncoPresent: true,
    casualtiesThisTurn: 0,
    ...overrides,
  };
}

function mockEnemy(overrides: Partial<EnemyState> = {}): EnemyState {
  return {
    range: 120,
    strength: 100,
    quality: 'line',
    morale: 'advancing',
    lineIntegrity: 100,
    artillery: true,
    cavalryThreat: false,
    ...overrides,
  };
}

function mockBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const { ext: extOverrides, ...restOverrides } = overrides;
  return {
    phase: BattlePhase.Line,
    turn: 1,
    drillStep: DrillStep.Fire,
    player: mockPlayer(),
    line: mockLine(),
    enemy: mockEnemy(),
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 1,
    chargeEncounter: 0,
    ext: {
      battlePart: 1,
      batteryCharged: false,
      meleeStage: 0,
      wagonDamage: 0,
      gorgeMercyCount: 0,
      gorgeTarget: '',
      ...extOverrides,
    },
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    ...restOverrides,
  };
}

// ===========================================================================
// resolveScriptedFire
// ===========================================================================
describe('resolveScriptedFire', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('produces a result with log entries and morale changes', () => {
    // Force hit + perceived: random returns 0.0 for both rolls
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedFire(state);

    expect(result.log.length).toBeGreaterThanOrEqual(1);
    expect(result.moraleChanges.length).toBeGreaterThanOrEqual(1);
    expect(typeof result.hit).toBe('boolean');
    expect(typeof result.perceived).toBe('boolean');
    expect(typeof result.accuracy).toBe('number');
    expect(typeof result.enemyDamage).toBe('number');
  });

  it('respects volley def parameters — volley 1 has low accuracy base', () => {
    // Force a miss: random returns 0.99 (well above any accuracy)
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = mockBattleState({ scriptedVolley: 1 });
    const def = VOLLEY_DEFS[0];

    const result = resolveScriptedFire(state);

    // Volley 1 accuracy base is 0.2 — with musketry 35, accuracy ~ 0.2 + 35/500 = 0.27
    // With roll 0.99 it should be a miss
    expect(result.hit).toBe(false);
    expect(result.accuracy).toBeLessThan(0.5);
    expect(result.enemyDamage).toBe(0);
  });

  it('respects volley def parameters — volley 4 has high accuracy base', () => {
    // Force a hit: random returns 0.0
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const state = mockBattleState({ scriptedVolley: 4 });

    const result = resolveScriptedFire(state);

    // Volley 4 accuracy base is 0.7 — with musketry 35, accuracy ~ 0.7 + 35/500 = 0.77
    expect(result.hit).toBe(true);
    expect(result.accuracy).toBeGreaterThan(0.5);
    expect(result.enemyDamage).toBe(2.5);
  });

  it('gives +4 morale for hit_seen (hit + perceived)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // hit and perceived
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedFire(state);

    expect(result.hit).toBe(true);
    expect(result.perceived).toBe(true);
    const moraleChange = result.moraleChanges.find((c) => c.amount === 4);
    expect(moraleChange).toBeDefined();
    expect(moraleChange!.reason).toContain('saw your man fall');
  });

  it('gives -1 morale for miss_seen (miss + perceived)', () => {
    // Need hit to fail but perception to succeed
    // Volley 1: accuracy ~0.27, perception ~0.15 + 35/200 = 0.325
    // Roll 0.5 → miss (0.5 > 0.27), but also miss perception (0.5 > 0.325)
    // Need different values for each call
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.5; // hit roll → miss (0.5 > ~0.27)
      return 0.0; // perception roll → perceived (0.0 < ~0.325)
    });
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedFire(state);

    expect(result.hit).toBe(false);
    expect(result.perceived).toBe(true);
    const moraleChange = result.moraleChanges.find((c) => c.amount === -1);
    expect(moraleChange).toBeDefined();
    expect(moraleChange!.reason).toContain('saw your shot miss');
  });

  it('gives +1 morale for miss_unseen (miss + not perceived)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // both miss
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedFire(state);

    expect(result.hit).toBe(false);
    expect(result.perceived).toBe(false);
    const moraleChange = result.moraleChanges.find((c) => c.reason === 'Fired with the volley');
    expect(moraleChange).toBeDefined();
    expect(moraleChange!.amount).toBe(1);
  });

  it('applies morale penalty for Wavering threshold', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const state = mockBattleState({
      scriptedVolley: 4,
      player: mockPlayer({ moraleThreshold: MoraleThreshold.Wavering }),
    });

    const result = resolveScriptedFire(state);

    // Accuracy should be reduced: (0.7 + 35/500) * 0.7 ≈ 0.539
    expect(result.accuracy).toBeLessThan(0.7);
  });

  it('clamps accuracy between 0.05 and 0.9', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);

    // Breaking morale with low musketry should hit the floor
    const lowState = mockBattleState({
      scriptedVolley: 1,
      player: mockPlayer({
        musketry: 0,
        moraleThreshold: MoraleThreshold.Breaking,
      }),
    });
    const lowResult = resolveScriptedFire(lowState);
    expect(lowResult.accuracy).toBeGreaterThanOrEqual(0.05);

    // High musketry with high base should hit the ceiling
    const highState = mockBattleState({
      scriptedVolley: 4,
      player: mockPlayer({ musketry: 100 }),
    });
    const highResult = resolveScriptedFire(highState);
    expect(highResult.accuracy).toBeLessThanOrEqual(0.9);
  });
});

// ===========================================================================
// resolveGorgeFire
// ===========================================================================
describe('resolveGorgeFire', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('produces a valid fire result for column target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // guaranteed hit
    const state = mockBattleState({
      ext: { battlePart: 3, gorgeTarget: 'column' },
    });

    const result = resolveGorgeFire(state);

    expect(typeof result.hit).toBe('boolean');
    expect(typeof result.accuracy).toBe('number');
    expect(result.log.length).toBeGreaterThanOrEqual(1);
    expect(result.moraleChanges.length).toBeGreaterThanOrEqual(1);
    expect(result.perceived).toBe(true); // gorge fire always perceived
  });

  it('column hit deals 5 enemy damage and +2 morale', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const state = mockBattleState({ ext: { gorgeTarget: 'column' } });

    const result = resolveGorgeFire(state);

    expect(result.hit).toBe(true);
    expect(result.enemyDamage).toBe(5);
    const moraleChange = result.moraleChanges.find((c) => c.amount === 2);
    expect(moraleChange).toBeDefined();
    expect(moraleChange!.reason).toContain('column');
  });

  it('column miss gives +1 morale', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // miss
    const state = mockBattleState({ ext: { gorgeTarget: 'column' } });

    const result = resolveGorgeFire(state);

    expect(result.hit).toBe(false);
    expect(result.enemyDamage).toBe(0);
    const moraleChange = result.moraleChanges.find((c) => c.amount === 1);
    expect(moraleChange).toBeDefined();
  });

  it('officer hit deals 3 enemy damage and +5 morale', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const state = mockBattleState({ ext: { gorgeTarget: 'officers' } });

    const result = resolveGorgeFire(state);

    expect(result.hit).toBe(true);
    expect(result.enemyDamage).toBe(3);
    const moraleChange = result.moraleChanges.find((c) => c.amount === 5);
    expect(moraleChange).toBeDefined();
    expect(moraleChange!.reason).toContain('officer');
  });

  it('officer miss gives -1 morale', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = mockBattleState({ ext: { gorgeTarget: 'officers' } });

    const result = resolveGorgeFire(state);

    expect(result.hit).toBe(false);
    const moraleChange = result.moraleChanges.find((c) => c.amount === -1);
    expect(moraleChange).toBeDefined();
    expect(moraleChange!.reason).toContain('Missed');
  });

  it('wagon hit accumulates wagonDamage', () => {
    // Mock: first call = hit roll (0.0 < accuracy), second call = damage roll
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit roll
      return 0.5; // damage roll: 30 + 0.5*15 = 37.5
    });
    const state = mockBattleState({ ext: { gorgeTarget: 'wagon', wagonDamage: 0 } });

    const result = resolveGorgeFire(state);

    expect(result.hit).toBe(true);
    expect(state.ext.wagonDamage).toBeGreaterThan(0);
    expect(state.ext.wagonDamage).toBeLessThan(100);
  });

  it('wagon detonation at 100+ damage reduces enemy strength', () => {
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit
      return 0.99; // damage: 30 + 0.99*15 ≈ 44.85
    });
    const state = mockBattleState({
      ext: { gorgeTarget: 'wagon', wagonDamage: 70 }, // already high — will exceed 100
      enemy: mockEnemy({ strength: 100 }),
    });

    const result = resolveGorgeFire(state);

    expect(result.hit).toBe(true);
    expect(state.ext.wagonDamage).toBe(100);
    expect(state.enemy.strength).toBe(70); // 100 - 30
    const detonation = result.moraleChanges.find((c) => c.amount === 15);
    expect(detonation).toBeDefined();
    expect(detonation!.reason).toContain('DETONATES');
  });

  it('clears gorgeTarget after resolution', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const state = mockBattleState({ ext: { gorgeTarget: 'column' } });

    resolveGorgeFire(state);

    expect(state.ext.gorgeTarget).toBe('');
  });
});
