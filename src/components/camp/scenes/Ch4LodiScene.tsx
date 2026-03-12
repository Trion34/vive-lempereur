import React from 'react';

/**
 * Ch.4 — Lodi, river bank (Adda, not Po)
 * Dusk after the famous bridge charge. Wide river, pontoon bridge in distance,
 * artillery silhouettes, evening sky reflected in water.
 * Mood: Triumphant esprit de corps — "Le Petit Caporal" was born here.
 */
export function Ch4LodiScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Dusk sky — deep purple-orange */}
        <linearGradient id="ch4_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12101a" />
          <stop offset="25%" stopColor="#1e1525" />
          <stop offset="45%" stopColor="#351e30" />
          <stop offset="60%" stopColor="#4a3040" />
          <stop offset="75%" stopColor="#6a4038" />
          <stop offset="88%" stopColor="#8a5538" />
          <stop offset="95%" stopColor="#a06838" />
          <stop offset="100%" stopColor="#b87a40" />
        </linearGradient>
        {/* River water — dark, reflective */}
        <linearGradient id="ch4_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3540" />
          <stop offset="20%" stopColor="#352a38" />
          <stop offset="50%" stopColor="#2a2530" />
          <stop offset="80%" stopColor="#251e2a" />
          <stop offset="100%" stopColor="#201a25" />
        </linearGradient>
        {/* Sky reflection in water — warm horizon band (stronger for sunset) */}
        <linearGradient id="ch4_reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0.3" />
          <stop offset="25%" stopColor="#8a5a3a" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#7a4a30" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7a4a30" stopOpacity="0" />
        </linearGradient>
        {/* Bank ground */}
        <linearGradient id="ch4_bank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2518" />
          <stop offset="50%" stopColor="#222015" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Fire glow — larger for celebration */}
        <radialGradient id="ch4_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d09050" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#c08040" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#a06830" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a06830" stopOpacity="0" />
        </radialGradient>
        {/* Distant fire 2 */}
        <radialGradient id="ch4_fire2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Sunset glow on horizon */}
        <radialGradient id="ch4_sunGlow" cx="0.5" cy="0.62" r="0.35">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b87a40" stopOpacity="0" />
        </radialGradient>
        {/* Warm sunset shimmer on water */}
        <linearGradient id="ch4_warmShimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0" />
          <stop offset="30%" stopColor="#c08848" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#d09858" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#c08848" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#b87a40" stopOpacity="0" />
        </linearGradient>
        {/* Powder smoke gradient */}
        <radialGradient id="ch4_smoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#685850" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#584840" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#584840" stopOpacity="0" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id="ch4_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
        {/* Scorch mark gradient — for bridge damage */}
        <radialGradient id="ch4_scorch" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1a1008" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#2a1810" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2a1810" stopOpacity="0" />
        </radialGradient>
        {/* Austrian flag red-white stripes */}
        <linearGradient id="ch4_austrianFlag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a2020" />
          <stop offset="30%" stopColor="#5a2020" />
          <stop offset="33%" stopColor="#8a8070" />
          <stop offset="66%" stopColor="#8a8070" />
          <stop offset="69%" stopColor="#5a2020" />
          <stop offset="100%" stopColor="#5a2020" />
        </linearGradient>
        {/* Spark ember glow */}
        <radialGradient id="ch4_sparkGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0c870" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d0a050" stopOpacity="0" />
        </radialGradient>
        {/* Cannon smoke — thicker, localized */}
        <radialGradient id="ch4_cannonSmoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#706058" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#605048" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#605048" stopOpacity="0" />
        </radialGradient>
        {/* Splash ripple for fish */}
        <radialGradient id="ch4_splash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#8a7a70" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8a7a70" stopOpacity="0" />
        </radialGradient>

        {/* === NEW GRADIENTS === */}
        {/* Dramatic sunset cloud — warm orange-red */}
        <linearGradient id="ch4_sunsetCloud" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a4530" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a05838" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6a3828" stopOpacity="0.15" />
        </linearGradient>
        {/* Cloud rim-lighting from below */}
        <linearGradient id="ch4_cloudRim" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#c08848" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#a06838" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a3530" stopOpacity="0" />
        </linearGradient>
        {/* Bonfire ember glow */}
        <radialGradient id="ch4_emberGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#c07838" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Low-lying battle smoke — thinner, ground-hugging */}
        <radialGradient id="ch4_lowSmoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#706860" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#605850" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#605850" stopOpacity="0" />
        </radialGradient>
        {/* River eddy swirl gradient */}
        <radialGradient id="ch4_eddy" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a4a50" stopOpacity="0" />
          <stop offset="60%" stopColor="#5a4a50" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#5a4a50" stopOpacity="0" />
        </radialGradient>
        {/* Trophy flag — Austrian regimental colors (deeper red/gold) */}
        <linearGradient id="ch4_trophyFlag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a2828" />
          <stop offset="25%" stopColor="#6a2828" />
          <stop offset="30%" stopColor="#c0a860" />
          <stop offset="45%" stopColor="#c0a860" />
          <stop offset="50%" stopColor="#4a1818" />
          <stop offset="75%" stopColor="#4a1818" />
          <stop offset="80%" stopColor="#c0a860" />
          <stop offset="100%" stopColor="#c0a860" />
        </linearGradient>
        {/* Dispatch paper glow — warm firelight on parchment */}
        <radialGradient id="ch4_paperGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0b080" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#d0b080" stopOpacity="0" />
        </radialGradient>
        {/* Pack saddle gradient */}
        <linearGradient id="ch4_packSaddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2218" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch4_sky)" />
      <rect width="800" height="400" fill="url(#ch4_sunGlow)" />

      {/* Stars appearing */}
      <circle cx="120" cy="25" r="0.8" fill="#c0b898" opacity="0.4" />
      <circle cx="280" cy="18" r="0.6" fill="#c0b898" opacity="0.3" />
      <circle cx="680" cy="30" r="0.7" fill="#c0b898" opacity="0.35" />
      <circle cx="450" cy="12" r="0.5" fill="#c0b898" opacity="0.25" />

      {/* === EVENING STAR — bright Venus appearing in darkening sky === */}
      <circle cx="580" cy="22" r="1.8" fill="#e8dcc0" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.5;0.7" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Star cross-rays */}
      <line x1="580" y1="17" x2="580" y2="27" stroke="#e8dcc0" strokeWidth="0.4" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="575" y1="22" x2="585" y2="22" stroke="#e8dcc0" strokeWidth="0.4" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="3s" repeatCount="indefinite" />
      </line>

      {/* === BIRDS — swallows silhouetted against dusk === */}
      <g opacity="0.45">
        {/* Bird 1 — swooping left */}
        <path d="M520 45 Q514 42 506 38 Q514 41 520 45 Q526 41 534 38 Q526 42 520 45" fill="#1a1520" opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0,0;-12,-3;-20,0;-12,3;0,0" dur="6s" repeatCount="indefinite" />
        </path>
        {/* Bird 2 — higher, gliding */}
        <path d="M380 28 Q374 25 366 22 Q374 24 380 28 Q386 24 394 22 Q386 25 380 28" fill="#1a1520" opacity="0.6">
          <animateTransform attributeName="transform" type="translate" values="0,0;8,-2;16,0;8,2;0,0" dur="7.5s" repeatCount="indefinite" />
        </path>
        {/* Bird 3 — lower, darting */}
        <path d="M620 60 Q616 58 610 55 Q616 57 620 60 Q624 57 630 55 Q624 58 620 60" fill="#1a1520" opacity="0.55">
          <animateTransform attributeName="transform" type="translate" values="0,0;-6,2;-14,0;-6,-2;0,0" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Bird 4 — returning from far left, slow glide */}
        <path d="M160 42 Q154 39 146 36 Q154 38 160 42 Q166 38 174 36 Q166 39 160 42" fill="#1a1520" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0;10,-1;18,0;10,1;0,0" dur="8s" repeatCount="indefinite" />
        </path>
        {/* Bird 5 — pair with bird 4, slightly higher */}
        <path d="M175 35 Q170 33 164 30 Q170 32 175 35 Q180 32 186 30 Q180 33 175 35" fill="#1a1520" opacity="0.45">
          <animateTransform attributeName="transform" type="translate" values="0,0;9,-2;16,0;9,2;0,0" dur="7s" repeatCount="indefinite" />
        </path>
        {/* Bird 6 — far right, circling lazily */}
        <path d="M720 48 Q715 46 710 43 Q715 45 720 48 Q725 45 730 43 Q725 46 720 48" fill="#1a1520" opacity="0.4">
          <animateTransform attributeName="transform" type="translate" values="0,0;-5,3;-10,0;-5,-3;0,0" dur="9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Clouds catching last sunset light */}
      <ellipse cx="250" cy="50" rx="140" ry="9" fill="#5a3538" opacity="0.3" />
      <ellipse cx="500" cy="38" rx="110" ry="7" fill="#6a4540" opacity="0.25" />
      <ellipse cx="680" cy="55" rx="90" ry="6" fill="#5a3535" opacity="0.2" />
      <ellipse cx="130" cy="68" rx="100" ry="5" fill="#5a3538" opacity="0.15" />
      <ellipse cx="400" cy="65" rx="130" ry="6" fill="#4a3035" opacity="0.12" />

      {/* === SUNSET CLOUDS — dramatic formations with warm colors === */}
      {/* Large stratocumulus bank — rim-lit from below */}
      <ellipse cx="350" cy="72" rx="180" ry="12" fill="url(#ch4_sunsetCloud)" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.55;0.7" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="350" cy="76" rx="160" ry="6" fill="url(#ch4_cloudRim)" opacity="0.6" />
      {/* Thin cirrus wisps — high altitude, catching orange light */}
      <path d="M50 32 Q120 28 200 34 Q260 30 320 35" fill="none" stroke="#7a4838" strokeWidth="1.2" opacity="0.18">
        <animateTransform attributeName="transform" type="translate" values="0,0;6,0;0,0" dur="20s" repeatCount="indefinite" />
      </path>
      <path d="M480 25 Q540 20 620 26 Q680 22 740 28" fill="none" stroke="#7a4838" strokeWidth="1" opacity="0.15">
        <animateTransform attributeName="transform" type="translate" values="0,0;-4,0;0,0" dur="18s" repeatCount="indefinite" />
      </path>
      {/* Dramatic anvil-shaped cloud — catching last rays */}
      <path d="M580 58 Q620 48 680 52 Q720 48 740 55 Q730 62 680 64 Q630 66 590 62 Z"
        fill="#5a3530" opacity="0.3" />
      <path d="M590 62 Q630 58 680 60 Q720 57 735 60" fill="none" stroke="#a06838" strokeWidth="0.8" opacity="0.2" />
      {/* Small cumulus puff — glowing orange underneath */}
      <ellipse cx="100" cy="48" rx="40" ry="8" fill="#4a2e30" opacity="0.25" />
      <ellipse cx="100" cy="52" rx="35" ry="4" fill="#8a5838" opacity="0.2" />
      {/* Wispy band across mid-sky */}
      <path d="M0 82 Q100 78 200 84 Q350 76 500 82 Q650 76 800 80"
        fill="none" stroke="#5a3838" strokeWidth="2" opacity="0.12">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="25s" repeatCount="indefinite" />
      </path>

      {/* === POWDER SMOKE — lingering over the river from the battle === */}
      <ellipse cx="320" cy="145" rx="80" ry="18" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;15,-2;30,0;15,2;0,0" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="480" cy="150" rx="60" ry="14" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,-1;20,0;10,1;0,0" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="180" cy="155" rx="50" ry="12" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;16,-1;8,0;0,0" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.35;0.7" dur="11s" repeatCount="indefinite" />
      </ellipse>
      {/* Additional smoke — drifting from bridge area */}
      <ellipse cx="400" cy="140" rx="70" ry="15" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;20,-3;40,0;20,3;0,0" dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Low smoke wisp hugging the river surface */}
      <ellipse cx="550" cy="170" rx="45" ry="8" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;12,0;24,-1;12,0;0,0" dur="16s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="12s" repeatCount="indefinite" />
      </ellipse>

      {/* === LOW-LYING POWDER SMOKE — ground-hugging wisps over bridge and river === */}
      {/* Wisp clinging to bridge deck — left section */}
      <ellipse cx="300" cy="164" rx="30" ry="5" fill="url(#ch4_lowSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,-1;20,0;10,1;0,0" dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp on bridge — right section, thicker */}
      <ellipse cx="490" cy="165" rx="25" ry="6" fill="url(#ch4_lowSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;16,-1;8,0;0,0" dur="13s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.35;0.8" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Long thin wisp trailing across river surface */}
      <ellipse cx="400" cy="178" rx="100" ry="4" fill="url(#ch4_lowSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;18,0;36,0;18,0;0,0" dur="20s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.25;0.7" dur="14s" repeatCount="indefinite" />
      </ellipse>
      {/* Small puff near far bank — residual from cannon */}
      <ellipse cx="220" cy="172" rx="20" ry="5" fill="url(#ch4_lowSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;6,-1;12,0;6,1;0,0" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp curling over near bank edge */}
      <ellipse cx="650" cy="175" rx="35" ry="4" fill="url(#ch4_lowSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;-8,0;-16,-1;-8,0;0,0" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.15;0.5" dur="10s" repeatCount="indefinite" />
      </ellipse>

      {/* === FAR BANK — flat Lombardy plain === */}
      <path d="M0 158 Q200 153 400 156 Q600 153 800 158 L800 178 L0 178 Z"
        fill="#252018" opacity="0.65" />

      {/* Town of Lodi — distant buildings */}
      <rect x="250" y="142" width="7" height="14" fill="#3a3530" opacity="0.45" />
      <path d="M248 142 L253 136 L259 142" fill="#403a35" opacity="0.4" />
      <rect x="262" y="145" width="5" height="11" fill="#3a3530" opacity="0.45" />
      <rect x="272" y="140" width="6" height="16" fill="#3a3530" opacity="0.45" />
      <path d="M270 140 L275 132 L280 140" fill="#403a35" opacity="0.4" />
      <rect x="284" y="143" width="4" height="13" fill="#3a3530" opacity="0.4" />
      <rect x="295" y="146" width="5" height="10" fill="#3a3530" opacity="0.4" />
      {/* Church tower */}
      <rect x="305" y="128" width="5" height="28" fill="#3a3530" opacity="0.5" />
      <path d="M303 128 L307 120 L312 128" fill="#403a35" opacity="0.45" />
      <line x1="307" y1="120" x2="307" y2="115" stroke="#403a35" strokeWidth="0.8" opacity="0.4" />
      {/* Town window glows */}
      <rect x="254" y="148" width="2" height="2" fill="#a08050" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="276" y="146" width="2" height="2" fill="#a08050" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="307" y="138" width="2" height="2" fill="#a08050" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.08;0.18" dur="3.5s" repeatCount="indefinite" />
      </rect>

      {/* === PONTOON BRIDGE — the famous bridge of Lodi === */}
      <path d="M260 166 Q320 163 380 164 Q440 163 500 164 Q540 165 560 166"
        fill="none" stroke="#4a4538" strokeWidth="2" opacity="0.45" />
      {/* Bridge supports — pontoon boats */}
      {[280, 310, 340, 370, 400, 430, 460, 490, 530].map((x) => (
        <React.Fragment key={`br${x}`}>
          <line x1={x} y1={164 + (Math.abs(x - 400) / 200)} x2={x} y2={172} stroke="#4a4538" strokeWidth="0.7" opacity="0.35" />
          <ellipse cx={x} cy={173} rx={4} ry={1.5} fill="#3a3528" opacity="0.25" />
        </React.Fragment>
      ))}
      {/* Bridge railing hints */}
      <path d="M270 163 Q320 160 380 161 Q440 160 500 161 Q540 162 555 163"
        fill="none" stroke="#504a3a" strokeWidth="0.5" opacity="0.25" />

      {/* === STONE BALUSTRADE POSTS — along the bridge === */}
      {[285, 315, 345, 375, 405, 435, 465, 495, 525].map((x) => (
        <React.Fragment key={`bal${x}`}>
          {/* Post base */}
          <rect x={x - 1.5} y={160} width={3} height={5} fill="#504838" opacity="0.35" />
          {/* Post cap — rounded top */}
          <circle cx={x} cy={159.5} r={1.8} fill="#585040" opacity="0.3" />
        </React.Fragment>
      ))}

      {/* === BRIDGE DAMAGE — scorch marks, shot impacts, and battle debris === */}
      {/* Scorch mark — left section, cannon ball hit */}
      <ellipse cx="320" cy="164" rx="8" ry="3" fill="url(#ch4_scorch)" />
      {/* Scorch mark — centre, heaviest fighting */}
      <ellipse cx="400" cy="163" rx="12" ry="4" fill="url(#ch4_scorch)" />
      {/* Splintered railing gap */}
      <line x1="390" y1="161" x2="393" y2="158" stroke="#3a3020" strokeWidth="0.6" opacity="0.3" />
      <line x1="396" y1="161" x2="398" y2="157" stroke="#3a3020" strokeWidth="0.5" opacity="0.25" />
      <line x1="410" y1="161" x2="412" y2="159" stroke="#3a3020" strokeWidth="0.5" opacity="0.25" />
      {/* Burn mark — right section */}
      <ellipse cx="475" cy="164" rx="6" ry="2.5" fill="url(#ch4_scorch)" />
      {/* Broken plank detail */}
      <line x1="345" y1="163" x2="348" y2="168" stroke="#2a2518" strokeWidth="0.7" opacity="0.3" />
      <line x1="460" y1="164" x2="463" y2="169" stroke="#2a2518" strokeWidth="0.6" opacity="0.25" />
      {/* Cannonball pockmarks — craters in the stonework */}
      <ellipse cx="350" cy="162" rx="2.5" ry="1.5" fill="#1a1008" opacity="0.3" />
      <ellipse cx="352" cy="163" rx="1.5" ry="1" fill="#0e0804" opacity="0.2" />
      <ellipse cx="420" cy="163" rx="3" ry="1.5" fill="#1a1008" opacity="0.25" />
      {/* Chipped balustrade — missing post at 375 (shot away) */}
      <line x1="374" y1="160" x2="376" y2="157" stroke="#504838" strokeWidth="0.8" opacity="0.25" />
      <line x1="376" y1="160" x2="375" y2="155" stroke="#504838" strokeWidth="0.6" opacity="0.2" />
      {/* Grapeshot scatter marks */}
      <circle cx="330" cy="164" r="0.8" fill="#1a1008" opacity="0.25" />
      <circle cx="332" cy="163" r="0.6" fill="#1a1008" opacity="0.2" />
      <circle cx="335" cy="164" r="0.7" fill="#1a1008" opacity="0.22" />
      <circle cx="445" cy="163" r="0.7" fill="#1a1008" opacity="0.2" />
      <circle cx="448" cy="164" r="0.5" fill="#1a1008" opacity="0.18" />

      {/* === SCATTERED BODIES ON BRIDGE — fallen during the charge === */}
      {/* Body 1 — dark shape sprawled across bridge deck */}
      <path d="M365 163 Q370 161 378 162 Q382 162 384 164" fill="#12100c" opacity="0.4" />
      <circle cx="364" cy="163" r="2" fill="#12100c" opacity="0.35" />
      {/* Body 2 — slumped against railing */}
      <path d="M440 162 Q444 160 448 161 Q450 163 448 164" fill="#12100c" opacity="0.35" />
      <circle cx="439" cy="161" r="1.8" fill="#12100c" opacity="0.3" />

      {/* === DEAD AUSTRIAN SOLDIERS — fallen near Austrian side of bridge === */}
      {/* Austrian casualty 1 — sprawled face-down on far bank near bridge approach */}
      <path d="M540 160 Q548 157 558 158 Q564 158 568 161" fill="#2a2420" opacity="0.4" />
      <circle cx="538" cy="160" r="2.2" fill="#2a2420" opacity="0.35" />
      {/* White coat hint (Austrian uniform) */}
      <path d="M544 158 Q550 156 558 157" fill="#4a4840" opacity="0.2" />
      {/* Dropped musket beside him */}
      <line x1="542" y1="162" x2="570" y2="160" stroke="#3a3020" strokeWidth="0.8" opacity="0.25" />

      {/* Austrian casualty 2 — slumped against bridge railing, Austrian side */}
      <path d="M510 161 Q514 157 518 159 Q520 162 518 164" fill="#2a2420" opacity="0.38" />
      <circle cx="508" cy="160" r="2" fill="#2a2420" opacity="0.32" />
      {/* White-coated torso visible */}
      <path d="M512 159 Q515 157 518 159" fill="#4a4840" opacity="0.18" />
      {/* Shako (Austrian hat) fallen nearby */}
      <ellipse cx="505" cy="162" rx="2" ry="1" fill="#1a1510" opacity="0.25" />

      {/* Austrian casualty 3 — half-fallen off bridge into water */}
      <path d="M475 165 Q480 163 485 164 Q488 166 486 170" fill="#2a2420" opacity="0.3" />
      <circle cx="473" cy="165" r="1.8" fill="#2a2420" opacity="0.28" />
      {/* Arm dangling toward water */}
      <path d="M486 168 Q488 172 487 176" fill="none" stroke="#2a2420" strokeWidth="1.2" opacity="0.2" />

      {/* === RIVER BOATS — small craft on the Adda === */}
      {/* Boat 1 — small rowing boat, near bank, right side */}
      <g opacity="0.4">
        <path d="M620 210 Q625 206 640 206 Q655 206 660 210 Q650 213 630 213 Z" fill="#2a2518" />
        <line x1="640" y1="206" x2="640" y2="196" stroke="#3a3020" strokeWidth="0.8" />
        {/* Oar */}
        <line x1="632" y1="208" x2="622" y2="218" stroke="#3a3020" strokeWidth="0.6" opacity="0.5" />
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="4s" repeatCount="indefinite" />
      </g>
      {/* Boat 2 — further out, drifting mid-river */}
      <g opacity="0.3">
        <path d="M360 200 Q364 197 374 197 Q384 197 388 200 Q380 202 368 202 Z" fill="#2a2518" />
        <line x1="374" y1="197" x2="374" y2="190" stroke="#3a3020" strokeWidth="0.7" />
        <animateTransform attributeName="transform" type="translate" values="0,0;-3,0;0,0" dur="6s" repeatCount="indefinite" />
      </g>

      {/* === WIDE RIVER === */}
      <rect x="0" y="173" width="800" height="105" fill="url(#ch4_water)" />
      {/* Sky reflection band */}
      <rect x="0" y="173" width="800" height="50" fill="url(#ch4_reflect)" />

      {/* Sunset warm shimmer band on water */}
      <rect x="0" y="176" width="800" height="20" fill="url(#ch4_warmShimmer)">
        <animate attributeName="opacity" values="1;0.5;1" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Water ripples — animated horizontal flow */}
      <g>
        <path d="M0 188 Q40 186 80 188 Q120 190 160 188 Q200 186 240 188 Q280 190 320 188 Q360 186 400 188 Q440 190 480 188 Q520 186 560 188 Q600 190 640 188 Q680 186 720 188 Q760 190 800 188"
          fill="none" stroke="#5a4a50" strokeWidth="0.5" opacity="0.28">
          <animateTransform attributeName="transform" type="translate" values="0,0;-20,0;0,0" dur="6s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 202 Q50 200 100 202 Q150 204 200 202 Q250 200 300 202 Q350 204 400 202 Q450 200 500 202 Q550 204 600 202 Q650 200 700 202 Q750 204 800 202"
          fill="none" stroke="#4a3a45" strokeWidth="0.5" opacity="0.22">
          <animateTransform attributeName="transform" type="translate" values="0,0;16,0;0,0" dur="7s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 218 Q60 216 120 218 Q180 220 240 218 Q300 216 360 218 Q420 220 480 218 Q540 216 600 218 Q660 220 720 218 Q780 216 800 218"
          fill="none" stroke="#3a3040" strokeWidth="0.5" opacity="0.18">
          <animateTransform attributeName="transform" type="translate" values="0,0;-14,0;0,0" dur="8s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 235 Q70 233 140 235 Q210 237 280 235 Q350 233 420 235 Q490 237 560 235 Q630 233 700 235 Q770 237 800 235"
          fill="none" stroke="#302a38" strokeWidth="0.5" opacity="0.12">
          <animateTransform attributeName="transform" type="translate" values="0,0;12,0;0,0" dur="9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === RIVER EDDIES — animated swirl patterns in the Adda === */}
      {/* Eddy 1 — near bridge support, left side */}
      <g opacity="0.2">
        <circle cx="310" cy="185" r="6" fill="none" stroke="#5a4a50" strokeWidth="0.5">
          <animate attributeName="r" values="4;7;4" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.08;0.3" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="310" cy="185" r="3" fill="none" stroke="#5a4a50" strokeWidth="0.4">
          <animate attributeName="r" values="2;5;2" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="5s" repeatCount="indefinite" />
        </circle>
        <animateTransform attributeName="transform" type="rotate" values="0 310 185;360 310 185" dur="8s" repeatCount="indefinite" />
      </g>
      {/* Eddy 2 — mid-river, larger */}
      <g opacity="0.15">
        <circle cx="460" cy="205" r="8" fill="none" stroke="#4a3a48" strokeWidth="0.5">
          <animate attributeName="r" values="6;10;6" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="460" cy="205" r="4" fill="none" stroke="#4a3a48" strokeWidth="0.4">
          <animate attributeName="r" values="3;6;3" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.03;0.15" dur="7s" repeatCount="indefinite" />
        </circle>
        <animateTransform attributeName="transform" type="rotate" values="0 460 205;360 460 205" dur="10s" repeatCount="indefinite" />
      </g>
      {/* Eddy 3 — near right bank, small turbulent swirl */}
      <g opacity="0.18">
        <circle cx="600" cy="220" r="5" fill="none" stroke="#4a3a48" strokeWidth="0.4">
          <animate attributeName="r" values="3;6;3" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.06;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="220" r="2.5" fill="none" stroke="#4a3a48" strokeWidth="0.3">
          <animate attributeName="r" values="1.5;4;1.5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0.04;0.18" dur="4s" repeatCount="indefinite" />
        </circle>
        <animateTransform attributeName="transform" type="rotate" values="0 600 220;-360 600 220" dur="6s" repeatCount="indefinite" />
      </g>
      {/* Eddy 4 — far left, where current swirls around bridge pylons */}
      <g opacity="0.14">
        <circle cx="180" cy="195" r="5" fill="none" stroke="#5a4a50" strokeWidth="0.4">
          <animate attributeName="r" values="4;7;4" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0.04;0.18" dur="6s" repeatCount="indefinite" />
        </circle>
        <animateTransform attributeName="transform" type="rotate" values="0 180 195;360 180 195" dur="9s" repeatCount="indefinite" />
      </g>
      {/* Eddy 5 — downstream of body hanging off bridge */}
      <g opacity="0.12">
        <circle cx="490" cy="190" r="4" fill="none" stroke="#5a4a50" strokeWidth="0.3">
          <animate attributeName="r" values="3;5;3" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.04;0.15" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <animateTransform attributeName="transform" type="rotate" values="0 490 190;360 490 190" dur="7s" repeatCount="indefinite" />
      </g>

      {/* === FISH JUMPING — tiny splash in the river === */}
      <g>
        {/* Fish body — small arc leaping */}
        <path d="M480 215 Q482 211 485 213" fill="#4a4040" opacity="0.25">
          <animate attributeName="opacity" values="0;0.25;0.25;0" dur="5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0,2;0,-2;0,0;0,2" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Splash rings */}
        <ellipse cx="482" cy="216" rx="3" ry="1" fill="none" stroke="#8a7a70" strokeWidth="0.4" opacity="0.2">
          <animate attributeName="rx" values="1;5;8" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0" dur="5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="482" cy="216" rx="2" ry="0.6" fill="url(#ch4_splash)">
          <animate attributeName="rx" values="0;3;6" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.15;0" dur="5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Shimmer reflections — stronger sunset warmth */}
      <ellipse cx="350" cy="185" rx="50" ry="3" fill="#b87a40" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="50;58;50" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="192" rx="35" ry="2" fill="#a06a3a" opacity="0.14">
        <animate attributeName="opacity" values="0.14;0.04;0.14" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="35;42;35" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="200" cy="208" rx="25" ry="1.5" fill="#7a5a3a" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="195" rx="35" ry="1.5" fill="#9a6a3a" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.03;0.12" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="35;40;35" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Central golden streak — sunset path on water */}
      <ellipse cx="400" cy="180" rx="70" ry="2.5" fill="#c09050" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.05;0.12" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="70;80;70" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* === NEAR BANK === */}
      <path d="M0 278 Q120 270 250 274 Q400 265 550 270 Q680 265 800 272 L800 400 L0 400 Z"
        fill="url(#ch4_bank)" />

      {/* Bank edge detail */}
      <path d="M0 278 Q30 275 60 279 Q90 276 120 280 Q150 274 180 278"
        fill="none" stroke="#352e20" strokeWidth="0.8" opacity="0.3" />

      {/* === TROPHY DISPLAY — captured Austrian regimental colors on a pole === */}
      {/* Trophy pole — tall, planted in the ground */}
      <line x1="200" y1="230" x2="200" y2="298" stroke="#3a3020" strokeWidth="2.5" opacity="0.7" />
      {/* Cross-bar at top for hanging the flag */}
      <line x1="192" y1="234" x2="208" y2="234" stroke="#3a3020" strokeWidth="1.5" opacity="0.6" />
      {/* Captured Austrian regimental colors — hung from cross-bar */}
      <path d="M192 234 Q194 240 192 250 Q190 258 193 264 Q196 260 200 264 Q204 260 207 264 Q210 258 208 250 Q206 240 208 234 Z"
        fill="url(#ch4_trophyFlag)" opacity="0.55">
        <animate attributeName="d" values="M192 234 Q194 240 192 250 Q190 258 193 264 Q196 260 200 264 Q204 260 207 264 Q210 258 208 250 Q206 240 208 234 Z;M192 234 Q195 240 193 250 Q191 258 194 266 Q197 262 200 266 Q203 262 206 266 Q209 258 207 250 Q205 240 208 234 Z;M192 234 Q194 240 192 250 Q190 258 193 264 Q196 260 200 264 Q204 260 207 264 Q210 258 208 250 Q206 240 208 234 Z" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Gold fringe along bottom edge */}
      <path d="M193 264 Q196 260 200 264 Q204 260 207 264" fill="none" stroke="#a09040" strokeWidth="0.6" opacity="0.35">
        <animate attributeName="d" values="M193 264 Q196 260 200 264 Q204 260 207 264;M194 266 Q197 262 200 266 Q203 262 206 266;M193 264 Q196 260 200 264 Q204 260 207 264" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Austrian eagle emblem — simplified dark shape on flag */}
      <path d="M198 246 Q200 243 202 246 Q204 248 200 250 Q196 248 198 246" fill="#1a1008" opacity="0.25" />

      {/* === EQUIPMENT — drum, knapsacks, canteen, captured standard === */}
      {/* Drum on its side */}
      <ellipse cx="155" cy="298" rx="7" ry="5" fill="#2a2218" opacity="0.65" />
      <path d="M148 298 Q148 292 155 292 Q162 292 162 298" fill="#302818" opacity="0.55" />
      <line x1="150" y1="293" x2="150" y2="298" stroke="#3a3020" strokeWidth="0.5" opacity="0.4" />
      <line x1="155" y1="292" x2="155" y2="298" stroke="#3a3020" strokeWidth="0.5" opacity="0.4" />
      <line x1="160" y1="293" x2="160" y2="298" stroke="#3a3020" strokeWidth="0.5" opacity="0.4" />

      {/* Knapsacks — piled near campfire */}
      <path d="M260 296 Q258 288 264 286 Q270 288 268 296 Z" fill="#1e1a12" opacity="0.6" />
      <path d="M268 294 Q266 287 272 285 Q278 287 276 294 Z" fill="#201c14" opacity="0.55" />

      {/* Water canteen */}
      <ellipse cx="340" cy="298" rx="4" ry="3.5" fill="#2a2418" opacity="0.55" />
      <line x1="340" y1="295" x2="342" y2="290" stroke="#3a3020" strokeWidth="0.6" opacity="0.4" />

      {/* Captured Austrian standard — broken pole, draped cloth */}
      <line x1="380" y1="300" x2="374" y2="268" stroke="#3a3520" strokeWidth="1.5" opacity="0.65" />
      <path d="M374 268 Q378 270 382 268 Q384 274 380 278 Q376 276 374 268" fill="#3a2820" opacity="0.5" />
      {/* Eagle finial hint */}
      <path d="M372 268 Q374 264 376 268" fill="#4a4030" opacity="0.4" />

      {/* === PACK ANIMALS — mule with supply packs near artillery area === */}
      {/* Mule body — stockier than the cavalry horse */}
      <path d="M570 290 Q580 284 595 286 Q605 284 612 288 Q615 292 612 298 Q605 304 594 306 Q582 308 574 304 Q568 300 570 290 Z" fill="#1a1810" opacity="0.6" />
      {/* Mule neck and head — shorter, thicker than horse */}
      <path d="M570 290 Q568 282 566 278 Q565 274 568 272 Q572 270 574 274 Q576 278 574 284 Q573 287 570 290" fill="#1a1810" opacity="0.6" />
      {/* Long ears — characteristic of mule */}
      <path d="M567 272 Q565 266 568 268" fill="#1a1810" opacity="0.5" />
      <path d="M570 271 Q569 265 572 267" fill="#1a1810" opacity="0.5" />
      {/* Mule legs */}
      <line x1="582" y1="306" x2="580" y2="320" stroke="#1a1810" strokeWidth="1.8" opacity="0.55" />
      <line x1="600" y1="304" x2="602" y2="320" stroke="#1a1810" strokeWidth="1.8" opacity="0.55" />
      <line x1="590" y1="308" x2="588" y2="320" stroke="#1a1810" strokeWidth="1.6" opacity="0.5" />
      <line x1="606" y1="300" x2="608" y2="318" stroke="#1a1810" strokeWidth="1.6" opacity="0.5" />
      {/* Pack saddle — wooden frame with canvas bags */}
      <path d="M578 284 Q586 278 598 280 Q606 278 610 284 Q604 282 592 280 Q580 282 578 284 Z" fill="url(#ch4_packSaddle)" opacity="0.6" />
      {/* Left saddlebag — bulging canvas */}
      <path d="M576 286 Q572 290 574 298 Q576 302 580 300 Q578 294 578 288 Z" fill="#2a2418" opacity="0.5" />
      {/* Right saddlebag */}
      <path d="M608 286 Q612 290 610 298 Q608 302 604 300 Q606 294 606 288 Z" fill="#2a2418" opacity="0.5" />
      {/* Rope securing the load */}
      <path d="M580 282 Q590 286 604 282" fill="none" stroke="#3a3520" strokeWidth="0.6" opacity="0.35" />
      {/* Mule tail — short flick */}
      <path d="M612 294 Q618 298 616 306" fill="none" stroke="#1a1810" strokeWidth="1.2" opacity="0.4">
        <animate attributeName="d" values="M612 294 Q618 298 616 306;M612 294 Q620 296 618 304;M612 294 Q618 298 616 306" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* === ARTILLERY BATTERY — 3 cannons === */}
      {/* Cannon 1 — largest, closest */}
      <path d="M490 278 L525 272 L530 275 L495 282 Z" fill="#12100c" opacity="0.85" />
      <circle cx="500" cy="284" r="6" fill="#12100c" opacity="0.85" />
      <circle cx="518" cy="282" r="6" fill="#12100c" opacity="0.85" />
      {/* Barrel detail */}
      <line x1="525" y1="272" x2="535" y2="270" stroke="#1a1510" strokeWidth="2" opacity="0.7" />

      {/* === CAPTURED AUSTRIAN FLAG — draped over Cannon 1 === */}
      {/* Flag cloth draped from barrel, hanging down the side */}
      <path d="M520 272 Q528 270 535 270 Q538 274 536 280 Q530 286 522 288 Q516 284 518 278 Z"
        fill="url(#ch4_austrianFlag)" opacity="0.55" />
      {/* Flag folds — shadow creases */}
      <path d="M524 274 Q528 278 526 284" fill="none" stroke="#1a1008" strokeWidth="0.5" opacity="0.3" />
      <path d="M530 273 Q533 278 531 283" fill="none" stroke="#1a1008" strokeWidth="0.4" opacity="0.25" />
      {/* Flag trailing corner on ground */}
      <path d="M522 288 Q520 292 518 296 Q516 294 515 290" fill="url(#ch4_austrianFlag)" opacity="0.4" />
      {/* Gold fringe hint along edge */}
      <path d="M535 270 Q538 274 536 280" fill="none" stroke="#8a7a40" strokeWidth="0.6" opacity="0.3" />

      {/* Cannon smoke — residual wisps around battery */}
      <ellipse cx="540" cy="268" rx="25" ry="10" fill="url(#ch4_cannonSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,-2;16,0;8,2;0,0" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="7s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="595" cy="265" rx="18" ry="8" fill="url(#ch4_cannonSmoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;6,-1;12,0;6,1;0,0" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="9s" repeatCount="indefinite" />
      </ellipse>

      {/* Cannon 2 */}
      <path d="M560 275 L590 270 L595 272 L565 278 Z" fill="#12100c" opacity="0.8" />
      <circle cx="570" cy="280" r="5.5" fill="#12100c" opacity="0.8" />
      <circle cx="585" cy="278" r="5.5" fill="#12100c" opacity="0.8" />

      {/* Cannon 3 — further back */}
      <path d="M625 272 L650 268 L654 270 L629 275 Z" fill="#12100c" opacity="0.7" />
      <circle cx="632" cy="277" r="5" fill="#12100c" opacity="0.7" />
      <circle cx="645" cy="276" r="5" fill="#12100c" opacity="0.7" />

      {/* Ammo crates and supplies */}
      <rect x="540" y="278" width="12" height="9" fill="#1a1510" opacity="0.65" />
      <rect x="544" y="274" width="12" height="9" fill="#1a1510" opacity="0.65" />
      <rect x="600" y="276" width="10" height="8" fill="#1a1510" opacity="0.6" />
      {/* Barrel */}
      <ellipse cx="615" cy="280" rx="5" ry="4" fill="#1a1510" opacity="0.5" />

      {/* Artillery crew silhouettes */}
      <path d="M535 268 Q533 258 535 252 Q537 248 539 252 L541 268 Z" fill="#12100c" opacity="0.75" />
      <circle cx="537" cy="248" r="4" fill="#12100c" opacity="0.75" />
      <path d="M553 270 Q551 262 553 256 Q555 262 557 270 Z" fill="#12100c" opacity="0.7" />

      {/* === SITTING OFFICER — writing dispatches by firelight === */}
      {/* Officer seated on ammo crate, apart from the celebration */}
      <rect x="60" y="306" width="10" height="7" fill="#1a1510" opacity="0.55" />
      {/* Seated body — upright torso */}
      <path d="M64 306 Q62 296 64 288 Q66 282 68 288 L70 306 Z" fill="#12100c" opacity="0.7" />
      <circle cx="66" cy="282" r="4" fill="#12100c" opacity="0.7" />
      {/* Bicorne hat silhouette — officer distinction */}
      <path d="M60 282 Q62 278 66 276 Q70 278 72 282 Q66 280 60 282" fill="#12100c" opacity="0.6" />
      {/* Arm bent forward — writing */}
      <path d="M68 290 Q74 294 78 292" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.5">
        <animate attributeName="d" values="M68 290 Q74 294 78 292;M68 290 Q74 293 79 290;M68 290 Q74 294 78 292" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Paper/dispatch on lap — small warm rectangle */}
      <rect x="72" y="296" width="8" height="6" rx="0.5" ry="0.5" fill="#3a3528" opacity="0.4" />
      <ellipse cx="76" cy="299" rx="6" ry="4" fill="url(#ch4_paperGlow)" />
      {/* Small candle/lantern beside him */}
      <rect x="82" y="302" width="2" height="4" fill="#2a2418" opacity="0.4" />
      <path d="M82 302 Q83 300 84 302" fill="#d0a050" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.2;0.35" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Warm glow from lantern on paper */}
      <ellipse cx="80" cy="302" rx="8" ry="5" fill="#c08040" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="1.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === STANDING SOLDIER GROUP — esprit de corps === */}
      {/* Three soldiers talking confidently */}
      <path d="M190 262 Q188 250 190 242 Q192 236 194 242 L196 262 Q195 270 194 275 L190 275 Z" fill="#12100c" opacity="0.8" />
      <circle cx="192" cy="236" r="5" fill="#12100c" opacity="0.8" />
      <path d="M208 260 Q206 250 208 242 Q210 236 212 242 L214 260 Q213 268 212 275 L208 275 Z" fill="#12100c" opacity="0.8" />
      <circle cx="210" cy="236" r="5" fill="#12100c" opacity="0.8" />
      <path d="M225 264 Q223 252 225 244 Q227 239 229 244 L231 264 Z" fill="#12100c" opacity="0.75" />
      <circle cx="227" cy="239" r="4.5" fill="#12100c" opacity="0.75" />
      {/* Gesturing arm — animated, retelling the charge */}
      <path d="M196 248 Q200 244 205 246" fill="none" stroke="#12100c" strokeWidth="2" opacity="0.5">
        <animate attributeName="d" values="M196 248 Q200 244 205 246;M196 248 Q202 240 208 242;M196 248 Q200 244 205 246" dur="2s" repeatCount="indefinite" />
      </path>

      {/* === NEW SOLDIER — excitedly gesturing (retelling the bridge charge) === */}
      <path d="M240 264 Q238 254 240 246 Q242 240 244 246 L246 264 Q245 270 244 275 L240 275 Z" fill="#12100c" opacity="0.78" />
      <circle cx="242" cy="240" r="4.5" fill="#12100c" opacity="0.78" />
      {/* Both arms raised, animated — emphatic storytelling */}
      <path d="M236 252 Q230 244 226 240" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M236 252 Q230 244 226 240;M236 252 Q228 242 224 236;M236 252 Q230 244 226 240" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M248 252 Q254 244 258 240" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M248 252 Q254 244 258 240;M248 252 Q256 242 260 236;M248 252 Q254 244 258 240" dur="1.8s" repeatCount="indefinite" />
      </path>

      {/* === NEW SOLDIER — lifting a bottle in celebration === */}
      <path d="M168 290 Q166 280 168 272 Q170 266 172 272 L174 290 Z" fill="#12100c" opacity="0.72" />
      <circle cx="170" cy="266" r="4" fill="#12100c" opacity="0.72" />
      {/* Arm raised high with bottle */}
      <path d="M172 274 Q178 264 180 256" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M172 274 Q178 264 180 256;M172 274 Q179 262 182 254;M172 274 Q178 264 180 256" dur="2.2s" repeatCount="indefinite" />
      </path>
      {/* Bottle shape */}
      <path d="M179 257 Q180 252 181 257" fill="#2a2520" opacity="0.55">
        <animate attributeName="d" values="M179 257 Q180 252 181 257;M181 255 Q182 250 183 255;M179 257 Q180 252 181 257" dur="2.2s" repeatCount="indefinite" />
      </path>

      {/* === NEW SOLDIER — playing cards on the ground === */}
      <path d="M400 296 Q398 288 400 282 Q402 278 404 282 L406 296 Z" fill="#12100c" opacity="0.65" />
      <circle cx="402" cy="278" r="3.5" fill="#12100c" opacity="0.65" />
      {/* Arm reaching forward toward cards */}
      <path d="M404 286 Q408 290 414 292" fill="none" stroke="#12100c" strokeWidth="1.3" opacity="0.45" />
      {/* Cards on ground — small rectangles */}
      <rect x="414" y="294" width="4" height="5" rx="0.5" ry="0.5" fill="#3a3528" opacity="0.4" transform="rotate(-8 416 296)" />
      <rect x="419" y="293" width="4" height="5" rx="0.5" ry="0.5" fill="#3a3020" opacity="0.35" transform="rotate(5 421 296)" />
      <rect x="416" y="296" width="4" height="5" rx="0.5" ry="0.5" fill="#2a2518" opacity="0.3" transform="rotate(-15 418 298)" />
      {/* Second card player — facing first */}
      <path d="M430 294 Q428 286 430 280 Q432 276 434 280 L436 294 Z" fill="#12100c" opacity="0.6" />
      <circle cx="432" cy="276" r="3.5" fill="#12100c" opacity="0.6" />
      <path d="M428 286 Q424 290 420 292" fill="none" stroke="#12100c" strokeWidth="1.2" opacity="0.4" />

      {/* === NEW SOLDIER — collapsed asleep === */}
      {/* Body flat on ground, face down, arms splayed */}
      <path d="M460 300 Q470 296 482 297 Q490 296 496 300" fill="#12100c" opacity="0.55" />
      <circle cx="458" cy="298" r="3.5" fill="#12100c" opacity="0.5" />
      {/* Arm flung forward */}
      <path d="M462 299 Q456 296 450 298" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.35" />
      {/* Other arm out to side */}
      <path d="M470 298 Q472 294 476 292" fill="none" stroke="#12100c" strokeWidth="1.3" opacity="0.3" />
      {/* Hat fallen beside head */}
      <ellipse cx="452" cy="296" rx="3" ry="1.5" fill="#1a1510" opacity="0.4" />

      {/* === NEW SOLDIER — lying relaxed on the ground === */}
      <path d="M325 300 Q340 296 355 298 Q360 298 365 300" fill="#12100c" opacity="0.65" />
      {/* Head (propped up slightly) */}
      <circle cx="325" cy="297" r="4" fill="#12100c" opacity="0.65" />
      {/* Arm behind head */}
      <path d="M328 298 Q324 294 320 296" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.45" />

      {/* === NEW SOLDIER — cleaning musket near fire 2 === */}
      <path d="M140 304 Q138 294 140 286 Q142 280 144 286 L146 304 Z" fill="#12100c" opacity="0.65" />
      <circle cx="142" cy="280" r="3.5" fill="#12100c" opacity="0.65" />
      {/* Musket across lap — diagonal */}
      <line x1="134" y1="298" x2="156" y2="292" stroke="#2a2520" strokeWidth="1.2" opacity="0.5" />
      {/* Cleaning arm motion */}
      <path d="M144 290 Q148 288 152 290" fill="none" stroke="#12100c" strokeWidth="1.2" opacity="0.4">
        <animate attributeName="d" values="M144 290 Q148 288 152 290;M144 290 Q149 286 154 288;M144 290 Q148 288 152 290" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* === CAMPFIRE 1 — large celebration fire === */}
      <ellipse cx="300" cy="302" rx="38" ry="12" fill="url(#ch4_fireGlow)">
        <animate attributeName="rx" values="38;44;38" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* === CELEBRATION BONFIRE LOGS — detailed log pile with embers === */}
      {/* Large log — center, partially charred */}
      <path d="M286 304 Q288 302 312 302 Q314 304 312 306 Q288 306 286 304 Z" fill="#1a1208" opacity="0.7" />
      {/* Char marks on large log */}
      <path d="M292 303 Q296 302 300 303" fill="none" stroke="#0e0804" strokeWidth="0.8" opacity="0.4" />
      <path d="M304 303 Q308 302 310 303" fill="none" stroke="#0e0804" strokeWidth="0.6" opacity="0.35" />
      {/* Second log — crossed over first at angle */}
      <path d="M280 300 Q290 298 308 306 Q310 308 308 308 Q290 302 282 302 Z" fill="#1e1610" opacity="0.65" />
      {/* Third log — shorter, on top */}
      <path d="M294 300 Q298 298 306 300 Q308 302 306 302 Q298 302 294 300 Z" fill="#221a10" opacity="0.6" />
      {/* Charred ends — glowing orange at tips */}
      <ellipse cx="286" cy="304" rx="3" ry="1.5" fill="#803818" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.25;0.4" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="312" cy="304" rx="2.5" ry="1.5" fill="#904020" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.2;0.35" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Glowing embers beneath logs */}
      <ellipse cx="296" cy="306" rx="8" ry="2" fill="url(#ch4_emberGlow)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="304" cy="307" rx="5" ry="1.5" fill="url(#ch4_emberGlow)">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Individual ember dots beneath the pile */}
      <circle cx="290" cy="306" r="0.8" fill="#e08040" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="0.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="307" r="0.6" fill="#d07030" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.15;0.45" dur="1.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="308" cy="306" r="0.7" fill="#e09048" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="1.3s" repeatCount="indefinite" />
      </circle>
      {/* Ash ring around the fire */}
      <ellipse cx="300" cy="308" rx="18" ry="3" fill="#2a2520" opacity="0.2" />

      {/* Fire flames — multiple layers for bigger celebration fire */}
      <path d="M293 300 Q296 280 300 300" fill="#c07838" opacity="0.7">
        <animate attributeName="d" values="M293 300 Q296 280 300 300;M293 300 Q297 278 300 300;M293 300 Q296 280 300 300" dur="0.4s" repeatCount="indefinite" />
      </path>
      <path d="M298 300 Q301 284 304 300" fill="#d09050" opacity="0.65">
        <animate attributeName="d" values="M298 300 Q301 284 304 300;M298 300 Q302 282 304 300;M298 300 Q301 284 304 300" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M296 300 Q299 288 302 300" fill="#e0a860" opacity="0.5">
        <animate attributeName="d" values="M296 300 Q299 288 302 300;M296 300 Q300 286 302 300;M296 300 Q299 288 302 300" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M300 300 Q302 292 304 300" fill="#f0c080" opacity="0.35">
        <animate attributeName="d" values="M300 300 Q302 292 304 300;M300 300 Q303 290 304 300;M300 300 Q302 292 304 300" dur="0.35s" repeatCount="indefinite" />
      </path>
      {/* Outer side flames */}
      <path d="M288 300 Q290 290 294 300" fill="#a06030" opacity="0.4">
        <animate attributeName="d" values="M288 300 Q290 290 294 300;M288 300 Q291 288 294 300;M288 300 Q290 290 294 300" dur="0.55s" repeatCount="indefinite" />
      </path>
      <path d="M304 300 Q308 289 310 300" fill="#a06030" opacity="0.4">
        <animate attributeName="d" values="M304 300 Q308 289 310 300;M304 300 Q309 287 310 300;M304 300 Q308 289 310 300" dur="0.65s" repeatCount="indefinite" />
      </path>
      {/* Sparks */}
      <circle cx="299" cy="284" r="0.7" fill="#e0b070" opacity="0.5">
        <animate attributeName="cy" values="284;266;250" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="303" cy="280" r="0.5" fill="#d0a060" opacity="0.4">
        <animate attributeName="cy" values="280;260;244" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="296" cy="286" r="0.6" fill="#e0c080" opacity="0.45">
        <animate attributeName="cy" values="286;270;254" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.1;0" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cx" values="296;292;290" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* === CAMPFIRE SPARKS — animated rising sparks from celebration fire === */}
      {/* Spark 4 — fast, drifting right */}
      <circle cx="301" cy="282" r="0.5" fill="#f0c870" opacity="0.55">
        <animate attributeName="cy" values="282;260;240" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="301;306;310" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0.25;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* Spark 5 — slower, drifting left */}
      <circle cx="294" cy="288" r="0.4" fill="#e0b060" opacity="0.4">
        <animate attributeName="cy" values="288;268;248" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="294;288;284" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0" dur="3.5s" repeatCount="indefinite" />
      </circle>
      {/* Spark 6 — medium, straight up */}
      <circle cx="298" cy="285" r="0.6" fill="#f0d080" opacity="0.5">
        <animate attributeName="cy" values="285;262;242" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="298;297;296" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Spark 7 — tiny, fast zigzag */}
      <circle cx="305" cy="284" r="0.35" fill="#e0c070" opacity="0.45">
        <animate attributeName="cy" values="284;268;252" dur="2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="305;302;308" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.2;0" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Spark 8 — delayed, large ember */}
      <circle cx="300" cy="290" r="0.7" fill="#d0a050" opacity="0.35">
        <animate attributeName="cy" values="290;272;256" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="300;304;306" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.35;0" dur="3.2s" repeatCount="indefinite" />
      </circle>
      {/* Spark 9 — very small, fast rise */}
      <circle cx="297" cy="286" r="0.3" fill="#f0d890" opacity="0.5">
        <animate attributeName="cy" values="286;264;244" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="297;294;292" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Spark 10 — large ember, slow drift right */}
      <circle cx="302" cy="287" r="0.55" fill="#e0b868" opacity="0.4">
        <animate attributeName="cy" values="287;270;255" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="302;308;314" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0" dur="2.8s" repeatCount="indefinite" />
      </circle>

      {/* Soldiers around campfire */}
      <path d="M282 294 Q280 284 283 278 Q286 284 284 294 Z" fill="#12100c" opacity="0.7" />
      <circle cx="283" cy="275" r="3.5" fill="#12100c" opacity="0.7" />
      <path d="M318 294 Q316 286 319 280 Q322 286 320 294 Z" fill="#12100c" opacity="0.7" />
      <circle cx="319" cy="277" r="3.5" fill="#12100c" opacity="0.7" />

      {/* === CAMPFIRE 2 — further left === */}
      <ellipse cx="120" cy="310" rx="22" ry="6" fill="url(#ch4_fire2)">
        <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire 2 flames — slightly bigger */}
      <path d="M117 309 Q120 298 123 309" fill="#d09050" opacity="0.45">
        <animate attributeName="d" values="M117 309 Q120 298 123 309;M117 309 Q121 296 123 309;M117 309 Q120 298 123 309" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M119 309 Q121 302 123 309" fill="#e0a860" opacity="0.3">
        <animate attributeName="d" values="M119 309 Q121 302 123 309;M119 309 Q122 300 123 309;M119 309 Q121 302 123 309" dur="0.45s" repeatCount="indefinite" />
      </path>
      {/* Soldiers at fire 2 */}
      <path d="M108 304 Q106 296 108 290 Q110 296 112 304 Z" fill="#12100c" opacity="0.6" />
      <path d="M132 302 Q130 294 132 288 Q134 294 136 302 Z" fill="#12100c" opacity="0.6" />

      {/* === TETHERED CAVALRY HORSE — with saddle, near soldiers === */}
      {/* Post */}
      <line x1="690" y1="258" x2="690" y2="282" stroke="#2a2518" strokeWidth="2" opacity="0.6" />
      {/* Rope from post to horse */}
      <path d="M690 264 Q700 266 710 264" fill="none" stroke="#3a3520" strokeWidth="0.8" opacity="0.4" />
      {/* Horse body */}
      <path d="M710 264 Q722 258 738 260 Q748 258 755 262 Q758 266 755 272 Q748 278 735 280 Q722 282 712 278 Q706 274 710 264 Z" fill="#12100c" opacity="0.7" />
      {/* Horse neck and head */}
      <path d="M710 264 Q706 254 704 248 Q703 244 706 242 Q710 240 712 244 Q714 248 712 256 Q711 260 710 264" fill="#12100c" opacity="0.7" />
      {/* Ear */}
      <path d="M706 242 Q705 238 708 240" fill="#12100c" opacity="0.6" />
      {/* Legs */}
      <line x1="720" y1="280" x2="718" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.65" />
      <line x1="740" y1="280" x2="742" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.65" />
      <line x1="728" y1="282" x2="726" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.6" />
      <line x1="748" y1="278" x2="750" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.6" />
      {/* Tail — slight sway */}
      <path d="M755 268 Q762 274 758 284" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.55">
        <animate attributeName="d" values="M755 268 Q762 274 758 284;M755 268 Q764 272 760 282;M755 268 Q762 274 758 284" dur="3s" repeatCount="indefinite" />
      </path>
      {/* === Saddle on cavalry horse === */}
      {/* Saddle seat — darker curve on horse's back */}
      <path d="M722 260 Q730 254 742 256 Q748 254 750 258 Q744 256 734 254 Q726 256 722 260 Z" fill="#1a1510" opacity="0.6" />
      {/* Pommel — front rise of saddle */}
      <path d="M722 260 Q720 256 722 254 Q724 256 722 260" fill="#1a1510" opacity="0.55" />
      {/* Cantle — rear rise of saddle */}
      <path d="M750 258 Q752 254 750 252 Q748 254 750 258" fill="#1a1510" opacity="0.55" />
      {/* Stirrup — hanging from saddle left side */}
      <path d="M728 262 Q726 268 728 272 Q730 268 728 262" fill="#2a2518" opacity="0.35" />
      {/* Girth strap visible underneath */}
      <path d="M730 262 Q732 270 730 276" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.3" />
      {/* Saddlecloth edge — dark blue (French cavalry) hint */}
      <path d="M724 262 Q732 266 746 262" fill="none" stroke="#1a1830" strokeWidth="1" opacity="0.25" />

      {/* Musket stacks — tripods */}
      <line x1="350" y1="258" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      <line x1="358" y1="258" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      <line x1="354" y1="256" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      {/* Second tripod */}
      <line x1="420" y1="262" x2="424" y2="288" stroke="#2a2520" strokeWidth="1.2" opacity="0.7" />
      <line x1="428" y1="262" x2="424" y2="288" stroke="#2a2520" strokeWidth="1.2" opacity="0.7" />

      {/* === FOREGROUND === */}
      {/* River bank vegetation — reeds */}
      <line x1="5" y1="278" x2="7" y2="258" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="280" x2="13" y2="262" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="18" y1="279" x2="19" y2="260" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />
      <line x1="780" y1="275" x2="782" y2="255" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="788" y1="276" x2="790" y2="258" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="795" y1="275" x2="796" y2="257" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />

      {/* Foreground rocks */}
      <path d="M0 368 Q20 358 45 362 Q65 356 90 362 L90 400 L0 400 Z" fill="#1a1510" />
      <path d="M720 365 Q740 355 770 360 Q790 355 800 362 L800 400 L720 400 Z" fill="#181510" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      <rect width="800" height="400" fill="url(#ch4_vignette)" />
      <rect x="0" y="375" width="800" height="25" fill="#0a0808" opacity="0.4" />
    </svg>
  );
}
