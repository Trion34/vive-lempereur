import {
  CampActivityId, CampActivity, CampActivityResult, CampLogEntry,
  PlayerCharacter, NPC, CampState, ExerciseSubActivity,
  ArmsTrainingSubActivity, ARMS_TRAINING_TIERS, RestSubActivity, DutySubActivity,
} from '../types';
import { rollStat, Difficulty, getStaminaDebuff, rollD100 } from './stats';

// Get available activities with costs and availability
export function getCampActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return [
    {
      id: CampActivityId.Rest,
      name: 'Rest',
      description: 'Rest your body and mind. Several options.',
      staminaCost: 0,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Exercise,
      name: 'Exercise',
      description: 'Physical training. Choose an exercise to build strength, endurance, or constitution.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.ArmsTraining,
      name: 'Arms Training',
      description: 'Practice musketry or bayonet work. Solo, with comrades, or under an officer.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Train,
      name: 'Train',
      description: 'Practice drills and combat skills. Improves a stat but costs stamina.',
      staminaCost: 15,
      available: true,
    },
    {
      id: CampActivityId.Socialize,
      name: 'Socialize',
      description: 'Talk with comrades around the fire. Builds relationships.',
      staminaCost: 5,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Gamble,
      name: 'Gamble',
      description: 'Cards, dice, or bones. Risk and reward. Awareness check to detect cheating.',
      staminaCost: 5,
      available: true,
    },
    {
      id: CampActivityId.Duties,
      name: 'Duties',
      description: 'Drill, volunteer, pull your weight. Earn the regiment\'s respect.',
      staminaCost: 15,
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
    case CampActivityId.Rest: return resolveRest(player, camp, targetNpcId as RestSubActivity | undefined);
    case CampActivityId.Train: return resolveTrain(player, camp);
    case CampActivityId.Socialize: return resolveSocialize(player, npcs, camp, targetNpcId);
    case CampActivityId.WriteLetters: return resolveWriteLetters(player, camp);
    case CampActivityId.Gamble: return resolveGamble(player, npcs, camp);
    case CampActivityId.Duties: return resolveDuty(player, camp, targetNpcId as DutySubActivity | undefined);
    case CampActivityId.MaintainEquipment: return resolveMaintainEquipment(player, camp);
    case CampActivityId.Exercise: return resolveExercise(player, camp, targetNpcId as ExerciseSubActivity | undefined);
    case CampActivityId.ArmsTraining: return resolveArmsTraining(player, camp, targetNpcId as ArmsTrainingSubActivity | undefined);
    default: return { log: [], statChanges: {}, staminaChange: 0, moraleChange: 0 };
  }
}

export function resolveRest(player: PlayerCharacter, camp: CampState, subChoice?: RestSubActivity): CampActivityResult {
  const sub = subChoice || 'lay_about';
  switch (sub) {
    case 'lay_about': return resolveLayAbout(player, camp);
    case 'bathe': return resolveBathe(player, camp);
    case 'pray': return resolveRestPray(player, camp);
    default: return resolveLayAbout(player, camp);
  }
}

function resolveLayAbout(player: PlayerCharacter, camp: CampState): CampActivityResult {
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
    staminaChange: 20 + weatherBonus + enduranceBonus,
    moraleChange: 3,
    healthChange: 5,
  };
}

function resolveBathe(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  const narratives = [
    'You strip and wade into the Adige. The cold hits like a fist — every muscle seizes, your breath comes in gasps. But you scrub away the grime, the sweat, the dried blood. When you climb out, shaking and blue-lipped, you feel like a new man. Or at least a cleaner one.',
    'The river is black and fast and freezing. You plunge in before you can think better of it. The shock drives everything else out of your head — the war, the cold, the fear. For one perfect, agonizing moment there is nothing but the water and your hammering heart. You emerge gasping, raw, alive.',
    'You find a calm bend in the Adige, sheltered by rocks. The water is brutal — January meltwater from the Alps. You wash quickly, teeth chattering, scrubbing the campaign from your skin. Clean clothes. Clean body. It shouldn\'t matter this much. It does.',
  ];
  log.push({ day: camp.day, text: narratives[Math.floor(Math.random() * narratives.length)], type: 'activity' });

  return {
    log,
    statChanges: {},
    staminaChange: 30,
    moraleChange: 5,
    healthChange: 8,
  };
}

function resolveRestPray(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  const narratives = [
    'You find a quiet spot behind a low wall, away from the fires. The stars are very bright. The Alps are black shapes against the sky. You don\'t know the right words \u2014 you never did \u2014 so you say the ones you remember from childhood. It doesn\'t fix anything. But something loosens in your chest.',
    'You kneel in the frozen grass. The words come haltingly \u2014 half-remembered prayers from a church you haven\'t seen in years. The cold bites your knees. The wind carries the sound away. But for a moment, the war is very small and something else is very large.',
    'You close your eyes and speak to whatever is listening. You don\'t ask to survive \u2014 that feels greedy. You ask for courage. You ask to not let down the men beside you. The silence that answers is not empty. It is patient.',
  ];
  log.push({ day: camp.day, text: narratives[Math.floor(Math.random() * narratives.length)], type: 'activity' });
  log.push({ day: camp.day, type: 'result', text: statResultText('valor', true) });

  return {
    log,
    statChanges: { valor: 1 },
    staminaChange: 10,
    moraleChange: 7,
    healthChange: 3,
  };
}

function resolveTrain(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  // Randomly pick a trainable stat
  const trainableStats = ['valor', 'musketry', 'elan', 'strength'] as const;
  const stat = trainableStats[Math.floor(Math.random() * trainableStats.length)];
  const currentVal = player[stat];

  // Diminishing returns: harder to train above 60
  const difficulty = currentVal > 60 ? Difficulty.Hard : currentVal > 40 ? Difficulty.Standard : Difficulty.Easy;
  const check = rollStat(player.endurance, 0, difficulty);

  const drillNames: Record<string, string> = {
    valor: 'nerve exercises', musketry: 'musket handling',
    elan: 'bayonet forms', strength: 'heavy lifting',
  };
  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: `You spend hours on ${drillNames[stat] || stat}. Your body aches, but you feel sharper.`,
    });
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: `You spend hours on ${drillNames[stat] || stat}. Fatigue has taken more than you thought.`,
    });
  }
  log.push({ day: camp.day, type: 'result', text: statResultText(stat, check.success) });

  return {
    log,
    statChanges: check.success ? { [stat]: 1 } : {},
    staminaChange: -15,
    moraleChange: check.success ? 1 : -2,
  };
}

function resolveSocialize(
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
  targetNpcId?: string,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const npc = npcs.find(n => n.id === targetNpcId);
  const target = npc?.alive ? npc : undefined;

  if (!target) {
    const text = npc && !npc.alive
      ? `${npc.name} is gone. You sit by the fire and stare at the empty place where he used to sit.`
      : 'You sit by the fire alone. No one to talk to tonight.';
    log.push({ day: camp.day, type: 'activity', text });
    return { log, statChanges: {}, staminaChange: -5, moraleChange: -1 };
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
      staminaChange: -5,
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
      staminaChange: -5,
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
    log.push({ day: camp.day, type: 'result', text: 'A well-written letter. The men respect a man of letters.' });
    return {
      log,
      statChanges: { soldierRep: 2 },
      staminaChange: -5,
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
      staminaChange: -5,
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
    log.push({ day: camp.day, type: 'result', text: 'Won the pot. The men remember a winner.' });
    return {
      log,
      statChanges: { soldierRep: 3 },
      staminaChange: -5,
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
      staminaChange: -5,
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
        statChanges: { soldierRep: 1 },
        staminaChange: -5,
        moraleChange: 1,
      };
    } else {
      log.push({
        day: camp.day, type: 'activity',
        text: 'A bad night at the cards. The pot drains away hand by hand. You suspect foul play but can\'t prove it. Walk away lighter in pocket and mood.',
      });
      return {
        log,
        statChanges: { soldierRep: -1 },
        staminaChange: -5,
        moraleChange: -2,
      };
    }
  }
}

function resolveDuty(player: PlayerCharacter, camp: CampState, sub?: DutySubActivity): CampActivityResult {
  if (sub === 'check_equipment') return resolveMaintainEquipment(player, camp);
  return resolveDrill(player, camp);
}

function resolveDrill(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.musketry, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Sergeant Duval runs the squad through full drill. Load, present, fire, reload. Again. Again. The sergeant nods once. High praise.',
    });
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Drill goes badly. Your fingers fumble. The sergeant\'s contempt is withering. "Again. From the beginning."',
    });
  }
  log.push({ day: camp.day, type: 'result', text: statResultText('musketry', check.success) });

  return {
    log,
    statChanges: check.success ? { musketry: 1, officerRep: 5 } : { officerRep: 2 },
    staminaChange: -20,
    moraleChange: check.success ? 1 : -1,
  };
}

function resolveMaintainEquipment(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.musketry, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Strip. Clean. Oil. Sharpen. The Charleville gleams. So do you.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Equipment ready. Morale +2' });
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'The lock spring is weak. The uniform is beyond patching. Adequate. Not good.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Adequate. Nothing more.' });
  }

  return {
    log,
    statChanges: {},
    staminaChange: -10,
    moraleChange: check.success ? 2 : 0,
  };
}

// === Exercise ===

interface ExerciseConfig {
  stat1: 'strength' | 'endurance' | 'constitution';
  stat2: 'strength' | 'endurance' | 'constitution';
  narrativeSuccess: string;
  narrativeMixed: string;
  narrativeFail: string;
}

const EXERCISE_CONFIG: Record<ExerciseSubActivity, ExerciseConfig> = {
  fatigue_duty: {
    stat1: 'strength',
    stat2: 'endurance',
    narrativeSuccess: 'You haul crates, dig ditches, chop wood. The army\'s grunt work, but your muscles burn and grow. By the end your arms tremble and your back aches \u2014 the good kind of ache, the kind that means something changed.',
    narrativeMixed: 'Hours of hauling and digging. Sweat soaks through your shirt despite the cold. Some of it sticks \u2014 you can feel the difference in your grip, your stride. Not everything, but something.',
    narrativeFail: 'You haul and dig until your vision blurs. The crates feel heavier with each pass. Your body resists the work today \u2014 tired muscles have nothing left to give. The effort leaves you drained with nothing to show for it.',
  },
  wrestle: {
    stat1: 'strength',
    stat2: 'constitution',
    narrativeSuccess: 'You grapple with a comrade behind the supply wagons. He is bigger but you are quicker. Throws, holds, escapes \u2014 your body learns to absorb punishment and dish it out. You tap out laughing, bruised, and stronger.',
    narrativeMixed: 'Wrestling in the mud with one of the grenadiers. He throws you twice. You throw him once. Bruises forming on bruises. But the body remembers what the mind forgets.',
    narrativeFail: 'The grenadier puts you on your back three times running. Your ribs ache, your pride worse. Some days the body simply will not cooperate.',
  },
  run: {
    stat1: 'endurance',
    stat2: 'constitution',
    narrativeSuccess: 'You run the camp perimeter, boots pounding frozen ground. Lungs burning, legs driving. Each lap feels harder \u2014 but you find a rhythm, a second wind. When you stop, the cold air tastes like iron and victory.',
    narrativeMixed: 'You run until your lungs ache and your legs go heavy. Not your best run, but not your worst. The body is a furnace \u2014 sometimes it catches, sometimes it just smokes.',
    narrativeFail: 'You set off at a jog but the cold seizes your chest and your legs refuse. Half a lap and you\'re bent double, gasping. The altitude, the cold, the bad rations \u2014 everything conspires against you today.',
  },
};

const STAT_LABELS: Record<string, string> = {
  strength: 'Strength',
  endurance: 'Endurance',
  constitution: 'Constitution',
  musketry: 'Musketry',
  elan: 'Élan',
  awareness: 'Awareness',
  valor: 'Valor',
};

const STAT_RESULT_FLAVOR: Record<string, { success: string; fail: string }> = {
  strength: { success: 'The weight feels lighter.', fail: 'Your muscles won\'t cooperate.' },
  endurance: { success: 'Second wind.', fail: 'Your lungs give out.' },
  constitution: { success: 'Your body hardens.', fail: 'The body won\'t toughen.' },
  musketry: { success: 'Your hands remember.', fail: 'Your hands fumble.' },
  elan: { success: 'The blade feels natural.', fail: 'The motions stay stiff.' },
  awareness: { success: 'You see what others miss.', fail: 'Nothing stands out.' },
  valor: { success: 'Your nerve steadies.', fail: 'The fear remains.' },
};

export function statResultText(stat: string, gained: boolean): string {
  const label = STAT_LABELS[stat] || stat.charAt(0).toUpperCase() + stat.slice(1);
  const flavor = STAT_RESULT_FLAVOR[stat];
  if (gained) {
    return `${flavor?.success || 'Improvement.'} ${label} +1`;
  }
  return `${flavor?.fail || 'No change.'} ${label} \u2014`;
}

export function resolveExercise(
  player: PlayerCharacter,
  camp: CampState,
  subChoice?: ExerciseSubActivity,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const sub = subChoice || 'fatigue_duty';
  const config = EXERCISE_CONFIG[sub];

  // Two independent stat checks: roll d100 against (100 - statValue)
  const stat1Val = player[config.stat1];
  const stat2Val = player[config.stat2];
  const target1 = 100 - stat1Val;
  const target2 = 100 - stat2Val;
  const roll1 = rollD100();
  const roll2 = rollD100();
  const pass1 = roll1 <= target1;
  const pass2 = roll2 <= target2;

  const statChanges: Partial<Record<string, number>> = {};
  if (pass1) statChanges[config.stat1] = (statChanges[config.stat1] || 0) + 1;
  if (pass2) statChanges[config.stat2] = (statChanges[config.stat2] || 0) + 1;

  // Pick narrative based on outcome
  if (pass1 && pass2) {
    log.push({ day: camp.day, type: 'activity', text: config.narrativeSuccess });
  } else if (pass1 || pass2) {
    log.push({ day: camp.day, type: 'activity', text: config.narrativeMixed });
  } else {
    log.push({ day: camp.day, type: 'activity', text: config.narrativeFail });
  }

  // Result summary — one entry per stat
  log.push({ day: camp.day, type: 'result', text: statResultText(config.stat1, pass1) });
  log.push({ day: camp.day, type: 'result', text: statResultText(config.stat2, pass2) });

  return {
    log,
    statChanges,
    staminaChange: -10,
    moraleChange: (pass1 && pass2) ? 2 : (pass1 || pass2) ? 0 : -1,
  };
}

// === Arms Training ===

interface ArmsTrainingConfig {
  stat: 'musketry' | 'elan';
  tier: 'solo' | 'comrades' | 'officers';
  narrativeSuccess: string;
  narrativeFail: string;
  narrativeCapped: string;
}

const ARMS_TRAINING_CONFIG: Record<ArmsTrainingSubActivity, ArmsTrainingConfig> = {
  solo_musketry: {
    stat: 'musketry',
    tier: 'solo',
    narrativeSuccess: 'You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. Your hands find a rhythm, muscle memory building with each repetition. The motions smooth out — less thought, more instinct.',
    narrativeFail: 'You drill alone behind the wagons, but without someone to correct you, bad habits creep in. The motions feel the same as yesterday. Repetition without improvement.',
    narrativeCapped: 'You run the drill perfectly — but perfectly the same as last time. You\'ve learned all you can on your own. To improve further, you need someone who knows more than you do.',
  },
  solo_elan: {
    stat: 'elan',
    tier: 'solo',
    narrativeSuccess: 'You practice bayonet forms alone — thrust, parry, butt-strike. Shadow-fighting against an invisible Austrian. Your footwork sharpens. The bayonet feels lighter, faster, more like an extension of your arm.',
    narrativeFail: 'You lunge and thrust at shadows, but the movements feel stiff and forced. Without a partner to react to, the drill stays mechanical. No improvement today.',
    narrativeCapped: 'The forms are perfect. Textbook. But forms alone won\'t take you further. You need live steel — a partner who fights back.',
  },
  comrades_musketry: {
    stat: 'musketry',
    tier: 'comrades',
    narrativeSuccess: 'The section lines up and runs volley drill together. Loading in unison, presenting as one. Pierre calls the timing. In the group, you find a rhythm you can\'t reach alone — the shared discipline sharpens everyone. Your hands are faster for it.',
    narrativeFail: 'Squad drill. The section is ragged today — timing off, the file crooked. You fire when you should be loading. The sergeant shakes his head. Some days the group drags you down instead of lifting you up.',
    narrativeCapped: 'The squad drill is crisp and professional. You\'re as good as any man in the section. But to get better — really better — you\'d need an officer\'s eye. Someone who\'s studied the art of it.',
  },
  comrades_elan: {
    stat: 'elan',
    tier: 'comrades',
    narrativeSuccess: 'You spar with one of the grenadiers — wooden bayonets, no quarter asked. He comes in hard and you meet him. Block, riposte, duck under his swing. You\'re faster than last time. He notices. "Good," he says, rubbing his ribs.',
    narrativeFail: 'Sparring behind the supply wagons. Your partner is better than you today — or maybe you\'re worse. He puts you on your back twice. The bruises will heal. The embarrassment lingers.',
    narrativeCapped: 'The sparring is fierce and even. You and your comrade match each other blow for blow. But you\'re both soldiers, not swordsmen. To push further, you need a master — someone who knows the science of the blade.',
  },
  officers_musketry: {
    stat: 'musketry',
    tier: 'officers',
    narrativeSuccess: 'Lieutenant Moreau takes you aside. "Watch." He loads — not fast, but precise. Every motion economical. "You waste movement here. And here." He adjusts your grip, your elbow, the angle of the ramrod. Small things. Things no soldier would notice. Things that make the difference between good and deadly.',
    narrativeFail: 'The lieutenant watches you drill and makes corrections. "Better. Again." But today the adjustments don\'t stick. Your hands refuse to unlearn what they know. "Tomorrow," he says. It is not encouragement.',
    narrativeCapped: 'Lieutenant Moreau watches you load and fire. He says nothing for a long time. "I have nothing more to teach you," he says finally. "The rest is between you and God."',
  },
  officers_elan: {
    stat: 'elan',
    tier: 'officers',
    narrativeSuccess: 'Captain Leclerc was a fencing master before the Revolution. He takes up a stick and faces you. "En garde." What follows is humbling and instructive in equal measure. He moves like water. But by the end, you move a little more like water yourself.',
    narrativeFail: 'The captain puts you through the formal positions — tierce, quarte, sixte. Your feet tangle. Your point wavers. "Again. Slower." The lesson is long and the progress invisible. But he does not send you away.',
    narrativeCapped: 'Leclerc salutes you with his stick. "You have the makings of a swordsman," he says. Coming from him, that is everything. There is nothing more the salle d\'armes can teach. The rest you learn in battle.',
  },
};

export function resolveArmsTraining(
  player: PlayerCharacter,
  camp: CampState,
  subChoice?: ArmsTrainingSubActivity,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const sub = subChoice || 'solo_musketry';
  const config = ARMS_TRAINING_CONFIG[sub];
  const tierConfig = ARMS_TRAINING_TIERS[config.tier];

  const statVal = player[config.stat];
  const statLabel = config.stat === 'musketry' ? 'Musketry' : 'Elan';

  // Hard cap check
  if (statVal >= tierConfig.cap) {
    log.push({ day: camp.day, type: 'activity', text: config.narrativeCapped });
    log.push({ day: camp.day, type: 'result', text: `${statLabel} capped. Nothing more to learn here.` });
    return {
      log,
      statChanges: {},
      staminaChange: -10,
      moraleChange: 0,
    };
  }

  // Diminishing returns: target = min(maxChance, max(0, cap - statValue) * 2)
  const target = Math.min(tierConfig.maxChance, Math.max(0, (tierConfig.cap - statVal) * 2));
  const roll = rollD100();
  const success = roll <= target;

  log.push({ day: camp.day, type: 'activity', text: success ? config.narrativeSuccess : config.narrativeFail });
  log.push({ day: camp.day, type: 'result', text: statResultText(config.stat, success) });

  return {
    log,
    statChanges: success ? { [config.stat]: 1 } : {},
    staminaChange: -10,
    moraleChange: success ? 1 : -1,
  };
}
