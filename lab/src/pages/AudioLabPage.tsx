import React, { useState, useRef, useCallback, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Music tracks                                                       */
/* ------------------------------------------------------------------ */

interface MusicTrack {
  id: string;
  label: string;
  src: string;
  description: string;
}

const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'dreams', label: 'Dreams', src: '/assets/music/dreams.mp3', description: 'Non-battle ambient — camp, menus, interludes' },
  { id: 'battle', label: 'Battle', src: '/assets/music/battle.mp3', description: 'Battle phase — line combat, melee' },
];

/* ------------------------------------------------------------------ */
/*  SFX definitions                                                    */
/* ------------------------------------------------------------------ */

interface SfxDef {
  id: string;
  label: string;
  src: string;
  volume: number;
  description: string;
}

const SFX_DEFS: SfxDef[] = [
  { id: 'volley', label: 'Volley (Close)', src: '/assets/sfx/volley-distant.mp3', volume: 0.85, description: 'Friendly volley — close, loud' },
  { id: 'volley-distant', label: 'Volley (Distant)', src: '/assets/sfx/volley-distant.mp3', volume: 0.5, description: 'Enemy volley — distant, quieter' },
  { id: 'hit', label: 'Hit', src: '/assets/sfx/hit.mp3', volume: 0.8, description: 'Melee hit — blade/bayonet connects' },
  { id: 'miss', label: 'Miss', src: '/assets/sfx/miss.mp3', volume: 0.7, description: 'Melee miss — swing through air' },
  { id: 'block', label: 'Block', src: '/assets/sfx/block.mp3', volume: 0.75, description: 'Guard absorbs a hit' },
  { id: 'musket-shot', label: 'Musket Shot', src: '/assets/sfx/musket-shot.mp3', volume: 0.85, description: 'Shoot action in melee' },
  { id: 'ricochet', label: 'Ricochet', src: '/assets/sfx/ricochet.mp3', volume: 0.75, description: 'Musket shot miss' },
];

/* ------------------------------------------------------------------ */
/*  Synth click candidates (migrated from testScreen.ts)               */
/* ------------------------------------------------------------------ */

interface SynthDef {
  id: string;
  label: string;
  description: string;
  play: (ctx: AudioContext) => void;
}

const SYNTH_SOUNDS: SynthDef[] = [
  {
    id: 'soft-click',
    label: 'Soft Click',
    description: 'Gentle sine blip — subtle, unobtrusive',
    play: (ac) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.connect(gain).connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.08);
    },
  },
  {
    id: 'mechanical-click',
    label: 'Mechanical Click',
    description: 'Short noise burst — like a physical button',
    play: (ac) => {
      const buf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8);
      }
      const src = ac.createBufferSource();
      const g = ac.createGain();
      src.buffer = buf;
      g.gain.value = 0.4;
      src.connect(g).connect(ac.destination);
      src.start();
    },
  },
  {
    id: 'woody-tap',
    label: 'Woody Tap',
    description: 'Low-pitched thud — warm, period-appropriate',
    play: (ac) => {
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
    },
  },
  {
    id: 'quill-scratch',
    label: 'Quill Scratch',
    description: 'High chirp — like pen on parchment',
    play: (ac) => {
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
    },
  },
  {
    id: 'metal-clink',
    label: 'Metal Clink',
    description: 'Bell-like ping — sharp, military',
    play: (ac) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1600, ac.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
      osc.connect(gain).connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.2);
    },
  },
  {
    id: 'map-thump',
    label: 'Map Thump',
    description: 'Current UI click — low noise thud',
    play: (ac) => {
      const buf = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 4);
      }
      const src = ac.createBufferSource();
      const filter = ac.createBiquadFilter();
      const g = ac.createGain();
      src.buffer = buf;
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      g.gain.value = 0.5;
      src.connect(filter).connect(g).connect(ac.destination);
      src.start();
    },
  },
  {
    id: 'drum-tap',
    label: 'Drum Tap',
    description: 'Military snare tap — marching cadence',
    play: (ac) => {
      const osc = ac.createOscillator();
      const noise = ac.createBuffer(1, ac.sampleRate * 0.06, ac.sampleRate);
      const nd = noise.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nd.length, 3);
      const ns = ac.createBufferSource();
      ns.buffer = noise;
      const nf = ac.createBiquadFilter();
      nf.type = 'highpass';
      nf.frequency.value = 2000;
      const ng = ac.createGain();
      ng.gain.value = 0.25;
      ns.connect(nf).connect(ng).connect(ac.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.04);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.4, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
      osc.connect(g).connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.08);
      ns.start();
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AudioLabPage() {
  const [masterVol, setMasterVol] = useState(0.5);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      if (ctxRef.current) {
        void ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  const playTrack = useCallback((track: MusicTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playingTrack === track.id) {
      setPlayingTrack(null);
      return;
    }
    const audio = new Audio(track.src);
    audio.loop = true;
    audio.volume = masterVol;
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlayingTrack(track.id);
  }, [playingTrack, masterVol]);

  const playSfx = useCallback((sfx: SfxDef) => {
    const audio = new Audio(sfx.src);
    audio.volume = sfx.volume * masterVol;
    audio.play().catch(() => {});
  }, [masterVol]);

  const playSynth = useCallback((def: SynthDef) => {
    def.play(getCtx());
  }, [getCtx]);

  // Update playing track volume when master changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = masterVol;
    }
  }, [masterVol]);

  return (
    <div className="audio-lab">
      {/* Master volume */}
      <div className="art-lab-toolbar">
        <span className="art-lab-toolbar-label">Master Volume:</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(masterVol * 100)}
          onChange={(e) => setMasterVol(Number(e.target.value) / 100)}
          className="art-lab-slider"
          style={{ width: 120 }}
        />
        <span className="art-lab-zoom-val">{Math.round(masterVol * 100)}%</span>
      </div>

      <div className="audio-lab-sections">
        {/* Music Section */}
        <div className="audio-lab-section">
          <h2 className="audio-lab-section-title">Music Tracks</h2>
          <div className="audio-lab-grid">
            {MUSIC_TRACKS.map((track) => (
              <button
                key={track.id}
                className={`audio-lab-sound-card${playingTrack === track.id ? ' playing' : ''}`}
                onClick={() => playTrack(track)}
              >
                <span className="audio-lab-sound-icon">{playingTrack === track.id ? '\u23F9' : '\u25B6'}</span>
                <div className="audio-lab-sound-info">
                  <span className="audio-lab-sound-name">{track.label}</span>
                  <span className="audio-lab-sound-desc">{track.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SFX Section */}
        <div className="audio-lab-section">
          <h2 className="audio-lab-section-title">Sound Effects</h2>
          <div className="audio-lab-grid">
            {SFX_DEFS.map((sfx) => (
              <button
                key={sfx.id}
                className="audio-lab-sound-card"
                onClick={() => playSfx(sfx)}
              >
                <span className="audio-lab-sound-icon">{'\u25B6'}</span>
                <div className="audio-lab-sound-info">
                  <span className="audio-lab-sound-name">{sfx.label}</span>
                  <span className="audio-lab-sound-desc">{sfx.description}</span>
                  <span className="audio-lab-sound-vol">vol: {sfx.volume}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Synth Sandbox */}
        <div className="audio-lab-section">
          <h2 className="audio-lab-section-title">Synth Click Candidates</h2>
          <p className="audio-lab-section-hint">Synthesized UI click sounds — no audio files needed</p>
          <div className="audio-lab-grid">
            {SYNTH_SOUNDS.map((synth) => (
              <button
                key={synth.id}
                className="audio-lab-sound-card"
                onClick={() => playSynth(synth)}
              >
                <span className="audio-lab-sound-icon">{'\u266B'}</span>
                <div className="audio-lab-sound-info">
                  <span className="audio-lab-sound-name">{synth.label}</span>
                  <span className="audio-lab-sound-desc">{synth.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
