import React from 'react';

/**
 * Ch.3 — Mondovì, fertile Piedmont plain
 * Warm evening. Open plain below mountains, plunder visible (food, wine barrels),
 * warmer tones, farmland, distant village. Mood: Relief mixed with moral unease.
 */
export function Ch3MondoviScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Warm evening sky — golden hour */}
        <linearGradient id="ch3_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1525" />
          <stop offset="30%" stopColor="#2a2030" />
          <stop offset="55%" stopColor="#4a3540" />
          <stop offset="75%" stopColor="#7a5540" />
          <stop offset="90%" stopColor="#b07845" />
          <stop offset="100%" stopColor="#c89050" />
        </linearGradient>
        {/* Mountains */}
        <linearGradient id="ch3_mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3045" />
          <stop offset="100%" stopColor="#4a4050" />
        </linearGradient>
        {/* Farmland */}
        <linearGradient id="ch3_field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4530" />
          <stop offset="100%" stopColor="#2a3520" />
        </linearGradient>
        {/* Ground — camp area */}
        <linearGradient id="ch3_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3525" />
          <stop offset="100%" stopColor="#2a2518" />
        </linearGradient>
        {/* Fire glow */}
        <radialGradient id="ch3_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d09050" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#a07040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a07040" stopOpacity="0" />
        </radialGradient>
        {/* Sunset glow on horizon */}
        <radialGradient id="ch3_sunGlow" cx="0.7" cy="0.55" r="0.4">
          <stop offset="0%" stopColor="#c89050" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c89050" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch3_sky)" />

      {/* Sunset glow */}
      <rect width="800" height="400" fill="url(#ch3_sunGlow)" />

      {/* Evening star */}
      <circle cx="200" cy="50" r="1.5" fill="#c0b898" opacity="0.6" />
      <circle cx="350" cy="35" r="1" fill="#c0b898" opacity="0.4" />

      {/* Distant Alps silhouette */}
      <path d="M0 130 Q50 100 120 115 Q180 85 250 105 Q300 90 370 110 Q420 80 480 100 Q530 88 580 105 Q640 78 700 100 Q750 90 800 110 L800 170 L0 170 Z"
        fill="url(#ch3_mtn)" opacity="0.7" />
      {/* Snow caps */}
      <path d="M180 87 Q190 82 200 87" fill="#6a6070" opacity="0.3" />
      <path d="M420 82 Q430 76 440 82" fill="#6a6070" opacity="0.3" />
      <path d="M640 80 Q650 74 660 80" fill="#6a6070" opacity="0.25" />

      {/* Distant village */}
      <rect x="560" y="155" width="8" height="12" fill="#5a5045" opacity="0.5" />
      <path d="M558 155 L564 148 L570 155" fill="#6a5a4a" opacity="0.5" />
      <rect x="575" y="158" width="6" height="9" fill="#5a5045" opacity="0.5" />
      <path d="M573 158 L578 152 L583 158" fill="#6a5a4a" opacity="0.5" />
      <rect x="588" y="153" width="4" height="14" fill="#5a5045" opacity="0.5" />
      <path d="M587 153 L590 146 L593 153" fill="#6a5a4a" opacity="0.5" />
      {/* Church steeple */}
      <line x1="590" y1="146" x2="590" y2="140" stroke="#6a5a4a" strokeWidth="1" opacity="0.5" />
      {/* Tiny window glow */}
      <rect x="562" y="160" width="2" height="2" fill="#c09050" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Rolling farmland — patchwork fields */}
      <path d="M0 175 Q100 165 200 170 Q350 160 500 168 Q650 162 800 172 L800 250 L0 250 Z"
        fill="url(#ch3_field)" opacity="0.9" />
      {/* Field boundaries */}
      <path d="M200 170 L200 230" stroke="#4a5535" strokeWidth="0.5" opacity="0.3" />
      <path d="M400 167 L400 235" stroke="#4a5535" strokeWidth="0.5" opacity="0.3" />
      <path d="M600 165 L600 240" stroke="#4a5535" strokeWidth="0.5" opacity="0.3" />
      {/* Hay rows */}
      <path d="M100 195 Q150 192 200 195" fill="none" stroke="#506038" strokeWidth="0.5" opacity="0.3" />
      <path d="M100 205 Q150 202 200 205" fill="none" stroke="#506038" strokeWidth="0.5" opacity="0.3" />
      <path d="M420 190 Q470 187 520 190" fill="none" stroke="#506038" strokeWidth="0.5" opacity="0.3" />

      {/* Dirt road winding to camp */}
      <path d="M300 250 Q350 240 400 245 Q500 255 550 250 Q620 242 700 248"
        fill="none" stroke="#4a4535" strokeWidth="2" opacity="0.3" />

      {/* Camp ground */}
      <path d="M0 255 Q200 248 400 252 Q600 248 800 255 L800 400 L0 400 Z"
        fill="url(#ch3_ground)" />

      {/* Campfire — healthy, warm */}
      <ellipse cx="350" cy="310" rx="35" ry="10" fill="url(#ch3_fireGlow)">
        <animate attributeName="rx" values="35;40;35" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire */}
      <path d="M345 308 Q348 295 350 288 Q352 295 355 308" fill="#d09050" opacity="0.7">
        <animate attributeName="d" values="M345 308 Q348 295 350 288 Q352 295 355 308;M345 308 Q349 293 350 286 Q351 293 355 308;M345 308 Q348 295 350 288 Q352 295 355 308" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M347 308 Q349 298 350 293 Q351 298 353 308" fill="#e0a060" opacity="0.5">
        <animate attributeName="d" values="M347 308 Q349 298 350 293 Q351 298 353 308;M347 308 Q350 296 350 291 Q351 296 353 308;M347 308 Q349 298 350 293 Q351 298 353 308" dur="0.7s" repeatCount="indefinite" />
      </path>
      {/* Sparks */}
      <circle cx="348" cy="285" r="0.8" fill="#e0b070" opacity="0.6">
        <animate attributeName="cy" values="285;265;245" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="353" cy="280" r="0.6" fill="#d0a060" opacity="0.5">
        <animate attributeName="cy" values="280;258;240" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Plunder — wine barrels, food crates */}
      {/* Wine barrel */}
      <ellipse cx="250" cy="300" rx="12" ry="8" fill="#4a3a28" />
      <ellipse cx="250" cy="300" rx="12" ry="8" fill="none" stroke="#5a4a38" strokeWidth="0.8" />
      <line x1="242" y1="300" x2="258" y2="300" stroke="#5a4a38" strokeWidth="0.5" />
      {/* Second barrel */}
      <ellipse cx="270" cy="305" rx="10" ry="7" fill="#4a3a28" />
      <ellipse cx="270" cy="305" rx="10" ry="7" fill="none" stroke="#5a4a38" strokeWidth="0.8" />

      {/* Food crate */}
      <rect x="430" y="296" width="16" height="12" fill="#4a4030" stroke="#5a5040" strokeWidth="0.8" />
      <line x1="438" y1="296" x2="438" y2="308" stroke="#5a5040" strokeWidth="0.5" />

      {/* Sack of grain */}
      <path d="M460 302 Q465 295 475 298 Q478 302 475 308 Q465 310 460 308 Z" fill="#5a5040" opacity="0.6" />

      {/* Soldiers — relaxed but uneasy */}
      {/* Soldier drinking from bottle */}
      <path d="M310 290 Q308 278 311 270 Q314 265 317 270 L319 290 Q316 295 313 295 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="314" cy="265" r="4.5" fill="#1a1815" opacity="0.8" />
      <line x1="318" y1="272" x2="322" y2="268" stroke="#1a1815" strokeWidth="2" opacity="0.7" />

      {/* Soldier leaning on barrel */}
      <path d="M245 285 Q243 275 245 268 Q247 263 249 268 L251 285 Z"
        fill="#1a1815" opacity="0.75" />
      <circle cx="247" cy="263" r="4" fill="#1a1815" opacity="0.75" />

      {/* Soldier sitting with food */}
      <path d="M380 300 Q378 290 381 285 Q384 290 382 300 Z" fill="#1a1815" opacity="0.7" />
      <circle cx="381" cy="282" r="3.5" fill="#1a1815" opacity="0.7" />

      {/* Cypress tree silhouette — Italian landscape */}
      <path d="M150 260 Q152 220 155 180 Q158 220 160 260" fill="#1a2518" opacity="0.6" />
      <path d="M152 240 Q154 200 155 170 Q156 200 158 240" fill="#152015" opacity="0.5" />

      {/* Foreground grass */}
      <path d="M0 365 Q5 358 10 365 Q15 355 20 365 Q25 358 30 365"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.3" />
      <path d="M780 360 Q785 352 790 360 Q795 350 800 360"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.3" />

      {/* Warm vignette */}
      <rect x="0" y="370" width="800" height="30" fill="#1a1510" opacity="0.4" />
    </svg>
  );
}
