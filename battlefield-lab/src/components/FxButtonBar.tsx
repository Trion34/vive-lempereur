import React from 'react';
import type { RendererHandle } from '../renderers/types';
import { useLabStore } from '../store/labStore';

interface FxButtonBarProps {
  rendererRef: React.RefObject<RendererHandle | null>;
}

export function FxButtonBar({ rendererRef }: FxButtonBarProps) {
  const updateEngagement = useLabStore((s) => s.updateEngagement);
  const range = useLabStore((s) => s.engagement.range);

  return (
    <div className="lab-btn-bar">
      <button
        className="lab-btn french"
        onClick={() => rendererRef.current?.playVolley('french')}
      >
        French Volley
      </button>
      <button
        className="lab-btn austrian"
        onClick={() => rendererRef.current?.playVolley('austrian')}
      >
        Austrian Volley
      </button>
      <button
        className="lab-btn"
        onClick={() => {
          const newRange = Math.max(25, range - 20);
          updateEngagement(() => ({ range: newRange }));
          rendererRef.current?.advanceAustrians(newRange);
        }}
      >
        Advance Austrians
      </button>
      <button
        className="lab-btn"
        onClick={() => rendererRef.current?.clearSmoke()}
      >
        Clear Smoke
      </button>
    </div>
  );
}
