// ============================================================
// CINEMATIC OVERLAY — full-screen typewriter story sequences
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

const CHARS_PER_SEC = 35;

type CinematicState =
  | 'TYPING'
  | 'CHUNK_COMPLETE'
  | 'CHOICES_VISIBLE'
  | 'COMPLETE'
  | 'RESULT_TYPING'
  | 'RESULT_CHUNK_COMPLETE'
  | 'RESULT_COMPLETE';

/** Show a brief splash overlay on the current screen, click to proceed. */
export function showSplash(text: string, onProceed: () => void): void {
  const overlay = document.createElement('div');
  overlay.className = 'cinematic-splash-overlay';

  const label = document.createElement('div');
  label.className = 'cinematic-splash-text';
  label.textContent = text;
  overlay.appendChild(label);

  const hint = document.createElement('div');
  hint.className = 'cinematic-hint';
  hint.textContent = 'Click to continue';
  overlay.appendChild(hint);

  document.body.appendChild(overlay);

  overlay.addEventListener('click', () => {
    overlay.classList.add('cinematic-splash-exit');
    overlay.addEventListener('animationend', () => {
      overlay.remove();
      onProceed();
    }, { once: true });
  }, { once: true });
}

export function showCinematic(config: CinematicConfig): CinematicHandle {
  let state: CinematicState = 'TYPING';
  let chunkIndex = 0;
  let charIndex = 0;
  let rafId = 0;
  let lastTime = 0;
  let destroyed = false;

  // Build DOM
  const overlay = document.createElement('div');
  overlay.className = 'cinematic-overlay';
  overlay.id = 'cinematic-overlay';

  // Roll display element (top-left, hidden until showResult)
  const rollEl = document.createElement('div');
  rollEl.className = 'cinematic-roll';
  rollEl.style.display = 'none';
  overlay.appendChild(rollEl);

  const content = document.createElement('div');
  content.className = 'cinematic-content';

  // Header (optional)
  if (config.title || config.subtitle) {
    const header = document.createElement('div');
    header.className = 'cinematic-header';
    if (config.title) {
      const titleEl = document.createElement('span');
      titleEl.className = 'cinematic-title';
      titleEl.textContent = config.title;
      header.appendChild(titleEl);
    }
    if (config.subtitle) {
      const subtitleEl = document.createElement('span');
      subtitleEl.className = 'cinematic-subtitle';
      subtitleEl.textContent = config.subtitle;
      header.appendChild(subtitleEl);
    }
    content.appendChild(header);
  }

  const textContainer = document.createElement('div');
  textContainer.className = 'cinematic-text';
  content.appendChild(textContainer);

  const changesContainer = document.createElement('div');
  changesContainer.className = 'cinematic-changes';
  changesContainer.style.display = 'none';
  content.appendChild(changesContainer);

  overlay.appendChild(content);

  const footer = document.createElement('div');
  footer.className = 'cinematic-footer';
  const choicesContainer = document.createElement('div');
  choicesContainer.className = 'cinematic-choices';
  footer.appendChild(choicesContainer);
  overlay.appendChild(footer);

  const hint = document.createElement('div');
  hint.className = 'cinematic-hint';
  hint.textContent = 'Click to continue';
  overlay.appendChild(hint);

  document.body.appendChild(overlay);

  // Cursor element appended to current paragraph
  const cursor = document.createElement('span');
  cursor.className = 'cinematic-cursor';
  cursor.textContent = '\u258C'; // ▌

  // Current paragraph being typed
  let currentP: HTMLParagraphElement | null = null;
  // Pre-rendered spans for reflow-free typing
  let typedSpan: HTMLSpanElement | null = null;
  let untypedSpan: HTMLSpanElement | null = null;

  // --- Roll display ---

  function showRollDisplay(roll: RollDisplay) {
    const passedClass = roll.passed ? 'cinematic-roll-passed' : 'cinematic-roll-failed';
    const passedLabel = roll.passed ? 'PASSED' : 'FAILED';
    rollEl.className = `cinematic-roll ${passedClass}`;
    rollEl.innerHTML = `
      <span class="cinematic-roll-stat">${roll.stat.toUpperCase()}</span>
      <span class="cinematic-roll-numbers">${roll.roll} vs ${roll.target}</span>
      <span class="cinematic-roll-verdict">${passedLabel}</span>
    `;
    rollEl.style.display = '';
  }

  // --- Typewriter engine ---

  function startTypingChunk() {
    state = 'TYPING';
    charIndex = 0;
    hint.textContent = 'Click to continue';
    hint.style.display = '';

    // Clear previous chunk — each chunk replaces the last (like prologue)
    textContainer.innerHTML = '';

    const chunk = config.chunks[chunkIndex];
    currentP = document.createElement('p');

    // Pre-render full text to lock layout — no reflow during typing
    typedSpan = document.createElement('span');
    untypedSpan = document.createElement('span');
    untypedSpan.style.visibility = 'hidden';
    untypedSpan.textContent = chunk;

    currentP.appendChild(typedSpan);
    currentP.appendChild(cursor);
    currentP.appendChild(untypedSpan);
    textContainer.appendChild(currentP);

    lastTime = performance.now();
    rafId = requestAnimationFrame(typeLoop);
  }

  function typeLoop(now: number) {
    if (destroyed) return;
    const elapsed = now - lastTime;
    const charsToAdd = Math.floor((elapsed / 1000) * CHARS_PER_SEC);

    if (charsToAdd > 0) {
      lastTime = now;
      const chunk = config.chunks[chunkIndex];
      const end = Math.min(charIndex + charsToAdd, chunk.length);
      typedSpan!.textContent = chunk.slice(0, end);
      untypedSpan!.textContent = chunk.slice(end);
      charIndex = end;

      if (charIndex >= chunk.length) {
        finishChunk();
        return;
      }
    }

    rafId = requestAnimationFrame(typeLoop);
  }

  function finishChunk() {
    cancelAnimationFrame(rafId);
    // Ensure full text is shown
    const chunk = config.chunks[chunkIndex];
    currentP!.textContent = chunk;
    // Remove cursor from paragraph
    if (cursor.parentNode) cursor.remove();

    const isLast = chunkIndex >= config.chunks.length - 1;

    if (isLast) {
      if (config.choices && config.choices.length > 0) {
        state = 'CHOICES_VISIBLE';
        hint.style.display = 'none';
        showChoices(config.choices, config.onChoice!);
      } else {
        state = 'COMPLETE';
        hint.style.display = 'none';
        if (config.onComplete) {
          showContinueButton(config.onComplete);
        }
      }
    } else {
      state = 'CHUNK_COMPLETE';
    }
  }

  function skipToFullChunk() {
    cancelAnimationFrame(rafId);
    const chunk = config.chunks[chunkIndex];
    currentP!.textContent = chunk;
    if (cursor.parentNode) cursor.remove();
    finishChunk();
  }

  // --- Result typing (for showResult) ---

  let resultChunks: string[] = [];
  let resultChunkIndex = 0;
  let resultCharIndex = 0;
  let resultCurrentP: HTMLParagraphElement | null = null;
  let resultOnContinue: (() => void) | null = null;
  let resultChanges: string[] | undefined;
  let resultTypedSpan: HTMLSpanElement | null = null;
  let resultUntypedSpan: HTMLSpanElement | null = null;

  function startResultTyping() {
    state = 'RESULT_TYPING';
    resultCharIndex = 0;
    hint.textContent = 'Click to continue';
    hint.style.display = '';

    // Clear previous chunk — each chunk replaces the last
    textContainer.innerHTML = '';

    const chunk = resultChunks[resultChunkIndex];
    resultCurrentP = document.createElement('p');

    // Pre-render full text to lock layout — no reflow during typing
    resultTypedSpan = document.createElement('span');
    resultUntypedSpan = document.createElement('span');
    resultUntypedSpan.style.visibility = 'hidden';
    resultUntypedSpan.textContent = chunk;

    resultCurrentP.appendChild(resultTypedSpan);
    resultCurrentP.appendChild(cursor);
    resultCurrentP.appendChild(resultUntypedSpan);
    textContainer.appendChild(resultCurrentP);

    lastTime = performance.now();
    rafId = requestAnimationFrame(resultTypeLoop);
  }

  function resultTypeLoop(now: number) {
    if (destroyed) return;
    const elapsed = now - lastTime;
    const charsToAdd = Math.floor((elapsed / 1000) * CHARS_PER_SEC);

    if (charsToAdd > 0) {
      lastTime = now;
      const chunk = resultChunks[resultChunkIndex];
      const end = Math.min(resultCharIndex + charsToAdd, chunk.length);
      resultTypedSpan!.textContent = chunk.slice(0, end);
      resultUntypedSpan!.textContent = chunk.slice(end);
      resultCharIndex = end;

      if (resultCharIndex >= chunk.length) {
        finishResultChunk();
        return;
      }
    }

    rafId = requestAnimationFrame(resultTypeLoop);
  }

  function finishResultChunk() {
    cancelAnimationFrame(rafId);
    const chunk = resultChunks[resultChunkIndex];
    resultCurrentP!.textContent = chunk;
    if (cursor.parentNode) cursor.remove();

    const isLast = resultChunkIndex >= resultChunks.length - 1;

    if (isLast) {
      state = 'RESULT_COMPLETE';
      hint.style.display = 'none';
      // Show changes if any
      if (resultChanges && resultChanges.length > 0) {
        changesContainer.style.display = '';
        changesContainer.innerHTML = resultChanges
          .map(c => `<span class="cinematic-change-item">${c}</span>`)
          .join('');
      }
      // Show continue
      if (resultOnContinue) {
        showContinueButton(resultOnContinue);
      }
    } else {
      state = 'RESULT_CHUNK_COMPLETE';
    }
  }

  function skipResultChunk() {
    cancelAnimationFrame(rafId);
    const chunk = resultChunks[resultChunkIndex];
    resultCurrentP!.textContent = chunk;
    if (cursor.parentNode) cursor.remove();
    finishResultChunk();
  }

  // --- Choice rendering ---

  function showChoices(choices: CinematicChoice[], onChoice: (id: string) => void) {
    choicesContainer.innerHTML = '';
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
      choicesContainer.appendChild(btn);
    }
  }

  function showContinueButton(callback: () => void) {
    choicesContainer.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'cinematic-choice-btn cinematic-continue-btn';
    btn.innerHTML = `<span class="cinematic-choice-label">Continue</span>`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      callback();
    });
    choicesContainer.appendChild(btn);
  }

  // --- Click handler ---

  function handleClick(e: MouseEvent) {
    // Don't intercept clicks on choice buttons
    if ((e.target as HTMLElement).closest('.cinematic-choice-btn')) return;

    switch (state) {
      case 'TYPING':
        skipToFullChunk();
        break;
      case 'CHUNK_COMPLETE':
        chunkIndex++;
        if (chunkIndex < config.chunks.length) {
          startTypingChunk();
        }
        break;
      case 'RESULT_TYPING':
        skipResultChunk();
        break;
      case 'RESULT_CHUNK_COMPLETE':
        resultChunkIndex++;
        if (resultChunkIndex < resultChunks.length) {
          startResultTyping();
        }
        break;
      case 'RESULT_COMPLETE':
        // Do nothing — continue button handles it
        break;
      case 'CHOICES_VISIBLE':
        // Do nothing — wait for choice
        break;
      case 'COMPLETE':
        // Do nothing — continue button handles it
        break;
    }
  }

  overlay.addEventListener('click', handleClick);

  // Start typing
  if (config.chunks.length > 0) {
    startTypingChunk();
  } else if (config.choices && config.choices.length > 0) {
    state = 'CHOICES_VISIBLE';
    hint.style.display = 'none';
    showChoices(config.choices, config.onChoice!);
  } else if (config.onComplete) {
    state = 'COMPLETE';
    hint.style.display = 'none';
    showContinueButton(config.onComplete);
  }

  // --- Handle ---

  const handle: CinematicHandle = {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelAnimationFrame(rafId);
      overlay.removeEventListener('click', handleClick);
      overlay.remove();
    },

    showResult(resultConfig) {
      // Clear previous text and choices
      textContainer.innerHTML = '';
      choicesContainer.innerHTML = '';
      changesContainer.style.display = 'none';
      changesContainer.innerHTML = '';

      // Show roll display if provided
      if (resultConfig.rollDisplay) {
        showRollDisplay(resultConfig.rollDisplay);
      } else {
        rollEl.style.display = 'none';
      }

      resultChunks = resultConfig.chunks;
      resultChunkIndex = 0;
      resultChanges = resultConfig.changes;
      resultOnContinue = () => {
        handle.destroy();
        resultConfig.onContinue();
      };

      if (resultChunks.length > 0) {
        startResultTyping();
      } else {
        state = 'RESULT_COMPLETE';
        hint.style.display = 'none';
        if (resultChanges && resultChanges.length > 0) {
          changesContainer.style.display = '';
          changesContainer.innerHTML = resultChanges
            .map(c => `<span class="cinematic-change-item">${c}</span>`)
            .join('');
        }
        if (resultOnContinue) showContinueButton(resultOnContinue);
      }
    },
  };

  return handle;
}
