/* ------------------------------------------------------------------ */
/*  SandboxControls — player stat sliders + restart controls           */
/* ------------------------------------------------------------------ */

import React from 'react';
import { setAnimationSpeed } from '@game/hooks/animation/constants';
import type { SandboxPlayerConfig } from '../../utils/encounterConverter';

interface SandboxControlsProps {
  config: SandboxPlayerConfig;
  onChange: (cfg: SandboxPlayerConfig) => void;
  onRestart: () => void;
  onRerollEnemies: () => void;
  collapsed: boolean;
  onToggle: () => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
}

const STAT_SLIDERS: { key: keyof SandboxPlayerConfig; label: string }[] = [
  { key: 'strength', label: 'Strength' },
  { key: 'elan', label: 'Elan' },
  { key: 'musketry', label: 'Musketry' },
  { key: 'valor', label: 'Valor' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'constitution', label: 'Constitution' },
];

const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

export function SandboxControls({
  config, onChange, onRestart, onRerollEnemies, collapsed, onToggle,
  animationSpeed, onAnimationSpeedChange,
}: SandboxControlsProps) {
  return (
    <div className={`sandbox-controls${collapsed ? ' collapsed' : ''}`}>
      <button className="sandbox-controls-toggle" onClick={onToggle}>
        {collapsed ? '\u25B6 Player' : '\u25BC Player Stats'}
      </button>

      {!collapsed && (
        <div className="sandbox-controls-body">
          <label className="sandbox-name-input">
            <span>Name</span>
            <input
              type="text"
              value={config.name}
              onChange={(e) => onChange({ ...config, name: e.target.value })}
            />
          </label>

          {STAT_SLIDERS.map(({ key, label }) => (
            <label key={key} className="lb-slider">
              <span>{label}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={config[key] as number}
                onChange={(e) => onChange({ ...config, [key]: Number(e.target.value) })}
              />
              <span className="lb-slider-val">{config[key]}</span>
            </label>
          ))}

          <div className="sandbox-speed-selector">
            <span className="sandbox-speed-label">Anim Speed</span>
            <div className="sandbox-speed-options">
              {SPEED_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`sandbox-speed-btn${animationSpeed === value ? ' active' : ''}`}
                  onClick={() => {
                    setAnimationSpeed(value);
                    onAnimationSpeedChange(value);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="sandbox-controls-actions">
            <button className="lb-lib-btn" onClick={onRestart}>Restart</button>
            <button className="lb-lib-btn" onClick={onRerollEnemies}>Re-roll Enemies</button>
          </div>
        </div>
      )}
    </div>
  );
}

