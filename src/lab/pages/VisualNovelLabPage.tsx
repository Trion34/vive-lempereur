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

interface DialogueNode {
  id: string;
  /** Who is speaking (character id, or 'narrator' for descriptive text) */
  speaker: string;
  /** Expression override for this line */
  expression?: Expression;
  /** The dialogue text */
  text: string;
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
        text: "Arcole was different. We crossed a bridge under fire — seventy-five paces of open causeway, Austrian grapeshot the whole way. Men fell like wheat.",
        next: 'jb_1',
      },
      jb_1: {
        id: 'jb_1', speaker: 'jb', expression: 'afraid',
        text: "How... how did you survive that?",
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
        text: "He grabbed the flag himself. Ran onto the bridge. Aides falling around him. Madness — or genius. I still don't know which. But every man who saw it followed him.",
        next: 'jb_react_1',
      },
      fear_branch: {
        id: 'fear_branch', speaker: 'pierre', expression: 'bitter',
        text: "Every second. But fear is like the cold — you can feel it and still keep moving. The trick is not to think. Just put one foot in front of the other.",
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
        text: "No. They won't. Nothing stops a musket ball except another body, and I'd rather not be that body. So I shuffle cards. It keeps my hands steady. Steady hands, steady nerve. That's what the cards are for.",
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
        text: "Musket. Show me. NOW.",
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
    <div className={posClass}>
      <div className="vn-portrait-frame" style={{ borderColor: speaking ? character.color : undefined }}>
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

          {/* Ground */}
          <rect x="0" y="350" width="800" height="150" fill="#15120E" />
          <rect x="0" y="350" width="800" height="3" fill="#1A1510" opacity="0.6" />

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

          {/* Distant campfires */}
          {[150, 300, 550, 680].map((x, i) => (
            <g key={`cf${i}`}>
              <circle cx={x} cy={310 + i * 8} r="3" fill="#FF8020" opacity="0.15">
                <animate attributeName="opacity" values="0.15;0.25;0.15" dur={`${2 + i}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={310 + i * 8} r="8" fill="rgba(255,120,30,0.04)" />
            </g>
          ))}

          {/* Tent silhouettes */}
          <path d="M100 370 L130 340 L160 370 Z" fill="#0A0A0A" opacity="0.5" />
          <path d="M600 365 L640 330 L680 365 Z" fill="#0A0A0A" opacity="0.5" />
        </>}

        {/* Dawn scene */}
        {mood === 'dawn' && <>
          {/* Dawn horizon glow */}
          <ellipse cx="400" cy="280" rx="500" ry="100" fill="rgba(200,120,80,0.08)" />
          <ellipse cx="400" cy="300" rx="300" ry="40" fill="rgba(255,180,120,0.06)" />

          {/* Clouds */}
          <ellipse cx="200" cy="100" rx="120" ry="20" fill="rgba(180,120,80,0.06)" />
          <ellipse cx="550" cy="80" rx="80" ry="15" fill="rgba(180,120,80,0.05)" />
          <ellipse cx="650" cy="140" rx="100" ry="18" fill="rgba(180,120,80,0.04)" />

          {/* Mountain silhouettes */}
          <path d="M0 280 L100 200 L200 240 L300 180 L400 220 L500 160 L600 200 L700 180 L800 240 L800 500 L0 500 Z"
            fill="#1A1520" opacity="0.7" />

          {/* Ground */}
          <rect x="0" y="350" width="800" height="150" fill="#2A2015" />

          {/* Tent rows */}
          {[50, 150, 250, 450, 550, 700].map((x, i) => (
            <path key={`t${i}`} d={`M${x} 375 L${x+20} 350 L${x+40} 375 Z`} fill="#1A1510" opacity="0.4" />
          ))}

          {/* Morning mist */}
          <rect x="0" y="340" width="800" height="30" fill="rgba(200,180,160,0.05)" />
          <rect x="0" y="350" width="800" height="20" fill="rgba(200,180,160,0.04)" />
        </>}

        {/* Battlefield scene */}
        {mood === 'battlefield' && <>
          {/* Smoke haze */}
          <rect x="0" y="0" width="800" height="500" fill="rgba(150,130,100,0.03)" />
          <ellipse cx="200" cy="200" rx="200" ry="100" fill="rgba(150,130,100,0.04)" />
          <ellipse cx="600" cy="150" rx="180" ry="80" fill="rgba(150,130,100,0.03)" />

          {/* Hills */}
          <path d="M0 300 Q200 250 400 280 Q600 310 800 270 L800 500 L0 500 Z" fill="#2A2520" />
          <path d="M0 350 Q200 320 400 340 Q600 360 800 330 L800 500 L0 500 Z" fill="#30281E" />

          {/* Cannon smoke puffs */}
          {[150, 400, 650].map((x, i) => (
            <ellipse key={`sm${i}`} cx={x} cy={280 + i * 10} rx={40 + i * 10} ry={15 + i * 5}
              fill="rgba(180,170,150,0.04)">
              <animate attributeName="rx" values={`${40+i*10};${50+i*10};${40+i*10}`}
                dur={`${4+i}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
        </>}

        {/* March scene */}
        {mood === 'march' && <>
          {/* Road */}
          <path d="M300 500 L380 300 L400 200 L420 300 L500 500 Z" fill="rgba(150,130,100,0.08)" />

          {/* Alps in distance */}
          <path d="M0 250 L120 150 L200 200 L300 120 L400 160 L500 100 L600 150 L700 130 L800 180 L800 500 L0 500 Z"
            fill="#1A2030" opacity="0.6" />
          <path d="M0 300 L100 250 L250 280 L350 240 L500 270 L650 250 L800 280 L800 500 L0 500 Z"
            fill="#1E2530" opacity="0.7" />

          {/* Snow on peaks */}
          <path d="M290 125 L300 120 L310 128" fill="none" stroke="rgba(200,200,220,0.15)" strokeWidth="2" />
          <path d="M490 105 L500 100 L510 108" fill="none" stroke="rgba(200,200,220,0.15)" strokeWidth="2" />

          {/* Ground */}
          <rect x="0" y="370" width="800" height="130" fill="#1E2228" />
        </>}

        {/* Interior scene */}
        {mood === 'interior' && <>
          {/* Wooden walls */}
          <rect x="0" y="0" width="800" height="500" fill="#1A1510" />
          {[0, 100, 200, 300, 400, 500, 600, 700].map((x) => (
            <line key={`w${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#15120E" strokeWidth="1" opacity="0.4" />
          ))}

          {/* Wooden beam ceiling */}
          <rect x="0" y="0" width="800" height="80" fill="#15120E" />
          <line x1="0" y1="80" x2="800" y2="80" stroke="#201A12" strokeWidth="3" />
          <line x1="0" y1="78" x2="800" y2="78" stroke="#2A2218" strokeWidth="1" />

          {/* Lantern glow */}
          <radialGradient id="vn_lantern" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255,200,100,0.08)" />
            <stop offset="100%" stopColor="rgba(255,200,100,0)" />
          </radialGradient>
          <rect x="0" y="0" width="800" height="500" fill="url(#vn_lantern)" />

          {/* Floor boards */}
          <rect x="0" y="400" width="800" height="100" fill="#15120A" />
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
            <line key={`f${x}`} x1={x} y1="400" x2={x} y2="500" stroke="#1A1510" strokeWidth="0.5" opacity="0.5" />
          ))}

          {/* Barrel in corner */}
          <ellipse cx="720" cy="380" rx="25" ry="10" fill="#2A2015" />
          <rect x="695" y="380" width="50" height="40" rx="3" fill="#2A2015" stroke="#352A1A" strokeWidth="0.5" />
          <ellipse cx="720" cy="420" rx="25" ry="10" fill="#2A2015" stroke="#352A1A" strokeWidth="0.5" />
        </>}

        {/* Ridge scene */}
        {mood === 'ridge' && <>
          {/* Star field */}
          {[50,150,250,350,450,550,650,750,100,300,500,700].map((x, i) => (
            <circle key={`rs${i}`} cx={x} cy={20+i*6} r="0.7" fill="white" opacity={0.2 + (i%3)*0.1} />
          ))}

          {/* Ridge mountains */}
          <path d="M0 200 L150 120 L300 180 L450 100 L600 150 L750 110 L800 160 L800 500 L0 500 Z"
            fill="#0F1520" opacity="0.9" />
          <path d="M0 300 L200 260 L400 290 L600 250 L800 280 L800 500 L0 500 Z"
            fill="#152030" opacity="0.8" />

          {/* Ground plateau */}
          <rect x="0" y="360" width="800" height="140" fill="#1A2535" />

          {/* Wind lines */}
          {[1,2,3].map((i) => (
            <line key={`wl${i}`} x1={100*i} y1={200+i*30} x2={100*i+80} y2={195+i*30}
              stroke="rgba(200,220,255,0.03)" strokeWidth="0.5" />
          ))}
        </>}

        {/* Gorge scene */}
        {mood === 'gorge' && <>
          {/* Cliff walls */}
          <path d="M0 0 L0 500 L100 500 L80 400 L120 300 L60 200 L100 100 L50 0 Z"
            fill="#101018" opacity="0.8" />
          <path d="M800 0 L800 500 L700 500 L720 400 L680 300 L740 200 L700 100 L750 0 Z"
            fill="#101018" opacity="0.8" />

          {/* Gorge floor */}
          <rect x="0" y="380" width="800" height="120" fill="#0A0A10" />

          {/* Water/stream */}
          <path d="M300 480 Q350 470 400 475 Q450 480 500 472 Q550 468 600 475"
            fill="none" stroke="rgba(100,120,160,0.1)" strokeWidth="2" />

          {/* Rock textures */}
          {[120,200,300,500,600,680].map((x, i) => (
            <ellipse key={`rk${i}`} cx={x} cy={400+i*5} rx={10+i*2} ry={5+i} fill="rgba(40,40,50,0.3)" />
          ))}
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
/*  VN RENDERER — the core visual novel display                        */
/* ================================================================== */

type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';
const SPEED_VALUES: Record<TextSpeed, number> = { slow: 45, normal: 28, fast: 12, instant: 0 };

function VNRenderer({ scene, onEnd }: { scene: VNScene; onEnd: () => void }) {
  const [currentNodeId, setCurrentNodeId] = useState(scene.startNode);
  const [positions, setPositions] = useState<Record<string, CharPosition>>({});
  const [mood, setMood] = useState<SceneMood>(scene.mood);
  const [history, setHistory] = useState<string[]>([]);
  const [effectClass, setEffectClass] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [textSpeed, setTextSpeed] = useState<TextSpeed>('normal');
  const [autoPlay, setAutoPlay] = useState(false);
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
  }, [scene.id]);

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

    setHistory((prev) => [...prev, currentNodeId]);

    if (node.next === null || node.next === undefined) {
      onEnd();
      return;
    }
    setCurrentNodeId(node.next);
  }, [done, skip, node, currentNodeId, onEnd]);

  // Auto-play: advance after typewriter finishes (stop at choices)
  useEffect(() => {
    if (!autoPlay || !done) return;
    if (node?.choices && node.choices.length > 0) {
      setAutoPlay(false);
      return;
    }
    const delay = Math.max(800, node?.text.length ? node.text.length * 15 : 1500);
    const timer = setTimeout(advance, delay);
    return () => clearTimeout(timer);
  }, [autoPlay, done, node, advance]);

  const chooseOption = useCallback((nextId: string) => {
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  }, [currentNodeId]);

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
        <div className={`vn-dialogue-box${isNarrator ? ' vn-narrator-box' : ''}${nodeTransition ? ' vn-node-fade' : ''}`}>
          {/* Name plate with accent bar */}
          {!isNarrator && (
            <div className="vn-nameplate" style={{ '--speaker-color': speaker.color } as React.CSSProperties}>
              <span className="vn-nameplate-text">{speaker.name}</span>
              {speaker.rank && <span className="vn-nameplate-rank">{speaker.rank}</span>}
            </div>
          )}

          {/* Text */}
          <div className="vn-text">
            {displayed}
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

        {/* End marker */}
        {done && node.next === null && !node.choices && (
          <div className="vn-continue vn-end">- End -</div>
        )}

        {/* Controls bar — integrated below dialogue */}
        <div className="vn-controls-bar" onClick={(e) => e.stopPropagation()}>
          <button className="vn-rewind-btn" onClick={rewind}
            disabled={history.length === 0} title="Go back (Backspace)">
            &larr;
          </button>
          <div className="vn-controls-divider" />
          <div className="vn-speed-controls">
            {(['slow', 'normal', 'fast', 'instant'] as TextSpeed[]).map((s) => (
              <button key={s} className={`vn-speed-btn${textSpeed === s ? ' active' : ''}`}
                onClick={() => setTextSpeed(s)}>
                {s === 'slow' ? 'S' : s === 'normal' ? 'N' : s === 'fast' ? 'F' : '>>'}
              </button>
            ))}
          </div>
          <div className="vn-controls-divider" />
          <button className={`vn-auto-btn${autoPlay ? ' active' : ''}`}
            onClick={() => setAutoPlay(!autoPlay)} title="Auto-play (A)">
            Auto
          </button>
          <button className="vn-log-btn" onClick={() => setShowLog(!showLog)}>
            {showLog ? 'Close' : 'Log'}
          </button>
          <span className="vn-progress-counter">
            {history.length + 1} / {Object.keys(scene.nodes).length}
          </span>
        </div>
      </div>

      {/* Dialogue history log */}
      {showLog && (
        <div className="vn-log-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="vn-log-header">
            <span>Dialogue Log</span>
            <button className="vn-log-close" onClick={() => setShowLog(false)}>&times;</button>
          </div>
          <div className="vn-log-entries">
            {history.map((nodeId) => {
              const hNode = scene.nodes[nodeId];
              if (!hNode) return null;
              const hSpeaker = CHARACTERS[hNode.speaker];
              const isNar = hNode.speaker === 'narrator';
              return (
                <div key={nodeId} className={`vn-log-entry${isNar ? ' vn-log-narrator' : ''}`}>
                  {!isNar && <span className="vn-log-name" style={{ color: hSpeaker?.color }}>{hSpeaker?.name}</span>}
                  <span className="vn-log-text">{hNode.text}</span>
                </div>
              );
            })}
            <div ref={logEndRef} />
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

function SceneBrowser({ scenes, selectedId, onSelect }: {
  scenes: VNScene[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="vn-browser">
      {scenes.map((scene) => (
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
          </div>
        </button>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  DIALOGUE TREE INSPECTOR                                            */
/* ================================================================== */

function DialogueTreeView({ scene }: { scene: VNScene }) {
  return (
    <div className="vn-tree">
      <h3 className="cl-section-title">Dialogue Tree: {scene.title}</h3>
      <div className="vn-tree-nodes">
        {Object.values(scene.nodes).map((node) => {
          const speaker = CHARACTERS[node.speaker];
          const isNarrator = node.speaker === 'narrator';
          return (
            <div key={node.id} className={`vn-tree-node${node.choices ? ' vn-tree-branch' : ''}`}>
              <div className="vn-tree-node-header">
                <span className="vn-tree-node-id">{node.id}</span>
                {!isNarrator && (
                  <span className="vn-tree-node-speaker" style={{ color: speaker?.color }}>{speaker?.name}</span>
                )}
                {isNarrator && <span className="vn-tree-node-speaker" style={{ color: 'var(--text-dim)' }}>Narrator</span>}
                {node.expression && <span className="vn-tree-node-expr">{node.expression}</span>}
                {node.effect && <span className="vn-tree-node-effect">{node.effect}</span>}
              </div>
              <p className="vn-tree-node-text">{node.text.slice(0, 100)}{node.text.length > 100 ? '...' : ''}</p>
              {node.choices && (
                <div className="vn-tree-node-choices">
                  {node.choices.map((c) => (
                    <span key={c.nextId} className="vn-tree-choice-tag">{c.label} &rarr; {c.nextId}</span>
                  ))}
                </div>
              )}
              {node.next !== undefined && node.next !== null && !node.choices && (
                <span className="vn-tree-next">&rarr; {node.next}</span>
              )}
              {node.next === null && <span className="vn-tree-end">END</span>}
            </div>
          );
        })}
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
        <VNRenderer key={playKey} scene={selectedScene} onEnd={handleEnd} />
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
