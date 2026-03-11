import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameState, BattleState, LoadResult, ValorRollResult, LineAction } from '../types';
import { BattlePhase, Formation, MoraleThreshold, HealthState, MilitaryRank, LineActionId, DrillStep } from '../types';
import { hasMinRank } from '../core/volleys';
import { createNewGame } from '../core/gameLoop';
import { useUiStore } from '../stores/uiStore';
import { MeterBar } from '../components/shared/MeterBar';
import { DrillIndicator } from '../components/line/DrillIndicator';
import { BattlefieldView } from '../components/line/BattlefieldView';
import type { BattlefieldViewHandle, FormationShape } from '../components/line/BattlefieldView';
import { LineStatus } from '../components/line/LineStatus';
import { EnemyPanel } from '../components/line/EnemyPanel';
import { useAutoPlay } from '../components/line/useAutoPlay';
import type { AutoPlayCallbacks, AutoPlayDeps } from '../components/line/useAutoPlay';
import { SandboxControls } from '../components/sandbox/SandboxControls';
import { wait, makeFatigueRadial } from '../utils/helpers';
import { displayRoll, displayTarget } from '../core/stats';
import { getFormationShape, toFormationShape, FORMATION_INFO } from '../core/formations';

// --- Sandbox Setup Types & Data ---

type SandboxScenario = 'standard' | 'scenario_b' | 'scenario_c';

interface SandboxConfig {
  rank: MilitaryRank;
  scenario: SandboxScenario;
}

const RANK_OPTIONS: { rank: MilitaryRank; label: string; subtitle: string }[] = [
  { rank: MilitaryRank.Private, label: 'Private', subtitle: 'No agency' },
  { rank: MilitaryRank.Corporal, label: 'Corporal', subtitle: 'Your File' },
  { rank: MilitaryRank.Sergeant, label: 'Sergeant', subtitle: 'The Section' },
  { rank: MilitaryRank.Lieutenant, label: 'Lieutenant', subtitle: 'The Company' },
  { rank: MilitaryRank.Captain, label: 'Captain', subtitle: 'The Formation' },
];

const SANDBOX_SCENARIOS: { id: SandboxScenario; title: string; description: string }[] = [
  { id: 'standard', title: 'Standard Line', description: 'Matched formations, 8 volleys.' },
  { id: 'scenario_b', title: 'Scenario B', description: 'Coming soon.' },
  { id: 'scenario_c', title: 'Scenario C', description: 'Coming soon.' },
];

function applyScenario(_gs: GameState, scenario: SandboxScenario): void {
  // 'standard' = no modifications (current default)
  // Scenario B and C are stubs — will be scripted later
  if (scenario === 'scenario_b' || scenario === 'scenario_c') {
    // Placeholder: no-op for now
  }
}

// --- Labels ---
const HEALTH_LABELS: Record<string, string> = {
  unhurt: 'UNHURT',
  wounded: 'WOUNDED',
  badly_wounded: 'BADLY WOUNDED',
  critical: 'CRITICAL',
};

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

function createSandboxState(config: SandboxConfig): GameState {
  const gs = createNewGame();
  gs.battleState!.phase = BattlePhase.Line;
  gs.battleState!.playerRank = config.rank;
  gs.battleState!.formationChosen = false;
  gs.player.rank = config.rank;
  applyScenario(gs, config.scenario);
  return gs;
}

export function LineSandboxPage() {
  // null = setup screen, non-null = sandbox running
  const [config, setConfig] = useState<SandboxConfig | null>(null);

  if (!config) {
    return <SandboxSetupScreen onLaunch={setConfig} />;
  }

  return <SandboxBattle config={config} onChangeSetup={() => setConfig(null)} />;
}

// --- Setup Screen ---

function SandboxSetupScreen({ onLaunch }: { onLaunch: (config: SandboxConfig) => void }) {
  const [rank, setRank] = useState<MilitaryRank>(MilitaryRank.Private);
  const [scenario, setScenario] = useState<SandboxScenario>('standard');

  return (
    <div className="sandbox-setup">
      <div className="sandbox-setup-header">
        <button
          className="sandbox-back-btn"
          onClick={() => useUiStore.setState({ showLineSandbox: false })}
          title="Back to Profile"
        >
          &larr;
        </button>
        <h1 className="sandbox-setup-title">LINE SANDBOX</h1>
      </div>

      <div className="sandbox-setup-body">
        <section className="sandbox-setup-section">
          <h2 className="sandbox-setup-section-label">Rank</h2>
          <div className="sandbox-rank-picker">
            {RANK_OPTIONS.map((opt) => (
              <button
                key={opt.rank}
                className={`sandbox-rank-btn${rank === opt.rank ? ' selected' : ''}`}
                onClick={() => setRank(opt.rank)}
              >
                <span className="sandbox-rank-btn-label">{opt.label}</span>
                <span className="sandbox-rank-btn-sub">{opt.subtitle}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="sandbox-setup-section">
          <h2 className="sandbox-setup-section-label">Scenario</h2>
          <div className="sandbox-scenario-grid">
            {SANDBOX_SCENARIOS.map((s) => {
              const disabled = s.id !== 'standard';
              return (
                <button
                  key={s.id}
                  className={`sandbox-scenario-card${scenario === s.id ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
                  onClick={() => !disabled && setScenario(s.id)}
                  disabled={disabled}
                >
                  <span className="sandbox-scenario-card-title">{s.title}</span>
                  <span className="sandbox-scenario-card-desc">{s.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <button
          className="sandbox-launch-btn"
          onClick={() => onLaunch({ rank, scenario })}
        >
          BEGIN SANDBOX
        </button>
      </div>
    </div>
  );
}

// --- Sandbox Battle (existing sandbox, extracted) ---

function SandboxBattle({ config, onChangeSetup }: { config: SandboxConfig; onChangeSetup: () => void }) {
  const gsRef = useRef<GameState>(createSandboxState(config));
  const [renderTick, setRenderTick] = useState(0);
  const forceUpdate = useCallback(() => setRenderTick((t) => t + 1), []);

  // Right panel tab
  const [rightTab, setRightTab] = useState<'enemy' | 'controls'>('controls');

  // Valor/load display
  const [valorRoll, setValorRoll] = useState<ValorRollResult | null>(null);
  const [loadResult, setLoadResult] = useState<LoadResult | null>(null);
  const loadResolverRef = useRef<(() => void) | null>(null);

  // Refs
  const battleStateRef = useRef<BattleState>(gsRef.current.battleState!);
  battleStateRef.current = gsRef.current.battleState!;
  const battlefieldRef = useRef<BattlefieldViewHandle>(null);

  // --- Sandbox deps: no persistence, local state only ---
  const autoPlayDeps = useMemo<AutoPlayDeps>(
    () => ({
      getGameState: () => gsRef.current,
      saveGame: () => {}, // no-op in sandbox
      setGameState: (gs: GameState) => {
        // Intercept: if auto-play transitions to StoryBeat, stay in Line
        if (gs.battleState && gs.battleState.phase !== BattlePhase.Line) {
          gs.battleState.phase = BattlePhase.Line;
          gs.battleState.autoPlayActive = false;
        }
        gsRef.current = gs;
        forceUpdate();
      },
    }),
    [forceUpdate],
  );

  // --- Auto-play callbacks ---
  const autoPlayCallbacks = useMemo<AutoPlayCallbacks>(
    () => ({
      syncState: () => forceUpdate(),
      showValorRoll: (result: ValorRollResult) => setValorRoll(result),
      showLoadAnimation: (result: LoadResult): Promise<void> => {
        return new Promise((resolve) => {
          loadResolverRef.current = resolve;
          setLoadResult(result);
        });
      },
      tryUseGrace: (): boolean => {
        const gs = gsRef.current;
        const state = gs.battleState;
        if (!state || gs.player.grace <= 0) return false;
        gs.player.grace--;
        state.player.health = state.player.maxHealth * 0.5;
        state.player.morale = state.player.maxMorale * 0.5;
        state.player.stamina = state.player.maxStamina * 0.5;
        state.player.alive = true;
        state.battleOver = false;
        return true;
      },
      showGraceIntervenes: async () => {
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
    [forceUpdate],
  );

  const autoPlay = useAutoPlay(
    battleStateRef,
    battlefieldRef,
    autoPlayCallbacks,
    autoPlayDeps,
  );

  // Clear valor roll after display
  useEffect(() => {
    if (valorRoll) {
      const timer = setTimeout(() => setValorRoll(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [valorRoll]);

  const battleState = gsRef.current.battleState!;
  const { player } = battleState;

  // --- Formation picker state ---
  const [selectedFormation, setSelectedFormation] = useState<Formation>(battleState.formation);

  // Dynamic formation shapes — preview selected formation before deploy
  const activeFormation = battleState.formationChosen ? battleState.formation : selectedFormation;
  const sandboxFormations = useMemo(() => ({
    french: toFormationShape(getFormationShape(activeFormation)) as FormationShape,
    austrian: { cols: 120, rows: 3, label: 'AUSTRIAN LINE' } as FormationShape,
  }), [activeFormation]);

  // --- Player meters ---
  const mPct = (player.morale / player.maxMorale) * 100;
  const moraleStateLabel = player.moraleThreshold.toUpperCase();
  const moraleStateClass =
    player.moraleThreshold !== MoraleThreshold.Steady ? player.moraleThreshold : undefined;

  const hPct = (player.health / player.maxHealth) * 100;
  const healthStateLabel = HEALTH_LABELS[player.healthState] || player.healthState.toUpperCase();
  const healthStateClass =
    player.healthState !== HealthState.Unhurt ? player.healthState : undefined;

  const sPct = player.maxStamina > 0 ? (player.stamina / player.maxStamina) * 100 : 0;
  const graceCount = gsRef.current.player.grace;

  const isRanked = hasMinRank(config.rank, MilitaryRank.Corporal);

  const handleDeployFormation = useCallback(() => {
    const bs = gsRef.current.battleState!;
    bs.formation = selectedFormation;
    bs.formationChosen = true;
    forceUpdate();
  }, [selectedFormation, forceUpdate]);

  // --- Actions panel ---
  const renderActions = () => {
    if (battleState.autoPlayActive) {
      const mainContent = loadResult ? (
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
      ) : (
        <div className="auto-play-status">The line endures...</div>
      );

      return (
        <>
          {mainContent}
          {valorRoll && renderValorRollDisplay(valorRoll)}
        </>
      );
    }

    // Formation picker (before battle starts)
    if (!battleState.formationChosen) {
      return (
        <FormationPicker
          selected={selectedFormation}
          onSelect={setSelectedFormation}
          onDeploy={handleDeployFormation}
        />
      );
    }

    // Rank action selection (paused for player input)
    if (autoPlay.isAwaitingRankAction()) {
      return renderRankActions();
    }

    return (
      <button className="begin-btn" onClick={() => autoPlay.sandboxRun(8)}>
        {isRanked ? 'Begin Battle' : 'Begin Auto-Play'}
      </button>
    );
  };

  const renderRankActions = () => {
    const pending = autoPlay.getPendingRankActions();
    if (!pending) return null;

    const stepLabel: Record<string, string> = {
      [DrillStep.Present]: 'ORDERS',
      [DrillStep.Fire]: 'FIRE',
      [DrillStep.Endure]: 'ENDURE',
      [DrillStep.Load]: 'RELOAD',
    };

    const getActionClass = (action: LineAction): string => {
      const fireActions: LineActionId[] = [
        LineActionId.AimedShot, LineActionId.FireWithVolley,
        LineActionId.ConcentrateFire, LineActionId.HoldHoldFire,
        LineActionId.FireByRank, LineActionId.FireAtWill, LineActionId.StandardVolley,
      ];
      const endureActions: LineActionId[] = [
        LineActionId.SteadyYourFile, LineActionId.KeepHeadDown,
        LineActionId.CloseRanks, LineActionId.RefuseFlank,
        LineActionId.OrderDrums, LineActionId.SilenceDrums,
      ];
      if (fireActions.includes(action.id)) return 'fire-action';
      if (endureActions.includes(action.id)) return 'endure-action';
      return 'steady-action';
    };

    return (
      <>
        <div className="rank-action-header">{stepLabel[pending.drillStep] || 'ORDERS'}</div>
        {pending.actions.map((action) => (
          <button
            key={action.id}
            className={`action-btn rank-action-compact ${getActionClass(action)}`}
            onClick={() => autoPlay.resolveRankAction(action.id)}
          >
            {action.name}
          </button>
        ))}
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
      </div>
    );
  };

  const handleReset = useCallback(() => {
    gsRef.current = createSandboxState(config);
    forceUpdate();
  }, [config, forceUpdate]);

  const handleControlUpdate = useCallback(() => {
    forceUpdate();
  }, [forceUpdate]);

  return (
    <>
      {/* Header */}
      <div className="sandbox-header">
        <button
          className="sandbox-back-btn"
          onClick={() => useUiStore.setState({ showLineSandbox: false })}
          title="Back to Profile"
        >
          &larr;
        </button>
        <h1 className="sandbox-title">LINE SANDBOX</h1>
      </div>

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

        {/* CENTER: Battlefield View + Actions */}
        <section className="center-column">
          <BattlefieldView battleState={battleState} ref={battlefieldRef} formations={sandboxFormations} />

          {/* Morale changes */}
          <div
            className={`morale-changes${battleState.pendingMoraleChanges.length > 0 ? ' visible' : ''}`}
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
          <div className="actions-panel" id="actions-panel">
            <DrillIndicator battleState={battleState} />
            <div className="actions-grid" id="actions-grid">
              {renderActions()}
            </div>
          </div>
        </section>

        {/* RIGHT: Tabbed — Enemy / Controls */}
        <aside className="panel panel-right" id="enemy-panel">
          <div className="sandbox-right-tabs">
            <button
              className={`dev-tab${rightTab === 'enemy' ? ' active' : ''}`}
              onClick={() => setRightTab('enemy')}
            >
              Enemy
            </button>
            <button
              className={`dev-tab${rightTab === 'controls' ? ' active' : ''}`}
              onClick={() => setRightTab('controls')}
            >
              Controls
            </button>
          </div>
          {rightTab === 'enemy' ? (
            <EnemyPanel battleState={battleState} />
          ) : (
            <SandboxControls
              gameState={gsRef.current}
              onUpdate={handleControlUpdate}
              onReset={handleReset}
              onStartAutoPlay={() => autoPlay.sandboxRun(8)}
              onChangeSetup={onChangeSetup}
              battlefieldRef={battlefieldRef}
            />
          )}
        </aside>
      </main>
    </>
  );
}

// --- Formation Picker sub-component ---

function FormationPicker({
  selected,
  onSelect,
  onDeploy,
}: {
  selected: Formation;
  onSelect: (f: Formation) => void;
  onDeploy: () => void;
}) {
  return (
    <div className="formation-picker">
      <div className="formation-cards">
        {FORMATION_INFO.map((info) => (
          <button
            key={info.id}
            className={`formation-card${selected === info.id ? ' selected' : ''}`}
            onClick={() => onSelect(info.id)}
          >
            <span className="formation-card-icon">{info.icon}</span>
            <span className="formation-card-name">{info.name}</span>
            <span className="formation-card-desc">{info.description}</span>
          </button>
        ))}
      </div>
      <button className="formation-confirm-btn" onClick={onDeploy}>
        DEPLOY
      </button>
    </div>
  );
}

// --- Load Animation sub-component (same as LinePage) ---

interface LoadAnimationProps {
  result: LoadResult;
  onComplete: () => void;
}

function LoadAnimation({ result, onComplete }: LoadAnimationProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
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

        setTimeout(() => {
          onCompleteRef.current();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="load-sequence">
      <div className="load-title">RELOADING</div>
      <div className="load-steps-row" id="load-steps-row" ref={rowRef} />
    </div>
  );
}
