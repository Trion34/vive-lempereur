import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* ================================================================== */
/*  VISUAL NOVEL ENGINE — Data Model                                   */
/* ================================================================== */

/** Character expression/mood — determines portrait styling */
type Expression = 'neutral' | 'happy' | 'angry' | 'sad' | 'surprised' | 'determined' | 'afraid' | 'bitter' | 'thoughtful';

/** Character position on screen */
type CharPosition = 'left' | 'center' | 'right' | 'off';

/** Background mood — drives the scene's atmosphere */
type SceneMood = 'night_camp' | 'dawn' | 'battlefield' | 'march' | 'interior' | 'ridge' | 'gorge';

/* ------------------------------------------------------------------ */
/*  Character definitions                                              */
/* ------------------------------------------------------------------ */

interface VNCharacter {
  id: string;
  name: string;
  rank?: string;
  color: string;        // Name plate color
  defaultExpression: Expression;
}

const CHARACTERS: Record<string, VNCharacter> = {
  narrator: { id: 'narrator', name: '', color: 'var(--text-primary)', defaultExpression: 'neutral' },
  player: { id: 'player', name: 'You', color: 'var(--accent-gold)', defaultExpression: 'neutral' },
  pierre: { id: 'pierre', name: 'Pierre', rank: 'Private', color: '#8B9DC3', defaultExpression: 'neutral' },
  jb: { id: 'jb', name: 'Jean-Baptiste', rank: 'Private', color: '#7CAA8B', defaultExpression: 'afraid' },
  duval: { id: 'duval', name: 'Sergeant Duval', rank: 'Sergeant', color: '#C4956A', defaultExpression: 'determined' },
  leclerc: { id: 'leclerc', name: 'Captain Leclerc', rank: 'Captain', color: '#D4AF37', defaultExpression: 'determined' },
  morin: { id: 'morin', name: 'Sergeant Morin', rank: 'Sergeant', color: '#A89078', defaultExpression: 'neutral' },
  felix: { id: 'felix', name: 'Felix Martel', rank: 'Private', color: '#9B8EC4', defaultExpression: 'happy' },
};

/* ------------------------------------------------------------------ */
/*  Dialogue node — the atomic unit of the VN system                   */
/* ------------------------------------------------------------------ */

/** Dialogue delivery mode — determines visual treatment */
type DeliveryMode = 'speech' | 'thought' | 'shout' | 'whisper';

interface DialogueNode {
  id: string;
  /** Who is speaking (character id, or 'narrator' for descriptive text) */
  speaker: string;
  /** Expression override for this line */
  expression?: Expression;
  /** The dialogue text */
  text: string;
  /** Delivery mode: speech (default), thought (inner monologue), shout, whisper */
  mode?: DeliveryMode;
  /** Character positions on screen */
  positions?: Partial<Record<string, CharPosition>>;
  /** Background mood override */
  mood?: SceneMood;
  /** Next node id (null = end, string = linear, undefined = use choices) */
  next?: string | null;
  /** Branching choices */
  choices?: VNChoice[];
  /** Sound effect to play */
  sfx?: string;
  /** Screen effect */
  effect?: 'shake' | 'flash' | 'fade';
}

interface VNChoice {
  label: string;
  description?: string;
  nextId: string;
  condition?: string;  // Human-readable gate description
  statCheck?: string;  // e.g. "Valor 50+"
}

/* ------------------------------------------------------------------ */
/*  Scene — a complete VN conversation                                 */
/* ------------------------------------------------------------------ */

interface VNScene {
  id: string;
  title: string;
  description: string;
  mood: SceneMood;
  /** Character ids present in this scene */
  cast: string[];
  /** Starting node id */
  startNode: string;
  /** All dialogue nodes in this scene */
  nodes: Record<string, DialogueNode>;
}

/* ================================================================== */
/*  DEMO SCENES — showcase the VN engine                               */
/* ================================================================== */

const SCENES: VNScene[] = [
  {
    id: 'campfire_talk',
    title: 'The Campfire',
    description: 'Pierre shares a story from Arcole. The night before Rivoli.',
    mood: 'night_camp',
    cast: ['player', 'pierre', 'jb'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: 'The campfire crackles in the January cold. Three men sit around it — close enough for warmth, far enough for pride. The mountains are black against the stars.',
        positions: { pierre: 'left', jb: 'right' },
        next: 'pierre_1',
      },
      pierre_1: {
        id: 'pierre_1', speaker: 'pierre', expression: 'thoughtful',
        text: "Arcole was different. We crossed a bridge under fire — *seventy-five paces* of open causeway, Austrian grapeshot the whole way. Men fell like wheat.",
        next: 'jb_1',
      },
      jb_1: {
        id: 'jb_1', speaker: 'jb', expression: 'afraid',
        text: "How... ~how did you survive that?~",
        next: 'pierre_inner',
      },
      pierre_inner: {
        id: 'pierre_inner', speaker: 'pierre', expression: 'thoughtful',
        text: "He's seeing it again. The bridge. The dead. You can tell by the way his eyes go distant.",
        mode: 'thought',
        next: 'pierre_2',
      },
      pierre_2: {
        id: 'pierre_2', speaker: 'pierre', expression: 'neutral',
        text: "I didn't think about surviving. I thought about the man in front of me. When he fell, I stepped over him and kept walking. That's all there is.",
        next: 'player_choice_1',
      },
      player_choice_1: {
        id: 'player_choice_1', speaker: 'narrator',
        text: 'The fire pops. Sparks spiral upward into the dark. Pierre stares into the flames. Jean-Baptiste looks at you.',
        choices: [
          { label: '"What was Bonaparte like at Arcole?"', nextId: 'bonaparte_branch', description: 'Ask about the general.' },
          { label: '"Were you afraid?"', nextId: 'fear_branch', description: 'Ask the question JB wants answered.' },
          { label: 'Say nothing. Stare into the fire.', nextId: 'silence_branch', description: 'Sometimes silence says more.' },
        ],
      },
      bonaparte_branch: {
        id: 'bonaparte_branch', speaker: 'pierre', expression: 'determined',
        text: "He grabbed the flag **himself**. Ran onto the bridge. Aides falling around him. _Madness_ — or genius. I still don't know which. But every man who saw it followed him.",
        next: 'jb_react_1',
      },
      fear_branch: {
        id: 'fear_branch', speaker: 'pierre', expression: 'bitter',
        text: "Every second. But fear is like the cold — you can *feel* it and still keep moving. The trick is not to think. Just put **one foot in front of the other**.",
        next: 'jb_react_2',
      },
      silence_branch: {
        id: 'silence_branch', speaker: 'narrator',
        text: "You say nothing. Pierre glances at you — a flicker of something that might be respect. The fire crackles. Jean-Baptiste watches both of you, trying to learn the language of soldiers who have survived.",
        next: 'ending',
      },
      jb_react_1: {
        id: 'jb_react_1', speaker: 'jb', expression: 'surprised',
        text: "Bonaparte himself? On the bridge? They... they don't mention that in the dispatches.",
        next: 'pierre_end_1',
      },
      pierre_end_1: {
        id: 'pierre_end_1', speaker: 'pierre', expression: 'bitter',
        text: "The dispatches mention what Paris needs to hear. Not what the bridge looked like after.",
        next: 'ending',
      },
      jb_react_2: {
        id: 'jb_react_2', speaker: 'jb', expression: 'thoughtful',
        text: "One foot in front of the other...",
        mode: 'whisper',
        next: 'pierre_end_2',
      },
      pierre_end_2: {
        id: 'pierre_end_2', speaker: 'pierre', expression: 'neutral',
        text: "Get some sleep, both of you. Tomorrow we find out if the advice is worth anything.",
        next: 'ending',
      },
      ending: {
        id: 'ending', speaker: 'narrator',
        text: 'The fire burns lower. One by one, the campfires across the plateau wink out. Tomorrow, the Austrians come. Tonight, three men share warmth and silence.',
        effect: 'fade',
        next: null,
      },
    },
  },
  {
    id: 'felix_cards',
    title: "Felix's Card Trick",
    description: 'Felix Martel entertains the garrison with sleight of hand. Voltri camp.',
    mood: 'interior',
    cast: ['player', 'felix', 'morin'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: 'Evening in the garrison. Felix Martel sits cross-legged on a barrel, a battered deck of cards appearing and disappearing between his fingers like small miracles.',
        positions: { felix: 'center', morin: 'right' },
        next: 'felix_1',
      },
      felix_1: {
        id: 'felix_1', speaker: 'felix', expression: 'happy',
        text: "Pick a card. Any card. Don't show me — I already know what it is. That's the trick. Not the card. The knowing.",
        next: 'morin_1',
      },
      morin_1: {
        id: 'morin_1', speaker: 'morin', expression: 'neutral',
        text: "Martel, if you spent half as much time cleaning your musket as you do shuffling those damn cards...",
        next: 'felix_2',
      },
      felix_2: {
        id: 'felix_2', speaker: 'felix', expression: 'happy',
        text: "Sergeant, my musket fires just fine. The cards, on the other hand, require daily practice. A man has priorities.",
        next: 'player_choice',
      },
      player_choice: {
        id: 'player_choice', speaker: 'narrator',
        text: 'Felix fans the deck toward you with a showman\'s flourish.',
        choices: [
          { label: 'Pick a card', nextId: 'pick_card', description: 'Play along with the trick.' },
          { label: '"Where did you learn that?"', nextId: 'backstory', description: 'Ask about his past.' },
          { label: '"Cards won\'t stop an Austrian musket ball."', nextId: 'serious', description: 'Kill the mood.' },
        ],
      },
      pick_card: {
        id: 'pick_card', speaker: 'felix', expression: 'happy',
        text: "The seven of hearts. Don't look surprised — I told you, the knowing is the trick. In the theatre, they called it \"reading the room.\" In the army, they call it \"not getting shot.\" Same skill, different stage.",
        next: 'end_light',
      },
      backstory: {
        id: 'backstory', speaker: 'felix', expression: 'thoughtful',
        text: "I was a travelling player. Commedia dell'arte, mostly. Before the Revolution ate the theatres. Turns out a man who can make a crowd laugh can also make a squad follow orders — if he phrases them right.",
        next: 'morin_react',
      },
      morin_react: {
        id: 'morin_react', speaker: 'morin', expression: 'neutral',
        text: "That explains the dramatics. And the insubordination.",
        next: 'felix_laugh',
      },
      felix_laugh: {
        id: 'felix_laugh', speaker: 'felix', expression: 'happy',
        text: "Sergeant, in the theatre, insubordination is called 'improvisation.' Much better word.",
        next: 'end_light',
      },
      serious: {
        id: 'serious', speaker: 'felix', expression: 'sad',
        text: "No. They won't. Nothing stops a musket ball except another body, and I'd rather not be that body. So I shuffle cards. It keeps my hands *steady*. Steady hands, steady nerve. **That's** what the cards are for.",
        next: 'end_serious',
      },
      end_light: {
        id: 'end_light', speaker: 'narrator',
        text: 'Felix palms the deck and makes it vanish into his coat. Sergeant Morin shakes his head, but you catch the ghost of a smile before he turns away.',
        next: null,
      },
      end_serious: {
        id: 'end_serious', speaker: 'narrator',
        text: 'Felix puts the cards away. For a moment, the mask slips — and behind the showman is just another scared man in a uniform. Then the grin returns. "Another game, perhaps? No? Suit yourself."',
        effect: 'fade',
        next: null,
      },
    },
  },
  {
    id: 'duval_inspection',
    title: "Duval's Inspection",
    description: "Sergeant Duval inspects your kit. Pre-battle tension.",
    mood: 'dawn',
    cast: ['player', 'duval', 'leclerc'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: "First light. The camp stirs with the mechanical ritual of an army preparing for battle. Sergeant Duval moves through the section like a storm front.",
        positions: { duval: 'left' },
        next: 'duval_1',
      },
      duval_1: {
        id: 'duval_1', speaker: 'duval', expression: 'angry',
        text: "Musket. Show me. **NOW.**",
        mode: 'shout',
        next: 'narrator_1',
      },
      narrator_1: {
        id: 'narrator_1', speaker: 'narrator',
        text: "He snatches your musket, checks the flint, peers down the barrel, tests the bayonet socket. His movements are fast and sure — a man who has done this a thousand times.",
        next: 'choice_1',
      },
      choice_1: {
        id: 'choice_1', speaker: 'duval', expression: 'determined',
        text: "Well?",
        choices: [
          { label: 'Stand at attention. Say nothing.', nextId: 'attention', description: 'The soldier\'s default.' },
          { label: '"It\'s clean, Sergeant."', nextId: 'confident', description: 'State the obvious.' },
          { label: '"Is there a problem, Sergeant?"', nextId: 'challenge', description: 'Risky. Duval doesn\'t appreciate questions.' },
        ],
      },
      attention: {
        id: 'attention', speaker: 'duval', expression: 'neutral',
        text: "Hm. Clean enough. You'll do.",
        next: 'transition',
      },
      confident: {
        id: 'confident', speaker: 'duval', expression: 'angry',
        text: "I'll decide what's clean, Private. Your opinion on the matter is not required.",
        next: 'duval_inspect_2',
      },
      duval_inspect_2: {
        id: 'duval_inspect_2', speaker: 'narrator',
        text: "He hands the musket back. His eyes move to the next man. You passed — barely.",
        next: 'transition',
      },
      challenge: {
        id: 'challenge', speaker: 'duval', expression: 'angry',
        text: "The problem, Private, is that in three hours you'll be shooting at men who want to kill you, and if this flint doesn't spark, they will succeed. Any other questions?",
        effect: 'shake',
        next: 'transition',
      },
      transition: {
        id: 'transition', speaker: 'narrator',
        text: "Captain Leclerc appears at the end of the line. Duval straightens imperceptibly.",
        positions: { leclerc: 'right' },
        next: 'leclerc_1',
      },
      leclerc_1: {
        id: 'leclerc_1', speaker: 'leclerc', expression: 'determined',
        text: "The section is ready, Sergeant?",
        next: 'duval_report',
      },
      duval_report: {
        id: 'duval_report', speaker: 'duval', expression: 'determined',
        text: "Ready as they'll ever be, Captain. Flints good. Cartridges counted. They'll hold.",
        next: 'leclerc_2',
      },
      leclerc_2: {
        id: 'leclerc_2', speaker: 'leclerc', expression: 'neutral',
        text: "Good. The drums beat in thirty minutes. Make sure every man has eaten.",
        next: 'ending',
      },
      ending: {
        id: 'ending', speaker: 'narrator',
        text: 'Leclerc moves on. Duval watches him go, then turns back to the section. "You heard the captain. Eat something. It may be your last chance." It is unclear if he means the meal or the chance.',
        effect: 'fade',
        next: null,
      },
    },
  },
  {
    id: 'after_lodi',
    title: 'The Bridge at Lodi',
    description: 'In the aftermath of the charge, a moment of reckoning on the bridge.',
    mood: 'battlefield',
    cast: ['player', 'pierre', 'duval'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: 'Smoke drifts across the bridge like a funeral shroud. The Austrian guns are silent now. Bodies lie where they fell — French and Austrian tangled together, impossible to tell apart in death.',
        positions: { pierre: 'left', duval: 'right' },
        next: 'duval_1',
      },
      duval_1: {
        id: 'duval_1', speaker: 'duval', expression: 'determined',
        text: "Check the wounded. French first, then Austrian. Anyone who can walk, get them off this bridge before the engineers come through.",
        next: 'pierre_1',
      },
      pierre_1: {
        id: 'pierre_1', speaker: 'pierre', expression: 'bitter',
        text: "Twelve guns. We charged twelve guns across an open bridge. The textbooks will call it brilliant. I call it luck.",
        next: 'narrator_1',
      },
      narrator_1: {
        id: 'narrator_1', speaker: 'narrator',
        text: "A wounded Austrian officer lies propped against the bridge railing, clutching his side. He watches you approach with eyes that expect the worst.",
        next: 'choice_1',
      },
      choice_1: {
        id: 'choice_1', speaker: 'narrator',
        text: "The officer's sword lies beside him. He makes no move for it.",
        choices: [
          { label: 'Offer your canteen.', nextId: 'mercy', description: 'Water crosses all boundaries.' },
          { label: 'Take his sword as a trophy.', nextId: 'trophy', description: 'The spoils of war.' },
          { label: 'Walk past. There are French wounded first.', nextId: 'duty', description: 'Follow Duval\'s orders.' },
        ],
      },
      mercy: {
        id: 'mercy', speaker: 'narrator',
        text: "You kneel and hold the canteen to his lips. He drinks, coughs, drinks again. \"Danke,\" he whispers. Pierre watches from the railing. Something shifts in his expression — not quite approval. Recognition.",
        next: 'duval_react',
      },
      trophy: {
        id: 'trophy', speaker: 'duval', expression: 'angry',
        text: "Leave it. He's an officer — that sword gets turned in to the captain, not stuffed in your kit. We're soldiers, not looters.",
        effect: 'shake',
        next: 'duval_react',
      },
      duty: {
        id: 'duty', speaker: 'pierre', expression: 'neutral',
        text: "You're learning. The French wounded can't wait while you play at mercy. Tend your own first. Then, if there's time...",
        next: 'duval_react',
      },
      duval_react: {
        id: 'duval_react', speaker: 'duval', expression: 'neutral',
        text: "Move it. We hold this bridge until the column crosses. After that, you can philosophise all you want.",
        next: 'ending',
      },
      ending: {
        id: 'ending', speaker: 'narrator',
        text: "The column begins to cross — thousands of boots on stone, the army pouring south like a river finding its course. You stand on a bridge that will be famous. Right now, it just smells of powder and blood.",
        effect: 'fade',
        next: null,
      },
    },
  },
  {
    id: 'alpine_march',
    title: 'The Mountain Pass',
    description: 'Crossing the Alps in winter. The army struggles through snow and silence.',
    mood: 'ridge',
    cast: ['player', 'jb', 'felix'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: "The pass narrows to a track barely wide enough for two men abreast. Below, a gorge drops into white nothing. Above, the peaks vanish into cloud. The army moves in single file, breathing frost.",
        positions: { jb: 'left', felix: 'right' },
        next: 'jb_1',
      },
      jb_1: {
        id: 'jb_1', speaker: 'jb', expression: 'afraid',
        text: "I can't feel my feet. Is that... is that normal? Should I be worried about that?",
        next: 'felix_1',
      },
      felix_1: {
        id: 'felix_1', speaker: 'felix', expression: 'happy',
        text: "Worried? In the theatre, we called that 'dedication to the role.' You're playing a frozen soldier. Magnificently, I might add.",
        next: 'jb_2',
      },
      jb_2: {
        id: 'jb_2', speaker: 'jb', expression: 'sad',
        text: "Felix, I'm serious. What if we don't make it across?",
        next: 'felix_2',
      },
      felix_2: {
        id: 'felix_2', speaker: 'felix', expression: 'thoughtful',
        text: "Then we become very picturesque statues and future travellers will wonder who we were. But that won't happen. You know why?",
        next: 'choice_1',
      },
      choice_1: {
        id: 'choice_1', speaker: 'jb', expression: 'surprised',
        text: "Why?",
        choices: [
          { label: '"Because Felix would talk the mountain into moving."', nextId: 'joke', description: 'Lighten the mood.' },
          { label: '"Because we have to. There\'s no going back."', nextId: 'resolve', description: 'The truth.' },
          { label: 'Keep walking. Save your breath.', nextId: 'silence', description: 'Words freeze too.' },
        ],
      },
      joke: {
        id: 'joke', speaker: 'felix', expression: 'happy',
        text: "Ha! I once convinced a Parisian landlord that I'd already paid rent for three months. A mountain should be easier — it can't argue back.",
        next: 'jb_laugh',
      },
      jb_laugh: {
        id: 'jb_laugh', speaker: 'jb', expression: 'happy',
        text: "You're mad. Both of you. Completely mad.",
        next: 'ending',
      },
      resolve: {
        id: 'resolve', speaker: 'felix', expression: 'determined',
        text: "Exactly. The road only goes forward. That's the secret the generals don't tell you — courage isn't a choice when there's no alternative.",
        next: 'jb_nod',
      },
      jb_nod: {
        id: 'jb_nod', speaker: 'jb', expression: 'determined',
        text: "Forward, then.",
        next: 'ending',
      },
      silence: {
        id: 'silence', speaker: 'narrator',
        text: "You say nothing. Felix nods — he understands. The three of you walk on, boots crunching in snow, breath hanging in the air like small ghosts. Sometimes company is enough.",
        next: 'ending',
      },
      ending: {
        id: 'ending', speaker: 'narrator',
        text: "The path begins to descend. Through a gap in the clouds, Italy appears below — green and gold and impossibly warm. The whole column stops. For a moment, no one speaks. Then someone — you never learn who — starts to sing.",
        effect: 'fade',
        next: null,
      },
    },
  },
  {
    id: 'gorge_ambush',
    title: 'The Gorge',
    description: 'Trapped in a ravine. Austrian Grenzer above. Decisions under fire.',
    mood: 'gorge',
    cast: ['player', 'pierre', 'morin'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: "The gorge closes around the column like a fist. Cliff walls rise on both sides — bare rock, grey and wet. The sound of water echoes from somewhere below. Then the first shot cracks from above.",
        positions: { pierre: 'left', morin: 'right' },
        next: 'morin_1',
        effect: 'shake',
      },
      morin_1: {
        id: 'morin_1', speaker: 'morin', expression: 'determined',
        text: "Grenzer! On the ridgeline! Get against the wall — NOW!",
        mode: 'shout',
        next: 'narrator_1',
      },
      narrator_1: {
        id: 'narrator_1', speaker: 'narrator',
        text: "Shots crack and echo between the cliffs, impossible to tell direction from the ricochets. A man three paces behind you falls without a sound. The column bunches against the rock wall like cattle in a storm.",
        next: 'pierre_1',
      },
      pierre_1: {
        id: 'pierre_1', speaker: 'pierre', expression: 'bitter',
        text: "We're fish in a barrel. They don't even need to aim — just fire into the mass and God does the rest.",
        next: 'morin_2',
      },
      morin_2: {
        id: 'morin_2', speaker: 'morin', expression: 'angry',
        text: "Stow it, Private! I need solutions, not sermons. There — that goat path. If we can get a squad up the left face, we can flank them.",
        next: 'choice_1',
      },
      choice_1: {
        id: 'choice_1', speaker: 'narrator',
        text: "Morin looks at you. The goat path is barely visible — loose scree and a handful of scrub brush for cover. The Grenzer fire steadily from above.",
        choices: [
          { label: '"I\'ll go, Sergeant."', nextId: 'volunteer', description: 'Volunteer for the climb. Dangerous but decisive.' },
          { label: '"Send Pierre — he\'s done this before."', nextId: 'deflect', description: 'Pierre survived Arcole. He can survive this.' },
          { label: '"We should wait for artillery."', nextId: 'wait', description: 'The guns are coming. Patience over bravery.' },
        ],
      },
      volunteer: {
        id: 'volunteer', speaker: 'morin', expression: 'determined',
        text: "Good man. Take four others. Keep low. Don't fire until you're level with them — surprise is the only advantage you'll have. Go.",
        next: 'climb',
      },
      deflect: {
        id: 'deflect', speaker: 'pierre', expression: 'neutral',
        text: "He's right. I'll go. But remember this — next time, it's your turn to climb.",
        next: 'climb',
      },
      wait: {
        id: 'wait', speaker: 'morin', expression: 'angry',
        text: "Artillery? In a gorge? Use your head, soldier! The guns can't elevate enough. We solve this ourselves or we die here. Pierre — you're going up. Move!",
        effect: 'shake',
        next: 'climb',
      },
      climb: {
        id: 'climb', speaker: 'narrator',
        text: "The climbing party scrambles up the goat path, rocks clattering beneath their feet. Below, Morin keeps the column pressed against the wall, returning sporadic fire. Minutes pass like hours. Then — a volley from above, and the Grenzer fire stops. Shouts in German, then silence.",
        effect: 'flash',
        next: 'aftermath',
      },
      aftermath: {
        id: 'aftermath', speaker: 'morin', expression: 'neutral',
        text: "Move! Before they regroup! Double time through the gorge — we stop for nothing!",
        next: 'ending',
      },
      ending: {
        id: 'ending', speaker: 'narrator',
        text: "The column surges forward, stepping over the fallen, boots splashing through the stream. The gorge opens ahead — sunlight and open ground. Behind you, the cliffs hold their silence and their dead.",
        effect: 'fade',
        next: null,
      },
    },
  },
  {
    id: 'march_to_war',
    title: 'The March South',
    description: 'The army descends from the Alps into Italy. Hope and exhaustion.',
    mood: 'march',
    cast: ['player', 'jb', 'felix', 'morin'],
    startNode: 'start',
    nodes: {
      start: {
        id: 'start', speaker: 'narrator',
        text: "The road winds down from the pass like a white ribbon. Below, the Piedmontese plain stretches to the horizon — farmland, vineyards, church steeples. After weeks of mountain cold, the warmth feels like forgiveness.",
        positions: { jb: 'left', felix: 'center', morin: 'right' },
        next: 'jb_1',
      },
      jb_1: {
        id: 'jb_1', speaker: 'jb', expression: 'happy',
        text: "Look at it! Green fields, real trees... is that a vineyard? Please tell me that's a vineyard.",
        next: 'felix_1',
      },
      felix_1: {
        id: 'felix_1', speaker: 'felix', expression: 'happy',
        text: "It is. And those are olive trees. And that — unless my nose deceives me — is bread baking somewhere in that village. Real bread. Not the stone they've been feeding us.",
        next: 'morin_1',
      },
      morin_1: {
        id: 'morin_1', speaker: 'morin', expression: 'neutral',
        text: "Don't get comfortable. We're not here for the wine. The Piedmontese army is three days' march ahead. Enjoy the view while walking.",
        next: 'jb_2',
      },
      jb_2: {
        id: 'jb_2', speaker: 'jb', expression: 'sad',
        text: "My feet are bleeding. Both of them. The left shoe lost its sole somewhere above the snow line.",
        next: 'choice_1',
      },
      choice_1: {
        id: 'choice_1', speaker: 'narrator',
        text: "Jean-Baptiste limps on, his face drawn tight. Felix walks in theatrical silence, conserving energy for the first audience he can find. Morin keeps pace at the rear, watching for stragglers.",
        choices: [
          { label: 'Give JB your spare stockings.', nextId: 'kindness', description: 'You packed an extra pair. He needs them more.' },
          { label: '"Sing something, Felix."', nextId: 'song', description: 'The column could use a lift.' },
          { label: 'March in silence. Save your strength.', nextId: 'silent_march', description: 'Italy will arrive when it arrives.' },
        ],
      },
      kindness: {
        id: 'kindness', speaker: 'jb', expression: 'surprised',
        text: "You... are you sure? These are — thank you. I won't forget this.",
        next: 'morin_react',
      },
      song: {
        id: 'song', speaker: 'felix', expression: 'happy',
        text: "I thought you'd never ask! Allons enfants de la patrie—",
        next: 'morin_react_2',
      },
      morin_react_2: {
        id: 'morin_react_2', speaker: 'morin', expression: 'neutral',
        text: "Something quieter, Martel. We're not on stage.",
        next: 'felix_2',
      },
      felix_2: {
        id: 'felix_2', speaker: 'felix', expression: 'thoughtful',
        text: "Fine. Something for the road, then.",
        next: 'ending',
      },
      morin_react: {
        id: 'morin_react', speaker: 'morin', expression: 'neutral',
        text: "Keep up, both of you. Generosity doesn't excuse tardiness.",
        next: 'ending',
      },
      silent_march: {
        id: 'silent_march', speaker: 'narrator',
        text: "You march. The sun warms your back. The road turns south and the mountains shrink behind you. Jean-Baptiste limps, Felix hums under his breath, Morin watches everything. The army moves like a single organism — tired, hungry, unstoppable.",
        next: 'ending',
      },
      ending: {
        id: 'ending', speaker: 'narrator',
        text: "By evening, the column reaches the valley floor. Cook fires bloom across the fields like scattered stars. The mountains are a dark wall behind you. Ahead, Italy waits — beautiful and unsuspecting. Tomorrow, the campaign begins in earnest.",
        effect: 'fade',
        next: null,
      },
    },
  },
];

/* ================================================================== */
/*  EXPRESSION PORTRAITS — SVG-based character portraits               */
/* ================================================================== */

const EXPRESSION_COLORS: Record<Expression, string> = {
  neutral: '#C4B99A',
  happy: '#D4C47A',
  angry: '#C45544',
  sad: '#7A8BA8',
  surprised: '#D4AF37',
  determined: '#C4956A',
  afraid: '#7CAA8B',
  bitter: '#8B7D6B',
  thoughtful: '#8B9DC3',
};

/** Skin tone for portraits */
const SKIN = '#D4B896';
const SKIN_SHADOW = '#B89870';
const HAIR_DARK = '#3A2A1A';
const HAIR_MEDIUM = '#6B4E35';
const UNIFORM_BLUE = '#1E3A5C';
const UNIFORM_BLUE_LIGHT = '#2A4A6E';
const UNIFORM_RED = '#8B2020';
const UNIFORM_WHITE = '#E8E0D0';

function CharacterPortrait({ character, expression, speaking, position }: {
  character: VNCharacter;
  expression: Expression;
  speaking: boolean;
  position: CharPosition;
}) {
  if (position === 'off') return null;

  const exprColor = EXPRESSION_COLORS[expression];
  const posClass = `vn-portrait vn-portrait-${position}${speaking ? ' vn-speaking' : ''}`;
  const isOfficer = character.rank === 'Captain';
  const isNCO = character.rank === 'Sergeant';

  // Per-character appearance traits
  const charTraits = {
    pierre: { hair: '#2A1A0A', eyeColor: '#4A6070', jawWidth: 28, headRy: 32, hasScar: true, hasMustache: true, stubble: true },
    jb: { hair: '#7A5A30', eyeColor: '#5A7040', jawWidth: 24, headRy: 30, hasScar: false, hasMustache: false, stubble: false },
    felix: { hair: '#B8862D', eyeColor: '#6A5030', jawWidth: 26, headRy: 31, hasScar: false, hasMustache: false, stubble: false },
    morin: { hair: '#5A5A5A', eyeColor: '#4A4040', jawWidth: 30, headRy: 33, hasScar: false, hasMustache: true, stubble: true },
    leclerc: { hair: '#1A1008', eyeColor: '#3A3020', jawWidth: 27, headRy: 31, hasScar: false, hasMustache: true, stubble: false },
    duval: { hair: '#4A3020', eyeColor: '#5A4030', jawWidth: 30, headRy: 34, hasScar: true, hasMustache: true, stubble: true },
  } as Record<string, { hair: string; eyeColor: string; jawWidth: number; headRy: number; hasScar: boolean; hasMustache: boolean; stubble: boolean }>;
  const traits = charTraits[character.id] ?? { hair: HAIR_MEDIUM, eyeColor: '#5A4030', jawWidth: 27, headRy: 32, hasScar: false, hasMustache: false, stubble: false };
  const hairColor = traits.hair;

  return (
    <div className={posClass} style={{
        '--portrait-color': character.color,
        '--portrait-glow': `${character.color}26`,
        '--portrait-glow-soft': `${character.color}0D`,
      } as React.CSSProperties}>
      <div className="vn-portrait-frame" style={{
          borderColor: speaking ? character.color : undefined,
        }}
        title={`${character.name} — ${expression}`}>
        <svg viewBox="0 0 160 220" className="vn-portrait-svg">
          <defs>
            <linearGradient id={`bg_${character.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(30,25,20,0.9)" />
              <stop offset="100%" stopColor="rgba(15,12,8,0.95)" />
            </linearGradient>
            <radialGradient id={`skin_${character.id}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor={SKIN} />
              <stop offset="100%" stopColor={SKIN_SHADOW} />
            </radialGradient>
            <linearGradient id={`uniform_${character.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isOfficer ? '#2A4A6E' : UNIFORM_BLUE} />
              <stop offset="100%" stopColor={isOfficer ? '#1A3A5A' : '#152A40'} />
            </linearGradient>
          </defs>

          {/* Background fill */}
          <rect width="160" height="220" fill={`url(#bg_${character.id})`} />

          {/* Uniform body — French revolutionary military coat */}
          <path d="M30 220 L30 155 Q30 130 50 120 L80 112 L110 120 Q130 130 130 155 L130 220 Z"
            fill={`url(#uniform_${character.id})`} />

          {/* Coat lapels (red for line infantry) */}
          <path d="M60 120 L80 112 L80 165 L55 155 Z" fill={UNIFORM_RED} opacity="0.8" />
          <path d="M100 120 L80 112 L80 165 L105 155 Z" fill={UNIFORM_RED} opacity="0.8" />

          {/* Waistcoat (white) */}
          <path d="M65 150 L80 145 L95 150 L95 220 L65 220 Z" fill={UNIFORM_WHITE} opacity="0.15" />

          {/* Turnback cuffs */}
          <rect x="28" y="185" width="18" height="12" rx="2" fill={UNIFORM_RED} opacity="0.6" />
          <rect x="114" y="185" width="18" height="12" rx="2" fill={UNIFORM_RED} opacity="0.6" />

          {/* Brass buttons */}
          {[130, 140, 150, 160, 170, 180].map((y) => (
            <circle key={`btn_${y}`} cx="80" cy={y} r="2" fill="#C4A035" opacity="0.7" />
          ))}

          {/* Epaulettes */}
          <ellipse cx="48" cy="122" rx="12" ry="5" fill={isOfficer ? '#D4AF37' : isNCO ? '#C4956A' : UNIFORM_BLUE_LIGHT}
            stroke={isOfficer ? '#A88920' : 'none'} strokeWidth="0.5" />
          <ellipse cx="112" cy="122" rx="12" ry="5" fill={isOfficer ? '#D4AF37' : isNCO ? '#C4956A' : UNIFORM_BLUE_LIGHT}
            stroke={isOfficer ? '#A88920' : 'none'} strokeWidth="0.5" />

          {/* Epaulette fringe for officers */}
          {isOfficer && <>
            {[38,42,46,50,54,58].map((x) => (
              <line key={`efl_${x}`} x1={x} y1="126" x2={x-2} y2="132" stroke="#D4AF37" strokeWidth="0.8" />
            ))}
            {[102,106,110,114,118,122].map((x) => (
              <line key={`efr_${x}`} x1={x} y1="126" x2={x+2} y2="132" stroke="#D4AF37" strokeWidth="0.8" />
            ))}
          </>}

          {/* NCO rank chevrons */}
          {isNCO && <>
            <path d="M38 145 L48 138 L58 145" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
            <path d="M38 150 L48 143 L58 150" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          </>}

          {/* Neck / collar */}
          <rect x="62" y="105" width="36" height="10" rx="3" fill={UNIFORM_BLUE} stroke="#C4956A" strokeWidth="0.5" />

          {/* Neck skin */}
          <rect x="70" y="96" width="20" height="14" rx="4" fill={`url(#skin_${character.id})`} />

          {/* Head — shape varies per character */}
          <ellipse cx="80" cy="70" rx={traits.jawWidth} ry={traits.headRy} fill={`url(#skin_${character.id})`} />

          {/* Jaw definition */}
          <path d={`M${80-traits.jawWidth+3} 78 Q${80-traits.jawWidth+8} 98 80 100 Q${80+traits.jawWidth-8} 98 ${80+traits.jawWidth-3} 78`}
            fill={SKIN_SHADOW} opacity="0.3" />

          {/* Stubble/5 o'clock shadow */}
          {traits.stubble && <ellipse cx="80" cy="88" rx="18" ry="12" fill={hairColor} opacity="0.08" />}

          {/* Hair — thicker, more volume, shape varies */}
          {!isOfficer && <>
            <path d={`M${80-traits.jawWidth-2} 58 Q${80-traits.jawWidth} 30 80 ${25 - (traits.headRy > 32 ? 3 : 0)} Q${80+traits.jawWidth} 30 ${80+traits.jawWidth+2} 58 L${80+traits.jawWidth-3} 52 Q${80+traits.jawWidth-8} 36 80 ${32 - (traits.headRy > 32 ? 3 : 0)} Q${80-traits.jawWidth+8} 36 ${80-traits.jawWidth+3} 52 Z`}
              fill={hairColor} />
            {/* Hair texture lines */}
            <path d={`M${80-traits.jawWidth+5} 40 Q75 32 80 ${28 - (traits.headRy > 32 ? 2 : 0)}`} fill="none" stroke={hairColor} strokeWidth="2" opacity="0.5" />
            <path d={`M${80+traits.jawWidth-5} 40 Q85 32 80 ${28 - (traits.headRy > 32 ? 2 : 0)}`} fill="none" stroke={hairColor} strokeWidth="2" opacity="0.5" />
          </>}
          {/* Sideburns — thicker for older/rougher characters */}
          <rect x={80 - traits.jawWidth - 2} y="55" width={traits.stubble ? 7 : 5} height={traits.hasMustache ? 22 : 16} rx="2" fill={hairColor} opacity={traits.stubble ? 0.85 : 0.6} />
          <rect x={80 + traits.jawWidth - (traits.stubble ? 5 : 3)} y="55" width={traits.stubble ? 7 : 5} height={traits.hasMustache ? 22 : 16} rx="2" fill={hairColor} opacity={traits.stubble ? 0.85 : 0.6} />

          {/* Nose */}
          <path d="M80 62 L78 78 Q80 81 82 78 L80 62" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.5" />

          {/* Eyes */}
          <g>
            {/* Eye whites */}
            <ellipse cx="68" cy="65" rx="7" ry="4.5" fill="#F0EDE5" />
            <ellipse cx="92" cy="65" rx="7" ry="4.5" fill="#F0EDE5" />
            {/* Irises */}
            <circle cx={expression === 'afraid' ? 66 : 68} cy="65" r="3.5" fill={traits.eyeColor} />
            <circle cx={expression === 'afraid' ? 94 : 92} cy="65" r="3.5" fill={traits.eyeColor} />
            {/* Pupils */}
            <circle cx={expression === 'afraid' ? 66 : 68} cy="65" r="1.8" fill="#1A1A1A" />
            <circle cx={expression === 'afraid' ? 94 : 92} cy="65" r="1.8" fill="#1A1A1A" />
            {/* Eye highlights */}
            <circle cx={expression === 'afraid' ? 67 : 69} cy="64" r="1" fill="white" opacity="0.7" />
            <circle cx={expression === 'afraid' ? 95 : 93} cy="64" r="1" fill="white" opacity="0.7" />
            {/* Upper eyelids */}
            <path d="M61 63 Q68 58 75 63" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" />
            <path d="M85 63 Q92 58 99 63" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" />
          </g>

          {/* Expression-dependent eyebrows */}
          {expression === 'angry' && <>
            <path d="M59 55 L73 52" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M87 52 L101 55" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          </>}
          {expression === 'surprised' && <>
            <path d="M60 53 Q68 48 75 53" fill="none" stroke={hairColor} strokeWidth="2" />
            <path d="M85 53 Q92 48 100 53" fill="none" stroke={hairColor} strokeWidth="2" />
          </>}
          {expression === 'sad' && <>
            <path d="M60 54 Q66 57 74 55" fill="none" stroke={hairColor} strokeWidth="2" />
            <path d="M86 55 Q94 57 100 54" fill="none" stroke={hairColor} strokeWidth="2" />
          </>}
          {expression === 'afraid' && <>
            <path d="M60 53 Q66 56 74 54" fill="none" stroke={hairColor} strokeWidth="1.5" />
            <path d="M86 54 Q94 56 100 53" fill="none" stroke={hairColor} strokeWidth="1.5" />
          </>}
          {(expression === 'neutral' || expression === 'bitter' || expression === 'thoughtful') && <>
            <line x1="60" y1="56" x2="74" y2="55" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
            <line x1="86" y1="55" x2="100" y2="56" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
          </>}
          {(expression === 'happy' || expression === 'determined') && <>
            <path d="M60 56 Q67 53 74 55" fill="none" stroke={hairColor} strokeWidth="2" />
            <path d="M86 55 Q93 53 100 56" fill="none" stroke={hairColor} strokeWidth="2" />
          </>}

          {/* Expression-dependent mouth */}
          {expression === 'happy' && <path d="M70 84 Q80 92 90 84" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
          {expression === 'angry' && <path d="M70 86 L90 86" stroke={SKIN_SHADOW} strokeWidth="2" />}
          {expression === 'sad' && <path d="M70 88 Q80 82 90 88" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
          {expression === 'surprised' && <ellipse cx="80" cy="87" rx="6" ry="5" fill="#8B5A3A" opacity="0.4" stroke={SKIN_SHADOW} strokeWidth="1" />}
          {expression === 'neutral' && <line x1="72" y1="86" x2="88" y2="86" stroke={SKIN_SHADOW} strokeWidth="1.2" />}
          {expression === 'determined' && <path d="M70 84 L80 86 L90 84" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
          {expression === 'afraid' && <path d="M72 86 Q80 83 88 86" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.8" />}
          {expression === 'bitter' && <path d="M71 85 Q80 83 89 86" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
          {expression === 'thoughtful' && <path d="M72 85 L80 86 L88 84" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.2" />}

          {/* Mustache — thick, visible */}
          {traits.hasMustache && <>
            <path d="M68 82 Q72 79 80 80 Q88 79 92 82 Q88 84 80 83 Q72 84 68 82 Z" fill={hairColor} opacity="0.55" />
            <path d="M70 81 Q75 79 80 80 Q85 79 90 81" fill="none" stroke={hairColor} strokeWidth="1.8" opacity="0.7" />
          </>}

          {/* Chin stubble / 5 o'clock shadow for rough characters */}
          {traits.stubble && <>
            {[74,77,80,83,86].map((x) => [82,85,88].map((y) => (
              <circle key={`stb_${x}_${y}`} cx={x + (y%2)*0.5} cy={y + (x%3)*0.3} r="0.4" fill={hairColor} opacity="0.15" />
            ))).flat()}
          </>}

          {/* Scar — more visible diagonal across left cheek */}
          {traits.hasScar && <>
            <path d="M58 68 L67 84" fill="none" stroke="rgba(200,150,130,0.45)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M59 69 L68 85" fill="none" stroke="rgba(160,120,100,0.2)" strokeWidth="0.8" strokeLinecap="round" />
          </>}

          {/* Bicorn hat for officers */}
          {isOfficer && <>
            <path d="M45 45 Q50 20 80 15 Q110 20 115 45 L105 40 Q95 28 80 25 Q65 28 55 40 Z"
              fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5" />
            <path d="M55 40 L80 38 L105 40" fill="none" stroke="#D4AF37" strokeWidth="1" />
            {/* Cockade */}
            <circle cx="80" cy="33" r="4" fill="#1E3A5C" stroke="#D4AF37" strokeWidth="0.8" />
            <circle cx="80" cy="33" r="2" fill={UNIFORM_RED} />
          </>}

          {/* Ear details */}
          <ellipse cx={80 - traits.jawWidth} cy="70" rx="4" ry="6" fill={SKIN_SHADOW} opacity="0.4" />
          <ellipse cx={80 + traits.jawWidth} cy="70" rx="4" ry="6" fill={SKIN_SHADOW} opacity="0.4" />

          {/* Collar crossbelt / sash for NCOs */}
          {isNCO && <path d="M50 130 L110 155 L112 150 L52 125 Z" fill={UNIFORM_RED} opacity="0.3" />}

          {/* Speaking indicator glow */}
          {speaking && <rect width="160" height="220" fill="none" stroke={character.color} strokeWidth="0" opacity="0" />}
        </svg>
      </div>
      <span className="vn-portrait-name" style={{ color: character.color }}>{character.name}</span>
      {expression !== character.defaultExpression && (
        <span className="vn-expression-badge" style={{ color: exprColor }}>{expression}</span>
      )}
    </div>
  );
}

/* ================================================================== */
/*  BACKGROUND SCENES — SVG atmospheric art per mood                   */
/* ================================================================== */

const MOOD_CSS_BG: Record<SceneMood, string> = {
  night_camp: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 40%, #2A1F15 100%)',
  dawn: 'linear-gradient(180deg, #1A1520 0%, #2E2540 30%, #4A3A50 60%, #8A6A60 100%)',
  battlefield: 'linear-gradient(180deg, #1A1A1A 0%, #2A2520 40%, #3A3020 100%)',
  march: 'linear-gradient(180deg, #15181E 0%, #1E2228 50%, #252A30 100%)',
  interior: 'linear-gradient(180deg, #1A1510 0%, #2A2015 50%, #1A1510 100%)',
  ridge: 'linear-gradient(180deg, #0F1520 0%, #1A2535 50%, #2A3545 100%)',
  gorge: 'linear-gradient(180deg, #0A0A0F 0%, #151520 40%, #1A1A25 100%)',
};

/** SVG atmospheric background art for each mood */
function MoodBackground({ mood }: { mood: SceneMood }) {
  return (
    <div className="vn-bg-scene">
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Night sky gradient */}
          <linearGradient id="vn_sky" x1="0" y1="0" x2="0" y2="1">
            {mood === 'night_camp' && <>
              <stop offset="0%" stopColor="#05080F" />
              <stop offset="40%" stopColor="#0E1525" />
              <stop offset="100%" stopColor="#1A1510" />
            </>}
            {mood === 'dawn' && <>
              <stop offset="0%" stopColor="#1A1520" />
              <stop offset="30%" stopColor="#2E2540" />
              <stop offset="60%" stopColor="#6A4A50" />
              <stop offset="100%" stopColor="#A87060" />
            </>}
            {mood === 'battlefield' && <>
              <stop offset="0%" stopColor="#2A2520" />
              <stop offset="40%" stopColor="#3A3020" />
              <stop offset="100%" stopColor="#4A4030" />
            </>}
            {mood === 'march' && <>
              <stop offset="0%" stopColor="#1A2030" />
              <stop offset="50%" stopColor="#253040" />
              <stop offset="100%" stopColor="#2A3540" />
            </>}
            {mood === 'interior' && <>
              <stop offset="0%" stopColor="#1A1510" />
              <stop offset="50%" stopColor="#252015" />
              <stop offset="100%" stopColor="#1A1510" />
            </>}
            {mood === 'ridge' && <>
              <stop offset="0%" stopColor="#0F1520" />
              <stop offset="50%" stopColor="#1A2535" />
              <stop offset="100%" stopColor="#253040" />
            </>}
            {mood === 'gorge' && <>
              <stop offset="0%" stopColor="#08080F" />
              <stop offset="40%" stopColor="#101018" />
              <stop offset="100%" stopColor="#151520" />
            </>}
          </linearGradient>
          <radialGradient id="vn_fire_glow" cx="50%" cy="85%" r="30%">
            <stop offset="0%" stopColor="rgba(255,150,50,0.12)" />
            <stop offset="100%" stopColor="rgba(255,150,50,0)" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="800" height="500" fill="url(#vn_sky)" />

        {/* Night camp scene */}
        {mood === 'night_camp' && <>
          {/* Stars */}
          {[
            [80,30],[150,55],[250,20],[320,65],[400,15],[480,40],[560,25],[650,50],[720,35],
            [120,80],[200,45],[370,75],[520,60],[600,30],[680,80],[770,45],[50,60],[440,50],
          ].map(([x,y], i) => (
            <circle key={`s${i}`} cx={x} cy={y} r={i % 5 === 0 ? 1.5 : 0.8} fill="white"
              opacity={0.3 + (i % 4) * 0.15}>
              <animate attributeName="opacity" values={`${0.3 + (i%4)*0.15};${0.6 + (i%3)*0.1};${0.3 + (i%4)*0.15}`}
                dur={`${3 + i % 4}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Mountains silhouette */}
          <path d="M0 250 L80 180 L160 220 L240 150 L350 190 L450 140 L520 185 L600 160 L680 200 L750 170 L800 210 L800 500 L0 500 Z"
            fill="#0A0E15" opacity="0.9" />
          <path d="M0 280 L120 240 L200 260 L300 220 L400 250 L500 215 L580 240 L700 230 L800 260 L800 500 L0 500 Z"
            fill="#0F1520" opacity="0.8" />

          {/* Ground — with texture variation */}
          <rect x="0" y="350" width="800" height="150" fill="#15120E" />
          <rect x="0" y="350" width="800" height="3" fill="#1A1510" opacity="0.6" />
          {/* Ground texture patches — earth, gravel, grass tufts */}
          {[60,180,300,500,650,750].map((x, i) => (
            <ellipse key={`gt${i}`} cx={x} cy={365+i*4} rx={30+i*5} ry={2+i*0.5}
              fill={`rgba(${20+i*3},${18+i*2},${12+i},${0.15+i*0.02})`} />
          ))}
          {/* Grass tufts */}
          {[70,200,450,620,740].map((x, i) => (
            <path key={`gf${i}`} d={`M${x} ${360+i*3} Q${x+2} ${353+i*3} ${x+4} ${360+i*3}`}
              fill="none" stroke="rgba(30,35,15,0.2)" strokeWidth="0.5" />
          ))}

          {/* Campfire glow on ground */}
          <ellipse cx="400" cy="430" rx="120" ry="20" fill="rgba(255,120,30,0.04)" />
          {/* Campfire glow */}
          <circle cx="400" cy="420" r="100" fill="url(#vn_fire_glow)" />
          <circle cx="400" cy="420" r="50" fill="rgba(255,120,30,0.06)">
            <animate attributeName="r" values="48;52;48" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Campfire */}
          <path d="M385 420 L390 400 L395 415 L400 390 L405 415 L410 395 L415 420 Z" fill="#D4600A" opacity="0.8">
            <animate attributeName="d"
              values="M385 420 L390 400 L395 415 L400 390 L405 415 L410 395 L415 420 Z;M385 420 L392 395 L396 412 L400 385 L404 412 L408 398 L415 420 Z;M385 420 L390 400 L395 415 L400 390 L405 415 L410 395 L415 420 Z"
              dur="0.8s" repeatCount="indefinite" />
          </path>
          <path d="M388 420 L393 408 L398 418 L400 395 L402 418 L407 405 L412 420 Z" fill="#FF9020" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.8;0.6" dur="0.6s" repeatCount="indefinite" />
          </path>
          {/* Fire pit stones */}
          {[0,1,2,3,4,5,6,7].map((i) => {
            const angle = (i / 8) * Math.PI * 2;
            const cx = 400 + Math.cos(angle) * 18;
            const cy = 425 + Math.sin(angle) * 6;
            return <ellipse key={`fp${i}`} cx={cx} cy={cy} rx="4" ry="2.5"
              fill="#2A2218" stroke="#1A1510" strokeWidth="0.3" />;
          })}

          {/* Logs */}
          <line x1="380" y1="425" x2="420" y2="422" stroke="#3A2A15" strokeWidth="4" strokeLinecap="round" />
          <line x1="382" y1="428" x2="418" y2="430" stroke="#3A2A15" strokeWidth="3.5" strokeLinecap="round" />

          {/* Sparks */}
          {[1,2,3,4,5].map((i) => (
            <circle key={`sp${i}`} cx={395 + i * 3} cy={400 - i * 15} r="0.8" fill="#FFB040" opacity="0.6">
              <animate attributeName="cy" values={`${400 - i*15};${370 - i*20};${400 - i*15}`}
                dur={`${1.5 + i*0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur={`${1.5 + i*0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Floating embers — drift upward from campfire */}
          {[1,2,3,4,5,6,7,8,9,10].map((i) => {
            const startX = 388 + i * 4 + (i % 3) * 6;
            const startY = 395 - i * 5;
            const endY = 200 - i * 15;
            const drift = (i % 2 ? 1 : -1) * (10 + i * 5);
            const dur = 3 + i * 0.7;
            return (
              <circle key={`emb${i}`} cx={startX} cy={startY} r={0.6 + (i % 3) * 0.3} fill="#FFB040">
                <animate attributeName="cy" values={`${startY};${endY}`}
                  dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${startX};${startX + drift};${startX + drift * 0.5}`}
                  dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.7;0"
                  dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Distant campfires */}
          {[150, 300, 550, 680].map((x, i) => (
            <g key={`cf${i}`}>
              <circle cx={x} cy={310 + i * 8} r="3" fill="#FF8020" opacity="0.15">
                <animate attributeName="opacity" values="0.15;0.25;0.15" dur={`${2 + i}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={310 + i * 8} r="8" fill="rgba(255,120,30,0.04)" />
            </g>
          ))}

          {/* Stacked muskets (arms rack) */}
          <g opacity="0.4">
            <line x1="460" y1="420" x2="465" y2="370" stroke="#2A2015" strokeWidth="2" />
            <line x1="468" y1="420" x2="470" y2="370" stroke="#2A2015" strokeWidth="2" />
            <line x1="476" y1="420" x2="473" y2="370" stroke="#2A2015" strokeWidth="2" />
            {/* Crossbar */}
            <line x1="463" y1="385" x2="475" y2="385" stroke="#2A2015" strokeWidth="1" />
          </g>

          {/* Distant seated soldier silhouettes around other campfire */}
          {/* Figure near left distant campfire */}
          <g opacity="0.2">
            <circle cx="155" cy="303" r="2.5" fill="#0A0A0A" />
            <path d="M155 305 L155 315 L152 325 M155 315 L158 325" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Figure near right distant campfire */}
          <g opacity="0.2">
            <circle cx="685" cy="326" r="2.5" fill="#0A0A0A" />
            <path d="M685 328 L685 338 L682 348 M685 338 L688 348" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Tent silhouettes — more detailed */}
          <path d="M100 370 L130 340 L160 370 Z" fill="#0A0A0A" opacity="0.5" />
          <path d="M600 365 L640 330 L680 365 Z" fill="#0A0A0A" opacity="0.5" />
          {/* Tent guy ropes */}
          <line x1="130" y1="340" x2="170" y2="370" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />
          <line x1="130" y1="340" x2="90" y2="370" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />
          <line x1="640" y1="330" x2="690" y2="365" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />
          <line x1="640" y1="330" x2="590" y2="365" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />

          {/* Low mist near ground */}
          <ellipse cx="200" cy="375" rx="120" ry="8" fill="rgba(150,130,100,0.03)">
            <animate attributeName="rx" values="120;140;120" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="550" cy="370" rx="100" ry="6" fill="rgba(150,130,100,0.025)">
            <animate attributeName="rx" values="100;115;100" dur="10s" repeatCount="indefinite" />
          </ellipse>
        </>}

        {/* Dawn scene — camp at first light */}
        {mood === 'dawn' && <>
          {/* Dawn horizon glow — rich sunrise colors */}
          <ellipse cx="400" cy="280" rx="500" ry="120" fill="rgba(200,120,80,0.1)" />
          <ellipse cx="400" cy="290" rx="350" ry="50" fill="rgba(255,180,120,0.08)" />
          <ellipse cx="400" cy="300" rx="200" ry="25" fill="rgba(255,200,140,0.06)" />

          {/* Fading stars */}
          {[100,250,500,650,750].map((x, i) => (
            <circle key={`ds${i}`} cx={x} cy={40+i*15} r="0.7" fill="white" opacity={0.1 - i*0.015} />
          ))}

          {/* Wispy dawn clouds — more layers */}
          <ellipse cx="150" cy="100" rx="130" ry="15" fill="rgba(200,130,90,0.07)" />
          <ellipse cx="350" cy="70" rx="90" ry="12" fill="rgba(200,130,90,0.05)" />
          <ellipse cx="550" cy="90" rx="100" ry="16" fill="rgba(200,130,90,0.06)" />
          <ellipse cx="700" cy="130" rx="80" ry="12" fill="rgba(200,130,90,0.04)" />
          {/* Cloud highlights */}
          <ellipse cx="180" cy="98" rx="60" ry="6" fill="rgba(255,180,120,0.04)" />
          <ellipse cx="560" cy="88" rx="50" ry="5" fill="rgba(255,180,120,0.03)" />

          {/* Mountain silhouettes — layered */}
          <path d="M0 260 L80 200 L160 230 L250 170 L350 200 L450 150 L550 180 L650 160 L750 190 L800 220 L800 500 L0 500 Z"
            fill="#18132A" opacity="0.6" />
          <path d="M0 290 L100 240 L200 265 L300 220 L400 250 L500 210 L600 240 L700 225 L800 260 L800 500 L0 500 Z"
            fill="#1A1520" opacity="0.7" />

          {/* Ground — camp clearing */}
          <rect x="0" y="350" width="800" height="150" fill="#2A2015" />
          <rect x="0" y="350" width="800" height="5" fill="rgba(200,160,120,0.04)" />

          {/* Tent rows — more detail */}
          {[50, 150, 250, 450, 550, 700].map((x, i) => (
            <g key={`t${i}`}>
              <path d={`M${x} 375 L${x+20} 348 L${x+40} 375 Z`} fill="#1A1510" opacity="0.45" />
              {/* Tent entrance flap */}
              <path d={`M${x+15} 375 L${x+20} 358 L${x+25} 375 Z`} fill="#15120E" opacity="0.3" />
            </g>
          ))}

          {/* Campfire embers — early morning remnants */}
          {[120, 350, 620].map((x, i) => (
            <g key={`de${i}`}>
              <circle cx={x} cy={380 + i*3} r="5" fill="rgba(255,100,30,0.04)" />
              <circle cx={x} cy={380 + i*3} r="2" fill="rgba(255,80,20,0.06)">
                <animate attributeName="opacity" values="0.06;0.1;0.06" dur={`${3+i}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Morning mist — thicker, layered */}
          <rect x="0" y="330" width="800" height="40" fill="rgba(200,180,160,0.06)" />
          <rect x="0" y="345" width="800" height="25" fill="rgba(200,180,160,0.05)" />
          <ellipse cx="300" cy="340" rx="200" ry="15" fill="rgba(200,180,160,0.04)" />
          <ellipse cx="600" cy="345" rx="150" ry="12" fill="rgba(200,180,160,0.03)" />

          {/* Distant figure silhouette — sentry */}
          <line x1="680" y1="345" x2="680" y2="325" stroke="#1A1520" strokeWidth="2.5" />
          <circle cx="680" cy="323" r="3" fill="#1A1520" />
          {/* Musket */}
          <line x1="682" y1="340" x2="685" y2="318" stroke="#1A1520" strokeWidth="1" />

          {/* Drummer boy silhouette — smaller figure */}
          <line x1="320" y1="360" x2="320" y2="345" stroke="#1A1520" strokeWidth="2" />
          <circle cx="320" cy="343" r="2.5" fill="#1A1520" />
          {/* Drum */}
          <ellipse cx="323" cy="354" rx="4" ry="3" fill="#1A1520" opacity="0.7" />

          {/* Morning birds in flight */}
          {[200,280,340,420,550].map((x, i) => (
            <path key={`bird${i}`}
              d={`M${x} ${60+i*12} Q${x+3} ${56+i*12} ${x+6} ${60+i*12} Q${x+9} ${56+i*12} ${x+12} ${60+i*12}`}
              fill="none" stroke="#1A1520" strokeWidth="0.6" opacity={0.3 - i*0.04} />
          ))}

          {/* Smoke rising from campfire remnants */}
          {[120, 350, 620].map((x, i) => (
            <path key={`ds${i}`}
              d={`M${x} ${375+i*3} Q${x+5} ${360+i*3} ${x-3} ${345+i*3}`}
              fill="none" stroke="rgba(200,180,160,0.04)" strokeWidth="2" strokeLinecap="round">
              <animate attributeName="d"
                values={`M${x} ${375+i*3} Q${x+5} ${360+i*3} ${x-3} ${345+i*3};M${x} ${375+i*3} Q${x-5} ${358+i*3} ${x+3} ${342+i*3};M${x} ${375+i*3} Q${x+5} ${360+i*3} ${x-3} ${345+i*3}`}
                dur={`${4+i}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Sun rays breaking over mountain — golden shafts of light */}
          <line x1="420" y1="165" x2="300" y2="380" stroke="rgba(255,200,120,0.015)" strokeWidth="35" />
          <line x1="400" y1="155" x2="200" y2="370" stroke="rgba(255,200,120,0.012)" strokeWidth="25" />
          <line x1="440" y1="160" x2="550" y2="380" stroke="rgba(255,200,120,0.01)" strokeWidth="30" />
          <line x1="460" y1="170" x2="650" y2="375" stroke="rgba(255,200,120,0.008)" strokeWidth="20" />

          {/* Dew drops on tent canvas — sparkling */}
          {[55,75,155,175,255,275,455,475,555,575,705,725].map((x, i) => (
            <circle key={`dew${i}`} cx={x} cy={352 + (i%3)*2} r="0.5" fill="rgba(255,230,180,0.08)">
              <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2+i*0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Flag/standard at camp center */}
          <line x1="400" y1="375" x2="400" y2="320" stroke="#2A2015" strokeWidth="1.5" />
          <path d="M400 320 L425 325 Q422 330 425 336 L400 332 Z" fill="rgba(30,50,120,0.2)">
            <animate attributeName="d"
              values="M400 320 L425 325 Q422 330 425 336 L400 332 Z;M400 320 L423 326 Q420 331 424 335 L400 332 Z;M400 320 L425 325 Q422 330 425 336 L400 332 Z"
              dur="3s" repeatCount="indefinite" />
          </path>
        </>}

        {/* Battlefield scene — aftermath of a charge */}
        {mood === 'battlefield' && <>
          {/* Smoke haze layers — organic shapes */}
          <rect x="0" y="0" width="800" height="500" fill="rgba(150,130,100,0.04)" />
          <path d="M50 180 Q120 150 200 170 Q280 130 350 160 Q380 200 320 220 Q250 250 150 230 Q80 210 50 180 Z"
            fill="rgba(150,130,100,0.05)" />
          <path d="M450 130 Q530 100 620 120 Q700 90 760 130 Q740 170 650 180 Q560 200 480 170 Q440 160 450 130 Z"
            fill="rgba(150,130,100,0.04)" />
          <path d="M200 280 Q350 250 500 270 Q600 300 700 280 Q680 320 550 310 Q400 330 250 310 Q180 300 200 280 Z"
            fill="rgba(150,130,100,0.035)" />

          {/* Distant tree line */}
          <path d="M0 240 L40 220 L80 230 L120 215 L160 225 L200 210 L250 220 L300 205 L350 218 L400 208 L450 220 L500 212 L550 225 L600 215 L650 228 L700 218 L750 230 L800 220 L800 280 L0 280 Z"
            fill="#1A1810" opacity="0.5" />

          {/* Hills */}
          <path d="M0 300 Q200 250 400 280 Q600 310 800 270 L800 500 L0 500 Z" fill="#2A2520" />
          <path d="M0 350 Q200 320 400 340 Q600 360 800 330 L800 500 L0 500 Z" fill="#30281E" />

          {/* Cannon smoke puffs — organic drifting clouds */}
          {[150, 350, 550, 700].map((x, i) => {
            const y = 250 + i * 15;
            const rx = 50 + i * 10;
            const ry = 18 + i * 5;
            return (
              <g key={`sm${i}`}>
                <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="rgba(180,170,150,0.04)">
                  <animate attributeName="rx" values={`${rx};${rx+15};${rx}`}
                    dur={`${4+i}s`} repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${x};${x+15};${x}`}
                    dur={`${6+i*2}s`} repeatCount="indefinite" />
                </ellipse>
                {/* Wispy tendril */}
                <ellipse cx={x+rx*0.6} cy={y-ry*0.4} rx={rx*0.3} ry={ry*0.5}
                  fill="rgba(180,170,150,0.025)">
                  <animate attributeName="cx" values={`${x+rx*0.6};${x+rx*0.8};${x+rx*0.6}`}
                    dur={`${5+i}s`} repeatCount="indefinite" />
                </ellipse>
              </g>
            );
          })}

          {/* Bridge structure (Lodi context) — enhanced */}
          {/* Bridge deck with plank texture */}
          <rect x="300" y="365" width="200" height="8" fill="#3A3020" stroke="#2A2015" strokeWidth="0.5" />
          {/* Plank lines */}
          {[310,325,340,355,370,385,400,415,430,445,460,475,490].map((x, i) => (
            <line key={`plk${i}`} x1={x} y1="365" x2={x} y2="373"
              stroke="rgba(20,15,10,0.3)" strokeWidth="0.3" />
          ))}
          {/* Bridge railing posts */}
          <rect x="310" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="340" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="380" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="420" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="460" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="490" y="373" width="6" height="15" fill="#2A2015" />
          {/* Railing top */}
          <line x1="310" y1="387" x2="496" y2="387" stroke="#2A2015" strokeWidth="1.5" />

          {/* Fallen soldier silhouettes */}
          {/* Soldier lying on bridge */}
          <ellipse cx="340" cy="362" rx="8" ry="3" fill="rgba(20,15,10,0.25)" />
          <circle cx="332" cy="361" r="2.5" fill="rgba(20,15,10,0.2)" />
          {/* Soldier on ground near bridge */}
          <ellipse cx="270" cy="380" rx="10" ry="3" fill="rgba(25,20,15,0.2)" />
          <circle cx="260" cy="379" r="2.5" fill="rgba(25,20,15,0.18)" />
          {/* Soldier on far side */}
          <ellipse cx="530" cy="375" rx="9" ry="3" fill="rgba(25,20,15,0.18)" />
          <circle cx="539" cy="374" r="2.5" fill="rgba(25,20,15,0.15)" />

          {/* River under bridge */}
          <path d="M280 395 Q400 385 520 395 L520 420 Q400 410 280 420 Z" fill="rgba(30,40,50,0.25)" />
          <path d="M290 400 Q400 392 510 402" fill="none" stroke="rgba(60,80,100,0.1)" strokeWidth="0.5">
            <animate attributeName="d" values="M290 400 Q400 392 510 402;M290 402 Q400 394 510 400;M290 400 Q400 392 510 402"
              dur="4s" repeatCount="indefinite" />
          </path>

          {/* Fallen equipment — scattered debris */}
          {/* Musket */}
          <line x1="180" y1="375" x2="220" y2="360" stroke="#3A3020" strokeWidth="2" strokeLinecap="round" />
          {/* Shako hat */}
          <ellipse cx="550" cy="370" rx="8" ry="4" fill="#1A1A1A" />
          <rect x="545" y="360" width="10" height="10" rx="1" fill="#1A1A1A" />
          {/* Cartridge box */}
          <rect x="650" y="372" width="10" height="7" rx="1" fill="#2A2015" />

          {/* Tattered flag */}
          <line x1="250" y1="380" x2="250" y2="330" stroke="#3A3020" strokeWidth="2" />
          <path d="M250 330 L280 335 Q275 342 280 348 L250 345 Z" fill="rgba(30,50,100,0.3)" />
          <path d="M255 332 L270 335 Q268 340 270 345 L255 343 Z" fill="rgba(180,30,30,0.15)" />

          {/* Ground texture — churned earth */}
          {[100,200,350,500,600,720].map((x, i) => (
            <ellipse key={`bt${i}`} cx={x} cy={385 + (i%3)*5} rx={20+i*3} ry={3} fill="rgba(60,50,35,0.15)" />
          ))}

          {/* Embers / distant fires */}
          {[120, 380, 680].map((x, i) => (
            <circle key={`bf${i}`} cx={x} cy={260 + i*15} r="2" fill="rgba(255,100,30,0.1)">
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur={`${3+i}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Distant cannon flash — periodic */}
          <circle cx="720" cy="230" r="6" fill="rgba(255,200,100,0.0)">
            <animate attributeName="fill" values="rgba(255,200,100,0);rgba(255,200,100,0.15);rgba(255,200,100,0)" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="720" cy="230" r="15" fill="rgba(255,200,100,0.0)">
            <animate attributeName="fill" values="rgba(255,200,100,0);rgba(255,200,100,0.04);rgba(255,200,100,0)" dur="5s" repeatCount="indefinite" />
          </circle>

          {/* Drifting smoke layer across bottom */}
          <path d="M0 390 Q100 380 200 385 Q350 395 500 388 Q650 380 800 390 L800 400 L0 400 Z"
            fill="rgba(150,140,120,0.04)">
            <animate attributeName="d"
              values="M0 390 Q100 380 200 385 Q350 395 500 388 Q650 380 800 390 L800 400 L0 400 Z;M0 388 Q100 382 200 387 Q350 393 500 386 Q650 382 800 392 L800 400 L0 400 Z;M0 390 Q100 380 200 385 Q350 395 500 388 Q650 380 800 390 L800 400 L0 400 Z"
              dur="6s" repeatCount="indefinite" />
          </path>
        </>}

        {/* March scene — army descending from Alps into Italy */}
        {mood === 'march' && <>
          {/* Haze layer */}
          <rect x="0" y="200" width="800" height="300" fill="rgba(120,140,160,0.02)" />

          {/* Road — perspective */}
          <path d="M320 500 L380 320 L395 220 L400 150 L405 220 L420 320 L480 500 Z" fill="rgba(150,130,100,0.07)" />
          {/* Road edge lines */}
          <path d="M320 500 L380 320 L395 220" fill="none" stroke="rgba(150,130,100,0.05)" strokeWidth="0.5" />
          <path d="M480 500 L420 320 L405 220" fill="none" stroke="rgba(150,130,100,0.05)" strokeWidth="0.5" />

          {/* Distant Alps — snow-capped */}
          <path d="M0 230 L80 140 L160 190 L250 100 L350 150 L450 80 L550 130 L650 100 L750 140 L800 170 L800 500 L0 500 Z"
            fill="#141E2E" opacity="0.65" />
          {/* Snow caps */}
          <path d="M240 108 L250 100 L260 112" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M440 88 L450 80 L460 92" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M640 108 L650 100 L660 112" fill="none" stroke="rgba(200,210,230,0.18)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Mid-range foothills with trees */}
          <path d="M0 290 L100 260 L200 275 L350 250 L500 265 L650 255 L800 275 L800 500 L0 500 Z"
            fill="#1A2530" opacity="0.8" />

          {/* Distant column of soldiers on road (tiny dots) */}
          {[200,210,222,235,248,260,275,290,308,325].map((y, i) => (
            <circle key={`sol${i}`} cx={400 + (i%2 ? 3 : -3)} cy={y} r={0.8 - i*0.03} fill="rgba(50,60,70,0.3)" />
          ))}

          {/* Mule train / supply wagons on road — closer, more visible */}
          {[340,360,380].map((y, i) => (
            <g key={`mule${i}`}>
              {/* Pack mule body */}
              <ellipse cx={400 + (i%2 ? 6 : -4)} cy={y} rx={4+i} ry={2+i*0.5} fill="rgba(60,50,40,0.25)" />
              {/* Mule legs */}
              <line x1={397+(i%2?6:-4)} y1={y+2+i*0.5} x2={396+(i%2?6:-4)} y2={y+5+i} stroke="rgba(60,50,40,0.15)" strokeWidth="0.5" />
              <line x1={403+(i%2?6:-4)} y1={y+2+i*0.5} x2={404+(i%2?6:-4)} y2={y+5+i} stroke="rgba(60,50,40,0.15)" strokeWidth="0.5" />
              {/* Pack on back */}
              <rect x={397+(i%2?6:-4)} y={y-3-i*0.5} width={6+i} height={3+i*0.3} rx="1" fill="rgba(80,60,40,0.15)" />
            </g>
          ))}

          {/* Road wheel ruts — perspective lines */}
          <path d="M390 500 L398 350 L399 280" fill="none" stroke="rgba(120,100,70,0.04)" strokeWidth="0.5" />
          <path d="M410 500 L402 350 L401 280" fill="none" stroke="rgba(120,100,70,0.04)" strokeWidth="0.5" />

          {/* Guidon flag carried by lead column */}
          <line x1="400" y1="192" x2="400" y2="180" stroke="rgba(50,60,70,0.3)" strokeWidth="0.5" />
          <path d="M400 180 L406 182 L400 184 Z" fill="rgba(30,50,100,0.2)" />

          {/* Near-range landscape */}
          <path d="M0 340 L150 325 L300 335 L450 320 L600 330 L750 322 L800 335 L800 500 L0 500 Z"
            fill="#1E2830" />

          {/* Trees on hillside */}
          {[80,160,280,550,650,730].map((x, i) => {
            const h = 14 + (i%3) * 6;
            return <path key={`mt${i}`} d={`M${x} ${330 - i*2} L${x-3} ${330 - i*2} L${x} ${330 - i*2 - h} L${x+3} ${330 - i*2} Z`}
              fill="rgba(15,25,20,0.5)" />;
          })}

          {/* Ground with green hints (approaching Italy) */}
          <rect x="0" y="370" width="800" height="130" fill="#1E2530" />
          <rect x="0" y="370" width="800" height="130" fill="rgba(40,60,40,0.04)" />

          {/* Grass tufts */}
          {[50,150,280,400,520,650,750].map((x, i) => (
            <path key={`gr${i}`} d={`M${x} ${385+i*2} Q${x+3} ${375+i*2} ${x+6} ${385+i*2}`}
              fill="none" stroke="rgba(60,80,50,0.08)" strokeWidth="1" />
          ))}

          {/* Dust kicked up by marching column */}
          <ellipse cx="400" cy="420" rx="60" ry="12" fill="rgba(150,130,100,0.04)">
            <animate attributeName="rx" values="60;75;60" dur="6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="400" cy="350" rx="30" ry="6" fill="rgba(150,130,100,0.025)">
            <animate attributeName="rx" values="30;38;30" dur="8s" repeatCount="indefinite" />
          </ellipse>

          {/* Stone wall along road — low fieldstone */}
          <path d="M250 365 L260 363 L275 364 L288 362 L300 365 L312 363 L325 365"
            fill="none" stroke="rgba(100,90,75,0.15)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M480 365 L495 363 L510 365 L525 362 L540 364 L555 365"
            fill="none" stroke="rgba(100,90,75,0.12)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Italian cypress trees (tall, narrow) — approaching Italy */}
          {[220,340,480,580,700].map((x, i) => {
            const h = 35 + (i%3) * 10;
            const baseY = 332 - i * 2;
            return <g key={`cyp${i}`} opacity={0.35 + i * 0.04}>
              <line x1={x} y1={baseY} x2={x} y2={baseY - h} stroke="#10201A" strokeWidth="1.5" />
              <ellipse cx={x} cy={baseY - h * 0.5} rx="3" ry={h * 0.45} fill="#10201A" />
            </g>;
          })}

          {/* Wildflowers near road — hints of Italian spring */}
          {[280,330,370,440,470,520].map((x, i) => (
            <circle key={`wf${i}`} cx={x + (i%2 ? 15 : -10)} cy={378 + i * 2} r={1}
              fill={i % 3 === 0 ? 'rgba(200,80,80,0.12)' : i % 3 === 1 ? 'rgba(200,180,60,0.1)' : 'rgba(120,80,180,0.1)'} />
          ))}

          {/* Soaring birds — eagles circling above mountains */}
          {[180,420,620].map((x, i) => (
            <g key={`bird${i}`}>
              <path d={`M${x-4} ${120+i*15} Q${x-2} ${117+i*15} ${x} ${119+i*15} Q${x+2} ${117+i*15} ${x+4} ${120+i*15}`}
                fill="none" stroke="rgba(40,50,60,0.2)" strokeWidth="0.8" />
              <animateTransform attributeName="transform" type="translate"
                values={`0,0;${10+i*5},${-3+i};${-5+i*3},${2};0,0`}
                dur={`${8+i*3}s`} repeatCount="indefinite" />
            </g>
          ))}

          {/* Cloud wisps */}
          <ellipse cx="200" cy="80" rx="100" ry="15" fill="rgba(150,160,180,0.03)" />
          <ellipse cx="550" cy="60" rx="80" ry="12" fill="rgba(150,160,180,0.025)" />
          <ellipse cx="700" cy="100" rx="60" ry="10" fill="rgba(150,160,180,0.02)" />
          {/* Distant haze — Italy below */}
          <path d="M0 290 Q200 280 400 285 Q600 280 800 290" fill="none"
            stroke="rgba(160,170,200,0.04)" strokeWidth="8">
            <animate attributeName="d" values="M0 290 Q200 280 400 285 Q600 280 800 290;M0 292 Q200 278 400 283 Q600 282 800 292;M0 290 Q200 280 400 285 Q600 280 800 290"
              dur="12s" repeatCount="indefinite" />
          </path>
        </>}

        {/* Interior scene */}
        {mood === 'interior' && <>
          {/* Wooden walls with grain */}
          <rect x="0" y="0" width="800" height="500" fill="#1A1510" />
          {[0, 100, 200, 300, 400, 500, 600, 700].map((x) => (
            <line key={`w${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#15120E" strokeWidth="1" opacity="0.4" />
          ))}
          {/* Horizontal wood grain lines */}
          {[120, 190, 250, 320].map((y, i) => (
            <line key={`wg${i}`} x1="0" y1={y} x2="800" y2={y + (i%2 ? 2 : -1)} stroke="#18140F" strokeWidth="0.5" opacity="0.3" />
          ))}

          {/* Wooden beam ceiling */}
          <rect x="0" y="0" width="800" height="80" fill="#15120E" />
          <line x1="0" y1="80" x2="800" y2="80" stroke="#201A12" strokeWidth="3" />
          <line x1="0" y1="78" x2="800" y2="78" stroke="#2A2218" strokeWidth="1" />
          {/* Ceiling beam crosspieces */}
          {[200, 400, 600].map((x) => (
            <rect key={`cb${x}`} x={x-4} y="0" width="8" height="82" fill="#18140E" stroke="#201A12" strokeWidth="0.5" />
          ))}

          {/* Lantern glow — warm, centered */}
          <radialGradient id="vn_lantern" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255,200,100,0.1)" />
            <stop offset="50%" stopColor="rgba(255,180,80,0.04)" />
            <stop offset="100%" stopColor="rgba(255,200,100,0)" />
          </radialGradient>
          <rect x="0" y="0" width="800" height="500" fill="url(#vn_lantern)" />

          {/* Hanging lantern fixture */}
          <line x1="400" y1="80" x2="400" y2="110" stroke="#3A3020" strokeWidth="1.5" />
          <rect x="390" y="110" width="20" height="25" rx="3" fill="#2A2015" stroke="#3A3020" strokeWidth="0.5" />
          <rect x="393" y="113" width="14" height="18" rx="2" fill="rgba(255,180,80,0.15)" />
          <circle cx="400" cy="122" r="4" fill="rgba(255,180,80,0.25)">
            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Window — small, shuttered, faint light */}
          <rect x="620" y="140" width="80" height="100" rx="2" fill="#0E0C08" stroke="#252015" strokeWidth="2" />
          <line x1="660" y1="140" x2="660" y2="240" stroke="#252015" strokeWidth="1.5" />
          <line x1="620" y1="190" x2="700" y2="190" stroke="#252015" strokeWidth="1.5" />
          {/* Faint moonlight through gaps */}
          <rect x="622" y="142" width="36" height="46" fill="rgba(100,120,160,0.03)" />
          <rect x="662" y="142" width="36" height="46" fill="rgba(100,120,160,0.03)" />

          {/* Map on wall */}
          <rect x="120" y="130" width="80" height="60" rx="1" fill="#2A2518" stroke="#3A3020" strokeWidth="0.8" />
          <rect x="125" y="135" width="70" height="50" fill="#252018" />
          {/* Map lines */}
          <path d="M135 155 Q150 148 165 155 Q175 160 185 152" fill="none" stroke="rgba(150,130,80,0.15)" strokeWidth="0.5" />
          <path d="M130 165 L190 165" fill="none" stroke="rgba(150,130,80,0.1)" strokeWidth="0.3" />
          <circle cx="160" cy="158" r="2" fill="rgba(180,50,30,0.15)" />

          {/* Floor boards */}
          <rect x="0" y="400" width="800" height="100" fill="#15120A" />
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
            <line key={`f${x}`} x1={x} y1="400" x2={x} y2="500" stroke="#1A1510" strokeWidth="0.5" opacity="0.5" />
          ))}
          {/* Floor board horizontal grain */}
          {[420, 445, 470].map((y, i) => (
            <line key={`fg${i}`} x1="0" y1={y} x2="800" y2={y} stroke="#18140E" strokeWidth="0.3" opacity="0.2" />
          ))}

          {/* Muskets leaning against wall */}
          <line x1="80" y1="400" x2="70" y2="250" stroke="#2A2218" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="400" x2="82" y2="255" stroke="#2A2218" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="400" x2="94" y2="260" stroke="#2A2218" strokeWidth="3" strokeLinecap="round" />
          {/* Bayonets */}
          <line x1="70" y1="250" x2="68" y2="235" stroke="#5A5A5A" strokeWidth="1" />
          <line x1="82" y1="255" x2="80" y2="240" stroke="#5A5A5A" strokeWidth="1" />
          <line x1="94" y1="260" x2="92" y2="245" stroke="#5A5A5A" strokeWidth="1" />

          {/* Barrel in corner */}
          <ellipse cx="720" cy="380" rx="25" ry="10" fill="#2A2015" />
          <rect x="695" y="380" width="50" height="40" rx="3" fill="#2A2015" stroke="#352A1A" strokeWidth="0.5" />
          <ellipse cx="720" cy="420" rx="25" ry="10" fill="#2A2015" stroke="#352A1A" strokeWidth="0.5" />
          {/* Barrel bands */}
          <line x1="695" y1="393" x2="745" y2="393" stroke="#3A3020" strokeWidth="1" />
          <line x1="695" y1="407" x2="745" y2="407" stroke="#3A3020" strokeWidth="1" />

          {/* Stool */}
          <rect x="570" y="390" width="30" height="5" rx="1" fill="#2A2015" />
          <line x1="575" y1="395" x2="573" y2="420" stroke="#2A2015" strokeWidth="2" />
          <line x1="595" y1="395" x2="597" y2="420" stroke="#2A2015" strokeWidth="2" />

          {/* Corner shadows — vignette effect */}
          <rect x="0" y="0" width="150" height="500" fill="rgba(0,0,0,0.08)" />
          <rect x="650" y="0" width="150" height="500" fill="rgba(0,0,0,0.08)" />

          {/* Wall stain marks / damp patches */}
          <ellipse cx="350" cy="200" rx="25" ry="35" fill="rgba(15,12,8,0.08)" />
          <ellipse cx="520" cy="280" rx="18" ry="25" fill="rgba(15,12,8,0.06)" />

          {/* Small table — wooden surface */}
          <rect x="350" y="360" width="100" height="5" rx="1" fill="#2A2218" stroke="#352A1A" strokeWidth="0.5" />
          {/* Table legs */}
          <line x1="360" y1="365" x2="355" y2="400" stroke="#2A2218" strokeWidth="2.5" />
          <line x1="440" y1="365" x2="445" y2="400" stroke="#2A2218" strokeWidth="2.5" />
          {/* Items on table — tin cup, candle */}
          <rect x="385" y="352" width="8" height="8" rx="1" fill="#3A3025" />
          <ellipse cx="389" cy="352" rx="5" ry="2" fill="#3A3025" />
          <line x1="420" y1="360" x2="420" y2="345" stroke="#C0B080" strokeWidth="2" />
          <circle cx="420" cy="343" r="2" fill="rgba(255,200,100,0.2)">
            <animate attributeName="opacity" values="0.2;0.3;0.2" dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Wall sconce — oil lamp on bracket */}
          <g opacity="0.8">
            <line x1="250" y1="190" x2="250" y2="185" stroke="#3A3020" strokeWidth="1.5" />
            <rect x="244" y="185" width="12" height="3" rx="1" fill="#3A3020" />
            <path d="M246 185 L248 175 L252 175 L254 185" fill="rgba(255,180,80,0.12)" />
            <circle cx="250" cy="177" r="2" fill="rgba(255,180,80,0.2)">
              <animate attributeName="opacity" values="0.2;0.3;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* Sconce light cone on wall */}
            <path d="M250 175 L220 140 L280 140 Z" fill="rgba(255,180,80,0.015)" />
          </g>

          {/* Dust motes in lantern light */}
          {[1,2,3,4,5,6].map((i) => (
            <circle key={`dm${i}`} cx={350 + i*20} cy={150 + i*30} r="0.8" fill="rgba(255,200,100,0.06)">
              <animate attributeName="cy" values={`${150+i*30};${140+i*30};${150+i*30}`}
                dur={`${4+i}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Rat silhouette near floor — scurrying in the dark */}
          <g opacity="0.1">
            <ellipse cx="50" cy="410" rx="5" ry="2.5" fill="#0A0808" />
            <circle cx="44" cy="408" r="1.5" fill="#0A0808" />
            <path d="M55 410 Q65 407 75 410" fill="none" stroke="#0A0808" strokeWidth="0.5" />
          </g>

          {/* Cobweb in corner */}
          <path d="M0 82 Q20 90 40 82" fill="none" stroke="rgba(200,200,200,0.03)" strokeWidth="0.3" />
          <path d="M0 82 Q15 100 20 120" fill="none" stroke="rgba(200,200,200,0.025)" strokeWidth="0.3" />
          <path d="M0 82 Q25 95 40 82 Q30 100 20 120" fill="rgba(200,200,200,0.008)" />
        </>}

        {/* Ridge scene — Alpine mountain pass */}
        {mood === 'ridge' && <>
          {/* Star field — more stars for altitude */}
          {[50,150,250,350,450,550,650,750,100,300,500,700,40,180,320,480,620,760].map((x, i) => (
            <circle key={`rs${i}`} cx={x} cy={15+i*4} r={i % 6 === 0 ? 1.2 : 0.7} fill="white" opacity={0.15 + (i%4)*0.1}>
              {i % 5 === 0 && <animate attributeName="opacity" values={`${0.15+(i%4)*0.1};${0.4+(i%3)*0.1};${0.15+(i%4)*0.1}`}
                dur={`${3+i%3}s`} repeatCount="indefinite" />}
            </circle>
          ))}

          {/* Distant snow-capped peaks */}
          <path d="M0 180 L80 100 L160 150 L250 80 L350 130 L450 70 L550 120 L650 90 L750 110 L800 140 L800 500 L0 500 Z"
            fill="#0A1020" opacity="0.95" />
          {/* Snow caps */}
          <path d="M240 85 L250 80 L260 88" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M440 75 L450 70 L460 78" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M640 95 L650 90 L660 97" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Mid-range ridges */}
          <path d="M0 280 L100 240 L250 270 L350 230 L500 260 L650 240 L800 270 L800 500 L0 500 Z"
            fill="#121E2E" opacity="0.85" />

          {/* Near ridge with tree silhouettes */}
          <path d="M0 340 L80 310 L200 330 L320 300 L480 325 L600 305 L720 320 L800 310 L800 500 L0 500 Z"
            fill="#1A2838" />

          {/* Pine tree silhouettes on ridgeline */}
          {[60,130,180,260,340,380,500,560,620,700,760].map((x, i) => {
            const h = 18 + (i % 3) * 8;
            const baseY = 308 + (x < 300 ? (x/300)*30 : x > 500 ? ((800-x)/300)*15 : 15);
            return <path key={`tree${i}`} d={`M${x} ${baseY} L${x-4-i%2*2} ${baseY} L${x} ${baseY-h} L${x+4+i%2*2} ${baseY} Z`}
              fill="#0A1520" opacity={0.7 + (i%3)*0.1} />;
          })}

          {/* Ground plateau with texture */}
          <rect x="0" y="360" width="800" height="140" fill="#1A2535" />
          {/* Rocky ground texture */}
          {[40,120,220,350,480,580,700].map((x, i) => (
            <ellipse key={`rg${i}`} cx={x} cy={375+i*3} rx={15+i*3} ry={3+i} fill="rgba(30,40,55,0.4)" />
          ))}

          {/* Wind lines — more visible */}
          {[1,2,3,4,5].map((i) => (
            <line key={`wl${i}`} x1={80*i} y1={180+i*25} x2={80*i+60+i*10} y2={175+i*25}
              stroke="rgba(200,220,255,0.04)" strokeWidth="0.8" strokeLinecap="round">
              <animate attributeName="x1" values={`${80*i};${80*i+20};${80*i}`} dur={`${4+i}s`} repeatCount="indefinite" />
            </line>
          ))}

          {/* Moon — crescent with detail */}
          <circle cx="680" cy="60" r="30" fill="rgba(180,200,230,0.03)" />
          <circle cx="680" cy="60" r="18" fill="rgba(200,215,240,0.06)" />
          <circle cx="680" cy="60" r="10" fill="rgba(220,230,245,0.1)" />
          <circle cx="684" cy="57" r="9" fill="#060A14" />{/* Crescent mask */}
          {/* Moon surface hints */}
          <circle cx="676" cy="62" r="1.5" fill="rgba(200,215,240,0.04)" />
          <circle cx="679" cy="55" r="1" fill="rgba(200,215,240,0.03)" />

          {/* Moonbeam rays — diagonal shafts of light */}
          <line x1="680" y1="75" x2="600" y2="350" stroke="rgba(180,200,230,0.015)" strokeWidth="30" />
          <line x1="680" y1="75" x2="500" y2="400" stroke="rgba(180,200,230,0.012)" strokeWidth="25" />
          <line x1="680" y1="75" x2="720" y2="380" stroke="rgba(180,200,230,0.01)" strokeWidth="20" />

          {/* Valley mist between ridges */}
          <ellipse cx="200" cy="275" rx="120" ry="15" fill="rgba(150,170,200,0.04)">
            <animate attributeName="rx" values="120;130;120" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="500" cy="265" rx="100" ry="12" fill="rgba(150,170,200,0.035)">
            <animate attributeName="rx" values="100;115;100" dur="10s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="700" cy="270" rx="80" ry="10" fill="rgba(150,170,200,0.03)">
            <animate attributeName="rx" values="80;90;80" dur="7s" repeatCount="indefinite" />
          </ellipse>

          {/* Falling snow — gentle flakes */}
          {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => {
            const sx = 40 + i * 62 + (i % 3) * 15;
            const sy = -10 - i * 8;
            const drift = (i % 2 ? 1 : -1) * (15 + i * 3);
            const dur = 8 + i * 1.2;
            const r = 0.6 + (i % 4) * 0.3;
            return (
              <circle key={`snow${i}`} cx={sx} cy={sy} r={r} fill="rgba(220,230,245,0.15)">
                <animate attributeName="cy" values={`${sy};${500}`} dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${sx};${sx+drift};${sx+drift*0.3}`} dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.2;0.15;0" dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Frost patches on ground */}
          {[80,200,350,500,650].map((x, i) => (
            <ellipse key={`frost${i}`} cx={x} cy={370+i*4} rx={20+i*5} ry={2+i}
              fill="rgba(200,220,240,0.03)" />
          ))}

          {/* Path/trail on ground */}
          <path d="M350 500 L370 400 L380 380 L400 370 L430 375 L500 500" fill="rgba(25,35,50,0.3)" />
          {/* Footprints on path */}
          {[380,390,400,410,420].map((x, i) => (
            <ellipse key={`fp${i}`} cx={x + (i%2)*3} cy={385+i*4} rx="2" ry="1"
              fill="rgba(15,25,40,0.2)" transform={`rotate(${10-i*5} ${x} ${385+i*4})`} />
          ))}
        </>}

        {/* Gorge scene — narrow ravine with cliff walls */}
        {mood === 'gorge' && <>
          {/* Narrow sky strip visible between cliffs */}
          <rect x="150" y="0" width="500" height="150" fill="rgba(15,20,35,0.3)" />

          {/* Left cliff wall — jagged, textured */}
          <path d="M0 0 L0 500 L120 500 L100 420 L130 350 L90 280 L140 220 L80 160 L120 100 L70 50 L50 0 Z"
            fill="#0E0E18" />
          {/* Left cliff texture — cracks and ledges */}
          <line x1="30" y1="80" x2="90" y2="120" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          <line x1="20" y1="180" x2="100" y2="200" stroke="rgba(25,25,40,0.5)" strokeWidth="0.8" />
          <line x1="40" y1="300" x2="110" y2="320" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          <line x1="10" y1="380" x2="80" y2="400" stroke="rgba(25,25,40,0.5)" strokeWidth="0.8" />
          {/* Left cliff moss patches */}
          <ellipse cx="60" cy="250" rx="15" ry="8" fill="rgba(30,50,30,0.15)" />
          <ellipse cx="40" cy="350" rx="10" ry="5" fill="rgba(30,50,30,0.12)" />

          {/* Right cliff wall — jagged, textured */}
          <path d="M800 0 L800 500 L680 500 L700 420 L670 340 L710 270 L660 200 L720 140 L680 80 L730 30 L750 0 Z"
            fill="#0E0E18" />
          {/* Right cliff texture */}
          <line x1="770" y1="100" x2="710" y2="130" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          <line x1="780" y1="220" x2="700" y2="240" stroke="rgba(25,25,40,0.5)" strokeWidth="0.8" />
          <line x1="760" y1="340" x2="690" y2="360" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          {/* Right cliff moss */}
          <ellipse cx="730" cy="280" rx="12" ry="6" fill="rgba(30,50,30,0.12)" />

          {/* Overhanging rock shelves */}
          <path d="M120 180 L180 175 L170 185 L120 185 Z" fill="#0A0A15" opacity="0.6" />
          <path d="M680 250 L620 245 L630 258 L680 258 Z" fill="#0A0A15" opacity="0.6" />

          {/* Gorge floor — uneven terrain */}
          <path d="M0 380 L120 375 L200 385 L350 378 L500 382 L650 376 L680 380 L800 378 L800 500 L0 500 Z"
            fill="#08080E" />

          {/* Scattered rocks on floor */}
          {[150,220,310,400,490,560,640].map((x, i) => (
            <ellipse key={`rk${i}`} cx={x} cy={388+i*2+(i%2)*5} rx={8+i*2} ry={4+i} fill={`rgba(${25+i*3},${25+i*2},${35+i*2},0.4)`} />
          ))}

          {/* Fallen boulders */}
          <ellipse cx="280" cy="395" rx="20" ry="10" fill="rgba(30,30,40,0.5)" />
          <ellipse cx="520" cy="390" rx="15" ry="8" fill="rgba(35,35,45,0.4)" />

          {/* Water/stream — more visible with animation */}
          <path d="M250 480 Q300 468 350 473 Q400 480 450 470 Q500 465 550 472 Q600 478 650 468"
            fill="none" stroke="rgba(100,120,180,0.12)" strokeWidth="3" strokeLinecap="round">
            <animate attributeName="d"
              values="M250 480 Q300 468 350 473 Q400 480 450 470 Q500 465 550 472 Q600 478 650 468;M250 478 Q300 470 350 475 Q400 478 450 468 Q500 467 550 474 Q600 476 650 470;M250 480 Q300 468 350 473 Q400 480 450 470 Q500 465 550 472 Q600 478 650 468"
              dur="4s" repeatCount="indefinite" />
          </path>
          {/* Water shimmer highlights */}
          {[300,380,450,530].map((x, i) => (
            <circle key={`ws${i}`} cx={x} cy={472+i*2} r="1" fill="rgba(150,170,220,0.08)">
              <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2+i*0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Muzzle flash / smoke from above (suggesting Grenzer fire) */}
          <circle cx="160" cy="150" r="4" fill="rgba(255,200,100,0.04)">
            <animate attributeName="opacity" values="0.04;0.12;0.04" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="120" r="3" fill="rgba(255,200,100,0.03)">
            <animate attributeName="opacity" values="0.03;0.1;0.03" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Smoke wisps drifting through gorge */}
          {[1,2,3].map((i) => {
            const startX = 200 + i * 120;
            const y = 340 + i * 15;
            return (
              <ellipse key={`smk${i}`} cx={startX} cy={y} rx={30+i*10} ry={5+i*2}
                fill="rgba(100,110,140,0.03)">
                <animate attributeName="cx" values={`${startX};${startX+40};${startX}`}
                  dur={`${6+i*2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.03;0.06;0.03"
                  dur={`${6+i*2}s`} repeatCount="indefinite" />
              </ellipse>
            );
          })}

          {/* Water drips from cliff walls */}
          {[1,2,3,4].map((i) => {
            const x = i <= 2 ? 100 + i * 20 : 680 + (i-2) * 15;
            const startY = 150 + i * 50;
            return (
              <circle key={`drip${i}`} cx={x} cy={startY} r="0.8"
                fill="rgba(130,150,200,0.15)">
                <animate attributeName="cy" values={`${startY};${startY+80}`}
                  dur={`${2+i*0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.08;0"
                  dur={`${2+i*0.5}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Light shaft from narrow sky */}
          <polygon points="350,0 450,0 500,380 300,380"
            fill="rgba(180,200,230,0.01)" />
          <polygon points="370,0 430,0 460,380 340,380"
            fill="rgba(180,200,230,0.008)" />

          {/* Mineral veins on cliff walls */}
          <path d="M40 120 Q55 140 45 170 Q60 190 50 220"
            fill="none" stroke="rgba(60,50,40,0.15)" strokeWidth="0.5" />
          <path d="M760 160 Q745 185 755 210 Q740 235 750 260"
            fill="none" stroke="rgba(60,50,40,0.12)" strokeWidth="0.5" />

          {/* Fog layers — multi-depth */}
          <ellipse cx="400" cy="365" rx="200" ry="10" fill="rgba(100,110,140,0.04)">
            <animate attributeName="rx" values="200;220;200" dur="9s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="350" cy="375" rx="150" ry="8" fill="rgba(100,110,140,0.03)">
            <animate attributeName="rx" values="150;170;150" dur="7s" repeatCount="indefinite" />
          </ellipse>
        </>}
      </svg>
    </div>
  );
}

/* ================================================================== */
/*  TYPEWRITER HOOK                                                    */
/* ================================================================== */

function useTypewriter(text: string, speed: number): { displayed: string; done: boolean; skip: () => void } {
  const [index, setIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
    setSkipped(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [text]);

  useEffect(() => {
    if (skipped || index >= text.length) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= text.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return text.length;
        }
        return prev + 1;
      });
    }, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, speed, skipped, index]);

  const skip = useCallback(() => {
    setSkipped(true);
    setIndex(text.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [text.length]);

  return { displayed: skipped ? text : text.slice(0, index + 1), done: index >= text.length - 1 || skipped, skip };
}

/* ================================================================== */
/*  RICH TEXT PARSER — inline markup for expressive dialogue            */
/* ================================================================== */

/**
 * Parses inline markup in displayed text and returns React elements.
 * Supports: **bold**, *italic*, ~whisper~ (dimmed small text), _emphasis_
 * The raw text is typed character-by-character, then this function
 * converts the *displayed* substring into styled spans.
 */
function parseRichText(raw: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Pattern matches **bold**, *italic*, ~whisper~, or _underline emphasis_
  // Process in order: bold first (** before *), then *, ~, _
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|~(.+?)~|_(.+?)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(raw)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      parts.push(raw.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(<strong key={key++} className="vn-rich-bold">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={key++} className="vn-rich-italic">{match[3]}</em>);
    } else if (match[4]) {
      // ~whisper~
      parts.push(<span key={key++} className="vn-rich-whisper">{match[4]}</span>);
    } else if (match[5]) {
      // _emphasis_
      parts.push(<span key={key++} className="vn-rich-emphasis">{match[5]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < raw.length) {
    parts.push(raw.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [raw];
}

/* ================================================================== */
/*  VN RENDERER — the core visual novel display                        */
/* ================================================================== */

type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';
const SPEED_VALUES: Record<TextSpeed, number> = { slow: 45, normal: 28, fast: 12, instant: 0 };

function VNRenderer({ scene, onEnd, onReplay }: { scene: VNScene; onEnd: () => void; onReplay?: () => void }) {
  const [currentNodeId, setCurrentNodeId] = useState(scene.startNode);
  const [positions, setPositions] = useState<Record<string, CharPosition>>({});
  const [mood, setMood] = useState<SceneMood>(scene.mood);
  const [history, setHistory] = useState<string[]>([]);
  const [choicesMade, setChoicesMade] = useState<{ label: string; nodeId: string }[]>([]);
  const [effectClass, setEffectClass] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [textSpeed, setTextSpeed] = useState<TextSpeed>('normal');
  const [autoPlay, setAutoPlay] = useState(false);
  const [showKbHint, setShowKbHint] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [nodeTransition, setNodeTransition] = useState(false);
  const typeSpeed = SPEED_VALUES[textSpeed];

  const node = scene.nodes[currentNodeId];
  const speaker = node ? CHARACTERS[node.speaker] : null;
  const expression = node?.expression ?? speaker?.defaultExpression ?? 'neutral';
  const { displayed, done, skip } = useTypewriter(node?.text ?? '', typeSpeed);

  // Reset when scene changes
  useEffect(() => {
    setCurrentNodeId(scene.startNode);
    const startNode = scene.nodes[scene.startNode];
    setPositions(startNode?.positions ? { ...startNode.positions } as Record<string, CharPosition> : {});
    setMood(startNode?.mood ?? scene.mood);
    setHistory([]);
    setChoicesMade([]);
    setShowTitle(true);
  }, [scene.id]);

  // Auto-dismiss scene title card
  useEffect(() => {
    if (!showTitle) return;
    const timer = setTimeout(() => setShowTitle(false), 2500);
    return () => clearTimeout(timer);
  }, [showTitle]);

  // Apply position and mood changes on node advance
  useEffect(() => {
    if (node?.positions) {
      const newPos = node.positions as Record<string, CharPosition>;
      setPositions((prev) => ({ ...prev, ...newPos }));
    }
    if (node?.mood) {
      setMood(node.mood);
    }
    // Node transition animation
    setNodeTransition(true);
    const fadeTimer = setTimeout(() => setNodeTransition(false), 80);
    if (node?.effect) {
      setEffectClass(`vn-effect-${node.effect}`);
      const timer = setTimeout(() => setEffectClass(''), 600);
      return () => { clearTimeout(timer); clearTimeout(fadeTimer); };
    }
    return () => clearTimeout(fadeTimer);
  }, [currentNodeId]);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (showLog) {
      setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [showLog, history.length]);

  const advance = useCallback(() => {
    if (!done) { skip(); return; }
    if (!node) return;

    if (node.choices && node.choices.length > 0) return; // Handled by choice buttons

    // At the end — don't auto-exit, let the end card handle it
    if (node.next === null || node.next === undefined) return;

    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(node.next);
  }, [done, skip, node, currentNodeId]);

  // Auto-play: advance after typewriter finishes (stop at choices)
  const [autoPlayDelay, setAutoPlayDelay] = useState(0);
  useEffect(() => {
    if (!autoPlay || !done) {
      setAutoPlayDelay(0);
      return;
    }
    if (node?.choices && node.choices.length > 0) {
      setAutoPlay(false);
      setAutoPlayDelay(0);
      return;
    }
    const delay = Math.max(800, node?.text.length ? node.text.length * 15 : 1500);
    setAutoPlayDelay(delay);
    const timer = setTimeout(advance, delay);
    return () => { clearTimeout(timer); setAutoPlayDelay(0); };
  }, [autoPlay, done, node, advance]);

  const chooseOption = useCallback((nextId: string) => {
    // Track the choice for the end card
    if (node?.choices) {
      const chosen = node.choices.find(c => c.nextId === nextId);
      if (chosen) {
        setChoicesMade((prev) => [...prev, { label: chosen.label, nodeId: nextId }]);
      }
    }
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  }, [currentNodeId, node]);

  const rewind = useCallback(() => {
    if (history.length === 0) return;
    const prevNodeId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentNodeId(prevNodeId);
  }, [history]);

  // Keyboard navigation: Space/Enter to advance, 1-4 for choices, L for log, Backspace to rewind
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        rewind();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      }
      if (e.key === 'l' || e.key === 'L') {
        setShowLog((prev) => !prev);
      }
      if (e.key === 'a' || e.key === 'A') {
        setAutoPlay((prev) => !prev);
      }
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug((prev) => !prev);
      }
      // Number keys for choices
      if (done && node?.choices && node.choices.length > 0) {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < node.choices.length) {
          chooseOption(node.choices[idx].nextId);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, chooseOption, rewind, done, node]);

  // Focus stage on mount for keyboard events
  useEffect(() => {
    stageRef.current?.focus();
  }, []);

  if (!node || !speaker) return null;

  const cssBg = MOOD_CSS_BG[mood];
  const isNarrator = node.speaker === 'narrator';

  return (
    <div ref={stageRef} className={`vn-stage ${effectClass}`} style={{ background: cssBg }} onClick={advance} tabIndex={-1}>
      {/* SVG atmospheric background */}
      <MoodBackground mood={mood} />
      {/* Color overlay */}
      <div className="vn-bg-overlay" />
      {/* Cinematic vignette */}
      <div className="vn-vignette" />

      {/* Ambient particles — mood-reactive floating elements */}
      <div className={`vn-ambient vn-ambient-${mood}`}>
        {mood === 'night_camp' && Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="vn-firefly" style={{
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${5 + i * 1.5}s`,
          }} />
        ))}
        {mood === 'ridge' && Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="vn-snowflake" style={{
            left: `${5 + i * 8}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + (i % 3) * 2}s`,
          }} />
        ))}
        {mood === 'battlefield' && Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="vn-ash" style={{
            left: `${10 + i * 18}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + i * 1.2}s`,
          }} />
        ))}
        {mood === 'gorge' && Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="vn-rock-mote" style={{
            left: `${i < 4 ? 5 + i * 5 : 75 + (i - 4) * 5}%`,
            animationDelay: `${i * 0.9}s`,
            animationDuration: `${3 + (i % 3) * 1.5}s`,
          }} />
        ))}
        {mood === 'dawn' && Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="vn-dust-mote" style={{
            left: `${20 + i * 18}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${7 + i * 1.5}s`,
          }} />
        ))}
      </div>

      {/* Scene title card — brief cinematic overlay */}
      {showTitle && (
        <div className="vn-title-card">
          <div className="vn-title-card-mood">{mood.replace('_', ' ')}</div>
          <div className="vn-title-card-name">{scene.title}</div>
          <div className="vn-title-card-desc">{scene.description}</div>
        </div>
      )}

      {/* Keyboard shortcut overlay — fades after 4s or on first click */}
      {showKbHint && (
        <div className="vn-kb-overlay" onAnimationEnd={() => setShowKbHint(false)}>
          <span className="vn-kb-overlay-title">Controls</span>
          <div className="vn-kb-overlay-row">
            <span className="vn-kb-overlay-key">Space</span> Advance
            <span className="vn-kb-overlay-key">Bksp</span> Rewind
          </div>
          <div className="vn-kb-overlay-row">
            <span className="vn-kb-overlay-key">L</span> Log
            <span className="vn-kb-overlay-key">A</span> Auto
            <span className="vn-kb-overlay-key">D</span> Debug
            <span className="vn-kb-overlay-key">1-4</span> Choose
          </div>
        </div>
      )}

      {/* Character portraits */}
      <div className="vn-portraits">
        {scene.cast.filter((id) => id !== 'player' && id !== 'narrator').map((charId) => {
          const char = CHARACTERS[charId];
          if (!char) return null;
          const pos = positions[charId] ?? 'off';
          const isSpeaking = node.speaker === charId;
          const expr = isSpeaking ? expression : char.defaultExpression;
          return (
            <CharacterPortrait
              key={charId}
              character={char}
              expression={expr}
              speaking={isSpeaking}
              position={pos}
            />
          );
        })}
      </div>

      {/* Dialogue box */}
      <div className="vn-dialogue-area">
        <div className={[
            'vn-dialogue-box',
            isNarrator && 'vn-narrator-box',
            nodeTransition && 'vn-node-fade',
            node.mode && `vn-mode-${node.mode}`,
          ].filter(Boolean).join(' ')}
          style={{ '--speaker-color': isNarrator ? 'rgba(255,200,100,0.15)' : speaker.color } as React.CSSProperties}>
          {/* Name plate with accent bar */}
          {!isNarrator && (
            <div className="vn-nameplate" style={{ '--speaker-color': speaker.color } as React.CSSProperties}>
              <span className="vn-nameplate-text">{speaker.name}</span>
              {speaker.rank && <span className="vn-nameplate-rank">{speaker.rank}</span>}
              {node.mode && node.mode !== 'speech' && (
                <span className={`vn-mode-badge vn-mode-badge-${node.mode}`}>
                  {node.mode === 'thought' ? 'thinking' : node.mode === 'shout' ? 'shouting' : 'whispering'}
                </span>
              )}
            </div>
          )}

          {/* Text — with rich text formatting */}
          <div className="vn-text">
            {parseRichText(displayed)}
            {!done && <span className="vn-cursor">|</span>}
          </div>

          {/* Continue triangle indicator */}
          {done && (!node.choices || node.choices.length === 0) && node.next !== null && (
            <div className="vn-continue-triangle" />
          )}

          {/* Choice buttons */}
          {done && node.choices && node.choices.length > 0 && (
            <div className="vn-choices" onClick={(e) => e.stopPropagation()}>
              {node.choices.map((choice, idx) => (
                <button
                  key={choice.nextId}
                  className="vn-choice-btn"
                  onClick={() => chooseOption(choice.nextId)}
                >
                  <span className="vn-choice-key">{idx + 1}</span>
                  <div className="vn-choice-content">
                    <span className="vn-choice-label">{choice.label}</span>
                    {choice.description && <span className="vn-choice-desc">{choice.description}</span>}
                    {choice.statCheck && <span className="vn-choice-check">[{choice.statCheck}]</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auto-play progress bar */}
        {autoPlayDelay > 0 && (
          <div className="vn-auto-progress" style={{ maxWidth: 800, width: '100%' }}>
            <div className="vn-auto-progress-fill"
              style={{ animationDuration: `${autoPlayDelay}ms` }} />
          </div>
        )}

        {/* End card — scene completion overlay */}
        {done && node.next === null && !node.choices && (
          <div className="vn-end-card" onClick={(e) => e.stopPropagation()}>
            <div className="vn-end-card-label">FIN</div>
            <div className="vn-end-card-title">{scene.title}</div>
            <div className="vn-end-card-stats">
              <span>{history.length + 1} nodes visited</span>
              <span>&middot;</span>
              <span>{scene.cast.length - 1} characters</span>
            </div>
            {choicesMade.length > 0 && (
              <div className="vn-end-card-choices">
                <div className="vn-end-card-choices-label">Your choices:</div>
                {choicesMade.map((c, i) => (
                  <div key={i} className="vn-end-card-choice">{c.label}</div>
                ))}
              </div>
            )}
            <div className="vn-end-card-actions">
              <button className="vn-end-replay" onClick={() => onReplay?.()}>Replay</button>
              <button className="vn-end-exit" onClick={() => onEnd?.()}>Exit</button>
            </div>
          </div>
        )}

        {/* Controls bar — integrated below dialogue */}
        <div className="vn-controls-bar" onClick={(e) => e.stopPropagation()}>
          <button className="vn-rewind-btn" onClick={rewind}
            disabled={history.length === 0} title="Go back (Backspace)">
            &larr;
          </button>
          <div className="vn-controls-divider" />
          <div className="vn-speed-controls">
            {([
              { key: 'slow' as const, icon: '\u25B7', label: 'Slow' },
              { key: 'normal' as const, icon: '\u25B6', label: 'Normal' },
              { key: 'fast' as const, icon: '\u25B6\u25B6', label: 'Fast' },
              { key: 'instant' as const, icon: '\u00BB', label: 'Instant' },
            ]).map(({ key, icon, label }) => (
              <button key={key} className={`vn-speed-btn${textSpeed === key ? ' active' : ''}`}
                onClick={() => setTextSpeed(key)}
                title={`${label} text speed`}>
                {icon}
              </button>
            ))}
          </div>
          <div className="vn-controls-divider" />
          <button className={`vn-auto-btn${autoPlay ? ' active' : ''}`}
            onClick={() => setAutoPlay(!autoPlay)} title="Auto-play (A)">
            {autoPlay ? 'Stop' : 'Auto'}
          </button>
          <button className={`vn-log-btn${showLog ? ' active' : ''}`}
            onClick={() => setShowLog(!showLog)} title="Dialogue log (L)">
            Log
          </button>
          <div className="vn-controls-divider" />
          <span className="vn-progress-counter" title={`Node ${history.length + 1} of ${Object.keys(scene.nodes).length}`}>
            {history.length + 1} / {Object.keys(scene.nodes).length}
          </span>
          <div className="vn-progress-track">
            <div className="vn-progress-fill" style={{ width: `${((history.length + 1) / Object.keys(scene.nodes).length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Dialogue history log */}
      {showLog && (
        <div className="vn-log-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="vn-log-header">
            <span>{scene.title} — Log</span>
            <button className="vn-log-close" onClick={() => setShowLog(false)}>&times;</button>
          </div>
          <div className="vn-log-entries">
            {history.map((nodeId, idx) => {
              const hNode = scene.nodes[nodeId];
              if (!hNode) return null;
              const hSpeaker = CHARACTERS[hNode.speaker];
              const isNar = hNode.speaker === 'narrator';
              return (
                <div key={nodeId} className={`vn-log-entry${isNar ? ' vn-log-narrator' : ''}`}
                  style={!isNar && hSpeaker ? { borderLeftColor: hSpeaker.color } : undefined}>
                  <div className="vn-log-entry-header">
                    {!isNar && <span className="vn-log-name" style={{ color: hSpeaker?.color }}>{hSpeaker?.name}</span>}
                    <span className="vn-log-num">{idx + 1}</span>
                  </div>
                  <span className="vn-log-text">{parseRichText(hNode.text)}</span>
                </div>
              );
            })}
            {/* Current node — highlighted */}
            {node && (() => {
              const cSpeaker = CHARACTERS[node.speaker];
              const cIsNar = node.speaker === 'narrator';
              return (
                <div className={`vn-log-entry vn-log-current${cIsNar ? ' vn-log-narrator' : ''}`}
                  style={!cIsNar && cSpeaker ? { borderLeftColor: cSpeaker.color } : undefined}>
                  <div className="vn-log-entry-header">
                    {!cIsNar && <span className="vn-log-name" style={{ color: cSpeaker?.color }}>{cSpeaker?.name}</span>}
                    <span className="vn-log-num">{history.length + 1}</span>
                  </div>
                  <span className="vn-log-text">{parseRichText(node.text)}</span>
                </div>
              );
            })()}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* Debug node inspector — toggle with D key */}
      {showDebug && (
        <div className="vn-debug-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="vn-debug-header">
            <span>Node Inspector</span>
            <button className="vn-debug-close" onClick={() => setShowDebug(false)}>&times;</button>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Node</span>
            <span className="vn-debug-value">{currentNodeId}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Speaker</span>
            <span className="vn-debug-value" style={{ color: speaker.color }}>{speaker.name || 'narrator'}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Expression</span>
            <span className="vn-debug-value">{expression}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Mood</span>
            <span className="vn-debug-value">{mood}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Next</span>
            <span className="vn-debug-value">{node.next === null ? '(END)' : node.next ?? '(choices)'}</span>
          </div>
          {node.choices && (
            <div className="vn-debug-row">
              <span className="vn-debug-label">Choices</span>
              <span className="vn-debug-value">{node.choices.map(c => c.nextId).join(', ')}</span>
            </div>
          )}
          {node.mode && (
            <div className="vn-debug-row">
              <span className="vn-debug-label">Mode</span>
              <span className="vn-debug-value">{node.mode}</span>
            </div>
          )}
          {node.effect && (
            <div className="vn-debug-row">
              <span className="vn-debug-label">Effect</span>
              <span className="vn-debug-value">{node.effect}</span>
            </div>
          )}
          <div className="vn-debug-row">
            <span className="vn-debug-label">History</span>
            <span className="vn-debug-value">{history.length} nodes</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  SCENE BROWSER                                                      */
/* ================================================================== */

const MOOD_ACCENT: Record<SceneMood, string> = {
  night_camp: '#FF9030',
  dawn: '#C08060',
  battlefield: '#8A7A60',
  march: '#6A8090',
  interior: '#C4A060',
  ridge: '#7090B0',
  gorge: '#606880',
};

/** Count total words across all nodes in a scene */
function sceneWordCount(scene: VNScene): number {
  return Object.values(scene.nodes).reduce((sum, n) => sum + n.text.split(/\s+/).length, 0);
}

/** Estimate read time (assuming ~200 wpm for VN pacing with typewriter) */
function readTimeEstimate(wordCount: number): string {
  const mins = Math.ceil(wordCount / 120); // slower for VN pacing
  return mins <= 1 ? '~1 min' : `~${mins} min`;
}

function SceneBrowser({ scenes, selectedId, onSelect }: {
  scenes: VNScene[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="vn-browser">
      {scenes.map((scene) => {
        const words = sceneWordCount(scene);
        return (
        <button
          key={scene.id}
          className={`vn-scene-card${selectedId === scene.id ? ' active' : ''}`}
          onClick={() => onSelect(scene.id)}
          style={{ borderLeftColor: MOOD_ACCENT[scene.mood], borderLeftWidth: 3 }}
        >
          <span className="vn-scene-mood" style={{ color: MOOD_ACCENT[scene.mood] }}>{scene.mood.replace(/_/g, ' ')}</span>
          <span className="vn-scene-title">{scene.title}</span>
          <span className="vn-scene-desc">{scene.description}</span>
          <div className="vn-scene-meta">
            <span>{scene.cast.length} characters</span>
            <span>{Object.keys(scene.nodes).length} nodes</span>
            <span>{words} words</span>
            <span>{readTimeEstimate(words)}</span>
          </div>
        </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  DIALOGUE TREE INSPECTOR — Recursive visual tree                    */
/* ================================================================== */

function DialogueTreeView({ scene }: { scene: VNScene }) {
  /* Build incoming-edges map so we can detect convergence points */
  const incomingEdges = useMemo(() => {
    const edges: Record<string, string[]> = {};
    for (const node of Object.values(scene.nodes)) {
      if (node.next) (edges[node.next] ??= []).push(node.id);
      if (node.choices) {
        for (const c of node.choices) (edges[c.nextId] ??= []).push(node.id);
      }
    }
    return edges;
  }, [scene]);

  /* Count total nodes for the stats bar */
  const nodeCount = Object.keys(scene.nodes).length;
  const choiceNodes = Object.values(scene.nodes).filter((n) => n.choices).length;
  const endNodes = Object.values(scene.nodes).filter((n) => n.next === null && !n.choices).length;

  /* Recursive renderer — walks from a node following next/choices */
  const rendered = useRef(new Set<string>());
  rendered.current.clear(); // reset on every render

  const renderNode = (nodeId: string, depth: number): React.ReactNode => {
    const node = scene.nodes[nodeId];
    if (!node) return null;

    /* If already rendered, show a back-reference instead of duplicating */
    if (rendered.current.has(nodeId)) {
      return (
        <div className="vn-tree-ref" key={`ref-${nodeId}-${depth}`}>
          <span className="vn-tree-ref-arrow">&crarr;</span>
          <span className="vn-tree-ref-id">{nodeId}</span>
          <span className="vn-tree-ref-label">(continues above)</span>
        </div>
      );
    }
    rendered.current.add(nodeId);

    const speaker = CHARACTERS[node.speaker];
    const isNarrator = node.speaker === 'narrator';
    const hasChoices = !!node.choices;
    const isEnd = node.next === null && !hasChoices;
    const convergent = (incomingEdges[nodeId]?.length ?? 0) > 1;
    const speakerColor = !isNarrator && speaker ? speaker.color : undefined;

    return (
      <div className="vn-tree-group" key={nodeId}>
        {/* The node card */}
        <div
          className={[
            'vn-tree-node',
            hasChoices && 'vn-tree-branch',
            isEnd && 'vn-tree-terminal',
            convergent && 'vn-tree-convergent',
            isNarrator && 'vn-tree-narrator',
          ].filter(Boolean).join(' ')}
          style={speakerColor ? { borderLeftColor: speakerColor } as React.CSSProperties : undefined}
        >
          <div className="vn-tree-node-header">
            <span className="vn-tree-node-id">{node.id}</span>
            <span className="vn-tree-node-speaker" style={{ color: isNarrator ? 'var(--text-dim)' : speaker?.color }}>
              {isNarrator ? 'Narrator' : speaker?.name}
            </span>
            {node.expression && <span className="vn-tree-node-expr">{node.expression}</span>}
            {node.effect && <span className="vn-tree-node-effect">{node.effect}</span>}
            {convergent && <span className="vn-tree-converge-badge">&lArr; merge</span>}
          </div>
          <p className="vn-tree-node-text">{parseRichText(node.text.slice(0, 140))}{node.text.length > 140 ? '\u2026' : ''}</p>

          {/* Choice tags inline */}
          {hasChoices && (
            <div className="vn-tree-node-choices">
              {node.choices!.map((c, ci) => (
                <span key={c.nextId} className="vn-tree-choice-tag">
                  <span className="vn-tree-choice-num">{ci + 1}</span>
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {isEnd && <span className="vn-tree-end">END</span>}
        </div>

        {/* Connection line to next */}
        {!hasChoices && node.next && <div className="vn-tree-connector" />}

        {/* Fork into branches */}
        {hasChoices && (
          <div className="vn-tree-branches">
            {node.choices!.map((c, ci) => (
              <div key={c.nextId} className="vn-tree-branch-group">
                <div className="vn-tree-branch-header">
                  <span className="vn-tree-branch-num">{ci + 1}</span>
                  <span className="vn-tree-branch-label">{c.label}</span>
                  {c.statCheck && <span className="vn-tree-branch-check">{c.statCheck}</span>}
                </div>
                <div className="vn-tree-branch-content">
                  {renderNode(c.nextId, depth + 1)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Linear continuation */}
        {!hasChoices && node.next && renderNode(node.next, depth)}
      </div>
    );
  };

  return (
    <div className="vn-tree">
      <div className="vn-tree-stats">
        <h3 className="cl-section-title">Dialogue Tree: {scene.title}</h3>
        <div className="vn-tree-stats-tags">
          <span className="vn-tree-stat">{nodeCount} nodes</span>
          <span className="vn-tree-stat vn-tree-stat-choice">{choiceNodes} choice{choiceNodes !== 1 ? 's' : ''}</span>
          <span className="vn-tree-stat vn-tree-stat-end">{endNodes} ending{endNodes !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="vn-tree-nodes">
        {renderNode(scene.startNode, 0)}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DATA FORMAT REFERENCE                                              */
/* ================================================================== */

function DataFormatView() {
  return (
    <div className="vn-format">
      <h3 className="cl-section-title">VN Data Format Reference</h3>
      <div className="vn-format-sections">
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">VNScene</h4>
          <pre className="vn-format-code">{`{
  id: string,
  title: string,
  description: string,
  mood: SceneMood,
  cast: string[],      // character IDs
  startNode: string,
  nodes: Record<string, DialogueNode>
}`}</pre>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">DialogueNode</h4>
          <pre className="vn-format-code">{`{
  id: string,
  speaker: string,     // character ID
  expression?: Expression,
  text: string,
  mode?: DeliveryMode, // speech|thought|shout|whisper
  positions?: { [charId]: Position },
  mood?: SceneMood,    // override scene mood
  next?: string | null, // null = end
  choices?: VNChoice[],
  sfx?: string,
  effect?: 'shake' | 'flash' | 'fade'
}`}</pre>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">VNChoice</h4>
          <pre className="vn-format-code">{`{
  label: string,
  description?: string,
  nextId: string,
  condition?: string,  // gate description
  statCheck?: string   // e.g. "Valor 50+"
}`}</pre>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Expressions</h4>
          <div className="vn-expr-grid">
            {(Object.keys(EXPRESSION_COLORS) as Expression[]).map((expr) => (
              <span key={expr} className="vn-expr-tag" style={{ color: EXPRESSION_COLORS[expr] }}>{expr}</span>
            ))}
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Scene Moods</h4>
          <div className="vn-mood-grid">
            {(Object.keys(MOOD_CSS_BG) as SceneMood[]).map((m) => (
              <div key={m} className="vn-mood-swatch">
                <div className="vn-mood-swatch-color" style={{ background: MOOD_CSS_BG[m] }} />
                <span>{m.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Rich Text Markup</h4>
          <div className="vn-richtext-ref">
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">*text*</code>
              <span className="vn-rich-italic">italic</span>
              <span className="vn-richtext-usage">Emphasis, inner thoughts</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">**text**</code>
              <strong className="vn-rich-bold">bold</strong>
              <span className="vn-richtext-usage">Commands, strong emotion</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">~text~</code>
              <span className="vn-rich-whisper">whisper</span>
              <span className="vn-richtext-usage">Quiet speech, asides</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">_text_</code>
              <span className="vn-rich-emphasis">emphasis</span>
              <span className="vn-richtext-usage">Key words, gold highlight</span>
            </div>
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Delivery Modes</h4>
          <div className="vn-delivery-ref">
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">speech</code>
              <span style={{ color: 'var(--text-primary)' }}>Default</span>
              <span className="vn-richtext-usage">Normal spoken dialogue (default if omitted)</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">thought</code>
              <span style={{ color: '#8B9DC3', fontStyle: 'italic' }}>Inner voice</span>
              <span className="vn-richtext-usage">Internal monologue, dotted border</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">shout</code>
              <span style={{ color: '#C45544', fontWeight: 700 }}>Loud</span>
              <span className="vn-richtext-usage">Shouted commands, red glow, screen shake</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">whisper</code>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>Quiet</span>
              <span className="vn-richtext-usage">Hushed speech, faded, smaller text</span>
            </div>
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Characters</h4>
          <div className="vn-char-list">
            {Object.values(CHARACTERS).filter((c) => c.id !== 'narrator').map((char) => (
              <div key={char.id} className="vn-char-item">
                <span className="vn-char-name" style={{ color: char.color }}>{char.name}</span>
                <span className="vn-char-id">{char.id}</span>
                {char.rank && <span className="vn-char-rank">{char.rank}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

type VNTab = 'play' | 'tree' | 'format';

export function VisualNovelLabPage() {
  const [tab, setTab] = useState<VNTab>('play');
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const selectedScene = useMemo(
    () => SCENES.find((s) => s.id === selectedSceneId) ?? null,
    [selectedSceneId],
  );

  const handlePlay = useCallback(() => {
    if (selectedScene) {
      setPlaying(true);
      setPlayKey((k) => k + 1);
    }
  }, [selectedScene]);

  const handleEnd = useCallback(() => {
    setPlaying(false);
  }, []);

  return (
    <div className="vn-page">
      <div className="art-lab-toolbar">
        {(['play', 'tree', 'format'] as VNTab[]).map((t) => (
          <button
            key={t}
            className={`art-lab-filter-btn${tab === t ? ' active' : ''}`}
            onClick={() => { setTab(t); setPlaying(false); }}
          >
            {t === 'play' ? 'Scene Player' : t === 'tree' ? 'Dialogue Tree' : 'Data Format'}
          </button>
        ))}
        {tab !== 'format' && selectedScene && (
          <>
            <span className="art-lab-toolbar-divider" />
            <span className="mg-game-title">{selectedScene.title}</span>
          </>
        )}
        {tab === 'play' && selectedScene && !playing && (
          <button className="art-lab-filter-btn active" onClick={handlePlay} style={{ marginLeft: 'auto' }}>
            Play Scene
          </button>
        )}
        {tab === 'play' && playing && (
          <button className="art-lab-filter-btn" onClick={() => setPlaying(false)} style={{ marginLeft: 'auto' }}>
            Exit Player
          </button>
        )}
        <span className="art-lab-count">{SCENES.length} scenes</span>
      </div>

      {/* Full-screen player mode */}
      {tab === 'play' && playing && selectedScene && (
        <VNRenderer key={playKey} scene={selectedScene} onEnd={handleEnd} onReplay={handlePlay} />
      )}

      {/* Browse mode */}
      {tab === 'play' && !playing && (
        <div className="vn-browse-layout">
          <SceneBrowser scenes={SCENES} selectedId={selectedSceneId} onSelect={setSelectedSceneId} />
          <div className="vn-scene-preview">
            {selectedScene ? (
              <>
                {/* Mini scene preview with mood background */}
                <div className="vn-scene-preview-thumb" style={{ background: MOOD_CSS_BG[selectedScene.mood] }}>
                  <MoodBackground mood={selectedScene.mood} />
                  <div className="vn-preview-cast">
                    {selectedScene.cast.filter((id) => id !== 'player' && id !== 'narrator').map((charId) => {
                      const char = CHARACTERS[charId];
                      if (!char) return null;
                      return (
                        <div key={charId} className="vn-preview-portrait">
                          <CharacterPortrait
                            character={char}
                            expression={char.defaultExpression}
                            speaking={false}
                            position="center"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <h2 className="npc-detail-name">{selectedScene.title}</h2>
                <p className="npc-detail-text">{selectedScene.description}</p>
                <div className="vn-scene-info">
                  <div className="lb-param"><span className="lb-param-label">Mood</span><span className="lb-param-val">{selectedScene.mood.replace(/_/g, ' ')}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Nodes</span><span className="lb-param-val">{Object.keys(selectedScene.nodes).length}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Cast</span><span className="lb-param-val">{selectedScene.cast.filter((c) => c !== 'player').map((c) => CHARACTERS[c]?.name).join(', ')}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Branches</span><span className="lb-param-val">{Object.values(selectedScene.nodes).filter((n) => n.choices && n.choices.length > 0).length}</span></div>
                </div>
                <button className="mg-roll-btn" onClick={handlePlay} style={{ marginTop: '1rem' }}>
                  Play Scene
                </button>
              </>
            ) : (
              <div className="si-empty">Select a scene to preview or play.</div>
            )}
          </div>
        </div>
      )}

      {/* Dialogue tree view */}
      {tab === 'tree' && (
        <div className="vn-browse-layout">
          <SceneBrowser scenes={SCENES} selectedId={selectedSceneId} onSelect={setSelectedSceneId} />
          <div className="vn-tree-panel">
            {selectedScene ? (
              <DialogueTreeView scene={selectedScene} />
            ) : (
              <div className="si-empty">Select a scene to view its dialogue tree.</div>
            )}
          </div>
        </div>
      )}

      {/* Data format reference */}
      {tab === 'format' && <DataFormatView />}
    </div>
  );
}
