import { describe, it, expect, vi } from 'vitest';
import { beginBattle, advanceTurn } from '../../core/battle';
import type { BattleState, Player, Soldier, Officer, LineState, EnemyState } from '../../types';
import {
  BattlePhase,
  DrillStep,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  ActionId,
  getHealthPoolSize,
  getStaminaPoolSize,
} from '../../types';
import { DEFAULT_EXT } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Helpers: minimal mock objects (follows morale.test.ts pattern)
// ---------------------------------------------------------------------------

function mockPlayer(overrides: Partial<Player> = {}): Player {
  const maxHp = getHealthPoolSize(45);
  const maxStam = getStaminaPoolSize(40) * 4;
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
    morale: 100,
    maxMorale: 100,
    moraleThreshold: MoraleThreshold.Steady,
    health: maxHp,
    maxHealth: maxHp,
    healthState: HealthState.Unhurt,
    stamina: maxStam,
    maxStamina: maxStam,
    fatigue: 0,
    maxFatigue: maxStam,
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

function mockOfficer(overrides: Partial<Officer> = {}): Officer {
  return {
    name: 'Capitaine Dupont',
    rank: 'captain',
    alive: true,
    wounded: false,
    mounted: true,
    status: 'commanding',
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
    phase: BattlePhase.Intro,
    turn: 0,
    drillStep: DrillStep.Present,
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
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    ...restOverrides,
  };
}

// ===========================================================================
// beginBattle
// ===========================================================================
const TEST_OPENING = 'The drums roll. The battle begins.';

describe('beginBattle', () => {
  it('creates valid initial BattleState in Line phase', () => {
    const initial = mockBattleState();
    expect(initial.phase).toBe(BattlePhase.Intro);

    const result = beginBattle(initial, TEST_OPENING);
    expect(result.phase).toBe(BattlePhase.Line);
  });

  it('does not mutate the original state', () => {
    const initial = mockBattleState();
    const result = beginBattle(initial, TEST_OPENING);
    expect(initial.phase).toBe(BattlePhase.Intro);
    expect(result.phase).toBe(BattlePhase.Line);
    expect(result).not.toBe(initial);
  });

  it('adds opening narrative to the log', () => {
    const initial = mockBattleState();
    const result = beginBattle(initial, TEST_OPENING);
    expect(result.log.length).toBeGreaterThan(0);
    expect(result.log[0].type).toBe('narrative');
    expect(result.log[0].turn).toBe(0);
    expect(result.log[0].text).toBe(TEST_OPENING);
  });

  it('sets availableActions array (empty for auto-play parts 1 & 2)', () => {
    const initial = mockBattleState({ ext: { ...DEFAULT_EXT, battlePart: 1 } });
    const result = beginBattle(initial, TEST_OPENING);
    // Parts 1 & 2 use auto-play, so scripted actions are empty
    expect(Array.isArray(result.availableActions)).toBe(true);
    expect(result.availableActions).toEqual([]);
  });

  it('populates availableActions for Part 3 gorge phase', () => {
    const initial = mockBattleState({
      ext: { ...DEFAULT_EXT, battlePart: 3 },
      drillStep: DrillStep.Present,
    });
    const result = beginBattle(initial, TEST_OPENING);
    expect(result.availableActions.length).toBeGreaterThan(0);
  });

  it('preserves player stats through beginBattle', () => {
    const initial = mockBattleState();
    const result = beginBattle(initial, TEST_OPENING);
    expect(result.player.valor).toBe(initial.player.valor);
    expect(result.player.health).toBe(initial.player.health);
    expect(result.player.morale).toBe(initial.player.morale);
    expect(result.player.stamina).toBe(initial.player.stamina);
  });
});

// ===========================================================================
// advanceTurn
// ===========================================================================
describe('advanceTurn', () => {
  it('increments the turn counter', () => {
    const state = mockBattleState({ turn: 0, phase: BattlePhase.Line });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.turn).toBe(1);
  });

  it('does not mutate the original state (immutability)', () => {
    const state = mockBattleState({ turn: 5, phase: BattlePhase.Line });
    const result = advanceTurn(state, ActionId.Fire);
    expect(state.turn).toBe(5);
    expect(result.turn).toBe(6);
    expect(result).not.toBe(state);
  });

  it('resets pendingMoraleChanges each turn', () => {
    const state = mockBattleState({
      phase: BattlePhase.Line,
      pendingMoraleChanges: [{ amount: -5, reason: 'test', source: 'passive' }],
    });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.pendingMoraleChanges).toEqual([]);
  });

  it('resets casualtiesThisTurn each turn', () => {
    const state = mockBattleState({ phase: BattlePhase.Line });
    state.line.casualtiesThisTurn = 3;
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.line.casualtiesThisTurn).toBe(0);
  });

  it('clears lastLoadResult and lastValorRoll each turn', () => {
    const state = mockBattleState({
      phase: BattlePhase.Line,
      lastLoadResult: {
        success: true,
        rollValue: 20,
        targetValue: 50,
        narrativeSteps: [],
      },
      lastValorRoll: {
        roll: 30,
        target: 50,
        outcome: 'pass',
        moraleChange: 1,
        narrative: 'test',
      },
    });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.lastLoadResult).toBeUndefined();
    expect(result.lastValorRoll).toBeUndefined();
  });

  it('state invariants hold: morale remains in [0, maxMorale]', () => {
    const state = mockBattleState({ phase: BattlePhase.Line });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.player.morale).toBeGreaterThanOrEqual(0);
    expect(result.player.morale).toBeLessThanOrEqual(result.player.maxMorale);
  });

  it('state invariants hold: health remains in [0, maxHealth]', () => {
    const state = mockBattleState({ phase: BattlePhase.Line });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.player.health).toBeGreaterThanOrEqual(0);
    expect(result.player.health).toBeLessThanOrEqual(result.player.maxHealth);
  });

  it('state invariants hold: stamina remains in [0, maxStamina]', () => {
    const state = mockBattleState({ phase: BattlePhase.Line });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.player.stamina).toBeGreaterThanOrEqual(0);
    expect(result.player.stamina).toBeLessThanOrEqual(result.player.maxStamina);
  });

  it('Line phase advanceTurn returns state without error (no-op path)', () => {
    // In Line phase, advanceTurn is essentially a no-op (auto-play handles volleys)
    const state = mockBattleState({ phase: BattlePhase.Line, turn: 3 });
    const result = advanceTurn(state, ActionId.Fire);
    expect(result.turn).toBe(4);
    expect(result.battleOver).toBe(false);
  });
});
