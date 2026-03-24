import { describe, it, expect } from 'vitest';
import {
  CAMPFIRES_EVENT,
  BRIEFING_EVENT,
  BONAPARTE_EVENT,
  RIVOLI_RANDOM_EVENTS,
  FORAGE_SUCCESS,
  FORAGE_FAIL,
  SOCIALIZE_NARRATIVES,
} from '../../data/battles/rivoli/camp';
import { buildCampEventFromDeclarative } from '../../core/campEventInterpreter';
import type { PlayerCharacter } from '../../types';

function mockPlayer(): PlayerCharacter {
  return {
    name: 'Test',
    rank: 'private',
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
  } as PlayerCharacter;
}

describe('forced camp events', () => {
  it('BRIEFING_EVENT has non-empty narrative and choices', () => {
    const e = buildCampEventFromDeclarative(BRIEFING_EVENT, mockPlayer());
    expect(e.id).toBe('prebattle_briefing');
    expect(e.narrative.length).toBeGreaterThan(20);
    expect(e.choices.length).toBeGreaterThanOrEqual(1);
    expect(e.choices.every((c: { label: string }) => c.label.length > 0)).toBe(true);
  });

  it('BONAPARTE_EVENT has non-empty narrative and choices', () => {
    const e = buildCampEventFromDeclarative(BONAPARTE_EVENT, mockPlayer());
    expect(e.id).toBe('prebattle_bonaparte');
    expect(e.narrative.length).toBeGreaterThan(20);
    expect(e.choices.length).toBeGreaterThanOrEqual(1);
  });

  it('CAMPFIRES_EVENT has non-empty narrative and 2 choices', () => {
    const e = buildCampEventFromDeclarative(CAMPFIRES_EVENT, mockPlayer());
    expect(e.id).toBe('prebattle_campfires');
    expect(e.narrative.length).toBeGreaterThan(20);
    expect(e.choices).toHaveLength(2);
  });
});

describe('random camp events', () => {
  it('RIVOLI_RANDOM_EVENTS has 3 events', () => {
    expect(RIVOLI_RANDOM_EVENTS).toHaveLength(3);
  });

  it('every event has non-empty narrative and at least 1 choice', () => {
    for (const config of RIVOLI_RANDOM_EVENTS) {
      const e = buildCampEventFromDeclarative(config.event, mockPlayer());
      expect(e.narrative.length).toBeGreaterThan(20);
      expect(e.choices.length).toBeGreaterThanOrEqual(1);
      for (const c of e.choices) {
        expect(c.label.length).toBeGreaterThan(0);
        expect(c.id.length).toBeGreaterThan(0);
      }
    }
  });

  it('event ids are unique', () => {
    const ids = RIVOLI_RANDOM_EVENTS.map((config) => config.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('activity narrative arrays', () => {
  it('FORAGE_SUCCESS has multiple non-empty entries', () => {
    expect(FORAGE_SUCCESS.length).toBeGreaterThanOrEqual(2);
    for (const s of FORAGE_SUCCESS) expect(s.length).toBeGreaterThan(20);
  });

  it('FORAGE_FAIL has multiple non-empty entries', () => {
    expect(FORAGE_FAIL.length).toBeGreaterThanOrEqual(2);
    for (const s of FORAGE_FAIL) expect(s.length).toBeGreaterThan(20);
  });

  it('SOCIALIZE_NARRATIVES has entries for known NPCs', () => {
    expect(SOCIALIZE_NARRATIVES['pierre']).toBeTruthy();
    expect(SOCIALIZE_NARRATIVES['jean-baptiste']).toBeTruthy();
    expect(SOCIALIZE_NARRATIVES['duval']).toBeTruthy();
    expect(SOCIALIZE_NARRATIVES['leclerc']).toBeTruthy();
    for (const val of Object.values(SOCIALIZE_NARRATIVES)) {
      expect(val.length).toBeGreaterThan(20);
    }
  });
});
