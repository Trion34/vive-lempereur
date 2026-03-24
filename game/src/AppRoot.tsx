import React, { Suspense, lazy, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { useGameStore } from './stores/gameStore';
import { useGloryStore } from './stores/gloryStore';
import { useSettingsStore } from './stores/settingsStore';
import { useUiStore } from './stores/uiStore';
import { useProfileStore, type ProfileData } from './stores/profileStore';
import { GamePhase, BattlePhase, CampaignPhase } from './types';
import { ensureStarted, switchTrack, isMuted, toggleMute } from './music';
import { applyResolution } from './utils/resolution';
import { deleteSave } from './core/persistence';
import { BattleConfigProvider } from './contexts/BattleConfigContext';
import { getBattleConfig } from './data/battles/registry';
import './data/battles/rivoli';
import './data/battles/voltri';
import './data/campaigns/italy';

const MainMenuPage = lazy(async () => {
  const module = await import('./pages/MainMenuPage');
  return { default: module.MainMenuPage };
});

const IntroPage = lazy(async () => {
  const module = await import('./pages/IntroPage');
  return { default: module.IntroPage };
});

const CampPage = lazy(async () => {
  const module = await import('./pages/CampPage');
  return { default: module.CampPage };
});

const LinePage = lazy(async () => {
  const module = await import('./pages/LinePage');
  return { default: module.LinePage };
});

const MeleePage = lazy(async () => {
  const module = await import('./pages/MeleePage');
  return { default: module.MeleePage };
});

const StoryBeatPage = lazy(async () => {
  const module = await import('./pages/StoryBeatPage');
  return { default: module.StoryBeatPage };
});

const OpeningBeatPage = lazy(async () => {
  const module = await import('./pages/OpeningBeatPage');
  return { default: module.OpeningBeatPage };
});

const InterludePage = lazy(async () => {
  const module = await import('./pages/InterludePage');
  return { default: module.InterludePage };
});

const VNPage = lazy(() => import('./pages/VNPage'));

const CampaignCompletePage = lazy(async () => {
  const module = await import('./pages/CampaignCompletePage');
  return { default: module.CampaignCompletePage };
});

const CampaignMapPreviewPage = lazy(async () => {
  const module = await import('./pages/CampaignMapPreviewPage');
  return { default: module.CampaignMapPreviewPage };
});

const CreditsScreen = lazy(async () => {
  const module = await import('./components/overlays/CreditsScreen');
  return { default: module.CreditsScreen };
});

const SettingsPanel = lazy(async () => {
  const module = await import('./components/overlays/SettingsPanel');
  return { default: module.SettingsPanel };
});

const DevToolsPanel = lazy(async () => {
  const module = await import('./components/DevToolsPanel');
  return { default: module.DevToolsPanel };
});

function GameContentFallback() {
  return null;
}

function OverlayFallback() {
  return null;
}

function renderGamePhase(className: string, content: React.ReactNode) {
  return (
    <div id="game" className={className}>
      <Suspense fallback={<GameContentFallback />}>
        {content}
      </Suspense>
    </div>
  );
}

export function AppRoot() {
  const gameState = useGameStore((s) => s.gameState);
  const phase = useGameStore((s) => s.phase);
  const showOpeningBeat = useUiStore((s) => s.showOpeningBeat);
  const showSettings = useUiStore((s) => s.showSettings);
  const showCredits = useUiStore((s) => s.showCredits);
  const resolution = useSettingsStore((s) => s.resolution);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const previewSurface = useMemo(
    () => new URLSearchParams(window.location.search).get('preview'),
    [],
  );

  const currentBattle = gameState?.campaign?.currentBattle?.toLowerCase() ?? null;
  const battleConfig = useMemo(() => {
    if (!currentBattle) return null;
    try { return getBattleConfig(currentBattle); }
    catch { return null; }
  }, [currentBattle]);

  useLayoutEffect(() => {
    applyResolution(resolution);
    const onResize = () => applyResolution(resolution);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resolution, activeProfileId, phase]);

  useEffect(() => {
    useSettingsStore.getState().loadSettings();
    useProfileStore.getState().loadProfiles();

    const { muted } = useSettingsStore.getState();
    if (muted && !isMuted()) toggleMute();

    switchTrack('dreams');
  }, []);

  useEffect(() => {
    const unlock = () => ensureStarted();
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

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

  if (previewSurface === 'campaign-map') {
    return renderGamePhase('game phase-camp', <CampaignMapPreviewPage />);
  }

  const handleProfileSelected = useCallback((profile: ProfileData) => {
    ensureStarted();

    useGloryStore.getState().loadFromProfile(profile);

    const loaded = useGameStore.getState().loadSavedGame();
    if (!loaded) {
      useGameStore.getState().startNewGame();
    }

    useProfileStore.getState().updateProfile(profile.id, { lastPlayed: Date.now() });
  }, []);

  useEffect(() => {
    if (!gameState) return;

    const cp = gameState.campaign?.phase;
    if (cp === CampaignPhase.Interlude || cp === CampaignPhase.VN || cp === CampaignPhase.Complete) {
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

  if (activeProfileId === null) {
    return (
      <>
        {renderGamePhase('game phase-profile', <MainMenuPage onProfileSelected={handleProfileSelected} />)}
        {showSettings && (
          <Suspense fallback={<OverlayFallback />}>
            <SettingsPanel visible={true} onClose={() => useUiStore.setState({ showSettings: false })} />
          </Suspense>
        )}
        <Suspense fallback={<OverlayFallback />}>
          <DevToolsPanel />
        </Suspense>
      </>
    );
  }

  if (!gameState) {
    return null;
  }

  const battlePhase = gameState.battleState?.phase;
  const campaignPhase = gameState.campaign?.phase;

  let content: React.ReactNode;

  if (gameState.needsCharacterCreation) {
    content = renderGamePhase('game phase-intro', <IntroPage />);
  } else if (campaignPhase === CampaignPhase.Interlude) {
    content = renderGamePhase('game phase-interlude', <InterludePage />);
  } else if (campaignPhase === CampaignPhase.VN) {
    content = renderGamePhase('game phase-vn', <VNPage />);
  } else if (campaignPhase === CampaignPhase.Complete) {
    content = renderGamePhase('game phase-complete', <CampaignCompletePage />);
  } else if (showCredits && gameState.battleState) {
    content = renderGamePhase(
      'game phase-credits',
      <CreditsScreen
        battleState={gameState.battleState}
        gameState={gameState}
        onPlayAgain={() => {
          useUiStore.setState({ showCredits: false });
          deleteSave();
          window.location.reload();
        }}
      />,
    );
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Intro) {
    content = renderGamePhase('game phase-intro', <IntroPage />);
  } else if (phase === GamePhase.Camp) {
    content = renderGamePhase('game phase-camp', <CampPage />);
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Line && showOpeningBeat) {
    content = renderGamePhase('game phase-charge', <OpeningBeatPage />);
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.StoryBeat) {
    content = renderGamePhase('game phase-charge', <StoryBeatPage />);
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Melee) {
    content = renderGamePhase('game phase-melee', <MeleePage />);
  } else if (phase === GamePhase.Battle && battlePhase === BattlePhase.Line) {
    content = renderGamePhase('game phase-line', <LinePage />);
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
        <Suspense fallback={<OverlayFallback />}>
          <SettingsPanel visible={true} onClose={() => useUiStore.setState({ showSettings: false })} />
        </Suspense>
      )}
      <Suspense fallback={<OverlayFallback />}>
        <DevToolsPanel />
      </Suspense>
    </BattleConfigProvider>
  );
}
