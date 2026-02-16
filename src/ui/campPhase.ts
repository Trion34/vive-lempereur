import { appState, triggerRender } from './state';
import { $ } from './dom';
import { renderCampSceneArt } from './campArt';
import type { CampEvent, ExerciseSubActivity, ArmsTrainingSubActivity, RestSubActivity, DutySubActivity } from '../types';
import { CampActivityId, getStrainTier, StrainTier, ARMS_TRAINING_TIERS } from '../types';
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
  const spent = camp.actionsTotal - camp.actionsRemaining;
  const pct = Math.min(100, (spent / camp.actionsTotal) * 100);
  $('phase-label').textContent = 'CAMP';
  $('turn-counter').textContent = '';
  $('camp-location').textContent = camp.conditions.location;
  $('camp-time-fill').style.width = `${pct}%`;
}

// ── Prologue: cinematic step-through intro for pre-battle ──

const PROLOGUE_BEATS = [
  'Italy. January, 1797.',

  'For ten months, General Bonaparte has led the Army of Italy on a campaign that has stunned Europe. Montenotte. Lodi. Castiglione. Arcole. Each victory bought with blood and boot leather.\n\n'
    + 'The army that was starving and barefoot in the spring now holds all of northern Italy in its grip.',

  'But the war is not won. The great fortress of Mantua remains under siege, its Austrian garrison slowly starving. And now Field Marshal Alvinczi marches south with twenty-eight thousand men to break the siege and drive the French into the sea.',

  'General Joubert\u2019s division \u2014 your division \u2014 holds the plateau above the village of Rivoli, where the Adige valley opens onto the plains of northern Italy. Ten thousand men against twenty-eight thousand.\n\n'
    + 'If the line breaks here, Mantua is relieved and the campaign is lost.',

  'You are a soldier of the 14th demi-brigade de ligne. You have been told to hold this ground. You have been told that Bonaparte rides through the night to take command, and that Mass\u00e9na\u2019s division marches behind him.\n\n'
    + 'Until they arrive, the plateau is yours to hold.',
];

const NIGHT_BEFORE_TEXT =
  'The 14th demi-brigade bivouacs on the plateau above the Adige. The January night is bitter. Fires dot the hillside like fallen stars.\n\n'
  + 'You find a spot near a dying fire. Someone passes a heel of bread. Someone else is sharpening a bayonet, the scrape of steel steady as a heartbeat. The plateau stretches out beneath the moonlight \u2014 open ground, vineyards, low stone walls. This is where they will come.\n\n'
  + 'The veterans don\u2019t talk about the odds. The conscripts can\u2019t stop talking about them.\n\n'
  + 'Captain Leclerc walks the fires. \u201CRest. Eat. Check your flints. Tomorrow we hold this plateau or we die on it.\u201D\n\n'
  + 'No one answers. No one needs to.';

function renderPrologue() {
  const container = $('camp-container');
  const body = container.querySelector('.camp-body') as HTMLElement | null;
  if (body) body.style.display = 'none';
  const header = container.querySelector('.camp-header') as HTMLElement | null;
  if (header) header.style.display = 'none';
  $('camp-event-overlay').style.display = 'none';

  // Remove any existing prologue (re-render safety)
  const existing = document.getElementById('prologue-overlay');
  if (existing) existing.remove();

  let beatIndex = 0;
  let transitioning = false;

  const overlay = document.createElement('div');
  overlay.className = 'prologue-overlay';
  overlay.id = 'prologue-overlay';
  overlay.innerHTML = `
    <div class="prologue-content">
      <div class="prologue-text" id="prologue-text"></div>
    </div>
    <div class="prologue-hint">Click anywhere to continue</div>
  `;
  container.appendChild(overlay);

  const textEl = overlay.querySelector('.prologue-text') as HTMLElement;
  const hintEl = overlay.querySelector('.prologue-hint') as HTMLElement;

  function showBeat(index: number) {
    transitioning = true;
    const beat = PROLOGUE_BEATS[index];
    const isLast = index === PROLOGUE_BEATS.length - 1;
    const isFirst = index === 0;

    // Fade out current text
    textEl.classList.remove('visible');

    setTimeout(() => {
      const paragraphs = beat.split('\n\n').map(p => `<p>${p}</p>`).join('');

      textEl.className = isFirst
        ? 'prologue-text prologue-date'
        : 'prologue-text';

      if (isLast) {
        hintEl.style.display = 'none';
        overlay.style.cursor = 'default';
        textEl.innerHTML = paragraphs
          + '<button class="prologue-make-camp" id="btn-prologue-camp">Make Camp</button>';
        const btn = document.getElementById('btn-prologue-camp')!;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          overlay.remove();
          if (body) body.style.display = '';
          if (header) header.style.display = '';
          appState.campIntroSeen = true;
          triggerRender();
        });
      } else {
        textEl.innerHTML = paragraphs;
      }

      // Fade in
      requestAnimationFrame(() => textEl.classList.add('visible'));

      setTimeout(() => { transitioning = false; }, 600);
    }, 400);
  }

  overlay.addEventListener('click', () => {
    if (transitioning) return;
    if (beatIndex >= PROLOGUE_BEATS.length - 1) return;
    beatIndex++;
    showBeat(beatIndex);
  });

  // Show first beat
  requestAnimationFrame(() => showBeat(0));
}

function renderCampIntro(camp: import('../types').CampState) {
  // Pre-battle uses cinematic prologue
  if (camp.context === 'pre-battle') {
    renderPrologue();
    return;
  }

  // Post-battle uses parchment overlay
  const openingText = camp.log.length > 0 ? camp.log[0].text : '';
  const paragraphs = openingText.split('\n\n').map(p => `<p>${p}</p>`).join('');

  const container = $('camp-container');
  const body = container.querySelector('.camp-body') as HTMLElement | null;
  if (body) body.style.display = 'none';

  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  content.innerHTML = `
    <div class="camp-intro">
      <h3>After the Battle</h3>
      <div class="camp-intro-narrative">${paragraphs}</div>
      <button class="parchment-choice camp-event-continue" id="btn-camp-intro-continue">
        <div class="parchment-choice-text">
          <span class="parchment-choice-label">Continue</span>
        </div>
      </button>
    </div>
  `;

  $('btn-camp-intro-continue').addEventListener('click', () => {
    appState.campIntroSeen = true;
    overlay.style.display = 'none';
    if (body) body.style.display = '';
    triggerRender();
  });
}

function renderNightBefore(camp: import('../types').CampState) {
  const paragraphs = NIGHT_BEFORE_TEXT.split('\n\n').map(p => `<p>${p}</p>`).join('');

  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  content.innerHTML = `
    <div class="camp-intro">
      <h3>The Night Before</h3>
      <div class="camp-intro-narrative">${paragraphs}</div>
      <button class="parchment-choice camp-event-continue" id="btn-night-before-continue">
        <div class="parchment-choice-text">
          <span class="parchment-choice-label">Continue</span>
        </div>
      </button>
    </div>
  `;

  camp.triggeredEvents.push('night_before');
  saveGame(appState.gameState);

  $('btn-night-before-continue').addEventListener('click', () => {
    overlay.style.display = 'none';
    triggerRender();
  });
}

export function renderCamp() {
  const camp = appState.gameState.campState!;
  const player = appState.gameState.player;
  const npcs = appState.gameState.npcs;

  // Camp intro screen — show opening narrative before activities
  if (!appState.campIntroSeen) {
    renderCampIntro(camp);
    return;
  }

  // "The Night Before" popup — triggers at 2 actions remaining in pre-battle camp
  if (camp.context === 'pre-battle'
    && camp.actionsRemaining <= 2
    && !camp.triggeredEvents.includes('night_before')) {
    renderNightBefore(camp);
    // Continue rendering camp behind the overlay so it's visible when dismissed
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
  // Strain bar — floating over SVG art
  const strainVal = Math.round(camp.strain);
  const strainTier = getStrainTier(camp.strain);
  const strainTierLabel: Record<StrainTier, string> = {
    [StrainTier.Rested]: 'RESTED',
    [StrainTier.Strained]: 'STRAINED',
    [StrainTier.Overworked]: 'OVERWORKED',
  };
  const strainBar = $('camp-strain-bar');
  const strainFill = $('camp-strain-fill');
  const strainValue = $('camp-strain-value');
  if (strainVal > 0) {
    strainBar.style.display = '';
    strainBar.className = `camp-strain-bar strain-${strainTier}`;
    strainFill.style.width = `${strainVal}%`;
    strainValue.textContent = strainTierLabel[strainTier];
  } else {
    strainBar.style.display = 'none';
  }

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

    if (act.id === CampActivityId.Rest) {
      btn.addEventListener('click', () => showRestSelect());
    } else if (act.id === CampActivityId.Exercise) {
      btn.addEventListener('click', () => showExerciseSelect());
    } else if (act.id === CampActivityId.ArmsTraining) {
      btn.addEventListener('click', () => showArmsTrainingSelect());
    } else if (act.id === CampActivityId.Duties) {
      btn.addEventListener('click', () => showDutiesSelect());
    } else if (act.id === CampActivityId.Socialize) {
      btn.addEventListener('click', () => showSocializeSelect());
    } else if (act.requiresTarget) {
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

function showSocializeSelect() {
  const npcs = appState.gameState.npcs.filter(n => n.alive);
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  content.innerHTML = `
    <h3>Socialize</h3>
    <p>Who do you want to talk to?</p>
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
      // Show placeholder dialogue — no activity consumed
      content.innerHTML = `
        <h3>${npc.name}</h3>
        <p class="camp-event-narrative">${npc.name} has nothing to say to you right now.</p>
        <button class="parchment-choice camp-event-continue" id="btn-socialize-back">
          <div class="parchment-choice-text">
            <span class="parchment-choice-label">Back</span>
          </div>
        </button>
      `;
      $('btn-socialize-back').addEventListener('click', () => {
        overlay.style.display = 'none';
      });
    });
    choicesEl.appendChild(btn);
  }

  // Write a Letter option
  const letterBtn = document.createElement('button');
  letterBtn.className = 'parchment-choice';
  letterBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Write a Letter</span>
      <span class="parchment-choice-desc">Put quill to paper. Stay connected to those far away.</span>
    </div>
  `;
  letterBtn.addEventListener('click', () => {
    content.innerHTML = `
      <h3>Write a Letter</h3>
      <p class="camp-event-narrative">You stare at the blank paper for a long time. The quill hovers. But the letters swim and blur — you never learned, not properly. The few words you know look wrong scratched into the page. You fold the paper away. Maybe someone will write it for you. Someday.</p>
      <button class="parchment-choice camp-event-continue" id="btn-letter-back">
        <div class="parchment-choice-text">
          <span class="parchment-choice-label">Back</span>
        </div>
      </button>
    `;
    $('btn-letter-back').addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  });
  choicesEl.appendChild(letterBtn);

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'parchment-choice';
  backBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Back</span>
    </div>
  `;
  backBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  choicesEl.appendChild(backBtn);
}

function showDutiesSelect() {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  const camp = appState.gameState.campState!;
  const isPreBattle = camp.context === 'pre-battle';

  const duties: { id: DutySubActivity; name: string; desc: string; locked: boolean; lockReason: string }[] = [
    {
      id: 'drill',
      name: 'Drill',
      desc: isPreBattle
        ? 'Run through the manual of arms. Load, present, fire. Again.'
        : 'Full squad drill under the NCO. Repetition builds competence.',
      locked: false,
      lockReason: '',
    },
    {
      id: 'check_equipment',
      name: 'Check Equipment',
      desc: 'Strip and clean the musket. Sharpen the bayonet. Check your flints.',
      locked: false,
      lockReason: '',
    },
  ];

  if (isPreBattle) {
    duties.push({
      id: 'scout',
      name: 'Scout the Ground',
      desc: 'Walk the plateau. Learn the terrain before the fighting starts.',
      locked: false,
      lockReason: '',
    });
  }

  duties.push(
    {
      id: 'stand_watch',
      name: 'Stand Watch',
      desc: 'Volunteer for an extra sentry shift. The officers value reliability.',
      locked: true,
      lockReason: 'Coming soon',
    },
    {
      id: 'tend_wounded',
      name: 'Tend the Wounded',
      desc: 'Help the surgeon. Hold men down. Carry water. Grim work, but someone must.',
      locked: true,
      lockReason: 'Coming soon',
    },
  );

  content.innerHTML = `
    <h3>Duties</h3>
    <p>What needs doing?</p>
    <div class="camp-event-choices"></div>
  `;
  const choicesEl = content.querySelector('.camp-event-choices')!;

  for (const duty of duties) {
    const btn = document.createElement('button');
    btn.className = `parchment-choice${duty.locked ? ' locked' : ''}`;
    if (duty.locked) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    }
    btn.innerHTML = `
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${duty.name}</span>
        <span class="parchment-choice-desc">${duty.desc}</span>
        ${duty.locked ? `<span class="rest-cooldown">${duty.lockReason}</span>` : ''}
      </div>
    `;
    if (!duty.locked) {
      btn.addEventListener('click', () => {
        if (duty.id === 'check_equipment') {
          showEquipmentSelect();
        } else {
          overlay.style.display = 'none';
          handleCampActivity(CampActivityId.Duties, duty.id);
        }
      });
    }
    choicesEl.appendChild(btn);
  }

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'parchment-choice';
  backBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Back</span>
    </div>
  `;
  backBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  choicesEl.appendChild(backBtn);
}

function showRestSelect() {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  const camp = appState.gameState.campState!;

  const options: { id: RestSubActivity; name: string; desc: string; locked: boolean; lockReason: string }[] = [
    {
      id: 'lay_about',
      name: 'Lay About',
      desc: 'Sleep, sit by the fire, do nothing. The standard rest.',
      locked: false,
      lockReason: '',
    },
    {
      id: 'bathe',
      name: 'Bathe',
      desc: 'Wade into the Adige. Freezing, but you\'ll feel like a new man.',
      locked: camp.batheCooldown > 0,
      lockReason: `Available in ${camp.batheCooldown} action${camp.batheCooldown !== 1 ? 's' : ''}`,
    },
    {
      id: 'pray',
      name: 'Pray',
      desc: 'Find a quiet place. Say the words you remember. Courage follows.',
      locked: camp.prayedThisCamp,
      lockReason: 'Already prayed this camp',
    },
  ];

  content.innerHTML = `
    <h3>Rest</h3>
    <p>How will you spend your time?</p>
    <div class="camp-event-choices"></div>
  `;
  const choicesEl = content.querySelector('.camp-event-choices')!;

  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = `parchment-choice${opt.locked ? ' locked' : ''}`;
    if (opt.locked) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    }
    btn.innerHTML = `
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${opt.name}</span>
        <span class="parchment-choice-desc">${opt.desc}</span>
        ${opt.locked ? `<span class="rest-cooldown">${opt.lockReason}</span>` : ''}
      </div>
    `;
    if (!opt.locked) {
      btn.addEventListener('click', () => {
        overlay.style.display = 'none';
        handleCampActivity(CampActivityId.Rest, opt.id);
      });
    }
    choicesEl.appendChild(btn);
  }

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'parchment-choice';
  backBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Back</span>
    </div>
  `;
  backBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  choicesEl.appendChild(backBtn);
}

function showEquipmentSelect() {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  const player = appState.gameState.player;
  const eq = player.equipment;

  const options = [
    {
      name: 'Musket & Bayonet',
      desc: 'Strip, clean, and oil the lock. Sharpen the bayonet. Check the flints.',
      condition: `Musket: ${eq.musketCondition}% \u2014 Bayonet: ${eq.musketCondition}%`,
    },
    {
      name: 'Mend Uniform',
      desc: 'Patch holes, re-stitch seams, polish buttons. Look like a soldier.',
      condition: `Uniform: ${eq.uniformCondition}%`,
    },
  ];

  content.innerHTML = `
    <h3>Maintain Equipment</h3>
    <p>What needs attention?</p>
    <div class="camp-event-choices"></div>
  `;
  const choicesEl = content.querySelector('.camp-event-choices')!;

  for (const opt of options) {
    const btn = document.createElement('button');
    btn.className = 'parchment-choice locked';
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
    btn.innerHTML = `
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${opt.name}</span>
        <span class="parchment-choice-desc">${opt.desc}</span>
        <span class="exercise-stats">${opt.condition}</span>
        <span class="rest-cooldown">Coming soon</span>
      </div>
    `;
    choicesEl.appendChild(btn);
  }

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'parchment-choice';
  backBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Back</span>
    </div>
  `;
  backBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  choicesEl.appendChild(backBtn);
}

function showExerciseSelect() {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');

  const exercises: { id: ExerciseSubActivity; name: string; desc: string; stats: string }[] = [
    { id: 'fatigue_duty', name: 'Fatigue Duty', desc: 'Dig ditches, haul crates, chop wood. The army\'s endless grunt work.', stats: 'Strength + Endurance' },
    { id: 'wrestle', name: 'Wrestle', desc: 'Grapple with a comrade. Builds power and toughness.', stats: 'Strength + Constitution' },
    { id: 'run', name: 'Run', desc: 'Run the perimeter. Lungs and legs.', stats: 'Endurance + Constitution' },
  ];

  content.innerHTML = `
    <h3>Choose Exercise</h3>
    <p>Physical training. Each exercise tests two stats — higher stats are harder to improve.</p>
    <div class="camp-event-choices"></div>
  `;
  const choicesEl = content.querySelector('.camp-event-choices')!;

  for (const ex of exercises) {
    const btn = document.createElement('button');
    btn.className = 'parchment-choice';
    btn.innerHTML = `
      <div class="parchment-choice-text">
        <span class="parchment-choice-label">${ex.name}</span>
        <span class="parchment-choice-desc">${ex.desc}</span>
        <span class="exercise-stats">${ex.stats}</span>
      </div>
    `;
    btn.addEventListener('click', () => {
      overlay.style.display = 'none';
      handleCampActivity(CampActivityId.Exercise, ex.id);
    });
    choicesEl.appendChild(btn);
  }

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'parchment-choice';
  backBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Back</span>
    </div>
  `;
  backBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  choicesEl.appendChild(backBtn);
}

function showArmsTrainingSelect() {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');
  const player = appState.gameState.player;

  const tiers: {
    label: string; tier: 'solo' | 'comrades' | 'officers';
    options: { id: ArmsTrainingSubActivity; name: string; desc: string; stat: string }[];
  }[] = [
    {
      label: 'Solo Training',
      tier: 'solo',
      options: [
        { id: 'solo_musketry', name: 'Dry Fire Drill', desc: 'Practice the loading sequence alone. Repetition builds speed.', stat: 'Musketry' },
        { id: 'solo_elan', name: 'Shadow Drill', desc: 'Bayonet forms against an imaginary foe. Thrust, parry, recover.', stat: 'Elan' },
      ],
    },
    {
      label: 'Train with Comrades',
      tier: 'comrades',
      options: [
        { id: 'comrades_musketry', name: 'Squad Volleys', desc: 'Volley drill with the section. Shared rhythm sharpens everyone.', stat: 'Musketry' },
        { id: 'comrades_elan', name: 'Sparring', desc: 'Wooden bayonets, no quarter. The bruises teach faster than forms.', stat: 'Elan' },
      ],
    },
    {
      label: 'Train with Officers',
      tier: 'officers',
      options: [
        { id: 'officers_musketry', name: 'Marksman Instruction', desc: 'An officer corrects your technique. Small adjustments, large results.', stat: 'Musketry' },
        { id: 'officers_elan', name: "Salle d'Armes", desc: 'Formal fencing instruction from a former swordmaster.', stat: 'Elan' },
      ],
    },
  ];

  content.innerHTML = `
    <h3>Arms Training</h3>
    <p>Practice musketry or bayonet work. Higher tiers are more effective and push to higher limits.</p>
    <div class="arms-training-tiers"></div>
  `;
  const tiersEl = content.querySelector('.arms-training-tiers')!;

  for (const tierGroup of tiers) {
    const tierConfig = ARMS_TRAINING_TIERS[tierGroup.tier];
    const repMet = player[tierConfig.repField] >= tierConfig.repRequired;
    const locked = !repMet;

    // Tier header
    const tierHeader = document.createElement('div');
    tierHeader.className = `arms-tier-header${locked ? ' locked' : ''}`;
    tierHeader.innerHTML = `
      <span class="arms-tier-label">${tierGroup.label}</span>
      ${tierConfig.repRequired > 0 ? `<span class="arms-tier-req${repMet ? ' met' : ''}">${locked ? 'Requires' : ''} ${tierConfig.repField === 'officerRep' ? 'Officer' : 'Soldier'} Rep ${tierConfig.repRequired}${repMet ? ' \u2713' : ''}</span>` : ''}
      <span class="arms-tier-cap">Cap: ${tierConfig.cap}</span>
    `;
    tiersEl.appendChild(tierHeader);

    // Options
    for (const opt of tierGroup.options) {
      const btn = document.createElement('button');
      btn.className = `parchment-choice arms-training-choice${locked ? ' locked' : ''}`;
      if (locked) {
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
      }
      btn.innerHTML = `
        <div class="parchment-choice-text">
          <span class="parchment-choice-label">${opt.name}</span>
          <span class="parchment-choice-desc">${opt.desc}</span>
          <span class="exercise-stats">${opt.stat} (cap ${tierConfig.cap})</span>
        </div>
      `;
      if (!locked) {
        btn.addEventListener('click', () => {
          overlay.style.display = 'none';
          handleCampActivity(CampActivityId.ArmsTraining, opt.id);
        });
      }
      tiersEl.appendChild(btn);
    }
  }

  // Back button
  const backBtn = document.createElement('button');
  backBtn.className = 'parchment-choice';
  backBtn.innerHTML = `
    <div class="parchment-choice-text">
      <span class="parchment-choice-label">Back</span>
    </div>
  `;
  backBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
  tiersEl.appendChild(backBtn);
}

function handleCampActivity(activityId: CampActivityId, targetNpcId?: string) {
  if (appState.processing) return;
  appState.processing = true;

  const camp = appState.gameState.campState!;
  const logBefore = camp.log.length;

  advanceCampTurn(appState.gameState, activityId, targetNpcId);
  saveGame(appState.gameState);

  // Extract result entries from this activity
  const newEntries = camp.log.slice(logBefore);
  const resultLines = newEntries
    .filter(e => e.type === 'result')
    .map(e => e.text);

  // Show result popup if there are results to report
  if (resultLines.length > 0) {
    showActivityResult(resultLines);
  } else {
    triggerRender();
    appState.processing = false;
  }
}

function showActivityResult(results: string[]) {
  const overlay = $('camp-event-overlay');
  overlay.style.display = 'flex';
  const content = $('camp-event-content');

  const lines = results.map(r => `<div class="activity-result-line">${r}</div>`).join('');

  content.innerHTML = `
    <div class="camp-activity-result">
      <div class="camp-activity-stat-result">${lines}</div>
      <button class="parchment-choice camp-event-continue" id="btn-activity-continue">
        <div class="parchment-choice-text">
          <span class="parchment-choice-label">Continue</span>
        </div>
      </button>
    </div>
  `;

  $('btn-activity-continue').addEventListener('click', () => {
    overlay.style.display = 'none';
    triggerRender();
    appState.processing = false;
  });
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
  appState.campIntroSeen = false;
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
