import React from 'react';

/**
 * Ch.7 — Castiglione, Lake Garda hillside
 * Hot twilight. Lake visible, defensive positions, exhausted troops,
 * summer heat haze, smoke from distant fires. Mood: Desperate endurance.
 */
export function Ch7CastiglioneScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Hot twilight sky — purple-red over warm haze */}
        <linearGradient id="ch7_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1020" />
          <stop offset="30%" stopColor="#2a1a30" />
          <stop offset="55%" stopColor="#4a2a3a" />
          <stop offset="75%" stopColor="#6a3a35" />
          <stop offset="90%" stopColor="#8a5040" />
          <stop offset="100%" stopColor="#9a6045" />
        </linearGradient>
        {/* Lake Garda */}
        <linearGradient id="ch7_lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a50" />
          <stop offset="50%" stopColor="#303045" />
          <stop offset="100%" stopColor="#252540" />
        </linearGradient>
        {/* Lake reflection */}
        <linearGradient id="ch7_reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4a3a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7a4a3a" stopOpacity="0" />
        </linearGradient>
        {/* Hill */}
        <linearGradient id="ch7_hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a1a" />
          <stop offset="100%" stopColor="#1a1a12" />
        </linearGradient>
        {/* Smoke */}
        <radialGradient id="ch7_smoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a4a40" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5a4a40" stopOpacity="0" />
        </radialGradient>
        {/* Fire glow */}
        <radialGradient id="ch7_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch7_sky)" />

      {/* Smoke columns — distant fires */}
      <path d="M200 130 Q195 100 200 60" fill="none" stroke="#5a4a40" strokeWidth="3" opacity="0.12">
        <animate attributeName="d" values="M200 130 Q195 100 200 60;M200 130 Q205 100 200 60;M200 130 Q195 100 200 60" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M600 120 Q595 85 600 50" fill="none" stroke="#5a4a40" strokeWidth="2.5" opacity="0.1">
        <animate attributeName="d" values="M600 120 Q595 85 600 50;M600 120 Q605 85 600 50;M600 120 Q595 85 600 50" dur="10s" repeatCount="indefinite" />
      </path>

      {/* Distant mountains on far shore */}
      <path d="M0 130 Q80 105 160 120 Q240 95 340 115 Q380 100 420 110 Q480 130 500 125 L500 165 L0 165 Z"
        fill="#2a2535" opacity="0.5" />

      {/* Lake Garda */}
      <path d="M0 150 Q150 140 300 145 Q400 140 500 148 L500 220 L0 220 Z"
        fill="url(#ch7_lake)" />
      {/* Sky reflection on lake */}
      <path d="M0 150 Q150 140 300 145 Q400 140 500 148 L500 175 L0 175 Z"
        fill="url(#ch7_reflect)" />
      {/* Shimmer */}
      <ellipse cx="200" cy="165" rx="35" ry="2" fill="#7a5a4a" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.05;0.12" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="380" cy="170" rx="25" ry="1.5" fill="#7a5a4a" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.04;0.1" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Shore line transition */}
      <path d="M0 215 Q60 210 120 215 Q200 220 300 215 Q400 210 500 218"
        fill="none" stroke="#3a3a28" strokeWidth="1" opacity="0.3" />

      {/* Hillside rising from lake shore */}
      <path d="M0 220 Q100 210 200 220 Q350 230 500 215 Q600 200 700 210 Q750 215 800 205 L800 400 L0 400 Z"
        fill="url(#ch7_hill)" />

      {/* Defensive positions — earthworks, stone walls */}
      {/* Low stone wall */}
      <path d="M300 280 Q350 278 400 280 Q450 277 500 280 Q550 278 600 280"
        fill="#3a3a28" stroke="#4a4a35" strokeWidth="1" />
      <path d="M310 280 Q320 276 330 280" fill="none" stroke="#4a4a35" strokeWidth="0.5" opacity="0.5" />
      <path d="M400 280 Q410 276 420 280" fill="none" stroke="#4a4a35" strokeWidth="0.5" opacity="0.5" />
      <path d="M500 280 Q510 276 520 280" fill="none" stroke="#4a4a35" strokeWidth="0.5" opacity="0.5" />

      {/* Earthwork mound */}
      <path d="M550 275 Q580 265 620 270 Q650 265 680 275" fill="#2a2a1a" stroke="#3a3525" strokeWidth="0.8" />

      {/* Exhausted soldiers behind wall */}
      {/* Soldier slumped against wall */}
      <path d="M340 275 Q338 265 340 260 Q342 256 344 260 Q346 265 344 275 Z"
        fill="#151510" opacity="0.8" />
      <circle cx="342" cy="255" r="4" fill="#151510" opacity="0.8" />
      {/* Soldier with head on arms */}
      <path d="M420 272 Q418 264 420 258 Q422 264 424 272 Z"
        fill="#151510" opacity="0.75" />
      <circle cx="421" cy="255" r="3.5" fill="#151510" opacity="0.75" />
      {/* Soldier sitting, head down */}
      <path d="M500 272 Q498 265 500 260 Q502 265 504 272 Z"
        fill="#151510" opacity="0.7" />

      {/* Standing soldier — looking out */}
      <path d="M580 255 Q578 245 580 235 Q582 230 584 235 L586 255 Q585 265 584 275 L580 275 Z"
        fill="#151510" opacity="0.8" />
      <circle cx="582" cy="230" r="5" fill="#151510" opacity="0.8" />

      {/* Small fire */}
      <ellipse cx="450" cy="310" rx="22" ry="6" fill="url(#ch7_fireGlow)">
        <animate attributeName="rx" values="22;25;22" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M448 308 Q450 298 452 308" fill="#c08040" opacity="0.5">
        <animate attributeName="d" values="M448 308 Q450 298 452 308;M448 308 Q451 296 452 308;M448 308 Q450 298 452 308" dur="0.6s" repeatCount="indefinite" />
      </path>

      {/* Heat haze lines */}
      <path d="M0 210 Q200 205 400 210 Q600 205 800 210"
        fill="none" stroke="#7a6a50" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M0 210 Q200 205 400 210 Q600 205 800 210;M0 210 Q200 215 400 210 Q600 215 800 210;M0 210 Q200 205 400 210 Q600 205 800 210" dur="5s" repeatCount="indefinite" />
      </path>

      {/* Smoke overlay */}
      <ellipse cx="400" cy="180" rx="200" ry="40" fill="url(#ch7_smoke)" opacity="0.5">
        <animate attributeName="cx" values="400;420;400" dur="15s" repeatCount="indefinite" />
      </ellipse>

      {/* Dry grass on hillside */}
      <path d="M650 330 Q655 320 660 330" fill="none" stroke="#3a3a20" strokeWidth="0.8" opacity="0.3" />
      <path d="M670 335 Q675 325 680 335" fill="none" stroke="#3a3a20" strokeWidth="0.8" opacity="0.3" />

      {/* Vignette */}
      <rect x="0" y="375" width="800" height="25" fill="#0a0a08" opacity="0.4" />
    </svg>
  );
}
