import { appState, triggerRender } from './state';
import { $ } from './dom';
import {
  BattleState, MeleeState, MeleeAlly, MeleeOpponent,
  MeleeStance, MeleeActionId, BodyPart, MoraleThreshold, ActionId, RoundAction,
  getMoraleThreshold, getHealthState, FatigueTier,
} from '../types';
import { advanceTurn, resolveMeleeRout, MeleeTurnInput } from '../core/battle';
import { getMeleeActions, calcHitChance } from '../core/melee';
import { saveGame, loadGlory, addGlory } from '../core/persistence';
import { getScreenShakeEnabled } from '../settings';
import { playHitSound, playMissSound, playBlockSound, playMusketShotSound, playRicochetSound } from '../audio';

const ATTACK_ACTIONS = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike, MeleeActionId.Shoot];
const DEFENSE_ACTIONS = [MeleeActionId.Guard];

const ACTION_DISPLAY_NAMES: Record<string, string> = {
  [MeleeActionId.BayonetThrust]: 'BAYONET THRUST',
  [MeleeActionId.AggressiveLunge]: 'LUNGE',
  [MeleeActionId.ButtStrike]: 'BUTT STRIKE',
  [MeleeActionId.Shoot]: 'SHOOT',
  [MeleeActionId.Feint]: 'FEINT',
  [MeleeActionId.Guard]: 'GUARD',
  [MeleeActionId.Respite]: 'CATCH BREATH',
  [MeleeActionId.Reload]: 'RELOADING',
  [MeleeActionId.SecondWind]: 'SECOND WIND',
};

export function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

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

function spawnClashFlash() {
  const scene = document.getElementById('duel-display');
  if (!scene) return;
  const flash = document.createElement('div');
  flash.className = 'clash-flash';
  scene.appendChild(flash);
  flash.addEventListener('animationend', () => flash.remove());
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

function showMeleeGlorySummary(kills: number, gloryEarned: number): Promise<void> {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'glory-summary-overlay';
    overlay.innerHTML = `
      <div class="glory-summary">
        <div class="glory-summary-icon">&#9733;</div>
        <div class="glory-summary-title">GLORY EARNED</div>
        <div class="glory-summary-kills">${kills} ${kills === 1 ? 'enemy' : 'enemies'} defeated</div>
        <div class="glory-summary-amount">+${gloryEarned} Glory</div>
        <div class="glory-summary-total">Total: ${appState.playerGlory}</div>
        <button class="glory-summary-btn">Continue</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.glory-summary-btn')!.addEventListener('click', () => {
      overlay.remove();
      resolve();
    });
  });
}

export function showGraceIntervenes(): Promise<void> {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'grace-overlay';
    overlay.innerHTML = `
      <div class="grace-popup">
        <div class="grace-popup-icon">&#127807;</div>
        <div class="grace-popup-title">GRACE INTERVENES</div>
        <div class="grace-popup-body">
          Fate is not finished with you. A hand steadies your arm. Breath returns. The world swims back into focus.
        </div>
        <div class="grace-popup-stats">
          Health restored to ${Math.round(appState.state.player.health)} | Morale to ${Math.round(appState.state.player.morale)} | Stamina to ${Math.round(appState.state.player.stamina)}
        </div>
        <div class="grace-popup-remaining">Grace remaining: ${appState.gameState.player.grace}</div>
        <button class="grace-popup-btn">Continue</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.grace-popup-btn')!.addEventListener('click', () => {
      overlay.remove();
      resolve();
    });
  });
}

export function tryUseGrace(): boolean {
  if (appState.gameState.player.grace <= 0) return false;
  appState.gameState.player.grace--;
  // Restore battle stats to 50% of max
  appState.state.player.health = appState.state.player.maxHealth * 0.5;
  appState.state.player.morale = appState.state.player.maxMorale * 0.5;
  appState.state.player.stamina = appState.state.player.maxStamina * 0.5;
  // Update derived states
  appState.state.player.healthState = getHealthState(appState.state.player.health, appState.state.player.maxHealth);
  appState.state.player.moraleThreshold = getMoraleThreshold(appState.state.player.morale, appState.state.player.maxMorale);
  appState.state.player.fatigue = 0;
  appState.state.player.fatigueTier = FatigueTier.Fresh;
  // Reset death flags
  appState.state.player.alive = true;
  appState.state.battleOver = false;
  appState.state.outcome = 'pending';
  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);
  return true;
}

/** Inline SVG status icon with hover tooltip */
function statusIcon(type: string, tooltip: string): string {
  const svgs: Record<string, string> = {
    stunned: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 1l1.2 3.1L12.5 4l-2.1 2.5L11.5 10 8 8.2 4.5 10l1.1-3.5L3.5 4l3.3.1z"/>
      <circle cx="3" cy="13" r="1.2"/><circle cx="13" cy="13" r="1.2"/>
    </svg>`,
    'arm-injured': `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12c1-2 2-3 4-4 2-1 4-1 5-3"/>
      <path d="M6 4l5 8" stroke-dasharray="2 2"/>
    </svg>`,
    'leg-injured': `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 2v5l-2 4v3M9 7l2 4v3"/>
      <path d="M4 6l8 6" stroke-dasharray="2 2"/>
    </svg>`,
    dead: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="8" cy="6" r="4.5"/>
      <line x1="5.5" y1="4" x2="7" y2="6"/><line x1="7" y1="4" x2="5.5" y2="6"/>
      <line x1="9" y1="4" x2="10.5" y2="6"/><line x1="10.5" y1="4" x2="9" y2="6"/>
      <path d="M6 8.5q2 1.5 4 0"/>
      <path d="M7 10.5v3M9 10.5v3"/>
    </svg>`,
    guarding: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="2" y1="14" x2="14" y2="2"/>
      <line x1="14" y1="14" x2="2" y2="2"/>
      <line x1="1" y1="13" x2="4" y2="13"/><line x1="12" y1="13" x2="15" y2="13"/>
      <line x1="1" y1="3" x2="4" y2="3"/><line x1="12" y1="3" x2="15" y2="3"/>
    </svg>`,
  };
  return `<span class="opp-status-tag ${type}" data-tooltip="${tooltip}">${svgs[type] || ''}</span>`;
}

const LOAD_STEP_LABELS = [
  'Bite cartridge',
  'Pour powder',
  'Ram ball',
  'Prime pan',
];

async function showMeleeReloadAnimation(isSecondHalf: boolean): Promise<void> {
  // Find the player element — sequential uses #duel-player, skirmish uses .is-player card
  const ms = appState.state.meleeState;
  const playerEl = ms?.mode === 'skirmish'
    ? document.querySelector('.skirmish-card.is-player') as HTMLElement | null
    : document.getElementById('duel-player');
  if (!playerEl) return;

  const container = document.createElement('div');
  container.className = 'melee-reload-sequence';
  container.innerHTML = '<div class="load-title">RELOADING</div><div class="load-steps-row"></div>';
  playerEl.appendChild(container);

  const row = container.querySelector('.load-steps-row') as HTMLElement;
  const steps = isSecondHalf ? LOAD_STEP_LABELS.slice(2, 4) : LOAD_STEP_LABELS.slice(0, 2);

  for (const label of steps) {
    const stepEl = document.createElement('div');
    stepEl.className = 'load-step-inline success';
    stepEl.textContent = label;
    stepEl.style.opacity = '0';
    stepEl.style.transform = 'translateY(6px)';
    row.appendChild(stepEl);

    // Fade-in slide-up (same feel as line battle)
    requestAnimationFrame(() => {
      stepEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      stepEl.style.opacity = '1';
      stepEl.style.transform = 'translateY(0)';
    });
    await wait(700);
  }

  await wait(600);
  container.remove();
}

export function renderArena() {
  const ms = appState.state.meleeState;
  if (!ms) return;
  const { player } = appState.state;

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

  $('arena-player-name').textContent = appState.state.player.name;
  $('portrait-name').textContent = appState.state.player.name;

  // Grace badge on melee portrait
  const meleeBadge = $('grace-badge-melee') as HTMLElement;
  const meleeGrace = appState.gameState.player.grace;
  meleeBadge.style.display = meleeGrace > 0 ? '' : 'none';
  meleeBadge.textContent = meleeGrace > 1 ? '\u{1F33F}\u{1F33F}' : '\u{1F33F}';

  // Player stance
  const stanceNames: Record<MeleeStance, string> = {
    [MeleeStance.Aggressive]: 'AGGRESSIVE',
    [MeleeStance.Balanced]: 'BALANCED',
    [MeleeStance.Defensive]: 'DEFENSIVE',
  };
  $('arena-player-stance').textContent = stanceNames[ms.playerStance];

  // Player statuses
  const pTags: string[] = [];
  if (ms.playerStunned > 0) pTags.push(statusIcon('stunned', 'Stunned \u2014 Cannot act this turn'));
  if (ms.playerFeinted) pTags.push('<span class="opp-status-tag" style="border-color:var(--accent-gold);color:var(--accent-gold)">FEINTED</span>');
  if (ms.playerRiposte) pTags.push('<span class="opp-status-tag" style="border-color:var(--health-high);color:var(--health-high)">RIPOSTE</span>');
  $('arena-player-statuses').innerHTML = pTags.join('');

  // Switch display based on mode
  const duelFighters = document.getElementById('duel-fighters');
  const skirmishField = document.getElementById('skirmish-field');
  const skirmishHud = document.getElementById('skirmish-hud');
  if (ms.mode === 'skirmish') {
    if (duelFighters) duelFighters.style.display = 'none';
    if (skirmishField) skirmishField.style.display = '';
    if (skirmishHud) skirmishHud.style.display = '';
    renderSkirmishField(ms, player);
  } else {
    if (duelFighters) duelFighters.style.display = '';
    if (skirmishField) skirmishField.style.display = 'none';
    if (skirmishHud) skirmishHud.style.display = 'none';
    renderSequentialDisplay(ms, player);
  }

  // Arena actions
  renderArenaActions();
}

function renderSequentialDisplay(ms: MeleeState, player: BattleState['player']) {
  const opp = ms.opponents[ms.currentOpponent];
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
  if (opp.stunned) oTags.push(statusIcon('stunned', 'Stunned \u2014 Cannot act this turn'));
  if (opp.armInjured) oTags.push(statusIcon('arm-injured', 'Arm Injured \u2014 Hit chance reduced'));
  if (opp.legInjured) oTags.push(statusIcon('leg-injured', 'Leg Injured \u2014 Stamina costs increased'));
  $('arena-opp-statuses').innerHTML = oTags.join('');

  // Opponent counter
  $('arena-opp-counter').textContent = `Opponent ${ms.currentOpponent + 1} / ${ms.opponents.length}`;

  // Guard overlays
  const playerGuardEl = document.getElementById('guard-overlay-player');
  const oppGuardEl = document.getElementById('guard-overlay-opp');
  if (playerGuardEl) playerGuardEl.style.display = ms.playerGuarding ? '' : 'none';
  if (oppGuardEl) oppGuardEl.style.display = ms.oppGuarding ? '' : 'none';

  // Duel display
  renderDuelDisplay(player, opp);
}

const ENEMY_TYPE_NAMES: Record<string, string> = {
  conscript: 'Conscript',
  line: 'Line Infantry',
  veteran: 'Veteran',
  sergeant: 'Sergeant',
};

const SKIRMISH_ART: Record<string, string> = {
  'is-player': '/assets/player-french.png',
  'is-ally': '/assets/ally-french.png',
  'is-enemy': '/assets/enemy-austrian.png',
};

function renderSkirmishField(ms: MeleeState, player: BattleState['player']) {
  const friendlyEl = document.getElementById('skirmish-friendly');
  const enemyEl = document.getElementById('skirmish-enemy');
  const hudFriendly = document.getElementById('skirmish-hud-friendly');
  const hudEnemy = document.getElementById('skirmish-hud-enemy');
  if (!friendlyEl || !enemyEl || !hudFriendly || !hudEnemy) return;

  // === TOP HUD: meters ===
  hudFriendly.innerHTML = '';
  hudEnemy.innerHTML = '';

  // Build set of combatants who guarded last round (from roundLog)
  const guardingNames = new Set<string>();
  for (const entry of ms.roundLog) {
    if (entry.action === MeleeActionId.Guard) guardingNames.add(entry.actorName);
  }

  // Player meter panel
  hudFriendly.appendChild(makeHudPanel(
    player.name, player.health, player.maxHealth, player.stamina, player.maxStamina,
    ms.playerStunned > 0, false, false, player.alive, 'hud-player', undefined, ms.playerGuarding,
    player.fatigue, player.maxFatigue,
  ));
  // Ally meter panels
  for (const ally of ms.allies) {
    hudFriendly.appendChild(makeHudPanel(
      ally.name, ally.health, ally.maxHealth, ally.stamina, ally.maxStamina,
      ally.stunned, ally.armInjured, ally.legInjured, ally.alive, 'hud-ally', undefined, guardingNames.has(ally.name),
      ally.fatigue, ally.maxFatigue,
    ));
  }
  // Enemy meter panels (skip defeated)
  for (const i of ms.activeEnemies) {
    const opp = ms.opponents[i];
    const defeated = opp.health <= 0 || isOppDefeated(opp);
    if (defeated) continue;
    const isTargeted = i === ms.playerTargetIndex;
    const displayName = ENEMY_TYPE_NAMES[opp.type] || opp.type;
    const panel = makeHudPanel(
      displayName, opp.health, opp.maxHealth, opp.stamina, opp.maxStamina,
      opp.stunned, opp.armInjured, opp.legInjured, true, 'hud-enemy', opp.name, guardingNames.has(opp.name),
      opp.fatigue, opp.maxFatigue,
    );
    if (isTargeted) panel.classList.add('hud-targeted');
    panel.dataset.oppIndex = String(i);
    hudEnemy.appendChild(panel);
  }

  // === FIELD: art sprites only ===
  friendlyEl.innerHTML = '';
  friendlyEl.appendChild(makeSkirmishSprite(player.name, player.alive, 'is-player'));
  for (const ally of ms.allies) {
    if (!ally.alive || ally.health <= 0) continue;
    friendlyEl.appendChild(makeSkirmishSprite(ally.name, true, 'is-ally'));
  }

  enemyEl.innerHTML = '';
  for (const i of ms.activeEnemies) {
    const opp = ms.opponents[i];
    const defeated = opp.health <= 0 || isOppDefeated(opp);
    if (defeated) continue;
    const isTargeted = i === ms.playerTargetIndex;
    const displayName = ENEMY_TYPE_NAMES[opp.type] || opp.type;
    const sprite = makeSkirmishSprite(displayName, true, 'is-enemy', opp.name);
    if (isTargeted) sprite.classList.add('is-targeted');
    sprite.dataset.oppIndex = String(i);
    sprite.classList.add('selectable-target');
    sprite.addEventListener('click', () => {
      ms.playerTargetIndex = i;
      renderSkirmishField(ms, player);
    });
    enemyEl.appendChild(sprite);
  }

  // Auto-select first live enemy if current target is dead
  const currentTarget = ms.opponents[ms.playerTargetIndex];
  if (!currentTarget || currentTarget.health <= 0 || isOppDefeated(currentTarget)) {
    const firstLive = ms.activeEnemies.find(i => {
      const o = ms.opponents[i];
      return o.health > 0 && !isOppDefeated(o);
    });
    if (firstLive !== undefined) {
      ms.playerTargetIndex = firstLive;
      renderSkirmishField(ms, player);
    }
  }
}

function isOppDefeated(opp: MeleeOpponent): boolean {
  if (opp.health <= 0) return true;
  const breakPct = opp.type === 'conscript' ? 0.35 : opp.type === 'line' ? 0.25 : opp.type === 'veteran' ? 0.15 : 0;
  return breakPct > 0 && opp.health / opp.maxHealth <= breakPct;
}

/** Top HUD meter panel for one combatant */
function makeHudPanel(
  name: string, health: number, maxHealth: number, stamina: number, maxStamina: number,
  stunned: boolean, armInjured: boolean, legInjured: boolean, alive: boolean,
  sideClass: string, dataName?: string, guarding?: boolean,
  fatigue?: number, maxFatigue?: number,
): HTMLDivElement {
  const panel = document.createElement('div');
  panel.className = `skirmish-hud-panel ${sideClass}`;
  panel.dataset.combatantName = dataName || name;
  if (!alive || health <= 0) panel.classList.add('hud-dead');

  const hpPct = Math.max(0, (health / maxHealth) * 100);
  const stPct = Math.max(0, (stamina / maxStamina) * 100);
  const ftPct = (fatigue !== undefined && maxFatigue && maxFatigue > 0) ? Math.max(0, (fatigue / maxFatigue) * 100) : 0;

  const tags: string[] = [];
  if (guarding) tags.push(statusIcon('guarding', 'Guarding \u2014 Braced for the next attack'));
  if (stunned) tags.push(statusIcon('stunned', 'Stunned \u2014 Cannot act this turn'));
  if (armInjured) tags.push(statusIcon('arm-injured', 'Arm Injured \u2014 Hit chance reduced'));
  if (legInjured) tags.push(statusIcon('leg-injured', 'Leg Injured \u2014 Stamina costs increased'));
  if (!alive || health <= 0) tags.push(statusIcon('dead', 'Dead'));

  const ftClass = ftPct >= 75 ? 'exhausted' : ftPct >= 50 ? 'fatigued' : ftPct >= 25 ? 'winded' : '';

  panel.innerHTML = `
    <div class="skirmish-hud-name">${name}</div>
    <div class="skirmish-hud-meters">
      <div class="skirmish-hud-meter">
        <span class="skirmish-hud-label">HP</span>
        <div class="skirmish-hud-track"><div class="skirmish-hud-fill health-fill" style="width:${hpPct}%"></div></div>
        <span class="skirmish-hud-val">${Math.max(0, Math.round(health))}</span>
      </div>
      <div class="skirmish-hud-meter">
        <span class="skirmish-hud-label">ST</span>
        <div class="skirmish-hud-track"><div class="skirmish-hud-fill stamina-fill" style="width:${stPct}%"></div></div>
        <span class="skirmish-hud-val">${Math.round(stamina)}</span>
      </div>
      <div class="skirmish-hud-meter">
        <span class="skirmish-hud-label">FT</span>
        <div class="skirmish-hud-track"><div class="skirmish-hud-fill fatigue-fill ${ftClass}" style="width:${ftPct}%"></div></div>
        <span class="skirmish-hud-val">${fatigue !== undefined ? Math.round(fatigue) : 0}</span>
      </div>
    </div>
    ${tags.length > 0 ? `<div class="skirmish-hud-statuses">${tags.join('')}</div>` : ''}
  `;
  return panel;
}

/** Art-only sprite card for the battlefield */
function makeSkirmishSprite(name: string, alive: boolean, sideClass: string, dataName?: string): HTMLDivElement {
  const card = document.createElement('div');
  card.className = `skirmish-card ${sideClass}`;
  card.dataset.combatantName = dataName || name;
  if (!alive) card.classList.add('is-dead');

  const shortName = name.split(' — ')[0];
  const artSrc = SKIRMISH_ART[sideClass] || '';

  card.innerHTML = `
    ${artSrc ? `<img src="${artSrc}" alt="${shortName}" class="skirmish-card-art">` : ''}
    <div class="skirmish-card-label">${shortName}</div>
  `;
  return card;
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
  if (appState.meleeStance === MeleeStance.Aggressive) duelPlayer.classList.add('stance-aggressive');
  else if (appState.meleeStance === MeleeStance.Defensive) duelPlayer.classList.add('stance-defensive');

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
  for (let i = appState.arenaLogCount; i < appState.state.log.length; i++) {
    const entry = appState.state.log[i];
    const div = document.createElement('div');
    div.className = `arena-log-entry ${entry.type}`;
    if (entry.type === 'morale') div.classList.add(entry.text.includes('+') ? 'positive' : 'negative');
    div.textContent = entry.text.replace(/\n+/g, ' ').slice(0, 200);
    feed.appendChild(div);
  }
  appState.arenaLogCount = appState.state.log.length;

  // Keep only last 20 entries visible
  while (feed.children.length > 20) {
    feed.removeChild(feed.firstChild!);
  }
  requestAnimationFrame(() => { feed.scrollTop = feed.scrollHeight; });
}

function renderArenaActions() {
  const grid = $('arena-actions-grid');
  grid.innerHTML = '';
  if (appState.state.battleOver) return;

  const ms = appState.state.meleeState;
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
    if (appState.meleeStance === s.id) btn.classList.add('active');
    btn.textContent = s.label;
    btn.addEventListener('click', () => {
      appState.meleeStance = s.id;
      renderArenaActions();
    });
    stanceBar.appendChild(btn);
  }
  grid.appendChild(stanceBar);

  // Body part selection (Step 2 of attack flow)
  if (ms.selectingTarget && appState.meleeSelectedAction) {
    const backBtn = document.createElement('button');
    backBtn.className = 'action-btn action-back';
    backBtn.innerHTML = `<span class="action-name">\u2190 Back</span>`;
    backBtn.addEventListener('click', () => {
      appState.meleeSelectedAction = null;
      ms.selectingTarget = false;
      renderArenaActions();
    });
    grid.appendChild(backBtn);

    const label = document.createElement('div');
    label.className = 'melee-step-label';
    label.textContent = 'Choose target';
    grid.appendChild(label);

    const targets = document.createElement('div');
    targets.className = 'body-target-grid';

    const pl = appState.state.player;
    const hitFor = (bp: BodyPart) => {
      const pct = calcHitChance(
        pl.elan, pl.morale, pl.maxMorale,
        appState.meleeStance, appState.meleeSelectedAction!, bp,
        ms.playerRiposte, pl.fatigue, pl.maxFatigue,
      );
      return Math.round(pct * 100);
    };

    const parts: { id: BodyPart; label: string; effect: string }[] = [
      { id: BodyPart.Head, label: 'Head', effect: 'Stun + kill chance' },
      { id: BodyPart.Torso, label: 'Torso', effect: '' },
      { id: BodyPart.Arms, label: 'Arms', effect: 'Arm injury' },
      { id: BodyPart.Legs, label: 'Legs', effect: 'Slows opponent' },
    ];

    for (const p of parts) {
      const pct = hitFor(p.id);
      const btn = document.createElement('button');
      btn.className = 'body-target-btn';
      const effectHtml = p.effect ? `<span class="body-target-effect">${p.effect}</span>` : '';
      btn.innerHTML = `<span class="body-target-label">${p.label}</span><span class="body-target-hit">${pct}%</span>${effectHtml}`;
      btn.addEventListener('click', () => {
        handleMeleeAction(appState.meleeSelectedAction!, p.id);
      });
      targets.appendChild(btn);
    }
    grid.appendChild(targets);
    return;
  }

  // Flat action grid — all actions visible at once
  const actions = getMeleeActions(appState.state);
  const attackIds = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike];
  const immediateIds = [MeleeActionId.Guard, MeleeActionId.Feint, MeleeActionId.Respite, MeleeActionId.SecondWind, MeleeActionId.Shoot, MeleeActionId.Reload];

  for (const action of actions) {
    const btn = document.createElement('button');
    btn.className = 'action-btn melee-flat';
    if (attackIds.includes(action.id)) btn.classList.add('melee-attack');
    else if (action.id === MeleeActionId.Guard) btn.classList.add('melee-defense');
    else btn.classList.add('melee-utility');

    if (!action.available) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    }

    btn.innerHTML = `<span class="action-name">${action.label}</span>`;
    btn.addEventListener('click', () => {
      if (immediateIds.includes(action.id)) {
        handleMeleeAction(action.id);
      } else {
        appState.meleeSelectedAction = action.id;
        ms.selectingTarget = true;
        renderArenaActions();
      }
    });
    grid.appendChild(btn);
  }

  // Flee option at Breaking morale
  if (appState.state.player.moraleThreshold === MoraleThreshold.Breaking) {
    const fleeBtn = document.createElement('button');
    fleeBtn.className = 'action-btn fumble-action';
    fleeBtn.innerHTML = `
      <span class="action-name">Flee</span>
      <span class="action-desc">You can't take any more. Drop everything and run.</span>
    `;
    fleeBtn.addEventListener('click', () => {
      if (appState.processing) return;
      appState.processing = true;
      appState.state = resolveMeleeRout(appState.state);
      appState.gameState.battleState = appState.state;
      triggerRender();
      appState.processing = false;
    });
    grid.appendChild(fleeBtn);
  }
}

async function handleMeleeAction(action: MeleeActionId, bodyPart?: BodyPart) {
  if (appState.state.battleOver || appState.processing) return;
  const ms = appState.state.meleeState;
  if (!ms) return;

  // Branch: skirmish vs sequential
  if (ms.mode === 'skirmish') {
    await handleSkirmishAction(action, bodyPart);
    return;
  }

  await handleSequentialAction(action, bodyPart);
}

async function handleSkirmishAction(action: MeleeActionId, bodyPart?: BodyPart) {
  appState.processing = true;
  const ms = appState.state.meleeState!;
  const prevMorale = appState.state.player.morale;
  const prevStamina = appState.state.player.stamina;
  const prevPhase = appState.state.phase;
  const prevReloadProgress = ms.reloadProgress;

  // Snapshot all combatant HP before resolution for real-time HUD updates
  const hpSnapshot = new Map<string, { hp: number, maxHp: number, side: string }>();
  const p = appState.state.player;
  hpSnapshot.set(p.name, { hp: p.health, maxHp: p.maxHealth, side: 'player' });
  for (const opp of ms.opponents) {
    hpSnapshot.set(opp.name, { hp: opp.health, maxHp: opp.maxHealth, side: 'enemy' });
  }
  for (const ally of ms.allies) {
    hpSnapshot.set(ally.name, { hp: ally.health, maxHp: ally.maxHealth, side: 'ally' });
  }

  // Resolve via advanceTurn (which dispatches to resolveMeleeRound)
  const input: MeleeTurnInput = {
    action, bodyPart, stance: appState.meleeStance,
    skirmishTargetIndex: ms.playerTargetIndex,
  };
  appState.state = advanceTurn(appState.state, ActionId.Fire, input);
  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);

  // Check melee end
  const meleeEnded = prevPhase === 'melee' && (appState.state.phase !== 'melee' || appState.state.battleOver);
  if (meleeEnded) {
    if (appState.state.battleOver && appState.state.outcome === 'defeat') {
      if (tryUseGrace()) {
        await showGraceIntervenes();
        triggerRender();
        appState.processing = false;
        return;
      }
    }
    const kills = appState.state.meleeState?.killCount || 0;
    if (kills > 0) {
      const earned = kills;
      addGlory(earned);
      appState.playerGlory = loadGlory();
      await showMeleeGlorySummary(kills, earned);
    }
  }

  appState.meleeSelectedAction = null;

  // Show reload animation above player sprite before the round cascade
  if (action === MeleeActionId.Reload) {
    const isSecondHalf = prevReloadProgress === 1;
    await showMeleeReloadAnimation(isSecondHalf);
  }

  // Animate round log as rapid cascade with real-time meter updates
  const roundLog = appState.state.meleeState?.roundLog || [];
  if (roundLog.length > 0) {
    await animateSkirmishRound(roundLog, hpSnapshot);
  }

  triggerRender();

  // Float aggregate meter changes on player sprite
  const playerSprite = findSkirmishCard(appState.state.player.name, 'player');
  if (playerSprite) {
    const moraleDelta = Math.round(appState.state.player.morale - prevMorale);
    const staminaDelta = Math.round(appState.state.player.stamina - prevStamina);
    if (moraleDelta !== 0) {
      const cls = moraleDelta > 0 ? 'float-morale-gain' : 'float-morale-loss';
      const text = moraleDelta > 0 ? `+${moraleDelta} MR` : `${moraleDelta} MR`;
      spawnFloatingText(playerSprite, text, cls);
    }
    if (staminaDelta !== 0) {
      setTimeout(() => {
        const text = staminaDelta > 0 ? `+${staminaDelta} ST` : `${staminaDelta} ST`;
        spawnFloatingText(playerSprite, text, 'float-stamina-change');
      }, moraleDelta !== 0 ? 300 : 0);
    }
  }

  if (appState.state.player.morale < prevMorale - 10 && getScreenShakeEnabled()) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  appState.processing = false;
}

async function animateSkirmishRound(roundLog: RoundAction[], hpSnapshot?: Map<string, { hp: number, maxHp: number, side: string }>) {
  const field = document.getElementById('skirmish-field');
  if (!field) return;

  for (const entry of roundLog) {
    // Defensive cleanup: strip any lingering glow/surge from sprites and HUD panels
    field.querySelectorAll('.skirmish-glow-attacker, .skirmish-glow-target, .skirmish-surge').forEach(el =>
      el.classList.remove('skirmish-glow-attacker', 'skirmish-glow-target', 'skirmish-surge'));
    document.querySelectorAll('.hud-glow-attacker, .hud-glow-target').forEach(el =>
      el.classList.remove('hud-glow-attacker', 'hud-glow-target'));

    const actorCard = findSkirmishCard(entry.actorName, entry.actorSide);
    const targetSide = entry.actorSide === 'enemy' ? 'player' : 'enemy';
    const targetCard = findSkirmishCard(entry.targetName, targetSide);
    const actorHud = findHudPanel(entry.actorName, entry.actorSide);
    const targetHud = findHudPanel(entry.targetName, targetSide);

    const isAttack = entry.action !== MeleeActionId.Guard &&
                     entry.action !== MeleeActionId.Respite && entry.action !== MeleeActionId.Feint &&
                     entry.action !== MeleeActionId.Reload && entry.action !== MeleeActionId.SecondWind;

    // === DELIBERATION: brief pause as combatant picks action ===
    await wait(500);

    if (!isAttack) {
      const actorShort = entry.actorName.split(' — ')[0];
      let label = 'guards';
      if (entry.action === MeleeActionId.Respite) label = 'catches breath';
      if (entry.action === MeleeActionId.Feint) label = 'feints';
      if (entry.action === MeleeActionId.Reload) label = 'reloads';
      if (entry.action === MeleeActionId.SecondWind) label = 'finds second wind';
      if (entry.action === MeleeActionId.Guard) playBlockSound();
      if (actorCard) actorCard.classList.add('skirmish-glow-attacker');
      if (actorHud) actorHud.classList.add('hud-glow-attacker');
      spawnCenterText(field, `${actorShort} ${label}`, 'center-text-neutral');
      await wait(1000);
      if (actorCard) actorCard.classList.remove('skirmish-glow-attacker');
      if (actorHud) actorHud.classList.remove('hud-glow-attacker');
      await wait(400);
      continue;
    }

    // === GLOW PHASE: attacker red + surge, target blue, attack name in center ===
    if (actorCard) {
      actorCard.classList.add('skirmish-glow-attacker');
      // Force reflow so animation restarts even if same actor attacks twice
      void actorCard.offsetWidth;
      actorCard.classList.add('skirmish-surge');
    }
    if (targetCard) targetCard.classList.add('skirmish-glow-target');
    if (actorHud) actorHud.classList.add('hud-glow-attacker');
    if (targetHud) targetHud.classList.add('hud-glow-target');
    const actionName = ACTION_DISPLAY_NAMES[entry.action] || entry.action;
    const bodyPartLabel = entry.bodyPart ? entry.bodyPart : '';
    spawnCenterActionText(field, actionName, bodyPartLabel);
    await wait(1200);

    // === RESULT PHASE ===
    if (entry.hit && entry.damage > 0) {
      spawnCenterText(field, 'HIT', 'center-text-hit');
      if (entry.action === MeleeActionId.Shoot) playMusketShotSound();
      else playHitSound();
      if (targetCard) {
        spawnSlash(targetCard);
        spawnFloatingText(targetCard, `-${Math.round(entry.damage)}`, 'float-damage');
      }
      // Update target's HUD meter in real-time
      if (hpSnapshot) {
        const snap = hpSnapshot.get(entry.targetName);
        if (snap) {
          snap.hp = Math.max(0, snap.hp - entry.damage);
          updateHudMeter(entry.targetName, targetSide, snap.hp, snap.maxHp);
        }
      }
      // Status effects float shortly after damage
      if (entry.special && targetCard) {
        const statusText = entry.special.trim().replace('.', '').replace('!', '').toUpperCase();
        setTimeout(() => {
          if (targetCard) spawnFloatingText(targetCard, statusText, statusText === 'KILLED' ? 'float-defeated' : 'float-status');
        }, 500);
      }
    } else if (entry.blocked) {
      spawnCenterText(field, 'BLOCKED', 'center-text-block');
      playBlockSound();
      if (targetCard) spawnFloatingText(targetCard, 'BLOCKED', 'float-block');
    } else {
      spawnCenterText(field, 'MISS', 'center-text-miss');
      if (entry.action === MeleeActionId.Shoot) playRicochetSound();
      else playMissSound();
    }
    await wait(1200);

    // === CLEAR: breathing room before next action ===
    if (actorCard) actorCard.classList.remove('skirmish-glow-attacker', 'skirmish-surge');
    if (targetCard) targetCard.classList.remove('skirmish-glow-target');
    if (actorHud) actorHud.classList.remove('hud-glow-attacker');
    if (targetHud) targetHud.classList.remove('hud-glow-target');
    await wait(600);
  }
}

/** Spawn large text in the center of the skirmish field */
function spawnCenterText(field: HTMLElement, text: string, cssClass: string) {
  const el = document.createElement('div');
  el.className = `skirmish-center-text ${cssClass}`;
  el.textContent = text;
  field.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/** Spawn two-line action text: attack name on top, body part below */
function spawnCenterActionText(field: HTMLElement, action: string, bodyPart: string) {
  const el = document.createElement('div');
  el.className = 'skirmish-center-text center-text-action';
  el.innerHTML = `<span class="center-action-name">${action}</span>${bodyPart ? `<span class="center-action-target">${bodyPart}</span>` : ''}`;
  field.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function findSkirmishCard(name: string, side: string): HTMLElement | null {
  const shortName = name.split(' — ')[0];
  const friendlyEl = document.getElementById('skirmish-friendly');
  const enemyEl = document.getElementById('skirmish-enemy');

  const container = (side === 'player' || side === 'ally') ? friendlyEl : enemyEl;
  if (container) {
    const cards = container.querySelectorAll('.skirmish-card');
    for (const card of cards) {
      const el = card as HTMLElement;
      const cardName = (el.dataset.combatantName || '').split(' — ')[0];
      if (cardName === shortName) return el;
    }
  }
  // Fallback: search both sides
  const allCards = document.querySelectorAll('.skirmish-card');
  for (const card of allCards) {
    const el = card as HTMLElement;
    const cardName = (el.dataset.combatantName || '').split(' — ')[0];
    if (cardName === shortName) return el;
  }
  return null;
}

function findHudPanel(name: string, side: string): HTMLElement | null {
  const shortName = name.split(' — ')[0];
  const hudFriendly = document.getElementById('skirmish-hud-friendly');
  const hudEnemy = document.getElementById('skirmish-hud-enemy');

  const container = (side === 'player' || side === 'ally') ? hudFriendly : hudEnemy;
  if (container) {
    const panels = container.querySelectorAll('.skirmish-hud-panel');
    for (const panel of panels) {
      const el = panel as HTMLElement;
      const panelName = (el.dataset.combatantName || '').split(' — ')[0];
      if (panelName === shortName) return el;
    }
  }
  return null;
}

/** Update a combatant's HP bar in the HUD in real-time during animation */
function updateHudMeter(name: string, side: string, hp: number, maxHp: number) {
  const panel = findHudPanel(name, side);
  if (!panel) return;
  const hpFill = panel.querySelector('.health-fill') as HTMLElement | null;
  const hpVal = panel.querySelector('.skirmish-hud-meter .skirmish-hud-val') as HTMLElement | null;
  if (hpFill) {
    const pct = Math.max(0, (hp / maxHp) * 100);
    hpFill.style.width = `${pct}%`;
    hpFill.style.transition = 'width 0.4s ease';
  }
  if (hpVal) hpVal.textContent = `${Math.max(0, Math.round(hp))}`;
}

async function handleSequentialAction(action: MeleeActionId, bodyPart?: BodyPart) {
  appState.processing = true;

  const prevMorale = appState.state.player.morale;
  const prevStamina = appState.state.player.stamina;
  const prevPlayerHp = appState.state.player.health;
  const prevOppIdx = appState.state.meleeState ? appState.state.meleeState.currentOpponent : 0;
  const prevOppHp = appState.state.meleeState ? appState.state.meleeState.opponents[prevOppIdx].health : 0;
  const prevOppStunned = appState.state.meleeState ? appState.state.meleeState.opponents[prevOppIdx].stunned : false;
  const prevPhase = appState.state.phase;
  const prevReloadProgress = appState.state.meleeState ? appState.state.meleeState.reloadProgress : 0;

  // === WIND-UP PHASE: show attacker/defender glows before resolving ===
  const playerEl = document.getElementById('duel-player');
  const oppEl = document.getElementById('duel-opponent');
  const isPlayerAttack = ATTACK_ACTIONS.includes(action);
  const isPlayerDefense = DEFENSE_ACTIONS.includes(action);
  const isFeint = action === MeleeActionId.Feint;
  const hasCombatContact = isPlayerAttack || isPlayerDefense || isFeint;

  if (isPlayerAttack) {
    if (playerEl) playerEl.classList.add('windup-attacker');
  } else if (isFeint) {
    if (playerEl) playerEl.classList.add('windup-attacker');
    if (oppEl) oppEl.classList.add('windup-defender');
  } else if (isPlayerDefense) {
    playBlockSound();
    if (oppEl) oppEl.classList.add('windup-attacker');
    if (playerEl) playerEl.classList.add('windup-defender');
  }

  if (hasCombatContact) {
    await wait(500);
    spawnClashFlash();
  }

  // Clear wind-up glows
  if (playerEl) { playerEl.classList.remove('windup-attacker', 'windup-defender'); }
  if (oppEl) { oppEl.classList.remove('windup-attacker', 'windup-defender'); }

  if (hasCombatContact) {
    await wait(100); // brief beat after clash before results
  }

  // Use ActionId.Fire as dummy (ignored for melee)
  const input: MeleeTurnInput = { action, bodyPart, stance: appState.meleeStance };
  appState.state = advanceTurn(appState.state, ActionId.Fire, input);
  appState.gameState.battleState = appState.state;

  saveGame(appState.gameState);

  // Check if melee just ended (phase changed or battle over)
  const meleeEnded = prevPhase === 'melee' && (appState.state.phase !== 'melee' || appState.state.battleOver);
  if (meleeEnded) {
    // Death interception -- try Grace before showing defeat
    if (appState.state.battleOver && appState.state.outcome === 'defeat') {
      if (tryUseGrace()) {
        await showGraceIntervenes();
        triggerRender();
        appState.processing = false;
        return;
      }
    }
    const kills = appState.state.meleeState?.killCount || 0;
    if (kills > 0) {
      const earned = kills; // 1 glory per kill
      addGlory(earned);
      appState.playerGlory = loadGlory();
      await showMeleeGlorySummary(kills, earned);
    }
  }

  // Reset local melee UI state
  appState.meleeSelectedAction = null;

  // === RELOAD ANIMATION (before combat results) ===
  if (action === MeleeActionId.Reload) {
    const isSecondHalf = prevReloadProgress === 1;
    await showMeleeReloadAnimation(isSecondHalf);
  }

  const ms = appState.state.meleeState;
  const prevOpp = ms ? ms.opponents[prevOppIdx] : null;
  const oppDmg = prevOpp ? prevOppHp - prevOpp.health : 0;
  const playerDmg = prevPlayerHp - appState.state.player.health;
  const oppTransitioned = ms ? ms.currentOpponent !== prevOppIdx : false;

  // === OPPONENT TRANSITION SEQUENCE ===
  if (oppTransitioned && ms) {
    const oppEl = document.getElementById('duel-opponent');

    if (oppDmg > 0 && oppEl) {
      if (action === MeleeActionId.Shoot) playMusketShotSound();
      else playHitSound();
      flashClass(oppEl, 'duel-hit', 400);
      spawnSlash(oppEl);
      spawnFloatingText(oppEl, `-${oppDmg}`, 'float-damage');
    }

    if (oppEl) {
      await wait(300);
      spawnFloatingText(oppEl, 'DEFEATED', 'float-defeated');
      oppEl.classList.add('enemy-departing');
    }

    await wait(1200);

    if (oppEl) {
      oppEl.classList.remove('enemy-departing');
      oppEl.style.opacity = '0';
    }
    triggerRender();

    const newOppEl = document.getElementById('duel-opponent');
    if (newOppEl) {
      newOppEl.style.opacity = '';
      newOppEl.classList.remove('duel-wounded', 'duel-critical', 'duel-defeated');
      newOppEl.classList.add('enemy-entering');
      setTimeout(() => newOppEl.classList.remove('enemy-entering'), 1000);
    }

    const newOpp = ms.opponents[ms.currentOpponent];
    showOpponentBanner(newOpp.name, newOpp.description);

    appState.processing = false;
    return;
  }

  // === NORMAL FLOW (no transition) ===
  triggerRender();

  if (ms && prevOpp) {
    const oppEl = document.getElementById('duel-opponent');
    const playerEl = document.getElementById('duel-player');
    const portraitFrame = document.querySelector('.portrait-frame') as HTMLElement | null;
    const hudPortrait = document.querySelector('.hud-portrait') as HTMLElement | null;

    // Detect opponent defeated (killed or broken)
    const breakPct = prevOpp.type === 'conscript' ? 0.35 : prevOpp.type === 'line' ? 0.25 : prevOpp.type === 'veteran' ? 0.15 : 0;
    const oppNowDefeated = prevOpp.health <= 0 ||
      (breakPct > 0 && prevOpp.health / prevOpp.maxHealth <= breakPct);

    // --- Phase 1: Player's attack result ---
    if (oppDmg > 0 && oppEl) {
      if (action === MeleeActionId.Shoot) playMusketShotSound();
      else playHitSound();
      flashClass(oppEl, 'duel-hit', 400);
      spawnSlash(oppEl);
      spawnFloatingText(oppEl, `-${oppDmg}`, 'float-damage');
      if (prevOpp.stunned && !prevOppStunned) {
        setTimeout(() => spawnFloatingText(oppEl, 'STUNNED', 'float-status'), 300);
      }
    }

    // --- Player missed ---
    if (ATTACK_ACTIONS.includes(action) && oppDmg <= 0 && !oppNowDefeated && oppEl) {
      if (action === MeleeActionId.Shoot) playRicochetSound();
      else playMissSound();
      spawnFloatingText(oppEl, 'MISS', 'float-miss');
      flashClass(oppEl, 'duel-evade', 400);
    }

    // --- Opponent defeated (final opponent or battle end) ---
    if (oppNowDefeated && oppEl) {
      setTimeout(() => spawnFloatingText(oppEl, 'DEFEATED', 'float-defeated'), 400);
    }

    // --- Phase 2: Opponent's counter-attack (sequential on attack turns) ---
    if (isPlayerAttack && !oppNowDefeated && ms.lastOppAttacked) {
      await wait(900);

      const oppEl2 = document.getElementById('duel-opponent');
      if (oppEl2) {
        oppEl2.classList.add('windup-attacker');
        await wait(400);
        spawnClashFlash();
        oppEl2.classList.remove('windup-attacker');
        await wait(100);
      }
    }

    // --- Player took damage (enemy hit) ---
    if (playerDmg > 0) {
      playHitSound();
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

    // --- Opponent missed counter-attack on attack turn ---
    if (isPlayerAttack && !oppNowDefeated && ms.lastOppAttacked && playerDmg <= 0 && playerEl) {
      playMissSound();
      spawnFloatingText(playerEl, 'MISS', 'float-miss');
    }

    // --- Player blocked (used Guard, took no damage) ---
    if (DEFENSE_ACTIONS.includes(action) && playerDmg <= 0) {
      playBlockSound();
      if (hudPortrait) {
        spawnFloatingText(hudPortrait, 'BLOCKED', 'float-block');
      }
      if (playerEl) {
        flashClass(playerEl, 'duel-block', 400);
      }
    }
  }

  // Float morale/stamina changes on player portrait
  const hudPortrait2 = document.querySelector('.hud-portrait') as HTMLElement | null;
  if (hudPortrait2) {
    const moraleDelta = Math.round(appState.state.player.morale - prevMorale);
    const staminaDelta = Math.round(appState.state.player.stamina - prevStamina);
    if (moraleDelta !== 0) {
      const cls = moraleDelta > 0 ? 'float-morale-gain' : 'float-morale-loss';
      const text = moraleDelta > 0 ? `+${moraleDelta} MR` : `${moraleDelta} MR`;
      spawnFloatingText(hudPortrait2, text, cls);
    }
    if (staminaDelta !== 0) {
      setTimeout(() => {
        if (hudPortrait2) {
          const text = staminaDelta > 0 ? `+${staminaDelta} ST` : `${staminaDelta} ST`;
          spawnFloatingText(hudPortrait2, text, 'float-stamina-change');
        }
      }, moraleDelta !== 0 ? 300 : 0);
    }
  }

  if (appState.state.player.morale < prevMorale - 10 && getScreenShakeEnabled()) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  appState.processing = false;
}
