import { useRef, useCallback } from 'react';
import type { BattleState, LoadResult, ValorRollResult } from '../../types';
import { ActionId, BattlePhase, DrillStep } from '../../types';
import { resolveAutoVolley, resolveAutoGorgeVolley } from '../../core/volleys';
import { getChargeEncounter } from '../../core/charge';
import { saveGame } from '../../core/persistence';
import { playVolleySound, playDistantVolleySound } from '../../audio';
import { switchTrack } from '../../music';
import { wait } from '../../utils/helpers';
import { useSettingsStore } from '../../stores/settingsStore';

const SPEED_MULTIPLIERS: Record<string, number> = {
  slow: 1.6,
  normal: 1.0,
  fast: 0.5,
};

function getAutoPlaySpeedMultiplier(): number {
  return SPEED_MULTIPLIERS[useSettingsStore.getState().autoPlaySpeed] ?? 1.0;
}
import { useGameStore } from '../../stores/gameStore';
import type { NarrativeScrollHandle } from './NarrativeScroll';
import type { PanoramaHandle } from './Panorama';

function speedWait(ms: number): Promise<void> {
  return wait(ms * getAutoPlaySpeedMultiplier()) as Promise<void>;
}

export interface AutoPlayCallbacks {
  /** Force a React re-render to reflect latest battleState */
  syncState: () => void;
  /** Show the valor roll display in the actions area */
  showValorRoll: (result: ValorRollResult) => void;
  /** Show the load animation in the actions area, resolves when complete */
  showLoadAnimation: (result: LoadResult) => Promise<void>;
  /** Handle grace interception (shows overlay, restores health) */
  tryUseGrace: () => boolean;
  showGraceIntervenes: () => Promise<void>;
}

export interface AutoPlayControls {
  /** Start Part 1 auto-play (volleys 1-4 with story beats between) */
  startPart1: () => Promise<void>;
  /** Start Part 2 auto-play (volleys 5-7) */
  startPart2: () => Promise<void>;
  /** Start Part 3 auto-play (gorge volleys 8-11 with target selection) */
  startPart3: () => Promise<void>;
  /** Resume auto-play from a given volley range (for save/reload) */
  resumeVolleys: (startIdx: number, endIdx: number) => Promise<void>;
  /** Set the target choice resolver for gorge target selection */
  resolveGorgeTarget: (actionId: ActionId) => void;
  /** Whether a gorge target choice is currently pending */
  isAwaitingGorgeTarget: () => boolean;
}

/**
 * useAutoPlay encapsulates the async auto-play loop for all line battle parts.
 * It manipulates the BattleState directly (same as the old imperative code) and
 * calls syncState() to trigger React re-renders at key points.
 *
 * The narrative scroll and panorama are accessed via refs for direct DOM manipulation
 * during animations, avoiding React re-render overhead.
 */
export function useAutoPlay(
  battleStateRef: React.MutableRefObject<BattleState>,
  narrativeRef: React.RefObject<NarrativeScrollHandle | null>,
  panoramaRef: React.RefObject<PanoramaHandle | null>,
  callbacks: AutoPlayCallbacks,
): AutoPlayControls {
  const processingRef = useRef(false);
  const gorgeTargetResolverRef = useRef<((id: ActionId) => void) | null>(null);
  const awaitingGorgeTargetRef = useRef(false);

  const getState = useCallback(() => battleStateRef.current, [battleStateRef]);

  const getGameState = useCallback(() => {
    return useGameStore.getState().gameState!;
  }, []);

  const finishAutoPlay = useCallback(() => {
    const state = getState();
    state.autoPlayActive = false;
    const gs = getGameState();
    gs.battleState = state;
    processingRef.current = false;
    callbacks.syncState();
  }, [getState, getGameState, callbacks]);

  // --- Core volley loop (Parts 1 & 2) ---
  const autoPlayVolleys = useCallback(
    async (startIdx: number, endIdx: number) => {
      const scroll = narrativeRef.current;

      for (let i = startIdx; i <= endIdx; i++) {
        const state = getState();
        const volleyNum = i + 1;
        state.scriptedVolley = volleyNum;
        state.turn += 1;
        state.pendingMoraleChanges = [];
        state.line.casualtiesThisTurn = 0;
        state.lastLoadResult = undefined;

        // 1. PRESENT
        state.drillStep = DrillStep.Present;
        callbacks.syncState();

        const presentText = `\u2014 Volley ${volleyNum} \u2014 ${state.enemy.range} paces \u2014`;
        scroll?.crossFade([{ type: 'order', text: presentText }]);
        await speedWait(1500);

        // 2. FIRE
        state.drillStep = DrillStep.Fire;
        callbacks.syncState();

        const fireOrders: Record<number, string> = {
          0: '"Feu!" The captain\'s sword drops.',
          1: '"FIRE!" The word tears down the line.',
          2: '"FIRE!" At fifty paces, the captain\'s voice is raw.',
          3: '"Tirez! Derni\u00e8re salve!" Point blank.',
          4: '"FIRE!" Again. The new column at a hundred paces.',
          5: '"FIRE!" Sixty paces. The right flank exposed.',
          6: '"FIRE!" Forty paces. The last volley.',
        };
        scroll?.appendEntry({ type: 'order', text: fireOrders[i] || '"FIRE!"' });
        await speedWait(800);

        // 3. French volley animation
        playVolleySound();
        await playVolleyAnimation('french', panoramaRef);
        await speedWait(400);

        // 4. Resolve volley
        const result = resolveAutoVolley(state, i);
        const gs = getGameState();
        gs.battleState = state;
        callbacks.syncState();

        // Show fire result narratives
        const fireNarratives = result.narratives.filter(
          (n) => n.type === 'result' || n.type === 'action',
        );
        for (const n of fireNarratives.slice(0, 3)) {
          scroll?.appendEntry(n);
        }
        await speedWait(1500);

        // 5. ENDURE - Austrian return fire
        state.drillStep = DrillStep.Endure;
        callbacks.syncState();

        playDistantVolleySound();
        await playVolleyAnimation('austrian', panoramaRef);

        const endureNarratives = result.narratives.filter(
          (n) => n.type === 'event' || n.type === 'narrative',
        );
        for (const n of endureNarratives.slice(0, 4)) {
          scroll?.appendEntry(n);
        }
        await speedWait(2000);

        // 6. Valor roll display
        if (result.valorRoll) {
          callbacks.showValorRoll(result.valorRoll);
          await speedWait(2000);
        }

        // 7. Line integrity
        const integrityText =
          result.lineIntegrityChange < 0
            ? `Line integrity: ${Math.round(state.line.lineIntegrity)}% (${result.lineIntegrityChange})`
            : `Line holds firm. Integrity: ${Math.round(state.line.lineIntegrity)}%`;
        scroll?.appendEntry({ type: 'event', text: integrityText });
        await speedWait(1000);

        // 8. Load animation
        state.drillStep = DrillStep.Load;
        callbacks.syncState();
        if (state.lastLoadResult) {
          await callbacks.showLoadAnimation(state.lastLoadResult);
        }
        await speedWait(500);

        // 9. Save
        state.autoPlayVolleyCompleted = i + 1;
        saveGame(getGameState());

        // Check death
        if (result.playerDied) {
          if (callbacks.tryUseGrace()) {
            await callbacks.showGraceIntervenes();
            callbacks.syncState();
          } else {
            state.battleOver = true;
            state.outcome = 'defeat';
            finishAutoPlay();
            return;
          }
        }

        state.drillStep = DrillStep.Present;
      }

      // After batch completes
      if (endIdx === 3) {
        transitionToMelee();
      } else if (endIdx === 6) {
        transitionToGorge();
      }
    },
    [getState, getGameState, callbacks, narrativeRef, panoramaRef, finishAutoPlay],
  );

  // --- Gorge volley loop (Part 3) ---
  const autoPlayGorgeVolleys = useCallback(
    async (startIdx: number, endIdx: number) => {
      const scroll = narrativeRef.current;

      for (let i = startIdx; i <= endIdx; i++) {
        const state = getState();
        const volleyNum = i + 1;
        state.scriptedVolley = volleyNum;
        state.turn += 1;
        state.pendingMoraleChanges = [];
        state.line.casualtiesThisTurn = 0;
        state.lastLoadResult = undefined;

        // 1. PRESENT
        state.drillStep = DrillStep.Present;
        callbacks.syncState();

        const presentText = `\u2014 Volley ${volleyNum} \u2014 Fire at Will \u2014`;
        scroll?.crossFade([{ type: 'order', text: presentText }]);
        await speedWait(1500);

        // 2. PAUSE for target selection
        state.autoPlayActive = false;
        const gs1 = getGameState();
        gs1.battleState = state;
        awaitingGorgeTargetRef.current = true;
        callbacks.syncState();

        const targetAction = await new Promise<ActionId>((resolve) => {
          gorgeTargetResolverRef.current = resolve;
        });
        awaitingGorgeTargetRef.current = false;
        gorgeTargetResolverRef.current = null;

        // 3. Resume auto-play
        state.autoPlayActive = true;
        const gs2 = getGameState();
        gs2.battleState = state;
        callbacks.syncState();

        const gorgeFireOrders: Record<number, string> = {
          7: '"Fire at will!"',
          8: '"Again!"',
          9: '"Fire!"',
          10: '"Final volley!"',
        };
        scroll?.appendEntry({ type: 'order', text: gorgeFireOrders[i] || '"FIRE!"' });
        await speedWait(800);

        // 4. French volley
        playVolleySound();
        await playVolleyAnimation('french', panoramaRef);
        await speedWait(400);

        // 5. Resolve gorge volley
        state.drillStep = DrillStep.Fire;
        callbacks.syncState();

        const result = resolveAutoGorgeVolley(state, i, targetAction);
        const gs3 = getGameState();
        gs3.battleState = state;
        callbacks.syncState();

        const fireNarratives = result.narratives.filter(
          (n) => n.type === 'result' || n.type === 'action',
        );
        for (const n of fireNarratives.slice(0, 3)) {
          scroll?.appendEntry(n);
        }
        await speedWait(1500);

        const endureNarratives = result.narratives.filter(
          (n) => n.type === 'event' || n.type === 'narrative',
        );
        for (const n of endureNarratives.slice(0, 4)) {
          scroll?.appendEntry(n);
        }
        await speedWait(1500);

        // 6. Load animation
        state.drillStep = DrillStep.Load;
        callbacks.syncState();
        if (state.lastLoadResult) {
          await callbacks.showLoadAnimation(state.lastLoadResult);
        }
        await speedWait(500);

        // 7. Save
        state.autoPlayVolleyCompleted = i + 1;
        saveGame(getGameState());

        // Check death
        if (result.playerDied) {
          if (callbacks.tryUseGrace()) {
            await callbacks.showGraceIntervenes();
            callbacks.syncState();
          } else {
            state.battleOver = true;
            state.outcome = 'defeat';
            finishAutoPlay();
            return;
          }
        }

        state.drillStep = DrillStep.Present;
      }

      // All gorge volleys complete
      transitionToAftermath();
    },
    [getState, getGameState, callbacks, narrativeRef, panoramaRef, finishAutoPlay],
  );

  // --- Transition helpers ---
  const transitionToMelee = useCallback(() => {
    const state = getState();
    state.autoPlayActive = false;
    state.autoPlayVolleyCompleted = 4;
    state.phase = BattlePhase.StoryBeat;
    state.chargeEncounter = 6;
    const storyBeat = getChargeEncounter(state);
    state.log.push({ turn: state.turn, text: storyBeat.narrative, type: 'narrative' });

    const gs = getGameState();
    const updated = { ...gs, battleState: state };
    saveGame(updated);
    switchTrack('dreams');
    processingRef.current = false;
    useGameStore.getState().setGameState(updated);
  }, [getState, getGameState, callbacks]);

  const transitionToGorge = useCallback(() => {
    const state = getState();
    state.autoPlayActive = false;
    state.phase = BattlePhase.StoryBeat;
    state.chargeEncounter = 3;
    const storyBeat = getChargeEncounter(state);
    state.log.push({ turn: state.turn, text: storyBeat.narrative, type: 'narrative' });

    const gs = getGameState();
    const updated = { ...gs, battleState: state };
    saveGame(updated);
    switchTrack('dreams');
    processingRef.current = false;
    useGameStore.getState().setGameState(updated);
  }, [getState, getGameState, callbacks]);

  const transitionToAftermath = useCallback(() => {
    const state = getState();
    state.autoPlayActive = false;
    state.phase = BattlePhase.StoryBeat;
    state.chargeEncounter = 4;
    const storyBeat = getChargeEncounter(state);
    state.log.push({ turn: state.turn, text: storyBeat.narrative, type: 'narrative' });

    const gs = getGameState();
    const updated = { ...gs, battleState: state };
    saveGame(updated);
    switchTrack('dreams');
    processingRef.current = false;
    useGameStore.getState().setGameState(updated);
  }, [getState, getGameState, callbacks]);

  // --- Public API ---
  const startPart1 = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const state = getState();
    state.autoPlayActive = true;
    const gs = getGameState();
    gs.battleState = state;
    callbacks.syncState();
    switchTrack('battle');

    // Volleys 1-2
    await autoPlayVolleys(0, 1);

    if (state.player.health <= 0) {
      finishAutoPlay();
      return;
    }

    // Wounded Sergeant story beat after volley 2
    state.autoPlayActive = false;
    state.phase = BattlePhase.StoryBeat;
    state.chargeEncounter = 5;
    const gs2 = getGameState();

    const storyBeat = getChargeEncounter(state);
    state.log.push({ turn: state.turn, text: storyBeat.narrative, type: 'narrative' });

    const updated2 = { ...gs2, battleState: state };
    saveGame(updated2);
    switchTrack('dreams');
    processingRef.current = false;
    useGameStore.getState().setGameState(updated2);
    // Player makes choice -> handleChargeAction -> Continue -> resumeVolleys(2, 3)
  }, [getState, getGameState, callbacks, autoPlayVolleys, finishAutoPlay]);

  const startPart2 = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const state = getState();
    state.autoPlayActive = true;
    const gs = getGameState();
    gs.battleState = state;
    switchTrack('battle');
    callbacks.syncState();

    await autoPlayVolleys(4, 6);
  }, [getState, getGameState, callbacks, autoPlayVolleys]);

  const startPart3 = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const state = getState();
    state.autoPlayActive = true;
    const gs = getGameState();
    gs.battleState = state;
    callbacks.syncState();

    const startIdx = Math.max(7, state.scriptedVolley - 1);
    await autoPlayGorgeVolleys(startIdx, 10);
  }, [getState, getGameState, callbacks, autoPlayGorgeVolleys]);

  const resumeVolleys = useCallback(
    async (startIdx: number, endIdx: number) => {
      processingRef.current = true;
      const state = getState();
      state.autoPlayActive = true;
      const gs = getGameState();
      gs.battleState = state;
      switchTrack('battle');
      callbacks.syncState();
      await autoPlayVolleys(startIdx, endIdx);
    },
    [getState, getGameState, callbacks, autoPlayVolleys],
  );

  const resolveGorgeTarget = useCallback((actionId: ActionId) => {
    if (gorgeTargetResolverRef.current) {
      gorgeTargetResolverRef.current(actionId);
    }
  }, []);

  const isAwaitingGorgeTarget = useCallback(() => {
    return awaitingGorgeTargetRef.current;
  }, []);

  return {
    startPart1,
    startPart2,
    startPart3,
    resumeVolleys,
    resolveGorgeTarget,
    isAwaitingGorgeTarget,
  };
}

// --- Helper: play volley animation via panorama ref ---
async function playVolleyAnimation(
  direction: 'french' | 'austrian',
  panoramaRef: React.RefObject<PanoramaHandle | null>,
): Promise<void> {
  // Create streaks in the #volley-streaks container (inside Panorama)
  return new Promise((resolve) => {
    const container = document.getElementById('volley-streaks');
    if (!container) {
      resolve();
      return;
    }

    const count = 6 + Math.floor(Math.random() * 5);
    const cls = direction === 'french' ? 'french-fire' : 'austrian-fire';
    const streaks: HTMLElement[] = [];

    for (let i = 0; i < count; i++) {
      const streak = document.createElement('div');
      streak.className = `volley-streak ${cls}`;
      streak.style.top = `${10 + Math.random() * 80}%`;
      streak.style.animationDelay = `${i * 40 + Math.random() * 60}ms`;
      container.appendChild(streak);
      streaks.push(streak);
    }

    // Flash the target block
    setTimeout(() => {
      const targetId = direction === 'french' ? 'block-austrian' : 'block-french';
      const flashCls = direction === 'french' ? 'flash' : 'flash-hit';
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add(flashCls);
        setTimeout(() => target.classList.remove(flashCls), 300);
      }
    }, 200);

    setTimeout(() => {
      streaks.forEach((s) => s.remove());
      resolve();
    }, 600);
  });
}
