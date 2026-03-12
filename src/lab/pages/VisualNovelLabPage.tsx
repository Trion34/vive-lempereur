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

          {/* Hair */}
          <path d={`M52 58 Q52 35 80 30 Q108 35 108 58 L105 55 Q100 42 80 38 Q60 42 55 55 Z`}
            fill={hairColor} />
          {/* Sideburns */}
          <rect x={80 - traits.jawWidth - 2} y="55" width="5" height="18" rx="2" fill={hairColor} opacity="0.7" />
          <rect x={80 + traits.jawWidth - 3} y="55" width="5" height="18" rx="2" fill={hairColor} opacity="0.7" />

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

          {/* Mustache */}
          {traits.hasMustache && <>
            <path d="M72 82 Q76 80 80 81 Q84 80 88 82" fill="none" stroke={hairColor} strokeWidth="1.5" opacity="0.7" />
          </>}

          {/* Scar — diagonal across left cheek */}
          {traits.hasScar && <path d="M60 72 L66 82" fill="none" stroke="rgba(180,140,120,0.35)" strokeWidth="1.2" strokeLinecap="round" />}

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

function VNRenderer({ scene, onEnd }: { scene: VNScene; onEnd: () => void }) {
  const [currentNodeId, setCurrentNodeId] = useState(scene.startNode);
  const [positions, setPositions] = useState<Record<string, CharPosition>>({});
  const [mood, setMood] = useState<SceneMood>(scene.mood);
  const [history, setHistory] = useState<string[]>([]);
  const [effectClass, setEffectClass] = useState('');
  const typeSpeed = 28;

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
    if (node?.effect) {
      setEffectClass(`vn-effect-${node.effect}`);
      const timer = setTimeout(() => setEffectClass(''), 600);
      return () => clearTimeout(timer);
    }
  }, [currentNodeId]);

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

  const chooseOption = useCallback((nextId: string) => {
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  }, [currentNodeId]);

  if (!node || !speaker) return null;

  const cssBg = MOOD_CSS_BG[mood];
  const isNarrator = node.speaker === 'narrator';

  return (
    <div className={`vn-stage ${effectClass}`} style={{ background: cssBg }} onClick={advance}>
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
        <div className={`vn-dialogue-box${isNarrator ? ' vn-narrator-box' : ''}`}>
          {/* Name plate */}
          {!isNarrator && (
            <div className="vn-nameplate" style={{ color: speaker.color }}>
              {speaker.name}
            </div>
          )}

          {/* Text */}
          <div className="vn-text">
            {displayed}
            {!done && <span className="vn-cursor">|</span>}
          </div>

          {/* Choice buttons */}
          {done && node.choices && node.choices.length > 0 && (
            <div className="vn-choices" onClick={(e) => e.stopPropagation()}>
              {node.choices.map((choice) => (
                <button
                  key={choice.nextId}
                  className="vn-choice-btn"
                  onClick={() => chooseOption(choice.nextId)}
                >
                  <span className="vn-choice-label">{choice.label}</span>
                  {choice.description && <span className="vn-choice-desc">{choice.description}</span>}
                  {choice.statCheck && <span className="vn-choice-check">[{choice.statCheck}]</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Continue indicator */}
        {done && (!node.choices || node.choices.length === 0) && node.next !== null && (
          <div className="vn-continue">Click to continue...</div>
        )}
        {done && node.next === null && !node.choices && (
          <div className="vn-continue vn-end">- End -</div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="vn-progress">
        {history.length + 1} / {Object.keys(scene.nodes).length}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  SCENE BROWSER                                                      */
/* ================================================================== */

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
        >
          <span className="vn-scene-mood">{scene.mood.replace(/_/g, ' ')}</span>
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
                <h2 className="npc-detail-name">{selectedScene.title}</h2>
                <p className="npc-detail-text">{selectedScene.description}</p>
                <div className="vn-scene-info">
                  <div className="lb-param"><span className="lb-param-label">Mood</span><span className="lb-param-val">{selectedScene.mood.replace(/_/g, ' ')}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Nodes</span><span className="lb-param-val">{Object.keys(selectedScene.nodes).length}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Cast</span><span className="lb-param-val">{selectedScene.cast.filter((c) => c !== 'player').map((c) => CHARACTERS[c]?.name).join(', ')}</span></div>
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
