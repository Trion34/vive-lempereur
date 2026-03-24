import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SceneMood, VNScene } from '../../types/vnTypes';

/* ================================================================== */
/*  MOOD CSS BACKGROUNDS                                               */
/* ================================================================== */

export const MOOD_CSS_BG: Record<SceneMood, string> = {
  night_camp: 'linear-gradient(180deg, #0A0E1A 0%, #1A1F2E 40%, #2A1F15 100%)',
  dawn: 'linear-gradient(180deg, #1A1520 0%, #2E2540 30%, #4A3A50 60%, #8A6A60 100%)',
  battlefield: 'linear-gradient(180deg, #1A1A1A 0%, #2A2520 40%, #3A3020 100%)',
  march: 'linear-gradient(180deg, #15181E 0%, #1E2228 50%, #252A30 100%)',
  interior: 'linear-gradient(180deg, #1A1510 0%, #2A2015 50%, #1A1510 100%)',
  ridge: 'linear-gradient(180deg, #0F1520 0%, #1A2535 50%, #2A3545 100%)',
  gorge: 'linear-gradient(180deg, #0A0A0F 0%, #151520 40%, #1A1A25 100%)',
};

/* ================================================================== */
/*  TEXT SPEED                                                         */
/* ================================================================== */

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';
export const SPEED_VALUES: Record<TextSpeed, number> = { slow: 45, normal: 28, fast: 12, instant: 0 };

/* ================================================================== */
/*  TYPEWRITER HOOK                                                    */
/* ================================================================== */

export function useTypewriter(text: string, speed: number): { displayed: string; done: boolean; skip: () => void } {
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
export function parseRichText(raw: string): React.ReactNode[] {
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
      parts.push(React.createElement('strong', { key: key++, className: 'vn-rich-bold' }, match[2]));
    } else if (match[3]) {
      // *italic*
      parts.push(React.createElement('em', { key: key++, className: 'vn-rich-italic' }, match[3]));
    } else if (match[4]) {
      // ~whisper~
      parts.push(React.createElement('span', { key: key++, className: 'vn-rich-whisper' }, match[4]));
    } else if (match[5]) {
      // _emphasis_
      parts.push(React.createElement('span', { key: key++, className: 'vn-rich-emphasis' }, match[5]));
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
/*  SCENE UTILITY HELPERS                                              */
/* ================================================================== */

/** Count total words across all nodes in a scene */
export function sceneWordCount(scene: VNScene): number {
  return Object.values(scene.nodes).reduce((sum, n) => sum + n.text.split(/\s+/).length, 0);
}

/** Estimate read time (assuming ~200 wpm for VN pacing with typewriter) */
export function readTimeEstimate(wordCount: number): string {
  const mins = Math.ceil(wordCount / 120); // slower for VN pacing
  return mins <= 1 ? '~1 min' : `~${mins} min`;
}
