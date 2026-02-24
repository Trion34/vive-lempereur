import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';

// ============================================================
// Types — re-exported for external consumers
// ============================================================

export interface CinematicChoice {
  id: string;
  label: string;
  desc: string;
}

export interface RollDisplay {
  stat: string;
  roll: number;
  target: number;
  passed: boolean;
}

export interface CinematicConfig {
  title?: string;
  subtitle?: string;
  chunks: string[];
  choices?: CinematicChoice[];
  onChoice?: (id: string) => void;
  onComplete?: () => void;
}

export interface CinematicHandle {
  destroy(): void;
  showResult(config: {
    chunks: string[];
    changes?: string[];
    rollDisplay?: RollDisplay;
    onContinue: () => void;
  }): void;
}

// ============================================================
// Constants
// ============================================================

const CHARS_PER_SEC = 35;
const CURSOR_CHAR = '\u258C'; // ▌

type CinematicState =
  | 'TYPING'
  | 'CHUNK_COMPLETE'
  | 'CHOICES_VISIBLE'
  | 'COMPLETE'
  | 'RESULT_TYPING'
  | 'RESULT_CHUNK_COMPLETE'
  | 'RESULT_COMPLETE';

// ============================================================
// Component
// ============================================================

interface CinematicOverlayProps {
  config: CinematicConfig;
}

export const CinematicOverlay = forwardRef<CinematicHandle, CinematicOverlayProps>(
  function CinematicOverlay({ config }, ref) {
    // --- Refs for the rAF typewriter engine (mutable, never trigger re-renders) ---
    const stateRef = useRef<CinematicState>('TYPING');
    const destroyedRef = useRef(false);
    const rafIdRef = useRef(0);
    const lastTimeRef = useRef(0);

    // Initial chunks
    const chunkIndexRef = useRef(0);
    const charIndexRef = useRef(0);

    // Result chunks
    const resultChunksRef = useRef<string[]>([]);
    const resultChunkIndexRef = useRef(0);
    const resultCharIndexRef = useRef(0);
    const resultOnContinueRef = useRef<(() => void) | null>(null);
    const resultChangesRef = useRef<string[] | undefined>(undefined);

    // DOM refs for direct manipulation (typewriter perf)
    const textContainerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);
    const choicesContainerRef = useRef<HTMLDivElement>(null);
    const changesContainerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Roll display — controlled via state for render
    const [rollDisplay, setRollDisplay] = useState<RollDisplay | null>(null);
    const [rollVisible, setRollVisible] = useState(false);

    // Track current typing paragraph and spans (direct DOM, not React state)
    const currentPRef = useRef<HTMLParagraphElement | null>(null);
    const typedSpanRef = useRef<HTMLSpanElement | null>(null);
    const untypedSpanRef = useRef<HTMLSpanElement | null>(null);

    // Stable reference to config (avoid stale closures)
    const configRef = useRef(config);
    configRef.current = config;

    // --- Helpers ---

    const removeCursor = useCallback(() => {
      const cursor = cursorRef.current;
      if (cursor && cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    }, []);

    const showChoicesDOM = useCallback(
      (choices: CinematicChoice[], onChoice: (id: string) => void) => {
        const container = choicesContainerRef.current;
        if (!container) return;
        container.innerHTML = '';
        for (const choice of choices) {
          const btn = document.createElement('button');
          btn.className = 'cinematic-choice-btn';
          btn.innerHTML = `
          <span class="cinematic-choice-label">${choice.label}</span>
          <span class="cinematic-choice-desc">${choice.desc}</span>
        `;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onChoice(choice.id);
          });
          container.appendChild(btn);
        }
      },
      [],
    );

    const showContinueButtonDOM = useCallback((callback: () => void) => {
      const container = choicesContainerRef.current;
      if (!container) return;
      container.innerHTML = '';
      const btn = document.createElement('button');
      btn.className = 'cinematic-choice-btn cinematic-continue-btn';
      btn.innerHTML = `<span class="cinematic-choice-label">Continue</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        callback();
      });
      container.appendChild(btn);
    }, []);

    // --- Typewriter engine: initial chunks ---

    const finishChunk = useCallback(() => {
      cancelAnimationFrame(rafIdRef.current);
      const cfg = configRef.current;
      const chunk = cfg.chunks[chunkIndexRef.current];
      const p = currentPRef.current;
      if (p) p.textContent = chunk;
      removeCursor();

      const isLast = chunkIndexRef.current >= cfg.chunks.length - 1;

      if (isLast) {
        if (cfg.choices && cfg.choices.length > 0) {
          stateRef.current = 'CHOICES_VISIBLE';
          if (hintRef.current) hintRef.current.style.display = 'none';
          showChoicesDOM(cfg.choices, cfg.onChoice!);
        } else {
          stateRef.current = 'COMPLETE';
          if (hintRef.current) hintRef.current.style.display = 'none';
          if (cfg.onComplete) {
            showContinueButtonDOM(cfg.onComplete);
          }
        }
      } else {
        stateRef.current = 'CHUNK_COMPLETE';
      }
    }, [removeCursor, showChoicesDOM, showContinueButtonDOM]);

    const typeLoop = useCallback(
      (now: number) => {
        if (destroyedRef.current) return;
        const elapsed = now - lastTimeRef.current;
        const charsToAdd = Math.floor((elapsed / 1000) * CHARS_PER_SEC);

        if (charsToAdd > 0) {
          lastTimeRef.current = now;
          const chunk = configRef.current.chunks[chunkIndexRef.current];
          const end = Math.min(charIndexRef.current + charsToAdd, chunk.length);
          if (typedSpanRef.current) typedSpanRef.current.textContent = chunk.slice(0, end);
          if (untypedSpanRef.current) untypedSpanRef.current.textContent = chunk.slice(end);
          charIndexRef.current = end;

          if (charIndexRef.current >= chunk.length) {
            finishChunk();
            return;
          }
        }

        rafIdRef.current = requestAnimationFrame(typeLoop);
      },
      [finishChunk],
    );

    const startTypingChunk = useCallback(() => {
      stateRef.current = 'TYPING';
      charIndexRef.current = 0;
      if (hintRef.current) {
        hintRef.current.textContent = 'Click to continue';
        hintRef.current.style.display = '';
      }

      // Clear previous chunk — each chunk replaces the last
      const textEl = textContainerRef.current;
      if (!textEl) return;
      textEl.innerHTML = '';

      const chunk = configRef.current.chunks[chunkIndexRef.current];
      const p = document.createElement('p');
      currentPRef.current = p;

      // Pre-render full text to lock layout — no reflow during typing
      const typed = document.createElement('span');
      const untyped = document.createElement('span');
      untyped.style.visibility = 'hidden';
      untyped.textContent = chunk;

      typedSpanRef.current = typed;
      untypedSpanRef.current = untyped;

      const cursor = cursorRef.current!;
      cursor.style.display = '';
      p.appendChild(typed);
      p.appendChild(cursor);
      p.appendChild(untyped);
      textEl.appendChild(p);

      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(typeLoop);
    }, [typeLoop]);

    const skipToFullChunk = useCallback(() => {
      cancelAnimationFrame(rafIdRef.current);
      const chunk = configRef.current.chunks[chunkIndexRef.current];
      if (currentPRef.current) currentPRef.current.textContent = chunk;
      removeCursor();
      finishChunk();
    }, [removeCursor, finishChunk]);

    // --- Typewriter engine: result chunks ---

    const finishResultChunk = useCallback(() => {
      cancelAnimationFrame(rafIdRef.current);
      const chunk = resultChunksRef.current[resultChunkIndexRef.current];
      const p = currentPRef.current;
      if (p) p.textContent = chunk;
      removeCursor();

      const isLast = resultChunkIndexRef.current >= resultChunksRef.current.length - 1;

      if (isLast) {
        stateRef.current = 'RESULT_COMPLETE';
        if (hintRef.current) hintRef.current.style.display = 'none';
        // Show changes if any
        const changes = resultChangesRef.current;
        if (changes && changes.length > 0 && changesContainerRef.current) {
          changesContainerRef.current.style.display = '';
          changesContainerRef.current.innerHTML = changes
            .map((c) => `<span class="cinematic-change-item">${c}</span>`)
            .join('');
        }
        // Show continue
        if (resultOnContinueRef.current) {
          showContinueButtonDOM(resultOnContinueRef.current);
        }
      } else {
        stateRef.current = 'RESULT_CHUNK_COMPLETE';
      }
    }, [removeCursor, showContinueButtonDOM]);

    const resultTypeLoop = useCallback(
      (now: number) => {
        if (destroyedRef.current) return;
        const elapsed = now - lastTimeRef.current;
        const charsToAdd = Math.floor((elapsed / 1000) * CHARS_PER_SEC);

        if (charsToAdd > 0) {
          lastTimeRef.current = now;
          const chunk = resultChunksRef.current[resultChunkIndexRef.current];
          const end = Math.min(resultCharIndexRef.current + charsToAdd, chunk.length);
          if (typedSpanRef.current) typedSpanRef.current.textContent = chunk.slice(0, end);
          if (untypedSpanRef.current) untypedSpanRef.current.textContent = chunk.slice(end);
          resultCharIndexRef.current = end;

          if (resultCharIndexRef.current >= chunk.length) {
            finishResultChunk();
            return;
          }
        }

        rafIdRef.current = requestAnimationFrame(resultTypeLoop);
      },
      [finishResultChunk],
    );

    const startResultTyping = useCallback(() => {
      stateRef.current = 'RESULT_TYPING';
      resultCharIndexRef.current = 0;
      if (hintRef.current) {
        hintRef.current.textContent = 'Click to continue';
        hintRef.current.style.display = '';
      }

      // Clear previous chunk — each chunk replaces the last
      const textEl = textContainerRef.current;
      if (!textEl) return;
      textEl.innerHTML = '';

      const chunk = resultChunksRef.current[resultChunkIndexRef.current];
      const p = document.createElement('p');
      currentPRef.current = p;

      // Pre-render full text to lock layout — no reflow during typing
      const typed = document.createElement('span');
      const untyped = document.createElement('span');
      untyped.style.visibility = 'hidden';
      untyped.textContent = chunk;

      typedSpanRef.current = typed;
      untypedSpanRef.current = untyped;

      const cursor = cursorRef.current!;
      cursor.style.display = '';
      p.appendChild(typed);
      p.appendChild(cursor);
      p.appendChild(untyped);
      textEl.appendChild(p);

      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(resultTypeLoop);
    }, [resultTypeLoop]);

    const skipResultChunk = useCallback(() => {
      cancelAnimationFrame(rafIdRef.current);
      const chunk = resultChunksRef.current[resultChunkIndexRef.current];
      if (currentPRef.current) currentPRef.current.textContent = chunk;
      removeCursor();
      finishResultChunk();
    }, [removeCursor, finishResultChunk]);

    // --- Click handler ---

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        // Don't intercept clicks on choice buttons
        if ((e.target as HTMLElement).closest('.cinematic-choice-btn')) return;

        switch (stateRef.current) {
          case 'TYPING':
            skipToFullChunk();
            break;
          case 'CHUNK_COMPLETE':
            chunkIndexRef.current++;
            if (chunkIndexRef.current < configRef.current.chunks.length) {
              startTypingChunk();
            }
            break;
          case 'RESULT_TYPING':
            skipResultChunk();
            break;
          case 'RESULT_CHUNK_COMPLETE':
            resultChunkIndexRef.current++;
            if (resultChunkIndexRef.current < resultChunksRef.current.length) {
              startResultTyping();
            }
            break;
          case 'RESULT_COMPLETE':
          case 'CHOICES_VISIBLE':
          case 'COMPLETE':
            // Do nothing — buttons handle these states
            break;
        }
      },
      [skipToFullChunk, startTypingChunk, skipResultChunk, startResultTyping],
    );

    // --- Imperative handle ---

    useImperativeHandle(
      ref,
      () => ({
        destroy() {
          if (destroyedRef.current) return;
          destroyedRef.current = true;
          cancelAnimationFrame(rafIdRef.current);
          // The portal will be unmounted by the parent removing the component
        },

        showResult(resultConfig) {
          // Clear previous text and choices
          if (textContainerRef.current) textContainerRef.current.innerHTML = '';
          if (choicesContainerRef.current) choicesContainerRef.current.innerHTML = '';
          if (changesContainerRef.current) {
            changesContainerRef.current.style.display = 'none';
            changesContainerRef.current.innerHTML = '';
          }

          // Show roll display if provided
          if (resultConfig.rollDisplay) {
            setRollDisplay(resultConfig.rollDisplay);
            setRollVisible(true);
          } else {
            setRollVisible(false);
          }

          resultChunksRef.current = resultConfig.chunks;
          resultChunkIndexRef.current = 0;
          resultChangesRef.current = resultConfig.changes;

          // Wrap onContinue to also destroy
          const destroy = () => this.destroy();
          resultOnContinueRef.current = () => {
            destroy();
            resultConfig.onContinue();
          };

          if (resultConfig.chunks.length > 0) {
            startResultTyping();
          } else {
            stateRef.current = 'RESULT_COMPLETE';
            if (hintRef.current) hintRef.current.style.display = 'none';
            const changes = resultConfig.changes;
            if (changes && changes.length > 0 && changesContainerRef.current) {
              changesContainerRef.current.style.display = '';
              changesContainerRef.current.innerHTML = changes
                .map((c) => `<span class="cinematic-change-item">${c}</span>`)
                .join('');
            }
            if (resultOnContinueRef.current) {
              showContinueButtonDOM(resultOnContinueRef.current);
            }
          }
        },
      }),
      [startResultTyping, showContinueButtonDOM],
    );

    // --- Kick off initial typing on mount ---

    useEffect(() => {
      // Reset destroyed flag — StrictMode double-fires effects (mount→cleanup→mount)
      // so the cleanup from the first mount sets this true before the real mount runs.
      destroyedRef.current = false;

      const cfg = configRef.current;
      if (cfg.chunks.length > 0) {
        startTypingChunk();
      } else if (cfg.choices && cfg.choices.length > 0) {
        stateRef.current = 'CHOICES_VISIBLE';
        if (hintRef.current) hintRef.current.style.display = 'none';
        showChoicesDOM(cfg.choices, cfg.onChoice!);
      } else if (cfg.onComplete) {
        stateRef.current = 'COMPLETE';
        if (hintRef.current) hintRef.current.style.display = 'none';
        showContinueButtonDOM(cfg.onComplete);
      }

      return () => {
        destroyedRef.current = true;
        cancelAnimationFrame(rafIdRef.current);
      };
      // Only run on mount/unmount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Render ---

    const rollPassedClass = rollDisplay?.passed ? 'cinematic-roll-passed' : 'cinematic-roll-failed';
    const rollPassedLabel = rollDisplay?.passed ? 'PASSED' : 'FAILED';

    return createPortal(
      <div
        ref={overlayRef}
        className="cinematic-overlay"
        id="cinematic-overlay"
        onClick={handleOverlayClick}
      >
        {/* Roll display (top-left, hidden until showResult) */}
        <div
          className={`cinematic-roll ${rollVisible && rollDisplay ? rollPassedClass : ''}`}
          style={{ display: rollVisible && rollDisplay ? '' : 'none' }}
        >
          {rollVisible && rollDisplay && (
            <>
              <span className="cinematic-roll-stat">{rollDisplay.stat.toUpperCase()}</span>
              <span className="cinematic-roll-numbers">
                {rollDisplay.roll} vs {rollDisplay.target}
              </span>
              <span className="cinematic-roll-verdict">{rollPassedLabel}</span>
            </>
          )}
        </div>

        <div className="cinematic-content">
          {/* Header (optional) */}
          {(config.title || config.subtitle) && (
            <div className="cinematic-header">
              {config.title && <span className="cinematic-title">{config.title}</span>}
              {config.subtitle && <span className="cinematic-subtitle">{config.subtitle}</span>}
            </div>
          )}

          {/* Text container — typed into imperatively */}
          <div ref={textContainerRef} className="cinematic-text" />

          {/* Changes container — shown after result typing */}
          <div
            ref={changesContainerRef}
            className="cinematic-changes"
            style={{ display: 'none' }}
          />
        </div>

        <div className="cinematic-footer">
          {/* Choices container — populated imperatively */}
          <div ref={choicesContainerRef} className="cinematic-choices" />
        </div>

        {/* Hint */}
        <div ref={hintRef} className="cinematic-hint">
          Click to continue
        </div>

        {/* Cursor element — moved around by the typewriter engine */}
        <span ref={cursorRef} className="cinematic-cursor" style={{ display: 'none' }}>
          {CURSOR_CHAR}
        </span>
      </div>,
      document.body,
    );
  },
);
