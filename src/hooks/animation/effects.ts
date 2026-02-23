// Transient visual effects — pure DOM helpers

export function getArtWrap(card: HTMLElement): HTMLElement {
  return (card.querySelector('.skirmish-card-art-wrap') as HTMLElement) || card;
}

export function spawnFloatingText(targetEl: HTMLElement, text: string, cssClass: string) {
  const floater = document.createElement('div');
  floater.className = `floating-text ${cssClass}`;
  floater.textContent = text;
  targetEl.appendChild(floater);
  floater.addEventListener('animationend', () => floater.remove());
}

export function spawnSlash(targetEl: HTMLElement) {
  const slash = document.createElement('div');
  slash.className = 'slash-overlay';
  targetEl.appendChild(slash);
  slash.addEventListener('animationend', () => slash.remove());
}

export function spawnCenterText(field: HTMLElement, text: string, cssClass: string) {
  const el = document.createElement('div');
  el.className = `skirmish-center-text ${cssClass}`;
  el.textContent = text;
  field.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

export function spawnCenterActionText(field: HTMLElement, action: string, bodyPart: string) {
  const el = document.createElement('div');
  el.className = 'skirmish-center-text center-text-action';
  el.innerHTML = `<span class="center-action-name">${action}</span>${bodyPart ? `<span class="center-action-target">${bodyPart}</span>` : ''}`;
  field.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

export function statusIconHtml(type: string, tooltip: string): string {
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

export function injectStatus(card: HTMLElement, type: string, tooltip: string) {
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
