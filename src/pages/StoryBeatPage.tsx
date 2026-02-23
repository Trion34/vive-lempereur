import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { BattleHeader } from '../components/shared/BattleHeader';
import { STORY_LABELS, ENCOUNTER_TITLES } from '../components/shared/BattleHeader';
import { showSplash, showCinematic } from '../ui/cinematicOverlay';
import type { CinematicHandle, RollDisplay } from '../ui/cinematicOverlay';
import { getChargeEncounter } from '../core/charge';
import { advanceTurn } from '../core/battle';
import { saveGame } from '../core/persistence';
import { switchTrack } from '../music';
import { autoPlayVolleys, autoPlayPart2, autoPlayPart3 } from '../ui/autoPlay';
import { appState } from '../ui/state';
import { BattlePhase, ChargeChoiceId } from '../types';

const GRACE_CAP = 2;

// ============================================================
// HELPERS
// ============================================================

function parseRollFromNarrative(text: string): RollDisplay | null {
  const match = text.match(/\[([^:]+):\s*(\d+)\s*vs\s*(\d+)\s*\u2014\s*(passed|failed)\]/);
  if (!match) return null;
  return {
    stat: match[1].trim(),
    roll: parseInt(match[2], 10),
    target: parseInt(match[3], 10),
    passed: match[4] === 'passed',
  };
}

/**
 * StoryBeatPage — Story beat phase component.
 *
 * Shows the BattleHeader, triggers showSplash("Fate Beckons...") then showCinematic()
 * with encounter data from getChargeEncounter(). Choices trigger handleChargeAction
 * which calls advanceTurn(), shows result text, then transitions to the next phase.
 */
export function StoryBeatPage() {
  const gameState = useGameStore((s) => s.gameState);
  const battleState = gameState?.battleState;
  const cinematicRef = useRef<CinematicHandle | null>(null);
  const launchedRef = useRef(false);
  const setGameState = useGameStore((s) => s.setGameState);

  // Reset launch guard when chargeEncounter changes so new story beats can trigger
  const encounterRef = useRef(battleState?.chargeEncounter);
  if (battleState && battleState.chargeEncounter !== encounterRef.current) {
    encounterRef.current = battleState.chargeEncounter;
    launchedRef.current = false;
  }

  const handleChargeAction = useCallback(
    (choiceId: ChargeChoiceId) => {
      if (!gameState || !battleState) return;
      if (battleState.battleOver) return;

      const prevLogLen = battleState.log.length;
      const wasWoundedSergeant = battleState.chargeEncounter === 5;

      // Advance the turn (produces a new state via structuredClone)
      const nextState = advanceTurn(battleState, choiceId);

      // Sync to appState for imperative auto-play functions
      appState.state = nextState;
      appState.gameState.battleState = nextState;

      let pendingAutoPlayResume = false;
      if (wasWoundedSergeant) {
        pendingAutoPlayResume = true;
      }

      // Grace earned from TakeCommand success
      if (nextState.graceEarned) {
        gameState.player.grace = Math.min(GRACE_CAP, gameState.player.grace + 1);
        nextState.graceEarned = false;
        appState.gameState.battleState = nextState;
      }

      // Update the game store with new battle state
      const updatedGameState = { ...gameState, battleState: nextState };
      setGameState(updatedGameState);
      appState.gameState = updatedGameState;
      saveGame(updatedGameState);

      // Extract result narrative from new log entries
      const newEntries = nextState.log.slice(prevLogLen);
      const resultNarrative = newEntries
        .filter(
          (e) =>
            e.type === 'action' || e.type === 'narrative' || e.type === 'event' || e.type === 'result',
        )
        .map((e) => e.text)
        .join('\n\n');

      const moraleSummary = newEntries
        .filter((e) => e.type === 'morale')
        .map((e) => e.text)
        .join(', ');

      if (resultNarrative.trim() && cinematicRef.current) {
        const resultChunks = resultNarrative.split('\n\n').filter((p) => p.trim());
        const changes: string[] = [];
        if (moraleSummary) changes.push(moraleSummary);

        const rollDisplay = parseRollFromNarrative(resultNarrative);

        cinematicRef.current.showResult({
          chunks: resultChunks,
          changes: changes.length > 0 ? changes : undefined,
          rollDisplay: rollDisplay || undefined,
          onContinue: () => {
            cinematicRef.current = null;

            // Update UI store
            useUiStore.setState({
              pendingChargeResult: null,
              phaseLogStart: nextState.log.length,
              lastRenderedTurn: -1,
            });

            // Also sync appState for imperative code
            appState.phaseLogStart = nextState.log.length;
            appState.lastRenderedTurn = -1;
            appState.pendingChargeResult = null;

            if (pendingAutoPlayResume) {
              // Wounded Sergeant resolved: resume auto-play volleys 3-4
              appState.pendingAutoPlayResume = false;
              appState.processing = true;
              nextState.phase = BattlePhase.Line;
              nextState.autoPlayActive = true;
              appState.state = nextState;
              appState.gameState.battleState = nextState;
              const resumedGameState = { ...updatedGameState, battleState: nextState };
              setGameState(resumedGameState);
              switchTrack('battle');
              autoPlayVolleys(2, 3);
            } else if (nextState.battlePart === 2 && nextState.phase === BattlePhase.Line) {
              // After Massena: start Part 2 auto-play
              const part2GameState = { ...updatedGameState, battleState: nextState };
              setGameState(part2GameState);
              autoPlayPart2();
            } else if (nextState.battlePart === 3 && nextState.phase === BattlePhase.Line) {
              // After Gorge story beat: start Part 3 auto-play
              const part3GameState = { ...updatedGameState, battleState: nextState };
              setGameState(part3GameState);
              autoPlayPart3();
            } else {
              // Normal render (melee transition, aftermath, etc.)
              const finalGameState = { ...updatedGameState, battleState: nextState };
              setGameState(finalGameState);
            }
          },
        });
      } else {
        // No result narrative: destroy cinematic and re-render
        if (cinematicRef.current) {
          cinematicRef.current.destroy();
          cinematicRef.current = null;
        }
        const finalGameState = { ...updatedGameState, battleState: nextState };
        setGameState(finalGameState);
      }
    },
    [gameState, battleState, setGameState],
  );

  useEffect(() => {
    if (!battleState) return;

    // Guard: already showing cinematic or splash
    if (cinematicRef.current) return;
    if (document.querySelector('.cinematic-splash-overlay')) return;
    if (launchedRef.current) return;
    launchedRef.current = true;

    const encounter = getChargeEncounter(battleState);
    const enc = battleState.chargeEncounter;

    showSplash('Fate Beckons...', () => {
      const chunks = encounter.narrative.split('\n\n').filter((p) => p.trim());
      const choices = encounter.choices.map((c) => ({
        id: c.id,
        label: c.label,
        desc: c.description,
      }));

      cinematicRef.current = showCinematic({
        title: STORY_LABELS[enc] || 'STORY BEAT',
        subtitle: ENCOUNTER_TITLES[enc] || 'Story Beat',
        chunks,
        choices,
        onChoice: (id) => handleChargeAction(id as ChargeChoiceId),
      });
    });

    return () => {
      // Cleanup on unmount
      if (cinematicRef.current) {
        cinematicRef.current.destroy();
        cinematicRef.current = null;
      }
    };
  }, [battleState, handleChargeAction]);

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
