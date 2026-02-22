import {
  BattleState, BattlePhase, DrillStep, Player, Soldier, Officer,
  LineState, EnemyState, MoraleThreshold,
  HealthState, getHealthState, FatigueTier, getFatigueTier,
  ActionId,
  ChargeChoiceId, MeleeActionId, BodyPart, MeleeStance,
  getHealthPoolSize, getStaminaPoolSize,
} from '../types';
import { applyMoraleChanges, rollValor } from './morale';
import { getScriptedAvailableActions } from './scriptedVolleys';
import { getChargeEncounter, resolveChargeChoice } from './charge';
import { resolveMeleeRound } from './melee';

function makeSoldier(id: string, name: string, exp: number, rel: number): Soldier {
  const maxMorale = 80 + exp * 0.2 + Math.random() * 20;
  const valor = 30 + exp * 0.5 + Math.random() * 10;
  return {
    id, name, rank: 'private',
    valor,
    morale: maxMorale, maxMorale,
    threshold: MoraleThreshold.Steady,
    alive: true, wounded: false, routing: false, musketLoaded: true,
    relationship: rel,
  };
}

function createInitialBattleState(): BattleState {
  const maxHp = getHealthPoolSize(45);        // default constitution 45 → 125
  const maxStam = getStaminaPoolSize(40) * 4; // default endurance 40 → 400
  const player: Player = {
    name: 'Soldier',
    valor: 40,
    morale: 100, maxMorale: 100, moraleThreshold: MoraleThreshold.Steady,
    health: maxHp, maxHealth: maxHp, healthState: HealthState.Unhurt,
    stamina: maxStam, maxStamina: maxStam,
    fatigue: 0, maxFatigue: maxStam, fatigueTier: FatigueTier.Fresh,
    musketLoaded: true, alive: true, routing: false,
    fumbledLoad: false,
    soldierRep: 50, officerRep: 50, napoleonRep: 0,
    frontRank: false,
    canteenUses: 0,
    musketry: 35, elan: 35, strength: 40, endurance: 40, constitution: 45,
    charisma: 30, intelligence: 30, awareness: 35,
  };

  const officer: Officer = {
    name: 'Leclerc', rank: 'Capt.',
    alive: true, wounded: false, mounted: true,
    status: 'Mounted, steady',
  };

  const line: LineState = {
    leftNeighbour: makeSoldier('left', 'Pierre', 30, 60),
    rightNeighbour: makeSoldier('right', 'Jean-Baptiste', 10, 40),
    officer,
    lineIntegrity: 100,
    lineMorale: 'resolute',
    drumsPlaying: true,
    ncoPresent: true,
    casualtiesThisTurn: 0,
  };

  const enemy: EnemyState = {
    range: 120, strength: 100, quality: 'line',
    morale: 'advancing', lineIntegrity: 100,
    artillery: true, cavalryThreat: false,
  };

  const state: BattleState = {
    phase: BattlePhase.Intro,
    turn: 0,
    drillStep: DrillStep.Present,
    player, line, enemy,
    log: [], availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false, outcome: 'pending',
    crisisTurn: 0, volleysFired: 0,
    // Scripted Phase 1
    scriptedVolley: 1,
    aimCarefullySucceeded: false,
    // Phase 2
    chargeEncounter: 0,
    // Part tracking
    battlePart: 1,
    batteryCharged: false,
    meleeStage: 0,
    wagonDamage: 0,
    gorgeMercyCount: 0,
    // Auto-play Part 1
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
  };

  return state;
}

export function beginBattle(state: BattleState): BattleState {
  const s = structuredClone(state);
  s.phase = BattlePhase.Line;
  s.log.push({ turn: 0, text: openingNarrative(), type: 'narrative' });
  s.availableActions = getScriptedAvailableActions(s);
  return s;
}

function openingNarrative(): string {
  return `Dawn on the Rivoli plateau. January cold cuts through your patched coat. The 14th stands in the second line, muskets loaded, waiting. The mountains fill the horizon \u2014 and somewhere in those gorges, twenty-eight thousand Austrians are moving.

Gunfire erupts on the right flank. Not the steady crash of volleys \u2014 ragged, sudden, too early. The battle has begun before anyone expected it.

To your left, Pierre checks his flint. Arcole veteran. Steady hands. To your right, Jean-Baptiste grips his musket like a drowning man grips driftwood.

The drums roll. The 14th advances through the broken ground \u2014 vineyards, stone walls, churned earth \u2014 toward the sound of the guns.

"Present arms! First volley on my command!"`;
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
    s.player.health = Math.max(0, Math.min(s.player.maxHealth, s.player.health + result.healthDelta));
    s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
  }
  if (result.staminaDelta !== 0) {
    s.player.stamina = Math.max(0, Math.min(s.player.maxStamina, s.player.stamina + result.staminaDelta));
  }

  // Masséna rest reduces fatigue (TendWounds/CheckComrades)
  if (s.chargeEncounter === 2) {
    const fatigueReduction = Math.round(s.player.maxFatigue * 0.30);
    s.player.fatigue = Math.max(0, s.player.fatigue - fatigueReduction);
  }
  s.player.fatigueTier = getFatigueTier(s.player.fatigue, s.player.maxFatigue);

  // Apply morale
  const { newMorale, threshold } = applyMoraleChanges(
    s.player.morale, s.player.maxMorale, s.pendingMoraleChanges, s.player.valor
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
    s.player.morale, s.player.maxMorale, s.pendingMoraleChanges, s.player.valor
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
    s.log.push({ turn: s.turn, type: 'event', text: 'The bayonet finds you. You go down in the press of bodies, in the mud and the blood. The field takes you.' });
  } else if (result.battleEnd === 'survived') {
    if (ms.meleeContext === 'battery') {
      return transitionBatteryToMassena(s);
    }
    // Terrain survived — same transition as victory, battle continues
    s.phase = BattlePhase.StoryBeat;
    s.chargeEncounter = 1;
    s.log.push({
      turn: s.turn, type: 'narrative',
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
        turn: s.turn, type: 'narrative',
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
        turn: s.turn, type: 'narrative',
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
      turn: s.turn, type: 'event',
      text: ms.meleeContext === 'terrain'
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
  const pierreAlly = ms.allies.find(a => a.npcId === 'pierre');
  const pierreAlive = pierreAlly ? pierreAlly.alive : (s.line.leftNeighbour?.alive ?? true);
  const pierreClause = pierreAlive
    ? "Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing."
    : "Pierre is gone. You saw him fall in the press. Another name for the list.";

  s.log.push({
    turn: s.turn, type: 'narrative',
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
    turn: s.turn, type: 'narrative',
    text: 'You can\'t. You can\'t do this anymore. The bayonet drops. Your legs carry you backwards, then sideways, then away — stumbling down the rocky slope. Running. The shame will come later. Right now there is only the animal need to survive.',
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
    return advanceMeleeTurn(s, meleeInput.action, meleeInput.bodyPart, meleeInput.stance, meleeInput.targetIndex);
  }

  // Line phase uses auto-play — advanceTurn is a no-op
  return s;
}

// Resolves the auto-fire when the player fumbled their load.
export function resolveAutoFumbleFire(state: BattleState): BattleState {
  const s = structuredClone(state);

  s.log.push({ turn: s.turn, text: 'Musket empty.', type: 'result' });

  const { success: unnoticed } = rollValor(s.player.valor, 20);
  const ncoAttentive = s.line.ncoPresent && s.player.officerRep < 40;
  const noticed = !unnoticed || (ncoAttentive && Math.random() < 0.4);

  if (noticed) {
    s.log.push({ turn: s.turn, text: 'Sergeant saw. Empty musket.', type: 'event' });
    s.pendingMoraleChanges.push({ amount: -5, reason: 'Caught with an empty musket', source: 'action' });
    s.player.officerRep = Math.max(0, s.player.officerRep - 8);
  } else {
    s.log.push({ turn: s.turn, text: 'No one noticed.', type: 'action' });
    s.pendingMoraleChanges.push({ amount: 2, reason: 'Unnoticed — relief', source: 'recovery' });
  }

  s.player.fumbledLoad = false;
  s.drillStep = DrillStep.Endure;

  s.availableActions = getScriptedAvailableActions(s);

  return s;
}

