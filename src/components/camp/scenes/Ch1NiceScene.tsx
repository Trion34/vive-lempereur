import React from 'react';

/**
 * Ch.1 — Army of Italy, Nice coastal garrison (March 1796)
 * Overcast dusk. Ragged camp near Mediterranean coast. Broken shoes, tattered
 * uniforms, thin blankets, barely-alive campfires. The army hasn't been paid
 * in months, hasn't eaten properly in weeks. Grey skies, cold wind off the sea.
 * Nice's old city walls visible in the distance.
 * Mood: Bleak, hungry, restless — but a spark of defiance.
 */
export function Ch1NiceScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Overcast dusk sky — grey-purple with thin warm band at horizon */}
        <linearGradient id="ch1_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2530" />
          <stop offset="25%" stopColor="#353040" />
          <stop offset="50%" stopColor="#3a3540" />
          <stop offset="70%" stopColor="#504a55" />
          <stop offset="85%" stopColor="#6a5a50" />
          <stop offset="95%" stopColor="#7a6548" />
          <stop offset="100%" stopColor="#8a6a4a" />
        </linearGradient>
        {/* Sea — cold grey-blue */}
        <linearGradient id="ch1_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5565" />
          <stop offset="40%" stopColor="#405060" />
          <stop offset="70%" stopColor="#3a4555" />
          <stop offset="100%" stopColor="#2a3545" />
        </linearGradient>
        {/* Sea reflection of horizon */}
        <linearGradient id="ch1_seaReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a6550" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7a6550" stopOpacity="0" />
        </linearGradient>
        {/* Ground — dusty brown-grey */}
        <linearGradient id="ch1_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="50%" stopColor="#332e28" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        {/* Dim fire glow */}
        <radialGradient id="ch1_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#a06030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Distant fire 2 glow */}
        <radialGradient id="ch1_distFire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* City walls */}
        <linearGradient id="ch1_walls" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5050" />
          <stop offset="100%" stopColor="#403838" />
        </linearGradient>
        {/* Mist band */}
        <linearGradient id="ch1_mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5560" stopOpacity="0" />
          <stop offset="50%" stopColor="#5a5560" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a5560" stopOpacity="0" />
        </linearGradient>
        {/* Coastal mist */}
        <linearGradient id="ch1_coastMist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4a55" stopOpacity="0" />
          <stop offset="30%" stopColor="#4a4a55" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#4a4a55" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#4a4a55" stopOpacity="0" />
        </linearGradient>
        {/* Vignette */}
        <radialGradient id="ch1_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
        {/* Wind-blown smoke pattern */}
        <linearGradient id="ch1_windSmoke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a6560" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#6a6560" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6a6560" stopOpacity="0" />
        </linearGradient>
        {/* Muddy path fill — darker, wetter brown */}
        <linearGradient id="ch1_mudPath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2418" />
          <stop offset="100%" stopColor="#252018" />
        </linearGradient>
        {/* Signal fire glow — distant beacon */}
        <radialGradient id="ch1_signalGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a06030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Rowboat wood */}
        <linearGradient id="ch1_boatWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3025" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>
        {/* Lantern glow — warm dim amber */}
        <radialGradient id="ch1_lanternGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b08040" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#a07030" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a07030" stopOpacity="0" />
        </radialGradient>
        {/* Rusty iron for anchor */}
        <linearGradient id="ch1_rustyIron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3a28" />
          <stop offset="100%" stopColor="#3a2a1a" />
        </linearGradient>
        {/* Ground texture noise — subtle earth variation */}
        <filter id="ch1_groundNoise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="42" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
        </filter>
        {/* Damp earth sheen — for puddles and wet ground */}
        <radialGradient id="ch1_dampSheen" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a6570" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#4a5560" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#4a5560" stopOpacity="0" />
        </radialGradient>
        {/* Sea haze — horizontal atmospheric band */}
        <linearGradient id="ch1_seaHaze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4a58" stopOpacity="0.06" />
          <stop offset="25%" stopColor="#4a4a58" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#4a4a58" stopOpacity="0.12" />
          <stop offset="75%" stopColor="#4a4a58" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#4a4a58" stopOpacity="0.04" />
        </linearGradient>
        {/* Fire reflection on sea — warm glow on water */}
        <radialGradient id="ch1_fireSeaReflect" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Horizon glow band — thin warm light at dusk */}
        <linearGradient id="ch1_horizonWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6a4a" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#7a5a3a" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#7a5a3a" stopOpacity="0" />
        </linearGradient>
        {/* Lichen texture — grey-green patches on rock */}
        <radialGradient id="ch1_lichen" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3a4530" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3a4530" stopOpacity="0" />
        </radialGradient>
        {/* Harbor water shimmer — rippling golden light on dark water */}
        <linearGradient id="ch1_harborShimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6a4a" stopOpacity="0" />
          <stop offset="20%" stopColor="#8a6a4a" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#9a7a50" stopOpacity="0.07" />
          <stop offset="80%" stopColor="#8a6a4a" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#8a6a4a" stopOpacity="0" />
        </linearGradient>
        {/* Dusk sky glow — warm amber bleed into lower clouds */}
        <radialGradient id="ch1_duskBleed" cx="0.4" cy="0.85" r="0.6">
          <stop offset="0%" stopColor="#8a6540" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#6a5030" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#6a5030" stopOpacity="0" />
        </radialGradient>
        {/* Chimney smoke drift */}
        <linearGradient id="ch1_chimneySmoke" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#5a5560" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#5a5560" stopOpacity="0" />
        </linearGradient>
        {/* Cobblestone texture — subtle pattern */}
        <filter id="ch1_cobbleNoise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.08 0.06" numOctaves="2" seed="17" result="cobble" />
          <feColorMatrix type="saturate" values="0" in="cobble" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="overlay" />
        </filter>
        {/* Lantern warm pool — ground light from second lantern */}
        <radialGradient id="ch1_lanternPool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a07838" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#a07838" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a07838" stopOpacity="0" />
        </radialGradient>
        {/* Dusk horizon band — narrow amber line effect */}
        <linearGradient id="ch1_duskBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a07840" stopOpacity="0" />
          <stop offset="40%" stopColor="#a07840" stopOpacity="0.05" />
          <stop offset="60%" stopColor="#8a6838" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#8a6838" stopOpacity="0" />
        </linearGradient>
        {/* Drizzle rain filter — light diagonal streaks */}
        <filter id="ch1_rainFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.8" numOctaves="1" seed="31" result="rainNoise" />
          <feColorMatrix type="saturate" values="0" in="rainNoise" result="grey" />
          <feComponentTransfer in="grey" result="threshold">
            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0.03" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="threshold" mode="screen" />
        </filter>
        {/* Grave cross shadow — solemn wood */}
        <linearGradient id="ch1_graveWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3025" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>
        {/* Emaciated body tone — sallow grey-brown for exposed skin */}
        <radialGradient id="ch1_sickSkin" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4a4035" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3a3530" stopOpacity="0" />
        </radialGradient>
        {/* Cold breath vapor */}
        <radialGradient id="ch1_breath" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#6a6a70" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#6a6a70" stopOpacity="0" />
        </radialGradient>
        {/* Puddle reflection shimmer */}
        <linearGradient id="ch1_puddleShimmer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5565" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#4a4555" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#3a3545" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch1_sky)" />

      {/* Heavy cloud layer — overcast, wind-driven */}
      <ellipse cx="200" cy="50" rx="250" ry="18" fill="#3a3545" opacity="0.35" />
      <ellipse cx="500" cy="35" rx="200" ry="14" fill="#353040" opacity="0.3" />
      <ellipse cx="700" cy="65" rx="180" ry="12" fill="#3a3545" opacity="0.25" />
      <ellipse cx="100" cy="85" rx="170" ry="13" fill="#353040" opacity="0.25" />
      <ellipse cx="400" cy="70" rx="220" ry="10" fill="#3a3545" opacity="0.2" />
      {/* Lower thin clouds */}
      <ellipse cx="300" cy="105" rx="160" ry="8" fill="#454050" opacity="0.15" />
      <ellipse cx="650" cy="95" rx="120" ry="7" fill="#454050" opacity="0.12" />
      {/* Wind-torn cloud wisps */}
      <ellipse cx="150" cy="115" rx="80" ry="4" fill="#454050" opacity="0.1">
        <animate attributeName="cx" values="150;170;150" dur="20s" repeatCount="indefinite" />
      </ellipse>

      {/* Additional heavy cloud masses — thick overcast layer */}
      <ellipse cx="50" cy="42" rx="130" ry="16" fill="#302a38" opacity="0.3" />
      <ellipse cx="600" cy="48" rx="170" ry="13" fill="#332e3a" opacity="0.28">
        <animate attributeName="cx" values="600;615;600" dur="25s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="350" cy="28" rx="190" ry="20" fill="#2e2835" opacity="0.32" />
      {/* Low bruised cloud near horizon */}
      <ellipse cx="450" cy="118" rx="140" ry="9" fill="#403a48" opacity="0.14">
        <animate attributeName="cx" values="450;465;450" dur="18s" repeatCount="indefinite" />
      </ellipse>
      {/* Massive oppressive cloud bank — dark, heavy, threatening rain */}
      <ellipse cx="120" cy="60" rx="200" ry="22" fill="#28222f" opacity="0.34">
        <animate attributeName="cx" values="120;135;120" dur="30s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="480" cy="55" rx="240" ry="25" fill="#2a2435" opacity="0.3" />
      <ellipse cx="700" cy="40" rx="150" ry="18" fill="#2c2638" opacity="0.28">
        <animate attributeName="cx" values="700;712;700" dur="22s" repeatCount="indefinite" />
      </ellipse>
      {/* Bruised underbelly clouds — purple-grey, low and menacing */}
      <ellipse cx="250" cy="100" rx="180" ry="11" fill="#3a3348" opacity="0.18">
        <animate attributeName="cx" values="250;268;250" dur="16s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="550" cy="108" rx="130" ry="8" fill="#38324a" opacity="0.15" />
      {/* Rain-heavy dark streaks near horizon */}
      <path d="M80 95 Q90 120 85 140" fill="none" stroke="#3a3545" strokeWidth="0.4" opacity="0.06" />
      <path d="M160 90 Q165 115 158 135" fill="none" stroke="#3a3545" strokeWidth="0.3" opacity="0.05" />
      <path d="M340 98 Q348 120 342 142" fill="none" stroke="#3a3545" strokeWidth="0.3" opacity="0.04" />
      {/* Additional rain virga — distant veils of precipitation that evaporate before reaching ground */}
      <path d="M420 92 Q425 110 418 130" fill="none" stroke="#3a3545" strokeWidth="0.5" opacity="0.04" />
      <path d="M460 88 Q462 108 456 128" fill="none" stroke="#3a3545" strokeWidth="0.4" opacity="0.035" />
      <path d="M530 95 Q535 115 528 135" fill="none" stroke="#3a3545" strokeWidth="0.3" opacity="0.03" />
      {/* Heavier cloud mass — threatening imminent downpour */}
      <ellipse cx="300" cy="45" rx="280" ry="30" fill="#232030" opacity="0.2">
        <animate attributeName="cx" values="300;315;300" dur="35s" repeatCount="indefinite" />
      </ellipse>

      {/* === ADDITIONAL CLOUD WISPS — thin, ragged, wind-torn === */}
      {/* High wisp — translucent thread pulled across upper sky */}
      <path d="M0 30 Q80 26 160 32 Q240 28 320 34 Q400 30 480 33" fill="none" stroke="#3a3545" strokeWidth="0.6" opacity="0.08">
        <animate attributeName="d" values="M0 30 Q80 26 160 32 Q240 28 320 34 Q400 30 480 33;M0 28 Q80 24 160 30 Q240 26 320 32 Q400 28 480 31;M0 30 Q80 26 160 32 Q240 28 320 34 Q400 30 480 33" dur="24s" repeatCount="indefinite" />
      </path>
      {/* Mid-level scud — fast-moving, broken */}
      <ellipse cx="320" cy="78" rx="60" ry="3" fill="#38324a" opacity="0.1">
        <animate attributeName="cx" values="320;350;320" dur="14s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="680" cy="82" rx="45" ry="2.5" fill="#38324a" opacity="0.08">
        <animate attributeName="cx" values="680;705;680" dur="16s" repeatCount="indefinite" />
      </ellipse>
      {/* Very thin cirrus-like streaks — highest layer */}
      <path d="M500 18 Q540 16 580 20 Q620 17 660 22" fill="none" stroke="#353040" strokeWidth="0.4" opacity="0.06" />
      <path d="M200 22 Q250 19 300 24 Q350 20 400 25" fill="none" stroke="#353040" strokeWidth="0.3" opacity="0.05" />
      {/* Low scudding cloud — moving faster than the heavy masses above */}
      <ellipse cx="50" cy="125" rx="55" ry="3.5" fill="#403a48" opacity="0.09">
        <animate attributeName="cx" values="50;85;50" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Dusk bleed glow — warm light reflected up onto cloud bases */}
      <rect x="0" y="0" width="800" height="180" fill="url(#ch1_duskBleed)" />

      {/* === HORIZON GLOW AND ATMOSPHERIC HAZE === */}
      {/* Warm dusk glow band along horizon — remnant of sunset */}
      <rect x="0" y="155" width="800" height="30" fill="url(#ch1_horizonWarm)" />
      {/* Thin golden light line at horizon edge */}
      <line x1="0" y1="174" x2="800" y2="174" stroke="#8a6a48" strokeWidth="0.6" opacity="0.06" />
      {/* Atmospheric dust haze — very subtle warm particulate band above sea */}
      <ellipse cx="400" cy="165" rx="400" ry="8" fill="#6a5a48" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.06;0.04" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Distant rain curtain — faint grey veil far left, drifting */}
      <path d="M0 130 Q10 155 5 175" fill="none" stroke="#3a3545" strokeWidth="12" opacity="0.03" />
      <path d="M20 125 Q30 150 25 175" fill="none" stroke="#3a3545" strokeWidth="8" opacity="0.025" />
      {/* Extended dusk band — narrow amber glow band reinforcing the dying light */}
      <rect x="0" y="160" width="800" height="18" fill="url(#ch1_duskBand)" />
      {/* Scattered light breaks — tiny gaps in cloud where amber light bleeds through */}
      <ellipse cx="350" cy="130" rx="8" ry="2" fill="#7a5a3a" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="520" cy="122" rx="6" ry="1.5" fill="#7a5a3a" opacity="0.025" />

      {/* === DISTANT NICE — city walls and buildings === */}
      {/* Main city wall silhouette */}
      <path d="M580 180 L580 158 L600 158 L600 148 L605 142 L610 148 L610 158 L640 158 L640 152 L645 147 L650 152 L650 158 L680 158 L680 165 L710 165 L710 155 L718 148 L726 155 L726 165 L760 165 L760 180"
        fill="url(#ch1_walls)" opacity="0.55" />
      {/* Building rooftops behind wall */}
      <rect x="595" y="135" width="20" height="23" fill="#4a4540" opacity="0.3" />
      <path d="M593 135 L605 125 L617 135" fill="#504a45" opacity="0.3" />
      <rect x="665" y="140" width="15" height="18" fill="#4a4540" opacity="0.25" />
      <path d="M663 140 L672 132 L682 140" fill="#504a45" opacity="0.25" />
      {/* More distant buildings */}
      <rect x="720" y="148" width="12" height="17" fill="#454040" opacity="0.2" />
      <path d="M718 148 L726 140 L734 148" fill="#4a4540" opacity="0.2" />
      {/* Church bell tower */}
      <rect x="640" y="120" width="10" height="38" fill="#504a45" opacity="0.35" />
      <path d="M638 120 L645 112 L652 120" fill="#5a5550" opacity="0.35" />
      <line x1="645" y1="112" x2="645" y2="107" stroke="#5a5550" strokeWidth="1" opacity="0.3" />
      {/* Tiny warm window glows in city */}
      <rect x="600" y="148" width="2" height="3" fill="#a08050" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="643" y="128" width="2" height="3" fill="#a08050" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="670" y="148" width="2" height="3" fill="#a08050" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.08;0.18" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="715" y="156" width="2" height="3" fill="#a08050" opacity="0.12" />
      <rect x="725" y="155" width="2" height="3" fill="#a08050" opacity="0.1" />
      {/* Additional city details — chimneys and rooftop variations */}
      <rect x="610" y="150" width="3" height="8" fill="#454040" opacity="0.22" />
      <rect x="675" y="145" width="2" height="7" fill="#454040" opacity="0.18" />
      {/* Additional buildings — layered depth behind the wall */}
      <rect x="625" y="142" width="12" height="16" fill="#484340" opacity="0.22" />
      <path d="M624 142 L631 134 L638 142" fill="#504a45" opacity="0.22" />
      <rect x="694" y="150" width="10" height="15" fill="#454040" opacity="0.18" />
      <path d="M693 150 L699 143 L705 150" fill="#4a4540" opacity="0.18" />
      {/* Narrow alley shadows between buildings */}
      <line x1="617" y1="136" x2="617" y2="158" stroke="#2a2525" strokeWidth="0.6" opacity="0.15" />
      <line x1="638" y1="142" x2="638" y2="158" stroke="#2a2525" strokeWidth="0.5" opacity="0.12" />
      <line x1="680" y1="140" x2="680" y2="158" stroke="#2a2525" strokeWidth="0.4" opacity="0.1" />
      {/* Additional chimneys — multiple on the city roofline */}
      <rect x="628" y="138" width="2.5" height="6" fill="#454040" opacity="0.2" />
      <rect x="697" y="146" width="2" height="5" fill="#454040" opacity="0.16" />
      <rect x="656" y="143" width="2" height="5" fill="#454040" opacity="0.18" />
      {/* Chimney smoke — faint wisps from the city — multiple animated plumes */}
      <path d="M611 150 Q609 144 613 138" fill="none" stroke="#5a5560" strokeWidth="0.4" opacity="0.06">
        <animate attributeName="d" values="M611 150 Q609 144 613 138;M611 150 Q613 144 616 138;M611 150 Q609 144 613 138" dur="8s" repeatCount="indefinite" />
      </path>
      {/* Chimney smoke 2 — drifting right with the coastal wind */}
      <path d="M629 138 Q628 132 632 126 Q636 120 642 116" fill="none" stroke="#5a5560" strokeWidth="0.5" opacity="0.05">
        <animate attributeName="d" values="M629 138 Q628 132 632 126 Q636 120 642 116;M629 138 Q631 132 636 126 Q642 120 650 116;M629 138 Q628 132 632 126 Q636 120 642 116" dur="10s" repeatCount="indefinite" />
      </path>
      {/* Chimney smoke 3 — shorter wisp, bell tower chimney */}
      <path d="M657 143 Q656 138 659 134" fill="none" stroke="#5a5560" strokeWidth="0.35" opacity="0.04">
        <animate attributeName="d" values="M657 143 Q656 138 659 134;M657 143 Q658 138 662 134;M657 143 Q656 138 659 134" dur="7s" repeatCount="indefinite" />
      </path>
      {/* Chimney smoke 4 — longer plume from right-side building */}
      <path d="M698 146 Q697 140 700 134 Q703 128 708 124" fill="none" stroke="#5a5560" strokeWidth="0.4" opacity="0.04">
        <animate attributeName="d" values="M698 146 Q697 140 700 134 Q703 128 708 124;M698 146 Q700 140 704 134 Q710 128 716 124;M698 146 Q697 140 700 134 Q703 128 708 124" dur="12s" repeatCount="indefinite" />
      </path>
      {/* Chimney smoke 5 — primary chimney, thicker drift */}
      <path d="M676 145 Q674 138 678 132 Q682 126 688 122" fill="none" stroke="#5a5560" strokeWidth="0.6" opacity="0.05">
        <animate attributeName="d" values="M676 145 Q674 138 678 132 Q682 126 688 122;M676 145 Q677 138 682 132 Q688 126 696 122;M676 145 Q674 138 678 132 Q682 126 688 122" dur="9s" repeatCount="indefinite" />
      </path>
      {/* Additional window glows — upper floors catching last light */}
      <rect x="627" y="145" width="1.5" height="2.5" fill="#a08050" opacity="0.14">
        <animate attributeName="opacity" values="0.14;0.07;0.14" dur="6s" repeatCount="indefinite" />
      </rect>
      <rect x="633" y="146" width="1.5" height="2.5" fill="#a08050" opacity="0.1" />
      <rect x="696" y="153" width="1.5" height="2.5" fill="#a08050" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.05;0.1" dur="4.5s" repeatCount="indefinite" />
      </rect>
      <rect x="702" y="154" width="1.5" height="2.5" fill="#a08050" opacity="0.08" />
      {/* City wall texture — stone lines */}
      <line x1="585" y1="168" x2="610" y2="168" stroke="#5a5555" strokeWidth="0.3" opacity="0.12" />
      <line x1="615" y1="164" x2="640" y2="164" stroke="#5a5555" strokeWidth="0.3" opacity="0.1" />
      <line x1="650" y1="168" x2="680" y2="168" stroke="#5a5555" strokeWidth="0.3" opacity="0.1" />
      <line x1="710" y1="172" x2="740" y2="172" stroke="#5a5555" strokeWidth="0.3" opacity="0.08" />
      {/* Battlements/crenellations on wall top — faint */}
      <path d="M582 158 L582 155 L586 155 L586 158" fill="none" stroke="#5a5050" strokeWidth="0.4" opacity="0.12" />
      <path d="M590 158 L590 155 L594 155 L594 158" fill="none" stroke="#5a5050" strokeWidth="0.4" opacity="0.1" />
      <path d="M682 165 L682 162 L686 162 L686 165" fill="none" stroke="#5a5050" strokeWidth="0.4" opacity="0.08" />
      <path d="M690 165 L690 162 L694 162 L694 165" fill="none" stroke="#5a5050" strokeWidth="0.4" opacity="0.08" />
      {/* Warm haze glow around the city — distant lamplight */}
      <ellipse cx="660" cy="165" rx="50" ry="10" fill="#a08050" opacity="0.015" />

      {/* === DISTANT SIGNAL FIRE — beacon on hilltop behind the city === */}
      {/* Hill silhouette behind city */}
      <path d="M740 165 Q755 142 770 138 Q785 142 800 160" fill="#3a3535" opacity="0.3" />
      {/* Signal fire platform — stone cairn */}
      <path d="M766 140 L770 134 L774 140" fill="#4a4545" opacity="0.25" />
      {/* Signal fire glow */}
      <ellipse cx="770" cy="132" rx="6" ry="4" fill="url(#ch1_signalGlow)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Flame */}
      <path d="M769 134 Q770 128 771 134" fill="#c08040" opacity="0.35">
        <animate attributeName="d" values="M769 134 Q770 128 771 134;M768 134 Q770 126 772 134;M769 134 Q770 128 771 134" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Thin smoke rising from signal fire */}
      <path d="M770 128 Q768 120 772 112" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M770 128 Q768 120 772 112;M770 128 Q772 120 776 112;M770 128 Q768 120 772 112" dur="5s" repeatCount="indefinite" />
      </path>

      {/* === MEDITERRANEAN SEA === */}
      <rect x="0" y="175" width="800" height="55" fill="url(#ch1_sea)" />
      {/* Horizon reflection band */}
      <rect x="0" y="175" width="800" height="15" fill="url(#ch1_seaReflect)" />
      {/* Harbor shimmer — golden-amber light dancing on the water surface */}
      <rect x="200" y="180" width="400" height="8" fill="url(#ch1_harborShimmer)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* City light reflections — warm vertical streaks from the Nice waterfront */}
      <ellipse cx="620" cy="190" rx="2" ry="10" fill="#a08050" opacity="0.025">
        <animate attributeName="opacity" values="0.025;0.045;0.025" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="2;2.5;2" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="660" cy="192" rx="1.5" ry="8" fill="#a08050" opacity="0.02">
        <animate attributeName="opacity" values="0.02;0.035;0.02" dur="3.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="188" rx="1.5" ry="7" fill="#a08050" opacity="0.018">
        <animate attributeName="opacity" values="0.018;0.03;0.018" dur="4.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Dusk sky reflection on flat water — broad warm patch */}
      <ellipse cx="400" cy="182" rx="180" ry="4" fill="#7a5a3a" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {/* Wave lines — multiple for depth, with gentle motion */}
      <path d="M0 185 Q40 183 80 185 Q120 187 160 185 Q200 183 240 185 Q280 187 320 185 Q360 183 400 185 Q440 187 480 185 Q520 183 560 185 Q600 187 640 185 Q680 183 720 185 Q760 187 800 185"
        fill="none" stroke="#5a6575" strokeWidth="0.5" opacity="0.35">
        <animate attributeName="d" values="M0 185 Q40 183 80 185 Q120 187 160 185 Q200 183 240 185 Q280 187 320 185 Q360 183 400 185 Q440 187 480 185 Q520 183 560 185 Q600 187 640 185 Q680 183 720 185 Q760 187 800 185;M0 186 Q40 184 80 186 Q120 188 160 186 Q200 184 240 186 Q280 188 320 186 Q360 184 400 186 Q440 188 480 186 Q520 184 560 186 Q600 188 640 186 Q680 184 720 186 Q760 188 800 186;M0 185 Q40 183 80 185 Q120 187 160 185 Q200 183 240 185 Q280 187 320 185 Q360 183 400 185 Q440 187 480 185 Q520 183 560 185 Q600 187 640 185 Q680 183 720 185 Q760 187 800 185" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M0 195 Q50 193 100 195 Q150 197 200 195 Q250 193 300 195 Q350 197 400 195 Q450 193 500 195 Q550 197 600 195 Q650 193 700 195 Q750 197 800 195"
        fill="none" stroke="#4a5565" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="d" values="M0 195 Q50 193 100 195 Q150 197 200 195 Q250 193 300 195 Q350 197 400 195 Q450 193 500 195 Q550 197 600 195 Q650 193 700 195 Q750 197 800 195;M0 196 Q50 194 100 196 Q150 198 200 196 Q250 194 300 196 Q350 198 400 196 Q450 194 500 196 Q550 198 600 196 Q650 194 700 196 Q750 198 800 196;M0 195 Q50 193 100 195 Q150 197 200 195 Q250 193 300 195 Q350 197 400 195 Q450 193 500 195 Q550 197 600 195 Q650 193 700 195 Q750 197 800 195" dur="7s" repeatCount="indefinite" />
      </path>
      <path d="M0 205 Q60 203 120 205 Q180 207 240 205 Q300 203 360 205 Q420 207 480 205 Q540 203 600 205 Q660 207 720 205 Q780 203 800 205"
        fill="none" stroke="#3a4555" strokeWidth="0.5" opacity="0.25">
        <animate attributeName="d" values="M0 205 Q60 203 120 205 Q180 207 240 205 Q300 203 360 205 Q420 207 480 205 Q540 203 600 205 Q660 207 720 205 Q780 203 800 205;M0 206 Q60 204 120 206 Q180 208 240 206 Q300 204 360 206 Q420 208 480 206 Q540 204 600 206 Q660 208 720 206 Q780 204 800 206;M0 205 Q60 203 120 205 Q180 207 240 205 Q300 203 360 205 Q420 207 480 205 Q540 203 600 205 Q660 207 720 205 Q780 203 800 205" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M0 215 Q70 213 140 215 Q210 217 280 215 Q350 213 420 215 Q490 217 560 215 Q630 213 700 215 Q770 217 800 215"
        fill="none" stroke="#3a4050" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="d" values="M0 215 Q70 213 140 215 Q210 217 280 215 Q350 213 420 215 Q490 217 560 215 Q630 213 700 215 Q770 217 800 215;M0 216 Q70 214 140 216 Q210 218 280 216 Q350 214 420 216 Q490 218 560 216 Q630 214 700 216 Q770 218 800 216;M0 215 Q70 213 140 215 Q210 217 280 215 Q350 213 420 215 Q490 217 560 215 Q630 213 700 215 Q770 217 800 215" dur="9s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL WAVE DETAIL — foam lines on rocks and shoreline === */}
      {/* Foam line along shore edge — animated lapping */}
      <path d="M0 228 Q20 225 50 227 Q80 224 120 228 Q160 225 200 227 Q240 224 280 228 Q320 225 360 227 Q400 224 440 228 Q480 225 520 227 Q560 224 600 228"
        fill="none" stroke="#7a7a80" strokeWidth="0.6" opacity="0.12">
        <animate attributeName="d" values="M0 228 Q20 225 50 227 Q80 224 120 228 Q160 225 200 227 Q240 224 280 228 Q320 225 360 227 Q400 224 440 228 Q480 225 520 227 Q560 224 600 228;M0 227 Q20 224 50 226 Q80 223 120 227 Q160 224 200 226 Q240 223 280 227 Q320 224 360 226 Q400 223 440 227 Q480 224 520 226 Q560 223 600 227;M0 228 Q20 225 50 227 Q80 224 120 228 Q160 225 200 227 Q240 224 280 228 Q320 225 360 227 Q400 224 440 228 Q480 225 520 227 Q560 224 600 228" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Secondary foam line — further out */}
      <path d="M50 222 Q90 219 130 222 Q170 219 210 222 Q250 219 290 222 Q330 219 370 222 Q410 219 450 222 Q490 219 530 222"
        fill="none" stroke="#6a6a75" strokeWidth="0.4" opacity="0.1">
        <animate attributeName="d" values="M50 222 Q90 219 130 222 Q170 219 210 222 Q250 219 290 222 Q330 219 370 222 Q410 219 450 222 Q490 219 530 222;M50 221 Q90 218 130 221 Q170 218 210 221 Q250 218 290 221 Q330 218 370 221 Q410 218 450 221 Q490 218 530 221;M50 222 Q90 219 130 222 Q170 219 210 222 Q250 219 290 222 Q330 219 370 222 Q410 219 450 222 Q490 219 530 222" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Foam flecks on rocks — left foreground */}
      <ellipse cx="30" cy="348" rx="4" ry="0.8" fill="#8a8a90" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.12;0.06" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="110" cy="345" rx="3" ry="0.6" fill="#7a7a85" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.1;0.05" dur="4.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Foam flecks on rocks — right foreground */}
      <ellipse cx="620" cy="350" rx="3.5" ry="0.7" fill="#8a8a90" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.1;0.05" dur="3.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="720" cy="347" rx="4" ry="0.8" fill="#7a7a85" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.11;0.06" dur="4.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Wet sand shine line — tide mark */}
      <path d="M0 232 Q100 230 200 233 Q300 230 400 232 Q500 230 600 233"
        fill="none" stroke="#5a5a65" strokeWidth="0.4" opacity="0.08" />
      {/* Additional wave detail — mid-sea swells */}
      <path d="M0 189 Q30 187 60 189 Q90 191 120 189 Q150 187 180 189 Q210 191 240 189 Q270 187 300 189 Q330 191 360 189 Q390 187 420 189 Q450 191 480 189 Q510 187 540 189 Q570 191 600 189 Q630 187 660 189 Q690 191 720 189 Q750 187 780 189 Q790 191 800 189"
        fill="none" stroke="#5a6575" strokeWidth="0.4" opacity="0.28" />
      <path d="M0 200 Q45 198 90 200 Q135 202 180 200 Q225 198 270 200 Q315 202 360 200 Q405 198 450 200 Q495 202 540 200 Q585 198 630 200 Q675 202 720 200 Q765 198 800 200"
        fill="none" stroke="#4a5565" strokeWidth="0.4" opacity="0.22" />
      <path d="M0 210 Q55 208 110 210 Q165 212 220 210 Q275 208 330 210 Q385 212 440 210 Q495 208 550 210 Q605 212 660 210 Q715 208 770 210 Q785 212 800 210"
        fill="none" stroke="#3a4555" strokeWidth="0.35" opacity="0.18" />
      {/* Foam breaking on coastal rocks — left side */}
      <ellipse cx="55" cy="352" rx="6" ry="1" fill="#9a9a9a" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.12;0.05;0.03;0.05" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="85" cy="348" rx="5" ry="0.8" fill="#8a8a90" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.1;0.04" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Foam breaking on coastal rocks — right side */}
      <ellipse cx="650" cy="354" rx="5" ry="0.9" fill="#9a9a9a" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.1;0.04;0.02;0.04" dur="4.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="690" cy="350" rx="4" ry="0.7" fill="#8a8a90" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.11;0.05" dur="3.2s" repeatCount="indefinite" />
      </ellipse>
      {/* White foam line — closest to shore, breaking waves */}
      <path d="M0 225 Q30 222 60 225 Q90 222 120 225 Q150 222 180 225 Q210 222 240 225 Q270 222 300 225 Q330 222 360 225 Q390 222 420 225 Q450 222 480 225 Q510 222 540 225 Q570 222 600 225"
        fill="none" stroke="#8a8a90" strokeWidth="0.5" opacity="0.08">
        <animate attributeName="d" values="M0 225 Q30 222 60 225 Q90 222 120 225 Q150 222 180 225 Q210 222 240 225 Q270 222 300 225 Q330 222 360 225 Q390 222 420 225 Q450 222 480 225 Q510 222 540 225 Q570 222 600 225;M0 224 Q30 221 60 224 Q90 221 120 224 Q150 221 180 224 Q210 221 240 224 Q270 221 300 224 Q330 221 360 224 Q390 221 420 224 Q450 221 480 224 Q510 221 540 224 Q570 221 600 224;M0 225 Q30 222 60 225 Q90 222 120 225 Q150 222 180 225 Q210 222 240 225 Q270 222 300 225 Q330 222 360 225 Q390 222 420 225 Q450 222 480 225 Q510 222 540 225 Q570 222 600 225" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* === FIRE REFLECTIONS ON WATER — warm shimmer from camp and signal fires === */}
      {/* Signal fire reflection — long vertical shimmer */}
      <ellipse cx="770" cy="195" rx="3" ry="12" fill="#a06030" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* City window light reflections — faint warm streaks */}
      <ellipse cx="640" cy="192" rx="2" ry="8" fill="#a08050" opacity="0.02">
        <animate attributeName="opacity" values="0.02;0.04;0.02" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Distant ship lantern reflection */}
      <ellipse cx="126" cy="188" rx="1" ry="4" fill="#a08050" opacity="0.02" />
      {/* Sea surface texture — subtle cross-hatching of micro-waves */}
      <path d="M0 192 Q8 190 16 192 Q24 194 32 192 Q40 190 48 192 Q56 194 64 192" fill="none" stroke="#5a6575" strokeWidth="0.3" opacity="0.15" />
      <path d="M200 197 Q208 195 216 197 Q224 199 232 197 Q240 195 248 197 Q256 199 264 197" fill="none" stroke="#4a5565" strokeWidth="0.3" opacity="0.12" />
      <path d="M400 193 Q410 191 420 193 Q430 195 440 193 Q450 191 460 193 Q470 195 480 193" fill="none" stroke="#5a6575" strokeWidth="0.25" opacity="0.12" />
      <path d="M550 203 Q558 201 566 203 Q574 205 582 203 Q590 201 598 203" fill="none" stroke="#3a4555" strokeWidth="0.3" opacity="0.1" />
      {/* Dark water troughs — deeper shadows between swells */}
      <path d="M100 196 Q130 198 160 196 Q190 194 220 196" fill="none" stroke="#2a3545" strokeWidth="0.4" opacity="0.1" />
      <path d="M300 207 Q340 209 380 207 Q420 205 460 207" fill="none" stroke="#2a3545" strokeWidth="0.4" opacity="0.08" />

      {/* Water shimmer spots */}
      <ellipse cx="250" cy="190" rx="25" ry="1" fill="#6a6a70" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="198" rx="35" ry="1.2" fill="#6a6a70" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="600" cy="202" rx="20" ry="1" fill="#6a6a70" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="150" cy="208" rx="28" ry="1" fill="#5a5a65" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Distant ship silhouette on the Mediterranean */}
      <path d="M120 182 Q126 179 132 182 L130 183 L122 183 Z" fill="#3a4050" opacity="0.18" />
      <line x1="126" y1="182" x2="126" y2="175" stroke="#3a4050" strokeWidth="0.5" opacity="0.15" />
      <path d="M126 175 Q130 177 132 180" fill="none" stroke="#3a4050" strokeWidth="0.3" opacity="0.12" />
      {/* Ship wake — faint white trail behind */}
      <path d="M118 183 Q112 183 106 184" fill="none" stroke="#5a6575" strokeWidth="0.3" opacity="0.06" />
      {/* Ship lantern — tiny warm dot at stern */}
      <circle cx="121" cy="182" r="0.5" fill="#a08050" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Sea birds — distant */}
      <path d="M420 140 Q425 136 430 140 Q435 136 440 140" fill="none" stroke="#4a4a55" strokeWidth="0.6" opacity="0.2" />
      <path d="M460 148 Q464 145 468 148 Q472 145 476 148" fill="none" stroke="#4a4a55" strokeWidth="0.5" opacity="0.15" />
      <path d="M380 155 Q383 152 386 155 Q389 152 392 155" fill="none" stroke="#4a4a55" strokeWidth="0.4" opacity="0.12" />
      {/* Additional seagulls — wheeling over the grey Mediterranean */}
      <path d="M220 130 Q224 126 228 130 Q232 126 236 130" fill="none" stroke="#4a4a55" strokeWidth="0.5" opacity="0.18">
        <animate attributeName="d" values="M220 130 Q224 126 228 130 Q232 126 236 130;M222 128 Q226 124 230 128 Q234 124 238 128;M220 130 Q224 126 228 130 Q232 126 236 130" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M520 135 Q523 132 526 135 Q529 132 532 135" fill="none" stroke="#4a4a55" strokeWidth="0.45" opacity="0.14">
        <animate attributeName="d" values="M520 135 Q523 132 526 135 Q529 132 532 135;M522 133 Q525 130 528 133 Q531 130 534 133;M520 135 Q523 132 526 135 Q529 132 532 135" dur="7s" repeatCount="indefinite" />
      </path>
      <path d="M310 145 Q313 142 316 145 Q319 142 322 145" fill="none" stroke="#4a4a55" strokeWidth="0.4" opacity="0.12" />
      {/* Low-flying seagull — closer, larger, gliding */}
      <path d="M160 165 Q166 158 172 165 Q178 158 184 165" fill="none" stroke="#5a5a60" strokeWidth="0.7" opacity="0.15">
        <animate attributeName="d" values="M160 165 Q166 158 172 165 Q178 158 184 165;M158 163 Q164 156 170 163 Q176 156 182 163;M160 165 Q166 158 172 165 Q178 158 184 165" dur="5s" repeatCount="indefinite" />
        <animate attributeName="transform" type="translate" values="0,0;15,-2;30,-4;45,-2;60,0" dur="12s" repeatCount="indefinite" />
      </path>
      {/* Tiny distant seabird flock — far out over water */}
      <path d="M680 160 Q681 159 682 160" fill="none" stroke="#4a4a55" strokeWidth="0.3" opacity="0.08" />
      <path d="M686 161 Q687 160 688 161" fill="none" stroke="#4a4a55" strokeWidth="0.3" opacity="0.07" />
      <path d="M675 162 Q676 161 677 162" fill="none" stroke="#4a4a55" strokeWidth="0.3" opacity="0.07" />

      {/* Second distant ship — triangular lateen sail, further out on horizon */}
      <g opacity="0.14">
        {/* Hull — low dark shape */}
        <path d="M350 181 Q356 179 362 181 L360 182 L352 182 Z" fill="#3a4050" />
        {/* Triangular lateen sail — classic Mediterranean */}
        <path d="M356 181 L354 172 L362 179 Z" fill="#5a5a65" opacity="0.7" />
        {/* Mast */}
        <line x1="356" y1="181" x2="356" y2="172" stroke="#3a4050" strokeWidth="0.4" />
      </g>

      {/* === COASTAL HILL / CAMP GROUND === */}
      <path d="M0 230 Q80 222 160 226 Q280 235 400 228 Q480 224 560 228 Q640 222 720 230 Q760 235 800 228 L800 400 L0 400 Z"
        fill="url(#ch1_ground)" />

      {/* Rocky coastal terrain detail */}
      <path d="M0 230 Q20 228 40 231 Q60 229 80 232 Q100 228 130 233 Q160 230 190 234"
        fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.35" />
      <path d="M300 230 Q330 227 360 232 Q390 228 420 233 Q450 230 480 231"
        fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.3" />
      {/* Small rock outcrops */}
      <path d="M60 232 Q65 228 72 230 Q78 228 82 232" fill="#3a3530" opacity="0.4" />
      <path d="M500 228 Q508 224 515 227 Q522 225 528 229" fill="#3a3530" opacity="0.35" />

      {/* === ENHANCED TERRAIN TEXTURE — earth cracks, pebbles, ground variation === */}
      {/* Earth cracks — dried soil fissures in the camp ground */}
      <path d="M250 250 Q255 252 262 250 Q268 253 275 250" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.15" />
      <path d="M260 252 Q262 258 260 262" fill="none" stroke="#2a2518" strokeWidth="0.25" opacity="0.12" />
      <path d="M380 248 Q388 250 395 248 Q402 251 410 249" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.14" />
      <path d="M390 250 Q392 256 390 260" fill="none" stroke="#2a2518" strokeWidth="0.2" opacity="0.1" />
      <path d="M550 242 Q558 244 565 241 Q572 244 578 242" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.12" />
      {/* Scattered pebbles — small round stones on ground */}
      <circle cx="245" cy="245" r="1.2" fill="#3a3530" opacity="0.25" />
      <circle cx="248" cy="247" r="0.8" fill="#3a3530" opacity="0.2" />
      <circle cx="330" cy="240" r="1" fill="#3a3530" opacity="0.22" />
      <circle cx="410" cy="242" r="0.9" fill="#3a3530" opacity="0.2" />
      <circle cx="413" cy="244" r="1.1" fill="#3a3530" opacity="0.18" />
      <circle cx="560" cy="238" r="1" fill="#3a3530" opacity="0.2" />
      <circle cx="620" cy="236" r="0.8" fill="#3a3530" opacity="0.18" />
      {/* Larger embedded stones — half-buried in earth */}
      <path d="M310 242 Q314 240 318 242 Q316 244 312 244 Z" fill="#3a3530" opacity="0.28" />
      <path d="M440 238 Q444 236 447 238 Q445 240 441 240 Z" fill="#3a3530" opacity="0.25" />
      <path d="M600 234 Q604 232 607 234 Q605 236 601 236 Z" fill="#3a3530" opacity="0.22" />
      {/* Ground color variation — darker patches of damp earth */}
      <ellipse cx="200" cy="260" rx="18" ry="4" fill="#2a2518" opacity="0.08" />
      <ellipse cx="380" cy="255" rx="15" ry="3" fill="#2a2518" opacity="0.06" />
      <ellipse cx="520" cy="248" rx="20" ry="3.5" fill="#2a2518" opacity="0.07" />
      <ellipse cx="680" cy="252" rx="14" ry="3" fill="#2a2518" opacity="0.06" />
      {/* Sandy patches — lighter ground near shoreline */}
      <ellipse cx="160" cy="235" rx="12" ry="2" fill="#4a4538" opacity="0.1" />
      <ellipse cx="350" cy="233" rx="10" ry="1.5" fill="#4a4538" opacity="0.08" />
      <ellipse cx="550" cy="232" rx="14" ry="2" fill="#4a4538" opacity="0.08" />
      {/* Lichen on rocks — grey-green organic patches */}
      <ellipse cx="65" cy="230" rx="4" ry="2" fill="url(#ch1_lichen)" />
      <ellipse cx="510" cy="226" rx="3" ry="1.5" fill="url(#ch1_lichen)" />
      <ellipse cx="130" cy="294" rx="3.5" ry="1.5" fill="url(#ch1_lichen)" />

      {/* === DRIFTWOOD — scattered along the shoreline === */}
      {/* Driftwood piece 1 — long bleached branch near shore */}
      <line x1="170" y1="234" x2="195" y2="232" stroke="#5a5548" strokeWidth="1.2" opacity="0.3" />
      <line x1="180" y1="233" x2="184" y2="229" stroke="#5a5548" strokeWidth="0.5" opacity="0.2" />
      {/* Driftwood piece 2 — broken plank */}
      <path d="M240 233 L262 231 L263 233 L241 235 Z" fill="#4a4538" opacity="0.25" />
      {/* Driftwood piece 3 — twisted branch on right */}
      <path d="M630 229 Q640 226 648 230 Q644 228 638 232" fill="none" stroke="#5a5548" strokeWidth="1" opacity="0.22" />
      <line x1="640" y1="227" x2="643" y2="224" stroke="#5a5548" strokeWidth="0.4" opacity="0.18" />
      {/* Driftwood piece 4 — small stick */}
      <line x1="320" y1="232" x2="335" y2="230" stroke="#4a4538" strokeWidth="0.8" opacity="0.2" />
      {/* Driftwood piece 5 — partially buried plank */}
      <path d="M425 230 L445 228 L446 230 L426 232 Z" fill="#504a40" opacity="0.18" />

      {/* === ROWBOAT — pulled up on shore, listing to one side === */}
      {/* Boat hull — beached, tilted */}
      <path d="M25 236 Q30 232 55 230 Q70 232 75 236 Q55 240 35 240 Z" fill="url(#ch1_boatWood)" opacity="0.5" />
      {/* Boat gunwale edge */}
      <path d="M28 235 Q42 231 58 230 Q68 232 73 235" fill="none" stroke="#4a3a28" strokeWidth="0.8" opacity="0.4" />
      {/* Plank lines */}
      <path d="M32 236 Q45 233 60 232" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.25" />
      <path d="M30 238 Q48 235 65 234" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.2" />
      {/* Oar — resting against the hull */}
      <line x1="62" y1="228" x2="80" y2="220" stroke="#3a3028" strokeWidth="1" opacity="0.35" />
      <ellipse cx="80" cy="219" rx="3" ry="1.5" fill="#3a3028" opacity="0.3" transform="rotate(-25 80 219)" />

      {/* === ROPE COILS — coiled rope near the rowboat === */}
      {/* Coil 1 — main coil of rope on the ground next to the boat */}
      <ellipse cx="42" cy="244" rx="5" ry="2.5" fill="none" stroke="#4a4035" strokeWidth="1" opacity="0.35" />
      <ellipse cx="42" cy="244" rx="3.5" ry="1.8" fill="none" stroke="#4a4035" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="42" cy="244" rx="2" ry="1" fill="none" stroke="#4a4035" strokeWidth="0.6" opacity="0.25" />
      {/* Tail end trailing from the coil */}
      <path d="M47 244 Q52 242 56 244 Q60 246 63 244" fill="none" stroke="#4a4035" strokeWidth="0.7" opacity="0.28" />
      {/* Coil 2 — smaller frayed rope near the stern */}
      <ellipse cx="72" cy="240" rx="3" ry="1.5" fill="none" stroke="#4a4035" strokeWidth="0.6" opacity="0.25" />
      <path d="M75 240 Q78 238 80 240" fill="none" stroke="#4a4035" strokeWidth="0.5" opacity="0.2" />

      {/* === RUSTY ANCHOR — old anchor on coastal rocks === */}
      {/* Anchor shank — vertical iron bar, corroded */}
      <line x1="18" y1="240" x2="18" y2="248" stroke="url(#ch1_rustyIron)" strokeWidth="1.2" opacity="0.4" />
      {/* Anchor stock — cross piece at top */}
      <line x1="14" y1="240" x2="22" y2="240" stroke="url(#ch1_rustyIron)" strokeWidth="1" opacity="0.35" />
      {/* Anchor crown and flukes — curved arms at bottom */}
      <path d="M18 248 Q14 250 10 248 Q8 246 12 244" fill="none" stroke="url(#ch1_rustyIron)" strokeWidth="1" opacity="0.38" />
      <path d="M18 248 Q22 250 26 248 Q28 246 24 244" fill="none" stroke="url(#ch1_rustyIron)" strokeWidth="1" opacity="0.38" />
      {/* Anchor ring at top */}
      <circle cx="18" cy="238" r="1.8" fill="none" stroke="#4a3228" strokeWidth="0.6" opacity="0.3" />
      {/* Rust stains on rock beneath */}
      <ellipse cx="18" cy="250" rx="5" ry="1.5" fill="#5a3a20" opacity="0.08" />
      {/* Frayed rope coiled near anchor */}
      <path d="M22 242 Q25 240 26 243 Q28 241 27 244 Q25 246 23 244" fill="none" stroke="#4a4035" strokeWidth="0.6" opacity="0.25" />

      {/* === FISHING NET — draped over rocks, soldiers supplementing rations === */}
      {/* Net draped between rock outcrops */}
      <path d="M55 232 Q62 236 72 234 Q80 236 88 233" fill="none" stroke="#5a5545" strokeWidth="0.5" opacity="0.3" />
      {/* Net mesh — horizontal strands sagging */}
      <path d="M58 234 Q65 238 72 236 Q80 238 86 235" fill="none" stroke="#5a5545" strokeWidth="0.4" opacity="0.22" />
      <path d="M60 236 Q67 240 74 238 Q82 240 84 237" fill="none" stroke="#5a5545" strokeWidth="0.4" opacity="0.18" />
      {/* Net mesh — vertical connecting strands */}
      <line x1="60" y1="232" x2="62" y2="237" stroke="#5a5545" strokeWidth="0.3" opacity="0.2" />
      <line x1="66" y1="233" x2="67" y2="239" stroke="#5a5545" strokeWidth="0.3" opacity="0.18" />
      <line x1="72" y1="234" x2="74" y2="239" stroke="#5a5545" strokeWidth="0.3" opacity="0.2" />
      <line x1="78" y1="235" x2="80" y2="239" stroke="#5a5545" strokeWidth="0.3" opacity="0.18" />
      <line x1="84" y1="233" x2="84" y2="237" stroke="#5a5545" strokeWidth="0.3" opacity="0.16" />
      {/* Net weight — small stone tied to edge */}
      <circle cx="58" cy="238" r="1.2" fill="#3a3530" opacity="0.3" />
      <circle cx="86" cy="237" r="1" fill="#3a3530" opacity="0.25" />

      {/* === WIND-BLOWN GRASS — animated tufts bending in coastal wind === */}
      {/* Grass tuft 1 — near shore */}
      <g opacity="0.3">
        <path d="M140 234 Q142 226 145 228" fill="none" stroke="#3a4528" strokeWidth="0.6">
          <animate attributeName="d" values="M140 234 Q142 226 145 228;M140 234 Q143 226 147 229;M140 234 Q142 226 145 228" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M142 234 Q143 228 146 230" fill="none" stroke="#354020" strokeWidth="0.5">
          <animate attributeName="d" values="M142 234 Q143 228 146 230;M142 234 Q144 228 148 231;M142 234 Q143 228 146 230" dur="3.2s" repeatCount="indefinite" />
        </path>
        <path d="M138 234 Q140 227 143 229" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M138 234 Q140 227 143 229;M138 234 Q141 227 145 230;M138 234 Q140 227 143 229" dur="2.8s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 2 — mid ground */}
      <g opacity="0.25">
        <path d="M350 234 Q352 226 355 228" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M350 234 Q352 226 355 228;M350 234 Q353 226 357 229;M350 234 Q352 226 355 228" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M348 234 Q350 228 353 230" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M348 234 Q350 228 353 230;M348 234 Q351 228 355 231;M348 234 Q350 228 353 230" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 3 — right side */}
      <g opacity="0.25">
        <path d="M580 230 Q582 222 585 224" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M580 230 Q582 222 585 224;M580 230 Q583 222 587 225;M580 230 Q582 222 585 224" dur="2.6s" repeatCount="indefinite" />
        </path>
        <path d="M582 230 Q583 224 586 226" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M582 230 Q583 224 586 226;M582 230 Q584 224 588 227;M582 230 Q583 224 586 226" dur="3.1s" repeatCount="indefinite" />
        </path>
        <path d="M578 230 Q580 224 583 226" fill="none" stroke="#3a4528" strokeWidth="0.4">
          <animate attributeName="d" values="M578 230 Q580 224 583 226;M578 230 Q581 224 585 227;M578 230 Q580 224 583 226" dur="2.9s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 4 — foreground left */}
      <g opacity="0.28">
        <path d="M200 236 Q202 228 205 230" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M200 236 Q202 228 205 230;M200 236 Q203 228 207 231;M200 236 Q202 228 205 230" dur="3.4s" repeatCount="indefinite" />
        </path>
        <path d="M198 236 Q200 230 203 232" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M198 236 Q200 230 203 232;M198 236 Q201 230 205 233;M198 236 Q200 230 203 232" dur="3.7s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 5 — near camp path */}
      <g opacity="0.22">
        <path d="M450 232 Q452 224 455 226" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M450 232 Q452 224 455 226;M450 232 Q453 224 457 227;M450 232 Q452 224 455 226" dur="2.7s" repeatCount="indefinite" />
        </path>
        <path d="M448 232 Q450 226 453 228" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M448 232 Q450 226 453 228;M448 232 Q451 226 455 229;M448 232 Q450 226 453 228" dur="3.3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === MEDITERRANEAN PLANTS — agave and succulents on rocky ground === */}
      {/* Agave 1 — large rosette of thick leaves on rocky outcrop */}
      <g opacity="0.35">
        {/* Central spike */}
        <path d="M155 232 L157 218 L159 232" fill="#2a3520" />
        {/* Left leaves — thick, pointed */}
        <path d="M155 232 Q148 224 146 228" fill="#283018" opacity="0.9" />
        <path d="M155 232 Q150 226 149 231" fill="#2a3520" opacity="0.8" />
        {/* Right leaves */}
        <path d="M159 232 Q166 224 168 228" fill="#283018" opacity="0.9" />
        <path d="M159 232 Q164 226 165 231" fill="#2a3520" opacity="0.8" />
        {/* Lower leaves splaying out */}
        <path d="M155 232 Q147 230 145 233" fill="#2a3520" opacity="0.7" />
        <path d="M159 232 Q167 230 169 233" fill="#283018" opacity="0.7" />
      </g>
      {/* Agave 2 — smaller, near right rocks */}
      <g opacity="0.28">
        <path d="M670 232 L672 222 L674 232" fill="#2a3520" />
        <path d="M670 232 Q664 226 663 230" fill="#283018" opacity="0.9" />
        <path d="M674 232 Q680 226 681 230" fill="#283018" opacity="0.9" />
        <path d="M670 232 Q665 230 664 233" fill="#2a3520" opacity="0.7" />
        <path d="M674 232 Q679 230 680 233" fill="#283018" opacity="0.7" />
      </g>
      {/* Succulent cluster 1 — rosettes on rock face */}
      <g opacity="0.25">
        <circle cx="505" cy="230" r="2.5" fill="#2a3520" />
        <circle cx="509" cy="231" r="2" fill="#283018" />
        <circle cx="503" cy="232" r="1.8" fill="#2a3520" />
        {/* Tiny rosette detail */}
        <circle cx="505" cy="230" r="1" fill="none" stroke="#354028" strokeWidth="0.3" />
        <circle cx="509" cy="231" r="0.8" fill="none" stroke="#354028" strokeWidth="0.3" />
      </g>
      {/* Succulent cluster 2 — scattered on left ground */}
      <g opacity="0.22">
        <circle cx="222" cy="234" r="2" fill="#2a3520" />
        <circle cx="226" cy="235" r="1.5" fill="#283018" />
        <circle cx="220" cy="236" r="1.5" fill="#2a3520" />
      </g>
      {/* Prickly pear shape — near shoreline */}
      <g opacity="0.2">
        <ellipse cx="405" cy="230" rx="3" ry="4" fill="#2a3520" />
        <ellipse cx="408" cy="226" rx="2.5" ry="3.5" fill="#283018" />
        <ellipse cx="403" cy="226" rx="2" ry="3" fill="#2a3520" />
        {/* Tiny spines */}
        <line x1="405" y1="226" x2="405" y2="224" stroke="#4a5538" strokeWidth="0.2" />
        <line x1="408" y1="223" x2="409" y2="221" stroke="#4a5538" strokeWidth="0.2" />
      </g>

      {/* === COBBLESTONE PAVING — remnant of an old road near the camp === */}
      {/* Paved area — partial cobblestone surface, mostly buried/broken */}
      <rect x="340" y="248" width="60" height="32" fill="#302a22" opacity="0.12" rx="2" />
      {/* Cobblestone rows — irregular, worn, half-buried in mud */}
      {/* Row 1 */}
      <rect x="342" y="250" width="6" height="5" rx="1" fill="#3a3530" opacity="0.15" />
      <rect x="350" y="250" width="5.5" height="5" rx="1" fill="#383228" opacity="0.14" />
      <rect x="357" y="250" width="6" height="5" rx="1" fill="#3a3530" opacity="0.13" />
      <rect x="365" y="250" width="5" height="5" rx="1" fill="#353028" opacity="0.14" />
      <rect x="372" y="250" width="6" height="5" rx="1" fill="#3a3530" opacity="0.12" />
      <rect x="380" y="250" width="5.5" height="5" rx="1" fill="#383228" opacity="0.13" />
      <rect x="387" y="250" width="6" height="5" rx="1" fill="#3a3530" opacity="0.11" />
      <rect x="395" y="250" width="4" height="5" rx="1" fill="#353028" opacity="0.1" />
      {/* Row 2 — offset */}
      <rect x="344" y="257" width="5.5" height="5" rx="1" fill="#383228" opacity="0.14" />
      <rect x="351" y="257" width="6" height="5" rx="1" fill="#3a3530" opacity="0.13" />
      <rect x="359" y="257" width="5" height="5" rx="1" fill="#353028" opacity="0.14" />
      <rect x="366" y="257" width="6" height="5" rx="1" fill="#3a3530" opacity="0.12" />
      <rect x="374" y="257" width="5.5" height="5" rx="1" fill="#383228" opacity="0.13" />
      <rect x="381" y="257" width="6" height="5" rx="1" fill="#3a3530" opacity="0.11" />
      <rect x="389" y="257" width="5" height="5" rx="1" fill="#353028" opacity="0.1" />
      {/* Row 3 */}
      <rect x="342" y="264" width="6" height="5" rx="1" fill="#3a3530" opacity="0.12" />
      <rect x="350" y="264" width="5.5" height="5" rx="1" fill="#383228" opacity="0.11" />
      <rect x="357" y="264" width="6" height="5" rx="1" fill="#353028" opacity="0.12" />
      <rect x="365" y="264" width="5" height="5" rx="1" fill="#3a3530" opacity="0.1" />
      <rect x="372" y="264" width="6" height="5" rx="1" fill="#383228" opacity="0.11" />
      <rect x="380" y="264" width="5.5" height="5" rx="1" fill="#3a3530" opacity="0.1" />
      <rect x="387" y="264" width="6" height="5" rx="1" fill="#353028" opacity="0.09" />
      {/* Row 4 — most buried, fragments only */}
      <rect x="346" y="271" width="5" height="4.5" rx="1" fill="#3a3530" opacity="0.08" />
      <rect x="354" y="271" width="5.5" height="4.5" rx="1" fill="#383228" opacity="0.09" />
      <rect x="362" y="271" width="6" height="4.5" rx="1" fill="#353028" opacity="0.08" />
      <rect x="370" y="271" width="5" height="4.5" rx="1" fill="#3a3530" opacity="0.07" />
      <rect x="378" y="271" width="5.5" height="4.5" rx="1" fill="#383228" opacity="0.08" />
      {/* Gaps between cobblestones — dark mortar lines */}
      <line x1="349" y1="250" x2="349" y2="278" stroke="#1a1810" strokeWidth="0.3" opacity="0.08" />
      <line x1="357" y1="250" x2="357" y2="278" stroke="#1a1810" strokeWidth="0.3" opacity="0.07" />
      <line x1="365" y1="250" x2="365" y2="278" stroke="#1a1810" strokeWidth="0.3" opacity="0.08" />
      <line x1="372" y1="250" x2="372" y2="278" stroke="#1a1810" strokeWidth="0.3" opacity="0.07" />
      <line x1="380" y1="250" x2="380" y2="278" stroke="#1a1810" strokeWidth="0.3" opacity="0.06" />
      <line x1="388" y1="250" x2="388" y2="278" stroke="#1a1810" strokeWidth="0.3" opacity="0.06" />
      {/* Horizontal mortar lines */}
      <line x1="342" y1="255" x2="399" y2="255" stroke="#1a1810" strokeWidth="0.3" opacity="0.07" />
      <line x1="342" y1="262" x2="394" y2="262" stroke="#1a1810" strokeWidth="0.3" opacity="0.06" />
      <line x1="342" y1="269" x2="393" y2="269" stroke="#1a1810" strokeWidth="0.3" opacity="0.06" />
      {/* Weeds growing through cracks */}
      <path d="M352 262 Q353 258 355 260" fill="none" stroke="#3a4528" strokeWidth="0.3" opacity="0.12">
        <animate attributeName="d" values="M352 262 Q353 258 355 260;M352 262 Q354 258 357 260;M352 262 Q353 258 355 260" dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M375 269 Q376 266 378 267" fill="none" stroke="#354020" strokeWidth="0.3" opacity="0.1" />
      {/* Mud encroachment — filling in the cobblestone edges */}
      <path d="M340 250 Q342 252 342 256 Q340 260 338 264" fill="#332e28" opacity="0.08" />
      <path d="M400 250 Q398 254 399 258 Q400 262 402 266" fill="#332e28" opacity="0.06" />

      {/* === MUDDY PATH — worn track connecting shelters and fires === */}
      {/* Main path — darker muddy strip winding through camp */}
      <path d="M130 290 Q175 288 220 292 Q260 300 300 308 Q340 312 400 305 Q460 296 520 290 Q570 286 620 290 Q660 296 700 300"
        fill="none" stroke="url(#ch1_mudPath)" strokeWidth="10" opacity="0.35" strokeLinecap="round" />
      {/* Path edges — worn dirt lines */}
      <path d="M130 286 Q175 284 220 288 Q260 296 300 304 Q340 308 400 301 Q460 292 520 286 Q570 282 620 286 Q660 292 700 296"
        fill="none" stroke="#2a2218" strokeWidth="0.6" opacity="0.25" />
      <path d="M130 294 Q175 292 220 296 Q260 304 300 312 Q340 316 400 309 Q460 300 520 294 Q570 290 620 294 Q660 300 700 304"
        fill="none" stroke="#2a2218" strokeWidth="0.6" opacity="0.25" />
      {/* Ruts — thin dark lines in the mud from boots and cart wheels */}
      <path d="M145 289 Q180 287 210 291 Q245 298 280 305"
        fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.2" />
      <path d="M320 310 Q360 308 400 303 Q440 298 480 293"
        fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.2" />
      {/* Cart wheel tracks — parallel ruts with ridge between */}
      <path d="M160 292 Q200 290 240 296 Q280 304 310 310"
        fill="none" stroke="#1a1810" strokeWidth="0.8" opacity="0.12" />
      <path d="M165 290 Q205 288 245 294 Q285 302 315 308"
        fill="none" stroke="#1a1810" strokeWidth="0.8" opacity="0.12" />
      {/* Wheel track impressions — periodic deeper marks */}
      <ellipse cx="190" cy="291" rx="1.5" ry="0.8" fill="#1a1810" opacity="0.08" />
      <ellipse cx="220" cy="294" rx="1.5" ry="0.8" fill="#1a1810" opacity="0.07" />
      <ellipse cx="260" cy="300" rx="1.5" ry="0.8" fill="#1a1810" opacity="0.08" />
      {/* Boot prints — individual footprints in soft mud alongside path */}
      {/* Right boot print pair — going toward camp */}
      <path d="M175 296 L175 299 Q176 300 177 299 L177 296 Q176 295 175 296 Z" fill="#1a1810" opacity="0.1" />
      <path d="M180 295 L180 298 Q181 299 182 298 L182 295 Q181 294 180 295 Z" fill="#1a1810" opacity="0.09" />
      {/* Left boot prints — going away, deeper */}
      <path d="M350 308 L350 311 Q351 312 352 311 L352 308 Q351 307 350 308 Z" fill="#1a1810" opacity="0.1" />
      <path d="M355 306 L355 309 Q356 310 357 309 L357 306 Q356 305 355 306 Z" fill="#1a1810" opacity="0.09" />
      {/* Scuffed prints — dragged feet of exhausted soldiers */}
      <path d="M420 300 Q425 299 430 301" fill="none" stroke="#1a1810" strokeWidth="0.6" opacity="0.08" />
      <path d="M435 298 Q440 297 445 299" fill="none" stroke="#1a1810" strokeWidth="0.6" opacity="0.07" />
      {/* More scuff marks — soldiers barely lifting feet */}
      <path d="M500 290 Q504 289 508 291" fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.07" />
      <path d="M512 289 Q516 288 520 290" fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.06" />
      {/* Puddle in a rut */}
      <ellipse cx="250" cy="296" rx="6" ry="2" fill="#3a4555" opacity="0.15" />
      {/* Puddle surface reflection — faint sky shimmer */}
      <ellipse cx="250" cy="295" rx="4" ry="1" fill="#5a5565" opacity="0.06" />
      <ellipse cx="480" cy="292" rx="5" ry="1.5" fill="#3a4555" opacity="0.12" />
      {/* Additional puddle — larger, in low spot */}
      <ellipse cx="340" cy="310" rx="8" ry="2.5" fill="#3a4555" opacity="0.1" />
      <ellipse cx="340" cy="309" rx="5" ry="1.2" fill="#5a5565" opacity="0.04" />
      {/* Damp earth sheen around puddles */}
      <ellipse cx="250" cy="296" rx="12" ry="4" fill="url(#ch1_dampSheen)" />
      <ellipse cx="340" cy="310" rx="14" ry="5" fill="url(#ch1_dampSheen)" />

      {/* === OLIVE TREE — Mediterranean vegetation === */}
      <path d="M80 232 Q82 210 84 192 Q85 178 86 168" fill="none" stroke="#3a3528" strokeWidth="2.5" />
      <path d="M86 168 Q92 155 95 165" fill="none" stroke="#3a3528" strokeWidth="1.2" />
      <path d="M86 168 Q78 158 76 166" fill="none" stroke="#3a3528" strokeWidth="1" />
      <path d="M84 180 Q78 172 76 178" fill="none" stroke="#3a3528" strokeWidth="0.8" />
      <path d="M84 180 Q90 174 92 180" fill="none" stroke="#3a3528" strokeWidth="0.7" />
      {/* Sparse olive leaves — dark green-grey, wind-tossed */}
      <ellipse cx="95" cy="160" rx="8" ry="5" fill="#2a3520" opacity="0.35" />
      <ellipse cx="76" cy="162" rx="7" ry="4" fill="#283020" opacity="0.3" />
      <ellipse cx="88" cy="172" rx="6" ry="4" fill="#2a3520" opacity="0.25" />
      <ellipse cx="78" cy="175" rx="5" ry="3" fill="#283020" opacity="0.2" />
      {/* Additional olive leaf clusters — wind-tossed, asymmetric */}
      <ellipse cx="100" cy="155" rx="5" ry="3" fill="#283020" opacity="0.2">
        <animate attributeName="rx" values="5;5.5;5" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="72" cy="170" rx="4" ry="2.5" fill="#2a3520" opacity="0.18" />
      {/* Olives — tiny dark fruits barely visible */}
      <circle cx="92" cy="163" r="0.8" fill="#1a2018" opacity="0.2" />
      <circle cx="80" cy="168" r="0.7" fill="#1a2018" opacity="0.18" />
      <circle cx="98" cy="158" r="0.6" fill="#1a2018" opacity="0.15" />
      {/* Trunk texture — bark lines and knots */}
      <path d="M82 200 Q83 198 82 196" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.2" />
      <path d="M84 210 Q85 208 84 205" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.18" />
      <path d="M83 218 Q84 215 83 212" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.15" />
      {/* Shadow beneath olive tree */}
      <ellipse cx="85" cy="232" rx="18" ry="4" fill="#1a1810" opacity="0.12" />
      {/* Fallen olives on ground — scattered beneath tree */}
      <circle cx="78" cy="234" r="0.6" fill="#1a2018" opacity="0.12" />
      <circle cx="90" cy="235" r="0.5" fill="#1a2018" opacity="0.1" />
      <circle cx="85" cy="236" r="0.5" fill="#1a2018" opacity="0.1" />

      {/* === SECOND TREE — stunted Mediterranean pine, wind-shaped === */}
      {/* Trunk — leaning with the prevailing wind */}
      <path d="M695 232 Q693 212 690 196 Q688 184 686 178" fill="none" stroke="#3a3528" strokeWidth="2" opacity="0.35" />
      {/* Wind-shaped branches — all leaning one way */}
      <path d="M686 178 Q694 172 698 176" fill="none" stroke="#3a3528" strokeWidth="0.8" opacity="0.25" />
      <path d="M688 188 Q696 184 700 188" fill="none" stroke="#3a3528" strokeWidth="0.7" opacity="0.22" />
      <path d="M690 196 Q682 190 680 194" fill="none" stroke="#3a3528" strokeWidth="0.6" opacity="0.2" />
      {/* Sparse dark needle clusters */}
      <ellipse cx="698" cy="174" rx="6" ry="3" fill="#1a2818" opacity="0.25" />
      <ellipse cx="700" cy="186" rx="5" ry="2.5" fill="#1a2818" opacity="0.2" />
      <ellipse cx="680" cy="192" rx="5" ry="2.5" fill="#1a2818" opacity="0.18" />
      {/* Shadow beneath */}
      <ellipse cx="692" cy="233" rx="12" ry="3" fill="#1a1810" opacity="0.08" />

      {/* Scrubby coastal plants */}
      <path d="M120 238 Q122 232 125 235 Q128 230 130 237" fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.3" />
      <path d="M560 232 Q562 226 565 230 Q568 225 570 232" fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.25" />
      <path d="M680 235 Q682 230 685 233 Q688 228 690 235" fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.25" />
      <path d="M360 236 Q362 230 365 234 Q368 229 370 236" fill="none" stroke="#3a4530" strokeWidth="0.6" opacity="0.2" />

      {/* === DRIED THISTLES — dead brown Mediterranean thistles === */}
      {/* Thistle 1 — tall dried stalk with spiky head, near path */}
      <g opacity="0.3">
        <line x1="270" y1="248" x2="272" y2="228" stroke="#5a5035" strokeWidth="0.6" />
        {/* Dried thistle head — spiky brown ball */}
        <circle cx="272" cy="226" r="2.5" fill="none" stroke="#6a5a3a" strokeWidth="0.5" />
        <line x1="272" y1="223" x2="272" y2="221" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="269" y1="225" x2="267" y2="224" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="275" y1="225" x2="277" y2="224" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="270" y1="228" x2="268" y2="227" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="274" y1="228" x2="276" y2="227" stroke="#6a5a3a" strokeWidth="0.3" />
        {/* Dried leaf on stalk */}
        <path d="M271 238 Q267 235 270 233" fill="none" stroke="#5a5035" strokeWidth="0.4" />
      </g>
      {/* Thistle 2 — shorter, broken stalk near shelter 3 */}
      <g opacity="0.25">
        <line x1="590" y1="284" x2="591" y2="270" stroke="#5a5035" strokeWidth="0.5" />
        <circle cx="591" cy="268" r="2" fill="none" stroke="#6a5a3a" strokeWidth="0.4" />
        <line x1="591" y1="266" x2="591" y2="264" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="589" y1="267" x2="587" y2="266" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="593" y1="267" x2="595" y2="266" stroke="#6a5a3a" strokeWidth="0.3" />
      </g>
      {/* Thistle 3 — cluster of dead stalks near foreground rocks */}
      <g opacity="0.22">
        <line x1="640" y1="352" x2="641" y2="340" stroke="#5a5035" strokeWidth="0.4" />
        <circle cx="641" cy="338" r="1.8" fill="none" stroke="#6a5a3a" strokeWidth="0.3" />
        <line x1="644" y1="352" x2="645" y2="342" stroke="#5a5035" strokeWidth="0.4" />
        <circle cx="645" cy="340" r="1.5" fill="none" stroke="#6a5a3a" strokeWidth="0.3" />
      </g>

      {/* === COASTAL GRASS CLUMPS — thick, windswept, half-dead === */}
      {/* Large grass clump 1 — dense tuft near shoreline */}
      <g opacity="0.3">
        <path d="M475 234 Q478 220 482 224" fill="none" stroke="#3a4528" strokeWidth="0.6">
          <animate attributeName="d" values="M475 234 Q478 220 482 224;M475 234 Q479 220 484 225;M475 234 Q478 220 482 224" dur="2.8s" repeatCount="indefinite" />
        </path>
        <path d="M477 234 Q479 222 483 226" fill="none" stroke="#354020" strokeWidth="0.5">
          <animate attributeName="d" values="M477 234 Q479 222 483 226;M477 234 Q480 222 485 227;M477 234 Q479 222 483 226" dur="3.1s" repeatCount="indefinite" />
        </path>
        <path d="M473 234 Q476 222 480 225" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M473 234 Q476 222 480 225;M473 234 Q477 222 482 226;M473 234 Q476 222 480 225" dur="3.4s" repeatCount="indefinite" />
        </path>
        <path d="M479 234 Q480 224 484 227" fill="none" stroke="#454a30" strokeWidth="0.4">
          <animate attributeName="d" values="M479 234 Q480 224 484 227;M479 234 Q481 224 486 228;M479 234 Q480 224 484 227" dur="2.5s" repeatCount="indefinite" />
        </path>
        {/* Dead brown blades mixed in */}
        <path d="M476 234 Q477 224 480 228" fill="none" stroke="#5a5035" strokeWidth="0.3" />
        <path d="M474 234 Q475 226 478 229" fill="none" stroke="#5a5035" strokeWidth="0.3" />
      </g>
      {/* Large grass clump 2 — near right rocks */}
      <g opacity="0.28">
        <path d="M720 350 Q722 340 726 343" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M720 350 Q722 340 726 343;M720 350 Q723 340 728 344;M720 350 Q722 340 726 343" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M722 350 Q724 342 728 345" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M722 350 Q724 342 728 345;M722 350 Q725 342 730 346;M722 350 Q724 342 728 345" dur="3.3s" repeatCount="indefinite" />
        </path>
        <path d="M718 350 Q720 342 724 344" fill="none" stroke="#3a4528" strokeWidth="0.4">
          <animate attributeName="d" values="M718 350 Q720 342 724 344;M718 350 Q721 342 726 345;M718 350 Q720 342 724 344" dur="2.7s" repeatCount="indefinite" />
        </path>
        <path d="M721 350 Q722 343 725 346" fill="none" stroke="#5a5035" strokeWidth="0.3" />
      </g>
      {/* Grass clump 3 — small, near camp path left */}
      <g opacity="0.24">
        <path d="M160 350 Q162 342 165 345" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M160 350 Q162 342 165 345;M160 350 Q163 342 167 346;M160 350 Q162 342 165 345" dur="3.2s" repeatCount="indefinite" />
        </path>
        <path d="M158 350 Q160 344 163 346" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M158 350 Q160 344 163 346;M158 350 Q161 344 165 347;M158 350 Q160 344 163 346" dur="2.9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === CRUDE GRAVE MARKERS — soldiers who didn't survive the winter === */}
      {/* Small mound of stones — burial cairn 1 */}
      <g opacity="0.35">
        <ellipse cx="738" cy="242" rx="6" ry="2" fill="#3a3530" />
        {/* Wooden cross — lashed together from sticks */}
        <line x1="738" y1="242" x2="738" y2="230" stroke="url(#ch1_graveWood)" strokeWidth="1.2" />
        <line x1="733" y1="234" x2="743" y2="234" stroke="url(#ch1_graveWood)" strokeWidth="1" />
        {/* Cross leaning slightly with wind */}
        <animateTransform attributeName="transform" type="rotate" values="-2 738 242;0 738 242;-2 738 242" dur="8s" repeatCount="indefinite" />
      </g>
      {/* Second grave — smaller, older, cross broken */}
      <g opacity="0.25">
        <ellipse cx="726" cy="244" rx="4" ry="1.5" fill="#3a3530" />
        <line x1="726" y1="244" x2="726" y2="236" stroke="#3a3025" strokeWidth="0.8" />
        {/* Broken crossbar — snapped by weather */}
        <line x1="723" y1="238" x2="726" y2="238" stroke="#3a3025" strokeWidth="0.7" />
      </g>
      {/* Third grave — just a pile of rocks, no cross at all */}
      <ellipse cx="718" cy="246" rx="5" ry="1.8" fill="#3a3530" opacity="0.2" />
      <circle cx="716" cy="246" r="1.2" fill="#3a3530" opacity="0.25" />
      <circle cx="720" cy="245" r="1" fill="#3a3530" opacity="0.22" />

      {/* === LOOKOUT POST — sentry standing on a rock overlooking the sea === */}
      {/* Elevated rock outcrop */}
      <path d="M745 228 Q752 218 762 220 Q770 218 775 226 Q768 230 758 230 Q750 230 745 228 Z" fill="#3a3530" opacity="0.5" />
      <path d="M748 228 Q755 226 765 226 Q772 226 774 228" fill="none" stroke="#4a4540" strokeWidth="0.5" opacity="0.3" />
      {/* Sentry soldier — standing upright, musket shouldered, scanning sea */}
      <path d="M758 218 Q756 210 758 200 Q760 194 762 200 L764 218 L766 228 L763 230 L759 230 L756 228 Z"
        fill="#1a1815" opacity="0.65" />
      <circle cx="760" cy="192" r="4" fill="#1a1815" opacity="0.65" />
      {/* Musket on shoulder — angled up */}
      <line x1="762" y1="198" x2="770" y2="185" stroke="#2a2520" strokeWidth="1" opacity="0.45" />
      {/* Bayonet tip — glint */}
      <line x1="770" y1="185" x2="771" y2="182" stroke="#6a6a70" strokeWidth="0.5" opacity="0.2" />
      {/* Wind catching his coat */}
      <path d="M756 212 Q753 210 752 214" fill="none" stroke="#1a1815" strokeWidth="1" opacity="0.35">
        <animate attributeName="d" values="M756 212 Q753 210 752 214;M756 212 Q752 209 750 213;M756 212 Q753 210 752 214" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* === GRAFFITI ON ROCK — "VIVE LA REPUBLIQUE" scratched into stone === */}
      {/* Large flat rock face near camp */}
      <path d="M495 228 Q508 222 525 226 Q530 230 520 234 Q510 236 498 233 Z" fill="#3a3530" opacity="0.5" />
      {/* Scratched text — faint, rough, revolutionary */}
      <text x="500" y="230" fontFamily="serif" fontSize="3.5" fill="#5a5550" opacity="0.3"
        letterSpacing="0.5" transform="rotate(-3 510 230)">VIVE LA REPUBLIQUE</text>
      {/* Scratch marks around the text — soldiers idle carving */}
      <line x1="498" y1="232" x2="524" y2="231" stroke="#4a4540" strokeWidth="0.2" opacity="0.2" />
      <line x1="500" y1="227" x2="522" y2="226" stroke="#4a4540" strokeWidth="0.2" opacity="0.15" />

      {/* === CAMP AREA — ragged, miserable === */}

      {/* Shelter 1 — leaning canvas, wind-worn */}
      <path d="M140 285 L175 258 L210 285" fill="none" stroke="#5a5045" strokeWidth="1.5" />
      <path d="M145 285 L175 260 L205 285" fill="#3a3530" opacity="0.5" />
      {/* Canvas patches — multiple */}
      <path d="M155 275 L160 268 L168 276" fill="#3a3530" opacity="0.3" />
      <path d="M182 272 L188 265 L195 275" fill="#3a3530" opacity="0.25" />
      {/* Pole */}
      <line x1="175" y1="258" x2="175" y2="285" stroke="#4a4540" strokeWidth="1" opacity="0.4" />
      {/* Wind flapping canvas edge */}
      <path d="M210 285 Q215 282 218 285" fill="none" stroke="#5a5045" strokeWidth="0.8" opacity="0.3">
        <animate attributeName="d" values="M210 285 Q215 282 218 285;M210 285 Q215 280 220 284;M210 285 Q215 282 218 285" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Patched canvas — darker square sewn onto shelter 1 */}
      <path d="M162 272 L166 266 L172 270 L168 276 Z" fill="#4a4035" opacity="0.3" />
      <path d="M168 276 L172 270" fill="none" stroke="#5a5045" strokeWidth="0.3" opacity="0.2" />
      {/* Sagging rope tie — holding shelter 1 to a ground stake */}
      <path d="M145 285 Q138 288 132 292" fill="none" stroke="#4a4035" strokeWidth="0.5" opacity="0.35">
        <animate attributeName="d" values="M145 285 Q138 288 132 292;M145 285 Q137 289 131 293;M145 285 Q138 288 132 292" dur="4s" repeatCount="indefinite" />
      </path>
      <line x1="132" y1="292" x2="132" y2="296" stroke="#4a4035" strokeWidth="0.8" opacity="0.3" />
      {/* Second rope tie — opposite side */}
      <path d="M205 285 Q212 288 218 290" fill="none" stroke="#4a4035" strokeWidth="0.5" opacity="0.3" />
      <line x1="218" y1="290" x2="218" y2="294" stroke="#4a4035" strokeWidth="0.8" opacity="0.25" />
      {/* Blanket roll near tent */}
      <ellipse cx="225" cy="290" rx="14" ry="4.5" fill="#4a4540" opacity="0.55" />
      <path d="M212 290 Q218 288 225 290 Q232 288 238 290" fill="none" stroke="#504a45" strokeWidth="0.5" opacity="0.3" />

      {/* Shelter 1 shadow — cast by the canvas in firelight */}
      <path d="M145 285 Q140 290 132 300 Q128 308 125 315" fill="#1a1510" opacity="0.06" />
      {/* Canvas texture lines on shelter 1 — visible weave */}
      <path d="M155 280 Q165 272 175 264" fill="none" stroke="#4a4540" strokeWidth="0.3" opacity="0.12" />
      <path d="M160 280 Q170 272 178 266" fill="none" stroke="#4a4540" strokeWidth="0.3" opacity="0.1" />
      <path d="M185 280 Q190 272 195 266" fill="none" stroke="#4a4540" strokeWidth="0.3" opacity="0.1" />
      {/* Firelight warm patch on inside of shelter facing fire */}
      <path d="M175 265 Q195 275 205 282" fill="#6a4a28" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Scattered straw near shelter 1 sleeping area */}
      <line x1="215" y1="296" x2="222" y2="294" stroke="#5a5535" strokeWidth="0.5" opacity="0.25" />
      <line x1="218" y1="298" x2="226" y2="297" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />
      <line x1="230" y1="293" x2="237" y2="292" stroke="#5a5535" strokeWidth="0.5" opacity="0.22" />
      <line x1="220" y1="300" x2="228" y2="299" stroke="#504a30" strokeWidth="0.4" opacity="0.18" />
      <line x1="234" y1="296" x2="240" y2="294" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />

      {/* === LANTERN — dim oil lantern near shelter 1 === */}
      {/* Lantern glow on ground */}
      <ellipse cx="148" cy="287" rx="10" ry="5" fill="url(#ch1_lanternGlow)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Lantern body — small iron box shape */}
      <rect x="145" y="278" width="5" height="7" rx="0.5" fill="#2a2520" opacity="0.6" />
      {/* Glass panel — warm glow */}
      <rect x="146" y="279" width="3" height="5" rx="0.3" fill="#a07030" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Lantern top — cap and ring */}
      <rect x="144" y="277" width="7" height="1.5" rx="0.5" fill="#3a3530" opacity="0.5" />
      <path d="M146 277 Q148 274 150 277" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.4" />
      {/* Lantern handle ring */}
      <circle cx="148" cy="273" r="1" fill="none" stroke="#3a3530" strokeWidth="0.4" opacity="0.3" />
      {/* Warm light flicker on nearby ground */}
      <ellipse cx="152" cy="286" rx="4" ry="1.5" fill="#a07030" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === SECOND LANTERN — dim oil lantern hung on laundry pole near shelter 2 === */}
      {/* Lantern glow on ground */}
      <ellipse cx="440" cy="274" rx="12" ry="6" fill="url(#ch1_lanternPool)">
        <animate attributeName="opacity" values="0.7;0.45;0.7" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Lantern body — hanging from laundry pole */}
      <rect x="438" y="257" width="4" height="5.5" rx="0.5" fill="#2a2520" opacity="0.55" />
      {/* Glass panel — warm glow */}
      <rect x="439" y="258" width="2" height="4" rx="0.3" fill="#a07030" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.12;0.2" dur="3.5s" repeatCount="indefinite" />
      </rect>
      {/* Lantern top */}
      <rect x="437" y="256" width="6" height="1.2" rx="0.5" fill="#3a3530" opacity="0.45" />
      {/* Hook on pole */}
      <path d="M440 256 Q440 254 441 253" fill="none" stroke="#3a3530" strokeWidth="0.4" opacity="0.35" />
      {/* Warm flicker on nearby surface */}
      <ellipse cx="442" cy="272" rx="5" ry="2" fill="#a07030" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="2.8s" repeatCount="indefinite" />
      </ellipse>

      {/* Shelter 2 — half-collapsed */}
      <path d="M370 280 L400 258 L430 280" fill="none" stroke="#504a45" strokeWidth="1.2" />
      <path d="M375 280 L400 260 L425 280" fill="#353025" opacity="0.45" />
      {/* Collapsed side */}
      <path d="M425 280 L440 275" fill="none" stroke="#504a45" strokeWidth="1" opacity="0.3" />
      {/* Patched canvas on shelter 2 — mismatched darker fabric */}
      <path d="M390 270 L396 263 L404 268 L398 275 Z" fill="#3a3025" opacity="0.28" />
      <path d="M410 267 L414 262 L420 266 L416 271 Z" fill="#453a30" opacity="0.25" />
      {/* Sagging rope holding collapsed side */}
      <path d="M430 278 Q436 280 440 275" fill="none" stroke="#4a4035" strokeWidth="0.5" opacity="0.3">
        <animate attributeName="d" values="M430 278 Q436 280 440 275;M430 278 Q437 281 441 276;M430 278 Q436 280 440 275" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Ground stake for shelter 2 */}
      <line x1="375" y1="280" x2="370" y2="286" stroke="#4a4035" strokeWidth="0.6" opacity="0.3" />
      <line x1="370" y1="286" x2="370" y2="290" stroke="#4a4035" strokeWidth="0.8" opacity="0.25" />

      {/* Scattered straw near shelter 2 */}
      <line x1="432" y1="282" x2="440" y2="280" stroke="#5a5535" strokeWidth="0.5" opacity="0.22" />
      <line x1="435" y1="284" x2="442" y2="283" stroke="#504a30" strokeWidth="0.4" opacity="0.18" />
      <line x1="380" y1="284" x2="388" y2="283" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />

      {/* Shelter 3 — tiny, just a propped blanket */}
      <path d="M600 282 L615 270 L630 284" fill="#3a3528" opacity="0.35" />

      {/* Scattered straw near shelter 3 */}
      <line x1="595" y1="286" x2="603" y2="285" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />
      <line x1="625" y1="287" x2="633" y2="286" stroke="#504a30" strokeWidth="0.4" opacity="0.18" />
      <line x1="610" y1="289" x2="618" y2="288" stroke="#5a5535" strokeWidth="0.5" opacity="0.2" />
      {/* Shelter 3 shadow */}
      <ellipse cx="615" cy="286" rx="15" ry="3" fill="#1a1510" opacity="0.06" />

      {/* === FIREWOOD PILE — meager stack of collected sticks near fire 1 === */}
      <g opacity="0.35">
        <line x1="268" y1="316" x2="276" y2="314" stroke="#3a3028" strokeWidth="1" />
        <line x1="266" y1="318" x2="275" y2="316" stroke="#3a3028" strokeWidth="0.8" />
        <line x1="270" y1="314" x2="278" y2="312" stroke="#3a3028" strokeWidth="0.7" />
        <line x1="267" y1="320" x2="274" y2="318" stroke="#3a3028" strokeWidth="0.9" />
        {/* Bark fragments around the pile */}
        <path d="M265 320 Q266 319 268 320" fill="#3a3028" opacity="0.3" />
        <path d="M279 314 Q280 313 281 314" fill="#3a3028" opacity="0.25" />
      </g>

      {/* === STONE-LINED DRAINAGE DITCH — soldiers dug to keep shelters dry === */}
      <path d="M145 296 Q180 298 210 295 Q240 292 260 296" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.15" />
      <path d="M145 298 Q180 300 210 297 Q240 294 260 298" fill="none" stroke="#2a2518" strokeWidth="0.5" opacity="0.12" />
      {/* Small stones lining the ditch */}
      <circle cx="150" cy="297" r="0.8" fill="#3a3530" opacity="0.18" />
      <circle cx="165" cy="298" r="0.7" fill="#3a3530" opacity="0.15" />
      <circle cx="190" cy="296" r="0.8" fill="#3a3530" opacity="0.16" />
      <circle cx="225" cy="294" r="0.7" fill="#3a3530" opacity="0.14" />
      <circle cx="250" cy="296" r="0.8" fill="#3a3530" opacity="0.15" />

      {/* === LAUNDRY LINE — tattered shirts and trousers drying between poles === */}
      {/* Laundry poles — rough sticks stuck in the ground */}
      <line x1="440" y1="275" x2="440" y2="255" stroke="#4a4035" strokeWidth="1.2" opacity="0.45" />
      <line x1="520" y1="273" x2="520" y2="255" stroke="#4a4035" strokeWidth="1.2" opacity="0.45" />
      {/* Sagging rope line */}
      <path d="M440 256 Q480 262 520 256" fill="none" stroke="#4a4540" strokeWidth="0.5" opacity="0.35">
        <animate attributeName="d" values="M440 256 Q480 262 520 256;M440 256 Q480 264 520 256;M440 256 Q480 262 520 256" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Tattered shirt — large, patched, swaying */}
      <path d="M455 257 L454 269 L463 269 L463 257" fill="#4a4540" opacity="0.3">
        <animate attributeName="d" values="M455 257 L454 269 L463 269 L463 257;M455 258 L453 270 L462 270 L463 258;M455 257 L454 269 L463 269 L463 257" dur="4.2s" repeatCount="indefinite" />
      </path>
      {/* Patch on shirt */}
      <rect x="457" y="262" width="3" height="3" fill="#3a3528" opacity="0.2">
        <animate attributeName="x" values="457;456;457" dur="4.2s" repeatCount="indefinite" />
      </rect>
      {/* Tattered trousers — hanging by waist */}
      <path d="M475 258 L474 272 L477 272 L478 264 L479 272 L482 272 L482 258" fill="#3a3530" opacity="0.28">
        <animate attributeName="d" values="M475 258 L474 272 L477 272 L478 264 L479 272 L482 272 L482 258;M475 259 L473 273 L476 273 L477 265 L478 273 L481 273 L482 259;M475 258 L474 272 L477 272 L478 264 L479 272 L482 272 L482 258" dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* Small rag — just a strip of cloth */}
      <path d="M498 258 L497 264 L502 264 L503 258" fill="#504a40" opacity="0.22">
        <animate attributeName="d" values="M498 258 L497 264 L502 264 L503 258;M498 259 L496 265 L501 265 L503 259;M498 258 L497 264 L502 264 L503 258" dur="3.6s" repeatCount="indefinite" />
      </path>

      {/* === CLOTHESLINE — tattered clothes drying between two stakes === */}
      {/* Stakes */}
      <line x1="155" y1="250" x2="155" y2="238" stroke="#4a4035" strokeWidth="1.2" opacity="0.5" />
      <line x1="230" y1="252" x2="230" y2="240" stroke="#4a4035" strokeWidth="1.2" opacity="0.5" />
      {/* Rope — slight sag */}
      <path d="M155 239 Q192 243 230 241" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.4">
        <animate attributeName="d" values="M155 239 Q192 243 230 241;M155 239 Q192 245 230 241;M155 239 Q192 243 230 241" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Tattered shirt — patched, swaying */}
      <path d="M170 240 L170 251 L178 251 L178 240" fill="#4a4540" opacity="0.35">
        <animate attributeName="d" values="M170 240 L170 251 L178 251 L178 240;M170 241 L169 252 L177 252 L178 241;M170 240 L170 251 L178 251 L178 240" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Patch on shirt */}
      <rect x="172" y="244" width="3" height="3" fill="#3a3528" opacity="0.25">
        <animate attributeName="x" values="172;171;172" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Tattered breeches — small rectangle */}
      <path d="M190 241 L189 249 L197 249 L197 241" fill="#3a3530" opacity="0.3">
        <animate attributeName="d" values="M190 241 L189 249 L197 249 L197 241;M190 242 L188 250 L196 250 L197 242;M190 241 L189 249 L197 249 L197 241" dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* Torn cloth scrap */}
      <path d="M210 241 L209 247 L214 248 L215 241" fill="#504a40" opacity="0.25">
        <animate attributeName="d" values="M210 241 L209 247 L214 248 L215 241;M210 242 L208 248 L213 249 L215 242;M210 241 L209 247 L214 248 L215 241" dur="3.8s" repeatCount="indefinite" />
      </path>

      {/* === TATTERED FLAG WITH WIND VANE / PENNANT — Republic still lives === */}
      {/* Flagpole — slightly leaning with the wind, swaying */}
      <line x1="260" y1="248" x2="260" y2="222" stroke="#4a4540" strokeWidth="1.5" opacity="0.5">
        <animate attributeName="x2" values="260;261;260;259;260" dur="5s" repeatCount="indefinite" />
      </line>
      {/* Main flag body — tattered tricolor, catching the wind, billowing */}
      <path d="M260 222 Q268 220 275 224 Q268 228 260 226" fill="#3a3545" opacity="0.35">
        <animate attributeName="d" values="M260 222 Q268 220 275 224 Q268 228 260 226;M260 222 Q272 218 280 222 Q272 226 260 226;M260 222 Q266 221 272 225 Q266 229 260 226;M260 222 Q270 219 278 223 Q270 227 260 226;M260 222 Q268 220 275 224 Q268 228 260 226" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Faded blue stripe — hint of tricolor */}
      <path d="M260 222 Q264 221 267 223 Q264 225 260 224" fill="#2a3050" opacity="0.12">
        <animate attributeName="d" values="M260 222 Q264 221 267 223 Q264 225 260 224;M260 222 Q265 220 269 222 Q265 224 260 224;M260 222 Q264 221 267 223 Q264 225 260 224" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Faded red stripe — right end */}
      <path d="M271 222 Q274 221 275 224 Q274 226 271 225" fill="#5a2a2a" opacity="0.1">
        <animate attributeName="d" values="M271 222 Q274 221 275 224 Q274 226 271 225;M274 220 Q278 219 280 222 Q278 224 274 224;M269 223 Q272 222 272 225 Q272 227 269 226;M272 221 Q276 220 278 223 Q276 225 272 224;M271 222 Q274 221 275 224 Q274 226 271 225" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Flag edge — torn, fraying */}
      <path d="M275 222 Q276 224 275 226" fill="none" stroke="#4a3a40" strokeWidth="0.4" opacity="0.2">
        <animate attributeName="d" values="M275 222 Q276 224 275 226;M280 220 Q281 222 280 224;M272 223 Q273 225 272 227;M278 221 Q279 223 278 225;M275 222 Q276 224 275 226" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Wind vane / pennant — small animated streamer at flagpole top */}
      <path d="M260 222 Q265 219 270 221" fill="none" stroke="#5a4545" strokeWidth="0.8" opacity="0.35">
        <animate attributeName="d" values="M260 222 Q265 219 270 221;M260 222 Q267 218 274 220;M260 222 Q264 220 268 222;M260 222 Q267 218 274 220;M260 222 Q265 219 270 221" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M270 221 Q273 220 275 221" fill="none" stroke="#5a4545" strokeWidth="0.5" opacity="0.25">
        <animate attributeName="d" values="M270 221 Q273 220 275 221;M274 220 Q277 219 280 220;M268 222 Q271 221 273 222;M274 220 Q277 219 280 220;M270 221 Q273 220 275 221" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Pennant tail — thin flapping tip */}
      <path d="M275 221 L278 222 L276 223" fill="#5a4545" opacity="0.2">
        <animate attributeName="d" values="M275 221 L278 222 L276 223;M280 220 L284 221 L281 222;M273 222 L276 223 L274 224;M280 220 L284 221 L281 222;M275 221 L278 222 L276 223" dur="2s" repeatCount="indefinite" />
      </path>

      {/* === BROKEN EQUIPMENT — the army hasn't been supplied === */}
      {/* Muskets leaning together */}
      <line x1="280" y1="248" x2="288" y2="292" stroke="#5a5550" strokeWidth="1.5" />
      <line x1="285" y1="248" x2="293" y2="292" stroke="#4a4540" strokeWidth="1.2" />
      <line x1="290" y1="250" x2="285" y2="292" stroke="#4a4540" strokeWidth="1" />

      {/* === BROKEN WHEELBARROW — one wheel missing, tipped over near camp === */}
      {/* Wheelbarrow tray — tipped on its side */}
      <path d="M700 285 L710 278 L730 278 L735 285 L720 290 L705 290 Z" fill="#3a3025" opacity="0.4" />
      {/* Tray interior shadow */}
      <path d="M705 285 L712 280 L728 280 L733 285" fill="#2a2018" opacity="0.25" />
      {/* Remaining wheel — slightly bent */}
      <circle cx="736" cy="282" r="6" fill="none" stroke="#3a3528" strokeWidth="1.2" opacity="0.4" />
      <line x1="736" y1="276" x2="736" y2="288" stroke="#3a3528" strokeWidth="0.6" opacity="0.3" />
      <line x1="730" y1="282" x2="742" y2="282" stroke="#3a3528" strokeWidth="0.6" opacity="0.3" />
      {/* Missing wheel axle stub — broken off */}
      <line x1="700" y1="287" x2="694" y2="287" stroke="#4a4035" strokeWidth="1.5" opacity="0.35" />
      <circle cx="694" cy="287" r="1" fill="#4a4035" opacity="0.3" />
      {/* Wheelbarrow handle — sticking up at angle */}
      <line x1="710" y1="278" x2="698" y2="268" stroke="#3a3025" strokeWidth="1.2" opacity="0.35" />
      <line x1="730" y1="278" x2="740" y2="268" stroke="#3a3025" strokeWidth="1.2" opacity="0.35" />
      {/* Spilled dirt/debris from barrow */}
      <ellipse cx="715" cy="292" rx="8" ry="2" fill="#2a2518" opacity="0.15" />

      {/* Broken cart wheel */}
      <circle cx="530" cy="285" r="12" fill="none" stroke="#3a3528" strokeWidth="1.5" opacity="0.5" />
      <line x1="530" y1="273" x2="530" y2="297" stroke="#3a3528" strokeWidth="0.8" opacity="0.4" />
      <line x1="518" y1="285" x2="542" y2="285" stroke="#3a3528" strokeWidth="0.8" opacity="0.4" />
      <path d="M530 285 L538 278" fill="none" stroke="#3a3528" strokeWidth="0.8" opacity="0.3" />

      {/* === BROKEN CANNON WHEEL — army has no supplies, leaning against rock === */}
      {/* Large rock the cannon wheel leans on */}
      <path d="M125 292 Q135 284 148 286 Q158 288 162 294 Q156 300 142 302 Q130 300 125 296 Z" fill="#3a3530" opacity="0.5" />
      <path d="M128 294 Q138 288 150 290 Q158 292 160 296" fill="none" stroke="#4a4540" strokeWidth="0.4" opacity="0.25" />
      {/* Cannon wheel — large, heavy, cracked, leaning at angle */}
      <g transform="rotate(-15 140 282)" opacity="0.55">
        {/* Outer rim — iron band, rusted */}
        <circle cx="140" cy="282" r="14" fill="none" stroke="#4a3a28" strokeWidth="1.8" />
        {/* Inner hub */}
        <circle cx="140" cy="282" r="3" fill="#3a3025" />
        <circle cx="140" cy="282" r="3" fill="none" stroke="#4a3a28" strokeWidth="0.6" />
        {/* Spokes — 6 radiating, one broken */}
        <line x1="140" y1="282" x2="140" y2="268" stroke="#3a3528" strokeWidth="1.2" />
        <line x1="140" y1="282" x2="140" y2="296" stroke="#3a3528" strokeWidth="1.2" />
        <line x1="140" y1="282" x2="152" y2="275" stroke="#3a3528" strokeWidth="1.2" />
        <line x1="140" y1="282" x2="128" y2="289" stroke="#3a3528" strokeWidth="1.2" />
        <line x1="140" y1="282" x2="152" y2="289" stroke="#3a3528" strokeWidth="1.2" />
        {/* Broken spoke — snapped short */}
        <line x1="140" y1="282" x2="133" y2="276" stroke="#3a3528" strokeWidth="1.2" />
        <line x1="133" y1="276" x2="131" y2="275" stroke="#3a3528" strokeWidth="0.6" opacity="0.3" />
        {/* Crack in the rim */}
        <path d="M150 270 L152 268" fill="none" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        {/* Rust stains */}
        <ellipse cx="145" cy="270" rx="2" ry="1" fill="#5a3a20" opacity="0.1" />
      </g>

      {/* === COLLAPSED FOURTH SHELTER — just fallen sticks and sodden cloth === */}
      {/* This tent gave up — now just a heap of wet canvas on the ground */}
      <path d="M660 310 Q668 308 676 312 Q680 316 672 318 Q664 320 658 316 Z" fill="#3a3530" opacity="0.3" />
      {/* Exposed pole — snapped in half */}
      <line x1="662" y1="314" x2="670" y2="306" stroke="#4a4035" strokeWidth="1" opacity="0.35" />
      <line x1="670" y1="306" x2="672" y2="304" stroke="#4a4035" strokeWidth="0.6" opacity="0.2" />
      {/* Canvas edge trailing in the mud */}
      <path d="M676 314 Q680 312 684 314" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.25">
        <animate attributeName="d" values="M676 314 Q680 312 684 314;M676 314 Q681 311 685 313;M676 314 Q680 312 684 314" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Pooled rainwater on the collapsed canvas */}
      <ellipse cx="668" cy="314" rx="4" ry="1.5" fill="#3a4555" opacity="0.12" />

      {/* === STRIPPED HORSE CARCASS — the army ate the horses === */}
      {/* Bones and ribs — picked clean, grim reminder of starvation */}
      <g opacity="0.25">
        {/* Ribcage — curved bone shapes on the ground */}
        <path d="M132 330 Q136 324 140 328" fill="none" stroke="#6a6558" strokeWidth="0.8" />
        <path d="M134 332 Q138 326 142 330" fill="none" stroke="#6a6558" strokeWidth="0.7" />
        <path d="M136 334 Q140 328 144 332" fill="none" stroke="#6a6558" strokeWidth="0.7" />
        <path d="M138 336 Q142 330 146 334" fill="none" stroke="#6a6558" strokeWidth="0.6" />
        {/* Long leg bone — femur */}
        <line x1="146" y1="330" x2="162" y2="326" stroke="#6a6558" strokeWidth="1" />
        {/* Spine — series of small bumps */}
        <path d="M130 332 Q126 334 122 332 Q118 334 114 332" fill="none" stroke="#6a6558" strokeWidth="0.8" />
        {/* Skull shape — equine */}
        <path d="M110 332 Q106 328 100 330 Q96 332 98 336 Q104 338 110 336 Z" fill="#6a6558" opacity="0.6" />
        <circle cx="104" cy="332" r="1" fill="#1a1810" opacity="0.4" />
      </g>

      {/* Broken shoe — the famous lack of shoes */}
      <path d="M310 298 Q316 294 322 298 L324 302 L308 302 Z" fill="#3a3025" opacity="0.55" />
      {/* Second broken shoe */}
      <path d="M458 300 Q464 296 468 300 L470 303 L456 303 Z" fill="#3a3025" opacity="0.45" />
      {/* Third discarded shoe — sole completely detached, lying open on the ground */}
      <path d="M186 302 Q190 298 196 300 L198 303 L184 304 Z" fill="#3a3025" opacity="0.5" />
      {/* Detached sole — lying next to the shoe upper */}
      <path d="M200 302 L214 301 L215 304 L201 305 Z" fill="#2a2018" opacity="0.4" />
      {/* Worn-through hole in the sole */}
      <ellipse cx="208" cy="303" rx="2" ry="1" fill="#332e28" opacity="0.3" />

      {/* Canteen */}
      <circle cx="340" cy="296" r="4.5" fill="none" stroke="#5a5045" strokeWidth="1" opacity="0.45" />
      <line x1="340" y1="291" x2="342" y2="288" stroke="#5a5045" strokeWidth="0.8" opacity="0.3" />

      {/* Torn knapsack */}
      <path d="M470 290 Q478 285 486 290 Q488 296 480 300 Q472 296 470 290" fill="#3a3525" opacity="0.4" />
      <path d="M475 288 L480 284" fill="none" stroke="#3a3525" strokeWidth="0.8" opacity="0.3" />

      {/* === SCATTERED EQUIPMENT NEAR COBBLESTONES — piled against the old road === */}
      {/* Stacked musket balls — small pyramid of iron spheres */}
      <circle cx="398" cy="276" r="1.2" fill="#3a3a3a" opacity="0.25" />
      <circle cx="400" cy="276" r="1.2" fill="#3a3a3a" opacity="0.22" />
      <circle cx="399" cy="274.5" r="1.2" fill="#3a3a3a" opacity="0.2" />
      {/* Folded blanket — grey wool, threadbare */}
      <path d="M342 278 Q345 276 352 277 Q352 282 345 283 Q342 282 342 278 Z" fill="#3a3838" opacity="0.25" />
      {/* Leather cartridge pouch — dropped on cobbles */}
      <path d="M365 276 Q367 274 372 274 Q374 276 372 279 Q368 280 365 278 Z" fill="#2a2018" opacity="0.22" />

      {/* === ADDITIONAL SCATTERED EQUIPMENT — the destitution of the army === */}
      {/* Cartridge box — leather pouch with cross-belt, dropped on ground */}
      <path d="M350 296 Q352 294 358 294 Q360 296 358 300 Q354 302 350 300 Z" fill="#2a2018" opacity="0.4" />
      <line x1="351" y1="296" x2="357" y2="296" stroke="#3a3025" strokeWidth="0.4" opacity="0.25" />
      <line x1="354" y1="294" x2="346" y2="290" stroke="#3a3025" strokeWidth="0.5" opacity="0.2" />
      {/* Cross-belt — white leather, now filthy grey */}
      <path d="M354 294 Q348 288 342 282" fill="none" stroke="#5a5550" strokeWidth="0.8" opacity="0.15" />
      {/* Powder flask — small copper/brass flask, tarnished */}
      <ellipse cx="395" cy="304" rx="3" ry="2" fill="#4a3a25" opacity="0.35" />
      <line x1="398" y1="304" x2="400" y2="302" stroke="#4a3a25" strokeWidth="0.6" opacity="0.25" />
      <circle cx="400" cy="302" r="0.8" fill="#5a4a30" opacity="0.2" />
      {/* Tin mess plate — dented, empty, lying face-up */}
      <ellipse cx="440" cy="308" rx="5" ry="2" fill="#4a4a4a" opacity="0.2" />
      <ellipse cx="440" cy="308" rx="3.5" ry="1.3" fill="none" stroke="#5a5a5a" strokeWidth="0.3" opacity="0.15" />
      {/* Bent spoon next to plate */}
      <line x1="446" y1="308" x2="450" y2="306" stroke="#5a5a5a" strokeWidth="0.5" opacity="0.2" />
      <ellipse cx="450" cy="305" rx="1.5" ry="1" fill="#5a5a5a" opacity="0.12" />
      {/* Bayonet scabbard — leather and brass, lying on ground */}
      <path d="M560 274 L576 272 L577 274 L561 276 Z" fill="#2a2018" opacity="0.3" />
      <rect x="560" y="273" width="2" height="3" fill="#5a4a30" opacity="0.2" />
      {/* Clay pipe — broken, dropped near fire area */}
      <path d="M325 318 Q328 316 330 318" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.25" />
      <line x1="330" y1="318" x2="338" y2="315" stroke="#6a6560" strokeWidth="0.4" opacity="0.2" />
      {/* Pipe bowl — small rounded end */}
      <circle cx="325" cy="318" r="1.5" fill="#6a6560" opacity="0.2" />
      {/* Wooden tent pegs — scattered around shelters */}
      <line x1="210" y1="292" x2="214" y2="296" stroke="#4a4035" strokeWidth="0.8" opacity="0.25" />
      <line x1="432" y1="278" x2="435" y2="282" stroke="#4a4035" strokeWidth="0.8" opacity="0.22" />
      <line x1="598" y1="284" x2="600" y2="288" stroke="#4a4035" strokeWidth="0.7" opacity="0.2" />
      {/* Small coil of musket flints — scattered near musket stack */}
      <circle cx="292" cy="294" r="1" fill="#5a5a55" opacity="0.2" />
      <circle cx="294" cy="295" r="0.8" fill="#5a5a55" opacity="0.18" />
      <circle cx="290" cy="295" r="0.9" fill="#5a5a55" opacity="0.15" />
      {/* Rolled map or orders — crumpled paper near shelter 2 */}
      <path d="M438 284 Q442 282 446 284 Q442 286 438 284 Z" fill="#8a8060" opacity="0.18" />
      <path d="M439 284 Q442 283 445 284" fill="none" stroke="#6a6050" strokeWidth="0.2" opacity="0.12" />

      {/* Empty barrel — rations gone */}
      <ellipse cx="550" cy="262" rx="7" ry="5" fill="none" stroke="#3a3528" strokeWidth="1" opacity="0.35" />
      <path d="M543 260 L543 270 Q550 272 557 270 L557 260" fill="none" stroke="#3a3528" strokeWidth="0.8" opacity="0.3" />

      {/* === DICE GAME — tiny dice on a flat rock where soldiers gamble === */}
      {/* Flat gambling rock — smooth surface */}
      <path d="M378 296 Q385 292 396 294 Q402 298 394 302 Q386 304 380 300 Z" fill="#3a3530" opacity="0.45" />
      <path d="M380 297 Q388 294 395 296 Q400 299 393 301" fill="none" stroke="#4a4540" strokeWidth="0.3" opacity="0.2" />
      {/* Die 1 — tiny cube shape, slightly tilted */}
      <rect x="385" y="296" width="3" height="3" rx="0.3" fill="#b0a880" opacity="0.35" transform="rotate(8 386 297)" />
      <circle cx="386" cy="297" r="0.3" fill="#2a2018" opacity="0.3" />
      <circle cx="387" cy="298" r="0.3" fill="#2a2018" opacity="0.3" />
      {/* Die 2 — next to first */}
      <rect x="390" y="295" width="3" height="3" rx="0.3" fill="#a8a078" opacity="0.32" transform="rotate(-12 391 296)" />
      <circle cx="391" cy="296" r="0.3" fill="#2a2018" opacity="0.28" />
      <circle cx="392" cy="297" r="0.3" fill="#2a2018" opacity="0.28" />
      <circle cx="391" cy="297" r="0.3" fill="#2a2018" opacity="0.28" />
      {/* Die 3 — rolled slightly away */}
      <rect x="393" y="298" width="2.5" height="2.5" rx="0.3" fill="#b5ad90" opacity="0.28" transform="rotate(22 394 299)" />
      <circle cx="394" cy="299" r="0.3" fill="#2a2018" opacity="0.25" />
      {/* Small coin wagered beside dice */}
      <circle cx="383" cy="299" r="1.2" fill="#6a5a30" opacity="0.2" />
      <circle cx="383" cy="299" r="0.6" fill="none" stroke="#7a6a40" strokeWidth="0.2" opacity="0.15" />

      {/* === RATS — scurrying near the barrel area === */}
      {/* Rat 1 — still, nose toward barrel */}
      <path d="M560 271 Q563 269 566 270 Q567 271 566 272 L560 272 Z" fill="#2a2520" opacity="0.4" />
      <line x1="560" y1="271" x2="557" y2="270" stroke="#2a2520" strokeWidth="0.4" opacity="0.3" />
      {/* Rat 2 — animated scurry near food scraps */}
      <g opacity="0.35">
        <path d="M542 276 Q545 274 548 275 Q549 276 548 277 L542 277 Z" fill="#252018">
          <animate attributeName="d" values="M542 276 Q545 274 548 275 Q549 276 548 277 L542 277 Z;M548 276 Q551 274 554 275 Q555 276 554 277 L548 277 Z;M554 274 Q557 272 560 273 Q561 274 560 275 L554 275 Z;M554 274 Q557 272 560 273 Q561 274 560 275 L554 275 Z;M548 276 Q551 274 554 275 Q555 276 554 277 L548 277 Z;M542 276 Q545 274 548 275 Q549 276 548 277 L542 277 Z" dur="8s" repeatCount="indefinite" />
        </path>
        {/* Tail */}
        <line x1="542" y1="277" x2="539" y2="276" stroke="#252018" strokeWidth="0.3">
          <animate attributeName="x1" values="542;548;554;554;548;542" dur="8s" repeatCount="indefinite" />
          <animate attributeName="x2" values="539;545;551;551;545;539" dur="8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* === WATER BUCKET — near fire 1 === */}
      {/* Bucket body */}
      <path d="M330 308 L328 318 Q332 320 338 320 Q344 320 346 318 L344 308 Z" fill="#3a3528" opacity="0.5" />
      {/* Bucket rim */}
      <ellipse cx="337" cy="308" rx="7" ry="2.5" fill="none" stroke="#4a4035" strokeWidth="0.8" opacity="0.45" />
      {/* Bucket handle */}
      <path d="M330 308 Q337 302 344 308" fill="none" stroke="#4a4035" strokeWidth="0.6" opacity="0.35" />
      {/* Ladle — resting across the bucket */}
      <line x1="329" y1="306" x2="348" y2="310" stroke="#5a5550" strokeWidth="0.8" opacity="0.4" />
      <circle cx="348" cy="310" r="2" fill="none" stroke="#5a5550" strokeWidth="0.5" opacity="0.3" />

      {/* === PLAYING CARDS — soldiers gambling on the ground === */}
      {/* Card cluster between shelter 2 and fire area */}
      <rect x="388" y="292" width="4" height="5.5" rx="0.5" fill="#b0a890" opacity="0.3" transform="rotate(-8 390 294)" />
      <rect x="393" y="291" width="4" height="5.5" rx="0.5" fill="#a8a080" opacity="0.28" transform="rotate(12 395 294)" />
      <rect x="390" y="294" width="4" height="5.5" rx="0.5" fill="#b5ad90" opacity="0.25" transform="rotate(-22 392 297)" />
      <rect x="396" y="294" width="4" height="5.5" rx="0.5" fill="#a0987a" opacity="0.22" transform="rotate(5 398 297)" />
      {/* Tiny card markings */}
      <circle cx="390" cy="294" r="0.5" fill="#3a3025" opacity="0.2" />
      <circle cx="396" cy="293" r="0.5" fill="#3a3025" opacity="0.18" />

      {/* === TORN LETTER — discarded near sleeping soldier === */}
      {/* Folded/crumpled paper shape */}
      <path d="M108 244 L116 243 L117 250 L110 251 Z" fill="#b0a880" opacity="0.2" />
      <path d="M116 243 L118 244 L119 250 L117 250 Z" fill="#a09870" opacity="0.15" />
      {/* Faint writing lines */}
      <line x1="110" y1="246" x2="115" y2="245" stroke="#5a5040" strokeWidth="0.3" opacity="0.15" />
      <line x1="110" y1="248" x2="114" y2="247" stroke="#5a5040" strokeWidth="0.3" opacity="0.12" />

      {/* Drum — beaten and worn */}
      <ellipse cx="420" cy="290" rx="8" ry="5" fill="#3a3025" opacity="0.4" />
      <rect x="412" y="286" width="16" height="8" rx="2" fill="#3a3025" opacity="0.35" />
      <line x1="412" y1="288" x2="428" y2="288" stroke="#4a4035" strokeWidth="0.5" opacity="0.2" />

      {/* === CAMPFIRE 1 — barely alive === */}
      <ellipse cx="300" cy="312" rx="22" ry="5" fill="url(#ch1_fireGlow)">
        <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Stone ring */}
      <circle cx="283" cy="312" r="3" fill="#4a4540" />
      <circle cx="290" cy="316" r="2.5" fill="#454035" />
      <circle cx="298" cy="318" r="2.8" fill="#4a4540" />
      <circle cx="306" cy="316" r="2.5" fill="#454035" />
      <circle cx="313" cy="313" r="3" fill="#4a4540" />
      <circle cx="316" cy="308" r="2.5" fill="#454035" />
      <circle cx="287" cy="308" r="2.5" fill="#4a4540" />
      {/* Charred logs */}
      <line x1="290" y1="311" x2="310" y2="313" stroke="#2a2520" strokeWidth="2" />
      <line x1="295" y1="314" x2="308" y2="310" stroke="#2a2520" strokeWidth="1.5" />
      {/* Tiny dying embers */}
      <circle cx="298" cy="310" r="1.5" fill="#c07040" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="303" cy="309" r="1" fill="#d08050" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="295" cy="312" r="0.8" fill="#b06030" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* === COOKING FIRE TRIPOD — blackened pot hung over fire 1 === */}
      {/* Three sticks forming a tripod over the fire */}
      <line x1="292" y1="318" x2="300" y2="294" stroke="#2a2018" strokeWidth="1" opacity="0.5" />
      <line x1="310" y1="318" x2="300" y2="294" stroke="#2a2018" strokeWidth="1" opacity="0.5" />
      <line x1="298" y1="308" x2="300" y2="294" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
      {/* Rope/hook hanging from apex */}
      <line x1="300" y1="294" x2="300" y2="302" stroke="#3a3530" strokeWidth="0.5" opacity="0.4" />
      {/* Blackened pot — small, dented iron pot */}
      <path d="M294 302 Q294 306 297 308 Q300 309 303 308 Q306 306 306 302 Z" fill="#1a1a1a" opacity="0.55" />
      {/* Pot rim */}
      <ellipse cx="300" cy="302" rx="6" ry="2" fill="none" stroke="#2a2a2a" strokeWidth="0.6" opacity="0.45" />
      {/* Pot handle */}
      <path d="M295 302 Q300 299 305 302" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.35" />
      {/* Thin gruel inside pot — barely visible watery surface */}
      <ellipse cx="300" cy="303" rx="5" ry="1.5" fill="#4a4535" opacity="0.2" />
      {/* Gruel surface — faint shimmer from firelight */}
      <ellipse cx="300" cy="303" rx="3" ry="1" fill="#6a5a40" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.14;0.08" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Steam wisps from pot — thin, watery gruel barely warm */}
      <path d="M298 300 Q297 296 299 292" fill="none" stroke="#6a6560" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="d" values="M298 300 Q297 296 299 292;M298 300 Q299 296 301 292;M298 300 Q297 296 299 292" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M302 300 Q303 296 301 292" fill="none" stroke="#6a6560" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="d" values="M302 300 Q303 296 301 292;M302 300 Q304 296 303 292;M302 300 Q303 296 301 292" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Third steam wisp — barely visible */}
      <path d="M300 300 Q300 294 302 288" fill="none" stroke="#6a6560" strokeWidth="0.25" opacity="0.06">
        <animate attributeName="d" values="M300 300 Q300 294 302 288;M300 300 Q301 294 304 288;M300 300 Q300 294 302 288" dur="6s" repeatCount="indefinite" />
      </path>

      {/* === CAMP DOG — curled up near fire 1 warmth === */}
      {/* Body — small, bony camp mutt */}
      <path d="M320 322 Q326 318 332 320 Q336 322 334 326 Q328 328 322 326 Q318 324 320 322 Z" fill="#2a2520" opacity="0.5" />
      {/* Head tucked in */}
      <ellipse cx="320" cy="322" rx="3" ry="2.5" fill="#2a2520" opacity="0.5" />
      {/* Ear */}
      <path d="M318 320 L316 318 L319 320" fill="#2a2520" opacity="0.4" />
      {/* Tail curled around body */}
      <path d="M334 324 Q338 322 337 326" fill="none" stroke="#2a2520" strokeWidth="0.8" opacity="0.35" />
      {/* Breathing animation — subtle rise */}
      <ellipse cx="327" cy="322" rx="5" ry="3" fill="#2a2520" opacity="0.15">
        <animate attributeName="ry" values="3;3.5;3" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === STRAY CAT — silhouette near the cooking fire warmth === */}
      {/* Cat body — sitting upright, alert, near the warmth */}
      <path d="M280 320 Q282 314 284 308 Q286 314 288 320 Q284 322 280 320 Z" fill="#1a1815" opacity="0.5" />
      {/* Cat head */}
      <ellipse cx="284" cy="306" rx="2.5" ry="2" fill="#1a1815" opacity="0.5" />
      {/* Pointed ears */}
      <path d="M282 304 L281 301 L283 303" fill="#1a1815" opacity="0.45" />
      <path d="M285 304 L287 301 L286 303" fill="#1a1815" opacity="0.45" />
      {/* Tail curled around body */}
      <path d="M288 319 Q292 316 294 318 Q292 320 290 320" fill="none" stroke="#1a1815" strokeWidth="0.8" opacity="0.4" />
      {/* Tiny eye gleam from firelight */}
      <circle cx="283" cy="306" r="0.4" fill="#c08040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Thin wispy smoke — blown sideways by coastal wind */}
      <path d="M300 306 Q298 292 303 278 Q308 262 318 248" fill="none" stroke="#6a6560" strokeWidth="0.8" opacity="0.18">
        <animate attributeName="d" values="M300 306 Q298 292 303 278 Q308 262 318 248;M300 306 Q303 292 308 278 Q316 262 326 248;M300 306 Q298 292 303 278 Q308 262 318 248" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M302 305 Q304 295 310 280 Q318 268 328 255" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M302 305 Q304 295 310 280 Q318 268 328 255;M302 305 Q306 295 314 280 Q324 268 336 255;M302 305 Q304 295 310 280 Q318 268 328 255" dur="7s" repeatCount="indefinite" />
      </path>

      {/* === WIND-BLOWN DEBRIS — leaves and scraps carried by the coastal gale === */}
      {/* Leaf 1 — tumbling across the camp */}
      <path d="M0 290 Q2 288 4 290 Q2 292 0 290 Z" fill="#5a4a30" opacity="0.15">
        <animate attributeName="d" values="M0 290 Q2 288 4 290 Q2 292 0 290 Z;M200 280 Q202 278 204 280 Q202 282 200 280 Z;M400 285 Q402 283 404 285 Q402 287 400 285 Z;M600 278 Q602 276 604 278 Q602 280 600 278 Z;M800 282 Q802 280 804 282 Q802 284 800 282 Z" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.15;0.12;0.1;0" dur="18s" repeatCount="indefinite" />
      </path>
      {/* Leaf 2 — different trajectory */}
      <path d="M100 300 Q101 299 102 300" fill="#504530" opacity="0.1">
        <animate attributeName="d" values="M100 300 Q101 299 102 300;M250 292 Q251 291 252 292;M400 296 Q401 295 402 296;M600 290 Q601 289 602 290;M800 294 Q801 293 802 294" dur="22s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.1;0.08;0.06;0" dur="22s" repeatCount="indefinite" />
      </path>
      {/* Paper scrap — blown from someone's belongings */}
      <rect x="300" y="270" width="3" height="2" fill="#8a8060" opacity="0.1" rx="0.2">
        <animate attributeName="x" values="300;380;460;540;620;700;780" dur="15s" repeatCount="indefinite" />
        <animate attributeName="y" values="270;264;272;260;268;262;270" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.1;0.08;0.06;0.04;0.02;0" dur="15s" repeatCount="indefinite" />
        <animate attributeName="transform" type="rotate" values="0 300 270;45 380 264;90 460 272;135 540 260;180 620 268;225 700 262;270 780 270" dur="15s" repeatCount="indefinite" />
      </rect>

      {/* === CAMPFIRE 2 — distant, smaller === */}
      <ellipse cx="650" cy="305" rx="15" ry="3" fill="url(#ch1_distFire)">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="650" cy="304" r="1" fill="#c07040" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* === SMOKE FROM CAMPFIRE 2 — thin wispy column === */}
      <path d="M650 302 Q648 290 652 278 Q655 268 662 258" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M650 302 Q648 290 652 278 Q655 268 662 258;M650 302 Q652 290 656 278 Q662 268 670 258;M650 302 Q648 290 652 278 Q655 268 662 258" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M651 300 Q653 292 657 282 Q662 274 668 265" fill="none" stroke="#5a5855" strokeWidth="0.3" opacity="0.06">
        <animate attributeName="d" values="M651 300 Q653 292 657 282 Q662 274 668 265;M651 300 Q655 292 660 282 Q668 274 676 265;M651 300 Q653 292 657 282 Q662 274 668 265" dur="9s" repeatCount="indefinite" />
      </path>

      {/* === SOLDIER SILHOUETTES === */}
      {/* Soldier 1 — sitting, hugging knees at fire 1, shivering */}
      <path d="M268 296 Q266 280 270 270 Q273 264 276 270 Q280 280 278 296 L280 300 Q275 304 270 300 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="273" cy="262" r="4.5" fill="#1a1815" opacity="0.8" />

      {/* Soldier 2 — sitting cross-legged at fire 1, head bowed */}
      <path d="M318 296 Q316 282 320 272 Q323 266 326 272 Q330 282 328 296 Q326 302 323 304 Q320 302 318 296 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="323" cy="264" r="4" fill="#1a1815" opacity="0.8" />

      {/* Soldier 3 — lying down near tent 1, exhausted */}
      <path d="M235 308 Q242 305 262 307 Q268 310 262 313 Q242 316 235 313 Q231 310 235 308 Z"
        fill="#1a1815" opacity="0.55" />
      <circle cx="232" cy="308" r="3.5" fill="#1a1815" opacity="0.5" />

      {/* Soldier 4 — standing alone, looking at sea, arms crossed */}
      <path d="M490 252 Q488 242 490 232 Q492 226 494 232 L496 252 L500 290 L497 293 L493 293 L490 290 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="492" cy="224" r="5" fill="#1a1815" opacity="0.7" />
      {/* Arms crossed — cold */}
      <path d="M487 248 Q485 245 486 242" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />
      <path d="M497 248 Q499 245 498 242" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />

      {/* Soldier 5 — hunched near shelter 2, eating from bowl */}
      <path d="M445 288 Q443 278 446 272 Q449 267 452 272 Q455 278 453 288 Z"
        fill="#1a1815" opacity="0.65" />
      <circle cx="449" cy="265" r="4" fill="#1a1815" opacity="0.65" />
      {/* Bowl in hands */}
      <ellipse cx="452" cy="278" rx="3" ry="1.5" fill="#2a2520" opacity="0.3" />

      {/* Soldier 6 — at distant fire 2, barely visible */}
      <path d="M640 298 Q638 290 640 285 Q642 290 644 298 Z" fill="#1a1815" opacity="0.5" />
      <circle cx="641" cy="283" r="3" fill="#1a1815" opacity="0.5" />
      <path d="M660 296 Q658 288 660 283 Q662 288 664 296 Z" fill="#1a1815" opacity="0.45" />
      <circle cx="661" cy="281" r="3" fill="#1a1815" opacity="0.45" />

      {/* Soldier 7 — on the ground near olive tree, sleeping/sick, visibly thin */}
      <path d="M95 240 Q105 237 118 240 Q122 243 116 245 Q105 247 95 245 Q91 243 95 240 Z"
        fill="#1a1815" opacity="0.45" />
      <circle cx="92" cy="240" r="3" fill="#1a1815" opacity="0.4" />
      {/* Visible ribs — emaciated, shirt pulled up from tossing */}
      <path d="M100 241 Q102 240 104 241" fill="none" stroke="#2a2520" strokeWidth="0.3" opacity="0.15" />
      <path d="M101 242 Q103 241 105 242" fill="none" stroke="#2a2520" strokeWidth="0.3" opacity="0.12" />
      <path d="M102 243 Q104 242 106 243" fill="none" stroke="#2a2520" strokeWidth="0.3" opacity="0.1" />

      {/* Soldier 8 — sitting against rock, bandaged leg */}
      <path d="M510 272 Q508 264 510 258 Q512 264 514 272 Z" fill="#1a1815" opacity="0.6" />
      <circle cx="511" cy="256" r="3.5" fill="#1a1815" opacity="0.6" />
      {/* Bandaged leg stretched out */}
      <path d="M508 270 Q512 274 518 278 Q522 280 526 280" fill="none" stroke="#4a4545" strokeWidth="1.2" opacity="0.3" />

      {/* === MORE SLEEPING SOLDIERS — exhaustion everywhere === */}
      {/* Sleeping soldier 9 — curled on ground near shelter 2 */}
      <path d="M355 290 Q362 286 372 288 Q378 291 372 294 Q362 296 355 294 Q351 292 355 290 Z"
        fill="#1a1815" opacity="0.45" />
      <circle cx="353" cy="290" r="3" fill="#1a1815" opacity="0.4" />
      {/* Thin blanket over him */}
      <path d="M357 289 Q364 286 374 288 Q379 291 373 293" fill="#3a3530" opacity="0.2" />

      {/* Sleeping soldier 10 — sprawled near path, face down */}
      <path d="M560 298 Q568 295 578 297 Q582 300 576 303 Q568 305 560 302 Q556 300 560 298 Z"
        fill="#1a1815" opacity="0.4" />
      <circle cx="558" cy="299" r="2.8" fill="#1a1815" opacity="0.35" />
      {/* Arm stretched out */}
      <path d="M576 300 Q580 298 584 300" fill="none" stroke="#1a1815" strokeWidth="1" opacity="0.25" />

      {/* Sleeping soldier 11 — propped against broken cart wheel */}
      <path d="M540 280 Q538 274 540 268 Q542 274 544 280 Z" fill="#1a1815" opacity="0.45" />
      <circle cx="541" cy="266" r="3" fill="#1a1815" opacity="0.4" />
      {/* Head lolled to one side */}
      <path d="M540 268 Q537 266 536 268" fill="none" stroke="#1a1815" strokeWidth="1" opacity="0.3" />

      {/* === SOLDIER MENDING SHOE — sitting cross-legged, hunched over his work === */}
      {/* Body — seated, leaning forward over the shoe */}
      <path d="M168 308 Q166 296 168 288 Q170 284 173 288 Q176 296 174 308 Q173 312 170 314 Q168 312 168 308 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="171" cy="282" r="4" fill="#1a1815" opacity="0.7" />
      {/* Crossed legs visible */}
      <path d="M166 308 Q162 312 158 314 Q164 316 168 312" fill="#1a1815" opacity="0.45" />
      <path d="M176 308 Q180 312 184 314 Q178 316 174 312" fill="#1a1815" opacity="0.45" />
      {/* Arms reaching down to shoe in lap */}
      <path d="M168 292 Q164 298 162 304" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.5" />
      <path d="M175 292 Q178 298 180 304" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.5" />
      {/* The shoe he's working on — in his lap */}
      <path d="M163 304 Q168 300 174 303 L176 306 L162 307 Z" fill="#3a3025" opacity="0.5" />
      {/* Awl/needle — tiny gleam, animated working motion */}
      <line x1="170" y1="302" x2="172" y2="298" stroke="#7a7a80" strokeWidth="0.4" opacity="0.3">
        <animate attributeName="y2" values="298;296;298" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Thread trailing */}
      <path d="M170 302 Q168 300 165 302" fill="none" stroke="#5a5545" strokeWidth="0.3" opacity="0.2" />

      {/* === SOLDIER SHARPENING BAYONET — sitting on rock, rhythmic scraping === */}
      {/* Rock he's sitting on */}
      <path d="M635 298 Q642 292 652 294 Q658 298 654 302 Q644 304 638 302 Z" fill="#3a3530" opacity="0.45" />
      {/* Body — sitting upright on rock */}
      <path d="M643 296 Q641 284 643 276 Q645 272 647 276 Q650 284 648 296 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="645" cy="270" r="4" fill="#1a1815" opacity="0.7" />
      {/* Left arm holding bayonet steady */}
      <path d="M641 280 Q636 286 632 290" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.5" />
      {/* Right arm with whetstone — animated scraping motion */}
      <path d="M649 280 Q652 286 656 288" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M649 280 Q652 286 656 288;M649 280 Q653 285 657 286;M649 280 Q652 286 656 288" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* Bayonet — held out, catching dim light */}
      <line x1="632" y1="290" x2="622" y2="286" stroke="#6a6a70" strokeWidth="0.8" opacity="0.35" />
      <line x1="622" y1="286" x2="620" y2="285" stroke="#7a7a80" strokeWidth="0.5" opacity="0.2" />
      {/* Whetstone — small flat shape */}
      <rect x="654" y="286" width="5" height="2" rx="0.5" fill="#5a5550" opacity="0.3" transform="rotate(15 656 287)">
        <animate attributeName="x" values="654;652;654" dur="1.2s" repeatCount="indefinite" />
      </rect>
      {/* Sparks — tiny, intermittent */}
      <circle cx="630" cy="287" r="0.3" fill="#c0a060" opacity="0.0">
        <animate attributeName="opacity" values="0;0;0.3;0;0;0;0.2;0" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="628" cy="286" r="0.3" fill="#c0a060" opacity="0.0">
        <animate attributeName="opacity" values="0;0;0;0.25;0;0;0;0.15" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* === SOLDIER WRAPPING RAGS AROUND BARE FEET — no shoes left === */}
      {/* Body — seated on the ground, hunched over his feet */}
      <path d="M208 328 Q206 316 208 308 Q210 304 212 308 Q215 316 213 328 Q212 332 210 334 Q208 332 208 328 Z"
        fill="#1a1815" opacity="0.65" />
      <circle cx="210" cy="302" r="4" fill="#1a1815" opacity="0.65" />
      {/* Legs stretched forward — bare ankles exposed */}
      <path d="M207 328 Q204 334 200 338" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45" />
      <path d="M215 328 Q218 334 222 338" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45" />
      {/* Bare feet — pale, blistered, exposed */}
      <path d="M198 338 Q196 336 194 338 L192 342 L200 342 Z" fill="#4a4035" opacity="0.35" />
      {/* Rag strip being wound around foot — dirty grey cloth */}
      <path d="M220 338 Q222 336 224 338 L226 342 L218 342 Z" fill="#4a4035" opacity="0.35" />
      <path d="M220 340 Q222 338 224 340 Q226 342 228 340" fill="none" stroke="#5a5550" strokeWidth="0.6" opacity="0.3" />
      <path d="M218 341 Q220 339 222 341" fill="none" stroke="#5a5550" strokeWidth="0.5" opacity="0.25" />
      {/* Arms reaching down — winding the rag */}
      <path d="M208 312 Q204 320 200 330" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45" />
      <path d="M214 312 Q218 320 222 330" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45">
        <animate attributeName="d" values="M214 312 Q218 320 222 330;M214 312 Q219 320 224 330;M214 312 Q218 320 222 330" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Discarded worn-through shoe sole beside him */}
      <path d="M230 338 L240 337 L241 340 L231 341 Z" fill="#2a2018" opacity="0.35" />

      {/* === SOLDIER PRAYING — kneeling, head bowed, hands clasped === */}
      {/* Body — kneeling upright near the graves */}
      <path d="M710 268 Q708 258 710 250 Q712 246 714 250 Q717 258 715 268 Z"
        fill="#1a1815" opacity="0.55" />
      <circle cx="712" cy="244" r="3.5" fill="#1a1815" opacity="0.55" />
      {/* Kneeling legs — knees on ground */}
      <path d="M708 268 Q706 272 706 276" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />
      <path d="M716 268 Q718 272 718 276" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />
      {/* Clasped hands raised — praying posture */}
      <path d="M710 252 Q708 248 710 244" fill="none" stroke="#1a1815" strokeWidth="1.2" opacity="0.4" />
      <path d="M714 252 Q716 248 714 244" fill="none" stroke="#1a1815" strokeWidth="1.2" opacity="0.4" />
      {/* Head bowed — facing the graves */}
      <path d="M712 246 Q710 248 710 250" fill="none" stroke="#1a1815" strokeWidth="0.8" opacity="0.3" />

      {/* === SOLDIER DRAWING IN DIRT — scratching with a stick, bored/homesick === */}
      {/* Body — sitting on ground, leaning forward with stick */}
      <path d="M470 316 Q468 304 470 296 Q472 292 474 296 Q477 304 475 316 Q474 320 472 322 Q470 320 470 316 Z"
        fill="#1a1815" opacity="0.65" />
      <circle cx="472" cy="290" r="4" fill="#1a1815" opacity="0.65" />
      {/* Right arm extended — holding stick, scratching in dirt */}
      <path d="M475 300 Q480 308 486 316" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.45" />
      {/* The stick */}
      <line x1="486" y1="316" x2="492" y2="322" stroke="#5a5045" strokeWidth="0.8" opacity="0.4" />
      {/* Scratched marks in the dirt — crude drawing, maybe a house or a face */}
      <path d="M488 320 L492 316 L496 320" fill="none" stroke="#4a4540" strokeWidth="0.4" opacity="0.2" />
      <line x1="492" y1="320" x2="492" y2="324" stroke="#4a4540" strokeWidth="0.4" opacity="0.18" />
      <path d="M490 322 L494 322" fill="none" stroke="#4a4540" strokeWidth="0.3" opacity="0.15" />
      {/* A scratched circle — sun or face */}
      <circle cx="498" cy="320" r="2" fill="none" stroke="#4a4540" strokeWidth="0.3" opacity="0.15" />
      {/* Left arm resting on knee */}
      <path d="M469 300 Q466 306 464 310" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.4" />

      {/* === SCRATCHED WALL — revolutionary graffiti on rock face === */}
      {/* Large flat rock with soldier carvings — boredom and defiance */}
      <path d="M450 332 Q460 326 474 329 Q480 333 472 337 Q462 340 452 336 Z" fill="#3a3530" opacity="0.45" />
      {/* Crude scratched text — anger at the Directory */}
      <text x="454" y="334" fontFamily="serif" fontSize="2.8" fill="#5a5550" opacity="0.2"
        letterSpacing="0.3" transform="rotate(2 462 334)">PAIN OU MORT</text>
      {/* Scratch marks — soldiers carving with bayonet points */}
      <line x1="454" y1="335" x2="470" y2="334" stroke="#4a4540" strokeWidth="0.15" opacity="0.15" />
      {/* Tally marks — counting days without pay */}
      <g opacity="0.15">
        <line x1="456" y1="328" x2="456" y2="330" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="457" y1="328" x2="457" y2="330" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="458" y1="328" x2="458" y2="330" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="459" y1="328" x2="459" y2="330" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="455.5" y1="329" x2="459.5" y2="329" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="461" y1="328" x2="461" y2="330" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="462" y1="328" x2="462" y2="330" stroke="#5a5550" strokeWidth="0.3" />
        <line x1="463" y1="328" x2="463" y2="330" stroke="#5a5550" strokeWidth="0.3" />
      </g>

      {/* === ADDITIONAL PUDDLES — the camp is waterlogged from drizzle === */}
      {/* Large puddle — reflecting the grey sky */}
      <ellipse cx="600" cy="320" rx="12" ry="3.5" fill="#3a4555" opacity="0.15" />
      <ellipse cx="600" cy="319" rx="8" ry="2" fill="url(#ch1_puddleShimmer)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Rain ripples on puddle surface */}
      <circle cx="598" cy="319" r="1.5" fill="none" stroke="#5a5a65" strokeWidth="0.2" opacity="0.06">
        <animate attributeName="r" values="0.5;2.5;0.5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0;0.1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="603" cy="320" r="1" fill="none" stroke="#5a5a65" strokeWidth="0.2" opacity="0.05">
        <animate attributeName="r" values="0.3;2;0.3" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0;0.08" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Muddy bootprint trail through puddle */}
      <path d="M592 322 L594 320 L596 322" fill="#2a2518" opacity="0.06" />
      <path d="M604 318 L606 316 L608 318" fill="#2a2518" opacity="0.05" />

      {/* === SCAVENGING CROWS — picking at scraps, ominous presence === */}
      {/* Crow 1 — on the ground near horse bones, pecking */}
      <g opacity="0.45">
        <path d="M118 328 Q122 324 126 326 Q128 328 126 330 L120 330 Z" fill="#1a1815" />
        <circle cx="120" cy="326" r="1.5" fill="#1a1815" />
        {/* Beak */}
        <path d="M118 326 L116 325 L118 324" fill="#3a3025" />
        {/* Eye */}
        <circle cx="119" cy="325.5" r="0.4" fill="#3a3530" />
        {/* Pecking animation */}
        <animateTransform attributeName="transform" type="rotate" values="0 120 328;-8 120 328;0 120 328;0 120 328;0 120 328" dur="4s" repeatCount="indefinite" />
      </g>
      {/* Crow 2 — perched on broken crate, watchful */}
      <g opacity="0.4">
        <path d="M175 322 Q178 318 182 320 Q184 322 182 324 L176 324 Z" fill="#1a1815" />
        <circle cx="177" cy="320" r="1.5" fill="#1a1815" />
        <path d="M175 320 L173 319" fill="none" stroke="#3a3025" strokeWidth="0.5" />
        {/* Tail feathers */}
        <path d="M182 322 Q186 320 188 322" fill="none" stroke="#1a1815" strokeWidth="0.6" />
      </g>

      {/* === ADDITIONAL GROUND DETAILS — worn camp life === */}
      {/* Ash circle — cold fire pit, abandoned, filled with grey ash */}
      <ellipse cx="180" cy="340" rx="8" ry="3" fill="#3a3a38" opacity="0.15" />
      <ellipse cx="180" cy="340" rx="5" ry="2" fill="#454540" opacity="0.1" />
      {/* Charred stick ends poking from ash */}
      <line x1="176" y1="340" x2="174" y2="336" stroke="#2a2520" strokeWidth="0.5" opacity="0.15" />
      <line x1="184" y1="340" x2="186" y2="337" stroke="#2a2520" strokeWidth="0.5" opacity="0.12" />
      {/* Soldier shadow — long evening shadows stretching from firelight */}
      <ellipse cx="280" cy="310" rx="20" ry="3" fill="#1a1510" opacity="0.06" transform="rotate(-15 280 310)" />
      <ellipse cx="330" cy="314" rx="18" ry="2.5" fill="#1a1510" opacity="0.05" transform="rotate(10 330 314)" />
      {/* Kicked-over tin cup — near sleeping soldier */}
      <ellipse cx="248" cy="310" rx="2" ry="1.2" fill="#4a4a48" opacity="0.2" />
      <path d="M246 310 L245 314 Q248 316 251 314 L250 310" fill="#4a4a48" opacity="0.15" />
      {/* Breadcrumb trail — scattered crumbs near eating soldier */}
      <circle cx="452" cy="282" r="0.4" fill="#5a5035" opacity="0.12" />
      <circle cx="456" cy="284" r="0.3" fill="#5a5035" opacity="0.1" />
      <circle cx="449" cy="286" r="0.35" fill="#5a5035" opacity="0.08" />
      {/* Empty wine bottle — dark glass, lying on its side */}
      <path d="M380 324 Q382 322 384 324 L396 323 Q398 322 398 324 Q398 326 396 326 L384 327 Q382 328 380 326 Z" fill="#1a2018" opacity="0.3" />
      <ellipse cx="380" cy="325" rx="2" ry="1.5" fill="#1a2018" opacity="0.25" />
      {/* Bottle neck */}
      <path d="M398 323 L404 323 L404 325 L398 325" fill="#1a2018" opacity="0.25" />
      {/* Glint on glass */}
      <line x1="390" y1="323" x2="392" y2="323" stroke="#4a5060" strokeWidth="0.3" opacity="0.1" />

      {/* === FOREGROUND === */}
      {/* Rocky foreground — closer, darker */}
      <path d="M0 355 Q15 345 35 350 Q55 346 80 352 Q100 344 130 350 Q160 348 190 354 Q210 350 230 355 L230 400 L0 400 Z"
        fill="#222018" />
      <path d="M580 358 Q610 348 640 352 Q670 346 700 350 Q730 344 760 352 Q780 350 800 354 L800 400 L580 400 Z"
        fill="#201a15" />

      {/* Foreground rock detail */}
      <path d="M40 350 Q50 345 60 348" fill="#2a2520" opacity="0.5" />
      <path d="M650 350 Q665 344 680 348" fill="#252018" opacity="0.5" />

      {/* Additional coastal rocks — more foreground detail */}
      <path d="M15 360 Q22 354 30 357 Q36 354 42 360" fill="#282218" opacity="0.55" />
      <path d="M90 352 Q98 346 108 350 Q114 347 120 353" fill="#252018" opacity="0.45" />
      <path d="M170 355 Q178 350 186 352" fill="#2a2520" opacity="0.4" />
      {/* Right-side coastal rocks */}
      <path d="M600 360 Q612 352 624 356 Q632 352 640 358" fill="#222018" opacity="0.5" />
      <path d="M700 352 Q710 346 722 350 Q730 347 738 353" fill="#252018" opacity="0.45" />
      <path d="M760 356 Q770 350 782 354" fill="#201a15" opacity="0.4" />

      {/* === SEASHELLS — tiny scattered Mediterranean shells on foreground rocks === */}
      {/* Spiral shell — left rocks */}
      <path d="M48 354 Q50 352 52 354 Q50 356 48 354" fill="#6a6560" opacity="0.15" />
      <path d="M49 354 Q50 353 51 354" fill="none" stroke="#7a7570" strokeWidth="0.2" opacity="0.12" />
      {/* Bivalve shell — open */}
      <path d="M105 351 Q108 349 111 351 Q108 352 105 351" fill="#7a7060" opacity="0.12" />
      {/* Tiny limpet shells */}
      <ellipse cx="72" cy="356" rx="1.2" ry="0.6" fill="#6a6055" opacity="0.14" />
      <ellipse cx="160" cy="354" rx="1" ry="0.5" fill="#706558" opacity="0.12" />
      <ellipse cx="185" cy="356" rx="0.8" ry="0.4" fill="#6a6055" opacity="0.1" />
      {/* Right-side shells */}
      <path d="M618 356 Q620 354 622 356 Q620 358 618 356" fill="#6a6560" opacity="0.12" />
      <ellipse cx="660" cy="352" rx="1" ry="0.5" fill="#706558" opacity="0.12" />
      <path d="M710 351 Q713 349 716 351 Q713 352 710 351" fill="#7a7060" opacity="0.1" />
      <ellipse cx="740" cy="354" rx="1.2" ry="0.6" fill="#6a6055" opacity="0.11" />
      {/* Scattered small shell fragments */}
      <circle cx="35" cy="358" r="0.6" fill="#706558" opacity="0.1" />
      <circle cx="125" cy="352" r="0.5" fill="#6a6055" opacity="0.1" />
      <circle cx="690" cy="354" r="0.5" fill="#706558" opacity="0.09" />

      {/* Sea spray dots — white specks against the rocks */}
      <circle cx="20" cy="358" r="0.6" fill="#8a8a90" opacity="0.12" />
      <circle cx="35" cy="356" r="0.4" fill="#9a9a9a" opacity="0.1" />
      <circle cx="100" cy="350" r="0.5" fill="#8a8a90" opacity="0.1" />
      <circle cx="610" cy="356" r="0.5" fill="#8a8a90" opacity="0.12" />
      <circle cx="625" cy="354" r="0.4" fill="#9a9a9a" opacity="0.08" />
      <circle cx="715" cy="350" r="0.6" fill="#8a8a90" opacity="0.1" />
      <circle cx="770" cy="354" r="0.4" fill="#9a9a9a" opacity="0.08" />
      {/* Animated spray — intermittent splash */}
      <circle cx="45" cy="354" r="0.5" fill="#aaaaaa" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.18;0.08;0.04;0.08" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="630" cy="352" r="0.5" fill="#aaaaaa" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.15;0.06;0.03;0.06" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Foreground scrub */}
      <path d="M20 358 Q22 350 25 355 Q28 348 30 358" fill="none" stroke="#2a3520" strokeWidth="0.8" opacity="0.25" />
      <path d="M750 355 Q752 347 755 352 Q758 345 760 355" fill="none" stroke="#2a3520" strokeWidth="0.8" opacity="0.25" />

      {/* === COLD BREATH VAPOR — visible exhalations in the chill === */}
      {/* Breath from soldier 1 (sitting at fire, hugging knees) */}
      <ellipse cx="277" cy="260" rx="3" ry="1.5" fill="url(#ch1_breath)" opacity="0.6">
        <animate attributeName="rx" values="3;5;3" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="277;282;277" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Breath from soldier 2 (head bowed at fire) */}
      <ellipse cx="327" cy="262" rx="2.5" ry="1.2" fill="url(#ch1_breath)" opacity="0.5">
        <animate attributeName="rx" values="2.5;4.5;2.5" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.15;0.5" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="327;333;327" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Breath from soldier 4 (standing, looking at sea) */}
      <ellipse cx="496" cy="222" rx="2" ry="1" fill="url(#ch1_breath)" opacity="0.4">
        <animate attributeName="rx" values="2;4;2" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="496;502;496" dur="6s" repeatCount="indefinite" />
      </ellipse>
      {/* Breath from sentry on rock */}
      <ellipse cx="764" cy="190" rx="2" ry="1" fill="url(#ch1_breath)" opacity="0.35">
        <animate attributeName="rx" values="2;3.5;2" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="764;769;764" dur="5.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === DRIZZLE RAIN — light diagonal streaks falling across the scene === */}
      {/* Drizzle band 1 — left side, faint diagonal lines */}
      <g opacity="0.04">
        <line x1="50" y1="180" x2="42" y2="240" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="80" y1="170" x2="72" y2="230" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="110" y1="185" x2="102" y2="245" stroke="#7a7a85" strokeWidth="0.25" />
        <line x1="140" y1="175" x2="132" y2="235" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="170" y1="190" x2="162" y2="250" stroke="#7a7a85" strokeWidth="0.25" />
        <line x1="200" y1="180" x2="192" y2="240" stroke="#7a7a85" strokeWidth="0.3" />
      </g>
      {/* Drizzle band 2 — center, intermittent */}
      <g opacity="0.035">
        <line x1="280" y1="170" x2="272" y2="230" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="320" y1="185" x2="312" y2="245" stroke="#7a7a85" strokeWidth="0.25" />
        <line x1="360" y1="175" x2="352" y2="235" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="400" y1="180" x2="392" y2="240" stroke="#7a7a85" strokeWidth="0.25" />
        <line x1="440" y1="190" x2="432" y2="250" stroke="#7a7a85" strokeWidth="0.3" />
      </g>
      {/* Drizzle band 3 — right side */}
      <g opacity="0.03">
        <line x1="520" y1="175" x2="512" y2="235" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="560" y1="185" x2="552" y2="245" stroke="#7a7a85" strokeWidth="0.25" />
        <line x1="600" y1="170" x2="592" y2="230" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="640" y1="180" x2="632" y2="240" stroke="#7a7a85" strokeWidth="0.25" />
        <line x1="680" y1="190" x2="672" y2="250" stroke="#7a7a85" strokeWidth="0.3" />
        <line x1="720" y1="175" x2="712" y2="235" stroke="#7a7a85" strokeWidth="0.25" />
      </g>
      {/* Animated drizzle — slow diagonal drift suggesting persistent light rain */}
      <g opacity="0.03">
        <line x1="250" y1="200" x2="244" y2="250" stroke="#8a8a90" strokeWidth="0.3">
          <animate attributeName="y1" values="200;140;200" dur="12s" repeatCount="indefinite" />
          <animate attributeName="y2" values="250;190;250" dur="12s" repeatCount="indefinite" />
        </line>
        <line x1="500" y1="190" x2="494" y2="240" stroke="#8a8a90" strokeWidth="0.3">
          <animate attributeName="y1" values="190;130;190" dur="14s" repeatCount="indefinite" />
          <animate attributeName="y2" values="240;180;240" dur="14s" repeatCount="indefinite" />
        </line>
        <line x1="700" y1="195" x2="694" y2="245" stroke="#8a8a90" strokeWidth="0.25">
          <animate attributeName="y1" values="195;135;195" dur="11s" repeatCount="indefinite" />
          <animate attributeName="y2" values="245;185;245" dur="11s" repeatCount="indefinite" />
        </line>
      </g>

      {/* === EMPTY PROVISION CRATES — smashed open, nothing inside === */}
      {/* Crate 1 — broken open, lid askew */}
      <g opacity="0.4">
        <path d="M155 328 L170 326 L170 340 L155 342 Z" fill="#3a3025" />
        <path d="M170 326 L178 328 L178 342 L170 340 Z" fill="#302518" />
        {/* Lid — partly open, leaning against */}
        <path d="M153 328 L171 326 L173 322 L155 324 Z" fill="#3a3028" opacity="0.8" />
        {/* Cross-brace on crate side */}
        <line x1="157" y1="330" x2="168" y2="338" stroke="#2a2018" strokeWidth="0.4" opacity="0.3" />
        <line x1="168" y1="330" x2="157" y2="338" stroke="#2a2018" strokeWidth="0.4" opacity="0.3" />
        {/* Interior — conspicuously empty */}
        <rect x="156" y="329" width="13" height="3" fill="#1a1510" opacity="0.3" />
      </g>
      {/* Crate 2 — smashed, just planks now */}
      <g opacity="0.3">
        <path d="M182 334 L196 332 L197 340 L183 342 Z" fill="#302518" />
        {/* Broken plank sticking up */}
        <line x1="188" y1="334" x2="190" y2="326" stroke="#3a3025" strokeWidth="1" />
        <line x1="192" y1="333" x2="193" y2="328" stroke="#3a3025" strokeWidth="0.8" />
        {/* Straw packing spilling out — but no food */}
        <line x1="184" y1="340" x2="180" y2="342" stroke="#5a5535" strokeWidth="0.4" />
        <line x1="186" y1="341" x2="183" y2="344" stroke="#5a5535" strokeWidth="0.3" />
        <line x1="194" y1="339" x2="198" y2="342" stroke="#5a5535" strokeWidth="0.4" />
      </g>

      {/* === HUDDLING SOLDIERS — two men sharing a threadbare blanket for warmth === */}
      {/* Soldier pair — pressed together, blanket around shoulders */}
      <g opacity="0.6">
        {/* Left soldier — leaning into his companion */}
        <path d="M395 324 Q393 314 395 306 Q397 302 399 306 Q402 314 400 324 Z"
          fill="#1a1815" />
        <circle cx="397" cy="300" r="3.5" fill="#1a1815" />
        {/* Right soldier — leaning the other way */}
        <path d="M406 324 Q404 314 406 306 Q408 302 410 306 Q413 314 411 324 Z"
          fill="#1a1815" />
        <circle cx="408" cy="300" r="3.5" fill="#1a1815" />
        {/* Thin blanket draped over both — threadbare grey wool */}
        <path d="M390 304 Q397 300 405 300 Q412 300 418 304 Q416 316 412 326 Q405 324 397 324 Q390 326 388 316 Z"
          fill="#3a3838" opacity="0.3" />
        {/* Blanket holes — worn through */}
        <ellipse cx="400" cy="310" rx="1.5" ry="1" fill="#1a1815" opacity="0.15" />
        <ellipse cx="410" cy="314" rx="1" ry="0.8" fill="#1a1815" opacity="0.12" />
      </g>

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Coastal mist band */}
      <rect x="0" y="218" width="800" height="25" fill="url(#ch1_mist)" />
      {/* Subtle upper mist */}
      <rect x="0" y="170" width="800" height="15" fill="url(#ch1_coastMist)" />
      {/* Sea haze — horizontal atmospheric band hovering over the water */}
      <rect x="0" y="178" width="800" height="20" fill="url(#ch1_seaHaze)" />
      {/* Wind-blown ground mist */}
      <ellipse cx="350" cy="320" rx="100" ry="8" fill="#4a4a55" opacity="0.04">
        <animate attributeName="cx" values="350;380;350" dur="15s" repeatCount="indefinite" />
      </ellipse>
      {/* Second ground mist patch — near shore, drifting from sea */}
      <ellipse cx="150" cy="260" rx="80" ry="6" fill="#4a4a55" opacity="0.03">
        <animate attributeName="cx" values="150;175;150" dur="18s" repeatCount="indefinite" />
      </ellipse>
      {/* Thin mist tendrils creeping from the sea across rocks */}
      <path d="M0 240 Q50 236 100 242 Q150 238 200 244" fill="none" stroke="#5a5a65" strokeWidth="3" opacity="0.025">
        <animate attributeName="d" values="M0 240 Q50 236 100 242 Q150 238 200 244;M0 238 Q50 234 100 240 Q150 236 200 242;M0 240 Q50 236 100 242 Q150 238 200 244" dur="12s" repeatCount="indefinite" />
      </path>
      <path d="M580 238 Q630 234 680 240 Q730 236 780 242" fill="none" stroke="#5a5a65" strokeWidth="2.5" opacity="0.02">
        <animate attributeName="d" values="M580 238 Q630 234 680 240 Q730 236 780 242;M580 236 Q630 232 680 238 Q730 234 780 240;M580 238 Q630 234 680 240 Q730 236 780 242" dur="14s" repeatCount="indefinite" />
      </path>
      {/* Dust motes — tiny particles caught in the fading light, visible near fires */}
      <circle cx="295" cy="280" r="0.4" fill="#8a7a60" opacity="0.0">
        <animate attributeName="opacity" values="0;0.08;0.12;0.06;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="280;272;264" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="305" cy="285" r="0.3" fill="#8a7a60" opacity="0.0">
        <animate attributeName="opacity" values="0;0.06;0.1;0.04;0" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="285;276;268" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="648" cy="295" r="0.3" fill="#8a7a60" opacity="0.0">
        <animate attributeName="opacity" values="0;0.05;0.08;0.03;0" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="295;287;280" dur="5.5s" repeatCount="indefinite" />
      </circle>
      {/* Cold wind streaks — barely-visible diagonal lines suggesting wind */}
      <line x1="100" y1="250" x2="140" y2="248" stroke="#5a5560" strokeWidth="0.3" opacity="0.03" />
      <line x1="300" y1="260" x2="345" y2="257" stroke="#5a5560" strokeWidth="0.3" opacity="0.025" />
      <line x1="500" y1="245" x2="545" y2="242" stroke="#5a5560" strokeWidth="0.3" opacity="0.025" />
      <line x1="650" y1="255" x2="695" y2="252" stroke="#5a5560" strokeWidth="0.3" opacity="0.03" />
      {/* Fire light haze — warm glow in the air above campfire 1 */}
      <ellipse cx="300" cy="290" rx="30" ry="15" fill="#a06030" opacity="0.02">
        <animate attributeName="opacity" values="0.02;0.035;0.02" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire rim-light on nearby objects — warm edge highlights */}
      {/* Rim-light on shelter 1 facing fire */}
      <path d="M175 260 L210 285" fill="none" stroke="#6a4a28" strokeWidth="0.5" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="2.5s" repeatCount="indefinite" />
      </path>
      {/* Rim-light on soldier 1 */}
      <path d="M275 270 Q278 280 280 296" fill="none" stroke="#6a4a28" strokeWidth="0.6" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.025;0.05" dur="2s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL VEGETATION DETAIL === */}
      {/* Dead weed stalks — brown and brittle, scattered across camp ground */}
      <line x1="246" y1="268" x2="248" y2="256" stroke="#5a5035" strokeWidth="0.3" opacity="0.18" />
      <line x1="248" y1="256" x2="250" y2="254" stroke="#5a5035" strokeWidth="0.25" opacity="0.14" />
      <line x1="415" y1="262" x2="416" y2="252" stroke="#5a5035" strokeWidth="0.3" opacity="0.16" />
      <line x1="555" y1="258" x2="556" y2="248" stroke="#5a5035" strokeWidth="0.3" opacity="0.15" />
      {/* Moss on rock surfaces — dark green-brown patches */}
      <ellipse cx="135" cy="293" rx="3" ry="1" fill="#283020" opacity="0.15" />
      <ellipse cx="640" cy="296" rx="2.5" ry="0.8" fill="#283020" opacity="0.12" />
      <ellipse cx="505" cy="230" rx="2" ry="0.6" fill="#283020" opacity="0.1" />
      {/* Dead leaf litter — scattered brown and curled */}
      <path d="M340 302 Q342 300 344 302 Q342 304 340 302 Z" fill="#5a4a30" opacity="0.12" />
      <path d="M460 304 Q462 302 464 304 Q462 306 460 304 Z" fill="#5a4a30" opacity="0.1" />
      <path d="M230 292 Q232 290 234 292 Q232 294 230 292 Z" fill="#504530" opacity="0.1" />
      <path d="M540 290 Q541 288 543 290 Q541 292 540 290 Z" fill="#5a4a30" opacity="0.08" />
      {/* Dried seaweed — washed up, brown and brittle */}
      <path d="M180 236 Q185 234 190 236 Q195 234 200 237" fill="none" stroke="#3a3020" strokeWidth="0.8" opacity="0.15" />
      <path d="M610 232 Q615 230 620 232 Q625 230 628 233" fill="none" stroke="#3a3020" strokeWidth="0.7" opacity="0.12" />
      {/* Scrubby rosemary-like bush — Mediterranean aromatic, near olive tree */}
      <g opacity="0.2">
        <path d="M100 236 Q102 230 105 233" fill="none" stroke="#2a3520" strokeWidth="0.5" />
        <path d="M102 236 Q104 232 107 234" fill="none" stroke="#283018" strokeWidth="0.4" />
        <path d="M104 236 Q105 231 108 233" fill="none" stroke="#2a3520" strokeWidth="0.4" />
        <ellipse cx="104" cy="232" rx="4" ry="2" fill="#2a3520" opacity="0.3" />
      </g>
      {/* Wild thyme patch — low, spreading, on rocky ground */}
      <g opacity="0.18">
        <ellipse cx="460" cy="240" rx="5" ry="1.5" fill="#2a3520" />
        <ellipse cx="464" cy="241" rx="4" ry="1.2" fill="#283018" />
        <ellipse cx="457" cy="241" rx="3" ry="1" fill="#2a3520" />
      </g>
      {/* Dried flower heads — Mediterranean wildflowers, long dead */}
      <line x1="355" y1="248" x2="356" y2="238" stroke="#5a5035" strokeWidth="0.3" opacity="0.15" />
      <circle cx="356" cy="237" r="1" fill="#6a5a3a" opacity="0.12" />
      <line x1="358" y1="248" x2="359" y2="240" stroke="#5a5035" strokeWidth="0.25" opacity="0.12" />
      <circle cx="359" cy="239" r="0.8" fill="#6a5a3a" opacity="0.1" />

      {/* === ENHANCED LIGHTING — dusk glow, lantern pools, fire warmth === */}
      {/* Dusk horizon glow — broad warm band along the western sky reflected on everything */}
      <rect x="0" y="160" width="800" height="80" fill="#7a5a3a" opacity="0.012" />
      {/* Campfire 1 warm light pool — extended ambient warmth on nearby ground */}
      <ellipse cx="300" cy="310" rx="60" ry="25" fill="#a06030" opacity="0.015">
        <animate attributeName="opacity" values="0.015;0.025;0.015" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Campfire 2 warm light pool — smaller, distant */}
      <ellipse cx="650" cy="305" rx="35" ry="15" fill="#a06030" opacity="0.01">
        <animate attributeName="opacity" values="0.01;0.018;0.01" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Lantern 1 warm cone — directional light from the shelter lantern */}
      <path d="M148 285 Q130 310 115 340 Q160 340 182 310 Z" fill="#a07030" opacity="0.012">
        <animate attributeName="opacity" values="0.012;0.02;0.012" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Lantern 2 warm cone — from pole lantern */}
      <path d="M440 263 Q425 290 415 310 Q460 310 458 290 Z" fill="#a07030" opacity="0.01">
        <animate attributeName="opacity" values="0.01;0.016;0.01" dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* Signal fire warm glow — faint amber cast on the hill and nearby sky */}
      <ellipse cx="770" cy="140" rx="20" ry="12" fill="#a06030" opacity="0.015">
        <animate attributeName="opacity" values="0.015;0.025;0.015" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* City glow — collective warm haze from Nice's windows and fireplaces */}
      <ellipse cx="660" cy="168" rx="60" ry="8" fill="#a08050" opacity="0.012" />
      {/* Rim light on shelter canvas from fire — warm edge catching */}
      <path d="M205 280 Q210 278 212 282" fill="none" stroke="#6a4a28" strokeWidth="0.5" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.02;0.04" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M430 278 Q432 276 434 278" fill="none" stroke="#6a4a28" strokeWidth="0.4" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.015;0.03" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Star-like pinpricks — a few faint stars visible through cloud gaps */}
      <circle cx="360" cy="14" r="0.5" fill="#8a8a90" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06;0.04;0.06" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="22" r="0.4" fill="#8a8a90" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.08;0.04;0.02;0.04" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="550" cy="10" r="0.5" fill="#8a8a90" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.09;0.05;0.03;0.05" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="720" cy="18" r="0.4" fill="#8a8a90" opacity="0.04" />

      {/* Vignette — slightly heavier than average */}
      <rect width="800" height="400" fill="url(#ch1_vignette)" />

      {/* === FOREGROUND SHADOW DETAIL — rock textures and crevices === */}
      {/* Rock crevice shadows — dark lines in foreground rock faces */}
      <path d="M25 356 Q28 358 32 356" fill="none" stroke="#1a1510" strokeWidth="0.5" opacity="0.25" />
      <path d="M55 348 Q58 350 62 349" fill="none" stroke="#1a1510" strokeWidth="0.4" opacity="0.2" />
      <path d="M110 352 Q114 354 118 352" fill="none" stroke="#1a1510" strokeWidth="0.4" opacity="0.2" />
      <path d="M625 354 Q630 356 635 354" fill="none" stroke="#1a1510" strokeWidth="0.5" opacity="0.22" />
      <path d="M695 350 Q700 352 705 350" fill="none" stroke="#1a1510" strokeWidth="0.4" opacity="0.2" />
      <path d="M750 354 Q754 356 758 354" fill="none" stroke="#1a1510" strokeWidth="0.4" opacity="0.18" />
      {/* Tiny pebbles on foreground rocks */}
      <circle cx="45" cy="355" r="0.7" fill="#2a2520" opacity="0.2" />
      <circle cx="80" cy="352" r="0.6" fill="#2a2520" opacity="0.18" />
      <circle cx="145" cy="355" r="0.5" fill="#2a2520" opacity="0.15" />
      <circle cx="615" cy="358" r="0.6" fill="#2a2520" opacity="0.18" />
      <circle cx="670" cy="352" r="0.7" fill="#2a2520" opacity="0.2" />
      <circle cx="730" cy="354" r="0.5" fill="#2a2520" opacity="0.15" />
      {/* Salt deposits — white mineral crust on rock edges near sea */}
      <path d="M10 358 Q15 357 20 359" fill="none" stroke="#7a7a78" strokeWidth="0.3" opacity="0.08" />
      <path d="M65 354 Q70 353 75 355" fill="none" stroke="#7a7a78" strokeWidth="0.3" opacity="0.07" />
      <path d="M600 358 Q605 357 610 359" fill="none" stroke="#7a7a78" strokeWidth="0.3" opacity="0.07" />
      <path d="M765 354 Q770 353 775 355" fill="none" stroke="#7a7a78" strokeWidth="0.3" opacity="0.06" />

      {/* === FOREGROUND RATS — more rodents in the desolate camp === */}
      {/* Rat 3 — scurrying across foreground rocks */}
      <g opacity="0.3">
        <path d="M680 362 Q683 360 686 361 Q687 362 686 363 L680 363 Z" fill="#252018" />
        <line x1="680" y1="362" x2="677" y2="361" stroke="#252018" strokeWidth="0.3" />
      </g>
      {/* Rat 4 — near the empty crates, nose twitching */}
      <g opacity="0.28">
        <path d="M192 346 Q195 344 198 345 Q199 346 198 347 L192 347 Z" fill="#252018">
          <animate attributeName="d" values="M192 346 Q195 344 198 345 Q199 346 198 347 L192 347 Z;M194 346 Q197 344 200 345 Q201 346 200 347 L194 347 Z;M192 346 Q195 344 198 345 Q199 346 198 347 L192 347 Z" dur="6s" repeatCount="indefinite" />
        </path>
        <line x1="192" y1="347" x2="189" y2="346" stroke="#252018" strokeWidth="0.3">
          <animate attributeName="x1" values="192;194;192" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="189;191;189" dur="6s" repeatCount="indefinite" />
        </line>
      </g>

      {/* === ENHANCED FOREGROUND ATMOSPHERE — sea spray and cold air === */}
      {/* Heavier sea mist rolling in from the left — animated drift */}
      <ellipse cx="80" cy="355" rx="60" ry="10" fill="#4a4a55" opacity="0.03">
        <animate attributeName="cx" values="80;120;80" dur="20s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.03;0.05;0.03" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="350" rx="50" ry="8" fill="#4a4a55" opacity="0.025">
        <animate attributeName="cx" values="700;740;700" dur="18s" repeatCount="indefinite" />
      </ellipse>

      {/* Cold blue-grey wash over the entire camp area — March chill */}
      <rect x="0" y="228" width="800" height="172" fill="#2a3040" opacity="0.04" />

      {/* Bottom darkening */}
      <rect x="0" y="355" width="800" height="45" fill="#1a1510" opacity="0.35" />
    </svg>
  );
}
