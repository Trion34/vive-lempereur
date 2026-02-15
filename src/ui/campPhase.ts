import { appState, triggerRender } from './state';
import { $ } from './dom';
import { renderCampSceneArt } from './campArt';
import type { CampActivityId, CampEvent } from '../types';
import { advanceCampTurn, resolveCampEvent as resolveCampEventAction, getCampActivities, isCampComplete } from '../core/camp';
import { saveGame } from '../core/persistence';
import { transitionToCamp, transitionToBattle } from '../core/gameLoop';
import { beginBattle } from '../core/battle';
import { getScriptedAvailableActions } from '../core/scriptedVolleys';

const CAMP_QUIPS = [
  '"That girl has been following us since Arcole, I swear it."',
  '"Click on her. I dare you. Dubois did and he got a promotion."',
  '"She knows things. Click and see."',
  '"Pierre says she speaks. You just have to click."',
  '"The girl in the corner \u2014 she said something about courage yesterday."',
  '"Go on, click the girl. What\'s the worst that happens?"',
  '"Leclerc says she\'s good luck. Touch the uniform and find out."',
  '"I clicked her three times. Now I see a different girl entirely."',
  '"They say if you click on her enough, she changes uniforms."',
  '"Jean-Baptiste won\'t shut up about the mascot girl."',
];

// Soldier head positions in SVG viewBox coordinates (0 0 800 400)
const SOLDIER_HEADS = [
  { x: 307, y: 280 },  // Soldier 1 (left, with musket)
  { x: 357, y: 278 },  // Soldier 2 (left-center)
  { x: 443, y: 276 },  // Soldier 3 (right-center)
  { x: 489, y: 278 },  // Soldier 4 (right)
];

function positionQuipAboveSoldier(el: HTMLElement, soldierIdx: number) {
  const svgEl = document.querySelector('#camp-scene-art svg') as SVGSVGElement | null;
  const parent = document.querySelector('.camp-col-status') as HTMLElement | null;
  if (!svgEl || !parent) return;

  const head = SOLDIER_HEADS[soldierIdx];
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return;

  const pt = svgEl.createSVGPoint();
  pt.x = head.x;
  pt.y = head.y;
  const screenPt = pt.matrixTransform(ctm);

  const parentRect = parent.getBoundingClientRect();
  const relX = screenPt.x - parentRect.left;
  const relY = screenPt.y - parentRect.top;

  // Position bubble above the soldier's head (transform: translateX(-50%) centers it)
  el.style.left = `${relX}px`;
  el.style.top = `${relY - 12}px`;
  el.style.bottom = 'auto';
  el.style.right = 'auto';
}

export function startCampQuips() {
  if (appState.campQuipTimer !== null) return; // already running
  const el = $('camp-quip');
  let idx = Math.floor(Math.random() * CAMP_QUIPS.length);
  let lastSoldier = -1;

  function showQuip() {
    // Pick a random soldier different from the last one
    let soldierIdx: number;
    do {
      soldierIdx = Math.floor(Math.random() * SOLDIER_HEADS.length);
    } while (soldierIdx === lastSoldier && SOLDIER_HEADS.length > 1);
    lastSoldier = soldierIdx;

    el.textContent = CAMP_QUIPS[idx];
    positionQuipAboveSoldier(el, soldierIdx);
    el.classList.add('visible');
    // Fade out after a few seconds
    appState.campQuipTimer = setTimeout(() => {
      el.classList.remove('visible');
      idx = (idx + 1) % CAMP_QUIPS.length;
      // Wait before next quip
      appState.campQuipTimer = setTimeout(showQuip, 12000 + Math.random() * 8000);
    }, 5000);
  }

  // Initial delay before first quip
  appState.campQuipTimer = setTimeout(showQuip, 6000 + Math.random() * 4000);
}

export function stopCampQuips() {
  if (appState.campQuipTimer !== null) {
    clearTimeout(appState.campQuipTimer);
    appState.campQuipTimer = null;
  }
  const el = document.getElementById('camp-quip');
  if (el) el.classList.remove('visible');
}

export function renderCampHeader() {
  const camp = appState.gameState.campState!;
  const totalActions = camp.maxDays * camp.activitiesPerDay;
  const spent = (camp.day - 1) * camp.activitiesPerDay + (camp.activitiesPerDay - camp.activitiesRemaining);
  const pct = Math.min(100, (spent / totalActions) * 100);
  $('phase-label').textContent = 'CAMP';
  $('turn-counter').textContent = '';
  $('camp-location').textContent = camp.conditions.location;
  $('camp-time-fill').style.width = `${pct}%`;
}

export function renderCamp() {
  const camp = appState.gameState.campState!;
  const player = appState.gameState.player;
  const npcs = appState.gameState.npcs;

  // Render the scene art backdrop
  renderCampSceneArt();

  // Camp portrait card
  $('camp-portrait-name').textContent = player.name;
  const rankLabels: Record<string, string> = {
    private: 'Private', corporal: 'Corporal', sergeant: 'Sergeant',
    lieutenant: 'Lieutenant', captain: 'Captain',
  };
  $('camp-portrait-rank').textContent = rankLabels[player.rank] || player.rank;
  const campBadge = $('grace-badge-camp') as HTMLElement;
  campBadge.style.display = player.grace > 0 ? '' : 'none';
  campBadge.textContent = player.grace > 1 ? '\u{1F33F}\u{1F33F}' : '\u{1F33F}';

  // Center -- primary stat meters only (full stats in Character menu)
  const healthPct = Math.round(camp.health);
  const staminaPct = Math.round(camp.stamina);
  const moralePct = Math.round(camp.morale);
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

  // Center -- Opinion summary (Soldiers, Officers, Napoleon)
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

  // Right -- conditions
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
  const camp = appState.gameState.campState!;
  const container = $('camp-narrative');

  for (let i = appState.campLogCount; i < camp.log.length; i++) {
    const entry = camp.log[i];
    const div = document.createElement('div');
    div.className = `camp-log-entry ${entry.type}`;
    div.innerHTML = entry.text;
    container.appendChild(div);
  }
  appState.campLogCount = camp.log.length;
  requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; });
}

function renderCampActivities() {
  const camp = appState.gameState.campState!;
  const activities = getCampActivities(appState.gameState.player, camp);
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

function renderCampEvent(event: CampEvent) {
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
  const npcs = appState.gameState.npcs.filter(n => n.alive);
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
        <span class="parchment-choice-desc">${npc.role} \u2014 ${relLabel}</span>
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
  if (appState.processing) return;
  appState.processing = true;

  advanceCampTurn(appState.gameState, activityId, targetNpcId);
  saveGame(appState.gameState);
  triggerRender();

  appState.processing = false;
}

function handleCampEventChoice(choiceId: string) {
  if (appState.processing) return;
  appState.processing = true;

  const result = resolveCampEventAction(appState.gameState, choiceId);
  saveGame(appState.gameState);

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
    triggerRender();
  });

  appState.processing = false;
}

export function handleContinueToCamp() {
  transitionToCamp(appState.gameState);
  saveGame(appState.gameState);
  appState.campLogCount = 0;
  appState.lastRenderedTurn = -1;
  appState.renderedEntriesForTurn = 0;
  appState.arenaLogCount = 0;
  $('camp-narrative').innerHTML = '';
  $('battle-over').style.display = 'none';
  $('journal-overlay').style.display = 'none';
  $('inventory-overlay').style.display = 'none';
  triggerRender();
}

export function handleMarchToBattle() {
  const fromPreBattle = appState.gameState.campState?.context === 'pre-battle';

  transitionToBattle(appState.gameState);
  appState.state = appState.gameState.battleState!;

  if (fromPreBattle) {
    // Coming from pre-battle camp: start the battle with opening beat parchment
    appState.state = beginBattle(appState.state);
    appState.gameState.battleState = appState.state;
    appState.showOpeningBeat = true;
  } else {
    // Coming from post-battle camp: standard march narrative
    const battleName = appState.gameState.campaign.currentBattle;
    appState.state.log.push({
      turn: 0,
      text: `The drums call again. The regiment marches to ${battleName}. The men fall in, checking flints and tightening straps. Another battle awaits.`,
      type: 'narrative',
    });
    appState.state.availableActions = getScriptedAvailableActions(appState.state);
  }

  saveGame(appState.gameState);
  appState.lastRenderedTurn = -1;
  appState.renderedEntriesForTurn = 0;
  appState.arenaLogCount = 0;
  $('narrative-scroll').innerHTML = '';
  $('arena-narrative').innerHTML = '';
  triggerRender();
}
