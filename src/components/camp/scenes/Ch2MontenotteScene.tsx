import React from 'react';

/**
 * Ch.2 — Montenotte, mountain ravine
 * Night, rain/fog. Steep ravines, fog drifting through trees,
 * small fires in a narrow valley, rain streaks, dark mountains looming.
 * Stream flowing at the ravine bottom. Distant lightning.
 * Mood: Tense, first-battle nerves — but also the first victory glow.
 *
 * Enhanced with: bayonet inspection, officer's map, ammunition distribution,
 * distant drums (visual), overhanging canopy, broken fence, mountain goat,
 * additional fire details, stream stepping stones, mist pocket.
 *
 * Post-Montenotte additions: celebrating soldiers, captured Austrian flags/standards,
 * Ligurian mountain detail, spring wildflowers, pack mules, cooking fires,
 * dice games, letter-writing soldiers, birds, more tree detail, stone walls,
 * weather effects (wind-blown debris, gusts).
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
        {/* Oilcloth barrel cover gradient */}
        <linearGradient id="ch2_oilcloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2818" />
          <stop offset="100%" stopColor="#1e1c10" />
        </linearGradient>
        {/* Distant torch glow */}
        <radialGradient id="ch2_torchGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d09050" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>

        {/* === NEW GRADIENTS === */}

        {/* Bayonet glint — bright specular highlight */}
        <linearGradient id="ch2_bayonetGlint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0d8c0" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#a09880" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#606050" stopOpacity="0" />
        </linearGradient>
        {/* Map parchment — warm lit surface */}
        <linearGradient id="ch2_mapParchment" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a5838" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4a3a22" stopOpacity="0.45" />
        </linearGradient>
        {/* Map fire reflection — warm glow on the paper */}
        <radialGradient id="ch2_mapGlow" cx="0.3" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#c09050" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Ammunition crate wood */}
        <linearGradient id="ch2_crateWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2418" />
          <stop offset="100%" stopColor="#201a10" />
        </linearGradient>
        {/* Drum sound wave — subtle concentric ring fill */}
        <radialGradient id="ch2_drumWave" cx="0.5" cy="0.5" r="0.5">
          <stop offset="60%" stopColor="#3a4050" stopOpacity="0" />
          <stop offset="80%" stopColor="#4a5060" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#3a4050" stopOpacity="0" />
        </radialGradient>
        {/* Stepping stone — wet rock */}
        <radialGradient id="ch2_stoneWet" cx="0.4" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#2a3038" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1e2428" stopOpacity="0.5" />
        </radialGradient>
        {/* Dense mist pocket */}
        <radialGradient id="ch2_mistPocket" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3a4555" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#3a4555" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3a4555" stopOpacity="0" />
        </radialGradient>
        {/* Ember glow — hotter core */}
        <radialGradient id="ch2_emberHot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a060" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#c08040" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Face glow — firelight on skin */}
        <radialGradient id="ch2_faceGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a07040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>

        {/* === POST-MONTENOTTE GRADIENTS === */}

        {/* Austrian flag — white/red captured standard */}
        <linearGradient id="ch2_flagWhite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8c0b0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a09880" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="ch2_flagRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a2020" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#601818" stopOpacity="0.4" />
        </linearGradient>
        {/* Cooking fire — warmer, orange-heavy */}
        <radialGradient id="ch2_cookFireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a050" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#b08040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#905020" stopOpacity="0" />
        </radialGradient>
        {/* Mule hide — warm brown */}
        <linearGradient id="ch2_muleHide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2018" />
          <stop offset="100%" stopColor="#1e1810" />
        </linearGradient>
        {/* Spring wildflower — pale yellow */}
        <radialGradient id="ch2_flowerYellow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0b060" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a09040" stopOpacity="0" />
        </radialGradient>
        {/* Spring wildflower — pale violet */}
        <radialGradient id="ch2_flowerViolet" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7060a0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#504080" stopOpacity="0" />
        </radialGradient>
        {/* Stone wall mortar */}
        <linearGradient id="ch2_stoneWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a28" />
          <stop offset="100%" stopColor="#1e1e1c" />
        </linearGradient>
        {/* Cooking pot — dark iron */}
        <radialGradient id="ch2_ironPot" cx="0.3" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#282828" />
          <stop offset="100%" stopColor="#181818" />
        </radialGradient>
        {/* Letter paper — warm white in firelight */}
        <linearGradient id="ch2_letterPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a7a60" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6a5a40" stopOpacity="0.35" />
        </linearGradient>
        {/* Dice ivory */}
        <linearGradient id="ch2_diceIvory" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a09880" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#807060" stopOpacity="0.4" />
        </linearGradient>
        {/* Wine/brandy bottle glass */}
        <linearGradient id="ch2_bottleGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2818" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#101c0e" stopOpacity="0.5" />
        </linearGradient>
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

      {/* === MOUNTAIN GOAT — tiny silhouette on a distant crag === */}
      <g opacity="0.3" transform="translate(555, 72)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="3.5" ry="2" fill="#141820" />
        {/* Head — slightly raised, alert */}
        <circle cx="3.5" cy="-1.5" r="1.2" fill="#141820" />
        {/* Small horns */}
        <line x1="3.5" y1="-2.5" x2="4.5" y2="-4" stroke="#141820" strokeWidth="0.5" />
        <line x1="3.8" y1="-2.5" x2="5" y2="-3.5" stroke="#141820" strokeWidth="0.5" />
        {/* Legs — stick thin at this distance */}
        <line x1="-2" y1="2" x2="-2" y2="5" stroke="#141820" strokeWidth="0.5" />
        <line x1="-0.5" y1="2" x2="-0.5" y2="5" stroke="#141820" strokeWidth="0.5" />
        <line x1="1" y1="2" x2="1" y2="4.5" stroke="#141820" strokeWidth="0.5" />
        <line x1="2.5" y1="2" x2="2.5" y2="4.5" stroke="#141820" strokeWidth="0.5" />
      </g>

      {/* === DISTANT DRUMS — visual sound-wave rings from behind far-right ridge === */}
      <g opacity="0.35" transform="translate(700, 95)">
        {/* Ring 1 — innermost, strongest */}
        <circle cx="0" cy="0" r="6" fill="none" stroke="#4a5060" strokeWidth="0.5" opacity="0.15">
          <animate attributeName="r" values="6;14;6" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Ring 2 — mid */}
        <circle cx="0" cy="0" r="10" fill="none" stroke="#4a5060" strokeWidth="0.4" opacity="0.1">
          <animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.1;0;0.1" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        {/* Ring 3 — outermost, faintest */}
        <circle cx="0" cy="0" r="15" fill="none" stroke="#4a5060" strokeWidth="0.3" opacity="0.06">
          <animate attributeName="r" values="15;28;15" dur="3s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" values="0.06;0;0.06" dur="3s" repeatCount="indefinite" begin="1s" />
        </circle>
        {/* Second pulse — offset timing for "roll" effect */}
        <circle cx="0" cy="0" r="6" fill="none" stroke="#4a5060" strokeWidth="0.4" opacity="0.1">
          <animate attributeName="r" values="6;14;6" dur="3s" repeatCount="indefinite" begin="1.5s" />
          <animate attributeName="opacity" values="0.1;0;0.1" dur="3s" repeatCount="indefinite" begin="1.5s" />
        </circle>
        <circle cx="0" cy="0" r="10" fill="none" stroke="#4a5060" strokeWidth="0.3" opacity="0.07">
          <animate attributeName="r" values="10;22;10" dur="3s" repeatCount="indefinite" begin="2s" />
          <animate attributeName="opacity" values="0.07;0;0.07" dur="3s" repeatCount="indefinite" begin="2s" />
        </circle>
      </g>

      {/* === DISTANT TORCHES — officers moving on the mountainside === */}
      <g opacity="0.6">
        {/* Torch 1 — left slope */}
        <ellipse cx="160" cy="105" rx="4" ry="3" fill="url(#ch2_torchGlow)">
          <animate attributeName="cx" values="160;166;162;158;160" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cy" values="105;103;107;104;105" dur="14s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="160" cy="105" r="1" fill="#d0a060" opacity="0.7">
          <animate attributeName="cx" values="160;166;162;158;160" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cy" values="105;103;107;104;105" dur="14s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.5;0.7;0.4;0.7" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Torch 2 — right slope, higher */}
        <ellipse cx="640" cy="85" rx="3.5" ry="2.5" fill="url(#ch2_torchGlow)">
          <animate attributeName="cx" values="640;645;638;642;640" dur="16s" repeatCount="indefinite" />
          <animate attributeName="cy" values="85;83;87;84;85" dur="16s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="640" cy="85" r="0.8" fill="#d0a060" opacity="0.6">
          <animate attributeName="cx" values="640;645;638;642;640" dur="16s" repeatCount="indefinite" />
          <animate attributeName="cy" values="85;83;87;84;85" dur="16s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.35;0.6;0.4;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Torch 3 — far center, barely visible */}
        <ellipse cx="420" cy="72" rx="3" ry="2" fill="url(#ch2_torchGlow)" opacity="0.5">
          <animate attributeName="cx" values="420;424;418;422;420" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cy" values="72;70;74;71;72" dur="18s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="420" cy="72" r="0.6" fill="#d0a060" opacity="0.4">
          <animate attributeName="cx" values="420;424;418;422;420" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cy" values="72;70;74;71;72" dur="18s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.2;0.4;0.25;0.4" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </g>

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

      {/* === BROKEN FENCE/GATE — remnants of a mountain track fence === */}
      <g opacity="0.55" transform="translate(305, 195)">
        {/* Intact post — leaning slightly */}
        <line x1="0" y1="0" x2="-1" y2="-18" stroke="#2a2418" strokeWidth="1.8" />
        <line x1="0" y1="0" x2="1" y2="3" stroke="#2a2418" strokeWidth="2" />
        {/* Broken post — snapped off halfway */}
        <line x1="16" y1="0" x2="16" y2="-10" stroke="#2a2418" strokeWidth="1.8" />
        {/* Jagged break at top */}
        <path d="M15 -10 L16 -12 L17 -10" fill="#2a2418" />
        {/* Third post — fallen, on the ground */}
        <line x1="28" y1="1" x2="40" y2="-1" stroke="#2a2418" strokeWidth="1.5" opacity="0.5" />
        {/* Rail — hanging from intact post, broken end dangling */}
        <path d="M-1 -14 Q8 -13 16 -9" fill="none" stroke="#22200e" strokeWidth="1.2" />
        {/* Fallen rail on ground */}
        <line x1="16" y1="-1" x2="32" y2="0" stroke="#22200e" strokeWidth="1" opacity="0.4" />
        {/* Wire/rope remnant dangling from intact post */}
        <path d="M-1 -16 Q-3 -12 -2 -8" fill="none" stroke="#1e1c10" strokeWidth="0.5" opacity="0.4" />
        {/* Moss/lichen on base of intact post */}
        <ellipse cx="0" cy="1" rx="3" ry="1.5" fill="#1a2518" opacity="0.3" />
      </g>

      {/* === WOLF EYES — watching from the dark forest on left wall === */}
      <g opacity="0.6">
        <circle cx="148" cy="172" r="0.8" fill="#c0a040">
          <animate attributeName="opacity" values="0.6;0.3;0.6;0;0;0;0.6" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="152" cy="172" r="0.8" fill="#c0a040">
          <animate attributeName="opacity" values="0.6;0.3;0.6;0;0;0;0.6" dur="7s" repeatCount="indefinite" />
        </circle>
      </g>

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

      {/* === OVERHANGING CANOPY — tree branches reaching over the ravine, dripping === */}

      {/* Large branch from left wall — thick, overhanging */}
      <g opacity="0.65">
        <path d="M280 165 Q310 158 340 165 Q355 170 365 175" fill="none" stroke="#1a2520" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sub-branches */}
        <path d="M310 160 Q315 152 320 148" fill="none" stroke="#1a2520" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M330 163 Q335 156 340 154" fill="none" stroke="#1a2520" strokeWidth="1" strokeLinecap="round" />
        <path d="M350 172 Q355 165 358 162" fill="none" stroke="#1a2520" strokeWidth="0.8" strokeLinecap="round" />
        {/* Pine needle clusters */}
        <ellipse cx="320" cy="148" rx="8" ry="4" fill="#121a15" opacity="0.6" />
        <ellipse cx="340" cy="153" rx="7" ry="3.5" fill="#121a15" opacity="0.55" />
        <ellipse cx="358" cy="161" rx="6" ry="3" fill="#121a15" opacity="0.5" />
        {/* Water drips from branch tips */}
        <circle cx="320" cy="152" r="0.5" fill="#4a5a6a" opacity="0.25">
          <animate attributeName="cy" values="152;168;152" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="340" cy="156" r="0.5" fill="#4a5a6a" opacity="0.2">
          <animate attributeName="cy" values="156;172;156" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="358" cy="164" r="0.4" fill="#4a5a6a" opacity="0.2">
          <animate attributeName="cy" values="164;178;164" dur="2.0s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2.0s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Large branch from right wall — reaching across */}
      <g opacity="0.6">
        <path d="M510 160 Q490 155 470 162 Q458 168 450 173" fill="none" stroke="#1a2520" strokeWidth="2.2" strokeLinecap="round" />
        {/* Sub-branches */}
        <path d="M490 156 Q485 150 480 147" fill="none" stroke="#1a2520" strokeWidth="1" strokeLinecap="round" />
        <path d="M470 163 Q465 157 462 155" fill="none" stroke="#1a2520" strokeWidth="0.8" strokeLinecap="round" />
        {/* Pine needle clusters */}
        <ellipse cx="480" cy="146" rx="7" ry="3.5" fill="#121a15" opacity="0.55" />
        <ellipse cx="462" cy="154" rx="6" ry="3" fill="#121a15" opacity="0.5" />
        {/* Water drips */}
        <circle cx="480" cy="149" r="0.5" fill="#4a5a6a" opacity="0.22">
          <animate attributeName="cy" values="149;165;149" dur="2.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.22;0;0.22" dur="2.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="450" cy="175" r="0.4" fill="#4a5a6a" opacity="0.18">
          <animate attributeName="cy" values="175;190;175" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0;0.18" dur="2.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* High canopy branch — spanning the top of the ravine gap */}
      <g opacity="0.4">
        <path d="M350 145 Q380 138 410 142 Q430 145 450 148" fill="none" stroke="#121a15" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="380" cy="136" rx="10" ry="4" fill="#0e1610" opacity="0.5" />
        <ellipse cx="410" cy="140" rx="8" ry="3.5" fill="#0e1610" opacity="0.45" />
        {/* Drip from center */}
        <circle cx="395" cy="142" r="0.4" fill="#4a5a6a" opacity="0.15">
          <animate attributeName="cy" values="142;160;142" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === DRIPPING BRANCHES — water drops falling from trees === */}
      {/* Branch 1 — left valley tree */}
      <g>
        <line x1="342" y1="202" x2="355" y2="198" stroke="#1a2520" strokeWidth="1" opacity="0.5" />
        {/* Drop falling */}
        <circle cx="355" cy="198" r="0.6" fill="#4a5a6a" opacity="0.3">
          <animate attributeName="cy" values="198;214;198" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Branch 2 — right valley tree */}
      <g>
        <line x1="458" y1="200" x2="470" y2="196" stroke="#1a2520" strokeWidth="0.8" opacity="0.45" />
        <circle cx="470" cy="196" r="0.5" fill="#4a5a6a" opacity="0.25">
          <animate attributeName="cy" values="196;210;196" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Branch 3 — ridge tree */}
      <g>
        <line x1="252" y1="145" x2="264" y2="142" stroke="#1a2520" strokeWidth="0.7" opacity="0.4" />
        <circle cx="264" cy="142" r="0.5" fill="#4a5a6a" opacity="0.2">
          <animate attributeName="cy" values="142;155;142" dur="3.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="3.1s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Branch 4 — right ridge */}
      <g>
        <line x1="650" y1="138" x2="663" y2="134" stroke="#1a2520" strokeWidth="0.7" opacity="0.35" />
        <circle cx="663" cy="134" r="0.5" fill="#4a5a6a" opacity="0.2">
          <animate attributeName="cy" values="134;148;134" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Valley trees — closer, darker */}
      <path d="M340 230 L346 200 L352 230" fill="#121a15" />
      <path d="M343 215 L346 190 L349 215" fill="#121a15" />
      <path d="M450 225 L455 198 L460 225" fill="#121a15" />
      <path d="M410 238 L415 210 L420 238" fill="#121a15" opacity="0.9" />
      <path d="M413 224 L415 200 L417 224" fill="#121a15" opacity="0.9" />

      {/* === WET BLANKET draped over branches — drying near fire === */}
      <g opacity="0.65" transform="translate(440, 258)">
        {/* Two stick supports */}
        <line x1="0" y1="10" x2="2" y2="-5" stroke="#3a3020" strokeWidth="1.2" />
        <line x1="18" y1="10" x2="16" y2="-5" stroke="#3a3020" strokeWidth="1.2" />
        {/* Sagging blanket cloth */}
        <path d="M1 -4 Q5 -2 9 3 Q13 -2 17 -4" fill="none" stroke="#2a2a22" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M1 -4 Q5 0 9 5 Q13 0 17 -4" fill="#22201a" fillOpacity="0.5" />
        {/* Drip 1 from blanket sag */}
        <circle cx="9" cy="5" r="0.4" fill="#4a5a6a" opacity="0.3">
          <animate attributeName="cy" values="5;12;5" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* Drip 2 */}
        <circle cx="7" cy="3" r="0.35" fill="#4a5a6a" opacity="0.25">
          <animate attributeName="cy" values="3;11;3" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === STREAM at ravine bottom === */}
      <path d="M300 305 Q340 302 380 305 Q420 303 460 306 Q500 303 540 305"
        fill="none" stroke="url(#ch2_stream)" strokeWidth="8" opacity="0.5" />

      {/* === STREAM CROSSING STONES — stepping stones across the ravine stream === */}
      <g opacity="0.7">
        {/* Stone 1 — left bank, partly submerged */}
        <ellipse cx="345" cy="304" rx="5" ry="2.5" fill="url(#ch2_stoneWet)" />
        <ellipse cx="345" cy="303" rx="4" ry="1.5" fill="#2a3038" opacity="0.4" />
        {/* Stone 2 — mid stream, higher */}
        <ellipse cx="365" cy="303" rx="6" ry="3" fill="url(#ch2_stoneWet)" />
        <ellipse cx="365" cy="302" rx="5" ry="2" fill="#2a3038" opacity="0.45" />
        {/* Wet gleam on top */}
        <ellipse cx="365" cy="301" rx="2.5" ry="0.8" fill="#3a4a5a" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.2;0.12" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* Stone 3 — slightly off center */}
        <ellipse cx="388" cy="305" rx="5.5" ry="2.5" fill="url(#ch2_stoneWet)" />
        <ellipse cx="388" cy="304" rx="4.5" ry="1.8" fill="#2a3038" opacity="0.4" />
        {/* Stone 4 — further across */}
        <ellipse cx="408" cy="303" rx="5" ry="2.8" fill="url(#ch2_stoneWet)" />
        <ellipse cx="408" cy="302" rx="4" ry="1.8" fill="#2a3038" opacity="0.45" />
        {/* Wet gleam */}
        <ellipse cx="408" cy="301" rx="2" ry="0.7" fill="#3a4a5a" opacity="0.1">
          <animate attributeName="opacity" values="0.1;0.18;0.1" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Stone 5 — right bank */}
        <ellipse cx="428" cy="305" rx="4.5" ry="2.2" fill="url(#ch2_stoneWet)" />
        <ellipse cx="428" cy="304" rx="3.5" ry="1.5" fill="#2a3038" opacity="0.4" />
        {/* Water eddies around stones */}
        <path d="M360 306 Q365 308 370 306" fill="none" stroke="#3a4a5a" strokeWidth="0.3" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.06;0.12" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M403 306 Q408 308 413 306" fill="none" stroke="#3a4a5a" strokeWidth="0.3" opacity="0.1">
          <animate attributeName="opacity" values="0.1;0.05;0.1" dur="2.4s" repeatCount="indefinite" />
        </path>
      </g>

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

      {/* === MORE RAIN SPLASHES — puddle impacts === */}
      {/* Splash near fire 1 */}
      <circle cx="365" cy="288" r="1" fill="none" stroke="#4a5a6a" strokeWidth="0.3" opacity="0.15">
        <animate attributeName="r" values="1;3.5;1" dur="1.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="1.3s" repeatCount="indefinite" />
      </circle>
      {/* Splash on valley floor left */}
      <circle cx="330" cy="275" r="0.8" fill="none" stroke="#4a5a6a" strokeWidth="0.25" opacity="0.12">
        <animate attributeName="r" values="0.8;3;0.8" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.6s" repeatCount="indefinite" />
      </circle>
      {/* Splash between fires */}
      <circle cx="440" cy="266" r="0.8" fill="none" stroke="#4a5a6a" strokeWidth="0.25" opacity="0.1">
        <animate attributeName="r" values="0.8;2.5;0.8" dur="2.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0;0.1" dur="2.1s" repeatCount="indefinite" />
      </circle>
      {/* Splash near stream */}
      <circle cx="500" cy="300" r="1" fill="none" stroke="#3a4a5a" strokeWidth="0.3" opacity="0.12">
        <animate attributeName="r" values="1;4;1" dur="1.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.7s" repeatCount="indefinite" />
      </circle>
      {/* Splash foreground */}
      <circle cx="395" cy="295" r="1.2" fill="none" stroke="#4a5a6a" strokeWidth="0.3" opacity="0.14">
        <animate attributeName="r" values="1.2;4;1.2" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.14;0;0.14" dur="1.4s" repeatCount="indefinite" />
      </circle>
      {/* Splash near sentry */}
      <circle cx="475" cy="275" r="0.7" fill="none" stroke="#4a5a6a" strokeWidth="0.2" opacity="0.1">
        <animate attributeName="r" values="0.7;2.5;0.7" dur="1.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0;0.1" dur="1.9s" repeatCount="indefinite" />
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

      {/* === ADDITIONAL FIRE DETAILS — embers, glow variation === */}

      {/* Ember cluster near Fire 1 — glowing coals at base */}
      <g opacity="0.7">
        <circle cx="376" cy="286" r="0.8" fill="url(#ch2_emberHot)">
          <animate attributeName="opacity" values="0.7;0.4;0.7;0.5;0.7" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="379" cy="287" r="0.6" fill="url(#ch2_emberHot)">
          <animate attributeName="opacity" values="0.5;0.7;0.4;0.7;0.5" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="383" cy="286" r="0.7" fill="url(#ch2_emberHot)">
          <animate attributeName="opacity" values="0.6;0.3;0.6;0.5;0.6" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="381" cy="288" r="0.5" fill="#d0a060" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Rising sparks from Fire 1 — drifting upward */}
      <circle cx="380" cy="275" r="0.3" fill="#d0a060" opacity="0.3">
        <animate attributeName="cy" values="275;265;275" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="380;382;380" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="378" cy="277" r="0.25" fill="#d0a060" opacity="0.25">
        <animate attributeName="cy" values="277;268;277" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="378;376;378" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="383" cy="276" r="0.35" fill="#c08040" opacity="0.2">
        <animate attributeName="cy" values="276;264;276" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="383;385;383" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2.8s" repeatCount="indefinite" />
      </circle>

      {/* Fire glow on nearby rocks — pulsing warm light */}
      <ellipse cx="395" cy="282" rx="8" ry="3" fill="#a07040" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="365" cy="283" rx="6" ry="2.5" fill="#a07040" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Firelight glow on faces of nearby soldiers */}
      <circle cx="368" cy="250" r="5" fill="url(#ch2_faceGlow)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="392" cy="253" r="5" fill="url(#ch2_faceGlow)">
        <animate attributeName="opacity" values="0.7;0.45;0.7" dur="2.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="378" cy="265" r="4" fill="url(#ch2_faceGlow)">
        <animate attributeName="opacity" values="0.6;0.35;0.6" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* Ember cluster near Fire 2 */}
      <g opacity="0.6">
        <circle cx="418" cy="271" r="0.5" fill="url(#ch2_emberHot)">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="421" cy="272" r="0.4" fill="url(#ch2_emberHot)">
          <animate attributeName="opacity" values="0.4;0.6;0.4" dur="1.7s" repeatCount="indefinite" />
        </circle>
        <circle cx="423" cy="271" r="0.5" fill="#d0a060" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Rising sparks from Fire 2 */}
      <circle cx="420" cy="265" r="0.25" fill="#d0a060" opacity="0.2">
        <animate attributeName="cy" values="265;258;265" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
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

      {/* === STACKED MUSKETS — tripod near fire 1 === */}
      <g opacity="0.7">
        {/* Three muskets leaning together forming a tripod */}
        <line x1="395" y1="285" x2="393" y2="262" stroke="#1a1810" strokeWidth="1" />
        <line x1="397" y1="285" x2="399" y2="262" stroke="#1a1810" strokeWidth="1" />
        <line x1="396" y1="285" x2="396" y2="261" stroke="#1a1810" strokeWidth="1" />
        {/* Bayonet tips catching faint light */}
        <line x1="393" y1="262" x2="392" y2="258" stroke="#3a3a38" strokeWidth="0.5" opacity="0.4" />
        <line x1="399" y1="262" x2="400" y2="258" stroke="#3a3a38" strokeWidth="0.5" opacity="0.4" />
        <line x1="396" y1="261" x2="396" y2="257" stroke="#3a3a38" strokeWidth="0.5" opacity="0.4" />
        {/* Cross point where they meet */}
        <circle cx="396" cy="264" r="1.2" fill="#1a1810" opacity="0.5" />
      </g>

      {/* === POWDER BARREL — covered with oilcloth, kept dry === */}
      <g opacity="0.65" transform="translate(465, 260)">
        {/* Barrel body */}
        <ellipse cx="0" cy="3" rx="5" ry="7" fill="#2a2218" />
        {/* Barrel bands */}
        <ellipse cx="0" cy="-1" rx="5" ry="1.5" fill="none" stroke="#3a3020" strokeWidth="0.6" />
        <ellipse cx="0" cy="5" rx="5" ry="1.5" fill="none" stroke="#3a3020" strokeWidth="0.6" />
        {/* Barrel top */}
        <ellipse cx="0" cy="-4" rx="5" ry="1.8" fill="#2e2618" />
        {/* Oilcloth draped over top */}
        <path d="M-7 -6 Q-4 -8 0 -6 Q4 -8 7 -6 Q5 -3 0 -4 Q-5 -3 -7 -6 Z" fill="url(#ch2_oilcloth)" opacity="0.8" />
        {/* Oilcloth drape sides */}
        <path d="M-7 -6 Q-6 -1 -6 2" fill="none" stroke="#2a2818" strokeWidth="1" opacity="0.5" />
        <path d="M7 -6 Q6 -1 6 2" fill="none" stroke="#2a2818" strokeWidth="1" opacity="0.5" />
        {/* Rain drip off oilcloth */}
        <circle cx="-7" cy="-6" r="0.4" fill="#4a5a6a" opacity="0.3">
          <animate attributeName="cy" values="-6;2;-6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === AMMUNITION DISTRIBUTION — soldiers around an open crate taking cartridges === */}
      <g opacity="0.7" transform="translate(495, 270)">
        {/* Open ammunition crate — wooden box with lid flipped back */}
        <rect x="-8" y="2" width="16" height="10" fill="url(#ch2_crateWood)" rx="1" />
        {/* Crate interior — dark */}
        <rect x="-7" y="0" width="14" height="4" fill="#141008" />
        {/* Lid — propped open, leaning back */}
        <path d="M-8 2 L-10 -6 L4 -6 L8 2" fill="url(#ch2_crateWood)" opacity="0.7" />
        {/* Cartridge packets visible inside */}
        <rect x="-5" y="1" width="4" height="2" fill="#2a2010" rx="0.5" opacity="0.5" />
        <rect x="0" y="1" width="4" height="2" fill="#2a2010" rx="0.5" opacity="0.45" />
        {/* Crate bands / nails */}
        <line x1="-8" y1="7" x2="8" y2="7" stroke="#3a3020" strokeWidth="0.4" opacity="0.4" />

        {/* Soldier 1 — crouching, reaching into crate */}
        <path d="M-14 5 Q-15 -2 -12 -6 Q-10 -9 -9 -6 L-7 5 Z" fill="#0a0c08" />
        <circle cx="-11" cy="-10" r="3" fill="#0a0c08" />
        {/* Arm reaching into crate */}
        <path d="M-9 -4 Q-6 -2 -5 1" fill="none" stroke="#0a0c08" strokeWidth="1.2" />

        {/* Soldier 2 — standing, stuffing cartridges into pouch at hip */}
        <path d="M18 8 Q17 -2 19 -8 Q21 -12 22 -8 L24 8 Z" fill="#0a0c08" />
        <circle cx="20" cy="-12" r="3.5" fill="#0a0c08" />
        {/* Arms at waist — one hand at cartridge pouch */}
        <path d="M18 -4 Q16 -1 16 2" fill="none" stroke="#0a0c08" strokeWidth="1" opacity="0.5" />
        <path d="M23 -5 Q25 -2 24 0" fill="none" stroke="#0a0c08" strokeWidth="1" opacity="0.5" />
        {/* Cartridge pouch at hip */}
        <rect x="23" y="-2" width="3" height="4" fill="#14100a" rx="0.5" opacity="0.5" />

        {/* Soldier 3 — kneeling opposite side, handful of cartridges */}
        <path d="M-2 12 Q-3 6 0 2 Q2 -1 3 2 L5 12 Z" fill="#0a0c08" opacity="0.65" />
        <circle cx="1" cy="-2" r="2.5" fill="#0a0c08" opacity="0.6" />
        {/* Arm holding cartridges */}
        <path d="M3 3 Q5 4 6 3" fill="none" stroke="#0a0c08" strokeWidth="1" opacity="0.4" />
      </g>

      {/* === MAP/ORDERS — officer's map pinned to a tree near firelight === */}
      <g opacity="0.7" transform="translate(345, 210)">
        {/* Tree trunk that the map is pinned to */}
        <rect x="-3" y="-12" width="6" height="30" fill="#1a2018" rx="2" />
        {/* Map — rectangular parchment, slightly curled at edges */}
        <path d="M-12 -8 Q-11 -10 -8 -9 L8 -9 Q10 -10 11 -8 L11 6 Q10 8 8 7 L-8 7 Q-11 8 -12 6 Z"
          fill="url(#ch2_mapParchment)" />
        {/* Map warm glow from fire */}
        <path d="M-12 -8 Q-11 -10 -8 -9 L8 -9 Q10 -10 11 -8 L11 6 Q10 8 8 7 L-8 7 Q-11 8 -12 6 Z"
          fill="url(#ch2_mapGlow)" />
        {/* Map lines — terrain markings */}
        <line x1="-8" y1="-5" x2="7" y2="-5" stroke="#3a3020" strokeWidth="0.3" opacity="0.4" />
        <line x1="-6" y1="-2" x2="5" y2="-2" stroke="#3a3020" strokeWidth="0.3" opacity="0.35" />
        <path d="M-7 1 Q-2 -1 3 1 Q6 2 8 1" fill="none" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
        <line x1="-5" y1="4" x2="6" y2="4" stroke="#3a3020" strokeWidth="0.2" opacity="0.3" />
        {/* Pin/nail at top */}
        <circle cx="0" cy="-8" r="1" fill="#3a3020" opacity="0.6" />
        {/* Pin at bottom-right to hold it flat */}
        <circle cx="8" cy="5" r="0.8" fill="#3a3020" opacity="0.5" />

        {/* Officer silhouette — studying the map, holding a small lantern */}
        <path d="M14 10 Q13 2 15 -4 Q17 -8 18 -4 L20 10 Z" fill="#0a0c08" opacity="0.75" />
        <circle cx="16" cy="-8" r="3.5" fill="#0a0c08" opacity="0.75" />
        {/* Arm extended toward map */}
        <path d="M14 -2 Q10 -1 8 0" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
        {/* Small lantern in other hand — faint warm glow */}
        <circle cx="20" cy="-2" r="1.5" fill="#c09050" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.2;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="20" cy="-2" rx="5" ry="4" fill="#a07040" opacity="0.04">
          <animate attributeName="opacity" values="0.04;0.07;0.04" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* === MUDDY BOOTS — set near fire to dry === */}
      <g opacity="0.6" transform="translate(388, 286)">
        {/* Boot 1 — left */}
        <path d="M-3 0 L-3 -5 Q-2 -7 0 -5 L0 0 Q-1 1 -3 0 Z" fill="#1a1408" />
        <path d="M-4 0 Q-3 1 0 1 L1 0 Q0 -1 -4 0 Z" fill="#14100a" />
        {/* Boot 2 — right, slightly tilted */}
        <path d="M3 0 L3 -5 Q4 -7 6 -5 L6 0 Q5 1 3 0 Z" fill="#1a1408" />
        <path d="M2 0 Q3 1 6 1 L7 0 Q6 -1 2 0 Z" fill="#14100a" />
        {/* Mud smears */}
        <ellipse cx="1" cy="1" rx="6" ry="1" fill="#18140a" opacity="0.3" />
      </g>

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

      {/* === BAYONET INSPECTION — soldier holding up bayonet to check edge === */}
      <g opacity="0.75" transform="translate(402, 260)">
        {/* Soldier body — standing, arm raised */}
        <path d="M-2 22 Q-3 12 -1 5 Q1 0 2 5 L4 22 Z" fill="#0a0c08" />
        <circle cx="0" cy="-2" r="3.8" fill="#0a0c08" />
        {/* Raised arm holding bayonet up to eye level */}
        <path d="M2 3 Q5 -2 8 -6" fill="none" stroke="#0a0c08" strokeWidth="1.5" />
        {/* Bayonet blade — held up, catching firelight */}
        <line x1="8" y1="-6" x2="10" y2="-16" stroke="#4a4a48" strokeWidth="0.8" />
        {/* Blade glint animation — specular highlight traveling up the blade */}
        <line x1="8.5" y1="-7" x2="9.8" y2="-14" stroke="url(#ch2_bayonetGlint)" strokeWidth="1.2" opacity="0.4">
          <animate attributeName="opacity" values="0.1;0.5;0.1;0.1;0.1" dur="3s" repeatCount="indefinite" />
        </line>
        {/* Bright point glint at tip */}
        <circle cx="10" cy="-16" r="0.6" fill="#e0d8c0" opacity="0.2">
          <animate attributeName="opacity" values="0.05;0.35;0.05;0.05;0.05" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Other arm braced at waist */}
        <path d="M-2 6 Q-5 8 -4 10" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* === SHIVERING SOLDIER — visibly trembling with cold/nerves === */}
      <g opacity="0.75">
        {/* Body — animated subtle shake */}
        <path d="M356 278 Q354 268 357 262 Q359 258 361 262 L363 278 Z" fill="#0a0c08">
          <animate attributeName="d"
            values="M356 278 Q354 268 357 262 Q359 258 361 262 L363 278 Z;M355.5 278 Q353.5 268 356.5 262 Q358.5 258 360.5 262 L362.5 278 Z;M356.5 278 Q354.5 268 357.5 262 Q359.5 258 361.5 262 L363.5 278 Z;M356 278 Q354 268 357 262 Q359 258 361 262 L363 278 Z"
            dur="0.4s" repeatCount="indefinite" />
        </path>
        {/* Head — shaking slightly */}
        <circle cx="359" cy="257" r="3.5" fill="#0a0c08">
          <animate attributeName="cx" values="359;358.5;359.5;359" dur="0.4s" repeatCount="indefinite" />
        </circle>
        {/* Arms wrapped around self */}
        <path d="M355 267 Q353 264 355 262" fill="none" stroke="#0a0c08" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="d"
            values="M355 267 Q353 264 355 262;M354.5 267 Q352.5 264 354.5 262;M355.5 267 Q353.5 264 355.5 262;M355 267 Q353 264 355 262"
            dur="0.4s" repeatCount="indefinite" />
        </path>
        <path d="M363 267 Q365 264 363 262" fill="none" stroke="#0a0c08" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="d"
            values="M363 267 Q365 264 363 262;M362.5 267 Q364.5 264 362.5 262;M363.5 267 Q365.5 264 363.5 262;M363 267 Q365 264 363 262"
            dur="0.4s" repeatCount="indefinite" />
        </path>
      </g>

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

      {/* === PRAYING SOLDIER — kneeling, hands clasped, head bowed === */}
      <g opacity="0.65" transform="translate(338, 288)">
        {/* Kneeling body — lower, compact */}
        <path d="M0 2 Q-1 -4 1 -7 Q3 -10 4 -7 L5 2 Z" fill="#0a0c08" />
        {/* Head — bowed forward */}
        <circle cx="2" cy="-11" r="2.8" fill="#0a0c08" />
        {/* Clasped hands raised before face */}
        <path d="M1 -9 Q0 -11 1 -13 Q2 -14 3 -13 Q4 -11 3 -9" fill="#0a0c08" opacity="0.7" />
        {/* Kneeling legs */}
        <path d="M-1 2 Q-2 4 -1 6 L5 6 Q6 4 5 2" fill="#0a0c08" opacity="0.5" />
      </g>

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

      {/* === FOG drifting through trees — 6 original + 3 new layers === */}
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

      {/* === ADDITIONAL FOG LAYERS — more depth === */}
      {/* Creeping ground fog — low and thick, obscuring feet */}
      <ellipse cx="380" cy="315" rx="110" ry="8" fill="#3a4555" opacity="0.08">
        <animate attributeName="cx" values="380;360;380" dur="13s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.14;0.08" dur="13s" repeatCount="indefinite" />
      </ellipse>
      {/* Wispy fog mid-left — drifting across ravine wall */}
      <ellipse cx="160" cy="220" rx="70" ry="10" fill="#3a4050" opacity="0.06">
        <animate attributeName="cx" values="160;190;160" dur="16s" repeatCount="indefinite" />
        <animate attributeName="cy" values="220;215;220" dur="16s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="16s" repeatCount="indefinite" />
      </ellipse>
      {/* Thin fog tendril — high right, threading through trees */}
      <ellipse cx="580" cy="175" rx="55" ry="6" fill="#3a4050" opacity="0.05">
        <animate attributeName="cx" values="580;610;580" dur="17s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.09;0.05" dur="17s" repeatCount="indefinite" />
      </ellipse>

      {/* === DENSE MIST POCKET — swirling slowly in a low area of the ravine === */}
      <g opacity="0.8">
        {/* Core mist mass — large, dense */}
        <ellipse cx="320" cy="290" rx="35" ry="18" fill="url(#ch2_mistPocket)">
          <animate attributeName="rx" values="35;40;35" dur="8s" repeatCount="indefinite" />
          <animate attributeName="ry" values="18;15;18" dur="10s" repeatCount="indefinite" />
        </ellipse>
        {/* Inner swirl layer — slightly offset, rotating feel */}
        <ellipse cx="325" cy="288" rx="25" ry="12" fill="#3a4555" opacity="0.08">
          <animate attributeName="cx" values="325;315;325" dur="7s" repeatCount="indefinite" />
          <animate attributeName="ry" values="12;14;12" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.13;0.08" dur="7s" repeatCount="indefinite" />
        </ellipse>
        {/* Tendril wisps extending from the pocket */}
        <ellipse cx="340" cy="285" rx="18" ry="6" fill="#3a4555" opacity="0.06">
          <animate attributeName="cx" values="340;350;340" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0.1;0.06" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="305" cy="295" rx="15" ry="5" fill="#3a4555" opacity="0.05">
          <animate attributeName="cx" values="305;295;305" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.05;0.09;0.05" dur="8s" repeatCount="indefinite" />
        </ellipse>
        {/* Rising wisp — mist climbing out of the pocket */}
        <ellipse cx="315" cy="280" rx="10" ry="4" fill="#3a4555" opacity="0.04">
          <animate attributeName="cy" values="280;274;280" dur="10s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.04;0.08;0.04" dur="10s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* =================================================================== */}
      {/* === POST-MONTENOTTE DETAILS — first victory celebration =========== */}
      {/* =================================================================== */}

      {/* === LIGURIAN MOUNTAIN DETAIL — craggy ridgeline silhouettes === */}
      {/* Additional rocky spurs on left ridge */}
      <path d="M30 155 L40 138 L48 142 L55 128 L65 148 L70 155" fill="#1c2028" opacity="0.7" />
      <path d="M90 148 L98 132 L108 140 L115 125 L125 145 L130 155" fill="#1c2028" opacity="0.65" />
      {/* Exposed rock face — layered strata visible on right wall */}
      <g opacity="0.4">
        <path d="M560 160 L570 155 L575 162 L580 157 L590 165 L590 180 L560 180 Z" fill="#222830" />
        <line x1="562" y1="168" x2="588" y2="164" stroke="#2a3038" strokeWidth="0.5" opacity="0.4" />
        <line x1="564" y1="174" x2="586" y2="170" stroke="#2a3038" strokeWidth="0.4" opacity="0.35" />
        <line x1="566" y1="178" x2="584" y2="175" stroke="#2a3038" strokeWidth="0.3" opacity="0.3" />
      </g>
      {/* Scree slope below left ridge */}
      <g opacity="0.35">
        <circle cx="285" cy="210" r="1.2" fill="#22282e" />
        <circle cx="290" cy="215" r="0.9" fill="#22282e" />
        <circle cx="282" cy="218" r="1.5" fill="#22282e" />
        <circle cx="295" cy="220" r="1.0" fill="#22282e" />
        <circle cx="278" cy="225" r="1.3" fill="#22282e" />
        <circle cx="288" cy="228" r="0.8" fill="#22282e" />
      </g>

      {/* === ADDITIONAL TREE DETAIL — fuller canopy, root systems === */}
      {/* Thick oak on left valley edge — visible roots gripping rocks */}
      <g opacity="0.7" transform="translate(310, 230)">
        {/* Trunk — thick, gnarled */}
        <path d="M-3 0 Q-4 -15 -2 -28 Q0 -32 2 -28 Q4 -15 3 0 Z" fill="#1a2018" />
        {/* Major branches */}
        <path d="M-2 -25 Q-10 -35 -16 -32" fill="none" stroke="#1a2018" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 -26 Q8 -36 14 -34" fill="none" stroke="#1a2018" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M0 -28 Q-2 -38 -4 -42" fill="none" stroke="#1a2018" strokeWidth="1.5" strokeLinecap="round" />
        {/* Foliage masses */}
        <ellipse cx="-14" cy="-35" rx="8" ry="5" fill="#121a15" opacity="0.7" />
        <ellipse cx="12" cy="-37" rx="7" ry="4.5" fill="#121a15" opacity="0.65" />
        <ellipse cx="-2" cy="-42" rx="9" ry="5" fill="#121a15" opacity="0.7" />
        <ellipse cx="4" cy="-38" rx="6" ry="4" fill="#101812" opacity="0.6" />
        {/* Exposed roots */}
        <path d="M-3 0 Q-8 2 -12 1" fill="none" stroke="#1a2018" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <path d="M3 0 Q7 3 10 2" fill="none" stroke="#1a2018" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
        <path d="M-1 0 Q-4 4 -6 3" fill="none" stroke="#1a2018" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Birch cluster near right ridge — white bark catches firelight */}
      <g opacity="0.55" transform="translate(485, 215)">
        <line x1="0" y1="0" x2="-1" y2="-30" stroke="#2a2a28" strokeWidth="1.5" />
        <line x1="8" y1="0" x2="7" y2="-28" stroke="#2a2a28" strokeWidth="1.2" />
        <line x1="14" y1="0" x2="13" y2="-25" stroke="#2a2a28" strokeWidth="1" />
        {/* White bark marks */}
        <line x1="-0.5" y1="-10" x2="0.5" y2="-10" stroke="#3a3a38" strokeWidth="0.3" opacity="0.3" />
        <line x1="-0.5" y1="-18" x2="0.5" y2="-18" stroke="#3a3a38" strokeWidth="0.3" opacity="0.3" />
        <line x1="7.5" y1="-12" x2="8.5" y2="-12" stroke="#3a3a38" strokeWidth="0.3" opacity="0.25" />
        {/* Small leaf clusters */}
        <ellipse cx="-1" cy="-30" rx="5" ry="3" fill="#121a15" opacity="0.5" />
        <ellipse cx="7" cy="-28" rx="4.5" ry="2.5" fill="#121a15" opacity="0.45" />
        <ellipse cx="13" cy="-25" rx="4" ry="2.5" fill="#121a15" opacity="0.4" />
      </g>

      {/* === STONE WALL RUINS — old Ligurian terrace wall === */}
      <g opacity="0.6" transform="translate(330, 320)">
        {/* Dry stone wall — tumbled in places */}
        <rect x="0" y="-8" width="10" height="8" fill="url(#ch2_stoneWall)" rx="1" />
        <rect x="10" y="-6" width="8" height="6" fill="url(#ch2_stoneWall)" rx="1" />
        <rect x="18" y="-7" width="9" height="7" fill="url(#ch2_stoneWall)" rx="1" />
        <rect x="27" y="-5" width="8" height="5" fill="url(#ch2_stoneWall)" rx="1" />
        {/* Fallen stones */}
        <ellipse cx="38" cy="-1" rx="3" ry="2" fill="#222220" opacity="0.5" />
        <ellipse cx="42" cy="0" rx="2.5" ry="1.5" fill="#222220" opacity="0.45" />
        <ellipse cx="-3" cy="-2" rx="2" ry="1.5" fill="#222220" opacity="0.4" />
        {/* Mortar gaps between stones */}
        <line x1="10" y1="-8" x2="10" y2="0" stroke="#141412" strokeWidth="0.4" opacity="0.3" />
        <line x1="18" y1="-7" x2="18" y2="0" stroke="#141412" strokeWidth="0.4" opacity="0.3" />
        <line x1="27" y1="-5" x2="27" y2="0" stroke="#141412" strokeWidth="0.4" opacity="0.3" />
        {/* Moss growing in cracks */}
        <ellipse cx="14" cy="-6" rx="2" ry="0.8" fill="#1a2518" opacity="0.25" />
        <ellipse cx="23" cy="-5" rx="1.5" ry="0.6" fill="#1a2518" opacity="0.2" />
      </g>

      {/* === CAPTURED AUSTRIAN FLAGS/STANDARDS — trophy of first victory === */}

      {/* Flag 1 — planted in the ground near main fire, white-and-red Habsburg */}
      <g opacity="0.75" transform="translate(370, 245)">
        {/* Flag pole — slightly tilted, driven into mud */}
        <line x1="0" y1="30" x2="2" y2="-22" stroke="#3a3020" strokeWidth="1.5" />
        {/* Pole finial — eagle (simplified) */}
        <path d="M1 -22 L-1 -26 L0 -24 L2 -28 L3 -24 L4 -26 L2 -22" fill="#6a5a30" opacity="0.5" />
        {/* Flag cloth — white upper, red lower, wind-animated */}
        <path d="M2 -20 Q10 -22 18 -19 Q12 -17 2 -16 Z" fill="url(#ch2_flagWhite)">
          <animate attributeName="d" values="M2 -20 Q10 -22 18 -19 Q12 -17 2 -16 Z;M2 -20 Q10 -18 18 -20 Q12 -16 2 -16 Z;M2 -20 Q10 -22 18 -19 Q12 -17 2 -16 Z" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M2 -16 Q10 -18 18 -15 Q12 -13 2 -12 Z" fill="url(#ch2_flagRed)">
          <animate attributeName="d" values="M2 -16 Q10 -18 18 -15 Q12 -13 2 -12 Z;M2 -16 Q10 -14 18 -16 Q12 -12 2 -12 Z;M2 -16 Q10 -18 18 -15 Q12 -13 2 -12 Z" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Flag tatter — battle damage */}
        <path d="M16 -16 L20 -15 L18 -13" fill="url(#ch2_flagRed)" opacity="0.3">
          <animate attributeName="d" values="M16 -16 L20 -15 L18 -13;M16 -16 L21 -14 L18 -12;M16 -16 L20 -15 L18 -13" dur="2.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Flag 2 — leaning against rock near fire 2, more damaged */}
      <g opacity="0.6" transform="translate(435, 252)">
        {/* Pole — leaning at angle */}
        <line x1="0" y1="15" x2="6" y2="-18" stroke="#3a3020" strokeWidth="1.2" />
        {/* Torn flag hanging limp */}
        <path d="M6 -16 Q10 -17 13 -14 Q10 -12 6 -12 Z" fill="url(#ch2_flagWhite)" opacity="0.5">
          <animate attributeName="d" values="M6 -16 Q10 -17 13 -14 Q10 -12 6 -12 Z;M6 -16 Q10 -15 13 -15 Q10 -11 6 -12 Z;M6 -16 Q10 -17 13 -14 Q10 -12 6 -12 Z" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M6 -12 Q9 -13 11 -10 Q8 -8 6 -8 Z" fill="url(#ch2_flagRed)" opacity="0.45">
          <animate attributeName="d" values="M6 -12 Q9 -13 11 -10 Q8 -8 6 -8 Z;M6 -12 Q9 -11 11 -11 Q8 -7 6 -8 Z;M6 -12 Q9 -13 11 -10 Q8 -8 6 -8 Z" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Broken pole tip */}
        <path d="M6 -18 L5 -20 L7 -19" fill="#3a3020" opacity="0.4" />
      </g>

      {/* === CELEBRATING SOLDIERS — victory mood around fires === */}

      {/* Soldier raising cup/canteen in toast — near fire 1 */}
      <g opacity="0.75" transform="translate(385, 250)">
        {/* Body */}
        <path d="M-2 25 Q-3 15 -1 8 Q1 3 2 8 L4 25 Z" fill="#0a0c08" />
        <circle cx="0" cy="1" r="4" fill="#0a0c08" />
        {/* Arm raised high with cup */}
        <path d="M2 6 Q6 0 8 -6" fill="none" stroke="#0a0c08" strokeWidth="1.5" />
        {/* Cup/canteen at top of raised arm */}
        <rect x="6" y="-10" width="4" height="4" fill="#2a2218" rx="0.5" opacity="0.6" />
        {/* Other arm at side */}
        <path d="M-2 8 Q-5 10 -4 14" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* Two soldiers embracing — comrades after first battle */}
      <g opacity="0.65" transform="translate(415, 247)">
        {/* Soldier A */}
        <path d="M-3 22 Q-4 12 -2 5 Q0 1 1 5 L2 22 Z" fill="#0a0c08" />
        <circle cx="-1" cy="-1" r="3.5" fill="#0a0c08" />
        {/* Soldier B — slightly behind */}
        <path d="M5 22 Q4 12 6 5 Q8 1 9 5 L10 22 Z" fill="#0a0c08" opacity="0.9" />
        <circle cx="7" cy="-1" r="3.5" fill="#0a0c08" opacity="0.9" />
        {/* Arms around each other */}
        <path d="M1 4 Q4 3 6 4" fill="none" stroke="#0a0c08" strokeWidth="1.5" opacity="0.6" />
        <path d="M9 4 Q6 3 4 4" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* Soldier dancing/swaying — drunk on victory and perhaps brandy */}
      <g opacity="0.6" transform="translate(455, 248)">
        {/* Body — leaning, off balance */}
        <path d="M0 20 Q-2 10 1 3 Q3 -1 4 3 L6 20 Z" fill="#0a0c08">
          <animate attributeName="d" values="M0 20 Q-2 10 1 3 Q3 -1 4 3 L6 20 Z;M1 20 Q-1 10 2 3 Q4 -1 5 3 L7 20 Z;M-1 20 Q-3 10 0 3 Q2 -1 3 3 L5 20 Z;M0 20 Q-2 10 1 3 Q3 -1 4 3 L6 20 Z" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="2" cy="-3" r="3.5" fill="#0a0c08">
          <animate attributeName="cx" values="2;3;1;2" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Arms out for balance */}
        <path d="M-1 5 Q-5 3 -7 5" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5">
          <animate attributeName="d" values="M-1 5 Q-5 3 -7 5;M0 5 Q-4 2 -6 4;M-2 5 Q-6 4 -8 6;M-1 5 Q-5 3 -7 5" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M5 5 Q9 3 11 5" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5">
          <animate attributeName="d" values="M5 5 Q9 3 11 5;M6 5 Q10 4 12 6;M4 5 Q8 2 10 4;M5 5 Q9 3 11 5" dur="2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === COOKING FIRE — separate from war fires, with pot and spit === */}
      <g transform="translate(330, 330)">
        {/* Ground glow */}
        <ellipse cx="0" cy="0" rx="22" ry="8" fill="url(#ch2_cookFireGlow)" />
        {/* Fire pit ring of stones */}
        <ellipse cx="-8" cy="2" rx="2.5" ry="1.5" fill="#2a2828" opacity="0.4" />
        <ellipse cx="-4" cy="4" rx="2" ry="1.2" fill="#2a2828" opacity="0.35" />
        <ellipse cx="2" cy="4" rx="2.2" ry="1.3" fill="#2a2828" opacity="0.4" />
        <ellipse cx="7" cy="3" rx="2" ry="1.2" fill="#2a2828" opacity="0.35" />
        <ellipse cx="10" cy="1" rx="2.5" ry="1.5" fill="#2a2828" opacity="0.4" />
        {/* Flames */}
        <path d="M-2 -1 Q0 -7 2 -1" fill="#c08040" opacity="0.45">
          <animate attributeName="d" values="M-2 -1 Q0 -7 2 -1;M-2 -1 Q1 -8 2 -1;M-2 -1 Q0 -7 2 -1" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M1 -1 Q2 -5 3 -1" fill="#d09050" opacity="0.35">
          <animate attributeName="d" values="M1 -1 Q2 -5 3 -1;M1 -1 Q3 -6 3 -1;M1 -1 Q2 -5 3 -1" dur="0.65s" repeatCount="indefinite" />
        </path>
        {/* Cooking embers */}
        <circle cx="-1" cy="1" r="0.6" fill="#d0a060" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="3" cy="2" r="0.5" fill="#d0a060" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.15;0.35" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* Spit — horizontal stick over fire */}
        <line x1="-14" y1="-3" x2="14" y2="-4" stroke="#2a2418" strokeWidth="1" opacity="0.6" />
        {/* Spit supports — forked sticks */}
        <path d="M-14 5 L-14 -3 L-16 -7" fill="none" stroke="#2a2418" strokeWidth="0.8" opacity="0.5" />
        <path d="M-14 -3 L-12 -7" fill="none" stroke="#2a2418" strokeWidth="0.8" opacity="0.5" />
        <path d="M14 5 L14 -4 L12 -8" fill="none" stroke="#2a2418" strokeWidth="0.8" opacity="0.5" />
        <path d="M14 -4 L16 -8" fill="none" stroke="#2a2418" strokeWidth="0.8" opacity="0.5" />
        {/* Meat on spit — dark lump */}
        <ellipse cx="0" cy="-4" rx="5" ry="2.5" fill="#1a1008" opacity="0.6" />
        {/* Dripping fat — sizzle */}
        <circle cx="0" cy="-1" r="0.3" fill="#a08040" opacity="0.3">
          <animate attributeName="cy" values="-1;1;-1" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* Iron cooking pot — beside the fire */}
        <ellipse cx="-18" cy="1" rx="5" ry="3" fill="url(#ch2_ironPot)" opacity="0.6" />
        <ellipse cx="-18" cy="-1" rx="5" ry="1.5" fill="#1a1a1a" opacity="0.4" />
        {/* Steam from pot */}
        <path d="M-18 -3 Q-17 -8 -19 -12" fill="none" stroke="#3a4555" strokeWidth="0.6" opacity="0.12">
          <animate attributeName="d" values="M-18 -3 Q-17 -8 -19 -12;M-18 -3 Q-19 -8 -17 -12;M-18 -3 Q-17 -8 -19 -12" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.12;0.06;0.12" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M-16 -3 Q-15 -7 -17 -10" fill="none" stroke="#3a4555" strokeWidth="0.4" opacity="0.08">
          <animate attributeName="d" values="M-16 -3 Q-15 -7 -17 -10;M-16 -3 Q-17 -7 -15 -10;M-16 -3 Q-15 -7 -17 -10" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.04;0.08" dur="3.5s" repeatCount="indefinite" />
        </path>
        {/* Sparks rising from cooking fire */}
        <circle cx="1" cy="-6" r="0.3" fill="#d0a060" opacity="0.25">
          <animate attributeName="cy" values="-6;-14;-6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cx" values="1;3;1" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === DICE GAME — soldiers gambling by fire 2 === */}
      <g opacity="0.7" transform="translate(425, 278)">
        {/* Blanket spread on ground */}
        <ellipse cx="0" cy="2" rx="10" ry="4" fill="#1a1810" opacity="0.4" />
        {/* Dice — two small cubes catching firelight */}
        <rect x="-2" y="-1" width="2.5" height="2.5" fill="url(#ch2_diceIvory)" rx="0.3" />
        <rect x="2" y="0" width="2.5" height="2.5" fill="url(#ch2_diceIvory)" rx="0.3" transform="rotate(15 3.25 1.25)" />
        {/* Dice pips — tiny dots */}
        <circle cx="-0.75" cy="0.25" r="0.3" fill="#1a1a18" opacity="0.3" />
        <circle cx="3.25" cy="1.25" r="0.3" fill="#1a1a18" opacity="0.3" />
        <circle cx="3.8" cy="0.7" r="0.3" fill="#1a1a18" opacity="0.25" />
        {/* Coins/stakes — small scattered circles */}
        <circle cx="-5" cy="1" r="1" fill="#5a4a20" opacity="0.25" />
        <circle cx="-4" cy="3" r="0.8" fill="#5a4a20" opacity="0.2" />
        <circle cx="6" cy="2" r="0.9" fill="#5a4a20" opacity="0.22" />
        {/* Soldier crouching over dice — reaching to throw */}
        <path d="M-12 8 Q-13 2 -10 -3 Q-8 -6 -7 -3 L-5 8 Z" fill="#0a0c08" />
        <circle cx="-9" cy="-7" r="3" fill="#0a0c08" />
        {/* Arm extended — about to throw */}
        <path d="M-7 -1 Q-4 0 -2 -1" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
        {/* Soldier watching — leaning forward eagerly */}
        <path d="M10 8 Q9 2 12 -2 Q14 -5 15 -2 L17 8 Z" fill="#0a0c08" opacity="0.8" />
        <circle cx="13" cy="-6" r="3" fill="#0a0c08" opacity="0.8" />
        {/* Third gambler — seated cross-legged */}
        <path d="M-2 10 Q-3 6 0 3 Q3 6 2 10 Z" fill="#0a0c08" opacity="0.6" />
        <circle cx="0" cy="0" r="2.5" fill="#0a0c08" opacity="0.55" />
      </g>

      {/* === LETTER-WRITING SOLDIER — seated, quill and paper by firelight === */}
      <g opacity="0.7" transform="translate(350, 262)">
        {/* Seated body — hunched over writing */}
        <path d="M-2 18 Q-3 10 0 4 Q2 1 3 4 L5 18 Z" fill="#0a0c08" />
        <circle cx="1" cy="-1" r="3.5" fill="#0a0c08" />
        {/* Arms forward — writing posture */}
        <path d="M3 5 Q6 4 8 2" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
        <path d="M-1 5 Q-3 4 -4 2" fill="none" stroke="#0a0c08" strokeWidth="1" opacity="0.4" />
        {/* Paper on knee — bright rectangle in firelight */}
        <rect x="5" y="0" width="7" height="9" fill="url(#ch2_letterPaper)" rx="0.5" />
        {/* Writing lines */}
        <line x1="6" y1="2" x2="11" y2="2" stroke="#3a3020" strokeWidth="0.2" opacity="0.3" />
        <line x1="6" y1="4" x2="10" y2="4" stroke="#3a3020" strokeWidth="0.2" opacity="0.25" />
        <line x1="6" y1="6" x2="11" y2="6" stroke="#3a3020" strokeWidth="0.2" opacity="0.3" />
        {/* Quill in hand */}
        <line x1="8" y1="1" x2="10" y2="-4" stroke="#2a2018" strokeWidth="0.5" opacity="0.4" />
        {/* Firelight on paper */}
        <rect x="5" y="0" width="7" height="9" fill="url(#ch2_mapGlow)" rx="0.5" opacity="0.5" />
      </g>

      {/* === PACK MULES — tethered near stone wall === */}
      <g opacity="0.6" transform="translate(380, 330)">
        {/* Mule 1 — standing, head lowered to graze */}
        {/* Body */}
        <ellipse cx="0" cy="0" rx="8" ry="4.5" fill="url(#ch2_muleHide)" />
        {/* Head — lowered */}
        <path d="M8 0 Q12 2 14 5" fill="none" stroke="#2a2018" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="14" cy="6" rx="3" ry="2" fill="#2a2018" />
        {/* Ears — pricked */}
        <path d="M13 4 L12 1 L14 3" fill="#2a2018" />
        <path d="M15 4 L16 1 L14 3" fill="#2a2018" />
        {/* Legs */}
        <line x1="-4" y1="4" x2="-4" y2="12" stroke="#1e1810" strokeWidth="1.2" />
        <line x1="-1" y1="4" x2="-1" y2="12" stroke="#1e1810" strokeWidth="1.2" />
        <line x1="3" y1="4" x2="3" y2="11" stroke="#1e1810" strokeWidth="1.2" />
        <line x1="6" y1="4" x2="6" y2="11" stroke="#1e1810" strokeWidth="1.2" />
        {/* Pack/saddle bags */}
        <rect x="-4" y="-5" width="8" height="4" fill="#1a1408" rx="1" opacity="0.5" />
        <rect x="-5" y="-4" width="3" height="6" fill="#1a1408" rx="0.5" opacity="0.4" />
        <rect x="2" y="-4" width="3" height="6" fill="#1a1408" rx="0.5" opacity="0.4" />
        {/* Tether rope to ground stake */}
        <path d="M14 5 Q18 8 22 10" fill="none" stroke="#2a2418" strokeWidth="0.5" opacity="0.3" />
        {/* Tail swish */}
        <path d="M-8 0 Q-11 2 -10 5" fill="none" stroke="#1e1810" strokeWidth="0.8" opacity="0.4">
          <animate attributeName="d" values="M-8 0 Q-11 2 -10 5;M-8 0 Q-12 1 -11 4;M-8 0 Q-11 2 -10 5" dur="4s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Mule 2 — further back, silhouette only */}
      <g opacity="0.4" transform="translate(408, 332)">
        <ellipse cx="0" cy="0" rx="7" ry="4" fill="#1e1810" />
        <path d="M7 -1 Q10 1 12 3" fill="none" stroke="#1e1810" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="12" cy="4" rx="2.5" ry="1.8" fill="#1e1810" />
        <line x1="-3" y1="4" x2="-3" y2="10" stroke="#161208" strokeWidth="1" />
        <line x1="0" y1="4" x2="0" y2="10" stroke="#161208" strokeWidth="1" />
        <line x1="3" y1="4" x2="3" y2="10" stroke="#161208" strokeWidth="1" />
        <line x1="5" y1="4" x2="5" y2="10" stroke="#161208" strokeWidth="1" />
      </g>

      {/* === SPRING WILDFLOWERS — Ligurian April blooms clinging to slopes === */}
      {/* Yellow primroses — scattered on left slope */}
      <g opacity="0.5">
        <circle cx="290" cy="235" r="1.2" fill="url(#ch2_flowerYellow)" />
        <circle cx="295" cy="238" r="1" fill="url(#ch2_flowerYellow)" />
        <circle cx="285" cy="240" r="0.9" fill="url(#ch2_flowerYellow)" />
        <circle cx="298" cy="242" r="1.1" fill="url(#ch2_flowerYellow)" />
        <circle cx="283" cy="244" r="0.8" fill="url(#ch2_flowerYellow)" />
      </g>
      {/* Violet wildflowers — right slope */}
      <g opacity="0.45">
        <circle cx="500" cy="230" r="1" fill="url(#ch2_flowerViolet)" />
        <circle cx="505" cy="233" r="1.2" fill="url(#ch2_flowerViolet)" />
        <circle cx="498" cy="236" r="0.9" fill="url(#ch2_flowerViolet)" />
        <circle cx="508" cy="238" r="1.1" fill="url(#ch2_flowerViolet)" />
      </g>
      {/* White star-flowers near stream */}
      <g opacity="0.35">
        <circle cx="360" cy="298" r="0.8" fill="#a0a098" opacity="0.2" />
        <circle cx="355" cy="300" r="0.7" fill="#a0a098" opacity="0.18" />
        <circle cx="365" cy="301" r="0.6" fill="#a0a098" opacity="0.15" />
        <circle cx="450" cy="298" r="0.7" fill="#a0a098" opacity="0.18" />
        <circle cx="455" cy="300" r="0.8" fill="#a0a098" opacity="0.2" />
      </g>
      {/* Flower stems — barely visible thin lines */}
      <g opacity="0.2">
        <line x1="290" y1="235" x2="290" y2="240" stroke="#2a3520" strokeWidth="0.3" />
        <line x1="295" y1="238" x2="295" y2="243" stroke="#2a3520" strokeWidth="0.3" />
        <line x1="500" y1="230" x2="500" y2="235" stroke="#2a3520" strokeWidth="0.3" />
        <line x1="505" y1="233" x2="505" y2="238" stroke="#2a3520" strokeWidth="0.3" />
      </g>

      {/* === BIRDS — warblers and swallows in the ravine === */}

      {/* Swallow in flight — near top of ravine, swift wing shape */}
      <g opacity="0.3">
        <path d="M250 80 Q245 75 238 78 Q243 73 248 76 L250 72 L252 76 Q257 73 262 78 Q255 75 250 80 Z" fill="#0a0c12">
          <animate attributeName="transform" type="translate" values="0,0;20,-5;40,-2;20,3;0,0" dur="5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Second swallow — smaller, higher, faster */}
      <g opacity="0.25">
        <path d="M420 62 Q417 58 412 60 Q415 56 418 58 L420 55 L422 58 Q425 56 428 60 Q423 58 420 62 Z" fill="#0a0c12">
          <animate attributeName="transform" type="translate" values="0,0;-25,-3;-50,1;-25,4;0,0" dur="4s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Perched bird on branch — small warbler silhouette */}
      <g opacity="0.35" transform="translate(340, 152)">
        <ellipse cx="0" cy="0" rx="2" ry="1.5" fill="#0e1610" />
        <circle cx="2.5" cy="-0.5" r="0.8" fill="#0e1610" />
        {/* Beak */}
        <line x1="3.3" y1="-0.5" x2="4.5" y2="-0.8" stroke="#0e1610" strokeWidth="0.3" />
        {/* Tail feathers */}
        <path d="M-2 0 L-4 1 L-2 0.5" fill="#0e1610" />
        {/* Legs — thin */}
        <line x1="-0.5" y1="1.5" x2="-0.5" y2="3" stroke="#0e1610" strokeWidth="0.3" />
        <line x1="0.5" y1="1.5" x2="0.5" y2="3" stroke="#0e1610" strokeWidth="0.3" />
      </g>

      {/* Bird on right ridge — head bobbing */}
      <g opacity="0.3" transform="translate(658, 136)">
        <ellipse cx="0" cy="0" rx="1.8" ry="1.3" fill="#0e1610" />
        <circle cx="2" cy="-0.5" r="0.7" fill="#0e1610">
          <animate attributeName="cy" values="-0.5;-1;-0.5;-0.5;-0.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <line x1="2.7" y1="-0.5" x2="3.8" y2="-0.7" stroke="#0e1610" strokeWidth="0.25" />
        <path d="M-1.8 0 L-3.5 0.8 L-1.8 0.3" fill="#0e1610" />
      </g>

      {/* === BRANDY BOTTLE — passed around near celebrating soldiers === */}
      <g opacity="0.55" transform="translate(400, 275)">
        {/* Bottle body */}
        <path d="M-1.5 0 L-1.5 -8 Q-1 -9 0 -9 Q1 -9 1.5 -8 L1.5 0 Z" fill="url(#ch2_bottleGlass)" />
        {/* Bottle neck */}
        <path d="M-0.8 -9 L-0.8 -12 Q0 -12.5 0.8 -12 L0.8 -9" fill="#1a2818" opacity="0.5" />
        {/* Glass highlight */}
        <line x1="-1" y1="-7" x2="-1" y2="-2" stroke="#2a3828" strokeWidth="0.3" opacity="0.2" />
      </g>

      {/* === WIND EFFECTS — gusts through the ravine === */}

      {/* Wind-blown leaves/debris — animated particles */}
      <g opacity="0.25">
        {/* Leaf 1 */}
        <ellipse cx="350" cy="220" rx="1.5" ry="0.5" fill="#1a2518" transform="rotate(30 350 220)">
          <animate attributeName="cx" values="350;420;490" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cy" values="220;215;222" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.15;0" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Leaf 2 — offset timing */}
        <ellipse cx="300" cy="240" rx="1.2" ry="0.4" fill="#1a2518" transform="rotate(-20 300 240)">
          <animate attributeName="cx" values="300;370;440" dur="5s" repeatCount="indefinite" begin="1.5s" />
          <animate attributeName="cy" values="240;233;238" dur="5s" repeatCount="indefinite" begin="1.5s" />
          <animate attributeName="opacity" values="0.2;0.12;0" dur="5s" repeatCount="indefinite" begin="1.5s" />
        </ellipse>
        {/* Leaf 3 */}
        <ellipse cx="380" cy="200" rx="1" ry="0.4" fill="#1e2018" transform="rotate(45 380 200)">
          <animate attributeName="cx" values="380;440;500" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
          <animate attributeName="cy" values="200;196;202" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
          <animate attributeName="opacity" values="0.2;0.1;0" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
        </ellipse>
      </g>

      {/* Smoke blown sideways from fires — wind direction indicator */}
      <g opacity="0.1">
        <ellipse cx="395" cy="275" rx="15" ry="3" fill="#3a4050">
          <animate attributeName="cx" values="395;420;445" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.05;0" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="430" cy="262" rx="10" ry="2.5" fill="#3a4050">
          <animate attributeName="cx" values="430;450;470" dur="5s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" values="0.08;0.04;0" dur="5s" repeatCount="indefinite" begin="1s" />
        </ellipse>
      </g>

      {/* === ADDITIONAL SOLDIER DETAILS — post-battle camp life === */}

      {/* Soldier tending wounds — bandaging arm near fire 4 */}
      <g opacity="0.6" transform="translate(355, 288)">
        {/* Seated */}
        <path d="M10 8 Q9 2 12 -2 Q14 -5 15 -2 L17 8 Z" fill="#0a0c08" />
        <circle cx="13" cy="-6" r="3" fill="#0a0c08" />
        {/* One arm extended — being bandaged */}
        <path d="M15 0 Q18 -1 20 0" fill="none" stroke="#0a0c08" strokeWidth="1.2" opacity="0.5" />
        {/* White bandage strip */}
        <path d="M18 -1 Q19 0 20 -1" fill="none" stroke="#5a5a50" strokeWidth="0.8" opacity="0.3" />
      </g>

      {/* Soldier sleeping — exhaustion after first battle, wrapped in blanket */}
      <g opacity="0.55" transform="translate(470, 288)">
        {/* Blanket-wrapped body — lying on ground */}
        <ellipse cx="0" cy="0" rx="12" ry="3.5" fill="#14120e" />
        {/* Head visible at end */}
        <circle cx="-10" cy="-1" r="3" fill="#0a0c08" />
        {/* Blanket folds */}
        <path d="M-6 -3 Q-2 -4 2 -3 Q6 -2 10 -3" fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.3" />
        <path d="M-6 2 Q-2 3 2 2 Q6 1 10 2" fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.25" />
        {/* Musket beside him */}
        <line x1="-12" y1="5" x2="10" y2="4" stroke="#0a0c08" strokeWidth="0.8" opacity="0.3" />
      </g>

      {/* Soldier smoking pipe — silhouette with glowing bowl */}
      <g opacity="0.65" transform="translate(445, 240)">
        {/* Standing body */}
        <path d="M-2 25 Q-3 15 -1 8 Q1 3 2 8 L4 25 Z" fill="#0a0c08" />
        <circle cx="0" cy="1" r="3.8" fill="#0a0c08" />
        {/* Pipe — extending from face */}
        <line x1="3" y1="0" x2="8" y2="1" stroke="#2a2018" strokeWidth="0.8" opacity="0.5" />
        {/* Glowing pipe bowl */}
        <circle cx="8" cy="1" r="1" fill="#c08040" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.5;0.3;0.2;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        {/* Pipe smoke wisps */}
        <path d="M8 -1 Q10 -4 9 -7" fill="none" stroke="#3a4555" strokeWidth="0.4" opacity="0.08">
          <animate attributeName="d" values="M8 -1 Q10 -4 9 -7;M8 -1 Q9 -4 10 -7;M8 -1 Q10 -4 9 -7" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.04;0.08" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M9 0 Q11 -3 10 -5" fill="none" stroke="#3a4555" strokeWidth="0.3" opacity="0.06">
          <animate attributeName="d" values="M9 0 Q11 -3 10 -5;M9 0 Q10 -3 11 -5;M9 0 Q11 -3 10 -5" dur="3.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === WEATHER EFFECTS — wind gusts rustling the canopy === */}

      {/* Tree sway — left valley tree responds to gusts */}
      <g opacity="0.6">
        <path d="M340 230 L346 200 L352 230" fill="#121a15">
          <animate attributeName="d" values="M340 230 L346 200 L352 230;M339 230 L345 200 L351 230;M341 230 L347 200 L353 230;M340 230 L346 200 L352 230" dur="6s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Rain intensity variation — heavier gusts */}
      <rect x="100" y="0" width="200" height="400" fill="url(#ch2_heavyRain)" opacity="0.08">
        <animate attributeName="x" values="100;300;500;100" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.15;0.08;0.03;0.08" dur="12s" repeatCount="indefinite" />
      </rect>

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
