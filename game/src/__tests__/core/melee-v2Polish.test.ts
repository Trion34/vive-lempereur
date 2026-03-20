import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolvePlayerPhase } from '../../core/melee/playerPhase';
import { resolveEnemiesPhase } from '../../core/melee/enemiesPhase';
import { resolveAlliesPhase } from '../../core/melee/alliesPhase';
import { resolveMeleeRound } from '../../core/melee/round';
import { resolveGenericAttack } from '../../core/melee/genericAttack';
import type { CombatantRef } from '../../core/melee/effects';
import { V2_TUNING, CLASSIC_TUNING } from '../../core/melee/tuning';
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
  MilitaryRank,
  Formation,
} from '../../types';
import type {
  Player,
  BattleState,
  MeleeState,
  MeleeOpponent,
  MeleeAlly,
  RivoliExt,
} from '../../types';

// ---------------------------------------------------------------------------
// Helpers
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
    momentum: 0,
    freeStrikeReady: false,
    observedPlayerActions: [],
    temperament: 50,
    ...overrides,
  };
}

function mockAlly(overrides: Partial<MeleeAlly> = {}): MeleeAlly {
  return {
    id: 'ally_1',
    name: 'Pierre — Ally',
    type: 'named',
    health: 80,
    maxHealth: 80,
    stamina: 150,
    maxStamina: 150,
    fatigue: 0,
    maxFatigue: 150,
    strength: 35,
    elan: 40,
    alive: true,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A loyal comrade.',
    personality: 'balanced',
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
    playerMomentum: 0,
    playerFreeStrikeReady: false,
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
    } as RivoliExt,
    configId: 'rivoli',
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    pendingVirtueChange: 0,
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    playerRank: MilitaryRank.Private,
    rankState: {
      heldVolleyBonus: false,
      refuseFlankTurns: 0,
      holdCount: 0,
      fixedBayonetsEarly: false,
      requestSupportCooldown: 0,
      refuseFlankUsed: false,
      rangeModifier: 0,
    },
    formation: Formation.Line,
    formationChosen: false,
    ...restOverrides,
  };
}

function makePlayerRef(overrides: Partial<CombatantRef> = {}): CombatantRef {
  return {
    name: 'Test Soldier',
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

function makeEnemyRef(overrides: Partial<CombatantRef> = {}): CombatantRef {
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
    type: 'conscript',
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    ...overrides,
  };
}

// ============================================================
// C1: RoundAction fields type check
// ============================================================

describe('Phase C1 — RoundAction v2 fields exist', () => {
  it('new optional fields are accepted by the type system', () => {
    const action: import('../../types').RoundAction = {
      actorName: 'test',
      actorSide: 'player',
      targetName: 'enemy',
      action: MeleeActionId.BayonetThrust,
      hit: true,
      damage: 10,
      momentumAfter: 2,
      freeStrikeEarned: true,
      momentumBroken: false,
      riposteEarned: true,
      killRefund: 15,
      freeStrikeUsed: true,
    };
    expect(action.momentumAfter).toBe(2);
    expect(action.freeStrikeEarned).toBe(true);
    expect(action.momentumBroken).toBe(false);
    expect(action.riposteEarned).toBe(true);
    expect(action.killRefund).toBe(15);
    expect(action.freeStrikeUsed).toBe(true);
  });
});

// ============================================================
// C2: MeleeState.freeStrikeUsedThisRound
// ============================================================

describe('Phase C2 — MeleeState transient flag', () => {
  it('freeStrikeUsedThisRound defaults to undefined', () => {
    const ms = mockMeleeState([mockOpponent()]);
    expect(ms.freeStrikeUsedThisRound).toBeUndefined();
  });
});

// ============================================================
// C3: Player phase populates metadata
// ============================================================

describe('Phase C3 — Player phase RoundAction metadata', () => {
  afterEach(() => vi.restoreAllMocks());

  it('generic attack (BayonetThrust) populates momentumAfter on hit (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerActions = ms.roundLog.filter(a => a.actorSide === 'player' && a.action === MeleeActionId.BayonetThrust);
    expect(playerActions.length).toBe(1);
    expect(playerActions[0].momentumAfter).toBe(1); // 0 -> 1 on hit
    expect(playerActions[0].freeStrikeEarned).toBe(false);
  });

  it('generic attack sets freeStrikeEarned when momentum goes 2 -> 3', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerMomentum: 2 });
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerActions = ms.roundLog.filter(a => a.actorSide === 'player');
    expect(playerActions[0].momentumAfter).toBe(3);
    expect(playerActions[0].freeStrikeEarned).toBe(true);
  });

  it('generic attack sets momentumBroken when enemy has momentum and takes big hit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ momentum: 2 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerHits = ms.roundLog.filter(a => a.actorSide === 'player' && a.hit);
    if (playerHits.length > 0 && playerHits[0].damage > opp.maxHealth * V2_TUNING.momentumResetThreshold) {
      expect(playerHits[0].momentumBroken).toBe(true);
    }
  });

  it('generic attack does NOT set momentumBroken when enemy has momentum 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ momentum: 0 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerHits = ms.roundLog.filter(a => a.actorSide === 'player' && a.hit);
    if (playerHits.length > 0) {
      // momentum was 0 so momentumBroken should be false/undefined
      expect(playerHits[0].momentumBroken).toBeFalsy();
    }
  });

  it('freeStrikeUsed is set when freeStrikeUsedThisRound is true', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { freeStrikeUsedThisRound: true });
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerActions = ms.roundLog.filter(a => a.actorSide === 'player');
    expect(playerActions[0].freeStrikeUsed).toBe(true);
    // Flag should be cleared after use
    expect(ms.freeStrikeUsedThisRound).toBe(false);
  });

  it('classic tuning does NOT populate momentum fields', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerActions = ms.roundLog.filter(a => a.actorSide === 'player');
    expect(playerActions[0].momentumAfter).toBeUndefined();
    expect(playerActions[0].freeStrikeEarned).toBeUndefined();
  });

  it('Shoot path populates momentumAfter (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    state.player.musketLoaded = true;
    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);

    const shootActions = ms.roundLog.filter(a => a.action === MeleeActionId.Shoot);
    expect(shootActions.length).toBe(1);
    expect(shootActions[0].momentumAfter).toBeDefined();
  });

  it('Shoot path sets momentumBroken when target had momentum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    state.player.musketLoaded = true;
    const opp = mockOpponent({ momentum: 2 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);

    const shootActions = ms.roundLog.filter(a => a.action === MeleeActionId.Shoot && a.hit);
    if (shootActions.length > 0) {
      // Shoot does big damage so threshold should be exceeded
      expect(shootActions[0].momentumBroken).toBe(true);
    }
  });

  it('Feint populates momentumAfter (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.Feint, undefined, 0, [0], false, 1);

    const feintActions = ms.roundLog.filter(a => a.action === MeleeActionId.Feint);
    expect(feintActions.length).toBe(1);
    expect(feintActions[0].momentumAfter).toBeDefined();
  });

  it('ButtStrike populates momentumAfter (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.ButtStrike, undefined, 0, [0], false, 1);

    const bsActions = ms.roundLog.filter(a => a.action === MeleeActionId.ButtStrike);
    expect(bsActions.length).toBe(1);
    expect(bsActions[0].momentumAfter).toBeDefined();
  });

  it('kill refund populates killRefund field on most recent player hit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    // Low-health opponent that will die from a hit
    const opp = mockOpponent({ health: 1 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerHits = ms.roundLog.filter(a => a.actorSide === 'player' && a.hit);
    expect(playerHits.length).toBeGreaterThanOrEqual(1);
    expect(playerHits[playerHits.length - 1].killRefund).toBe(V2_TUNING.killStaminaRefund);
  });

  it('classic tuning does NOT set killRefund (killStaminaRefund = 0)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });
    const opp = mockOpponent({ health: 1 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const playerHits = ms.roundLog.filter(a => a.actorSide === 'player' && a.hit);
    for (const hit of playerHits) {
      expect(hit.killRefund).toBeUndefined();
    }
  });
});

// ============================================================
// C4: Enemy phase populates metadata
// ============================================================

describe('Phase C4 — Enemy phase RoundAction metadata', () => {
  afterEach(() => vi.restoreAllMocks());

  it('enemy attack populates momentumAfter on hit (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ health: 80, stamina: 100 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolveEnemiesPhase(state, ms, MeleeActionId.Guard, false, 0, new Map(), false, 1);

    const enemyActions = ms.roundLog.filter(a => a.actorSide === 'enemy' && a.action !== MeleeActionId.Guard && a.action !== MeleeActionId.Respite && a.action !== MeleeActionId.SecondWind);
    // If there are enemy attack actions, they should have momentumAfter
    for (const action of enemyActions) {
      expect(action.momentumAfter).toBeDefined();
    }
  });

  it('enemy freeStrikeUsed is set when enemy had freeStrikeReady', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ momentum: 3, freeStrikeReady: true, stamina: 100 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolveEnemiesPhase(state, ms, MeleeActionId.Guard, false, 0, new Map(), false, 1);

    const enemyAttacks = ms.roundLog.filter(a => a.actorSide === 'enemy' && a.hit);
    // If an attack was resolved, freeStrikeUsed should be true
    for (const action of enemyAttacks) {
      if (action.freeStrikeUsed !== undefined) {
        expect(action.freeStrikeUsed).toBe(true);
      }
    }
  });

  it('riposteEarned is set when player blocks while guarding (v2)', () => {
    // Mock random to produce: hit (for enemy attack) then block (for player guard)
    const mockRandom = vi.spyOn(Math, 'random');
    // Pattern: hit chance passes (0.01), block chance passes (0.01)
    mockRandom.mockReturnValue(0.01);

    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ stamina: 100 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.Guard, // player action
      true, // playerGuarding
      0.99, // high block chance
      new Map(), false, 1,
    );

    const enemyActions = ms.roundLog.filter(a => a.actorSide === 'enemy');
    const blockedActions = enemyActions.filter(a => a.blocked);
    for (const action of blockedActions) {
      expect(action.riposteEarned).toBe(true);
    }
  });

  it('classic tuning does NOT populate enemy momentum fields', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: CLASSIC_TUNING });
    const opp = mockOpponent({ stamina: 100 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    resolveEnemiesPhase(state, ms, MeleeActionId.Guard, false, 0, new Map(), false, 1);

    for (const action of ms.roundLog) {
      expect(action.momentumAfter).toBeUndefined();
      expect(action.freeStrikeEarned).toBeUndefined();
      expect(action.freeStrikeUsed).toBeUndefined();
    }
  });
});

// ============================================================
// C5: Ally phase populates metadata
// ============================================================

describe('Phase C5 — Ally phase RoundAction metadata', () => {
  afterEach(() => vi.restoreAllMocks());

  it('ally sets momentumBroken when damaging enemy with momentum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hit
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ momentum: 2, health: 80 });
    const ally = mockAlly({ stamina: 100, elan: 50 });
    const ms = mockMeleeState([opp], { allies: [ally] });
    state.meleeState = ms;

    resolveAlliesPhase(state, ms, 1);

    const allyHits = ms.roundLog.filter(a => a.actorSide === 'ally' && a.hit && a.damage > 0);
    // If ally dealt enough HP damage to exceed threshold, momentumBroken should be true
    for (const hit of allyHits) {
      if (hit.damage > opp.maxHealth * V2_TUNING.momentumResetThreshold) {
        expect(hit.momentumBroken).toBe(true);
      }
    }
  });

  it('ally does NOT set momentumBroken when enemy has 0 momentum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ momentum: 0 });
    const ally = mockAlly({ stamina: 100 });
    const ms = mockMeleeState([opp], { allies: [ally] });
    state.meleeState = ms;

    resolveAlliesPhase(state, ms, 1);

    const allyHits = ms.roundLog.filter(a => a.actorSide === 'ally' && a.hit);
    for (const hit of allyHits) {
      // momentumBroken should be false since enemy had 0 momentum
      expect(hit.momentumBroken).toBeFalsy();
    }
  });
});

// ============================================================
// C6: Transient flag lifecycle
// ============================================================

describe('Phase C6 — freeStrikeUsedThisRound lifecycle in round.ts', () => {
  afterEach(() => vi.restoreAllMocks());

  it('freeStrikeUsedThisRound is set when free strike fires, cleared at round end', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // ensure hits
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp], {
      playerMomentum: 3,
      playerFreeStrikeReady: true,
    });
    state.meleeState = ms;

    resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);

    // After round resolves, freeStrikeUsedThisRound should be cleared
    expect(ms.freeStrikeUsedThisRound).toBeUndefined();
  });

  it('player attack RoundAction has freeStrikeUsed=true when free strike was consumed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp], {
      playerMomentum: 3,
      playerFreeStrikeReady: true,
    });
    state.meleeState = ms;

    resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);

    const playerAttacks = ms.roundLog.filter(a => a.actorSide === 'player' && a.action === MeleeActionId.BayonetThrust);
    expect(playerAttacks.length).toBe(1);
    expect(playerAttacks[0].freeStrikeUsed).toBe(true);
  });
});

// ============================================================
// Phase D: Enriched Combat Log
// ============================================================

describe('Phase D — Enriched combat log text', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hit text includes (Momentum) annotation when momentum >= 2 (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const result = resolveGenericAttack(
      makePlayerRef(),
      makeEnemyRef(),
      mockOpponent(),
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      {
        side: 'player',
        targetSide: 'enemy',
        stance: MeleeStance.Balanced,
        tuning: V2_TUNING,
        attackerMomentum: 2,
        attackerStamina: 100,
        targetStamina: 100,
      },
    );
    expect(result.hit).toBe(true);
    const resultLog = result.log.find(l => l.text.includes('Hit.'));
    expect(resultLog?.text).toContain('(Momentum)');
  });

  it('hit text includes (Riposte) annotation when riposte active (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const result = resolveGenericAttack(
      makePlayerRef(),
      makeEnemyRef(),
      mockOpponent(),
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      {
        side: 'player',
        targetSide: 'enemy',
        stance: MeleeStance.Balanced,
        riposte: true,
        tuning: V2_TUNING,
        attackerMomentum: 0,
        attackerStamina: 100,
        targetStamina: 100,
      },
    );
    expect(result.hit).toBe(true);
    const resultLog = result.log.find(l => l.text.includes('Hit.'));
    expect(resultLog?.text).toContain('(Riposte)');
  });

  it('hit text includes both (Momentum) and (Riposte) when both active', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const result = resolveGenericAttack(
      makePlayerRef(),
      makeEnemyRef(),
      mockOpponent(),
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      {
        side: 'player',
        targetSide: 'enemy',
        stance: MeleeStance.Balanced,
        riposte: true,
        tuning: V2_TUNING,
        attackerMomentum: 2,
        attackerStamina: 100,
        targetStamina: 100,
      },
    );
    expect(result.hit).toBe(true);
    const resultLog = result.log.find(l => l.text.includes('Hit.'));
    expect(resultLog?.text).toContain('(Momentum)');
    expect(resultLog?.text).toContain('(Riposte)');
  });

  it('miss text includes (Exhausted) when attacker stamina <= 0 (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // ensure miss
    const result = resolveGenericAttack(
      makePlayerRef(),
      makeEnemyRef(),
      mockOpponent(),
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      {
        side: 'player',
        targetSide: 'enemy',
        stance: MeleeStance.Balanced,
        tuning: V2_TUNING,
        attackerMomentum: 0,
        attackerStamina: 0,
        targetStamina: 100,
      },
    );
    expect(result.hit).toBe(false);
    const missLog = result.log.find(l => l.text.includes('Miss'));
    expect(missLog?.text).toContain('(Exhausted)');
  });

  it('miss text does NOT include (Exhausted) when stamina > 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const result = resolveGenericAttack(
      makePlayerRef(),
      makeEnemyRef(),
      mockOpponent(),
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      {
        side: 'player',
        targetSide: 'enemy',
        stance: MeleeStance.Balanced,
        tuning: V2_TUNING,
        attackerMomentum: 0,
        attackerStamina: 100,
        targetStamina: 100,
      },
    );
    expect(result.hit).toBe(false);
    const missLog = result.log.find(l => l.text.includes('Miss'));
    expect(missLog?.text).not.toContain('(Exhausted)');
  });

  it('classic tuning does NOT add v2 annotations to hit text', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const result = resolveGenericAttack(
      makePlayerRef(),
      makeEnemyRef(),
      mockOpponent(),
      MeleeActionId.BayonetThrust,
      BodyPart.Torso,
      1,
      {
        side: 'player',
        targetSide: 'enemy',
        stance: MeleeStance.Balanced,
        tuning: CLASSIC_TUNING,
        attackerMomentum: 2,
        attackerStamina: 100,
        targetStamina: 100,
      },
    );
    const resultLog = result.log.find(l => l.text.includes('Hit') || l.text.includes('Miss'));
    expect(resultLog?.text).not.toContain('(Momentum)');
    expect(resultLog?.text).not.toContain('(Exhausted)');
  });

  it('free-strike attack prepends "Free Strike! " to log text', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent();
    const ms = mockMeleeState([opp], {
      freeStrikeUsedThisRound: true,
    });
    state.meleeState = ms;

    const result = resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const freeStrikeLog = result.log.find(l => l.text.startsWith('Free Strike!'));
    expect(freeStrikeLog).toBeDefined();
  });

  it('kill refund adds log entry "Stamina refunded (+N)." (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    const opp = mockOpponent({ health: 1 });
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    const result = resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    const refundLog = result.log.find(l => l.text.includes('Stamina refunded'));
    expect(refundLog).toBeDefined();
    expect(refundLog!.text).toContain(`+${V2_TUNING.killStaminaRefund}`);
  });

  it('Shoot hit includes v2 tags when momentum >= 2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    state.player.musketLoaded = true;
    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerMomentum: 2 });
    state.meleeState = ms;

    const result = resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);

    const shootLog = result.log.find(l => l.text.includes('Shot hits'));
    expect(shootLog?.text).toContain('(Momentum)');
  });

  it('Shoot miss includes (Exhausted) when stamina <= 0 (v2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = mockBattleState({ meleeTuning: V2_TUNING });
    state.player.musketLoaded = true;
    state.player.stamina = 0;
    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    state.meleeState = ms;

    const result = resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);

    const missLog = result.log.find(l => l.text.includes('misses'));
    expect(missLog?.text).toContain('(Exhausted)');
  });
});
