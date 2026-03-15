// Reload animation sequence

import { wait, LOAD_STEP_LABELS } from './constants';

export async function showMeleeReloadAnimation(isSecondHalf: boolean): Promise<void> {
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
