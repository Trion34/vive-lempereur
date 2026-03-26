import {
  CampState,
  CampConditions,
  CampActivityId,
  CampEvent,
  PlayerCharacter,
  NPC,
  GameState,
  CampActivityResult,
  CampEventResult,
} from '../types';
import type { VNScene } from '../types/vnTypes';
import { adjustPlayerStat, clampStat, rollStat, displayRoll, displayTarget, getPlayerStat } from './stats';
import { resolveCampActivity } from './campActivities';
import type { CampConfig, AnyRandomEventConfig, AnyForcedEventConfig } from '../data/campaigns/types';
import { getCampaignDef } from '../data/campaigns/registry';
import { getCurrentNode } from './campaign';
import { buildCampEventFromDeclarative, resolveDeclarativeEvent } from './campEventInterpreter';
import type { VNSceneResult } from './vnSceneInterpreter';

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
    flags: {},
  };
}

// === Shared effect application ===

/** Returns true if any scene (cinematic or VN) is pending. */
export function hasPendingScene(camp: CampState): boolean {
  return !!camp.pendingEvent || !!camp.pendingVnScene;
}

/**
 * Apply camp effect changes to game state.
 * Shared by advanceCampTurn, resolveCampEvent, and resolveVnSceneResult.
 * @mutates gameState — modifies player stats, NPC relationships, condition meters, flags
 */
export function applyCampEffects(
  gameState: GameState,
  result: {
    statChanges: Partial<Record<string, number>>;
    moraleChange: number;
    staminaChange?: number;
    healthChange?: number;
    sousChange?: number;
    virtueChange?: number;
    npcChanges?: { npcId: string; relationship: number }[];
    flagChanges?: Record<string, boolean>;
  },
): void {
  const player = gameState.player;
  const npcs = gameState.npcs;
  const camp = gameState.campState!;

  for (const [stat, delta] of Object.entries(result.statChanges)) {
    adjustPlayerStat(player, stat, delta || 0);
  }
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = npcs.find((n) => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
      }
    }
  }
  player.morale = clampStat(player.morale + result.moraleChange);
  if (result.staminaChange) {
    player.stamina = clampStat(player.stamina + result.staminaChange);
  }
  if (result.healthChange) {
    player.health = clampStat(player.health + result.healthChange);
  }
  if (result.sousChange) {
    player.sous = Math.max(0, player.sous + result.sousChange);
  }
  if (result.virtueChange) {
    player.virtue = Math.max(-100, Math.min(100, player.virtue + result.virtueChange));
  }
  if (result.flagChanges) {
    Object.assign(camp.flags, result.flagChanges);
  }
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

  // Apply effects via shared helper
  applyCampEffects(gameState, result);

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

  // Add logs
  camp.log.push(...result.log);
  camp.completedActivities.push(activityId);
  camp.actionsRemaining -= 1;

  // Roll for config-driven random event
  if (!hasPendingScene(camp)) {
    const randomEvents = getRandomEventsForCamp(gameState);
    const chance = getRandomEventChance(gameState);
    if (randomEvents.length > 0 && Math.random() <= chance) {
      const available = randomEvents.filter((re) => !camp.triggeredEvents.includes(re.id));
      if (available.length > 0) {
        const pick = pickWeightedRandom(available);
        if (pick.kind === 'vn') {
          triggerForcedVnEvent(camp, pick.scene, pick.id, pick.title);
        } else {
          const event = pick.kind === 'declarative'
            ? buildCampEventFromDeclarative(pick.event, player)
            : pick.getEvent(camp, player);
          camp.pendingEvent = event;
          camp.triggeredEvents.push(event.id);
          camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
        }
      }
    }
  }

  return result;
}

/** Look up random events for the current camp from campaign config */
function getRandomEventsForCamp(gameState: GameState): AnyRandomEventConfig[] {
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

/** Look up random event chance for the current camp (defaults to 0.4) */
function getRandomEventChance(gameState: GameState): number {
  try {
    const campaignDef = getCampaignDef(gameState.campaign.campaignId);
    const node = getCurrentNode(gameState.campaign, campaignDef);
    if (!node || node.type !== 'camp') return 0.4;
    const campConfig = campaignDef.camps[node.campId];
    return campConfig?.randomEventChance ?? 0.4;
  } catch {
    return 0.4;
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

  // Resolve using config-driven callback or declarative interpreter
  let result: CampEventResult;
  if (eventConfig && eventConfig.kind === 'declarative') {
    const activityResult = resolveDeclarativeEvent(
      eventConfig.event, camp, gameState.player, gameState.npcs, choiceId, checkPassed, camp.day,
    );
    result = {
      log: activityResult.log,
      statChanges: activityResult.statChanges,
      moraleChange: activityResult.moraleChange,
      staminaChange: activityResult.staminaChange,
      healthChange: activityResult.healthChange,
      sousChange: activityResult.sousChange,
      virtueChange: activityResult.virtueChange,
      npcChanges: activityResult.npcChanges,
      flagChanges: activityResult.flagChanges,
    };
  } else if (eventConfig && eventConfig.kind === 'imperative') {
    const activityResult = eventConfig.resolveChoice(camp, gameState.player, gameState.npcs, choiceId, checkPassed);
    result = {
      log: activityResult.log,
      statChanges: activityResult.statChanges,
      moraleChange: activityResult.moraleChange,
      staminaChange: activityResult.staminaChange,
      healthChange: activityResult.healthChange,
      sousChange: activityResult.sousChange,
      virtueChange: activityResult.virtueChange,
      npcChanges: activityResult.npcChanges,
      flagChanges: activityResult.flagChanges,
    };
  } else {
    result = empty;
  }

  if (rollData) result.rollDisplay = rollData;
  event.resolved = true;

  // Apply effects via shared helper
  applyCampEffects(gameState, result);

  camp.log.push(...result.log);
  camp.pendingEvent = undefined;

  return result;
}

/** Look up the event config (forced or random) from the current camp's campaign config */
function findEventConfig(gameState: GameState, eventId: string): AnyForcedEventConfig | AnyRandomEventConfig | undefined {
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
/** Pick a random event using weight-based probability. */
export function pickWeightedRandom(events: AnyRandomEventConfig[]): AnyRandomEventConfig {
  const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) return events[Math.floor(Math.random() * events.length)];
  let roll = Math.random() * totalWeight;
  for (const e of events) {
    roll -= e.weight;
    if (roll <= 0) return e;
  }
  return events[events.length - 1];
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
  return camp.actionsRemaining <= 0 && !hasPendingScene(camp);
}

// === VN Scene Event Functions ===

/**
 * Trigger a forced VN event on the camp.
 * @mutates camp — sets pendingVnScene, pushes to triggeredEvents and log
 */
export function triggerForcedVnEvent(
  camp: CampState,
  scene: VNScene,
  configId: string,
  title?: string,
): void {
  camp.pendingVnScene = { sceneId: scene.id, scene, configId, title };
  camp.triggeredEvents.push(configId);
  camp.log.push({ day: camp.day, text: `[VN] ${title ?? scene.title}`, type: 'event' });
}

/**
 * Apply accumulated VN scene effects to game state.
 * Clears pendingVnScene atomically with effect application for crash safety.
 * @mutates gameState — applies all accumulated effects, clears pendingVnScene
 */
export function resolveVnSceneResult(gameState: GameState, result: VNSceneResult): void {
  applyCampEffects(gameState, result);

  const camp = gameState.campState!;
  if (result.rollDisplays.length > 0) {
    for (const rd of result.rollDisplays) {
      camp.log.push({
        day: camp.day,
        text: `${rd.stat} check: ${rd.passed ? 'Passed' : 'Failed'}`,
        type: 'result',
      });
    }
  }

  // Clear pendingVnScene atomically with effect application (crash safety)
  camp.pendingVnScene = undefined;
}
