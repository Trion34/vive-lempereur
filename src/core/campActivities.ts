import {
  CampActivityId, CampActivity, CampActivityResult, CampLogEntry,
  PlayerCharacter, NPC, CampState,
} from '../types';
import { rollStat, Difficulty, getFatigueDebuff } from './stats';

// Get available activities with costs and availability
export function getCampActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return [
    {
      id: CampActivityId.Rest,
      name: 'Rest',
      description: 'Sleep, sit by the fire, do nothing. Recover fatigue.',
      fatigueCost: 0,
      available: true,
    },
    {
      id: CampActivityId.Train,
      name: 'Train',
      description: 'Practice drills and combat skills. Improves a stat but costs fatigue.',
      fatigueCost: 15,
      available: true,
    },
    {
      id: CampActivityId.Socialize,
      name: 'Socialize',
      description: 'Talk with comrades around the fire. Builds relationships.',
      fatigueCost: 5,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.WriteLetters,
      name: 'Write Letters',
      description: 'Write home. Recovers morale. Intelligence check for quality.',
      fatigueCost: 5,
      available: true,
    },
    {
      id: CampActivityId.Gamble,
      name: 'Gamble',
      description: 'Cards, dice, or bones. Risk and reward. Awareness check to detect cheating.',
      fatigueCost: 5,
      available: true,
    },
    {
      id: CampActivityId.Drill,
      name: 'Drill',
      description: 'Full squad drill under the NCO. High fatigue cost but improves dexterity and NCO approval.',
      fatigueCost: 20,
      available: true,
    },
    {
      id: CampActivityId.MaintainEquipment,
      name: 'Maintain Equipment',
      description: 'Clean musket, mend uniform. Dexterity check for quality.',
      fatigueCost: 10,
      available: true,
    },
  ];
}

export function resolveCampActivity(
  activityId: CampActivityId,
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
  targetNpcId?: string,
): CampActivityResult {
  switch (activityId) {
    case CampActivityId.Rest: return resolveRest(player, camp);
    case CampActivityId.Train: return resolveTrain(player, camp);
    case CampActivityId.Socialize: return resolveSocialize(player, npcs, camp, targetNpcId);
    case CampActivityId.WriteLetters: return resolveWriteLetters(player, camp);
    case CampActivityId.Gamble: return resolveGamble(player, npcs, camp);
    case CampActivityId.Drill: return resolveDrill(player, camp);
    case CampActivityId.MaintainEquipment: return resolveMaintainEquipment(player, camp);
    default: return { log: [], statChanges: {}, fatigueChange: 0, moraleChange: 0 };
  }
}

function resolveRest(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const weatherBonus = camp.conditions.weather === 'clear' ? 5 : camp.conditions.weather === 'rain' ? -5 : 0;
  const enduranceBonus = Math.floor(player.endurance / 20);

  const narratives = [
    'You find a dry spot near the fire and close your eyes. Sleep comes, fitful and full of drums.',
    'You wrap yourself in your greatcoat and lean against a tree. The fire crackles. For a moment, the war is far away.',
    'You sleep. No dreams tonight. A small mercy.',
  ];
  log.push({ day: camp.day, text: narratives[Math.floor(Math.random() * narratives.length)], type: 'activity' });

  return {
    log,
    statChanges: {},
    fatigueChange: 20 + weatherBonus + enduranceBonus,
    moraleChange: 3,
  };
}

function resolveTrain(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  // Randomly pick a trainable stat
  const trainableStats = ['valor', 'dexterity', 'strength'] as const;
  const stat = trainableStats[Math.floor(Math.random() * trainableStats.length)];
  const currentVal = player[stat];

  // Diminishing returns: harder to train above 60
  const difficulty = currentVal > 60 ? Difficulty.Hard : currentVal > 40 ? Difficulty.Standard : Difficulty.Easy;
  const check = rollStat(player.endurance, 0, difficulty);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: `You spend hours drilling ${stat === 'valor' ? 'nerve exercises' : stat === 'dexterity' ? 'musket handling' : 'bayonet work'}. Your body aches, but you feel sharper.`,
    });
    log.push({ day: camp.day, type: 'result', text: `${stat.charAt(0).toUpperCase() + stat.slice(1)} improved.` });
    return {
      log,
      statChanges: { [stat]: 1 },
      fatigueChange: -15,
      moraleChange: 1,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'The training goes poorly. Your muscles won\'t cooperate. Fatigue has taken more than you thought.',
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -15,
      moraleChange: -2,
    };
  }
}

function resolveSocialize(
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
  targetNpcId?: string,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const target = npcs.find(n => n.id === targetNpcId && n.alive);

  if (!target) {
    log.push({ day: camp.day, type: 'activity', text: 'You sit by the fire alone. No one to talk to tonight.' });
    return { log, statChanges: {}, fatigueChange: -5, moraleChange: -1 };
  }

  const check = rollStat(player.charisma, 0, Difficulty.Standard);

  if (check.success) {
    const successNarratives: Record<string, string> = {
      stoic: `${target.name} is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.`,
      nervous: `${target.name} talks rapidly about home — the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.`,
      bitter: `${target.name} grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.`,
      jovial: `${target.name} tells a story about a farmer's daughter in Verona that has the whole fire laughing. He claps you on the shoulder. "Stick with me, eh?"`,
      devout: `${target.name} leads a quiet prayer. You bow your head. In this moment, the war feels smaller.`,
      ambitious: `${target.name} speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.`,
    };
    const narrative = successNarratives[target.personality] ||
      `You share a quiet evening with ${target.name}. The bond between soldiers grows.`;
    log.push({ day: camp.day, type: 'activity', text: narrative });
    return {
      log,
      statChanges: {},
      fatigueChange: -5,
      moraleChange: 3,
      npcChanges: [{ npcId: target.id, relationship: 8, trust: 5 }],
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: `You try to strike up conversation with ${target.name}, but the words come out wrong. An awkward silence. You excuse yourself.`,
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -5,
      moraleChange: 0,
      npcChanges: [{ npcId: target.id, relationship: -2, trust: 0 }],
    };
  }
}

function resolveWriteLetters(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.intelligence, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You write home by candlelight. The words come easily tonight — not the horrors, but the small things. The sunrise over the Alps. The taste of real bread in Verona. The letter feels like a bridge to another world.',
    });
    log.push({ day: camp.day, type: 'result', text: 'A well-written letter. Reputation improved.' });
    return {
      log,
      statChanges: { reputation: 2 },
      fatigueChange: -5,
      moraleChange: 5,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You try to write, but the words won\'t come. What do you say? How do you explain any of this? The page stays mostly blank. You seal it anyway.',
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -5,
      moraleChange: 2,
    };
  }
}

function resolveGamble(player: PlayerCharacter, npcs: NPC[], camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  // Awareness check to detect cheating
  const cheatingDetected = rollStat(player.awareness, 0, Difficulty.Hard).success;
  const luck = Math.random();

  if (luck > 0.6) {
    // Won
    log.push({
      day: camp.day, type: 'activity',
      text: 'Cards tonight. You play cautiously at first, then find your nerve. When the pot is called, your hand is best. The men around the fire groan and pay up.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Won the pot. Reputation improved.' });
    return {
      log,
      statChanges: { reputation: 3 },
      fatigueChange: -5,
      moraleChange: 4,
    };
  } else if (luck > 0.3) {
    // Even
    log.push({
      day: camp.day, type: 'activity',
      text: 'An evening of cards. You win some, lose some. The company is better than the stakes.',
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -5,
      moraleChange: 1,
    };
  } else {
    // Lost
    if (cheatingDetected) {
      log.push({
        day: camp.day, type: 'activity',
        text: 'You catch the corporal dealing from the bottom. "I see your hand, Corporal." He freezes. The table goes quiet. You leave with your dignity — and your coins.',
      });
      return {
        log,
        statChanges: { reputation: 1 },
        fatigueChange: -5,
        moraleChange: 1,
      };
    } else {
      log.push({
        day: camp.day, type: 'activity',
        text: 'A bad night at the cards. The pot drains away hand by hand. You suspect foul play but can\'t prove it. Walk away lighter in pocket and mood.',
      });
      return {
        log,
        statChanges: { reputation: -1 },
        fatigueChange: -5,
        moraleChange: -2,
      };
    }
  }
}

function resolveDrill(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.dexterity, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Sergeant Duval runs the squad through full drill — load, present, fire, reload. Again. Again. Again. Your hands learn the motions until your mind is no longer needed. The sergeant nods once. High praise.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Dexterity improved. NCO approval increased.' });
    return {
      log,
      statChanges: { dexterity: 1, ncoApproval: 5 },
      fatigueChange: -20,
      moraleChange: 1,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Drill goes badly. Your fingers fumble. The sergeant\'s contempt is withering. "Again. From the beginning." Hours of it, and nothing to show.',
    });
    return {
      log,
      statChanges: { ncoApproval: 2 },
      fatigueChange: -20,
      moraleChange: -1,
    };
  }
}

function resolveMaintainEquipment(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.dexterity, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You strip the musket, clean every part, oil the lock. The bayonet gets sharpened. You patch the worst holes in your coat. When you\'re done, the Charleville gleams.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Equipment condition improved.' });
    return {
      log,
      statChanges: {},
      fatigueChange: -10,
      moraleChange: 2,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You clean the musket as best you can, but the lock spring is weak and you can\'t fix it with what you have. The uniform is beyond patching. Adequate. Not good.',
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -10,
      moraleChange: 0,
    };
  }
}
