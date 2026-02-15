import {
  BattleState, BattlePhase, DrillStep, Player, Soldier, Officer,
  LineState, EnemyState, MoraleThreshold, getMoraleThreshold,
  HealthState, getHealthState, StaminaState, getStaminaState,
  ActionId, LogEntry, MoraleChange,
  ChargeChoiceId, MeleeActionId, BodyPart, MeleeStance,
} from '../types';
import { calculatePassiveDrain, calculateRecovery, applyMoraleChanges, rollAutoLoad, rollValor, rollGraduatedValor, updateLineMorale } from './morale';
import { getAvailableActions, resolveAction } from './actions';
import { generateTurnEvents } from './events';
import {
  VOLLEY_DEFS, VOLLEY_RANGES,
  resolveScriptedFire, resolveGorgeFire, resolveScriptedEvents, resolveJBCrisis,
  resolveScriptedReturnFire, getScriptedAvailableActions, getVolleyNarrative,
  rollLineIntegrity,
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
    name: 'Soldier',
    valor: 40,
    morale: 100, maxMorale: 100, moraleThreshold: MoraleThreshold.Steady,
    health: 100, maxHealth: 100, healthState: HealthState.Unhurt,
    stamina: 100, maxStamina: 100, staminaState: StaminaState.Fresh,
    musketLoaded: true, alive: true, routing: false,
    experience: 20, heldFire: false, fumbledLoad: false,
    ncoApproval: 50, duckedLastTurn: false,
    duckCount: 0, prayerCount: 0, canteenUses: 0, turnsWithEmptyMusket: 0,
    reputation: 0,
    dexterity: 45, strength: 40, endurance: 40, constitution: 45,
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
    filesDeep: 3,
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
    weather: 'clear', timeOfDay: 'Dawn',
    battleOver: false, outcome: 'pending',
    crisisTurn: 0, volleysFired: 0,
    // Scripted Phase 1
    scriptedVolley: 1,
    aimCarefullySucceeded: false,
    jbCrisisResolved: false,
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
// SCRIPTED TURN (legacy — all scripted volleys now use auto-play)
// Retained for reference; unreachable due to advanceTurn guard.
// ============================================================

function advanceScriptedTurn(s: BattleState, action: ActionId): BattleState {
  const volleyIdx = s.scriptedVolley - 1;
  const def = VOLLEY_DEFS[volleyIdx];
  const currentStep = s.drillStep;

  // Lock enemy range to script
  s.enemy.range = def.range;

  // 0. Push volley narrative BEFORE action resolution (so captain's order precedes fire)
  if (currentStep === DrillStep.Fire) {
    const preNarrative = getVolleyNarrative(volleyIdx, currentStep, s);
    if (preNarrative) {
      s.log.push({ turn: s.turn, text: preNarrative, type: 'narrative' });
    }
  }

  // 1. Resolve player action
  const isJBCrisis = s.scriptedVolley === 2 && currentStep === DrillStep.Endure && !s.jbCrisisResolved;
  const isGorge = s.battlePart === 3;
  const isGorgePresent = isGorge && currentStep === DrillStep.Present;
  const isGorgeFire = isGorge && currentStep === DrillStep.Fire;

  if (isGorgePresent) {
    // Gorge PRESENT: store target, apply stamina, push narrative
    s.player.stamina = Math.max(0, s.player.stamina - 2);
    s.player.staminaState = getStaminaState(s.player.stamina, s.player.maxStamina);

    if (action === ActionId.TargetColumn) {
      s.gorgeTarget = 'column';
      s.log.push({ turn: s.turn, type: 'action',
        text: 'You aim into the packed ranks. At this range, into that mass, you can hardly miss. You pick a point in the white-coated column and hold steady.',
      });
    } else if (action === ActionId.TargetOfficers) {
      s.gorgeTarget = 'officers';
      s.log.push({ turn: s.turn, type: 'action',
        text: 'You scan the gorge for the gorget, the sash, the man waving a sword. There \u2014 an officer trying to rally his men. You settle the front sight on him and hold your breath.',
      });
    } else if (action === ActionId.TargetWagon) {
      s.gorgeTarget = 'wagon';
      s.log.push({ turn: s.turn, type: 'action',
        text: 'The ammunition wagon. Tilted on the gorge road, horses dead in the traces. You can see the powder kegs through the shattered sideboards. One good hit and...',
      });
    } else if (action === ActionId.ShowMercy) {
      s.gorgeTarget = undefined;
      s.gorgeMercyCount += 1;
      s.pendingMoraleChanges.push({ amount: 3, reason: 'Compassion \u2014 you lowered your musket', source: 'action' });
      s.pendingMoraleChanges.push({ amount: -2, reason: 'Disobeying the order to fire', source: 'action' });
      s.log.push({ turn: s.turn, type: 'action',
        text: 'You lower your musket. The men around you fire \u2014 the line pours its volley into the gorge \u2014 but your finger stays off the trigger.\n\nThese men are beaten. They are dying in a trap. You will not add to it.\n\nNo one notices. Or if they notice, no one says anything. Not here. Not now.',
      });
      // Line still fires even when player shows mercy
      s.enemy.strength = Math.max(0, s.enemy.strength - def.enemyLineDamage * 0.7);
      s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - def.enemyLineDamage * 0.5);
    }
  } else if (isGorgeFire) {
    // Gorge FIRE: resolve using gorge-specific fire system
    const fireResult = resolveGorgeFire(s);
    s.pendingMoraleChanges.push(...fireResult.moraleChanges);
    s.log.push(...fireResult.log);
    s.player.musketLoaded = false;
    s.player.heldFire = false;
    s.player.duckedLastTurn = false;
    s.volleysFired += 1;

    // Line damage always applies
    const lineDmg = def.enemyLineDamage;
    s.enemy.strength = Math.max(0, s.enemy.strength - lineDmg - fireResult.enemyDamage);
    s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - (lineDmg + fireResult.enemyDamage) * 0.7);
  } else if (currentStep === DrillStep.Fire && (action === ActionId.Fire || action === ActionId.SnapShot)) {
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

    // If HoldFire skipped fire, the line still fires (enemy takes line damage)
    if (action === ActionId.HoldFire) {
      s.enemy.strength = Math.max(0, s.enemy.strength - def.enemyLineDamage * 0.7);
      s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - def.enemyLineDamage * 0.5);
    }
  }

  // 2. Scripted events (replaces passive drain — full control over morale arc)
  const scriptedResult = resolveScriptedEvents(s, currentStep, action);
  s.log.push(...scriptedResult.log);
  s.pendingMoraleChanges.push(...scriptedResult.moraleChanges);

  // 3. Scripted return fire + valor roll + line integrity (ENDURE step only)
  // Order matches Part 1 auto-play: return fire → valor → wound check → line integrity
  if (currentStep === DrillStep.Endure) {
    const returnFire = resolveScriptedReturnFire(s, volleyIdx);
    if (returnFire.healthDamage > 0) {
      s.player.health = Math.max(0, s.player.health - returnFire.healthDamage);
      s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
    }
    s.pendingMoraleChanges.push(...returnFire.moraleChanges);
    s.log.push(...returnFire.log);

    // Graduated valor roll (matches Part 1 auto-play)
    const difficultyMod = (s.line.lineIntegrity - 100) * 0.3;
    const valorRoll = rollGraduatedValor(s.player.valor, difficultyMod);
    s.pendingMoraleChanges.push({ amount: valorRoll.moraleChange, reason: 'Valor check', source: 'action' });
    s.log.push({ turn: s.turn, text: valorRoll.narrative, type: 'event' });
    s.lastValorRoll = valorRoll;

    // Critical fail: 20% chance of minor wound (matches Part 1)
    if (valorRoll.outcome === 'critical_fail' && Math.random() < 0.2) {
      const woundDmg = 5 + Math.floor(Math.random() * 5);
      s.player.health = Math.max(0, s.player.health - woundDmg);
      s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
      s.log.push({ turn: s.turn, text: 'Stumbled. Minor wound.', type: 'event' });
    }

    // Line integrity roll (matches Part 1)
    const lineResult = rollLineIntegrity(s, volleyIdx);
    s.line.lineIntegrity = Math.max(0, Math.min(100, s.line.lineIntegrity + lineResult.integrityChange));
    if (lineResult.enemyExtraDamage > 0) {
      s.enemy.strength = Math.max(0, s.enemy.strength - lineResult.enemyExtraDamage);
      s.enemy.lineIntegrity = Math.max(0, s.enemy.lineIntegrity - lineResult.enemyExtraDamage * 0.7);
    }
    s.log.push({ turn: s.turn, text: lineResult.narrative, type: 'event' });
  }

  // 4. Apply morale (AFTER all changes: action + events + return fire + valor + line integrity)
  const { newMorale, threshold } = applyMoraleChanges(
    s.player.morale, s.player.maxMorale, s.pendingMoraleChanges, s.player.valor
  );
  s.player.morale = newMorale;
  s.player.moraleThreshold = threshold;

  // 5. Neighbour morale (no random routing during scripted — routing is scripted)
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

  // 6. Update line morale
  updateLineMorale(s);

  // 9. Narrative (skip FIRE step — already pushed before resolution)
  if (currentStep !== DrillStep.Fire) {
    const narrative = getVolleyNarrative(volleyIdx, currentStep, s);
    if (narrative) {
      s.log.push({ turn: s.turn, text: narrative, type: 'narrative' });
    }
  }

  // 9b. Gorge: inject ENDURE events + narrative during FIRE/ShowMercy (ENDURE step is skipped)
  if (s.battlePart === 3 && (currentStep === DrillStep.Fire ||
      (currentStep === DrillStep.Present && action === ActionId.ShowMercy))) {
    const endureResult = resolveScriptedEvents(s, DrillStep.Endure, action);
    s.log.push(...endureResult.log);
    s.pendingMoraleChanges.push(...endureResult.moraleChanges);
    const endureNarrative = getVolleyNarrative(volleyIdx, DrillStep.Endure, s);
    if (endureNarrative) {
      s.log.push({ turn: s.turn, text: endureNarrative, type: 'narrative' });
    }
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

  // Gorge: skip ENDURE step entirely (FIRE → LOAD, ShowMercy → LOAD)
  if (s.battlePart === 3 && s.drillStep === DrillStep.Endure) {
    s.drillStep = DrillStep.Load;
  }

  // 12. Handle drill step transitions
  if (s.drillStep === DrillStep.Load) {
    const maxVolley = s.battlePart === 3 ? 11 : s.battlePart === 2 ? 7 : 4;
    if (s.scriptedVolley < maxVolley) {
      // Auto-load between volleys
      const loadResult = rollAutoLoad(s.player.morale, s.player.maxMorale, s.player.valor, s.player.dexterity);
      s.lastLoadResult = loadResult;

      if (loadResult.success) {
        s.player.musketLoaded = true;
        s.player.fumbledLoad = false;
        s.player.turnsWithEmptyMusket = 0;
        s.log.push({ turn: s.turn, text: 'Loaded.', type: 'action' });
      } else {
        s.player.musketLoaded = false;
        s.player.fumbledLoad = true;
        s.log.push({ turn: s.turn, text: 'Fumbled reload.', type: 'result' });
        s.pendingMoraleChanges.push({ amount: -3, reason: 'Fumbled the reload', source: 'action' });
      }

      // Advance to next volley
      s.scriptedVolley += 1;
      s.aimCarefullySucceeded = false;
      s.enemy.range = VOLLEY_RANGES[s.scriptedVolley - 1];
      s.drillStep = DrillStep.Present;
    } else if (s.battlePart === 1) {
      // VOLLEY 4 COMPLETE → Melee (broken ground fighting)
      s.phase = BattlePhase.Melee;
      s.meleeStage = 1;
      s.scriptedVolley = 0;
      s.drillStep = DrillStep.Endure;
      s.enemy.range = 0;
      s.enemy.morale = 'charging';
      if (s.player.heldFire) s.player.musketLoaded = true;
      resetMeleeHistory();
      s.meleeState = createMeleeState(s, 'terrain');
      const firstOpp = s.meleeState.opponents[0];
      s.log.push({
        turn: s.turn, type: 'event',
        text: '\n--- MELEE ---\n\nThe left flank crumbles. White coats pour through the gap to your left. The ordered line dissolves. This is no longer volley fire \u2014 this is knives and teeth and the will to survive in the vineyards of Rivoli.',
      });
      s.log.push({
        turn: s.turn, type: 'narrative',
        text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
      });
    } else if (s.battlePart === 2) {
      // VOLLEY 7 COMPLETE → Gorge story beat
      s.phase = BattlePhase.StoryBeat;
      s.chargeEncounter = 3;
      s.scriptedVolley = 0;
      const storyBeat = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
    } else {
      // VOLLEY 11 COMPLETE → Aftermath story beat
      s.phase = BattlePhase.StoryBeat;
      s.chargeEncounter = 4;
      s.scriptedVolley = 0;
      const storyBeat = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
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
    if (s.scriptedVolley >= 1 && s.scriptedVolley <= 11) {
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

  // Context-aware melee ending — exchanges complete
  if (!result.battleEnd && ms.exchangeCount >= ms.maxExchanges) {
    if (ms.meleeContext === 'terrain') {
      // First melee complete → story beat (battery choice)
      s.phase = BattlePhase.StoryBeat;
      s.chargeEncounter = 1;
      s.log.push({
        turn: s.turn, type: 'narrative',
        text: 'The fighting ebbs. Not a victory \u2014 not a defeat. The Austrians pull back through the broken ground, regrouping. You lean on your musket, gasping. Around you, the survivors of the 14th do the same.\n\nBut the battle is not over. Not even close.',
      });
      // Show the story beat narrative
      const storyBeat = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
      s.availableActions = [];
      return s;
    } else if (ms.meleeContext === 'battery') {
      // Battery melee complete → transition to Masséna story beat
      s.log.push({
        turn: s.turn, type: 'narrative',
        text: '\n--- THE BATTERY IS YOURS ---\n\nThe last defender falls. The guns are yours again \u2014 French guns, retaken by French soldiers. Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing.\n\nCaptain Leclerc\'s voice carries across the redoubt: "Turn them! Turn the guns!"\n\nMen scramble to the pieces. Rammers are found. Powder charges. Within minutes, the captured battery roars again \u2014 this time firing in the right direction. Austrian canister tears into the white-coated columns still pressing the plateau.\n\nThe 14th took back its guns. The cost is written in the bodies around the redoubt. But the guns are yours.',
      });
      s.phase = BattlePhase.StoryBeat;
      s.chargeEncounter = 2;
      const storyBeat = getChargeEncounter(s);
      s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
      s.availableActions = [];
      return s;
    }
  }

  // Warning at 3 rounds remaining
  if (!result.battleEnd && ms.exchangeCount === ms.maxExchanges - 3) {
    if (ms.meleeContext === 'terrain') {
      s.log.push({
        turn: s.turn, type: 'event',
        text: 'The fighting is thinning. The Austrians are faltering in the broken ground. A few more exchanges...',
      });
    } else {
      s.log.push({
        turn: s.turn, type: 'event',
        text: 'The redoubt is nearly clear. The last defenders cling to the guns. Almost there.',
      });
    }
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
    s.meleeState.selectingStance = false;
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
    text: 'You can\'t. You can\'t do this anymore. The bayonet drops. Your legs carry you backwards, then sideways, then away — stumbling down the rocky slope. Running. The shame will come later. Right now there is only the animal need to survive.',
  });
  s.availableActions = [];
  return s;
}

function getScriptedNextDrillStep(current: DrillStep, action: ActionId): DrillStep {
  // HoldFire skips firing → go to ENDURE
  if (action === ActionId.HoldFire) return DrillStep.Endure;
  // ShowMercy skips firing → go to ENDURE (same as HoldFire, but thematic)
  if (action === ActionId.ShowMercy) return DrillStep.Endure;
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
  s.lastValorRoll = undefined;

  // GUARD: All scripted volleys use auto-play — turn-by-turn path is blocked
  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 11 && s.phase === BattlePhase.Line) {
    console.warn('advanceTurn called for scripted volley — blocked (use auto-play)');
    return state; // return original, not clone
  }

  // PHASE 2: STORY BEAT PATH
  if (s.phase === BattlePhase.StoryBeat) {
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
    const loadResult = rollAutoLoad(s.player.morale, s.player.maxMorale, s.player.valor, s.player.dexterity);
    s.lastLoadResult = loadResult;
    if (loadResult.success) {
      s.player.musketLoaded = true;
      s.player.fumbledLoad = false;
      s.player.turnsWithEmptyMusket = 0;
      s.log.push({ turn: s.turn, text: 'Loaded.', type: 'action' });
      s.pendingMoraleChanges.push({ amount: 1, reason: 'The drill steadies you', source: 'action' });
    } else {
      s.player.musketLoaded = false;
      s.player.fumbledLoad = true;
      s.log.push({ turn: s.turn, text: 'Fumbled reload. Musket empty.', type: 'result' });
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

  s.log.push({ turn: s.turn, text: 'Musket empty.', type: 'result' });

  const { success: unnoticed } = rollValor(s.player.valor, 20);
  const ncoAttentive = s.line.ncoPresent && s.player.ncoApproval < 40;
  const noticed = !unnoticed || (ncoAttentive && Math.random() < 0.4);

  if (noticed) {
    s.log.push({ turn: s.turn, text: 'Sergeant saw. Empty musket.', type: 'event' });
    s.pendingMoraleChanges.push({ amount: -5, reason: 'Caught with an empty musket', source: 'action' });
    s.player.ncoApproval = Math.max(0, s.player.ncoApproval - 8);
  } else {
    s.log.push({ turn: s.turn, text: 'No one noticed.', type: 'action' });
    s.pendingMoraleChanges.push({ amount: 2, reason: 'Unnoticed — relief', source: 'recovery' });
  }

  s.player.fumbledLoad = false;
  s.drillStep = DrillStep.Endure;

  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 11) {
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

  const stepNarratives: Record<string, string> = {
    [DrillStep.Present]: 'Present arms.',
    [DrillStep.Fire]: 'Ready to fire.',
    [DrillStep.Endure]: 'Endure.',
    [DrillStep.Load]: 'Loading.',
  };

  let text = stepNarratives[state.drillStep] || 'Endure.';

  if (line.casualtiesThisTurn > 0) {
    text += ` ${line.casualtiesThisTurn} down.`;
  }

  if (player.moraleThreshold === MoraleThreshold.Shaken) {
    text += ' Hands unsteady.';
  } else if (player.moraleThreshold === MoraleThreshold.Wavering) {
    text += ' Want to run.';
  } else if (player.moraleThreshold === MoraleThreshold.Breaking) {
    text += ' Can\'t stop shaking.';
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
  // Skip during scripted volleys (transition handled in advanceScriptedTurn)
  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 11) return;

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
    s.log.push({ turn: s.turn, text: 'Fatal hit.', type: 'event' });
    return;
  }

  // Skip random checks during scripted volleys
  if (s.scriptedVolley >= 1 && s.scriptedVolley <= 11) return;

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
      s.log.push({ turn: s.turn, text: 'Fatal hit.', type: 'event' });
    } else {
      s.player.health = Math.max(0, s.player.health - damage);
      s.player.healthState = getHealthState(s.player.health, s.player.maxHealth);
      s.pendingMoraleChanges.push({ amount: -8, reason: 'You\'ve been hit', source: 'event' });
      const wounds = ['arm', 'shoulder', 'thigh', 'side', 'hand'];
      s.log.push({ turn: s.turn, text: `Hit. ${wounds[Math.floor(Math.random() * wounds.length)]}. Still standing.`, type: 'event' });
    }
  }
}
