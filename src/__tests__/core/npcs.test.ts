import { describe, it, expect, beforeEach } from 'vitest';
import { createCampaignNPCs, npcToSoldier, npcToOfficer, syncBattleResultsToNPCs } from '../../core/npcs';
import { NPC, NPCRole, MilitaryRank, MoraleThreshold, BattleState, BattlePhase, DrillStep, HealthState, FatigueTier } from '../../types';

// --- Helpers ---

function makeNPC(overrides: Partial<NPC> = {}): NPC {
  return {
    id: 'test',
    name: 'Test NPC',
    role: NPCRole.Neighbour,
    rank: MilitaryRank.Private,
    relationship: 50,
    alive: true,
    wounded: false,
    morale: 80,
    maxMorale: 100,
    valor: 40,
    ...overrides,
  };
}

function makeMinimalBattleState(overrides: Record<string, unknown> = {}): BattleState {
  return {
    phase: BattlePhase.Line,
    turn: 1,
    drillStep: DrillStep.Load,
    player: {
      name: 'Test',
      valor: 40, musketry: 35, elan: 35,
      strength: 40, endurance: 40, constitution: 45,
      charisma: 30, intelligence: 30, awareness: 35,
      morale: 80, maxMorale: 100, moraleThreshold: MoraleThreshold.Steady,
      health: 150, maxHealth: 190, healthState: HealthState.Unhurt,
      stamina: 100, maxStamina: 180,
      fatigue: 0, maxFatigue: 180, fatigueTier: FatigueTier.Fresh,
      musketLoaded: true, alive: true, routing: false, fumbledLoad: false,
      soldierRep: 0, officerRep: 50, napoleonRep: 0,
      frontRank: false, canteenUses: 3,
    },
    line: {
      leftNeighbour: {
        id: 'pierre', name: 'Pierre', rank: 'private' as const,
        valor: 55, morale: 60, maxMorale: 100,
        threshold: MoraleThreshold.Shaken,
        alive: true, wounded: true, routing: false,
        musketLoaded: true, relationship: 60,
      },
      rightNeighbour: {
        id: 'jean-baptiste', name: 'Jean-Baptiste', rank: 'private' as const,
        valor: 20, morale: 40, maxMorale: 85,
        threshold: MoraleThreshold.Shaken,
        alive: true, wounded: false, routing: false,
        musketLoaded: true, relationship: 40,
      },
      officer: {
        name: 'Captain Leclerc', rank: 'Capt.',
        alive: true, wounded: false, mounted: true, status: 'Steady',
      },
      lineIntegrity: 80,
      lineMorale: 'steady',
      drumsPlaying: true,
      ncoPresent: true,
      casualtiesThisTurn: 0,
    },
    enemy: {
      range: 120, strength: 100, quality: 'line', morale: 'steady',
      lineIntegrity: 100, artillery: false, cavalryThreat: false,
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
    battlePart: 1,
    batteryCharged: false,
    meleeStage: 0,
    wagonDamage: 0,
    gorgeMercyCount: 0,
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    ...overrides,
  } as BattleState;
}

// --- Tests ---

describe('createCampaignNPCs', () => {
  it('returns exactly 4 NPCs', () => {
    const npcs = createCampaignNPCs();
    expect(npcs).toHaveLength(4);
  });

  it('creates Pierre as a Private with valor 55', () => {
    const npcs = createCampaignNPCs();
    const pierre = npcs.find(n => n.id === 'pierre');
    expect(pierre).toBeDefined();
    expect(pierre!.name).toBe('Pierre');
    expect(pierre!.rank).toBe(MilitaryRank.Private);
    expect(pierre!.valor).toBe(55);
    expect(pierre!.role).toBe(NPCRole.Neighbour);
  });

  it('creates Jean-Baptiste as a Private with valor 20', () => {
    const npcs = createCampaignNPCs();
    const jb = npcs.find(n => n.id === 'jean-baptiste');
    expect(jb).toBeDefined();
    expect(jb!.name).toBe('Jean-Baptiste');
    expect(jb!.rank).toBe(MilitaryRank.Private);
    expect(jb!.valor).toBe(20);
    expect(jb!.role).toBe(NPCRole.Neighbour);
  });

  it('creates Sergeant Duval with valor 65', () => {
    const npcs = createCampaignNPCs();
    const duval = npcs.find(n => n.id === 'duval');
    expect(duval).toBeDefined();
    expect(duval!.name).toBe('Sergeant Duval');
    expect(duval!.rank).toBe(MilitaryRank.Sergeant);
    expect(duval!.valor).toBe(65);
    expect(duval!.role).toBe(NPCRole.NCO);
  });

  it('creates Captain Leclerc with valor 60', () => {
    const npcs = createCampaignNPCs();
    const leclerc = npcs.find(n => n.id === 'leclerc');
    expect(leclerc).toBeDefined();
    expect(leclerc!.name).toBe('Captain Leclerc');
    expect(leclerc!.rank).toBe(MilitaryRank.Captain);
    expect(leclerc!.valor).toBe(60);
    expect(leclerc!.role).toBe(NPCRole.Officer);
  });

  it('all NPCs start alive and not wounded', () => {
    const npcs = createCampaignNPCs();
    for (const npc of npcs) {
      expect(npc.alive).toBe(true);
      expect(npc.wounded).toBe(false);
    }
  });
});

describe('npcToSoldier', () => {
  it('converts a Private NPC to rank "private"', () => {
    const npc = makeNPC({ rank: MilitaryRank.Private });
    const soldier = npcToSoldier(npc);
    expect(soldier.rank).toBe('private');
  });

  it('converts a Sergeant NPC to rank "sergeant"', () => {
    const npc = makeNPC({ rank: MilitaryRank.Sergeant });
    const soldier = npcToSoldier(npc);
    expect(soldier.rank).toBe('sergeant');
  });

  it('converts a Corporal NPC to rank "corporal"', () => {
    const npc = makeNPC({ rank: MilitaryRank.Corporal });
    const soldier = npcToSoldier(npc);
    expect(soldier.rank).toBe('corporal');
  });

  it('converts a Captain NPC to rank "private" (fallthrough)', () => {
    const npc = makeNPC({ rank: MilitaryRank.Captain });
    const soldier = npcToSoldier(npc);
    expect(soldier.rank).toBe('private');
  });

  it('converts a Lieutenant NPC to rank "private" (fallthrough)', () => {
    const npc = makeNPC({ rank: MilitaryRank.Lieutenant });
    const soldier = npcToSoldier(npc);
    expect(soldier.rank).toBe('private');
  });

  it('sets musketLoaded to true and routing to false', () => {
    const npc = makeNPC();
    const soldier = npcToSoldier(npc);
    expect(soldier.musketLoaded).toBe(true);
    expect(soldier.routing).toBe(false);
  });

  it('copies id, name, valor, morale, maxMorale, alive, wounded, relationship', () => {
    const npc = makeNPC({
      id: 'pierre',
      name: 'Pierre',
      valor: 55,
      morale: 90,
      maxMorale: 100,
      alive: true,
      wounded: true,
      relationship: 60,
    });
    const soldier = npcToSoldier(npc);
    expect(soldier.id).toBe('pierre');
    expect(soldier.name).toBe('Pierre');
    expect(soldier.valor).toBe(55);
    expect(soldier.morale).toBe(90);
    expect(soldier.maxMorale).toBe(100);
    expect(soldier.alive).toBe(true);
    expect(soldier.wounded).toBe(true);
    expect(soldier.relationship).toBe(60);
  });

  it('computes the morale threshold correctly', () => {
    // 90/100 = 0.9 >= 0.75 → Steady
    const npc = makeNPC({ morale: 90, maxMorale: 100 });
    const soldier = npcToSoldier(npc);
    expect(soldier.threshold).toBe(MoraleThreshold.Steady);

    // 30/100 = 0.3 → Wavering (>= 0.15, < 0.40)
    const npc2 = makeNPC({ morale: 30, maxMorale: 100 });
    const soldier2 = npcToSoldier(npc2);
    expect(soldier2.threshold).toBe(MoraleThreshold.Wavering);

    // 10/100 = 0.1 → Breaking (< 0.15)
    const npc3 = makeNPC({ morale: 10, maxMorale: 100 });
    const soldier3 = npcToSoldier(npc3);
    expect(soldier3.threshold).toBe(MoraleThreshold.Breaking);
  });
});

describe('npcToOfficer', () => {
  it('converts Captain rank to "Capt." abbreviation', () => {
    const npc = makeNPC({ rank: MilitaryRank.Captain, name: 'Captain Leclerc' });
    const officer = npcToOfficer(npc);
    expect(officer.rank).toBe('Capt.');
  });

  it('converts Lieutenant rank to "Lt." abbreviation', () => {
    const npc = makeNPC({ rank: MilitaryRank.Lieutenant, name: 'Lt. Moreau' });
    const officer = npcToOfficer(npc);
    expect(officer.rank).toBe('Lt.');
  });

  it('converts Sergeant rank to "Sgt." abbreviation (fallthrough)', () => {
    const npc = makeNPC({ rank: MilitaryRank.Sergeant, name: 'Sgt. Duval' });
    const officer = npcToOfficer(npc);
    expect(officer.rank).toBe('Sgt.');
  });

  it('converts Private rank to "Sgt." abbreviation (fallthrough)', () => {
    const npc = makeNPC({ rank: MilitaryRank.Private });
    const officer = npcToOfficer(npc);
    expect(officer.rank).toBe('Sgt.');
  });

  it('sets mounted=true for Captain', () => {
    const npc = makeNPC({ rank: MilitaryRank.Captain });
    const officer = npcToOfficer(npc);
    expect(officer.mounted).toBe(true);
  });

  it('sets mounted=true for Lieutenant', () => {
    const npc = makeNPC({ rank: MilitaryRank.Lieutenant });
    const officer = npcToOfficer(npc);
    expect(officer.mounted).toBe(true);
  });

  it('sets mounted=false for Sergeant', () => {
    const npc = makeNPC({ rank: MilitaryRank.Sergeant });
    const officer = npcToOfficer(npc);
    expect(officer.mounted).toBe(false);
  });

  it('sets mounted=false for Corporal', () => {
    const npc = makeNPC({ rank: MilitaryRank.Corporal });
    const officer = npcToOfficer(npc);
    expect(officer.mounted).toBe(false);
  });

  it('sets status to "Wounded" when NPC is wounded', () => {
    const npc = makeNPC({ wounded: true });
    const officer = npcToOfficer(npc);
    expect(officer.status).toBe('Wounded');
  });

  it('sets status to "Steady" when NPC is not wounded', () => {
    const npc = makeNPC({ wounded: false });
    const officer = npcToOfficer(npc);
    expect(officer.status).toBe('Steady');
  });

  it('copies name, alive, wounded from NPC', () => {
    const npc = makeNPC({ name: 'Captain Leclerc', alive: false, wounded: true, rank: MilitaryRank.Captain });
    const officer = npcToOfficer(npc);
    expect(officer.name).toBe('Captain Leclerc');
    expect(officer.alive).toBe(false);
    expect(officer.wounded).toBe(true);
  });
});

describe('syncBattleResultsToNPCs', () => {
  it('syncs Pierre from leftNeighbour', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    // leftNeighbour has wounded=true, morale=60
    syncBattleResultsToNPCs(npcs, battle);

    const pierre = npcs.find(n => n.id === 'pierre')!;
    expect(pierre.alive).toBe(true);
    expect(pierre.wounded).toBe(true);
    expect(pierre.morale).toBe(60);
  });

  it('syncs Jean-Baptiste from rightNeighbour', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    syncBattleResultsToNPCs(npcs, battle);

    const jb = npcs.find(n => n.id === 'jean-baptiste')!;
    expect(jb.alive).toBe(true);
    expect(jb.wounded).toBe(false);
    expect(jb.morale).toBe(40);
  });

  it('sets JB morale to 0 when rightNeighbour is routing', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    battle.line.rightNeighbour!.routing = true;
    battle.line.rightNeighbour!.morale = 50; // even if morale > 0, routing overrides

    syncBattleResultsToNPCs(npcs, battle);

    const jb = npcs.find(n => n.id === 'jean-baptiste')!;
    expect(jb.morale).toBe(0);
  });

  it('syncs Leclerc alive/wounded from officer', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    battle.line.officer.alive = false;
    battle.line.officer.wounded = true;

    syncBattleResultsToNPCs(npcs, battle);

    const leclerc = npcs.find(n => n.id === 'leclerc')!;
    expect(leclerc.alive).toBe(false);
    expect(leclerc.wounded).toBe(true);
  });

  it('does not crash when leftNeighbour is null', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    battle.line.leftNeighbour = null;

    // Should not throw
    syncBattleResultsToNPCs(npcs, battle);

    // Pierre should remain unchanged (original creation values)
    const pierre = npcs.find(n => n.id === 'pierre')!;
    expect(pierre.alive).toBe(true);
    expect(pierre.wounded).toBe(false);
    expect(pierre.morale).toBe(90);
  });

  it('does not crash when rightNeighbour is null', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    battle.line.rightNeighbour = null;

    // Should not throw
    syncBattleResultsToNPCs(npcs, battle);

    // JB should remain unchanged
    const jb = npcs.find(n => n.id === 'jean-baptiste')!;
    expect(jb.alive).toBe(true);
    expect(jb.wounded).toBe(false);
    expect(jb.morale).toBe(70);
  });

  it('syncs death states correctly', () => {
    const npcs = createCampaignNPCs();
    const battle = makeMinimalBattleState();
    battle.line.leftNeighbour!.alive = false;
    battle.line.leftNeighbour!.wounded = true;
    battle.line.leftNeighbour!.morale = 0;

    syncBattleResultsToNPCs(npcs, battle);

    const pierre = npcs.find(n => n.id === 'pierre')!;
    expect(pierre.alive).toBe(false);
    expect(pierre.wounded).toBe(true);
    expect(pierre.morale).toBe(0);
  });
});
