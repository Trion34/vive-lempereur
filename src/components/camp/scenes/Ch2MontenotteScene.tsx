import React from 'react';

/**
 * Ch.2 — Montenotte, mountain ravine
 * Night, rain/fog. Steep ravines, fog drifting through trees,
 * small fires in a narrow valley, rain streaks, dark mountains looming.
 * Stream flowing at the ravine bottom. Distant lightning.
 * Mood: Tense, first-battle nerves.
 */
export function Ch2MontenotteScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Dark rainy night sky */}
        <linearGradient id="ch2_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0c12" />
          <stop offset="30%" stopColor="#101420" />
          <stop offset="50%" stopColor="#121620" />
          <stop offset="100%" stopColor="#1a1e28" />
        </linearGradient>
        {/* Far mountain — deepest layer */}
        <linearGradient id="ch2_farMtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1e28" />
          <stop offset="100%" stopColor="#222830" />
        </linearGradient>
        {/* Mid mountain */}
        <linearGradient id="ch2_midMtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c2028" />
          <stop offset="100%" stopColor="#24292e" />
        </linearGradient>
        {/* Near mountain — closest ravine walls */}
        <linearGradient id="ch2_nearMtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2228" />
          <stop offset="100%" stopColor="#252a30" />
        </linearGradient>
        {/* Valley floor */}
        <linearGradient id="ch2_valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2018" />
          <stop offset="100%" stopColor="#151a15" />
        </linearGradient>
        {/* Fog gradient */}
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
        {/* Fire glow — warm light on ground */}
        <radialGradient id="ch2_fireWarm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c09050" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Rain pattern — standard diagonal */}
        <pattern id="ch2_rain" width="20" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-4)">
          <line x1="10" y1="0" x2="8" y2="40" stroke="#5a6070" strokeWidth="0.4" opacity="0.2" />
        </pattern>
        {/* Heavy rain pattern — wider spacing */}
        <pattern id="ch2_heavyRain" width="30" height="55" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">
          <line x1="15" y1="0" x2="11" y2="55" stroke="#5a6070" strokeWidth="0.6" opacity="0.12" />
        </pattern>
        {/* Foreground rain — closer, thicker */}
        <pattern id="ch2_fgRain" width="40" height="65" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
          <line x1="20" y1="0" x2="15" y2="65" stroke="#606878" strokeWidth="0.7" opacity="0.08" />
        </pattern>
        {/* Tree gradient */}
        <linearGradient id="ch2_tree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2520" />
          <stop offset="100%" stopColor="#151e18" />
        </linearGradient>
        {/* Stream water */}
        <linearGradient id="ch2_stream" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2530" stopOpacity="0" />
          <stop offset="20%" stopColor="#1a2530" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#1e2a35" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#1a2530" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a2530" stopOpacity="0" />
        </linearGradient>
        {/* Stream shimmer */}
        <linearGradient id="ch2_shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4a5a" stopOpacity="0" />
          <stop offset="50%" stopColor="#3a4a5a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3a4a5a" stopOpacity="0" />
        </linearGradient>
        {/* Lightning flash */}
        <radialGradient id="ch2_lightning" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#c0c8e0" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#8090b0" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#8090b0" stopOpacity="0" />
        </radialGradient>
        {/* Radial vignette */}
        <radialGradient id="ch2_vignette" cx="0.5" cy="0.5" r="0.65">
          <stop offset="40%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch2_sky)" />

      {/* Distant lightning flash — brief, illuminates clouds */}
      <rect width="800" height="400" fill="url(#ch2_lightning)">
        <animate attributeName="opacity" values="0;0;0;0.6;0;0.3;0;0;0;0;0;0;0;0;0;0" dur="8s" repeatCount="indefinite" />
      </rect>

      {/* Low storm clouds */}
      <ellipse cx="200" cy="30" rx="180" ry="15" fill="#141820" opacity="0.4" />
      <ellipse cx="500" cy="22" rx="200" ry="12" fill="#12161e" opacity="0.35" />
      <ellipse cx="700" cy="38" rx="150" ry="14" fill="#141820" opacity="0.3" />

      {/* === MOUNTAINS — 3 depth layers === */}

      {/* Far mountains — deepest, most muted */}
      <path d="M0 120 Q50 80 120 100 Q180 60 250 90 Q300 70 350 95 Q400 55 450 85 Q520 50 580 80 Q640 60 700 90 Q750 70 800 100 L800 180 L0 180 Z"
        fill="url(#ch2_farMtn)" opacity="0.7" />

      {/* Mid mountains — middle depth */}
      <path d="M0 145 Q70 110 150 135 Q210 95 290 125 Q340 105 400 130 Q460 95 530 120 Q600 90 680 118 Q740 100 800 125 L800 200 L0 200 Z"
        fill="url(#ch2_midMtn)" opacity="0.85" />

      {/* Near mountains — ravine walls, steep */}
      <path d="M0 170 Q60 130 140 160 Q200 120 280 150 Q320 130 360 155 L360 280 L0 280 Z"
        fill="url(#ch2_nearMtn)" opacity="0.95" />
      <path d="M440 150 Q500 120 560 145 Q620 110 700 140 Q750 125 800 150 L800 280 L440 280 Z"
        fill="url(#ch2_nearMtn)" opacity="0.95" />

      {/* Rocky outcrop details on left wall */}
      <path d="M280 180 Q290 170 300 178 Q310 172 320 180 L320 210 L280 210 Z" fill="#222830" opacity="0.6" />
      <path d="M100 190 L115 175 L130 185 L130 210 L100 210 Z" fill="#1e2428" opacity="0.5" />
      <path d="M190 170 Q200 158 215 168 L215 195 L190 195 Z" fill="#202830" opacity="0.55" />

      {/* Rocky outcrop details on right wall */}
      <path d="M480 175 Q490 162 505 172 L505 200 L480 200 Z" fill="#222830" opacity="0.6" />
      <path d="M600 165 L615 152 L630 163 L630 195 L600 195 Z" fill="#1e2428" opacity="0.55" />
      <path d="M700 170 Q712 158 725 168 L725 200 L700 200 Z" fill="#202830" opacity="0.5" />

      {/* Narrow valley between walls */}
      <path d="M300 200 Q350 180 400 190 Q450 180 500 200 L500 400 L300 400 Z"
        fill="url(#ch2_valley)" />

      {/* Valley floor extension */}
      <path d="M0 260 Q100 240 200 250 Q300 240 400 245 Q500 240 600 250 Q700 242 800 255 L800 400 L0 400 Z"
        fill="url(#ch2_valley)" />

      {/* === PINE TREES ON RIDGES — silhouettes === */}

      {/* Far ridge trees — small, distant */}
      <path d="M50 115 L55 92 L60 115" fill="#141c18" opacity="0.5" />
      <path d="M180 95 L185 72 L190 95" fill="#141c18" opacity="0.45" />
      <path d="M310 90 L314 70 L318 90" fill="#141c18" opacity="0.4" />
      <path d="M480 88 L484 68 L488 88" fill="#141c18" opacity="0.4" />
      <path d="M620 92 L624 72 L628 92" fill="#141c18" opacity="0.45" />
      <path d="M750 98 L754 78 L758 98" fill="#141c18" opacity="0.5" />

      {/* Left ridge trees — mid layer */}
      <path d="M80 155 L85 130 L90 155" fill="url(#ch2_tree)" />
      <path d="M83 140 L85 120 L87 140" fill="url(#ch2_tree)" />
      <path d="M130 150 L136 122 L142 150" fill="url(#ch2_tree)" />
      <path d="M133 135 L136 112 L139 135" fill="url(#ch2_tree)" />
      <path d="M200 140 L205 115 L210 140" fill="url(#ch2_tree)" />
      <path d="M203 128 L205 108 L207 128" fill="url(#ch2_tree)" />
      <path d="M250 148 L256 120 L262 148" fill="url(#ch2_tree)" />

      {/* Right ridge trees */}
      <path d="M520 142 L526 115 L532 142" fill="url(#ch2_tree)" />
      <path d="M523 128 L526 105 L529 128" fill="url(#ch2_tree)" />
      <path d="M570 138 L575 112 L580 138" fill="url(#ch2_tree)" />
      <path d="M600 135 L605 110 L610 135" fill="url(#ch2_tree)" />
      <path d="M650 140 L656 112 L662 140" fill="url(#ch2_tree)" />
      <path d="M720 132 L725 108 L730 132" fill="url(#ch2_tree)" />
      <path d="M723 120 L725 100 L727 120" fill="url(#ch2_tree)" />
      <path d="M765 145 L770 118 L775 145" fill="url(#ch2_tree)" />

      {/* Valley trees — closer, darker */}
      <path d="M340 230 L346 200 L352 230" fill="#121a15" />
      <path d="M343 215 L346 190 L349 215" fill="#121a15" />
      <path d="M450 225 L455 198 L460 225" fill="#121a15" />
      <path d="M410 238 L415 210 L420 238" fill="#121a15" opacity="0.9" />
      <path d="M413 224 L415 200 L417 224" fill="#121a15" opacity="0.9" />

      {/* === STREAM at ravine bottom === */}
      <path d="M300 305 Q340 302 380 305 Q420 303 460 306 Q500 303 540 305"
        fill="none" stroke="url(#ch2_stream)" strokeWidth="8" opacity="0.5" />
      {/* Stream shimmer — animated reflection */}
      <ellipse cx="380" cy="305" rx="40" ry="2" fill="url(#ch2_shimmer)">
        <animate attributeName="cx" values="380;400;380" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="304" rx="30" ry="1.5" fill="url(#ch2_shimmer)">
        <animate attributeName="cx" values="450;435;450" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Rain ripples in stream */}
      <circle cx="370" cy="304" r="2" fill="none" stroke="#3a4a5a" strokeWidth="0.3" opacity="0.15">
        <animate attributeName="r" values="2;5;2" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="420" cy="305" r="1.5" fill="none" stroke="#3a4a5a" strokeWidth="0.3" opacity="0.12">
        <animate attributeName="r" values="1.5;4;1.5" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="470" cy="304" r="1.5" fill="none" stroke="#3a4a5a" strokeWidth="0.2" opacity="0.1">
        <animate attributeName="r" values="1.5;3.5;1.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0;0.1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* === CAMPFIRES in valley === */}

      {/* Fire 1 — main fire, largest */}
      <ellipse cx="380" cy="285" rx="30" ry="10" fill="url(#ch2_fireWarm)" />
      <ellipse cx="380" cy="285" rx="25" ry="8" fill="url(#ch2_fireGlow)">
        <animate attributeName="rx" values="25;28;25" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="380" cy="285" rx="3" ry="1.5" fill="#d09050" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Flame */}
      <path d="M378 283 Q380 276 382 283" fill="#c08040" opacity="0.5">
        <animate attributeName="d" values="M378 283 Q380 276 382 283;M378 283 Q381 275 382 283;M378 283 Q380 276 382 283" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Sparks */}
      <circle cx="381" cy="278" r="0.5" fill="#d0a060" opacity="0.4">
        <animate attributeName="cy" values="278;272;278" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Fire 2 — second group */}
      <ellipse cx="420" cy="270" rx="20" ry="7" fill="url(#ch2_fireWarm)" />
      <ellipse cx="420" cy="270" rx="15" ry="5" fill="url(#ch2_fireGlow)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="420" cy="270" r="1.5" fill="#c08040" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <path d="M418 268 Q420 262 422 268" fill="#b07040" opacity="0.35">
        <animate attributeName="d" values="M418 268 Q420 262 422 268;M418 268 Q421 261 422 268;M418 268 Q420 262 422 268" dur="0.7s" repeatCount="indefinite" />
      </path>

      {/* Fire 3 — further back, smaller */}
      <ellipse cx="460" cy="255" rx="12" ry="4" fill="url(#ch2_fireWarm)" opacity="0.5" />
      <circle cx="460" cy="255" r="2" fill="#a07040" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M459 253 Q460 249 461 253" fill="#a07040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="0.8s" repeatCount="indefinite" />
      </path>

      {/* Fire 4 — distant, faint */}
      <ellipse cx="350" cy="295" rx="10" ry="3.5" fill="url(#ch2_fireWarm)" opacity="0.35" />
      <circle cx="350" cy="295" r="1.5" fill="#a07040" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.08;0.2" dur="2.8s" repeatCount="indefinite" />
      </circle>

      {/* === SOLDIER SILHOUETTES — first-battle nerves === */}

      {/* Group around Fire 1 — huddled, tense */}
      {/* Standing soldier — arms crossed, stiff */}
      <path d="M365 275 Q363 262 366 255 Q368 250 370 255 L372 275 Z" fill="#0a0c08" opacity="0.8" />
      <circle cx="368" cy="250" r="4" fill="#0a0c08" opacity="0.8" />
      {/* Standing soldier — facing fire */}
      <path d="M390 275 Q388 265 390 258 Q392 253 394 258 L396 275 Z" fill="#0a0c08" opacity="0.8" />
      <circle cx="392" cy="253" r="4" fill="#0a0c08" opacity="0.8" />
      {/* Seated soldier — hunched over, head bowed */}
      <path d="M375 282 Q373 272 378 268 Q382 272 380 282 Z" fill="#0a0c08" opacity="0.7" />
      <circle cx="378" cy="265" r="3" fill="#0a0c08" opacity="0.65" />

      {/* Pacing soldier near Fire 1 — restless */}
      <path d="M400 277 Q398 268 400 262 Q402 258 404 262 L406 277 Z" fill="#0a0c08" opacity="0.65" />
      <circle cx="402" cy="257" r="3.5" fill="#0a0c08" opacity="0.65" />
      {/* Musket held loosely */}
      <line x1="406" y1="256" x2="408" y2="277" stroke="#0a0c08" strokeWidth="0.8" opacity="0.4" />

      {/* Soldiers around Fire 2 */}
      {/* Crouching, warming hands */}
      <path d="M410 265 Q408 258 412 254 Q416 258 414 265 Z" fill="#0a0c08" opacity="0.7" />
      <circle cx="412" cy="251" r="3" fill="#0a0c08" opacity="0.65" />
      {/* Arms extended toward fire */}
      <path d="M414 257 Q417 255 419 257" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.4" />
      {/* Seated, back to viewer */}
      <path d="M430 264 Q428 256 432 252 Q436 256 434 264 Z" fill="#0a0c08" opacity="0.6" />
      <circle cx="432" cy="249" r="3" fill="#0a0c08" opacity="0.55" />

      {/* Isolated soldier by Fire 4 — sitting alone, knees up */}
      <path d="M345 290 Q343 282 347 278 Q351 282 349 290 Z" fill="#0a0c08" opacity="0.6" />
      <circle cx="347" cy="275" r="3" fill="#0a0c08" opacity="0.55" />
      {/* Arms on knees */}
      <path d="M343 284 Q341 280 344 278" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.35" />

      {/* Standing sentry — at edge of light, near right wall */}
      <path d="M480 258 Q478 245 480 238 Q482 233 484 238 L486 258 Q485 265 484 272 L480 272 Z"
        fill="#0a0c08" opacity="0.7" />
      <circle cx="482" cy="233" r="4.5" fill="#0a0c08" opacity="0.7" />
      {/* Musket on shoulder */}
      <line x1="487" y1="232" x2="490" y2="215" stroke="#0a0c08" strokeWidth="1" opacity="0.5" />

      {/* Pacing soldier — distant, between fires */}
      <path d="M440 260 Q438 252 440 247 Q442 243 444 247 L446 260 Z" fill="#0a0c08" opacity="0.45" />
      <circle cx="442" cy="243" r="3" fill="#0a0c08" opacity="0.4" />

      {/* === BAT silhouette in sky === */}
      <g opacity="0.3">
        <path d="M580 55 Q575 48 568 50 Q572 45 575 47 L580 42 L585 47 Q588 45 592 50 Q585 48 580 55 Z"
          fill="#0a0c12">
          <animate attributeName="transform" type="translate" values="0,0;-15,-3;-30,0;-15,3;0,0" dur="6s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Owl silhouette — perched on distant ridge */}
      <g opacity="0.25" transform="translate(260, 118)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="3.5" ry="5" fill="#0a0c12" />
        {/* Ear tufts */}
        <path d="M-2 -5 L-3 -8 L-1 -5" fill="#0a0c12" />
        <path d="M2 -5 L3 -8 L1 -5" fill="#0a0c12" />
        {/* Eyes — faint glow */}
        <circle cx="-1" cy="-1.5" r="0.6" fill="#3a4050" opacity="0.5" />
        <circle cx="1" cy="-1.5" r="0.6" fill="#3a4050" opacity="0.5" />
      </g>

      {/* === FOG drifting through trees — 6 animated layers === */}
      <ellipse cx="350" cy="210" rx="120" ry="15" fill="#3a4050" opacity="0.12">
        <animate attributeName="cx" values="350;380;350" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.18;0.12" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="240" rx="100" ry="12" fill="#3a4050" opacity="0.1">
        <animate attributeName="cx" values="500;470;500" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.15;0.1" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="200" cy="190" rx="80" ry="10" fill="#3a4050" opacity="0.08">
        <animate attributeName="cx" values="200;230;200" dur="14s" repeatCount="indefinite" />
      </ellipse>
      {/* Low fog near stream */}
      <ellipse cx="400" cy="298" rx="140" ry="12" fill="#3a4555" opacity="0.1">
        <animate attributeName="cx" values="400;420;400" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.16;0.1" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Fog rising from ravine */}
      <ellipse cx="300" cy="250" rx="60" ry="18" fill="#3a4050" opacity="0.07">
        <animate attributeName="cy" values="250;242;250" dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.12;0.07" dur="11s" repeatCount="indefinite" />
      </ellipse>
      {/* High fog wisps near peaks */}
      <ellipse cx="650" cy="150" rx="90" ry="8" fill="#3a4050" opacity="0.06">
        <animate attributeName="cx" values="650;680;650" dur="15s" repeatCount="indefinite" />
      </ellipse>

      {/* === RAIN OVERLAYS — three layers for depth === */}
      <rect width="800" height="400" fill="url(#ch2_rain)" />
      <rect width="800" height="400" fill="url(#ch2_heavyRain)" />
      <rect width="800" height="400" fill="url(#ch2_fgRain)" />

      {/* Extra diagonal rain streaks — individual */}
      <line x1="60" y1="0" x2="40" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.12" />
      <line x1="160" y1="0" x2="140" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.1" />
      <line x1="280" y1="0" x2="260" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.12" />
      <line x1="400" y1="0" x2="380" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.15" />
      <line x1="520" y1="0" x2="500" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.1" />
      <line x1="630" y1="0" x2="610" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.12" />
      <line x1="740" y1="0" x2="720" y2="400" stroke="#4a5565" strokeWidth="0.3" opacity="0.1" />

      {/* === FOREGROUND — close rocks and mud === */}
      <path d="M0 360 Q40 350 80 355 Q120 358 160 352 L160 400 L0 400 Z" fill="#121815" />
      <path d="M650 355 Q700 348 750 352 Q780 356 800 350 L800 400 L650 400 Z" fill="#121815" />
      {/* Additional foreground rocks */}
      <path d="M160 365 Q190 358 220 362 L220 400 L160 400 Z" fill="#111714" opacity="0.8" />
      <path d="M580 362 Q610 355 650 358 L650 400 L580 400 Z" fill="#111714" opacity="0.8" />

      {/* === ATMOSPHERIC OVERLAYS === */}

      {/* Radial vignette — deep, claustrophobic ravine feel */}
      <rect width="800" height="400" fill="url(#ch2_vignette)" />

      {/* Top/bottom extra darkening */}
      <rect x="0" y="0" width="800" height="40" fill="#0a0c12" opacity="0.35" />
      <rect x="0" y="370" width="800" height="30" fill="#0a0c12" opacity="0.45" />

      {/* Cold rain tint */}
      <rect width="800" height="400" fill="#1a1e28" opacity="0.04" />
    </svg>
  );
}
