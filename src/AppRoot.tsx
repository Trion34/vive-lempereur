import React, { useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from './stores/gameStore';
import { useGloryStore } from './stores/gloryStore';
import { useSettingsStore } from './stores/settingsStore';
import { useUiStore } from './stores/uiStore';
import { useProfileStore, type ProfileData } from './stores/profileStore';
import { GamePhase, BattlePhase, CampaignPhase } from './types';
import { ProfilePage } from './pages/ProfilePage';
import { IntroPage } from './pages/IntroPage';
import { CampPage } from './pages/CampPage';
import { LinePage } from './pages/LinePage';
import { MeleePage } from './pages/MeleePage';
import { StoryBeatPage } from './pages/StoryBeatPage';
import { OpeningBeatPage } from './pages/OpeningBeatPage';
import { InterludePage } from './pages/InterludePage';
import { CampaignCompletePage } from './pages/CampaignCompletePage';
import { CreditsScreen } from './components/overlays/CreditsScreen';
import { SettingsPanel } from './components/overlays/SettingsPanel';
import { ensureStarted, switchTrack, isMuted, toggleMute } from './music';
import { DevToolsPanel } from './components/DevToolsPanel';
import { applyResolution } from './utils/resolution';
import { deleteSave } from './core/persistence';
import { BattleConfigProvider } from './contexts/BattleConfigContext';
import { getBattleConfig } from './data/battles/registry';
import './data/battles/rivoli'; // Register Rivoli config on import
import './data/campaigns/italy'; // Register Italy campaign on import

export function AppRoot() {
  const gameState = useGameStore((s) => s.gameState);
  const phase = useGameStore((s) => s.phase);
  const showOpeningBeat = useUiStore((s) => s.showOpeningBeat);
  const showSettings = useUiStore((s) => s.showSettings);
  const showCredits = useUiStore((s) => s.showCredits);
  const resolution = useSettingsStore((s) => s.resolution);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  // Battle config — must be before any conditional returns (Rules of Hooks)
  const currentBattle = gameState?.campaign?.currentBattle?.toLowerCase() ?? 'rivoli';
  const battleConfig = useMemo(() => {
    try { return getBattleConfig(currentBattle); }
    catch { return null; }
  }, [currentBattle]);

  // Apply resolution whenever it changes (including initial load)
  // Also reapply on window resize so viewport-fit zoom stays correct
  useEffect(() => {
    applyResolution(resolution);
    const onResize = () => applyResolution(resolution);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resolution]);

  // Initialize settings + profiles on mount
  useEffect(() => {
    useSettingsStore.getState().loadSettings();
    useProfileStore.getState().loadProfiles();

    // Sync persisted mute state to music module
    const { muted } = useSettingsStore.getState();
    if (muted && !isMuted()) toggleMute();

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

  // ESC toggles settings panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        useUiStore.setState((s) => ({ showSettings: !s.showSettings }));
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Profile selection callback
  const handleProfileSelected = useCallback((profile: ProfileData) => {
    // Unlock audio — the profile page's stopPropagation prevents the
    // document-level click listener from firing, so call explicitly.
    ensureStarted();

    // Load glory from profile
    useGloryStore.getState().loadFromProfile(profile);

    // Try to load existing save, or start new game
    const loaded = useGameStore.getState().loadSavedGame();
    if (!loaded) {
      useGameStore.getState().startNewGame();
    }

    // Update last played
    useProfileStore.getState().updateProfile(profile.id, { lastPlayed: Date.now() });
  }, []);

  // Music management based on phase
  useEffect(() => {
    if (!gameState) return;

    // Campaign-level phases use 'dreams' track
    const cp = gameState.campaign?.phase;
    if (cp === CampaignPhase.Interlude || cp === CampaignPhase.Complete) {
      switchTrack('dreams');
      return;
    }

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

  // If no profile selected, show profile screen
  if (activeProfileId === null) {
    return (
      <>
        <div id="game" className="game phase-profile">
          <ProfilePage onProfileSelected={handleProfileSelected} />
        </div>
        {showSettings && (
          <SettingsPanel visible={true} onClose={() => useUiStore.setState({ showSettings: false })} />
        )}
      </>
    );
  }

  // Determine what to render based on phase
  if (!gameState) {
    return null; // Still initializing
  }

  const battlePhase = gameState.battleState?.phase;
  const campaignPhase = gameState.campaign?.phase;

  let content: React.ReactNode;

  // Campaign phase routing (takes priority for Interlude/Complete)
  if (campaignPhase === CampaignPhase.Interlude) {
    content = (
      <div id="game" className="game phase-interlude">
        <InterludePage />
      </div>
    );
  } else if (campaignPhase === CampaignPhase.Complete) {
    content = (
      <div id="game" className="game phase-complete">
        <CampaignCompletePage />
      </div>
    );
  // Credits screen (takes priority over all other routing)
  } else if (showCredits && gameState.battleState) {
    content = (
      <div id="game" className="game phase-credits">
        <CreditsScreen
          battleState={gameState.battleState}
          gameState={gameState}
          onPlayAgain={() => {
            useUiStore.setState({ showCredits: false });
            deleteSave();
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
    <BattleConfigProvider value={battleConfig}>
      {content}
      {showSettings && (
        <SettingsPanel visible={true} onClose={() => useUiStore.setState({ showSettings: false })} />
      )}
      <DevToolsPanel />
    </BattleConfigProvider>
  );
}
