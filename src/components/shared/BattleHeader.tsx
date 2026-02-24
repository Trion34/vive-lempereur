import React from 'react';
import type { BattleState } from '../../types';
import { BattlePhase } from '../../types';

interface BattleHeaderProps {
  battleState: BattleState;
  onJournalClick: () => void;
  onCharacterClick: () => void;
  onInventoryClick: () => void;
  onSettingsClick: () => void;
  onRestartClick: () => void;
}

const STORY_LABELS: Record<number, string> = {
  1: 'THE BATTERY',
  2: "MASS\u00c9NA'S ARRIVAL",
  3: 'THE GORGE',
  4: 'THE AFTERMATH',
  5: 'THE WOUNDED SERGEANT',
  6: 'FIX BAYONETS',
};

const ENCOUNTER_TITLES: Record<number, string> = {
  1: 'The Overrun Battery',
  2: "Mass\u00e9na's Division",
  3: 'The Counterattack',
  4: 'The Aftermath',
  5: 'The Wounded Sergeant',
  6: 'Fix Bayonets',
};

function getPhaseLabel(bs: BattleState): string {
  if (bs.phase === BattlePhase.StoryBeat) {
    return STORY_LABELS[bs.chargeEncounter] || 'STORY BEAT';
  }
  if (bs.phase === BattlePhase.Line) {
    return bs.battlePart === 3
      ? 'PHASE 4: THE GORGE'
      : bs.battlePart === 2
        ? 'PHASE 3: HOLD THE LINE'
        : 'PHASE 1: THE LINE';
  }
  if (bs.phase === BattlePhase.Melee) {
    return bs.meleeStage === 2 ? 'THE BATTERY CHARGE' : 'PHASE 2: MELEE';
  }
  return bs.phase.toUpperCase();
}

function getVolleyInfo(bs: BattleState): string {
  if (bs.scriptedVolley < 1) return '';
  const maxVolley = bs.battlePart === 3 ? 11 : bs.battlePart === 2 ? 7 : 4;
  return ` \u2014 Volley ${bs.scriptedVolley} of ${maxVolley}`;
}

export function BattleHeader({
  battleState,
  onJournalClick,
  onCharacterClick,
  onInventoryClick,
  onSettingsClick,
  onRestartClick,
}: BattleHeaderProps) {
  const phaseLabel = getPhaseLabel(battleState);
  const volleyInfo = getVolleyInfo(battleState);

  return (
    <header className="battle-header">
      <div className="header-left">
        <span className="phase-label" id="phase-label">
          {phaseLabel}
          {volleyInfo}
        </span>
        <span className="turn-counter" id="turn-counter">
          Turn {battleState.turn}
        </span>
      </div>
      <div className="header-right">
        <button className="char-btn" id="btn-journal" onClick={onJournalClick} title="Journal">
          Journal
        </button>
        <button
          className="char-btn"
          id="btn-character"
          onClick={onCharacterClick}
          title="Character"
        >
          Character
        </button>
        <button
          className="char-btn"
          id="btn-inventory"
          onClick={onInventoryClick}
          title="Inventory"
        >
          Inventory
        </button>
        <button
          className="char-btn"
          id="btn-settings"
          onClick={onSettingsClick}
          title="Settings"
        >
          Settings
        </button>
        <button className="char-btn" id="btn-restart" onClick={onRestartClick} title="Restart">
          Restart
        </button>
      </div>
    </header>
  );
}

export { STORY_LABELS, ENCOUNTER_TITLES };
