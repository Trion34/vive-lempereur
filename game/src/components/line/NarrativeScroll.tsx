import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { LogEntry } from '../shared/LogEntry';

export interface NarrativeEntry {
  type: string;
  text: string;
}

export interface NarrativeScrollHandle {
  /** Replace the entire page with a cross-fade animation */
  crossFade: (entries: NarrativeEntry[]) => void;
  /** Append a single entry with fade-in to the current page */
  appendEntry: (entry: NarrativeEntry) => void;
  /** Scroll to top */
  scrollToTop: () => void;
  /** Scroll to bottom */
  scrollToBottom: () => void;
}

/**
 * NarrativeScroll uses imperative DOM manipulation for animation-heavy
 * cross-fade and append operations. React state-based rendering would cause
 * re-renders that conflict with ongoing CSS animations.
 */
export const NarrativeScroll = forwardRef<NarrativeScrollHandle>(
  function NarrativeScroll(_props, ref) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const createEntryElement = useCallback(
      (entry: NarrativeEntry): HTMLElement => {
        const div = document.createElement('div');
        const positiveClass = entry.type === 'morale' && entry.text.includes('+') ? ' positive' : '';
        const negativeClass =
          entry.type === 'morale' && !entry.text.includes('+') ? ' negative' : '';
        div.className = `log-entry ${entry.type}${positiveClass}${negativeClass}`;
        div.innerHTML = entry.text
          .split('\n\n')
          .map((p) => `<p>${p}</p>`)
          .join('\n\n');
        return div;
      },
      [],
    );

    useImperativeHandle(ref, () => ({
      crossFade(entries: NarrativeEntry[]) {
        const scroll = scrollRef.current;
        if (!scroll) return;

        const newPage = document.createElement('div');
        newPage.className = 'narrative-page';
        for (const entry of entries) {
          newPage.appendChild(createEntryElement(entry));
        }

        const oldPage = scroll.querySelector(
          '.narrative-page:not(.narrative-page-exiting)',
        ) as HTMLElement | null;

        if (oldPage) {
          oldPage.classList.add('narrative-page-exiting');
          oldPage.addEventListener('animationend', () => oldPage.remove(), { once: true });
          newPage.classList.add('narrative-page-entering');
          scroll.appendChild(newPage);
          setTimeout(() => {
            newPage.classList.remove('narrative-page-entering');
            newPage.classList.add('narrative-page-visible');
          }, 150);
        } else {
          newPage.classList.add('narrative-page-visible');
          scroll.appendChild(newPage);
        }
      },

      appendEntry(entry: NarrativeEntry) {
        const scroll = scrollRef.current;
        if (!scroll) return;

        let page = scroll.querySelector(
          '.narrative-page:not(.narrative-page-exiting)',
        ) as HTMLElement | null;
        if (!page) {
          page = document.createElement('div');
          page.className = 'narrative-page narrative-page-visible';
          scroll.appendChild(page);
        }

        const el = createEntryElement(entry);
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        page.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
        requestAnimationFrame(() => {
          scroll.scrollTop = scroll.scrollHeight;
        });
      },

      scrollToTop() {
        const scroll = scrollRef.current;
        if (scroll) {
          requestAnimationFrame(() => {
            scroll.scrollTop = 0;
          });
        }
      },

      scrollToBottom() {
        const scroll = scrollRef.current;
        if (scroll) {
          requestAnimationFrame(() => {
            scroll.scrollTop = scroll.scrollHeight;
          });
        }
      },
    }));

    return <div className="narrative-scroll" id="narrative-scroll" ref={scrollRef} />;
  },
);
