import {
  BattleState,
  BattlePhase,
  getHealthState,
  getFatigueTier,
  ActionId,
  ChargeChoiceId,
  MeleeActionId,
  BodyPart,
  MeleeStance,
} from '../types';
import { applyMoraleChanges } from './morale';
import { getScriptedAvailableActions } from './volleys';
import { getChargeEncounter, resolveChargeChoice } from './charge';
import { resolveMeleeRound } from './melee';
import { RIVOLI_OPENING } from '../data/battles/rivoli/text';

export function beginBattle(state: BattleState, openingNarrative?: string): BattleState {
  const s = structuredClone(state);
  s.phase = BattlePhase.Line;
  s.log.push({ turn: 0, text: openingNarrative ?? RIVOLI_OPENING.narrative, type: 'narrative' });
  s.availableActions = getScriptedAvailableActions(s);
  return s;
}

// ============================================================
// STORY BEAT TURN (Battery overrun choice)
// ============================================================

function advanceChargeTurn(s: BattleState, choiceId: ChargeChoiceId): BattleState {
  // Resolve the player's choice (handles phase transitions internally)
  const result = resolveChargeChoice(s, choiceId);
  s.log.push(...result.log);
  s.pendingMoraleChanges.push(...result.moraleChanges);

  // Apply health/stamina deltas
  if (result.healthDelta !== 0) {
    s.player.health = Math.max(
      0,
      Math.min(s.player.maxHealth, s.player.health + result.healthDelta),
    );
    s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
  }
  if (result.staminaDelta !== 0) {
    s.player.stamina = Math.max(
      0,
      Math.min(s.player.maxStamina, s.player.stamina + result.staminaDelta),
    );
  }

  // Masséna rest reduces fatigue (TendWounds/CheckComrades)
  if (s.chargeEncounter === 2) {
    const fatigueReduction = Math.round(s.player.maxFatigue * 0.3);
    s.player.fatigue = Math.max(0, s.player.fatigue - fatigueReduction);
  }
  s.player.fatigueTier = getFatigueTier(s.player.fatigue, s.player.maxFatigue);

  // Apply morale
  const { newMorale, threshold } = applyMoraleChanges(
    s.player.morale,
    s.player.maxMorale,
    s.pendingMoraleChanges,
    s.player.valor,
  );
  s.player.morale = newMorale;
  s.player.moraleThreshold = threshold;

  // Morale summary
  const total = s.pendingMoraleChanges.reduce((sum, c) => sum + c.amount, 0);
  if (Math.round(total) !== 0) {
    s.log.push({
      turn: s.turn,
      text: `Morale ${total > 0 ? 'recovered' : 'lost'}: ${total > 0 ? '+' : ''}${Math.round(total)}`,
      type: 'morale',
    });
  }

  // Populate actions if transitioning to Line phase (e.g. Masséna → Part 2, Gorge → Part 3)
  if (s.phase === BattlePhase.Line && s.scriptedVolley >= 1 && s.scriptedVolley <= 11) {
    s.availableActions = getScriptedAvailableActions(s);
  } else {
    s.availableActions = [];
  }
  return s;
}

// ============================================================
// MELEE TURN (Phase 3: turn-based combat)
// ============================================================

function advanceMeleeTurn(
  s: BattleState,
  meleeAction: MeleeActionId,
  bodyPart?: BodyPart,
  stance?: MeleeStance,
  targetIndex?: number,
): BattleState {
  const ms = s.meleeState!;

  // Set stance if provided
  if (stance) ms.playerStance = stance;

  // Resolve the round (unified: player → allies → enemies)
  const result = resolveMeleeRound(s, meleeAction, bodyPart, targetIndex ?? ms.playerTargetIndex);
  s.log.push(...result.log);
  s.pendingMoraleChanges.push(...result.moraleChanges);

  // Health, stamina, and fatigue are now applied in-place during resolution.
  // Update derived state from current values.
  s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
  s.player.fatigueTier = getFatigueTier(s.player.fatigue, s.player.maxFatigue);

  // Apply morale
  const { newMorale, threshold } = applyMoraleChanges(
    s.player.morale,
    s.player.maxMorale,
    s.pendingMoraleChanges,
    s.player.valor,
  );
  s.player.morale = newMorale;
  s.player.moraleThreshold = threshold;

  // Morale summary
  const total = s.pendingMoraleChanges.reduce((sum, c) => sum + c.amount, 0);
  if (Math.round(total) !== 0) {
    s.log.push({
      turn: s.turn,
      text: `Morale ${total > 0 ? 'recovered' : 'lost'}: ${total > 0 ? '+' : ''}${Math.round(total)}`,
      type: 'morale',
    });
  }

  // Sync named ally status back to NPCs (harmless no-op when no allies)
  for (const ally of ms.allies) {
    if (ally.npcId === 'pierre' && s.line.leftNeighbour) {
      s.line.leftNeighbour.alive = ally.alive;
      s.line.leftNeighbour.wounded = !ally.alive || ally.health < ally.maxHealth * 0.5;
    }
    if (ally.npcId === 'jean-baptiste' && s.line.rightNeighbour) {
      s.line.rightNeighbour.alive = ally.alive;
      s.line.rightNeighbour.wounded = !ally.alive || ally.health < ally.maxHealth * 0.5;
    }
  }

  // Battle end from round resolution
  if (result.battleEnd === 'defeat') {
    s.player.alive = false;
    s.battleOver = true;
    s.outcome = 'defeat';
    s.log.push({
      turn: s.turn,
      type: 'event',
      text: 'The bayonet finds you. You go down in the press of bodies, in the mud and the blood. The field takes you.',
    });
  } else if (result.battleEnd === 'survived') {
    if (ms.meleeContext === 'battery') {
      return transitionBatteryToMassena(s);
    }
    // Terrain survived — same transition as victory, battle continues
    s.phase = BattlePhase.StoryBeat;
    s.chargeEncounter = 1;
    s.log.push({
      turn: s.turn,
      type: 'narrative',
      text: 'The fighting ebbs. Not a victory \u2014 not a defeat. The Austrians pull back through the broken ground, regrouping. You lean on your musket, gasping. Around you, the survivors of the 14th do the same.\n\nBut the battle is not over. Not even close.',
    });
    const storyBeat = getChargeEncounter(s);
    s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
    s.availableActions = [];
  } else if (result.battleEnd === 'victory') {
    // All enemies defeated — context-aware transition
    if (ms.meleeContext === 'battery') {
      return transitionBatteryToMassena(s);
    } else {
      // Terrain victory
      s.phase = BattlePhase.StoryBeat;
      s.chargeEncounter = 1;
      s.log.push({
        turn: s.turn,
        type: 'narrative',
        text: 'The fighting ebbs. Not a victory \u2014 not a defeat. The Austrians pull back through the broken ground, regrouping. You lean on your musket, gasping. Around you, the survivors of the 14th do the same.\n\nBut the battle is not over. Not even close.',
      });
      const storyBeat = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
      s.availableActions = [];
      return s;
    }
  } else if (!result.battleEnd && ms.exchangeCount >= ms.maxExchanges) {
    // Max rounds reached without decisive outcome — context-aware transition
    if (ms.meleeContext === 'battery') {
      return transitionBatteryToMassena(s);
    } else if (ms.meleeContext === 'terrain') {
      s.phase = BattlePhase.StoryBeat;
      s.chargeEncounter = 1;
      s.log.push({
        turn: s.turn,
        type: 'narrative',
        text: 'The fighting ebbs. Not a victory \u2014 not a defeat. The Austrians pull back through the broken ground, regrouping. You lean on your musket, gasping. Around you, the survivors of the 14th do the same.\n\nBut the battle is not over. Not even close.',
      });
      const storyBeat = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
      s.availableActions = [];
      return s;
    }
  }

  // Warning at 3 rounds remaining
  if (!s.battleOver && !result.battleEnd && ms.exchangeCount === ms.maxExchanges - 3) {
    s.log.push({
      turn: s.turn,
      type: 'event',
      text:
        ms.meleeContext === 'terrain'
          ? 'The fighting is thinning. The Austrians are faltering in the broken ground. A few more exchanges...'
          : 'The redoubt is nearly clear. The last defenders cling to the guns. Almost there.',
    });
  }

  // Reset melee UI state for next exchange
  if (!s.battleOver && s.meleeState) {
    s.meleeState.selectingStance = false;
    s.meleeState.selectingTarget = false;
    s.meleeState.selectedAction = undefined;
  }

  s.availableActions = [];
  return s;
}

/** Shared battery→Masséna transition */
function transitionBatteryToMassena(s: BattleState): BattleState {
  const ms = s.meleeState!;

  // Check if Pierre survived the melee
  const pierreAlly = ms.allies.find((a) => a.npcId === 'pierre');
  const pierreAlive = pierreAlly ? pierreAlly.alive : (s.line.leftNeighbour?.alive ?? true);
  const pierreClause = pierreAlive
    ? 'Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing.'
    : 'Pierre is gone. You saw him fall in the press. Another name for the list.';

  s.log.push({
    turn: s.turn,
    type: 'narrative',
    text: `\n--- THE BATTERY IS YOURS ---\n\nThe last defender falls. The guns are yours again \u2014 French guns, retaken by French soldiers. ${pierreClause}\n\nCaptain Leclerc's voice carries across the redoubt: "Turn them! Turn the guns!"\n\nMen scramble to the pieces. Rammers are found. Powder charges. Within minutes, the captured battery roars again \u2014 this time firing in the right direction. Austrian canister tears into the white-coated columns still pressing the plateau.\n\nThe 14th took back its guns. The cost is written in the bodies around the redoubt. But the guns are yours.`,
  });
  s.phase = BattlePhase.StoryBeat;
  s.chargeEncounter = 2;
  const storyBeat = getChargeEncounter(s);
  s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
  s.availableActions = [];
  return s;
}

// Called from app.ts when player clicks "Flee" at Breaking morale
export function resolveMeleeRout(state: BattleState): BattleState {
  const s = structuredClone(state);
  s.battleOver = true;
  s.outcome = 'rout';
  s.log.push({
    turn: s.turn,
    type: 'narrative',
    text: "You can't. You can't do this anymore. The bayonet drops. Your legs carry you backwards, then sideways, then away — stumbling down the rocky slope. Running. The shame will come later. Right now there is only the animal need to survive.",
  });
  s.availableActions = [];
  return s;
}

// ============================================================
// MAIN TURN (dispatches to story beat or melee path)
// ============================================================

export interface MeleeTurnInput {
  action: MeleeActionId;
  bodyPart?: BodyPart;
  stance?: MeleeStance;
  targetIndex?: number;
}

export function advanceTurn(
  state: BattleState,
  action: ActionId | ChargeChoiceId,
  meleeInput?: MeleeTurnInput,
): BattleState {
  const s = structuredClone(state);
  s.turn += 1;
  s.pendingMoraleChanges = [];
  s.line.casualtiesThisTurn = 0;
  s.lastLoadResult = undefined;
  s.lastValorRoll = undefined;

  // STORY BEAT PATH
  if (s.phase === BattlePhase.StoryBeat) {
    return advanceChargeTurn(s, action as ChargeChoiceId);
  }

  // MELEE PATH
  if (s.phase === BattlePhase.Melee && meleeInput) {
    return advanceMeleeTurn(
      s,
      meleeInput.action,
      meleeInput.bodyPart,
      meleeInput.stance,
      meleeInput.targetIndex,
    );
  }

  // Line phase uses auto-play — advanceTurn is a no-op
  return s;
}
