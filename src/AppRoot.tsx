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
import { initDevTools } from './devtools';

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

  // Initialize DevTools (dev mode only)
  useEffect(() => {
    // Create devtools DOM scaffold if it doesn't exist
    if (!document.getElementById('dev-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'dev-overlay';
      overlay.className = 'dev-overlay';
      overlay.style.display = 'none';
      overlay.innerHTML = `
        <div class="dev-panel">
          <div class="dev-header">
            <span>Dev Tools</span>
            <button id="btn-dev-close" class="dev-close">&times;</button>
          </div>
          <div id="dev-tabs" class="dev-tabs"></div>
          <div id="dev-content" class="dev-content"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    initDevTools(
      () => useGameStore.getState().gameState!,
      (gs) => useGameStore.getState().setGameState(gs),
      () => useGameStore.setState({ gameState: { ...useGameStore.getState().gameState! } }),
      () => {
        localStorage.removeItem('napoleonic_save');
        window.location.reload();
      },
    );
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
