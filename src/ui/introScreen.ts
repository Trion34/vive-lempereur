import { appState, triggerRender } from './state';
import { $ } from './dom';
import { MilitaryRank } from '../types';
import { getPlayerStat, setPlayerStat } from '../core/stats';
import { loadGlory, saveGlory, saveGame } from '../core/persistence';
import { transitionToPreBattleCamp } from '../core/gameLoop';
import { ensureStarted } from '../music';

export const GRACE_CAP = 2;
const GRACE_COST = 5; // glory cost per grace

interface IntroStat {
  key: string;
  label: string;
  section: 'arms' | 'physical' | 'mental' | 'spirit';
  default: number;
  min: number;
  max: number;
  step: number;
}

const INTRO_STATS: IntroStat[] = [
  // Arms (trained military skills)
  { key: 'musketry', label: 'Musketry', section: 'arms', default: 35, min: 20, max: 70, step: 5 },
  { key: 'elan', label: '\u00c9lan', section: 'arms', default: 35, min: 20, max: 70, step: 5 },
  // Physical
  { key: 'strength', label: 'Strength', section: 'physical', default: 40, min: 20, max: 70, step: 5 },
  { key: 'endurance', label: 'Endurance', section: 'physical', default: 40, min: 20, max: 70, step: 5 },
  { key: 'constitution', label: 'Constitution', section: 'physical', default: 45, min: 20, max: 70, step: 5 },
  // Mental
  { key: 'charisma', label: 'Charisma', section: 'mental', default: 30, min: 10, max: 60, step: 5 },
  { key: 'intelligence', label: 'Intelligence', section: 'mental', default: 30, min: 10, max: 60, step: 5 },
  { key: 'awareness', label: 'Awareness', section: 'mental', default: 35, min: 10, max: 60, step: 5 },
  // Spirit
  { key: 'valor', label: 'Valor', section: 'spirit', default: 40, min: 10, max: 80, step: 5 },
];

const INTRO_SECTIONS: { id: string; label: string }[] = [
  { id: 'arms', label: 'Arms' },
  { id: 'physical', label: 'Physical' },
  { id: 'mental', label: 'Mental' },
  { id: 'spirit', label: 'Spirit' },
];

function renderStatCell(stat: IntroStat): string {
  const val = getPlayerStat(appState.state.player, stat.key);
  const spent = appState.glorySpent[stat.key] || 0;
  const canIncrease = appState.playerGlory > 0 && val < stat.max;
  const canDecrease = spent > 0; // can only undo glory-funded increases
  const boostTag = spent > 0 ? `<span class="glory-tag">+${spent * stat.step}</span>` : '';
  return `<div class="intro-stat-cell">
    <span class="intro-stat-label">${stat.label}${boostTag}</span>
    <div class="intro-stat-controls">
      <button class="intro-stat-btn" data-stat="${stat.key}" data-dir="-" ${!canDecrease ? 'disabled' : ''}>-</button>
      <span class="intro-stat-val">${val}</span>
      <button class="intro-stat-btn" data-stat="${stat.key}" data-dir="+" ${!canIncrease ? 'disabled' : ''}>+</button>
    </div>
  </div>`;
}

export function renderIntroStats() {
  const container = $('intro-stats');
  container.innerHTML = '';

  // Update glory banner
  $('glory-amount').textContent = String(appState.playerGlory);
  const banner = $('glory-banner');
  if (appState.playerGlory === 0) {
    banner.classList.add('glory-empty');
    $('glory-hint').textContent = 'Earned through valorous deeds across campaigns.';
  } else {
    banner.classList.remove('glory-empty');
    $('glory-hint').textContent = 'Each stat increase costs 1 Glory.';
  }

  // Update grace banner
  $('grace-count').textContent = `${appState.gameState.player.grace} / ${GRACE_CAP}`;
  const buyBtn = $('btn-buy-grace') as HTMLButtonElement;
  buyBtn.disabled = appState.playerGlory < GRACE_COST || appState.gameState.player.grace >= GRACE_CAP;
  if (appState.gameState.player.grace >= GRACE_CAP) {
    $('grace-hint').textContent = 'Grace is full.';
  } else if (appState.playerGlory < GRACE_COST) {
    $('grace-hint').textContent = `Requires ${GRACE_COST} Glory.`;
  } else {
    $('grace-hint').textContent = 'Divine favour. Spend 5 Glory to gain 1 Grace (max 2).';
  }

  // Arms as a centered row above the two columns
  const arms = INTRO_STATS.filter(s => s.section === 'arms');
  const armsSection = document.createElement('div');
  armsSection.className = 'intro-stat-spirit';
  armsSection.innerHTML = `
    <div class="intro-stat-section">Arms</div>
    ${arms.map(s => renderStatCell(s)).join('')}
  `;
  container.appendChild(armsSection);

  // Physical and Mental side by side in two columns
  const physical = INTRO_STATS.filter(s => s.section === 'physical');
  const mental = INTRO_STATS.filter(s => s.section === 'mental');

  const columns = document.createElement('div');
  columns.className = 'intro-stat-columns';
  columns.innerHTML = `
    <div class="intro-stat-col">
      <div class="intro-stat-section">Physical</div>
      ${physical.map(s => renderStatCell(s)).join('')}
    </div>
    <div class="intro-stat-col">
      <div class="intro-stat-section">Mental</div>
      ${mental.map(s => renderStatCell(s)).join('')}
    </div>
  `;
  container.appendChild(columns);

  // Spirit (Valor) as a centered row below
  const spirit = INTRO_STATS.filter(s => s.section === 'spirit');
  const spiritSection = document.createElement('div');
  spiritSection.className = 'intro-stat-spirit';
  spiritSection.innerHTML = `
    <div class="intro-stat-section">Spirit</div>
    ${spirit.map(s => renderStatCell(s)).join('')}
  `;
  container.appendChild(spiritSection);

  // Stat +/- buttons (each increase costs 1 glory, decrease refunds 1)
  container.querySelectorAll('.intro-stat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget as HTMLButtonElement;
      const key = el.getAttribute('data-stat')!;
      const dir = el.getAttribute('data-dir') === '+' ? 1 : -1;
      const stat = INTRO_STATS.find(s => s.key === key)!;
      const cur = getPlayerStat(appState.state.player, stat.key);
      const spent = appState.glorySpent[key] || 0;

      if (dir === 1) {
        // Increase: costs 1 glory
        if (appState.playerGlory <= 0 || cur >= stat.max) return;
        appState.playerGlory--;
        appState.glorySpent[key] = spent + 1;
      } else {
        // Decrease: refunds 1 glory (only if glory was spent on this stat)
        if (spent <= 0) return;
        appState.playerGlory++;
        appState.glorySpent[key] = spent - 1;
      }

      setPlayerStat(appState.state.player, stat.key, cur + dir * stat.step);
      saveGlory(appState.playerGlory);
      renderIntroStats();
    });
  });
}

export function confirmIntroName() {
  const input = $('intro-name-input') as HTMLInputElement;
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  appState.state.player.name = name;
  appState.gameState.player.name = name;
  $('intro-name-step').style.display = 'none';
  $('intro-stats-step').style.display = '';
  $('intro-player-name').textContent = name;
  $('intro-mascot').classList.add('compact');
  $('intro-bubble').textContent = `Hi ${name}... Vive la France!`;
  // Fresh glory load and reset spent tracking for new character
  appState.playerGlory = loadGlory();
  for (const key in appState.glorySpent) delete appState.glorySpent[key];
  renderIntroStats();
}

export function initIntroListeners() {
  // Unlock audio on first user interaction (click or keypress anywhere)
  document.addEventListener('click', () => ensureStarted(), { once: true });
  document.addEventListener('keydown', () => ensureStarted(), { once: true });

  // Close overlays on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('inventory-overlay').style.display !== 'none') $('inventory-overlay').style.display = 'none';
    }
  });

  $('btn-intro-confirm').addEventListener('click', confirmIntroName);
  $('intro-name-input').addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') confirmIntroName();
  });

  document.querySelectorAll('.intro-rank-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget as HTMLButtonElement;
      const rank = el.getAttribute('data-rank')!;
      document.querySelectorAll('.intro-rank-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      appState.gameState.player.rank = rank === 'officer' ? MilitaryRank.Lieutenant : MilitaryRank.Private;
    });
  });

  $('btn-buy-grace').addEventListener('click', () => {
    if (appState.playerGlory < GRACE_COST || appState.gameState.player.grace >= GRACE_CAP) return;
    appState.playerGlory -= GRACE_COST;
    appState.gameState.player.grace++;
    saveGlory(appState.playerGlory);
    renderIntroStats();
  });

  $('btn-intro-begin').addEventListener('click', () => {
    // Sync intro stat edits back to persistent character
    for (const stat of INTRO_STATS) {
      setPlayerStat(appState.gameState.player, stat.key, getPlayerStat(appState.state.player, stat.key));
    }

    // Enter pre-battle camp (eve of Rivoli) instead of jumping straight to battle
    transitionToPreBattleCamp(appState.gameState);
    saveGame(appState.gameState);
    appState.campLogCount = 0;
    appState.campIntroSeen = false;
    appState.campActionCategory = null;
    appState.campActionResult = null;
    appState.campActionSub = null;
    $('camp-narrative').innerHTML = '';
    triggerRender();
  });

  // Mascot quotes
  const mascotQuotes = [
    'Courage is not the absence of fear, but the conquest of it.',
    'Victory belongs to the most persevering.',
    'Impossible is a word found only in the dictionary of fools.',
    'In war, morale is to the physical as three is to one.',
    'Never interrupt your enemy when he is making a mistake.',
    'The battlefield is a scene of constant chaos.',
    'Men are moved by two levers only: fear and self-interest.',
    'He who fears being conquered is sure of defeat.',
    'Death is nothing, but to live defeated is to die daily.',
    'The truest wisdom is a resolute determination.',
    'Ten people who speak make more noise than ten thousand who are silent.',
    'There are only two forces in the world: the sword and the spirit.',
    'A soldier will fight long and hard for a bit of coloured ribbon.',
    'The word impossible is not in my dictionary.',
    'An army marches on its stomach.',
    'There is only one step from the sublime to the ridiculous.',
    'Glory is fleeting, but obscurity is forever.',
    'I am sometimes a fox and sometimes a lion.',
    'History is a set of lies agreed upon.',
    'Ability is nothing without opportunity.',
  ];
  const mascot = $('mascot');
  const bubble = $('mascot-bubble');
  mascot.addEventListener('mouseenter', () => {
    bubble.textContent = mascotQuotes[Math.floor(Math.random() * mascotQuotes.length)];
  });

  const mascotImages = ['/assets/mascot.png', '/assets/mascot-2.png', '/assets/mascot-3.png', '/assets/mascot-4.png', '/assets/mascot-5.png'];
  let mascotIdx = 0;
  mascot.addEventListener('click', () => {
    mascotIdx = (mascotIdx + 1) % mascotImages.length;
    const img = mascot.querySelector('.mascot-img') as HTMLImageElement;
    if (img) img.src = mascotImages[mascotIdx];
  });
}
