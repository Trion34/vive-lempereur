import React, { useCallback, useState, useRef } from 'react';
import { SkirmishField } from '../components/melee/SkirmishField';
import { MeleeActions } from '../components/melee/MeleeActions';
import { FatigueRadial } from '../components/melee/FatigueRadial';
import { useMeleeAnimation } from '../hooks/useMeleeAnimation';
import { useMeleeHotkeys } from '../hooks/useMeleeHotkeys';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { useGloryStore } from '../stores/gloryStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useProfileStore } from '../stores/profileStore';
import type {
  BattleState,
  CombatantSnapshot,
} from '../types';
import {
  MeleeActionId,
  MeleeStance,
  BodyPart,
  ActionId,
} from '../types';
import { advanceTurn, resolveMeleeRout } from '../core/battle';
import { BattleOverScreen } from '../components/overlays/BattleOverScreen';
import type { MeleeTurnInput } from '../core/battle';
import { snapshotOf } from '../core/melee';
import { saveGame, deleteSave } from '../core/persistence';
import { applyGraceRecovery } from '../core/grace';

// --- Grace helpers ---

function tryUseGrace(gameState: NonNullable<ReturnType<typeof useGameStore.getState>['gameState']>): boolean {
  const bs = gameState.battleState;
  if (!bs) return false;
  const result = applyGraceRecovery(gameState, bs);
  if (result) saveGame(gameState);
  return result;
}

// --- Overlay components ---

function GraceOverlay({
  player,
  graceRemaining,
  onContinue,
}: {
  player: BattleState['player'];
  graceRemaining: number;
  onContinue: () => void;
}) {
  return (
    <div className="grace-overlay">
      <div className="grace-popup">
        <div className="grace-popup-icon">{'\u{1F33F}'}</div>
        <div className="grace-popup-title">GRACE INTERVENES</div>
        <div className="grace-popup-body">
          Fate is not finished with you. A hand steadies your arm. Breath returns. The world swims back into focus.
        </div>
        <div className="grace-popup-stats">
          Health restored to {Math.round(player.health)} | Morale to {Math.round(player.morale)} | Stamina to {Math.round(player.stamina)}
        </div>
        <div className="grace-popup-remaining">Grace remaining: {graceRemaining}</div>
        <button className="grace-popup-btn" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

function GlorySummaryOverlay({
  kills,
  gloryEarned,
  totalGlory,
  onContinue,
}: {
  kills: number;
  gloryEarned: number;
  totalGlory: number;
  onContinue: () => void;
}) {
  return (
    <div className="glory-summary-overlay">
      <div className="glory-summary">
        <div className="glory-summary-icon">{'\u2733'}</div>
        <div className="glory-summary-title">GLORY EARNED</div>
        <div className="glory-summary-kills">
          {kills} {kills === 1 ? 'enemy' : 'enemies'} defeated
        </div>
        <div className="glory-summary-amount">+{gloryEarned} Glory</div>
        <div className="glory-summary-total">Total: {totalGlory}</div>
        <button className="glory-summary-btn" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

// --- Main page ---

export function MeleePage() {
  const { gameState, setGameState } = useGameStore();
  const {
    processing,
    setProcessing,
    meleeStance,
    setMeleeSelectedAction,
    setMeleeShowingInventory,
  } = useUiStore();
  const gloryStore = useGloryStore();
  const screenShake = useSettingsStore((s) => s.screenShake);

  const { animateSkirmishRound, animateReload, floatPlayerDeltas } = useMeleeAnimation();

  // Overlay states
  const [graceOverlay, setGraceOverlay] = useState<{
    player: BattleState['player'];
    graceRemaining: number;
  } | null>(null);
  const [glorySummary, setGlorySummary] = useState<{
    kills: number;
    gloryEarned: number;
    totalGlory: number;
  } | null>(null);

  // Refs for resolving overlay promises
  const graceResolveRef = useRef<(() => void) | null>(null);
  const gloryResolveRef = useRef<(() => void) | null>(null);

  // Re-render trigger: bump a counter when we need to force re-render after
  // imperative state mutations (advanceTurn replaces the BattleState object)
  const [, setRenderTick] = useState(0);
  const forceRender = useCallback(() => setRenderTick((t) => t + 1), []);

  const battleState = gameState?.battleState;
  const meleeState = battleState?.meleeState;

  // --- Grace overlay promise helpers ---
  const showGraceOverlayAsync = useCallback((player: BattleState['player'], graceRemaining: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      graceResolveRef.current = resolve;
      setGraceOverlay({ player, graceRemaining });
    });
  }, []);

  const showGlorySummaryAsync = useCallback((kills: number, gloryEarned: number, totalGlory: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      gloryResolveRef.current = resolve;
      setGlorySummary({ kills, gloryEarned, totalGlory });
    });
  }, []);

  // --- Core action handler ---
  const handleAction = useCallback(async (action: MeleeActionId, bodyPart?: BodyPart) => {
    if (!gameState || !battleState || !meleeState) return;
    if (battleState.battleOver || processing) return;

    setProcessing(true);
    setMeleeShowingInventory(false);

    const ms = meleeState;
    const prevMorale = battleState.player.morale;
    const prevStamina = battleState.player.stamina;
    const prevPhase = battleState.phase;
    const prevReloadProgress = ms.reloadProgress;

    // Snapshot ACTIVE combatants before resolution
    const preRoundSnapshot = new Map<string, { snap: CombatantSnapshot; side: string }>();
    const p = battleState.player;
    preRoundSnapshot.set(p.name, { snap: snapshotOf(p), side: 'player' });
    for (const idx of ms.activeEnemies) {
      const opp = ms.opponents[idx];
      if (opp.health > 0) {
        preRoundSnapshot.set(opp.name, { snap: snapshotOf(opp), side: 'enemy' });
      }
    }
    for (const ally of ms.allies) {
      if (ally.alive && ally.health > 0) {
        preRoundSnapshot.set(ally.name, { snap: snapshotOf(ally), side: 'ally' });
      }
    }

    // Resolve via advanceTurn
    const input: MeleeTurnInput = {
      action,
      bodyPart,
      stance: meleeStance,
      targetIndex: ms.playerTargetIndex,
    };
    const newState = advanceTurn(battleState, input.action as unknown as ActionId, input);
    gameState.battleState = newState;
    saveGame(gameState);
    setGameState({ ...gameState });

    const meleeEnded =
      prevPhase === 'melee' && (newState.phase !== 'melee' || newState.battleOver);

    setMeleeSelectedAction(null);

    // Reload animation
    if (action === MeleeActionId.Reload) {
      const isSecondHalf = prevReloadProgress === 1;
      await animateReload(isSecondHalf);
    }

    // Animate round log
    const roundLog = newState.meleeState?.roundLog || [];
    if (roundLog.length > 0) {
      await animateSkirmishRound(roundLog, preRoundSnapshot, newState);
    }

    // Check melee end
    if (meleeEnded) {
      forceRender();

      if (newState.battleOver && newState.outcome === 'defeat') {
        if (tryUseGrace(gameState)) {
          setGameState({ ...gameState });
          await showGraceOverlayAsync(newState.player, gameState.player.grace);
          forceRender();
          setProcessing(false);
          return;
        }
      }

      const kills = newState.meleeState?.killCount || 0;
      if (kills > 0) {
        const earned = kills;
        gloryStore.addGlory(earned);
        // Persist updated glory to profile
        const profileState = useProfileStore.getState();
        const pid = profileState.activeProfileId;
        if (pid) {
          const gloryState = useGloryStore.getState();
          profileState.updateProfile(pid, {
            currentGlory: gloryState.glory,
            lifetimeGlory: gloryState.lifetimeGlory,
          });
        }
        const totalGlory = useGloryStore.getState().glory;
        await showGlorySummaryAsync(kills, earned, totalGlory);
      }

      // Full re-render for phase transition
      setGameState({ ...gameState });
      forceRender();
    } else {
      // Normal round update (skip card rebuild, animation already synced cards)
      forceRender();
    }

    // Float aggregate meter changes on player
    const moraleDelta = Math.round(newState.player.morale - prevMorale);
    const staminaDelta = Math.round(newState.player.stamina - prevStamina);
    floatPlayerDeltas(newState.player.name, moraleDelta, staminaDelta);

    // Screen shake on big morale loss
    if (newState.player.morale < prevMorale - 10 && screenShake) {
      const gameEl = document.getElementById('game');
      if (gameEl) {
        gameEl.classList.add('shake');
        setTimeout(() => gameEl.classList.remove('shake'), 300);
      }
    }

    setProcessing(false);
  }, [
    gameState, battleState, meleeState, processing, meleeStance,
    setProcessing, setMeleeSelectedAction, setMeleeShowingInventory,
    animateSkirmishRound, animateReload, floatPlayerDeltas, forceRender,
    setGameState, showGraceOverlayAsync, showGlorySummaryAsync,
    gloryStore, screenShake,
  ]);

  // --- Flee handler ---
  const handleFlee = useCallback(() => {
    if (!gameState || !battleState || processing) return;
    setProcessing(true);
    const newState = resolveMeleeRout(battleState);
    gameState.battleState = newState;
    setGameState({ ...gameState });
    forceRender();
    setProcessing(false);
  }, [gameState, battleState, processing, setProcessing, setGameState, forceRender]);

  // --- Target selection handler ---
  const handleSelectTarget = useCallback((index: number) => {
    if (!battleState?.meleeState || processing) return;
    battleState.meleeState.playerTargetIndex = index;
    forceRender();
  }, [battleState, processing, forceRender]);

  // --- Hotkeys ---
  useMeleeHotkeys(handleAction, handleFlee);

  // --- Guard: no melee state ---
  if (!battleState || !meleeState) {
    return null;
  }

  const player = battleState.player;
  const ms = meleeState;
  const hpPct = (player.health / player.maxHealth) * 100;
  const spPct = (player.stamina / player.maxStamina) * 100;
  const mrPct = (player.morale / player.maxMorale) * 100;
  const grace = gameState?.player.grace ?? 0;

  const stanceNames: Record<MeleeStance, string> = {
    [MeleeStance.Aggressive]: 'AGGRESSIVE',
    [MeleeStance.Balanced]: 'BALANCED',
    [MeleeStance.Defensive]: 'DEFENSIVE',
  };

  // Player status tags
  const playerStatusTags: React.ReactNode[] = [];
  if (ms.playerStunned > 0) {
    playerStatusTags.push(
      <span key="stunned" className="opp-status-tag stunned" data-tooltip="Stunned - Cannot act this turn">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 1l1.2 3.1L12.5 4l-2.1 2.5L11.5 10 8 8.2 4.5 10l1.1-3.5L3.5 4l3.3.1z" />
          <circle cx="3" cy="13" r="1.2" /><circle cx="13" cy="13" r="1.2" />
        </svg>
      </span>
    );
  }
  if (ms.playerRiposte) {
    playerStatusTags.push(
      <span key="riposte" className="opp-status-tag" style={{ borderColor: 'var(--health-high)', color: 'var(--health-high)' }}>
        RIPOSTE
      </span>
    );
  }

  return (
    <div className="melee-arena">
      <div className="duel-scene">
        {/* Arena Header */}
        <div className="arena-header">
          <span className="arena-round" id="arena-round">
            Round {ms.exchangeCount} / {ms.maxExchanges}
          </span>
          <span className="arena-kills" id="arena-kills">
            Kills: {ms.killCount}
          </span>
        </div>

        {/* Skirmish Field */}
        <SkirmishField
          meleeState={ms}
          player={player}
          onSelectTarget={handleSelectTarget}
        />
      </div>

      {/* Player HUD: stats | portrait | actions */}
      <div className="player-hud">
        {/* Left: Player stats */}
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
          <div className="combatant-stance" id="arena-player-stance">{stanceNames[ms.playerStance]}</div>
          <div className="combatant-statuses" id="arena-player-statuses">
            {playerStatusTags}
          </div>
        </div>

        {/* Center: Portrait */}
        <div className="hud-portrait">
          <div className="portrait-name" id="portrait-name">{player.name}</div>
          <div className="portrait-frame-wrap">
            <div className="portrait-frame">
              <div className="portrait-placeholder" />
            </div>
            {grace > 0 && (
              <span className="grace-badge" id="grace-badge-melee">
                {grace > 1 ? '\u{1F33F}\u{1F33F}' : '\u{1F33F}'}
              </span>
            )}
          </div>
          <div id="portrait-fatigue-radial" className="portrait-fatigue-radial">
            <FatigueRadial fatigue={player.fatigue} maxFatigue={player.maxFatigue} size={48} />
          </div>
        </div>

        {/* Right: Actions */}
        {!battleState.battleOver && (
          <MeleeActions
            battleState={battleState}
            meleeState={ms}
            onAction={handleAction}
            onFlee={handleFlee}
          />
        )}
      </div>

      {/* Grace Overlay */}
      {graceOverlay && (
        <GraceOverlay
          player={graceOverlay.player}
          graceRemaining={graceOverlay.graceRemaining}
          onContinue={() => {
            setGraceOverlay(null);
            graceResolveRef.current?.();
            graceResolveRef.current = null;
          }}
        />
      )}

      {/* Glory Summary Overlay */}
      {glorySummary && (
        <GlorySummaryOverlay
          kills={glorySummary.kills}
          gloryEarned={glorySummary.gloryEarned}
          totalGlory={glorySummary.totalGlory}
          onContinue={() => {
            setGlorySummary(null);
            gloryResolveRef.current?.();
            gloryResolveRef.current = null;
          }}
        />
      )}

      {/* Battle over screen */}
      {battleState.battleOver && (
        <BattleOverScreen
          battleState={battleState}
          gameState={gameState!}
          onRestart={() => {
            deleteSave();
            window.location.reload();
          }}
          onContinueCredits={() => {
            useUiStore.setState({ showCredits: true });
          }}
          onAdvanceCampaign={() => {
            useGameStore.getState().advanceCampaign();
          }}
        />
      )}
    </div>
  );
}
