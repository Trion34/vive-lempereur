import React from 'react';

/**
 * Ch.8 — Bassano, Brenta valley
 * Autumn dusk. Mountain valley, river winding below, autumn foliage turning,
 * fast-moving clouds. Mood: Momentum, mountain pursuit.
 */
export function Ch8BassanoScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Autumn dusk sky — amber-purple */}
        <linearGradient id="ch8_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151020" />
          <stop offset="30%" stopColor="#251a30" />
          <stop offset="55%" stopColor="#3a2838" />
          <stop offset="75%" stopColor="#5a3a38" />
          <stop offset="90%" stopColor="#7a5040" />
          <stop offset="100%" stopColor="#8a6045" />
        </linearGradient>
        {/* Mountains */}
        <linearGradient id="ch8_mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252030" />
          <stop offset="100%" stopColor="#2a2535" />
        </linearGradient>
        {/* Autumn foliage warm */}
        <linearGradient id="ch8_foliageWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a4020" />
          <stop offset="100%" stopColor="#4a3018" />
        </linearGradient>
        {/* Autumn foliage cool */}
        <linearGradient id="ch8_foliageCool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4a25" />
          <stop offset="100%" stopColor="#2a3a1a" />
        </linearGradient>
        {/* River */}
        <linearGradient id="ch8_river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a3040" />
          <stop offset="50%" stopColor="#303845" />
          <stop offset="100%" stopColor="#2a3040" />
        </linearGradient>
        {/* Valley floor */}
        <linearGradient id="ch8_valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2818" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Fire glow */}
        <radialGradient id="ch8_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch8_sky)" />

      {/* Fast-moving clouds */}
      <ellipse cx="150" cy="50" rx="100" ry="12" fill="#3a2535" opacity="0.25">
        <animate attributeName="cx" values="150;170;150" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="35" rx="130" ry="10" fill="#3a2838" opacity="0.2">
        <animate attributeName="cx" values="450;475;450" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="60" rx="80" ry="8" fill="#3a2535" opacity="0.18">
        <animate attributeName="cx" values="650;680;650" dur="15s" repeatCount="indefinite" />
      </ellipse>

      {/* Far mountain range */}
      <path d="M0 110 Q60 70 140 95 Q200 60 280 85 Q340 50 400 80 Q460 55 530 75 Q590 45 660 70 Q720 50 800 80 L800 160 L0 160 Z"
        fill="url(#ch8_mtn)" opacity="0.7" />

      {/* Near mountain walls — valley sides */}
      {/* Left wall */}
      <path d="M0 140 Q50 100 120 130 Q180 90 230 120 L230 280 L0 280 Z"
        fill="#1a1a25" opacity="0.9" />
      {/* Right wall */}
      <path d="M580 130 Q630 90 700 115 Q750 80 800 110 L800 280 L580 280 Z"
        fill="#1a1a25" opacity="0.9" />

      {/* Autumn trees on slopes */}
      {/* Left slope trees */}
      <ellipse cx="80" cy="125" rx="20" ry="12" fill="url(#ch8_foliageWarm)" opacity="0.7" />
      <ellipse cx="60" cy="130" rx="15" ry="10" fill="#5a3520" opacity="0.6" />
      <ellipse cx="130" cy="120" rx="18" ry="11" fill="url(#ch8_foliageCool)" opacity="0.6" />
      <ellipse cx="170" cy="110" rx="15" ry="9" fill="url(#ch8_foliageWarm)" opacity="0.5" />

      {/* Right slope trees */}
      <ellipse cx="620" cy="120" rx="20" ry="12" fill="url(#ch8_foliageCool)" opacity="0.65" />
      <ellipse cx="660" cy="115" rx="18" ry="11" fill="url(#ch8_foliageWarm)" opacity="0.6" />
      <ellipse cx="720" cy="108" rx="22" ry="13" fill="#5a3520" opacity="0.55" />
      <ellipse cx="760" cy="100" rx="15" ry="9" fill="url(#ch8_foliageCool)" opacity="0.5" />

      {/* Valley floor */}
      <path d="M230 220 Q350 210 500 215 Q580 220 580 220 L580 400 L230 400 Z"
        fill="url(#ch8_valley)" />

      {/* Winding river through valley */}
      <path d="M320 160 Q350 180 380 195 Q420 210 400 230 Q380 250 360 270 Q340 290 350 310 Q360 330 380 350"
        fill="none" stroke="url(#ch8_river)" strokeWidth="25" opacity="0.6" />
      {/* River highlights */}
      <path d="M330 170 Q355 188 375 200 Q405 215 390 235"
        fill="none" stroke="#4a4a5a" strokeWidth="1" opacity="0.2" />

      {/* Falling leaves */}
      <circle cx="300" cy="180" r="1.5" fill="#8a5025" opacity="0.4">
        <animate attributeName="cy" values="180;250;320" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="300;310;305" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.3;0.1" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="160" r="1.2" fill="#7a4520" opacity="0.35">
        <animate attributeName="cy" values="160;230;300" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="500;508;504" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.25;0.05" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="420" cy="140" r="1" fill="#6a3a18" opacity="0.3">
        <animate attributeName="cy" values="140;220;310" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="420;415;422" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.2;0" dur="8s" repeatCount="indefinite" />
      </circle>

      {/* Camp in valley */}
      {/* Campfire */}
      <ellipse cx="430" cy="300" rx="25" ry="7" fill="url(#ch8_fireGlow)">
        <animate attributeName="rx" values="25;28;25" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M428 298 Q430 288 432 298" fill="#d09050" opacity="0.6">
        <animate attributeName="d" values="M428 298 Q430 288 432 298;M428 298 Q431 286 432 298;M428 298 Q430 288 432 298" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Sparks */}
      <circle cx="430" cy="285" r="0.6" fill="#e0b070" opacity="0.5">
        <animate attributeName="cy" values="285;265;248" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Soldiers — energetic, forward-looking */}
      <path d="M410 290 Q408 280 410 273 Q412 268 414 273 L416 290 Z" fill="#121010" opacity="0.8" />
      <circle cx="412" cy="268" r="4" fill="#121010" opacity="0.8" />
      <path d="M445 288 Q443 278 445 271 Q447 266 449 271 L451 288 Z" fill="#121010" opacity="0.75" />
      <circle cx="447" cy="266" r="4" fill="#121010" opacity="0.75" />
      {/* Marching column behind — distant */}
      <path d="M470 260 Q468 252 470 246 Q472 260 474 260 Z" fill="#121010" opacity="0.5" />
      <path d="M480 258 Q478 250 480 244 Q482 258 484 258 Z" fill="#121010" opacity="0.45" />
      <path d="M490 256 Q488 248 490 242 Q492 256 494 256 Z" fill="#121010" opacity="0.4" />

      {/* Valley trees in foreground */}
      <rect x="280" y="260" width="3" height="35" fill="#2a2518" />
      <ellipse cx="281" cy="255" rx="12" ry="8" fill="url(#ch8_foliageWarm)" opacity="0.5" />

      {/* Foreground slope */}
      <path d="M0 350 Q100 330 200 340 Q230 345 230 350 L230 400 L0 400 Z"
        fill="#151510" />
      <path d="M580 340 Q650 330 720 338 Q780 335 800 340 L800 400 L580 400 Z"
        fill="#151510" />

      {/* Vignette */}
      <rect x="0" y="375" width="800" height="25" fill="#0a0808" opacity="0.4" />
    </svg>
  );
}
