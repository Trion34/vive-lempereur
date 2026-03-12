import React from 'react';

/**
 * Ch.2 — Montenotte, mountain ravine
 * Night, rain/fog. Steep ravines, fog drifting through trees,
 * small fires in a narrow valley, rain streaks, dark mountains looming.
 * Mood: Tense, first-battle nerves.
 */
export function Ch2MontenotteScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Dark rainy night sky */}
        <linearGradient id="ch2_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0c12" />
          <stop offset="50%" stopColor="#121620" />
          <stop offset="100%" stopColor="#1a1e28" />
        </linearGradient>
        {/* Far mountain */}
        <linearGradient id="ch2_farMtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1e28" />
          <stop offset="100%" stopColor="#222830" />
        </linearGradient>
        {/* Near mountain */}
        <linearGradient id="ch2_nearMtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2228" />
          <stop offset="100%" stopColor="#252a30" />
        </linearGradient>
        {/* Valley floor */}
        <linearGradient id="ch2_valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2018" />
          <stop offset="100%" stopColor="#151a15" />
        </linearGradient>
        {/* Fog */}
        <linearGradient id="ch2_fog" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4050" stopOpacity="0" />
          <stop offset="30%" stopColor="#3a4050" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#3a4050" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3a4050" stopOpacity="0" />
        </linearGradient>
        {/* Fire glow */}
        <radialGradient id="ch2_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a06030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Rain overlay */}
        <pattern id="ch2_rain" width="20" height="40" patternUnits="userSpaceOnUse">
          <line x1="10" y1="0" x2="8" y2="40" stroke="#5a6070" strokeWidth="0.4" opacity="0.2" />
        </pattern>
        {/* Tree gradient */}
        <linearGradient id="ch2_tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2520" />
          <stop offset="100%" stopColor="#151e18" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch2_sky)" />

      {/* Far mountains — looming, dark */}
      <path d="M0 120 Q50 80 120 100 Q180 60 250 90 Q300 70 350 95 Q400 55 450 85 Q520 50 580 80 Q640 60 700 90 Q750 70 800 100 L800 200 L0 200 Z"
        fill="url(#ch2_farMtn)" opacity="0.9" />

      {/* Mid mountains — steeper, ravine walls */}
      <path d="M0 170 Q60 130 140 160 Q200 120 280 150 Q320 130 360 155 L360 250 L0 250 Z"
        fill="url(#ch2_nearMtn)" opacity="0.95" />
      <path d="M440 150 Q500 120 560 145 Q620 110 700 140 Q750 125 800 150 L800 250 L440 250 Z"
        fill="url(#ch2_nearMtn)" opacity="0.95" />

      {/* Narrow valley between walls */}
      <path d="M300 200 Q350 180 400 190 Q450 180 500 200 L500 400 L300 400 Z"
        fill="url(#ch2_valley)" />

      {/* Valley floor extension */}
      <path d="M0 260 Q100 240 200 250 Q300 240 400 245 Q500 240 600 250 Q700 242 800 255 L800 400 L0 400 Z"
        fill="url(#ch2_valley)" />

      {/* Pine trees on ridges — dark silhouettes */}
      {/* Left ridge trees */}
      <path d="M80 155 L85 130 L90 155" fill="url(#ch2_tree)" />
      <path d="M83 140 L85 120 L87 140" fill="url(#ch2_tree)" />
      <path d="M130 150 L136 122 L142 150" fill="url(#ch2_tree)" />
      <path d="M133 135 L136 112 L139 135" fill="url(#ch2_tree)" />
      <path d="M200 140 L205 115 L210 140" fill="url(#ch2_tree)" />

      {/* Right ridge trees */}
      <path d="M520 142 L526 115 L532 142" fill="url(#ch2_tree)" />
      <path d="M523 128 L526 105 L529 128" fill="url(#ch2_tree)" />
      <path d="M600 135 L605 110 L610 135" fill="url(#ch2_tree)" />
      <path d="M650 140 L656 112 L662 140" fill="url(#ch2_tree)" />
      <path d="M720 132 L725 108 L730 132" fill="url(#ch2_tree)" />
      <path d="M723 120 L725 100 L727 120" fill="url(#ch2_tree)" />

      {/* Valley trees — closer, darker */}
      <path d="M340 230 L346 200 L352 230" fill="#121a15" />
      <path d="M343 215 L346 190 L349 215" fill="#121a15" />
      <path d="M450 225 L455 198 L460 225" fill="#121a15" />

      {/* Small fires in valley — nervous soldiers */}
      {/* Fire 1 */}
      <ellipse cx="380" cy="285" rx="25" ry="8" fill="url(#ch2_fireGlow)">
        <animate attributeName="rx" values="25;28;25" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="380" cy="285" rx="3" ry="1.5" fill="#d09050" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Tiny flame */}
      <path d="M378 283 Q380 276 382 283" fill="#c08040" opacity="0.5">
        <animate attributeName="d" values="M378 283 Q380 276 382 283;M378 283 Q381 275 382 283;M378 283 Q380 276 382 283" dur="0.6s" repeatCount="indefinite" />
      </path>

      {/* Fire 2 — further back */}
      <ellipse cx="420" cy="270" rx="15" ry="5" fill="url(#ch2_fireGlow)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="420" cy="270" r="1.5" fill="#c08040" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Fire 3 — distant */}
      <circle cx="460" cy="255" r="2" fill="#a07040" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Soldier silhouettes around fire 1 */}
      <path d="M365 275 Q363 262 366 255 Q368 250 370 255 L372 275 Z" fill="#0a0c08" opacity="0.8" />
      <circle cx="368" cy="250" r="4" fill="#0a0c08" opacity="0.8" />
      <path d="M390 275 Q388 265 390 258 Q392 253 394 258 L396 275 Z" fill="#0a0c08" opacity="0.8" />
      <circle cx="392" cy="253" r="4" fill="#0a0c08" opacity="0.8" />
      {/* Seated soldier */}
      <path d="M375 282 Q373 272 378 268 Q382 272 380 282 Z" fill="#0a0c08" opacity="0.7" />

      {/* Fog drifting through trees */}
      <ellipse cx="350" cy="210" rx="120" ry="15" fill="#3a4050" opacity="0.12">
        <animate attributeName="cx" values="350;380;350" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.18;0.12" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="240" rx="100" ry="12" fill="#3a4050" opacity="0.1">
        <animate attributeName="cx" values="500;470;500" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="200" cy="190" rx="80" ry="10" fill="#3a4050" opacity="0.08">
        <animate attributeName="cx" values="200;230;200" dur="14s" repeatCount="indefinite" />
      </ellipse>

      {/* Rain overlay */}
      <rect width="800" height="400" fill="url(#ch2_rain)" opacity="0.5" />
      {/* Additional diagonal rain streaks */}
      <line x1="100" y1="0" x2="80" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.15" />
      <line x1="250" y1="0" x2="230" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.12" />
      <line x1="400" y1="0" x2="380" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.15" />
      <line x1="550" y1="0" x2="530" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.12" />
      <line x1="680" y1="0" x2="660" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.15" />

      {/* Foreground — close rocks and mud */}
      <path d="M0 360 Q40 350 80 355 Q120 358 160 352 L160 400 L0 400 Z" fill="#121815" />
      <path d="M650 355 Q700 348 750 352 Q780 356 800 350 L800 400 L650 400 Z" fill="#121815" />

      {/* Dark vignette */}
      <rect width="800" height="400" fill="url(#ch2_sky)" opacity="0.15" />
      <rect x="0" y="0" width="800" height="40" fill="#0a0c12" opacity="0.3" />
      <rect x="0" y="370" width="800" height="30" fill="#0a0c12" opacity="0.4" />
    </svg>
  );
}
