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
import { CreditsScreen } from './components/overlays/CreditsScreen';
import { ensureStarted, switchTrack } from './music';
import { DevToolsPanel } from './components/DevToolsPanel';

export function AppRoot() {
  const gameState = useGameStore((s) => s.gameState);
  const phase = useGameStore((s) => s.phase);
  const showOpeningBeat = useUiStore((s) => s.showOpeningBeat);
  const showCredits = useUiStore((s) => s.showCredits);

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

  // DevTools now rendered as React component below

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

  let content: React.ReactNode;

  // Credits screen (takes priority over all other routing)
  if (showCredits && gameState.battleState) {
    content = (
      <div id="game" className="game phase-credits">
        <CreditsScreen
          battleState={gameState.battleState}
          gameState={gameState}
          onPlayAgain={() => {
            useUiStore.setState({ showCredits: false });
            localStorage.removeItem('napoleonic_save');
            window.location.reload();
          }}
        />
      </div>
    );
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Intro) {
    content = (
      <div id="game" className="game phase-intro">
        <IntroPage />
      </div>
    );
  } else if (phase === GamePhase.Camp) {
    content = (
      <div id="game" className="game phase-camp">
        <CampPage />
      </div>
    );
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Line && showOpeningBeat) {
    content = (
      <div id="game" className="game phase-charge">
        <OpeningBeatPage />
      </div>
    );
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.StoryBeat) {
    content = (
      <div id="game" className="game phase-charge">
        <StoryBeatPage />
      </div>
    );
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Melee) {
    content = (
      <div id="game" className="game phase-melee">
        <MeleePage />
      </div>
    );
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Line) {
    content = (
      <div id="game" className="game phase-line">
        <LinePage />
      </div>
    );
  } else {
    content = (
      <div id="game" className="game phase-line">
        <div style={{ padding: '2rem', color: '#eee' }}>
          Phase: {phase} / {battlePhase ?? 'unknown'}
        </div>
      </div>
    );
  }

  return (
    <>
      {content}
      <DevToolsPanel />
    </>
  );
}
