import {
  CampActivityId,
  CampActivityResult,
  CampLogEntry,
  PlayerCharacter,
  NPC,
  CampState,
  ExerciseSubActivity,
  ArmsTrainingSubActivity,
  ARMS_TRAINING_TIERS,
  RestSubActivity,
  DutySubActivity,
} from '../types';
import { rollStat, Difficulty, rollD100 } from './stats';

export function resolveRest(
  player: PlayerCharacter,
  camp: CampState,
  subChoice?: RestSubActivity,
): CampActivityResult {
  const sub = subChoice || 'lay_about';
  switch (sub) {
    case 'lay_about':
      return resolveLayAbout(player, camp);
    case 'bathe':
      return resolveBathe(player, camp);
    case 'pray':
      return resolveRestPray(player, camp);
    default:
      return resolveLayAbout(player, camp);
  }
}

function resolveLayAbout(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const weatherBonus =
    camp.conditions.weather === 'clear' ? 5 : camp.conditions.weather === 'rain' ? -5 : 0;
  const enduranceBonus = Math.floor(player.endurance / 20);

  log.push({
    day: camp.day,
    text: 'You wrap yourself in your greatcoat and lean against a tree. The fire crackles. For a moment, the war is far away.',
    type: 'activity',
  });

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

  log.push({
    day: camp.day,
    text: 'The river is black and fast and freezing. You plunge in before you can think better of it. The shock drives everything else out of your head \u2014 the war, the cold, the fear. You emerge gasping, raw, alive.',
    type: 'activity',
  });

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

  log.push({
    day: camp.day,
    text: 'You close your eyes and speak to God. You ask for courage. You ask to not let down the men beside you. The silence that answers is not empty. It is patient.',
    type: 'activity',
  });
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
  const difficulty =
    currentVal > 60 ? Difficulty.Hard : currentVal > 40 ? Difficulty.Standard : Difficulty.Easy;
  const check = rollStat(player.endurance, 0, difficulty);

  const drillNames: Record<string, string> = {
    valor: 'nerve exercises',
    musketry: 'musket handling',
    elan: 'bayonet forms',
    strength: 'heavy lifting',
  };
  if (check.success) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: `You spend hours on ${drillNames[stat] || stat}. Your body aches, but you feel sharper.`,
    });
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
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
  const npc = npcs.find((n) => n.id === targetNpcId);
  const target = npc?.alive ? npc : undefined;

  if (!target) {
    const text =
      npc && !npc.alive
        ? `${npc.name} is gone. You sit by the fire and stare at the empty place where he used to sit.`
        : 'You sit by the fire alone. No one to talk to tonight.';
    log.push({ day: camp.day, type: 'activity', text });
    return { log, statChanges: {}, staminaChange: -5, moraleChange: -1 };
  }

  const check = rollStat(player.charisma, 0, Difficulty.Standard);

  if (check.success) {
    const successNarratives: Record<string, string> = {
      pierre: `Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.`,
      'jean-baptiste': `Jean-Baptiste talks rapidly about home — the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.`,
      duval: `Sergeant Duval grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.`,
      leclerc: `Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.`,
    };
    const narrative =
      successNarratives[target.id] ||
      `You share a quiet evening with ${target.name}. The bond between soldiers grows.`;
    log.push({ day: camp.day, type: 'activity', text: narrative });
    return {
      log,
      statChanges: {},
      staminaChange: -5,
      moraleChange: 3,
      npcChanges: [{ npcId: target.id, relationship: 8 }],
    };
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
      text: `You try to strike up conversation with ${target.name}, but the words come out wrong. An awkward silence. You excuse yourself.`,
    });
    return {
      log,
      statChanges: {},
      staminaChange: -5,
      moraleChange: 0,
      npcChanges: [{ npcId: target.id, relationship: -2 }],
    };
  }
}

function resolveWriteLetters(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.intelligence, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: 'You write home by candlelight. The words come easily tonight — not the horrors, but the small things. The sunrise over the Alps. The taste of real bread in Verona. The letter feels like a bridge to another world.',
    });
    log.push({
      day: camp.day,
      type: 'result',
      text: 'A well-written letter. The men respect a man of letters.',
    });
    return {
      log,
      statChanges: { soldierRep: 2 },
      staminaChange: -5,
      moraleChange: 5,
    };
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
      text: "You try to write, but the words won't come. What do you say? How do you explain any of this? The page stays mostly blank. You seal it anyway.",
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
      day: camp.day,
      type: 'activity',
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
      day: camp.day,
      type: 'activity',
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
        day: camp.day,
        type: 'activity',
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
        day: camp.day,
        type: 'activity',
        text: "A bad night at the cards. The pot drains away hand by hand. You suspect foul play but can't prove it. Walk away lighter in pocket and mood.",
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

function resolveMaintainEquipment(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.musketry, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: 'Strip. Clean. Oil. Sharpen. The Charleville gleams. So do you.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Equipment ready. Morale +2' });
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
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
  narrativeFail: string;
}

const EXERCISE_CONFIG: Record<ExerciseSubActivity, ExerciseConfig> = {
  haul: {
    stat1: 'strength',
    stat2: 'endurance',
    narrativeSuccess:
      "You shoulder a water barrel from the stream and carry it uphill to camp. And again. Your arms shake. You're getting stronger.",
    narrativeFail:
      "You shoulder a water barrel from the stream and carry it uphill to camp. And again. Your arms shake. You're not getting any stronger.",
  },
  wrestle: {
    stat1: 'strength',
    stat2: 'constitution',
    narrativeSuccess:
      "You grapple with a comrade behind the supply wagons. Your body learns to absorb punishment and dish it out. You're getting stronger.",
    narrativeFail:
      "You grapple with a comrade behind the supply wagons. Your body fails you. You're not getting any stronger.",
  },
  run: {
    stat1: 'endurance',
    stat2: 'constitution',
    narrativeSuccess:
      "You run the camp perimeter, boots pounding frozen ground. You find a rhythm, a second wind. You're getting better.",
    narrativeFail:
      "You run the camp perimeter, boots pounding frozen ground. You tire quickly. You're not getting any better.",
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

export function statResultText(stat: string, gained: boolean): string {
  const label = STAT_LABELS[stat] || stat.charAt(0).toUpperCase() + stat.slice(1);
  if (gained) {
    return `${label} +1`;
  }
  return `${label} \u2014`;
}

export function resolveExercise(
  player: PlayerCharacter,
  camp: CampState,
  subChoice?: ExerciseSubActivity,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const sub = subChoice || 'haul';
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

  // Pick narrative based on outcome — any pass = success narrative
  if (pass1 || pass2) {
    log.push({ day: camp.day, type: 'activity', text: config.narrativeSuccess });
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
    moraleChange: pass1 && pass2 ? 2 : pass1 || pass2 ? 0 : -1,
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
    narrativeSuccess:
      "You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. You're getting better.",
    narrativeFail:
      "You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. You're not getting any better.",
    narrativeCapped:
      "You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. You've learned all you can on your own.",
  },
  solo_elan: {
    stat: 'elan',
    tier: 'solo',
    narrativeSuccess:
      'You practice bayonet forms alone \u2014 thrust, parry, strike. The bayonet feels lighter, faster, more like an extension of your arm. Your skills sharpen.',
    narrativeFail:
      "You practice bayonet forms alone \u2014 thrust, parry, strike. Your movements are heavy, slow. You're not getting any better.",
    narrativeCapped:
      "You practice bayonet forms alone \u2014 thrust, parry, strike. You've learned all you can on your own.",
  },
  comrades_musketry: {
    stat: 'musketry',
    tier: 'comrades',
    narrativeSuccess:
      "The section lines up and runs volley drill together. The shared discipline sharpens everyone. You're getting better.",
    narrativeFail:
      "The section lines up and runs volley drill together. Your contributions are sub par. You're not getting better.",
    narrativeCapped:
      'The section lines up and runs volley drill together. The squad drill is crisp and professional. Your skills demand elite training.',
  },
  comrades_elan: {
    stat: 'elan',
    tier: 'comrades',
    narrativeSuccess:
      "You spar with one of your fellow soldiers. Your weapon feels lighter. You're getting better.",
    narrativeFail:
      "You spar with one of your fellow soldiers. The bruises will heal. You're not getting any better.",
    narrativeCapped:
      'You spar with one of your fellow soldiers. Your movements are deft and surefooted. Your skills demand elite training.',
  },
  officers_musketry: {
    stat: 'musketry',
    tier: 'officers',
    narrativeSuccess:
      'The Lieutenant corrects your form. "You waste movement here. And here." He adjusts your grip, your elbow, the angle of the ramrod. Small things. You\'re getting better.',
    narrativeFail:
      'The Lieutenant corrects your form. "Better. Again." But today your hands refuse to unlearn what they know. You\'re not getting any better.',
    narrativeCapped:
      'The Lieutenant watches you load and fire. He says nothing for a long time. "I have nothing more to teach you," he says finally. You are truly a master musketeer.',
  },
  officers_elan: {
    stat: 'elan',
    tier: 'officers',
    narrativeSuccess:
      "The Captain agrees to train you. What follows is humbling and instructive in equal measure. You're getting better.",
    narrativeFail:
      'The Captain puts you through the formal positions \u2014 tierce, quarte, sixte. Your feet tangle. "Again. Slower." "Again!" The lesson is long and the progress invisible. You\'re not getting any better.',
    narrativeCapped:
      'The Captain salutes you. "You have the makings of a master swordsman," he says. The rest you must learn in battle.',
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
    log.push({
      day: camp.day,
      type: 'result',
      text: `${statLabel} capped. Nothing more to learn here.`,
    });
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

  log.push({
    day: camp.day,
    type: 'activity',
    text: success ? config.narrativeSuccess : config.narrativeFail,
  });
  log.push({ day: camp.day, type: 'result', text: statResultText(config.stat, success) });

  return {
    log,
    statChanges: success ? { [config.stat]: 1 } : {},
    staminaChange: -10,
    moraleChange: success ? 1 : -1,
  };
}
