import {
  CampActivityId, CampActivity, CampActivityResult, CampLogEntry,
  CampState, CampEvent, CampEventCategory, CampEventResult,
  PlayerCharacter, NPC,
} from '../types';
import { rollStat, Difficulty } from './stats';

// === PRE-BATTLE ACTIVITIES ===

export function getPreBattleActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return [
    {
      id: CampActivityId.Rest,
      name: 'Rest',
      description: 'Sleep while you can. Tomorrow there will be no rest.',
      fatigueCost: 0,
      available: true,
    },
    {
      id: CampActivityId.MaintainEquipment,
      name: 'Check Equipment',
      description: 'Strip and clean the musket. Sharpen the bayonet. Check your flints.',
      fatigueCost: 10,
      available: true,
    },
    {
      id: CampActivityId.Drill,
      name: 'Drill',
      description: 'Run through the manual of arms. Load, present, fire. Again.',
      fatigueCost: 15,
      available: true,
    },
    {
      id: CampActivityId.Socialize,
      name: 'Socialize',
      description: 'Sit with a comrade by the fire. The last night before battle.',
      fatigueCost: 5,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Scout,
      name: 'Scout the Ground',
      description: 'Walk the plateau. Learn the terrain before the fighting starts.',
      fatigueCost: 10,
      available: true,
    },
    {
      id: CampActivityId.WriteLetters,
      name: 'Write a Letter',
      description: 'Write home. It might be the last one.',
      fatigueCost: 5,
      available: true,
    },
    {
      id: CampActivityId.Pray,
      name: 'Pray',
      description: 'Find a quiet place. Say the words you remember.',
      fatigueCost: 0,
      available: true,
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
    case CampActivityId.Rest: return resolveRest(camp);
    case CampActivityId.MaintainEquipment: return resolveCheckEquipment(player, camp);
    case CampActivityId.Drill: return resolveDrill(player, camp);
    case CampActivityId.Socialize: return resolveSocialize(player, npcs, camp, targetNpcId);
    case CampActivityId.Scout: return resolveScout(player, camp);
    case CampActivityId.WriteLetters: return resolveWriteLetter(player, camp);
    case CampActivityId.Pray: return resolvePray(camp);
    default: return { log: [], statChanges: {}, fatigueChange: 0, moraleChange: 0 };
  }
}

function resolveRest(camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const narratives = [
    'You find a sheltered spot behind a stone wall and pull your greatcoat tight. The cold seeps through anyway. Sleep comes in fragments \u2014 you dream of drums, of white coats in the mist, of home.',
    'You lie down near the fire and close your eyes. Around you, men talk in low voices. Someone is praying. Someone else is sharpening a bayonet. The sound of steel on stone follows you into sleep.',
    'Sleep. Restless, shallow sleep \u2014 broken by the stamp of sentries and the distant howl of wind through the gorge. But it is sleep, and tomorrow you will need every hour of it.',
  ];
  log.push({ day: camp.day, text: narratives[Math.floor(Math.random() * narratives.length)], type: 'activity' });

  return {
    log,
    statChanges: {},
    fatigueChange: 20,
    moraleChange: 3,
  };
}

function resolveCheckEquipment(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.dexterity, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You strip the Charleville down to its parts. Clean the lock. Oil the frizzen. Test the spring. The bayonet gets sharpened until it catches light. When you\'re done, the musket is as ready as it will ever be. So are you.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Equipment ready. Confidence improved.' });
    return {
      log,
      statChanges: {},
      fatigueChange: -10,
      moraleChange: 2,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You clean the musket but the lock spring feels weak. The frizzen is pitted. You do what you can with what you have, but the Charleville has seen better days. It will fire. Probably.',
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -10,
      moraleChange: 0,
    };
  }
}

function resolveDrill(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.dexterity, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You find a clear space and run the drill. Bite. Pour. Ram. Prime. Present. Your hands remember what your mind forgets. Sergeant Duval watches from across the fire. He says nothing, but he nods. Once.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Dexterity improved. The sergeant noticed.' });
    return {
      log,
      statChanges: { dexterity: 1, ncoApproval: 5 },
      fatigueChange: -15,
      moraleChange: 0,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'The drill goes badly. Your fingers are stiff with cold and your hands fumble the cartridge. Duval walks past. "Again." You drill until your arms ache. Not perfect, but better than before.',
    });
    return {
      log,
      statChanges: { ncoApproval: 2 },
      fatigueChange: -15,
      moraleChange: -1,
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
    log.push({ day: camp.day, type: 'activity', text: 'You sit by the fire alone. The night presses in. Tomorrow presses harder.' });
    return { log, statChanges: {}, fatigueChange: -5, moraleChange: -1 };
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
      fatigueChange: -5,
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
      fatigueChange: -5,
      moraleChange: 0,
      npcChanges: [{ npcId: target.id, relationship: -2, trust: 0 }],
    };
  }
}

function resolveScout(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.awareness, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You walk the plateau in the grey pre-dawn. Stone walls. Vineyards. Broken ground that will channel the fighting. You note the ravine on the left, the battery position on the ridge, the gorge where the Adige cuts through. Knowledge. The only advantage a soldier can make for himself.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Awareness improved. You know the ground.' });
    return {
      log,
      statChanges: { awareness: 1 },
      fatigueChange: -10,
      moraleChange: 2,
    };
  } else {
    log.push({
      day: camp.day, type: 'activity',
      text: 'You walk the plateau but the darkness and the cold defeat you. The ground is rough, the landmarks invisible. You stumble back to camp with frozen feet and nothing learned. Tomorrow you will fight on ground you do not know.',
    });
    return {
      log,
      statChanges: {},
      fatigueChange: -10,
      moraleChange: -1,
    };
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
    log.push({ day: camp.day, type: 'result', text: 'A good letter. Reputation improved.' });
    return {
      log,
      statChanges: { reputation: 2 },
      fatigueChange: -5,
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
      fatigueChange: -5,
      moraleChange: 2,
    };
  }
}

function resolvePray(camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const narratives = [
    'You find a quiet spot behind a low wall, away from the fires. The stars are very bright. The Alps are black shapes against the sky. You don\'t know the right words \u2014 you never did \u2014 so you say the ones you remember from childhood. It doesn\'t fix anything. But something loosens in your chest.',
    'You kneel in the frozen grass. The words come haltingly \u2014 half-remembered prayers from a church you haven\'t seen in years. The cold bites your knees. The wind carries the sound away. But for a moment, the war is very small and something else is very large.',
    'You close your eyes and speak to whatever is listening. You don\'t ask to survive \u2014 that feels greedy. You ask for courage. You ask to not let down the men beside you. The silence that answers is not empty. It is patient.',
  ];
  log.push({ day: camp.day, text: narratives[Math.floor(Math.random() * narratives.length)], type: 'activity' });

  return {
    log,
    statChanges: { valor: 1 },
    fatigueChange: 0,
    moraleChange: 4,
  };
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

function getAllPreBattleEvents(player: PlayerCharacter, npcs: NPC[]): CampEvent[] {
  return [
    {
      id: 'prebattle_bonaparte',
      category: CampEventCategory.Orders,
      title: 'Bonaparte Rides Past',
      narrative: 'A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.',
      choices: [
        { id: 'stand_tall', label: 'Stand tall', description: 'Let him see a soldier ready for tomorrow.' },
        { id: 'keep_down', label: 'Keep your head down', description: 'Attention from generals is rarely good.' },
      ],
      resolved: false,
    },
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
): CampEventResult {
  const choice = event.choices.find(c => c.id === choiceId);
  if (!choice) {
    return { log: [], statChanges: {}, moraleChange: 0 };
  }

  event.resolved = true;

  let checkPassed = true;
  if (choice.statCheck) {
    const stat = (player as any)[choice.statCheck.stat] as number || 30;
    const result = rollStat(stat, 0, choice.statCheck.difficulty);
    checkPassed = result.success;
  }

  return resolvePreBattleOutcome(event.id, choiceId, checkPassed, player, npcs);
}

function resolvePreBattleOutcome(
  eventId: string,
  choiceId: string,
  checkPassed: boolean,
  player: PlayerCharacter,
  npcs: NPC[],
): CampEventResult {
  const log: CampLogEntry[] = [];
  const statChanges: Partial<Record<string, number>> = {};
  let moraleChange = 0;
  const npcChanges: { npcId: string; relationship: number; trust: number }[] = [];

  switch (eventId) {
    case 'prebattle_bonaparte':
      if (choiceId === 'stand_tall') {
        log.push({ day: 0, type: 'result', text: 'You stand straight. Musket grounded. Eyes forward. Bonaparte\'s gaze sweeps over you \u2014 or maybe it doesn\'t. It doesn\'t matter. You stood like a soldier when the general rode past. The men around you noticed.' });
        moraleChange = 3;
        statChanges.reputation = 2;
      } else {
        log.push({ day: 0, type: 'result', text: 'You keep low, face turned to the fire. The general passes. No one notices you. That was the point. But something nags \u2014 a missed moment, a chance to be seen. The feeling fades. Survival is its own reward.' });
        moraleChange = 0;
      }
      break;

    case 'prebattle_drums':
      if (choiceId === 'steady_men') {
        log.push({ day: 0, type: 'result', text: '"Drums," you say, loud enough for the men nearby. "That\'s all they are. Noise. Tomorrow we\'ll make some noise of our own." A few men laugh \u2014 short, nervous laughs. But the tension breaks, just a little. Enough.' });
        moraleChange = 3;
        statChanges.reputation = 1;
      } else {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: 'You listen carefully, counting the rhythms. Three distinct drumbeats. Three columns, approaching from different directions. You report it to the sergeant. "Good ears," Duval says. Information that might matter tomorrow.' });
          moraleChange = 1;
          statChanges.awareness = 1;
          statChanges.ncoApproval = 3;
        } else {
          log.push({ day: 0, type: 'result', text: 'You try to count the drums but they blur together into a single wall of sound. Three columns? Five? Twenty? The darkness gives no answers. You lie awake listening until the drums finally stop.' });
          moraleChange = -2;
        }
      }
      break;

    case 'prebattle_pierre_story':
      if (choiceId === 'listen') {
        log.push({ day: 0, type: 'result', text: 'You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.' });
        moraleChange = 2;
        const pierre = npcs.find(n => n.id === 'pierre');
        if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 6, trust: 8 });
      } else {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: '"Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks \u2014 not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That\'s what matters." His voice is steady. Yours is steadier for hearing it.' });
          moraleChange = 3;
          statChanges.valor = 1;
          const pierre = npcs.find(n => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 8, trust: 6 });
        } else {
          log.push({ day: 0, type: 'result', text: '"Tell me about\u2014" Pierre cuts you off with a look. "No." The silence afterward is worse than the Austrian drums. You leave him to his fire and his ghosts.' });
          moraleChange = -1;
          const pierre = npcs.find(n => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: -3, trust: -2 });
        }
      }
      break;

    case 'prebattle_rations':
      if (choiceId === 'accept') {
        log.push({ day: 0, type: 'result', text: 'You eat your share slowly, making each bite last. The bread is hard. The cheese is harder. But it is fuel, and tomorrow you will burn through all of it. A soldier eats what he is given and is grateful.' });
        moraleChange = 0;
      } else {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: 'You break your bread in half and push it across to Jean-Baptiste. He stares at it, then at you. "I can\'t\u2014" "Eat it." He eats. Your stomach aches through the night, but your constitution holds. The boy won\'t forget.' });
          moraleChange = 2;
          statChanges.reputation = 2;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 8, trust: 6 });
        } else {
          log.push({ day: 0, type: 'result', text: 'You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.' });
          moraleChange = 1;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6, trust: 4 });
        }
      }
      break;

    case 'prebattle_jb_fear':
      if (choiceId === 'reassure') {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: '"You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.' });
          moraleChange = 3;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 10, trust: 8 });
        } else {
          log.push({ day: 0, type: 'result', text: 'You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You\'re afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.' });
          moraleChange = -1;
          const jb = npcs.find(n => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 2, trust: -2 });
        }
      } else if (choiceId === 'truth') {
        log.push({ day: 0, type: 'result', text: '"Everyone\'s afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.' });
        moraleChange = 2;
        statChanges.valor = 1;
        const jb = npcs.find(n => n.id === 'jean-baptiste');
        if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 5, trust: 6 });
      } else {
        log.push({ day: 0, type: 'result', text: 'You sit beside him in the dark. You don\'t speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.' });
        moraleChange = 2;
        const jb = npcs.find(n => n.id === 'jean-baptiste');
        if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6, trust: 4 });
      }
      break;

    case 'prebattle_briefing':
      if (choiceId === 'volunteer') {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: 'You step forward. Leclerc looks at you. "Good man." The front rank. Where the first volley hits. Where the bayonets meet. Where the brave and the dead are often the same men. You volunteered. The captain will remember.' });
          moraleChange = 2;
          statChanges.valor = 1;
          statChanges.reputation = 3;
          statChanges.ncoApproval = 3;
        } else {
          log.push({ day: 0, type: 'result', text: 'You step forward, but your voice catches. Leclerc looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank." You nod. Your legs feel like water. But you are in the front rank.' });
          moraleChange = -1;
          statChanges.reputation = 1;
        }
      } else {
        log.push({ day: 0, type: 'result', text: 'Others volunteer. You stay silent. The captain\'s eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you. Tomorrow you will stand in the second file. Safer. Quieter.' });
        moraleChange = -1;
      }
      break;

    case 'prebattle_fog':
      if (choiceId === 'check_sentries') {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: 'You find the sentries \u2014 one asleep, one barely awake. You shake them alert and walk the line yourself, peering into the fog. Nothing. Just the wind and the river below. But you are satisfied. The camp is watched. Tomorrow begins with no surprises.' });
          moraleChange = 2;
          statChanges.awareness = 1;
          statChanges.ncoApproval = 2;
        } else {
          log.push({ day: 0, type: 'result', text: 'You walk into the fog and immediately lose your bearings. Every direction looks the same. A branch cracks and your heart hammers. You stumble back to camp by luck more than skill. The sentries are fine. You are rattled.' });
          moraleChange = -2;
        }
      } else {
        log.push({ day: 0, type: 'result', text: 'You stay by the fire. The fog is someone else\'s problem. The sentries know their business. You pull your coat tighter and try to sleep. The fog muffles everything. By dawn it will burn off, and whatever it hid will be revealed.' });
        moraleChange = 0;
      }
      break;

    case 'prebattle_scout_report':
      if (choiceId === 'verify') {
        if (checkPassed) {
          log.push({ day: 0, type: 'result', text: 'You slip out of camp and climb the north ridge. There \u2014 campfires, hundreds of them, spreading across the valley like a mirror of the stars. You count methodically. The scout was right. The numbers are bad. But now you know the ground, and you report it clearly. The lieutenant is impressed.' });
          moraleChange = 1;
          statChanges.awareness = 1;
          statChanges.reputation = 3;
        } else {
          log.push({ day: 0, type: 'result', text: 'You volunteer, but the darkness and the terrain defeat you. You can\'t find the ridge, can\'t see the campfires, can\'t confirm anything. You stumble back with nothing. The lieutenant says nothing. His silence is worse than criticism.' });
          moraleChange = -2;
        }
      } else if (choiceId === 'report_officer') {
        log.push({ day: 0, type: 'result', text: 'You relay the scout\'s report to your lieutenant. He nods. "We know." Of course they know. The officers always know more than they say. But passing information upward is a soldier\'s duty, and duty noticed is duty rewarded.' });
        moraleChange = 0;
        statChanges.ncoApproval = 2;
      } else {
        log.push({ day: 0, type: 'result', text: 'You ignore the report. You will see the Austrians soon enough \u2014 from the wrong end of their muskets. No point borrowing tomorrow\'s terrors tonight. You try to sleep. The attempt is only partially successful.' });
        moraleChange = -1;
      }
      break;

    default:
      log.push({ day: 0, type: 'result', text: 'The moment passes.' });
      break;
  }

  return { log, statChanges, moraleChange, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
}
