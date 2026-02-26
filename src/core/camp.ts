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
  resolvePreBattleEventChoice,
  getBonaparteEvent,
} from './preBattleCamp';
import type { CampConfig, RandomEventConfig } from '../data/campaigns/types';
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

  // Apply condition meter changes directly to player
  gameState.player.morale = clampStat(gameState.player.morale + result.moraleChange);
  if (result.staminaChange) {
    gameState.player.stamina = clampStat(gameState.player.stamina + result.staminaChange);
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
