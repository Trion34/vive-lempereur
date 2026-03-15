import React, { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface SplashOverlayProps {
  text: string;
  onProceed: () => void;
}

/**
 * Brief splash overlay with text + "Click to continue".
 * Animates out on click via the cinematic-splash-exit class, then calls onProceed.
 */
export function SplashOverlay({ text, onProceed }: SplashOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const clickedRef = useRef(false);

  const handleClick = useCallback(() => {
    if (clickedRef.current) return;
    clickedRef.current = true;

    const el = overlayRef.current;
    if (!el) {
      onProceed();
      return;
    }

    el.classList.add('cinematic-splash-exit');
    el.addEventListener(
      'animationend',
      () => {
        onProceed();
      },
      { once: true },
    );
  }, [onProceed]);

  return createPortal(
    <div ref={overlayRef} className="cinematic-splash-overlay" onClick={handleClick}>
      <div className="cinematic-splash-text">{text}</div>
      <div className="cinematic-hint">Click to continue</div>
    </div>,
    document.body,
  );
}
