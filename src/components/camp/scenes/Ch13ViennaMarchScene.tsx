import React from 'react';

/**
 * Ch.13 — March on Vienna, Alpine road
 * Spring dawn. Mountain pass opening to green valley, spring flowers,
 * confident army on move, Alpine peaks with snow. Mood: Forward momentum, hope.
 */
export function Ch13ViennaMarchScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Spring dawn sky — hopeful, bright */}
        <linearGradient id="ch13_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101828" />
          <stop offset="25%" stopColor="#1a2538" />
          <stop offset="45%" stopColor="#2a3a50" />
          <stop offset="65%" stopColor="#4a5565" />
          <stop offset="80%" stopColor="#6a7575" />
          <stop offset="90%" stopColor="#8a8878" />
          <stop offset="100%" stopColor="#a09878" />
        </linearGradient>
        {/* Dawn glow */}
        <radialGradient id="ch13_dawnGlow" cx="0.6" cy="0.8" r="0.5">
          <stop offset="0%" stopColor="#c0a060" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#a08050" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a08050" stopOpacity="0" />
        </radialGradient>
        {/* Snow peaks */}
        <linearGradient id="ch13_snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8088" />
          <stop offset="50%" stopColor="#6a7078" />
          <stop offset="100%" stopColor="#4a5060" />
        </linearGradient>
        {/* Green valley */}
        <linearGradient id="ch13_valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a4a28" />
          <stop offset="50%" stopColor="#254020" />
          <stop offset="100%" stopColor="#1a3518" />
        </linearGradient>
        {/* Road */}
        <linearGradient id="ch13_road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4538" />
          <stop offset="100%" stopColor="#3a3528" />
        </linearGradient>
        {/* Rock face */}
        <linearGradient id="ch13_rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        {/* Spring tree */}
        <linearGradient id="ch13_tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a5a30" />
          <stop offset="100%" stopColor="#2a4a22" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch13_sky)" />
      <rect width="800" height="400" fill="url(#ch13_dawnGlow)" />

      {/* Morning star */}
      <circle cx="300" cy="40" r="1.5" fill="#c0b898" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Alpine peaks with snow — majestic */}
      {/* Left peak */}
      <path d="M0 100 Q40 50 100 80 Q140 40 200 70 Q230 90 250 130 L250 200 L0 200 Z"
        fill="url(#ch13_rock)" opacity="0.8" />
      <path d="M140 42 Q150 35 160 42 Q170 50 180 55 Q190 50 200 70 Q180 55 160 52 Q150 48 140 42"
        fill="url(#ch13_snow)" opacity="0.5" />
      <path d="M40 52 Q50 45 60 52 Q70 60 80 65"
        fill="url(#ch13_snow)" opacity="0.4" />

      {/* Right peak */}
      <path d="M550 120 Q600 55 660 85 Q710 35 770 60 Q790 70 800 80 L800 200 L550 200 Z"
        fill="url(#ch13_rock)" opacity="0.8" />
      <path d="M710 37 Q720 28 730 35 Q740 42 750 48 Q760 42 770 60 Q750 45 730 40 Q720 38 710 37"
        fill="url(#ch13_snow)" opacity="0.5" />
      <path d="M600 57 Q610 48 620 55 Q630 62 640 68"
        fill="url(#ch13_snow)" opacity="0.4" />

      {/* Mountain pass opening — gap between peaks */}
      <path d="M250 130 Q300 115 350 120 Q400 110 450 115 Q500 118 550 120"
        fill="none" stroke="#2a3040" strokeWidth="1" opacity="0.3" />

      {/* Green valley visible through pass */}
      <path d="M280 140 Q350 130 400 135 Q450 128 520 138 L520 200 L280 200 Z"
        fill="url(#ch13_valley)" opacity="0.5" />

      {/* Distant green foothills */}
      <path d="M0 180 Q100 170 200 175 Q300 165 400 170 Q500 163 600 170 Q700 165 800 175 L800 220 L0 220 Z"
        fill="url(#ch13_valley)" opacity="0.4" />

      {/* Mountain slopes — closer, framing the road */}
      <path d="M0 200 Q60 150 130 180 Q200 170 250 200 L250 300 L0 300 Z"
        fill="url(#ch13_rock)" opacity="0.6" />
      <path d="M550 200 Q620 170 700 185 Q750 160 800 180 L800 300 L550 300 Z"
        fill="url(#ch13_rock)" opacity="0.6" />

      {/* Spring trees on slopes */}
      {/* Left slope */}
      <rect x="100" y="165" width="3" height="25" fill="#2a2518" />
      <ellipse cx="101" cy="160" rx="12" ry="9" fill="url(#ch13_tree)" opacity="0.6" />
      <rect x="180" y="175" width="3" height="20" fill="#2a2518" />
      <ellipse cx="181" cy="170" rx="10" ry="8" fill="url(#ch13_tree)" opacity="0.55" />

      {/* Right slope */}
      <rect x="620" y="170" width="3" height="22" fill="#2a2518" />
      <ellipse cx="621" cy="165" rx="11" ry="8" fill="url(#ch13_tree)" opacity="0.55" />
      <rect x="700" y="160" width="3" height="24" fill="#2a2518" />
      <ellipse cx="701" cy="155" rx="13" ry="9" fill="url(#ch13_tree)" opacity="0.5" />

      {/* Road winding through pass */}
      <path d="M350 400 Q360 360 370 320 Q380 280 400 240 Q420 200 450 180"
        fill="none" stroke="url(#ch13_road)" strokeWidth="28" opacity="0.5" />
      {/* Road edges */}
      <path d="M338 400 Q348 358 358 318 Q368 278 388 238"
        fill="none" stroke="#3a3530" strokeWidth="1" opacity="0.2" />
      <path d="M365 400 Q375 358 385 318 Q395 278 415 238"
        fill="none" stroke="#3a3530" strokeWidth="1" opacity="0.2" />

      {/* Valley ground */}
      <path d="M250 250 Q400 240 550 250 L550 400 L250 400 Z"
        fill="url(#ch13_valley)" opacity="0.4" />

      {/* Spring flowers — tiny color dots */}
      <circle cx="280" cy="270" r="1.5" fill="#8a6a8a" opacity="0.4" />
      <circle cx="290" cy="275" r="1" fill="#7a8a5a" opacity="0.35" />
      <circle cx="510" cy="265" r="1.5" fill="#8a6a8a" opacity="0.4" />
      <circle cx="520" cy="272" r="1" fill="#c0a060" opacity="0.3" />
      <circle cx="320" cy="285" r="1" fill="#8a6a8a" opacity="0.3" />
      <circle cx="480" cy="278" r="1.2" fill="#7a8a5a" opacity="0.35" />

      {/* Army column on road — confident, moving forward */}
      {/* Lead soldiers — larger */}
      <path d="M380 280 Q378 270 380 264 Q382 259 384 264 L386 280 Z" fill="#151510" opacity="0.8" />
      <circle cx="382" cy="259" r="4.5" fill="#151510" opacity="0.8" />
      <path d="M392 276 Q390 266 392 260 Q394 255 396 260 L398 276 Z" fill="#151510" opacity="0.8" />
      <circle cx="394" cy="255" r="4.5" fill="#151510" opacity="0.8" />

      {/* More soldiers behind */}
      <path d="M375 305 Q373 296 375 290 Q377 296 379 305 Z" fill="#151510" opacity="0.7" />
      <circle cx="376" cy="288" r="3.5" fill="#151510" opacity="0.7" />
      <path d="M388 302 Q386 293 388 287 Q390 293 392 302 Z" fill="#151510" opacity="0.7" />
      <circle cx="389" cy="285" r="3.5" fill="#151510" opacity="0.7" />

      {/* Distant column — smaller */}
      {[0, 1, 2, 3, 4].map((i) => (
        <React.Fragment key={i}>
          <path d={`M${370 + i * 6} ${330 + i * 10} Q${368 + i * 6} ${324 + i * 10} ${370 + i * 6} ${320 + i * 10}`}
            fill="none" stroke="#151510" strokeWidth="1.5" opacity={0.5 - i * 0.08} />
          <circle cx={370 + i * 6} cy={318 + i * 10} r={2.5 - i * 0.3} fill="#151510" opacity={0.5 - i * 0.08} />
        </React.Fragment>
      ))}

      {/* Flag at front */}
      <line x1="400" y1="255" x2="400" y2="232" stroke="#2a2520" strokeWidth="1.5" />
      <path d="M400 232 L415 236 L415 246 L400 242" fill="#2a3550" opacity="0.5" />

      {/* Bird in sky — hope */}
      <path d="M450 80 Q455 75 460 80 Q465 75 470 80" fill="none" stroke="#3a4a55" strokeWidth="0.8" opacity="0.3" />
      <path d="M480 90 Q484 86 488 90 Q492 86 496 90" fill="none" stroke="#3a4a55" strokeWidth="0.6" opacity="0.25" />

      {/* Warm dawn tint */}
      <rect width="800" height="400" fill="#a09060" opacity="0.03" />
      <rect x="0" y="380" width="800" height="20" fill="#0a0a08" opacity="0.3" />
    </svg>
  );
}
