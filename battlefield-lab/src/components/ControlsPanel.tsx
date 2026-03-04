import React, { useState } from 'react';
import type { RendererHandle } from '../renderers/types';
import { ScenarioBar } from './ScenarioBar';
import { RankSelector } from './RankSelector';
import { FxButtonBar } from './FxButtonBar';

interface ControlsPanelProps {
  rendererRef: React.RefObject<RendererHandle | null>;
}

export function ControlsPanel({ rendererRef }: ControlsPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="lab-controls-panel">
      <button className="lab-controls-toggle" onClick={() => setOpen(!open)}>
        {open ? '\u25be' : '\u25b8'} Controls
      </button>
      {open && (
        <div className="lab-controls-body">
          <ScenarioBar />
          <RankSelector />
          <FxButtonBar rendererRef={rendererRef} />
        </div>
      )}
    </div>
  );
}
