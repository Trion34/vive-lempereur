import { createInitialBattleState, beginBattle, advanceTurn, resolveAutoFumbleFire, resolveMeleeRout, MeleeTurnInput } from './core/battle';
import { resetEventTexts } from './core/events';
import { getChargeEncounter } from './core/charge';
import { getMeleeActions } from './core/melee';
import {
  BattleState, ActionId, MoraleThreshold, DrillStep,
  HealthState, FatigueState, LoadResult,
  BattlePhase, ChargeChoiceId,
  MeleeStance, MeleeActionId, BodyPart,
  GameState, GamePhase, CampActivityId, MilitaryRank,
} from './types';
import { createNewGame, transitionToCamp, transitionToBattle, transitionToPreBattleCamp } from './core/gameLoop';
import { advanceCampTurn, resolveCampEvent as resolveCampEventAction, getCampActivities, isCampComplete } from './core/camp';
import { getScriptedAvailableActions } from './core/scriptedVolleys';
import { initDevTools } from './devtools';
import { playVolleySound, playDistantVolleySound } from './audio';
import { switchTrack, toggleMute, isMuted, ensureStarted } from './music';

const $ = (id: string) => document.getElementById(id)!;
let gameState: GameState;
let state: BattleState; // Convenience alias for battle phase
let lastRenderedTurn = -1;
let renderedEntriesForTurn = 0;
let processing = false;
let campLogCount = 0;

let arenaLogCount = 0;
let showOpeningBeat = false;

function init() {
  resetEventTexts();
  gameState = createNewGame();

  state = gameState.battleState!;

  lastRenderedTurn = -1;
  renderedEntriesForTurn = 0;
  arenaLogCount = 0;
  campLogCount = 0;
  processing = false;
  showOpeningBeat = false;
  $('battle-over').style.display = 'none';
  $('journal-overlay').style.display = 'none';
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
  // Music starts on dreams track (will only actually play after first user interaction)
  switchTrack('dreams');
  // Reset intro UI
  $('intro-name-step').style.display = '';
  $('intro-stats-step').style.display = 'none';
  ($('intro-name-input') as HTMLInputElement).value = '';
  $('intro-mascot').classList.remove('compact');
  render();
}

function updateMusic() {
  // Map game/battle phase to a music track
  if (gameState.phase === GamePhase.Camp) {
    switchTrack('dreams');
    return;
  }
  const bs = gameState.battleState;
  if (!bs) { switchTrack('dreams'); return; }

  switch (bs.phase) {
    case BattlePhase.Intro:
      switchTrack('dreams');
      break;
    case BattlePhase.StoryBeat:
      switchTrack('dreams');
      break;
    case BattlePhase.Line:
      // Opening beat still counts as narrative
      if (showOpeningBeat) switchTrack('dreams');
      else switchTrack('battle');
      break;
    case BattlePhase.Melee:
      switchTrack('battle');
      break;
    default:
      switchTrack('dreams');
  }
}

function render() {
  const game = $('game');
  game.classList.remove('phase-line', 'phase-charge', 'phase-melee', 'phase-intro', 'phase-camp');

  updateMusic();

  // Camp phase
  if (gameState.phase === GamePhase.Camp) {
    game.classList.add('phase-camp');
    renderCampHeader();
    renderCamp();
    return;
  }

  // Battle phase
  state = gameState.battleState!;

  if (state.phase === BattlePhase.Intro) {
    game.classList.add('phase-intro');
    return;
  } else if (state.phase === BattlePhase.StoryBeat) {
    game.classList.add('phase-charge'); // reuse existing CSS
    renderHeader();
    renderStorybookPage();
  } else if (state.phase === BattlePhase.Melee) {
    game.classList.add('phase-melee');
    // On first melee render, clear old log entries from previous phases
    if (arenaLogCount === 0 || !$('arena-narrative').hasChildNodes()) {
      $('arena-narrative').innerHTML = '';
      // Only show log entries from the latest melee transition onward
      const meleeStart = state.meleeStage === 2
        ? state.log.findIndex(e => e.text.includes('--- THE BATTERY ---'))
        : state.log.findIndex(e => e.text.includes('--- MELEE ---'));
      if (meleeStart >= 0) arenaLogCount = meleeStart;
    }
    renderHeader();
    renderArena();
  } else if (showOpeningBeat) {
    game.classList.add('phase-charge'); // reuse parchment CSS
    renderHeader();
    renderOpeningBeat();
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

  if (state.battleOver) renderBattleOver();
}

function renderHeader() {
  let phaseLabel: string;
  if (state.phase === BattlePhase.StoryBeat) {
    const storyLabels: Record<number, string> = {
      1: 'THE BATTERY',
      2: 'MASS\u00c9NA\'S ARRIVAL',
      3: 'THE GORGE',
      4: 'THE AFTERMATH',
    };
    phaseLabel = storyLabels[state.chargeEncounter] || 'STORY BEAT';
  } else if (state.phase === BattlePhase.Line) {
    phaseLabel = state.battlePart === 3 ? 'PHASE 4: THE GORGE' : state.battlePart === 2 ? 'PHASE 3: HOLD THE LINE' : 'PHASE 1: THE LINE';
  } else if (state.phase === BattlePhase.Melee) {
    phaseLabel = state.meleeStage === 2 ? 'THE BATTERY CHARGE' : 'PHASE 2: MELEE';
  } else {
    const names: Record<string, string> = {
      crisis: 'PHASE 2: THE CRISIS',
      individual: 'PHASE 3: THE INDIVIDUAL',
    };
    phaseLabel = names[state.phase] || state.phase;
  }
  const maxVolley = state.battlePart === 3 ? 11 : state.battlePart === 2 ? 7 : 4;
  const volleyInfo = state.scriptedVolley >= 1 ? ` \u2014 Volley ${state.scriptedVolley} of ${maxVolley}` : '';
  $('phase-label').textContent = phaseLabel + volleyInfo;
  $('turn-counter').textContent = `Turn ${state.turn}`;
}

function renderMeters() {
  const { player } = state;

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
  const hState = $('health-state');
  const healthLabels: Record<string, string> = {
    unhurt: 'UNHURT', wounded: 'WOUNDED', badly_wounded: 'BADLY WOUNDED', critical: 'CRITICAL',
  };
  hState.textContent = healthLabels[player.healthState] || player.healthState.toUpperCase();
  hState.className = 'meter-state';
  if (player.healthState !== HealthState.Unhurt) hState.classList.add(player.healthState);

  // Fatigue
  const sPct = (player.fatigue / player.maxFatigue) * 100;
  const sBar = $('fatigue-bar');
  sBar.style.width = `${sPct}%`;
  sBar.className = 'meter-fill fatigue-fill';
  if (player.fatigueState !== FatigueState.Fresh) sBar.classList.add(player.fatigueState);
  $('fatigue-num').textContent = Math.round(player.fatigue).toString();
  const sState = $('fatigue-state');
  sState.textContent = player.fatigueState.toUpperCase();
  sState.className = 'meter-state';
  if (player.fatigueState !== FatigueState.Fresh) sState.classList.add(player.fatigueState);

  // Musket
  $('musket-status').textContent = player.musketLoaded ? 'Loaded' : 'Empty';
  ($('musket-status') as HTMLElement).style.color =
    player.musketLoaded ? 'var(--health-high)' : 'var(--morale-low)';
}

function renderLineStatus() {
  const { line } = state;

  // Officer
  const oc = $('officer-card');
  $('officer-rank').textContent = `${line.officer.rank} ${line.officer.name}`;
  $('officer-status').textContent = line.officer.status;
  oc.className = 'officer-card';
  if (!line.officer.alive) oc.classList.add('down');

  // Neighbours
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

  $('you-marker').textContent = `[ ${state.player.name.toUpperCase()} ]`;
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
  const { enemy } = state;
  const ms = state.meleeState;
  const isMelee = state.phase === BattlePhase.Melee && ms;

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
  if (isMelee && !state.battleOver) {
    oppCard.style.display = '';
    $('enemy-detail').style.display = 'none';
    const opp = ms.opponents[ms.currentOpponent];
    $('opp-name').textContent = opp.name;
    $('opp-desc').textContent = opp.description;
    $('opp-health-num').textContent = `${Math.max(0, Math.round(opp.health))} / ${opp.maxHealth}`;
    const hPct = Math.max(0, (opp.health / opp.maxHealth) * 100);
    $('opp-health-bar').style.width = `${hPct}%`;
    $('opp-fatigue-num').textContent = `${Math.round(opp.fatigue)} / ${opp.maxFatigue}`;
    const sPct = (opp.fatigue / opp.maxFatigue) * 100;
    $('opp-fatigue-bar').style.width = `${sPct}%`;
    $('opp-counter').textContent = `${ms.currentOpponent + 1} / ${ms.opponents.length}`;
    $('melee-kills').textContent = `${ms.killCount}`;

    // Status tags
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
  // Hide drill indicator during storybeat/melee
  if (state.phase === BattlePhase.StoryBeat || state.phase === BattlePhase.Melee) {
    indicator.style.display = 'none';
    return;
  }
  indicator.style.display = '';
  const steps = document.querySelectorAll('.drill-step');
  steps.forEach(el => {
    el.classList.remove('active', 'auto');
    const step = el.getAttribute('data-step');
    if (step === state.drillStep) el.classList.add('active');
    if (step === 'load') el.classList.add('auto');
  });
}

function renderPanorama() {
  const pano = document.getElementById('panorama');
  if (!pano) return;
  pano.setAttribute('data-volley', String(state.scriptedVolley));
  pano.setAttribute('data-drill', state.drillStep);

  // Range display
  const rangeEl = document.getElementById('pano-range-val');
  if (rangeEl) rangeEl.textContent = String(Math.round(state.enemy.range));

  // Gap width — maps 120 paces → 230px, 25 paces → 50px
  const gap = document.getElementById('pano-gap');
  if (gap) {
    const range = state.enemy.range;
    const basis = Math.round(50 + ((range - 25) / (120 - 25)) * (230 - 50));
    gap.style.flexBasis = `${Math.max(50, Math.min(230, basis))}px`;
  }

  // French block
  const frenchFill = document.getElementById('french-fill');
  const frenchBlock = document.getElementById('block-french');
  if (frenchFill && frenchBlock) {
    const integrity = state.line.lineIntegrity;
    frenchFill.style.width = `${integrity}%`;
    frenchFill.style.opacity = String(0.3 + (integrity / 100) * 0.7);

    // Integrity classes
    frenchBlock.classList.remove('integrity-damaged', 'integrity-broken');
    if (integrity < 40) frenchBlock.classList.add('integrity-broken');
    else if (integrity < 70) frenchBlock.classList.add('integrity-damaged');

    // Morale classes
    frenchBlock.classList.remove('morale-resolute', 'morale-holding', 'morale-shaken', 'morale-wavering', 'morale-breaking');
    frenchBlock.classList.add(`morale-${state.line.lineMorale}`);
  }

  // Austrian block
  const austrianFill = document.getElementById('austrian-fill');
  const austrianBlock = document.getElementById('block-austrian');
  if (austrianFill && austrianBlock) {
    const strength = state.enemy.strength;
    austrianFill.style.width = `${strength}%`;
    austrianFill.style.opacity = String(0.3 + (strength / 100) * 0.7);

    // Integrity classes (based on enemy lineIntegrity)
    austrianBlock.classList.remove('integrity-damaged', 'integrity-broken');
    if (state.enemy.lineIntegrity < 40) austrianBlock.classList.add('integrity-broken');
    else if (state.enemy.lineIntegrity < 70) austrianBlock.classList.add('integrity-damaged');

    // Morale classes
    austrianBlock.classList.remove('morale-advancing', 'morale-steady', 'morale-wavering', 'morale-charging', 'morale-trapped');
    austrianBlock.classList.add(`morale-${state.enemy.morale}`);
  }
}

function playVolleyAnimation(direction: 'french' | 'austrian'): Promise<void> {
  return new Promise((resolve) => {
    const container = document.getElementById('volley-streaks');
    if (!container) { resolve(); return; }

    const count = 6 + Math.floor(Math.random() * 5); // 6–10 streaks
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

    // Flash target block after 200ms
    setTimeout(() => {
      const targetId = direction === 'french' ? 'block-austrian' : 'block-french';
      const flashCls = direction === 'french' ? 'flash' : 'flash-hit';
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add(flashCls);
        setTimeout(() => target.classList.remove(flashCls), 300);
      }
    }, 200);

    // Cleanup after 600ms
    setTimeout(() => {
      streaks.forEach(s => s.remove());
      resolve();
    }, 600);
  });
}

function createLogEntryElement(entry: { type: string; text: string }): HTMLElement {
  const div = document.createElement('div');
  div.className = `log-entry ${entry.type}`;
  if (entry.type === 'morale') div.classList.add(entry.text.includes('+') ? 'positive' : 'negative');
  div.innerHTML = entry.text.split('\n\n').map(p => `<p>${p}</p>`).join('\n\n');
  return div;
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

function renderJournalOverlay() {
  const scroll = $('journal-scroll');
  scroll.innerHTML = '';
  for (let i = 0; i < state.log.length; i++) {
    const entry = state.log[i];
    if (i > 0 && entry.turn > state.log[i - 1]?.turn && entry.type === 'narrative') {
      const sep = document.createElement('hr');
      sep.className = 'log-separator';
      scroll.appendChild(sep);
      const marker = document.createElement('div');
      marker.className = 'turn-marker';
      marker.textContent = `— Turn ${entry.turn} —`;
      scroll.appendChild(marker);
    }
    scroll.appendChild(createLogEntryElement(entry));
  }
  requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; });
}

function renderLog() {
  const scroll = $('narrative-scroll');
  const turnEntries = state.log.filter(e => e.turn === state.turn);

  if (state.turn !== lastRenderedTurn) {
    crossFadeNarrative(scroll, turnEntries);
    lastRenderedTurn = state.turn;
    renderedEntriesForTurn = turnEntries.length;
    requestAnimationFrame(() => { scroll.scrollTop = 0; });
  } else if (turnEntries.length > renderedEntriesForTurn) {
    const page = scroll.querySelector('.narrative-page:not(.narrative-page-exiting)');
    if (page) {
      const newEntries = turnEntries.slice(renderedEntriesForTurn);
      for (const entry of newEntries) {
        page.appendChild(createLogEntryElement(entry));
      }
      renderedEntriesForTurn = turnEntries.length;
    }
  }
}

function renderMoraleChanges() {
  const container = $('morale-changes');
  if (state.pendingMoraleChanges.length === 0) { container.classList.remove('visible'); return; }
  container.classList.add('visible');
  container.innerHTML = state.pendingMoraleChanges.map(c => {
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
  if (state.battleOver) { $('actions-panel').style.display = 'none'; return; }
  $('actions-panel').style.display = 'block';

  // STORY BEAT PHASE: show story beat choices
  if (state.phase === BattlePhase.StoryBeat) {
    renderChargeChoices(grid);
    return;
  }

  // LINE PHASE: standard drill actions
  const fireIds = [ActionId.Fire, ActionId.SnapShot, ActionId.HoldFire, ActionId.AimCarefully,
    ActionId.TargetColumn, ActionId.TargetOfficers, ActionId.TargetWagon];
  const endureIds = [ActionId.Duck, ActionId.Pray, ActionId.DrinkWater, ActionId.StandFirm, ActionId.SteadyNeighbour,
    ActionId.ShowMercy];
  const fumbleIds = [ActionId.GoThroughMotions];

  for (const action of state.availableActions) {
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
  const encounter = getChargeEncounter(state);

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

// === Opening Story Beat ===

function renderOpeningBeat() {
  // Use the opening narrative from the first log entry
  const openingText = state.log[0]?.text || '';

  $('parchment-phase').textContent = 'BATTLE OF RIVOLI';
  $('parchment-encounter').textContent = '14 January 1797';

  const narrativeEl = $('parchment-narrative');
  narrativeEl.innerHTML = openingText
    .split('\n\n').filter((p: string) => p.trim()).map((p: string) => `<p>${p}</p>`).join('');

  $('parchment-status').innerHTML = `
    <div class="pstatus-item"><span class="pstatus-label">Morale</span><span class="pstatus-val">${Math.round(state.player.morale)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Health</span><span class="pstatus-val">${Math.round(state.player.health)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Fatigue</span><span class="pstatus-val">${Math.round(state.player.fatigue)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Line</span><span class="pstatus-val">${state.line.officer.rank} ${state.line.officer.name}</span></div>
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
    showOpeningBeat = false;
    lastRenderedTurn = -1;
    render();
  });
  choicesEl.appendChild(btn);
}

// === Phase 2: Storybook Rendering ===

function renderStorybookPage() {
  const encounter = getChargeEncounter(state);
  const { player } = state;

  // Story beat label
  const encounterTitles: Record<number, string> = {
    1: 'The Overrun Battery',
    2: 'Mass\u00e9na\'s Division',
    3: 'The Counterattack',
    4: 'The Aftermath',
  };
  $('parchment-encounter').textContent = encounterTitles[state.chargeEncounter] || 'Story Beat';

  // Narrative — use the encounter's own narrative text
  const narrativeEl = $('parchment-narrative');
  narrativeEl.innerHTML = encounter.narrative
    .split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');

  // Status bar
  $('parchment-status').innerHTML = `
    <div class="pstatus-item"><span class="pstatus-label">Morale</span><span class="pstatus-val">${Math.round(player.morale)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Health</span><span class="pstatus-val">${Math.round(player.health)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Fatigue</span><span class="pstatus-val">${Math.round(player.fatigue)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">State</span><span class="pstatus-val">${player.moraleThreshold.toUpperCase()}</span></div>
  `;

  // Choices
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

// === Phase 3: Arena Rendering ===

function renderArena() {
  const ms = state.meleeState;
  if (!ms) return;
  const { player } = state;
  const opp = ms.opponents[ms.currentOpponent];

  // Header
  $('arena-round').textContent = `Round ${ms.exchangeCount} / ${ms.maxExchanges}`;
  $('arena-kills').textContent = `Kills: ${ms.killCount}`;

  // Player meters
  const hpPct = (player.health / player.maxHealth) * 100;
  const spPct = (player.fatigue / player.maxFatigue) * 100;
  const mrPct = (player.morale / player.maxMorale) * 100;
  ($('arena-player-hp-bar') as HTMLElement).style.width = `${hpPct}%`;
  $('arena-player-hp-val').textContent = `${Math.round(player.health)}`;
  ($('arena-player-ft-bar') as HTMLElement).style.width = `${spPct}%`;
  $('arena-player-ft-val').textContent = `${Math.round(player.fatigue)}`;
  ($('arena-player-mr-bar') as HTMLElement).style.width = `${mrPct}%`;
  $('arena-player-mr-val').textContent = `${Math.round(player.morale)}`;

  $('arena-player-name').textContent = state.player.name;
  $('portrait-name').textContent = state.player.name;

  // Player stance
  const stanceNames: Record<MeleeStance, string> = {
    [MeleeStance.Aggressive]: 'AGGRESSIVE',
    [MeleeStance.Balanced]: 'BALANCED',
    [MeleeStance.Defensive]: 'DEFENSIVE',
  };
  $('arena-player-stance').textContent = stanceNames[ms.playerStance];

  // Player statuses
  const pTags: string[] = [];
  if (ms.playerStunned > 0) pTags.push('<span class="opp-status-tag stunned">STUNNED</span>');
  if (ms.playerFeinted) pTags.push('<span class="opp-status-tag" style="border-color:var(--accent-gold);color:var(--accent-gold)">FEINTED</span>');
  if (ms.playerRiposte) pTags.push('<span class="opp-status-tag" style="border-color:var(--health-high);color:var(--health-high)">RIPOSTE</span>');
  $('arena-player-statuses').innerHTML = pTags.join('');

  // Opponent
  $('arena-opp-name').textContent = opp.name;
  $('arena-opp-desc').textContent = opp.description;
  const oppHpPct = Math.max(0, (opp.health / opp.maxHealth) * 100);
  const oppSpPct = (opp.fatigue / opp.maxFatigue) * 100;
  ($('arena-opp-hp-bar') as HTMLElement).style.width = `${oppHpPct}%`;
  $('arena-opp-hp-val').textContent = `${Math.max(0, Math.round(opp.health))}`;
  ($('arena-opp-ft-bar') as HTMLElement).style.width = `${oppSpPct}%`;
  $('arena-opp-ft-val').textContent = `${Math.round(opp.fatigue)}`;

  // Opponent statuses
  const oTags: string[] = [];
  if (opp.stunned) oTags.push('<span class="opp-status-tag stunned">STUNNED</span>');
  if (opp.armInjured) oTags.push('<span class="opp-status-tag arm-injured">ARM INJURED</span>');
  if (opp.legInjured) oTags.push('<span class="opp-status-tag leg-injured">LEG INJURED</span>');
  $('arena-opp-statuses').innerHTML = oTags.join('');

  // Opponent counter
  $('arena-opp-counter').textContent = `Opponent ${ms.currentOpponent + 1} / ${ms.opponents.length}`;

  // Arena log
  renderArenaLog();

  // Duel display
  renderDuelDisplay(player, opp);

  // Arena actions
  renderArenaActions();
}

function renderDuelDisplay(
  player: BattleState['player'],
  opp: { health: number; maxHealth: number },
) {
  const duelPlayer = document.getElementById('duel-player');
  const duelOpp = document.getElementById('duel-opponent');
  if (!duelPlayer || !duelOpp) return;

  // Player health state
  const pHpPct = (player.health / player.maxHealth) * 100;
  duelPlayer.classList.remove('duel-wounded', 'duel-critical', 'duel-defeated');
  if (pHpPct <= 0) duelPlayer.classList.add('duel-defeated');
  else if (pHpPct < 30) duelPlayer.classList.add('duel-critical');
  else if (pHpPct < 60) duelPlayer.classList.add('duel-wounded');

  // Player stance glow
  duelPlayer.classList.remove('stance-aggressive', 'stance-defensive');
  if (meleeStance === MeleeStance.Aggressive) duelPlayer.classList.add('stance-aggressive');
  else if (meleeStance === MeleeStance.Defensive) duelPlayer.classList.add('stance-defensive');

  // Opponent health state
  const oHpPct = Math.max(0, (opp.health / opp.maxHealth) * 100);
  duelOpp.classList.remove('duel-wounded', 'duel-critical', 'duel-defeated');
  if (oHpPct <= 0) duelOpp.classList.add('duel-defeated');
  else if (oHpPct < 30) duelOpp.classList.add('duel-critical');
  else if (oHpPct < 60) duelOpp.classList.add('duel-wounded');
}

function renderArenaLog() {
  const feed = $('arena-narrative');
  // Only render new entries since last render
  for (let i = arenaLogCount; i < state.log.length; i++) {
    const entry = state.log[i];
    const div = document.createElement('div');
    div.className = `arena-log-entry ${entry.type}`;
    if (entry.type === 'morale') div.classList.add(entry.text.includes('+') ? 'positive' : 'negative');
    div.textContent = entry.text.replace(/\n+/g, ' ').slice(0, 200);
    feed.appendChild(div);
  }
  arenaLogCount = state.log.length;

  // Keep only last 20 entries visible
  while (feed.children.length > 20) {
    feed.removeChild(feed.firstChild!);
  }
  requestAnimationFrame(() => { feed.scrollTop = feed.scrollHeight; });
}

function renderArenaActions() {
  const grid = $('arena-actions-grid');
  grid.innerHTML = '';
  if (state.battleOver) return;

  const ms = state.meleeState;
  if (!ms) return;

  // Stance toggle bar (always visible)
  const stanceBar = document.createElement('div');
  stanceBar.className = 'stance-toggle-bar';
  const stances: { id: MeleeStance; label: string; cls: string }[] = [
    { id: MeleeStance.Aggressive, label: 'Aggressive', cls: 'aggressive' },
    { id: MeleeStance.Balanced, label: 'Balanced', cls: 'balanced' },
    { id: MeleeStance.Defensive, label: 'Defensive', cls: 'defensive' },
  ];
  for (const s of stances) {
    const btn = document.createElement('button');
    btn.className = `stance-toggle-btn ${s.cls}`;
    if (meleeStance === s.id) btn.classList.add('active');
    btn.textContent = s.label;
    btn.addEventListener('click', () => {
      meleeStance = s.id;
      renderArenaActions();
    });
    stanceBar.appendChild(btn);
  }
  grid.appendChild(stanceBar);

  // Body part selection (Step 2 of attack flow)
  if (ms.selectingTarget && meleeSelectedAction) {
    const backBtn = document.createElement('button');
    backBtn.className = 'action-btn action-back';
    backBtn.innerHTML = `<span class="action-name">\u2190 Back</span>`;
    backBtn.addEventListener('click', () => {
      meleeSelectedAction = null;
      ms.selectingTarget = false;
      meleeActionCategory = 'attack';
      renderArenaActions();
    });
    grid.appendChild(backBtn);

    const label = document.createElement('div');
    label.className = 'melee-step-label';
    label.textContent = 'Choose target';
    grid.appendChild(label);

    const targets = document.createElement('div');
    targets.className = 'body-target-grid';

    const parts: { id: BodyPart; label: string; desc: string }[] = [
      { id: BodyPart.Head, label: 'Head', desc: '-25% hit. Stun + 10% kill.' },
      { id: BodyPart.Torso, label: 'Torso', desc: 'Standard. Reliable.' },
      { id: BodyPart.Arms, label: 'Arms', desc: '-10% hit. 15% arm injury.' },
      { id: BodyPart.Legs, label: 'Legs', desc: '-15% hit. Slows opponent.' },
    ];

    for (const p of parts) {
      const btn = document.createElement('button');
      btn.className = 'body-target-btn';
      btn.innerHTML = `<span class="body-target-label">${p.label}</span><span class="body-target-desc">${p.desc}</span>`;
      btn.addEventListener('click', () => {
        handleMeleeAction(meleeSelectedAction!, p.id);
      });
      targets.appendChild(btn);
    }
    grid.appendChild(targets);
    return;
  }

  // Action selection — two-tier category system
  const actions = getMeleeActions(state);
  const attackIds = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike];
  const defendIds = [MeleeActionId.Guard, MeleeActionId.Dodge];
  const tacticsIds = [MeleeActionId.Feint, MeleeActionId.Respite, MeleeActionId.Shoot];
  const immediateIds = [MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Feint, MeleeActionId.Respite, MeleeActionId.Shoot];

  const attacks = actions.filter(a => attackIds.includes(a.id));
  const defends = actions.filter(a => defendIds.includes(a.id));
  const tactics = actions.filter(a => tacticsIds.includes(a.id));

  if (meleeActionCategory === 'top') {
    // Top-level category buttons
    const categories: { id: 'attack' | 'defend' | 'tactics'; label: string; desc: string; cls: string; items: typeof actions }[] = [
      { id: 'attack', label: 'Attack', desc: 'Strike at the enemy', cls: 'melee-attack', items: attacks },
      { id: 'defend', label: 'Defend', desc: 'Guard or evade', cls: 'melee-defense', items: defends },
      { id: 'tactics', label: 'Tactics', desc: 'Feint, shoot, or catch breath', cls: 'melee-utility', items: tactics },
    ];

    for (const cat of categories) {
      if (cat.items.length === 0) continue;
      const btn = document.createElement('button');
      btn.className = `action-btn action-category ${cat.cls}`;
      const anyAvailable = cat.items.some(a => a.available);
      if (!anyAvailable) {
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
      }
      btn.innerHTML = `
        <span class="action-name">${cat.label}</span>
        <span class="action-desc">${cat.desc}</span>
      `;
      btn.addEventListener('click', () => {
        meleeActionCategory = cat.id;
        renderArenaActions();
      });
      grid.appendChild(btn);
    }
  } else {
    // Sub-actions within a category
    const categoryActions =
      meleeActionCategory === 'attack' ? attacks :
      meleeActionCategory === 'defend' ? defends : tactics;

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'action-btn action-back';
    backBtn.innerHTML = `<span class="action-name">\u2190 Back</span>`;
    backBtn.addEventListener('click', () => {
      meleeActionCategory = 'top';
      renderArenaActions();
    });
    grid.appendChild(backBtn);

    for (const action of categoryActions) {
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      if (attackIds.includes(action.id)) btn.classList.add('melee-attack');
      else if (defendIds.includes(action.id)) btn.classList.add('melee-defense');
      else btn.classList.add('melee-utility');

      if (!action.available) {
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
      }

      btn.innerHTML = `
        <span class="action-name">${action.label}</span>
        <span class="action-desc">${action.description}</span>
      `;
      btn.addEventListener('click', () => {
        if (immediateIds.includes(action.id)) {
          handleMeleeAction(action.id);
        } else {
          meleeSelectedAction = action.id;
          ms.selectingTarget = true;
          renderArenaActions();
        }
      });
      grid.appendChild(btn);
    }
  }

  // Flee option at Breaking morale
  if (state.player.moraleThreshold === MoraleThreshold.Breaking) {
    const fleeBtn = document.createElement('button');
    fleeBtn.className = 'action-btn fumble-action';
    fleeBtn.innerHTML = `
      <span class="action-name">Flee</span>
      <span class="action-desc">You can't take any more. Drop everything and run.</span>
    `;
    fleeBtn.addEventListener('click', () => {
      if (processing) return;
      processing = true;
      state = resolveMeleeRout(state);
      gameState.battleState = state;
      render();
      processing = false;
    });
    grid.appendChild(fleeBtn);
  }
}

// Melee UI state (local to app.ts — tracks multi-step selection)
let meleeStance: MeleeStance = MeleeStance.Balanced;
let meleeSelectedAction: MeleeActionId | null = null;
let meleeActionCategory: 'top' | 'attack' | 'defend' | 'tactics' = 'top';

async function handleMeleeAction(action: MeleeActionId, bodyPart?: BodyPart) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  const prevPlayerHp = state.player.health;
  const prevOppHp = state.meleeState ? state.meleeState.opponents[state.meleeState.currentOpponent].health : 0;

  const input: MeleeTurnInput = { action, bodyPart, stance: meleeStance };
  state = advanceTurn(state, ActionId.Fire /* dummy, ignored */, input);
  gameState.battleState = state;

  // Reset local melee UI state
  meleeSelectedAction = null;
  meleeActionCategory = 'top';

  render();

  // Duel hit flashes based on health changes
  const ms = state.meleeState;
  if (ms) {
    const opp = ms.opponents[ms.currentOpponent];
    if (opp.health < prevOppHp) {
      const el = document.getElementById('duel-opponent');
      if (el) { el.classList.add('duel-hit'); setTimeout(() => el.classList.remove('duel-hit'), 350); }
    }
    if (state.player.health < prevPlayerHp) {
      const el = document.getElementById('duel-player');
      if (el) { el.classList.add('duel-hit'); setTimeout(() => el.classList.remove('duel-hit'), 350); }
    }
  }

  if (state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  processing = false;
}

async function handleChargeAction(choiceId: ChargeChoiceId) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  state = advanceTurn(state, choiceId);
  gameState.battleState = state;
  render();

  if (state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  processing = false;
}

function renderBattleOver() {
  $('battle-over').style.display = 'flex';
  const name = state.player.name;
  const titles: Record<string, string> = {
    victory: `${name} — Victory`, survived: `${name} Survived`, rout: `${name} Broke`, defeat: `${name} — Killed in Action`,
    cavalry_victory: `${name} — Cavalry Charge Victory`,
    part1_complete: state.batteryCharged ? `${name} — The Battery is Yours` : `${name} — The Fourteenth Holds`,
    part2_gorge_setup: `${name} — To the Ridge`,
    gorge_victory: `${name} — The Gorge`,
  };
  const texts: Record<string, string> = {
    victory: 'The plateau is yours. The last Austrian line breaks and flees down the gorges of the Adige, white coats vanishing into the frozen valley below. The drums fall silent. For the first time in hours, you can hear the wind.\n\nYou stood when others would have broken. The men around you — what is left of them — lean on their muskets and stare at the field. Nobody cheers. Not yet. The ground is covered with the fallen of both armies, French blue and Austrian white together in the January mud.\n\nSomewhere behind the ridge, Bonaparte watches. He will call this a great victory. The gazettes in Paris will celebrate. But here, on the plateau, among the men who held the line, there is only silence and the slow realisation that you are still alive.\n\nRivoli is won. The price is written in the faces of the men who paid it.',
    survived: 'Hands drag you from the press. Sergeant Duval, blood on his face, shoving you toward the rear. "Enough, lad. You\'ve done enough."\n\nYou stumble back through the wreckage of the line — broken muskets, torn cartridge boxes, men sitting in the mud with blank stares. The battle goes on without you. You can hear it: the clash of steel, the screaming, the drums still beating the pas de charge.\n\nYou survived Rivoli. Not gloriously. Not like the stories they\'ll tell in Paris. You survived it the way most men survive battles — by enduring what no one should have to endure, and then being pulled out before it killed you.\n\nYour hands won\'t stop shaking. They won\'t stop for a long time.',
    rout: 'You ran. The bayonet dropped from fingers that couldn\'t grip anymore, and your legs carried you away — stumbling over the dead, sliding on frozen ground, down the slope and away from the guns.\n\nYou are not alone. Others run with you, men whose courage broke at the same moment yours did. Nobody speaks. Nobody looks at each other.\n\nBehind you, the battle goes on. The line holds without you — or it doesn\'t. You don\'t look back to find out. The shame will come later, in quiet moments, for the rest of your life. Right now there is only the animal need to breathe, to move, to live.\n\nYou survived Rivoli. That word will taste like ashes every time you say it.',
    defeat: state.phase === 'melee' || state.phase === 'storybeat'
      ? 'The steel finds you. A moment of pressure, then fire, then cold. You go down in the press of bodies, in the mud and the blood, on this frozen plateau above the Adige.\n\nThe sky is very blue. The sounds of battle fade — the crash of volleys, the drums, the screaming — all of it pulling away like a tide going out. Someone steps over you. Then another.\n\nYou came to Rivoli as a soldier of the Republic. You fought beside Pierre, beside Jean-Baptiste, beside men whose names you barely learned. You held the line as long as you could.\n\nThe 14th of January, 1797. The plateau. The cold. The white coats coming through the smoke.\n\nThis is where your war ends.'
      : 'The ball finds you. No warning — just a punch in the chest that drives the air from your lungs and drops you where you stand. The musket clatters from your hands.\n\nThe sky above the Adige valley is pale January blue. Around you, the volley line fires on without you — three hundred muskets thundering, the smoke rolling thick and white. Someone shouts your name. You cannot answer.\n\nYou came to Rivoli to hold the line. You stood in the dawn cold, shoulder to shoulder with men you\'d known for weeks or hours. You did your duty.\n\nThe drums are still beating. The battle goes on. But not for you.\n\nThe 14th of January, 1797. This is where your war ends.',
    cavalry_victory: 'The thunder comes from behind — hooves on frozen ground, hundreds of them, a sound that shakes the plateau itself. The chasseurs à cheval pour over the ridge in a wave of green coats and flashing sabres.\n\nThe Austrians see them too late. The cavalry hits their flank like a hammer on glass. The white-coated line — that terrible, advancing line that has been trying to kill you for the last hour — shatters. Men throw down their muskets and run.\n\nYou stand among the wreckage, bayonet still raised, chest heaving. Around you, the survivors of the demi-brigade stare as the cavalry sweeps the field. Nobody speaks. The relief is too enormous for words.\n\nBonaparte timed it perfectly. He always does. The chasseurs finish what the infantry started — what you started, standing in the line on this frozen plateau since dawn.\n\nRivoli is won. You held long enough.',
    part1_complete: state.batteryCharged
      ? 'The battery is yours. French guns, retaken by French bayonets. The tricolour goes up over the smoking pieces and a ragged cheer rises from the men of the 14th.\n\nPierre is beside you, blood still seeping through the makeshift bandage on his shoulder. He leans on his musket and watches the gunners wrestle the pieces around to face the Austrian columns. "Not bad," he says. "For a conscript."\n\nJean-Baptiste is alive. Somehow. He sits against a wheel of the nearest gun, staring at nothing. His bayonet is red. He will never be the same boy who gripped his musket like driftwood at dawn.\n\nThe guns roar again \u2014 this time in the right direction. Canister tears into the white-coated columns still pressing the plateau. The Austrians falter. The 14th demi-brigade held its ground, retook its guns, and turned the tide.\n\nThe battle of Rivoli is not over. But Part 1 is.\n\nYou survived. You fought. And when the captain called, you charged.'
      : 'The battery is retaken \u2014 by other men. You watched from fifty paces back as Captain Leclerc led the charge, as Pierre ran with blood on his sleeve, as men whose courage you could not match threw themselves at the guns.\n\nThe tricolour goes up. The cheer rises. You are not part of it.\n\nJean-Baptiste is beside you. He didn\'t charge either. Neither of you speaks. There is nothing to say.\n\nThe guns roar again, turned back on the Austrians. The 14th held its ground. The battery is retaken. The battle goes on.\n\nBut you will remember this moment. The moment you chose safety over glory. The moment Pierre looked back and you weren\'t there.\n\nPart 1 is over. You survived. That will have to be enough.',
    part2_gorge_setup: 'The 14th moves out. What is left of it.\n\nYou march toward the ridge \u2014 toward Bonaparte, toward the gorge, toward whatever comes next. Your musket weighs more than it did at dawn. Your legs move because there is no alternative. The drums beat the advance.\n\nAround you, the survivors of seven volleys and a bayonet charge climb the slope. Pierre is beside you, blood-soaked but upright. Jean-Baptiste somewhere behind, still carrying his musket, still in the line. Captain Leclerc ahead, sword drawn, leading what remains.\n\nBelow the ridge, the gorge opens \u2014 a narrow defile where the Adige carves through the mountains. Somewhere down there, the Austrian retreat will become a rout. Or the French advance will become a massacre.\n\nBonaparte watches from above. He has seen the 14th hold the plateau. He has seen the battery retaken. Now he sends them into the gorge.\n\nThe battle of Rivoli is not over. But for now, the 14th has done enough. More than enough.\n\nWhat comes next will be written in the gorge.',
    gorge_victory: 'The gorge is silent. The Austrian column \u2014 ten thousand men who marched into this defile with drums beating and colours flying \u2014 has ceased to exist. The gorge floor is carpeted with the wreckage of an army: abandoned muskets, shattered wagons, white coats stained red.\n\nThe 14th descends from the ridge. Not charging. Not advancing. Just walking, slowly, through the aftermath of what they have done. Men step carefully among the fallen. Some offer water to Austrian wounded. Others cannot look.\n\nPierre stands at the edge of the crater where the ammunition wagon was. He says nothing. His face says everything.\n\nCaptain Leclerc finds you. His sword is sheathed. His eyes are old. "You did your duty, soldier," he says. The words should comfort. They don\'t.\n\nOn the ridge above, Bonaparte is already dictating dispatches. Rivoli is a victory. A decisive victory. The Italian campaign is won. The name will echo through history.\n\nBut here, in the gorge, among the men who made that victory possible, there is no celebration. There is only the silence of the living standing among the dead, and the knowledge that what happened here today will follow them forever.\n\nThe Battle of Rivoli is over. You survived it. All of it.',
  };
  $('battle-over-title').textContent = titles[state.outcome] || 'Battle Over';
  const endText = texts[state.outcome] || '';
  $('battle-over-text').innerHTML = endText.split('\n\n').map(p => `<p>${p}</p>`).join('');

  // Show "Continue to Camp" for surviving outcomes (not death)
  const canContinue = state.outcome !== 'defeat';
  ($('btn-continue-camp') as HTMLElement).style.display = canContinue ? 'inline-block' : 'none';

  const meleeKills = state.meleeState?.killCount || 0;
  const gorgeStats = state.outcome === 'gorge_victory' ? `
    Wagon detonated: ${state.wagonDamage >= 100 ? 'Yes' : 'No'}<br>
    Mercy shown: ${state.gorgeMercyCount} time${state.gorgeMercyCount !== 1 ? 's' : ''}<br>
  ` : '';
  $('battle-stats').innerHTML = `
    Turns survived: ${state.turn}<br>
    Final morale: ${Math.round(state.player.morale)} (${state.player.moraleThreshold})<br>
    Valor: ${state.player.valor}<br>
    Health: ${Math.round(state.player.health)}% | Fatigue: ${Math.round(state.player.fatigue)}%<br>
    Volleys fired: ${state.volleysFired}<br>
    ${meleeKills > 0 ? `Melee kills: ${meleeKills}<br>` : ''}
    ${gorgeStats}
    Enemy strength: ${Math.round(state.enemy.strength)}%<br>
    Line integrity: ${Math.round(state.line.lineIntegrity)}%<br>
    <br>
    <em style="font-size:11px;opacity:0.7">The Battle of Rivoli, 14 January 1797, was Bonaparte's decisive victory in the Italian campaign. Outnumbered nearly three to one, the French held the plateau above the Adige until a cavalry charge broke the Austrian flank.</em>
  `;
}

// === Load Animation ===

function showLoadAnimation(result: LoadResult): Promise<void> {
  return new Promise((resolve) => {
    const grid = $('actions-grid');
    const steps = result.narrativeSteps;

    // Show reload sequence in the action grid area
    grid.innerHTML = `<div class="load-sequence"><div class="load-title">RELOADING</div><div class="load-steps-row" id="load-steps-row"></div></div>`;
    const row = $('load-steps-row');

    let stepIndex = 0;

    function showNextStep() {
      if (stepIndex >= steps.length) {
        // Show final result
        const verdict = document.createElement('div');
        verdict.className = `load-verdict-inline ${result.success ? 'loaded' : 'fumbled'}`;
        verdict.textContent = result.success ? 'LOADED' : 'FUMBLED';
        row.appendChild(verdict);

        setTimeout(() => {
          resolve();
        }, 1000);
        return;
      }

      const step = steps[stepIndex];
      const stepEl = document.createElement('div');
      stepEl.className = `load-step-inline ${step.success ? 'success' : 'failed'}`;
      stepEl.textContent = step.label;

      // Animate in
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

// === Action Handler (async for load animation) ===

async function handleAction(actionId: ActionId) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  const prevDrillStep = state.drillStep;
  const wasFire = actionId === ActionId.Fire || actionId === ActionId.SnapShot;

  // Play sound immediately on click, before advanceTurn() computation
  if (wasFire) playVolleySound();

  state = advanceTurn(state, actionId);
  gameState.battleState = state;

  if (wasFire) {
    await playVolleyAnimation('french');
  }

  // Endure → load transition means Austrian return fire
  if (prevDrillStep === DrillStep.Endure && state.phase === BattlePhase.Line) {
    playDistantVolleySound();
    await playVolleyAnimation('austrian');
  }

  // Check for load animation
  if (state.lastLoadResult) {
    // Show "LOAD" on drill indicator and hide actions during animation
    const steps = document.querySelectorAll('.drill-step');
    steps.forEach(el => {
      el.classList.remove('active');
      if (el.getAttribute('data-step') === 'load') el.classList.add('active');
    });
    $('actions-grid').innerHTML = '';
    await showLoadAnimation(state.lastLoadResult);
  }

  render();

  // Shake on big morale drop
  if (state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  // Check for fumbled FIRE (no available actions at FIRE step)
  if (state.drillStep === DrillStep.Fire && state.player.fumbledLoad && state.availableActions.length === 0) {
    // Auto-resolve after a pause
    setTimeout(() => {
      state = resolveAutoFumbleFire(state);
      gameState.battleState = state;
      render();
      processing = false;
    }, 1500);
    return;
  }

  processing = false;
}

// === Camp Phase Rendering ===

function renderCampHeader() {
  const camp = gameState.campState!;
  const totalActions = camp.maxDays * camp.activitiesPerDay;
  const spent = (camp.day - 1) * camp.activitiesPerDay + (camp.activitiesPerDay - camp.activitiesRemaining);
  const pct = Math.min(100, (spent / totalActions) * 100);
  $('phase-label').textContent = 'CAMP';
  $('turn-counter').textContent = '';
  $('camp-location').textContent = camp.conditions.location;
  $('camp-time-fill').style.width = `${pct}%`;
}

function renderCamp() {
  const camp = gameState.campState!;
  const player = gameState.player;
  const npcs = gameState.npcs;

  // Center — primary stat meters only (full stats in Character menu)
  const statBars = [
    { label: 'Valor', value: player.valor, cls: 'morale-fill' },
    { label: 'Dexterity', value: player.dexterity, cls: 'health-fill' },
    { label: 'Strength', value: player.strength, cls: 'fatigue-fill' },
  ];
  $('camp-player-stats').innerHTML = statBars.map(s => `
    <div class="camp-meter-group">
      <div class="camp-meter-header">
        <span class="meter-label">${s.label}</span>
        <span class="meter-value">${s.value}</span>
      </div>
      <div class="meter-track"><div class="meter-fill ${s.cls}" style="width:${s.value}%"></div></div>
    </div>
  `).join('') + `
    <div class="status-row"><span class="status-key">Rank</span><span class="status-val">${player.rank}</span></div>
    <div class="status-row"><span class="status-key">Experience</span><span class="status-val">${player.experience}</span></div>
  `;

  // Center — NPC opinion bars
  const npcListEl = $('camp-npc-list');
  npcListEl.innerHTML = '';
  for (const npc of npcs) {
    const relPct = Math.max(0, ((npc.relationship + 100) / 200) * 100);
    const relLabel = !npc.alive ? 'Dead' : npc.relationship > 20 ? 'Friendly' : npc.relationship < -20 ? 'Hostile' : 'Neutral';
    const card = document.createElement('div');
    card.className = 'camp-npc-opinion';
    if (!npc.alive) card.classList.add('dead');
    card.innerHTML = `
      <div class="camp-npc-opinion-header">
        <span class="camp-npc-name">${npc.name}</span>
        <span class="camp-npc-rel-label">${relLabel}</span>
      </div>
      <div class="meter-track"><div class="meter-fill morale-fill" style="width:${relPct}%"></div></div>
    `;
    npcListEl.appendChild(card);
  }

  // Right — conditions
  $('camp-conditions').innerHTML = `
    <div class="status-row"><span class="status-key">Weather</span><span class="status-val">${camp.conditions.weather}</span></div>
    <div class="status-row"><span class="status-key">Supply</span><span class="status-val">${camp.conditions.supplyLevel}</span></div>
    <div class="status-row"><span class="status-key">Camp Morale</span><span class="status-val">${camp.conditions.campMorale}</span></div>
  `;

  // Narrative log
  renderCampNarrative();

  // Pending event overlay
  if (camp.pendingEvent) {
    renderCampEvent(camp.pendingEvent);
    return; // Don't show activities while event is pending
  }

  // Hide event overlay if no event
  $('camp-event-overlay').style.display = 'none';

  // Activities grid or march button
  if (isCampComplete(camp)) {
    $('camp-activities-grid').innerHTML = '';
    $('btn-march').style.display = 'block';
  } else {
    $('btn-march').style.display = 'none';
    renderCampActivities();
  }
}

function renderCampNarrative() {
  const camp = gameState.campState!;
  const container = $('camp-narrative');

  for (let i = campLogCount; i < camp.log.length; i++) {
    const entry = camp.log[i];
    const div = document.createElement('div');
    div.className = `camp-log-entry ${entry.type}`;
    div.innerHTML = entry.text;
    container.appendChild(div);
  }
  campLogCount = camp.log.length;
  requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
}

function renderCampActivities() {
  const camp = gameState.campState!;
  const activities = getCampActivities(gameState.player, camp);
  const grid = $('camp-activities-grid');
  grid.innerHTML = '';

  for (const act of activities) {
    const btn = document.createElement('button');
    btn.className = 'action-btn camp-activity-btn';
    if (!act.available) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    }
    btn.innerHTML = `
      <span class="action-name">${act.name}</span>
      <span class="action-desc">${act.description}</span>
      ${act.fatigueCost > 0 ? `<span class="camp-activity-cost">Fatigue: -${act.fatigueCost}</span>` : ''}
    `;

    if (act.requiresTarget) {
      btn.addEventListener('click', () => showNPCSelect(act.id));
    } else {
      btn.addEventListener('click', () => handleCampActivity(act.id));
    }
    grid.appendChild(btn);
  }
}

function renderCampEvent(event: import('./types').CampEvent) {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  content.innerHTML = `
    <h3>${event.title}</h3>
    <p class="camp-event-narrative">${event.narrative}</p>
    <div class="camp-event-choices"></div>
  `;
  const choicesEl = content.querySelector('.camp-event-choices')!;
  for (const choice of event.choices) {
    const btn = document.createElement('button');
    btn.className = 'parchment-choice';
    btn.innerHTML = `
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${choice.label}</span>
        <span class="parchment-choice-desc">${choice.description}</span>
      </div>
    `;
    btn.addEventListener('click', () => handleCampEventChoice(choice.id));
    choicesEl.appendChild(btn);
  }
}

function showNPCSelect(activityId: CampActivityId) {
  const npcs = gameState.npcs.filter(n => n.alive);
  // Create a simple overlay for NPC selection
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  content.innerHTML = `
    <h3>Choose a Comrade</h3>
    <p>Who do you want to spend time with?</p>
    <div class="camp-event-choices"></div>
  `;
  const choicesEl = content.querySelector('.camp-event-choices')!;
  for (const npc of npcs) {
    const btn = document.createElement('button');
    btn.className = 'parchment-choice';
    const relLabel = npc.relationship > 20 ? 'Friendly' : npc.relationship < -20 ? 'Hostile' : 'Neutral';
    btn.innerHTML = `
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${npc.name}</span>
        <span class="parchment-choice-desc">${npc.role} — ${relLabel}</span>
      </div>
    `;
    btn.addEventListener('click', () => {
      overlay.style.display = 'none';
      handleCampActivity(activityId, npc.id);
    });
    choicesEl.appendChild(btn);
  }
}

function handleCampActivity(activityId: CampActivityId, targetNpcId?: string) {
  if (processing) return;
  processing = true;

  advanceCampTurn(gameState, activityId, targetNpcId);
  render();

  processing = false;
}

function handleCampEventChoice(choiceId: string) {
  if (processing) return;
  processing = true;

  resolveCampEventAction(gameState, choiceId);
  render();

  processing = false;
}

function handleContinueToCamp() {
  transitionToCamp(gameState);
  campLogCount = 0;
  lastRenderedTurn = -1;
  renderedEntriesForTurn = 0;
  arenaLogCount = 0;
  $('camp-narrative').innerHTML = '';
  $('battle-over').style.display = 'none';
  $('journal-overlay').style.display = 'none';
  render();
}

function handleMarchToBattle() {
  const fromPreBattle = gameState.campState?.context === 'pre-battle';

  transitionToBattle(gameState);
  state = gameState.battleState!;

  if (fromPreBattle) {
    // Coming from pre-battle camp: start the battle with opening beat parchment
    state = beginBattle(state);
    gameState.battleState = state;
    showOpeningBeat = true;
  } else {
    // Coming from post-battle camp: standard march narrative
    const battleName = gameState.campaign.currentBattle;
    state.log.push({
      turn: 0,
      text: `The drums call again. The regiment marches to ${battleName}. The men fall in, checking flints and tightening straps. Another battle awaits.`,
      type: 'narrative',
    });
    state.availableActions = getScriptedAvailableActions(state);
  }

  lastRenderedTurn = -1;
  renderedEntriesForTurn = 0;
  arenaLogCount = 0;
  $('narrative-scroll').innerHTML = '';
  $('arena-narrative').innerHTML = '';
  render();
}

// Character overlay
function renderCharacterPanel() {
  const pc = gameState.player;
  const inBattle = gameState.phase === GamePhase.Battle && state;
  $('char-stats').innerHTML = `
    <div class="status-row"><span class="status-key">Name</span><span class="status-val">${pc.name}</span></div>
    <div class="status-row"><span class="status-key">Rank</span><span class="status-val">${pc.rank}</span></div>
    <div class="status-row"><span class="status-key">Experience</span><span class="status-val">${pc.experience}</span></div>
    <div class="status-row"><span class="status-key">Valor</span><span class="status-val">${pc.valor}</span></div>
    <div class="status-row"><span class="status-key">Dexterity</span><span class="status-val">${pc.dexterity}</span></div>
    <div class="status-row"><span class="status-key">Strength</span><span class="status-val">${pc.strength}</span></div>
    <div class="status-row"><span class="status-key">Endurance</span><span class="status-val">${pc.endurance}</span></div>
    <div class="status-row"><span class="status-key">Constitution</span><span class="status-val">${pc.constitution}</span></div>
    <div class="status-row"><span class="status-key">Charisma</span><span class="status-val">${pc.charisma}</span></div>
    <div class="status-row"><span class="status-key">Intelligence</span><span class="status-val">${pc.intelligence}</span></div>
    <div class="status-row"><span class="status-key">Awareness</span><span class="status-val">${pc.awareness}</span></div>
    <div class="status-row"><span class="status-key">Reputation</span><span class="status-val">${pc.reputation}</span></div>
    <div class="status-row"><span class="status-key">NCO Approval</span><span class="status-val">${pc.ncoApproval}</span></div>
    ${inBattle ? `
    <hr style="border-color:var(--text-dim);margin:8px 0;">
    <div class="status-row"><span class="status-key">Morale</span><span class="status-val">${Math.round(state.player.morale)} / ${state.player.maxMorale}</span></div>
    <div class="status-row"><span class="status-key">Health</span><span class="status-val">${Math.round(state.player.health)} / ${state.player.maxHealth}</span></div>
    <div class="status-row"><span class="status-key">Fatigue</span><span class="status-val">${Math.round(state.player.fatigue)} / ${state.player.maxFatigue}</span></div>
    <div class="status-row"><span class="status-key">Volleys Fired</span><span class="status-val">${state.volleysFired}</span></div>
    ` : ''}
  `;
  $('char-inventory').innerHTML = inBattle ? `
    <div class="status-row"><span class="status-key">Musket</span><span class="status-val">Charleville M1777 — ${state.player.musketLoaded ? 'Loaded' : 'Empty'}</span></div>
    <div class="status-row"><span class="status-key">Bayonet</span><span class="status-val">17-inch socket</span></div>
    <div class="status-row"><span class="status-key">Cartridges</span><span class="status-val">~40 remaining</span></div>
    <div class="status-row"><span class="status-key">Canteen</span><span class="status-val">${3 - state.player.canteenUses} drinks left</span></div>
    <div class="status-row"><span class="status-key">Kit</span><span class="status-val">Pack, bedroll, rations</span></div>
  ` : `
    <div class="status-row"><span class="status-key">Musket</span><span class="status-val">Charleville M1777</span></div>
    <div class="status-row"><span class="status-key">Bayonet</span><span class="status-val">17-inch socket</span></div>
    <div class="status-row"><span class="status-key">Kit</span><span class="status-val">Pack, bedroll, rations</span></div>
  `;
}

function handleMuteToggle() {
  const nowMuted = toggleMute();
  $('btn-mute').classList.toggle('muted', nowMuted);
  $('btn-intro-mute').classList.toggle('muted', nowMuted);
}
$('btn-mute').addEventListener('click', handleMuteToggle);
$('btn-intro-mute').addEventListener('click', handleMuteToggle);

$('btn-character').addEventListener('click', () => {
  renderCharacterPanel();
  $('char-overlay').style.display = 'flex';
});
$('btn-char-close').addEventListener('click', () => {
  $('char-overlay').style.display = 'none';
});
$('btn-journal').addEventListener('click', () => {
  renderJournalOverlay();
  $('journal-overlay').style.display = 'flex';
});
$('btn-journal-close').addEventListener('click', () => {
  $('journal-overlay').style.display = 'none';
});
$('btn-restart').addEventListener('click', init);
$('btn-continue-camp').addEventListener('click', handleContinueToCamp);
$('btn-march').addEventListener('click', handleMarchToBattle);

// === Intro Screen ===

interface IntroStat {
  key: string;
  label: string;
  section: 'physical' | 'mental' | 'spirit';
  default: number;
  min: number;
  max: number;
  step: number;
}

const INTRO_STATS: IntroStat[] = [
  // Physical
  { key: 'dexterity', label: 'Dexterity', section: 'physical', default: 45, min: 20, max: 70, step: 5 },
  { key: 'strength', label: 'Strength', section: 'physical', default: 40, min: 20, max: 70, step: 5 },
  { key: 'endurance', label: 'Endurance', section: 'physical', default: 40, min: 20, max: 70, step: 5 },
  { key: 'constitution', label: 'Constitution', section: 'physical', default: 45, min: 20, max: 70, step: 5 },
  // Mental
  { key: 'charisma', label: 'Charisma', section: 'mental', default: 30, min: 10, max: 60, step: 5 },
  { key: 'intelligence', label: 'Intelligence', section: 'mental', default: 30, min: 10, max: 60, step: 5 },
  { key: 'awareness', label: 'Awareness', section: 'mental', default: 35, min: 10, max: 60, step: 5 },
  // Spirit
  { key: 'valor', label: 'Valor', section: 'spirit', default: 40, min: 10, max: 80, step: 5 },
];

const INTRO_SECTIONS: { id: string; label: string }[] = [
  { id: 'physical', label: 'Physical' },
  { id: 'mental', label: 'Mental' },
  { id: 'spirit', label: 'Spirit' },
];

function renderStatCell(stat: IntroStat): string {
  const val = (state.player as any)[stat.key] as number;
  return `<div class="intro-stat-cell">
    <span class="intro-stat-label">${stat.label}</span>
    <div class="intro-stat-controls">
      <button class="intro-stat-btn" data-stat="${stat.key}" data-dir="-" ${val <= stat.min ? 'disabled' : ''}>-</button>
      <span class="intro-stat-val">${val}</span>
      <button class="intro-stat-btn" data-stat="${stat.key}" data-dir="+" ${val >= stat.max ? 'disabled' : ''}>+</button>
    </div>
  </div>`;
}

function renderIntroStats() {
  const container = $('intro-stats');
  container.innerHTML = '';

  // Physical and Mental side by side in two columns
  const physical = INTRO_STATS.filter(s => s.section === 'physical');
  const mental = INTRO_STATS.filter(s => s.section === 'mental');

  const columns = document.createElement('div');
  columns.className = 'intro-stat-columns';
  columns.innerHTML = `
    <div class="intro-stat-col">
      <div class="intro-stat-section">Physical</div>
      ${physical.map(s => renderStatCell(s)).join('')}
    </div>
    <div class="intro-stat-col">
      <div class="intro-stat-section">Mental</div>
      ${mental.map(s => renderStatCell(s)).join('')}
    </div>
  `;
  container.appendChild(columns);

  // Spirit (Valor) as a centered row below
  const spirit = INTRO_STATS.filter(s => s.section === 'spirit');
  const spiritSection = document.createElement('div');
  spiritSection.className = 'intro-stat-spirit';
  spiritSection.innerHTML = `
    <div class="intro-stat-section">Spirit</div>
    ${spirit.map(s => renderStatCell(s)).join('')}
  `;
  container.appendChild(spiritSection);

  container.querySelectorAll('.intro-stat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget as HTMLButtonElement;
      const key = el.getAttribute('data-stat')!;
      const dir = el.getAttribute('data-dir') === '+' ? 1 : -1;
      const stat = INTRO_STATS.find(s => s.key === key)!;
      const cur = (state.player as any)[stat.key] as number;
      const next = cur + dir * stat.step;
      if (next < stat.min || next > stat.max) return;
      (state.player as any)[stat.key] = next;
      renderIntroStats();
    });
  });
}

function confirmIntroName() {
  const input = $('intro-name-input') as HTMLInputElement;
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  state.player.name = name;
  gameState.player.name = name;
  $('intro-name-step').style.display = 'none';
  $('intro-stats-step').style.display = '';
  $('intro-player-name').textContent = name;
  $('intro-mascot').classList.add('compact');
  renderIntroStats();
}

// Unlock audio on first user interaction (click or keypress anywhere)
document.addEventListener('click', () => ensureStarted(), { once: true });
document.addEventListener('keydown', () => ensureStarted(), { once: true });

// Fullscreen toggle on 'f' key
document.addEventListener('keydown', (e) => {
  if (e.key === 'f' && !e.ctrlKey && !e.altKey && !e.metaKey
    && !(e.target instanceof HTMLInputElement)
    && !(e.target instanceof HTMLTextAreaElement)) {
    e.preventDefault();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
});

$('btn-intro-confirm').addEventListener('click', confirmIntroName);
$('intro-name-input').addEventListener('keydown', (e) => {
  if ((e as KeyboardEvent).key === 'Enter') confirmIntroName();
});

document.querySelectorAll('.intro-rank-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const el = e.currentTarget as HTMLButtonElement;
    const rank = el.getAttribute('data-rank')!;
    document.querySelectorAll('.intro-rank-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    gameState.player.rank = rank === 'officer' ? MilitaryRank.Lieutenant : MilitaryRank.Private;
  });
});

$('btn-intro-begin').addEventListener('click', () => {
  // Sync intro stat edits back to persistent character
  for (const stat of INTRO_STATS) {
    (gameState.player as any)[stat.key] = (state.player as any)[stat.key];
  }

  // Enter pre-battle camp (eve of Rivoli) instead of jumping straight to battle
  transitionToPreBattleCamp(gameState);
  campLogCount = 0;
  $('camp-narrative').innerHTML = '';
  render();
});

// Mascot quotes
const mascotQuotes = [
  'Courage is not the absence of fear, but the conquest of it.',
  'Victory belongs to the most persevering.',
  'Impossible is a word found only in the dictionary of fools.',
  'In war, morale is to the physical as three is to one.',
  'Never interrupt your enemy when he is making a mistake.',
  'The battlefield is a scene of constant chaos.',
  'Men are moved by two levers only: fear and self-interest.',
  'He who fears being conquered is sure of defeat.',
  'Death is nothing, but to live defeated is to die daily.',
  'The truest wisdom is a resolute determination.',
  'Ten people who speak make more noise than ten thousand who are silent.',
  'There are only two forces in the world: the sword and the spirit.',
  'A soldier will fight long and hard for a bit of coloured ribbon.',
  'The word impossible is not in my dictionary.',
  'An army marches on its stomach.',
  'There is only one step from the sublime to the ridiculous.',
  'Glory is fleeting, but obscurity is forever.',
  'I am sometimes a fox and sometimes a lion.',
  'History is a set of lies agreed upon.',
  'Ability is nothing without opportunity.',
];
const mascot = $('mascot');
const bubble = $('mascot-bubble');
mascot.addEventListener('mouseenter', () => {
  bubble.textContent = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
});

init();
initDevTools(
  () => gameState,
  (gs) => { gameState = gs; state = gs.battleState!; },
  () => render(),
  () => init(),
);
