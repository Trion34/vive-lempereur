import { createInitialBattleState, beginBattle, advanceTurn, resolveAutoFumbleFire, resolveMeleeRout, MeleeTurnInput } from './core/battle';
import { resetEventTexts } from './core/events';
import { getChargeEncounter } from './core/charge';
import { getMeleeActions } from './core/melee';
import {
  BattleState, ActionId, MoraleThreshold, DrillStep,
  HealthState, FatigueState, LoadResult,
  BattlePhase, ChargeChoiceId,
  MeleeStance, MeleeActionId, BodyPart,
  GameState, GamePhase, CampActivityId,
} from './types';
import { createNewGame, transitionToCamp, transitionToBattle } from './core/gameLoop';
import { advanceCampTurn, resolveCampEvent as resolveCampEventAction, getCampActivities, isCampComplete } from './core/camp';
import { getScriptedAvailableActions } from './core/scriptedVolleys';
import { initDevTools } from './devtools';

const $ = (id: string) => document.getElementById(id)!;
let gameState: GameState;
let state: BattleState; // Convenience alias for battle phase
let renderedLogCount = 0;
let processing = false;
let campLogCount = 0;

let arenaLogCount = 0;

function init() {
  resetEventTexts();
  gameState = createNewGame();

  // Add the opening narrative to battle state
  state = gameState.battleState!;
  const openingText = `Dawn on the plateau above the Adige. January cold bites through your patched coat, through the threadbare shirt beneath. Your shoes are falling apart. You haven't been paid in months. None of that matters now.

The drums roll. You stand in the second file, musket loaded, bayonet not yet fixed. Below, fog fills the valley like grey water in a bowl — but up here the sky is clear, pale, and pitiless.

The Austrian columns have been coming through the mountain gorges since first light. White coats. Thousands of them. They halted at a hundred and twenty paces, dressing their ranks with parade-ground precision. White coats, white crossbelts, bayonets like a steel hedge. Twenty-eight thousand men against your ten.

To your left, Pierre — a veteran of Arcole, two months ago, where the army crossed that damned bridge — checks his flint with steady hands. To your right, Jean-Baptiste — a conscript from Lyon, three weeks in uniform — grips his musket like it's the only thing keeping him upright. It might be.

General Bonaparte rode in during the night. Word passed down the line like fire: he is here. The men cheered then. They are not cheering now.

The captain draws his sword. "Present arms! First volley on my command!"

The wait is over. The worst part is about to begin.`;

  state.log.push({ turn: 0, text: openingText, type: 'narrative' });
  state.availableActions = getScriptedAvailableActions(state);

  renderedLogCount = 0;
  arenaLogCount = 0;
  campLogCount = 0;
  processing = false;
  $('battle-over').style.display = 'none';
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
  // Reset intro UI
  $('intro-name-step').style.display = '';
  $('intro-stats-step').style.display = 'none';
  ($('intro-name-input') as HTMLInputElement).value = '';
  render();
}

function render() {
  const game = $('game');
  game.classList.remove('phase-line', 'phase-charge', 'phase-melee', 'phase-intro', 'phase-camp');

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
  } else if (state.phase === BattlePhase.Charge) {
    game.classList.add('phase-charge');
    renderHeader();
    renderStorybookPage();
  } else if (state.phase === BattlePhase.Melee) {
    game.classList.add('phase-melee');
    // On first melee render, clear old log entries from Line/Charge phases
    if (arenaLogCount === 0 || !$('arena-narrative').hasChildNodes()) {
      $('arena-narrative').innerHTML = '';
      // Only show log entries from the melee transition onward
      const meleeStart = state.log.findIndex(e => e.text.includes('--- MELEE ---'));
      if (meleeStart >= 0) arenaLogCount = meleeStart;
    }
    renderHeader();
    renderArena();
  } else {
    game.classList.add('phase-line');
    renderHeader();
    renderMeters();
    renderLineStatus();
    renderEnemyPanel();
    renderDrillIndicator();
    renderLog();
    renderMoraleChanges();
    renderActions();
  }

  if (state.battleOver) renderBattleOver();
}

function renderHeader() {
  const names: Record<string, string> = {
    line: 'PHASE 1: THE LINE',
    charge: 'PHASE 2: THE CHARGE',
    melee: 'PHASE 3: MELEE',
    crisis: 'PHASE 2: THE CRISIS',
    individual: 'PHASE 3: THE INDIVIDUAL',
  };
  const phaseLabel = names[state.phase] || state.phase;
  const volleyInfo = state.scriptedVolley >= 1 ? ` — Volley ${state.scriptedVolley} of 4` : '';
  const chargeInfo = state.phase === BattlePhase.Charge ? ` — Encounter ${state.chargeEncounter} of 3` : '';
  $('phase-label').textContent = phaseLabel + volleyInfo + chargeInfo;
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
  // Hide drill indicator during charge/melee
  if (state.phase === BattlePhase.Charge || state.phase === BattlePhase.Melee) {
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

function renderLog() {
  const scroll = $('narrative-scroll');
  for (let i = renderedLogCount; i < state.log.length; i++) {
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
    const div = document.createElement('div');
    div.className = `log-entry ${entry.type}`;
    if (entry.type === 'morale') div.classList.add(entry.text.includes('+') ? 'positive' : 'negative');
    div.innerHTML = entry.text.split('\n\n').map(p => `<p>${p}</p>`).join('\n\n');
    scroll.appendChild(div);
  }
  renderedLogCount = state.log.length;
  requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; });
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

  // CHARGE PHASE: show charge choices
  if (state.phase === BattlePhase.Charge) {
    renderChargeChoices(grid);
    return;
  }

  // LINE PHASE: standard drill actions
  const fireIds = [ActionId.Fire, ActionId.SnapShot, ActionId.HoldFire, ActionId.AimCarefully];
  const endureIds = [ActionId.Duck, ActionId.Pray, ActionId.DrinkWater, ActionId.StandFirm, ActionId.SteadyNeighbour];
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

// === Phase 2: Storybook Rendering ===

function renderStorybookPage() {
  const encounter = getChargeEncounter(state);
  const { player } = state;

  // Encounter counter
  $('parchment-encounter').textContent = `Encounter ${state.chargeEncounter} of 3`;

  // Narrative — gather recent log entries for this encounter
  const narrativeEl = $('parchment-narrative');
  const recentEntries = state.log.filter(e => e.type === 'narrative' || e.type === 'event' || e.type === 'action');
  const lastEntries = recentEntries.slice(-4);
  narrativeEl.innerHTML = lastEntries.map(e =>
    e.text.split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')
  ).join('');

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

  // Arena actions
  renderArenaActions();
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

  // Action selection
  const actions = getMeleeActions(state);
  const attackIds = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike, MeleeActionId.Shoot];
  const defenseIds = [MeleeActionId.Guard, MeleeActionId.Dodge];
  const immediateIds = [MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Feint, MeleeActionId.Respite, MeleeActionId.Shoot];

  // Group actions visually: attacks, defense, utility
  const attacks = actions.filter(a => attackIds.includes(a.id));
  const defenses = actions.filter(a => defenseIds.includes(a.id));
  const utility = actions.filter(a => !attackIds.includes(a.id) && !defenseIds.includes(a.id));
  const grouped = [
    ...attacks.map(a => ({ ...a, group: 'attack' })),
    ...defenses.map(a => ({ ...a, group: 'defense' })),
    ...utility.map(a => ({ ...a, group: 'utility' })),
  ];

  for (const action of grouped) {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    if (attackIds.includes(action.id)) btn.classList.add('melee-attack');
    else if (defenseIds.includes(action.id)) btn.classList.add('melee-defense');
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
        // Non-targeted: resolve immediately
        handleMeleeAction(action.id);
      } else {
        // Attack: need body part selection
        meleeSelectedAction = action.id;
        ms.selectingTarget = true;
        renderArenaActions();
      }
    });
    grid.appendChild(btn);
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

async function handleMeleeAction(action: MeleeActionId, bodyPart?: BodyPart) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  const input: MeleeTurnInput = { action, bodyPart, stance: meleeStance };
  state = advanceTurn(state, ActionId.Fire /* dummy, ignored */, input);
  gameState.battleState = state;

  // Reset local melee UI state
  meleeSelectedAction = null;

  render();

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
  };
  const texts: Record<string, string> = {
    victory: 'The plateau is yours. The last Austrian line breaks and flees down the gorges of the Adige, white coats vanishing into the frozen valley below. The drums fall silent. For the first time in hours, you can hear the wind.\n\nYou stood when others would have broken. The men around you — what is left of them — lean on their muskets and stare at the field. Nobody cheers. Not yet. The ground is covered with the fallen of both armies, French blue and Austrian white together in the January mud.\n\nSomewhere behind the ridge, Bonaparte watches. He will call this a great victory. The gazettes in Paris will celebrate. But here, on the plateau, among the men who held the line, there is only silence and the slow realisation that you are still alive.\n\nRivoli is won. The price is written in the faces of the men who paid it.',
    survived: 'Hands drag you from the press. Sergeant Duval, blood on his face, shoving you toward the rear. "Enough, lad. You\'ve done enough."\n\nYou stumble back through the wreckage of the line — broken muskets, torn cartridge boxes, men sitting in the mud with blank stares. The battle goes on without you. You can hear it: the clash of steel, the screaming, the drums still beating the pas de charge.\n\nYou survived Rivoli. Not gloriously. Not like the stories they\'ll tell in Paris. You survived it the way most men survive battles — by enduring what no one should have to endure, and then being pulled out before it killed you.\n\nYour hands won\'t stop shaking. They won\'t stop for a long time.',
    rout: 'You ran. The bayonet dropped from fingers that couldn\'t grip anymore, and your legs carried you away — stumbling over the dead, sliding on frozen ground, down the slope and away from the guns.\n\nYou are not alone. Others run with you, men whose courage broke at the same moment yours did. Nobody speaks. Nobody looks at each other.\n\nBehind you, the battle goes on. The line holds without you — or it doesn\'t. You don\'t look back to find out. The shame will come later, in quiet moments, for the rest of your life. Right now there is only the animal need to breathe, to move, to live.\n\nYou survived Rivoli. That word will taste like ashes every time you say it.',
    defeat: state.phase === 'melee' || state.phase === 'charge'
      ? 'The steel finds you. A moment of pressure, then fire, then cold. You go down in the press of bodies, in the mud and the blood, on this frozen plateau above the Adige.\n\nThe sky is very blue. The sounds of battle fade — the crash of volleys, the drums, the screaming — all of it pulling away like a tide going out. Someone steps over you. Then another.\n\nYou came to Rivoli as a soldier of the Republic. You fought beside Pierre, beside Jean-Baptiste, beside men whose names you barely learned. You held the line as long as you could.\n\nThe 14th of January, 1797. The plateau. The cold. The white coats coming through the smoke.\n\nThis is where your war ends.'
      : 'The ball finds you. No warning — just a punch in the chest that drives the air from your lungs and drops you where you stand. The musket clatters from your hands.\n\nThe sky above the Adige valley is pale January blue. Around you, the volley line fires on without you — three hundred muskets thundering, the smoke rolling thick and white. Someone shouts your name. You cannot answer.\n\nYou came to Rivoli to hold the line. You stood in the dawn cold, shoulder to shoulder with men you\'d known for weeks or hours. You did your duty.\n\nThe drums are still beating. The battle goes on. But not for you.\n\nThe 14th of January, 1797. This is where your war ends.',
    cavalry_victory: 'The thunder comes from behind — hooves on frozen ground, hundreds of them, a sound that shakes the plateau itself. The chasseurs à cheval pour over the ridge in a wave of green coats and flashing sabres.\n\nThe Austrians see them too late. The cavalry hits their flank like a hammer on glass. The white-coated line — that terrible, advancing line that has been trying to kill you for the last hour — shatters. Men throw down their muskets and run.\n\nYou stand among the wreckage, bayonet still raised, chest heaving. Around you, the survivors of the demi-brigade stare as the cavalry sweeps the field. Nobody speaks. The relief is too enormous for words.\n\nBonaparte timed it perfectly. He always does. The chasseurs finish what the infantry started — what you started, standing in the line on this frozen plateau since dawn.\n\nRivoli is won. You held long enough.',
  };
  $('battle-over-title').textContent = titles[state.outcome] || 'Battle Over';
  const endText = texts[state.outcome] || '';
  $('battle-over-text').innerHTML = endText.split('\n\n').map(p => `<p>${p}</p>`).join('');

  // Show "Continue to Camp" for surviving outcomes (not death)
  const canContinue = state.outcome !== 'defeat';
  ($('btn-continue-camp') as HTMLElement).style.display = canContinue ? 'inline-block' : 'none';

  const meleeKills = state.meleeState?.killCount || 0;
  $('battle-stats').innerHTML = `
    Turns survived: ${state.turn}<br>
    Final morale: ${Math.round(state.player.morale)} (${state.player.moraleThreshold})<br>
    Valor: ${state.player.valor}<br>
    Health: ${Math.round(state.player.health)}% | Fatigue: ${Math.round(state.player.fatigue)}%<br>
    Volleys fired: ${state.volleysFired}<br>
    ${meleeKills > 0 ? `Melee kills: ${meleeKills}<br>` : ''}
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
  state = advanceTurn(state, actionId);
  gameState.battleState = state;

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
  renderedLogCount = 0;
  arenaLogCount = 0;
  $('camp-narrative').innerHTML = '';
  $('battle-over').style.display = 'none';
  render();
}

function handleMarchToBattle() {
  transitionToBattle(gameState);
  state = gameState.battleState!;

  // Add battle opening narrative
  const battleName = gameState.campaign.currentBattle;
  state.log.push({
    turn: 0,
    text: `The drums call again. The regiment marches to ${battleName}. The men fall in, checking flints and tightening straps. Another battle awaits.`,
    type: 'narrative',
  });
  state.availableActions = getScriptedAvailableActions(state);

  renderedLogCount = 0;
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

$('btn-character').addEventListener('click', () => {
  renderCharacterPanel();
  $('char-overlay').style.display = 'flex';
});
$('btn-char-close').addEventListener('click', () => {
  $('char-overlay').style.display = 'none';
});
$('btn-restart').addEventListener('click', init);
$('btn-continue-camp').addEventListener('click', handleContinueToCamp);
$('btn-march').addEventListener('click', handleMarchToBattle);

// === Intro Screen ===

interface IntroStat {
  key: string;
  label: string;
  playerField: 'valor' | 'experience' | 'maxMorale' | 'maxHealth' | 'maxFatigue';
  currentField?: 'morale' | 'health' | 'fatigue';
  default: number;
  min: number;
  max: number;
  step: number;
}

const INTRO_STATS: IntroStat[] = [
  { key: 'valor', label: 'Valor', playerField: 'valor', default: 40, min: 10, max: 80, step: 5 },
  { key: 'experience', label: 'Experience', playerField: 'experience', default: 20, min: 0, max: 60, step: 5 },
  { key: 'maxMorale', label: 'Max Morale', playerField: 'maxMorale', currentField: 'morale', default: 100, min: 60, max: 120, step: 5 },
  { key: 'maxHealth', label: 'Max Health', playerField: 'maxHealth', currentField: 'health', default: 100, min: 60, max: 120, step: 5 },
  { key: 'maxFatigue', label: 'Max Stamina', playerField: 'maxFatigue', currentField: 'fatigue', default: 100, min: 60, max: 120, step: 5 },
];

function renderIntroStats() {
  const container = $('intro-stats');
  container.innerHTML = '';
  for (const stat of INTRO_STATS) {
    const val = state.player[stat.playerField] as number;
    const row = document.createElement('div');
    row.className = 'intro-stat-row';
    row.innerHTML = `
      <span class="intro-stat-label">${stat.label}</span>
      <div class="intro-stat-controls">
        <button class="intro-stat-btn" data-stat="${stat.key}" data-dir="-" ${val <= stat.min ? 'disabled' : ''}>-</button>
        <span class="intro-stat-val">${val}</span>
        <button class="intro-stat-btn" data-stat="${stat.key}" data-dir="+" ${val >= stat.max ? 'disabled' : ''}>+</button>
      </div>
    `;
    container.appendChild(row);
  }

  container.querySelectorAll('.intro-stat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget as HTMLButtonElement;
      const key = el.getAttribute('data-stat')!;
      const dir = el.getAttribute('data-dir') === '+' ? 1 : -1;
      const stat = INTRO_STATS.find(s => s.key === key)!;
      const cur = state.player[stat.playerField] as number;
      const next = cur + dir * stat.step;
      if (next < stat.min || next > stat.max) return;
      (state.player as any)[stat.playerField] = next;
      if (stat.currentField) {
        (state.player as any)[stat.currentField] = next;
      }
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
  $('intro-name-step').style.display = 'none';
  $('intro-stats-step').style.display = '';
  $('intro-player-name').textContent = name;
  renderIntroStats();
}

$('btn-intro-confirm').addEventListener('click', confirmIntroName);
$('intro-name-input').addEventListener('keydown', (e) => {
  if ((e as KeyboardEvent).key === 'Enter') confirmIntroName();
});

$('btn-intro-begin').addEventListener('click', () => {
  state = beginBattle(state);
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
