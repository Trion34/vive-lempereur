import React, { useState, useCallback, useEffect } from 'react';
import { NameStep } from '../components/intro/NameStep';
import { StatsStep } from '../components/intro/StatsStep';
import { useGameStore } from '../stores/gameStore';
import { useGloryStore } from '../stores/gloryStore';
import { useProfileStore } from '../stores/profileStore';

type IntroStep = 'name' | 'stats';

export function IntroPage() {
  const [step, setStep] = useState<IntroStep>('name');
  const [playerName, setPlayerName] = useState('');

  const handleNameConfirmed = useCallback((name: string) => {
    // Set the name on the persistent player character
    const gs = useGameStore.getState().gameState;
    if (gs) {
      gs.player.name = name;
    }
    // Reset glory to lifetime total for a new playthrough
    useGloryStore.getState().resetToLifetime();

    // Update profile with player name
    const profileId = useProfileStore.getState().activeProfileId;
    if (profileId) {
      useProfileStore.getState().updateProfile(profileId, { playerName: name });
    }

    setPlayerName(name);
    setStep('stats');
  }, []);

  // Initialize test screen on mount (dev only — stripped from production build by Vite)
  useEffect(() => {
    if (import.meta.env.MODE !== 'production' && import.meta.env.MODE !== 'test') {
      import('../components/devtools/testScreen').then(({ initTestScreen }) => initTestScreen());
    }
  }, []);

  return (
    <>
    <div className="intro-container" id="intro-container">
      {step === 'name' && <NameStep onNameConfirmed={handleNameConfirmed} />}
      {step === 'stats' && <StatsStep playerName={playerName} />}

      {/* Test Screen button */}
      <button className="intro-mute intro-test-btn" id="btn-test-screen" title="Test Screen">
        &#128295;
      </button>
    </div>

    {/* Test Screen (hidden by default, toggled by initTestScreen) */}
    <div className="test-screen" id="test-screen" style={{ display: 'none' }}>
      <div className="test-header">
        <button className="intro-mute" id="btn-test-back" title="Back to Intro">&larr;</button>
        <h1 className="test-title">Test Screen</h1>
      </div>
      <div className="test-modules" id="test-modules" />
    </div>
    </>
  );
}
