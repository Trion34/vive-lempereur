import {
  BattleState, BattlePhase, DrillStep, Player, Soldier, Officer,
  LineState, EnemyState, MoraleThreshold, getMoraleThreshold,
  HealthState, getHealthState, StaminaState, getStaminaState,
  ActionId, LogEntry, MoraleChange,
  ChargeChoiceId, MeleeActionId, BodyPart, MeleeStance,
} from '../types';
import { calculatePassiveDrain, calculateRecovery, applyMoraleChanges, rollAutoLoad, rollValor } from './morale';
import { getAvailableActions, resolveAction } from './actions';
import { generateTurnEvents } from './events';
import {
  VOLLEY_DEFS, VOLLEY_RANGES,
  resolveScriptedFire, resolveScriptedEvents, resolveJBCrisis,
  resolveScriptedReturnFire, getScriptedAvailableActions, getVolleyNarrative,
} from './scriptedVolleys';
import { getChargeEncounter, resolveChargeChoice } from './charge';
import {
  createMeleeState, resolveMeleeExchange, advanceToNextOpponent, resetMeleeHistory,
} from './melee';

function makeSoldier(id: string, name: string, exp: number, rel: number): Soldier {
  const maxMorale = 80 + exp * 0.2 + Math.random() * 20;
  const valor = 30 + exp * 0.5 + Math.random() * 10;
  return {
    id, name, rank: 'private',
    valor,
    morale: maxMorale, maxMorale,
    threshold: MoraleThreshold.Steady,
    alive: true, wounded: false, routing: false, musketLoaded: true,
    experience: exp, relationship: rel,
  };
}

export function createInitialBattleState(): BattleState {
  const player: Player = {
    valor: 40,
    morale: 100, maxMorale: 100, moraleThreshold: MoraleThreshold.Steady,
    health: 100, maxHealth: 100, healthState: HealthState.Unhurt,
    stamina: 100, maxStamina: 100, staminaState: StaminaState.Fresh,
    musketLoaded: true, alive: true, routing: false,
    experience: 20, heldFire: false, fumbledLoad: false,
    ncoApproval: 50, duckedLastTurn: false,
    duckCount: 0, prayerCount: 0, canteenUses: 0, turnsWithEmptyMusket: 0,
    reputation: 0,
  };

  const officer: Officer = {
    name: 'Moreau', rank: 'Capt.',
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
    filesDeep: 3,
    casualtiesThisTurn: 0,
  };

  const enemy: EnemyState = {
    range: 120, strength: 100, quality: 'line',
    morale: 'advancing', lineIntegrity: 100,
    artillery: true, cavalryThreat: false,
  };

  const state: BattleState = {
    phase: BattlePhase.Line,
    turn: 0,
    drillStep: DrillStep.Present,
    player, line, enemy,
    log: [], availableActions: [],
    pendingMoraleChanges: [],
    weather: 'smoke', timeOfDay: 'Morning',
    battleOver: false, outcome: 'pending',
    crisisTurn: 0, volleysFired: 0,
    // Scripted Phase 1
    scriptedVolley: 1,
    aimCarefullySucceeded: false,
    jbCrisisResolved: false,
    // Phase 2
    chargeEncounter: 0,
  };

  state.log.push({ turn: 0, text: openingNarrative(), type: 'narrative' });
  state.availableActions = getScriptedAvailableActions(state);
  return state;
}

function openingNarrative(): string {
  return `The drums roll. You stand in the second file, musket loaded, bayonet not yet fixed. The morning fog clings to the field like a burial shroud.

The enemy line has halted at a hundred and twenty paces. You can see their colours through the haze. Blue coats. White crossbelts. Bayonets like a steel hedge. Thousands of them. The same uniform as yours, on the other side.

To your left, Pierre — a veteran of Austerlitz — checks his flint with steady hands. To your right, Jean-Baptiste — a conscript from Lyon, three weeks in uniform — grips his musket like it's the only thing keeping him upright. It might be.

The captain draws his sword. "Present arms! First volley on my command!"

The wait is over. The worst part is about to begin.`;
}

// ============================================================
// SCRIPTED PHASE 1 TURN
// ============================================================

function advanceScriptedTurn(s: BattleState, action: ActionId): BattleState {
  const volleyIdx = s.scriptedVolley - 1;
  const def = VOLLEY_DEFS[volleyIdx];
  const currentStep = s.drillStep;

  // Lock enemy range to script
  s.enemy.range = def.range;

  // 1. Resolve player action
  const isJBCrisis = s.scriptedVolley === 2 && currentStep === DrillStep.Endure && !s.jbCrisisResolved;

  if (currentStep === DrillStep.Fire && (action === ActionId.Fire || action === ActionId.SnapShot)) {
    // Use scripted fire with hit/miss + perception
    const fireResult = resolveScriptedFire(s, action);
    s.pendingMoraleChanges.push(...fireResult.moraleChanges);
    s.log.push(...fireResult.log);
    s.player.musketLoaded = false;
    s.player.heldFire = false;
    s.player.duckedLastTurn = false;
    s.volleysFired += 1;

    // Scripted enemy damage: line's volley + player's contribution
    const lineDmg = def.enemyLineDamage;
    s.enemy.strength = Math.max(0, s.enemy.strength - lineDmg - fireResult.enemyDamage);
    s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7);
  } else if (isJBCrisis) {
    // JB crisis at V2 ENDURE: resolve crisis directly (skip generic resolveAction to avoid double valor roll)
    const jbResult = resolveJBCrisis(s, action);
    s.pendingMoraleChanges.push(...jbResult.moraleChanges);
    s.log.push(...jbResult.log);
    if (jbResult.lineMoraleBoost !== 0) {
      s.line.lineIntegrity = Math.max(0, Math.min(100, s.line.lineIntegrity + jbResult.lineMoraleBoost));
    }

    // Track stamina and counters manually (since we skipped resolveAction)
    if (action === ActionId.Duck) { s.player.duckedLastTurn = true; s.player.duckCount += 1; s.player.stamina -= 1; }
    else if (action === ActionId.Pray) { s.player.prayerCount += 1; s.player.stamina -= 2; }
    else if (action === ActionId.DrinkWater) { s.player.canteenUses += 1; s.player.stamina += 5; }
    else { s.player.stamina -= 3; }
    s.player.stamina = Math.max(0, Math.min(s.player.maxStamina, s.player.stamina + 3)); // ENDURE recovery
    s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);
  } else {
    // Use existing resolveAction for PRESENT/ENDURE (and HoldFire, etc.)
    const r = resolveAction(action, s);
    s.pendingMoraleChanges.push(...r.moraleChanges);
    s.log.push(...r.log);
    s.player.musketLoaded = r.musketLoaded;
    s.player.heldFire = r.heldFire;
    s.player.duckedLastTurn = r.ducked;
    s.player.ncoApproval = Math.max(0, Math.min(100, s.player.ncoApproval + r.ncoApprovalChange));

    // Stamina
    s.player.stamina = Math.max(0, Math.min(s.player.maxStamina, s.player.stamina - r.staminaCost));
    s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);

    if (currentStep === DrillStep.Endure) {
      s.player.stamina = Math.min(s.player.maxStamina, s.player.stamina + 3);
      s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);
    }

    // AimCarefully: use the action's own valor roll result (positive morale = success)
    if (action === ActionId.AimCarefully) {
      s.aimCarefullySucceeded = r.moraleChanges.some(c => c.amount > 0);
    }

    // Track counters
    if (action === ActionId.Duck) s.player.duckCount += 1;
    if (action === ActionId.Pray) s.player.prayerCount += 1;
    if (action === ActionId.DrinkWater) s.player.canteenUses += 1;

    // If HoldFire or HoldPosition skipped fire, the line still fires (enemy takes line damage)
    if (action === ActionId.HoldFire || action === ActionId.HoldPosition) {
      s.enemy.strength = Math.max(0, s.enemy.strength - def.enemyLineDamage * 0.7);
      s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - def.enemyLineDamage * 0.5);
    }
  }

  // 2. Scripted events (replaces passive drain — full control over morale arc)
  const scriptedResult = resolveScriptedEvents(s, currentStep, action);
  s.log.push(...scriptedResult.log);
  s.pendingMoraleChanges.push(...scriptedResult.moraleChanges);

  // 5. Apply morale
  const { newMorale, threshold } = applyMoraleChanges(
    s.player.morale, s.player.maxMorale, s.pendingMoraleChanges, s.player.valor
  );
  s.player.morale = newMorale;
  s.player.moraleThreshold = threshold;

  // 6. Neighbour morale (no random routing during scripted — routing is scripted)
  for (const n of [s.line.leftNeighbour, s.line.rightNeighbour]) {
    if (!n?.alive || n.routing) continue;
    let drain = -1;
    if (def.range < 100) drain = -2;
    if (s.enemy.artillery) drain -= 1;
    if (s.player.moraleThreshold === MoraleThreshold.Steady) drain += 2;
    else if (s.player.moraleThreshold === MoraleThreshold.Wavering) drain -= 1;
    else if (s.player.moraleThreshold === MoraleThreshold.Breaking) drain -= 2;

    n.morale = Math.max(0, Math.min(n.maxMorale, n.morale + drain));
    n.threshold = getMoraleThreshold(n.morale, n.maxMorale);
  }

  // 7. Update line morale
  updateLineMorale(s);

  // 8. Scripted return fire (ENDURE step only)
  if (currentStep === DrillStep.Endure) {
    const returnFire = resolveScriptedReturnFire(s, volleyIdx);
    if (returnFire.healthDamage > 0) {
      s.player.health = Math.max(0, s.player.health - returnFire.healthDamage);
      s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
    }
    s.pendingMoraleChanges.push(...returnFire.moraleChanges);
    s.log.push(...returnFire.log);
  }

  // 9. Narrative
  const narrative = getVolleyNarrative(volleyIdx, currentStep, s);
  if (narrative) {
    s.log.push({ turn: s.turn, text: narrative, type: 'narrative' });
  }

  // 10. Morale summary
  const total = s.pendingMoraleChanges.reduce((sum, c) => sum + c.amount, 0);
  if (Math.round(total) !== 0) {
    s.log.push({
      turn: s.turn,
      text: `Morale ${total > 0 ? 'recovered' : 'lost'}: ${total > 0 ? '+' : ''}${Math.round(total)}`,
      type: 'morale',
    });
  }

  // 11. Advance drill step
  const nextStep = getScriptedNextDrillStep(currentStep, action);
  s.drillStep = nextStep;

  // 12. Handle drill step transitions
  if (s.drillStep === DrillStep.Load) {
    if (s.scriptedVolley < 4) {
      // Auto-load between volleys
      const loadResult = rollAutoLoad(s.player.morale, s.player.maxMorale, s.player.valor);
      s.lastLoadResult = loadResult;

      if (loadResult.success) {
        s.player.musketLoaded = true;
        s.player.fumbledLoad = false;
        s.player.turnsWithEmptyMusket = 0;
        s.log.push({ turn: s.turn, text: 'Bite. Pour. Ram. Prime. The drill saves you — loaded.', type: 'action' });
      } else {
        s.player.musketLoaded = false;
        s.player.fumbledLoad = true;
        s.log.push({ turn: s.turn, text: 'Your hands shake. The cartridge tears wrong. Powder spills. The musket is empty.', type: 'result' });
        s.pendingMoraleChanges.push({ amount: -3, reason: 'Fumbled the reload', source: 'action' });
      }

      // Advance to next volley
      s.scriptedVolley += 1;
      s.aimCarefullySucceeded = false;
      s.enemy.range = VOLLEY_RANGES[s.scriptedVolley - 1];
      s.drillStep = DrillStep.Present;
    } else {
      // VOLLEY 4 COMPLETE → Phase 2 (Charge)
      s.phase = BattlePhase.Charge;
      s.chargeEncounter = 1;
      s.scriptedVolley = 0;
      s.drillStep = DrillStep.Endure;
      s.enemy.range = 15;
      s.enemy.morale = 'charging';
      s.log.push({
        turn: s.turn, type: 'event',
        text: '\n--- THE BAYONET ---\n\n"CHARGE! EN AVANT!" The captain\'s sword comes down. The line surges forward. Bayonets levelled. The last twenty-five paces are the longest of your life.',
      });
      // Show first encounter narrative
      const enc1 = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: enc1.narrative, type: 'narrative' });
    }
  }

  // 13. Battle end check (death only during scripted Phase 1)
  if (s.player.health <= 0) {
    s.player.alive = false;
    s.battleOver = true;
    s.outcome = 'defeat';
  }

  // 14. Available actions
  if (!s.battleOver) {
    if (s.scriptedVolley >= 1 && s.scriptedVolley <= 4) {
      s.availableActions = getScriptedAvailableActions(s);
    } else {
      s.availableActions = getAvailableActions(s);
    }
  } else {
    s.availableActions = [];
  }

  return s;
}

// ============================================================
// CHARGE TURN (Phase 2: RPG encounters)
// ============================================================

function advanceChargeTurn(s: BattleState, choiceId: ChargeChoiceId): BattleState {
  const enc = s.chargeEncounter;

  // Auto effects for Encounter 1: Pierre dies
  if (enc === 1) {
    if (s.line.leftNeighbour?.alive) {
      s.line.leftNeighbour.alive = false;
      s.line.lineIntegrity = Math.max(0, s.line.lineIntegrity - 10);
    }
    s.pendingMoraleChanges.push({ amount: -12, reason: 'Pierre is dead', source: 'event' });
  }

  // Resolve the player's choice
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
    s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);
  }

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

  // Death check
  if (s.player.health <= 0) {
    s.player.alive = false;
    s.battleOver = true;
    s.outcome = 'defeat';
    s.log.push({ turn: s.turn, text: 'The wound takes you down. You fall in the mud, in the charge, among the boots and the bayonets. The sky is the last thing you see.', type: 'event' });
    s.availableActions = [];
    return s;
  }

  // Advance to next encounter or melee
  if (result.nextEncounter > 0) {
    s.chargeEncounter = result.nextEncounter;
    // Get next encounter narrative + choices
    const next = getChargeEncounter(s);
    s.log.push({ turn: s.turn, text: next.narrative, type: 'narrative' });
    // Choices will be rendered by app.ts reading chargeEncounter
  } else {
    // Transition to Phase 3: Melee
    s.phase = BattlePhase.Melee;
    s.chargeEncounter = 0;
    s.enemy.range = 0;
    s.enemy.morale = 'charging';
    resetMeleeHistory();
    s.meleeState = createMeleeState(s);
    const firstOpp = s.meleeState.opponents[0];
    s.log.push({
      turn: s.turn, type: 'event',
      text: '\n--- MELEE ---\n\nThe lines collide. Order dissolves. The drill is gone. The volley is gone. There is only the bayonet, the man in front of you, and the will to survive.\n\nThis is where battles are decided. Not by generals. By men like you.',
    });
    s.log.push({
      turn: s.turn, type: 'narrative',
      text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
    });
  }

  s.availableActions = [];
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
): BattleState {
  const ms = s.meleeState!;

  // Set stance if provided
  if (stance) ms.playerStance = stance;

  // Resolve the exchange
  const result = resolveMeleeExchange(s, meleeAction, bodyPart);
  s.log.push(...result.log);
  s.pendingMoraleChanges.push(...result.moraleChanges);

  // Apply health/stamina
  if (result.healthDelta !== 0) {
    s.player.health = Math.max(0, Math.min(s.player.maxHealth, s.player.health + result.healthDelta));
    s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
  }
  if (result.staminaDelta !== 0) {
    s.player.stamina = Math.max(0, Math.min(s.player.maxStamina, s.player.stamina + result.staminaDelta));
    s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);
  }

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

  // Cavalry timer check — survive 12 exchanges, cavalry charge wins the day
  if (!result.battleEnd && ms.exchangeCount >= ms.maxExchanges) {
    s.battleOver = true;
    s.outcome = 'cavalry_victory';
    s.log.push({
      turn: s.turn, type: 'narrative',
      text: getCavalryEndingNarrative(ms.killCount),
    });
    s.availableActions = [];
    return s;
  }

  // Cavalry warning at 3 rounds remaining
  if (!result.battleEnd && ms.exchangeCount === ms.maxExchanges - 3) {
    s.log.push({
      turn: s.turn, type: 'event',
      text: 'Hoofbeats. Somewhere behind you, hoofbeats. The cavalry is coming.',
    });
  }

  // Battle end
  if (result.battleEnd === 'defeat') {
    s.player.alive = false;
    s.battleOver = true;
    s.outcome = 'defeat';
    s.log.push({ turn: s.turn, type: 'event', text: 'The bayonet finds you. You go down in the press of bodies, in the mud and the blood. The field takes you.' });
  } else if (result.battleEnd === 'victory') {
    s.battleOver = true;
    s.outcome = 'victory';
    s.log.push({ turn: s.turn, type: 'narrative', text: '\n--- VICTORY ---\n\nThe last man falls. The enemy line breaks. They run.\n\nYou stand in the wreckage of two armies, bayonet dripping, lungs burning. Around you, the living stare at what they\'ve done.\n\nYou charged. You fought. You won. You are alive.\n\nThe drums start up again. Somewhere, distantly, a cheer.' });
  } else if (result.battleEnd === 'survived') {
    s.battleOver = true;
    s.outcome = 'survived';
    s.log.push({ turn: s.turn, type: 'narrative', text: '\n--- SURVIVED ---\n\nHands grab you from behind. "Fall back, lad. You\'ve done enough." The sergeant pulls you out of the press.\n\nYou\'ve killed. You\'ve bled. You cannot lift your arms. But you are alive, and the charge goes on without you.\n\nThat is enough. It has to be.' });
  } else if (result.opponentDefeated && !s.battleOver) {
    // Advance to next opponent
    const nextLog = advanceToNextOpponent(s);
    s.log.push(...nextLog);
    // Brief respite between opponents — recover some health and stamina
    const hpRecover = Math.min(15, 100 - s.player.health);
    const spRecover = Math.min(20, 100 - s.player.stamina);
    if (hpRecover > 0 || spRecover > 0) {
      s.player.health += hpRecover;
      s.player.stamina += spRecover;
    }
  }

  // Reset melee UI state for next exchange
  if (!s.battleOver && s.meleeState) {
    s.meleeState.selectingStance = true;
    s.meleeState.selectingTarget = false;
    s.meleeState.selectedAction = undefined;
  }

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
    text: 'You can\'t. You can\'t do this anymore. The bayonet drops. Your legs carry you backwards, then sideways, then away. Running. The shame will come later. Right now there is only the animal need to survive.',
  });
  s.availableActions = [];
  return s;
}

function getCavalryEndingNarrative(kills: number): string {
  const intro = '\n--- CAVALRY ---\n\n';
  if (kills >= 3) {
    return intro + 'The thunder comes from behind. Cuirassiers. Steel breastplates catching the sun, sabres drawn, a wall of horses and fury.\n\nThe enemy sees them too late. The charge hits their flank like a hammer on glass. The line shatters.\n\nYou stand among the dead, bayonet dripping, three men at your feet. The cavalry finishes what you started.\n\nThey will remember your name.';
  }
  if (kills >= 2) {
    return intro + 'You hear them before you see them. Hooves on packed earth, hundreds of them, a sound like rolling thunder.\n\nThe cuirassiers smash into the enemy flank. Sabres flash. The enemy line buckles, breaks, and runs.\n\nTwo men fell to your bayonet. You held. The cavalry did the rest.\n\nYou are alive. That is victory enough.';
  }
  if (kills >= 1) {
    return intro + 'A trumpet sounds. The ground shakes. Through the smoke, the cuirassiers come — a wall of horses and steel.\n\nThe enemy wavers. Then breaks. They run, and the cavalry hunts them across the field.\n\nYou killed one man today. You survived the rest. When the shaking stops, you will feel something. Not yet.\n\nNot yet.';
  }
  return intro + 'The trumpet. Thank God, the trumpet.\n\nThe cuirassiers slam into the enemy flank. You didn\'t see them coming — you were too busy trying not to die. The enemy scatters.\n\nYou survived. Somehow. Not a single kill on your bayonet, but you held your ground, and that was enough to keep the line from breaking until the cavalry arrived.\n\nYour hands won\'t stop shaking.';
}

function getScriptedNextDrillStep(current: DrillStep, action: ActionId): DrillStep {
  // HoldPosition skips FIRE → go to ENDURE
  if (action === ActionId.HoldPosition) return DrillStep.Endure;
  // HoldFire skips firing → go to ENDURE
  if (action === ActionId.HoldFire) return DrillStep.Endure;
  // GoThroughMotions → proceed to FIRE (auto-resolved)
  if (action === ActionId.GoThroughMotions) return DrillStep.Fire;

  switch (current) {
    case DrillStep.Present: return DrillStep.Fire;
    case DrillStep.Fire: return DrillStep.Endure;
    case DrillStep.Endure: return DrillStep.Load;
    default: return DrillStep.Present;
  }
}

// ============================================================
// MAIN TURN (dispatches to scripted or random path)
// ============================================================

export interface MeleeTurnInput {
  action: MeleeActionId;
  bodyPart?: BodyPart;
  stance?: MeleeStance;
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

  // SCRIPTED PHASE 1 PATH
  if (s.phase === BattlePhase.Line && s.scriptedVolley >= 1 && s.scriptedVolley <= 4) {
    return advanceScriptedTurn(s, action as ActionId);
  }

  // PHASE 2: CHARGE PATH
  if (s.phase === BattlePhase.Charge) {
    return advanceChargeTurn(s, action as ChargeChoiceId);
  }

  // PHASE 3: MELEE PATH
  if (s.phase === BattlePhase.Melee && meleeInput) {
    return advanceMeleeTurn(s, meleeInput.action, meleeInput.bodyPart, meleeInput.stance);
  }

  // RANDOM PATH (Phase 2+)
  // 1. Resolve player action
  const r = resolveAction(action as ActionId, s);
  s.pendingMoraleChanges.push(...r.moraleChanges);
  s.log.push(...r.log);
  s.player.musketLoaded = r.musketLoaded;
  s.player.heldFire = r.heldFire;
  s.player.duckedLastTurn = r.ducked;
  s.player.ncoApproval = Math.max(0, Math.min(100, s.player.ncoApproval + r.ncoApprovalChange));

  if (action === ActionId.Duck) s.player.duckCount += 1;
  if (action === ActionId.Pray) s.player.prayerCount += 1;
  if (action === ActionId.DrinkWater) s.player.canteenUses += 1;
  if (action === ActionId.Fire || action === ActionId.SnapShot) s.volleysFired += 1;

  if (!s.player.musketLoaded) s.player.turnsWithEmptyMusket += 1;
  else s.player.turnsWithEmptyMusket = 0;

  // 2. Stamina
  s.player.stamina = Math.max(0, Math.min(s.player.maxStamina, s.player.stamina - r.staminaCost));
  s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);
  if (s.drillStep === DrillStep.Endure) {
    s.player.stamina = Math.min(s.player.maxStamina, s.player.stamina + 3);
    s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);
  }

  // 3. Events
  const events = generateTurnEvents(s);
  for (const ev of events) {
    if (!ev.triggered) continue;
    s.log.push({ turn: s.turn, text: ev.description, type: 'event' });
    s.pendingMoraleChanges.push({ amount: ev.moraleEffect, reason: ev.description.slice(0, 50) + '...', source: 'event' });
  }

  // 4. Event consequences
  for (const ev of events) {
    if (ev.type === 'neighbour_killed' && ev.targetNeighbour) {
      if (s.line[ev.targetNeighbour]?.alive) {
        s.line[ev.targetNeighbour]!.alive = false;
        s.line.casualtiesThisTurn += 1;
        s.line.lineIntegrity = Math.max(0, s.line.lineIntegrity - 8);
      }
    }
    if (ev.type === 'friend_wounded' && ev.targetNeighbour) {
      if (s.line[ev.targetNeighbour]?.alive) {
        s.line[ev.targetNeighbour]!.wounded = true;
        s.line.casualtiesThisTurn += 1;
      }
    }
    if (ev.type === 'officer_down') {
      s.line.officer.alive = false;
      s.line.officer.wounded = true;
      s.line.officer.status = 'Down';
    }
  }

  // 5. Passive drain + recovery
  s.pendingMoraleChanges.push(...calculatePassiveDrain(s.enemy, s.line, s.player));
  s.pendingMoraleChanges.push(...calculateRecovery(s.line, s.player));

  // 6. Apply morale
  const { newMorale, threshold } = applyMoraleChanges(
    s.player.morale, s.player.maxMorale, s.pendingMoraleChanges, s.player.valor
  );
  s.player.morale = newMorale;
  s.player.moraleThreshold = threshold;

  // 7. Neighbour morale
  updateNeighbours(s, r.neighbourMoraleBoost);

  // 8. Update line morale
  updateLineMorale(s);

  // 9. Enemy advances
  advanceEnemy(s, r.enemyDamage);

  // 10. Advance drill step
  s.drillStep = r.nextDrillStep;
  if (r.musketLoaded && r.nextDrillStep === DrillStep.Load) {
    s.drillStep = DrillStep.Present;
  }

  // 11. Auto-load
  if (s.drillStep === DrillStep.Load && !s.player.musketLoaded) {
    const loadResult = rollAutoLoad(s.player.morale, s.player.maxMorale, s.player.valor);
    s.lastLoadResult = loadResult;
    if (loadResult.success) {
      s.player.musketLoaded = true;
      s.player.fumbledLoad = false;
      s.player.turnsWithEmptyMusket = 0;
      s.log.push({ turn: s.turn, text: 'Bite. Pour. Ram. Prime. The drill saves you — loaded.', type: 'action' });
      s.pendingMoraleChanges.push({ amount: 1, reason: 'The drill steadies you', source: 'action' });
    } else {
      s.player.musketLoaded = false;
      s.player.fumbledLoad = true;
      s.log.push({ turn: s.turn, text: 'Your hands shake. The cartridge tears wrong. Powder spills. The musket is empty. You raise it anyway.', type: 'result' });
      s.pendingMoraleChanges.push({ amount: -3, reason: 'Fumbled the reload', source: 'action' });
    }
    s.drillStep = DrillStep.Present;
  } else if (s.drillStep === DrillStep.Load && s.player.musketLoaded) {
    s.drillStep = DrillStep.Present;
    s.player.fumbledLoad = false;
  }

  // 12. Narrative
  s.log.push({ turn: s.turn, text: generateTurnNarrative(s), type: 'narrative' });

  // 13. Morale summary
  const total = s.pendingMoraleChanges.reduce((sum, c) => sum + c.amount, 0);
  if (Math.round(total) !== 0) {
    s.log.push({
      turn: s.turn,
      text: `Morale ${total > 0 ? 'recovered' : 'lost'}: ${total > 0 ? '+' : ''}${Math.round(total)}`,
      type: 'morale',
    });
  }

  // 14. Phase transitions + battle end
  checkPhaseTransition(s);
  checkBattleEnd(s);

  // 15. Available actions
  s.availableActions = getAvailableActions(s);

  return s;
}

// Resolves the auto-fire when the player fumbled their load.
export function resolveAutoFumbleFire(state: BattleState): BattleState {
  const s = structuredClone(state);

  s.log.push({
    turn: s.turn,
    text: 'The volley crashes out along the line. Your musket clicks. Empty. Your heart hammers.',
    type: 'result',
  });

  const { success: unnoticed } = rollValor(s.player.valor, 20);
  const ncoAttentive = s.line.ncoPresent && s.player.ncoApproval < 40;
  const noticed = !unnoticed || (ncoAttentive && Math.random() < 0.4);

  if (noticed) {
    s.log.push({
      turn: s.turn,
      text: '"YOU! Your musket is EMPTY!" Sergeant Duval\'s eyes bore into you. "Load your weapon or I\'ll load YOU into the next volley!"',
      type: 'event',
    });
    s.pendingMoraleChanges.push({ amount: -5, reason: 'Caught with an empty musket', source: 'action' });
    s.player.ncoApproval = Math.max(0, s.player.ncoApproval - 8);
  } else {
    s.log.push({
      turn: s.turn,
      text: 'The smoke covers you. No one noticed. A small mercy. The relief is physical.',
      type: 'action',
    });
    s.pendingMoraleChanges.push({ amount: 2, reason: 'Unnoticed — relief', source: 'recovery' });
  }

  s.player.fumbledLoad = false;
  s.drillStep = DrillStep.Endure;

  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 4) {
    s.availableActions = getScriptedAvailableActions(s);
  } else {
    s.availableActions = getAvailableActions(s);
  }

  return s;
}

function updateNeighbours(s: BattleState, boost: number) {
  for (const n of [s.line.leftNeighbour, s.line.rightNeighbour]) {
    if (!n?.alive || n.routing) continue;
    let drain = -2;
    if (s.enemy.range < 100) drain = -4;
    if (s.enemy.artillery) drain -= 3;
    if (boost > 0) drain += boost;
    if (s.player.moraleThreshold === MoraleThreshold.Steady) drain += 2;
    else if (s.player.moraleThreshold === MoraleThreshold.Wavering) drain -= 2;
    else if (s.player.moraleThreshold === MoraleThreshold.Breaking) drain -= 4;

    n.morale = Math.max(0, Math.min(n.maxMorale, n.morale + drain));
    n.threshold = getMoraleThreshold(n.morale, n.maxMorale);

    if (n.threshold === MoraleThreshold.Breaking && Math.random() < 0.3) {
      n.routing = true;
      s.log.push({ turn: s.turn, text: `${n.name} breaks! He throws down his musket and runs.`, type: 'event' });
      s.line.lineIntegrity = Math.max(0, s.line.lineIntegrity - 15);
      s.pendingMoraleChanges.push({ amount: -6, reason: `${n.name} routed`, source: 'contagion' });
    }
  }
}

function updateLineMorale(s: BattleState) {
  const vals: number[] = [s.player.morale / s.player.maxMorale];
  for (const n of [s.line.leftNeighbour, s.line.rightNeighbour]) {
    if (n?.alive && !n.routing) vals.push(n.morale / n.maxMorale);
  }
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const intFactor = s.line.lineIntegrity / 100;
  const combined = avg * 0.6 + intFactor * 0.4;

  if (combined >= 0.75) s.line.lineMorale = 'resolute';
  else if (combined >= 0.55) s.line.lineMorale = 'holding';
  else if (combined >= 0.35) s.line.lineMorale = 'shaken';
  else if (combined >= 0.15) s.line.lineMorale = 'wavering';
  else s.line.lineMorale = 'breaking';
}

function advanceEnemy(s: BattleState, dmg: number) {
  const rate = s.enemy.morale === 'charging' ? 40 : 15;
  s.enemy.range = Math.max(0, s.enemy.range - rate);

  const lineDmg = s.line.lineIntegrity > 50 ? 1.5 + Math.random() * 3 : 0.5 + Math.random() * 1.5;
  s.enemy.strength = Math.max(0, s.enemy.strength - lineDmg - dmg * 2);
  s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - (lineDmg + dmg * 2) * 0.8);

  if (s.enemy.strength < 40) s.enemy.morale = 'wavering';
  if (s.enemy.range < 60 && s.enemy.strength > 50) s.enemy.morale = 'charging';
  if (s.turn > 8 && Math.random() < 0.15) s.enemy.cavalryThreat = true;
  if (s.enemy.range < 100) s.enemy.artillery = false;

  if (s.line.officer.alive && !s.line.officer.wounded) {
    if (s.enemy.range < 150) {
      s.line.officer.mounted = false;
      s.line.officer.status = 'On foot, rallying';
    }
  }
}

function generateTurnNarrative(state: BattleState): string {
  const { enemy, line, player } = state;

  if (state.phase === BattlePhase.Crisis) {
    return generateCrisisNarrative(state);
  }

  const stepNarratives: Record<string, string[]> = {
    [DrillStep.Present]: [
      '"PRESENT!" The order comes. Muskets rise along the line like a wave.',
      'Musket to shoulder. Through the smoke, the enemy line waits.',
      '"Make ready!" You bring the musket up. The wood is warm against your cheek.',
    ],
    [DrillStep.Fire]: [
      'The moment stretches. Every musket levelled. Waiting for the word.',
      'Fingers on triggers. The line holds its breath.',
      'The sergeant\'s voice: "On my command..."',
    ],
    [DrillStep.Endure]: enemy.range > 150 ? [
      'Between volleys. The smoke drifts. You wait for what comes next.',
      'A pause. Not peace — never peace. Just the space between one horror and the next.',
    ] : [
      'The gap between volleys feels like an eternity at this range.',
      'You stand in the open and you take it. There is no choice.',
    ],
    [DrillStep.Load]: [
      '"LOAD!" The order echoes. Hands reach for cartridge boxes.',
    ],
  };

  const pool = stepNarratives[state.drillStep] || stepNarratives[DrillStep.Endure];
  let text = pool[Math.floor(Math.random() * pool.length)];

  if (line.casualtiesThisTurn > 0) {
    text += `\n\n${line.casualtiesThisTurn === 1 ? 'A man' : 'Men'} went down. The rear rank closes up. Don't look down.`;
  }

  if (player.moraleThreshold === MoraleThreshold.Shaken) {
    text += '\n\nYour hands are not entirely steady.';
  } else if (player.moraleThreshold === MoraleThreshold.Wavering) {
    text += '\n\nEvery instinct screams at you to run.';
  } else if (player.moraleThreshold === MoraleThreshold.Breaking) {
    text += '\n\nThe world has narrowed to a tunnel. You can\'t stop shaking.';
  }

  return text;
}

function generateCrisisNarrative(state: BattleState): string {
  if (state.crisisTurn === 1) {
    if (state.enemy.morale === 'charging') {
      return 'They\'re coming. The pas de charge. A hundred voices screaming. Bayonets catch the light.\n\nThis is the moment. Everything you\'ve endured was leading here.';
    }
    return 'The pattern shatters. The battle accelerates toward its conclusion.\n\nWhat happens now depends on what you have left.';
  }
  if (state.crisisTurn === 2) {
    return 'Bayonets levelled. The line surges. Steel meets steel.\n\nYour body knows what\'s coming.';
  }
  return 'The crisis reaches its peak.';
}

function checkPhaseTransition(s: BattleState) {
  // Skip during scripted Phase 1 (transition handled in advanceScriptedTurn)
  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 4) return;

  if (s.phase === BattlePhase.Line) {
    const trigger = s.enemy.range <= 40 || s.enemy.morale === 'charging' ||
                    s.line.lineIntegrity < 40 || s.player.moraleThreshold === MoraleThreshold.Breaking;
    if (trigger) {
      s.phase = BattlePhase.Crisis;
      s.crisisTurn = 1;
      s.drillStep = DrillStep.Endure;
      let text: string;
      if (s.enemy.morale === 'charging') text = 'THEY\'RE CHARGING! Bayonets levelled. The pas de charge. This is it.';
      else if (s.line.lineIntegrity < 40) text = 'The line is dissolving. Too many gaps. Too many dead.';
      else if (s.enemy.range <= 40) text = '"FIX BAYONETS!" This isn\'t a firefight anymore.';
      else text = 'You can\'t stay here. Everything screams to run.';
      s.log.push({ turn: s.turn, text: `\n--- THE LINE BREAKS ---\n\n${text}`, type: 'event' });
      return;
    }
  }

  if (s.phase === BattlePhase.Crisis) {
    s.crisisTurn += 1;
    s.drillStep = DrillStep.Endure;
    if (s.crisisTurn >= 3) {
      s.phase = BattlePhase.Individual;
      let text: string;
      const mt = s.player.moraleThreshold;
      if (mt === MoraleThreshold.Steady) {
        text = 'You charge. The bayonet is an extension of your arm. The enemy buckles. They did not expect men this steady.';
        s.outcome = 'victory';
      } else if (mt === MoraleThreshold.Shaken) {
        text = 'You stumble forward with the rest. Just momentum and terror and the point of your bayonet.';
        s.outcome = 'survived';
      } else if (mt === MoraleThreshold.Wavering) {
        text = 'Your legs freeze. The line surges past you. The battle flows around you like water around a stone.';
        s.outcome = 'survived';
      } else {
        text = 'You run. The musket drops from your hands. Your legs carry you away from the killing.';
        s.outcome = 'rout';
      }
      s.log.push({ turn: s.turn, text, type: 'narrative' });
      s.battleOver = true;
    }
  }
}

function checkBattleEnd(s: BattleState) {
  if (s.battleOver) return;

  // Player death — always active
  if (s.player.health <= 0) {
    s.player.alive = false;
    s.battleOver = true;
    s.outcome = 'defeat';
    s.log.push({ turn: s.turn, text: 'Something punches you in the chest. Hard. You look down. Oh. Oh no.', type: 'event' });
    return;
  }

  // Skip random checks during scripted Phase 1
  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 4) return;

  if (s.enemy.strength < 20 && s.enemy.morale === 'wavering' && s.phase === BattlePhase.Line) {
    s.battleOver = true;
    s.outcome = 'victory';
    s.log.push({ turn: s.turn, text: 'They break! The enemy turns and runs. A ragged cheer from what\'s left of your line. You are alive.', type: 'narrative' });
    return;
  }

  // Hit chance
  const baseHit = Math.max(0.01, (1 - s.enemy.range / 400) * 0.06);
  const hitChance = s.player.duckedLastTurn ? baseHit * 0.3 : baseHit;
  if (Math.random() < hitChance) {
    const damage = 15 + Math.floor(Math.random() * 20);
    if (Math.random() < 0.12) {
      s.player.health = 0;
      s.player.alive = false;
      s.battleOver = true;
      s.outcome = 'defeat';
      s.log.push({ turn: s.turn, text: 'A ball strikes you square. The world goes sideways. The last thing you see is the sky.', type: 'event' });
    } else {
      s.player.health = Math.max(0, s.player.health - damage);
      s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
      s.pendingMoraleChanges.push({ amount: -8, reason: 'You\'ve been hit', source: 'event' });
      const wounds = ['arm', 'shoulder', 'thigh', 'side', 'hand'];
      s.log.push({
        turn: s.turn,
        text: `A ball grazes your ${wounds[Math.floor(Math.random() * wounds.length)]}. White-hot pain. You're still standing. Keep loading.`,
        type: 'event',
      });
    }
  }
}
