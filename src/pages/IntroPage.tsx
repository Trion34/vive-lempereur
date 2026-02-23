import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NameStep } from '../components/intro/NameStep';
import { StatsStep } from '../components/intro/StatsStep';
import { useGameStore } from '../stores/gameStore';
import { useGloryStore } from '../stores/gloryStore';
import { SettingsPanel } from '../components/overlays/SettingsPanel';

const MASCOT_IMAGES = [
  '/assets/mascot.png',
  '/assets/mascot-2.png',
  '/assets/mascot-3.png',
  '/assets/mascot-4.png',
  '/assets/mascot-5.png',
];

const MASCOT_QUOTES = [
  'Courage is not the absence of fear, but the conquest of it.',
  'Victory belongs to the most persevering.',
  'Impossible is a word found only in the dictionary of fools.',
  'In war, morale is to the physical as three is to one.',
  'Never interrupt your enemy when he is making a mistake.',
  'The battlefield is a scene of constant chaos.',
  'Men are moved by two levers only: fear and self-interest.',
  'He who fears being conquered is sure of defeat.',
  'Death is nothing, but to live defeated is to die daily.',
  'The truest wisdom is a resolute determination.',
  'Ten people who speak make more noise than ten thousand who are silent.',
  'There are only two forces in the world: the sword and the spirit.',
  'A soldier will fight long and hard for a bit of coloured ribbon.',
  'The word impossible is not in my dictionary.',
  'An army marches on its stomach.',
  'There is only one step from the sublime to the ridiculous.',
  'Glory is fleeting, but obscurity is forever.',
  'I am sometimes a fox and sometimes a lion.',
  'History is a set of lies agreed upon.',
  'Ability is nothing without opportunity.',
];

type IntroStep = 'name' | 'stats';

export function IntroPage() {
  const [step, setStep] = useState<IntroStep>('name');
  const [playerName, setPlayerName] = useState('');
  const [bubbleText, setBubbleText] = useState('Vive la France!');
  const [mascotCompact, setMascotCompact] = useState(false);
  const mascotIdxRef = useRef(0);
  const [mascotSrc, setMascotSrc] = useState(MASCOT_IMAGES[0]);
  const [showSettings, setShowSettings] = useState(false);

  const handleNameConfirmed = useCallback((name: string) => {
    // Set the name on both persistent player and battle player
    const gs = useGameStore.getState().gameState;
    if (gs) {
      gs.player.name = name;
      if (gs.battleState) gs.battleState.player.name = name;
    }
    // Fresh glory load and reset spent tracking for new character
    useGloryStore.getState().loadFromStorage();

    setPlayerName(name);
    setBubbleText(`Hi ${name}... Vive la France!`);
    setMascotCompact(true);
    setStep('stats');
  }, []);

  const handleMascotHover = useCallback(() => {
    setBubbleText(MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)]);
  }, []);

  const handleMascotClick = useCallback(() => {
    mascotIdxRef.current = (mascotIdxRef.current + 1) % MASCOT_IMAGES.length;
    setMascotSrc(MASCOT_IMAGES[mascotIdxRef.current]);
  }, []);

  // Initialize test screen on mount (dev only — stripped from production build by Vite)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      import('../testScreen').then(({ initTestScreen }) => initTestScreen());
    }
  }, []);

  return (
    <>
    <div className="intro-container" id="intro-container">
      <div className="intro-mascot-wrap">
        <div className="intro-bubble" id="intro-bubble">
          {bubbleText}
        </div>
        <img
          src={mascotSrc}
          alt="Mascot"
          className={`intro-mascot${mascotCompact ? ' compact' : ''}`}
          id="intro-mascot"
          onMouseEnter={handleMascotHover}
          onClick={handleMascotClick}
        />
      </div>
      <h1 className="intro-title">The Little Soldier</h1>
      <p className="intro-subtitle">A Napoleonic Saga</p>

      {step === 'name' && <NameStep onNameConfirmed={handleNameConfirmed} onSettingsClick={() => setShowSettings(true)} />}
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
    {showSettings && (
      <SettingsPanel visible={true} onClose={() => setShowSettings(false)} />
    )}
    </>
  );
}
