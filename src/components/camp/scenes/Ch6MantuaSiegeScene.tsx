import React from 'react';

/**
 * Ch.6 — Mantua Siege, marshland
 * Oppressive midday haze. Malarial marsh, fortress silhouette in heat haze,
 * stagnant water, sickly yellow-green atmosphere, few wilting trees.
 * Mood: Suffocating, diseased.
 */
export function Ch6MantuaSiegeScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Sickly haze sky — oppressive yellow-grey */}
        <linearGradient id="ch6_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4530" />
          <stop offset="30%" stopColor="#5a5535" />
          <stop offset="60%" stopColor="#6a6540" />
          <stop offset="80%" stopColor="#7a7548" />
          <stop offset="100%" stopColor="#8a8050" />
        </linearGradient>
        {/* Heat haze */}
        <linearGradient id="ch6_haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8050" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#9a9060" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8a8050" stopOpacity="0.3" />
        </linearGradient>
        {/* Marsh water — stagnant */}
        <linearGradient id="ch6_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4530" />
          <stop offset="50%" stopColor="#354028" />
          <stop offset="100%" stopColor="#2a3520" />
        </linearGradient>
        {/* Marsh ground */}
        <linearGradient id="ch6_marsh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a22" />
          <stop offset="100%" stopColor="#2a2a18" />
        </linearGradient>
        {/* Fortress */}
        <linearGradient id="ch6_fort" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5540" />
          <stop offset="100%" stopColor="#4a4535" />
        </linearGradient>
        {/* Miasma */}
        <radialGradient id="ch6_miasma" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#6a6540" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6a6540" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch6_sky)" />

      {/* Sun — hazy, no clear disc, just diffuse glare */}
      <ellipse cx="500" cy="60" rx="80" ry="60" fill="#9a9055" opacity="0.2" />
      <ellipse cx="500" cy="60" rx="40" ry="30" fill="#aaa065" opacity="0.15" />

      {/* Fortress of Mantua — distant silhouette in haze */}
      <path d="M250 150 L250 120 L260 120 L260 110 L265 105 L270 110 L270 120 L350 120 L350 110 L355 105 L360 110 L360 120 L450 120 L450 110 L455 105 L460 110 L460 120 L470 120 L470 150"
        fill="url(#ch6_fort)" opacity="0.4" />
      {/* Walls */}
      <rect x="250" y="140" width="220" height="20" fill="url(#ch6_fort)" opacity="0.35" />
      {/* Gate */}
      <path d="M340 160 Q355 148 370 160" fill="#3a3525" opacity="0.3" />
      {/* Heat shimmer on fortress */}
      <path d="M260 155 Q300 152 340 155 Q380 152 420 155 Q460 152 470 155"
        fill="none" stroke="#8a8050" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M260 155 Q300 152 340 155 Q380 152 420 155 Q460 152 470 155;M260 155 Q300 158 340 155 Q380 158 420 155 Q460 158 470 155;M260 155 Q300 152 340 155 Q380 152 420 155 Q460 152 470 155" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Flat marshland horizon */}
      <path d="M0 170 Q200 165 400 168 Q600 165 800 170 L800 200 L0 200 Z"
        fill="url(#ch6_marsh)" opacity="0.6" />

      {/* Stagnant water pools */}
      <ellipse cx="200" cy="230" rx="80" ry="15" fill="url(#ch6_water)" opacity="0.7" />
      <ellipse cx="550" cy="240" rx="100" ry="18" fill="url(#ch6_water)" opacity="0.6" />
      <ellipse cx="400" cy="280" rx="60" ry="10" fill="url(#ch6_water)" opacity="0.5" />

      {/* Scum on water */}
      <ellipse cx="190" cy="228" rx="20" ry="3" fill="#5a6030" opacity="0.3" />
      <ellipse cx="560" cy="238" rx="25" ry="4" fill="#5a6030" opacity="0.25" />

      {/* Marsh ground */}
      <path d="M0 200 Q200 195 400 200 Q600 195 800 200 L800 400 L0 400 Z"
        fill="url(#ch6_marsh)" />

      {/* Wilting dead trees */}
      {/* Tree 1 — bare, twisted */}
      <path d="M150 220 Q152 190 155 170" fill="none" stroke="#5a5540" strokeWidth="2" />
      <path d="M155 170 Q160 155 165 160" fill="none" stroke="#5a5540" strokeWidth="1.2" />
      <path d="M155 170 Q148 158 145 165" fill="none" stroke="#5a5540" strokeWidth="1" />
      <path d="M153 185 Q145 175 142 180" fill="none" stroke="#5a5540" strokeWidth="0.8" />

      {/* Tree 2 — further away, more wilted */}
      <path d="M620 215 Q622 190 625 175" fill="none" stroke="#5a5540" strokeWidth="1.5" opacity="0.7" />
      <path d="M625 175 Q630 165 633 170" fill="none" stroke="#5a5540" strokeWidth="0.8" opacity="0.7" />
      <path d="M625 175 Q618 168 616 172" fill="none" stroke="#5a5540" strokeWidth="0.8" opacity="0.7" />

      {/* Reeds in marsh */}
      <line x1="240" y1="220" x2="242" y2="200" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="245" y1="222" x2="248" y2="205" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="500" y1="230" x2="502" y2="210" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="505" y1="232" x2="508" y2="215" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />

      {/* Sick/miserable soldiers */}
      {/* Soldier lying down — sick */}
      <path d="M330 310 Q340 306 360 308 Q370 310 360 314 Q340 316 330 314 Z"
        fill="#2a2818" opacity="0.7" />
      {/* Soldier sitting hunched */}
      <path d="M420 300 Q418 290 420 284 Q422 280 424 284 Q426 290 424 300 Q422 304 420 300 Z"
        fill="#2a2818" opacity="0.7" />
      <circle cx="422" cy="278" r="4" fill="#2a2818" opacity="0.7" />
      {/* Soldier standing, leaning on musket */}
      <path d="M480 270 Q478 258 480 248 Q482 243 484 248 L486 270 Q485 280 484 290 L480 290 Z" fill="#2a2818" opacity="0.65" />
      <circle cx="482" cy="243" r="4.5" fill="#2a2818" opacity="0.65" />
      <line x1="488" y1="242" x2="490" y2="290" stroke="#2a2818" strokeWidth="1" opacity="0.5" />

      {/* Insects / miasma cloud */}
      <ellipse cx="350" cy="250" rx="60" ry="30" fill="url(#ch6_miasma)">
        <animate attributeName="cx" values="350;370;350" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="270" rx="40" ry="20" fill="url(#ch6_miasma)" opacity="0.7">
        <animate attributeName="cx" values="500;480;500" dur="10s" repeatCount="indefinite" />
      </ellipse>

      {/* Heat haze overlay */}
      <rect x="0" y="140" width="800" height="60" fill="url(#ch6_haze)" />

      {/* Oppressive tint */}
      <rect width="800" height="400" fill="#6a6540" opacity="0.05" />
      <rect x="0" y="370" width="800" height="30" fill="#2a2a18" opacity="0.3" />
    </svg>
  );
}
