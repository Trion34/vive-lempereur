import { describe, it, expect } from 'vitest';
import {
  RIVOLI_PRE_BATTLE_FORCED_EVENTS,
  RIVOLI_RANDOM_EVENTS,
  CAMPFIRES_EVENT,
  BRIEFING_EVENT,
  NIGHT_BEFORE_EVENT,
  BONAPARTE_EVENT,
  PIERRE_STORY_EVENT,
  RATIONS_EVENT,
  JB_FEAR_EVENT,
} from '../../data/battles/rivoli/camp';
import {
  buildCampEventFromDeclarative,
  resolveDeclarativeEvent,
} from '../../core/campEventInterpreter';
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
    attributes: {},
    virtue: 0,
    sous: 0,
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
    flags: {},
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

  it('each has a declarative event that builds a CampEvent', () => {
    for (const config of RIVOLI_PRE_BATTLE_FORCED_EVENTS) {
      expect(config.kind).toBe('declarative');
      const campEvent = buildCampEventFromDeclarative(config.event, makePlayer());
      expect(campEvent.id).toBe(config.id);
      expect(campEvent.title).toBeTruthy();
      expect(campEvent.narrative).toBeTruthy();
    }
  });
});

describe('Bonaparte outcome resolver', () => {
  it('grants morale +3 and napoleonRep +2 on pass', () => {
    const result = resolveDeclarativeEvent(
      BONAPARTE_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'stand_tall', true, 1,
    );
    expect(result.moraleChange).toBe(3);
    expect(result.statChanges.napoleonRep).toBe(2);
    expect(result.statChanges.soldierRep).toBe(1);
  });

  it('grants morale 0 on fail', () => {
    const result = resolveDeclarativeEvent(
      BONAPARTE_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'stand_tall', false, 1,
    );
    expect(result.moraleChange).toBe(0);
  });
});

describe('Campfires outcome resolver', () => {
  it('steady_men pass gives morale +3 and soldierRep +2', () => {
    const result = resolveDeclarativeEvent(
      CAMPFIRES_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'steady_men', true, 1,
    );
    expect(result.moraleChange).toBe(3);
    expect(result.statChanges.soldierRep).toBe(2);
  });

  it('steady_men fail gives morale -1', () => {
    const result = resolveDeclarativeEvent(
      CAMPFIRES_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'steady_men', false, 1,
    );
    expect(result.moraleChange).toBe(-1);
  });

  it('count_them pass gives officerRep +3', () => {
    const result = resolveDeclarativeEvent(
      CAMPFIRES_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'count_them', true, 1,
    );
    expect(result.statChanges.officerRep).toBe(3);
  });

  it('count_them fail gives morale -2', () => {
    const result = resolveDeclarativeEvent(
      CAMPFIRES_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'count_them', false, 1,
    );
    expect(result.moraleChange).toBe(-2);
  });
});

describe('Briefing outcome resolver', () => {
  it('volunteer pass sets frontRank and grants soldierRep/officerRep +3', () => {
    const player = makePlayer();
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), player, makeNPCs(), 'volunteer', true, 1,
    );
    expect(player.frontRank).toBe(true);
    expect(result.statChanges.soldierRep).toBe(3);
    expect(result.statChanges.officerRep).toBe(3);
    expect(result.moraleChange).toBe(2);
  });

  it('volunteer fail still sets frontRank', () => {
    const player = makePlayer();
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), player, makeNPCs(), 'volunteer', false, 1,
    );
    expect(player.frontRank).toBe(true);
    expect(result.moraleChange).toBe(-3);
  });

  it('stay_quiet gives morale -3', () => {
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'stay_quiet', true, 1,
    );
    expect(result.moraleChange).toBe(-3);
  });

  it('volunteer with duval NPC includes npcChanges', () => {
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'volunteer', true, 1,
    );
    expect(result.npcChanges).toBeDefined();
    expect(result.npcChanges!.some((c: { npcId: string }) => c.npcId === 'duval')).toBe(true);
  });

  it('volunteer pass gives duval +5', () => {
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'volunteer', true, 1,
    );
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'duval')?.relationship).toBe(5);
  });

  it('volunteer fail gives duval +3', () => {
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'volunteer', false, 1,
    );
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'duval')?.relationship).toBe(3);
  });

  it('volunteer fail gives soldierRep +1, officerRep +1', () => {
    const result = resolveDeclarativeEvent(
      BRIEFING_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'volunteer', false, 1,
    );
    expect(result.statChanges.soldierRep).toBe(1);
    expect(result.statChanges.officerRep).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Night Before (no choices, no effects)
// ---------------------------------------------------------------------------
describe('Night Before event', () => {
  it('has no choices', () => {
    const campEvent = buildCampEventFromDeclarative(NIGHT_BEFORE_EVENT, makePlayer());
    expect(campEvent.choices).toHaveLength(0);
  });

  it('has non-empty narrative', () => {
    expect(NIGHT_BEFORE_EVENT.narrative.length).toBeGreaterThan(20);
  });
});

// ---------------------------------------------------------------------------
// Random Event Configs
// ---------------------------------------------------------------------------
describe('RIVOLI_RANDOM_EVENTS', () => {
  it('has 3 random events', () => {
    expect(RIVOLI_RANDOM_EVENTS).toHaveLength(3);
  });

  it('each has a declarative event that builds a CampEvent', () => {
    for (const config of RIVOLI_RANDOM_EVENTS) {
      expect(config.kind).toBe('declarative');
      const campEvent = buildCampEventFromDeclarative(config.event, makePlayer());
      expect(campEvent.id).toBe(config.id);
    }
  });
});

describe('Pierre Story outcome resolver', () => {
  it('listen gives morale +2 and pierre relationship +6', () => {
    const result = resolveDeclarativeEvent(
      PIERRE_STORY_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'listen', true, 1,
    );
    expect(result.moraleChange).toBe(2);
    expect(result.npcChanges).toBeDefined();
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'pierre')?.relationship).toBe(6);
  });

  it('ask_arcole pass gives valor +1 and pierre relationship +8', () => {
    const result = resolveDeclarativeEvent(
      PIERRE_STORY_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'ask_arcole', true, 1,
    );
    expect(result.statChanges.valor).toBe(1);
    expect(result.moraleChange).toBe(3);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'pierre')?.relationship).toBe(8);
  });

  it('ask_arcole fail gives morale -1 and pierre relationship -3', () => {
    const result = resolveDeclarativeEvent(
      PIERRE_STORY_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'ask_arcole', false, 1,
    );
    expect(result.moraleChange).toBe(-1);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'pierre')?.relationship).toBe(-3);
  });
});

describe('Rations outcome resolver', () => {
  it('accept gives morale 0', () => {
    const result = resolveDeclarativeEvent(
      RATIONS_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'accept', true, 1,
    );
    expect(result.moraleChange).toBe(0);
  });

  it('share_jb pass gives soldierRep +2 and jb relationship +8', () => {
    const result = resolveDeclarativeEvent(
      RATIONS_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'share_jb', true, 1,
    );
    expect(result.statChanges.soldierRep).toBe(2);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(8);
  });

  it('share_jb pass gives morale +2', () => {
    const result = resolveDeclarativeEvent(
      RATIONS_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'share_jb', true, 1,
    );
    expect(result.moraleChange).toBe(2);
  });

  it('share_jb fail gives stamina -5 and jb relationship +6', () => {
    const result = resolveDeclarativeEvent(
      RATIONS_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'share_jb', false, 1,
    );
    expect(result.staminaChange).toBe(-5);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(6);
  });

  it('share_jb fail gives morale -1', () => {
    const result = resolveDeclarativeEvent(
      RATIONS_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'share_jb', false, 1,
    );
    expect(result.moraleChange).toBe(-1);
  });
});

describe('JB Fear outcome resolver', () => {
  it('reassure pass gives morale +3 and jb relationship +10', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'reassure', true, 1,
    );
    expect(result.moraleChange).toBe(3);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(10);
  });

  it('reassure fail gives morale -5 and jb relationship +2', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'reassure', false, 1,
    );
    expect(result.moraleChange).toBe(-5);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(2);
  });

  it('truth pass gives morale +2 and jb relationship +5', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'truth', true, 1,
    );
    expect(result.moraleChange).toBe(2);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(5);
  });

  it('truth pass also gives pierre relationship +2', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'truth', true, 1,
    );
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'pierre')?.relationship).toBe(2);
  });

  it('truth fail gives morale -2 and jb relationship -2', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'truth', false, 1,
    );
    expect(result.moraleChange).toBe(-2);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(-2);
  });

  it('truth fail also gives pierre relationship +2', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'truth', false, 1,
    );
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'pierre')?.relationship).toBe(2);
  });

  it('silence gives morale +2 and jb relationship +6', () => {
    const result = resolveDeclarativeEvent(
      JB_FEAR_EVENT, makeCamp(), makePlayer(), makeNPCs(), 'silence', true, 1,
    );
    expect(result.moraleChange).toBe(2);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'jean-baptiste')?.relationship).toBe(6);
  });
});
