import { describe, it, expect } from 'vitest';
import { createNewGame, createBattleFromCharacter, handleBattleVictory, advanceToNextNode, transitionToCamp } from '../../core/gameLoop';
import type { PlayerCharacter, NPC, GameState } from '../../types';
import {
  GamePhase,
  CampaignPhase,
  BattlePhase,
  DrillStep,
  MilitaryRank,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  NPCRole,
  getHealthPoolSize,
  getStaminaPoolSize,
} from '../../types';
// Register Italy campaign so createNewGame('italy') works
import '../../data/campaigns/italy';
// Register Rivoli battle config
import '../../data/battles/rivoli';

// ---------------------------------------------------------------------------
// Helpers: minimal mock factories
// ---------------------------------------------------------------------------

function mockPlayerCharacter(overrides: Partial<PlayerCharacter> = {}): PlayerCharacter {
  return {
    name: 'Test Soldier',
    rank: MilitaryRank.Private,
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    health: 100,
    morale: 100,
    stamina: 100,
    grace: 0,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Socket bayonet',
      musketCondition: 70,
      uniformCondition: 50,
    },
    ...overrides,
  };
}

function mockNPCs(): NPC[] {
  return [
    {
      id: 'pierre',
      name: 'Pierre',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 60,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 55,
    },
    {
      id: 'jean-baptiste',
      name: 'Jean-Baptiste',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 40,
      alive: true,
      wounded: false,
      morale: 70,
      maxMorale: 85,
      valor: 20,
    },
    {
      id: 'duval',
      name: 'Sergeant Duval',
      role: NPCRole.NCO,
      rank: MilitaryRank.Sergeant,
      relationship: 20,
      alive: true,
      wounded: false,
      morale: 95,
      maxMorale: 100,
      valor: 65,
    },
    {
      id: 'leclerc',
      name: 'Captain Leclerc',
      role: NPCRole.Officer,
      rank: MilitaryRank.Captain,
      relationship: 30,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 60,
    },
  ];
}

// ===========================================================================
// createNewGame
// ===========================================================================
describe('createNewGame', () => {
  it('returns a valid GameState with all required fields', () => {
    const game = createNewGame();
    expect(game).toHaveProperty('phase');
    expect(game).toHaveProperty('player');
    expect(game).toHaveProperty('npcs');
    expect(game).toHaveProperty('campaign');
  });

  it('starts in Camp phase (placeholder for interlude routing)', () => {
    const game = createNewGame();
    expect(game.phase).toBe(GamePhase.Camp);
  });

  it('creates a PlayerCharacter with valid stat ranges', () => {
    const game = createNewGame();
    const pc = game.player;
    // All stats should be positive numbers
    expect(pc.valor).toBeGreaterThan(0);
    expect(pc.musketry).toBeGreaterThan(0);
    expect(pc.elan).toBeGreaterThan(0);
    expect(pc.strength).toBeGreaterThan(0);
    expect(pc.endurance).toBeGreaterThan(0);
    expect(pc.constitution).toBeGreaterThan(0);
    expect(pc.charisma).toBeGreaterThan(0);
    expect(pc.intelligence).toBeGreaterThan(0);
    expect(pc.awareness).toBeGreaterThan(0);
  });

  it('creates NPCs array with expected campaign characters', () => {
    const game = createNewGame();
    expect(game.npcs.length).toBeGreaterThanOrEqual(4);
    const ids = game.npcs.map((n) => n.id);
    expect(ids).toContain('pierre');
    expect(ids).toContain('jean-baptiste');
    expect(ids).toContain('leclerc');
  });

  it('creates a valid campaign state starting at the prologue interlude', () => {
    const game = createNewGame();
    expect(game.campaign.campaignId).toBe('italy');
    expect(game.campaign.sequenceIndex).toBe(0);
    // First node in Italy is an interlude (prologue)
    expect(game.campaign.phase).toBe(CampaignPhase.Interlude);
    expect(game.campaign.battlesCompleted).toBe(0);
    expect(game.campaign.currentBattle).toBe('rivoli');
    expect(game.campaign.daysInCampaign).toBe(0);
    expect(game.campaign.npcDeaths).toEqual([]);
    expect(game.campaign.replacementsUsed).toEqual([]);
  });

  it('initializes player equipment', () => {
    const game = createNewGame();
    expect(game.player.equipment).toBeDefined();
    expect(game.player.equipment.musket).toBeTruthy();
    expect(game.player.equipment.bayonet).toBeTruthy();
  });
});

// ===========================================================================
// createBattleFromCharacter
// ===========================================================================
describe('createBattleFromCharacter', () => {
  it('creates a valid BattleState', () => {
    const pc = mockPlayerCharacter();
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    expect(battle.phase).toBe(BattlePhase.Intro);
    expect(battle.turn).toBe(0);
    expect(battle.drillStep).toBe(DrillStep.Present);
    expect(battle.battleOver).toBe(false);
    expect(battle.outcome).toBe('pending');
  });

  it('maps player stats correctly from PlayerCharacter to Player', () => {
    const pc = mockPlayerCharacter({
      valor: 55,
      musketry: 42,
      elan: 38,
      strength: 50,
      endurance: 45,
      constitution: 60,
      charisma: 25,
      intelligence: 35,
      awareness: 40,
    });
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    expect(battle.player.name).toBe(pc.name);
    expect(battle.player.valor).toBe(55);
    expect(battle.player.musketry).toBe(42);
    expect(battle.player.elan).toBe(38);
    expect(battle.player.strength).toBe(50);
    expect(battle.player.endurance).toBe(45);
    expect(battle.player.constitution).toBe(60);
    expect(battle.player.charisma).toBe(25);
    expect(battle.player.intelligence).toBe(35);
    expect(battle.player.awareness).toBe(40);
  });

  it('uses getHealthPoolSize(constitution) for health pool', () => {
    const pc = mockPlayerCharacter({ constitution: 60 });
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    const expectedMaxHp = getHealthPoolSize(60);
    expect(battle.player.maxHealth).toBe(expectedMaxHp);
  });

  it('uses getStaminaPoolSize(endurance) * 4 for stamina pool', () => {
    const pc = mockPlayerCharacter({ endurance: 50 });
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    const expectedMaxStam = getStaminaPoolSize(50) * 4;
    expect(battle.player.maxStamina).toBe(expectedMaxStam);
  });

  it('health scales from PC percentage to battle pool', () => {
    // PC health is 0-100 percentage, battle health is actual pool
    const pc = mockPlayerCharacter({ constitution: 45, health: 50 }); // 50%
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    const maxHp = getHealthPoolSize(45);
    const expectedHealth = Math.round((50 / 100) * maxHp);
    expect(battle.player.health).toBe(expectedHealth);
  });

  it('stamina scales from PC percentage to battle pool', () => {
    const pc = mockPlayerCharacter({ endurance: 40, stamina: 75 }); // 75%
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    const maxStam = getStaminaPoolSize(40) * 4;
    const expectedStamina = Math.round((75 / 100) * maxStam);
    expect(battle.player.stamina).toBe(expectedStamina);
  });

  it('starts with full health when PC health is 100', () => {
    const pc = mockPlayerCharacter({ constitution: 45, health: 100 });
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    expect(battle.player.health).toBe(battle.player.maxHealth);
  });

  it('starts with full stamina when PC stamina is 100', () => {
    const pc = mockPlayerCharacter({ endurance: 40, stamina: 100 });
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(pc, npcs);

    expect(battle.player.stamina).toBe(battle.player.maxStamina);
  });

  it('sets correct healthState based on health percentage', () => {
    const pcFull = mockPlayerCharacter({ health: 100 });
    const battleFull = createBattleFromCharacter(pcFull, mockNPCs());
    expect(battleFull.player.healthState).toBe(HealthState.Unhurt);

    const pcLow = mockPlayerCharacter({ health: 10 });
    const battleLow = createBattleFromCharacter(pcLow, mockNPCs());
    // 10% of pool should be Critical (< 15%)
    expect(battleLow.player.healthState).toBe(HealthState.Critical);
  });

  it('sets moraleThreshold correctly from morale value', () => {
    const pcSteady = mockPlayerCharacter({ morale: 80 });
    const battleSteady = createBattleFromCharacter(pcSteady, mockNPCs());
    expect(battleSteady.player.moraleThreshold).toBe(MoraleThreshold.Steady);

    const pcLow = mockPlayerCharacter({ morale: 10 });
    const battleLow = createBattleFromCharacter(pcLow, mockNPCs());
    expect(battleLow.player.moraleThreshold).toBe(MoraleThreshold.Breaking);
  });

  it('initializes fatigue at Fresh tier', () => {
    const pc = mockPlayerCharacter();
    const battle = createBattleFromCharacter(pc, mockNPCs());
    expect(battle.player.fatigue).toBe(0);
    expect(battle.player.fatigueTier).toBe(FatigueTier.Fresh);
  });

  it('sets maxFatigue equal to maxStamina', () => {
    const pc = mockPlayerCharacter({ endurance: 40 });
    const battle = createBattleFromCharacter(pc, mockNPCs());
    expect(battle.player.maxFatigue).toBe(battle.player.maxStamina);
  });

  it('maps soldierRep, officerRep, napoleonRep from PC', () => {
    const pc = mockPlayerCharacter({
      soldierRep: 70,
      officerRep: 30,
      napoleonRep: 10,
    });
    const battle = createBattleFromCharacter(pc, mockNPCs());
    expect(battle.player.soldierRep).toBe(70);
    expect(battle.player.officerRep).toBe(30);
    expect(battle.player.napoleonRep).toBe(10);
  });

  it('creates line with neighbours from NPCs', () => {
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(mockPlayerCharacter(), npcs);

    expect(battle.line.leftNeighbour).not.toBeNull();
    expect(battle.line.leftNeighbour!.name).toBe('Pierre');
    expect(battle.line.rightNeighbour).not.toBeNull();
    expect(battle.line.rightNeighbour!.name).toBe('Jean-Baptiste');
  });

  it('creates officer from NPC data', () => {
    const npcs = mockNPCs();
    const battle = createBattleFromCharacter(mockPlayerCharacter(), npcs);

    expect(battle.line.officer).toBeDefined();
    expect(battle.line.officer.alive).toBe(true);
  });

  it('initializes battle tracking fields correctly', () => {
    const battle = createBattleFromCharacter(mockPlayerCharacter(), mockNPCs());

    expect(battle.scriptedVolley).toBe(1);
    expect(battle.chargeEncounter).toBe(0);
    expect(battle.ext.battlePart).toBe(1);
    expect(battle.ext.batteryCharged).toBe(false);
    expect(battle.ext.meleeStage).toBe(0);
    expect(battle.ext.wagonDamage).toBe(0);
    expect(battle.ext.gorgeMercyCount).toBe(0);
    expect(battle.autoPlayActive).toBe(false);
    expect(battle.autoPlayVolleyCompleted).toBe(0);
    expect(battle.graceEarned).toBe(false);
  });

  it('initializes empty log and no available actions', () => {
    const battle = createBattleFromCharacter(mockPlayerCharacter(), mockNPCs());
    expect(battle.log).toEqual([]);
    expect(battle.availableActions).toEqual([]);
  });

  it('player starts alive, not routing, musket loaded', () => {
    const battle = createBattleFromCharacter(mockPlayerCharacter(), mockNPCs());
    expect(battle.player.alive).toBe(true);
    expect(battle.player.routing).toBe(false);
    expect(battle.player.musketLoaded).toBe(true);
    expect(battle.player.fumbledLoad).toBe(false);
  });

  it('health pool formula: getHealthPoolSize returns 30 + round(1.5 * constitution)', () => {
    // Verify the formula itself for a few values
    expect(getHealthPoolSize(0)).toBe(30);
    expect(getHealthPoolSize(45)).toBe(30 + Math.round(1.5 * 45)); // 98
    expect(getHealthPoolSize(100)).toBe(30 + Math.round(1.5 * 100)); // 180
  });

  it('stamina pool formula: getStaminaPoolSize returns 30 + round(1.5 * endurance)', () => {
    expect(getStaminaPoolSize(0)).toBe(30);
    expect(getStaminaPoolSize(40)).toBe(30 + Math.round(1.5 * 40)); // 90
    expect(getStaminaPoolSize(100)).toBe(30 + Math.round(1.5 * 100)); // 180
  });
});

// ===========================================================================
// Campaign transitions (sequence-based)
// ===========================================================================
describe('campaign transitions', () => {
  function makeGameAtBattle(): GameState {
    const gs = createNewGame('italy');
    // Advance past prologue interlude to camp, then to battle (Rivoli)
    // Sequence: [0: interlude, 1: camp, 2: battle(rivoli), ...]
    // Manually set to Rivoli battle state
    gs.campaign = { ...gs.campaign, sequenceIndex: 2, phase: CampaignPhase.Battle };
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
    return gs;
  }

  it('createNewGame finds Rivoli in sequence', () => {
    const game = createNewGame('italy');
    expect(game.campaign.currentBattle).toBe('rivoli');
    expect(game.campaign.sequenceIndex).toBe(0); // starts at first node (interlude)
    expect(game.campaign.campaignId).toBe('italy');
  });

  it('handleBattleVictory records the victory and clears battleState', () => {
    const gs = makeGameAtBattle();
    gs.battleState!.battleOver = true;
    gs.battleState!.outcome = 'victory';

    handleBattleVictory(gs);

    expect(gs.campaign.battlesCompleted).toBe(1);
    expect(gs.battleState).toBeUndefined();
  });

  it('advanceToNextNode from Rivoli battle goes to after-rivoli camp', () => {
    const gs = makeGameAtBattle();
    gs.battleState!.battleOver = true;
    gs.battleState!.outcome = 'victory';
    handleBattleVictory(gs);

    advanceToNextNode(gs);

    // Next node after battle(rivoli, idx 2) is camp(after-rivoli, idx 3)
    expect(gs.campaign.sequenceIndex).toBe(3);
    expect(gs.campaign.phase).toBe(CampaignPhase.Camp);
    expect(gs.phase).toBe(GamePhase.Camp);
    expect(gs.campState).toBeDefined();
  });

  it('advanceToNextNode from after-rivoli camp goes to rivoli-mantua interlude', () => {
    const gs = makeGameAtBattle();
    handleBattleVictory(gs);
    // Move to after-rivoli camp (idx 3)
    advanceToNextNode(gs);
    expect(gs.campaign.sequenceIndex).toBe(3);

    // Advance again to interlude (idx 4)
    advanceToNextNode(gs);
    expect(gs.campaign.sequenceIndex).toBe(4);
    expect(gs.campaign.phase).toBe(CampaignPhase.Interlude);
  });

  it('advanceToNextNode sets Complete for unimplemented battle', () => {
    const gs = makeGameAtBattle();
    handleBattleVictory(gs);
    // Advance through: camp(3) -> interlude(4) -> battle:mantua(5)
    advanceToNextNode(gs); // idx 3: camp
    advanceToNextNode(gs); // idx 4: interlude
    advanceToNextNode(gs); // idx 5: battle:mantua (not implemented)

    // mantua has no registered config, so it should set Complete
    expect(gs.campaign.phase).toBe(CampaignPhase.Complete);
  });

  it('transitionToCamp creates camp state for current camp node', () => {
    const gs = createNewGame('italy');
    // Move to camp node (idx 1: eve-of-rivoli)
    gs.campaign = { ...gs.campaign, sequenceIndex: 1, phase: CampaignPhase.Camp };

    transitionToCamp(gs);

    expect(gs.campState).toBeDefined();
    expect(gs.campState!.campId).toBe('eve-of-rivoli');
    expect(gs.phase).toBe(GamePhase.Camp);
  });
});
