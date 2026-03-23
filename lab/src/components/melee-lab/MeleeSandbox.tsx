/* ------------------------------------------------------------------ */
/*  MeleeSandbox — live playable melee encounter from authored data    */
/* ------------------------------------------------------------------ */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { BattleState, CombatantSnapshot } from '@game/types';
import { MeleeStance, MeleeActionId, BodyPart, MoraleThreshold } from '@game/types';
import { getHealthState, getFatigueTier } from '@game/types';
import { SkirmishField } from '@game/components/melee/SkirmishField';
import { FatigueRadial } from '@game/components/melee/FatigueRadial';
import { useMeleeAnimation } from '@game/hooks/useMeleeAnimation';
import { resolveMeleeRound, snapshotOf, getMeleeActions, resetMeleeHistory } from '@game/core/melee';
import { applyMoraleChanges } from '@game/core/morale';
import type { MeleeEncounterModule } from '../../types/meleeLabTypes';
import {
  createSandboxBattleState,
  DEFAULT_PLAYER_CONFIG,
} from '../../utils/encounterConverter';
import type { SandboxPlayerConfig } from '../../utils/encounterConverter';
import { SandboxMeleeActions } from './SandboxMeleeActions';
import { SandboxControls } from './SandboxControls';
import { SettingsPanel } from '@game/components/overlays/SettingsPanel';
import { setAnimationSpeed } from '@game/hooks/animation/constants';

/* ------------------------------------------------------------------ */
/*  Hotkey maps                                                        */
/* ------------------------------------------------------------------ */

const STANCE_HOTKEYS: Record<string, MeleeStance> = {
  '1': MeleeStance.Aggressive,
  '2': MeleeStance.Balanced,
  '3': MeleeStance.Defensive,
};
const BODY_PART_HOTKEYS: Record<string, BodyPart> = {
  '1': BodyPart.Head,
  '2': BodyPart.Torso,
  '3': BodyPart.Arms,
  '4': BodyPart.Legs,
};
const KEY_TO_ACTION: Record<string, MeleeActionId> = {
  Q: MeleeActionId.BayonetThrust,
  W: MeleeActionId.AggressiveLunge,
  E: MeleeActionId.ButtStrike,
  R: MeleeActionId.Feint,
  T: MeleeActionId.Shoot,
  A: MeleeActionId.Guard,
  S: MeleeActionId.Respite,
  D: MeleeActionId.SecondWind,
  F: MeleeActionId.Reload,
};
function needsBodyPartPicker(id: MeleeActionId): boolean {
  return id === MeleeActionId.BayonetThrust || id === MeleeActionId.AggressiveLunge || id === MeleeActionId.Shoot;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface MeleeSandboxProps {
  encounter: MeleeEncounterModule;
  onExit: () => void;
}

/* ------------------------------------------------------------------ */
/*  Combat log panel                                                   */
/* ------------------------------------------------------------------ */

function CombatLog({ entries }: { entries: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="sandbox-combat-log">
      <div className="sandbox-combat-log-title">Combat Log</div>
      <div className="sandbox-combat-log-entries">
        {entries.map((e, i) => (
          <div key={i} className="sandbox-combat-log-entry">{e}</div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Battle-over overlay                                                */
/* ------------------------------------------------------------------ */

function BattleOverOverlay({
  outcome, kills, rounds, onRestart, onExit,
}: { outcome: string; kills: number; rounds: number; onRestart: () => void; onExit: () => void }) {
  const title = outcome === 'victory' ? 'VICTORY'
    : outcome === 'defeat' ? 'DEFEAT'
    : outcome === 'survived' ? 'SURVIVED'
    : 'ENCOUNTER OVER';

  return (
    <div className="sandbox-battle-over-overlay">
      <div className="sandbox-battle-over">
        <div className="sandbox-battle-over-title">{title}</div>
        <div className="sandbox-battle-over-stats">
          {kills} {kills === 1 ? 'kill' : 'kills'} in {rounds} rounds
        </div>
        <div className="sandbox-battle-over-actions">
          <button className="lb-lib-btn" onClick={onRestart}>Restart</button>
          <button className="lb-lib-btn" onClick={onExit}>Back to Editor</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main sandbox component                                             */
/* ------------------------------------------------------------------ */

export function MeleeSandbox({ encounter, onExit }: MeleeSandboxProps) {
  const [playerConfig, setPlayerConfig] = useState<SandboxPlayerConfig>(DEFAULT_PLAYER_CONFIG);
  const [battleState, setBattleState] = useState<BattleState>(() => {
    resetMeleeHistory();
    return createSandboxBattleState(encounter, playerConfig);
  });
  const [processing, setProcessing] = useState(false);
  const [stance, setStance] = useState(MeleeStance.Balanced);
  const [selectedAction, setSelectedAction] = useState<MeleeActionId | null>(null);
  const [showingInventory, setShowingInventory] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(true);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Set animation speed on mount based on tuning, reset on unmount
  useEffect(() => {
    const tuningSpeed = battleState.meleeTuning?.animationSpeedMultiplier ?? 1;
    setAnimationSpeed(tuningSpeed);
    setAnimSpeed(tuningSpeed);
    return () => { setAnimationSpeed(1); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refs for hotkeys
  const battleStateRef = useRef(battleState);
  battleStateRef.current = battleState;
  const processingRef = useRef(processing);
  processingRef.current = processing;
  const stanceRef = useRef(stance);
  stanceRef.current = stance;
  const selectedActionRef = useRef(selectedAction);
  selectedActionRef.current = selectedAction;
  const showingInventoryRef = useRef(showingInventory);
  showingInventoryRef.current = showingInventory;
  const animSpeedRef = useRef(animSpeed);
  animSpeedRef.current = animSpeed;
  const showSettingsRef = useRef(showSettings);
  showSettingsRef.current = showSettings;

  const { animateSkirmishRound, animateReload, floatPlayerDeltas, animatingRef } = useMeleeAnimation();

  const meleeState = battleState.meleeState!;
  const player = battleState.player;

  // ------ Restart / Re-roll ------

  const doRestart = useCallback((cfg: SandboxPlayerConfig) => {
    resetMeleeHistory();
    const fresh = createSandboxBattleState(encounter, cfg);
    setBattleState(fresh);
    battleStateRef.current = fresh;
    setProcessing(false);
    setStance(MeleeStance.Balanced);
    setSelectedAction(null);
    setShowingInventory(false);
    setCombatLog([]);
  }, [encounter]);

  const handleRestart = useCallback(() => doRestart(playerConfig), [doRestart, playerConfig]);

  const handleRerollEnemies = useCallback(() => {
    // Re-roll enemy/ally stats from ranges without resetting player meters
    resetMeleeHistory();
    const fresh = createSandboxBattleState(encounter, playerConfig);
    // Preserve player's current meters from the active fight
    const bs = battleStateRef.current;
    fresh.player = { ...bs.player };
    setBattleState(fresh);
    battleStateRef.current = fresh;
    setProcessing(false);
    setSelectedAction(null);
    setShowingInventory(false);
    setCombatLog((prev) => [...prev, '--- Enemies re-rolled ---']);
  }, [encounter, playerConfig]);

  // ------ Target selection ------

  const handleSelectTarget = useCallback((index: number) => {
    if (processingRef.current) return;
    setBattleState((prev) => {
      const next = { ...prev };
      next.meleeState = { ...prev.meleeState! };
      next.meleeState.playerTargetIndex = index;
      return next;
    });
  }, []);

  // ------ Core action handler ------

  const handleAction = useCallback(async (action: MeleeActionId, bodyPart?: BodyPart) => {
    const bs = battleStateRef.current;
    const ms = bs.meleeState;
    if (!ms || bs.battleOver || processingRef.current) return;

    setProcessing(true);
    setShowingInventory(false);
    setSelectedAction(null);

    const prevMorale = bs.player.morale;
    const prevStamina = bs.player.stamina;
    const prevReloadProgress = ms.reloadProgress;

    // Snapshot ACTIVE combatants before resolution
    const preRoundSnapshot = new Map<string, { snap: CombatantSnapshot; side: string }>();
    preRoundSnapshot.set(bs.player.name, { snap: snapshotOf(bs.player), side: 'player' });
    for (const idx of ms.activeEnemies) {
      const opp = ms.opponents[idx];
      if (opp.health > 0) preRoundSnapshot.set(opp.name, { snap: snapshotOf(opp), side: 'enemy' });
    }
    for (const ally of ms.allies) {
      if (ally.alive && ally.health > 0) preRoundSnapshot.set(ally.name, { snap: snapshotOf(ally), side: 'ally' });
    }

    // Clone and resolve
    const cloned = structuredClone(bs);
    const cMs = cloned.meleeState!;
    if (stanceRef.current) cMs.playerStance = stanceRef.current;

    const result = resolveMeleeRound(cloned, action, bodyPart, cMs.playerTargetIndex);

    // Apply morale
    cloned.pendingMoraleChanges = result.moraleChanges;
    const { newMorale, threshold } = applyMoraleChanges(
      cloned.player.morale, cloned.player.maxMorale,
      cloned.pendingMoraleChanges, cloned.player.valor,
    );
    cloned.player.morale = newMorale;
    cloned.player.moraleThreshold = threshold;

    // Derived state
    cloned.player.healthState = getHealthState(cloned.player.health, cloned.player.maxHealth);
    cloned.player.fatigueTier = getFatigueTier(cloned.player.fatigue, cloned.player.maxFatigue);

    // Battle end
    if (result.battleEnd === 'defeat') {
      cloned.player.alive = false;
      cloned.battleOver = true;
      cloned.outcome = 'defeat';
    } else if (result.battleEnd === 'victory' || result.battleEnd === 'survived' ||
      (!result.battleEnd && cMs.exchangeCount >= cMs.maxExchanges)) {
      cloned.battleOver = true;
      cloned.outcome = result.battleEnd || 'survived';
    }

    // Reset UI state
    cMs.selectingStance = false;
    cMs.selectingTarget = false;
    cMs.selectedAction = undefined;

    // Append to combat log
    const newLogEntries: string[] = [];
    for (const entry of result.log) {
      newLogEntries.push(entry.text);
    }

    setBattleState(cloned);
    battleStateRef.current = cloned;
    setCombatLog((prev) => [...prev, ...newLogEntries]);

    // Reload animation
    if (action === MeleeActionId.Reload) {
      const isSecondHalf = prevReloadProgress === 1;
      await animateReload(isSecondHalf);
    }

    // Animate round log
    const roundLog = cMs.roundLog || [];
    if (roundLog.length > 0) {
      await animateSkirmishRound(roundLog, preRoundSnapshot, cloned);
    }

    // Float aggregate meter changes
    const moraleDelta = Math.round(cloned.player.morale - prevMorale);
    const staminaDelta = Math.round(cloned.player.stamina - prevStamina);
    floatPlayerDeltas(cloned.player.name, moraleDelta, staminaDelta);

    setProcessing(false);
  }, [animateSkirmishRound, animateReload, floatPlayerDeltas]);

  // ------ Flee handler ------

  const handleFlee = useCallback(() => {
    const bs = battleStateRef.current;
    if (!bs.meleeState || processingRef.current) return;
    const cloned = structuredClone(bs);
    cloned.battleOver = true;
    cloned.outcome = 'rout';
    cloned.player.routing = true;
    setBattleState(cloned);
    battleStateRef.current = cloned;
  }, []);

  // ------ Hotkeys ------

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      // Speed control (always active, even during animation)
      if (e.key === '[' || e.key === ']') {
        e.preventDefault();
        const SPEED_STEPS = [0.5, 1, 1.5, 2];
        const currentIdx = SPEED_STEPS.indexOf(animSpeedRef.current);
        const dir = e.key === ']' ? 1 : -1;
        const nextIdx = Math.max(0, Math.min(SPEED_STEPS.length - 1, (currentIdx === -1 ? 1 : currentIdx) + dir));
        const newSpeed = SPEED_STEPS[nextIdx];
        setAnimationSpeed(newSpeed);
        setAnimSpeed(newSpeed);
        return;
      }

      // Escape toggles settings (when no picker/inventory open)
      if (e.key === 'Escape') {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        // If settings is open, close it
        if (showSettingsRef.current) {
          e.preventDefault();
          setShowSettings(false);
          return;
        }
        // If no picker/inventory is active, open settings
        if (!selectedActionRef.current && !showingInventoryRef.current) {
          e.preventDefault();
          setShowSettings(true);
          return;
        }
        // Otherwise fall through to picker/inventory Escape handlers below
      }

      const bs = battleStateRef.current;
      if (!bs.meleeState || bs.battleOver || processingRef.current || animatingRef.current) return;

      const key = e.key.toUpperCase();
      const ms = bs.meleeState;

      // Body part picker active — driven by selectedAction React state, not meleeState
      if (selectedActionRef.current) {
        const bodyPart = BODY_PART_HOTKEYS[key];
        if (bodyPart) {
          e.preventDefault();
          handleAction(selectedActionRef.current, bodyPart);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setSelectedAction(null);
          return;
        }
        return;
      }

      // Inventory active
      if (showingInventoryRef.current) {
        if (key === '1') {
          const canteenLeft = 3 - bs.player.canteenUses;
          if (canteenLeft > 0) {
            e.preventDefault();
            setShowingInventory(false);
            handleAction(MeleeActionId.UseCanteen);
          }
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowingInventory(false);
          return;
        }
        return;
      }

      // Stances
      const newStance = STANCE_HOTKEYS[key];
      if (newStance) {
        e.preventDefault();
        setStance(newStance);
        return;
      }

      // Actions
      const actions = getMeleeActions(bs, stanceRef.current);
      const actionId = KEY_TO_ACTION[key];
      if (actionId) {
        const action = actions.find((a: { id: MeleeActionId; available: boolean }) => a.id === actionId);
        if (!action || !action.available) return;
        e.preventDefault();
        if (needsBodyPartPicker(actionId)) {
          setSelectedAction(actionId);
        } else {
          handleAction(actionId);
        }
        return;
      }

      // Inventory
      if (key === 'I') {
        e.preventDefault();
        setShowingInventory(true);
        return;
      }

      // Flee
      if (key === 'X' && bs.player.moraleThreshold === MoraleThreshold.Breaking) {
        e.preventDefault();
        handleFlee();
      }
    }

    // Tab toggles focus mode (skip when typing in form fields)
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      e.preventDefault();
      setFocusMode((f) => !f);
    }

    document.addEventListener('keydown', handleKey);
    document.addEventListener('keydown', handleTab);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('keydown', handleTab);
    };
  }, [handleAction, handleFlee]);

  // ------ Player stats config change ------

  const handleConfigChange = useCallback((cfg: SandboxPlayerConfig) => {
    setPlayerConfig(cfg);
  }, []);

  // ------ Render ------

  const hpPct = player.maxHealth > 0 ? (player.health / player.maxHealth) * 100 : 0;
  const spPct = player.maxStamina > 0 ? (player.stamina / player.maxStamina) * 100 : 0;
  const mrPct = player.maxMorale > 0 ? (player.morale / player.maxMorale) * 100 : 0;

  const stanceNames: Record<MeleeStance, string> = {
    [MeleeStance.Aggressive]: 'AGGRESSIVE',
    [MeleeStance.Balanced]: 'BALANCED',
    [MeleeStance.Defensive]: 'DEFENSIVE',
  };

  // Momentum pips (v2 only)
  const showMomentum = (battleState.meleeTuning?.momentumEnabled ?? false) && meleeState.playerMomentum > 0;

  const playerStatusTags: React.ReactNode[] = [];
  if (meleeState.playerStunned > 0) {
    playerStatusTags.push(
      <span key="stunned" className="opp-status-tag stunned" data-tooltip="Stunned - Cannot act this turn">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 1l1.2 3.1L12.5 4l-2.1 2.5L11.5 10 8 8.2 4.5 10l1.1-3.5L3.5 4l3.3.1z" />
          <circle cx="3" cy="13" r="1.2" /><circle cx="13" cy="13" r="1.2" />
        </svg>
      </span>,
    );
  }
  if (meleeState.playerRiposte) {
    playerStatusTags.push(
      <span key="riposte" className="opp-status-tag" style={{ borderColor: 'var(--health-high)', color: 'var(--health-high)' }}>
        RIPOSTE
      </span>,
    );
  }
  if (showMomentum) {
    const pips = Array.from({ length: meleeState.playerMomentum }, (_, i) => (
      <span key={`pip-${i}`} className="momentum-pip" />
    ));
    playerStatusTags.push(
      <span key="momentum" className="momentum-pips">
        {pips}
        {meleeState.playerFreeStrikeReady && <span className="momentum-free-label">FREE</span>}
      </span>,
    );
  }

  // Toggle focus-mode class on the lab tool layout (hides the header bar)
  useEffect(() => {
    const toolLayout = document.querySelector('.lab-tool-layout');
    if (focusMode) {
      toolLayout?.classList.add('sandbox-focus-mode');
    } else {
      toolLayout?.classList.remove('sandbox-focus-mode');
    }
    return () => toolLayout?.classList.remove('sandbox-focus-mode');
  }, [focusMode]);

  return (
    <div className={`sandbox-layout${focusMode ? ' sandbox-focus' : ''}`}>
      {/* Left sidebar: controls */}
      {!focusMode && (
        <div className="sandbox-sidebar">
          <div className="sandbox-header-bar">
            <button className="lb-lib-btn" onClick={onExit}>{'\u2190'} Editor</button>
            <span className="sandbox-encounter-name">{encounter.name}</span>
          </div>
          <SandboxControls
            config={playerConfig}
            onChange={handleConfigChange}
            onRestart={handleRestart}
            onRerollEnemies={handleRerollEnemies}
            collapsed={controlsCollapsed}
            onToggle={() => setControlsCollapsed((c) => !c)}
            animationSpeed={animSpeed}
            onAnimationSpeedChange={setAnimSpeed}
          />
          <CombatLog entries={combatLog} />
        </div>
      )}

      {/* Main arena */}
      <div className="sandbox-arena melee-arena">
        <div className="duel-scene">
          <div className="arena-header">
            <span className="arena-round">
              Round {meleeState.exchangeCount} / {meleeState.maxExchanges}
            </span>
            <span className="arena-kills">
              Kills: {meleeState.killCount}
            </span>
            <button
              className="sandbox-focus-toggle"
              onClick={() => setFocusMode((f) => !f)}
              title={focusMode ? 'Show sidebar (Tab)' : 'Focus mode (Tab)'}
            >
              {focusMode ? '\u25C0' : '\u25B6'}
            </button>
          </div>

          <SkirmishField
            meleeState={meleeState}
            player={player}
            onSelectTarget={handleSelectTarget}
          />
        </div>

        {/* Player HUD — IDs must match what useMeleeAnimation expects */}
        <div className="player-hud">
          <div className="hud-stats">
            <div className="combatant-name" id="arena-player-name">{player.name}</div>
            <div className="combatant-meters">
              <div className="arena-meter">
                <span className="arena-meter-label">HP</span>
                <div className="arena-meter-track">
                  <div className="arena-meter-fill health-fill" id="arena-player-hp-bar" style={{ width: `${hpPct}%` }} />
                </div>
                <span className="arena-meter-val" id="arena-player-hp-val">{Math.round(player.health)}</span>
              </div>
              <div className="arena-meter">
                <span className="arena-meter-label">ST</span>
                <div className="arena-meter-track">
                  <div className="arena-meter-fill stamina-fill" id="arena-player-ft-bar" style={{ width: `${spPct}%` }} />
                </div>
                <span className="arena-meter-val" id="arena-player-ft-val">{Math.round(player.stamina)}</span>
              </div>
              <div className="arena-meter">
                <span className="arena-meter-label">MR</span>
                <div className="arena-meter-track">
                  <div className="arena-meter-fill morale-fill" id="arena-player-mr-bar" style={{ width: `${mrPct}%` }} />
                </div>
                <span className="arena-meter-val" id="arena-player-mr-val">{Math.round(player.morale)}</span>
              </div>
            </div>
            <div className="combatant-stance" id="arena-player-stance">{stanceNames[stance]}</div>
            <div className="combatant-statuses" id="arena-player-statuses">{playerStatusTags}</div>
          </div>

          <div className="hud-portrait">
            <div className="portrait-name" id="portrait-name">{player.name}</div>
            <div className="portrait-frame-wrap">
              <div className="portrait-frame">
                <div className="portrait-placeholder" />
              </div>
            </div>
            <div id="portrait-fatigue-radial" className="portrait-fatigue-radial">
              <FatigueRadial fatigue={player.fatigue} maxFatigue={player.maxFatigue} size={48} />
            </div>
          </div>

          {!battleState.battleOver && (
            <div className={`hud-actions-wrap${processing ? ' sandbox-actions-processing' : ''}`}>
              <SandboxMeleeActions
                battleState={battleState}
                meleeState={meleeState}
                stance={stance}
                selectedAction={selectedAction}
                showingInventory={showingInventory}
                onAction={handleAction}
                onFlee={handleFlee}
                onSetStance={setStance}
                onSetSelectedAction={setSelectedAction}
                onSetShowingInventory={setShowingInventory}
              />
            </div>
          )}
        </div>

        {/* Battle over overlay */}
        {battleState.battleOver && (
          <BattleOverOverlay
            outcome={battleState.outcome}
            kills={meleeState.killCount}
            rounds={meleeState.exchangeCount}
            onRestart={handleRestart}
            onExit={onExit}
          />
        )}

        {/* Settings overlay (Escape key) */}
        <SettingsPanel visible={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </div>
  );
}

