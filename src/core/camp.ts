import {
  CampState, CampConditions, CampActivityId, CampLogEntry,
  PlayerCharacter, NPC, GameState,
} from '../types';
import { getCampActivities, resolveCampActivity } from './campActivities';
import { rollCampEvent, resolveCampEventChoice } from './campEvents';

export interface CampConfig {
  location: string;
  days: number;
}

export function createCampState(
  player: PlayerCharacter,
  npcs: NPC[],
  config: CampConfig,
): CampState {
  const conditions: CampConditions = {
    weather: 'clear',
    supplyLevel: 'adequate',
    campMorale: 'steady',
    location: config.location,
  };

  return {
    day: 1,
    maxDays: config.days,
    activitiesPerDay: 2,
    activitiesRemaining: 2,
    conditions,
    log: [
      {
        day: 1,
        text: `The regiment makes camp near ${config.location}. Fires are lit. The wounded are tended. For now, the guns are silent.`,
        type: 'narrative',
      },
    ],
    completedActivities: [],
    fatigue: 30,  // Start somewhat tired from battle
    morale: 60,   // Start with moderate spirits
  };
}

export function advanceCampTurn(
  gameState: GameState,
  activityId: CampActivityId,
  targetNpcId?: string,
): void {
  const camp = gameState.campState!;
  const player = gameState.player;
  const npcs = gameState.npcs;

  // Resolve the activity
  const result = resolveCampActivity(activityId, player, npcs, camp, targetNpcId);

  // Apply stat changes
  for (const [stat, delta] of Object.entries(result.statChanges)) {
    if (stat in player && typeof (player as any)[stat] === 'number') {
      (player as any)[stat] = Math.max(0, Math.min(100, (player as any)[stat] + (delta || 0)));
    }
  }

  // Apply NPC changes
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = npcs.find(n => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
        npc.trust = Math.max(0, Math.min(100, npc.trust + change.trust));
      }
    }
  }

  // Apply camp fatigue/morale
  camp.fatigue = Math.max(0, Math.min(100, camp.fatigue - result.fatigueChange));
  camp.morale = Math.max(0, Math.min(100, camp.morale + result.moraleChange));

  // Add logs
  camp.log.push(...result.log);
  camp.completedActivities.push(activityId);
  camp.activitiesRemaining -= 1;

  // Roll for random event (40% chance)
  if (!camp.pendingEvent) {
    const event = rollCampEvent(camp, player, npcs);
    if (event) {
      camp.pendingEvent = event;
      camp.log.push({
        day: camp.day,
        text: event.narrative,
        type: 'event',
      });
    }
  }

  // Advance day if no activities remain
  if (camp.activitiesRemaining <= 0 && !camp.pendingEvent) {
    advanceDay(camp);
  }
}

export function resolveCampEvent(gameState: GameState, choiceId: string): void {
  const camp = gameState.campState!;
  if (!camp.pendingEvent) return;

  const result = resolveCampEventChoice(
    camp.pendingEvent, choiceId, gameState.player, gameState.npcs,
  );

  // Apply stat changes
  for (const [stat, delta] of Object.entries(result.statChanges)) {
    if (stat in gameState.player && typeof (gameState.player as any)[stat] === 'number') {
      (gameState.player as any)[stat] = Math.max(0, Math.min(100, (gameState.player as any)[stat] + (delta || 0)));
    }
  }

  // Apply NPC changes
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = gameState.npcs.find(n => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
        npc.trust = Math.max(0, Math.min(100, npc.trust + change.trust));
      }
    }
  }

  // Apply camp morale from event
  camp.morale = Math.max(0, Math.min(100, camp.morale + result.moraleChange));

  camp.log.push(...result.log);
  camp.pendingEvent = undefined;

  // Advance day if no activities remain
  if (camp.activitiesRemaining <= 0) {
    advanceDay(camp);
  }
}

function advanceDay(camp: CampState): void {
  if (camp.day < camp.maxDays) {
    camp.day += 1;
    camp.activitiesRemaining = camp.activitiesPerDay;
    camp.completedActivities = [];
    camp.log.push({
      day: camp.day,
      text: 'Time passes. The camp stirs again.',
      type: 'narrative',
    });
  }
}

// Check if camp phase is complete
export function isCampComplete(camp: CampState): boolean {
  return camp.day >= camp.maxDays && camp.activitiesRemaining <= 0 && !camp.pendingEvent;
}

// Re-export for external use
export { getCampActivities } from './campActivities';
