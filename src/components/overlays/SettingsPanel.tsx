import React, { useCallback, useState } from 'react';
import { useSettingsStore, type Resolution, type Settings } from '../../stores/settingsStore';
import { setVolume, isMuted, toggleMute } from '../../music';
import { RESOLUTIONS } from '../../utils/resolution';

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
}

type TabId = 'audio' | 'display' | 'gameplay';

function applySettingsToApp(settings: {
  musicVolume: number;
  muted: boolean;
  textSize: Settings['textSize'];
}) {
  // Music volume
  setVolume(settings.musicVolume);

  // Mute sync
  if (settings.muted !== isMuted()) toggleMute();

  // Text size class on game root
  const game = document.getElementById('game');
  if (game) {
    game.classList.remove('text-size-small', 'text-size-large');
    if (settings.textSize === 'small') game.classList.add('text-size-small');
    if (settings.textSize === 'large') game.classList.add('text-size-large');
  }
}

export function SettingsPanel({ visible, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('audio');

  const musicVolume = useSettingsStore((s) => s.musicVolume);
  const sfxVolume = useSettingsStore((s) => s.sfxVolume);
  const muted = useSettingsStore((s) => s.muted);
  const textSize = useSettingsStore((s) => s.textSize);
  const resolution = useSettingsStore((s) => s.resolution);
  const screenShake = useSettingsStore((s) => s.screenShake);
  const autoPlaySpeed = useSettingsStore((s) => s.autoPlaySpeed);
  const autoPauseStoryBeats = useSettingsStore((s) => s.autoPauseStoryBeats);
  const updateSetting = useSettingsStore((s) => s.updateSetting);
  const resetDefaults = useSettingsStore((s) => s.resetDefaults);

  // Music volume
  const handleMusicVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) / 100;
      updateSetting('musicVolume', val);
      applySettingsToApp({ musicVolume: val, muted, textSize });
    },
    [updateSetting, muted, textSize],
  );

  // SFX volume
  const handleSfxVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSetting('sfxVolume', parseInt(e.target.value) / 100);
    },
    [updateSetting],
  );

  // Mute toggle (toggle is "on" when NOT muted)
  const handleMuteToggle = useCallback(() => {
    const newMuted = !muted;
    updateSetting('muted', newMuted);
    applySettingsToApp({ musicVolume, muted: newMuted, textSize });
  }, [updateSetting, muted, musicVolume, textSize]);

  // Resolution
  const handleResolution = useCallback(
    (val: Resolution) => {
      updateSetting('resolution', val);
    },
    [updateSetting],
  );

  // Text size
  const handleTextSize = useCallback(
    (val: Settings['textSize']) => {
      updateSetting('textSize', val);
      applySettingsToApp({ musicVolume, muted, textSize: val });
    },
    [updateSetting, musicVolume, muted],
  );

  // Screen shake
  const handleScreenShake = useCallback(() => {
    updateSetting('screenShake', !screenShake);
  }, [updateSetting, screenShake]);

  // Auto-play speed
  const handleAutoPlaySpeed = useCallback(
    (val: Settings['autoPlaySpeed']) => {
      updateSetting('autoPlaySpeed', val);
    },
    [updateSetting],
  );

  // Pause at story beats
  const handlePauseStory = useCallback(() => {
    updateSetting('autoPauseStoryBeats', !autoPauseStoryBeats);
  }, [updateSetting, autoPauseStoryBeats]);

  // Reset defaults
  const handleReset = useCallback(() => {
    resetDefaults();
    applySettingsToApp({
      musicVolume: 0.3,
      muted: false,
      textSize: 'normal',
    });
  }, [resetDefaults]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('settings-overlay')) {
        onClose();
      }
    },
    [onClose],
  );

  const tabs: { id: TabId; label: string }[] = [
    { id: 'audio', label: 'Audio' },
    { id: 'display', label: 'Display' },
    { id: 'gameplay', label: 'Gameplay' },
  ];

  return (
    <div
      className={`settings-overlay${visible ? ' open' : ''}`}
      id="settings-overlay"
      onClick={handleBackdropClick}
    >
      <div className="settings-panel">
        <h2 className="settings-title">Settings</h2>
        <button className="settings-close" id="settings-close" onClick={onClose}>
          &times;
        </button>

        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab${activeTab === tab.id ? ' active' : ''}`}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Audio */}
        <div
          className={`settings-section${activeTab === 'audio' ? ' active' : ''}`}
          id="settings-audio"
        >
          <div className="settings-row">
            <span className="settings-label">Music Volume</span>
            <div className="settings-slider-wrap">
              <input
                type="range"
                className="settings-slider"
                id="set-music-vol"
                min="0"
                max="100"
                value={Math.round(musicVolume * 100)}
                onChange={handleMusicVolume}
              />
              <span className="settings-slider-val" id="set-music-vol-val">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-label">SFX Volume</span>
            <div className="settings-slider-wrap">
              <input
                type="range"
                className="settings-slider"
                id="set-sfx-vol"
                min="0"
                max="100"
                value={Math.round(sfxVolume * 100)}
                onChange={handleSfxVolume}
              />
              <span className="settings-slider-val" id="set-sfx-vol-val">
                {Math.round(sfxVolume * 100)}%
              </span>
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-label">Master Mute</span>
            <button
              className={`settings-toggle${!muted ? ' on' : ''}`}
              id="set-mute"
              title="Toggle mute"
              onClick={handleMuteToggle}
            />
          </div>
        </div>

        {/* Display */}
        <div
          className={`settings-section${activeTab === 'display' ? ' active' : ''}`}
          id="settings-display"
        >
          <div className="settings-row settings-row-block">
            <span className="settings-label">Resolution</span>
            <div className="settings-resolution-grid" id="set-resolution">
              <div className="settings-res-fixed">
                {RESOLUTIONS.map((r) => (
                  <button
                    key={r.value}
                    className={`settings-res-btn${resolution === r.value ? ' active' : ''}`}
                    data-val={r.value}
                    onClick={() => handleResolution(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-label">Text Size</span>
            <div className="settings-btn-group" id="set-text-size">
              {(['small', 'normal', 'large'] as const).map((val) => (
                <button
                  key={val}
                  data-val={val}
                  className={textSize === val ? 'active' : ''}
                  onClick={() => handleTextSize(val)}
                >
                  {val === 'small' ? 'S' : val === 'normal' ? 'N' : 'L'}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-label">Screen Shake</span>
            <button
              className={`settings-toggle${screenShake ? ' on' : ''}`}
              id="set-screenshake"
              title="Toggle screen shake"
              onClick={handleScreenShake}
            />
          </div>
        </div>

        {/* Gameplay */}
        <div
          className={`settings-section${activeTab === 'gameplay' ? ' active' : ''}`}
          id="settings-gameplay"
        >
          <div className="settings-row">
            <span className="settings-label">Auto-play Speed</span>
            <div className="settings-btn-group" id="set-speed">
              {(['slow', 'normal', 'fast'] as const).map((val) => (
                <button
                  key={val}
                  data-val={val}
                  className={autoPlaySpeed === val ? 'active' : ''}
                  onClick={() => handleAutoPlaySpeed(val)}
                >
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-label">Pause at Story</span>
            <button
              className={`settings-toggle${autoPauseStoryBeats ? ' on' : ''}`}
              id="set-pause-story"
              title="Toggle pause at story beats"
              onClick={handlePauseStory}
            />
          </div>
        </div>

        <button className="settings-reset" id="settings-reset" onClick={handleReset}>
          Reset Defaults
        </button>
      </div>
    </div>
  );
}
