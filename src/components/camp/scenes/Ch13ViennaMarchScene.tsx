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
          <stop offset="8%" stopColor="#101828" />
          <stop offset="18%" stopColor="#162040" />
          <stop offset="30%" stopColor="#223058" />
          <stop offset="42%" stopColor="#3a4068" />
          <stop offset="52%" stopColor="#5a4a68" />
          <stop offset="62%" stopColor="#7a5565" />
          <stop offset="72%" stopColor="#a06058" />
          <stop offset="80%" stopColor="#c07050" />
          <stop offset="87%" stopColor="#d88848" />
          <stop offset="93%" stopColor="#e8a045" />
          <stop offset="100%" stopColor="#f0b048" />
        </linearGradient>

        {/* Dawn radiance — golden light flooding through the pass */}
        <radialGradient id="ch13_dawnGlow" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0%" stopColor="#f0d070" stopOpacity="0.5" />
          <stop offset="15%" stopColor="#e8b858" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#d0a050" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#c09048" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a07838" stopOpacity="0" />
        </radialGradient>

        {/* Secondary glow — wider, softer */}
        <radialGradient id="ch13_dawnWide" cx="0.5" cy="0.48" r="0.7">
          <stop offset="0%" stopColor="#e0b058" stopOpacity="0.1" />
          <stop offset="40%" stopColor="#c09048" stopOpacity="0.05" />
          <stop offset="70%" stopColor="#a08040" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#806030" stopOpacity="0" />
        </radialGradient>

        {/* Pink dawn band — rose tones above horizon */}
        <linearGradient id="ch13_pinkBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c06070" stopOpacity="0" />
          <stop offset="60%" stopColor="#d07068" stopOpacity="0.12" />
          <stop offset="80%" stopColor="#e08060" stopOpacity="0.18" />
          <stop offset="95%" stopColor="#d07050" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c06040" stopOpacity="0" />
        </linearGradient>

        {/* Distant mountain range — atmospheric blue-purple for depth */}
        <linearGradient id="ch13_farMountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a68" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#3a3a58" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2a48" stopOpacity="0.3" />
        </linearGradient>

        {/* Very distant range — pale haze */}
        <linearGradient id="ch13_veryFarMountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a5a70" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5a4a60" stopOpacity="0.2" />
        </linearGradient>

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

        {/* Stone bridge arch */}
        <linearGradient id="ch13_stoneBridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a6558" />
          <stop offset="50%" stopColor="#4a4840" />
          <stop offset="100%" stopColor="#3a3830" />
        </linearGradient>

        {/* Waterfall mist */}
        <radialGradient id="ch13_waterfallMist" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#b8d0e0" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#90b0c8" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#6a90a8" stopOpacity="0" />
        </radialGradient>

        {/* Cannon barrel metal */}
        <linearGradient id="ch13_cannonMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>

        {/* Moss green patches */}
        <radialGradient id="ch13_moss" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4a6a30" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3a5a20" stopOpacity="0.15" />
        </radialGradient>

        {/* Eagle gold */}
        <linearGradient id="ch13_eagleGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0c060" />
          <stop offset="50%" stopColor="#c0a040" />
          <stop offset="100%" stopColor="#a08030" />
        </linearGradient>

        {/* Foreground mountain stream */}
        <linearGradient id="ch13_fgStream" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#4a8aaa" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#6aaac8" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#7abbd8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4a8aaa" stopOpacity="0.15" />
        </linearGradient>

        {/* Waterfall cascade white */}
        <linearGradient id="ch13_cascade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0e0f0" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#b0c8d8" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#8ab0c8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6a90a8" stopOpacity="0" />
        </linearGradient>

        {/* Cavalry horse */}
        <linearGradient id="ch13_cavalryHorse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2818" />
          <stop offset="100%" stopColor="#2a1a10" />
        </linearGradient>

      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch13_sky)" />
      <rect width="800" height="400" fill="url(#ch13_pinkBand)" />
      <rect width="800" height="400" fill="url(#ch13_dawnGlow)" />
      <rect width="800" height="400" fill="url(#ch13_dawnWide)" />

      {/* Clearing sky patches — dawn blue breaking through clouds */}
      <ellipse cx="150" cy="68" rx="40" ry="10" fill="#283858" opacity="0.12" />
      <ellipse cx="650" cy="58" rx="35" ry="8" fill="#283858" opacity="0.1" />
      <ellipse cx="400" cy="48" rx="25" ry="6" fill="#2a3a5a" opacity="0.08" />

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
      {/* More fading stars */}
      <circle cx="340" cy="25" r="0.6" fill="#a0a8c0" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.06;0.22" dur="6.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="460" cy="18" r="0.7" fill="#b0b8d0" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="7.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="750" cy="28" r="0.6" fill="#a0a8c0" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.04;0.18" dur="8.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="85" cy="30" r="0.5" fill="#a0a8c0" opacity="0.15" />
      <circle cx="640" cy="20" r="0.6" fill="#b0b8d0" opacity="0.16" />

      {/* Golden-edged clouds — illuminated by the sunrise */}
      <ellipse cx="220" cy="50" rx="90" ry="12" fill="url(#ch13_cloud)">
        <animate attributeName="cx" values="220;228;220" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="580" cy="42" rx="70" ry="9" fill="url(#ch13_cloud)">
        <animate attributeName="cx" values="580;572;580" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="65" rx="50" ry="7" fill="url(#ch13_cloud)" opacity="0.6" />
      {/* Cloud golden edges */}
      <ellipse cx="220" cy="55" rx="85" ry="4" fill="#d0a850" opacity="0.1" />
      <ellipse cx="580" cy="46" rx="65" ry="3" fill="#d0a850" opacity="0.08" />
      {/* Breaking clouds — parting to reveal brighter sky behind */}
      <ellipse cx="100" cy="72" rx="50" ry="8" fill="url(#ch13_cloud)" opacity="0.25">
        <animate attributeName="cx" values="100;90;100" dur="28s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="62" rx="45" ry="7" fill="url(#ch13_cloud)" opacity="0.22">
        <animate attributeName="cx" values="700;710;700" dur="24s" repeatCount="indefinite" />
      </ellipse>
      {/* Thin high cirrus wisps — catching pink dawn light */}
      <path d="M50 35 Q120 30 200 38 Q280 32 350 36" fill="none" stroke="#a07060" strokeWidth="0.6" opacity="0.08" />
      <path d="M450 28 Q520 24 600 30 Q670 25 750 32" fill="none" stroke="#a07060" strokeWidth="0.5" opacity="0.07" />

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

      {/* Additional light shafts — more rays at various angles */}
      <polygon points="400,135 290,0 320,0" fill="url(#ch13_beam)" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.35;0.25" dur="8s" repeatCount="indefinite" />
      </polygon>
      <polygon points="400,135 470,0 500,0" fill="url(#ch13_beam)" opacity="0.28">
        <animate attributeName="opacity" values="0.28;0.38;0.28" dur="7.5s" repeatCount="indefinite" />
      </polygon>
      <polygon points="400,135 360,0 390,0" fill="url(#ch13_beam)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.52;0.4" dur="6.5s" repeatCount="indefinite" />
      </polygon>

      {/* Dust motes in light beams — particles floating in the rays */}
      <circle cx="370" cy="90" r="0.4" fill="#d0b060" opacity="0.25">
        <animate attributeName="cy" values="90;140;90" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.08;0.25" dur="12s" repeatCount="indefinite" />
      </circle>
      <circle cx="390" cy="105" r="0.3" fill="#e0c070" opacity="0.22">
        <animate attributeName="cy" values="105;155;105" dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.22;0.06;0.22" dur="14s" repeatCount="indefinite" />
      </circle>
      <circle cx="410" cy="95" r="0.35" fill="#d0b060" opacity="0.2">
        <animate attributeName="cy" values="95;145;95" dur="13s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="13s" repeatCount="indefinite" />
      </circle>
      <circle cx="430" cy="110" r="0.3" fill="#c0a050" opacity="0.18">
        <animate attributeName="cy" values="110;160;110" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0.04;0.18" dur="15s" repeatCount="indefinite" />
      </circle>

      {/* Lens-flare highlight at the sunrise point */}
      <circle cx="400" cy="135" r="25" fill="#e0c060" opacity="0.15">
        <animate attributeName="r" values="25;32;25" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="135" r="18" fill="#e8c860" opacity="0.22">
        <animate attributeName="r" values="18;22;18" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.22;0.32;0.22" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="135" r="8" fill="#f0d870" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.5;0.35" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="135" r="3" fill="#f8e880" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
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

      {/* === FLOCK OF SWALLOWS — small group wheeling in the dawn light === */}
      <g opacity="0.25">
        <animateTransform attributeName="transform" type="translate" values="0,0;15,-4;30,2;15,6;0,0" dur="12s" repeatCount="indefinite" />
        <path d="M300 55 Q303 52 306 54 Q309 52 312 55" fill="none" stroke="#1a1a28" strokeWidth="0.6" />
        <path d="M308 58 Q311 55 314 57 Q317 55 320 58" fill="none" stroke="#1a1a28" strokeWidth="0.5" />
        <path d="M295 60 Q298 57 301 59 Q304 57 307 60" fill="none" stroke="#1a1a28" strokeWidth="0.5" />
        <path d="M315 53 Q317 51 319 52 Q321 51 323 53" fill="none" stroke="#1a1a28" strokeWidth="0.4" />
        <path d="M288 57 Q290 55 292 56 Q294 55 296 57" fill="none" stroke="#1a1a28" strokeWidth="0.4" />
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

      {/* === VERY DISTANT MOUNTAIN RANGE — pale silhouette for depth === */}
      <path d="M0 135 Q50 115 100 120 Q150 105 200 112 Q250 100 300 108 Q350 95 400 100 Q450 95 500 108 Q550 100 600 112 Q650 105 700 115 Q750 108 800 125 L800 160 L0 160 Z"
        fill="url(#ch13_veryFarMountain)" />

      {/* === FAR DISTANT RANGE — layered for atmospheric perspective === */}
      <path d="M0 145 Q40 125 80 132 Q130 112 180 120 Q220 108 270 118 Q320 105 370 115 Q410 108 440 112 Q480 105 530 118 Q580 108 630 120 Q680 112 730 125 Q770 118 800 135 L800 175 L0 175 Z"
        fill="url(#ch13_farMountain)" />
      {/* Haze layer between ranges — atmospheric depth */}
      <rect x="0" y="120" width="800" height="40" fill="#6a5a68" opacity="0.05" />

      {/* === ALPINE PEAKS — LEFT MASSIF === */}
      {/* Far left peak — towering, shadowed */}
      <path d="M0 90 Q30 40 70 60 Q110 20 150 55 Q180 70 200 100 L200 240 L0 240 Z"
        fill="url(#ch13_rock)" opacity="0.85" />
      {/* Rock face texture — vertical striations and cliff features */}
      <path d="M40 50 Q42 70 38 95 Q40 120 36 155" fill="none" stroke="#2a2a30" strokeWidth="0.6" opacity="0.2" />
      <path d="M75 65 Q77 85 75 110 Q73 135 76 165" fill="none" stroke="#1a1a20" strokeWidth="0.5" opacity="0.18" />
      <path d="M125 30 Q127 50 124 80 Q126 110 122 145" fill="none" stroke="#2a2a30" strokeWidth="0.7" opacity="0.22" />
      <path d="M165 65 Q167 90 165 120 Q163 150 166 185" fill="none" stroke="#1a1a20" strokeWidth="0.6" opacity="0.2" />
      {/* Weathered ledges — horizontal stratification */}
      <path d="M15 115 Q45 112 85 118 Q125 115 165 120" fill="none" stroke="#3a3a40" strokeWidth="0.5" opacity="0.15" />
      <path d="M8 165 Q38 162 78 168 Q118 165 158 170" fill="none" stroke="#3a3a40" strokeWidth="0.4" opacity="0.12" />
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
      {/* Mid-left peak texture — rock features */}
      <path d="M175 85 Q177 105 175 130 Q173 160 176 195" fill="none" stroke="#3a3530" strokeWidth="0.6" opacity="0.18" />
      <path d="M225 95 Q227 120 225 150 Q223 185 226 220" fill="none" stroke="#4a4538" strokeWidth="0.5" opacity="0.16" />
      <path d="M265 115 Q267 140 265 170 Q263 205 266 240" fill="none" stroke="#3a3530" strokeWidth="0.6" opacity="0.17" />
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
      {/* Rock face texture — vertical cliffs and striations (dawn-lit side) */}
      <path d="M655 45 Q657 65 655 90 Q653 120 656 155" fill="none" stroke="#4a4a50" strokeWidth="0.6" opacity="0.15" />
      <path d="M705 25 Q707 50 705 80 Q703 115 706 150" fill="none" stroke="#3a3a40" strokeWidth="0.7" opacity="0.18" />
      <path d="M750 22 Q752 45 750 75 Q748 110 751 145" fill="none" stroke="#4a4a48" strokeWidth="0.6" opacity="0.16" />
      <path d="M780 50 Q782 75 780 105 Q778 140 781 180" fill="none" stroke="#3a3a40" strokeWidth="0.5" opacity="0.14" />
      {/* Weathered ledges catching dawn light */}
      <path d="M615 125 Q655 122 695 128 Q735 125 775 130" fill="none" stroke="#5a5a58" strokeWidth="0.5" opacity="0.12" />
      <path d="M608 175 Q648 172 688 178 Q728 175 768 180" fill="none" stroke="#4a4a48" strokeWidth="0.4" opacity="0.1" />
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
      {/* Mid-right peak texture — catching dawn light */}
      <path d="M555 100 Q557 125 555 155 Q553 190 556 225" fill="none" stroke="#5a5548" strokeWidth="0.6" opacity="0.15" />
      <path d="M605 95 Q607 120 605 150 Q603 185 606 220" fill="none" stroke="#4a4538" strokeWidth="0.7" opacity="0.17" />
      <path d="M660 115 Q662 140 660 170 Q658 205 661 240" fill="none" stroke="#5a5548" strokeWidth="0.6" opacity="0.16" />
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
      {/* Bright golden horizon glow at the base of the gap */}
      <ellipse cx="400" cy="145" rx="80" ry="15" fill="#e8b848" opacity="0.1" />
      {/* Green valley visible through the gap */}
      <path d="M310 160 Q350 140 400 135 Q450 140 500 165 L500 220 L310 220 Z"
        fill="url(#ch13_meadow)" opacity="0.35" />
      {/* Distant rolling hills through the gap — multiple layers */}
      <path d="M330 165 Q365 155 400 152 Q435 155 470 165 L470 180 L330 180 Z"
        fill="#3a5a28" opacity="0.15" />
      <path d="M320 170 Q360 162 400 158 Q440 162 480 170 L480 195 L320 195 Z"
        fill="#2a4a20" opacity="0.2" />
      {/* Patchwork fields in the valley — cultivated land */}
      <rect x="370" y="172" width="8" height="5" fill="#3a6a28" opacity="0.08" transform="rotate(-5, 374, 174)" />
      <rect x="385" y="174" width="6" height="4" fill="#4a5a28" opacity="0.07" transform="rotate(3, 388, 176)" />
      <rect x="400" y="172" width="7" height="5" fill="#3a5a20" opacity="0.08" transform="rotate(-2, 403, 174)" />

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
      {/* Spring-green tips on pines — new growth */}
      <circle cx="56" cy="176" r="1" fill="#6aaa40" opacity="0.2" />
      <circle cx="82" cy="170" r="0.8" fill="#6aaa40" opacity="0.18" />
      <circle cx="110" cy="190" r="0.9" fill="#6aaa40" opacity="0.17" />
      <circle cx="570" cy="173" r="0.8" fill="#6aaa40" opacity="0.16" />
      <circle cx="600" cy="178" r="0.9" fill="#6aaa40" opacity="0.15" />

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
      {/* Bird 5 — songbird rising from meadow */}
      <g opacity="0.24">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,-12;20,-6;10,4;0,0" dur="7s" repeatCount="indefinite" />
        <path d="M140 230 Q143 227 146 229 Q149 227 152 230" fill="none" stroke="#1a2018" strokeWidth="0.5" />
      </g>
      {/* Bird 6 — distant bird crossing the pass opening */}
      <g opacity="0.18">
        <animateTransform attributeName="transform" type="translate" values="0,0;25,0;50,-5;25,5;0,0" dur="10s" repeatCount="indefinite" />
        <path d="M380 120 Q382 118 384 119 Q386 118 388 120" fill="none" stroke="#2a2a38" strokeWidth="0.4" />
      </g>

      {/* === CLOSER SLOPES — framing the road === */}
      <path d="M0 230 Q60 195 130 215 Q200 210 260 240 L260 400 L0 400 Z"
        fill="url(#ch13_rockLit)" opacity="0.55" />
      {/* Left slope texture — rock striations and erosion */}
      <path d="M30 240 Q32 265 28 295 Q30 330 26 370" fill="none" stroke="#4a4538" strokeWidth="0.6" opacity="0.18" />
      <path d="M85 220 Q87 250 83 285 Q85 325 81 365" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.16" />
      <path d="M145 225 Q147 258 143 298 Q145 340 141 380" fill="none" stroke="#4a4538" strokeWidth="0.6" opacity="0.17" />
      <path d="M205 225 Q207 260 203 300 Q205 345 201 385" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.15" />
      <path d="M540 240 Q600 210 680 220 Q740 200 800 215 L800 400 L540 400 Z"
        fill="url(#ch13_rockLit)" opacity="0.5" />
      {/* Right slope texture — catching more dawn light */}
      <path d="M580 255 Q582 285 578 320 Q580 360 576 390" fill="none" stroke="#5a5548" strokeWidth="0.6" opacity="0.14" />
      <path d="M640 235 Q642 270 638 310 Q640 355 636 385" fill="none" stroke="#4a4538" strokeWidth="0.7" opacity="0.16" />
      <path d="M705 230 Q707 268 703 312 Q705 358 701 388" fill="none" stroke="#5a5548" strokeWidth="0.6" opacity="0.15" />
      <path d="M765 225 Q767 265 763 310 Q765 360 761 390" fill="none" stroke="#4a4538" strokeWidth="0.5" opacity="0.13" />

      {/* Green meadow patches emerging from snow on slopes */}
      <ellipse cx="100" cy="240" rx="35" ry="10" fill="url(#ch13_meadow)" opacity="0.4" />
      <ellipse cx="200" cy="255" rx="25" ry="8" fill="url(#ch13_meadow)" opacity="0.35" />
      <ellipse cx="640" cy="245" rx="30" ry="9" fill="url(#ch13_meadow)" opacity="0.35" />
      <ellipse cx="730" cy="238" rx="22" ry="7" fill="url(#ch13_meadow)" opacity="0.3" />
      {/* Additional meadow patches — spring growth spreading */}
      <ellipse cx="150" cy="248" rx="20" ry="6" fill="url(#ch13_meadow)" opacity="0.32" />
      <ellipse cx="580" cy="252" rx="28" ry="8" fill="url(#ch13_meadow)" opacity="0.33" />
      <ellipse cx="680" cy="240" rx="18" ry="5" fill="url(#ch13_meadow)" opacity="0.28" />
      {/* Remaining snow patches */}
      <ellipse cx="160" cy="230" rx="18" ry="5" fill="#6a7078" opacity="0.15" />
      <ellipse cx="700" cy="230" rx="20" ry="5" fill="#6a7078" opacity="0.12" />
      {/* More snow patches — still melting */}
      <ellipse cx="45" cy="235" rx="15" ry="4" fill="#6a7078" opacity="0.13" />
      <ellipse cx="220" cy="242" rx="12" ry="3" fill="#6a7078" opacity="0.1" />
      <ellipse cx="760" cy="228" rx="16" ry="4" fill="#6a7078" opacity="0.11" />
      {/* Fresh green grass spreading where snow has melted */}
      <ellipse cx="60" cy="238" rx="18" ry="5" fill="#3a6a28" opacity="0.22" />
      <ellipse cx="180" cy="252" rx="15" ry="4" fill="#3a6a28" opacity="0.2" />
      <ellipse cx="610" cy="248" rx="22" ry="6" fill="#3a6a28" opacity="0.2" />
      <ellipse cx="750" cy="235" rx="14" ry="4" fill="#3a6a28" opacity="0.18" />
      {/* Bright green grass right along the road verge */}
      <ellipse cx="290" cy="310" rx="12" ry="4" fill="#3a6a28" opacity="0.2" />
      <ellipse cx="440" cy="210" rx="8" ry="3" fill="#3a6a28" opacity="0.15" />

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

      {/* Road texture — cart ruts and worn wheel tracks */}
      <path d="M295 400 Q305 368 324 338 Q348 303 373 273 Q398 243 414 213"
        fill="none" stroke="#4a4030" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
      <path d="M305 400 Q315 368 334 338 Q358 303 383 273 Q408 243 424 213"
        fill="none" stroke="#4a4030" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
      {/* Worn footpath in center of road */}
      <path d="M300 400 Q310 370 330 340 Q355 305 380 275 Q405 245 420 215 Q435 195 440 180"
        fill="none" stroke="#4a4238" strokeWidth="8" opacity="0.12" strokeLinecap="round" />
      {/* Road erosion marks — water damage from spring melt */}
      <path d="M310 380 Q315 378 312 385" fill="none" stroke="#5a5848" strokeWidth="0.8" opacity="0.1" />
      <path d="M335 350 Q338 348 336 354" fill="none" stroke="#5a5848" strokeWidth="0.7" opacity="0.1" />
      <path d="M360 315 Q363 313 361 319" fill="none" stroke="#5a5848" strokeWidth="0.6" opacity="0.09" />
      <path d="M390 275 Q393 273 391 278" fill="none" stroke="#5a5848" strokeWidth="0.5" opacity="0.08" />
      {/* Small rocks embedded in road surface */}
      <circle cx="315" cy="365" r="1.2" fill="#6a6050" opacity="0.18" />
      <circle cx="340" cy="332" r="1" fill="#5a5040" opacity="0.16" />
      <circle cx="368" cy="298" r="0.8" fill="#6a6050" opacity="0.14" />
      <circle cx="395" cy="265" r="1.1" fill="#5a5040" opacity="0.15" />
      {/* Drainage ditch along left roadside */}
      <path d="M282 400 Q292 366 312 336 Q336 301 362 271"
        fill="none" stroke="#3a3a30" strokeWidth="0.8" opacity="0.12" strokeDasharray="3,2" />
      {/* Boot prints in mud patches */}
      <ellipse cx="310" cy="372" rx="1.5" ry="0.8" fill="#4a4030" opacity="0.1" />
      <ellipse cx="325" cy="355" rx="1.3" ry="0.7" fill="#4a4030" opacity="0.09" />
      <ellipse cx="345" cy="330" rx="1.2" ry="0.6" fill="#4a4030" opacity="0.08" />

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

      {/* === WOODEN ROAD SIGN — directional post at a bend === */}
      <g opacity="0.5">
        {/* Post — weathered wood */}
        <rect x="430" y="195" width="2" height="20" fill="#4a3828" />
        {/* Sign arm pointing forward — "VIENNE" */}
        <path d="M428 197 L444 196 L446 199 L428 200 Z" fill="#5a5040" />
        <text x="430" y="199.5" fontSize="2.2" fontFamily="serif" fill="#1a1510" opacity="0.5">VIENNE</text>
        {/* Arrow tip on the sign */}
        <path d="M444 194 L448 197.5 L444 201" fill="none" stroke="#5a5040" strokeWidth="0.8" opacity="0.4" />
        {/* Sign arm pointing backward — distance marker */}
        <path d="M432 202 L420 203 L418 206 L432 205 Z" fill="#5a5040" opacity="0.8" />
        <text x="421" y="205.2" fontSize="2" fontFamily="serif" fill="#1a1510" opacity="0.4">RIVOLI</text>
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

      {/* Even more distant column — disappearing into the pass gap */}
      <path d="M515 160 Q514 156 515 153" fill="none" stroke="#151510" strokeWidth="1.2" opacity="0.12" />
      <circle cx="515" cy="152" r="1.2" fill="#151510" opacity="0.12" />
      <path d="M522 162 Q521 158 522 155" fill="none" stroke="#151510" strokeWidth="1" opacity="0.1" />
      <circle cx="522" cy="154" r="1" fill="#151510" opacity="0.1" />
      <path d="M482 158 Q481 154 482 151" fill="none" stroke="#151510" strokeWidth="1" opacity="0.1" />
      <circle cx="482" cy="150" r="1" fill="#151510" opacity="0.1" />

      {/* Tiny flag visible with distant column */}
      <line x1="506" y1="150" x2="506" y2="143" stroke="#2a2520" strokeWidth="0.6" opacity="0.12" />
      <path d="M506 143 L510 144 L510 147 L506 146 Z" fill="url(#ch13_flag)" opacity="0.15">
        <animate attributeName="d" values="M506 143 L510 144 L510 147 L506 146 Z;M506 143 L509.5 143.5 L510.5 146.5 L506 146 Z;M506 143 L510 144 L510 147 L506 146 Z" dur="3s" repeatCount="indefinite" />
      </path>

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

      {/* More soldiers in formation — filling out the column */}
      <path d="M405 228 Q403 220 405 214 Q407 209 409 214 L411 228 Z"
        fill="#151510" opacity="0.55" />
      <circle cx="407" cy="209" r="3" fill="#151510" opacity="0.55" />
      <line x1="411" y1="210" x2="414" y2="198" stroke="#151510" strokeWidth="0.7" opacity="0.35" />

      <path d="M438 220 Q436 212 438 206 Q440 201 442 206 L444 220 Z"
        fill="#151510" opacity="0.54" />
      <circle cx="440" cy="201" r="2.8" fill="#151510" opacity="0.54" />
      <rect x="442" y="206" width="3.5" height="4" rx="0.6" fill="#1a1a18" opacity="0.35" />

      <path d="M428 226 Q426 218 428 212 Q430 207 432 212 L434 226 Z"
        fill="#151510" opacity="0.52" />
      <circle cx="430" cy="207" r="2.9" fill="#151510" opacity="0.52" />

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

      {/* === DRUMMER BOY — beating cadence for the march === */}
      <g opacity="0.63">
        {/* Body — younger, smaller frame */}
        <path d="M396 236 Q394 228 396 222 Q398 217 400 222 L402 236 Z" fill="#151510" />
        {/* Head — smaller than regular soldiers */}
        <circle cx="398" cy="217" r="3" fill="#151510" />
        {/* Drum — large military drum on strap */}
        <ellipse cx="398" cy="228" rx="4.5" ry="3" fill="#6a4030" opacity="0.6" />
        <ellipse cx="398" cy="226" rx="4.5" ry="1.5" fill="#8a5838" opacity="0.4" />
        {/* Drum hoop detail */}
        <ellipse cx="398" cy="228" rx="4.5" ry="3" fill="none" stroke="#5a3828" strokeWidth="0.5" opacity="0.5" />
        {/* Drum strap */}
        <path d="M393 228 Q393 220 396 217" fill="none" stroke="#4a3828" strokeWidth="0.6" opacity="0.4" />
        <path d="M403 228 Q403 220 400 217" fill="none" stroke="#4a3828" strokeWidth="0.6" opacity="0.4" />
        {/* Drumsticks — mid-beat */}
        <path d="M393 224 Q390 222 388 224" fill="none" stroke="#3a2818" strokeWidth="0.8" opacity="0.5">
          <animate attributeName="d" values="M393 224 Q390 222 388 224;M393 224 Q391 220 389 222;M393 224 Q390 222 388 224" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M403 224 Q406 222 408 224" fill="none" stroke="#3a2818" strokeWidth="0.8" opacity="0.5">
          <animate attributeName="d" values="M403 224 Q406 222 408 224;M403 224 Q405 220 407 222;M403 224 Q406 222 408 224" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Drumstick tips */}
        <circle cx="388" cy="224" r="0.8" fill="#2a2018" opacity="0.6">
          <animate attributeName="cy" values="224;222;224" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="408" cy="224" r="0.8" fill="#2a2018" opacity="0.6">
          <animate attributeName="cy" values="224;222;224" dur="1.5s" repeatCount="indefinite" />
        </circle>
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

      {/* === OFFICER ON HORSEBACK — directing the column === */}
      <g opacity="0.62">
        {/* Horse body — finer breed than the wounded soldier's mount */}
        <path d="M340 258 Q345 251 352 252 Q359 251 363 258 L361 265 L342 265 Z"
          fill="#2a2018" />
        {/* Horse head — alert, proud bearing */}
        <path d="M363 258 Q367 253 369 256 Q368 260 365 261 Z" fill="#2a2018" />
        {/* Bridle detail */}
        <path d="M365 256 Q366 258 367 260" fill="none" stroke="#4a3828" strokeWidth="0.4" opacity="0.4" />
        {/* Horse ears — perked forward */}
        <path d="M367 253 Q368 250 369 253" fill="none" stroke="#2a2018" strokeWidth="0.6" />
        {/* Horse mane */}
        <path d="M363 256 Q361 254 360 252" fill="none" stroke="#1a1410" strokeWidth="0.8" opacity="0.6" />
        {/* Horse legs — in mid-stride */}
        <line x1="344" y1="265" x2="343" y2="272" stroke="#2a2018" strokeWidth="1.3" />
        <line x1="349" y1="265" x2="348" y2="272" stroke="#2a2018" strokeWidth="1.3" />
        <line x1="356" y1="265" x2="355" y2="272" stroke="#2a2018" strokeWidth="1.3" />
        <line x1="360" y1="265" x2="359" y2="272" stroke="#2a2018" strokeWidth="1.3" />
        {/* Horse tail — flowing */}
        <path d="M340 258 Q337 261 338 266" fill="none" stroke="#1a1410" strokeWidth="1" opacity="0.5" />
        {/* Officer — upright posture, blue coat */}
        <path d="M350 253 Q348 247 350 241 Q352 236 354 241 L356 253 Z"
          fill="#1a3a6a" opacity="0.7" />
        <circle cx="352" cy="236" r="3.5" fill="#c0a890" opacity="0.6" />
        {/* Bicorne hat */}
        <ellipse cx="352" cy="234" rx="4" ry="1.5" fill="#1a1a18" opacity="0.6" />
        {/* Gold epaulettes */}
        <rect x="347" y="241" width="2" height="1.5" rx="0.3" fill="#c0a050" opacity="0.5" />
        <rect x="353" y="241" width="2" height="1.5" rx="0.3" fill="#c0a050" opacity="0.5" />
        {/* Arm raised — directing the column forward */}
        <path d="M354 243 Q358 238 361 235" fill="none" stroke="#1a3a6a" strokeWidth="1.2" opacity="0.6" />
        {/* Hand pointing forward */}
        <path d="M361 235 Q363 234 365 233" fill="none" stroke="#c0a890" strokeWidth="0.6" opacity="0.5" />
        {/* Saddle */}
        <path d="M348 252 Q352 250 356 252" fill="none" stroke="#5a3828" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* Main group — closer, more detailed */}
      {/* Soldier 1 — striding forward, blue coat visible */}
      <path d="M385 278 Q383 268 385 260 Q387 254 389 260 L391 278 Q390 286 389 292 L385 292 Z"
        fill="#1a2a50" opacity="0.75" />
      {/* White trousers */}
      <path d="M385 278 L384 292 M389 278 L390 292" fill="none" stroke="#8a8878" strokeWidth="1.5" opacity="0.3" />
      <circle cx="387" cy="254" r="4.5" fill="#c0a888" opacity="0.65" />
      {/* Shako hat */}
      <rect x="383.5" y="249" width="7" height="4" rx="0.5" fill="#1a1a18" opacity="0.65" />
      <rect x="384" y="248.5" width="6" height="1" fill="#1a1a18" opacity="0.5" />
      {/* Shako plume */}
      <line x1="390" y1="249" x2="391" y2="246" stroke="#a02020" strokeWidth="0.8" opacity="0.4" />
      {/* Crossbelts — white X on blue */}
      <line x1="385" y1="258" x2="389" y2="270" stroke="#8a8878" strokeWidth="0.6" opacity="0.35" />
      <line x1="389" y1="258" x2="385" y2="270" stroke="#8a8878" strokeWidth="0.6" opacity="0.35" />
      {/* Pack on back */}
      <rect x="389" y="260" width="5" height="6" rx="1" fill="#3a3828" opacity="0.5" />
      {/* Musket */}
      <line x1="381" y1="256" x2="378" y2="292" stroke="#2a2a28" strokeWidth="1" opacity="0.5" />
      {/* Bayonet glint */}
      <line x1="378" y1="292" x2="377" y2="296" stroke="#8a8a88" strokeWidth="0.4" opacity="0.3" />

      {/* === SECOND FLAG BEARER — regimental colors in mid-column === */}
      <g opacity="0.64">
        {/* Body — marching confidently */}
        <path d="M376 288 Q374 280 376 274 Q378 269 380 274 L382 288 Z" fill="#151510" />
        <circle cx="378" cy="269" r="3.8" fill="#151510" />
        {/* Flag pole */}
        <line x1="382" y1="270" x2="382" y2="250" stroke="#2a2520" strokeWidth="1.2" opacity="0.5" />
        {/* Regimental flag — smaller than main tricolour */}
        <path d="M382 250 L394 253 L394 260 L382 257 Z" fill="url(#ch13_flag)" opacity="0.48">
          <animate attributeName="d" values="M382 250 L394 253 L394 260 L382 257 Z;M382 250 L393 252 L395 259 L382 257 Z;M382 250 L394 253 L394 260 L382 257 Z" dur="3.5s" repeatCount="indefinite" />
        </path>
        {/* Pack */}
        <rect x="380" y="274" width="4.5" height="5" rx="0.7" fill="#1a1a18" opacity="0.45" />
      </g>

      {/* Warming breath — visible breath cloud on closest soldiers (cold altitude) */}
      <ellipse cx="380" cy="252" rx="4" ry="1.8" fill="#a0b0c0" opacity="0.08">
        <animate attributeName="rx" values="4;6;4" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.03;0.08" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="380;377;380" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Soldier 2 — blue coat, visible gear */}
      <path d="M398 272 Q396 262 398 254 Q400 249 402 254 L404 272 Q403 280 402 286 L398 286 Z"
        fill="#1a2a50" opacity="0.72" />
      {/* White trousers */}
      <path d="M398 272 L397 286 M402 272 L403 286" fill="none" stroke="#8a8878" strokeWidth="1.3" opacity="0.28" />
      <circle cx="400" cy="249" r="4.2" fill="#c0a888" opacity="0.6" />
      {/* Shako */}
      <rect x="396.5" y="244.5" width="7" height="3.5" rx="0.5" fill="#1a1a18" opacity="0.6" />
      {/* Crossbelts */}
      <line x1="398" y1="252" x2="402" y2="264" stroke="#8a8878" strokeWidth="0.5" opacity="0.3" />
      <line x1="402" y1="252" x2="398" y2="264" stroke="#8a8878" strokeWidth="0.5" opacity="0.3" />
      {/* Musket over shoulder */}
      <line x1="405" y1="250" x2="408" y2="236" stroke="#2a2a28" strokeWidth="0.8" opacity="0.45" />
      <rect x="402" y="254" width="4" height="5" rx="1" fill="#3a3828" opacity="0.45" />

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

      {/* Additional mid-column soldiers */}
      <path d="M380 303 Q378 295 380 289 Q382 284 384 289 L386 303 Z"
        fill="#151510" opacity="0.62" />
      <circle cx="382" cy="284" r="3.6" fill="#151510" opacity="0.62" />
      <line x1="386" y1="285" x2="389" y2="272" stroke="#151510" strokeWidth="0.8" opacity="0.4" />

      <path d="M364 318 Q362 310 364 304 Q366 299 368 304 L370 318 Z"
        fill="#151510" opacity="0.58" />
      <circle cx="366" cy="299" r="3.3" fill="#151510" opacity="0.58" />

      <path d="M348 348 Q346 340 348 334 Q350 329 352 334 L354 348 Z"
        fill="#151510" opacity="0.56" />
      <circle cx="350" cy="329" r="3.2" fill="#151510" opacity="0.56" />
      <rect x="352" y="334" width="3.5" height="4" rx="0.5" fill="#1a1a18" opacity="0.35" />

      {/* Rearguard — disappearing around the lower bend */}
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={`rear${i}`}>
          <path d={`M${345 - i * 8} ${358 + i * 12} Q${343 - i * 8} ${352 + i * 12} ${345 - i * 8} ${348 + i * 12}`}
            fill="none" stroke="#151510" strokeWidth="1.8" opacity={0.5 - i * 0.1} />
          <circle cx={345 - i * 8} cy={346 + i * 12} r={3 - i * 0.4}
            fill="#151510" opacity={0.5 - i * 0.1} />
        </React.Fragment>
      ))}

      {/* Extended rearguard — more soldiers further back */}
      {[0, 1, 2].map((i) => (
        <React.Fragment key={`extended_rear${i}`}>
          <path d={`M${313 - i * 7} ${382 + i * 10} Q${311 - i * 7} ${376 + i * 10} ${313 - i * 7} ${372 + i * 10}`}
            fill="none" stroke="#151510" strokeWidth="1.5" opacity={0.35 - i * 0.08} />
          <circle cx={313 - i * 7} cy={370 + i * 10} r={2.5 - i * 0.3}
            fill="#151510" opacity={0.35 - i * 0.08} />
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
      {/* More birds — spring migration, silhouetted against the bright sky */}
      <path d="M370 98 Q373 95 376 97 Q379 95 382 98" fill="none" stroke="#3a3a48" strokeWidth="0.5" opacity="0.16" />
      <path d="M420 105 Q422 103 424 104 Q426 103 428 105" fill="none" stroke="#3a3a48" strokeWidth="0.4" opacity="0.14" />
      <path d="M455 92 Q458 89 461 91 Q464 89 467 92" fill="none" stroke="#3a3a48" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M455 92 Q458 89 461 91 Q464 89 467 92;M455 91 Q458 90 461 91 Q464 90 467 91;M455 92 Q458 89 461 91 Q464 89 467 92" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Tiny distant birds — V formation heading toward Vienna */}
      <g opacity="0.12">
        <path d="M430 78 Q431 77 432 77.5" fill="none" stroke="#2a2a38" strokeWidth="0.3" />
        <path d="M434 78 Q435 77 436 77.5" fill="none" stroke="#2a2a38" strokeWidth="0.3" />
        <path d="M432 80 Q433 79 434 79.5" fill="none" stroke="#2a2a38" strokeWidth="0.3" />
        <path d="M428 80 Q429 79 430 79.5" fill="none" stroke="#2a2a38" strokeWidth="0.3" />
        <path d="M436 80 Q437 79 438 79.5" fill="none" stroke="#2a2a38" strokeWidth="0.3" />
      </g>

      {/* === FOREGROUND DETAILS === */}
      {/* Rocky outcrop in lower-left foreground */}
      <path d="M0 340 Q20 320 50 325 Q80 315 100 330 L100 400 L0 400 Z"
        fill="#2a2a28" opacity="0.6" />

      {/* Boulders and rocks along the road — fallen from slopes */}
      <ellipse cx="305" cy="362" rx="8" ry="5" fill="#3a3a38" opacity="0.5" />
      <ellipse cx="303" cy="359" rx="6" ry="3.5" fill="#4a4a48" opacity="0.35" />
      <ellipse cx="308" cy="363" rx="5" ry="3" fill="#2a2a28" opacity="0.4" />

      <ellipse cx="420" cy="248" rx="6" ry="4" fill="#3a3a38" opacity="0.45" />
      <ellipse cx="418" cy="246" rx="4.5" ry="2.5" fill="#4a4a48" opacity="0.3" />

      <ellipse cx="275" cy="282" rx="5" ry="3.5" fill="#3a3a38" opacity="0.42" />
      <ellipse cx="273" cy="280" rx="3.5" ry="2" fill="#5a5a58" opacity="0.28" />

      <ellipse cx="485" cy="170" rx="4" ry="2.5" fill="#3a3a38" opacity="0.35" />

      {/* Smaller rocks scattered on the roadside */}
      <ellipse cx="322" cy="345" rx="3" ry="2" fill="#4a4a48" opacity="0.38" />
      <ellipse cx="295" cy="298" rx="2.5" ry="1.5" fill="#3a3a38" opacity="0.32" />
      <ellipse cx="410" cy="260" rx="2" ry="1.2" fill="#4a4a48" opacity="0.3" />
      <ellipse cx="255" cy="265" rx="2.8" ry="1.8" fill="#3a3a38" opacity="0.35" />

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

      {/* Foreground flowers near the viewer — lush spring carpet */}
      <circle cx="55" cy="342" r="1.8" fill="#5070b0" opacity="0.4" />
      <circle cx="70" cy="338" r="1.5" fill="#c0a040" opacity="0.4" />
      <circle cx="85" cy="340" r="1.3" fill="#c0c0b0" opacity="0.35" />
      <circle cx="95" cy="335" r="1" fill="#5070b0" opacity="0.3" />
      {/* Additional foreground blooms — dense alpine meadow */}
      <circle cx="42" cy="345" r="1.2" fill="#c0a040" opacity="0.35" />
      <circle cx="62" cy="336" r="1.4" fill="#b05070" opacity="0.35" />
      <circle cx="78" cy="342" r="1" fill="#8050a0" opacity="0.3" />
      <circle cx="48" cy="338" r="0.9" fill="#c0c0b0" opacity="0.3" />
      <circle cx="92" cy="342" r="1.3" fill="#c0a040" opacity="0.32" />
      {/* Foreground poppy — bright red splash */}
      <circle cx="72" cy="344" r="1.6" fill="#c03030" opacity="0.3" />
      <circle cx="72" cy="344" r="0.4" fill="#1a1a10" opacity="0.25" />
      {/* Extra grass tufts around flowers */}
      <path d="M50 345 Q52 338 54 345" fill="none" stroke="#3a5a28" strokeWidth="0.6" opacity="0.28" />
      <path d="M82 342 Q84 336 86 342" fill="none" stroke="#3a5a28" strokeWidth="0.5" opacity="0.25" />

            {/* === GRAND WATERFALL — cascading down left mountain face === */}
      <g opacity="0.55">
        {/* Main cascade — wide white ribbon of meltwater */}
        <path d="M158 95 Q162 120 156 148 Q160 175 155 200 Q158 218 154 235" fill="none" stroke="url(#ch13_cascade)" strokeWidth="4" strokeLinecap="round">
          <animate attributeName="d" values="M158 95 Q162 120 156 148 Q160 175 155 200 Q158 218 154 235;M159 95 Q163 122 157 150 Q161 177 156 202 Q159 220 155 237;M158 95 Q162 120 156 148 Q160 175 155 200 Q158 218 154 235" dur="2.5s" repeatCount="indefinite" />
        </path>
        {/* Secondary cascade */}
        <path d="M161 98 Q164 125 159 152 Q162 180 158 205" fill="none" stroke="#b0c8d8" strokeWidth="1.8" opacity="0.2" strokeLinecap="round">
          <animate attributeName="opacity" values="0.2;0.32;0.2" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Spray at the base */}
        <ellipse cx="155" cy="238" rx="10" ry="4" fill="url(#ch13_waterfallMist)">
          <animate attributeName="rx" values="10;13;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* Splash droplets */}
        <circle cx="150" cy="234" r="0.5" fill="#c0d8e8" opacity="0.2">
          <animate attributeName="cy" values="234;228;234" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="232" r="0.4" fill="#c0d8e8" opacity="0.18">
          <animate attributeName="cy" values="232;226;232" dur="2.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0.04;0.18" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="155" cy="233" r="0.6" fill="#d0e0f0" opacity="0.15">
          <animate attributeName="cy" values="233;225;233" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.03;0.15" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Rainbow hint in the spray */}
        <path d="M148 232 Q155 226 162 232" fill="none" stroke="#c0a0a0" strokeWidth="0.6" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.1;0.06" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M149 233 Q155 228 161 233" fill="none" stroke="#a0a0c0" strokeWidth="0.5" opacity="0.05" />
        {/* Water streaks on rock face */}
        <path d="M153 236 Q154 242 152 248" fill="none" stroke="#6a90a8" strokeWidth="0.8" opacity="0.12" />
        <path d="M157 237 Q158 244 156 250" fill="none" stroke="#6a90a8" strokeWidth="0.6" opacity="0.1" />
      </g>

      {/* === SECOND WATERFALL — smaller, on right mountain face === */}
      <g opacity="0.4">
        <path d="M672 78 Q675 100 670 125 Q673 148 669 168" fill="none" stroke="url(#ch13_cascade)" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d" values="M672 78 Q675 100 670 125 Q673 148 669 168;M673 78 Q676 102 671 127 Q674 150 670 170;M672 78 Q675 100 670 125 Q673 148 669 168" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M674 80 Q676 105 672 130 Q674 152 671 170" fill="none" stroke="#b0c8d8" strokeWidth="1" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.25;0.15" dur="2.2s" repeatCount="indefinite" />
        </path>
        {/* Spray mist */}
        <ellipse cx="670" cy="172" rx="6" ry="3" fill="url(#ch13_waterfallMist)" opacity="0.6" />
      </g>

      {/* === STONE BRIDGE — arched alpine bridge over the mountain stream === */}
      <g opacity="0.6">
        {/* Bridge arch — semicircular stone */}
        <path d="M270 295 Q275 275 290 268 Q305 262 320 268 Q335 275 340 295" fill="url(#ch13_stoneBridge)" />
        {/* Arch underside shadow */}
        <path d="M274 293 Q280 278 295 272 Q310 267 325 272 Q335 278 338 293" fill="#1a1a18" opacity="0.3" />
        {/* Stone voussoirs */}
        <path d="M278 288 Q282 280 290 275" fill="none" stroke="#5a5848" strokeWidth="0.5" opacity="0.3" />
        <path d="M288 276 Q298 270 310 270" fill="none" stroke="#5a5848" strokeWidth="0.5" opacity="0.3" />
        <path d="M312 270 Q322 272 330 280" fill="none" stroke="#5a5848" strokeWidth="0.5" opacity="0.3" />
        <path d="M332 282 Q336 288 338 293" fill="none" stroke="#5a5848" strokeWidth="0.5" opacity="0.25" />
        {/* Bridge deck */}
        <rect x="268" y="262" width="74" height="6" rx="1" fill="url(#ch13_stoneBridge)" opacity="0.8" />
        {/* Parapet walls */}
        <rect x="268" y="258" width="74" height="4" rx="1" fill="#5a5548" opacity="0.5" />
        {/* Parapet stone details */}
        <line x1="280" y1="258" x2="280" y2="262" stroke="#4a4538" strokeWidth="0.4" opacity="0.3" />
        <line x1="295" y1="258" x2="295" y2="262" stroke="#4a4538" strokeWidth="0.4" opacity="0.3" />
        <line x1="310" y1="258" x2="310" y2="262" stroke="#4a4538" strokeWidth="0.4" opacity="0.3" />
        <line x1="325" y1="258" x2="325" y2="262" stroke="#4a4538" strokeWidth="0.4" opacity="0.3" />
        {/* Keystone */}
        <rect x="302" y="266" width="6" height="5" fill="#6a6558" opacity="0.5" />
        {/* Moss on bridge stones */}
        <ellipse cx="278" cy="285" rx="3" ry="1.5" fill="url(#ch13_moss)" />
        <ellipse cx="332" cy="282" rx="2.5" ry="1.2" fill="url(#ch13_moss)" />
        <ellipse cx="305" cy="295" rx="4" ry="1.8" fill="url(#ch13_moss)" opacity="0.6" />
        {/* Water reflection under the arch */}
        <ellipse cx="305" cy="292" rx="15" ry="3" fill="#c0a050" opacity="0.05">
          <animate attributeName="opacity" values="0.05;0.1;0.05" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* === SECOND MILESTONE — closer, "A VIENNE" carved === */}
      <g opacity="0.5">
        <path d="M320 352 L318 338 L326 337 L328 352 Z" fill="url(#ch13_milestone)" />
        <path d="M318 338 Q322 335 326 337" fill="#8a8580" opacity="0.45" />
        <text x="319" y="346" fontSize="2.8" fontFamily="serif" fill="#2a2520" opacity="0.4" transform="rotate(-1, 322, 344)">A</text>
        <text x="318.5" y="349.5" fontSize="2.5" fontFamily="serif" fill="#2a2520" opacity="0.35" transform="rotate(-1, 322, 348)">VIENNE</text>
        <circle cx="320" cy="342" r="1.2" fill="#6a7a58" opacity="0.2" />
        <circle cx="326" cy="348" r="0.8" fill="#5a6a4a" opacity="0.18" />
        <path d="M326 337 L327 339 L325 338" fill="#5a5550" opacity="0.3" />
      </g>

      {/* === ARTILLERY TRAIN — cannon being hauled up the road === */}
      <g opacity="0.55">
        {/* Cannon limber */}
        <rect x="348" y="360" width="16" height="6" rx="1" fill="url(#ch13_wagonWood)" />
        {/* Cannon barrel */}
        <path d="M350 358 L368 356" fill="none" stroke="url(#ch13_cannonMetal)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="368" cy="356" r="1.5" fill="#2a2a2a" opacity="0.5" />
        {/* Limber wheels */}
        <circle cx="352" cy="366" r="3.5" fill="none" stroke="#3a3020" strokeWidth="1" opacity="0.5" />
        <circle cx="352" cy="366" r="0.6" fill="#3a3020" opacity="0.4" />
        <line x1="352" y1="362.5" x2="352" y2="369.5" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
        <line x1="348.5" y1="366" x2="355.5" y2="366" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
        <circle cx="364" cy="366" r="3.5" fill="none" stroke="#3a3020" strokeWidth="1" opacity="0.5" />
        <circle cx="364" cy="366" r="0.6" fill="#3a3020" opacity="0.4" />
        <line x1="364" y1="362.5" x2="364" y2="369.5" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
        <line x1="360.5" y1="366" x2="367.5" y2="366" stroke="#3a3020" strokeWidth="0.3" opacity="0.3" />
        {/* Towing shaft */}
        <path d="M348 363 Q340 362 332 364" fill="none" stroke="#4a3828" strokeWidth="1.2" opacity="0.45" />
        {/* Artillery horses */}
        <path d="M318 358 Q323 352 328 353 Q334 352 338 358 L336 364 L320 364 Z" fill="url(#ch13_cavalryHorse)" opacity="0.5" />
        <path d="M338 358 Q340 354 342 356 Q341 359 339 360 Z" fill="#3a2818" opacity="0.5" />
        <line x1="322" y1="364" x2="321" y2="370" stroke="#3a2818" strokeWidth="1" opacity="0.4" />
        <line x1="326" y1="364" x2="325" y2="370" stroke="#3a2818" strokeWidth="1" opacity="0.4" />
        <line x1="332" y1="364" x2="331" y2="370" stroke="#3a2818" strokeWidth="1" opacity="0.4" />
        <line x1="336" y1="364" x2="335" y2="370" stroke="#3a2818" strokeWidth="1" opacity="0.4" />
        {/* Artilleryman walking alongside */}
        <path d="M310 368 Q308 362 310 358" fill="none" stroke="#1a3060" strokeWidth="1.5" opacity="0.45" />
        <circle cx="310" cy="356" r="2.5" fill="#1a3060" opacity="0.45" />
        <line x1="312" y1="358" x2="318" y2="346" stroke="#4a3a28" strokeWidth="0.6" opacity="0.35" />
      </g>

      {/* === SECOND ARTILLERY PIECE — further up the road === */}
      <g opacity="0.4">
        <rect x="410" y="242" width="10" height="4" rx="0.5" fill="url(#ch13_wagonWood)" />
        <path d="M412 240 L422 239" fill="none" stroke="#2a2a2a" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="413" cy="246" r="2.5" fill="none" stroke="#3a3020" strokeWidth="0.8" opacity="0.45" />
        <circle cx="420" cy="246" r="2.5" fill="none" stroke="#3a3020" strokeWidth="0.8" opacity="0.45" />
      </g>

      {/* === CAVALRY TROOP — hussars riding ahead of the column === */}
      <g opacity="0.52">
        {/* Lead cavalryman */}
        <path d="M460 192 Q465 185 470 186 Q476 185 480 192 L478 198 L462 198 Z" fill="url(#ch13_cavalryHorse)" />
        <path d="M480 192 Q483 188 485 190 Q484 193 482 194 Z" fill="#3a2818" />
        <path d="M460 192 Q457 195 458 199" fill="none" stroke="#2a1a10" strokeWidth="0.8" />
        <line x1="463" y1="198" x2="462" y2="204" stroke="#3a2818" strokeWidth="1" />
        <line x1="467" y1="198" x2="466" y2="204" stroke="#3a2818" strokeWidth="1" />
        <line x1="474" y1="198" x2="473" y2="204" stroke="#3a2818" strokeWidth="1" />
        <line x1="478" y1="198" x2="477" y2="204" stroke="#3a2818" strokeWidth="1" />
        {/* Rider — hussar jacket */}
        <path d="M468 187 Q466 181 468 175 Q470 170 472 175 L474 187 Z" fill="#1a4a20" opacity="0.65" />
        <circle cx="470" cy="170" r="3" fill="#c0a890" opacity="0.55" />
        <rect x="468" y="166" width="4" height="3" rx="0.5" fill="#1a1a18" opacity="0.55" />
        {/* Plume on shako */}
        <line x1="471" y1="166" x2="472" y2="162" stroke="#8a2020" strokeWidth="1" opacity="0.45" />
        {/* Sabre drawn, catching dawn */}
        <path d="M474 176 Q478 170 482 165" fill="none" stroke="#8a8a88" strokeWidth="0.8" opacity="0.5" />
        <circle cx="482" cy="165" r="0.8" fill="#e0d0a0" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Second cavalryman */}
      <g opacity="0.42">
        <path d="M474 196 Q478 190 483 191 Q488 190 491 196 L489 201 L476 201 Z" fill="url(#ch13_cavalryHorse)" />
        <path d="M491 196 Q493 192 495 194 Q494 197 492 198 Z" fill="#3a2818" />
        <line x1="477" y1="201" x2="476" y2="206" stroke="#3a2818" strokeWidth="0.9" />
        <line x1="481" y1="201" x2="480" y2="206" stroke="#3a2818" strokeWidth="0.9" />
        <line x1="486" y1="201" x2="485" y2="206" stroke="#3a2818" strokeWidth="0.9" />
        <line x1="489" y1="201" x2="488" y2="206" stroke="#3a2818" strokeWidth="0.9" />
        <path d="M481 192 Q479 186 481 180 Q483 176 485 180 L486 192 Z" fill="#1a4a20" opacity="0.55" />
        <circle cx="483" cy="176" r="2.5" fill="#c0a890" opacity="0.45" />
        <rect x="481" y="173" width="3.5" height="2.5" rx="0.5" fill="#1a1a18" opacity="0.45" />
      </g>

      {/* Third cavalryman — distant */}
      <g opacity="0.3">
        <path d="M488 199 Q491 194 495 195 Q499 194 502 199 L500 203 L490 203 Z" fill="#2a2018" />
        <path d="M494 196 Q493 191 495 187" fill="none" stroke="#151510" strokeWidth="1.2" />
        <circle cx="495" cy="185" r="2" fill="#151510" />
      </g>

      {/* === REGIMENTAL EAGLE catching dawn light — golden ornament === */}
      <g opacity="0.65">
        <line x1="430" y1="200" x2="430" y2="158" stroke="#3a3020" strokeWidth="1.8" opacity="0.55" />
        {/* Eagle sculpture — spread wings */}
        <path d="M424 160 Q427 154 430 156 Q433 154 436 160" fill="url(#ch13_eagleGold)" opacity="0.6" />
        <ellipse cx="430" cy="159" rx="2" ry="2.5" fill="url(#ch13_eagleGold)" opacity="0.55" />
        <circle cx="430" cy="155" r="1.2" fill="#d0b050" opacity="0.55" />
        <path d="M430 155 L432 154" fill="none" stroke="#a08030" strokeWidth="0.5" opacity="0.5" />
        {/* Dawn light glinting off eagle — animated sparkle */}
        <circle cx="430" cy="157" r="2.5" fill="#f0d870" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
          <animate attributeName="r" values="2.5;3.5;2.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="430" cy="157" r="1" fill="#f8e880" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Cross-shaped light flare */}
        <line x1="427" y1="157" x2="433" y2="157" stroke="#f0d870" strokeWidth="0.4" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="430" y1="154" x2="430" y2="160" stroke="#f0d870" strokeWidth="0.4" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.25;0.12" dur="3s" repeatCount="indefinite" />
        </line>
      </g>

      {/* === FOREGROUND ROCKS WITH MOSS — detailed rocky outcrop === */}
      <g>
        <path d="M30 360 Q25 345 38 338 Q55 330 72 335 Q85 340 88 355 L90 400 L20 400 Z" fill="#2a2a28" opacity="0.65" />
        {/* Rock surface texture */}
        <path d="M35 345 Q40 348 45 342" fill="none" stroke="#3a3a38" strokeWidth="0.5" opacity="0.2" />
        <path d="M50 338 Q55 340 62 336" fill="none" stroke="#3a3a38" strokeWidth="0.4" opacity="0.18" />
        <path d="M65 340 Q70 344 78 342" fill="none" stroke="#3a3a38" strokeWidth="0.5" opacity="0.15" />
        {/* Cracks in the rock */}
        <path d="M42 340 Q44 350 40 362" fill="none" stroke="#1a1a18" strokeWidth="0.6" opacity="0.25" />
        <path d="M60 335 Q62 348 58 358" fill="none" stroke="#1a1a18" strokeWidth="0.5" opacity="0.2" />
        {/* Thick moss patches */}
        <ellipse cx="38" cy="348" rx="6" ry="3" fill="url(#ch13_moss)" opacity="0.9" />
        <ellipse cx="55" cy="342" rx="8" ry="3.5" fill="url(#ch13_moss)" opacity="0.85" />
        <ellipse cx="72" cy="345" rx="5" ry="2.5" fill="url(#ch13_moss)" opacity="0.8" />
        <ellipse cx="48" cy="354" rx="4" ry="2" fill="url(#ch13_moss)" opacity="0.7" />
        {/* Moss texture detail */}
        <circle cx="35" cy="347" r="0.8" fill="#5a7a38" opacity="0.25" />
        <circle cx="40" cy="349" r="0.6" fill="#4a6a28" opacity="0.22" />
        <circle cx="52" cy="341" r="0.7" fill="#5a7a38" opacity="0.2" />
        <circle cx="58" cy="343" r="0.9" fill="#4a6a28" opacity="0.22" />
        <circle cx="70" cy="344" r="0.5" fill="#5a7a38" opacity="0.2" />
        {/* Moss draping over rock edge */}
        <path d="M34 350 Q36 354 38 350" fill="#4a6a30" opacity="0.15" />
        <path d="M50 345 Q53 349 56 345" fill="#4a6a30" opacity="0.12" />
      </g>

      {/* === FOREGROUND MOUNTAIN STREAM — babbling brook === */}
      <g>
        <path d="M0 375 Q30 368 60 372 Q90 365 120 370 Q140 362 160 368" fill="none" stroke="url(#ch13_fgStream)" strokeWidth="8" strokeLinecap="round" />
        <path d="M0 375 Q30 368 60 372 Q90 365 120 370 Q140 362 160 368" fill="none" stroke="#8ac0d8" strokeWidth="1.5" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.25;0.15" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Current lines */}
        <path d="M10 374 Q20 371 30 370" fill="none" stroke="#8ab8d0" strokeWidth="0.6" opacity="0.2">
          <animate attributeName="d" values="M10 374 Q20 371 30 370;M15 373 Q25 370 35 369;M10 374 Q20 371 30 370" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M50 371 Q65 367 80 368" fill="none" stroke="#8ab8d0" strokeWidth="0.5" opacity="0.18">
          <animate attributeName="d" values="M50 371 Q65 367 80 368;M55 370 Q70 366 85 367;M50 371 Q65 367 80 368" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M100 368 Q115 364 130 366" fill="none" stroke="#8ab8d0" strokeWidth="0.5" opacity="0.15">
          <animate attributeName="d" values="M100 368 Q115 364 130 366;M105 367 Q120 363 135 365;M100 368 Q115 364 130 366" dur="2.2s" repeatCount="indefinite" />
        </path>
        {/* Pebbles through clear water */}
        <circle cx="25" cy="372" r="1.5" fill="#4a4a40" opacity="0.15" />
        <circle cx="45" cy="370" r="2" fill="#3a3a38" opacity="0.12" />
        <circle cx="75" cy="367" r="1.8" fill="#4a4a40" opacity="0.13" />
        <circle cx="110" cy="368" r="1.2" fill="#3a3a38" opacity="0.1" />
        <circle cx="140" cy="365" r="1.5" fill="#4a4a40" opacity="0.11" />
        {/* Foam patches */}
        <circle cx="55" cy="370" r="1" fill="#c0d8e0" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.3;0.18" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="95" cy="366" r="0.8" fill="#c0d8e0" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.25;0.15" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="130" cy="367" r="1.2" fill="#c0d8e0" opacity="0.16">
          <animate attributeName="opacity" values="0.16;0.28;0.16" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* Dawn light reflections on water */}
        <circle cx="40" cy="370" r="1" fill="#d0b060" opacity="0.08">
          <animate attributeName="opacity" values="0.08;0.16;0.08" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="85" cy="366" r="0.8" fill="#d0b060" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === DETAILED EDELWEISS === */}
      <g opacity="0.5">
        <path d="M48 358 L46 354 L48 352 L50 354 Z" fill="#d0d0c0" opacity="0.6" />
        <path d="M48 358 L44 356 L44 354 L46 354 Z" fill="#c8c8b8" opacity="0.55" />
        <path d="M48 358 L52 356 L52 354 L50 354 Z" fill="#c8c8b8" opacity="0.55" />
        <path d="M48 358 L46 360 L48 362 L50 360 Z" fill="#d0d0c0" opacity="0.5" />
        <circle cx="48" cy="357" r="1" fill="#c0a040" opacity="0.5" />
        <line x1="48" y1="362" x2="48" y2="367" stroke="#4a6a30" strokeWidth="0.5" opacity="0.4" />
        <path d="M48 364 Q46 363 45 365" fill="none" stroke="#5a7a38" strokeWidth="0.4" opacity="0.3" />
      </g>
      <g opacity="0.4">
        <path d="M82 350 L80 346 L82 344 L84 346 Z" fill="#d0d0c0" opacity="0.5" />
        <path d="M82 350 L78 348 L78 346 L80 346 Z" fill="#c8c8b8" opacity="0.45" />
        <path d="M82 350 L86 348 L86 346 L84 346 Z" fill="#c8c8b8" opacity="0.45" />
        <path d="M82 350 L80 352 L82 354 L84 352 Z" fill="#d0d0c0" opacity="0.4" />
        <circle cx="82" cy="349" r="0.8" fill="#c0a040" opacity="0.45" />
        <line x1="82" y1="354" x2="82" y2="358" stroke="#4a6a30" strokeWidth="0.4" opacity="0.35" />
      </g>

      {/* === DETAILED GENTIAN === */}
      <g opacity="0.5">
        <path d="M108 362 Q106 358 108 355 Q110 358 108 362 Z" fill="#3050a0" opacity="0.6" />
        <circle cx="108" cy="356" r="0.5" fill="#c0c0d0" opacity="0.35" />
        <line x1="108" y1="362" x2="108" y2="368" stroke="#3a5a28" strokeWidth="0.5" opacity="0.4" />
        <path d="M112 364 Q110 360 112 357 Q114 360 112 364 Z" fill="#3050a0" opacity="0.5" />
        <line x1="112" y1="364" x2="111" y2="369" stroke="#3a5a28" strokeWidth="0.4" opacity="0.35" />
      </g>

      {/* === FOREGROUND BUTTERFLY === */}
      <g opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0;6,-8;12,-3;6,5;0,0" dur="8s" repeatCount="indefinite" />
        <path d="M52 365 Q46 358 50 354 Q54 350 56 355 L54 360 Z" fill="#b07030" opacity="0.6" />
        <circle cx="50" cy="356" r="1" fill="#1a1a30" opacity="0.35" />
        <circle cx="50" cy="356" r="0.4" fill="#4060a0" opacity="0.3" />
        <path d="M56 365 Q62 358 58 354 Q54 350 52 355 L54 360 Z" fill="#b07030" opacity="0.55" />
        <path d="M52 365 Q47 370 50 373 Q54 375 54 370 Z" fill="#a06828" opacity="0.5" />
        <path d="M56 365 Q61 370 58 373 Q54 375 54 370 Z" fill="#a06828" opacity="0.45" />
        <line x1="54" y1="354" x2="54" y2="372" stroke="#2a2018" strokeWidth="0.8" opacity="0.5" />
        <path d="M54 354 Q52 350 50 348" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.4" />
        <circle cx="50" cy="348" r="0.3" fill="#2a2018" opacity="0.4" />
        <path d="M54 354 Q56 350 58 348" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.4" />
        <circle cx="58" cy="348" r="0.3" fill="#2a2018" opacity="0.4" />
        <animate attributeName="opacity" values="0.5;0.42;0.5" dur="0.8s" repeatCount="indefinite" />
      </g>

      {/* === SECOND BUTTERFLY === */}
      <g opacity="0.35">
        <animateTransform attributeName="transform" type="translate" values="0,0;-4,-6;-8,0;-4,6;0,0" dur="6.5s" repeatCount="indefinite" />
        <path d="M118 358 Q115 354 117 352 Q119 350 120 353 Z" fill="#d0d0c8" opacity="0.5" />
        <path d="M120 358 Q123 354 121 352 Q119 350 118 353 Z" fill="#d0d0c8" opacity="0.45" />
        <line x1="119" y1="352" x2="119" y2="360" stroke="#3a3a30" strokeWidth="0.3" opacity="0.4" />
      </g>

      {/* === SOLDIER SHIELDING EYES === */}
      <g opacity="0.6">
        <path d="M450 230 Q448 222 450 216 Q452 211 454 216 L456 230 Z" fill="#151510" />
        <circle cx="452" cy="211" r="3.5" fill="#151510" />
        <path d="M454 213 Q458 210 460 208" fill="none" stroke="#151510" strokeWidth="1.2" opacity="0.6" />
        <path d="M460 208 Q462 207 463 208 Q462 209 460 209" fill="#c0a890" opacity="0.4" />
      </g>

      {/* === BUDDING TREES — spring leaves emerging === */}
      <g opacity="0.45">
        {/* Left-side tree — fuller canopy with spring buds */}
        <path d="M240 270 Q238 258 240 245" fill="none" stroke="#3a2a18" strokeWidth="1.5" />
        <path d="M240 255 Q235 248 230 244" fill="none" stroke="#3a2a18" strokeWidth="0.8" />
        <path d="M240 252 Q245 245 250 242" fill="none" stroke="#3a2a18" strokeWidth="0.8" />
        <path d="M240 258 Q237 253 234 250" fill="none" stroke="#3a2a18" strokeWidth="0.6" />
        <circle cx="230" cy="243" r="3.5" fill="#5a9a38" opacity="0.35" />
        <circle cx="250" cy="241" r="3.2" fill="#5a9a38" opacity="0.32" />
        <circle cx="240" cy="246" r="4" fill="#4a8a28" opacity="0.3" />
        <circle cx="234" cy="249" r="2.5" fill="#6aaa40" opacity="0.25" />
        {/* Tiny bud dots — spring awakening */}
        <circle cx="228" cy="242" r="0.6" fill="#8ac050" opacity="0.3" />
        <circle cx="251" cy="239" r="0.5" fill="#8ac050" opacity="0.28" />
        <circle cx="242" cy="244" r="0.6" fill="#8ac050" opacity="0.25" />
      </g>
      <g opacity="0.38">
        {/* Right-side tree */}
        <path d="M555 255 Q553 245 555 234" fill="none" stroke="#3a2a18" strokeWidth="1.2" />
        <path d="M555 242 Q550 237 547 234" fill="none" stroke="#3a2a18" strokeWidth="0.6" />
        <path d="M555 240 Q560 235 563 232" fill="none" stroke="#3a2a18" strokeWidth="0.6" />
        <circle cx="546" cy="235" r="3" fill="#5a9a38" opacity="0.3" />
        <circle cx="555" cy="236" r="3.5" fill="#4a8a28" opacity="0.28" />
        <circle cx="563" cy="232" r="2.5" fill="#6aaa40" opacity="0.22" />
        <circle cx="548" cy="233" r="0.5" fill="#8ac050" opacity="0.22" />
        <circle cx="557" cy="234" r="0.5" fill="#8ac050" opacity="0.2" />
      </g>
      {/* Additional budding tree near the road — cherry or almond blossom */}
      <g opacity="0.4">
        <path d="M470 212 Q468 200 470 190" fill="none" stroke="#3a2a18" strokeWidth="1.2" />
        <path d="M470 198 Q465 193 462 190" fill="none" stroke="#3a2a18" strokeWidth="0.6" />
        <path d="M470 196 Q475 191 478 188" fill="none" stroke="#3a2a18" strokeWidth="0.6" />
        <circle cx="462" cy="189" r="2.5" fill="#e0b0b8" opacity="0.2" />
        <circle cx="478" cy="187" r="2.2" fill="#e0b0b8" opacity="0.18" />
        <circle cx="470" cy="191" r="3" fill="#e0b0b8" opacity="0.22" />
        {/* Blossom petals — faint pink */}
        <circle cx="460" cy="188" r="0.5" fill="#e8c0c8" opacity="0.25" />
        <circle cx="479" cy="186" r="0.4" fill="#e8c0c8" opacity="0.22" />
        <circle cx="472" cy="189" r="0.5" fill="#e8c0c8" opacity="0.2" />
      </g>

      {/* === GRASS TUFTS === */}
      <path d="M20 372 Q22 364 24 372" fill="none" stroke="#4a6a30" strokeWidth="0.7" opacity="0.3">
        <animate attributeName="d" values="M20 372 Q22 364 24 372;M20 372 Q23 365 25 372;M20 372 Q22 364 24 372" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M70 365 Q72 358 74 365" fill="none" stroke="#4a6a30" strokeWidth="0.7" opacity="0.28" />
      <path d="M130 364 Q132 357 134 364" fill="none" stroke="#4a6a30" strokeWidth="0.6" opacity="0.25" />

      {/* === ALPINE ROSE BUSHES === */}
      <g opacity="0.35">
        <ellipse cx="175" cy="258" rx="8" ry="5" fill="#2a4a20" opacity="0.3" />
        <circle cx="172" cy="255" r="1.2" fill="#c06080" opacity="0.4" />
        <circle cx="176" cy="253" r="1" fill="#b05070" opacity="0.38" />
        <circle cx="180" cy="256" r="1.1" fill="#c06080" opacity="0.35" />
      </g>

      {/* === SUPPLY WAGON === */}
      <g opacity="0.42">
        <rect x="328" y="374" width="16" height="8" rx="1" fill="url(#ch13_wagonWood)" />
        <circle cx="332" cy="382" r="3" fill="none" stroke="#3a3020" strokeWidth="0.8" opacity="0.4" />
        <circle cx="342" cy="382" r="3" fill="none" stroke="#3a3020" strokeWidth="0.8" opacity="0.4" />
        <path d="M328 374 Q336 368 344 374" fill="#5a5548" opacity="0.35" />
      </g>

      {/* === WIND-BLOWN FLAGS === */}
      <g opacity="0.45">
        <line x1="470" y1="188" x2="470" y2="172" stroke="#3a3020" strokeWidth="0.8" opacity="0.4" />
        <path d="M470 172 L478 174 L478 178 L470 176 Z" fill="url(#ch13_flag)" opacity="0.4">
          <animate attributeName="d" values="M470 172 L478 174 L478 178 L470 176 Z;M470 172 L477 173 L479 177 L470 176 Z;M470 172 L478 174 L478 178 L470 176 Z" dur="2.8s" repeatCount="indefinite" />
        </path>
      </g>
      <g opacity="0.4">
        <line x1="358" y1="356" x2="358" y2="344" stroke="#3a3020" strokeWidth="0.6" opacity="0.35" />
        <path d="M358 344 L365 346 L365 349 L358 347 Z" fill="url(#ch13_flag)" opacity="0.35">
          <animate attributeName="d" values="M358 344 L365 346 L365 349 L358 347 Z;M358 344 L364 345 L366 348 L358 347 Z;M358 344 L365 346 L365 349 L358 347 Z" dur="3.2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === WAYSIDE SHRINE — Alpine crucifix beside the road === */}
      <g opacity="0.55">
        {/* Stone base — weathered block */}
        <rect x="293" y="318" width="6" height="8" rx="0.5" fill="#6a6558" />
        <path d="M293 318 Q296 316 299 318" fill="#7a7568" opacity="0.4" />
        {/* Wooden cross — dark aged timber */}
        <line x1="296" y1="318" x2="296" y2="296" stroke="#3a2a18" strokeWidth="2" />
        <line x1="290" y1="302" x2="302" y2="302" stroke="#3a2a18" strokeWidth="1.5" />
        {/* Christ figure — tiny, dark silhouette */}
        <path d="M294 304 Q296 300 298 304" fill="none" stroke="#2a2018" strokeWidth="0.6" opacity="0.5" />
        <circle cx="296" cy="300" r="1" fill="#2a2018" opacity="0.5" />
        {/* Carved INRI plaque */}
        <rect x="294" y="297" width="4" height="2" rx="0.3" fill="#5a5040" opacity="0.4" />
        {/* Faded paint on cross — weather-worn red */}
        <line x1="296" y1="296" x2="296" y2="298" stroke="#6a3030" strokeWidth="0.4" opacity="0.2" />
        {/* Dried wildflower offerings at the base */}
        <circle cx="291" cy="326" r="0.7" fill="#8a6040" opacity="0.3" />
        <circle cx="293" cy="325" r="0.6" fill="#7a5030" opacity="0.25" />
        <circle cx="300" cy="325" r="0.5" fill="#8a6040" opacity="0.25" />
        {/* Fresh flowers placed by passing soldiers */}
        <circle cx="295" cy="325" r="0.7" fill="#c0a040" opacity="0.35" />
        <circle cx="298" cy="326" r="0.6" fill="#5070b0" opacity="0.3" />
        {/* Lichen on stone base */}
        <ellipse cx="295" cy="322" rx="2" ry="1" fill="#6a7a58" opacity="0.15" />
      </g>

      {/* === REGIMENT DOG — mongrel trotting alongside the column === */}
      <g opacity="0.55">
        <animateTransform attributeName="transform" type="translate" values="0,0;3,0;6,0;3,0;0,0" dur="4s" repeatCount="indefinite" />
        {/* Body — scrappy, lean */}
        <path d="M372 352 Q376 347 381 348 Q386 347 389 352 L387 356 L374 356 Z" fill="#6a5030" />
        {/* Head — alert, ears up */}
        <path d="M389 352 Q392 348 394 350 Q393 353 391 354 Z" fill="#6a5030" />
        {/* Ears — perked up */}
        <path d="M392 348 Q393 345 394 348" fill="none" stroke="#6a5030" strokeWidth="0.8" />
        <path d="M394 348 Q395 346 396 349" fill="none" stroke="#5a4028" strokeWidth="0.6" />
        {/* Eye */}
        <circle cx="393" cy="350" r="0.4" fill="#1a1510" />
        {/* Legs — trotting */}
        <line x1="376" y1="356" x2="375" y2="362" stroke="#6a5030" strokeWidth="0.8">
          <animate attributeName="x2" values="375;374;375" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="380" y1="356" x2="381" y2="362" stroke="#6a5030" strokeWidth="0.8">
          <animate attributeName="x2" values="381;382;381" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="384" y1="356" x2="383" y2="362" stroke="#6a5030" strokeWidth="0.8">
          <animate attributeName="x2" values="383;382;383" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="387" y1="356" x2="388" y2="362" stroke="#6a5030" strokeWidth="0.8">
          <animate attributeName="x2" values="388;389;388" dur="0.8s" repeatCount="indefinite" />
        </line>
        {/* Tail — wagging */}
        <path d="M372 350 Q369 347 368 350" fill="none" stroke="#6a5030" strokeWidth="0.8">
          <animate attributeName="d" values="M372 350 Q369 347 368 350;M372 350 Q369 349 367 352;M372 350 Q369 347 368 350" dur="1.2s" repeatCount="indefinite" />
        </path>
        {/* Tongue — panting */}
        <path d="M394 351 Q395 353 394 354" fill="none" stroke="#c07080" strokeWidth="0.4" opacity="0.5" />
      </g>

      {/* === BIVOUAC REMNANTS — French camp from last night, beside the road === */}
      <g opacity="0.45">
        {/* Fire ring — stones in a circle */}
        <ellipse cx="248" cy="270" rx="5" ry="2.5" fill="none" stroke="#5a5548" strokeWidth="0.8" opacity="0.4" />
        {/* Charred wood */}
        <line x1="246" y1="269" x2="250" y2="271" stroke="#1a1818" strokeWidth="0.6" opacity="0.35" />
        <line x1="247" y1="271" x2="249" y2="269" stroke="#1a1818" strokeWidth="0.5" opacity="0.3" />
        {/* Ash pile — grey center */}
        <ellipse cx="248" cy="270" rx="2.5" ry="1.2" fill="#5a5858" opacity="0.3" />
        {/* Warmth still rising — faint smoke wisp */}
        <path d="M248 268 Q249 264 247 260" fill="none" stroke="#7a7a78" strokeWidth="0.5" opacity="0.08">
          <animate attributeName="opacity" values="0.08;0.04;0.08" dur="5s" repeatCount="indefinite" />
          <animate attributeName="d" values="M248 268 Q249 264 247 260;M248 268 Q250 263 248 259;M248 268 Q249 264 247 260" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Flattened grass where soldiers slept */}
        <ellipse cx="240" cy="274" rx="6" ry="2" fill="#3a4a28" opacity="0.12" />
        <ellipse cx="256" cy="272" rx="5" ry="1.8" fill="#3a4a28" opacity="0.1" />
        {/* Discarded tin mug */}
        <ellipse cx="243" cy="268" rx="1.2" ry="0.8" fill="#6a6a68" opacity="0.25" />
        {/* Chewed bone from rations */}
        <line x1="252" y1="273" x2="256" y2="272" stroke="#8a8878" strokeWidth="0.4" opacity="0.2" />
        {/* Scattered straw from bedding */}
        <path d="M238 275 Q239 273 240 275" fill="none" stroke="#8a7848" strokeWidth="0.3" opacity="0.15" />
        <path d="M244 276 Q245 274 246 276" fill="none" stroke="#8a7848" strokeWidth="0.3" opacity="0.13" />
        <path d="M255 274 Q256 272 257 274" fill="none" stroke="#8a7848" strokeWidth="0.3" opacity="0.12" />
      </g>

      {/* === ADDITIONAL SOLDIERS with individual details === */}
      {/* Soldier carrying wounded comrade's musket — two muskets */}
      <g opacity="0.58">
        <path d="M385 320 Q383 312 385 306 Q387 301 389 306 L391 320 Z" fill="#1a2a50" />
        <circle cx="387" cy="301" r="3.5" fill="#c0a888" opacity="0.6" />
        {/* Shako */}
        <rect x="384" y="297" width="6" height="3.5" rx="0.5" fill="#1a1a18" opacity="0.6" />
        {/* Two muskets on shoulder — carrying for a wounded friend */}
        <line x1="391" y1="302" x2="394" y2="288" stroke="#2a2a28" strokeWidth="0.9" opacity="0.45" />
        <line x1="392" y1="303" x2="395" y2="290" stroke="#2a2a28" strokeWidth="0.8" opacity="0.4" />
        {/* Crossbelts */}
        <line x1="385" y1="304" x2="389" y2="314" stroke="#8a8878" strokeWidth="0.5" opacity="0.3" />
        <line x1="389" y1="304" x2="385" y2="314" stroke="#8a8878" strokeWidth="0.5" opacity="0.3" />
        {/* White trouser legs */}
        <path d="M385 316 L384 326 M389 316 L390 326" fill="none" stroke="#8a8878" strokeWidth="1.2" opacity="0.25" />
        {/* Gaiters — dark at the bottom */}
        <rect x="383" y="322" width="2.5" height="4" fill="#1a1a18" opacity="0.3" />
        <rect x="388.5" y="322" width="2.5" height="4" fill="#1a1a18" opacity="0.3" />
      </g>

      {/* Soldier with bandaged head — walking wounded still in the column */}
      <g opacity="0.55">
        <path d="M405 248 Q403 240 405 234 Q407 229 409 234 L411 248 Z" fill="#1a2a50" opacity="0.7" />
        <circle cx="407" cy="229" r="3.5" fill="#c0a888" opacity="0.6" />
        {/* White bandage wrapped around head */}
        <ellipse cx="407" cy="228" rx="4" ry="2.5" fill="#c0b8a8" opacity="0.25" />
        <path d="M403 227 Q407 225 411 227" fill="none" stroke="#b0a898" strokeWidth="1.2" opacity="0.3" />
        {/* Blood showing through bandage */}
        <circle cx="405" cy="227.5" r="0.8" fill="#6a2020" opacity="0.15" />
        {/* Leaning on musket like a walking stick */}
        <line x1="411" y1="234" x2="414" y2="252" stroke="#2a2a28" strokeWidth="1" opacity="0.5" />
        {/* Coat tail — tattered */}
        <path d="M405 245 Q404 248 403 252" fill="none" stroke="#1a2a50" strokeWidth="1.5" opacity="0.4" />
        <path d="M409 245 Q410 248 411 252" fill="none" stroke="#1a2a50" strokeWidth="1.5" opacity="0.35" />
      </g>

      {/* Veteran sergeant — older, walking with authority */}
      <g opacity="0.6">
        <path d="M418 240 Q416 232 418 226 Q420 221 422 226 L424 240 Z" fill="#1a2a50" opacity="0.75" />
        <circle cx="420" cy="221" r="3.8" fill="#c0a888" opacity="0.62" />
        {/* Bicorne hat — sergeant's distinction */}
        <ellipse cx="420" cy="219" rx="4.5" ry="1.5" fill="#1a1a18" opacity="0.62" />
        {/* Thick mustache */}
        <path d="M418 223 Q420 224 422 223" fill="none" stroke="#3a2a18" strokeWidth="0.6" opacity="0.4" />
        {/* Sergeant's stripe on sleeve */}
        <path d="M416 230 L418 228 L416 226" fill="none" stroke="#c0a050" strokeWidth="0.4" opacity="0.35" />
        {/* Halberd/spontoon — NCO weapon */}
        <line x1="424" y1="222" x2="428" y2="206" stroke="#2a2a28" strokeWidth="1" opacity="0.5" />
        <path d="M427 208 L428 204 L429 208" fill="#6a6a68" opacity="0.4" />
        {/* Heavy pack */}
        <rect x="422" y="226" width="5" height="6" rx="1" fill="#3a3828" opacity="0.5" />
        {/* Canteen hanging from belt */}
        <ellipse cx="416" cy="236" rx="2" ry="2.5" fill="#4a4840" opacity="0.35" />
        <line x1="416" y1="233" x2="418" y2="230" stroke="#4a4030" strokeWidth="0.4" opacity="0.3" />
      </g>

      {/* Two soldiers sharing bread while marching */}
      <g opacity="0.54">
        {/* Soldier A */}
        <path d="M350 360 Q348 352 350 346 Q352 341 354 346 L356 360 Z" fill="#1a2a50" opacity="0.65" />
        <circle cx="352" cy="341" r="3.2" fill="#c0a888" opacity="0.55" />
        <rect x="349" y="337" width="6" height="3" rx="0.5" fill="#1a1a18" opacity="0.55" />
        {/* Arm extended — offering bread */}
        <path d="M354 348 Q358 345 360 343" fill="none" stroke="#1a2a50" strokeWidth="1" opacity="0.5" />
        {/* Bread chunk in hand */}
        <ellipse cx="360" cy="343" rx="1.5" ry="1" fill="#8a7858" opacity="0.4" />
        {/* Soldier B — receiving */}
        <path d="M362 358 Q360 350 362 344 Q364 339 366 344 L368 358 Z" fill="#1a2a50" opacity="0.6" />
        <circle cx="364" cy="339" r="3" fill="#c0a888" opacity="0.52" />
        <rect x="361" y="336" width="5.5" height="2.8" rx="0.5" fill="#1a1a18" opacity="0.52" />
        {/* Arm reaching for bread */}
        <path d="M362 346 Q360 344 360 343" fill="none" stroke="#1a2a50" strokeWidth="0.9" opacity="0.45" />
      </g>

      {/* === SECOND PACK MULE — further back in the column === */}
      <g opacity="0.48">
        {/* Mule body */}
        <path d="M355 375 Q359 370 364 371 Q369 370 372 375 L370 380 L357 380 Z" fill="#4a3828" />
        {/* Head */}
        <path d="M372 375 Q375 372 376 374 Q375 377 373 378 Z" fill="#4a3828" />
        {/* Ears */}
        <path d="M374 372 Q375 369 376 372" fill="none" stroke="#4a3828" strokeWidth="0.7" />
        {/* Legs */}
        <line x1="358" y1="380" x2="357" y2="386" stroke="#4a3828" strokeWidth="1" />
        <line x1="362" y1="380" x2="361" y2="386" stroke="#4a3828" strokeWidth="1" />
        <line x1="367" y1="380" x2="366" y2="386" stroke="#4a3828" strokeWidth="1" />
        <line x1="370" y1="380" x2="369" y2="386" stroke="#4a3828" strokeWidth="1" />
        {/* Heavy sacks loaded on both sides */}
        <rect x="357" y="369" width="6" height="5" rx="1" fill="#5a5040" opacity="0.6" />
        <rect x="365" y="370" width="5" height="4" rx="1" fill="#4a4838" opacity="0.55" />
        {/* Barrel lashed on top */}
        <ellipse cx="363" cy="368" rx="3" ry="2" fill="#4a3a28" opacity="0.5" />
        <ellipse cx="363" cy="367" rx="3" ry="0.8" fill="#5a4a38" opacity="0.35" />
        {/* Rope bindings */}
        <path d="M357 372 Q363 369 370 372" fill="none" stroke="#6a6050" strokeWidth="0.4" opacity="0.4" />
      </g>

      {/* === GLACIER ON HIGH PEAK — ice field catching early light === */}
      <g opacity="0.4">
        {/* Main glacier body — blue-white ice mass */}
        <path d="M100 38 Q115 30 130 35 Q140 32 148 40 L145 60 Q135 55 120 58 Q108 52 100 55 Z" fill="#8a9ab0" opacity="0.25" />
        {/* Ice surface crevasses */}
        <path d="M108 42 Q112 48 110 55" fill="none" stroke="#6a7a90" strokeWidth="0.4" opacity="0.2" />
        <path d="M125 38 Q128 45 126 52" fill="none" stroke="#6a7a90" strokeWidth="0.3" opacity="0.18" />
        <path d="M138 36 Q140 42 138 48" fill="none" stroke="#6a7a90" strokeWidth="0.4" opacity="0.15" />
        {/* Glacier terminus — moraine debris */}
        <ellipse cx="120" cy="58" rx="12" ry="2" fill="#5a5a55" opacity="0.15" />
        {/* Blue ice exposed in crevasse */}
        <path d="M118 44 Q120 50 118 54" fill="none" stroke="#5a8ab0" strokeWidth="0.6" opacity="0.12" />
        {/* Sunlit glacier edge — catching dawn pink */}
        <path d="M100 40 Q110 34 125 36" fill="none" stroke="#c0a8a0" strokeWidth="0.5" opacity="0.15" />
      </g>

      {/* === SCREE SLOPES — loose rock debris below cliffs === */}
      {/* Left scree field */}
      <g opacity="0.3">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <circle key={`screeL${i}`}
            cx={170 + (i % 4) * 8 + (i * 3) % 7}
            cy={210 + Math.floor(i / 4) * 6 + (i * 5) % 8}
            r={0.6 + (i % 3) * 0.3}
            fill="#4a4a45" opacity={0.3 - i * 0.015} />
        ))}
      </g>
      {/* Right scree field */}
      <g opacity="0.28">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <circle key={`screeR${i}`}
            cx={620 + (i % 4) * 7 + (i * 4) % 6}
            cy={205 + Math.floor(i / 4) * 5 + (i * 3) % 7}
            r={0.5 + (i % 3) * 0.25}
            fill="#4a4a45" opacity={0.28 - i * 0.015} />
        ))}
      </g>

      {/* === DETAILED PINE TREE — large foreground conifer at roadside === */}
      <g opacity="0.5">
        {/* Thick trunk */}
        <rect x="225" y="260" width="3" height="22" fill="#2a1a10" opacity="0.6" />
        {/* Bark texture */}
        <path d="M225 265 Q226 264 228 265" fill="none" stroke="#3a2a18" strokeWidth="0.4" opacity="0.3" />
        <path d="M225 270 Q226 269 228 270" fill="none" stroke="#3a2a18" strokeWidth="0.3" opacity="0.25" />
        <path d="M225 275 Q226 274 228 275" fill="none" stroke="#3a2a18" strokeWidth="0.4" opacity="0.2" />
        {/* Layered branches — descending tiers */}
        <path d="M226 250 L218 262 L234 262 Z" fill="#0a2810" opacity="0.55" />
        <path d="M226 244 L216 258 L236 258 Z" fill="#0a2810" opacity="0.5" />
        <path d="M226 238 L214 254 L238 254 Z" fill="#0a2810" opacity="0.45" />
        <path d="M226 232 L218 248 L234 248 Z" fill="#0a2810" opacity="0.4" />
        <path d="M226 228 L221 240 L231 240 Z" fill="#0a2810" opacity="0.35" />
        {/* Branch undersides — slightly lighter */}
        <line x1="218" y1="262" x2="226" y2="256" stroke="#1a3818" strokeWidth="0.4" opacity="0.15" />
        <line x1="216" y1="258" x2="226" y2="250" stroke="#1a3818" strokeWidth="0.4" opacity="0.12" />
        {/* Pine needles catching dawn light */}
        <circle cx="232" cy="254" r="1" fill="#3a6a20" opacity="0.2" />
        <circle cx="234" cy="258" r="0.8" fill="#3a6a20" opacity="0.18" />
        <circle cx="220" cy="256" r="0.9" fill="#3a6a20" opacity="0.15" />
        {/* Pinecone — small, hanging */}
        <ellipse cx="233" cy="260" rx="0.8" ry="1.2" fill="#4a3828" opacity="0.3" />
      </g>

      {/* === DISTANT AUSTRIAN FARMSTEADS visible through the pass === */}
      <g opacity="0.2">
        {/* Farmhouse 1 — whitewashed walls */}
        <rect x="375" y="160" width="4" height="3" fill="#8a8878" opacity="0.35" />
        <path d="M374 160 L377 157 L380 160 Z" fill="#5a4538" opacity="0.3" />
        {/* Farmhouse 2 */}
        <rect x="395" y="162" width="3" height="2.5" fill="#8a8878" opacity="0.3" />
        <path d="M394 162 L396.5 159 L399 162 Z" fill="#5a4538" opacity="0.25" />
        {/* Barn */}
        <rect x="402" y="164" width="5" height="3" fill="#6a5a48" opacity="0.25" />
        <path d="M401 164 L404.5 161 L408 164 Z" fill="#4a3a28" opacity="0.2" />
        {/* Hay stacks */}
        <ellipse cx="410" cy="167" rx="2" ry="1.2" fill="#8a7848" opacity="0.15" />
        <ellipse cx="414" cy="167.5" rx="1.5" ry="1" fill="#8a7848" opacity="0.12" />
        {/* Fence lines — tiny dashes across the fields */}
        <path d="M368 167 Q378 165 388 167" fill="none" stroke="#4a4a38" strokeWidth="0.3" opacity="0.15" />
        <path d="M398 166 Q408 164 418 166" fill="none" stroke="#4a4a38" strokeWidth="0.3" opacity="0.12" />
        {/* Distant road winding through fields */}
        <path d="M380 170 Q390 168 400 170 Q410 167 420 170" fill="none" stroke="#6a6050" strokeWidth="0.5" opacity="0.1" />
      </g>

      {/* === MORE CLOUD DETAIL — layered cirrus and cumulus === */}
      {/* Low cumulus bank building on right horizon */}
      <ellipse cx="720" cy="78" rx="60" ry="10" fill="url(#ch13_cloud)" opacity="0.2">
        <animate attributeName="cx" values="720;730;720" dur="22s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="720" cy="82" rx="55" ry="5" fill="#c09858" opacity="0.06" />
      {/* Thin lenticular cloud above the pass — classic mountain wave */}
      <ellipse cx="400" cy="80" rx="50" ry="5" fill="url(#ch13_cloudWisp)" opacity="0.3">
        <animate attributeName="cx" values="400;415;400" dur="35s" repeatCount="indefinite" />
      </ellipse>
      {/* Low mist curling into the pass */}
      <ellipse cx="330" cy="148" rx="30" ry="4" fill="#a0a8b0" opacity="0.07">
        <animate attributeName="cx" values="330;350;330" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.12;0.07" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="470" cy="152" rx="25" ry="3.5" fill="#a0a8b0" opacity="0.06">
        <animate attributeName="cx" values="470;450;470" dur="20s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="20s" repeatCount="indefinite" />
      </ellipse>

      {/* === ADDITIONAL ROAD DETAIL — switchback visible lower down === */}
      <g opacity="0.25">
        {/* Lower switchback — road zigzagging up from valley */}
        <path d="M200 340 Q220 335 240 342 Q260 348 280 345" fill="none" stroke="url(#ch13_road)" strokeWidth="8" strokeLinecap="round" />
        {/* Road edge markers */}
        <path d="M200 336 Q220 331 240 338 Q260 344 280 341" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.3" />
        <path d="M200 344 Q220 339 240 346 Q260 352 280 349" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.3" />
        {/* Tiny soldiers on the lower switchback */}
        {[0, 1, 2, 3, 4].map((i) => (
          <React.Fragment key={`switchback${i}`}>
            <path d={`M${220 + i * 12} ${338 + (i % 2) * 3} Q${219 + i * 12} ${335 + (i % 2) * 3} ${220 + i * 12} ${333 + (i % 2) * 3}`}
              fill="none" stroke="#151510" strokeWidth="1" opacity={0.2 - i * 0.02} />
            <circle cx={220 + i * 12} cy={332 + (i % 2) * 3} r={1.2 - i * 0.1}
              fill="#151510" opacity={0.2 - i * 0.02} />
          </React.Fragment>
        ))}
      </g>

      {/* === DETAILED FOREGROUND SOLDIER — largest, closest to viewer === */}
      <g opacity="0.72">
        {/* Body — blue coat with visible details */}
        <path d="M310 388 Q308 378 310 368 Q312 362 314 368 L316 388 Z" fill="#1a2a50" />
        {/* White turnbacks on coat */}
        <path d="M310 384 Q309 387 308 390" fill="none" stroke="#b0a898" strokeWidth="1.2" opacity="0.3" />
        <path d="M314 384 Q315 387 316 390" fill="none" stroke="#b0a898" strokeWidth="1.2" opacity="0.28" />
        {/* White trousers */}
        <path d="M310 384 L309 398 M314 384 L315 398" fill="none" stroke="#9a9888" strokeWidth="1.8" opacity="0.3" />
        {/* Gaiters */}
        <rect x="308" y="394" width="3" height="5" fill="#1a1a18" opacity="0.35" />
        <rect x="313.5" y="394" width="3" height="5" fill="#1a1a18" opacity="0.35" />
        {/* Head — visible features due to proximity */}
        <circle cx="312" cy="362" r="5" fill="#c0a888" opacity="0.65" />
        {/* Shako hat — tall, cylindrical */}
        <rect x="307.5" y="356" width="9" height="5.5" rx="0.5" fill="#1a1a18" opacity="0.65" />
        {/* Shako plate — brass diamond */}
        <path d="M312 358 L313.5 359 L312 360 L310.5 359 Z" fill="#c0a050" opacity="0.3" />
        {/* Shako visor */}
        <rect x="307" y="361" width="10" height="1" rx="0.3" fill="#1a1a18" opacity="0.5" />
        {/* Chin strap */}
        <path d="M308 361 Q312 363 316 361" fill="none" stroke="#c0a050" strokeWidth="0.3" opacity="0.3" />
        {/* Red plume */}
        <path d="M316 357 Q317 354 316 351" fill="none" stroke="#8a2020" strokeWidth="1.2" opacity="0.5" />
        {/* Cockade — small tricolor rosette */}
        <circle cx="316" cy="357" r="1" fill="#2040a0" opacity="0.3" />
        <circle cx="316" cy="357" r="0.5" fill="#a02020" opacity="0.25" />
        {/* Face detail — eyes and nose */}
        <circle cx="310.5" cy="362" r="0.5" fill="#3a2a18" opacity="0.4" />
        <circle cx="313.5" cy="362" r="0.5" fill="#3a2a18" opacity="0.4" />
        <path d="M311.5 363.5 Q312 364 312.5 363.5" fill="none" stroke="#7a6858" strokeWidth="0.3" opacity="0.3" />
        {/* Crossbelts — white leather X */}
        <line x1="310" y1="366" x2="314" y2="380" stroke="#9a9888" strokeWidth="0.7" opacity="0.35" />
        <line x1="314" y1="366" x2="310" y2="380" stroke="#9a9888" strokeWidth="0.7" opacity="0.35" />
        {/* Cartridge box — at hip */}
        <rect x="315" y="376" width="3" height="2.5" rx="0.5" fill="#1a1a18" opacity="0.45" />
        {/* Brass cartridge box plate */}
        <ellipse cx="316.5" cy="377" rx="0.8" ry="0.5" fill="#c0a050" opacity="0.2" />
        {/* Pack on back — brown leather */}
        <rect x="314" y="368" width="6" height="7" rx="1" fill="#3a3828" opacity="0.55" />
        {/* Rolled blanket on top of pack */}
        <ellipse cx="317" cy="367" rx="3" ry="1.5" fill="#4a4a40" opacity="0.4" />
        {/* Canteen — round wooden */}
        <circle cx="308" cy="374" r="2.5" fill="#5a4a38" opacity="0.4" />
        <circle cx="308" cy="374" r="1.8" fill="#4a3a28" opacity="0.3" />
        <line x1="308" y1="371" x2="310" y2="368" stroke="#4a3a28" strokeWidth="0.4" opacity="0.3" />
        {/* Bayonet scabbard at hip */}
        <line x1="307" y1="378" x2="306" y2="386" stroke="#1a1a18" strokeWidth="0.8" opacity="0.4" />
        {/* Musket — at shoulder carry */}
        <line x1="305" y1="364" x2="302" y2="398" stroke="#2a2a28" strokeWidth="1.5" opacity="0.55" />
        {/* Musket lock detail */}
        <rect x="303" y="378" width="2" height="1" fill="#6a6a68" opacity="0.3" />
        {/* Bayonet tip — glinting */}
        <line x1="302" y1="396" x2="301" y2="400" stroke="#8a8a88" strokeWidth="0.5" opacity="0.35" />
        <circle cx="301.5" cy="399" r="0.5" fill="#c0b890" opacity="0.1">
          <animate attributeName="opacity" values="0.1;0.22;0.1" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === ADDITIONAL FOREGROUND SOLDIER — second close figure === */}
      <g opacity="0.68">
        <path d="M325 392 Q323 382 325 374 Q327 369 329 374 L331 392 Z" fill="#1a2a50" />
        <circle cx="327" cy="369" r="4.5" fill="#c0a888" opacity="0.6" />
        {/* Shako */}
        <rect x="323" y="364" width="8" height="4.5" rx="0.5" fill="#1a1a18" opacity="0.6" />
        {/* White crossbelts */}
        <line x1="325" y1="373" x2="329" y2="385" stroke="#9a9888" strokeWidth="0.6" opacity="0.3" />
        <line x1="329" y1="373" x2="325" y2="385" stroke="#9a9888" strokeWidth="0.6" opacity="0.3" />
        {/* Pack */}
        <rect x="329" y="374" width="5" height="6" rx="1" fill="#3a3828" opacity="0.5" />
        {/* Musket */}
        <line x1="321" y1="370" x2="319" y2="395" stroke="#2a2a28" strokeWidth="1.2" opacity="0.5" />
        {/* Arm swinging while marching */}
        <path d="M325 376 Q322 380 323 384" fill="none" stroke="#1a2a50" strokeWidth="1" opacity="0.4">
          <animate attributeName="d" values="M325 376 Q322 380 323 384;M325 376 Q321 379 322 383;M325 376 Q322 380 323 384" dur="2.5s" repeatCount="indefinite" />
        </path>
        {/* Trouser legs */}
        <path d="M325 388 L324 400 M329 388 L330 400" fill="none" stroke="#8a8878" strokeWidth="1.4" opacity="0.25" />
      </g>

      {/* === WORN TRAIL MARKERS — scratched route indicators on rocks === */}
      {/* Arrow carved into roadside boulder */}
      <g opacity="0.25">
        <path d="M307 358 L312 356 L307 354" fill="none" stroke="#7a7a78" strokeWidth="0.5" />
        <line x1="302" y1="356" x2="312" y2="356" stroke="#7a7a78" strokeWidth="0.5" />
      </g>
      {/* "N" carved into rock — Napoleon's route */}
      <text x="274" y="281" fontSize="3" fontFamily="serif" fill="#6a6a68" opacity="0.15" transform="rotate(-5, 275, 280)">N</text>

      {/* === MOUNTAIN STREAM FORD — shallow crossing point on the road === */}
      <g opacity="0.35">
        {/* Shallow water spreading across the road */}
        <ellipse cx="385" cy="292" rx="15" ry="4" fill="#5a8aa0" opacity="0.15" />
        {/* Water sheen — dawn reflected */}
        <ellipse cx="385" cy="291" rx="10" ry="2" fill="#c0a050" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.1;0.06" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Stepping stones laid in the ford */}
        <circle cx="380" cy="292" r="2" fill="#5a5a55" opacity="0.3" />
        <circle cx="385" cy="290" r="1.8" fill="#5a5a55" opacity="0.28" />
        <circle cx="390" cy="293" r="2.2" fill="#5a5a55" opacity="0.3" />
        {/* Water ripples around the stones */}
        <ellipse cx="380" cy="292" rx="3" ry="1" fill="none" stroke="#8ab8d0" strokeWidth="0.3" opacity="0.15">
          <animate attributeName="rx" values="3;4;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.06;0.15" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="390" cy="293" rx="3.5" ry="1.2" fill="none" stroke="#8ab8d0" strokeWidth="0.3" opacity="0.12">
          <animate attributeName="rx" values="3.5;4.5;3.5" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.12;0.05;0.12" dur="2.3s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* === SNOW CORNICES on peak ridgelines — overhanging snow shelves === */}
      {/* Left peak cornice */}
      <path d="M105 23 Q112 18 120 22 Q118 24 112 25 Q108 24 105 23 Z" fill="#c8c0b8" opacity="0.3" />
      <path d="M106 24 Q108 28 105 30" fill="none" stroke="#b0a8a0" strokeWidth="0.6" opacity="0.15" />
      {/* Right peak cornice */}
      <path d="M730 18 Q738 13 748 18 Q744 20 738 21 Q734 20 730 18 Z" fill="#c8c0b8" opacity="0.28" />
      <path d="M732 19 Q734 23 731 26" fill="none" stroke="#b0a8a0" strokeWidth="0.5" opacity="0.13" />

      {/* === WIND STREAKS — visible wind patterns in the air === */}
      {/* Wind lines showing the alpine breeze direction */}
      <path d="M320 150 Q340 148 360 150" fill="none" stroke="#a0a8b0" strokeWidth="0.3" opacity="0.06">
        <animate attributeName="d" values="M320 150 Q340 148 360 150;M325 149 Q345 147 365 149;M320 150 Q340 148 360 150" dur="5s" repeatCount="indefinite" />
      </path>
      <path d="M430 155 Q450 153 470 155" fill="none" stroke="#a0a8b0" strokeWidth="0.3" opacity="0.05">
        <animate attributeName="d" values="M430 155 Q450 153 470 155;M435 154 Q455 152 475 154;M430 155 Q450 153 470 155" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M350 180 Q375 177 400 180" fill="none" stroke="#a0a8b0" strokeWidth="0.25" opacity="0.04">
        <animate attributeName="d" values="M350 180 Q375 177 400 180;M355 179 Q380 176 405 179;M350 180 Q375 177 400 180" dur="4.5s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL MARCHING DUST — kicked up by the column === */}
      {/* Larger dust cloud behind the main group */}
      <ellipse cx="400" cy="255" rx="20" ry="6" fill="#b0a890" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.09;0.05" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="20;25;20" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Thin dust haze along the road surface */}
      <ellipse cx="370" cy="298" rx="15" ry="4" fill="#a09880" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Dust behind the artillery train */}
      <ellipse cx="335" cy="368" rx="18" ry="5" fill="#b0a890" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="4.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Dust settling behind the supply wagon */}
      <ellipse cx="395" cy="350" rx="12" ry="4" fill="#a09880" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.06;0.04" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {/* === STONE WALL REMNANTS — ancient Alpine fortification === */}
      <g opacity="0.3">
        {/* Ruined wall sections — old boundary or fort wall */}
        <rect x="530" cy="272" width="18" height="6" rx="0.5" fill="#5a5a55" y="262" />
        {/* Individual stone blocks visible */}
        <line x1="535" y1="262" x2="535" y2="268" stroke="#4a4a45" strokeWidth="0.4" opacity="0.3" />
        <line x1="540" y1="262" x2="540" y2="268" stroke="#4a4a45" strokeWidth="0.4" opacity="0.3" />
        <line x1="545" y1="262" x2="545" y2="268" stroke="#4a4a45" strokeWidth="0.4" opacity="0.3" />
        {/* Mortar line */}
        <line x1="530" y1="265" x2="548" y2="265" stroke="#4a4a45" strokeWidth="0.3" opacity="0.25" />
        {/* Collapsed section */}
        <path d="M548 268 Q552 265 555 268" fill="#5a5a55" opacity="0.2" />
        {/* Rubble from collapse */}
        <circle cx="552" cy="270" r="1" fill="#5a5a55" opacity="0.2" />
        <circle cx="555" cy="271" r="0.7" fill="#4a4a45" opacity="0.18" />
        {/* Ivy growing on the old wall */}
        <circle cx="533" cy="263" r="1.5" fill="#3a5a28" opacity="0.2" />
        <circle cx="538" cy="264" r="1.2" fill="#4a6a30" opacity="0.18" />
        <circle cx="544" cy="262" r="1" fill="#3a5a28" opacity="0.15" />
      </g>

      {/* === HORSESHOE — lost on the road, small metal detail === */}
      <path d="M395 310 Q393 306 397 306 Q401 306 399 310" fill="none" stroke="#5a5a58" strokeWidth="0.6" opacity="0.2" />

      {/* === ADDITIONAL SPRING DETAILS — catkins and pussy willows === */}
      {/* Willow branch near the stream */}
      <g opacity="0.35">
        <path d="M235 280 Q230 275 228 268" fill="none" stroke="#4a3a28" strokeWidth="0.8" />
        <path d="M232 276 Q228 272 226 266" fill="none" stroke="#4a3a28" strokeWidth="0.6" />
        {/* Catkins — fuzzy spring buds */}
        <ellipse cx="228" cy="267" rx="1" ry="1.5" fill="#c8c0a8" opacity="0.35" />
        <ellipse cx="226" cy="265" rx="0.8" ry="1.2" fill="#c8c0a8" opacity="0.3" />
        <ellipse cx="230" cy="270" rx="0.9" ry="1.3" fill="#c8c0a8" opacity="0.3" />
      </g>

      {/* === ADDITIONAL ROCK FACE FEATURES — geological detail === */}
      {/* Quartz vein in left mountain — white streak in dark rock */}
      <path d="M55 120 Q58 135 53 155 Q56 172 52 190" fill="none" stroke="#7a7a78" strokeWidth="0.8" opacity="0.12" />
      {/* Iron oxide staining — reddish patches on rock */}
      <ellipse cx="170" cy="140" rx="5" ry="8" fill="#5a3a30" opacity="0.06" />
      <ellipse cx="640" cy="130" rx="4" ry="6" fill="#5a3a30" opacity="0.05" />
      {/* Horizontal bedding planes visible in cliff face */}
      <path d="M605 130 Q630 128 660 132" fill="none" stroke="#3a3a38" strokeWidth="0.4" opacity="0.1" />
      <path d="M610 155 Q640 152 670 158" fill="none" stroke="#3a3a38" strokeWidth="0.3" opacity="0.08" />

      {/* === SOLDIER SHADOWS on the road — long morning shadows === */}
      {/* Closest soldier shadow — longest, most visible */}
      <ellipse cx="304" cy="395" rx="8" ry="2" fill="#1a1a18" opacity="0.08" transform="rotate(-15, 304, 395)" />
      {/* Main group shadows */}
      <ellipse cx="378" cy="290" rx="5" ry="1.5" fill="#1a1a18" opacity="0.06" transform="rotate(-20, 378, 290)" />
      <ellipse cx="392" cy="282" rx="5" ry="1.5" fill="#1a1a18" opacity="0.05" transform="rotate(-20, 392, 282)" />
      <ellipse cx="368" cy="316" rx="4.5" ry="1.2" fill="#1a1a18" opacity="0.05" transform="rotate(-18, 368, 316)" />

      {/* === ROAD SURFACE DETAIL — wheel ruts closer to viewer === */}
      {/* Deep rut from wagon wheels */}
      <path d="M290 395 Q298 380 310 365 Q325 345 340 328" fill="none" stroke="#3a3028" strokeWidth="2" opacity="0.08" />
      <path d="M310 398 Q318 382 328 366 Q342 346 355 332" fill="none" stroke="#3a3028" strokeWidth="2" opacity="0.08" />
      {/* Mud patches from spring melt — darker, wetter spots */}
      <ellipse cx="302" cy="380" rx="4" ry="2" fill="#2a2520" opacity="0.12" />
      <ellipse cx="335" cy="345" rx="3.5" ry="1.8" fill="#2a2520" opacity="0.1" />
      <ellipse cx="370" cy="305" rx="3" ry="1.5" fill="#2a2520" opacity="0.08" />

      {/* === ADDITIONAL FOREGROUND GRASS AND WEEDS === */}
      {/* Grass clumps along the left edge */}
      <path d="M15 380 Q17 372 19 380" fill="none" stroke="#3a5a28" strokeWidth="0.8" opacity="0.32">
        <animate attributeName="d" values="M15 380 Q17 372 19 380;M15 380 Q18 373 20 380;M15 380 Q17 372 19 380" dur="3.8s" repeatCount="indefinite" />
      </path>
      <path d="M25 378 Q27 371 29 378" fill="none" stroke="#3a5a28" strokeWidth="0.7" opacity="0.3" />
      <path d="M35 376 Q37 369 39 376" fill="none" stroke="#3a5a28" strokeWidth="0.7" opacity="0.28">
        <animate attributeName="d" values="M35 376 Q37 369 39 376;M35 376 Q38 370 40 376;M35 376 Q37 369 39 376" dur="4.2s" repeatCount="indefinite" />
      </path>
      <path d="M45 374 Q47 367 49 374" fill="none" stroke="#3a5a28" strokeWidth="0.6" opacity="0.26" />
      {/* Dandelion puffs — seed heads catching the breeze */}
      <circle cx="32" cy="370" r="2" fill="#d0d0c8" opacity="0.12" />
      <circle cx="32" cy="370" r="0.5" fill="#8a8a78" opacity="0.15" />
      {/* Seeds drifting away */}
      <circle cx="35" cy="365" r="0.3" fill="#d0d0c8" opacity="0.08">
        <animate attributeName="cx" values="35;42;49" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="365;360;358" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.04;0" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="367" r="0.25" fill="#d0d0c8" opacity="0.06">
        <animate attributeName="cx" values="30;38;46" dur="9s" repeatCount="indefinite" />
        <animate attributeName="cy" values="367;363;360" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0" dur="9s" repeatCount="indefinite" />
      </circle>

      {/* === FALLEN PINECONES on the ground near trees === */}
      <ellipse cx="222" cy="282" rx="1" ry="1.5" fill="#4a3828" opacity="0.25" />
      <ellipse cx="228" cy="280" rx="0.8" ry="1.2" fill="#4a3828" opacity="0.22" />
      <ellipse cx="560" cy="195" rx="0.8" ry="1.2" fill="#4a3828" opacity="0.2" />

      {/* === SPIDER WEB on the wayside shrine — morning dew === */}
      <g opacity="0.15">
        <path d="M290 304 Q286 300 290 296" fill="none" stroke="#c0c0b8" strokeWidth="0.2" />
        <path d="M290 304 Q284 304 282 300" fill="none" stroke="#c0c0b8" strokeWidth="0.2" />
        <path d="M290 304 Q287 308 284 308" fill="none" stroke="#c0c0b8" strokeWidth="0.2" />
        {/* Dew drops on web */}
        <circle cx="287" cy="301" r="0.3" fill="#e0e8f0" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="285" cy="305" r="0.25" fill="#e0e8f0" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.6;0.35" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === ROCK CAIRN — trail marker stack of stones === */}
      <g opacity="0.4">
        <ellipse cx="455" cy="208" rx="3" ry="1.5" fill="#6a6558" />
        <ellipse cx="455" cy="206" rx="2.2" ry="1.2" fill="#7a7568" />
        <ellipse cx="455" cy="204.5" rx="1.5" ry="0.8" fill="#6a6558" />
        <ellipse cx="455" cy="203.5" rx="0.8" ry="0.5" fill="#7a7568" />
      </g>

      {/* === ADDITIONAL DISTANT COLUMN sections visible through gaps === */}
      {/* Column visible on the far side of the pass — heading down into Austria */}
      <g opacity="0.12">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <React.Fragment key={`farColumn${i}`}>
            <path d={`M${440 + i * 6} ${165 + (i % 3) * 2} Q${439 + i * 6} ${162 + (i % 3) * 2} ${440 + i * 6} ${160 + (i % 3) * 2}`}
              fill="none" stroke="#151510" strokeWidth="0.8" opacity={0.15 - i * 0.015} />
            <circle cx={440 + i * 6} cy={159 + (i % 3) * 2} r={0.8}
              fill="#151510" opacity={0.15 - i * 0.015} />
          </React.Fragment>
        ))}
      </g>

      {/* === MOUNTAIN HAWK circling — additional raptor === */}
      <g opacity="0.2">
        <animateTransform attributeName="transform" type="translate" values="0,0;-15,6;-30,0;-15,-6;0,0" dur="16s" repeatCount="indefinite" />
        <path d="M520 78 Q525 72 530 76 Q535 72 540 78" fill="none" stroke="#1a1a28" strokeWidth="0.8">
          <animate attributeName="d" values="M520 78 Q525 72 530 76 Q535 72 540 78;M522 77 Q525 74 530 76 Q535 74 538 77;M520 78 Q525 72 530 76 Q535 72 540 78" dur="3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === ADDITIONAL SPRING STREAM DETAILS === */}
      {/* Small tributary joining the main stream */}
      <path d="M195 310 Q210 304 225 298" fill="none" stroke="#5a8aa0" strokeWidth="1.5" opacity="0.12" />
      <path d="M195 310 Q210 304 225 298" fill="none" stroke="#8ab0c8" strokeWidth="0.5" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.14;0.08" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Small waterfall into the tributary */}
      <path d="M192 305 Q194 308 193 310" fill="none" stroke="#b0c8d8" strokeWidth="0.8" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.18;0.1" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* === MORE LICHEN and MOSS DETAIL === */}
      {/* Orange lichen on sunny-side rocks */}
      <ellipse cx="310" cy="360" rx="2" ry="1" fill="#8a6030" opacity="0.1" />
      <ellipse cx="420" cy="250" rx="1.5" ry="0.8" fill="#8a6030" opacity="0.08" />
      <ellipse cx="278" cy="285" rx="1.8" ry="0.9" fill="#8a6030" opacity="0.09" />
      {/* Grey crustose lichen on old rocks */}
      <ellipse cx="305" cy="365" rx="2.5" ry="1.2" fill="#7a7a78" opacity="0.08" />
      <ellipse cx="455" cy="210" rx="1.5" ry="0.8" fill="#7a7a78" opacity="0.07" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Golden dawn warmth across the whole scene */}
      <rect width="800" height="400" fill="#c09050" opacity="0.05" />
      {/* Warm rose-gold wash on the lower sky */}
      <rect x="0" y="80" width="800" height="100" fill="#d08060" opacity="0.03" />

      {/* Morning haze layers — atmospheric depth */}
      <ellipse cx="400" cy="145" rx="220" ry="25" fill="#b8a888" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.09;0.06" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="380" cy="175" rx="180" ry="20" fill="#c8b898" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="160" rx="150" ry="18" fill="#d0c0a0" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="11s" repeatCount="indefinite" />
      </ellipse>

      {/* Valley haze — low-lying mist in the gorge */}
      <ellipse cx="200" cy="280" rx="120" ry="15" fill="#a0b0c0" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.12;0.08" dur="15s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="620" cy="275" rx="100" ry="12" fill="#a8b8c8" opacity="0.07">
        <animate attributeName="opacity" values="0.07;0.11;0.07" dur="14s" repeatCount="indefinite" />
      </ellipse>

      {/* Gentle golden haze in the middle distance */}
      <ellipse cx="400" cy="185" rx="200" ry="30" fill="#c0a050" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="8s" repeatCount="indefinite" />
      </ellipse>

      {/* Bright horizon glow — hope radiating from the pass gap */}
      <ellipse cx="400" cy="148" rx="60" ry="18" fill="#e8c860" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="7s" repeatCount="indefinite" />
        <animate attributeName="rx" values="60;68;60" dur="7s" repeatCount="indefinite" />
      </ellipse>

      {/* Dawn dust in the air — fine particles catching light */}
      <ellipse cx="350" cy="220" rx="80" ry="35" fill="#d8c8a0" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="9s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="210" rx="70" ry="30" fill="#d0c098" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="10s" repeatCount="indefinite" />
      </ellipse>

      {/* Road dust from marching column */}
      <ellipse cx="380" cy="280" rx="30" ry="8" fill="#b0a890" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="360" cy="320" rx="25" ry="6" fill="#a09880" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="5.5s" repeatCount="indefinite" />
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
