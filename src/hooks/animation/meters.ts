// HUD meter updates — imperative DOM manipulation

import type { CombatantSnapshot, BattleState } from '../../types';
import { makeFatigueRadial } from '../../utils/helpers';
import { findSkirmishCard } from './cardSpawn';

export function updateHudMeter(
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

export function updateFatigueRadial(name: string, side: string, fatigue: number, maxFatigue: number) {
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

export function updateBottomHud(p: {
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

export function updateMetersFromSnapshot(name: string, side: string, snap: CombatantSnapshot) {
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

export function refreshCardFromState(name: string, side: string, battleState: BattleState) {
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
