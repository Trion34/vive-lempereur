import React from 'react';
import {
  effectiveRange,
  ORDER_INFO,
  DRILL_STEPS,
  DRILL_STEP_INFO,
} from '../engagement';
import type { RendererHandle } from '../renderers/types';
import { useLabStore, MORALE_COLORS, SLOT_LABELS_FR, SLOT_LABELS_AT } from '../store/labStore';
import { startAutoPlay, stopAutoPlay } from '../store/autoPlay';

interface EngagementPanelProps {
  rendererRef: React.RefObject<RendererHandle | null>;
}

export function EngagementPanel({ rendererRef }: EngagementPanelProps) {
  const engagement = useLabStore((s) => s.engagement);
  const isRunning = useLabStore((s) => s.isRunning);
  const reset = useLabStore((s) => s.reset);

  const handleAutoPlay = async () => {
    if (isRunning) {
      stopAutoPlay();
    } else {
      await startAutoPlay(rendererRef);
    }
  };

  const handleReset = () => {
    stopAutoPlay();
    reset();
  };

  return (
    <div className="lab-engagement-status">
      <h3 className="lab-right-title">Engagement</h3>
      <div className="lab-engagement-header">
        <span>Volley {engagement.volleyCount}</span>
        <span>Base Range: {Math.round(engagement.range)} paces</span>
      </div>

      {/* Drill Step Indicator */}
      <div className="lab-drill-steps">
        {DRILL_STEPS.map((step) => {
          const info = DRILL_STEP_INFO[step];
          const isActive = engagement.drillStep === step;
          const stepIdx = DRILL_STEPS.indexOf(step);
          const currentIdx = engagement.drillStep ? DRILL_STEPS.indexOf(engagement.drillStep) : -1;
          const isDone = currentIdx >= 0 && stepIdx < currentIdx;
          return (
            <div
              key={step}
              className={`lab-drill-step${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
              title={info.description}
            >
              <span className="lab-drill-step-label">{info.label}</span>
            </div>
          );
        })}
      </div>

      <div className="lab-engagement-side">
        <span className="lab-engagement-side-label french">FRENCH</span>
        {engagement.french.map((f, i) => {
          const eRange = effectiveRange(engagement.range, f.rangeOffset, engagement.austrian[i]?.rangeOffset ?? 0);
          return (
            <div key={`eng-fr-${i}`} className="lab-engagement-unit">
              <span className="lab-engagement-unit-label">{SLOT_LABELS_FR[i]}</span>
              <div className="lab-engagement-bar-track">
                <div
                  className="lab-engagement-bar-fill french"
                  style={{ width: `${f.strength}%` }}
                />
              </div>
              <span className="lab-engagement-str">{Math.round(f.strength)}%</span>
              <span
                className="lab-engagement-morale"
                style={{ color: MORALE_COLORS[f.moraleGrade] }}
              >
                {f.moraleGrade}
              </span>
              {f.rangeOffset !== 0 && (
                <span className="lab-engagement-offset">{Math.round(eRange)}p</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="lab-engagement-side">
        <span className="lab-engagement-side-label austrian">AUSTRIAN</span>
        {engagement.austrian.map((f, i) => {
          const eRange = effectiveRange(engagement.range, engagement.french[i]?.rangeOffset ?? 0, f.rangeOffset);
          return (
            <div key={`eng-at-${i}`} className="lab-engagement-unit">
              <span className="lab-engagement-unit-label">{SLOT_LABELS_AT[i]}</span>
              <div className="lab-engagement-bar-track">
                <div
                  className="lab-engagement-bar-fill austrian"
                  style={{ width: `${f.strength}%` }}
                />
              </div>
              <span className="lab-engagement-str">{Math.round(f.strength)}%</span>
              <span
                className="lab-engagement-morale"
                style={{ color: MORALE_COLORS[f.moraleGrade] }}
              >
                {f.moraleGrade}
              </span>
              {f.rangeOffset !== 0 && (
                <span className="lab-engagement-offset">{Math.round(eRange)}p</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Austrian orders readout */}
      {engagement.volleyCount > 0 && (
        <div className="lab-engagement-orders">
          <span className="lab-engagement-orders-label">Last Austrian Orders:</span>
          <div className="lab-engagement-orders-row">
            {engagement.austrian.map((f, i) => (
              <span key={`at-ord-${i}`} className="lab-engagement-order-tag">
                {ORDER_INFO[f.order].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {engagement.winner && (
        <div className="lab-engagement-winner">
          {engagement.winner === 'french' ? 'FRENCH' : 'AUSTRIAN'} VICTORY
        </div>
      )}

      <div className="lab-engagement-controls">
        <button
          className={`lab-btn${isRunning ? ' running' : ''}`}
          onClick={handleAutoPlay}
        >
          {isRunning ? 'Stop' : 'Auto-Play'}
        </button>
        <button
          className="lab-btn"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
