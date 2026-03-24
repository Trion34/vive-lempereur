import type {
  CampActivityResult,
  CampEvent,
  CampLogEntry,
  CampState,
  NPC,
  PlayerCharacter,
} from '../types';
import { hasAttribute } from '../types';
import type {
  DeclarativeCampEvent,
  DeclarativeEventChoice,
  EventOutcome,
} from '../data/campaigns/types';

/**
 * Convert a DeclarativeCampEvent to the CampEvent used by the UI.
 * Evaluates choice locks against current player state.
 */
export function buildCampEventFromDeclarative(
  event: DeclarativeCampEvent,
  player: PlayerCharacter,
): CampEvent {
  return {
    id: event.id,
    category: event.category,
    title: event.title,
    narrative: event.narrative,
    choices: event.choices.map((c) => ({
      id: c.id,
      label: c.label,
      description: c.lock?.lockedMessage && isChoiceLocked(c, player)
        ? c.lock.lockedMessage
        : c.description,
      statCheck: c.statCheck,
      locked: isChoiceLocked(c, player),
    })),
    resolved: false,
  };
}

/**
 * Resolve a declarative camp event choice into a CampActivityResult.
 * Runs stat check → selects pass/fail outcome → builds result from deltas.
 */
export function resolveDeclarativeEvent(
  event: DeclarativeCampEvent,
  _state: CampState,
  player: PlayerCharacter,
  npcs: NPC[],
  choiceId: string,
  checkPassed: boolean,
  day: number,
): CampActivityResult {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { log: [], statChanges: {}, staminaChange: 0, moraleChange: 0 };
  }

  // Select pass or fail outcome
  const outcome = selectOutcome(choice, checkPassed);

  // Build result from outcome deltas
  return buildResultFromOutcome(outcome, player, npcs, day);
}

function isChoiceLocked(choice: DeclarativeEventChoice, player: PlayerCharacter): boolean {
  if (!choice.lock) return false;
  if (choice.lock.requireAttribute && !hasAttribute(player, choice.lock.requireAttribute)) {
    return true;
  }
  if (choice.lock.requireSous !== undefined && player.sous < choice.lock.requireSous) {
    return true;
  }
  return false;
}

function selectOutcome(choice: DeclarativeEventChoice, checkPassed: boolean): EventOutcome {
  if (checkPassed) return choice.pass;
  return choice.fail ?? choice.pass;
}

function buildResultFromOutcome(
  outcome: EventOutcome,
  player: PlayerCharacter,
  npcs: NPC[],
  day: number,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  if (outcome.narrative) {
    log.push({ day, type: 'result', text: outcome.narrative });
  }

  // Apply playerFields mutations (e.g. frontRank)
  if (outcome.playerFields) {
    if (outcome.playerFields.frontRank !== undefined) {
      player.frontRank = outcome.playerFields.frontRank;
    }
  }

  // Map npcRelationshipChanges to the npcChanges format
  const npcChanges = outcome.npcRelationshipChanges
    ?.filter((c) => npcs.some((n) => n.id === c.npcId))
    .map((c) => ({ npcId: c.npcId, relationship: c.delta }));

  return {
    log,
    statChanges: outcome.statChanges ?? {},
    moraleChange: outcome.moraleChange ?? 0,
    staminaChange: outcome.staminaChange ?? 0,
    healthChange: outcome.healthChange,
    sousChange: outcome.sousChange,
    virtueChange: outcome.virtueChange,
    flagChanges: outcome.flagChanges,
    npcChanges: npcChanges && npcChanges.length > 0 ? npcChanges : undefined,
  };
}
