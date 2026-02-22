import { appState, triggerRender } from './state';
import { $ } from './dom';
import { renderCampSceneArt } from './campArt';
import { showSplash, showCinematic } from './cinematicOverlay';
import type { CampEvent } from '../types';
import { CampActivityId, ARMS_TRAINING_TIERS } from '../types';
import { advanceCampTurn, resolveCampEvent as resolveCampEventAction, getCampActivities, isCampComplete } from '../core/camp';
import { getBonaparteEvent, getBriefingEvent, getCampfiresEvent } from '../core/preBattleCamp';
import { saveGame } from '../core/persistence';
import { transitionToBattle } from '../core/gameLoop';
import { beginBattle } from '../core/battle';

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
  const spent = camp.actionsTotal - camp.actionsRemaining;
  const pct = Math.min(100, (spent / camp.actionsTotal) * 100);
  $('phase-label').textContent = 'CAMP';
  $('turn-counter').textContent = '';
  $('camp-location').textContent = camp.conditions.location;
  $('camp-time-fill').style.width = `${pct}%`;
}

// ── Prologue: cinematic step-through intro for pre-battle ──

export const PROLOGUE_BEATS = [
  'Italy. January, 1797.',

  'For ten months, General Bonaparte has led the Army of Italy on a campaign that has stunned Europe. Montenotte. Lodi. Castiglione. Arcole. Each victory bought with blood and boot leather.\n\n'
    + 'The army that was starving and barefoot in the spring now holds all of northern Italy in its grip.',

  'But the war is not won. The great fortress of Mantua remains under siege, its Austrian garrison slowly starving. And now Field Marshal Alvinczi marches south with twenty-eight thousand men to break the siege and drive the French into the sea.',

  'General Joubert\u2019s division \u2014 your division \u2014 holds the plateau above the village of Rivoli, where the Adige valley opens onto the plains of northern Italy. Ten thousand men against twenty-eight thousand.\n\n'
    + 'If the line breaks here, Mantua is relieved and the campaign is lost.',

  'You are a soldier of the 14th demi-brigade de ligne. Bonaparte rides through the night to take command. Mass\u00e9na\u2019s division marches behind him.\n\n'
    + 'Until they arrive, the plateau is yours to hold.',
];

const NIGHT_BEFORE_TEXT =
  'The 14th demi-brigade bivouacs on the plateau above Rivoli. The January night is bitter. The fog still clings to the plateau, draping the camp in grey.\n\n'
  + 'You find a spot near a warm fire. Someone passes a heel of bread. Someone else is sharpening a bayonet, the cold song of steel. \u201cIt\u2019s been a long road, hasn\u2019t it?\u201d Jean-Baptiste jerks you from some listless reverie. \u201cSince Voltri.\u201d Ten long months.\n\n'
  + 'Then the wind shifts. Slowly at first, then all at once, the fog tears apart like a curtain.\n\n'
  + 'And there they are. Campfires. Not dozens \u2014 thousands. Covering the slopes of Monte Baldo like a second sky. Every one of them a squad, a company, a column. Now every man knows with certainty. We are outnumbered.';

function renderCampIntro() {
  if (appState.activeCinematic) return;

  // Hide camp UI while prologue plays
  const container = $('camp-container');
  const body = container.querySelector('.camp-body') as HTMLElement | null;
  if (body) body.style.display = 'none';
  const header = container.querySelector('.camp-header') as HTMLElement | null;
  if (header) header.style.display = 'none';
  $('camp-event-overlay').style.display = 'none';

  // First beat is the date card (subtitle), rest are narrative chunks
  const chunks = PROLOGUE_BEATS.slice(1);

  appState.activeCinematic = showCinematic({
    subtitle: PROLOGUE_BEATS[0],
    chunks,
    choices: [{ id: 'make_camp', label: 'Make Camp', desc: 'The plateau awaits.' }],
    onChoice: () => {
      appState.activeCinematic?.destroy();
      appState.activeCinematic = null;
      if (body) body.style.display = '';
      if (header) header.style.display = '';
      appState.campIntroSeen = true;
      triggerRender();
    },
  });
}

function renderNightBefore(camp: import('../types').CampState) {
  if (appState.activeCinematic) return;
  if (document.querySelector('.cinematic-splash-overlay')) return;

  camp.triggeredEvents.push('night_before');
  saveGame(appState.gameState);

  showSplash('Fate Beckons...', () => {
    const chunks = NIGHT_BEFORE_TEXT.split('\n\n').filter(p => p.trim());

    appState.activeCinematic = showCinematic({
      title: 'THE NIGHT BEFORE',
      chunks,
      onComplete: () => {
        appState.activeCinematic?.destroy();
        appState.activeCinematic = null;
        triggerRender();
      },
    });
  });
}

export function renderCamp() {
  const camp = appState.gameState.campState!;
  const player = appState.gameState.player;
  const npcs = appState.gameState.npcs;

  // Camp intro screen — show opening narrative before activities
  if (!appState.campIntroSeen) {
    renderCampIntro();
    return;
  }

  // Scripted events — one at a time, earliest unfired trigger first.
  // Guard: skip if a random or scripted event is already pending.
  if (!camp.pendingEvent) {
    // Austrian Campfires — fog + ghostly lights, at 10 actions remaining
    if (camp.actionsRemaining <= 10
      && !camp.triggeredEvents.includes('prebattle_campfires')) {
      const event = getCampfiresEvent();
      camp.pendingEvent = event;
      camp.triggeredEvents.push(event.id);
      camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
      saveGame(appState.gameState);
    // Officer's Briefing — front rank decision, at 7 actions remaining
    } else if (camp.actionsRemaining <= 7
      && !camp.triggeredEvents.includes('prebattle_briefing')) {
      const event = getBriefingEvent();
      camp.pendingEvent = event;
      camp.triggeredEvents.push(event.id);
      camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
      saveGame(appState.gameState);
    // "The Night Before" popup — fog clears, full revelation, at 3 actions remaining
    } else if (camp.actionsRemaining <= 3
      && !camp.triggeredEvents.includes('night_before')) {
      renderNightBefore(camp);
      return;
    // Bonaparte Rides Past — midnight arrival, at 1 action remaining
    } else if (camp.actionsRemaining <= 1
      && !camp.triggeredEvents.includes('prebattle_bonaparte')) {
      const event = getBonaparteEvent();
      camp.pendingEvent = event;
      camp.triggeredEvents.push(event.id);
      camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
      saveGame(appState.gameState);
    }
  }

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
  $('camp-strain-bar').style.display = 'none';

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

  // Center -- Opinion summary (Soldiers, Officers, Napoleon) using group rep trackers
  const repToLabel = (rep: number) => rep > 70 ? 'Respected' : rep >= 40 ? 'Neutral' : 'Distrusted';
  const napoleonLabel = player.napoleonRep < 10 ? 'Unknown' : repToLabel(player.napoleonRep);

  const npcListEl = $('camp-npc-list');
  npcListEl.innerHTML = `
    <div class="status-row"><span class="status-key">Soldiers</span><span class="status-val">${repToLabel(player.soldierRep)}</span></div>
    <div class="status-row"><span class="status-key">Officers</span><span class="status-val">${repToLabel(player.officerRep)}</span></div>
    <div class="status-row"><span class="status-key">Napoleon</span><span class="status-val">${napoleonLabel}</span></div>
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
  const statusContent = document.querySelector('.camp-status-content') as HTMLElement;
  if (isCampComplete(camp)) {
    $('camp-activities-grid').innerHTML = '';
    $('btn-march').style.display = 'block';
    appState.campActionCategory = null;
    appState.campActionResult = null;
    appState.campActionSub = null;
    $('camp-action-panel').style.display = 'none';
    if (statusContent) statusContent.style.display = '';
  } else {
    $('btn-march').style.display = 'none';
    // Always show category buttons in the left column
    renderCampActivities();
    // Show/hide the floating action panel
    if (appState.campActionCategory) {
      renderActionPanel(appState.campActionCategory);
      if (statusContent) statusContent.style.display = 'none';
    } else {
      $('camp-action-panel').style.display = 'none';
      if (statusContent) statusContent.style.display = '';
    }
  }
}

function renderCampNarrative() {
  const camp = appState.gameState.campState!;
  const container = $('camp-narrative');

  for (let i = appState.campLogCount; i < camp.log.length; i++) {
    const entry = camp.log[i];
    const div = document.createElement('div');
    div.className = `camp-log-entry ${entry.type}`;
    div.textContent = entry.text;
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
    const isActive = appState.campActionCategory === act.id;
    btn.className = `action-btn camp-activity-btn${isActive ? ' active' : ''}`;
    if (!act.available) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    }
    btn.innerHTML = `
      <span class="action-name">${act.name}</span>
      <span class="action-desc">${act.description}</span>
      ${act.staminaCost > 0 ? `<span class="camp-activity-cost">Stamina: -${act.staminaCost}</span>` : ''}
    `;

    btn.addEventListener('click', () => {
      if (appState.campActionCategory === act.id) {
        // Toggle off — close panel
        appState.campActionCategory = null;
        appState.campActionResult = null;
        appState.campActionSub = null;
      } else {
        // Select new category
        appState.campActionCategory = act.id;
        appState.campActionResult = null;
        appState.campActionSub = null;
      }
      triggerRender();
    });
    grid.appendChild(btn);
  }
}

function renderCampEvent(event: CampEvent) {
  if (appState.activeCinematic) return;
  if (document.querySelector('.cinematic-splash-overlay')) return;

  showSplash('Fate Beckons...', () => {
    const chunks = event.narrative.split('\n\n').filter(p => p.trim());
    const choices = event.choices.map(c => ({
      id: c.id,
      label: c.label,
      desc: c.description,
    }));

    appState.activeCinematic = showCinematic({
      title: event.title.toUpperCase(),
      chunks,
      choices,
      onChoice: (id) => handleCampEventChoice(id),
    });
  });
}

// ── Inline action screen: renders sub-menu options into the left column ──

interface ActionOption {
  id: string;
  name: string;
  desc: string;
  locked: boolean;
  lockReason: string;
  detail?: string;
}

interface ActionTierGroup {
  label: string;
  tier: 'solo' | 'comrades' | 'officers';
  locked: boolean;
  repReq: string;
  repMet: boolean;
  cap: number;
  options: ActionOption[];
}

function getOptionsForCategory(categoryId: string): { title: string; flavor: string; options?: ActionOption[]; tiers?: ActionTierGroup[] } {
  const camp = appState.gameState.campState!;
  const player = appState.gameState.player;

  switch (categoryId) {
    case CampActivityId.Rest:
      return {
        title: 'REST',
        flavor: 'The fire crackles low. The cold bites at your fingers and your eyelids are heavy. A few hours off your feet could do you good.',
        options: [
          { id: 'lay_about', name: 'Lay About', desc: 'Sleep, sit by the fire, do nothing.', locked: false, lockReason: '' },
          { id: 'bathe', name: 'Bathe', desc: 'Wade into the Adige. Freezing, but you\'ll feel like a new man.', locked: camp.batheCooldown > 0, lockReason: `Available in ${camp.batheCooldown} action${camp.batheCooldown !== 1 ? 's' : ''}` },
          { id: 'pray', name: 'Pray', desc: 'Find a quiet place. Say the words you remember.', locked: camp.prayedThisCamp, lockReason: 'Already prayed this camp' },
        ],
      };

    case CampActivityId.Exercise:
      return {
        title: 'EXERCISE',
        flavor: 'The body is a soldier\u2019s first weapon. Whatever the day brings, you\u2019ll face it stronger for the effort.',
        options: [
          { id: 'haul', name: 'Haul', desc: 'Find something heavy. Move it somewhere else.', locked: false, lockReason: '', detail: 'Strength + Endurance' },
          { id: 'wrestle', name: 'Wrestle', desc: 'Grapple with a comrade. Builds power and toughness.', locked: false, lockReason: '', detail: 'Strength + Constitution' },
          { id: 'run', name: 'Run', desc: 'Run the perimeter. Lungs and legs.', locked: false, lockReason: '', detail: 'Endurance + Constitution' },
        ],
      };

    case CampActivityId.Duties:
      return {
        title: 'DUTIES',
        flavor: 'The army runs on routine. There is always something that needs doing \u2014 and someone has to do it.',
        options: [
          { id: 'forage', name: 'Forage', desc: 'Take a detail into the countryside. Find what you can.', locked: false, lockReason: '' },
          { id: 'check_equipment', name: 'Check Equipment', desc: 'Strip and clean the musket. Sharpen the bayonet.', locked: false, lockReason: '' },
          { id: 'volunteer', name: 'Volunteer for Duty', desc: 'Make yourself useful.', locked: false, lockReason: '' },
          { id: 'tend_wounded', name: 'Tend the Wounded', desc: 'Help the surgeon. Grim work, but someone must.', locked: true, lockReason: 'Coming soon' },
        ],
      };

    case CampActivityId.Socialize: {
      const npcs = appState.gameState.npcs.filter(n => n.alive);
      const options: ActionOption[] = npcs.map(npc => {
        const relLabel = npc.relationship > 20 ? 'Friendly' : npc.relationship < -20 ? 'Hostile' : 'Neutral';
        return { id: npc.id, name: npc.name, desc: `${npc.role} — ${relLabel}`, locked: false, lockReason: '' };
      });
      options.push({ id: 'write_letter', name: 'Write a Letter', desc: 'Put quill to paper. Stay connected to those far away.', locked: false, lockReason: '' });
      options.push({ id: 'gamble', name: 'Gamble', desc: 'Cards and dice by the fire.', locked: true, lockReason: 'Coming soon' });
      return { title: 'SOCIALIZE', flavor: 'The men around the fire are the closest thing to family you have out here. A word, a joke, a shared silence \u2014 it all matters.', options };
    }

    case CampActivityId.ArmsTraining: {
      const tierData: ActionTierGroup[] = [
        {
          label: 'Solo Training', tier: 'solo',
          locked: false, repReq: '', repMet: true, cap: ARMS_TRAINING_TIERS.solo.cap,
          options: [
            { id: 'solo_musketry', name: 'Dry Fire Drill', desc: 'Practice the loading sequence alone.', locked: false, lockReason: '', detail: `Musketry (cap ${ARMS_TRAINING_TIERS.solo.cap})` },
            { id: 'solo_elan', name: 'Shadow Drill', desc: 'Bayonet forms against an imaginary foe.', locked: false, lockReason: '', detail: `Élan (cap ${ARMS_TRAINING_TIERS.solo.cap})` },
          ],
        },
        {
          label: 'Train with Comrades', tier: 'comrades',
          locked: player.soldierRep < ARMS_TRAINING_TIERS.comrades.repRequired,
          repReq: `Soldier Rep ${ARMS_TRAINING_TIERS.comrades.repRequired}`,
          repMet: player.soldierRep >= ARMS_TRAINING_TIERS.comrades.repRequired,
          cap: ARMS_TRAINING_TIERS.comrades.cap,
          options: [
            { id: 'comrades_musketry', name: 'Squad Volleys', desc: 'Volley drill with the section.', locked: false, lockReason: '', detail: `Musketry (cap ${ARMS_TRAINING_TIERS.comrades.cap})` },
            { id: 'comrades_elan', name: 'Sparring', desc: 'Wooden bayonets, dueling.', locked: false, lockReason: '', detail: `Élan (cap ${ARMS_TRAINING_TIERS.comrades.cap})` },
          ],
        },
        {
          label: 'Train with Officers', tier: 'officers',
          locked: player.officerRep < ARMS_TRAINING_TIERS.officers.repRequired,
          repReq: `Officer Rep ${ARMS_TRAINING_TIERS.officers.repRequired}`,
          repMet: player.officerRep >= ARMS_TRAINING_TIERS.officers.repRequired,
          cap: ARMS_TRAINING_TIERS.officers.cap,
          options: [
            { id: 'officers_musketry', name: 'Marksman Instruction', desc: 'Elite musketry training.', locked: false, lockReason: '', detail: `Musketry (cap ${ARMS_TRAINING_TIERS.officers.cap})` },
            { id: 'officers_elan', name: "Salle d'Armes", desc: 'Formal fencing instruction.', locked: false, lockReason: '', detail: `Élan (cap ${ARMS_TRAINING_TIERS.officers.cap})` },
          ],
        },
      ];
      return { title: 'ARMS TRAINING', flavor: 'Steel is only as strong as the hand that wields it.', tiers: tierData };
    }

    default:
      return { title: categoryId.toUpperCase(), flavor: '', options: [] };
  }
}

function getEquipmentOptions(): ActionOption[] {
  const eq = appState.gameState.player.equipment;
  return [
    { id: 'musket', name: 'Musket & Bayonet', desc: 'Strip, clean, and oil the lock. Sharpen the bayonet.', locked: true, lockReason: 'Coming soon', detail: `Condition: ${eq.musketCondition}%` },
    { id: 'uniform', name: 'Mend Uniform', desc: 'Patch holes, re-stitch seams, polish buttons.', locked: true, lockReason: 'Coming soon', detail: `Condition: ${eq.uniformCondition}%` },
  ];
}

function renderActionPanel(categoryId: string) {
  const panel = $('camp-action-panel');
  panel.innerHTML = '';
  const camp = appState.gameState.campState!;

  // If pending event appeared after an activity, clear action state and let renderCamp handle it
  if (camp.pendingEvent) {
    appState.campActionCategory = null;
    appState.campActionResult = null;
    appState.campActionSub = null;
    panel.style.display = 'none';
    triggerRender();
    return;
  }

  panel.style.display = 'flex';

  // Two-column layout: choices left, text right
  const choicesCol = document.createElement('div');
  choicesCol.className = 'camp-panel-choices';
  const textCol = document.createElement('div');
  textCol.className = 'camp-panel-text';
  panel.appendChild(choicesCol);
  panel.appendChild(textCol);

  const data = getOptionsForCategory(categoryId);

  // Right column: always populated — result text if available, otherwise category flavor
  const lastResult = appState.campActionResult;
  function fillTextCol(text: string, changes?: string[]) {
    textCol.innerHTML = `
      <div class="camp-action-result">
        <div class="camp-action-result-text">${text.replace(/\n/g, '<br>')}</div>
        ${changes && changes.length > 0 ? `<div class="camp-action-result-changes">${changes.join(' &nbsp; ')}</div>` : ''}
      </div>
    `;
  }

  if (lastResult) {
    fillTextCol(lastResult.text, lastResult.changes);
  } else if (appState.campActionSub === 'write_letter') {
    fillTextCol('You grip the quill. The page stares back. You never learned. You fold the paper and put it away.');
  } else {
    fillTextCol(data.flavor);
  }

  // Handle nested sub-menu: Duties → Check Equipment
  if (appState.campActionSub === 'check_equipment') {
    const header = document.createElement('div');
    header.className = 'camp-action-header';
    header.textContent = 'MAINTAIN EQUIPMENT';
    choicesCol.appendChild(header);

    for (const opt of getEquipmentOptions()) {
      choicesCol.appendChild(makeActionButton(opt, () => {}));
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'camp-action-back';
    backBtn.textContent = 'BACK';
    backBtn.addEventListener('click', () => {
      appState.campActionSub = null;
      triggerRender();
    });
    choicesCol.appendChild(backBtn);
    return;
  }

  // Handle Socialize → Write a Letter sub-screen
  if (appState.campActionSub === 'write_letter') {
    const header = document.createElement('div');
    header.className = 'camp-action-header';
    header.textContent = 'WRITE A LETTER';
    choicesCol.appendChild(header);

    const backBtn = document.createElement('button');
    backBtn.className = 'camp-action-back';
    backBtn.textContent = 'BACK';
    backBtn.addEventListener('click', () => {
      appState.campActionSub = null;
      triggerRender();
    });
    choicesCol.appendChild(backBtn);
    return;
  }

  // Category header
  const header = document.createElement('div');
  header.className = 'camp-action-header';
  header.textContent = data.title;
  choicesCol.appendChild(header);

  // Arms Training uses tiered layout
  if (data.tiers) {
    for (const tierGroup of data.tiers) {
      const tierHeader = document.createElement('div');
      tierHeader.className = `camp-action-tier-header${tierGroup.locked ? ' locked' : ''}`;
      tierHeader.innerHTML = `
        <span class="camp-action-tier-label">${tierGroup.label}</span>
        ${tierGroup.repReq ? `<span class="camp-action-tier-req${tierGroup.repMet ? ' met' : ''}">${tierGroup.locked ? 'Requires ' : ''}${tierGroup.repReq}${tierGroup.repMet ? ' \u2713' : ''}</span>` : ''}
        <span class="camp-action-tier-cap">Cap: ${tierGroup.cap}</span>
      `;
      choicesCol.appendChild(tierHeader);

      for (const opt of tierGroup.options) {
        const isLocked = tierGroup.locked || opt.locked;
        const btn = makeActionButton(
          { ...opt, locked: isLocked },
          () => handleCampActivity(CampActivityId.ArmsTraining, opt.id),
        );
        choicesCol.appendChild(btn);
      }
    }
  } else if (data.options) {
    for (const opt of data.options) {
      let handler: () => void;

      if (categoryId === CampActivityId.Socialize) {
        if (opt.id === 'write_letter') {
          handler = () => {
            appState.campActionSub = 'write_letter';
            triggerRender();
          };
        } else {
          handler = () => {
            const npc = appState.gameState.npcs.find(n => n.id === opt.id);
            const name = npc ? npc.name : opt.name;
            appState.campActionResult = { text: `${name} doesn't have anything to say to you right now.`, changes: [] };
            triggerRender();
          };
        }
      } else if (categoryId === CampActivityId.Duties && opt.id === 'check_equipment') {
        handler = () => {
          appState.campActionSub = 'check_equipment';
          triggerRender();
        };
      } else {
        handler = () => handleCampActivity(categoryId as CampActivityId, opt.id);
      }

      choicesCol.appendChild(makeActionButton(opt, handler));
    }
  }
}

function makeActionButton(opt: ActionOption, handler: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'action-btn camp-activity-btn';
  if (opt.locked) {
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
  }
  btn.innerHTML = `
    <span class="action-name">${opt.name}</span>
    <span class="action-desc">${opt.desc}</span>
    ${opt.detail ? `<span class="camp-action-stat-detail">${opt.detail}</span>` : ''}
    ${opt.locked && opt.lockReason ? `<span class="camp-action-lock-reason">${opt.lockReason}</span>` : ''}
  `;
  if (!opt.locked) {
    btn.addEventListener('click', handler);
  }
  return btn;
}

function handleCampActivity(activityId: CampActivityId, targetNpcId?: string) {
  if (appState.processing) return;
  appState.processing = true;

  const camp = appState.gameState.campState!;
  const logBefore = camp.log.length;

  const result = advanceCampTurn(appState.gameState, activityId, targetNpcId);
  saveGame(appState.gameState);

  // Extract result entries from this activity
  const newEntries = camp.log.slice(logBefore);
  const resultLines = newEntries
    .filter(e => e.type === 'result')
    .map(e => e.text);
  const activityLines = newEntries
    .filter(e => e.type === 'activity')
    .map(e => e.text);

  // Build change summary from activity result
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
  if (result.staminaChange !== 0) {
    const sign = result.staminaChange > 0 ? '+' : '';
    changes.push(`stamina: ${sign}${result.staminaChange}`);
  }
  if (result.healthChange && result.healthChange !== 0) {
    const sign = result.healthChange > 0 ? '+' : '';
    changes.push(`health: ${sign}${result.healthChange}`);
  }
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = appState.gameState.npcs.find(n => n.id === change.npcId);
      const name = npc ? npc.name : change.npcId;
      const sign = change.relationship > 0 ? '+' : '';
      changes.push(`${name}: ${sign}${change.relationship}`);
    }
  }

  // Combine activity narrative + result lines for the inline result display
  const allText = [...activityLines, ...resultLines].join('\n\n');

  // Store result for inline display
  appState.campActionResult = { text: allText, changes };
  appState.processing = false;

  // Re-render the camp (this will show the action screen with the result)
  triggerRender();
}

function handleCampEventChoice(choiceId: string) {
  if (appState.processing) return;
  appState.processing = true;

  const result = resolveCampEventAction(appState.gameState, choiceId);
  saveGame(appState.gameState);

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
  if (result.staminaChange && result.staminaChange !== 0) {
    const sign = result.staminaChange > 0 ? '+' : '';
    changes.push(`stamina: ${sign}${result.staminaChange}`);
  }
  if (result.npcChanges) {
    for (const change of result.npcChanges) {
      const npc = appState.gameState.npcs.find(n => n.id === change.npcId);
      const name = npc ? npc.name : change.npcId;
      const sign = change.relationship > 0 ? '+' : '';
      changes.push(`${name}: ${sign}${change.relationship}`);
    }
  }

  if (appState.activeCinematic && resultNarrative.trim()) {
    const resultChunks = resultNarrative.split('\n\n').filter(p => p.trim());

    appState.activeCinematic.showResult({
      chunks: resultChunks,
      changes: changes.length > 0 ? changes : undefined,
      rollDisplay: result.rollDisplay,
      onContinue: () => {
        appState.activeCinematic = null;
        triggerRender();
      },
    });
  } else {
    if (appState.activeCinematic) {
      appState.activeCinematic.destroy();
      appState.activeCinematic = null;
    }
    triggerRender();
  }

  appState.processing = false;
}

// Escape key closes the action panel
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && appState.campActionCategory !== null) {
    const campContainer = document.getElementById('camp-container');
    if (campContainer && campContainer.style.display !== 'none') {
      appState.campActionCategory = null;
      appState.campActionResult = null;
      appState.campActionSub = null;
      triggerRender();
    }
  }
});

// Click outside popover (on the center column) closes it
document.addEventListener('click', (e) => {
  if (appState.campActionCategory === null) return;
  if (appState.activeCinematic) return; // don't dismiss during cinematic
  const panel = document.getElementById('camp-action-panel');
  const activitiesCol = document.querySelector('.camp-col-activities');
  const target = e.target as Node;
  // Ignore clicks inside the popover or the left category column
  if (panel?.contains(target) || activitiesCol?.contains(target)) return;
  // Only act if click is within the center column
  const statusCol = document.querySelector('.camp-col-status');
  if (statusCol?.contains(target)) {
    appState.campActionCategory = null;
    appState.campActionResult = null;
    appState.campActionSub = null;
    triggerRender();
  }
});

export function handleMarchToBattle() {
  transitionToBattle(appState.gameState);
  appState.state = appState.gameState.battleState!;

  // Start the battle with opening beat parchment
  appState.state = beginBattle(appState.state);
  appState.gameState.battleState = appState.state;
  appState.showOpeningBeat = true;

  saveGame(appState.gameState);
  appState.lastRenderedTurn = -1;
  appState.renderedEntriesForTurn = 0;
  appState.arenaLogCount = 0;
  $('narrative-scroll').innerHTML = '';
  $('arena-narrative').innerHTML = '';
  triggerRender();
}
