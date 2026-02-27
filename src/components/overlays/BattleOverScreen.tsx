import React from 'react';
import type { BattleState } from '../../types';
import type { GameState } from '../../types';
import { WAGON_DAMAGE_CAP } from '../../types';
import { useBattleConfig } from '../../contexts/BattleConfigContext';
import { RIVOLI_OUTCOMES } from '../../data/battles/rivoli/text';
import { RIVOLI_META } from '../../data/battles/rivoli/text';

interface BattleOverScreenProps {
  battleState: BattleState;
  gameState: GameState;
  onRestart: () => void;
  onContinueCredits: () => void;
  onAdvanceCampaign?: () => void;
}

/** Map engine outcome + state to config outcome key */
function getOutcomeKey(outcome: string, phase: string, batteryCharged: boolean): string {
  if (outcome === 'defeat') {
    return phase === 'melee' || phase === 'storybeat' ? 'defeat_melee' : 'defeat_line';
  }
  if (outcome === 'part1_complete') {
    return batteryCharged ? 'part1_complete_charged' : 'part1_complete_uncharged';
  }
  return outcome;
}

function formatParagraphs(text: string): React.ReactNode[] {
  return text.split('\n\n').map((p, i) => <p key={i}>{p}</p>);
}

export function BattleOverScreen({
  battleState,
  gameState,
  onRestart,
  onContinueCredits,
  onAdvanceCampaign,
}: BattleOverScreenProps) {
  const battleConfig = useBattleConfig();
  if (!battleState.battleOver) return null;

  const name = battleState.player.name;
  const outcome = battleState.outcome;
  const isGorgeVictory = outcome === 'gorge_victory';
  const isVictory = outcome === 'victory' || outcome === 'gorge_victory' || outcome === 'part1_complete';

  const outcomes = battleConfig?.outcomes ?? RIVOLI_OUTCOMES;
  const meta = battleConfig?.meta ?? RIVOLI_META;
  const outcomeKey = getOutcomeKey(outcome, battleState.phase, battleState.ext.batteryCharged);
  const outcomeConfig = outcomes[outcomeKey];

  const title = outcomeConfig ? `${name} \u2014 ${outcomeConfig.title}` : 'Battle Over';
  const endText = outcomeConfig
    ? typeof outcomeConfig.narrative === 'function'
      ? outcomeConfig.narrative(battleState)
      : outcomeConfig.narrative
    : '';

  const meleeKills = battleState.meleeState?.killCount || 0;

  const gorgeStats =
    outcome === 'gorge_victory'
      ? `Wagon detonated: ${battleState.ext.wagonDamage >= WAGON_DAMAGE_CAP ? 'Yes' : 'No'}\nMercy shown: ${battleState.ext.gorgeMercyCount} time${battleState.ext.gorgeMercyCount !== 1 ? 's' : ''}`
      : '';

  return (
    <div className="battle-over-overlay" id="battle-over">
      <div className="battle-over-content">
        <h2 id="battle-over-title">
          {title}
        </h2>
        {formatParagraphs(endText)}

        <div
          className="battle-stats"
          id="battle-stats"
          style={{ display: isGorgeVictory ? 'none' : '' }}
          dangerouslySetInnerHTML={{
            __html: `
              Turns survived: ${battleState.turn}<br>
              Final morale: ${Math.round(battleState.player.morale)} (${battleState.player.moraleThreshold})<br>
              Valor: ${battleState.player.valor}<br>
              Health: ${Math.round(battleState.player.health)}% | Stamina: ${Math.round(battleState.player.stamina)}%<br>
              Volleys fired: ${battleState.volleysFired}<br>
              ${meleeKills > 0 ? `Melee kills: ${meleeKills}<br>` : ''}
              ${gorgeStats ? gorgeStats.split('\n').map((l) => `${l}<br>`).join('') : ''}
              Enemy strength: ${Math.round(battleState.enemy.strength)}%<br>
              Line integrity: ${Math.round(battleState.line.lineIntegrity)}%<br>
            `,
          }}
        />

        {meta.historicalNote && (
          <div
            className="historical-note"
            id="historical-note"
            style={{ display: isGorgeVictory ? 'none' : '' }}
          >
            <hr className="historical-divider" />
            <p className="historical-title">Historical Note</p>
            <p>{meta.historicalNote}</p>
          </div>
        )}

        <div className="battle-over-buttons">
          {isVictory && onAdvanceCampaign && !isGorgeVictory && (
            <button
              className="btn-restart"
              id="btn-march-on"
              onClick={onAdvanceCampaign}
            >
              March On
            </button>
          )}
          <button
            className="btn-restart"
            id="btn-restart"
            style={{ display: isGorgeVictory ? 'none' : '' }}
            onClick={onRestart}
          >
            Restart
          </button>
          <button
            className="btn-restart"
            id="btn-continue-credits"
            style={{ display: isGorgeVictory ? 'inline-block' : 'none' }}
            onClick={onAdvanceCampaign ?? onContinueCredits}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
