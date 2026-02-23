import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  resolveScriptedEvents,
  resolveScriptedReturnFire,
} from '../../core/volleys/events';
import type {
  BattleState,
  Player,
  EnemyState,
  LineState,
  Soldier,
  Officer,
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
    battlePart: 1,
    batteryCharged: false,
    meleeStage: 0,
    wagonDamage: 0,
    gorgeMercyCount: 0,
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    ...overrides,
  };
}

// ===========================================================================
// resolveScriptedEvents
// ===========================================================================
describe('resolveScriptedEvents', () => {
  it('handles volley 1 Fire step — produces log and recovery morale', () => {
    const state = mockBattleState({ scriptedVolley: 1 });
    const result = resolveScriptedEvents(state, DrillStep.Fire);

    expect(result.log.length).toBeGreaterThanOrEqual(1);
    expect(result.log[0].type).toBe('event');
    expect(result.log[0].text).toContain('First volley');

    const recovery = result.moraleChanges.find(
      (c) => c.source === 'recovery' && c.reason.includes('First volley'),
    );
    expect(recovery).toBeDefined();
    expect(recovery!.amount).toBe(2);
  });

  it('handles volley 1 Endure step — produces passive drain, recovery, and contagion', () => {
    const state = mockBattleState({ scriptedVolley: 1 });
    const result = resolveScriptedEvents(state, DrillStep.Endure);

    // Should have: event morale (-4), passive (-2), recovery (+2), contagion for neighbours
    const eventDrain = result.moraleChanges.find(
      (c) => c.source === 'event' && c.reason.includes('right'),
    );
    expect(eventDrain).toBeDefined();
    expect(eventDrain!.amount).toBe(-4);

    const passive = result.moraleChanges.find((c) => c.source === 'passive');
    expect(passive).toBeDefined();
    expect(passive!.amount).toBe(-2);

    const recovery = result.moraleChanges.find((c) => c.source === 'recovery');
    expect(recovery).toBeDefined();
    expect(recovery!.amount).toBe(2);

    // Contagion from steady neighbours
    const contagion = result.moraleChanges.filter((c) => c.source === 'contagion');
    expect(contagion.length).toBeGreaterThanOrEqual(1);
  });

  it('handles volley 2 Fire step — man killed nearby, line integrity reduced', () => {
    const state = mockBattleState({ scriptedVolley: 2 });
    const initialIntegrity = state.line.lineIntegrity;

    const result = resolveScriptedEvents(state, DrillStep.Fire);

    const casualtyEvent = result.moraleChanges.find(
      (c) => c.source === 'event' && c.reason.includes('killed'),
    );
    expect(casualtyEvent).toBeDefined();
    expect(casualtyEvent!.amount).toBe(-3);
    expect(state.line.lineIntegrity).toBe(initialIntegrity - 3);
  });

  it('handles volley 3 Present step — Pierre wounded, officer dismounts', () => {
    const state = mockBattleState({ scriptedVolley: 3 });

    const result = resolveScriptedEvents(state, DrillStep.Present);

    // Pierre should be wounded
    expect(state.line.leftNeighbour!.wounded).toBe(true);
    expect(state.line.casualtiesThisTurn).toBe(1);

    // Officer should be dismounted
    expect(state.line.officer.mounted).toBe(false);

    const pierreEvent = result.moraleChanges.find(
      (c) => c.source === 'event' && c.reason.includes('Pierre'),
    );
    expect(pierreEvent).toBeDefined();
    expect(pierreEvent!.amount).toBe(-6);
  });

  it('handles volley 3 Endure step — artillery ceases, officer rallies', () => {
    const state = mockBattleState({ scriptedVolley: 3 });

    const result = resolveScriptedEvents(state, DrillStep.Endure);

    // Artillery should stop
    expect(state.enemy.artillery).toBe(false);

    // Officer rally
    const rally = result.moraleChanges.find(
      (c) => c.source === 'recovery' && c.reason.includes('Captain'),
    );
    expect(rally).toBeDefined();
    expect(rally!.amount).toBe(4);
  });

  it('returns empty results for a step with no events', () => {
    // Volley 1, Load step has no scripted events
    const state = mockBattleState({ scriptedVolley: 1 });
    const result = resolveScriptedEvents(state, DrillStep.Load);

    expect(result.log).toHaveLength(0);
    expect(result.moraleChanges).toHaveLength(0);
  });

  it('handles volley 7 Endure step — Napoleon counterattack', () => {
    const state = mockBattleState({ scriptedVolley: 7 });
    const result = resolveScriptedEvents(state, DrillStep.Endure);

    const napoleon = result.moraleChanges.find(
      (c) => c.source === 'recovery' && c.reason.includes('Napoleon'),
    );
    expect(napoleon).toBeDefined();
    expect(napoleon!.amount).toBe(10);

    // Officer rally on top
    const officerRally = result.moraleChanges.find(
      (c) => c.source === 'recovery' && c.reason.includes('Captain'),
    );
    expect(officerRally).toBeDefined();
    expect(officerRally!.amount).toBe(5);
  });

  it('handles gorge volley 10 Endure step — mercy tracking', () => {
    const state = mockBattleState({ scriptedVolley: 10, gorgeMercyCount: 1 });
    const result = resolveScriptedEvents(state, DrillStep.Endure);

    const mercyBonus = result.moraleChanges.find(
      (c) => c.source === 'recovery' && c.reason.includes('mercy'),
    );
    expect(mercyBonus).toBeDefined();
    expect(mercyBonus!.amount).toBe(3);
  });

  it('handles gorge volley 11 Endure step — scripted wagon detonation when not destroyed', () => {
    const state = mockBattleState({
      scriptedVolley: 11,
      wagonDamage: 50,
      enemy: mockEnemy({ strength: 100 }),
    });

    const result = resolveScriptedEvents(state, DrillStep.Endure);

    expect(state.wagonDamage).toBe(100);
    expect(state.enemy.strength).toBe(70); // 100 - 30
    const detonation = result.moraleChanges.find(
      (c) => c.source === 'event' && c.reason.includes('detonates'),
    );
    expect(detonation).toBeDefined();
    expect(detonation!.amount).toBe(10);
  });

  it('handles gorge volley 11 Endure step — already detonated by player', () => {
    const state = mockBattleState({ scriptedVolley: 11, wagonDamage: 100 });

    const result = resolveScriptedEvents(state, DrillStep.Endure);

    const silence = result.moraleChanges.find(
      (c) => c.source === 'recovery' && c.reason.includes('silent'),
    );
    expect(silence).toBeDefined();
    expect(silence!.amount).toBe(3);
  });
});

// ===========================================================================
// resolveScriptedReturnFire
// ===========================================================================
describe('resolveScriptedReturnFire', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('produces damage and log entries when hit', () => {
    // Force a hit: random returns 0.0 for hit check, then 0.5 for damage
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit roll → hit
      if (callCount === 2) return 0.5; // damage roll
      if (callCount === 3) return 0.99; // fatal check → not fatal
      return 0.0; // wound type
    });
    // Use volley 3 (volleyIdx 2) which has 0.4 return fire chance
    const state = mockBattleState({ scriptedVolley: 3 });

    const result = resolveScriptedReturnFire(state, 2);

    expect(result.healthDamage).toBeGreaterThan(0);
    expect(result.log.length).toBeGreaterThanOrEqual(1);
    expect(result.moraleChanges.length).toBeGreaterThanOrEqual(1);
  });

  it('produces no damage when return fire misses', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // miss
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedReturnFire(state, 0);

    expect(result.healthDamage).toBe(0);
    expect(result.log).toHaveLength(0);
    expect(result.moraleChanges).toHaveLength(0);
  });

  it('applies -8 morale on non-fatal hit', () => {
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit
      if (callCount === 2) return 0.0; // damage (min)
      if (callCount === 3) return 0.99; // not fatal
      return 0.0; // wound type
    });
    // Volley 3 (idx 2) has fatal chance
    const state = mockBattleState({ scriptedVolley: 3 });

    const result = resolveScriptedReturnFire(state, 2);

    const moraleLoss = result.moraleChanges.find((c) => c.amount === -8);
    expect(moraleLoss).toBeDefined();
    expect(moraleLoss!.reason).toContain('hit');
  });

  it('deals damage within the volley def damage range', () => {
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit
      if (callCount === 2) return 0.5; // damage roll
      if (callCount === 3) return 0.99; // not fatal (for idx >= 2)
      return 0.0; // wound type
    });
    // Volley 1 (idx 0): damage range [8, 14], no fatal chance
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedReturnFire(state, 0);

    expect(result.healthDamage).toBeGreaterThanOrEqual(8);
    expect(result.healthDamage).toBeLessThan(14);
  });

  it('front rank increases hit chance in Part 1', () => {
    // With front rank and Part 1, hit chance increases by 0.15
    // Volley 1 return fire chance is 0.15, so with front rank it becomes 0.30
    // A roll of 0.20 should hit with front rank but miss without
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.2; // hit roll: 0.2 < 0.30 (with front rank)
      if (callCount === 2) return 0.0; // damage
      return 0.99; // wound/fatal
    });

    const frontRankState = mockBattleState({
      scriptedVolley: 1,
      battlePart: 1,
      player: mockPlayer({ frontRank: true }),
    });
    const result = resolveScriptedReturnFire(frontRankState, 0);
    expect(result.healthDamage).toBeGreaterThan(0);

    vi.restoreAllMocks();

    // Without front rank, same roll should miss (0.2 > 0.15)
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const normalState = mockBattleState({
      scriptedVolley: 1,
      battlePart: 1,
      player: mockPlayer({ frontRank: false }),
    });
    const normalResult = resolveScriptedReturnFire(normalState, 0);
    expect(normalResult.healthDamage).toBe(0);
  });

  it('fatal hit deals 999 damage at close range (volley 3+)', () => {
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit
      if (callCount === 2) return 0.0; // damage
      if (callCount === 3) return 0.0; // fatal check → fatal (0.0 < 0.12)
      return 0.0;
    });
    const state = mockBattleState({ scriptedVolley: 3 });

    const result = resolveScriptedReturnFire(state, 2);

    expect(result.healthDamage).toBe(999);
    const fatalLog = result.log.find((l) => l.text.includes('Fatal'));
    expect(fatalLog).toBeDefined();
  });

  it('no fatal chance for early volleys (volley 1-2)', () => {
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 0.0; // hit
      if (callCount === 2) return 0.0; // damage
      // No fatal check should occur for idx < 2
      return 0.0; // wound type
    });
    const state = mockBattleState({ scriptedVolley: 1 });

    const result = resolveScriptedReturnFire(state, 0);

    // Should not be fatal even with all 0.0 rolls
    expect(result.healthDamage).toBeLessThan(999);
    expect(result.healthDamage).toBeGreaterThan(0);
  });
});
