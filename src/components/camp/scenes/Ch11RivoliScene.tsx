import React from 'react';

/**
 * Ch.11 — Rivoli, Alpine plateau winter battle (14 January 1797)
 * Dawn breaking over snow-covered Alpine plateau. Bitter cold, thin mountain air.
 * French positions on high ground overlooking Austrian columns in valley below.
 * Bare rocky peaks, frozen streams, scattered pines heavy with snow.
 * Gun batteries positioned on ridges, smoke from campfires and cannon fire,
 * soldiers huddled around fires, Napoleon on horseback observing terrain.
 * Distant Austrian columns advancing through gorges, powder smoke drifting,
 * wounded being evacuated, ammunition wagons, scattered equipment in snow.
 * Mood: Cold determination, decisive moment, dawn of victory.
 */
export function Ch11RivoliScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Winter dawn sky — cold blue-grey with warm sunrise band */}
        <linearGradient id="ch11_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12121e" />
          <stop offset="10%" stopColor="#181a28" />
          <stop offset="22%" stopColor="#1e2232" />
          <stop offset="36%" stopColor="#28303c" />
          <stop offset="50%" stopColor="#384550" />
          <stop offset="62%" stopColor="#504858" />
          <stop offset="72%" stopColor="#6a5548" />
          <stop offset="82%" stopColor="#956845" />
          <stop offset="90%" stopColor="#b07840" />
          <stop offset="96%" stopColor="#c88a48" />
          <stop offset="100%" stopColor="#d89850" />
        </linearGradient>
        {/* Furthest mountains — blue-grey, washed out by atmosphere */}
        <linearGradient id="ch11_farthestMountains" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="50%" stopColor="#3a4558" />
          <stop offset="100%" stopColor="#2a3548" />
        </linearGradient>
        {/* Distant mountains — layered depth */}
        <linearGradient id="ch11_distMountains" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4050" />
          <stop offset="50%" stopColor="#2a3040" />
          <stop offset="100%" stopColor="#1a2030" />
        </linearGradient>
        {/* Mid mountains — slightly lighter */}
        <linearGradient id="ch11_midMountains" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5060" />
          <stop offset="40%" stopColor="#3a4050" />
          <stop offset="100%" stopColor="#2a3040" />
        </linearGradient>
        {/* Near mountains — snow-capped peaks */}
        <linearGradient id="ch11_nearMountains" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8090" />
          <stop offset="25%" stopColor="#5a6070" />
          <stop offset="60%" stopColor="#4a5060" />
          <stop offset="100%" stopColor="#3a4050" />
        </linearGradient>
        {/* Snow on peaks — bright white-blue, gleaming in first light */}
        <linearGradient id="ch11_snowPeak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8eef4" />
          <stop offset="35%" stopColor="#d0d8e0" />
          <stop offset="70%" stopColor="#b0b8c4" />
          <stop offset="100%" stopColor="#9098a8" />
        </linearGradient>
        {/* Dawn-kissed snow — warm tint on east-facing peaks */}
        <linearGradient id="ch11_snowPeakWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0dcc0" />
          <stop offset="40%" stopColor="#d8c0a8" />
          <stop offset="100%" stopColor="#b0a090" />
        </linearGradient>
        {/* Ground snow — textured white-grey */}
        <linearGradient id="ch11_groundSnow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9aa8b0" />
          <stop offset="50%" stopColor="#8a98a8" />
          <stop offset="100%" stopColor="#7a8898" />
        </linearGradient>
        {/* Rocky outcrop — dark grey-brown */}
        <linearGradient id="ch11_rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3838" />
          <stop offset="50%" stopColor="#2a2828" />
          <stop offset="100%" stopColor="#1a1818" />
        </linearGradient>
        {/* Dawn glow — warm light breaking over eastern horizon (right side) */}
        <radialGradient id="ch11_dawnGlow" cx="0.7" cy="0.55" r="0.5">
          <stop offset="0%" stopColor="#e8a858" stopOpacity="0.65" />
          <stop offset="15%" stopColor="#d89850" stopOpacity="0.48" />
          <stop offset="35%" stopColor="#c08040" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#a06838" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#806038" stopOpacity="0" />
        </radialGradient>
        {/* Secondary dawn glow — broader warm wash on eastern sky */}
        <radialGradient id="ch11_dawnGlow2" cx="0.72" cy="0.55" r="0.65">
          <stop offset="0%" stopColor="#d88050" stopOpacity="0.35" />
          <stop offset="20%" stopColor="#c86840" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#a85030" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#905030" stopOpacity="0" />
        </radialGradient>
        {/* Dawn horizon band — concentrated warm strip right of center */}
        <linearGradient id="ch11_dawnBand" x1="0.25" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c86840" stopOpacity="0" />
          <stop offset="20%" stopColor="#c86840" stopOpacity="0.12" />
          <stop offset="45%" stopColor="#d88858" stopOpacity="0.38" />
          <stop offset="65%" stopColor="#e09060" stopOpacity="0.35" />
          <stop offset="80%" stopColor="#d07848" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#c86840" stopOpacity="0.08" />
        </linearGradient>
        {/* Dawn core — bright point on horizon where sun is about to rise */}
        <radialGradient id="ch11_dawnCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0c878" stopOpacity="0.55" />
          <stop offset="20%" stopColor="#e0b060" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#d09850" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b08040" stopOpacity="0" />
        </radialGradient>
        {/* Campfire glow — warm orange */}
        <radialGradient id="ch11_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e89838" stopOpacity="0.7" />
          <stop offset="25%" stopColor="#d07828" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#b06020" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#904810" stopOpacity="0" />
        </radialGradient>
        {/* Cannon flash — bright muzzle flash */}
        <radialGradient id="ch11_cannonFlash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f8b850" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#e09840" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c07830" stopOpacity="0" />
        </radialGradient>
        {/* Powder smoke — thick grey-white */}
        <radialGradient id="ch11_smoke" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#a8b0b8" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#889098" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#687078" stopOpacity="0" />
        </radialGradient>
        {/* Morning mist — low-lying fog in valleys */}
        <linearGradient id="ch11_mist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a7080" stopOpacity="0" />
          <stop offset="20%" stopColor="#6a7080" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#6a7080" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#6a7080" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6a7080" stopOpacity="0" />
        </linearGradient>
        {/* Ice on rocks — frozen sheen */}
        <linearGradient id="ch11_ice" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8898a8" stopOpacity="0" />
          <stop offset="50%" stopColor="#8898a8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8898a8" stopOpacity="0" />
        </linearGradient>
        {/* Pine needles — dark green-grey */}
        <linearGradient id="ch11_pine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3828" />
          <stop offset="100%" stopColor="#1a2818" />
        </linearGradient>
        {/* Frozen stream — icy blue-grey */}
        <linearGradient id="ch11_frozenStream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8898" />
          <stop offset="50%" stopColor="#6a7888" />
          <stop offset="100%" stopColor="#5a6878" />
        </linearGradient>
        {/* Vignette */}
        <radialGradient id="ch11_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
        {/* Sunbeam — dawn light rays through clouds (from east/right) */}
        <linearGradient id="ch11_sunbeam" x1="0.7" y1="0.8" x2="0.5" y2="0.3">
          <stop offset="0%" stopColor="#d8a060" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#b08848" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#906838" stopOpacity="0" />
        </linearGradient>
        {/* Mountain rim light — warm backlit edge from dawn */}
        <linearGradient id="ch11_rimLight" x1="0.3" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c87850" stopOpacity="0" />
          <stop offset="30%" stopColor="#c87850" stopOpacity="0.1" />
          <stop offset="55%" stopColor="#d89060" stopOpacity="0.3" />
          <stop offset="75%" stopColor="#e0a068" stopOpacity="0.28" />
          <stop offset="90%" stopColor="#d08858" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c87850" stopOpacity="0.08" />
        </linearGradient>
        {/* Mountain mist — dawn fog at mountain base */}
        <linearGradient id="ch11_mountainMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a7a70" stopOpacity="0" />
          <stop offset="30%" stopColor="#8a8078" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#8a8078" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8a8078" stopOpacity="0" />
        </linearGradient>
        {/* Snow warm tint — dawn reflection on ground snow */}
        <radialGradient id="ch11_snowWarm" cx="0.65" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#d08050" stopOpacity="0.1" />
          <stop offset="40%" stopColor="#c87850" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#c87850" stopOpacity="0" />
        </radialGradient>
        {/* Snow drift pattern — textured accumulation */}
        <radialGradient id="ch11_snowDrift" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#c8d0d8" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#a8b0b8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8890a0" stopOpacity="0" />
        </radialGradient>
        {/* Frost shimmer — sparkling ice crystals */}
        <pattern id="ch11_frost" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="5" r="0.5" fill="#e8f0f8" opacity="0.3" />
          <circle cx="12" cy="3" r="0.4" fill="#e0e8f0" opacity="0.25" />
          <circle cx="20" cy="9" r="0.45" fill="#e8f0f8" opacity="0.35" />
          <circle cx="7" cy="14" r="0.35" fill="#e0e8f0" opacity="0.2" />
          <circle cx="16" cy="18" r="0.5" fill="#e8f0f8" opacity="0.28" />
          <circle cx="22" cy="21" r="0.3" fill="#f0f4f8" opacity="0.22" />
          <circle cx="1" cy="20" r="0.4" fill="#e8f0f8" opacity="0.18" />
        </pattern>
        {/* Boot tracks in snow — trampled paths */}
        <linearGradient id="ch11_tracks" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a7888" />
          <stop offset="100%" stopColor="#5a6878" />
        </linearGradient>
        {/* Blood in snow — dark crimson stains */}
        <radialGradient id="ch11_blood" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4a1818" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#3a1010" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a0808" stopOpacity="0" />
        </radialGradient>
        {/* Ground texture — rocky snow-covered earth */}
        <filter id="ch11_groundNoise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="97" result="noise" />
          <feColorMatrix type="saturate" values="0.3" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
        </filter>
        {/* Mountain rock texture */}
        <filter id="ch11_rockTexture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="5" seed="14" result="noise" />
          <feColorMatrix type="saturate" values="0.2" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
        </filter>
        {/* Distant gun flash — enemy batteries */}
        <radialGradient id="ch11_distFlash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e8a850" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d09040" stopOpacity="0" />
        </radialGradient>
        {/* Alpine wind snow — blowing powder */}
        <pattern id="ch11_windSnow" x="0" y="0" width="60" height="40" patternUnits="userSpaceOnUse">
          <line x1="5" y1="8" x2="12" y2="10" stroke="#c8d0d8" strokeWidth="0.4" opacity="0.15" />
          <line x1="18" y1="5" x2="25" y2="7" stroke="#c8d0d8" strokeWidth="0.3" opacity="0.12" />
          <line x1="30" y1="12" x2="38" y2="14" stroke="#c8d0d8" strokeWidth="0.35" opacity="0.18" />
          <line x1="45" y1="9" x2="52" y2="11" stroke="#c8d0d8" strokeWidth="0.3" opacity="0.1" />
          <line x1="10" y1="25" x2="17" y2="27" stroke="#c8d0d8" strokeWidth="0.35" opacity="0.14" />
          <line x1="35" y1="28" x2="42" y2="30" stroke="#c8d0d8" strokeWidth="0.4" opacity="0.16" />
          <line x1="50" y1="22" x2="57" y2="24" stroke="#c8d0d8" strokeWidth="0.3" opacity="0.11" />
        </pattern>
        {/* Tricolor flag — French standard */}
        <linearGradient id="ch11_tricolor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a3060" stopOpacity="0.75" />
          <stop offset="33%" stopColor="#1a3060" stopOpacity="0.75" />
          <stop offset="34%" stopColor="#d8d8d0" stopOpacity="0.65" />
          <stop offset="66%" stopColor="#d8d8d0" stopOpacity="0.65" />
          <stop offset="67%" stopColor="#a82020" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a82020" stopOpacity="0.7" />
        </linearGradient>
        {/* Breath vapor — cold air */}
        <radialGradient id="ch11_breath" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b8c0c8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a8b0b8" stopOpacity="0" />
        </radialGradient>
        {/* Cannon barrel — iron grey */}
        <linearGradient id="ch11_cannonBarrel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a48" />
          <stop offset="50%" stopColor="#3a3a38" />
          <stop offset="100%" stopColor="#2a2a28" />
        </linearGradient>
        {/* Wooden carriage — weathered oak */}
        <linearGradient id="ch11_woodCarriage" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3028" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>
        {/* Snow shadow — blue-tinted shade */}
        <linearGradient id="ch11_snowShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5868" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3a4858" stopOpacity="0.15" />
        </linearGradient>
        {/* Bivouac tent — canvas grey */}
        <linearGradient id="ch11_tent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8a80" />
          <stop offset="100%" stopColor="#6a6a60" />
        </linearGradient>
        {/* Atmospheric haze — distance fading */}
        <linearGradient id="ch11_haze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a6070" stopOpacity="0.05" />
          <stop offset="30%" stopColor="#5a6070" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#5a6070" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5a6070" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch11_sky)" />

      {/* === STARS — January pre-dawn Alpine sky === */}
      {/* Bright stars in upper western sky (left, furthest from dawn) */}
      <circle cx="45" cy="22" r="1.2" fill="#d8e0f0" opacity="0.7" />
      <circle cx="120" cy="40" r="0.8" fill="#c8d0e8" opacity="0.5" />
      <circle cx="180" cy="15" r="1.0" fill="#d0d8e8" opacity="0.6" />
      <circle cx="250" cy="55" r="0.7" fill="#c0c8d8" opacity="0.4" />
      <circle cx="90" cy="70" r="0.9" fill="#d0d8e8" opacity="0.55" />
      <circle cx="310" cy="30" r="0.6" fill="#c8d0e0" opacity="0.35" />
      <circle cx="160" cy="90" r="0.7" fill="#c0c8d8" opacity="0.3" />
      <circle cx="30" cy="95" r="0.8" fill="#c8d0e0" opacity="0.4" />
      <circle cx="220" cy="78" r="0.5" fill="#b8c0d0" opacity="0.3" />
      <circle cx="70" cy="48" r="1.1" fill="#d8e0f0" opacity="0.65" />
      {/* Faint stars mid-sky — fading into dawn */}
      <circle cx="380" cy="45" r="0.5" fill="#c0c8d0" opacity="0.2" />
      <circle cx="440" cy="25" r="0.6" fill="#c0c8d0" opacity="0.15" />
      <circle cx="350" cy="72" r="0.4" fill="#b8c0c8" opacity="0.15" />

      {/* Broad secondary dawn wash — eastern sky, extends high */}
      <ellipse cx="600" cy="200" rx="380" ry="220" fill="url(#ch11_dawnGlow2)" />

      {/* Primary dawn glow breaking over eastern horizon */}
      <ellipse cx="580" cy="200" rx="300" ry="140" fill="url(#ch11_dawnGlow)" />

      {/* Concentrated warm band along horizon line */}
      <rect x="0" y="170" width="800" height="80" fill="url(#ch11_dawnBand)" />

      {/* Dawn core — bright point on horizon where sun is about to rise */}
      <ellipse cx="620" cy="205" rx="110" ry="50" fill="url(#ch11_dawnCore)" />

      {/* Bright horizon line — thin burning strip where sky meets mountains */}
      <rect x="350" y="202" width="450" height="6" fill="url(#ch11_dawnBand)" opacity="0.6" />
      <line x1="450" y1="205" x2="800" y2="205" stroke="rgba(240,190,100,0.12)" strokeWidth="2" />

      {/* Sunbeam rays through clouds — from east (right side) */}
      <polygon
        points="555,220 575,80 600,80 580,220"
        fill="url(#ch11_sunbeam)"
        opacity="0.8"
      />
      <polygon
        points="620,220 655,100 680,100 645,220"
        fill="url(#ch11_sunbeam)"
        opacity="0.65"
      />
      <polygon
        points="495,220 508,110 530,110 517,220"
        fill="url(#ch11_sunbeam)"
        opacity="0.5"
      />
      {/* Fourth sunbeam — wider, fainter, spreading left */}
      <polygon
        points="440,220 445,140 465,140 460,220"
        fill="url(#ch11_sunbeam)"
        opacity="0.3"
      />

      {/* === DISTANT MOUNTAINS (5 layers for depth) === */}
      {/* Layer 0: Furthest ghost peaks — barely visible, atmospheric blue */}
      <polygon
        points="0,195 60,165 120,180 180,150 260,170 340,140 420,158 500,142 580,160 660,148 740,162 800,145 800,280 0,280"
        fill="url(#ch11_farthestMountains)"
        opacity="0.3"
      />

      {/* Layer 1: Distant peaks */}
      <polygon
        points="0,205 80,168 140,185 200,160 280,178 350,150 420,170 480,155 560,172 640,160 720,170 800,155 800,280 0,280"
        fill="url(#ch11_distMountains)"
        opacity="0.45"
      />

      {/* Layer 2: Distant range */}
      <polygon
        points="0,220 60,185 130,200 210,175 290,195 380,170 460,190 540,175 620,185 700,180 780,190 800,185 800,280 0,280"
        fill="url(#ch11_distMountains)"
        opacity="0.65"
      />

      {/* Layer 3: Mid-range mountains */}
      <polygon
        points="0,240 50,205 110,225 180,200 250,220 330,195 410,215 490,205 570,210 650,205 730,215 800,205 800,280 0,280"
        fill="url(#ch11_midMountains)"
        opacity="0.85"
      />

      {/* Layer 4: Near mountains with snow caps */}
      <polygon
        points="0,260 70,220 150,245 240,215 320,240 420,210 520,235 600,225 680,230 760,225 800,230 800,280 0,280"
        fill="url(#ch11_nearMountains)"
        filter="url(#ch11_rockTexture)"
      />

      {/* Snow caps on near mountains — enlarged, gleaming */}
      <polygon points="70,220 55,228 85,232 78,223" fill="url(#ch11_snowPeak)" />
      <polygon points="150,245 136,253 164,256 157,247" fill="url(#ch11_snowPeak)" />
      <polygon points="240,215 224,223 256,228 248,217" fill="url(#ch11_snowPeak)" />
      <polygon points="320,240 304,248 336,252 328,242" fill="url(#ch11_snowPeak)" />
      <polygon points="420,210 402,218 438,224 428,212" fill="url(#ch11_snowPeak)" />
      {/* Eastern peaks catch warm dawn light */}
      <polygon points="520,235 502,243 538,248 528,237" fill="url(#ch11_snowPeakWarm)" opacity="0.8" />
      <polygon points="520,235 502,243 538,248 528,237" fill="url(#ch11_snowPeak)" opacity="0.5" />
      <polygon points="600,225 584,233 616,238 608,227" fill="url(#ch11_snowPeakWarm)" opacity="0.85" />
      <polygon points="600,225 584,233 616,238 608,227" fill="url(#ch11_snowPeak)" opacity="0.4" />
      <polygon points="680,230 664,238 696,242 688,232" fill="url(#ch11_snowPeakWarm)" opacity="0.9" />
      <polygon points="680,230 664,238 696,242 688,232" fill="url(#ch11_snowPeak)" opacity="0.35" />
      <polygon points="760,225 746,232 774,236 766,227" fill="url(#ch11_snowPeakWarm)" opacity="0.85" />

      {/* Warm rim-light along near mountain ridge — dawn backlighting from east */}
      <polyline
        points="0,260 70,220 150,245 240,215 320,240 420,210 520,235 600,225 680,230 760,225 800,230"
        fill="none"
        stroke="url(#ch11_rimLight)"
        strokeWidth="2.5"
        opacity="0.8"
      />
      {/* Stronger rim glow on eastern (right) peaks */}
      <polyline
        points="520,235 600,225 680,230 760,225 800,230"
        fill="none"
        stroke="rgba(220,140,70,0.4)"
        strokeWidth="3"
      />
      {/* Bright edge highlight — sun just catching the ridgeline */}
      <polyline
        points="600,225 680,230 760,225 800,230"
        fill="none"
        stroke="rgba(240,180,100,0.25)"
        strokeWidth="1.5"
      />
      {/* Warm rim-light along mid-range mountains */}
      <polyline
        points="0,240 50,205 110,225 180,200 250,220 330,195 410,215 490,205 570,210 650,205 730,215 800,205"
        fill="none"
        stroke="url(#ch11_rimLight)"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Dawn mist band at mountain base — alpine fog where peaks meet plateau */}
      <rect x="0" y="255" width="800" height="35" fill="url(#ch11_mountainMist)" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.7;0.9" dur="15s" repeatCount="indefinite" />
      </rect>

      {/* Valley mist — low-lying fog */}
      <rect x="0" y="240" width="800" height="60" fill="url(#ch11_mist)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.6;0.8" dur="12s" repeatCount="indefinite" />
      </rect>

      {/* === MIDDLE GROUND: PLATEAU AND BATTLEFIELD === */}
      {/* Snowy plateau ground */}
      <ellipse cx="400" cy="350" rx="500" ry="80" fill="url(#ch11_groundSnow)" filter="url(#ch11_groundNoise)" />

      {/* Frost shimmer on snow */}
      <rect x="0" y="280" width="800" height="120" fill="url(#ch11_frost)" opacity="0.6" />

      {/* Dawn warm tint on snow — subtle reflection of sunrise */}
      <rect x="0" y="280" width="800" height="120" fill="url(#ch11_snowWarm)" />

      {/* Rocky outcrops — left side */}
      <ellipse cx="120" cy="310" rx="45" ry="35" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" />
      <ellipse cx="145" cy="315" rx="30" ry="25" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" />
      <ellipse cx="95" cy="318" rx="25" ry="20" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" />

      {/* Ice on rocks */}
      <ellipse cx="120" cy="305" rx="35" ry="5" fill="url(#ch11_ice)" opacity="0.6" />
      <ellipse cx="145" cy="310" rx="22" ry="4" fill="url(#ch11_ice)" opacity="0.5" />

      {/* Rocky outcrops — right side */}
      <ellipse cx="680" cy="305" rx="50" ry="40" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" />
      <ellipse cx="715" cy="312" rx="35" ry="28" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" />
      <ellipse cx="650" cy="315" rx="28" ry="22" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" />

      {/* Ice on right rocks */}
      <ellipse cx="680" cy="300" rx="38" ry="6" fill="url(#ch11_ice)" opacity="0.6" />
      <ellipse cx="715" cy="307" rx="26" ry="5" fill="url(#ch11_ice)" opacity="0.5" />

      {/* Frozen stream — cutting across plateau */}
      <path
        d="M 0,340 Q 150,335 300,338 T 600,342 T 800,345"
        fill="none"
        stroke="url(#ch11_frozenStream)"
        strokeWidth="15"
        opacity="0.7"
      />
      <path
        d="M 0,340 Q 150,335 300,338 T 600,342 T 800,345"
        fill="none"
        stroke="url(#ch11_ice)"
        strokeWidth="12"
        opacity="0.5"
      />

      {/* Snow drifts — accumulated near rocks */}
      <ellipse cx="110" cy="325" rx="60" ry="12" fill="url(#ch11_snowDrift)" opacity="0.8" />
      <ellipse cx="670" cy="322" rx="65" ry="14" fill="url(#ch11_snowDrift)" opacity="0.8" />

      {/* === PINE TREES (snow-laden) === */}
      {/* Left tree cluster */}
      <polygon points="200,280 195,305 205,305" fill="url(#ch11_pine)" opacity="0.8" />
      <polygon points="200,295 192,315 208,315" fill="url(#ch11_pine)" opacity="0.8" />
      <polygon points="200,308 190,325 210,325" fill="url(#ch11_pine)" opacity="0.8" />
      <rect x="198" y="325" width="4" height="15" fill="#2a2018" />
      {/* Snow on branches */}
      <polygon points="200,280 197,283 203,283" fill="#c8d0d8" opacity="0.7" />
      <ellipse cx="195" cy="305" rx="8" ry="3" fill="#b8c0c8" opacity="0.6" />
      <ellipse cx="205" cy="305" rx="7" ry="3" fill="#b8c0c8" opacity="0.6" />

      {/* Right tree cluster */}
      <polygon points="610,285 605,310 615,310" fill="url(#ch11_pine)" opacity="0.8" />
      <polygon points="610,300 602,320 618,320" fill="url(#ch11_pine)" opacity="0.8" />
      <polygon points="610,313 600,330 620,330" fill="url(#ch11_pine)" opacity="0.8" />
      <rect x="608" y="330" width="4" height="15" fill="#2a2018" />
      {/* Snow on branches */}
      <polygon points="610,285 607,288 613,288" fill="#c8d0d8" opacity="0.7" />
      <ellipse cx="605" cy="310" rx="8" ry="3" fill="#b8c0c8" opacity="0.6" />
      <ellipse cx="615" cy="310" rx="7" ry="3" fill="#b8c0c8" opacity="0.6" />

      {/* Distant tree on ridge */}
      <polygon points="480,250 478,262 482,262" fill="url(#ch11_pine)" opacity="0.5" />
      <polygon points="480,258 477,268 483,268" fill="url(#ch11_pine)" opacity="0.5" />

      {/* === FRENCH ARTILLERY BATTERY (left ridge) === */}
      {/* Cannon 1 */}
      <ellipse cx="160" cy="290" rx="12" ry="6" fill="url(#ch11_woodCarriage)" />
      <rect x="160" y="285" width="28" height="4" fill="url(#ch11_cannonBarrel)" />
      <circle cx="152" cy="292" r="4" fill="#3a3a38" />
      <circle cx="168" cy="292" r="4" fill="#3a3a38" />

      {/* Cannon 2 */}
      <ellipse cx="195" cy="295" rx="12" ry="6" fill="url(#ch11_woodCarriage)" />
      <rect x="195" y="290" width="26" height="4" fill="url(#ch11_cannonBarrel)" />
      <circle cx="188" cy="297" r="4" fill="#3a3a38" />
      <circle cx="202" cy="297" r="4" fill="#3a3a38" />

      {/* Cannon flash — firing */}
      <ellipse cx="188" cy="287" rx="8" ry="6" fill="url(#ch11_cannonFlash)" opacity="0.9">
        <animate attributeName="opacity" values="0;0.9;0" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Powder smoke from battery — main cloud */}
      <ellipse cx="175" cy="278" rx="40" ry="22" fill="url(#ch11_smoke)" opacity="0.75">
        <animate attributeName="ry" values="22;30;22" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.75;0.45;0.75" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke wisp 1 — drifting left from battery, catching dawn light */}
      <path
        d="M 160,278 Q 140,270 120,272 Q 100,275 85,268"
        fill="none" stroke="#a8a098" strokeWidth="4" opacity="0.2" strokeLinecap="round"
      >
        <animate attributeName="d"
          values="M 160,278 Q 140,270 120,272 Q 100,275 85,268;
                  M 160,278 Q 138,265 115,268 Q 95,272 78,264;
                  M 160,278 Q 140,270 120,272 Q 100,275 85,268"
          dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.12;0.2" dur="12s" repeatCount="indefinite" />
      </path>
      {/* Smoke wisp 2 — rising thin trail */}
      <path
        d="M 185,275 Q 190,260 183,248 Q 178,238 182,225"
        fill="none" stroke="#9a9590" strokeWidth="3" opacity="0.15" strokeLinecap="round"
      >
        <animate attributeName="d"
          values="M 185,275 Q 190,260 183,248 Q 178,238 182,225;
                  M 185,275 Q 192,258 186,244 Q 180,234 185,220;
                  M 185,275 Q 190,260 183,248 Q 178,238 182,225"
          dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="10s" repeatCount="indefinite" />
      </path>
      {/* Smoke wisp 3 — warm-tinted, catching the dawn from right */}
      <path
        d="M 195,280 Q 210,268 225,270 Q 240,273 255,265"
        fill="none" stroke="#b09880" strokeWidth="3.5" opacity="0.15" strokeLinecap="round"
      >
        <animate attributeName="d"
          values="M 195,280 Q 210,268 225,270 Q 240,273 255,265;
                  M 195,280 Q 212,264 228,266 Q 245,270 262,260;
                  M 195,280 Q 210,268 225,270 Q 240,273 255,265"
          dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="14s" repeatCount="indefinite" />
      </path>

      {/* Gun crew silhouettes */}
      <ellipse cx="170" cy="295" rx="3" ry="8" fill="#2a2a28" opacity="0.7" />
      <circle cx="170" cy="292" r="2.5" fill="#3a3a38" opacity="0.7" />
      <ellipse cx="180" cy="297" rx="3" ry="8" fill="#2a2a28" opacity="0.7" />
      <circle cx="180" cy="294" r="2.5" fill="#3a3a38" opacity="0.7" />
      <ellipse cx="205" cy="300" rx="3" ry="8" fill="#2a2a28" opacity="0.7" />
      <circle cx="205" cy="297" r="2.5" fill="#3a3a38" opacity="0.7" />

      {/* Breath vapor from cold air */}
      <ellipse cx="172" cy="291" rx="3" ry="2" fill="url(#ch11_breath)">
        <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* === CAMPFIRES === */}
      {/* Fire 1 — near left battery */}
      <ellipse cx="135" cy="305" rx="22" ry="15" fill="url(#ch11_fireGlow)" opacity="0.85" />
      <ellipse cx="135" cy="305" rx="5" ry="2.5" fill="#d88838" opacity="0.9">
        <animate attributeName="ry" values="2.5;3.5;2.5" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="135" cy="302" rx="7" ry="4" fill="#e8a048" opacity="0.7">
        <animate attributeName="ry" values="4;5.5;4" dur="1.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Soldiers around fire 1 */}
      <ellipse cx="130" cy="308" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="130" cy="305" r="2" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="140" cy="310" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="140" cy="307" r="2" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="135" cy="312" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="135" cy="309" r="2" fill="#3a3a40" opacity="0.8" />

      {/* Fire 2 — center plateau */}
      <ellipse cx="380" cy="320" rx="26" ry="18" fill="url(#ch11_fireGlow)" opacity="0.85" />
      <ellipse cx="380" cy="320" rx="6" ry="3" fill="#d88838" opacity="0.9">
        <animate attributeName="ry" values="3;4;3" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="380" cy="316" rx="8" ry="4.5" fill="#e8a048" opacity="0.7">
        <animate attributeName="ry" values="4.5;6;4.5" dur="1.8s" repeatCount="indefinite" />
      </ellipse>

      {/* Soldiers around fire 2 */}
      <ellipse cx="372" cy="325" rx="3" ry="8" fill="#2a2a30" opacity="0.8" />
      <circle cx="372" cy="321" r="2.5" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="388" cy="326" rx="3" ry="8" fill="#2a2a30" opacity="0.8" />
      <circle cx="388" cy="322" r="2.5" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="380" cy="328" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="380" cy="325" r="2" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="375" cy="332" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="375" cy="329" r="2" fill="#3a3a40" opacity="0.8" />

      {/* Fire 3 — right side */}
      <ellipse cx="630" cy="318" rx="24" ry="16" fill="url(#ch11_fireGlow)" opacity="0.85" />
      <ellipse cx="630" cy="318" rx="5" ry="2.5" fill="#d88838" opacity="0.9">
        <animate attributeName="ry" values="2.5;3.5;2.5" dur="1.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="630" cy="315" rx="7" ry="4" fill="#e8a048" opacity="0.7">
        <animate attributeName="ry" values="4;5.5;4" dur="1.6s" repeatCount="indefinite" />
      </ellipse>

      {/* === BIVOUAC TENTS === */}
      {/* Tent 1 — triangular canvas */}
      <polygon points="250,315 235,330 265,330" fill="url(#ch11_tent)" opacity="0.8" />
      <polygon points="250,315 235,330 250,330" fill="url(#ch11_snowShadow)" opacity="0.3" />
      <ellipse cx="250" cy="312" rx="12" ry="3" fill="#b8c0c8" opacity="0.6" />

      {/* Tent 2 */}
      <polygon points="285,318 272,332 298,332" fill="url(#ch11_tent)" opacity="0.8" />
      <polygon points="285,318 272,332 285,332" fill="url(#ch11_snowShadow)" opacity="0.3" />
      <ellipse cx="285" cy="315" rx="10" ry="3" fill="#b8c0c8" opacity="0.6" />

      {/* Tent 3 */}
      <polygon points="520,320 507,335 533,335" fill="url(#ch11_tent)" opacity="0.8" />
      <polygon points="520,320 507,335 520,335" fill="url(#ch11_snowShadow)" opacity="0.3" />
      <ellipse cx="520" cy="317" rx="11" ry="3" fill="#b8c0c8" opacity="0.6" />

      {/* === EQUIPMENT IN SNOW === */}
      {/* Stacked muskets — left */}
      <line x1="220" y1="325" x2="218" y2="335" stroke="#3a3a38" strokeWidth="1.5" opacity="0.7" />
      <line x1="224" y1="325" x2="222" y2="335" stroke="#3a3a38" strokeWidth="1.5" opacity="0.7" />
      <line x1="228" y1="325" x2="226" y2="335" stroke="#3a3a38" strokeWidth="1.5" opacity="0.7" />
      <circle cx="224" cy="324" r="2" fill="#4a4a48" opacity="0.7" />

      {/* Stacked muskets — right */}
      <line x1="555" y1="328" x2="553" y2="338" stroke="#3a3a38" strokeWidth="1.5" opacity="0.7" />
      <line x1="559" y1="328" x2="557" y2="338" stroke="#3a3a38" strokeWidth="1.5" opacity="0.7" />
      <line x1="563" y1="328" x2="561" y2="338" stroke="#3a3a38" strokeWidth="1.5" opacity="0.7" />
      <circle cx="559" cy="327" r="2" fill="#4a4a48" opacity="0.7" />

      {/* Ammunition crates */}
      <rect x="310" y="328" width="12" height="8" fill="url(#ch11_woodCarriage)" opacity="0.7" />
      <rect x="324" y="330" width="10" height="7" fill="url(#ch11_woodCarriage)" opacity="0.7" />
      <ellipse cx="317" cy="325" rx="8" ry="2" fill="#b8c0c8" opacity="0.5" />

      {/* Wagon wheel — partial, half-buried in snow */}
      <circle cx="450" cy="335" r="10" fill="none" stroke="url(#ch11_woodCarriage)" strokeWidth="2" opacity="0.6" />
      <line x1="445" y1="330" x2="455" y2="340" stroke="url(#ch11_woodCarriage)" strokeWidth="1.5" opacity="0.6" />
      <line x1="455" y1="330" x2="445" y2="340" stroke="url(#ch11_woodCarriage)" strokeWidth="1.5" opacity="0.6" />
      <circle cx="450" cy="335" r="3" fill="#3a3028" opacity="0.6" />

      {/* === FRENCH FLAG === */}
      {/* Flagpole */}
      <rect x="398" y="268" width="2" height="40" fill="#3a3028" opacity="0.8" />

      {/* Tricolor flag — waving in wind */}
      <path
        d="M 400,270 Q 415,272 430,270 L 430,285 Q 415,287 400,285 Z"
        fill="url(#ch11_tricolor)"
        opacity="0.9"
      >
        <animate attributeName="d"
          values="M 400,270 Q 415,272 430,270 L 430,285 Q 415,287 400,285 Z;
                  M 400,270 Q 415,268 430,270 L 430,285 Q 415,283 400,285 Z;
                  M 400,270 Q 415,272 430,270 L 430,285 Q 415,287 400,285 Z"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* === NAPOLEON ON HORSEBACK (center-right, observing — prominent silhouette) === */}
      {/* Horse body — larger, more defined */}
      <ellipse cx="412" cy="304" rx="18" ry="12" fill="#1a1818" opacity="0.95" />
      <ellipse cx="424" cy="302" rx="8" ry="8" fill="#1a1818" opacity="0.95" />
      {/* Horse legs — thicker */}
      <rect x="400" y="306" width="3" height="12" fill="#141414" opacity="0.95" rx="1" />
      <rect x="407" y="306" width="3" height="12" fill="#141414" opacity="0.95" rx="1" />
      <rect x="418" y="306" width="3" height="11" fill="#141414" opacity="0.95" rx="1" />
      <rect x="425" y="306" width="3" height="11" fill="#141414" opacity="0.95" rx="1" />
      {/* Horse head and neck */}
      <polygon points="430,302 438,295 440,298 432,305" fill="#1a1818" opacity="0.95" />
      <ellipse cx="439" cy="295" rx="4" ry="5" fill="#1a1818" opacity="0.95" />
      {/* Horse tail */}
      <path d="M 394,302 Q 388,305 386,310" fill="none" stroke="#1a1818" strokeWidth="2.5" opacity="0.9" />

      {/* Napoleon silhouette — larger, darker, commanding */}
      <ellipse cx="416" cy="293" rx="5" ry="11" fill="#0e0e18" opacity="0.95" />
      <circle cx="416" cy="287" r="3.5" fill="#121220" opacity="0.95" />
      {/* Bicorne hat — distinctive, larger */}
      <ellipse cx="416" cy="284" rx="7" ry="2.5" fill="#0a0a14" opacity="0.95" />
      {/* Pointing arm / spyglass extended toward enemy */}
      <line x1="420" y1="293" x2="432" y2="290" stroke="#0e0e18" strokeWidth="2" opacity="0.9" />

      {/* Warm dawn backlight rim on figure — silhouette edge glow */}
      <ellipse cx="416" cy="293" rx="6" ry="12" fill="none" stroke="rgba(200,120,60,0.15)" strokeWidth="1.5" />
      <ellipse cx="412" cy="304" rx="19" ry="13" fill="none" stroke="rgba(200,120,60,0.1)" strokeWidth="1" />

      {/* Breath from horse — cold morning */}
      <ellipse cx="441" cy="293" rx="5" ry="3" fill="url(#ch11_breath)">
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="5;7;5" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === WOUNDED/CASUALTIES === */}
      {/* Stretcher bearers — left */}
      <ellipse cx="175" cy="318" rx="3" ry="7" fill="#2a2a30" opacity="0.7" />
      <circle cx="175" cy="315" r="2" fill="#3a3a40" opacity="0.7" />
      <ellipse cx="190" cy="320" rx="3" ry="7" fill="#2a2a30" opacity="0.7" />
      <circle cx="190" cy="317" r="2" fill="#3a3a40" opacity="0.7" />
      {/* Stretcher */}
      <rect x="175" y="322" width="15" height="3" fill="url(#ch11_woodCarriage)" opacity="0.6" />
      {/* Wounded on stretcher */}
      <ellipse cx="182" cy="323" rx="6" ry="2" fill="#3a2828" opacity="0.7" />

      {/* Blood in snow — casualties */}
      <ellipse cx="340" cy="338" rx="8" ry="5" fill="url(#ch11_blood)" opacity="0.6" />
      <ellipse cx="485" cy="340" rx="6" ry="4" fill="url(#ch11_blood)" opacity="0.5" />

      {/* Discarded equipment — broken musket */}
      <line x1="495" y1="335" x2="510" y2="338" stroke="#3a3a38" strokeWidth="2" opacity="0.5" />
      <rect x="494" y="333" width="3" height="3" fill="#2a2018" opacity="0.5" />

      {/* === DISTANT AUSTRIAN POSITIONS === */}
      {/* Enemy gun flash — valley below */}
      <ellipse cx="280" cy="255" rx="6" ry="4" fill="url(#ch11_distFlash)" opacity="0.7">
        <animate attributeName="opacity" values="0;0.7;0" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="540" cy="258" rx="5" ry="3" fill="url(#ch11_distFlash)" opacity="0.6">
        <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite" begin="1s" />
      </ellipse>

      {/* Distant smoke from Austrian batteries */}
      <ellipse cx="290" cy="250" rx="20" ry="10" fill="url(#ch11_smoke)" opacity="0.3">
        <animate attributeName="ry" values="10;14;10" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="550" cy="253" rx="18" ry="9" fill="url(#ch11_smoke)" opacity="0.25">
        <animate attributeName="ry" values="9;13;9" dur="12s" repeatCount="indefinite" />
      </ellipse>

      {/* === ATMOSPHERIC EFFECTS === */}
      {/* Blowing snow — wind-driven powder */}
      <rect x="0" y="0" width="800" height="400" fill="url(#ch11_windSnow)" opacity="0.3">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="60 20"
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Atmospheric haze — distance */}
      <rect x="0" y="200" width="800" height="100" fill="url(#ch11_haze)" opacity="0.6" />

      {/* === FOREGROUND ELEMENTS === */}
      {/* Boot tracks in snow — foreground */}
      <ellipse cx="100" cy="360" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="115" cy="365" rx="7" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="130" cy="362" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="500" cy="368" rx="9" ry="5" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="518" cy="372" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="535" cy="370" rx="9" ry="5" fill="url(#ch11_tracks)" opacity="0.4" />

      {/* Foreground snow drift — large accumulation */}
      <ellipse cx="700" cy="380" rx="120" ry="30" fill="url(#ch11_groundSnow)" opacity="0.9" />
      <ellipse cx="700" cy="375" rx="100" ry="15" fill="url(#ch11_snowDrift)" opacity="0.6" />

      {/* Foreground rock — partially covered */}
      <ellipse cx="80" cy="375" rx="35" ry="25" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" opacity="0.9" />
      <ellipse cx="80" cy="368" rx="30" ry="8" fill="#b8c0c8" opacity="0.7" />

      {/* === VIGNETTE === */}
      <rect width="800" height="400" fill="url(#ch11_vignette)" />
    </svg>
  );
}
