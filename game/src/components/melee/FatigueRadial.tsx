import React from 'react';
import {
  FatigueTier,
  getFatigueTier,
  getFatigueTierFill,
  getFatigueTierColor,
} from '../../types';

// --- Face SVGs per fatigue tier ---

function FaceSvg({ tier }: { tier: FatigueTier }) {
  const head = <circle cx="16" cy="16" r="11" strokeWidth="1.8" />;

  switch (tier) {
    case FatigueTier.Fresh:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {head}
          <circle cx="12" cy="14" r="1.3" fill="currentColor" />
          <circle cx="20" cy="14" r="1.3" fill="currentColor" />
          <path d="M11 20 Q16 24 21 20" strokeWidth="1.6" />
        </svg>
      );
    case FatigueTier.Winded:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {head}
          <line x1="10" y1="12" x2="14" y2="12.5" strokeWidth="1.2" />
          <circle cx="12" cy="14.5" r="1.2" fill="currentColor" />
          <line x1="18" y1="12.5" x2="22" y2="12" strokeWidth="1.2" />
          <circle cx="20" cy="14.5" r="1.2" fill="currentColor" />
          <line x1="12" y1="21" x2="20" y2="21" strokeWidth="1.5" />
        </svg>
      );
    case FatigueTier.Fatigued:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {head}
          <line x1="9.5" y1="13" x2="14.5" y2="14" strokeWidth="1.8" />
          <circle cx="12" cy="15.5" r="1" fill="currentColor" />
          <line x1="17.5" y1="14" x2="22.5" y2="13" strokeWidth="1.8" />
          <circle cx="20" cy="15.5" r="1" fill="currentColor" />
          <path d="M12 22 Q16 19 20 22" strokeWidth="1.5" />
          <path d="M24 8 Q25 11 24 13" strokeWidth="1" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case FatigueTier.Exhausted:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {head}
          <line x1="10" y1="12" x2="14" y2="16" strokeWidth="1.8" />
          <line x1="14" y1="12" x2="10" y2="16" strokeWidth="1.8" />
          <line x1="18" y1="12" x2="22" y2="16" strokeWidth="1.8" />
          <line x1="22" y1="12" x2="18" y2="16" strokeWidth="1.8" />
          <ellipse cx="16" cy="22" rx="3.5" ry="2.5" strokeWidth="1.5" />
          <path d="M24 7 Q25.5 10 24 12.5" strokeWidth="1" fill="currentColor" opacity="0.5" />
          <path d="M26 10 Q27 12 26 14" strokeWidth="0.8" fill="currentColor" opacity="0.4" />
        </svg>
      );
  }
}

interface FatigueRadialProps {
  fatigue: number;
  maxFatigue: number;
  size?: number;
}

export function FatigueRadial({ fatigue, maxFatigue, size = 44 }: FatigueRadialProps) {
  const tier = getFatigueTier(fatigue, maxFatigue);
  const color = getFatigueTierColor(tier);
  const tierFill = getFatigueTierFill(fatigue, maxFatigue);
  const center = size / 2;
  const radius = size / 2 - 5;
  const iconSize = radius * 1.2;
  const iconOffset = center - iconSize / 2;
  const tierLabel = tier.toUpperCase();
  const angle = (tierFill / 100) * 360;
  const pieSize = radius * 2;
  const pieOffset = center - radius;

  return (
    <div className="fatigue-radial-wrap" data-fatigue-radial="">
      <div
        className="fatigue-pie"
        style={{
          width: `${pieSize}px`,
          height: `${pieSize}px`,
          margin: `${pieOffset}px`,
          borderRadius: '50%',
          background: `conic-gradient(from -90deg, ${color} 0deg ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg)`,
          transition: 'background 0.5s ease',
        }}
      />
      <div
        className="fatigue-radial-icon"
        style={{
          top: `${iconOffset}px`,
          left: `${iconOffset}px`,
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          color,
        }}
      >
        <FaceSvg tier={tier} />
      </div>
      <span className="fatigue-radial-tier" style={{ color }}>
        {tierLabel}
      </span>
    </div>
  );
}
