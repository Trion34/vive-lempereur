import type { CampEvent, CampState, CampLogEntry, CampActivityResult, PlayerCharacter, NPC } from '../../../types';
import { CampEventCategory, hasAttribute } from '../../../types';
import type { ForcedEventConfig } from '../../campaigns/types';
import { rollStat } from '../../../core/stats';

// ============================================================
// VOLTRI CAMP CONFIG — Garrison at Voltri, April 1796
// ============================================================

export const VOLTRI_CAMP_META = {
  location: 'Garrison at Voltri',
  weather: 'clear' as const,
  supplyLevel: 'scarce' as const,
  actionsTotal: 12,
  context: 'garrison' as const,
  openingNarrative:
    'The 14th demi-brigade holds garrison at Voltri, a fishing town on the Ligurian coast west of Genoa. The army is starving, the pay is months late, and the new general \u2014 Bonaparte \u2014 has yet to prove himself. But the coast is beautiful, and for the moment, no one is shooting at you.',
};

// ============================================================
// EVENT BUILDERS
// ============================================================

function getGamblingInvitationEvent(): CampEvent {
  return {
    id: 'voltri_gambling_invitation',
    category: CampEventCategory.Interpersonal,
    title: 'The Passe-Dix Game',
    narrative:
      'Evening. A knot of soldiers crowds around a blanket spread in the dirt behind the cookfires. Dice clatter. Coins change hands. In the middle of it all sits a man you\u2019ve seen around camp \u2014 Felix Martel, a former musician with quick hands and a quicker smile. He\u2019s running the table and enjoying every minute.\n\nHe catches your eye. "Room for one more, friend. Two sous to play. The dice don\u2019t care about rank."',
    choices: [
      {
        id: 'join_game',
        label: 'Join the game',
        description: 'Sit down, put your money in, roll the dice. [Costs 2 sous]',
        locked: false,
      },
      {
        id: 'watch',
        label: 'Watch',
        description: 'Stand at the edge. Learn how Felix works before risking your money.',
      },
      {
        id: 'decline',
        label: 'Decline',
        description: 'Walk away. You didn\u2019t survive this long by gambling.',
      },
    ],
    resolved: false,
  };
}

function getCoastAtNightEvent(player: PlayerCharacter): CampEvent {
  const literate = hasAttribute(player, 'literate');
  return {
    id: 'voltri_coast_at_night',
    category: CampEventCategory.Interpersonal,
    title: 'The Coast at Night',
    narrative:
      'You slip away from the camp after supper and walk down to the shore. The Mediterranean stretches out before you, black and silver under the stars. Its beauty a stark contrast to the miserable soldier\u2019s life you\u2019re growing accustomed to.',
    choices: [
      {
        id: 'write_letter',
        label: 'Write a letter home',
        description: literate
          ? 'Find the words, if you can. Put something down before you forget how this feels.'
          : 'You never learned your letters.',
        locked: !literate,
      },
      {
        id: 'watch_sea',
        label: 'Watch the sea',
        description: 'Stay here a while. Let the quiet settle into you.',
      },
    ],
    resolved: false,
  };
}

function getLigurianGirlEvent(): CampEvent {
  return {
    id: 'voltri_ligurian_girl',
    category: CampEventCategory.Interpersonal,
    title: 'The Ligurian Girl',
    narrative:
      'A girl from the town appears at the edge of camp with a basket of lemons. Dark hair, olive skin, a face that would turn heads even if the men weren\u2019t starving for more than food. She\u2019s trying to sell them \u2014 a few sous each, probably her family\u2019s only income. A big corporal named Gros approaches her. He\u2019s smiling, but it\u2019s the wrong kind of smile. He puts a hand on her arm. She tries to pull away. The men nearby look at the ground.',
    choices: [
      {
        id: 'step_in',
        label: 'Step in',
        description: 'Tell him to let her go. [Charisma check]',
        statCheck: { stat: 'charisma', difficulty: 0 },
      },
      {
        id: 'fetch_morin',
        label: 'Fetch Sergeant Morin',
        description: 'Find Morin. He\u2019ll put a stop to this. [Endurance check]',
        statCheck: { stat: 'endurance', difficulty: 0 },
      },
      {
        id: 'look_away',
        label: 'Look away',
        description: 'It\u2019s not your problem. Keep your head down.',
      },
    ],
    resolved: false,
  };
}

function getGenoeseMerchantEvent(): CampEvent {
  return {
    id: 'voltri_genoese_merchant',
    category: CampEventCategory.Supply,
    title: 'The Genoese Merchant',
    narrative:
      'A local merchant appears at the edge of camp, mule loaded with bread, cheese, and wine. The prices are outrageous \u2014 three times what they should be. He knows you\'re starving and he doesn\'t care. Half the section is already reaching for their purses.',
    choices: [
      {
        id: 'spot_cheating',
        label: 'Check the goods',
        description: 'Something about those sacks doesn\'t look right. [Awareness check]',
        statCheck: { stat: 'awareness', difficulty: 0 },
      },
      {
        id: 'haggle',
        label: 'Haggle him down',
        description: 'Talk the price down. Make him earn his profit. [Charisma check]',
        statCheck: { stat: 'charisma', difficulty: 0 },
      },
    ],
    resolved: false,
  };
}

function getTheftOpportunityEvent(): CampEvent {
  return {
    id: 'voltri_theft_opportunity',
    category: CampEventCategory.Interpersonal,
    title: 'An Opportunity',
    narrative:
      'Felix catches your arm after evening roll call, pulling you into the shadow of a supply wagon. His usual grin is thinner than usual \u2014 more calculating.\n\n"I\u2019ve been watching the officer\u2019s reserve stores. Vidal keeps the key on his belt, but tonight he\u2019s drinking with the captain from the 32nd. The lock is nothing. I need someone to keep watch."\n\nHe holds your gaze. "Equal shares. Enough bread and wine for a week. What do you say?"',
    choices: [
      {
        id: 'join_theft',
        label: 'Keep watch',
        description: 'Stand guard while Felix works the lock. Equal shares. [Awareness check]',
        statCheck: { stat: 'awareness', difficulty: 0 },
      },
      {
        id: 'refuse',
        label: 'Refuse',
        description: 'Shake your head. You\u2019re not a thief. Not yet.',
      },
    ],
    resolved: false,
  };
}

// ============================================================
// EVENT OUTCOME RESOLVERS
// ============================================================

function resolveGamblingInvitationOutcome(
  player: PlayerCharacter,
  npcs: NPC[],
  choiceId: string,
  _checkPassed: boolean,
  day: number,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const npcChanges: { npcId: string; relationship: number }[] = [];
  const felix = npcs.find((n) => n.id === 'felix');

  if (choiceId === 'join_game') {
    if (player.sous < 2) {
      log.push({ day, type: 'result', text: 'You reach for your purse and find it empty. Felix shrugs. "Next time, friend." The game goes on without you.' });
      return { log, statChanges: {}, staminaChange: 0, moraleChange: -1 };
    }
    const won = Math.random() > 0.5;
    if (won) {
      log.push({
        day,
        type: 'result',
        text: 'You sit down and put your sous in the pot. The dice are kind tonight \u2014 or maybe Felix lets you win. You walk away with heavier pockets and a new acquaintance. Felix claps your shoulder. "Lucky man. Come back any time."',
      });
      if (felix) npcChanges.push({ npcId: 'felix', relationship: 10 });
      return { log, statChanges: { soldierRep: 1 }, staminaChange: 0, moraleChange: 3, sousChange: 3, npcChanges, flagChanges: { gambling_accepted: true } };
    } else {
      log.push({
        day,
        type: 'result',
        text: 'You sit down, put your sous in \u2014 and watch them disappear. Felix has that look, the one that says he knew exactly how the dice would fall. "Better luck next time," he says, already counting his winnings. You walk away lighter in the purse but richer in understanding: never trust a musician with dice.',
      });
      if (felix) npcChanges.push({ npcId: 'felix', relationship: 5 });
      return { log, statChanges: {}, staminaChange: 0, moraleChange: -1, sousChange: -2, npcChanges, flagChanges: { gambling_accepted: true } };
    }
  } else if (choiceId === 'watch') {
    log.push({
      day,
      type: 'result',
      text: 'You stand at the edge and watch Felix work. He\u2019s good \u2014 quick hands, easy patter, always knows when to let someone win just enough to keep them playing. He catches your eye once and winks. You file the observation away for later.',
    });
    if (felix) npcChanges.push({ npcId: 'felix', relationship: 3 });
    return { log, statChanges: {}, staminaChange: 0, moraleChange: 1, npcChanges, flagChanges: { gambling_accepted: true } };
  } else {
    log.push({
      day,
      type: 'result',
      text: 'You shake your head and walk on. Felix shrugs \u2014 no offence taken. "Your loss, friend." The dice rattle behind you as you go.',
    });
    return { log, statChanges: {}, staminaChange: 0, moraleChange: 0 };
  }
}

function resolveCoastAtNightOutcome(
  _player: PlayerCharacter,
  _npcs: NPC[],
  choiceId: string,
  _checkPassed: boolean,
  day: number,
): CampActivityResult {
  const log: CampLogEntry[] = [];

  if (choiceId === 'write_letter') {
    log.push({
      day,
      type: 'result',
      text: 'You sit on a rock and write by starlight. The words are clumsy, and your pen scratches more than it writes. But you describe the sea, the coast, the way the mountains look at sunset. You don\'t mention the hunger or the fear. Some things are better left unsaid.',
    });
    return { log, statChanges: {}, staminaChange: 2, moraleChange: 5 };
  } else {
    log.push({
      day,
      type: 'result',
      text: 'You stay until the cold drives you back. You sleep well for the first time in weeks.',
    });
    return { log, statChanges: {}, staminaChange: 2, moraleChange: 2 };
  }
}

function resolveLigurianGirlOutcome(
  player: PlayerCharacter,
  npcs: NPC[],
  choiceId: string,
  checkPassed: boolean,
  day: number,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const npcChanges: { npcId: string; relationship: number }[] = [];

  if (choiceId === 'step_in') {
    if (checkPassed) {
      log.push({
        day,
        type: 'result',
        text: 'You step forward and speak calmly. \u201cThat\u2019s enough, Gros.\u201d Something in your voice \u2014 or maybe just the fact that someone spoke at all \u2014 breaks the spell. He lets go, mutters something, walks away. The girl gathers her basket and disappears down the road without looking back. A couple of the men nod at you. That took nerve.',
      });
      return { log, statChanges: { soldierRep: 2 }, staminaChange: 0, moraleChange: 3, virtueChange: 5, flagChanges: { ligurian_girl_saved: true }, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    } else {
      const elanResult = rollStat(player.elan, 0, 0);
      if (elanResult.success) {
        log.push({
          day,
          type: 'result',
          text: '\u201cMind your own business, boy.\u201d He lets go of her arm and turns on you, squaring up. She slips away with her basket \u2014 at least there\u2019s that. Gros swings. You duck under it and put him on his back. He stays down. The section saw you stand up and hold your own. Gros won\u2019t try that again.',
        });
        return { log, statChanges: { soldierRep: 3 }, staminaChange: 0, moraleChange: 2, virtueChange: 5, flagChanges: { ligurian_girl_saved: true }, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
      } else {
        log.push({
          day,
          type: 'result',
          text: '\u201cMind your own business, boy.\u201d He lets go of her arm and turns on you. She slips away with her basket \u2014 at least there\u2019s that. But Gros puts you on the ground before you can get your guard up. A knee in your ribs, a boot in your side. Someone pulls him off. You lie in the dirt, tasting blood. At least the girl got away.',
        });
        return { log, statChanges: {}, staminaChange: -5, moraleChange: -2, healthChange: -5, virtueChange: 5, flagChanges: { ligurian_girl_saved: true }, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
      }
    }
  } else if (choiceId === 'fetch_morin') {
    const morin = npcs.find((n) => n.id === 'morin');
    if (checkPassed) {
      log.push({
        day,
        type: 'result',
        text: 'You sprint through camp and find Morin by the cookfires. He doesn\u2019t ask questions \u2014 just follows you back at a pace that makes you run to keep up. One look from Morin and Gros drops his hand, snaps to attention. \u201cGet back to your section,\u201d Morin says. The girl is gone before anyone can apologise. Morin glances at you. \u201cGood lad.\u201d',
      });
      if (morin) npcChanges.push({ npcId: 'morin', relationship: 3 });
      return { log, statChanges: { officerRep: 2 }, staminaChange: 0, moraleChange: 2, virtueChange: 5, flagChanges: { ligurian_girl_saved: true }, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    } else {
      log.push({
        day,
        type: 'result',
        text: 'You run, but Morin isn\u2019t where you thought. By the time you find him and drag him back, the spot is empty. No Gros. No girl. Just the basket of lemons overturned in the dirt. Morin looks at the lemons, then at you. He says nothing. You wish he had.',
      });
      return { log, statChanges: {}, staminaChange: 0, moraleChange: -3, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    }
  } else {
    log.push({
      day,
      type: 'result',
      text: 'You stare at the ground. When you look up, the spot is empty. Gros and the girl are both gone. The basket lies on its side, lemons scattered in the dust. Nobody says anything. You eat your supper in silence and do not sleep well.',
    });
    return { log, statChanges: {}, staminaChange: 0, moraleChange: -2, virtueChange: -5, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
  }
}

function resolveGenoeseMerchantOutcome(
  _player: PlayerCharacter,
  npcs: NPC[],
  choiceId: string,
  checkPassed: boolean,
  day: number,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const npcChanges: { npcId: string; relationship: number }[] = [];

  if (choiceId === 'spot_cheating') {
    if (checkPassed) {
      log.push({
        day,
        type: 'result',
        text: 'You look closer. The bread sacks are half-filled with straw. The cheese is rinded with wax to hide the mould. "These goods are short," you say, loud enough for the section to hear. The merchant sputters. Morin steps forward. "Double the weight or get out." The men eat well tonight, and they remember who spoke up.',
      });
      const morin = npcs.find((n) => n.id === 'morin');
      if (morin) npcChanges.push({ npcId: 'morin', relationship: 2 });
      return { log, statChanges: { soldierRep: 2 }, staminaChange: 0, moraleChange: 3, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    } else {
      log.push({
        day,
        type: 'result',
        text: 'You squint at the goods but nothing looks obviously wrong. The men buy at full price. Later, someone finds straw in the bread sacks. By then the merchant is long gone.',
      });
      return { log, statChanges: {}, staminaChange: 0, moraleChange: -1, sousChange: -1, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    }
  } else {
    if (checkPassed) {
      log.push({
        day,
        type: 'result',
        text: '"That price would shame a Parisian banker," you say. The merchant laughs, but you don\'t blink. You talk about the garrison, the general\'s orders on fair trading, the provost marshal. The price comes down by half. The men clap you on the back as you walk away with a wheel of cheese.',
      });
      return { log, statChanges: { soldierRep: 1 }, staminaChange: 0, moraleChange: 3, sousChange: -1, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    } else {
      log.push({
        day,
        type: 'result',
        text: 'You try to talk the price down, but the merchant has done this before. He smiles, shrugs, starts packing his mule. The men glare at you. You end up paying full price just to keep the peace.',
      });
      return { log, statChanges: {}, staminaChange: 0, moraleChange: -1, sousChange: -2, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
    }
  }
}

function resolveTheftOpportunityOutcome(
  _player: PlayerCharacter,
  npcs: NPC[],
  choiceId: string,
  checkPassed: boolean,
  day: number,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const npcChanges: { npcId: string; relationship: number }[] = [];
  const felix = npcs.find((n) => n.id === 'felix');

  if (choiceId === 'join_theft') {
    if (checkPassed) {
      log.push({
        day,
        type: 'result',
        text: 'You stand in the shadows, heart hammering, while Felix works the lock with a bent nail. It takes him thirty seconds. He fills a sack with bread, wine, and a wheel of cheese. You slip away like ghosts.\n\nLater, splitting the goods behind the latrine trench, Felix grins at you. "See? Easy money. Easier than dice, even." You eat well tonight. The taste is complicated.',
      });
      if (felix) npcChanges.push({ npcId: 'felix', relationship: 10 });
      return { log, statChanges: {}, staminaChange: 0, moraleChange: 2, sousChange: 3, virtueChange: -10, npcChanges };
    } else {
      log.push({
        day,
        type: 'result',
        text: 'You\u2019re watching the path when a figure rounds the corner \u2014 Sergeant Morin, on his rounds. You freeze. Felix bolts. Morin doesn\u2019t chase him, but he sees you.\n\n"What are you doing here, soldier?"\n\nYou stammer something about checking equipment. His eyes go to the supply wagon, the open lock. He says nothing for a long time. "Get back to your section. Now."\n\nHe doesn\u2019t report you. But the way he looks at you tomorrow is worse than any punishment.',
      });
      const morin = npcs.find((n) => n.id === 'morin');
      if (morin) npcChanges.push({ npcId: 'morin', relationship: -5 });
      return { log, statChanges: { officerRep: -5 }, staminaChange: 0, moraleChange: -3, virtueChange: -5, npcChanges };
    }
  } else {
    log.push({
      day,
      type: 'result',
      text: 'You shake your head. "Not for me, Felix."\n\nHe studies you for a moment, then shrugs. "Your conscience, friend." He slips away into the dark. You hear nothing more about it \u2014 but the next morning, Felix has fresh bread and a guilty smile.',
    });
    if (felix) npcChanges.push({ npcId: 'felix', relationship: -3 });
    return { log, statChanges: {}, staminaChange: 0, moraleChange: 1, virtueChange: 3, npcChanges };
  }
}

// ============================================================
// DATA-DRIVEN EVENT CONFIGS
// ============================================================

// Event schedule with 12 actions:
// 12: free    |  6: Ligurian Girl
// 11: free    |  5: free
// 10: Gambling|  4: Genoese Merchant
//  9: free    |  3: free
//  8: Coast   |  2: Theft (conditional)
//  7: free    |  1: free

export const VOLTRI_FORCED_EVENTS: ForcedEventConfig[] = [
  {
    id: 'voltri_gambling_invitation',
    triggerAt: 10,
    getEvent: () => getGamblingInvitationEvent(),
    resolveChoice: (state, player, npcs, choiceId, checkPassed) =>
      resolveGamblingInvitationOutcome(player, npcs, choiceId, checkPassed, state.day),
  },
  {
    id: 'voltri_coast_at_night',
    triggerAt: 8,
    getEvent: (_state, player) => getCoastAtNightEvent(player),
    resolveChoice: (state, player, npcs, choiceId, checkPassed) =>
      resolveCoastAtNightOutcome(player, npcs, choiceId, checkPassed, state.day),
  },
  {
    id: 'voltri_ligurian_girl',
    triggerAt: 6,
    getEvent: () => getLigurianGirlEvent(),
    resolveChoice: (state, player, npcs, choiceId, checkPassed) =>
      resolveLigurianGirlOutcome(player, npcs, choiceId, checkPassed, state.day),
  },
  {
    id: 'voltri_genoese_merchant',
    triggerAt: 4,
    getEvent: () => getGenoeseMerchantEvent(),
    resolveChoice: (state, player, npcs, choiceId, checkPassed) =>
      resolveGenoeseMerchantOutcome(player, npcs, choiceId, checkPassed, state.day),
  },
  {
    id: 'voltri_theft_opportunity',
    triggerAt: 2,
    condition: (state) => state.flags.gambling_accepted === true,
    getEvent: () => getTheftOpportunityEvent(),
    resolveChoice: (state, player, npcs, choiceId, checkPassed) =>
      resolveTheftOpportunityOutcome(player, npcs, choiceId, checkPassed, state.day),
  },
];
