import React from 'react';

/**
 * Ch.13 — March on Vienna, Alpine pass at dawn (Spring 1797)
 * The FINAL scene. The army climbs a mountain road as golden dawn light
 * floods through a gap in the peaks ahead. Snow melting on ridgelines,
 * wildflowers in the valleys, pine forests on lower slopes.
 * Mood: Hopeful, epic, and bittersweet — journey's end.
 */
export function Ch13ViennaMarchScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Dawn sky — deep indigo fading to rose-gold at horizon */}
        <linearGradient id="ch13_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1020" />
          <stop offset="10%" stopColor="#121830" />
          <stop offset="25%" stopColor="#1a2545" />
          <stop offset="40%" stopColor="#2a3558" />
          <stop offset="55%" stopColor="#4a4a68" />
          <stop offset="68%" stopColor="#6a5568" />
          <stop offset="78%" stopColor="#8a6060" />
          <stop offset="88%" stopColor="#b07855" />
          <stop offset="95%" stopColor="#c89050" />
          <stop offset="100%" stopColor="#d0a048" />
        </linearGradient>

        {/* Dawn radiance — golden light flooding through the pass */}
        <radialGradient id="ch13_dawnGlow" cx="0.5" cy="0.42" r="0.45">
          <stop offset="0%" stopColor="#e8c060" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#d0a050" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#c09048" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a07838" stopOpacity="0" />
        </radialGradient>

        {/* Secondary glow — wider, softer */}
        <radialGradient id="ch13_dawnWide" cx="0.5" cy="0.5" r="0.65">
          <stop offset="0%" stopColor="#d0a050" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#a08040" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#806030" stopOpacity="0" />
        </radialGradient>

        {/* Snow peak gradient — lit by dawn */}
        <linearGradient id="ch13_snowLit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0b0a0" />
          <stop offset="40%" stopColor="#a09888" />
          <stop offset="100%" stopColor="#706860" />
        </linearGradient>

        {/* Snow peak gradient — shadowed side */}
        <linearGradient id="ch13_snowShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a7080" />
          <stop offset="50%" stopColor="#4a5565" />
          <stop offset="100%" stopColor="#2a3545" />
        </linearGradient>

        {/* Rock face — dark alpine granite */}
        <linearGradient id="ch13_rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#2a2a30" />
          <stop offset="100%" stopColor="#1a1a25" />
        </linearGradient>

        {/* Rock face — dawn-lit */}
        <linearGradient id="ch13_rockLit" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#5a4a3a" />
          <stop offset="50%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>

        {/* Pine forest — dark conifers */}
        <linearGradient id="ch13_pine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3020" />
          <stop offset="100%" stopColor="#0a2010" />
        </linearGradient>

        {/* Green meadow — spring emergence */}
        <linearGradient id="ch13_meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a5a30" />
          <stop offset="50%" stopColor="#2a4a22" />
          <stop offset="100%" stopColor="#1a3a18" />
        </linearGradient>

        {/* Mountain road surface */}
        <linearGradient id="ch13_road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5040" />
          <stop offset="100%" stopColor="#3a3528" />
        </linearGradient>

        {/* Stream water */}
        <linearGradient id="ch13_stream" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a6a80" stopOpacity="0" />
          <stop offset="50%" stopColor="#5a7a90" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4a6a80" stopOpacity="0" />
        </linearGradient>

        {/* Golden light beam gradient */}
        <linearGradient id="ch13_beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0b050" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#e0b050" stopOpacity="0" />
        </linearGradient>

        {/* Cloud — golden-edged */}
        <linearGradient id="ch13_cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a5a60" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#4a4050" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8a7050" stopOpacity="0.15" />
        </linearGradient>

        {/* Flag tricolour */}
        <linearGradient id="ch13_flag" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a3a6a" />
          <stop offset="33%" stopColor="#2a3a6a" />
          <stop offset="34%" stopColor="#c0b8a0" />
          <stop offset="66%" stopColor="#c0b8a0" />
          <stop offset="67%" stopColor="#8a2a2a" />
          <stop offset="100%" stopColor="#8a2a2a" />
        </linearGradient>

        {/* Golden vignette — warm, hopeful */}
        <radialGradient id="ch13_vignette" cx="0.5" cy="0.45" r="0.72">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a1008" stopOpacity="0.25" />
        </radialGradient>

        {/* Meltwater cascade gradient */}
        <linearGradient id="ch13_meltwater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b0c8d8" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#8ab0c8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6a90a8" stopOpacity="0" />
        </linearGradient>

        {/* Cloud wisp gradient — dawn-tinted */}
        <linearGradient id="ch13_cloudWisp" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a7058" stopOpacity="0" />
          <stop offset="30%" stopColor="#a08060" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#a08060" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8a7058" stopOpacity="0" />
        </linearGradient>

        {/* Church spire — warm dawn highlight */}
        <linearGradient id="ch13_spire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0a860" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8a7050" stopOpacity="0.2" />
        </linearGradient>

        {/* Cloud shadow — subtle moving shadow on mountainside */}
        <radialGradient id="ch13_cloudShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0a0a15" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#0a0a15" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0a0a15" stopOpacity="0" />
        </radialGradient>

        {/* Abandoned tent fabric — drab canvas */}
        <linearGradient id="ch13_tentFabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5548" />
          <stop offset="100%" stopColor="#3a3830" />
        </linearGradient>

        {/* Bridge wood grain */}
        <linearGradient id="ch13_bridgeWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a3828" />
          <stop offset="50%" stopColor="#5a4832" />
          <stop offset="100%" stopColor="#4a3828" />
        </linearGradient>

        {/* Milestone stone */}
        <linearGradient id="ch13_milestone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a7570" />
          <stop offset="100%" stopColor="#5a5550" />
        </linearGradient>

        {/* Flowing stream water — animated shimmer */}
        <linearGradient id="ch13_streamFlow" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#4a7a98" stopOpacity="0.1" />
          <stop offset="30%" stopColor="#6a9ab0" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#7aaac0" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#6a9ab0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4a7a98" stopOpacity="0.1" />
        </linearGradient>

        {/* Shepherd hut wall */}
        <linearGradient id="ch13_hutWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5040" />
          <stop offset="100%" stopColor="#3a3528" />
        </linearGradient>

        {/* Shepherd hut roof */}
        <linearGradient id="ch13_hutRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4038" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>

        {/* Wagon wood */}
        <linearGradient id="ch13_wagonWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4830" />
          <stop offset="100%" stopColor="#3a3020" />
        </linearGradient>

        {/* Large tricolour flag — wind-catching at column head */}
        <linearGradient id="ch13_flagLarge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2040a0" />
          <stop offset="32%" stopColor="#2040a0" />
          <stop offset="33%" stopColor="#d0c8b0" />
          <stop offset="65%" stopColor="#d0c8b0" />
          <stop offset="66%" stopColor="#a02020" />
          <stop offset="100%" stopColor="#a02020" />
        </linearGradient>

        {/* Spring leaf green */}
        <radialGradient id="ch13_springLeaf" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4a8a30" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#3a7020" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a5a18" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch13_sky)" />
      <rect width="800" height="400" fill="url(#ch13_dawnGlow)" />
      <rect width="800" height="400" fill="url(#ch13_dawnWide)" />

      {/* Fading stars at the top of the sky */}
      <circle cx="120" cy="18" r="1" fill="#a0a8c0" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="12" r="0.8" fill="#a0a8c0" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="520" cy="22" r="1" fill="#a0a8c0" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.08;0.3" dur="5.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="15" r="0.7" fill="#a0a8c0" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="410" cy="8" r="0.9" fill="#b0b8d0" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.05;0.25" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="190" cy="35" r="0.6" fill="#a0a8c0" opacity="0.2" />
      <circle cx="600" cy="30" r="0.7" fill="#a0a8c0" opacity="0.2" />

      {/* Golden-edged clouds — illuminated by the sunrise */}
      <ellipse cx="220" cy="50" rx="90" ry="12" fill="url(#ch13_cloud)">
        <animate attributeName="cx" values="220;228;220" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="580" cy="42" rx="70" ry="9" fill="url(#ch13_cloud)">
        <animate attributeName="cx" values="580;572;580" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="65" rx="50" ry="7" fill="url(#ch13_cloud)" opacity="0.6" />
      {/* Cloud golden edges */}
      <ellipse cx="220" cy="55" rx="85" ry="4" fill="#c0a050" opacity="0.08" />
      <ellipse cx="580" cy="46" rx="65" ry="3" fill="#c0a050" opacity="0.06" />

      {/* === CLOUD WISPS drifting through the pass opening === */}
      <ellipse cx="370" cy="120" rx="55" ry="5" fill="url(#ch13_cloudWisp)" opacity="0.7">
        <animate attributeName="cx" values="370;420;370" dur="25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.45;0.7" dur="25s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="440" cy="132" rx="40" ry="3.5" fill="url(#ch13_cloudWisp)" opacity="0.5">
        <animate attributeName="cx" values="440;390;440" dur="22s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="22s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="108" rx="30" ry="2.5" fill="url(#ch13_cloudWisp)" opacity="0.35">
        <animate attributeName="cx" values="400;430;400" dur="30s" repeatCount="indefinite" />
      </ellipse>

      {/* === DAWN LIGHT BEAMS through the mountain gap === */}
      <polygon points="400,135 320,0 360,0" fill="url(#ch13_beam)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.75;0.6" dur="6s" repeatCount="indefinite" />
      </polygon>
      <polygon points="400,135 430,0 470,0" fill="url(#ch13_beam)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.65;0.5" dur="7s" repeatCount="indefinite" />
      </polygon>
      <polygon points="400,135 240,0 280,0" fill="url(#ch13_beam)" opacity="0.35" />
      <polygon points="400,135 500,0 540,0" fill="url(#ch13_beam)" opacity="0.3" />
      <polygon points="400,135 180,0 210,0" fill="url(#ch13_beam)" opacity="0.2" />
      <polygon points="400,135 560,0 590,0" fill="url(#ch13_beam)" opacity="0.2" />

      {/* Lens-flare highlight at the sunrise point */}
      <circle cx="400" cy="135" r="18" fill="#e0c060" opacity="0.2">
        <animate attributeName="r" values="18;22;18" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.3;0.2" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="135" r="6" fill="#f0d870" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.45;0.3" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* === EAGLE SOARING — raptor riding thermals above the pass === */}
      <g opacity="0.38">
        <animateTransform attributeName="transform" type="translate" values="0,0;30,-8;60,0;30,8;0,0" dur="18s" repeatCount="indefinite" />
        <path d="M355 72 Q367 58 380 67 Q393 58 405 72" fill="none" stroke="#1a1a28" strokeWidth="1.5" opacity="1">
          <animate attributeName="d" values="M355 72 Q367 58 380 67 Q393 58 405 72;M358 71 Q367 62 380 67 Q393 62 402 71;M355 72 Q367 58 380 67 Q393 58 405 72" dur="3.5s" repeatCount="indefinite" />
        </path>
        {/* Tail feathers */}
        <path d="M378 67 L380 73 L382 67" fill="none" stroke="#1a1a28" strokeWidth="0.8" opacity="0.8" />
      </g>

      {/* === SECOND EAGLE — soaring at different altitude and position === */}
      <g opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0;-20,5;-40,0;-20,-5;0,0" dur="22s" repeatCount="indefinite" />
        <path d="M620 55 Q629 44 638 52 Q647 44 656 55" fill="none" stroke="#1a1a28" strokeWidth="1.2" opacity="1">
          <animate attributeName="d" values="M620 55 Q629 44 638 52 Q647 44 656 55;M622 54 Q629 47 638 52 Q647 47 654 54;M620 55 Q629 44 638 52 Q647 44 656 55" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Tail feathers */}
        <path d="M636 52 L638 57 L640 52" fill="none" stroke="#1a1a28" strokeWidth="0.6" opacity="0.7" />
      </g>

      {/* === ALPINE PEAKS — LEFT MASSIF === */}
      {/* Far left peak — towering, shadowed */}
      <path d="M0 90 Q30 40 70 60 Q110 20 150 55 Q180 70 200 100 L200 240 L0 240 Z"
        fill="url(#ch13_rock)" opacity="0.85" />
      {/* Snow on left peak ridgeline */}
      <path d="M108 22 Q115 15 125 22 Q135 30 145 38 Q150 42 155 55 Q145 35 130 26 Q120 20 108 22 Z"
        fill="url(#ch13_snowShade)" opacity="0.6" />
      <path d="M28 42 Q35 32 45 38 Q55 44 65 55 Q55 42 42 35 Q35 34 28 42 Z"
        fill="url(#ch13_snowShade)" opacity="0.5" />

      {/* === MORE DETAILED SNOW CAPS — layered white shapes on left peak === */}
      {/* Upper snow field — bright white catching dawn */}
      <path d="M110 24 Q120 18 130 25 Q125 22 118 22 Z" fill="#d0c8c0" opacity="0.35" />
      <path d="M115 20 Q122 14 128 20 Q123 17 118 18 Z" fill="#e0d8d0" opacity="0.25" />
      {/* Snow cornice overhang */}
      <path d="M125 23 Q130 20 138 25 Q135 23 128 22 Z" fill="#c8c0b8" opacity="0.3" />
      {/* Wind-blown snow streaks */}
      <path d="M112 26 Q118 24 126 28" fill="none" stroke="#c8c0b8" strokeWidth="0.8" opacity="0.2" />
      <path d="M130 30 Q138 27 148 34" fill="none" stroke="#b8b0a8" strokeWidth="0.6" opacity="0.15" />

      {/* === AVALANCHE SCAR — white streak of spring melt on left mountain === */}
      <path d="M72 48 Q74 60 70 78 Q68 92 72 108 Q75 120 73 135"
        fill="none" stroke="#b8c0c8" strokeWidth="3.5" opacity="0.15" strokeLinecap="round" />
      <path d="M72 48 Q75 62 71 80 Q69 95 73 112 Q76 122 74 135"
        fill="none" stroke="#d0d8e0" strokeWidth="1.5" opacity="0.1" strokeLinecap="round" />
      {/* Debris fan at the base of the scar */}
      <ellipse cx="73" cy="138" rx="8" ry="3" fill="#a0a8b0" opacity="0.08" />

      {/* Meltwater cascade — left mountain face */}
      <path d="M135 42 Q137 65 134 90 Q136 115 133 140" fill="none" stroke="#b0c8d8" strokeWidth="1.2" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.3;0.2" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M136 42 Q138 65 135 90 Q137 115 134 140" fill="none" stroke="#dde8f0" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* === MELTWATER DRIPPING from rock overhangs === */}
      {/* Drip 1 — left overhang */}
      <circle cx="135" cy="142" r="0.6" fill="#a0c8e0" opacity="0.3">
        <animate attributeName="cy" values="142;150;142" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="136" cy="144" r="0.5" fill="#a0c8e0" opacity="0.25">
        <animate attributeName="cy" values="144;152;144" dur="2.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.04;0.25" dur="2.3s" repeatCount="indefinite" />
      </circle>
      {/* Drip 2 — right overhang */}
      <circle cx="664" cy="150" r="0.5" fill="#a0c8e0" opacity="0.25">
        <animate attributeName="cy" values="150;158;150" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.04;0.25" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="666" cy="152" r="0.4" fill="#a0c8e0" opacity="0.2">
        <animate attributeName="cy" values="152;160;152" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.03;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Drip splash rings — tiny expanding circles at drip base */}
      <circle cx="135" cy="150" r="1" fill="none" stroke="#a0c8e0" strokeWidth="0.3" opacity="0.12">
        <animate attributeName="r" values="0.5;2.5;0.5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* === CLOUD SHADOWS — moving across the left mountainside === */}
      <ellipse cx="100" cy="140" rx="45" ry="20" fill="url(#ch13_cloudShadow)" opacity="0.5">
        <animate attributeName="cx" values="100;160;100" dur="35s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="35s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="680" cy="150" rx="55" ry="22" fill="url(#ch13_cloudShadow)" opacity="0.4">
        <animate attributeName="cx" values="680;620;680" dur="40s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.25;0.4" dur="40s" repeatCount="indefinite" />
      </ellipse>
      {/* Smaller shadow on the pass slopes */}
      <ellipse cx="350" cy="175" rx="30" ry="12" fill="url(#ch13_cloudShadow)" opacity="0.3">
        <animate attributeName="cx" values="350;420;350" dur="45s" repeatCount="indefinite" />
      </ellipse>
      {/* === ADDITIONAL CLOUD SHADOWS — across right mountain face === */}
      <ellipse cx="560" cy="120" rx="40" ry="18" fill="url(#ch13_cloudShadow)" opacity="0.35">
        <animate attributeName="cx" values="560;500;560" dur="38s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.18;0.35" dur="38s" repeatCount="indefinite" />
      </ellipse>
      {/* Low cloud shadow crossing the meadow */}
      <ellipse cx="200" cy="250" rx="35" ry="10" fill="url(#ch13_cloudShadow)" opacity="0.25">
        <animate attributeName="cx" values="200;280;200" dur="50s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.12;0.25" dur="50s" repeatCount="indefinite" />
      </ellipse>

      {/* Mountain goat — tiny silhouette on a high crag */}
      <g opacity="0.3">
        {/* Body */}
        <path d="M85 56 Q88 52 92 53 L94 57 Q91 59 87 58 Z" fill="#1a1a20" />
        {/* Head */}
        <circle cx="94" cy="52" r="1.5" fill="#1a1a20" />
        {/* Horns — small curved */}
        <path d="M94 51 Q96 48 95 50" fill="none" stroke="#1a1a20" strokeWidth="0.5" />
        {/* Legs */}
        <line x1="87" y1="58" x2="86" y2="61" stroke="#1a1a20" strokeWidth="0.6" />
        <line x1="91" y1="58" x2="90" y2="61" stroke="#1a1a20" strokeWidth="0.6" />
      </g>

      {/* === MARMOT on a rock — small brown figure watching the column === */}
      <g opacity="0.4">
        {/* Rock the marmot sits on */}
        <ellipse cx="188" cy="200" rx="6" ry="3" fill="#4a4540" opacity="0.5" />
        {/* Marmot body — sitting upright */}
        <path d="M186 200 Q185 195 187 192 Q189 190 191 192 Q193 195 192 200 Z" fill="#6a5030" />
        {/* Head — round, alert */}
        <circle cx="189" cy="190" r="2.2" fill="#6a5030" />
        {/* Ears — small rounded */}
        <circle cx="187.5" cy="188.5" r="0.8" fill="#7a6040" />
        <circle cx="190.5" cy="188.5" r="0.8" fill="#7a6040" />
        {/* Eye — tiny bright dot */}
        <circle cx="188.2" cy="189.8" r="0.4" fill="#1a1510" />
        {/* Nose */}
        <circle cx="189" cy="191.2" r="0.4" fill="#3a2a18" />
        {/* Front paws — held together */}
        <path d="M187 196 Q188 197 189 196" fill="none" stroke="#5a4028" strokeWidth="0.6" />
        {/* Tail — short, behind body */}
        <path d="M191 199 Q193 198 194 200" fill="none" stroke="#6a5030" strokeWidth="1" />
      </g>

      {/* Mid-left peak — closer, dawn-lit edge */}
      <path d="M120 130 Q160 70 210 95 Q240 80 270 110 Q290 130 310 160 L310 260 L120 260 Z"
        fill="url(#ch13_rockLit)" opacity="0.75" />
      {/* Snow cap on mid-left */}
      <path d="M158 72 Q168 60 178 68 Q190 76 200 85 Q210 78 220 95 Q200 80 185 72 Q172 66 158 72 Z"
        fill="url(#ch13_snowLit)" opacity="0.5" />

      {/* === MORE DETAILED SNOW CAPS — layered on mid-left peak === */}
      <path d="M162 74 Q170 64 180 72 Q175 68 168 68 Z" fill="#d8d0c8" opacity="0.3" />
      <path d="M168 66 Q175 58 182 66 Q178 62 172 62 Z" fill="#e0d8d0" opacity="0.2" />
      {/* Windblown snow ribbons */}
      <path d="M175 70 Q182 67 192 74" fill="none" stroke="#c8c0b8" strokeWidth="0.7" opacity="0.18" />

      {/* Rock face detail — crevasses */}
      <path d="M170 100 Q175 115 172 135" fill="none" stroke="#1a1a20" strokeWidth="0.8" opacity="0.3" />
      <path d="M200 110 Q208 125 205 145" fill="none" stroke="#1a1a20" strokeWidth="0.6" opacity="0.25" />

      {/* === ALPINE PEAKS — RIGHT MASSIF === */}
      {/* Far right peak */}
      <path d="M600 95 Q640 35 690 60 Q730 15 770 45 Q790 55 800 70 L800 240 L600 240 Z"
        fill="url(#ch13_rock)" opacity="0.85" />
      {/* Snow on right peak */}
      <path d="M728 17 Q738 8 748 18 Q758 28 768 38 Q775 42 780 48 Q770 35 755 24 Q742 15 728 17 Z"
        fill="url(#ch13_snowLit)" opacity="0.55" />
      <path d="M638 37 Q648 28 658 36 Q668 44 678 52 Q665 42 652 34 Q645 32 638 37 Z"
        fill="url(#ch13_snowShade)" opacity="0.45" />

      {/* === MORE DETAILED SNOW CAPS — layered on right peaks === */}
      {/* Upper right snow field */}
      <path d="M730 20 Q740 12 750 22 Q745 18 735 18 Z" fill="#d8d0c8" opacity="0.3" />
      <path d="M735 14 Q742 8 750 16 Q745 12 738 12 Z" fill="#e0d8d0" opacity="0.22" />
      {/* Far right summit snow crust */}
      <path d="M640 38 Q650 30 660 40 Q655 36 645 36 Z" fill="#c8c0b8" opacity="0.25" />
      {/* Wind-streaked snow at altitude */}
      <path d="M745 22 Q755 18 765 26" fill="none" stroke="#d0c8c0" strokeWidth="0.6" opacity="0.18" />
      <path d="M650 40 Q658 36 668 44" fill="none" stroke="#b8b0a8" strokeWidth="0.5" opacity="0.14" />

      {/* Meltwater cascade — right mountain face */}
      <path d="M665 50 Q667 75 664 100 Q666 125 663 148" fill="none" stroke="#b0c8d8" strokeWidth="1" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.28;0.18" dur="4.5s" repeatCount="indefinite" />
      </path>
      <path d="M666 50 Q668 75 665 100 Q667 125 664 148" fill="none" stroke="#dde8f0" strokeWidth="0.4" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.2;0.12" dur="3.8s" repeatCount="indefinite" />
      </path>

      {/* Mid-right peak — dawn-lit */}
      <path d="M500 165 Q540 90 580 115 Q620 80 660 110 Q690 130 700 160 L700 260 L500 260 Z"
        fill="url(#ch13_rockLit)" opacity="0.7" />
      {/* Snow cap on mid-right */}
      <path d="M538 92 Q548 78 560 88 Q572 95 580 105 Q585 98 595 115 Q580 100 565 90 Q552 84 538 92 Z"
        fill="url(#ch13_snowLit)" opacity="0.55" />
      {/* Crevasse detail */}
      <path d="M570 115 Q575 130 572 150" fill="none" stroke="#1a1a20" strokeWidth="0.7" opacity="0.25" />
      <path d="M620 120 Q628 138 625 158" fill="none" stroke="#1a1a20" strokeWidth="0.5" opacity="0.2" />

      {/* === SHEPHERD'S HUT with smoke from chimney === */}
      <g opacity="0.45">
        {/* Hut body — small stone cabin on the right slope */}
        <rect x="695" y="195" width="18" height="12" rx="1" fill="url(#ch13_hutWall)" />
        {/* Roof — steep alpine pitch */}
        <path d="M693 195 L704 184 L715 195 Z" fill="url(#ch13_hutRoof)" />
        {/* Door — dark rectangle */}
        <rect x="700" y="200" width="4" height="7" fill="#1a1510" opacity="0.5" />
        {/* Window — tiny, warm light inside */}
        <rect x="708" y="198" width="3" height="3" fill="#c0a050" opacity="0.2" />
        {/* Chimney */}
        <rect x="709" y="186" width="3" height="9" fill="#4a4038" />
        {/* Chimney smoke — lazy curls rising */}
        <path d="M710 186 Q708 180 711 174 Q714 168 710 162" fill="none" stroke="#6a6a70" strokeWidth="1.5" opacity="0.15">
          <animate attributeName="d" values="M710 186 Q708 180 711 174 Q714 168 710 162;M710 186 Q713 179 710 173 Q707 167 711 161;M710 186 Q708 180 711 174 Q714 168 710 162" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.08;0.15" dur="6s" repeatCount="indefinite" />
        </path>
        <path d="M711 186 Q709 178 712 170 Q715 164 712 158" fill="none" stroke="#7a7a80" strokeWidth="0.8" opacity="0.1">
          <animate attributeName="d" values="M711 186 Q709 178 712 170 Q715 164 712 158;M711 186 Q714 177 711 169 Q708 163 712 157;M711 186 Q709 178 712 170 Q715 164 712 158" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.1;0.05;0.1" dur="7s" repeatCount="indefinite" />
        </path>
        {/* Stone wall texture — horizontal lines */}
        <line x1="695" y1="199" x2="713" y2="199" stroke="#4a4538" strokeWidth="0.3" opacity="0.3" />
        <line x1="695" y1="203" x2="713" y2="203" stroke="#4a4538" strokeWidth="0.3" opacity="0.25" />
        {/* Woodpile beside the hut */}
        <rect x="715" y="202" width="4" height="5" rx="0.5" fill="#3a2a18" opacity="0.35" />
        <line x1="716" y1="202" x2="716" y2="207" stroke="#4a3a28" strokeWidth="0.4" opacity="0.25" />
        <line x1="718" y1="202" x2="718" y2="207" stroke="#4a3a28" strokeWidth="0.4" opacity="0.2" />
      </g>

      {/* === MOUNTAIN GAP — the pass, with dawn light beyond === */}
      {/* Green valley visible through the gap */}
      <path d="M310 160 Q350 140 400 135 Q450 140 500 165 L500 220 L310 220 Z"
        fill="url(#ch13_meadow)" opacity="0.35" />
      {/* Distant rolling hills through the gap */}
      <path d="M320 170 Q360 162 400 158 Q440 162 480 170 L480 195 L320 195 Z"
        fill="#2a4520" opacity="0.2" />

      {/* === DISTANT VALLEY VILLAGE with church spire === */}
      {/* Village buildings — tiny rectangles in the valley below */}
      <rect x="388" y="168" width="3" height="3" fill="#3a3a30" opacity="0.15" />
      <rect x="393" y="169" width="2.5" height="2.5" fill="#3a3a30" opacity="0.13" />
      <rect x="384" y="170" width="2" height="2" fill="#3a3a30" opacity="0.12" />
      <rect x="398" y="170" width="2" height="2.5" fill="#3a3a30" opacity="0.12" />
      <rect x="380" y="171" width="2.5" height="2" fill="#3a3a30" opacity="0.1" />
      {/* Church spire — tallest structure, catches dawn light */}
      <rect x="390" y="163" width="1.5" height="8" fill="#3a3528" opacity="0.2" />
      <path d="M389 163 L391 157 L393 163 Z" fill="url(#ch13_spire)" opacity="0.35" />
      {/* Golden cross at the top catching the dawn */}
      <line x1="391" y1="157" x2="391" y2="155.5" stroke="#d0a860" strokeWidth="0.5" opacity="0.35" />
      <line x1="389.8" y1="156.5" x2="392.2" y2="156.5" stroke="#d0a860" strokeWidth="0.5" opacity="0.35" />
      {/* Spire dawn glint */}
      <circle cx="391" cy="157" r="1" fill="#e0c060" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.22;0.12" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* === PINE FORESTS on lower slopes === */}
      {/* Left slope forest — layered conifers */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = 40 + i * 28;
        const y = 178 - i * 5 + (i % 2) * 8;
        const h = 22 + (i % 3) * 5;
        return (
          <React.Fragment key={`lpine${i}`}>
            <path d={`M${x} ${y} L${x - 6 - i % 2 * 2} ${y + h} L${x + 6 + i % 2 * 2} ${y + h} Z`}
              fill="url(#ch13_pine)" opacity={0.55 - i * 0.03} />
            <rect x={x - 0.5} y={y + h} width={1} height={4} fill="#1a1510" opacity={0.3} />
          </React.Fragment>
        );
      })}

      {/* Right slope forest */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = 560 + i * 30;
        const y = 175 - i * 4 + (i % 2) * 6;
        const h = 20 + (i % 3) * 4;
        return (
          <React.Fragment key={`rpine${i}`}>
            <path d={`M${x} ${y} L${x - 6 - i % 2 * 2} ${y + h} L${x + 6 + i % 2 * 2} ${y + h} Z`}
              fill="url(#ch13_pine)" opacity={0.5 - i * 0.03} />
            <rect x={x - 0.5} y={y + h} width={1} height={4} fill="#1a1510" opacity={0.25} />
          </React.Fragment>
        );
      })}

      {/* === SPRING LEAVES on Alpine trees — bright green clusters === */}
      {/* Left slope — deciduous trees with fresh spring foliage */}
      <circle cx="55" cy="188" r="5" fill="url(#ch13_springLeaf)" opacity="0.5" />
      <circle cx="52" cy="185" r="4" fill="#4a8a28" opacity="0.35" />
      <circle cx="59" cy="186" r="3.5" fill="#5a9a38" opacity="0.3" />
      <rect x="54" y="193" width="1.2" height="6" fill="#2a2018" opacity="0.3" />
      {/* Second spring tree — further along */}
      <circle cx="110" cy="195" r="4.5" fill="url(#ch13_springLeaf)" opacity="0.45" />
      <circle cx="107" cy="192" r="3.5" fill="#4a8a28" opacity="0.3" />
      <circle cx="114" cy="193" r="3" fill="#5a9a38" opacity="0.28" />
      <rect x="109" y="199" width="1" height="5" fill="#2a2018" opacity="0.25" />
      {/* Right slope — spring leaves among the pines */}
      <circle cx="575" cy="186" r="4" fill="url(#ch13_springLeaf)" opacity="0.4" />
      <circle cx="572" cy="183" r="3" fill="#4a8a28" opacity="0.3" />
      <circle cx="579" cy="184" r="3.2" fill="#5a9a38" opacity="0.25" />
      <rect x="574" y="190" width="1" height="5" fill="#2a2018" opacity="0.25" />
      {/* Small spring sapling near the road */}
      <circle cx="340" cy="275" r="3" fill="#5a9a38" opacity="0.3" />
      <circle cx="338" cy="273" r="2.5" fill="#4a8a28" opacity="0.25" />
      <rect x="339" y="278" width="0.8" height="4" fill="#2a2018" opacity="0.2" />

      {/* Treeline transition — scattered smaller pines at higher elevation */}
      <path d="M230 145 L226 158 L234 158 Z" fill="url(#ch13_pine)" opacity="0.35" />
      <path d="M255 150 L251 162 L259 162 Z" fill="url(#ch13_pine)" opacity="0.3" />
      <path d="M550 148 L546 160 L554 160 Z" fill="url(#ch13_pine)" opacity="0.3" />
      <path d="M530 155 L526 166 L534 166 Z" fill="url(#ch13_pine)" opacity="0.28" />

      {/* === BIRDSONG HINT — tiny animated birds flitting between pines === */}
      {/* Bird 1 — darting left-to-right near left pine canopy */}
      <g opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,0;18,-6;35,2;18,6;0,0" dur="5s" repeatCount="indefinite" />
        <path d="M65 174 Q68 170 71 173 Q74 170 77 174" fill="none" stroke="#1a2018" strokeWidth="0.6" />
      </g>
      {/* Bird 2 — swooping near the right pines */}
      <g opacity="0.25">
        <animateTransform attributeName="transform" type="translate" values="0,0;-12,-8;-24,0;-12,8;0,0" dur="6.5s" repeatCount="indefinite" />
        <path d="M598 172 Q601 168 604 171 Q607 168 610 172" fill="none" stroke="#1a2018" strokeWidth="0.5" />
      </g>
      {/* Bird 3 — tiny, flitting among the treeline pines */}
      <g opacity="0.22">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,-10;16,-4;8,6;0,0" dur="4.5s" repeatCount="indefinite" />
        <path d="M238 143 Q240 140 242 142 Q244 140 246 143" fill="none" stroke="#1a2018" strokeWidth="0.5" />
      </g>
      {/* Bird 4 — pair near the right treeline */}
      <g opacity="0.2">
        <animateTransform attributeName="transform" type="translate" values="0,0;-6,-5;-12,2;-6,5;0,0" dur="5.5s" repeatCount="indefinite" />
        <path d="M540 152 Q542 149 544 151 Q546 149 548 152" fill="none" stroke="#1a2018" strokeWidth="0.45" />
        <path d="M545 150 Q547 147 549 149 Q551 147 553 150" fill="none" stroke="#1a2018" strokeWidth="0.4" />
      </g>

      {/* === CLOSER SLOPES — framing the road === */}
      <path d="M0 230 Q60 195 130 215 Q200 210 260 240 L260 400 L0 400 Z"
        fill="url(#ch13_rockLit)" opacity="0.55" />
      <path d="M540 240 Q600 210 680 220 Q740 200 800 215 L800 400 L540 400 Z"
        fill="url(#ch13_rockLit)" opacity="0.5" />

      {/* Green meadow patches emerging from snow on slopes */}
      <ellipse cx="100" cy="240" rx="35" ry="10" fill="url(#ch13_meadow)" opacity="0.4" />
      <ellipse cx="200" cy="255" rx="25" ry="8" fill="url(#ch13_meadow)" opacity="0.35" />
      <ellipse cx="640" cy="245" rx="30" ry="9" fill="url(#ch13_meadow)" opacity="0.35" />
      <ellipse cx="730" cy="238" rx="22" ry="7" fill="url(#ch13_meadow)" opacity="0.3" />
      {/* Remaining snow patches */}
      <ellipse cx="160" cy="230" rx="18" ry="5" fill="#6a7078" opacity="0.15" />
      <ellipse cx="700" cy="230" rx="20" ry="5" fill="#6a7078" opacity="0.12" />

      {/* === MOUNTAIN WILDFLOWER MEADOW — sunny patch on the left slope === */}
      <ellipse cx="130" cy="232" rx="20" ry="7" fill="#3a5a2a" opacity="0.25" />
      {/* Dense wildflower carpet in the sunny patch */}
      <circle cx="120" cy="230" r="1.3" fill="#c0a040" opacity="0.35" />
      <circle cx="124" cy="228" r="1" fill="#b05070" opacity="0.3" />
      <circle cx="128" cy="232" r="1.2" fill="#5070b0" opacity="0.32" />
      <circle cx="132" cy="229" r="0.9" fill="#c0c0b0" opacity="0.3" />
      <circle cx="136" cy="233" r="1.1" fill="#c0a040" opacity="0.32" />
      <circle cx="140" cy="230" r="1" fill="#8050a0" opacity="0.28" />
      <circle cx="122" cy="234" r="0.8" fill="#5070b0" opacity="0.28" />
      <circle cx="126" cy="235" r="1" fill="#b05070" opacity="0.25" />
      <circle cx="134" cy="236" r="0.9" fill="#c0c0b0" opacity="0.25" />
      <circle cx="138" cy="228" r="0.7" fill="#8050a0" opacity="0.22" />
      {/* Grass tufts in the meadow */}
      <path d="M125 232 Q127 226 129 232" fill="none" stroke="#4a6a30" strokeWidth="0.5" opacity="0.22" />
      <path d="M135 230 Q137 224 139 230" fill="none" stroke="#4a6a30" strokeWidth="0.5" opacity="0.2" />

      {/* === ABANDONED AUSTRIAN CAMP — enemy fled, dim tent shapes on roadside === */}
      <g opacity="0.4">
        {/* Tent 1 — collapsed, sagging canvas */}
        <path d="M600 254 L608 242 L616 254 Z" fill="url(#ch13_tentFabric)" opacity="0.5" />
        <path d="M602 254 L607 244 L612 254" fill="none" stroke="#4a4538" strokeWidth="0.5" opacity="0.3" />
        {/* Tent 2 — half-fallen, leaning */}
        <path d="M622 256 L628 245 L632 256 Z" fill="url(#ch13_tentFabric)" opacity="0.4" />
        <line x1="628" y1="245" x2="630" y2="256" stroke="#4a4538" strokeWidth="0.4" opacity="0.3" />
        {/* Tent 3 — barely standing, further back */}
        <path d="M612 250 L617 240 L622 250 Z" fill="url(#ch13_tentFabric)" opacity="0.3" />
        {/* Dead campfire — charred ring with grey ash */}
        <ellipse cx="618" cy="260" rx="4" ry="1.8" fill="#2a2828" opacity="0.5" />
        <ellipse cx="618" cy="260" rx="2.5" ry="1" fill="#4a4848" opacity="0.35" />
        {/* Charred sticks in the fire ring */}
        <line x1="615" y1="259" x2="621" y2="261" stroke="#1a1818" strokeWidth="0.5" opacity="0.4" />
        <line x1="616" y1="261" x2="620" y2="259" stroke="#1a1818" strokeWidth="0.4" opacity="0.35" />
        {/* Last wisp of smoke — very faint, fire long dead */}
        <path d="M618 258 Q619 254 617 250" fill="none" stroke="#6a6a6a" strokeWidth="0.5" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.06;0.12" dur="6s" repeatCount="indefinite" />
          <animate attributeName="d" values="M618 258 Q619 254 617 250;M618 258 Q620 253 618 249;M618 258 Q619 254 617 250" dur="6s" repeatCount="indefinite" />
        </path>
        {/* Scattered debris — abandoned supplies */}
        <rect x="624" y="258" width="2" height="1.5" rx="0.3" fill="#3a3830" opacity="0.3" />
        <circle cx="610" cy="258" r="1" fill="#3a3530" opacity="0.25" />
        {/* Discarded pole / broken tent stake */}
        <line x1="604" y1="252" x2="610" y2="256" stroke="#4a4030" strokeWidth="0.6" opacity="0.3" />
      </g>

      {/* === WINDING MOUNTAIN ROAD === */}
      {/* Road — main visible section climbing toward the pass */}
      <path d="M300 400 Q310 370 330 340 Q355 305 380 275 Q405 245 420 215 Q435 195 440 180"
        fill="none" stroke="url(#ch13_road)" strokeWidth="30" opacity="0.45" strokeLinecap="round" />
      {/* Road edges */}
      <path d="M285 400 Q296 368 316 338 Q340 303 365 273 Q390 243 406 213"
        fill="none" stroke="#3a3530" strokeWidth="1.2" opacity="0.2" />
      <path d="M316 400 Q326 368 346 338 Q370 303 396 273 Q420 243 436 213"
        fill="none" stroke="#3a3530" strokeWidth="1.2" opacity="0.2" />

      {/* Road — distant section visible higher up, winding back */}
      <path d="M440 180 Q460 165 480 158 Q500 155 510 160"
        fill="none" stroke="url(#ch13_road)" strokeWidth="12" opacity="0.3" strokeLinecap="round" />
      {/* Even more distant bend disappearing around the peak */}
      <path d="M510 160 Q520 162 525 168"
        fill="none" stroke="url(#ch13_road)" strokeWidth="6" opacity="0.18" strokeLinecap="round" />

      {/* === FLOWING MOUNTAIN STREAM with animated water === */}
      {/* Main stream body — wider, with animated flow */}
      <path d="M220 298 Q250 290 280 287 Q310 290 340 300 Q350 306 360 315"
        fill="none" stroke="url(#ch13_streamFlow)" strokeWidth="5" opacity="0.3" />
      {/* Stream current lines — animated to show flow direction */}
      <path d="M230 295 Q240 292 250 290" fill="none" stroke="#8ab8d0" strokeWidth="0.6" opacity="0.2">
        <animate attributeName="d" values="M230 295 Q240 292 250 290;M235 294 Q245 291 255 289;M230 295 Q240 292 250 290" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M260 290 Q275 287 290 290" fill="none" stroke="#8ab8d0" strokeWidth="0.5" opacity="0.18">
        <animate attributeName="d" values="M260 290 Q275 287 290 290;M265 289 Q280 286 295 289;M260 290 Q275 287 290 290" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M300 294 Q320 298 340 305" fill="none" stroke="#8ab8d0" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M300 294 Q320 298 340 305;M305 293 Q325 297 345 304;M300 294 Q320 298 340 305" dur="2.8s" repeatCount="indefinite" />
      </path>
      {/* Foam patches — white flecks where water churns over rocks */}
      <circle cx="270" cy="288" r="1.2" fill="#c0d8e0" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.35;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="295" cy="292" r="0.8" fill="#c0d8e0" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.3;0.18" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="325" cy="300" r="1" fill="#c0d8e0" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.28;0.15" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* Stream-bed rocks visible through water */}
      <circle cx="255" cy="291" r="2" fill="#3a3a38" opacity="0.12" />
      <circle cx="285" cy="289" r="1.5" fill="#3a3a38" opacity="0.1" />
      <circle cx="315" cy="296" r="1.8" fill="#3a3a38" opacity="0.1" />

      {/* === WOODEN BRIDGE — log bridge over the mountain stream === */}
      <g opacity="0.55">
        {/* Bridge deck — two main logs spanning the stream */}
        <path d="M296 286 Q308 284 320 290" fill="none" stroke="url(#ch13_bridgeWood)" strokeWidth="4" strokeLinecap="round" />
        <path d="M294 290 Q306 288 318 294" fill="none" stroke="url(#ch13_bridgeWood)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Cross-planks on top */}
        <line x1="298" y1="285" x2="296" y2="291" stroke="#5a4832" strokeWidth="0.8" opacity="0.5" />
        <line x1="303" y1="284" x2="301" y2="290" stroke="#5a4832" strokeWidth="0.8" opacity="0.45" />
        <line x1="308" y1="284" x2="306" y2="290" stroke="#5a4832" strokeWidth="0.8" opacity="0.45" />
        <line x1="313" y1="285" x2="311" y2="291" stroke="#5a4832" strokeWidth="0.8" opacity="0.4" />
        {/* Simple rail posts on one side */}
        <line x1="298" y1="285" x2="298" y2="280" stroke="#4a3828" strokeWidth="0.8" opacity="0.4" />
        <line x1="313" y1="285" x2="313" y2="280" stroke="#4a3828" strokeWidth="0.8" opacity="0.35" />
        {/* Rail connecting posts */}
        <path d="M298 280 Q305 279 313 280" fill="none" stroke="#4a3828" strokeWidth="0.6" opacity="0.35" />
      </g>

      {/* === MOUNTAIN STREAM crossing the road === */}
      <path d="M240 290 Q280 285 320 295 Q340 300 355 310"
        fill="none" stroke="#5a8aa0" strokeWidth="3" opacity="0.25" />
      <path d="M240 290 Q280 285 320 295 Q340 300 355 310"
        fill="none" stroke="#8ab0c8" strokeWidth="1" opacity="0.15" />
      {/* Stream highlights — water catching dawn light */}
      <circle cx="280" cy="287" r="1.5" fill="#a0c0d0" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="310" cy="293" r="1" fill="#a0c0d0" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.2;0.12" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* === MILESTONE STONE — "WIEN" distance marker on the roadside === */}
      <g opacity="0.55">
        {/* Stone body — weathered rectangular marker */}
        <path d="M355 320 L353 308 L359 307 L361 320 Z" fill="url(#ch13_milestone)" />
        {/* Stone top — slightly rounded */}
        <path d="M353 308 Q356 305 359 307" fill="#8a8580" opacity="0.5" />
        {/* Carved text — "WIEN" */}
        <text x="354" y="315" fontSize="3" fontFamily="serif" fill="#2a2520" opacity="0.45"
          transform="rotate(-2, 356, 314)">WIEN</text>
        {/* Distance number below */}
        <text x="354.5" y="318.5" fontSize="2.2" fontFamily="serif" fill="#2a2520" opacity="0.35"
          transform="rotate(-2, 356, 317)">48</text>
        {/* Lichen on the milestone */}
        <circle cx="354" cy="310" r="1" fill="#6a7a58" opacity="0.2" />
        <circle cx="359" cy="316" r="0.7" fill="#5a6a4a" opacity="0.18" />
      </g>

      {/* === WILDFLOWERS — spring blooming along the roadside === */}
      {/* Blue gentians */}
      <circle cx="275" cy="295" r="1.5" fill="#5070b0" opacity="0.4" />
      <circle cx="282" cy="300" r="1.2" fill="#5070b0" opacity="0.35" />
      <circle cx="350" cy="315" r="1.3" fill="#5070b0" opacity="0.35" />
      {/* Yellow buttercups */}
      <circle cx="290" cy="298" r="1" fill="#c0a040" opacity="0.4" />
      <circle cx="338" cy="310" r="1.2" fill="#c0a040" opacity="0.35" />
      <circle cx="365" cy="325" r="1" fill="#c0a040" opacity="0.3" />
      <circle cx="250" cy="288" r="0.8" fill="#c0a040" opacity="0.3" />
      {/* White edelweiss */}
      <circle cx="268" cy="292" r="1" fill="#c0c0b0" opacity="0.35" />
      <circle cx="345" cy="312" r="1.2" fill="#c0c0b0" opacity="0.3" />
      <circle cx="370" cy="330" r="0.8" fill="#c0c0b0" opacity="0.28" />
      {/* Right-side flowers */}
      <circle cx="550" cy="260" r="1.2" fill="#5070b0" opacity="0.3" />
      <circle cx="560" cy="265" r="1" fill="#c0a040" opacity="0.3" />
      <circle cx="570" cy="258" r="0.9" fill="#c0c0b0" opacity="0.25" />
      {/* Grass tufts near flowers */}
      <path d="M270 295 Q272 288 274 295" fill="none" stroke="#4a6a30" strokeWidth="0.6" opacity="0.3" />
      <path d="M340 312 Q342 305 344 312" fill="none" stroke="#4a6a30" strokeWidth="0.6" opacity="0.25" />

      {/* === ADDITIONAL WILDFLOWER CLUSTERS — more spring emergence === */}
      {/* Large roadside cluster near the stream */}
      <circle cx="256" cy="290" r="1.3" fill="#8050a0" opacity="0.3" />
      <circle cx="260" cy="293" r="1" fill="#c0a040" opacity="0.35" />
      <circle cx="264" cy="289" r="1.2" fill="#5070b0" opacity="0.35" />
      <circle cx="253" cy="286" r="0.9" fill="#c0c0b0" opacity="0.3" />
      <path d="M258 291 Q260 284 262 291" fill="none" stroke="#4a6a30" strokeWidth="0.5" opacity="0.25" />
      {/* Cluster further up the road — higher altitude, hardier flowers */}
      <circle cx="410" cy="235" r="1" fill="#c0a040" opacity="0.25" />
      <circle cx="415" cy="238" r="0.8" fill="#5070b0" opacity="0.25" />
      <circle cx="407" cy="240" r="0.9" fill="#c0c0b0" opacity="0.22" />
      <circle cx="418" cy="233" r="1.1" fill="#8050a0" opacity="0.2" />
      {/* Scattered pink alpine roses on the right slope */}
      <circle cx="575" cy="252" r="1.1" fill="#b05070" opacity="0.25" />
      <circle cx="582" cy="248" r="0.9" fill="#b05070" opacity="0.22" />
      <circle cx="590" cy="255" r="1" fill="#c0a040" opacity="0.25" />
      <circle cx="595" cy="250" r="0.8" fill="#5070b0" opacity="0.2" />
      <path d="M578 253 Q580 247 582 253" fill="none" stroke="#4a6a30" strokeWidth="0.5" opacity="0.2" />
      {/* Meadow patch flowers near the left slope */}
      <circle cx="110" cy="242" r="1.4" fill="#c0a040" opacity="0.3" />
      <circle cx="118" cy="238" r="1" fill="#5070b0" opacity="0.28" />
      <circle cx="105" cy="245" r="0.8" fill="#b05070" opacity="0.25" />
      <circle cx="125" cy="241" r="1.1" fill="#c0c0b0" opacity="0.25" />

      {/* === EVEN MORE SPRING WILDFLOWERS — dense alpine meadow patches === */}
      {/* Thick cluster near the stream bank */}
      <circle cx="242" cy="292" r="1.1" fill="#c0a040" opacity="0.32" />
      <circle cx="246" cy="289" r="0.9" fill="#b05070" opacity="0.28" />
      <circle cx="238" cy="295" r="1.3" fill="#5070b0" opacity="0.3" />
      <circle cx="248" cy="294" r="0.7" fill="#c0c0b0" opacity="0.26" />
      {/* Ridge meadow cluster — near the right slope edge */}
      <circle cx="650" cy="248" r="1.2" fill="#c0a040" opacity="0.25" />
      <circle cx="656" cy="244" r="1" fill="#5070b0" opacity="0.22" />
      <circle cx="645" cy="251" r="0.8" fill="#b05070" opacity="0.2" />
      <circle cx="660" cy="248" r="0.9" fill="#8050a0" opacity="0.2" />
      <path d="M648 249 Q650 243 652 249" fill="none" stroke="#4a6a30" strokeWidth="0.5" opacity="0.18" />
      {/* Scattered blooms on the lower road verge */}
      <circle cx="335" cy="330" r="1" fill="#c0a040" opacity="0.28" />
      <circle cx="342" cy="333" r="0.8" fill="#b05070" opacity="0.25" />
      <circle cx="330" cy="335" r="1.1" fill="#5070b0" opacity="0.25" />
      {/* High-altitude survivors near the pass */}
      <circle cx="455" cy="195" r="0.8" fill="#c0a040" opacity="0.18" />
      <circle cx="460" cy="192" r="0.6" fill="#c0c0b0" opacity="0.15" />
      <circle cx="450" cy="198" r="0.7" fill="#5070b0" opacity="0.15" />

      {/* === MORE WILDFLOWERS on the mountainside — scattered clusters === */}
      {/* Upper left slope cluster */}
      <circle cx="80" cy="222" r="1" fill="#c0a040" opacity="0.28" />
      <circle cx="84" cy="219" r="0.8" fill="#b05070" opacity="0.24" />
      <circle cx="88" cy="224" r="1.1" fill="#5070b0" opacity="0.26" />
      <circle cx="76" cy="225" r="0.7" fill="#c0c0b0" opacity="0.22" />
      <circle cx="92" cy="220" r="0.9" fill="#8050a0" opacity="0.2" />
      {/* Lower right verge */}
      <circle cx="545" cy="268" r="1" fill="#c0a040" opacity="0.25" />
      <circle cx="540" cy="272" r="0.8" fill="#b05070" opacity="0.22" />
      <circle cx="548" cy="274" r="1.1" fill="#5070b0" opacity="0.24" />
      <circle cx="535" cy="270" r="0.7" fill="#8050a0" opacity="0.2" />
      {/* Along the stream above the bridge */}
      <circle cx="232" cy="296" r="0.9" fill="#c0a040" opacity="0.28" />
      <circle cx="228" cy="298" r="1.1" fill="#5070b0" opacity="0.26" />
      <circle cx="235" cy="300" r="0.7" fill="#b05070" opacity="0.22" />

      {/* === MORNING DEW — glistening dots near wildflowers and grass === */}
      {/* Dew drops near the stream-side flowers — catching dawn light */}
      <circle cx="258" cy="293" r="0.4" fill="#e0e8f0" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="270" cy="296" r="0.35" fill="#e0e8f0" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.45;0.25" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="278" cy="299" r="0.3" fill="#e0e8f0" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.4;0.25" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="285" cy="301" r="0.4" fill="#e0e8f0" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.38;0.2" dur="2.8s" repeatCount="indefinite" />
      </circle>
      {/* Dew on the right-side meadow */}
      <circle cx="553" cy="262" r="0.35" fill="#e0e8f0" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.4;0.22" dur="3.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="568" cy="259" r="0.3" fill="#e0e8f0" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.35;0.2" dur="3.8s" repeatCount="indefinite" />
      </circle>
      {/* Dew on the foreground grass */}
      <circle cx="62" cy="339" r="0.4" fill="#e0e8f0" opacity="0.28">
        <animate attributeName="opacity" values="0.28;0.48;0.28" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="77" cy="334" r="0.35" fill="#e0e8f0" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.42;0.25" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="90" cy="337" r="0.3" fill="#e0e8f0" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.38;0.22" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {/* === BUTTERFLIES — tiny animated spring rebirth === */}
      {/* Butterfly 1 — near the roadside flower cluster */}
      <g opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0;4,-6;8,-2;4,4;0,0" dur="7s" repeatCount="indefinite" />
        {/* Left wing */}
        <path d="M272 284 Q270 280 274 281" fill="#c0a050" opacity="0.6" />
        {/* Right wing */}
        <path d="M274 281 Q278 280 276 284" fill="#c0a050" opacity="0.5" />
        {/* Body */}
        <line x1="274" y1="280" x2="274" y2="285" stroke="#3a3020" strokeWidth="0.3" opacity="0.5" />
      </g>
      {/* Butterfly 2 — near the right-slope flowers */}
      <g opacity="0.32">
        <animateTransform attributeName="transform" type="translate" values="0,0;-3,-5;-6,0;-3,5;0,0" dur="8.5s" repeatCount="indefinite" />
        <path d="M585 244 Q583 240 587 241" fill="#7080c0" opacity="0.5" />
        <path d="M587 241 Q591 240 589 244" fill="#7080c0" opacity="0.4" />
        <line x1="587" y1="240" x2="587" y2="245" stroke="#2a2540" strokeWidth="0.3" opacity="0.4" />
      </g>
      {/* Butterfly 3 — tiny, near the left meadow flowers */}
      <g opacity="0.28">
        <animateTransform attributeName="transform" type="translate" values="0,0;5,-4;2,-8;-3,-4;0,0" dur="9s" repeatCount="indefinite" />
        <path d="M115 234 Q113 231 116 232" fill="#c0c0b0" opacity="0.5" />
        <path d="M116 232 Q119 231 117 234" fill="#c0c0b0" opacity="0.4" />
        <line x1="116" y1="231" x2="116" y2="235" stroke="#3a3a30" strokeWidth="0.2" opacity="0.4" />
      </g>

      {/* === SUPPLY WAGON being pulled up the pass by oxen === */}
      <g opacity="0.55">
        {/* Wagon bed — wooden cart body */}
        <rect x="370" y="338" width="22" height="10" rx="1" fill="url(#ch13_wagonWood)" />
        {/* Wagon sides — raised boards */}
        <line x1="370" y1="338" x2="370" y2="334" stroke="#4a3828" strokeWidth="1" opacity="0.5" />
        <line x1="392" y1="338" x2="392" y2="334" stroke="#4a3828" strokeWidth="1" opacity="0.45" />
        <line x1="381" y1="338" x2="381" y2="335" stroke="#4a3828" strokeWidth="0.6" opacity="0.4" />
        {/* Side rail */}
        <path d="M370 334 Q381 333 392 334" fill="none" stroke="#4a3828" strokeWidth="0.7" opacity="0.4" />
        {/* Cargo — sacks and barrels piled on the wagon */}
        <ellipse cx="376" cy="336" rx="3" ry="2.5" fill="#4a4030" opacity="0.5" />
        <ellipse cx="383" cy="335" rx="2.5" ry="3" fill="#3a3828" opacity="0.45" />
        <rect x="388" y="335" width="3" height="4" rx="1" fill="#4a4030" opacity="0.4" />
        {/* Wagon wheels — two visible */}
        <circle cx="375" cy="348" r="4" fill="none" stroke="#3a3020" strokeWidth="1.2" opacity="0.5" />
        <circle cx="375" cy="348" r="0.8" fill="#3a3020" opacity="0.4" />
        <circle cx="389" cy="348" r="4" fill="none" stroke="#3a3020" strokeWidth="1.2" opacity="0.5" />
        <circle cx="389" cy="348" r="0.8" fill="#3a3020" opacity="0.4" />
        {/* Wheel spokes */}
        <line x1="375" y1="344" x2="375" y2="352" stroke="#3a3020" strokeWidth="0.4" opacity="0.35" />
        <line x1="371" y1="348" x2="379" y2="348" stroke="#3a3020" strokeWidth="0.4" opacity="0.35" />
        <line x1="389" y1="344" x2="389" y2="352" stroke="#3a3020" strokeWidth="0.4" opacity="0.35" />
        <line x1="385" y1="348" x2="393" y2="348" stroke="#3a3020" strokeWidth="0.4" opacity="0.35" />
        {/* Yoke and shaft — connecting to oxen */}
        <path d="M370 342 Q362 340 355 342" fill="none" stroke="#4a3828" strokeWidth="1.2" opacity="0.45" />
        <path d="M370 345 Q362 343 355 345" fill="none" stroke="#4a3828" strokeWidth="1" opacity="0.4" />
        {/* Ox 1 — front, pulling */}
        <path d="M340 340 Q345 335 352 336 Q358 335 362 340 L360 348 L342 348 Z" fill="#3a2a18" opacity="0.55" />
        {/* Ox head — lowered, straining */}
        <path d="M340 340 Q336 336 334 338 Q335 342 338 342 Z" fill="#3a2a18" opacity="0.55" />
        {/* Ox horns */}
        <path d="M335 336 Q333 333 335 334" fill="none" stroke="#5a5040" strokeWidth="0.6" opacity="0.4" />
        <path d="M336 335 Q334 332 336 333" fill="none" stroke="#5a5040" strokeWidth="0.6" opacity="0.4" />
        {/* Ox legs */}
        <line x1="344" y1="348" x2="343" y2="354" stroke="#3a2a18" strokeWidth="1.2" opacity="0.45" />
        <line x1="348" y1="348" x2="347" y2="354" stroke="#3a2a18" strokeWidth="1.2" opacity="0.45" />
        <line x1="355" y1="348" x2="354" y2="354" stroke="#3a2a18" strokeWidth="1.2" opacity="0.45" />
        <line x1="359" y1="348" x2="358" y2="354" stroke="#3a2a18" strokeWidth="1.2" opacity="0.45" />
        {/* Ox 2 — second animal beside the first */}
        <path d="M335 343 Q340 338 346 339 Q350 338 354 343 L352 348 L337 348 Z" fill="#4a3a28" opacity="0.4" />
        {/* Teamster walking alongside */}
        <path d="M365 350 Q363 344 365 340" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.4" />
        <circle cx="365" cy="338" r="2.5" fill="#151510" opacity="0.4" />
        {/* Whip held by teamster */}
        <path d="M367 340 Q370 335 374 330" fill="none" stroke="#2a2018" strokeWidth="0.4" opacity="0.3" />
      </g>

      {/* === ARMY COLUMN — soldiers marching toward the light === */}

      {/* Distant soldiers on the upper bend — tiny silhouettes */}
      <path d="M498 155 Q497 151 498 148" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.2" />
      <circle cx="498" cy="147" r="1.5" fill="#151510" opacity="0.2" />
      <path d="M505 157 Q504 153 505 150" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.18" />
      <circle cx="505" cy="149" r="1.5" fill="#151510" opacity="0.18" />
      <path d="M490 156 Q489 152 490 149" fill="none" stroke="#151510" strokeWidth="1.2" opacity="0.15" />
      <circle cx="490" cy="148" r="1.2" fill="#151510" opacity="0.15" />

      {/* Mid-distance soldiers on the road — flag bearer leads */}
      {/* Flag bearer */}
      <path d="M422 218 Q420 210 422 204 Q424 199 426 204 L428 218 Z"
        fill="#151510" opacity="0.65" />
      <circle cx="424" cy="199" r="3.5" fill="#151510" opacity="0.65" />
      {/* Flag pole and flag */}
      <line x1="428" y1="198" x2="428" y2="175" stroke="#2a2520" strokeWidth="1.2" opacity="0.5" />
      <path d="M428 175 L442 179 L442 188 L428 184 Z" fill="url(#ch13_flag)" opacity="0.45">
        <animate attributeName="d" values="M428 175 L442 179 L442 188 L428 184 Z;M428 175 L441 178 L443 187 L428 184 Z;M428 175 L442 179 L442 188 L428 184 Z" dur="3s" repeatCount="indefinite" />
      </path>

      {/* === LARGE TRICOLOUR FLAG catching wind at the head of the column === */}
      <g opacity="0.6">
        {/* Tall flag pole */}
        <line x1="430" y1="200" x2="430" y2="162" stroke="#3a3020" strokeWidth="1.5" opacity="0.55" />
        {/* Pole finial — eagle ornament */}
        <circle cx="430" cy="161" r="1.5" fill="#c0a050" opacity="0.4" />
        <path d="M428.5 161 Q430 158 431.5 161" fill="#c0a050" opacity="0.35" />
        {/* Large flag — billowing in alpine wind */}
        <path d="M430 163 L452 167 L454 180 L430 176 Z" fill="url(#ch13_flagLarge)" opacity="0.5">
          <animate attributeName="d" values="M430 163 L452 167 L454 180 L430 176 Z;M430 163 L450 166 L456 179 L430 176 Z;M430 163 L451 168 L453 181 L430 176 Z;M430 163 L452 167 L454 180 L430 176 Z" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Flag shadow/depth — darker underside */}
        <path d="M430 176 L452 180 L454 183 L430 179 Z" fill="#1a1510" opacity="0.1">
          <animate attributeName="d" values="M430 176 L452 180 L454 183 L430 179 Z;M430 176 L450 179 L456 182 L430 179 Z;M430 176 L451 181 L453 184 L430 179 Z;M430 176 L452 180 L454 183 L430 179 Z" dur="4s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Soldiers near the flag bearer */}
      <path d="M414 224 Q412 216 414 210 Q416 205 418 210 L420 224 Z"
        fill="#151510" opacity="0.6" />
      <circle cx="416" cy="205" r="3.2" fill="#151510" opacity="0.6" />
      {/* Musket on shoulder */}
      <line x1="420" y1="206" x2="424" y2="192" stroke="#151510" strokeWidth="0.8" opacity="0.4" />

      <path d="M432 222 Q430 214 432 208 Q434 203 436 208 L438 222 Z"
        fill="#151510" opacity="0.58" />
      <circle cx="434" cy="203" r="3" fill="#151510" opacity="0.58" />

      {/* === SINGING SOLDIERS — mouths open, animated slightly === */}
      {/* Singing soldier 1 — mid-column, head tilted up */}
      <g opacity="0.62">
        <path d="M408 230 Q406 222 408 216 Q410 211 412 216 L414 230 Z" fill="#151510" />
        <circle cx="410" cy="211" r="3.2" fill="#151510" />
        {/* Open mouth — singing */}
        <ellipse cx="408" cy="213" rx="1" ry="0.6" fill="#3a2020" opacity="0.6">
          <animate attributeName="ry" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Pack */}
        <rect x="412" y="216" width="4" height="4" rx="0.5" fill="#1a1a18" opacity="0.4" />
      </g>
      {/* Singing soldier 2 — further back, arm raised */}
      <g opacity="0.56">
        <path d="M392 260 Q390 252 392 246 Q394 241 396 246 L398 260 Z" fill="#151510" />
        <circle cx="394" cy="241" r="3" fill="#151510" />
        {/* Open mouth — singing */}
        <ellipse cx="392" cy="243" rx="0.9" ry="0.5" fill="#3a2020" opacity="0.55">
          <animate attributeName="ry" values="0.5;0.9;0.5" dur="2.3s" repeatCount="indefinite" />
        </ellipse>
        {/* Raised arm — keeping time */}
        <path d="M396 244 Q399 240 400 236" fill="none" stroke="#151510" strokeWidth="1" opacity="0.5">
          <animate attributeName="d" values="M396 244 Q399 240 400 236;M396 244 Q399 239 401 235;M396 244 Q399 240 400 236" dur="2.3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Singing soldier 3 — near the front, head up toward the dawn */}
      <g opacity="0.58">
        <path d="M420 226 Q418 218 420 212 Q422 207 424 212 L426 226 Z" fill="#151510" />
        <circle cx="422" cy="207" r="3" fill="#151510" />
        {/* Open mouth */}
        <ellipse cx="420" cy="209" rx="0.8" ry="0.5" fill="#3a2020" opacity="0.5">
          <animate attributeName="ry" values="0.5;0.85;0.5" dur="1.8s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* === SOLDIER POINTING toward the distant Vienna horizon === */}
      <g opacity="0.6">
        {/* Body */}
        <path d="M445 218 Q443 210 445 204 Q447 199 449 204 L451 218 Z" fill="#151510" />
        {/* Head — turned toward the horizon */}
        <circle cx="447" cy="199" r="3.5" fill="#151510" />
        {/* Pointing arm — extended toward the pass gap / Vienna */}
        <path d="M449 205 Q455 198 462 194" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.6" />
        {/* Pointing hand — finger extended */}
        <path d="M462 194 Q464 193 466 192" fill="none" stroke="#151510" strokeWidth="0.8" opacity="0.5" />
        {/* Other arm at side */}
        <path d="M445 206 Q442 212 443 218" fill="none" stroke="#151510" strokeWidth="1" opacity="0.4" />
        {/* Pack on back */}
        <rect x="449" y="204" width="4" height="5" rx="0.8" fill="#1a1a18" opacity="0.4" />
      </g>

      {/* === PACK MULE — carrying supplies in the column === */}
      <g opacity="0.55">
        {/* Mule body — stocky, lower than soldiers */}
        <path d="M442 232 Q446 226 452 227 Q458 226 462 232 L460 238 L444 238 Z"
          fill="#2a2520" />
        {/* Head — extended forward */}
        <path d="M462 232 Q466 228 468 230 Q467 233 464 234 Z" fill="#2a2520" />
        {/* Ears */}
        <path d="M466 228 Q467 224 468 228" fill="none" stroke="#2a2520" strokeWidth="0.8" />
        <path d="M468 228 Q469 224 470 228" fill="none" stroke="#2a2520" strokeWidth="0.6" />
        {/* Legs */}
        <line x1="446" y1="238" x2="445" y2="244" stroke="#2a2520" strokeWidth="1.2" />
        <line x1="450" y1="238" x2="449" y2="244" stroke="#2a2520" strokeWidth="1.2" />
        <line x1="456" y1="238" x2="455" y2="244" stroke="#2a2520" strokeWidth="1.2" />
        <line x1="460" y1="238" x2="459" y2="244" stroke="#2a2520" strokeWidth="1.2" />
        {/* Supply packs — bundles on each side */}
        <rect x="445" y="226" width="7" height="5" rx="1" fill="#3a3028" opacity="0.7" />
        <rect x="454" y="227" width="6" height="4" rx="1" fill="#3a3528" opacity="0.65" />
        {/* Rope/binding across the packs */}
        <path d="M445 229 Q452 226 460 229" fill="none" stroke="#5a5040" strokeWidth="0.5" opacity="0.5" />
        {/* Handler walking alongside (simple figure) */}
        <path d="M440 240 Q438 234 440 230" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.45" />
        <circle cx="440" cy="228" r="2.5" fill="#151510" opacity="0.45" />
        {/* Lead rope */}
        <path d="M442 232 Q441 231 440 230" fill="none" stroke="#4a4030" strokeWidth="0.5" opacity="0.35" />
      </g>

      {/* === PRAYING SOLDIER — kneeling aside from the column, touching a rosary === */}
      <g opacity="0.52">
        {/* Kneeling body — off the road to the left, facing the dawn */}
        <path d="M265 268 Q263 262 265 258 Q267 254 269 258 L270 265 Q269 268 268 272 Z"
          fill="#151510" />
        {/* Head — bowed slightly */}
        <circle cx="267" cy="254" r="3" fill="#151510" />
        {/* Kneeling leg — bent underneath */}
        <path d="M264 272 Q260 272 258 270" fill="none" stroke="#151510" strokeWidth="1.5" />
        {/* Forward knee on ground */}
        <path d="M268 272 Q272 274 270 275" fill="none" stroke="#151510" strokeWidth="1.2" />
        {/* Arms — brought together in prayer at chest */}
        <path d="M265 259 Q263 256 265 254" fill="none" stroke="#151510" strokeWidth="1" opacity="0.8" />
        <path d="M269 259 Q271 256 269 254" fill="none" stroke="#151510" strokeWidth="1" opacity="0.8" />
        {/* Rosary/cross — tiny cross hanging from clasped hands */}
        <line x1="267" y1="258" x2="267" y2="261" stroke="#8a7860" strokeWidth="0.5" opacity="0.5" />
        <line x1="266" y1="259.5" x2="268" y2="259.5" stroke="#8a7860" strokeWidth="0.5" opacity="0.5" />
        {/* Rosary beads — tiny dots along a string */}
        <circle cx="266.5" cy="257" r="0.3" fill="#8a7860" opacity="0.35" />
        <circle cx="266" cy="256" r="0.3" fill="#8a7860" opacity="0.3" />
        <circle cx="265.5" cy="255" r="0.3" fill="#8a7860" opacity="0.3" />
        {/* Musket laid on ground beside him */}
        <line x1="258" y1="274" x2="276" y2="272" stroke="#1a1a18" strokeWidth="0.8" opacity="0.35" />
        {/* Pack set down */}
        <rect x="257" y="269" width="4" height="3" rx="0.5" fill="#1a1a18" opacity="0.3" />
      </g>

      {/* === WOUNDED SOLDIER ON HORSE — being led through the column === */}
      <g opacity="0.58">
        {/* Horse body */}
        <path d="M395 295 Q400 288 407 289 Q414 288 418 295 L416 302 L397 302 Z"
          fill="#1a1818" />
        {/* Horse head — lowered, tired */}
        <path d="M418 295 Q422 290 424 293 Q423 297 420 298 Z" fill="#1a1818" />
        {/* Horse ears */}
        <path d="M422 290 Q423 287 424 290" fill="none" stroke="#1a1818" strokeWidth="0.6" />
        {/* Horse legs */}
        <line x1="399" y1="302" x2="398" y2="310" stroke="#1a1818" strokeWidth="1.4" />
        <line x1="404" y1="302" x2="403" y2="310" stroke="#1a1818" strokeWidth="1.4" />
        <line x1="412" y1="302" x2="411" y2="310" stroke="#1a1818" strokeWidth="1.4" />
        <line x1="416" y1="302" x2="415" y2="310" stroke="#1a1818" strokeWidth="1.4" />
        {/* Horse tail */}
        <path d="M395 295 Q392 298 393 303" fill="none" stroke="#1a1818" strokeWidth="0.8" />
        {/* Wounded soldier — slumped forward on horse */}
        <path d="M405 290 Q403 284 407 280 Q410 278 412 282 L413 290 Z"
          fill="#151510" opacity="0.7" />
        <circle cx="408" cy="277" r="3" fill="#151510" opacity="0.7" />
        {/* Bandaged arm/sling — white wrap visible */}
        <path d="M403 283 Q401 286 403 288" fill="none" stroke="#8a8878" strokeWidth="1.2" opacity="0.4" />
        {/* Soldier leading the horse */}
        <path d="M425 305 Q423 298 425 293" fill="none" stroke="#151510" strokeWidth="1.5" opacity="0.5" />
        <circle cx="425" cy="291" r="3" fill="#151510" opacity="0.5" />
        {/* Lead rein */}
        <path d="M424 293 Q422 295 420 298" fill="none" stroke="#3a3520" strokeWidth="0.6" opacity="0.35" />
      </g>

      {/* Main group — closer, more detailed */}
      {/* Soldier 1 — striding forward */}
      <path d="M385 278 Q383 268 385 260 Q387 254 389 260 L391 278 Q390 286 389 292 L385 292 Z"
        fill="#151510" opacity="0.75" />
      <circle cx="387" cy="254" r="4.5" fill="#151510" opacity="0.75" />
      {/* Pack on back */}
      <rect x="389" y="260" width="5" height="6" rx="1" fill="#1a1a18" opacity="0.5" />
      {/* Musket */}
      <line x1="381" y1="256" x2="378" y2="292" stroke="#151510" strokeWidth="1" opacity="0.5" />

      {/* Warming breath — visible breath cloud on closest soldiers (cold altitude) */}
      <ellipse cx="380" cy="252" rx="4" ry="1.8" fill="#a0b0c0" opacity="0.08">
        <animate attributeName="rx" values="4;6;4" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.03;0.08" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="380;377;380" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Soldier 2 */}
      <path d="M398 272 Q396 262 398 254 Q400 249 402 254 L404 272 Q403 280 402 286 L398 286 Z"
        fill="#151510" opacity="0.72" />
      <circle cx="400" cy="249" r="4.2" fill="#151510" opacity="0.72" />
      <line x1="405" y1="250" x2="408" y2="236" stroke="#151510" strokeWidth="0.8" opacity="0.45" />
      <rect x="402" y="254" width="4" height="5" rx="1" fill="#1a1a18" opacity="0.45" />

      {/* Warming breath — Soldier 2 */}
      <ellipse cx="394" cy="247" rx="3.5" ry="1.5" fill="#a0b0c0" opacity="0.07">
        <animate attributeName="rx" values="3.5;5.5;3.5" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.02;0.07" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="394;391;394" dur="4.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Soldiers further back along the road */}
      <path d="M370 310 Q368 302 370 296 Q372 291 374 296 L376 310 Z"
        fill="#151510" opacity="0.65" />
      <circle cx="372" cy="291" r="3.8" fill="#151510" opacity="0.65" />

      {/* Warming breath — Soldier further back */}
      <ellipse cx="367" cy="289" rx="3" ry="1.2" fill="#a0b0c0" opacity="0.06">
        <animate attributeName="rx" values="3;4.5;3" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="5s" repeatCount="indefinite" />
      </ellipse>

      <path d="M358 335 Q356 327 358 320 Q360 315 362 320 L364 335 Z"
        fill="#151510" opacity="0.6" />
      <circle cx="360" cy="315" r="3.5" fill="#151510" opacity="0.6" />

      {/* Rearguard — disappearing around the lower bend */}
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={`rear${i}`}>
          <path d={`M${345 - i * 8} ${358 + i * 12} Q${343 - i * 8} ${352 + i * 12} ${345 - i * 8} ${348 + i * 12}`}
            fill="none" stroke="#151510" strokeWidth="1.8" opacity={0.5 - i * 0.1} />
          <circle cx={345 - i * 8} cy={346 + i * 12} r={3 - i * 0.4}
            fill="#151510" opacity={0.5 - i * 0.1} />
        </React.Fragment>
      ))}

      {/* === EAGLES / BIRDS soaring in the golden sky === */}
      {/* Large eagle — soaring near the light */}
      <path d="M360 85 Q370 75 380 82 Q390 75 400 85" fill="none" stroke="#2a2a35" strokeWidth="1.2" opacity="0.35">
        <animate attributeName="d" values="M360 85 Q370 75 380 82 Q390 75 400 85;M362 84 Q370 78 380 82 Q390 78 398 84;M360 85 Q370 75 380 82 Q390 75 400 85" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Second eagle — higher, smaller */}
      <path d="M440 60 Q447 53 454 58 Q461 53 468 60" fill="none" stroke="#2a2a35" strokeWidth="0.9" opacity="0.28">
        <animate attributeName="d" values="M440 60 Q447 53 454 58 Q461 53 468 60;M442 59 Q447 55 454 58 Q461 55 466 59;M440 60 Q447 53 454 58 Q461 53 468 60" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* Third eagle — distant, circling */}
      <path d="M490 95 Q495 90 500 93 Q505 90 510 95" fill="none" stroke="#3a3a48" strokeWidth="0.7" opacity="0.22" />

      {/* Small birds — swallows or sparrows */}
      <path d="M320 105 Q324 101 328 104 Q332 101 336 105" fill="none" stroke="#3a3a48" strokeWidth="0.5" opacity="0.18" />
      <path d="M345 115 Q348 112 351 114 Q354 112 357 115" fill="none" stroke="#3a3a48" strokeWidth="0.5" opacity="0.15" />

      {/* === FOREGROUND DETAILS === */}
      {/* Rocky outcrop in lower-left foreground */}
      <path d="M0 340 Q20 320 50 325 Q80 315 100 330 L100 400 L0 400 Z"
        fill="#2a2a28" opacity="0.6" />

      {/* === LICHEN ON ROCKS — green-grey patches on foreground boulders === */}
      <ellipse cx="35" cy="328" rx="4" ry="2" fill="#5a6a4a" opacity="0.15" />
      <ellipse cx="58" cy="322" rx="3" ry="1.5" fill="#6a7a58" opacity="0.12" />
      <ellipse cx="78" cy="320" rx="3.5" ry="1.8" fill="#5a6a4a" opacity="0.13" />
      <ellipse cx="48" cy="335" rx="2.5" ry="1.2" fill="#6a7858" opacity="0.1" />
      {/* Lichen on the closer slope rocks (right side) */}
      <ellipse cx="558" cy="248" rx="3" ry="1.5" fill="#5a6a4a" opacity="0.1" />
      <ellipse cx="680" cy="224" rx="3.5" ry="1.8" fill="#6a7a58" opacity="0.08" />
      <ellipse cx="710" cy="232" rx="2.5" ry="1.2" fill="#5a6a4a" opacity="0.09" />

      {/* Foreground grass with wind animation */}
      <path d="M60 340 Q62 330 64 340" fill="none" stroke="#3a5a28" strokeWidth="0.8" opacity="0.35">
        <animate attributeName="d" values="M60 340 Q62 330 64 340;M60 340 Q63 331 65 340;M60 340 Q62 330 64 340" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M75 335 Q77 325 79 335" fill="none" stroke="#3a5a28" strokeWidth="0.7" opacity="0.3">
        <animate attributeName="d" values="M75 335 Q77 325 79 335;M75 335 Q78 326 80 335;M75 335 Q77 325 79 335" dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M88 338 Q90 329 92 338" fill="none" stroke="#3a5a28" strokeWidth="0.7" opacity="0.3">
        <animate attributeName="d" values="M88 338 Q90 329 92 338;M88 338 Q91 330 93 338;M88 338 Q90 329 92 338" dur="4.5s" repeatCount="indefinite" />
      </path>

      {/* Foreground flowers near the viewer */}
      <circle cx="55" cy="342" r="1.8" fill="#5070b0" opacity="0.4" />
      <circle cx="70" cy="338" r="1.5" fill="#c0a040" opacity="0.4" />
      <circle cx="85" cy="340" r="1.3" fill="#c0c0b0" opacity="0.35" />
      <circle cx="95" cy="335" r="1" fill="#5070b0" opacity="0.3" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Golden dawn warmth across the whole scene */}
      <rect width="800" height="400" fill="#c09050" opacity="0.04" />

      {/* Gentle golden haze in the middle distance */}
      <ellipse cx="400" cy="185" rx="200" ry="30" fill="#c0a050" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="8s" repeatCount="indefinite" />
      </ellipse>

      {/* Vignette — warm golden tint */}
      <rect width="800" height="400" fill="url(#ch13_vignette)" />

      {/* Bottom edge darkening */}
      <rect x="0" y="382" width="800" height="18" fill="#0a0808" opacity="0.3" />
      {/* Top edge — night still lingering */}
      <rect x="0" y="0" width="800" height="15" fill="#060810" opacity="0.25" />
    </svg>
  );
}
