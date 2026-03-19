import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DrillStep } from '@game/types';
import type { PreviewConfig, NeighbourConfig } from '../../utils/mockBattleState';
import { PREVIEW_PRESETS } from '../../utils/mockBattleState';
import type { GamePreviewHandle } from './GamePreview';
import type { LineCombatModule } from '../../types/lineCombatTypes';

/* ------------------------------------------------------------------ */
/*  Lab SFX — self-contained, bypasses game settingsStore              */
/*  Two dedicated Audio elements: pre-warmed in gesture context,       */
/*  then reused for all subsequent plays without autoplay issues.      */
/* ------------------------------------------------------------------ */

const VOLLEY_SRC = '/assets/sfx/volley-distant.mp3';
const sfxFriendly = new Audio(VOLLEY_SRC);
const sfxEnemy = new Audio(VOLLEY_SRC);
sfxFriendly.preload = 'auto';
sfxEnemy.preload = 'auto';

/** Call in gesture context (click handler) to unlock both elements */
function warmSfx() {
  sfxFriendly.volume = 0;
  sfxFriendly.play().then(() => sfxFriendly.pause()).catch(() => {});
  sfxEnemy.volume = 0;
  sfxEnemy.play().then(() => sfxEnemy.pause()).catch(() => {});
}

function playVolleySound() {
  sfxFriendly.currentTime = 0;
  sfxFriendly.volume = 0.7;
  sfxFriendly.play().catch(() => {});
}

function playDistantVolleySound() {
  sfxEnemy.currentTime = 0;
  sfxEnemy.volume = 0.4;
  sfxEnemy.play().catch(() => {});
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PreviewControlsProps {
  config: PreviewConfig;
  onChange: (patch: Partial<PreviewConfig>) => void;
  onReset: () => void;
  previewRef: React.RefObject<GamePreviewHandle | null>;
  modules: LineCombatModule[];
}

/* ------------------------------------------------------------------ */
/*  Slider helper                                                      */
/* ------------------------------------------------------------------ */

function Slider({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="lb-ctrl-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
      <span className="lb-ctrl-val">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DRILL_OPTIONS: { value: DrillStep; label: string }[] = [
  { value: DrillStep.Load, label: 'LOAD' },
  { value: DrillStep.Present, label: 'PRESENT' },
  { value: DrillStep.Fire, label: 'FIRE' },
  { value: DrillStep.Endure, label: 'ENDURE' },
];

const MORALE_OPTIONS = ['resolute', 'holding', 'steady', 'shaken', 'wavering', 'breaking'];
const ENEMY_MORALE_OPTIONS = ['advancing', 'steady', 'wavering', 'charging', 'resolute', 'trapped'];
const QUALITY_OPTIONS = ['conscript', 'line', 'veteran', 'guard'];

/* ------------------------------------------------------------------ */
/*  NeighbourToggles helper                                            */
/* ------------------------------------------------------------------ */

function NeighbourToggles({ config, side, onChange }: {
  config: NeighbourConfig | null;
  side: 'leftNeighbour' | 'rightNeighbour';
  onChange: (patch: Partial<PreviewConfig>) => void;
}) {
  if (!config) return null;
  const patch = (field: keyof NeighbourConfig, value: boolean) =>
    onChange({ [side]: { ...config, [field]: value } });
  return (
    <>
      <label className="lb-ctrl-check">
        <input type="checkbox" checked={config.alive}
          onChange={(e) => patch('alive', e.target.checked)} />
        {config.name} alive
      </label>
      <label className="lb-ctrl-check">
        <input type="checkbox" checked={config.wounded}
          onChange={(e) => patch('wounded', e.target.checked)} />
        {config.name} wounded
      </label>
      <label className="lb-ctrl-check">
        <input type="checkbox" checked={config.routing}
          onChange={(e) => patch('routing', e.target.checked)} />
        {config.name} routing
      </label>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  PreviewControls                                                    */
/* ------------------------------------------------------------------ */

export function PreviewControls({
  config, onChange, onReset, previewRef, modules,
}: PreviewControlsProps) {
  const [narrativeText, setNarrativeText] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [volleyIndex, setVolleyIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cancelRef = useRef(false);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) ?? null;
  const volleys = selectedModule?.volleys ?? [];

  // Cancel playback on unmount to prevent stale state updates
  useEffect(() => () => { cancelRef.current = true; }, []);

  const handlePreset = useCallback((key: string) => {
    const preset = PREVIEW_PRESETS[key];
    if (preset) onChange(preset);
  }, [onChange]);

  const handleVolleyFire = useCallback((direction: 'french' | 'austrian') => {
    warmSfx();
    if (direction === 'french') playVolleySound();
    else playDistantVolleySound();
    previewRef.current?.playStreaks(direction);
  }, [previewRef]);

  const handleInjectCrossFade = useCallback(() => {
    if (!narrativeText.trim()) return;
    previewRef.current?.crossFade([{ type: 'narrative', text: narrativeText }]);
  }, [narrativeText, previewRef]);

  const handleInjectAppend = useCallback(() => {
    if (!narrativeText.trim()) return;
    previewRef.current?.appendNarrative({ type: 'narrative', text: narrativeText });
  }, [narrativeText, previewRef]);

  const isGorge = selectedModule?.mode === 'gorge';

  const applyVolley = useCallback(async (idx: number, animate: boolean) => {
    const v = volleys[idx];
    if (!v) return;
    onChange({ range: v.def.range, scriptedVolley: idx + 1 });

    // Narrative: present text
    if (v.narratives.present.trim()) {
      previewRef.current?.crossFade([{ type: 'narrative', text: v.narratives.present }]);
    }

    if (!animate) return;

    // Fire phase: streaks + SFX + fire order
    await new Promise<void>((r) => setTimeout(r, 800));
    if (cancelRef.current) return;
    playVolleySound();
    await previewRef.current?.playStreaks('french');
    if (cancelRef.current) return;
    if (v.narratives.fireOrder.trim()) {
      previewRef.current?.appendNarrative({ type: 'order', text: v.narratives.fireOrder });
    }

    // Endure phase: return fire (standard mode only — gorge has no return fire)
    if (!isGorge) {
      await new Promise<void>((r) => setTimeout(r, 600));
      if (cancelRef.current) return;
      playDistantVolleySound();
      await previewRef.current?.playStreaks('austrian');
      if (cancelRef.current) return;
    }
    if (v.narratives.endure.trim()) {
      previewRef.current?.appendNarrative({ type: 'event', text: v.narratives.endure });
    }
  }, [volleys, isGorge, onChange, previewRef]);

  const handleVolleyStep = useCallback((dir: -1 | 1) => {
    const next = volleyIndex + dir;
    if (next < 0 || next >= volleys.length) return;
    setVolleyIndex(next);
    applyVolley(next, false);
  }, [volleyIndex, volleys.length, applyVolley]);

  const handlePlay = useCallback(async () => {
    if (volleys.length === 0) return;
    warmSfx(); // unlock Audio elements in gesture context
    cancelRef.current = false;
    setPlaying(true);
    for (let i = 0; i < volleys.length; i++) {
      if (cancelRef.current) break;
      setVolleyIndex(i);
      await applyVolley(i, true);
      // Pause between volleys (both paths clear the interval)
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (cancelRef.current) { clearTimeout(timer); clearInterval(check); resolve(); }
        }, 100);
        const timer = setTimeout(() => { clearInterval(check); resolve(); }, 1200);
      });
    }
    if (!cancelRef.current) setPlaying(false);
  }, [volleys, applyVolley]);

  const handleStop = useCallback(() => {
    cancelRef.current = true;
    setPlaying(false);
  }, []);

  const handleModuleChange = useCallback((id: string) => {
    setSelectedModuleId(id || null);
    setVolleyIndex(0);
  }, []);

  return (
    <div className="lb-ui-preview-sidebar">
      {/* Module Playback */}
      <div className="lb-sidebar-section">
        <div className="lb-sidebar-title">Module Playback</div>
        <div className="lb-module-selector">
          <select value={selectedModuleId ?? ''} disabled={playing}
            onChange={(e) => handleModuleChange(e.target.value)}>
            <option value="">-- Select Module --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.volleys.length}v)</option>
            ))}
          </select>
        </div>
        {selectedModule && volleys.length > 0 && (
          <>
            <div className="lb-playback-controls">
              {!playing ? (
                <button className="lb-playback-btn lb-playback-play" onClick={handlePlay}>
                  Play Module
                </button>
              ) : (
                <button className="lb-playback-btn lb-playback-stop" onClick={handleStop}>
                  Stop
                </button>
              )}
            </div>
            {!playing && (
              <div className="lb-volley-stepper">
                <button className="lb-step-btn" disabled={volleyIndex <= 0}
                  onClick={() => handleVolleyStep(-1)}>&laquo; Prev</button>
                <span className="lb-volley-stepper-label">
                  V{volleyIndex + 1} / {volleys.length}
                </span>
                <button className="lb-step-btn" disabled={volleyIndex >= volleys.length - 1}
                  onClick={() => handleVolleyStep(1)}>Next &raquo;</button>
              </div>
            )}
            {playing && (
              <div className="lb-playback-progress">
                <div className="lb-playback-progress-track">
                  <div className="lb-playback-progress-fill" style={{
                    width: `${volleys.length > 0 ? ((volleyIndex + 1) / volleys.length) * 100 : 0}%`,
                  }} />
                </div>
                <span className="lb-playback-progress-label">
                  V{volleyIndex + 1}/{volleys.length}
                </span>
              </div>
            )}
          </>
        )}
        {selectedModule && volleys.length === 0 && (
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic' }}>
            Module has no volleys.
          </div>
        )}
        {!selectedModule && (
          <div style={{ fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic' }}>
            Select a module to play through its volleys.
          </div>
        )}
      </div>

      {/* State Controls */}
      <div className="lb-sidebar-section">
        <div className="lb-sidebar-title">State Controls</div>
        <Slider label="Range" value={config.range} min={25} max={200}
          onChange={(v) => onChange({ range: v })} />
        <Slider label="Integrity" value={config.lineIntegrity} min={0} max={100}
          onChange={(v) => onChange({ lineIntegrity: v })} />
        <Slider label="Morale" value={config.playerMorale} min={0} max={100}
          onChange={(v) => onChange({ playerMorale: v })} />
        <Slider label="Health" value={config.playerHealth} min={0} max={100}
          onChange={(v) => onChange({ playerHealth: v })} />
        <Slider label="Enemy Str" value={config.enemyStrength} min={0} max={100}
          onChange={(v) => onChange({ enemyStrength: v })} />
        <Slider label="Enemy Line" value={config.enemyLineIntegrity} min={0} max={100}
          onChange={(v) => onChange({ enemyLineIntegrity: v })} />

        <div className="lb-ctrl-select">
          <span>Drill Step</span>
          <select value={config.drillStep}
            onChange={(e) => onChange({ drillStep: e.target.value as DrillStep })}>
            {DRILL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="lb-ctrl-select">
          <span>Line Morale</span>
          <select value={config.lineMorale}
            onChange={(e) => onChange({ lineMorale: e.target.value })}>
            {MORALE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="lb-ctrl-select">
          <span>Enemy Morale</span>
          <select value={config.enemyMorale}
            onChange={(e) => onChange({ enemyMorale: e.target.value })}>
            {ENEMY_MORALE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="lb-ctrl-select">
          <span>Quality</span>
          <select value={config.enemyQuality}
            onChange={(e) => onChange({ enemyQuality: e.target.value })}>
            {QUALITY_OPTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      {/* NPC Toggles */}
      <div className="lb-sidebar-section">
        <div className="lb-sidebar-title">NPC / Line</div>
        <label className="lb-ctrl-check">
          <input type="checkbox" checked={config.officerAlive}
            onChange={(e) => onChange({ officerAlive: e.target.checked })} />
          {config.officerName} alive
        </label>
        <label className="lb-ctrl-check">
          <input type="checkbox" checked={config.ncoPresent}
            onChange={(e) => onChange({ ncoPresent: e.target.checked })} />
          NCO present
        </label>
        <NeighbourToggles config={config.leftNeighbour} side="leftNeighbour" onChange={onChange} />
        <NeighbourToggles config={config.rightNeighbour} side="rightNeighbour" onChange={onChange} />
        <label className="lb-ctrl-check">
          <input type="checkbox" checked={config.artillery}
            onChange={(e) => onChange({ artillery: e.target.checked })} />
          Artillery active
        </label>
        <label className="lb-ctrl-check">
          <input type="checkbox" checked={config.cavalryThreat}
            onChange={(e) => onChange({ cavalryThreat: e.target.checked })} />
          Cavalry threat
        </label>
      </div>

      {/* Presets */}
      <div className="lb-sidebar-section">
        <div className="lb-sidebar-title">Presets</div>
        <div className="lb-preset-grid">
          <button className="lb-preset-btn" onClick={() => handlePreset('freshStart')}>Fresh Start</button>
          <button className="lb-preset-btn" onClick={() => handlePreset('crisis')}>Crisis</button>
          <button className="lb-preset-btn" onClick={() => handlePreset('elevatedFire')}>Elevated Fire</button>
          <button className="lb-preset-btn" onClick={() => handlePreset('tutorial')}>Tutorial</button>
        </div>
        <button className="lb-preset-btn" style={{ width: '100%', marginTop: 4 }}
          onClick={onReset}>Reset to Default</button>
      </div>

      {/* Animations */}
      <div className="lb-sidebar-section">
        <div className="lb-sidebar-title">Animations</div>
        <div className="lb-anim-grid">
          <button className="lb-anim-btn" onClick={() => handleVolleyFire('french')}>
            French Volley (streaks + SFX)
          </button>
          <button className="lb-anim-btn" onClick={() => handleVolleyFire('austrian')}>
            Austrian Volley (streaks + SFX)
          </button>
        </div>
      </div>

      {/* Narrative Injection */}
      <div className="lb-sidebar-section">
        <div className="lb-sidebar-title">Narrative</div>
        <input
          className="lb-inject-input"
          type="text"
          placeholder="Inject narrative text..."
          value={narrativeText}
          onChange={(e) => setNarrativeText(e.target.value)}
        />
        <div className="lb-inject-row">
          <button className="lb-inject-btn" onClick={handleInjectCrossFade}>Cross-Fade</button>
          <button className="lb-inject-btn" onClick={handleInjectAppend}>Append</button>
        </div>
      </div>
    </div>
  );
}
