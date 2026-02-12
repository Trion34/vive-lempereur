import {
  BattleState, ChargeChoiceId, ChargeChoice, BattlePhase, DrillStep,
  LogEntry, MoraleChange,
} from '../types';
import { createMeleeState, resetMeleeHistory } from './melee';
import { VOLLEY_RANGES } from './scriptedVolleys';

// ============================================================
// STORY BEAT SYSTEM
// ============================================================

export interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  fatigueDelta: number;
  nextEncounter: number; // 0 = done
}

// ============================================================
// GET STORY BEAT (dispatches on chargeEncounter)
// ============================================================

export function getChargeEncounter(
  state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  switch (state.chargeEncounter) {
    case 2: return getMassenaEncounter(state);
    case 3: return getGorgeEncounter(state);
    case 4: return getAftermathEncounter(state);
    default: return getBatteryEncounter(state);
  }
}

// ============================================================
// RESOLVE STORY BEAT CHOICE (dispatches on choiceId)
// ============================================================

export function resolveChargeChoice(
  state: BattleState, choiceId: ChargeChoiceId
): ChargeEncounterResult {
  // Masséna choices
  if (choiceId === ChargeChoiceId.TendWounds ||
      choiceId === ChargeChoiceId.CheckComrades ||
      choiceId === ChargeChoiceId.ScavengeAmmo) {
    return resolveMassenaChoice(state, choiceId);
  }
  // Gorge choice
  if (choiceId === ChargeChoiceId.AcceptOrder) {
    return resolveGorgeChoice(state);
  }
  // Aftermath choices
  if (choiceId === ChargeChoiceId.HelpWounded ||
      choiceId === ChargeChoiceId.FindComrades ||
      choiceId === ChargeChoiceId.SitDown) {
    return resolveAftermathChoice(state, choiceId);
  }
  // Battery choices
  return resolveBatteryChoice(state, choiceId);
}

// ============================================================
// BATTERY ENCOUNTER (chargeEncounter = 1)
// ============================================================

function getBatteryEncounter(
  _state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  const narrative = `The 14th fights on. Ground is taken, lost, taken again across the broken terrain of the plateau. Vineyards become killing grounds. Walled gardens become fortresses held for minutes, then lost.

Through the chaos, you hear it \u2014 the crack of artillery, closer than before, firing in the wrong direction. The Austrians have overrun one of your batteries. French guns turned against French troops.

Over the cacophony, Captain Leclerc's voice rings out \u2014 hoarse, furious, alive with defiance:

"FOURTEENTH! Will you let them take your guns?!"

You catch Pierre's eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of something \u2014 not madness, not despair. Valor. The real thing.`;

  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.ChargeBattery,
      label: 'Charge the battery',
      description: 'Heed the captain\'s call. Charge into the teeth of your own guns to take them back.',
      available: true,
    },
    {
      id: ChargeChoiceId.HoldBack,
      label: 'Hold back',
      description: 'Let braver souls lead. You\'ve done enough.',
      available: true,
    },
  ];

  return { narrative, choices };
}

function resolveBatteryChoice(
  state: BattleState, choiceId: ChargeChoiceId
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (choiceId === ChargeChoiceId.ChargeBattery) {
    log.push({
      turn, type: 'action',
      text: `You don't think. Your legs move. Pierre is beside you \u2014 blood on his sleeve, bayonet level \u2014 and you are running, both of you, across the open ground toward the battery.

The guns fire. Your own guns. Canister tears the air around you \u2014 men fall to your left and right. But you are still running, and Pierre is still running, and the captain is somewhere behind you screaming the Fourteenth forward.

The Austrian gunners see you coming. Some reach for short swords. Others try to turn the guns. Too late. Too slow.

You are among them.`,
    });
    moraleChanges.push({ amount: 5, reason: 'The rush of the charge', source: 'action' });

    // Transition to battery melee
    state.batteryCharged = true;
    state.meleeStage = 2;
    state.phase = BattlePhase.Melee;
    state.chargeEncounter = 0;
    state.enemy.range = 0;
    resetMeleeHistory();
    state.meleeState = createMeleeState(state, 'battery');

    const firstOpp = state.meleeState.opponents[0];
    log.push({
      turn, type: 'event',
      text: '\n--- THE BATTERY ---\n\nThe redoubt is chaos. Overturned caissons, scattered rammers, the acrid reek of powder. The guns loom like iron beasts. French guns. Your guns. Time to take them back.',
    });
    log.push({
      turn, type: 'narrative',
      text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
    });

    return { log, moraleChanges, healthDelta: 0, fatigueDelta: 0, nextEncounter: 0 };
  }

  // HoldBack — battle continues, but shame persists
  log.push({
    turn, type: 'action',
    text: `You hesitate. Your legs don't move. Pierre glances back at you \u2014 just a glance, no judgment in it, not yet \u2014 and then he's gone, charging with the others toward the battery.

You watch them go. Captain Leclerc. Pierre. Men whose names you know. Men whose names you don't. They run across the open ground and the guns fire and men fall and they keep running.

The battery is retaken. You see it happen from fifty paces back. The tricolour goes up over the guns. A cheer rises from the smoke.

You were not part of it.

You tell yourself you made the right choice. You will keep telling yourself that.`,
  });
  moraleChanges.push({ amount: -3, reason: 'Shame \u2014 you held back', source: 'action' });
  state.player.reputation -= 5;
  state.batteryCharged = false;

  // Transition to Masséna story beat — battle continues regardless
  state.phase = BattlePhase.StoryBeat;
  state.chargeEncounter = 2;

  return { log, moraleChanges, healthDelta: 0, fatigueDelta: 0, nextEncounter: 2 };
}

// ============================================================
// MASSÉNA ENCOUNTER (chargeEncounter = 2)
// ============================================================

function getMassenaEncounter(
  state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  const pierreStatus = state.line.leftNeighbour?.alive
    ? (state.line.leftNeighbour.wounded
      ? 'Pierre leans against a gun carriage, his shoulder bound with a strip torn from someone\'s coat. The blood has soaked through. He catches your eye and nods once. Still here.'
      : 'Pierre sits on an upturned caisson, cleaning his bayonet with methodical strokes. Steady hands. Steady eyes.')
    : 'Pierre\'s place in the line is empty. You don\'t look at the spot where he fell.';

  let jbStatus: string;
  if (state.jbCrisisOutcome === 'steadied') {
    jbStatus = 'Jean-Baptiste is pale but upright. He checks his flint with hands that barely shake. Whatever you said to him during the second volley \u2014 it held. He\'s still a soldier.';
  } else if (state.jbCrisisOutcome === 'failed' || state.jbCrisisOutcome === 'ignored') {
    jbStatus = 'Jean-Baptiste sits with his back against a wall, staring at nothing. His musket lies across his knees. He\'s here. That\'s all you can say for him.';
  } else {
    jbStatus = 'Jean-Baptiste crouches behind a broken wheel, arms wrapped around his knees. He\'s shaking. He hasn\'t spoken since the second volley. But he hasn\'t run.';
  }

  const narrative = `The sound comes from the south \u2014 drums. Not Austrian drums. French drums, beating the pas de charge, growing louder. Through the haze of powder smoke, you see them: fresh troops in blue coats, formed lines, bayonets glinting. Thousands of them.

Mass\u00e9na's division slams into the Austrian flank like a fist. The columns that have been pressing the plateau stagger, turn, try to reform against this new threat. For the first time since dawn, the pressure on the 14th eases.

${pierreStatus}

${jbStatus}

Captain Leclerc walks the line. His coat is torn, his face is black with powder, but his voice is steady: "Five minutes, Fourteenth. Reform. Reload. This isn't over \u2014 Vukassovich is coming from the gorges with fresh columns. But we have five minutes. Use them."

Five minutes. What do you do?`;

  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.TendWounds,
      label: 'Tend your wounds',
      description: 'Bind your cuts, drink water, catch your breath. You need your body to hold together for what\'s coming.',
      available: true,
    },
    {
      id: ChargeChoiceId.CheckComrades,
      label: 'Check on your comrades',
      description: 'Find Pierre and Jean-Baptiste. See who\'s still standing. The line needs its people more than its muskets.',
      available: true,
    },
    {
      id: ChargeChoiceId.ScavengeAmmo,
      label: 'Scavenge ammunition',
      description: 'Strip cartridges from the dead. Check your flint. Make sure your musket is ready. Cold and practical.',
      available: true,
    },
  ];

  return { narrative, choices };
}

function resolveMassenaChoice(
  state: BattleState, choiceId: ChargeChoiceId
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let fatigueDelta = 0;

  if (choiceId === ChargeChoiceId.TendWounds) {
    log.push({
      turn, type: 'action',
      text: `You find a wall and lean against it. The stone is cold. Good. You tear a strip from a dead man's shirt \u2014 no time for squeamishness \u2014 and bind the worst of it. Your shoulder. Your side where something grazed you during the melee.

The water in your canteen is lukewarm and tastes of metal. You drink anyway. Your hands stop shaking, just a little.

Five minutes. Not enough. But something.`,
    });
    healthDelta = 15;
    fatigueDelta = 10;
    moraleChanges.push({ amount: 3, reason: 'Tended your wounds \u2014 a small mercy', source: 'action' });
  } else if (choiceId === ChargeChoiceId.CheckComrades) {
    let comradeText: string;
    if (state.line.leftNeighbour?.alive && state.line.leftNeighbour.wounded) {
      comradeText = `You find Pierre first. He's binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn't thank you. He doesn't need to. "You did well today," he says quietly. From Pierre, that's a medal.`;
      state.line.leftNeighbour.morale = Math.min(state.line.leftNeighbour.maxMorale, state.line.leftNeighbour.morale + 10);
    } else if (state.line.leftNeighbour?.alive) {
      comradeText = `Pierre nods when he sees you. "Still standing," he says. "Both of us." He offers his canteen. You drink. The simple kindness of it nearly undoes you.`;
    } else {
      comradeText = `Pierre's place is empty. You stand where he stood this morning and the silence is deafening.`;
    }

    let jbText: string;
    if (state.jbCrisisOutcome === 'steadied') {
      jbText = `Jean-Baptiste looks up when you approach. He's afraid \u2014 of course he's afraid \u2014 but he meets your eyes. "I won't break," he says. You believe him. Mostly.`;
    } else {
      jbText = `Jean-Baptiste is staring at his hands. They're red. He doesn't know whose blood it is. "I can't\u2014" he starts. You grip his shoulder. "You can. We hold together." He doesn't look convinced. But he doesn't run.`;
    }

    log.push({
      turn, type: 'action',
      text: `${comradeText}\n\n${jbText}`,
    });
    fatigueDelta = 5;
    moraleChanges.push({ amount: 8, reason: 'Checked on your comrades \u2014 the line holds together', source: 'action' });
    state.player.reputation += 3;
  } else if (choiceId === ChargeChoiceId.ScavengeAmmo) {
    log.push({
      turn, type: 'action',
      text: `You go among the dead. It doesn't bother you the way it should. Fingers find cartridge boxes, pry them open, stuff the paper cylinders into your own pouch. Twenty rounds. Thirty. Enough.

You check your flint. Replace it with a sharper one from a man who won't need it anymore. The musket is clean. Loaded. Ready.

Cold work. Necessary work. The dead don't mind.`,
    });
    moraleChanges.push({ amount: 2, reason: 'Prepared \u2014 cold comfort', source: 'action' });
    state.player.musketLoaded = true;
    // Accuracy bonus tracked via aimCarefullySucceeded (repurposed for Part 2)
    state.aimCarefullySucceeded = true;
  }

  // Transition to Part 2 line phase
  log.push({
    turn, type: 'narrative',
    text: `The five minutes are over. Captain Leclerc's voice: "FOURTEENTH! Form line! They're coming again!"

From the east, through the gorges of the Adige, fresh Austrian columns emerge \u2014 Vukassovich's corps, twenty thousand strong. The men who just fought through hell must now fight again.

Mass\u00e9na's attack bought time. Not victory. The battle is entering its second act.

"Present arms!"`,
  });

  // Reset enemy for Part 2
  state.battlePart = 2;
  state.scriptedVolley = 5;
  state.phase = BattlePhase.Line;
  state.chargeEncounter = 0;
  state.drillStep = DrillStep.Present;
  state.aimCarefullySucceeded = choiceId === ChargeChoiceId.ScavengeAmmo;
  state.enemy = {
    range: VOLLEY_RANGES[4], // 100 paces
    strength: 100,
    quality: 'line',
    morale: 'advancing',
    lineIntegrity: 100,
    artillery: true,
    cavalryThreat: false,
  };

  return { log, moraleChanges, healthDelta, fatigueDelta, nextEncounter: 0 };
}

// ============================================================
// GORGE ENCOUNTER (chargeEncounter = 3)
// ============================================================

function getGorgeEncounter(
  _state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  const narrative = `On the ridge above the plateau, a small figure on a grey horse. Even through the smoke and chaos, every man in the line knows who it is. Bonaparte.

He's been there since dawn, watching, calculating, moving his pieces across this frozen chessboard. Now he moves the last one.

An aide-de-camp gallops down from the ridge, horse white with lather. The orders carry down the line like fire along a powder trail:

"Every man, every gun to the ridge! The counterattack goes in NOW!"

Captain Leclerc turns to the 14th. His voice is raw, half-gone, but it carries:

"FOURTEENTH! To the ridge! We finish this!"

Around you, the survivors of two phases of hell straighten their backs. The drums change their beat \u2014 not the steady rhythm of the line, but the pas de charge. The advance.

Bonaparte is ordering the counterattack. The gorge must be sealed. And the 14th is going.`;

  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.AcceptOrder,
      label: 'To the ridge',
      description: 'Follow the captain. Follow Bonaparte. Follow the drums. One more time.',
      available: true,
    },
  ];

  return { narrative, choices };
}

function resolveGorgeChoice(
  state: BattleState
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn, type: 'action',
    text: `You shoulder your musket. Your legs move. Around you, the remnants of the 14th demi-brigade move with you \u2014 battered, bloodied, exhausted, and advancing.

The drums beat the charge. Not retreating. Not holding. Advancing.

Bonaparte watches from the ridge as his army \u2014 what is left of it \u2014 surges forward. The gorge awaits.`,
  });

  moraleChanges.push({ amount: 5, reason: 'Napoleon\'s presence \u2014 the counterattack', source: 'recovery' });

  log.push({
    turn, type: 'narrative',
    text: `The ridge. You reach it gasping, legs burning, and look down.

The gorge of the Adige opens below \u2014 a narrow defile carved through the mountains, its walls steep and unforgiving. And packed into that gorge, shoulder to shoulder, white coats crushed together like cattle in a pen: the Austrian retreat.

Thousands of them. Columns that cannot deploy, cannot form line, cannot fight. They can only push forward into the trap or try to climb walls that offer no purchase. Their officers scream orders that no one can follow.

Captain Leclerc reaches the ridge beside you. He looks down. His face is unreadable.

"FOURTEENTH! Fire at will!"

The order is not a volley command. It is permission to kill.`,
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

  return { log, moraleChanges, healthDelta: 0, fatigueDelta: 0, nextEncounter: 0 };
}

// ============================================================
// AFTERMATH ENCOUNTER (chargeEncounter = 4)
// ============================================================

function getAftermathEncounter(
  state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  const pierreAlive = state.line.leftNeighbour?.alive;
  const pierreWounded = state.line.leftNeighbour?.wounded;

  let pierreLine: string;
  if (pierreAlive && pierreWounded) {
    pierreLine = 'Pierre sits on a rock, binding his shoulder one-handed. Blood has soaked through three layers of bandage. He catches your eye and nods once. Still here.';
  } else if (pierreAlive) {
    pierreLine = 'Pierre sets down his musket and sits on a rock. He does not look down into the gorge. His hands are steady. His eyes are not.';
  } else {
    pierreLine = 'Pierre\u2019s place in the line is empty. You don\u2019t look at the spot where he fell. You can\u2019t.';
  }

  let jbLine: string;
  if (state.jbCrisisOutcome === 'steadied') {
    jbLine = 'Jean-Baptiste stands at the ridge\u2019s edge, musket grounded, staring at the gorge. He is pale but upright. Whatever you said to him during the second volley held. He made it through.';
  } else if (state.jbCrisisOutcome === 'failed' || state.jbCrisisOutcome === 'ignored') {
    jbLine = 'Jean-Baptiste sits with his back against a cairn, arms wrapped around his knees. His musket lies across his lap. He hasn\u2019t spoken since the gorge fell silent.';
  } else {
    jbLine = 'Jean-Baptiste crouches behind a tumbled stone, shaking. He made it through \u2014 somehow. That is all you can say for him.';
  }

  const batteryLine = state.batteryCharged
    ? 'Retook the battery by bayonet.'
    : 'Held the line while others charged the battery.';

  const wagonLine = state.wagonDamage >= 100
    ? 'is a smoking crater, timbers scattered across the gorge floor'
    : 'sits untouched amid the wreckage, its powder kegs intact';

  const narrative = `The gorge is silent.

Below, white flags hang from musket barrels. The ammunition wagon ${wagonLine}. The Austrian column has ceased to exist.

But the battle is not over \u2014 not everywhere. From the ridge, you hear it: the thunder of hooves on the frozen plateau. Leclerc\u2019s chasseurs \u00e0 cheval \u2014 just a few hundred horsemen \u2014 sweep into the Austrian centre like a scythe through wheat. The exhausted white-coated columns, spread out and disordered after hours of fighting, break at the first sight of cavalry.

The rout spreads faster than the horsemen can ride. Alvinczi himself \u2014 the Austrian commander who thought himself on the cusp of victory an hour ago \u2014 joins the undignified race to the rear.

Word passes down the ridge like a spark along a fuse: Lusignan\u2019s column \u2014 the force at Affi that had the whole army convinced they were surrounded \u2014 has been cut off by General Rey. They are surrendering in their thousands.

The Battle of Rivoli is won.

The 14th demi-brigade held the plateau through dawn. ${batteryLine} Endured Vukassovich\u2019s fresh columns when the right flank broke. And sealed the gorge.

${pierreLine}

${jbLine}

Captain Leclerc sheathes his sword. His hand is steady now. \u201CThe 14th will reform. Take what rest you can. We march at dusk.\u201D`;

  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.HelpWounded,
      label: 'Help the wounded',
      description: 'Descend into the gorge. Tend to Austrian wounded. Show mercy where none was asked for.',
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
      description: 'Your legs stop working. The musket slides from your fingers. You sit on the ridge and stare.',
      available: true,
    },
  ];

  return { narrative, choices };
}

function resolveAftermathChoice(
  state: BattleState, choiceId: ChargeChoiceId
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let fatigueDelta = 0;

  const pierreAlive = state.line.leftNeighbour?.alive;
  const pierreWounded = state.line.leftNeighbour?.wounded;

  if (choiceId === ChargeChoiceId.HelpWounded) {
    const mercyLine = state.gorgeMercyCount > 0
      ? '\n\nYou showed mercy on the ridge. Now you show it here. It does not undo what happened. Nothing will. But it is something.'
      : '';

    let pierreLine: string;
    if (pierreAlive) {
      pierreLine = '\n\nPierre watches you from the ridge. Says nothing. But when you climb back up, he nods. Once. That is enough.';
    } else {
      pierreLine = '\n\nWhen you climb back up, the ridge feels emptier than before. Pierre would have understood.';
    }

    log.push({
      turn, type: 'action',
      text: `You descend into the gorge.

The smell hits first \u2014 powder, blood, the animal stench of fear. Austrian wounded lie among the dead, calling in languages you don\u2019t understand. But \u201Cwater\u201D sounds the same in any tongue.

You kneel beside a man in a white coat. He flinches \u2014 then sees your canteen. His eyes fill with something you will never forget.${mercyLine}${pierreLine}`,
    });

    fatigueDelta = -10;
    moraleChanges.push({ amount: 8, reason: 'Compassion after slaughter', source: 'action' });
    state.player.reputation += 5;

  } else if (choiceId === ChargeChoiceId.FindComrades) {
    let pierreScene: string;
    if (pierreAlive && pierreWounded) {
      pierreScene = 'You find Pierre first. He\u2019s binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn\u2019t thank you. He doesn\u2019t need to. \u201CYou did well today,\u201D he says quietly. From Pierre, that\u2019s a medal.';
    } else if (pierreAlive) {
      pierreScene = 'Pierre nods when he sees you. \u201CStill standing,\u201D he says. \u201CBoth of us.\u201D He offers his canteen. You drink. The simple kindness of it nearly undoes you.';
    } else {
      pierreScene = 'You go to where Pierre fell. Someone has covered his face with his coat. You stand there for a long time. There is nothing to say. There is nothing to do. But you stand there anyway.';
    }

    let jbScene: string;
    if (state.jbCrisisOutcome === 'steadied') {
      jbScene = 'Jean-Baptiste looks up when you approach. He\u2019s afraid \u2014 of course he\u2019s afraid \u2014 but he meets your eyes. \u201CI didn\u2019t break,\u201D he says. You grip his shoulder. \u201CNo. You didn\u2019t.\u201D';
    } else {
      jbScene = 'Jean-Baptiste is staring at his hands. They\u2019re red. He doesn\u2019t know whose blood it is. \u201CI can\u2019t\u2014\u201D he starts. You grip his shoulder. \u201CIt\u2019s over. We made it.\u201D He doesn\u2019t look convinced. But he nods.';
    }

    log.push({
      turn, type: 'action',
      text: `You go looking for the living.

${pierreScene}

${jbScene}

The 14th is smaller now. The faces that are missing will never come back. But the faces that remain \u2014 they look at you, and you look at them, and something passes between you that has no name.

You survived Rivoli together. That is a bond that will never break.`,
    });

    fatigueDelta = 10;
    moraleChanges.push({ amount: 5, reason: 'Found your comrades \u2014 the bond holds', source: 'action' });
    // NPC relationship boosts
    if (state.line.leftNeighbour?.alive) {
      state.line.leftNeighbour.relationship = Math.min(100, state.line.leftNeighbour.relationship + 10);
    }
    if (state.line.rightNeighbour?.alive) {
      state.line.rightNeighbour.relationship = Math.min(100, state.line.rightNeighbour.relationship + 10);
    }

  } else if (choiceId === ChargeChoiceId.SitDown) {
    let pierreLine: string;
    if (pierreAlive) {
      pierreLine = '\n\nPierre sits beside you. Says nothing. His shoulder touches yours. That is all. That is everything.\n\nAfter a while \u2014 minutes, hours, you cannot say \u2014 his voice: \u201CTime to go, lad.\u201D You pick up your musket. You stand. You walk.';
    } else {
      pierreLine = '\n\nNo one sits beside you. Pierre would have. That thought is the one that nearly breaks you.\n\nAfter a while \u2014 minutes, hours, you cannot say \u2014 you pick up your musket. You stand. You walk. Because there is nothing else to do.';
    }

    log.push({
      turn, type: 'action',
      text: `You sit down.

Not a decision. Your legs simply stop working. The musket slides from your fingers and clatters on the frozen ground. You sit on the ridge, knees drawn up, and stare at the gorge below.

The sounds of victory wash over you \u2014 distant cheers, the cavalry horns, voices calling in triumph. None of it reaches you. Not really. You are somewhere else. Somewhere between the first volley at dawn and the last volley into the gorge.${pierreLine}`,
    });

    healthDelta = 10;
    fatigueDelta = 15;
    moraleChanges.push({ amount: 3, reason: 'Rest \u2014 the body takes what the mind cannot', source: 'action' });
  }

  // Closing narrative — all choices end the same way
  log.push({
    turn, type: 'narrative',
    text: `The drums beat assembly. The 14th reforms \u2014 what is left of it. Men fall in by habit, finding their places in a line that has too many gaps. The officers count heads. The sergeants mark the dead.

The Battle of Rivoli is over. The cost is written in the faces of the men who paid it. But the 14th held. Through dawn, through the battery, through the gorge. They held.

Whatever comes next, you will carry this day with you forever.`,
  });

  // End the battle
  state.battleOver = true;
  state.outcome = 'gorge_victory';

  return { log, moraleChanges, healthDelta, fatigueDelta, nextEncounter: 0 };
}
