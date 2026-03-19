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
  MeleeContext,
  Formation,
} from '../../types';
import { createMeleeState } from '../../core/melee';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';

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

function renderArtLabButton(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'test-module';
  section.innerHTML = `
    <h2 class="test-module-title">Camp Scene Art</h2>
    <p class="test-module-desc">SVG art options for the camp screen background.</p>
    <button class="test-sample-btn" id="btn-art-lab" style="display:inline-flex;padding:14px 24px;">
      <span class="test-sample-name">Open Art Lab &rarr;</span>
      <span class="test-sample-desc">Full-size SVG previews in a dedicated view</span>
    </button>
  `;
  container.appendChild(section);
}

let artLabRendered = false;

function renderArtLab(container: HTMLElement) {
  if (artLabRendered) return;
  artLabRendered = true;

  const demos = container;

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

  // === 4. Voltri — Harbor Dusk ===
  const a4harbor = document.createElement('div');
  a4harbor.className = 'art-demo';
  a4harbor.innerHTML = `
    <h3 class="meter-demo-label">4. Voltri — Harbor Dusk</h3>
    <p style="color:var(--text-dim);font-size:12px;margin:4px 0 0;">Quayside at dusk, looking out to sea. Lantern post, fishing boats, distant headland.</p>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
<defs>
  <linearGradient id="vtH_sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a0e2e"/>
    <stop offset="25%" stop-color="#2d1b4e"/>
    <stop offset="50%" stop-color="#5c3a2a"/>
    <stop offset="75%" stop-color="#b8652a"/>
    <stop offset="90%" stop-color="#d4923a"/>
    <stop offset="100%" stop-color="#e8b44a"/>
  </linearGradient>
  <linearGradient id="vtH_seaBase" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8b5a1e" stop-opacity="0.6"/>
    <stop offset="30%" stop-color="#3a2a1a" stop-opacity="0.8"/>
    <stop offset="60%" stop-color="#1a1520" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="#0e0a14"/>
  </linearGradient>
  <linearGradient id="vtH_sunReflect" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#e8b44a" stop-opacity="0.5"/>
    <stop offset="40%" stop-color="#d4842a" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#8b5a1e" stop-opacity="0.05"/>
  </linearGradient>
  <radialGradient id="vtH_lanternGlow" cx="580" cy="310" r="120" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#e8a832" stop-opacity="0.35"/>
    <stop offset="30%" stop-color="#c47820" stop-opacity="0.15"/>
    <stop offset="70%" stop-color="#8b5a1e" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#1a0e2e" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="vtH_quay" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a3530"/>
    <stop offset="50%" stop-color="#2a2520"/>
    <stop offset="100%" stop-color="#1a1815"/>
  </linearGradient>
  <linearGradient id="vtH_quayTop" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#3a3530"/>
    <stop offset="40%" stop-color="#4a4238"/>
    <stop offset="60%" stop-color="#5a4e3e"/>
    <stop offset="100%" stop-color="#3a3530"/>
  </linearGradient>
  <linearGradient id="vtH_headland" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a1228"/>
    <stop offset="100%" stop-color="#0e0a14"/>
  </linearGradient>
  <linearGradient id="vtH_mist" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#d4923a" stop-opacity="0"/>
    <stop offset="30%" stop-color="#c8a060" stop-opacity="0.12"/>
    <stop offset="60%" stop-color="#8a7050" stop-opacity="0.18"/>
    <stop offset="100%" stop-color="#3a2a20" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="vtH_shimmer" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#e8b44a" stop-opacity="0"/>
    <stop offset="50%" stop-color="#e8b44a" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#e8b44a" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="vtH_towerGlow" cx="115" cy="155" r="8" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#e8a832" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#e8a832" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="vtH_fgDark" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a1815" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#0a0808" stop-opacity="0.95"/>
  </linearGradient>
  <linearGradient id="vtH_bollard" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#2a2520"/>
    <stop offset="40%" stop-color="#3a3530"/>
    <stop offset="100%" stop-color="#1a1815"/>
  </linearGradient>
</defs>
<rect width="800" height="400" fill="url(#vtH_sky)"/>
<circle cx="65" cy="18" r="1.0" fill="#d8d0c0" opacity="0.5"><animate attributeName="opacity" values="0.5;0.3;0.5" dur="3s" repeatCount="indefinite"/></circle>
<circle cx="140" cy="30" r="0.7" fill="#d8d0c0" opacity="0.35"/>
<circle cx="210" cy="12" r="1.2" fill="#d8d0c0" opacity="0.55"><animate attributeName="opacity" values="0.55;0.35;0.55" dur="4s" repeatCount="indefinite"/></circle>
<circle cx="320" cy="25" r="0.6" fill="#d8d0c0" opacity="0.3"/>
<circle cx="380" cy="8" r="0.9" fill="#d8d0c0" opacity="0.45"><animate attributeName="opacity" values="0.45;0.25;0.45" dur="3.5s" repeatCount="indefinite"/></circle>
<circle cx="480" cy="20" r="1.1" fill="#d8d0c0" opacity="0.5"/>
<circle cx="660" cy="15" r="0.8" fill="#d8d0c0" opacity="0.4"/>
<circle cx="730" cy="28" r="1.0" fill="#d8d0c0" opacity="0.35"/>
<circle cx="770" cy="10" r="0.6" fill="#d8d0c0" opacity="0.3"/>
<path d="M0,175 L0,200 Q20,195 40,192 Q60,188 80,185 Q100,178 115,165 Q125,155 130,148 Q138,158 145,170 Q155,180 165,188 Q180,195 200,200 Q200,400 0,400 Z" fill="url(#vtH_headland)"/>
<rect x="112" y="140" width="8" height="25" fill="#18122a" opacity="0.9"/>
<rect x="110" y="138" width="12" height="4" fill="#18122a" opacity="0.9"/>
<rect x="109" y="135" width="14" height="4" fill="#1a1430" opacity="0.85"/>
<circle cx="116" cy="148" r="6" fill="url(#vtH_towerGlow)"/>
<rect x="114" y="147" width="3" height="3" fill="#d4923a" opacity="0.5"><animate attributeName="opacity" values="0.5;0.35;0.5" dur="4s" repeatCount="indefinite"/></rect>
<rect x="0" y="185" width="800" height="30" fill="#d4923a" opacity="0.08"/>
<rect x="0" y="195" width="800" height="205" fill="url(#vtH_seaBase)"/>
<path d="M340,195 Q360,195 400,195 Q440,195 460,195 L520,400 L280,400 Z" fill="url(#vtH_sunReflect)" opacity="0.6"/>
<line x1="30" y1="215" x2="200" y2="215" stroke="#c8a050" stroke-width="0.5" opacity="0.08"><animate attributeName="x1" values="30;35;30" dur="4s" repeatCount="indefinite"/></line>
<line x1="420" y1="216" x2="580" y2="216" stroke="#c8a050" stroke-width="0.5" opacity="0.07"><animate attributeName="x1" values="420;425;420" dur="4.5s" repeatCount="indefinite"/></line>
<line x1="50" y1="240" x2="180" y2="241" stroke="#8b7040" stroke-width="0.6" opacity="0.07"><animate attributeName="x1" values="50;56;50" dur="5s" repeatCount="indefinite"/></line>
<line x1="380" y1="242" x2="520" y2="243" stroke="#9b8050" stroke-width="0.5" opacity="0.08"><animate attributeName="x1" values="380;386;380" dur="4.8s" repeatCount="indefinite"/></line>
<line x1="300" y1="275" x2="500" y2="274" stroke="#7a6540" stroke-width="0.6" opacity="0.09"><animate attributeName="x1" values="300;308;300" dur="4.5s" repeatCount="indefinite"/></line>
<rect x="360" y="210" width="80" height="3" fill="url(#vtH_shimmer)" opacity="0.3"><animate attributeName="opacity" values="0.3;0.15;0.3" dur="3s" repeatCount="indefinite"/></rect>
<rect x="355" y="250" width="90" height="2" fill="url(#vtH_shimmer)" opacity="0.18"><animate attributeName="opacity" values="0.18;0.08;0.18" dur="4s" repeatCount="indefinite"/></rect>
<rect x="0" y="188" width="800" height="20" fill="url(#vtH_mist)" opacity="0.7"><animate attributeName="opacity" values="0.7;0.5;0.7" dur="8s" repeatCount="indefinite"/></rect>
<g><path d="M240,230 Q250,225 270,225 Q290,225 300,230 Q290,234 270,234 Q250,234 240,230 Z" fill="#1a1510" opacity="0.85"/><line x1="268" y1="225" x2="268" y2="195" stroke="#1a1510" stroke-width="1.5" opacity="0.85"/><line x1="260" y1="202" x2="276" y2="202" stroke="#1a1510" stroke-width="1" opacity="0.7"/><path d="M261,202 Q268,205 275,202" fill="none" stroke="#2a2520" stroke-width="1.2" opacity="0.35"/><animateTransform attributeName="transform" type="translate" values="0,0;0,-1;0,0" dur="4s" repeatCount="indefinite"/></g>
<g><path d="M620,225 Q630,222 645,222 Q660,222 668,225 Q660,228 645,228 Q630,228 620,225 Z" fill="#18130e" opacity="0.8"/><line x1="643" y1="222" x2="643" y2="197" stroke="#18130e" stroke-width="1.3" opacity="0.8"/><path d="M643,198 L650,200 L643,202" fill="#3a2020" opacity="0.3"><animate attributeName="d" values="M643,198 L650,200 L643,202;M643,198 L649,199 L643,201;M643,198 L650,200 L643,202" dur="3s" repeatCount="indefinite"/></path><animateTransform attributeName="transform" type="translate" values="0,0;0,-0.8;0,0" dur="4.5s" repeatCount="indefinite"/></g>
<g><path d="M430,295 Q445,290 465,290 Q485,290 500,295 Q485,300 465,300 Q445,300 430,295 Z" fill="#1a1510" opacity="0.9"/><line x1="448" y1="294" x2="482" y2="294" stroke="#221c14" stroke-width="1.5" opacity="0.5"/><line x1="435" y1="288" x2="500" y2="292" stroke="#1a1510" stroke-width="1" opacity="0.6"/><animateTransform attributeName="transform" type="translate" values="0,0;0,-0.6;0,0" dur="3.8s" repeatCount="indefinite"/></g>
<path d="M0,320 L0,400 L800,400 L800,310 Q700,305 600,308 Q500,312 400,318 Q300,322 200,320 Q100,318 0,320 Z" fill="url(#vtH_quay)"/>
<path d="M0,315 Q100,313 200,315 Q300,317 400,313 Q500,307 600,303 Q700,300 800,305 L800,310 Q700,305 600,308 Q500,312 400,318 Q300,322 200,320 Q100,318 0,320 Z" fill="url(#vtH_quayTop)"/>
<line x1="0" y1="332" x2="300" y2="334" stroke="#1a1815" stroke-width="0.5" opacity="0.4"/>
<line x1="280" y1="330" x2="550" y2="326" stroke="#1a1815" stroke-width="0.5" opacity="0.4"/>
<line x1="530" y1="322" x2="800" y2="318" stroke="#1a1815" stroke-width="0.5" opacity="0.4"/>
<line x1="0" y1="348" x2="350" y2="350" stroke="#1a1815" stroke-width="0.5" opacity="0.35"/>
<line x1="330" y1="346" x2="600" y2="340" stroke="#1a1815" stroke-width="0.5" opacity="0.35"/>
<line x1="0" y1="364" x2="400" y2="366" stroke="#1a1815" stroke-width="0.5" opacity="0.3"/>
<line x1="380" y1="362" x2="800" y2="354" stroke="#1a1815" stroke-width="0.5" opacity="0.3"/>
<path d="M0,320 Q50,318 100,319 Q150,317 200,320 Q250,318 300,320" fill="none" stroke="#4a4030" stroke-width="0.8" opacity="0.15"><animate attributeName="d" values="M0,320 Q50,318 100,319 Q150,317 200,320 Q250,318 300,320;M0,319 Q50,317 100,318 Q150,316 200,319 Q250,317 300,319;M0,320 Q50,318 100,319 Q150,317 200,320 Q250,318 300,320" dur="3s" repeatCount="indefinite"/></path>
<g><rect x="278" y="310" width="12" height="10" rx="1" fill="url(#vtH_bollard)"/><ellipse cx="284" cy="310" rx="8" ry="3" fill="#4a4238" opacity="0.4"/><rect x="280" y="318" width="8" height="4" fill="#2a2520"/></g>
<g opacity="0.7"><ellipse cx="315" cy="330" rx="12" ry="6" fill="none" stroke="#3a3020" stroke-width="2.5"/><ellipse cx="315" cy="330" rx="8" ry="4" fill="none" stroke="#3a3020" stroke-width="2"/><path d="M284,314 Q290,318 300,324 Q308,328 315,330" fill="none" stroke="#3a3020" stroke-width="2" stroke-linecap="round"/></g>
<g><line x1="580" y1="305" x2="580" y2="270" stroke="#2a2218" stroke-width="3" stroke-linecap="round"/><rect x="576" y="303" width="8" height="4" rx="1" fill="#2a2218"/><line x1="580" y1="272" x2="590" y2="268" stroke="#2a2218" stroke-width="2" stroke-linecap="round"/><rect x="586" y="262" width="10" height="14" rx="1" fill="#2a2218" opacity="0.9"/><rect x="587" y="264" width="8" height="10" rx="1" fill="#d4923a" opacity="0.3"/><circle cx="591" cy="269" r="100" fill="url(#vtH_lanternGlow)" opacity="0.8"/><path d="M591,272 Q589,268 588,265 Q590,263 591,261 Q592,263 594,265 Q593,268 591,272 Z" fill="#e8a832" opacity="0.8"><animate attributeName="d" values="M591,272 Q589,268 588,265 Q590,263 591,261 Q592,263 594,265 Q593,268 591,272Z;M591,272 Q588,269 587,266 Q589,262 591,260 Q593,262 595,266 Q594,269 591,272Z;M591,272 Q589,268 588,265 Q590,263 591,261 Q592,263 594,265 Q593,268 591,272Z" dur="0.7s" repeatCount="indefinite"/></path><path d="M591,270 Q590,268 589,266 Q590,264 591,263 Q592,264 593,266 Q592,268 591,270 Z" fill="#ffe880" opacity="0.7"><animate attributeName="d" values="M591,270 Q590,268 589,266 Q590,264 591,263 Q592,264 593,266 Q592,268 591,270Z;M591,270 Q589,268 588,267 Q590,264 591,262 Q592,264 594,267 Q593,268 591,270Z;M591,270 Q590,268 589,266 Q590,264 591,263 Q592,264 593,266 Q592,268 591,270Z" dur="0.5s" repeatCount="indefinite"/></path><circle cx="591" cy="267" r="1.5" fill="#ffe880" opacity="0.6"><animate attributeName="r" values="1.5;2;1.5" dur="0.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0.8;0.6" dur="0.6s" repeatCount="indefinite"/></circle><ellipse cx="585" cy="308" rx="30" ry="8" fill="#c47820" opacity="0.06"><animate attributeName="opacity" values="0.06;0.09;0.06" dur="0.8s" repeatCount="indefinite"/></ellipse></g>
<g><rect x="680" y="304" width="10" height="8" rx="1" fill="url(#vtH_bollard)"/><ellipse cx="685" cy="304" rx="7" ry="2.5" fill="#4a4238" opacity="0.3"/><rect x="682" y="310" width="6" height="3" fill="#2a2520"/></g>
<rect x="0" y="370" width="800" height="30" fill="url(#vtH_fgDark)"/>
<path d="M0,385 Q80,382 160,386 Q240,383 320,387 Q400,384 480,386 Q560,382 640,385 Q720,383 800,386 L800,400 L0,400 Z" fill="#0a0808" opacity="0.6"/>
<g opacity="0.15"><line x1="720" y1="195" x2="720" y2="185" stroke="#2a2520" stroke-width="0.8"/><path d="M720,186 L724,190 L720,194" fill="#3a3530"/></g>
      </svg>
    </div>
  `;
  demos.appendChild(a4harbor);

  // === 5. Voltri — Village Square ===
  const a5village = document.createElement('div');
  a5village.className = 'art-demo';
  a5village.innerHTML = `
    <h3 class="meter-demo-label">5. Voltri — Village Square</h3>
    <p style="color:var(--text-dim);font-size:12px;margin:4px 0 0;">Mediterranean piazza with lit windows, wall torch, fountain, barrel stack.</p>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
<defs>
  <linearGradient id="vtV_sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a0e2a"/>
    <stop offset="35%" stop-color="#141838"/>
    <stop offset="70%" stop-color="#1e1a3a"/>
    <stop offset="100%" stop-color="#3a2235"/>
  </linearGradient>
  <linearGradient id="vtV_sunsetBand" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a2235" stop-opacity="0"/>
    <stop offset="60%" stop-color="#5a2a30" stop-opacity="0.4"/>
    <stop offset="85%" stop-color="#6e3328" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#4a2520" stop-opacity="0.3"/>
  </linearGradient>
  <radialGradient id="vtV_torchGlow" cx="195" cy="215" r="110" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#cc8833" stop-opacity="0.45"/>
    <stop offset="30%" stop-color="#aa6622" stop-opacity="0.25"/>
    <stop offset="65%" stop-color="#663311" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#0a0e2a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vtV_windowGlow">
    <stop offset="0%" stop-color="#dda544" stop-opacity="0.9"/>
    <stop offset="60%" stop-color="#bb7722" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#885511" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="vtV_ground" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a2218"/>
    <stop offset="40%" stop-color="#221c14"/>
    <stop offset="100%" stop-color="#1a150e"/>
  </linearGradient>
  <radialGradient id="vtV_groundTorchReflect" cx="210" cy="340" r="160" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#996633" stop-opacity="0.18"/>
    <stop offset="50%" stop-color="#663311" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#1a150e" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vtV_groundWindowReflect" cx="540" cy="360" r="120" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#886633" stop-opacity="0.1"/>
    <stop offset="60%" stop-color="#553311" stop-opacity="0.04"/>
    <stop offset="100%" stop-color="#1a150e" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="vtV_stone1" x1="0" y1="0" x2="1" y2="0.5">
    <stop offset="0%" stop-color="#3a3428"/>
    <stop offset="100%" stop-color="#2e2820"/>
  </linearGradient>
  <linearGradient id="vtV_stone2" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0%" stop-color="#342e24"/>
    <stop offset="100%" stop-color="#28221a"/>
  </linearGradient>
  <linearGradient id="vtV_stone3" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#38322a"/>
    <stop offset="100%" stop-color="#2c261e"/>
  </linearGradient>
  <linearGradient id="vtV_stoneTower" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#302a22"/>
    <stop offset="50%" stop-color="#362e26"/>
    <stop offset="100%" stop-color="#2a241c"/>
  </linearGradient>
  <linearGradient id="vtV_roof1" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#5a3020"/>
    <stop offset="100%" stop-color="#4a2818"/>
  </linearGradient>
  <linearGradient id="vtV_roof2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#553222"/>
    <stop offset="100%" stop-color="#462818"/>
  </linearGradient>
  <linearGradient id="vtV_roof3" x1="1" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#5c3424"/>
    <stop offset="100%" stop-color="#4c2a1a"/>
  </linearGradient>
  <linearGradient id="vtV_fountain" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3e3830"/>
    <stop offset="100%" stop-color="#2a2620"/>
  </linearGradient>
  <linearGradient id="vtV_alleyDark" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#0a0a0e" stop-opacity="0.9"/>
    <stop offset="50%" stop-color="#060608" stop-opacity="0.95"/>
    <stop offset="100%" stop-color="#0a0a0e" stop-opacity="0.9"/>
  </linearGradient>
  <linearGradient id="vtV_vine" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a2a12"/>
    <stop offset="100%" stop-color="#0e1a08"/>
  </linearGradient>
  <linearGradient id="vtV_distantRoof" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1e1828"/>
    <stop offset="100%" stop-color="#161222"/>
  </linearGradient>
</defs>
<rect width="800" height="400" fill="url(#vtV_sky)"/>
<rect x="0" y="100" width="800" height="200" fill="url(#vtV_sunsetBand)"/>
<circle cx="35" cy="18" r="0.9" fill="#c8c0b0" opacity="0.6"/><circle cx="155" cy="12" r="1.1" fill="#c8c0b0" opacity="0.75"/><circle cx="310" cy="8" r="1.0" fill="#c8c0b0" opacity="0.7"/><circle cx="450" cy="10" r="0.8" fill="#c8c0b0" opacity="0.55"/><circle cx="530" cy="30" r="1.2" fill="#c8c0b0" opacity="0.65"/><circle cx="670" cy="25" r="0.9" fill="#c8c0b0" opacity="0.6"/><circle cx="735" cy="8" r="1.0" fill="#c8c0b0" opacity="0.7"/>
<circle cx="680" cy="40" r="10" fill="#c0b890" opacity="0.85"/><circle cx="685" cy="37" r="8.5" fill="#0a0e2a"/>
<rect x="-10" y="95" width="80" height="210" fill="#18142a" opacity="0.7"/><path d="M-10,95 L25,75 L70,95 Z" fill="url(#vtV_distantRoof)" opacity="0.7"/>
<rect x="245" y="100" width="70" height="200" fill="#1a1628" opacity="0.6"/><path d="M245,100 L280,82 L315,100 Z" fill="url(#vtV_distantRoof)" opacity="0.6"/>
<rect x="680" y="90" width="90" height="215" fill="#16122a" opacity="0.65"/><path d="M680,90 L725,70 L770,90 Z" fill="url(#vtV_distantRoof)" opacity="0.65"/>
<rect x="22" y="130" width="5" height="6" fill="#886633" opacity="0.25"/><rect x="260" y="135" width="4" height="5" fill="#886633" opacity="0.2"/><rect x="710" y="125" width="5" height="6" fill="#886633" opacity="0.2"/>
<!-- Building 1: Left with torch -->
<rect x="55" y="90" width="165" height="260" fill="url(#vtV_stone1)"/>
<line x1="55" y1="130" x2="220" y2="130" stroke="#2a2418" stroke-width="0.5" opacity="0.4"/><line x1="55" y1="175" x2="220" y2="175" stroke="#2a2418" stroke-width="0.5" opacity="0.35"/><line x1="55" y1="220" x2="220" y2="220" stroke="#2a2418" stroke-width="0.5" opacity="0.3"/><line x1="55" y1="265" x2="220" y2="265" stroke="#2a2418" stroke-width="0.5" opacity="0.3"/>
<path d="M45,90 L140,58 L230,90 Z" fill="url(#vtV_roof1)"/><rect x="45" y="88" width="185" height="4" fill="#1a1610" opacity="0.5"/>
<rect x="85" y="110" width="18" height="24" fill="#0e0c08" rx="1"/><rect x="130" y="110" width="18" height="24" fill="#0e0c08" rx="1"/><rect x="175" y="110" width="18" height="24" fill="#0e0c08" rx="1"/>
<rect x="85" y="192" width="22" height="28" fill="#cc9940" opacity="0.85" rx="1"><animate attributeName="opacity" values="0.85;0.78;0.88;0.82;0.85" dur="4s" repeatCount="indefinite"/></rect>
<line x1="96" y1="192" x2="96" y2="220" stroke="#3a3020" stroke-width="1.2"/><line x1="85" y1="206" x2="107" y2="206" stroke="#3a3020" stroke-width="1.2"/>
<rect x="150" y="192" width="22" height="28" fill="#0e0c08" rx="1"/>
<path d="M120,290 L120,350 L148,350 L148,290 Q134,275 120,290 Z" fill="#1a1610"/><path d="M122,292 L122,350 L146,350 L146,292 Q134,278 122,292 Z" fill="#0e0c08"/>
<!-- Torch on Building 1 -->
<rect x="206" y="195" width="5" height="20" fill="#3a2a15" rx="1"/><rect x="205" y="190" width="7" height="8" fill="#4a3a20" rx="1"/>
<path d="M209,168 Q204,178 205,188 Q207,183 209,178 Q211,183 213,188 Q214,178 209,168 Z" fill="#dd7711" opacity="0.9"><animate attributeName="d" values="M209,168 Q204,178 205,188 Q207,183 209,178 Q211,183 213,188 Q214,178 209,168Z;M209,164 Q203,176 204,188 Q206,181 209,174 Q212,181 214,188 Q215,176 209,164Z;M209,170 Q205,179 205,188 Q208,184 209,179 Q210,184 213,188 Q213,179 209,170Z;M209,168 Q204,178 205,188 Q207,183 209,178 Q211,183 213,188 Q214,178 209,168Z" dur="0.7s" repeatCount="indefinite"/></path>
<path d="M209,173 Q206,180 206,187 Q208,182 209,178 Q210,182 212,187 Q212,180 209,173 Z" fill="#ee9922" opacity="0.85"><animate attributeName="d" values="M209,173 Q206,180 206,187 Q208,182 209,178 Q210,182 212,187 Q212,180 209,173Z;M209,170 Q205,179 206,187 Q207,180 209,175 Q211,180 212,187 Q213,179 209,170Z;M209,175 Q207,181 207,187 Q208,183 209,180 Q210,183 211,187 Q211,181 209,175Z;M209,173 Q206,180 206,187 Q208,182 209,178 Q210,182 212,187 Q212,180 209,173Z" dur="0.55s" repeatCount="indefinite"/></path>
<path d="M209,177 Q207,182 207,187 Q208,184 209,181 Q210,184 211,187 Q211,182 209,177 Z" fill="#ffcc44" opacity="0.8"><animate attributeName="d" values="M209,177 Q207,182 207,187 Q208,184 209,181 Q210,184 211,187 Q211,182 209,177Z;M209,175 Q206,181 207,187 Q208,183 209,179 Q210,183 211,187 Q212,181 209,175Z;M209,178 Q208,183 208,187 Q209,185 209,182 Q209,185 210,187 Q210,183 209,178Z;M209,177 Q207,182 207,187 Q208,184 209,181 Q210,184 211,187 Q211,182 209,177Z" dur="0.45s" repeatCount="indefinite"/></path>
<rect x="55" y="90" width="165" height="260" fill="url(#vtV_torchGlow)" opacity="0.8"/>
<circle cx="207" cy="165" r="1.0" fill="#ffaa22" opacity="0.7"><animate attributeName="cy" values="168;148;128" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0.4;0" dur="2.2s" repeatCount="indefinite"/><animate attributeName="cx" values="207;204;200" dur="2.2s" repeatCount="indefinite"/></circle>
<circle cx="211" cy="163" r="0.7" fill="#ff8811" opacity="0.6"><animate attributeName="cy" values="166;142;118" dur="2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0.3;0" dur="2.8s" repeatCount="indefinite"/><animate attributeName="cx" values="211;215;218" dur="2.8s" repeatCount="indefinite"/></circle>
<!-- Alley 1 -->
<rect x="220" y="80" width="40" height="270" fill="url(#vtV_alleyDark)"/>
<!-- Building 2: Center -->
<rect x="260" y="140" width="140" height="210" fill="url(#vtV_stone2)"/>
<line x1="260" y1="185" x2="400" y2="185" stroke="#24201a" stroke-width="0.5" opacity="0.35"/><line x1="260" y1="230" x2="400" y2="230" stroke="#24201a" stroke-width="0.5" opacity="0.3"/>
<path d="M250,140 L330,108 L410,140 Z" fill="url(#vtV_roof2)"/><rect x="250" y="138" width="160" height="4" fill="#1a1610" opacity="0.45"/>
<rect x="280" y="155" width="16" height="22" fill="#0e0c08" rx="1"/><rect x="345" y="155" width="16" height="22" fill="#0e0c08" rx="1"/>
<rect x="275" y="245" width="20" height="26" fill="#bb8833" opacity="0.75" rx="1"><animate attributeName="opacity" values="0.75;0.7;0.78;0.72;0.75" dur="5s" repeatCount="indefinite"/></rect>
<line x1="285" y1="245" x2="285" y2="271" stroke="#38301e" stroke-width="1"/><line x1="275" y1="258" x2="295" y2="258" stroke="#38301e" stroke-width="1"/>
<rect x="340" y="245" width="20" height="26" fill="#cc9940" opacity="0.8" rx="1"><animate attributeName="opacity" values="0.8;0.74;0.82;0.76;0.8" dur="4.5s" repeatCount="indefinite"/></rect>
<line x1="350" y1="245" x2="350" y2="271" stroke="#38301e" stroke-width="1"/><line x1="340" y1="258" x2="360" y2="258" stroke="#38301e" stroke-width="1"/>
<rect x="310" y="195" width="30" height="2" fill="#3a3228" rx="0.5"/>
<line x1="312" y1="197" x2="312" y2="210" stroke="#2e2820" stroke-width="1.5"/><line x1="320" y1="197" x2="320" y2="210" stroke="#2e2820" stroke-width="1.5"/><line x1="328" y1="197" x2="328" y2="210" stroke="#2e2820" stroke-width="1.5"/><line x1="338" y1="197" x2="338" y2="210" stroke="#2e2820" stroke-width="1.5"/>
<rect x="310" y="210" width="30" height="2" fill="#3a3228" rx="0.5"/>
<rect x="314" y="155" width="22" height="38" fill="#100e0a" rx="1"/>
<rect x="305" y="300" width="28" height="50" fill="#100e0a" rx="1"/>
<!-- Alley 2 -->
<rect x="400" y="100" width="50" height="250" fill="#080810" opacity="0.85"/>
<!-- Building 3: Right -->
<rect x="450" y="120" width="155" height="230" fill="url(#vtV_stone3)"/>
<line x1="450" y1="165" x2="605" y2="165" stroke="#26221c" stroke-width="0.5" opacity="0.35"/><line x1="450" y1="210" x2="605" y2="210" stroke="#26221c" stroke-width="0.5" opacity="0.3"/><line x1="450" y1="255" x2="605" y2="255" stroke="#26221c" stroke-width="0.5" opacity="0.25"/>
<path d="M440,120 L530,92 L615,120 Z" fill="url(#vtV_roof3)"/><rect x="440" y="118" width="175" height="4" fill="#1a1610" opacity="0.45"/>
<rect x="470" y="140" width="18" height="22" fill="#0e0c08" rx="1"/><rect x="540" y="140" width="18" height="22" fill="#0e0c08" rx="1"/>
<rect x="468" y="222" width="22" height="28" fill="#bb8833" opacity="0.7" rx="1"><animate attributeName="opacity" values="0.7;0.65;0.73;0.68;0.7" dur="6s" repeatCount="indefinite"/></rect>
<line x1="479" y1="222" x2="479" y2="250" stroke="#38301e" stroke-width="1"/><line x1="468" y1="236" x2="490" y2="236" stroke="#38301e" stroke-width="1"/>
<rect x="538" y="222" width="22" height="28" fill="#0e0c08" rx="1"/>
<path d="M560,222 L568,225 L568,247 L560,250 Z" fill="#2e2820" opacity="0.6"/>
<!-- Vine on Building 3 -->
<path d="M456,350 Q454,310 458,270 Q462,240 460,200 Q458,175 462,155" fill="none" stroke="#1a2a12" stroke-width="2" opacity="0.7"/>
<ellipse cx="445" cy="284" rx="5" ry="4" fill="url(#vtV_vine)" opacity="0.6"/><ellipse cx="472" cy="245" rx="6" ry="4" fill="url(#vtV_vine)" opacity="0.55"/><ellipse cx="448" cy="207" rx="5" ry="3.5" fill="url(#vtV_vine)" opacity="0.5"/><ellipse cx="470" cy="167" rx="5" ry="4" fill="url(#vtV_vine)" opacity="0.45"/>
<!-- Bell Tower -->
<rect x="610" y="45" width="70" height="305" fill="url(#vtV_stoneTower)"/>
<line x1="610" y1="90" x2="680" y2="90" stroke="#262018" stroke-width="0.5" opacity="0.3"/><line x1="610" y1="140" x2="680" y2="140" stroke="#262018" stroke-width="0.5" opacity="0.28"/><line x1="610" y1="190" x2="680" y2="190" stroke="#262018" stroke-width="0.5" opacity="0.25"/><line x1="610" y1="240" x2="680" y2="240" stroke="#262018" stroke-width="0.5" opacity="0.22"/>
<path d="M605,45 L645,18 L685,45 Z" fill="#4a2818"/>
<line x1="645" y1="10" x2="645" y2="18" stroke="#4a4030" stroke-width="1.5"/><line x1="640" y1="13" x2="650" y2="13" stroke="#4a4030" stroke-width="1.2"/>
<path d="M625,55 Q645,42 665,55 L665,80 L625,80 Z" fill="#100e0a"/>
<rect x="630" y="215" width="12" height="16" fill="#aa7728" opacity="0.6" rx="0.5"><animate attributeName="opacity" values="0.6;0.55;0.62;0.57;0.6" dur="7s" repeatCount="indefinite"/></rect>
<!-- Narrow gap + Building 5 -->
<rect x="605" y="120" width="8" height="230" fill="#060608" opacity="0.9"/>
<rect x="680" y="110" width="130" height="240" fill="#302a22"/>
<path d="M670,110 L740,82 L810,110 Z" fill="#4e2c1a"/>
<rect x="700" y="140" width="16" height="20" fill="#0e0c08" rx="1"/>
<rect x="700" y="225" width="18" height="24" fill="#bb8833" opacity="0.65" rx="1"><animate attributeName="opacity" values="0.65;0.6;0.68;0.62;0.65" dur="5.5s" repeatCount="indefinite"/></rect>
<!-- Ground -->
<rect x="0" y="340" width="800" height="60" fill="url(#vtV_ground)"/>
<g stroke="#1e1a14" stroke-width="0.4" opacity="0.3" fill="none"><line x1="0" y1="350" x2="800" y2="350"/><line x1="0" y1="360" x2="800" y2="360"/><line x1="0" y1="370" x2="800" y2="370"/><line x1="0" y1="380" x2="800" y2="380"/><line x1="0" y1="390" x2="800" y2="390"/><line x1="25" y1="340" x2="25" y2="350"/><line x1="85" y1="340" x2="85" y2="350"/><line x1="145" y1="340" x2="145" y2="350"/><line x1="205" y1="340" x2="205" y2="350"/><line x1="280" y1="340" x2="280" y2="350"/><line x1="350" y1="340" x2="350" y2="350"/><line x1="420" y1="340" x2="420" y2="350"/><line x1="495" y1="340" x2="495" y2="350"/><line x1="570" y1="340" x2="570" y2="350"/><line x1="650" y1="340" x2="650" y2="350"/><line x1="730" y1="340" x2="730" y2="350"/><line x1="40" y1="350" x2="40" y2="360"/><line x1="100" y1="350" x2="100" y2="360"/><line x1="160" y1="350" x2="160" y2="360"/><line x1="225" y1="350" x2="225" y2="360"/><line x1="298" y1="350" x2="298" y2="360"/><line x1="368" y1="350" x2="368" y2="360"/><line x1="438" y1="350" x2="438" y2="360"/><line x1="515" y1="350" x2="515" y2="360"/><line x1="590" y1="350" x2="590" y2="360"/><line x1="670" y1="350" x2="670" y2="360"/><line x1="750" y1="350" x2="750" y2="360"/></g>
<rect x="0" y="340" width="800" height="60" fill="url(#vtV_groundTorchReflect)"/>
<rect x="0" y="340" width="800" height="60" fill="url(#vtV_groundWindowReflect)"/>
<!-- Fountain -->
<ellipse cx="390" cy="365" rx="38" ry="10" fill="#1e1a14"/><ellipse cx="390" cy="362" rx="36" ry="9" fill="url(#vtV_fountain)"/><ellipse cx="390" cy="360" rx="34" ry="8" fill="#1a1610"/><ellipse cx="390" cy="360" rx="30" ry="6.5" fill="#0e1218" opacity="0.8"/>
<ellipse cx="388" cy="359" rx="8" ry="2" fill="#1a2028" opacity="0.5"><animate attributeName="opacity" values="0.5;0.3;0.5" dur="3s" repeatCount="indefinite"/></ellipse>
<rect x="386" y="335" width="8" height="25" fill="#3a3428" rx="1"/><rect x="384" y="333" width="12" height="4" fill="#3e3830" rx="1"/><circle cx="390" cy="329" r="2.5" fill="#3a342c"/>
<!-- Barrel stack -->
<ellipse cx="560" cy="362" rx="14" ry="5" fill="#2a1e12"/><rect x="546" y="345" width="28" height="17" fill="#2a1e12" rx="2"/><ellipse cx="560" cy="345" rx="14" ry="5" fill="#342818"/>
<line x1="548" y1="350" x2="572" y2="350" stroke="#1e1610" stroke-width="1"/><line x1="548" y1="357" x2="572" y2="357" stroke="#1e1610" stroke-width="1"/>
<g transform="rotate(-8, 575, 350)"><rect x="573" y="346" width="24" height="16" fill="#261a10" rx="2"/><ellipse cx="585" cy="346" rx="12" ry="4.5" fill="#302414"/></g>
<ellipse cx="558" cy="343" rx="9" ry="3.5" fill="#2e2214"/><rect x="549" y="330" width="18" height="13" fill="#2e2214" rx="2"/><ellipse cx="558" cy="330" rx="9" ry="3.5" fill="#382c1a"/>
<!-- Cart -->
<rect x="-15" y="348" width="65" height="16" fill="#2a2014" rx="1"/><circle cx="38" cy="370" r="10" fill="none" stroke="#2a2014" stroke-width="2.5"/><circle cx="38" cy="370" r="2" fill="#2a2014"/><line x1="38" y1="360" x2="38" y2="380" stroke="#2a2014" stroke-width="1"/><line x1="28" y1="370" x2="48" y2="370" stroke="#2a2014" stroke-width="1"/><line x1="50" y1="356" x2="55" y2="368" stroke="#2a2014" stroke-width="2" stroke-linecap="round"/>
<!-- Window halos -->
<ellipse cx="96" cy="210" rx="22" ry="18" fill="#996633" opacity="0.06"><animate attributeName="opacity" values="0.06;0.04;0.065;0.045;0.06" dur="4s" repeatCount="indefinite"/></ellipse>
<ellipse cx="285" cy="262" rx="18" ry="15" fill="#886633" opacity="0.05"><animate attributeName="opacity" values="0.05;0.035;0.055;0.04;0.05" dur="5s" repeatCount="indefinite"/></ellipse>
<ellipse cx="350" cy="262" rx="18" ry="15" fill="#996633" opacity="0.06"><animate attributeName="opacity" values="0.06;0.04;0.065;0.045;0.06" dur="4.5s" repeatCount="indefinite"/></ellipse>
<!-- Shadows and vignette -->
<rect x="55" y="340" width="165" height="10" fill="#0a0a0e" opacity="0.6"/><rect x="260" y="340" width="140" height="10" fill="#0a0a0e" opacity="0.55"/><rect x="450" y="340" width="155" height="10" fill="#0a0a0e" opacity="0.5"/><rect x="610" y="340" width="70" height="10" fill="#0a0a0e" opacity="0.55"/>
<rect x="0" y="0" width="30" height="400" fill="#050508" opacity="0.4"/><rect x="770" y="0" width="30" height="400" fill="#050508" opacity="0.4"/><rect x="0" y="385" width="800" height="15" fill="#050508" opacity="0.5"/>
      </svg>
    </div>
  `;
  demos.appendChild(a5village);

  // === 6. Voltri — Coastal Overlook ===
  const a6overlook = document.createElement('div');
  a6overlook.className = 'art-demo';
  a6overlook.innerHTML = `
    <h3 class="meter-demo-label">6. Voltri — Coastal Overlook</h3>
    <p style="color:var(--text-dim);font-size:12px;margin:4px 0 0;">Hillside panorama looking down at town and coast. Campfire, olive trees, crescent moon.</p>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
<defs>
  <linearGradient id="vtO_sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0b0e2a"/><stop offset="25%" stop-color="#141842"/><stop offset="55%" stop-color="#2a2458"/><stop offset="75%" stop-color="#4a3060"/><stop offset="88%" stop-color="#8b4a52"/><stop offset="95%" stop-color="#c47858"/><stop offset="100%" stop-color="#d4946a"/>
  </linearGradient>
  <linearGradient id="vtO_sea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#6b4850"/><stop offset="15%" stop-color="#3a3058"/><stop offset="45%" stop-color="#1a1e3a"/><stop offset="100%" stop-color="#0e1228"/>
  </linearGradient>
  <radialGradient id="vtO_moonGlow" cx="160" cy="55" r="90" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#c8c0b0" stop-opacity="0.12"/><stop offset="60%" stop-color="#8888aa" stop-opacity="0.05"/><stop offset="100%" stop-color="#0b0e2a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="vtO_horizonGlow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#d4946a" stop-opacity="0.4"/><stop offset="50%" stop-color="#c47858" stop-opacity="0.2"/><stop offset="100%" stop-color="#6b4850" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="vtO_fireGlow" cx="680" cy="340" r="200" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#c87020" stop-opacity="0.35"/><stop offset="30%" stop-color="#8b4513" stop-opacity="0.15"/><stop offset="60%" stop-color="#4a2008" stop-opacity="0.06"/><stop offset="100%" stop-color="#0b0e2a" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="vtO_ground" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0e1520"/><stop offset="40%" stop-color="#0a1018"/><stop offset="100%" stop-color="#060a10"/>
  </linearGradient>
  <radialGradient id="vtO_groundGlow" cx="680" cy="380" r="140" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#3a2010" stop-opacity="0.8"/><stop offset="40%" stop-color="#1a1008" stop-opacity="0.4"/><stop offset="100%" stop-color="#0a0e18" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vtO_windowGlow"><stop offset="0%" stop-color="#ffcc66" stop-opacity="0.9"/><stop offset="50%" stop-color="#cc8833" stop-opacity="0.4"/><stop offset="100%" stop-color="#cc8833" stop-opacity="0"/></radialGradient>
  <radialGradient id="vtO_townFireGlow"><stop offset="0%" stop-color="#ff9944" stop-opacity="0.6"/><stop offset="50%" stop-color="#cc6600" stop-opacity="0.2"/><stop offset="100%" stop-color="#cc6600" stop-opacity="0"/></radialGradient>
  <linearGradient id="vtO_townHaze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a2458" stop-opacity="0"/><stop offset="40%" stop-color="#1a1830" stop-opacity="0.15"/><stop offset="100%" stop-color="#0e1020" stop-opacity="0.3"/>
  </linearGradient>
  <radialGradient id="vtO_starGlow"><stop offset="0%" stop-color="#e0d8c8" stop-opacity="0.3"/><stop offset="100%" stop-color="#e0d8c8" stop-opacity="0"/></radialGradient>
</defs>
<rect width="800" height="400" fill="url(#vtO_sky)"/>
<circle cx="50" cy="18" r="1.0" fill="#d0c8b8" opacity="0.7"/><circle cx="140" cy="12" r="1.2" fill="#d0c8b8" opacity="0.8"/><circle cx="230" cy="25" r="0.8" fill="#d0c8b8" opacity="0.6"/><circle cx="280" cy="8" r="1.1" fill="#d0c8b8" opacity="0.75"/><circle cx="360" cy="22" r="0.9" fill="#d0c8b8" opacity="0.65"/><circle cx="440" cy="15" r="1.0" fill="#d0c8b8" opacity="0.7"/><circle cx="535" cy="10" r="1.1" fill="#d0c8b8" opacity="0.8"/><circle cx="625" cy="20" r="0.8" fill="#d0c8b8" opacity="0.55"/><circle cx="720" cy="28" r="0.9" fill="#d0c8b8" opacity="0.6"/><circle cx="760" cy="8" r="1.0" fill="#d0c8b8" opacity="0.7"/>
<circle cx="280" cy="8" r="3" fill="url(#vtO_starGlow)"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite"/></circle>
<circle cx="535" cy="10" r="3" fill="url(#vtO_starGlow)"><animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite"/></circle>
<!-- Moon -->
<circle cx="160" cy="55" r="11" fill="#c8c0a0" opacity="0.85"/><circle cx="166" cy="51" r="9.5" fill="#141842"/><circle cx="160" cy="55" r="80" fill="url(#vtO_moonGlow)"/>
<rect x="0" y="155" width="800" height="30" fill="url(#vtO_horizonGlow)"/>
<!-- Sea -->
<rect x="0" y="170" width="800" height="120" fill="url(#vtO_sea)"/>
<path d="M0,185 Q50,183 100,186 Q150,189 200,185 Q250,182 300,186 Q350,189 400,184 Q450,181 500,185 Q550,188 600,184 Q650,181 700,185 Q750,188 800,184" fill="none" stroke="#4a4868" stroke-width="0.5" opacity="0.3"/>
<path d="M0,200 Q60,198 120,201 Q180,204 240,199 Q300,196 360,200 Q420,203 480,199 Q540,196 600,200 Q660,203 720,199 Q780,196 800,199" fill="none" stroke="#3a3858" stroke-width="0.4" opacity="0.25"/>
<path d="M0,218 Q40,216 80,219 Q120,222 160,217 Q200,214 240,218 Q280,221 320,217 Q360,214 400,218 Q440,221 480,217 Q520,214 560,218 Q600,221 640,217 Q680,214 720,218 Q760,221 800,217" fill="none" stroke="#2a2848" stroke-width="0.4" opacity="0.2"/>
<!-- Moonlight on water -->
<ellipse cx="160" cy="195" rx="18" ry="3" fill="#c8c0a0" opacity="0.08"><animate attributeName="rx" values="18;22;18" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.08;0.12;0.08" dur="4s" repeatCount="indefinite"/></ellipse>
<ellipse cx="158" cy="205" rx="12" ry="2" fill="#c8c0a0" opacity="0.06"><animate attributeName="rx" values="12;16;12" dur="3.5s" repeatCount="indefinite"/></ellipse>
<!-- Distant headlands -->
<path d="M0,230 Q30,210 60,200 Q90,192 120,188 Q150,186 180,190 Q200,195 220,205 Q240,215 260,228 Q280,240 300,252 L300,290 Q250,275 200,270 Q150,268 100,272 Q50,278 0,285 Z" fill="#121832" opacity="0.6"/>
<path d="M0,265 Q20,250 50,240 Q80,232 110,228 Q140,226 170,232 Q190,238 210,248 Q230,258 250,268 L250,290 Q200,280 150,276 Q100,274 50,278 Q20,282 0,285 Z" fill="#0e1428" opacity="0.7"/>
<!-- Town of Voltri -->
<path d="M200,280 L205,262 L215,260 L220,265 L228,258 L235,262 L240,255 L248,258 L252,252 L260,256 L265,248 L272,252 L278,245 L285,250 L290,242 L295,246 L302,240 L308,245 L312,238 L318,242 L325,248 L330,252 L340,256 L350,260 L360,265 L370,270 L380,275 L390,280 L390,290 L200,290 Z" fill="#0c1020"/>
<path d="M248,258 L252,252 L260,256 L255,260 Z" fill="#3a2020" opacity="0.3"/><path d="M278,245 L285,250 L290,242 L283,246 Z" fill="#3a2222" opacity="0.25"/><path d="M302,240 L308,245 L312,238 L306,242 Z" fill="#382020" opacity="0.3"/>
<!-- Church steeple -->
<rect x="293" y="225" width="6" height="18" fill="#0a0e18"/><path d="M290,243 L296,225 L302,243 Z" fill="#0a0e18"/>
<!-- Town windows -->
<circle cx="222" cy="268" r="1.2" fill="url(#vtO_windowGlow)"/><circle cx="245" cy="260" r="0.8" fill="url(#vtO_windowGlow)"/><circle cx="258" cy="256" r="1.0" fill="url(#vtO_windowGlow)"/><circle cx="283" cy="250" r="1.1" fill="url(#vtO_windowGlow)"/><circle cx="306" cy="244" r="0.9" fill="url(#vtO_windowGlow)"/><circle cx="320" cy="250" r="1.0" fill="url(#vtO_windowGlow)"/><circle cx="348" cy="262" r="0.9" fill="url(#vtO_windowGlow)"/>
<circle cx="258" cy="256" r="1.0" fill="#ffcc66" opacity="0.5"><animate attributeName="opacity" values="0.5;0.7;0.4;0.6;0.5" dur="3s" repeatCount="indefinite"/></circle>
<circle cx="306" cy="244" r="0.9" fill="#ffcc66" opacity="0.4"><animate attributeName="opacity" values="0.4;0.6;0.3;0.5;0.4" dur="4s" repeatCount="indefinite"/></circle>
<circle cx="280" cy="260" r="35" fill="url(#vtO_townFireGlow)"/><circle cx="320" cy="255" r="25" fill="url(#vtO_townFireGlow)"/>
<rect x="190" y="230" width="210" height="65" fill="url(#vtO_townHaze)"/>
<!-- Foreground hillside -->
<path d="M0,300 Q50,290 100,295 Q180,300 250,310 Q350,320 450,315 Q520,310 580,305 Q640,298 700,290 Q740,286 770,284 L800,282 L800,400 L0,400 Z" fill="url(#vtO_ground)"/>
<rect x="480" y="260" width="320" height="140" fill="url(#vtO_fireGlow)"/><rect x="530" y="300" width="270" height="100" fill="url(#vtO_groundGlow)"/>
<!-- Stone wall -->
<path d="M380,325 L400,322 L420,320 L450,318 L480,316 L510,315 L540,314 L560,314 L540,320 L510,321 L480,322 L450,324 L420,326 L400,328 Z" fill="#1a1e28" stroke="#22283a" stroke-width="0.5"/>
<!-- Wild herbs -->
<path d="M80,305 Q82,295 85,288 Q86,295 88,305" fill="none" stroke="#0c1218" stroke-width="1.5"/><path d="M85,306 Q88,294 92,286 Q90,296 92,306" fill="none" stroke="#0a1016" stroke-width="1.2"/><path d="M180,315 Q183,306 187,298 Q185,308 187,315" fill="none" stroke="#0c1218" stroke-width="1.2"/><path d="M360,328 Q362,320 365,314 Q363,322 365,328" fill="none" stroke="#0c1218" stroke-width="1"/><path d="M600,308 Q603,298 607,290 Q605,300 607,308" fill="none" stroke="#1a1510" stroke-width="1.2"/><path d="M730,292 Q733,282 737,274 Q735,284 737,292" fill="none" stroke="#1a1510" stroke-width="1.3"/>
<!-- Olive trees -->
<path d="M130,310 Q128,290 132,275 Q134,268 130,262 Q128,258 132,255" fill="none" stroke="#0e1218" stroke-width="3" stroke-linecap="round"/><path d="M132,275 Q138,268 142,265" fill="none" stroke="#0e1218" stroke-width="2" stroke-linecap="round"/><path d="M130,280 Q124,272 120,268" fill="none" stroke="#0e1218" stroke-width="2" stroke-linecap="round"/><ellipse cx="132" cy="252" rx="18" ry="12" fill="#0a1218" opacity="0.9"/><ellipse cx="120" cy="262" rx="12" ry="10" fill="#0c1420" opacity="0.85"/><ellipse cx="144" cy="260" rx="14" ry="9" fill="#0a1218" opacity="0.85"/>
<path d="M580,310 Q578,292 582,278 Q584,272 580,266 Q578,262 582,258" fill="none" stroke="#14120e" stroke-width="3" stroke-linecap="round"/><path d="M582,278 Q588,270 592,266" fill="none" stroke="#14120e" stroke-width="2" stroke-linecap="round"/><ellipse cx="582" cy="255" rx="17" ry="11" fill="#121418" opacity="0.9"/><ellipse cx="570" cy="266" rx="11" ry="9" fill="#14161c" opacity="0.85"/><ellipse cx="594" cy="262" rx="13" ry="8" fill="#121418" opacity="0.85"/>
<!-- Rocks -->
<path d="M640,335 Q638,325 645,320 Q652,318 660,322 Q665,328 662,336 Z" fill="#1a1e28"/><path d="M655,330 Q660,325 668,328 Q672,332 670,338 Q665,340 658,338 Z" fill="#181c26"/><path d="M700,325 Q698,318 703,314 Q710,312 715,316 Q718,322 714,328 Q708,330 702,328 Z" fill="#1c2030"/>
<!-- Campfire -->
<ellipse cx="680" cy="345" rx="20" ry="6" fill="#1a1e28"/><ellipse cx="680" cy="342" rx="18" ry="5" fill="#222838"/>
<line x1="668" y1="340" x2="692" y2="338" stroke="#2a1a0a" stroke-width="3.5" stroke-linecap="round"/><line x1="672" y1="336" x2="690" y2="340" stroke="#2a1a0a" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="680" cy="340" rx="10" ry="3" fill="#cc4400" opacity="0.4"><animate attributeName="opacity" values="0.4;0.55;0.35;0.45;0.4" dur="1.5s" repeatCount="indefinite"/></ellipse>
<path d="M680,298 Q672,318 665,335 Q673,325 680,315 Q687,325 695,335 Q688,318 680,298Z" fill="#cc5511" opacity="0.85"><animate attributeName="d" values="M680,298 Q672,318 665,335 Q673,325 680,315 Q687,325 695,335 Q688,318 680,298Z;M680,292 Q670,315 663,335 Q672,322 680,310 Q688,322 697,335 Q690,315 680,292Z;M680,298 Q672,318 665,335 Q673,325 680,315 Q687,325 695,335 Q688,318 680,298Z" dur="0.8s" repeatCount="indefinite"/></path>
<path d="M680,306 Q675,320 670,333 Q676,324 680,314 Q684,324 690,333 Q685,320 680,306Z" fill="#dd8822" opacity="0.8"><animate attributeName="d" values="M680,306 Q675,320 670,333 Q676,324 680,314 Q684,324 690,333 Q685,320 680,306Z;M680,302 Q674,318 668,333 Q675,322 680,311 Q685,322 692,333 Q686,318 680,302Z;M680,306 Q675,320 670,333 Q676,324 680,314 Q684,324 690,333 Q685,320 680,306Z" dur="0.6s" repeatCount="indefinite"/></path>
<path d="M680,312 Q677,324 674,332 Q678,325 680,317 Q682,325 686,332 Q683,324 680,312Z" fill="#ffcc44" opacity="0.75"><animate attributeName="d" values="M680,312 Q677,324 674,332 Q678,325 680,317 Q682,325 686,332 Q683,324 680,312Z;M680,308 Q676,322 673,332 Q677,323 680,314 Q683,323 687,332 Q684,322 680,308Z;M680,312 Q677,324 674,332 Q678,325 680,317 Q682,325 686,332 Q683,324 680,312Z" dur="0.5s" repeatCount="indefinite"/></path>
<ellipse cx="680" cy="345" rx="22" ry="5" fill="#cc5500" opacity="0.3"><animate attributeName="rx" values="22;26;22" dur="0.7s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0.4;0.3" dur="0.7s" repeatCount="indefinite"/></ellipse>
<!-- Sparks -->
<circle cx="675" cy="280" r="1.3" fill="#ffaa22" opacity="0.7"><animate attributeName="cy" values="295;260;225" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.7;0.4;0" dur="2.2s" repeatCount="indefinite"/><animate attributeName="cx" values="675;670;667" dur="2.2s" repeatCount="indefinite"/></circle>
<circle cx="685" cy="275" r="0.9" fill="#ff8811" opacity="0.6"><animate attributeName="cy" values="290;250;210" dur="2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0.35;0" dur="2.8s" repeatCount="indefinite"/><animate attributeName="cx" values="685;690;694" dur="2.8s" repeatCount="indefinite"/></circle>
<circle cx="680" cy="282" r="1.1" fill="#ffcc44" opacity="0.55"><animate attributeName="cy" values="292;245;198" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.55;0.25;0" dur="3.2s" repeatCount="indefinite"/><animate attributeName="cx" values="680;676;673" dur="3.2s" repeatCount="indefinite"/></circle>
<circle cx="678" cy="278" r="0.7" fill="#ff9933" opacity="0.6"><animate attributeName="cy" values="288;255;222" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0.35;0" dur="1.8s" repeatCount="indefinite"/><animate attributeName="cx" values="678;682;686" dur="1.8s" repeatCount="indefinite"/></circle>
<!-- Foreground -->
<path d="M0,380 Q80,372 160,378 Q240,384 320,376 Q400,370 480,375 Q560,380 640,372 Q720,366 800,372 L800,400 L0,400 Z" fill="#060a10" opacity="0.85"/>
      </svg>
    </div>
  `;
  demos.appendChild(a6overlook);

  // === 7. Voltri — Garrison Courtyard ===
  const a7garrison = document.createElement('div');
  a7garrison.className = 'art-demo';
  a7garrison.innerHTML = `
    <h3 class="meter-demo-label">7. Voltri — Garrison Courtyard</h3>
    <p style="color:var(--text-dim);font-size:12px;margin:4px 0 0;">Stone courtyard with arch, torch, lantern, crate stack, musket rack, French tricolor.</p>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
        <defs>
  <!-- Sky gradient - deep night -->
  <linearGradient id="vtG_sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#040810"/>
    <stop offset="50%" stop-color="#081020"/>
    <stop offset="100%" stop-color="#0c1628"/>
  </linearGradient>

  <!-- Left wall stone gradient -->
  <linearGradient id="vtG_wallLeft" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#2a2218"/>
    <stop offset="40%" stop-color="#3a3028"/>
    <stop offset="100%" stop-color="#1e1810"/>
  </linearGradient>

  <!-- Right wall stone gradient -->
  <linearGradient id="vtG_wallRight" x1="1" y1="0" x2="0" y2="0">
    <stop offset="0%" stop-color="#241e14"/>
    <stop offset="40%" stop-color="#302820"/>
    <stop offset="100%" stop-color="#1a1408"/>
  </linearGradient>

  <!-- Back wall gradient -->
  <linearGradient id="vtG_wallBack" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1e1810"/>
    <stop offset="100%" stop-color="#2a2218"/>
  </linearGradient>

  <!-- Archway sky glimpse -->
  <linearGradient id="vtG_archSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a1428"/>
    <stop offset="60%" stop-color="#0e1830"/>
    <stop offset="100%" stop-color="#121c38"/>
  </linearGradient>

  <!-- Ground gradient - packed earth -->
  <linearGradient id="vtG_ground" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a1408"/>
    <stop offset="40%" stop-color="#221a0e"/>
    <stop offset="100%" stop-color="#181208"/>
  </linearGradient>

  <!-- Torch glow - warm radial from left wall torch -->
  <radialGradient id="vtG_torchGlow" cx="145" cy="180" r="200" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#c87020" stop-opacity="0.35"/>
    <stop offset="30%" stop-color="#a05818" stop-opacity="0.15"/>
    <stop offset="70%" stop-color="#804010" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#040810" stop-opacity="0"/>
  </radialGradient>

  <!-- Lantern glow - smaller warm radial from right ground -->
  <radialGradient id="vtG_lanternGlow" cx="640" cy="330" r="140" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#b86828" stop-opacity="0.25"/>
    <stop offset="35%" stop-color="#905020" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#040810" stop-opacity="0"/>
  </radialGradient>

  <!-- Torch warm light on left wall -->
  <radialGradient id="vtG_wallWarmL" cx="140" cy="185" r="120" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#c87830" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#a06020" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <!-- Lantern warm light on right wall -->
  <radialGradient id="vtG_wallWarmR" cx="650" cy="320" r="100" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#b07030" stop-opacity="0.2"/>
    <stop offset="60%" stop-color="#906020" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <!-- Ground fire reflections -->
  <radialGradient id="vtG_groundGlowL" cx="200" cy="350" r="180" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#a06020" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <radialGradient id="vtG_groundGlowR" cx="600" cy="360" r="120" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#906018" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <!-- Moonlight through arch -->
  <radialGradient id="vtG_moonArch" cx="400" cy="155" r="70" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#8090b0" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <!-- Sea shimmer gradient -->
  <linearGradient id="vtG_sea" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#182838"/>
    <stop offset="50%" stop-color="#203040"/>
    <stop offset="100%" stop-color="#182838"/>
  </linearGradient>

  <!-- Darkness overlay for deep corners -->
  <radialGradient id="vtG_cornerDarkTL" cx="0" cy="400" r="250" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#000" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vtG_cornerDarkTR" cx="800" cy="400" r="250" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#000" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0"/>
  </radialGradient>

  <!-- Flag tricolor -->
  <linearGradient id="vtG_flagBlue" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#1a2a60"/>
    <stop offset="100%" stop-color="#243478"/>
  </linearGradient>
  <linearGradient id="vtG_flagWhite" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#b0a890"/>
    <stop offset="100%" stop-color="#c8c0a8"/>
  </linearGradient>
  <linearGradient id="vtG_flagRed" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#8b2020"/>
    <stop offset="100%" stop-color="#a02828"/>
  </linearGradient>

  <!-- Barrel/crate wood -->
  <linearGradient id="vtG_barrel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a2a18"/>
    <stop offset="50%" stop-color="#2e2010"/>
    <stop offset="100%" stop-color="#241a0c"/>
  </linearGradient>

  <!-- Torch flame gradient -->
  <radialGradient id="vtG_flameCore">
    <stop offset="0%" stop-color="#ffe070"/>
    <stop offset="40%" stop-color="#ee9922"/>
    <stop offset="100%" stop-color="#cc5500" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- ========== SKY (visible through open top of courtyard) ========== -->
<rect width="800" height="400" fill="url(#vtG_sky)"/>

<!-- Stars visible above the courtyard -->
<circle cx="200" cy="18" r="1.0" fill="#c8c0b0" opacity="0.7"/>
<circle cx="250" cy="8" r="0.7" fill="#c8c0b0" opacity="0.5"/>
<circle cx="310" cy="25" r="1.2" fill="#c8c0b0" opacity="0.8"/>
<circle cx="355" cy="10" r="0.6" fill="#c8c0b0" opacity="0.4"/>
<circle cx="400" cy="30" r="0.9" fill="#c8c0b0" opacity="0.6"/>
<circle cx="445" cy="5" r="1.1" fill="#c8c0b0" opacity="0.7"/>
<circle cx="480" cy="22" r="0.7" fill="#c8c0b0" opacity="0.5"/>
<circle cx="530" cy="12" r="1.0" fill="#c8c0b0" opacity="0.8"/>
<circle cx="570" cy="28" r="0.6" fill="#c8c0b0" opacity="0.4"/>
<circle cx="610" cy="8" r="0.8" fill="#c8c0b0" opacity="0.6"/>
<circle cx="280" cy="40" r="0.5" fill="#c8c0b0" opacity="0.35"/>
<circle cx="420" cy="45" r="0.7" fill="#c8c0b0" opacity="0.3"/>
<circle cx="510" cy="38" r="0.6" fill="#c8c0b0" opacity="0.45"/>
<circle cx="340" cy="48" r="0.8" fill="#c8c0b0" opacity="0.35"/>

<!-- Twinkling star animations -->
<circle cx="310" cy="25" r="1.2" fill="#d8d0c0" opacity="0.5">
  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite"/>
</circle>
<circle cx="445" cy="5" r="1.1" fill="#d8d0c0" opacity="0.4">
  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite"/>
</circle>
<circle cx="530" cy="12" r="1.0" fill="#d8d0c0" opacity="0.5">
  <animate attributeName="opacity" values="0.5;0.85;0.5" dur="2.5s" repeatCount="indefinite"/>
</circle>

<!-- ========== BACK WALL with ARCHWAY ========== -->

<!-- Back wall - spans width, lower portion of sky area -->
<rect x="120" y="80" width="560" height="180" fill="url(#vtG_wallBack)"/>

<!-- Stone texture lines on back wall - horizontal mortar -->
<line x1="120" y1="100" x2="680" y2="100" stroke="#14100a" stroke-width="0.5" opacity="0.4"/>
<line x1="120" y1="120" x2="680" y2="120" stroke="#14100a" stroke-width="0.5" opacity="0.35"/>
<line x1="120" y1="140" x2="680" y2="140" stroke="#14100a" stroke-width="0.5" opacity="0.4"/>
<line x1="120" y1="158" x2="680" y2="158" stroke="#14100a" stroke-width="0.5" opacity="0.3"/>
<line x1="120" y1="175" x2="680" y2="175" stroke="#14100a" stroke-width="0.5" opacity="0.35"/>
<line x1="120" y1="192" x2="680" y2="192" stroke="#14100a" stroke-width="0.5" opacity="0.4"/>
<line x1="120" y1="210" x2="680" y2="210" stroke="#14100a" stroke-width="0.5" opacity="0.35"/>
<line x1="120" y1="228" x2="680" y2="228" stroke="#14100a" stroke-width="0.5" opacity="0.3"/>
<line x1="120" y1="245" x2="680" y2="245" stroke="#14100a" stroke-width="0.5" opacity="0.35"/>

<!-- Vertical mortar lines (staggered brick pattern) -->
<line x1="180" y1="80" x2="180" y2="100" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="240" y1="80" x2="240" y2="100" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="300" y1="80" x2="300" y2="100" stroke="#14100a" stroke-width="0.4" opacity="0.25"/>
<line x1="210" y1="100" x2="210" y2="120" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="270" y1="100" x2="270" y2="120" stroke="#14100a" stroke-width="0.4" opacity="0.25"/>
<line x1="150" y1="120" x2="150" y2="140" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="220" y1="120" x2="220" y2="140" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="550" y1="80" x2="550" y2="100" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="610" y1="80" x2="610" y2="100" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="580" y1="100" x2="580" y2="120" stroke="#14100a" stroke-width="0.4" opacity="0.25"/>
<line x1="640" y1="100" x2="640" y2="120" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="570" y1="120" x2="570" y2="140" stroke="#14100a" stroke-width="0.4" opacity="0.3"/>
<line x1="630" y1="120" x2="630" y2="140" stroke="#14100a" stroke-width="0.4" opacity="0.25"/>

<!-- ========== ARCHWAY opening ========== -->
<!-- Arch opening - sky/sea visible through it -->
<path d="M330,260 L330,150 Q330,105 400,105 Q470,105 470,150 L470,260 Z" fill="url(#vtG_archSky)"/>

<!-- Stars through the arch -->
<circle cx="370" cy="120" r="0.8" fill="#c8c0b0" opacity="0.6"/>
<circle cx="420" cy="115" r="0.6" fill="#c8c0b0" opacity="0.5"/>
<circle cx="390" cy="130" r="0.5" fill="#c8c0b0" opacity="0.4"/>
<circle cx="440" cy="125" r="0.7" fill="#c8c0b0" opacity="0.5"/>
<circle cx="360" cy="140" r="0.4" fill="#c8c0b0" opacity="0.35"/>
<circle cx="410" cy="138" r="0.6" fill="#c8c0b0" opacity="0.45"/>
<circle cx="450" cy="145" r="0.5" fill="#c8c0b0" opacity="0.4"/>

<!-- Distant sea through arch - thin band -->
<rect x="335" y="220" width="130" height="18" fill="url(#vtG_sea)" opacity="0.5"/>
<!-- Moonlight reflection on sea -->
<ellipse cx="400" cy="228" rx="20" ry="3" fill="#4060a0" opacity="0.15"/>
<line x1="395" y1="225" x2="405" y2="230" stroke="#5070a0" stroke-width="0.5" opacity="0.2"/>
<line x1="388" y1="227" x2="398" y2="232" stroke="#5070a0" stroke-width="0.3" opacity="0.15"/>
<line x1="405" y1="224" x2="412" y2="229" stroke="#5070a0" stroke-width="0.4" opacity="0.18"/>

<!-- Distant land/rooftops through arch -->
<path d="M335,238 L350,232 L365,236 L380,228 L395,234 L410,226 L425,232 L440,228 L455,234 L465,230 L465,260 L335,260 Z" fill="#0e1420" opacity="0.8"/>
<!-- A rooftop or two -->
<path d="M370,234 L378,228 L386,234 Z" fill="#161e2c" opacity="0.5"/>
<path d="M420,230 L430,224 L440,230 Z" fill="#161e2c" opacity="0.5"/>

<!-- Ground through arch -->
<rect x="335" y="242" width="130" height="18" fill="#121018" opacity="0.6"/>

<!-- Arch stone border - thick keystone arch -->
<path d="M325,260 L325,152 Q325,100 400,100 Q475,100 475,152 L475,260" fill="none" stroke="#342a1e" stroke-width="8"/>
<path d="M325,260 L325,152 Q325,100 400,100 Q475,100 475,152 L475,260" fill="none" stroke="#28201a" stroke-width="3"/>

<!-- Keystone at top of arch -->
<path d="M393,101 L400,95 L407,101" fill="#3a3028" stroke="#2a2018" stroke-width="1"/>

<!-- Moonlight glow through arch -->
<rect x="330" y="100" width="140" height="160" fill="url(#vtG_moonArch)"/>

<!-- ========== LEFT WALL (perspective, closer to viewer) ========== -->
<!-- Main left wall shape - angled for perspective -->
<path d="M0,55 L120,80 L120,260 L0,400 Z" fill="url(#vtG_wallLeft)"/>

<!-- Stone texture on left wall - horizontal mortar lines -->
<line x1="0" y1="90" x2="120" y2="100" stroke="#1a1408" stroke-width="0.6" opacity="0.4"/>
<line x1="0" y1="125" x2="120" y2="120" stroke="#1a1408" stroke-width="0.6" opacity="0.35"/>
<line x1="0" y1="160" x2="120" y2="140" stroke="#1a1408" stroke-width="0.6" opacity="0.4"/>
<line x1="0" y1="195" x2="120" y2="160" stroke="#1a1408" stroke-width="0.6" opacity="0.3"/>
<line x1="0" y1="230" x2="120" y2="180" stroke="#1a1408" stroke-width="0.6" opacity="0.35"/>
<line x1="0" y1="265" x2="120" y2="200" stroke="#1a1408" stroke-width="0.6" opacity="0.4"/>
<line x1="0" y1="300" x2="120" y2="220" stroke="#1a1408" stroke-width="0.6" opacity="0.35"/>
<line x1="0" y1="335" x2="120" y2="240" stroke="#1a1408" stroke-width="0.6" opacity="0.3"/>
<line x1="0" y1="370" x2="120" y2="255" stroke="#1a1408" stroke-width="0.6" opacity="0.35"/>

<!-- Vertical mortar on left wall -->
<line x1="40" y1="65" x2="40" y2="400" stroke="#1a1408" stroke-width="0.4" opacity="0.25"/>
<line x1="80" y1="72" x2="80" y2="340" stroke="#1a1408" stroke-width="0.4" opacity="0.25"/>
<line x1="60" y1="90" x2="55" y2="300" stroke="#1a1408" stroke-width="0.4" opacity="0.2"/>
<line x1="100" y1="80" x2="105" y2="280" stroke="#1a1408" stroke-width="0.4" opacity="0.2"/>

<!-- Warm torchlight on left wall -->
<path d="M0,55 L120,80 L120,260 L0,400 Z" fill="url(#vtG_wallWarmL)"/>

<!-- ========== RIGHT WALL (perspective) ========== -->
<path d="M800,55 L680,80 L680,260 L800,400 Z" fill="url(#vtG_wallRight)"/>

<!-- Stone texture on right wall -->
<line x1="800" y1="90" x2="680" y2="100" stroke="#14100a" stroke-width="0.6" opacity="0.35"/>
<line x1="800" y1="125" x2="680" y2="120" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>
<line x1="800" y1="160" x2="680" y2="140" stroke="#14100a" stroke-width="0.6" opacity="0.35"/>
<line x1="800" y1="195" x2="680" y2="160" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>
<line x1="800" y1="230" x2="680" y2="180" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>
<line x1="800" y1="265" x2="680" y2="200" stroke="#14100a" stroke-width="0.6" opacity="0.35"/>
<line x1="800" y1="300" x2="680" y2="220" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>
<line x1="800" y1="335" x2="680" y2="240" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>
<line x1="800" y1="370" x2="680" y2="255" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>

<!-- Vertical mortar on right wall -->
<line x1="760" y1="65" x2="760" y2="400" stroke="#14100a" stroke-width="0.4" opacity="0.2"/>
<line x1="720" y1="72" x2="720" y2="340" stroke="#14100a" stroke-width="0.4" opacity="0.2"/>
<line x1="740" y1="90" x2="745" y2="300" stroke="#14100a" stroke-width="0.4" opacity="0.18"/>
<line x1="700" y1="80" x2="695" y2="280" stroke="#14100a" stroke-width="0.4" opacity="0.18"/>

<!-- Lantern warm on right wall -->
<path d="M800,55 L680,80 L680,260 L800,400 Z" fill="url(#vtG_wallWarmR)"/>

<!-- ========== GROUND PLANE ========== -->
<path d="M0,400 L120,260 L680,260 L800,400 Z" fill="url(#vtG_ground)"/>

<!-- Flagstone lines on ground -->
<line x1="150" y1="275" x2="650" y2="275" stroke="#14100a" stroke-width="0.5" opacity="0.25"/>
<line x1="130" y1="300" x2="670" y2="300" stroke="#14100a" stroke-width="0.5" opacity="0.3"/>
<line x1="110" y1="325" x2="690" y2="325" stroke="#14100a" stroke-width="0.6" opacity="0.3"/>
<line x1="80" y1="355" x2="720" y2="355" stroke="#14100a" stroke-width="0.6" opacity="0.25"/>
<line x1="50" y1="380" x2="750" y2="380" stroke="#14100a" stroke-width="0.5" opacity="0.2"/>
<!-- Vertical flagstone lines -->
<line x1="250" y1="260" x2="200" y2="400" stroke="#14100a" stroke-width="0.4" opacity="0.2"/>
<line x1="350" y1="260" x2="320" y2="400" stroke="#14100a" stroke-width="0.4" opacity="0.2"/>
<line x1="450" y1="260" x2="480" y2="400" stroke="#14100a" stroke-width="0.4" opacity="0.2"/>
<line x1="550" y1="260" x2="600" y2="400" stroke="#14100a" stroke-width="0.4" opacity="0.2"/>

<!-- Ground fire glow pools -->
<rect x="0" y="260" width="800" height="140" fill="url(#vtG_groundGlowL)"/>
<rect x="0" y="260" width="800" height="140" fill="url(#vtG_groundGlowR)"/>

<!-- ========== TORCH on left wall ========== -->
<!-- Iron bracket/cage mounted on wall -->
<g>
  <!-- Mounting bracket -->
  <line x1="128" y1="175" x2="148" y2="170" stroke="#2a2220" stroke-width="3" stroke-linecap="round"/>
  <line x1="148" y1="170" x2="148" y2="185" stroke="#2a2220" stroke-width="2"/>
  <!-- Iron cage basket -->
  <path d="M140,185 L156,185 L154,195 L142,195 Z" fill="none" stroke="#302820" stroke-width="1.5"/>
  <line x1="141" y1="190" x2="155" y2="190" stroke="#302820" stroke-width="0.8"/>
  <!-- Coals in basket -->
  <ellipse cx="148" cy="192" rx="5" ry="2" fill="#4a1800" opacity="0.8"/>

  <!-- Torch flames - outer -->
  <path d="M148,165 Q142,175 139,185 Q144,178 148,172 Q152,178 157,185 Q154,175 148,165Z" fill="#cc5500" opacity="0.8">
    <animate attributeName="d" values="M148,165 Q142,175 139,185 Q144,178 148,172 Q152,178 157,185 Q154,175 148,165Z;M148,160 Q140,173 137,185 Q143,176 148,168 Q153,176 159,185 Q156,173 148,160Z;M148,165 Q142,175 139,185 Q144,178 148,172 Q152,178 157,185 Q154,175 148,165Z" dur="0.7s" repeatCount="indefinite"/>
  </path>
  <!-- Middle flame -->
  <path d="M148,170 Q144,178 142,185 Q146,179 148,174 Q150,179 154,185 Q152,178 148,170Z" fill="#ee8811" opacity="0.85">
    <animate attributeName="d" values="M148,170 Q144,178 142,185 Q146,179 148,174 Q150,179 154,185 Q152,178 148,170Z;M148,167 Q143,176 140,185 Q145,177 148,171 Q151,177 156,185 Q153,176 148,167Z;M148,170 Q144,178 142,185 Q146,179 148,174 Q150,179 154,185 Q152,178 148,170Z" dur="0.5s" repeatCount="indefinite"/>
  </path>
  <!-- Inner flame -->
  <path d="M148,174 Q146,180 144,184 Q147,180 148,177 Q149,180 152,184 Q150,180 148,174Z" fill="#ffcc44" opacity="0.8">
    <animate attributeName="d" values="M148,174 Q146,180 144,184 Q147,180 148,177 Q149,180 152,184 Q150,180 148,174Z;M148,172 Q145,179 143,184 Q146,178 148,175 Q150,178 153,184 Q151,179 148,172Z;M148,174 Q146,180 144,184 Q147,180 148,177 Q149,180 152,184 Q150,180 148,174Z" dur="0.4s" repeatCount="indefinite"/>
  </path>

  <!-- Torch sparks -->
  <circle cx="146" cy="162" r="1.0" fill="#ffaa22" opacity="0.7">
    <animate attributeName="cy" values="165;140;115" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.7;0.4;0" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="146;142;140" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="150" cy="160" r="0.7" fill="#ff8811" opacity="0.6">
    <animate attributeName="cy" values="163;135;108" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0.3;0" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="150;153;156" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="148" cy="158" r="0.8" fill="#ffcc44" opacity="0.5">
    <animate attributeName="cy" values="162;130;100" dur="3.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.5;0.25;0" dur="3.2s" repeatCount="indefinite"/>
    <animate attributeName="cx" values="148;145;143" dur="3.2s" repeatCount="indefinite"/>
  </circle>
</g>

<!-- Torch glow on scene -->
<rect width="800" height="400" fill="url(#vtG_torchGlow)"/>

<!-- ========== LANTERN on ground (right side) ========== -->
<g>
  <!-- Lantern body -->
  <rect x="635" y="316" width="12" height="18" rx="1" fill="#2a2218" stroke="#342a20" stroke-width="0.5"/>
  <!-- Glass panes suggestion -->
  <rect x="637" y="318" width="8" height="14" rx="0.5" fill="#3a2008" opacity="0.6"/>
  <!-- Lantern top -->
  <path d="M634,316 L641,310 L648,316" fill="#2a2218" stroke="#342a20" stroke-width="0.5"/>
  <!-- Handle -->
  <path d="M639,310 Q641,306 643,310" fill="none" stroke="#2a2218" stroke-width="0.8"/>

  <!-- Lantern flame - small -->
  <ellipse cx="641" cy="324" rx="2.5" ry="4" fill="#dd7711" opacity="0.7">
    <animate attributeName="ry" values="4;4.5;3.8;4" dur="0.9s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.7;0.8;0.65;0.7" dur="0.9s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="641" cy="325" rx="1.5" ry="2.5" fill="#ffbb33" opacity="0.6">
    <animate attributeName="ry" values="2.5;3;2.3;2.5" dur="0.7s" repeatCount="indefinite"/>
  </ellipse>

  <!-- Warm glow around lantern -->
  <ellipse cx="641" cy="334" rx="15" ry="4" fill="#b06020" opacity="0.2">
    <animate attributeName="rx" values="15;17;15" dur="1.2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.2;0.25;0.2" dur="1.2s" repeatCount="indefinite"/>
  </ellipse>
</g>

<!-- Lantern glow on scene -->
<rect width="800" height="400" fill="url(#vtG_lanternGlow)"/>

<!-- ========== SUPPLY CRATES/BARRELS (right corner) ========== -->
<g>
  <!-- Large barrel -->
  <ellipse cx="720" cy="310" rx="18" ry="8" fill="#241a0c"/>
  <rect x="702" y="295" width="36" height="15" rx="2" fill="url(#vtG_barrel)"/>
  <ellipse cx="720" cy="295" rx="18" ry="8" fill="#3a2a18"/>
  <ellipse cx="720" cy="295" rx="14" ry="6" fill="#302010" opacity="0.3"/>
  <!-- Barrel bands -->
  <line x1="704" y1="300" x2="736" y2="300" stroke="#1a1208" stroke-width="1" opacity="0.5"/>
  <line x1="704" y1="307" x2="736" y2="307" stroke="#1a1208" stroke-width="1" opacity="0.5"/>

  <!-- Stacked crate 1 -->
  <rect x="738" y="305" width="30" height="22" fill="#2e2010" stroke="#1a1408" stroke-width="0.5"/>
  <line x1="753" y1="305" x2="753" y2="327" stroke="#1a1408" stroke-width="0.5" opacity="0.4"/>
  <line x1="738" y1="316" x2="768" y2="316" stroke="#1a1408" stroke-width="0.5" opacity="0.4"/>

  <!-- Stacked crate 2 on top -->
  <rect x="742" y="288" width="24" height="17" fill="#322414" stroke="#1a1408" stroke-width="0.5"/>
  <line x1="754" y1="288" x2="754" y2="305" stroke="#1a1408" stroke-width="0.4" opacity="0.35"/>

  <!-- Small barrel next to crates -->
  <ellipse cx="695" cy="330" rx="12" ry="5" fill="#1e1508"/>
  <rect x="683" y="320" width="24" height="10" rx="2" fill="#2a1e10"/>
  <ellipse cx="695" cy="320" rx="12" ry="5" fill="#342410"/>
  <line x1="685" y1="324" x2="705" y2="324" stroke="#1a1208" stroke-width="0.8" opacity="0.4"/>
</g>

<!-- ========== MUSKET RACK (left side, near wall) ========== -->
<g>
  <!-- Vertical uprights -->
  <line x1="170" y1="225" x2="175" y2="310" stroke="#2e2010" stroke-width="3" stroke-linecap="round"/>
  <line x1="220" y1="225" x2="225" y2="310" stroke="#2e2010" stroke-width="3" stroke-linecap="round"/>
  <!-- Horizontal bar - top -->
  <line x1="170" y1="235" x2="220" y2="235" stroke="#2e2010" stroke-width="2.5"/>
  <!-- Horizontal bar - bottom brace -->
  <line x1="173" y1="290" x2="223" y2="290" stroke="#2e2010" stroke-width="2"/>
  <!-- Notches carved in top bar (empty - no muskets) -->
  <line x1="180" y1="232" x2="180" y2="238" stroke="#1a1408" stroke-width="1.5"/>
  <line x1="190" y1="232" x2="190" y2="238" stroke="#1a1408" stroke-width="1.5"/>
  <line x1="200" y1="232" x2="200" y2="238" stroke="#1a1408" stroke-width="1.5"/>
  <line x1="210" y1="232" x2="210" y2="238" stroke="#1a1408" stroke-width="1.5"/>
  <!-- Cross brace -->
  <line x1="172" y1="245" x2="222" y2="285" stroke="#2a1c0e" stroke-width="1.5"/>
</g>

<!-- ========== WOODEN TABLE/BENCH (center-left area) ========== -->
<g>
  <!-- Table top -->
  <rect x="240" y="295" width="70" height="4" rx="1" fill="#322414" stroke="#241a0e" stroke-width="0.5"/>
  <!-- Table legs -->
  <line x1="248" y1="299" x2="245" y2="325" stroke="#2a1e10" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="302" y1="299" x2="305" y2="325" stroke="#2a1e10" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Cross brace -->
  <line x1="250" y1="315" x2="300" y2="315" stroke="#241a0e" stroke-width="1.5"/>
</g>

<!-- ========== FRENCH TRICOLOR FLAG ========== -->
<g>
  <!-- Flag pole mounted on back wall, left of arch -->
  <line x1="200" y1="100" x2="200" y2="215" stroke="#2a2218" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Pole mounting bracket -->
  <path d="M195,108 L200,105 L205,108" fill="none" stroke="#322a1e" stroke-width="1.5"/>

  <!-- Flag hanging from pole - tricolor (blue, white, red) -->
  <!-- Slightly draped/angled -->
  <g>
    <!-- Blue stripe -->
    <path d="M202,110 Q208,112 212,118 Q210,130 208,140 L200,140 L200,110 Z" fill="url(#vtG_flagBlue)" opacity="0.85">
      <animate attributeName="d" values="M202,110 Q208,112 212,118 Q210,130 208,140 L200,140 L200,110 Z;M202,110 Q209,113 213,119 Q211,131 209,141 L200,141 L200,110 Z;M202,110 Q208,112 212,118 Q210,130 208,140 L200,140 L200,110 Z" dur="4s" repeatCount="indefinite"/>
    </path>
    <!-- White stripe -->
    <path d="M208,140 Q210,130 212,118 Q216,124 218,135 Q216,148 214,155 L204,155 L200,140 Z" fill="url(#vtG_flagWhite)" opacity="0.8">
      <animate attributeName="d" values="M208,140 Q210,130 212,118 Q216,124 218,135 Q216,148 214,155 L204,155 L200,140 Z;M209,141 Q211,131 213,119 Q217,125 219,136 Q217,149 215,156 L205,156 L200,141 Z;M208,140 Q210,130 212,118 Q216,124 218,135 Q216,148 214,155 L204,155 L200,140 Z" dur="4s" repeatCount="indefinite"/>
    </path>
    <!-- Red stripe -->
    <path d="M214,155 Q216,148 218,135 Q222,140 224,150 Q222,162 220,170 L208,170 L200,155 Z" fill="url(#vtG_flagRed)" opacity="0.85">
      <animate attributeName="d" values="M214,155 Q216,148 218,135 Q222,140 224,150 Q222,162 220,170 L208,170 L200,155 Z;M215,156 Q217,149 219,136 Q223,141 225,151 Q223,163 221,171 L209,171 L200,156 Z;M214,155 Q216,148 218,135 Q222,140 224,150 Q222,162 220,170 L208,170 L200,155 Z" dur="4s" repeatCount="indefinite"/>
    </path>
  </g>
</g>

<!-- ========== BENCH (right of center) ========== -->
<g>
  <!-- Bench seat -->
  <rect x="500" y="305" width="55" height="3" rx="0.5" fill="#2a1e10" stroke="#1e1408" stroke-width="0.3"/>
  <!-- Bench legs -->
  <line x1="508" y1="308" x2="506" y2="325" stroke="#241a0e" stroke-width="2" stroke-linecap="round"/>
  <line x1="548" y1="308" x2="550" y2="325" stroke="#241a0e" stroke-width="2" stroke-linecap="round"/>
</g>

<!-- ========== ATMOSPHERE & SHADOW OVERLAYS ========== -->

<!-- Deep shadows in left corner -->
<rect width="800" height="400" fill="url(#vtG_cornerDarkTL)"/>
<!-- Deep shadows in right corner -->
<rect width="800" height="400" fill="url(#vtG_cornerDarkTR)"/>

<!-- Very subtle overall dark vignette -->
<rect width="800" height="400" fill="none" stroke="#000" stroke-width="80" opacity="0.15"/>

<!-- Torch glow shimmer on left wall (animated) -->
<ellipse cx="140" cy="195" rx="30" ry="40" fill="#a06020" opacity="0.04">
  <animate attributeName="opacity" values="0.04;0.07;0.04" dur="1.5s" repeatCount="indefinite"/>
  <animate attributeName="rx" values="30;33;30" dur="1.5s" repeatCount="indefinite"/>
</ellipse>

<!-- Faint light pool from torch on ground -->
<ellipse cx="180" cy="290" rx="35" ry="10" fill="#a06020" opacity="0.06">
  <animate attributeName="opacity" values="0.06;0.09;0.06" dur="1.3s" repeatCount="indefinite"/>
</ellipse>

<!-- Faint light pool from lantern on ground -->
<ellipse cx="640" cy="340" rx="25" ry="8" fill="#a06020" opacity="0.05">
  <animate attributeName="opacity" values="0.05;0.08;0.05" dur="1.6s" repeatCount="indefinite"/>
</ellipse>

<!-- Top edge of walls creating roofless framing -->
<line x1="0" y1="55" x2="120" y2="80" stroke="#1a1408" stroke-width="2"/>
<line x1="800" y1="55" x2="680" y2="80" stroke="#1a1408" stroke-width="2"/>
<line x1="120" y1="80" x2="680" y2="80" stroke="#1a1408" stroke-width="1.5" opacity="0.5"/>

<!-- Foreground shadow along bottom -->
<path d="M0,390 Q200,382 400,388 Q600,394 800,386 L800,400 L0,400 Z" fill="#040608" opacity="0.7"/>
      </svg>
    </div>
  `;
  demos.appendChild(a7garrison);

  // === 8. Voltri — Overlook into the Village ===
  const a8combined = document.createElement('div');
  a8combined.className = 'art-demo';
  a8combined.innerHTML = `
    <h3 class="meter-demo-label">8. Voltri — Overlook into the Village (Sunrise)</h3>
    <p style="color:var(--text-dim);font-size:12px;margin:4px 0 0;">Dawn breaking over Voltri. Village buildings below with lit windows, golden sunrise over the Ligurian Sea, dying campfire embers.</p>
    <div class="art-demo-frame">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" class="camp-art-svg">
<defs>
    <!-- SKY GRADIENT: deep navy upper-left to golden sunrise lower-right -->
    <linearGradient id="vtC_sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0e1228"/>
      <stop offset="25%" stop-color="#1a2248"/>
      <stop offset="45%" stop-color="#3a2855"/>
      <stop offset="65%" stop-color="#6a3840"/>
      <stop offset="82%" stop-color="#b85a3a"/>
      <stop offset="100%" stop-color="#e8a050"/>
    </linearGradient>

    <!-- HORIZON GLOW: warm golden band -->
    <linearGradient id="vtC_horizonGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8a4535" stop-opacity="0.6"/>
      <stop offset="30%" stop-color="#d4783a" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="#f0b050" stop-opacity="1"/>
      <stop offset="80%" stop-color="#e89040" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#c06838" stop-opacity="0.5"/>
    </linearGradient>

    <!-- SEA BASE -->
    <linearGradient id="vtC_sea" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stop-color="#1a2040"/>
      <stop offset="35%" stop-color="#2a3050"/>
      <stop offset="55%" stop-color="#3a3848"/>
      <stop offset="75%" stop-color="#5a4838"/>
      <stop offset="100%" stop-color="#8a6030"/>
    </linearGradient>

    <!-- SEA REFLECTION: golden sunrise path on water -->
    <radialGradient id="vtC_seaReflection" cx="0.65" cy="0.1" r="0.5" fx="0.65" fy="0.1">
      <stop offset="0%" stop-color="#f0b858" stop-opacity="0.6"/>
      <stop offset="40%" stop-color="#c08030" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#3a3848" stop-opacity="0"/>
    </radialGradient>

    <!-- SUNRISE RADIAL GLOW from right horizon -->
    <radialGradient id="vtC_sunriseGlow" cx="0.78" cy="0.4" r="0.55" fx="0.78" fy="0.4">
      <stop offset="0%" stop-color="#f0c060" stop-opacity="0.35"/>
      <stop offset="30%" stop-color="#d08040" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="#804030" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#0e1228" stop-opacity="0"/>
    </radialGradient>

    <!-- HEADLAND GRADIENTS -->
    <linearGradient id="vtC_headland1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1828"/>
      <stop offset="100%" stop-color="#141420"/>
    </linearGradient>
    <linearGradient id="vtC_headland2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1c30"/>
      <stop offset="100%" stop-color="#141420"/>
    </linearGradient>

    <!-- ROOF TERRACOTTA -->
    <linearGradient id="vtC_roof" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4a2828"/>
      <stop offset="100%" stop-color="#6a3830"/>
    </linearGradient>

    <!-- ROOF TERRACOTTA - SUNRISE CATCHING -->
    <linearGradient id="vtC_roofLit" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5a3030"/>
      <stop offset="100%" stop-color="#8a5038"/>
    </linearGradient>

    <!-- FOREGROUND GROUND -->
    <linearGradient id="vtC_ground" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0e1018"/>
      <stop offset="60%" stop-color="#1a1820"/>
      <stop offset="100%" stop-color="#2a2420"/>
    </linearGradient>

    <!-- SLOPE -->
    <linearGradient id="vtC_slope" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stop-color="#1a1820"/>
      <stop offset="100%" stop-color="#2a2425"/>
    </linearGradient>

    <!-- EMBER GLOW -->
    <radialGradient id="vtC_emberGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#e07828" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="#a04818" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#401808" stop-opacity="0"/>
    </radialGradient>

    <!-- EMBER CORE -->
    <radialGradient id="vtC_emberCore" cx="0.5" cy="0.6" r="0.45">
      <stop offset="0%" stop-color="#f0a040"/>
      <stop offset="50%" stop-color="#d06020"/>
      <stop offset="100%" stop-color="#601808"/>
    </radialGradient>

    <!-- WINDOW GLOW -->
    <radialGradient id="vtC_windowGlow" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="#f0c878" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#f0c878" stop-opacity="0"/>
    </radialGradient>

    <!-- MORNING MIST -->
    <linearGradient id="vtC_mist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8890a0" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#8890a0" stop-opacity="0"/>
    </linearGradient>

    <!-- VIGNETTE -->
    <radialGradient id="vtC_vignette" cx="0.65" cy="0.45" r="0.7">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
    </radialGradient>

    <!-- TREE FOLIAGE -->
    <radialGradient id="vtC_foliage" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="#1a2818"/>
      <stop offset="100%" stop-color="#0e1a10"/>
    </radialGradient>

    <!-- TREE FOLIAGE - SUNRISE EDGE -->
    <radialGradient id="vtC_foliageLit" cx="0.8" cy="0.4" r="0.5">
      <stop offset="0%" stop-color="#3a4828"/>
      <stop offset="60%" stop-color="#2a3820"/>
      <stop offset="100%" stop-color="#1a2818"/>
    </radialGradient>

    <!-- HIGH CLOUD -->
    <linearGradient id="vtC_cloud" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c08060" stop-opacity="0"/>
      <stop offset="30%" stop-color="#d09060" stop-opacity="0.15"/>
      <stop offset="70%" stop-color="#e0a070" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#c08060" stop-opacity="0"/>
    </linearGradient>

    <!-- GROUND MIST -->
    <linearGradient id="vtC_groundMist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a0a8b8" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#a0a8b8" stop-opacity="0"/>
    </linearGradient>

    <!-- Filter for soft glow -->
    <filter id="vtC_softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
    </filter>
    <filter id="vtC_gentleBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
    </filter>
  </defs>

  <!-- ========================================= -->
  <!-- LAYER 1: SKY                              -->
  <!-- ========================================= -->
  <rect x="0" y="0" width="800" height="170" fill="url(#vtC_sky)"/>

  <!-- Fading stars - upper-left quadrant only -->
  <circle cx="45" cy="22" r="1" fill="#c8c8d0" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.2;0.35" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="38" r="0.8" fill="#c0c0d0" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.12;0.25" dur="5.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="78" cy="65" r="0.7" fill="#b8b8c8" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="200" cy="18" r="0.9" fill="#c8c8d8" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.15;0.3" dur="4.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="160" cy="55" r="0.6" fill="#b0b0c0" opacity="0.18">
    <animate attributeName="opacity" values="0.18;0.06;0.18" dur="7s" repeatCount="indefinite"/>
  </circle>

  <!-- High clouds catching pink/gold light -->
  <ellipse cx="500" cy="60" rx="120" ry="3" fill="url(#vtC_cloud)" opacity="0.5"/>
  <ellipse cx="580" cy="75" rx="90" ry="2.5" fill="url(#vtC_cloud)" opacity="0.4"/>
  <ellipse cx="650" cy="50" rx="70" ry="2" fill="url(#vtC_cloud)" opacity="0.35"/>
  <ellipse cx="420" cy="85" rx="100" ry="2" fill="url(#vtC_cloud)" opacity="0.3"/>
  <ellipse cx="700" cy="90" rx="60" ry="2.5" fill="url(#vtC_cloud)" opacity="0.45"/>
  <ellipse cx="550" cy="100" rx="80" ry="1.8" fill="url(#vtC_cloud)" opacity="0.25"/>

  <!-- ========================================= -->
  <!-- LAYER 2: HORIZON GLOW                     -->
  <!-- ========================================= -->
  <rect x="0" y="150" width="800" height="25" fill="url(#vtC_horizonGlow)" opacity="0.9"/>

  <!-- Bright sun glow at horizon (right of center) -->
  <ellipse cx="620" cy="162" rx="80" ry="14" fill="#f0c060" opacity="0.25" filter="url(#vtC_softGlow)">
    <animate attributeName="opacity" values="0.25;0.3;0.25" dur="3s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="620" cy="162" rx="40" ry="8" fill="#f8d878" opacity="0.4" filter="url(#vtC_softGlow)">
    <animate attributeName="opacity" values="0.4;0.5;0.4" dur="2.5s" repeatCount="indefinite"/>
  </ellipse>
  <!-- Sun disc peeking above horizon -->
  <circle cx="620" cy="164" r="6" fill="#f8e0a0" opacity="0.7" filter="url(#vtC_gentleBlur)">
    <animate attributeName="opacity" values="0.7;0.85;0.7" dur="3.5s" repeatCount="indefinite"/>
  </circle>

  <!-- ========================================= -->
  <!-- LAYER 3: SEA                              -->
  <!-- ========================================= -->
  <rect x="0" y="168" width="800" height="45" fill="url(#vtC_sea)"/>
  <!-- Golden reflection path on water -->
  <rect x="0" y="168" width="800" height="45" fill="url(#vtC_seaReflection)"/>

  <!-- Wave lines -->
  <path d="M0,178 Q100,176 200,178 Q300,180 400,178 Q500,176 600,177 Q700,179 800,177" stroke="#5a5848" stroke-width="0.4" fill="none" opacity="0.3"/>
  <path d="M0,185 Q150,183 300,185 Q450,187 600,184 Q700,186 800,185" stroke="#4a4838" stroke-width="0.3" fill="none" opacity="0.25"/>
  <path d="M0,192 Q120,190 250,192 Q380,194 500,191 Q650,193 800,192" stroke="#3a3830" stroke-width="0.3" fill="none" opacity="0.2"/>
  <path d="M0,200 Q200,198 400,200 Q600,202 800,199" stroke="#2a2828" stroke-width="0.25" fill="none" opacity="0.15"/>

  <!-- Shimmer ellipses on water -->
  <ellipse cx="600" cy="174" rx="12" ry="1.2" fill="#f0c060" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="12;14;12" dur="2s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="630" cy="180" rx="8" ry="0.8" fill="#e0a850" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="8;10;8" dur="2.5s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="580" cy="178" rx="15" ry="1" fill="#d8a048" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="650" cy="186" rx="10" ry="0.7" fill="#c09040" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="560" cy="184" rx="18" ry="1.1" fill="#d09848" opacity="0.12">
    <animate attributeName="opacity" values="0.12;0.04;0.12" dur="3.5s" repeatCount="indefinite"/>
  </ellipse>

  <!-- ========================================= -->
  <!-- LAYER 4: DISTANT HEADLANDS                -->
  <!-- ========================================= -->
  <path d="M0,210 Q30,195 80,192 Q120,190 160,195 Q200,200 240,205 L240,215 L0,215 Z" fill="url(#vtC_headland1)" opacity="0.9"/>
  <path d="M560,210 Q600,196 640,193 Q680,190 720,192 Q760,195 800,200 L800,215 L560,215 Z" fill="url(#vtC_headland2)" opacity="0.95"/>
  <!-- Warm edge-light on right headland -->
  <path d="M700,193 Q730,192 760,195 Q780,197 800,200 L800,198 Q770,194 740,192 Q720,191 700,193 Z" fill="#4a3028" opacity="0.4"/>

  <!-- ========================================= -->
  <!-- LAYER 5: TOWN OF VOLTRI                   -->
  <!-- ========================================= -->

  <!-- Town base / ground plane -->
  <rect x="120" y="280" width="520" height="30" fill="#1a1820" opacity="0.8"/>
  <!-- Morning mist at base of buildings -->
  <rect x="100" y="295" width="560" height="18" fill="url(#vtC_mist)" opacity="0.8"/>

  <!-- === BUILDING CLUSTER 1 (far left) === -->
  <!-- Building 1A: tall narrow house -->
  <rect x="140" y="240" width="28" height="60" fill="#3a3540"/>
  <rect x="160" y="240" width="8" height="60" fill="#4a4248" opacity="0.5"/>
  <polygon points="136,240 154,228 172,240" fill="url(#vtC_roof)"/>
  <polygon points="154,228 172,240 168,240" fill="url(#vtC_roofLit)" opacity="0.6"/>
  <rect x="147" y="250" width="5" height="6" fill="#1a1420"/>
  <rect x="147" y="262" width="5" height="6" fill="#1a1420"/>
  <rect x="158" y="250" width="5" height="6" fill="#e8b848" opacity="0.7">
    <animate attributeName="opacity" values="0.7;0.55;0.7" dur="3s" repeatCount="indefinite"/>
  </rect>
  <circle cx="160" cy="253" r="6" fill="url(#vtC_windowGlow)" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.25;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>
  <rect x="158" y="262" width="5" height="6" fill="#1a1420"/>

  <!-- Building 1B: shorter wide house -->
  <rect x="170" y="258" width="35" height="42" fill="#3e3840"/>
  <rect x="195" y="258" width="10" height="42" fill="#4e4540" opacity="0.4"/>
  <polygon points="167,258 187,246 210,258" fill="url(#vtC_roof)"/>
  <polygon points="187,246 210,258 205,258" fill="url(#vtC_roofLit)" opacity="0.5"/>
  <rect x="177" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="186" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="177" y="280" width="5" height="6" fill="#1a1420"/>
  <rect x="186" y="280" width="5" height="6" fill="#e0b040" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="4s" repeatCount="indefinite"/>
  </rect>
  <circle cx="189" cy="283" r="5" fill="url(#vtC_windowGlow)" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.18;0.3" dur="4s" repeatCount="indefinite"/>
  </circle>

  <!-- Dark alley 1 -->
  <rect x="206" y="255" width="6" height="45" fill="#0a0a12" opacity="0.8"/>

  <!-- === BUILDING CLUSTER 2 (center-left) === -->
  <rect x="212" y="250" width="30" height="50" fill="#38343e"/>
  <rect x="234" y="250" width="8" height="50" fill="#484040" opacity="0.4"/>
  <polygon points="209,250 227,237 245,250" fill="url(#vtC_roof)"/>
  <polygon points="227,237 245,250 240,250" fill="url(#vtC_roofLit)" opacity="0.5"/>
  <rect x="218" y="258" width="5" height="6" fill="#1a1420"/>
  <rect x="228" y="258" width="5" height="6" fill="#1a1420"/>
  <rect x="218" y="270" width="5" height="6" fill="#1a1420"/>
  <rect x="228" y="270" width="5" height="6" fill="#1a1420"/>
  <rect x="222" y="285" width="8" height="15" fill="#1e1820" rx="1"/>

  <!-- Building 2B: tall narrow -->
  <rect x="244" y="242" width="24" height="58" fill="#3c3640"/>
  <rect x="260" y="242" width="8" height="58" fill="#4c4440" opacity="0.4"/>
  <polygon points="241,242 256,230 271,242" fill="url(#vtC_roofLit)"/>
  <rect x="250" y="252" width="4" height="5" fill="#d8a840" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.4;0.6" dur="3.5s" repeatCount="indefinite"/>
  </rect>
  <circle cx="252" cy="254" r="5" fill="url(#vtC_windowGlow)" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.2;0.35" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <rect x="250" y="264" width="4" height="5" fill="#1a1420"/>
  <rect x="250" y="276" width="4" height="5" fill="#1a1420"/>

  <!-- Dark alley 2 -->
  <rect x="269" y="248" width="5" height="52" fill="#08080e" opacity="0.85"/>

  <!-- === BELL TOWER / CHURCH === -->
  <rect x="274" y="248" width="45" height="52" fill="#3a3540"/>
  <rect x="308" y="248" width="11" height="52" fill="#4a4240" opacity="0.45"/>
  <polygon points="271,248 296,234 322,248" fill="url(#vtC_roof)"/>
  <polygon points="296,234 322,248 316,248" fill="url(#vtC_roofLit)" opacity="0.6"/>

  <!-- Bell tower -->
  <rect x="288" y="215" width="16" height="33" fill="#353040"/>
  <rect x="298" y="215" width="6" height="33" fill="#454040" opacity="0.5"/>
  <polygon points="286,215 296,200 306,215" fill="#3a2828"/>
  <polygon points="296,200 306,215 302,215" fill="#5a3830" opacity="0.5"/>
  <!-- Cross -->
  <line x1="296" y1="194" x2="296" y2="200" stroke="#2a2430" stroke-width="1.2"/>
  <line x1="293" y1="196" x2="299" y2="196" stroke="#2a2430" stroke-width="1"/>
  <!-- Cross warm edge-light -->
  <line x1="297" y1="194" x2="297" y2="200" stroke="#5a4838" stroke-width="0.5" opacity="0.5"/>
  <line x1="296" y1="196" x2="299" y2="196" stroke="#5a4838" stroke-width="0.4" opacity="0.5"/>
  <!-- Bell opening -->
  <rect x="292" y="222" width="8" height="10" fill="#0e0e18" rx="4" ry="4"/>
  <rect x="293" y="236" width="6" height="7" fill="#0e0e18"/>
  <!-- Church windows -->
  <rect x="282" y="260" width="6" height="10" fill="#1a1420" rx="0" ry="3"/>
  <rect x="292" y="260" width="6" height="10" fill="#1a1420" rx="0" ry="3"/>
  <rect x="302" y="260" width="6" height="10" fill="#1a1420" rx="0" ry="3"/>
  <rect x="290" y="282" width="12" height="18" fill="#141018" rx="6" ry="6"/>

  <!-- Dark alley 3 -->
  <rect x="320" y="252" width="6" height="48" fill="#0a0a12" opacity="0.8"/>

  <!-- === BUILDING CLUSTER 3 (center-right) === -->
  <rect x="326" y="255" width="32" height="45" fill="#3b3540"/>
  <rect x="350" y="255" width="8" height="45" fill="#4b4340" opacity="0.4"/>
  <polygon points="323,255 342,243 361,255" fill="url(#vtC_roof)"/>
  <polygon points="342,243 361,255 356,255" fill="url(#vtC_roofLit)" opacity="0.55"/>
  <rect x="332" y="264" width="5" height="6" fill="#1a1420"/>
  <rect x="342" y="264" width="5" height="6" fill="#1a1420"/>
  <rect x="332" y="276" width="5" height="6" fill="#1a1420"/>
  <rect x="342" y="276" width="5" height="6" fill="#e0b040" opacity="0.55">
    <animate attributeName="opacity" values="0.55;0.38;0.55" dur="4.2s" repeatCount="indefinite"/>
  </rect>
  <circle cx="345" cy="279" r="5" fill="url(#vtC_windowGlow)" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.18;0.3" dur="4.2s" repeatCount="indefinite"/>
  </circle>

  <!-- Building 3B: tall -->
  <rect x="360" y="243" width="26" height="57" fill="#3e3842"/>
  <rect x="378" y="243" width="8" height="57" fill="#4e4842" opacity="0.45"/>
  <polygon points="357,243 373,232 389,243" fill="url(#vtC_roofLit)"/>
  <rect x="367" y="252" width="4" height="5" fill="#1a1420"/>
  <rect x="367" y="264" width="4" height="5" fill="#1a1420"/>
  <rect x="367" y="276" width="4" height="5" fill="#1a1420"/>
  <rect x="376" y="252" width="4" height="5" fill="#1a1420"/>
  <rect x="376" y="264" width="4" height="5" fill="#d0a040" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.32;0.5" dur="5s" repeatCount="indefinite"/>
  </rect>
  <circle cx="378" cy="266" r="4.5" fill="url(#vtC_windowGlow)" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.12;0.25" dur="5s" repeatCount="indefinite"/>
  </circle>
  <rect x="376" y="276" width="4" height="5" fill="#1a1420"/>

  <!-- Building 3C: short wide -->
  <rect x="388" y="268" width="38" height="32" fill="#3a3440"/>
  <rect x="416" y="268" width="10" height="32" fill="#4a4240" opacity="0.4"/>
  <polygon points="385,268 407,258 429,268" fill="url(#vtC_roof)"/>
  <polygon points="407,258 429,268 424,268" fill="url(#vtC_roofLit)" opacity="0.5"/>
  <rect x="395" y="276" width="5" height="5" fill="#1a1420"/>
  <rect x="405" y="276" width="5" height="5" fill="#1a1420"/>
  <rect x="415" y="276" width="5" height="5" fill="#1a1420"/>
  <rect x="393" y="276" width="2" height="5" fill="#2a2430"/>
  <rect x="412" y="276" width="2" height="5" fill="#2a2430"/>
  <rect x="403" y="288" width="7" height="12" fill="#181420" rx="1"/>

  <!-- === BUILDING CLUSTER 4 (right side) === -->
  <rect x="427" y="260" width="5" height="40" fill="#08080e" opacity="0.75"/>

  <rect x="432" y="252" width="30" height="48" fill="#3c3640"/>
  <rect x="454" y="252" width="8" height="48" fill="#504840" opacity="0.45"/>
  <polygon points="429,252 447,240 465,252" fill="url(#vtC_roof)"/>
  <polygon points="447,240 465,252 460,252" fill="url(#vtC_roofLit)" opacity="0.6"/>
  <rect x="438" y="260" width="5" height="6" fill="#1a1420"/>
  <rect x="448" y="260" width="5" height="6" fill="#1a1420"/>
  <rect x="438" y="272" width="5" height="6" fill="#1a1420"/>
  <rect x="448" y="272" width="5" height="6" fill="#d8a840" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="3.8s" repeatCount="indefinite"/>
  </rect>
  <circle cx="450" cy="275" r="5" fill="url(#vtC_windowGlow)" opacity="0.28">
    <animate attributeName="opacity" values="0.28;0.15;0.28" dur="3.8s" repeatCount="indefinite"/>
  </circle>

  <!-- Building 4B -->
  <rect x="464" y="262" width="28" height="38" fill="#3a3540"/>
  <rect x="484" y="262" width="8" height="38" fill="#4e4640" opacity="0.45"/>
  <polygon points="461,262 478,252 495,262" fill="url(#vtC_roofLit)"/>
  <rect x="470" y="270" width="4" height="5" fill="#1a1420"/>
  <rect x="480" y="270" width="4" height="5" fill="#1a1420"/>
  <rect x="470" y="282" width="4" height="5" fill="#1a1420"/>
  <rect x="480" y="282" width="4" height="5" fill="#1a1420"/>

  <!-- Building 4C: waterfront tall -->
  <rect x="496" y="248" width="32" height="52" fill="#3e3842"/>
  <rect x="518" y="248" width="10" height="52" fill="#504a42" opacity="0.5"/>
  <polygon points="493,248 512,236 534,248" fill="url(#vtC_roof)"/>
  <polygon points="512,236 534,248 528,248" fill="url(#vtC_roofLit)" opacity="0.55"/>
  <rect x="502" y="256" width="5" height="6" fill="#1a1420"/>
  <rect x="512" y="256" width="5" height="6" fill="#1a1420"/>
  <rect x="502" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="512" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="502" y="280" width="5" height="6" fill="#1a1420"/>
  <rect x="512" y="280" width="5" height="6" fill="#1a1420"/>
  <rect x="506" y="286" width="8" height="14" fill="#141018" rx="1"/>

  <!-- === SCATTERED BUILDINGS (edges) === -->
  <rect x="110" y="270" width="26" height="30" fill="#343040"/>
  <polygon points="107,270 123,260 139,270" fill="url(#vtC_roof)"/>
  <rect x="117" y="278" width="4" height="5" fill="#1a1420"/>
  <rect x="125" y="278" width="4" height="5" fill="#1a1420"/>

  <rect x="535" y="266" width="24" height="34" fill="#3c3840"/>
  <rect x="551" y="266" width="8" height="34" fill="#4c4640" opacity="0.4"/>
  <polygon points="532,266 547,256 562,266" fill="url(#vtC_roofLit)"/>
  <rect x="540" y="274" width="4" height="5" fill="#1a1420"/>
  <rect x="550" y="274" width="4" height="5" fill="#1a1420"/>

  <rect x="560" y="278" width="18" height="22" fill="#343040"/>
  <polygon points="558,278 569,270 580,278" fill="#3a2828"/>

  <!-- ========================================= -->
  <!-- LAYER 6: TRANSITIONAL SLOPE               -->
  <!-- ========================================= -->
  <path d="M0,300 Q100,295 200,298 Q350,290 500,295 Q650,292 800,298 L800,335 Q650,328 500,332 Q350,325 200,330 Q100,328 0,332 Z" fill="url(#vtC_slope)"/>

  <!-- Stone retaining wall -->
  <path d="M80,305 L180,300 L280,303 L380,298 L480,301 L580,297 L650,302" stroke="#2a2630" stroke-width="3" fill="none" opacity="0.6"/>
  <path d="M80,308 L180,303 L280,306 L380,301 L480,304 L580,300 L650,305" stroke="#222030" stroke-width="2" fill="none" opacity="0.4"/>
  <!-- Stone texture -->
  <line x1="130" y1="300" x2="130" y2="306" stroke="#1e1a28" stroke-width="0.8" opacity="0.5"/>
  <line x1="180" y1="300" x2="180" y2="305" stroke="#1e1a28" stroke-width="0.8" opacity="0.5"/>
  <line x1="230" y1="302" x2="230" y2="307" stroke="#1e1a28" stroke-width="0.8" opacity="0.5"/>
  <line x1="330" y1="299" x2="330" y2="304" stroke="#1e1a28" stroke-width="0.8" opacity="0.5"/>
  <line x1="430" y1="300" x2="430" y2="305" stroke="#1e1a28" stroke-width="0.8" opacity="0.5"/>
  <line x1="530" y1="298" x2="530" y2="303" stroke="#1e1a28" stroke-width="0.8" opacity="0.5"/>

  <!-- Mediterranean scrub -->
  <ellipse cx="100" cy="310" rx="12" ry="5" fill="#1a2218" opacity="0.6"/>
  <ellipse cx="250" cy="305" rx="10" ry="4" fill="#182018" opacity="0.5"/>
  <ellipse cx="400" cy="308" rx="14" ry="5" fill="#1a2218" opacity="0.55"/>
  <ellipse cx="550" cy="303" rx="11" ry="4" fill="#202818" opacity="0.5"/>
  <ellipse cx="700" cy="306" rx="8" ry="3" fill="#1a2218" opacity="0.45"/>

  <!-- Morning dew highlights -->
  <circle cx="95" cy="308" r="0.5" fill="#c0c8d0" opacity="0.15"/>
  <circle cx="108" cy="309" r="0.4" fill="#c0c8d0" opacity="0.12"/>
  <circle cx="248" cy="303" r="0.5" fill="#c0c8d0" opacity="0.12"/>
  <circle cx="398" cy="306" r="0.5" fill="#c0c8d0" opacity="0.15"/>
  <circle cx="547" cy="301" r="0.4" fill="#c0c8d0" opacity="0.12"/>

  <!-- ========================================= -->
  <!-- LAYER 7: FOREGROUND HILLSIDE              -->
  <!-- ========================================= -->
  <path d="M0,325 Q80,320 160,328 Q300,318 400,322 Q500,316 600,320 Q700,315 800,322 L800,400 L0,400 Z" fill="url(#vtC_ground)"/>
  <!-- Warm sunrise light on right side -->
  <path d="M500,318 Q600,315 700,318 Q750,316 800,320 L800,400 L500,400 Z" fill="#2a2420" opacity="0.3"/>

  <!-- Path suggestion leading down -->
  <path d="M350,325 Q340,335 345,350 Q350,365 360,380 Q365,390 370,400" stroke="#2a2630" stroke-width="4" fill="none" opacity="0.25"/>
  <path d="M350,325 Q340,335 345,350 Q350,365 360,380 Q365,390 370,400" stroke="#222030" stroke-width="2" fill="none" opacity="0.15"/>

  <!-- Rocky outcrops -->
  <path d="M50,355 Q55,345 65,348 Q72,340 80,345 Q85,350 80,358 Q70,362 55,360 Z" fill="#2a2630" opacity="0.7"/>
  <path d="M52,356 Q58,348 68,350 Q74,344 78,348" stroke="#353040" stroke-width="0.5" fill="none" opacity="0.4"/>
  <path d="M480,340 Q485,332 495,335 Q502,330 510,334 Q514,340 508,345 Q498,348 485,346 Z" fill="#2a2630" opacity="0.65"/>
  <path d="M520,355 Q525,348 530,350 Q535,346 540,350 Q542,356 535,358 Q528,360 522,358 Z" fill="#282430" opacity="0.6"/>
  <path d="M730,338 Q738,328 750,332 Q758,326 766,330 Q772,338 764,344 Q750,348 735,344 Z" fill="#302828" opacity="0.6"/>

  <!-- Wild herbs and grasses -->
  <path d="M30,365 Q32,355 34,365" stroke="#1e2a18" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M32,365 Q35,352 38,365" stroke="#1a2618" stroke-width="0.8" fill="none" opacity="0.45"/>
  <path d="M34,365 Q37,356 40,365" stroke="#1e2a18" stroke-width="0.7" fill="none" opacity="0.4"/>
  <path d="M150,345 Q152,335 154,345" stroke="#1e2a18" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M152,345 Q155,332 158,345" stroke="#1a2618" stroke-width="0.8" fill="none" opacity="0.45"/>
  <path d="M440,335 Q442,325 444,335" stroke="#1e2a18" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M442,335 Q445,323 448,335" stroke="#1a2618" stroke-width="0.8" fill="none" opacity="0.45"/>
  <path d="M600,330 Q602,320 604,330" stroke="#222e1a" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M602,330 Q605,318 608,330" stroke="#1e2a18" stroke-width="0.8" fill="none" opacity="0.45"/>
  <path d="M760,340 Q762,330 764,340" stroke="#242e1c" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M762,340 Q764,328 766,340" stroke="#202a1a" stroke-width="0.8" fill="none" opacity="0.45"/>

  <!-- Herb clusters -->
  <ellipse cx="100" cy="370" rx="8" ry="4" fill="#1a2418" opacity="0.4"/>
  <ellipse cx="310" cy="350" rx="6" ry="3" fill="#182218" opacity="0.35"/>
  <ellipse cx="620" cy="345" rx="7" ry="3" fill="#1e2818" opacity="0.4"/>

  <!-- === OLIVE TREE 1 (left, shadowed) === -->
  <path d="M180,380 Q178,360 175,350 Q172,340 170,332 Q168,326 172,322" stroke="#2a2420" stroke-width="4" fill="none"/>
  <path d="M175,350 Q180,344 185,340" stroke="#2a2420" stroke-width="2.5" fill="none"/>
  <path d="M172,342 Q168,336 164,332" stroke="#2a2420" stroke-width="2" fill="none"/>
  <path d="M178,370 Q176,365 177,360" stroke="#342e28" stroke-width="1" fill="none" opacity="0.4"/>
  <path d="M176,355 Q174,350 175,345" stroke="#342e28" stroke-width="0.8" fill="none" opacity="0.3"/>
  <ellipse cx="170" cy="318" rx="18" ry="12" fill="url(#vtC_foliage)"/>
  <ellipse cx="158" cy="326" rx="14" ry="10" fill="url(#vtC_foliage)"/>
  <ellipse cx="182" cy="325" rx="12" ry="9" fill="url(#vtC_foliage)"/>
  <ellipse cx="186" cy="335" rx="10" ry="7" fill="#0e1a10" opacity="0.7"/>
  <ellipse cx="162" cy="316" rx="10" ry="7" fill="#121e12" opacity="0.6"/>

  <!-- === OLIVE TREE 2 (right, catching sunrise edge-light) === -->
  <path d="M620,385 Q618,365 615,355 Q612,345 610,335 Q608,328 612,324" stroke="#2a2420" stroke-width="4.5" fill="none"/>
  <path d="M615,355 Q620,347 626,342" stroke="#2a2420" stroke-width="2.5" fill="none"/>
  <path d="M612,345 Q607,338 604,332" stroke="#2a2420" stroke-width="2.5" fill="none"/>
  <path d="M610,338 Q614,332 618,328" stroke="#2a2420" stroke-width="2" fill="none"/>
  <!-- Warm edge-light on right side of trunk -->
  <path d="M620,385 Q618,365 615,355 Q612,345 610,335" stroke="#3a3028" stroke-width="1" fill="none" opacity="0.35"/>
  <path d="M618,375 Q616,368 617,362" stroke="#342e28" stroke-width="1" fill="none" opacity="0.4"/>
  <ellipse cx="610" cy="318" rx="20" ry="14" fill="url(#vtC_foliage)"/>
  <ellipse cx="596" cy="326" rx="16" ry="11" fill="url(#vtC_foliage)"/>
  <ellipse cx="624" cy="324" rx="14" ry="10" fill="url(#vtC_foliageLit)"/>
  <ellipse cx="630" cy="336" rx="12" ry="8" fill="url(#vtC_foliageLit)" opacity="0.8"/>
  <ellipse cx="600" cy="316" rx="12" ry="8" fill="#121e12" opacity="0.6"/>
  <ellipse cx="632" cy="320" rx="8" ry="5" fill="#2a3820" opacity="0.5"/>

  <!-- ========================================= -->
  <!-- LAYER 8: CAMPFIRE (dying embers)          -->
  <!-- ========================================= -->
  <!-- Ground glow (dim) -->
  <ellipse cx="680" cy="350" rx="35" ry="12" fill="url(#vtC_emberGlow)" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="3s" repeatCount="indefinite"/>
  </ellipse>

  <!-- Stone ring -->
  <ellipse cx="680" cy="350" rx="18" ry="7" fill="none" stroke="#3a3438" stroke-width="3"/>
  <circle cx="664" cy="349" r="3" fill="#3a3438"/>
  <circle cx="670" cy="344" r="2.8" fill="#383238"/>
  <circle cx="678" cy="343" r="3" fill="#3c3640"/>
  <circle cx="686" cy="344" r="2.5" fill="#383238"/>
  <circle cx="692" cy="347" r="3" fill="#3a3438"/>
  <circle cx="695" cy="352" r="2.8" fill="#383238"/>
  <circle cx="690" cy="356" r="2.5" fill="#3a3438"/>
  <circle cx="682" cy="357" r="3" fill="#3c3640"/>
  <circle cx="674" cy="357" r="2.8" fill="#383238"/>
  <circle cx="666" cy="354" r="2.5" fill="#3a3438"/>

  <!-- Charred logs -->
  <line x1="670" y1="352" x2="690" y2="347" stroke="#1a1410" stroke-width="3" stroke-linecap="round"/>
  <line x1="675" y1="346" x2="688" y2="354" stroke="#1a1410" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="672" y1="349" x2="685" y2="349" stroke="#181210" stroke-width="2" stroke-linecap="round"/>

  <!-- Ember glow -->
  <ellipse cx="680" cy="349" rx="8" ry="3" fill="url(#vtC_emberCore)" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.35;0.55;0.4;0.6" dur="4s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="676" cy="348" r="1" fill="#e08030" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.2;0.45;0.15;0.5" dur="3.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="683" cy="350" r="0.8" fill="#d07028" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.15;0.35;0.1;0.4" dur="3.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="679" cy="347" r="1.2" fill="#e89040" opacity="0.45">
    <animate attributeName="opacity" values="0.45;0.2;0.4;0.15;0.45" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="685" cy="348" r="0.7" fill="#c06020" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.1;0.3;0.1;0.35" dur="4.5s" repeatCount="indefinite"/>
  </circle>

  <!-- Thin smoke wisp -->
  <path d="M680,344 Q678,334 681,322 Q684,310 679,298 Q676,286 680,274" stroke="#888888" stroke-width="1.5" fill="none" opacity="0.08" stroke-linecap="round">
    <animate attributeName="d" values="M680,344 Q678,334 681,322 Q684,310 679,298 Q676,286 680,274;M680,344 Q682,332 679,320 Q676,308 681,296 Q684,284 680,272;M680,344 Q678,334 681,322 Q684,310 679,298 Q676,286 680,274" dur="6s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.08;0.12;0.06;0.1;0.08" dur="5s" repeatCount="indefinite"/>
  </path>
  <path d="M680,340 Q677,328 682,316 Q685,304 680,292" stroke="#999999" stroke-width="0.8" fill="none" opacity="0.05" stroke-linecap="round">
    <animate attributeName="d" values="M680,340 Q677,328 682,316 Q685,304 680,292;M680,340 Q683,326 680,314 Q677,302 682,290;M680,340 Q677,328 682,316 Q685,304 680,292" dur="7s" repeatCount="indefinite"/>
  </path>

  <!-- ========================================= -->
  <!-- LAYER 9: ATMOSPHERIC OVERLAYS             -->
  <!-- ========================================= -->
  <!-- Sunrise atmospheric glow -->
  <rect x="0" y="0" width="800" height="400" fill="url(#vtC_sunriseGlow)"/>
  <!-- Ground-level morning mist bands -->
  <rect x="0" y="360" width="800" height="15" fill="url(#vtC_groundMist)" opacity="0.6"/>
  <rect x="0" y="370" width="800" height="12" fill="url(#vtC_groundMist)" opacity="0.4"/>
  <rect x="100" y="300" width="500" height="10" fill="url(#vtC_mist)" opacity="0.5"/>
  <!-- Edge vignette -->
  <rect x="0" y="0" width="800" height="400" fill="url(#vtC_vignette)"/>
  <!-- Warm tint lower-right -->
  <rect x="400" y="200" width="400" height="200" fill="#e8a050" opacity="0.03"/>
      </svg>
    </div>
  `;
  demos.appendChild(a8combined);


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
    configId: 'rivoli',
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
    } as import('../../types').RivoliExt,
    autoPlayActive: false,
    autoPlayVolleyCompleted: 4,
    graceEarned: false,
    pendingVirtueChange: 0,
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    playerRank: MilitaryRank.Private,
    rankState: {
      heldVolleyBonus: false,
      refuseFlankTurns: 0,
      holdCount: 0,
      fixedBayonetsEarly: false,
      requestSupportCooldown: 0,
      refuseFlankUsed: false,
      rangeModifier: 0,
    },
    formation: Formation.Line,
    formationChosen: false,
  };

  // Create battery melee with allies + waves
  state.meleeState = createMeleeState(state, MeleeContext.Battery, 'battery_skirmish');

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
      attributes: {},
      virtue: 0,
      sous: 0,
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
      sequenceIndex: 2,
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

const boundButtons = new WeakSet<HTMLElement>();

export function initTestScreen() {
  const btn = document.getElementById('btn-test-screen');
  const testScreen = document.getElementById('test-screen');
  if (!btn || !testScreen) return;
  if (boundButtons.has(btn)) return;
  boundButtons.add(btn);

  // Find whichever parent container hosts the button
  const parentContainer = btn.closest('.profile-container, .intro-container') as HTMLElement | null;

  // Art lab container (sibling of test screen)
  const artLab = document.createElement('div');
  artLab.className = 'art-lab';
  artLab.id = 'art-lab';
  artLab.style.display = 'none';
  artLab.innerHTML = `
    <div class="art-lab-header">
      <button class="intro-mute" id="btn-art-lab-back" title="Back to Test Screen">&larr;</button>
      <h1 class="test-title">Art Lab</h1>
    </div>
    <div class="art-lab-demos" id="art-lab-demos"></div>
  `;
  testScreen.parentElement!.appendChild(artLab);

  // Open test screen
  btn.addEventListener('click', () => {
    if (parentContainer) parentContainer.style.display = 'none';
    testScreen.style.display = 'flex';

    // Lazy-render modules on first open
    const modules = document.getElementById('test-modules');
    if (modules && modules.children.length === 0) {
      renderFatigueTierModule(modules);
      renderMeleeUIModule(modules);
      renderHitSoundModule(modules);
      renderMissSoundModule(modules);
      renderArtLabButton(modules);
      renderMeterStylesModule(modules);
      renderResolutionModule(modules);
      renderClickSoundModule(modules);

      // Art Lab button handler
      const artLabBtn = document.getElementById('btn-art-lab');
      if (artLabBtn) {
        artLabBtn.addEventListener('click', () => {
          testScreen.style.display = 'none';
          artLab.style.display = 'flex';
          const demosContainer = document.getElementById('art-lab-demos');
          if (demosContainer) renderArtLab(demosContainer);
        });
      }
    }
  });

  // Back from test screen
  const backBtn = document.getElementById('btn-test-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      testScreen.style.display = 'none';
      if (parentContainer) parentContainer.style.display = '';
    });
  }

  // Back from art lab
  const artLabBack = artLab.querySelector('#btn-art-lab-back');
  if (artLabBack) {
    artLabBack.addEventListener('click', () => {
      artLab.style.display = 'none';
      testScreen.style.display = 'flex';
    });
  }
}
