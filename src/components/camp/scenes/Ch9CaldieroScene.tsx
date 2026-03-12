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
        {/* Grey daylight sky — oppressive, leaden. Darkest scene. */}
        <linearGradient id="ch9_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18181c" />
          <stop offset="20%" stopColor="#1e1e22" />
          <stop offset="40%" stopColor="#242428" />
          <stop offset="60%" stopColor="#2a2a2e" />
          <stop offset="80%" stopColor="#303035" />
          <stop offset="100%" stopColor="#38383c" />
        </linearGradient>
        {/* Mud ground — dark brown-grey */}
        <linearGradient id="ch9_mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#282420" />
          <stop offset="30%" stopColor="#25201a" />
          <stop offset="60%" stopColor="#221e16" />
          <stop offset="100%" stopColor="#1a1812" />
        </linearGradient>
        {/* Puddle — reflecting grey sky */}
        <linearGradient id="ch9_puddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303035" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#252528" stopOpacity="0.4" />
        </linearGradient>
        {/* Rain pattern — diagonal */}
        <pattern id="ch9_rain" width="15" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
          <line x1="7" y1="0" x2="5" y2="30" stroke="#4a4a55" strokeWidth="0.5" opacity="0.22" />
        </pattern>
        {/* Heavy rain pattern — wider spacing */}
        <pattern id="ch9_heavyRain" width="25" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <line x1="12" y1="0" x2="8" y2="50" stroke="#4a4a55" strokeWidth="0.7" opacity="0.13" />
        </pattern>
        {/* Foreground rain — closer, thicker */}
        <pattern id="ch9_fgRain" width="35" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <line x1="17" y1="0" x2="12" y2="60" stroke="#50505a" strokeWidth="0.8" opacity="0.1" />
        </pattern>
        {/* Dark vignette */}
        <radialGradient id="ch9_vignette" cx="0.5" cy="0.5" r="0.65">
          <stop offset="40%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* === LEADEN SKY === */}
      <rect width="800" height="400" fill="url(#ch9_sky)" />

      {/* Low, heavy clouds — oppressive */}
      <ellipse cx="150" cy="30" rx="220" ry="22" fill="#202025" opacity="0.5" />
      <ellipse cx="400" cy="20" rx="250" ry="18" fill="#1e1e23" opacity="0.45" />
      <ellipse cx="650" cy="35" rx="200" ry="20" fill="#202025" opacity="0.4" />
      <ellipse cx="300" cy="50" rx="180" ry="15" fill="#1e1e23" opacity="0.35" />
      <ellipse cx="550" cy="45" rx="220" ry="18" fill="#202025" opacity="0.35" />
      <ellipse cx="100" cy="65" rx="150" ry="14" fill="#1e1e23" opacity="0.3" />
      <ellipse cx="700" cy="60" rx="160" ry="12" fill="#202025" opacity="0.3" />
      {/* Even more clouds — solid overcast */}
      <ellipse cx="400" cy="75" rx="300" ry="12" fill="#222228" opacity="0.25" />
      <ellipse cx="200" cy="90" rx="180" ry="10" fill="#222228" opacity="0.2" />

      {/* === BARE HILLS — featureless, bleak === */}
      <path d="M0 138 Q80 125 160 132 Q240 122 320 130 Q400 120 480 128 Q560 118 640 125 Q720 120 800 132 L800 175 L0 175 Z"
        fill="#1e1e22" opacity="0.5" />

      {/* === BARE TREES — skeletal, leafless, broken === */}
      {/* Tree 1 — tall, twisted */}
      <path d="M175 178 Q178 150 182 125 Q184 110 185 100" fill="none" stroke="#252525" strokeWidth="2.5" />
      <path d="M185 100 Q192 85 196 92" fill="none" stroke="#252525" strokeWidth="1.2" />
      <path d="M185 100 Q178 88 175 95" fill="none" stroke="#252525" strokeWidth="1" />
      <path d="M183 118 Q175 108 172 114" fill="none" stroke="#252525" strokeWidth="0.8" />
      <path d="M183 118 Q190 110 192 116" fill="none" stroke="#252525" strokeWidth="0.7" />
      <path d="M184 135 Q190 128 193 132" fill="none" stroke="#252525" strokeWidth="0.6" />
      {/* Bent by wind */}
      <path d="M196 90 Q202 82 206 88" fill="none" stroke="#252525" strokeWidth="0.5" opacity="0.5" />

      {/* Tree 2 — further away */}
      <path d="M540 172 Q543 148 546 128 Q548 118 549 110" fill="none" stroke="#252525" strokeWidth="2" />
      <path d="M549 110 Q555 98 557 106" fill="none" stroke="#252525" strokeWidth="0.9" />
      <path d="M549 110 Q543 100 541 107" fill="none" stroke="#252525" strokeWidth="0.7" />
      <path d="M547 125 Q540 118 538 123" fill="none" stroke="#252525" strokeWidth="0.6" />
      <path d="M547 125 Q553 120 555 124" fill="none" stroke="#252525" strokeWidth="0.5" />

      {/* Tree 3 — broken/fallen halfway */}
      <path d="M690 170 Q693 150 691 135" fill="none" stroke="#252525" strokeWidth="1.8" />
      <path d="M691 135 Q688 125 690 128" fill="none" stroke="#252525" strokeWidth="0.7" />
      {/* Broken branch on ground */}
      <path d="M685 175 Q680 172 672 175" fill="none" stroke="#252525" strokeWidth="0.8" opacity="0.4" />

      {/* === MUDDY FIELD === */}
      <path d="M0 175 Q200 172 400 175 Q600 172 800 175 L800 400 L0 400 Z"
        fill="url(#ch9_mud)" />

      {/* Mud ruts and wagon tracks */}
      <path d="M80 208 Q180 202 280 208 Q380 204 480 210 Q560 206 640 212"
        fill="none" stroke="#1e1a14" strokeWidth="1.2" opacity="0.3" />
      <path d="M80 214 Q180 208 280 214 Q380 210 480 216 Q560 212 640 218"
        fill="none" stroke="#1e1a14" strokeWidth="1" opacity="0.25" />
      <path d="M150 238 Q250 232 350 238 Q450 234 550 240"
        fill="none" stroke="#1e1a14" strokeWidth="0.8" opacity="0.2" />
      <path d="M200 260 Q280 256 360 260 Q440 256 520 262"
        fill="none" stroke="#1e1a14" strokeWidth="0.7" opacity="0.18" />

      {/* === PUDDLES — reflecting grey sky === */}
      <ellipse cx="280" cy="228" rx="55" ry="8" fill="url(#ch9_puddle)" />
      <ellipse cx="520" cy="255" rx="45" ry="7" fill="url(#ch9_puddle)" />
      <ellipse cx="140" cy="275" rx="38" ry="5.5" fill="url(#ch9_puddle)" />
      <ellipse cx="650" cy="288" rx="35" ry="5" fill="url(#ch9_puddle)" />
      <ellipse cx="400" cy="295" rx="42" ry="6" fill="url(#ch9_puddle)" />

      {/* Rain ripples in puddles */}
      <circle cx="270" cy="226" r="3" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.25">
        <animate attributeName="r" values="3;8;3" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="295" cy="230" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.2">
        <animate attributeName="r" values="2;6;2" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="515" cy="253" r="2.5" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.2">
        <animate attributeName="r" values="2.5;7;2.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="535" cy="258" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.15">
        <animate attributeName="r" values="2;5;2" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="395" cy="293" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.18">
        <animate attributeName="r" values="2;6;2" dur="1.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0;0.18" dur="1.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="410" cy="298" r="1.5" fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.12">
        <animate attributeName="r" values="1.5;4;1.5" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* === BROKEN EQUIPMENT scattered in mud === */}
      {/* Overturned cart wheel */}
      <circle cx="380" cy="248" r="12" fill="none" stroke="#221e18" strokeWidth="1.5" opacity="0.45" />
      <line x1="380" y1="236" x2="380" y2="260" stroke="#221e18" strokeWidth="0.8" opacity="0.35" />
      <line x1="368" y1="248" x2="392" y2="248" stroke="#221e18" strokeWidth="0.8" opacity="0.35" />
      <path d="M380 248 L388 241" fill="none" stroke="#221e18" strokeWidth="0.6" opacity="0.25" />
      <path d="M380 248 L372 256" fill="none" stroke="#221e18" strokeWidth="0.6" opacity="0.25" />

      {/* Musket half-buried in mud */}
      <line x1="430" y1="258" x2="462" y2="252" stroke="#22201a" strokeWidth="1.5" opacity="0.4" />
      {/* Bayonet tip sticking up */}
      <line x1="462" y1="252" x2="465" y2="245" stroke="#2a2a28" strokeWidth="1" opacity="0.3" />

      {/* Torn pack */}
      <path d="M488 268 Q495 262 502 268 Q505 274 498 278 Q490 274 488 268" fill="#221e18" opacity="0.35" />

      {/* Canteen on its side */}
      <ellipse cx="335" cy="270" rx="5" ry="3.5" fill="none" stroke="#2a2520" strokeWidth="0.8" opacity="0.35" transform="rotate(-15 335 270)" />

      {/* Tattered cloth caught on something */}
      <path d="M580 242 Q585 238 590 243 Q595 238 600 244 Q605 240 608 245"
        fill="none" stroke="#2a2828" strokeWidth="0.8" opacity="0.3" />

      {/* === DEFEATED SOLDIERS — huddled, broken === */}
      {/* Group 1 — huddled together by tree */}
      <path d="M200 290 Q198 278 200 270 Q202 265 204 270 L206 290 Z" fill="#131312" opacity="0.8" />
      <circle cx="202" cy="265" r="4.5" fill="#131312" opacity="0.8" />
      <path d="M215 292 Q213 280 215 273 Q217 268 219 273 L221 292 Z" fill="#131312" opacity="0.75" />
      <circle cx="217" cy="268" r="4" fill="#131312" opacity="0.75" />
      <path d="M228 295 Q226 283 228 276 Q230 283 232 295 Z" fill="#131312" opacity="0.65" />
      <circle cx="229" cy="273" r="3.5" fill="#131312" opacity="0.65" />

      {/* Soldier on ground — wounded/exhausted */}
      <path d="M315 300 Q325 296 345 298 Q352 301 345 304 Q325 308 315 305 Q310 302 315 300 Z"
        fill="#131312" opacity="0.55" />
      {/* Head */}
      <circle cx="312" cy="300" r="4" fill="#131312" opacity="0.5" />

      {/* Seated soldier, head bowed */}
      <path d="M450 290 Q448 280 450 274 Q452 280 454 290 Z" fill="#131312" opacity="0.65" />
      <circle cx="451" cy="271" r="3.5" fill="#131312" opacity="0.65" />
      {/* Arms on knees */}
      <path d="M447 282 Q445 278 448 276" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />

      {/* Standing soldier — barely, leaning on musket */}
      <path d="M600 265 Q598 253 600 245 Q602 240 604 245 L606 265 Q605 275 604 285 L600 285 Z"
        fill="#131312" opacity="0.7" />
      <circle cx="602" cy="240" r="4.5" fill="#131312" opacity="0.7" />
      {/* Musket as crutch */}
      <line x1="608" y1="238" x2="610" y2="288" stroke="#131312" strokeWidth="1.2" opacity="0.5" />

      {/* Distant retreating figures */}
      <path d="M700 240 Q698 234 700 230 Q702 234 704 240 Z" fill="#1a1a1e" opacity="0.35" />
      <path d="M712 238 Q710 232 712 228 Q714 232 716 238 Z" fill="#1a1a1e" opacity="0.3" />
      <path d="M728 240 Q726 234 728 230 Q730 234 732 240 Z" fill="#1a1a1e" opacity="0.25" />

      {/* === RAIN OVERLAYS — three layers for depth === */}
      <rect width="800" height="400" fill="url(#ch9_rain)" />
      <rect width="800" height="400" fill="url(#ch9_heavyRain)" />
      <rect width="800" height="400" fill="url(#ch9_fgRain)" />

      {/* Extra diagonal rain streaks — individual */}
      <line x1="50" y1="0" x2="30" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="150" y1="0" x2="130" y2="400" stroke="#4a4a50" strokeWidth="0.3" opacity="0.08" />
      <line x1="280" y1="0" x2="260" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="400" y1="0" x2="380" y2="400" stroke="#4a4a50" strokeWidth="0.3" opacity="0.08" />
      <line x1="530" y1="0" x2="510" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="660" y1="0" x2="640" y2="400" stroke="#4a4a50" strokeWidth="0.3" opacity="0.08" />
      <line x1="760" y1="0" x2="740" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Dark vignette — heaviest of all scenes */}
      <rect width="800" height="400" fill="url(#ch9_vignette)" />

      {/* Top/bottom extra darkening */}
      <rect x="0" y="0" width="800" height="40" fill="#18181c" opacity="0.3" />
      <rect x="0" y="365" width="800" height="35" fill="#0a0a0c" opacity="0.45" />

      {/* Grey tint overlay */}
      <rect width="800" height="400" fill="#1a1a1e" opacity="0.06" />
    </svg>
  );
}
