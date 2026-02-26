import {
  CampState,
  CampConditions,
  CampActivityId,
  CampLogEntry,
  PlayerCharacter,
  NPC,
  GameState,
  CampActivity,
  CampActivityResult,
  CampEventResult,
} from '../types';
import { adjustPlayerStat, clampStat } from './stats';
import {
  getPreBattleActivities,
  resolvePreBattleActivity,
  rollPreBattleEvent,
  resolvePreBattleEventChoice,
  getBonaparteEvent,
} from './preBattleCamp';
import { RIVOLI_CAMP_META } from '../data/battles/rivoli/camp';

interface CampConfig {
  location: string;
  actions: number;
}

export function createCampState(
  player: PlayerCharacter,
  npcs: NPC[],
  config: CampConfig,
): CampState {
  const conditions: CampConditions = {
    weather: RIVOLI_CAMP_META.weather,
    supplyLevel: RIVOLI_CAMP_META.supplyLevel,
    campMorale: 'steady',
    location: config.location,
  };

  return {
    day: 1,
    actionsTotal: config.actions,
    actionsRemaining: config.actions,
    conditions,
    log: [
      {
        day: 1,
        text: RIVOLI_CAMP_META.openingNarrative,
        type: 'narrative',
      },
    ],
    completedActivities: [],
    triggeredEvents: [],
    health: player.health,
    stamina: player.stamina,
    morale: player.morale,
    batheCooldown: 0,
    prayedThisCamp: false,
    context: RIVOLI_CAMP_META.context,
  };
}

export function advanceCampTurn(
  gameState: GameState,
  activityId: CampActivityId,
  targetNpcId?: string,
): CampActivityResult {
  const camp = gameState.campState!;
  const player = gameState.player;
  const npcs = gameState.npcs;

  const result = resolvePreBattleActivity(activityId, player, npcs, camp, targetNpcId);

  // Apply stat changes
  for (const [stat, delta] of Object.entries(result.statChanges)) {
    adjustPlayerStat(player, stat, delta || 0);
  }

  // Apply NPC changes
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = npcs.find((n) => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
      }
    }
  }

  // Track rest sub-activity state
  if (activityId === CampActivityId.Rest) {
    const restType = targetNpcId as string | undefined;
    if (restType === 'bathe') {
      camp.batheCooldown = 4;
    } else if (restType === 'pray') {
      camp.prayedThisCamp = true;
    }
  }

  // Decrement bathe cooldown on every activity
  if (camp.batheCooldown > 0 && !(activityId === CampActivityId.Rest && targetNpcId === 'bathe')) {
    camp.batheCooldown = Math.max(0, camp.batheCooldown - 1);
  }

  // Apply camp stamina/morale/health
  camp.stamina = clampStat(camp.stamina + result.staminaChange);
  camp.morale = clampStat(camp.morale + result.moraleChange);
  if (result.healthChange) {
    camp.health = clampStat(camp.health + result.healthChange);
  }

  // Add logs
  camp.log.push(...result.log);
  camp.completedActivities.push(activityId);
  camp.actionsRemaining -= 1;

  // Roll for random event (40% chance)
  if (!camp.pendingEvent) {
    const event = rollPreBattleEvent(camp, player, npcs);
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

  return result;
}

export function resolveCampEvent(gameState: GameState, choiceId: string): CampEventResult {
  const camp = gameState.campState!;
  const empty: CampEventResult = { log: [], statChanges: {}, moraleChange: 0 };
  if (!camp.pendingEvent) return empty;

  const result = resolvePreBattleEventChoice(
    camp.pendingEvent,
    choiceId,
    gameState.player,
    gameState.npcs,
    camp.day,
  );

  // Apply stat changes
  for (const [stat, delta] of Object.entries(result.statChanges)) {
    adjustPlayerStat(gameState.player, stat, delta || 0);
  }

  // Apply NPC changes
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = gameState.npcs.find((n) => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
      }
    }
  }

  // Apply camp morale and stamina from event
  camp.morale = clampStat(camp.morale + result.moraleChange);
  if (result.staminaChange) {
    camp.stamina = clampStat(camp.stamina + result.staminaChange);
  }

  camp.log.push(...result.log);
  camp.pendingEvent = undefined;

  return result;
}
// Check if camp phase is complete
export function isCampComplete(camp: CampState): boolean {
  return camp.actionsRemaining <= 0 && !camp.pendingEvent;
}

export function getCampActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return getPreBattleActivities(player, camp);
}
