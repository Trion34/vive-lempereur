import React, { useState, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useGloryStore } from '../../stores/gloryStore';
import { useProfileStore } from '../../stores/profileStore';
import { getPlayerStat, setPlayerStat } from '../../core/stats';
import { saveGame, saveGlory } from '../../core/persistence';

const GRACE_CAP = 2;
const GRACE_COST = 5;

interface IntroStat {
  key: string;
  label: string;
  section: 'arms' | 'physical' | 'mental' | 'spirit';
  default: number;
  min: number;
  max: number;
  step: number;
}

const INTRO_STATS: IntroStat[] = [
  // Arms (trained military skills)
  { key: 'musketry', label: 'Musketry', section: 'arms', default: 35, min: 20, max: 70, step: 5 },
  { key: 'elan', label: '\u00c9lan', section: 'arms', default: 35, min: 20, max: 70, step: 5 },
  // Physical
  { key: 'strength', label: 'Strength', section: 'physical', default: 40, min: 20, max: 70, step: 5 },
  { key: 'endurance', label: 'Endurance', section: 'physical', default: 40, min: 20, max: 70, step: 5 },
  { key: 'constitution', label: 'Constitution', section: 'physical', default: 45, min: 20, max: 70, step: 5 },
  // Mental
  { key: 'charisma', label: 'Charisma', section: 'mental', default: 30, min: 10, max: 60, step: 5 },
  { key: 'intelligence', label: 'Intelligence', section: 'mental', default: 30, min: 10, max: 60, step: 5 },
  { key: 'awareness', label: 'Awareness', section: 'mental', default: 35, min: 10, max: 60, step: 5 },
  // Spirit
  { key: 'valor', label: 'Valor', section: 'spirit', default: 40, min: 10, max: 80, step: 5 },
];

interface StatsStepProps {
  playerName: string;
}

export function StatsStep({ playerName }: StatsStepProps) {
  const gameState = useGameStore((s) => s.gameState);
  const glory = useGloryStore((s) => s.glory);
  const [glorySpent, setGlorySpent] = useState<Record<string, number>>({});
  // Force re-render when stats change (stats are mutated in-place on gameState.player)
  const [, forceUpdate] = useState(0);

  const player = gameState?.player;

  // Compute stat values directly from the persistent player character
  const getStatVal = useCallback(
    (key: string): number => {
      if (!player) return 0;
      return getPlayerStat(player, key);
    },
    [player],
  );

  const persistGloryToProfile = useCallback((newGlory: number) => {
    const profileId = useProfileStore.getState().activeProfileId;
    if (profileId) {
      useProfileStore.getState().updateProfile(profileId, { currentGlory: newGlory });
    }
  }, []);

  const handleStatChange = useCallback(
    (stat: IntroStat, dir: 1 | -1) => {
      if (!player) return;
      const cur = getPlayerStat(player, stat.key);
      const spent = glorySpent[stat.key] || 0;
      const currentGlory = useGloryStore.getState().glory;

      if (dir === 1) {
        if (currentGlory <= 0 || cur >= stat.max) return;
        const next = currentGlory - 1;
        useGloryStore.setState({ glory: next });
        saveGlory(next);
        persistGloryToProfile(next);
        setGlorySpent((prev) => ({ ...prev, [stat.key]: spent + 1 }));
      } else {
        if (spent <= 0) return;
        const next = currentGlory + 1;
        useGloryStore.setState({ glory: next });
        saveGlory(next);
        persistGloryToProfile(next);
        setGlorySpent((prev) => ({ ...prev, [stat.key]: spent - 1 }));
      }

      setPlayerStat(player, stat.key, cur + dir * stat.step);
      forceUpdate((n) => n + 1);
    },
    [player, glorySpent, persistGloryToProfile],
  );

  const handleBuyGrace = useCallback(() => {
    if (!player) return;
    const currentGlory = useGloryStore.getState().glory;
    if (currentGlory < GRACE_COST || player.grace >= GRACE_CAP) return;
    const next = currentGlory - GRACE_COST;
    useGloryStore.setState({ glory: next });
    saveGlory(next);
    persistGloryToProfile(next);
    player.grace++;
    forceUpdate((n) => n + 1);
  }, [player, persistGloryToProfile]);

  const handleBegin = useCallback(() => {
    if (!gameState || !player) return;

    // Clear character creation flag and proceed to campaign
    gameState.needsCharacterCreation = false;
    saveGame(gameState);

    // Update the Zustand store — campaign starts from its first node
    useGameStore.setState({ gameState: { ...gameState }, phase: gameState.phase });
  }, [gameState, player]);

  if (!player) return null;

  // Group stats by section
  const arms = INTRO_STATS.filter((s) => s.section === 'arms');
  const physical = INTRO_STATS.filter((s) => s.section === 'physical');
  const mental = INTRO_STATS.filter((s) => s.section === 'mental');
  const spirit = INTRO_STATS.filter((s) => s.section === 'spirit');

  // Glory banner state
  const gloryEmpty = glory === 0;
  const gloryHint = gloryEmpty
    ? 'Earned through valorous deeds across campaigns.'
    : 'Each stat increase costs 1 Glory.';

  // Grace banner state
  const graceCount = player.grace;
  const graceFull = graceCount >= GRACE_CAP;
  const canBuyGrace = glory >= GRACE_COST && !graceFull;
  const graceHint = graceFull
    ? 'Grace is full.'
    : glory < GRACE_COST
      ? `Requires ${GRACE_COST} Glory.`
      : 'Divine favour. Spend 5 Glory to gain 1 Grace (max 2).';

  return (
    <div className="intro-step" id="intro-stats-step">
      <h2 className="intro-sheet-title">Character Sheet</h2>
      <p className="intro-player-name" id="intro-player-name">
        {playerName}
      </p>

      {/* Glory Banner */}
      <div className={`glory-banner${gloryEmpty ? ' glory-empty' : ''}`} id="glory-banner">
        <div className="glory-header">
          <span className="glory-icon">&#9733;</span>
          <span className="glory-label">GLORY</span>
          <span className="glory-amount" id="glory-amount">
            {glory}
          </span>
        </div>
        <div className="glory-hint" id="glory-hint">
          {gloryHint}
        </div>
      </div>

      {/* Grace Banner */}
      <div className="grace-banner" id="grace-banner">
        <div className="grace-header">
          <span className="grace-icon">&#127807;</span>
          <span className="grace-label">GRACE</span>
          <span className="grace-count" id="grace-count">
            {graceCount} / {GRACE_CAP}
          </span>
        </div>
        <div className="grace-hint" id="grace-hint">
          {graceHint}
        </div>
        <button
          className="grace-buy-btn"
          id="btn-buy-grace"
          disabled={!canBuyGrace}
          onClick={handleBuyGrace}
        >
          Buy Grace (5 Glory)
        </button>
      </div>

      {/* Rank Select */}
      <div className="intro-rank-select" id="intro-rank-select">
        <span className="intro-rank-label">Rank</span>
        <button className="intro-rank-btn active" data-rank="private">
          Private
        </button>
        <button className="intro-rank-btn" data-rank="officer" disabled title="Coming Soon">
          Officer
        </button>
      </div>

      {/* Stats Grid */}
      <div className="intro-stats" id="intro-stats">
        {/* Arms: centered row above columns */}
        <div className="intro-stat-spirit">
          <div className="intro-stat-section">Arms</div>
          {arms.map((stat) => (
            <StatCell
              key={stat.key}
              stat={stat}
              value={getStatVal(stat.key)}
              spent={glorySpent[stat.key] || 0}
              canIncrease={glory > 0 && getStatVal(stat.key) < stat.max}
              onStatChange={handleStatChange}
            />
          ))}
        </div>

        {/* Physical + Mental in two columns */}
        <div className="intro-stat-columns">
          <div className="intro-stat-col">
            <div className="intro-stat-section">Physical</div>
            {physical.map((stat) => (
              <StatCell
                key={stat.key}
                stat={stat}
                value={getStatVal(stat.key)}
                spent={glorySpent[stat.key] || 0}
                canIncrease={glory > 0 && getStatVal(stat.key) < stat.max}
                onStatChange={handleStatChange}
              />
            ))}
          </div>
          <div className="intro-stat-col">
            <div className="intro-stat-section">Mental</div>
            {mental.map((stat) => (
              <StatCell
                key={stat.key}
                stat={stat}
                value={getStatVal(stat.key)}
                spent={glorySpent[stat.key] || 0}
                canIncrease={glory > 0 && getStatVal(stat.key) < stat.max}
                onStatChange={handleStatChange}
              />
            ))}
          </div>
        </div>

        {/* Spirit: centered row below columns */}
        <div className="intro-stat-spirit">
          <div className="intro-stat-section">Spirit</div>
          {spirit.map((stat) => (
            <StatCell
              key={stat.key}
              stat={stat}
              value={getStatVal(stat.key)}
              spent={glorySpent[stat.key] || 0}
              canIncrease={glory > 0 && getStatVal(stat.key) < stat.max}
              onStatChange={handleStatChange}
            />
          ))}
        </div>
      </div>

      {/* Begin Button */}
      <button className="intro-btn intro-btn-begin" id="btn-intro-begin" onClick={handleBegin}>
        Begin
      </button>
    </div>
  );
}

// --- StatCell sub-component ---

interface StatCellProps {
  stat: IntroStat;
  value: number;
  spent: number;
  canIncrease: boolean;
  onStatChange: (stat: IntroStat, dir: 1 | -1) => void;
}

function StatCell({ stat, value, spent, canIncrease, onStatChange }: StatCellProps) {
  const canDecrease = spent > 0;
  const boostTag =
    spent > 0 ? <span className="glory-tag">+{spent * stat.step}</span> : null;

  return (
    <div className="intro-stat-cell">
      <span className="intro-stat-label">
        {stat.label}
        {boostTag}
      </span>
      <div className="intro-stat-controls">
        <button
          className="intro-stat-btn"
          disabled={!canDecrease}
          onClick={() => onStatChange(stat, -1)}
        >
          -
        </button>
        <span className="intro-stat-val">{value}</span>
        <button
          className="intro-stat-btn"
          disabled={!canIncrease}
          onClick={() => onStatChange(stat, 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
