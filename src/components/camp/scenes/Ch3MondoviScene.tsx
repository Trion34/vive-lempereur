import React from 'react';

/**
 * Ch.3 — Mondovi, Piedmont plain (April 1796)
 * Warm golden evening after a victorious day of plunder.
 * Rolling farmland, golden wheat, distant village with bell tower,
 * cypress-lined road, Italian farmhouse, campfire feast.
 * The army eats well for the first time — wine, bread, chickens, celebration.
 * Mood: Warm, joyful, raucous — the first comfort after months of starvation.
 * The HAPPIEST scene in the entire campaign.
 */
export function Ch3MondoviScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Warm golden-amber sunset sky */}
        <linearGradient id="ch3_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e0a18" />
          <stop offset="12%" stopColor="#1e1430" />
          <stop offset="30%" stopColor="#4a2538" />
          <stop offset="50%" stopColor="#8a4535" />
          <stop offset="70%" stopColor="#b86838" />
          <stop offset="85%" stopColor="#d08842" />
          <stop offset="100%" stopColor="#e0b050" />
        </linearGradient>
        {/* Sunset glow — warm radiance on right horizon */}
        <radialGradient id="ch3_sunGlow" cx="0.75" cy="0.58" r="0.35">
          <stop offset="0%" stopColor="#e0b050" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#d09040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </radialGradient>
        {/* Distant mountains — purple haze */}
        <linearGradient id="ch3_mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3550" />
          <stop offset="100%" stopColor="#5a4555" />
        </linearGradient>
        {/* Rolling farmland */}
        <linearGradient id="ch3_field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a7535" />
          <stop offset="50%" stopColor="#4a5528" />
          <stop offset="100%" stopColor="#3a4520" />
        </linearGradient>
        {/* Golden wheat field */}
        <linearGradient id="ch3_wheat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a08530" />
          <stop offset="100%" stopColor="#7a6525" />
        </linearGradient>
        {/* Camp ground — warm earth */}
        <linearGradient id="ch3_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3525" />
          <stop offset="60%" stopColor="#2e2a1c" />
          <stop offset="100%" stopColor="#221e14" />
        </linearGradient>
        {/* Campfire glow */}
        <radialGradient id="ch3_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#d09040" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#b07030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06020" stopOpacity="0" />
        </radialGradient>
        {/* Farmhouse window glow */}
        <radialGradient id="ch3_windowGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </radialGradient>
        {/* Farmhouse door glow — warm light spilling out */}
        <radialGradient id="ch3_doorGlow" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#d09040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </radialGradient>
        {/* Firefly glow */}
        <radialGradient id="ch3_fireflyGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0d060" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a0b040" stopOpacity="0" />
        </radialGradient>
        {/* Warm vignette — gentle, not dark */}
        <radialGradient id="ch3_vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a0a00" stopOpacity="0.25" />
        </radialGradient>
        {/* Terracotta roof */}
        <linearGradient id="ch3_roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a4a2a" />
          <stop offset="100%" stopColor="#6a3820" />
        </linearGradient>
        {/* Wine pool gradient */}
        <radialGradient id="ch3_winePool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a1818" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4a1515" stopOpacity="0.1" />
        </radialGradient>
        {/* Banner fabric */}
        <linearGradient id="ch3_banner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3568" />
          <stop offset="50%" stopColor="#1a2548" />
          <stop offset="100%" stopColor="#2a3568" />
        </linearGradient>
        {/* Sunflower head gradient */}
        <radialGradient id="ch3_sunflowerHead" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a3a18" />
          <stop offset="40%" stopColor="#5a3a18" />
          <stop offset="50%" stopColor="#c09830" />
          <stop offset="100%" stopColor="#a08028" />
        </radialGradient>
        {/* Hay bale color */}
        <linearGradient id="ch3_hayBale" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a08840" />
          <stop offset="100%" stopColor="#7a6830" />
        </linearGradient>
        {/* Farmer cart wood */}
        <linearGradient id="ch3_cartWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4528" />
          <stop offset="100%" stopColor="#4a3820" />
        </linearGradient>
        {/* Spilled wine pool — darker, larger */}
        <radialGradient id="ch3_spilledWine" cx="0.4" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4a1015" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#3a0a10" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3a0a10" stopOpacity="0.05" />
        </radialGradient>
        {/* Lantern warm glow */}
        <radialGradient id="ch3_lanternGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a040" stopOpacity="0.7" />
          <stop offset="30%" stopColor="#d09030" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#c07828" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a06020" stopOpacity="0" />
        </radialGradient>
        {/* Austrian flag — white and red */}
        <linearGradient id="ch3_austrianFlag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8c0b0" />
          <stop offset="33%" stopColor="#c8c0b0" />
          <stop offset="34%" stopColor="#8a2828" />
          <stop offset="66%" stopColor="#8a2828" />
          <stop offset="67%" stopColor="#c8c0b0" />
          <stop offset="100%" stopColor="#c8c0b0" />
        </linearGradient>
        {/* Smoke wisp gradient */}
        <linearGradient id="ch3_smokeWisp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8a8070" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8a8070" stopOpacity="0" />
        </linearGradient>
        {/* Crepuscular light rays from sunset */}
        <linearGradient id="ch3_lightRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0b050" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#d09040" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </linearGradient>
        {/* Stream/brook water */}
        <linearGradient id="ch3_stream" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a5a68" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#5a6a78" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4a5a68" stopOpacity="0.2" />
        </linearGradient>
        {/* Distant haze — atmospheric depth */}
        <linearGradient id="ch3_haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6848" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#8a6848" stopOpacity="0" />
        </linearGradient>
        {/* Stone wall gradient */}
        <linearGradient id="ch3_stoneWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5548" />
          <stop offset="100%" stopColor="#4a4538" />
        </linearGradient>
        {/* Distant campfire glow */}
        <radialGradient id="ch3_distantFire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e09040" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#d08030" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c07020" stopOpacity="0" />
        </radialGradient>
        {/* Horse body gradient */}
        <linearGradient id="ch3_horse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3028" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>
        {/* Second sunset glow — left horizon warmth */}
        <radialGradient id="ch3_sunGlow2" cx="0.2" cy="0.62" r="0.3">
          <stop offset="0%" stopColor="#d08840" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#c07830" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#b06820" stopOpacity="0" />
        </radialGradient>
        {/* Soil texture overlay */}
        <radialGradient id="ch3_soilPatch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3a3020" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2e2a1c" stopOpacity="0" />
        </radialGradient>
        {/* Ground mist — low-lying evening vapor */}
        <linearGradient id="ch3_groundMist" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#a09070" stopOpacity="0.06" />
          <stop offset="40%" stopColor="#a09070" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#a09070" stopOpacity="0" />
        </linearGradient>
        {/* Warm reflected light from fire on underside of smoke */}
        <radialGradient id="ch3_smokeReflect" cx="0.5" cy="0.8" r="0.6">
          <stop offset="0%" stopColor="#d09040" stopOpacity="0.06" />
          <stop offset="60%" stopColor="#c08030" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#b07020" stopOpacity="0" />
        </radialGradient>
        {/* Bark texture gradient — for tree trunks */}
        <linearGradient id="ch3_barkTexture" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2018" />
          <stop offset="25%" stopColor="#3a3025" />
          <stop offset="50%" stopColor="#2a2018" />
          <stop offset="75%" stopColor="#3a3025" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>
        {/* Trampled earth — darker worn patches */}
        <radialGradient id="ch3_trampledEarth" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1a1508" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#1a1508" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1a1508" stopOpacity="0" />
        </radialGradient>
        {/* Evening dew highlight on grass */}
        <radialGradient id="ch3_dewGlow" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#e0c870" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0c870" stopOpacity="0" />
        </radialGradient>
        {/* Battlefield debris rust */}
        <linearGradient id="ch3_rustMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4030" />
          <stop offset="100%" stopColor="#4a3020" />
        </linearGradient>
        {/* Warm ambient bounce — reflected firelight on nearby surfaces */}
        <radialGradient id="ch3_fireBounce" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#d09040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch3_sky)" />
      <rect width="800" height="400" fill="url(#ch3_sunGlow)" />
      <rect width="800" height="400" fill="url(#ch3_sunGlow2)" />

      {/* Soft pink-gold clouds — richer detail */}
      <ellipse cx="180" cy="70" rx="120" ry="12" fill="#8a4545" opacity="0.18" />
      <ellipse cx="350" cy="55" rx="100" ry="10" fill="#a05550" opacity="0.15" />
      <ellipse cx="550" cy="80" rx="140" ry="14" fill="#a05040" opacity="0.2" />
      <ellipse cx="650" cy="60" rx="90" ry="8" fill="#b06050" opacity="0.18" />
      <ellipse cx="300" cy="40" rx="160" ry="5" fill="#60354a" opacity="0.15" />
      {/* Extra cloud wisps — golden underlighting */}
      <ellipse cx="420" cy="95" rx="80" ry="6" fill="#c07545" opacity="0.12" />
      <ellipse cx="100" cy="88" rx="70" ry="5" fill="#b06540" opacity="0.1" />
      <ellipse cx="720" cy="45" rx="60" ry="4" fill="#80455a" opacity="0.12" />
      <ellipse cx="500" cy="42" rx="110" ry="3" fill="#704060" opacity="0.1" />
      {/* Warm cloud bellies catching last light */}
      <ellipse cx="200" cy="75" rx="60" ry="4" fill="#d09050" opacity="0.08" />
      <ellipse cx="600" cy="85" rx="50" ry="3" fill="#d09050" opacity="0.07" />

      {/* Deep layered cloud shadows — darker tops, lit undersides */}
      <ellipse cx="340" cy="62" rx="85" ry="7" fill="#3a1828" opacity="0.08" />
      <ellipse cx="340" cy="66" rx="75" ry="4" fill="#c07545" opacity="0.06" />
      <ellipse cx="480" cy="50" rx="65" ry="5" fill="#3a1828" opacity="0.06" />
      <ellipse cx="480" cy="53" rx="55" ry="3" fill="#c07545" opacity="0.05" />
      {/* Sunset color banding — layered atmosphere */}
      <rect x="0" y="90" width="800" height="8" fill="#a05040" opacity="0.04" />
      <rect x="0" y="100" width="800" height="6" fill="#b06838" opacity="0.03" />
      {/* Warm horizon bloom — scattered light in atmosphere */}
      <ellipse cx="620" cy="108" rx="120" ry="15" fill="#d09050" opacity="0.04" />
      <ellipse cx="200" cy="112" rx="100" ry="12" fill="#c08040" opacity="0.03" />

      {/* Birds in the golden sky — animated wing beats */}
      <path d="M480 48 Q484 44 488 48 Q492 44 496 48" fill="none" stroke="#2a1820" strokeWidth="0.8" opacity="0.25">
        <animate attributeName="d"
          values="M480 48 Q484 44 488 48 Q492 44 496 48;M480 48 Q484 46 488 48 Q492 46 496 48;M480 48 Q484 44 488 48 Q492 44 496 48"
          dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M510 55 Q513 52 516 55 Q519 52 522 55" fill="none" stroke="#2a1820" strokeWidth="0.7" opacity="0.2">
        <animate attributeName="d"
          values="M510 55 Q513 52 516 55 Q519 52 522 55;M510 55 Q513 53.5 516 55 Q519 53.5 522 55;M510 55 Q513 52 516 55 Q519 52 522 55"
          dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M460 62 Q463 59 466 62 Q469 59 472 62" fill="none" stroke="#2a1820" strokeWidth="0.6" opacity="0.18">
        <animate attributeName="d"
          values="M460 62 Q463 59 466 62 Q469 59 472 62;M460 62 Q463 61 466 62 Q469 61 472 62;M460 62 Q463 59 466 62 Q469 59 472 62"
          dur="1.6s" repeatCount="indefinite" />
      </path>

      {/* Emerging stars */}
      <circle cx="120" cy="18" r="1.2" fill="#d0c898" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="12" r="1" fill="#d0c898" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="22" r="0.8" fill="#d0c898" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="15" r="1.1" fill="#d0c898" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.2;0.45" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="35" r="0.9" fill="#d0c898" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="8" r="0.7" fill="#d0c898" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="4.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="740" cy="28" r="0.9" fill="#d0c898" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="3.2s" repeatCount="indefinite" />
      </circle>
      {/* Evening star — bright Venus */}
      <circle cx="200" cy="48" r="1.8" fill="#e0d8a8" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.5;0.7" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* === CREPUSCULAR LIGHT RAYS — golden shafts from sunset === */}
      <polygon points="620,100 650,100 700,400 640,400" fill="url(#ch3_lightRay)" opacity="0.06" />
      <polygon points="680,90 720,90 780,400 720,400" fill="url(#ch3_lightRay)" opacity="0.05" />
      <polygon points="560,110 590,110 630,400 560,400" fill="url(#ch3_lightRay)" opacity="0.04" />
      <polygon points="740,85 770,85 800,400 770,400" fill="url(#ch3_lightRay)" opacity="0.035" />
      <polygon points="500,115 525,115 550,400 490,400" fill="url(#ch3_lightRay)" opacity="0.03" />
      {/* Broader diffuse light ray — golden wash from right */}
      <polygon points="650,95 750,95 800,400 680,400" fill="url(#ch3_lightRay)" opacity="0.025" />
      {/* Narrow bright shaft — catching dust particles */}
      <polygon points="590,105 600,105 620,350 585,350" fill="#e0b050" opacity="0.012" />

      {/* Additional high-altitude cloud wisps — cirrus streaks */}
      <path d="M50 30 Q120 26 200 32 Q280 28 350 34" fill="none" stroke="#5a3548" strokeWidth="0.6" opacity="0.1" />
      <path d="M400 20 Q480 16 560 22 Q620 18 700 24" fill="none" stroke="#5a3548" strokeWidth="0.5" opacity="0.08" />
      <path d="M150 15 Q220 12 290 17" fill="none" stroke="#604060" strokeWidth="0.4" opacity="0.07" />

      {/* More birds — a distant flock migrating, animated drift */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;15,2;30,0" dur="20s" repeatCount="indefinite" />
        <path d="M130 72 Q133 69 136 72 Q139 69 142 72" fill="none" stroke="#2a1820" strokeWidth="0.5" opacity="0.15" />
        <path d="M140 76 Q142 74 144 76 Q146 74 148 76" fill="none" stroke="#2a1820" strokeWidth="0.4" opacity="0.12" />
        <path d="M122 78 Q124 76 126 78 Q128 76 130 78" fill="none" stroke="#2a1820" strokeWidth="0.4" opacity="0.1" />
        <path d="M148 73 Q150 71 152 73" fill="none" stroke="#2a1820" strokeWidth="0.35" opacity="0.1" />
        <path d="M135 68 Q137 66 139 68" fill="none" stroke="#2a1820" strokeWidth="0.35" opacity="0.08" />
      </g>

      {/* Animated soaring bird — circling lazily over the battlefield */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;20,-5;40,0;20,5;0,0" dur="12s" repeatCount="indefinite" />
        <path d="M350 90 Q354 86 358 90 Q362 86 366 90" fill="none" stroke="#2a1820" strokeWidth="0.7" opacity="0.12">
          <animate attributeName="d"
            values="M350 90 Q354 86 358 90 Q362 86 366 90;M350 90 Q354 88 358 90 Q362 88 366 90;M350 90 Q354 86 358 90 Q362 86 366 90"
            dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Second soaring bird — further away, slower */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;-15,3;-30,0;-15,-3;0,0" dur="18s" repeatCount="indefinite" />
        <path d="M700 75 Q703 72 706 75 Q709 72 712 75" fill="none" stroke="#2a1820" strokeWidth="0.5" opacity="0.08">
          <animate attributeName="d"
            values="M700 75 Q703 72 706 75 Q709 72 712 75;M700 75 Q703 74 706 75 Q709 74 712 75;M700 75 Q703 72 706 75 Q709 72 712 75"
            dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Crow on a fencepost — perched, occasional wing flap */}
      <path d="M547 228 Q545 226 547 224 Q549 223 551 224 Q553 226 551 228 Z" fill="#1a1815" opacity="0.2" />
      <circle cx="552" cy="224" r="1" fill="#1a1815" opacity="0.2" />
      <path d="M552.5 224 Q554 223.5 553 225" fill="none" stroke="#5a4530" strokeWidth="0.3" opacity="0.12" />

      {/* === DISTANT ALPS === */}
      <path d="M0 140 Q40 118 100 128 Q150 105 220 118 Q270 100 330 115 Q380 95 440 110 Q490 98 550 112 Q600 92 660 108 Q720 95 780 115 L800 120 L800 170 L0 170 Z"
        fill="url(#ch3_mtn)" opacity="0.55" />
      <path d="M148 107 Q155 100 162 107" fill="#7a6878" opacity="0.25" />
      <path d="M378 97 Q385 90 392 97" fill="#7a6878" opacity="0.25" />
      <path d="M598 94 Q605 87 612 94" fill="#7a6878" opacity="0.2" />
      {/* Additional snow caps on higher peaks */}
      <path d="M268 101 Q270 98 272 101" fill="#8a7a80" opacity="0.18" />
      <path d="M488 99 Q490 96 492 99" fill="#8a7a80" opacity="0.15" />
      <path d="M718 96 Q720 93 722 96" fill="#8a7a80" opacity="0.15" />
      {/* Foothills — nearer, warmer purple tones */}
      <path d="M0 170 Q60 158 150 165 Q250 152 380 160 Q500 150 620 158 Q720 152 800 160 L800 180 L0 180 Z"
        fill="#5a4548" opacity="0.35" />
      {/* Foothill ridge detail — undulating silhouette variation */}
      <path d="M0 172 Q40 168 80 170 Q120 166 160 169 Q200 165 240 168" fill="none" stroke="#6a5558" strokeWidth="0.5" opacity="0.12" />
      <path d="M400 162 Q440 158 480 161 Q520 157 560 160 Q600 156 640 159" fill="none" stroke="#6a5558" strokeWidth="0.5" opacity="0.1" />
      {/* Mountain face shadow — purple depth on north-facing slopes */}
      <path d="M200 120 Q220 110 230 118 L225 128 Q215 122 200 128 Z" fill="#3a2540" opacity="0.12" />
      <path d="M450 112 Q470 102 480 110 L475 120 Q465 114 450 120 Z" fill="#3a2540" opacity="0.1" />
      {/* Warm light catching mountain peaks — sunset rim light */}
      <path d="M149 107 Q155 100 161 107" fill="none" stroke="#8a6050" strokeWidth="0.6" opacity="0.12" />
      <path d="M379 97 Q385 90 391 97" fill="none" stroke="#8a6050" strokeWidth="0.6" opacity="0.1" />
      {/* Atmospheric haze band between mountains and farmland */}
      <rect x="0" y="160" width="800" height="20" fill="url(#ch3_haze)" />
      {/* Layered mist in mountain valleys — depth cue */}
      <ellipse cx="300" cy="155" rx="60" ry="5" fill="#7a6858" opacity="0.06" />
      <ellipse cx="550" cy="152" rx="50" ry="4" fill="#7a6858" opacity="0.05" />
      <ellipse cx="100" cy="158" rx="40" ry="4" fill="#7a6858" opacity="0.05" />
      {/* Distant smoke from the village — battle aftermath haze */}
      <path d="M625 140 Q630 128 625 118 Q632 110 628 102" fill="none" stroke="#7a7068" strokeWidth="1.5" opacity="0.06">
        <animate attributeName="d"
          values="M625 140 Q630 128 625 118 Q632 110 628 102;M625 140 Q620 126 627 116 Q622 108 628 100;M625 140 Q630 128 625 118 Q632 110 628 102"
          dur="8s" repeatCount="indefinite" />
      </path>
      {/* Additional battle smoke column — wider, from further in the village */}
      <path d="M650 150 Q654 138 648 126 Q652 116 646 106" fill="none" stroke="#7a7068" strokeWidth="2" opacity="0.04">
        <animate attributeName="d"
          values="M650 150 Q654 138 648 126 Q652 116 646 106;M650 150 Q646 136 652 124 Q648 114 654 104;M650 150 Q654 138 648 126 Q652 116 646 106"
          dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.06;0.04" dur="9s" repeatCount="indefinite" />
      </path>
      {/* Smoke pall drifting left from village — wide dissipating cloud */}
      <ellipse cx="580" cy="110" rx="40" ry="8" fill="#7a7068" opacity="0.02">
        <animate attributeName="cx" values="580;560;580" dur="20s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.02;0.03;0.02" dur="20s" repeatCount="indefinite" />
      </ellipse>

      {/* === DISTANT VILLAGE WITH BELL TOWER === */}
      {/* Town wall remnant — Piedmontese fortified town perimeter */}
      <path d="M590 168 Q605 166 620 168 Q640 167 660 168 Q680 166 695 168"
        fill="none" stroke="#5a4a3a" strokeWidth="1.2" opacity="0.25" />
      {/* Wall crenellations — small tooth pattern */}
      <path d="M595 167 L595 165 L598 165 L598 167 M605 166 L605 164 L608 164 L608 166 M615 167 L615 165 L618 165 L618 167"
        fill="#5a4a3a" opacity="0.15" />
      {/* Town gate — arched entrance */}
      <path d="M642 168 Q645 163 648 168" fill="#3a3028" opacity="0.2" />
      <line x1="642" y1="168" x2="642" y2="164" stroke="#5a4a3a" strokeWidth="0.6" opacity="0.2" />
      <line x1="648" y1="168" x2="648" y2="164" stroke="#5a4a3a" strokeWidth="0.6" opacity="0.2" />

      {/* Main buildings — front row */}
      <rect x="620" y="154" width="10" height="14" fill="#5a4a3a" opacity="0.55" />
      <path d="M618 154 L625 146 L632 154" fill="#6a5a48" opacity="0.55" />
      <rect x="636" y="156" width="8" height="12" fill="#5a4a3a" opacity="0.5" />
      <path d="M634 156 L640 150 L646 156" fill="#6a5a48" opacity="0.5" />
      <rect x="650" y="158" width="7" height="10" fill="#5a4a3a" opacity="0.45" />
      <rect x="662" y="155" width="9" height="13" fill="#5a4a3a" opacity="0.5" />
      <path d="M661 155 L666 148 L672 155" fill="#6a5a48" opacity="0.5" />
      {/* Additional town buildings — deeper row, partially occluded */}
      <rect x="616" y="148" width="7" height="10" fill="#4a3a30" opacity="0.35" />
      <path d="M614 148 L620 142 L625 148" fill="#5a4a38" opacity="0.35" />
      <rect x="644" y="150" width="6" height="8" fill="#4a3a30" opacity="0.32" />
      <path d="M643 150 L647 145 L651 150" fill="#5a4a38" opacity="0.32" />
      <rect x="657" y="149" width="8" height="9" fill="#4a3a30" opacity="0.3" />
      <path d="M656 149 L661 143 L666 149" fill="#5a4a38" opacity="0.3" />
      {/* Tall narrow townhouse — Piedmontese style */}
      <rect x="631" y="148" width="5" height="20" fill="#5a4a3a" opacity="0.48" />
      <path d="M630 148 L633.5 140 L637 148" fill="#6a5a48" opacity="0.48" />
      {/* Small shuttered windows on townhouses */}
      <rect x="632" y="152" width="1.5" height="2" fill="#3a2a20" opacity="0.3" />
      <rect x="634.5" y="152" width="1.5" height="2" fill="#3a2a20" opacity="0.3" />
      <rect x="632" y="158" width="1.5" height="2" fill="#3a2a20" opacity="0.25" />
      <rect x="622" y="158" width="1.5" height="2" fill="#3a2a20" opacity="0.25" />
      <rect x="625" y="158" width="1.5" height="2" fill="#3a2a20" opacity="0.22" />
      {/* Palazzo with balcony — larger building, civic */}
      <rect x="670" y="150" width="12" height="18" fill="#5a4a3a" opacity="0.45" />
      <path d="M669 150 L676 142 L683 150" fill="#6a5a48" opacity="0.45" />
      <line x1="672" y1="157" x2="680" y2="157" stroke="#6a5a48" strokeWidth="0.4" opacity="0.25" />
      {/* Balcony railing — iron work */}
      <path d="M672 157 L672 155 M674 157 L674 155 M676 157 L676 155 M678 157 L678 155 M680 157 L680 155"
        fill="none" stroke="#4a4038" strokeWidth="0.3" opacity="0.2" />

      {/* Church bell tower — taller, more detailed steeple */}
      <rect x="607" y="140" width="6" height="28" fill="#5a4a3a" opacity="0.6" />
      {/* Tower arched window — belfry opening */}
      <path d="M608.5 143 Q610 141 611.5 143" fill="#3a2a20" opacity="0.35" />
      <path d="M608.5 147 Q610 145 611.5 147" fill="#3a2a20" opacity="0.3" />
      {/* Steeple — pointed spire rising higher */}
      <path d="M605 140 L610 126 L615 140" fill="#6a5a48" opacity="0.6" />
      {/* Steeple cross at apex */}
      <line x1="610" y1="126" x2="610" y2="121" stroke="#7a6a50" strokeWidth="0.8" opacity="0.5" />
      <line x1="608" y1="123" x2="612" y2="123" stroke="#7a6a50" strokeWidth="0.6" opacity="0.5" />
      {/* Steeple weathervane ball */}
      <circle cx="610" cy="121" r="0.6" fill="#8a7a50" opacity="0.4" />
      {/* Clock face on tower */}
      <circle cx="610" cy="152" r="2" fill="#c8c0a8" opacity="0.15" />
      <line x1="610" y1="152" x2="610" y2="150.5" stroke="#4a3a30" strokeWidth="0.3" opacity="0.12" />
      <line x1="610" y1="152" x2="611" y2="152.5" stroke="#4a3a30" strokeWidth="0.3" opacity="0.1" />

      {/* === BATTLE AFTERMATH SMOKE — columns rising from damaged parts of town === */}
      {/* Thick smoke column from damaged building — left side of village */}
      <path d="M618 148 Q622 134 616 120 Q620 108 614 96" fill="none" stroke="#6a6058" strokeWidth="2.5" opacity="0.06">
        <animate attributeName="d"
          values="M618 148 Q622 134 616 120 Q620 108 614 96;M618 148 Q614 132 620 118 Q616 106 620 94;M618 148 Q622 134 616 120 Q620 108 614 96"
          dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.09;0.06" dur="10s" repeatCount="indefinite" />
      </path>
      {/* Thinner smoke wisp — near palazzo */}
      <path d="M678 142 Q682 130 676 118" fill="none" stroke="#7a7068" strokeWidth="1.2" opacity="0.04">
        <animate attributeName="d"
          values="M678 142 Q682 130 676 118;M678 142 Q674 128 680 116;M678 142 Q682 130 676 118"
          dur="7s" repeatCount="indefinite" />
      </path>
      {/* Broad smoke haze drifting from village — battle residue clearing */}
      <ellipse cx="650" cy="120" rx="50" ry="12" fill="#7a7068" opacity="0.03">
        <animate attributeName="cx" values="650;640;650" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="15s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="630" cy="105" rx="35" ry="8" fill="#7a7068" opacity="0.025">
        <animate attributeName="cx" values="630;620;630" dur="12s" repeatCount="indefinite" />
      </ellipse>

      {/* === CHURCH BELL RINGING — animated motion lines === */}
      {/* Bell shape at top of tower */}
      <path d="M608 129 Q610 127 612 129" fill="#6a5a48" opacity="0.5" />
      {/* Ringing motion arcs — left side */}
      <path d="M604 126 Q602 123 604 120" fill="none" stroke="#8a7a60" strokeWidth="0.6" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.08;0.3" dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M601 128 Q598 124 601 118" fill="none" stroke="#8a7a60" strokeWidth="0.5" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.05;0.22" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* Ringing motion arcs — right side */}
      <path d="M616 126 Q618 123 616 120" fill="none" stroke="#8a7a60" strokeWidth="0.6" opacity="0.3">
        <animate attributeName="opacity" values="0.08;0.3;0.08" dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M619 128 Q622 124 619 118" fill="none" stroke="#8a7a60" strokeWidth="0.5" opacity="0.22">
        <animate attributeName="opacity" values="0.05;0.22;0.05" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* Small radial sound lines */}
      <line x1="606" y1="124" x2="603" y2="122" stroke="#8a7a60" strokeWidth="0.4" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="614" y1="124" x2="617" y2="122" stroke="#8a7a60" strokeWidth="0.4" opacity="0.2">
        <animate attributeName="opacity" values="0.05;0.2;0.05" dur="1s" repeatCount="indefinite" />
      </line>

      {/* Village window glows */}
      <rect x="623" y="160" width="2" height="2" fill="#d09050" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.18;0.35" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="665" y="160" width="2" height="2" fill="#d09050" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="5s" repeatCount="indefinite" />
      </rect>
      {/* Distant farmsteads on hills */}
      <rect x="380" y="166" width="6" height="5" fill="#5a4a3a" opacity="0.3" />
      <path d="M378 166 L383 162 L388 166" fill="#6a5a48" opacity="0.3" />
      <rect x="130" y="162" width="5" height="4" fill="#5a4a3a" opacity="0.25" />
      <path d="M128 162 L133 159 L137 162" fill="#6a5a48" opacity="0.25" />

      {/* === ADDITIONAL VILLAGE DETAILS === */}
      {/* Extra buildings at edges of village */}
      <rect x="598" y="158" width="7" height="10" fill="#5a4a3a" opacity="0.45" />
      <path d="M596 158 L602 152 L607 158" fill="#6a5a48" opacity="0.45" />
      <rect x="674" y="157" width="6" height="11" fill="#5a4a3a" opacity="0.42" />
      <path d="M673 157 L677 152 L682 157" fill="#6a5a48" opacity="0.42" />
      {/* Damaged building — partially collapsed roof, battle scarring */}
      <rect x="686" y="156" width="8" height="12" fill="#5a4a3a" opacity="0.38" />
      <path d="M685 156 L690 148 L695 156" fill="#6a5a48" opacity="0.3" />
      <path d="M690 148 L693 152 L695 150" fill="none" stroke="#4a3a30" strokeWidth="0.5" opacity="0.2" />
      {/* Collapsed wall rubble near damaged building */}
      <circle cx="696" cy="168" r="1" fill="#5a5048" opacity="0.12" />
      <circle cx="698" cy="167" r="0.8" fill="#5a5048" opacity="0.1" />
      <circle cx="694" cy="169" r="0.7" fill="#5a5048" opacity="0.1" />
      {/* Piedmontese blue-white flag on town hall — drooping in defeat */}
      <line x1="676" y1="142" x2="676" y2="136" stroke="#5a4a3a" strokeWidth="0.6" opacity="0.35" />
      <path d="M676 136 Q679 137 682 136 Q679 138 682 140 Q679 139 676 140" fill="#3a5078" opacity="0.12">
        <animate attributeName="d"
          values="M676 136 Q679 137 682 136 Q679 138 682 140 Q679 139 676 140;M676 136 Q680 137 683 137 Q680 139 683 141 Q680 140 676 140;M676 136 Q679 137 682 136 Q679 138 682 140 Q679 139 676 140"
          dur="5s" repeatCount="indefinite" />
      </path>
      {/* White stripe on Piedmontese flag */}
      <path d="M676 138 Q679 139 681 138" fill="#c8c0a8" opacity="0.06">
        <animate attributeName="d"
          values="M676 138 Q679 139 681 138;M676 138 Q680 139 682 139;M676 138 Q679 139 681 138"
          dur="5s" repeatCount="indefinite" />
      </path>
      {/* Archway/loggia — Piedmontese arcade on ground level */}
      <path d="M624 164 Q626 160 628 164" fill="#3a2a20" opacity="0.15" />
      <path d="M629 164 Q631 160 633 164" fill="#3a2a20" opacity="0.13" />
      {/* Terracotta chimney pots on roofline */}
      <rect x="625" y="145" width="1.5" height="3" fill="#7a4a2a" opacity="0.2" />
      <rect x="643" y="149" width="1.5" height="2.5" fill="#7a4a2a" opacity="0.18" />
      <rect x="664" y="147" width="1.5" height="2.5" fill="#7a4a2a" opacity="0.18" />
      {/* Low stone wall around village */}
      <path d="M596 168 Q620 170 640 168 Q660 169 680 168" fill="none" stroke="#5a5048" strokeWidth="0.8" opacity="0.2" />
      {/* Garden patches behind village — tiny cultivated squares */}
      <rect x="640" y="170" width="8" height="5" fill="#4a5a30" opacity="0.15" />
      <rect x="655" y="168" width="6" height="4" fill="#506028" opacity="0.12" />
      {/* Village path — small track connecting buildings */}
      <path d="M610 168 Q625 166 640 168 Q655 167 670 168" fill="none" stroke="#6a5a40" strokeWidth="0.8" opacity="0.12" />
      {/* Distant farmstead chimney smoke — left */}
      <path d="M133 159 Q135 154 133 150" fill="none" stroke="#7a7068" strokeWidth="0.5" opacity="0.08" />
      {/* More distant farmsteads */}
      <rect x="480" y="170" width="4" height="3" fill="#5a4a3a" opacity="0.2" />
      <path d="M479 170 L482 167 L485 170" fill="#6a5a48" opacity="0.2" />
      <rect x="50" y="168" width="4" height="3" fill="#5a4a3a" opacity="0.18" />
      <path d="M49 168 L52 165 L55 168" fill="#6a5a48" opacity="0.18" />

      {/* === DISTANT SOLDIERS ON THE ROAD — tiny figures marching/returning === */}
      {/* Group of 4-5 small soldiers on the winding road — distant mid-ground */}
      <circle cx="500" cy="186" r="1.2" fill="#1a1815" opacity="0.2" />
      <path d="M500 187 L500 191" stroke="#1a1815" strokeWidth="0.6" opacity="0.18" />
      <circle cx="505" cy="185" r="1.1" fill="#1a1815" opacity="0.18" />
      <path d="M505 186 L505 190" stroke="#1a1815" strokeWidth="0.6" opacity="0.16" />
      <circle cx="510" cy="186" r="1" fill="#1a1815" opacity="0.16" />
      <path d="M510 187 L510 190" stroke="#1a1815" strokeWidth="0.5" opacity="0.14" />
      <circle cx="496" cy="187" r="1" fill="#1a1815" opacity="0.17" />
      <path d="M496 188 L496 191" stroke="#1a1815" strokeWidth="0.5" opacity="0.15" />
      {/* Distant horseman on road — officer returning */}
      <path d="M440 194 Q438 190 440 186 Q442 184 444 186 Q446 188 446 194 Z" fill="#2a2218" opacity="0.18" />
      <circle cx="442" cy="184" r="1.2" fill="#2a2218" opacity="0.18" />
      {/* Horse body beneath rider */}
      <path d="M437 194 Q435 192 437 188 Q442 186 447 188 Q449 192 447 194 Z" fill="#3a3028" opacity="0.14" />
      {/* Horse legs — tiny sticks */}
      <line x1="438" y1="194" x2="437" y2="198" stroke="#3a3028" strokeWidth="0.4" opacity="0.12" />
      <line x1="446" y1="194" x2="447" y2="198" stroke="#3a3028" strokeWidth="0.4" opacity="0.12" />

      {/* === ROLLING PIEDMONTESE HILLS — terraced landscape === */}
      {/* Distant rolling hill silhouette — between foothills and farmland */}
      <path d="M0 172 Q60 164 140 168 Q220 158 320 164 Q400 156 480 162 Q560 154 660 160 Q740 156 800 162 L800 175 L0 175 Z"
        fill="#5a5838" opacity="0.2" />
      {/* Terrace lines on distant hills — Piedmontese agricultural terracing */}
      <path d="M200 162 Q240 158 280 162" fill="none" stroke="#4a4a28" strokeWidth="0.4" opacity="0.1" />
      <path d="M200 166 Q240 162 280 166" fill="none" stroke="#4a4a28" strokeWidth="0.4" opacity="0.08" />
      <path d="M460 158 Q500 154 540 158" fill="none" stroke="#4a4a28" strokeWidth="0.4" opacity="0.09" />
      <path d="M460 162 Q500 158 540 162" fill="none" stroke="#4a4a28" strokeWidth="0.4" opacity="0.07" />
      {/* Distant spring blossoming trees on terraces — cherry/almond */}
      <circle cx="250" cy="160" r="2.5" fill="#8a6858" opacity="0.08" />
      <circle cx="260" cy="162" r="2" fill="#8a6858" opacity="0.07" />
      <circle cx="510" cy="156" r="2.5" fill="#8a6858" opacity="0.07" />
      <circle cx="520" cy="158" r="2" fill="#8a6858" opacity="0.06" />
      {/* Distant farmstead cluster on hill — tiny tile roofs */}
      <rect x="340" y="160" width="4" height="3" fill="#7a4a2a" opacity="0.1" />
      <rect x="346" y="161" width="3" height="3" fill="#7a4a2a" opacity="0.08" />
      <path d="M339 160 L342 157 L345 160" fill="#8a5a35" opacity="0.08" />

      {/* === ROLLING FARMLAND WITH VINEYARDS === */}
      <path d="M0 175 Q80 165 180 170 Q300 160 450 168 Q580 158 700 165 Q760 162 800 168 L800 260 L0 260 Z"
        fill="url(#ch3_field)" opacity="0.9" />
      {/* Golden wheat field — foreground left */}
      <path d="M0 210 Q60 200 140 205 Q200 200 260 208 L260 260 L0 260 Z"
        fill="url(#ch3_wheat)" opacity="0.5" />
      {/* Wheat stalks */}
      <path d="M20 215 Q22 210 24 215" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.3" />
      <path d="M60 218 Q62 213 64 218" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.25" />
      <path d="M120 214 Q122 209 124 214" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.28" />
      <path d="M180 212 Q182 207 184 212" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.25" />
      {/* Field patchwork boundaries */}
      <path d="M260 170 L260 260" stroke="#556530" strokeWidth="0.6" opacity="0.25" />
      <path d="M450 165 L450 255" stroke="#556530" strokeWidth="0.6" opacity="0.2" />
      {/* Crop row lines */}
      <path d="M280 190 Q330 186 380 190" fill="none" stroke="#506035" strokeWidth="0.5" opacity="0.2" />
      <path d="M280 200 Q330 196 380 200" fill="none" stroke="#506035" strokeWidth="0.5" opacity="0.2" />
      <path d="M470 188 Q520 184 570 188" fill="none" stroke="#506035" strokeWidth="0.5" opacity="0.18" />
      {/* Vineyard rows on distant hill — right side */}
      <path d="M560 178 Q590 174 620 178" fill="none" stroke="#4a5530" strokeWidth="0.6" opacity="0.2" />
      <path d="M558 184 Q590 180 622 184" fill="none" stroke="#4a5530" strokeWidth="0.6" opacity="0.18" />
      <path d="M556 190 Q590 186 624 190" fill="none" stroke="#4a5530" strokeWidth="0.6" opacity="0.16" />
      {/* Additional vineyard rows — left hillside */}
      <path d="M100 182 Q130 178 160 182" fill="none" stroke="#4a5530" strokeWidth="0.5" opacity="0.15" />
      <path d="M98 188 Q130 184 162 188" fill="none" stroke="#4a5530" strokeWidth="0.5" opacity="0.13" />
      {/* Extra crop row lines — more field texture */}
      <path d="M280 210 Q330 206 380 210" fill="none" stroke="#506035" strokeWidth="0.4" opacity="0.15" />
      <path d="M470 198 Q520 194 570 198" fill="none" stroke="#506035" strokeWidth="0.4" opacity="0.14" />
      <path d="M470 208 Q520 204 570 208" fill="none" stroke="#506035" strokeWidth="0.4" opacity="0.12" />
      {/* Plowed furrow lines in nearest field */}
      <path d="M20 240 Q60 236 100 240" fill="none" stroke="#5a5030" strokeWidth="0.3" opacity="0.12" />
      <path d="M20 245 Q60 241 100 245" fill="none" stroke="#5a5030" strokeWidth="0.3" opacity="0.1" />
      <path d="M20 250 Q60 246 100 250" fill="none" stroke="#5a5030" strokeWidth="0.3" opacity="0.08" />
      {/* Stubble texture in harvested patches — tiny vertical marks */}
      <line x1="280" y1="218" x2="280" y2="215" stroke="#7a6828" strokeWidth="0.3" opacity="0.1" />
      <line x1="284" y1="217" x2="284" y2="214" stroke="#7a6828" strokeWidth="0.3" opacity="0.09" />
      <line x1="288" y1="219" x2="288" y2="216" stroke="#7a6828" strokeWidth="0.3" opacity="0.1" />
      <line x1="292" y1="218" x2="292" y2="215" stroke="#7a6828" strokeWidth="0.3" opacity="0.08" />
      <line x1="296" y1="220" x2="296" y2="217" stroke="#7a6828" strokeWidth="0.3" opacity="0.09" />
      <line x1="300" y1="219" x2="300" y2="216" stroke="#7a6828" strokeWidth="0.3" opacity="0.08" />
      {/* Field color variation — warmer patch where sun hits */}
      <ellipse cx="330" cy="195" rx="30" ry="10" fill="#7a7540" opacity="0.06" />
      <ellipse cx="520" cy="190" rx="25" ry="8" fill="#7a7540" opacity="0.05" />
      {/* Dried earth crack lines in bare patches */}
      <path d="M470 215 Q472 213 475 214 Q477 212 480 214" fill="none" stroke="#5a5030" strokeWidth="0.2" opacity="0.08" />
      <path d="M475 214 L476 218" fill="none" stroke="#5a5030" strokeWidth="0.2" opacity="0.06" />
      {/* Additional wheat stalks — more density */}
      <path d="M40 217 Q42 212 44 217" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.22" />
      <path d="M80 216 Q82 211 84 216" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.2" />
      <path d="M100 213 Q102 208 104 213" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.22" />
      <path d="M140 216 Q142 211 144 216" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.2" />
      <path d="M200 211 Q202 206 204 211" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.18" />
      <path d="M220 213 Q222 208 224 213" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.18" />
      <path d="M240 215 Q242 210 244 215" fill="none" stroke="#b09530" strokeWidth="0.4" opacity="0.16" />
      {/* Wheat heads — tiny seed clusters on stalks */}
      <ellipse cx="21" cy="210" rx="1.5" ry="2.5" fill="#a09030" opacity="0.18" />
      <ellipse cx="61" cy="213" rx="1.5" ry="2.5" fill="#a09030" opacity="0.15" />
      <ellipse cx="121" cy="209" rx="1.5" ry="2.5" fill="#a09030" opacity="0.16" />
      <ellipse cx="181" cy="207" rx="1.5" ry="2.5" fill="#a09030" opacity="0.14" />
      {/* Swaying wheat — gentle breeze animation */}
      <path d="M150 216 Q152 208 154 216" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.22">
        <animate attributeName="d" values="M150 216 Q152 208 154 216;M150 216 Q153 209 155 216;M150 216 Q152 208 154 216" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M160 214 Q162 206 164 214" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="d" values="M160 214 Q162 206 164 214;M160 214 Q163 207 165 214;M160 214 Q162 206 164 214" dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* === SPRING BLOSSOMING TREES — almond and cherry along field edges === */}
      {/* Blossoming tree left — spring foliage with pale pink canopy */}
      <line x1="310" y1="210" x2="312" y2="192" stroke="#3a3525" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="312" cy="188" rx="8" ry="6" fill="#3a4828" opacity="0.15" />
      <ellipse cx="310" cy="186" rx="5" ry="4" fill="#8a5a58" opacity="0.06" />
      <ellipse cx="314" cy="190" rx="4" ry="3" fill="#8a5a58" opacity="0.05" />
      {/* Blossoming tree right — near vineyard */}
      <line x1="580" y1="205" x2="582" y2="188" stroke="#3a3525" strokeWidth="1.3" opacity="0.25" />
      <ellipse cx="582" cy="184" rx="7" ry="5" fill="#3a4828" opacity="0.12" />
      <ellipse cx="580" cy="182" rx="4" ry="3" fill="#8a5a58" opacity="0.05" />
      <ellipse cx="584" cy="186" rx="3.5" ry="2.5" fill="#8a5a58" opacity="0.04" />
      {/* Scattered blossom petals in the air — drifting spring petals */}
      <circle cx="320" cy="195" r="0.5" fill="#a07068" opacity="0.06">
        <animate attributeName="cy" values="195;210;225" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="320;316;312" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.04;0.02" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="590" cy="190" r="0.4" fill="#a07068" opacity="0.05">
        <animate attributeName="cy" values="190;205;220" dur="10s" repeatCount="indefinite" />
        <animate attributeName="cx" values="590;586;583" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.03;0.01" dur="10s" repeatCount="indefinite" />
      </circle>
      <circle cx="315" cy="188" r="0.4" fill="#a07068" opacity="0.05">
        <animate attributeName="cy" values="188;200;215" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="315;310;306" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.03;0.01" dur="7s" repeatCount="indefinite" />
      </circle>
      {/* Additional vineyard terraces — mid-ground, Piedmontese style */}
      <path d="M340 196 Q370 192 400 196" fill="none" stroke="#4a5530" strokeWidth="0.5" opacity="0.14" />
      <path d="M338 202 Q370 198 402 202" fill="none" stroke="#4a5530" strokeWidth="0.5" opacity="0.12" />
      <path d="M336 208 Q370 204 404 208" fill="none" stroke="#4a5530" strokeWidth="0.5" opacity="0.1" />
      {/* Vine post dots — stakes along vineyard rows */}
      <circle cx="348" cy="196" r="0.5" fill="#4a3a28" opacity="0.08" />
      <circle cx="360" cy="194" r="0.5" fill="#4a3a28" opacity="0.07" />
      <circle cx="372" cy="193" r="0.5" fill="#4a3a28" opacity="0.07" />
      <circle cx="384" cy="194" r="0.5" fill="#4a3a28" opacity="0.07" />
      <circle cx="396" cy="196" r="0.5" fill="#4a3a28" opacity="0.06" />

      {/* === SMALL STREAM — irrigation brook winding through farmland === */}
      <path d="M0 230 Q40 225 80 230 Q120 235 160 228 Q200 224 240 230"
        fill="none" stroke="#5a6a78" strokeWidth="1.2" opacity="0.12" />
      {/* Water reflections — tiny glints catching sunset */}
      <line x1="50" y1="228" x2="55" y2="227" stroke="#c0a050" strokeWidth="0.3" opacity="0.1" />
      <line x1="100" y1="232" x2="106" y2="231" stroke="#c0a050" strokeWidth="0.3" opacity="0.08" />
      <line x1="170" y1="226" x2="176" y2="225" stroke="#c0a050" strokeWidth="0.3" opacity="0.08" />
      {/* Stream bank detail — darker earth along edges */}
      <path d="M0 229 Q40 224 80 229 Q120 234 160 227 Q200 223 240 229"
        fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.08" />
      <path d="M0 231 Q40 226 80 231 Q120 236 160 229 Q200 225 240 231"
        fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.06" />
      {/* Reeds along stream bank — tiny vertical strokes */}
      <line x1="35" y1="227" x2="35" y2="222" stroke="#4a5a30" strokeWidth="0.4" opacity="0.1" />
      <line x1="37" y1="226" x2="37" y2="220" stroke="#4a5a30" strokeWidth="0.4" opacity="0.1" />
      <line x1="39" y1="227" x2="39" y2="221" stroke="#4a5a30" strokeWidth="0.4" opacity="0.08" />
      <line x1="130" y1="232" x2="130" y2="226" stroke="#4a5a30" strokeWidth="0.4" opacity="0.09" />
      <line x1="132" y1="233" x2="132" y2="227" stroke="#4a5a30" strokeWidth="0.4" opacity="0.08" />
      {/* Animated water glint — sunset reflecting off moving water */}
      <line x1="80" y1="230" x2="86" y2="229" stroke="#e0b060" strokeWidth="0.4" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.12;0.06" dur="2.5s" repeatCount="indefinite" />
      </line>
      {/* Field boundary hedgerow — between wheat and green fields */}
      <path d="M260 210 Q260 206 262 208 Q264 204 266 208 Q268 205 268 210"
        fill="#2a3a20" opacity="0.2" />
      {/* Stone boundary marker */}
      <circle cx="260" cy="212" r="1.5" fill="#5a5548" opacity="0.15" />
      {/* Winding road from village through farmland */}
      <path d="M610 168 Q560 180 500 185 Q440 192 380 198 Q320 205 260 218"
        fill="none" stroke="#6a6040" strokeWidth="2.5" opacity="0.15" />
      {/* Road rut marks — tracks in the dirt road */}
      <path d="M610 169 Q560 181 500 186 Q440 193 380 199"
        fill="none" stroke="#5a5030" strokeWidth="0.5" opacity="0.06" />
      <path d="M610 167 Q560 179 500 184 Q440 191 380 197"
        fill="none" stroke="#5a5030" strokeWidth="0.5" opacity="0.06" />

      {/* === SUNFLOWERS ALONG A FENCE — right mid-ground === */}
      {/* Fence posts and rail */}
      <line x1="710" y1="250" x2="710" y2="236" stroke="#5a4a30" strokeWidth="1.2" opacity="0.35" />
      <line x1="726" y1="248" x2="726" y2="234" stroke="#5a4a30" strokeWidth="1.2" opacity="0.35" />
      <line x1="742" y1="246" x2="742" y2="232" stroke="#5a4a30" strokeWidth="1.2" opacity="0.35" />
      <line x1="758" y1="244" x2="758" y2="230" stroke="#5a4a30" strokeWidth="1.2" opacity="0.35" />
      <path d="M710 240 Q726 237 742 235 Q758 233 770 232" fill="none" stroke="#5a4a30" strokeWidth="0.8" opacity="0.3" />
      {/* Sunflower 1 — tall */}
      <line x1="714" y1="236" x2="714" y2="210" stroke="#4a6828" strokeWidth="1.2" opacity="0.45" />
      <circle cx="714" cy="208" r="4.5" fill="url(#ch3_sunflowerHead)" opacity="0.55" />
      <path d="M714 204 L711 200 M714 204 L717 200 M710 208 L706 208 M718 208 L722 208 M714 212 L711 216 M714 212 L717 216" fill="none" stroke="#b09028" strokeWidth="0.8" opacity="0.4" />
      {/* Sunflower leaf */}
      <path d="M714 220 Q710 218 708 222" fill="#4a6828" opacity="0.3" />
      {/* Sunflower 2 — medium */}
      <line x1="732" y1="234" x2="732" y2="214" stroke="#4a6828" strokeWidth="1" opacity="0.4" />
      <circle cx="732" cy="212" r="3.8" fill="url(#ch3_sunflowerHead)" opacity="0.5" />
      <path d="M732 208 L729 205 M732 208 L735 205 M728 212 L725 212 M736 212 L739 212 M732 216 L729 219 M732 216 L735 219" fill="none" stroke="#b09028" strokeWidth="0.7" opacity="0.35" />
      <path d="M732 224 Q736 222 738 225" fill="#4a6828" opacity="0.28" />
      {/* Sunflower 3 — tall, leaning slightly */}
      <path d="M750 232 Q748 218 750 204" fill="none" stroke="#4a6828" strokeWidth="1.2" opacity="0.42" />
      <circle cx="750" cy="202" r="4" fill="url(#ch3_sunflowerHead)" opacity="0.48" />
      <path d="M750 198 L747 195 M750 198 L753 195 M746 202 L743 202 M754 202 L757 202 M750 206 L747 209 M750 206 L753 209" fill="none" stroke="#b09028" strokeWidth="0.7" opacity="0.35" />
      {/* Sunflower 4 — shorter, younger */}
      <line x1="762" y1="230" x2="762" y2="216" stroke="#4a6828" strokeWidth="0.9" opacity="0.38" />
      <circle cx="762" cy="214" r="3.2" fill="url(#ch3_sunflowerHead)" opacity="0.45" />
      <path d="M762 211 L760 208 M762 211 L764 208 M759 214 L757 214 M765 214 L767 214" fill="none" stroke="#b09028" strokeWidth="0.6" opacity="0.3" />

      {/* === CYPRESS TREES LINING ROAD — more detailed === */}
      {/* Tall cypress left */}
      <path d="M140 262 Q143 225 145 185 Q147 225 150 262" fill="#1a2818" opacity="0.6" />
      <path d="M142 245 Q144 210 145 178 Q146 210 148 245" fill="#152215" opacity="0.5" />
      {/* Texture lines on cypress — horizontal shadow bands */}
      <line x1="144" y1="200" x2="146" y2="200" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.3" />
      <line x1="144" y1="210" x2="146" y2="210" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.25" />
      <line x1="144" y1="220" x2="146" y2="220" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.3" />
      <line x1="144" y1="230" x2="146" y2="230" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.25" />
      <line x1="144" y1="240" x2="146" y2="240" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.3" />
      <line x1="144" y1="250" x2="146" y2="250" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.25" />
      {/* Cypress sunlit edge — warm rim light on right side */}
      <path d="M148 195 Q149 220 150 260" fill="none" stroke="#3a4828" strokeWidth="0.5" opacity="0.2" />
      {/* Cypress shadow side — deeper darkness on left */}
      <path d="M140 198 Q141 225 142 260" fill="none" stroke="#0a1508" strokeWidth="0.5" opacity="0.15" />
      {/* Tiny branch tips poking from cypress silhouette */}
      <path d="M148 210 Q150 209 151 211" fill="none" stroke="#1a2818" strokeWidth="0.4" opacity="0.2" />
      <path d="M140 225 Q138 224 137 226" fill="none" stroke="#1a2818" strokeWidth="0.4" opacity="0.18" />
      {/* Second cypress */}
      <path d="M185 258 Q187 228 189 195 Q191 228 193 258" fill="#1a2818" opacity="0.55" />
      <path d="M187 248 Q188 218 189 190 Q190 218 191 248" fill="#152215" opacity="0.45" />
      {/* Second cypress bark texture */}
      <line x1="188" y1="210" x2="190" y2="210" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.22" />
      <line x1="188" y1="225" x2="190" y2="225" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.22" />
      <line x1="188" y1="240" x2="190" y2="240" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.2" />
      {/* Second cypress rim light */}
      <path d="M192 198 Q193 225 193 256" fill="none" stroke="#3a4828" strokeWidth="0.4" opacity="0.15" />
      {/* Right side cypress pair */}
      <path d="M530 256 Q532 226 534 193 Q536 226 538 256" fill="#1a2818" opacity="0.5" />
      {/* Right cypress bark and edge detail */}
      <line x1="533" y1="215" x2="535" y2="215" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.2" />
      <line x1="533" y1="235" x2="535" y2="235" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.18" />
      <path d="M537 200 Q539 225 538 254" fill="none" stroke="#2a3828" strokeWidth="0.4" opacity="0.15" />
      <path d="M575 254 Q577 228 578 200 Q579 228 581 254" fill="#1a2818" opacity="0.45" />
      {/* Far right cypress detail */}
      <line x1="577" y1="220" x2="579" y2="220" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.18" />
      <line x1="577" y1="240" x2="579" y2="240" stroke="#0e1a0e" strokeWidth="0.3" opacity="0.16" />
      {/* Dirt road winding toward village */}
      <path d="M140 262 Q200 250 300 255 Q400 260 500 252 Q560 248 620 255 Q660 262 700 258"
        fill="none" stroke="#5a5035" strokeWidth="3" opacity="0.2" />

      {/* Olive trees — enhanced with leaf texture and branches */}
      <line x1="70" y1="252" x2="74" y2="232" stroke="#3a3525" strokeWidth="2" opacity="0.5" />
      <ellipse cx="74" cy="228" rx="10" ry="7" fill="#3a4828" opacity="0.45" />
      {/* Left olive tree — branch detail */}
      <path d="M72 236 Q66 232 62 234" fill="none" stroke="#3a3525" strokeWidth="0.8" opacity="0.3" />
      <path d="M76 234 Q82 230 86 233" fill="none" stroke="#3a3525" strokeWidth="0.8" opacity="0.3" />
      {/* Leaf clusters — overlapping small ellipses */}
      <ellipse cx="68" cy="226" rx="4" ry="3" fill="#3a5228" opacity="0.3" />
      <ellipse cx="80" cy="225" rx="5" ry="3" fill="#3a5228" opacity="0.25" />
      <ellipse cx="74" cy="222" rx="4" ry="2.5" fill="#405830" opacity="0.2" />
      <ellipse cx="62" cy="232" rx="3" ry="2" fill="#3a4828" opacity="0.2" />
      <ellipse cx="86" cy="231" rx="3" ry="2" fill="#3a4828" opacity="0.18" />
      {/* Left olive trunk bark texture — gnarled knots */}
      <circle cx="72" cy="240" r="0.8" fill="#2a2518" opacity="0.2" />
      <circle cx="73" cy="245" r="0.6" fill="#2a2518" opacity="0.18" />
      <path d="M71 236 Q73 235 72 238" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.15" />
      {/* Olive fruits — tiny dark ovals hanging from branches */}
      <ellipse cx="66" cy="230" rx="0.8" ry="1.2" fill="#2a3020" opacity="0.15" />
      <ellipse cx="82" cy="229" rx="0.8" ry="1.2" fill="#2a3020" opacity="0.13" />
      <ellipse cx="70" cy="224" rx="0.7" ry="1" fill="#2a3020" opacity="0.12" />
      {/* Dappled light through olive leaves */}
      <circle cx="68" cy="228" r="1" fill="#6a7838" opacity="0.06" />
      <circle cx="78" cy="226" r="1.2" fill="#6a7838" opacity="0.05" />
      {/* Right olive tree */}
      <line x1="720" y1="255" x2="722" y2="242" stroke="#3a3525" strokeWidth="2" opacity="0.45" />
      <ellipse cx="722" cy="238" rx="9" ry="6" fill="#3a4828" opacity="0.4" />
      {/* Right olive tree — branch detail */}
      <path d="M720 244 Q716 240 714 243" fill="none" stroke="#3a3525" strokeWidth="0.7" opacity="0.25" />
      <path d="M724 242 Q728 238 730 241" fill="none" stroke="#3a3525" strokeWidth="0.7" opacity="0.25" />
      {/* Leaf clusters */}
      <ellipse cx="716" cy="236" rx="4" ry="2.5" fill="#3a5228" opacity="0.25" />
      <ellipse cx="728" cy="235" rx="4" ry="2.5" fill="#3a5228" opacity="0.22" />
      <ellipse cx="722" cy="233" rx="3.5" ry="2" fill="#405830" opacity="0.18" />
      {/* Right olive trunk bark — twisted old wood */}
      <circle cx="721" cy="248" r="0.6" fill="#2a2518" opacity="0.15" />
      <path d="M721 244 Q722 243 721 246" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.12" />
      {/* Olive fruits on right tree */}
      <ellipse cx="718" cy="237" rx="0.7" ry="1" fill="#2a3020" opacity="0.12" />
      <ellipse cx="726" cy="236" rx="0.7" ry="1" fill="#2a3020" opacity="0.1" />

      {/* === WILD BUSHES AND UNDERGROWTH === */}
      {/* Scrubby bush — near left wall */}
      <path d="M12 274 Q16 268 22 270 Q26 266 30 270 Q28 276 22 278 Q16 278 12 274 Z"
        fill="#2a3820" opacity="0.25" />
      {/* Bush near road */}
      <path d="M350 256 Q354 250 360 252 Q364 248 368 252 Q366 258 360 260 Q354 260 350 256 Z"
        fill="#2a3820" opacity="0.2" />
      {/* Small bush — right side, near sunflowers */}
      <path d="M700 254 Q703 250 708 252 Q706 256 702 258 Q700 258 700 254 Z"
        fill="#2a3820" opacity="0.18" />
      {/* Wild rosemary/herbs near camp — aromatic Piedmontese herbs */}
      <path d="M460 258 Q462 254 466 256 Q468 253 470 257 Q466 260 462 260 Z"
        fill="#3a4828" opacity="0.15" />
      <path d="M240 262 Q242 258 246 260 Q244 264 240 264 Z"
        fill="#3a4828" opacity="0.12" />

      {/* === GRAPE VINE TRELLIS — left mid-ground === */}
      {/* Trellis posts */}
      <line x1="30" y1="270" x2="30" y2="252" stroke="#4a3a28" strokeWidth="1.2" opacity="0.35" />
      <line x1="50" y1="268" x2="50" y2="250" stroke="#4a3a28" strokeWidth="1.2" opacity="0.35" />
      <line x1="70" y1="266" x2="70" y2="248" stroke="#4a3a28" strokeWidth="1.2" opacity="0.35" />
      {/* Horizontal vine wires */}
      <path d="M30 255 Q40 253 50 254 Q60 252 70 252" fill="none" stroke="#3a4828" strokeWidth="0.8" opacity="0.3" />
      <path d="M30 260 Q40 258 50 259 Q60 257 70 257" fill="none" stroke="#3a4828" strokeWidth="0.8" opacity="0.28" />
      {/* Grape clusters hanging */}
      <circle cx="38" cy="258" r="1.5" fill="#3a2848" opacity="0.35" />
      <circle cx="40" cy="260" r="1.5" fill="#3a2848" opacity="0.35" />
      <circle cx="39" cy="257" r="1.3" fill="#3a2848" opacity="0.3" />
      <circle cx="58" cy="256" r="1.5" fill="#3a2848" opacity="0.32" />
      <circle cx="60" cy="258" r="1.5" fill="#3a2848" opacity="0.32" />
      {/* Vine leaves */}
      <path d="M35 254 Q37 252 39 254 Q37 256 35 254" fill="#3a5028" opacity="0.3" />
      <path d="M55 252 Q57 250 59 252 Q57 254 55 252" fill="#3a5028" opacity="0.28" />

      {/* Grape vines — right field (existing) */}
      <line x1="700" y1="220" x2="700" y2="210" stroke="#4a3a28" strokeWidth="0.8" opacity="0.3" />
      <line x1="715" y1="218" x2="715" y2="208" stroke="#4a3a28" strokeWidth="0.8" opacity="0.3" />
      <line x1="730" y1="216" x2="730" y2="206" stroke="#4a3a28" strokeWidth="0.8" opacity="0.3" />
      <path d="M700 212 Q707 210 715 211 Q722 209 730 210"
        fill="none" stroke="#3a4828" strokeWidth="0.8" opacity="0.3" />

      {/* === CAMP GROUND === */}
      <path d="M0 260 Q150 252 350 257 Q550 252 800 260 L800 400 L0 400 Z"
        fill="url(#ch3_ground)" />

      {/* === GROUND TEXTURE — soil variations, rocks, worn patches === */}
      {/* Worn earth patches — lighter dusty areas where soldiers have walked */}
      <ellipse cx="340" cy="340" rx="40" ry="12" fill="#3a3525" opacity="0.15" />
      <ellipse cx="200" cy="320" rx="25" ry="8" fill="#3a3525" opacity="0.12" />
      <ellipse cx="500" cy="330" rx="30" ry="10" fill="#3a3525" opacity="0.1" />
      {/* Darker soil patches — damp earth */}
      <ellipse cx="150" cy="360" rx="18" ry="6" fill="#1a1810" opacity="0.1" />
      <ellipse cx="600" cy="350" rx="22" ry="7" fill="#1a1810" opacity="0.08" />
      {/* Small rocks and pebbles scattered */}
      <circle cx="110" cy="340" r="1.8" fill="#4a4838" opacity="0.2" />
      <circle cx="112" cy="342" r="1.2" fill="#4a4838" opacity="0.18" />
      <circle cx="450" cy="350" r="2" fill="#4a4838" opacity="0.18" />
      <circle cx="453" cy="352" r="1.4" fill="#4a4838" opacity="0.15" />
      <circle cx="680" cy="340" r="1.5" fill="#4a4838" opacity="0.16" />
      <ellipse cx="300" cy="358" rx="2.5" ry="1.5" fill="#4a4838" opacity="0.14" />
      <circle cx="50" cy="350" r="1.3" fill="#4a4838" opacity="0.15" />
      <circle cx="740" cy="360" r="1.8" fill="#4a4838" opacity="0.12" />
      <ellipse cx="580" cy="365" rx="2" ry="1.2" fill="#4a4838" opacity="0.12" />
      {/* Larger field stones — part buried */}
      <ellipse cx="20" cy="330" rx="4" ry="2.5" fill="#5a5548" opacity="0.15" />
      <ellipse cx="770" cy="345" rx="3.5" ry="2" fill="#5a5548" opacity="0.12" />
      {/* Tire/cart ruts in the ground */}
      <path d="M258 320 Q280 325 302 320 Q320 318 340 322" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.08" />
      <path d="M258 322 Q280 327 302 322 Q320 320 340 324" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.07" />
      {/* Boot prints — subtle depressions near fire */}
      <ellipse cx="320" cy="332" rx="1.5" ry="2.5" fill="#2a2518" opacity="0.06" transform="rotate(-15 320 332)" />
      <ellipse cx="360" cy="335" rx="1.5" ry="2.5" fill="#2a2518" opacity="0.05" transform="rotate(20 360 335)" />
      {/* More boot prints — trail from road to campfire */}
      <ellipse cx="300" cy="338" rx="1.3" ry="2.2" fill="#2a2518" opacity="0.05" transform="rotate(-25 300 338)" />
      <ellipse cx="280" cy="342" rx="1.3" ry="2.2" fill="#2a2518" opacity="0.04" transform="rotate(-10 280 342)" />
      <ellipse cx="260" cy="340" rx="1.2" ry="2" fill="#2a2518" opacity="0.04" transform="rotate(-20 260 340)" />
      {/* Boot prints near farmhouse door */}
      <ellipse cx="660" cy="318" rx="1.2" ry="2" fill="#2a2518" opacity="0.05" transform="rotate(5 660 318)" />
      <ellipse cx="656" cy="322" rx="1.2" ry="2" fill="#2a2518" opacity="0.04" transform="rotate(-8 656 322)" />
      {/* Wheel ruts from cart — deeper, more defined tracks */}
      <path d="M258 348 Q240 345 220 350 Q200 354 180 350" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.06" />
      <path d="M258 350 Q240 347 220 352 Q200 356 180 352" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.05" />
      {/* Wagon wheel tracks from supply wagon */}
      <path d="M465 320 Q440 328 420 332 Q400 336 380 340" fill="none" stroke="#2a2518" strokeWidth="0.7" opacity="0.05" />
      <path d="M505 320 Q490 328 470 332 Q450 336 430 340" fill="none" stroke="#2a2518" strokeWidth="0.7" opacity="0.04" />
      {/* Trampled earth patches — where soldiers walk and gather */}
      <ellipse cx="340" cy="345" rx="30" ry="8" fill="url(#ch3_trampledEarth)" />
      <ellipse cx="230" cy="310" rx="20" ry="6" fill="url(#ch3_trampledEarth)" />
      {/* More scattered rocks — individual pebbles and stones */}
      <circle cx="190" cy="345" r="1" fill="#5a5848" opacity="0.12" />
      <circle cx="395" cy="352" r="0.8" fill="#4a4838" opacity="0.1" />
      <ellipse cx="520" cy="358" rx="1.5" ry="0.8" fill="#4a4838" opacity="0.1" />
      <circle cx="70" cy="342" r="1.2" fill="#5a5848" opacity="0.1" />
      <circle cx="650" cy="355" r="0.9" fill="#4a4838" opacity="0.09" />
      {/* Dried leaf litter — tiny scattered shapes */}
      <path d="M200 348 Q201 347 203 348 Q202 349 200 348" fill="#4a3a20" opacity="0.08" />
      <path d="M350 355 Q351 354 353 355 Q352 356 350 355" fill="#4a3a20" opacity="0.07" />
      <path d="M480 348 Q481 347 483 348 Q482 349 480 348" fill="#4a3a20" opacity="0.06" />
      <path d="M120 352 Q121 351 123 352 Q122 353 120 352" fill="#4a3a20" opacity="0.07" />
      <path d="M620 360 Q621 359 623 360 Q622 361 620 360" fill="#4a3a20" opacity="0.06" />
      {/* Ground color variation — warm and cool patches */}
      <ellipse cx="400" cy="350" rx="35" ry="10" fill="#3a3020" opacity="0.06" />
      <ellipse cx="100" cy="340" rx="25" ry="8" fill="#2a2818" opacity="0.05" />
      <ellipse cx="700" cy="355" rx="30" ry="9" fill="#3a3020" opacity="0.04" />

      {/* === LOW STONE WALL REMNANT — behind camp area, Piedmontese field boundary === */}
      <path d="M0 270 Q30 268 60 270 Q90 268 120 270" fill="url(#ch3_stoneWall)" opacity="0.2" />
      <path d="M0 270 Q30 268 60 270 Q90 268 120 270" fill="none" stroke="#6a6558" strokeWidth="0.5" opacity="0.15" />
      {/* Individual stone detail — mortar lines and individual stones */}
      <line x1="20" y1="268" x2="20" y2="270" stroke="#6a6558" strokeWidth="0.3" opacity="0.1" />
      <line x1="40" y1="269" x2="40" y2="271" stroke="#6a6558" strokeWidth="0.3" opacity="0.1" />
      <line x1="70" y1="268" x2="70" y2="270" stroke="#6a6558" strokeWidth="0.3" opacity="0.1" />
      <line x1="100" y1="269" x2="100" y2="271" stroke="#6a6558" strokeWidth="0.3" opacity="0.1" />
      {/* Additional stone detail — individual rock faces */}
      <line x1="10" y1="269" x2="10" y2="271" stroke="#6a6558" strokeWidth="0.3" opacity="0.08" />
      <line x1="55" y1="268" x2="55" y2="270" stroke="#6a6558" strokeWidth="0.3" opacity="0.08" />
      <line x1="85" y1="269" x2="85" y2="271" stroke="#6a6558" strokeWidth="0.3" opacity="0.08" />
      {/* Moss growing on top of wall — green patches */}
      <path d="M15 268 Q17 267 19 268" fill="#3a4a28" opacity="0.06" />
      <path d="M50 268 Q52 267 54 268" fill="#3a4a28" opacity="0.05" />
      <path d="M90 268 Q92 267 94 268" fill="#3a4a28" opacity="0.05" />
      {/* Collapsed section of wall — rubble scattered */}
      <circle cx="125" cy="272" r="1.5" fill="#5a5548" opacity="0.12" />
      <circle cx="128" cy="273" r="1" fill="#5a5548" opacity="0.1" />
      <circle cx="132" cy="272" r="1.2" fill="#5a5548" opacity="0.1" />
      {/* Lichen on stones — yellowish patches */}
      <circle cx="35" cy="269" r="1" fill="#7a7840" opacity="0.04" />
      <circle cx="80" cy="269" r="0.8" fill="#7a7840" opacity="0.03" />

      {/* === HAY BALES — near farmhouse, golden harvest setting === */}
      {/* Hay bale 1 — large, front */}
      <rect x="592" y="296" width="18" height="12" rx="2" fill="url(#ch3_hayBale)" opacity="0.55" />
      <line x1="596" y1="296" x2="596" y2="308" stroke="#8a7830" strokeWidth="0.4" opacity="0.3" />
      <line x1="601" y1="296" x2="601" y2="308" stroke="#8a7830" strokeWidth="0.4" opacity="0.3" />
      <line x1="606" y1="296" x2="606" y2="308" stroke="#8a7830" strokeWidth="0.4" opacity="0.3" />
      {/* Hay bale 2 — stacked on top of first, slightly offset */}
      <rect x="594" y="286" width="16" height="10" rx="2" fill="url(#ch3_hayBale)" opacity="0.5" />
      <line x1="598" y1="286" x2="598" y2="296" stroke="#8a7830" strokeWidth="0.4" opacity="0.25" />
      <line x1="603" y1="286" x2="603" y2="296" stroke="#8a7830" strokeWidth="0.4" opacity="0.25" />
      {/* Hay bale 3 — smaller, beside first */}
      <rect x="612" y="300" width="14" height="10" rx="2" fill="url(#ch3_hayBale)" opacity="0.48" />
      <line x1="616" y1="300" x2="616" y2="310" stroke="#8a7830" strokeWidth="0.4" opacity="0.25" />
      <line x1="621" y1="300" x2="621" y2="310" stroke="#8a7830" strokeWidth="0.4" opacity="0.25" />
      {/* Loose straw wisps */}
      <path d="M590 308 Q588 312 584 314" fill="none" stroke="#a09040" strokeWidth="0.4" opacity="0.25" />
      <path d="M626 310 Q628 313 632 314" fill="none" stroke="#a09040" strokeWidth="0.4" opacity="0.22" />

      {/* === SOLDIER SLEEPING AGAINST HAY BALE — passed out from drink === */}
      {/* Body — slumped sitting, back against hay bale 3 */}
      <path d="M618 310 Q616 304 618 298 Q620 302 620 310 Z" fill="#1a1815" opacity="0.6" />
      {/* Head — tilted to side, resting on shoulder */}
      <circle cx="621" cy="296" r="3.5" fill="#1a1815" opacity="0.6" />
      {/* Bicorne hat askew */}
      <path d="M618 294 Q621 292 624 294 Q622 296 620 296 Z" fill="#1a1510" opacity="0.5" />
      {/* Legs sprawled out in front */}
      <path d="M616 310 Q612 316 608 322" fill="none" stroke="#1a1815" strokeWidth="2.2" opacity="0.45" />
      <path d="M620 310 Q624 316 628 320" fill="none" stroke="#1a1815" strokeWidth="2.2" opacity="0.45" />
      {/* Arm draped over belly, bottle loosely held */}
      <path d="M620 302 Q624 306 626 310" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />
      {/* Dropped bottle near hand */}
      <rect x="627" y="308" width="2" height="5" rx="0.5" fill="#2a3028" opacity="0.35" transform="rotate(30 628 311)" />
      {/* Straw bits on his coat */}
      <path d="M617 302 Q615 300 614 301" fill="none" stroke="#a09040" strokeWidth="0.3" opacity="0.2" />
      <path d="M619 306 Q617 305 616 306" fill="none" stroke="#a09040" strokeWidth="0.3" opacity="0.18" />

      {/* === FRENCH TRICOLOUR BANNER on a pole === */}
      <line x1="160" y1="310" x2="160" y2="262" stroke="#3a3020" strokeWidth="1.5" opacity="0.6" />
      <path d="M160 262 Q167 265 174 262 Q167 268 174 272 Q167 270 160 272" fill="url(#ch3_banner)" opacity="0.5">
        <animate attributeName="d"
          values="M160 262 Q167 265 174 262 Q167 268 174 272 Q167 270 160 272;M160 262 Q168 264 175 263 Q168 269 175 273 Q168 271 160 272;M160 262 Q167 265 174 262 Q167 268 174 272 Q167 270 160 272"
          dur="4s" repeatCount="indefinite" />
      </path>
      {/* Red and white stripes on the banner */}
      <path d="M160 262 Q163 264 166 262 Q163 266 166 268 Q163 267 160 268" fill="#8a2020" opacity="0.35">
        <animate attributeName="d"
          values="M160 262 Q163 264 166 262 Q163 266 166 268 Q163 267 160 268;M160 262 Q164 264 167 263 Q164 267 167 269 Q164 268 160 268;M160 262 Q163 264 166 262 Q163 266 166 268 Q163 267 160 268"
          dur="4s" repeatCount="indefinite" />
      </path>

      {/* === ITALIAN FARMHOUSE — enhanced with warm door light === */}
      <rect x="640" y="268" width="50" height="38" fill="#4a4035" />
      <rect x="640" y="268" width="50" height="38" fill="none" stroke="#5a5045" strokeWidth="0.8" />
      <line x1="640" y1="280" x2="690" y2="280" stroke="#555045" strokeWidth="0.3" opacity="0.3" />
      <line x1="640" y1="292" x2="690" y2="292" stroke="#555045" strokeWidth="0.3" opacity="0.3" />
      {/* Terracotta roof */}
      <path d="M635 268 L665 250 L695 268 Z" fill="url(#ch3_roof)" />
      <rect x="675" y="254" width="5" height="10" fill="#4a4035" />
      {/* Chimney smoke */}
      <path d="M677 254 Q680 245 676 236 Q682 228 678 218" fill="none" stroke="#8a8070" strokeWidth="1" opacity="0.08">
        <animate attributeName="d"
          values="M677 254 Q680 245 676 236 Q682 228 678 218;M677 254 Q674 244 678 235 Q674 226 679 216;M677 254 Q680 245 676 236 Q682 228 678 218"
          dur="6s" repeatCount="indefinite" />
      </path>

      {/* === ROOSTER on farmhouse roof === */}
      {/* Body silhouette */}
      <path d="M656 260 Q654 257 656 254 Q658 252 661 253 Q664 254 665 257 Q664 260 661 261 Z"
        fill="#2a2218" opacity="0.55" />
      {/* Head */}
      <circle cx="665" cy="254" r="1.8" fill="#2a2218" opacity="0.55" />
      {/* Comb on head */}
      <path d="M664 252 Q665 250 666 252 Q667 250 668 252" fill="#6a2820" opacity="0.45" />
      {/* Beak */}
      <line x1="666.5" y1="254" x2="668.5" y2="253.5" stroke="#8a6530" strokeWidth="0.6" opacity="0.4" />
      {/* Tail feathers — upswept */}
      <path d="M654 257 Q651 253 649 250" fill="none" stroke="#2a2218" strokeWidth="1" opacity="0.45" />
      <path d="M654 258 Q650 255 648 252" fill="none" stroke="#2a2218" strokeWidth="0.8" opacity="0.4" />
      {/* Legs */}
      <line x1="659" y1="261" x2="658" y2="264" stroke="#8a6530" strokeWidth="0.4" opacity="0.35" />
      <line x1="662" y1="261" x2="663" y2="264" stroke="#8a6530" strokeWidth="0.4" opacity="0.35" />

      {/* Windows with warm glow */}
      <rect x="650" y="272" width="8" height="10" fill="#2a2518" />
      <rect x="650" y="272" width="8" height="10" fill="url(#ch3_windowGlow)">
        <animate attributeName="opacity" values="0.8;0.6;0.8" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="672" y="272" width="8" height="10" fill="#2a2518" />
      <rect x="672" y="272" width="8" height="10" fill="url(#ch3_windowGlow)">
        <animate attributeName="opacity" values="0.7;0.5;0.7" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Door — open, warm light spilling out */}
      <rect x="659" y="290" width="9" height="16" fill="#2a2015" />
      <rect x="659" y="290" width="9" height="16" fill="#d09040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.18;0.25" dur="3.5s" repeatCount="indefinite" />
      </rect>
      {/* Light cone spilling from door */}
      <path d="M659 306 L650 325 L678 325 L668 306 Z" fill="#d09040" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.04;0.06" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* === ITALIAN WOMAN in doorway — watching soldiers warily === */}
      {/* Standing figure silhouette in the door opening */}
      {/* Body — long dress shape */}
      <path d="M662 292 Q660 296 659 302 Q660 306 665 306 Q667 302 666 296 Z"
        fill="#1a1510" opacity="0.65" />
      {/* Head */}
      <circle cx="663.5" cy="290" r="2.2" fill="#1a1510" opacity="0.65" />
      {/* Hair/headscarf — draped */}
      <path d="M661 289 Q663.5 287 666 289 Q666 291 665 292" fill="#2a1818" opacity="0.55" />
      {/* Arm crossed, wary pose */}
      <path d="M660 296 Q658 294 657 296" fill="none" stroke="#1a1510" strokeWidth="1" opacity="0.5" />
      <path d="M666 296 Q668 294 669 296" fill="none" stroke="#1a1510" strokeWidth="1" opacity="0.5" />
      {/* Backlit glow around her from doorway light */}
      <path d="M659 292 Q663 290 668 292 Q668 300 668 306 Q663 307 659 306 Q659 300 659 292"
        fill="#d09040" opacity="0.08" />

      {/* Chickens near farmhouse */}
      <path d="M630 300 Q632 297 635 298 Q637 300 635 302 Q632 303 630 300 Z" fill="#6a5540" opacity="0.4" />
      <circle cx="636" cy="297" r="1" fill="#6a5540" opacity="0.4" />
      <line x1="636" y1="297" x2="638" y2="296" stroke="#8a6540" strokeWidth="0.4" opacity="0.3" />
      <path d="M698 305 Q700 302 703 303 Q704 305 703 307 Q700 307 698 305 Z" fill="#7a6548" opacity="0.35" />
      <circle cx="704" cy="302" r="0.8" fill="#7a6548" opacity="0.35" />
      {/* Dog near farmhouse — lying down, warming by the scene */}
      <path d="M618 308 Q614 306 612 308 Q610 310 614 312 Q618 312 622 310 Q624 308 622 306 Q620 305 618 308 Z"
        fill="#3a2a18" opacity="0.5" />
      <circle cx="612" cy="307" r="2" fill="#3a2a18" opacity="0.5" />
      <path d="M610 306 Q608 304 607 306" fill="none" stroke="#3a2a18" strokeWidth="0.8" opacity="0.4" />

      {/* === GOAT TIED TO A POST — plundered livestock === */}
      {/* Post */}
      <line x1="545" y1="340" x2="545" y2="318" stroke="#4a3a28" strokeWidth="1.5" opacity="0.5" />
      {/* Rope from post to goat */}
      <path d="M545 328 Q548 330 552 329 Q556 328 558 330" fill="none" stroke="#6a5a40" strokeWidth="0.6" opacity="0.35" />
      {/* Goat body */}
      <path d="M558 326 Q555 322 558 318 Q562 316 566 318 Q570 320 571 324 Q569 328 565 330 Q560 330 558 326 Z"
        fill="#c8c0a8" opacity="0.45" />
      {/* Goat head */}
      <circle cx="571" cy="320" r="2.5" fill="#c8c0a8" opacity="0.45" />
      {/* Goat horns — small curved */}
      <path d="M570 318 Q569 315 570 314" fill="none" stroke="#8a7a60" strokeWidth="0.6" opacity="0.35" />
      <path d="M572 318 Q573 315 572 314" fill="none" stroke="#8a7a60" strokeWidth="0.6" opacity="0.35" />
      {/* Goat ears */}
      <path d="M569 319 Q567 318 568 320" fill="#b8b098" opacity="0.35" />
      <path d="M573 319 Q575 318 574 320" fill="#b8b098" opacity="0.35" />
      {/* Goat beard */}
      <path d="M572 322 Q573 324 572 326" fill="none" stroke="#a89880" strokeWidth="0.4" opacity="0.3" />
      {/* Goat legs */}
      <line x1="560" y1="330" x2="560" y2="338" stroke="#a89880" strokeWidth="0.8" opacity="0.35" />
      <line x1="564" y1="330" x2="564" y2="338" stroke="#a89880" strokeWidth="0.8" opacity="0.35" />
      <line x1="567" y1="328" x2="567" y2="336" stroke="#a89880" strokeWidth="0.8" opacity="0.35" />
      {/* Goat tail — short upward flick */}
      <path d="M557 322 Q555 320 556 318" fill="none" stroke="#c8c0a8" strokeWidth="0.6" opacity="0.3" />

      {/* === DISTANT SECOND CAMPFIRE — further back, other unit celebrating === */}
      <circle cx="150" cy="280" r="12" fill="url(#ch3_distantFire)" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.25;0.35" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Distant fire flicker */}
      <path d="M148 280 Q149 274 150 270 Q151 274 152 280" fill="#d08040" opacity="0.15">
        <animate attributeName="d"
          values="M148 280 Q149 274 150 270 Q151 274 152 280;M148 280 Q150 273 150 268 Q151 273 152 280;M148 280 Q149 274 150 270 Q151 274 152 280"
          dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Tiny figures around distant campfire — very simplified */}
      <circle cx="144" cy="279" r="1.5" fill="#1a1815" opacity="0.2" />
      <path d="M144 280 L144 284" stroke="#1a1815" strokeWidth="0.6" opacity="0.18" />
      <circle cx="156" cy="278" r="1.5" fill="#1a1815" opacity="0.18" />
      <path d="M156 279 L156 283" stroke="#1a1815" strokeWidth="0.6" opacity="0.16" />
      <circle cx="150" cy="283" r="1.3" fill="#1a1815" opacity="0.15" />

      {/* === TETHERED HORSES — 2 cavalry horses near the edge of camp === */}
      {/* Horse tethering post */}
      <line x1="760" y1="310" x2="760" y2="286" stroke="#4a3a28" strokeWidth="1.5" opacity="0.4" />
      <line x1="755" y1="288" x2="765" y2="288" stroke="#4a3a28" strokeWidth="1" opacity="0.35" />
      {/* Rope from post */}
      <path d="M760 292 Q764 296 770 298" fill="none" stroke="#6a5a40" strokeWidth="0.5" opacity="0.25" />
      {/* Horse 1 — standing, head down grazing */}
      <path d="M768 294 Q764 288 768 282 Q772 278 778 280 Q784 284 786 290 Q784 296 778 300 Q772 300 768 294 Z"
        fill="url(#ch3_horse)" opacity="0.4" />
      {/* Horse head — lowered, grazing */}
      <path d="M786 290 Q790 286 792 288 Q794 292 790 294 Q788 294 786 292"
        fill="#3a3028" opacity="0.38" />
      {/* Horse ears */}
      <path d="M790 286 L791 283 L792 286" fill="#3a3028" opacity="0.3" />
      {/* Horse mane */}
      <path d="M774 280 Q776 276 778 280" fill="none" stroke="#2a2018" strokeWidth="0.8" opacity="0.25" />
      {/* Horse legs */}
      <line x1="772" y1="300" x2="772" y2="312" stroke="#2a2018" strokeWidth="1" opacity="0.3" />
      <line x1="776" y1="300" x2="776" y2="312" stroke="#2a2018" strokeWidth="1" opacity="0.3" />
      <line x1="781" y1="298" x2="781" y2="310" stroke="#2a2018" strokeWidth="1" opacity="0.3" />
      <line x1="784" y1="296" x2="784" y2="308" stroke="#2a2018" strokeWidth="1" opacity="0.28" />
      {/* Horse tail */}
      <path d="M768 292 Q764 296 762 300 Q764 298 766 294" fill="#2a2018" opacity="0.25" />
      {/* Horse 2 — smaller, standing behind, partially hidden */}
      <path d="M756 298 Q753 292 756 286 Q759 283 764 285 Q768 288 768 294 Q766 300 762 302 Q758 302 756 298 Z"
        fill="#4a3830" opacity="0.28" />
      {/* Horse 2 head */}
      <circle cx="768" cy="289" r="2.5" fill="#4a3830" opacity="0.25" />
      <path d="M770 288 L771 285 L772 288" fill="#4a3830" opacity="0.2" />

      {/* === MUSKET STACK — pyramidal arms stack, period-correct === */}
      {/* Three muskets stacked in pyramid */}
      <line x1="490" y1="340" x2="486" y2="278" stroke="#3a3020" strokeWidth="1" opacity="0.35" />
      <line x1="496" y1="340" x2="493" y2="278" stroke="#3a3020" strokeWidth="1" opacity="0.33" />
      <line x1="493" y1="340" x2="496" y2="278" stroke="#3a3020" strokeWidth="1" opacity="0.3" />
      {/* Bayonets at top — glinting */}
      <line x1="486" y1="278" x2="485" y2="272" stroke="#6a6560" strokeWidth="0.5" opacity="0.25" />
      <line x1="493" y1="278" x2="492" y2="272" stroke="#6a6560" strokeWidth="0.5" opacity="0.23" />
      <line x1="496" y1="278" x2="497" y2="272" stroke="#6a6560" strokeWidth="0.5" opacity="0.23" />

      {/* === FARMER'S CART — small wooden cart loaded with plundered supplies near road === */}
      {/* Cart bed */}
      <rect x="270" y="338" width="30" height="10" fill="url(#ch3_cartWood)" opacity="0.55" />
      {/* Cart sides */}
      <rect x="270" y="332" width="2" height="16" fill="#5a4528" opacity="0.5" />
      <rect x="298" y="332" width="2" height="16" fill="#5a4528" opacity="0.5" />
      <line x1="270" y1="335" x2="300" y2="335" stroke="#5a4528" strokeWidth="0.6" opacity="0.4" />
      {/* Plundered goods heaped in cart */}
      <ellipse cx="278" cy="336" rx="5" ry="3" fill="#5a5040" opacity="0.45" />
      <ellipse cx="288" cy="334" rx="6" ry="4" fill="#6a5540" opacity="0.4" />
      <rect x="282" y="330" width="4" height="5" rx="1" fill="#4a3528" opacity="0.4" />
      <ellipse cx="294" cy="336" rx="4" ry="2.5" fill="#5a5040" opacity="0.38" />
      {/* Cart wheels */}
      <circle cx="276" cy="352" r="5" fill="none" stroke="#4a3a28" strokeWidth="1.2" opacity="0.45" />
      <circle cx="276" cy="352" r="0.8" fill="#4a3a28" opacity="0.4" />
      <line x1="276" y1="347" x2="276" y2="357" stroke="#4a3a28" strokeWidth="0.4" opacity="0.35" />
      <line x1="271" y1="352" x2="281" y2="352" stroke="#4a3a28" strokeWidth="0.4" opacity="0.35" />
      <circle cx="294" cy="352" r="5" fill="none" stroke="#4a3a28" strokeWidth="1.2" opacity="0.45" />
      <circle cx="294" cy="352" r="0.8" fill="#4a3a28" opacity="0.4" />
      <line x1="294" y1="347" x2="294" y2="357" stroke="#4a3a28" strokeWidth="0.4" opacity="0.35" />
      <line x1="289" y1="352" x2="299" y2="352" stroke="#4a3a28" strokeWidth="0.4" opacity="0.35" />
      {/* Cart handles/shafts */}
      <line x1="270" y1="344" x2="258" y2="348" stroke="#5a4528" strokeWidth="1" opacity="0.4" />
      <line x1="270" y1="346" x2="258" y2="350" stroke="#5a4528" strokeWidth="1" opacity="0.4" />

      {/* === CAPTURED SUPPLY WAGON — loaded with goods === */}
      <rect x="465" y="290" width="40" height="18" fill="#4a3a25" stroke="#5a4a35" strokeWidth="0.8" />
      <line x1="475" y1="290" x2="475" y2="308" stroke="#5a4a35" strokeWidth="0.5" opacity="0.4" />
      <line x1="485" y1="290" x2="485" y2="308" stroke="#5a4a35" strokeWidth="0.5" opacity="0.4" />
      <line x1="495" y1="290" x2="495" y2="308" stroke="#5a4a35" strokeWidth="0.5" opacity="0.4" />
      {/* Goods heaped in wagon */}
      <ellipse cx="475" cy="288" rx="5" ry="3" fill="#5a5040" opacity="0.5" />
      <ellipse cx="488" cy="286" rx="6" ry="4" fill="#5a5040" opacity="0.45" />
      <path d="M492 284 Q496 280 500 284 Q496 288 492 284" fill="#4a4030" opacity="0.4" />
      {/* Wheels with spokes */}
      <circle cx="472" cy="312" r="6" fill="none" stroke="#4a3a28" strokeWidth="1.5" />
      <circle cx="472" cy="312" r="1" fill="#4a3a28" />
      <line x1="472" y1="306" x2="472" y2="318" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="466" y1="312" x2="478" y2="312" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="468" y1="308" x2="476" y2="316" stroke="#4a3a28" strokeWidth="0.4" />
      <line x1="476" y1="308" x2="468" y2="316" stroke="#4a3a28" strokeWidth="0.4" />
      <circle cx="498" cy="312" r="6" fill="none" stroke="#4a3a28" strokeWidth="1.5" />
      <circle cx="498" cy="312" r="1" fill="#4a3a28" />
      <line x1="498" y1="306" x2="498" y2="318" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="492" y1="312" x2="504" y2="312" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="494" y1="308" x2="502" y2="316" stroke="#4a3a28" strokeWidth="0.4" />
      <line x1="502" y1="308" x2="494" y2="316" stroke="#4a3a28" strokeWidth="0.4" />
      <line x1="505" y1="300" x2="525" y2="308" stroke="#4a3a28" strokeWidth="1.2" />
      {/* Donkey near wagon */}
      <path d="M520 300 Q516 296 520 292 Q524 290 528 292 Q534 294 536 298 Q534 302 530 304 Q524 304 520 300 Z"
        fill="#4a4040" opacity="0.5" />
      <circle cx="536" cy="295" r="2.5" fill="#4a4040" opacity="0.5" />
      <path d="M536 293 L538 288" stroke="#4a4040" strokeWidth="0.8" opacity="0.4" />
      <path d="M534 293 L536 289" fill="none" stroke="#4a4040" strokeWidth="0.8" opacity="0.4" />
      {/* Donkey legs */}
      <line x1="522" y1="304" x2="522" y2="312" stroke="#4a4040" strokeWidth="1" opacity="0.45" />
      <line x1="528" y1="304" x2="528" y2="312" stroke="#4a4040" strokeWidth="1" opacity="0.45" />

      {/* === CAPTURED AUSTRIAN DRUM USED AS A TABLE === */}
      {/* Drum body — cylinder on its side, viewed slightly from above */}
      <ellipse cx="195" cy="340" rx="10" ry="6" fill="#3a3528" opacity="0.55" />
      <rect x="185" y="334" width="20" height="6" fill="#3a3528" opacity="0.5" />
      <ellipse cx="195" cy="334" rx="10" ry="6" fill="#4a4035" opacity="0.6" />
      {/* Drum head — top face with tension ropes */}
      <ellipse cx="195" cy="334" rx="8" ry="5" fill="#c8c0a8" opacity="0.25" />
      {/* Austrian eagle emblem (simplified) on drum side */}
      <path d="M192 337 Q195 335 198 337" fill="none" stroke="#6a5a40" strokeWidth="0.5" opacity="0.3" />
      <line x1="195" y1="336" x2="195" y2="338" stroke="#6a5a40" strokeWidth="0.4" opacity="0.25" />
      {/* Drum tension ropes — zigzag pattern */}
      <path d="M186 336 L188 340 L190 336 L192 340 L194 336 L196 340 L198 336 L200 340 L202 336 L204 340"
        fill="none" stroke="#6a5a40" strokeWidth="0.4" opacity="0.3" />
      {/* Items on drum-top "table" — a tin cup, bread chunk */}
      <rect x="191" y="330" width="3" height="4" fill="#5a5550" opacity="0.4" />
      <ellipse cx="199" cy="332" rx="2.5" ry="1.5" fill="#6a5530" opacity="0.35" />

      {/* === BATTLEFIELD DEBRIS — scattered remnants of the day's fighting === */}
      {/* Discarded Austrian cartridge box — leather pouch */}
      <rect x="170" y="348" width="5" height="3.5" rx="0.5" fill="#3a2a18" opacity="0.2" />
      <line x1="170" y1="349" x2="175" y2="349" stroke="#4a3a28" strokeWidth="0.3" opacity="0.15" />
      {/* Broken musket ramrod — snapped in half */}
      <line x1="130" y1="334" x2="148" y2="332" stroke="#4a3a28" strokeWidth="0.6" opacity="0.12" />
      <line x1="152" y1="331" x2="162" y2="330" stroke="#4a3a28" strokeWidth="0.6" opacity="0.1" />
      {/* Spent paper cartridges — tiny white scraps on ground */}
      <rect x="310" y="346" width="1.5" height="2" fill="#a89880" opacity="0.06" transform="rotate(25 311 347)" />
      <rect x="345" y="350" width="1.5" height="2" fill="#a89880" opacity="0.05" transform="rotate(-15 346 351)" />
      <rect x="370" y="344" width="1.5" height="2" fill="#a89880" opacity="0.05" transform="rotate(40 371 345)" />
      {/* More scattered cartridge papers — wider debris field */}
      <rect x="430" y="352" width="1.5" height="2" fill="#a89880" opacity="0.04" transform="rotate(10 431 353)" />
      <rect x="520" y="348" width="1.5" height="2" fill="#a89880" opacity="0.04" transform="rotate(-30 521 349)" />
      <rect x="160" y="354" width="1.5" height="2" fill="#a89880" opacity="0.05" transform="rotate(55 161 355)" />
      {/* Lost uniform button — tiny brass circle */}
      <circle cx="255" cy="346" r="0.8" fill="#8a7a40" opacity="0.1" />
      {/* Second button — trampled into mud */}
      <circle cx="460" cy="354" r="0.7" fill="#8a7a40" opacity="0.07" />
      {/* Torn piece of Austrian uniform — white fabric scrap */}
      <path d="M420 350 Q422 348 425 350 Q424 352 421 352 Z" fill="#a8a090" opacity="0.06" />
      {/* Larger uniform fragment — Piedmontese blue */}
      <path d="M540 345 Q543 343 546 345 Q545 348 542 348 Z" fill="#3a5078" opacity="0.05" />
      {/* Discarded crossbelt — leather strap on ground */}
      <path d="M580 340 Q585 338 590 340 Q595 342 600 340" fill="none" stroke="#3a2a18" strokeWidth="0.8" opacity="0.08" />
      {/* Bent bayonet — rusty metal */}
      <path d="M75 348 Q78 345 80 348" fill="none" stroke="#5a4030" strokeWidth="0.6" opacity="0.1" />

      {/* === ADDITIONAL BATTLE AFTERMATH — equipment and damage === */}
      {/* Abandoned Piedmontese musket — dropped in retreat */}
      <line x1="640" y1="358" x2="670" y2="352" stroke="#4a3a28" strokeWidth="0.8" opacity="0.1" />
      {/* Musket lock mechanism — tiny bump */}
      <circle cx="652" cy="354" r="0.6" fill="#5a5048" opacity="0.08" />
      {/* Overturned Piedmontese shako hat — blue with cockade */}
      <path d="M692 346 Q695 342 698 346 Q696 350 692 350 Z" fill="#3a4868" opacity="0.08" />
      <circle cx="695" cy="343" r="0.6" fill="#c8c0a8" opacity="0.05" />
      {/* Discarded canteen — round with strap */}
      <ellipse cx="550" cy="358" rx="2.5" ry="2" fill="#4a4038" opacity="0.1" />
      <path d="M548 356 Q546 354 544 356" fill="none" stroke="#4a3a28" strokeWidth="0.4" opacity="0.06" />
      {/* Torn cartridge pouch with spilled powder — dark stain */}
      <rect x="390" y="356" width="4" height="3" rx="0.5" fill="#3a2a18" opacity="0.08" />
      <ellipse cx="396" cy="358" rx="3" ry="1.5" fill="#1a1508" opacity="0.04" />
      {/* Cannon ball — spent, half-buried */}
      <circle cx="728" cy="352" r="2.5" fill="#3a3028" opacity="0.1" />
      <circle cx="728" cy="351" r="1.5" fill="#4a4038" opacity="0.06" />
      {/* Broken wagon wheel spoke — wooden splinter */}
      <line x1="708" y1="348" x2="718" y2="344" stroke="#5a4528" strokeWidth="0.8" opacity="0.08" />
      {/* Austrian cockade — torn off a hat */}
      <circle cx="335" cy="356" r="1" fill="#1a1815" opacity="0.06" />
      <circle cx="335" cy="356" r="0.5" fill="#c8c0a8" opacity="0.04" />
      {/* Tired soldier's discarded pack — lumpy shape */}
      <path d="M78 340 Q80 336 84 337 Q87 340 85 344 Q81 345 78 340 Z" fill="#3a3020" opacity="0.12" />
      <path d="M80 338 Q82 337 83 339" fill="none" stroke="#4a3a28" strokeWidth="0.3" opacity="0.08" />
      {/* Broken drum — Piedmontese, split head */}
      <ellipse cx="40" cy="338" rx="4" ry="2.5" fill="#4a4035" opacity="0.1" />
      <path d="M37 337 L43 339" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.06" />
      {/* Scattered grapeshot — tiny iron balls */}
      <circle cx="714" cy="356" r="0.6" fill="#3a3028" opacity="0.06" />
      <circle cx="716" cy="358" r="0.5" fill="#3a3028" opacity="0.05" />
      <circle cx="712" cy="354" r="0.5" fill="#3a3028" opacity="0.05" />

      {/* === PLUNDER — FOOD AND WINE === */}
      {/* Wine barrel with tap — proper barrel */}
      <ellipse cx="230" cy="302" rx="14" ry="9" fill="#4a3528" />
      <ellipse cx="230" cy="302" rx="14" ry="9" fill="none" stroke="#5a4538" strokeWidth="0.8" />
      <line x1="220" y1="302" x2="240" y2="302" stroke="#5a4538" strokeWidth="0.5" />
      {/* Barrel bands */}
      <ellipse cx="230" cy="296" rx="12" ry="1.5" fill="none" stroke="#5a4538" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="230" cy="308" rx="12" ry="1.5" fill="none" stroke="#5a4538" strokeWidth="0.5" opacity="0.4" />
      {/* Tap on barrel */}
      <line x1="244" y1="302" x2="250" y2="302" stroke="#5a4538" strokeWidth="1" opacity="0.5" />
      <line x1="250" y1="300" x2="250" y2="304" stroke="#5a4538" strokeWidth="0.8" opacity="0.5" />
      {/* Wine dripping from tap */}
      <line x1="250" y1="304" x2="250" y2="310" stroke="#5a1818" strokeWidth="0.6" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Wine pool beneath */}
      <ellipse cx="248" cy="316" rx="8" ry="3" fill="url(#ch3_winePool)" />
      {/* Second barrel */}
      <ellipse cx="252" cy="306" rx="12" ry="8" fill="#4a3528" />
      <ellipse cx="252" cy="306" rx="12" ry="8" fill="none" stroke="#5a4538" strokeWidth="0.8" />
      {/* Barrel on side — spilling */}
      <ellipse cx="218" cy="314" rx="10" ry="7" fill="#4a3528" opacity="0.8" />
      <line x1="218" y1="318" x2="215" y2="325" stroke="#5a1818" strokeWidth="0.6" opacity="0.25" />

      {/* === SCATTERED PLAYING CARDS ON BARREL TOP === */}
      {/* Cards scattered on the second barrel's top surface */}
      <rect x="248" y="300" width="4" height="5.5" rx="0.3" fill="#c8c0a8" opacity="0.35" transform="rotate(-15 250 303)" />
      <rect x="253" y="299" width="4" height="5.5" rx="0.3" fill="#c8c0a8" opacity="0.3" transform="rotate(10 255 302)" />
      <rect x="250" y="302" width="4" height="5.5" rx="0.3" fill="#c8c0a8" opacity="0.32" transform="rotate(35 252 305)" />
      <rect x="256" y="301" width="4" height="5.5" rx="0.3" fill="#c8c0a8" opacity="0.28" transform="rotate(-25 258 304)" />
      {/* Card markings — tiny pips */}
      <circle cx="250" cy="302" r="0.4" fill="#8a2020" opacity="0.2" />
      <circle cx="255" cy="301" r="0.4" fill="#1a1815" opacity="0.18" />
      <circle cx="252" cy="304" r="0.4" fill="#8a2020" opacity="0.18" />

      {/* === SPILLED WINE — tipped bottle with dark pool === */}
      {/* Tipped wine bottle */}
      <rect x="395" y="336" width="3" height="10" rx="1" fill="#2a3028" opacity="0.5" transform="rotate(-70 396 341)" />
      {/* Bottle neck */}
      <rect x="395" y="332" width="2" height="5" rx="0.5" fill="#2a3028" opacity="0.45" transform="rotate(-70 396 335)" />
      {/* Dark wine pool spreading from bottle mouth */}
      <ellipse cx="403" cy="340" rx="10" ry="4" fill="url(#ch3_spilledWine)" />
      {/* Wine pool reflection — subtle highlight */}
      <ellipse cx="402" cy="339" rx="5" ry="1.5" fill="#6a2020" opacity="0.08" />
      <ellipse cx="405" cy="341" rx="3" ry="1" fill="#7a3030" opacity="0.05" />
      {/* Wine rivulet running from bottle */}
      <path d="M399 338 Q401 336 404 337" fill="none" stroke="#4a1015" strokeWidth="0.6" opacity="0.3" />

      {/* === CHEESE WHEELS AND BREAD LOAVES ON DISPLAY === */}
      {/* Wheels of cheese — larger display */}
      <ellipse cx="390" cy="320" rx="7" ry="4" fill="#8a7a40" opacity="0.45" />
      <ellipse cx="390" cy="320" rx="5" ry="2.5" fill="#9a8a50" opacity="0.3" />
      <ellipse cx="400" cy="325" rx="5" ry="3" fill="#8a7a40" opacity="0.4" />
      {/* Additional cheese wheel — cut, showing interior */}
      <ellipse cx="383" cy="326" rx="4.5" ry="3" fill="#8a7a40" opacity="0.4" />
      <path d="M381 326 Q383 324 385 326" fill="#b0a060" opacity="0.2" />
      {/* Bread loaves — arranged abundantly */}
      <ellipse cx="375" cy="330" rx="5" ry="2.5" fill="#7a6530" opacity="0.45" />
      <ellipse cx="385" cy="332" rx="4.5" ry="2.5" fill="#7a6530" opacity="0.4" />
      <path d="M373 329 Q375 327 377 329" fill="none" stroke="#8a7530" strokeWidth="0.4" opacity="0.25" />
      {/* Round country loaf */}
      <circle cx="393" cy="332" r="3" fill="#7a6530" opacity="0.42" />
      <path d="M391 331 Q393 330 395 331" fill="none" stroke="#8a7530" strokeWidth="0.3" opacity="0.2" />

      {/* Hanging sausages/salami from a post */}
      <line x1="410" y1="330" x2="410" y2="295" stroke="#4a3a28" strokeWidth="1.5" opacity="0.45" />
      <line x1="405" y1="295" x2="415" y2="295" stroke="#4a3a28" strokeWidth="1" opacity="0.4" />
      {/* Hanging sausages */}
      <path d="M406 295 Q405 302 406 308" stroke="#5a2828" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M409 295 Q408 304 409 312" stroke="#5a2828" strokeWidth="1.5" opacity="0.38" fill="none" />
      <path d="M412 295 Q413 301 412 306" stroke="#5a2828" strokeWidth="1.5" opacity="0.35" fill="none" />
      <path d="M414 295 Q415 303 414 310" stroke="#5a2828" strokeWidth="1.2" opacity="0.32" fill="none" />

      {/* Grain sacks */}
      <path d="M435 296 Q440 288 450 291 Q454 296 450 303 Q440 306 435 303 Z" fill="#5a5040" opacity="0.6" />
      <path d="M448 300 Q453 293 461 296 Q464 300 461 306 Q453 308 448 305 Z" fill="#555040" opacity="0.55" />
      {/* Bread loaves scattered */}
      <ellipse cx="340" cy="324" rx="5" ry="3" fill="#6a5530" opacity="0.5" />
      <ellipse cx="355" cy="320" rx="4" ry="2.5" fill="#6a5530" opacity="0.45" />
      <ellipse cx="290" cy="322" rx="4" ry="2.5" fill="#6a5530" opacity="0.4" />
      <ellipse cx="360" cy="330" rx="5" ry="2.5" fill="#6a5530" opacity="0.42" />
      {/* Overturned basket with food spilling out */}
      <path d="M195 320 Q200 312 210 316 Q215 322 205 326 Q198 324 195 320 Z" fill="#5a4a30" opacity="0.4" />
      <ellipse cx="193" cy="322" rx="3" ry="2" fill="#6a5530" opacity="0.35" />
      <circle cx="190" cy="325" r="1.5" fill="#8a3020" opacity="0.3" />
      <circle cx="188" cy="323" r="1.2" fill="#8a3020" opacity="0.25" />
      {/* Another overturned basket — right side */}
      <path d="M555 322 Q560 316 568 319 Q571 324 565 327 Q558 326 555 322 Z" fill="#5a4a30" opacity="0.35" />
      <ellipse cx="553" cy="325" rx="2.5" ry="1.8" fill="#6a5530" opacity="0.3" />
      {/* Chicken — plucked, near fire (dinner!) */}
      <ellipse cx="325" cy="322" rx="4" ry="3" fill="#8a7a60" opacity="0.35" />
      <path d="M321 322 Q319 320 318 322" fill="none" stroke="#8a7a60" strokeWidth="0.8" opacity="0.3" />

      {/* === STACKED WINE BOTTLES — pyramid of 3+1 === */}
      {/* Bottom row — 3 bottles lying on their sides */}
      <rect x="312" y="328" width="3" height="10" rx="1" fill="#2a3028" opacity="0.45" transform="rotate(90 314 333)" />
      <rect x="318" y="328" width="3" height="10" rx="1" fill="#2a3028" opacity="0.42" transform="rotate(90 320 333)" />
      <rect x="324" y="328" width="3" height="10" rx="1" fill="#2a3028" opacity="0.4" transform="rotate(90 326 333)" />
      {/* Top bottle — balanced on top */}
      <rect x="318" y="324" width="3" height="10" rx="1" fill="#2a3028" opacity="0.43" transform="rotate(90 320 329)" />
      {/* Bottle neck highlights */}
      <circle cx="309" cy="333" r="0.8" fill="#3a4038" opacity="0.3" />
      <circle cx="315" cy="333" r="0.8" fill="#3a4038" opacity="0.28" />
      <circle cx="321" cy="333" r="0.8" fill="#3a4038" opacity="0.26" />
      <circle cx="315" cy="329" r="0.8" fill="#3a4038" opacity="0.28" />

      {/* === TORN AUSTRIAN REGIMENTAL FLAG USED AS TABLECLOTH === */}
      {/* Makeshift table — two crates with flag draped over */}
      <rect x="120" y="320" width="12" height="10" fill="#4a3a28" opacity="0.5" />
      <rect x="148" y="322" width="12" height="10" fill="#4a3a28" opacity="0.48" />
      {/* Austrian flag draped across as tablecloth — torn, drooping */}
      <path d="M118 318 Q130 316 142 318 Q155 316 162 318 L162 326 Q155 328 142 326 Q130 328 118 326 Z"
        fill="url(#ch3_austrianFlag)" opacity="0.3">
        <animate attributeName="d"
          values="M118 318 Q130 316 142 318 Q155 316 162 318 L162 326 Q155 328 142 326 Q130 328 118 326 Z;M118 318 Q130 315 142 317 Q155 315 162 318 L162 326 Q155 329 142 327 Q130 329 118 326 Z;M118 318 Q130 316 142 318 Q155 316 162 318 L162 326 Q155 328 142 326 Q130 328 118 326 Z"
          dur="5s" repeatCount="indefinite" />
      </path>
      {/* Torn edge on right side — ragged fringe */}
      <path d="M162 318 L164 320 L162 322 L165 324 L162 326" fill="none" stroke="#8a2828" strokeWidth="0.4" opacity="0.2" />
      {/* Austrian eagle remnant — barely visible */}
      <path d="M138 320 Q140 319 142 320 Q140 321 138 320" fill="#5a3020" opacity="0.12" />
      {/* Items on the flag-tablecloth: tin plate, bread */}
      <ellipse cx="130" cy="320" rx="3" ry="1.5" fill="#6a6560" opacity="0.3" />
      <ellipse cx="150" cy="320" rx="3" ry="2" fill="#6a5530" opacity="0.3" />

      {/* === CAMPFIRE — more dynamic === */}
      {/* Ground glow — larger, warmer */}
      <ellipse cx="340" cy="318" rx="65" ry="22" fill="url(#ch3_fireGlow)">
        <animate attributeName="rx" values="65;72;65" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Stone ring */}
      <ellipse cx="340" cy="318" rx="16" ry="5" fill="none" stroke="#4a4035" strokeWidth="1.5" opacity="0.35" />

      {/* === CHICKEN ON SPIT — roasting over the fire === */}
      {/* Spit stick — diagonal across fire ring */}
      <line x1="324" y1="316" x2="356" y2="314" stroke="#5a4530" strokeWidth="1.2" opacity="0.55" />
      {/* Forked support sticks */}
      <line x1="326" y1="320" x2="326" y2="312" stroke="#5a4530" strokeWidth="1" opacity="0.45" />
      <path d="M325 312 L324 309 M327 312 L328 309" fill="none" stroke="#5a4530" strokeWidth="0.6" opacity="0.4" />
      <line x1="354" y1="318" x2="354" y2="310" stroke="#5a4530" strokeWidth="1" opacity="0.45" />
      <path d="M353 310 L352 307 M355 310 L356 307" fill="none" stroke="#5a4530" strokeWidth="0.6" opacity="0.4" />
      {/* Chicken body — golden-brown roasting bird */}
      <ellipse cx="340" cy="313" rx="7" ry="4" fill="#7a5a30" opacity="0.6" />
      {/* Drumsticks sticking out */}
      <path d="M335 313 Q332 316 330 314" fill="none" stroke="#6a4a25" strokeWidth="1.2" opacity="0.5" />
      <path d="M345 313 Q348 316 350 314" fill="none" stroke="#6a4a25" strokeWidth="1.2" opacity="0.5" />
      {/* Glistening highlight on skin */}
      <ellipse cx="340" cy="312" rx="4" ry="1.5" fill="#a07a40" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.12;0.2" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Fat dripping into fire */}
      <line x1="340" y1="317" x2="340" y2="319" stroke="#a08040" strokeWidth="0.4" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite" />
      </line>

      {/* Log in fire */}
      <line x1="328" y1="319" x2="352" y2="317" stroke="#3a2818" strokeWidth="2" opacity="0.4" />
      <line x1="332" y1="316" x2="348" y2="320" stroke="#3a2818" strokeWidth="1.8" opacity="0.35" />
      {/* Outer flame */}
      <path d="M334 316 Q337 300 340 290 Q343 300 346 316" fill="#d08040" opacity="0.8">
        <animate attributeName="d" values="M334 316 Q337 300 340 290 Q343 300 346 316;M334 316 Q338 298 340 287 Q342 298 346 316;M334 316 Q337 300 340 290 Q343 300 346 316" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Secondary flame — left lick */}
      <path d="M332 317 Q330 306 334 298" fill="none" stroke="#c07035" strokeWidth="2" opacity="0.4">
        <animate attributeName="d" values="M332 317 Q330 306 334 298;M332 317 Q328 304 332 295;M332 317 Q330 306 334 298" dur="0.7s" repeatCount="indefinite" />
      </path>
      {/* Secondary flame — right lick */}
      <path d="M348 317 Q350 308 346 300" fill="none" stroke="#c07035" strokeWidth="2" opacity="0.35">
        <animate attributeName="d" values="M348 317 Q350 308 346 300;M348 317 Q352 306 348 297;M348 317 Q350 308 346 300" dur="0.9s" repeatCount="indefinite" />
      </path>
      {/* Inner flame */}
      <path d="M336 316 Q338 304 340 296 Q342 304 344 316" fill="#e0a050" opacity="0.6">
        <animate attributeName="d" values="M336 316 Q338 304 340 296 Q342 304 344 316;M336 316 Q339 302 340 293 Q341 302 344 316;M336 316 Q338 304 340 296 Q342 304 344 316" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Bright core */}
      <path d="M338 316 Q339 308 340 302 Q341 308 342 316" fill="#f0c060" opacity="0.5">
        <animate attributeName="d" values="M338 316 Q339 308 340 302 Q341 308 342 316;M338 316 Q340 306 340 300 Q341 306 342 316;M338 316 Q339 308 340 302 Q341 308 342 316" dur="0.4s" repeatCount="indefinite" />
      </path>
      {/* Embers at base */}
      <circle cx="335" cy="317" r="1" fill="#e07020" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="345" cy="318" r="0.8" fill="#e08030" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Additional embers — scattered around log edges */}
      <circle cx="330" cy="318" r="0.6" fill="#e09040" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="317" r="0.7" fill="#e07030" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="319" r="0.5" fill="#f0a050" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="0.9s" repeatCount="indefinite" />
      </circle>
      {/* Charcoal and ash ring — gray-white at fire perimeter */}
      <ellipse cx="340" cy="318" rx="18" ry="6" fill="none" stroke="#4a4540" strokeWidth="0.5" opacity="0.08" />
      <ellipse cx="340" cy="318" rx="14" ry="4.5" fill="#3a3530" opacity="0.06" />
      {/* Warm light reflection on stone ring — individual stones catching firelight */}
      <ellipse cx="328" cy="318" rx="2" ry="1.5" fill="#d09040" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="352" cy="317" rx="2" ry="1.5" fill="#d09040" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === SMOKE FROM COOKING FIRE — animated wisps drifting upward === */}
      {/* Wisp 1 — large, slow drift left */}
      <path d="M340 285 Q336 272 340 260 Q344 248 338 236" fill="none" stroke="#8a8070" strokeWidth="2" opacity="0.06">
        <animate attributeName="d"
          values="M340 285 Q336 272 340 260 Q344 248 338 236;M340 285 Q344 270 338 258 Q334 246 340 234;M340 285 Q336 272 340 260 Q344 248 338 236"
          dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Wisp 2 — thinner, drifting right */}
      <path d="M342 282 Q346 268 342 255 Q338 242 344 230" fill="none" stroke="#8a8070" strokeWidth="1.5" opacity="0.05">
        <animate attributeName="d"
          values="M342 282 Q346 268 342 255 Q338 242 344 230;M342 282 Q338 266 344 253 Q348 240 342 228;M342 282 Q346 268 342 255 Q338 242 344 230"
          dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="6s" repeatCount="indefinite" />
      </path>
      {/* Wisp 3 — small, fast, curling */}
      <path d="M338 278 Q334 268 338 258" fill="none" stroke="#8a8070" strokeWidth="1" opacity="0.04">
        <animate attributeName="d"
          values="M338 278 Q334 268 338 258;M338 278 Q342 266 336 256;M338 278 Q334 268 338 258"
          dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Wisp 4 — wide, lazy drift */}
      <path d="M336 280 Q330 265 336 250 Q342 235 334 222" fill="none" stroke="#9a9080" strokeWidth="2.5" opacity="0.04">
        <animate attributeName="d"
          values="M336 280 Q330 265 336 250 Q342 235 334 222;M336 280 Q342 263 334 248 Q328 233 336 220;M336 280 Q330 265 336 250 Q342 235 334 222"
          dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.06;0.04" dur="7s" repeatCount="indefinite" />
      </path>
      {/* Wisp 5 — very thin, high rising, catches wind */}
      <path d="M344 276 Q348 262 342 248 Q338 236 344 224 Q348 214 342 206" fill="none" stroke="#8a8070" strokeWidth="1" opacity="0.03">
        <animate attributeName="d"
          values="M344 276 Q348 262 342 248 Q338 236 344 224 Q348 214 342 206;M344 276 Q340 260 346 246 Q350 234 344 222 Q340 212 346 204;M344 276 Q348 262 342 248 Q338 236 344 224 Q348 214 342 206"
          dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="8s" repeatCount="indefinite" />
      </path>
      {/* Warm underlight on smoke belly — fire reflecting upward onto smoke */}
      <ellipse cx="340" cy="270" rx="12" ry="6" fill="url(#ch3_smokeReflect)">
        <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke shadow on ground — subtle dark patch downwind */}
      <ellipse cx="350" cy="310" rx="8" ry="3" fill="#1a1510" opacity="0.02" />

      {/* Sparks — more of them */}
      <circle cx="338" cy="285" r="0.8" fill="#e0b060" opacity="0.6">
        <animate attributeName="cy" values="285;260;235" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="344" cy="280" r="0.6" fill="#d0a050" opacity="0.5">
        <animate attributeName="cy" values="280;252;228" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="288" r="0.5" fill="#e0b070" opacity="0.45">
        <animate attributeName="cy" values="288;268;248" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.15;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="336" cy="282" r="0.4" fill="#e0c070" opacity="0.4">
        <animate attributeName="cy" values="282;258;234" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="336;332;330" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="342" cy="284" r="0.5" fill="#e0a060" opacity="0.35">
        <animate attributeName="cy" values="284;262;240" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="342;348;350" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.1;0" dur="3.2s" repeatCount="indefinite" />
      </circle>
      {/* Extra sparks — tiny orange motes rising erratically */}
      <circle cx="337" cy="286" r="0.3" fill="#f0b060" opacity="0.3">
        <animate attributeName="cy" values="286;270;254" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="337;334;332" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.12;0" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="343" cy="282" r="0.35" fill="#e0c060" opacity="0.25">
        <animate attributeName="cy" values="282;264;246" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="343;346;344" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.08;0" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="339" cy="288" r="0.25" fill="#f0a040" opacity="0.35">
        <animate attributeName="cy" values="288;274;260" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="339;342;345" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.1;0" dur="1.6s" repeatCount="indefinite" />
      </circle>

      {/* === CATS PROWLING NEAR THE COOKING AREA === */}
      {/* Cat 1 — sitting, watching the roasting chicken intently */}
      <path d="M362 326 Q360 322 362 318 Q364 316 366 318 Q368 322 366 326 Z"
        fill="#2a2218" opacity="0.45" />
      <circle cx="364" cy="316" r="1.8" fill="#2a2218" opacity="0.45" />
      {/* Ears — pointed triangles */}
      <path d="M362.5 314.5 L363 312.5 L364 314.5" fill="#2a2218" opacity="0.4" />
      <path d="M364 314.5 L365 312.5 L365.5 314.5" fill="#2a2218" opacity="0.4" />
      {/* Tail — curled upward */}
      <path d="M362 326 Q358 324 356 320 Q355 318 357 317" fill="none" stroke="#2a2218" strokeWidth="0.8" opacity="0.35" />
      {/* Eyes — tiny glints reflecting firelight */}
      <circle cx="363" cy="315.5" r="0.4" fill="#c0a040" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="365" cy="315.5" r="0.4" fill="#c0a040" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Cat 2 — slinking, lower, nearer to fire */}
      <path d="M318 328 Q316 326 318 324 Q322 322 326 324 Q328 326 326 328 Q322 330 318 328 Z"
        fill="#3a3028" opacity="0.35" />
      <circle cx="316" cy="325" r="1.5" fill="#3a3028" opacity="0.35" />
      {/* Ears */}
      <path d="M315 323.5 L315.5 322 L316.5 323.5" fill="#3a3028" opacity="0.3" />
      {/* Tail trailing behind */}
      <path d="M326 326 Q330 324 332 326" fill="none" stroke="#3a3028" strokeWidth="0.6" opacity="0.25" />

      {/* === SOLDIERS CELEBRATING — 10 figures + 2 dancing === */}
      {/* Soldier 1 — standing, arms raised in triumph, toasting */}
      <path d="M305 300 Q302 285 305 274 Q308 268 311 274 L313 300 Q312 308 311 315 L305 315 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="308" cy="265" r="5" fill="#1a1815" opacity="0.8" />
      <path d="M313 275 Q318 262 320 252" fill="none" stroke="#1a1815" strokeWidth="2.2" opacity="0.75" />
      <path d="M305 276 Q300 264 297 255" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.7" />
      {/* Raised bottle/cup */}
      <rect x="318" y="246" width="3" height="8" fill="#2a2520" opacity="0.6" rx="1" />

      {/* Soldier 2 — sitting, drinking */}
      <path d="M370 310 Q368 300 370 294 Q372 290 374 294 L375 310 Z"
        fill="#1a1815" opacity="0.75" />
      <circle cx="372" cy="288" r="4.5" fill="#1a1815" opacity="0.75" />
      <path d="M376 292 Q380 288 383 284" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.6" />
      <rect x="382" y="280" width="2.5" height="6" fill="#2a2520" opacity="0.5" rx="0.5" />
      <path d="M370 310 Q375 315 382 318" fill="none" stroke="#1a1815" strokeWidth="2.5" opacity="0.55" />

      {/* Soldier 3 — leaning on barrel, merry */}
      <path d="M238 290 Q236 280 238 274 Q240 270 242 274 L244 290 Z"
        fill="#1a1815" opacity="0.75" />
      <circle cx="240" cy="267" r="4.5" fill="#1a1815" opacity="0.75" />
      <path d="M244 275 Q248 278 252 280" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.55" />

      {/* Soldier 4 — sitting by wagon, eating */}
      <path d="M440 316 Q438 308 440 303 Q442 308 442 316 Z" fill="#1a1815" opacity="0.7" />
      <circle cx="440" cy="300" r="4" fill="#1a1815" opacity="0.7" />
      <path d="M443 303 Q446 300 448 298" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.5" />

      {/* Soldiers 5 and 6 — arm-in-arm companions */}
      <path d="M273 300 Q271 288 273 280 Q275 276 277 280 L279 300 Q278 306 277 312 L273 312 Z"
        fill="#1a1815" opacity="0.72" />
      <circle cx="275" cy="274" r="4.5" fill="#1a1815" opacity="0.72" />
      <path d="M286 302 Q284 290 286 282 Q288 278 290 282 L292 302 Q291 308 290 314 L286 314 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="288" cy="276" r="4" fill="#1a1815" opacity="0.7" />
      {/* Arms linked together */}
      <path d="M279 280 Q282 278 286 280" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />
      <path d="M279 286 Q282 285 286 286" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />

      {/* Soldier 7 — pouring wine from a jug at the barrel */}
      <path d="M210 296 Q208 286 210 280 Q212 276 214 280 L216 296 Q215 302 214 308 L210 308 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="212" cy="274" r="4" fill="#1a1815" opacity="0.7" />
      {/* Arm extended pouring */}
      <path d="M216 281 Q222 284 228 288" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.55" />
      {/* Jug in hand */}
      <path d="M226 285 Q228 283 230 286 Q228 289 226 287 Z" fill="#4a3528" opacity="0.5" />
      {/* Pour stream */}
      <line x1="229" y1="288" x2="230" y2="298" stroke="#5a1818" strokeWidth="0.5" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.12;0.25" dur="1s" repeatCount="indefinite" />
      </line>

      {/* Soldier 8 — slumped drunk, leaning back */}
      <path d="M172 318 Q170 312 173 308 Q176 312 175 318 Z" fill="#1a1815" opacity="0.6" />
      <circle cx="174" cy="305" r="3.5" fill="#1a1815" opacity="0.6" />
      {/* Sprawled legs */}
      <path d="M170 318 Q165 325 158 330" fill="none" stroke="#1a1815" strokeWidth="2.2" opacity="0.45" />
      <path d="M176 318 Q180 325 186 328" fill="none" stroke="#1a1815" strokeWidth="2.2" opacity="0.45" />
      {/* Dropped bottle */}
      <rect x="186" y="326" width="2" height="5" fill="#2a2520" opacity="0.35" transform="rotate(45 187 329)" />

      {/* Soldier 9 — two soldiers arm-in-arm walking/swaying (far left) */}
      <path d="M90 310 Q88 300 90 294 Q92 290 94 294 L95 310 Q94 316 93 320 L90 320 Z"
        fill="#1a1815" opacity="0.55" />
      <circle cx="92" cy="288" r="4" fill="#1a1815" opacity="0.55" />
      <path d="M105 312 Q103 302 105 296 Q107 292 109 296 L110 312 Q109 318 108 322 L105 322 Z"
        fill="#1a1815" opacity="0.52" />
      <circle cx="107" cy="290" r="3.8" fill="#1a1815" opacity="0.52" />
      {/* Arms slung over each other's shoulders */}
      <path d="M95 294 Q100 290 105 294" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.4" />

      {/* Soldier 10 — fife player silhouette, sitting on a crate */}
      <rect x="555" y="306" width="10" height="7" fill="#3a3020" opacity="0.4" />
      <path d="M558 306 Q556 296 558 290 Q560 286 562 290 L564 306 Z"
        fill="#1a1815" opacity="0.65" />
      <circle cx="560" cy="284" r="4" fill="#1a1815" opacity="0.65" />
      {/* Arms holding fife — one extended */}
      <path d="M564 290 Q568 286 574 284" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.5" />
      <path d="M558 290 Q556 286 554 284" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45" />
      {/* The fife itself */}
      <line x1="554" y1="284" x2="574" y2="283" stroke="#5a4a35" strokeWidth="1" opacity="0.5" />

      {/* === SOLDIER JUGGLING — 3 balls animated in arc === */}
      <g>
        {/* Juggler body — standing, arms up */}
        <path d="M480 320 Q478 308 480 300 Q482 296 484 300 L486 320 Q485 326 484 332 L480 332 Z"
          fill="#1a1815" opacity="0.65" />
        <circle cx="482" cy="294" r="4" fill="#1a1815" opacity="0.65" />
        {/* Left arm raised */}
        <path d="M478 300 Q474 292 472 286" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.5" />
        {/* Right arm raised */}
        <path d="M486 300 Q490 292 492 286" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.5" />
        {/* Juggling ball 1 — arcing left to right */}
        <circle cx="476" cy="280" r="2" fill="#8a3020" opacity="0.55">
          <animate attributeName="cx" values="476;482;488;482;476" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="280;272;280;272;280" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* Juggling ball 2 — offset timing */}
        <circle cx="488" cy="280" r="2" fill="#2a3568" opacity="0.5">
          <animate attributeName="cx" values="488;482;476;482;488" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="280;272;280;272;280" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* Juggling ball 3 — top of arc */}
        <circle cx="482" cy="272" r="2" fill="#a08530" opacity="0.5">
          <animate attributeName="cx" values="482;488;482;476;482" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="272;280;272;280;272" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === SOLDIER ARM-WRESTLING AT MAKESHIFT TABLE === */}
      {/* Makeshift table — plank on two stumps */}
      <rect x="40" y="310" width="6" height="8" rx="1" fill="#3a3020" opacity="0.45" />
      <rect x="66" y="312" width="6" height="8" rx="1" fill="#3a3020" opacity="0.42" />
      <rect x="38" y="308" width="36" height="2" fill="#5a4528" opacity="0.5" />
      {/* Arm-wrestler 1 — left side, leaning in */}
      <path d="M42 320 Q40 312 42 306 Q44 302 46 306 L48 320 Z" fill="#1a1815" opacity="0.6" />
      <circle cx="44" cy="300" r="3.5" fill="#1a1815" opacity="0.6" />
      {/* Right arm extended to table, clasping */}
      <path d="M48 306 Q52 304 56 306" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />
      {/* Arm-wrestler 2 — right side, straining */}
      <path d="M68 318 Q66 310 68 304 Q70 300 72 304 L74 318 Z" fill="#1a1815" opacity="0.58" />
      <circle cx="70" cy="298" r="3.5" fill="#1a1815" opacity="0.58" />
      {/* Left arm extended to table, clasping */}
      <path d="M66 304 Q62 302 58 304" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.48" />
      {/* Clasped hands — center of table */}
      <circle cx="56" cy="305" r="2" fill="#1a1815" opacity="0.5" />
      {/* Subtle arm strain animation — wobble */}
      <path d="M54 304 Q56 302 58 304" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.35">
        <animate attributeName="d"
          values="M54 304 Q56 302 58 304;M54 304 Q56 303 58 304;M54 304 Q56 302 58 304"
          dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* === EXHAUSTED SOLDIER — sitting with head in hands, battle fatigue === */}
      <path d="M132 318 Q130 312 132 306 Q134 312 134 318 Z" fill="#1a1815" opacity="0.5" />
      <circle cx="133" cy="303" r="3" fill="#1a1815" opacity="0.5" />
      {/* Hands up to face, head bowed — tired posture */}
      <path d="M130 304 Q128 300 130 298" fill="none" stroke="#1a1815" strokeWidth="1.2" opacity="0.35" />
      <path d="M136 304 Q138 300 136 298" fill="none" stroke="#1a1815" strokeWidth="1.2" opacity="0.35" />
      {/* Legs drawn up, sitting against the stone wall */}
      <path d="M130 318 Q128 324 126 328" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.35" />
      <path d="M134 318 Q136 322 140 324" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.35" />
      {/* Musket propped beside him */}
      <line x1="140" y1="328" x2="144" y2="296" stroke="#3a3020" strokeWidth="0.8" opacity="0.2" />
      {/* Bandaged hand — white wrap */}
      <circle cx="130" cy="299" r="1.2" fill="#a89880" opacity="0.12" />

      {/* === SOLDIER TENDING TO WOUNDED COMRADE — battle aftermath care === */}
      {/* Wounded soldier lying on ground */}
      <path d="M696 334 Q700 332 706 333 Q710 335 706 338 Q700 339 696 336 Z" fill="#1a1815" opacity="0.3" />
      <circle cx="694" cy="334" r="2.2" fill="#1a1815" opacity="0.3" />
      {/* Bandage on leg — white linen strip */}
      <line x1="704" y1="336" x2="708" y2="338" stroke="#a89880" strokeWidth="0.8" opacity="0.1" />
      {/* Kneeling comrade tending */}
      <path d="M712 340 Q710 334 712 328 Q714 334 714 340 Z" fill="#1a1815" opacity="0.35" />
      <circle cx="713" cy="326" r="2.5" fill="#1a1815" opacity="0.35" />
      <path d="M710 329 Q706 332 704 336" fill="none" stroke="#1a1815" strokeWidth="1.2" opacity="0.25" />

      {/* === SOLDIER TRYING ON CAPTURED AUSTRIAN OFFICER'S HAT === */}
      {/* Soldier standing, one hand holding oversized bicorne */}
      <path d="M508 316 Q506 306 508 298 Q510 294 512 298 L514 316 Q513 322 512 328 L508 328 Z"
        fill="#1a1815" opacity="0.6" />
      <circle cx="510" cy="292" r="4" fill="#1a1815" opacity="0.6" />
      {/* Austrian officer's bicorne hat — too large, perched comically */}
      <path d="M504 290 Q510 286 516 290 Q514 292 510 293 Q506 292 504 290 Z" fill="#1a1510" opacity="0.55" />
      {/* Hat plume — white feather, Austrian officer style */}
      <path d="M514 288 Q516 284 518 280 Q517 282 515 286" fill="#c8c0a8" opacity="0.3" />
      {/* Gold hat trim */}
      <path d="M505 290 Q510 287 515 290" fill="none" stroke="#a08530" strokeWidth="0.5" opacity="0.3" />
      {/* Right arm up adjusting hat */}
      <path d="M514 298 Q516 294 515 290" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45" />
      {/* Left arm on hip, preening pose */}
      <path d="M506 300 Q502 304 500 308" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />

      {/* === DANCING SOLDIERS — 2 figures dancing arm-in-arm, celebrating === */}
      <g opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" values="-2 425 310;2 425 310;-2 425 310" dur="1.5s" repeatCount="indefinite" />
        {/* Dancer 1 — left figure */}
        <path d="M415 318 Q413 308 415 300 Q417 296 419 300 L420 318 Z"
          fill="#1a1815" opacity="0.75" />
        <circle cx="417" cy="294" r="4" fill="#1a1815" opacity="0.75" />
        {/* Left arm raised high, celebrating */}
        <path d="M413 300 Q408 292 405 285" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.6" />
        {/* Right arm linked to partner */}
        <path d="M420 302 Q425 300 430 302" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.55" />
        {/* Legs in dancing stance */}
        <path d="M415 318 Q412 325 408 330" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />
        <path d="M418 318 Q422 324 426 328" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />

        {/* Dancer 2 — right figure */}
        <path d="M430 316 Q428 306 430 298 Q432 294 434 298 L435 316 Z"
          fill="#1a1815" opacity="0.72" />
        <circle cx="432" cy="292" r="4" fill="#1a1815" opacity="0.72" />
        {/* Right arm raised high, celebrating */}
        <path d="M435 300 Q440 290 444 283" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.58" />
        {/* Left arm linked to partner */}
        <path d="M430 302 Q425 300 420 302" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.55" />
        {/* Legs in dancing stance */}
        <path d="M430 316 Q427 323 423 328" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.48" />
        <path d="M433 316 Q437 323 441 328" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.48" />
      </g>

      {/* === LANTERN HANGING FROM TREE BRANCH — with warm glow === */}
      {/* Tree branch — extends from the left olive tree */}
      <path d="M74 232 Q82 228 92 230 Q100 232 108 228" fill="none" stroke="#3a3525" strokeWidth="1.5" opacity="0.45" />
      {/* Rope/wire hanging lantern */}
      <line x1="96" y1="230" x2="96" y2="240" stroke="#4a3a28" strokeWidth="0.5" opacity="0.35" />
      {/* Lantern body — small metal frame */}
      <rect x="93" y="240" width="6" height="8" rx="1" fill="#4a3a28" opacity="0.5" />
      {/* Lantern top cap */}
      <path d="M92 240 L96 237 L100 240" fill="#4a3a28" opacity="0.45" />
      {/* Lantern glass — warm glow inside */}
      <rect x="94" y="241" width="4" height="6" fill="#e0a040" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.25;0.35" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Radial glow around lantern */}
      <circle cx="96" cy="244" r="18" fill="url(#ch3_lanternGlow)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.3;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Lantern bottom ring */}
      <line x1="93" y1="248" x2="99" y2="248" stroke="#4a3a28" strokeWidth="0.5" opacity="0.4" />

      {/* === FOREGROUND DETAILS === */}
      {/* Wildflowers — more abundant, varied colors */}
      <circle cx="100" cy="345" r="1.2" fill="#a06040" opacity="0.2" />
      <circle cx="180" cy="350" r="1.3" fill="#8a5540" opacity="0.2" />
      <circle cx="550" cy="342" r="1.1" fill="#a06040" opacity="0.18" />
      <circle cx="750" cy="355" r="1.2" fill="#a06040" opacity="0.17" />
      <circle cx="60" cy="358" r="1.4" fill="#a07050" opacity="0.2" />
      <circle cx="250" cy="362" r="1.0" fill="#8a6045" opacity="0.18" />
      <circle cx="420" cy="356" r="1.3" fill="#a06040" opacity="0.16" />
      <circle cx="650" cy="350" r="1.1" fill="#8a5540" opacity="0.15" />
      {/* Yellow wildflower clusters (poppies in warm light) */}
      <circle cx="120" cy="352" r="1.5" fill="#b09040" opacity="0.18" />
      <circle cx="122" cy="354" r="1.2" fill="#b09040" opacity="0.15" />
      <circle cx="500" cy="348" r="1.3" fill="#b09040" opacity="0.16" />
      {/* Additional wildflower clusters — Piedmontese meadow flowers */}
      <circle cx="30" cy="345" r="1.1" fill="#a07050" opacity="0.18" />
      <circle cx="32" cy="347" r="0.9" fill="#a07050" opacity="0.15" />
      <circle cx="350" cy="358" r="1.2" fill="#8a5540" opacity="0.14" />
      <circle cx="480" cy="360" r="1" fill="#a06040" opacity="0.14" />
      <circle cx="700" cy="358" r="1.3" fill="#b09040" opacity="0.13" />
      <circle cx="210" cy="356" r="1.1" fill="#a07050" opacity="0.15" />
      <circle cx="580" cy="355" r="0.9" fill="#8a6045" opacity="0.13" />
      {/* Tiny white daisies — scattered */}
      <circle cx="160" cy="348" r="0.8" fill="#c8c0a8" opacity="0.1" />
      <circle cx="440" cy="362" r="0.7" fill="#c8c0a8" opacity="0.08" />
      <circle cx="620" cy="356" r="0.8" fill="#c8c0a8" opacity="0.08" />
      <circle cx="80" cy="365" r="0.7" fill="#c8c0a8" opacity="0.09" />
      {/* Dandelion puffs — tiny white spheres */}
      <circle cx="530" cy="350" r="1.5" fill="#c8c0a8" opacity="0.06" />
      <circle cx="170" cy="362" r="1.3" fill="#c8c0a8" opacity="0.05" />
      {/* Grass tufts — more plentiful */}
      <path d="M0 368 Q4 360 8 368 Q12 358 16 368 Q20 362 24 368"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.3" />
      <path d="M780 365 Q784 356 788 365 Q792 354 796 365"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.3" />
      <path d="M140 370 Q144 362 148 370 Q152 360 156 370"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.25" />
      <path d="M400 372 Q404 364 408 372 Q412 362 416 372"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.22" />
      <path d="M600 366 Q604 358 608 366 Q612 356 616 366"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.25" />
      {/* Additional grass tufts — filling the foreground */}
      <path d="M50 375 Q53 368 56 375 Q59 366 62 375"
        fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.2" />
      <path d="M220 374 Q223 366 226 374 Q229 364 232 374"
        fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.2" />
      <path d="M310 376 Q313 368 316 376 Q319 367 322 376"
        fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.18" />
      <path d="M500 370 Q503 362 506 370 Q509 360 512 370"
        fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.2" />
      <path d="M680 374 Q683 366 686 374 Q689 364 692 374"
        fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.18" />
      {/* Very near foreground grass — larger, darker tufts */}
      <path d="M340 382 Q344 372 348 382 Q352 370 356 382 Q360 374 364 382"
        fill="none" stroke="#2a3520" strokeWidth="1.2" opacity="0.2" />
      <path d="M720 380 Q724 370 728 380 Q732 368 736 380"
        fill="none" stroke="#2a3520" strokeWidth="1.2" opacity="0.18" />
      <path d="M100 385 Q104 376 108 385 Q112 374 116 385"
        fill="none" stroke="#2a3520" strokeWidth="1.1" opacity="0.18" />
      {/* Foreground grass with warm tips — firelight on grass blades */}
      <path d="M250 380 Q253 371 256 380 Q259 369 262 380"
        fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.16" />
      <path d="M250 378 Q253 372 256 378" fill="none" stroke="#4a4530" strokeWidth="0.5" opacity="0.06" />
      <path d="M440 378 Q443 370 446 378 Q449 368 452 378"
        fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.15" />
      <path d="M560 382 Q563 374 566 382 Q569 372 572 382"
        fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.14" />
      <path d="M180 386 Q183 378 186 386 Q189 376 192 386"
        fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.15" />
      {/* Clover patches — three-leaf clusters */}
      <g opacity="0.06">
        <circle cx="300" cy="370" r="0.8" fill="#3a5028" />
        <circle cx="301.5" cy="369" r="0.8" fill="#3a5028" />
        <circle cx="301" cy="371" r="0.8" fill="#3a5028" />
      </g>
      <g opacity="0.05">
        <circle cx="500" cy="375" r="0.7" fill="#3a5028" />
        <circle cx="501.3" cy="374" r="0.7" fill="#3a5028" />
        <circle cx="500.7" cy="376" r="0.7" fill="#3a5028" />
      </g>
      {/* Plantain weeds — flat rosette shapes at ground level */}
      <ellipse cx="380" cy="368" rx="2.5" ry="1" fill="#3a4828" opacity="0.06" />
      <ellipse cx="620" cy="372" rx="2" ry="0.8" fill="#3a4828" opacity="0.05" />
      {/* Tiny mushroom cluster near hay bale dampness */}
      <line x1="586" y1="312" x2="586" y2="310" stroke="#8a7a60" strokeWidth="0.3" opacity="0.08" />
      <ellipse cx="586" cy="310" rx="1" ry="0.5" fill="#8a7a60" opacity="0.08" />
      <line x1="588" y1="313" x2="588" y2="311" stroke="#8a7a60" strokeWidth="0.3" opacity="0.06" />
      <ellipse cx="588" cy="311" rx="0.8" ry="0.4" fill="#8a7a60" opacity="0.06" />
      {/* Dew drops on near grass — tiny bright specks catching firelight */}
      <circle cx="345" cy="380" r="0.4" fill="#e0b060" opacity="0.06" />
      <circle cx="350" cy="378" r="0.3" fill="#e0b060" opacity="0.05" />
      <circle cx="110" cy="384" r="0.4" fill="#d0a050" opacity="0.05" />
      <circle cx="730" cy="379" r="0.35" fill="#d0a050" opacity="0.04" />

      {/* === CAST SHADOWS — from major objects, long evening shadows === */}
      {/* Campfire light casts warm glow on nearby objects */}
      <ellipse cx="340" cy="340" rx="50" ry="15" fill="#d09040" opacity="0.03" />
      {/* Farmhouse long shadow — stretching left in evening light */}
      <path d="M640 306 Q600 330 560 355 L635 355 L690 306 Z" fill="#1a1510" opacity="0.04" />
      {/* Banner pole shadow */}
      <path d="M160 310 Q155 325 148 340" fill="none" stroke="#1a1510" strokeWidth="1" opacity="0.04" />
      {/* Cypress tree shadows — long and thin */}
      <path d="M145 262 Q130 280 120 300" fill="none" stroke="#1a1510" strokeWidth="2" opacity="0.03" />
      <path d="M189 258 Q175 275 165 295" fill="none" stroke="#1a1510" strokeWidth="1.8" opacity="0.025" />

      {/* === FIREFLIES — more of them, wandering === */}
      <circle cx="200" cy="290" r="2" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.7;0" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="290;285;290" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="580" cy="300" r="1.8" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.6;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="580;585;580" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="130" cy="310" r="1.5" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.5;0" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="310;304;310" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="700" cy="280" r="1.6" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.55;0" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="700;705;700" dur="5s" repeatCount="indefinite" />
      </circle>
      {/* Additional fireflies — filling the warm evening */}
      <circle cx="450" cy="275" r="1.4" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.5;0" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="275;270;275" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="268" r="1.3" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.45;0" dur="3.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="320;325;320" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="295" r="1.5" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.5;0" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="295;290;295" dur="5.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="300" r="1.2" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.4;0" dur="4.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="50;54;50" dur="4.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="760" cy="310" r="1.3" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.45;0" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="310;305;310" dur="3.6s" repeatCount="indefinite" />
      </circle>

      {/* === EXTRA FIREFLIES — 4 more drifting through the warm evening === */}
      <circle cx="160" cy="272" r="1.4" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.55;0" dur="4.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="160;165;160" dur="4.8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="272;268;272" dur="4.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="290" r="1.6" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.5;0" dur="3.3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="290;284;290" dur="3.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="278" r="1.2" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.48;0" dur="5.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="380;386;380" dur="5.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="640" cy="270" r="1.3" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.42;0" dur="4.6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="270;264;270" dur="4.6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="640;636;640" dur="4.6s" repeatCount="indefinite" />
      </circle>

      {/* Warm air shimmer above fire */}
      <ellipse cx="340" cy="275" rx="20" ry="8" fill="#d09040" opacity="0.03">
        <animate attributeName="ry" values="8;12;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === DUST MOTES IN THE AIR — tiny particles catching firelight === */}
      <circle cx="300" cy="295" r="0.4" fill="#d0a060" opacity="0.15">
        <animate attributeName="cy" values="295;290;295" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="360" cy="302" r="0.3" fill="#d0a060" opacity="0.12">
        <animate attributeName="cy" values="302;298;302" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="288" r="0.35" fill="#d0a060" opacity="0.1">
        <animate attributeName="cx" values="280;284;280" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="310" r="0.3" fill="#d0a060" opacity="0.1">
        <animate attributeName="cy" values="310;306;310" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="275" r="0.35" fill="#d0a060" opacity="0.12">
        <animate attributeName="cx" values="320;316;320" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="275;270;275" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* === MOTH NEAR LANTERN — tiny fluttering around the warm light === */}
      <circle cx="96" cy="244" r="0.8" fill="#8a7860" opacity="0.2">
        <animate attributeName="cx" values="90;96;102;96;90" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="240;236;240;248;240" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.1;0.2;0.15;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="240" r="0.6" fill="#8a7860" opacity="0.15">
        <animate attributeName="cx" values="100;94;88;94;100" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" values="240;244;248;244;240" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* === DISTANT BATTLE SMOKE CLEARING — wide atmospheric haze band === */}
      {/* Low-lying gunpowder smoke remnant — drifting across mid-ground */}
      <ellipse cx="400" cy="240" rx="200" ry="10" fill="#7a7068" opacity="0.02">
        <animate attributeName="cx" values="400;380;400" dur="25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.02;0.035;0.02" dur="25s" repeatCount="indefinite" />
      </ellipse>
      {/* Wispy remnant smoke near village road — clearing */}
      <path d="M500 245 Q520 240 540 245 Q560 242 580 248" fill="none" stroke="#8a8070" strokeWidth="2" opacity="0.02">
        <animate attributeName="d"
          values="M500 245 Q520 240 540 245 Q560 242 580 248;M500 245 Q520 242 540 243 Q560 240 580 246;M500 245 Q520 240 540 245 Q560 242 580 248"
          dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.02;0.04;0.02" dur="9s" repeatCount="indefinite" />
      </path>

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Warm evening color wash */}
      <rect width="800" height="400" fill="#d09040" opacity="0.03" />
      {/* Subtle blue-purple tint on the upper sky to deepen twilight */}
      <rect x="0" y="0" width="800" height="120" fill="#1a1040" opacity="0.04" />
      {/* Warm golden tint on the lower half — ground warmth */}
      <rect x="0" y="200" width="800" height="200" fill="#d09040" opacity="0.015" />
      {/* Vignette */}
      <rect width="800" height="400" fill="url(#ch3_vignette)" />
      {/* Dark gradient at bottom edge — grounding */}
      <rect x="0" y="378" width="800" height="22" fill="#1a1008" opacity="0.35" />
      {/* Top edge — subtle darkness suggesting approaching night */}
      <rect x="0" y="0" width="800" height="15" fill="#0a0510" opacity="0.15" />
    </svg>
  );
}
