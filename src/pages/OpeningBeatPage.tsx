import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { BattleHeader } from '../components/shared/BattleHeader';
import { showSplash, showCinematic } from '../ui/cinematicOverlay';
import type { CinematicHandle } from '../ui/cinematicOverlay';

/**
 * OpeningBeatPage — Opening cinematic (battle begins).
 *
 * Shows "Fate Beckons..." splash, then a cinematic with title "BATTLE OF RIVOLI",
 * subtitle "14 January 1797", chunks from the first log entry, and a single choice:
 * "Take your place in the line". On choice: clears showOpeningBeat and transitions
 * to the line phase.
 */
export function OpeningBeatPage() {
  const gameState = useGameStore((s) => s.gameState);
  const battleState = gameState?.battleState;
  const cinematicRef = useRef<CinematicHandle | null>(null);
  const launchedRef = useRef(false);

  useEffect(() => {
    if (!battleState) return;

    // Guard: already showing cinematic or splash
    if (cinematicRef.current) return;
    if (document.querySelector('.cinematic-splash-overlay')) return;
    if (launchedRef.current) return;
    launchedRef.current = true;

    showSplash('Fate Beckons...', () => {
      const openingText = battleState.log[0]?.text || '';
      const chunks = openingText.split('\n\n').filter((p: string) => p.trim());

      cinematicRef.current = showCinematic({
        title: 'BATTLE OF RIVOLI',
        subtitle: '14 January 1797',
        chunks,
        choices: [
          {
            id: 'begin',
            label: 'Take your place in the line',
            desc: 'The drums are rolling. The 14th advances.',
          },
        ],
        onChoice: () => {
          cinematicRef.current?.destroy();
          cinematicRef.current = null;

          // Update UI store
          useUiStore.setState({
            showOpeningBeat: false,
            lastRenderedTurn: -1,
            phaseLogStart: battleState.log.length,
          });
        },
      });
    });

    return () => {
      // Cleanup on unmount
      if (cinematicRef.current) {
        cinematicRef.current.destroy();
        cinematicRef.current = null;
      }
    };
  }, [battleState]);

  if (!battleState) return null;

  return (
    <div id="game" className="game phase-charge">
      <BattleHeader
        battleState={battleState}
        onJournalClick={() => {}}
        onCharacterClick={() => {}}
        onInventoryClick={() => {}}
        onSettingsClick={() => {}}
        onRestartClick={() => {}}
      />
    </div>
  );
}
