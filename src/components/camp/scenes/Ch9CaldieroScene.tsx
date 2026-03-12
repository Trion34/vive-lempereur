import React from 'react';

/**
 * Ch.9 — Caldiero, muddy field
 * Rain, grey daylight. Driving rain, mud everywhere, tattered uniforms,
 * broken equipment, bare trees, darkest palette of all scenes.
 * Dead horse, dead mule, trampled flag, blood-stained puddles,
 * overturned cannon, abandoned stretcher, cold fire pit.
 * Overturned supply wagon, abandoned limber, dead crow, surgeon working,
 * makeshift grave markers, tattered regimental colors, puddle reflections,
 * rope and harness, abandoned campfire attempt.
 * Collapsed tent, leaking medical crate, dog gnawing bone,
 * distant grave field, officer on horseback, broken signpost,
 * deep wheel ruts, torn letter, more puddle ripples, dense fog bank.
 * Mood: Despair, defeat — the army's lowest point.
 */
export function Ch9CaldieroScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Grey daylight sky — oppressive, leaden. Darkest scene. */}
        <linearGradient id="ch9_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15151a" />
          <stop offset="20%" stopColor="#1c1c22" />
          <stop offset="40%" stopColor="#222228" />
          <stop offset="60%" stopColor="#2a2a30" />
          <stop offset="80%" stopColor="#303035" />
          <stop offset="100%" stopColor="#38383c" />
        </linearGradient>
        {/* Mud ground — dark brown-grey */}
        <linearGradient id="ch9_mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#282420" />
          <stop offset="30%" stopColor="#25201a" />
          <stop offset="60%" stopColor="#221e16" />
          <stop offset="100%" stopColor="#1a1812" />
        </linearGradient>
        {/* Puddle — reflecting grey sky */}
        <linearGradient id="ch9_puddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#303035" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#252528" stopOpacity="0.4" />
        </linearGradient>
        {/* Bloodied puddle — darker, reddish-brown */}
        <linearGradient id="ch9_bloodPuddle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2020" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#201818" stopOpacity="0.4" />
        </linearGradient>
        {/* Rain pattern — diagonal */}
        <pattern id="ch9_rain" width="15" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-5)">
          <line x1="7" y1="0" x2="5" y2="30" stroke="#4a4a55" strokeWidth="0.5" opacity="0.22" />
        </pattern>
        {/* Heavy rain pattern — wider spacing */}
        <pattern id="ch9_heavyRain" width="25" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <line x1="12" y1="0" x2="8" y2="50" stroke="#4a4a55" strokeWidth="0.7" opacity="0.13" />
        </pattern>
        {/* Foreground rain — closer, thicker */}
        <pattern id="ch9_fgRain" width="35" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <line x1="17" y1="0" x2="12" y2="60" stroke="#50505a" strokeWidth="0.8" opacity="0.1" />
        </pattern>
        {/* Dark vignette — heaviest of all scenes */}
        <radialGradient id="ch9_vignette" cx="0.5" cy="0.5" r="0.6">
          <stop offset="30%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>
        {/* Fog drift */}
        <linearGradient id="ch9_fog" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#30303a" stopOpacity="0" />
          <stop offset="40%" stopColor="#30303a" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#30303a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#30303a" stopOpacity="0" />
        </linearGradient>
        {/* Cannon metal — dark iron grey */}
        <linearGradient id="ch9_cannonMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1e22" />
          <stop offset="100%" stopColor="#161618" />
        </linearGradient>
        {/* Stretcher canvas — dirty brownish grey */}
        <linearGradient id="ch9_canvas" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#221e1a" />
          <stop offset="50%" stopColor="#201c18" />
          <stop offset="100%" stopColor="#1e1a16" />
        </linearGradient>
        {/* Wagon wood — dark weathered brown */}
        <linearGradient id="ch9_wagonWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#221c14" />
          <stop offset="100%" stopColor="#1a1610" />
        </linearGradient>
        {/* Lantern glow — feeble warm light in the grey */}
        <radialGradient id="ch9_lanternGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3a3020" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#302818" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#302818" stopOpacity="0" />
        </radialGradient>
        {/* Puddle sky reflection — subtle lighter patch */}
        <linearGradient id="ch9_puddleReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a40" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#303035" stopOpacity="0.06" />
        </linearGradient>
        {/* Tattered flag gradient — faded tricolore, mostly ruined */}
        <linearGradient id="ch9_tatteredFlag" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1e2a" />
          <stop offset="50%" stopColor="#222020" />
          <stop offset="100%" stopColor="#2a1a1a" />
        </linearGradient>
        {/* Dense fog bank gradient — heavier, moving wall of mist */}
        <linearGradient id="ch9_fogBank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#28282e" stopOpacity="0" />
          <stop offset="15%" stopColor="#28282e" stopOpacity="0.06" />
          <stop offset="35%" stopColor="#2a2a30" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#2c2c32" stopOpacity="0.2" />
          <stop offset="65%" stopColor="#2a2a30" stopOpacity="0.16" />
          <stop offset="85%" stopColor="#28282e" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#28282e" stopOpacity="0" />
        </linearGradient>
        {/* Collapsed tent canvas — stained, dark */}
        <linearGradient id="ch9_tentCanvas" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#201c16" />
          <stop offset="50%" stopColor="#1e1a14" />
          <stop offset="100%" stopColor="#1c1812" />
        </linearGradient>
        {/* Medical bottle glass — dark greenish */}
        <linearGradient id="ch9_bottleGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2018" />
          <stop offset="100%" stopColor="#161a14" />
        </linearGradient>
        {/* Farmhouse stone — cold grey-brown masonry */}
        <linearGradient id="ch9_stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252320" />
          <stop offset="50%" stopColor="#201e1a" />
          <stop offset="100%" stopColor="#1c1a16" />
        </linearGradient>
        {/* Farmhouse roof tile — terracotta gone dark */}
        <linearGradient id="ch9_roofTile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#221a16" />
          <stop offset="100%" stopColor="#1a1412" />
        </linearGradient>
        {/* Lightning flash — full-screen white flash */}
        <radialGradient id="ch9_lightning" cx="0.3" cy="0.15" r="0.8">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="40%" stopColor="#c0c0d0" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        {/* Cloak fabric — dark heavy wool */}
        <linearGradient id="ch9_cloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#161416" />
          <stop offset="100%" stopColor="#121012" />
        </linearGradient>
        {/* Flood water — large standing water, darker than puddle */}
        <linearGradient id="ch9_floodWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28282e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#222226" stopOpacity="0.45" />
        </linearGradient>
        {/* Stretcher carrier lantern — dim orange */}
        <radialGradient id="ch9_carrierGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#352a18" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#352a18" stopOpacity="0" />
        </radialGradient>
        {/* Ground haze — low clinging mist near earth */}
        <linearGradient id="ch9_groundHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a30" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#28282e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#28282e" stopOpacity="0" />
        </linearGradient>
        {/* Mud texture noise — speckled ground variation */}
        <pattern id="ch9_mudSpeckle" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="2" r="0.4" fill="#1a1610" opacity="0.08" />
          <circle cx="4" cy="5" r="0.3" fill="#201c16" opacity="0.06" />
          <circle cx="5" cy="1" r="0.35" fill="#181410" opacity="0.07" />
          <circle cx="2" cy="4" r="0.25" fill="#1e1a14" opacity="0.05" />
        </pattern>
        {/* Erosion channel gradient — water-carved rivulets in mud */}
        <linearGradient id="ch9_erosion" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#181410" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#1a1610" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#181410" stopOpacity="0.1" />
        </linearGradient>
        {/* Straw/hay color — sodden, dark yellow-brown */}
        <linearGradient id="ch9_straw" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#222018" />
          <stop offset="100%" stopColor="#1e1c14" />
        </linearGradient>
        {/* Rust gradient — for metal equipment */}
        <linearGradient id="ch9_rust" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241814" />
          <stop offset="100%" stopColor="#1a1210" />
        </linearGradient>
        {/* Atmospheric light ray gradient — very subtle breaking through clouds */}
        <linearGradient id="ch9_lightRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35353a" stopOpacity="0.02" />
          <stop offset="50%" stopColor="#30303a" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#28282e" stopOpacity="0" />
        </linearGradient>
        {/* Smoke/mist wisp gradient */}
        <radialGradient id="ch9_smokeWisp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#2a2a30" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#28282e" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#28282e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* === LEADEN SKY === */}
      <rect width="800" height="400" fill="url(#ch9_sky)" />

      {/* Low, heavy clouds — oppressive, layered */}
      <ellipse cx="150" cy="30" rx="220" ry="22" fill="#202025" opacity="0.5" />
      <ellipse cx="400" cy="20" rx="250" ry="18" fill="#1e1e23" opacity="0.45" />
      <ellipse cx="650" cy="35" rx="200" ry="20" fill="#202025" opacity="0.4" />
      <ellipse cx="300" cy="50" rx="180" ry="15" fill="#1e1e23" opacity="0.35" />
      <ellipse cx="550" cy="45" rx="220" ry="18" fill="#202025" opacity="0.35" />
      <ellipse cx="100" cy="65" rx="150" ry="14" fill="#1e1e23" opacity="0.3" />
      <ellipse cx="700" cy="60" rx="160" ry="12" fill="#202025" opacity="0.3" />
      {/* Solid overcast blanket */}
      <ellipse cx="400" cy="75" rx="300" ry="12" fill="#222228" opacity="0.25" />
      <ellipse cx="200" cy="90" rx="180" ry="10" fill="#222228" opacity="0.2" />
      <ellipse cx="600" cy="85" rx="200" ry="10" fill="#222228" opacity="0.18" />
      {/* Additional cloud depth — more ominous layers */}
      <ellipse cx="250" cy="40" rx="140" ry="16" fill="#1c1c21" opacity="0.4" />
      <ellipse cx="500" cy="55" rx="160" ry="13" fill="#1e1e23" opacity="0.35" />
      <ellipse cx="720" cy="48" rx="120" ry="14" fill="#1c1c21" opacity="0.38" />
      {/* Subtle light rays breaking through — very faint, atmospheric */}
      <path d="M280 0 L278 90" stroke="url(#ch9_lightRay)" strokeWidth="8" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M520 0 L515 95" stroke="url(#ch9_lightRay)" strokeWidth="10" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="10s" begin="2s" repeatCount="indefinite" />
      </path>

      {/* === DISTANT HILLS — featureless, bleak === */}
      <path d="M0 130 Q100 120 200 128 Q300 118 400 125 Q500 115 600 122 Q700 118 800 128 L800 175 L0 175 Z"
        fill="#1c1c20" opacity="0.45" />
      <path d="M0 145 Q120 135 240 142 Q360 132 480 140 Q600 130 720 138 L800 142 L800 175 L0 175 Z"
        fill="#1e1e22" opacity="0.5" />
      {/* Additional hill detail — rocky outcrops */}
      <path d="M350 132 Q358 128 366 132 Q370 135 365 138 Q358 136 350 132 Z"
        fill="#1a1a1e" opacity="0.3" />
      <path d="M580 128 Q588 125 595 128 Q598 130 593 132 Q588 131 580 128 Z"
        fill="#1a1a1e" opacity="0.28" />

      {/* === OFFICER ON HORSEBACK — distant mounted figure surveying the retreat === */}
      <g opacity="0.3">
        {/* Horse body — silhouette in mid-distance */}
        <path d="M395 148 Q400 142 412 140 Q422 138 430 142 Q436 146 432 150 Q420 154 408 152 Q398 152 395 148 Z"
          fill="#1a1a1e" />
        {/* Horse legs — four thin lines */}
        <line x1="402" y1="152" x2="400" y2="162" stroke="#1a1a1e" strokeWidth="1" />
        <line x1="408" y1="153" x2="407" y2="163" stroke="#1a1a1e" strokeWidth="1" />
        <line x1="422" y1="152" x2="421" y2="162" stroke="#1a1a1e" strokeWidth="0.9" />
        <line x1="428" y1="151" x2="427" y2="161" stroke="#1a1a1e" strokeWidth="0.9" />
        {/* Horse head and neck */}
        <path d="M395 148 Q390 144 386 142 Q384 140 386 138" fill="none" stroke="#1a1a1e" strokeWidth="1.5" />
        {/* Horse tail */}
        <path d="M432 146 Q436 144 438 148" fill="none" stroke="#1a1a1e" strokeWidth="0.8" />
        {/* Rider — upright torso, officer posture */}
        <path d="M412 148 Q411 140 412 132 Q413 128 414 132 L415 148 Z" fill="#1a1a1e" />
        <circle cx="413" cy="128" r="3" fill="#1a1a1e" />
        {/* Bicorne hat silhouette */}
        <path d="M409 127 Q413 124 417 127" fill="#1a1a1e" />
        {/* Arm holding reins */}
        <path d="M410 136 Q406 140 402 144" fill="none" stroke="#1a1a1e" strokeWidth="0.8" />
        {/* Cloak billowing slightly */}
        <path d="M415 134 Q420 138 424 142 Q420 144 416 142" fill="#1a1a1e" opacity="0.7" />
      </g>

      {/* === DISTANT GRAVE FIELD — epidemic-scale death, rows of crosses on the hillside === */}
      <g opacity="0.2">
        {/* Row 1 — furthest, tiny, barely visible on the hill */}
        <line x1="240" y1="155" x2="240" y2="148" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="237" y1="150" x2="243" y2="150" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="252" y1="154" x2="252" y2="147" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="249" y1="149" x2="255" y2="149" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="264" y1="153" x2="264" y2="146" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="261" y1="148" x2="267" y2="148" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="276" y1="154" x2="276" y2="147" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="273" y1="149" x2="279" y2="149" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="288" y1="155" x2="288" y2="148" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="285" y1="150" x2="291" y2="150" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="300" y1="153" x2="300" y2="146" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="297" y1="148" x2="303" y2="148" stroke="#1e1a14" strokeWidth="0.5" />
        {/* Row 2 — slightly closer, slightly larger */}
        <line x1="246" y1="162" x2="246" y2="154" stroke="#1e1a14" strokeWidth="0.7" />
        <line x1="243" y1="157" x2="249" y2="157" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="258" y1="161" x2="258" y2="153" stroke="#1e1a14" strokeWidth="0.7" />
        <line x1="255" y1="156" x2="261" y2="156" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="270" y1="160" x2="270" y2="152" stroke="#1e1a14" strokeWidth="0.7" />
        <line x1="267" y1="155" x2="273" y2="155" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="282" y1="161" x2="282" y2="153" stroke="#1e1a14" strokeWidth="0.7" />
        <line x1="279" y1="156" x2="285" y2="156" stroke="#1e1a14" strokeWidth="0.5" />
        <line x1="294" y1="162" x2="294" y2="154" stroke="#1e1a14" strokeWidth="0.7" />
        <line x1="291" y1="157" x2="297" y2="157" stroke="#1e1a14" strokeWidth="0.5" />
        {/* Row 3 — a few more, staggered */}
        <line x1="252" y1="168" x2="252" y2="160" stroke="#1e1a14" strokeWidth="0.8" />
        <line x1="249" y1="163" x2="255" y2="163" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="268" y1="167" x2="268" y2="159" stroke="#1e1a14" strokeWidth="0.8" />
        <line x1="265" y1="162" x2="271" y2="162" stroke="#1e1a14" strokeWidth="0.6" />
        <line x1="284" y1="168" x2="284" y2="160" stroke="#1e1a14" strokeWidth="0.8" />
        <line x1="281" y1="163" x2="287" y2="163" stroke="#1e1a14" strokeWidth="0.6" />
      </g>

      {/* === BARE TREES — skeletal, leafless, broken === */}
      {/* Tree 1 — tall, twisted, wind-bent */}
      <path d="M175 178 Q178 150 182 125 Q184 110 185 100" fill="none" stroke="#252525" strokeWidth="2.5" />
      <path d="M185 100 Q192 85 196 92" fill="none" stroke="#252525" strokeWidth="1.2" />
      <path d="M185 100 Q178 88 175 95" fill="none" stroke="#252525" strokeWidth="1" />
      <path d="M183 118 Q175 108 172 114" fill="none" stroke="#252525" strokeWidth="0.8" />
      <path d="M183 118 Q190 110 192 116" fill="none" stroke="#252525" strokeWidth="0.7" />
      <path d="M184 135 Q190 128 193 132" fill="none" stroke="#252525" strokeWidth="0.6" />
      <path d="M196 90 Q202 82 206 88" fill="none" stroke="#252525" strokeWidth="0.5" opacity="0.5" />
      {/* Broken branch hanging */}
      <path d="M183 125 Q177 130 173 128 Q170 132 168 130" fill="none" stroke="#252525" strokeWidth="0.5" opacity="0.4" />
      {/* Additional small twigs */}
      <path d="M176 142 Q172 138 170 142" fill="none" stroke="#252525" strokeWidth="0.4" opacity="0.3" />
      <path d="M188 130 Q192 126 194 129" fill="none" stroke="#252525" strokeWidth="0.4" opacity="0.3" />
      {/* Dead bird nest — small dark clump */}
      <ellipse cx="186" cy="110" rx="2" ry="1.5" fill="#1a1816" opacity="0.3" />

      {/* Tree 2 — further away, smaller */}
      <path d="M540 172 Q543 148 546 128 Q548 118 549 110" fill="none" stroke="#252525" strokeWidth="2" />
      <path d="M549 110 Q555 98 557 106" fill="none" stroke="#252525" strokeWidth="0.9" />
      <path d="M549 110 Q543 100 541 107" fill="none" stroke="#252525" strokeWidth="0.7" />
      <path d="M547 125 Q540 118 538 123" fill="none" stroke="#252525" strokeWidth="0.6" />
      <path d="M547 125 Q553 120 555 124" fill="none" stroke="#252525" strokeWidth="0.5" />

      {/* Tree 3 — broken/fallen halfway */}
      <path d="M690 170 Q693 150 691 135" fill="none" stroke="#252525" strokeWidth="1.8" />
      <path d="M691 135 Q688 125 690 128" fill="none" stroke="#252525" strokeWidth="0.7" />
      <path d="M685 175 Q680 172 672 175" fill="none" stroke="#252525" strokeWidth="0.8" opacity="0.4" />

      {/* Tree 4 — far left, barely visible */}
      <path d="M60 175 Q62 158 64 145 Q65 138 66 132" fill="none" stroke="#222222" strokeWidth="1.5" opacity="0.5" />
      <path d="M66 132 Q70 125 72 130" fill="none" stroke="#222222" strokeWidth="0.6" opacity="0.4" />
      <path d="M66 132 Q62 126 60 130" fill="none" stroke="#222222" strokeWidth="0.5" opacity="0.35" />

      {/* === LOW FOG BAND across middle === */}
      <rect x="0" y="155" width="800" height="30" fill="url(#ch9_fog)">
        <animate attributeName="x" values="0;-20;0" dur="18s" repeatCount="indefinite" />
      </rect>

      {/* === DENSE FOG BANK — heavier wall of mist drifting through mid-distance === */}
      <rect x="-200" y="140" width="500" height="45" fill="url(#ch9_fogBank)">
        <animate attributeName="x" values="-200;900" dur="45s" repeatCount="indefinite" />
      </rect>
      <rect x="400" y="148" width="450" height="35" fill="url(#ch9_fogBank)" opacity="0.7">
        <animate attributeName="x" values="400;-500" dur="52s" repeatCount="indefinite" />
      </rect>
      {/* Thinner wisps — separate fog tendrils at different heights */}
      <rect x="100" y="165" width="300" height="18" fill="url(#ch9_fogBank)" opacity="0.4">
        <animate attributeName="x" values="100;-400;100" dur="38s" repeatCount="indefinite" />
      </rect>

      {/* === DISTANT RETREATING COLUMN — long line of beaten men fading into fog === */}
      {/* Far group — barely visible, just smudges */}
      <path d="M680 178 Q678 172 680 168 Q682 172 684 178 Z" fill="#1a1a1e" opacity="0.2" />
      <path d="M688 176 Q686 170 688 166 Q690 170 692 176 Z" fill="#1a1a1e" opacity="0.18" />
      <path d="M696 178 Q694 172 696 168 Q698 172 700 178 Z" fill="#1a1a1e" opacity="0.16" />
      <path d="M704 177 Q702 171 704 167 Q706 171 708 177 Z" fill="#1a1a1e" opacity="0.14" />
      <path d="M712 178 Q710 172 712 169 Q714 173 716 178 Z" fill="#1a1a1e" opacity="0.12" />
      <path d="M720 176 Q718 171 720 168 Q722 172 724 176 Z" fill="#1a1a1e" opacity="0.1" />
      <path d="M728 178 Q726 173 728 170 Q730 174 732 178 Z" fill="#1a1a1e" opacity="0.08" />
      <path d="M736 177 Q734 172 736 169 Q738 173 740 177 Z" fill="#1a1a1e" opacity="0.06" />
      {/* Mid-distance group — slightly more visible */}
      <path d="M650 185 Q648 178 650 173 Q652 178 654 185 Z" fill="#1a1a1e" opacity="0.25" />
      <path d="M660 183 Q658 176 660 171 Q662 176 664 183 Z" fill="#1a1a1e" opacity="0.22" />
      <path d="M670 185 Q668 178 670 174 Q672 179 674 185 Z" fill="#1a1a1e" opacity="0.2" />
      <path d="M643 186 Q641 180 643 176 Q645 181 647 186 Z" fill="#1a1a1e" opacity="0.22" />

      {/* === MORE RETREATING FIGURES — additional distant soldiers trudging away === */}
      {/* Straggling trio — stumbling together, far mid-ground */}
      <path d="M620 192 Q618 185 620 180 Q622 185 624 192 Z" fill="#1a1a1e" opacity="0.28" />
      <path d="M630 194 Q628 187 630 182 Q632 187 634 194 Z" fill="#1a1a1e" opacity="0.24" />
      <path d="M638 191 Q636 184 638 179 Q640 184 642 191 Z" fill="#1a1a1e" opacity="0.2" />
      {/* Lone figure — far right, barely a smudge, limping */}
      <path d="M760 188 Q758 181 760 176 Q762 181 764 188 Z" fill="#1a1a1e" opacity="0.14" />
      {/* Leaning on stick/musket */}
      <line x1="764" y1="177" x2="766" y2="190" stroke="#1a1a1e" strokeWidth="0.5" opacity="0.1" />

      {/* === MUDDY FIELD === */}
      <path d="M0 175 Q200 172 400 175 Q600 172 800 175 L800 400 L0 400 Z"
        fill="url(#ch9_mud)" />

      {/* Mud ruts and wagon tracks */}
      <path d="M80 208 Q180 202 280 208 Q380 204 480 210 Q560 206 640 212"
        fill="none" stroke="#1e1a14" strokeWidth="1.2" opacity="0.3" />
      <path d="M80 214 Q180 208 280 214 Q380 210 480 216 Q560 212 640 218"
        fill="none" stroke="#1e1a14" strokeWidth="1" opacity="0.25" />
      <path d="M150 238 Q250 232 350 238 Q450 234 550 240"
        fill="none" stroke="#1e1a14" strokeWidth="0.8" opacity="0.2" />
      <path d="M200 260 Q280 256 360 260 Q440 256 520 262"
        fill="none" stroke="#1e1a14" strokeWidth="0.7" opacity="0.18" />
      {/* Deep rut — foreground */}
      <path d="M50 320 Q200 315 400 322 Q600 318 750 324"
        fill="none" stroke="#1a1610" strokeWidth="1.5" opacity="0.15" />
      {/* Additional deep ruts — more churned ground */}
      <path d="M0 340 Q150 336 300 342 Q450 338 600 344 Q700 340 800 346"
        fill="none" stroke="#1a1610" strokeWidth="1.8" opacity="0.12" />
      <path d="M30 355 Q180 350 350 358 Q500 352 680 360"
        fill="none" stroke="#181410" strokeWidth="1.3" opacity="0.1" />

      {/* === DEEP WHEEL RUTS — artillery passed through, gouging the mud === */}
      {/* Left-to-right rut pair — wide gauge, deep */}
      <path d="M0 282 Q100 278 200 284 Q300 280 400 286 Q500 282 600 288 Q700 284 800 290"
        fill="none" stroke="#181410" strokeWidth="2.5" opacity="0.18" />
      <path d="M0 290 Q100 286 200 292 Q300 288 400 294 Q500 290 600 296 Q700 292 800 298"
        fill="none" stroke="#181410" strokeWidth="2.5" opacity="0.18" />
      {/* Displaced mud ridges between the ruts */}
      <path d="M50 286 Q150 282 250 288 Q350 284 450 290 Q550 286 650 292 Q750 288 800 294"
        fill="none" stroke="#1c1814" strokeWidth="1.2" opacity="0.1" />
      {/* Water pooling in the rut channels */}
      <ellipse cx="180" cy="285" rx="25" ry="2.5" fill="url(#ch9_puddle)" opacity="0.6" />
      <ellipse cx="380" cy="289" rx="30" ry="2.5" fill="url(#ch9_puddle)" opacity="0.5" />
      <ellipse cx="580" cy="293" rx="22" ry="2" fill="url(#ch9_puddle)" opacity="0.45" />
      {/* Cross-ruts — a second set at an angle where a different gun passed */}
      <path d="M320 270 Q360 278 400 272 Q440 280 480 274"
        fill="none" stroke="#181410" strokeWidth="2" opacity="0.12" />
      <path d="M322 276 Q362 284 402 278 Q442 286 482 280"
        fill="none" stroke="#181410" strokeWidth="2" opacity="0.12" />

      {/* === MUD TEXTURE — speckled ground variation across the field === */}
      <rect x="0" y="175" width="800" height="225" fill="url(#ch9_mudSpeckle)" opacity="0.6" />

      {/* === SCATTERED ROCKS AND STONES — embedded in mud, field debris === */}
      {/* Cluster near left — fieldstones kicked up by artillery */}
      <ellipse cx="42" cy="298" rx="4" ry="2.5" fill="#222018" opacity="0.25" />
      <ellipse cx="50" cy="302" rx="3" ry="2" fill="#1e1c16" opacity="0.22" />
      <ellipse cx="38" cy="305" rx="2.5" ry="1.5" fill="#252220" opacity="0.2" />
      {/* Mid-field stones — half buried */}
      <ellipse cx="350" cy="280" rx="3.5" ry="2" fill="#222018" opacity="0.18" />
      <ellipse cx="358" cy="283" rx="2" ry="1.5" fill="#1e1c16" opacity="0.15" />
      {/* Right field cluster */}
      <ellipse cx="590" cy="310" rx="3" ry="2" fill="#252220" opacity="0.2" />
      <ellipse cx="596" cy="314" rx="4" ry="2.5" fill="#222018" opacity="0.18" />
      <ellipse cx="584" cy="316" rx="2.5" ry="1.8" fill="#1e1c16" opacity="0.16" />
      {/* Foreground larger stones */}
      <ellipse cx="160" cy="370" rx="5" ry="3" fill="#252220" opacity="0.22" />
      <ellipse cx="168" cy="374" rx="3.5" ry="2" fill="#201e18" opacity="0.2" />
      <ellipse cx="680" cy="395" rx="4.5" ry="2.5" fill="#222018" opacity="0.18" />
      {/* Isolated pebbles — scattered across field */}
      <circle cx="420" cy="305" r="1.5" fill="#252220" opacity="0.15" />
      <circle cx="290" cy="360" r="1.2" fill="#222018" opacity="0.12" />
      <circle cx="530" cy="375" r="1.8" fill="#1e1c16" opacity="0.14" />
      <circle cx="720" cy="350" r="1.3" fill="#252220" opacity="0.13" />
      <circle cx="180" cy="320" r="1" fill="#222018" opacity="0.11" />

      {/* === GROUND VARIATION — darker/lighter mud patches, trodden areas === */}
      {/* Trodden path — where many boots passed, compacted and darker */}
      <path d="M100 300 Q200 295 350 302 Q500 298 650 305 Q750 302 800 308"
        fill="none" stroke="#161210" strokeWidth="8" opacity="0.06" strokeLinecap="round" />
      {/* Churned area around wagon wreckage */}
      <ellipse cx="320" cy="215" rx="45" ry="10" fill="#201a14" opacity="0.06" />
      {/* Wet sheen patches — standing moisture on packed mud */}
      <ellipse cx="180" cy="250" rx="20" ry="5" fill="#2a2a30" opacity="0.04" />
      <ellipse cx="440" cy="320" rx="25" ry="6" fill="#2a2a30" opacity="0.03" />
      <ellipse cx="660" cy="340" rx="18" ry="4" fill="#2a2a30" opacity="0.04" />
      {/* Additional mud variations — darker/lighter patches */}
      <ellipse cx="240" cy="290" rx="35" ry="8" fill="#1c1812" opacity="0.05" />
      <ellipse cx="500" cy="310" rx="40" ry="10" fill="#1a1610" opacity="0.06" />
      <ellipse cx="720" cy="315" rx="30" ry="7" fill="#201c16" opacity="0.04" />
      {/* Wet sheen patches — more water accumulation */}
      <ellipse cx="365" cy="265" rx="22" ry="5" fill="#2a2a30" opacity="0.035" />
      <ellipse cx="570" cy="285" rx="18" ry="4" fill="#2a2a30" opacity="0.03" />
      <ellipse cx="420" cy="355" rx="28" ry="6" fill="#2a2a30" opacity="0.04" />

      {/* === EROSION CHANNELS — rain-carved rivulets draining across the field === */}
      <path d="M200 185 Q210 195 215 210 Q218 225 220 240 Q225 260 228 280"
        fill="none" stroke="url(#ch9_erosion)" strokeWidth="1.5" opacity="0.2" />
      <path d="M460 180 Q465 195 462 215 Q458 235 460 255 Q465 275 468 290"
        fill="none" stroke="url(#ch9_erosion)" strokeWidth="1.2" opacity="0.18" />
      <path d="M640 178 Q638 195 642 215 Q645 230 644 248"
        fill="none" stroke="url(#ch9_erosion)" strokeWidth="1" opacity="0.15" />
      {/* Smaller branching rivulets */}
      <path d="M215 210 Q220 215 228 218" fill="none" stroke="#181410" strokeWidth="0.6" opacity="0.1" />
      <path d="M218 225 Q212 230 208 236" fill="none" stroke="#181410" strokeWidth="0.5" opacity="0.08" />
      <path d="M462 215 Q468 220 472 228" fill="none" stroke="#181410" strokeWidth="0.5" opacity="0.08" />

      {/* Boot prints in mud — scattered, irregular */}
      <ellipse cx="305" cy="310" rx="3" ry="5" fill="#1a1610" opacity="0.12" />
      <ellipse cx="312" cy="318" rx="3" ry="5" fill="#1a1610" opacity="0.1" transform="rotate(-10 312 318)" />
      <ellipse cx="320" cy="308" rx="2.5" ry="4.5" fill="#1a1610" opacity="0.11" transform="rotate(5 320 308)" />
      <ellipse cx="480" cy="340" rx="3" ry="5.5" fill="#1a1610" opacity="0.1" transform="rotate(-8 480 340)" />
      <ellipse cx="488" cy="350" rx="3" ry="5" fill="#1a1610" opacity="0.09" />
      <ellipse cx="250" cy="345" rx="2.5" ry="4.5" fill="#1a1610" opacity="0.1" transform="rotate(12 250 345)" />
      <ellipse cx="258" cy="355" rx="3" ry="5" fill="#1a1610" opacity="0.08" transform="rotate(-5 258 355)" />
      <ellipse cx="590" cy="325" rx="3" ry="5" fill="#1a1610" opacity="0.1" transform="rotate(3 590 325)" />
      <ellipse cx="596" cy="335" rx="2.5" ry="4.5" fill="#1a1610" opacity="0.09" transform="rotate(-6 596 335)" />
      {/* Additional boot prints — more traffic */}
      <ellipse cx="420" cy="295" rx="2.5" ry="4.5" fill="#1a1610" opacity="0.11" transform="rotate(15 420 295)" />
      <ellipse cx="428" cy="302" rx="3" ry="5" fill="#1a1610" opacity="0.09" transform="rotate(-12 428 302)" />
      <ellipse cx="660" cy="310" rx="2.5" ry="4.5" fill="#1a1610" opacity="0.1" transform="rotate(8 660 310)" />
      <ellipse cx="668" cy="318" rx="3" ry="5" fill="#1a1610" opacity="0.08" transform="rotate(-18 668 318)" />
      <ellipse cx="180" cy="305" rx="2.5" ry="4.5" fill="#1a1610" opacity="0.09" transform="rotate(22 180 305)" />
      <ellipse cx="188" cy="312" rx="3" ry="5" fill="#1a1610" opacity="0.08" transform="rotate(-5 188 312)" />
      {/* Horse hoof prints — larger, deeper */}
      <ellipse cx="380" cy="270" rx="4" ry="5.5" fill="#181410" opacity="0.12" transform="rotate(10 380 270)" />
      <ellipse cx="388" cy="275" rx="4" ry="5.5" fill="#181410" opacity="0.11" transform="rotate(-15 388 275)" />
      <ellipse cx="396" cy="268" rx="4" ry="5.5" fill="#181410" opacity="0.1" transform="rotate(5 396 268)" />
      {/* Dragging furrows — someone being dragged or dragging feet */}
      <path d="M420 350 Q430 348 440 350 Q450 348 460 351 Q470 349 480 352"
        fill="none" stroke="#181410" strokeWidth="2" opacity="0.08" />
      <path d="M422 354 Q432 352 442 354 Q452 352 462 355 Q472 353 482 356"
        fill="none" stroke="#181410" strokeWidth="1.8" opacity="0.07" />

      {/* === PUDDLES — reflecting grey sky === */}
      <ellipse cx="280" cy="228" rx="55" ry="8" fill="url(#ch9_puddle)" />
      <ellipse cx="520" cy="255" rx="45" ry="7" fill="url(#ch9_puddle)" />
      <ellipse cx="140" cy="275" rx="38" ry="5.5" fill="url(#ch9_puddle)" />
      <ellipse cx="650" cy="288" rx="35" ry="5" fill="url(#ch9_puddle)" />
      <ellipse cx="400" cy="295" rx="42" ry="6" fill="url(#ch9_puddle)" />
      {/* Additional puddle — large, near cannon */}
      <ellipse cx="55" cy="340" rx="40" ry="6" fill="url(#ch9_puddle)" />
      {/* Bloodied puddle near dead horse */}
      <ellipse cx="110" cy="230" rx="30" ry="6" fill="url(#ch9_bloodPuddle)" />
      {/* Second blood puddle near stretcher */}
      <ellipse cx="365" cy="368" rx="22" ry="4" fill="url(#ch9_bloodPuddle)" />
      {/* Additional smaller puddles — scattered water accumulation */}
      <ellipse cx="220" cy="248" rx="25" ry="4" fill="url(#ch9_puddle)" opacity="0.8" />
      <ellipse cx="460" cy="278" rx="28" ry="4.5" fill="url(#ch9_puddle)" opacity="0.75" />
      <ellipse cx="590" cy="265" rx="22" ry="3.5" fill="url(#ch9_puddle)" opacity="0.7" />
      <ellipse cx="330" cy="315" rx="30" ry="5" fill="url(#ch9_puddle)" opacity="0.8" />
      <ellipse cx="700" cy="330" rx="26" ry="4" fill="url(#ch9_puddle)" opacity="0.7" />
      <ellipse cx="165" cy="315" rx="20" ry="3" fill="url(#ch9_puddle)" opacity="0.65" />
      <ellipse cx="550" cy="340" rx="24" ry="4" fill="url(#ch9_puddle)" opacity="0.7" />
      {/* Boot-print puddles — water filling footprints */}
      <ellipse cx="310" cy="310" rx="8" ry="2.5" fill="url(#ch9_puddle)" opacity="0.6" />
      <ellipse cx="485" cy="345" rx="7" ry="2" fill="url(#ch9_puddle)" opacity="0.55" />
      <ellipse cx="595" cy="330" rx="6" ry="2" fill="url(#ch9_puddle)" opacity="0.5" />

      {/* === PUDDLE REFLECTIONS — subtle lighter shapes reflecting the grey sky === */}
      {/* Reflection in large puddle — ghostly cloud shape */}
      <ellipse cx="280" cy="226" rx="22" ry="3" fill="url(#ch9_puddleReflect)" />
      <ellipse cx="295" cy="228" rx="14" ry="2" fill="url(#ch9_puddleReflect)" />
      {/* Reflection in second puddle — sky break shimmer */}
      <ellipse cx="520" cy="254" rx="18" ry="2.5" fill="url(#ch9_puddleReflect)" />
      {/* Reflection in foreground puddle — tree silhouette reflected */}
      <path d="M398 293 Q400 290 402 293" fill="none" stroke="#35353a" strokeWidth="0.4" opacity="0.08" />
      <path d="M396 294 Q400 289 404 294" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.06" />
      {/* Reflection in cannon puddle — faint barrel shape */}
      <ellipse cx="50" cy="339" rx="15" ry="2" fill="url(#ch9_puddleReflect)" />
      {/* Reflection in puddle near dead mule */}
      <ellipse cx="650" cy="287" rx="12" ry="1.8" fill="url(#ch9_puddleReflect)" />

      {/* Rain ripples in puddles */}
      <circle cx="270" cy="226" r="3" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.25">
        <animate attributeName="r" values="3;8;3" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0;0.25" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="295" cy="230" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.2">
        <animate attributeName="r" values="2;6;2" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="515" cy="253" r="2.5" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.2">
        <animate attributeName="r" values="2.5;7;2.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="535" cy="258" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.15">
        <animate attributeName="r" values="2;5;2" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="395" cy="293" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.18">
        <animate attributeName="r" values="2;6;2" dur="1.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0;0.18" dur="1.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="410" cy="298" r="1.5" fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.12">
        <animate attributeName="r" values="1.5;4;1.5" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="2.2s" repeatCount="indefinite" />
      </circle>
      {/* Ripple in blood puddle */}
      <circle cx="108" cy="228" r="2" fill="none" stroke="#2a2222" strokeWidth="0.3" opacity="0.15">
        <animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* === ADDITIONAL PUDDLE RIPPLES — more animated rain impacts in different puddles === */}
      {/* Ripples in left puddle (cx=140) */}
      <circle cx="132" cy="274" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.2">
        <animate attributeName="r" values="2;6;2" dur="1.9s" begin="0.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="1.9s" begin="0.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="148" cy="276" r="1.5" fill="none" stroke="#35353a" strokeWidth="0.25" opacity="0.15">
        <animate attributeName="r" values="1.5;5;1.5" dur="1.4s" begin="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="1.4s" begin="0.7s" repeatCount="indefinite" />
      </circle>
      {/* Ripples in mule puddle (cx=650) */}
      <circle cx="642" cy="286" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.18">
        <animate attributeName="r" values="2;5.5;2" dur="2.1s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0;0.18" dur="2.1s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="658" cy="290" r="1.5" fill="none" stroke="#35353a" strokeWidth="0.25" opacity="0.14">
        <animate attributeName="r" values="1.5;4.5;1.5" dur="1.6s" begin="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.14;0;0.14" dur="1.6s" begin="0.9s" repeatCount="indefinite" />
      </circle>
      {/* Ripples in cannon puddle (cx=55) */}
      <circle cx="62" cy="342" r="2" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.16">
        <animate attributeName="r" values="2;5;2" dur="2.3s" begin="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.16;0;0.16" dur="2.3s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      {/* Ripples in wheel-rut water */}
      <circle cx="185" cy="285" r="1.5" fill="none" stroke="#35353a" strokeWidth="0.25" opacity="0.14">
        <animate attributeName="r" values="1.5;4;1.5" dur="1.3s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.14;0;0.14" dur="1.3s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="375" cy="288" r="1.5" fill="none" stroke="#35353a" strokeWidth="0.25" opacity="0.12">
        <animate attributeName="r" values="1.5;4;1.5" dur="1.7s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.7s" begin="0.8s" repeatCount="indefinite" />
      </circle>

      {/* === RAIN SPLASH EFFECTS on ground — small animated circles === */}
      {/* Splash 1 — on mud near center */}
      <circle cx="350" cy="315" r="1" fill="none" stroke="#35353a" strokeWidth="0.4" opacity="0">
        <animate attributeName="r" values="0;4;0" dur="0.8s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.2;0" dur="0.8s" begin="0s" repeatCount="indefinite" />
      </circle>
      {/* Splash 2 — staggered timing */}
      <circle cx="180" cy="330" r="1" fill="none" stroke="#35353a" strokeWidth="0.4" opacity="0">
        <animate attributeName="r" values="0;3.5;0" dur="0.7s" begin="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.18;0" dur="0.7s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      {/* Splash 3 */}
      <circle cx="550" cy="305" r="1" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="0;3;0" dur="0.9s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.15;0" dur="0.9s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      {/* Splash 4 — near foreground */}
      <circle cx="680" cy="350" r="1" fill="none" stroke="#35353a" strokeWidth="0.4" opacity="0">
        <animate attributeName="r" values="0;4.5;0" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.2;0" dur="0.75s" begin="0.15s" repeatCount="indefinite" />
      </circle>
      {/* Splash 5 — on cannon puddle */}
      <circle cx="50" cy="338" r="1" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="0;3;0" dur="0.85s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.16;0" dur="0.85s" begin="0.4s" repeatCount="indefinite" />
      </circle>
      {/* Splash 6 — on blood puddle near stretcher */}
      <circle cx="370" cy="366" r="1" fill="none" stroke="#2a2222" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="0;3;0" dur="0.95s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.12;0" dur="0.95s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      {/* Splash 7 — far right ground */}
      <circle cx="740" cy="320" r="1" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="0;3.5;0" dur="0.65s" begin="0.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.14;0" dur="0.65s" begin="0.2s" repeatCount="indefinite" />
      </circle>

      {/* === DEAD HORSE — collapsed in the mud === */}
      <path d="M80 220 Q95 210 120 212 Q140 214 150 220 Q155 225 148 228 Q130 232 108 230 Q88 228 78 224 Q75 222 80 220 Z"
        fill="#1a1816" opacity="0.6" />
      {/* Legs sticking up */}
      <path d="M90 218 Q88 208 86 200" fill="none" stroke="#1a1816" strokeWidth="2" opacity="0.45" />
      <path d="M105 216 Q103 206 100 198" fill="none" stroke="#1a1816" strokeWidth="1.8" opacity="0.4" />
      {/* Head/neck area */}
      <path d="M145 218 Q155 215 160 220" fill="none" stroke="#1a1816" strokeWidth="2.5" opacity="0.45" />

      {/* === DOG GNAWING BONE — small stray near the dead horse === */}
      <g>
        {/* Dog body — small, scrappy silhouette */}
        <path d="M160 226 Q165 222 172 222 Q178 223 180 226 Q178 229 172 230 Q165 229 160 226 Z"
          fill="#161412" opacity="0.55" />
        {/* Dog head — lowered, gnawing */}
        <path d="M157 224 Q153 222 150 224 Q152 226 156 226 Z" fill="#161412" opacity="0.55" />
        {/* Ears — small, pointed */}
        <path d="M155 222 Q154 220 156 221" fill="#161412" opacity="0.45" />
        <path d="M158 222 Q157 219 159 221" fill="#161412" opacity="0.45" />
        {/* Legs — thin, crouched over food */}
        <line x1="164" y1="228" x2="163" y2="234" stroke="#161412" strokeWidth="0.8" opacity="0.4" />
        <line x1="168" y1="229" x2="167" y2="235" stroke="#161412" strokeWidth="0.8" opacity="0.4" />
        <line x1="174" y1="229" x2="174" y2="235" stroke="#161412" strokeWidth="0.7" opacity="0.35" />
        <line x1="178" y1="228" x2="178" y2="234" stroke="#161412" strokeWidth="0.7" opacity="0.35" />
        {/* Tail — thin, low */}
        <path d="M180 225 Q184 222 186 224" fill="none" stroke="#161412" strokeWidth="0.6" opacity="0.35" />
        {/* Bone — pale shape under the dog's mouth */}
        <line x1="148" y1="226" x2="155" y2="225" stroke="#2a2824" strokeWidth="1.2" opacity="0.35" />
        {/* Bone knobs */}
        <circle cx="148" cy="226" r="1" fill="#2a2824" opacity="0.3" />
        <circle cx="155" cy="225" r="0.8" fill="#2a2824" opacity="0.25" />
      </g>

      {/* === ROPE AND HARNESS — broken horse harness tangled on ground near dead horse === */}
      {/* Main harness strap — snapped, trailing from the carcass */}
      <path d="M155 222 Q165 220 175 224 Q185 222 195 226 Q200 228 205 225"
        fill="none" stroke="#1a1614" strokeWidth="1.2" opacity="0.35" />
      {/* Secondary strap — looped, dragging */}
      <path d="M162 226 Q168 232 175 228 Q180 234 186 230"
        fill="none" stroke="#1a1614" strokeWidth="0.8" opacity="0.3" />
      {/* Buckle — small metallic shape */}
      <rect x="174" y="223" width="3" height="2" rx="0.5" fill="#2a2a2e" opacity="0.25" />
      {/* Tangled rope coils on the ground */}
      <path d="M190 228 Q195 224 198 228 Q201 232 196 234 Q191 232 190 228 Z"
        fill="none" stroke="#1a1614" strokeWidth="0.7" opacity="0.25" />
      {/* Loose rope end — trailing into mud */}
      <path d="M205 225 Q212 226 218 230 Q222 234 225 232"
        fill="none" stroke="#1a1614" strokeWidth="0.6" opacity="0.2" />
      {/* Leather breast collar piece */}
      <path d="M148 224 Q152 228 158 226" fill="none" stroke="#1e1812" strokeWidth="1.5" opacity="0.3" />

      {/* === DEAD MULE — collapsed near road, packs still on === */}
      <path d="M620 305 Q635 298 658 300 Q675 302 682 308 Q685 314 678 316 Q658 320 638 318 Q622 316 618 312 Q616 308 620 305 Z"
        fill="#1c1a16" opacity="0.55" />
      {/* Legs — folded under */}
      <path d="M632 316 Q630 322 628 326" fill="none" stroke="#1c1a16" strokeWidth="1.5" opacity="0.35" />
      <path d="M655 318 Q654 324 652 328" fill="none" stroke="#1c1a16" strokeWidth="1.3" opacity="0.3" />
      {/* Mule head — drooped, lifeless */}
      <path d="M678 306 Q688 302 694 306 Q696 310 692 312" fill="#1c1a16" opacity="0.45" />
      {/* Pack still strapped on — bulging saddlebags */}
      <path d="M640 300 Q645 294 655 296 Q660 298 658 302" fill="#201c16" opacity="0.4" />
      <path d="M660 300 Q665 295 672 298 Q674 302 670 304" fill="#201c16" opacity="0.38" />
      {/* Strap across body */}
      <line x1="638" y1="302" x2="672" y2="302" stroke="#1a1814" strokeWidth="0.8" opacity="0.3" />

      {/* === OVERTURNED CANNON — stuck in the mud, tilted, abandoned === */}
      <g transform="rotate(22 40 330)">
        {/* Barrel */}
        <rect x="10" y="318" width="60" height="8" rx="4" fill="url(#ch9_cannonMetal)" opacity="0.6" />
        {/* Muzzle */}
        <ellipse cx="10" cy="322" rx="5" ry="5" fill="#1a1a1e" opacity="0.5" />
        {/* Trunnion bumps */}
        <circle cx="40" cy="316" r="2.5" fill="#1e1e22" opacity="0.45" />
        <circle cx="40" cy="328" r="2.5" fill="#1e1e22" opacity="0.45" />
      </g>
      {/* Cannon wheel — one broken, half-submerged */}
      <path d="M65 328 Q58 318 55 308 Q52 298 58 292" fill="none" stroke="#221e18" strokeWidth="2" opacity="0.4" />
      {/* Broken spoke */}
      <line x1="58" y1="310" x2="65" y2="305" stroke="#221e18" strokeWidth="0.8" opacity="0.3" />
      {/* Second wheel — flat in the mud */}
      <ellipse cx="28" cy="350" rx="14" ry="3" fill="#221e18" opacity="0.25" />
      {/* Mud splatters on cannon */}
      <ellipse cx="35" cy="332" rx="8" ry="3" fill="#25201a" opacity="0.2" />

      {/* === ABANDONED ARTILLERY LIMBER — wooden frame without cannon, wheel missing === */}
      <g>
        {/* Main limber frame — the A-frame trail resting in mud */}
        <path d="M72 260 L105 255 L110 260 L78 265 Z" fill="url(#ch9_wagonWood)" opacity="0.45" />
        {/* Trail arms — converging poles */}
        <line x1="105" y1="255" x2="135" y2="248" stroke="#1e1a14" strokeWidth="2" opacity="0.4" />
        <line x1="110" y1="260" x2="135" y2="254" stroke="#1e1a14" strokeWidth="2" opacity="0.4" />
        {/* Pintle hook — where cannon would attach (empty) */}
        <circle cx="136" cy="251" r="2" fill="#1e1e22" opacity="0.35" />
        {/* One remaining wheel — tilted, half sunk in mud */}
        <circle cx="88" cy="258" r="11" fill="none" stroke="#221e18" strokeWidth="1.5" opacity="0.4" />
        {/* Wheel spokes */}
        <line x1="88" y1="247" x2="88" y2="269" stroke="#221e18" strokeWidth="0.6" opacity="0.3" />
        <line x1="77" y1="258" x2="99" y2="258" stroke="#221e18" strokeWidth="0.6" opacity="0.3" />
        <line x1="80" y1="250" x2="96" y2="266" stroke="#221e18" strokeWidth="0.5" opacity="0.25" />
        <line x1="80" y1="266" x2="96" y2="250" stroke="#221e18" strokeWidth="0.5" opacity="0.25" />
        {/* Missing wheel axle — bare stub sticking out */}
        <line x1="108" y1="258" x2="118" y2="258" stroke="#1e1e22" strokeWidth="1.5" opacity="0.3" />
        {/* Axle hub where wheel should be — empty */}
        <circle cx="118" cy="258" r="1.5" fill="#1e1e22" opacity="0.25" />
        {/* Ammunition box on limber — open, empty */}
        <rect x="82" y="252" width="12" height="6" rx="0.5" fill="#1a1610" opacity="0.35" />
        {/* Open lid — hinged up */}
        <line x1="82" y1="252" x2="80" y2="248" stroke="#1a1610" strokeWidth="0.8" opacity="0.3" />
        <line x1="80" y1="248" x2="92" y2="248" stroke="#1a1610" strokeWidth="0.6" opacity="0.25" />
        {/* Mud splashed up the frame */}
        <ellipse cx="95" cy="262" rx="6" ry="2" fill="#25201a" opacity="0.15" />
      </g>

      {/* === COLLAPSED TENT — fallen flat in the mud, stakes pulled out === */}
      <g>
        {/* Main canvas — crumpled flat on the ground, irregular shape */}
        <path d="M42 195 Q55 190 72 192 Q85 194 90 200 Q88 206 78 208 Q60 210 45 206 Q38 202 42 195 Z"
          fill="url(#ch9_tentCanvas)" opacity="0.4" />
        {/* Canvas wrinkles/folds — showing it was a tent */}
        <path d="M48 198 Q58 194 68 196" fill="none" stroke="#1a1610" strokeWidth="0.6" opacity="0.25" />
        <path d="M52 202 Q62 198 75 200" fill="none" stroke="#1a1610" strokeWidth="0.5" opacity="0.2" />
        <path d="M45 205 Q55 202 70 204" fill="none" stroke="#1a1610" strokeWidth="0.4" opacity="0.18" />
        {/* Ridge pole — still visible under the canvas, a lump */}
        <path d="M50 196 Q65 192 80 196" fill="none" stroke="#1c1814" strokeWidth="1.5" opacity="0.3" />
        {/* Pulled-out tent stake — on the ground nearby */}
        <line x1="35" y1="200" x2="28" y2="196" stroke="#1e1a14" strokeWidth="0.8" opacity="0.3" />
        <line x1="28" y1="196" x2="26" y2="194" stroke="#2a2a2e" strokeWidth="0.5" opacity="0.2" />
        {/* Second pulled stake */}
        <line x1="92" y1="202" x2="98" y2="198" stroke="#1e1a14" strokeWidth="0.7" opacity="0.25" />
        {/* Rope still attached, trailing limply */}
        <path d="M35 200 Q30 204 25 202 Q20 206 16 204"
          fill="none" stroke="#1a1614" strokeWidth="0.5" opacity="0.2" />
        <path d="M92 202 Q96 206 100 204 Q104 208 108 206"
          fill="none" stroke="#1a1614" strokeWidth="0.5" opacity="0.2" />
        {/* Mud pooled on top of collapsed canvas */}
        <ellipse cx="62" cy="200" rx="10" ry="3" fill="#25201a" opacity="0.15" />
        {/* Water pooling in a fold */}
        <ellipse cx="55" cy="204" rx="6" ry="1.5" fill="url(#ch9_puddle)" opacity="0.3" />
      </g>

      {/* === TRAMPLED FLAG in the mud === */}
      <line x1="340" y1="242" x2="342" y2="225" stroke="#222220" strokeWidth="1.2" opacity="0.4" />
      <path d="M342 225 Q348 222 354 225 Q348 228 342 230" fill="#1e2028" opacity="0.3" />
      {/* Mud on the flag */}
      <ellipse cx="348" cy="226" rx="3" ry="1.5" fill="#25201a" opacity="0.2" />

      {/* === TATTERED REGIMENTAL COLORS — shredded flag trailing in the mud === */}
      {/* Flagpole — broken, tilting at angle, driven into mud */}
      <line x1="415" y1="230" x2="418" y2="198" stroke="#1e1a14" strokeWidth="1.5" opacity="0.5" />
      {/* Pole finial — eagle or ball, bent and damaged */}
      <circle cx="418" cy="197" r="2" fill="#2a2a2e" opacity="0.3" />
      {/* Main flag — shredded, hanging limp and trailing down into mud */}
      <path d="M418 200 Q425 198 432 202 Q436 206 434 210 Q430 214 424 212 Q420 210 418 208 Z"
        fill="url(#ch9_tatteredFlag)" opacity="0.3" />
      {/* Shredded strips dangling — torn fabric */}
      <path d="M432 205 Q436 208 438 212 Q436 216 434 214"
        fill="none" stroke="#1e1a20" strokeWidth="0.6" opacity="0.2">
        <animate attributeName="d" values="M432 205 Q436 208 438 212 Q436 216 434 214;M432 205 Q437 209 439 213 Q435 216 433 214;M432 205 Q436 208 438 212 Q436 216 434 214" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M426 212 Q428 218 426 224 Q424 228 422 226"
        fill="none" stroke="#201c1a" strokeWidth="0.5" opacity="0.18" />
      {/* Flag trailing into the mud — the fabric dragged through the mire */}
      <path d="M418 210 Q416 218 414 226 Q412 232 415 236"
        fill="none" stroke="#1e1a1e" strokeWidth="1" opacity="0.2" />
      {/* Mud stain on the flag fabric */}
      <ellipse cx="422" cy="207" rx="4" ry="2" fill="#25201a" opacity="0.15" />
      {/* Tattered gold fringe remnants */}
      <path d="M424 212 Q425 214 424 216" fill="none" stroke="#2a2418" strokeWidth="0.3" opacity="0.12" />
      <path d="M428 210 Q429 213 428 215" fill="none" stroke="#2a2418" strokeWidth="0.3" opacity="0.1" />

      {/* === BROKEN SIGNPOST — tilted wooden post at a crossroads, direction lost === */}
      <g>
        {/* Main post — leaning heavily to the right, half rotted */}
        <line x1="478" y1="205" x2="482" y2="178" stroke="#1e1a14" strokeWidth="2" opacity="0.5" />
        {/* Upper sign arm — hanging by one nail, pointing left, cracked */}
        <path d="M480 182 Q474 180 466 181 L466 184 Q474 184 480 185 Z"
          fill="#1c1812" opacity="0.4" />
        {/* Crack in upper sign */}
        <line x1="472" y1="181" x2="470" y2="184" stroke="#141210" strokeWidth="0.4" opacity="0.2" />
        {/* Lower sign arm — broken off, dangling vertically by a nail */}
        <path d="M481 188 L482 196 L485 196 L484 188 Z" fill="#1c1812" opacity="0.35">
          <animate attributeName="d" values="M481 188 L482 196 L485 196 L484 188 Z;M481 188 L481.5 196.5 L484.5 196.5 L484 188 Z;M481 188 L482 196 L485 196 L484 188 Z" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Nail at the pivot — small dot */}
        <circle cx="482" cy="188" r="0.6" fill="#2a2a2e" opacity="0.3" />
        {/* Faded text — illegible scratches on upper sign */}
        <line x1="468" y1="182.5" x2="477" y2="182" stroke="#222018" strokeWidth="0.3" opacity="0.15" />
        <line x1="469" y1="183.5" x2="476" y2="183" stroke="#222018" strokeWidth="0.3" opacity="0.12" />
      </g>

      {/* === BROKEN EQUIPMENT scattered in mud === */}
      {/* Overturned cart wheel */}
      <circle cx="380" cy="248" r="12" fill="none" stroke="#221e18" strokeWidth="1.5" opacity="0.45" />
      <line x1="380" y1="236" x2="380" y2="260" stroke="#221e18" strokeWidth="0.8" opacity="0.35" />
      <line x1="368" y1="248" x2="392" y2="248" stroke="#221e18" strokeWidth="0.8" opacity="0.35" />
      <path d="M380 248 L388 241" fill="none" stroke="#221e18" strokeWidth="0.6" opacity="0.25" />
      <path d="M380 248 L372 256" fill="none" stroke="#221e18" strokeWidth="0.6" opacity="0.25" />

      {/* Musket half-buried in mud */}
      <line x1="430" y1="258" x2="462" y2="252" stroke="#22201a" strokeWidth="1.5" opacity="0.4" />
      <line x1="462" y1="252" x2="465" y2="245" stroke="#2a2a28" strokeWidth="1" opacity="0.3" />

      {/* Second musket — broken stock */}
      <line x1="560" y1="275" x2="585" y2="270" stroke="#22201a" strokeWidth="1.3" opacity="0.35" />
      <line x1="555" y1="277" x2="560" y2="275" stroke="#1e1a14" strokeWidth="2" opacity="0.3" />

      {/* Torn pack */}
      <path d="M488 268 Q495 262 502 268 Q505 274 498 278 Q490 274 488 268" fill="#221e18" opacity="0.35" />

      {/* Canteen on its side */}
      <ellipse cx="335" cy="270" rx="5" ry="3.5" fill="none" stroke="#2a2520" strokeWidth="0.8" opacity="0.35" transform="rotate(-15 335 270)" />

      {/* Tattered cloth caught on something */}
      <path d="M580 242 Q585 238 590 243 Q595 238 600 244 Q605 240 608 245"
        fill="none" stroke="#2a2828" strokeWidth="0.8" opacity="0.3">
        <animate attributeName="d" values="M580 242 Q585 238 590 243 Q595 238 600 244 Q605 240 608 245;M580 243 Q585 237 590 242 Q595 237 600 243 Q605 239 608 244;M580 242 Q585 238 590 243 Q595 238 600 244 Q605 240 608 245" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Ammunition box overturned */}
      <rect x="468" y="280" width="14" height="8" rx="1" fill="#1e1a16" opacity="0.35" transform="rotate(12 475 284)" />

      {/* === LEAKING MEDICAL SUPPLIES — crate with bottles and jars spilling out === */}
      <g>
        {/* Medical crate — on its side, lid open */}
        <rect x="230" cy="262" y="258" width="18" height="12" rx="0.5" fill="#1c1812" opacity="0.45" transform="rotate(-8 239 264)" />
        {/* Open lid — fallen to the side */}
        <path d="M230 258 Q228 254 226 252 L242 250 Q244 254 244 256"
          fill="#1a1610" opacity="0.35" />
        {/* Bottle 1 — on its side, spilling dark liquid */}
        <rect x="248" y="264" width="3" height="8" rx="1" fill="url(#ch9_bottleGlass)" opacity="0.4" transform="rotate(75 250 268)" />
        {/* Bottle neck */}
        <rect x="253" y="262" width="1.5" height="3" rx="0.5" fill="url(#ch9_bottleGlass)" opacity="0.35" transform="rotate(75 254 264)" />
        {/* Spilled liquid from bottle — dark stain spreading */}
        <ellipse cx="258" cy="268" rx="8" ry="3" fill="#1a1818" opacity="0.18" />
        {/* Bottle 2 — intact, rolled away */}
        <rect x="222" y="268" width="2.5" height="7" rx="0.8" fill="url(#ch9_bottleGlass)" opacity="0.35" transform="rotate(-20 223 271)" />
        {/* Jar — ceramic, cracked open */}
        <ellipse cx="244" cy="270" rx="3" ry="2.5" fill="#201c18" opacity="0.4" />
        <path d="M242 268 Q244 266 246 268" fill="#1e1a16" opacity="0.3" />
        {/* Jar contents spilling — white paste/ointment smear */}
        <ellipse cx="248" cy="272" rx="4" ry="1.5" fill="#2a2826" opacity="0.15" />
        {/* Bandage roll — unraveled, trailing in the mud */}
        <ellipse cx="236" cy="274" rx="2" ry="2" fill="#2a2826" opacity="0.3" />
        <path d="M238 274 Q242 276 246 274 Q250 278 254 276"
          fill="none" stroke="#2a2826" strokeWidth="0.6" opacity="0.2" />
        {/* Small glass shards — from a broken bottle */}
        <line x1="252" y1="266" x2="254" y2="264" stroke="#2a2a30" strokeWidth="0.4" opacity="0.15" />
        <line x1="256" y1="270" x2="258" y2="268" stroke="#2a2a30" strokeWidth="0.3" opacity="0.12" />
      </g>

      {/* === OVERTURNED SUPPLY WAGON — large, on its side, contents spilled === */}
      <g>
        {/* Wagon body — on its side, rectangular box tilted over */}
        <path d="M280 186 L350 183 L356 198 L286 202 Z" fill="url(#ch9_wagonWood)" opacity="0.5" />
        {/* Wagon side (now facing up) — showing the bottom planks */}
        <path d="M280 186 L286 202 L286 210 L278 195 Z" fill="#1a1610" opacity="0.4" />
        {/* Side rails visible */}
        <line x1="282" y1="188" x2="352" y2="185" stroke="#1e1a12" strokeWidth="0.8" opacity="0.35" />
        <line x1="284" y1="194" x2="354" y2="191" stroke="#1e1a12" strokeWidth="0.8" opacity="0.3" />
        {/* Near wheel — still attached, sticking up in the air */}
        <circle cx="292" cy="182" r="10" fill="none" stroke="#221e18" strokeWidth="1.8" opacity="0.45" />
        <line x1="292" y1="172" x2="292" y2="192" stroke="#221e18" strokeWidth="0.7" opacity="0.3" />
        <line x1="282" y1="182" x2="302" y2="182" stroke="#221e18" strokeWidth="0.7" opacity="0.3" />
        <line x1="285" y1="175" x2="299" y2="189" stroke="#221e18" strokeWidth="0.5" opacity="0.25" />
        <line x1="285" y1="189" x2="299" y2="175" stroke="#221e18" strokeWidth="0.5" opacity="0.25" />
        {/* Far wheel — partially visible behind wagon body */}
        <path d="M345 180 Q340 172 342 165 Q348 160 354 165 Q356 172 352 180"
          fill="none" stroke="#221e18" strokeWidth="1.5" opacity="0.35" />
        {/* Axle sticking up */}
        <line x1="292" y1="182" x2="292" y2="175" stroke="#1e1e22" strokeWidth="1.5" opacity="0.3" />
        {/* Spilled barrel 1 — rolled away from wagon */}
        <ellipse cx="362" cy="200" rx="8" ry="5" fill="#1e1a14" opacity="0.4" transform="rotate(15 362 200)" />
        <ellipse cx="362" cy="200" rx="5" ry="3" fill="#1a1610" opacity="0.3" transform="rotate(15 362 200)" />
        {/* Barrel hoops */}
        <ellipse cx="362" cy="200" rx="8" ry="5" fill="none" stroke="#221e18" strokeWidth="0.5" opacity="0.25" transform="rotate(15 362 200)" />
        {/* Spilled barrel 2 — closer, broken open */}
        <ellipse cx="308" cy="212" rx="7" ry="4.5" fill="#1e1a14" opacity="0.38" transform="rotate(-20 308 212)" />
        {/* Spill from broken barrel — dark liquid (wine or water) */}
        <ellipse cx="318" cy="216" rx="12" ry="3" fill="#1a1818" opacity="0.15" />
        {/* Crate 1 — smashed, contents scattered */}
        <rect x="330" y="204" width="12" height="9" rx="0.5" fill="#1a1610" opacity="0.4" transform="rotate(25 336 208)" />
        {/* Crate boards broken — splayed */}
        <line x1="335" y1="203" x2="340" y2="196" stroke="#1a1610" strokeWidth="0.8" opacity="0.25" />
        <line x1="338" y1="205" x2="345" y2="198" stroke="#1a1610" strokeWidth="0.6" opacity="0.2" />
        {/* Crate 2 — intact but on its side */}
        <rect x="358" y="208" width="10" height="7" rx="0.5" fill="#1c1812" opacity="0.35" transform="rotate(-10 363 211)" />
        {/* Scattered contents — small shapes (biscuits, supplies) */}
        <ellipse cx="322" cy="210" rx="2" ry="1.5" fill="#201c14" opacity="0.2" />
        <ellipse cx="326" cy="208" rx="1.5" ry="1" fill="#201c14" opacity="0.18" />
        <ellipse cx="348" cy="210" rx="2" ry="1" fill="#201c14" opacity="0.15" />
        <ellipse cx="352" cy="214" rx="1.8" ry="1.2" fill="#201c14" opacity="0.16" />
        {/* Canvas cover — torn, draped over wreckage */}
        <path d="M285 200 Q295 196 310 200 Q320 197 330 202 Q322 206 310 204 Q298 206 285 200 Z"
          fill="#201c18" opacity="0.3" />
      </g>

      {/* === SHATTERED DRUM — skin split, scattered on ground === */}
      <ellipse cx="435" cy="332" rx="9" ry="4" fill="#1e1a14" opacity="0.35" transform="rotate(25 435 332)" />
      <ellipse cx="435" cy="332" rx="7" ry="3" fill="none" stroke="#2a2420" strokeWidth="0.6" opacity="0.25" transform="rotate(25 435 332)" />
      {/* Broken drumstick */}
      <line x1="445" y1="328" x2="458" y2="324" stroke="#1e1a14" strokeWidth="0.8" opacity="0.3" />
      <line x1="428" y1="338" x2="420" y2="342" stroke="#1e1a14" strokeWidth="0.7" opacity="0.25" />
      {/* Torn drum skin flap */}
      <path d="M438 330 Q442 326 445 330" fill="#1e1a14" opacity="0.2" />

      {/* === TORN CARTRIDGE BOX — spilled ammunition === */}
      <rect x="505" y="298" width="10" height="7" rx="0.5" fill="#1a1816" opacity="0.35" transform="rotate(-18 510 301)" />
      {/* Scattered cartridges — small cylinders */}
      <ellipse cx="518" cy="300" rx="1.5" ry="0.8" fill="#1a1816" opacity="0.25" transform="rotate(30 518 300)" />
      <ellipse cx="522" cy="303" rx="1.5" ry="0.8" fill="#1a1816" opacity="0.22" transform="rotate(-10 522 303)" />
      <ellipse cx="515" cy="305" rx="1.5" ry="0.8" fill="#1a1816" opacity="0.2" transform="rotate(45 515 305)" />
      <ellipse cx="525" cy="298" rx="1.5" ry="0.8" fill="#1a1816" opacity="0.18" transform="rotate(60 525 298)" />
      <ellipse cx="512" cy="308" rx="1.5" ry="0.8" fill="#1a1816" opacity="0.15" />

      {/* === BROKEN BAYONETS — snapped, scattered === */}
      <line x1="475" y1="315" x2="485" y2="308" stroke="#2a2a2e" strokeWidth="0.8" opacity="0.3" />
      <line x1="485" y1="308" x2="488" y2="310" stroke="#2a2a2e" strokeWidth="0.5" opacity="0.2" />
      <line x1="540" y1="322" x2="550" y2="318" stroke="#2a2a2e" strokeWidth="0.7" opacity="0.25" />
      {/* Additional broken blade — half buried */}
      <line x1="610" y1="345" x2="622" y2="340" stroke="#2a2a2e" strokeWidth="0.6" opacity="0.22" />

      {/* === BROKEN MUSKET PARTS — shattered stocks, barrels === */}
      {/* Musket stock — wooden, split lengthwise */}
      <path d="M640 315 Q655 312 665 315" fill="none" stroke="#1e1a14" strokeWidth="2" opacity="0.28" />
      <path d="M648 314 Q652 316 656 314" fill="none" stroke="#181410" strokeWidth="0.5" opacity="0.15" />
      {/* Musket barrel — metal, separated, rusted */}
      <line x1="420" y1="360" x2="445" y2="356" stroke="url(#ch9_rust)" strokeWidth="1.2" opacity="0.25" />
      {/* Trigger guard — small bent metal piece */}
      <path d="M432 358 Q433 360 435 358" fill="none" stroke="#1a1a1e" strokeWidth="0.5" opacity="0.2" />

      {/* === ABANDONED CANTEEN — metal, dented, empty === */}
      <ellipse cx="380" cy="350" rx="4.5" ry="3.5" fill="url(#ch9_rust)" opacity="0.3" transform="rotate(35 380 350)" />
      <circle cx="380" cy="350" r="1" fill="#0e0e10" opacity="0.4" />
      {/* Strap — leather, dark, trailing */}
      <path d="M383 348 Q388 345 392 348" fill="none" stroke="#1a1816" strokeWidth="0.6" opacity="0.25" />

      {/* === BROKEN BELT BUCKLE — brass, tarnished === */}
      <rect x="565" y="332" width="3" height="2" rx="0.3" fill="#1a1814" opacity="0.2" transform="rotate(-25 566 333)" />
      <circle cx="566" cy="333" r="0.8" fill="#0e0e10" opacity="0.15" />

      {/* === ABANDONED KNAPSACK — torn, contents spilled === */}
      <path d="M710 340 Q718 336 725 340 Q722 346 715 344 Z" fill="#1c1814" opacity="0.3" transform="rotate(15 717 340)" />
      {/* Strap torn */}
      <path d="M710 340 Q708 335 706 332" fill="none" stroke="#1a1816" strokeWidth="0.6" opacity="0.2" />
      {/* Contents — small items */}
      <ellipse cx="728" cy="343" rx="1.5" ry="1" fill="#201c14" opacity="0.18" />
      <ellipse cx="732" cy="345" rx="1.2" ry="0.8" fill="#201c14" opacity="0.15" />

      {/* === TORN LETTER — small paper shape caught in the mud === */}
      <g>
        {/* Paper — crumpled, partially submerged, rain-soaked */}
        <path d="M528 330 Q530 327 534 328 Q536 330 535 333 Q532 335 529 334 Q527 332 528 330 Z"
          fill="#2a2824" opacity="0.35" />
        {/* Torn edge — ragged, not clean */}
        <path d="M534 328 Q536 326 537 328" fill="none" stroke="#2a2824" strokeWidth="0.3" opacity="0.2" />
        {/* Ink stains — blurred, unreadable writing */}
        <line x1="529" y1="330" x2="533" y2="329.5" stroke="#1a1816" strokeWidth="0.3" opacity="0.15" />
        <line x1="529.5" y1="331.5" x2="534" y2="331" stroke="#1a1816" strokeWidth="0.3" opacity="0.12" />
        <line x1="530" y1="333" x2="533" y2="332.5" stroke="#1a1816" strokeWidth="0.3" opacity="0.1" />
        {/* Second torn piece — separated, nearby */}
        <path d="M538 332 Q540 330 541 332 Q540 334 538 333 Z"
          fill="#2a2824" opacity="0.25" />
      </g>

      {/* === MAKESHIFT GRAVE MARKERS — crude wooden crosses stuck in the mud === */}
      {/* Cross 1 — nearest, slightly tilted, crudely lashed */}
      <line x1="466" y1="242" x2="468" y2="222" stroke="#1e1a14" strokeWidth="1.5" opacity="0.5" />
      <line x1="460" y1="230" x2="476" y2="228" stroke="#1e1a14" strokeWidth="1.2" opacity="0.45" />
      {/* Lashing at center — rough twine */}
      <path d="M465 229 Q467 228 469 229 Q467 230 465 229" fill="#1a1814" opacity="0.2" />
      {/* Soldier's shako hung on cross */}
      <path d="M468 222 Q472 218 476 222 Q474 224 470 224 Z" fill="#131312" opacity="0.3" />

      {/* Cross 2 — further back, smaller, leaning to the right */}
      <line x1="484" y1="238" x2="487" y2="220" stroke="#1e1a14" strokeWidth="1.2" opacity="0.4" />
      <line x1="480" y1="227" x2="492" y2="225" stroke="#1e1a14" strokeWidth="1" opacity="0.35" />

      {/* Cross 3 — furthest, barely visible, crooked */}
      <line x1="498" y1="236" x2="500" y2="222" stroke="#1e1a14" strokeWidth="1" opacity="0.3" />
      <line x1="495" y1="227" x2="504" y2="225" stroke="#1e1a14" strokeWidth="0.8" opacity="0.25" />
      {/* Mound of freshly turned earth at base of crosses */}
      <ellipse cx="482" cy="240" rx="25" ry="4" fill="#201c16" opacity="0.2" />
      <ellipse cx="482" cy="242" rx="20" ry="3" fill="#1e1a14" opacity="0.15" />

      {/* === ADDITIONAL GRAVE CROSSES — epidemic scale, more scattered in the mid-ground === */}
      {/* Cross 4 — left of main group, leaning badly */}
      <line x1="445" y1="246" x2="448" y2="228" stroke="#1e1a14" strokeWidth="1.2" opacity="0.35" />
      <line x1="441" y1="235" x2="453" y2="233" stroke="#1e1a14" strokeWidth="0.9" opacity="0.3" />
      {/* Cross 5 — far right, near signpost area */}
      <line x1="510" y1="240" x2="512" y2="226" stroke="#1e1a14" strokeWidth="1" opacity="0.3" />
      <line x1="507" y1="231" x2="516" y2="229" stroke="#1e1a14" strokeWidth="0.8" opacity="0.25" />
      {/* Cross 6 — half fallen over, arm broken off */}
      <line x1="525" y1="244" x2="527" y2="232" stroke="#1e1a14" strokeWidth="0.9" opacity="0.25" />
      <line x1="526" y1="236" x2="532" y2="235" stroke="#1e1a14" strokeWidth="0.6" opacity="0.2" />
      {/* Broken arm on the ground */}
      <line x1="522" y1="238" x2="518" y2="240" stroke="#1e1a14" strokeWidth="0.5" opacity="0.15" />
      {/* Earth mounds for additional graves */}
      <ellipse cx="448" cy="248" rx="10" ry="3" fill="#201c16" opacity="0.15" />
      <ellipse cx="515" cy="242" rx="12" ry="3" fill="#201c16" opacity="0.12" />
      <ellipse cx="528" cy="246" rx="8" ry="2.5" fill="#201c16" opacity="0.1" />

      {/* === ABANDONED STRETCHER — two poles + canvas, body on it === */}
      {/* Poles */}
      <line x1="340" y1="360" x2="400" y2="358" stroke="#1e1a14" strokeWidth="1.5" opacity="0.45" />
      <line x1="340" y1="372" x2="400" y2="370" stroke="#1e1a14" strokeWidth="1.5" opacity="0.45" />
      {/* Canvas between poles */}
      <path d="M345 360 L395 358 L395 370 L345 372 Z" fill="url(#ch9_canvas)" opacity="0.35" />
      {/* Body on stretcher — just a dark shape, covered in cloth */}
      <path d="M352 358 Q365 352 380 354 Q390 356 392 360 Q388 362 375 363 Q358 362 352 358 Z"
        fill="#131312" opacity="0.45" />
      {/* Head shape */}
      <circle cx="393" cy="360" r="3.5" fill="#131312" opacity="0.4" />
      {/* Arm dangling off stretcher */}
      <path d="M365 370 Q363 376 360 380" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.3" />
      {/* Blood stain seeping through canvas */}
      <ellipse cx="370" cy="366" rx="8" ry="2" fill="#201818" opacity="0.2" />

      {/* === SURGEON WORKING — kneeling figure over wounded man, lantern holder === */}
      <g>
        {/* Wounded man — lying on the ground, partly on a blanket */}
        <path d="M670 345 Q685 340 705 342 Q715 346 708 350 Q690 354 672 352 Q666 349 670 345 Z"
          fill="#131312" opacity="0.5" />
        {/* Blanket underneath */}
        <path d="M668 348 Q680 344 710 346 Q718 350 710 354 Q685 358 668 354 Z"
          fill="#201c18" opacity="0.25" />

        {/* Surgeon — kneeling, bent over the body, working */}
        <path d="M695 336 Q693 328 695 322 Q697 318 699 322 L700 336 Z" fill="#131312" opacity="0.7" />
        <circle cx="697" cy="318" r="3.5" fill="#131312" opacity="0.7" />
        {/* Arms reaching down to patient */}
        <path d="M693 328 Q688 334 686 340" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.45" />
        <path d="M701 328 Q704 334 706 340" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.45" />
        {/* Kneeling legs */}
        <path d="M694 336 Q690 342 688 346" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
        <path d="M700 336 Q704 342 706 346" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
        {/* Rolled-up sleeves visible (slightly lighter) */}
        <path d="M688 334 Q686 336 684 338" fill="none" stroke="#1a1a18" strokeWidth="0.8" opacity="0.2" />

        {/* Lantern holder — standing, holding lantern out over the surgeon's work */}
        <path d="M720 322 Q718 310 720 302 Q722 297 724 302 L726 322 Q725 332 724 340 L720 340 Z"
          fill="#131312" opacity="0.65" />
        <circle cx="722" cy="297" r="3.5" fill="#131312" opacity="0.65" />
        {/* Arm holding lantern out — extended toward surgeon */}
        <path d="M718 308 Q712 312 708 315" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.45" />
        {/* The lantern itself — small box shape */}
        <rect x="704" y="312" width="5" height="6" rx="0.5" fill="#2a2418" opacity="0.45" />
        {/* Lantern glass — faint warm glow */}
        <rect x="705" y="313" width="3" height="4" rx="0.3" fill="#3a3020" opacity="0.3" />
        {/* Lantern glow on ground — feeble warm circle */}
        <ellipse cx="700" cy="345" rx="18" ry="5" fill="url(#ch9_lanternGlow)" />
        {/* Glow on surgeon's figure — subtle warm highlight */}
        <ellipse cx="695" cy="330" rx="10" ry="8" fill="url(#ch9_lanternGlow)" />
        {/* Other arm at side */}
        <path d="M726 310 Q730 316 728 320" fill="none" stroke="#131312" strokeWidth="1" opacity="0.3" />
        {/* Legs of lantern holder */}
        <path d="M719 340 Q716 348 712 354" fill="none" stroke="#131312" strokeWidth="1.3" opacity="0.4" />
        <path d="M725 340 Q728 348 732 354" fill="none" stroke="#131312" strokeWidth="1.3" opacity="0.4" />

        {/* Medical supplies on ground — a small bundle */}
        <ellipse cx="712" cy="348" rx="4" ry="2" fill="#201c18" opacity="0.25" />
        {/* Bloodied cloth on ground */}
        <path d="M682 350 Q686 348 690 350 Q688 353 684 352 Z" fill="#201818" opacity="0.2" />
      </g>

      {/* === DEAD CROW — even the scavengers die here === */}
      <g>
        {/* Body — small dark shape on the ground */}
        <ellipse cx="328" cy="302" rx="3" ry="1.8" fill="#0e0e0e" opacity="0.5" />
        {/* Head */}
        <circle cx="325" cy="301" r="1.2" fill="#0e0e0e" opacity="0.45" />
        {/* Beak — tiny, pointing forward */}
        <line x1="323" y1="301" x2="321" y2="300.5" stroke="#0e0e0e" strokeWidth="0.5" opacity="0.35" />
        {/* Wing 1 — splayed out, crumpled */}
        <path d="M329 300 Q334 296 338 298 Q336 300 332 301" fill="#0e0e0e" opacity="0.35" />
        {/* Wing 2 — folded under */}
        <path d="M327 303 Q330 306 334 305 Q332 303 328 303" fill="#0e0e0e" opacity="0.3" />
        {/* Tail feathers — splayed */}
        <path d="M331 302 Q334 301 336 303" fill="none" stroke="#0e0e0e" strokeWidth="0.4" opacity="0.25" />
        {/* Leg — tiny, stiff, pointing up */}
        <line x1="329" y1="303" x2="330" y2="305" stroke="#0e0e0e" strokeWidth="0.3" opacity="0.2" />
      </g>

      {/* === ADDITIONAL CROWS/RAVENS — battlefield scavengers === */}
      {/* Crow perched on dead horse — living, hunched */}
      <g opacity="0.55">
        <ellipse cx="138" cy="220" rx="2.5" ry="1.8" fill="#0e0e0e" />
        <circle cx="136" cy="219" r="1.5" fill="#0e0e0e" />
        <line x1="134" y1="219" x2="132" y2="218.5" stroke="#0e0e0e" strokeWidth="0.4" />
        {/* Wings folded */}
        <path d="M138 218 Q141 217 142 219" fill="none" stroke="#0e0e0e" strokeWidth="0.5" />
      </g>
      {/* Crow on wagon wreckage — pecking at something */}
      <g opacity="0.5">
        <ellipse cx="340" cy="205" rx="2.2" ry="1.5" fill="#0e0e0e" />
        <circle cx="338" cy="204" r="1.2" fill="#0e0e0e" />
        {/* Head lowered — pecking posture */}
        <line x1="337" y1="203" x2="335" y2="206" stroke="#0e0e0e" strokeWidth="0.4" />
      </g>
      {/* Crow in flight — distant, silhouetted against sky */}
      <g opacity="0.3">
        <path d="M500 118 Q502 116 504 118" fill="none" stroke="#1a1a1e" strokeWidth="0.8" />
        <path d="M502 117 Q502 115 502 117" fill="none" stroke="#1a1a1e" strokeWidth="0.5" />
        <animate attributeName="transform" values="translate(0,0);translate(60,-8);translate(120,-15)" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.18;0.08;0" dur="12s" repeatCount="indefinite" />
      </g>
      {/* Another crow — hopping on ground near stretcher */}
      <g opacity="0.45">
        <ellipse cx="415" cy="375" rx="2" ry="1.5" fill="#0e0e0e" />
        <circle cx="413" cy="374" r="1" fill="#0e0e0e" />
        <line x1="415" y1="376" x2="415.5" y2="378" stroke="#0e0e0e" strokeWidth="0.3" />
        <line x1="417" y1="376" x2="417.5" y2="378" stroke="#0e0e0e" strokeWidth="0.3" />
      </g>

      {/* === ABANDONED FIRE PIT — cold, dead, too wet to burn === */}
      {/* Charred log circle */}
      <ellipse cx="260" cy="330" rx="16" ry="5" fill="#141210" opacity="0.3" />
      {/* Charred logs — crossed, blackened */}
      <line x1="250" y1="328" x2="272" y2="332" stroke="#101010" strokeWidth="2.5" opacity="0.35" />
      <line x1="255" y1="334" x2="268" y2="326" stroke="#101010" strokeWidth="2" opacity="0.3" />
      <line x1="248" y1="330" x2="258" y2="332" stroke="#0e0e0e" strokeWidth="1.8" opacity="0.25" />
      {/* Ash ring around pit */}
      <ellipse cx="260" cy="330" rx="20" ry="6.5" fill="none" stroke="#1a1816" strokeWidth="0.6" opacity="0.2" />
      {/* Scattered wet ash — darker smears */}
      <ellipse cx="256" cy="336" rx="4" ry="1.5" fill="#141210" opacity="0.15" />
      <ellipse cx="268" cy="324" rx="3" ry="1" fill="#141210" opacity="0.12" />

      {/* === ABANDONED CAMPFIRE ATTEMPT — wet wood, too wet to burn, rain hissing === */}
      <g>
        {/* Pile of wet wood — stacked haphazardly, then abandoned */}
        <line x1="175" y1="298" x2="195" y2="296" stroke="#1a1610" strokeWidth="2.5" opacity="0.4" />
        <line x1="178" y1="302" x2="198" y2="300" stroke="#1a1610" strokeWidth="2.2" opacity="0.38" />
        <line x1="172" y1="296" x2="190" y2="300" stroke="#1a1610" strokeWidth="2" opacity="0.35" />
        {/* Kindling — small sticks scattered around */}
        <line x1="168" y1="300" x2="174" y2="298" stroke="#181410" strokeWidth="0.8" opacity="0.25" />
        <line x1="196" y1="302" x2="204" y2="300" stroke="#181410" strokeWidth="0.7" opacity="0.22" />
        <line x1="180" y1="304" x2="186" y2="306" stroke="#181410" strokeWidth="0.6" opacity="0.2" />
        {/* Wet sheen on wood — slight reflection */}
        <line x1="178" y1="297" x2="192" y2="295.5" stroke="#303035" strokeWidth="0.4" opacity="0.1" />
        <line x1="180" y1="301" x2="196" y2="299.5" stroke="#303035" strokeWidth="0.3" opacity="0.08" />
        {/* Wisp of smoke/steam — the rain killed the fire before it started */}
        <path d="M186 294 Q188 288 186 282 Q184 276 186 270" fill="none" stroke="#30303a" strokeWidth="0.6" opacity="0.08">
          <animate attributeName="d" values="M186 294 Q188 288 186 282 Q184 276 186 270;M186 294 Q189 287 187 280 Q185 274 187 268;M186 294 Q188 288 186 282 Q184 276 186 270" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.04;0.08" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Tinder bundle — soaked, useless, dark from water */}
        <ellipse cx="185" cy="300" rx="5" ry="2.5" fill="#141210" opacity="0.2" />
        {/* Rain hiss — animated micro-splashes on the wood */}
        <circle cx="184" cy="297" r="0.5" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0">
          <animate attributeName="r" values="0;2;0" dur="0.6s" begin="0.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.12;0" dur="0.6s" begin="0.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="192" cy="299" r="0.5" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0">
          <animate attributeName="r" values="0;1.5;0" dur="0.5s" begin="0.35s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.1;0" dur="0.5s" begin="0.35s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === DEAD VEGETATION — thistles, dead brush, reeds near water === */}
      {/* Dead brush clump 1 — near tree 1, brittle and skeletal */}
      <g opacity="0.25">
        <path d="M195 180 Q196 174 198 168" fill="none" stroke="#1e1a14" strokeWidth="0.7" />
        <path d="M198 168 Q200 164 203 166" fill="none" stroke="#1e1a14" strokeWidth="0.4" />
        <path d="M198 168 Q196 162 194 165" fill="none" stroke="#1e1a14" strokeWidth="0.4" />
        <path d="M193 180 Q192 172 194 166" fill="none" stroke="#1e1a14" strokeWidth="0.5" />
        <path d="M197 180 Q199 175 201 170" fill="none" stroke="#1e1a14" strokeWidth="0.4" />
      </g>
      {/* Dead brush clump 2 — far right, near broken tree */}
      <g opacity="0.2">
        <path d="M705 172 Q706 166 708 160" fill="none" stroke="#1e1a14" strokeWidth="0.6" />
        <path d="M708 160 Q710 156 712 158" fill="none" stroke="#1e1a14" strokeWidth="0.3" />
        <path d="M703 174 Q702 168 704 162" fill="none" stroke="#1e1a14" strokeWidth="0.4" />
        <path d="M708 172 Q710 166 711 162" fill="none" stroke="#1e1a14" strokeWidth="0.4" />
      </g>
      {/* Dead thistles — thorny, stiff stalks poking from mud */}
      <g opacity="0.2">
        <line x1="470" y1="260" x2="472" y2="248" stroke="#1c1814" strokeWidth="0.6" />
        <path d="M472 248 Q474 246 476 248 Q474 250 472 248 Z" fill="#1c1814" opacity="0.8" />
        <line x1="471" y1="254" x2="468" y2="252" stroke="#1c1814" strokeWidth="0.3" />
        <line x1="471" y1="256" x2="475" y2="254" stroke="#1c1814" strokeWidth="0.3" />
      </g>
      <g opacity="0.18">
        <line x1="345" y1="318" x2="347" y2="306" stroke="#1c1814" strokeWidth="0.5" />
        <path d="M347 306 Q349 304 351 306 Q349 308 347 306 Z" fill="#1c1814" opacity="0.7" />
        <line x1="346" y1="312" x2="343" y2="310" stroke="#1c1814" strokeWidth="0.3" />
      </g>
      {/* Additional thistles — more scattered dead plants */}
      <g opacity="0.15">
        <line x1="580" y1="295" x2="582" y2="285" stroke="#1c1814" strokeWidth="0.5" />
        <path d="M582 285 Q583 283 585 285" fill="none" stroke="#1c1814" strokeWidth="0.3" />
        <line x1="581" y1="290" x2="577" y2="288" stroke="#1c1814" strokeWidth="0.25" />
      </g>
      <g opacity="0.16">
        <line x1="220" y1="340" x2="222" y2="330" stroke="#1c1814" strokeWidth="0.55" />
        <line x1="221" y1="335" x2="218" y2="334" stroke="#1c1814" strokeWidth="0.25" />
        <line x1="221" y1="337" x2="225" y2="335" stroke="#1c1814" strokeWidth="0.25" />
      </g>

      {/* === DEAD GRASS CLUMPS — poking through mud === */}
      {/* Clump 1 — near puddle */}
      <g opacity="0.18">
        <line x1="295" y1="230" x2="296" y2="222" stroke="#1c1814" strokeWidth="0.4" />
        <line x1="297" y1="231" x2="298" y2="224" stroke="#1c1814" strokeWidth="0.35" />
        <line x1="293" y1="229" x2="294" y2="223" stroke="#1c1814" strokeWidth="0.4" />
        <line x1="299" y1="230" x2="300" y2="225" stroke="#1c1814" strokeWidth="0.3" />
      </g>
      {/* Clump 2 — near wheel rut */}
      <g opacity="0.16">
        <line x1="385" y1="292" x2="386" y2="285" stroke="#1c1814" strokeWidth="0.4" />
        <line x1="387" y1="293" x2="388" y2="287" stroke="#1c1814" strokeWidth="0.35" />
        <line x1="383" y1="291" x2="384" y2="286" stroke="#1c1814" strokeWidth="0.35" />
      </g>
      {/* Clump 3 — foreground */}
      <g opacity="0.2">
        <line x1="155" y1="365" x2="156" y2="355" stroke="#1c1814" strokeWidth="0.5" />
        <line x1="157" y1="366" x2="158" y2="357" stroke="#1c1814" strokeWidth="0.45" />
        <line x1="153" y1="364" x2="154" y2="356" stroke="#1c1814" strokeWidth="0.45" />
        <line x1="159" y1="365" x2="160" y2="358" stroke="#1c1814" strokeWidth="0.4" />
        <line x1="151" y1="364" x2="152" y2="357" stroke="#1c1814" strokeWidth="0.35" />
      </g>
      {/* Clump 4 — right side */}
      <g opacity="0.15">
        <line x1="635" y1="305" x2="636" y2="298" stroke="#1c1814" strokeWidth="0.4" />
        <line x1="637" y1="306" x2="638" y2="300" stroke="#1c1814" strokeWidth="0.35" />
        <line x1="633" y1="304" x2="634" y2="299" stroke="#1c1814" strokeWidth="0.35" />
      </g>
      {/* Clump 5 — near soldier */}
      <g opacity="0.17">
        <line x1="465" y1="298" x2="466" y2="290" stroke="#1c1814" strokeWidth="0.4" />
        <line x1="467" y1="299" x2="468" y2="292" stroke="#1c1814" strokeWidth="0.35" />
        <line x1="463" y1="297" x2="464" y2="291" stroke="#1c1814" strokeWidth="0.35" />
      </g>
      {/* Reeds in flood water — sparse, bent by wind */}
      <g opacity="0.22">
        <path d="M295 335 Q296 328 294 320" fill="none" stroke="#1c1a14" strokeWidth="0.6" />
        <path d="M298 336 Q300 330 298 322" fill="none" stroke="#1c1a14" strokeWidth="0.5" />
        <path d="M302 337 Q304 332 303 326" fill="none" stroke="#1c1a14" strokeWidth="0.4" />
        {/* Reed heads — bent seedheads */}
        <path d="M294 320 Q292 318 290 320" fill="none" stroke="#1c1a14" strokeWidth="0.4" />
        <path d="M298 322 Q296 320 294 322" fill="none" stroke="#1c1a14" strokeWidth="0.3" />
      </g>
      {/* Reeds at right flood edge */}
      <g opacity="0.18">
        <path d="M660 356 Q662 350 660 342" fill="none" stroke="#1c1a14" strokeWidth="0.5" />
        <path d="M663 357 Q665 352 664 346" fill="none" stroke="#1c1a14" strokeWidth="0.4" />
        <path d="M657 358 Q658 353 656 347" fill="none" stroke="#1c1a14" strokeWidth="0.4" />
        <path d="M660 342 Q658 340 656 342" fill="none" stroke="#1c1a14" strokeWidth="0.3" />
      </g>
      {/* Dead grass patches — flattened by rain and boots, yellow-brown wisps */}
      <g opacity="0.12">
        <path d="M120 245 Q122 240 121 236" fill="none" stroke="#22201a" strokeWidth="0.4" />
        <path d="M123 246 Q125 242 124 238" fill="none" stroke="#22201a" strokeWidth="0.3" />
        <path d="M118 244 Q117 240 119 237" fill="none" stroke="#22201a" strokeWidth="0.3" />
      </g>
      <g opacity="0.1">
        <path d="M550 262 Q552 258 551 254" fill="none" stroke="#22201a" strokeWidth="0.3" />
        <path d="M553 263 Q555 260 554 256" fill="none" stroke="#22201a" strokeWidth="0.3" />
        <path d="M548 261 Q547 258 549 255" fill="none" stroke="#22201a" strokeWidth="0.3" />
      </g>
      <g opacity="0.1">
        <path d="M740 298 Q742 294 741 290" fill="none" stroke="#22201a" strokeWidth="0.3" />
        <path d="M743 299 Q745 296 744 292" fill="none" stroke="#22201a" strokeWidth="0.3" />
        <path d="M738 297 Q737 294 739 291" fill="none" stroke="#22201a" strokeWidth="0.3" />
      </g>

      {/* === SCATTERED STRAW/HAY — spilled from wagon, sodden and trampled === */}
      <g opacity="0.15">
        <line x1="320" y1="220" x2="328" y2="218" stroke="#22201a" strokeWidth="0.4" />
        <line x1="322" y1="222" x2="330" y2="219" stroke="#1e1c16" strokeWidth="0.3" />
        <line x1="318" y1="224" x2="326" y2="222" stroke="#22201a" strokeWidth="0.3" />
        <line x1="325" y1="218" x2="332" y2="216" stroke="#201e18" strokeWidth="0.3" />
        <line x1="316" y1="220" x2="324" y2="218" stroke="#1e1c16" strokeWidth="0.35" />
      </g>
      {/* Straw clump further from wagon */}
      <g opacity="0.1">
        <line x1="370" y1="232" x2="378" y2="230" stroke="#22201a" strokeWidth="0.3" />
        <line x1="372" y1="234" x2="380" y2="232" stroke="#1e1c16" strokeWidth="0.25" />
        <line x1="374" y1="230" x2="382" y2="228" stroke="#201e18" strokeWidth="0.3" />
      </g>

      {/* === BROKEN WHEEL PARTS — wagon wheel fragments === */}
      {/* Broken spoke — wooden, snapped */}
      <line x1="270" y1="340" x2="285" y2="335" stroke="#1e1a14" strokeWidth="1.2" opacity="0.3" />
      {/* Wheel rim section — iron, curved */}
      <path d="M620 355 Q630 352 638 355" fill="none" stroke="url(#ch9_rust)" strokeWidth="1" opacity="0.25" />
      {/* Hub piece — center of wheel, cracked */}
      <ellipse cx="565" cy="362" rx="4" ry="3" fill="#1a1610" opacity="0.28" transform="rotate(25 565 362)" />
      <path d="M563 361 Q565 363 567 361" fill="none" stroke="#0e0e0e" strokeWidth="0.4" opacity="0.15" />

      {/* === TENT PEGS AND STAKES — scattered, pulled from ground === */}
      {/* Peg 1 — wooden, pointed */}
      <line x1="195" y1="285" x2="202" y2="280" stroke="#1e1a14" strokeWidth="0.8" opacity="0.25" transform="rotate(35 198 282)" />
      {/* Peg 2 */}
      <line x1="450" y1="320" x2="456" y2="316" stroke="#1e1a14" strokeWidth="0.7" opacity="0.22" transform="rotate(-20 453 318)" />
      {/* Peg 3 */}
      <line x1="610" y1="295" x2="616" y2="291" stroke="#1e1a14" strokeWidth="0.75" opacity="0.2" transform="rotate(10 613 293)" />
      {/* Rope attached to peg — frayed, trailing */}
      <path d="M453 318 Q448 322 445 325" fill="none" stroke="#1a1816" strokeWidth="0.5" opacity="0.18" />

      {/* === ADDITIONAL PERIOD DETAILS — small artifacts of the defeated army === */}
      {/* Horseshoe — half buried in mud */}
      <path d="M230 312 Q226 308 228 304 Q232 300 236 304 Q238 308 234 312"
        fill="none" stroke="#2a2a2e" strokeWidth="0.8" opacity="0.2" />
      {/* Nail holes in horseshoe */}
      <circle cx="228" cy="306" r="0.4" fill="#2a2a2e" opacity="0.12" />
      <circle cx="234" cy="306" r="0.4" fill="#2a2a2e" opacity="0.12" />

      {/* Prayer beads / rosary — dropped in the mud, small chain of beads */}
      <g opacity="0.15">
        <circle cx="398" cy="338" r="0.6" fill="#2a2420" />
        <circle cx="400" cy="339" r="0.6" fill="#2a2420" />
        <circle cx="402" cy="340" r="0.6" fill="#2a2420" />
        <circle cx="404" cy="340.5" r="0.6" fill="#2a2420" />
        <circle cx="406" cy="340" r="0.6" fill="#2a2420" />
        <circle cx="408" cy="339" r="0.6" fill="#2a2420" />
        {/* Cross at end */}
        <line x1="396" y1="337" x2="396" y2="333" stroke="#2a2420" strokeWidth="0.5" />
        <line x1="394" y1="335" x2="398" y2="335" stroke="#2a2420" strokeWidth="0.4" />
        {/* Chain connecting to first bead */}
        <path d="M397 337 Q398 338 398 338" fill="none" stroke="#2a2420" strokeWidth="0.2" />
      </g>

      {/* Broken epaulette — officer's shoulder ornament torn off */}
      <ellipse cx="502" cy="342" rx="3" ry="1.5" fill="#1e1a16" opacity="0.2" />
      {/* Shoulder strap remnant */}
      <path d="M499 341 Q502 339 505 341" fill="none" stroke="#2a2418" strokeWidth="0.5" opacity="0.18" />
      {/* Gold fringe remnants */}
      <path d="M500 343 Q500.5 345 501 343.5" fill="none" stroke="#2a2418" strokeWidth="0.3" opacity="0.12" />
      <path d="M502 343.5 Q502.5 345.5 503 344" fill="none" stroke="#2a2418" strokeWidth="0.3" opacity="0.1" />
      <path d="M504 343 Q504.5 345 505 343.5" fill="none" stroke="#2a2418" strokeWidth="0.3" opacity="0.1" />

      {/* Bent bugle — dented, mouthpiece in the mud */}
      <path d="M645 372 Q648 368 652 370 Q658 374 664 372 Q668 370 672 374"
        fill="none" stroke="#2a2a2e" strokeWidth="0.8" opacity="0.18" />
      <ellipse cx="672" cy="374" rx="2.5" ry="2" fill="none" stroke="#2a2a2e" strokeWidth="0.5" opacity="0.15" />
      {/* Mouthpiece */}
      <circle cx="645" cy="372" r="1" fill="#2a2a2e" opacity="0.14" />

      {/* Shell fragments — iron shrapnel scattered near cannon */}
      <path d="M78 340 L80 338 L82 340 L80 342 Z" fill="#2a2a2e" opacity="0.15" />
      <path d="M85 345 L87 343 L88 346 Z" fill="#2a2a2e" opacity="0.12" />
      <path d="M92 338 L93 336 L95 337 L94 340 Z" fill="#2a2a2e" opacity="0.13" />
      <path d="M68 355 L70 352 L72 354 Z" fill="#2a2a2e" opacity="0.1" />
      <path d="M75 360 L77 358 L78 360 L76 362 Z" fill="#2a2a2e" opacity="0.11" />

      {/* Cannonball — partially sunk, near overturned cannon */}
      <circle cx="48" cy="358" r="3.5" fill="#1e1e22" opacity="0.3" />
      <ellipse cx="48" cy="359" rx="3.5" ry="1" fill="#25201a" opacity="0.15" />

      {/* === GROUND LEVEL HAZE — thin mist clinging to the mud surface === */}
      <rect x="0" y="320" width="800" height="40" fill="url(#ch9_groundHaze)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="12s" repeatCount="indefinite" />
      </rect>
      <rect x="0" y="260" width="800" height="30" fill="url(#ch9_groundHaze)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="15s" repeatCount="indefinite" />
      </rect>

      {/* === DEFEATED SOLDIERS — huddled, broken === */}
      {/* Group 1 — huddled together by tree, sharing body heat */}
      <path d="M200 290 Q198 278 200 270 Q202 265 204 270 L206 290 Z" fill="#131312" opacity="0.8" />
      <circle cx="202" cy="265" r="4.5" fill="#131312" opacity="0.8" />
      <path d="M215 292 Q213 280 215 273 Q217 268 219 273 L221 292 Z" fill="#131312" opacity="0.75" />
      <circle cx="217" cy="268" r="4" fill="#131312" opacity="0.75" />
      <path d="M228 295 Q226 283 228 276 Q230 283 232 295 Z" fill="#131312" opacity="0.65" />
      <circle cx="229" cy="273" r="3.5" fill="#131312" opacity="0.65" />
      {/* Fourth soldier in group — collapsed against first */}
      <path d="M190 288 Q188 280 190 276 Q192 280 193 288 Z" fill="#131312" opacity="0.55" />
      <circle cx="191" cy="274" r="3" fill="#131312" opacity="0.55" />

      {/* Soldier on ground — wounded/exhausted, face-down */}
      <path d="M315 300 Q325 296 345 298 Q352 301 345 304 Q325 308 315 305 Q310 302 315 300 Z"
        fill="#131312" opacity="0.55" />
      <circle cx="312" cy="300" r="4" fill="#131312" opacity="0.5" />
      {/* Arm outstretched */}
      <path d="M345 300 Q355 298 362 300" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.35" />

      {/* Seated soldier, head bowed into hands — despair */}
      <path d="M450 290 Q448 280 450 274 Q452 280 454 290 Z" fill="#131312" opacity="0.65" />
      <circle cx="451" cy="271" r="3.5" fill="#131312" opacity="0.65" />
      <path d="M447 282 Q445 278 448 276" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
      <path d="M455 282 Q457 278 454 276" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />

      {/* Standing soldier — barely, leaning hard on musket as crutch */}
      <path d="M600 265 Q598 253 600 245 Q602 240 604 245 L606 265 Q605 275 604 285 L600 285 Z"
        fill="#131312" opacity="0.7" />
      <circle cx="602" cy="240" r="4.5" fill="#131312" opacity="0.7" />
      <line x1="608" y1="238" x2="610" y2="288" stroke="#131312" strokeWidth="1.2" opacity="0.5" />
      {/* Bandaged arm */}
      <path d="M596 255 Q590 260 586 258" fill="none" stroke="#2a2a28" strokeWidth="1" opacity="0.35" />

      {/* Soldier kneeling — praying or giving up */}
      <path d="M500 284 Q498 278 500 274 Q502 270 504 274 L505 284 Z" fill="#131312" opacity="0.6" />
      <circle cx="502" cy="269" r="3.5" fill="#131312" opacity="0.6" />
      <path d="M498 280 Q496 284 494 288 L498 288 Z" fill="#131312" opacity="0.45" />
      <path d="M504 280 Q506 284 508 288 L504 288 Z" fill="#131312" opacity="0.45" />

      {/* === ADDITIONAL SCATTERED SOLDIERS — more defeated figures === */}
      {/* Soldier near wagon — sitting on wreckage, head down */}
      <path d="M360 220 Q358 212 360 208 Q362 212 364 220 Z" fill="#131312" opacity="0.6" />
      <circle cx="361" cy="206" r="3" fill="#131312" opacity="0.6" />
      {/* Arms resting on knees */}
      <path d="M356 215 Q354 212 356 210" fill="none" stroke="#131312" strokeWidth="1" opacity="0.4" />
      <path d="M366 215 Q368 212 366 210" fill="none" stroke="#131312" strokeWidth="1" opacity="0.4" />

      {/* Two soldiers carrying third — wounded man between them */}
      <g opacity="0.5">
        {/* Left carrier */}
        <path d="M520 245 Q518 235 520 230 Q522 235 524 245 Z" fill="#131312" />
        <circle cx="521" cy="228" r="3.5" fill="#131312" />
        <path d="M524 238 Q528 240 532 238" fill="none" stroke="#131312" strokeWidth="1.2" />
        {/* Right carrier */}
        <path d="M548 246 Q546 236 548 231 Q550 236 552 246 Z" fill="#131312" />
        <circle cx="549" cy="229" r="3.5" fill="#131312" />
        <path d="M544 239 Q540 241 536 239" fill="none" stroke="#131312" strokeWidth="1.2" />
        {/* Wounded man — sagging between them */}
        <path d="M532 242 Q534 248 536 242" fill="#131312" opacity="0.8" />
        <circle cx="534" cy="240" r="3" fill="#131312" opacity="0.7" />
        <path d="M534 245 Q534 250 534 252" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* Lone figure kneeling — praying or just broken */}
      <path d="M740 270 Q738 265 740 262 Q742 265 743 270 L742 278 Z" fill="#131312" opacity="0.55" />
      <circle cx="741" cy="260" r="3" fill="#131312" opacity="0.55" />
      {/* Hands clasped or held to face */}
      <path d="M738 268 Q741 265 744 268" fill="none" stroke="#131312" strokeWidth="1" opacity="0.35" />

      {/* Soldier staggering — off-balance, wounded */}
      <path d="M140 265 Q138 255 140 250 Q142 245 144 250 L146 265 Q144 272 142 275 Z"
        fill="#131312" opacity="0.6" transform="rotate(-8 142 262)" />
      <circle cx="142" cy="244" r="3.5" fill="#131312" opacity="0.6" />
      {/* Arm clutching side — wounded */}
      <path d="M136 260 Q133 258 134 256" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.4" />

      {/* === NEW SOLDIERS — despairing poses === */}

      {/* Vomiting/sick soldier — doubled over, hands on knees */}
      <path d="M150 340 Q148 332 150 326 Q152 322 154 326 L155 340 Z" fill="#131312" opacity="0.65" />
      <circle cx="152" cy="322" r="3.5" fill="#131312" opacity="0.65" />
      {/* Bent forward — head down */}
      <path d="M152 322 Q156 320 160 324" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
      {/* Arms bracing on legs */}
      <path d="M148 332 Q144 336 142 340" fill="none" stroke="#131312" strokeWidth="1" opacity="0.35" />
      <path d="M156 332 Q158 336 160 340" fill="none" stroke="#131312" strokeWidth="1" opacity="0.35" />
      {/* Puddle of sick on ground */}
      <ellipse cx="162" cy="328" rx="5" ry="2" fill="#1e1c14" opacity="0.2" />

      {/* Soldier carrying wounded comrade on his back — staggering */}
      <path d="M560 330 Q558 318 560 310 Q562 305 564 310 L566 330 Q565 340 564 348 L560 348 Z"
        fill="#131312" opacity="0.7" />
      <circle cx="562" cy="305" r="4" fill="#131312" opacity="0.7" />
      {/* Legs — wide, staggering stance */}
      <path d="M558 348 Q554 356 550 362" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.45" />
      <path d="M566 348 Q570 356 574 362" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.45" />
      {/* Wounded comrade draped on his back */}
      <path d="M556 310 Q552 306 548 310 Q546 316 550 318 Q554 316 556 310 Z"
        fill="#131312" opacity="0.5" />
      <circle cx="548" cy="306" r="3" fill="#131312" opacity="0.45" />
      {/* Dangling arm of wounded man */}
      <path d="M550 318 Q548 326 546 332" fill="none" stroke="#131312" strokeWidth="1" opacity="0.3" />

      {/* Soldier sitting, staring at nothing — thousand-yard stare */}
      <path d="M110 350 Q108 340 110 334 Q112 330 114 334 L115 350 Z" fill="#131312" opacity="0.6" />
      <circle cx="112" cy="330" r="3.5" fill="#131312" opacity="0.6" />
      {/* Legs stretched out in front */}
      <path d="M108 350 Q104 354 96 356" fill="none" stroke="#131312" strokeWidth="1.8" opacity="0.35" />
      <path d="M116 350 Q120 354 128 356" fill="none" stroke="#131312" strokeWidth="1.8" opacity="0.35" />
      {/* Arms limp at sides */}
      <path d="M106 340 Q102 344 100 348" fill="none" stroke="#131312" strokeWidth="1" opacity="0.3" />
      <path d="M118 340 Q122 344 124 348" fill="none" stroke="#131312" strokeWidth="1" opacity="0.3" />
      {/* Musket fallen beside him */}
      <line x1="130" y1="340" x2="148" y2="354" stroke="#22201a" strokeWidth="1" opacity="0.25" />

      {/* Soldier trudging through mud — dragging footsteps, hunched */}
      <path d="M710 290 Q708 278 710 270 Q712 265 714 270 L716 290 Q715 300 714 310 L710 310 Z"
        fill="#131312" opacity="0.65" />
      <circle cx="712" cy="265" r="4" fill="#131312" opacity="0.65" />
      {/* Hunched shoulders */}
      <path d="M706 275 Q704 280 708 278" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
      <path d="M718 275 Q720 280 716 278" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
      {/* Legs dragging — heavy steps */}
      <path d="M709 310 Q706 316 702 320" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
      <path d="M715 310 Q718 316 722 320" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
      {/* Drag marks behind him in mud */}
      <path d="M722 320 Q730 318 740 320 Q748 318 756 320"
        fill="none" stroke="#1a1610" strokeWidth="1.5" opacity="0.1" />
      <path d="M724 324 Q732 322 742 324 Q750 322 758 324"
        fill="none" stroke="#1a1610" strokeWidth="1.2" opacity="0.08" />

      {/* Distant retreating figures — the army pulling back */}
      <path d="M700 240 Q698 234 700 230 Q702 234 704 240 Z" fill="#1a1a1e" opacity="0.35" />
      <path d="M712 238 Q710 232 712 228 Q714 232 716 238 Z" fill="#1a1a1e" opacity="0.3" />
      <path d="M728 240 Q726 234 728 230 Q730 234 732 240 Z" fill="#1a1a1e" opacity="0.25" />
      <path d="M742 242 Q740 236 742 232 Q744 236 746 242 Z" fill="#1a1a1e" opacity="0.2" />
      <path d="M755 240 Q753 236 755 232 Q757 236 759 240 Z" fill="#1a1a1e" opacity="0.15" />
      {/* More distant figures — straggling line */}
      <path d="M770 238 Q768 234 770 231 Q772 235 774 238 Z" fill="#1a1a1e" opacity="0.1" />
      <path d="M762 244 Q760 240 762 237 Q764 241 766 244 Z" fill="#1a1a1e" opacity="0.12" />
      <path d="M748 236 Q746 232 748 229 Q750 233 752 236 Z" fill="#1a1a1e" opacity="0.13" />

      {/* === DISTANT LIGHTNING FLASH — illuminates the whole sky for an instant === */}
      <rect width="800" height="400" fill="url(#ch9_lightning)" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0.8;0;0.3;0;0;0;0;0;0;0;0;0;0;0;0" dur="12s" repeatCount="indefinite" />
      </rect>
      {/* Lightning bolt — distant, forked, appears with the flash */}
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0.4;0;0.15;0;0;0;0;0;0;0;0;0;0;0;0" dur="12s" repeatCount="indefinite" />
        <path d="M220 10 L215 35 L222 32 L214 60 L220 56 L210 85" fill="none" stroke="#8080a0" strokeWidth="0.8" />
        {/* Branch 1 */}
        <path d="M215 35 L205 50 L200 45" fill="none" stroke="#7070a0" strokeWidth="0.5" />
        {/* Branch 2 */}
        <path d="M214 60 L225 72 L230 68" fill="none" stroke="#7070a0" strokeWidth="0.4" />
      </g>
      {/* Second lightning — different position, different timing */}
      <rect width="800" height="200" fill="url(#ch9_lightning)" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0.6;0;0.2;0;0;0;0;0;0;0;0;0;0" dur="18s" begin="5s" repeatCount="indefinite" />
      </rect>
      <g opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0.35;0;0.12;0;0;0;0;0;0;0;0;0;0" dur="18s" begin="5s" repeatCount="indefinite" />
        <path d="M620 5 L618 28 L624 25 L616 52 L622 48 L614 75" fill="none" stroke="#8080a0" strokeWidth="0.6" />
        <path d="M618 28 L610 42" fill="none" stroke="#7070a0" strokeWidth="0.4" />
      </g>

      {/* === VENETIAN FARMHOUSE RUINS — stone walls crumbling, roof collapsed === */}
      <g>
        {/* Left wall — standing, damaged at top */}
        <rect x="30" y="142" width="38" height="38" fill="url(#ch9_stone)" opacity="0.5" />
        {/* Wall damage — jagged top edge where masonry collapsed */}
        <path d="M30 142 L34 138 L38 142 L42 136 L48 140 L52 134 L58 138 L62 136 L68 142"
          fill="url(#ch9_stone)" opacity="0.5" />
        {/* Right wall — partially collapsed, shorter */}
        <rect x="68" y="152" width="30" height="28" fill="url(#ch9_stone)" opacity="0.45" />
        <path d="M68 152 L72 148 L78 152 L84 146 L90 150 L98 152"
          fill="url(#ch9_stone)" opacity="0.45" />
        {/* Collapsed roof section — tiles fallen inward, some spilling forward */}
        <path d="M28 142 L52 126 L72 142" fill="url(#ch9_roofTile)" opacity="0.35" />
        {/* Fallen roof tiles on ground in front */}
        <rect x="35" y="180" width="5" height="3" rx="0.3" fill="#1a1412" opacity="0.2" transform="rotate(15 37 181)" />
        <rect x="48" y="182" width="4" height="2.5" rx="0.3" fill="#1a1412" opacity="0.18" transform="rotate(-20 50 183)" />
        <rect x="72" y="178" width="5" height="3" rx="0.3" fill="#1a1412" opacity="0.15" transform="rotate(8 74 179)" />
        {/* Window openings — dark voids */}
        <rect x="40" y="150" width="8" height="10" fill="#0e0e10" opacity="0.6" />
        <rect x="56" y="150" width="7" height="10" fill="#0e0e10" opacity="0.55" />
        {/* Window frame remnants */}
        <line x1="44" y1="150" x2="44" y2="160" stroke="#1e1a14" strokeWidth="0.5" opacity="0.3" />
        {/* Door opening — ground floor, dark */}
        <rect x="46" y="162" width="10" height="18" fill="#0a0a0c" opacity="0.6" />
        {/* Door frame — wooden, rotting */}
        <line x1="46" y1="162" x2="46" y2="180" stroke="#1e1a14" strokeWidth="1" opacity="0.3" />
        <line x1="56" y1="162" x2="56" y2="180" stroke="#1e1a14" strokeWidth="1" opacity="0.3" />
        {/* Stone mortar lines — horizontal courses */}
        <line x1="30" y1="150" x2="68" y2="150" stroke="#1a1816" strokeWidth="0.4" opacity="0.2" />
        <line x1="30" y1="158" x2="68" y2="158" stroke="#1a1816" strokeWidth="0.4" opacity="0.18" />
        <line x1="30" y1="166" x2="68" y2="166" stroke="#1a1816" strokeWidth="0.4" opacity="0.15" />
        <line x1="68" y1="160" x2="98" y2="160" stroke="#1a1816" strokeWidth="0.4" opacity="0.15" />
        <line x1="68" y1="168" x2="98" y2="168" stroke="#1a1816" strokeWidth="0.4" opacity="0.12" />
        {/* Rubble pile — stones fallen at base */}
        <ellipse cx="55" cy="182" rx="12" ry="3" fill="#201e1a" opacity="0.3" />
        <ellipse cx="82" cy="180" rx="8" ry="2.5" fill="#201e1a" opacity="0.25" />
        {/* Individual rubble stones */}
        <rect x="60" y="180" width="4" height="3" rx="0.5" fill="#222018" opacity="0.25" transform="rotate(22 62 181)" />
        <rect x="76" y="178" width="3" height="2.5" rx="0.5" fill="#222018" opacity="0.2" transform="rotate(-12 77 179)" />
        <rect x="88" y="176" width="3.5" height="2" rx="0.5" fill="#222018" opacity="0.18" />
        {/* Smoke/soot stains above windows */}
        <path d="M38 148 Q44 144 50 148" fill="#101010" opacity="0.15" />
        <path d="M54 148 Q59 145 64 148" fill="#101010" opacity="0.12" />
        {/* Vine remnant clinging to wall — dead, winter */}
        <path d="M32 170 Q34 162 36 155 Q38 148 40 144" fill="none" stroke="#1a1816" strokeWidth="0.6" opacity="0.2" />
        <path d="M36 158 Q40 156 42 158" fill="none" stroke="#1a1816" strokeWidth="0.4" opacity="0.15" />
        {/* Chimney remnant — crumbled top */}
        <rect x="52" y="134" width="6" height="8" fill="url(#ch9_stone)" opacity="0.45" />
        <path d="M52 134 L54 131 L56 134 L58 132" fill="url(#ch9_stone)" opacity="0.4" />
        {/* Broken shutter — hanging by one hinge */}
        <rect x="37" y="152" width="2" height="8" fill="#1e1a14" opacity="0.25" transform="rotate(-15 38 156)" />
        {/* Gutter/downspout — broken, dangling */}
        <line x1="68" y1="142" x2="68" y2="155" stroke="#181410" strokeWidth="0.5" opacity="0.2" />
        <line x1="68" y1="155" x2="65" y2="160" stroke="#181410" strokeWidth="0.4" opacity="0.15" />
        {/* Weathered wood beam — exposed where roof collapsed */}
        <line x1="45" y1="138" x2="60" y2="134" stroke="#1a1610" strokeWidth="0.8" opacity="0.25" />
        {/* Wall cracks — structural damage */}
        <path d="M35 155 Q38 160 36 165" fill="none" stroke="#0e0e10" strokeWidth="0.3" opacity="0.15" />
        <path d="M72 158 Q74 162 73 166" fill="none" stroke="#0e0e10" strokeWidth="0.3" opacity="0.12" />
        {/* More scattered roof tiles on ground */}
        <rect x="42" y="185" width="3" height="2" rx="0.2" fill="#1a1412" opacity="0.16" transform="rotate(32 43 186)" />
        <rect x="65" y="183" width="4" height="2.5" rx="0.2" fill="#1a1412" opacity="0.14" transform="rotate(-8 67 184)" />
      </g>

      {/* === FLOODED GROUND — large standing water areas, field is swamped === */}
      {/* Major flood area — center-left, road has become a river */}
      <ellipse cx="320" cy="340" rx="80" ry="12" fill="url(#ch9_floodWater)" />
      {/* Flood reflection — sky and dark shapes reflected */}
      <ellipse cx="320" cy="338" rx="40" ry="4" fill="url(#ch9_puddleReflect)" />
      <ellipse cx="350" cy="342" rx="25" ry="3" fill="url(#ch9_puddleReflect)" />
      {/* Flood ripples — wind-driven, larger than puddle ripples */}
      <circle cx="300" cy="338" r="4" fill="none" stroke="#35353a" strokeWidth="0.3" opacity="0.18">
        <animate attributeName="r" values="4;12;4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0;0.18" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="342" r="3" fill="none" stroke="#35353a" strokeWidth="0.25" opacity="0.14">
        <animate attributeName="r" values="3;9;3" dur="2.1s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.14;0;0.14" dur="2.1s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="365" cy="336" r="2.5" fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.12">
        <animate attributeName="r" values="2.5;7;2.5" dur="1.8s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.8s" begin="1.2s" repeatCount="indefinite" />
      </circle>
      {/* Second flood area — right side, lower field */}
      <ellipse cx="620" cy="360" rx="60" ry="10" fill="url(#ch9_floodWater)" />
      <ellipse cx="615" cy="358" rx="22" ry="3" fill="url(#ch9_puddleReflect)" />
      {/* Flood ripples for right area */}
      <circle cx="610" cy="358" r="3" fill="none" stroke="#35353a" strokeWidth="0.25" opacity="0.15">
        <animate attributeName="r" values="3;8;3" dur="2.3s" begin="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0;0.15" dur="2.3s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="640" cy="362" r="2" fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.12">
        <animate attributeName="r" values="2;6;2" dur="1.9s" begin="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.9s" begin="0.9s" repeatCount="indefinite" />
      </circle>
      {/* Debris floating in flood — small sticks, straw */}
      <line x1="295" y1="339" x2="302" y2="338" stroke="#1e1a14" strokeWidth="0.6" opacity="0.15">
        <animate attributeName="x1" values="295;298;295" dur="8s" repeatCount="indefinite" />
        <animate attributeName="x2" values="302;305;302" dur="8s" repeatCount="indefinite" />
      </line>
      <line x1="348" y1="341" x2="353" y2="340" stroke="#1e1a14" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="x1" values="348;351;348" dur="10s" repeatCount="indefinite" />
        <animate attributeName="x2" values="353;356;353" dur="10s" repeatCount="indefinite" />
      </line>

      {/* === MUD-STUCK WAGON — wheels sunk deep, abandoned mid-road === */}
      <g>
        {/* Wagon bed — tilted, one side sinking */}
        <path d="M470 310 L540 306 L545 318 L475 324 Z" fill="url(#ch9_wagonWood)" opacity="0.45" />
        {/* Wagon side boards */}
        <path d="M470 310 L475 324 L475 330 L468 318 Z" fill="#1a1610" opacity="0.35" />
        <line x1="472" y1="312" x2="542" y2="308" stroke="#1e1a12" strokeWidth="0.6" opacity="0.3" />
        <line x1="473" y1="318" x2="543" y2="314" stroke="#1e1a12" strokeWidth="0.6" opacity="0.25" />
        {/* Near wheel — sunk to the hub in mud */}
        <path d="M478 318 Q474 312 476 306 Q480 300 484 306 Q486 312 482 318"
          fill="none" stroke="#221e18" strokeWidth="1.8" opacity="0.4" />
        {/* Mud engulfing the lower half of the wheel */}
        <ellipse cx="480" cy="320" rx="8" ry="3" fill="#25201a" opacity="0.3" />
        {/* Spoke visible above mud */}
        <line x1="478" y1="310" x2="482" y2="306" stroke="#221e18" strokeWidth="0.6" opacity="0.25" />
        {/* Far wheel — completely stuck, barely visible */}
        <path d="M535 314 Q532 308 534 302 Q538 298 540 304 Q542 310 538 314"
          fill="none" stroke="#221e18" strokeWidth="1.5" opacity="0.3" />
        <ellipse cx="536" cy="316" rx="7" ry="2.5" fill="#25201a" opacity="0.25" />
        {/* Mud churned around wheels — attempts to free it */}
        <ellipse cx="480" cy="326" rx="14" ry="3" fill="#1e1a14" opacity="0.15" />
        <ellipse cx="536" cy="322" rx="12" ry="2.5" fill="#1e1a14" opacity="0.12" />
        {/* Yoke and traces — still attached, but no horse */}
        <line x1="545" y1="310" x2="565" y2="306" stroke="#1e1a14" strokeWidth="1.2" opacity="0.3" />
        <line x1="545" y1="316" x2="565" y2="312" stroke="#1e1a14" strokeWidth="1.2" opacity="0.3" />
        <path d="M565 306 Q568 308 565 312" fill="none" stroke="#1e1a14" strokeWidth="1" opacity="0.25" />
        {/* Empty yoke crossbar */}
        <line x1="562" y1="304" x2="568" y2="304" stroke="#1e1a14" strokeWidth="1.5" opacity="0.25" />
        {/* Tarp over cargo — sagging, rain-soaked */}
        <path d="M475 308 Q500 302 520 304 Q535 306 540 310 Q530 308 510 306 Q490 304 475 308 Z"
          fill="#1c1814" opacity="0.3" />
        {/* Water pooling on tarp */}
        <ellipse cx="505" cy="306" rx="10" ry="2" fill="url(#ch9_puddle)" opacity="0.25" />
      </g>

      {/* === SOLDIERS HUDDLED UNDER CLOAKS — trying to stay dry, failing === */}
      {/* Group of three cloaked figures — backs to the wind */}
      <g>
        {/* Figure 1 — large cloak completely covering, hunched mound */}
        <path d="M385 375 Q380 360 382 348 Q386 340 390 342 Q395 348 396 360 Q398 370 395 380 Q390 384 385 375 Z"
          fill="url(#ch9_cloak)" opacity="0.65" />
        {/* Cloak hood — pulled low over face */}
        <path d="M384 348 Q386 340 390 338 Q394 340 395 348 Q390 344 384 348 Z"
          fill="url(#ch9_cloak)" opacity="0.7" />
        {/* Cloak edge flapping in wind */}
        <path d="M396 362 Q400 358 404 362 Q408 358 410 363"
          fill="none" stroke="#121012" strokeWidth="0.8" opacity="0.3">
          <animate attributeName="d" values="M396 362 Q400 358 404 362 Q408 358 410 363;M396 363 Q400 357 404 361 Q408 357 410 362;M396 362 Q400 358 404 362 Q408 358 410 363" dur="3.5s" repeatCount="indefinite" />
        </path>
        {/* Wet sheen on cloak */}
        <path d="M384 355 Q388 350 392 355" fill="none" stroke="#1e1e22" strokeWidth="0.4" opacity="0.12" />

        {/* Figure 2 — pressed close, slightly smaller */}
        <path d="M398 378 Q394 365 396 355 Q399 348 402 352 Q406 358 407 368 Q408 374 405 382 Q402 384 398 378 Z"
          fill="url(#ch9_cloak)" opacity="0.6" />
        <path d="M396 355 Q399 348 402 346 Q405 348 406 355 Q402 351 396 355 Z"
          fill="url(#ch9_cloak)" opacity="0.65" />

        {/* Figure 3 — leaning against figure 1 */}
        <path d="M374 378 Q370 365 372 356 Q375 350 378 353 Q381 358 382 368 Q383 374 380 382 Q377 384 374 378 Z"
          fill="url(#ch9_cloak)" opacity="0.55" />
        <path d="M372 356 Q375 350 378 348 Q380 350 382 356 Q378 352 372 356 Z"
          fill="url(#ch9_cloak)" opacity="0.6" />
        {/* Knees visible beneath cloaks — dark bumps */}
        <ellipse cx="388" cy="378" rx="4" ry="2" fill="#0e0e10" opacity="0.3" />
        <ellipse cx="402" cy="380" rx="3.5" ry="1.8" fill="#0e0e10" opacity="0.25" />
      </g>

      {/* Lone cloaked figure — standing in the rain, staring at the graves */}
      <g>
        <path d="M458 268 Q456 256 458 248 Q460 242 462 245 Q464 250 466 260 Q468 268 466 278 Q463 286 460 282 Q456 276 458 268 Z"
          fill="url(#ch9_cloak)" opacity="0.65" />
        <path d="M456 250 Q460 242 462 240 Q464 242 466 250 Q462 246 456 250 Z"
          fill="url(#ch9_cloak)" opacity="0.7" />
        {/* Cloak dripping — rain running off the edge */}
        <line x1="466" y1="278" x2="467" y2="284" stroke="#35353a" strokeWidth="0.3" opacity="0.1">
          <animate attributeName="y2" values="284;288;284" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.04;0.1" dur="1.2s" repeatCount="indefinite" />
        </line>
        <line x1="456" y1="276" x2="455" y2="282" stroke="#35353a" strokeWidth="0.3" opacity="0.08">
          <animate attributeName="y2" values="282;286;282" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.03;0.08" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
        </line>
      </g>

      {/* === MEDICAL STRETCHER CARRIERS — two soldiers carrying a wounded man through the mud === */}
      <g>
        {/* Front carrier — struggling, bent forward */}
        <path d="M140 372 Q138 360 140 352 Q142 347 144 350 L146 372 Q145 378 144 384 L140 384 Z"
          fill="#131312" opacity="0.7" />
        <circle cx="142" cy="347" r="3.5" fill="#131312" opacity="0.7" />
        {/* Front carrier arms — reaching back to grip stretcher poles */}
        <path d="M138 358 Q134 362 130 364" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.45" />
        <path d="M148 358 Q152 362 156 364" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.45" />
        {/* Front carrier legs — wide stance in mud */}
        <path d="M139 384 Q136 390 132 396" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
        <path d="M145 384 Q148 390 152 396" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />

        {/* Stretcher poles */}
        <line x1="100" y1="365" x2="160" y2="362" stroke="#1e1a14" strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="375" x2="160" y2="372" stroke="#1e1a14" strokeWidth="1.5" opacity="0.5" />
        {/* Stretcher canvas */}
        <path d="M105 365 L155 362 L155 372 L105 375 Z" fill="url(#ch9_canvas)" opacity="0.35" />
        {/* Wounded man on stretcher — covered with cloth, arm dangling */}
        <path d="M110 362 Q125 356 140 358 Q150 360 152 364 Q145 366 130 367 Q115 366 110 362 Z"
          fill="#131312" opacity="0.5" />
        {/* Blanket over body */}
        <path d="M112 364 Q128 360 145 362 Q152 365 148 368 Q132 370 115 368 Z"
          fill="#201c18" opacity="0.25" />
        {/* Wounded man's head */}
        <circle cx="153" cy="364" r="3" fill="#131312" opacity="0.45" />
        {/* Arm hanging over stretcher edge */}
        <path d="M128 375 Q126 380 124 385" fill="none" stroke="#131312" strokeWidth="1" opacity="0.3" />
        {/* Blood dripping from stretcher */}
        <line x1="132" y1="375" x2="132" y2="380" stroke="#201818" strokeWidth="0.5" opacity="0.15">
          <animate attributeName="y2" values="380;384;380" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
        </line>

        {/* Rear carrier — stumbling, nearly falling */}
        <path d="M96 375 Q94 363 96 355 Q98 350 100 353 L102 375 Q101 382 100 388 L96 388 Z"
          fill="#131312" opacity="0.65" />
        <circle cx="98" cy="350" r="3.5" fill="#131312" opacity="0.65" />
        {/* Rear carrier arms — gripping poles */}
        <path d="M94 362 Q90 366 88 368" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.4" />
        <path d="M104 362 Q106 364 108 366" fill="none" stroke="#131312" strokeWidth="1.2" opacity="0.4" />
        {/* Rear carrier legs — sliding in mud */}
        <path d="M95 388 Q92 394 88 398" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
        <path d="M101 388 Q104 394 108 398" fill="none" stroke="#131312" strokeWidth="1.5" opacity="0.4" />
        {/* Faint glow from lantern hung on stretcher pole */}
        <ellipse cx="130" cy="378" rx="12" ry="4" fill="url(#ch9_carrierGlow)" />
      </g>

      {/* === SECOND COLLAPSED TENT — larger, draped over its own ridge pole === */}
      <g>
        {/* Canvas mound — tent fabric over broken pole, sagging in the middle */}
        <path d="M580 345 Q590 335 610 338 Q625 340 635 348 Q630 354 615 356 Q595 358 582 352 Q578 350 580 345 Z"
          fill="url(#ch9_tentCanvas)" opacity="0.38" />
        {/* Ridge pole visible — poking through the canvas */}
        <line x1="585" y1="348" x2="630" y2="344" stroke="#1c1814" strokeWidth="1.5" opacity="0.25" />
        {/* Broken pole end sticking up */}
        <line x1="630" y1="344" x2="634" y2="338" stroke="#1c1814" strokeWidth="1" opacity="0.2" />
        {/* Canvas wrinkles */}
        <path d="M588 348 Q598 344 608 346" fill="none" stroke="#1a1610" strokeWidth="0.5" opacity="0.2" />
        <path d="M592 352 Q604 348 618 350" fill="none" stroke="#1a1610" strokeWidth="0.4" opacity="0.18" />
        {/* Water pooled in canvas folds */}
        <ellipse cx="600" cy="348" rx="8" ry="2" fill="url(#ch9_puddle)" opacity="0.25" />
        {/* Tent stake still in ground */}
        <line x1="578" y1="350" x2="575" y2="346" stroke="#2a2a2e" strokeWidth="0.6" opacity="0.2" />
        {/* Guy rope trailing */}
        <path d="M575 346 Q570 350 564 348 Q558 352 552 350"
          fill="none" stroke="#1a1614" strokeWidth="0.4" opacity="0.15" />
      </g>

      {/* === SECOND EXTINGUISHED CAMPFIRE ATTEMPT — closer, larger, more desperate === */}
      <g>
        {/* Stone ring — soldiers tried to build a proper fire circle */}
        <ellipse cx="680" cy="380" rx="14" ry="5" fill="none" stroke="#252220" strokeWidth="1.5" opacity="0.3" />
        {/* Individual stones in the ring */}
        <ellipse cx="668" cy="379" rx="3" ry="2" fill="#222018" opacity="0.25" />
        <ellipse cx="674" cy="376" rx="2.5" ry="1.8" fill="#222018" opacity="0.22" />
        <ellipse cx="686" cy="376" rx="2.5" ry="1.8" fill="#222018" opacity="0.2" />
        <ellipse cx="692" cy="379" rx="3" ry="2" fill="#222018" opacity="0.22" />
        <ellipse cx="688" cy="384" rx="2.5" ry="1.8" fill="#222018" opacity="0.2" />
        <ellipse cx="672" cy="384" rx="2.5" ry="1.8" fill="#222018" opacity="0.18" />
        {/* Wet logs — piled inside ring, charred on one end from a brief flame */}
        <line x1="672" y1="380" x2="688" y2="378" stroke="#101010" strokeWidth="2.5" opacity="0.35" />
        <line x1="675" y1="382" x2="686" y2="380" stroke="#121210" strokeWidth="2" opacity="0.3" />
        {/* Charred end — one log caught briefly before rain killed it */}
        <ellipse cx="688" cy="378" rx="2" ry="1.5" fill="#0a0a08" opacity="0.3" />
        {/* Faint smoke wisps — dying */}
        <path d="M680 376 Q682 370 680 364 Q678 358 680 352" fill="none" stroke="#30303a" strokeWidth="0.5" opacity="0.06">
          <animate attributeName="d" values="M680 376 Q682 370 680 364 Q678 358 680 352;M680 376 Q683 369 681 362 Q679 356 681 350;M680 376 Q682 370 680 364 Q678 358 680 352" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0.02;0.06" dur="6s" repeatCount="indefinite" />
        </path>
        {/* Soaked tinder and bark shavings around the pit */}
        <ellipse cx="676" cy="386" rx="4" ry="1.5" fill="#141210" opacity="0.15" />
        <ellipse cx="684" cy="387" rx="3" ry="1" fill="#141210" opacity="0.12" />
        {/* Broken flint and steel — abandoned in disgust */}
        <line x1="696" y1="382" x2="700" y2="380" stroke="#2a2a2e" strokeWidth="0.6" opacity="0.2" />
        <ellipse cx="702" cy="382" rx="1.5" ry="1" fill="#2a2a2e" opacity="0.15" />
      </g>

      {/* === ADDITIONAL ANIMATED RAIN STREAKS — individual drops, wind-driven === */}
      {/* Heavy drops — animated falling */}
      <line x1="120" y1="-10" x2="115" y2="20" stroke="#4a4a55" strokeWidth="0.6" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;410;20" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.15;0" dur="0.9s" repeatCount="indefinite" />
      </line>
      <line x1="310" y1="-10" x2="305" y2="25" stroke="#4a4a55" strokeWidth="0.5" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.75s" begin="0.2s" repeatCount="indefinite" />
        <animate attributeName="y2" values="25;415;25" dur="0.75s" begin="0.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.12;0" dur="0.75s" begin="0.2s" repeatCount="indefinite" />
      </line>
      <line x1="490" y1="-10" x2="484" y2="22" stroke="#4a4a55" strokeWidth="0.55" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.85s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="22;412;22" dur="0.85s" begin="0.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.13;0" dur="0.85s" begin="0.4s" repeatCount="indefinite" />
      </line>
      <line x1="680" y1="-10" x2="674" y2="20" stroke="#4a4a55" strokeWidth="0.5" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.95s" begin="0.15s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;410;20" dur="0.95s" begin="0.15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.14;0" dur="0.95s" begin="0.15s" repeatCount="indefinite" />
      </line>
      <line x1="200" y1="-10" x2="194" y2="18" stroke="#4a4a55" strokeWidth="0.45" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.8s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="18;408;18" dur="0.8s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.11;0" dur="0.8s" begin="0.5s" repeatCount="indefinite" />
      </line>
      <line x1="580" y1="-10" x2="575" y2="16" stroke="#4a4a55" strokeWidth="0.5" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
        <animate attributeName="y2" values="16;406;16" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.12;0" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
      </line>
      <line x1="750" y1="-10" x2="744" y2="22" stroke="#4a4a55" strokeWidth="0.55" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.88s" begin="0.55s" repeatCount="indefinite" />
        <animate attributeName="y2" values="22;412;22" dur="0.88s" begin="0.55s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.1;0" dur="0.88s" begin="0.55s" repeatCount="indefinite" />
      </line>
      <line x1="50" y1="-10" x2="44" y2="20" stroke="#4a4a55" strokeWidth="0.5" opacity="0">
        <animate attributeName="y1" values="-10;380;-10" dur="0.82s" begin="0.7s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;410;20" dur="0.82s" begin="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.13;0" dur="0.82s" begin="0.7s" repeatCount="indefinite" />
      </line>
      {/* Wind gust — cluster of rain shifting sideways */}
      <g opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.14;0.08;0.06;0.08" dur="7s" repeatCount="indefinite" />
        <line x1="300" y1="0" x2="270" y2="400" stroke="#4a4a55" strokeWidth="0.4" />
        <line x1="308" y1="0" x2="278" y2="400" stroke="#4a4a55" strokeWidth="0.3" />
        <line x1="316" y1="0" x2="286" y2="400" stroke="#4a4a55" strokeWidth="0.35" />
        <line x1="324" y1="0" x2="294" y2="400" stroke="#4a4a55" strokeWidth="0.3" />
      </g>

      {/* === BROKEN EQUIPMENT — additional scattered items === */}
      {/* Shattered lantern — glass broken, oil spilled */}
      <rect x="442" y="352" width="4" height="5" rx="0.5" fill="#2a2418" opacity="0.3" transform="rotate(35 444 354)" />
      <ellipse cx="448" cy="356" rx="5" ry="2" fill="#1a1818" opacity="0.12" />
      {/* Bent ramrod */}
      <line x1="396" y1="318" x2="415" y2="312" stroke="#2a2a2e" strokeWidth="0.6" opacity="0.2" />
      {/* Shattered cartridge box lid */}
      <rect x="550" y="348" width="8" height="5" rx="0.3" fill="#1a1816" opacity="0.2" transform="rotate(-25 554 350)" />
      {/* Discarded shako — waterlogged, crushed */}
      <ellipse cx="645" cy="330" rx="6" ry="3" fill="#131312" opacity="0.3" />
      <path d="M640 328 Q645 324 650 328" fill="#131312" opacity="0.25" />
      {/* Broken sword — snapped at hilt */}
      <line x1="408" y1="345" x2="422" y2="340" stroke="#2a2a2e" strokeWidth="0.8" opacity="0.25" />
      <line x1="405" y1="347" x2="408" y2="345" stroke="#1e1a14" strokeWidth="1.2" opacity="0.2" />
      {/* Cross-guard */}
      <line x1="406" y1="343" x2="410" y2="347" stroke="#2a2a2e" strokeWidth="0.5" opacity="0.18" />

      {/* === ADDITIONAL PUDDLE SURFACE DETAIL — wind-driven ripple lines === */}
      {/* Wind ripple lines on large puddle */}
      <path d="M250 227 Q265 225 280 227 Q295 225 310 227"
        fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.1" />
      <path d="M255 229 Q268 227 282 229 Q296 227 308 229"
        fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.08" />
      {/* Wind ripple lines on flood water */}
      <path d="M260 338 Q280 336 300 338 Q320 336 340 338 Q360 336 380 338"
        fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.08" />
      <path d="M265 340 Q285 338 305 340 Q325 338 345 340 Q365 338 385 340"
        fill="none" stroke="#35353a" strokeWidth="0.2" opacity="0.06" />
      <path d="M270 342 Q290 340 310 342 Q330 340 350 342 Q370 340 390 342"
        fill="none" stroke="#35353a" strokeWidth="0.15" opacity="0.05" />
      {/* Inverted reflection of broken signpost in nearby puddle */}
      <line x1="520" y1="256" x2="519" y2="261" stroke="#2a2a2e" strokeWidth="0.3" opacity="0.04" />
      <line x1="517" y1="258" x2="523" y2="258" stroke="#2a2a2e" strokeWidth="0.2" opacity="0.03" />

      {/* === RAIN CURTAIN — distant wall of heavier rain, drifting across mid-field === */}
      <rect x="-300" y="120" width="400" height="260" fill="#25252a" opacity="0">
        <animate attributeName="x" values="-300;900" dur="30s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.04;0.06;0.04;0" dur="30s" repeatCount="indefinite" />
      </rect>
      {/* Additional rain curtain — thinner, higher altitude */}
      <rect x="500" y="100" width="300" height="180" fill="#28282e" opacity="0">
        <animate attributeName="x" values="500;-400" dur="40s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.03;0.05;0.03;0" dur="40s" repeatCount="indefinite" />
      </rect>
      {/* Heavy downpour zone — concentrated rain band */}
      <rect x="150" y="140" width="200" height="150" fill="#25252a" opacity="0">
        <animate attributeName="x" values="150;-300;800;150" dur="55s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.02;0.07;0.04;0" dur="55s" repeatCount="indefinite" />
      </rect>

      {/* === ADDITIONAL MUD SPLASH MARKS — from horse hooves and artillery === */}
      {/* Splatter pattern near dead horse */}
      <circle cx="100" cy="238" r="1.5" fill="#25201a" opacity="0.1" />
      <circle cx="95" cy="235" r="1" fill="#25201a" opacity="0.08" />
      <circle cx="108" cy="240" r="1.2" fill="#25201a" opacity="0.09" />
      <ellipse cx="125" cy="242" rx="2" ry="0.8" fill="#25201a" opacity="0.07" />
      {/* Splatter near stuck wagon wheels */}
      <circle cx="485" cy="328" r="1.5" fill="#25201a" opacity="0.08" />
      <circle cx="492" cy="330" r="1" fill="#25201a" opacity="0.06" />
      <circle cx="540" cy="324" r="1.2" fill="#25201a" opacity="0.07" />

      {/* === FOREGROUND MUD DETAIL — very close, textured ground === */}
      {/* Foreground earth cracks — dried mud that then flooded again */}
      <path d="M20 388 Q30 385 40 388 Q45 390 50 388"
        fill="none" stroke="#181410" strokeWidth="0.4" opacity="0.1" />
      <path d="M32 386 Q35 392 38 394" fill="none" stroke="#181410" strokeWidth="0.3" opacity="0.08" />
      <path d="M700 392 Q715 390 730 393 Q740 395 750 392"
        fill="none" stroke="#181410" strokeWidth="0.4" opacity="0.1" />
      <path d="M720 390 Q722 396 725 398" fill="none" stroke="#181410" strokeWidth="0.3" opacity="0.08" />

      {/* === ADDITIONAL DISTANT ATMOSPHERE — layered fog at different depths === */}
      {/* Very thin mid-ground mist band */}
      <rect x="0" y="185" width="800" height="15" fill="url(#ch9_fog)" opacity="0.4">
        <animate attributeName="x" values="0;-30;0" dur="22s" repeatCount="indefinite" />
      </rect>
      {/* Low-horizon murk — where sky meets field, thick */}
      <rect x="0" y="168" width="800" height="12" fill="#25252a" opacity="0.08" />

      {/* === WATER DRIP FROM OBJECTS — rain running off wagon, tent, equipment === */}
      {/* Drip from overturned wagon edge */}
      <line x1="286" y1="210" x2="286" y2="216" stroke="#35353a" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="y2" values="216;222;216" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.03;0.08" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Drip from cannon barrel */}
      <line x1="15" y1="324" x2="15" y2="330" stroke="#35353a" strokeWidth="0.3" opacity="0.06">
        <animate attributeName="y2" values="330;336;330" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="1.8s" begin="0.5s" repeatCount="indefinite" />
      </line>
      {/* Drip from collapsed tent */}
      <line x1="78" y1="208" x2="78" y2="214" stroke="#35353a" strokeWidth="0.3" opacity="0.07">
        <animate attributeName="y2" values="214;220;214" dur="1.3s" begin="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.02;0.07" dur="1.3s" begin="0.3s" repeatCount="indefinite" />
      </line>

      {/* === CLOUD SHADOW DRIFT — very subtle darkening that moves across the field === */}
      <ellipse cx="0" cy="280" rx="200" ry="60" fill="#101010" opacity="0">
        <animate attributeName="cx" values="-200;1000" dur="60s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.03;0.05;0.03;0" dur="60s" repeatCount="indefinite" />
      </ellipse>

      {/* === SMOKE/MIST WISPS — atmospheric fog patches drifting === */}
      {/* Wisp 1 — low over puddles */}
      <ellipse cx="300" cy="230" rx="40" ry="12" fill="url(#ch9_smokeWisp)">
        <animate attributeName="cx" values="300;320;300" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="15s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp 2 — near dead horse */}
      <ellipse cx="120" cy="215" rx="35" ry="10" fill="url(#ch9_smokeWisp)">
        <animate attributeName="cx" values="120;140;120" dur="18s" begin="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="18s" begin="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp 3 — mid-field, between soldiers */}
      <ellipse cx="550" cy="260" rx="45" ry="14" fill="url(#ch9_smokeWisp)">
        <animate attributeName="cx" values="550;530;550" dur="20s" begin="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="20s" begin="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp 4 — near wagon */}
      <ellipse cx="350" cy="200" rx="30" ry="8" fill="url(#ch9_smokeWisp)">
        <animate attributeName="cx" values="350;365;350" dur="16s" begin="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp 5 — foreground, close */}
      <ellipse cx="200" cy="340" rx="50" ry="18" fill="url(#ch9_smokeWisp)">
        <animate attributeName="cx" values="200;185;200" dur="22s" begin="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.7;1" dur="22s" begin="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Wisp 6 — right side */}
      <ellipse cx="680" cy="295" rx="38" ry="11" fill="url(#ch9_smokeWisp)">
        <animate attributeName="cx" values="680;700;680" dur="19s" begin="1s" repeatCount="indefinite" />
      </ellipse>

      {/* === RAIN OVERLAYS — three layers for depth === */}
      <rect width="800" height="400" fill="url(#ch9_rain)" />
      <rect width="800" height="400" fill="url(#ch9_heavyRain)" />
      <rect width="800" height="400" fill="url(#ch9_fgRain)" />

      {/* Extra diagonal rain streaks — individual, wind-driven */}
      <line x1="50" y1="0" x2="30" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="150" y1="0" x2="130" y2="400" stroke="#4a4a50" strokeWidth="0.3" opacity="0.08" />
      <line x1="280" y1="0" x2="260" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="400" y1="0" x2="380" y2="400" stroke="#4a4a50" strokeWidth="0.3" opacity="0.08" />
      <line x1="530" y1="0" x2="510" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />
      <line x1="660" y1="0" x2="640" y2="400" stroke="#4a4a50" strokeWidth="0.3" opacity="0.08" />
      <line x1="760" y1="0" x2="740" y2="400" stroke="#4a4a50" strokeWidth="0.4" opacity="0.1" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Dark vignette — heaviest of all scenes */}
      <rect width="800" height="400" fill="url(#ch9_vignette)" />

      {/* Top/bottom extra darkening */}
      <rect x="0" y="0" width="800" height="40" fill="#15151a" opacity="0.35" />
      <rect x="0" y="365" width="800" height="35" fill="#0a0a0c" opacity="0.5" />

      {/* Grey desaturation overlay */}
      <rect width="800" height="400" fill="#1a1a1e" opacity="0.06" />
    </svg>
  );
}
