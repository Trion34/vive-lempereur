import React, { useRef, useImperativeHandle, forwardRef } from 'react';

export interface VolleyAnimationHandle {
  /**
   * Play a volley streak animation. Returns a promise that resolves
   * when the animation is complete (~600ms).
   */
  play: (direction: 'french' | 'austrian') => Promise<void>;
}

interface VolleyAnimationProps {
  /** Callback to flash the target block in the panorama */
  onFlashBlock?: (target: 'french' | 'austrian', flashCls: string) => void;
}

/**
 * VolleyAnimation renders streak effects inside the panorama's #volley-streaks container.
 * It uses direct DOM manipulation for performance (6-11 animated divs created/destroyed rapidly).
 */
export const VolleyAnimation = forwardRef<VolleyAnimationHandle, VolleyAnimationProps>(
  function VolleyAnimation({ onFlashBlock }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      play(direction: 'french' | 'austrian'): Promise<void> {
        return new Promise((resolve) => {
          // Use the #volley-streaks container inside the panorama (rendered by Panorama.tsx)
          const container =
            containerRef.current || document.getElementById('volley-streaks');
          if (!container) {
            resolve();
            return;
          }

          const count = 6 + Math.floor(Math.random() * 5);
          const cls = direction === 'french' ? 'french-fire' : 'austrian-fire';
          const streaks: HTMLElement[] = [];

          for (let i = 0; i < count; i++) {
            const streak = document.createElement('div');
            streak.className = `volley-streak ${cls}`;
            streak.style.top = `${10 + Math.random() * 80}%`;
            streak.style.animationDelay = `${i * 40 + Math.random() * 60}ms`;
            container.appendChild(streak);
            streaks.push(streak);
          }

          // Flash the target block after 200ms
          setTimeout(() => {
            if (onFlashBlock) {
              const flashCls = direction === 'french' ? 'flash' : 'flash-hit';
              const target = direction === 'french' ? 'austrian' : 'french';
              onFlashBlock(target, flashCls);
            }
          }, 200);

          // Clean up after 600ms
          setTimeout(() => {
            streaks.forEach((s) => s.remove());
            resolve();
          }, 600);
        });
      },
    }));

    // This component doesn't render its own container -- it uses the one in Panorama.
    // But we keep a ref div hidden for potential future use.
    return <div ref={containerRef} style={{ display: 'none' }} />;
  },
);
