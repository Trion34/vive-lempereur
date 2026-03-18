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
  MeleeContext,
  ChargeEncounterId,
} from '../types';
import { applyMoraleChanges } from './morale';
import { getScriptedAvailableActions } from './volleys';
import { getChargeEncounter, resolveChargeChoice } from './charge';
import { resolveMeleeRound } from './melee';
import { getBattleConfig } from '../data/battles/registry';
/** Returns new state via structuredClone — does NOT mutate the input. */
export function beginBattle(state: BattleState, openingNarrative: string): BattleState {
  const s = structuredClone(state);
  s.phase = BattlePhase.Line;
  s.log.push({ turn: 0, text: openingNarrative, type: 'narrative' });
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

  // Accumulate virtue changes for sync at battle end
  if (result.virtueChange) {
    s.pendingVirtueChange += result.virtueChange;
  }

  // Masséna rest reduces fatigue (TendWounds/CheckComrades)
  if (s.chargeEncounter === ChargeEncounterId.Massena) {
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
  if (s.phase === BattlePhase.Line && s.scriptedVolley >= 1) {
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
  if (!s.meleeState) return s;
  const ms = s.meleeState;

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
    if (ally.npcId === s.roles.leftNeighbour && s.line.leftNeighbour) {
      s.line.leftNeighbour.alive = ally.alive;
      s.line.leftNeighbour.wounded = !ally.alive || ally.health < ally.maxHealth * 0.5;
    }
    if (ally.npcId === s.roles.rightNeighbour && s.line.rightNeighbour) {
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
  } else if (result.battleEnd === 'survived' || result.battleEnd === 'victory' ||
    (!result.battleEnd && ms.exchangeCount >= ms.maxExchanges)) {
    // Melee concluded (survived, victory, or max rounds)
    // Check for battle-specific post-melee transition handler
    let handled = false;
    try {
      const config = getBattleConfig(s.configId);
      if (config.postMeleeTransition) {
        handled = config.postMeleeTransition(s, ms.meleeContext);
      }
    } catch { /* no config — fall through to generic path */ }

    if (!handled) {
      // Script-driven: find the melee segment and advance to next story beat
      const nextBeatId = findNextStoryBeatAfterMelee(s, ms.meleeContext);
      if (nextBeatId !== undefined) {
        s.phase = BattlePhase.StoryBeat;
        s.chargeEncounter = nextBeatId;
        const storyBeat = getChargeEncounter(s);
        s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
        s.availableActions = [];
      }
    }
  }

  // Warning at 3 rounds remaining
  if (!s.battleOver && !result.battleEnd && ms.exchangeCount === ms.maxExchanges - 3) {
    s.log.push({
      turn: s.turn,
      type: 'event',
      text:
        ms.meleeContext === MeleeContext.Terrain
          ? 'The fighting is thinning. The Austrians are faltering in the broken ground. A few more exchanges...'
          : ms.meleeContext === MeleeContext.Skirmish
            ? 'The skirmishing is winding down. The Austrians are pulling back. A few more exchanges...'
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

/** Find the next story beat ID after a melee segment in the battle script */
function findNextStoryBeatAfterMelee(s: BattleState, meleeContext: MeleeContext): number | undefined {
  try {
    const config = getBattleConfig(s.configId);
    const script = config.script;
    const meleeIdx = script.findIndex(
      (seg) => seg.type === 'melee' && seg.meleeContext === meleeContext,
    );
    if (meleeIdx < 0) return undefined;
    // Walk forward past setup segments to find the next story beat
    for (let i = meleeIdx + 1; i < script.length; i++) {
      const seg = script[i];
      if (seg.type === 'setup') {
        seg.apply(s);
        continue;
      }
      if (seg.type === 'story_beat') return seg.id;
      break;
    }
    return undefined;
  } catch {
    return undefined;
  }
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

/** Returns new state via structuredClone — does NOT mutate the input. */
export function advanceTurn(
  state: BattleState,
  action: ActionId | ChargeChoiceId | MeleeActionId,
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
    const chargeValues: Set<string> = new Set(Object.values(ChargeChoiceId));
    if (!chargeValues.has(action as string)) {
      console.warn(`advanceTurn: invalid ChargeChoiceId "${action}" in StoryBeat phase`);
      return s;
    }
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
