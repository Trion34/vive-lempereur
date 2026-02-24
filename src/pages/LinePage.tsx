import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BattleState, LoadResult, ValorRollResult } from '../types';
import { ActionId, BattlePhase, MoraleThreshold, HealthState } from '../types';
import { displayRoll, displayTarget } from '../core/stats';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { BattleHeader } from '../components/shared/BattleHeader';
import { MeterBar } from '../components/shared/MeterBar';
import { DrillIndicator } from '../components/line/DrillIndicator';
import { Panorama } from '../components/line/Panorama';
import type { PanoramaHandle } from '../components/line/Panorama';
import { LineStatus } from '../components/line/LineStatus';
import { EnemyPanel } from '../components/line/EnemyPanel';
import { NarrativeScroll } from '../components/line/NarrativeScroll';
import type { NarrativeScrollHandle } from '../components/line/NarrativeScroll';
import { useAutoPlay } from '../components/line/useAutoPlay';
import type { AutoPlayCallbacks } from '../components/line/useAutoPlay';
import { wait, makeFatigueRadial } from '../utils/helpers';
import { BattleJournal } from '../components/overlays/BattleJournal';
import { CharacterPanel } from '../components/overlays/CharacterPanel';
import { InventoryPanel } from '../components/overlays/InventoryPanel';
import { BattleOverScreen } from '../components/overlays/BattleOverScreen';
import { deleteSave } from '../core/persistence';

// --- Health state labels ---
const HEALTH_LABELS: Record<string, string> = {
  unhurt: 'UNHURT',
  wounded: 'WOUNDED',
  badly_wounded: 'BADLY WOUNDED',
  critical: 'CRITICAL',
};

// --- Valor roll outcome labels & classes ---
const VALOR_LABELS: Record<string, string> = {
  great_success: 'STEELED',
  pass: 'HELD STEADY',
  fail: 'SHAKEN',
  critical_fail: 'NEARLY BROKE',
};

const VALOR_CLASSES: Record<string, string> = {
  great_success: 'valor-great',
  pass: 'valor-pass',
  fail: 'valor-fail',
  critical_fail: 'valor-critical',
};

// --- Gorge target definitions ---
const GORGE_TARGETS: { id: ActionId; name: string; description: string }[] = [
  {
    id: ActionId.TargetColumn,
    name: 'Target the Column',
    description: 'Fire into the packed ranks below. Easy target. Devastating.',
  },
  {
    id: ActionId.TargetOfficers,
    name: 'Target an Officer',
    description: 'Pick out the man with the gorget and sash. Harder shot \u2014 bigger effect.',
  },
  {
    id: ActionId.TargetWagon,
    name: 'Target the Ammo Wagon',
    description: 'The powder wagon, tilted on the gorge road. One good hit...',
  },
  {
    id: ActionId.ShowMercy,
    name: 'Show Mercy',
    description:
      'Lower your musket. These men are already beaten. The line fires without you.',
  },
];

export function LinePage() {
  const gameState = useGameStore((s) => s.gameState);
  const battleState = gameState?.battleState;
  const setProcessing = useUiStore((s) => s.setProcessing);

  // Overlay state
  const [activeOverlay, setActiveOverlay] = useState<'journal' | 'character' | 'inventory' | null>(null);

  // Force re-render counter (for imperative state mutations during auto-play)
  const [, setRenderTick] = useState(0);
  const forceUpdate = useCallback(() => setRenderTick((t) => t + 1), []);

  // Valor roll display state
  const [valorRoll, setValorRoll] = useState<ValorRollResult | null>(null);

  // Load animation state
  const [loadResult, setLoadResult] = useState<LoadResult | null>(null);
  const loadResolverRef = useRef<(() => void) | null>(null);

  // Refs for imperative access
  const battleStateRef = useRef<BattleState>(battleState!);
  battleStateRef.current = battleState!;
  const narrativeRef = useRef<NarrativeScrollHandle>(null);
  const panoramaRef = useRef<PanoramaHandle>(null);

  // --- Auto-play callbacks ---
  const autoPlayCallbacks = useMemo<AutoPlayCallbacks>(
    () => ({
      syncState: () => {
        forceUpdate();
      },
      showValorRoll: (result: ValorRollResult) => {
        setValorRoll(result);
      },
      showLoadAnimation: (result: LoadResult): Promise<void> => {
        return new Promise((resolve) => {
          loadResolverRef.current = resolve;
          setLoadResult(result);
        });
      },
      tryUseGrace: (): boolean => {
        const state = battleStateRef.current;
        if (!gameState || !state || gameState.player.grace <= 0) return false;
        gameState.player.grace--;
        state.player.health = state.player.maxHealth * 0.5;
        state.player.morale = state.player.maxMorale * 0.5;
        state.player.stamina = state.player.maxStamina * 0.5;
        state.player.alive = true;
        state.battleOver = false;
        return true;
      },
      showGraceIntervenes: async () => {
        // Create a simple overlay via DOM (matches old behavior)
        const overlay = document.createElement('div');
        overlay.className = 'grace-overlay';
        overlay.innerHTML = `
          <div class="grace-popup">
            <div class="grace-popup-icon">&#127807;</div>
            <div class="grace-popup-title">GRACE INTERVENES</div>
            <div class="grace-popup-body">
              Fate is not finished with you. A hand steadies your arm.
              Breath returns. The world swims back into focus.
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
        await wait(2500);
        overlay.remove();
      },
    }),
    [gameState, forceUpdate],
  );

  const autoPlay = useAutoPlay(
    battleStateRef,
    narrativeRef,
    panoramaRef,
    autoPlayCallbacks,
  );

  // --- Detect pending auto-play (set by StoryBeatPage) ---
  const pendingAutoPlay = useUiStore((s) => s.pendingAutoPlay);
  const pendingAutoPlayRange = useUiStore((s) => s.pendingAutoPlayRange);

  useEffect(() => {
    if (!pendingAutoPlay || !battleState) return;

    // Clear the flag immediately to prevent re-triggering
    const action = pendingAutoPlay;
    const range = pendingAutoPlayRange;
    useUiStore.setState({ pendingAutoPlay: null, pendingAutoPlayRange: null });

    switch (action) {
      case 'resumeVolleys':
        if (range) autoPlay.resumeVolleys(range[0], range[1]);
        break;
      case 'part2':
        autoPlay.startPart2();
        break;
      case 'part3':
        autoPlay.startPart3();
        break;
    }
  }, [pendingAutoPlay]);

  // --- Clear valor roll after display ---
  useEffect(() => {
    if (valorRoll) {
      const timer = setTimeout(() => setValorRoll(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [valorRoll]);

  if (!battleState) return null;

  // --- Player meters ---
  const { player } = battleState;

  const mPct = (player.morale / player.maxMorale) * 100;
  const moraleStateLabel = player.moraleThreshold.toUpperCase();
  const moraleStateClass =
    player.moraleThreshold !== MoraleThreshold.Steady ? player.moraleThreshold : undefined;

  const hPct = (player.health / player.maxHealth) * 100;
  const healthStateLabel = HEALTH_LABELS[player.healthState] || player.healthState.toUpperCase();
  const healthStateClass =
    player.healthState !== HealthState.Unhurt ? player.healthState : undefined;

  const sPct = player.maxStamina > 0 ? (player.stamina / player.maxStamina) * 100 : 0;

  const graceCount = gameState?.player.grace ?? 0;

  // --- Morale changes ---
  const hasMoraleChanges = battleState.pendingMoraleChanges.length > 0;

  // --- Actions panel content ---
  const renderActions = () => {
    if (battleState.battleOver) {
      return null;
    }

    // Auto-play active
    if (battleState.autoPlayActive) {
      // Show valor roll if available
      if (valorRoll) {
        return renderValorRollDisplay(valorRoll);
      }
      // Show load animation if available
      if (loadResult) {
        return (
          <LoadAnimation
            result={loadResult}
            onComplete={() => {
              setLoadResult(null);
              if (loadResolverRef.current) {
                loadResolverRef.current();
                loadResolverRef.current = null;
              }
            }}
          />
        );
      }
      return <div className="auto-play-status">The line endures...</div>;
    }

    // Gorge target selection (Part 3 pause)
    if (autoPlay.isAwaitingGorgeTarget()) {
      return renderGorgeTargets();
    }

    // Part 1 start
    if (
      battleState.battlePart === 1 &&
      battleState.scriptedVolley === 1 &&
      !battleState.autoPlayActive &&
      battleState.phase === BattlePhase.Line
    ) {
      return (
        <button className="begin-btn" onClick={() => autoPlay.startPart1()}>
          Begin
        </button>
      );
    }

    // Part 1 resume (V2-V4)
    if (
      battleState.battlePart === 1 &&
      battleState.phase === BattlePhase.Line &&
      battleState.scriptedVolley >= 2 &&
      battleState.scriptedVolley <= 4 &&
      !battleState.autoPlayActive
    ) {
      return (
        <button
          className="begin-btn"
          onClick={() => autoPlay.resumeVolleys(battleState.scriptedVolley - 1, 3)}
        >
          Continue
        </button>
      );
    }

    // Part 2 resume
    if (
      battleState.battlePart === 2 &&
      battleState.phase === BattlePhase.Line &&
      battleState.scriptedVolley >= 5 &&
      battleState.scriptedVolley <= 7 &&
      !battleState.autoPlayActive
    ) {
      return (
        <button
          className="begin-btn"
          onClick={() => autoPlay.resumeVolleys(battleState.scriptedVolley - 1, 6)}
        >
          Continue
        </button>
      );
    }

    // Part 3 resume
    if (
      battleState.battlePart === 3 &&
      battleState.phase === BattlePhase.Line &&
      battleState.scriptedVolley >= 8 &&
      battleState.scriptedVolley <= 11 &&
      !battleState.autoPlayActive
    ) {
      return (
        <button className="begin-btn" onClick={() => autoPlay.startPart3()}>
          Continue
        </button>
      );
    }

    // Story beat phase -- choices handled by cinematic overlay
    if (battleState.phase === BattlePhase.StoryBeat) {
      return null;
    }

    // Gorge actions (Part 3 available actions from state)
    if (battleState.availableActions.length > 0) {
      const fireIds: ActionId[] = [
        ActionId.Fire,
        ActionId.TargetColumn,
        ActionId.TargetOfficers,
        ActionId.TargetWagon,
      ];
      const endureIds: ActionId[] = [ActionId.ShowMercy];

      return (
        <>
          {battleState.availableActions.map((action) => {
            const actionClass = fireIds.includes(action.id)
              ? 'fire-action'
              : endureIds.includes(action.id)
                ? 'endure-action'
                : 'steady-action';

            return (
              <button
                key={action.id}
                className={`action-btn ${actionClass}`}
                data-action={action.id}
              >
                <span className="action-name">{action.name}</span>
                <span className="action-desc">
                  {action.description.slice(0, 70)}
                  {action.description.length > 70 ? '...' : ''}
                </span>
              </button>
            );
          })}
        </>
      );
    }

    return null;
  };

  const renderGorgeTargets = () => {
    return (
      <>
        {GORGE_TARGETS.map((target) => {
          // Hide wagon option if already detonated
          if (target.id === ActionId.TargetWagon && battleState.wagonDamage >= 100)
            return null;

          const actionClass =
            target.id === ActionId.ShowMercy ? 'endure-action' : 'fire-action';

          return (
            <button
              key={target.id}
              className={`action-btn ${actionClass}`}
              onClick={() => autoPlay.resolveGorgeTarget(target.id)}
            >
              <span className="action-name">{target.name}</span>
              <span className="action-desc">{target.description}</span>
            </button>
          );
        })}
      </>
    );
  };

  const renderValorRollDisplay = (result: ValorRollResult) => {
    const outcomeCls = VALOR_CLASSES[result.outcome] || '';
    const changeSign = result.moraleChange > 0 ? '+' : '';

    return (
      <div className={`valor-roll-display ${outcomeCls}`}>
        <div className="valor-roll-title">VALOR CHECK</div>
        <div className="valor-roll-numbers">
          <span className="valor-roll-value">{displayRoll(result.roll)}</span>
          <span className="valor-roll-vs">vs</span>
          <span className="valor-roll-target">{displayTarget(result.target)}</span>
        </div>
        <div className="valor-roll-outcome">
          {VALOR_LABELS[result.outcome] || result.outcome}
        </div>
        <div className="valor-roll-morale">
          Morale: {changeSign}
          {result.moraleChange}
        </div>
        <div className="valor-roll-narrative">{result.narrative}</div>
      </div>
    );
  };

  return (
    <>
      <BattleHeader
        battleState={battleState}
        onJournalClick={() => setActiveOverlay(activeOverlay === 'journal' ? null : 'journal')}
        onCharacterClick={() => setActiveOverlay(activeOverlay === 'character' ? null : 'character')}
        onInventoryClick={() => setActiveOverlay(activeOverlay === 'inventory' ? null : 'inventory')}
        onSettingsClick={() => useUiStore.setState({ showSettings: true })}
        onRestartClick={() => {
          if (confirm('Restart the game? All progress will be lost.')) {
            deleteSave();
            window.location.reload();
          }
        }}
      />

      <main className="battle-main">
        {/* LEFT: Player Condition + The Line */}
        <aside className="panel panel-left" id="player-panel">
          <h2>Your Condition</h2>
          <MeterBar
            label="Morale"
            value={player.morale}
            max={player.maxMorale}
            fillClass="morale-fill"
            stateLabel={moraleStateLabel}
            stateClass={moraleStateClass}
          />
          <MeterBar
            label="Health"
            value={player.health}
            max={player.maxHealth}
            fillClass="health-fill"
            stateLabel={healthStateLabel}
            stateClass={healthStateClass}
            showMax
          />
          <div className="meter-group">
            <div className="meter-header">
              <span className="meter-label">Stamina</span>
              <span className="meter-value">
                <span id="stamina-num">{Math.round(player.stamina)}</span>
              </span>
            </div>
            <div className="meter-track">
              <div className="meter-fill stamina-fill" style={{ width: `${sPct}%` }} />
            </div>
            <div
              id="header-fatigue-radial"
              className="header-fatigue-radial"
              dangerouslySetInnerHTML={{
                __html: makeFatigueRadial(player.fatigue, player.maxFatigue, 48),
              }}
            />
          </div>

          <div className="status-row">
            <span className="status-key">Musket</span>
            <span
              className="status-val"
              id="musket-status"
              style={{
                color: player.musketLoaded ? 'var(--health-high)' : 'var(--morale-low)',
              }}
            >
              {player.musketLoaded ? 'Loaded' : 'Empty'}
            </span>
          </div>
          {graceCount > 0 && (
            <div className="status-row grace-row" id="grace-row">
              <span className="status-key">Grace</span>
              <span className="status-val grace-val" id="grace-val">{graceCount}</span>
            </div>
          )}

          <LineStatus battleState={battleState} />
        </aside>

        {/* CENTER: Narrative + Panorama + Actions */}
        <section className="center-column">
          <NarrativeScroll ref={narrativeRef} />

          <Panorama battleState={battleState} ref={panoramaRef} />

          {/* Morale changes floating display */}
          <div
            className={`morale-changes${hasMoraleChanges ? ' visible' : ''}`}
            id="morale-changes"
          >
            {battleState.pendingMoraleChanges.map((c, idx) => {
              const pos = c.amount > 0;
              return (
                <div key={idx} className="morale-change-item">
                  <span className="reason">{c.reason}</span>
                  <span className={`amount${pos ? ' positive' : ''}`}>
                    {pos ? '+' : ''}
                    {Math.round(c.amount)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Actions panel */}
          <div
            className="actions-panel"
            id="actions-panel"
            style={{ display: battleState.battleOver ? 'none' : 'block' }}
          >
            <DrillIndicator battleState={battleState} />
            <div className="actions-grid" id="actions-grid">
              {renderActions()}
            </div>
          </div>
        </section>

        {/* RIGHT: The Enemy */}
        <aside className="panel panel-right" id="enemy-panel">
          <EnemyPanel battleState={battleState} />
        </aside>
      </main>

      {/* Overlays */}
      {activeOverlay === 'journal' && (
        <BattleJournal
          log={battleState.log}
          visible={true}
          onClose={() => setActiveOverlay(null)}
        />
      )}
      {activeOverlay === 'character' && (
        <CharacterPanel
          player={gameState!.player}
          battlePlayer={battleState.player}
          volleysFired={battleState.scriptedVolley - 1}
          visible={true}
          onClose={() => setActiveOverlay(null)}
        />
      )}
      {activeOverlay === 'inventory' && (
        <InventoryPanel
          player={gameState!.player}
          battlePlayer={battleState.player}
          visible={true}
          onClose={() => setActiveOverlay(null)}
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
        />
      )}
    </>
  );
}

// --- Load Animation sub-component ---

interface LoadAnimationProps {
  result: LoadResult;
  onComplete: () => void;
}

function LoadAnimation({ result, onComplete }: LoadAnimationProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (completedRef.current) return;
    const row = rowRef.current;
    if (!row) return;

    const steps = result.narrativeSteps;
    let stepIndex = 0;

    function showNextStep() {
      if (!row) return;
      if (stepIndex >= steps.length) {
        const verdict = document.createElement('div');
        verdict.className = `load-verdict-inline ${result.success ? 'loaded' : 'fumbled'}`;
        verdict.textContent = result.success ? 'LOADED' : 'FUMBLED';
        row.appendChild(verdict);
        completedRef.current = true;

        setTimeout(() => {
          onComplete();
        }, 1000);
        return;
      }

      const step = steps[stepIndex];
      const stepEl = document.createElement('div');
      stepEl.className = `load-step-inline ${step.success ? 'success' : 'failed'}`;
      stepEl.textContent = step.label;

      stepEl.style.opacity = '0';
      stepEl.style.transform = 'translateY(6px)';
      row.appendChild(stepEl);
      requestAnimationFrame(() => {
        stepEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        stepEl.style.opacity = '1';
        stepEl.style.transform = 'translateY(0)';
      });

      stepIndex++;
      setTimeout(showNextStep, step.duration);
    }

    showNextStep();
  }, [result, onComplete]);

  return (
    <div className="load-sequence">
      <div className="load-title">RELOADING</div>
      <div className="load-steps-row" id="load-steps-row" ref={rowRef} />
    </div>
  );
}
