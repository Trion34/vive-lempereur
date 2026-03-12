import React from 'react';

/**
 * Ch.7 — Castiglione, hillside above Lake Garda
 * Hot August twilight after a brutal day of fighting against Wurmser's relief column.
 * Deep orange-to-blood-red sunset, smoke haze, Lake Garda shimmering below,
 * exhausted soldiers collapsed on a rocky Mediterranean hillside.
 * Mood: Grim triumph — victory at a terrible cost.
 */
export function Ch7CastiglioneScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Hot twilight sky — dark violet at top through blood-red to deep orange */}
        <linearGradient id="ch7_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a20" />
          <stop offset="15%" stopColor="#2a1030" />
          <stop offset="30%" stopColor="#4a1a35" />
          <stop offset="45%" stopColor="#6a2030" />
          <stop offset="60%" stopColor="#8a2a25" />
          <stop offset="75%" stopColor="#a84020" />
          <stop offset="88%" stopColor="#c0601a" />
          <stop offset="100%" stopColor="#d07828" />
        </linearGradient>
        {/* Smoke haze band across horizon */}
        <linearGradient id="ch7_smokeHaze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a4035" stopOpacity="0" />
          <stop offset="20%" stopColor="#5a4035" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#5a4035" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#5a4035" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#5a4035" stopOpacity="0" />
        </linearGradient>
        {/* Lake Garda — warm reflected sunset */}
        <linearGradient id="ch7_lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3a3a" />
          <stop offset="30%" stopColor="#3a3048" />
          <stop offset="60%" stopColor="#2a2840" />
          <stop offset="100%" stopColor="#1e2038" />
        </linearGradient>
        {/* Lake sunset reflection — orange band */}
        <linearGradient id="ch7_lakeReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c06828" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#a05030" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#804040" stopOpacity="0" />
        </linearGradient>
        {/* Lake shimmer highlight */}
        <linearGradient id="ch7_shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d08040" stopOpacity="0" />
          <stop offset="50%" stopColor="#d08040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#d08040" stopOpacity="0" />
        </linearGradient>
        {/* Rocky hillside */}
        <linearGradient id="ch7_hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2818" />
          <stop offset="40%" stopColor="#222015" />
          <stop offset="100%" stopColor="#151210" />
        </linearGradient>
        {/* Foreground dark ground */}
        <linearGradient id="ch7_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1810" />
          <stop offset="100%" stopColor="#0e0c08" />
        </linearGradient>
        {/* Campfire glow */}
        <radialGradient id="ch7_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c07030" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#a05020" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a05020" stopOpacity="0" />
        </radialGradient>
        {/* Distant battlefield fires glow */}
        <radialGradient id="ch7_distantFire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Smoke wisps */}
        <radialGradient id="ch7_smoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a4a40" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#5a4a40" stopOpacity="0" />
        </radialGradient>
        {/* Heat shimmer */}
        <linearGradient id="ch7_heat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0" />
          <stop offset="50%" stopColor="#a06030" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </linearGradient>
        {/* Vignette — heavy, oppressive */}
        <radialGradient id="ch7_vignette" cx="0.5" cy="0.45" r="0.65">
          <stop offset="40%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
        {/* Flag tatter */}
        <linearGradient id="ch7_flag" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a3050" />
          <stop offset="33%" stopColor="#cccccc" />
          <stop offset="66%" stopColor="#8a2020" />
        </linearGradient>
        {/* Surgeon blood stain gradient */}
        <radialGradient id="ch7_bloodStain" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a1510" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5a1510" stopOpacity="0" />
        </radialGradient>
        {/* Ember glow for fireflies/embers */}
        <radialGradient id="ch7_emberGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d09040" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d09040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== SKY ===== */}
      <rect width="800" height="400" fill="url(#ch7_sky)" />

      {/* Thin cloud bands catching the red light */}
      <ellipse cx="200" cy="30" rx="220" ry="6" fill="#4a1525" opacity="0.3" />
      <ellipse cx="550" cy="20" rx="180" ry="5" fill="#3a1020" opacity="0.25" />
      <ellipse cx="380" cy="45" rx="260" ry="7" fill="#5a2030" opacity="0.2" />
      <ellipse cx="680" cy="38" rx="140" ry="4" fill="#4a1525" opacity="0.18" />

      {/* ===== VULTURES / CROWS — circling in the blood-red sky ===== */}
      {/* Bird 1 — large, slow circle */}
      <g opacity="0.45">
        <path d="M310 55 Q315 52 320 55 Q325 52 330 55" fill="none" stroke="#1a0a10" strokeWidth="1.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 320 70;360 320 70" dur="28s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Bird 2 — smaller, tighter circle */}
      <g opacity="0.35">
        <path d="M480 38 Q484 35 488 38 Q492 35 496 38" fill="none" stroke="#1a0a10" strokeWidth="1.2" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="360 490 55;0 490 55" dur="22s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Bird 3 — distant, drifting */}
      <g opacity="0.25">
        <path d="M620 28 Q623 26 626 28 Q629 26 632 28" fill="none" stroke="#1a0a10" strokeWidth="1" strokeLinecap="round">
          <animate attributeName="opacity" values="0.25;0.15;0.25" dur="8s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0;-15 3;0 0" dur="18s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Smoke haze across the horizon */}
      <rect x="0" y="90" width="800" height="30" fill="url(#ch7_smokeHaze)">
        <animate attributeName="y" values="90;88;90" dur="12s" repeatCount="indefinite" />
      </rect>

      {/* Smoke columns — distant battlefield fires */}
      <path d="M180 120 Q175 90 180 50" fill="none" stroke="#4a3830" strokeWidth="3" opacity="0.12">
        <animate attributeName="d" values="M180 120 Q175 90 180 50;M180 120 Q185 90 182 50;M180 120 Q175 90 180 50" dur="9s" repeatCount="indefinite" />
      </path>
      <path d="M350 115 Q347 85 350 45" fill="none" stroke="#4a3830" strokeWidth="2.5" opacity="0.1">
        <animate attributeName="d" values="M350 115 Q347 85 350 45;M350 115 Q353 85 348 45;M350 115 Q347 85 350 45" dur="11s" repeatCount="indefinite" />
      </path>
      <path d="M580 118 Q575 88 580 55" fill="none" stroke="#4a3830" strokeWidth="2" opacity="0.08">
        <animate attributeName="d" values="M580 118 Q575 88 580 55;M580 118 Q585 88 578 55;M580 118 Q575 88 580 55" dur="10s" repeatCount="indefinite" />
      </path>
      {/* Additional smoke columns — more battlefield devastation */}
      <path d="M100 122 Q96 95 100 60" fill="none" stroke="#4a3830" strokeWidth="2" opacity="0.09">
        <animate attributeName="d" values="M100 122 Q96 95 100 60;M100 122 Q104 95 98 60;M100 122 Q96 95 100 60" dur="13s" repeatCount="indefinite" />
      </path>
      <path d="M460 116 Q456 88 460 52" fill="none" stroke="#4a3830" strokeWidth="1.8" opacity="0.07">
        <animate attributeName="d" values="M460 116 Q456 88 460 52;M460 116 Q464 88 458 52;M460 116 Q456 88 460 52" dur="14s" repeatCount="indefinite" />
      </path>
      <path d="M700 120 Q697 92 700 58" fill="none" stroke="#4a3830" strokeWidth="1.5" opacity="0.06">
        <animate attributeName="d" values="M700 120 Q697 92 700 58;M700 120 Q703 92 698 58;M700 120 Q697 92 700 58" dur="11.5s" repeatCount="indefinite" />
      </path>

      {/* ===== DISTANT MOUNTAINS — far shore of the lake ===== */}
      <path d="M0 125 Q60 108 130 115 Q200 100 280 110 Q340 95 400 108 Q460 98 530 110 Q600 102 680 112 Q740 105 800 118 L800 155 L0 155 Z"
        fill="#2a2030" opacity="0.55" />
      {/* Closer range */}
      <path d="M0 132 Q100 118 200 128 Q300 115 400 125 Q500 118 600 128 Q700 120 800 130 L800 155 L0 155 Z"
        fill="#2a1a28" opacity="0.4" />

      {/* ===== HEAT SHIMMER — animated between mountains and lake ===== */}
      <path d="M0 135 Q50 132 100 135 Q150 138 200 135 Q250 132 300 135 Q350 138 400 135 Q450 132 500 135 Q550 138 600 135 Q650 132 700 135 Q750 138 800 135"
        fill="none" stroke="#c08040" strokeWidth="0.6" opacity="0.06">
        <animate attributeName="d"
          values="M0 135 Q50 132 100 135 Q150 138 200 135 Q250 132 300 135 Q350 138 400 135 Q450 132 500 135 Q550 138 600 135 Q650 132 700 135 Q750 138 800 135;M0 135 Q50 138 100 135 Q150 132 200 135 Q250 138 300 135 Q350 132 400 135 Q450 138 500 135 Q550 132 600 135 Q650 138 700 135 Q750 132 800 135;M0 135 Q50 132 100 135 Q150 138 200 135 Q250 132 300 135 Q350 138 400 135 Q450 132 500 135 Q550 138 600 135 Q650 132 700 135 Q750 138 800 135"
          dur="3s" repeatCount="indefinite" />
      </path>

      {/* ===== LAKE GARDA ===== */}
      <path d="M0 145 Q150 138 300 142 Q450 136 600 143 Q700 138 800 145 L800 215 L0 215 Z"
        fill="url(#ch7_lake)" />
      {/* Sunset reflection band on lake surface */}
      <path d="M0 145 Q150 138 300 142 Q450 136 600 143 Q700 138 800 145 L800 175 L0 175 Z"
        fill="url(#ch7_lakeReflect)" />

      {/* Water shimmer highlights — animated */}
      <ellipse cx="180" cy="158" rx="30" ry="1.5" fill="#d08040" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="320" cy="162" rx="40" ry="1.8" fill="#c07035" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="480" cy="155" rx="35" ry="1.5" fill="#d08040" opacity="0.11">
        <animate attributeName="opacity" values="0.11;0.04;0.11" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="620" cy="160" rx="25" ry="1.2" fill="#c07035" opacity="0.09">
        <animate attributeName="opacity" values="0.09;0.03;0.09" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="175" rx="50" ry="2" fill="#b06030" opacity="0.07">
        <animate attributeName="opacity" values="0.07;0.02;0.07" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Gentle wave ripple lines */}
      <path d="M50 165 Q100 163 150 165 Q200 167 250 165" fill="none" stroke="#5a4540" strokeWidth="0.4" opacity="0.12" />
      <path d="M350 170 Q400 168 450 170 Q500 172 550 170" fill="none" stroke="#5a4540" strokeWidth="0.4" opacity="0.1" />
      <path d="M550 185 Q600 183 650 185 Q700 187 750 185" fill="none" stroke="#4a3a35" strokeWidth="0.3" opacity="0.08" />

      {/* Distant fires on the plain below — reflected in lake */}
      <ellipse cx="250" cy="195" rx="3" ry="1.5" fill="#c08040" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="198" rx="2.5" ry="1.2" fill="#c08040" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== SHORE TRANSITION ===== */}
      <path d="M0 210 Q100 205 200 212 Q350 218 500 210 Q650 205 800 215"
        fill="none" stroke="#3a3020" strokeWidth="1.2" opacity="0.3" />

      {/* ===== HILLSIDE — rocky Mediterranean terrain ===== */}
      <path d="M0 215 Q100 208 200 218 Q350 225 500 212 Q600 205 700 215 Q750 218 800 210 L800 400 L0 400 Z"
        fill="url(#ch7_hill)" />

      {/* Rock outcrops scattered on hillside */}
      <path d="M80 260 Q90 252 105 255 Q115 250 120 260 L110 265 L85 264 Z" fill="#2a2518" stroke="#3a3525" strokeWidth="0.5" />
      <path d="M250 245 Q260 238 270 242 Q278 237 282 245 L275 250 L255 248 Z" fill="#2a2518" stroke="#3a3525" strokeWidth="0.5" />
      <path d="M620 240 Q630 233 645 237 Q655 232 660 242 L650 247 L625 245 Z" fill="#282215" stroke="#3a3525" strokeWidth="0.5" />
      <path d="M720 250 Q728 244 738 248 L735 254 L722 253 Z" fill="#252015" stroke="#3a3525" strokeWidth="0.5" opacity="0.8" />
      {/* Small scattered stones */}
      <ellipse cx="160" cy="270" rx="5" ry="3" fill="#2a2518" opacity="0.6" />
      <ellipse cx="380" cy="255" rx="4" ry="2.5" fill="#282215" opacity="0.5" />
      <ellipse cx="550" cy="248" rx="6" ry="3" fill="#2a2518" opacity="0.55" />

      {/* Scrubby bushes */}
      <ellipse cx="140" cy="258" rx="12" ry="6" fill="#1a2010" opacity="0.6" />
      <ellipse cx="310" cy="250" rx="10" ry="5" fill="#1a2012" opacity="0.55" />
      <ellipse cx="680" cy="245" rx="14" ry="6" fill="#1a2010" opacity="0.5" />
      <ellipse cx="480" cy="242" rx="8" ry="4" fill="#182010" opacity="0.45" />

      {/* Stunted olive tree — left */}
      <path d="M100 255 Q103 238 106 225 Q108 218 110 212" fill="none" stroke="#252015" strokeWidth="2.5" />
      <path d="M110 212 Q115 205 118 210" fill="none" stroke="#252015" strokeWidth="1.2" />
      <path d="M110 212 Q105 206 103 211" fill="none" stroke="#252015" strokeWidth="1" />
      <ellipse cx="110" cy="208" rx="14" ry="8" fill="#1a2510" opacity="0.5" />
      <ellipse cx="118" cy="206" rx="8" ry="5" fill="#1a2510" opacity="0.4" />

      {/* Stunted olive tree — right */}
      <path d="M700 245 Q702 232 705 222 Q706 216 708 210" fill="none" stroke="#252015" strokeWidth="2" />
      <path d="M708 210 Q712 204 714 209" fill="none" stroke="#252015" strokeWidth="0.9" />
      <path d="M708 210 Q704 205 702 209" fill="none" stroke="#252015" strokeWidth="0.8" />
      <ellipse cx="708" cy="206" rx="11" ry="6" fill="#1a2510" opacity="0.45" />

      {/* Trampled dry grass patches */}
      <path d="M170 285 Q173 275 176 285" fill="none" stroke="#3a3520" strokeWidth="0.7" opacity="0.3" />
      <path d="M175 287 Q178 277 181 287" fill="none" stroke="#3a3520" strokeWidth="0.7" opacity="0.25" />
      <path d="M430 270 Q433 260 436 270" fill="none" stroke="#3a3520" strokeWidth="0.7" opacity="0.25" />
      <path d="M600 260 Q603 250 606 260" fill="none" stroke="#3a3520" strokeWidth="0.7" opacity="0.28" />
      <path d="M605 262 Q608 252 611 262" fill="none" stroke="#3a3520" strokeWidth="0.7" opacity="0.22" />
      <path d="M350 275 Q352 267 354 275" fill="none" stroke="#3a3520" strokeWidth="0.6" opacity="0.2" />

      {/* ===== BATTLE AFTERMATH DEBRIS ===== */}

      {/* Damaged cannon wheel — tilted, broken spokes */}
      <ellipse cx="200" cy="290" rx="16" ry="15" fill="none" stroke="#2a2015" strokeWidth="2.5" opacity="0.7"
        transform="rotate(-15 200 290)" />
      <line x1="200" y1="275" x2="200" y2="305" stroke="#2a2015" strokeWidth="1.2" opacity="0.5" />
      <line x1="185" y1="290" x2="215" y2="290" stroke="#2a2015" strokeWidth="1.2" opacity="0.5" />
      <line x1="189" y1="279" x2="211" y2="301" stroke="#2a2015" strokeWidth="1" opacity="0.45" />
      <line x1="189" y1="301" x2="205" y2="283" stroke="#2a2015" strokeWidth="1" opacity="0.4" />
      {/* Broken spoke */}
      <line x1="211" y1="279" x2="207" y2="285" stroke="#2a2015" strokeWidth="1" opacity="0.4" />

      {/* ===== BROKEN CANNON WHEEL — leaning against rock (right side) ===== */}
      <g transform="rotate(25 635 248)">
        {/* Wheel rim */}
        <ellipse cx="635" cy="248" rx="12" ry="11" fill="none" stroke="#2a1f12" strokeWidth="2.2" opacity="0.65" />
        {/* Hub */}
        <circle cx="635" cy="248" r="2.5" fill="#2a1f12" opacity="0.55" />
        {/* Spokes — some broken */}
        <line x1="635" y1="237" x2="635" y2="259" stroke="#2a1f12" strokeWidth="1" opacity="0.45" />
        <line x1="623" y1="248" x2="647" y2="248" stroke="#2a1f12" strokeWidth="1" opacity="0.45" />
        <line x1="627" y1="240" x2="643" y2="256" stroke="#2a1f12" strokeWidth="0.8" opacity="0.4" />
        {/* Broken spoke — snapped off halfway */}
        <line x1="627" y1="256" x2="632" y2="252" stroke="#2a1f12" strokeWidth="0.8" opacity="0.35" />
        {/* Spoke fragment on ground */}
        <line x1="640" y1="258" x2="648" y2="262" stroke="#2a1f12" strokeWidth="0.7" opacity="0.3" />
      </g>

      {/* Torn tricolor flag planted in rocky ground */}
      <line x1="500" y1="265" x2="500" y2="230" stroke="#3a3020" strokeWidth="1.8" opacity="0.65" />
      <path d="M500 230 L518 233 Q516 238 518 243 L500 240 Z" fill="url(#ch7_flag)" opacity="0.35" />
      {/* Tattered edge */}
      <path d="M518 233 Q520 236 518 238 Q521 240 518 243" fill="none" stroke="#3a2020" strokeWidth="0.5" opacity="0.25" />

      {/* ===== SWORD STUCK IN GROUND — officer's marker ===== */}
      {/* Blade planted upright in earth */}
      <line x1="330" y1="272" x2="330" y2="243" stroke="#4a4540" strokeWidth="1.5" opacity="0.55" />
      {/* Cross-guard */}
      <line x1="324" y1="253" x2="336" y2="253" stroke="#4a4540" strokeWidth="1.8" opacity="0.5" />
      {/* Pommel / grip */}
      <rect x="328" y="243" width="4" height="8" fill="#2a2018" opacity="0.5" rx="0.5" />
      <circle cx="330" cy="242" r="1.8" fill="#3a3020" opacity="0.45" />
      {/* Faint glint on blade */}
      <line x1="330" y1="256" x2="330" y2="262" stroke="#6a5a45" strokeWidth="0.5" opacity="0.15" />

      {/* Scattered equipment — canteen, cartridge box, shako */}
      <ellipse cx="340" cy="285" rx="4" ry="3" fill="#2a2518" opacity="0.5" />
      <rect x="360" y="282" width="6" height="5" fill="#1a1810" opacity="0.4" rx="1" />
      <path d="M460 268 Q462 262 468 262 Q470 265 468 268 Z" fill="#1a1510" opacity="0.45" />

      {/* ===== ABANDONED DRUM — cracked, on its side ===== */}
      {/* Drum body — elliptical on its side */}
      <ellipse cx="410" cy="278" rx="10" ry="7" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.8" opacity="0.55"
        transform="rotate(-20 410 278)" />
      {/* Drum head — the visible face */}
      <ellipse cx="402" cy="275" rx="5" ry="7" fill="#2a2518" stroke="#3a3020" strokeWidth="0.5" opacity="0.45"
        transform="rotate(-20 402 275)" />
      {/* Crack across drum head */}
      <path d="M399 270 Q402 275 400 280" fill="none" stroke="#1a1510" strokeWidth="0.6" opacity="0.35" />
      {/* Rope tensioners around drum */}
      <path d="M405 270 L415 272" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.3" />
      <path d="M404 276 L414 278" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.3" />
      <path d="M405 282 L415 284" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.3" />
      {/* Drumstick nearby */}
      <line x1="422" y1="280" x2="435" y2="283" stroke="#2a2015" strokeWidth="1" opacity="0.35" />

      {/* ===== STACKED AUSTRIAN HELMETS — captured trophy pile ===== */}
      <g opacity="0.55">
        {/* Bottom shako */}
        <path d="M155 290 Q158 284 165 284 Q172 284 175 290 L173 293 L157 293 Z" fill="#1a1510" stroke="#2a2518" strokeWidth="0.5" />
        {/* Shako cockade / plate detail */}
        <circle cx="165" cy="287" r="1.5" fill="#3a3525" opacity="0.4" />
        {/* Second shako tilted on top */}
        <path d="M158 286 Q160 281 166 280 Q171 281 172 286" fill="#1a1812" stroke="#2a2518" strokeWidth="0.4"
          transform="rotate(15 165 283)" />
        {/* Third helmet — Austrian crested, fallen sideways */}
        <ellipse cx="170" cy="289" rx="5" ry="3" fill="#1a1510" opacity="0.5" transform="rotate(30 170 289)" />
        <path d="M168 286 Q170 283 172 286" fill="#2a2015" opacity="0.4" />
      </g>

      {/* ===== WATER SKIN / CANTEEN — hanging from strap between soldiers ===== */}
      {/* Strap draped from soldier 2's area toward soldier near campfire */}
      <path d="M388 265 Q395 270 400 275" fill="none" stroke="#2a2015" strokeWidth="0.6" opacity="0.35" />
      {/* Canteen body — rounded leather flask */}
      <ellipse cx="398" cy="272" rx="4" ry="5" fill="#1e1a10" stroke="#2a2518" strokeWidth="0.5" opacity="0.5" />
      {/* Cork stopper */}
      <circle cx="398" cy="267" r="1.2" fill="#3a3020" opacity="0.4" />
      {/* Strap loop */}
      <path d="M395 268 Q393 265 396 264" fill="none" stroke="#2a2015" strokeWidth="0.5" opacity="0.3" />

      {/* Stretcher with covered body — near the flag */}
      <line x1="520" y1="268" x2="560" y2="268" stroke="#3a3020" strokeWidth="1.5" opacity="0.5" />
      <line x1="520" y1="272" x2="560" y2="272" stroke="#3a3020" strokeWidth="1.5" opacity="0.5" />
      <path d="M525 265 Q530 260 540 260 Q548 260 555 265 L555 272 L525 272 Z"
        fill="#2a2518" opacity="0.5" />
      {/* Draped cloth */}
      <path d="M524 268 Q528 264 535 264 Q545 264 550 268" fill="none" stroke="#3a3525" strokeWidth="0.6" opacity="0.35" />

      {/* ===== STRETCHER WITH BODY — near wounded soldiers (right side) ===== */}
      {/* Two poles */}
      <line x1="580" y1="285" x2="620" y2="283" stroke="#3a3020" strokeWidth="1.8" opacity="0.5" />
      <line x1="580" y1="291" x2="620" y2="289" stroke="#3a3020" strokeWidth="1.8" opacity="0.5" />
      {/* Pole ends protruding */}
      <line x1="575" y1="286" x2="580" y2="285" stroke="#3a3020" strokeWidth="2" opacity="0.45" />
      <line x1="620" y1="283" x2="626" y2="282" stroke="#3a3020" strokeWidth="2" opacity="0.45" />
      {/* Canvas between poles */}
      <rect x="582" y="284" width="36" height="6" fill="#2a2515" opacity="0.45" rx="0.5" />
      {/* Body form under cloth — gentle mound */}
      <path d="M586 284 Q590 278 600 277 Q610 278 614 284" fill="#2a2518" opacity="0.4" />
      {/* Draped blanket edge */}
      <path d="M584 286 Q588 282 596 281 Q606 281 616 284" fill="none" stroke="#3a3525" strokeWidth="0.5" opacity="0.3" />
      {/* Boot visible at end */}
      <ellipse cx="617" cy="286" rx="3" ry="2" fill="#1a1510" opacity="0.4" />

      {/* ===== SURGEON'S AREA — kneeling figure over lying figure ===== */}
      <g opacity="0.7">
        {/* Blood-stained ground beneath */}
        <ellipse cx="50" cy="295" rx="18" ry="8" fill="url(#ch7_bloodStain)" />
        {/* Lying figure — wounded soldier flat on ground */}
        <path d="M32 293 Q42 290 55 292 Q62 291 68 293" fill="none" stroke="#151510" strokeWidth="3.5" opacity="0.65" />
        <circle cx="30" cy="293" r="3.5" fill="#151510" opacity="0.65" />
        {/* Kneeling surgeon — hunched over the casualty */}
        <path d="M48 290 Q47 282 48 276 Q50 272 52 276 L53 290 L49 296 L47 296 Z"
          fill="#151510" opacity="0.75" />
        <circle cx="50" cy="272" r="3.8" fill="#151510" opacity="0.75" />
        {/* Surgeon's arms reaching down to patient */}
        <path d="M46 280 Q44 285 45 290" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.55" />
        <path d="M54 280 Q56 285 55 290" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.55" />
        {/* Blood-stained cloth — wadded beside */}
        <ellipse cx="62" cy="296" rx="4" ry="2.5" fill="#3a1510" opacity="0.35" />
        {/* Rolled bandage */}
        <ellipse cx="40" cy="298" rx="2.5" ry="1.5" fill="#4a4a3a" opacity="0.3" />
      </g>

      {/* ===== DISTANT BATTLEFIELD FIRES — on the plain below ===== */}
      <ellipse cx="150" cy="225" rx="4" ry="2" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="300" cy="230" rx="3" ry="1.5" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.5;0.25;0.5" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="222" rx="3.5" ry="1.8" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.55;0.3;0.55" dur="4.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="580" cy="228" rx="2.5" ry="1.2" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.45;0.2;0.45" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="225" rx="2" ry="1" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="5.5s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== EXHAUSTED SOLDIERS ===== */}

      {/* Soldier 1 — collapsed against a rock, legs out, head back */}
      <path d="M270 275 Q265 265 268 258 Q270 254 272 258 L274 265 Q276 270 280 278 L272 280 Z"
        fill="#151510" opacity="0.8" />
      <circle cx="270" cy="252" r="4.5" fill="#151510" opacity="0.8" />
      {/* Legs stretched out */}
      <path d="M272 278 Q280 282 290 284" fill="none" stroke="#151510" strokeWidth="2.5" opacity="0.7" />
      <path d="M272 280 Q278 285 286 288" fill="none" stroke="#151510" strokeWidth="2.5" opacity="0.7" />

      {/* Soldier 2 — head in hands, hunched over knees */}
      <path d="M380 270 Q378 262 380 256 Q382 260 384 270 Z"
        fill="#151510" opacity="0.75" />
      <circle cx="381" cy="253" r="4" fill="#151510" opacity="0.75" />
      {/* Arms to head */}
      <path d="M378 260 Q376 256 378 253" fill="none" stroke="#151510" strokeWidth="2" opacity="0.6" />
      <path d="M384 260 Q386 256 384 253" fill="none" stroke="#151510" strokeWidth="2" opacity="0.6" />

      {/* Soldier 3 — lying flat on ground, face down */}
      <path d="M440 290 Q450 288 465 290 Q475 288 480 290" fill="none" stroke="#151510" strokeWidth="4" opacity="0.65" />
      <circle cx="435" cy="290" r="3.5" fill="#151510" opacity="0.65" />

      {/* Soldier 4 — sitting hunched, musket across knees */}
      <path d="M560 260 Q558 252 560 246 Q562 242 564 246 L566 260 Q565 268 564 275 L560 275 Z"
        fill="#151510" opacity="0.8" />
      <circle cx="562" cy="240" r="4.5" fill="#151510" opacity="0.8" />
      {/* Musket across knees — horizontal */}
      <line x1="548" y1="272" x2="578" y2="270" stroke="#1a1a12" strokeWidth="1.5" opacity="0.55" />
      {/* Slumped shoulders */}
      <path d="M557 250 Q555 248 554 252" fill="none" stroke="#151510" strokeWidth="1.8" opacity="0.6" />
      <path d="M567 250 Q569 248 570 252" fill="none" stroke="#151510" strokeWidth="1.8" opacity="0.6" />

      {/* Soldier 5 — being bandaged by comrade (two figures) */}
      {/* Seated wounded soldier */}
      <path d="M640 265 Q638 258 640 252 Q642 248 644 252 L646 265 Q645 272 644 278 L640 278 Z"
        fill="#151510" opacity="0.78" />
      <circle cx="642" cy="247" r="4" fill="#151510" opacity="0.78" />
      {/* Kneeling comrade bandaging — leaning in */}
      <path d="M658 268 Q656 260 658 254 Q660 250 662 254 L664 268 L660 275 L656 275 Z"
        fill="#151510" opacity="0.72" />
      <circle cx="660" cy="249" r="3.8" fill="#151510" opacity="0.72" />
      {/* Arms reaching toward wounded man */}
      <path d="M655 258 Q650 256 646 258" fill="none" stroke="#151510" strokeWidth="1.8" opacity="0.55" />
      {/* Bandage hint — light strip */}
      <path d="M644 258 Q646 256 648 258" fill="none" stroke="#4a4a3a" strokeWidth="0.8" opacity="0.3" />

      {/* Soldier 6 — standing sentinel, looking out over the lake */}
      <path d="M760 248 Q758 235 760 222 Q762 216 764 222 L766 248 Q765 260 764 272 L760 272 Z"
        fill="#151510" opacity="0.82" />
      <circle cx="762" cy="215" r="5" fill="#151510" opacity="0.82" />
      {/* Musket held loosely at side */}
      <line x1="768" y1="220" x2="770" y2="270" stroke="#151510" strokeWidth="1.2" opacity="0.5" />

      {/* ===== SMALL CAMPFIRE — low, tired flames ===== */}
      {/* Fire glow on ground */}
      <ellipse cx="420" cy="310" rx="30" ry="8" fill="url(#ch7_fireGlow)">
        <animate attributeName="rx" values="30;34;30" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Embers / low coals */}
      <ellipse cx="420" cy="308" rx="8" ry="3" fill="#a04020" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.25;0.4" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Small flame tongues */}
      <path d="M417 306 Q418 296 420 306" fill="#c07030" opacity="0.5">
        <animate attributeName="d" values="M417 306 Q418 296 420 306;M417 306 Q419 294 420 306;M417 306 Q418 296 420 306" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M421 305 Q422 298 424 305" fill="#b06028" opacity="0.35">
        <animate attributeName="d" values="M421 305 Q422 298 424 305;M421 305 Q423 296 424 305;M421 305 Q422 298 424 305" dur="0.7s" repeatCount="indefinite" />
      </path>
      {/* Faint smoke from the campfire */}
      <path d="M420 295 Q418 278 420 260" fill="none" stroke="#5a4a3a" strokeWidth="1.5" opacity="0.08">
        <animate attributeName="d" values="M420 295 Q418 278 420 260;M420 295 Q422 278 418 260;M420 295 Q418 278 420 260" dur="6s" repeatCount="indefinite" />
      </path>

      {/* ===== RISING SMOKE WISPS — from the battlefield below ===== */}
      <ellipse cx="300" cy="200" rx="100" ry="20" fill="url(#ch7_smoke)" opacity="0.5">
        <animate attributeName="cx" values="300;320;300" dur="14s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="550" cy="190" rx="120" ry="25" fill="url(#ch7_smoke)" opacity="0.4">
        <animate attributeName="cx" values="550;570;550" dur="16s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="150" cy="195" rx="80" ry="18" fill="url(#ch7_smoke)" opacity="0.35">
        <animate attributeName="cx" values="150;165;150" dur="12s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== HEAT SHIMMER — wavy distortion lines ===== */}
      <path d="M0 210 Q100 206 200 210 Q300 214 400 210 Q500 206 600 210 Q700 214 800 210"
        fill="none" stroke="#7a5a35" strokeWidth="0.5" opacity="0.08">
        <animate attributeName="d" values="M0 210 Q100 206 200 210 Q300 214 400 210 Q500 206 600 210 Q700 214 800 210;M0 210 Q100 214 200 210 Q300 206 400 210 Q500 214 600 210 Q700 206 800 210;M0 210 Q100 206 200 210 Q300 214 400 210 Q500 206 600 210 Q700 214 800 210" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M0 220 Q150 216 300 220 Q450 224 600 220 Q750 216 800 220"
        fill="none" stroke="#7a5a35" strokeWidth="0.4" opacity="0.06">
        <animate attributeName="d" values="M0 220 Q150 216 300 220 Q450 224 600 220 Q750 216 800 220;M0 220 Q150 224 300 220 Q450 216 600 220 Q750 224 800 220;M0 220 Q150 216 300 220 Q450 224 600 220 Q750 216 800 220" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Heat shimmer band */}
      <rect x="0" y="205" width="800" height="12" fill="url(#ch7_heat)">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* ===== FOREGROUND DARK GROUND ===== */}
      <path d="M0 340 Q200 335 400 340 Q600 345 800 338 L800 400 L0 400 Z"
        fill="url(#ch7_ground)" />

      {/* Foreground rocks */}
      <path d="M30 360 Q40 350 60 355 Q70 348 80 358 L70 365 L35 363 Z" fill="#1a1810" stroke="#2a2518" strokeWidth="0.5" />
      <path d="M740 355 Q750 348 765 352 L762 360 L742 358 Z" fill="#1a1810" stroke="#2a2518" strokeWidth="0.5" />

      {/* ===== FIREFLIES / EMBERS — rising from the heat below ===== */}
      {/* Ember 1 — slow rise, left */}
      <circle cx="180" cy="300" r="1" fill="#d09040" opacity="0.4">
        <animate attributeName="cy" values="300;240;180" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="180;185;178" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.6;0" dur="8s" repeatCount="indefinite" />
      </circle>
      {/* Ember 2 — medium rise, center-left */}
      <circle cx="320" cy="310" r="0.8" fill="#c08035" opacity="0.35">
        <animate attributeName="cy" values="310;260;200" dur="10s" repeatCount="indefinite" />
        <animate attributeName="cx" values="320;316;322" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.5;0" dur="10s" repeatCount="indefinite" />
      </circle>
      {/* Ember 3 — fast rise near campfire */}
      <circle cx="425" cy="300" r="0.7" fill="#d09040" opacity="0.5">
        <animate attributeName="cy" values="300;255;210" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="425;422;428" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0" dur="6s" repeatCount="indefinite" />
      </circle>
      {/* Ember 4 — slow drift, right side */}
      <circle cx="550" cy="295" r="0.9" fill="#c08035" opacity="0.3">
        <animate attributeName="cy" values="295;250;195" dur="11s" repeatCount="indefinite" />
        <animate attributeName="cx" values="550;555;548" dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.45;0" dur="11s" repeatCount="indefinite" />
      </circle>
      {/* Ember 5 — tiny, far right */}
      <circle cx="680" cy="305" r="0.6" fill="#d09040" opacity="0.25">
        <animate attributeName="cy" values="305;258;210" dur="9s" repeatCount="indefinite" />
        <animate attributeName="cx" values="680;683;677" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.4;0" dur="9s" repeatCount="indefinite" />
      </circle>
      {/* Ember 6 — delayed start, center */}
      <circle cx="450" cy="320" r="0.8" fill="#c07030" opacity="0.3">
        <animate attributeName="cy" values="320;270;220" dur="12s" repeatCount="indefinite" />
        <animate attributeName="cx" values="450;445;452" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.4;0" dur="12s" repeatCount="indefinite" />
      </circle>
      {/* Ember 7 — near surgeon area */}
      <circle cx="70" cy="290" r="0.7" fill="#d09040" opacity="0.3">
        <animate attributeName="cy" values="290;245;195" dur="9.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="70;73;68" dur="9.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.45;0" dur="9.5s" repeatCount="indefinite" />
      </circle>

      {/* ===== ATMOSPHERIC OVERLAYS ===== */}

      {/* Warm tint over entire scene — oppressive heat */}
      <rect width="800" height="400" fill="#803020" opacity="0.03" />

      {/* Vignette — heavy and oppressive */}
      <rect width="800" height="400" fill="url(#ch7_vignette)" />

      {/* Top darkening */}
      <rect x="0" y="0" width="800" height="20" fill="#0a0510" opacity="0.35" />
      {/* Bottom darkening */}
      <rect x="0" y="375" width="800" height="25" fill="#0a0808" opacity="0.5" />
    </svg>
  );
}
