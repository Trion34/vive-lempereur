import { describe, it, expect, vi, afterEach } from 'vitest';
import { resolveMeleeRound } from '../../core/melee/round';
import { resolveGenericAttack } from '../../core/melee/genericAttack';
import { resolveEnemiesPhase } from '../../core/melee/enemiesPhase';
import { resolvePlayerPhase } from '../../core/melee/playerPhase';
import type { CombatantRef } from '../../core/melee/effects';
import { CLASSIC_TUNING, V2_TUNING } from '../../core/melee/tuning';
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

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// 4a. Riposte set on successful block (player only)
// ===========================================================================
describe('4a. Riposte set on successful block', () => {
  it('v2: playerRiposte is set to true when player blocks an enemy attack', () => {
    // Force: enemy hits (random < hitChance), then player blocks (random < blockChance)
    // The random calls in resolveGenericAttack: 1st for hit, 2nd for block
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      // We need the attack to "hit" (pass hit check) then the block to succeed
      // Hit check: random < hitChance => need low value
      // Block check: random < blockChance => need low value
      return 0.01; // always succeed
    });

    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    expect(ms.playerRiposte).toBe(false);

    // Player is guarding with a high block chance
    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.Guard, // playerAction
      true,                // playerGuarding
      0.95,                // playerBlockChance (very high)
      new Map(),           // allyGuarding
      false,               // playerStunned
      1,                   // turn
    );

    // The block should have succeeded and set riposte
    expect(ms.playerRiposte).toBe(true);
  });

  it('classic: playerRiposte is NOT set even when player blocks', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    const state = mockBattleState({
      // No meleeTuning => classic (riposteEnabled = false)
      meleeState: ms,
    });

    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.Guard,
      true,
      0.95,
      new Map(),
      false,
      1,
    );

    expect(ms.playerRiposte).toBe(false);
  });

  it('v2: playerRiposte not set when player is NOT guarding (even if block somehow happens)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    // Player is NOT guarding
    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.BayonetThrust,
      false,  // not guarding
      0,      // no block chance
      new Map(),
      false,
      1,
    );

    expect(ms.playerRiposte).toBe(false);
  });
});

// ===========================================================================
// 4b. Riposte damage bonus
// ===========================================================================
describe('4b. Riposte damage bonus in genericAttack', () => {
  it('v2: riposte multiplies damage by 1.25 for BayonetThrust', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // always hit, no block, no special

    const player = makePlayerRef();
    const enemy = makeEnemyRef();

    // Without riposte
    const resultNoRiposte = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, riposte: false, tuning: V2_TUNING },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    // With riposte
    const resultWithRiposte = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, riposte: true, tuning: V2_TUNING },
    );

    expect(resultWithRiposte.hit).toBe(true);
    expect(resultNoRiposte.hit).toBe(true);
    // Riposte should give 25% more damage
    expect(resultWithRiposte.damage).toBe(Math.round(resultNoRiposte.damage * 1.25));
  });

  it('classic: riposte does NOT multiply damage (riposteEnabled = false)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const player = makePlayerRef();
    const enemy = makeEnemyRef();

    const resultNoRiposte = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, riposte: false, tuning: CLASSIC_TUNING },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const resultWithRiposte = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, riposte: true, tuning: CLASSIC_TUNING },
    );

    // Damage should be the same — riposte bonus not applied in classic
    expect(resultWithRiposte.damage).toBe(resultNoRiposte.damage);
  });

  it('v2: riposte has no damage effect on ButtStrike (0 HP damage)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const player = makePlayerRef();
    const enemy = makeEnemyRef();

    const result = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.ButtStrike, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, riposte: true, tuning: V2_TUNING },
    );

    // ButtStrike always deals 0 HP damage
    expect(result.damage).toBe(0);
  });

  it('v2: riposte has no damage effect on Feint (0 HP damage)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const player = makePlayerRef();
    const enemy = makeEnemyRef();

    const result = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.Feint, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, riposte: true, tuning: V2_TUNING },
    );

    expect(result.damage).toBe(0);
  });
});

describe('4b. Riposte damage bonus in playerPhase Shoot path', () => {
  it('v2: Shoot deals bonus damage when playerRiposte is true', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // always hit

    const opp = mockOpponent({ health: 200, maxHealth: 200 });
    const ms = mockMeleeState([opp], { playerRiposte: false });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      player: mockPlayer({ musketLoaded: true }),
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);
    const dmgNoRiposte = 200 - opp.health;

    // Reset
    opp.health = 200;
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    state.player.musketLoaded = true;
    ms.reloadProgress = 0;
    ms.playerRiposte = true;

    resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);
    const dmgWithRiposte = 200 - opp.health;

    expect(dmgWithRiposte).toBe(Math.round(dmgNoRiposte * 1.25));
  });
});

// ===========================================================================
// 4c. Riposte consumed on attack
// ===========================================================================
describe('4c. Riposte consumed on attack', () => {
  it('v2: playerRiposte cleared after BayonetThrust', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.BayonetThrust, BodyPart.Torso, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(false);
  });

  it('v2: playerRiposte cleared after AggressiveLunge', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.AggressiveLunge, BodyPart.Torso, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(false);
  });

  it('v2: playerRiposte cleared after ButtStrike', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.ButtStrike, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(false);
  });

  it('v2: playerRiposte cleared after Feint', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.Feint, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(false);
  });

  it('v2: playerRiposte cleared after Shoot', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      player: mockPlayer({ musketLoaded: true }),
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.Shoot, BodyPart.Torso, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(false);
  });
});

// ===========================================================================
// 4c (continued). Riposte persists on non-attack actions
// ===========================================================================
describe('4c. Riposte persists on non-attack actions', () => {
  it('v2: playerRiposte survives Guard', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.Guard, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(true);
  });

  it('v2: playerRiposte survives Respite', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.Respite, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(true);
  });

  it('v2: playerRiposte survives Reload', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      player: mockPlayer({ musketLoaded: false }),
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.Reload, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(true);
  });

  it('v2: playerRiposte survives SecondWind', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.SecondWind, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(true);
  });

  it('v2: playerRiposte survives UseCanteen', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      player: mockPlayer({ canteenUses: 1 }),
      meleeState: ms,
    });

    resolvePlayerPhase(state, ms, MeleeActionId.UseCanteen, undefined, 0, [0], false, 1);

    expect(ms.playerRiposte).toBe(true);
  });
});

// ===========================================================================
// 4d. Riposte lost on damage taken
// ===========================================================================
describe('4d. Riposte lost on damage taken', () => {
  it('v2: playerRiposte cleared when player takes HP damage from enemy', () => {
    // Force enemy to hit and deal damage (low random = hit + no block)
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    // Player not guarding, so no block chance
    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.BayonetThrust,
      false,  // not guarding
      0,      // no block chance
      new Map(),
      false,
      1,
    );

    expect(ms.playerRiposte).toBe(false);
  });

  it('classic: playerRiposte not touched (stays false, riposteEnabled = false)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: false });
    const state = mockBattleState({
      meleeState: ms,
    });

    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.BayonetThrust,
      false,
      0,
      new Map(),
      false,
      1,
    );

    expect(ms.playerRiposte).toBe(false);
  });

  it('v2: riposte survives when enemy misses', () => {
    // Force all attacks to miss
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp], { playerRiposte: true });
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      meleeState: ms,
    });

    resolveEnemiesPhase(
      state, ms,
      MeleeActionId.BayonetThrust,
      false,
      0,
      new Map(),
      false,
      1,
    );

    // Riposte should survive since the enemy missed
    expect(ms.playerRiposte).toBe(true);
  });
});

// ===========================================================================
// 4e. Guard damage reduction from tuning
// ===========================================================================
describe('4e. Guard damage reduction from tuning', () => {
  it('classic: guard reduces damage by 15% (guardDamageReduction = 0.15)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // always hit, block fails

    const attacker = makeEnemyRef();
    const target = makePlayerRef();

    // Without guard
    const resultNoGuard = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', targetGuarding: false, targetBlockChance: 0, tuning: CLASSIC_TUNING },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    // With guard (block fails because blockChance=0)
    const resultWithGuard = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', targetGuarding: true, targetBlockChance: 0, tuning: CLASSIC_TUNING },
    );

    // Guard reduces by 15%: round(dmg * 0.85)
    expect(resultWithGuard.damage).toBe(Math.round(resultNoGuard.damage * 0.85));
  });

  it('v2: guard reduces damage by 20% (guardDamageReduction = 0.2)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const attacker = makeEnemyRef();
    const target = makePlayerRef();

    const resultNoGuard = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', targetGuarding: false, targetBlockChance: 0, tuning: V2_TUNING },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const resultWithGuard = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', targetGuarding: true, targetBlockChance: 0, tuning: V2_TUNING },
    );

    // Guard reduces by 20%: round(dmg * 0.80)
    expect(resultWithGuard.damage).toBe(Math.round(resultNoGuard.damage * 0.80));
  });

  it('guard damage reduction defaults to 0.15 when tuning is not provided', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const attacker = makeEnemyRef();
    const target = makePlayerRef();

    const resultNoGuard = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', targetGuarding: false },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const resultWithGuard = resolveGenericAttack(
      attacker, target, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'enemy', targetSide: 'player', targetGuarding: true, targetBlockChance: 0 },
    );

    // Should use default 0.15
    expect(resultWithGuard.damage).toBe(Math.round(resultNoGuard.damage * 0.85));
  });

  it('v2 guard reduction applies to enemies too', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const player = makePlayerRef();
    const enemy = makeEnemyRef();

    const resultNoGuard = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, targetGuarding: false, tuning: V2_TUNING },
    );

    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const resultWithGuard = resolveGenericAttack(
      player, enemy, null,
      MeleeActionId.BayonetThrust, BodyPart.Torso, 1,
      { side: 'player', targetSide: 'enemy', stance: MeleeStance.Balanced, targetGuarding: true, targetBlockChance: 0, tuning: V2_TUNING },
    );

    expect(resultWithGuard.damage).toBe(Math.round(resultNoGuard.damage * 0.80));
  });
});

// ===========================================================================
// 4. Integration: Full riposte lifecycle via resolveMeleeRound
// ===========================================================================
describe('4. Integration: Riposte lifecycle via resolveMeleeRound', () => {
  it('v2: Guard → block → riposte set → attack → riposte consumed', () => {
    // Round 1: Player Guards. Enemy attacks and gets blocked. Riposte set.
    let callCount = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      callCount++;
      return 0.01; // everything succeeds
    });

    const opp = mockOpponent({ health: 200, maxHealth: 200 });
    const ms = mockMeleeState([opp]);
    const state = mockBattleState({
      meleeTuning: V2_TUNING,
      player: mockPlayer({ stamina: 200, maxStamina: 200, elan: 80 }),
      meleeState: ms,
    });

    // Round 1: Guard
    resolveMeleeRound(state, MeleeActionId.Guard, undefined, 0);

    // After guard + block, playerRiposte should be true
    expect(ms.playerRiposte).toBe(true);

    // Round 2: Attack with riposte bonus
    callCount = 0;
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    state.turn = 2;

    resolveMeleeRound(state, MeleeActionId.BayonetThrust, BodyPart.Torso, 0);

    // After attacking, riposte should be consumed
    expect(ms.playerRiposte).toBe(false);
  });

  it('classic: Guard round never grants riposte', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01);

    const opp = mockOpponent();
    const ms = mockMeleeState([opp]);
    const state = mockBattleState({
      // Classic tuning — riposteEnabled = false
      player: mockPlayer({ stamina: 200, elan: 80 }),
      meleeState: ms,
    });

    resolveMeleeRound(state, MeleeActionId.Guard, undefined, 0);

    expect(ms.playerRiposte).toBe(false);
  });
});
