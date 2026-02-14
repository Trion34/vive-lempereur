import { createInitialBattleState, beginBattle, advanceTurn, resolveAutoFumbleFire, resolveMeleeRout, MeleeTurnInput } from './core/battle';
import { resetEventTexts } from './core/events';
import { getChargeEncounter } from './core/charge';
import { getMeleeActions } from './core/melee';
import {
  BattleState, ActionId, MoraleThreshold, DrillStep,
  HealthState, StaminaState, LoadResult,
  BattlePhase, ChargeChoiceId,
  MeleeStance, MeleeActionId, BodyPart,
  GameState, GamePhase, CampActivityId, MilitaryRank,
  ValorRollResult, AutoVolleyResult,
} from './types';
import { createNewGame, transitionToCamp, transitionToBattle, transitionToPreBattleCamp } from './core/gameLoop';
import { advanceCampTurn, resolveCampEvent as resolveCampEventAction, getCampActivities, isCampComplete } from './core/camp';
import { getScriptedAvailableActions, resolveAutoVolley } from './core/scriptedVolleys';
import { initDevTools } from './devtools';
import { playVolleySound, playDistantVolleySound } from './audio';
import { switchTrack, toggleMute, isMuted, ensureStarted } from './music';
import { initTestScreen } from './testScreen';
import { saveGame, loadGame, hasSave, deleteSave } from './core/persistence';

const $ = (id: string) => document.getElementById(id)!;
let gameState: GameState;
let state: BattleState; // Convenience alias for battle phase
let lastRenderedTurn = -1;
let renderedEntriesForTurn = 0;
let processing = false;
let campLogCount = 0;

let arenaLogCount = 0;
let showOpeningBeat = false;
let pendingAutoPlayResume = false;

function init() {
  resetEventTexts();
  
  const saved = loadGame();
  if (saved) {
    $('btn-intro-continue').style.display = 'inline-block';
    // We don't load it yet, wait for click
  }

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
  ($('intro-name-input') as HTMLInputElement).value = 'John';
  $('intro-mascot').classList.remove('compact');
  render();
}

function handleContinueSave() {
  const saved = loadGame();
  if (!saved) return;

  gameState = saved;
  if (gameState.battleState) {
    state = gameState.battleState;
  }
  
  // Reset UI counters to match loaded state
  lastRenderedTurn = -1;
  renderedEntriesForTurn = 0;
  arenaLogCount = 0;
  campLogCount = 0;
  
  // If in battle and turn > 0, we don't show opening beat
  showOpeningBeat = false; 
  
  $('intro-container').style.display = 'none';
  render();
}
$('btn-intro-continue').addEventListener('click', handleContinueSave);

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
    renderMeters(); // Reset meters to initial state
    renderLineStatus();
    renderEnemyPanel();
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
  } else if (state.autoPlayActive) {
    // During auto-play: render meters/panels/panorama/drill but skip log/actions
    // (narrative is managed by the orchestrator)
    game.classList.add('phase-line');
    renderHeader();
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();
    renderDrillIndicator();
    renderPanorama();
    renderActions(); // shows "The line endures..." status
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
      5: 'THE WOUNDED SERGEANT',
      6: 'FIX BAYONETS',
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

  // Stamina
  const sPct = (player.stamina / player.maxStamina) * 100;
  const sBar = $('stamina-bar');
  sBar.style.width = `${sPct}%`;
  sBar.className = 'meter-fill stamina-fill';
  if (player.staminaState !== StaminaState.Fresh) sBar.classList.add(player.staminaState);
  $('stamina-num').textContent = Math.round(player.stamina).toString();
  const sState = $('stamina-state');
  sState.textContent = player.staminaState.toUpperCase();
  sState.className = 'meter-state';
  if (player.staminaState !== StaminaState.Fresh) sState.classList.add(player.staminaState);

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
    $('opp-stamina-num').textContent = `${Math.round(opp.stamina)} / ${opp.maxStamina}`;
    const sPct = (opp.stamina / opp.maxStamina) * 100;
    $('opp-stamina-bar').style.width = `${sPct}%`;
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
      requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; });
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

  // AUTO-PLAY ACTIVE: show status text, no buttons
  if (state.autoPlayActive) {
    grid.innerHTML = '<div class="auto-play-status">The line endures...</div>';
    return;
  }

  // PART 1 START: show Begin button
  if (state.battlePart === 1 && state.scriptedVolley === 1 && !state.autoPlayActive && state.phase === BattlePhase.Line && !showOpeningBeat) {
    const btn = document.createElement('button');
    btn.className = 'begin-btn';
    btn.textContent = 'Begin';
    btn.addEventListener('click', () => {
      autoPlayPart1();
    });
    grid.appendChild(btn);
    return;
  }

  // STORY BEAT PHASE: show story beat choices
  if (state.phase === BattlePhase.StoryBeat) {
    renderChargeChoices(grid);
    return;
  }

  // LINE PHASE: standard drill actions (Parts 2-3)
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
    <div class="pstatus-item"><span class="pstatus-label">Stamina</span><span class="pstatus-val">${Math.round(state.player.stamina)}</span></div>
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
    5: 'The Wounded Sergeant',
    6: 'Fix Bayonets',
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
    <div class="pstatus-item"><span class="pstatus-label">Stamina</span><span class="pstatus-val">${Math.round(player.stamina)}</span></div>
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
  const spPct = (player.stamina / player.maxStamina) * 100;
  const mrPct = (player.morale / player.maxMorale) * 100;
  ($('arena-player-hp-bar') as HTMLElement).style.width = `${hpPct}%`;
  $('arena-player-hp-val').textContent = `${Math.round(player.health)}`;
  ($('arena-player-ft-bar') as HTMLElement).style.width = `${spPct}%`;
  $('arena-player-ft-val').textContent = `${Math.round(player.stamina)}`;
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
  const oppSpPct = (opp.stamina / opp.maxStamina) * 100;
  ($('arena-opp-hp-bar') as HTMLElement).style.width = `${oppHpPct}%`;
  $('arena-opp-hp-val').textContent = `${Math.max(0, Math.round(opp.health))}`;
  ($('arena-opp-ft-bar') as HTMLElement).style.width = `${oppSpPct}%`;
  $('arena-opp-ft-val').textContent = `${Math.round(opp.stamina)}`;

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

// Spawn a floating text indicator on a target element
function spawnFloatingText(targetEl: HTMLElement, text: string, cssClass: string) {
  const floater = document.createElement('div');
  floater.className = `floating-text ${cssClass}`;
  floater.textContent = text;
  targetEl.appendChild(floater);
  floater.addEventListener('animationend', () => floater.remove());
}

// Apply a temporary CSS class to an element
function flashClass(el: HTMLElement, cls: string, duration: number) {
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), duration);
}

// Spawn a slash overlay on a combatant (covers the image area)
function spawnSlash(targetEl: HTMLElement) {
  const slash = document.createElement('div');
  slash.className = 'slash-overlay';
  targetEl.appendChild(slash);
  slash.addEventListener('animationend', () => slash.remove());
}

// Show announcement banner when a new opponent enters
function showOpponentBanner(name: string, desc: string) {
  const scene = document.getElementById('duel-display');
  if (!scene) return;
  const banner = document.createElement('div');
  banner.className = 'opponent-banner';
  banner.innerHTML = `
    <div class="opponent-banner-name">${name.toUpperCase()}</div>
    <div class="opponent-banner-desc">${desc}</div>
    <div class="opponent-banner-line">steps forward</div>
  `;
  scene.appendChild(banner);
  banner.addEventListener('animationend', () => banner.remove());
}

const ATTACK_ACTIONS = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike, MeleeActionId.Shoot];
const DEFENSE_ACTIONS = [MeleeActionId.Guard, MeleeActionId.Dodge];

function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function handleMeleeAction(action: MeleeActionId, bodyPart?: BodyPart) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  const prevPlayerHp = state.player.health;
  const prevOppIdx = state.meleeState ? state.meleeState.currentOpponent : 0;
  const prevOppHp = state.meleeState ? state.meleeState.opponents[prevOppIdx].health : 0;
  const prevOppStunned = state.meleeState ? state.meleeState.opponents[prevOppIdx].stunned : false;

  const input: MeleeTurnInput = { action, bodyPart, stance: meleeStance };
  state = advanceTurn(state, ActionId.Fire /* dummy, ignored */, input);
  gameState.battleState = state;
  
  saveGame(gameState);

  // Reset local melee UI state
  meleeSelectedAction = null;
  meleeActionCategory = 'top';

  const ms = state.meleeState;
  const prevOpp = ms ? ms.opponents[prevOppIdx] : null;
  const oppDmg = prevOpp ? prevOppHp - prevOpp.health : 0;
  const playerDmg = prevPlayerHp - state.player.health;
  const oppDefeated = prevOpp ? prevOpp.health <= 0 : false;
  const oppTransitioned = ms ? ms.currentOpponent !== prevOppIdx : false;

  // === OPPONENT TRANSITION SEQUENCE ===
  if (oppDefeated && oppTransitioned && ms) {
    // DON'T render yet — play defeat sequence on current DOM first
    const oppEl = document.getElementById('duel-opponent');

    // 1. Hit effects on old opponent (still visible)
    if (oppDmg > 0 && oppEl) {
      flashClass(oppEl, 'duel-hit', 400);
      spawnSlash(oppEl);
      spawnFloatingText(oppEl, `-${oppDmg}`, 'float-damage');
    }

    // 2. DEFEATED text + departure animation
    if (oppEl) {
      await wait(300);
      spawnFloatingText(oppEl, 'DEFEATED', 'float-defeated');
      oppEl.classList.add('enemy-departing');
    }

    // 3. Pause for dramatic effect
    await wait(1200);

    // 4. Clean up departing state and render with new opponent data
    if (oppEl) {
      oppEl.classList.remove('enemy-departing');
      oppEl.style.opacity = '0';
    }
    render();

    // 5. Entrance animation on new opponent
    const newOppEl = document.getElementById('duel-opponent');
    if (newOppEl) {
      newOppEl.style.opacity = '';
      newOppEl.classList.remove('duel-wounded', 'duel-critical', 'duel-defeated');
      newOppEl.classList.add('enemy-entering');
      setTimeout(() => newOppEl.classList.remove('enemy-entering'), 1000);
    }

    // 6. Announcement banner
    const newOpp = ms.opponents[ms.currentOpponent];
    showOpponentBanner(newOpp.name, newOpp.description);

    processing = false;
    return;
  }

  // === NORMAL FLOW (no transition) ===
  render();

  if (ms && prevOpp) {
    const oppEl = document.getElementById('duel-opponent');
    const playerEl = document.getElementById('duel-player');
    const portraitFrame = document.querySelector('.portrait-frame') as HTMLElement | null;
    const hudPortrait = document.querySelector('.hud-portrait') as HTMLElement | null;

    // --- Enemy took damage (player hit) ---
    if (oppDmg > 0 && oppEl) {
      flashClass(oppEl, 'duel-hit', 400);
      spawnSlash(oppEl);
      spawnFloatingText(oppEl, `-${oppDmg}`, 'float-damage');
      if (prevOpp.stunned && !prevOppStunned) {
        setTimeout(() => spawnFloatingText(oppEl, 'STUNNED', 'float-status'), 300);
      }
    }

    // --- Player missed ---
    if (ATTACK_ACTIONS.includes(action) && oppDmg <= 0 && !oppDefeated && oppEl) {
      spawnFloatingText(oppEl, 'MISS', 'float-miss');
      flashClass(oppEl, 'duel-evade', 400);
    }

    // --- Player took damage (enemy hit) ---
    if (playerDmg > 0) {
      if (playerEl) {
        flashClass(playerEl, 'duel-hit', 400);
        spawnSlash(playerEl);
      }
      if (portraitFrame) {
        flashClass(portraitFrame, 'portrait-hit', 500);
      }
      if (hudPortrait) {
        spawnFloatingText(hudPortrait, `-${playerDmg}`, 'float-damage');
      }
    }

    // --- Player dodged/blocked (used defense, took no damage) ---
    if (DEFENSE_ACTIONS.includes(action) && playerDmg <= 0) {
      const label = action === MeleeActionId.Dodge ? 'DODGED' : 'BLOCKED';
      const cls = action === MeleeActionId.Dodge ? 'float-dodge' : 'float-block';
      if (hudPortrait) {
        spawnFloatingText(hudPortrait, label, cls);
      }
      if (playerEl) {
        if (action === MeleeActionId.Dodge) flashClass(playerEl, 'duel-evade', 400);
        if (action === MeleeActionId.Guard) flashClass(playerEl, 'duel-block', 400);
      }
    }

    // --- Opponent defeated (final opponent or battle end) ---
    if (oppDefeated && oppEl) {
      setTimeout(() => spawnFloatingText(oppEl, 'DEFEATED', 'float-defeated'), 400);
    }
  }

  if (state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  processing = false;
}

// Pending story beat result — shown in parchment before transitioning
let pendingChargeResult: { narrative: string; statSummary: string } | null = null;

async function handleChargeAction(choiceId: ChargeChoiceId) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  const prevLogLen = state.log.length;
  const wasWoundedSergeant = state.chargeEncounter === 5;

  state = advanceTurn(state, choiceId);
  gameState.battleState = state;

  // If this was the wounded sergeant choice, flag for auto-play resume
  if (wasWoundedSergeant) {
    pendingAutoPlayResume = true;
  }

  saveGame(gameState);

  // Extract the result log entries added by this choice
  const newEntries = state.log.slice(prevLogLen);
  const resultNarrative = newEntries
    .filter(e => e.type === 'action' || e.type === 'narrative' || e.type === 'event' || e.type === 'result')
    .map(e => e.text)
    .join('\n\n');

  // Build stat change summary from morale entries
  const moraleSummary = newEntries
    .filter(e => e.type === 'morale')
    .map(e => e.text)
    .join(', ');

  if (resultNarrative.trim()) {
    // Show the result in the parchment overlay
    pendingChargeResult = { narrative: resultNarrative, statSummary: moraleSummary };
    renderChargeResult();
  } else {
    // No result text — just transition
    render();
  }

  if (state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  processing = false;
}

function renderChargeResult() {
  if (!pendingChargeResult) return;

  const narrativeEl = $('parchment-narrative');
  narrativeEl.innerHTML = pendingChargeResult.narrative
    .split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');

  // Update status bar with current stats
  $('parchment-status').innerHTML = `
    <div class="pstatus-item"><span class="pstatus-label">Morale</span><span class="pstatus-val">${Math.round(state.player.morale)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Health</span><span class="pstatus-val">${Math.round(state.player.health)}</span></div>
    <div class="pstatus-item"><span class="pstatus-label">Stamina</span><span class="pstatus-val">${Math.round(state.player.stamina)}</span></div>
    ${pendingChargeResult.statSummary ? `<div class="pstatus-item"><span class="pstatus-label">Effect</span><span class="pstatus-val">${pendingChargeResult.statSummary}</span></div>` : ''}
  `;

  // Replace choices with Continue button
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
    pendingChargeResult = null;
    if (pendingAutoPlayResume) {
      pendingAutoPlayResume = false;
      processing = true;
      // Resume auto-play: restore Line phase and continue volleys 3-4
      state.phase = BattlePhase.Line;
      state.autoPlayActive = true;
      gameState.battleState = state;
      switchTrack('battle');
      render();
      autoPlayVolleys(2, 3); // volleys 3-4 (indices 2,3)
    } else {
      render();
    }
  });
  choicesEl.appendChild(btn);
}

// ============================================================
// AUTO-PLAY ORCHESTRATOR (Part 1)
// ============================================================

async function autoPlayPart1() {
  if (processing) return;
  processing = true;

  state.autoPlayActive = true;
  gameState.battleState = state;
  render();

  // Switch to battle music
  switchTrack('battle');

  // Play volleys 1-2
  await autoPlayVolleys(0, 1);

  if (state.player.health <= 0) {
    finishAutoPlay();
    return;
  }

  // After Volley 2: Wounded Sergeant story beat
  state.autoPlayActive = false;
  state.phase = BattlePhase.StoryBeat;
  state.chargeEncounter = 5;
  gameState.battleState = state;

  // Show the story beat
  const storyBeat = getChargeEncounter(state);
  state.log.push({ turn: state.turn, text: storyBeat.narrative, type: 'narrative' });

  // Switch to dreams music for story beat
  switchTrack('dreams');
  render();

  processing = false;
  // Player makes choice → handleChargeAction → Continue → autoPlayVolleys(2,3)
  // (handled in renderChargeResult Continue button)
}

async function autoPlayVolleys(startIdx: number, endIdx: number) {
  const scroll = $('narrative-scroll');

  for (let i = startIdx; i <= endIdx; i++) {
    const volleyNum = i + 1; // 1-based volley number
    state.scriptedVolley = volleyNum;
    state.turn += 1;
    state.pendingMoraleChanges = [];
    state.line.casualtiesThisTurn = 0;
    state.lastLoadResult = undefined;

    // --- 1. Update drill indicator to PRESENT ---
    state.drillStep = DrillStep.Present;
    renderDrillIndicator();
    renderPanorama();
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();

    // Cross-fade to volley narrative
    const presentText = `— Volley ${volleyNum} — ${state.enemy.range} paces —`;
    crossFadeNarrative(scroll, [{ type: 'order', text: presentText }]);
    await wait(1500);

    // --- 2. Update to FIRE ---
    state.drillStep = DrillStep.Fire;
    renderDrillIndicator();

    // Show captain's order briefly
    const fireOrders = [
      '"Feu!" The captain\'s sword drops.',
      '"FIRE!" The word tears down the line.',
      '"FIRE!" At fifty paces, the captain\'s voice is raw.',
      '"Tirez! Dernière salve!" Point blank.',
    ];
    appendNarrativeEntry(scroll, { type: 'order', text: fireOrders[i] || '"FIRE!"' });
    await wait(800);

    // --- 3. Play French volley animation ---
    playVolleySound();
    await playVolleyAnimation('french');
    await wait(400);

    // --- 4. Resolve the volley (all 4 drill steps in one call) ---
    const result = resolveAutoVolley(state, i);
    gameState.battleState = state;

    // Update UI with results
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();
    renderPanorama();

    // Show fire result narrative
    const fireNarratives = result.narratives.filter(n => n.type === 'result' || n.type === 'action');
    for (const n of fireNarratives.slice(0, 2)) {
      appendNarrativeEntry(scroll, n);
    }
    await wait(1500);

    // --- 5. Show VALOR ROLL display ---
    showValorRollDisplay(result.valorRoll);
    await wait(2000);

    // --- 6. Update to ENDURE, play Austrian volley ---
    state.drillStep = DrillStep.Endure;
    renderDrillIndicator();

    playDistantVolleySound();
    await playVolleyAnimation('austrian');

    // Show return fire / event narratives
    const endureNarratives = result.narratives.filter(n => n.type === 'event' || n.type === 'narrative');
    for (const n of endureNarratives.slice(0, 3)) {
      appendNarrativeEntry(scroll, n);
    }
    await wait(2000);

    // --- 7. Show line integrity result ---
    const integrityText = result.lineIntegrityChange < 0
      ? `Line integrity: ${Math.round(state.line.lineIntegrity)}% (${result.lineIntegrityChange})`
      : `Line holds firm. Integrity: ${Math.round(state.line.lineIntegrity)}%`;
    appendNarrativeEntry(scroll, { type: 'event', text: integrityText });
    await wait(1000);

    // --- 8. Show load animation ---
    state.drillStep = DrillStep.Load;
    renderDrillIndicator();
    if (state.lastLoadResult) {
      await showLoadAnimation(state.lastLoadResult);
    }
    await wait(500);

    // --- 9. Save state ---
    state.autoPlayVolleyCompleted = i + 1;
    saveGame(gameState);

    // Check for death
    if (result.playerDied) {
      state.battleOver = true;
      state.outcome = 'defeat';
      finishAutoPlay();
      return;
    }

    // Advance scriptedVolley for next iteration
    state.drillStep = DrillStep.Present;
  }

  // After all volleys in this batch complete
  if (endIdx === 3) {
    // All 4 volleys done → transition to melee
    transitionToMelee();
  }
}

function transitionToMelee() {
  state.autoPlayActive = false;
  state.autoPlayVolleyCompleted = 4;

  // Show as a story beat parchment — player clicks "Fix bayonets" to enter melee
  state.phase = BattlePhase.StoryBeat;
  state.chargeEncounter = 6;
  const storyBeat = getChargeEncounter(state);
  state.log.push({ turn: state.turn, text: storyBeat.narrative, type: 'narrative' });

  gameState.battleState = state;
  saveGame(gameState);

  switchTrack('dreams');
  lastRenderedTurn = -1;
  render();
  processing = false;
}

function finishAutoPlay() {
  state.autoPlayActive = false;
  gameState.battleState = state;
  lastRenderedTurn = -1;
  render();
  processing = false;
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
    Health: ${Math.round(state.player.health)}% | Stamina: ${Math.round(state.player.stamina)}%<br>
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

  saveGame(gameState);

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

function renderCampSceneArt() {
  const el = $('camp-scene-art');
  if (el.children.length > 0) return; // already rendered
  el.innerHTML = `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="csSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#050a18"/>
          <stop offset="40%" stop-color="#0a1228"/>
          <stop offset="100%" stop-color="#101830"/>
        </linearGradient>
        <radialGradient id="csMoonGlow" cx="700" cy="50" r="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#aabbcc" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="csFireGlow" cx="400" cy="340" r="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#b8661a" stop-opacity="0.3"/>
          <stop offset="35%" stop-color="#8b4513" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="csGroundGlow" cx="400" cy="380" r="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2a1508" stop-opacity="1"/>
          <stop offset="50%" stop-color="#12100a" stop-opacity="1"/>
          <stop offset="100%" stop-color="#080c14" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="csMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1a2540" stop-opacity="0"/>
          <stop offset="60%" stop-color="#1a2540" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0e1520" stop-opacity="0.5"/>
        </linearGradient>
        <radialGradient id="csDistFire">
          <stop offset="0%" stop-color="#ffaa33" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#cc6600" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#cc6600" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="csSmoke">
          <stop offset="0%" stop-color="#555" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#333" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#csSky)"/>
      <circle cx="45" cy="22" r="1.0" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="95" cy="45" r="0.6" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="130" cy="15" r="1.3" fill="#d0c8b8" opacity="0.8"/>
      <circle cx="175" cy="58" r="0.8" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="210" cy="28" r="0.7" fill="#d0c8b8" opacity="0.6"/>
      <circle cx="260" cy="12" r="1.1" fill="#d0c8b8" opacity="0.9"/>
      <circle cx="290" cy="48" r="0.6" fill="#d0c8b8" opacity="0.3"/>
      <circle cx="330" cy="32" r="0.9" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="370" cy="8" r="1.2" fill="#d0c8b8" opacity="0.6"/>
      <circle cx="410" cy="52" r="0.7" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="460" cy="20" r="1.0" fill="#d0c8b8" opacity="0.8"/>
      <circle cx="510" cy="40" r="0.8" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="550" cy="18" r="1.1" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="590" cy="55" r="0.6" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="630" cy="30" r="0.9" fill="#d0c8b8" opacity="0.6"/>
      <circle cx="700" cy="38" r="0.7" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="750" cy="15" r="1.0" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="160" cy="80" r="0.5" fill="#d0c8b8" opacity="0.3"/>
      <circle cx="420" cy="72" r="0.8" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="540" cy="68" r="0.6" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="75" cy="65" r="0.7" fill="#d0c8b8" opacity="0.35"/>
      <circle cx="780" cy="48" r="0.5" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="700" cy="50" r="12" fill="#c8c0a0" opacity="0.9"/>
      <circle cx="706" cy="46" r="10" fill="#050a18"/>
      <circle cx="700" cy="50" r="80" fill="url(#csMoonGlow)"/>
      <path d="M0,200 L40,170 L80,185 L140,140 L180,158 L230,115 L280,145 L320,125 L370,150 L420,105 L470,135 L510,118 L550,145 L600,100 L650,130 L690,115 L730,140 L770,128 L800,150 L800,400 L0,400 Z" fill="#0e1525" opacity="0.7"/>
      <path d="M0,240 L30,215 L70,228 L120,180 L160,205 L200,168 L260,195 L300,158 L350,185 L400,148 L440,172 L490,152 L530,180 L580,142 L630,168 L670,148 L720,175 L760,160 L800,185 L800,400 L0,400 Z" fill="#0c1220" opacity="0.85"/>
      <path d="M228,115 L220,128 L238,128 Z" fill="#2a3050" opacity="0.5"/>
      <path d="M418,105 L410,118 L428,118 Z" fill="#2a3050" opacity="0.5"/>
      <path d="M578,142 L570,155 L588,155 Z" fill="#2a3050" opacity="0.5"/>
      <path d="M298,158 L290,170 L308,170 Z" fill="#2a3050" opacity="0.4"/>
      <path d="M0,285 L50,260 L100,272 L150,245 L200,265 L260,238 L310,258 L360,232 L410,252 L450,238 L500,258 L550,235 L600,252 L650,230 L700,250 L750,242 L800,258 L800,400 L0,400 Z" fill="#0a0e18"/>
      <rect x="0" y="260" width="800" height="80" fill="url(#csMist)"/>
      <circle cx="120" cy="268" r="4" fill="url(#csDistFire)"/><circle cx="120" cy="268" r="1.2" fill="#ffcc44" opacity="0.8"/>
      <circle cx="140" cy="262" r="3" fill="url(#csDistFire)"/><circle cx="140" cy="262" r="0.8" fill="#ffcc44" opacity="0.7"/>
      <circle cx="108" cy="272" r="2.5" fill="url(#csDistFire)"/><circle cx="108" cy="272" r="0.7" fill="#ffaa33" opacity="0.6"/>
      <circle cx="280" cy="252" r="3.5" fill="url(#csDistFire)"/><circle cx="280" cy="252" r="1.0" fill="#ffcc44" opacity="0.8"/>
      <circle cx="300" cy="255" r="3" fill="url(#csDistFire)"/><circle cx="300" cy="255" r="0.8" fill="#ffaa33" opacity="0.7"/>
      <circle cx="520" cy="252" r="3.5" fill="url(#csDistFire)"/><circle cx="520" cy="252" r="1.0" fill="#ffcc44" opacity="0.8"/>
      <circle cx="600" cy="248" r="3.5" fill="url(#csDistFire)"/><circle cx="600" cy="248" r="1.0" fill="#ffcc44" opacity="0.8"/>
      <circle cx="620" cy="244" r="2.5" fill="url(#csDistFire)"/><circle cx="620" cy="244" r="0.7" fill="#ffaa33" opacity="0.6"/>
      <circle cx="720" cy="246" r="3" fill="url(#csDistFire)"/><circle cx="720" cy="246" r="0.9" fill="#ffcc44" opacity="0.7"/>
      <circle cx="200" cy="262" r="2" fill="url(#csDistFire)"/><circle cx="200" cy="262" r="0.6" fill="#ffaa33" opacity="0.5"/>
      <circle cx="430" cy="248" r="2.5" fill="url(#csDistFire)"/><circle cx="430" cy="248" r="0.7" fill="#ffcc44" opacity="0.6"/>
      <circle cx="680" cy="242" r="2" fill="url(#csDistFire)"/><circle cx="680" cy="242" r="0.6" fill="#ffaa33" opacity="0.5"/>
      <circle cx="350" cy="245" r="2" fill="url(#csDistFire)"/><circle cx="350" cy="245" r="0.6" fill="#ffaa33" opacity="0.45"/>
      <circle cx="430" cy="248" r="5" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.3">
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="120" cy="268" r="4" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.25">
        <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <path d="M0,310 Q100,295 200,308 Q300,318 400,300 Q500,288 600,302 Q700,315 800,298 L800,400 L0,400 Z" fill="url(#csGroundGlow)"/>
      <rect x="100" y="200" width="600" height="200" fill="url(#csFireGlow)"/>
      <ellipse cx="395" cy="220" rx="25" ry="40" fill="url(#csSmoke)"/>
      <ellipse cx="408" cy="175" rx="18" ry="32" fill="url(#csSmoke)"/>
      <ellipse cx="388" cy="140" rx="14" ry="28" fill="url(#csSmoke)"/>
      <line x1="380" y1="355" x2="420" y2="348" stroke="#2a1a0a" stroke-width="5" stroke-linecap="round"/>
      <line x1="385" y1="348" x2="415" y2="355" stroke="#2a1a0a" stroke-width="4" stroke-linecap="round"/>
      <line x1="390" y1="352" x2="410" y2="352" stroke="#1a1005" stroke-width="4" stroke-linecap="round"/>
      <path d="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z" fill="#dd6611" opacity="0.9">
        <animate attributeName="d" values="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z;M400,290 Q390,315 383,340 Q392,328 400,316 Q408,328 417,340 Q410,315 400,290Z;M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <path d="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z" fill="#ee9922" opacity="0.85">
        <animate attributeName="d" values="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z;M400,301 Q394,320 388,338 Q395,326 400,315 Q405,326 412,338 Q406,320 400,301Z;M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z" dur="0.6s" repeatCount="indefinite"/>
      </path>
      <path d="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z" fill="#ffcc44" opacity="0.8">
        <animate attributeName="d" values="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z;M400,309 Q396,324 393,336 Q397,326 400,317 Q403,326 407,336 Q404,324 400,309Z;M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z" dur="0.5s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="400" cy="350" rx="25" ry="6" fill="#cc5500" opacity="0.4">
        <animate attributeName="rx" values="25;28;25" dur="0.7s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.5;0.4" dur="0.7s" repeatCount="indefinite"/>
      </ellipse>
      <circle cx="395" cy="285" r="1.5" fill="#ffaa22" opacity="0.8">
        <animate attributeName="cy" values="295;255;215" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="395;390;388" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="405" cy="280" r="1.0" fill="#ff8811" opacity="0.7">
        <animate attributeName="cy" values="290;245;200" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="405;410;415" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="400" cy="287" r="1.2" fill="#ffcc44" opacity="0.6">
        <animate attributeName="cy" values="293;240;185" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="400;397;393" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="398" cy="283" r="0.8" fill="#ff9933" opacity="0.7">
        <animate attributeName="cy" values="291;250;210" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="398;403;408" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <g fill="#0e0e10">
        <path d="M290,362 Q298,354 310,360 Q315,364 320,367 L285,367 Z"/>
        <path d="M292,360 Q290,342 294,327 Q296,318 300,312 L314,312 Q310,318 308,327 Q306,342 308,360 Z"/>
        <path d="M290,357 Q285,362 282,370 L295,367 Z" fill="#0c0c0e"/>
        <path d="M310,357 Q315,362 318,370 L305,367 Z" fill="#0c0c0e"/>
        <line x1="296" y1="317" x2="312" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="312" y1="317" x2="296" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="300" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="302" y="307" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="307" cy="301" rx="8" ry="9"/>
        <path d="M293,298 Q300,290 307,287 Q314,290 321,298 Q314,295 307,294 Q300,295 293,298 Z" fill="#0c0c0e"/>
        <path d="M290,300 Q292,292 298,288 L295,297 Z" fill="#0a0a0c"/>
        <path d="M324,300 Q322,292 316,288 L319,297 Z" fill="#0a0a0c"/>
        <circle cx="307" cy="292" r="2.5" fill="#141418"/>
        <path d="M312,320 Q325,324 340,330 L342,334 Q326,330 312,326 Z"/>
        <path d="M296,320 Q308,326 325,332 L324,336 Q306,330 295,324 Z"/>
        <line x1="280" y1="367" x2="286" y2="270" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="286" y1="274" x2="287" y2="264" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="287" y1="264" x2="288" y2="256" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
      </g>
      <g fill="#0e0e10">
        <path d="M340,364 Q348,356 358,362 Q363,366 365,370 L335,370 Z"/>
        <path d="M342,362 Q340,340 343,327 Q345,318 349,312 L363,312 Q359,318 357,327 Q354,340 356,362 Z"/>
        <path d="M340,360 Q336,365 333,372 L344,368 Z" fill="#0c0c0e"/>
        <line x1="346" y1="317" x2="360" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="360" y1="317" x2="346" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="349" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="352" y="307" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="357" cy="301" rx="8" ry="9"/>
        <path d="M343,298 Q350,290 357,287 Q364,290 371,298 Q364,295 357,294 Q350,295 343,298 Z" fill="#0c0c0e"/>
        <path d="M340,300 Q342,292 348,288 L345,297 Z" fill="#0a0a0c"/>
        <path d="M374,300 Q372,292 366,288 L369,297 Z" fill="#0a0a0c"/>
        <circle cx="357" cy="292" r="2.5" fill="#141418"/>
        <path d="M345,327 Q342,340 340,350 L344,352 Q345,342 347,330 Z"/>
        <path d="M360,327 Q363,340 365,350 L361,352 Q360,342 358,330 Z"/>
      </g>
      <g fill="#0e0e10">
        <path d="M460,364 Q452,356 442,362 Q437,366 435,370 L465,370 Z"/>
        <path d="M458,362 Q460,340 457,325 Q454,316 450,310 L436,312 Q440,318 443,327 Q446,340 444,362 Z"/>
        <path d="M460,360 Q464,365 467,372 L456,368 Z" fill="#0c0c0e"/>
        <line x1="453" y1="317" x2="439" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="439" y1="317" x2="453" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="442" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="443" y="305" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="443" cy="299" rx="8" ry="9"/>
        <path d="M457,296 Q450,288 443,285 Q436,288 429,296 Q436,293 443,292 Q450,293 457,296 Z" fill="#0c0c0e"/>
        <path d="M460,298 Q458,290 452,286 L455,295 Z" fill="#0a0a0c"/>
        <path d="M426,298 Q428,290 434,286 L431,295 Z" fill="#0a0a0c"/>
        <circle cx="443" cy="290" r="2.5" fill="#141418"/>
        <path d="M438,320 Q430,327 425,332 Q422,330 428,322 Q434,316 438,317 Z"/>
        <path d="M450,322 Q455,334 458,347 L454,348 Q452,336 448,325 Z"/>
        <ellipse cx="470" cy="364" rx="6" ry="4" fill="#111114"/>
        <line x1="466" y1="362" x2="474" y2="362" stroke="#1a1a1e" stroke-width="1"/>
      </g>
      <g fill="#0e0e10">
        <path d="M505,364 Q497,356 487,362 Q482,366 480,370 L510,370 Z"/>
        <path d="M503,362 Q505,340 502,327 Q500,318 496,312 L482,312 Q486,318 488,327 Q490,340 488,362 Z"/>
        <path d="M505,360 Q509,365 512,372 L501,368 Z" fill="#0c0c0e"/>
        <path d="M487,360 Q483,365 480,372 L491,368 Z" fill="#0c0c0e"/>
        <line x1="499" y1="317" x2="485" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="485" y1="317" x2="499" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="488" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="489" y="307" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="489" cy="301" rx="8" ry="9"/>
        <path d="M503,298 Q496,290 489,287 Q482,290 475,298 Q482,295 489,294 Q496,295 503,298 Z" fill="#0c0c0e"/>
        <path d="M506,300 Q504,292 498,288 L501,297 Z" fill="#0a0a0c"/>
        <path d="M472,300 Q474,292 480,288 L477,297 Z" fill="#0a0a0c"/>
        <circle cx="489" cy="292" r="2.5" fill="#141418"/>
        <path d="M485,320 Q480,327 478,337 L482,338 Q483,328 487,322 Z"/>
        <path d="M498,322 Q502,334 504,347 L500,348 Q499,336 496,325 Z"/>
        <line x1="476" y1="367" x2="473" y2="270" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="473" y1="274" x2="472" y2="264" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="472" y1="264" x2="471" y2="256" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
      </g>
      <g stroke="#111114" stroke-width="2.2" stroke-linecap="round" fill="none">
        <line x1="375" y1="370" x2="380" y2="272"/>
        <line x1="383" y1="370" x2="380" y2="272"/>
        <line x1="420" y1="370" x2="418" y2="272"/>
        <line x1="426" y1="370" x2="420" y2="272"/>
      </g>
      <line x1="380" y1="272" x2="381" y2="262" stroke="#22222a" stroke-width="1"/>
      <line x1="418" y1="272" x2="419" y2="262" stroke="#22222a" stroke-width="1"/>
      <circle cx="381" cy="263" r="0.8" fill="#cc8833" opacity="0.3"/>
      <circle cx="419" cy="263" r="0.8" fill="#cc8833" opacity="0.3"/>
      <path d="M0,385 Q100,375 200,382 Q300,388 400,378 Q500,372 600,380 Q700,388 800,376 L800,400 L0,400 Z" fill="#060a10" opacity="0.8"/>
    </svg>
  `;
}

function renderCamp() {
  const camp = gameState.campState!;
  const player = gameState.player;
  const npcs = gameState.npcs;

  // Render the scene art backdrop
  renderCampSceneArt();

  // Center — primary stat meters only (full stats in Character menu)
  // PlayerCharacter doesn't have health/stamina/morale meters — use camp state values
  const healthPct = Math.round(camp.health);
  const staminaPct = Math.round(camp.stamina); // camp.stamina: 0=rested, 100=exhausted
  const moralePct = Math.round(camp.morale); // camp.morale: 0=despairing, 100=high spirits
  const statBars = [
    { label: 'Health', value: healthPct, color: 'var(--health-high)' },
    { label: 'Stamina', value: staminaPct, color: 'var(--stamina-high)' },
    { label: 'Morale', value: moralePct, color: 'var(--morale-high)' },
  ];
  $('camp-player-stats').innerHTML = statBars.map(s => `
    <div class="ink-bar-row">
      <div class="ink-bar-track">
        <div class="ink-bar-fill" style="width:${s.value}%; background:${s.color};"></div>
        <div class="ink-bar-overlay">
          <span class="ink-bar-label">${s.label}</span>
          <span class="ink-bar-value">${s.value}%</span>
        </div>
      </div>
    </div>
  `).join('') + `
    <div class="status-row"><span class="status-key">Rank</span><span class="status-val">${player.rank}</span></div>
  `;

  // Center — Opinion summary (Soldiers, Officers, Napoleon)
  const soldiers = npcs.filter(n => n.role === 'neighbour' || n.role === 'nco');
  const officers = npcs.filter(n => n.role === 'officer');
  const avgRel = (list: typeof npcs) => {
    const alive = list.filter(n => n.alive);
    if (alive.length === 0) return 0;
    return alive.reduce((sum, n) => sum + n.relationship, 0) / alive.length;
  };
  const relToLabel = (rel: number) => rel > 20 ? 'Friendly' : rel < -20 ? 'Hostile' : 'Neutral';

  const npcListEl = $('camp-npc-list');
  npcListEl.innerHTML = `
    <div class="status-row"><span class="status-key">Soldiers</span><span class="status-val">${relToLabel(avgRel(soldiers))}</span></div>
    <div class="status-row"><span class="status-key">Officers</span><span class="status-val">${relToLabel(avgRel(officers))}</span></div>
    <div class="status-row"><span class="status-key">Napoleon</span><span class="status-val">Unknown</span></div>
  `;

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
      ${act.staminaCost > 0 ? `<span class="camp-activity-cost">Stamina: -${act.staminaCost}</span>` : ''}
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
  saveGame(gameState);
  render();

  processing = false;
}

function handleCampEventChoice(choiceId: string) {
  if (processing) return;
  processing = true;

  const result = resolveCampEventAction(gameState, choiceId);
  saveGame(gameState);

  // Show the result in the event overlay instead of closing it
  const content = $('camp-event-content');
  const resultNarrative = result.log
    .filter(e => e.type === 'event' || e.type === 'result' || e.type === 'narrative')
    .map(e => e.text)
    .join('\n\n');

  // Build stat change summary
  const changes: string[] = [];
  for (const [stat, delta] of Object.entries(result.statChanges)) {
    if (delta && delta !== 0) {
      const sign = delta > 0 ? '+' : '';
      changes.push(`${stat}: ${sign}${delta}`);
    }
  }
  if (result.moraleChange !== 0) {
    const sign = result.moraleChange > 0 ? '+' : '';
    changes.push(`morale: ${sign}${result.moraleChange}`);
  }

  content.innerHTML = `
    <div class="camp-event-result">
      <p class="camp-event-narrative">${resultNarrative.replace(/\n/g, '<br>')}</p>
      ${changes.length > 0 ? `<div class="camp-event-changes">${changes.join(' &nbsp; ')}</div>` : ''}
      <button class="parchment-choice camp-event-continue" id="btn-event-continue">
        <div class="parchment-choice-text">
          <span class="parchment-choice-label">Continue</span>
        </div>
      </button>
    </div>
  `;

  $('btn-event-continue').addEventListener('click', () => {
    $('camp-event-overlay').style.display = 'none';
    render();
  });

  processing = false;
}

function handleContinueToCamp() {
  transitionToCamp(gameState);
  saveGame(gameState);
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

  saveGame(gameState);
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
    <div class="status-row"><span class="status-key">Stamina</span><span class="status-val">${Math.round(state.player.stamina)} / ${state.player.maxStamina}</span></div>
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
  $('intro-bubble').textContent = `Hi ${name}... Press F for Fullscreen`;
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
  saveGame(gameState);
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
initTestScreen();
initDevTools(
  () => gameState,
  (gs) => { gameState = gs; state = gs.battleState!; },
  () => render(),
  () => init(),
);
