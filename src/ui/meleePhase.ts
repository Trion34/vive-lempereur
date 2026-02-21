import { appState, triggerRender } from './state';
import { $ } from './dom';
import {
  BattleState, BattlePhase, MeleeState, MeleeOpponent,
  MeleeStance, MeleeActionId, BodyPart, MoraleThreshold, ActionId, RoundAction, CombatantSnapshot,
  getMoraleThreshold, getHealthState, FatigueTier,
  getFatigueTier, getFatigueTierFill, getFatigueTierColor,
} from '../types';
import { advanceTurn, resolveMeleeRout, MeleeTurnInput } from '../core/battle';
import { getMeleeActions, calcHitChance, snapshotOf } from '../core/melee';
import { saveGame, loadGlory, addGlory } from '../core/persistence';
import { getScreenShakeEnabled } from '../settings';
import { playHitSound, playMissSound, playBlockSound, playMusketShotSound, playRicochetSound } from '../audio';

// --- Hotkey maps ---

const HOTKEY_MAP: Record<string, string> = {
  [MeleeActionId.BayonetThrust]: 'Q',
  [MeleeActionId.AggressiveLunge]: 'W',
  [MeleeActionId.ButtStrike]: 'E',
  [MeleeActionId.Feint]: 'R',
  [MeleeActionId.Shoot]: 'T',
  [MeleeActionId.Guard]: 'A',
  [MeleeActionId.Respite]: 'S',
  [MeleeActionId.SecondWind]: 'D',
  [MeleeActionId.Reload]: 'F',
  [MeleeActionId.UseCanteen]: '1',
};

const STANCE_HOTKEYS: Record<string, MeleeStance> = {
  '1': MeleeStance.Aggressive,
  '2': MeleeStance.Balanced,
  '3': MeleeStance.Defensive,
};

const BODY_PART_HOTKEYS: Record<string, BodyPart> = {
  '1': BodyPart.Head,
  '2': BodyPart.Torso,
  '3': BodyPart.Arms,
  '4': BodyPart.Legs,
};

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
  [MeleeActionId.UseCanteen]: 'DRINK CANTEEN',
};

export function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// --- Fatigue radial meter with expressive face SVG ---

function faceSvg(tier: FatigueTier): string {
  const head = `<circle cx="16" cy="16" r="11" stroke-width="1.8"/>`;
  switch (tier) {
    case FatigueTier.Fresh:
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <circle cx="12" cy="14" r="1.3" fill="currentColor"/>
        <circle cx="20" cy="14" r="1.3" fill="currentColor"/>
        <path d="M11 20 Q16 24 21 20" stroke-width="1.6"/>
      </svg>`;
    case FatigueTier.Winded:
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <line x1="10" y1="12" x2="14" y2="12.5" stroke-width="1.2"/>
        <circle cx="12" cy="14.5" r="1.2" fill="currentColor"/>
        <line x1="18" y1="12.5" x2="22" y2="12" stroke-width="1.2"/>
        <circle cx="20" cy="14.5" r="1.2" fill="currentColor"/>
        <line x1="12" y1="21" x2="20" y2="21" stroke-width="1.5"/>
      </svg>`;
    case FatigueTier.Fatigued:
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <line x1="9.5" y1="13" x2="14.5" y2="14" stroke-width="1.8"/>
        <circle cx="12" cy="15.5" r="1" fill="currentColor"/>
        <line x1="17.5" y1="14" x2="22.5" y2="13" stroke-width="1.8"/>
        <circle cx="20" cy="15.5" r="1" fill="currentColor"/>
        <path d="M12 22 Q16 19 20 22" stroke-width="1.5"/>
        <path d="M24 8 Q25 11 24 13" stroke-width="1" fill="currentColor" opacity="0.5"/>
      </svg>`;
    case FatigueTier.Exhausted:
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <line x1="10" y1="12" x2="14" y2="16" stroke-width="1.8"/>
        <line x1="14" y1="12" x2="10" y2="16" stroke-width="1.8"/>
        <line x1="18" y1="12" x2="22" y2="16" stroke-width="1.8"/>
        <line x1="22" y1="12" x2="18" y2="16" stroke-width="1.8"/>
        <ellipse cx="16" cy="22" rx="3.5" ry="2.5" stroke-width="1.5"/>
        <path d="M24 7 Q25.5 10 24 12.5" stroke-width="1" fill="currentColor" opacity="0.5"/>
        <path d="M26 10 Q27 12 26 14" stroke-width="0.8" fill="currentColor" opacity="0.4"/>
      </svg>`;
  }
}

/** Build a compact fatigue radial: pie fills within-tier, face snaps at boundary */
export function makeFatigueRadial(fatigue: number, maxFatigue: number, size: number = 44): string {
  const tier = getFatigueTier(fatigue, maxFatigue);
  const color = getFatigueTierColor(tier);
  const tierFill = getFatigueTierFill(fatigue, maxFatigue);
  const center = size / 2;
  const radius = (size / 2) - 5;
  const iconSize = radius * 1.2;
  const iconOffset = center - iconSize / 2;
  const tierLabel = tier.toUpperCase();
  const angle = (tierFill / 100) * 360;
  const pieSize = radius * 2;
  const pieOffset = center - radius;
  return `
    <div class="fatigue-radial-wrap" data-fatigue-radial>
      <div class="fatigue-pie" style="width:${pieSize}px;height:${pieSize}px;margin:${pieOffset}px;border-radius:50%;background:conic-gradient(from -90deg, ${color} 0deg ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg);transition:background 0.5s ease;"></div>
      <div class="fatigue-radial-icon" style="top:${iconOffset}px;left:${iconOffset}px;width:${iconSize}px;height:${iconSize}px;color:${color};">
        ${faceSvg(tier)}
      </div>
      <span class="fatigue-radial-tier" style="color:${color}">${tierLabel}</span>
    </div>`;
}

/** Get the art wrap element within a card for visual effects */
function getArtWrap(card: HTMLElement): HTMLElement {
  return (card.querySelector('.skirmish-card-art-wrap') as HTMLElement) || card;
}

/** Inject a status icon onto a card's art wrap if not already present */
function injectStatus(card: HTMLElement, type: string, tooltip: string) {
  const artWrap = getArtWrap(card);
  let statusesEl = artWrap.querySelector('.skirmish-card-statuses') as HTMLElement;
  if (!statusesEl) {
    statusesEl = document.createElement('div');
    statusesEl.className = 'skirmish-card-statuses';
    artWrap.appendChild(statusesEl);
  }
  if (!statusesEl.querySelector(`.${type}`)) {
    statusesEl.innerHTML += statusIcon(type, tooltip);
  }
}

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
  const playerEl = document.querySelector('.skirmish-card.is-player') as HTMLElement | null;
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

export function renderArena(skipCardRebuild = false) {
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

  // Portrait fatigue radial
  const portraitRadial = document.getElementById('portrait-fatigue-radial');
  if (portraitRadial) {
    portraitRadial.innerHTML = makeFatigueRadial(player.fatigue, player.maxFatigue, 48);
  }

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
  if (ms.playerRiposte) pTags.push('<span class="opp-status-tag" style="border-color:var(--health-high);color:var(--health-high)">RIPOSTE</span>');
  $('arena-player-statuses').innerHTML = pTags.join('');

  // Show field view
  const skirmishField = document.getElementById('skirmish-field');
  if (skirmishField) skirmishField.style.display = '';

  // Skip card rebuild when called after animation — cards are already correct
  // from the animation's refreshCardFromState final sync. Rebuilding them
  // causes a visible flash as cards are destroyed and recreated.
  if (!skipCardRebuild) {
    renderSkirmishField(ms, player);
  }

  // Arena actions
  renderArenaActions();
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
  if (!friendlyEl || !enemyEl) return;

  // Build set of combatants who guarded last round (from roundLog)
  const guardingNames = new Set<string>();
  for (const entry of ms.roundLog) {
    if (entry.action === MeleeActionId.Guard) guardingNames.add(entry.actorName);
  }

  friendlyEl.innerHTML = '';
  enemyEl.innerHTML = '';

  // Player card (bottom of friendly column)
  const playerCard = makeCombatantCard(
    player.name, player.alive, 'is-player',
    player.health, player.maxHealth, player.stamina, player.maxStamina,
    player.fatigue, player.maxFatigue,
    ms.playerStunned > 0, false, false, guardingNames.has(player.name),
  );
  friendlyEl.appendChild(playerCard);

  // Ally cards (inserted before player so they stack above)
  for (const ally of ms.allies) {
    if (!ally.alive || ally.health <= 0) continue;
    const allyCard = makeCombatantCard(
      ally.name, ally.alive, 'is-ally',
      ally.health, ally.maxHealth, ally.stamina, ally.maxStamina,
      ally.fatigue, ally.maxFatigue,
      ally.stunned, ally.armInjured, ally.legInjured, guardingNames.has(ally.name),
    );
    friendlyEl.insertBefore(allyCard, playerCard);
  }

  // Enemy cards
  for (const i of ms.activeEnemies) {
    const opp = ms.opponents[i];
    const defeated = opp.health <= 0 || isOppDefeated(opp);
    if (defeated) continue;
    const isTargeted = i === ms.playerTargetIndex;
    const displayName = ENEMY_TYPE_NAMES[opp.type] || opp.type;
    const card = makeCombatantCard(
      displayName, true, 'is-enemy',
      opp.health, opp.maxHealth, opp.stamina, opp.maxStamina,
      opp.fatigue, opp.maxFatigue,
      opp.stunned, opp.armInjured, opp.legInjured, guardingNames.has(opp.name),
      opp.name,
    );
    if (isTargeted) card.classList.add('is-targeted');
    card.dataset.oppIndex = String(i);
    card.classList.add('selectable-target');
    card.addEventListener('click', () => {
      if (appState.processing) return;
      ms.playerTargetIndex = i;
      renderSkirmishField(ms, player);
    });
    enemyEl.appendChild(card);
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
  return opp.health <= 0;
}

/** Combined combatant card: info panel (name + meters + statuses) above sprite art */
function makeCombatantCard(
  name: string, alive: boolean, sideClass: string,
  health: number, maxHealth: number, stamina: number, maxStamina: number,
  fatigue: number, maxFatigue: number,
  stunned: boolean, armInjured: boolean, legInjured: boolean, guarding: boolean,
  dataName?: string,
): HTMLDivElement {
  const card = document.createElement('div');
  card.className = `skirmish-card ${sideClass}`;
  card.dataset.combatantName = dataName || name;
  if (!alive || health <= 0) card.classList.add('is-dead');

  const shortName = name.split(' — ')[0];
  const artSrc = SKIRMISH_ART[sideClass] || '';
  const hpPct = Math.max(0, (health / maxHealth) * 100);
  const stPct = Math.max(0, (stamina / maxStamina) * 100);

  const tags: string[] = [];
  if (guarding) tags.push(statusIcon('guarding', 'Guarding \u2014 Braced for the next attack'));
  if (stunned) tags.push(statusIcon('stunned', 'Stunned \u2014 Cannot act this turn'));
  if (armInjured) tags.push(statusIcon('arm-injured', 'Arm Injured \u2014 Hit chance reduced'));
  if (legInjured) tags.push(statusIcon('leg-injured', 'Leg Injured \u2014 Stamina costs increased'));
  if (!alive || health <= 0) tags.push(statusIcon('dead', 'Dead'));

  card.innerHTML = `
    <div class="skirmish-card-name">${shortName}</div>
    <div class="skirmish-card-row">
      <div class="skirmish-card-sidebar">
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
        ${makeFatigueRadial(fatigue, maxFatigue, 40)}
      </div>
      <div class="skirmish-card-art-wrap">
        ${artSrc ? `<img src="${artSrc}" alt="${shortName}" class="skirmish-card-art">` : ''}
        ${tags.length > 0 ? `<div class="skirmish-card-statuses">${tags.join('')}</div>` : ''}
      </div>
    </div>
  `;
  return card;
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
  // Stance bar is rendered into .hud-actions (parent), actions into the grid
  const actionsEl = $('arena-actions');
  const grid = $('arena-actions-grid');

  // Clear both: stance bar lives outside the grid
  actionsEl.querySelectorAll('.stance-toggle-bar').forEach(el => el.remove());
  grid.innerHTML = '';
  if (appState.state.battleOver) return;

  const ms = appState.state.meleeState;
  if (!ms) return;

  // Stance toggle bar — pinned to top of .hud-actions
  const stanceBar = document.createElement('div');
  stanceBar.className = 'stance-toggle-bar';
  const stances: { id: MeleeStance; label: string; cls: string }[] = [
    { id: MeleeStance.Aggressive, label: 'Aggressive', cls: 'aggressive' },
    { id: MeleeStance.Balanced, label: 'Balanced', cls: 'balanced' },
    { id: MeleeStance.Defensive, label: 'Defensive', cls: 'defensive' },
  ];
  const stanceKeys = ['1', '2', '3'];
  for (let si = 0; si < stances.length; si++) {
    const s = stances[si];
    const btn = document.createElement('button');
    btn.className = `stance-toggle-btn ${s.cls}`;
    if (appState.meleeStance === s.id) btn.classList.add('active');
    const sBadge = appState.meleeHotkeysVisible
      ? `<kbd class="hotkey-badge">${stanceKeys[si]}</kbd>` : '';
    btn.innerHTML = `${s.label}${sBadge}`;
    btn.addEventListener('click', () => {
      appState.meleeStance = s.id;
      renderArenaActions();
    });
    stanceBar.appendChild(btn);
  }
  actionsEl.insertBefore(stanceBar, grid);

  // --- Helper: create a labeled row of buttons ---
  function makeRow(buttons: HTMLElement[]): HTMLElement {
    const row = document.createElement('div');
    row.className = 'action-row';
    for (const b of buttons) row.appendChild(b);
    return row;
  }

  // --- Helper: create an action button ---
  function makeActionBtn(action: { id: MeleeActionId; label: string; available: boolean }, style: string, immediate: boolean): HTMLElement {
    const btn = document.createElement('button');
    btn.className = `action-btn melee-flat ${style}`;
    if (!action.available) {
      btn.style.opacity = '0.4';
      btn.style.pointerEvents = 'none';
    }
    const hotkey = HOTKEY_MAP[action.id];
    const badgeHtml = hotkey && appState.meleeHotkeysVisible
      ? `<kbd class="hotkey-badge">${hotkey}</kbd>` : '';
    btn.innerHTML = `<span class="action-name">${action.label}</span>${badgeHtml}`;
    btn.addEventListener('click', () => {
      if (immediate) {
        handleMeleeAction(action.id);
      } else {
        appState.meleeSelectedAction = action.id;
        ms!.selectingTarget = true;
        renderArenaActions();
      }
    });
    return btn;
  }

  // Body part selection (Step 2 of attack flow)
  if (ms.selectingTarget && appState.meleeSelectedAction) {
    const backBtn = document.createElement('button');
    backBtn.className = 'action-btn action-back';
    const backBadge = appState.meleeHotkeysVisible ? `<kbd class="hotkey-badge">Esc</kbd>` : '';
    backBtn.innerHTML = `<span class="action-name">\u2190 Back</span>${backBadge}`;
    backBtn.addEventListener('click', () => {
      appState.meleeSelectedAction = null;
      ms.selectingTarget = false;
      renderArenaActions();
    });
    grid.appendChild(backBtn);

    const targets = document.createElement('div');
    targets.className = 'body-target-grid';

    const pl = appState.state.player;
    const selectedAction = appState.meleeSelectedAction!;
    const hitFor = (bp: BodyPart) => {
      const skill = selectedAction === MeleeActionId.Shoot ? pl.musketry : pl.elan;
      const pct = calcHitChance(
        skill, pl.morale, pl.maxMorale,
        appState.meleeStance, selectedAction, bp,
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

    const bpKeys = ['1', '2', '3', '4'];
    for (let pi = 0; pi < parts.length; pi++) {
      const p = parts[pi];
      const pct = hitFor(p.id);
      const btn = document.createElement('button');
      btn.className = 'body-target-btn';
      const effectHtml = p.effect ? `<span class="body-target-effect">${p.effect}</span>` : '';
      const bpBadge = appState.meleeHotkeysVisible ? `<kbd class="hotkey-badge">${bpKeys[pi]}</kbd>` : '';
      btn.innerHTML = `<span class="body-target-label">${p.label}</span>${bpBadge}<span class="body-target-hit">${pct}%</span>${effectHtml}`;
      btn.addEventListener('click', () => {
        handleMeleeAction(appState.meleeSelectedAction!, p.id);
      });
      targets.appendChild(btn);
    }
    grid.appendChild(targets);
    return;
  }

  // Inventory sub-panel (consumable items)
  if (appState.meleeShowingInventory) {
    const backBtn = document.createElement('button');
    backBtn.className = 'action-btn action-back';
    const invBackBadge = appState.meleeHotkeysVisible ? `<kbd class="hotkey-badge">Esc</kbd>` : '';
    backBtn.innerHTML = `<span class="action-name">\u2190 Back</span>${invBackBadge}`;
    backBtn.addEventListener('click', () => {
      appState.meleeShowingInventory = false;
      renderArenaActions();
    });
    grid.appendChild(backBtn);

    const label = document.createElement('div');
    label.className = 'melee-step-label';
    label.textContent = 'Items';
    grid.appendChild(label);

    const canteenLeft = 3 - appState.state.player.canteenUses;
    const canteenBtn = document.createElement('button');
    canteenBtn.className = 'action-btn melee-flat melee-item';
    if (canteenLeft <= 0) {
      canteenBtn.style.opacity = '0.4';
      canteenBtn.style.pointerEvents = 'none';
    }
    const canteenBadge = appState.meleeHotkeysVisible ? `<kbd class="hotkey-badge">1</kbd>` : '';
    canteenBtn.innerHTML = `<span class="action-name">Drink Canteen (${canteenLeft} left)</span>${canteenBadge}<span class="action-desc">Restore health. Opponent gets a free attack.</span>`;
    canteenBtn.addEventListener('click', () => {
      appState.meleeShowingInventory = false;
      handleMeleeAction(MeleeActionId.UseCanteen);
    });
    grid.appendChild(canteenBtn);
    return;
  }

  // === Grouped action rows ===
  const actions = getMeleeActions(appState.state);
  const byId = (id: MeleeActionId) => actions.find(a => a.id === id);

  // Row 1: Attacks (red)
  const attackBtns: HTMLElement[] = [];
  const shoot = byId(MeleeActionId.Shoot);
  if (shoot) attackBtns.push(makeActionBtn(shoot, 'melee-attack', false));
  const thrust = byId(MeleeActionId.BayonetThrust);
  if (thrust) attackBtns.push(makeActionBtn(thrust, 'melee-attack', false));
  const lunge = byId(MeleeActionId.AggressiveLunge);
  if (lunge) attackBtns.push(makeActionBtn(lunge, 'melee-attack', false));
  const butt = byId(MeleeActionId.ButtStrike);
  if (butt) attackBtns.push(makeActionBtn(butt, 'melee-attack', true));
  const feint = byId(MeleeActionId.Feint);
  if (feint) attackBtns.push(makeActionBtn(feint, 'melee-attack', true));
  if (attackBtns.length) grid.appendChild(makeRow(attackBtns));

  // Row 2: Defense & Recovery (blue + gold)
  const defBtns: HTMLElement[] = [];
  const guard = byId(MeleeActionId.Guard);
  if (guard) defBtns.push(makeActionBtn(guard, 'melee-defense', true));
  const respite = byId(MeleeActionId.Respite);
  if (respite) defBtns.push(makeActionBtn(respite, 'melee-utility', true));
  const sw = byId(MeleeActionId.SecondWind);
  if (sw) defBtns.push(makeActionBtn(sw, 'melee-utility', true));
  const reload = byId(MeleeActionId.Reload);
  if (reload) defBtns.push(makeActionBtn(reload, 'melee-utility', true));
  if (defBtns.length) grid.appendChild(makeRow(defBtns));

  // Row 3: Inventory (tan)
  const invBtn = document.createElement('button');
  invBtn.className = 'action-btn melee-flat melee-item';
  const invBadge = appState.meleeHotkeysVisible ? `<kbd class="hotkey-badge">I</kbd>` : '';
  invBtn.innerHTML = `<span class="action-name">Inventory</span>${invBadge}`;
  invBtn.addEventListener('click', () => {
    appState.meleeShowingInventory = true;
    renderArenaActions();
  });
  grid.appendChild(makeRow([invBtn]));

  // Flee option at Breaking morale
  if (appState.state.player.moraleThreshold === MoraleThreshold.Breaking) {
    const fleeBtn = document.createElement('button');
    fleeBtn.className = 'action-btn fumble-action';
    const fleeBadge = appState.meleeHotkeysVisible ? `<kbd class="hotkey-badge">X</kbd>` : '';
    fleeBtn.innerHTML = `
      <span class="action-name">Flee</span>${fleeBadge}
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

  await handleSkirmishAction(action, bodyPart);
}

async function handleSkirmishAction(action: MeleeActionId, bodyPart?: BodyPart) {
  appState.processing = true;
  appState.meleeShowingInventory = false;
  const ms = appState.state.meleeState!;
  const prevMorale = appState.state.player.morale;
  const prevStamina = appState.state.player.stamina;
  const prevPhase = appState.state.phase;
  const prevReloadProgress = ms.reloadProgress;

  // Snapshot all combatant meters before resolution — used to set initial
  // animation state. Per-action snapshots on RoundAction handle progressive updates.
  const preRoundSnapshot = new Map<string, { snap: CombatantSnapshot, side: string }>();
  const p = appState.state.player;
  preRoundSnapshot.set(p.name, { snap: snapshotOf(p), side: 'player' });
  for (const opp of ms.opponents) {
    preRoundSnapshot.set(opp.name, { snap: snapshotOf(opp), side: 'enemy' });
  }
  for (const ally of ms.allies) {
    preRoundSnapshot.set(ally.name, { snap: snapshotOf(ally), side: 'ally' });
  }

  // Resolve via advanceTurn (which dispatches to resolveMeleeRound)
  const input: MeleeTurnInput = {
    action, bodyPart, stance: appState.meleeStance,
    targetIndex: ms.playerTargetIndex,
  };
  appState.state = advanceTurn(appState.state, ActionId.Fire, input);
  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);

  const meleeEnded = prevPhase === 'melee' && (appState.state.phase !== 'melee' || appState.state.battleOver);

  appState.meleeSelectedAction = null;

  // Show reload animation above player sprite before the round cascade
  if (action === MeleeActionId.Reload) {
    const isSecondHalf = prevReloadProgress === 1;
    await showMeleeReloadAnimation(isSecondHalf);
  }

  // Animate round log as rapid cascade with real-time meter updates
  const roundLog = appState.state.meleeState?.roundLog || [];
  if (roundLog.length > 0) {
    await animateSkirmishRound(roundLog, preRoundSnapshot);
  }

  // Check melee end AFTER animations complete so player sees the final blow
  if (meleeEnded) {
    // Update the arena display before any popups so kills counter and action
    // picker reflect the final state (clears stale body-part picker, updates kills)
    renderArena();

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
    // Full render for phase transition (melee → story beat, battle over, etc.)
    triggerRender();
  } else {
    // Normal round — update header, player HUD, and action grid without
    // destroying/recreating skirmish cards. The animation's refreshCardFromState
    // already set all card meters to their correct post-resolution values.
    renderArena(true);
  }

  // Float aggregate meter changes on player sprite
  const playerSprite = findSkirmishCard(appState.state.player.name, 'player');
  if (playerSprite) {
    const playerArt = getArtWrap(playerSprite);
    const moraleDelta = Math.round(appState.state.player.morale - prevMorale);
    const staminaDelta = Math.round(appState.state.player.stamina - prevStamina);
    if (moraleDelta !== 0) {
      const cls = moraleDelta > 0 ? 'float-morale-gain' : 'float-morale-loss';
      const text = moraleDelta > 0 ? `+${moraleDelta} MR` : `${moraleDelta} MR`;
      spawnFloatingText(playerArt, text, cls);
    }
    if (staminaDelta !== 0) {
      setTimeout(() => {
        const text = staminaDelta > 0 ? `+${staminaDelta} ST` : `${staminaDelta} ST`;
        spawnFloatingText(playerArt, text, 'float-stamina-change');
      }, moraleDelta !== 0 ? 300 : 0);
    }
  }

  if (appState.state.player.morale < prevMorale - 10 && getScreenShakeEnabled()) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  appState.processing = false;
}

/** Spawn a card for a mid-round backfill combatant with entrance animation */
async function spawnNewArrival(name: string, side: string, snapshot?: CombatantSnapshot): Promise<HTMLElement | null> {
  const ms = appState.state.meleeState;
  if (!ms) return null;

  const container = side === 'enemy'
    ? document.getElementById('skirmish-enemy')
    : document.getElementById('skirmish-friendly');
  if (!container) return null;

  // Find opponent data to get type and injury flags
  const opp = ms.opponents.find(o => o.name === name);
  if (!opp) return null;

  const displayName = ENEMY_TYPE_NAMES[opp.type] || opp.type;
  const hp = snapshot?.health ?? opp.health;
  const maxHp = snapshot?.maxHealth ?? opp.maxHealth;
  const st = snapshot?.stamina ?? opp.stamina;
  const maxSt = snapshot?.maxStamina ?? opp.maxStamina;
  const fat = snapshot?.fatigue ?? opp.fatigue;
  const maxFat = snapshot?.maxFatigue ?? opp.maxFatigue;

  const card = makeCombatantCard(
    displayName, true, 'is-enemy',
    hp, maxHp, st, maxSt, fat, maxFat,
    opp.stunned, opp.armInjured, opp.legInjured, false,
    opp.name,
  );

  // Announce arrival
  const field = document.getElementById('skirmish-field');
  if (field) {
    const shortName = name.split(' — ')[0];
    spawnCenterText(field, `${shortName.toUpperCase()} JOINS THE FIGHT`, 'center-text-miss');
    await wait(1000);
  }

  // Add with entrance animation
  card.classList.add('enemy-entering');
  container.appendChild(card);
  card.addEventListener('animationend', () => card.classList.remove('enemy-entering'), { once: true });
  await wait(800);

  return card;
}

/** Spawn a card for a mid-round ally arrival with entrance animation */
async function spawnNewAllyArrival(name: string, narrative?: string, snapshot?: CombatantSnapshot): Promise<HTMLElement | null> {
  const ms = appState.state.meleeState;
  if (!ms) return null;

  const container = document.getElementById('skirmish-friendly');
  if (!container) return null;

  const ally = ms.allies.find(a => a.name === name);
  if (!ally) return null;

  const hp = snapshot?.health ?? ally.health;
  const maxHp = snapshot?.maxHealth ?? ally.maxHealth;
  const st = snapshot?.stamina ?? ally.stamina;
  const maxSt = snapshot?.maxStamina ?? ally.maxStamina;
  const fat = snapshot?.fatigue ?? ally.fatigue;
  const maxFat = snapshot?.maxFatigue ?? ally.maxFatigue;

  const card = makeCombatantCard(
    ally.name, ally.alive, 'is-ally',
    hp, maxHp, st, maxSt, fat, maxFat,
    ally.stunned, ally.armInjured, ally.legInjured, false,
    ally.name,
  );

  // Announce arrival
  const field = document.getElementById('skirmish-field');
  if (field) {
    spawnCenterText(field, `${name.toUpperCase()} JOINS THE FIGHT`, 'center-text-hit');
    await wait(1000);
  }

  // Insert before player card (allies stack above player)
  const playerCard = container.querySelector('.skirmish-card.is-player');
  card.classList.add('enemy-entering');
  if (playerCard) {
    container.insertBefore(card, playerCard);
  } else {
    container.appendChild(card);
  }
  card.addEventListener('animationend', () => card.classList.remove('enemy-entering'), { once: true });
  await wait(800);

  return card;
}

/** Infer target side from context (legacy fallback for old saves without targetSide) */
function inferTargetSide(entry: RoundAction, preRoundSnapshot: Map<string, { snap: CombatantSnapshot, side: string }>): string {
  if (entry.actorSide === 'player' || entry.actorSide === 'ally') return 'enemy';
  const preSnap = preRoundSnapshot.get(entry.targetName);
  return preSnap?.side || 'player';
}

async function animateSkirmishRound(roundLog: RoundAction[], preRoundSnapshot: Map<string, { snap: CombatantSnapshot, side: string }>) {
  const field = document.getElementById('skirmish-field');
  if (!field) return;

  // Clear guarding icons from all cards at the start of a new round
  field.querySelectorAll('.opp-status-tag.guarding').forEach(el => el.remove());

  // Set all meters to pre-round state before animation begins
  for (const [name, { snap, side }] of preRoundSnapshot) {
    updateMetersFromSnapshot(name, side, snap);
  }

  for (const entry of roundLog) {
    const eventType = entry.eventType || 'action'; // save compat

    // ---- ARRIVAL: spawn combatant card with entrance animation ----
    if (eventType === 'arrival') {
      if (entry.actorSide === 'enemy') {
        await spawnNewArrival(entry.actorName, 'enemy', entry.actorAfter);
      } else if (entry.actorSide === 'ally') {
        await spawnNewAllyArrival(entry.actorName, entry.narrative, entry.actorAfter);
      }
      continue;
    }

    // ---- DEFEAT: animate departure ----
    if (eventType === 'defeat') {
      const card = findSkirmishCard(entry.actorName, entry.actorSide);
      if (card) {
        if (entry.narrative) {
          spawnCenterText(field, entry.narrative.toUpperCase(), 'center-text-miss');
          await wait(800);
        }
        card.classList.add('enemy-departing');
        await wait(1000);
        card.remove();
      }
      continue;
    }

    // ---- NORMAL ACTION ----
    // Defensive cleanup: strip any lingering glow/surge from cards
    field.querySelectorAll('.skirmish-glow-attacker, .skirmish-glow-target, .skirmish-surge').forEach(el =>
      el.classList.remove('skirmish-glow-attacker', 'skirmish-glow-target', 'skirmish-surge'));

    let actorCard = findSkirmishCard(entry.actorName, entry.actorSide);

    // Legacy fallback: if enemy actor has no card, spawn (old saves without arrival events)
    if (!actorCard && entry.actorSide === 'enemy') {
      actorCard = await spawnNewArrival(entry.actorName, 'enemy', entry.actorAfter);
    }

    // Use explicit targetSide, fallback to inference for old saves
    const targetSide = entry.targetSide || inferTargetSide(entry, preRoundSnapshot);
    let targetCard = findSkirmishCard(entry.targetName, targetSide);

    // Legacy fallback: if enemy target has no card, spawn (old saves without arrival events)
    if (!targetCard && targetSide === 'enemy') {
      targetCard = await spawnNewArrival(entry.targetName, 'enemy', entry.targetAfter);
    }

    const isAttack = entry.action !== MeleeActionId.Guard &&
                     entry.action !== MeleeActionId.Respite &&
                     entry.action !== MeleeActionId.Reload && entry.action !== MeleeActionId.SecondWind &&
                     entry.action !== MeleeActionId.UseCanteen;

    // === DELIBERATION: brief pause as combatant picks action ===
    await wait(500);

    if (!isAttack) {
      const actorShort = entry.actorName.split(' — ')[0];
      let label = 'guards';
      if (entry.action === MeleeActionId.Respite) label = 'catches breath';
      if (entry.action === MeleeActionId.Reload) label = 'reloads';
      if (entry.action === MeleeActionId.SecondWind) label = 'finds second wind';
      if (entry.action === MeleeActionId.UseCanteen) label = 'drinks from canteen';
      if (entry.action === MeleeActionId.Guard) {
        playBlockSound();
        if (actorCard) injectStatus(actorCard, 'guarding', 'Guarding \u2014 Braced for the next attack');
      }
      if (actorCard) actorCard.classList.add('skirmish-glow-attacker');
      spawnCenterText(field, `${actorShort} ${label}`, 'center-text-neutral');
      await wait(1000);

      // Result text for recovery actions (like HIT/MISS for attacks)
      if (entry.action === MeleeActionId.Respite) {
        spawnCenterText(field, 'CATCH BREATH', 'center-text-hit');
      } else if (entry.action === MeleeActionId.SecondWind) {
        if (entry.hit) {
          spawnCenterText(field, 'SECOND WIND — SUCCESS', 'center-text-hit');
        } else {
          spawnCenterText(field, 'SECOND WIND — FAILED', 'center-text-miss');
        }
      } else if (entry.action === MeleeActionId.UseCanteen) {
        spawnCenterText(field, 'DRINK CANTEEN', 'center-text-hit');
        if (actorCard && entry.damage > 0) {
          spawnFloatingText(getArtWrap(actorCard), `+${Math.round(entry.damage)} HP`, 'float-heal');
        }
      }
      if (entry.action === MeleeActionId.Respite || entry.action === MeleeActionId.SecondWind || entry.action === MeleeActionId.UseCanteen) {
        await wait(1200);
      }

      // Update actor meters from per-action snapshot
      if (entry.actorAfter) {
        updateMetersFromSnapshot(entry.actorName, entry.actorSide, entry.actorAfter);
      }

      if (actorCard) actorCard.classList.remove('skirmish-glow-attacker');
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
    const actionName = ACTION_DISPLAY_NAMES[entry.action] || entry.action;
    const bodyPartLabel = entry.bodyPart ? entry.bodyPart : '';
    spawnCenterActionText(field, actionName, bodyPartLabel);
    await wait(1200);

    // === RESULT PHASE ===
    if (entry.hit) {
      spawnCenterText(field, 'HIT', 'center-text-hit');
      if (entry.action === MeleeActionId.Shoot) playMusketShotSound();
      else playHitSound();
      // HP damage: slash + floating damage + meter update
      if (entry.damage > 0 && targetCard) {
        const targetArt = getArtWrap(targetCard);
        spawnSlash(targetArt);
        spawnFloatingText(targetArt, `-${Math.round(entry.damage)}`, 'float-damage');
      }
      // Status effects: inject icon + float text
      if (entry.special && targetCard) {
        const special = entry.special.toUpperCase();
        if (special.includes('STUN')) injectStatus(targetCard, 'stunned', 'Stunned \u2014 Cannot act this turn');
        if (special.includes('ARM')) injectStatus(targetCard, 'arm-injured', 'Arm Injured \u2014 Hit chance reduced');
        if (special.includes('LEG')) injectStatus(targetCard, 'leg-injured', 'Leg Injured \u2014 Stamina costs increased');
        const statusText = entry.special.trim().replace('.', '').replace('!', '').toUpperCase();
        setTimeout(() => {
          if (targetCard) spawnFloatingText(getArtWrap(targetCard), statusText, statusText === 'KILLED' ? 'float-defeated' : 'float-status');
        }, 500);
      }
    } else if (entry.blocked) {
      spawnCenterText(field, 'BLOCKED', 'center-text-block');
      playBlockSound();
      if (targetCard) spawnFloatingText(getArtWrap(targetCard), 'BLOCKED', 'float-block');
    } else {
      spawnCenterText(field, 'MISS', 'center-text-miss');
      if (entry.action === MeleeActionId.Shoot) playRicochetSound();
      else playMissSound();
    }
    await wait(1200);

    // Update both actor and target meters from per-action snapshots
    if (entry.targetAfter) {
      updateMetersFromSnapshot(entry.targetName, targetSide, entry.targetAfter);
    }
    if (entry.actorAfter) {
      updateMetersFromSnapshot(entry.actorName, entry.actorSide, entry.actorAfter);
    }

    // === DEATH DEPARTURE: legacy fallback for old saves without explicit defeat events ===
    if (entry.targetKilled && targetCard &&
        !roundLog.some(e => e.eventType === 'defeat' && e.actorName === entry.targetName)) {
      targetCard.classList.add('enemy-departing');
      await wait(1000);
      targetCard.remove();
    }

    // === CLEAR: breathing room before next action ===
    if (actorCard) actorCard.classList.remove('skirmish-glow-attacker', 'skirmish-surge');
    if (targetCard) targetCard.classList.remove('skirmish-glow-target');
    await wait(600);
  }

  // Final sync: update all combatants to actual live state after the full cascade
  for (const [name, { side }] of preRoundSnapshot) {
    refreshCardFromState(name, side);
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
  const friendlyEl = document.getElementById('skirmish-friendly');
  const enemyEl = document.getElementById('skirmish-enemy');

  const container = (side === 'player' || side === 'ally') ? friendlyEl : enemyEl;
  if (container) {
    const cards = container.querySelectorAll('.skirmish-card');
    // Try exact match on full combatant name first
    for (const card of cards) {
      const el = card as HTMLElement;
      if ((el.dataset.combatantName || '') === name) return el;
    }
    // Fallback: match on personal name (before ' — ') for allies/player
    const shortName = name.split(' — ')[0];
    for (const card of cards) {
      const el = card as HTMLElement;
      const cardName = (el.dataset.combatantName || '').split(' — ')[0];
      if (cardName === shortName) return el;
    }
  }
  // Last resort: search both sides by full name
  const allCards = document.querySelectorAll('.skirmish-card');
  for (const card of allCards) {
    const el = card as HTMLElement;
    if ((el.dataset.combatantName || '') === name) return el;
  }
  return null;
}

/** Update all meters for a combatant from a CombatantSnapshot */
function updateMetersFromSnapshot(name: string, side: string, snap: CombatantSnapshot) {
  updateHudMeter(name, side, snap.health, snap.maxHealth, snap.stamina, snap.maxStamina);
  updateFatigueRadial(name, side, snap.fatigue, snap.maxFatigue);
  if (side === 'player' && snap.morale !== undefined && snap.maxMorale !== undefined) {
    updateBottomHud({
      health: snap.health, maxHealth: snap.maxHealth,
      stamina: snap.stamina, maxStamina: snap.maxStamina,
      morale: snap.morale, maxMorale: snap.maxMorale,
      fatigue: snap.fatigue, maxFatigue: snap.maxFatigue,
    });
  }
}

/** Refresh a combatant's card meters from the live battle state */
function refreshCardFromState(name: string, side: string) {
  const ms = appState.state.meleeState;
  if (!ms) return;
  const p = appState.state.player;

  if (side === 'player' && name === p.name) {
    updateHudMeter(name, side, p.health, p.maxHealth, p.stamina, p.maxStamina);
    updateFatigueRadial(name, side, p.fatigue, p.maxFatigue);
    updateBottomHud(p);
    return;
  }
  if (side === 'ally') {
    const ally = ms.allies.find(a => a.name === name);
    if (ally) {
      updateHudMeter(name, side, ally.health, ally.maxHealth, ally.stamina, ally.maxStamina);
      updateFatigueRadial(name, side, ally.fatigue, ally.maxFatigue);
    }
    return;
  }
  const opp = ms.opponents.find(o => o.name === name);
  if (opp) {
    updateHudMeter(name, side, opp.health, opp.maxHealth, opp.stamina, opp.maxStamina);
    updateFatigueRadial(name, side, opp.fatigue, opp.maxFatigue);
  }
}

/** Update the bottom portrait HUD meters (HP/ST/MR) and fatigue radial in real-time during animation */
function updateBottomHud(p: { health: number; maxHealth: number; stamina: number; maxStamina: number; morale: number; maxMorale: number; fatigue: number; maxFatigue: number }) {
  const hpPct = Math.max(0, (p.health / p.maxHealth) * 100);
  const stPct = Math.max(0, (p.stamina / p.maxStamina) * 100);
  const mrPct = Math.max(0, (p.morale / p.maxMorale) * 100);
  const hpBar = $('arena-player-hp-bar') as HTMLElement;
  const stBar = $('arena-player-ft-bar') as HTMLElement;
  const mrBar = $('arena-player-mr-bar') as HTMLElement;
  if (hpBar) { hpBar.style.width = `${hpPct}%`; hpBar.style.transition = 'width 0.4s ease'; }
  if (stBar) { stBar.style.width = `${stPct}%`; stBar.style.transition = 'width 0.4s ease'; }
  if (mrBar) { mrBar.style.width = `${mrPct}%`; mrBar.style.transition = 'width 0.4s ease'; }
  const hpVal = document.getElementById('arena-player-hp-val');
  const stVal = document.getElementById('arena-player-ft-val');
  const mrVal = document.getElementById('arena-player-mr-val');
  if (hpVal) hpVal.textContent = `${Math.max(0, Math.round(p.health))}`;
  if (stVal) stVal.textContent = `${Math.round(p.stamina)}`;
  if (mrVal) mrVal.textContent = `${Math.round(p.morale)}`;
  // Update portrait fatigue radial
  const portraitRadial = document.getElementById('portrait-fatigue-radial');
  if (portraitRadial) {
    portraitRadial.innerHTML = makeFatigueRadial(p.fatigue, p.maxFatigue, 48);
  }
}

/** Update a combatant's fatigue radial on their sprite card */
function updateFatigueRadial(name: string, side: string, fatigue: number, maxFatigue: number) {
  const card = findSkirmishCard(name, side);
  if (!card) return;
  const radialWrap = card.querySelector('[data-fatigue-radial]');
  if (radialWrap && radialWrap.parentElement) {
    const container = radialWrap.parentElement;
    const newRadial = document.createElement('div');
    newRadial.innerHTML = makeFatigueRadial(fatigue, maxFatigue, 40);
    const newWrap = newRadial.querySelector('[data-fatigue-radial]');
    if (newWrap) container.replaceChild(newWrap, radialWrap);
  }
}

/** Update a combatant's HP (and optionally stamina) bar in real-time during animation */
function updateHudMeter(name: string, side: string, hp: number, maxHp: number, stamina?: number, maxStamina?: number) {
  const card = findSkirmishCard(name, side);
  if (!card) return;
  const meters = card.querySelectorAll('.skirmish-hud-meter');
  // HP is meter[0]
  const hpMeter = meters[0];
  if (hpMeter) {
    const hpFill = hpMeter.querySelector('.health-fill') as HTMLElement | null;
    const hpVal = hpMeter.querySelector('.skirmish-hud-val') as HTMLElement | null;
    if (hpFill) {
      hpFill.style.width = `${Math.max(0, (hp / maxHp) * 100)}%`;
      hpFill.style.transition = 'width 0.4s ease';
    }
    if (hpVal) hpVal.textContent = `${Math.max(0, Math.round(hp))}`;
  }
  // ST is meter[1]
  if (stamina !== undefined && maxStamina !== undefined && meters[1]) {
    const stFill = meters[1].querySelector('.stamina-fill') as HTMLElement | null;
    const stVal = meters[1].querySelector('.skirmish-hud-val') as HTMLElement | null;
    if (stFill) {
      stFill.style.width = `${Math.max(0, (stamina / maxStamina) * 100)}%`;
      stFill.style.transition = 'width 0.4s ease';
    }
    if (stVal) stVal.textContent = `${Math.round(stamina)}`;
  }
}

// --- Melee Hotkeys ---

function handleMeleeHotkey(e: KeyboardEvent) {
  // Only fire during melee phase
  if (!appState.state || appState.state.phase !== BattlePhase.Melee) return;
  if (appState.processing || appState.state.battleOver) return;

  // Don't intercept when typing in an input
  const tag = (document.activeElement?.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

  const ms = appState.state.meleeState;
  if (!ms) return;

  const key = e.key.toUpperCase();

  // --- Body part picker active ---
  if (ms.selectingTarget && appState.meleeSelectedAction) {
    const bodyPart = BODY_PART_HOTKEYS[key];
    if (bodyPart) {
      e.preventDefault();
      handleMeleeAction(appState.meleeSelectedAction, bodyPart);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      appState.meleeSelectedAction = null;
      ms.selectingTarget = false;
      renderArenaActions();
      return;
    }
    return; // swallow other keys while picker is open
  }

  // --- Inventory panel active ---
  if (appState.meleeShowingInventory) {
    if (key === '1') {
      const canteenLeft = 3 - appState.state.player.canteenUses;
      if (canteenLeft > 0) {
        e.preventDefault();
        appState.meleeShowingInventory = false;
        handleMeleeAction(MeleeActionId.UseCanteen);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      appState.meleeShowingInventory = false;
      renderArenaActions();
      return;
    }
    return;
  }

  // --- Main view: stances (number row) ---
  const stance = STANCE_HOTKEYS[key];
  if (stance) {
    e.preventDefault();
    appState.meleeStance = stance;
    renderArenaActions();
    return;
  }

  // --- Main view: actions (letter keys) ---
  const actions = getMeleeActions(appState.state);
  const byId = (id: MeleeActionId) => actions.find(a => a.id === id);

  // Map key to action id
  const keyToAction: Record<string, MeleeActionId> = {
    'Q': MeleeActionId.BayonetThrust,
    'W': MeleeActionId.AggressiveLunge,
    'E': MeleeActionId.ButtStrike,
    'R': MeleeActionId.Feint,
    'T': MeleeActionId.Shoot,
    'A': MeleeActionId.Guard,
    'S': MeleeActionId.Respite,
    'D': MeleeActionId.SecondWind,
    'F': MeleeActionId.Reload,
  };

  const actionId = keyToAction[key];
  if (actionId) {
    const action = byId(actionId);
    if (!action || !action.available) return;
    e.preventDefault();

    // Actions that need body part picker
    const needsTarget = actionId === MeleeActionId.BayonetThrust ||
                         actionId === MeleeActionId.AggressiveLunge ||
                         actionId === MeleeActionId.Shoot;
    if (needsTarget) {
      appState.meleeSelectedAction = actionId;
      ms.selectingTarget = true;
      renderArenaActions();
    } else {
      handleMeleeAction(actionId);
    }
    return;
  }

  // --- Inventory ---
  if (key === 'I') {
    e.preventDefault();
    appState.meleeShowingInventory = true;
    renderArenaActions();
    return;
  }

  // --- Flee ---
  if (key === 'X' && appState.state.player.moraleThreshold === MoraleThreshold.Breaking) {
    e.preventDefault();
    appState.processing = true;
    appState.state = resolveMeleeRout(appState.state);
    appState.gameState.battleState = appState.state;
    triggerRender();
    appState.processing = false;
    return;
  }
}

/** Wire up the hotkey toggle button and global keydown listener. Call once from init. */
export function initMeleeHotkeys() {
  const btn = document.getElementById('btn-hotkeys');
  if (btn) {
    btn.addEventListener('click', () => {
      appState.meleeHotkeysVisible = !appState.meleeHotkeysVisible;
      btn.classList.toggle('active', appState.meleeHotkeysVisible);
      // Re-render actions if we're in melee
      if (appState.state?.phase === BattlePhase.Melee && appState.state.meleeState) {
        renderArenaActions();
      }
    });
  }
  document.addEventListener('keydown', handleMeleeHotkey);
}


