import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { BattleHeader } from '../components/shared/BattleHeader';
import { showSplash, showCinematic } from '../ui/cinematicOverlay';
import type { CinematicHandle } from '../ui/cinematicOverlay';
import { BattleJournal } from '../components/overlays/BattleJournal';
import { CharacterPanel } from '../components/overlays/CharacterPanel';
import { InventoryPanel } from '../components/overlays/InventoryPanel';
import { SettingsPanel } from '../components/overlays/SettingsPanel';

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
  const [activeOverlay, setActiveOverlay] = useState<'journal' | 'character' | 'inventory' | 'settings' | null>(null);

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
    <>
      <BattleHeader
        battleState={battleState}
        onJournalClick={() => setActiveOverlay(activeOverlay === 'journal' ? null : 'journal')}
        onCharacterClick={() => setActiveOverlay(activeOverlay === 'character' ? null : 'character')}
        onInventoryClick={() => setActiveOverlay(activeOverlay === 'inventory' ? null : 'inventory')}
        onSettingsClick={() => setActiveOverlay(activeOverlay === 'settings' ? null : 'settings')}
        onRestartClick={() => {
          if (confirm('Restart the game? All progress will be lost.')) {
            localStorage.removeItem('napoleonic_save');
            window.location.reload();
          }
        }}
      />
      {activeOverlay === 'journal' && (
        <BattleJournal log={battleState.log} visible={true} onClose={() => setActiveOverlay(null)} />
      )}
      {activeOverlay === 'character' && (
        <CharacterPanel player={gameState!.player} battlePlayer={battleState.player} volleysFired={battleState.scriptedVolley - 1} visible={true} onClose={() => setActiveOverlay(null)} />
      )}
      {activeOverlay === 'inventory' && (
        <InventoryPanel player={gameState!.player} battlePlayer={battleState.player} visible={true} onClose={() => setActiveOverlay(null)} />
      )}
      {activeOverlay === 'settings' && (
        <SettingsPanel visible={true} onClose={() => setActiveOverlay(null)} />
      )}
    </>
  );
}
