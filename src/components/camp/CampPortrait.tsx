import React from 'react';
import type { PlayerCharacter } from '../../types';

const RANK_LABELS: Record<string, string> = {
  private: 'Private',
  corporal: 'Corporal',
  sergeant: 'Sergeant',
  lieutenant: 'Lieutenant',
  captain: 'Captain',
};

interface CampPortraitProps {
  player: PlayerCharacter;
}

export function CampPortrait({ player }: CampPortraitProps) {
  const graceBadge = player.grace > 0
    ? (player.grace > 1 ? '\u{1F33F}\u{1F33F}' : '\u{1F33F}')
    : null;

  return (
    <div className="camp-portrait-card" id="camp-portrait-card">
      <div className="camp-portrait-wrap">
        <div className="camp-portrait" />
        {graceBadge && (
          <span className="grace-badge" id="grace-badge-camp">
            {graceBadge}
          </span>
        )}
      </div>
      <div className="camp-portrait-info">
        <span className="camp-portrait-name" id="camp-portrait-name">
          {player.name}
        </span>
        <span className="camp-portrait-rank" id="camp-portrait-rank">
          {RANK_LABELS[player.rank] || player.rank}
        </span>
      </div>
    </div>
  );
}
