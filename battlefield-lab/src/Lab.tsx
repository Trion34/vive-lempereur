import React, { useCallback, useRef } from 'react';
import type { RendererHandle } from './renderers/types';
import { getRenderer } from './renderers/registry';
import './renderers/BlockRenderer'; // side-effect: self-registers
import { useLabStore, getFormationShapes } from './store/labStore';
import { Formation } from '@src/types';
import { ControlsPanel } from './components/ControlsPanel';
import { DoctrinePicker } from './components/DoctrinePicker';
import { OrderPanel } from './components/OrderPanel';
import { EngagementPanel } from './components/EngagementPanel';
import { VisualParamPanel } from './components/VisualParamPanel';
import { ComparisonView } from './components/ComparisonView';
import { VolleyLog } from './components/VolleyLog';
import { useLabKeyboard } from './components/useLabKeyboard';

export function Lab() {
  const rendererRef = useRef<RendererHandle>(null);
  useLabKeyboard(rendererRef);

  const engagement = useLabStore((s) => s.engagement);
  const frenchFormations = useLabStore((s) => s.frenchFormations);
  const austrianFormations = useLabStore((s) => s.austrianFormations);
  const playerIndex = useLabStore((s) => s.playerIndex);
  const activeRenderers = useLabStore((s) => s.activeRenderers);
  const visualParams = useLabStore((s) => s.visualParams);
  const setEngagement = useLabStore((s) => s.setEngagement);
  const setFrenchFormation = useLabStore((s) => s.setFrenchFormation);
  const setAustrianFormation = useLabStore((s) => s.setAustrianFormation);
  const mode = useLabStore((s) => s.mode);
  const setMode = useLabStore((s) => s.setMode);
  const setActiveRenderers = useLabStore((s) => s.setActiveRenderers);

  const formations = getFormationShapes(frenchFormations, austrianFormations);

  const FORMATION_VALUES = Object.values(Formation) as Formation[];

  const updateEngagement = useLabStore((s) => s.updateEngagement);

  const handleCompanyUpdate = useCallback((side: 'french' | 'austrian', index: number, field: string, value: number) => {
    if (field === 'formation') {
      const formation = FORMATION_VALUES[value];
      if (!formation) return;
      if (side === 'french') {
        setFrenchFormation(index, formation);
      } else {
        setAustrianFormation(index, formation);
      }
      const eng = { ...engagement };
      eng[side] = [...eng[side]] as typeof eng[typeof side];
      eng[side][index] = { ...eng[side][index], formation };
      setEngagement(eng);
    } else if (field === 'quality') {
      const eng = { ...engagement };
      eng[side] = [...eng[side]] as typeof eng[typeof side];
      eng[side][index] = { ...eng[side][index], quality: value };
      setEngagement(eng);
    } else if (field === 'strength' || field === 'integrity') {
      const eng = { ...engagement };
      eng[side] = [...eng[side]] as typeof eng[typeof side];
      eng[side][index] = { ...eng[side][index], [field]: value };
      setEngagement(eng);
    } else if (field === 'morale') {
      const eng = { ...engagement };
      eng[side] = [...eng[side]] as typeof eng[typeof side];
      const moraleGrade = value > 70 ? 'resolute' as const
        : value > 50 ? 'steady' as const
        : value > 30 ? 'shaken' as const
        : value > 15 ? 'wavering' as const : 'routing' as const;
      eng[side][index] = { ...eng[side][index], morale: value, moraleGrade };
      setEngagement(eng);
    }
  }, [engagement, setEngagement, setFrenchFormation, setAustrianFormation]);

  const handleRangeUpdate = useCallback((value: number) => {
    updateEngagement(() => ({ range: value }));
  }, [updateEngagement]);

  const activePlugin = getRenderer(activeRenderers[0] ?? 'block');
  const RendererComponent = activePlugin?.Component;

  const toggleMode = () => {
    if (mode === 'single') {
      setMode('comparison');
      // Ensure at least 2 renderers for comparison
      if (activeRenderers.length < 2) {
        setActiveRenderers([...activeRenderers, activeRenderers[0] ?? 'block']);
      }
    } else {
      setMode('single');
    }
  };

  return (
    <div className="lab-root">
      <div className="lab-left">
        {/* Mode toggle + header */}
        <div className="lab-header">
          <span className="lab-header-title">Battlefield Lab</span>
          <button
            className={`lab-btn lab-mode-btn${mode === 'comparison' ? ' active' : ''}`}
            onClick={toggleMode}
          >
            {mode === 'single' ? 'Compare' : 'Single'}
          </button>
        </div>

        {mode === 'single' ? (
          <div className="lab-viewport lab-viewport-wide">
            {RendererComponent && (
              <RendererComponent
                ref={rendererRef}
                engagement={engagement}
                formations={formations}
                playerFormationIndex={playerIndex}
                visualParams={visualParams}
                onCompanyUpdate={handleCompanyUpdate}
                onRangeUpdate={handleRangeUpdate}
              />
            )}
          </div>
        ) : (
          <div className="lab-viewport lab-viewport-wide">
            <ComparisonView
              ref={rendererRef}
              engagement={engagement}
              formations={formations}
              playerFormationIndex={playerIndex}
            />
          </div>
        )}

      </div>

      <div className="lab-right">
        <ControlsPanel rendererRef={rendererRef} />
        <DoctrinePicker />
        <OrderPanel rendererRef={rendererRef} />
        <EngagementPanel rendererRef={rendererRef} />
        <VisualParamPanel />
        <VolleyLog />
      </div>
    </div>
  );
}
