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
        {/* Hot twilight sky — dark violet at top through blood-red to searing orange */}
        <linearGradient id="ch7_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12061a" />
          <stop offset="10%" stopColor="#1e0a28" />
          <stop offset="20%" stopColor="#301235" />
          <stop offset="32%" stopColor="#551a35" />
          <stop offset="44%" stopColor="#782228" />
          <stop offset="55%" stopColor="#962a20" />
          <stop offset="66%" stopColor="#b03a1a" />
          <stop offset="76%" stopColor="#c85018" />
          <stop offset="86%" stopColor="#d86815" />
          <stop offset="93%" stopColor="#e47a18" />
          <stop offset="100%" stopColor="#e88a22" />
        </linearGradient>
        {/* Smoke haze band across horizon — thick, oppressive */}
        <linearGradient id="ch7_smokeHaze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a4a38" stopOpacity="0" />
          <stop offset="15%" stopColor="#6a4a38" stopOpacity="0.22" />
          <stop offset="40%" stopColor="#6a4a38" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#6a4a38" stopOpacity="0.35" />
          <stop offset="85%" stopColor="#6a4a38" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6a4a38" stopOpacity="0" />
        </linearGradient>
        {/* Lake Garda — warm reflected sunset with deeper colour */}
        <linearGradient id="ch7_lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a3828" />
          <stop offset="20%" stopColor="#4a2838" />
          <stop offset="50%" stopColor="#2e2540" />
          <stop offset="80%" stopColor="#222040" />
          <stop offset="100%" stopColor="#1a1a38" />
        </linearGradient>
        {/* Lake sunset reflection — intensified orange-gold band */}
        <linearGradient id="ch7_lakeReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d07020" stopOpacity="0.35" />
          <stop offset="25%" stopColor="#b05828" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#904838" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#704040" stopOpacity="0" />
        </linearGradient>
        {/* Lake shimmer highlight — molten gold on water */}
        <linearGradient id="ch7_shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e09040" stopOpacity="0" />
          <stop offset="35%" stopColor="#e09040" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#e09040" stopOpacity="0.3" />
          <stop offset="65%" stopColor="#e09040" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#e09040" stopOpacity="0" />
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
        {/* Campfire glow — warm pool of light in the darkness */}
        <radialGradient id="ch7_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d07828" stopOpacity="0.55" />
          <stop offset="25%" stopColor="#b05820" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#a04818" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a04818" stopOpacity="0" />
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
        {/* Vignette — heavy, oppressive, suffocating heat */}
        <radialGradient id="ch7_vignette" cx="0.5" cy="0.42" r="0.62">
          <stop offset="30%" stopColor="#000000" stopOpacity="0" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="80%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
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

        {/* Bright sunset reflection streak on lake — molten gold path */}
        <linearGradient id="ch7_sunsetStreak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0a030" stopOpacity="0.55" />
          <stop offset="20%" stopColor="#e08828" stopOpacity="0.4" />
          <stop offset="45%" stopColor="#d07020" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#c06018" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a05020" stopOpacity="0" />
        </linearGradient>
        {/* Burning village fire glow — fierce, consuming */}
        <radialGradient id="ch7_villageFireGlow" cx="0.5" cy="0.8" r="0.5">
          <stop offset="0%" stopColor="#e06820" stopOpacity="0.85" />
          <stop offset="25%" stopColor="#d05018" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#b04015" stopOpacity="0.25" />
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
        {/* Harsh sun disc glow — searing, oppressive */}
        <radialGradient id="ch7_sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0b048" stopOpacity="0.7" />
          <stop offset="15%" stopColor="#e89838" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#d07828" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#b05820" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a04818" stopOpacity="0" />
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

        {/* === DETAIL PASS 15 GRADIENTS === */}

        {/* Rolling hill contour — warm earth tones */}
        <linearGradient id="ch7_hillContour" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2418" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#1e1a10" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1e1a10" stopOpacity="0" />
        </linearGradient>
        {/* Ditch shadow — sunken terrain */}
        <linearGradient id="ch7_ditchShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0808" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1a1510" stopOpacity="0.08" />
        </linearGradient>
        {/* Muzzle flash glow */}
        <radialGradient id="ch7_muzzleFlash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a040" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#d08030" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c06020" stopOpacity="0" />
        </radialGradient>
        {/* Heavy cannon smoke billowing */}
        <radialGradient id="ch7_cannonSmoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#6a6058" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#5a5048" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4a4038" stopOpacity="0" />
        </radialGradient>
        {/* Overrun camp debris glow */}
        <radialGradient id="ch7_campFireSmolder" cx="0.5" cy="0.8" r="0.5">
          <stop offset="0%" stopColor="#a04818" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#803010" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#602008" stopOpacity="0" />
        </radialGradient>
        {/* Trampled crop texture */}
        <linearGradient id="ch7_trampledCrop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a3218" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#2a2412" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3a3218" stopOpacity="0.2" />
        </linearGradient>
        {/* Fence post weathered wood */}
        <linearGradient id="ch7_fencePost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3020" />
          <stop offset="100%" stopColor="#2a2215" />
        </linearGradient>
        {/* Distant musket volley smoke band */}
        <linearGradient id="ch7_volleySmoke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a7068" stopOpacity="0" />
          <stop offset="30%" stopColor="#7a7068" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#7a7068" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7a7068" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ===== SKY ===== */}
      <rect width="800" height="400" fill="url(#ch7_sky)" />

      {/* ===== SETTING SUN — low on horizon, searing and blood-red ===== */}
      {/* Outermost corona — massive, diffuse warm glow spreading across horizon */}
      <ellipse cx="420" cy="120" rx="120" ry="60" fill="#c05818" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.04;0.06" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Wide atmospheric glow */}
      <ellipse cx="420" cy="120" rx="65" ry="45" fill="url(#ch7_sunGlow)">
        <animate attributeName="opacity" values="1;0.8;1" dur="6s" repeatCount="indefinite" />
      </ellipse>
      {/* Mid-glow ring — intense orange */}
      <ellipse cx="420" cy="120" rx="25" ry="20" fill="#e09040" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.14;0.2" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner bright core — white-hot centre */}
      <ellipse cx="420" cy="120" rx="12" ry="10" fill="#f0b860" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.16;0.25" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Sun rays — long crepuscular beams through cloud layers */}
      <line x1="420" y1="120" x2="200" y2="45" stroke="#d07828" strokeWidth="2" opacity="0.05" />
      <line x1="420" y1="120" x2="280" y2="60" stroke="#c07030" strokeWidth="1.8" opacity="0.06" />
      <line x1="420" y1="120" x2="550" y2="55" stroke="#c07030" strokeWidth="1.5" opacity="0.05" />
      <line x1="420" y1="120" x2="160" y2="80" stroke="#b06028" strokeWidth="1.2" opacity="0.04" />
      <line x1="420" y1="120" x2="650" y2="70" stroke="#b06028" strokeWidth="1" opacity="0.035" />
      <line x1="420" y1="120" x2="350" y2="40" stroke="#c07030" strokeWidth="0.8" opacity="0.04" />
      <line x1="420" y1="120" x2="700" y2="50" stroke="#a85820" strokeWidth="0.8" opacity="0.03" />
      <line x1="420" y1="120" x2="100" y2="50" stroke="#a85820" strokeWidth="0.7" opacity="0.025" />

      {/* Thin cloud bands catching the red light — streaked across the blazing sky */}
      <ellipse cx="200" cy="28" rx="240" ry="7" fill="#5a1828" opacity="0.35" />
      <ellipse cx="550" cy="18" rx="200" ry="6" fill="#4a1222" opacity="0.3" />
      <ellipse cx="380" cy="42" rx="280" ry="8" fill="#6a2535" opacity="0.25" />
      <ellipse cx="680" cy="36" rx="160" ry="5" fill="#5a1828" opacity="0.22" />
      {/* Additional fiery bands near the horizon */}
      <ellipse cx="420" cy="88" rx="300" ry="5" fill="#8a3520" opacity="0.12" />
      <ellipse cx="300" cy="95" rx="200" ry="4" fill="#7a3020" opacity="0.1" />

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

      {/* Smoke haze across the horizon — thick, acrid, battle residue */}
      <rect x="0" y="85" width="800" height="35" fill="url(#ch7_smokeHaze)">
        <animate attributeName="y" values="85;82;85" dur="12s" repeatCount="indefinite" />
      </rect>
      {/* Secondary lower haze band */}
      <rect x="0" y="100" width="800" height="25" fill="url(#ch7_smokeHaze)" opacity="0.6">
        <animate attributeName="y" values="100;97;100" dur="15s" repeatCount="indefinite" />
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

      {/* ===== DISTANT MOUNTAINS — far shore of the lake, dark against the blazing sky ===== */}
      {/* Furthest range — jagged peaks silhouetted against the fiery horizon */}
      <path d="M0 122 Q40 105 90 112 Q140 95 200 105 Q260 90 320 100 Q380 88 420 105 Q460 92 520 108 Q580 98 640 110 Q700 100 750 108 Q780 102 800 115 L800 155 L0 155 Z"
        fill="#2a1828" opacity="0.6" />
      {/* Closer range — more defined, darker */}
      <path d="M0 130 Q60 118 130 125 Q200 112 280 122 Q360 110 420 120 Q480 112 550 123 Q620 115 700 122 Q760 118 800 128 L800 155 L0 155 Z"
        fill="#221528" opacity="0.5" />
      {/* Mountain rim-light — sunset catching the ridgeline */}
      <path d="M0 122 Q40 105 90 112 Q140 95 200 105 Q260 90 320 100 Q380 88 420 105 Q460 92 520 108 Q580 98 640 110 Q700 100 750 108 Q780 102 800 115"
        fill="none" stroke="#a04820" strokeWidth="0.8" opacity="0.15" />

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

      {/* ===== DISTANT MUSKET VOLLEY — smoke band and flashes on the far plain (Detail Pass 15) ===== */}
      {/* A firefight still raging in the distance — line of white smoke */}
      <rect x="60" y="127" width="80" height="2.5" fill="url(#ch7_volleySmoke)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="8s" repeatCount="indefinite" />
      </rect>
      {/* Individual musket flashes along the line — irregular twinkling */}
      <circle cx="75" cy="128" r="0.8" fill="#e0a040" opacity="0">
        <animate attributeName="opacity" values="0;0;0.5;0;0;0" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" cy="127.5" r="0.7" fill="#e0a040" opacity="0">
        <animate attributeName="opacity" values="0;0.4;0;0;0;0" dur="4.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="128" r="0.6" fill="#d09038" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.45;0;0" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="125" cy="127.5" r="0.7" fill="#e0a040" opacity="0">
        <animate attributeName="opacity" values="0;0;0.35;0;0;0" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* ===== SECOND FIREFIGHT — right side of plain, fainter (Detail Pass 15) ===== */}
      <rect x="620" y="129" width="60" height="2" fill="url(#ch7_volleySmoke)" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.12;0.25" dur="10s" repeatCount="indefinite" />
      </rect>
      <circle cx="640" cy="130" r="0.5" fill="#d09038" opacity="0">
        <animate attributeName="opacity" values="0;0.3;0;0;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="660" cy="129.5" r="0.5" fill="#d09038" opacity="0">
        <animate attributeName="opacity" values="0;0;0.35;0;0" dur="3.2s" repeatCount="indefinite" />
      </circle>

      {/* ===== ADDITIONAL INFANTRY COLUMN — marching in column on the road (Detail Pass 15) ===== */}
      <g opacity="0.17">
        {/* Dense column block — troops marching toward Castiglione */}
        <rect x="410" y="130" width="4" height="12" fill="#1a1520" rx="0.3" />
        {/* Head dots visible */}
        <circle cx="411" cy="129.5" r="0.4" fill="#1a1520" />
        <circle cx="413" cy="129.5" r="0.4" fill="#1a1520" />
        {/* Column tail stragglers */}
        <circle cx="412" cy="143" r="0.3" fill="#1a1520" />
        <circle cx="411" cy="145" r="0.3" fill="#1a1520" opacity="0.7" />
        {/* Column dust */}
        <ellipse cx="412" cy="128" rx="6" ry="2.5" fill="url(#ch7_dustCloud)" />
      </g>

      {/* ===== DEPLOYED SKIRMISH LINE — extended figures on the plain (Detail Pass 15) ===== */}
      <g opacity="0.15">
        {/* Individual skirmishers — spread out in front of the French column */}
        <circle cx="175" cy="130" r="0.6" fill="#1a1520" />
        <circle cx="181" cy="131" r="0.5" fill="#1a1520" />
        <circle cx="187" cy="130.5" r="0.6" fill="#1a1520" />
        <circle cx="193" cy="131.5" r="0.5" fill="#1a1520" />
        <circle cx="199" cy="130" r="0.5" fill="#1a1520" />
        <circle cx="205" cy="131" r="0.5" fill="#1a1520" />
        {/* Puff of smoke from one skirmisher firing */}
        <ellipse cx="187" cy="129" rx="2.5" ry="1.2" fill="#7a7068" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.04;0.12" dur="6s" repeatCount="indefinite" />
        </ellipse>
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
        {/* ===== CANNON MUZZLE FLASH — periodic firing animation (Detail Pass 15) ===== */}
        {/* Gun 1 firing — flash and immediate smoke bloom */}
        <ellipse cx="325" cy="123.5" rx="3" ry="2" fill="url(#ch7_muzzleFlash)">
          <animate attributeName="opacity" values="0;0;0.8;0.3;0;0;0;0;0;0" dur="8s" repeatCount="indefinite" />
        </ellipse>
        {/* Gun 2 firing — staggered timing */}
        <ellipse cx="339" cy="123.5" rx="3" ry="2" fill="url(#ch7_muzzleFlash)">
          <animate attributeName="opacity" values="0;0;0;0;0;0.7;0.25;0;0;0" dur="8s" repeatCount="indefinite" />
        </ellipse>
        {/* Heavy smoke eruption after firing — billowing forward */}
        <ellipse cx="335" cy="118" rx="14" ry="5" fill="url(#ch7_cannonSmoke)">
          <animate attributeName="opacity" values="0;0;0.4;0.6;0.3;0.15;0.4;0.6;0.3;0" dur="8s" repeatCount="indefinite" />
          <animate attributeName="rx" values="14;14;14;22;28;14;14;22;28;14" dur="8s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== SECOND ARTILLERY POSITION — distant, right side of plain (Detail Pass 15) ===== */}
      <g opacity="0.18">
        {/* Earthen redoubt — low mound */}
        <path d="M590 128 Q600 125 610 128 Q620 125 630 128 L628 130 L592 130 Z" fill="#1e1820" />
        {/* Two gun barrels */}
        <line x1="600" y1="127" x2="606" y2="126" stroke="#1a1520" strokeWidth="1" />
        <line x1="618" y1="127" x2="624" y2="126" stroke="#1a1520" strokeWidth="1" />
        {/* Crew figures */}
        <circle cx="602" cy="129" r="0.5" fill="#1a1520" />
        <circle cx="604" cy="129.5" r="0.4" fill="#1a1520" />
        <circle cx="620" cy="129" r="0.5" fill="#1a1520" />
        {/* Gun smoke lingering */}
        <ellipse cx="610" cy="123" rx="16" ry="4" fill="url(#ch7_artillerySmoke)">
          <animate attributeName="rx" values="16;22;16" dur="7s" repeatCount="indefinite" />
          <animate attributeName="cy" values="123;120;123" dur="7s" repeatCount="indefinite" />
        </ellipse>
        {/* Muzzle flash */}
        <ellipse cx="607" cy="125.5" rx="2" ry="1.5" fill="url(#ch7_muzzleFlash)">
          <animate attributeName="opacity" values="0;0;0;0.6;0;0;0;0" dur="6s" repeatCount="indefinite" />
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

      {/* ===== INFANTRY SQUARE — a unit formed in defensive square on the plain (Detail Pass 15) ===== */}
      <g opacity="0.14">
        {/* Square outline — formed against cavalry threat */}
        <rect x="70" y="128" width="8" height="8" fill="none" stroke="#1a1520" strokeWidth="0.6" />
        {/* Figures inside the square — dense interior */}
        <rect x="72" y="130" width="4" height="4" fill="#1a1520" opacity="0.4" />
        {/* Bayonet points — tiny projections on all four sides */}
        <path d="M70 130 L69 130 M70 132 L69 132 M70 134 L69 134" fill="none" stroke="#1a1520" strokeWidth="0.3" />
        <path d="M78 130 L79 130 M78 132 L79 132 M78 134 L79 134" fill="none" stroke="#1a1520" strokeWidth="0.3" />
        {/* Flag in center */}
        <line x1="74" y1="132" x2="74" y2="127" stroke="#1a1520" strokeWidth="0.3" />
        <rect x="74" y="127" width="2" height="1.2" fill="#3a2030" opacity="0.25" />
      </g>

      {/* ===== RETREATING CAVALRY SQUADRON — distant riders dispersing (Detail Pass 15) ===== */}
      <g opacity="0.15">
        {/* Small cluster of horsemen — Austrian dragoons withdrawing */}
        <path d="M560 125 Q562 123 564 123 Q566 123 567 125 L565 126 L561 126 Z" fill="#1a1520" />
        <circle cx="563" cy="122" r="0.7" fill="#1a1520" />
        <path d="M554 126 Q556 124 558 124 Q560 124 561 126 L559 127 L555 127 Z" fill="#1a1520" opacity="0.8" />
        <circle cx="557" cy="123" r="0.6" fill="#1a1520" opacity="0.8" />
        <path d="M548 127 Q550 125.5 552 125.5 Q554 125.5 555 127" fill="#1a1520" opacity="0.6" />
        {/* Dispersal dust */}
        <ellipse cx="556" cy="123" rx="10" ry="3" fill="url(#ch7_dustCloud)">
          <animate attributeName="rx" values="10;14;10" dur="6s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== CYPRESS TREES — iconic Italian sentinels, dark spears against the blood-red sky ===== */}
      {/* Tall cypress 1 — near the church, prominent */}
      <g opacity="0.55">
        <path d="M370 125 Q371 116 372 105 Q373 96 372 86"
          fill="none" stroke="#0a1406" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="372" cy="100" rx="3.5" ry="18" fill="url(#ch7_cypressFill)" />
        <ellipse cx="372" cy="95" rx="2.5" ry="10" fill="#081008" opacity="0.5" />
      </g>
      {/* Tall cypress 2 — pair flanking a road */}
      <g opacity="0.5">
        <path d="M430 124 Q431 114 432 102 Q432 94 431 84"
          fill="none" stroke="#0a1406" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="431" cy="98" rx="3" ry="17" fill="url(#ch7_cypressFill)" />
        <ellipse cx="431" cy="93" rx="2" ry="9" fill="#081008" opacity="0.45" />
      </g>
      {/* Cypress 3 — smaller, distant right */}
      <g opacity="0.4">
        <path d="M640 122 Q641 115 641 106 Q641 100 640 94"
          fill="none" stroke="#0a1406" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="641" cy="106" rx="2.5" ry="12" fill="url(#ch7_cypressFill)" />
      </g>
      {/* Cypress 4 — companion to cypress 2, forming a pair */}
      <g opacity="0.45">
        <path d="M438 124 Q439 115 440 104 Q440 96 439 88"
          fill="none" stroke="#0a1406" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="439" cy="100" rx="2.5" ry="15" fill="url(#ch7_cypressFill)" />
      </g>
      {/* Row of small cypresses along a distant road — left */}
      <g opacity="0.3">
        <ellipse cx="130" cy="116" rx="1.8" ry="7" fill="url(#ch7_cypressFill)" />
        <ellipse cx="138" cy="115" rx="1.8" ry="7" fill="url(#ch7_cypressFill)" />
        <ellipse cx="146" cy="116" rx="1.8" ry="6.5" fill="url(#ch7_cypressFill)" />
        <ellipse cx="154" cy="116.5" rx="1.8" ry="6" fill="url(#ch7_cypressFill)" />
        <ellipse cx="162" cy="117" rx="1.5" ry="5.5" fill="url(#ch7_cypressFill)" />
      </g>
      {/* Row of cypresses along road — right side */}
      <g opacity="0.25">
        <ellipse cx="580" cy="118" rx="1.5" ry="6" fill="url(#ch7_cypressFill)" />
        <ellipse cx="588" cy="117.5" rx="1.5" ry="6" fill="url(#ch7_cypressFill)" />
        <ellipse cx="596" cy="118" rx="1.5" ry="5.5" fill="url(#ch7_cypressFill)" />
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

      {/* ===== ROLLING HILLS — gentle contour undulations on the plain (Detail Pass 15) ===== */}
      {/* Low ridge running left to right behind the wheat fields */}
      <path d="M60 130 Q100 126 140 130 Q180 134 220 129 Q260 125 300 130"
        fill="url(#ch7_hillContour)" opacity="0.4" />
      <path d="M350 128 Q400 124 450 129 Q500 133 550 127 Q600 123 650 128"
        fill="url(#ch7_hillContour)" opacity="0.35" />
      {/* Subtle ridge shadow line — where ground dips */}
      <path d="M80 131 Q130 128 180 132 Q230 135 280 130" fill="none" stroke="#0a0808" strokeWidth="0.4" opacity="0.08" />
      <path d="M500 129 Q540 126 580 130 Q620 133 660 128" fill="none" stroke="#0a0808" strokeWidth="0.4" opacity="0.06" />

      {/* ===== DITCHES — sunken defensive positions and drainage channels ===== */}
      {/* Ditch across the plain — defensive entrenchment */}
      <path d="M190 133 Q200 136 210 133 Q220 130 230 133" fill="url(#ch7_ditchShadow)" opacity="0.3" />
      <path d="M190 133 Q200 131 210 133 Q220 135 230 133" fill="none" stroke="#1a1510" strokeWidth="0.5" opacity="0.15" />
      {/* Longer irrigation ditch — diagonally across a field */}
      <path d="M470 131 Q480 133 490 130 Q500 128 510 131 Q520 134 530 130"
        fill="none" stroke="#1a1510" strokeWidth="0.6" opacity="0.12" />
      <path d="M470 132 Q480 134 490 131 Q500 129 510 132 Q520 135 530 131"
        fill="none" stroke="#0a0808" strokeWidth="0.3" opacity="0.1" />

      {/* ===== ADDITIONAL HEDGEROW DETAIL — thicker, more organic shapes ===== */}
      {/* Dense hedgerow with individual bush shapes */}
      <g opacity="0.22">
        <ellipse cx="272" cy="132" rx="3" ry="2" fill="#1a2010" />
        <ellipse cx="278" cy="131.5" rx="3.5" ry="2.2" fill="#182010" />
        <ellipse cx="284" cy="132" rx="3" ry="1.8" fill="#1a2010" />
        <ellipse cx="290" cy="132.5" rx="2.5" ry="1.8" fill="#1a2012" />
      </g>
      {/* Hedgerow gap — where troops pushed through */}
      <path d="M445 131 Q447 130 449 131" fill="none" stroke="#2a2010" strokeWidth="0.5" opacity="0.12" />
      <g opacity="0.18">
        <ellipse cx="442" cy="131.5" rx="2.5" ry="1.8" fill="#1a2010" />
        <ellipse cx="454" cy="131" rx="3" ry="2" fill="#1a2010" />
        <ellipse cx="460" cy="131.5" rx="2.8" ry="1.8" fill="#182010" />
        <ellipse cx="466" cy="132" rx="2.5" ry="1.5" fill="#1a2010" />
      </g>

      {/* ===== TRAMPLED CROPS — crushed wheat where troops marched (Detail Pass 15) ===== */}
      {/* Flattened swath through the wheat field — column path */}
      <path d="M160 131 Q170 133 180 130 Q190 128 200 131"
        fill="url(#ch7_trampledCrop)" opacity="0.5" />
      {/* Bent/broken wheat stalks at edges of the path */}
      <path d="M162 130 Q163 128 164 131" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.18" />
      <path d="M166 129 Q168 127 169 130" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.15" />
      <path d="M195 129 Q196 127 197 130" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.16" />
      <path d="M198 130 Q199 128 200 131" fill="none" stroke="#4a3a20" strokeWidth="0.3" opacity="0.14" />
      {/* Second trampled swath — perpendicular, artillery drag marks */}
      <path d="M565 129 Q570 131 575 128 Q580 126 585 129"
        fill="url(#ch7_trampledCrop)" opacity="0.35" />

      {/* ===== BROKEN FENCES — field boundaries smashed by troops (Detail Pass 15) ===== */}
      {/* Wooden fence — partially intact, some rails down */}
      <g opacity="0.25">
        {/* Standing posts */}
        <line x1="300" y1="134" x2="300" y2="130" stroke="url(#ch7_fencePost)" strokeWidth="0.8" />
        <line x1="308" y1="133.5" x2="308" y2="129.5" stroke="url(#ch7_fencePost)" strokeWidth="0.8" />
        <line x1="316" y1="134" x2="316" y2="130" stroke="url(#ch7_fencePost)" strokeWidth="0.8" />
        {/* Top rail — intact section */}
        <line x1="300" y1="131" x2="308" y2="130.5" stroke="#3a3020" strokeWidth="0.5" />
        {/* Broken rail — dangling */}
        <path d="M308 130.5 Q312 132 314 135" fill="none" stroke="#3a3020" strokeWidth="0.5" />
        {/* Fallen rail on ground */}
        <line x1="316" y1="135" x2="328" y2="136" stroke="#3a3020" strokeWidth="0.5" opacity="0.6" />
      </g>
      {/* Second broken fence — right side, more destroyed */}
      <g opacity="0.2">
        {/* Tilted post */}
        <line x1="620" y1="134" x2="618" y2="130" stroke="url(#ch7_fencePost)" strokeWidth="0.7" />
        {/* Snapped-off post stump */}
        <line x1="628" y1="134" x2="628" y2="132.5" stroke="url(#ch7_fencePost)" strokeWidth="0.8" />
        {/* Rails scattered on ground */}
        <line x1="615" y1="135" x2="625" y2="136" stroke="#3a3020" strokeWidth="0.4" opacity="0.5" />
        <line x1="627" y1="134.5" x2="635" y2="136" stroke="#3a3020" strokeWidth="0.4" opacity="0.45" />
      </g>

      {/* ===== ROAD RUTS — deep wagon wheel tracks (Detail Pass 15) ===== */}
      {/* Parallel ruts in the main road — deeply cut from artillery passage */}
      <path d="M120 134 Q180 137 240 133 Q300 129 360 132" fill="none" stroke="#201a10" strokeWidth="0.5" opacity="0.1" />
      <path d="M120 135.5 Q180 138.5 240 134.5 Q300 130.5 360 133.5" fill="none" stroke="#201a10" strokeWidth="0.5" opacity="0.08" />
      {/* Puddle in a deep rut — reflected sunset */}
      <ellipse cx="200" cy="135" rx="4" ry="1" fill="#5a3a3a" opacity="0.12" />
      <ellipse cx="200" cy="135" rx="2.5" ry="0.5" fill="#a06030" opacity="0.06" />

      {/* ===== HEAT SHIMMER — visible distortion above the scorched plain ===== */}
      <path d="M0 135 Q50 131 100 135 Q150 139 200 135 Q250 131 300 135 Q350 139 400 135 Q450 131 500 135 Q550 139 600 135 Q650 131 700 135 Q750 139 800 135"
        fill="none" stroke="#c08040" strokeWidth="0.8" opacity="0.08">
        <animate attributeName="d"
          values="M0 135 Q50 131 100 135 Q150 139 200 135 Q250 131 300 135 Q350 139 400 135 Q450 131 500 135 Q550 139 600 135 Q650 131 700 135 Q750 139 800 135;M0 135 Q50 139 100 135 Q150 131 200 135 Q250 139 300 135 Q350 131 400 135 Q450 139 500 135 Q550 131 600 135 Q650 139 700 135 Q750 131 800 135;M0 135 Q50 131 100 135 Q150 139 200 135 Q250 131 300 135 Q350 139 400 135 Q450 131 500 135 Q550 139 600 135 Q650 131 700 135 Q750 139 800 135"
          dur="3s" repeatCount="indefinite" />
      </path>
      {/* Second heat shimmer line — staggered phase */}
      <path d="M0 138 Q60 134 120 138 Q180 142 240 138 Q300 134 360 138 Q420 142 480 138 Q540 134 600 138 Q660 142 720 138 Q780 134 800 138"
        fill="none" stroke="#b07038" strokeWidth="0.6" opacity="0.06">
        <animate attributeName="d"
          values="M0 138 Q60 134 120 138 Q180 142 240 138 Q300 134 360 138 Q420 142 480 138 Q540 134 600 138 Q660 142 720 138 Q780 134 800 138;M0 138 Q60 142 120 138 Q180 134 240 138 Q300 142 360 138 Q420 134 480 138 Q540 142 600 138 Q660 134 720 138 Q780 142 800 138;M0 138 Q60 134 120 138 Q180 142 240 138 Q300 134 360 138 Q420 142 480 138 Q540 134 600 138 Q660 142 720 138 Q780 134 800 138"
          dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* ===== LAKE GARDA ===== */}
      <path d="M0 145 Q150 138 300 142 Q450 136 600 143 Q700 138 800 145 L800 215 L0 215 Z"
        fill="url(#ch7_lake)" />
      {/* Sunset reflection band on lake surface */}
      <path d="M0 145 Q150 138 300 142 Q450 136 600 143 Q700 138 800 145 L800 175 L0 175 Z"
        fill="url(#ch7_lakeReflect)" />

      {/* ===== BRIGHT SUNSET REFLECTION STREAK ON LAKE — molten gold path ===== */}
      {/* Central golden-orange sun path cutting across the water */}
      <path d="M300 145 Q360 138 420 142 Q480 138 540 145 L535 185 L305 185 Z"
        fill="url(#ch7_sunsetStreak)">
        <animate attributeName="opacity" values="1;0.7;1" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Bright highlight core of the reflection — narrow molten band */}
      <ellipse cx="420" cy="150" rx="60" ry="3.5" fill="#f0a838" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.14;0.25" dur="2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="60;68;60" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="156" rx="45" ry="2.5" fill="#e09030" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="162" rx="35" ry="2" fill="#d08028" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.07;0.15" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Bright sparkling specks scattered across the reflection path */}
      <circle cx="385" cy="150" r="1" fill="#f0b848" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="440" cy="148" r="0.8" fill="#f0b848" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.05;0.35" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="410" cy="155" r="0.9" fill="#e0a038" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="460" cy="153" r="0.7" fill="#f0b848" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.04;0.3" dur="1.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="365" cy="154" r="0.6" fill="#e0a040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.04;0.25" dur="1.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="475" cy="150" r="0.7" fill="#e0a040" opacity="0.28">
        <animate attributeName="opacity" values="0.28;0.05;0.28" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="160" r="0.5" fill="#d09838" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.04;0.22" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="445" cy="158" r="0.6" fill="#d09838" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.03;0.2" dur="2.2s" repeatCount="indefinite" />
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

      {/* Water shimmer highlights — animated, catching the sunset fire */}
      <ellipse cx="180" cy="158" rx="35" ry="2" fill="#d08040" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="320" cy="162" rx="45" ry="2" fill="#c87838" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="480" cy="155" rx="40" ry="1.8" fill="#d08040" opacity="0.16">
        <animate attributeName="opacity" values="0.16;0.05;0.16" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="620" cy="160" rx="30" ry="1.5" fill="#c07035" opacity="0.13">
        <animate attributeName="opacity" values="0.13;0.04;0.13" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="175" rx="55" ry="2.5" fill="#b86830" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Additional scattered light on the lake — random glints */}
      <ellipse cx="100" cy="168" rx="20" ry="1.2" fill="#c07838" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="165" rx="22" ry="1.3" fill="#b07035" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="2.7s" repeatCount="indefinite" />
      </ellipse>
      {/* Gentle wave ripple lines */}
      <path d="M50 165 Q100 163 150 165 Q200 167 250 165" fill="none" stroke="#5a4540" strokeWidth="0.4" opacity="0.12" />
      <path d="M350 170 Q400 168 450 170 Q500 172 550 170" fill="none" stroke="#5a4540" strokeWidth="0.4" opacity="0.1" />
      <path d="M550 185 Q600 183 650 185 Q700 187 750 185" fill="none" stroke="#4a3a35" strokeWidth="0.3" opacity="0.08" />

      {/* Distant fires on the plain below — reflected in lake, wavering orange */}
      <ellipse cx="250" cy="195" rx="4" ry="2" fill="#c08040" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="198" rx="3.5" ry="1.8" fill="#c08040" opacity="0.16">
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

      {/* ===== HILLSIDE — scorched Mediterranean terrain, baked by August sun ===== */}
      <path d="M0 215 Q100 208 200 218 Q350 225 500 212 Q600 205 700 215 Q750 218 800 210 L800 400 L0 400 Z"
        fill="url(#ch7_hill)" />
      {/* Parched dry grass wash — golden-brown tint over the hillside */}
      <path d="M0 218 Q120 210 250 220 Q400 228 550 215 Q650 208 800 214 L800 280 L0 280 Z"
        fill="#2a2612" opacity="0.08" />
      {/* Scorched earth patches — where fire or sun has baked the ground bare */}
      <ellipse cx="300" cy="240" rx="25" ry="6" fill="#1a1508" opacity="0.08" />
      <ellipse cx="500" cy="235" rx="20" ry="5" fill="#1a1508" opacity="0.06" />
      <ellipse cx="650" cy="238" rx="18" ry="4" fill="#1a1508" opacity="0.07" />

      {/* ===== DUSTY TRACK — winding up the hillside ===== */}
      <path d="M0 270 Q80 260 160 268 Q240 280 320 272 Q400 260 480 265 Q560 275 640 268 Q720 258 800 262"
        fill="none" stroke="#2e2818" strokeWidth="2.5" opacity="0.18" />
      <path d="M0 273 Q80 263 160 271 Q240 283 320 275 Q400 263 480 268 Q560 278 640 271 Q720 261 800 265"
        fill="none" stroke="#2e2818" strokeWidth="1.5" opacity="0.12" />
      {/* Cart ruts in the dusty track */}
      <path d="M80 264 Q120 270 160 268" fill="none" stroke="#252012" strokeWidth="0.6" opacity="0.1" />
      <path d="M320 273 Q360 265 400 262" fill="none" stroke="#252012" strokeWidth="0.6" opacity="0.08" />

      {/* ===== DEEPER TRACK RUTS — artillery dragged up the hill (Detail Pass 15) ===== */}
      {/* Paired rut grooves from cannon limber wheels */}
      <path d="M160 269 Q200 276 240 272 Q280 264 320 270" fill="none" stroke="#1a1510" strokeWidth="0.8" opacity="0.1" />
      <path d="M162 271 Q202 278 242 274 Q282 266 322 272" fill="none" stroke="#1a1510" strokeWidth="0.8" opacity="0.08" />
      {/* Hoof marks in the rut — horses pulling the cannon */}
      <ellipse cx="180" cy="273" rx="0.8" ry="0.5" fill="#1a1510" opacity="0.06" />
      <ellipse cx="190" cy="275" rx="0.8" ry="0.5" fill="#1a1510" opacity="0.06" />
      <ellipse cx="200" cy="276" rx="0.8" ry="0.5" fill="#1a1510" opacity="0.05" />
      {/* Boot prints — churned mud along the track edges */}
      <g opacity="0.06">
        <ellipse cx="170" cy="266" rx="1" ry="0.6" fill="#0e0c08" />
        <ellipse cx="176" cy="267" rx="1" ry="0.6" fill="#0e0c08" />
        <ellipse cx="220" cy="274" rx="1" ry="0.6" fill="#0e0c08" />
        <ellipse cx="260" cy="268" rx="1" ry="0.6" fill="#0e0c08" />
        <ellipse cx="290" cy="266" rx="1" ry="0.6" fill="#0e0c08" />
      </g>
      {/* Dusty track surface — worn smoother from heavy traffic */}
      <path d="M100 266 Q140 272 180 270 Q220 278 260 274 Q300 266 340 270"
        fill="#2a2215" opacity="0.04" />

      {/* ===== STONE WALL REMNANTS — battle-scarred, running along hillside ===== */}
      {/* Low dry-stone wall — left section, with cannonball breach */}
      <g opacity="0.6">
        <path d="M220 252 L222 247 L228 246 L234 248 L238 246 L244 248 L248 245 L254 247 L258 245 L264 248 L266 252"
          fill="#2a2518" stroke="#3a3528" strokeWidth="0.6" />
        {/* Mortar lines — individual stone courses */}
        <line x1="228" y1="246" x2="228" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.35" />
        <line x1="238" y1="246" x2="238" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.35" />
        <line x1="248" y1="245" x2="248" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.35" />
        <line x1="258" y1="245" x2="258" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        <line x1="225" y1="250" x2="262" y2="250" stroke="#3a3528" strokeWidth="0.3" opacity="0.25" />
        {/* Cannonball impact — breach in the wall */}
        <ellipse cx="251" cy="248" rx="4" ry="3" fill="#151210" opacity="0.4" />
        {/* Rubble scatter from collapse */}
        <ellipse cx="270" cy="253" rx="5" ry="2.5" fill="#2a2518" opacity="0.45" />
        <ellipse cx="275" cy="254" rx="3.5" ry="1.8" fill="#2a2518" opacity="0.4" />
        <ellipse cx="268" cy="255" rx="2" ry="1.2" fill="#2a2518" opacity="0.35" />
        {/* Musket ball chips in stone face */}
        <circle cx="236" cy="248" r="0.6" fill="#1a1510" opacity="0.3" />
        <circle cx="243" cy="249" r="0.5" fill="#1a1510" opacity="0.25" />
      </g>
      {/* Stone wall — right section, better preserved but scarred */}
      <g opacity="0.55">
        <path d="M565 250 L567 245 L573 244 L579 245 L585 243 L591 245 L597 243 L603 245 L608 248 L608 252 L565 252 Z"
          fill="#2a2518" stroke="#3a3528" strokeWidth="0.6" />
        <line x1="573" y1="244" x2="573" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.35" />
        <line x1="585" y1="243" x2="585" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.35" />
        <line x1="597" y1="243" x2="597" y2="252" stroke="#3a3528" strokeWidth="0.3" opacity="0.3" />
        <line x1="569" y1="249" x2="605" y2="249" stroke="#3a3528" strokeWidth="0.3" opacity="0.25" />
        {/* Scorch mark on wall — from nearby cannon fire */}
        <ellipse cx="590" cy="247" rx="5" ry="3" fill="#151210" opacity="0.1" />
        {/* Soldier leaning against the wall — exhausted silhouette */}
        <path d="M575 250 Q574 244 575 238 Q576 236 577 238 L578 244 Q578 248 577 252" fill="#151510" opacity="0.4" />
        <circle cx="576" cy="235" r="2.5" fill="#151510" opacity="0.4" />
      </g>

      {/* ===== OVERRUN CAMP — abandoned Austrian bivouac on the hillside (Detail Pass 15) ===== */}
      {/* Collapsed tent — canvas draped over broken poles */}
      <g opacity="0.45">
        {/* Tent canvas — sagging, half-collapsed */}
        <path d="M395 242 Q400 234 405 238 Q410 232 415 242 L413 246 L397 246 Z"
          fill="#2a2818" stroke="#3a3525" strokeWidth="0.4" />
        {/* Broken tent pole sticking out */}
        <line x1="400" y1="234" x2="398" y2="228" stroke="#2a2015" strokeWidth="0.8" />
        {/* Second collapsed tent — more wrecked */}
        <path d="M425 244 Q428 240 432 243 L431 247 L426 247 Z"
          fill="#2a2818" opacity="0.6" stroke="#3a3525" strokeWidth="0.3" />
        {/* Canvas torn and trailing */}
        <path d="M415 243 Q420 245 425 244" fill="none" stroke="#2a2515" strokeWidth="0.6" opacity="0.35" />
      </g>

      {/* Scattered camp debris — cooking pot, firewood */}
      <g opacity="0.4">
        {/* Overturned cooking kettle */}
        <ellipse cx="408" cy="250" rx="4" ry="2.5" fill="#1a1810" stroke="#2a2518" strokeWidth="0.5" />
        <path d="M404 250 Q408 248 412 250" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.4" />
        {/* Firewood ring — scattered stones from the campfire */}
        <circle cx="418" cy="252" r="1.2" fill="#2a2518" opacity="0.4" />
        <circle cx="421" cy="254" r="1" fill="#2a2518" opacity="0.35" />
        <circle cx="416" cy="255" r="1.1" fill="#2a2518" opacity="0.38" />
        <circle cx="424" cy="252" r="0.9" fill="#2a2518" opacity="0.32" />
        {/* Ash circle — dead campfire remains */}
        <ellipse cx="420" cy="253" rx="5" ry="3" fill="#1e1a12" opacity="0.15" />
        {/* Smoldering ember glow from the overrun camp */}
        <ellipse cx="420" cy="253" rx="3" ry="1.5" fill="url(#ch7_campFireSmolder)">
          <animate attributeName="opacity" values="1;0.5;1" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Thin wisp of smoke from dead campfire */}
        <path d="M420 250 Q418 242 421 232" fill="none" stroke="#5a4a3a" strokeWidth="0.6" opacity="0.04">
          <animate attributeName="d" values="M420 250 Q418 242 421 232;M420 250 Q422 242 419 232;M420 250 Q418 242 421 232" dur="6s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ===== ABANDONED POSITION MARKERS — stakes and flags from Austrian line (Detail Pass 15) ===== */}
      {/* Austrian position marker stake — white-painted, tilted */}
      <g opacity="0.35">
        <line x1="355" y1="256" x2="353" y2="240" stroke="#4a4a3a" strokeWidth="1" />
        {/* Tattered white marker cloth */}
        <path d="M353 240 L360 242 Q358 244 360 246 L353 244 Z" fill="#4a4a3a" opacity="0.5" />
      </g>
      {/* Second position marker — broken off at ground level */}
      <g opacity="0.3">
        <line x1="475" y1="245" x2="474" y2="238" stroke="#4a4a3a" strokeWidth="0.8" />
        {/* Just a stump remaining */}
        <line x1="476" y1="248" x2="476" y2="245" stroke="#4a4a3a" strokeWidth="1" opacity="0.4" />
      </g>

      {/* ===== ARTILLERY SCORCH MARKS — where cannonballs struck the hillside (Detail Pass 15) ===== */}
      {/* Cannonball impact crater — dark scorched earth */}
      <ellipse cx="340" cy="265" rx="6" ry="3" fill="#0e0c08" opacity="0.2" />
      <ellipse cx="340" cy="265" rx="4" ry="2" fill="#0a0808" opacity="0.15" />
      {/* Dirt splash pattern around crater */}
      <path d="M335 263 Q333 261 332 259" fill="none" stroke="#2a2215" strokeWidth="0.4" opacity="0.12" />
      <path d="M345 263 Q347 261 348 259" fill="none" stroke="#2a2215" strokeWidth="0.4" opacity="0.1" />
      <path d="M338 262 Q337 260 338 258" fill="none" stroke="#2a2215" strokeWidth="0.3" opacity="0.1" />
      {/* Second impact scar — smaller, glancing hit */}
      <ellipse cx="560" cy="255" rx="4" ry="2" fill="#0e0c08" opacity="0.15" />
      {/* Scattered earth clods from impacts */}
      <ellipse cx="337" cy="260" rx="1.5" ry="1" fill="#2a2215" opacity="0.12" />
      <ellipse cx="343" cy="261" rx="1" ry="0.8" fill="#2a2215" opacity="0.1" />

      {/* ===== CAVALRY TRACKS — hoofprints cutting across the hillside (Detail Pass 15) ===== */}
      {/* Series of hoofprints in soft earth — diagonal path */}
      <g opacity="0.1">
        <ellipse cx="440" cy="258" rx="1" ry="0.7" fill="#0e0c08" />
        <ellipse cx="444" cy="256" rx="1" ry="0.7" fill="#0e0c08" />
        <ellipse cx="448" cy="254" rx="1" ry="0.7" fill="#0e0c08" />
        <ellipse cx="452" cy="252" rx="1" ry="0.7" fill="#0e0c08" />
        <ellipse cx="456" cy="250" rx="1" ry="0.7" fill="#0e0c08" />
        <ellipse cx="460" cy="248" rx="1" ry="0.7" fill="#0e0c08" />
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

      {/* ===== SUNKEN ROAD — partially hidden infantry path worn into the hillside (Detail Pass 15) ===== */}
      {/* Worn path cut into the slope — soldiers have been using this for hours */}
      <path d="M0 255 Q60 258 120 252 Q180 248 240 255 Q280 260 320 254"
        fill="none" stroke="#1a1510" strokeWidth="3" opacity="0.08" />
      <path d="M0 256 Q60 259 120 253 Q180 249 240 256 Q280 261 320 255"
        fill="none" stroke="#1a1510" strokeWidth="1.5" opacity="0.05" />

      {/* ===== ABANDONED EARTHWORK — shallow trench dug by Austrian rearguard (Detail Pass 15) ===== */}
      <g opacity="0.35">
        {/* Trench depression */}
        <path d="M465 254 Q475 258 485 254 Q495 250 505 254 Q515 258 525 254"
          fill="url(#ch7_ditchShadow)" />
        {/* Spoil heap — earth piled behind trench */}
        <path d="M465 252 Q475 249 485 252 Q495 249 505 252 Q515 249 525 252"
          fill="#222015" opacity="0.25" />
        {/* Abandoned gabion — wicker basket filled with earth */}
        <ellipse cx="480" cy="251" rx="3" ry="2" fill="#1e1a10" stroke="#2a2515" strokeWidth="0.4" />
        <ellipse cx="488" cy="250" rx="2.5" ry="1.8" fill="#1e1a10" stroke="#2a2515" strokeWidth="0.3" />
        {/* Discarded Austrian cartridge box near the trench */}
        <rect x="502" y="252" width="4" height="3" fill="#1a1510" opacity="0.3" rx="0.5" />
      </g>

      {/* ===== BROKEN VINEYARD — grapevines torn down by troops (Detail Pass 15) ===== */}
      <g opacity="0.3">
        {/* Vineyard support posts — some standing, some broken */}
        <line x1="290" y1="260" x2="290" y2="253" stroke="#2a2015" strokeWidth="0.6" />
        <line x1="298" y1="261" x2="297" y2="254" stroke="#2a2015" strokeWidth="0.6" />
        <line x1="306" y1="260" x2="306" y2="255" stroke="#2a2015" strokeWidth="0.6" />
        {/* Broken post — snapped halfway */}
        <line x1="314" y1="261" x2="313" y2="258" stroke="#2a2015" strokeWidth="0.6" />
        {/* Wire / rope sagging between posts */}
        <path d="M290 255 Q294 257 298 255 Q302 257 306 255" fill="none" stroke="#2a2518" strokeWidth="0.3" />
        {/* Torn vine trailing on ground */}
        <path d="M306 256 Q310 259 314 261 Q318 263 322 261" fill="none" stroke="#2a3518" strokeWidth="0.4" />
        {/* Trampled grape clusters on ground */}
        <ellipse cx="310" cy="262" rx="1.5" ry="1" fill="#1a1020" opacity="0.25" />
        <ellipse cx="295" cy="262" rx="1" ry="0.8" fill="#1a1020" opacity="0.2" />
      </g>

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

      {/* ===== FOREGROUND CYPRESS TREE — tall dark spire framing right side ===== */}
      <g>
        {/* Trunk — tall, dark, straight */}
        <path d="M780 400 Q779 370 780 340 Q780 310 779 280 Q779 255 780 230 Q780 205 779 180"
          fill="none" stroke="#0a1206" strokeWidth="4" strokeLinecap="round" />
        {/* Inner trunk detail */}
        <path d="M781 395 Q780 360 781 330 Q781 300 780 270 Q780 240 781 210"
          fill="none" stroke="#081008" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        {/* Narrow conical foliage — the characteristic cypress shape */}
        <ellipse cx="780" cy="280" rx="6" ry="45" fill="#0a1406" opacity="0.85" />
        <ellipse cx="780" cy="240" rx="5" ry="35" fill="#081008" opacity="0.7" />
        <ellipse cx="780" cy="200" rx="4" ry="25" fill="#0a1406" opacity="0.6" />
        {/* Pointed tip */}
        <ellipse cx="780" cy="178" rx="2.5" ry="10" fill="#081008" opacity="0.55" />
        {/* Branch texture — dark vertical streaks */}
        <path d="M776 300 Q778 280 777 260" fill="none" stroke="#061006" strokeWidth="1.5" opacity="0.3" />
        <path d="M783 310 Q782 290 783 270" fill="none" stroke="#061006" strokeWidth="1.2" opacity="0.25" />
      </g>

      {/* ===== SECOND FOREGROUND CYPRESS — slightly shorter, left of the main one ===== */}
      <g opacity="0.7">
        <path d="M755 400 Q754 375 755 350 Q755 325 754 300 Q754 278 755 256 Q755 238 754 220"
          fill="none" stroke="#0a1206" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="755" cy="310" rx="5" ry="38" fill="#0a1406" opacity="0.75" />
        <ellipse cx="755" cy="270" rx="4" ry="28" fill="#081008" opacity="0.6" />
        <ellipse cx="755" cy="235" rx="3" ry="18" fill="#0a1406" opacity="0.5" />
        <ellipse cx="755" cy="220" rx="2" ry="8" fill="#081008" opacity="0.45" />
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

      {/* ===== DISTANT BATTLEFIELD FIRES — scattered across the plain below, grim orange dots ===== */}
      <ellipse cx="150" cy="225" rx="5" ry="2.5" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.7;0.35;0.7" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="300" cy="230" rx="4" ry="2" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="222" rx="4.5" ry="2.2" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.65;0.35;0.65" dur="4.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="580" cy="228" rx="3.5" ry="1.8" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.55;0.25;0.55" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="225" rx="3" ry="1.5" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.5;0.25;0.5" dur="5.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Additional fire — far left hillside */}
      <ellipse cx="50" cy="228" rx="2.5" ry="1.2" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire cluster — ammunition or supply depot burning */}
      <ellipse cx="480" cy="226" rx="5" ry="2.5" fill="url(#ch7_distantFire)">
        <animate attributeName="opacity" values="0.55;0.25;0.55" dur="3.5s" repeatCount="indefinite" />
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

      {/* ===== CAMPFIRE — low tired flames, the only warmth in the August dark ===== */}
      {/* Wide ambient fire glow on ground — warmth pool */}
      <ellipse cx="420" cy="310" rx="45" ry="12" fill="url(#ch7_fireGlow)">
        <animate attributeName="rx" values="45;50;45" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner ground glow — brighter */}
      <ellipse cx="420" cy="310" rx="20" ry="6" fill="#c06020" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Embers / low coals — pulsing hot */}
      <ellipse cx="420" cy="308" rx="10" ry="4" fill="#b04820" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="418" cy="309" rx="5" ry="2" fill="#d06025" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Flame tongues — flickering, tired but alive */}
      <path d="M417 306 Q418 294 420 306" fill="#d07830" opacity="0.6">
        <animate attributeName="d" values="M417 306 Q418 294 420 306;M417 306 Q419 291 420 306;M417 306 Q418 294 420 306" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M421 305 Q422 296 424 305" fill="#c06828" opacity="0.45">
        <animate attributeName="d" values="M421 305 Q422 296 424 305;M421 305 Q423 293 424 305;M421 305 Q422 296 424 305" dur="0.7s" repeatCount="indefinite" />
      </path>
      <path d="M414 307 Q415 300 417 307" fill="#b05820" opacity="0.35">
        <animate attributeName="d" values="M414 307 Q415 300 417 307;M414 307 Q416 298 417 307;M414 307 Q415 300 417 307" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M424 306 Q425 300 426 306" fill="#a05018" opacity="0.3">
        <animate attributeName="d" values="M424 306 Q425 300 426 306;M424 306 Q426 298 426 306;M424 306 Q425 300 426 306" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Campfire smoke column — rising, lazy in the still air */}
      <path d="M420 295 Q418 275 420 255" fill="none" stroke="#5a4a3a" strokeWidth="2" opacity="0.1">
        <animate attributeName="d" values="M420 295 Q418 275 420 255;M420 295 Q422 275 418 255;M420 295 Q418 275 420 255" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M420 260 Q417 240 420 218" fill="none" stroke="#5a4a3a" strokeWidth="3" opacity="0.04">
        <animate attributeName="d" values="M420 260 Q417 240 420 218;M420 260 Q423 240 418 218;M420 260 Q417 240 420 218" dur="8s" repeatCount="indefinite" />
      </path>
      {/* Fire-lit sparks rising from embers */}
      <circle cx="419" cy="304" r="0.5" fill="#e08030" opacity="0.5">
        <animate attributeName="cy" values="304;285;265" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="422" cy="305" r="0.4" fill="#d07028" opacity="0.4">
        <animate attributeName="cy" values="305;288;270" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.25;0" dur="4s" repeatCount="indefinite" />
      </circle>

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

      {/* ===== LAYERED SMOKE BANKS — dense ground-hugging battle haze (Detail Pass 15) ===== */}
      {/* Heavy smoke bank caught in a valley depression — center-left */}
      <ellipse cx="220" cy="225" rx="55" ry="8" fill="url(#ch7_cannonSmoke)" opacity="0.5">
        <animate attributeName="cx" values="220;235;220" dur="18s" repeatCount="indefinite" />
        <animate attributeName="rx" values="55;65;55" dur="18s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke tendrils creeping up the hillside from the valley */}
      <path d="M200 230 Q210 235 215 240 Q220 245 225 252" fill="none" stroke="#5a4a3a" strokeWidth="3" opacity="0.04">
        <animate attributeName="d" values="M200 230 Q210 235 215 240 Q220 245 225 252;M200 230 Q212 237 218 242 Q223 247 228 254;M200 230 Q210 235 215 240 Q220 245 225 252" dur="12s" repeatCount="indefinite" />
      </path>
      <path d="M580 225 Q575 232 570 240 Q568 246 565 252" fill="none" stroke="#5a4a3a" strokeWidth="2.5" opacity="0.035">
        <animate attributeName="d" values="M580 225 Q575 232 570 240 Q568 246 565 252;M580 225 Q578 234 574 242 Q570 248 568 255;M580 225 Q575 232 570 240 Q568 246 565 252" dur="14s" repeatCount="indefinite" />
      </path>
      {/* High-altitude smoke haze drifting right — carried by thermal */}
      <ellipse cx="400" cy="190" rx="150" ry="10" fill="#5a4a3a" opacity="0.025">
        <animate attributeName="cx" values="400;430;400" dur="20s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== DISTANT CANNON FLASH — periodic burst on the far plain (Detail Pass 15) ===== */}
      {/* Single distant cannon firing — reflected flash on the ground haze */}
      <ellipse cx="350" cy="228" rx="5" ry="2.5" fill="url(#ch7_muzzleFlash)">
        <animate attributeName="opacity" values="0;0;0;0;0.35;0;0;0;0;0;0;0" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Second distant flash — off to the right, different rhythm */}
      <ellipse cx="650" cy="224" rx="4" ry="2" fill="url(#ch7_muzzleFlash)">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0.3;0;0;0;0" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Tiny flash cluster — battery firing in sequence far away */}
      <circle cx="130" cy="226" r="1.5" fill="#e0a040" opacity="0">
        <animate attributeName="opacity" values="0;0;0.25;0;0;0;0;0;0;0" dur="15s" repeatCount="indefinite" />
      </circle>
      <circle cx="138" cy="225.5" r="1.2" fill="#e0a040" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.2;0;0;0;0;0;0" dur="15s" repeatCount="indefinite" />
      </circle>
      <circle cx="146" cy="226" r="1" fill="#e0a040" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0.18;0;0;0;0;0" dur="15s" repeatCount="indefinite" />
      </circle>

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

      {/* ===== DISCARDED AUSTRIAN EQUIPMENT — overrun position debris (Detail Pass 15) ===== */}
      {/* Austrian pack — leather, abandoned in flight */}
      <rect x="630" y="332" width="8" height="6" fill="#1e1a12" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" rx="0.5"
        transform="rotate(-8 634 335)" />
      {/* Austrian cartridge pouch — white leather, distinctive */}
      <rect x="645" y="336" width="5" height="3.5" fill="#3a3830" opacity="0.2" rx="0.5" />
      {/* Broken sabre — blade snapped */}
      <line x1="650" y1="340" x2="660" y2="337" stroke="#4a4540" strokeWidth="0.8" opacity="0.2" />
      <line x1="660" y1="337" x2="662" y2="338" stroke="#2a2015" strokeWidth="1.2" opacity="0.2" />

      {/* ===== GROUND SCORCHING — near cannon wheel, powder burns (Detail Pass 15) ===== */}
      <ellipse cx="205" cy="295" rx="10" ry="4" fill="#0e0c08" opacity="0.06" />

      {/* ===== BLOOD-STAINED BANDAGE STRIPS — grim ground detail (Detail Pass 15) ===== */}
      {/* Discarded bandage near the surgeon's area */}
      <path d="M35 300 Q40 298 45 300 Q48 302 50 300" fill="none" stroke="#3a2018" strokeWidth="0.8" opacity="0.15" />
      {/* Blood trail across the rock */}
      <path d="M60 292 Q65 294 70 292" fill="none" stroke="#3a1510" strokeWidth="0.5" opacity="0.08" />

      {/* ===== FOREGROUND DARK GROUND — dust and trampled earth ===== */}
      <path d="M0 340 Q200 335 400 340 Q600 345 800 338 L800 400 L0 400 Z"
        fill="url(#ch7_ground)" />
      {/* Warm firelight wash on near ground — campfire reflecting off dust */}
      <ellipse cx="420" cy="360" rx="80" ry="20" fill="#803818" opacity="0.03" />
      {/* Dusty surface texture */}
      <ellipse cx="200" cy="370" rx="40" ry="8" fill="#1a1608" opacity="0.05" />
      <ellipse cx="600" cy="365" rx="35" ry="7" fill="#1a1608" opacity="0.04" />

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

      {/* ===== SUPPLY COLUMN — mules and wagons on the hillside track (Detail Pass 15) ===== */}
      <g opacity="0.3">
        {/* Lead mule silhouette — small, sturdy */}
        <path d="M370 238 Q373 236 376 236 Q378 236 379 238 L377 239 L372 239 Z" fill="#151210" />
        <path d="M374 236 Q373 234 374 233" fill="none" stroke="#151210" strokeWidth="0.5" />
        {/* Pack on mule back */}
        <rect x="373" y="234" width="4" height="2.5" fill="#1e1a12" opacity="0.5" rx="0.5" />
        {/* Second mule — following */}
        <path d="M362 239 Q365 237 368 237 Q370 237 371 239 L369 240 L364 240 Z" fill="#151210" opacity="0.8" />
        <rect x="365" y="235" width="3.5" height="2.5" fill="#1e1a12" opacity="0.4" rx="0.5" />
        {/* Muleteer — walking beside */}
        <line x1="359" y1="240" x2="359" y2="236" stroke="#151510" strokeWidth="1" />
        <circle cx="359" cy="235" r="1" fill="#151510" />
        {/* Trail dust */}
        <ellipse cx="368" cy="236" rx="8" ry="2" fill="url(#ch7_dustCloud)" opacity="0.3" />
      </g>

      {/* ===== SMOKE COLUMNS FROM MULTIPLE HILLSIDE FIRES (Detail Pass 15) ===== */}
      {/* Slow-rising thin smoke from the overrun camp area */}
      <path d="M410 245 Q408 228 412 210" fill="none" stroke="#4a3830" strokeWidth="1.5" opacity="0.06">
        <animate attributeName="d" values="M410 245 Q408 228 412 210;M410 245 Q413 228 409 210;M410 245 Q408 228 412 210" dur="10s" repeatCount="indefinite" />
      </path>
      {/* Smoke from the dead horse carcass area — faint, disturbing */}
      <path d="M135 305 Q133 292 136 278" fill="none" stroke="#4a3830" strokeWidth="0.8" opacity="0.03">
        <animate attributeName="d" values="M135 305 Q133 292 136 278;M135 305 Q137 292 134 278;M135 305 Q133 292 136 278" dur="8s" repeatCount="indefinite" />
      </path>

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

      {/* ===== SIGNAL FLAG POST — French communication marker on the hillcrest (Detail Pass 15) ===== */}
      <g opacity="0.5">
        {/* Tall pole — lashed together from two sections */}
        <line x1="760" y1="235" x2="760" y2="200" stroke="#2a2015" strokeWidth="1.2" />
        {/* Signal flag — red, hanging limp in the still air */}
        <path d="M760 202 L770 204 Q769 207 770 210 L760 208 Z" fill="#5a1820" opacity="0.4">
          <animate attributeName="d" values="M760 202 L770 204 Q769 207 770 210 L760 208 Z;M760 202 L771 205 Q770 207 771 210 L760 208 Z;M760 202 L770 204 Q769 207 770 210 L760 208 Z" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Guide rope at base */}
        <path d="M760 225 Q755 228 752 235" fill="none" stroke="#2a2015" strokeWidth="0.4" opacity="0.3" />
      </g>

      {/* ===== DEAD HORSE — grim battlefield casualty on the hillside (Detail Pass 15) ===== */}
      <g opacity="0.35">
        {/* Body — lying on side, stiff legs */}
        <path d="M120 308 Q130 305 140 308 Q148 310 155 308"
          fill="#151210" stroke="#1a1810" strokeWidth="0.5" />
        {/* Legs — stiffened, protruding */}
        <line x1="125" y1="308" x2="122" y2="315" stroke="#151210" strokeWidth="1.5" />
        <line x1="130" y1="310" x2="128" y2="316" stroke="#151210" strokeWidth="1.5" />
        <line x1="145" y1="310" x2="148" y2="316" stroke="#151210" strokeWidth="1.5" />
        <line x1="150" y1="308" x2="153" y2="315" stroke="#151210" strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="118" cy="310" rx="5" ry="3" fill="#151210" />
        {/* Harness remnants */}
        <path d="M130 306 Q135 304 140 306" fill="none" stroke="#2a2015" strokeWidth="0.4" opacity="0.3" />
      </g>

      {/* ===== BROKEN FENCE LINE — foreground hillside boundary (Detail Pass 15) ===== */}
      <g opacity="0.35">
        {/* Standing post */}
        <line x1="440" y1="310" x2="440" y2="300" stroke="url(#ch7_fencePost)" strokeWidth="1.2" />
        {/* Tilted post */}
        <line x1="455" y1="312" x2="453" y2="302" stroke="url(#ch7_fencePost)" strokeWidth="1.2" />
        {/* Fallen post — flat on ground */}
        <line x1="468" y1="308" x2="478" y2="310" stroke="#2a2015" strokeWidth="1" opacity="0.5" />
        {/* Remaining rail — sagging */}
        <path d="M440 303 Q447 306 455 305" fill="none" stroke="#3a3020" strokeWidth="0.7" />
        {/* Broken rail pieces on ground */}
        <line x1="455" y1="310" x2="462" y2="312" stroke="#3a3020" strokeWidth="0.6" opacity="0.4" />
        <line x1="443" y1="312" x2="450" y2="313" stroke="#3a3020" strokeWidth="0.5" opacity="0.35" />
        {/* Wire tangled around the broken section */}
        <path d="M453 303 Q458 305 462 303 Q466 305 468 308" fill="none" stroke="#3a3525" strokeWidth="0.3" opacity="0.2" />
      </g>

      {/* ===== TRAMPLED GROUND — foreground area churned by troops (Detail Pass 15) ===== */}
      {/* Bare earth patches where soldiers gathered */}
      <ellipse cx="420" cy="315" rx="25" ry="6" fill="#1a1510" opacity="0.06" />
      <ellipse cx="300" cy="310" rx="18" ry="4" fill="#1a1510" opacity="0.05" />
      {/* Footprint impressions in the soft ground */}
      <g opacity="0.05">
        <ellipse cx="400" cy="312" rx="1.2" ry="0.7" fill="#0e0c08" />
        <ellipse cx="406" cy="314" rx="1.2" ry="0.7" fill="#0e0c08" />
        <ellipse cx="412" cy="313" rx="1.2" ry="0.7" fill="#0e0c08" />
        <ellipse cx="418" cy="315" rx="1.2" ry="0.7" fill="#0e0c08" />
        <ellipse cx="424" cy="314" rx="1.2" ry="0.7" fill="#0e0c08" />
        <ellipse cx="430" cy="316" rx="1.2" ry="0.7" fill="#0e0c08" />
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

      {/* ===== DISTANT ROLLING HILLS — visible beyond the foreground ground (Detail Pass 15) ===== */}
      {/* Gentle undulation of the near hillside — contour lines */}
      <path d="M0 350 Q80 345 160 352 Q240 358 320 348 Q400 342 480 350 Q560 356 640 346 Q720 340 800 348"
        fill="none" stroke="#1e1a10" strokeWidth="0.5" opacity="0.06" />
      <path d="M0 365 Q100 360 200 368 Q300 375 400 362 Q500 355 600 365 Q700 372 800 360"
        fill="none" stroke="#1e1a10" strokeWidth="0.4" opacity="0.04" />

      {/* ===== FOREGROUND TRAMPLED AREA — more defined tracks (Detail Pass 15) ===== */}
      {/* Wider worn path in the foreground — troops mustered here */}
      <path d="M280 355 Q320 352 360 358 Q400 362 440 355 Q480 350 520 355"
        fill="#1a1510" opacity="0.04" />
      {/* Individual boot prints in the foreground soil */}
      <g opacity="0.04">
        <ellipse cx="300" cy="355" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="310" cy="358" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="330" cy="354" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="350" cy="360" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="370" cy="356" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="390" cy="362" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="410" cy="357" rx="1.5" ry="0.8" fill="#0e0c08" />
        <ellipse cx="440" cy="354" rx="1.5" ry="0.8" fill="#0e0c08" />
      </g>

      {/* ===== DRIFTING GUNPOWDER SMELL HAZE — final atmospheric layer (Detail Pass 15) ===== */}
      {/* Very subtle grey haze — the acrid smell of gunpowder hanging in the still air */}
      <rect x="0" y="210" width="800" height="130" fill="#5a4a3a" opacity="0.012">
        <animate attributeName="opacity" values="0.012;0.018;0.012" dur="10s" repeatCount="indefinite" />
      </rect>

      {/* ===== DISTANT LIGHTNING-LIKE FLASH — powder magazine explosion far away (Detail Pass 15) ===== */}
      {/* Rare, dramatic flash on the distant horizon — a munitions store going up */}
      <ellipse cx="180" cy="118" rx="8" ry="4" fill="#e0a848" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0.25;0.4;0.15;0;0;0;0;0;0;0;0;0" dur="30s" repeatCount="indefinite" />
      </ellipse>
      {/* Secondary flash glow on underside of clouds */}
      <ellipse cx="180" cy="80" rx="40" ry="8" fill="#c07030" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0.02;0.04;0.015;0;0;0;0;0;0;0;0;0" dur="30s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ENHANCED LAKE GARDA RIPPLES — more detailed water surface ===== */}
      {/* Concentric ripple rings near the boats — disturbance patterns */}
      <ellipse cx="215" cy="168" rx="8" ry="1.5" fill="none" stroke="#5a4540" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="rx" values="8;14;20" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.04;0" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="430" cy="178" rx="6" ry="1.2" fill="none" stroke="#5a4540" strokeWidth="0.25" opacity="0.06">
        <animate attributeName="rx" values="6;12;18" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Dense ripple field across central lake surface */}
      <path d="M100 160 Q115 158 130 160 Q145 162 160 160" fill="none" stroke="#5a4a3a" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="d" values="M100 160 Q115 158 130 160 Q145 162 160 160;M100 160 Q115 162 130 160 Q145 158 160 160;M100 160 Q115 158 130 160 Q145 162 160 160" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M280 172 Q300 170 320 172 Q340 174 360 172" fill="none" stroke="#4a3a35" strokeWidth="0.35" opacity="0.09">
        <animate attributeName="d" values="M280 172 Q300 170 320 172 Q340 174 360 172;M280 172 Q300 174 320 172 Q340 170 360 172;M280 172 Q300 170 320 172 Q340 174 360 172" dur="2.3s" repeatCount="indefinite" />
      </path>
      <path d="M500 165 Q520 163 540 165 Q560 167 580 165" fill="none" stroke="#4a3a35" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="d" values="M500 165 Q520 163 540 165 Q560 167 580 165;M500 165 Q520 167 540 165 Q560 163 580 165;M500 165 Q520 163 540 165 Q560 167 580 165" dur="2.6s" repeatCount="indefinite" />
      </path>
      <path d="M650 175 Q670 173 690 175 Q710 177 730 175" fill="none" stroke="#4a3a35" strokeWidth="0.25" opacity="0.07">
        <animate attributeName="d" values="M650 175 Q670 173 690 175 Q710 177 730 175;M650 175 Q670 177 690 175 Q710 173 730 175;M650 175 Q670 173 690 175 Q710 177 730 175" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Deeper water colour gradation toward lake center */}
      <ellipse cx="400" cy="185" rx="200" ry="15" fill="#1a1835" opacity="0.06" />
      {/* Orange sunset reflection fragments — broken by ripples */}
      <ellipse cx="370" cy="160" rx="12" ry="1" fill="#c07030" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.03;0.08" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="rx" values="12;15;12" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="165" rx="10" ry="0.8" fill="#d08838" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="1.9s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="390" cy="170" rx="8" ry="0.7" fill="#c07030" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.02;0.05" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Dark mountain reflection in still water — faint mirrored ridgeline */}
      <path d="M50 155 Q150 148 250 152 Q350 145 450 150 Q550 146 650 152 Q720 148 800 155"
        fill="none" stroke="#1a1525" strokeWidth="1" opacity="0.06" />
      {/* Smoke reflection on lake surface — mirrored haze */}
      <ellipse cx="250" cy="168" rx="40" ry="3" fill="#4a3830" opacity="0.03">
        <animate attributeName="cx" values="250;260;250" dur="14s" repeatCount="indefinite" />
      </ellipse>
      {/* Village fire reflection — orange shimmer on water */}
      <ellipse cx="250" cy="155" rx="6" ry="2" fill="#c06020" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ENHANCED SKY — fiery, dramatic, the heavens ablaze ===== */}
      {/* Low horizon glow band — searing hot orange strip above mountains */}
      <rect x="0" y="100" width="800" height="22" fill="#d06818" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.08;0.06" dur="6s" repeatCount="indefinite" />
      </rect>
      {/* Wispy high cirrus catching last light — very high, thin blood-streaks */}
      <path d="M30 8 Q100 5 180 10 Q260 6 340 9 Q400 5 460 10" fill="none" stroke="#5a1a2a" strokeWidth="0.8" opacity="0.15" />
      <path d="M420 5 Q500 3 580 7 Q650 4 720 8 Q770 5 800 7" fill="none" stroke="#4a1222" strokeWidth="0.6" opacity="0.12" />
      <path d="M200 15 Q280 12 360 16 Q420 12 500 15" fill="none" stroke="#3a1020" strokeWidth="0.5" opacity="0.1" />
      {/* Sun pillar effect — vertical column of light above the setting sun */}
      <rect x="414" y="80" width="12" height="40" fill="#c07030" opacity="0.03" rx="4">
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="5s" repeatCount="indefinite" />
      </rect>
      {/* Additional fiery cloudlets scattered across mid-sky */}
      <ellipse cx="160" cy="82" rx="22" ry="6" fill="#6a2835" opacity="0.12" />
      <ellipse cx="680" cy="78" rx="18" ry="5" fill="#5a2230" opacity="0.1" />
      <ellipse cx="280" cy="72" rx="15" ry="4" fill="#5a1e2a" opacity="0.11" />
      <ellipse cx="500" cy="76" rx="20" ry="5" fill="#4a1a28" opacity="0.09" />
      {/* Dramatic red-orange sky glow between clouds — the sky is on fire */}
      <ellipse cx="420" cy="95" rx="100" ry="8" fill="#b04820" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.07;0.05" dur="7s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== THIRD VILLAGE SILHOUETTE — lakeside fishing hamlet ===== */}
      <g opacity="0.25">
        {/* Low stone houses along the waterline */}
        <rect x="510" y="140" width="8" height="4" fill="#2a1a28" />
        <path d="M509 140 L514 137 L519 140 Z" fill="#2a1a28" opacity="0.8" />
        <rect x="520" y="141" width="6" height="3" fill="#2a1a28" opacity="0.7" />
        <path d="M519 141 L523 139 L527 141 Z" fill="#2a1a28" opacity="0.6" />
        <rect x="528" y="141.5" width="5" height="2.5" fill="#2a1a28" opacity="0.55" />
        {/* Small pier extending into the lake */}
        <line x1="518" y1="145" x2="518" y2="152" stroke="#2a1a28" strokeWidth="0.6" opacity="0.3" />
        <line x1="523" y1="145" x2="523" y2="150" stroke="#2a1a28" strokeWidth="0.5" opacity="0.25" />
        <line x1="517" y1="148" x2="524" y2="147" stroke="#2a1a28" strokeWidth="0.4" opacity="0.2" />
        {/* Tiny window light — someone home, warm glow */}
        <rect x="512" y="141" width="1.2" height="1" fill="#c08040" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.08;0.15" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* ===== ARTILLERY LIMBER ON HILLSIDE TRACK — horse team pulling a gun uphill ===== */}
      <g opacity="0.4">
        {/* Two draught horses — straining uphill */}
        {/* Lead horse */}
        <path d="M240 268 Q243 265 247 265 Q250 265 252 268 Q253 270 251 271 L243 271 Q241 270 240 268 Z" fill="#151210" />
        <path d="M245 265 Q244 262 245 260" fill="none" stroke="#151210" strokeWidth="0.8" />
        <circle cx="245" cy="259.5" r="1.2" fill="#151210" />
        {/* Wheel horse */}
        <path d="M254 269 Q257 266 261 266 Q264 266 266 269 Q267 271 265 272 L257 272 Q255 271 254 269 Z" fill="#151210" />
        <path d="M259 266 Q258 263 259 261" fill="none" stroke="#151210" strokeWidth="0.8" />
        <circle cx="259" cy="260.5" r="1.2" fill="#151210" />
        {/* Traces connecting to limber */}
        <line x1="252" y1="270" x2="254" y2="269" stroke="#151210" strokeWidth="0.4" />
        <line x1="266" y1="271" x2="270" y2="272" stroke="#151210" strokeWidth="0.4" />
        {/* Limber — small two-wheeled cart carrying ammunition chest */}
        <rect x="270" y="268" width="8" height="5" fill="#1e1a12" stroke="#2a2015" strokeWidth="0.4" rx="0.5" />
        <circle cx="272" cy="275" r="2.5" fill="none" stroke="#2a2015" strokeWidth="0.8" />
        <circle cx="276" cy="275" r="2.5" fill="none" stroke="#2a2015" strokeWidth="0.8" />
        {/* Cannon barrel trailing behind limber */}
        <line x1="278" y1="271" x2="292" y2="274" stroke="#2a2015" strokeWidth="1.5" opacity="0.6" />
        {/* Cannon trail wheels */}
        <circle cx="290" cy="277" r="3" fill="none" stroke="#2a2015" strokeWidth="0.8" />
        {/* Driver on limber seat */}
        <line x1="270" y1="268" x2="270" y2="263" stroke="#151510" strokeWidth="1" />
        <circle cx="270" cy="262" r="1.2" fill="#151510" />
        {/* Dust kicked up by horses */}
        <ellipse cx="248" cy="265" rx="10" ry="3" fill="url(#ch7_dustCloud)" opacity="0.3">
          <animate attributeName="rx" values="10;14;10" dur="5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== ADDITIONAL ROCKY OUTCROPS — more prominent foreground terrain ===== */}
      {/* Large angular boulder cluster — center foreground */}
      <g>
        <path d="M340 345 Q346 335 358 338 Q365 330 372 340 Q378 335 382 345 L375 352 L345 350 Z"
          fill="#1e1a12" stroke="#2a2518" strokeWidth="0.5" opacity="0.6" />
        {/* Rock face detail — cracks and weathering */}
        <path d="M348 340 Q350 345 352 348" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.25" />
        <path d="M362 336 Q365 342 366 348" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.2" />
        {/* Lichen patch on rock — subtle colour variation */}
        <ellipse cx="355" cy="340" rx="4" ry="2.5" fill="#2a2818" opacity="0.15" />
      </g>
      {/* Flat embedded rock — near center path */}
      <path d="M460 340 Q468 336 478 338 Q484 342 476 346 L462 345 Z"
        fill="#1a1810" stroke="#252015" strokeWidth="0.4" opacity="0.45" />
      {/* Pebble scatter — near the campfire area */}
      <ellipse cx="400" cy="320" rx="1.8" ry="1" fill="#2a2518" opacity="0.3" />
      <ellipse cx="396" cy="322" rx="1.5" ry="0.8" fill="#252015" opacity="0.25" />
      <ellipse cx="404" cy="318" rx="1.2" ry="0.7" fill="#2a2518" opacity="0.28" />
      <ellipse cx="440" cy="315" rx="2" ry="1" fill="#1e1a12" opacity="0.25" />
      <ellipse cx="435" cy="318" rx="1.5" ry="0.8" fill="#252015" opacity="0.22" />
      {/* Exposed rock shelf — dry, cracked earth revealing bedrock */}
      <path d="M550 335 Q570 330 590 335 L588 340 L552 340 Z"
        fill="#1e1a10" stroke="#2a2518" strokeWidth="0.4" opacity="0.35" />
      <path d="M560 335 Q565 333 570 335" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.15" />
      <path d="M575 334 Q578 332 582 335" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.12" />

      {/* ===== PARCHED EARTH TEXTURE — dry cracked ground in the heat ===== */}
      {/* Desiccation cracks in exposed earth — foreground */}
      <g opacity="0.06">
        <path d="M350 355 L355 352 L360 356 L358 360 L352 358 Z" fill="none" stroke="#0e0c08" strokeWidth="0.4" />
        <path d="M355 352 L357 348" fill="none" stroke="#0e0c08" strokeWidth="0.3" />
        <path d="M360 356 L364 354" fill="none" stroke="#0e0c08" strokeWidth="0.3" />
        <path d="M352 358 L348 360" fill="none" stroke="#0e0c08" strokeWidth="0.3" />
      </g>
      <g opacity="0.05">
        <path d="M500 345 L505 342 L510 346 L507 350 L502 348 Z" fill="none" stroke="#0e0c08" strokeWidth="0.4" />
        <path d="M505 342 L508 339" fill="none" stroke="#0e0c08" strokeWidth="0.3" />
        <path d="M510 346 L514 344" fill="none" stroke="#0e0c08" strokeWidth="0.3" />
      </g>
      {/* Dry dusty patches on hillside — bare earth where nothing grows */}
      <ellipse cx="300" cy="342" rx="15" ry="4" fill="#1a1510" opacity="0.04" />
      <ellipse cx="530" cy="335" rx="12" ry="3" fill="#1a1510" opacity="0.035" />

      {/* ===== ADDITIONAL SCRUB VEGETATION — thorny Mediterranean shrubs ===== */}
      {/* Gorse bush — spiky, dark, left of campfire */}
      <g opacity="0.45">
        <ellipse cx="365" cy="310" rx="8" ry="5" fill="#162010" />
        <path d="M360 307 Q358 303 360 300" fill="none" stroke="#1a2510" strokeWidth="0.5" opacity="0.4" />
        <path d="M367 305 Q370 302 368 298" fill="none" stroke="#1a2510" strokeWidth="0.5" opacity="0.35" />
        <path d="M372 308 Q375 305 373 302" fill="none" stroke="#1a2510" strokeWidth="0.4" opacity="0.3" />
      </g>
      {/* Low juniper — dense, dark, near right stone wall */}
      <ellipse cx="610" cy="258" rx="10" ry="4.5" fill="#121a08" opacity="0.4" />
      <ellipse cx="616" cy="256" rx="6" ry="3" fill="#162010" opacity="0.35" />
      {/* Dried bramble tangle — near the stretcher */}
      <g opacity="0.3">
        <path d="M540 275 Q545 270 550 275 Q555 268 560 272" fill="none" stroke="#2a2515" strokeWidth="0.6" />
        <path d="M543 272 Q548 268 553 273" fill="none" stroke="#2a2515" strokeWidth="0.5" opacity="0.7" />
        {/* Thorns — tiny projections */}
        <path d="M545 271 L546 269" fill="none" stroke="#2a2515" strokeWidth="0.3" />
        <path d="M552 269 L553 267" fill="none" stroke="#2a2515" strokeWidth="0.3" />
      </g>
      {/* Wild grass clump — foreground center, more prominent tufts */}
      <path d="M420 350 Q421 340 422 332" fill="none" stroke="#2a3015" strokeWidth="0.6" opacity="0.25" />
      <path d="M423 351 Q425 342 426 334" fill="none" stroke="#2a3015" strokeWidth="0.5" opacity="0.22" />
      <path d="M418 352 Q416 343 417 335" fill="none" stroke="#2a3015" strokeWidth="0.5" opacity="0.2" />
      <path d="M425 350 Q428 341 427 333" fill="none" stroke="#2a3015" strokeWidth="0.5" opacity="0.2" />
      <path d="M416 350 Q413 342 414 336" fill="none" stroke="#2a3015" strokeWidth="0.4" opacity="0.18" />

      {/* ===== ADDITIONAL SMOKE — thicker battlefield haze drifting over hillside ===== */}
      {/* Heavy smoke bank rolling up from the plain — caught in evening thermals */}
      <ellipse cx="350" cy="235" rx="80" ry="12" fill="#4a3830" opacity="0.03">
        <animate attributeName="cx" values="350;375;350" dur="22s" repeatCount="indefinite" />
        <animate attributeName="rx" values="80;95;80" dur="22s" repeatCount="indefinite" />
      </ellipse>
      {/* Wispy smoke tendril drifting across the lake */}
      <path d="M200 150 Q250 148 300 152 Q350 148 400 150"
        fill="none" stroke="#4a3830" strokeWidth="1.5" opacity="0.025">
        <animate attributeName="d" values="M200 150 Q250 148 300 152 Q350 148 400 150;M200 150 Q250 152 300 148 Q350 152 400 150;M200 150 Q250 148 300 152 Q350 148 400 150" dur="16s" repeatCount="indefinite" />
      </path>
      {/* Smoke from burning village drifting across the mountains */}
      <ellipse cx="280" cy="110" rx="50" ry="5" fill="#3a2a20" opacity="0.04">
        <animate attributeName="cx" values="280;320;280" dur="18s" repeatCount="indefinite" />
        <animate attributeName="rx" values="50;65;50" dur="18s" repeatCount="indefinite" />
      </ellipse>
      {/* Ground-level smoke creeping through foreground rocks */}
      <ellipse cx="50" cy="355" rx="25" ry="4" fill="#5a4a3a" opacity="0.02">
        <animate attributeName="cx" values="50;60;50" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="350" rx="20" ry="3.5" fill="#5a4a3a" opacity="0.018">
        <animate attributeName="cx" values="700;710;700" dur="14s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ADDITIONAL EXHAUSTED SOLDIERS — more figures showing the toll of battle ===== */}
      {/* Soldier 10 — sitting cross-legged near the campfire, staring blankly */}
      <g opacity="0.7">
        <path d="M440 300 Q438 294 440 288 Q441 285 443 288 L444 294 Q445 298 444 302 L440 302 Z"
          fill="#151510" />
        <circle cx="441" cy="283" r="3.8" fill="#151510" />
        {/* Legs crossed */}
        <path d="M437 300 Q434 304 430 302" fill="none" stroke="#151510" strokeWidth="2" opacity="0.55" />
        <path d="M445 300 Q448 304 452 302" fill="none" stroke="#151510" strokeWidth="2" opacity="0.55" />
        {/* Hands on knees */}
        <path d="M436 295 Q433 298 432 302" fill="none" stroke="#151510" strokeWidth="1.2" opacity="0.45" />
        <path d="M446 295 Q449 298 450 302" fill="none" stroke="#151510" strokeWidth="1.2" opacity="0.45" />
      </g>

      {/* Soldier 11 — leaning on musket like a crutch, one leg bandaged, near track */}
      <g opacity="0.65">
        <path d="M500 288 Q498 278 500 270 Q502 266 504 270 L505 278 Q506 284 505 292 L500 292 Z"
          fill="#151510" />
        <circle cx="502" cy="265" r="4" fill="#151510" />
        {/* Musket as crutch — angled support */}
        <line x1="508" y1="268" x2="514" y2="294" stroke="#1a1a12" strokeWidth="1.2" opacity="0.5" />
        {/* Leaning heavily on it */}
        <path d="M506 275 Q510 278 512 282" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.45" />
        {/* Bandaged leg visible */}
        <path d="M498 290 Q496 296 498 302" fill="none" stroke="#151510" strokeWidth="2.2" opacity="0.5" />
        <path d="M497 294 Q499 294 501 294" fill="none" stroke="#4a4a3a" strokeWidth="0.6" opacity="0.2" />
        <path d="M497 298 Q499 298 501 298" fill="none" stroke="#4a4a3a" strokeWidth="0.6" opacity="0.18" />
      </g>

      {/* Soldier 12 — curled on his side in a fetal position, deeply asleep or worse */}
      <g opacity="0.55">
        <path d="M680 305 Q690 302 700 305 Q705 308 700 310 L682 310 Q678 308 680 305 Z"
          fill="#151510" />
        <circle cx="676" cy="306" r="3.5" fill="#151510" />
        {/* Arm curled under head */}
        <path d="M678 308 Q676 310 674 308" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.4" />
        {/* Musket dropped beside him */}
        <line x1="686" y1="313" x2="710" y2="315" stroke="#1a1a12" strokeWidth="1" opacity="0.3" />
      </g>

      {/* ===== GROUND TEXTURE DETAIL — scattered debris and earth features ===== */}
      {/* Dried blood stain on rock — from battle earlier */}
      <ellipse cx="96" cy="258" rx="5" ry="3" fill="#3a1510" opacity="0.06" />
      {/* Spent musket flints — tiny chips of stone near cartridge cases */}
      <path d="M300 275 L302 274 L303 276 Z" fill="#3a3525" opacity="0.15" />
      <path d="M308 277 L310 276 L311 278 Z" fill="#3a3525" opacity="0.12" />
      {/* Furrow marks in earth — cannon dragged through here */}
      <path d="M220 290 Q240 294 260 290" fill="none" stroke="#151210" strokeWidth="0.5" opacity="0.06" />
      <path d="M222 292 Q242 296 262 292" fill="none" stroke="#151210" strokeWidth="0.5" opacity="0.05" />
      {/* Scorch marks from campfire sparks */}
      <ellipse cx="415" cy="320" rx="3" ry="1.5" fill="#0e0c08" opacity="0.04" />
      <ellipse cx="425" cy="318" rx="2" ry="1" fill="#0e0c08" opacity="0.035" />
      {/* Dry ant trail — barely visible dark line across a rock face */}
      <path d="M345 348 Q348 346 352 348 Q356 350 360 348" fill="none" stroke="#0e0c08" strokeWidth="0.2" opacity="0.04" />

      {/* ===== ATMOSPHERIC OVERLAYS ===== */}

      {/* Warm tint over entire scene — oppressive Italian summer heat */}
      <rect width="800" height="400" fill="#902818" opacity="0.04" />

      {/* Secondary warm overlay — heavier on the lower half where the ground radiates heat */}
      <rect x="0" y="200" width="800" height="200" fill="#803018" opacity="0.025" />

      {/* Smoke-tinged atmosphere — the haze of battle lingers in the still air */}
      <rect x="0" y="80" width="800" height="250" fill="#4a3828" opacity="0.02">
        <animate attributeName="opacity" values="0.02;0.035;0.02" dur="12s" repeatCount="indefinite" />
      </rect>

      {/* Orange horizon glow band — the sun scorches the horizon line */}
      <rect x="0" y="100" width="800" height="25" fill="#c05818" opacity="0.035">
        <animate attributeName="opacity" values="0.035;0.05;0.035" dur="5s" repeatCount="indefinite" />
      </rect>

      {/* Vignette — heavy and suffocating */}
      <rect width="800" height="400" fill="url(#ch7_vignette)" />

      {/* Top darkening — night encroaching */}
      <rect x="0" y="0" width="800" height="25" fill="#06030e" opacity="0.4" />
      {/* Bottom darkening — deep shadow at the base */}
      <rect x="0" y="370" width="800" height="30" fill="#060606" opacity="0.55" />
    </svg>
  );
}
