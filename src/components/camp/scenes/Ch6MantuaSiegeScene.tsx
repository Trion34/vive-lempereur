import React from 'react';

/**
 * Ch.6 — Mantua Siege, marshland
 * Oppressive midday haze. Malarial marsh, fortress silhouette in heat haze,
 * stagnant water with oily scum, sickly yellow-green atmosphere, wilting trees,
 * mosquito clouds, sick soldiers, makeshift hospital tent.
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
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch6_sky)" />

      {/* Sun — hazy, no clear disc, just diffuse glare */}
      <ellipse cx="500" cy="55" rx="100" ry="70" fill="#9a9055" opacity="0.15" />
      <ellipse cx="500" cy="55" rx="60" ry="45" fill="#aaa065" opacity="0.12" />
      <ellipse cx="500" cy="55" rx="30" ry="22" fill="#bbb075" opacity="0.1" />

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

      {/* Pool 2 — large, right-center */}
      <ellipse cx="540" cy="240" rx="110" ry="20" fill="url(#ch6_water)" opacity="0.6" />
      <ellipse cx="540" cy="240" rx="110" ry="20" fill="url(#ch6_algae)" opacity="0.4" />
      <ellipse cx="555" cy="238" rx="30" ry="5" fill="#5a6030" opacity="0.25" />
      <ellipse cx="515" cy="243" rx="20" ry="3" fill="#4a5525" opacity="0.2" />
      {/* Oily shimmer on pool 2 */}
      <ellipse cx="550" cy="239" rx="40" ry="7" fill="url(#ch6_oily)" opacity="0.5">
        <animate attributeName="rx" values="40;44;40" dur="9s" repeatCount="indefinite" />
      </ellipse>

      {/* Pool 3 — mid foreground */}
      <ellipse cx="380" cy="285" rx="65" ry="12" fill="url(#ch6_water)" opacity="0.55" />
      <ellipse cx="380" cy="285" rx="65" ry="12" fill="url(#ch6_algae)" opacity="0.35" />
      <ellipse cx="370" cy="283" rx="15" ry="3" fill="#4a5525" opacity="0.2" />

      {/* Pool 4 — small puddle, far left foreground */}
      <ellipse cx="60" cy="310" rx="35" ry="8" fill="url(#ch6_water)" opacity="0.5" />
      <ellipse cx="60" cy="310" rx="35" ry="8" fill="url(#ch6_algae)" opacity="0.3" />
      <ellipse cx="55" cy="309" rx="12" ry="3" fill="url(#ch6_oily)" opacity="0.4" />

      {/* Pool 5 — small puddle, far right */}
      <ellipse cx="720" cy="295" rx="40" ry="9" fill="url(#ch6_water)" opacity="0.45" />
      <ellipse cx="720" cy="295" rx="40" ry="9" fill="url(#ch6_algae)" opacity="0.3" />
      <ellipse cx="725" cy="294" rx="15" ry="4" fill="url(#ch6_oily)" opacity="0.35" />

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

      {/* Soldier 3 — standing, leaning on musket for support */}
      <path d="M480 275 Q478 262 480 250 Q482 244 484 250 L486 275 Q485 285 484 295 L480 295 Z"
        fill="#2a2818" opacity="0.65" />
      <circle cx="482" cy="243" r="4.5" fill="#2a2818" opacity="0.65" />
      <line x1="488" y1="243" x2="490" y2="295" stroke="#2a2818" strokeWidth="1" opacity="0.5" />

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
