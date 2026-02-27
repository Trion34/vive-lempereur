import { describe, it, expect } from 'vitest';
import { getScriptedAvailableActions } from '../../core/volleys/actions';
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
  ActionId,
  MoraleThreshold,
  HealthState,
  FatigueTier,
} from '../../types';
import { DEFAULT_EXT } from '../helpers/mockFactories';
// Import to register Rivoli config in the battle registry (side-effect)
import '../../data/battles/rivoli';

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
    configId: 'rivoli',
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    ...restOverrides,
  };
}

// ===========================================================================
// getScriptedAvailableActions
// ===========================================================================
describe('getScriptedAvailableActions', () => {
  describe('Part 3 (Gorge) — Present step', () => {
    it('returns gorge target actions for Present step in Part 3', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3, wagonDamage: 0 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      expect(actions.length).toBe(4);
      const ids = actions.map((a) => a.id);
      expect(ids).toContain(ActionId.TargetColumn);
      expect(ids).toContain(ActionId.TargetOfficers);
      expect(ids).toContain(ActionId.TargetWagon);
      expect(ids).toContain(ActionId.ShowMercy);
    });

    it('returned actions have correct ActionId values', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3, wagonDamage: 0 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      expect(actions[0].id).toBe(ActionId.TargetColumn);
      expect(actions[1].id).toBe(ActionId.TargetOfficers);
      expect(actions[2].id).toBe(ActionId.TargetWagon);
      expect(actions[3].id).toBe(ActionId.ShowMercy);
    });

    it('all Present actions have drillStep = Present', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      for (const action of actions) {
        expect(action.drillStep).toBe(DrillStep.Present);
      }
    });

    it('TargetWagon is unavailable when wagonDamage >= 100', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3, wagonDamage: 100 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      const wagonAction = actions.find((a) => a.id === ActionId.TargetWagon);
      expect(wagonAction).toBeDefined();
      expect(wagonAction!.available).toBe(false);
    });

    it('TargetWagon is available when wagonDamage < 100', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3, wagonDamage: 50 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      const wagonAction = actions.find((a) => a.id === ActionId.TargetWagon);
      expect(wagonAction).toBeDefined();
      expect(wagonAction!.available).toBe(true);
    });

    it('TargetColumn and ShowMercy have Breaking minThreshold', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      const column = actions.find((a) => a.id === ActionId.TargetColumn);
      expect(column!.minThreshold).toBe(MoraleThreshold.Breaking);

      const mercy = actions.find((a) => a.id === ActionId.ShowMercy);
      expect(mercy!.minThreshold).toBe(MoraleThreshold.Breaking);
    });

    it('TargetOfficers and TargetWagon have Shaken minThreshold', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3, wagonDamage: 0 },
        drillStep: DrillStep.Present,
      });

      const actions = getScriptedAvailableActions(state);

      const officers = actions.find((a) => a.id === ActionId.TargetOfficers);
      expect(officers!.minThreshold).toBe(MoraleThreshold.Shaken);

      const wagon = actions.find((a) => a.id === ActionId.TargetWagon);
      expect(wagon!.minThreshold).toBe(MoraleThreshold.Shaken);
    });
  });

  describe('Part 3 (Gorge) — Fire step', () => {
    it('returns single Fire action for Fire step in Part 3', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Fire,
      });

      const actions = getScriptedAvailableActions(state);

      expect(actions).toHaveLength(1);
      expect(actions[0].id).toBe(ActionId.Fire);
      expect(actions[0].drillStep).toBe(DrillStep.Fire);
      expect(actions[0].available).toBe(true);
    });

    it('Fire action has Breaking minThreshold', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Fire,
      });

      const actions = getScriptedAvailableActions(state);

      expect(actions[0].minThreshold).toBe(MoraleThreshold.Breaking);
    });
  });

  describe('Parts 1 & 2 — auto-play returns empty', () => {
    it('returns empty array for Part 1 (any drill step)', () => {
      for (const step of [DrillStep.Load, DrillStep.Present, DrillStep.Fire, DrillStep.Endure]) {
        const state = mockBattleState({
          ext: { ...DEFAULT_EXT, battlePart: 1 },
          drillStep: step,
        });
        const actions = getScriptedAvailableActions(state);
        expect(actions).toHaveLength(0);
      }
    });

    it('returns empty array for Part 2 (any drill step)', () => {
      for (const step of [DrillStep.Load, DrillStep.Present, DrillStep.Fire, DrillStep.Endure]) {
        const state = mockBattleState({
          ext: { ...DEFAULT_EXT, battlePart: 2 },
          drillStep: step,
        });
        const actions = getScriptedAvailableActions(state);
        expect(actions).toHaveLength(0);
      }
    });
  });

  describe('actions change based on drill step', () => {
    it('Present step in Part 3 gives 4 target actions', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Present,
      });
      const actions = getScriptedAvailableActions(state);
      expect(actions.length).toBe(4);
    });

    it('Fire step in Part 3 gives 1 Fire action', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Fire,
      });
      const actions = getScriptedAvailableActions(state);
      expect(actions.length).toBe(1);
      expect(actions[0].id).toBe(ActionId.Fire);
    });

    it('Load step in Part 3 returns empty (no gorge-specific Load actions)', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Load,
      });
      const actions = getScriptedAvailableActions(state);
      expect(actions).toHaveLength(0);
    });

    it('Endure step in Part 3 returns empty (no gorge-specific Endure actions)', () => {
      const state = mockBattleState({
        ext: { ...DEFAULT_EXT, battlePart: 3 },
        drillStep: DrillStep.Endure,
      });
      const actions = getScriptedAvailableActions(state);
      expect(actions).toHaveLength(0);
    });
  });
});
