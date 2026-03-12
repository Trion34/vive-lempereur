import React from 'react';

/**
 * Ch.5 — Milan, urban garrison
 * Summer night. Italian architecture, elegant buildings, military camp in a piazza,
 * warm lamplight from windows, trees. Mood: Uneasy occupation.
 */
export function Ch5MilanScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Summer night sky — deep blue-black */}
        <linearGradient id="ch5_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08091a" />
          <stop offset="40%" stopColor="#101525" />
          <stop offset="100%" stopColor="#1a1e30" />
        </linearGradient>
        {/* Building face */}
        <linearGradient id="ch5_bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#302a25" />
        </linearGradient>
        {/* Building face lit */}
        <linearGradient id="ch5_bldgLit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4035" />
          <stop offset="100%" stopColor="#3a3028" />
        </linearGradient>
        {/* Lamplight */}
        <radialGradient id="ch5_lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a060" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#c09050" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c09050" stopOpacity="0" />
        </radialGradient>
        {/* Ground — piazza cobblestone */}
        <linearGradient id="ch5_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2520" />
          <stop offset="100%" stopColor="#1a1815" />
        </linearGradient>
        {/* Window glow */}
        <radialGradient id="ch5_winGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a060" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c09050" stopOpacity="0" />
        </radialGradient>
        {/* Fire glow */}
        <radialGradient id="ch5_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Night sky */}
      <rect width="800" height="400" fill="url(#ch5_sky)" />

      {/* Stars */}
      <circle cx="100" cy="25" r="0.8" fill="#b0a888" opacity="0.5" />
      <circle cx="250" cy="15" r="1" fill="#c0b898" opacity="0.6" />
      <circle cx="400" cy="30" r="0.6" fill="#b0a888" opacity="0.4" />
      <circle cx="550" cy="20" r="0.8" fill="#b0a888" opacity="0.5" />
      <circle cx="700" cy="35" r="0.7" fill="#c0b898" opacity="0.45" />
      <circle cx="180" cy="45" r="0.5" fill="#b0a888" opacity="0.35" />

      {/* === BUILDINGS — elegant Italian architecture === */}

      {/* Left building — tall palazzo */}
      <rect x="0" y="80" width="160" height="320" fill="url(#ch5_bldg)" />
      {/* Cornice line */}
      <rect x="0" y="78" width="160" height="4" fill="#4a4540" />
      {/* Roof ornament */}
      <path d="M20 78 L25 68 L30 78" fill="#4a4540" />
      <path d="M70 78 L75 65 L80 78" fill="#4a4540" />
      <path d="M130 78 L135 68 L140 78" fill="#4a4540" />
      {/* Windows — 3 rows */}
      {[0, 1, 2].map((row) => (
        <React.Fragment key={`l${row}`}>
          {[20, 60, 100, 135].map((x) => (
            <React.Fragment key={`l${row}${x}`}>
              <rect x={x} y={110 + row * 65} width="14" height="22" fill="#1a1518" rx="2" />
              <rect x={x + 2} y={112 + row * 65} width="10" height="18" fill="#c09050" opacity={0.15 + row * 0.05} rx="1">
                <animate attributeName="opacity" values={`${0.15 + row * 0.05};${0.08 + row * 0.02};${0.15 + row * 0.05}`} dur={`${3 + row}s`} repeatCount="indefinite" />
              </rect>
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}

      {/* Center-left building */}
      <rect x="170" y="100" width="130" height="300" fill="url(#ch5_bldgLit)" />
      <rect x="170" y="98" width="130" height="3" fill="#5a5045" />
      {/* Balcony */}
      <rect x="200" y="145" width="70" height="3" fill="#5a5045" />
      <rect x="205" y="120" width="12" height="25" fill="#1a1518" rx="1" />
      <rect x="225" y="120" width="12" height="25" fill="#1a1518" rx="1" />
      <rect x="245" y="120" width="12" height="25" fill="#1a1518" rx="1" />
      {/* Warm lit window */}
      <rect x="207" y="122" width="8" height="21" fill="#c09050" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.12;0.25" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Lower windows */}
      <rect x="185" y="200" width="10" height="18" fill="#1a1518" rx="1" />
      <rect x="210" y="200" width="10" height="18" fill="#1a1518" rx="1" />
      <rect x="265" y="200" width="10" height="18" fill="#1a1518" rx="1" />
      <rect x="187" y="202" width="6" height="14" fill="#c09050" opacity="0.1" />

      {/* Right building — palazzo with arches */}
      <rect x="560" y="90" width="240" height="310" fill="url(#ch5_bldg)" />
      <rect x="560" y="88" width="240" height="3" fill="#4a4540" />
      {/* Arcade arches at ground level */}
      <path d="M575 310 Q590 290 605 310" fill="#15120e" />
      <path d="M615 310 Q630 290 645 310" fill="#15120e" />
      <path d="M655 310 Q670 290 685 310" fill="#15120e" />
      <path d="M695 310 Q710 290 725 310" fill="#15120e" />
      {/* Upper windows */}
      {[580, 620, 660, 700, 740].map((x) => (
        <React.Fragment key={`r${x}`}>
          <rect x={x} y="130" width="12" height="20" fill="#1a1518" rx="1" />
          <rect x={x} y="200" width="12" height="20" fill="#1a1518" rx="1" />
          <rect x={x + 2} y="132" width="8" height="16" fill="#c09050" opacity="0.12">
            <animate attributeName="opacity" values="0.12;0.05;0.12" dur={`${3 + (x % 3)}s`} repeatCount="indefinite" />
          </rect>
        </React.Fragment>
      ))}

      {/* Center-right building */}
      <rect x="420" y="120" width="130" height="280" fill="url(#ch5_bldgLit)" />
      <rect x="420" y="118" width="130" height="3" fill="#5a5045" />
      {/* Windows */}
      <rect x="440" y="155" width="10" height="18" fill="#1a1518" rx="1" />
      <rect x="470" y="155" width="10" height="18" fill="#1a1518" rx="1" />
      <rect x="500" y="155" width="10" height="18" fill="#1a1518" rx="1" />
      <rect x="442" y="157" width="6" height="14" fill="#c09050" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="502" y="157" width="6" height="14" fill="#c09050" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.07;0.15" dur="4.5s" repeatCount="indefinite" />
      </rect>

      {/* === PIAZZA GROUND === */}
      <rect x="160" y="310" width="400" height="90" fill="url(#ch5_ground)" />

      {/* Street lamp */}
      <line x1="350" y1="200" x2="350" y2="300" stroke="#3a3530" strokeWidth="2" />
      <ellipse cx="350" cy="200" rx="8" ry="5" fill="#c09050" opacity="0.15" />
      <ellipse cx="350" cy="210" rx="25" ry="15" fill="url(#ch5_lamp)">
        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Camp in piazza — tents, equipment */}
      {/* Small tent */}
      <path d="M250 310 L275 285 L300 310" fill="#2a2520" stroke="#3a3530" strokeWidth="0.8" />
      {/* Another tent */}
      <path d="M400 310 L420 290 L440 310" fill="#2a2520" stroke="#3a3530" strokeWidth="0.8" />

      {/* Small campfire */}
      <ellipse cx="340" cy="330" rx="20" ry="5" fill="url(#ch5_fireGlow)">
        <animate attributeName="rx" values="20;23;20" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M338 328 Q340 320 342 328" fill="#c08040" opacity="0.5">
        <animate attributeName="d" values="M338 328 Q340 320 342 328;M338 328 Q341 318 342 328;M338 328 Q340 320 342 328" dur="0.5s" repeatCount="indefinite" />
      </path>

      {/* Soldier silhouettes */}
      <path d="M320 320 Q318 310 320 304 Q322 299 324 304 L326 320 Z" fill="#0a0a08" opacity="0.75" />
      <circle cx="322" cy="299" r="4" fill="#0a0a08" opacity="0.75" />
      <path d="M360 318 Q358 308 360 302 Q362 297 364 302 L366 318 Z" fill="#0a0a08" opacity="0.75" />
      <circle cx="362" cy="297" r="4" fill="#0a0a08" opacity="0.75" />

      {/* Sentry — standing alert */}
      <path d="M480 280 Q478 268 480 258 Q482 252 484 258 L486 280 Q485 290 484 300 L480 300 Z" fill="#0a0a08" opacity="0.8" />
      <circle cx="482" cy="252" r="5" fill="#0a0a08" opacity="0.8" />
      {/* Musket */}
      <line x1="488" y1="250" x2="490" y2="295" stroke="#0a0a08" strokeWidth="1.5" opacity="0.7" />

      {/* Tree in piazza */}
      <rect x="195" y="250" width="4" height="60" fill="#2a2518" />
      <ellipse cx="197" cy="240" rx="20" ry="15" fill="#1a2a18" opacity="0.6" />
      <ellipse cx="190" cy="245" rx="12" ry="10" fill="#152215" opacity="0.5" />
      <ellipse cx="205" cy="238" rx="15" ry="10" fill="#1a2518" opacity="0.5" />

      {/* Foreground cobblestone hints */}
      <path d="M200 360 Q210 358 220 360" fill="none" stroke="#352a25" strokeWidth="0.5" opacity="0.3" />
      <path d="M300 370 Q310 368 320 370" fill="none" stroke="#352a25" strokeWidth="0.5" opacity="0.3" />
      <path d="M440 365 Q450 363 460 365" fill="none" stroke="#352a25" strokeWidth="0.5" opacity="0.3" />

      {/* Vignette */}
      <rect x="0" y="375" width="800" height="25" fill="#080810" opacity="0.5" />
    </svg>
  );
}
