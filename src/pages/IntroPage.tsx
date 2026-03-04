import React, { useEffect } from 'react';
import { StatsStep } from '../components/intro/StatsStep';

export function IntroPage() {
  // Initialize test screen on mount (dev only — stripped from production build by Vite)
  useEffect(() => {
    if (import.meta.env.MODE !== 'production' && import.meta.env.MODE !== 'test') {
      import('../components/devtools/testScreen').then(({ initTestScreen }) => initTestScreen());
    }
  }, []);

  return (
    <>
    <div className="intro-container" id="intro-container">
      <StatsStep />

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
