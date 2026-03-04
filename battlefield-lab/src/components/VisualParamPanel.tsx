import React from 'react';
import { useLabStore, VOLLEY_STYLES } from '../store/labStore';
import type { VolleyStyle } from '../store/labStore';
import { getRenderer } from '../renderers/registry';
import type { EditableParam } from '../renderers/types';

export function VisualParamPanel() {
  const activeRenderers = useLabStore((s) => s.activeRenderers);
  const visualParams = useLabStore((s) => s.visualParams);
  const setVisualParams = useLabStore((s) => s.setVisualParams);

  const plugin = getRenderer(activeRenderers[0] ?? 'block');

  return (
    <div className="lab-visual-params">
      <h3 className="lab-right-title">Visual Params</h3>

      {/* Global: Animation speed */}
      <div className="lab-state-slider-row">
        <span className="lab-state-slider-label" style={{ width: 70 }}>Speed</span>
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={visualParams.animationSpeed}
          onChange={(e) => setVisualParams({ animationSpeed: Number(e.target.value) })}
        />
        <span className="lab-state-slider-val">{visualParams.animationSpeed}x</span>
      </div>

      {/* Renderer-specific params */}
      {plugin?.editableParams.map((param: EditableParam) => {
        const value = (visualParams as any)[param.key] ?? param.defaultValue;
        return (
          <div key={param.key} className="lab-state-slider-row">
            <span className="lab-state-slider-label" style={{ width: 70 }}>{param.label}</span>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={value}
              onChange={(e) => setVisualParams({ [param.key]: Number(e.target.value) })}
            />
            <span className="lab-state-slider-val">{value}</span>
          </div>
        );
      })}

      {/* Volley style selector */}
      <h3 className="lab-right-title" style={{ marginTop: 12 }}>Volley Style</h3>
      <div className="lab-volley-style-grid">
        {VOLLEY_STYLES.map((style) => (
          <button
            key={style.id}
            className={`lab-volley-style-btn${visualParams.volleyStyle === style.id ? ' active' : ''}`}
            onClick={() => setVisualParams({ volleyStyle: style.id as VolleyStyle })}
            title={style.description}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
