import { beginBattle, advanceTurn, resolveAutoFumbleFire } from './core/battle';
import { resetEventTexts } from './core/events';
import { getChargeEncounter } from './core/charge';
import {
  ActionId, MoraleThreshold, DrillStep,
  HealthState, StaminaState, LoadResult,
  BattlePhase, ChargeChoiceId,
  GamePhase, ValorRollResult,
  getStaminaTierInfo,
} from './types';
import { createNewGame } from './core/gameLoop';
import { getScriptedAvailableActions } from './core/scriptedVolleys';
import { initDevTools } from './devtools';
import { playVolleySound, playDistantVolleySound } from './audio';
import { switchTrack } from './music';
import { initTestScreen } from './testScreen';
import { saveGame, loadGame, loadGlory, resetGlory } from './core/persistence';

// UI modules
import { appState, setRenderCallback } from './ui/state';
import { $ } from './ui/dom';
import { renderArena } from './ui/meleePhase';
import { tryUseGrace, showGraceIntervenes } from './ui/meleePhase';
import { renderCampHeader, renderCamp, startCampQuips, stopCampQuips, handleContinueToCamp, handleMarchToBattle } from './ui/campPhase';
import { autoPlayPart1, autoPlayPart2, autoPlayPart3, autoPlayVolleys, setAutoPlayCallbacks } from './ui/autoPlay';
import { GRACE_CAP, initIntroListeners, renderIntroStats, confirmIntroName } from './ui/introScreen';
import { renderJournalOverlay, renderCharacterPanel, renderInventoryPanel, renderBattleOver, createLogEntryElement, initOverlayListeners } from './ui/overlays';

// ============================================================
// INIT
// ============================================================

function init() {
  resetEventTexts();

  const saved = loadGame();
  if (saved) {
    $('btn-intro-continue').style.display = 'inline-block';
  }

  resetGlory();
  appState.playerGlory = loadGlory();

  appState.gameState = createNewGame();
  appState.state = appState.gameState.battleState!;

  appState.lastRenderedTurn = -1;
  appState.renderedEntriesForTurn = 0;
  appState.arenaLogCount = 0;
  appState.campLogCount = 0;
  appState.processing = false;
  appState.showOpeningBeat = false;
  $('battle-over').style.display = 'none';
  $('journal-overlay').style.display = 'none';
  $('inventory-overlay').style.display = 'none';
  $('narrative-scroll').innerHTML = '';
  $('load-animation').style.display = 'none';
  $('morale-changes').innerHTML = '';
  $('morale-changes').classList.remove('visible');
  // Clear phase-specific containers
  $('parchment-narrative').innerHTML = '';
  $('parchment-choices').innerHTML = '';
  $('parchment-status').innerHTML = '';
  $('arena-narrative').innerHTML = '';
  $('arena-actions-grid').innerHTML = '';
  $('camp-narrative').innerHTML = '';
  $('camp-activities-grid').innerHTML = '';
  const game = $('game');
  game.classList.remove('phase-line', 'phase-charge', 'phase-melee', 'phase-intro', 'phase-camp');
  game.classList.add('phase-intro');
  // Music starts on dreams track
  switchTrack('dreams');
  // Reset intro UI
  $('intro-name-step').style.display = '';
  $('intro-stats-step').style.display = 'none';
  ($('intro-name-input') as HTMLInputElement).value = 'John';
  $('intro-mascot').classList.remove('compact');
  render();
}

function handleContinueSave() {
  const saved = loadGame();
  if (!saved) return;

  appState.gameState = saved;
  if (appState.gameState.battleState) {
    appState.state = appState.gameState.battleState;
  }

  appState.lastRenderedTurn = -1;
  appState.renderedEntriesForTurn = 0;
  appState.arenaLogCount = 0;
  appState.campLogCount = 0;
  appState.phaseLogStart = appState.state?.log?.length || 0;
  appState.showOpeningBeat = false;

  $('intro-container').style.display = 'none';
  render();
}
$('btn-intro-continue').addEventListener('click', handleContinueSave);

// ============================================================
// MUSIC
// ============================================================

function updateMusic() {
  if (appState.gameState.phase === GamePhase.Camp) {
    switchTrack('dreams');
    return;
  }
  const bs = appState.gameState.battleState;
  if (!bs) { switchTrack('dreams'); return; }

  switch (bs.phase) {
    case BattlePhase.Intro:
    case BattlePhase.StoryBeat:
      switchTrack('dreams');
      break;
    case BattlePhase.Line:
      if (appState.showOpeningBeat) switchTrack('dreams');
      else switchTrack('battle');
      break;
    case BattlePhase.Melee:
      switchTrack('battle');
      break;
    default:
      switchTrack('dreams');
  }
}

// ============================================================
// RENDER (main dispatcher)
// ============================================================

function render() {
  const game = $('game');
  game.classList.remove('phase-line', 'phase-charge', 'phase-melee', 'phase-intro', 'phase-camp');

  updateMusic();

  // Camp phase
  if (appState.gameState.phase === GamePhase.Camp) {
    game.classList.add('phase-camp');
    renderCampHeader();
    renderCamp();
    startCampQuips();
    return;
  }

  stopCampQuips();

  // Battle phase
  appState.state = appState.gameState.battleState!;

  if (appState.state.phase === BattlePhase.Intro) {
    game.classList.add('phase-intro');
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();
    return;
  } else if (appState.state.phase === BattlePhase.StoryBeat) {
    game.classList.add('phase-charge');
    renderHeader();
    renderStorybookPage();
  } else if (appState.state.phase === BattlePhase.Melee) {
    game.classList.add('phase-melee');
    if (appState.arenaLogCount === 0 || !$('arena-narrative').hasChildNodes()) {
      $('arena-narrative').innerHTML = '';
      const meleeStart = appState.state.meleeStage === 2
        ? appState.state.log.findIndex(e => e.text.includes('--- THE BATTERY ---'))
        : appState.state.log.findIndex(e => e.text.includes('--- MELEE ---'));
      if (meleeStart >= 0) appState.arenaLogCount = meleeStart;
    }
    renderHeader();
    renderArena();
  } else if (appState.showOpeningBeat) {
    game.classList.add('phase-charge');
    renderHeader();
    renderOpeningBeat();
  } else if (appState.state.autoPlayActive) {
    game.classList.add('phase-line');
    renderHeader();
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();
    renderDrillIndicator();
    renderPanorama();
    renderActions();
  } else {
    game.classList.add('phase-line');
    renderHeader();
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();
    renderDrillIndicator();
    renderPanorama();
    renderLog();
    renderMoraleChanges();
    renderActions();
  }

  if (appState.state.battleOver) renderBattleOver();
}

// ============================================================
// RENDER HELPERS (kept in app.ts — used by auto-play callbacks)
// ============================================================

function renderHeader() {
  let phaseLabel: string;
  if (appState.state.phase === BattlePhase.StoryBeat) {
    const storyLabels: Record<number, string> = {
      1: 'THE BATTERY',
      2: 'MASS\u00c9NA\'S ARRIVAL',
      3: 'THE GORGE',
      4: 'THE AFTERMATH',
      5: 'THE WOUNDED SERGEANT',
      6: 'FIX BAYONETS',
    };
    phaseLabel = storyLabels[appState.state.chargeEncounter] || 'STORY BEAT';
  } else if (appState.state.phase === BattlePhase.Line) {
    phaseLabel = appState.state.battlePart === 3 ? 'PHASE 4: THE GORGE' : appState.state.battlePart === 2 ? 'PHASE 3: HOLD THE LINE' : 'PHASE 1: THE LINE';
  } else if (appState.state.phase === BattlePhase.Melee) {
    phaseLabel = appState.state.meleeStage === 2 ? 'THE BATTERY CHARGE' : 'PHASE 2: MELEE';
  } else {
    const names: Record<string, string> = {
      crisis: 'PHASE 2: THE CRISIS',
      individual: 'PHASE 3: THE INDIVIDUAL',
    };
    phaseLabel = names[appState.state.phase] || appState.state.phase;
  }
  const maxVolley = appState.state.battlePart === 3 ? 11 : appState.state.battlePart === 2 ? 7 : 4;
  const volleyInfo = appState.state.scriptedVolley >= 1 ? ` \u2014 Volley ${appState.state.scriptedVolley} of ${maxVolley}` : '';
  $('phase-label').textContent = phaseLabel + volleyInfo;
  $('turn-counter').textContent = `Turn ${appState.state.turn}`;
}

function renderMeters() {
  const { player } = appState.state;

  // Morale
  const mPct = (player.morale / player.maxMorale) * 100;
  const mBar = $('morale-bar');
  mBar.style.width = `${mPct}%`;
  mBar.className = 'meter-fill morale-fill';
  if (player.moraleThreshold !== MoraleThreshold.Steady) mBar.classList.add(player.moraleThreshold);
  $('morale-num').textContent = Math.round(player.morale).toString();
  const mState = $('morale-state');
  mState.textContent = player.moraleThreshold.toUpperCase();
  mState.className = 'meter-state';
  if (player.moraleThreshold !== MoraleThreshold.Steady) mState.classList.add(player.moraleThreshold);

  // Health
  const hPct = (player.health / player.maxHealth) * 100;
  const hBar = $('health-bar');
  hBar.style.width = `${hPct}%`;
  hBar.className = 'meter-fill health-fill';
  if (player.healthState !== HealthState.Unhurt) hBar.classList.add(player.healthState);
  $('health-num').textContent = Math.round(player.health).toString();
  $('health-max').textContent = Math.round(player.maxHealth).toString();
  const hState = $('health-state');
  const healthLabels: Record<string, string> = {
    unhurt: 'UNHURT', wounded: 'WOUNDED', badly_wounded: 'BADLY WOUNDED', critical: 'CRITICAL',
  };
  hState.textContent = healthLabels[player.healthState] || player.healthState.toUpperCase();
  hState.className = 'meter-state';
  if (player.healthState !== HealthState.Unhurt) hState.classList.add(player.healthState);

  // Stamina
  const tierInfo = getStaminaTierInfo(player.stamina, player.maxStamina);
  const sPct = tierInfo.poolSize > 0 ? (tierInfo.points / tierInfo.poolSize) * 100 : 0;
  const sBar = $('stamina-bar');
  sBar.style.width = `${sPct}%`;
  sBar.className = 'meter-fill stamina-fill';
  if (player.staminaState !== StaminaState.Fresh) sBar.classList.add(player.staminaState);
  $('stamina-num').textContent = `${Math.round(tierInfo.points)}/${tierInfo.poolSize}`;
  const sState = $('stamina-state');
  sState.textContent = player.staminaState.toUpperCase();
  sState.className = 'meter-state';
  if (player.staminaState !== StaminaState.Fresh) sState.classList.add(player.staminaState);

  // Musket
  $('musket-status').textContent = player.musketLoaded ? 'Loaded' : 'Empty';
  ($('musket-status') as HTMLElement).style.color =
    player.musketLoaded ? 'var(--health-high)' : 'var(--morale-low)';

  // Grace
  const graceCount = appState.gameState.player.grace;
  const graceRow = $('grace-row') as HTMLElement;
  graceRow.style.display = graceCount > 0 ? '' : 'none';
  $('grace-val').textContent = String(graceCount);

  // Grace badge on line portrait
  const lineBadge = $('grace-badge-line') as HTMLElement;
  lineBadge.style.display = graceCount > 0 ? '' : 'none';
  lineBadge.textContent = graceCount > 1 ? '\u{1F33F}\u{1F33F}' : '\u{1F33F}';
}

function renderLineStatus() {
  const { line } = appState.state;

  const oc = $('officer-card');
  $('officer-rank').textContent = `${line.officer.rank} ${line.officer.name}`;
  $('officer-status').textContent = line.officer.status;
  oc.className = 'officer-card';
  if (!line.officer.alive) oc.classList.add('down');

  for (const [elId, n] of [['left-neighbour', line.leftNeighbour], ['right-neighbour', line.rightNeighbour]] as const) {
    const el = $(elId);
    if (!n) continue;
    el.querySelector('.neighbour-name')!.textContent = n.name;
    el.querySelector('.neighbour-state')!.textContent =
      !n.alive ? 'DEAD' : n.routing ? 'ROUTING' : n.wounded ? 'WOUNDED' : n.threshold.toUpperCase();
    el.className = 'neighbour';
    if (!n.alive) el.classList.add('dead');
    else if (n.routing) el.classList.add('routing');
    else if (n.threshold === MoraleThreshold.Wavering || n.threshold === MoraleThreshold.Breaking) el.classList.add('wavering');
  }

  const youName = document.querySelector('#you-marker .you-name');
  if (youName) youName.textContent = `[ ${appState.state.player.name.toUpperCase()} ]`;
  $('line-integrity-val').textContent = `${Math.round(line.lineIntegrity)}%`;

  const moraleEl = $('line-morale-val');
  const moraleLabels: Record<string, string> = {
    resolute: 'Resolute', holding: 'Holding', shaken: 'Shaken', wavering: 'Wavering', breaking: 'Breaking',
  };
  moraleEl.textContent = moraleLabels[line.lineMorale] || line.lineMorale;
  moraleEl.style.color =
    line.lineMorale === 'resolute' || line.lineMorale === 'holding' ? 'var(--health-high)' :
    line.lineMorale === 'shaken' ? 'var(--morale-mid)' :
    line.lineMorale === 'wavering' ? 'var(--morale-low)' : 'var(--morale-crit)';
}

function renderEnemyPanel() {
  const { enemy } = appState.state;
  const ms = appState.state.meleeState;
  const isMelee = appState.state.phase === BattlePhase.Melee && ms;

  $('enemy-range').textContent = `${Math.round(enemy.range)} paces`;

  const qualityLabels: Record<string, string> = {
    conscript: 'Conscripts', line: 'Line Infantry', veteran: 'Veterans', guard: 'Imperial Guard',
  };
  $('enemy-quality').textContent = qualityLabels[enemy.quality] || enemy.quality;

  const str = enemy.strength;
  $('enemy-strength').textContent =
    str >= 80 ? 'Full Strength' : str >= 60 ? 'Bloodied' : str >= 40 ? 'Weakened' : str >= 20 ? 'Shattered' : 'Broken';

  const postureEl = $('enemy-morale');
  const postureMap: Record<string, string> = {
    advancing: 'Advancing', steady: 'Holding', wavering: 'Wavering', charging: 'CHARGING!', resolute: 'Resolute',
    trapped: 'TRAPPED',
  };
  postureEl.textContent = postureMap[enemy.morale] || enemy.morale;
  postureEl.className = 'status-val';
  if (enemy.morale === 'charging') postureEl.classList.add('charging');
  else if (enemy.morale === 'wavering') postureEl.classList.add('wavering-enemy');

  $('enemy-integrity').textContent = `${Math.round(enemy.lineIntegrity)}%`;

  const em = $('enemy-morale-state');
  if (enemy.strength >= 70) em.textContent = 'Resolute';
  else if (enemy.strength >= 50) em.textContent = 'Holding';
  else if (enemy.strength >= 30) em.textContent = 'Shaken';
  else em.textContent = 'Wavering';

  $('enemy-arty').textContent = enemy.artillery ? 'Active' : 'Silent';
  ($('enemy-arty') as HTMLElement).style.color = enemy.artillery ? 'var(--accent-red-bright)' : 'var(--text-dim)';

  $('enemy-cav').textContent = enemy.cavalryThreat ? 'Sighted on flank!' : 'None sighted';
  ($('enemy-cav') as HTMLElement).style.color = enemy.cavalryThreat ? 'var(--accent-red-bright)' : 'var(--text-dim)';

  // Melee opponent card
  const oppCard = $('melee-opponent-card');
  if (isMelee && !appState.state.battleOver) {
    oppCard.style.display = '';
    $('enemy-detail').style.display = 'none';
    const opp = ms.opponents[ms.currentOpponent];
    $('opp-name').textContent = opp.name;
    $('opp-desc').textContent = opp.description;
    $('opp-health-num').textContent = `${Math.max(0, Math.round(opp.health))} / ${opp.maxHealth}`;
    const hPct = Math.max(0, (opp.health / opp.maxHealth) * 100);
    $('opp-health-bar').style.width = `${hPct}%`;
    $('opp-stamina-num').textContent = `${Math.round(opp.stamina)} / ${opp.maxStamina}`;
    const sPct = (opp.stamina / opp.maxStamina) * 100;
    $('opp-stamina-bar').style.width = `${sPct}%`;
    $('opp-counter').textContent = `${ms.currentOpponent + 1} / ${ms.opponents.length}`;
    $('melee-kills').textContent = `${ms.killCount}`;

    const tags: string[] = [];
    if (opp.stunned) tags.push('<span class="opp-status-tag stunned">STUNNED</span>');
    if (opp.armInjured) tags.push('<span class="opp-status-tag arm-injured">ARM INJURED</span>');
    if (opp.legInjured) tags.push('<span class="opp-status-tag leg-injured">LEG INJURED</span>');
    $('opp-statuses').innerHTML = tags.join('');
  } else {
    oppCard.style.display = 'none';
    $('enemy-detail').style.display = '';
  }
}

function renderDrillIndicator() {
  const indicator = $('drill-indicator');
  if (appState.state.phase === BattlePhase.StoryBeat || appState.state.phase === BattlePhase.Melee) {
    indicator.style.display = 'none';
    return;
  }
  indicator.style.display = '';
  const steps = document.querySelectorAll('.drill-step');
  steps.forEach(el => {
    el.classList.remove('active', 'auto');
    const step = el.getAttribute('data-step');
    if (step === appState.state.drillStep) el.classList.add('active');
    if (step === 'load') el.classList.add('auto');
  });
}

function renderPanorama() {
  const pano = document.getElementById('panorama');
  if (!pano) return;
  pano.setAttribute('data-volley', String(appState.state.scriptedVolley));
  pano.setAttribute('data-drill', appState.state.drillStep);

  const rangeEl = document.getElementById('pano-range-val');
  if (rangeEl) rangeEl.textContent = String(Math.round(appState.state.enemy.range));

  const gap = document.getElementById('pano-gap');
  if (gap) {
    const range = appState.state.enemy.range;
    const basis = Math.round(50 + ((range - 25) / (120 - 25)) * (230 - 50));
    gap.style.flexBasis = `${Math.max(50, Math.min(230, basis))}px`;
  }

  const frenchFill = document.getElementById('french-fill');
  const frenchBlock = document.getElementById('block-french');
  if (frenchFill && frenchBlock) {
    const integrity = appState.state.line.lineIntegrity;
    frenchFill.style.width = `${integrity}%`;
    frenchFill.style.opacity = String(0.3 + (integrity / 100) * 0.7);
    frenchBlock.classList.remove('integrity-damaged', 'integrity-broken');
    if (integrity < 40) frenchBlock.classList.add('integrity-broken');
    else if (integrity < 70) frenchBlock.classList.add('integrity-damaged');
    frenchBlock.classList.remove('morale-resolute', 'morale-holding', 'morale-shaken', 'morale-wavering', 'morale-breaking');
    frenchBlock.classList.add(`morale-${appState.state.line.lineMorale}`);
  }

  const austrianFill = document.getElementById('austrian-fill');
  const austrianBlock = document.getElementById('block-austrian');
  if (austrianFill && austrianBlock) {
    const strength = appState.state.enemy.strength;
    austrianFill.style.width = `${strength}%`;
    austrianFill.style.opacity = String(0.3 + (strength / 100) * 0.7);
    austrianBlock.classList.remove('integrity-damaged', 'integrity-broken');
    if (appState.state.enemy.lineIntegrity < 40) austrianBlock.classList.add('integrity-broken');
    else if (appState.state.enemy.lineIntegrity < 70) austrianBlock.classList.add('integrity-damaged');
    austrianBlock.classList.remove('morale-advancing', 'morale-steady', 'morale-wavering', 'morale-charging', 'morale-trapped');
    austrianBlock.classList.add(`morale-${appState.state.enemy.morale}`);
  }
}

function playVolleyAnimation(direction: 'french' | 'austrian'): Promise<void> {
  return new Promise((resolve) => {
    const container = document.getElementById('volley-streaks');
    if (!container) { resolve(); return; }

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
      streaks.forEach(s => s.remove());
      resolve();
    }, 600);
  });
}

function crossFadeNarrative(scroll: HTMLElement, entries: Array<{ type: string; text: string }>) {
  const newPage = document.createElement('div');
  newPage.className = 'narrative-page';
  for (const entry of entries) {
    newPage.appendChild(createLogEntryElement(entry));
  }

  const oldPage = scroll.querySelector('.narrative-page:not(.narrative-page-exiting)') as HTMLElement | null;
  if (oldPage) {
    oldPage.classList.add('narrative-page-exiting');
    oldPage.addEventListener('animationend', () => oldPage.remove(), { once: true });
    newPage.classList.add('narrative-page-entering');
    scroll.appendChild(newPage);
    setTimeout(() => {
      newPage.classList.remove('narrative-page-entering');
      newPage.classList.add('narrative-page-visible');
    }, 150);
  } else {
    newPage.classList.add('narrative-page-visible');
    scroll.appendChild(newPage);
  }
}

function renderLog() {
  const scroll = $('narrative-scroll');
  const turnEntries = appState.state.log.filter((e, idx) => e.turn === appState.state.turn && idx >= appState.phaseLogStart);

  if (appState.state.turn !== appState.lastRenderedTurn) {
    crossFadeNarrative(scroll, turnEntries);
    appState.lastRenderedTurn = appState.state.turn;
    appState.renderedEntriesForTurn = turnEntries.length;
    requestAnimationFrame(() => { scroll.scrollTop = 0; });
  } else if (turnEntries.length > appState.renderedEntriesForTurn) {
    const page = scroll.querySelector('.narrative-page:not(.narrative-page-exiting)');
    if (page) {
      const newEntries = turnEntries.slice(appState.renderedEntriesForTurn);
      for (const entry of newEntries) {
        page.appendChild(createLogEntryElement(entry));
      }
      appState.renderedEntriesForTurn = turnEntries.length;
      requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; });
    }
  }
}

function renderMoraleChanges() {
  const container = $('morale-changes');
  if (appState.state.pendingMoraleChanges.length === 0) { container.classList.remove('visible'); return; }
  container.classList.add('visible');
  container.innerHTML = appState.state.pendingMoraleChanges.map(c => {
    const pos = c.amount > 0;
    return `<div class="morale-change-item">
      <span class="reason">${c.reason}</span>
      <span class="amount ${pos ? 'positive' : ''}">${pos ? '+' : ''}${Math.round(c.amount)}</span>
    </div>`;
  }).join('');
}

function renderActions() {
  const grid = $('actions-grid');
  grid.innerHTML = '';
  if (appState.state.battleOver) { $('actions-panel').style.display = 'none'; return; }
  $('actions-panel').style.display = 'block';

  // AUTO-PLAY ACTIVE
  if (appState.state.autoPlayActive) {
    grid.innerHTML = '<div class="auto-play-status">The line endures...</div>';
    return;
  }

  // PART 1 START
  if (appState.state.battlePart === 1 && appState.state.scriptedVolley === 1 && !appState.state.autoPlayActive && appState.state.phase === BattlePhase.Line && !appState.showOpeningBeat) {
    const btn = document.createElement('button');
    btn.className = 'begin-btn';
    btn.textContent = 'Begin';
    btn.addEventListener('click', () => { autoPlayPart1(); });
    grid.appendChild(btn);
    return;
  }

  // PART 2 RESUME
  if (appState.state.battlePart === 2 && appState.state.phase === BattlePhase.Line
      && appState.state.scriptedVolley >= 5 && appState.state.scriptedVolley <= 7 && !appState.state.autoPlayActive) {
    const btn = document.createElement('button');
    btn.className = 'begin-btn';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => {
      appState.processing = true;
      appState.state.autoPlayActive = true;
      appState.gameState.battleState = appState.state;
      switchTrack('battle');
      render();
      autoPlayVolleys(appState.state.scriptedVolley - 1, 6);
    });
    grid.appendChild(btn);
    return;
  }

  // PART 3 RESUME
  if (appState.state.battlePart === 3 && appState.state.phase === BattlePhase.Line
      && appState.state.scriptedVolley >= 8 && appState.state.scriptedVolley <= 11 && !appState.state.autoPlayActive) {
    const btn = document.createElement('button');
    btn.className = 'begin-btn';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => autoPlayPart3());
    grid.appendChild(btn);
    return;
  }

  // STORY BEAT PHASE
  if (appState.state.phase === BattlePhase.StoryBeat) {
    renderChargeChoices(grid);
    return;
  }

  // LINE PHASE: standard drill actions
  const fireIds = [ActionId.Fire, ActionId.SnapShot, ActionId.HoldFire, ActionId.AimCarefully,
    ActionId.TargetColumn, ActionId.TargetOfficers, ActionId.TargetWagon];
  const endureIds = [ActionId.Duck, ActionId.Pray, ActionId.DrinkWater, ActionId.StandFirm, ActionId.SteadyNeighbour,
    ActionId.ShowMercy];
  const fumbleIds = [ActionId.GoThroughMotions];

  for (const action of appState.state.availableActions) {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.setAttribute('data-action', action.id);
    if (fumbleIds.includes(action.id)) btn.classList.add('fumble-action');
    else if (fireIds.includes(action.id)) btn.classList.add('fire-action');
    else if (endureIds.includes(action.id)) btn.classList.add('endure-action');
    else btn.classList.add('steady-action');

    btn.innerHTML = `
      <span class="action-name">${action.name}</span>
      <span class="action-desc">${action.description.slice(0, 70)}${action.description.length > 70 ? '...' : ''}</span>
    `;
    btn.addEventListener('click', () => handleAction(action.id));
    grid.appendChild(btn);
  }
}

function renderChargeChoices(grid: HTMLElement) {
  const encounter = getChargeEncounter(appState.state);

  for (const choice of encounter.choices) {
    const btn = document.createElement('button');
    btn.className = 'action-btn charge-action';
    btn.setAttribute('data-action', choice.id);

    btn.innerHTML = `
      <span class="action-name">${choice.label}</span>
      <span class="action-desc">${choice.description}</span>
    `;
    btn.addEventListener('click', () => handleChargeAction(choice.id));
    grid.appendChild(btn);
  }
}

// ============================================================
// OPENING BEAT
// ============================================================

function renderOpeningBeat() {
  const openingText = appState.state.log[0]?.text || '';

  $('parchment-phase').textContent = 'BATTLE OF RIVOLI';
  $('parchment-encounter').textContent = '14 January 1797';

  const narrativeEl = $('parchment-narrative');
  narrativeEl.innerHTML = openingText
    .split('\n\n').filter((p: string) => p.trim()).map((p: string) => `<p>${p}</p>`).join('');

  $('parchment-status').innerHTML = `
    <div class="pstatus-item"><span class="pstatus-label">Morale</span><span class="pstatus-val">${Math.round(appState.state.player.morale)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Health</span><span class="pstatus-val">${Math.round(appState.state.player.health)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Stamina</span><span class="pstatus-val">${Math.round(appState.state.player.stamina)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Line</span><span class="pstatus-val">${appState.state.line.officer.rank} ${appState.state.line.officer.name}</span></div>
  `;

  const choicesEl = $('parchment-choices');
  choicesEl.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'parchment-choice';
  btn.innerHTML = `
    <span class="parchment-choice-num">1.</span>
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Take your place in the line</span>
      <span class="parchment-choice-desc">The drums are rolling. The 14th advances.</span>
    </div>
  `;
  btn.addEventListener('click', () => {
    appState.showOpeningBeat = false;
    appState.lastRenderedTurn = -1;
    appState.phaseLogStart = appState.state.log.length;
    render();
  });
  choicesEl.appendChild(btn);
}

// ============================================================
// STORYBOOK
// ============================================================

function renderStorybookPage() {
  const encounter = getChargeEncounter(appState.state);
  const { player } = appState.state;

  const encounterTitles: Record<number, string> = {
    1: 'The Overrun Battery',
    2: 'Mass\u00e9na\'s Division',
    3: 'The Counterattack',
    4: 'The Aftermath',
    5: 'The Wounded Sergeant',
    6: 'Fix Bayonets',
  };
  $('parchment-encounter').textContent = encounterTitles[appState.state.chargeEncounter] || 'Story Beat';

  const narrativeEl = $('parchment-narrative');
  narrativeEl.innerHTML = encounter.narrative
    .split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');

  const graceStatus = appState.gameState.player.grace > 0
    ? `<div class="pstatus-item"><span class="pstatus-label">Grace</span><span class="pstatus-val pstatus-grace">${appState.gameState.player.grace}</span></div>`
    : '';
  $('parchment-status').innerHTML = `
    <div class="pstatus-item"><span class="pstatus-label">Morale</span><span class="pstatus-val">${Math.round(player.morale)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Health</span><span class="pstatus-val">${Math.round(player.health)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Stamina</span><span class="pstatus-val">${Math.round(player.stamina)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">State</span><span class="pstatus-val">${player.moraleThreshold.toUpperCase()}</span></div>
    ${graceStatus}
  `;

  const choicesEl = $('parchment-choices');
  choicesEl.innerHTML = '';
  encounter.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'parchment-choice';
    btn.innerHTML = `
      <span class="parchment-choice-num">${i + 1}.</span>
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${choice.label}</span>
        <span class="parchment-choice-desc">${choice.description}</span>
      </div>
    `;
    btn.addEventListener('click', () => handleChargeAction(choice.id));
    choicesEl.appendChild(btn);
  });
}

// ============================================================
// ACTION HANDLERS
// ============================================================

async function handleChargeAction(choiceId: ChargeChoiceId) {
  if (appState.state.battleOver || appState.processing) return;
  appState.processing = true;

  const prevMorale = appState.state.player.morale;
  const prevLogLen = appState.state.log.length;
  const wasWoundedSergeant = appState.state.chargeEncounter === 5;

  appState.state = advanceTurn(appState.state, choiceId);
  appState.gameState.battleState = appState.state;

  if (wasWoundedSergeant) {
    appState.pendingAutoPlayResume = true;
  }

  // Grace earned from TakeCommand success
  if (appState.state.graceEarned) {
    appState.gameState.player.grace = Math.min(GRACE_CAP, appState.gameState.player.grace + 1);
    appState.state.graceEarned = false;
    appState.gameState.battleState = appState.state;
  }

  saveGame(appState.gameState);

  const newEntries = appState.state.log.slice(prevLogLen);
  const resultNarrative = newEntries
    .filter(e => e.type === 'action' || e.type === 'narrative' || e.type === 'event' || e.type === 'result')
    .map(e => e.text)
    .join('\n\n');

  const moraleSummary = newEntries
    .filter(e => e.type === 'morale')
    .map(e => e.text)
    .join(', ');

  if (resultNarrative.trim()) {
    appState.pendingChargeResult = { narrative: resultNarrative, statSummary: moraleSummary };
    renderChargeResult();
  } else {
    render();
  }

  if (appState.state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  appState.processing = false;
}

function renderChargeResult() {
  if (!appState.pendingChargeResult) return;

  const narrativeEl = $('parchment-narrative');
  narrativeEl.innerHTML = appState.pendingChargeResult.narrative
    .split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');

  const resultGrace = appState.gameState.player.grace > 0
    ? `<div class="pstatus-item"><span class="pstatus-label">Grace</span><span class="pstatus-val pstatus-grace">${appState.gameState.player.grace}</span></div>`
    : '';
  $('parchment-status').innerHTML = `
    <div class="pstatus-item"><span class="pstatus-label">Morale</span><span class="pstatus-val">${Math.round(appState.state.player.morale)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Health</span><span class="pstatus-val">${Math.round(appState.state.player.health)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Stamina</span><span class="pstatus-val">${Math.round(appState.state.player.stamina)}</span></div>
    ${appState.pendingChargeResult.statSummary ? `<div class="pstatus-item"><span class="pstatus-label">Effect</span><span class="pstatus-val">${appState.pendingChargeResult.statSummary}</span></div>` : ''}
    ${resultGrace}
  `;

  const choicesEl = $('parchment-choices');
  choicesEl.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'parchment-choice';
  btn.innerHTML = `
    <span class="parchment-choice-num">&rarr;</span>
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Continue</span>
      <span class="parchment-choice-desc">Press on.</span>
    </div>
  `;
  btn.addEventListener('click', () => {
    appState.pendingChargeResult = null;
    appState.phaseLogStart = appState.state.log.length;
    appState.lastRenderedTurn = -1;
    if (appState.pendingAutoPlayResume) {
      appState.pendingAutoPlayResume = false;
      appState.processing = true;
      appState.state.phase = BattlePhase.Line;
      appState.state.autoPlayActive = true;
      appState.gameState.battleState = appState.state;
      switchTrack('battle');
      render();
      autoPlayVolleys(2, 3);
    } else if (appState.state.battlePart === 2 && appState.state.phase === BattlePhase.Line) {
      autoPlayPart2();
    } else if (appState.state.battlePart === 3 && appState.state.phase === BattlePhase.Line) {
      autoPlayPart3();
    } else {
      render();
    }
  });
  choicesEl.appendChild(btn);
}

function showValorRollDisplay(result: ValorRollResult) {
  const grid = $('actions-grid');

  const outcomeLabels: Record<string, string> = {
    great_success: 'STEELED',
    pass: 'HELD STEADY',
    fail: 'SHAKEN',
    critical_fail: 'NEARLY BROKE',
  };

  const outcomeCls: Record<string, string> = {
    great_success: 'valor-great',
    pass: 'valor-pass',
    fail: 'valor-fail',
    critical_fail: 'valor-critical',
  };

  const changeSign = result.moraleChange > 0 ? '+' : '';

  grid.innerHTML = `
    <div class="valor-roll-display ${outcomeCls[result.outcome]}">
      <div class="valor-roll-title">VALOR CHECK</div>
      <div class="valor-roll-numbers">
        <span class="valor-roll-value">${result.roll}</span>
        <span class="valor-roll-vs">vs</span>
        <span class="valor-roll-target">${result.target}</span>
      </div>
      <div class="valor-roll-outcome">${outcomeLabels[result.outcome]}</div>
      <div class="valor-roll-morale">Morale: ${changeSign}${result.moraleChange}</div>
      <div class="valor-roll-narrative">${result.narrative}</div>
    </div>
  `;
}

function appendNarrativeEntry(scroll: HTMLElement, entry: { type: string; text: string }) {
  let page = scroll.querySelector('.narrative-page:not(.narrative-page-exiting)') as HTMLElement | null;
  if (!page) {
    page = document.createElement('div');
    page.className = 'narrative-page narrative-page-visible';
    scroll.appendChild(page);
  }
  const el = createLogEntryElement(entry);
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  page.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; });
}

function showLoadAnimation(result: LoadResult): Promise<void> {
  return new Promise((resolve) => {
    const grid = $('actions-grid');
    const steps = result.narrativeSteps;

    grid.innerHTML = `<div class="load-sequence"><div class="load-title">RELOADING</div><div class="load-steps-row" id="load-steps-row"></div></div>`;
    const row = $('load-steps-row');

    let stepIndex = 0;

    function showNextStep() {
      if (stepIndex >= steps.length) {
        const verdict = document.createElement('div');
        verdict.className = `load-verdict-inline ${result.success ? 'loaded' : 'fumbled'}`;
        verdict.textContent = result.success ? 'LOADED' : 'FUMBLED';
        row.appendChild(verdict);

        setTimeout(() => { resolve(); }, 1000);
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
  });
}

async function handleAction(actionId: ActionId) {
  if (appState.state.battleOver || appState.processing) return;
  appState.processing = true;

  const prevMorale = appState.state.player.morale;
  const prevDrillStep = appState.state.drillStep;
  const wasFire = actionId === ActionId.Fire || actionId === ActionId.SnapShot;

  if (wasFire) playVolleySound();

  appState.state = advanceTurn(appState.state, actionId);
  appState.gameState.battleState = appState.state;

  // Death interception for turn-by-turn line
  if (appState.state.battleOver && appState.state.outcome === 'defeat') {
    if (tryUseGrace()) {
      await showGraceIntervenes();
      render();
      appState.processing = false;
      return;
    }
  }

  saveGame(appState.gameState);

  if (wasFire) {
    await playVolleyAnimation('french');
  }

  // Endure -> load transition means Austrian return fire
  if (prevDrillStep === DrillStep.Endure && appState.state.phase === BattlePhase.Line) {
    playDistantVolleySound();
    await playVolleyAnimation('austrian');

    if (appState.state.lastValorRoll) {
      showValorRollDisplay(appState.state.lastValorRoll);
      const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
      await wait(2000);
    }
  }

  // Check for load animation
  if (appState.state.lastLoadResult) {
    const steps = document.querySelectorAll('.drill-step');
    steps.forEach(el => {
      el.classList.remove('active');
      if (el.getAttribute('data-step') === 'load') el.classList.add('active');
    });
    $('actions-grid').innerHTML = '';
    await showLoadAnimation(appState.state.lastLoadResult);
  }

  render();

  if (appState.state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  // Check for fumbled FIRE
  if (appState.state.drillStep === DrillStep.Fire && appState.state.player.fumbledLoad && appState.state.availableActions.length === 0) {
    setTimeout(() => {
      appState.state = resolveAutoFumbleFire(appState.state);
      appState.gameState.battleState = appState.state;
      render();
      appState.processing = false;
    }, 1500);
    return;
  }

  appState.processing = false;
}

// ============================================================
// EVENT LISTENERS
// ============================================================

$('btn-restart').addEventListener('click', init);
$('btn-continue-camp').addEventListener('click', handleContinueToCamp);
$('btn-march').addEventListener('click', handleMarchToBattle);

// ============================================================
// BOOTSTRAP
// ============================================================

// Set the render callback so extracted modules can trigger re-renders
setRenderCallback(render);

// Wire auto-play callbacks (these functions live in app.ts, needed by autoPlay.ts)
setAutoPlayCallbacks({
  renderDrillIndicator,
  renderPanorama,
  renderMeters,
  renderLineStatus,
  renderEnemyPanel,
  crossFadeNarrative,
  appendNarrativeEntry,
  playVolleyAnimation,
  showLoadAnimation,
  showValorRollDisplay,
});

// Initialize overlay and intro screen event listeners
initOverlayListeners();
initIntroListeners();

// Start the game
init();
initTestScreen();
initDevTools(
  () => appState.gameState,
  (gs) => { appState.gameState = gs; appState.state = gs.battleState!; },
  () => render(),
  () => init(),
);
