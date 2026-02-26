import React from 'react';
import type { BattleState } from '../../types';
import { BattlePhase } from '../../types';
import {
  RIVOLI_STORY_LABELS,
  RIVOLI_ENCOUNTER_TITLES,
  RIVOLI_PHASE_LABELS,
} from '../../data/battles/rivoli/text';

interface BattleHeaderProps {
  battleState: BattleState;
  onJournalClick: () => void;
  onCharacterClick: () => void;
  onInventoryClick: () => void;
  onSettingsClick: () => void;
  onRestartClick: () => void;
}

function getPhaseLabel(bs: BattleState): string {
  if (bs.phase === BattlePhase.StoryBeat) {
    return RIVOLI_STORY_LABELS[bs.chargeEncounter] || 'STORY BEAT';
  }
  if (bs.phase === BattlePhase.Line) {
    const battlePart = bs.ext.battlePart as number;
    return RIVOLI_PHASE_LABELS.line[battlePart] || 'PHASE 1: THE LINE';
  }
  if (bs.phase === BattlePhase.Melee) {
    const meleeStage = bs.ext.meleeStage as number;
    return RIVOLI_PHASE_LABELS.melee[meleeStage === 2 ? 2 : 1] || 'PHASE 2: MELEE';
  }
  return bs.phase.toUpperCase();
}

function getVolleyInfo(bs: BattleState): string {
  if (bs.scriptedVolley < 1) return '';
  const battlePart = bs.ext.battlePart as number;
  const maxVolley = RIVOLI_PHASE_LABELS.volleyMaxes[battlePart] || 4;
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
