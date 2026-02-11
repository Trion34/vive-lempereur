import {
  GameState, GamePhase, BattlePhase, BattleState, DrillStep,
  MoraleThreshold, HealthState, FatigueState,
  getMoraleThreshold, getHealthState, getFatigueState,
} from './types';
import { getVolume, setVolume, isMuted, toggleMute } from './music';
import { createMeleeState } from './core/melee';
import { transitionToCamp, transitionToBattle, createBattleFromCharacter } from './core/gameLoop';
import { getScriptedAvailableActions, VOLLEY_RANGES } from './core/scriptedVolleys';

const $ = (id: string) => document.getElementById(id)!;

type GetState = () => GameState;
type SetState = (gs: GameState) => void;
type Rerender = () => void;
type Reset = () => void;

let getState: GetState;
let setState: SetState;
let rerender: Rerender;
let resetGame: Reset;
let activeTab = 'jump';
let initialized = false;

export function initDevTools(
  _getState: GetState,
  _setState: SetState,
  _rerender: Rerender,
  _reset: Reset,
) {
  getState = _getState;
  setState = _setState;
  rerender = _rerender;
  resetGame = _reset;

  if (initialized) return;
  initialized = true;

  // Toggle button
  $('btn-devtools').addEventListener('click', () => {
    const overlay = $('dev-overlay');
    overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
    if (overlay.style.display === 'flex') renderDevPanel();
  });

  $('btn-dev-close').addEventListener('click', () => {
    $('dev-overlay').style.display = 'none';
  });

  // Close on backdrop click
  $('dev-overlay').addEventListener('click', (e) => {
    if (e.target === $('dev-overlay')) $('dev-overlay').style.display = 'none';
  });

  // Keyboard shortcut: backtick toggles dev tools
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const overlay = $('dev-overlay');
      overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
      if (overlay.style.display === 'flex') renderDevPanel();
    }
  });
}

function renderDevPanel() {
  renderTabs();
  renderTabContent();
}

function renderTabs() {
  const tabs = $('dev-tabs');
  tabs.innerHTML = '';
  const tabDefs = [
    { id: 'jump', label: 'Jump' },
    { id: 'player', label: 'Player' },
    { id: 'battle', label: 'Battle' },
    { id: 'actions', label: 'Actions' },
    { id: 'audio', label: 'Audio' },
  ];
  for (const t of tabDefs) {
    const btn = document.createElement('button');
    btn.className = `dev-tab${activeTab === t.id ? ' active' : ''}`;
    btn.textContent = t.label;
    btn.addEventListener('click', () => {
      activeTab = t.id;
      renderDevPanel();
    });
    tabs.appendChild(btn);
  }
}

function renderTabContent() {
  const content = $('dev-content');
  content.innerHTML = '';
  switch (activeTab) {
    case 'jump': renderJumpTab(content); break;
    case 'player': renderPlayerTab(content); break;
    case 'battle': renderBattleTab(content); break;
    case 'actions': renderActionsTab(content); break;
    case 'audio': renderAudioTab(content); break;
  }
}

// ===== Helpers =====

function section(parent: HTMLElement, label: string) {
  const el = document.createElement('div');
  el.className = 'dev-section';
  el.textContent = label;
  parent.appendChild(el);
}

function row(parent: HTMLElement, label: string, content: HTMLElement | string) {
  const r = document.createElement('div');
  r.className = 'dev-row';
  const lbl = document.createElement('span');
  lbl.className = 'dev-label';
  lbl.textContent = label;
  r.appendChild(lbl);
  if (typeof content === 'string') {
    const val = document.createElement('span');
    val.className = 'dev-val';
    val.textContent = content;
    r.appendChild(val);
  } else {
    r.appendChild(content);
  }
  parent.appendChild(r);
}

function badge(text: string): HTMLElement {
  const el = document.createElement('span');
  el.className = 'dev-state-badge';
  el.textContent = text;
  return el;
}

function actionBtn(label: string, cls: string, onClick: () => void): HTMLElement {
  const btn = document.createElement('button');
  btn.className = `dev-action-btn ${cls}`;
  btn.textContent = label;
  btn.addEventListener('click', () => {
    onClick();
    renderDevPanel();
  });
  return btn;
}

function numberInput(value: number, min: number, max: number, onChange: (v: number) => void): HTMLElement {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '6px';
  wrap.style.flex = '1';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'dev-slider';
  slider.min = String(min);
  slider.max = String(max);
  slider.value = String(Math.round(value));

  const num = document.createElement('input');
  num.type = 'number';
  num.className = 'dev-input';
  num.min = String(min);
  num.max = String(max);
  num.value = String(Math.round(value));

  slider.addEventListener('input', () => {
    num.value = slider.value;
    onChange(Number(slider.value));
    rerender();
  });
  num.addEventListener('change', () => {
    const v = Math.max(min, Math.min(max, Number(num.value)));
    slider.value = String(v);
    onChange(v);
    rerender();
  });

  wrap.appendChild(slider);
  wrap.appendChild(num);
  return wrap;
}

function checkbox(checked: boolean, onChange: (v: boolean) => void): HTMLElement {
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.className = 'dev-checkbox';
  cb.checked = checked;
  cb.addEventListener('change', () => {
    onChange(cb.checked);
    rerender();
  });
  return cb;
}

function updatePlayerMeters(bs: BattleState) {
  bs.player.moraleThreshold = getMoraleThreshold(bs.player.morale, bs.player.maxMorale);
  bs.player.healthState = getHealthState(bs.player.health, bs.player.maxHealth);
  bs.player.fatigueState = getFatigueState(bs.player.fatigue, bs.player.maxFatigue);
}

function ensureBattle(): BattleState | null {
  const gs = getState();
  if (gs.phase !== GamePhase.Battle || !gs.battleState) return null;
  return gs.battleState;
}

// ===== TAB 1: JUMP =====

function renderJumpTab(parent: HTMLElement) {
  const gs = getState();

  // Current state display
  section(parent, 'Current State');
  row(parent, 'Game Phase', badge(gs.phase));
  if (gs.phase === GamePhase.Battle && gs.battleState) {
    const bs = gs.battleState;
    row(parent, 'Battle Phase', badge(bs.phase));
    if (bs.phase === BattlePhase.Line) row(parent, 'Volley', badge(`${bs.scriptedVolley} / 4`));
    if (bs.phase === BattlePhase.StoryBeat) row(parent, 'Story Beat', badge('Battery Choice'));
    if (bs.phase === BattlePhase.Melee && bs.meleeState) row(parent, 'Exchange', badge(`${bs.meleeState.exchangeCount} / ${bs.meleeState.maxExchanges}`));
    row(parent, 'Turn', badge(String(bs.turn)));
    row(parent, 'Outcome', badge(bs.outcome));
  }
  if (gs.phase === GamePhase.Camp && gs.campState) {
    row(parent, 'Day', badge(`${gs.campState.day} / ${gs.campState.maxDays}`));
    row(parent, 'Activities Left', badge(String(gs.campState.activitiesRemaining)));
    row(parent, 'Pending Event', badge(gs.campState.pendingEvent ? 'YES' : 'No'));
  }

  // Battle phase jumps
  section(parent, 'Jump to Battle Phase');
  const grid1 = document.createElement('div');
  grid1.className = 'dev-btn-group';

  for (let v = 1; v <= 4; v++) {
    grid1.appendChild(actionBtn(`Line — V${v}`, '', () => jumpToVolley(v)));
  }
  for (let e = 1; e <= 3; e++) {
    grid1.appendChild(actionBtn(`Charge — E${e}`, '', () => jumpToCharge(e)));
  }
  grid1.appendChild(actionBtn('Melee — Round 1', '', () => jumpToMelee()));
  parent.appendChild(grid1);

  // Camp jumps
  section(parent, 'Jump to Camp');
  const grid2 = document.createElement('div');
  grid2.className = 'dev-btn-group';
  for (let d = 1; d <= 3; d++) {
    grid2.appendChild(actionBtn(`Camp — Day ${d}`, '', () => jumpToCamp(d)));
  }
  parent.appendChild(grid2);

  // Battle over
  section(parent, 'Force Battle Outcome');
  const grid3 = document.createElement('div');
  grid3.className = 'dev-btn-group';
  for (const outcome of ['victory', 'cavalry_victory', 'survived', 'rout', 'defeat'] as const) {
    const cls = outcome === 'defeat' || outcome === 'rout' ? 'danger' : 'success';
    grid3.appendChild(actionBtn(outcome.replace('_', ' '), cls, () => forceBattleEnd(outcome)));
  }
  parent.appendChild(grid3);
}

function jumpToVolley(volley: number) {
  const gs = getState();
  // Create a fresh battle if not in battle
  if (gs.phase !== GamePhase.Battle || !gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
    gs.campState = undefined;
  }
  const bs = gs.battleState!;
  bs.phase = BattlePhase.Line;
  bs.scriptedVolley = volley;
  bs.drillStep = DrillStep.Present;
  bs.turn = (volley - 1) * 3 + 1;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = VOLLEY_RANGES[volley - 1];
  bs.availableActions = getScriptedAvailableActions(bs);
  bs.log.push({ turn: bs.turn, text: `[DEV] Jumped to Volley ${volley}`, type: 'narrative' });
  setState(gs);
  rerender();
}

function jumpToCharge(encounter: number) {
  const gs = getState();
  if (gs.phase !== GamePhase.Battle || !gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
    gs.campState = undefined;
  }
  const bs = gs.battleState!;
  bs.phase = BattlePhase.StoryBeat;
  bs.chargeEncounter = 1;
  bs.scriptedVolley = 0;
  bs.turn = 13;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = 0;
  bs.enemy.morale = 'charging';
  bs.meleeStage = 1;
  bs.log.push({ turn: bs.turn, text: `[DEV] Jumped to Story Beat (Battery Choice)`, type: 'narrative' });
  setState(gs);
  rerender();
}

function jumpToMelee() {
  const gs = getState();
  if (gs.phase !== GamePhase.Battle || !gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
    gs.campState = undefined;
  }
  const bs = gs.battleState!;
  bs.phase = BattlePhase.Melee;
  bs.scriptedVolley = 0;
  bs.chargeEncounter = 3;
  bs.turn = 16;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = 0;
  bs.meleeState = createMeleeState(bs);
  bs.log.push({ turn: bs.turn, text: '[DEV] Jumped to Melee', type: 'narrative' });
  setState(gs);
  rerender();
}

function jumpToCamp(day: number) {
  const gs = getState();
  // Need a battle to transition from
  if (!gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
  }
  gs.battleState!.battleOver = true;
  gs.battleState!.outcome = 'victory';
  transitionToCamp(gs);
  // Advance to requested day
  const camp = gs.campState!;
  while (camp.day < day && camp.day < camp.maxDays) {
    camp.day++;
    camp.activitiesRemaining = camp.activitiesPerDay;
    camp.completedActivities = [];
  }
  camp.log.push({ day: camp.day, text: `[DEV] Jumped to Camp Day ${day}`, type: 'narrative' });
  setState(gs);
  rerender();
}

function forceBattleEnd(outcome: string) {
  const gs = getState();
  if (gs.phase !== GamePhase.Battle || !gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
    gs.campState = undefined;
  }
  gs.battleState!.battleOver = true;
  gs.battleState!.outcome = outcome as any;
  gs.battleState!.log.push({ turn: gs.battleState!.turn, text: `[DEV] Forced outcome: ${outcome}`, type: 'narrative' });
  setState(gs);
  rerender();
}

// ===== TAB 2: PLAYER =====

function renderPlayerTab(parent: HTMLElement) {
  const gs = getState();
  const bs = ensureBattle();

  if (bs) {
    const p = bs.player;
    section(parent, 'In-Battle Meters');
    row(parent, 'Morale', numberInput(p.morale, 0, p.maxMorale, v => { p.morale = v; updatePlayerMeters(bs); }));
    row(parent, 'Health', numberInput(p.health, 0, p.maxHealth, v => { p.health = v; updatePlayerMeters(bs); }));
    row(parent, 'Fatigue', numberInput(p.fatigue, 0, p.maxFatigue, v => { p.fatigue = v; updatePlayerMeters(bs); }));

    section(parent, 'Flags');
    row(parent, 'Musket Loaded', checkbox(p.musketLoaded, v => { p.musketLoaded = v; }));
    row(parent, 'Held Fire', checkbox(p.heldFire, v => { p.heldFire = v; }));
    row(parent, 'Alive', checkbox(p.alive, v => { p.alive = v; }));
    row(parent, 'Routing', checkbox(p.routing, v => { p.routing = v; }));
  }

  section(parent, 'Persistent Stats');
  const pc = gs.player;
  const stats = ['valor', 'dexterity', 'strength', 'endurance', 'constitution', 'charisma', 'intelligence', 'awareness'] as const;
  for (const stat of stats) {
    row(parent, stat.charAt(0).toUpperCase() + stat.slice(1), numberInput(pc[stat], 0, 100, v => {
      pc[stat] = v;
      // Sync to battle player if in battle
      if (bs && stat in bs.player) (bs.player as any)[stat] = v;
    }));
  }

  section(parent, 'Progression');
  row(parent, 'Experience', numberInput(pc.experience, 0, 100, v => { pc.experience = v; if (bs) bs.player.experience = v; }));
  row(parent, 'Reputation', numberInput(pc.reputation, -100, 100, v => { pc.reputation = v; if (bs) bs.player.reputation = v; }));
  row(parent, 'NCO Approval', numberInput(pc.ncoApproval, 0, 100, v => { pc.ncoApproval = v; if (bs) bs.player.ncoApproval = v; }));

  // God mode
  section(parent, 'Cheats');
  const grid = document.createElement('div');
  grid.className = 'dev-btn-group';
  grid.appendChild(actionBtn('God Mode (Max All)', 'success', () => {
    if (bs) {
      bs.player.morale = bs.player.maxMorale;
      bs.player.health = bs.player.maxHealth;
      bs.player.fatigue = bs.player.maxFatigue;
      updatePlayerMeters(bs);
    }
    rerender();
  }));
  grid.appendChild(actionBtn('Kill Player', 'danger', () => {
    if (bs) {
      bs.player.health = 0;
      bs.player.alive = false;
      updatePlayerMeters(bs);
      bs.battleOver = true;
      bs.outcome = 'defeat';
    }
    rerender();
  }));
  grid.appendChild(actionBtn('Set Morale: Breaking', 'danger', () => {
    if (bs) {
      bs.player.morale = 10;
      updatePlayerMeters(bs);
    }
    rerender();
  }));
  grid.appendChild(actionBtn('Restore Fatigue', 'success', () => {
    if (bs) {
      bs.player.fatigue = bs.player.maxFatigue;
      updatePlayerMeters(bs);
    }
    rerender();
  }));
  parent.appendChild(grid);
}

// ===== TAB 3: BATTLE =====

function renderBattleTab(parent: HTMLElement) {
  const gs = getState();
  const bs = ensureBattle();

  if (!bs) {
    section(parent, 'Not in Battle');
    row(parent, 'Phase', badge(gs.phase));
    return;
  }

  // Enemy
  section(parent, 'Enemy');
  row(parent, 'Range', numberInput(bs.enemy.range, 0, 300, v => { bs.enemy.range = v; }));
  row(parent, 'Strength', numberInput(bs.enemy.strength, 0, 100, v => { bs.enemy.strength = v; }));
  row(parent, 'Line Integrity', numberInput(bs.enemy.lineIntegrity, 0, 100, v => { bs.enemy.lineIntegrity = v; }));
  row(parent, 'Artillery', checkbox(bs.enemy.artillery, v => { bs.enemy.artillery = v; }));
  row(parent, 'Cavalry Threat', checkbox(bs.enemy.cavalryThreat, v => { bs.enemy.cavalryThreat = v; }));

  // Enemy morale dropdown
  const eMoraleSelect = document.createElement('select');
  eMoraleSelect.className = 'dev-select';
  for (const m of ['advancing', 'steady', 'wavering', 'charging', 'resolute']) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    if (bs.enemy.morale === m) opt.selected = true;
    eMoraleSelect.appendChild(opt);
  }
  eMoraleSelect.addEventListener('change', () => { bs.enemy.morale = eMoraleSelect.value as any; rerender(); });
  row(parent, 'Morale', eMoraleSelect);

  // Line
  section(parent, 'Your Line');
  row(parent, 'Integrity', numberInput(bs.line.lineIntegrity, 0, 100, v => { bs.line.lineIntegrity = v; }));

  if (bs.line.leftNeighbour) {
    const ln = bs.line.leftNeighbour;
    row(parent, 'Pierre Alive', checkbox(ln.alive, v => { ln.alive = v; }));
    row(parent, 'Pierre Wounded', checkbox(ln.wounded, v => { ln.wounded = v; }));
  }
  if (bs.line.rightNeighbour) {
    const rn = bs.line.rightNeighbour;
    row(parent, 'JB Alive', checkbox(rn.alive, v => { rn.alive = v; }));
    row(parent, 'JB Wounded', checkbox(rn.wounded, v => { rn.wounded = v; }));
  }
  row(parent, 'Officer Alive', checkbox(bs.line.officer.alive, v => { bs.line.officer.alive = v; }));

  // Melee state
  if (bs.phase === BattlePhase.Melee && bs.meleeState) {
    const ms = bs.meleeState;
    section(parent, 'Melee');
    row(parent, 'Exchange', numberInput(ms.exchangeCount, 0, ms.maxExchanges, v => { ms.exchangeCount = v; }));
    row(parent, 'Max Exchanges', numberInput(ms.maxExchanges, 1, 30, v => { ms.maxExchanges = v; }));
    row(parent, 'Kill Count', numberInput(ms.killCount, 0, 10, v => { ms.killCount = v; }));
    row(parent, 'Current Opp', numberInput(ms.currentOpponent, 0, ms.opponents.length - 1, v => { ms.currentOpponent = v; }));

    const opp = ms.opponents[ms.currentOpponent];
    if (opp) {
      section(parent, `Opponent: ${opp.name}`);
      row(parent, 'Health', numberInput(opp.health, 0, opp.maxHealth, v => { opp.health = v; }));
      row(parent, 'Fatigue', numberInput(opp.fatigue, 0, opp.maxFatigue, v => { opp.fatigue = v; }));
      row(parent, 'Stunned', checkbox(opp.stunned, v => { opp.stunned = v; }));
      row(parent, 'Arm Injured', checkbox(opp.armInjured, v => { opp.armInjured = v; }));
      row(parent, 'Leg Injured', checkbox(opp.legInjured, v => { opp.legInjured = v; }));

      const oppGrid = document.createElement('div');
      oppGrid.className = 'dev-btn-group';
      oppGrid.appendChild(actionBtn('Kill Opponent', 'danger', () => {
        opp.health = 0;
        rerender();
      }));
      oppGrid.appendChild(actionBtn('Full Heal Opp', 'success', () => {
        opp.health = opp.maxHealth;
        opp.fatigue = opp.maxFatigue;
        opp.stunned = false;
        opp.armInjured = false;
        opp.legInjured = false;
        rerender();
      }));
      parent.appendChild(oppGrid);
    }
  }

  // Camp state (if in camp)
  if (gs.phase === GamePhase.Camp && gs.campState) {
    const camp = gs.campState;
    section(parent, 'Camp State');
    row(parent, 'Day', numberInput(camp.day, 1, camp.maxDays, v => { camp.day = v; }));
    row(parent, 'Activities Left', numberInput(camp.activitiesRemaining, 0, camp.activitiesPerDay, v => { camp.activitiesRemaining = v; }));
  }
}

// ===== TAB 4: ACTIONS =====

function renderActionsTab(parent: HTMLElement) {
  const gs = getState();

  section(parent, 'Skip Phases');
  const grid1 = document.createElement('div');
  grid1.className = 'dev-btn-group';

  grid1.appendChild(actionBtn('Skip Phase 1 → Charge', '', () => jumpToCharge(1)));
  grid1.appendChild(actionBtn('Skip to Melee', '', () => jumpToMelee()));
  grid1.appendChild(actionBtn('Skip to Camp', '', () => {
    jumpToCamp(1);
  }));
  grid1.appendChild(actionBtn('Skip Camp → Battle', '', () => {
    if (gs.phase === GamePhase.Camp) {
      transitionToBattle(gs);
      const bs = gs.battleState!;
      bs.log.push({ turn: 0, text: '[DEV] Skipped camp, starting new battle', type: 'narrative' });
      bs.availableActions = getScriptedAvailableActions(bs);
      setState(gs);
      rerender();
    }
  }));
  parent.appendChild(grid1);

  section(parent, 'Battle Outcomes');
  const grid2 = document.createElement('div');
  grid2.className = 'dev-btn-group';
  grid2.appendChild(actionBtn('Win Battle', 'success', () => forceBattleEnd('victory')));
  grid2.appendChild(actionBtn('Cavalry Victory', 'success', () => forceBattleEnd('cavalry_victory')));
  grid2.appendChild(actionBtn('Survived', '', () => forceBattleEnd('survived')));
  grid2.appendChild(actionBtn('Rout (flee)', 'danger', () => forceBattleEnd('rout')));
  grid2.appendChild(actionBtn('Defeat (death)', 'danger', () => forceBattleEnd('defeat')));
  parent.appendChild(grid2);

  section(parent, 'Camp Actions');
  const grid3 = document.createElement('div');
  grid3.className = 'dev-btn-group';
  grid3.appendChild(actionBtn('Skip Camp Event', '', () => {
    if (gs.campState?.pendingEvent) {
      gs.campState.pendingEvent = undefined;
      gs.campState.log.push({ day: gs.campState.day, text: '[DEV] Event skipped', type: 'narrative' });
      // Advance day if no activities remain
      if (gs.campState.activitiesRemaining <= 0 && gs.campState.day < gs.campState.maxDays) {
        gs.campState.day++;
        gs.campState.activitiesRemaining = gs.campState.activitiesPerDay;
        gs.campState.completedActivities = [];
      }
      rerender();
    }
  }));
  grid3.appendChild(actionBtn('Complete Camp', '', () => {
    if (gs.campState) {
      gs.campState.day = gs.campState.maxDays;
      gs.campState.activitiesRemaining = 0;
      gs.campState.pendingEvent = undefined;
      rerender();
    }
  }));
  grid3.appendChild(actionBtn('Add Activity', 'success', () => {
    if (gs.campState) {
      gs.campState.activitiesRemaining++;
      rerender();
    }
  }));
  parent.appendChild(grid3);

  section(parent, 'General');
  const grid4 = document.createElement('div');
  grid4.className = 'dev-btn-group';
  grid4.appendChild(actionBtn('Reset Game', 'danger', () => {
    resetGame();
  }));
  grid4.appendChild(actionBtn('Dump State (console)', '', () => {
    console.log('[DEV] Game State:', JSON.parse(JSON.stringify(gs)));
  }));
  grid4.appendChild(actionBtn('Auto-play Turn', '', () => {
    $('dev-overlay').style.display = 'none';
    autoPlayTurn();
  }));
  grid4.appendChild(actionBtn('Auto-play 5 Turns', '', () => {
    $('dev-overlay').style.display = 'none';
    autoPlayMultiple(5);
  }));
  parent.appendChild(grid4);

  // NPC quick view
  section(parent, 'NPCs');
  for (const npc of gs.npcs) {
    const wrap = document.createElement('div');
    wrap.className = 'dev-row';
    wrap.innerHTML = `
      <span class="dev-label">${npc.name}</span>
      <span class="dev-val">${npc.alive ? 'Alive' : 'Dead'} | Rel: ${npc.relationship} | Trust: ${npc.trust}</span>
    `;
    parent.appendChild(wrap);
  }
}

function autoPlayTurn() {
  // Click first available action button in the game
  const selectors = [
    '#actions-grid button',
    '.parchment-choice',
    '#arena-actions-grid button.action-btn',
  ];
  for (const sel of selectors) {
    const btn = document.querySelector(sel) as HTMLElement | null;
    if (btn) {
      btn.click();
      // If body part selection appears, click Torso
      setTimeout(() => {
        const torso = document.querySelector('.body-target-btn') as HTMLElement | null;
        if (torso) torso.click();
      }, 100);
      return;
    }
  }
}

function autoPlayMultiple(count: number) {
  let i = 0;
  const interval = setInterval(() => {
    autoPlayTurn();
    i++;
    if (i >= count) clearInterval(interval);
  }, 300);
}

// ===== TAB 5: AUDIO =====

function renderAudioTab(parent: HTMLElement) {
  section(parent, 'Music');

  // Volume slider
  row(parent, 'Volume', numberInput(getVolume() * 100, 0, 100, v => {
    setVolume(v / 100);
  }));

  // Mute toggle
  row(parent, 'Muted', checkbox(isMuted(), () => {
    toggleMute();
    // Sync the header mute button
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) muteBtn.classList.toggle('muted', isMuted());
  }));
}
