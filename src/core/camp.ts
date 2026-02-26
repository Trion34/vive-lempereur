import {
  CampState,
  CampConditions,
  CampActivityId,
  CampLogEntry,
  CampEvent,
  PlayerCharacter,
  NPC,
  GameState,
  CampActivity,
  CampActivityResult,
  CampEventResult,
} from '../types';
import { adjustPlayerStat, clampStat, rollStat, displayRoll, displayTarget, getPlayerStat } from './stats';
import { getCampActivityList, resolveCampActivity } from './campActivities';
import type { CampConfig, RandomEventConfig, ForcedEventConfig } from '../data/campaigns/types';
import { getCampaignDef } from '../data/campaigns/registry';
import { getCurrentNode } from './campaign';

export function createCampState(
  player: PlayerCharacter,
  npcs: NPC[],
  config: CampConfig,
): CampState {
  const conditions: CampConditions = {
    weather: config.weather as CampConditions['weather'],
    supplyLevel: config.supplyLevel as CampConditions['supplyLevel'],
    campMorale: 'steady',
    location: config.title,
  };

  return {
    day: 1,
    actionsTotal: config.actionsTotal,
    actionsRemaining: config.actionsTotal,
    conditions,
    log: config.openingNarrative
      ? [
          {
            day: 1,
            text: config.openingNarrative,
            type: 'narrative',
          },
        ]
      : [],
    completedActivities: [],
    triggeredEvents: [],
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: config.id,
  };
}

/**
 * Advance camp by one activity turn.
 * @mutates gameState — modifies player stats, NPC relationships, camp cooldowns/log/actions
 */
export function advanceCampTurn(
  gameState: GameState,
  activityId: CampActivityId,
  targetNpcId?: string,
): CampActivityResult {
  const camp = gameState.campState!;
  const player = gameState.player;
  const npcs = gameState.npcs;

  const result = resolveCampActivity(activityId, player, npcs, camp, targetNpcId);

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

  // Apply condition meter changes directly to player
  player.stamina = clampStat(player.stamina + result.staminaChange);
  player.morale = clampStat(player.morale + result.moraleChange);
  if (result.healthChange) {
    player.health = clampStat(player.health + result.healthChange);
  }

  // Add logs
  camp.log.push(...result.log);
  camp.completedActivities.push(activityId);
  camp.actionsRemaining -= 1;

  // Roll for config-driven random event (40% chance)
  if (!camp.pendingEvent) {
    const randomEvents = getRandomEventsForCamp(gameState);
    if (randomEvents.length > 0 && Math.random() <= 0.4) {
      const available = randomEvents.filter((re) => !camp.triggeredEvents.includes(re.id));
      if (available.length > 0) {
        const pick = available[Math.floor(Math.random() * available.length)];
        const event = pick.getEvent(camp, player);
        camp.pendingEvent = event;
        camp.triggeredEvents.push(event.id);
        camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
      }
    }
  }

  return result;
}

/** Look up random events for the current camp from campaign config */
function getRandomEventsForCamp(gameState: GameState): RandomEventConfig[] {
  try {
    const campaignDef = getCampaignDef(gameState.campaign.campaignId);
    const node = getCurrentNode(gameState.campaign, campaignDef);
    if (!node || node.type !== 'camp') return [];
    const campConfig = campaignDef.camps[node.campId];
    return campConfig?.randomEvents ?? [];
  } catch {
    return [];
  }
}

/**
 * Resolve a pending camp event choice.
 * @mutates gameState — modifies event.resolved, player stats, NPC relationships, camp log/pendingEvent
 */
export function resolveCampEvent(gameState: GameState, choiceId: string): CampEventResult {
  const camp = gameState.campState!;
  const empty: CampEventResult = { log: [], statChanges: {}, moraleChange: 0 };
  if (!camp.pendingEvent) return empty;

  const event = camp.pendingEvent;
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) return empty;

  // Look up event config from campaign definition
  const eventConfig = findEventConfig(gameState, event.id);

  // Run stat check if the choice has one
  let checkPassed = true;
  let rollData: { stat: string; roll: number; target: number; passed: boolean } | undefined;
  if (choice.statCheck) {
    const statVal = getPlayerStat(gameState.player, choice.statCheck.stat) || 30;
    const statResult = rollStat(statVal, 0, choice.statCheck.difficulty);
    checkPassed = statResult.success;
    rollData = {
      stat: choice.statCheck.stat.charAt(0).toUpperCase() + choice.statCheck.stat.slice(1),
      roll: displayRoll(statResult.roll),
      target: displayTarget(statResult.target),
      passed: statResult.success,
    };
  }

  // Resolve using config-driven callback
  let result: CampEventResult;
  if (eventConfig) {
    const activityResult = eventConfig.resolveChoice(camp, gameState.player, gameState.npcs, choiceId, checkPassed);
    result = {
      log: activityResult.log,
      statChanges: activityResult.statChanges,
      moraleChange: activityResult.moraleChange,
      staminaChange: activityResult.staminaChange,
      npcChanges: activityResult.npcChanges,
    };
  } else {
    result = empty;
  }

  if (rollData) result.rollDisplay = rollData;
  event.resolved = true;

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

  // Apply condition meter changes directly to player
  gameState.player.morale = clampStat(gameState.player.morale + result.moraleChange);
  if (result.staminaChange) {
    gameState.player.stamina = clampStat(gameState.player.stamina + result.staminaChange);
  }

  camp.log.push(...result.log);
  camp.pendingEvent = undefined;

  return result;
}

/** Look up the event config (forced or random) from the current camp's campaign config */
function findEventConfig(gameState: GameState, eventId: string): ForcedEventConfig | RandomEventConfig | undefined {
  try {
    const campaignDef = getCampaignDef(gameState.campaign.campaignId);
    const node = getCurrentNode(gameState.campaign, campaignDef);
    if (!node || node.type !== 'camp') return undefined;
    const campConfig = campaignDef.camps[node.campId];
    if (!campConfig) return undefined;
    const forced = campConfig.forcedEvents.find((e) => e.id === eventId);
    if (forced) return forced;
    return campConfig.randomEvents.find((e) => e.id === eventId);
  } catch {
    return undefined;
  }
}
/**
 * Trigger a forced event on the camp.
 * @mutates camp — sets pendingEvent, pushes to triggeredEvents and log
 */
export function triggerForcedEvent(camp: CampState, event: CampEvent, eventId: string): void {
  camp.pendingEvent = event;
  camp.triggeredEvents.push(eventId);
  camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
}

/**
 * Clear the pending event from camp.
 * @mutates camp — sets pendingEvent to undefined
 */
export function clearPendingEvent(camp: CampState): void {
  camp.pendingEvent = undefined;
}

// Check if camp phase is complete
export function isCampComplete(camp: CampState): boolean {
  return camp.actionsRemaining <= 0 && !camp.pendingEvent;
}

export function getCampActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return getCampActivityList(player, camp);
}
