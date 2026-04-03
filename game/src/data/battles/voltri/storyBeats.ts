import type { BattleState, ChargeChoice, LogEntry, MoraleChange } from '../../../types';
import { ChargeChoiceId, ChargeEncounterId, BattlePhase, MeleeContext, isVoltriExt, hasAttribute } from '../../../types';
import type { VoltriExt } from '../../../types';
import { createMeleeState, resetMeleeHistory } from '../../../core/melee';
import { rollValor } from '../../../core/morale';
import { clampStat, rollStat, displayRoll, displayTarget, Difficulty } from '../../../core/stats';
import type { StoryBeatConfig, StoryBeatResult } from '../types';

// ============================================================
// VOLTRI STORY BEATS
// ============================================================

/** Helper to safely access VoltriExt from battle state */
function getVoltriExt(state: BattleState): VoltriExt {
  if (isVoltriExt(state.ext)) return state.ext;
  // Fallback: cast with defaults (should never happen in practice)
  return state.ext as unknown as VoltriExt;
}

// --- 10: Fix Bayonets ---

const FIX_BAYONETS_NARRATIVE = (_state: BattleState): string =>
  `The Austrians are done exchanging volleys. A column of white coats surges up the slope, bayonets levelled, drums beating the charge.

Sergeant Morin's voice: "FIX BAYONETS!"

Steel rasps from scabbards. Clicks on muzzles. Your musket becomes a spear.

The man beside you curses as his hands slip. You get yours done on the first try.

They're coming up the hill. Through the olive groves. Scrambling over the stone walls. You can see their faces now.`;

function resolveFixBayonets(state: BattleState): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  log.push({
    turn,
    type: 'action',
    text: `You fix your bayonet. The steel clicks home.

The Austrian column hits the French position. Men crash into men among the olive trees and stone walls. Musket butts, bayonets, fists. The neat volley line dissolves into a dozen private battles.

You are in it now.`,
  });

  moraleChanges.push({ amount: 3, reason: 'The rush of close combat', source: 'action' });

  state.phase = BattlePhase.Melee;
  state.ext.meleeStage = 1;
  state.scriptedVolley = 0;
  state.enemy.range = 0;
  state.enemy.morale = 'charging';
  state.chargeEncounter = 0;
  resetMeleeHistory();
  state.meleeState = createMeleeState(state, MeleeContext.Skirmish, 'pegli_hills');

  const firstOpp = state.meleeState.opponents[0];
  log.push({
    turn,
    type: 'event',
    text: '\n--- SKIRMISH ---\n\nThe hilltop is chaos. Olive trees and stone walls break the fighting into knots of struggling men.',
  });
  log.push({
    turn,
    type: 'narrative',
    text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
  });

  return { log, moraleChanges, healthDelta: 0, staminaDelta: 0 };
}

// --- 11: The Line Breaks ---

const LINE_BREAKS_NARRATIVE = (_state: BattleState): string =>
  `The fighting on the hilltop sputters out. The Austrians pull back \u2014 not routed, just regrouping. But from the east, more columns are coming. Too many.

A rider gallops up from the coast road. Lieutenant Vidal reads the dispatch and his face goes blank.

"Withdrawal order. The whole garrison. Fall back to Savona."

Men are breathing hard, checking themselves for wounds they didn't feel during the fighting. The hilltop is littered with bodies \u2014 French and Austrian both.

Sergeant Morin is already moving. "Section! Form on me! We're pulling out \u2014 NOW!"

The question is how.`;

function resolveLineBreaks(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  const staminaDelta = -15;

  if (choiceId === ChargeChoiceId.FallBack) {
    log.push({
      turn,
      type: 'action',
      text: `You fall back with the section, moving quickly down the reverse slope. Sergeant Morin keeps the formation together \u2014 barely. Men stumble over the rocky ground, glancing back at the heights they're abandoning.

The coast road opens below. The company streams down toward it, joining a growing column of retreating troops. Not a rout \u2014 but close.

"Keep moving. Eyes front. We stop when Savona stops us."`,
    });
    moraleChanges.push({ amount: 3, reason: 'Orderly withdrawal \u2014 the section holds together', source: 'action' });
  } else if (choiceId === ChargeChoiceId.CoverRetreat) {
    const { success, roll, target } = rollValor(state.player.valor, -5);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You stay. Someone has to. [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

You crouch behind a stone wall with a handful of others, firing at the Austrian skirmishers while the company withdraws. The balls crack overhead. You reload, fire, reload. Mechanical. Necessary.

When you finally pull back, the section is already on the coast road. Sergeant Morin gives you a look that might be respect.`,
      });
      moraleChanges.push({ amount: 5, reason: 'Covered the retreat \u2014 courage under fire', source: 'action' });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You try to stay. [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

You crouch behind the wall, but when the Austrian fire intensifies, your nerve breaks. You scramble back down the slope faster than you intended, tripping over roots, skinning your palms on the rocks.

You reach the road bruised and winded. No one noticed your failure. Small mercy.`,
      });
      moraleChanges.push({ amount: -2, reason: 'Tried to cover the retreat \u2014 nerve failed', source: 'action' });
      healthDelta = -8;
    }
  }

  // Transition to Coastal Road
  state.chargeEncounter = ChargeEncounterId.VoltriCoastalRoad;

  return { log, moraleChanges, healthDelta, staminaDelta };
}

// --- 12: The Coastal Road (Reworked — branching point) ---

const COASTAL_ROAD_NARRATIVE = (state: BattleState): string => {
  const ext = getVoltriExt(state);
  const felixName = ext.felixMet ? 'Felix Martel' : 'a soldier';
  return `Night falls on the Ligurian coast. The column staggers west along the corniche road \u2014 a narrow track carved between the mountains and the sea.

No lights. No drums. The officers have forbidden both. The Austrians are somewhere behind, and nobody wants to find out how close.

Men stumble in the dark. Equipment clatters. Someone falls and curses. The road is rutted, broken, treacherous in the blackness.

Ahead of you, ${felixName} has collapsed at the roadside. His pack is still on. He might be sleeping. He might be done.`;
};

function resolveCoastalRoad(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;
  const ext = getVoltriExt(state);
  const felixName = ext.felixMet ? 'Felix' : 'the man';

  if (choiceId === ChargeChoiceId.HelpStragglers) {
    const { success, roll, target } = rollStat(state.player.constitution, 0, Difficulty.Standard);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You grab ${felixName}'s arm and haul him up. He's heavy \u2014 dead weight at first, then his legs find the rhythm. [Constitution: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

"Merci," he mumbles. You half-carry him for the next mile until he can manage on his own.

But the column is pulling ahead. By the time you look up, the last man has disappeared around a bend in the road. You've fallen behind. The darkness swallows the coast road ahead and behind.

You're on your own.`,
      });
      state.player.soldierRep = clampStat(state.player.soldierRep + 2);
      staminaDelta = -10;
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You try to haul him up, but your own legs are giving out. [Constitution: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

The effort costs you. Your calves cramp. You stagger, nearly go down yourself. But you grit your teeth and drag ${felixName} upright by sheer stubbornness.

It takes too long. The column moves on without you. The sounds of marching feet fade into the darkness ahead. You're separated.`,
      });
      staminaDelta = -20;
      healthDelta = -5;
    }

    // Set separation — player falls behind the column
    ext.separated = true;
    // Transition to Wounded Soldier (Felix is the straggler they helped)
    state.chargeEncounter = ChargeEncounterId.VoltriWoundedSoldier;

  } else if (choiceId === ChargeChoiceId.KeepMoving) {
    log.push({
      turn,
      type: 'action',
      text: `You step around ${felixName}. Don't look down. Don't stop. If you stop, you'll be the next one sitting at the roadside.

The column grinds on. Behind you, someone else helps the straggler. Or doesn't. You don't look back.`,
    });
    moraleChanges.push({ amount: -2, reason: 'Left a comrade behind \u2014 necessary but cold', source: 'action' });

    // Column path — unchanged
    state.chargeEncounter = ChargeEncounterId.VoltriCavalryScare;
  }

  return { log, moraleChanges, healthDelta, staminaDelta };
}

// --- 13: Cavalry Scare (column path only) ---

const CAVALRY_SCARE_NARRATIVE = (_state: BattleState): string =>
  `A sound in the darkness. Hooves.

The word ripples down the column like a shiver: "Cavalry. Uhlans."

Everyone freezes. The coastal road offers no cover \u2014 just cliff on one side, sea on the other. If it's a cavalry patrol, there is nowhere to run.

Shapes move in the darkness ahead. The click of bridles. The creak of saddle leather.

Sergeant Morin's voice, barely a whisper: "Form a group. Stay together. If they charge, present bayonets."`;

function resolveCavalryScare(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;

  if (choiceId === ChargeChoiceId.StandFirm) {
    const { success, roll, target } = rollValor(state.player.valor, 0);

    if (success) {
      log.push({
        turn,
        type: 'action',
        text: `You stand. Bayonet out. Breathing controlled. [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

The shapes in the darkness resolve into... a mule train. Supply animals, not cavalry. Someone's mule brays. The tension breaks like a fever.

"False alarm," Morin mutters. But he saw you standing firm. That matters.`,
      });
      moraleChanges.push({ amount: 5, reason: 'Stood firm in the dark \u2014 false alarm, but real courage', source: 'action' });
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You try to stand firm, but your legs betray you. [Valor: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

You stumble backward in the dark, trip over a root, go down hard on the rocky ground. Your knee hits stone. Pain shoots up your leg.

The "cavalry" turns out to be a mule train. Supply animals. You pick yourself up, wincing, hoping no one saw.`,
      });
      moraleChanges.push({ amount: -3, reason: 'Nerve failed in the dark', source: 'action' });
      healthDelta = -6;
    }
  } else if (choiceId === ChargeChoiceId.ScatterAndHide) {
    log.push({
      turn,
      type: 'action',
      text: `You dive off the road, pressing yourself flat against the hillside. Rocks dig into your ribs. You hold your breath.

The shapes pass. A mule brays. It's a supply train, not Uhlans. You crawl back to the road, dirt on your face, feeling foolish.

Morin shakes his head. "Next time, hold your ground."`,
    });
    moraleChanges.push({ amount: -2, reason: 'Scattered and hid \u2014 it was nothing', source: 'action' });
    state.player.soldierRep = clampStat(state.player.soldierRep - 1);
  }

  // Transition to Dawn at Savona
  state.chargeEncounter = ChargeEncounterId.VoltriDawnSavona;

  return { log, moraleChanges, healthDelta, staminaDelta: 0 };
}

// --- 15: Wounded Soldier (separation path — first beat) ---

const WOUNDED_SOLDIER_NARRATIVE = (state: BattleState): string => {
  const ext = getVoltriExt(state);
  const name = ext.felixMet ? 'Felix' : 'The man';
  return `You stumble on through the darkness, supporting the straggler. After a mile, he collapses again. This time he doesn't get up easily.

In the faint starlight, you see it \u2014 blood, dark and wet, soaking through his trouser leg. A wound from the hilltop fighting, ignored in the chaos of retreat. Now the leg is swelling, the blood still coming.

${name} looks up at you. ${ext.felixMet ? '"Bad luck, eh?" he says through gritted teeth. "Should have stayed with the cards."' : '"Help me," he whispers. "Please."'}

The column is gone. The road is empty. It's just you and a bleeding man on a dark coast road.`;
};

function resolveWoundedSoldier(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;
  let virtueChange = 0;
  const ext = getVoltriExt(state);
  const name = ext.felixMet ? 'Felix' : 'the soldier';

  if (choiceId === ChargeChoiceId.TendWoundsVoltri) {
    const hasMedicine = hasAttribute(state.player, 'medicine');
    const autoPass = hasMedicine;
    const { success, roll, target } = rollStat(state.player.constitution, 0, Difficulty.Standard);
    const passed = autoPass || success;

    if (passed) {
      log.push({
        turn,
        type: 'action',
        text: autoPass
          ? `You know what to do. Tourniquet above the wound. Strip of shirt for a bandage. Pressure, steady pressure. ${name === 'Felix' ? 'Felix' : 'The man'} hisses but holds still. The bleeding slows.`
          : `You do what you can \u2014 tear a strip from your shirt, bind the wound, tie it tight. [Constitution: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

The bleeding slows. ${name === 'Felix' ? 'Felix' : 'The man'} lets out a breath. "Not bad," he manages. "For an amateur."`,
      });
      ext.felixTendScore += 2;
      moraleChanges.push({ amount: 3, reason: 'Tended a wounded comrade', source: 'action' });
      staminaDelta = -5;
      virtueChange = 5;
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You try to bind the wound but your hands are shaking. The makeshift bandage is loose, sloppy. [Constitution: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

The bleeding continues, slower maybe, but still there. It will have to do. You've done what you can.`,
      });
      staminaDelta = -10;
      virtueChange = 3;
    }

    // Transition to canteen choice
    state.chargeEncounter = ChargeEncounterId.VoltriWoundedCanteen;

  } else if (choiceId === ChargeChoiceId.LeaveWounded) {
    log.push({
      turn,
      type: 'action',
      text: `You look at the wound, look at the empty road ahead. You can't carry him. You can barely carry yourself.

"I'm sorry," you say. ${ext.felixMet ? 'Felix stares at you. He doesn\'t say anything. He doesn\'t need to.' : 'The man stares at you. He doesn\'t say anything. He doesn\'t need to.'}

You walk away. The darkness takes him. You don't look back.`,
    });
    moraleChanges.push({ amount: -5, reason: 'Left a wounded man to die', source: 'action' });
    virtueChange = -10;
    ext.felixSurvived = false;

    // Skip canteen, go to homestead
    state.chargeEncounter = ChargeEncounterId.VoltriHomestead;
  }

  return { log, moraleChanges, healthDelta, staminaDelta, virtueChange };
}

// --- 17: Wounded Canteen (separation path — second beat) ---

const WOUNDED_CANTEEN_NARRATIVE = (state: BattleState): string => {
  const ext = getVoltriExt(state);
  const name = ext.felixMet ? 'Felix' : 'The soldier';
  return `${name} is pale. The wound is bound but the march has taken its toll. He needs water.

You check your canteen. ${state.player.canteenUses > 0 ? 'There\'s water left \u2014 not much, but some.' : 'It\'s empty.'}`;
};

function resolveWoundedCanteen(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let virtueChange = 0;
  const ext = getVoltriExt(state);
  const name = ext.felixMet ? 'Felix' : 'the soldier';

  if (choiceId === ChargeChoiceId.ShareCanteen) {
    log.push({
      turn,
      type: 'action',
      text: `You tip the canteen to ${name}'s lips. He drinks \u2014 not greedily, just enough. His colour improves slightly. "You're a good man," he says quietly.`,
    });
    state.player.canteenUses = Math.max(0, state.player.canteenUses - 1);
    ext.felixTendScore += 1;
    moraleChanges.push({ amount: 2, reason: 'Shared water with a wounded comrade', source: 'action' });
    virtueChange = 3;
  } else {
    // ConserveSupplies
    log.push({
      turn,
      type: 'action',
      text: `You shake the canteen. ${state.player.canteenUses > 0 ? 'There\'s water, but you might need it yourself before this night is over. You cap it and put it away.' : 'Empty. Nothing to share even if you wanted to.'} ${ext.felixMet ? 'Felix' : 'The soldier'} says nothing, but his eyes follow the canteen.`,
    });
    moraleChanges.push({ amount: -1, reason: 'Conserved supplies', source: 'action' });
  }

  // Determine Felix survival based on accumulated score
  // Score >= 2: survives | Score 1: 50/50 | Score 0: dead
  if (ext.felixTendScore >= 2) {
    ext.felixSurvived = true;
  } else if (ext.felixTendScore === 1) {
    ext.felixSurvived = Math.random() > 0.5;
  } else {
    ext.felixSurvived = false;
  }

  if (ext.felixSurvived) {
    log.push({
      turn,
      type: 'narrative',
      text: `${ext.felixMet ? 'Felix' : 'The soldier'} manages to stand, leaning on you. The wound is bad but not fatal \u2014 not yet. Together, you limp on through the darkness.`,
    });
  } else {
    log.push({
      turn,
      type: 'narrative',
      text: `${ext.felixMet ? 'Felix' : 'The soldier'}'s head drops. His breathing goes shallow, then stops. You sit with him for a moment in the dark. Then you close his eyes and walk on alone.`,
    });
    moraleChanges.push({ amount: -3, reason: 'A man died on the road', source: 'event' });
  }

  // Transition to Homestead
  state.chargeEncounter = ChargeEncounterId.VoltriHomestead;

  return { log, moraleChanges, healthDelta: 0, staminaDelta: 0, virtueChange };
}

// --- 16: The Homestead (separation path) ---

const HOMESTEAD_NARRATIVE = (state: BattleState): string => {
  const ext = getVoltriExt(state);
  const felixClause = ext.felixSurvived
    ? (ext.felixMet ? ' Felix is fading beside you \u2014 he needs rest, shelter, anything.' : ' The wounded man beside you is fading \u2014 he needs rest, shelter, anything.')
    : '';

  return `You see a light. Not much \u2014 just a glow through shuttered windows, up the hillside from the road. A farmstead, tucked into the coastal hills. Smoke from a chimney.${felixClause}

The road stretches on into the darkness. Savona is still miles away.`;
};

function resolveHomestead(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;
  let virtueChange = 0;
  const ext = getVoltriExt(state);

  if (ext.ligurianGirlSaved) {
    // ── FRIENDLY PATH ──
    if (choiceId === ChargeChoiceId.RestHere) {
      log.push({
        turn,
        type: 'action',
        text: `You approach the farmstead. A man opens the door with a fowling piece, then a girl appears behind him. She looks at you \u2014 and recognition crosses her face. The lemon seller from camp.

She speaks rapidly in Ligurian. The man lowers the gun. "Come in," she says in halting French. "Come in."

They feed you. Hot soup, bread that isn't mouldy, wine that hasn't been watered. You sit by the fire and the warmth seeps into your bones.${ext.felixSurvived ? '\n\nThey tend ' + (ext.felixMet ? 'Felix' : 'the soldier') + ' too \u2014 proper bandages, clean water, a poultice of herbs. He sleeps by the fire, breathing easier.' : ''}

You sleep deeply. When dawn comes, the girl's father points you toward the Savona road and presses a heel of bread into your hand.`,
      });
      healthDelta = 15;
      staminaDelta = 20;
      moraleChanges.push({ amount: 5, reason: 'Rest and kindness \u2014 a debt repaid', source: 'action' });
    } else {
      // MoveOnAtDawn
      log.push({
        turn,
        type: 'action',
        text: `You approach the farmstead. The girl recognises you and they take you in, but you don't stay long. A few hours of rest, a cup of soup, and you're on your feet again.

"You should sleep," she says. But you shake your head. The army is at Savona. That's where you need to be.${ext.felixSurvived ? '\n\n' + (ext.felixMet ? 'Felix' : 'The soldier') + ' stays. He can barely walk. The family will look after him.' : ''}

You slip out before first light, the coast road grey and empty ahead.`,
      });
      healthDelta = 5;
      staminaDelta = 8;
      moraleChanges.push({ amount: 3, reason: 'Brief rest \u2014 duty calls', source: 'action' });
    }
  } else {
    // ── HOSTILE PATH ──
    if (choiceId === ChargeChoiceId.ApproachHomestead) {
      const { success, roll, target } = rollStat(state.player.charisma, 0, Difficulty.Standard);

      if (success) {
        log.push({
          turn,
          type: 'action',
          text: `You approach the door. An armed man opens it \u2014 fowling piece levelled at your chest. "No soldiers," he says in broken French.

You raise your hands. Talk slowly. You're not here to take anything. [Charisma: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 passed]

Something in your voice \u2014 exhaustion, maybe, or honesty \u2014 makes him lower the gun. "One night," he says. "Then you go."

He lets you sleep in the kitchen. Grudging hospitality, but hospitality all the same.${ext.felixSurvived ? ' ' + (ext.felixMet ? 'Felix' : 'The soldier') + ' gets a blanket by the hearth.' : ''}`,
        });
        healthDelta = 8;
        staminaDelta = 12;
        moraleChanges.push({ amount: 3, reason: 'Grudging shelter \u2014 better than the road', source: 'action' });
      } else {
        log.push({
          turn,
          type: 'action',
          text: `You approach the door. An armed man opens it \u2014 fowling piece levelled at your chest. "No soldiers," he says.

You try to talk your way in. [Charisma: ${displayRoll(roll)} vs ${displayTarget(target)} \u2014 failed]

He doesn't budge. "Go." The door shuts. You hear the bar drop.

You shelter against the lee of a stone wall nearby. Cold, exposed, but at least the wind is blocked.${ext.felixSurvived ? ' You and ' + (ext.felixMet ? 'Felix' : 'the soldier') + ' huddle together for warmth. It barely helps.' : ''}`,
        });
        staminaDelta = -5;
        moraleChanges.push({ amount: -2, reason: 'Turned away \u2014 a cold night', source: 'action' });
      }
    } else if (choiceId === ChargeChoiceId.ShelterInBarn) {
      log.push({
        turn,
        type: 'action',
        text: `You skirt around the farmstead and find a barn. The door isn't locked. Inside: straw, the smell of animals, relative warmth.

You collapse into the straw. Not comfortable, but out of the wind and hidden from the road.${ext.felixSurvived ? ' ' + (ext.felixMet ? 'Felix' : 'The soldier') + ' lies beside you, breathing rough but steady.' : ''}

You sleep in snatches, waking at every sound. Dawn finds you stiff and cold, but alive.`,
      });
      staminaDelta = 3;
      moraleChanges.push({ amount: 1, reason: 'Rough shelter \u2014 better than nothing', source: 'action' });
    } else {
      // AvoidHomestead
      log.push({
        turn,
        type: 'action',
        text: `You look at the light in the window and keep walking. Soldiers aren't welcome at farmsteads. Not at night. Not in wartime.

The road stretches on. Your legs ache. Your eyes burn.${ext.felixSurvived ? ' ' + (ext.felixMet ? 'Felix' : 'The soldier') + ' stumbles beside you, each step a labour.' : ''} The darkness seems endless.`,
      });
      staminaDelta = -10;
      moraleChanges.push({ amount: -3, reason: 'Kept walking through the night \u2014 brutal', source: 'action' });
    }
  }

  // Transition to Dawn at Savona
  state.chargeEncounter = ChargeEncounterId.VoltriDawnSavona;

  return { log, moraleChanges, healthDelta, staminaDelta, virtueChange };
}

// --- 14: Dawn at Savona (dual-path) ---

const DAWN_SAVONA_NARRATIVE = (state: BattleState): string => {
  const ext = getVoltriExt(state);

  if (ext.separated) {
    const felixClause = ext.felixSurvived
      ? (ext.felixMet ? ' Felix limps beside you, pale but alive.' : ' The wounded soldier limps beside you, pale but alive.')
      : '';
    return `Dawn. The sea is grey. The mountains are grey. Everything is grey.

Savona appears around a headland \u2014 walls, towers, the promise of rest. You stumble the last mile alone.${felixClause}

You arrive hours after the main body. The garrison stares at you \u2014 a straggler, uniform torn, eyes hollow. Sergeant Morin finds you at the gate. His face shifts from anger to relief.

"Where the hell have you been?"

What do you do?`;
  }

  return `Dawn. The sea is grey. The mountains are grey. Everything is grey.

Savona appears around a headland \u2014 walls, towers, the promise of rest. The column stumbles the last mile in silence.

The men around you are hollow-eyed, boots bloody, uniforms torn. Some are carrying others. Some are just carrying themselves.

The gates open. The garrison stares at the ragged column filing through. Forty kilometres. One battle. One night. Every man who walks through those gates has earned the right to collapse.

What do you do?`;
};

function resolveDawnSavona(
  state: BattleState,
  choiceId: ChargeChoiceId,
): StoryBeatResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;
  const ext = getVoltriExt(state);

  if (choiceId === ChargeChoiceId.CollapseAndSleep) {
    if (ext.separated) {
      log.push({
        turn,
        type: 'action',
        text: `Morin takes one look at you and doesn't ask questions. "Get some rest, soldier. We'll sort it out later."

You find a wall. You sit down. You don't remember lying down, but you must have, because the next thing you know it's afternoon and someone is shaking your shoulder.

"Rations," says a voice. You eat without tasting. Then you sleep again.${ext.felixSurvived ? '\n\nWhen you wake, someone tells you ' + (ext.felixMet ? 'Felix' : 'the man you brought in') + ' is with the surgeons. He\'ll live. The men are surprised to see him alive.' : ''}`,
      });
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You find a wall. You sit down. You don't remember lying down, but you must have, because the next thing you know it's midday and someone is shaking your shoulder.

"Rations," says a voice. You eat without tasting. You drink without thinking. Then you sleep again.

When you finally wake properly, your body aches in places you didn't know existed. But you're alive. You're in Savona. The war goes on.`,
      });
    }
    healthDelta = 10;
    staminaDelta = 20;
    moraleChanges.push({ amount: 3, reason: 'Rest \u2014 the body takes what the mind cannot', source: 'action' });
  } else if (choiceId === ChargeChoiceId.FindYourUnit) {
    if (ext.separated) {
      log.push({
        turn,
        type: 'action',
        text: `"I fell behind helping a wounded man, Sergeant. I'm here to report."

Morin studies you for a long moment. Then he marks you present. "You came in hours late, carrying a wounded soldier, after forty kilometres on the coast road in the dark." He pauses. "That's either very brave or very stupid. I'll decide which later."

Lieutenant Vidal nods when he sees you. "The 14th held together \u2014 even its stragglers. That matters. Remember it."${ext.felixSurvived ? '\n\nThe men gather around when they hear about ' + (ext.felixMet ? 'Felix' : 'the man you carried') + '. Someone you barely know claps you on the back. "Good man," he says.' : ''}`,
      });
      state.player.soldierRep = clampStat(state.player.soldierRep + 3);
      state.player.officerRep = clampStat(state.player.officerRep + 2);
    } else {
      log.push({
        turn,
        type: 'action',
        text: `You force yourself to keep moving. Find the section. Report to Sergeant Morin. Account for yourself.

It takes an hour to find the company assembly point. Morin is already counting heads, checking equipment, doing the sergeant's work that never ends.

"Here, Sergeant."

He marks you present. "Good man," he says. Two words. They mean everything.

Lieutenant Vidal nods when he sees you. "The 14th held together on the march. That matters. Remember it."`,
      });
      state.player.soldierRep = clampStat(state.player.soldierRep + 2);
      state.player.officerRep = clampStat(state.player.officerRep + 2);
    }
  }

  // Close the battle
  log.push({
    turn,
    type: 'narrative',
    text: `The garrison reassembles over the next two days. The 14th is battered but intact. Voltri is lost, but the army survives.

Word comes down from headquarters: General Bonaparte is concentrating the army. Something is planned. Something big.

The campaign is about to begin.`,
  });

  state.battleOver = true;
  state.outcome = 'survived';

  return { log, moraleChanges, healthDelta, staminaDelta };
}

// ============================================================
// VOLTRI STORY BEATS — assembled config records
// ============================================================

export const VOLTRI_STORY_BEATS: Record<number, StoryBeatConfig> = {
  [ChargeEncounterId.VoltriFixBayonets]: {
    id: ChargeEncounterId.VoltriFixBayonets,
    getNarrative: FIX_BAYONETS_NARRATIVE,
    getChoices: (_state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.VoltriFixBayonets,
        label: 'Fix bayonets',
        description: 'Steel on steel. They\'re coming up the hill.',
        available: true,
      },
    ],
    resolveChoice: resolveFixBayonets,
  },
  [ChargeEncounterId.VoltriLineBreaks]: {
    id: ChargeEncounterId.VoltriLineBreaks,
    getNarrative: LINE_BREAKS_NARRATIVE,
    getChoices: (_state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.FallBack,
        label: 'Fall back with section',
        description: 'Orderly retreat. Stay with Morin and the others. Get off this hill alive.',
        available: true,
      },
      {
        id: ChargeChoiceId.CoverRetreat,
        label: 'Cover the retreat',
        description: 'Stay behind and fire at the Austrian skirmishers while the company withdraws. [Valor check]',
        available: true,
      },
    ],
    resolveChoice: resolveLineBreaks,
  },
  [ChargeEncounterId.VoltriCoastalRoad]: {
    id: ChargeEncounterId.VoltriCoastalRoad,
    getNarrative: COASTAL_ROAD_NARRATIVE,
    getChoices: (_state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.HelpStragglers,
        label: 'Help the straggler',
        description: 'Haul him up. No one gets left behind on this road. [Constitution check]',
        available: true,
      },
      {
        id: ChargeChoiceId.KeepMoving,
        label: 'Keep moving',
        description: 'If you stop, you might not start again. Someone else will help him.',
        available: true,
      },
    ],
    resolveChoice: resolveCoastalRoad,
  },
  [ChargeEncounterId.VoltriCavalryScare]: {
    id: ChargeEncounterId.VoltriCavalryScare,
    getNarrative: CAVALRY_SCARE_NARRATIVE,
    getChoices: (_state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.StandFirm,
        label: 'Stand firm',
        description: 'Present your bayonet and hold your ground. Whatever comes out of the dark. [Valor check]',
        available: true,
      },
      {
        id: ChargeChoiceId.ScatterAndHide,
        label: 'Scatter and hide',
        description: 'Get off the road. Press flat. Let the cavalry pass.',
        available: true,
      },
    ],
    resolveChoice: resolveCavalryScare,
  },
  [ChargeEncounterId.VoltriWoundedSoldier]: {
    id: ChargeEncounterId.VoltriWoundedSoldier,
    getNarrative: WOUNDED_SOLDIER_NARRATIVE,
    getChoices: (_state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.TendWoundsVoltri,
        label: 'Tend his wounds',
        description: 'Do what you can. Bind the leg, slow the bleeding. [Constitution check]',
        available: true,
      },
      {
        id: ChargeChoiceId.LeaveWounded,
        label: 'Leave him',
        description: 'You can\'t carry him. You can barely carry yourself. Walk away.',
        available: true,
      },
    ],
    resolveChoice: resolveWoundedSoldier,
  },
  [ChargeEncounterId.VoltriWoundedCanteen]: {
    id: ChargeEncounterId.VoltriWoundedCanteen,
    getNarrative: WOUNDED_CANTEEN_NARRATIVE,
    getChoices: (state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.ShareCanteen,
        label: 'Share your canteen',
        description: state.player.canteenUses > 0
          ? 'Give him water. He needs it more than you.'
          : 'Your canteen is empty.',
        available: state.player.canteenUses > 0,
      },
      {
        id: ChargeChoiceId.ConserveSupplies,
        label: 'Conserve supplies',
        description: 'You might need that water yourself before this night is over.',
        available: true,
      },
    ],
    resolveChoice: resolveWoundedCanteen,
  },
  [ChargeEncounterId.VoltriHomestead]: {
    id: ChargeEncounterId.VoltriHomestead,
    getNarrative: HOMESTEAD_NARRATIVE,
    getChoices: (state: BattleState): ChargeChoice[] => {
      const ext = getVoltriExt(state);
      if (ext.ligurianGirlSaved) {
        return [
          {
            id: ChargeChoiceId.RestHere,
            label: 'Rest here',
            description: 'Accept their hospitality. Sleep. Heal.',
            available: true,
          },
          {
            id: ChargeChoiceId.MoveOnAtDawn,
            label: 'Move on at first light',
            description: 'A brief rest, then back to the road. The army is at Savona.',
            available: true,
          },
        ];
      }
      return [
        {
          id: ChargeChoiceId.ApproachHomestead,
          label: 'Approach the farmstead',
          description: 'Knock on the door. Ask for shelter. [Charisma check]',
          available: true,
        },
        {
          id: ChargeChoiceId.ShelterInBarn,
          label: 'Shelter in the barn',
          description: 'Don\'t bother the family. Find the outbuildings.',
          available: true,
        },
        {
          id: ChargeChoiceId.AvoidHomestead,
          label: 'Keep walking',
          description: 'Soldiers aren\'t welcome at farmsteads. Keep moving.',
          available: true,
        },
      ];
    },
    resolveChoice: resolveHomestead,
  },
  [ChargeEncounterId.VoltriDawnSavona]: {
    id: ChargeEncounterId.VoltriDawnSavona,
    getNarrative: DAWN_SAVONA_NARRATIVE,
    getChoices: (_state: BattleState): ChargeChoice[] => [
      {
        id: ChargeChoiceId.CollapseAndSleep,
        label: 'Collapse and sleep',
        description: 'Find a wall. Sit down. Let the exhaustion take you.',
        available: true,
      },
      {
        id: ChargeChoiceId.FindYourUnit,
        label: 'Find your unit',
        description: 'Report to Sergeant Morin. Account for yourself. Do the soldier\'s duty.',
        available: true,
      },
    ],
    resolveChoice: resolveDawnSavona,
  },
};
