import { useCallback, useRef } from 'react';
import type {
  RoundAction,
  CombatantSnapshot,
  MeleeState,
  BattleState,
  MeleeOpponent,
} from '../types';
import { MeleeActionId } from '../types';
import { ENEMY_TYPE_NAMES } from '../components/melee/CombatantCard';
import { makeFatigueRadial } from '../utils/helpers';
import {
  playHitSound,
  playMissSound,
  playBlockSound,
  playMusketShotSound,
  playRicochetSound,
} from '../audio';

// --- Utility helpers ---

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function getArtWrap(card: HTMLElement): HTMLElement {
  return (card.querySelector('.skirmish-card-art-wrap') as HTMLElement) || card;
}

function spawnFloatingText(targetEl: HTMLElement, text: string, cssClass: string) {
  const floater = document.createElement('div');
  floater.className = `floating-text ${cssClass}`;
  floater.textContent = text;
  targetEl.appendChild(floater);
  floater.addEventListener('animationend', () => floater.remove());
}

function spawnSlash(targetEl: HTMLElement) {
  const slash = document.createElement('div');
  slash.className = 'slash-overlay';
  targetEl.appendChild(slash);
  slash.addEventListener('animationend', () => slash.remove());
}

function spawnCenterText(field: HTMLElement, text: string, cssClass: string) {
  const el = document.createElement('div');
  el.className = `skirmish-center-text ${cssClass}`;
  el.textContent = text;
  field.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function spawnCenterActionText(field: HTMLElement, action: string, bodyPart: string) {
  const el = document.createElement('div');
  el.className = 'skirmish-center-text center-text-action';
  el.innerHTML = `<span class="center-action-name">${action}</span>${bodyPart ? `<span class="center-action-target">${bodyPart}</span>` : ''}`;
  field.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function injectStatus(card: HTMLElement, type: string, tooltip: string) {
  const artWrap = getArtWrap(card);
  let statusesEl = artWrap.querySelector('.skirmish-card-statuses') as HTMLElement;
  if (!statusesEl) {
    statusesEl = document.createElement('div');
    statusesEl.className = 'skirmish-card-statuses';
    artWrap.appendChild(statusesEl);
  }
  if (!statusesEl.querySelector(`.${type}`)) {
    statusesEl.innerHTML += statusIconHtml(type, tooltip);
  }
}

function statusIconHtml(type: string, tooltip: string): string {
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
    guarding: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="2" y1="14" x2="14" y2="2"/>
      <line x1="14" y1="14" x2="2" y2="2"/>
      <line x1="1" y1="13" x2="4" y2="13"/><line x1="12" y1="13" x2="15" y2="13"/>
      <line x1="1" y1="3" x2="4" y2="3"/><line x1="12" y1="3" x2="15" y2="3"/>
    </svg>`,
  };
  return `<span class="opp-status-tag ${type}" data-tooltip="${tooltip}">${svgs[type] || ''}</span>`;
}

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

const LOAD_STEP_LABELS = ['Bite cartridge', 'Pour powder', 'Ram ball', 'Prime pan'];

// --- DOM card finding ---

function findSkirmishCard(name: string, side: string): HTMLElement | null {
  const friendlyEl = document.getElementById('skirmish-friendly');
  const enemyEl = document.getElementById('skirmish-enemy');

  const container = side === 'player' || side === 'ally' ? friendlyEl : enemyEl;
  if (container) {
    const cards = container.querySelectorAll('.skirmish-card');
    for (const card of cards) {
      const el = card as HTMLElement;
      if ((el.dataset.combatantName || '') === name) return el;
    }
    const shortName = name.split(' \u2014 ')[0];
    for (const card of cards) {
      const el = card as HTMLElement;
      const cardName = (el.dataset.combatantName || '').split(' \u2014 ')[0];
      if (cardName === shortName) return el;
    }
  }
  const allCards = document.querySelectorAll('.skirmish-card');
  for (const card of allCards) {
    const el = card as HTMLElement;
    if ((el.dataset.combatantName || '') === name) return el;
  }
  return null;
}

// --- Meter updates on cards ---

function updateHudMeter(
  name: string,
  side: string,
  hp: number,
  maxHp: number,
  stamina?: number,
  maxStamina?: number,
) {
  const card = findSkirmishCard(name, side);
  if (!card) return;
  const meters = card.querySelectorAll('.skirmish-hud-meter');
  const hpMeter = meters[0];
  if (hpMeter) {
    const hpFill = hpMeter.querySelector('.health-fill') as HTMLElement | null;
    const hpVal = hpMeter.querySelector('.skirmish-hud-val') as HTMLElement | null;
    if (hpFill) hpFill.style.width = `${Math.max(0, (hp / maxHp) * 100)}%`;
    if (hpVal) hpVal.textContent = `${Math.max(0, Math.round(hp))}`;
  }
  if (stamina !== undefined && maxStamina !== undefined && meters[1]) {
    const stFill = meters[1].querySelector('.stamina-fill') as HTMLElement | null;
    const stVal = meters[1].querySelector('.skirmish-hud-val') as HTMLElement | null;
    if (stFill) stFill.style.width = `${Math.max(0, (stamina / maxStamina) * 100)}%`;
    if (stVal) stVal.textContent = `${Math.round(stamina)}`;
  }
}

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

function updateBottomHud(p: {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  morale: number;
  maxMorale: number;
  fatigue: number;
  maxFatigue: number;
}) {
  const hpPct = Math.max(0, (p.health / p.maxHealth) * 100);
  const stPct = Math.max(0, (p.stamina / p.maxStamina) * 100);
  const mrPct = Math.max(0, (p.morale / p.maxMorale) * 100);
  const hpBar = document.getElementById('arena-player-hp-bar') as HTMLElement | null;
  const stBar = document.getElementById('arena-player-ft-bar') as HTMLElement | null;
  const mrBar = document.getElementById('arena-player-mr-bar') as HTMLElement | null;
  if (hpBar) {
    hpBar.style.width = `${hpPct}%`;
    hpBar.style.transition = 'width 0.4s ease';
  }
  if (stBar) {
    stBar.style.width = `${stPct}%`;
    stBar.style.transition = 'width 0.4s ease';
  }
  if (mrBar) {
    mrBar.style.width = `${mrPct}%`;
    mrBar.style.transition = 'width 0.4s ease';
  }
  const hpVal = document.getElementById('arena-player-hp-val');
  const stVal = document.getElementById('arena-player-ft-val');
  const mrVal = document.getElementById('arena-player-mr-val');
  if (hpVal) hpVal.textContent = `${Math.max(0, Math.round(p.health))}`;
  if (stVal) stVal.textContent = `${Math.round(p.stamina)}`;
  if (mrVal) mrVal.textContent = `${Math.round(p.morale)}`;
  const portraitRadial = document.getElementById('portrait-fatigue-radial');
  if (portraitRadial) {
    portraitRadial.innerHTML = makeFatigueRadial(p.fatigue, p.maxFatigue, 48);
  }
}

function updateMetersFromSnapshot(name: string, side: string, snap: CombatantSnapshot) {
  updateHudMeter(name, side, snap.health, snap.maxHealth, snap.stamina, snap.maxStamina);
  updateFatigueRadial(name, side, snap.fatigue, snap.maxFatigue);
  if (side === 'player' && snap.morale !== undefined && snap.maxMorale !== undefined) {
    updateBottomHud({
      health: snap.health,
      maxHealth: snap.maxHealth,
      stamina: snap.stamina,
      maxStamina: snap.maxStamina,
      morale: snap.morale,
      maxMorale: snap.maxMorale,
      fatigue: snap.fatigue,
      maxFatigue: snap.maxFatigue,
    });
  }
}

function refreshCardFromState(name: string, side: string, battleState: BattleState) {
  const ms = battleState.meleeState;
  if (!ms) return;
  const p = battleState.player;

  if (side === 'player' && name === p.name) {
    updateHudMeter(name, side, p.health, p.maxHealth, p.stamina, p.maxStamina);
    updateFatigueRadial(name, side, p.fatigue, p.maxFatigue);
    updateBottomHud(p);
    return;
  }
  if (side === 'ally') {
    const ally = ms.allies.find((a) => a.name === name);
    if (ally) {
      updateHudMeter(name, side, ally.health, ally.maxHealth, ally.stamina, ally.maxStamina);
      updateFatigueRadial(name, side, ally.fatigue, ally.maxFatigue);
    }
    return;
  }
  const opp = ms.opponents.find((o) => o.name === name);
  if (opp) {
    updateHudMeter(name, side, opp.health, opp.maxHealth, opp.stamina, opp.maxStamina);
    updateFatigueRadial(name, side, opp.fatigue, opp.maxFatigue);
  }
}

function inferTargetSide(
  entry: RoundAction,
  preRoundSnapshot: Map<string, { snap: CombatantSnapshot; side: string }>,
): string {
  if (entry.actorSide === 'player' || entry.actorSide === 'ally') return 'enemy';
  const preSnap = preRoundSnapshot.get(entry.targetName);
  return preSnap?.side || 'player';
}

// --- Spawn helpers for arrivals/departures ---

function makeCombatantCardElement(
  name: string,
  alive: boolean,
  sideClass: string,
  health: number,
  maxHealth: number,
  stamina: number,
  maxStamina: number,
  fatigue: number,
  maxFatigue: number,
  stunned: boolean,
  armInjured: boolean,
  legInjured: boolean,
  guarding: boolean,
  dataName?: string,
): HTMLDivElement {
  const card = document.createElement('div');
  card.className = `skirmish-card ${sideClass}`;
  card.dataset.combatantName = dataName || name;
  if (!alive || health <= 0) card.classList.add('is-dead');

  const shortName = name.split(' \u2014 ')[0];
  const SKIRMISH_ART: Record<string, string> = {
    'is-player': '/assets/player-french.png',
    'is-ally': '/assets/ally-french.png',
    'is-enemy': '/assets/enemy-austrian.png',
  };
  const artSrc = SKIRMISH_ART[sideClass] || '';
  const hpPct = Math.max(0, (health / maxHealth) * 100);
  const stPct = Math.max(0, (stamina / maxStamina) * 100);

  const tags: string[] = [];
  if (guarding) tags.push(statusIconHtml('guarding', 'Guarding \u2014 Braced for the next attack'));
  if (stunned) tags.push(statusIconHtml('stunned', 'Stunned \u2014 Cannot act this turn'));
  if (armInjured) tags.push(statusIconHtml('arm-injured', 'Arm Injured \u2014 Hit chance reduced'));
  if (legInjured) tags.push(statusIconHtml('leg-injured', 'Leg Injured \u2014 Stamina costs increased'));
  if (!alive || health <= 0) tags.push(statusIconHtml('dead', 'Dead'));

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

async function spawnNewArrival(
  name: string,
  side: string,
  ms: MeleeState,
  snapshot?: CombatantSnapshot,
): Promise<HTMLElement | null> {
  const container =
    side === 'enemy'
      ? document.getElementById('skirmish-enemy')
      : document.getElementById('skirmish-friendly');
  if (!container) return null;

  const opp = ms.opponents.find((o) => o.name === name);
  if (!opp) return null;

  const displayName = ENEMY_TYPE_NAMES[opp.type] || opp.type;
  const hp = snapshot?.health ?? opp.health;
  const maxHp = snapshot?.maxHealth ?? opp.maxHealth;
  const st = snapshot?.stamina ?? opp.stamina;
  const maxSt = snapshot?.maxStamina ?? opp.maxStamina;
  const fat = snapshot?.fatigue ?? opp.fatigue;
  const maxFat = snapshot?.maxFatigue ?? opp.maxFatigue;

  const card = makeCombatantCardElement(
    displayName, true, 'is-enemy',
    hp, maxHp, st, maxSt, fat, maxFat,
    opp.stunned, opp.armInjured, opp.legInjured, false, opp.name,
  );

  const field = document.getElementById('skirmish-field');
  if (field) {
    const shortName = name.split(' \u2014 ')[0];
    spawnCenterText(field, `${shortName.toUpperCase()} JOINS THE FIGHT`, 'center-text-miss');
    await wait(1000);
  }

  card.classList.add('enemy-entering');
  container.appendChild(card);
  card.addEventListener('animationend', () => card.classList.remove('enemy-entering'), { once: true });
  await wait(800);
  return card;
}

async function spawnNewAllyArrival(
  name: string,
  ms: MeleeState,
  narrative?: string,
  snapshot?: CombatantSnapshot,
): Promise<HTMLElement | null> {
  const container = document.getElementById('skirmish-friendly');
  if (!container) return null;

  const ally = ms.allies.find((a) => a.name === name);
  if (!ally) return null;

  const hp = snapshot?.health ?? ally.health;
  const maxHp = snapshot?.maxHealth ?? ally.maxHealth;
  const st = snapshot?.stamina ?? ally.stamina;
  const maxSt = snapshot?.maxStamina ?? ally.maxStamina;
  const fat = snapshot?.fatigue ?? ally.fatigue;
  const maxFat = snapshot?.maxFatigue ?? ally.maxFatigue;

  const card = makeCombatantCardElement(
    ally.name, ally.alive, 'is-ally',
    hp, maxHp, st, maxSt, fat, maxFat,
    ally.stunned, ally.armInjured, ally.legInjured, false, ally.name,
  );

  const field = document.getElementById('skirmish-field');
  if (field) {
    spawnCenterText(field, `${name.toUpperCase()} JOINS THE FIGHT`, 'center-text-hit');
    await wait(1000);
  }

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

// --- Reload animation ---

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

// ============================================================
// The main animation hook
// ============================================================

export function useMeleeAnimation() {
  const animatingRef = useRef(false);

  /**
   * Animate a full round's worth of combat log entries.
   * This manipulates the DOM imperatively for performance.
   */
  const animateSkirmishRound = useCallback(async (
    roundLog: RoundAction[],
    preRoundSnapshot: Map<string, { snap: CombatantSnapshot; side: string }>,
    battleState: BattleState,
  ) => {
    const field = document.getElementById('skirmish-field');
    if (!field) return;

    const ms = battleState.meleeState;
    if (!ms) return;

    animatingRef.current = true;

    // Clear guarding icons from all cards at the start of a new round
    field.querySelectorAll('.opp-status-tag.guarding').forEach((el) => el.remove());

    // Strip ALL transitions from fill bars BEFORE reset
    const allFills = field.querySelectorAll('.skirmish-hud-fill') as NodeListOf<HTMLElement>;
    for (const fill of allFills) fill.style.transition = 'none';

    // Set all meters to pre-round state before animation begins
    for (const [name, { snap, side }] of preRoundSnapshot) {
      updateMetersFromSnapshot(name, side, snap);
    }
    // Force reflow, then enable smooth transitions
    void field.offsetHeight;
    for (const fill of allFills) fill.style.transition = 'width 0.4s ease';

    for (const entry of roundLog) {
      const eventType = entry.eventType || 'action';

      // ---- ARRIVAL ----
      if (eventType === 'arrival') {
        if (entry.actorSide === 'enemy') {
          await spawnNewArrival(entry.actorName, 'enemy', ms, entry.actorAfter);
        } else if (entry.actorSide === 'ally') {
          await spawnNewAllyArrival(entry.actorName, ms, entry.narrative, entry.actorAfter);
        }
        continue;
      }

      // ---- DEFEAT ----
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
      field
        .querySelectorAll('.skirmish-glow-attacker, .skirmish-glow-target, .skirmish-surge')
        .forEach((el) =>
          el.classList.remove('skirmish-glow-attacker', 'skirmish-glow-target', 'skirmish-surge'),
        );

      let actorCard = findSkirmishCard(entry.actorName, entry.actorSide);
      if (!actorCard && entry.actorSide === 'enemy') {
        actorCard = await spawnNewArrival(entry.actorName, 'enemy', ms, entry.actorAfter);
      }

      const targetSide = entry.targetSide || inferTargetSide(entry, preRoundSnapshot);
      let targetCard = findSkirmishCard(entry.targetName, targetSide);
      if (!targetCard && targetSide === 'enemy') {
        targetCard = await spawnNewArrival(entry.targetName, 'enemy', ms, entry.targetAfter);
      }

      const isAttack =
        entry.action !== MeleeActionId.Guard &&
        entry.action !== MeleeActionId.Respite &&
        entry.action !== MeleeActionId.Reload &&
        entry.action !== MeleeActionId.SecondWind &&
        entry.action !== MeleeActionId.UseCanteen;

      // DELIBERATION
      await wait(500);

      if (!isAttack) {
        const actorShort = entry.actorName.split(' \u2014 ')[0];
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

        if (entry.action === MeleeActionId.Respite) {
          spawnCenterText(field, 'CATCH BREATH', 'center-text-hit');
        } else if (entry.action === MeleeActionId.SecondWind) {
          if (entry.hit) {
            spawnCenterText(field, 'SECOND WIND \u2014 SUCCESS', 'center-text-hit');
          } else {
            spawnCenterText(field, 'SECOND WIND \u2014 FAILED', 'center-text-miss');
          }
        } else if (entry.action === MeleeActionId.UseCanteen) {
          spawnCenterText(field, 'DRINK CANTEEN', 'center-text-hit');
          if (actorCard && entry.damage > 0) {
            spawnFloatingText(getArtWrap(actorCard), `+${Math.round(entry.damage)} HP`, 'float-heal');
          }
        }
        if (
          entry.action === MeleeActionId.Respite ||
          entry.action === MeleeActionId.SecondWind ||
          entry.action === MeleeActionId.UseCanteen
        ) {
          await wait(1200);
        }

        if (entry.actorAfter) {
          updateMetersFromSnapshot(entry.actorName, entry.actorSide, entry.actorAfter);
        }

        if (actorCard) actorCard.classList.remove('skirmish-glow-attacker');
        await wait(400);
        continue;
      }

      // === GLOW PHASE ===
      if (actorCard) {
        actorCard.classList.add('skirmish-glow-attacker');
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
        if (entry.damage > 0 && targetCard) {
          const targetArt = getArtWrap(targetCard);
          spawnSlash(targetArt);
          spawnFloatingText(targetArt, `-${Math.round(entry.damage)}`, 'float-damage');
        }
        if (entry.special && targetCard) {
          const special = entry.special.toUpperCase();
          if (special.includes('STUN'))
            injectStatus(targetCard, 'stunned', 'Stunned \u2014 Cannot act this turn');
          if (special.includes('ARM'))
            injectStatus(targetCard, 'arm-injured', 'Arm Injured \u2014 Hit chance reduced');
          if (special.includes('LEG'))
            injectStatus(targetCard, 'leg-injured', 'Leg Injured \u2014 Stamina costs increased');
          const statusText = entry.special.trim().replace('.', '').replace('!', '').toUpperCase();
          setTimeout(() => {
            if (targetCard)
              spawnFloatingText(
                getArtWrap(targetCard),
                statusText,
                statusText === 'KILLED' ? 'float-defeated' : 'float-status',
              );
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

      if (entry.targetAfter) {
        updateMetersFromSnapshot(entry.targetName, targetSide, entry.targetAfter);
      }
      if (entry.actorAfter) {
        updateMetersFromSnapshot(entry.actorName, entry.actorSide, entry.actorAfter);
      }

      // Legacy death departure
      if (
        entry.targetKilled &&
        targetCard &&
        !roundLog.some((e) => e.eventType === 'defeat' && e.actorName === entry.targetName)
      ) {
        targetCard.classList.add('enemy-departing');
        await wait(1000);
        targetCard.remove();
      }

      // Clear
      if (actorCard) actorCard.classList.remove('skirmish-glow-attacker', 'skirmish-surge');
      if (targetCard) targetCard.classList.remove('skirmish-glow-target');
      await wait(600);
    }

    // Final sync: strip transitions and refresh all live combatants
    const syncField = document.getElementById('skirmish-field');
    if (syncField) {
      const syncFills = syncField.querySelectorAll('.skirmish-hud-fill') as NodeListOf<HTMLElement>;
      for (const fill of syncFills) fill.style.transition = 'none';
    }
    if (ms) {
      refreshCardFromState(battleState.player.name, 'player', battleState);
      for (const ally of ms.allies) {
        if (ally.alive && ally.health > 0) refreshCardFromState(ally.name, 'ally', battleState);
      }
      for (const idx of ms.activeEnemies) {
        const opp = ms.opponents[idx];
        if (opp.health > 0) refreshCardFromState(opp.name, 'enemy', battleState);
      }
    }

    animatingRef.current = false;
  }, []);

  /**
   * Show reload animation before the round cascade.
   */
  const animateReload = useCallback(async (isSecondHalf: boolean) => {
    await showMeleeReloadAnimation(isSecondHalf);
  }, []);

  /**
   * Float aggregate meter changes on player sprite.
   */
  const floatPlayerDeltas = useCallback((
    playerName: string,
    moraleDelta: number,
    staminaDelta: number,
  ) => {
    const playerSprite = findSkirmishCard(playerName, 'player');
    if (!playerSprite) return;
    const playerArt = getArtWrap(playerSprite);

    if (moraleDelta !== 0) {
      const cls = moraleDelta > 0 ? 'float-morale-gain' : 'float-morale-loss';
      const text = moraleDelta > 0 ? `+${moraleDelta} MR` : `${moraleDelta} MR`;
      spawnFloatingText(playerArt, text, cls);
    }
    if (staminaDelta !== 0) {
      setTimeout(
        () => {
          const text = staminaDelta > 0 ? `+${staminaDelta} ST` : `${staminaDelta} ST`;
          spawnFloatingText(playerArt, text, 'float-stamina-change');
        },
        moraleDelta !== 0 ? 300 : 0,
      );
    }
  }, []);

  return {
    animateSkirmishRound,
    animateReload,
    floatPlayerDeltas,
    animatingRef,
  };
}
