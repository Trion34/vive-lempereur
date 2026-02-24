import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { BattleHeader } from '../components/shared/BattleHeader';
import { STORY_LABELS, ENCOUNTER_TITLES } from '../components/shared/BattleHeader';
import { BattleJournal } from '../components/overlays/BattleJournal';
import { CharacterPanel } from '../components/overlays/CharacterPanel';
import { InventoryPanel } from '../components/overlays/InventoryPanel';
import { useCinematic } from '../hooks/useCinematic';
import type { RollDisplay } from '../hooks/useCinematic';
import { SplashOverlay } from '../components/overlays/SplashOverlay';
import { CinematicOverlay } from '../components/overlays/CinematicOverlay';
import { BattleOverScreen } from '../components/overlays/BattleOverScreen';
import { getChargeEncounter } from '../core/charge';
import { advanceTurn } from '../core/battle';
import { saveGame } from '../core/persistence';
import { switchTrack } from '../music';
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
 * Shows the BattleHeader, triggers a splash then cinematic overlay
 * with encounter data from getChargeEncounter(). Choices trigger handleChargeAction
 * which calls advanceTurn(), shows result text, then transitions to the next phase.
 */
export function StoryBeatPage() {
  const gameState = useGameStore((s) => s.gameState);
  const battleState = gameState?.battleState;
  const launchedRef = useRef(false);
  const setGameState = useGameStore((s) => s.setGameState);
  const [activeOverlay, setActiveOverlay] = useState<'journal' | 'character' | 'inventory' | null>(null);

  const cinematic = useCinematic();
  const handleChargeActionRef = useRef<(choiceId: ChargeChoiceId) => void>(() => {});

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

      let pendingAutoPlayResume = false;
      if (wasWoundedSergeant) {
        pendingAutoPlayResume = true;
      }

      // Grace earned from TakeCommand success
      if (nextState.graceEarned) {
        gameState.player.grace = Math.min(GRACE_CAP, gameState.player.grace + 1);
        nextState.graceEarned = false;
      }

      // Update the game store with new battle state
      const updatedGameState = { ...gameState, battleState: nextState };
      setGameState(updatedGameState);
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

      if (resultNarrative.trim() && cinematic.cinematicRef.current) {
        const resultChunks = resultNarrative.split('\n\n').filter((p) => p.trim());
        const changes: string[] = [];
        if (moraleSummary) changes.push(moraleSummary);

        const rollDisplay = parseRollFromNarrative(resultNarrative);

        cinematic.cinematicRef.current.showResult({
          chunks: resultChunks,
          changes: changes.length > 0 ? changes : undefined,
          rollDisplay: rollDisplay || undefined,
          onContinue: () => {
            cinematic.destroyCinematic();

            // Update UI store
            useUiStore.setState({
              pendingChargeResult: null,
              phaseLogStart: nextState.log.length,
              lastRenderedTurn: -1,
            });

            if (pendingAutoPlayResume) {
              // Wounded Sergeant resolved: set phase to Line and flag for auto-play resume
              nextState.phase = BattlePhase.Line;
              nextState.autoPlayActive = true;
              const resumedGameState = { ...updatedGameState, battleState: nextState };
              setGameState(resumedGameState);
              switchTrack('battle');
              useUiStore.setState({
                pendingAutoPlay: 'resumeVolleys',
                pendingAutoPlayRange: [2, 3],
              });
            } else if (nextState.battlePart === 2 && nextState.phase === BattlePhase.Line) {
              // After Massena: start Part 2 auto-play
              const part2GameState = { ...updatedGameState, battleState: nextState };
              setGameState(part2GameState);
              useUiStore.setState({ pendingAutoPlay: 'part2' });
            } else if (nextState.battlePart === 3 && nextState.phase === BattlePhase.Line) {
              // After Gorge story beat: start Part 3 auto-play
              const part3GameState = { ...updatedGameState, battleState: nextState };
              setGameState(part3GameState);
              useUiStore.setState({ pendingAutoPlay: 'part3' });
            } else {
              // Normal render (melee transition, aftermath, etc.)
              const finalGameState = { ...updatedGameState, battleState: nextState };
              setGameState(finalGameState);
            }
          },
        });
      } else {
        // No result narrative: destroy cinematic and re-render
        cinematic.destroyCinematic();
        const finalGameState = { ...updatedGameState, battleState: nextState };
        setGameState(finalGameState);
      }
    },
    [gameState, battleState, setGameState, cinematic],
  );

  // Keep ref in sync so the useEffect closure always uses the latest handler
  handleChargeActionRef.current = handleChargeAction;

  useEffect(() => {
    if (!battleState) return;
    if (launchedRef.current) return;
    launchedRef.current = true;

    // Destroy any stale cinematic from a previous encounter before launching
    cinematic.destroyCinematic();

    const encounter = getChargeEncounter(battleState);
    const enc = battleState.chargeEncounter;

    cinematic.launchSplash('Fate Beckons...', () => {
      const chunks = encounter.narrative.split('\n\n').filter((p) => p.trim());
      const choices = encounter.choices.map((c) => ({
        id: c.id,
        label: c.label,
        desc: c.description,
      }));

      return {
        title: STORY_LABELS[enc] || 'STORY BEAT',
        subtitle: ENCOUNTER_TITLES[enc] || 'Story Beat',
        chunks,
        choices,
        onChoice: (id) => handleChargeActionRef.current(id as ChargeChoiceId),
      };
    });

    return () => {
      cinematic.destroyCinematic();
      launchedRef.current = false; // Allow re-launch on StrictMode remount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleState?.chargeEncounter]);

  if (!battleState) return null;

  return (
    <>
      <BattleHeader
        battleState={battleState}
        onJournalClick={() => setActiveOverlay(activeOverlay === 'journal' ? null : 'journal')}
        onCharacterClick={() => setActiveOverlay(activeOverlay === 'character' ? null : 'character')}
        onInventoryClick={() => setActiveOverlay(activeOverlay === 'inventory' ? null : 'inventory')}
        onSettingsClick={() => useUiStore.setState({ showSettings: true })}
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
      {/* Cinematic overlays */}
      {cinematic.splashText && <SplashOverlay text={cinematic.splashText} onProceed={cinematic.handleSplashProceed} />}
      {cinematic.cinematicConfig && <CinematicOverlay ref={cinematic.cinematicRef} config={cinematic.cinematicConfig} />}
      {/* Battle over screen (e.g. after Aftermath choice) */}
      {battleState.battleOver && (
        <BattleOverScreen
          battleState={battleState}
          gameState={gameState!}
          onRestart={() => {
            localStorage.removeItem('napoleonic_save');
            window.location.reload();
          }}
          onContinueCredits={() => {
            useUiStore.setState({ showCredits: true });
          }}
        />
      )}
    </>
  );
}
