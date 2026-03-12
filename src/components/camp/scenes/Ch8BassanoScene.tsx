import React from 'react';

/**
 * Ch.8 — Bassano, Brenta valley (September 1796)
 * Autumn dusk in a narrow Alpine valley. The army has just chased Wurmser
 * down through the mountain passes — an exhilarating pursuit. Steep peaks
 * on both sides, the Brenta river rushing through with white rapids.
 * Brilliant autumn foliage — oranges, reds, golds against dark stone.
 * A stone bridge crosses the river near a small Alpine village.
 * Soldiers rest along a roadside fire. Mood: Energized but weary.
 */
export function Ch8BassanoScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Autumn dusk sky — pale amber fading to deep blue-grey */}
        <linearGradient id="ch8_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2535" />
          <stop offset="18%" stopColor="#2a3045" />
          <stop offset="35%" stopColor="#3a3548" />
          <stop offset="52%" stopColor="#4a3a42" />
          <stop offset="68%" stopColor="#5a4038" />
          <stop offset="80%" stopColor="#7a5535" />
          <stop offset="90%" stopColor="#8a6540" />
          <stop offset="100%" stopColor="#9a7548" />
        </linearGradient>
        {/* Far mountains — blue-grey */}
        <linearGradient id="ch8_mtnFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252535" />
          <stop offset="100%" stopColor="#2a2a38" />
        </linearGradient>
        {/* Mid mountains — darker */}
        <linearGradient id="ch8_mtnMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1e2a" />
          <stop offset="100%" stopColor="#1a1a25" />
        </linearGradient>
        {/* Near mountain walls — darkest */}
        <linearGradient id="ch8_mtnNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161620" />
          <stop offset="100%" stopColor="#121218" />
        </linearGradient>
        {/* River water */}
        <linearGradient id="ch8_river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#253040" />
          <stop offset="30%" stopColor="#2a3848" />
          <stop offset="50%" stopColor="#304050" />
          <stop offset="70%" stopColor="#2a3848" />
          <stop offset="100%" stopColor="#253040" />
        </linearGradient>
        {/* River rapids highlight */}
        <linearGradient id="ch8_rapids" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a6a7a" stopOpacity="0" />
          <stop offset="50%" stopColor="#6a7a8a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#5a6a7a" stopOpacity="0" />
        </linearGradient>
        {/* Valley floor — autumn ground */}
        <linearGradient id="ch8_valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2818" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Road surface */}
        <linearGradient id="ch8_road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35301e" />
          <stop offset="100%" stopColor="#2a2518" />
        </linearGradient>
        {/* Fire glow */}
        <radialGradient id="ch8_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#c08040" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Dusk glow on horizon */}
        <radialGradient id="ch8_duskGlow" cx="0.5" cy="0.75" r="0.5">
          <stop offset="0%" stopColor="#8a6540" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#7a5535" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#7a5535" stopOpacity="0" />
        </radialGradient>
        {/* Bridge stone */}
        <linearGradient id="ch8_bridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3828" />
          <stop offset="50%" stopColor="#353322" />
          <stop offset="100%" stopColor="#2a2818" />
        </linearGradient>
        {/* Village roof warm */}
        <linearGradient id="ch8_roofWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3020" />
          <stop offset="100%" stopColor="#3a2518" />
        </linearGradient>
        {/* Warm vignette */}
        <radialGradient id="ch8_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="45%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a1008" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch8_sky)" />
      <rect width="800" height="400" fill="url(#ch8_duskGlow)" />

      {/* Thin dusk clouds */}
      <ellipse cx="180" cy="30" rx="140" ry="7" fill="#3a3040" opacity="0.2">
        <animate attributeName="cx" values="180;200;180" dur="22s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="20" rx="170" ry="6" fill="#3a2a38" opacity="0.18">
        <animate attributeName="cx" values="420;445;420" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="40" rx="110" ry="5" fill="#3a3040" opacity="0.15">
        <animate attributeName="cx" values="650;670;650" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="300" cy="55" rx="90" ry="4" fill="#3a2a38" opacity="0.12" />

      {/* === FAR MOUNTAIN RANGE — distant blue-grey peaks === */}
      <path d="M0 110 Q40 80 90 95 Q130 65 180 85 Q220 55 280 75 Q330 50 380 70 Q420 45 470 65 Q510 40 560 60 Q600 50 650 68 Q700 42 760 65 Q790 55 800 70 L800 150 L0 150 Z"
        fill="url(#ch8_mtnFar)" opacity="0.6" />

      {/* === MID MOUNTAIN LAYER — steeper Alpine forms === */}
      {/* Left mountain wall */}
      <path d="M0 130 Q30 95 70 110 Q100 75 150 100 Q190 65 240 95 Q260 85 270 90 L270 280 L0 280 Z"
        fill="url(#ch8_mtnMid)" opacity="0.8" />
      {/* Right mountain wall */}
      <path d="M540 95 Q580 60 620 80 Q660 50 710 75 Q750 45 800 70 L800 280 L540 280 Z"
        fill="url(#ch8_mtnMid)" opacity="0.8" />

      {/* === NEAR MOUNTAIN SLOPES — steep valley sides === */}
      {/* Left near slope */}
      <path d="M0 155 Q40 120 80 140 Q120 105 170 130 Q200 115 230 130 L230 310 L0 310 Z"
        fill="url(#ch8_mtnNear)" opacity="0.9" />
      {/* Right near slope */}
      <path d="M580 125 Q620 100 660 120 Q700 90 740 108 Q770 95 800 110 L800 310 L580 310 Z"
        fill="url(#ch8_mtnNear)" opacity="0.9" />

      {/* Rock texture lines on left slope */}
      <path d="M50 170 Q70 165 90 172" fill="none" stroke="#222230" strokeWidth="0.6" opacity="0.2" />
      <path d="M30 190 Q60 185 100 192" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.18" />
      <path d="M80 155 Q110 148 140 155" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.15" />

      {/* Rock texture lines on right slope */}
      <path d="M620 145 Q660 138 700 145" fill="none" stroke="#222230" strokeWidth="0.6" opacity="0.2" />
      <path d="M650 165 Q690 158 730 165" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.18" />
      <path d="M600 180 Q630 175 670 182" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.15" />

      {/* === CONIFERS ON HIGH SLOPES — dark silhouettes === */}
      {/* Left slope conifers */}
      <path d="M55 148 L58 128 L61 148 Z" fill="#141a12" opacity="0.6" />
      <path d="M56 138 L58 120 L60 138 Z" fill="#141a12" opacity="0.55" />
      <path d="M100 140 L103 118 L106 140 Z" fill="#141a12" opacity="0.55" />
      <path d="M101 130 L103 110 L105 130 Z" fill="#141a12" opacity="0.5" />
      <path d="M140 133 L143 115 L146 133 Z" fill="#141a12" opacity="0.5" />
      <path d="M180 125 L182 110 L184 125 Z" fill="#141a12" opacity="0.45" />
      <path d="M210 128 L212 114 L214 128 Z" fill="#141a12" opacity="0.4" />

      {/* Right slope conifers */}
      <path d="M600 135 L603 115 L606 135 Z" fill="#141a12" opacity="0.55" />
      <path d="M601 125 L603 108 L605 125 Z" fill="#141a12" opacity="0.5" />
      <path d="M650 128 L653 108 L656 128 Z" fill="#141a12" opacity="0.5" />
      <path d="M700 120 L702 102 L704 120 Z" fill="#141a12" opacity="0.45" />
      <path d="M740 115 L742 100 L744 115 Z" fill="#141a12" opacity="0.4" />
      <path d="M770 110 L772 98 L774 110 Z" fill="#141a12" opacity="0.35" />

      {/* === AUTUMN TREES ON LOWER SLOPES === */}
      {/* Left slope autumn trees — trunks + foliage */}
      <rect x="78" y="155" width="2" height="15" fill="#2a2015" opacity="0.5" />
      <ellipse cx="79" cy="150" rx="12" ry="9" fill="#7a4020" opacity="0.55" />
      <rect x="118" y="148" width="2" height="14" fill="#2a2015" opacity="0.45" />
      <ellipse cx="119" cy="143" rx="10" ry="8" fill="#8a5525" opacity="0.5" />
      <rect x="158" y="140" width="2" height="12" fill="#2a2015" opacity="0.4" />
      <ellipse cx="159" cy="136" rx="11" ry="7" fill="#6a3a18" opacity="0.5" />
      <ellipse cx="195" cy="130" rx="9" ry="6" fill="#7a4520" opacity="0.45" />
      <ellipse cx="145" cy="148" rx="8" ry="6" fill="#5a6025" opacity="0.4" />

      {/* Right slope autumn trees */}
      <rect x="608" y="142" width="2" height="14" fill="#2a2015" opacity="0.5" />
      <ellipse cx="609" cy="137" rx="11" ry="8" fill="#8a4520" opacity="0.5" />
      <rect x="648" y="135" width="2" height="12" fill="#2a2015" opacity="0.45" />
      <ellipse cx="649" cy="131" rx="10" ry="7" fill="#7a5528" opacity="0.5" />
      <ellipse cx="685" cy="125" rx="9" ry="6" fill="#6a3a18" opacity="0.45" />
      <rect x="718" y="122" width="2" height="10" fill="#2a2015" opacity="0.4" />
      <ellipse cx="719" cy="118" rx="10" ry="7" fill="#8a5020" opacity="0.45" />
      <ellipse cx="670" cy="132" rx="7" ry="5" fill="#4a5520" opacity="0.4" />

      {/* === VALLEY FLOOR === */}
      <path d="M230 240 Q320 230 400 235 Q480 230 580 240 L580 400 L230 400 Z"
        fill="url(#ch8_valley)" />

      {/* === BRENTA RIVER — rushing through valley === */}
      {/* Main river body */}
      <path d="M330 160 Q355 180 375 200 Q400 220 390 242 Q375 265 358 285 Q340 305 348 325 Q358 345 375 365 Q385 380 390 400"
        fill="none" stroke="url(#ch8_river)" strokeWidth="32" strokeLinecap="round" opacity="0.7" />

      {/* River surface — darker center flow */}
      <path d="M338 168 Q360 186 378 205 Q398 224 388 245 Q374 268 357 288 Q342 308 350 328 Q360 348 376 368"
        fill="none" stroke="#253540" strokeWidth="10" opacity="0.25" />

      {/* White rapids / foam streaks — animated */}
      <path d="M345 175 Q355 178 365 175" fill="none" stroke="#6a7a8a" strokeWidth="1.2" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M380 210 Q390 213 395 208" fill="none" stroke="#6a7a8a" strokeWidth="1" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.12;0.22" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M385 240 Q378 244 372 240" fill="none" stroke="#7a8a9a" strokeWidth="1.2" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M365 270 Q358 273 350 270" fill="none" stroke="#6a7a8a" strokeWidth="1" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M345 300 Q352 303 358 300" fill="none" stroke="#7a8a9a" strokeWidth="1.2" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.1;0.18" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M355 335 Q362 338 370 335" fill="none" stroke="#6a7a8a" strokeWidth="1" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.08;0.18" dur="1.7s" repeatCount="indefinite" />
      </path>

      {/* River rocks protruding */}
      <ellipse cx="362" cy="192" rx="4" ry="2.5" fill="#252530" opacity="0.5" />
      <ellipse cx="386" cy="228" rx="3" ry="2" fill="#252530" opacity="0.45" />
      <ellipse cx="368" cy="260" rx="3.5" ry="2" fill="#252530" opacity="0.45" />
      <ellipse cx="345" cy="310" rx="4" ry="2.5" fill="#252530" opacity="0.4" />
      {/* White water around rocks */}
      <path d="M358 192 Q362 189 366 192" fill="none" stroke="#7a8a9a" strokeWidth="0.6" opacity="0.2" />
      <path d="M364 260 Q368 257 372 260" fill="none" stroke="#7a8a9a" strokeWidth="0.6" opacity="0.18" />

      {/* Animated water flow lines */}
      <path d="M340 180 Q348 185 340 190" fill="none" stroke="#4a5a6a" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M340 180 Q348 185 340 190;M340 182 Q349 187 340 192;M340 180 Q348 185 340 190" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M380 250 Q372 255 380 260" fill="none" stroke="#4a5a6a" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="d" values="M380 250 Q372 255 380 260;M380 252 Q371 257 380 262;M380 250 Q372 255 380 260" dur="2.2s" repeatCount="indefinite" />
      </path>

      {/* === STONE BRIDGE over the river === */}
      {/* Bridge arch */}
      <path d="M310 240 Q330 225 350 218 Q370 212 390 218 Q410 225 430 240"
        fill="url(#ch8_bridge)" opacity="0.7" />
      {/* Bridge deck */}
      <rect x="308" y="215" width="124" height="6" rx="1" fill="#3a3625" opacity="0.65" />
      {/* Bridge arch opening — water visible below */}
      <path d="M322 240 Q340 228 358 222 Q378 228 395 240"
        fill="#253040" opacity="0.4" />
      {/* Bridge parapet lines */}
      <path d="M310 215 Q370 213 430 215" fill="none" stroke="#4a4535" strokeWidth="0.8" opacity="0.3" />
      <path d="M312 221 Q370 219 428 221" fill="none" stroke="#35301e" strokeWidth="0.5" opacity="0.25" />
      {/* Stone blocks on bridge */}
      <line x1="330" y1="215" x2="330" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />
      <line x1="350" y1="215" x2="350" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />
      <line x1="370" y1="215" x2="370" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />
      <line x1="390" y1="215" x2="390" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />

      {/* === MOUNTAIN VILLAGE — far side of river === */}
      {/* Building 1 — larger, central */}
      <rect x="420" y="195" width="18" height="22" fill="#2a2820" opacity="0.6" />
      <path d="M418 195 L429 183 L440 195 Z" fill="url(#ch8_roofWarm)" opacity="0.55" />
      {/* Window glow */}
      <rect x="425" y="203" width="3" height="3" fill="#8a7040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Building 2 — smaller, left */}
      <rect x="406" y="200" width="13" height="17" fill="#252318" opacity="0.55" />
      <path d="M404 200 L412 190 L420 200 Z" fill="url(#ch8_roofWarm)" opacity="0.5" />
      {/* Window */}
      <rect x="410" y="206" width="2" height="2.5" fill="#8a7040" opacity="0.18" />

      {/* Building 3 — behind, taller */}
      <rect x="438" y="190" width="14" height="27" fill="#222018" opacity="0.5" />
      <path d="M436 190 L445 178 L454 190 Z" fill="#3a2820" opacity="0.45" />

      {/* Building 4 — small outbuilding */}
      <rect x="455" y="205" width="10" height="12" fill="#2a2820" opacity="0.45" />
      <path d="M454 205 L460 198 L466 205 Z" fill="url(#ch8_roofWarm)" opacity="0.4" />

      {/* Village church tower hint */}
      <rect x="443" y="175" width="5" height="15" fill="#252320" opacity="0.4" />
      <path d="M442 175 L445 170 L449 175 Z" fill="#3a2a20" opacity="0.35" />

      {/* === ROAD BESIDE THE RIVER === */}
      <path d="M230 295 Q300 288 370 290 Q430 285 500 290 Q550 295 580 300"
        fill="url(#ch8_road)" opacity="0.5" />
      <path d="M230 305 Q300 298 370 300 Q430 295 500 300 Q550 305 580 310"
        fill="url(#ch8_road)" opacity="0.4" />
      {/* Road edges */}
      <path d="M230 295 Q300 288 370 290 Q430 285 500 290 Q550 295 580 300"
        fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.2" />

      {/* === VALLEY FLOOR AUTUMN TREES === */}
      {/* Tree near road — large, vibrant */}
      <rect x="275" y="250" width="3" height="38" fill="#2a2015" opacity="0.6" />
      <ellipse cx="276" cy="242" rx="16" ry="12" fill="#8a4520" opacity="0.5" />
      <ellipse cx="270" cy="246" rx="10" ry="8" fill="#9a5828" opacity="0.4" />
      <ellipse cx="283" cy="245" rx="8" ry="7" fill="#7a3a18" opacity="0.45" />

      {/* Tree — gold tones */}
      <rect x="505" y="255" width="3" height="35" fill="#2a2015" opacity="0.55" />
      <ellipse cx="506" cy="248" rx="14" ry="10" fill="#8a7030" opacity="0.5" />
      <ellipse cx="512" cy="250" rx="9" ry="7" fill="#9a8035" opacity="0.4" />

      {/* Bare tree — lost its leaves */}
      <path d="M545 260 Q546 245 548 230" fill="none" stroke="#2a2015" strokeWidth="2" opacity="0.45" />
      <path d="M548 230 Q552 222 555 228" fill="none" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
      <path d="M548 230 Q544 224 542 228" fill="none" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
      <path d="M547 238 Q543 232 541 236" fill="none" stroke="#2a2015" strokeWidth="0.6" opacity="0.3" />
      <path d="M547 238 Q552 234 554 237" fill="none" stroke="#2a2015" strokeWidth="0.6" opacity="0.3" />

      {/* Small red shrub */}
      <ellipse cx="320" cy="282" rx="8" ry="5" fill="#6a2a15" opacity="0.4" />

      {/* === CAMPFIRE — roadside === */}
      <ellipse cx="430" cy="298" rx="30" ry="10" fill="url(#ch8_fireGlow)">
        <animate attributeName="rx" values="30;34;30" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire flames */}
      <path d="M426 294 Q428 282 430 294" fill="#d09050" opacity="0.6">
        <animate attributeName="d" values="M426 294 Q428 282 430 294;M426 294 Q429 280 430 294;M426 294 Q428 282 430 294" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M430 294 Q432 284 434 294" fill="#c07838" opacity="0.5">
        <animate attributeName="d" values="M430 294 Q432 284 434 294;M430 294 Q433 282 434 294;M430 294 Q432 284 434 294" dur="0.4s" repeatCount="indefinite" />
      </path>
      <path d="M428 296 Q430 288 432 296" fill="#b06830" opacity="0.4">
        <animate attributeName="d" values="M428 296 Q430 288 432 296;M428 296 Q431 286 432 296;M428 296 Q430 288 432 296" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Fire sparks */}
      <circle cx="429" cy="278" r="0.6" fill="#e0b070" opacity="0.5">
        <animate attributeName="cy" values="278;258;240" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="432" cy="275" r="0.4" fill="#e0a060" opacity="0.4">
        <animate attributeName="cy" values="275;260;248" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cx" values="432;435;434" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Smoke from fire */}
      <path d="M430 278 Q428 260 432 240" fill="none" stroke="#5a5040" strokeWidth="2" opacity="0.08">
        <animate attributeName="d" values="M430 278 Q428 260 432 240;M430 278 Q433 260 430 240;M430 278 Q428 260 432 240" dur="6s" repeatCount="indefinite" />
      </path>

      {/* === SOLDIERS — resting along the road === */}

      {/* Soldier 1 — sitting by fire, warming hands */}
      <path d="M418 290 Q416 282 418 276 Q420 282 422 290 Z"
        fill="#121010" opacity="0.8" />
      <circle cx="419" cy="272" r="4.5" fill="#121010" opacity="0.8" />
      {/* Extended arms toward fire */}
      <path d="M421 278 Q425 282 428 280" fill="none" stroke="#121010" strokeWidth="1.5" opacity="0.6" />

      {/* Soldier 2 — sitting opposite side of fire */}
      <path d="M444 288 Q442 280 444 274 Q446 280 448 288 Z"
        fill="#121010" opacity="0.75" />
      <circle cx="445" cy="270" r="4" fill="#121010" opacity="0.75" />
      {/* Arm resting on knee */}
      <path d="M442 280 Q438 284 436 282" fill="none" stroke="#121010" strokeWidth="1.2" opacity="0.5" />

      {/* Soldier 3 — kneeling by river, drinking */}
      <path d="M360 270 Q358 264 360 258 Q362 264 362 270 Z"
        fill="#121010" opacity="0.75" />
      <circle cx="360" cy="255" r="3.5" fill="#121010" opacity="0.75" />
      {/* Arm reaching down to water */}
      <path d="M362 260 Q366 266 368 272" fill="none" stroke="#121010" strokeWidth="1.5" opacity="0.5" />

      {/* Soldier 4 — sitting, checking boots */}
      <path d="M475 288 Q473 280 475 274 Q477 280 479 288 Z"
        fill="#121010" opacity="0.7" />
      <circle cx="476" cy="270" r="4" fill="#121010" opacity="0.7" />
      {/* Leaning forward, looking at foot */}
      <path d="M477 278 Q480 284 484 288" fill="none" stroke="#121010" strokeWidth="1.2" opacity="0.45" />

      {/* Soldier 5 — standing, looking up the valley (the march continues at dawn) */}
      <path d="M500 268 Q498 258 500 248 Q502 242 504 248 L506 268 Q505 278 504 290 L500 290 Z"
        fill="#121010" opacity="0.8" />
      <circle cx="502" cy="242" r="5" fill="#121010" opacity="0.8" />
      {/* Musket held upright */}
      <line x1="508" y1="240" x2="510" y2="218" stroke="#121010" strokeWidth="1.2" opacity="0.55" />

      {/* Distant marching column — implied, fading into dusk */}
      <path d="M530 262 Q528 254 530 248 Q532 254 534 262 Z" fill="#121010" opacity="0.4" />
      <circle cx="531" cy="246" r="2.5" fill="#121010" opacity="0.35" />
      <path d="M545 260 Q543 253 545 248 Q547 253 549 260 Z" fill="#121010" opacity="0.3" />
      <circle cx="546" cy="246" r="2" fill="#121010" opacity="0.25" />
      <path d="M558 258 Q556 252 558 248 Q560 252 562 258 Z" fill="#121010" opacity="0.22" />

      {/* === FALLING LEAVES — drifting in dusk air === */}
      {/* Leaf 1 — orange, tumbling */}
      <ellipse cx="310" cy="180" rx="2" ry="1" fill="#8a5025" opacity="0.4" transform="rotate(30 310 180)">
        <animate attributeName="cy" values="180;260;340" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="310;320;315" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.3;0.08" dur="7s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 2 — red, swaying */}
      <ellipse cx="490" cy="160" rx="1.5" ry="0.8" fill="#6a2a15" opacity="0.35" transform="rotate(-20 490 160)">
        <animate attributeName="cy" values="160;240;330" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="490;500;494" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.25;0.05" dur="8s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 3 — gold, slow drift */}
      <ellipse cx="400" cy="200" rx="1.8" ry="0.9" fill="#9a8035" opacity="0.3" transform="rotate(45 400 200)">
        <animate attributeName="cy" values="200;280;370" dur="9s" repeatCount="indefinite" />
        <animate attributeName="cx" values="400;395;402" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.2;0" dur="9s" repeatCount="indefinite" />
      </ellipse>

      {/* === BIRDS — distant, silhouette === */}
      <path d="M520 65 Q524 60 528 65" fill="none" stroke="#1a1a25" strokeWidth="0.8" opacity="0.3">
        <animate attributeName="cx" values="520;530;520" dur="12s" repeatCount="indefinite" />
      </path>
      <path d="M535 60 Q538 56 541 60" fill="none" stroke="#1a1a25" strokeWidth="0.7" opacity="0.25" />
      <path d="M510 70 Q513 66 516 70" fill="none" stroke="#1a1a25" strokeWidth="0.6" opacity="0.2" />

      {/* === FOREGROUND SLOPES — dark framing === */}
      <path d="M0 340 Q60 325 130 335 Q180 330 230 340 L230 400 L0 400 Z"
        fill="#121210" />
      <path d="M580 335 Q640 325 700 332 Q750 328 800 335 L800 400 L580 400 Z"
        fill="#121210" />

      {/* Foreground autumn foliage — close, warm */}
      <ellipse cx="50" cy="338" rx="18" ry="10" fill="#5a3018" opacity="0.35" />
      <ellipse cx="120" cy="335" rx="14" ry="8" fill="#6a3a20" opacity="0.3" />
      <ellipse cx="700" cy="332" rx="16" ry="9" fill="#5a3018" opacity="0.3" />
      <ellipse cx="760" cy="335" rx="12" ry="7" fill="#7a4520" opacity="0.25" />

      {/* Foreground grass tufts */}
      <path d="M240 340 Q243 332 246 340" fill="none" stroke="#2a2a15" strokeWidth="0.8" opacity="0.3" />
      <path d="M570 338 Q573 330 576 338" fill="none" stroke="#2a2a15" strokeWidth="0.8" opacity="0.3" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Warm dusk tint */}
      <rect width="800" height="400" fill="#5a3820" opacity="0.03" />

      {/* Vignette — warm-toned */}
      <rect width="800" height="400" fill="url(#ch8_vignette)" />

      {/* Top/bottom darkening */}
      <rect x="0" y="0" width="800" height="18" fill="#0e0e15" opacity="0.3" />
      <rect x="0" y="380" width="800" height="20" fill="#0a0808" opacity="0.4" />
    </svg>
  );
}
