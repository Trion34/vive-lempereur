import {
  CampState, CampConditions, CampActivityId, CampLogEntry,
  PlayerCharacter, NPC, GameState, CampActivity, CampEventResult,
  getStrainTier, getStrainPenalties,
} from '../types';
import { adjustPlayerStat, clampStat } from './stats';
import { getCampActivities as getPostBattleActivities, resolveCampActivity } from './campActivities';
import { rollCampEvent, resolveCampEventChoice } from './campEvents';
import {
  getPreBattleActivities, resolvePreBattleActivity,
  rollPreBattleEvent, resolvePreBattleEventChoice,
  getBonaparteEvent,
} from './preBattleCamp';

interface CampConfig {
  location: string;
  actions: number;
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
    ? 'The 14th demi-brigade makes camp on the plateau above Rivoli. The Austrian columns are massing in the valley below. Bonaparte is on his way.'
    : `The regiment makes camp near ${config.location}. Fires are lit. The wounded are tended. Men who were killing an hour ago now sit in silence, staring at nothing.\n\nThe surgeon\u2019s tent glows from within. You can hear the sounds from here. You try not to listen.\n\nSomeone hands you a tin cup. The water is cold and tastes of rust. It is the finest thing you have ever drunk.\n\nFor now, the guns are silent.`;

  return {
    day: 1,
    actionsTotal: config.actions,
    actionsRemaining: config.actions,
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
    strain: 0,
    batheCooldown: 0,
    prayedThisCamp: false,
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
    adjustPlayerStat(player, stat, delta || 0);
  }

  // Apply NPC changes
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = npcs.find(n => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
        npc.trust = clampStat(npc.trust + change.trust);
      }
    }
  }

  // Strain system: training activities increase strain, rest decreases it
  const isTraining = activityId === CampActivityId.Exercise || activityId === CampActivityId.Train || activityId === CampActivityId.ArmsTraining
    || (activityId === CampActivityId.Duties && targetNpcId === 'drill');
  if (isTraining) {
    const tier = getStrainTier(camp.strain);
    const penalties = getStrainPenalties(tier);
    // Apply strain penalties: extra stamina cost + morale drain
    result.staminaChange -= penalties.staminaPenalty;
    result.moraleChange -= penalties.moralePenalty;
    // Increase strain from training
    camp.strain = Math.min(100, camp.strain + 25);
  } else if (activityId === CampActivityId.Rest) {
    // Strain reduction depends on rest type
    const restType = targetNpcId as string | undefined;
    if (restType === 'bathe') {
      camp.strain = Math.max(0, camp.strain - 25);
      camp.batheCooldown = 4;
    } else if (restType === 'pray') {
      camp.strain = Math.max(0, camp.strain - 10);
      camp.prayedThisCamp = true;
    } else {
      // lay_about (default)
      camp.strain = Math.max(0, camp.strain - 15);
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
    adjustPlayerStat(gameState.player, stat, delta || 0);
  }

  // Apply NPC changes
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = gameState.npcs.find(n => n.id === change.npcId);
      if (npc) {
        npc.relationship = Math.max(-100, Math.min(100, npc.relationship + change.relationship));
        npc.trust = clampStat(npc.trust + change.trust);
      }
    }
  }

  // Apply camp morale from event
  camp.morale = clampStat(camp.morale + result.moraleChange);

  camp.log.push(...result.log);
  camp.pendingEvent = undefined;

  return result;
}
// Check if camp phase is complete
export function isCampComplete(camp: CampState): boolean {
  return camp.actionsRemaining <= 0 && !camp.pendingEvent;
}

// Context-aware activity list (delegates to pre-battle or post-battle)
export function getCampActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return camp.context === 'pre-battle'
    ? getPreBattleActivities(player, camp)
    : getPostBattleActivities(player, camp);
}
