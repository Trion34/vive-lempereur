import React from 'react';
import { useLabStore, ALL_RANKS, TIERS } from '../store/labStore';

export function RankSelector() {
  const selectedRank = useLabStore((s) => s.selectedRank);
  const setSelectedRank = useLabStore((s) => s.setSelectedRank);

  const rankInfo = ALL_RANKS.find(r => r.id === selectedRank)!;
  const currentTier = rankInfo.tier;
  const currentTierInfo = TIERS[currentTier - 1];

  return (
    <div className="lab-rank-bar">
      <div className="lab-tier-tabs">
        {TIERS.map((t) => (
          <button
            key={t.tier}
            className={`lab-tier-tab tier-${t.tier}${currentTier === t.tier ? ' active' : ''}`}
            onClick={() => setSelectedRank(t.ranks[0].id)}
          >
            <span className="lab-tier-tab-num">Tier {t.tier}</span>
            <span className="lab-tier-tab-name">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="lab-rank-row">
        {currentTierInfo.ranks.map((r) => (
          <button
            key={r.id}
            className={`lab-rank-btn tier-${currentTier}${selectedRank === r.id ? ' active' : ''}`}
            onClick={() => setSelectedRank(r.id)}
          >
            <span className="lab-rank-label">{r.label}</span>
            <span className="lab-rank-french">{r.french}</span>
          </button>
        ))}
        <span className="lab-rank-agency">{rankInfo.agency}</span>
      </div>
      <div className={`lab-tier-indicator tier-${currentTier}`}>
        <span className="lab-tier-desc">{currentTierInfo.description}</span>
      </div>
    </div>
  );
}
