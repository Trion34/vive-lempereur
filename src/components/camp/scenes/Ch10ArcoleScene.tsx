import React from 'react';

/**
 * Ch.10 — Arcole, marsh/causeway
 * November dawn, cold. Flat marshland, narrow causeway into mist,
 * bare willows, frost, thin ice on water, pale cold light.
 * Mood: Grim determination.
 */
export function Ch10ArcoleScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Cold November dawn — pale steely light */}
        <linearGradient id="ch10_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151a22" />
          <stop offset="30%" stopColor="#1e2530" />
          <stop offset="55%" stopColor="#2a3540" />
          <stop offset="75%" stopColor="#3a4a55" />
          <stop offset="90%" stopColor="#4a5a60" />
          <stop offset="100%" stopColor="#5a6a6a" />
        </linearGradient>
        {/* Marsh water — icy */}
        <linearGradient id="ch10_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3540" />
          <stop offset="50%" stopColor="#253040" />
          <stop offset="100%" stopColor="#202a38" />
        </linearGradient>
        {/* Ice on water */}
        <linearGradient id="ch10_ice" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a5a65" stopOpacity="0" />
          <stop offset="50%" stopColor="#4a5a65" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4a5a65" stopOpacity="0" />
        </linearGradient>
        {/* Causeway stone */}
        <linearGradient id="ch10_causeway" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a35" />
          <stop offset="100%" stopColor="#2a2a25" />
        </linearGradient>
        {/* Mist */}
        <linearGradient id="ch10_mist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4550" stopOpacity="0" />
          <stop offset="20%" stopColor="#3a4550" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#3a4550" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#3a4550" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3a4550" stopOpacity="0" />
        </linearGradient>
        {/* Frost shimmer */}
        <linearGradient id="ch10_frost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a6a70" stopOpacity="0" />
          <stop offset="50%" stopColor="#5a6a70" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#5a6a70" stopOpacity="0" />
        </linearGradient>
        {/* Pale dawn glow */}
        <radialGradient id="ch10_dawnGlow" cx="0.5" cy="0.95" r="0.6">
          <stop offset="0%" stopColor="#5a6a6a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a6a6a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch10_sky)" />
      {/* Dawn glow at horizon */}
      <rect width="800" height="400" fill="url(#ch10_dawnGlow)" />

      {/* Thin cloud bands */}
      <ellipse cx="300" cy="40" rx="200" ry="8" fill="#2a3540" opacity="0.3" />
      <ellipse cx="600" cy="55" rx="150" ry="6" fill="#2a3540" opacity="0.25" />

      {/* Flat marshland — very flat horizon */}
      <path d="M0 160 Q200 158 400 160 Q600 158 800 160 L800 400 L0 400 Z"
        fill="url(#ch10_water)" />

      {/* Thin ice patches */}
      <ellipse cx="200" cy="200" rx="60" ry="10" fill="url(#ch10_ice)" />
      <ellipse cx="500" cy="220" rx="80" ry="12" fill="url(#ch10_ice)" />
      <ellipse cx="700" cy="190" rx="50" ry="8" fill="url(#ch10_ice)" />
      <ellipse cx="100" cy="240" rx="40" ry="6" fill="url(#ch10_ice)" />

      {/* Ice crackle lines */}
      <path d="M180 198 L195 200 L210 195 L230 200" fill="none" stroke="#5a6a70" strokeWidth="0.3" opacity="0.2" />
      <path d="M470 218 L490 222 L510 218 L540 220" fill="none" stroke="#5a6a70" strokeWidth="0.3" opacity="0.2" />

      {/* Causeway — narrow stone bridge going into mist */}
      <path d="M350 350 Q360 320 370 290 Q380 260 390 230 Q400 200 410 175 Q420 160 430 150"
        fill="none" stroke="url(#ch10_causeway)" strokeWidth="22" opacity="0.6" />
      {/* Causeway edge lines */}
      <path d="M340 350 Q350 318 360 288 Q370 258 380 228 Q390 198 400 173"
        fill="none" stroke="#3a3a30" strokeWidth="1" opacity="0.3" />
      <path d="M362 350 Q372 318 382 288 Q392 258 402 228 Q412 198 422 173"
        fill="none" stroke="#3a3a30" strokeWidth="1" opacity="0.3" />

      {/* Causeway stones — texture */}
      <path d="M355 320 Q360 318 365 320" fill="none" stroke="#4a4a40" strokeWidth="0.5" opacity="0.3" />
      <path d="M360 300 Q365 298 370 300" fill="none" stroke="#4a4a40" strokeWidth="0.5" opacity="0.3" />
      <path d="M370 275 Q375 273 380 275" fill="none" stroke="#4a4a40" strokeWidth="0.5" opacity="0.3" />

      {/* Mist — thickening in distance */}
      <ellipse cx="400" cy="170" rx="250" ry="25" fill="#3a4550" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.3;0.2" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="155" rx="200" ry="20" fill="#3a4550" opacity="0.25">
        <animate attributeName="cx" values="420;440;420" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <rect x="0" y="145" width="800" height="30" fill="url(#ch10_mist)" />

      {/* Bare willows */}
      {/* Willow 1 — left */}
      <path d="M130 200 Q132 170 135 145" fill="none" stroke="#2a2a28" strokeWidth="2" />
      <path d="M135 145 Q140 130 142 140" fill="none" stroke="#2a2a28" strokeWidth="1" />
      <path d="M135 145 Q128 133 126 140" fill="none" stroke="#2a2a28" strokeWidth="0.8" />
      {/* Drooping branches */}
      <path d="M140 135 Q150 145 155 165" fill="none" stroke="#2a2a28" strokeWidth="0.5" opacity="0.5" />
      <path d="M128 138 Q120 148 118 168" fill="none" stroke="#2a2a28" strokeWidth="0.5" opacity="0.5" />
      <path d="M138 140 Q145 155 148 175" fill="none" stroke="#2a2a28" strokeWidth="0.4" opacity="0.4" />

      {/* Willow 2 — right */}
      <path d="M650 195 Q652 168 655 145" fill="none" stroke="#2a2a28" strokeWidth="1.8" />
      <path d="M655 145 Q660 132 662 142" fill="none" stroke="#2a2a28" strokeWidth="0.8" />
      <path d="M655 145 Q648 135 646 142" fill="none" stroke="#2a2a28" strokeWidth="0.7" />
      <path d="M660 138 Q668 150 670 170" fill="none" stroke="#2a2a28" strokeWidth="0.4" opacity="0.5" />
      <path d="M648 140 Q640 152 638 172" fill="none" stroke="#2a2a28" strokeWidth="0.4" opacity="0.5" />

      {/* Frost on ground near edges */}
      <rect x="0" y="160" width="800" height="8" fill="url(#ch10_frost)" />

      {/* Soldiers on causeway — advancing into mist */}
      {/* Lead soldier */}
      <path d="M385 245 Q383 235 385 228 Q387 223 389 228 L391 245 Z" fill="#151518" opacity="0.8" />
      <circle cx="387" cy="223" r="4.5" fill="#151518" opacity="0.8" />
      {/* Musket */}
      <line x1="393" y1="222" x2="395" y2="248" stroke="#151518" strokeWidth="1.2" opacity="0.6" />

      {/* Second soldier */}
      <path d="M370 280 Q368 270 370 264 Q372 259 374 264 L376 280 Z" fill="#151518" opacity="0.75" />
      <circle cx="372" cy="259" r="4" fill="#151518" opacity="0.75" />

      {/* Third soldier */}
      <path d="M358 310 Q356 300 358 294 Q360 289 362 294 L364 310 Z" fill="#151518" opacity="0.7" />
      <circle cx="360" cy="289" r="4" fill="#151518" opacity="0.7" />

      {/* Column in fog — ghostly */}
      <path d="M398 215 Q396 208 398 203 Q400 215 402 215 Z" fill="#252830" opacity="0.4" />
      <path d="M405 200 Q403 193 405 188 Q407 200 409 200 Z" fill="#252830" opacity="0.3" />
      <path d="M412 188 Q410 182 412 178 Q414 188 416 188 Z" fill="#252830" opacity="0.2" />

      {/* Breath vapor */}
      <ellipse cx="392" cy="220" rx="5" ry="2" fill="#4a5560" opacity="0.15">
        <animate attributeName="rx" values="5;8;5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Cold vignette */}
      <rect x="0" y="0" width="800" height="30" fill="#101520" opacity="0.3" />
      <rect x="0" y="375" width="800" height="25" fill="#101520" opacity="0.4" />
    </svg>
  );
}
