/* ================================================================== */
/*  VISUAL NOVEL ENGINE — Shared Types & Constants                     */
/* ================================================================== */

/** Character expression/mood — determines portrait styling */
export type Expression = 'neutral' | 'happy' | 'angry' | 'sad' | 'surprised' | 'determined' | 'afraid' | 'bitter' | 'thoughtful';

/** Character position on screen */
export type CharPosition = 'left' | 'center' | 'right' | 'off';

/** Background mood — drives the scene's atmosphere */
export type SceneMood = 'night_camp' | 'dawn' | 'battlefield' | 'march' | 'interior' | 'ridge' | 'gorge';

/** Dialogue delivery mode — determines visual treatment */
export type DeliveryMode = 'speech' | 'thought' | 'shout' | 'whisper';

/* ------------------------------------------------------------------ */
/*  Character definitions                                              */
/* ------------------------------------------------------------------ */

export interface VNCharacter {
  id: string;
  name: string;
  rank?: string;
  color: string;        // Name plate color
  defaultExpression: Expression;
}

export const CHARACTERS: Record<string, VNCharacter> = {
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

export interface DialogueNode {
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

export interface VNChoice {
  label: string;
  description?: string;
  nextId: string;
  condition?: string;  // Human-readable gate description
  statCheck?: string;  // e.g. "Valor 50+"
}

/* ------------------------------------------------------------------ */
/*  Scene — a complete VN conversation                                 */
/* ------------------------------------------------------------------ */

export interface VNScene {
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

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const EXPRESSION_COLORS: Record<Expression, string> = {
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

export const ALL_EXPRESSIONS: Expression[] = ['neutral', 'happy', 'angry', 'sad', 'surprised', 'determined', 'afraid', 'bitter', 'thoughtful'];

export const ALL_MOODS: SceneMood[] = ['night_camp', 'dawn', 'battlefield', 'march', 'interior', 'ridge', 'gorge'];

export const MOOD_ACCENT: Record<SceneMood, string> = {
  night_camp: '#4A6A9A',
  dawn: '#A87060',
  battlefield: '#8A7050',
  march: '#6A8A50',
  interior: '#A8906A',
  ridge: '#6A8AAA',
  gorge: '#5A5A8A',
};
