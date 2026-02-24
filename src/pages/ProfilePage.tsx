import React, { useState } from 'react';
import { useProfileStore, type ProfileData } from '../stores/profileStore';
import { useUiStore } from '../stores/uiStore';

const SLOT_LABELS = ['I', 'II', 'III'] as const;

function formatDate(timestamp: number | null): string {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ProfileSlotCardProps {
  profile: ProfileData;
  onSelect: () => void;
  onClear: () => void;
}

function ProfileSlotCard({ profile, onSelect, onClear }: ProfileSlotCardProps) {
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
            Select
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

interface ProfilePageProps {
  onProfileSelected: (profile: ProfileData) => void;
}

export function ProfilePage({ onProfileSelected }: ProfilePageProps) {
  const profiles = useProfileStore((s) => s.profiles);
  const selectProfile = useProfileStore((s) => s.selectProfile);
  const resetProfile = useProfileStore((s) => s.resetProfile);

  const handleSelect = (profile: ProfileData) => {
    selectProfile(profile.id);
    onProfileSelected(profile);
  };

  const handleClear = (id: 1 | 2 | 3) => {
    resetProfile(id);
  };

  return (
    <div className="profile-container">
      <button
        className="profile-settings-btn"
        onClick={() => useUiStore.setState({ showSettings: true })}
        title="Settings"
      >
        &#9881;
      </button>

      <h1 className="profile-title">The Little Soldier</h1>
      <p className="profile-subtitle">A Napoleonic Saga</p>

      <div className="profile-slots">
        {profiles.map((profile) => (
          <ProfileSlotCard
            key={profile.id}
            profile={profile}
            onSelect={() => handleSelect(profile)}
            onClear={() => handleClear(profile.id)}
          />
        ))}
      </div>
    </div>
  );
}
