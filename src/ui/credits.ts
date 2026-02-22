import { BattleState, GameState } from '../types';
import { $ } from './dom';
import { loadGlory } from '../core/persistence';
import { switchTrack } from '../music';

// Cached stats HTML for the review popup
let cachedStatsHtml = '';

// Chroma key cleanup handle
let chromaCleanup: (() => void) | null = null;

export function showCredits(state: BattleState, gameState: GameState) {
  const overlay = $('credits-overlay');
  const scroll = $('credits-scroll');
  const endstate = $('credits-endstate');
  const skipBtn = $('btn-credits-skip');
  const reviewOverlay = $('credits-review-overlay');
  const video = $('credits-video') as HTMLVideoElement;
  const canvas = $('credits-canvas') as HTMLCanvasElement;

  // Build scroll content (includes closing text in the scroll)
  cachedStatsHtml = buildCreditsContent(state, gameState);
  scroll.innerHTML = cachedStatsHtml + '<div class="credits-closing">The 14th held.</div>';
  scroll.classList.remove('skip');

  // Hide global mascot
  $('mascot').style.display = 'none';

  // Reset endstate and review
  endstate.classList.remove('visible');
  reviewOverlay.classList.remove('visible');
  skipBtn.style.display = '';

  // Show overlay
  overlay.classList.add('visible');

  // Switch to dreams music
  switchTrack('dreams');

  // Set up mascot animation — paused on first frame, plays on "Play Again"
  if (chromaCleanup) { chromaCleanup(); chromaCleanup = null; }

  const initMascot = () => {
    // Set canvas display aspect ratio to match video
    if (video.videoWidth && video.videoHeight) {
      canvas.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
    video.pause();
    chromaCleanup = startChromaKey(video, canvas, 140, 0.30);
  };

  // Force load — video may not have preloaded inside a display:none container
  video.addEventListener('loadeddata', initMascot, { once: true });
  video.src = '/assets/mascot-animation.mp4';
  video.load();

  // When scroll animation ends, transition to endstate
  const onAnimEnd = () => {
    scroll.removeEventListener('animationend', onAnimEnd);
    transitionToEndstate();
  };
  scroll.addEventListener('animationend', onAnimEnd);

  // Hold anywhere to fast-forward scroll, release to resume normal speed
  skipBtn.style.display = 'none';
  const setPlaybackRate = (rate: number) => {
    const anims = scroll.getAnimations();
    if (anims.length > 0) anims[0].playbackRate = rate;
  };
  overlay.onmousedown = (e) => {
    if ((e.target as HTMLElement).closest('button, .credits-endstate, .credits-review-overlay')) return;
    if (endstate.classList.contains('visible')) return;
    setPlaybackRate(5);
  };
  overlay.onmouseup = () => setPlaybackRate(1);
  overlay.onmouseleave = () => setPlaybackRate(1);

  // Review stats button
  $('btn-credits-review').onclick = () => {
    $('credits-review-content').innerHTML = cachedStatsHtml;
    reviewOverlay.classList.add('visible');
  };

  // Close review
  $('btn-credits-review-close').onclick = () => {
    reviewOverlay.classList.remove('visible');
  };

  // Close review on backdrop click
  reviewOverlay.onclick = (e) => {
    if (e.target === reviewOverlay) reviewOverlay.classList.remove('visible');
  };
}

function transitionToEndstate() {
  const scroll = $('credits-scroll');
  const endstate = $('credits-endstate');
  const skipBtn = $('btn-credits-skip');

  scroll.classList.add('skip');
  skipBtn.style.display = 'none';
  endstate.classList.add('visible');
}

/**
 * Plays the mascot bow animation, then calls onDone when it finishes.
 * Called when the player clicks "Play Again".
 * Falls back to immediate callback if video fails to play.
 */
export function playCreditsOutro(onDone: () => void) {
  const endstate = $('credits-endstate');
  const video = $('credits-video') as HTMLVideoElement;

  // Hide endstate so the animation plays over the dark background
  endstate.classList.remove('visible');

  // Guard against double-fire (video ended + error fallback)
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onDone();
  };

  // Play the bow animation from the start
  video.currentTime = 0;
  video.addEventListener('ended', finish, { once: true });
  const p = video.play();
  if (p && p.catch) {
    p.catch(finish);
  }
}

export function hideCredits() {
  const overlay = $('credits-overlay');
  overlay.classList.remove('visible');
  overlay.onclick = null;
  overlay.onmousedown = null;
  overlay.onmouseup = null;
  overlay.onmouseleave = null;

  // Stop chroma key
  if (chromaCleanup) {
    chromaCleanup();
    chromaCleanup = null;
  }

  // Reset video
  const video = $('credits-video') as HTMLVideoElement;
  video.pause();
  video.currentTime = 0;

  // Restore global mascot
  $('mascot').style.display = '';

  // Reset scroll
  const scroll = $('credits-scroll');
  scroll.classList.remove('skip');
  scroll.innerHTML = '';

  // Hide endstate and review
  $('credits-endstate').classList.remove('visible');
  $('credits-review-overlay').classList.remove('visible');

  cachedStatsHtml = '';
}

// ---- Chroma Key (flood-fill from edges) ----

function startChromaKey(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  lightMin: number,
  satMax: number,
) {
  const ctx2d = canvas.getContext('2d', { willReadFrequently: true })!;
  let animId = 0;
  let running = false;

  function isBg(r: number, g: number, b: number): boolean {
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const light = (maxC + minC) / 2;
    const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
    return light > lightMin && sat < satMax;
  }

  let lastDrawnTime = -1;

  function processFrame() {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
    }
    ctx2d.drawImage(video, 0, 0, vw, vh);
    const frame = ctx2d.getImageData(0, 0, vw, vh);
    const d = frame.data;

    // Flood fill from all border pixels
    const visited = new Uint8Array(vw * vh);
    const stack: number[] = [];

    for (let x = 0; x < vw; x++) {
      stack.push(x);
      stack.push((vh - 1) * vw + x);
    }
    for (let y = 1; y < vh - 1; y++) {
      stack.push(y * vw);
      stack.push(y * vw + (vw - 1));
    }

    while (stack.length > 0) {
      const idx = stack.pop()!;
      if (visited[idx]) continue;
      visited[idx] = 1;

      const pi = idx * 4;
      if (!isBg(d[pi], d[pi + 1], d[pi + 2])) continue;

      d[pi + 3] = 0;

      const x = idx % vw;
      const y = (idx - x) / vw;
      if (x > 0) stack.push(idx - 1);
      if (x < vw - 1) stack.push(idx + 1);
      if (y > 0) stack.push(idx - vw);
      if (y < vh - 1) stack.push(idx + vw);
    }

    // Edge softening
    for (let y = 1; y < vh - 1; y++) {
      for (let x = 1; x < vw - 1; x++) {
        const idx = y * vw + x;
        const pi = idx * 4;
        if (d[pi + 3] === 0) continue;
        let tCount = 0;
        if (d[(idx - 1) * 4 + 3] === 0) tCount++;
        if (d[(idx + 1) * 4 + 3] === 0) tCount++;
        if (d[(idx - vw) * 4 + 3] === 0) tCount++;
        if (d[(idx + vw) * 4 + 3] === 0) tCount++;
        if (tCount > 0) {
          d[pi + 3] = Math.round(d[pi + 3] * (1 - tCount * 0.15));
        }
      }
    }

    ctx2d.putImageData(frame, 0, 0);
  }

  function draw() {
    if (!running) return;
    if (video.readyState >= 2 && !video.ended) {
      const t = video.currentTime;
      if (t !== lastDrawnTime) {
        lastDrawnTime = t;
        processFrame();
      }
    }
    animId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    animId = requestAnimationFrame(draw);
  }

  video.addEventListener('playing', start);
  video.addEventListener('play', start);
  if (video.readyState >= 2) start();

  return () => { running = false; cancelAnimationFrame(animId); };
}

// ---- Stats Content Builder ----

function buildCreditsContent(state: BattleState, gameState: GameState): string {
  const pc = gameState.player;
  const player = state.player;
  const meleeKills = state.meleeState?.killCount || 0;
  const glory = loadGlory();

  function npcStatus(id: string): string {
    const npc = gameState.npcs.find(n => n.id === id);
    if (!npc) return 'Unknown';
    if (!npc.alive) return 'Killed in action';
    if (npc.wounded) return 'Wounded';
    return 'Alive';
  }

  const frontRank = player.frontRank ? 'Yes' : 'No';
  const battery = state.batteryCharged ? 'Charged' : 'Held back';
  const wagon = state.wagonDamage >= 100 ? 'Detonated' : 'Intact';
  const mercy = state.gorgeMercyCount;

  const sections: string[] = [];

  sections.push(`
    <div class="credits-title">The Battle of Rivoli</div>
    <div class="credits-subtitle">14 January 1797</div>
  `);

  sections.push(`
    <div class="credits-player-name">${pc.name}</div>
    <div class="credits-player-rank">Private, 14th Demi-Brigade de Ligne</div>
  `);

  sections.push(`
    <div class="credits-section-header">Your Battle</div>
    ${statRow('Turns survived', String(state.turn))}
    ${statRow('Volleys fired', String(state.volleysFired))}
    ${statRow('Melee kills', String(meleeKills))}
  `);

  const healthPct = Math.round((player.health / player.maxHealth) * 100);
  const staminaPct = Math.round((player.stamina / player.maxStamina) * 100);
  sections.push(`
    <div class="credits-section-header">Your Condition</div>
    ${statRow('Health', `${healthPct}%`)}
    ${statRow('Stamina', `${staminaPct}%`)}
    ${statRow('Morale', `${Math.round(player.morale)} (${player.moraleThreshold})`)}
    ${statRow('Valor', String(player.valor))}
  `);

  sections.push(`
    <div class="credits-section-header">Choices Made</div>
    ${statRow('Front rank', frontRank)}
    ${statRow('The battery', battery)}
    ${statRow('Ammunition wagon', wagon)}
    ${statRow('Mercy shown', `${mercy} time${mercy !== 1 ? 's' : ''}`)}
  `);

  sections.push(`
    <div class="credits-section-header">The Line</div>
    ${statRow('Line integrity', `${Math.round(state.line.lineIntegrity)}%`)}
    ${statRow('Enemy strength', `${Math.round(state.enemy.strength)}%`)}
  `);

  sections.push(`
    <div class="credits-section-header">Comrades</div>
    ${statRow('Pierre', npcStatus('pierre'))}
    ${statRow('Jean-Baptiste', npcStatus('jb'))}
    ${statRow('Capt. Leclerc', npcStatus('leclerc'))}
  `);

  sections.push(`
    <div class="credits-section-header">Glory &amp; Grace</div>
    ${statRow('Glory', String(glory))}
    ${statRow('Grace remaining', String(pc.grace))}
  `);

  return sections.join('');
}

function statRow(label: string, value: string): string {
  return `<div class="credits-stat-row">
    <span class="credits-stat-label">${label}</span>
    <span class="credits-stat-value">${value}</span>
  </div>`;
}
