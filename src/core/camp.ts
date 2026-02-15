import {
  CampState, CampConditions, CampActivityId, CampLogEntry,
  PlayerCharacter, NPC, GameState, CampActivity, CampEventResult,
} from '../types';
import { getCampActivities as getPostBattleActivities, resolveCampActivity } from './campActivities';
import { rollCampEvent, resolveCampEventChoice } from './campEvents';
import {
  getPreBattleActivities, resolvePreBattleActivity,
  rollPreBattleEvent, resolvePreBattleEventChoice,
} from './preBattleCamp';

interface CampConfig {
  location: string;
  days: number;
  context: 'pre-battle' | 'post-battle';
}

export function createCampState(
  player: PlayerCharacter,
  npcs: NPC[],
  config: CampConfig,
): CampState {
  const isPreBattle = config.context === 'pre-battle';

  const conditions: CampConditions = {
    weather: isPreBattle ? 'cold' : 'clear',
    supplyLevel: isPreBattle ? 'scarce' : 'adequate',
    campMorale: 'steady',
    location: config.location,
  };

  const openingNarrative = isPreBattle
    ? 'The 14th demi-brigade bivouacs on the plateau above the Adige. The January night is bitter. Fires dot the hillside like fallen stars.\n\nTomorrow, Alvinczi comes. Twenty-eight thousand Austrians against ten thousand French. The veterans don\'t talk about the odds. The conscripts can\'t stop talking about them.\n\nCaptain Leclerc walks the fires. "Rest. Eat. Check your flints. Tomorrow we hold this plateau or we die on it."\n\nTwo days until the march. Use them wisely.'
    : `The regiment makes camp near ${config.location}. Fires are lit. The wounded are tended. For now, the guns are silent.`;

  return {
    day: 1,
    maxDays: config.days,
    activitiesPerDay: 2,
    activitiesRemaining: 2,
    conditions,
    log: [
      {
        day: 1,
        text: openingNarrative,
        type: 'narrative',
      },
    ],
    completedActivities: [],
    triggeredEvents: [],
    health: player.health,
    stamina: player.stamina,
    morale: player.morale,
    context: config.context,
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

  // Resolve the activity (dispatch based on camp context)
  const result = camp.context === 'pre-battle'
    ? resolvePreBattleActivity(activityId, player, npcs, camp, targetNpcId)
    : resolveCampActivity(activityId, player, npcs, camp, targetNpcId);

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

  // Apply camp stamina/morale/health
  camp.stamina = Math.max(0, Math.min(100, camp.stamina + result.staminaChange));
  camp.morale = Math.max(0, Math.min(100, camp.morale + result.moraleChange));
  if (result.healthChange) {
    camp.health = Math.max(0, Math.min(100, camp.health + result.healthChange));
  }

  // Add logs
  camp.log.push(...result.log);
  camp.completedActivities.push(activityId);
  camp.activitiesRemaining -= 1;

  // Roll for random event (40% chance, dispatch based on context)
  if (!camp.pendingEvent) {
    const event = camp.context === 'pre-battle'
      ? rollPreBattleEvent(camp, player, npcs)
      : rollCampEvent(camp, player, npcs);
    if (event && !camp.triggeredEvents.includes(event.id)) {
      camp.pendingEvent = event;
      camp.triggeredEvents.push(event.id);
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

export function resolveCampEvent(gameState: GameState, choiceId: string): CampEventResult {
  const camp = gameState.campState!;
  const empty: CampEventResult = { log: [], statChanges: {}, moraleChange: 0 };
  if (!camp.pendingEvent) return empty;

  const result = camp.context === 'pre-battle'
    ? resolvePreBattleEventChoice(camp.pendingEvent, choiceId, gameState.player, gameState.npcs, camp.day)
    : resolveCampEventChoice(camp.pendingEvent, choiceId, gameState.player, gameState.npcs, camp.day);

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

  return result;
}

function advanceDay(camp: CampState): void {
  if (camp.day < camp.maxDays) {
    camp.day += 1;
    camp.activitiesRemaining = camp.activitiesPerDay;
    camp.completedActivities = [];
    // Natural daily health recovery
    camp.health = Math.min(100, camp.health + 10);
    const dayNarrative = camp.context === 'pre-battle'
      ? 'Dawn comes grey and cold. The fires are rebuilt. One day closer to the battle.'
      : 'Time passes. The camp stirs again.';
    camp.log.push({
      day: camp.day,
      text: dayNarrative,
      type: 'narrative',
    });
  }
}

// Check if camp phase is complete
export function isCampComplete(camp: CampState): boolean {
  return camp.day >= camp.maxDays && camp.activitiesRemaining <= 0 && !camp.pendingEvent;
}

// Context-aware activity list (delegates to pre-battle or post-battle)
export function getCampActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return camp.context === 'pre-battle'
    ? getPreBattleActivities(player, camp)
    : getPostBattleActivities(player, camp);
}
