import React from 'react';
import { FatigueRadial } from './FatigueRadial';

// --- Status icon SVGs ---

const STATUS_SVGS: Record<string, React.ReactNode> = {
  stunned: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1l1.2 3.1L12.5 4l-2.1 2.5L11.5 10 8 8.2 4.5 10l1.1-3.5L3.5 4l3.3.1z" />
      <circle cx="3" cy="13" r="1.2" /><circle cx="13" cy="13" r="1.2" />
    </svg>
  ),
  'arm-injured': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c1-2 2-3 4-4 2-1 4-1 5-3" />
      <path d="M6 4l5 8" strokeDasharray="2 2" />
    </svg>
  ),
  'leg-injured': (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2v5l-2 4v3M9 7l2 4v3" />
      <path d="M4 6l8 6" strokeDasharray="2 2" />
    </svg>
  ),
  dead: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="6" r="4.5" />
      <line x1="5.5" y1="4" x2="7" y2="6" /><line x1="7" y1="4" x2="5.5" y2="6" />
      <line x1="9" y1="4" x2="10.5" y2="6" /><line x1="10.5" y1="4" x2="9" y2="6" />
      <path d="M6 8.5q2 1.5 4 0" />
      <path d="M7 10.5v3M9 10.5v3" />
    </svg>
  ),
  guarding: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="14" x2="14" y2="2" />
      <line x1="14" y1="14" x2="2" y2="2" />
      <line x1="1" y1="13" x2="4" y2="13" /><line x1="12" y1="13" x2="15" y2="13" />
      <line x1="1" y1="3" x2="4" y2="3" /><line x1="12" y1="3" x2="15" y2="3" />
    </svg>
  ),
};

function StatusIcon({ type, tooltip }: { type: string; tooltip: string }) {
  return (
    <span className={`opp-status-tag ${type}`} data-tooltip={tooltip}>
      {STATUS_SVGS[type] || null}
    </span>
  );
}

// --- Art paths ---

const SKIRMISH_ART: Record<string, string> = {
  'is-player': '/assets/player-french.png',
  'is-ally': '/assets/ally-french.png',
  'is-enemy': '/assets/enemy-austrian.png',
};

// --- CombatantCard ---

export interface CombatantCardProps {
  name: string;
  alive: boolean;
  sideClass: 'is-player' | 'is-ally' | 'is-enemy';
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  stunned: boolean;
  armInjured: boolean;
  legInjured: boolean;
  guarding: boolean;
  dataName?: string;
  isTargeted?: boolean;
  oppIndex?: number;
  selectable?: boolean;
  onClick?: () => void;
}

export function CombatantCard({
  name,
  alive,
  sideClass,
  health,
  maxHealth,
  stamina,
  maxStamina,
  fatigue,
  maxFatigue,
  stunned,
  armInjured,
  legInjured,
  guarding,
  dataName,
  isTargeted,
  oppIndex,
  selectable,
  onClick,
}: CombatantCardProps) {
  const shortName = name.split(' \u2014 ')[0];
  const artSrc = SKIRMISH_ART[sideClass] || '';
  const hpPct = Math.max(0, (health / maxHealth) * 100);
  const stPct = Math.max(0, (stamina / maxStamina) * 100);
  const isDead = !alive || health <= 0;

  // Build status tags
  const tags: { type: string; tooltip: string }[] = [];
  if (guarding) tags.push({ type: 'guarding', tooltip: 'Guarding \u2014 Braced for the next attack' });
  if (stunned) tags.push({ type: 'stunned', tooltip: 'Stunned \u2014 Cannot act this turn' });
  if (armInjured) tags.push({ type: 'arm-injured', tooltip: 'Arm Injured \u2014 Hit chance reduced' });
  if (legInjured) tags.push({ type: 'leg-injured', tooltip: 'Leg Injured \u2014 Stamina costs increased' });
  if (isDead) tags.push({ type: 'dead', tooltip: 'Dead' });

  const classNames = [
    'skirmish-card',
    sideClass,
    isDead ? 'is-dead' : '',
    isTargeted ? 'is-targeted' : '',
    selectable ? 'selectable-target' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      data-combatant-name={dataName || name}
      data-opp-index={oppIndex !== undefined ? String(oppIndex) : undefined}
      onClick={selectable ? onClick : undefined}
    >
      <div className="skirmish-card-name">{shortName}</div>
      <div className="skirmish-card-row">
        <div className="skirmish-card-sidebar">
          <div className="skirmish-hud-meter">
            <span className="skirmish-hud-label">HP</span>
            <div className="skirmish-hud-track">
              <div className="skirmish-hud-fill health-fill" style={{ width: `${hpPct}%` }} />
            </div>
            <span className="skirmish-hud-val">{Math.max(0, Math.round(health))}</span>
          </div>
          <div className="skirmish-hud-meter">
            <span className="skirmish-hud-label">ST</span>
            <div className="skirmish-hud-track">
              <div className="skirmish-hud-fill stamina-fill" style={{ width: `${stPct}%` }} />
            </div>
            <span className="skirmish-hud-val">{Math.round(stamina)}</span>
          </div>
          <FatigueRadial fatigue={fatigue} maxFatigue={maxFatigue} size={40} />
        </div>
        <div className="skirmish-card-art-wrap">
          {artSrc && <img src={artSrc} alt={shortName} className="skirmish-card-art" />}
          {tags.length > 0 && (
            <div className="skirmish-card-statuses">
              {tags.map((t) => (
                <StatusIcon key={t.type} type={t.type} tooltip={t.tooltip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Re-export the ENEMY_TYPE_NAMES for use in parent components
export const ENEMY_TYPE_NAMES: Record<string, string> = {
  conscript: 'Conscript',
  line: 'Line Infantry',
  veteran: 'Veteran',
  sergeant: 'Sergeant',
};
