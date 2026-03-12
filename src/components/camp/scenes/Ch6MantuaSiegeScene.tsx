import React from 'react';

/**
 * Ch.6 — Mantua Siege, marshland
 * Oppressive midday haze. Malarial marsh, fortress silhouette in heat haze,
 * stagnant water with oily scum, sickly yellow-green atmosphere, wilting trees,
 * mosquito clouds, sick soldiers, makeshift hospital tent.
 * Enhanced: dead bodies, gravediggers, stacked muskets, medicine wagon,
 * vultures/crows, flies on water, muddy paths, abandoned equipment,
 * heat distortion, dripping water, drying bandages.
 * Enhanced v2: burial detail with stretcher, stagnant canal with broken sluice,
 * ox carcass, ration distribution, latrine screen, additional fly swarms,
 * fortress cannon flash, crumbling wall section, sunset haze glow, rat.
 * Enhanced v3: more mosquito swarms, soldier vomiting behind tent, algae surface
 * texture on canal, broken medicine bottle, flies on ox carcass, sweat drops,
 * wilted/dead plants at water edge, makeshift stretcher with covered body,
 * cracked dry earth, lime bucket near burial, tattered regimental colors,
 * surgeon's blood-stained apron on line, empty medicine crates, soldier
 * writing letter by candlelight.
 * Mood: Suffocating, diseased.
 */
export function Ch6MantuaSiegeScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Sickly haze sky — oppressive yellow-grey */}
        <linearGradient id="ch6_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4530" />
          <stop offset="20%" stopColor="#525030" />
          <stop offset="40%" stopColor="#5a5535" />
          <stop offset="60%" stopColor="#6a6540" />
          <stop offset="80%" stopColor="#7a7548" />
          <stop offset="100%" stopColor="#8a8050" />
        </linearGradient>
        {/* Heat haze band */}
        <linearGradient id="ch6_haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8050" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#9a9060" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8a8050" stopOpacity="0.3" />
        </linearGradient>
        {/* Marsh water — stagnant */}
        <linearGradient id="ch6_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4530" />
          <stop offset="50%" stopColor="#354028" />
          <stop offset="100%" stopColor="#2a3520" />
        </linearGradient>
        {/* Marsh ground */}
        <linearGradient id="ch6_marsh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a22" />
          <stop offset="100%" stopColor="#2a2a18" />
        </linearGradient>
        {/* Fortress */}
        <linearGradient id="ch6_fort" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5540" />
          <stop offset="100%" stopColor="#4a4535" />
        </linearGradient>
        {/* Miasma radial */}
        <radialGradient id="ch6_miasma" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#6a6540" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6a6540" stopOpacity="0" />
        </radialGradient>
        {/* Larger miasma for drifting clouds */}
        <radialGradient id="ch6_miasma_lg" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#5a5830" stopOpacity="0.12" />
          <stop offset="40%" stopColor="#5a5830" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5a5830" stopOpacity="0" />
        </radialGradient>
        {/* Oily water shimmer */}
        <linearGradient id="ch6_oily" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a6838" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#7a7050" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#6a6040" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#5a6838" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7a7050" stopOpacity="0.15" />
        </linearGradient>
        {/* Hospital tent canvas */}
        <linearGradient id="ch6_tent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5540" />
          <stop offset="100%" stopColor="#4a4030" />
        </linearGradient>
        {/* Oppressive yellow-green atmospheric overlay */}
        <linearGradient id="ch6_atmos" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a6530" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#7a7040" stopOpacity="0.06" />
          <stop offset="70%" stopColor="#6a6530" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#5a5520" stopOpacity="0.15" />
        </linearGradient>
        {/* Radial vignette — dark edges */}
        <radialGradient id="ch6_vignette" cx="0.5" cy="0.5" r="0.65">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="60%" stopColor="transparent" />
          <stop offset="85%" stopColor="#1a1a10" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0a0a08" stopOpacity="0.5" />
        </radialGradient>
        {/* Algae texture pattern */}
        <pattern id="ch6_algae" x="0" y="0" width="12" height="8" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="#4a5a28" opacity="0.3" />
          <circle cx="9" cy="5" r="1" fill="#506030" opacity="0.25" />
          <circle cx="6" cy="1" r="0.8" fill="#4a5828" opacity="0.2" />
        </pattern>
        {/* Blanket/cloth cover for corpses */}
        <linearGradient id="ch6_blanket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3828" />
          <stop offset="100%" stopColor="#2a2818" />
        </linearGradient>
        {/* Mud path gradient */}
        <linearGradient id="ch6_mud" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#33301c" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#3a361e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#33301c" stopOpacity="0.25" />
        </linearGradient>
        {/* Secondary heat haze band */}
        <linearGradient id="ch6_haze2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8050" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#9a9060" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8a8050" stopOpacity="0.2" />
        </linearGradient>
        {/* Drip water color */}
        <radialGradient id="ch6_drip" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a6838" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4a5828" stopOpacity="0" />
        </radialGradient>
        {/* NEW: Sunset/haze glow — sickly yellow-orange radial on horizon */}
        <radialGradient id="ch6_sunset_glow" cx="0.65" cy="0.42" r="0.35">
          <stop offset="0%" stopColor="#b89040" stopOpacity="0.14" />
          <stop offset="35%" stopColor="#a07830" stopOpacity="0.09" />
          <stop offset="70%" stopColor="#8a6828" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#8a6828" stopOpacity="0" />
        </radialGradient>
        {/* NEW: Canal water — darker, more stagnant than pools */}
        <linearGradient id="ch6_canal_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e3a22" />
          <stop offset="50%" stopColor="#283520" />
          <stop offset="100%" stopColor="#22301a" />
        </linearGradient>
        {/* NEW: Cannon flash radial glow */}
        <radialGradient id="ch6_cannon_flash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e8a040" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#c07830" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a06020" stopOpacity="0" />
        </radialGradient>
        {/* NEW: Ox hide color */}
        <linearGradient id="ch6_ox_hide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3e28" />
          <stop offset="100%" stopColor="#3a3020" />
        </linearGradient>
        {/* NEW: Ration barrel */}
        <linearGradient id="ch6_barrel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4a30" />
          <stop offset="100%" stopColor="#4a3a25" />
        </linearGradient>
        {/* v3: Dense algae surface pattern for canal */}
        <pattern id="ch6_canal_algae" x="0" y="0" width="16" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r="2" fill="#3a4a20" opacity="0.35" />
          <circle cx="8" cy="6" r="2.5" fill="#405228" opacity="0.3" />
          <circle cx="14" cy="2" r="1.8" fill="#3a4a20" opacity="0.25" />
          <circle cx="5" cy="8" r="1.5" fill="#384820" opacity="0.3" />
          <circle cx="12" cy="8" r="2" fill="#405228" opacity="0.2" />
          <ellipse cx="10" cy="4" rx="3" ry="1" fill="#3a4a20" opacity="0.15" />
        </pattern>
        {/* v3: Candle glow radial for letter-writing soldier */}
        <radialGradient id="ch6_candle_glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c8a050" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#a08030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#806020" stopOpacity="0" />
        </radialGradient>
        {/* v3: Cracked earth pattern */}
        <pattern id="ch6_cracked_earth" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q5 8 10 10 Q15 12 20 10" fill="none" stroke="#4a4530" strokeWidth="0.4" opacity="0.3" />
          <path d="M10 0 Q8 5 10 10 Q12 15 10 20" fill="none" stroke="#4a4530" strokeWidth="0.3" opacity="0.25" />
          <path d="M3 3 Q7 6 5 10" fill="none" stroke="#4a4530" strokeWidth="0.3" opacity="0.2" />
          <path d="M15 5 Q13 8 16 12" fill="none" stroke="#4a4530" strokeWidth="0.3" opacity="0.2" />
        </pattern>
        {/* v3: Blood stain color for surgeon's apron */}
        <linearGradient id="ch6_blood_stain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3828" />
          <stop offset="100%" stopColor="#4a2a1a" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch6_sky)" />

      {/* NEW: Sunset/haze glow — sickly yellow-orange trapped heat on horizon */}
      <rect width="800" height="400" fill="url(#ch6_sunset_glow)" />

      {/* Sun — hazy, no clear disc, just diffuse glare */}
      <ellipse cx="500" cy="55" rx="100" ry="70" fill="#9a9055" opacity="0.15" />
      <ellipse cx="500" cy="55" rx="60" ry="45" fill="#aaa065" opacity="0.12" />
      <ellipse cx="500" cy="55" rx="30" ry="22" fill="#bbb075" opacity="0.1" />

      {/* ── Vultures / crows — circling silhouettes in the sickly sky ── */}
      {/* Vulture 1 — large, slow circle high up */}
      <g opacity="0.35">
        <path d="M0 0 Q-6 -3 -12 0 Q-8 -1 -6 -2 Q-4 -1 0 0 Q4 -1 6 -2 Q8 -1 12 0 Q6 -3 0 0"
          fill="#2a2518" transform="translate(320, 75)">
          <animateTransform attributeName="transform" type="translate"
            values="320,75; 340,68; 355,78; 335,85; 320,75"
            dur="18s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Vulture 2 — smaller, tighter circle */}
      <g opacity="0.3">
        <path d="M0 0 Q-5 -2 -10 0 Q-7 -1 -5 -1.5 Q-3 -1 0 0 Q3 -1 5 -1.5 Q7 -1 10 0 Q5 -2 0 0"
          fill="#2a2518" transform="translate(420, 90)">
          <animateTransform attributeName="transform" type="translate"
            values="420,90; 435,82; 445,92; 428,98; 420,90"
            dur="14s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Vulture 3 — distant, slow drift */}
      <g opacity="0.25">
        <path d="M0 0 Q-4 -2 -8 0 Q-5 -0.5 -4 -1.5 Q-2 -0.5 0 0 Q2 -0.5 4 -1.5 Q5 -0.5 8 0 Q4 -2 0 0"
          fill="#2a2518" transform="translate(250, 55)">
          <animateTransform attributeName="transform" type="translate"
            values="250,55; 270,50; 285,58; 260,62; 250,55"
            dur="22s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ── Fortress of Mantua — expanded silhouette with towers, gates, flags ── */}
      {/* Main wall body */}
      <path d="M200 150 L200 130 L210 130 L210 118 L215 112 L220 118 L220 130
               L260 130 L260 115 L265 108 L270 115 L270 130
               L320 130 L320 118 L323 112 L326 118 L326 130 L330 130 L330 115 L333 108 L336 115 L336 130
               L400 130 L400 118 L405 112 L410 118 L410 130
               L460 130 L460 115 L465 108 L470 115 L470 130
               L510 130 L510 118 L515 112 L520 118 L520 130
               L550 130 L550 125 L560 125 L560 150"
        fill="url(#ch6_fort)" opacity="0.4" />
      {/* Fortress walls — lower section */}
      <rect x="200" y="140" width="360" height="22" fill="url(#ch6_fort)" opacity="0.35" />
      {/* Thicker bastion on left */}
      <path d="M195 150 L190 138 L200 130 L210 138 L205 150" fill="url(#ch6_fort)" opacity="0.32" />
      {/* Thicker bastion on right */}
      <path d="M555 150 L550 138 L560 130 L570 138 L565 150" fill="url(#ch6_fort)" opacity="0.32" />

      {/* NEW: Crumbling wall section — visible damage from bombardment, right side */}
      {/* Jagged broken top where wall was hit */}
      <path d="M480 130 L482 126 L485 132 L488 124 L491 129 L494 122 L497 130 L500 127 L503 130"
        fill="#4a4535" opacity="0.38" />
      {/* Rubble pile at base of damaged section */}
      <ellipse cx="490" cy="155" rx="12" ry="3.5" fill="#5a5540" opacity="0.3" />
      <circle cx="485" cy="154" r="2" fill="#4a4530" opacity="0.25" />
      <circle cx="493" cy="156" r="1.5" fill="#5a5540" opacity="0.22" />
      <circle cx="498" cy="155" r="1.8" fill="#4a4530" opacity="0.2" />
      {/* Crack lines running down from damage */}
      <path d="M488 130 L487 136 L490 140 L488 145" fill="none" stroke="#3a3525" strokeWidth="0.5" opacity="0.3" />
      <path d="M496 128 L498 134 L496 138 L498 143" fill="none" stroke="#3a3525" strokeWidth="0.4" opacity="0.25" />

      {/* NEW: Fortress cannon flash — garrison still fires */}
      <g>
        <ellipse cx="333" cy="126" rx="5" ry="4" fill="url(#ch6_cannon_flash)">
          <animate attributeName="opacity" values="0;0;0;0.8;0.5;0;0;0;0;0;0;0;0;0;0;0" dur="12s" repeatCount="indefinite" />
          <animate attributeName="rx" values="3;3;3;6;4;3;3;3;3;3;3;3;3;3;3;3" dur="12s" repeatCount="indefinite" />
        </ellipse>
        {/* Tiny smoke puff after flash */}
        <ellipse cx="330" cy="122" rx="4" ry="3" fill="#7a7560" opacity="0">
          <animate attributeName="opacity" values="0;0;0;0;0.15;0.1;0.05;0;0;0;0;0;0;0;0;0" dur="12s" repeatCount="indefinite" />
          <animate attributeName="cy" values="122;122;122;122;118;115;112;110;122;122;122;122;122;122;122;122" dur="12s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Main gate — arched */}
      <path d="M350 162 Q370 145 390 162" fill="#3a3525" opacity="0.3" />
      {/* Portcullis lines */}
      <line x1="360" y1="162" x2="360" y2="150" stroke="#2a2518" strokeWidth="0.5" opacity="0.2" />
      <line x1="370" y1="162" x2="370" y2="147" stroke="#2a2518" strokeWidth="0.5" opacity="0.2" />
      <line x1="380" y1="162" x2="380" y2="150" stroke="#2a2518" strokeWidth="0.5" opacity="0.2" />
      {/* Secondary gate — smaller */}
      <path d="M270 162 Q280 155 290 162" fill="#3a3525" opacity="0.25" />
      {/* Flags on towers — limp in still air */}
      <line x1="215" y1="112" x2="215" y2="102" stroke="#5a5540" strokeWidth="0.6" opacity="0.35" />
      <path d="M215 102 Q219 103 220 106 Q217 105 215 106" fill="#6a3030" opacity="0.3" />
      <line x1="405" y1="112" x2="405" y2="100" stroke="#5a5540" strokeWidth="0.6" opacity="0.35" />
      <path d="M405 100 Q409 101 410 104 Q407 103 405 104" fill="#6a3030" opacity="0.3" />
      <line x1="515" y1="112" x2="515" y2="103" stroke="#5a5540" strokeWidth="0.6" opacity="0.35" />
      <path d="M515 103 Q519 104 520 107 Q517 106 515 107" fill="#6a3030" opacity="0.3" />

      {/* ── Heat shimmer animations — three wavy lines ── */}
      {/* Shimmer 1 — across fortress base */}
      <path d="M200 158 Q260 154 320 158 Q380 154 440 158 Q500 154 560 158"
        fill="none" stroke="#8a8050" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d"
          values="M200 158 Q260 154 320 158 Q380 154 440 158 Q500 154 560 158;
                  M200 158 Q260 162 320 158 Q380 162 440 158 Q500 162 560 158;
                  M200 158 Q260 154 320 158 Q380 154 440 158 Q500 154 560 158"
          dur="4s" repeatCount="indefinite" />
      </path>
      {/* Shimmer 2 — horizon band */}
      <path d="M0 172 Q100 168 200 172 Q300 168 400 172 Q500 168 600 172 Q700 168 800 172"
        fill="none" stroke="#8a8050" strokeWidth="0.4" opacity="0.12">
        <animate attributeName="d"
          values="M0 172 Q100 168 200 172 Q300 168 400 172 Q500 168 600 172 Q700 168 800 172;
                  M0 172 Q100 176 200 172 Q300 176 400 172 Q500 176 600 172 Q700 176 800 172;
                  M0 172 Q100 168 200 172 Q300 168 400 172 Q500 168 600 172 Q700 168 800 172"
          dur="5s" repeatCount="indefinite" />
      </path>
      {/* Shimmer 3 — lower midground */}
      <path d="M50 195 Q150 192 250 195 Q350 192 450 195 Q550 192 650 195 Q750 192 800 195"
        fill="none" stroke="#7a7545" strokeWidth="0.6" opacity="0.1">
        <animate attributeName="d"
          values="M50 195 Q150 192 250 195 Q350 192 450 195 Q550 192 650 195 Q750 192 800 195;
                  M50 195 Q150 198 250 195 Q350 198 450 195 Q550 198 650 195 Q750 198 800 195;
                  M50 195 Q150 192 250 195 Q350 192 450 195 Q550 192 650 195 Q750 192 800 195"
          dur="6s" repeatCount="indefinite" />
      </path>

      {/* Flat marshland horizon */}
      <path d="M0 170 Q100 166 200 168 Q300 165 400 168 Q500 165 600 168 Q700 166 800 170 L800 200 L0 200 Z"
        fill="url(#ch6_marsh)" opacity="0.6" />

      {/* ── Marsh ground ── */}
      <path d="M0 200 Q200 195 400 200 Q600 195 800 200 L800 400 L0 400 Z"
        fill="url(#ch6_marsh)" />

      {/* ── v3: Cracked dry earth patches between muddy areas ── */}
      {/* Patch 1 — between pools 1 and 3, dry ground */}
      <ellipse cx="280" cy="268" rx="25" ry="10" fill="#3e3a22" opacity="0.4" />
      <ellipse cx="280" cy="268" rx="25" ry="10" fill="url(#ch6_cracked_earth)" opacity="0.7" />
      {/* Individual crack lines for detail */}
      <path d="M265 265 Q270 268 268 273" fill="none" stroke="#4a4530" strokeWidth="0.5" opacity="0.3" />
      <path d="M278 262 L280 270 Q283 274 285 272" fill="none" stroke="#4a4530" strokeWidth="0.4" opacity="0.25" />
      <path d="M290 266 Q288 270 292 273" fill="none" stroke="#4a4530" strokeWidth="0.3" opacity="0.25" />
      {/* Patch 2 — right side, near pool 5 */}
      <ellipse cx="680" cy="275" rx="20" ry="8" fill="#3e3a22" opacity="0.35" />
      <ellipse cx="680" cy="275" rx="20" ry="8" fill="url(#ch6_cracked_earth)" opacity="0.6" />
      <path d="M670 273 Q675 276 672 280" fill="none" stroke="#4a4530" strokeWidth="0.4" opacity="0.25" />
      <path d="M685 270 L687 275 Q684 278 688 280" fill="none" stroke="#4a4530" strokeWidth="0.3" opacity="0.22" />
      {/* Patch 3 — foreground center */}
      <ellipse cx="450" cy="340" rx="18" ry="7" fill="#3e3a22" opacity="0.3" />
      <ellipse cx="450" cy="340" rx="18" ry="7" fill="url(#ch6_cracked_earth)" opacity="0.55" />
      <path d="M442 338 Q445 341 443 345" fill="none" stroke="#4a4530" strokeWidth="0.4" opacity="0.22" />
      <path d="M455 337 L457 342 Q454 344 458 346" fill="none" stroke="#4a4530" strokeWidth="0.3" opacity="0.2" />

      {/* ── Muddy footprints / worn paths between tent and pools ── */}
      {/* Main path — tent to pool 3 */}
      <path d="M140 335 Q180 330 220 322 Q260 315 300 308 Q340 300 370 292"
        fill="none" stroke="#33301c" strokeWidth="5" opacity="0.2" strokeLinecap="round" />
      <path d="M140 335 Q180 330 220 322 Q260 315 300 308 Q340 300 370 292"
        fill="none" stroke="#3a361e" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" strokeDasharray="4 6" />
      {/* Secondary path — tent to pool 1 */}
      <path d="M130 328 Q145 310 155 290 Q165 270 175 250"
        fill="none" stroke="#33301c" strokeWidth="4" opacity="0.18" strokeLinecap="round" />
      <path d="M130 328 Q145 310 155 290 Q165 270 175 250"
        fill="none" stroke="#3a361e" strokeWidth="2" opacity="0.12" strokeLinecap="round" strokeDasharray="3 5" />
      {/* Footprint impressions along the main path */}
      <ellipse cx="180" cy="328" rx="2" ry="1.2" fill="#2a2818" opacity="0.15" />
      <ellipse cx="195" cy="325" rx="1.8" ry="1" fill="#2a2818" opacity="0.12" />
      <ellipse cx="220" cy="320" rx="2" ry="1.2" fill="#2a2818" opacity="0.14" />
      <ellipse cx="250" cy="314" rx="1.8" ry="1" fill="#2a2818" opacity="0.12" />
      <ellipse cx="280" cy="308" rx="2" ry="1.2" fill="#2a2818" opacity="0.13" />
      <ellipse cx="310" cy="303" rx="1.8" ry="1" fill="#2a2818" opacity="0.11" />
      <ellipse cx="340" cy="298" rx="2" ry="1.2" fill="#2a2818" opacity="0.12" />

      {/* ── NEW: Stagnant canal with broken sluice gate ── */}
      {/* Canal channel — long water channel running left-to-right behind the pools */}
      <path d="M0 215 Q60 212 120 215 Q180 218 240 215 Q320 212 400 215 Q460 218 520 214"
        fill="none" stroke="#2e3a22" strokeWidth="10" opacity="0.5" strokeLinecap="round" />
      {/* Canal water fill */}
      <path d="M0 210 Q60 207 120 210 Q180 213 240 210 Q320 207 400 210 Q460 213 520 209 L520 220 Q460 223 400 220 Q320 217 240 220 Q180 223 120 220 Q60 217 0 220 Z"
        fill="url(#ch6_canal_water)" opacity="0.55" />
      {/* v3: Dense algae surface texture on canal */}
      <path d="M0 210 Q60 207 120 210 Q180 213 240 210 Q320 207 400 210 Q460 213 520 209 L520 220 Q460 223 400 220 Q320 217 240 220 Q180 223 120 220 Q60 217 0 220 Z"
        fill="url(#ch6_canal_algae)" opacity="0.6" />
      {/* Thick algae clumps floating on canal surface */}
      <ellipse cx="80" cy="215" rx="12" ry="3" fill="#3a4a20" opacity="0.3" />
      <ellipse cx="160" cy="213" rx="8" ry="2.5" fill="#405228" opacity="0.25" />
      <ellipse cx="250" cy="216" rx="10" ry="2" fill="#3a4a20" opacity="0.28" />
      <ellipse cx="350" cy="212" rx="14" ry="3" fill="#384820" opacity="0.22" />
      <ellipse cx="450" cy="215" rx="9" ry="2.5" fill="#405228" opacity="0.25" />
      {/* Scum line along canal edges */}
      <path d="M10 210 Q70 208 130 211 Q190 214 250 211 Q330 208 410 211 Q470 214 520 210"
        fill="none" stroke="#4a5a28" strokeWidth="0.8" opacity="0.25" />
      <path d="M10 220 Q70 218 130 220 Q190 222 250 220 Q330 218 410 220 Q470 222 520 220"
        fill="none" stroke="#4a5a28" strokeWidth="0.6" opacity="0.2" />
      {/* Oily film on canal surface */}
      <path d="M40 214 Q100 212 160 215 Q220 217 280 214 Q340 211 400 214"
        fill="none" stroke="#5a6838" strokeWidth="0.6" opacity="0.2" />
      <path d="M80 216 Q140 213 200 216 Q260 219 320 216"
        fill="none" stroke="#7a7050" strokeWidth="0.4" opacity="0.15" />
      {/* Broken sluice gate — wooden frame, one side collapsed */}
      {/* Left upright — still standing */}
      <line x1="395" y1="222" x2="395" y2="204" stroke="#4a3a25" strokeWidth="2" opacity="0.55" />
      {/* Right upright — broken, angled */}
      <line x1="410" y1="222" x2="414" y2="208" stroke="#4a3a25" strokeWidth="1.8" opacity="0.45" />
      {/* Cross beam — snapped, hanging */}
      <path d="M395 208 L402 207 L405 210" fill="none" stroke="#4a3a25" strokeWidth="1.5" opacity="0.45" />
      {/* Broken gate boards — half submerged */}
      <rect x="396" y="212" width="5" height="10" fill="#3a3020" opacity="0.35" transform="rotate(8, 398, 217)" />
      <rect x="403" y="214" width="4" height="8" fill="#3a3020" opacity="0.3" transform="rotate(-15, 405, 218)" />
      {/* Algae buildup on sluice */}
      <ellipse cx="400" cy="219" rx="10" ry="3" fill="#4a5a28" opacity="0.25" />

      {/* ── Stagnant water pools with algae and oily shimmer ── */}
      {/* Pool 1 — large, left */}
      <ellipse cx="180" cy="230" rx="90" ry="16" fill="url(#ch6_water)" opacity="0.7" />
      <ellipse cx="180" cy="230" rx="90" ry="16" fill="url(#ch6_algae)" opacity="0.5" />
      <ellipse cx="170" cy="228" rx="25" ry="4" fill="#5a6030" opacity="0.3" />
      <ellipse cx="200" cy="233" rx="18" ry="3" fill="#4a5525" opacity="0.25" />
      {/* Oily shimmer on pool 1 */}
      <ellipse cx="185" cy="229" rx="35" ry="6" fill="url(#ch6_oily)" opacity="0.6">
        <animate attributeName="rx" values="35;38;35" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Flies on pool 1 — static tiny dots */}
      <circle cx="155" cy="226" r="0.4" fill="#2a2518" opacity="0.35" />
      <circle cx="162" cy="232" r="0.3" fill="#2a2518" opacity="0.3" />
      <circle cx="195" cy="227" r="0.35" fill="#2a2518" opacity="0.32" />
      <circle cx="205" cy="234" r="0.3" fill="#2a2518" opacity="0.28" />
      <circle cx="215" cy="229" r="0.4" fill="#2a2518" opacity="0.3" />
      <circle cx="140" cy="231" r="0.35" fill="#2a2518" opacity="0.25" />

      {/* Pool 2 — large, right-center */}
      <ellipse cx="540" cy="240" rx="110" ry="20" fill="url(#ch6_water)" opacity="0.6" />
      <ellipse cx="540" cy="240" rx="110" ry="20" fill="url(#ch6_algae)" opacity="0.4" />
      <ellipse cx="555" cy="238" rx="30" ry="5" fill="#5a6030" opacity="0.25" />
      <ellipse cx="515" cy="243" rx="20" ry="3" fill="#4a5525" opacity="0.2" />
      {/* Oily shimmer on pool 2 */}
      <ellipse cx="550" cy="239" rx="40" ry="7" fill="url(#ch6_oily)" opacity="0.5">
        <animate attributeName="rx" values="40;44;40" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Flies on pool 2 — static tiny dots */}
      <circle cx="505" cy="237" r="0.35" fill="#2a2518" opacity="0.3" />
      <circle cx="520" cy="242" r="0.3" fill="#2a2518" opacity="0.28" />
      <circle cx="560" cy="236" r="0.4" fill="#2a2518" opacity="0.32" />
      <circle cx="575" cy="241" r="0.3" fill="#2a2518" opacity="0.26" />
      <circle cx="590" cy="238" r="0.35" fill="#2a2518" opacity="0.3" />

      {/* Pool 3 — mid foreground */}
      <ellipse cx="380" cy="285" rx="65" ry="12" fill="url(#ch6_water)" opacity="0.55" />
      <ellipse cx="380" cy="285" rx="65" ry="12" fill="url(#ch6_algae)" opacity="0.35" />
      <ellipse cx="370" cy="283" rx="15" ry="3" fill="#4a5525" opacity="0.2" />
      {/* Flies on pool 3 */}
      <circle cx="365" cy="282" r="0.3" fill="#2a2518" opacity="0.28" />
      <circle cx="390" cy="287" r="0.35" fill="#2a2518" opacity="0.3" />
      <circle cx="405" cy="283" r="0.3" fill="#2a2518" opacity="0.25" />

      {/* Pool 4 — small puddle, far left foreground */}
      <ellipse cx="60" cy="310" rx="35" ry="8" fill="url(#ch6_water)" opacity="0.5" />
      <ellipse cx="60" cy="310" rx="35" ry="8" fill="url(#ch6_algae)" opacity="0.3" />
      <ellipse cx="55" cy="309" rx="12" ry="3" fill="url(#ch6_oily)" opacity="0.4" />
      {/* Flies on pool 4 */}
      <circle cx="50" cy="308" r="0.3" fill="#2a2518" opacity="0.25" />
      <circle cx="70" cy="312" r="0.35" fill="#2a2518" opacity="0.28" />

      {/* Pool 5 — small puddle, far right */}
      <ellipse cx="720" cy="295" rx="40" ry="9" fill="url(#ch6_water)" opacity="0.45" />
      <ellipse cx="720" cy="295" rx="40" ry="9" fill="url(#ch6_algae)" opacity="0.3" />
      <ellipse cx="725" cy="294" rx="15" ry="4" fill="url(#ch6_oily)" opacity="0.35" />
      {/* Flies on pool 5 */}
      <circle cx="710" cy="293" r="0.3" fill="#2a2518" opacity="0.26" />
      <circle cx="735" cy="296" r="0.35" fill="#2a2518" opacity="0.28" />

      {/* ── v3: Wilted/dead plants near the water's edge ── */}
      {/* Wilted plant cluster 1 — drooping leaves at pool 1 edge */}
      <path d="M110 238 Q108 230 106 235" fill="none" stroke="#4a5028" strokeWidth="0.8" opacity="0.4" />
      <path d="M112 236 Q114 228 117 234" fill="none" stroke="#4a5028" strokeWidth="0.7" opacity="0.35" />
      <path d="M108 237 Q105 232 102 237" fill="none" stroke="#3a4020" strokeWidth="0.6" opacity="0.3" />
      {/* Brown dead leaf — curled */}
      <path d="M115 239 Q118 236 116 233 Q114 236 115 239" fill="#4a4028" opacity="0.3" />
      {/* Wilted plant cluster 2 — pool 2 edge, droopy stalks */}
      <path d="M465 248 Q463 240 460 245" fill="none" stroke="#4a5028" strokeWidth="0.8" opacity="0.35" />
      <path d="M468 246 Q470 238 473 244" fill="none" stroke="#4a5028" strokeWidth="0.7" opacity="0.3" />
      <path d="M462 249 Q458 243 456 248" fill="none" stroke="#3a4020" strokeWidth="0.6" opacity="0.28" />
      {/* Dead flower head — withered, drooping */}
      <path d="M470 238 Q472 236 471 234 Q469 236 470 238" fill="#5a4a28" opacity="0.3" />
      {/* Wilted plant cluster 3 — pool 3 edge */}
      <path d="M325 282 Q323 275 320 280" fill="none" stroke="#4a5028" strokeWidth="0.7" opacity="0.3" />
      <path d="M328 280 Q330 273 333 279" fill="none" stroke="#3a4020" strokeWidth="0.6" opacity="0.28" />
      <path d="M322 283 Q318 278 316 282" fill="none" stroke="#3a4020" strokeWidth="0.5" opacity="0.25" />
      {/* Dead brown reed — collapsed into water */}
      <path d="M332 282 Q336 280 340 283 Q342 285 338 286" fill="none" stroke="#4a4028" strokeWidth="0.6" opacity="0.25" />
      {/* Wilted plant cluster 4 — canal edge, left side */}
      <path d="M50 218 Q48 210 45 215" fill="none" stroke="#4a5028" strokeWidth="0.7" opacity="0.35" />
      <path d="M53 216 Q55 208 58 214" fill="none" stroke="#3a4020" strokeWidth="0.6" opacity="0.3" />
      <path d="M47 219 Q43 213 40 218" fill="none" stroke="#3a4020" strokeWidth="0.5" opacity="0.25" />

      {/* ── Wilting dead trees — 4 total ── */}
      {/* Tree 1 — bare, twisted, left */}
      <path d="M150 225 Q152 195 155 172" fill="none" stroke="#5a5540" strokeWidth="2.2" />
      <path d="M155 172 Q160 155 167 160" fill="none" stroke="#5a5540" strokeWidth="1.2" />
      <path d="M155 172 Q148 156 143 163" fill="none" stroke="#5a5540" strokeWidth="1" />
      <path d="M153 188 Q145 177 140 183" fill="none" stroke="#5a5540" strokeWidth="0.8" />
      <path d="M154 180 Q162 172 168 176" fill="none" stroke="#5a5540" strokeWidth="0.7" />

      {/* Tree 2 — further right, tall and leaning */}
      <path d="M620 218 Q622 188 626 168" fill="none" stroke="#5a5540" strokeWidth="1.8" opacity="0.7" />
      <path d="M626 168 Q632 155 637 162" fill="none" stroke="#5a5540" strokeWidth="1" opacity="0.7" />
      <path d="M626 168 Q618 158 614 165" fill="none" stroke="#5a5540" strokeWidth="0.9" opacity="0.7" />
      <path d="M624 183 Q616 174 612 179" fill="none" stroke="#5a5540" strokeWidth="0.7" opacity="0.7" />
      <path d="M625 176 Q630 168 635 173" fill="none" stroke="#5a5540" strokeWidth="0.6" opacity="0.7" />

      {/* Tree 3 — center-left, stunted, half-submerged */}
      <path d="M300 248 Q302 228 305 215" fill="none" stroke="#4a4530" strokeWidth="1.5" opacity="0.6" />
      <path d="M305 215 Q310 205 314 210" fill="none" stroke="#4a4530" strokeWidth="0.9" opacity="0.6" />
      <path d="M305 215 Q298 207 295 213" fill="none" stroke="#4a4530" strokeWidth="0.8" opacity="0.6" />
      <path d="M303 230 Q296 224 294 228" fill="none" stroke="#4a4530" strokeWidth="0.6" opacity="0.5" />

      {/* Tree 4 — far right foreground, broken trunk */}
      <path d="M730 300 Q732 275 734 258" fill="none" stroke="#5a5540" strokeWidth="2" opacity="0.65" />
      <path d="M734 258 L736 252" fill="none" stroke="#5a5540" strokeWidth="1.5" opacity="0.65" />
      <path d="M734 258 Q728 250 725 256" fill="none" stroke="#5a5540" strokeWidth="0.9" opacity="0.6" />
      <path d="M733 272 Q726 264 723 270" fill="none" stroke="#5a5540" strokeWidth="0.7" opacity="0.55" />
      <path d="M734 265 Q740 258 743 264" fill="none" stroke="#5a5540" strokeWidth="0.7" opacity="0.55" />

      {/* ── Drying bandages — line strung between stakes near tent ── */}
      {/* Left stake */}
      <line x1="48" y1="325" x2="48" y2="305" stroke="#4a4030" strokeWidth="1.2" opacity="0.5" />
      {/* Right stake */}
      <line x1="85" y1="328" x2="85" y2="308" stroke="#4a4030" strokeWidth="1.2" opacity="0.5" />
      {/* Sagging line between stakes */}
      <path d="M48 307 Q55 310 62 309 Q72 311 85 310"
        fill="none" stroke="#4a4030" strokeWidth="0.5" opacity="0.4" />
      {/* Bandage 1 — hanging cloth strip */}
      <path d="M55 309 L54 320 L56 320 L57 309" fill="#5a5545" opacity="0.45" />
      {/* Bandage 2 — wider, stained */}
      <path d="M63 310 L61 322 L66 322 L67 310" fill="#4a4535" opacity="0.4" />
      <path d="M62 315 L65 316" fill="none" stroke="#6a3530" strokeWidth="0.5" opacity="0.25" />
      {/* Bandage 3 — small rag */}
      <path d="M74 311 L73 318 L76 318 L76 311" fill="#5a5540" opacity="0.4" />
      {/* Bandage 4 — long, twisted */}
      <path d="M79 310 L78 324 L80 324 L82 310" fill="#4a4530" opacity="0.38" />
      <path d="M78 317 L80 318" fill="none" stroke="#6a3530" strokeWidth="0.4" opacity="0.2" />

      {/* ── v3: Surgeon's blood-stained apron on a clothesline ── */}
      {/* Uses the same bandage stakes area — a second line slightly higher */}
      {/* Line between stakes */}
      <path d="M48 303 Q55 305 68 304 Q78 306 85 305"
        fill="none" stroke="#4a4030" strokeWidth="0.4" opacity="0.35" />
      {/* Apron — rectangular cloth hanging from line, heavily stained */}
      <path d="M56 304 L54 318 Q58 320 64 318 L63 304" fill="#5a5545" opacity="0.5" />
      {/* Neck loop */}
      <path d="M58 304 Q60 301 62 304" fill="none" stroke="#4a4030" strokeWidth="0.4" opacity="0.35" />
      {/* Blood stains — dried brown-red patches */}
      <ellipse cx="58" cy="310" rx="3" ry="2.5" fill="url(#ch6_blood_stain)" opacity="0.45" />
      <ellipse cx="62" cy="314" rx="2" ry="2" fill="#4a2a1a" opacity="0.35" />
      <path d="M56 312 Q57 316 60 317" fill="none" stroke="#4a2a1a" strokeWidth="0.6" opacity="0.3" />
      {/* Drip stain running down apron */}
      <path d="M59 310 L58 316 L59 318" fill="none" stroke="#5a3020" strokeWidth="0.4" opacity="0.25" />

      {/* ── Reeds and marsh vegetation — multiple clusters ── */}
      {/* Cluster 1 — near pool 1 */}
      <line x1="238" y1="222" x2="240" y2="200" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="243" y1="224" x2="246" y2="204" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="248" y1="223" x2="250" y2="206" stroke="#4a5530" strokeWidth="0.7" opacity="0.35" />
      <line x1="234" y1="225" x2="233" y2="207" stroke="#5a6035" strokeWidth="0.6" opacity="0.3" />
      {/* Cluster 2 — near pool 2 */}
      <line x1="490" y1="232" x2="492" y2="210" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="496" y1="234" x2="499" y2="215" stroke="#5a6035" strokeWidth="0.8" opacity="0.4" />
      <line x1="502" y1="233" x2="504" y2="216" stroke="#4a5530" strokeWidth="0.7" opacity="0.35" />
      {/* Cluster 3 — far left */}
      <line x1="80" y1="302" x2="78" y2="285" stroke="#5a6035" strokeWidth="0.7" opacity="0.35" />
      <line x1="85" y1="304" x2="84" y2="288" stroke="#5a6035" strokeWidth="0.6" opacity="0.3" />
      <line x1="90" y1="303" x2="92" y2="287" stroke="#4a5530" strokeWidth="0.7" opacity="0.3" />
      {/* Cluster 4 — around pool 3 */}
      <line x1="430" y1="278" x2="432" y2="260" stroke="#5a6035" strokeWidth="0.8" opacity="0.35" />
      <line x1="435" y1="280" x2="437" y2="264" stroke="#5a6035" strokeWidth="0.7" opacity="0.3" />
      <line x1="328" y1="280" x2="326" y2="263" stroke="#4a5530" strokeWidth="0.7" opacity="0.3" />
      {/* Cluster 5 — right side, around pool 5 */}
      <line x1="695" y1="290" x2="694" y2="272" stroke="#5a6035" strokeWidth="0.7" opacity="0.35" />
      <line x1="700" y1="292" x2="702" y2="275" stroke="#5a6035" strokeWidth="0.6" opacity="0.3" />
      <line x1="748" y1="290" x2="750" y2="274" stroke="#4a5530" strokeWidth="0.7" opacity="0.3" />
      {/* Tall rushes — a few prominent ones */}
      <line x1="130" y1="228" x2="128" y2="195" stroke="#556030" strokeWidth="1" opacity="0.4" />
      <line x1="600" y1="235" x2="602" y2="205" stroke="#556030" strokeWidth="0.9" opacity="0.35" />

      {/* ── NEW: Ox carcass — dead draught animal near the road ── */}
      {/* Bloated body — lying on side */}
      <ellipse cx="590" cy="315" rx="18" ry="9" fill="url(#ch6_ox_hide)" opacity="0.6" />
      {/* Distended belly showing bloat */}
      <ellipse cx="593" cy="312" rx="14" ry="7" fill="#4a3e28" opacity="0.5" />
      {/* Head — extended on ground */}
      <ellipse cx="570" cy="318" rx="6" ry="4.5" fill="#3a3020" opacity="0.55" />
      {/* Horn stubs */}
      <path d="M567 315 Q565 312 563 313" fill="none" stroke="#5a5540" strokeWidth="0.8" opacity="0.35" />
      <path d="M569 314 Q568 311 566 312" fill="none" stroke="#5a5540" strokeWidth="0.7" opacity="0.3" />
      {/* Legs — stiff, extended */}
      <line x1="580" y1="322" x2="578" y2="330" stroke="#3a3020" strokeWidth="1.5" opacity="0.4" />
      <line x1="585" y1="323" x2="584" y2="332" stroke="#3a3020" strokeWidth="1.5" opacity="0.4" />
      <line x1="598" y1="322" x2="600" y2="330" stroke="#3a3020" strokeWidth="1.4" opacity="0.38" />
      <line x1="603" y1="321" x2="606" y2="329" stroke="#3a3020" strokeWidth="1.4" opacity="0.38" />
      {/* Ribs visible through hide — emaciated before death */}
      <path d="M583 310 Q586 308 589 310" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.25" />
      <path d="M585 312 Q588 310 591 312" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.22" />
      <path d="M587 314 Q590 312 593 314" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.2" />

      {/* ── v3: Flies buzzing around the ox carcass — animated tiny dots ── */}
      <g opacity="0.55">
        <circle cx="578" cy="314" r="0.5" fill="#2a2518" />
        <circle cx="582" cy="310" r="0.4" fill="#2a2518" />
        <circle cx="575" cy="316" r="0.35" fill="#2a2518" />
        <circle cx="585" cy="308" r="0.45" fill="#2a2518" />
        <circle cx="572" cy="312" r="0.4" fill="#2a2518" />
        <circle cx="580" cy="318" r="0.3" fill="#2a2518" />
        <circle cx="576" cy="320" r="0.4" fill="#2a2518" />
        <circle cx="583" cy="316" r="0.35" fill="#2a2518" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 2,-1; -1,2; 3,-2; -2,1; 1,-1; 0,0" dur="3s" repeatCount="indefinite" />
      </g>
      {/* Second fly cluster — closer to the head */}
      <g opacity="0.45">
        <circle cx="568" cy="316" r="0.4" fill="#2a2518" />
        <circle cx="571" cy="314" r="0.35" fill="#2a2518" />
        <circle cx="566" cy="318" r="0.3" fill="#2a2518" />
        <circle cx="573" cy="320" r="0.4" fill="#2a2518" />
        <circle cx="569" cy="312" r="0.35" fill="#2a2518" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -1,2; 2,-1; -2,1; 1,-2; 0,0" dur="3.8s" repeatCount="indefinite" />
      </g>

      {/* ── Makeshift hospital tent / shelter ── */}
      {/* Tent — A-frame canvas with poles */}
      <path d="M90 330 L120 295 L150 330" fill="url(#ch6_tent)" opacity="0.7" />
      <path d="M88 330 L120 293 L152 330" fill="none" stroke="#3a3525" strokeWidth="0.8" opacity="0.5" />
      {/* Ridge pole */}
      <line x1="120" y1="293" x2="120" y2="332" stroke="#4a4030" strokeWidth="1" opacity="0.4" />
      {/* Tent side drape */}
      <path d="M150 330 L165 328 L165 332 L150 332" fill="#4a4030" opacity="0.5" />
      <path d="M90 330 L75 328 L75 332 L90 332" fill="#4a4030" opacity="0.5" />
      {/* Stained canvas texture */}
      <path d="M100 320 Q110 316 120 318" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.3" />
      <path d="M120 310 Q130 307 140 312" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.3" />
      {/* Tent opening — dark interior */}
      <path d="M110 330 L120 315 L130 330" fill="#1a1810" opacity="0.6" />

      {/* ── v3: Soldier vomiting behind the tent — silhouette at tasteful distance ── */}
      {/* Positioned behind the tent, partially obscured, bent over */}
      <g opacity="0.45">
        {/* Torso — hunched forward */}
        <path d="M78 328 Q74 320 76 314 Q78 310 80 314 L82 322 Q80 326 78 328"
          fill="#2a2818" />
        {/* Head — hanging forward, face down */}
        <circle cx="74" cy="312" r="3" fill="#2a2818" />
        {/* Arms braced on knees */}
        <path d="M76 318 Q72 316 70 320" fill="none" stroke="#2a2818" strokeWidth="1" />
        <path d="M80 318 Q84 316 85 320" fill="none" stroke="#2a2818" strokeWidth="1" />
        {/* Legs — slightly bent */}
        <line x1="77" y1="328" x2="75" y2="338" stroke="#2a2818" strokeWidth="1.2" />
        <line x1="81" y1="328" x2="83" y2="337" stroke="#2a2818" strokeWidth="1.2" />
        {/* Small puddle on ground in front — implied */}
        <ellipse cx="70" cy="320" rx="3" ry="1.5" fill="#4a4530" opacity="0.3" />
      </g>

      {/* NEW: Rat silhouette near hospital tent — camp vermin */}
      <g opacity="0.5">
        {/* Body */}
        <ellipse cx="162" cy="332" rx="3" ry="1.8" fill="#2a2518" />
        {/* Head — pointed snout */}
        <path d="M165 332 Q167 331 168.5 330.5" fill="#2a2518" stroke="#2a2518" strokeWidth="0.5" />
        {/* Ear */}
        <circle cx="165.5" cy="330.5" r="0.8" fill="#3a3525" />
        {/* Tail — long, thin, curving */}
        <path d="M159 332 Q156 330 153 331 Q150 333 148 331" fill="none" stroke="#2a2518" strokeWidth="0.5" />
        {/* Eye */}
        <circle cx="167" cy="331" r="0.3" fill="#4a4535" />
      </g>

      {/* ── Dripping water from tent edge — animated drip circles ── */}
      {/* Drip 1 — left edge of tent */}
      <circle cx="92" cy="330" r="1" fill="url(#ch6_drip)" opacity="0">
        <animate attributeName="r" values="0.5;2.5;0.5" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      {/* Drip 2 — right edge of tent */}
      <circle cx="148" cy="330" r="1" fill="url(#ch6_drip)" opacity="0">
        <animate attributeName="r" values="0.5;2;0.5" dur="4.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0;0.45" dur="4.2s" repeatCount="indefinite" />
      </circle>
      {/* Drip 3 — near ridge pole */}
      <circle cx="120" cy="332" r="1" fill="url(#ch6_drip)" opacity="0">
        <animate attributeName="r" values="0.3;2;0.3" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* ── Medicine wagon / wheelbarrow near the tent ── */}
      {/* Wheelbarrow body — tilted box shape */}
      <path d="M165 340 L175 335 L195 335 L200 340 L195 346 L175 346 Z"
        fill="#4a4030" opacity="0.6" stroke="#3a3020" strokeWidth="0.5" />
      {/* Wheel */}
      <circle cx="198" cy="346" r="3.5" fill="none" stroke="#3a3020" strokeWidth="1" opacity="0.5" />
      <circle cx="198" cy="346" r="0.8" fill="#3a3020" opacity="0.5" />
      {/* Handles */}
      <line x1="165" y1="340" x2="157" y2="338" stroke="#4a4030" strokeWidth="1" opacity="0.5" />
      <line x1="165" y1="343" x2="157" y2="342" stroke="#4a4030" strokeWidth="1" opacity="0.5" />
      {/* Supply bundles in wagon — bandage rolls and bottles */}
      <rect x="178" y="336" width="5" height="3" rx="1" fill="#5a5540" opacity="0.5" />
      <rect x="185" y="337" width="4" height="2.5" rx="1" fill="#5a5545" opacity="0.45" />
      <circle cx="175" cy="338" r="1.5" fill="#4a5530" opacity="0.4" />
      {/* Small bottle shape */}
      <rect x="190" y="336" width="2" height="4" rx="0.5" fill="#3a4530" opacity="0.4" />
      <rect x="190" y="335" width="2" height="1" rx="0.3" fill="#3a4530" opacity="0.35" />

      {/* ── v3: Broken medicine bottle on the ground — near the wheelbarrow ── */}
      {/* Intact bottom half of bottle */}
      <rect x="202" y="348" width="2.5" height="3" rx="0.5" fill="#3a5030" opacity="0.4" />
      {/* Broken jagged top edge */}
      <path d="M202 348 L202.3 346.5 L203 348 L203.5 346 L204 347.5 L204.5 348" fill="none" stroke="#3a5030" strokeWidth="0.4" opacity="0.35" />
      {/* Spilled liquid — dark stain spreading from bottle */}
      <ellipse cx="206" cy="351" rx="4" ry="1.5" fill="#2a3520" opacity="0.25" />
      {/* Glass shard nearby */}
      <path d="M208 349 L209 347 L210 349.5" fill="none" stroke="#4a5a38" strokeWidth="0.3" opacity="0.3" />
      {/* Second shard */}
      <path d="M200 350 L199 348 L201 349" fill="none" stroke="#4a5a38" strokeWidth="0.3" opacity="0.25" />

      {/* ── v3: Empty medicine crates stacked — near the hospital area ── */}
      {/* Bottom crate — larger */}
      <rect x="168" y="348" width="14" height="8" rx="0.5" fill="#4a4030" opacity="0.5" stroke="#3a3020" strokeWidth="0.5" />
      {/* Slat lines on bottom crate */}
      <line x1="172" y1="348" x2="172" y2="356" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
      <line x1="178" y1="348" x2="178" y2="356" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
      {/* Lid slightly ajar */}
      <path d="M167 348 L183 348 L184 346 L168 346 Z" fill="#4a4030" opacity="0.45" />
      {/* Top crate — smaller, rotated slightly */}
      <rect x="170" y="340" width="10" height="7" rx="0.5" fill="#4a3a28" opacity="0.45" stroke="#3a3020" strokeWidth="0.4" transform="rotate(-5, 175, 343)" />
      {/* Slat line on top crate */}
      <line x1="175" y1="340" x2="175" y2="347" stroke="#3a3020" strokeWidth="0.3" opacity="0.25" transform="rotate(-5, 175, 343)" />
      {/* Stenciled text — faded, illegible */}
      <rect x="171" y="342" width="6" height="1.5" rx="0.3" fill="#3a3020" opacity="0.15" transform="rotate(-5, 174, 343)" />
      {/* Third crate — on its side, empty, open end facing viewer */}
      <rect x="184" y="350" width="10" height="7" rx="0.5" fill="#4a3a28" opacity="0.4" stroke="#3a3020" strokeWidth="0.4" />
      {/* Open end — dark interior */}
      <rect x="192" y="351" width="2" height="5" fill="#1a1810" opacity="0.3" />

      {/* ── NEW: Makeshift latrine screen — tattered canvas between stakes ── */}
      {/* Left stake */}
      <line x1="760" y1="345" x2="760" y2="318" stroke="#4a3a25" strokeWidth="1.5" opacity="0.5" />
      {/* Right stake */}
      <line x1="785" y1="348" x2="785" y2="320" stroke="#4a3a25" strokeWidth="1.5" opacity="0.5" />
      {/* Sagging top line */}
      <path d="M760 320 Q768 323 773 322 Q779 324 785 322"
        fill="none" stroke="#4a3a25" strokeWidth="0.6" opacity="0.4" />
      {/* Canvas — stained, moth-eaten, hanging unevenly */}
      <path d="M760 320 L762 342 Q768 344 773 341 Q779 343 783 340 L785 322 Q779 324 773 322 Q768 323 760 320 Z"
        fill="#4a4030" opacity="0.45" />
      {/* Stain marks */}
      <ellipse cx="770" cy="332" rx="3" ry="4" fill="#3a3520" opacity="0.25" />
      <ellipse cx="778" cy="336" rx="2" ry="3" fill="#3a3520" opacity="0.2" />
      {/* Holes in canvas — moth-eaten */}
      <ellipse cx="767" cy="328" rx="1" ry="1.5" fill="url(#ch6_marsh)" opacity="0.4" />
      <ellipse cx="780" cy="333" rx="0.8" ry="1" fill="url(#ch6_marsh)" opacity="0.35" />
      {/* Canvas bottom edge — ragged */}
      <path d="M762 342 Q764 344 766 341 Q769 345 772 342 Q775 344 778 341 Q781 343 783 340"
        fill="none" stroke="#3a3020" strokeWidth="0.5" opacity="0.35" />

      {/* ── v3: Tattered regimental colors hanging limply — no wind ── */}
      {/* Flagpole — near the ration area, leaning against a post */}
      <line x1="630" y1="352" x2="630" y2="308" stroke="#4a3a25" strokeWidth="1.5" opacity="0.5" />
      {/* Cross-piece at top */}
      <line x1="628" y1="310" x2="632" y2="310" stroke="#4a3a25" strokeWidth="0.8" opacity="0.4" />
      {/* Flag — hanging straight down, no wind, tattered edges */}
      <path d="M630 310 L630 328 L641 328 L641 310 Z" fill="#2a3040" opacity="0.35" />
      {/* Tricolor stripe — faded blue, white, red vertical bands */}
      <rect x="630" y="310" width="3.5" height="18" fill="#2a3548" opacity="0.3" />
      <rect x="633.5" y="310" width="3.5" height="18" fill="#5a5848" opacity="0.25" />
      <rect x="637" y="310" width="4" height="18" fill="#5a2828" opacity="0.3" />
      {/* Tattered/torn bottom edge */}
      <path d="M630 328 Q632 330 634 327 Q636 331 638 328 Q640 330 641 328"
        fill="none" stroke="#2a2818" strokeWidth="0.4" opacity="0.3" />
      {/* Hole in the flag — battle damage */}
      <ellipse cx="635" cy="318" rx="1.5" ry="2" fill="url(#ch6_marsh)" opacity="0.3" />
      {/* Fringe — dangling threads at bottom */}
      <line x1="631" y1="328" x2="631" y2="331" stroke="#4a4530" strokeWidth="0.3" opacity="0.2" />
      <line x1="634" y1="328" x2="634" y2="330" stroke="#4a4530" strokeWidth="0.3" opacity="0.2" />
      <line x1="638" y1="328" x2="638" y2="331" stroke="#4a4530" strokeWidth="0.3" opacity="0.2" />

      {/* ── Dead bodies — cloth-covered corpses near tent and pools ── */}
      {/* Corpse 1 — near tent, fully covered with stained blanket */}
      <path d="M165 356 Q175 351 192 353 Q202 356 200 360 Q190 363 172 362 Q164 360 165 356 Z"
        fill="url(#ch6_blanket)" opacity="0.65" />
      {/* Blanket folds */}
      <path d="M172 354 Q180 352 188 354" fill="none" stroke="#2a2818" strokeWidth="0.4" opacity="0.3" />
      {/* Head bump under cloth */}
      <ellipse cx="168" cy="356" rx="3.5" ry="3" fill="url(#ch6_blanket)" opacity="0.7" />

      {/* Corpse 2 — near pool 1, half in the water, blanket partially covering */}
      <path d="M220 244 Q230 240 248 242 Q255 245 250 248 Q238 251 224 249 Q218 247 220 244 Z"
        fill="url(#ch6_blanket)" opacity="0.55" />
      {/* Exposed arm trailing into water */}
      <path d="M250 244 Q256 246 260 244" fill="none" stroke="#4a4535" strokeWidth="1" opacity="0.35" />

      {/* Corpse 3 — near pool 3, on the muddy path edge */}
      <path d="M340 275 Q348 271 360 273 Q366 276 362 279 Q352 281 342 280 Q337 278 340 275 Z"
        fill="url(#ch6_blanket)" opacity="0.5" />
      {/* Head visible — face down */}
      <circle cx="338" cy="276" r="2.5" fill="#2a2818" opacity="0.45" />

      {/* ── v3: Makeshift stretcher with a body covered by a blanket ── */}
      {/* Stretcher on ground — two poles with canvas between */}
      <line x1="420" y1="358" x2="460" y2="356" stroke="#4a3a25" strokeWidth="1.5" opacity="0.5" />
      <line x1="420" y1="364" x2="460" y2="362" stroke="#4a3a25" strokeWidth="1.5" opacity="0.5" />
      {/* Canvas between poles */}
      <path d="M422 358 L422 364 Q430 366 440 365 Q450 364 458 362 L458 356 Q450 358 440 359 Q430 360 422 358 Z"
        fill="#3a3828" opacity="0.45" />
      {/* Body shape under blanket — lumpy, still */}
      <path d="M425 358 Q430 354 440 355 Q450 354 455 357 Q452 360 440 361 Q430 362 425 360 Z"
        fill="url(#ch6_blanket)" opacity="0.6" />
      {/* Head bump at one end */}
      <ellipse cx="425" cy="359" rx="3" ry="2.5" fill="url(#ch6_blanket)" opacity="0.65" />
      {/* Feet poking out of blanket at other end */}
      <path d="M456 357 L458 355 L460 357" fill="#3a3525" opacity="0.4" />
      <path d="M456 359 L458 357.5 L460 359" fill="#3a3525" opacity="0.35" />
      {/* Blanket fold lines */}
      <path d="M432 355 Q438 354 445 356" fill="none" stroke="#2a2818" strokeWidth="0.3" opacity="0.25" />

      {/* ── Gravediggers — pair of soldiers with shovels near a mound ── */}
      {/* Grave mound — fresh earth heap */}
      <ellipse cx="275" cy="345" rx="22" ry="6" fill="#3a3520" opacity="0.6" />
      <ellipse cx="275" cy="343" rx="18" ry="4" fill="#3e381e" opacity="0.5" />
      {/* Rough cross — simple sticks */}
      <line x1="260" y1="345" x2="260" y2="332" stroke="#4a4030" strokeWidth="1.2" opacity="0.45" />
      <line x1="255" y1="337" x2="265" y2="337" stroke="#4a4030" strokeWidth="1" opacity="0.4" />
      {/* Second cross — further along */}
      <line x1="290" y1="346" x2="290" y2="335" stroke="#4a4030" strokeWidth="1" opacity="0.4" />
      <line x1="286" y1="339" x2="294" y2="339" stroke="#4a4030" strokeWidth="0.8" opacity="0.35" />

      {/* ── v3: Bucket of lime near the burial area — for sanitation ── */}
      {/* Bucket — simple wooden pail shape */}
      <path d="M302 350 L300 342 L310 342 L308 350 Z" fill="#4a4030" opacity="0.5" />
      {/* Bucket rim */}
      <ellipse cx="305" cy="342" rx="5" ry="1.8" fill="#4a4030" opacity="0.45" />
      {/* Lime contents — white/pale powder visible at top */}
      <ellipse cx="305" cy="342" rx="4" ry="1.3" fill="#8a8878" opacity="0.4" />
      {/* Lime dust scattered on ground around bucket */}
      <ellipse cx="300" cy="352" rx="3" ry="1" fill="#7a7868" opacity="0.15" />
      <ellipse cx="310" cy="351" rx="2.5" ry="0.8" fill="#7a7868" opacity="0.12" />
      {/* Lime powder dusted on nearest grave */}
      <ellipse cx="280" cy="345" rx="6" ry="2" fill="#8a8878" opacity="0.1" />
      {/* Handle — rope loop */}
      <path d="M302 342 Q305 339 308 342" fill="none" stroke="#4a3a25" strokeWidth="0.6" opacity="0.35" />

      {/* Gravedigger 1 — standing, bent over with shovel */}
      <path d="M250 340 Q248 330 250 322 Q252 318 254 322 L256 340 Q254 343 252 343 Z"
        fill="#2a2818" opacity="0.6" />
      <circle cx="252" cy="316" r="3.5" fill="#2a2818" opacity="0.6" />
      {/* Shovel — long handle, blade at ground */}
      <line x1="245" y1="318" x2="240" y2="348" stroke="#4a4030" strokeWidth="1" opacity="0.5" />
      <path d="M238 346 L237 352 L243 352 L242 346" fill="#5a5540" opacity="0.45" />
      {/* Gravedigger 2 — in the trench, only upper body visible */}
      <path d="M296 342 Q294 336 296 330 Q298 327 300 330 L302 342 Q300 344 298 344 Z"
        fill="#2a2818" opacity="0.55" />
      <circle cx="298" cy="326" r="3" fill="#2a2818" opacity="0.55" />
      {/* Shovel leaning nearby */}
      <line x1="305" y1="326" x2="310" y2="350" stroke="#4a4030" strokeWidth="0.8" opacity="0.45" />
      <path d="M308 348 L308 354 L313 354 L312 348" fill="#5a5540" opacity="0.4" />

      {/* ── NEW: Burial detail — 2 soldiers carrying a body on a stretcher toward the mound ── */}
      {/* Stretcher poles */}
      <line x1="210" y1="355" x2="245" y2="348" stroke="#4a3a25" strokeWidth="1.2" opacity="0.5" />
      <line x1="210" y1="360" x2="245" y2="353" stroke="#4a3a25" strokeWidth="1.2" opacity="0.5" />
      {/* Canvas sling between poles — sagging under weight */}
      <path d="M215 355 Q220 358 225 360 Q230 362 235 360 Q240 358 240 353"
        fill="#3a3828" opacity="0.5" />
      <path d="M215 360 Q220 363 225 365 Q230 367 235 365 Q240 363 240 358"
        fill="none" stroke="#2a2818" strokeWidth="0.4" opacity="0.3" />
      {/* Body on stretcher — blanket-wrapped lump */}
      <path d="M218 355 Q225 352 235 354 Q240 356 236 358 Q226 360 220 358 Z"
        fill="url(#ch6_blanket)" opacity="0.55" />
      {/* Feet protruding from blanket end */}
      <path d="M238 354 L240 353 L241 355" fill="#3a3525" opacity="0.4" />
      {/* Bearer 1 — front, walking toward mound */}
      <path d="M244 346 Q242 338 244 330 Q246 326 248 330 L250 346 Q248 349 246 349 Z"
        fill="#2a2818" opacity="0.55" />
      <circle cx="246" cy="325" r="3.2" fill="#2a2818" opacity="0.55" />
      {/* Bearer 1 legs — mid-stride */}
      <line x1="245" y1="346" x2="243" y2="356" stroke="#2a2818" strokeWidth="1" opacity="0.4" />
      <line x1="249" y1="346" x2="251" y2="355" stroke="#2a2818" strokeWidth="1" opacity="0.4" />
      {/* Bearer 2 — rear */}
      <path d="M208 358 Q206 350 208 342 Q210 338 212 342 L214 358 Q212 361 210 361 Z"
        fill="#2a2818" opacity="0.55" />
      <circle cx="210" cy="336" r="3.2" fill="#2a2818" opacity="0.55" />
      {/* Bearer 2 legs */}
      <line x1="209" y1="358" x2="207" y2="368" stroke="#2a2818" strokeWidth="1" opacity="0.4" />
      <line x1="213" y1="358" x2="215" y2="367" stroke="#2a2818" strokeWidth="1" opacity="0.4" />

      {/* ── NEW: Ration distribution — soldier with barrel ladling soup ── */}
      {/* Barrel — upright, small cask */}
      <ellipse cx="650" cy="340" rx="6" ry="3" fill="url(#ch6_barrel)" opacity="0.6" />
      <rect x="644" y="328" width="12" height="12" rx="1" fill="url(#ch6_barrel)" opacity="0.55" />
      <ellipse cx="650" cy="328" rx="6" ry="3" fill="#5a4a30" opacity="0.5" />
      {/* Barrel hoops */}
      <line x1="644" y1="332" x2="656" y2="332" stroke="#3a3020" strokeWidth="0.5" opacity="0.35" />
      <line x1="644" y1="336" x2="656" y2="336" stroke="#3a3020" strokeWidth="0.5" opacity="0.35" />
      {/* Ladle — extending from barrel */}
      <line x1="650" y1="326" x2="658" y2="320" stroke="#4a4030" strokeWidth="0.8" opacity="0.45" />
      <path d="M656 320 Q660 319 661 322 Q660 324 657 323" fill="#4a4030" opacity="0.4" />
      {/* Ration soldier — standing behind barrel, ladling */}
      <path d="M640 338 Q638 328 640 318 Q642 314 644 318 L646 338 Q644 341 642 341 Z"
        fill="#2a2818" opacity="0.6" />
      <circle cx="642" cy="312" r="3.5" fill="#2a2818" opacity="0.6" />
      {/* Arm extended holding ladle */}
      <path d="M644 320 Q648 318 652 316 Q656 318 658 320" fill="none" stroke="#2a2818" strokeWidth="1" opacity="0.45" />
      {/* Waiting soldier 1 — hunched, holding tin cup */}
      <path d="M662 342 Q660 334 662 328 Q664 325 666 328 L668 342 Q666 344 664 344 Z"
        fill="#2a2818" opacity="0.55" />
      <circle cx="664" cy="323" r="3" fill="#2a2818" opacity="0.55" />
      {/* Tin cup extended */}
      <path d="M666 330 Q668 329 670 330 L670 333 L666 333 Z" fill="#5a5540" opacity="0.35" />

      {/* ── v3: Sweat drops on waiting soldier's brow ── */}
      {/* Small beads of sweat — catching the sickly light */}
      <circle cx="663" cy="321" r="0.5" fill="#7a7858" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="665" cy="320.5" r="0.4" fill="#7a7858" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="664.5" cy="322" r="0.35" fill="#7a7858" opacity="0.3" />
      {/* Sweat drip running down temple */}
      <path d="M662.5 321 Q662 322.5 662.5 324" fill="none" stroke="#7a7858" strokeWidth="0.3" opacity="0.25" />

      {/* Waiting soldier 2 — sitting on ground nearby */}
      <path d="M672 348 Q670 342 672 337 Q674 334 676 337 Q678 342 676 348 Q674 350 672 348 Z"
        fill="#2a2818" opacity="0.5" />
      <circle cx="674" cy="332" r="2.8" fill="#2a2818" opacity="0.5" />

      {/* ── v3: Soldier writing a letter by candlelight — final letter home ── */}
      {/* Positioned far right foreground, sitting against a crate */}
      <g opacity="0.6">
        {/* Sitting body — legs extended */}
        <path d="M740 362 Q738 354 740 346 Q742 342 744 346 L746 362 Q744 365 742 365 Z"
          fill="#2a2818" />
        <circle cx="742" cy="340" r="3.5" fill="#2a2818" />
        {/* Head bowed slightly toward paper */}
        {/* Arm holding quill — extended to lap */}
        <path d="M744 348 Q748 350 750 352" fill="none" stroke="#2a2818" strokeWidth="0.8" />
        {/* Other arm steadying paper */}
        <path d="M740 348 Q736 350 735 354" fill="none" stroke="#2a2818" strokeWidth="0.8" />
        {/* Legs — extended forward */}
        <line x1="741" y1="362" x2="738" y2="374" stroke="#2a2818" strokeWidth="1.2" />
        <line x1="745" y1="362" x2="748" y2="373" stroke="#2a2818" strokeWidth="1.2" />
        {/* Paper on lap — small light rectangle */}
        <rect x="736" y="354" width="8" height="6" rx="0.3" fill="#6a6850" opacity="0.4" />
        {/* Quill pen — thin diagonal line */}
        <line x1="750" y1="352" x2="753" y2="346" stroke="#4a4530" strokeWidth="0.4" opacity="0.4" />
        {/* Small candle on a tin beside him */}
        <rect x="752" y="356" width="2" height="4" rx="0.3" fill="#6a6550" opacity="0.45" />
        {/* Candle flame — flickering */}
        <ellipse cx="753" cy="354" rx="1" ry="2" fill="#c8a040" opacity="0.6">
          <animate attributeName="ry" values="2;2.5;1.8;2.3;2" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.5;0.65;0.45;0.6" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Candle glow on ground and soldier */}
        <ellipse cx="748" cy="358" rx="12" ry="8" fill="url(#ch6_candle_glow)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.35;0.5;0.4;0.5" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Tin plate / saucer holding candle */}
        <ellipse cx="753" cy="360" rx="3" ry="1" fill="#4a4530" opacity="0.35" />
      </g>

      {/* ── Sick soldiers — 8 figures in various states ── */}
      {/* Soldier 1 — lying flat on ground, feverish */}
      <path d="M330 315 Q342 310 362 312 Q372 315 362 318 Q342 320 330 318 Z"
        fill="#2a2818" opacity="0.7" />
      <circle cx="328" cy="314" r="3.5" fill="#2a2818" opacity="0.65" />

      {/* Soldier 2 — sitting hunched, head in hands */}
      <path d="M420 305 Q418 294 420 286 Q422 282 424 286 Q426 294 424 305 Q422 308 420 305 Z"
        fill="#2a2818" opacity="0.7" />
      <circle cx="422" cy="278" r="4" fill="#2a2818" opacity="0.7" />
      {/* Arms up to head */}
      <path d="M419 284 Q416 280 418 278" fill="none" stroke="#2a2818" strokeWidth="1" opacity="0.5" />
      <path d="M425 284 Q428 280 426 278" fill="none" stroke="#2a2818" strokeWidth="1" opacity="0.5" />

      {/* ── v3: Sweat drops on Soldier 2's brow ── */}
      <circle cx="420" cy="276" r="0.45" fill="#7a7858" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="424" cy="275.5" r="0.4" fill="#7a7858" opacity="0.3" />
      <circle cx="422" cy="277" r="0.35" fill="#7a7858" opacity="0.25" />

      {/* Soldier 3 — standing, leaning on musket for support */}
      <path d="M480 275 Q478 262 480 250 Q482 244 484 250 L486 275 Q485 285 484 295 L480 295 Z"
        fill="#2a2818" opacity="0.65" />
      <circle cx="482" cy="243" r="4.5" fill="#2a2818" opacity="0.65" />
      <line x1="488" y1="243" x2="490" y2="295" stroke="#2a2818" strokeWidth="1" opacity="0.5" />

      {/* ── Stacked muskets — tripod of 3 near the standing soldier ── */}
      {/* Three muskets leaning together, muzzles meeting at top */}
      <line x1="500" y1="260" x2="505" y2="295" stroke="#2a2818" strokeWidth="1.2" opacity="0.5" />
      <line x1="500" y1="260" x2="495" y2="296" stroke="#2a2818" strokeWidth="1.2" opacity="0.5" />
      <line x1="500" y1="260" x2="510" y2="294" stroke="#2a2818" strokeWidth="1.2" opacity="0.5" />
      {/* Bayonet tips at junction */}
      <line x1="500" y1="260" x2="500" y2="255" stroke="#5a5540" strokeWidth="0.6" opacity="0.4" />
      <line x1="500" y1="260" x2="498" y2="256" stroke="#5a5540" strokeWidth="0.6" opacity="0.35" />
      <line x1="500" y1="260" x2="502" y2="256" stroke="#5a5540" strokeWidth="0.6" opacity="0.35" />
      {/* Sling/strap hanging */}
      <path d="M502 272 Q506 275 504 280" fill="none" stroke="#3a3525" strokeWidth="0.5" opacity="0.3" />

      {/* Soldier 4 — on all fours, vomiting (near pool) */}
      <path d="M370 330 Q376 322 385 324 Q390 326 388 330"
        fill="#2a2818" opacity="0.6" />
      <circle cx="368" cy="327" r="3" fill="#2a2818" opacity="0.6" />
      {/* Arms down */}
      <line x1="374" y1="326" x2="373" y2="332" stroke="#2a2818" strokeWidth="0.8" opacity="0.45" />
      <line x1="382" y1="326" x2="381" y2="332" stroke="#2a2818" strokeWidth="0.8" opacity="0.45" />

      {/* Soldier 5 — lying curled near tent, under blanket */}
      <path d="M155 340 Q165 334 180 336 Q188 340 180 344 Q165 346 155 342 Z"
        fill="#3a3525" opacity="0.65" />
      <circle cx="153" cy="338" r="3" fill="#2a2818" opacity="0.6" />

      {/* Soldier 6 — sitting against tree 1 trunk */}
      <path d="M145 300 Q143 292 145 286 Q147 282 149 286 Q151 292 149 300 Q147 303 145 300 Z"
        fill="#2a2818" opacity="0.6" />
      <circle cx="147" cy="280" r="3.5" fill="#2a2818" opacity="0.6" />

      {/* Soldier 7 — collapsed face-down, near right pools */}
      <path d="M680 320 Q692 316 705 318 Q710 320 705 323 Q692 325 680 322 Z"
        fill="#2a2818" opacity="0.55" />
      <circle cx="678" cy="319" r="3" fill="#2a2818" opacity="0.5" />

      {/* Soldier 8 — sitting upright but slack, near tent entrance */}
      <path d="M135 335 Q133 326 135 320 Q137 316 139 320 Q141 326 139 335 Q137 338 135 335 Z"
        fill="#2a2818" opacity="0.6" />
      <circle cx="137" cy="314" r="3.5" fill="#2a2818" opacity="0.6" />
      {/* Musket across lap */}
      <line x1="128" y1="330" x2="148" y2="328" stroke="#2a2818" strokeWidth="0.7" opacity="0.4" />

      {/* ── Abandoned equipment — scattered on the ground ── */}
      {/* Cartridge box — small rectangular pouch */}
      <rect x="455" y="302" width="6" height="4" rx="0.5" fill="#2a2818" opacity="0.45" />
      <line x1="455" y1="304" x2="461" y2="304" stroke="#3a3525" strokeWidth="0.4" opacity="0.3" />
      {/* Strap from cartridge box */}
      <path d="M458 302 Q460 298 462 300" fill="none" stroke="#3a3525" strokeWidth="0.5" opacity="0.3" />

      {/* Broken bayonet — snapped blade on ground */}
      <line x1="440" y1="315" x2="450" y2="312" stroke="#5a5540" strokeWidth="0.8" opacity="0.4" />
      <line x1="450" y1="312" x2="453" y2="311" stroke="#6a6550" strokeWidth="0.6" opacity="0.35" />
      {/* Broken off tip nearby */}
      <line x1="457" y1="313" x2="461" y2="311" stroke="#6a6550" strokeWidth="0.5" opacity="0.3" />

      {/* Discarded kepi hat */}
      <ellipse cx="400" cy="318" rx="4.5" ry="1.5" fill="#2a2818" opacity="0.5" />
      <path d="M396 318 Q396 314 400 313 Q404 314 404 318" fill="#2a2818" opacity="0.45" />
      {/* Brim detail */}
      <ellipse cx="400" cy="318" rx="5.5" ry="2" fill="none" stroke="#3a3525" strokeWidth="0.4" opacity="0.3" />

      {/* Discarded canteen */}
      <circle cx="470" cy="310" r="3" fill="#3a3525" opacity="0.4" />
      <line x1="470" y1="307" x2="472" y2="305" stroke="#3a3525" strokeWidth="0.5" opacity="0.3" />
      <path d="M472 305 Q474 304 475 306" fill="none" stroke="#3a3525" strokeWidth="0.4" opacity="0.25" />

      {/* ── Insect / mosquito cloud animations — multiple swarms ── */}
      {/* Swarm 1 — large, over pools */}
      <g opacity="0.6">
        <circle cx="345" cy="248" r="0.8" fill="#3a3520" />
        <circle cx="350" cy="252" r="0.6" fill="#3a3520" />
        <circle cx="355" cy="246" r="0.7" fill="#3a3520" />
        <circle cx="348" cy="255" r="0.5" fill="#3a3520" />
        <circle cx="353" cy="250" r="0.6" fill="#3a3520" />
        <circle cx="340" cy="253" r="0.7" fill="#3a3520" />
        <circle cx="358" cy="254" r="0.5" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 5,-3; -2,4; 3,-2; 0,0" dur="6s" repeatCount="indefinite" />
      </g>
      {/* Swarm 2 — near tent */}
      <g opacity="0.5">
        <circle cx="118" cy="300" r="0.6" fill="#3a3520" />
        <circle cx="122" cy="303" r="0.5" fill="#3a3520" />
        <circle cx="115" cy="305" r="0.7" fill="#3a3520" />
        <circle cx="125" cy="298" r="0.5" fill="#3a3520" />
        <circle cx="120" cy="307" r="0.6" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -3,2; 4,-1; -2,3; 0,0" dur="7s" repeatCount="indefinite" />
      </g>
      {/* Swarm 3 — over right pool */}
      <g opacity="0.45">
        <circle cx="548" cy="235" r="0.6" fill="#3a3520" />
        <circle cx="552" cy="238" r="0.5" fill="#3a3520" />
        <circle cx="545" cy="240" r="0.7" fill="#3a3520" />
        <circle cx="556" cy="233" r="0.5" fill="#3a3520" />
        <circle cx="550" cy="242" r="0.6" fill="#3a3520" />
        <circle cx="542" cy="237" r="0.4" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 4,2; -3,-4; 2,3; 0,0" dur="8s" repeatCount="indefinite" />
      </g>
      {/* Swarm 4 — foreground, near sick soldiers */}
      <g opacity="0.4">
        <circle cx="420" cy="310" r="0.5" fill="#3a3520" />
        <circle cx="425" cy="313" r="0.6" fill="#3a3520" />
        <circle cx="418" cy="315" r="0.4" fill="#3a3520" />
        <circle cx="428" cy="308" r="0.5" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -2,3; 5,-2; -3,1; 0,0" dur="5s" repeatCount="indefinite" />
      </g>
      {/* Swarm 5 — around corpses and graves */}
      <g opacity="0.45">
        <circle cx="275" cy="342" r="0.5" fill="#3a3520" />
        <circle cx="280" cy="338" r="0.4" fill="#3a3520" />
        <circle cx="270" cy="340" r="0.6" fill="#3a3520" />
        <circle cx="283" cy="344" r="0.4" fill="#3a3520" />
        <circle cx="268" cy="345" r="0.5" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 3,-2; -4,3; 2,-1; 0,0" dur="6.5s" repeatCount="indefinite" />
      </g>

      {/* NEW: Swarm 6 — over ox carcass */}
      <g opacity="0.5">
        <circle cx="585" cy="310" r="0.6" fill="#3a3520" />
        <circle cx="590" cy="308" r="0.5" fill="#3a3520" />
        <circle cx="595" cy="312" r="0.7" fill="#3a3520" />
        <circle cx="582" cy="313" r="0.4" fill="#3a3520" />
        <circle cx="588" cy="306" r="0.5" fill="#3a3520" />
        <circle cx="597" cy="309" r="0.6" fill="#3a3520" />
        <circle cx="580" cy="308" r="0.4" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 3,-2; -2,4; 4,-3; 0,0" dur="5.5s" repeatCount="indefinite" />
      </g>
      {/* NEW: Swarm 7 — over corpse 2, near pool 1 water edge */}
      <g opacity="0.4">
        <circle cx="240" cy="242" r="0.5" fill="#3a3520" />
        <circle cx="245" cy="239" r="0.6" fill="#3a3520" />
        <circle cx="238" cy="245" r="0.4" fill="#3a3520" />
        <circle cx="248" cy="243" r="0.5" fill="#3a3520" />
        <circle cx="235" cy="240" r="0.3" fill="#3a3520" />
        <circle cx="243" cy="246" r="0.5" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -3,2; 2,-3; -1,4; 0,0" dur="7.5s" repeatCount="indefinite" />
      </g>

      {/* ── v3: Additional mosquito swarms — dense clouds near water and sick ── */}
      {/* Swarm 8 — thick cloud rising from canal */}
      <g opacity="0.5">
        <circle cx="200" cy="212" r="0.6" fill="#3a3520" />
        <circle cx="205" cy="208" r="0.5" fill="#3a3520" />
        <circle cx="195" cy="210" r="0.7" fill="#3a3520" />
        <circle cx="210" cy="214" r="0.4" fill="#3a3520" />
        <circle cx="198" cy="206" r="0.5" fill="#3a3520" />
        <circle cx="203" cy="216" r="0.45" fill="#3a3520" />
        <circle cx="207" cy="210" r="0.55" fill="#3a3520" />
        <circle cx="192" cy="214" r="0.4" fill="#3a3520" />
        <circle cx="202" cy="204" r="0.35" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 4,-3; -3,2; 2,-4; -1,3; 0,0" dur="4.5s" repeatCount="indefinite" />
      </g>
      {/* Swarm 9 — hovering near pool 4 (left foreground) */}
      <g opacity="0.45">
        <circle cx="55" cy="305" r="0.5" fill="#3a3520" />
        <circle cx="60" cy="302" r="0.6" fill="#3a3520" />
        <circle cx="52" cy="308" r="0.4" fill="#3a3520" />
        <circle cx="65" cy="304" r="0.5" fill="#3a3520" />
        <circle cx="58" cy="300" r="0.45" fill="#3a3520" />
        <circle cx="50" cy="306" r="0.35" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -2,3; 3,-2; -3,1; 2,-3; 0,0" dur="5.8s" repeatCount="indefinite" />
      </g>
      {/* Swarm 10 — around the stretcher body on ground */}
      <g opacity="0.4">
        <circle cx="435" cy="354" r="0.5" fill="#3a3520" />
        <circle cx="440" cy="352" r="0.4" fill="#3a3520" />
        <circle cx="445" cy="356" r="0.55" fill="#3a3520" />
        <circle cx="432" cy="356" r="0.35" fill="#3a3520" />
        <circle cx="438" cy="350" r="0.45" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; 2,-2; -3,1; 1,3; -2,-1; 0,0" dur="6.2s" repeatCount="indefinite" />
      </g>
      {/* Swarm 11 — near vomiting soldier behind tent */}
      <g opacity="0.4">
        <circle cx="72" cy="316" r="0.5" fill="#3a3520" />
        <circle cx="76" cy="314" r="0.4" fill="#3a3520" />
        <circle cx="68" cy="318" r="0.45" fill="#3a3520" />
        <circle cx="74" cy="312" r="0.35" fill="#3a3520" />
        <animateTransform attributeName="transform" type="translate"
          values="0,0; -2,2; 3,-1; -1,3; 0,0" dur="4.8s" repeatCount="indefinite" />
      </g>

      {/* ── Miasma clouds — detailed, drifting ── */}
      {/* Cloud 1 — large, central */}
      <ellipse cx="350" cy="255" rx="70" ry="35" fill="url(#ch6_miasma)">
        <animate attributeName="cx" values="350;375;350" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Cloud 2 — right of center */}
      <ellipse cx="520" cy="270" rx="50" ry="25" fill="url(#ch6_miasma)" opacity="0.7">
        <animate attributeName="cx" values="520;495;520" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Cloud 3 — left foreground, slow drift */}
      <ellipse cx="120" cy="310" rx="55" ry="28" fill="url(#ch6_miasma_lg)" opacity="0.8">
        <animate attributeName="cx" values="120;140;120" dur="12s" repeatCount="indefinite" />
        <animate attributeName="ry" values="28;32;28" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Cloud 4 — right foreground */}
      <ellipse cx="680" cy="300" rx="60" ry="25" fill="url(#ch6_miasma_lg)" opacity="0.6">
        <animate attributeName="cx" values="680;660;680" dur="11s" repeatCount="indefinite" />
      </ellipse>
      {/* Cloud 5 — high, near fortress, thin haze */}
      <ellipse cx="400" cy="185" rx="100" ry="18" fill="url(#ch6_miasma_lg)" opacity="0.5">
        <animate attributeName="cx" values="400;420;400" dur="14s" repeatCount="indefinite" />
      </ellipse>

      {/* ── Heat haze overlay band ── */}
      <rect x="0" y="140" width="800" height="60" fill="url(#ch6_haze)" />

      {/* ── Secondary heat distortion overlay — lower band near ground ── */}
      <rect x="0" y="260" width="800" height="45" fill="url(#ch6_haze2)" />
      {/* Shimmer 4 — additional wavy heat distortion near ground */}
      <path d="M0 280 Q80 276 160 280 Q240 276 320 280 Q400 276 480 280 Q560 276 640 280 Q720 276 800 280"
        fill="none" stroke="#8a8050" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d"
          values="M0 280 Q80 276 160 280 Q240 276 320 280 Q400 276 480 280 Q560 276 640 280 Q720 276 800 280;
                  M0 280 Q80 284 160 280 Q240 284 320 280 Q400 284 480 280 Q560 284 640 280 Q720 284 800 280;
                  M0 280 Q80 276 160 280 Q240 276 320 280 Q400 276 480 280 Q560 276 640 280 Q720 276 800 280"
          dur="7s" repeatCount="indefinite" />
      </path>
      {/* Shimmer 5 — very slow undulation near foreground */}
      <path d="M0 320 Q100 317 200 320 Q300 317 400 320 Q500 317 600 320 Q700 317 800 320"
        fill="none" stroke="#7a7545" strokeWidth="0.4" opacity="0.08">
        <animate attributeName="d"
          values="M0 320 Q100 317 200 320 Q300 317 400 320 Q500 317 600 320 Q700 317 800 320;
                  M0 320 Q100 323 200 320 Q300 323 400 320 Q500 323 600 320 Q700 323 800 320;
                  M0 320 Q100 317 200 320 Q300 317 400 320 Q500 317 600 320 Q700 317 800 320"
          dur="8s" repeatCount="indefinite" />
      </path>

      {/* ── Oppressive yellow-green atmospheric overlays ── */}
      <rect width="800" height="400" fill="url(#ch6_atmos)" />
      <rect width="800" height="400" fill="#6a6540" opacity="0.04" />
      {/* Warm band at ground level */}
      <rect x="0" y="300" width="800" height="100" fill="#5a5520" opacity="0.06" />
      {/* Dark ground edge */}
      <rect x="0" y="375" width="800" height="25" fill="#2a2a18" opacity="0.3" />

      {/* ── Radial vignette ── */}
      <rect width="800" height="400" fill="url(#ch6_vignette)" />
    </svg>
  );
}
