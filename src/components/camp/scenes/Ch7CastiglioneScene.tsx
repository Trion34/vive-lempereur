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

        {/* === NEW GRADIENTS === */}

        {/* Bright sunset reflection streak on lake */}
        <linearGradient id="ch7_sunsetStreak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e09030" stopOpacity="0.45" />
          <stop offset="30%" stopColor="#d07828" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#c06020" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a05020" stopOpacity="0" />
        </linearGradient>
        {/* Burning village fire glow */}
        <radialGradient id="ch7_villageFireGlow" cx="0.5" cy="0.8" r="0.5">
          <stop offset="0%" stopColor="#d06020" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#b04818" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#903010" stopOpacity="0" />
        </radialGradient>
        {/* Thick smoke column gradient */}
        <linearGradient id="ch7_thickSmoke" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3a2a20" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#4a3830" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#5a4a40" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#5a4a40" stopOpacity="0" />
        </linearGradient>
        {/* Olive tree foliage */}
        <radialGradient id="ch7_oliveFoliage" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1e2a12" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#1a2510" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#152008" stopOpacity="0.3" />
        </radialGradient>
        {/* Horse silhouette fill */}
        <linearGradient id="ch7_horseFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#181510" />
          <stop offset="100%" stopColor="#121010" />
        </linearGradient>
        {/* Ammunition wagon wood */}
        <linearGradient id="ch7_wagonWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2215" />
          <stop offset="100%" stopColor="#1e1a10" />
        </linearGradient>
        {/* Ember pile glow — dying second fire */}
        <radialGradient id="ch7_emberPileGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#904020" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#703018" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#703018" stopOpacity="0" />
        </radialGradient>
        {/* Grave cross wood */}
        <linearGradient id="ch7_graveWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3020" />
          <stop offset="100%" stopColor="#2a2015" />
        </linearGradient>
        {/* Lake shore wet sand */}
        <linearGradient id="ch7_shoreSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2820" />
          <stop offset="100%" stopColor="#222018" />
        </linearGradient>

        {/* === ENHANCED GRADIENTS === */}

        {/* Cumulus cloud lit from below by sunset */}
        <radialGradient id="ch7_cloudLit" cx="0.5" cy="0.8" r="0.6">
          <stop offset="0%" stopColor="#c06028" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#8a3025" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4a1a25" stopOpacity="0.08" />
        </radialGradient>
        {/* Cloud dark underside */}
        <radialGradient id="ch7_cloudDark" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#2a1520" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2a1520" stopOpacity="0" />
        </radialGradient>
        {/* Dust cloud on plain */}
        <radialGradient id="ch7_dustCloud" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7a6050" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#6a5040" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#6a5040" stopOpacity="0" />
        </radialGradient>
        {/* Cypress tree dark fill */}
        <linearGradient id="ch7_cypressFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1a08" />
          <stop offset="100%" stopColor="#0a1206" />
        </linearGradient>
        {/* Wheat field — golden-brown parched */}
        <linearGradient id="ch7_wheatField" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3018" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2212" stopOpacity="0.25" />
        </linearGradient>
        {/* Dusty road surface */}
        <linearGradient id="ch7_dustyRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2818" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#241e12" stopOpacity="0.35" />
        </linearGradient>
        {/* Gun smoke puff */}
        <radialGradient id="ch7_gunSmoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7a7068" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#6a6058" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#6a6058" stopOpacity="0" />
        </radialGradient>
        {/* Harsh sun disc glow */}
        <radialGradient id="ch7_sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e8a040" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#d08030" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#b06025" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a05020" stopOpacity="0" />
        </radialGradient>
        {/* Cast shadow from low sun */}
        <linearGradient id="ch7_castShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a0808" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0a0808" stopOpacity="0" />
        </linearGradient>
        {/* Stone building wall */}
        <linearGradient id="ch7_stoneWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3228" />
          <stop offset="100%" stopColor="#2a2418" />
        </linearGradient>
        {/* Artillery battery smoke */}
        <radialGradient id="ch7_artillerySmoke" cx="0.5" cy="0.7" r="0.5">
          <stop offset="0%" stopColor="#8a7868" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#6a5a4a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6a5a4a" stopOpacity="0" />
        </radialGradient>
        {/* Formation dust haze */}
        <linearGradient id="ch7_formationDust" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6a5a48" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#5a4a38" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#5a4a38" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ===== SKY ===== */}
      <rect width="800" height="400" fill="url(#ch7_sky)" />

      {/* ===== SETTING SUN — low on horizon, partially behind mountains ===== */}
      <ellipse cx="420" cy="120" rx="35" ry="30" fill="url(#ch7_sunGlow)">
        <animate attributeName="opacity" values="1;0.85;1" dur="6s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner bright core */}
      <ellipse cx="420" cy="120" rx="12" ry="10" fill="#e8a848" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.12;0.18" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Sun rays — long streaks through cloud layers */}
      <line x1="420" y1="120" x2="280" y2="60" stroke="#c07030" strokeWidth="1.2" opacity="0.04" />
      <line x1="420" y1="120" x2="550" y2="55" stroke="#c07030" strokeWidth="1" opacity="0.035" />
      <line x1="420" y1="120" x2="160" y2="80" stroke="#b06028" strokeWidth="0.8" opacity="0.03" />
      <line x1="420" y1="120" x2="650" y2="70" stroke="#b06028" strokeWidth="0.7" opacity="0.025" />
      <line x1="420" y1="120" x2="350" y2="40" stroke="#c07030" strokeWidth="0.6" opacity="0.03" />

      {/* Thin cloud bands catching the red light */}
      <ellipse cx="200" cy="30" rx="220" ry="6" fill="#4a1525" opacity="0.3" />
      <ellipse cx="550" cy="20" rx="180" ry="5" fill="#3a1020" opacity="0.25" />
      <ellipse cx="380" cy="45" rx="260" ry="7" fill="#5a2030" opacity="0.2" />
      <ellipse cx="680" cy="38" rx="140" ry="4" fill="#4a1525" opacity="0.18" />

      {/* ===== SUMMER CUMULUS CLOUDS — dramatic, lit from below by the dying sun ===== */}
      {/* Large towering cumulus — center-right */}
      <g>
        <ellipse cx="580" cy="48" rx="60" ry="28" fill="url(#ch7_cloudDark)" />
        <ellipse cx="575" cy="55" rx="55" ry="20" fill="url(#ch7_cloudLit)" />
        <ellipse cx="560" cy="42" rx="35" ry="18" fill="#3a1828" opacity="0.2" />
        <ellipse cx="600" cy="50" rx="28" ry="14" fill="#4a2030" opacity="0.15" />
        {/* Bright underlit edge */}
        <ellipse cx="575" cy="65" rx="40" ry="5" fill="#a05028" opacity="0.1" />
      </g>
      {/* Smaller cumulus — far left */}
      <g>
        <ellipse cx="80" cy="55" rx="40" ry="20" fill="url(#ch7_cloudDark)" />
        <ellipse cx="85" cy="62" rx="35" ry="14" fill="url(#ch7_cloudLit)" />
        <ellipse cx="70" cy="50" rx="22" ry="12" fill="#3a1828" opacity="0.18" />
        <ellipse cx="85" cy="70" rx="28" ry="4" fill="#a05028" opacity="0.08" />
      </g>
      {/* Wispy anvil top — high altitude ice cloud spreading from cumulus */}
      <ellipse cx="620" cy="18" rx="80" ry="4" fill="#3a1828" opacity="0.12" />
      <ellipse cx="560" cy="14" rx="50" ry="3" fill="#2a1020" opacity="0.1" />
      {/* Small distant cumulus — center */}
      <ellipse cx="340" cy="60" rx="25" ry="12" fill="url(#ch7_cloudDark)" />
      <ellipse cx="342" cy="66" rx="22" ry="8" fill="url(#ch7_cloudLit)" />
      {/* Fractus clouds — ragged low wisps being torn by wind */}
      <ellipse cx="450" cy="78" rx="30" ry="4" fill="#4a2030" opacity="0.12">
        <animate attributeName="cx" values="450;460;450" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="180" cy="72" rx="22" ry="3" fill="#3a1828" opacity="0.1">
        <animate attributeName="cx" values="180;188;180" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="720" cy="68" rx="18" ry="3" fill="#3a1525" opacity="0.1">
        <animate attributeName="cx" values="720;728;720" dur="16s" repeatCount="indefinite" />
      </ellipse>

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

      {/* ===== SWALLOWS / BATS — darting silhouettes against blood-red sky ===== */}
      {/* Swallow 1 — fast sweep left to right */}
      <g opacity="0.4">
        <path d="M0 65 Q3 62 6 65 Q9 62 12 65" fill="none" stroke="#1a0a10" strokeWidth="0.9" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 0;400 -15;800 5" dur="14s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Swallow 2 — smaller, erratic flutter */}
      <g opacity="0.32">
        <path d="M750 48 Q752 46 754 48 Q756 46 758 48" fill="none" stroke="#1a0a10" strokeWidth="0.8" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 0;-300 12;-650 -5" dur="18s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Bat 1 — jagged flutter near horizon */}
      <g opacity="0.28">
        <path d="M420 72 Q423 68 426 72 Q429 68 432 72" fill="none" stroke="#1a0a10" strokeWidth="0.7" strokeLinecap="round">
          <animate attributeName="d" values="M420 72 Q423 68 426 72 Q429 68 432 72;M420 72 Q423 70 426 72 Q429 70 432 72;M420 72 Q423 68 426 72 Q429 68 432 72" dur="0.4s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0;60 -8;120 2;180 -5" dur="10s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Bat 2 — small erratic near left sky */}
      <g opacity="0.22">
        <path d="M140 58 Q142 55 144 58 Q146 55 148 58" fill="none" stroke="#1a0a10" strokeWidth="0.6" strokeLinecap="round">
          <animate attributeName="d" values="M140 58 Q142 55 144 58 Q146 55 148 58;M140 58 Q142 57 144 58 Q146 57 148 58;M140 58 Q142 55 144 58 Q146 55 148 58" dur="0.35s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0;-40 10;-80 -3;-120 8" dur="12s" repeatCount="indefinite" />
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

      {/* ===== BURNING VILLAGE — prominent distant fire with thick animated smoke ===== */}
      <g>
        {/* Village silhouette — ruined buildings */}
        <path d="M240 118 L240 112 L248 108 L256 112 L256 118" fill="#2a1518" opacity="0.5" />
        <path d="M256 118 L256 114 L260 110 L264 114 L264 118" fill="#2a1518" opacity="0.45" />
        <path d="M233 118 L233 114 L237 111 L240 114 L240 118" fill="#2a1518" opacity="0.4" />
        {/* Fire glow behind buildings */}
        <ellipse cx="250" cy="115" rx="18" ry="8" fill="url(#ch7_villageFireGlow)">
          <animate attributeName="rx" values="18;22;18" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.7;1" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Visible flames licking above roofline */}
        <path d="M245 112 Q247 104 249 112" fill="#d06020" opacity="0.5">
          <animate attributeName="d" values="M245 112 Q247 104 249 112;M245 112 Q248 102 249 112;M245 112 Q247 104 249 112" dur="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M252 110 Q254 103 256 110" fill="#c05018" opacity="0.4">
          <animate attributeName="d" values="M252 110 Q254 103 256 110;M252 110 Q255 101 256 110;M252 110 Q254 103 256 110" dur="0.8s" repeatCount="indefinite" />
        </path>
        <path d="M248 111 Q250 106 252 111" fill="#b04515" opacity="0.35">
          <animate attributeName="d" values="M248 111 Q250 106 252 111;M248 111 Q251 104 252 111;M248 111 Q250 106 252 111" dur="0.5s" repeatCount="indefinite" />
        </path>
        {/* Thick smoke column rising from the village */}
        <path d="M250 108 Q245 80 250 40" fill="none" stroke="#3a2a20" strokeWidth="6" opacity="0.2" strokeLinecap="round">
          <animate attributeName="d" values="M250 108 Q245 80 250 40;M250 108 Q255 75 248 35;M250 108 Q245 80 250 40" dur="7s" repeatCount="indefinite" />
        </path>
        <path d="M250 108 Q247 82 252 45" fill="none" stroke="#4a3830" strokeWidth="4" opacity="0.15" strokeLinecap="round">
          <animate attributeName="d" values="M250 108 Q247 82 252 45;M250 108 Q253 78 246 40;M250 108 Q247 82 252 45" dur="8.5s" repeatCount="indefinite" />
        </path>
        {/* Smoke billowing outward at top */}
        <ellipse cx="250" cy="42" rx="20" ry="8" fill="#4a3830" opacity="0.1">
          <animate attributeName="rx" values="20;30;20" dur="9s" repeatCount="indefinite" />
          <animate attributeName="cy" values="42;38;42" dur="9s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="248" cy="60" rx="14" ry="6" fill="#4a3830" opacity="0.08">
          <animate attributeName="rx" values="14;22;14" dur="7.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Additional thick smoke layer — darker, closer to base */}
        <path d="M248 110 Q240 88 245 55" fill="none" stroke="#2a1a12" strokeWidth="8" opacity="0.12" strokeLinecap="round">
          <animate attributeName="d" values="M248 110 Q240 88 245 55;M248 110 Q258 82 242 50;M248 110 Q240 88 245 55" dur="6s" repeatCount="indefinite" />
        </path>
        {/* Wispy tendrils breaking off the main column */}
        <path d="M245 80 Q235 74 228 70" fill="none" stroke="#4a3830" strokeWidth="2" opacity="0.08">
          <animate attributeName="d" values="M245 80 Q235 74 228 70;M245 80 Q232 72 224 68;M245 80 Q235 74 228 70" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M255 75 Q265 68 272 62" fill="none" stroke="#4a3830" strokeWidth="1.5" opacity="0.06">
          <animate attributeName="d" values="M255 75 Q265 68 272 62;M255 75 Q268 65 276 58;M255 75 Q265 68 272 62" dur="6.5s" repeatCount="indefinite" />
        </path>
        {/* Low-hanging smoke haze drifting right from village */}
        <ellipse cx="280" cy="105" rx="30" ry="5" fill="#3a2a20" opacity="0.08">
          <animate attributeName="cx" values="280;310;280" dur="15s" repeatCount="indefinite" />
          <animate attributeName="rx" values="30;40;30" dur="15s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== DISTANT MOUNTAINS — far shore of the lake ===== */}
      <path d="M0 125 Q60 108 130 115 Q200 100 280 110 Q340 95 400 108 Q460 98 530 110 Q600 102 680 112 Q740 105 800 118 L800 155 L0 155 Z"
        fill="#2a2030" opacity="0.55" />
      {/* Closer range */}
      <path d="M0 132 Q100 118 200 128 Q300 115 400 125 Q500 118 600 128 Q700 120 800 130 L800 155 L0 155 Z"
        fill="#2a1a28" opacity="0.4" />

      {/* ===== DISTANT TOWN / CASTIGLIONE — church tower and farm buildings on the plain ===== */}
      <g opacity="0.4">
        {/* Church tower — tallest structure, silhouetted */}
        <rect x="390" y="102" width="6" height="22" fill="#2a1a28" />
        {/* Bell tower cupola */}
        <path d="M388 102 L393 95 L398 102 Z" fill="#2a1a28" />
        {/* Cross atop */}
        <line x1="393" y1="95" x2="393" y2="91" stroke="#2a1a28" strokeWidth="0.8" />
        <line x1="390" y1="93" x2="396" y2="93" stroke="#2a1a28" strokeWidth="0.6" />
        {/* Main church body */}
        <rect x="384" y="116" width="18" height="8" fill="#2a1a28" opacity="0.7" />
        {/* Pitched roof */}
        <path d="M383 116 L393 110 L403 116 Z" fill="#2a1a28" opacity="0.6" />
        {/* Adjacent farm buildings — cluster */}
        <rect x="405" y="118" width="10" height="6" fill="#2a1a28" opacity="0.5" />
        <rect x="416" y="119" width="8" height="5" fill="#2a1a28" opacity="0.45" />
        <rect x="375" y="119" width="9" height="5" fill="#2a1a28" opacity="0.45" />
        {/* Small chimney smoke from still-inhabited building */}
        <path d="M420 118 Q418 112 420 106" fill="none" stroke="#4a3830" strokeWidth="1" opacity="0.1">
          <animate attributeName="d" values="M420 118 Q418 112 420 106;M420 118 Q422 112 418 106;M420 118 Q418 112 420 106" dur="8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ===== SECOND DISTANT HAMLET — smaller, left of lake ===== */}
      <g opacity="0.3">
        <rect x="100" y="120" width="7" height="5" fill="#2a1a28" />
        <path d="M99 120 L104 117 L108 120 Z" fill="#2a1a28" opacity="0.8" />
        <rect x="108" y="121" width="5" height="4" fill="#2a1a28" opacity="0.6" />
        {/* Low garden wall */}
        <line x1="95" y1="125" x2="115" y2="125" stroke="#2a1a28" strokeWidth="0.6" opacity="0.4" />
      </g>

      {/* ===== DISTANT FARMSTEAD — right side with stone wall ===== */}
      <g opacity="0.28">
        <rect x="660" y="118" width="10" height="6" fill="#2a1a28" />
        <path d="M659 118 L665 114 L671 118 Z" fill="#2a1a28" opacity="0.7" />
        {/* Barn / outbuilding */}
        <rect x="672" y="120" width="8" height="4" fill="#2a1a28" opacity="0.6" />
        {/* Stone wall extending from farmstead */}
        <path d="M655 124 Q650 124 645 124" fill="none" stroke="#2a1a28" strokeWidth="0.8" opacity="0.35" />
        <path d="M680 124 Q685 124 690 124" fill="none" stroke="#2a1a28" strokeWidth="0.8" opacity="0.3" />
      </g>

      {/* ===== DISTANT MILITARY FORMATIONS — on the plain below ===== */}
      {/* French column reforming — tiny figures in block formation, left-center */}
      <g opacity="0.2">
        {/* Formation block — dense mass of soldiers */}
        <rect x="150" y="126" width="20" height="3" fill="#1a1520" rx="0.5" />
        {/* Individual figure suggestions — top row */}
        <circle cx="152" cy="125.5" r="0.5" fill="#1a1520" />
        <circle cx="155" cy="125.5" r="0.5" fill="#1a1520" />
        <circle cx="158" cy="125.5" r="0.5" fill="#1a1520" />
        <circle cx="161" cy="125.5" r="0.5" fill="#1a1520" />
        <circle cx="164" cy="125.5" r="0.5" fill="#1a1520" />
        <circle cx="167" cy="125.5" r="0.5" fill="#1a1520" />
        {/* Formation dust rising */}
        <ellipse cx="160" cy="122" rx="15" ry="4" fill="url(#ch7_dustCloud)" />
        {/* Formation flag / eagle */}
        <line x1="160" y1="126" x2="160" y2="121" stroke="#1a1520" strokeWidth="0.4" />
        <rect x="160" y="121" width="3" height="2" fill="#3a2030" opacity="0.3" />
      </g>

      {/* Austrian column retreating — right of center, more scattered */}
      <g opacity="0.18">
        <rect x="520" y="128" width="25" height="2.5" fill="#1a1520" rx="0.5" />
        <rect x="548" y="129" width="15" height="2" fill="#1a1520" rx="0.5" />
        {/* Stragglers — dots behind main body */}
        <circle cx="570" cy="130" r="0.4" fill="#1a1520" />
        <circle cx="574" cy="131" r="0.4" fill="#1a1520" />
        <circle cx="578" cy="130.5" r="0.3" fill="#1a1520" />
        {/* Retreat dust cloud — kicked up from marching */}
        <ellipse cx="540" cy="125" rx="22" ry="5" fill="url(#ch7_dustCloud)">
          <animate attributeName="rx" values="22;28;22" dur="8s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== CAVALRY CHARGE — distant riders on the plain ===== */}
      {/* Small group of French hussars pursuing retreating Austrians */}
      <g opacity="0.22">
        {/* Rider 1 — galloping silhouette */}
        <path d="M480 127 Q482 124 485 124 Q488 124 489 127 Q490 128 488 129 L482 129 Q480 128 480 127 Z" fill="#1a1520" />
        <path d="M484 124 Q483 121 484 119" fill="none" stroke="#1a1520" strokeWidth="0.8" />
        <circle cx="484" cy="118.5" r="1" fill="#1a1520" />
        {/* Rider legs / horse legs suggestion */}
        <line x1="482" y1="129" x2="481" y2="132" stroke="#1a1520" strokeWidth="0.5" />
        <line x1="487" y1="129" x2="488" y2="132" stroke="#1a1520" strokeWidth="0.5" />
        {/* Rider 2 — slightly behind */}
        <path d="M472 128 Q474 125 477 125 Q480 125 481 128 Q482 129 480 130 L474 130 Q472 129 472 128 Z" fill="#1a1520" />
        <path d="M476 125 Q475 122 476 120" fill="none" stroke="#1a1520" strokeWidth="0.7" />
        <circle cx="476" cy="119.5" r="0.9" fill="#1a1520" />
        {/* Rider 3 — distant */}
        <path d="M466 129 Q467 127 469 127 Q471 127 472 129 L470 130 L467 130 Z" fill="#1a1520" opacity="0.7" />
        {/* Cavalry dust trail */}
        <ellipse cx="475" cy="126" rx="16" ry="4" fill="url(#ch7_dustCloud)">
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* Sabre glint */}
        <line x1="484" y1="121" x2="487" y2="119" stroke="#8a7060" strokeWidth="0.3" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite" />
        </line>
      </g>

      {/* ===== ARTILLERY BATTERY — gun positions on a slight rise, center-left ===== */}
      <g opacity="0.25">
        {/* Earthwork / firing position — low mound */}
        <path d="M310 126 Q320 123 330 126 Q340 123 350 126 L348 128 L312 128 Z" fill="#1e1820" />
        {/* Gun 1 — barrel pointing right */}
        <line x1="318" y1="125" x2="324" y2="124" stroke="#1a1520" strokeWidth="1.2" />
        {/* Gun 2 */}
        <line x1="332" y1="125" x2="338" y2="124" stroke="#1a1520" strokeWidth="1.2" />
        {/* Gun 3 */}
        <line x1="345" y1="125" x2="351" y2="124" stroke="#1a1520" strokeWidth="1.1" />
        {/* Wheel suggestion for each gun */}
        <circle cx="317" cy="126.5" r="1.5" fill="none" stroke="#1a1520" strokeWidth="0.4" />
        <circle cx="331" cy="126.5" r="1.5" fill="none" stroke="#1a1520" strokeWidth="0.4" />
        <circle cx="344" cy="126.5" r="1.5" fill="none" stroke="#1a1520" strokeWidth="0.4" />
        {/* Crew figures — tiny dots around guns */}
        <circle cx="320" cy="127.5" r="0.5" fill="#1a1520" />
        <circle cx="316" cy="128" r="0.5" fill="#1a1520" />
        <circle cx="334" cy="127.5" r="0.5" fill="#1a1520" />
        <circle cx="336" cy="128" r="0.5" fill="#1a1520" />
        <circle cx="346" cy="127.5" r="0.5" fill="#1a1520" />
        {/* Lingering gun smoke — battery has recently fired */}
        <ellipse cx="330" cy="120" rx="25" ry="6" fill="url(#ch7_artillerySmoke)">
          <animate attributeName="rx" values="25;32;25" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="120;116;120" dur="6s" repeatCount="indefinite" />
        </ellipse>
        {/* Smoke drifting right from battery */}
        <ellipse cx="360" cy="118" rx="18" ry="5" fill="url(#ch7_gunSmoke)">
          <animate attributeName="cx" values="360;380;360" dur="10s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== AMMUNITION WAGON WITH HORSE TEAM — on road behind battery ===== */}
      <g opacity="0.2">
        {/* Two horses in harness — simplified silhouettes */}
        {/* Lead horse */}
        <path d="M286 128 Q289 126 292 126 Q294 126 295 128 L293 130 L288 130 Z" fill="#1a1520" />
        <path d="M290 126 Q289 124 290 123" fill="none" stroke="#1a1520" strokeWidth="0.6" />
        {/* Wheel horse */}
        <path d="M278 129 Q281 127 284 127 Q286 127 287 129 L285 131 L280 131 Z" fill="#1a1520" />
        <path d="M282 127 Q281 125 282 124" fill="none" stroke="#1a1520" strokeWidth="0.6" />
        {/* Traces / harness lines */}
        <line x1="295" y1="129" x2="300" y2="130" stroke="#1a1520" strokeWidth="0.3" />
        {/* Wagon body — small rectangle */}
        <rect x="300" y="128" width="8" height="4" fill="#1e1820" rx="0.5" />
        {/* Wagon wheels */}
        <circle cx="302" cy="133" r="1.5" fill="none" stroke="#1a1520" strokeWidth="0.4" />
        <circle cx="306" cy="133" r="1.5" fill="none" stroke="#1a1520" strokeWidth="0.4" />
        {/* Driver figure */}
        <circle cx="301" cy="127" r="0.8" fill="#1a1520" />
      </g>

      {/* ===== SECOND HORSE TEAM — supply wagon retreating on road, right ===== */}
      <g opacity="0.15">
        <path d="M615 126 Q620 126 625 126" fill="none" stroke="#1a1520" strokeWidth="0.5" />
        <path d="M610 127 Q613 125 616 125 Q618 125 619 127 L617 128 L612 128 Z" fill="#1a1520" />
        <rect x="621" y="126" width="7" height="3.5" fill="#1e1820" rx="0.5" />
        <circle cx="623" cy="130.5" r="1.2" fill="none" stroke="#1a1520" strokeWidth="0.4" />
        <circle cx="626" cy="130.5" r="1.2" fill="none" stroke="#1a1520" strokeWidth="0.4" />
      </g>

      {/* ===== CYPRESS TREES — iconic Italian silhouettes along a ridge ===== */}
      {/* Tall cypress 1 — near the church */}
      <g opacity="0.45">
        <path d="M370 125 Q371 118 372 108 Q373 100 372 92"
          fill="none" stroke="#0e1a08" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="372" cy="102" rx="3" ry="14" fill="url(#ch7_cypressFill)" />
      </g>
      {/* Tall cypress 2 — pair flanking a road */}
      <g opacity="0.4">
        <path d="M430 124 Q431 116 432 106 Q432 98 431 90"
          fill="none" stroke="#0e1a08" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="431" cy="102" rx="2.5" ry="13" fill="url(#ch7_cypressFill)" />
      </g>
      {/* Cypress 3 — smaller, distant right */}
      <g opacity="0.3">
        <path d="M640 122 Q641 116 641 108"
          fill="none" stroke="#0e1a08" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="641" cy="112" rx="2" ry="8" fill="url(#ch7_cypressFill)" />
      </g>
      {/* Row of small cypresses along a distant road — left */}
      <g opacity="0.22">
        <ellipse cx="130" cy="118" rx="1.5" ry="6" fill="url(#ch7_cypressFill)" />
        <ellipse cx="138" cy="117" rx="1.5" ry="6" fill="url(#ch7_cypressFill)" />
        <ellipse cx="146" cy="118" rx="1.5" ry="5.5" fill="url(#ch7_cypressFill)" />
        <ellipse cx="154" cy="118.5" rx="1.5" ry="5" fill="url(#ch7_cypressFill)" />
      </g>

      {/* ===== DRY WHEAT FIELDS — patches on the plain below ===== */}
      {/* Large parched wheat field — center-left */}
      <path d="M140 130 Q180 128 220 131 Q240 133 260 130 L258 136 L142 136 Z"
        fill="url(#ch7_wheatField)" opacity="0.5" />
      {/* Wheat stubble texture */}
      <path d="M150 132 Q152 130 154 132" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.15" />
      <path d="M170 131 Q172 129 174 131" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.12" />
      <path d="M190 132 Q192 130 194 132" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.12" />
      <path d="M210 131 Q212 129 214 131" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.1" />
      <path d="M230 132 Q232 130 234 132" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.1" />
      {/* Smaller wheat patch — right of center */}
      <path d="M550 130 Q575 128 600 131 L598 135 L552 135 Z"
        fill="url(#ch7_wheatField)" opacity="0.35" />

      {/* ===== DUSTY ROAD — winding across the plain ===== */}
      {/* Main road from Castiglione — snaking through the landscape */}
      <path d="M0 132 Q50 130 120 133 Q200 136 300 131 Q380 127 400 130 Q440 134 500 132 Q580 128 650 133 Q720 136 800 132"
        fill="none" stroke="#3a3020" strokeWidth="1.5" opacity="0.12" />
      {/* Parallel road edge — giving width */}
      <path d="M0 134 Q50 132 120 135 Q200 138 300 133 Q380 129 400 132 Q440 136 500 134 Q580 130 650 135 Q720 138 800 134"
        fill="none" stroke="#3a3020" strokeWidth="0.8" opacity="0.08" />
      {/* Dust hanging over the road from troop movements */}
      <ellipse cx="200" cy="130" rx="40" ry="4" fill="url(#ch7_dustCloud)" opacity="0.5">
        <animate attributeName="rx" values="40;48;40" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="130" rx="30" ry="3.5" fill="url(#ch7_dustCloud)" opacity="0.4">
        <animate attributeName="rx" values="30;36;30" dur="10s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== HEDGEROWS — field boundaries on the plain ===== */}
      <path d="M270 133 Q275 131 280 133 Q285 131 290 133" fill="none" stroke="#1a2010" strokeWidth="1.2" opacity="0.2" />
      <path d="M440 132 Q448 130 456 132 Q462 130 468 132" fill="none" stroke="#1a2010" strokeWidth="1" opacity="0.18" />
      <path d="M600 133 Q606 131 612 133" fill="none" stroke="#1a2010" strokeWidth="0.8" opacity="0.15" />

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

      {/* ===== BRIGHT SUNSET REFLECTION STREAK ON LAKE ===== */}
      {/* Central golden-orange sun path cutting across the water */}
      <path d="M320 145 Q370 140 420 143 Q470 140 520 145 L515 180 L325 180 Z"
        fill="url(#ch7_sunsetStreak)">
        <animate attributeName="opacity" values="1;0.7;1" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Bright highlight core of the reflection */}
      <ellipse cx="420" cy="152" rx="50" ry="3" fill="#e09838" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.12;0.2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="50;55;50" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="157" rx="35" ry="2" fill="#d08830" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Glittering specks in the reflection path */}
      <circle cx="385" cy="150" r="0.8" fill="#e0a040" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="440" cy="148" r="0.6" fill="#e0a040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.05;0.25" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="410" cy="155" r="0.7" fill="#d09838" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="460" cy="153" r="0.5" fill="#e0a040" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.04;0.2" dur="1.3s" repeatCount="indefinite" />
      </circle>

      {/* ===== DISTANT BOATS ON LAKE GARDA ===== */}
      {/* Boat 1 — small fishing boat silhouette, center-left */}
      <g opacity="0.3">
        <path d="M200 168 Q205 165 215 165 Q225 165 230 168 L226 170 L204 170 Z" fill="#1a1520" />
        {/* Mast */}
        <line x1="215" y1="165" x2="215" y2="156" stroke="#1a1520" strokeWidth="0.6" />
        {/* Small sail */}
        <path d="M215 157 L221 163 L215 163 Z" fill="#2a2530" opacity="0.6" />
        <animateTransform attributeName="transform" type="translate" values="0 0;3 0.5;0 0" dur="8s" repeatCount="indefinite" />
      </g>
      {/* Boat 2 — rowboat silhouette, center */}
      <g opacity="0.22">
        <path d="M420 178 Q424 176 430 176 Q436 176 440 178 L437 179 L423 179 Z" fill="#1a1520" />
        {/* Figure sitting in boat */}
        <ellipse cx="430" cy="175" rx="2" ry="1.5" fill="#1a1520" />
        <animateTransform attributeName="transform" type="translate" values="0 0;-2 0.3;0 0" dur="10s" repeatCount="indefinite" />
      </g>
      {/* Boat 3 — distant supply boat, right side */}
      <g opacity="0.18">
        <path d="M600 172 Q604 170 612 170 Q620 170 624 172 L621 173 L603 173 Z" fill="#1a1520" />
        {/* Short mast */}
        <line x1="612" y1="170" x2="612" y2="164" stroke="#1a1520" strokeWidth="0.5" />
        <animateTransform attributeName="transform" type="translate" values="0 0;2 -0.3;0 0" dur="12s" repeatCount="indefinite" />
      </g>

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

      {/* ===== LAKE GARDA SHORELINE DETAIL ===== */}
      {/* Wet sand strip along waterline */}
      <path d="M0 212 Q80 207 160 213 Q280 219 400 211 Q520 206 640 213 Q720 208 800 216 L800 220 L0 220 Z"
        fill="url(#ch7_shoreSand)" opacity="0.35" />
      {/* Small lapping waves — animated */}
      <path d="M30 210 Q45 208 60 210 Q75 212 90 210" fill="none" stroke="#4a4038" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M30 210 Q45 208 60 210 Q75 212 90 210;M30 210 Q45 212 60 210 Q75 208 90 210;M30 210 Q45 208 60 210 Q75 212 90 210" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M200 213 Q215 211 230 213 Q245 215 260 213" fill="none" stroke="#4a4038" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="d" values="M200 213 Q215 211 230 213 Q245 215 260 213;M200 213 Q215 215 230 213 Q245 211 260 213;M200 213 Q215 211 230 213 Q245 215 260 213" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M450 209 Q465 207 480 209 Q495 211 510 209" fill="none" stroke="#4a4038" strokeWidth="0.4" opacity="0.1">
        <animate attributeName="d" values="M450 209 Q465 207 480 209 Q495 211 510 209;M450 209 Q465 211 480 209 Q495 207 510 209;M450 209 Q465 207 480 209 Q495 211 510 209" dur="2.8s" repeatCount="indefinite" />
      </path>
      <path d="M650 214 Q665 212 680 214 Q695 216 710 214" fill="none" stroke="#4a4038" strokeWidth="0.4" opacity="0.1">
        <animate attributeName="d" values="M650 214 Q665 212 680 214 Q695 216 710 214;M650 214 Q665 216 680 214 Q695 212 710 214;M650 214 Q665 212 680 214 Q695 216 710 214" dur="3.2s" repeatCount="indefinite" />
      </path>
      {/* Shore rocks — small boulders at the water's edge */}
      <ellipse cx="120" cy="212" rx="4" ry="2.5" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.4" opacity="0.5" />
      <ellipse cx="125" cy="214" rx="3" ry="2" fill="#1a1810" opacity="0.4" />
      <ellipse cx="340" cy="215" rx="3.5" ry="2" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.3" opacity="0.45" />
      <ellipse cx="560" cy="210" rx="3" ry="1.8" fill="#1e1a12" opacity="0.4" />
      <ellipse cx="565" cy="212" rx="2" ry="1.5" fill="#1a1810" opacity="0.35" />
      <ellipse cx="730" cy="215" rx="4" ry="2.2" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.3" opacity="0.42" />
      {/* Foam line — thin white froth where waves meet shore */}
      <path d="M25 211 Q40 209 55 211" fill="none" stroke="#5a5548" strokeWidth="0.3" opacity="0.1" />
      <path d="M195 214 Q210 212 225 214" fill="none" stroke="#5a5548" strokeWidth="0.3" opacity="0.08" />
      <path d="M445 210 Q460 208 475 210" fill="none" stroke="#5a5548" strokeWidth="0.3" opacity="0.08" />

      {/* ===== HILLSIDE — rocky Mediterranean terrain ===== */}
      <path d="M0 215 Q100 208 200 218 Q350 225 500 212 Q600 205 700 215 Q750 218 800 210 L800 400 L0 400 Z"
        fill="url(#ch7_hill)" />

      {/* ===== DUSTY TRACK — winding up the hillside ===== */}
      <path d="M0 270 Q80 260 160 268 Q240 280 320 272 Q400 260 480 265 Q560 275 640 268 Q720 258 800 262"
        fill="none" stroke="#2e2818" strokeWidth="2.5" opacity="0.18" />
      <path d="M0 273 Q80 263 160 271 Q240 283 320 275 Q400 263 480 268 Q560 278 640 271 Q720 261 800 265"
        fill="none" stroke="#2e2818" strokeWidth="1.5" opacity="0.12" />
      {/* Cart ruts in the dusty track */}
      <path d="M80 264 Q120 270 160 268" fill="none" stroke="#252012" strokeWidth="0.6" opacity="0.1" />
      <path d="M320 273 Q360 265 400 262" fill="none" stroke="#252012" strokeWidth="0.6" opacity="0.08" />

      {/* ===== STONE WALL REMNANTS — running along hillside ===== */}
      {/* Low dry-stone wall — left section */}
      <g opacity="0.5">
        <path d="M230 252 L232 248 L238 248 L242 246 L248 248 L254 246 L258 248 L260 252"
          fill="#2a2518" stroke="#3a3528" strokeWidth="0.5" />
        {/* Mortar lines */}
        <line x1="238" y1="248" x2="238" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        <line x1="248" y1="248" x2="248" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        <line x1="234" y1="250" x2="256" y2="250" stroke="#3a3528" strokeWidth="0.3" opacity="0.25" />
        {/* Collapsed section — rubble pile */}
        <ellipse cx="264" cy="252" rx="4" ry="2" fill="#2a2518" opacity="0.4" />
        <ellipse cx="268" cy="253" rx="3" ry="1.5" fill="#2a2518" opacity="0.35" />
      </g>
      {/* Stone wall — right section, better preserved */}
      <g opacity="0.45">
        <path d="M570 250 L572 246 L578 245 L584 246 L590 244 L596 246 L600 248 L600 252 L570 252 Z"
          fill="#2a2518" stroke="#3a3528" strokeWidth="0.5" />
        <line x1="578" y1="245" x2="578" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        <line x1="590" y1="244" x2="590" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        <line x1="574" y1="249" x2="598" y2="249" stroke="#3a3528" strokeWidth="0.3" opacity="0.25" />
      </g>

      {/* ===== DRY SUMMER GRASS TEXTURE — scattered clumps ===== */}
      {/* Parched grass tufts across the hillside */}
      <path d="M200 238 Q201 232 202 238" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.2" />
      <path d="M203 240 Q204 234 205 240" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.18" />
      <path d="M320 235 Q321 229 322 235" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.2" />
      <path d="M323 237 Q324 231 325 237" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.16" />
      <path d="M450 230 Q451 224 452 230" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.18" />
      <path d="M453 232 Q454 226 455 232" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.15" />
      <path d="M540 235 Q541 229 542 235" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.17" />
      <path d="M650 232 Q651 226 652 232" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.16" />
      <path d="M653 234 Q654 228 655 234" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.14" />
      {/* Dry grass patches — broader areas */}
      <ellipse cx="280" cy="242" rx="18" ry="3" fill="#2a2812" opacity="0.12" />
      <ellipse cx="460" cy="236" rx="15" ry="2.5" fill="#2a2812" opacity="0.1" />
      <ellipse cx="620" cy="240" rx="20" ry="3" fill="#2a2812" opacity="0.11" />

      {/* ===== EXPOSED EARTH / DUSTY PATCHES — scorched hillside ===== */}
      <ellipse cx="350" cy="258" rx="12" ry="4" fill="#1e1a10" opacity="0.15" />
      <ellipse cx="500" cy="250" rx="10" ry="3.5" fill="#1e1a10" opacity="0.12" />
      <ellipse cx="180" cy="262" rx="8" ry="3" fill="#1e1a10" opacity="0.13" />

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

      {/* ===== LARGE GNARLED OLIVE TREE — framing left edge ===== */}
      <g>
        {/* Thick twisted trunk */}
        <path d="M18 400 Q15 370 20 345 Q22 330 18 315 Q16 300 22 285 Q25 275 20 262"
          fill="none" stroke="#2a2215" strokeWidth="5" strokeLinecap="round" />
        {/* Trunk texture — gnarled twist */}
        <path d="M16 380 Q22 360 18 340 Q14 325 20 305"
          fill="none" stroke="#222012" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
        {/* Main branch — reaching right */}
        <path d="M20 285 Q35 278 55 272 Q70 268 82 265"
          fill="none" stroke="#252015" strokeWidth="3" strokeLinecap="round" />
        {/* Upper branch */}
        <path d="M20 275 Q28 260 40 250 Q48 244 55 240"
          fill="none" stroke="#252015" strokeWidth="2.5" strokeLinecap="round" />
        {/* Small drooping branch */}
        <path d="M20 300 Q10 295 5 300 Q0 305 -5 310"
          fill="none" stroke="#252015" strokeWidth="1.5" strokeLinecap="round" />
        {/* Foliage clusters — silvery-green Mediterranean olive */}
        <ellipse cx="55" cy="262" rx="22" ry="12" fill="url(#ch7_oliveFoliage)" />
        <ellipse cx="78" cy="258" rx="16" ry="10" fill="url(#ch7_oliveFoliage)" />
        <ellipse cx="42" cy="248" rx="18" ry="10" fill="url(#ch7_oliveFoliage)" />
        <ellipse cx="55" cy="242" rx="14" ry="8" fill="#1a2510" opacity="0.45" />
        <ellipse cx="30" cy="270" rx="12" ry="7" fill="url(#ch7_oliveFoliage)" />
        {/* A few individual leaf clusters at branch tips */}
        <ellipse cx="85" cy="263" rx="6" ry="4" fill="#1e2a12" opacity="0.4" />
        <ellipse cx="5" cy="305" rx="8" ry="5" fill="#1a2510" opacity="0.35" />
        {/* Thicker trunk bark texture — vertical ridges */}
        <path d="M20 395 Q17 375 21 350 Q23 335 19 318" fill="none" stroke="#1e1a0e" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
        <path d="M22 390 Q19 365 23 342 Q25 328 21 310" fill="none" stroke="#2e2818" strokeWidth="1" opacity="0.25" strokeLinecap="round" />
        {/* Exposed root at base */}
        <path d="M18 398 Q12 395 5 398 Q0 400 -3 400" fill="none" stroke="#2a2215" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        <path d="M20 400 Q28 396 35 400" fill="none" stroke="#2a2215" strokeWidth="1.8" opacity="0.45" strokeLinecap="round" />
        {/* Additional mid-branch — reaching up-right */}
        <path d="M22 295 Q30 288 42 282 Q50 278 58 276" fill="none" stroke="#252015" strokeWidth="1.8" strokeLinecap="round" />
        {/* Small twig off main branch */}
        <path d="M60 270 Q65 265 68 260" fill="none" stroke="#252015" strokeWidth="0.8" strokeLinecap="round" />
        <ellipse cx="70" cy="258" rx="5" ry="3.5" fill="#1e2a12" opacity="0.35" />
        {/* Additional foliage depth — darker underlayer */}
        <ellipse cx="50" cy="258" rx="20" ry="10" fill="#121a08" opacity="0.3" />
        <ellipse cx="72" cy="254" rx="12" ry="7" fill="#121a08" opacity="0.25" />
      </g>

      {/* ===== GRAPE VINE CLIMBING RUINED WALL ===== */}
      <g opacity="0.7">
        {/* Ruined stone wall — low broken wall fragment */}
        <path d="M685 272 L685 250 L688 248 L695 248 L698 250 L702 248 L708 250 L708 270"
          fill="#2a2518" stroke="#3a3528" strokeWidth="0.6" />
        {/* Individual stones visible */}
        <line x1="688" y1="255" x2="705" y2="255" stroke="#3a3528" strokeWidth="0.4" opacity="0.4" />
        <line x1="688" y1="261" x2="706" y2="261" stroke="#3a3528" strokeWidth="0.4" opacity="0.35" />
        <line x1="696" y1="248" x2="696" y2="261" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        {/* Vine stem climbing the wall */}
        <path d="M690 272 Q688 265 692 258 Q695 252 693 248 Q692 244 695 238"
          fill="none" stroke="#2a3518" strokeWidth="1" />
        {/* Vine tendrils curling */}
        <path d="M692 258 Q698 255 702 258" fill="none" stroke="#2a3518" strokeWidth="0.6" />
        <path d="M693 250 Q686 248 684 252" fill="none" stroke="#2a3518" strokeWidth="0.5" />
        <path d="M695 244 Q700 242 703 245" fill="none" stroke="#2a3518" strokeWidth="0.5" />
        <path d="M695 238 Q692 234 690 236" fill="none" stroke="#2a3518" strokeWidth="0.5" />
        {/* Grape leaf clusters */}
        <ellipse cx="700" cy="256" rx="5" ry="4" fill="#1e2a12" opacity="0.5" />
        <ellipse cx="684" cy="250" rx="4" ry="3.5" fill="#1e2a12" opacity="0.45" />
        <ellipse cx="702" cy="244" rx="4" ry="3" fill="#1e2a12" opacity="0.4" />
        <ellipse cx="692" cy="236" rx="5" ry="3.5" fill="#1e2a12" opacity="0.45" />
        {/* Small grape clusters hanging — dark purple-black */}
        <ellipse cx="700" cy="260" rx="2" ry="2.5" fill="#1a1020" opacity="0.4" />
        <ellipse cx="686" cy="253" rx="1.5" ry="2" fill="#1a1020" opacity="0.35" />
        <ellipse cx="694" cy="240" rx="1.8" ry="2.2" fill="#1a1020" opacity="0.35" />
      </g>

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

      {/* ===== AMMUNITION WAGON — near the cannon wheel ===== */}
      <g opacity="0.65">
        {/* Wagon body — rectangular box */}
        <rect x="218" y="282" width="28" height="14" fill="url(#ch7_wagonWood)" stroke="#2a2015" strokeWidth="0.8" rx="1" />
        {/* Lid / top planks */}
        <line x1="220" y1="282" x2="220" y2="296" stroke="#3a3020" strokeWidth="0.4" opacity="0.4" />
        <line x1="228" y1="282" x2="228" y2="296" stroke="#3a3020" strokeWidth="0.4" opacity="0.4" />
        <line x1="236" y1="282" x2="236" y2="296" stroke="#3a3020" strokeWidth="0.4" opacity="0.4" />
        {/* Metal banding */}
        <line x1="218" y1="288" x2="246" y2="288" stroke="#3a3525" strokeWidth="0.6" opacity="0.45" />
        {/* Left wheel */}
        <circle cx="222" cy="298" r="5" fill="none" stroke="#2a2015" strokeWidth="1.5" />
        <circle cx="222" cy="298" r="1" fill="#2a2015" opacity="0.5" />
        <line x1="222" y1="293" x2="222" y2="303" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        <line x1="217" y1="298" x2="227" y2="298" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        {/* Right wheel */}
        <circle cx="242" cy="298" r="5" fill="none" stroke="#2a2015" strokeWidth="1.5" />
        <circle cx="242" cy="298" r="1" fill="#2a2015" opacity="0.5" />
        <line x1="242" y1="293" x2="242" y2="303" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        <line x1="237" y1="298" x2="247" y2="298" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        {/* Tongue / hitch bar extending forward */}
        <line x1="218" y1="290" x2="208" y2="292" stroke="#2a2015" strokeWidth="1.2" opacity="0.5" />
        {/* A few cartridge boxes visible on top */}
        <rect x="220" y="280" width="5" height="3" fill="#1a1510" opacity="0.4" rx="0.5" />
        <rect x="227" y="279" width="5" height="3" fill="#1a1510" opacity="0.35" rx="0.5" />
        <rect x="234" y="280" width="5" height="3" fill="#1a1510" opacity="0.3" rx="0.5" />
      </g>

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

      {/* ===== SCATTERED GROUND DEBRIS — cartridge cases, broken equipment ===== */}
      {/* Spent paper cartridge cases — small torn rolls */}
      <rect x="295" y="278" width="3" height="1.5" fill="#3a3520" opacity="0.3" rx="0.5" transform="rotate(25 296 279)" />
      <rect x="302" y="280" width="2.5" height="1.2" fill="#3a3520" opacity="0.25" rx="0.5" transform="rotate(-10 303 281)" />
      <rect x="310" y="282" width="3" height="1.5" fill="#3a3520" opacity="0.28" rx="0.5" transform="rotate(45 311 283)" />
      <rect x="425" y="298" width="2.5" height="1.2" fill="#3a3520" opacity="0.22" rx="0.5" transform="rotate(15 426 299)" />
      <rect x="435" y="300" width="3" height="1.5" fill="#3a3520" opacity="0.2" rx="0.5" transform="rotate(-30 436 301)" />
      {/* Broken musket stock fragment */}
      <line x1="350" y1="289" x2="365" y2="292" stroke="#2a2015" strokeWidth="1.8" opacity="0.35" />
      <line x1="365" y1="292" x2="368" y2="291" stroke="#2a2015" strokeWidth="1" opacity="0.25" />
      {/* Bent bayonet */}
      <path d="M490 275 L496 272 Q498 270 497 268" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.3" />
      {/* Torn cloth fragment */}
      <path d="M520 280 Q523 278 526 280 Q524 282 520 280" fill="#2a2820" opacity="0.25" />
      {/* Dented tin cup */}
      <ellipse cx="580" cy="278" rx="3" ry="2" fill="#2a2820" stroke="#3a3525" strokeWidth="0.4" opacity="0.35" />
      {/* Loose musket ball */}
      <circle cx="445" cy="275" r="1" fill="#3a3525" opacity="0.3" />
      <circle cx="455" cy="278" r="0.8" fill="#3a3525" opacity="0.25" />
      {/* Torn paper — orders or letter */}
      <path d="M370 274 L376 274 L377 278 L369 278 Z" fill="#3a3828" opacity="0.2" transform="rotate(8 373 276)" />
      {/* Broken ramrod */}
      <line x1="468" y1="281" x2="485" y2="279" stroke="#2a2015" strokeWidth="0.7" opacity="0.25" />

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

      {/* ===== OFFICER'S HORSE — tethered near the soldiers ===== */}
      <g opacity="0.72">
        {/* Horse body silhouette — standing, slightly drooping head (exhausted) */}
        {/* Body barrel */}
        <path d="M510 238 Q520 232 535 232 Q548 232 555 238 Q558 240 555 244 Q548 248 535 248 Q520 248 512 244 Q509 242 510 238 Z"
          fill="url(#ch7_horseFill)" />
        {/* Neck — arching down (tired, head low) */}
        <path d="M510 238 Q505 232 500 228 Q496 225 492 224"
          fill="none" stroke="#181510" strokeWidth="4" strokeLinecap="round" />
        {/* Head — drooping low */}
        <path d="M492 224 Q488 224 486 226 Q484 228 486 230 Q489 232 492 230 Q494 228 492 224 Z"
          fill="#181510" />
        {/* Ears */}
        <path d="M490 223 L488 219 L491 221" fill="#181510" />
        <path d="M492 222 L491 218 L494 220" fill="#181510" />
        {/* Front legs */}
        <line x1="518" y1="246" x2="517" y2="268" stroke="#151210" strokeWidth="2.2" />
        <line x1="525" y1="247" x2="524" y2="268" stroke="#151210" strokeWidth="2.2" />
        {/* Rear legs */}
        <line x1="545" y1="246" x2="546" y2="268" stroke="#151210" strokeWidth="2.2" />
        <line x1="550" y1="245" x2="552" y2="268" stroke="#151210" strokeWidth="2.2" />
        {/* Hooves — small blocks */}
        <rect x="515" y="267" width="4" height="2" fill="#121010" rx="0.5" />
        <rect x="522" y="267" width="4" height="2" fill="#121010" rx="0.5" />
        <rect x="544" y="267" width="4" height="2" fill="#121010" rx="0.5" />
        <rect x="550" y="267" width="4" height="2" fill="#121010" rx="0.5" />
        {/* Tail — drooping */}
        <path d="M558 238 Q562 240 564 248 Q565 255 562 262" fill="none" stroke="#151210" strokeWidth="1.5" />
        {/* Saddle hint */}
        <path d="M525 234 Q530 230 540 230 Q548 230 550 234" fill="#1a1510" opacity="0.5" />
        {/* Tether rope — tied to a stake in the ground */}
        <path d="M494 228 Q490 235 480 248 Q475 258 472 265" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.45" strokeDasharray="2 1" />
        {/* Stake in ground */}
        <line x1="472" y1="262" x2="472" y2="272" stroke="#2a2015" strokeWidth="1.2" opacity="0.4" />
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

      {/* ===== ADDITIONAL EXHAUSTED SOLDIERS ===== */}

      {/* Soldier 7 — slumped forward on knees, arms hanging limp, near left rocks */}
      <path d="M145 280 Q143 272 145 265 Q146 262 148 265 L149 272 Q150 277 149 284 L145 284 Z"
        fill="#151510" opacity="0.72" />
      <circle cx="146" cy="260" r="3.8" fill="#151510" opacity="0.72" />
      {/* Arms hanging down limply */}
      <path d="M142 268 Q140 275 141 282" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.55" />
      <path d="M150 268 Q152 275 151 282" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.55" />
      {/* Shako fallen off beside him */}
      <path d="M135 284 Q137 280 142 280 Q144 283 142 285 Z" fill="#1a1510" opacity="0.4" />

      {/* Soldier 8 — on his back, one knee up, staring at the red sky */}
      <path d="M300 298 Q310 296 325 298 Q335 296 340 298" fill="none" stroke="#151510" strokeWidth="3.5" opacity="0.68" />
      <circle cx="295" cy="297" r="4" fill="#151510" opacity="0.68" />
      {/* One knee raised */}
      <path d="M320 296 Q322 288 325 295" fill="none" stroke="#151510" strokeWidth="2.5" opacity="0.58" />
      {/* Arm across chest */}
      <path d="M302 296 Q308 293 315 296" fill="none" stroke="#151510" strokeWidth="1.8" opacity="0.5" />
      {/* Other arm flung out */}
      <path d="M298 300 Q290 302 284 305" fill="none" stroke="#151510" strokeWidth="1.8" opacity="0.48" />

      {/* Soldier 9 — sitting with back to viewer, hunched, near right edge */}
      <path d="M720 268 Q718 260 720 254 Q721 250 723 254 L725 260 Q726 266 725 272 L720 272 Z"
        fill="#151510" opacity="0.7" />
      <circle cx="722" cy="249" r="4.2" fill="#151510" opacity="0.7" />
      {/* Broad shoulders, back visible */}
      <path d="M716 256 Q722 252 728 256" fill="none" stroke="#151510" strokeWidth="2.5" opacity="0.55" />
      {/* Canteen dangling from hand */}
      <ellipse cx="728" cy="270" rx="2.5" ry="3" fill="#1e1a10" opacity="0.35" />
      <path d="M726 264 Q728 267 728 270" fill="none" stroke="#2a2015" strokeWidth="0.5" opacity="0.3" />

      {/* ===== MAKESHIFT GRAVE MARKER — wooden cross with kepi ===== */}
      <g opacity="0.65">
        {/* Vertical post */}
        <line x1="175" y1="282" x2="175" y2="258" stroke="url(#ch7_graveWood)" strokeWidth="2.2" strokeLinecap="round" />
        {/* Horizontal crossbar */}
        <line x1="167" y1="264" x2="183" y2="264" stroke="url(#ch7_graveWood)" strokeWidth="1.8" strokeLinecap="round" />
        {/* Kepi draped on the cross */}
        <path d="M171 262 Q175 256 179 262 Q180 264 178 265 L172 265 Q170 264 171 262 Z" fill="#1a1520" opacity="0.55" />
        {/* Kepi visor */}
        <path d="M170 264 Q175 266 180 264" fill="none" stroke="#1a1520" strokeWidth="1" opacity="0.45" />
        {/* Cockade on kepi */}
        <circle cx="175" cy="260" r="1" fill="#3a2020" opacity="0.35" />
        {/* Small mound of earth at base */}
        <ellipse cx="175" cy="284" rx="10" ry="3" fill="#1e1a12" opacity="0.3" />
        {/* Wilted wildflower placed at grave */}
        <path d="M179 282 Q181 278 180 275" fill="none" stroke="#2a3518" strokeWidth="0.5" opacity="0.3" />
        <circle cx="180" cy="274" r="1.2" fill="#4a2025" opacity="0.25" />
      </g>

      {/* ===== DROPPED MUSKET — lying on the ground ===== */}
      <g opacity="0.5">
        {/* Barrel */}
        <line x1="305" y1="308" x2="340" y2="304" stroke="#2a2518" strokeWidth="1.8" />
        {/* Stock */}
        <path d="M340 304 Q345 303 350 306 Q352 308 350 310 L345 309 Z" fill="#2a2015" />
        {/* Lock plate glint */}
        <line x1="336" y1="304" x2="340" y2="303" stroke="#4a4535" strokeWidth="0.6" opacity="0.3" />
        {/* Bayonet still attached */}
        <line x1="305" y1="308" x2="296" y2="310" stroke="#4a4540" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* ===== TORN KNAPSACK — spilling contents ===== */}
      <g opacity="0.5">
        {/* Knapsack body — collapsed on its side */}
        <rect x="480" y="296" width="12" height="9" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.5" rx="1" transform="rotate(-12 486 300)" />
        {/* Flap hanging open */}
        <path d="M480 296 Q478 292 476 290" fill="none" stroke="#2a2518" strokeWidth="0.8" />
        {/* Strap trailing */}
        <path d="M492 300 Q498 302 504 300" fill="none" stroke="#2a2015" strokeWidth="0.6" />
        {/* Spilled items — a crust of bread, button, scrap of paper */}
        <ellipse cx="476" cy="302" rx="2" ry="1.5" fill="#3a3520" opacity="0.3" />
        <circle cx="473" cy="300" r="0.7" fill="#4a4535" opacity="0.25" />
        <rect x="470" y="303" width="3" height="2" fill="#3a3828" opacity="0.2" transform="rotate(20 471 304)" />
      </g>

      {/* ===== EMPTY CANTEEN — abandoned on ground ===== */}
      <ellipse cx="555" cy="300" rx="4" ry="5" fill="#1e1a10" stroke="#2a2518" strokeWidth="0.5" opacity="0.45" transform="rotate(25 555 300)" />
      {/* Cork missing — open mouth */}
      <circle cx="555" cy="295" r="1" fill="#0e0c08" opacity="0.4" />
      {/* Leather strap */}
      <path d="M552 298 Q548 295 545 298" fill="none" stroke="#2a2015" strokeWidth="0.5" opacity="0.35" />

      {/* ===== DISCARDED CARTRIDGE PAPERS — scattered cluster ===== */}
      <rect x="580" y="305" width="2.5" height="1.2" fill="#3a3520" opacity="0.22" rx="0.4" transform="rotate(35 581 306)" />
      <rect x="586" y="303" width="3" height="1.5" fill="#3a3520" opacity="0.2" rx="0.4" transform="rotate(-20 587 304)" />
      <rect x="575" y="308" width="2" height="1" fill="#3a3520" opacity="0.18" rx="0.4" transform="rotate(55 576 309)" />
      <rect x="590" y="306" width="2.5" height="1.2" fill="#3a3520" opacity="0.2" rx="0.4" transform="rotate(10 591 307)" />
      <rect x="583" y="310" width="3" height="1.5" fill="#3a3520" opacity="0.16" rx="0.4" transform="rotate(-40 584 311)" />

      {/* ===== BROKEN RAMRODS — snapped, discarded ===== */}
      <line x1="290" y1="306" x2="300" y2="304" stroke="#2a2015" strokeWidth="0.8" opacity="0.28" />
      <line x1="302" y1="305" x2="306" y2="308" stroke="#2a2015" strokeWidth="0.7" opacity="0.22" />

      {/* ===== BROKEN CART/WAGON WHEEL — lying flat on the ground ===== */}
      <g opacity="0.55" transform="rotate(-8 660 320)">
        {/* Wheel rim — flat perspective ellipse */}
        <ellipse cx="660" cy="320" rx="18" ry="6" fill="none" stroke="#2a2015" strokeWidth="2" />
        {/* Hub */}
        <ellipse cx="660" cy="320" rx="3" ry="1.2" fill="#2a2015" opacity="0.5" />
        {/* Spokes — radial, foreshortened */}
        <line x1="660" y1="314" x2="660" y2="326" stroke="#2a2015" strokeWidth="0.8" opacity="0.4" />
        <line x1="642" y1="320" x2="678" y2="320" stroke="#2a2015" strokeWidth="0.8" opacity="0.4" />
        <line x1="647" y1="316" x2="673" y2="324" stroke="#2a2015" strokeWidth="0.7" opacity="0.35" />
        <line x1="647" y1="324" x2="673" y2="316" stroke="#2a2015" strokeWidth="0.7" opacity="0.35" />
        {/* Broken spoke — snapped, jutting out */}
        <line x1="670" y1="318" x2="680" y2="316" stroke="#2a2015" strokeWidth="0.9" opacity="0.3" />
        {/* Iron tire fragment detached */}
        <path d="M676 322 Q680 324 682 326" fill="none" stroke="#3a3020" strokeWidth="1" opacity="0.25" />
      </g>

      {/* ===== SECOND EMBER PILE — dying, low glow (right of center) ===== */}
      {/* Ember glow on ground */}
      <ellipse cx="590" cy="315" rx="15" ry="5" fill="url(#ch7_emberPileGlow)">
        <animate attributeName="rx" values="15;18;15" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Charred wood remnants */}
      <line x1="583" y1="314" x2="596" y2="312" stroke="#1a1510" strokeWidth="1.5" opacity="0.45" />
      <line x1="586" y1="316" x2="594" y2="318" stroke="#1a1510" strokeWidth="1.2" opacity="0.4" />
      {/* Glowing embers — faint orange specks */}
      <circle cx="588" cy="313" r="0.8" fill="#c06025" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.2;0.45" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="592" cy="315" r="0.6" fill="#b05020" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="586" cy="316" r="0.5" fill="#c06025" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* Faint wisp of smoke from ember pile */}
      <path d="M590 310 Q588 300 590 288" fill="none" stroke="#5a4a3a" strokeWidth="0.8" opacity="0.05">
        <animate attributeName="d" values="M590 310 Q588 300 590 288;M590 310 Q592 300 588 288;M590 310 Q588 300 590 288" dur="7s" repeatCount="indefinite" />
      </path>

      {/* ===== MORE MEDITERRANEAN SCRUB VEGETATION ===== */}
      {/* Low rosemary bush — foreground left */}
      <ellipse cx="70" cy="345" rx="10" ry="5" fill="#1a2010" opacity="0.5" />
      <ellipse cx="78" cy="343" rx="6" ry="3.5" fill="#1e2512" opacity="0.4" />
      {/* Dry thyme clump — center-right */}
      <ellipse cx="520" cy="325" rx="7" ry="3.5" fill="#222a14" opacity="0.4" />
      <path d="M518 323 Q520 318 522 323" fill="none" stroke="#2a3518" strokeWidth="0.5" opacity="0.3" />
      <path d="M521 324 Q523 319 525 324" fill="none" stroke="#2a3518" strokeWidth="0.5" opacity="0.25" />
      {/* Dried lavender stalks — foreground */}
      <path d="M410 335 Q411 328 412 322" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.3" />
      <path d="M413 336 Q414 330 415 325" fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="412" cy="321" rx="1.5" ry="2" fill="#2a2030" opacity="0.2" />
      <ellipse cx="415" cy="324" rx="1.5" ry="2" fill="#2a2030" opacity="0.18" />
      {/* Scrubby myrtle — far right foreground */}
      <ellipse cx="750" cy="340" rx="12" ry="5" fill="#1a2010" opacity="0.45" />
      <ellipse cx="758" cy="338" rx="7" ry="4" fill="#1e2512" opacity="0.35" />

      {/* ===== MORE FOREGROUND ROCKS ===== */}
      {/* Flat stone — near grave marker */}
      <path d="M190 290 Q196 286 205 288 Q210 290 206 294 L192 293 Z" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.4" opacity="0.5" />
      {/* Angular rock — near broken wheel */}
      <path d="M645 330 Q650 325 658 328 Q662 332 656 335 L647 334 Z" fill="#1a1810" stroke="#2a2518" strokeWidth="0.4" opacity="0.45" />
      {/* Small pebbles scattered in foreground */}
      <ellipse cx="250" cy="335" rx="2.5" ry="1.5" fill="#1e1a12" opacity="0.35" />
      <ellipse cx="380" cy="342" rx="3" ry="1.8" fill="#1e1a12" opacity="0.32" />
      <ellipse cx="500" cy="348" rx="2" ry="1.2" fill="#1a1810" opacity="0.3" />

      {/* ===== HEAT DISTORTION LINES — rising from hot ground (animated) ===== */}
      <path d="M100 330 Q110 327 120 330 Q130 333 140 330 Q150 327 160 330"
        fill="none" stroke="#7a5a35" strokeWidth="0.3" opacity="0.04">
        <animate attributeName="d"
          values="M100 330 Q110 327 120 330 Q130 333 140 330 Q150 327 160 330;M100 330 Q110 333 120 330 Q130 327 140 330 Q150 333 160 330;M100 330 Q110 327 120 330 Q130 333 140 330 Q150 327 160 330"
          dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M400 320 Q415 317 430 320 Q445 323 460 320 Q475 317 490 320"
        fill="none" stroke="#7a5a35" strokeWidth="0.25" opacity="0.035">
        <animate attributeName="d"
          values="M400 320 Q415 317 430 320 Q445 323 460 320 Q475 317 490 320;M400 320 Q415 323 430 320 Q445 317 460 320 Q475 323 490 320;M400 320 Q415 317 430 320 Q445 323 460 320 Q475 317 490 320"
          dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M600 325 Q612 322 624 325 Q636 328 648 325"
        fill="none" stroke="#7a5a35" strokeWidth="0.25" opacity="0.03">
        <animate attributeName="d"
          values="M600 325 Q612 322 624 325 Q636 328 648 325;M600 325 Q612 328 624 325 Q636 322 648 325;M600 325 Q612 322 624 325 Q636 328 648 325"
          dur="4s" repeatCount="indefinite" />
      </path>

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

      {/* ===== ADDITIONAL HEAT HAZE — near hot ground surface ===== */}
      {/* Low heat haze line near foreground rocks */}
      <path d="M0 290 Q40 287 80 290 Q120 293 160 290 Q200 287 240 290 Q280 293 320 290 Q360 287 400 290 Q440 293 480 290 Q520 287 560 290 Q600 293 640 290 Q680 287 720 290 Q760 293 800 290"
        fill="none" stroke="#7a5a35" strokeWidth="0.4" opacity="0.05">
        <animate attributeName="d"
          values="M0 290 Q40 287 80 290 Q120 293 160 290 Q200 287 240 290 Q280 293 320 290 Q360 287 400 290 Q440 293 480 290 Q520 287 560 290 Q600 293 640 290 Q680 287 720 290 Q760 293 800 290;M0 290 Q40 293 80 290 Q120 287 160 290 Q200 293 240 290 Q280 287 320 290 Q360 293 400 290 Q440 287 480 290 Q520 293 560 290 Q600 287 640 290 Q680 293 720 290 Q760 287 800 290;M0 290 Q40 287 80 290 Q120 293 160 290 Q200 287 240 290 Q280 293 320 290 Q360 287 400 290 Q440 293 480 290 Q520 287 560 290 Q600 293 640 290 Q680 287 720 290 Q760 293 800 290"
          dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Heat haze above the hillside, mid-ground */}
      <path d="M100 240 Q150 237 200 240 Q250 243 300 240 Q350 237 400 240 Q450 243 500 240 Q550 237 600 240 Q650 243 700 240"
        fill="none" stroke="#7a5a35" strokeWidth="0.35" opacity="0.04">
        <animate attributeName="d"
          values="M100 240 Q150 237 200 240 Q250 243 300 240 Q350 237 400 240 Q450 243 500 240 Q550 237 600 240 Q650 243 700 240;M100 240 Q150 243 200 240 Q250 237 300 240 Q350 243 400 240 Q450 237 500 240 Q550 243 600 240 Q650 237 700 240;M100 240 Q150 237 200 240 Q250 243 300 240 Q350 237 400 240 Q450 243 500 240 Q550 237 600 240 Q650 243 700 240"
          dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* Rising heat ripple near campfire area */}
      <path d="M380 305 Q400 302 420 305 Q440 308 460 305"
        fill="none" stroke="#a06030" strokeWidth="0.3" opacity="0.05">
        <animate attributeName="d"
          values="M380 305 Q400 302 420 305 Q440 308 460 305;M380 305 Q400 308 420 305 Q440 302 460 305;M380 305 Q400 302 420 305 Q440 308 460 305"
          dur="2.8s" repeatCount="indefinite" />
      </path>

      {/* ===== FOREGROUND DARK GROUND ===== */}
      <path d="M0 340 Q200 335 400 340 Q600 345 800 338 L800 400 L0 400 Z"
        fill="url(#ch7_ground)" />

      {/* Foreground rocks */}
      <path d="M30 360 Q40 350 60 355 Q70 348 80 358 L70 365 L35 363 Z" fill="#1a1810" stroke="#2a2518" strokeWidth="0.5" />
      <path d="M740 355 Q750 348 765 352 L762 360 L742 358 Z" fill="#1a1810" stroke="#2a2518" strokeWidth="0.5" />

      {/* ===== CAST SHADOWS — long shadows from low sun angle ===== */}
      {/* Shadow of the olive tree stretching right across foreground */}
      <ellipse cx="90" cy="375" rx="45" ry="5" fill="#0a0808" opacity="0.12" transform="skewX(-15)" />
      {/* Shadow from the standing sentinel (Soldier 6) */}
      <ellipse cx="775" cy="275" rx="18" ry="3" fill="#0a0808" opacity="0.1" transform="skewX(-20)" />
      {/* Shadow from the flagpole */}
      <ellipse cx="510" cy="268" rx="12" ry="2" fill="#0a0808" opacity="0.08" transform="skewX(-15)" />
      {/* Shadow from the horse */}
      <ellipse cx="540" cy="270" rx="22" ry="3" fill="#0a0808" opacity="0.1" transform="skewX(-15)" />
      {/* Rocks casting small shadows */}
      <ellipse cx="55" cy="363" rx="12" ry="2" fill="#0a0808" opacity="0.1" />
      <ellipse cx="755" cy="358" rx="8" ry="1.5" fill="#0a0808" opacity="0.08" />

      {/* ===== ADDITIONAL FOREGROUND VEGETATION ===== */}
      {/* Dried poppy seed heads — skeletal summer remnants */}
      <path d="M130 355 Q131 348 132 342" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.25" />
      <circle cx="132" cy="341" r="1.2" fill="#2a2015" opacity="0.2" />
      <path d="M134 357 Q135 350 136 345" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.22" />
      <circle cx="136" cy="344" r="1" fill="#2a2015" opacity="0.18" />

      {/* Wild fennel — tall dried stalks, foreground right */}
      <path d="M680 365 Q682 350 683 338" fill="none" stroke="#2a2815" strokeWidth="0.6" opacity="0.3" />
      <path d="M683 338 Q680 335 678 338" fill="none" stroke="#2a2815" strokeWidth="0.4" opacity="0.2" />
      <path d="M683 338 Q686 335 688 338" fill="none" stroke="#2a2815" strokeWidth="0.4" opacity="0.2" />
      <ellipse cx="683" cy="336" rx="3" ry="2" fill="#3a3518" opacity="0.15" />
      <path d="M686 367 Q688 354 689 344" fill="none" stroke="#2a2815" strokeWidth="0.5" opacity="0.25" />
      <ellipse cx="689" cy="342" rx="2.5" ry="1.5" fill="#3a3518" opacity="0.12" />

      {/* Thistles — tough summer survivors */}
      <path d="M320 348 Q321 340 322 333" fill="none" stroke="#2a2815" strokeWidth="0.5" opacity="0.22" />
      <circle cx="322" cy="332" r="1.5" fill="#2a1828" opacity="0.15" />
      <path d="M322 333 L325 331" fill="none" stroke="#2a2815" strokeWidth="0.3" opacity="0.15" />
      <path d="M322 333 L319 331" fill="none" stroke="#2a2815" strokeWidth="0.3" opacity="0.15" />

      {/* ===== GUN SMOKE HAZE — drifting across middleground from battle ===== */}
      {/* Low-lying battle smoke caught in a depression */}
      <ellipse cx="250" cy="255" rx="60" ry="8" fill="url(#ch7_gunSmoke)" opacity="0.6">
        <animate attributeName="cx" values="250;265;250" dur="15s" repeatCount="indefinite" />
        <animate attributeName="rx" values="60;70;60" dur="15s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke tendril drifting across the hillside from below */}
      <ellipse cx="500" cy="248" rx="50" ry="6" fill="url(#ch7_gunSmoke)" opacity="0.4">
        <animate attributeName="cx" values="500;515;500" dur="18s" repeatCount="indefinite" />
      </ellipse>
      {/* Acrid powder smoke smell — visible haze near ground */}
      <rect x="0" y="230" width="800" height="20" fill="#5a4a3a" opacity="0.02" />

      {/* ===== DISTANT DUST CLOUDS — churned up by retreating troops ===== */}
      <ellipse cx="680" cy="225" rx="30" ry="6" fill="url(#ch7_dustCloud)" opacity="0.5">
        <animate attributeName="rx" values="30;38;30" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="120" cy="228" rx="25" ry="5" fill="url(#ch7_dustCloud)" opacity="0.4">
        <animate attributeName="rx" values="25;32;25" dur="12s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ADDITIONAL FORMATION FIGURES — closer, on hillside path ===== */}
      {/* Small group of walking wounded heading uphill on the track */}
      <g opacity="0.4">
        {/* Figure 1 — limping, leaning on musket as crutch */}
        <line x1="390" y1="263" x2="391" y2="256" stroke="#151510" strokeWidth="1.5" />
        <circle cx="391" cy="254.5" r="1.5" fill="#151510" />
        <line x1="390" y1="260" x2="386" y2="265" stroke="#151510" strokeWidth="0.8" opacity="0.6" />
        {/* Musket used as crutch */}
        <line x1="393" y1="255" x2="396" y2="265" stroke="#1a1a12" strokeWidth="0.6" opacity="0.5" />
        {/* Figure 2 — supporting Figure 1 */}
        <line x1="385" y1="264" x2="386" y2="257" stroke="#151510" strokeWidth="1.5" />
        <circle cx="386" cy="255.5" r="1.5" fill="#151510" />
        {/* Figure 3 — straggler behind, head down */}
        <line x1="378" y1="266" x2="379" y2="260" stroke="#151510" strokeWidth="1.3" opacity="0.5" />
        <circle cx="379" cy="258.5" r="1.3" fill="#151510" opacity="0.5" />
      </g>

      {/* ===== POWDER KEGS — stacked near the ammunition wagon ===== */}
      <g opacity="0.45">
        {/* Small barrel — lying on side */}
        <ellipse cx="252" cy="302" rx="5" ry="3.5" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.5" />
        <ellipse cx="248" cy="302" rx="2.5" ry="3.5" fill="#2a2518" stroke="#3a3020" strokeWidth="0.3" opacity="0.5" />
        {/* Second barrel — upright */}
        <ellipse cx="260" cy="300" rx="3.5" ry="2.5" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.4" />
        <rect x="257" y="296" width="6" height="4" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.3" rx="0.5" />
      </g>

      {/* ===== CRICKETS / EVENING INSECTS — tiny animated dots ===== */}
      {/* Insect 1 — erratic zigzag near left bushes */}
      <circle cx="135" cy="252" r="0.5" fill="#8a7a60" opacity="0.35">
        <animate attributeName="cx" values="135;138;132;137;135" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="252;248;250;246;252" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.15;0.35;0.1;0.35" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Insect 2 — rising from warm ground center */}
      <circle cx="350" cy="275" r="0.4" fill="#8a7a60" opacity="0.3">
        <animate attributeName="cy" values="275;268;260;265;275" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="350;352;348;351;350" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.2;0.35;0.15;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Insect 3 — near the campfire warmth */}
      <circle cx="430" cy="295" r="0.5" fill="#a08860" opacity="0.35">
        <animate attributeName="cx" values="430;434;428;432;430" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="295;290;288;292;295" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.2;0.4;0.15;0.35" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Insect 4 — near olive tree right */}
      <circle cx="710" cy="240" r="0.4" fill="#8a7a60" opacity="0.25">
        <animate attributeName="cx" values="710;713;708;712;710" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="240;236;238;234;240" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.15;0.3;0.1;0.25" dur="3.5s" repeatCount="indefinite" />
      </circle>
      {/* Insect 5 — pair of gnats near surgeon area */}
      <circle cx="65" cy="285" r="0.3" fill="#8a7a60" opacity="0.3">
        <animate attributeName="cx" values="65;67;63;66;65" dur="2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="285;282;284;280;285" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.15;0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="68" cy="283" r="0.3" fill="#8a7a60" opacity="0.25">
        <animate attributeName="cx" values="68;66;70;67;68" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="283;280;282;279;283" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.1;0.25;0.08;0.25" dur="2.2s" repeatCount="indefinite" />
      </circle>
      {/* Insect 6 — lazy moth near the campfire glow */}
      <circle cx="410" cy="300" r="0.6" fill="#a09070" opacity="0.3">
        <animate attributeName="cx" values="410;415;408;413;410" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="300;294;298;292;300" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.15;0.35;0.1;0.3" dur="4.5s" repeatCount="indefinite" />
      </circle>
      {/* Insect 7 — rising in the warm dusk air */}
      <circle cx="550" cy="260" r="0.35" fill="#8a7a60" opacity="0.2">
        <animate attributeName="cy" values="260;253;256;250;260" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="550;553;548;551;550" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.1;0.25;0.08;0.2" dur="5s" repeatCount="indefinite" />
      </circle>
      {/* Insect 8 — near the grape vine */}
      <circle cx="695" cy="250" r="0.4" fill="#8a7a60" opacity="0.28">
        <animate attributeName="cx" values="695;698;692;696;695" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="cy" values="250;246;248;244;250" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.28;0.12;0.28;0.08;0.28" dur="3.2s" repeatCount="indefinite" />
      </circle>

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
