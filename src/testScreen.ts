// ============================================================
// TEST SCREEN — Sandbox for auditioning sounds, effects, etc.
// ============================================================

import {
  BattleState,
  BattlePhase,
  DrillStep,
  Player,
  LineState,
  EnemyState,
  GameState,
  GamePhase,
  CampaignPhase,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  MilitaryRank,
  NPCRole,
  getHealthPoolSize,
  getStaminaPoolSize,
} from './types';
import { createMeleeState } from './core/melee';
import { useGameStore } from './stores/gameStore';
import { useUiStore } from './stores/uiStore';

const $ = (id: string) => document.getElementById(id)!;

let ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

// ---- Sound synthesis helpers ----

function playSynth(fn: (ac: AudioContext) => void) {
  const ac = getCtx();
  if (ac.state === 'suspended') ac.resume();
  fn(ac);
}

// ---- Click sound candidates ----

const clickSounds: { name: string; desc: string; play: () => void }[] = [
  {
    name: 'Soft Click',
    desc: 'Gentle sine blip — subtle, unobtrusive',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.08);
      }),
  },
  {
    name: 'Mechanical Click',
    desc: 'Short noise burst — like a physical button',
    play: () =>
      playSynth((ac) => {
        const buf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8);
        }
        const src = ac.createBufferSource();
        const gain = ac.createGain();
        src.buffer = buf;
        gain.gain.value = 0.4;
        src.connect(gain).connect(ac.destination);
        src.start();
      }),
  },
  {
    name: 'Woody Tap',
    desc: 'Low-pitched thud — warm, period-appropriate',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.06);
        gain.gain.setValueAtTime(0.5, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.1);
      }),
  },
  {
    name: 'Quill Scratch',
    desc: 'High chirp — like pen on parchment',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.04);
        gain.gain.setValueAtTime(0.12, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.05);
      }),
  },
  {
    name: 'Metal Clink',
    desc: 'Bell-like ping — sharp, military',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1800;
        gain.gain.setValueAtTime(0.25, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.15);
      }),
  },
  {
    name: 'Musket Cock',
    desc: 'Two-part click — heavy, authoritative',
    play: () =>
      playSynth((ac) => {
        // First click
        const buf1 = ac.createBuffer(1, ac.sampleRate * 0.015, ac.sampleRate);
        const d1 = buf1.getChannelData(0);
        for (let i = 0; i < d1.length; i++) {
          d1[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d1.length, 6);
        }
        const src1 = ac.createBufferSource();
        const g1 = ac.createGain();
        src1.buffer = buf1;
        g1.gain.value = 0.3;
        src1.connect(g1).connect(ac.destination);
        src1.start();

        // Second click (delayed)
        const buf2 = ac.createBuffer(1, ac.sampleRate * 0.02, ac.sampleRate);
        const d2 = buf2.getChannelData(0);
        for (let i = 0; i < d2.length; i++) {
          d2[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d2.length, 4);
        }
        const src2 = ac.createBufferSource();
        const g2 = ac.createGain();
        src2.buffer = buf2;
        g2.gain.value = 0.45;
        src2.connect(g2).connect(ac.destination);
        src2.start(ac.currentTime + 0.06);
      }),
  },
  {
    name: 'Drum Tap',
    desc: 'Quick snare hit — military drum corps',
    play: () =>
      playSynth((ac) => {
        // Noise body
        const noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.06, ac.sampleRate);
        const nd = noiseBuf.getChannelData(0);
        for (let i = 0; i < nd.length; i++) {
          nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 3);
        }
        const noiseSrc = ac.createBufferSource();
        const noiseGain = ac.createGain();
        noiseSrc.buffer = noiseBuf;
        noiseGain.gain.value = 0.2;
        noiseSrc.connect(noiseGain).connect(ac.destination);
        noiseSrc.start();

        // Tonal thump
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.05);
        gain.gain.setValueAtTime(0.35, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.08);
      }),
  },
  {
    name: 'Paper Fold',
    desc: 'Filtered noise swoosh — document/order feel',
    play: () =>
      playSynth((ac) => {
        const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          const env = Math.sin((Math.PI * i) / data.length);
          data[i] = (Math.random() * 2 - 1) * env;
        }
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const gain = ac.createGain();
        src.buffer = buf;
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 2;
        gain.gain.value = 0.2;
        src.connect(filter).connect(gain).connect(ac.destination);
        src.start();
      }),
  },
  {
    name: 'Leather Pop',
    desc: 'Quick low pop — like tapping a leather pouch',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.04);
        gain.gain.setValueAtTime(0.45, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.06);
      }),
  },
  {
    name: 'Brass Tick',
    desc: 'Tight metallic tick — compass or pocket watch',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.value = 3200;
        gain.gain.setValueAtTime(0.15, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.025);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.025);
      }),
  },
  {
    name: 'Flint Snap',
    desc: 'Sharp crack — like striking a flint',
    play: () =>
      playSynth((ac) => {
        const buf = ac.createBuffer(1, ac.sampleRate * 0.012, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 12);
        }
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const gain = ac.createGain();
        src.buffer = buf;
        filter.type = 'highpass';
        filter.frequency.value = 4000;
        gain.gain.value = 0.5;
        src.connect(filter).connect(gain).connect(ac.destination);
        src.start();
      }),
  },
  {
    name: 'Stone Tap',
    desc: 'Dry mid-range knock — stone on stone',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.03);
        gain.gain.setValueAtTime(0.4, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.05);
      }),
  },
  {
    name: 'Sword Pommel',
    desc: 'Heavy thunk with ring — pommel striking a table',
    play: () =>
      playSynth((ac) => {
        // Thunk body
        const osc1 = ac.createOscillator();
        const g1 = ac.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(180, ac.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(50, ac.currentTime + 0.05);
        g1.gain.setValueAtTime(0.4, ac.currentTime);
        g1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.07);
        osc1.connect(g1).connect(ac.destination);
        osc1.start();
        osc1.stop(ac.currentTime + 0.07);
        // Metal ring
        const osc2 = ac.createOscillator();
        const g2 = ac.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = 2200;
        g2.gain.setValueAtTime(0.08, ac.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
        osc2.connect(g2).connect(ac.destination);
        osc2.start();
        osc2.stop(ac.currentTime + 0.2);
      }),
  },
  {
    name: 'Wax Seal',
    desc: 'Soft press with tonal warmth — satisfying and muted',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const filter = ac.createBiquadFilter();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ac.currentTime + 0.06);
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        gain.gain.setValueAtTime(0.4, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
        osc.connect(filter).connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.1);
      }),
  },
  {
    name: 'Buckle Clasp',
    desc: 'Two-tone snap — crisp and decisive',
    play: () =>
      playSynth((ac) => {
        // High tick
        const osc1 = ac.createOscillator();
        const g1 = ac.createGain();
        osc1.type = 'square';
        osc1.frequency.value = 2800;
        g1.gain.setValueAtTime(0.12, ac.currentTime);
        g1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.015);
        osc1.connect(g1).connect(ac.destination);
        osc1.start();
        osc1.stop(ac.currentTime + 0.015);
        // Low latch
        const osc2 = ac.createOscillator();
        const g2 = ac.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = 500;
        g2.gain.setValueAtTime(0.3, ac.currentTime + 0.02);
        g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
        osc2.connect(g2).connect(ac.destination);
        osc2.start();
        osc2.stop(ac.currentTime + 0.06);
      }),
  },
  {
    name: 'Cartridge Snap',
    desc: 'Quick bite — biting open a paper cartridge',
    play: () =>
      playSynth((ac) => {
        const buf = ac.createBuffer(1, ac.sampleRate * 0.02, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          const t = i / data.length;
          data[i] = (Math.random() * 2 - 1) * (t < 0.15 ? t / 0.15 : Math.pow(1 - t, 5));
        }
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const gain = ac.createGain();
        src.buffer = buf;
        filter.type = 'bandpass';
        filter.frequency.value = 5000;
        filter.Q.value = 1.5;
        gain.gain.value = 0.4;
        src.connect(filter).connect(gain).connect(ac.destination);
        src.start();
      }),
  },
  {
    name: 'Cork Pop',
    desc: 'Rounded pop — satisfying, like uncorking a bottle',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.03);
        gain.gain.setValueAtTime(0.5, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
        osc.connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.08);
        // Air hiss
        const buf = ac.createBuffer(1, ac.sampleRate * 0.04, ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2) * 0.15;
        }
        const src = ac.createBufferSource();
        src.buffer = buf;
        src.connect(ac.destination);
        src.start(ac.currentTime + 0.02);
      }),
  },
  {
    name: 'Coin Drop',
    desc: 'Bright ring with bounce — a coin on a table',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        [0, 0.08, 0.14, 0.18].forEach((delay, i) => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'sine';
          osc.frequency.value = 3500 + i * 200;
          const vol = 0.2 * Math.pow(0.55, i);
          gain.gain.setValueAtTime(vol, t + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.06);
          osc.connect(gain).connect(ac.destination);
          osc.start(t + delay);
          osc.stop(t + delay + 0.06);
        });
      }),
  },
  {
    name: 'Muffled Knock',
    desc: 'Deep filtered tap — knocking on a heavy door',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const filter = ac.createBiquadFilter();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ac.currentTime + 0.04);
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        gain.gain.setValueAtTime(0.55, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
        osc.connect(filter).connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.12);
      }),
  },
  {
    name: 'Spur Jingle',
    desc: 'Light metallic shimmer — cavalry spur rattle',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        [4200, 5100, 3800].forEach((freq, i) => {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.07, t + i * 0.012);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.012 + 0.12);
          osc.connect(gain).connect(ac.destination);
          osc.start(t + i * 0.012);
          osc.stop(t + i * 0.012 + 0.12);
        });
      }),
  },
  {
    name: 'Tight Snap',
    desc: 'Ultra-short noise pop — minimal and precise',
    play: () =>
      playSynth((ac) => {
        const buf = ac.createBuffer(1, ac.sampleRate * 0.006, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 15);
        }
        const src = ac.createBufferSource();
        const gain = ac.createGain();
        src.buffer = buf;
        gain.gain.value = 0.6;
        src.connect(gain).connect(ac.destination);
        src.start();
      }),
  },
  {
    name: 'Canteen Clunk',
    desc: 'Hollow metallic thud — tin canteen set down',
    play: () =>
      playSynth((ac) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ac.currentTime + 0.04);
        gain.gain.setValueAtTime(0.35, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.09);
        // Slight resonance
        const filter = ac.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = 800;
        filter.Q.value = 8;
        filter.gain.value = 6;
        osc.connect(filter).connect(gain).connect(ac.destination);
        osc.start();
        osc.stop(ac.currentTime + 0.09);
      }),
  },
  {
    name: 'Map Thump',
    desc: 'Soft authoritative pat — hand on a campaign map',
    play: () =>
      playSynth((ac) => {
        const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
        }
        const src = ac.createBufferSource();
        const filter = ac.createBiquadFilter();
        const gain = ac.createGain();
        src.buffer = buf;
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        gain.gain.value = 0.5;
        src.connect(filter).connect(gain).connect(ac.destination);
        src.start();
      }),
  },
];

// ---- Melee hit sound candidates ----

function makeNoise(ac: AudioContext, duration: number): AudioBufferSourceNode {
  const buf = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  return src;
}

const hitSounds: { name: string; desc: string; play: () => void }[] = [
  {
    name: 'Blade Slash',
    desc: 'Sharp filtered noise sweep — classic sword hit',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.25);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 2000;
        bp.Q.value = 2;
        bp.frequency.exponentialRampToValueAtTime(400, t + 0.2);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        noise.connect(bp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.25);
      }),
  },
  {
    name: 'Heavy Impact',
    desc: 'Low thud with crunch — blunt force',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        // Thud
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 120;
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        const g1 = ac.createGain();
        g1.gain.setValueAtTime(0.5, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(g1).connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.15);
        // Crunch
        const noise = makeNoise(ac, 0.12);
        const hp = ac.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 800;
        const g2 = ac.createGain();
        g2.gain.setValueAtTime(0.35, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        noise.connect(hp).connect(g2).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.12);
      }),
  },
  {
    name: 'Metal Clash',
    desc: 'Resonant metallic ring — bayonet on steel',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 1800;
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1800;
        bp.Q.value = 12;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(bp).connect(gain).connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.2);
        // Noise crack
        const noise = makeNoise(ac, 0.06);
        const g2 = ac.createGain();
        g2.gain.setValueAtTime(0.4, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        noise.connect(g2).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.06);
      }),
  },
  {
    name: 'Sharp Cut',
    desc: 'Quick high-freq burst — fast precise slice',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.1);
        const hp = ac.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 3000;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        noise.connect(hp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.1);
      }),
  },
  {
    name: 'Bayonet Pierce',
    desc: 'Mid-freq punch with short decay — stabbing thrust',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const osc = ac.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 600;
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain).connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.12);
        // Noise layer
        const noise = makeNoise(ac, 0.08);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1200;
        bp.Q.value = 3;
        const g2 = ac.createGain();
        g2.gain.setValueAtTime(0.3, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        noise.connect(bp).connect(g2).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.08);
      }),
  },
  {
    name: 'Bone Crack',
    desc: 'Low crackle with sharp attack — brutal butt strike',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.15);
        const lp = ac.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 1500;
        lp.frequency.exponentialRampToValueAtTime(200, t + 0.15);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.55, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        noise.connect(lp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.15);
        // Pop
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 200;
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);
        const g2 = ac.createGain();
        g2.gain.setValueAtTime(0.4, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(g2).connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      }),
  },
];

// ---- Melee miss sound candidates ----

const missSounds: { name: string; desc: string; play: () => void }[] = [
  {
    name: 'Quick Whoosh',
    desc: 'Fast bandpass sweep — blade through air',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.2);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 400;
        bp.Q.value = 1.5;
        bp.frequency.exponentialRampToValueAtTime(2500, t + 0.12);
        bp.frequency.exponentialRampToValueAtTime(300, t + 0.2);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        noise.connect(bp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.2);
      }),
  },
  {
    name: 'Air Swipe',
    desc: 'Wider sweep, sharper attack — aggressive swing',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.18);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 600;
        bp.Q.value = 1;
        bp.frequency.exponentialRampToValueAtTime(3500, t + 0.08);
        bp.frequency.exponentialRampToValueAtTime(500, t + 0.18);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        noise.connect(bp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.18);
      }),
  },
  {
    name: 'Near Miss',
    desc: 'Low subtle whoosh — close but no contact',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.25);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 300;
        bp.Q.value = 0.8;
        bp.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
        bp.frequency.exponentialRampToValueAtTime(200, t + 0.25);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.25, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        noise.connect(bp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.25);
      }),
  },
  {
    name: 'Whiff',
    desc: 'Very short breath of air — fumbled swing',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.1);
        const hp = ac.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 1500;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        noise.connect(hp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.1);
      }),
  },
  {
    name: 'Wind Cut',
    desc: 'Higher pitched sweep — fast overhead swing',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.15);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 800;
        bp.Q.value = 2;
        bp.frequency.exponentialRampToValueAtTime(4000, t + 0.06);
        bp.frequency.exponentialRampToValueAtTime(600, t + 0.15);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        noise.connect(bp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.15);
      }),
  },
  {
    name: 'Heavy Swing',
    desc: 'Low rumbling whoosh — slow powerful miss',
    play: () =>
      playSynth((ac) => {
        const t = ac.currentTime;
        const noise = makeNoise(ac, 0.3);
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 200;
        bp.Q.value = 0.7;
        bp.frequency.linearRampToValueAtTime(1000, t + 0.15);
        bp.frequency.exponentialRampToValueAtTime(150, t + 0.3);
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        noise.connect(bp).connect(gain).connect(ac.destination);
        noise.start(t);
        noise.stop(t + 0.3);
      }),
  },
];

// ---- Render the test screen modules ----

function renderClickSoundModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Button Click Sounds</h2>
    <p class="test-module-desc">Click each button to hear a candidate UI click sound.</p>
    <div class="test-sample-grid" id="test-click-grid"></div>
  `;
  container.appendChild(section);

  const grid = section.querySelector('#test-click-grid')!;
  for (const sound of clickSounds) {
    const btn = document.createElement('button');
    btn.className = 'test-sample-btn';
    btn.innerHTML = `
      <span class="test-sample-name">${sound.name}</span>
      <span class="test-sample-desc">${sound.desc}</span>
    `;
    btn.addEventListener('click', () => {
      sound.play();
      // Brief highlight
      btn.classList.add('test-sample-active');
      setTimeout(() => btn.classList.remove('test-sample-active'), 200);
    });
    grid.appendChild(btn);
  }
}

function renderHitSoundModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Melee Hit Sounds</h2>
    <p class="test-module-desc">Candidate sounds for when a melee attack connects (slash/impact).</p>
    <div class="test-sample-grid" id="test-hit-grid"></div>
  `;
  container.appendChild(section);

  const grid = section.querySelector('#test-hit-grid')!;
  for (const sound of hitSounds) {
    const btn = document.createElement('button');
    btn.className = 'test-sample-btn';
    btn.innerHTML = `
      <span class="test-sample-name">${sound.name}</span>
      <span class="test-sample-desc">${sound.desc}</span>
    `;
    btn.addEventListener('click', () => {
      sound.play();
      btn.classList.add('test-sample-active');
      setTimeout(() => btn.classList.remove('test-sample-active'), 200);
    });
    grid.appendChild(btn);
  }
}

function renderMissSoundModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Melee Miss Sounds</h2>
    <p class="test-module-desc">Candidate sounds for when a melee attack misses (whoosh/air).</p>
    <div class="test-sample-grid" id="test-miss-grid"></div>
  `;
  container.appendChild(section);

  const grid = section.querySelector('#test-miss-grid')!;
  for (const sound of missSounds) {
    const btn = document.createElement('button');
    btn.className = 'test-sample-btn';
    btn.innerHTML = `
      <span class="test-sample-name">${sound.name}</span>
      <span class="test-sample-desc">${sound.desc}</span>
    `;
    btn.addEventListener('click', () => {
      sound.play();
      btn.classList.add('test-sample-active');
      setTimeout(() => btn.classList.remove('test-sample-active'), 200);
    });
    grid.appendChild(btn);
  }
}

// ---- Camp SVG Art demos ----

function renderCampArtModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Camp Scene Art</h2>
    <p class="test-module-desc">SVG art options for the camp screen background.</p>
    <div id="test-art-demos"></div>
  `;
  container.appendChild(section);

  const demos = section.querySelector('#test-art-demos')!;

  // === Art 1: Campfire Bivouac ===
  const a1 = document.createElement('div');
  a1.className = 'art-demo';
  a1.innerHTML = `
    <h3 class="meter-demo-label">1. Campfire Bivouac</h3>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
        <defs>
          <!-- Fire glow gradient -->
          <radialGradient id="fireGlow" cx="400" cy="310" r="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#b8661a" stop-opacity="0.35"/>
            <stop offset="40%" stop-color="#8b4513" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#0a0908" stop-opacity="0"/>
          </radialGradient>
          <!-- Ground glow from fire -->
          <radialGradient id="groundGlow" cx="400" cy="360" r="250" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#3d2010" stop-opacity="1"/>
            <stop offset="50%" stop-color="#1a1008" stop-opacity="1"/>
            <stop offset="100%" stop-color="#0a0908" stop-opacity="1"/>
          </radialGradient>
          <!-- Sky gradient -->
          <linearGradient id="nightSky1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#070b14"/>
            <stop offset="60%" stop-color="#0d1520"/>
            <stop offset="100%" stop-color="#111a28"/>
          </linearGradient>
          <!-- Ember particle -->
          <radialGradient id="ember">
            <stop offset="0%" stop-color="#ffcc44" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
          <!-- Smoke -->
          <radialGradient id="smoke">
            <stop offset="0%" stop-color="#555" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#333" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Sky -->
        <rect width="800" height="400" fill="url(#nightSky1)"/>

        <!-- Stars -->
        <circle cx="120" cy="30" r="1.2" fill="#c8c0a8" opacity="0.7"/>
        <circle cx="230" cy="55" r="0.8" fill="#c8c0a8" opacity="0.5"/>
        <circle cx="340" cy="18" r="1.0" fill="#c8c0a8" opacity="0.8"/>
        <circle cx="500" cy="42" r="1.3" fill="#c8c0a8" opacity="0.6"/>
        <circle cx="580" cy="25" r="0.7" fill="#c8c0a8" opacity="0.9"/>
        <circle cx="650" cy="60" r="1.1" fill="#c8c0a8" opacity="0.5"/>
        <circle cx="710" cy="15" r="0.9" fill="#c8c0a8" opacity="0.7"/>
        <circle cx="80" cy="70" r="0.6" fill="#c8c0a8" opacity="0.4"/>
        <circle cx="450" cy="75" r="1.0" fill="#c8c0a8" opacity="0.6"/>
        <circle cx="180" cy="95" r="0.8" fill="#c8c0a8" opacity="0.3"/>
        <circle cx="620" cy="88" r="0.7" fill="#c8c0a8" opacity="0.5"/>
        <circle cx="55" cy="48" r="1.1" fill="#c8c0a8" opacity="0.6"/>
        <circle cx="760" cy="52" r="0.9" fill="#c8c0a8" opacity="0.4"/>
        <circle cx="290" cy="82" r="0.6" fill="#c8c0a8" opacity="0.7"/>

        <!-- Distant treeline silhouette -->
        <path d="M0,200 C20,185 40,190 60,180 C80,170 90,185 110,175
                 C130,165 140,178 160,170 C180,160 195,172 215,165
                 C235,158 245,168 265,162 C285,155 295,165 320,158
                 C340,150 355,163 380,155 C400,148 415,160 440,152
                 C460,145 475,157 500,150 C520,143 535,155 560,148
                 C580,140 595,152 620,145 C640,138 660,150 680,142
                 C700,135 720,148 740,140 C755,135 770,145 790,138 L800,138 L800,220 L0,220 Z"
              fill="#0c1118" opacity="0.9"/>

        <!-- Rolling ground -->
        <path d="M0,280 Q100,260 200,275 Q300,290 400,270 Q500,250 600,268 Q700,285 800,265 L800,400 L0,400 Z"
              fill="url(#groundGlow)"/>

        <!-- Fire ambient glow on the scene -->
        <rect x="150" y="150" width="500" height="250" fill="url(#fireGlow)"/>

        <!-- Smoke wisps rising -->
        <ellipse cx="395" cy="180" rx="30" ry="50" fill="url(#smoke)"/>
        <ellipse cx="410" cy="130" rx="22" ry="40" fill="url(#smoke)"/>
        <ellipse cx="388" cy="90" rx="18" ry="35" fill="url(#smoke)"/>

        <!-- Campfire logs -->
        <line x1="375" y1="335" x2="425" y2="325" stroke="#2a1a0a" stroke-width="5" stroke-linecap="round"/>
        <line x1="380" y1="325" x2="420" y2="335" stroke="#2a1a0a" stroke-width="4" stroke-linecap="round"/>
        <line x1="385" y1="332" x2="415" y2="332" stroke="#1a1005" stroke-width="4" stroke-linecap="round"/>

        <!-- Fire flames (layered shapes) -->
        <path d="M400,270 Q392,295 385,320 Q393,310 400,300 Q407,310 415,320 Q408,295 400,270Z"
              fill="#dd6611" opacity="0.9">
          <animate attributeName="d"
            values="M400,270 Q392,295 385,320 Q393,310 400,300 Q407,310 415,320 Q408,295 400,270Z;
                    M400,265 Q390,292 383,320 Q392,308 400,296 Q408,308 417,320 Q410,292 400,265Z;
                    M400,270 Q392,295 385,320 Q393,310 400,300 Q407,310 415,320 Q408,295 400,270Z"
            dur="0.8s" repeatCount="indefinite"/>
        </path>
        <path d="M400,280 Q395,300 390,318 Q396,308 400,298 Q404,308 410,318 Q405,300 400,280Z"
              fill="#ee9922" opacity="0.85">
          <animate attributeName="d"
            values="M400,280 Q395,300 390,318 Q396,308 400,298 Q404,308 410,318 Q405,300 400,280Z;
                    M400,276 Q394,298 388,318 Q395,306 400,295 Q405,306 412,318 Q406,298 400,276Z;
                    M400,280 Q395,300 390,318 Q396,308 400,298 Q404,308 410,318 Q405,300 400,280Z"
            dur="0.6s" repeatCount="indefinite"/>
        </path>
        <path d="M400,290 Q397,305 394,316 Q398,308 400,300 Q402,308 406,316 Q403,305 400,290Z"
              fill="#ffcc44" opacity="0.8">
          <animate attributeName="d"
            values="M400,290 Q397,305 394,316 Q398,308 400,300 Q402,308 406,316 Q403,305 400,290Z;
                    M400,287 Q396,303 393,316 Q397,306 400,297 Q403,306 407,316 Q404,303 400,287Z;
                    M400,290 Q397,305 394,316 Q398,308 400,300 Q402,308 406,316 Q403,305 400,290Z"
            dur="0.5s" repeatCount="indefinite"/>
        </path>

        <!-- Fire base glow -->
        <ellipse cx="400" cy="330" rx="25" ry="6" fill="#cc5500" opacity="0.4">
          <animate attributeName="rx" values="25;28;25" dur="0.7s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.5;0.4" dur="0.7s" repeatCount="indefinite"/>
        </ellipse>

        <!-- Embers rising -->
        <circle cx="395" cy="260" r="1.5" fill="#ffaa22" opacity="0.8">
          <animate attributeName="cy" values="270;230;190" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="395;390;388" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="405" cy="255" r="1.0" fill="#ff8811" opacity="0.7">
          <animate attributeName="cy" values="265;220;175" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.4;0" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="405;410;415" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="400" cy="262" r="1.2" fill="#ffcc44" opacity="0.6">
          <animate attributeName="cy" values="268;215;160" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="400;397;393" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="398" cy="258" r="0.8" fill="#ff9933" opacity="0.7">
          <animate attributeName="cy" values="266;225;185" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.4;0" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="398;403;408" dur="1.8s" repeatCount="indefinite"/>
        </circle>

        <!-- === SOLDIERS — all seated facing fire, backs to viewer, tricorn hats === -->

        <!-- Soldier 1 (left): seated facing right toward fire, leaning forward -->
        <g fill="#0e0e10">
          <!-- Legs crossed/tucked -->
          <path d="M290,340 Q298,332 310,338 Q315,342 320,345 L285,345 Z"/>
          <!-- Torso — broad back, coat tails spread on ground -->
          <path d="M292,338 Q290,320 294,305 Q296,296 300,290 L314,290 Q310,296 308,305 Q306,320 308,338 Z"/>
          <!-- Coat tails fanning out -->
          <path d="M290,335 Q285,340 282,348 L295,345 Z" fill="#0c0c0e"/>
          <path d="M310,335 Q315,340 318,348 L305,345 Z" fill="#0c0c0e"/>
          <!-- Crossbelt on back (X-shape, lighter) -->
          <line x1="296" y1="295" x2="312" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="312" y1="295" x2="296" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <!-- Cartridge box on belt (small rectangle at lower back) -->
          <rect x="300" y="322" width="8" height="6" rx="1" fill="#141416"/>
          <!-- Neck -->
          <rect x="302" y="285" width="5" height="6" fill="#0e0e10"/>
          <!-- Head (slightly turned right toward fire) -->
          <ellipse cx="307" cy="279" rx="8" ry="9"/>
          <!-- Tricorn hat — seen from behind, wide brim with three distinctive folds -->
          <path d="M293,276 Q300,268 307,265 Q314,268 321,276 Q314,273 307,272 Q300,273 293,276 Z" fill="#0c0c0e"/>
          <!-- Tricorn upturned sides -->
          <path d="M290,278 Q292,270 298,266 L295,275 Z" fill="#0a0a0c"/>
          <path d="M324,278 Q322,270 316,266 L319,275 Z" fill="#0a0a0c"/>
          <!-- Tricorn cockade (small circle on back) -->
          <circle cx="307" cy="270" r="2.5" fill="#141418"/>
          <!-- Arms — reaching toward fire warming hands -->
          <path d="M312,298 Q325,302 340,308 L342,312 Q326,308 312,304 Z"/>
          <path d="M296,298 Q308,304 325,310 L324,314 Q306,308 295,302 Z"/>
          <!-- Musket propped beside him -->
          <line x1="280" y1="345" x2="286" y2="248" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Musket details — barrel end -->
          <line x1="286" y1="252" x2="287" y2="242" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
          <!-- Bayonet -->
          <line x1="287" y1="242" x2="288" y2="234" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
        </g>

        <!-- Soldier 2 (center-left): seated facing right, upright posture -->
        <g fill="#0e0e10">
          <!-- Legs -->
          <path d="M340,342 Q348,334 358,340 Q363,344 365,348 L335,348 Z"/>
          <!-- Torso — square shouldered -->
          <path d="M342,340 Q340,318 343,305 Q345,296 349,290 L363,290 Q359,296 357,305 Q354,318 356,340 Z"/>
          <!-- Coat tails -->
          <path d="M340,338 Q336,343 333,350 L344,346 Z" fill="#0c0c0e"/>
          <!-- Crossbelts -->
          <line x1="346" y1="295" x2="360" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="360" y1="295" x2="346" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <!-- Cartridge box -->
          <rect x="349" y="322" width="8" height="6" rx="1" fill="#141416"/>
          <!-- Neck -->
          <rect x="352" y="285" width="5" height="6" fill="#0e0e10"/>
          <!-- Head -->
          <ellipse cx="357" cy="279" rx="8" ry="9"/>
          <!-- Tricorn -->
          <path d="M343,276 Q350,268 357,265 Q364,268 371,276 Q364,273 357,272 Q350,273 343,276 Z" fill="#0c0c0e"/>
          <path d="M340,278 Q342,270 348,266 L345,275 Z" fill="#0a0a0c"/>
          <path d="M374,278 Q372,270 366,266 L369,275 Z" fill="#0a0a0c"/>
          <circle cx="357" cy="270" r="2.5" fill="#141418"/>
          <!-- Arms resting on knees -->
          <path d="M345,305 Q342,318 340,328 L344,330 Q345,320 347,308 Z"/>
          <path d="M360,305 Q363,318 365,328 L361,330 Q360,320 358,308 Z"/>
        </g>

        <!-- Soldier 3 (center-right): seated facing left toward fire, slightly hunched -->
        <g fill="#0e0e10">
          <!-- Legs -->
          <path d="M460,342 Q452,334 442,340 Q437,344 435,348 L465,348 Z"/>
          <!-- Torso — hunched slightly forward -->
          <path d="M458,340 Q460,318 457,303 Q454,294 450,288 L436,290 Q440,296 443,305 Q446,318 444,340 Z"/>
          <!-- Coat tails -->
          <path d="M460,338 Q464,343 467,350 L456,346 Z" fill="#0c0c0e"/>
          <!-- Crossbelts -->
          <line x1="453" y1="295" x2="439" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="439" y1="295" x2="453" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <!-- Cartridge box -->
          <rect x="442" y="322" width="8" height="6" rx="1" fill="#141416"/>
          <!-- Neck -->
          <rect x="443" y="283" width="5" height="6" fill="#0e0e10"/>
          <!-- Head (turned left toward fire) -->
          <ellipse cx="443" cy="277" rx="8" ry="9"/>
          <!-- Tricorn -->
          <path d="M457,274 Q450,266 443,263 Q436,266 429,274 Q436,271 443,270 Q450,271 457,274 Z" fill="#0c0c0e"/>
          <path d="M460,276 Q458,268 452,264 L455,273 Z" fill="#0a0a0c"/>
          <path d="M426,276 Q428,268 434,264 L431,273 Z" fill="#0a0a0c"/>
          <circle cx="443" cy="268" r="2.5" fill="#141418"/>
          <!-- Arms — one propping chin, contemplative -->
          <path d="M438,298 Q430,305 425,310 Q422,308 428,300 Q434,294 438,295 Z"/>
          <path d="M450,300 Q455,312 458,325 L454,326 Q452,314 448,303 Z"/>
          <!-- Canteen on the ground beside him -->
          <ellipse cx="470" cy="342" rx="6" ry="4" fill="#111114"/>
          <line x1="466" y1="340" x2="474" y2="340" stroke="#1a1a1e" stroke-width="1"/>
        </g>

        <!-- Soldier 4 (right): seated facing left, holding musket upright -->
        <g fill="#0e0e10">
          <!-- Legs -->
          <path d="M505,342 Q497,334 487,340 Q482,344 480,348 L510,348 Z"/>
          <!-- Torso -->
          <path d="M503,340 Q505,318 502,305 Q500,296 496,290 L482,290 Q486,296 488,305 Q490,318 488,340 Z"/>
          <!-- Coat tails -->
          <path d="M505,338 Q509,343 512,350 L501,346 Z" fill="#0c0c0e"/>
          <path d="M487,338 Q483,343 480,350 L491,346 Z" fill="#0c0c0e"/>
          <!-- Crossbelts -->
          <line x1="499" y1="295" x2="485" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="485" y1="295" x2="499" y2="325" stroke="#1a1a1e" stroke-width="2"/>
          <!-- Cartridge box -->
          <rect x="488" y="322" width="8" height="6" rx="1" fill="#141416"/>
          <!-- Neck -->
          <rect x="489" y="285" width="5" height="6" fill="#0e0e10"/>
          <!-- Head -->
          <ellipse cx="489" cy="279" rx="8" ry="9"/>
          <!-- Tricorn -->
          <path d="M503,276 Q496,268 489,265 Q482,268 475,276 Q482,273 489,272 Q496,273 503,276 Z" fill="#0c0c0e"/>
          <path d="M506,278 Q504,270 498,266 L501,275 Z" fill="#0a0a0c"/>
          <path d="M472,278 Q474,270 480,266 L477,275 Z" fill="#0a0a0c"/>
          <circle cx="489" cy="270" r="2.5" fill="#141418"/>
          <!-- Left arm holding musket upright -->
          <path d="M485,298 Q480,305 478,315 L482,316 Q483,306 487,300 Z"/>
          <!-- Right arm resting -->
          <path d="M498,300 Q502,312 504,325 L500,326 Q499,314 496,303 Z"/>
          <!-- Musket held upright beside him -->
          <line x1="476" y1="345" x2="473" y2="248" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="473" y1="252" x2="472" y2="242" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="472" y1="242" x2="471" y2="234" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
        </g>

        <!-- Stacked muskets between the two groups -->
        <g stroke="#111114" stroke-width="2.2" stroke-linecap="round" fill="none">
          <line x1="375" y1="348" x2="380" y2="250"/>
          <line x1="383" y1="348" x2="380" y2="250"/>
          <line x1="420" y1="348" x2="418" y2="250"/>
          <line x1="426" y1="348" x2="420" y2="250"/>
        </g>
        <!-- Bayonet tips catching firelight -->
        <line x1="380" y1="250" x2="381" y2="240" stroke="#22222a" stroke-width="1"/>
        <line x1="418" y1="250" x2="419" y2="240" stroke="#22222a" stroke-width="1"/>
        <circle cx="381" cy="241" r="0.8" fill="#cc8833" opacity="0.3"/>
        <circle cx="419" cy="241" r="0.8" fill="#cc8833" opacity="0.3"/>

        <!-- Distant campfires on the hillside -->
        <circle cx="150" cy="210" r="2" fill="#cc6600" opacity="0.3"/>
        <circle cx="150" cy="210" r="1" fill="#ffaa33" opacity="0.5"/>
        <circle cx="650" cy="205" r="2" fill="#cc6600" opacity="0.25"/>
        <circle cx="650" cy="205" r="1" fill="#ffaa33" opacity="0.4"/>
        <circle cx="720" cy="198" r="1.5" fill="#cc6600" opacity="0.2"/>
        <circle cx="720" cy="198" r="0.8" fill="#ffaa33" opacity="0.35"/>
        <circle cx="100" cy="215" r="1.5" fill="#cc6600" opacity="0.2"/>

        <!-- Foreground grass/scrub hints -->
        <path d="M0,380 Q10,370 20,380 Q30,370 40,382 Q50,372 60,380" stroke="#1a1a10" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M700,375 Q710,365 720,377 Q730,367 740,378 Q750,368 760,376" stroke="#1a1a10" stroke-width="1" fill="none" opacity="0.4"/>
      </svg>
    </div>
  `;
  demos.appendChild(a1);

  // === Art 2: Mountain Ridge at Night ===
  const a2 = document.createElement('div');
  a2.className = 'art-demo';
  a2.innerHTML = `
    <h3 class="meter-demo-label">2. Mountain Ridge at Night</h3>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
        <defs>
          <!-- Deep night sky -->
          <linearGradient id="alpsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#050a18"/>
            <stop offset="40%" stop-color="#0a1228"/>
            <stop offset="100%" stop-color="#101830"/>
          </linearGradient>
          <!-- Moon glow -->
          <radialGradient id="moonGlow" cx="680" cy="60" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#aabbcc" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
          </radialGradient>
          <!-- Valley mist -->
          <linearGradient id="valleyMist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a2540" stop-opacity="0"/>
            <stop offset="60%" stop-color="#1a2540" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#0e1520" stop-opacity="0.6"/>
          </linearGradient>
          <!-- Campfire glow for distant fires -->
          <radialGradient id="distantFire">
            <stop offset="0%" stop-color="#ffaa33" stop-opacity="0.7"/>
            <stop offset="50%" stop-color="#cc6600" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#cc6600" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Sky -->
        <rect width="800" height="400" fill="url(#alpsSky)"/>

        <!-- Stars — dense field -->
        <circle cx="45" cy="22" r="1.0" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="95" cy="45" r="0.6" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="130" cy="15" r="1.3" fill="#d0c8b8" opacity="0.8"/>
        <circle cx="175" cy="58" r="0.8" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="210" cy="28" r="0.7" fill="#d0c8b8" opacity="0.6"/>
        <circle cx="260" cy="12" r="1.1" fill="#d0c8b8" opacity="0.9"/>
        <circle cx="290" cy="48" r="0.6" fill="#d0c8b8" opacity="0.3"/>
        <circle cx="330" cy="32" r="0.9" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="370" cy="8" r="1.2" fill="#d0c8b8" opacity="0.6"/>
        <circle cx="410" cy="52" r="0.7" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="460" cy="20" r="1.0" fill="#d0c8b8" opacity="0.8"/>
        <circle cx="510" cy="40" r="0.8" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="550" cy="18" r="1.1" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="590" cy="55" r="0.6" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="630" cy="30" r="0.9" fill="#d0c8b8" opacity="0.6"/>
        <circle cx="700" cy="38" r="0.7" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="750" cy="15" r="1.0" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="160" cy="80" r="0.5" fill="#d0c8b8" opacity="0.3"/>
        <circle cx="420" cy="72" r="0.8" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="540" cy="68" r="0.6" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="75" cy="65" r="0.7" fill="#d0c8b8" opacity="0.35"/>
        <circle cx="780" cy="48" r="0.5" fill="#d0c8b8" opacity="0.4"/>

        <!-- Crescent moon -->
        <circle cx="680" cy="55" r="12" fill="#c8c0a0" opacity="0.9"/>
        <circle cx="686" cy="51" r="10" fill="#050a18"/>
        <!-- Moon glow -->
        <circle cx="680" cy="55" r="80" fill="url(#moonGlow)"/>

        <!-- Mountain range — far back (lightest) -->
        <path d="M0,220 L40,180 L80,200 L140,150 L180,170 L230,120 L280,155
                 L320,130 L370,160 L420,110 L470,145 L510,125 L550,155
                 L600,105 L650,140 L690,120 L730,150 L770,135 L800,160 L800,400 L0,400 Z"
              fill="#0e1525" opacity="0.7"/>

        <!-- Mountain range — middle (darker, taller peaks) -->
        <path d="M0,260 L30,230 L70,245 L120,190 L160,220 L200,175
                 L260,210 L300,165 L350,200 L400,155 L440,185
                 L490,160 L530,195 L580,148 L630,180 L670,155
                 L720,190 L760,170 L800,200 L800,400 L0,400 Z"
              fill="#0c1220" opacity="0.85"/>

        <!-- Snow caps on the tallest peaks -->
        <path d="M228,120 L220,135 L238,135 Z" fill="#2a3050" opacity="0.5"/>
        <path d="M418,110 L410,125 L428,125 Z" fill="#2a3050" opacity="0.5"/>
        <path d="M578,148 L570,162 L588,162 Z" fill="#2a3050" opacity="0.5"/>
        <path d="M298,165 L290,178 L308,178 Z" fill="#2a3050" opacity="0.4"/>

        <!-- Mountain range — foreground (darkest) -->
        <path d="M0,310 L50,280 L100,295 L150,260 L200,285
                 L260,250 L310,275 L360,245 L410,270 L450,252
                 L500,275 L550,248 L600,268 L650,242 L700,265
                 L750,255 L800,275 L800,400 L0,400 Z"
              fill="#0a0e18"/>

        <!-- Valley floor -->
        <path d="M0,340 Q100,330 200,345 Q300,355 400,338 Q500,325 600,342 Q700,355 800,335 L800,400 L0,400 Z"
              fill="#080c14"/>

        <!-- Valley mist layer -->
        <rect x="0" y="300" width="800" height="100" fill="url(#valleyMist)"/>

        <!-- Distant campfires scattered on the slopes -->
        <!-- Cluster 1 — left slope -->
        <circle cx="120" cy="288" r="4" fill="url(#distantFire)"/>
        <circle cx="120" cy="288" r="1.2" fill="#ffcc44" opacity="0.8"/>
        <circle cx="140" cy="282" r="3" fill="url(#distantFire)"/>
        <circle cx="140" cy="282" r="0.8" fill="#ffcc44" opacity="0.7"/>
        <circle cx="108" cy="292" r="2.5" fill="url(#distantFire)"/>
        <circle cx="108" cy="292" r="0.7" fill="#ffaa33" opacity="0.6"/>

        <!-- Cluster 2 — center-left -->
        <circle cx="280" cy="268" r="3.5" fill="url(#distantFire)"/>
        <circle cx="280" cy="268" r="1.0" fill="#ffcc44" opacity="0.8"/>
        <circle cx="300" cy="272" r="3" fill="url(#distantFire)"/>
        <circle cx="300" cy="272" r="0.8" fill="#ffaa33" opacity="0.7"/>

        <!-- Cluster 3 — center -->
        <circle cx="430" cy="265" r="4" fill="url(#distantFire)"/>
        <circle cx="430" cy="265" r="1.2" fill="#ffcc44" opacity="0.9"/>
        <circle cx="450" cy="260" r="3" fill="url(#distantFire)"/>
        <circle cx="450" cy="260" r="0.8" fill="#ffcc44" opacity="0.7"/>
        <circle cx="415" cy="270" r="2.5" fill="url(#distantFire)"/>
        <circle cx="415" cy="270" r="0.7" fill="#ffaa33" opacity="0.6"/>

        <!-- Cluster 4 — right slope -->
        <circle cx="600" cy="262" r="3.5" fill="url(#distantFire)"/>
        <circle cx="600" cy="262" r="1.0" fill="#ffcc44" opacity="0.8"/>
        <circle cx="620" cy="258" r="2.5" fill="url(#distantFire)"/>
        <circle cx="620" cy="258" r="0.7" fill="#ffaa33" opacity="0.6"/>

        <!-- Cluster 5 — far right -->
        <circle cx="720" cy="260" r="3" fill="url(#distantFire)"/>
        <circle cx="720" cy="260" r="0.9" fill="#ffcc44" opacity="0.7"/>

        <!-- Scattered lone fires -->
        <circle cx="200" cy="280" r="2" fill="url(#distantFire)"/>
        <circle cx="200" cy="280" r="0.6" fill="#ffaa33" opacity="0.5"/>
        <circle cx="520" cy="270" r="2.5" fill="url(#distantFire)"/>
        <circle cx="520" cy="270" r="0.7" fill="#ffcc44" opacity="0.6"/>
        <circle cx="680" cy="255" r="2" fill="url(#distantFire)"/>
        <circle cx="680" cy="255" r="0.6" fill="#ffaa33" opacity="0.5"/>
        <circle cx="350" cy="258" r="2" fill="url(#distantFire)"/>
        <circle cx="350" cy="258" r="0.6" fill="#ffaa33" opacity="0.45"/>

        <!-- Subtle fire flicker animation on main clusters -->
        <circle cx="430" cy="265" r="5" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.3">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="120" cy="288" r="4" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.25">
          <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite"/>
        </circle>

        <!-- Foreground darkness at bottom -->
        <rect x="0" y="370" width="800" height="30" fill="#080c14" opacity="0.9"/>
      </svg>
    </div>
  `;
  demos.appendChild(a2);

  // === Art 3: Combined — Bivouac Foreground + Mountain Panorama ===
  const a3 = document.createElement('div');
  a3.className = 'art-demo';
  a3.innerHTML = `
    <h3 class="meter-demo-label">3. Bivouac on the Plateau</h3>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
        <defs>
          <!-- Deep alpine night sky -->
          <linearGradient id="comboSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#050a18"/>
            <stop offset="40%" stop-color="#0a1228"/>
            <stop offset="100%" stop-color="#101830"/>
          </linearGradient>
          <!-- Moon glow -->
          <radialGradient id="comboMoonGlow" cx="700" cy="50" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#aabbcc" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
          </radialGradient>
          <!-- Fire glow on scene -->
          <radialGradient id="comboFireGlow" cx="400" cy="340" r="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#b8661a" stop-opacity="0.3"/>
            <stop offset="35%" stop-color="#8b4513" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
          </radialGradient>
          <!-- Ground warmth from fire -->
          <radialGradient id="comboGroundGlow" cx="400" cy="380" r="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2a1508" stop-opacity="1"/>
            <stop offset="50%" stop-color="#12100a" stop-opacity="1"/>
            <stop offset="100%" stop-color="#080c14" stop-opacity="1"/>
          </radialGradient>
          <!-- Valley mist -->
          <linearGradient id="comboMist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1a2540" stop-opacity="0"/>
            <stop offset="60%" stop-color="#1a2540" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#0e1520" stop-opacity="0.5"/>
          </linearGradient>
          <!-- Distant fire glow -->
          <radialGradient id="comboDistFire">
            <stop offset="0%" stop-color="#ffaa33" stop-opacity="0.7"/>
            <stop offset="50%" stop-color="#cc6600" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#cc6600" stop-opacity="0"/>
          </radialGradient>
          <!-- Smoke -->
          <radialGradient id="comboSmoke">
            <stop offset="0%" stop-color="#555" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#333" stop-opacity="0"/>
          </radialGradient>
          <!-- Ember -->
          <radialGradient id="comboEmber">
            <stop offset="0%" stop-color="#ffcc44" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- ====== BACKGROUND: Alpine panorama ====== -->

        <!-- Sky -->
        <rect width="800" height="400" fill="url(#comboSky)"/>

        <!-- Stars -->
        <circle cx="45" cy="22" r="1.0" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="95" cy="45" r="0.6" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="130" cy="15" r="1.3" fill="#d0c8b8" opacity="0.8"/>
        <circle cx="175" cy="58" r="0.8" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="210" cy="28" r="0.7" fill="#d0c8b8" opacity="0.6"/>
        <circle cx="260" cy="12" r="1.1" fill="#d0c8b8" opacity="0.9"/>
        <circle cx="290" cy="48" r="0.6" fill="#d0c8b8" opacity="0.3"/>
        <circle cx="330" cy="32" r="0.9" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="370" cy="8" r="1.2" fill="#d0c8b8" opacity="0.6"/>
        <circle cx="410" cy="52" r="0.7" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="460" cy="20" r="1.0" fill="#d0c8b8" opacity="0.8"/>
        <circle cx="510" cy="40" r="0.8" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="550" cy="18" r="1.1" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="590" cy="55" r="0.6" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="630" cy="30" r="0.9" fill="#d0c8b8" opacity="0.6"/>
        <circle cx="700" cy="38" r="0.7" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="750" cy="15" r="1.0" fill="#d0c8b8" opacity="0.7"/>
        <circle cx="160" cy="80" r="0.5" fill="#d0c8b8" opacity="0.3"/>
        <circle cx="420" cy="72" r="0.8" fill="#d0c8b8" opacity="0.4"/>
        <circle cx="540" cy="68" r="0.6" fill="#d0c8b8" opacity="0.5"/>
        <circle cx="75" cy="65" r="0.7" fill="#d0c8b8" opacity="0.35"/>
        <circle cx="780" cy="48" r="0.5" fill="#d0c8b8" opacity="0.4"/>

        <!-- Crescent moon -->
        <circle cx="700" cy="50" r="12" fill="#c8c0a0" opacity="0.9"/>
        <circle cx="706" cy="46" r="10" fill="#050a18"/>
        <circle cx="700" cy="50" r="80" fill="url(#comboMoonGlow)"/>

        <!-- Mountains — far (lightest) -->
        <path d="M0,200 L40,170 L80,185 L140,140 L180,158 L230,115 L280,145
                 L320,125 L370,150 L420,105 L470,135 L510,118 L550,145
                 L600,100 L650,130 L690,115 L730,140 L770,128 L800,150 L800,400 L0,400 Z"
              fill="#0e1525" opacity="0.7"/>

        <!-- Mountains — middle -->
        <path d="M0,240 L30,215 L70,228 L120,180 L160,205 L200,168
                 L260,195 L300,158 L350,185 L400,148 L440,172
                 L490,152 L530,180 L580,142 L630,168 L670,148
                 L720,175 L760,160 L800,185 L800,400 L0,400 Z"
              fill="#0c1220" opacity="0.85"/>

        <!-- Snow caps -->
        <path d="M228,115 L220,128 L238,128 Z" fill="#2a3050" opacity="0.5"/>
        <path d="M418,105 L410,118 L428,118 Z" fill="#2a3050" opacity="0.5"/>
        <path d="M578,142 L570,155 L588,155 Z" fill="#2a3050" opacity="0.5"/>
        <path d="M298,158 L290,170 L308,170 Z" fill="#2a3050" opacity="0.4"/>

        <!-- Mountains — near foreground ridge -->
        <path d="M0,285 L50,260 L100,272 L150,245 L200,265
                 L260,238 L310,258 L360,232 L410,252 L450,238
                 L500,258 L550,235 L600,252 L650,230 L700,250
                 L750,242 L800,258 L800,400 L0,400 Z"
              fill="#0a0e18"/>

        <!-- Valley mist -->
        <rect x="0" y="260" width="800" height="80" fill="url(#comboMist)"/>

        <!-- Distant campfires on the slopes -->
        <circle cx="120" cy="268" r="4" fill="url(#comboDistFire)"/>
        <circle cx="120" cy="268" r="1.2" fill="#ffcc44" opacity="0.8"/>
        <circle cx="140" cy="262" r="3" fill="url(#comboDistFire)"/>
        <circle cx="140" cy="262" r="0.8" fill="#ffcc44" opacity="0.7"/>
        <circle cx="108" cy="272" r="2.5" fill="url(#comboDistFire)"/>
        <circle cx="108" cy="272" r="0.7" fill="#ffaa33" opacity="0.6"/>

        <circle cx="280" cy="252" r="3.5" fill="url(#comboDistFire)"/>
        <circle cx="280" cy="252" r="1.0" fill="#ffcc44" opacity="0.8"/>
        <circle cx="300" cy="255" r="3" fill="url(#comboDistFire)"/>
        <circle cx="300" cy="255" r="0.8" fill="#ffaa33" opacity="0.7"/>

        <circle cx="520" cy="252" r="3.5" fill="url(#comboDistFire)"/>
        <circle cx="520" cy="252" r="1.0" fill="#ffcc44" opacity="0.8"/>

        <circle cx="600" cy="248" r="3.5" fill="url(#comboDistFire)"/>
        <circle cx="600" cy="248" r="1.0" fill="#ffcc44" opacity="0.8"/>
        <circle cx="620" cy="244" r="2.5" fill="url(#comboDistFire)"/>
        <circle cx="620" cy="244" r="0.7" fill="#ffaa33" opacity="0.6"/>

        <circle cx="720" cy="246" r="3" fill="url(#comboDistFire)"/>
        <circle cx="720" cy="246" r="0.9" fill="#ffcc44" opacity="0.7"/>

        <!-- Scattered lone fires -->
        <circle cx="200" cy="262" r="2" fill="url(#comboDistFire)"/>
        <circle cx="200" cy="262" r="0.6" fill="#ffaa33" opacity="0.5"/>
        <circle cx="430" cy="248" r="2.5" fill="url(#comboDistFire)"/>
        <circle cx="430" cy="248" r="0.7" fill="#ffcc44" opacity="0.6"/>
        <circle cx="680" cy="242" r="2" fill="url(#comboDistFire)"/>
        <circle cx="680" cy="242" r="0.6" fill="#ffaa33" opacity="0.5"/>
        <circle cx="350" cy="245" r="2" fill="url(#comboDistFire)"/>
        <circle cx="350" cy="245" r="0.6" fill="#ffaa33" opacity="0.45"/>

        <!-- Distant fire flicker -->
        <circle cx="430" cy="248" r="5" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.3">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="120" cy="268" r="4" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.25">
          <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite"/>
        </circle>

        <!-- ====== FOREGROUND: Plateau ground + campfire + soldiers ====== -->

        <!-- Rolling plateau ground -->
        <path d="M0,310 Q100,295 200,308 Q300,318 400,300 Q500,288 600,302 Q700,315 800,298 L800,400 L0,400 Z"
              fill="url(#comboGroundGlow)"/>

        <!-- Fire ambient glow on the scene -->
        <rect x="100" y="200" width="600" height="200" fill="url(#comboFireGlow)"/>

        <!-- Smoke wisps -->
        <ellipse cx="395" cy="220" rx="25" ry="40" fill="url(#comboSmoke)"/>
        <ellipse cx="408" cy="175" rx="18" ry="32" fill="url(#comboSmoke)"/>
        <ellipse cx="388" cy="140" rx="14" ry="28" fill="url(#comboSmoke)"/>

        <!-- Campfire logs -->
        <line x1="380" y1="355" x2="420" y2="348" stroke="#2a1a0a" stroke-width="5" stroke-linecap="round"/>
        <line x1="385" y1="348" x2="415" y2="355" stroke="#2a1a0a" stroke-width="4" stroke-linecap="round"/>
        <line x1="390" y1="352" x2="410" y2="352" stroke="#1a1005" stroke-width="4" stroke-linecap="round"/>

        <!-- Fire flames -->
        <path d="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z"
              fill="#dd6611" opacity="0.9">
          <animate attributeName="d"
            values="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z;
                    M400,290 Q390,315 383,340 Q392,328 400,316 Q408,328 417,340 Q410,315 400,290Z;
                    M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z"
            dur="0.8s" repeatCount="indefinite"/>
        </path>
        <path d="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z"
              fill="#ee9922" opacity="0.85">
          <animate attributeName="d"
            values="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z;
                    M400,301 Q394,320 388,338 Q395,326 400,315 Q405,326 412,338 Q406,320 400,301Z;
                    M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z"
            dur="0.6s" repeatCount="indefinite"/>
        </path>
        <path d="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z"
              fill="#ffcc44" opacity="0.8">
          <animate attributeName="d"
            values="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z;
                    M400,309 Q396,324 393,336 Q397,326 400,317 Q403,326 407,336 Q404,324 400,309Z;
                    M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z"
            dur="0.5s" repeatCount="indefinite"/>
        </path>

        <!-- Fire base glow -->
        <ellipse cx="400" cy="350" rx="25" ry="6" fill="#cc5500" opacity="0.4">
          <animate attributeName="rx" values="25;28;25" dur="0.7s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.5;0.4" dur="0.7s" repeatCount="indefinite"/>
        </ellipse>

        <!-- Embers rising -->
        <circle cx="395" cy="285" r="1.5" fill="#ffaa22" opacity="0.8">
          <animate attributeName="cy" values="295;255;215" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="395;390;388" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="405" cy="280" r="1.0" fill="#ff8811" opacity="0.7">
          <animate attributeName="cy" values="290;245;200" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.4;0" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="405;410;415" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="400" cy="287" r="1.2" fill="#ffcc44" opacity="0.6">
          <animate attributeName="cy" values="293;240;185" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="400;397;393" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="398" cy="283" r="0.8" fill="#ff9933" opacity="0.7">
          <animate attributeName="cy" values="291;250;210" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.4;0" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="398;403;408" dur="1.8s" repeatCount="indefinite"/>
        </circle>

        <!-- === SOLDIERS — seated facing fire, tricorn hats === -->

        <!-- Soldier 1 (left): leaning forward, warming hands -->
        <g fill="#0e0e10">
          <path d="M290,362 Q298,354 310,360 Q315,364 320,367 L285,367 Z"/>
          <path d="M292,360 Q290,342 294,327 Q296,318 300,312 L314,312 Q310,318 308,327 Q306,342 308,360 Z"/>
          <path d="M290,357 Q285,362 282,370 L295,367 Z" fill="#0c0c0e"/>
          <path d="M310,357 Q315,362 318,370 L305,367 Z" fill="#0c0c0e"/>
          <line x1="296" y1="317" x2="312" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="312" y1="317" x2="296" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <rect x="300" y="344" width="8" height="6" rx="1" fill="#141416"/>
          <rect x="302" y="307" width="5" height="6" fill="#0e0e10"/>
          <ellipse cx="307" cy="301" rx="8" ry="9"/>
          <path d="M293,298 Q300,290 307,287 Q314,290 321,298 Q314,295 307,294 Q300,295 293,298 Z" fill="#0c0c0e"/>
          <path d="M290,300 Q292,292 298,288 L295,297 Z" fill="#0a0a0c"/>
          <path d="M324,300 Q322,292 316,288 L319,297 Z" fill="#0a0a0c"/>
          <circle cx="307" cy="292" r="2.5" fill="#141418"/>
          <path d="M312,320 Q325,324 340,330 L342,334 Q326,330 312,326 Z"/>
          <path d="M296,320 Q308,326 325,332 L324,336 Q306,330 295,324 Z"/>
          <line x1="280" y1="367" x2="286" y2="270" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="286" y1="274" x2="287" y2="264" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="287" y1="264" x2="288" y2="256" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
        </g>

        <!-- Soldier 2 (center-left): upright, arms on knees -->
        <g fill="#0e0e10">
          <path d="M340,364 Q348,356 358,362 Q363,366 365,370 L335,370 Z"/>
          <path d="M342,362 Q340,340 343,327 Q345,318 349,312 L363,312 Q359,318 357,327 Q354,340 356,362 Z"/>
          <path d="M340,360 Q336,365 333,372 L344,368 Z" fill="#0c0c0e"/>
          <line x1="346" y1="317" x2="360" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="360" y1="317" x2="346" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <rect x="349" y="344" width="8" height="6" rx="1" fill="#141416"/>
          <rect x="352" y="307" width="5" height="6" fill="#0e0e10"/>
          <ellipse cx="357" cy="301" rx="8" ry="9"/>
          <path d="M343,298 Q350,290 357,287 Q364,290 371,298 Q364,295 357,294 Q350,295 343,298 Z" fill="#0c0c0e"/>
          <path d="M340,300 Q342,292 348,288 L345,297 Z" fill="#0a0a0c"/>
          <path d="M374,300 Q372,292 366,288 L369,297 Z" fill="#0a0a0c"/>
          <circle cx="357" cy="292" r="2.5" fill="#141418"/>
          <path d="M345,327 Q342,340 340,350 L344,352 Q345,342 347,330 Z"/>
          <path d="M360,327 Q363,340 365,350 L361,352 Q360,342 358,330 Z"/>
        </g>

        <!-- Soldier 3 (center-right): hunched, contemplative -->
        <g fill="#0e0e10">
          <path d="M460,364 Q452,356 442,362 Q437,366 435,370 L465,370 Z"/>
          <path d="M458,362 Q460,340 457,325 Q454,316 450,310 L436,312 Q440,318 443,327 Q446,340 444,362 Z"/>
          <path d="M460,360 Q464,365 467,372 L456,368 Z" fill="#0c0c0e"/>
          <line x1="453" y1="317" x2="439" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="439" y1="317" x2="453" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <rect x="442" y="344" width="8" height="6" rx="1" fill="#141416"/>
          <rect x="443" y="305" width="5" height="6" fill="#0e0e10"/>
          <ellipse cx="443" cy="299" rx="8" ry="9"/>
          <path d="M457,296 Q450,288 443,285 Q436,288 429,296 Q436,293 443,292 Q450,293 457,296 Z" fill="#0c0c0e"/>
          <path d="M460,298 Q458,290 452,286 L455,295 Z" fill="#0a0a0c"/>
          <path d="M426,298 Q428,290 434,286 L431,295 Z" fill="#0a0a0c"/>
          <circle cx="443" cy="290" r="2.5" fill="#141418"/>
          <path d="M438,320 Q430,327 425,332 Q422,330 428,322 Q434,316 438,317 Z"/>
          <path d="M450,322 Q455,334 458,347 L454,348 Q452,336 448,325 Z"/>
          <ellipse cx="470" cy="364" rx="6" ry="4" fill="#111114"/>
          <line x1="466" y1="362" x2="474" y2="362" stroke="#1a1a1e" stroke-width="1"/>
        </g>

        <!-- Soldier 4 (right): holding musket upright -->
        <g fill="#0e0e10">
          <path d="M505,364 Q497,356 487,362 Q482,366 480,370 L510,370 Z"/>
          <path d="M503,362 Q505,340 502,327 Q500,318 496,312 L482,312 Q486,318 488,327 Q490,340 488,362 Z"/>
          <path d="M505,360 Q509,365 512,372 L501,368 Z" fill="#0c0c0e"/>
          <path d="M487,360 Q483,365 480,372 L491,368 Z" fill="#0c0c0e"/>
          <line x1="499" y1="317" x2="485" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <line x1="485" y1="317" x2="499" y2="347" stroke="#1a1a1e" stroke-width="2"/>
          <rect x="488" y="344" width="8" height="6" rx="1" fill="#141416"/>
          <rect x="489" y="307" width="5" height="6" fill="#0e0e10"/>
          <ellipse cx="489" cy="301" rx="8" ry="9"/>
          <path d="M503,298 Q496,290 489,287 Q482,290 475,298 Q482,295 489,294 Q496,295 503,298 Z" fill="#0c0c0e"/>
          <path d="M506,300 Q504,292 498,288 L501,297 Z" fill="#0a0a0c"/>
          <path d="M472,300 Q474,292 480,288 L477,297 Z" fill="#0a0a0c"/>
          <circle cx="489" cy="292" r="2.5" fill="#141418"/>
          <path d="M485,320 Q480,327 478,337 L482,338 Q483,328 487,322 Z"/>
          <path d="M498,322 Q502,334 504,347 L500,348 Q499,336 496,325 Z"/>
          <line x1="476" y1="367" x2="473" y2="270" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="473" y1="274" x2="472" y2="264" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="472" y1="264" x2="471" y2="256" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
        </g>

        <!-- Stacked muskets between groups -->
        <g stroke="#111114" stroke-width="2.2" stroke-linecap="round" fill="none">
          <line x1="375" y1="370" x2="380" y2="272"/>
          <line x1="383" y1="370" x2="380" y2="272"/>
          <line x1="420" y1="370" x2="418" y2="272"/>
          <line x1="426" y1="370" x2="420" y2="272"/>
        </g>
        <line x1="380" y1="272" x2="381" y2="262" stroke="#22222a" stroke-width="1"/>
        <line x1="418" y1="272" x2="419" y2="262" stroke="#22222a" stroke-width="1"/>
        <circle cx="381" cy="263" r="0.8" fill="#cc8833" opacity="0.3"/>
        <circle cx="419" cy="263" r="0.8" fill="#cc8833" opacity="0.3"/>

        <!-- Foreground darkness at edges -->
        <path d="M0,385 Q100,375 200,382 Q300,388 400,378 Q500,372 600,380 Q700,388 800,376 L800,400 L0,400 Z"
              fill="#060a10" opacity="0.8"/>
      </svg>
    </div>
  `;
  demos.appendChild(a3);
}

// ---- Meter style demos ----

const sampleStats = [
  { label: 'Health', value: 72, color: 'var(--health-high)', colorMid: 'var(--health-mid)' },
  { label: 'Stamina', value: 45, color: 'var(--stamina-high)', colorMid: 'var(--stamina-mid)' },
  { label: 'Morale', value: 88, color: 'var(--morale-high)', colorMid: 'var(--morale-mid)' },
];

function renderMeterStylesModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Meter Styles</h2>
    <p class="test-module-desc">Compare status meter designs for the camp screen.</p>
    <div id="test-meter-demos"></div>
  `;
  container.appendChild(section);

  const demos = section.querySelector('#test-meter-demos')!;

  // === Style 1: Segmented Regiment Blocks ===
  const s1 = document.createElement('div');
  s1.className = 'meter-demo';
  s1.innerHTML = `<h3 class="meter-demo-label">1. Segmented Regiment Blocks</h3>`;
  for (const stat of sampleStats) {
    const totalBlocks = 10;
    const filledBlocks = Math.round(stat.value / 10);
    let blocksHtml = '';
    for (let i = 0; i < totalBlocks; i++) {
      const filled = i < filledBlocks;
      blocksHtml += `<span class="seg-block ${filled ? 'seg-filled' : 'seg-empty'}" style="${filled ? `background:${stat.color};` : ''}"></span>`;
    }
    s1.innerHTML += `
      <div class="meter-demo-row">
        <span class="meter-demo-stat-label">${stat.label}</span>
        <div class="seg-blocks">${blocksHtml}</div>
        <span class="meter-demo-stat-value">${stat.value}%</span>
      </div>
    `;
  }
  demos.appendChild(s1);

  // === Style 2: Officer's Ledger ===
  const s2 = document.createElement('div');
  s2.className = 'meter-demo';
  s2.innerHTML = `<h3 class="meter-demo-label">2. Officer's Ledger</h3>`;
  for (const stat of sampleStats) {
    const desc =
      stat.value >= 75
        ? 'STRONG'
        : stat.value >= 40
          ? 'FAIR'
          : stat.value >= 15
            ? 'POOR'
            : 'CRITICAL';
    s2.innerHTML += `
      <div class="meter-demo-row ledger-row">
        <span class="ledger-key">${stat.label}</span>
        <span class="ledger-dots"></span>
        <span class="ledger-desc" style="color:${stat.value >= 40 ? stat.color : 'var(--accent-red-bright)'};">${desc}</span>
        <span class="ledger-num">${stat.value}</span>
      </div>
    `;
  }
  demos.appendChild(s2);

  // === Style 3: Circular Compass Dials ===
  const s3 = document.createElement('div');
  s3.className = 'meter-demo';
  s3.innerHTML = `<h3 class="meter-demo-label">3. Circular Compass Dials</h3>`;
  const dialsRow = document.createElement('div');
  dialsRow.className = 'meter-demo-row dial-row';
  for (const stat of sampleStats) {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (stat.value / 100) * circumference;
    dialsRow.innerHTML += `
      <div class="dial-group">
        <svg class="dial-svg" viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r="${radius}" fill="none" stroke="var(--border-light)" stroke-width="6" />
          <circle cx="40" cy="40" r="${radius}" fill="none" stroke="${stat.color}" stroke-width="6"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 40 40)" />
          <text x="40" y="44" text-anchor="middle" fill="var(--text-primary)" font-size="14" font-family="'EB Garamond', serif">${stat.value}</text>
        </svg>
        <span class="dial-label">${stat.label}</span>
      </div>
    `;
  }
  s3.appendChild(dialsRow);
  demos.appendChild(s3);

  // === Style 4: Thick Ink-Stroke Bars ===
  const s4 = document.createElement('div');
  s4.className = 'meter-demo';
  s4.innerHTML = `<h3 class="meter-demo-label">4. Thick Ink-Stroke Bars</h3>`;
  for (const stat of sampleStats) {
    s4.innerHTML += `
      <div class="meter-demo-row ink-bar-row">
        <div class="ink-bar-track">
          <div class="ink-bar-fill" style="width:${stat.value}%; background:${stat.color};"></div>
          <div class="ink-bar-overlay">
            <span class="ink-bar-label">${stat.label}</span>
            <span class="ink-bar-value">${stat.value}%</span>
          </div>
        </div>
      </div>
    `;
  }
  demos.appendChild(s4);

  // === Style 5: Wax-Seal Pips ===
  const s5 = document.createElement('div');
  s5.className = 'meter-demo';
  s5.innerHTML = `<h3 class="meter-demo-label">5. Wax-Seal Pips</h3>`;
  for (const stat of sampleStats) {
    const totalPips = 10;
    const filledPips = Math.round(stat.value / 10);
    let pipsHtml = '';
    for (let i = 0; i < totalPips; i++) {
      const filled = i < filledPips;
      pipsHtml += `<span class="wax-pip ${filled ? 'wax-filled' : 'wax-empty'}" style="${filled ? `background:${stat.color}; box-shadow: 0 0 4px ${stat.color};` : ''}"></span>`;
    }
    s5.innerHTML += `
      <div class="meter-demo-row">
        <span class="meter-demo-stat-label">${stat.label}</span>
        <div class="wax-pips">${pipsHtml}</div>
        <span class="meter-demo-stat-value">${stat.value}%</span>
      </div>
    `;
  }
  demos.appendChild(s5);
}

// ---- Resolution picker ----

const resolutions = [
  { label: 'Fullscreen', w: 0, h: 0, desc: 'Fill the browser window (default)' },
  { label: '1920 x 1080', w: 1920, h: 1080, desc: 'Full HD — 16:9' },
  { label: '1600 x 900', w: 1600, h: 900, desc: 'HD+ — 16:9' },
  { label: '1366 x 768', w: 1366, h: 768, desc: 'Common laptop — 16:9' },
  { label: '1280 x 720', w: 1280, h: 720, desc: '720p — 16:9' },
  { label: '1024 x 768', w: 1024, h: 768, desc: 'Classic — 4:3' },
  { label: '800 x 600', w: 800, h: 600, desc: 'Compact — 4:3' },
];

let activeResolution = 'Fullscreen';

function applyResolution(w: number, h: number) {
  const game = document.getElementById('game')!;
  if (w === 0 && h === 0) {
    // Fullscreen mode — fill the window
    game.style.width = '';
    game.style.height = '';
    game.style.maxWidth = '';
    game.style.maxHeight = '';
    document.body.classList.remove('fixed-resolution');
  } else {
    game.style.width = w + 'px';
    game.style.height = h + 'px';
    game.style.maxWidth = w + 'px';
    game.style.maxHeight = h + 'px';
    document.body.classList.add('fixed-resolution');
  }
}

function renderResolutionModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Resolution</h2>
    <p class="test-module-desc">Set a fixed canvas size for the game. The active resolution persists until you change it.</p>
    <div class="test-sample-grid" id="test-res-grid"></div>
  `;
  container.appendChild(section);

  const grid = section.querySelector('#test-res-grid')!;
  for (const res of resolutions) {
    const btn = document.createElement('button');
    btn.className = 'test-sample-btn';
    if (res.label === activeResolution) btn.classList.add('test-sample-active');
    btn.innerHTML = `
      <span class="test-sample-name">${res.label}</span>
      <span class="test-sample-desc">${res.desc}</span>
    `;
    btn.addEventListener('click', () => {
      activeResolution = res.label;
      applyResolution(res.w, res.h);
      // Update active state on all buttons
      grid
        .querySelectorAll('.test-sample-btn')
        .forEach((b) => b.classList.remove('test-sample-active'));
      btn.classList.add('test-sample-active');
    });
    grid.appendChild(btn);
  }
}

// ---- Melee Skirmish UI — launch real melee from test screen ----

function buildTestBattleState(): BattleState {
  const maxHp = getHealthPoolSize(45);
  const maxStam = getStaminaPoolSize(40) * 4;
  const player: Player = {
    name: 'Test Soldier',
    valor: 40,
    morale: 85,
    maxMorale: 100,
    moraleThreshold: MoraleThreshold.Steady,
    health: maxHp,
    maxHealth: maxHp,
    healthState: HealthState.Unhurt,
    stamina: maxStam,
    maxStamina: maxStam,
    fatigue: 0,
    maxFatigue: maxStam,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 0,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
  };

  const line: LineState = {
    leftNeighbour: {
      id: 'left',
      name: 'Pierre',
      rank: 'private',
      valor: 55,
      morale: 70,
      maxMorale: 80,
      threshold: MoraleThreshold.Steady,
      alive: true,
      wounded: false,
      routing: false,
      musketLoaded: true,
      relationship: 60,
    },
    rightNeighbour: {
      id: 'right',
      name: 'Jean-Baptiste',
      rank: 'private',
      valor: 20,
      morale: 50,
      maxMorale: 70,
      threshold: MoraleThreshold.Shaken,
      alive: true,
      wounded: false,
      routing: false,
      musketLoaded: true,
      relationship: 40,
    },
    officer: {
      name: 'Leclerc',
      rank: 'Capt.',
      alive: true,
      wounded: false,
      mounted: true,
      status: 'Mounted, steady',
    },
    lineIntegrity: 80,
    lineMorale: 'resolute',
    drumsPlaying: true,
    ncoPresent: true,
    casualtiesThisTurn: 0,
  };

  const enemy: EnemyState = {
    range: 25,
    strength: 60,
    quality: 'line',
    morale: 'advancing',
    lineIntegrity: 70,
    artillery: false,
    cavalryThreat: false,
  };

  const state: BattleState = {
    phase: BattlePhase.Melee,
    turn: 1,
    drillStep: DrillStep.Present,
    player,
    line,
    enemy,
    log: [
      {
        turn: 1,
        text: '--- THE BATTERY ---\n\nYou vault the redoubt wall. The guns loom ahead — captured French guns, now turned against you. White-coated figures scramble among the pieces.',
        type: 'narrative',
      },
    ],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 4,
    scriptedVolley: 4,
    chargeEncounter: 1,
    ext: {
      battlePart: 1,
      batteryCharged: true,
      meleeStage: 2,
      wagonDamage: 0,
      gorgeTarget: '',
      gorgeMercyCount: 0,
    },
    autoPlayActive: false,
    autoPlayVolleyCompleted: 4,
    graceEarned: false,
  };

  // Create battery melee with allies + waves
  state.meleeState = createMeleeState(state, 'battery', 'battery_skirmish');

  // For test screen: pre-populate all allies and 3 active enemies immediately (skip wave pacing)
  const ms = state.meleeState;
  ms.allies = [
    {
      id: 'pierre',
      name: 'Pierre',
      type: 'named',
      npcId: 'pierre',
      health: 80,
      maxHealth: 85,
      stamina: 190,
      maxStamina: 200,
      fatigue: 0,
      maxFatigue: 200,
      strength: 50,
      elan: 45,
      alive: true,
      stunned: false,
      stunnedTurns: 0,
      armInjured: false,
      legInjured: false,
      description: 'Pierre fights beside you.',
      personality: 'aggressive',
    },
    {
      id: 'jean-baptiste',
      name: 'Jean-Baptiste',
      type: 'named',
      npcId: 'jean-baptiste',
      health: 65,
      maxHealth: 70,
      stamina: 150,
      maxStamina: 165,
      fatigue: 0,
      maxFatigue: 165,
      strength: 38,
      elan: 30,
      alive: true,
      stunned: false,
      stunnedTurns: 0,
      armInjured: false,
      legInjured: false,
      description: 'Jean-Baptiste is here.',
      personality: 'cautious',
    },
  ];
  // Activate first 3 enemies, rest in pool
  ms.activeEnemies = [0, 1, 2];
  ms.enemyPool = ms.opponents.slice(3).map((_, i) => i + 3);
  ms.maxActiveEnemies = 3;
  // Mark all waves as already processed so they don't re-trigger
  ms.processedWaves = ms.waveEvents.map((_, i) => i);

  return state;
}

function launchTestMelee() {
  const battleState = buildTestBattleState();

  // Build minimal GameState
  const gameState: GameState = {
    phase: GamePhase.Battle,
    player: {
      name: 'Test Soldier',
      rank: MilitaryRank.Private,
      musketry: 35,
      elan: 35,
      strength: 40,
      endurance: 40,
      constitution: 45,
      charisma: 30,
      intelligence: 30,
      awareness: 35,
      valor: 40,
      health: 100,
      morale: 85,
      stamina: 100,
      grace: 1,
      soldierRep: 50,
      officerRep: 50,
      napoleonRep: 0,
      frontRank: false,
      equipment: {
        musket: 'Charleville 1777',
        bayonet: 'Standard',
        musketCondition: 80,
        uniformCondition: 60,
      },
    },
    npcs: [
      {
        id: 'pierre',
        name: 'Pierre',
        role: NPCRole.Neighbour,
        rank: MilitaryRank.Private,
        relationship: 60,
        alive: true,
        wounded: false,
        morale: 70,
        maxMorale: 80,
        valor: 55,
      },
      {
        id: 'jean-baptiste',
        name: 'Jean-Baptiste',
        role: NPCRole.Neighbour,
        rank: MilitaryRank.Private,
        relationship: 40,
        alive: true,
        wounded: false,
        morale: 50,
        maxMorale: 70,
        valor: 20,
      },
    ],
    battleState,
    campaign: {
      campaignId: 'italy',
      battleIndex: 4,
      phase: CampaignPhase.Battle,
      battlesCompleted: 0,
      currentBattle: 'rivoli',
      nextBattle: '',
      daysInCampaign: 1,
      npcDeaths: [],
      replacementsUsed: [],
    },
  };

  // Set store state and render
  useGameStore.setState({ gameState, phase: GamePhase.Battle });
  useUiStore.setState({
    showOpeningBeat: false,
    showCredits: false,
  });

  // Hide test screen, show game
  $('test-screen').style.display = 'none';
  $('game').style.display = '';
}

function renderMeleeUIModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Melee UI</h2>
    <p class="test-module-desc">Launch a 3v3 battery melee with full mechanics. Player starts solo vs 2 enemies; Pierre joins at round 3, JB at round 5, 3rd enemy at round 7.</p>
    <button class="test-sample-btn" id="btn-launch-melee" style="padding:12px 24px; font-size:14px; margin-top:8px;">
      <span class="test-sample-name">Launch Battery Melee</span>
      <span class="test-sample-desc">Jump straight into the melee phase</span>
    </button>
  `;
  container.appendChild(section);

  section.querySelector('#btn-launch-melee')!.addEventListener('click', launchTestMelee);
}

// ---- Fatigue Tier SVG Sampler ----

const FATIGUE_TIERS = [
  { tier: 'fresh', label: 'FRESH', pct: 10, color: 'var(--stamina-high)' },
  { tier: 'winded', label: 'WINDED', pct: 35, color: 'var(--stamina-mid)' },
  { tier: 'fatigued', label: 'FATIGUED', pct: 62, color: 'var(--stamina-low)' },
  { tier: 'exhausted', label: 'EXHAUSTED', pct: 88, color: 'var(--morale-crit)' },
];

// --- Expressive Face SVGs ---
function faceSvg(tier: string): string {
  // Round face, eyes + mouth change per tier. Viewbox 32x32.
  const head = `<circle cx="16" cy="16" r="11" stroke-width="1.8"/>`;
  switch (tier) {
    case 'fresh':
      // Alert eyes, confident smile
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <circle cx="12" cy="14" r="1.3" fill="currentColor"/>
        <circle cx="20" cy="14" r="1.3" fill="currentColor"/>
        <path d="M11 20 Q16 24 21 20" stroke-width="1.6"/>
      </svg>`;
    case 'winded':
      // Eyes slightly narrowed, flat/neutral mouth, brow line
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <line x1="10" y1="12" x2="14" y2="12.5" stroke-width="1.2"/>
        <circle cx="12" cy="14.5" r="1.2" fill="currentColor"/>
        <line x1="18" y1="12.5" x2="22" y2="12" stroke-width="1.2"/>
        <circle cx="20" cy="14.5" r="1.2" fill="currentColor"/>
        <line x1="12" y1="21" x2="20" y2="21" stroke-width="1.5"/>
      </svg>`;
    case 'fatigued':
      // Droopy eyes (half-closed), down-turned mouth, sweat drop
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <line x1="9.5" y1="13" x2="14.5" y2="14" stroke-width="1.8"/>
        <circle cx="12" cy="15.5" r="1" fill="currentColor"/>
        <line x1="17.5" y1="14" x2="22.5" y2="13" stroke-width="1.8"/>
        <circle cx="20" cy="15.5" r="1" fill="currentColor"/>
        <path d="M12 22 Q16 19 20 22" stroke-width="1.5"/>
        <path d="M24 8 Q25 11 24 13" stroke-width="1" fill="currentColor" opacity="0.5"/>
      </svg>`;
    case 'exhausted':
      // X-eyes or squinting shut, open mouth gasping, sweat drops
      return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        ${head}
        <line x1="10" y1="12" x2="14" y2="16" stroke-width="1.8"/>
        <line x1="14" y1="12" x2="10" y2="16" stroke-width="1.8"/>
        <line x1="18" y1="12" x2="22" y2="16" stroke-width="1.8"/>
        <line x1="22" y1="12" x2="18" y2="16" stroke-width="1.8"/>
        <ellipse cx="16" cy="22" rx="3.5" ry="2.5" stroke-width="1.5"/>
        <path d="M24 7 Q25.5 10 24 12.5" stroke-width="1" fill="currentColor" opacity="0.5"/>
        <path d="M26 10 Q27 12 26 14" stroke-width="0.8" fill="currentColor" opacity="0.4"/>
      </svg>`;
    default:
      return '';
  }
}

/** Radial fatigue meter — ring fills within-tier, face SVG snaps at tier boundaries */
function makeRadialMeter(rawPct: number, size: number = 80): string {
  // Tier detection
  let tier: string, color: string, label: string, tierStart: number;
  if (rawPct >= 75) {
    tier = 'exhausted';
    color = 'var(--morale-crit)';
    label = 'EXHAUSTED';
    tierStart = 75;
  } else if (rawPct >= 50) {
    tier = 'fatigued';
    color = 'var(--stamina-low)';
    label = 'FATIGUED';
    tierStart = 50;
  } else if (rawPct >= 25) {
    tier = 'winded';
    color = 'var(--stamina-mid)';
    label = 'WINDED';
    tierStart = 25;
  } else {
    tier = 'fresh';
    color = 'var(--stamina-high)';
    label = 'FRESH';
    tierStart = 0;
  }
  const tierFill = Math.min(100, ((rawPct - tierStart) / 25) * 100);

  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (tierFill / 100) * circumference;
  const center = size / 2;
  const iconSize = radius * 1.2;
  const iconOffset = center - iconSize / 2;
  return `
    <div class="fatigue-radial-group">
      <div class="fatigue-radial" style="width:${size}px; height:${size}px; position:relative;">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--border-light)" stroke-width="5" opacity="0.3"/>
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${color}" stroke-width="5"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 ${center} ${center})"
            style="transition: stroke-dashoffset 0.6s ease, stroke 0.3s ease;"/>
        </svg>
        <div style="position:absolute; top:${iconOffset}px; left:${iconOffset}px; width:${iconSize}px; height:${iconSize}px; color:${color}; transition: color 0.3s ease;">
          ${faceSvg(tier)}
        </div>
      </div>
      <span class="fatigue-radial-label" style="color:${color}">${label}</span>
      <span class="fatigue-radial-pct">${Math.round(rawPct)}%</span>
    </div>
  `;
}

function renderFatigueTierModule(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Fatigue Radial Meter</h2>
    <p class="test-module-desc">Radial fatigue meter with expressive face SVGs. Ring fills within each tier (one full ring = one tier crossed). Face snaps at tier boundaries.</p>
    <div id="test-fatigue-demos" style="display:flex; flex-direction:column; gap:24px;"></div>
  `;
  container.appendChild(section);

  const demos = section.querySelector('#test-fatigue-demos')!;

  // Static tier display
  const tierRow = document.createElement('div');
  tierRow.className = 'meter-demo';
  tierRow.innerHTML = `<h3 class="meter-demo-label">Tier Samples</h3>
    <p style="color:var(--text-secondary); font-size:12px; margin:0 0 12px;">Alert smile → neutral concern → droopy tired → X-eyed gasping</p>`;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex; gap:20px; flex-wrap:wrap; justify-content:center;';
  for (const t of FATIGUE_TIERS) {
    row.innerHTML += makeRadialMeter(t.pct);
  }
  tierRow.appendChild(row);
  demos.appendChild(tierRow);

  // Interactive slider
  const interactive = document.createElement('div');
  interactive.className = 'meter-demo';
  interactive.innerHTML = `
    <h3 class="meter-demo-label">Interactive Preview</h3>
    <p style="color:var(--text-secondary); font-size:12px; margin:0 0 8px;">Drag the slider — ring resets at each tier boundary (25/50/75%), face snaps to new expression.</p>
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <input type="range" id="fatigue-slider" min="0" max="100" value="10" style="flex:1; accent-color: var(--accent-gold);"/>
      <span id="fatigue-slider-val" style="color:var(--text-primary); font-size:14px; min-width:40px;">10%</span>
    </div>
    <div id="fatigue-slider-preview" style="display:flex; gap:32px; justify-content:center;"></div>
  `;
  demos.appendChild(interactive);

  const slider = interactive.querySelector('#fatigue-slider') as HTMLInputElement;
  const sliderVal = interactive.querySelector('#fatigue-slider-val')!;
  const preview = interactive.querySelector('#fatigue-slider-preview')!;

  function updatePreview() {
    const pct = parseInt(slider.value);
    sliderVal.textContent = `${pct}%`;
    preview.innerHTML = makeRadialMeter(pct, 96);
  }

  slider.addEventListener('input', updatePreview);
  updatePreview();
}

// ---- Init ----

let initialized = false;

export function initTestScreen() {
  if (initialized) return;
  initialized = true;

  const introContainer = $('intro-container');
  const testScreen = $('test-screen');

  // Open test screen
  $('btn-test-screen').addEventListener('click', () => {
    introContainer.style.display = 'none';
    testScreen.style.display = 'flex';

    // Lazy-render modules on first open
    const modules = $('test-modules');
    if (modules.children.length === 0) {
      renderFatigueTierModule(modules);
      renderMeleeUIModule(modules);
      renderHitSoundModule(modules);
      renderMissSoundModule(modules);
      renderCampArtModule(modules);
      renderMeterStylesModule(modules);
      renderResolutionModule(modules);
      renderClickSoundModule(modules);
    }
  });

  // Back to intro
  $('btn-test-back').addEventListener('click', () => {
    testScreen.style.display = 'none';
    introContainer.style.display = '';
  });
}
