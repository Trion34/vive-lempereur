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
  neutral: 'var(--text-secondary)',
  happy: 'var(--health-high)',
  angry: 'var(--accent-red-bright)',
  sad: 'var(--accent-blue)',
  surprised: 'var(--accent-gold)',
  determined: '#C4956A',
  afraid: '#7CAA8B',
  bitter: '#8B7D6B',
  thoughtful: '#8B9DC3',
};

function CharacterPortrait({ character, expression, speaking, position }: {
  character: VNCharacter;
  expression: Expression;
  speaking: boolean;
  position: CharPosition;
}) {
  if (position === 'off') return null;

  const exprColor = EXPRESSION_COLORS[expression];
  const posClass = `vn-portrait vn-portrait-${position}${speaking ? ' vn-speaking' : ''}`;

  return (
    <div className={posClass}>
      <div className="vn-portrait-frame" style={{ borderColor: speaking ? character.color : 'var(--border)' }}>
        <svg viewBox="0 0 80 100" className="vn-portrait-svg">
          {/* Head */}
          <ellipse cx="40" cy="35" rx="22" ry="26" fill="var(--bg-card)" stroke={exprColor} strokeWidth="1.5" />
          {/* Eyes */}
          <circle cx="32" cy="32" r="3" fill={exprColor} opacity={expression === 'afraid' ? 0.5 : 0.8} />
          <circle cx="48" cy="32" r="3" fill={exprColor} opacity={expression === 'afraid' ? 0.5 : 0.8} />
          {/* Expression-dependent mouth */}
          {expression === 'happy' && <path d="M32 44 Q40 50 48 44" fill="none" stroke={exprColor} strokeWidth="1.5" />}
          {expression === 'angry' && <path d="M32 46 L48 46" stroke={exprColor} strokeWidth="2" />}
          {expression === 'sad' && <path d="M32 48 Q40 42 48 48" fill="none" stroke={exprColor} strokeWidth="1.5" />}
          {expression === 'surprised' && <ellipse cx="40" cy="46" rx="5" ry="4" fill="none" stroke={exprColor} strokeWidth="1.5" />}
          {expression === 'neutral' && <line x1="34" y1="45" x2="46" y2="45" stroke={exprColor} strokeWidth="1.2" />}
          {expression === 'determined' && <path d="M32 44 L40 46 L48 44" fill="none" stroke={exprColor} strokeWidth="1.5" />}
          {expression === 'afraid' && <path d="M34 46 Q40 42 46 46" fill="none" stroke={exprColor} strokeWidth="1" />}
          {expression === 'bitter' && <path d="M33 45 Q40 43 47 46" fill="none" stroke={exprColor} strokeWidth="1.5" />}
          {expression === 'thoughtful' && <path d="M34 45 L40 46 L46 44" fill="none" stroke={exprColor} strokeWidth="1.2" />}
          {/* Eyebrows */}
          {expression === 'angry' && <>
            <line x1="27" y1="26" x2="35" y2="24" stroke={exprColor} strokeWidth="1.5" />
            <line x1="45" y1="24" x2="53" y2="26" stroke={exprColor} strokeWidth="1.5" />
          </>}
          {expression === 'surprised' && <>
            <path d="M28 24 Q32 20 36 24" fill="none" stroke={exprColor} strokeWidth="1" />
            <path d="M44 24 Q48 20 52 24" fill="none" stroke={exprColor} strokeWidth="1" />
          </>}
          {expression === 'sad' && <>
            <line x1="28" y1="24" x2="36" y2="26" stroke={exprColor} strokeWidth="1" />
            <line x1="44" y1="26" x2="52" y2="24" stroke={exprColor} strokeWidth="1" />
          </>}
          {/* Shoulders */}
          <path d="M15 85 Q15 65 40 62 Q65 65 65 85" fill="var(--bg-card)" stroke={exprColor} strokeWidth="1" />
          {/* Rank indicator */}
          {character.rank === 'Sergeant' && <>
            <line x1="25" y1="75" x2="32" y2="72" stroke={exprColor} strokeWidth="1.5" />
            <line x1="25" y1="79" x2="32" y2="76" stroke={exprColor} strokeWidth="1.5" />
          </>}
          {character.rank === 'Captain' && <circle cx="28" cy="74" r="3" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" />}
        </svg>
      </div>
      <span className="vn-portrait-name" style={{ color: character.color }}>{character.name}</span>
    </div>
  );
}

/* ================================================================== */
/*  BACKGROUND SCENES                                                  */
/* ================================================================== */

const MOOD_STYLES: Record<SceneMood, { bg: string; overlay: string }> = {
  night_camp: { bg: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 40%, #2A1F15 100%)', overlay: 'rgba(255, 150, 50, 0.03)' },
  dawn: { bg: 'linear-gradient(180deg, #1A1520 0%, #2E2540 30%, #4A3A50 60%, #8A6A60 100%)', overlay: 'rgba(255, 200, 150, 0.04)' },
  battlefield: { bg: 'linear-gradient(180deg, #1A1A1A 0%, #2A2520 40%, #3A3020 100%)', overlay: 'rgba(200, 150, 100, 0.03)' },
  march: { bg: 'linear-gradient(180deg, #15181E 0%, #1E2228 50%, #252A30 100%)', overlay: 'rgba(150, 180, 200, 0.03)' },
  interior: { bg: 'linear-gradient(180deg, #1A1510 0%, #2A2015 50%, #1A1510 100%)', overlay: 'rgba(255, 200, 100, 0.05)' },
  ridge: { bg: 'linear-gradient(180deg, #0F1520 0%, #1A2535 50%, #2A3545 100%)', overlay: 'rgba(200, 220, 255, 0.02)' },
  gorge: { bg: 'linear-gradient(180deg, #0A0A0F 0%, #151520 40%, #1A1A25 100%)', overlay: 'rgba(100, 100, 150, 0.03)' },
};

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

  // Apply position and mood changes
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

  // Reset when scene changes
  useEffect(() => {
    setCurrentNodeId(scene.startNode);
    setPositions({});
    setMood(scene.mood);
    setHistory([]);
  }, [scene.id]);

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

  const moodStyle = MOOD_STYLES[mood];
  const isNarrator = node.speaker === 'narrator';

  return (
    <div className={`vn-stage ${effectClass}`} style={{ background: moodStyle.bg }} onClick={advance}>
      {/* Background overlay */}
      <div className="vn-bg-overlay" style={{ background: moodStyle.overlay }} />

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
            {(Object.keys(MOOD_STYLES) as SceneMood[]).map((m) => (
              <div key={m} className="vn-mood-swatch">
                <div className="vn-mood-swatch-color" style={{ background: MOOD_STYLES[m].bg }} />
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
