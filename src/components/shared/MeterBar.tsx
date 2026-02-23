import React from 'react';

interface MeterBarProps {
  label: string;
  value: number;
  max: number;
  fillClass: string;
  stateLabel?: string;
  stateClass?: string;
  showMax?: boolean;
  children?: React.ReactNode;
}

export function MeterBar({
  label,
  value,
  max,
  fillClass,
  stateLabel,
  stateClass,
  showMax,
  children,
}: MeterBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="meter-group">
      <div className="meter-label">{label}</div>
      <div className="meter-track">
        <div
          className={`meter-fill ${fillClass}${stateClass ? ` ${stateClass}` : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="meter-info">
        <span className="meter-num">
          {Math.round(value)}
          {showMax && `/${Math.round(max)}`}
        </span>
        {stateLabel && (
          <span className={`meter-state${stateClass ? ` ${stateClass}` : ''}`}>{stateLabel}</span>
        )}
      </div>
      {children}
    </div>
  );
}
