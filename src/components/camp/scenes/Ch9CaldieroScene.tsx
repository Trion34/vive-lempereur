import React from 'react';

/**
 * Ch.9 — Caldiero, muddy field
 * Rain, grey daylight. Driving rain, mud everywhere, tattered uniforms,
 * broken equipment, bare trees, darkest palette of all scenes.
 * Mood: Despair, defeat.
 */
export function Ch9CaldieroScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Grey daylight sky — oppressive, leaden */}
        <linearGradient id="ch9_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1e" />
          <stop offset="30%" stopColor="#252528" />
          <stop offset="60%" stopColor="#303035" />
          <stop offset="100%" stopColor="#3a3a3e" />
        </linearGradient>
        {/* Mud ground */}
        <linearGradient id="ch9_mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2520" />
          <stop offset="50%" stopColor="#252018" />
          <stop offset="100%" stopColor="#1a1812" />
        </linearGradient>
        {/* Puddle */}
        <linearGradient id="ch9_puddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303035" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#252528" stopOpacity="0.4" />
        </linearGradient>
        {/* Rain pattern */}
        <pattern id="ch9_rain" width="15" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
          <line x1="7" y1="0" x2="5" y2="30" stroke="#4a4a55" strokeWidth="0.5" opacity="0.25" />
        </pattern>
        {/* Heavy rain pattern */}
        <pattern id="ch9_heavyRain" width="25" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <line x1="12" y1="0" x2="8" y2="50" stroke="#4a4a55" strokeWidth="0.7" opacity="0.15" />
        </pattern>
      </defs>

      {/* Leaden sky */}
      <rect width="800" height="400" fill="url(#ch9_sky)" />

      {/* Low heavy clouds */}
      <ellipse cx="200" cy="40" rx="200" ry="25" fill="#282830" opacity="0.5" />
      <ellipse cx="500" cy="30" rx="180" ry="20" fill="#252530" opacity="0.45" />
      <ellipse cx="700" cy="50" rx="150" ry="22" fill="#282830" opacity="0.4" />
      <ellipse cx="100" cy="70" rx="120" ry="18" fill="#252530" opacity="0.35" />
      <ellipse cx="400" cy="65" rx="160" ry="20" fill="#282830" opacity="0.3" />

      {/* Bare hills in distance */}
      <path d="M0 140 Q100 125 200 135 Q300 120 400 130 Q500 118 600 128 Q700 120 800 135 L800 180 L0 180 Z"
        fill="#222225" opacity="0.6" />

      {/* Bare trees — skeletal, leafless */}
      {/* Tree 1 */}
      <path d="M180 180 Q182 150 185 120" fill="none" stroke="#2a2a2a" strokeWidth="2" />
      <path d="M185 120 Q190 105 195 110" fill="none" stroke="#2a2a2a" strokeWidth="1.2" />
      <path d="M185 120 Q178 108 175 115" fill="none" stroke="#2a2a2a" strokeWidth="1" />
      <path d="M183 140 Q175 130 172 135" fill="none" stroke="#2a2a2a" strokeWidth="0.8" />
      <path d="M183 140 Q190 132 192 138" fill="none" stroke="#2a2a2a" strokeWidth="0.8" />

      {/* Tree 2 */}
      <path d="M550 175 Q553 145 555 115" fill="none" stroke="#2a2a2a" strokeWidth="1.8" />
      <path d="M555 115 Q560 100 563 108" fill="none" stroke="#2a2a2a" strokeWidth="1" />
      <path d="M555 115 Q548 105 546 112" fill="none" stroke="#2a2a2a" strokeWidth="0.8" />
      <path d="M553 135 Q545 128 543 132" fill="none" stroke="#2a2a2a" strokeWidth="0.7" />

      {/* Tree 3 — broken/fallen */}
      <path d="M700 170 Q703 148 700 130" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
      <path d="M700 130 Q695 120 698 125" fill="none" stroke="#2a2a2a" strokeWidth="0.8" />

      {/* Muddy field */}
      <path d="M0 180 Q200 175 400 178 Q600 175 800 180 L800 400 L0 400 Z"
        fill="url(#ch9_mud)" />

      {/* Mud ruts and tracks */}
      <path d="M100 210 Q200 205 300 210 Q400 208 500 212" fill="none" stroke="#201c15" strokeWidth="1" opacity="0.3" />
      <path d="M200 240 Q300 235 400 240 Q500 237 600 242" fill="none" stroke="#201c15" strokeWidth="1" opacity="0.25" />
      <path d="M50 270 Q150 265 250 270 Q350 268 400 272" fill="none" stroke="#201c15" strokeWidth="0.8" opacity="0.2" />

      {/* Puddles — reflecting grey sky */}
      <ellipse cx="300" cy="230" rx="50" ry="8" fill="url(#ch9_puddle)" />
      <ellipse cx="550" cy="260" rx="40" ry="6" fill="url(#ch9_puddle)" />
      <ellipse cx="150" cy="280" rx="35" ry="5" fill="url(#ch9_puddle)" />
      <ellipse cx="650" cy="290" rx="30" ry="5" fill="url(#ch9_puddle)" />
      {/* Ripples from rain in puddles */}
      <circle cx="290" cy="228" r="3" fill="none" stroke="#3a3a40" strokeWidth="0.3" opacity="0.3">
        <animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="310" cy="232" r="2" fill="none" stroke="#3a3a40" strokeWidth="0.3" opacity="0.25">
        <animate attributeName="r" values="2;6;2" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="545" cy="258" r="2.5" fill="none" stroke="#3a3a40" strokeWidth="0.3" opacity="0.2">
        <animate attributeName="r" values="2.5;7;2.5" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Broken equipment scattered */}
      {/* Wheel */}
      <circle cx="400" cy="250" r="10" fill="none" stroke="#2a2520" strokeWidth="1.5" opacity="0.5" />
      <line x1="400" y1="240" x2="400" y2="260" stroke="#2a2520" strokeWidth="0.8" opacity="0.4" />
      <line x1="390" y1="250" x2="410" y2="250" stroke="#2a2520" strokeWidth="0.8" opacity="0.4" />

      {/* Musket in mud */}
      <line x1="440" y1="255" x2="470" y2="250" stroke="#252018" strokeWidth="1.5" opacity="0.5" />

      {/* Tattered cloth */}
      <path d="M500 245 Q505 240 510 245 Q515 240 520 246" fill="none" stroke="#3a3535" strokeWidth="1" opacity="0.4" />

      {/* Soldiers — defeated, huddled */}
      {/* Group huddled together */}
      <path d="M320 285 Q318 275 320 268 Q322 264 324 268 L326 285 Z" fill="#151512" opacity="0.8" />
      <circle cx="322" cy="263" r="4" fill="#151512" opacity="0.8" />
      <path d="M332 288 Q330 278 332 272 Q334 268 336 272 L338 288 Z" fill="#151512" opacity="0.75" />
      <circle cx="334" cy="267" r="3.5" fill="#151512" opacity="0.75" />
      {/* Soldier on ground */}
      <path d="M355 295 Q365 292 380 294 Q385 296 380 298 Q365 300 355 298 Z"
        fill="#151512" opacity="0.6" />

      {/* Seated soldier, head in hands */}
      <path d="M600 280 Q598 272 600 266 Q602 272 604 280 Z" fill="#151512" opacity="0.7" />
      <circle cx="601" cy="262" r="4" fill="#151512" opacity="0.7" />

      {/* Rain layers */}
      <rect width="800" height="400" fill="url(#ch9_rain)" />
      <rect width="800" height="400" fill="url(#ch9_heavyRain)" />

      {/* Additional diagonal rain streaks */}
      <line x1="50" y1="0" x2="30" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.12" />
      <line x1="180" y1="0" x2="160" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="320" y1="0" x2="300" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.12" />
      <line x1="460" y1="0" x2="440" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="600" y1="0" x2="580" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.12" />
      <line x1="740" y1="0" x2="720" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />

      {/* Dark vignette — heaviest of all scenes */}
      <rect x="0" y="0" width="800" height="50" fill="#1a1a1e" opacity="0.3" />
      <rect x="0" y="360" width="800" height="40" fill="#0a0a0c" opacity="0.5" />
      <rect width="800" height="400" fill="#1a1a1e" opacity="0.08" />
    </svg>
  );
}
