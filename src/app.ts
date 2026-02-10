import { createInitialBattleState, beginBattle, advanceTurn, resolveAutoFumbleFire, resolveMeleeRout, MeleeTurnInput } from './core/battle';
import { resetEventTexts } from './core/events';
import { getChargeEncounter } from './core/charge';
import { getMeleeActions } from './core/melee';
import {
  BattleState, ActionId, MoraleThreshold, DrillStep,
  HealthState, StaminaState, LoadResult,
  BattlePhase, ChargeChoiceId,
  MeleeStance, MeleeActionId, BodyPart,
} from './types';

const $ = (id: string) => document.getElementById(id)!;
let state: BattleState;
let renderedLogCount = 0;
let processing = false;

let arenaLogCount = 0;

function init() {
  resetEventTexts();
  state = createInitialBattleState();
  renderedLogCount = 0;
  arenaLogCount = 0;
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
  const game = $('game');
  game.classList.remove('phase-line', 'phase-charge', 'phase-melee', 'phase-intro');
  game.classList.add('phase-intro');
  // Reset intro UI
  $('intro-name-step').style.display = '';
  $('intro-stats-step').style.display = 'none';
  ($('intro-name-input') as HTMLInputElement).value = '';
  render();
}

function render() {
  const game = $('game');
  game.classList.remove('phase-line', 'phase-charge', 'phase-melee', 'phase-intro');

  if (state.phase === BattlePhase.Intro) {
    game.classList.add('phase-intro');
    return;
  } else if (state.phase === BattlePhase.Charge) {
    game.classList.add('phase-charge');
    renderHeader();
    renderStorybookPage();
  } else if (state.phase === BattlePhase.Melee) {
    game.classList.add('phase-melee');
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
    div.innerHTML = entry.text.split('\n\n').map(p => `<p>${p}</p>`).join('');
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

  // MELEE PHASE: show melee actions (placeholder until melee.ts is done)
  if (state.phase === BattlePhase.Melee) {
    renderMeleeActions(grid);
    return;
  }

  // LINE PHASE: standard drill actions
  const fireIds = [ActionId.Fire, ActionId.SnapShot, ActionId.HoldFire, ActionId.AimCarefully];
  const endureIds = [ActionId.Duck, ActionId.Pray, ActionId.DrinkWater, ActionId.HoldPosition, ActionId.HoldPosition_endure, ActionId.StandFirm, ActionId.SteadyNeighbour];
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
  const recentEntries = state.log.filter(e => e.type === 'narrative' || e.type === 'event');
  const lastEntries = recentEntries.slice(-3);
  narrativeEl.innerHTML = lastEntries.map(e =>
    e.text.split('\n\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')
  ).join('');

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
  ($('arena-player-sp-bar') as HTMLElement).style.width = `${spPct}%`;
  $('arena-player-sp-val').textContent = `${Math.round(player.stamina)}`;
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
  const oppSpPct = (opp.stamina / opp.maxStamina) * 100;
  ($('arena-opp-hp-bar') as HTMLElement).style.width = `${oppHpPct}%`;
  $('arena-opp-hp-val').textContent = `${Math.max(0, Math.round(opp.health))}`;
  ($('arena-opp-sp-bar') as HTMLElement).style.width = `${oppSpPct}%`;
  $('arena-opp-sp-val').textContent = `${Math.round(opp.stamina)}`;

  // Opponent statuses
  const oTags: string[] = [];
  if (opp.stunned) oTags.push('<span class="opp-status-tag stunned">STUNNED</span>');
  if (opp.armInjured) oTags.push('<span class="opp-status-tag arm-injured">ARM INJURED</span>');
  if (opp.legInjured) oTags.push('<span class="opp-status-tag leg-injured">LEG INJURED</span>');
  $('arena-opp-statuses').innerHTML = oTags.join('');

  // Arena log (last 6 entries)
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

  // Keep only last 8 entries visible
  while (feed.children.length > 8) {
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

  // Step 1: Select stance
  if (ms.selectingStance) {
    const label = document.createElement('div');
    label.className = 'melee-step-label';
    label.textContent = 'Choose your stance';
    grid.appendChild(label);

    const row = document.createElement('div');
    row.className = 'stance-row';

    const stances: { id: MeleeStance; label: string; desc: string; cls: string }[] = [
      { id: MeleeStance.Aggressive, label: 'Aggressive', desc: '+20% hit, -15% dodge, 6 stam', cls: 'aggressive' },
      { id: MeleeStance.Balanced, label: 'Balanced', desc: 'No modifiers, 4 stam', cls: 'balanced' },
      { id: MeleeStance.Defensive, label: 'Defensive', desc: '-15% hit, +20% dodge, 2 stam', cls: 'defensive' },
    ];

    for (const s of stances) {
      const btn = document.createElement('button');
      btn.className = `stance-btn ${s.cls}`;
      btn.innerHTML = `<span class="stance-label">${s.label}</span><span class="stance-desc">${s.desc}</span>`;
      btn.addEventListener('click', () => {
        meleeStance = s.id;
        meleeSelectedAction = null;
        ms.selectingStance = false;
        ms.selectingTarget = false;
        renderArenaActions();
      });
      row.appendChild(btn);
    }
    grid.appendChild(row);

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
        render();
        processing = false;
      });
      grid.appendChild(fleeBtn);
    }
    return;
  }

  // Step 2: Select action
  if (!meleeSelectedAction) {
    const label = document.createElement('div');
    label.className = 'melee-step-label';
    const stNames: Record<MeleeStance, string> = {
      [MeleeStance.Aggressive]: 'AGGRESSIVE', [MeleeStance.Balanced]: 'BALANCED', [MeleeStance.Defensive]: 'DEFENSIVE',
    };
    label.textContent = `Stance: ${stNames[meleeStance]} — Choose action`;
    grid.appendChild(label);

    const actions = getMeleeActions(state);
    const attackIds = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike];
    const defenseIds = [MeleeActionId.Guard, MeleeActionId.Dodge];

    for (const action of actions) {
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
        const def = [MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Feint, MeleeActionId.Respite];
        if (def.includes(action.id)) {
          handleMeleeAction(action.id);
        } else {
          meleeSelectedAction = action.id;
          ms.selectingTarget = true;
          renderArenaActions();
        }
      });
      grid.appendChild(btn);
    }
    return;
  }

  // Step 3: Select body part
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
  }
}

// Melee UI state (local to app.ts — tracks multi-step selection)
let meleeStance: MeleeStance = MeleeStance.Balanced;
let meleeSelectedAction: MeleeActionId | null = null;

function renderMeleeActions(grid: HTMLElement) {
  const ms = state.meleeState;
  if (!ms) return;

  // Step 1: Select stance
  if (ms.selectingStance) {
    const label = document.createElement('div');
    label.className = 'melee-step-label';
    label.textContent = 'Choose your stance';
    grid.appendChild(label);

    const row = document.createElement('div');
    row.className = 'stance-row';

    const stances: { id: MeleeStance; label: string; desc: string; cls: string }[] = [
      { id: MeleeStance.Aggressive, label: 'Aggressive', desc: '+20% hit, -15% dodge, 8 stam/turn', cls: 'aggressive' },
      { id: MeleeStance.Balanced, label: 'Balanced', desc: 'No modifiers, 5 stam/turn', cls: 'balanced' },
      { id: MeleeStance.Defensive, label: 'Defensive', desc: '-15% hit, +20% dodge, 3 stam/turn', cls: 'defensive' },
    ];

    for (const s of stances) {
      const btn = document.createElement('button');
      btn.className = `stance-btn ${s.cls}`;
      btn.innerHTML = `<span class="stance-label">${s.label}</span><span class="stance-desc">${s.desc}</span>`;
      btn.addEventListener('click', () => {
        meleeStance = s.id;
        meleeSelectedAction = null;
        ms.selectingStance = false;
        ms.selectingTarget = false;
        renderActions();
      });
      row.appendChild(btn);
    }
    grid.appendChild(row);

    // Flee option when at Breaking morale
    if (state.player.moraleThreshold === MoraleThreshold.Breaking) {
      const fleeBtn = document.createElement('button');
      fleeBtn.className = 'action-btn fumble-action';
      fleeBtn.style.width = '100%';
      fleeBtn.style.marginTop = '8px';
      fleeBtn.innerHTML = `
        <span class="action-name">Flee</span>
        <span class="action-desc">You can't take any more. Drop everything and run.</span>
      `;
      fleeBtn.addEventListener('click', () => {
        if (processing) return;
        processing = true;
        state = resolveMeleeRout(state);
        render();
        processing = false;
      });
      grid.appendChild(fleeBtn);
    }
    return;
  }

  // Step 2: Select action
  if (!meleeSelectedAction) {
    const label = document.createElement('div');
    label.className = 'melee-step-label';
    const stanceNames: Record<MeleeStance, string> = {
      [MeleeStance.Aggressive]: 'AGGRESSIVE', [MeleeStance.Balanced]: 'BALANCED', [MeleeStance.Defensive]: 'DEFENSIVE',
    };
    label.textContent = `Stance: ${stanceNames[meleeStance]} — Choose action`;
    grid.appendChild(label);

    const actions = getMeleeActions(state);
    const attackIds = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike];
    const defenseIds = [MeleeActionId.Guard, MeleeActionId.Dodge];

    for (const action of actions) {
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
        const def = [MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Feint, MeleeActionId.Respite];
        if (def.includes(action.id)) {
          // Non-attack: resolve immediately
          handleMeleeAction(action.id);
        } else {
          // Attack: need body part selection
          meleeSelectedAction = action.id;
          ms.selectingTarget = true;
          renderActions();
        }
      });
      grid.appendChild(btn);
    }
    return;
  }

  // Step 3: Select body part target
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
  }
}

async function handleMeleeAction(action: MeleeActionId, bodyPart?: BodyPart) {
  if (state.battleOver || processing) return;
  processing = true;

  const prevMorale = state.player.morale;
  const input: MeleeTurnInput = { action, bodyPart, stance: meleeStance };
  state = advanceTurn(state, ActionId.Fire /* dummy, ignored */, input);

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
    victory: 'The field is yours. You stood when others would have broken.',
    survived: 'You made it through. Not gloriously. You survived. That is enough.',
    rout: 'You ran. The shame will follow you. But you are alive.',
    defeat: state.phase === 'melee' || state.phase === 'charge'
      ? 'The bayonet found you. On this field, your war is over.'
      : 'The ball found you. On this field, your war is over.',
    cavalry_victory: 'The cavalry broke them. You held long enough.',
  };
  $('battle-over-title').textContent = titles[state.outcome] || 'Battle Over';
  $('battle-over-text').textContent = texts[state.outcome] || '';
  const meleeKills = state.meleeState?.killCount || 0;
  $('battle-stats').innerHTML = `
    Turns survived: ${state.turn}<br>
    Final morale: ${Math.round(state.player.morale)} (${state.player.moraleThreshold})<br>
    Valor: ${state.player.valor}<br>
    Health: ${Math.round(state.player.health)}% | Stamina: ${Math.round(state.player.stamina)}%<br>
    Volleys fired: ${state.volleysFired}<br>
    ${meleeKills > 0 ? `Melee kills: ${meleeKills}<br>` : ''}
    Enemy strength: ${Math.round(state.enemy.strength)}%<br>
    Line integrity: ${Math.round(state.line.lineIntegrity)}%
  `;
}

// === Load Animation ===

function showLoadAnimation(result: LoadResult): Promise<void> {
  return new Promise((resolve) => {
    const container = $('load-animation');
    container.style.display = 'flex';
    container.innerHTML = '';

    let stepIndex = 0;
    const steps = result.narrativeSteps;

    function showNextStep() {
      if (stepIndex >= steps.length) {
        // Show result
        const resultDiv = document.createElement('div');
        resultDiv.className = `load-result ${result.success ? 'loaded' : 'fumbled'}`;
        resultDiv.textContent = result.success ? 'LOADED' : 'FUMBLED';
        container.appendChild(resultDiv);

        setTimeout(() => {
          container.style.display = 'none';
          resolve();
        }, 1200);
        return;
      }

      const step = steps[stepIndex];
      const stepEl = document.createElement('div');
      stepEl.className = 'load-step';

      const svgContainer = document.createElement('div');
      svgContainer.className = 'load-svg-container';

      const img = document.createElement('img');
      img.src = `/assets/svg/${step.svgId}.svg`;
      img.alt = step.label;
      svgContainer.appendChild(img);

      const label = document.createElement('div');
      label.className = 'load-label';
      label.textContent = step.label;

      if (!step.success) {
        stepEl.classList.add('failed');
      }

      stepEl.appendChild(svgContainer);
      stepEl.appendChild(label);
      container.appendChild(stepEl);

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

  // Check for load animation
  if (state.lastLoadResult) {
    render();
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
      render();
      processing = false;
    }, 1500);
    return;
  }

  processing = false;
}

// Character overlay
function renderCharacterPanel() {
  $('char-stats').innerHTML = `
    <div class="status-row"><span class="status-key">Name</span><span class="status-val">${state.player.name}</span></div>
    <div class="status-row"><span class="status-key">Rank</span><span class="status-val">Private</span></div>
    <div class="status-row"><span class="status-key">Experience</span><span class="status-val">${state.player.experience}</span></div>
    <div class="status-row"><span class="status-key">Valor</span><span class="status-val">${state.player.valor} (nerve)</span></div>
    <div class="status-row"><span class="status-key">Morale</span><span class="status-val">${Math.round(state.player.morale)} / ${state.player.maxMorale}</span></div>
    <div class="status-row"><span class="status-key">Health</span><span class="status-val">${Math.round(state.player.health)} / ${state.player.maxHealth}</span></div>
    <div class="status-row"><span class="status-key">Stamina</span><span class="status-val">${Math.round(state.player.stamina)} / ${state.player.maxStamina}</span></div>
    <div class="status-row"><span class="status-key">Volleys Fired</span><span class="status-val">${state.volleysFired}</span></div>
    <div class="status-row"><span class="status-key">Times Ducked</span><span class="status-val">${state.player.duckCount}</span></div>
  `;
  $('char-inventory').innerHTML = `
    <div class="status-row"><span class="status-key">Musket</span><span class="status-val">Charleville M1777 — ${state.player.musketLoaded ? 'Loaded' : 'Empty'}</span></div>
    <div class="status-row"><span class="status-key">Bayonet</span><span class="status-val">17-inch socket</span></div>
    <div class="status-row"><span class="status-key">Cartridges</span><span class="status-val">~40 remaining</span></div>
    <div class="status-row"><span class="status-key">Canteen</span><span class="status-val">${3 - state.player.canteenUses} drinks left</span></div>
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

// === Intro Screen ===

interface IntroStat {
  key: string;
  label: string;
  playerField: 'valor' | 'experience' | 'maxMorale' | 'maxHealth' | 'maxStamina';
  currentField?: 'morale' | 'health' | 'stamina';
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
  { key: 'maxStamina', label: 'Max Stamina', playerField: 'maxStamina', currentField: 'stamina', default: 100, min: 60, max: 120, step: 5 },
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
