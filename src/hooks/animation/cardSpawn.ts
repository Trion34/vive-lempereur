// Card lifecycle — finding, creating, spawning combatant cards

import type { CombatantSnapshot, MeleeState } from '../../types';
import { ENEMY_TYPE_NAMES } from '../../components/melee/CombatantCard';
import { makeFatigueRadial } from '../../utils/helpers';
import { statusIconHtml, spawnCenterText } from './effects';
import { wait } from './constants';

// --- DOM card finding ---

export function findSkirmishCard(name: string, side: string): HTMLElement | null {
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

// --- Card element creation ---

export function makeCombatantCardElement(
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

// --- Spawn arrivals ---

export async function spawnNewArrival(
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

export async function spawnNewAllyArrival(
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
