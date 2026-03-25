import React, { useRef, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Panorama } from '@game/components/line/Panorama';
import type { PanoramaHandle } from '@game/components/line/Panorama';
import { NarrativeScroll } from '@game/components/line/NarrativeScroll';
import type { NarrativeScrollHandle, NarrativeEntry } from '@game/components/line/NarrativeScroll';
import { DrillIndicator } from '@game/components/line/DrillIndicator';
import { LineStatus } from '@game/components/line/LineStatus';
import { EnemyPanel } from '@game/components/line/EnemyPanel';
import { MeterBar } from '@game/components/shared/MeterBar';
import { MoraleThreshold, HealthState } from '@game/types';
import type { PreviewConfig } from '../../utils/mockBattleState';
import { previewConfigToBattleState } from '../../utils/mockBattleState';

/* ------------------------------------------------------------------ */
/*  Public handle for imperative control from parent                   */
/* ------------------------------------------------------------------ */

export interface GamePreviewHandle {
  flashBlock: (target: 'french' | 'austrian', flashCls: string) => void;
  playStreaks: (direction: 'french' | 'austrian') => Promise<void>;
  crossFade: (entries: NarrativeEntry[]) => void;
  appendNarrative: (entry: NarrativeEntry) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

/* ------------------------------------------------------------------ */
/*  Health state labels                                                */
/* ------------------------------------------------------------------ */

const HEALTH_LABELS: Record<string, string> = {
  unhurt: 'UNHURT',
  wounded: 'WOUNDED',
  badly_wounded: 'BADLY WOUNDED',
  critical: 'CRITICAL',
};

/* ------------------------------------------------------------------ */
/*  GamePreview — faithful reproduction of LinePage layout              */
/* ------------------------------------------------------------------ */

interface GamePreviewProps {
  config: PreviewConfig;
}

export const GamePreview = forwardRef<GamePreviewHandle, GamePreviewProps>(
  function GamePreview({ config }, ref) {
    const panoramaRef = useRef<PanoramaHandle>(null);
    const narrativeRef = useRef<NarrativeScrollHandle>(null);

    const battleState = useMemo(() => previewConfigToBattleState(config), [config]);

    useImperativeHandle(ref, () => ({
      flashBlock(target: 'french' | 'austrian', flashCls: string) {
        panoramaRef.current?.flashBlock(target, flashCls);
      },
      playStreaks(direction: 'french' | 'austrian'): Promise<void> {
        return new Promise((resolve) => {
          const container = document.getElementById('volley-streaks');
          if (!container) { resolve(); return; }

          const count = 10 + Math.floor(Math.random() * 8);
          const cls = direction === 'french' ? 'french-fire' : 'austrian-fire';
          const streaks: HTMLElement[] = [];

          for (let i = 0; i < count; i++) {
            const streak = document.createElement('div');
            streak.className = `volley-streak ${cls}`;
            streak.style.top = `${10 + Math.random() * 80}%`;
            streak.style.animationDelay = `${i * 50 + Math.random() * 80}ms`;
            streak.style.height = `${2 + Math.random() * 2}px`;
            streak.style.width = `${16 + Math.random() * 16}px`;
            container.appendChild(streak);
            streaks.push(streak);
          }

          // Flash target block after streaks travel
          setTimeout(() => {
            const flashCls = direction === 'french' ? 'flash-hit' : 'flash';
            const flashTarget = direction === 'french' ? 'austrian' : 'french';
            panoramaRef.current?.flashBlock(flashTarget, flashCls);
          }, 500);

          // Lingering smoke after volley
          setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'volley-smoke';
            container.appendChild(smoke);
            smoke.addEventListener('animationend', () => smoke.remove());
          }, 600);

          // Cleanup
          setTimeout(() => {
            streaks.forEach((s) => s.remove());
            resolve();
          }, 1500);
        });
      },
      crossFade(entries: NarrativeEntry[]) {
        narrativeRef.current?.crossFade(entries);
      },
      appendNarrative(entry: NarrativeEntry) {
        narrativeRef.current?.appendEntry(entry);
      },
      scrollToTop() {
        narrativeRef.current?.scrollToTop();
      },
      scrollToBottom() {
        narrativeRef.current?.scrollToBottom();
      },
    }));

    const { player } = battleState;

    const moraleStateLabel = player.moraleThreshold.toUpperCase();
    const moraleStateClass =
      player.moraleThreshold !== MoraleThreshold.Steady ? player.moraleThreshold : undefined;

    const healthStateLabel = HEALTH_LABELS[player.healthState] || player.healthState.toUpperCase();
    const healthStateClass =
      player.healthState !== HealthState.Unhurt ? player.healthState : undefined;

    return (
      <div className="lb-game-preview phase-line">
        <main className="battle-main">
          {/* LEFT: Player condition + line status */}
          <aside className="panel panel-left">
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
            <MeterBar
              label="Stamina"
              value={player.stamina}
              max={player.maxStamina}
              fillClass="stamina-fill"
            />
            <div className="status-row">
              <span className="status-key">Musket</span>
              <span
                className="status-val"
                style={{
                  color: player.musketLoaded ? 'var(--health-high)' : 'var(--morale-low)',
                }}
              >
                {player.musketLoaded ? 'Loaded' : 'Empty'}
              </span>
            </div>
            <LineStatus battleState={battleState} />
          </aside>

          {/* CENTER: Narrative + Panorama + Drill */}
          <section className="center-column">
            <NarrativeScroll ref={narrativeRef} />
            <Panorama ref={panoramaRef} battleState={battleState} />
            <div className="actions-panel">
              <DrillIndicator battleState={battleState} />
            </div>
          </section>

          {/* RIGHT: The Enemy */}
          <aside className="panel panel-right">
            <EnemyPanel battleState={battleState} />
          </aside>
        </main>
      </div>
    );
  },
);
