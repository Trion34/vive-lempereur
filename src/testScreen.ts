// ============================================================
// TEST SCREEN — Sandbox for auditioning sounds, effects, etc.
// ============================================================

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
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.08);
    }),
  },
  {
    name: 'Mechanical Click',
    desc: 'Short noise burst — like a physical button',
    play: () => playSynth(ac => {
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
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.06);
      gain.gain.setValueAtTime(0.5, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.1);
    }),
  },
  {
    name: 'Quill Scratch',
    desc: 'High chirp — like pen on parchment',
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.05);
    }),
  },
  {
    name: 'Metal Clink',
    desc: 'Bell-like ping — sharp, military',
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1800;
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.15);
    }),
  },
  {
    name: 'Musket Cock',
    desc: 'Two-part click — heavy, authoritative',
    play: () => playSynth(ac => {
      // First click
      const buf1 = ac.createBuffer(1, ac.sampleRate * 0.015, ac.sampleRate);
      const d1 = buf1.getChannelData(0);
      for (let i = 0; i < d1.length; i++) {
        d1[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d1.length, 6);
      }
      const src1 = ac.createBufferSource();
      const g1 = ac.createGain();
      src1.buffer = buf1; g1.gain.value = 0.3;
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
      src2.buffer = buf2; g2.gain.value = 0.45;
      src2.connect(g2).connect(ac.destination);
      src2.start(ac.currentTime + 0.06);
    }),
  },
  {
    name: 'Drum Tap',
    desc: 'Quick snare hit — military drum corps',
    play: () => playSynth(ac => {
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
      osc.start(); osc.stop(ac.currentTime + 0.08);
    }),
  },
  {
    name: 'Paper Fold',
    desc: 'Filtered noise swoosh — document/order feel',
    play: () => playSynth(ac => {
      const buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = Math.sin(Math.PI * i / data.length);
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
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.04);
      gain.gain.setValueAtTime(0.45, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.06);
    }),
  },
  {
    name: 'Brass Tick',
    desc: 'Tight metallic tick — compass or pocket watch',
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'square';
      osc.frequency.value = 3200;
      gain.gain.setValueAtTime(0.15, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.025);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.025);
    }),
  },
  {
    name: 'Flint Snap',
    desc: 'Sharp crack — like striking a flint',
    play: () => playSynth(ac => {
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
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.03);
      gain.gain.setValueAtTime(0.4, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.05);
    }),
  },
  {
    name: 'Sword Pommel',
    desc: 'Heavy thunk with ring — pommel striking a table',
    play: () => playSynth(ac => {
      // Thunk body
      const osc1 = ac.createOscillator();
      const g1 = ac.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(180, ac.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(50, ac.currentTime + 0.05);
      g1.gain.setValueAtTime(0.4, ac.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.07);
      osc1.connect(g1).connect(ac.destination);
      osc1.start(); osc1.stop(ac.currentTime + 0.07);
      // Metal ring
      const osc2 = ac.createOscillator();
      const g2 = ac.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 2200;
      g2.gain.setValueAtTime(0.08, ac.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
      osc2.connect(g2).connect(ac.destination);
      osc2.start(); osc2.stop(ac.currentTime + 0.2);
    }),
  },
  {
    name: 'Wax Seal',
    desc: 'Soft press with tonal warmth — satisfying and muted',
    play: () => playSynth(ac => {
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
      osc.start(); osc.stop(ac.currentTime + 0.1);
    }),
  },
  {
    name: 'Buckle Clasp',
    desc: 'Two-tone snap — crisp and decisive',
    play: () => playSynth(ac => {
      // High tick
      const osc1 = ac.createOscillator();
      const g1 = ac.createGain();
      osc1.type = 'square';
      osc1.frequency.value = 2800;
      g1.gain.setValueAtTime(0.12, ac.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.015);
      osc1.connect(g1).connect(ac.destination);
      osc1.start(); osc1.stop(ac.currentTime + 0.015);
      // Low latch
      const osc2 = ac.createOscillator();
      const g2 = ac.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = 500;
      g2.gain.setValueAtTime(0.3, ac.currentTime + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
      osc2.connect(g2).connect(ac.destination);
      osc2.start(); osc2.stop(ac.currentTime + 0.06);
    }),
  },
  {
    name: 'Cartridge Snap',
    desc: 'Quick bite — biting open a paper cartridge',
    play: () => playSynth(ac => {
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
    play: () => playSynth(ac => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.03);
      gain.gain.setValueAtTime(0.5, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.connect(gain).connect(ac.destination);
      osc.start(); osc.stop(ac.currentTime + 0.08);
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
    play: () => playSynth(ac => {
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
        osc.start(t + delay); osc.stop(t + delay + 0.06);
      });
    }),
  },
  {
    name: 'Muffled Knock',
    desc: 'Deep filtered tap — knocking on a heavy door',
    play: () => playSynth(ac => {
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
      osc.start(); osc.stop(ac.currentTime + 0.12);
    }),
  },
  {
    name: 'Spur Jingle',
    desc: 'Light metallic shimmer — cavalry spur rattle',
    play: () => playSynth(ac => {
      const t = ac.currentTime;
      [4200, 5100, 3800].forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.07, t + i * 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.012 + 0.12);
        osc.connect(gain).connect(ac.destination);
        osc.start(t + i * 0.012); osc.stop(t + i * 0.012 + 0.12);
      });
    }),
  },
  {
    name: 'Tight Snap',
    desc: 'Ultra-short noise pop — minimal and precise',
    play: () => playSynth(ac => {
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
    play: () => playSynth(ac => {
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
      osc.start(); osc.stop(ac.currentTime + 0.09);
    }),
  },
  {
    name: 'Map Thump',
    desc: 'Soft authoritative pat — hand on a campaign map',
    play: () => playSynth(ac => {
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
      renderClickSoundModule(modules);
    }
  });

  // Back to intro
  $('btn-test-back').addEventListener('click', () => {
    testScreen.style.display = 'none';
    introContainer.style.display = '';
  });
}
