import {
  CampActivityId, CampActivity, CampActivityResult, CampLogEntry,
  CampState, CampEvent, CampEventCategory, CampEventResult,
  PlayerCharacter, NPC, ExerciseSubActivity, ArmsTrainingSubActivity, RestSubActivity, DutySubActivity,
} from '../types';
import { rollStat, Difficulty, getPlayerStat } from './stats';
import { resolveExercise, resolveArmsTraining, resolveRest, statResultText } from './campActivities';

// === PRE-BATTLE ACTIVITIES ===

export function getPreBattleActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
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
      description: 'Physical training. Build your body before the battle.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.ArmsTraining,
      name: 'Arms Training',
      description: 'Practice musketry or bayonet work before the battle.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Duties,
      name: 'Duties',
      description: 'Drill, scout, or volunteer. Show the regiment what you are made of.',
      staminaCost: 10,
      available: true,
    },
    {
      id: CampActivityId.Socialize,
      name: 'Socialize',
      description: 'Sit with a comrade by the fire. The last night before battle.',
      staminaCost: 5,
      available: true,
      requiresTarget: true,
    },
  ];
}

export function resolvePreBattleActivity(
  activityId: CampActivityId,
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
  targetNpcId?: string,
): CampActivityResult {
  switch (activityId) {
    case CampActivityId.Rest: return resolveRest(player, camp, targetNpcId as RestSubActivity | undefined);
    case CampActivityId.MaintainEquipment: return resolveCheckEquipment(player, camp);
    case CampActivityId.Duties: return resolveDuty(player, camp, targetNpcId as DutySubActivity | undefined);
    case CampActivityId.Socialize: return resolveSocialize(player, npcs, camp, targetNpcId);
    case CampActivityId.WriteLetters: return resolveWriteLetter(player, camp);
    case CampActivityId.Exercise: return resolveExercise(player, camp, targetNpcId as ExerciseSubActivity | undefined);
    case CampActivityId.ArmsTraining: return resolveArmsTraining(player, camp, targetNpcId as ArmsTrainingSubActivity | undefined);
    default: return { log: [], statChanges: {}, staminaChange: 0, moraleChange: 0 };
  }
}

function resolveCheckEquipment(player: PlayerCharacter, camp: CampState): CampActivityResult {
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
      text: 'The lock spring is weak. The frizzen is pitted. You do what you can. It will fire. Probably.',
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

function resolveDuty(player: PlayerCharacter, camp: CampState, sub?: DutySubActivity): CampActivityResult {
  if (sub === 'volunteer') return resolveVolunteer(player, camp);
  if (sub === 'check_equipment') return resolveCheckEquipment(player, camp);
  return resolveDrill(player, camp);
}

function resolveDrill(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.musketry, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Bite. Pour. Ram. Prime. Present. Duval watches from across the fire. He nods. Once.',
    });
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'Your fingers are stiff with cold. The cartridge fumbles. Duval walks past. "Again."',
    });
  }
  log.push({ day: camp.day, type: 'result', text: statResultText('musketry', check.success) });

  return {
    log,
    statChanges: check.success ? { musketry: 1, officerRep: 5 } : { officerRep: 2 },
    staminaChange: -15,
    moraleChange: check.success ? 0 : -1,
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
      : 'You sit by the fire alone. The night presses in. Tomorrow presses harder.';
    log.push({ day: camp.day, type: 'activity', text });
    return { log, statChanges: {}, staminaChange: -5, moraleChange: -1 };
  }

  const check = rollStat(player.charisma, 0, Difficulty.Standard);

  if (check.success) {
    const narratives: Record<string, string> = {
      stoic: `Pierre sits cleaning his bayonet by the fire. He doesn't look up when you sit down. You don't speak. The fire crackles. After a long while: "Arcole was worse." A pause. "We held there too." That is Pierre's way of saying: we will hold tomorrow.`,
      nervous: `Jean-Baptiste is hunched by the fire, turning a button over and over in his fingers. He looks up when you sit down. "Do you think it will be bad?" he asks. You talk. Not about tomorrow \u2014 about home, about the road south, about the time the sergeant fell in the river. He almost smiles.`,
      bitter: `${target.name} scowls at the fire. "Twenty-eight thousand, they say. Against us." He spits. "Politicians start wars. We finish them." But when you offer your tobacco, he takes it. And the conversation that follows is almost warm.`,
      jovial: `${target.name} has found wine from somewhere \u2014 sour Italian red, barely drinkable. He pours you a measure in a tin cup. "To tomorrow," he says, and grins. "May we live to complain about it." You drink. The wine is terrible. The company is not.`,
      devout: `${target.name} is praying quietly, rosary beads clicking. He opens his eyes when you sit down. "Will you pray with me?" You bow your head. The words are old and familiar. In this moment, on this freezing plateau, they mean more than they ever have.`,
      ambitious: `${target.name} is studying the ground by firelight, sketching lines in the dirt with a stick. "The Austrians will come from the north," he says. "If we hold here..." He looks at you. "Tomorrow is where reputations are made." His eyes shine. You find yourself believing him.`,
    };
    const narrative = narratives[target.personality] ||
      `You sit with ${target.name} by the fire. Words come slowly at first, then easier. Tomorrow you will stand together in the line. Tonight, you are comrades.`;
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
      text: `You try to talk with ${target.name}, but neither of you can find the right words tonight. The silence between you fills with everything neither of you wants to say about tomorrow. You excuse yourself and walk back to your own fire.`,
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

function resolveVolunteer(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  // Army assigns you a random task
  const tasks = ['sentry', 'scout', 'dispatches', 'dig'] as const;
  const task = tasks[Math.floor(Math.random() * tasks.length)];

  switch (task) {
    case 'sentry': {
      const check = rollStat(player.awareness, 0, Difficulty.Standard);
      if (check.success) {
        log.push({ day: camp.day, type: 'activity',
          text: 'You draw sentry duty on the north perimeter.' });
        log.push({ day: camp.day, type: 'result',
          text: 'SENTRY DUTY — The cold is brutal, but you keep your eyes open and your ears sharp. When the corporal checks on you at midnight, you report every sound, every shadow. He grunts approval. The officers value a man who can be trusted on the perimeter.\n\nAwareness check: PASSED\nOfficer Rep +3' });
        return { log, statChanges: { officerRep: 3 }, staminaChange: -12, moraleChange: 0 };
      } else {
        log.push({ day: camp.day, type: 'activity',
          text: 'You draw sentry duty on the north perimeter.' });
        log.push({ day: camp.day, type: 'result',
          text: 'SENTRY DUTY — The cold seeps through your coat, through your skin, into your bones. Your eyes droop. The corporal finds you leaning against a tree, half-asleep. "If the Austrians come tonight, you\'ll be the reason we all die." The shame burns worse than the cold.\n\nAwareness check: FAILED\nOfficer Rep -2 | Morale -2' });
        return { log, statChanges: { officerRep: -2 }, staminaChange: -12, moraleChange: -2 };
      }
    }
    case 'scout': {
      const check = rollStat(player.awareness, 0, Difficulty.Standard);
      if (check.success) {
        log.push({ day: camp.day, type: 'activity',
          text: 'A corporal picks you for a patrol of the plateau.' });
        log.push({ day: camp.day, type: 'result',
          text: 'SCOUT THE GROUND — Stone walls. Ravines. The battery position on the ridge. You notice a shallow ditch that could shelter a squad \u2014 the corporal marks it. "Good eyes, soldier." Useful reconnaissance. He\'ll remember the man who spotted it.\n\nAwareness check: PASSED\nOfficer Rep +2 | Morale +1' });
        return { log, statChanges: { officerRep: 2 }, staminaChange: -10, moraleChange: 1 };
      } else {
        log.push({ day: camp.day, type: 'activity',
          text: 'A corporal picks you for a patrol of the plateau.' });
        log.push({ day: camp.day, type: 'result',
          text: 'SCOUT THE GROUND — The darkness and cold defeat you. Frozen feet, numb hands. You stumble on a rock and nearly fire your musket by accident. The corporal says nothing. He doesn\'t need to. Nothing useful to report.\n\nAwareness check: FAILED\nOfficer Rep -1 | Morale -1' });
        return { log, statChanges: { officerRep: -1 }, staminaChange: -10, moraleChange: -1 };
      }
    }
    case 'dispatches': {
      const check = rollStat(player.endurance, 0, Difficulty.Standard);
      if (check.success) {
        log.push({ day: camp.day, type: 'activity',
          text: 'You\'re sent running dispatches between officer positions.' });
        log.push({ day: camp.day, type: 'result',
          text: 'CARRY DISPATCHES — Across the frozen plateau, through the dark, finding officers by firelight. Your legs burn but you don\'t slow down. The lieutenant nods when you deliver the last message, barely winded. A soldier who can be relied upon.\n\nEndurance check: PASSED\nOfficer Rep +2' });
        return { log, statChanges: { officerRep: 2 }, staminaChange: -15, moraleChange: 0 };
      } else {
        log.push({ day: camp.day, type: 'activity',
          text: 'You\'re sent running dispatches between officer positions.' });
        log.push({ day: camp.day, type: 'result',
          text: 'CARRY DISPATCHES — The plateau is dark and confusing. You take a wrong turn, lose precious minutes, arrive gasping and late. The lieutenant takes the dispatch without looking at you. You have wasted his time.\n\nEndurance check: FAILED\nOfficer Rep -1 | Morale -1' });
        return { log, statChanges: { officerRep: -1 }, staminaChange: -15, moraleChange: -1 };
      }
    }
    case 'dig': {
      const check = rollStat(player.strength, 0, Difficulty.Standard);
      if (check.success) {
        log.push({ day: camp.day, type: 'activity',
          text: 'You\'re put on entrenchment detail.' });
        log.push({ day: camp.day, type: 'result',
          text: 'DIG POSITIONS — Piling stones, digging shallow trenches in the frozen ground. Your back screams. Your hands blister. But when you\'re done, there\'s a low wall where there wasn\'t one before. The men around you nod. You pulled your weight.\n\nStrength check: PASSED\nOfficer Rep +1 | Soldier Rep +1' });
        return { log, statChanges: { officerRep: 1, soldierRep: 1 }, staminaChange: -18, moraleChange: 0 };
      } else {
        log.push({ day: camp.day, type: 'activity',
          text: 'You\'re put on entrenchment detail.' });
        log.push({ day: camp.day, type: 'result',
          text: 'DIG POSITIONS — The ground is frozen iron. Your pickaxe bounces off rock. The others are moving earth twice as fast. You can\'t keep up. By the end your hands are raw and bleeding, and you\'ve barely shifted a barrow\'s worth. The men notice who works and who doesn\'t.\n\nStrength check: FAILED\nSoldier Rep -1 | Morale -1' });
        return { log, statChanges: { soldierRep: -1 }, staminaChange: -18, moraleChange: -1 };
      }
    }
  }
}

function resolveWriteLetter(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.intelligence, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You write by the light of the fire, the quill scratching against paper balanced on your knee. You do not write about tomorrow. You write about the mountains, the stars, the taste of the bread they gave you in Verona. You write that you are well. You fold the letter carefully and give it to the courier. If the worst happens, these words will outlast you.',
    });
    log.push({ day: camp.day, type: 'result', text: 'A good letter. The men respect a man of letters.' });
    return {
      log,
      statChanges: { soldierRep: 2 },
      staminaChange: -5,
      moraleChange: 5,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You try to write but the words will not come. What do you say to someone who cannot imagine this place? The cold, the waiting, the knowledge of what dawn brings? You write three lines, cross out two, and seal the letter half-empty. It is something. It is not enough.',
    });
    return {
      log,
      statChanges: {},
      staminaChange: -5,
      moraleChange: 2,
    };
  }
}

// === PRE-BATTLE EVENTS ===

export function rollPreBattleEvent(
  camp: CampState,
  player: PlayerCharacter,
  npcs: NPC[],
): CampEvent | undefined {
  if (Math.random() > 0.40) return undefined;

  const events = getAllPreBattleEvents(player, npcs);
  if (events.length === 0) return undefined;
  return events[Math.floor(Math.random() * events.length)];
}

// Bonaparte event — forced at 2 actions remaining, not random
export function getBonaparteEvent(): CampEvent {
  return {
    id: 'prebattle_bonaparte',
    category: CampEventCategory.Orders,
    title: 'Bonaparte Rides Past',
    narrative: 'A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.',
    choices: [
      { id: 'stand_tall', label: 'Stand tall', description: 'Let him see a soldier ready for tomorrow.' },
      { id: 'keep_down', label: 'Keep your head down', description: 'Attention from generals is rarely good.' },
    ],
    resolved: false,
  };
}

function getAllPreBattleEvents(player: PlayerCharacter, npcs: NPC[]): CampEvent[] {
  return [
    {
      id: 'prebattle_drums',
      category: CampEventCategory.Rumour,
      title: 'Austrian Drums',
      narrative: 'The wind shifts. From the north, carried over the plateau, comes the distant sound of drums. Austrian drums. Thousands of them, rolling like thunder that will not stop. The camp goes quiet. Men look at each other. The sound says: we are coming. We are many.',
      choices: [
        { id: 'steady_men', label: 'Steady the nervous', description: 'Find the right words. Keep the fear from spreading.' },
        { id: 'count_them', label: 'Try to count them', description: 'Listen carefully. How many columns? [Awareness check]', statCheck: { stat: 'awareness', difficulty: -15 } },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_pierre_story',
      category: CampEventCategory.Interpersonal,
      title: 'Pierre\'s Story',
      narrative: 'Pierre is sitting apart from the others, staring into the fire. His face is unreadable. He has been at Arcole, at Lodi, at a dozen fights whose names you barely know. He has not spoken all evening. But there is something in his silence tonight that is different. Heavier.',
      choices: [
        { id: 'listen', label: 'Listen', description: 'Sit beside him. Wait for him to speak.' },
        { id: 'ask_arcole', label: 'Ask about Arcole', description: 'Draw him out. [Charisma check]', statCheck: { stat: 'charisma', difficulty: 0 } },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_rations',
      category: CampEventCategory.Supply,
      title: 'Short Rations',
      narrative: 'The quartermaster distributes what passes for supper: a quarter-loaf of hard bread, a sliver of cheese, a cup of thin broth. It is not enough. It was never going to be enough. Jean-Baptiste stares at his portion. He has already eaten his.',
      choices: [
        { id: 'accept', label: 'Accept your share', description: 'Eat what you are given. A soldier endures.' },
        { id: 'share_jb', label: 'Share with Jean-Baptiste', description: 'Give him half your bread. [Constitution check]', statCheck: { stat: 'constitution', difficulty: 0 } },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_jb_fear',
      category: CampEventCategory.Interpersonal,
      title: 'Jean-Baptiste\'s Fear',
      narrative: 'You find Jean-Baptiste behind the supply wagon, sitting in the dark. His hands are shaking.\n\n"I can\'t do it," he whispers. "Tomorrow. The line. I can\'t."\n\nHe\'s not the only one thinking it. He\'s just the only one saying it out loud.',
      choices: [
        { id: 'reassure', label: 'Reassure him', description: '"You can. You will. Stay beside me." [Charisma check]', statCheck: { stat: 'charisma', difficulty: 0 } },
        { id: 'truth', label: 'Tell him the truth', description: '"Everyone\'s afraid. The brave ones just march anyway."' },
        { id: 'silence', label: 'Say nothing', description: 'Sit with him in the dark. Sometimes presence is enough.' },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_briefing',
      category: CampEventCategory.Orders,
      title: 'Officer\'s Briefing',
      narrative: 'Captain Leclerc gathers the company around a fire. He draws lines in the dirt with his sword. "The Austrians will come from the north. Three columns, maybe four. We hold this plateau. We hold it or we die on it." He looks up. "I need men for the front rank."',
      choices: [
        { id: 'volunteer', label: 'Volunteer for front rank', description: 'Step forward. Where the danger is greatest. [Valor check]', statCheck: { stat: 'valor', difficulty: 0 } },
        { id: 'stay_quiet', label: 'Stay quiet', description: 'The front rank is for the brave or the foolish.' },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_fog',
      category: CampEventCategory.Weather,
      title: 'Fog Rolling In',
      narrative: 'A thick fog rolls up from the Adige gorge, swallowing the plateau. The fires become dim orange ghosts. The sentries vanish. Sounds are muffled and strange \u2014 a cough becomes a footstep, the wind becomes a whispered order. In this fog, an army could march right up to the camp.',
      choices: [
        { id: 'check_sentries', label: 'Check the sentries', description: 'Make sure they are awake and alert. [Awareness check]', statCheck: { stat: 'awareness', difficulty: 0 } },
        { id: 'stay_fire', label: 'Stay by the fire', description: 'The sentries know their business. You need your rest.' },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_scout_report',
      category: CampEventCategory.Rumour,
      title: 'Scout Report',
      narrative: 'A scout stumbles into camp, half-frozen, with news: the Austrian vanguard is closer than expected. Campfires visible on the north slope. Cavalry on the road from the Tyrol. The numbers are worse than anyone thought. The officers huddle. The men pretend not to listen.',
      choices: [
        { id: 'verify', label: 'Volunteer to verify', description: 'Go see for yourself. [Awareness check]', statCheck: { stat: 'awareness', difficulty: -15 } },
        { id: 'report_officer', label: 'Report to the officer', description: 'Pass the information up the chain.' },
        { id: 'ignore', label: 'Ignore it', description: 'You will see the Austrians soon enough.' },
      ],
      resolved: false,
    },
  ];
}

export function resolvePreBattleEventChoice(
  event: CampEvent,
  choiceId: string,
  player: PlayerCharacter,
  npcs: NPC[],
  day: number = 1,
): CampEventResult {
  const choice = event.choices.find(c => c.id === choiceId);
  if (!choice) {
    return { log: [], statChanges: {}, moraleChange: 0 };
  }

  event.resolved = true;

  let checkPassed = true;
  if (choice.statCheck) {
    const stat = getPlayerStat(player, choice.statCheck.stat) || 30;
    const result = rollStat(stat, 0, choice.statCheck.difficulty);
    checkPassed = result.success;
  }

  return resolvePreBattleOutcome(event.id, choiceId, checkPassed, player, npcs, day);
}

function resolvePreBattleOutcome(
  eventId: string,
  choiceId: string,
  checkPassed: boolean,
  player: PlayerCharacter,
  npcs: NPC[],
  day: number,
): CampEventResult {
  const log: CampLogEntry[] = [];
  const statChanges: Partial<Record<string, number>> = {};
  let moraleChange = 0;
  const npcChanges: { npcId: string; relationship: number; trust: number }[] = [];

  switch (eventId) {
    case 'prebattle_bonaparte':
      if (choiceId === 'stand_tall') {
        log.push({ day, type: 'result', text: 'You stand straight. Musket grounded. Eyes forward. Bonaparte\'s gaze sweeps over you \u2014 or maybe it doesn\'t. It doesn\'t matter. You stood like a soldier when the general rode past. The men around you noticed.' });
        moraleChange = 3;
        statChanges.soldierRep = 1;
        statChanges.napoleonRep = 2;
      } else {
        log.push({ day, type: 'result', text: 'You keep low, face turned to the fire. The general passes. No one notices you. That was the point. But something nags \u2014 a missed moment, a chance to be seen. The feeling fades. Survival is its own reward.' });
        moraleChange = 0;
      }
      break;

    case 'prebattle_drums':
      if (choiceId === 'steady_men') {
        log.push({ day, type: 'result', text: '"Drums," you say, loud enough for the men nearby. "That\'s all they are. Noise. Tomorrow we\'ll make some noise of our own." A few men laugh \u2014 short, nervous laughs. But the tension breaks, just a little. Enough.' });
        moraleChange = 3;
        statChanges.soldierRep = 1;
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You listen carefully, counting the rhythms. Three distinct drumbeats. Three columns, approaching from different directions. You report it to the sergeant. "Good ears," Duval says. Information that might matter tomorrow.' });
          moraleChange = 1;
          statChanges.awareness = 1;
          statChanges.officerRep = 3;
        } else {
          log.push({ day, type: 'result', text: 'You try to count the drums but they blur together into a single wall of sound. Three columns? Five? Twenty? The darkness gives no answers. You lie awake listening until the drums finally stop.' });
          moraleChange = -2;
        }
      }
      break;

    case 'prebattle_pierre_story':
      if (choiceId === 'listen') {
        log.push({ day, type: 'result', text: 'You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.' });
        moraleChange = 2;
        const pierre = npcs.find(n => n.id === 'pierre');
        if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 6, trust: 8 });
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks \u2014 not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That\'s what matters." His voice is steady. Yours is steadier for hearing it.' });
          moraleChange = 3;
          statChanges.valor = 1;
          const pierre = npcs.find(n => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 8, trust: 6 });
        } else {
          log.push({ day, type: 'result', text: '"Tell me about\u2014" Pierre cuts you off with a look. "No." The silence afterward is worse than the Austrian drums. You leave him to his fire and his ghosts.' });
          moraleChange = -1;
          const pierre = npcs.find(n => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: -3, trust: -2 });
        }
      }
      break;

    case 'prebattle_rations':
      if (choiceId === 'accept') {
        log.push({ day, type: 'result', text: 'You eat your share slowly, making each bite last. The bread is hard. The cheese is harder. But it is fuel, and tomorrow you will burn through all of it. A soldier eats what he is given and is grateful.' });
        moraleChange = 0;
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You break your bread in half and push it across to Jean-Baptiste. He stares at it, then at you. "I can\'t\u2014" "Eat it." He eats. Your stomach aches through the night, but your constitution holds. The boy won\'t forget.' });
          moraleChange = 2;
          statChanges.soldierRep = 2;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 8, trust: 6 });
        } else {
          log.push({ day, type: 'result', text: 'You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.' });
          moraleChange = 1;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6, trust: 4 });
        }
      }
      break;

    case 'prebattle_jb_fear':
      if (choiceId === 'reassure') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.' });
          moraleChange = 3;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 10, trust: 8 });
        } else {
          log.push({ day, type: 'result', text: 'You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You\'re afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.' });
          moraleChange = -1;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 2, trust: -2 });
        }
      } else if (choiceId === 'truth') {
        log.push({ day, type: 'result', text: '"Everyone\'s afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.' });
        moraleChange = 2;
        statChanges.valor = 1;
        const jb = npcs.find(n => n.id === 'jean-baptiste');
        if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 5, trust: 6 });
      } else {
        log.push({ day, type: 'result', text: 'You sit beside him in the dark. You don\'t speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.' });
        moraleChange = 2;
        const jb = npcs.find(n => n.id === 'jean-baptiste');
        if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6, trust: 4 });
      }
      break;

    case 'prebattle_briefing':
      if (choiceId === 'volunteer') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You step forward. Leclerc looks at you. "Good man." The front rank. Where the first volley hits. Where the bayonets meet. Where the brave and the dead are often the same men. You volunteered. The captain will remember.' });
          moraleChange = 2;
          statChanges.valor = 1;
          statChanges.soldierRep = 3;
          statChanges.officerRep = 3;
        } else {
          log.push({ day, type: 'result', text: 'You step forward, but your voice catches. Leclerc looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank." You nod. Your legs feel like water. But you are in the front rank.' });
          moraleChange = -1;
          statChanges.soldierRep = 1;
        }
      } else {
        log.push({ day, type: 'result', text: 'Others volunteer. You stay silent. The captain\'s eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you. Tomorrow you will stand in the second file. Safer. Quieter.' });
        moraleChange = -1;
      }
      break;

    case 'prebattle_fog':
      if (choiceId === 'check_sentries') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You find the sentries \u2014 one asleep, one barely awake. You shake them alert and walk the line yourself, peering into the fog. Nothing. Just the wind and the river below. But you are satisfied. The camp is watched. Tomorrow begins with no surprises.' });
          moraleChange = 2;
          statChanges.awareness = 1;
          statChanges.officerRep = 2;
        } else {
          log.push({ day, type: 'result', text: 'You walk into the fog and immediately lose your bearings. Every direction looks the same. A branch cracks and your heart hammers. You stumble back to camp by luck more than skill. The sentries are fine. You are rattled.' });
          moraleChange = -2;
        }
      } else {
        log.push({ day, type: 'result', text: 'You stay by the fire. The fog is someone else\'s problem. The sentries know their business. You pull your coat tighter and try to sleep. The fog muffles everything. By dawn it will burn off, and whatever it hid will be revealed.' });
        moraleChange = 0;
      }
      break;

    case 'prebattle_scout_report':
      if (choiceId === 'verify') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You slip out of camp and climb the north ridge. There \u2014 campfires, hundreds of them, spreading across the valley like a mirror of the stars. You count methodically. The scout was right. The numbers are bad. But now you know the ground, and you report it clearly. The lieutenant is impressed.' });
          moraleChange = 1;
          statChanges.awareness = 1;
          statChanges.officerRep = 3;
        } else {
          log.push({ day, type: 'result', text: 'You volunteer, but the darkness and the terrain defeat you. You can\'t find the ridge, can\'t see the campfires, can\'t confirm anything. You stumble back with nothing. The lieutenant says nothing. His silence is worse than criticism.' });
          moraleChange = -2;
        }
      } else if (choiceId === 'report_officer') {
        log.push({ day, type: 'result', text: 'You relay the scout\'s report to your lieutenant. He nods. "We know." Of course they know. The officers always know more than they say. But passing information upward is a soldier\'s duty, and duty noticed is duty rewarded.' });
        moraleChange = 0;
        statChanges.officerRep = 2;
      } else {
        log.push({ day, type: 'result', text: 'You ignore the report. You will see the Austrians soon enough \u2014 from the wrong end of their muskets. No point borrowing tomorrow\'s terrors tonight. You try to sleep. The attempt is only partially successful.' });
        moraleChange = -1;
      }
      break;

    default:
      log.push({ day, type: 'result', text: 'The moment passes.' });
      break;
  }

  return { log, statChanges, moraleChange, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
}
