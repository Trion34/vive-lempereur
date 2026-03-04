import React, { useState, useCallback, useRef } from 'react';
import { useProfileStore, type ProfileData } from '../stores/profileStore';
import { useUiStore } from '../stores/uiStore';

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

const SLOT_LABELS = ['I', 'II', 'III'] as const;

type MenuView = 'menu' | 'slots';
type SlotMode = 'continue' | 'overwrite';

function formatDate(timestamp: number | null): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

interface SlotCardProps {
  profile: ProfileData;
  mode: SlotMode;
  onSelect: () => void;
  onClear: () => void;
}

function SlotCard({ profile, mode, onSelect, onClear }: SlotCardProps) {
  const [confirming, setConfirming] = useState(false);
  const isEmpty = !profile.playerName && profile.lastPlayed === null;
  const isDev = profile.id === 3;

  return (
    <div className="profile-slot" onClick={onSelect}>
      {isDev && <span className="profile-dev-badge">DEV</span>}
      <div className="profile-slot-number">{SLOT_LABELS[profile.id - 1]}</div>
      <div className={`profile-slot-name${isEmpty ? ' empty' : ''}`}>
        {profile.playerName || 'Empty Slot'}
      </div>
      <div className="profile-slot-glory">
        <span className="glory-icon">&#9733;</span>
        {profile.lifetimeGlory} Glory
      </div>
      <div className="profile-slot-date">
        {formatDate(profile.lastPlayed)}
      </div>

      {confirming ? (
        <div className="profile-confirm-clear" onClick={(e) => e.stopPropagation()}>
          <div className="profile-confirm-text">Clear this profile?</div>
          <div className="profile-confirm-actions">
            <button
              className="profile-confirm-yes"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                setConfirming(false);
              }}
            >
              Yes
            </button>
            <button
              className="profile-confirm-no"
              onClick={(e) => {
                e.stopPropagation();
                setConfirming(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-slot-actions" onClick={(e) => e.stopPropagation()}>
          <button className="profile-select-btn" onClick={onSelect}>
            {mode === 'overwrite' && !isEmpty ? 'Overwrite' : 'Select'}
          </button>
          <button
            className="profile-clear-btn"
            disabled={isEmpty}
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(true);
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

interface MainMenuPageProps {
  onProfileSelected: (profile: ProfileData) => void;
}

export function MainMenuPage({ onProfileSelected }: MainMenuPageProps) {
  const profiles = useProfileStore((s) => s.profiles);
  const selectProfile = useProfileStore((s) => s.selectProfile);
  const resetProfile = useProfileStore((s) => s.resetProfile);

  const [view, setView] = useState<MenuView>('menu');
  const [slotMode, setSlotMode] = useState<SlotMode>('continue');
  const [bubbleText, setBubbleText] = useState('Vive la France!');
  const mascotIdxRef = useRef(0);
  const [mascotSrc, setMascotSrc] = useState(MASCOT_IMAGES[0]);

  const savedProfiles = profiles.filter(p => p.playerName && p.lastPlayed !== null);
  const emptyProfiles = profiles.filter(p => !p.playerName && p.lastPlayed === null);

  const handleMascotHover = useCallback(() => {
    setBubbleText(MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)]);
  }, []);

  const handleMascotClick = useCallback(() => {
    mascotIdxRef.current = (mascotIdxRef.current + 1) % MASCOT_IMAGES.length;
    setMascotSrc(MASCOT_IMAGES[mascotIdxRef.current]);
  }, []);

  const handleSelect = useCallback((profile: ProfileData) => {
    selectProfile(profile.id);
    onProfileSelected(profile);
  }, [selectProfile, onProfileSelected]);

  const handleContinue = useCallback(() => {
    if (savedProfiles.length === 1) {
      handleSelect(savedProfiles[0]);
    } else if (savedProfiles.length >= 2) {
      setSlotMode('continue');
      setView('slots');
    }
  }, [savedProfiles, handleSelect]);

  const handleNewGame = useCallback(() => {
    if (emptyProfiles.length > 0) {
      const slot = emptyProfiles[0];
      resetProfile(slot.id);
      selectProfile(slot.id);
      onProfileSelected(slot);
    } else {
      setSlotMode('overwrite');
      setView('slots');
    }
  }, [emptyProfiles, resetProfile, selectProfile, onProfileSelected]);

  const handleSlotSelect = useCallback((profile: ProfileData) => {
    if (slotMode === 'overwrite') {
      const isEmpty = !profile.playerName && profile.lastPlayed === null;
      if (!isEmpty) {
        resetProfile(profile.id);
      }
    }
    selectProfile(profile.id);
    onProfileSelected(profile);
  }, [slotMode, resetProfile, selectProfile, onProfileSelected]);

  const handleClear = useCallback((id: 1 | 2 | 3) => {
    resetProfile(id);
  }, [resetProfile]);

  const slotsToShow = slotMode === 'continue'
    ? profiles.filter(p => p.playerName && p.lastPlayed !== null)
    : profiles;

  if (view === 'slots') {
    return (
      <div className="profile-container">
        <h2 className="menu-slots-heading">
          {slotMode === 'continue' ? 'Choose a Save' : 'Choose a Slot'}
        </h2>
        <div className="profile-slots">
          {slotsToShow.map((profile) => (
            <SlotCard
              key={profile.id}
              profile={profile}
              mode={slotMode}
              onSelect={() => handleSlotSelect(profile)}
              onClear={() => handleClear(profile.id)}
            />
          ))}
        </div>
        <button className="menu-btn-back" onClick={() => setView('menu')}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="menu-mascot-wrap">
        <div className="menu-bubble">
          {bubbleText}
        </div>
        <img
          src={mascotSrc}
          alt="Mascot"
          className="menu-mascot"
          onMouseEnter={handleMascotHover}
          onClick={handleMascotClick}
        />
      </div>

      <h1 className="profile-title">The Little Soldier</h1>
      <p className="profile-subtitle">A Napoleonic Saga</p>

      <div className="menu-buttons">
        <button
          className="menu-btn menu-btn-continue"
          disabled={savedProfiles.length === 0}
          onClick={handleContinue}
        >
          Continue
        </button>
        <button
          className="menu-btn menu-btn-newgame"
          onClick={handleNewGame}
        >
          New Game
        </button>
        <button
          className="menu-btn menu-btn-settings"
          onClick={() => useUiStore.setState({ showSettings: true })}
        >
          Settings
        </button>
      </div>
    </div>
  );
}
