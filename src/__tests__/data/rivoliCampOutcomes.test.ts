import { describe, it, expect } from 'vitest';
import {
  RIVOLI_PRE_BATTLE_FORCED_EVENTS,
  RIVOLI_RANDOM_EVENTS,
} from '../../data/battles/rivoli/camp';
import { PlayerCharacter, NPC, NPCRole, MilitaryRank, CampState } from '../../types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makePlayer(overrides: Partial<PlayerCharacter> = {}): PlayerCharacter {
  return {
    name: 'Test Soldier',
    rank: MilitaryRank.Private,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    valor: 40,
    health: 70,
    morale: 65,
    stamina: 80,
    grace: 0,
    soldierRep: 0,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Standard',
      musketCondition: 80,
      uniformCondition: 60,
    },
    ...overrides,
  };
}

function makeNPCs(): NPC[] {
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

function makeCamp(overrides: Partial<CampState> = {}): CampState {
  return {
    day: 1,
    actionsTotal: 16,
    actionsRemaining: 10,
    conditions: {
      weather: 'cold',
      supplyLevel: 'scarce',
      campMorale: 'steady',
      location: 'Rivoli',
    },
    log: [],
    completedActivities: [],
    triggeredEvents: [],
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: 'eve-of-rivoli',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Forced Event Configs
// ---------------------------------------------------------------------------
describe('RIVOLI_PRE_BATTLE_FORCED_EVENTS', () => {
  it('has 4 forced events', () => {
    expect(RIVOLI_PRE_BATTLE_FORCED_EVENTS).toHaveLength(4);
  });

  it('each has a getEvent that returns a CampEvent', () => {
    for (const config of RIVOLI_PRE_BATTLE_FORCED_EVENTS) {
      const event = config.getEvent(makeCamp(), makePlayer());
      expect(event.id).toBe(config.id);
      expect(event.title).toBeTruthy();
      expect(event.narrative).toBeTruthy();
    }
  });
});

describe('Bonaparte outcome resolver', () => {
  const config = RIVOLI_PRE_BATTLE_FORCED_EVENTS.find((e) => e.id === 'prebattle_bonaparte')!;

  it('grants morale +3 and napoleonRep +2 on pass', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'stand_tall', true);
    expect(result.moraleChange).toBe(3);
    expect(result.statChanges.napoleonRep).toBe(2);
    expect(result.statChanges.soldierRep).toBe(1);
  });

  it('grants morale 0 on fail', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'stand_tall', false);
    expect(result.moraleChange).toBe(0);
  });
});

describe('Campfires outcome resolver', () => {
  const config = RIVOLI_PRE_BATTLE_FORCED_EVENTS.find((e) => e.id === 'prebattle_campfires')!;

  it('steady_men pass gives morale +3 and soldierRep +2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'steady_men', true);
    expect(result.moraleChange).toBe(3);
    expect(result.statChanges.soldierRep).toBe(2);
  });

  it('steady_men fail gives morale -1', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'steady_men', false);
    expect(result.moraleChange).toBe(-1);
  });

  it('count_them pass gives officerRep +3', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'count_them', true);
    expect(result.statChanges.officerRep).toBe(3);
  });

  it('count_them fail gives morale -2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'count_them', false);
    expect(result.moraleChange).toBe(-2);
  });
});

describe('Briefing outcome resolver', () => {
  const config = RIVOLI_PRE_BATTLE_FORCED_EVENTS.find((e) => e.id === 'prebattle_briefing')!;

  it('volunteer pass sets frontRank and grants soldierRep/officerRep +3', () => {
    const player = makePlayer();
    const result = config.resolveChoice(makeCamp(), player, makeNPCs(), 'volunteer', true);
    expect(player.frontRank).toBe(true);
    expect(result.statChanges.soldierRep).toBe(3);
    expect(result.statChanges.officerRep).toBe(3);
    expect(result.moraleChange).toBe(2);
  });

  it('volunteer fail still sets frontRank', () => {
    const player = makePlayer();
    const result = config.resolveChoice(makeCamp(), player, makeNPCs(), 'volunteer', false);
    expect(player.frontRank).toBe(true);
    expect(result.moraleChange).toBe(-3);
  });

  it('stay_quiet gives morale -3', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'stay_quiet', true);
    expect(result.moraleChange).toBe(-3);
  });

  it('volunteer with duval NPC includes npcChanges', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'volunteer', true);
    expect(result.npcChanges).toBeDefined();
    expect(result.npcChanges!.some((c) => c.npcId === 'duval')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Random Event Configs
// ---------------------------------------------------------------------------
describe('RIVOLI_RANDOM_EVENTS', () => {
  it('has 3 random events', () => {
    expect(RIVOLI_RANDOM_EVENTS).toHaveLength(3);
  });

  it('each has a getEvent that returns a CampEvent', () => {
    for (const config of RIVOLI_RANDOM_EVENTS) {
      const event = config.getEvent(makeCamp(), makePlayer());
      expect(event.id).toBe(config.id);
    }
  });
});

describe('Pierre Story outcome resolver', () => {
  const config = RIVOLI_RANDOM_EVENTS.find((e) => e.id === 'prebattle_pierre_story')!;

  it('listen gives morale +2 and pierre relationship +6', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'listen', true);
    expect(result.moraleChange).toBe(2);
    expect(result.npcChanges).toBeDefined();
    expect(result.npcChanges!.find((c) => c.npcId === 'pierre')?.relationship).toBe(6);
  });

  it('ask_arcole pass gives valor +1 and pierre relationship +8', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'ask_arcole', true);
    expect(result.statChanges.valor).toBe(1);
    expect(result.moraleChange).toBe(3);
    expect(result.npcChanges!.find((c) => c.npcId === 'pierre')?.relationship).toBe(8);
  });

  it('ask_arcole fail gives morale -1 and pierre relationship -3', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'ask_arcole', false);
    expect(result.moraleChange).toBe(-1);
    expect(result.npcChanges!.find((c) => c.npcId === 'pierre')?.relationship).toBe(-3);
  });
});

describe('Rations outcome resolver', () => {
  const config = RIVOLI_RANDOM_EVENTS.find((e) => e.id === 'prebattle_rations')!;

  it('accept gives morale 0', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'accept', true);
    expect(result.moraleChange).toBe(0);
  });

  it('share_jb pass gives soldierRep +2 and jb relationship +8', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'share_jb', true);
    expect(result.statChanges.soldierRep).toBe(2);
    expect(result.npcChanges!.find((c) => c.npcId === 'jean-baptiste')?.relationship).toBe(8);
  });

  it('share_jb fail gives stamina -5 and jb relationship +6', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'share_jb', false);
    expect(result.staminaChange).toBe(-5);
    expect(result.npcChanges!.find((c) => c.npcId === 'jean-baptiste')?.relationship).toBe(6);
  });
});

describe('JB Fear outcome resolver', () => {
  const config = RIVOLI_RANDOM_EVENTS.find((e) => e.id === 'prebattle_jb_fear')!;

  it('reassure pass gives morale +3 and jb relationship +10', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'reassure', true);
    expect(result.moraleChange).toBe(3);
    expect(result.npcChanges!.find((c) => c.npcId === 'jean-baptiste')?.relationship).toBe(10);
  });

  it('reassure fail gives morale -5 and jb relationship +2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'reassure', false);
    expect(result.moraleChange).toBe(-5);
    expect(result.npcChanges!.find((c) => c.npcId === 'jean-baptiste')?.relationship).toBe(2);
  });

  it('truth pass gives morale +2 and jb relationship +5', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'truth', true);
    expect(result.moraleChange).toBe(2);
    expect(result.npcChanges!.find((c) => c.npcId === 'jean-baptiste')?.relationship).toBe(5);
  });

  it('silence gives morale +2 and jb relationship +6', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'silence', true);
    expect(result.moraleChange).toBe(2);
    expect(result.npcChanges!.find((c) => c.npcId === 'jean-baptiste')?.relationship).toBe(6);
  });
});
