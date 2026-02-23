import {
  BattleState,
  ChargeChoiceId,
  ChargeChoice,
  BattlePhase,
  DrillStep,
  LogEntry,
  MoraleChange,
} from '../types';
import { createMeleeState, resetMeleeHistory } from './melee';
import { rollValor } from './morale';
import { VOLLEY_RANGES } from './volleys';
import { clampStat, displayRoll, displayTarget, rollStat, Difficulty } from './stats';
import { ENCOUNTER_DEFS } from '../data/encounters';

// ============================================================
// STORY BEAT SYSTEM
// ============================================================

interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
  nextEncounter: number; // 0 = done
}

// ============================================================
// GET STORY BEAT (dispatches on chargeEncounter via data layer)
// ============================================================

export function getChargeEncounter(state: BattleState): {
  narrative: string;
  choices: ChargeChoice[];
} {
  const def = ENCOUNTER_DEFS.find((e) => e.id === state.chargeEncounter);
  if (!def) {
    // Default to battery (id=1)
    const battery = ENCOUNTER_DEFS.find((e) => e.id === 1)!;
    return { narrative: battery.getNarrative(state), choices: battery.getChoices(state) };
  }
  return { narrative: def.getNarrative(state), choices: def.getChoices(state) };
}

// ============================================================
// RESOLVE STORY BEAT CHOICE (dispatches on choiceId)
// ============================================================

export function resolveChargeChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
  // Masséna choices
  if (
    choiceId === ChargeChoiceId.TendWounds ||
    choiceId === ChargeChoiceId.CheckComrades ||
    choiceId === ChargeChoiceId.FollowTheScreams
  ) {
    return resolveMassenaChoice(state, choiceId);
  }
  // Wounded Sergeant choices
  if (
    choiceId === ChargeChoiceId.TakeCommand ||
    choiceId === ChargeChoiceId.RallyTheLine ||
    choiceId === ChargeChoiceId.KeepYourHead
  ) {
    return resolveWoundedSergeantChoice(state, choiceId);
  }
  // Melee transition
  if (choiceId === ChargeChoiceId.FixBayonets) {
    return resolveMeleeTransition(state);
  }
  // Gorge choice
  if (choiceId === ChargeChoiceId.AcceptOrder) {
    return resolveGorgeChoice(state);
  }
  // Aftermath choices
  if (
    choiceId === ChargeChoiceId.HelpWounded ||
    choiceId === ChargeChoiceId.FindComrades ||
    choiceId === ChargeChoiceId.SitDown
  ) {
    return resolveAftermathChoice(state, choiceId);
  }
  // Battery choices
  return resolveBatteryChoice(state, choiceId);
}

// ============================================================
// BATTERY ENCOUNTER (chargeEncounter = 1) — resolve only
// ============================================================

function resolveBatteryChoice(state: BattleState, choiceId: ChargeChoiceId): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (choiceId === ChargeChoiceId.ChargeBattery) {
    log.push({
      turn,
      type: 'action',
      text: `You don't think. Your legs move. Pierre is beside you \u2014 blood on his sleeve, bayonet level \u2014 and you are running, both of you, across the open ground toward the battery.

Muskets fire from the battery as the Austrians mount a defense of the captured battery. Chaos erupts as you rush implacably forward. You lose track of Pierre and JB in the cacophony but soon you're in the fray. You must fight for your life.`,
    });
    moraleChanges.push({ amount: 5, reason: 'The rush of the charge', source: 'action' });

    // Transition to battery melee
    state.batteryCharged = true;
    state.meleeStage = 2;
    state.phase = BattlePhase.Melee;
    state.chargeEncounter = 0;
    state.enemy.range = 0;
    resetMeleeHistory();

    // If Pierre is alive, battery has allies + waves (player + Pierre vs 3 enemies)
    const pierreAlive = state.line.leftNeighbour?.alive;
    const encounterKey = pierreAlive ? 'battery_skirmish' : 'battery';
    state.meleeState = createMeleeState(state, 'battery', encounterKey);

    const firstOpp = state.meleeState.opponents[0];
    log.push({
      turn,
      type: 'event',
      text: '\n--- THE BATTERY ---\n\nThe redoubt is chaos. Overturned caissons, scattered rammers, the acrid reek of powder. The guns loom like iron beasts. French guns. Your guns. Time to take them back.',
    });
    log.push({
      turn,
      type: 'narrative',
      text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
    });

    return { log, moraleChanges, healthDelta: 0, staminaDelta: 0, nextEncounter: 0 };
  }

  // HoldBack — battle continues, but shame persists
  log.push({
    turn,
    type: 'action',
    text: `You hesitate. Your legs don't move. Pierre glances back at you \u2014 just a glance, no judgment in it \u2014 and then he's gone, charging with the others toward the battery.

You watch them go. Captain Leclerc. Pierre. Men whose names you know. Men whose names you don't. They run across the blood soaked ground. Some fall, some disappear through billows of acrid smoke.

The battery is retaken. You see it happen from fifty paces back. The tricolour goes up over the guns. You tell yourself you made the right choice.`,
  });
  moraleChanges.push({ amount: -3, reason: 'Shame \u2014 you held back', source: 'action' });
  state.player.soldierRep = clampStat(state.player.soldierRep - 5);
  state.batteryCharged = false;

  // Transition to Masséna story beat — battle continues regardless
  state.phase = BattlePhase.StoryBeat;
  state.chargeEncounter = 2;

  return { log, moraleChanges, healthDelta: 0, staminaDelta: 0, nextEncounter: 2 };
}

// ============================================================
// MASSÉNA ENCOUNTER (chargeEncounter = 2) — resolve only
// ============================================================

function resolveMassenaChoice(state: BattleState, choiceId: ChargeChoiceId): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;

  if (choiceId === ChargeChoiceId.TendWounds) {
    log.push({
      turn,
      type: 'action',
      text: `You find a wall and lean against it. The stone is cold. Good. You tear a strip from a dead man's shirt \u2014 no time for squeamishness \u2014 and bind the worst of it.

The water in your canteen is restorative. You drink deeply and feel better, just a little.

Five minutes. A small blessing.`,
    });
    healthDelta = 15;
    staminaDelta = 30;
    moraleChanges.push({
      amount: 3,
      reason: 'Tended your wounds \u2014 a small mercy',
      source: 'action',
    });
  } else if (choiceId === ChargeChoiceId.CheckComrades) {
    let comradeText: string;
    if (state.line.leftNeighbour?.alive) {
      comradeText = `You find Pierre first. He's binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn't thank you. He doesn't need to. "You did well today," he says quietly. From Pierre, that's a medal.`;
      state.line.leftNeighbour.morale = Math.min(
        state.line.leftNeighbour.maxMorale,
        state.line.leftNeighbour.morale + 10,
      );
    } else {
      comradeText = `Pierre's place is empty. He wasn't one for words but even so \u2014 silence is deafening.`;
    }

    const jbText = state.line.rightNeighbour?.alive
      ? `Jean-Baptiste looks up when you approach. He's afraid \u2014 of course he's afraid \u2014 but he meets your eyes. "I won't break," he says. You believe him. Mostly.`
      : `You look for Jean-Baptiste. You already know. He's gone.`;

    log.push({
      turn,
      type: 'action',
      text: `${comradeText}\n\n${jbText}`,
    });
    staminaDelta = 15;
    moraleChanges.push({
      amount: 8,
      reason: 'Checked on your comrades \u2014 the line holds together',
      source: 'action',
    });
    state.player.soldierRep = clampStat(state.player.soldierRep + 3);
  } else if (choiceId === ChargeChoiceId.FollowTheScreams) {
    const check = rollStat(state.player.intelligence, 0, Difficulty.Standard);
    if (check.success) {
      log.push({
        turn,
        type: 'action',
        text: `You follow the sound. A surgeon's mate is crouched over a man in the dirt. Blood everywhere. The wounded soldier is thrashing, screaming.

You kneel without being asked. The surgeon's mate doesn't look up. "Hold his leg. Don't let go." You hold it. He cuts. The man screams. You don't let go. "Tourniquet \u2014 twist it tighter." You twist. The bleeding slows. The surgeon's mate ties off the stump and moves to the next man without a word.

The soldier is still alive. That's because of you.`,
      });
      moraleChanges.push({ amount: 5, reason: 'Saved a man\u2019s life', source: 'action' });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You follow the sound. Between two gun carriages, a surgeon's mate is crouched over a man in the dirt. Blood everywhere. The wounded soldier is thrashing, screaming.

You kneel beside the surgeon's mate. He shoves a tourniquet into your hands. "Above the knee. Tight." Your fingers slip in the blood. You twist it the wrong way. He snatches it back, swearing, does it himself. "Get away."

You stand there with blood on your hands and nothing to show for it.`,
      });
      moraleChanges.push({
        amount: -2,
        reason: 'Couldn\u2019t help \u2014 useless',
        source: 'action',
      });
    }
  }

  // Transition to Part 2 line phase
  log.push({
    turn,
    type: 'narrative',
    text: `The five minutes are over. Captain Leclerc's voice: "FOURTEENTH! Form line!"

From the east, through the gorges of the Adige, fresh Austrian columns emerge. The men who just fought through hell must now fight again.

Mass\u00e9na's attack bought time. Not victory. The battle is entering its second act.

"Present arms!"`,
  });

  // Reset enemy for Part 2
  state.battlePart = 2;
  state.scriptedVolley = 5;
  state.phase = BattlePhase.Line;
  state.chargeEncounter = 0;
  state.drillStep = DrillStep.Present;
  state.enemy = {
    range: VOLLEY_RANGES[4], // 100 paces
    strength: 100,
    quality: 'line',
    morale: 'advancing',
    lineIntegrity: 100,
    artillery: true,
    cavalryThreat: false,
  };

  return { log, moraleChanges, healthDelta, staminaDelta, nextEncounter: 0 };
}

// ============================================================
// GORGE ENCOUNTER (chargeEncounter = 3) — resolve only
// ============================================================

function resolveGorgeChoice(state: BattleState): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn,
    type: 'action',
    text: `You shoulder your musket. Your legs move. Around you, the remnants of the 14th demi-brigade move with you \u2014 battered, bloodied, exhausted, and advancing.

Bonaparte watches as his army surges forward. The drums beat the charge. The gorge awaits.`,
  });

  moraleChanges.push({
    amount: 5,
    reason: "Napoleon's presence \u2014 the counterattack",
    source: 'recovery',
  });

  log.push({
    turn,
    type: 'narrative',
    text: `The ridge. You reach it gasping, legs burning, and look down.

The gorge of the Adige opens below \u2014 a narrow defile carved through the mountains, its walls steep and unforgiving. And packed into that gorge, shoulder to shoulder, white coats crushed together like cattle in a pen: the Austrian deathtrap.

Thousands of them. Columns that cannot deploy, cannot form line, cannot fight. They can only push forward into the trap or try to climb walls that offer no purchase. Their officers scream orders that no one can follow.

Captain Leclerc reaches the ridge nearby. "FOURTEENTH! Fire at will!"

You\u2019re in little danger here. For once.`,
  });

  // Transition to Part 3
  state.battlePart = 3;
  state.scriptedVolley = 8;
  state.phase = BattlePhase.Line;
  state.chargeEncounter = 0;
  state.drillStep = DrillStep.Present;
  state.wagonDamage = 0;
  state.gorgeMercyCount = 0;
  state.enemy = {
    range: 200,
    strength: 100,
    quality: 'column',
    morale: 'trapped',
    lineIntegrity: 100,
    artillery: false,
    cavalryThreat: false,
  };

  return { log, moraleChanges, healthDelta: 0, staminaDelta: 0, nextEncounter: 0 };
}

// ============================================================
// AFTERMATH ENCOUNTER (chargeEncounter = 4) — resolve only
// ============================================================

function resolveAftermathChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;

  const pierreAlive = state.line.leftNeighbour?.alive;

  if (choiceId === ChargeChoiceId.HelpWounded) {
    const mercyLine =
      state.gorgeMercyCount > 0
        ? '\n\nYou showed mercy on the ridge. Now you show it here. It does not undo what happened. Nothing will. But it is something.'
        : '';

    let pierreLine: string;
    if (pierreAlive) {
      pierreLine =
        '\n\nPierre watches you from the ridge. Frowning uncertainly. But when you climb back up, he doesn\u2019t question your actions.';
    } else {
      pierreLine =
        '\n\nWhen you climb back up, the ridge feels emptier than before. Pierre would have understood.';
    }

    log.push({
      turn,
      type: 'action',
      text: `You descend into the gorge.

The smell hits first \u2014 powder, blood, the animal stench of fear. Austrian wounded lie among the dead, calling in languages you don\u2019t understand. But the cries of the damned sound the same in any tongue.

You kneel beside a man in a soiled white coat. He flinches \u2014 then sees your canteen. Gratitude.${mercyLine}${pierreLine}`,
    });

    staminaDelta = -30;
    moraleChanges.push({ amount: 8, reason: 'Compassion after slaughter', source: 'action' });
    state.player.soldierRep = clampStat(state.player.soldierRep + 5);
  } else if (choiceId === ChargeChoiceId.FindComrades) {
    let pierreScene: string;
    if (pierreAlive) {
      pierreScene =
        'You find Pierre first. He\u2019s binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn\u2019t thank you. He doesn\u2019t need to. \u201CYou did well today,\u201D he says quietly. From Pierre, that\u2019s a medal.';
    } else {
      pierreScene =
        'You go to where Pierre fell. Someone has covered his face with his coat. You stand there for a long time. There is nothing to say. There is nothing to do. But you stand there anyway.';
    }

    const jbScene = state.line.rightNeighbour?.alive
      ? 'Jean-Baptiste looks up when you approach. He\u2019s exhausted \u2014 of course he is \u2014 but he meets your eyes. \u201CI didn\u2019t break,\u201D he says. You grip his shoulder. \u201CNo. You didn\u2019t.\u201D'
      : 'You go to where Jean-Baptiste fell at the battery. Someone has crossed his hands over his chest. He looks younger than you remembered. You kneel beside him for a moment. \u201CYou didn\u2019t break,\u201D you say to no one.';

    log.push({
      turn,
      type: 'action',
      text: `You go looking for the living.

${pierreScene}

${jbScene}

The 14th is smaller now. The faces that are missing will never come back. But the faces that remain \u2014 they look at you, and you look at them, and something passes between you that has no name.

You survived Rivoli together. That is a bond that will never break.`,
    });

    staminaDelta = 30;
    moraleChanges.push({
      amount: 5,
      reason: 'Found your comrades \u2014 the bond holds',
      source: 'action',
    });
    // NPC relationship boosts
    if (state.line.leftNeighbour?.alive) {
      state.line.leftNeighbour.relationship = clampStat(state.line.leftNeighbour.relationship + 10);
    }
    if (state.line.rightNeighbour?.alive) {
      state.line.rightNeighbour.relationship = clampStat(
        state.line.rightNeighbour.relationship + 10,
      );
    }
  } else if (choiceId === ChargeChoiceId.SitDown) {
    let pierreLine: string;
    if (pierreAlive) {
      pierreLine =
        '\n\nPierre sits beside you. Says nothing. His shoulder touches yours. That is all. That is everything.\n\nAfter a while \u2014 minutes, hours, you cannot say \u2014 his voice: \u201CTime to go, lad.\u201D You pick up your musket. You stand. You walk.';
    } else {
      pierreLine =
        '\n\nNo one sits beside you. Pierre would have. That thought is the one that nearly breaks you.\n\nAfter a while \u2014 minutes, hours, you cannot say \u2014 you pick up your musket. You stand. You walk. Because there is nothing else to do.';
    }

    log.push({
      turn,
      type: 'action',
      text: `You sit down.

Not a decision. Your legs simply stop working. The musket slides from your fingers and clatters on the frozen ground. You sit on the ridge, knees drawn up, and stare at the gorge below.

The sounds of victory wash over you \u2014 distant cheers, the cavalry horns, voices calling in triumph. None of it reaches you. Not really. You are somewhere else. Somewhere between the first volley at dawn and the last volley into the gorge.${pierreLine}`,
    });

    healthDelta = 10;
    staminaDelta = 45;
    moraleChanges.push({
      amount: 3,
      reason: 'Rest \u2014 the body takes what the mind cannot',
      source: 'action',
    });
  }

  // Closing narrative — all choices end the same way
  log.push({
    turn,
    type: 'narrative',
    text: `The drums beat assembly. The 14th reforms \u2014 what is left of it. Men fall in by habit, finding their places in a line that has too many gaps. The officers count heads. The sergeants mark the dead.

The Battle of Rivoli is over. The cost is written in the faces of the men who paid it. But the 14th held. Through dawn, through the battery, through the gorge. They held.

Whatever comes next, you will carry this day with you forever.`,
  });

  // End the battle
  state.battleOver = true;
  state.outcome = 'gorge_victory';

  return { log, moraleChanges, healthDelta, staminaDelta, nextEncounter: 0 };
}

// ============================================================
// WOUNDED SERGEANT ENCOUNTER (chargeEncounter = 5) — resolve only
// ============================================================

function resolveWoundedSergeantChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  const healthDelta = 0;
  const staminaDelta = -15; // all choices are taxing

  // Sergeant is down for the rest of the battle
  state.line.ncoPresent = false;

  if (choiceId === ChargeChoiceId.TakeCommand) {
    // Valor + Charisma check
    const combinedStat = (state.player.valor + state.player.charisma) / 2;
    const { success, roll, target } = rollValor(combinedStat, -5);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You don't think. You move. Duval's spontoon is in your hand before you've made a decision — the weight of it strange, an NCO's weapon, not a private's.

"SECTION! HOLD THE LINE!" Your voice cuts through the smoke. Where did that come from? [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} — passed]

Men turn. They see you — a private with a sergeant's spontoon, standing where Duval stood, giving orders you have no right to give.

The line steadies. Pierre, blood on his sleeve, gives you a look that is half-surprise, half-respect.`,
      });
      moraleChanges.push({
        amount: 8,
        reason: 'You took command — the section holds',
        source: 'action',
      });
      state.player.soldierRep = clampStat(state.player.soldierRep + 8);
      state.player.officerRep = clampStat(state.player.officerRep + 15);
      state.player.valor = clampStat(state.player.valor + 3);
      state.line.lineIntegrity = Math.min(100, state.line.lineIntegrity + 5);
      state.graceEarned = true;
      log.push({
        turn,
        type: 'event',
        text: 'Your courage has earned the favour of fate. [+1 Grace]',
      });
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You grab Duval's spontoon and stand. "SECTION! HOLD—" [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} — failed]

Your voice cracks. The command comes out thin, uncertain — a private playing at sergeant. Men glance at you, then look away. At least you tried.`,
      });
      moraleChanges.push({
        amount: -3,
        reason: 'You tried — not enough authority',
        source: 'action',
      });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
      state.player.officerRep = clampStat(state.player.officerRep + 5);
    }
  } else if (choiceId === ChargeChoiceId.RallyTheLine) {
    // Charisma check
    const { success, roll, target } = rollValor(state.player.charisma, 0);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You can't replace Duval. You're no NCO. But you can be loud.

"HOLD TOGETHER! THE SERGEANT'S BEING TENDED! HOLD!" [Charisma: ${displayRoll(roll)} vs ${displayTarget(target)} — passed]

The men on either side of you hear it. The panic that was building in the section eases. Just enough.

The line steadies. Survivors will remember your courage, your voice.`,
      });
      moraleChanges.push({ amount: 5, reason: 'You rallied your section', source: 'action' });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
    } else {
      log.push({
        turn,
        type: 'action',
        text: `"HOLD! HOLD THE—" [Charisma: ${displayRoll(roll)} vs ${displayTarget(target)} — failed]

Your shout is swallowed by the crash of the next volley. The men around you don't hear, or don't listen. You're just another private screaming in the smoke.

The line holds anyway — barely.`,
      });
      moraleChanges.push({
        amount: -1,
        reason: 'Your voice was lost in the noise',
        source: 'action',
      });
    }
  } else {
    // KeepYourHead — no check, slight penalties
    log.push({
      turn,
      type: 'action',
      text: `Duval goes down. Men look around for leadership. You do the same. Not your job. Not your rank. A private does not give orders. A private survives.

Pierre barks instructions through gritted teeth because someone has to. No one notices your silence. That is its own kind of verdict.`,
    });
    moraleChanges.push({
      amount: -2,
      reason: 'You kept quiet when the section needed a voice',
      source: 'action',
    });
    state.player.soldierRep = clampStat(state.player.soldierRep - 3);
    state.player.officerRep = clampStat(state.player.officerRep - 5);
  }

  // Don't transition phase — auto-play orchestrator will resume

  return { log, moraleChanges, healthDelta, staminaDelta, nextEncounter: 0 };
}

// ============================================================
// MELEE TRANSITION ENCOUNTER (chargeEncounter = 6) — resolve only
// ============================================================

function resolveMeleeTransition(state: BattleState): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn,
    type: 'action',
    text: `You fix your bayonet. The steel slides home with a click.

The Austrian column hits the French line. Men crash into men across the broken ground. Musket butts, bayonets, fists, teeth. The 14th fights in the vineyards, among the stone walls and the bloody fresh corpses of the fallen.

You are in it now. No more volleys. Just the weight of the man in front of you, the point of your bayonet, the will to survive.`,
  });

  moraleChanges.push({ amount: 3, reason: 'The rush of close combat', source: 'action' });

  // Set up melee
  state.phase = BattlePhase.Melee;
  state.meleeStage = 1;
  state.scriptedVolley = 0;
  state.drillStep = DrillStep.Endure;
  state.enemy.range = 0;
  state.enemy.morale = 'charging';
  state.chargeEncounter = 0;
  resetMeleeHistory();
  state.meleeState = createMeleeState(state, 'terrain', 'terrain');

  const firstOpp = state.meleeState.opponents[0];
  log.push({
    turn,
    type: 'event',
    text: '\n--- MELEE ---\n\nThe ordered line is gone. This is knives and teeth and the will to survive in the vineyards of Rivoli.',
  });
  log.push({
    turn,
    type: 'narrative',
    text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
  });

  return { log, moraleChanges, healthDelta: 0, staminaDelta: 0, nextEncounter: 0 };
}
