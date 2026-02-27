import type { BattleState, ChargeChoice, LogEntry, MoraleChange } from '../../../types';
import { ChargeChoiceId, ChargeEncounterId, BattlePhase, DrillStep } from '../../../types/enums';
import { createMeleeState, resetMeleeHistory } from '../../../core/melee';
import { rollValor } from '../../../core/morale';
import { RIVOLI_VOLLEY_RANGES } from './volleys';
import { clampStat, displayRoll, displayTarget, rollStat, Difficulty } from '../../../core/stats';
import type { StoryBeatConfig, StoryBeatResult } from '../types';

// ============================================================
// Helper: ChargeEncounterResult (internal, includes nextEncounter)
// ============================================================

interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
  nextEncounter: number;
}

// ============================================================
// 1 — Battery
// ============================================================

function resolveBatteryChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
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

    state.ext.batteryCharged = true;
    state.ext.meleeStage = 2;
    state.phase = BattlePhase.Melee;
    state.chargeEncounter = 0;
    state.enemy.range = 0;
    resetMeleeHistory();

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

  // HoldBack
  log.push({
    turn,
    type: 'action',
    text: `You hesitate. Your legs don't move. Pierre glances back at you \u2014 just a glance, no judgment in it \u2014 and then he's gone, charging with the others toward the battery.

You watch them go. Captain Leclerc. Pierre. Men whose names you know. Men whose names you don't. They run across the blood soaked ground. Some fall, some disappear through billows of acrid smoke.

The battery is retaken. You see it happen from fifty paces back. The tricolour goes up over the guns. You tell yourself you made the right choice.`,
  });
  moraleChanges.push({ amount: -3, reason: 'Shame \u2014 you held back', source: 'action' });
  state.player.soldierRep = clampStat(state.player.soldierRep - 5);
  state.ext.batteryCharged = false;

  state.phase = BattlePhase.StoryBeat;
  state.chargeEncounter = ChargeEncounterId.Massena;

  return { log, moraleChanges, healthDelta: 0, staminaDelta: 0, nextEncounter: ChargeEncounterId.Massena };
}

// ============================================================
// 2 — Masséna
// ============================================================

function resolveMassenaChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
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

    log.push({ turn, type: 'action', text: `${comradeText}\n\n${jbText}` });
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

  state.ext.battlePart = 2;
  state.scriptedVolley = 5;
  state.phase = BattlePhase.Line;
  state.chargeEncounter = 0;
  state.drillStep = DrillStep.Present;
  state.enemy = {
    range: RIVOLI_VOLLEY_RANGES[4],
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
// 3 — Gorge
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

  state.ext.battlePart = 3;
  state.scriptedVolley = 8;
  state.phase = BattlePhase.Line;
  state.chargeEncounter = 0;
  state.drillStep = DrillStep.Present;
  state.ext.wagonDamage = 0;
  state.ext.gorgeMercyCount = 0;
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
// 4 — Aftermath
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
      state.ext.gorgeMercyCount > 0
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

  // Closing narrative
  log.push({
    turn,
    type: 'narrative',
    text: `The drums beat assembly. The 14th reforms \u2014 what is left of it. Men fall in by habit, finding their places in a line that has too many gaps. The officers count heads. The sergeants mark the dead.

The Battle of Rivoli is over. The cost is written in the faces of the men who paid it. But the 14th held. Through dawn, through the battery, through the gorge. They held.

Whatever comes next, you will carry this day with you forever.`,
  });

  state.battleOver = true;
  state.outcome = 'gorge_victory';

  return { log, moraleChanges, healthDelta, staminaDelta, nextEncounter: 0 };
}

// ============================================================
// 5 — Wounded Sergeant
// ============================================================

function resolveWoundedSergeantChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  const healthDelta = 0;
  const staminaDelta = -15;

  state.line.ncoPresent = false;

  if (choiceId === ChargeChoiceId.TakeCommand) {
    const combinedStat = (state.player.valor + state.player.charisma) / 2;
    const { success, roll, target } = rollValor(combinedStat, -5);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You don't think. You move. Duval's spontoon is in your hand before you've made a decision \u2014 the weight of it strange, an NCO's weapon, not a private's.

"SECTION! HOLD THE LINE!" Your voice cuts through the smoke. Where did that come from? [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

Men turn. They see you \u2014 a private with a sergeant's spontoon, standing where Duval stood, giving orders you have no right to give.

The line steadies. Pierre, blood on his sleeve, gives you a look that is half-surprise, half-respect.`,
      });
      moraleChanges.push({
        amount: 8,
        reason: 'You took command \u2014 the section holds',
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
        text: `You grab Duval's spontoon and stand. "SECTION! HOLD\u2014" [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

Your voice cracks. The command comes out thin, uncertain \u2014 a private playing at sergeant. Men glance at you, then look away. At least you tried.`,
      });
      moraleChanges.push({
        amount: -3,
        reason: 'You tried \u2014 not enough authority',
        source: 'action',
      });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
      state.player.officerRep = clampStat(state.player.officerRep + 5);
    }
  } else if (choiceId === ChargeChoiceId.RallyTheLine) {
    const { success, roll, target } = rollValor(state.player.charisma, 0);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You can't replace Duval. You're no NCO. But you can be loud.

"HOLD TOGETHER! THE SERGEANT'S BEING TENDED! HOLD!" [Charisma: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

The men on either side of you hear it. The panic that was building in the section eases. Just enough.

The line steadies. Survivors will remember your courage, your voice.`,
      });
      moraleChanges.push({ amount: 5, reason: 'You rallied your section', source: 'action' });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
    } else {
      log.push({
        turn,
        type: 'action',
        text: `"HOLD! HOLD THE\u2014" [Charisma: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

Your shout is swallowed by the crash of the next volley. The men around you don't hear, or don't listen. You're just another private screaming in the smoke.

The line holds anyway \u2014 barely.`,
      });
      moraleChanges.push({
        amount: -1,
        reason: 'Your voice was lost in the noise',
        source: 'action',
      });
    }
  } else {
    // KeepYourHead
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

  return { log, moraleChanges, healthDelta, staminaDelta, nextEncounter: 0 };
}

// ============================================================
// 6 — Melee Transition
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

  state.phase = BattlePhase.Melee;
  state.ext.meleeStage = 1;
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

// ============================================================
// ENCOUNTER NARRATIVES + CHOICES (from data/encounters.ts)
// ============================================================

const BATTERY_NARRATIVE = (_state: BattleState): string =>
  `The 14th fights on. Ground is taken, lost, taken again across the broken terrain of the plateau. Vineyards become killing grounds. Walled gardens become fortresses held for minutes, then lost.

Through the chaos, you hear it \u2014 the Austrians have overrun one of your batteries. French guns turning against French troops.

Over the cacophony, Captain Leclerc's voice rings out \u2014 hoarse, furious, alive with defiance:

"FOURTEENTH! Will you let them take your guns?!"

You catch Pierre's eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of something \u2014 not madness or despair. Valor. The real thing.`;

const MASSENA_NARRATIVE = (state: BattleState): string => {
  const pierreStatus = state.line.leftNeighbour?.alive
    ? "Pierre leans against a broken wall, his shoulder bound with a strip torn from someone's coat. The blood has soaked through. He catches your eye and nods once. Still here."
    : "Pierre's place in the line is empty. You don't look at the spot where he fell.";

  const jbStatus = state.line.rightNeighbour?.alive
    ? "Jean-Baptiste is pale but upright. He checks his flint with hands that barely shake anymore. He's become a soldier."
    : 'Jean-Baptiste\'s place is empty. You do not let yourself think about it.';

  return `The sound comes from the south \u2014 drums. Not Austrian drums. French drums, beating the pas de charge, growing louder. Through the haze of powder smoke, you see them: fresh troops in blue coats, formed lines, bayonets glinting. Thousands of them.

Mass\u00e9na's division slams into the Austrian flank like a fist. The columns that have been pressing the plateau stagger, turn, try to reform against this new threat. For the first time since dawn, the pressure on the 14th eases.

${pierreStatus}

${jbStatus}

Captain Leclerc walks the line. His coat is torn, his face is black with powder, but his voice is steady: "Five minutes, Fourteenth. Reform. Reload. This isn't over."

Five minutes. What do you do?`;
};

const GORGE_NARRATIVE = (_state: BattleState): string =>
  `On the ridge above the plateau, a small figure on a grey horse. Even through the smoke and chaos, every man in the line knows who it is. Bonaparte.

He's been there since dawn, watching, calculating, moving his pieces across this frozen chessboard. Now he moves the last one.

An aide-de-camp gallops down from the ridge. The orders carry down the line like fire along a powder trail:

"Every man, every gun to the ridge! The counterattack goes in NOW!"

Captain Leclerc turns to the 14th. His voice is raw, half-gone, but it carries:

"FOURTEENTH! To the ridge! We finish this!"

Around you, the survivors of two phases of hell straighten their backs. The drums change their beat \u2014 not the steady rhythm of the line, but the pas de charge. The advance.

Bonaparte is ordering the counterattack. The gorge must be sealed. And the 14th is going.`;

const AFTERMATH_NARRATIVE = (state: BattleState): string => {
  const pierreAlive = state.line.leftNeighbour?.alive;

  const pierreLine = pierreAlive
    ? 'Pierre sits on a rock, binding his shoulder one-handed. Blood has soaked through three layers of bandage. He catches your eye and nods once. Still here.'
    : 'Pierre\u2019s place in the line is empty. You don\u2019t look at the spot where he fell. You can\u2019t.';

  const jbLine = state.line.rightNeighbour?.alive
    ? 'Jean-Baptiste stands at the ridge\u2019s edge, musket grounded, staring at the gorge. He is pale but upright. Whatever you said to him during the second volley held. He made it through.'
    : 'Jean-Baptiste is not at the ridge. He fell at the battery. Someone will tell his family. Someone must.';

  const batteryLine = state.ext.batteryCharged
    ? 'Retook the battery by bayonet.'
    : 'Held the line while others charged the battery.';

  return `Victory.

The Austrian column is defeated.

But the battle is not over \u2014 not everywhere. From the ridge, you hear it: the thunder of hooves on the frozen plateau. Leclerc\u2019s chasseurs \u00e0 cheval \u2014 just a few hundred horsemen \u2014 sweep into the Austrian centre like a scythe through wheat. The exhausted white-coated columns, spread out and disordered after hours of fighting, break at the first sight of cavalry.

The rout spreads faster than the horsemen can ride. Alvinczi himself \u2014 the Austrian commander who thought himself on the cusp of victory an hour ago \u2014 joins the undignified race to the rear.

Word passes down the ridge like a spark along a fuse: Lusignan\u2019s column \u2014 the force at Affi that had the whole army convinced they were surrounded \u2014 has been cut off by General Rey. They are surrendering in their thousands.

The Battle of Rivoli is won.

The 14th demi-brigade held the plateau through dawn. ${batteryLine} Endured Vukassovich\u2019s fresh columns when the right flank broke. And sealed the gorge.

${pierreLine}

${jbLine}

Captain Leclerc sheathes his sword. His hand is steady now. \u201CThe 14th will reform. Take what rest you can. We march at dusk.\u201D`;
};

const WOUNDED_SERGEANT_NARRATIVE = (_state: BattleState): string =>
  `At fifty paces, the Austrian volley tears through the line. Sergeant Duval \u2014 the granite-faced NCO who has held the section together since dawn \u2014 takes a ball in the thigh.

He goes down hard. His spontoon clatters against the stones. For a moment, his face shows nothing \u2014 just surprise, as if he'd tripped on a vine root. Then the pain hits and he grabs his leg with both hands.

"Sergeant's down!" The cry ripples through the section.

Captain Leclerc is thirty paces to the left, dealing with a gap in the line where an entire file went down. He hasn't seen. The section \u2014 your section \u2014 is without its NCO.

The line wavers. Men look to each other. Someone must act.`;

const MELEE_TRANSITION_NARRATIVE = (_state: BattleState): string =>
  `The last volley tears through the Austrian ranks at twenty-five paces. Point blank. The smoke has barely cleared when the drums change their beat \u2014 The pas de charge.

Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles. Your musket becomes a spear.

Pierre, blood soaking through his sleeve, fixes his bayonet one-handed. His teeth are clenched. His eyes are steady. The veteran has been here before.

Jean-Baptiste fixes his bayonet. His hands shake \u2014 but he does it.

And then the left flank crumbles. You see it happen \u2014 white coats pouring through the gap where the companies to your left were standing a moment ago. The ordered line dissolves. Walled gardens and vineyard terraces become individual battlefields. The 14th is no longer a firing line.

It is a collection of men with bayonets, standing in the broken ground of Rivoli, about to fight for their lives.

Captain Leclerc's voice, one final time: "FOURTEENTH! EN AVANT!"`;

// ============================================================
// RIVOLI STORY BEATS — assembled config records
// ============================================================

// Internal resolver that wraps the legacy ChargeEncounterResult → StoryBeatResult
function wrapResolve(
  fn: (state: BattleState, choiceId: ChargeChoiceId) => ChargeEncounterResult,
): (state: BattleState, choiceId: ChargeChoiceId) => StoryBeatResult {
  return (state, choiceId) => {
    const result = fn(state, choiceId);
    return {
      log: result.log,
      moraleChanges: result.moraleChanges,
      healthDelta: result.healthDelta,
      staminaDelta: result.staminaDelta,
    };
  };
}

export const RIVOLI_STORY_BEATS: Record<number, StoryBeatConfig> = {
  1: {
    id: 1,
    getNarrative: BATTERY_NARRATIVE,
    getChoices: (_state) => [
      {
        id: ChargeChoiceId.ChargeBattery,
        label: 'Charge the battery',
        description:
          "Heed the captain's call. Charge into the teeth of your own guns to take them back.",
        available: true,
      },
      {
        id: ChargeChoiceId.HoldBack,
        label: 'Hold back',
        description: "Let braver souls lead. You've done enough.",
        available: true,
      },
    ],
    resolveChoice: wrapResolve(resolveBatteryChoice),
  },
  2: {
    id: 2,
    getNarrative: MASSENA_NARRATIVE,
    getChoices: (_state) => [
      {
        id: ChargeChoiceId.TendWounds,
        label: 'Tend your wounds',
        description:
          "Bind your cuts, drink water, catch your breath. You need your body to hold together for what's coming.",
        available: true,
      },
      {
        id: ChargeChoiceId.CheckComrades,
        label: 'Check on your comrades',
        description:
          "Find Pierre and Jean-Baptiste. See who's still standing. The line needs its people more than its muskets.",
        available: true,
      },
      {
        id: ChargeChoiceId.FollowTheScreams,
        label: 'Follow the screaming',
        description: 'Someone is hurt. You can hear it. Your feet are already moving.',
        available: true,
      },
    ],
    resolveChoice: wrapResolve(resolveMassenaChoice),
  },
  3: {
    id: 3,
    getNarrative: GORGE_NARRATIVE,
    getChoices: (_state) => [
      {
        id: ChargeChoiceId.AcceptOrder,
        label: 'To the ridge',
        description: 'Follow the captain. Follow Bonaparte. Follow the drums. One more time.',
        available: true,
      },
    ],
    resolveChoice: wrapResolve(resolveGorgeChoice),
  },
  4: {
    id: 4,
    getNarrative: AFTERMATH_NARRATIVE,
    getChoices: (_state) => [
      {
        id: ChargeChoiceId.HelpWounded,
        label: 'Help the wounded',
        description:
          'Descend into the gorge. Tend to Austrian wounded. Mercy and humanity for its own sake.',
        available: true,
      },
      {
        id: ChargeChoiceId.FindComrades,
        label: 'Find your comrades',
        description: 'Search for Pierre, Jean-Baptiste, the men you stood beside. See who survived.',
        available: true,
      },
      {
        id: ChargeChoiceId.SitDown,
        label: 'Sit down',
        description:
          'Your legs stop working. The musket slides from your fingers. You sit on the ridge and stare.',
        available: true,
      },
    ],
    resolveChoice: wrapResolve(resolveAftermathChoice),
  },
  5: {
    id: 5,
    getNarrative: WOUNDED_SERGEANT_NARRATIVE,
    getChoices: (_state) => [
      {
        id: ChargeChoiceId.TakeCommand,
        label: "Take the sergeant's place",
        description:
          'Pick up his spontoon. Give orders. You are not an NCO \u2014 but someone must be. [Valor + Charisma check]',
        available: true,
      },
      {
        id: ChargeChoiceId.RallyTheLine,
        label: 'Rally the men around you',
        description:
          "You can't replace Duval. But you can shout, hold your section, keep the men beside you steady. [Charisma check]",
        available: true,
      },
      {
        id: ChargeChoiceId.KeepYourHead,
        label: 'Keep your head down',
        description:
          'Not your job. Not your rank. Survive the next two volleys and let the officers sort it out.',
        available: true,
      },
    ],
    resolveChoice: wrapResolve(resolveWoundedSergeantChoice),
  },
  6: {
    id: 6,
    getNarrative: MELEE_TRANSITION_NARRATIVE,
    getChoices: (_state) => [
      {
        id: ChargeChoiceId.FixBayonets,
        label: 'Fix bayonets',
        description: 'Steel on steel.',
        available: true,
      },
    ],
    resolveChoice: wrapResolve(resolveMeleeTransition),
  },
};
