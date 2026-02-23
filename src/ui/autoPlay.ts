import { appState, triggerRender } from './state';
import { $ } from './dom';
import { ActionId, BattlePhase, DrillStep } from '../types';
import { resolveAutoVolley, resolveAutoGorgeVolley } from '../core/volleys';
import { getChargeEncounter } from '../core/charge';
import { saveGame } from '../core/persistence';
import { playVolleySound, playDistantVolleySound } from '../audio';
import { switchTrack } from '../music';
import { wait } from './helpers';
import { tryUseGrace, showGraceIntervenes } from './meleePhase';
import { getAutoPlaySpeedMultiplier } from '../settings';

function speedWait(ms: number) {
  return wait(ms * getAutoPlaySpeedMultiplier());
}

// These functions are defined in app.ts and passed in via callback pattern
// to avoid circular dependency (autoPlay needs render helpers, app.ts defines them)
let _renderDrillIndicator: () => void = () => {};
let _renderPanorama: () => void = () => {};
let _renderMeters: () => void = () => {};
let _renderLineStatus: () => void = () => {};
let _renderEnemyPanel: () => void = () => {};
let _crossFadeNarrative: (
  scroll: HTMLElement,
  entries: Array<{ type: string; text: string }>,
) => void = () => {};
let _appendNarrativeEntry: (
  scroll: HTMLElement,
  entry: { type: string; text: string },
) => void = () => {};
let _playVolleyAnimation: (direction: 'french' | 'austrian') => Promise<void> = async () => {};
let _showLoadAnimation: (result: import('../types').LoadResult) => Promise<void> = async () => {};
let _showValorRollDisplay: (result: import('../types').ValorRollResult) => void = () => {};

export function setAutoPlayCallbacks(callbacks: {
  renderDrillIndicator: () => void;
  renderPanorama: () => void;
  renderMeters: () => void;
  renderLineStatus: () => void;
  renderEnemyPanel: () => void;
  crossFadeNarrative: (scroll: HTMLElement, entries: Array<{ type: string; text: string }>) => void;
  appendNarrativeEntry: (scroll: HTMLElement, entry: { type: string; text: string }) => void;
  playVolleyAnimation: (direction: 'french' | 'austrian') => Promise<void>;
  showLoadAnimation: (result: import('../types').LoadResult) => Promise<void>;
  showValorRollDisplay: (result: import('../types').ValorRollResult) => void;
}) {
  _renderDrillIndicator = callbacks.renderDrillIndicator;
  _renderPanorama = callbacks.renderPanorama;
  _renderMeters = callbacks.renderMeters;
  _renderLineStatus = callbacks.renderLineStatus;
  _renderEnemyPanel = callbacks.renderEnemyPanel;
  _crossFadeNarrative = callbacks.crossFadeNarrative;
  _appendNarrativeEntry = callbacks.appendNarrativeEntry;
  _playVolleyAnimation = callbacks.playVolleyAnimation;
  _showLoadAnimation = callbacks.showLoadAnimation;
  _showValorRollDisplay = callbacks.showValorRollDisplay;
}

export async function autoPlayPart1() {
  if (appState.processing) return;
  appState.processing = true;

  appState.state.autoPlayActive = true;
  appState.gameState.battleState = appState.state;
  triggerRender();

  // Switch to battle music
  switchTrack('battle');

  // Play volleys 1-2
  await autoPlayVolleys(0, 1);

  if (appState.state.player.health <= 0) {
    finishAutoPlay();
    return;
  }

  // After Volley 2: Wounded Sergeant story beat
  appState.state.autoPlayActive = false;
  appState.state.phase = BattlePhase.StoryBeat;
  appState.state.chargeEncounter = 5;
  appState.gameState.battleState = appState.state;

  // Show the story beat
  const storyBeat = getChargeEncounter(appState.state);
  appState.state.log.push({
    turn: appState.state.turn,
    text: storyBeat.narrative,
    type: 'narrative',
  });

  // Switch to dreams music for story beat
  switchTrack('dreams');
  triggerRender();

  appState.processing = false;
  // Player makes choice -> handleChargeAction -> Continue -> autoPlayVolleys(2,3)
}

export async function autoPlayVolleys(startIdx: number, endIdx: number) {
  const scroll = $('narrative-scroll');

  for (let i = startIdx; i <= endIdx; i++) {
    const volleyNum = i + 1; // 1-based volley number
    appState.state.scriptedVolley = volleyNum;
    appState.state.turn += 1;
    appState.state.pendingMoraleChanges = [];
    appState.state.line.casualtiesThisTurn = 0;
    appState.state.lastLoadResult = undefined;

    // --- 1. Update drill indicator to PRESENT ---
    appState.state.drillStep = DrillStep.Present;
    _renderDrillIndicator();
    _renderPanorama();
    _renderMeters();
    _renderLineStatus();
    _renderEnemyPanel();

    // Cross-fade to volley narrative
    const presentText = `\u2014 Volley ${volleyNum} \u2014 ${appState.state.enemy.range} paces \u2014`;
    _crossFadeNarrative(scroll, [{ type: 'order', text: presentText }]);
    await speedWait(1500);

    // --- 2. Update to FIRE ---
    appState.state.drillStep = DrillStep.Fire;
    _renderDrillIndicator();

    // Show captain's order briefly
    const fireOrders: Record<number, string> = {
      0: '"Feu!" The captain\'s sword drops.',
      1: '"FIRE!" The word tears down the line.',
      2: '"FIRE!" At fifty paces, the captain\'s voice is raw.',
      3: '"Tirez! Derni\u00e8re salve!" Point blank.',
      4: '"FIRE!" Again. The new column at a hundred paces.',
      5: '"FIRE!" Sixty paces. The right flank exposed.',
      6: '"FIRE!" Forty paces. The last volley.',
    };
    _appendNarrativeEntry(scroll, { type: 'order', text: fireOrders[i] || '"FIRE!"' });
    await speedWait(800);

    // --- 3. Play French volley animation ---
    playVolleySound();
    await _playVolleyAnimation('french');
    await speedWait(400);

    // --- 4. Resolve the volley (all 4 drill steps in one call) ---
    const result = resolveAutoVolley(appState.state, i);
    appState.gameState.battleState = appState.state;

    // Update UI with results
    _renderMeters();
    _renderLineStatus();
    _renderEnemyPanel();
    _renderPanorama();

    // Show fire result narrative
    const fireNarratives = result.narratives.filter(
      (n) => n.type === 'result' || n.type === 'action',
    );
    for (const n of fireNarratives.slice(0, 3)) {
      _appendNarrativeEntry(scroll, n);
    }
    await speedWait(1500);

    // --- 5. Update to ENDURE, play Austrian volley ---
    appState.state.drillStep = DrillStep.Endure;
    _renderDrillIndicator();

    playDistantVolleySound();
    await _playVolleyAnimation('austrian');

    // Show return fire / event narratives
    const endureNarratives = result.narratives.filter(
      (n) => n.type === 'event' || n.type === 'narrative',
    );
    for (const n of endureNarratives.slice(0, 4)) {
      _appendNarrativeEntry(scroll, n);
    }
    await speedWait(2000);

    // --- 6. Show VALOR ROLL display (after enduring enemy fire) ---
    if (result.valorRoll) {
      _showValorRollDisplay(result.valorRoll);
      await speedWait(2000);
    }

    // --- 7. Show line integrity result ---
    const integrityText =
      result.lineIntegrityChange < 0
        ? `Line integrity: ${Math.round(appState.state.line.lineIntegrity)}% (${result.lineIntegrityChange})`
        : `Line holds firm. Integrity: ${Math.round(appState.state.line.lineIntegrity)}%`;
    _appendNarrativeEntry(scroll, { type: 'event', text: integrityText });
    await speedWait(1000);

    // --- 8. Show load animation ---
    appState.state.drillStep = DrillStep.Load;
    _renderDrillIndicator();
    if (appState.state.lastLoadResult) {
      await _showLoadAnimation(appState.state.lastLoadResult);
    }
    await speedWait(500);

    // --- 9. Save state ---
    appState.state.autoPlayVolleyCompleted = i + 1;
    saveGame(appState.gameState);

    // Check for death
    if (result.playerDied) {
      if (tryUseGrace()) {
        await showGraceIntervenes();
        _renderMeters();
        // Continue the volley loop -- player lives on
      } else {
        appState.state.battleOver = true;
        appState.state.outcome = 'defeat';
        finishAutoPlay();
        return;
      }
    }

    // Advance scriptedVolley for next iteration
    appState.state.drillStep = DrillStep.Present;
  }

  // After all volleys in this batch complete
  if (endIdx === 3) {
    // Part 1: All 4 volleys done -> transition to melee
    transitionToMelee();
  } else if (endIdx === 6) {
    // Part 2: All 3 volleys done -> transition to gorge story beat
    transitionToGorge();
  }
}

function transitionToMelee() {
  appState.state.autoPlayActive = false;
  appState.state.autoPlayVolleyCompleted = 4;

  // Show as a story beat parchment -- player clicks "Fix bayonets" to enter melee
  appState.state.phase = BattlePhase.StoryBeat;
  appState.state.chargeEncounter = 6;
  const storyBeat = getChargeEncounter(appState.state);
  appState.state.log.push({
    turn: appState.state.turn,
    text: storyBeat.narrative,
    type: 'narrative',
  });

  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);

  switchTrack('dreams');
  appState.lastRenderedTurn = -1;
  appState.phaseLogStart = appState.state.log.length;
  triggerRender();
  appState.processing = false;
}

function finishAutoPlay() {
  appState.state.autoPlayActive = false;
  appState.gameState.battleState = appState.state;
  appState.lastRenderedTurn = -1;
  appState.phaseLogStart = appState.state.log.length;
  triggerRender();
  appState.processing = false;
}

export async function autoPlayPart2() {
  if (appState.processing) return;
  appState.processing = true;
  appState.state.autoPlayActive = true;
  appState.gameState.battleState = appState.state;
  switchTrack('battle');
  triggerRender();
  await autoPlayVolleys(4, 6); // volleys 5-7 (0-based indices)
}

export async function autoPlayPart3() {
  if (appState.processing) return;
  appState.processing = true;
  appState.state.autoPlayActive = true;
  appState.gameState.battleState = appState.state;
  triggerRender();
  // Start from current volley (supports dev tools jump to V9/V10/V11)
  const startIdx = Math.max(7, appState.state.scriptedVolley - 1);
  await autoPlayGorgeVolleys(startIdx, 10); // 0-based indices
}

async function autoPlayGorgeVolleys(startIdx: number, endIdx: number) {
  const scroll = $('narrative-scroll');

  for (let i = startIdx; i <= endIdx; i++) {
    const volleyNum = i + 1; // 1-based volley number
    appState.state.scriptedVolley = volleyNum;
    appState.state.turn += 1;
    appState.state.pendingMoraleChanges = [];
    appState.state.line.casualtiesThisTurn = 0;
    appState.state.lastLoadResult = undefined;

    // --- 1. Update drill indicator to PRESENT ---
    appState.state.drillStep = DrillStep.Present;
    _renderDrillIndicator();
    _renderPanorama();
    _renderMeters();
    _renderLineStatus();
    _renderEnemyPanel();

    // Cross-fade to volley banner
    const presentText = `\u2014 Volley ${volleyNum} \u2014 Fire at Will \u2014`;
    _crossFadeNarrative(scroll, [{ type: 'order', text: presentText }]);
    await speedWait(1500);

    // --- 2. PAUSE: show target buttons, await player choice ---
    appState.state.autoPlayActive = false;
    appState.gameState.battleState = appState.state;
    triggerRender();

    const targetAction = await waitForGorgeTargetChoice();

    // --- 3. Resume auto-play, resolve gorge volley ---
    appState.state.autoPlayActive = true;
    appState.gameState.battleState = appState.state;
    triggerRender();

    // Show target choice narrative
    const gorgeFireOrders: Record<number, string> = {
      7: '"Fire at will!"',
      8: '"Again!"',
      9: '"Fire!"',
      10: '"Final volley!"',
    };
    _appendNarrativeEntry(scroll, { type: 'order', text: gorgeFireOrders[i] || '"FIRE!"' });
    await speedWait(800);

    // --- 4. Play French volley animation ---
    playVolleySound();
    await _playVolleyAnimation('french');
    await speedWait(400);

    // --- 5. Resolve the gorge volley ---
    appState.state.drillStep = DrillStep.Fire;
    _renderDrillIndicator();

    const result = resolveAutoGorgeVolley(appState.state, i, targetAction);
    appState.gameState.battleState = appState.state;

    // Update UI with results
    _renderMeters();
    _renderLineStatus();
    _renderEnemyPanel();
    _renderPanorama();

    // Show fire result narratives
    const fireNarratives = result.narratives.filter(
      (n) => n.type === 'result' || n.type === 'action',
    );
    for (const n of fireNarratives.slice(0, 3)) {
      _appendNarrativeEntry(scroll, n);
    }
    await speedWait(1500);

    // Show event/narrative entries (endure events injected by gorge)
    const endureNarratives = result.narratives.filter(
      (n) => n.type === 'event' || n.type === 'narrative',
    );
    for (const n of endureNarratives.slice(0, 4)) {
      _appendNarrativeEntry(scroll, n);
    }
    await speedWait(1500);

    // --- 6. Show load animation ---
    appState.state.drillStep = DrillStep.Load;
    _renderDrillIndicator();
    if (appState.state.lastLoadResult) {
      await _showLoadAnimation(appState.state.lastLoadResult);
    }
    await speedWait(500);

    // --- 7. Save state ---
    appState.state.autoPlayVolleyCompleted = i + 1;
    saveGame(appState.gameState);

    // Check for death (unlikely in gorge but possible)
    if (result.playerDied) {
      if (tryUseGrace()) {
        await showGraceIntervenes();
        _renderMeters();
        // Continue -- player lives on
      } else {
        appState.state.battleOver = true;
        appState.state.outcome = 'defeat';
        finishAutoPlay();
        return;
      }
    }

    appState.state.drillStep = DrillStep.Present;
  }

  // All gorge volleys complete -> transition to aftermath
  transitionToAftermath();
}

function waitForGorgeTargetChoice(): Promise<ActionId> {
  return new Promise((resolve) => {
    const grid = $('actions-grid');
    grid.innerHTML = '';

    const targets: { id: ActionId; name: string; description: string }[] = [
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
        description: 'Lower your musket. These men are already beaten. The line fires without you.',
      },
    ];

    for (const target of targets) {
      // Hide wagon option if already detonated
      if (target.id === ActionId.TargetWagon && appState.state.wagonDamage >= 100) continue;

      const btn = document.createElement('button');
      btn.className = 'action-btn';
      if (target.id === ActionId.ShowMercy) {
        btn.classList.add('endure-action');
      } else {
        btn.classList.add('fire-action');
      }
      btn.innerHTML = `
        <span class="action-name">${target.name}</span>
        <span class="action-desc">${target.description}</span>
      `;
      btn.addEventListener('click', () => {
        resolve(target.id);
      });
      grid.appendChild(btn);
    }
  });
}

function transitionToGorge() {
  appState.state.autoPlayActive = false;
  appState.state.phase = BattlePhase.StoryBeat;
  appState.state.chargeEncounter = 3;
  const storyBeat = getChargeEncounter(appState.state);
  appState.state.log.push({
    turn: appState.state.turn,
    text: storyBeat.narrative,
    type: 'narrative',
  });
  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);
  switchTrack('dreams');
  appState.lastRenderedTurn = -1;
  appState.phaseLogStart = appState.state.log.length;
  triggerRender();
  appState.processing = false;
}

function transitionToAftermath() {
  appState.state.autoPlayActive = false;
  appState.state.phase = BattlePhase.StoryBeat;
  appState.state.chargeEncounter = 4;
  const storyBeat = getChargeEncounter(appState.state);
  appState.state.log.push({
    turn: appState.state.turn,
    text: storyBeat.narrative,
    type: 'narrative',
  });
  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);
  switchTrack('dreams');
  appState.lastRenderedTurn = -1;
  appState.phaseLogStart = appState.state.log.length;
  triggerRender();
  appState.processing = false;
}
