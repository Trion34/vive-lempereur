import { CampEventCategory } from '../../../types';
import type {
  DeclarativeForcedEventConfig,
  DeclarativeRandomEventConfig,
  DeclarativeCampEvent,
} from '../../campaigns/types';

// ============================================================
// RIVOLI CAMP CONFIG — Rivoli Plateau, Eve of Battle
// ============================================================

export const RIVOLI_CAMP_META = {
  location: 'Rivoli Plateau',
  weather: 'cold' as const,
  supplyLevel: 'scarce' as const,
  actionsTotal: 16,
  context: 'pre-battle' as const,
  openingNarrative:
    'The 14th demi-brigade makes camp on the plateau above Rivoli. The Austrian columns are massing in the valley below. Bonaparte is on his way.',
};

// ============================================================
// DECLARATIVE EVENT DEFINITIONS
// ============================================================

const CAMPFIRES_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_campfires',
  title: 'Austrian Campfires',
  category: CampEventCategory.Rumour,
  narrative:
    'A thick fog has settled over the plateau, rolling up from the Adige gorge, obscuring your surroundings.\n\nBut out there, on the ridges to the north \u2014 Austrian campfires, bleeding through the fog like dim orange ghosts.',
  choices: [
    {
      id: 'steady_men',
      label: 'Steady the nervous',
      description: 'Find the right words. Keep the fear from spreading. [Charisma check]',
      statCheck: { stat: 'charisma', difficulty: 35 },
      pass: {
        narrative:
          '"Fires," you say, loud enough for the men nearby. "That\'s all they are. Fires. And tomorrow we\'ll put them out." A few men laugh \u2014 short, nervous laughs. But the tension breaks, just a little. Enough.',
        statChanges: { soldierRep: 2 },
        moraleChange: 3,
      },
      fail: {
        narrative:
          '"They\'re just campfires," you say, but your voice comes out thin. No one laughs. A few men glance at you and look away. The fires keep burning.',
        moraleChange: -1,
      },
    },
    {
      id: 'count_them',
      label: 'Try to count them',
      description: 'Study the fires. How many columns? [Awareness check]',
      statCheck: { stat: 'awareness', difficulty: 65 },
      pass: {
        narrative:
          'You study the fires carefully, tracing their spread across the ridgeline. Five distinct clusters. Five columns, approaching from different directions. You report it to the sergeant. "Good eyes," Duval says. Information that might matter tomorrow.',
        statChanges: { officerRep: 3 },
        moraleChange: 3,
      },
      fail: {
        narrative:
          'You try to count the fires but they blur together into a single carpet of light. Three columns? Five? Twenty? The darkness gives no answers. You stare until your eyes ache.',
        moraleChange: -2,
      },
    },
  ],
};

const BRIEFING_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_briefing',
  title: "Officer's Briefing",
  category: CampEventCategory.Orders,
  narrative:
    'Your section is drawing cartridges from the supply wagon when Sergeant Duval appears. "Dawn. Austrians from the north. Three columns at least." He looks along the line. "Front rank needs filling." The section goes quiet.',
  choices: [
    {
      id: 'volunteer',
      label: 'Volunteer for front rank',
      description: 'Step forward. Where the danger is greatest. [Valor check]',
      statCheck: { stat: 'valor', difficulty: 50 },
      pass: {
        narrative:
          'You step forward. Duval looks at you. "Good man."\n\nBehind you, a movement. Pierre steps up, quiet and steady, taking his place at your shoulder. Then Jean-Baptiste, white as chalk, falls in beside you without a word.\n\nThe front rank. Where the first volley hits. Where the lines meet. You volunteered. They followed.',
        statChanges: { soldierRep: 3, officerRep: 3 },
        moraleChange: 2,
        npcRelationshipChanges: [{ npcId: 'duval', delta: 5 }],
        playerFields: { frontRank: true },
      },
      fail: {
        narrative:
          'You step forward, but your voice catches. Duval looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank."\n\nPierre is already beside you \u2014 he would have volunteered anyway. Then Jean-Baptiste stumbles forward, hands shaking, refusing to meet anyone\'s eyes. But he is there. Your legs feel like water. But you are in the front rank. All three of you.',
        statChanges: { soldierRep: 1, officerRep: 1 },
        moraleChange: -3,
        npcRelationshipChanges: [{ npcId: 'duval', delta: 3 }],
        playerFields: { frontRank: true },
      },
    },
    {
      id: 'stay_quiet',
      label: 'Stay quiet',
      description: 'The front rank is for the brave or the foolish.',
      pass: {
        narrative:
          "You stay silent. The sergeant's eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you.",
        moraleChange: -3,
      },
    },
  ],
};

const NIGHT_BEFORE_TEXT =
  'The 14th demi-brigade bivouacs on the plateau above Rivoli. The January night is bitter. The fog still clings to the plateau, draping the camp in grey.\n\n' +
  'You find a spot near a warm fire. Someone passes a heel of bread. Someone else is sharpening a bayonet, the cold song of steel. \u201cIt\u2019s been a long road, hasn\u2019t it?\u201d Jean-Baptiste jerks you from some listless reverie. \u201cSince Voltri.\u201d Ten long months.\n\n' +
  'Then the wind shifts. Slowly at first, then all at once, the fog tears apart like a curtain.\n\n' +
  'And there they are. Campfires. Not dozens \u2014 thousands. Covering the slopes of Monte Baldo like a second sky. Every one of them a squad, a company, a column. Now every man knows with certainty. We are outnumbered.';

const NIGHT_BEFORE_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_night_before',
  title: 'The Night Before',
  category: CampEventCategory.Orders,
  narrative: NIGHT_BEFORE_TEXT,
  choices: [],
};

const BONAPARTE_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_bonaparte',
  title: 'Bonaparte Rides Past',
  category: CampEventCategory.Orders,
  narrative:
    'A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.',
  choices: [
    {
      id: 'stand_tall',
      label: 'Continue',
      description: '',
      statCheck: { stat: 'valor', difficulty: 50 },
      pass: {
        narrative:
          "You stand straight. Musket grounded. Eyes forward. Bonaparte's gaze sweeps over you. You stood like a soldier when the general rode past. The men around you noticed.",
        statChanges: { soldierRep: 1, napoleonRep: 2 },
        moraleChange: 3,
      },
      fail: {
        narrative:
          'You keep a low profile. The general passes. But something nags \u2014 a missed moment, a chance to be seen. If only you had more courage.',
      },
    },
  ],
};

const PIERRE_STORY_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_pierre_story',
  title: "Pierre's Story",
  category: CampEventCategory.Interpersonal,
  narrative:
    'Pierre is sitting apart from the others, staring into the fire. His face is unreadable. He has been at Arcole, at Lodi, at a dozen fights whose names you barely know. He has not spoken all evening. But there is something in his silence tonight that is different. Heavier.',
  choices: [
    {
      id: 'listen',
      label: 'Listen',
      description: 'Sit beside him. Wait for him to speak.',
      pass: {
        narrative:
          'You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.',
        moraleChange: 2,
        npcRelationshipChanges: [{ npcId: 'pierre', delta: 6 }],
      },
    },
    {
      id: 'ask_arcole',
      label: 'Ask about Arcole',
      description: 'Draw him out. [Charisma check]',
      statCheck: { stat: 'charisma', difficulty: 50 },
      pass: {
        narrative:
          '"Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks \u2014 not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That\'s what matters." His voice is steady. Yours is steadier for hearing it.',
        statChanges: { valor: 1 },
        moraleChange: 3,
        npcRelationshipChanges: [{ npcId: 'pierre', delta: 8 }],
      },
      fail: {
        narrative:
          '"Tell me about\u2014" Pierre cuts you off with a look. "No." The silence afterward is heavier than the darkness. You leave him to his fire and his ghosts.',
        moraleChange: -1,
        npcRelationshipChanges: [{ npcId: 'pierre', delta: -3 }],
      },
    },
  ],
};

const RATIONS_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_rations',
  title: 'Short Rations',
  category: CampEventCategory.Supply,
  narrative:
    'The quartermaster distributes what passes for supper: a quarter-loaf of hard bread, a sliver of cheese, a cup of thin broth. It is not enough. It was never going to be enough. Jean-Baptiste stares at your portion. He has already finished his own.',
  choices: [
    {
      id: 'accept',
      label: 'Accept your share',
      description: 'Eat what you are given. A soldier endures.',
      pass: {
        narrative:
          'You eat your share slowly, making each bite last. The bread is hard. The cheese is harder. But it is fuel, and tomorrow you will burn through all of it. A soldier eats what he is given and is grateful.',
      },
    },
    {
      id: 'share_jb',
      label: 'Share with Jean-Baptiste',
      description: 'Give him half your bread. [Constitution check]',
      statCheck: { stat: 'constitution', difficulty: 50 },
      pass: {
        narrative:
          'You break your bread in half and push it across to Jean-Baptiste. He stares at it, then at you. "I can\'t\u2014" "Eat it." He eats. Your stomach aches through the night, but your constitution holds. The boy won\'t forget.',
        statChanges: { soldierRep: 2 },
        moraleChange: 2,
        npcRelationshipChanges: [{ npcId: 'jean-baptiste', delta: 8 }],
      },
      fail: {
        narrative:
          'You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.',
        staminaChange: -5,
        moraleChange: -1,
        npcRelationshipChanges: [{ npcId: 'jean-baptiste', delta: 6 }],
      },
    },
  ],
};

const JB_FEAR_EVENT: DeclarativeCampEvent = {
  id: 'prebattle_jb_fear',
  title: "Jean-Baptiste's Fear",
  category: CampEventCategory.Interpersonal,
  narrative:
    'You find Jean-Baptiste behind the supply wagon, sitting in the dark. His hands are shaking.\n\n"I can\'t do it," he whispers. "Tomorrow. The line. I can\'t."\n\nHe\'s not the only one thinking it. He\'s just the only one saying it out loud.',
  choices: [
    {
      id: 'reassure',
      label: 'Reassure him',
      description: '"You can. You will. Stay beside me." [Charisma check]',
      statCheck: { stat: 'charisma', difficulty: 50 },
      pass: {
        narrative:
          '"You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.',
        moraleChange: 3,
        npcRelationshipChanges: [{ npcId: 'jean-baptiste', delta: 10 }],
      },
      fail: {
        narrative:
          'You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You\'re afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.',
        moraleChange: -5,
        npcRelationshipChanges: [{ npcId: 'jean-baptiste', delta: 2 }],
      },
    },
    {
      id: 'truth',
      label: 'Tell him the truth',
      description: '"Everyone\'s afraid. The brave ones just march anyway." [Valor check]',
      statCheck: { stat: 'valor', difficulty: 50 },
      pass: {
        narrative:
          '"Everyone\'s afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.',
        moraleChange: 2,
        npcRelationshipChanges: [
          { npcId: 'jean-baptiste', delta: 5 },
          { npcId: 'pierre', delta: 2 },
        ],
      },
      fail: {
        narrative:
          '"Everyone\'s afraid," you say. But the words come out wrong \u2014 too blunt, too hard. Jean-Baptiste flinches like you struck him. "So there\'s no hope then," he whispers. You meant to be honest. Instead you made it worse.',
        moraleChange: -2,
        npcRelationshipChanges: [
          { npcId: 'jean-baptiste', delta: -2 },
          { npcId: 'pierre', delta: 2 },
        ],
      },
    },
    {
      id: 'silence',
      label: 'Say nothing',
      description: 'Sit with him in the dark. Sometimes presence is enough.',
      pass: {
        narrative:
          "You sit beside him in the dark. You don't speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.",
        moraleChange: 2,
        npcRelationshipChanges: [{ npcId: 'jean-baptiste', delta: 6 }],
      },
    },
  ],
};

// ============================================================
// DATA-DRIVEN EVENT CONFIGS (all declarative)
// ============================================================

export const RIVOLI_PRE_BATTLE_FORCED_EVENTS: DeclarativeForcedEventConfig[] = [
  { kind: 'declarative', id: 'prebattle_campfires', triggerAt: 10, event: CAMPFIRES_EVENT },
  { kind: 'declarative', id: 'prebattle_briefing', triggerAt: 7, event: BRIEFING_EVENT },
  { kind: 'declarative', id: 'prebattle_night_before', triggerAt: 3, event: NIGHT_BEFORE_EVENT },
  { kind: 'declarative', id: 'prebattle_bonaparte', triggerAt: 1, event: BONAPARTE_EVENT },
];

export const RIVOLI_RANDOM_EVENTS: DeclarativeRandomEventConfig[] = [
  { kind: 'declarative', id: 'prebattle_pierre_story', weight: 1, event: PIERRE_STORY_EVENT },
  { kind: 'declarative', id: 'prebattle_rations', weight: 1, event: RATIONS_EVENT },
  { kind: 'declarative', id: 'prebattle_jb_fear', weight: 1, event: JB_FEAR_EVENT },
];

// ============================================================
// EXPORTED EVENT DATA (for lab and tests)
// ============================================================

export {
  CAMPFIRES_EVENT,
  BRIEFING_EVENT,
  NIGHT_BEFORE_EVENT,
  BONAPARTE_EVENT,
  PIERRE_STORY_EVENT,
  RATIONS_EVENT,
  JB_FEAR_EVENT,
};

// ============================================================
// ACTIVITY NARRATIVE STRINGS
// ============================================================

export const FORAGE_SUCCESS = [
  'You find a root cellar half-buried in snow behind an abandoned farmhouse. Frozen turnips, a sack of chestnuts, a clay jug of vinegar. Not much \u2014 but the men cheer when you come back.',
  'A skinny chicken, hiding in the ruins of a barn. You wring its neck before it can squawk. Tonight, the section eats.',
  'Firewood. Real firewood \u2014 dry oak, stacked under a collapsed shed roof. You drag back as much as you can carry. The fire burns properly for the first time in days.',
];

export const FORAGE_FAIL = [
  'Nothing. Frozen fields picked clean by every army that has passed this way. You come back empty-handed, boots soaked through, fingers blue.',
  'You range further than you should, alone on the mountainside. The wind cuts through your coat. There is nothing here. There was never anything here.',
  'An abandoned village, already stripped. Every cupboard bare, every root cellar emptied. You kick through the snow for an hour and find nothing but frozen mud.',
];

export const SOCIALIZE_NARRATIVES: Record<string, string> = {
  pierre: `Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.`,
  'jean-baptiste': `Jean-Baptiste talks rapidly about home \u2014 the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.`,
  duval: `Sergeant Duval grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.`,
  leclerc: `Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.`,
};
