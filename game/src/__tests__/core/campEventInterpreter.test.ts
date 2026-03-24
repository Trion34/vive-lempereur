import { describe, it, expect } from 'vitest';
import { buildCampEventFromDeclarative, resolveDeclarativeEvent } from '../../core/campEventInterpreter';
import { CampEventCategory, MilitaryRank, NPCRole } from '../../types';
import type { PlayerCharacter, NPC, CampState } from '../../types';
import type { DeclarativeCampEvent } from '../../data/campaigns/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makePlayer(overrides: Partial<PlayerCharacter> = {}): PlayerCharacter {
  return {
    name: 'Test',
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
    health: 70,
    morale: 65,
    stamina: 80,
    grace: 0,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    attributes: {},
    virtue: 0,
    sous: 5,
    equipment: { musket: 'Charleville', bayonet: 'Standard', musketCondition: 80, uniformCondition: 60 },
    ...overrides,
  };
}

function makeNpcs(): NPC[] {
  return [
    { id: 'pierre', name: 'Pierre', role: NPCRole.Neighbour, rank: MilitaryRank.Private, relationship: 20, alive: true, wounded: false, morale: 80, maxMorale: 100, valor: 50 },
    { id: 'jb', name: 'JB', role: NPCRole.Neighbour, rank: MilitaryRank.Private, relationship: 10, alive: true, wounded: false, morale: 60, maxMorale: 100, valor: 25 },
  ];
}

function makeCamp(): CampState {
  return {
    day: 1,
    actionsTotal: 16,
    actionsRemaining: 10,
    conditions: { weather: 'cold', supplyLevel: 'scarce', campMorale: 'steady', location: 'Test' },
    log: [],
    completedActivities: [],
    triggeredEvents: [],
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: 'test',
    flags: {},
  };
}

const SIMPLE_EVENT: DeclarativeCampEvent = {
  id: 'test_event',
  title: 'Test Event',
  category: CampEventCategory.Interpersonal,
  narrative: 'Something happens.',
  choices: [
    {
      id: 'choice_a',
      label: 'Do A',
      description: 'Description A',
      statCheck: { stat: 'charisma', difficulty: 0 },
      pass: {
        narrative: 'You did A successfully.',
        statChanges: { soldierRep: 3 },
        moraleChange: 5,
        npcRelationshipChanges: [{ npcId: 'pierre', delta: 4 }],
      },
      fail: {
        narrative: 'You failed at A.',
        moraleChange: -2,
        npcRelationshipChanges: [{ npcId: 'pierre', delta: -1 }],
      },
    },
    {
      id: 'choice_b',
      label: 'Do B',
      description: 'Description B (no check)',
      pass: {
        narrative: 'You did B.',
        staminaChange: -3,
        healthChange: -5,
        sousChange: 2,
        virtueChange: 3,
        flagChanges: { test_flag: true },
      },
    },
  ],
};

const LOCKED_EVENT: DeclarativeCampEvent = {
  id: 'locked_event',
  title: 'Locked Event',
  category: CampEventCategory.Supply,
  narrative: 'Locked choice test.',
  choices: [
    {
      id: 'literate_choice',
      label: 'Write',
      description: 'You can write.',
      lock: { requireAttribute: 'literate', lockedMessage: 'Cannot write.' },
      pass: { narrative: 'You wrote.' },
    },
    {
      id: 'costly_choice',
      label: 'Buy',
      description: 'Costs 10 sous.',
      lock: { requireSous: 10 },
      pass: { narrative: 'You bought.' },
    },
    {
      id: 'open_choice',
      label: 'Free',
      description: 'Always available.',
      pass: { narrative: 'Free choice.' },
    },
  ],
};

const PLAYER_FIELD_EVENT: DeclarativeCampEvent = {
  id: 'frontrank_event',
  title: 'Front Rank',
  category: CampEventCategory.Orders,
  narrative: 'Volunteer.',
  choices: [
    {
      id: 'volunteer',
      label: 'Volunteer',
      description: 'Step forward.',
      pass: {
        narrative: 'You volunteered.',
        playerFields: { frontRank: true },
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// buildCampEventFromDeclarative
// ---------------------------------------------------------------------------

describe('buildCampEventFromDeclarative', () => {
  it('converts a declarative event to CampEvent shape', () => {
    const result = buildCampEventFromDeclarative(SIMPLE_EVENT, makePlayer());
    expect(result.id).toBe('test_event');
    expect(result.title).toBe('Test Event');
    expect(result.narrative).toBe('Something happens.');
    expect(result.resolved).toBe(false);
    expect(result.choices).toHaveLength(2);
    expect(result.choices[0].id).toBe('choice_a');
    expect(result.choices[0].statCheck).toEqual({ stat: 'charisma', difficulty: 0 });
    expect(result.choices[1].statCheck).toBeUndefined();
  });

  it('marks attribute-locked choices when player lacks attribute', () => {
    const result = buildCampEventFromDeclarative(LOCKED_EVENT, makePlayer({ attributes: {} }));
    expect(result.choices[0].locked).toBe(true);
    expect(result.choices[0].description).toBe('Cannot write.');
  });

  it('unlocks attribute-locked choices when player has attribute', () => {
    const result = buildCampEventFromDeclarative(LOCKED_EVENT, makePlayer({ attributes: { literate: true } }));
    expect(result.choices[0].locked).toBe(false);
    expect(result.choices[0].description).toBe('You can write.');
  });

  it('marks sous-locked choices when player has insufficient sous', () => {
    const result = buildCampEventFromDeclarative(LOCKED_EVENT, makePlayer({ sous: 5 }));
    expect(result.choices[1].locked).toBe(true);
  });

  it('unlocks sous-locked choices when player has enough sous', () => {
    const result = buildCampEventFromDeclarative(LOCKED_EVENT, makePlayer({ sous: 15 }));
    expect(result.choices[1].locked).toBe(false);
  });

  it('never locks choices without a lock constraint', () => {
    const result = buildCampEventFromDeclarative(LOCKED_EVENT, makePlayer({ sous: 0 }));
    expect(result.choices[2].locked).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resolveDeclarativeEvent
// ---------------------------------------------------------------------------

describe('resolveDeclarativeEvent', () => {
  it('returns pass outcome when check passed', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), makeNpcs(), 'choice_a', true, 1);
    expect(result.moraleChange).toBe(5);
    expect(result.statChanges.soldierRep).toBe(3);
    expect(result.log[0].text).toBe('You did A successfully.');
    expect(result.npcChanges).toEqual([{ npcId: 'pierre', relationship: 4 }]);
  });

  it('returns fail outcome when check failed', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), makeNpcs(), 'choice_a', false, 1);
    expect(result.moraleChange).toBe(-2);
    expect(result.log[0].text).toBe('You failed at A.');
    expect(result.npcChanges).toEqual([{ npcId: 'pierre', relationship: -1 }]);
  });

  it('returns pass outcome for choice without fail when check fails', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), makeNpcs(), 'choice_b', false, 1);
    // choice_b has no fail, so pass is used
    expect(result.log[0].text).toBe('You did B.');
  });

  it('applies all condition meter changes', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), makeNpcs(), 'choice_b', true, 1);
    expect(result.staminaChange).toBe(-3);
    expect(result.healthChange).toBe(-5);
    expect(result.sousChange).toBe(2);
    expect(result.virtueChange).toBe(3);
    expect(result.flagChanges).toEqual({ test_flag: true });
  });

  it('filters npcChanges to only NPCs present in the npcs array', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), [], 'choice_a', true, 1);
    expect(result.npcChanges).toBeUndefined();
  });

  it('returns empty result for unknown choice', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), makeNpcs(), 'nonexistent', true, 1);
    expect(result.moraleChange).toBe(0);
    expect(result.log).toHaveLength(0);
  });

  it('applies playerFields mutations', () => {
    const player = makePlayer({ frontRank: false });
    resolveDeclarativeEvent(PLAYER_FIELD_EVENT, makeCamp(), player, makeNpcs(), 'volunteer', true, 1);
    expect(player.frontRank).toBe(true);
  });

  it('sets correct log day', () => {
    const result = resolveDeclarativeEvent(SIMPLE_EVENT, makeCamp(), makePlayer(), makeNpcs(), 'choice_a', true, 3);
    expect(result.log[0].day).toBe(3);
  });
});
