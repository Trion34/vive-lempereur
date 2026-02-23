import React, { useEffect } from 'react';
import { useGameStore } from './stores/gameStore';
import { useGloryStore } from './stores/gloryStore';
import { useSettingsStore } from './stores/settingsStore';
import { useUiStore } from './stores/uiStore';
import { GamePhase, BattlePhase } from './types';
import { IntroPage } from './pages/IntroPage';
import { CampPage } from './pages/CampPage';
import { LinePage } from './pages/LinePage';
import { MeleePage } from './pages/MeleePage';
import { StoryBeatPage } from './pages/StoryBeatPage';
import { OpeningBeatPage } from './pages/OpeningBeatPage';
import { ensureStarted, switchTrack } from './music';

export function AppRoot() {
  const gameState = useGameStore((s) => s.gameState);
  const phase = useGameStore((s) => s.phase);
  const showOpeningBeat = useUiStore((s) => s.showOpeningBeat);

  // Initialize stores on mount
  useEffect(() => {
    useSettingsStore.getState().loadSettings();
    useGloryStore.getState().resetGlory();
    useGloryStore.getState().loadFromStorage();
    useGameStore.getState().startNewGame();
    switchTrack('dreams');
  }, []);

  // Unlock audio on first user interaction
  useEffect(() => {
    const unlock = () => ensureStarted();
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  // Music management based on phase
  useEffect(() => {
    if (!gameState) return;

    if (phase === GamePhase.Camp) {
      switchTrack('dreams');
      return;
    }

    const bs = gameState.battleState;
    if (!bs) {
      switchTrack('dreams');
      return;
    }

    switch (bs.phase) {
      case BattlePhase.Intro:
      case BattlePhase.StoryBeat:
        switchTrack('dreams');
        break;
      case BattlePhase.Line:
        if (showOpeningBeat) switchTrack('dreams');
        else switchTrack('battle');
        break;
      case BattlePhase.Melee:
        switchTrack('battle');
        break;
      default:
        switchTrack('dreams');
    }
  }, [gameState, phase, showOpeningBeat, gameState?.battleState?.phase]);

  // Determine what to render based on phase
  if (!gameState) {
    return null; // Still initializing
  }

  const battlePhase = gameState.battleState?.phase;

  // Intro screen: GamePhase.Battle + BattlePhase.Intro
  if (phase === GamePhase.Battle && battlePhase === BattlePhase.Intro) {
    return (
      <div id="game" className="game phase-intro">
        <IntroPage />
      </div>
    );
  }

  // Camp phase
  if (phase === GamePhase.Camp) {
    return (
      <div id="game" className="game phase-camp">
        <CampPage />
      </div>
    );
  }

  // Opening beat (Line phase but showing cinematic)
  if (phase === GamePhase.Battle && battlePhase === BattlePhase.Line && showOpeningBeat) {
    return (
      <div id="game" className="game phase-charge">
        <OpeningBeatPage />
      </div>
    );
  }

  // Story beat phase
  if (phase === GamePhase.Battle && battlePhase === BattlePhase.StoryBeat) {
    return (
      <div id="game" className="game phase-charge">
        <StoryBeatPage />
      </div>
    );
  }

  // Melee phase
  if (phase === GamePhase.Battle && battlePhase === BattlePhase.Melee) {
    return (
      <div id="game" className="game phase-melee">
        <MeleePage />
      </div>
    );
  }

  // Line phase (default battle)
  if (phase === GamePhase.Battle && battlePhase === BattlePhase.Line) {
    return (
      <div id="game" className="game phase-line">
        <LinePage />
      </div>
    );
  }

  // Fallback
  return (
    <div id="game" className="game phase-line">
      <div style={{ padding: '2rem', color: '#eee' }}>
        Phase: {phase} / {battlePhase ?? 'unknown'}
      </div>
    </div>
  );
}
