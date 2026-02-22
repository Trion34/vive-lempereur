import {
  CampActivityId, CampActivity, CampActivityResult, CampLogEntry,
  CampState, CampEvent, CampEventCategory, CampEventResult,
  PlayerCharacter, NPC, ExerciseSubActivity, ArmsTrainingSubActivity, RestSubActivity, DutySubActivity,
} from '../types';
import { rollStat, displayRoll, displayTarget, Difficulty, getPlayerStat } from './stats';
import { resolveExercise, resolveArmsTraining, resolveRest, statResultText } from './campActivities';

// === PRE-BATTLE ACTIVITIES ===

export function getPreBattleActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return [
    {
      id: CampActivityId.Rest,
      name: 'Rest',
      description: 'Rest your body and mind.',
      staminaCost: 0,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Exercise,
      name: 'Exercise',
      description: 'Physical training.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.ArmsTraining,
      name: 'Arms Training',
      description: 'Hone your combat skills.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Duties,
      name: 'Duties',
      description: 'Drill, scout, or volunteer.',
      staminaCost: 10,
      available: true,
    },
    {
      id: CampActivityId.Socialize,
      name: 'Socialize',
      description: 'Sit with a comrade by the fire.',
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
      npcChanges: [{ npcId: target.id, relationship: 8 }],
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
      npcChanges: [{ npcId: target.id, relationship: -2 }],
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

  const events = getAllPreBattleEvents(player, npcs)
    .filter(e => !camp.triggeredEvents.includes(e.id));
  if (events.length === 0) return undefined;
  return events[Math.floor(Math.random() * events.length)];
}

// Officer's Briefing — forced at 4 actions remaining, not random
export function getBriefingEvent(): CampEvent {
  return {
    id: 'prebattle_briefing',
    category: CampEventCategory.Orders,
    title: 'Officer\'s Briefing',
    narrative: 'Your section is drawing cartridges from the supply wagon when Sergeant Duval appears. "Dawn. Austrians from the north. Three columns at least." He looks along the line. "Front rank needs filling." The section goes quiet.',
    choices: [
      { id: 'volunteer', label: 'Volunteer for front rank', description: 'Step forward. Where the danger is greatest. [Valor check]', statCheck: { stat: 'valor', difficulty: 0 } },
      { id: 'stay_quiet', label: 'Stay quiet', description: 'The front rank is for the brave or the foolish.' },
    ],
    resolved: false,
  };
}

// Bonaparte event — forced at 1 action remaining, not random
export function getBonaparteEvent(): CampEvent {
  return {
    id: 'prebattle_bonaparte',
    category: CampEventCategory.Orders,
    title: 'Bonaparte Rides Past',
    narrative: 'A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.',
    choices: [
      { id: 'stand_tall', label: 'Continue', description: '', statCheck: { stat: 'valor', difficulty: 0 } },
    ],
    resolved: false,
  };
}

// Austrian Campfires — forced at 6 actions remaining, not random
export function getCampfiresEvent(): CampEvent {
  return {
    id: 'prebattle_campfires',
    category: CampEventCategory.Rumour,
    title: 'Austrian Campfires',
    narrative: 'A thick fog has settled over the plateau, rolling up from the Adige gorge, obscuring your surroundings.\n\nBut out there, on the ridges to the north — Austrian campfires, bleeding through the fog like dim orange ghosts.',
    choices: [
      { id: 'steady_men', label: 'Steady the nervous', description: 'Find the right words. Keep the fear from spreading. [Charisma check]', statCheck: { stat: 'charisma', difficulty: 15 } },
      { id: 'count_them', label: 'Try to count them', description: 'Study the fires. How many columns? [Awareness check]', statCheck: { stat: 'awareness', difficulty: -15 } },
    ],
    resolved: false,
  };
}

function getAllPreBattleEvents(player: PlayerCharacter, npcs: NPC[]): CampEvent[] {
  return [
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
      narrative: 'The quartermaster distributes what passes for supper: a quarter-loaf of hard bread, a sliver of cheese, a cup of thin broth. It is not enough. It was never going to be enough. Jean-Baptiste stares at your portion. He has already finished his own.',
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
        { id: 'truth', label: 'Tell him the truth', description: '"Everyone\'s afraid. The brave ones just march anyway." [Valor check]', statCheck: { stat: 'valor', difficulty: 0 } },
        { id: 'silence', label: 'Say nothing', description: 'Sit with him in the dark. Sometimes presence is enough.' },
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
  let rollData: { stat: string; roll: number; target: number; passed: boolean } | undefined;
  if (choice.statCheck) {
    const statVal = getPlayerStat(player, choice.statCheck.stat) || 30;
    const result = rollStat(statVal, 0, choice.statCheck.difficulty);
    checkPassed = result.success;
    rollData = {
      stat: choice.statCheck.stat.charAt(0).toUpperCase() + choice.statCheck.stat.slice(1),
      roll: displayRoll(result.roll),
      target: displayTarget(result.target),
      passed: result.success,
    };
  }

  const outcome = resolvePreBattleOutcome(event.id, choiceId, checkPassed, player, npcs, day);
  if (rollData) outcome.rollDisplay = rollData;
  return outcome;
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
  let staminaChange = 0;
  const npcChanges: { npcId: string; relationship: number }[] = [];

  switch (eventId) {
    case 'prebattle_bonaparte':
      if (checkPassed) {
        log.push({ day, type: 'result', text: 'You stand straight. Musket grounded. Eyes forward. Bonaparte\'s gaze sweeps over you \u2014 or maybe it doesn\'t. It doesn\'t matter. You stood like a soldier when the general rode past. The men around you noticed.' });
        moraleChange = 3;
        statChanges.soldierRep = 1;
        statChanges.napoleonRep = 2;
      } else {
        log.push({ day, type: 'result', text: 'You keep low, face turned to the fire. The general passes. No one notices you. That was the point. But something nags \u2014 a missed moment, a chance to be seen. The feeling fades. Survival is its own reward.' });
        moraleChange = 0;
      }
      break;

    case 'prebattle_campfires':
      if (choiceId === 'steady_men') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"Fires," you say, loud enough for the men nearby. "That\'s all they are. Fires. And tomorrow we\'ll put them out." A few men laugh \u2014 short, nervous laughs. But the tension breaks, just a little. Enough.' });
          moraleChange = 3;
          statChanges.soldierRep = 2;
        } else {
          log.push({ day, type: 'result', text: '"They\'re just campfires," you say, but your voice comes out thin. No one laughs. A few men glance at you and look away. The fires keep burning.' });
          moraleChange = -1;
        }
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You study the fires carefully, tracing their spread across the ridgeline. Five distinct clusters. Five columns, approaching from different directions. You report it to the sergeant. "Good eyes," Duval says. Information that might matter tomorrow.' });
          moraleChange = 3;
          statChanges.officerRep = 3;
        } else {
          log.push({ day, type: 'result', text: 'You try to count the fires but they blur together into a single carpet of light. Three columns? Five? Twenty? The darkness gives no answers. You stare until your eyes ache.' });
          moraleChange = -2;
        }
      }
      break;

    case 'prebattle_pierre_story':
      if (choiceId === 'listen') {
        log.push({ day, type: 'result', text: 'You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.' });
        moraleChange = 2;
        const pierre = npcs.find(n => n.id === 'pierre');
        if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 6 });
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks \u2014 not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That\'s what matters." His voice is steady. Yours is steadier for hearing it.' });
          moraleChange = 3;
          statChanges.valor = 1;
          const pierre = npcs.find(n => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 8 });
        } else {
          log.push({ day, type: 'result', text: '"Tell me about\u2014" Pierre cuts you off with a look. "No." The silence afterward is heavier than the darkness. You leave him to his fire and his ghosts.' });
          moraleChange = -1;
          const pierre = npcs.find(n => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: -3 });
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
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 8 });
        } else {
          log.push({ day, type: 'result', text: 'You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.' });
          moraleChange = -1;
          staminaChange = -5;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6 });
        }
      }
      break;

    case 'prebattle_jb_fear':
      if (choiceId === 'reassure') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.' });
          moraleChange = 3;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 10 });
        } else {
          log.push({ day, type: 'result', text: 'You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You\'re afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.' });
          moraleChange = -5;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 2 });
        }
      } else if (choiceId === 'truth') {
        const pierre = npcs.find(n => n.id === 'pierre');
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"Everyone\'s afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.' });
          moraleChange = 2;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 5 });
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 2 });
        } else {
          log.push({ day, type: 'result', text: '"Everyone\'s afraid," you say. But the words come out wrong — too blunt, too hard. Jean-Baptiste flinches like you struck him. "So there\'s no hope then," he whispers. You meant to be honest. Instead you made it worse.' });
          moraleChange = -2;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: -2 });
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 2 });
        }
      } else {
        log.push({ day, type: 'result', text: 'You sit beside him in the dark. You don\'t speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.' });
        moraleChange = 2;
        const jb = npcs.find(n => n.id === 'jean-baptiste');
        if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6 });
      }
      break;

    case 'prebattle_briefing':
      if (choiceId === 'volunteer') {
        player.frontRank = true;
        const duval = npcs.find(n => n.id === 'duval');
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You step forward. Duval looks at you. "Good man."\n\nBehind you, a movement. Pierre steps up, quiet and steady, taking his place at your shoulder. Then Jean-Baptiste, white as chalk, falls in beside you without a word.\n\nThe front rank. Where the first volley hits. Where the lines meet. You volunteered. They followed.' });
          moraleChange = 2;
          statChanges.soldierRep = 3;
          statChanges.officerRep = 3;
          if (duval) npcChanges.push({ npcId: 'duval', relationship: 5 });
        } else {
          log.push({ day, type: 'result', text: 'You step forward, but your voice catches. Duval looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank."\n\nPierre is already beside you — he would have volunteered anyway. Then Jean-Baptiste stumbles forward, hands shaking, refusing to meet anyone\'s eyes. But he is there. Your legs feel like water. But you are in the front rank. All three of you.' });
          moraleChange = -3;
          statChanges.soldierRep = 1;
          statChanges.officerRep = 1;
          if (duval) npcChanges.push({ npcId: 'duval', relationship: 3 });
        }
      } else {
        log.push({ day, type: 'result', text: 'You stay silent. The sergeant\'s eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you.' });
        moraleChange = -3;
      }
      break;


    default:
      log.push({ day, type: 'result', text: 'The moment passes.' });
      break;
  }

  return { log, statChanges, moraleChange, staminaChange: staminaChange !== 0 ? staminaChange : undefined, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
}
