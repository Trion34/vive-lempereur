import {
  CampState, CampEvent, CampEventCategory, CampEventChoice,
  CampEventResult, CampLogEntry, PlayerCharacter, NPC,
} from '../types';
import { rollStat, Difficulty, getPlayerStat } from './stats';

// Roll for a random camp event (40% chance per activity)
export function rollCampEvent(
  camp: CampState,
  player: PlayerCharacter,
  npcs: NPC[],
): CampEvent | undefined {
  if (Math.random() > 0.40) return undefined;

  // Weight categories by conditions
  const categories = getWeightedCategory(camp);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const events = getEventsForCategory(category, player, npcs, camp);

  if (events.length === 0) return undefined;
  return events[Math.floor(Math.random() * events.length)];
}

function getWeightedCategory(camp: CampState): CampEventCategory[] {
  const pool: CampEventCategory[] = [
    CampEventCategory.Interpersonal,
    CampEventCategory.Rumour,
    CampEventCategory.Weather,
  ];

  if (camp.conditions.supplyLevel === 'scarce' || camp.conditions.supplyLevel === 'critical') {
    pool.push(CampEventCategory.Supply, CampEventCategory.Supply);
    pool.push(CampEventCategory.Desertion);
  }
  if (camp.conditions.weather === 'rain' || camp.conditions.weather === 'cold') {
    pool.push(CampEventCategory.Disease);
  }
  pool.push(CampEventCategory.Orders);

  return pool;
}

function getEventsForCategory(
  category: CampEventCategory,
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
): CampEvent[] {
  switch (category) {
    case CampEventCategory.Disease: return getDiseaseEvents(camp);
    case CampEventCategory.Desertion: return getDesertionEvents(npcs);
    case CampEventCategory.Weather: return getWeatherEvents(camp);
    case CampEventCategory.Supply: return getSupplyEvents(camp);
    case CampEventCategory.Interpersonal: return getInterpersonalEvents(player, npcs);
    case CampEventCategory.Orders: return getOrdersEvents(camp);
    case CampEventCategory.Rumour: return getRumourEvents();
    default: return [];
  }
}

// === EVENT GENERATORS ===

function getDiseaseEvents(camp: CampState): CampEvent[] {
  return [
    {
      id: 'disease_fever',
      category: CampEventCategory.Disease,
      title: 'Camp Fever',
      narrative: 'Men are falling sick. The surgeon shakes his head — camp fever, he says. Bad water, bad air. Several soldiers in your company have taken to their blankets with chills and vomiting.',
      choices: [
        { id: 'help_sick', label: 'Help the sick', description: 'Carry water, tend fires. [Constitution check]', statCheck: { stat: 'constitution', difficulty: 0 } },
        { id: 'stay_away', label: 'Keep your distance', description: 'Self-preservation. The surgeon can handle it.' },
        { id: 'boil_water', label: 'Boil the water', description: 'You\'ve heard that boiling helps. [Intelligence check]', statCheck: { stat: 'intelligence', difficulty: -15 } },
      ],
      resolved: false,
    },
    {
      id: 'disease_wound_infection',
      category: CampEventCategory.Disease,
      title: 'Wound Infection',
      narrative: 'A comrade\'s wound has gone bad — the flesh around it is angry red, streaked with dark lines. The surgeon is drunk. Someone needs to clean and re-dress it.',
      choices: [
        { id: 'help_wound', label: 'Clean the wound', description: 'Hold him down and do what must be done. [Musketry check]', statCheck: { stat: 'musketry', difficulty: -15 } },
        { id: 'find_surgeon', label: 'Find the surgeon', description: 'Drag the drunk surgeon to his duty. [Charisma check]', statCheck: { stat: 'charisma', difficulty: 0 } },
      ],
      resolved: false,
    },
  ];
}

function getDesertionEvents(npcs: NPC[]): CampEvent[] {
  return [
    {
      id: 'desertion_attempt',
      category: CampEventCategory.Desertion,
      title: 'Desertion in the Night',
      narrative: 'You wake to whispers. Two men from your company are packing their kits in the dark. They see you watching.',
      choices: [
        { id: 'report', label: 'Report them', description: 'Duty. They\'ll be shot, but the line holds.' },
        { id: 'say_nothing', label: 'Say nothing', description: 'Close your eyes. Pretend you didn\'t see.' },
        { id: 'talk_them_down', label: 'Talk them out of it', description: 'Find the words to keep them. [Charisma check]', statCheck: { stat: 'charisma', difficulty: -15 } },
      ],
      resolved: false,
    },
  ];
}

function getWeatherEvents(camp: CampState): CampEvent[] {
  return [
    {
      id: 'weather_storm',
      category: CampEventCategory.Weather,
      title: 'Storm',
      narrative: 'A storm rolls in from the mountains. The wind tears at tent pegs. Rain drives sideways. The fires gutter and die.',
      choices: [
        { id: 'secure_camp', label: 'Secure the camp', description: 'Rally men to stake down tents and dig drainage. [Endurance check]', statCheck: { stat: 'endurance', difficulty: 0 } },
        { id: 'shelter', label: 'Find shelter', description: 'Get under cover and wait it out.' },
      ],
      resolved: false,
    },
    {
      id: 'weather_cold_snap',
      category: CampEventCategory.Weather,
      title: 'Bitter Cold',
      narrative: 'The temperature drops savagely in the night. Ice forms on blankets. Men huddle together for warmth. The sentries can barely hold their muskets.',
      choices: [
        { id: 'share_blanket', label: 'Share your blanket', description: 'A conscript is shivering alone. Give him half your warmth.' },
        { id: 'keep_warm', label: 'Conserve your warmth', description: 'You need your strength for tomorrow.' },
        { id: 'build_fire', label: 'Build a bigger fire', description: 'Risk drawing attention, but warm the section. [Awareness check]', statCheck: { stat: 'awareness', difficulty: 0 } },
      ],
      resolved: false,
    },
  ];
}

function getSupplyEvents(camp: CampState): CampEvent[] {
  return [
    {
      id: 'supply_foraging',
      category: CampEventCategory.Supply,
      title: 'Foraging Opportunity',
      narrative: 'A farmhouse is visible a mile from camp. Smoke rises from the chimney. The sergeant looks the other way. Others are already eyeing it.',
      choices: [
        { id: 'forage', label: 'Go foraging', description: 'Food is food. The locals will understand. [Awareness check]', statCheck: { stat: 'awareness', difficulty: 0 } },
        { id: 'stay', label: 'Stay in camp', description: 'Looting is beneath you. Or the risk isn\'t worth it.' },
        { id: 'trade', label: 'Trade honestly', description: 'Offer coin for food. [Charisma check]', statCheck: { stat: 'charisma', difficulty: -15 } },
      ],
      resolved: false,
    },
    {
      id: 'supply_ration_cut',
      category: CampEventCategory.Supply,
      title: 'Rations Cut',
      narrative: 'The quartermaster announces half-rations. The bread is green. The meat is questionable. Grumbling spreads through the camp like the diseases that follow bad food.',
      choices: [
        { id: 'accept', label: 'Accept quietly', description: 'A soldier endures. Complaining changes nothing.' },
        { id: 'share_extra', label: 'Share your portion', description: 'Give some of yours to the youngest conscript. [Constitution check]', statCheck: { stat: 'constitution', difficulty: 0 } },
      ],
      resolved: false,
    },
  ];
}

function getInterpersonalEvents(player: PlayerCharacter, npcs: NPC[]): CampEvent[] {
  const events: CampEvent[] = [];

  events.push({
    id: 'interpersonal_argument',
    category: CampEventCategory.Interpersonal,
    title: 'Argument in Camp',
    narrative: 'Two soldiers in your section come to blows over a stolen tobacco pouch. Fists fly. Blood flows. The NCO isn\'t around.',
    choices: [
      { id: 'break_it_up', label: 'Break it up', description: 'Step between them. [Strength check]', statCheck: { stat: 'strength', difficulty: 0 } },
      { id: 'let_them_fight', label: 'Let them settle it', description: 'Men need to sort things out sometimes.' },
      { id: 'find_nco', label: 'Find the NCO', description: 'This is his job, not yours.' },
    ],
    resolved: false,
  });

  events.push({
    id: 'interpersonal_story',
    category: CampEventCategory.Interpersonal,
    title: 'Stories Around the Fire',
    narrative: 'The veterans are telling stories tonight. Arcole. Lodi. The bridge at Rivoli. The fire crackles. For a moment, the army feels like a family.',
    choices: [
      { id: 'listen', label: 'Listen', description: 'Absorb their experience. Learn what they know.' },
      { id: 'tell_story', label: 'Tell your own story', description: 'Share something — a memory, a joke. [Charisma check]', statCheck: { stat: 'charisma', difficulty: 0 } },
    ],
    resolved: false,
  });

  events.push({
    id: 'interpersonal_nco_inspection',
    category: CampEventCategory.Interpersonal,
    title: 'NCO Inspection',
    narrative: 'Sergeant Duval conducts an inspection. He moves down the line of men, checking muskets, uniforms, posture. He stops in front of you.',
    choices: [
      { id: 'stand_tall', label: 'Stand to attention', description: 'Present yourself and your equipment. [Musketry check]', statCheck: { stat: 'musketry', difficulty: 0 } },
      { id: 'look_away', label: 'Try to avoid notice', description: 'Maybe he\'ll pass you by. [Awareness check]', statCheck: { stat: 'awareness', difficulty: -15 } },
    ],
    resolved: false,
  });

  return events;
}

function getOrdersEvents(camp: CampState): CampEvent[] {
  return [
    {
      id: 'orders_reconnaissance',
      category: CampEventCategory.Orders,
      title: 'Reconnaissance Duty',
      narrative: 'The lieutenant needs volunteers for a scouting patrol. The enemy\'s positions need mapping. It\'s dangerous, but the officer remembers who steps forward.',
      choices: [
        { id: 'volunteer', label: 'Volunteer', description: 'Step forward. Show willing. [Awareness check]', statCheck: { stat: 'awareness', difficulty: -15 } },
        { id: 'stay_silent', label: 'Stay silent', description: 'Let someone else risk their neck.' },
      ],
      resolved: false,
    },
  ];
}

function getRumourEvents(): CampEvent[] {
  return [
    {
      id: 'rumour_peace',
      category: CampEventCategory.Rumour,
      title: 'Rumours of Peace',
      narrative: 'Word passes through camp: the Austrians have sent envoys. Peace talks. Some men weep with relief. Others say it\'s nonsense — they\'ve heard it before.',
      choices: [
        { id: 'hope', label: 'Allow yourself to hope', description: 'Maybe it\'s true. Maybe this ends.' },
        { id: 'dismiss', label: 'Dismiss it', description: 'Hope is a trap. Keep your mind on tomorrow.' },
      ],
      resolved: false,
    },
    {
      id: 'rumour_reinforcements',
      category: CampEventCategory.Rumour,
      title: 'Reinforcements Coming',
      narrative: 'A courier rides through camp at dawn. The whisper spreads: Masséna\'s division is on the march. Reinforcements. Fresh troops. Is it true?',
      choices: [
        { id: 'spread_word', label: 'Spread the word', description: 'Share the good news. Morale needs it.' },
        { id: 'wait_confirm', label: 'Wait for confirmation', description: 'Rumours can cut both ways.' },
      ],
      resolved: false,
    },
    {
      id: 'rumour_enemy',
      category: CampEventCategory.Rumour,
      title: 'Enemy Movements',
      narrative: 'A sergeant from another company claims he saw enemy cavalry on the ridge at sunset. Three squadrons, maybe four. The camp grows tense.',
      choices: [
        { id: 'report_officer', label: 'Report to the officer', description: 'Information should flow upward.' },
        { id: 'investigate', label: 'Check it yourself', description: 'Go to the ridge and look. [Awareness check]', statCheck: { stat: 'awareness', difficulty: 0 } },
        { id: 'ignore', label: 'Ignore it', description: 'Sergeants see shadows everywhere.' },
      ],
      resolved: false,
    },
  ];
}

// === RESOLVE EVENT CHOICES ===

export function resolveCampEventChoice(
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

  // Run stat check if applicable
  let checkPassed = true;
  if (choice.statCheck) {
    const stat = getPlayerStat(player, choice.statCheck.stat) || 30;
    const result = rollStat(stat, 0, choice.statCheck.difficulty);
    checkPassed = result.success;
  }

  // Resolve by event ID + choice ID
  return resolveEventOutcome(event.id, choiceId, checkPassed, player, npcs, day);
}

function resolveEventOutcome(
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
    case 'disease_fever':
      if (choiceId === 'help_sick') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You tend the sick through the night. Exhausting work, but your constitution holds. The men remember who helped.' });
          statChanges.soldierRep = 3;
          moraleChange = 2;
        } else {
          log.push({ day, type: 'result', text: 'You try to help but catch a mild fever yourself. A miserable night, but you pull through.' });
          moraleChange = -3;
        }
      } else if (choiceId === 'boil_water') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You insist on boiling the water before drinking. Some call you fussy. But your section stays healthier than most.' });
          statChanges.soldierRep = 2;
          moraleChange = 2;
        } else {
          log.push({ day, type: 'result', text: 'You boil water but burn yourself in the process. The others laugh. The water tastes of ashes.' });
          moraleChange = -1;
        }
      } else {
        log.push({ day, type: 'result', text: 'You keep your distance. Pragmatic. The fever passes through camp and moves on.' });
        moraleChange = -1;
      }
      break;

    case 'disease_wound_infection':
      if (choiceId === 'help_wound') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You clean and dress the wound. Your hands are steady. The man screams, then goes quiet. By morning, the streaks are fading. You saved his life.' });
          statChanges.soldierRep = 4;
          moraleChange = 3;
        } else {
          log.push({ day, type: 'result', text: 'You try, but the wound is too deep. The infection spreads. The surgeon finally arrives and takes over. "You tried," he says.' });
          moraleChange = -2;
        }
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You drag the surgeon from his bottle. He grumbles but gets to work. The wound is cleaned properly.' });
          moraleChange = 1;
        } else {
          log.push({ day, type: 'result', text: 'The surgeon tells you to mind your own business. The man\'s wound festers. By morning, they carry him to the hospital wagon.' });
          moraleChange = -2;
        }
      }
      break;

    case 'desertion_attempt':
      if (choiceId === 'report') {
        log.push({ day, type: 'result', text: 'You report them. They\'re arrested at dawn. The sergeant nods approvingly. The rest of the company looks at you differently.' });
        statChanges.officerRep = 8;
        statChanges.soldierRep = -2;
        moraleChange = -2;
      } else if (choiceId === 'talk_them_down') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"Where will you go? The Austrians? The mountains? Stay. We need you here." Your words reach them. They unpack, silently. No one else knows.' });
          moraleChange = 3;
          statChanges.soldierRep = 2;
        } else {
          log.push({ day, type: 'result', text: 'They shrug off your words and vanish into the night. Two empty blankets at morning roll call. The sergeant notices.' });
          moraleChange = -3;
        }
      } else {
        log.push({ day, type: 'result', text: 'You close your eyes. In the morning, two men are missing. The sergeant rages. You say nothing.' });
        moraleChange = -2;
      }
      break;

    case 'weather_storm':
      if (choiceId === 'secure_camp') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You rally the section. Together you stake down tents, dig drainage channels, save the powder from the wet. When dawn comes, your section is the only one still standing.' });
          statChanges.soldierRep = 3;
          statChanges.officerRep = 3;
          moraleChange = 2;
        } else {
          log.push({ day, type: 'result', text: 'You try to secure the camp but the wind is too strong. A tent pole cracks. Your hands are raw and bleeding by dawn. The camp is battered but standing.' });
          moraleChange = -2;
        }
      } else {
        log.push({ day, type: 'result', text: 'You find shelter under a wagon and wait it out. The storm passes. The camp is a wreck, but you\'re dry.' });
        moraleChange = -1;
      }
      break;

    case 'weather_cold_snap':
      if (choiceId === 'share_blanket') {
        log.push({ day, type: 'result', text: 'You share your blanket with the shivering conscript. A miserable night for both of you — but he\'s alive in the morning. He won\'t forget.' });
        moraleChange = 2;
        statChanges.soldierRep = 2;
      } else if (choiceId === 'build_fire') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You find dry wood and build a roaring fire, sheltered from enemy observation by the ravine. The whole section gathers round. Warmth. Small mercies.' });
          moraleChange = 3;
        } else {
          log.push({ day, type: 'result', text: 'You build the fire but it sends up a column of smoke. The lieutenant orders it doused. Back to shivering.' });
          moraleChange = -1;
          statChanges.officerRep = -3;
        }
      } else {
        log.push({ day, type: 'result', text: 'You wrap yourself tight and endure. Self-preservation. No one blames you. The night passes.' });
        moraleChange = -1;
      }
      break;

    case 'supply_foraging':
      if (choiceId === 'forage') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You slip out at dusk and find a root cellar with potatoes, onions, a ham. The family has already fled. You bring it back. Tonight, your section eats well.' });
          moraleChange = 4;
        } else {
          log.push({ day, type: 'result', text: 'You go foraging but a patrol from another regiment has already stripped the place clean. A wasted trip and tired legs.' });
          moraleChange = -1;
        }
      } else if (choiceId === 'trade') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You approach the farmhouse with coins in hand. The old farmer is wary but takes the money. Eggs, bread, cheese. Honest trade. Rare in wartime.' });
          moraleChange = 3;
          statChanges.soldierRep = 2;
        } else {
          log.push({ day, type: 'result', text: 'The farmer slams the door. Can\'t blame him. You walk back to camp with nothing but sore feet.' });
          moraleChange = -1;
        }
      } else {
        log.push({ day, type: 'result', text: 'You stay in camp. Principle or cowardice — hard to tell on an empty stomach.' });
        moraleChange = 0;
      }
      break;

    case 'supply_ration_cut':
      if (choiceId === 'share_extra') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You give half your bread to the youngest conscript. Your stomach aches, but your constitution holds. The boy looks at you like you hung the moon.' });
          moraleChange = 2;
          statChanges.soldierRep = 3;
        } else {
          log.push({ day, type: 'result', text: 'You give your bread away and spend the night light-headed and weak. Generosity has a price.' });
          moraleChange = 1;
        }
      } else {
        log.push({ day, type: 'result', text: 'You eat what you\'re given and say nothing. Complaining is for conscripts.' });
        moraleChange = -1;
      }
      break;

    case 'interpersonal_argument':
      if (choiceId === 'break_it_up') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You step between them and shove them apart. Hard. They stare at you — then at each other — and the heat goes out of it. "Save it for the Austrians," you say.' });
          statChanges.soldierRep = 2;
          moraleChange = 1;
        } else {
          log.push({ day, type: 'result', text: 'You step between them and catch an elbow for your trouble. They pull apart eventually. Your jaw aches.' });
          moraleChange = -1;
        }
      } else if (choiceId === 'find_nco') {
        log.push({ day, type: 'result', text: 'You find the sergeant. He arrives and delivers two sharp cuffs. Order restored. He gives you a nod for fetching him.' });
        statChanges.officerRep = 3;
        moraleChange = 0;
      } else {
        log.push({ day, type: 'result', text: 'They fight it out. One gets a black eye, the other a split lip. By morning they\'re friends again. Soldiers.' });
        moraleChange = -1;
      }
      break;

    case 'interpersonal_story':
      if (choiceId === 'tell_story') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You tell a story — maybe embellished, maybe not. The men laugh, then grow quiet when it turns serious. "Not bad, lad," says a veteran. "Not bad at all."' });
          statChanges.soldierRep = 3;
          moraleChange = 3;
        } else {
          log.push({ day, type: 'result', text: 'You try to tell a story but it falls flat. An awkward silence. Someone changes the subject. You listen for the rest of the evening.' });
          moraleChange = 0;
        }
      } else {
        log.push({ day, type: 'result', text: 'You listen. The old soldiers have seen things. Their stories are cautionary, inspiring, terrifying. You learn from every word.' });
        moraleChange = 2;
      }
      break;

    case 'interpersonal_nco_inspection':
      if (choiceId === 'stand_tall') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: '"Musket clean. Bayonet sharp. Posture..." He pauses. "Acceptable." From Duval, that\'s practically a medal. He moves on. You breathe again.' });
          statChanges.officerRep = 5;
          moraleChange = 2;
        } else {
          log.push({ day, type: 'result', text: '"What is this? A MUSKET or a DRAINPIPE?" The sergeant finds rust. Your ears ring for ten minutes afterward. But at least he knows your name now.' });
          statChanges.officerRep = -3;
          moraleChange = -2;
        }
      } else {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You blend into the background. The sergeant passes you by without a glance. Relief. But also — he doesn\'t know you exist.' });
          moraleChange = 0;
        } else {
          log.push({ day, type: 'result', text: '"YOU. Trying to hide?" The sergeant\'s eyes find you like a hawk finding a mouse. The inspection that follows is... thorough.' });
          statChanges.officerRep = -5;
          moraleChange = -3;
        }
      }
      break;

    case 'orders_reconnaissance':
      if (choiceId === 'volunteer') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You scout the enemy positions and return with useful intelligence. The lieutenant is impressed. "Good work, soldier. I\'ll remember this."' });
          statChanges.soldierRep = 4;
          statChanges.awareness = 1;
          moraleChange = 3;
        } else {
          log.push({ day, type: 'result', text: 'The patrol goes badly — you stumble into a picket line and barely escape. The information is useless. But you showed courage, and that counts.' });
          statChanges.soldierRep = 1;
          moraleChange = -2;
        }
      } else {
        log.push({ day, type: 'result', text: 'Someone else volunteers. You stay by the fire. Safe. The volunteer comes back with a promotion recommendation.' });
        moraleChange = -1;
      }
      break;

    case 'rumour_peace':
      if (choiceId === 'hope') {
        log.push({ day, type: 'result', text: 'You let yourself imagine it — home, the end of marching, sleeping in a bed. The hope is warm. It may be false. But tonight, it\'s enough.' });
        moraleChange = 4;
      } else {
        log.push({ day, type: 'result', text: 'You\'ve learned not to hope. The army teaches that quickly. Tomorrow is another march, another fight. That is all you know.' });
        moraleChange = 0;
        statChanges.valor = 1;
      }
      break;

    case 'rumour_reinforcements':
      if (choiceId === 'spread_word') {
        log.push({ day, type: 'result', text: 'The news spreads through camp like wildfire. Men stand a little straighter. The mood lifts. Whether it\'s true or not, the effect is real.' });
        moraleChange = 3;
      } else {
        log.push({ day, type: 'result', text: 'You wait. By evening, the courier\'s message is confirmed — or denied. Either way, you kept your composure. Wisdom or cynicism.' });
        moraleChange = 1;
      }
      break;

    case 'rumour_enemy':
      if (choiceId === 'report_officer') {
        log.push({ day, type: 'result', text: 'You report to the lieutenant. He sends a patrol. Nothing is found, but the lieutenant nods. "Better safe than sorry. Good soldier."' });
        statChanges.officerRep = 3;
        moraleChange = 0;
      } else if (choiceId === 'investigate') {
        if (checkPassed) {
          log.push({ day, type: 'result', text: 'You climb the ridge at dusk. Nothing — just shadows and wind. But the view shows you the terrain. Knowledge that might save your life tomorrow.' });
          statChanges.awareness = 1;
          moraleChange = 1;
        } else {
          log.push({ day, type: 'result', text: 'You climb the ridge and see... something. Campfires? Stars? You can\'t tell. You report what you saw and hope it was nothing.' });
          moraleChange = -1;
        }
      } else {
        log.push({ day, type: 'result', text: 'You ignore it. Rumours and shadows. The camp settles. But you sleep with your musket close tonight.' });
        moraleChange = -1;
      }
      break;

    default:
      log.push({ day, type: 'result', text: 'The moment passes.' });
      break;
  }

  return { log, statChanges, moraleChange, npcChanges: npcChanges.length > 0 ? npcChanges : undefined };
}
