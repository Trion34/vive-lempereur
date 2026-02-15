import { appState, triggerRender } from './state';
import { $ } from './dom';
import {
  BattleState, MeleeStance, MeleeActionId, BodyPart, MoraleThreshold, ActionId,
  getMoraleThreshold, getHealthState, getStaminaState,
} from '../types';
import { advanceTurn, resolveMeleeRout, MeleeTurnInput } from '../core/battle';
import { getMeleeActions } from '../core/melee';
import { saveGame, loadGlory, addGlory } from '../core/persistence';

const ATTACK_ACTIONS = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike, MeleeActionId.Shoot];
const DEFENSE_ACTIONS = [MeleeActionId.Guard, MeleeActionId.Dodge];

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
  appState.state.player.staminaState = getStaminaState(appState.state.player.stamina, appState.state.player.maxStamina);
  // Reset death flags
  appState.state.player.alive = true;
  appState.state.battleOver = false;
  appState.state.outcome = 'pending';
  appState.gameState.battleState = appState.state;
  saveGame(appState.gameState);
  return true;
}

export function renderArena() {
  const ms = appState.state.meleeState;
  if (!ms) return;
  const { player } = appState.state;
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
      appState.meleeActionCategory = 'attack';
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
        handleMeleeAction(appState.meleeSelectedAction!, p.id);
      });
      targets.appendChild(btn);
    }
    grid.appendChild(targets);
    return;
  }

  // Action selection -- two-tier category system
  const actions = getMeleeActions(appState.state);
  const attackIds = [MeleeActionId.BayonetThrust, MeleeActionId.AggressiveLunge, MeleeActionId.ButtStrike];
  const defendIds = [MeleeActionId.Guard, MeleeActionId.Dodge];
  const tacticsIds = [MeleeActionId.Feint, MeleeActionId.Respite, MeleeActionId.Shoot];
  const immediateIds = [MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Feint, MeleeActionId.Respite, MeleeActionId.Shoot];

  const attacks = actions.filter(a => attackIds.includes(a.id));
  const defends = actions.filter(a => defendIds.includes(a.id));
  const tactics = actions.filter(a => tacticsIds.includes(a.id));

  if (appState.meleeActionCategory === 'top') {
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
        appState.meleeActionCategory = cat.id;
        renderArenaActions();
      });
      grid.appendChild(btn);
    }
  } else {
    // Sub-actions within a category
    const categoryActions =
      appState.meleeActionCategory === 'attack' ? attacks :
      appState.meleeActionCategory === 'defend' ? defends : tactics;

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'action-btn action-back';
    backBtn.innerHTML = `<span class="action-name">\u2190 Back</span>`;
    backBtn.addEventListener('click', () => {
      appState.meleeActionCategory = 'top';
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
          appState.meleeSelectedAction = action.id;
          ms.selectingTarget = true;
          renderArenaActions();
        }
      });
      grid.appendChild(btn);
    }
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
  appState.processing = true;

  const prevMorale = appState.state.player.morale;
  const prevPlayerHp = appState.state.player.health;
  const prevOppIdx = appState.state.meleeState ? appState.state.meleeState.currentOpponent : 0;
  const prevOppHp = appState.state.meleeState ? appState.state.meleeState.opponents[prevOppIdx].health : 0;
  const prevOppStunned = appState.state.meleeState ? appState.state.meleeState.opponents[prevOppIdx].stunned : false;
  const prevPhase = appState.state.phase;

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
  appState.meleeActionCategory = 'top';

  const ms = appState.state.meleeState;
  const prevOpp = ms ? ms.opponents[prevOppIdx] : null;
  const oppDmg = prevOpp ? prevOppHp - prevOpp.health : 0;
  const playerDmg = prevPlayerHp - appState.state.player.health;
  const oppTransitioned = ms ? ms.currentOpponent !== prevOppIdx : false;

  // === OPPONENT TRANSITION SEQUENCE ===
  if (oppTransitioned && ms) {
    const oppEl = document.getElementById('duel-opponent');

    if (oppDmg > 0 && oppEl) {
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
    const breakPct = prevOpp.type === 'conscript' ? 0.30 : prevOpp.type === 'line' ? 0.20 : 0;
    const oppNowDefeated = prevOpp.health <= 0 ||
      (breakPct > 0 && prevOpp.health / prevOpp.maxHealth <= breakPct);

    // --- Phase 1: Player's attack result ---
    if (oppDmg > 0 && oppEl) {
      flashClass(oppEl, 'duel-hit', 400);
      spawnSlash(oppEl);
      spawnFloatingText(oppEl, `-${oppDmg}`, 'float-damage');
      if (prevOpp.stunned && !prevOppStunned) {
        setTimeout(() => spawnFloatingText(oppEl, 'STUNNED', 'float-status'), 300);
      }
    }

    // --- Player missed ---
    if (ATTACK_ACTIONS.includes(action) && oppDmg <= 0 && !oppNowDefeated && oppEl) {
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
      spawnFloatingText(playerEl, 'MISS', 'float-miss');
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
  }

  if (appState.state.player.morale < prevMorale - 10) {
    $('game')?.classList.add('shake');
    setTimeout(() => $('game')?.classList.remove('shake'), 300);
  }

  appState.processing = false;
}
