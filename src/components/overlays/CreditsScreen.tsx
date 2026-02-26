import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { BattleState, GameState } from '../../types';
import { loadGlory } from '../../core/persistence';
import { switchTrack } from '../../music';

interface CreditsScreenProps {
  battleState: BattleState;
  gameState: GameState;
  onPlayAgain: () => void;
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

  return () => {
    running = false;
    cancelAnimationFrame(animId);
  };
}

// ---- Stats helpers ----

function npcStatus(gameState: GameState, id: string): string {
  const npc = gameState.npcs.find((n) => n.id === id);
  if (!npc) return 'Unknown';
  if (!npc.alive) return 'Killed in action';
  if (npc.wounded) return 'Wounded';
  return 'Alive';
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="credits-stat-row">
      <span className="credits-stat-label">{label}</span>
      <span className="credits-stat-value">{value}</span>
    </div>
  );
}

function CreditsContent({
  battleState,
  gameState,
}: {
  battleState: BattleState;
  gameState: GameState;
}) {
  const pc = gameState.player;
  const player = battleState.player;
  const meleeKills = battleState.meleeState?.killCount || 0;
  const glory = loadGlory();

  const frontRank = player.frontRank ? 'Yes' : 'No';
  const battery = battleState.ext.batteryCharged ? 'Charged' : 'Held back';
  const wagon = (battleState.ext.wagonDamage as number) >= 100 ? 'Detonated' : 'Intact';
  const mercy = battleState.ext.gorgeMercyCount as number;

  const healthPct = Math.round((player.health / player.maxHealth) * 100);
  const staminaPct = Math.round((player.stamina / player.maxStamina) * 100);

  return (
    <>
      <div className="credits-title">The Battle of Rivoli</div>
      <div className="credits-subtitle">14 January 1797</div>

      <div className="credits-player-name">{pc.name}</div>
      <div className="credits-player-rank">Private, 14th Demi-Brigade de Ligne</div>

      <div className="credits-section-header">Your Battle</div>
      <StatRow label="Turns survived" value={String(battleState.turn)} />
      <StatRow label="Volleys fired" value={String(battleState.volleysFired)} />
      <StatRow label="Melee kills" value={String(meleeKills)} />

      <div className="credits-section-header">Your Condition</div>
      <StatRow label="Health" value={`${healthPct}%`} />
      <StatRow label="Stamina" value={`${staminaPct}%`} />
      <StatRow
        label="Morale"
        value={`${Math.round(player.morale)} (${player.moraleThreshold})`}
      />
      <StatRow label="Valor" value={String(player.valor)} />

      <div className="credits-section-header">Choices Made</div>
      <StatRow label="Front rank" value={frontRank} />
      <StatRow label="The battery" value={battery} />
      <StatRow label="Ammunition wagon" value={wagon} />
      <StatRow label="Mercy shown" value={`${mercy} time${mercy !== 1 ? 's' : ''}`} />

      <div className="credits-section-header">The Line</div>
      <StatRow
        label="Line integrity"
        value={`${Math.round(battleState.line.lineIntegrity)}%`}
      />
      <StatRow
        label="Enemy strength"
        value={`${Math.round(battleState.enemy.strength)}%`}
      />

      <div className="credits-section-header">Comrades</div>
      <StatRow label="Pierre" value={npcStatus(gameState, 'pierre')} />
      <StatRow label="Jean-Baptiste" value={npcStatus(gameState, 'jb')} />
      <StatRow label="Capt. Leclerc" value={npcStatus(gameState, 'leclerc')} />

      <div className="credits-section-header">Glory &amp; Grace</div>
      <StatRow label="Glory" value={String(glory)} />
      <StatRow label="Grace remaining" value={String(pc.grace)} />
    </>
  );
}

export function CreditsScreen({ battleState, gameState, onPlayAgain }: CreditsScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chromaCleanupRef = useRef<(() => void) | null>(null);

  const [showEndstate, setShowEndstate] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [scrollSkipped, setScrollSkipped] = useState(false);

  // Switch to dreams music on mount
  useEffect(() => {
    switchTrack('dreams');
  }, []);

  // Hide global mascot on mount, restore on unmount
  useEffect(() => {
    const mascot = document.getElementById('mascot');
    if (mascot) mascot.style.display = 'none';
    return () => {
      if (mascot) mascot.style.display = '';
    };
  }, []);

  // Set up mascot video + chroma key
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Clean up any previous chroma key
    if (chromaCleanupRef.current) {
      chromaCleanupRef.current();
      chromaCleanupRef.current = null;
    }

    const initMascot = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
      }
      video.pause();
      chromaCleanupRef.current = startChromaKey(video, canvas, 140, 0.3);
    };

    video.addEventListener('loadeddata', initMascot, { once: true });
    video.src = '/assets/mascot-animation.mp4';
    video.load();

    return () => {
      if (chromaCleanupRef.current) {
        chromaCleanupRef.current();
        chromaCleanupRef.current = null;
      }
      video.pause();
      video.currentTime = 0;
    };
  }, []);

  // Handle scroll animation end
  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const onAnimEnd = () => {
      setScrollSkipped(true);
      setShowEndstate(true);
    };
    scroll.addEventListener('animationend', onAnimEnd);
    return () => scroll.removeEventListener('animationend', onAnimEnd);
  }, []);

  // Hold to fast-forward scroll
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, .credits-endstate, .credits-review-overlay'))
        return;
      if (showEndstate) return;
      const scroll = scrollRef.current;
      if (!scroll) return;
      const anims = scroll.getAnimations();
      if (anims.length > 0) anims[0].playbackRate = 5;
    },
    [showEndstate],
  );

  const resetPlaybackRate = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const anims = scroll.getAnimations();
    if (anims.length > 0) anims[0].playbackRate = 1;
  }, []);

  // Play Again handler with mascot bow animation
  const handlePlayAgain = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      onPlayAgain();
      return;
    }

    // Hide endstate so the animation plays over the dark background
    setShowEndstate(false);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onPlayAgain();
    };

    video.currentTime = 0;
    video.addEventListener('ended', finish, { once: true });
    const p = video.play();
    if (p && p.catch) {
      p.catch(finish);
    }
  }, [onPlayAgain]);

  // Review stats
  const handleReviewOpen = useCallback(() => setShowReview(true), []);
  const handleReviewClose = useCallback(() => setShowReview(false), []);
  const handleReviewBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setShowReview(false);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="credits-overlay visible"
      onMouseDown={handleMouseDown}
      onMouseUp={resetPlaybackRate}
      onMouseLeave={resetPlaybackRate}
    >
      {/* Left column: mascot + historical note */}
      <div className="credits-left">
        <div className="credits-mascot-wrap">
          <video ref={videoRef} id="credits-video" muted playsInline preload="none" />
          <canvas ref={canvasRef} id="credits-canvas" />
        </div>
        <div className="credits-historical">
          <div className="credits-historical-title">Historical Note</div>
          <div className="credits-historical-text">
            The Battle of Rivoli, fought on 14 January 1797, was a decisive French victory in the
            War of the First Coalition. Napoleon Bonaparte's Army of Italy defeated the Austrian
            forces under Feldmarschall Alvinczi, securing French control of northern Italy and
            leading to the eventual Treaty of Campo Formio.
          </div>
        </div>
      </div>

      {/* Right half: scrolling content */}
      <div
        ref={scrollRef}
        className={`credits-scroll${scrollSkipped ? ' skip' : ''}`}
        id="credits-scroll"
      >
        <CreditsContent battleState={battleState} gameState={gameState} />
        <div className="credits-closing">The 14th held.</div>
      </div>

      {/* End state (shown after scroll finishes) */}
      <div className={`credits-endstate${showEndstate ? ' visible' : ''}`} id="credits-endstate">
        <div className="credits-endstate-closing">The 14th held.</div>
        <button className="credits-endstate-play" onClick={handlePlayAgain}>
          Play Again
        </button>
        <button className="credits-endstate-review" onClick={handleReviewOpen}>
          Review Stats
        </button>
      </div>

      {/* Review Stats popup */}
      <div
        className={`credits-review-overlay${showReview ? ' visible' : ''}`}
        id="credits-review-overlay"
        onClick={handleReviewBackdrop}
      >
        <div className="credits-review-panel">
          <button className="credits-review-close" onClick={handleReviewClose}>
            &times;
          </button>
          <div className="credits-review-content">
            <CreditsContent battleState={battleState} gameState={gameState} />
          </div>
        </div>
      </div>
    </div>
  );
}
