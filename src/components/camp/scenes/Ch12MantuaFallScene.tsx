import React from 'react';

/**
 * Ch.12 — Fall of Mantua, outside fortress walls
 * Winter morning. Massive fortress walls/gates, surrendering Austrian column,
 * winter bare trees, grey sky, worn but proud French victors, discarded weapons,
 * frost and snow particles. Mood: Somber victory in bitter cold.
 *
 * Enhanced: Austrian prisoner column through gate, musket stack, tricolor on tower,
 * animated snow flurry, breath vapor, supply wagon, frozen puddles, distant prisoners,
 * sentry in tower window, dog following soldiers.
 *
 * Enhanced v2: Abandoned Austrian cannon (spoils), more frost detail (rime on branches,
 * ice on puddles, frost on stones), cavalry patrol at distance, stacked drums,
 * map/treaty table, Austrian officer's sword surrender, church bell rings,
 * crowd of civilians behind gate, supply barrels from fortress, crow on tree.
 *
 * Enhanced v3: Cobblestone road texture, grass/dead vegetation, light through clouds
 * (crepuscular rays), distant hills behind fortress, moat/ditch, wall moss/water stains,
 * wagon draft horse, French guard sentries at gate, lowered Austrian flag on ground,
 * smoke from fortress chimneys, more bushes, foreground weeds, additional shadow detail,
 * scattered straw, broken cart wheel, richer cloud layering, ground soil texture.
 *
 * Enhanced v4: Expanded atmospheric depth (volumetric fog layers, enhanced mist),
 * additional fortress weathering (artillery scars, cracked stones, siege damage),
 * enhanced light rays (stronger god rays, cloud breaks), advanced ground textures
 * (ice crystallization, mud patches, snow accumulation), French occupation markers
 * (wall banners, posted proclamations), enhanced debris field (discarded equipment,
 * broken ladders, spent ammunition), frost accumulation on metal surfaces, more
 * architectural detail (drainage spouts, defensive features, murder holes).
 *
 * Enhanced v5: Detailed individual stone blocks on fortress gate, Austrian white
 * surrender flags on poles, dropped cartridge boxes/equipment trail, additional
 * French soldiers (wounded with bandaged arm, sergeant gesturing), deeper footprint
 * trails in mud/snow from gate, tattered regimental flags (torn Austrian Leibfahne,
 * battle-worn French eagle standard), additional bare tree with crow's nest,
 * collapsed gabion basket, scattered playing cards near resting soldier,
 * frozen water bucket, icicles hanging from gate arch and wall edges,
 * additional ground-level mist wisps, more foreground rubble detail.
 */
export function Ch12MantuaFallScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Winter morning sky — cold grey with thin warm band at horizon */}
        <linearGradient id="ch12_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151820" />
          <stop offset="25%" stopColor="#1e2430" />
          <stop offset="50%" stopColor="#2a3038" />
          <stop offset="70%" stopColor="#3a4045" />
          <stop offset="85%" stopColor="#4a4e50" />
          <stop offset="93%" stopColor="#5a5550" />
          <stop offset="100%" stopColor="#6a6055" />
        </linearGradient>

        {/* Fortress walls — aged stone */}
        <linearGradient id="ch12_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#504a42" />
          <stop offset="30%" stopColor="#4a4540" />
          <stop offset="60%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#302a25" />
        </linearGradient>

        {/* Tower gradient — slightly darker stone */}
        <linearGradient id="ch12_tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#454038" />
          <stop offset="50%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>

        {/* Ground — frozen earth */}
        <linearGradient id="ch12_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2820" />
          <stop offset="40%" stopColor="#222018" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>

        {/* Gate interior shadow */}
        <radialGradient id="ch12_gateShadow" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#0a0808" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#15120e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#15120e" stopOpacity="0" />
        </radialGradient>

        {/* Radial vignette — darkens edges */}
        <radialGradient id="ch12_vignette" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>

        {/* Frost shimmer on ground */}
        <linearGradient id="ch12_frost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8090a0" stopOpacity="0" />
          <stop offset="20%" stopColor="#8090a0" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#a0b0c0" stopOpacity="0.08" />
          <stop offset="80%" stopColor="#8090a0" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#8090a0" stopOpacity="0" />
        </linearGradient>

        {/* Tricolor blue */}
        <linearGradient id="ch12_flagBlue" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#1a2a55" />
          <stop offset="100%" stopColor="#253565" />
        </linearGradient>

        {/* Tricolor red */}
        <linearGradient id="ch12_flagRed" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#6a2020" />
          <stop offset="100%" stopColor="#7a2828" />
        </linearGradient>

        {/* Atmospheric haze over distant wall */}
        <linearGradient id="ch12_haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3038" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a3038" stopOpacity="0" />
        </linearGradient>

        {/* Snow particle filter for subtle shimmer */}
        <filter id="ch12_snowGlow">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>

        {/* NEW: Frozen puddle reflection gradient */}
        <linearGradient id="ch12_iceReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5565" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#3a4555" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2a3040" stopOpacity="0.05" />
        </linearGradient>

        {/* NEW: Wagon wood gradient */}
        <linearGradient id="ch12_wagonWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3025" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>

        {/* NEW: Wagon canvas cover */}
        <linearGradient id="ch12_wagonCanvas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4840" />
          <stop offset="100%" stopColor="#3a3830" />
        </linearGradient>

        {/* NEW: Tower tricolor flag — animated wave */}
        <linearGradient id="ch12_towerFlagBlue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2a60" />
          <stop offset="100%" stopColor="#253870" />
        </linearGradient>
        <linearGradient id="ch12_towerFlagRed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#702525" />
          <stop offset="100%" stopColor="#803030" />
        </linearGradient>

        {/* NEW: Breath vapor filter — soft blur */}
        <filter id="ch12_breathBlur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        {/* NEW v2: Cannon barrel gradient — dark iron */}
        <linearGradient id="ch12_cannonMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="50%" stopColor="#35353a" />
          <stop offset="100%" stopColor="#28282c" />
        </linearGradient>

        {/* NEW v2: Barrel (cask) wood gradient */}
        <linearGradient id="ch12_barrelWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3020" />
          <stop offset="50%" stopColor="#302818" />
          <stop offset="100%" stopColor="#2a2015" />
        </linearGradient>

        {/* NEW v2: Table surface gradient */}
        <linearGradient id="ch12_tableTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3228" />
          <stop offset="100%" stopColor="#2e2820" />
        </linearGradient>

        {/* NEW v2: Church bell ring filter — soft glow */}
        <filter id="ch12_bellRingGlow">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>

        {/* NEW v2: Rime frost shimmer — brighter ice crystals */}
        <linearGradient id="ch12_rimeFrost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#90a8c0" stopOpacity="0" />
          <stop offset="30%" stopColor="#a0b8d0" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#90a8c0" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#90a8c0" stopOpacity="0" />
        </linearGradient>

        {/* NEW v3: Distant hills gradient — blue-grey receding landscape */}
        <linearGradient id="ch12_distantHills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4048" />
          <stop offset="60%" stopColor="#343840" />
          <stop offset="100%" stopColor="#2e3238" />
        </linearGradient>

        {/* NEW v3: Moat water gradient — dark, still, cold */}
        <linearGradient id="ch12_moatWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2830" />
          <stop offset="50%" stopColor="#1a2428" />
          <stop offset="100%" stopColor="#161e24" />
        </linearGradient>

        {/* NEW v3: Cobblestone pattern highlight */}
        <linearGradient id="ch12_cobbleHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3528" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a2518" stopOpacity="0.1" />
        </linearGradient>

        {/* NEW v3: Crepuscular ray — soft light beam through clouds */}
        <linearGradient id="ch12_sunRay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8068" stopOpacity="0" />
          <stop offset="20%" stopColor="#8a8068" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#9a9078" stopOpacity="0.06" />
          <stop offset="80%" stopColor="#8a8068" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#8a8068" stopOpacity="0" />
        </linearGradient>

        {/* NEW v3: Wall moss/lichen gradient */}
        <linearGradient id="ch12_wallMoss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a3520" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#223018" stopOpacity="0.08" />
        </linearGradient>

        {/* NEW v3: Smoke wisp filter — softer than breath */}
        <filter id="ch12_smokeBlur">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>

        {/* NEW v3: Ground soil noise texture pattern */}
        <filter id="ch12_soilTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="42" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="multiply" />
        </filter>

        {/* NEW v3: Straw / hay color */}
        <linearGradient id="ch12_straw" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4228" />
          <stop offset="100%" stopColor="#3a3520" />
        </linearGradient>

        {/* NEW v4: Volumetric fog gradient — atmospheric depth */}
        <linearGradient id="ch12_volumetricFog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4550" stopOpacity="0" />
          <stop offset="40%" stopColor="#3a4550" stopOpacity="0.08" />
          <stop offset="80%" stopColor="#3a4550" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#3a4550" stopOpacity="0" />
        </linearGradient>

        {/* NEW v4: Ice crystallization gradient — frozen puddle details */}
        <radialGradient id="ch12_iceCrystal" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a0b8d0" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#8098b0" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#607888" stopOpacity="0" />
        </radialGradient>

        {/* NEW v4: Mud/slush gradient — wet ground near moat */}
        <linearGradient id="ch12_mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#282420" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1e1c18" stopOpacity="0.08" />
        </linearGradient>

        {/* NEW v4: Banner/flag fabric gradient */}
        <linearGradient id="ch12_bannerFabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a685e" />
          <stop offset="100%" stopColor="#4a4840" />
        </linearGradient>

        {/* NEW v5: Icicle gradient — translucent ice hanging from edges */}
        <linearGradient id="ch12_icicle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8098b0" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#90a8c0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a0b8d0" stopOpacity="0.06" />
        </linearGradient>

        {/* NEW v5: Gabion basket gradient — woven earth-filled basket */}
        <linearGradient id="ch12_gabion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3225" />
          <stop offset="100%" stopColor="#2a2418" />
        </linearGradient>

        {/* NEW v5: Torn flag — Austrian Leibfahne, faded white/yellow */}
        <linearGradient id="ch12_tornFlagAustria" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#5a5848" />
          <stop offset="50%" stopColor="#605e50" />
          <stop offset="100%" stopColor="#4a4838" />
        </linearGradient>

        {/* NEW v5: Eagle standard gold gradient */}
        <linearGradient id="ch12_eagleGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a5a30" />
          <stop offset="50%" stopColor="#5a4a28" />
          <stop offset="100%" stopColor="#4a3a20" />
        </linearGradient>

        {/* NEW v5: Ground mist wisp filter — very soft for low-lying fog */}
        <filter id="ch12_mistWisp">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>

        {/* NEW: Snowflake drift animation keyframes via CSS */}
        <style>{`
          @keyframes ch12_snowDrift1 {
            0% { transform: translate(0, 0); opacity: 0.12; }
            25% { transform: translate(3px, 8px); opacity: 0.16; }
            50% { transform: translate(-2px, 18px); opacity: 0.14; }
            75% { transform: translate(4px, 28px); opacity: 0.10; }
            100% { transform: translate(1px, 40px); opacity: 0; }
          }
          @keyframes ch12_snowDrift2 {
            0% { transform: translate(0, 0); opacity: 0.10; }
            25% { transform: translate(-4px, 10px); opacity: 0.15; }
            50% { transform: translate(2px, 22px); opacity: 0.12; }
            75% { transform: translate(-3px, 32px); opacity: 0.08; }
            100% { transform: translate(-1px, 44px); opacity: 0; }
          }
          @keyframes ch12_snowDrift3 {
            0% { transform: translate(0, 0); opacity: 0.14; }
            30% { transform: translate(5px, 12px); opacity: 0.16; }
            60% { transform: translate(-1px, 25px); opacity: 0.11; }
            100% { transform: translate(3px, 42px); opacity: 0; }
          }
          @keyframes ch12_flagWave {
            0% { d: path('M40 26 Q48 24 54 26 Q58 22 62 26 Q66 24 70 26 L70 38 Q66 36 62 38 Q58 34 54 38 Q48 36 40 38 Z'); }
            33% { d: path('M40 26 Q47 22 54 25 Q59 28 63 24 Q67 26 70 26 L70 38 Q67 36 63 38 Q59 34 54 37 Q47 40 40 38 Z'); }
            66% { d: path('M40 26 Q49 28 55 24 Q58 26 63 28 Q67 24 70 26 L70 38 Q67 40 63 36 Q58 38 55 40 Q49 36 40 38 Z'); }
            100% { d: path('M40 26 Q48 24 54 26 Q58 22 62 26 Q66 24 70 26 L70 38 Q66 36 62 38 Q58 34 54 38 Q48 36 40 38 Z'); }
          }
          @keyframes ch12_breathPulse1 {
            0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
            20% { opacity: 0.08; }
            50% { opacity: 0.06; transform: translate(4px, -3px) scale(1); }
            100% { opacity: 0; transform: translate(8px, -6px) scale(1.5); }
          }
          @keyframes ch12_breathPulse2 {
            0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
            25% { opacity: 0.07; }
            60% { opacity: 0.05; transform: translate(-4px, -4px) scale(1.1); }
            100% { opacity: 0; transform: translate(-7px, -7px) scale(1.4); }
          }
          @keyframes ch12_bellRing {
            0% { transform: scale(1); opacity: 0.12; }
            50% { transform: scale(1.8); opacity: 0.04; }
            100% { transform: scale(2.6); opacity: 0; }
          }
          @keyframes ch12_bellRing2 {
            0% { transform: scale(1); opacity: 0.09; }
            50% { transform: scale(1.6); opacity: 0.03; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes ch12_smokeRise1 {
            0% { transform: translate(0, 0) scaleX(1); opacity: 0.06; }
            30% { transform: translate(6px, -8px) scaleX(1.3); opacity: 0.08; }
            60% { transform: translate(12px, -18px) scaleX(1.6); opacity: 0.05; }
            100% { transform: translate(20px, -30px) scaleX(2); opacity: 0; }
          }
          @keyframes ch12_smokeRise2 {
            0% { transform: translate(0, 0) scaleX(1); opacity: 0.05; }
            25% { transform: translate(-4px, -6px) scaleX(1.2); opacity: 0.07; }
            55% { transform: translate(-8px, -15px) scaleX(1.5); opacity: 0.04; }
            100% { transform: translate(-12px, -28px) scaleX(1.8); opacity: 0; }
          }
          @keyframes ch12_rayPulse {
            0% { opacity: 0.03; }
            50% { opacity: 0.06; }
            100% { opacity: 0.03; }
          }
          @keyframes ch12_fogDrift {
            0% { transform: translateX(0); opacity: 0.06; }
            50% { transform: translateX(20px); opacity: 0.08; }
            100% { transform: translateX(40px); opacity: 0.04; }
          }
          @keyframes ch12_bannerWave {
            0% { transform: scaleY(1) translateY(0); }
            33% { transform: scaleY(1.02) translateY(-1px); }
            66% { transform: scaleY(0.98) translateY(1px); }
            100% { transform: scaleY(1) translateY(0); }
          }
          @keyframes ch12_mistDrift {
            0% { transform: translateX(0) scaleX(1); opacity: 0.04; }
            33% { transform: translateX(15px) scaleX(1.1); opacity: 0.06; }
            66% { transform: translateX(-10px) scaleX(0.95); opacity: 0.05; }
            100% { transform: translateX(0) scaleX(1); opacity: 0.04; }
          }
          @keyframes ch12_whiteFlagWave {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            50% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes ch12_icicleDrip {
            0% { opacity: 0; transform: translateY(0); }
            10% { opacity: 0.15; }
            50% { opacity: 0.1; transform: translateY(3px); }
            100% { opacity: 0; transform: translateY(8px); }
          }
        `}</style>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch12_sky)" />

      {/* Layered winter clouds */}
      <ellipse cx="180" cy="28" rx="160" ry="10" fill="#222830" opacity="0.3" />
      <ellipse cx="420" cy="18" rx="200" ry="8" fill="#1e2428" opacity="0.25" />
      <ellipse cx="600" cy="38" rx="130" ry="7" fill="#252a30" opacity="0.3" />
      <ellipse cx="100" cy="55" rx="110" ry="6" fill="#2a3038" opacity="0.2" />
      <ellipse cx="700" cy="22" rx="90" ry="5" fill="#222830" opacity="0.2" />

      {/* NEW v3: Additional cloud detail — more layers for depth */}
      <ellipse cx="50" cy="15" rx="80" ry="6" fill="#1e222a" opacity="0.2" />
      <ellipse cx="300" cy="42" rx="140" ry="9" fill="#252830" opacity="0.15" />
      <ellipse cx="750" cy="48" rx="70" ry="5" fill="#222630" opacity="0.18" />
      {/* Thicker cloud mass — upper left, suggests storm passing */}
      <ellipse cx="120" cy="35" rx="100" ry="14" fill="#1a1e25" opacity="0.2" />
      {/* Wispy high cirrus — very faint, adds realism */}
      <path d="M50 8 Q200 5 350 10 Q500 6 650 12 Q750 8 800 10" fill="none" stroke="#2a3040" strokeWidth="2" opacity="0.08" />
      <path d="M0 18 Q150 14 300 20 Q450 15 600 22 Q700 18 800 20" fill="none" stroke="#2a3040" strokeWidth="1.5" opacity="0.06" />
      {/* Cloud underbelly highlights — faint warm light reflecting from below */}
      <ellipse cx="400" cy="50" rx="180" ry="6" fill="#4a4540" opacity="0.04" />
      <ellipse cx="200" cy="60" rx="120" ry="4" fill="#4a4540" opacity="0.03" />

      {/* Faint warm band at horizon behind fortress */}
      <rect x="0" y="85" width="800" height="20" fill="#5a5548" opacity="0.1" />
      {/* NEW v3: Slightly brighter warm horizon glow — winter sun low behind clouds */}
      <rect x="200" y="80" width="400" height="15" fill="#6a6050" opacity="0.06" />

      {/* NEW v3: Crepuscular rays — faint sun beams through cloud breaks */}
      <polygon points="320,0 310,100 340,100" fill="url(#ch12_sunRay)"
        style={{ animation: 'ch12_rayPulse 8s ease-in-out infinite' }} />
      <polygon points="480,0 465,100 495,100" fill="url(#ch12_sunRay)" opacity="0.7"
        style={{ animation: 'ch12_rayPulse 8s ease-in-out infinite', animationDelay: '2s' }} />
      <polygon points="560,0 550,90 575,90" fill="url(#ch12_sunRay)" opacity="0.5"
        style={{ animation: 'ch12_rayPulse 8s ease-in-out infinite', animationDelay: '4s' }} />

      {/* NEW v4: Enhanced god rays — more pronounced light shafts from cloud breaks */}
      <polygon points="380,0 370,110 395,110" fill="url(#ch12_sunRay)" opacity="0.5"
        style={{ animation: 'ch12_rayPulse 9s ease-in-out infinite', animationDelay: '1s' }} />
      <polygon points="420,0 408,95 435,95" fill="url(#ch12_sunRay)" opacity="0.6"
        style={{ animation: 'ch12_rayPulse 7s ease-in-out infinite', animationDelay: '3s' }} />
      <polygon points="610,0 600,85 622,85" fill="url(#ch12_sunRay)" opacity="0.4"
        style={{ animation: 'ch12_rayPulse 10s ease-in-out infinite', animationDelay: '5s' }} />

      {/* NEW v3: Distant hills / landscape behind fortress — visible above walls */}
      <path d="M0 95 Q80 78 160 88 Q240 72 320 82 Q400 68 480 80 Q560 70 640 78 Q720 65 800 80 L800 105 L0 105 Z"
        fill="url(#ch12_distantHills)" opacity="0.4" />
      {/* Second hill range — nearer, darker */}
      <path d="M0 90 Q100 82 200 92 Q300 80 400 88 Q500 78 600 85 Q700 76 800 88 L800 105 L0 105 Z"
        fill="#2e3238" opacity="0.35" />

      {/* === FORTRESS ARCHITECTURE === */}

      {/* Distant wall extension — left wing */}
      <rect x="-20" y="115" width="90" height="135" fill="#383328" />
      {/* Distant wall extension — right wing */}
      <rect x="730" y="118" width="90" height="132" fill="#383328" />

      {/* Main wall */}
      <rect x="50" y="100" width="700" height="150" fill="url(#ch12_wall)" />

      {/* Wall texture — horizontal mortar lines */}
      {[112, 125, 138, 150, 162, 174, 186, 198, 210, 222, 236].map((y) => (
        <path key={`h${y}`} d={`M55 ${y} L745 ${y}`} fill="none" stroke="#4a4538" strokeWidth="0.4" opacity="0.18" />
      ))}
      {/* Wall texture — vertical mortar (staggered blocks) */}
      {[90, 135, 180, 225, 270, 315, 360, 460, 505, 550, 595, 640, 685, 730].map((x, i) => (
        <path key={`v${x}`} d={`M${x} ${100 + (i % 2) * 6} L${x} 250`} fill="none" stroke="#4a4538" strokeWidth="0.4" opacity="0.12" />
      ))}

      {/* NEW v5: Individual stone blocks — visible masonry around gate and lower wall */}
      <g opacity="0.1">
        {/* Large ashlar blocks flanking the gate — carefully cut stone */}
        {[0, 1, 2, 3, 4].map((row) => (
          <React.Fragment key={`gateStoneL${row}`}>
            <rect x="320" y={200 + row * 10} width="16" height="9" fill="none" stroke="#4a4538" strokeWidth="0.5" rx="0.3" />
            <rect x="465" y={200 + row * 10} width="16" height="9" fill="none" stroke="#4a4538" strokeWidth="0.5" rx="0.3" />
          </React.Fragment>
        ))}
        {/* Rusticated stone courses — rough-hewn blocks on lower wall */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const bx = 70 + i * 35 + (i % 2) * 10;
          const by = 220 + (i % 3) * 2;
          return <rect key={`rustStone${i}`} x={bx} y={by} width={28} height={12} fill="none" stroke="#4a4538" strokeWidth="0.4" rx="0.5" />;
        })}
        {/* Quoin stones at tower corners — alternating sizes */}
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <React.Fragment key={`quoin${j}`}>
            <rect x="93" y={100 + j * 25} width={j % 2 === 0 ? 8 : 6} height="12" fill="none" stroke="#4a4538" strokeWidth="0.4" />
            <rect x="705" y={100 + j * 25} width={j % 2 === 0 ? 8 : 6} height="12" fill="none" stroke="#4a4538" strokeWidth="0.4" />
          </React.Fragment>
        ))}
      </g>

      {/* NEW v5: Icicles hanging from gate arch keystone and battlement edges */}
      <g>
        {/* Icicles under gate arch — hanging from the stone */}
        {[365, 372, 380, 388, 396, 404, 412, 420, 428, 435].map((x, i) => {
          const h = 4 + (i % 3) * 3;
          const archY = 250 - Math.sqrt(Math.max(0, 1 - Math.pow((x - 400) / 63, 2))) * 65;
          return (
            <path key={`icicleGate${i}`}
              d={`M${x - 0.5} ${archY} L${x} ${archY + h} L${x + 0.5} ${archY} Z`}
              fill="url(#ch12_icicle)" opacity={0.3 + (i % 2) * 0.1} />
          );
        })}
        {/* Icicles from battlement edges — sparse, random */}
        {[80, 160, 240, 320, 480, 560, 640, 720].map((x, i) => {
          const h = 3 + (i % 4) * 2;
          return (
            <path key={`icicleBat${i}`}
              d={`M${x - 0.4} 103 L${x} ${103 + h} L${x + 0.4} 103 Z`}
              fill="url(#ch12_icicle)" opacity={0.2 + (i % 3) * 0.06} />
          );
        })}
        {/* Occasional drip from icicle — animated water drop */}
        <circle cx="396" cy="252" r="0.6" fill="#8098b0" opacity="0.12"
          style={{ animation: 'ch12_icicleDrip 6s ease-in infinite' }} />
        <circle cx="240" cy="106" r="0.5" fill="#8098b0" opacity="0.1"
          style={{ animation: 'ch12_icicleDrip 8s ease-in infinite', animationDelay: '3s' }} />
      </g>

      {/* Wall damage / weathering patches */}
      <rect x="120" y="140" width="25" height="15" fill="#35302a" opacity="0.3" rx="2" />
      <rect x="520" y="165" width="30" height="12" fill="#35302a" opacity="0.25" rx="2" />
      <rect x="620" y="130" width="18" height="18" fill="#2e2a24" opacity="0.2" rx="1" />

      {/* NEW v3: Additional wall damage — cannonball impact craters */}
      <circle cx="200" cy="160" r="5" fill="#2e2a24" opacity="0.2" />
      <circle cx="202" cy="159" r="3.5" fill="#282420" opacity="0.15" />
      <circle cx="580" cy="175" r="4" fill="#2e2a24" opacity="0.18" />
      <circle cx="680" cy="145" r="6" fill="#2e2a24" opacity="0.15" />
      <circle cx="681" cy="144" r="4" fill="#282420" opacity="0.12" />

      {/* NEW v4: Extended siege damage — larger artillery impact zones */}
      <circle cx="400" cy="155" r="8" fill="#2e2a24" opacity="0.18" />
      <circle cx="402" cy="154" r="5" fill="#282420" opacity="0.12" />
      {/* Radiating cracks from impact */}
      <line x1="400" y1="155" x2="392" y2="150" stroke="#2a2620" strokeWidth="0.4" opacity="0.08" />
      <line x1="400" y1="155" x2="408" y2="151" stroke="#2a2620" strokeWidth="0.4" opacity="0.08" />
      <line x1="400" y1="155" x2="397" y2="163" stroke="#2a2620" strokeWidth="0.4" opacity="0.08" />
      {/* Secondary impact near right tower */}
      <circle cx="720" cy="170" r="6" fill="#2e2a24" opacity="0.16" />
      <circle cx="721" cy="169" r="3.5" fill="#282420" opacity="0.1" />
      {/* Spalled stone fragments near impacts */}
      <ellipse cx="405" cy="162" rx="3" ry="2" fill="#35302a" opacity="0.15" />
      <ellipse cx="724" cy="176" rx="2.5" ry="1.5" fill="#35302a" opacity="0.12" />

      {/* NEW v3: Moss / lichen on lower wall — green-grey organic growth */}
      <ellipse cx="100" cy="230" rx="18" ry="8" fill="url(#ch12_wallMoss)" />
      <ellipse cx="180" cy="235" rx="12" ry="6" fill="url(#ch12_wallMoss)" />
      <ellipse cx="550" cy="228" rx="15" ry="7" fill="url(#ch12_wallMoss)" />
      <ellipse cx="650" cy="232" rx="10" ry="5" fill="url(#ch12_wallMoss)" />
      <ellipse cx="350" cy="238" rx="20" ry="6" fill="url(#ch12_wallMoss)" />

      {/* NEW v3: Water stain streaks running down from crenellations */}
      <path d="M150 100 L148 160" fill="none" stroke="#2a2820" strokeWidth="2" opacity="0.06" />
      <path d="M310 100 L312 155" fill="none" stroke="#2a2820" strokeWidth="1.5" opacity="0.05" />
      <path d="M500 100 L498 148" fill="none" stroke="#2a2820" strokeWidth="2" opacity="0.06" />
      <path d="M640 100 L642 152" fill="none" stroke="#2a2820" strokeWidth="1.8" opacity="0.05" />

      {/* NEW v2: Frost / rime on fortress wall stones — white patches where moisture froze */}
      <ellipse cx="160" cy="135" rx="8" ry="3" fill="#8090a0" opacity="0.04" />
      <ellipse cx="350" cy="145" rx="10" ry="2" fill="#8090a0" opacity="0.035" />
      <ellipse cx="560" cy="128" rx="7" ry="2.5" fill="#8898a8" opacity="0.04" />
      <ellipse cx="680" cy="155" rx="6" ry="2" fill="#8090a0" opacity="0.03" />
      {/* Frost on battlements — thin rime line along top edges */}
      <rect x="50" y="99" width="700" height="1.5" fill="url(#ch12_rimeFrost)" />

      {/* Arrow slits in main wall */}
      <rect x="180" y="150" width="3" height="18" fill="#1a1815" rx="1" />
      <rect x="280" y="148" width="3" height="18" fill="#1a1815" rx="1" />
      <rect x="530" y="150" width="3" height="18" fill="#1a1815" rx="1" />
      <rect x="620" y="147" width="3" height="18" fill="#1a1815" rx="1" />

      {/* NEW v4: Additional defensive features — murder holes above gate */}
      <rect x="370" y="200" width="2" height="8" fill="#1a1815" opacity="0.4" rx="0.5" />
      <rect x="380" y="200" width="2" height="8" fill="#1a1815" opacity="0.4" rx="0.5" />
      <rect x="420" y="200" width="2" height="8" fill="#1a1815" opacity="0.4" rx="0.5" />
      <rect x="430" y="200" width="2" height="8" fill="#1a1815" opacity="0.4" rx="0.5" />

      {/* NEW v4: Drainage spouts — gargoyle-style waterspouts on wall */}
      <g opacity="0.3">
        <path d="M250 218 L245 222 L247 224" fill="#35302a" />
        <circle cx="247" cy="224" r="1" fill="#2a2520" />
        <path d="M470 220 L465 224 L467 226" fill="#35302a" />
        <circle cx="467" cy="226" r="1" fill="#2a2520" />
      </g>

      {/* Battlements — crenellations */}
      {Array.from({ length: 18 }, (_, i) => (
        <React.Fragment key={`bat${i}`}>
          <rect x={60 + i * 40} y="84" width="20" height="20" fill="#4a4540" />
          {/* Merlon cap */}
          <rect x={59 + i * 40} y="82" width="22" height="3" fill="#504a42" />
        </React.Fragment>
      ))}

      {/* NEW v4: French occupation markers — banners/proclamations hung on fortress wall */}
      <g opacity="0.5">
        {/* Proclamation poster — nailed to wall, left section */}
        <rect x="140" y="180" width="18" height="24" fill="url(#ch12_bannerFabric)" rx="0.5"
          style={{ animation: 'ch12_bannerWave 4s ease-in-out infinite' }} />
        {/* Torn edge at bottom */}
        <path d="M140 204 L143 202 L146 204 L149 203 L152 204 L155 202 L158 204" fill="none" stroke="#3a3830" strokeWidth="0.4" />
        {/* Text lines */}
        <line x1="143" y1="184" x2="155" y2="184" stroke="#2a2820" strokeWidth="0.5" opacity="0.3" />
        <line x1="143" y1="188" x2="155" y2="188" stroke="#2a2820" strokeWidth="0.5" opacity="0.3" />
        <line x1="143" y1="192" x2="155" y2="192" stroke="#2a2820" strokeWidth="0.5" opacity="0.3" />

        {/* Small tricolor banner — draped over battlement, center */}
        <path d="M395 88 L395 110 L398 108 L398 88 Z" fill="#1a2a55" opacity="0.6" />
        <path d="M398 88 L398 108 L401 106 L401 88 Z" fill="#6a685e" opacity="0.5" />
        <path d="M401 88 L401 106 L404 104 L404 88 Z" fill="#6a2020" opacity="0.55" />

        {/* Proclamation poster — right section */}
        <rect x="640" y="175" width="20" height="26" fill="url(#ch12_bannerFabric)" rx="0.5"
          style={{ animation: 'ch12_bannerWave 4.5s ease-in-out infinite', animationDelay: '1s' }} />
        <path d="M640 201 L643 199 L646 201 L650 200 L653 201 L657 199 L660 201" fill="none" stroke="#3a3830" strokeWidth="0.4" />
        <line x1="643" y1="179" x2="657" y2="179" stroke="#2a2820" strokeWidth="0.5" opacity="0.3" />
        <line x1="643" y1="183" x2="657" y2="183" stroke="#2a2820" strokeWidth="0.5" opacity="0.3" />
        <line x1="643" y1="187" x2="657" y2="187" stroke="#2a2820" strokeWidth="0.5" opacity="0.3" />
      </g>

      {/* === LEFT TOWER (larger, more detail) === */}
      <rect x="30" y="48" width="65" height="202" fill="url(#ch12_tower)" />
      {/* Tower cap / cornice */}
      <rect x="24" y="42" width="77" height="10" fill="#504a42" />
      <rect x="27" y="40" width="71" height="4" fill="#555048" />
      {/* Tower battlements */}
      <rect x="28" y="30" width="14" height="14" fill="#4a4540" />
      <rect x="52" y="30" width="14" height="14" fill="#4a4540" />
      <rect x="76" y="30" width="14" height="14" fill="#4a4540" />
      {/* Tower window — arched */}
      <path d="M52 80 Q62.5 68 73 80 L73 105 L52 105 Z" fill="#12100c" />
      {/* Window frame */}
      <path d="M52 80 Q62.5 68 73 80" fill="none" stroke="#555048" strokeWidth="1" />
      <line x1="62.5" y1="72" x2="62.5" y2="105" stroke="#3a3530" strokeWidth="0.8" />

      {/* NEW: Sentry silhouette in left tower window */}
      <g opacity="0.35">
        {/* Head */}
        <circle cx="60" cy="86" r="2.5" fill="#1a1815" />
        {/* Shako hint */}
        <rect x="58" y="82" width="4" height="3" fill="#1a1815" rx="0.5" />
        {/* Shoulders/torso visible in window */}
        <path d="M56 89 Q60 87 64 89 L64 96 L56 96 Z" fill="#1a1815" />
        {/* Musket barrel leaning in window */}
        <line x1="64" y1="85" x2="68" y2="78" stroke="#2a2825" strokeWidth="0.8" />
      </g>

      {/* Second window — small */}
      <rect x="55" y="140" width="14" height="10" fill="#12100c" rx="1" />
      {/* Stone texture lines on tower */}
      {[65, 85, 105, 125, 145, 165, 185, 205, 225].map((y) => (
        <line key={`lt${y}`} x1="32" y1={y} x2="93" y2={y} stroke="#4a4538" strokeWidth="0.3" opacity="0.15" />
      ))}

      {/* NEW: French tricolor being raised on the tallest (left) tower */}
      <g>
        {/* Flag pole — on top of left tower */}
        <line x1="55" y1="30" x2="55" y2="12" stroke="#3a3530" strokeWidth="1.5" />
        {/* Pole finial */}
        <circle cx="55" cy="11" r="1.5" fill="#6a6555" opacity="0.6" />
        {/* Animated tricolor — waving flag on tower */}
        {/* Blue band */}
        <path d="M55 13 Q60 11 63 13 Q65 15 66 13 L66 21 Q65 19 63 21 Q60 19 55 21 Z"
          fill="url(#ch12_towerFlagBlue)" opacity="0.65">
          <animate attributeName="d"
            values="M55 13 Q60 11 63 13 Q65 15 66 13 L66 21 Q65 19 63 21 Q60 19 55 21 Z;
                    M55 13 Q59 15 63 12 Q65 14 66 13 L66 21 Q65 23 63 20 Q59 22 55 21 Z;
                    M55 13 Q61 11 64 14 Q65 12 66 13 L66 21 Q65 20 64 22 Q61 19 55 21 Z;
                    M55 13 Q60 11 63 13 Q65 15 66 13 L66 21 Q65 19 63 21 Q60 19 55 21 Z"
            dur="3s" repeatCount="indefinite" />
        </path>
        {/* White band */}
        <path d="M66 13 Q69 11 72 13 Q74 15 75 14 L75 22 Q74 20 72 21 Q69 19 66 21 Z"
          fill="#808078" opacity="0.5">
          <animate attributeName="d"
            values="M66 13 Q69 11 72 13 Q74 15 75 14 L75 22 Q74 20 72 21 Q69 19 66 21 Z;
                    M66 13 Q68 15 71 12 Q73 14 75 14 L75 22 Q73 23 71 20 Q68 22 66 21 Z;
                    M66 13 Q70 12 73 14 Q74 12 75 14 L75 22 Q74 20 73 22 Q70 19 66 21 Z;
                    M66 13 Q69 11 72 13 Q74 15 75 14 L75 22 Q74 20 72 21 Q69 19 66 21 Z"
            dur="3s" repeatCount="indefinite" />
        </path>
        {/* Red band */}
        <path d="M75 14 Q78 12 81 14 Q83 16 85 14 L85 22 Q83 20 81 22 Q78 20 75 22 Z"
          fill="url(#ch12_towerFlagRed)" opacity="0.6">
          <animate attributeName="d"
            values="M75 14 Q78 12 81 14 Q83 16 85 14 L85 22 Q83 20 81 22 Q78 20 75 22 Z;
                    M75 14 Q77 16 80 13 Q82 15 85 14 L85 22 Q82 24 80 21 Q77 23 75 22 Z;
                    M75 14 Q79 13 82 15 Q83 13 85 14 L85 22 Q83 21 82 23 Q79 20 75 22 Z;
                    M75 14 Q78 12 81 14 Q83 16 85 14 L85 22 Q83 20 81 22 Q78 20 75 22 Z"
            dur="3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* NEW v2: Church bell sound rings emanating from left tower */}
      <g>
        {/* Bell visible in second window */}
        <path d="M60 142 Q62.5 139 65 142 L66 146 L59 146 Z" fill="#4a4838" opacity="0.35" />
        {/* Animated concentric ring 1 */}
        <circle cx="62.5" cy="143" r="6" fill="none" stroke="#8090a0" strokeWidth="0.6"
          style={{ animation: 'ch12_bellRing 4s ease-out infinite' }} />
        {/* Animated concentric ring 2 — offset */}
        <circle cx="62.5" cy="143" r="4" fill="none" stroke="#8090a0" strokeWidth="0.5"
          style={{ animation: 'ch12_bellRing2 4s ease-out infinite', animationDelay: '1s' }} />
        {/* Animated concentric ring 3 — further offset */}
        <circle cx="62.5" cy="143" r="5" fill="none" stroke="#7a8a9a" strokeWidth="0.4"
          style={{ animation: 'ch12_bellRing 4s ease-out infinite', animationDelay: '2s' }} />
      </g>

      {/* NEW v3: Smoke rising from within the fortress — cooking fires, occupation */}
      <g>
        {/* Smoke wisp 1 — behind left tower */}
        <ellipse cx="45" cy="42" rx="10" ry="4" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise1 10s ease-out infinite' }} />
        <ellipse cx="48" cy="38" rx="7" ry="3" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise1 10s ease-out infinite', animationDelay: '3s' }} />
        {/* Smoke wisp 2 — behind main wall center */}
        <ellipse cx="400" cy="88" rx="14" ry="5" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise2 12s ease-out infinite', animationDelay: '1s' }} />
        <ellipse cx="405" cy="84" rx="10" ry="3.5" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise2 12s ease-out infinite', animationDelay: '4s' }} />
        {/* Smoke wisp 3 — behind right section */}
        <ellipse cx="620" cy="90" rx="12" ry="4" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise1 11s ease-out infinite', animationDelay: '2s' }} />

        {/* NEW v4: Additional chimney smoke — more chimneys from fortress buildings */}
        <ellipse cx="280" cy="85" rx="8" ry="3" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise2 13s ease-out infinite', animationDelay: '6s' }} />
        <ellipse cx="520" cy="82" rx="9" ry="3.5" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise1 11.5s ease-out infinite', animationDelay: '4.5s' }} />
        <ellipse cx="730" cy="78" rx="7" ry="3" fill="#3a4048" filter="url(#ch12_smokeBlur)"
          style={{ animation: 'ch12_smokeRise2 12.5s ease-out infinite', animationDelay: '7s' }} />
      </g>

      {/* === RIGHT TOWER === */}
      <rect x="705" y="52" width="60" height="198" fill="url(#ch12_tower)" />
      <rect x="699" y="46" width="72" height="10" fill="#504a42" />
      <rect x="702" y="44" width="66" height="4" fill="#555048" />
      {/* Tower battlements */}
      <rect x="703" y="34" width="14" height="14" fill="#4a4540" />
      <rect x="725" y="34" width="14" height="14" fill="#4a4540" />
      <rect x="747" y="34" width="14" height="14" fill="#4a4540" />
      {/* Tower window */}
      <path d="M722 84 Q732 72 742 84 L742 108 L722 108 Z" fill="#12100c" />
      <path d="M722 84 Q732 72 742 84" fill="none" stroke="#555048" strokeWidth="1" />
      <line x1="732" y1="76" x2="732" y2="108" stroke="#3a3530" strokeWidth="0.8" />
      <rect x="725" y="144" width="14" height="10" fill="#12100c" rx="1" />
      {[70, 90, 110, 130, 150, 170, 190, 210, 230].map((y) => (
        <line key={`rt${y}`} x1="707" y1={y} x2="763" y2={y} stroke="#4a4538" strokeWidth="0.3" opacity="0.15" />
      ))}

      {/* === MAIN GATE — detailed arch === */}
      {/* Outer arch frame */}
      <path d="M335 250 Q400 178 465 250" fill="#302a25" />
      {/* Inner arch */}
      <path d="M342 250 Q400 185 458 250" fill="#12100c" />
      {/* Arch stones — voussoirs */}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = Math.PI * (i / 8);
        const cx = 400;
        const cy = 215;
        const innerR = 56;
        const outerR = 65;
        const x1 = cx - Math.cos(angle) * innerR;
        const y1 = cy - Math.sin(angle) * innerR + 35;
        const x2 = cx - Math.cos(angle) * outerR;
        const y2 = cy - Math.sin(angle) * outerR + 35;
        return (
          <line key={`arch${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#4a4538" strokeWidth="0.5" opacity="0.25" />
        );
      })}
      {/* Keystone at top of arch */}
      <path d="M396 188 L404 188 L405 195 L395 195 Z" fill="#555048" opacity="0.4" />
      {/* Gate doors — heavy timber, swung open */}
      <path d="M342 250 L348 215 L355 213 L350 250 Z" fill="#2a2218" opacity="0.7" />
      <path d="M458 250 L452 215 L445 213 L450 250 Z" fill="#2a2218" opacity="0.7" />
      {/* Door iron bands */}
      <line x1="344" y1="230" x2="352" y2="228" stroke="#3a3835" strokeWidth="1" opacity="0.4" />
      <line x1="346" y1="242" x2="351" y2="241" stroke="#3a3835" strokeWidth="1" opacity="0.4" />
      <line x1="456" y1="230" x2="448" y2="228" stroke="#3a3835" strokeWidth="1" opacity="0.4" />
      <line x1="454" y1="242" x2="449" y2="241" stroke="#3a3835" strokeWidth="1" opacity="0.4" />

      {/* NEW: Distant Austrian prisoners — deeper inside the gate, barely visible */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const px = 396 + col * 8 - row * 1;
        const py = 232 - row * 8;
        return (
          <React.Fragment key={`dpris${i}`}>
            <circle cx={px} cy={py - 2} r={1.5} fill="#1e1e1c" opacity={0.2 - row * 0.04} />
            <rect x={px - 1} y={py - 1} width={2.5} height={5} fill="#1e1e1c" opacity={0.15 - row * 0.03} rx="0.5" />
          </React.Fragment>
        );
      })}

      {/* NEW v2: Crowd of civilians — tiny figures watching from behind / inside the gate */}
      <g opacity="0.25">
        {/* Civilians huddled just inside the gate, peering out */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const cx = 378 + col * 12;
          const cy = 222 - row * 7;
          return (
            <React.Fragment key={`civ${i}`}>
              {/* Civilian head */}
              <circle cx={cx} cy={cy - 2} r={1.8} fill="#2a2a28" />
              {/* Body — varied clothing tones */}
              <rect x={cx - 1.2} y={cy - 0.5} width={2.5} height={5} fill={i % 2 === 0 ? '#252520' : '#2e2a25'} rx="0.5" />
            </React.Fragment>
          );
        })}
        {/* A few lighter figures — women in shawls/bonnets */}
        <circle cx="390" cy="216" r="1.5" fill="#3a3530" />
        <path d="M389 217 L391 217 L391 222 L389 222 Z" fill="#35302a" />
        <circle cx="402" cy="217" r="1.5" fill="#383530" />
        <path d="M401 218 L403 218 L403 223 L401 223 Z" fill="#333028" />
      </g>

      {/* Gate shadow interior */}
      <ellipse cx="400" cy="235" rx="40" ry="20" fill="url(#ch12_gateShadow)" />

      {/* Atmospheric haze across upper wall */}
      <rect x="50" y="100" width="700" height="40" fill="url(#ch12_haze)" />

      {/* === NEW v3: MOAT / DITCH — runs along base of fortress wall === */}
      <g>
        {/* Moat channel — dark water, partially frozen */}
        <path d="M0 244 Q100 246 200 244 Q300 247 400 245 Q500 246 600 244 Q700 247 800 245 L800 255 Q700 253 600 255 Q500 252 400 254 Q300 253 200 255 Q100 252 0 254 Z"
          fill="url(#ch12_moatWater)" opacity="0.5" />
        {/* Ice patches on moat surface */}
        <ellipse cx="150" cy="249" rx="30" ry="3" fill="#3a4858" opacity="0.12" />
        <ellipse cx="450" cy="250" rx="40" ry="3" fill="#3a4858" opacity="0.1" />
        <ellipse cx="650" cy="248" rx="25" ry="2.5" fill="#3a4858" opacity="0.11" />
        {/* Ice crack lines */}
        <path d="M130 249 L160 248 L170 250" fill="none" stroke="#5a6878" strokeWidth="0.3" opacity="0.08" />
        <path d="M430 250 L465 249 L480 251" fill="none" stroke="#5a6878" strokeWidth="0.3" opacity="0.07" />
        {/* Moat bank — near side, earthy slope */}
        <path d="M0 254 Q100 252 200 255 Q300 253 400 254 Q500 252 600 255 Q700 253 800 255 L800 258 Q700 256 600 258 Q500 255 400 257 Q300 256 200 258 Q100 255 0 257 Z"
          fill="#2a2820" opacity="0.5" />
        {/* Stone bridge/causeway at the gate — crossing the moat */}
        <rect x="360" y="244" width="80" height="12" fill="#3a3530" opacity="0.5" rx="1" />
        {/* Bridge stone joints */}
        <line x1="380" y1="244" x2="380" y2="256" stroke="#2e2a25" strokeWidth="0.5" opacity="0.2" />
        <line x1="400" y1="244" x2="400" y2="256" stroke="#2e2a25" strokeWidth="0.5" opacity="0.2" />
        <line x1="420" y1="244" x2="420" y2="256" stroke="#2e2a25" strokeWidth="0.5" opacity="0.2" />
      </g>

      {/* === GROUND === */}
      <path d="M0 250 Q100 247 200 249 Q300 251 400 250 Q500 248 600 250 Q700 249 800 250 L800 400 L0 400 Z"
        fill="url(#ch12_ground)" />

      {/* Frost shimmer on ground surface */}
      <rect x="0" y="248" width="800" height="6" fill="url(#ch12_frost)" />
      {/* Scattered frost patches */}
      <ellipse cx="130" cy="275" rx="35" ry="3" fill="#8095a5" opacity="0.04" />
      <ellipse cx="320" cy="310" rx="50" ry="4" fill="#8095a5" opacity="0.035" />
      <ellipse cx="580" cy="285" rx="40" ry="3" fill="#8095a5" opacity="0.04" />
      <ellipse cx="700" cy="330" rx="30" ry="2.5" fill="#8095a5" opacity="0.03" />
      <ellipse cx="200" cy="340" rx="45" ry="3" fill="#8095a5" opacity="0.035" />

      {/* NEW v2: Additional frost detail — rime on stones in foreground */}
      {/* White rime crystals on scattered stones near the road */}
      <g opacity="0.5">
        {/* Stone 1 with rime */}
        <ellipse cx="330" cy="335" rx="5" ry="3" fill="#2a2820" />
        <path d="M326 334 Q330 332 334 334" fill="none" stroke="#8aa0b5" strokeWidth="0.5" opacity="0.2" />
        {/* Stone 2 with rime */}
        <ellipse cx="470" cy="340" rx="4" ry="2.5" fill="#282620" />
        <path d="M467 339 Q470 337 473 339" fill="none" stroke="#8aa0b5" strokeWidth="0.5" opacity="0.18" />
        {/* Stone 3 with rime — near wagon */}
        <ellipse cx="160" cy="315" rx="3.5" ry="2" fill="#2a2820" />
        <path d="M157 314 Q160 312 163 314" fill="none" stroke="#8aa0b5" strokeWidth="0.4" opacity="0.2" />
        {/* Stone 4 — right side */}
        <ellipse cx="620" cy="325" rx="4.5" ry="2.5" fill="#282520" />
        <path d="M616 324 Q620 322 624 324" fill="none" stroke="#8aa0b5" strokeWidth="0.5" opacity="0.17" />
        {/* Stone 5 — near gate */}
        <ellipse cx="440" cy="265" rx="3" ry="1.8" fill="#2a2820" />
        <path d="M438 264 Q440 263 443 264" fill="none" stroke="#8aa0b5" strokeWidth="0.4" opacity="0.2" />
      </g>

      {/* Frozen puddle (original) */}
      <ellipse cx="480" cy="295" rx="20" ry="5" fill="#3a4550" opacity="0.12" />
      <ellipse cx="480" cy="294" rx="16" ry="3" fill="#4a5560" opacity="0.06" />

      {/* NEW: Additional frozen puddles reflecting grey sky */}
      {/* Puddle 2 — larger, near center road */}
      <ellipse cx="370" cy="320" rx="28" ry="6" fill="url(#ch12_iceReflect)" />
      <ellipse cx="370" cy="319" rx="22" ry="4" fill="#4a5868" opacity="0.08" />
      {/* Thin crack lines in ice */}
      <line x1="355" y1="320" x2="368" y2="318" stroke="#6a7888" strokeWidth="0.3" opacity="0.1" />
      <line x1="365" y1="322" x2="380" y2="319" stroke="#6a7888" strokeWidth="0.3" opacity="0.08" />

      {/* Puddle 3 — small, near left French soldiers */}
      <ellipse cx="220" cy="290" rx="14" ry="4" fill="url(#ch12_iceReflect)" />
      <ellipse cx="220" cy="289" rx="10" ry="2.5" fill="#4a5565" opacity="0.07" />

      {/* Puddle 4 — near supply wagon area */}
      <ellipse cx="120" cy="330" rx="18" ry="5" fill="url(#ch12_iceReflect)" />
      <ellipse cx="120" cy="329" rx="13" ry="3" fill="#4a5565" opacity="0.06" />
      <line x1="110" y1="330" x2="125" y2="328" stroke="#6a7888" strokeWidth="0.3" opacity="0.09" />

      {/* Puddle 5 — far right */}
      <ellipse cx="680" cy="310" rx="16" ry="4.5" fill="url(#ch12_iceReflect)" />
      <ellipse cx="680" cy="309" rx="12" ry="3" fill="#4a5868" opacity="0.07" />

      {/* NEW v2: Ice detail on puddles — glint highlights */}
      <line x1="474" y1="293" x2="486" y2="293" stroke="#a0b0c8" strokeWidth="0.3" opacity="0.08" />
      <line x1="362" y1="318" x2="378" y2="317" stroke="#a0b0c8" strokeWidth="0.3" opacity="0.07" />
      <line x1="216" y1="288" x2="224" y2="288" stroke="#a0b0c8" strokeWidth="0.3" opacity="0.08" />

      {/* NEW v4: Enhanced ice crystallization patterns — dendritic frost on puddles */}
      <g opacity="0.08">
        {/* Crystal patterns on large center puddle */}
        <circle cx="370" cy="320" r="12" fill="url(#ch12_iceCrystal)" />
        <path d="M370 310 L370 330" stroke="#a0b8d0" strokeWidth="0.3" />
        <path d="M360 320 L380 320" stroke="#a0b8d0" strokeWidth="0.3" />
        <path d="M363 313 L377 327" stroke="#a0b8d0" strokeWidth="0.2" />
        <path d="M377 313 L363 327" stroke="#a0b8d0" strokeWidth="0.2" />
        {/* Smaller crystals on other puddles */}
        <circle cx="480" cy="295" r="8" fill="url(#ch12_iceCrystal)" />
        <path d="M480 289 L480 301" stroke="#a0b8d0" strokeWidth="0.25" />
        <path d="M474 295 L486 295" stroke="#a0b8d0" strokeWidth="0.25" />
      </g>

      {/* NEW v3: Ground soil texture — patches of different earth tones for realism */}
      <ellipse cx="100" cy="300" rx="60" ry="15" fill="#201c14" opacity="0.12" />
      <ellipse cx="650" cy="310" rx="50" ry="12" fill="#1e1a12" opacity="0.1" />
      <ellipse cx="300" cy="350" rx="70" ry="18" fill="#221e15" opacity="0.08" />
      <ellipse cx="500" cy="360" rx="55" ry="14" fill="#201c14" opacity="0.1" />
      {/* Wheel ruts in the earth — from wagons and cannon */}
      <path d="M120 310 Q200 305 280 312 Q340 316 380 300" fill="none" stroke="#1a1810" strokeWidth="1.5" opacity="0.08" />
      <path d="M125 315 Q205 310 285 317 Q345 321 385 305" fill="none" stroke="#1a1810" strokeWidth="1.5" opacity="0.06" />

      {/* NEW v4: Mud and slush near moat — wet, churned ground from troop movement */}
      <ellipse cx="150" cy="258" rx="45" ry="8" fill="url(#ch12_mud)" />
      <ellipse cx="350" cy="260" rx="55" ry="10" fill="url(#ch12_mud)" />
      <ellipse cx="600" cy="259" rx="40" ry="7" fill="url(#ch12_mud)" />
      {/* Muddy bootprints near gate */}
      <ellipse cx="410" cy="272" rx="2.5" ry="4" fill="#1e1a15" opacity="0.06" />
      <ellipse cx="416" cy="274" rx="2.5" ry="4" fill="#1e1a15" opacity="0.06" />
      <ellipse cx="422" cy="276" rx="2.5" ry="4" fill="#1e1a15" opacity="0.05" />
      <ellipse cx="428" cy="278" rx="2.5" ry="4" fill="#1e1a15" opacity="0.05" />

      {/* NEW v4: Snow accumulation — drifts against walls and objects */}
      <ellipse cx="70" cy="252" rx="22" ry="3" fill="#9098a8" opacity="0.06" />
      <ellipse cx="750" cy="253" rx="18" ry="2.5" fill="#9098a8" opacity="0.05" />
      {/* Snow drift against wagon wheel */}
      <ellipse cx="105" cy="302" rx="8" ry="2" fill="#9098a8" opacity="0.05" />
      {/* Snow against barrel pile */}
      <ellipse cx="335" cy="281" rx="10" ry="2.5" fill="#9098a8" opacity="0.04" />

      {/* Road from gate — worn path */}
      <path d="M365 250 Q372 275 368 300 Q360 335 355 370 Q352 388 350 400"
        fill="none" stroke="#252018" strokeWidth="32" opacity="0.25" />
      <path d="M435 250 Q428 275 432 300 Q440 335 445 370 Q448 388 450 400"
        fill="none" stroke="#252018" strokeWidth="32" opacity="0.25" />
      {/* Road center — trampled earth */}
      <path d="M400 255 Q398 290 400 330 Q402 370 400 400"
        fill="none" stroke="#201a12" strokeWidth="18" opacity="0.15" />

      {/* NEW v3: Cobblestone texture on road — irregular stone pattern */}
      <g opacity="0.12">
        {/* Row 1 — near gate */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const cx = 375 + i * 8 + (i % 2) * 2;
          const cy = 262 + (i % 3) * 2;
          return <ellipse key={`cob1_${i}`} cx={cx} cy={cy} rx={3.5} ry={2.5} fill="#302a20" stroke="#3a3428" strokeWidth="0.3" />;
        })}
        {/* Row 2 */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const cx = 372 + i * 8 + ((i + 1) % 2) * 3;
          const cy = 274 + (i % 3) * 2;
          return <ellipse key={`cob2_${i}`} cx={cx} cy={cy} rx={3.8} ry={2.8} fill="#302a20" stroke="#3a3428" strokeWidth="0.3" />;
        })}
        {/* Row 3 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const cx = 368 + i * 8 + (i % 2) * 2;
          const cy = 288 + (i % 3) * 2;
          return <ellipse key={`cob3_${i}`} cx={cx} cy={cy} rx={4} ry={3} fill="#302a20" stroke="#3a3428" strokeWidth="0.3" />;
        })}
        {/* Row 4 — larger as road widens toward viewer */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const cx = 364 + i * 8.5 + ((i + 1) % 2) * 2;
          const cy = 304 + (i % 3) * 2;
          return <ellipse key={`cob4_${i}`} cx={cx} cy={cy} rx={4.2} ry={3.2} fill="#302a20" stroke="#3a3428" strokeWidth="0.3" />;
        })}
        {/* Row 5 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
          const cx = 358 + i * 9 + (i % 2) * 3;
          const cy = 322 + (i % 3) * 2;
          return <ellipse key={`cob5_${i}`} cx={cx} cy={cy} rx={4.5} ry={3.3} fill="#302a20" stroke="#3a3428" strokeWidth="0.3" />;
        })}
      </g>

      {/* === NEW v3: FRENCH GATE SENTRIES — two guards flanking the gate entrance === */}
      <g>
        {/* Left sentry — standing at attention */}
        <path d="M342 255 Q340 245 342 238 Q343 234 345 238 L347 254 Q346 260 345 266 L342 266 Z"
          fill="#15120e" opacity="0.75" />
        <circle cx="343" cy="234" r="3.5" fill="#15120e" opacity="0.75" />
        {/* Shako */}
        <rect x="341" y="228" width="4.5" height="4" fill="#15120e" opacity="0.7" rx="0.3" />
        {/* Musket upright */}
        <line x1="348" y1="232" x2="349" y2="268" stroke="#15120e" strokeWidth="1.2" opacity="0.5" />
        {/* Bayonet glint */}
        <line x1="348" y1="232" x2="347" y2="226" stroke="#5a5a60" strokeWidth="0.6" opacity="0.3" />

        {/* Right sentry — mirror position */}
        <path d="M455 255 Q453 245 455 238 Q456 234 458 238 L460 254 Q459 260 458 266 L455 266 Z"
          fill="#15120e" opacity="0.75" />
        <circle cx="456" cy="234" r="3.5" fill="#15120e" opacity="0.75" />
        <rect x="454" y="228" width="4.5" height="4" fill="#15120e" opacity="0.7" rx="0.3" />
        <line x1="461" y1="232" x2="462" y2="268" stroke="#15120e" strokeWidth="1.2" opacity="0.5" />
        <line x1="461" y1="232" x2="460" y2="226" stroke="#5a5a60" strokeWidth="0.6" opacity="0.3" />

        {/* Shadows beneath sentries */}
        <ellipse cx="344" cy="267" rx="5" ry="1.5" fill="#0a0808" opacity="0.12" />
        <ellipse cx="458" cy="267" rx="5" ry="1.5" fill="#0a0808" opacity="0.12" />
      </g>

      {/* === NEW v3: LOWERED AUSTRIAN FLAG — trampled/discarded near gate === */}
      <g opacity="0.45">
        {/* Broken flagpole — snapped, lying on ground */}
        <line x1="425" y1="285" x2="450" y2="278" stroke="#3a3225" strokeWidth="1.8" />
        <line x1="450" y1="278" x2="452" y2="276" stroke="#3a3225" strokeWidth="1.2" />
        {/* Austrian flag — white with red bars, crumpled on ground */}
        {/* Red top bar */}
        <path d="M432 282 Q438 279 445 281 Q448 280 450 278 L452 281 Q448 283 445 284 Q438 282 432 285 Z"
          fill="#5a2828" opacity="0.5" />
        {/* White center */}
        <path d="M432 285 Q438 282 445 284 Q448 283 452 281 L454 284 Q450 286 445 287 Q438 285 432 288 Z"
          fill="#5a5855" opacity="0.4" />
        {/* Red bottom bar */}
        <path d="M432 288 Q438 285 445 287 Q448 286 454 284 L456 287 Q452 289 445 290 Q438 288 432 291 Z"
          fill="#5a2828" opacity="0.45" />
        {/* Boot print on flag */}
        <ellipse cx="442" cy="285" rx="2.5" ry="1.5" fill="#1a1815" opacity="0.15" />
      </g>

      {/* === NEW: DISCARDED AUSTRIAN MUSKETS — stacked pile by gate === */}
      <g opacity="0.45">
        {/* Stack of muskets leaning against each other near the right side of gate */}
        {/* Musket A — leaning left */}
        <line x1="455" y1="258" x2="465" y2="248" stroke="#3a3225" strokeWidth="2" />
        <circle cx="465" cy="248" r="0.8" fill="#4a4540" opacity="0.6" />
        {/* Musket B — leaning right */}
        <line x1="462" y1="258" x2="453" y2="246" stroke="#3a3225" strokeWidth="2" />
        {/* Musket C — crossing */}
        <line x1="450" y1="260" x2="468" y2="250" stroke="#3a3225" strokeWidth="1.8" />
        {/* Musket D — angled back */}
        <line x1="458" y1="260" x2="460" y2="244" stroke="#3a3225" strokeWidth="1.6" />
        {/* Musket E — resting flat */}
        <line x1="448" y1="260" x2="472" y2="257" stroke="#3a3225" strokeWidth="1.5" />
        {/* Bayonet tips glinting */}
        <circle cx="453" cy="246" r="0.6" fill="#6a6a70" opacity="0.3" />
        <circle cx="460" cy="244" r="0.6" fill="#6a6a70" opacity="0.25" />
        <circle cx="468" cy="250" r="0.5" fill="#6a6a70" opacity="0.2" />
        {/* Base shadow under pile */}
        <ellipse cx="458" cy="261" rx="12" ry="2.5" fill="#0a0808" opacity="0.2" />

        {/* NEW v4: Frost on metal — rime ice on bayonets and barrels */}
        <line x1="464" y1="248" x2="466" y2="247" stroke="#a0b8d0" strokeWidth="0.3" opacity="0.12" />
        <line x1="452" y1="246" x2="454" y2="245" stroke="#a0b8d0" strokeWidth="0.3" opacity="0.1" />
        <line x1="459" y1="244" x2="461" y2="243" stroke="#a0b8d0" strokeWidth="0.3" opacity="0.11" />
      </g>

      {/* === NEW v2: SUPPLY BARRELS — casks being rolled out of the fortress gate === */}
      <g>
        {/* Barrel 1 — upright, just outside the gate */}
        <ellipse cx="350" cy="265" rx="6" ry="8" fill="url(#ch12_barrelWood)" opacity="0.6" />
        <ellipse cx="350" cy="258" rx="5.5" ry="2" fill="#3a3222" opacity="0.5" />
        {/* Iron bands */}
        <line x1="344" y1="261" x2="356" y2="261" stroke="#3a3838" strokeWidth="0.6" opacity="0.4" />
        <line x1="344" y1="269" x2="356" y2="269" stroke="#3a3838" strokeWidth="0.6" opacity="0.4" />

        {/* Barrel 2 — on its side, being rolled, near gate */}
        <ellipse cx="338" cy="275" rx="8" ry="5.5" fill="url(#ch12_barrelWood)" opacity="0.55" />
        <ellipse cx="331" cy="275" rx="2" ry="5" fill="#3a3222" opacity="0.4" />
        {/* Iron bands on side barrel */}
        <line x1="334" y1="270" x2="334" y2="280" stroke="#3a3838" strokeWidth="0.6" opacity="0.35" />
        <line x1="342" y1="270" x2="342" y2="280" stroke="#3a3838" strokeWidth="0.6" opacity="0.35" />

        {/* Barrel 3 — upright, further out */}
        <ellipse cx="325" cy="282" rx="5.5" ry="7" fill="url(#ch12_barrelWood)" opacity="0.5" />
        <ellipse cx="325" cy="276" rx="5" ry="1.8" fill="#3a3222" opacity="0.4" />
        <line x1="320" y1="279" x2="330" y2="279" stroke="#3a3838" strokeWidth="0.6" opacity="0.35" />
        <line x1="320" y1="286" x2="330" y2="286" stroke="#3a3838" strokeWidth="0.6" opacity="0.35" />

        {/* Shadow under barrels */}
        <ellipse cx="338" cy="280" rx="20" ry="3" fill="#0a0808" opacity="0.1" />
      </g>

      {/* === NEW v5: AUSTRIAN WHITE SURRENDER FLAGS — visible above prisoner column === */}
      <g>
        {/* White flag 1 — on a musket held upright by lead prisoner, near gate */}
        <line x1="394" y1="255" x2="394" y2="232" stroke="#3a3530" strokeWidth="1" opacity="0.5" />
        <g style={{ transformOrigin: '394px 232px', animation: 'ch12_whiteFlagWave 3s ease-in-out infinite' }}>
          <path d="M394 232 Q400 230 404 233 Q400 236 394 234 Z" fill="#6a6a62" opacity="0.55" />
          <path d="M394 234 Q400 232 404 235 Q400 238 394 236 Z" fill="#5a5a52" opacity="0.45" />
        </g>

        {/* White flag 2 — further back in column, partially obscured */}
        <line x1="402" y1="268" x2="402" y2="248" stroke="#3a3530" strokeWidth="0.8" opacity="0.4" />
        <g style={{ transformOrigin: '402px 248px', animation: 'ch12_whiteFlagWave 3.5s ease-in-out infinite', animationDelay: '0.8s' }}>
          <path d="M402 248 Q407 246 411 249 Q407 252 402 250 Z" fill="#6a6a62" opacity="0.4" />
        </g>

        {/* White flag 3 — deep in column, small and distant */}
        <line x1="398" y1="282" x2="398" y2="266" stroke="#3a3530" strokeWidth="0.7" opacity="0.35" />
        <g style={{ transformOrigin: '398px 266px', animation: 'ch12_whiteFlagWave 4s ease-in-out infinite', animationDelay: '1.5s' }}>
          <path d="M398 266 Q402 265 405 267 Q402 269 398 268 Z" fill="#6a6a62" opacity="0.35" />
        </g>
      </g>

      {/* === NEW v5: DROPPED CARTRIDGE BOXES AND EQUIPMENT TRAIL === */}
      <g opacity="0.35">
        {/* Cartridge box 1 — leather pouch, dropped near gate */}
        <rect x="376" y="278" width="5" height="4" fill="#1e1a15" rx="0.5" />
        <rect x="377" y="277" width="3" height="1.5" fill="#2a2520" rx="0.3" />
        {/* Scattered cartridge papers */}
        <rect x="372" y="280" width="2" height="1.5" fill="#5a5850" opacity="0.4" rx="0.2" />
        <rect x="375" y="283" width="1.5" height="1.2" fill="#5a5850" opacity="0.35" rx="0.2" />

        {/* Cartridge box 2 — further along road */}
        <rect x="407" y="295" width="5.5" height="4.5" fill="#1e1a15" rx="0.5" />
        <path d="M408 295 L412 295" stroke="#2a2520" strokeWidth="0.5" />

        {/* Dropped water canteen */}
        <ellipse cx="420" cy="290" rx="3" ry="2.5" fill="#2a2820" />
        <line x1="420" y1="287" x2="423" y2="285" stroke="#3a3530" strokeWidth="0.5" />

        {/* Austrian crossbelt — white leather strap, discarded */}
        <path d="M390 292 Q395 290 400 293 Q405 291 410 294" fill="none" stroke="#5a5a55" strokeWidth="0.8" />

        {/* Loose musket balls — tiny spheres scattered on cobbles */}
        <circle cx="395" cy="298" r="0.8" fill="#3a3a3e" />
        <circle cx="399" cy="300" r="0.7" fill="#3a3a3e" />
        <circle cx="392" cy="302" r="0.9" fill="#3a3a3e" />
        <circle cx="405" cy="297" r="0.7" fill="#3a3a3e" />
      </g>

      {/* === SURRENDERING AUSTRIAN COLUMN — emerging from gate === */}
      {/* White-uniformed figures in pairs, heads bowed */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const baseX = 390 + col * 14 - row * 1;
        const baseY = 254 + row * 14;
        const opacity = 0.55 - row * 0.04;
        const scale = 1 - row * 0.03;
        return (
          <React.Fragment key={`aus${i}`}>
            {/* Body */}
            <path
              d={`M${baseX} ${baseY + 12 * scale} Q${baseX - 1} ${baseY + 4 * scale} ${baseX} ${baseY} Q${baseX + 2} ${baseY + 4 * scale} ${baseX + 4 * scale} ${baseY + 12 * scale} Z`}
              fill="#4a4a48" opacity={opacity}
            />
            {/* Head — bowed */}
            <circle cx={baseX + 1} cy={baseY - 2 * scale} r={2.8 * scale} fill="#4a4a48" opacity={opacity} />
          </React.Fragment>
        );
      })}

      {/* NEW: Austrian prisoner column — 6 hunched figures marching through the gate */}
      {/* These are larger/closer, on the road emerging toward viewer */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const px = 393 + col * 16 + row * 2;
        const py = 278 + row * 18;
        const sc = 1 + row * 0.06;
        const op = 0.6 + row * 0.04;
        return (
          <React.Fragment key={`pris${i}`}>
            {/* Hunched body — white Austrian uniform, dirty/worn */}
            <path
              d={`M${px} ${py + 14 * sc} Q${px - 2} ${py + 5 * sc} ${px - 1} ${py} Q${px + 2} ${py - 1} ${px + 4 * sc} ${py} Q${px + 5 * sc} ${py + 5 * sc} ${px + 4 * sc} ${py + 14 * sc} Z`}
              fill="#555550" opacity={op * 0.7}
            />
            {/* Head — bowed forward (dejected) */}
            <circle cx={px + 2 * sc} cy={py - 3 * sc} r={3 * sc} fill="#484845" opacity={op * 0.7} />
            {/* Hunched shoulders exaggerated */}
            <path
              d={`M${px - 1} ${py + 2} Q${px + 2} ${py - 1} ${px + 5 * sc} ${py + 2}`}
              fill="none" stroke="#4a4a45" strokeWidth={1.2 * sc} opacity={op * 0.4}
            />
          </React.Fragment>
        );
      })}

      {/* Figures still in gate shadow — barely visible */}
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={`gaus${i}`}>
          <circle cx={394 + (i % 2) * 10} cy={248 - Math.floor(i / 2) * 6} r={2}
            fill="#2a2a28" opacity={0.25} />
          <rect x={393 + (i % 2) * 10} y={249 - Math.floor(i / 2) * 6} width={3} height={6}
            fill="#2a2a28" opacity={0.2} />
        </React.Fragment>
      ))}

      {/* === NEW v2: AUSTRIAN OFFICER'S SWORD SURRENDER === */}
      {/* Austrian officer offering ceremonial sword to French officer, right of gate */}
      <g opacity="0.65">
        {/* Austrian officer — white coat, hat off, bowing */}
        <path d="M468 258 Q466 248 468 240 Q469 236 471 240 L473 256 Q472 262 471 268 L468 268 Z"
          fill="#555550" />
        <circle cx="469" cy="236" r="4" fill="#504e48" />
        {/* Bowing posture — head tilted forward */}
        <path d="M467 240 Q469 238 471 240" fill="none" stroke="#4a4845" strokeWidth="1" opacity="0.5" />
        {/* Arms extended — offering sword */}
        <line x1="472" y1="245" x2="480" y2="240" stroke="#555550" strokeWidth="1.5" opacity="0.6" />
        {/* Ceremonial sword — ornate, horizontal offering */}
        <line x1="478" y1="240" x2="498" y2="238" stroke="#6a6a72" strokeWidth="1.2" opacity="0.55" />
        {/* Sword guard — crosspiece */}
        <line x1="478" y1="237" x2="478" y2="243" stroke="#5a5a60" strokeWidth="1" opacity="0.5" />
        {/* Sword grip / pommel */}
        <circle cx="476" cy="241" r="1.2" fill="#5a5550" opacity="0.45" />
        {/* Blade glint */}
        <line x1="485" y1="239" x2="492" y2="238" stroke="#8a8a90" strokeWidth="0.4" opacity="0.25" />

        {/* French officer — receiving, standing upright */}
        <path d="M500 256 Q498 244 500 236 Q501 232 503 236 L505 254 Q504 260 503 266 L500 266 Z"
          fill="#15120e" />
        <circle cx="501" cy="232" r="4.2" fill="#15120e" />
        {/* Bicorne hat */}
        <path d="M496 230 Q501 227 506 230" fill="none" stroke="#15120e" strokeWidth="1.8" opacity="0.7" />
        {/* Arm reaching toward sword */}
        <line x1="499" y1="242" x2="490" y2="239" stroke="#15120e" strokeWidth="1.5" opacity="0.6" />
      </g>

      {/* === DISCARDED AUSTRIAN WEAPONS ON GROUND === */}
      {/* Musket 1 — dropped near gate */}
      <line x1="360" y1="268" x2="380" y2="274" stroke="#3a3530" strokeWidth="1.5" opacity="0.4" />
      <circle cx="380" cy="274" r="1" fill="#3a3530" opacity="0.3" />
      {/* Musket 2 — angled */}
      <line x1="420" y1="275" x2="445" y2="270" stroke="#3a3530" strokeWidth="1.5" opacity="0.35" />
      {/* Musket 3 — further out */}
      <line x1="370" y1="290" x2="392" y2="288" stroke="#3a3530" strokeWidth="1.2" opacity="0.3" />
      {/* Sword / sabre */}
      <line x1="430" y1="282" x2="442" y2="278" stroke="#5a5855" strokeWidth="1" opacity="0.3" />
      <circle cx="430" cy="282" r="1.5" fill="#5a5855" opacity="0.25" />
      {/* Austrian shako (hat) */}
      <ellipse cx="415" cy="273" rx="4" ry="2.5" fill="#3a3a38" opacity="0.3" />
      <rect x="413" y="269" width="5" height="4" fill="#3a3a38" opacity="0.25" rx="1" />
      {/* Another hat further along */}
      <ellipse cx="385" cy="296" rx="3.5" ry="2" fill="#3a3a38" opacity="0.25" />

      {/* === BARE WINTER TREES === */}

      {/* Tree 1 — left, large */}
      <path d="M140 252 Q142 225 144 195 Q145 180 146 170" fill="none" stroke="#2a2822" strokeWidth="3" />
      <path d="M146 170 Q155 152 160 158" fill="none" stroke="#2a2822" strokeWidth="1.5" />
      <path d="M146 170 Q138 155 135 162" fill="none" stroke="#2a2822" strokeWidth="1.3" />
      <path d="M146 170 Q150 158 153 155 Q156 148 158 150" fill="none" stroke="#2a2822" strokeWidth="1" />
      <path d="M143 195 Q132 182 128 188" fill="none" stroke="#2a2822" strokeWidth="1" />
      <path d="M143 195 Q150 185 155 180 Q158 175 160 177" fill="none" stroke="#2a2822" strokeWidth="0.8" />
      <path d="M142 215 Q134 205 130 210" fill="none" stroke="#2a2822" strokeWidth="0.8" />
      <path d="M142 215 Q148 208 152 205" fill="none" stroke="#2a2822" strokeWidth="0.7" />
      {/* Root spread */}
      <path d="M138 252 Q132 254 128 253" fill="none" stroke="#2a2822" strokeWidth="1.5" opacity="0.5" />
      <path d="M144 252 Q150 254 154 253" fill="none" stroke="#2a2822" strokeWidth="1.2" opacity="0.4" />

      {/* NEW v2: Frost / rime on tree 1 branches — delicate white highlights */}
      <g opacity="0.15">
        <path d="M146 170 Q155 152 160 158" fill="none" stroke="#a0b8d0" strokeWidth="0.6" />
        <path d="M146 170 Q138 155 135 162" fill="none" stroke="#a0b8d0" strokeWidth="0.5" />
        <path d="M143 195 Q132 182 128 188" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
        <path d="M143 195 Q150 185 155 180" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
      </g>

      {/* Tree 2 — right side */}
      <path d="M660 250 Q662 222 664 195 Q665 182 666 175" fill="none" stroke="#2a2822" strokeWidth="2.5" />
      <path d="M666 175 Q672 160 676 166" fill="none" stroke="#2a2822" strokeWidth="1.2" />
      <path d="M666 175 Q658 162 655 168" fill="none" stroke="#2a2822" strokeWidth="1.1" />
      <path d="M666 175 Q670 163 673 158" fill="none" stroke="#2a2822" strokeWidth="0.8" />
      <path d="M663 200 Q654 190 650 195" fill="none" stroke="#2a2822" strokeWidth="0.9" />
      <path d="M663 200 Q670 192 674 188" fill="none" stroke="#2a2822" strokeWidth="0.7" />
      <path d="M662 220 Q656 214 652 218" fill="none" stroke="#2a2822" strokeWidth="0.7" />

      {/* NEW v2: Frost / rime on tree 2 branches */}
      <g opacity="0.14">
        <path d="M666 175 Q672 160 676 166" fill="none" stroke="#a0b8d0" strokeWidth="0.5" />
        <path d="M666 175 Q658 162 655 168" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
        <path d="M663 200 Q654 190 650 195" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
      </g>

      {/* NEW v2: Crow on tree 2 — perched on upper-right branch */}
      <g opacity="0.7">
        {/* Body — plump black bird shape */}
        <path d="M673 157 Q676 155 678 157 Q679 160 677 162 Q674 163 672 161 Q671 159 673 157 Z"
          fill="#0e0e10" />
        {/* Head */}
        <circle cx="679" cy="155" r="1.8" fill="#0e0e10" />
        {/* Beak */}
        <path d="M680.5 155 L683 154.5 L681 156 Z" fill="#2a2828" />
        {/* Eye */}
        <circle cx="679.8" cy="154.5" r="0.4" fill="#3a3a3a" />
        {/* Tail feathers — fanned */}
        <path d="M672 161 Q669 160 668 158" fill="none" stroke="#0e0e10" strokeWidth="1" />
        <path d="M672 162 Q669 162 667 161" fill="none" stroke="#0e0e10" strokeWidth="0.8" />
        {/* Legs gripping branch */}
        <line x1="675" y1="162" x2="674" y2="164" stroke="#1a1a1a" strokeWidth="0.5" />
        <line x1="677" y1="162" x2="676" y2="164" stroke="#1a1a1a" strokeWidth="0.5" />
      </g>

      {/* Tree 3 — far left, smaller/more distant */}
      <path d="M60 253 Q62 235 63 220" fill="none" stroke="#252320" strokeWidth="1.8" opacity="0.6" />
      <path d="M63 220 Q68 210 70 214" fill="none" stroke="#252320" strokeWidth="0.8" opacity="0.6" />
      <path d="M63 220 Q58 212 56 216" fill="none" stroke="#252320" strokeWidth="0.7" opacity="0.6" />
      <path d="M62 235 Q56 228 54 232" fill="none" stroke="#252320" strokeWidth="0.6" opacity="0.5" />

      {/* NEW v2: Frost on tree 3 */}
      <g opacity="0.1">
        <path d="M63 220 Q68 210 70 214" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
        <path d="M63 220 Q58 212 56 216" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
      </g>

      {/* Tree 4 — far right, stunted */}
      <path d="M740 252 Q742 238 743 225" fill="none" stroke="#252320" strokeWidth="1.5" opacity="0.55" />
      <path d="M743 225 Q748 218 750 222" fill="none" stroke="#252320" strokeWidth="0.7" opacity="0.55" />
      <path d="M743 225 Q738 219 736 223" fill="none" stroke="#252320" strokeWidth="0.6" opacity="0.5" />

      {/* === NEW v3: BUSHES AND DEAD VEGETATION === */}

      {/* Bush cluster 1 — base of tree 1 (left) */}
      <g opacity="0.4">
        <ellipse cx="135" cy="254" rx="10" ry="5" fill="#1e2218" />
        <ellipse cx="148" cy="255" rx="8" ry="4" fill="#1a2015" />
        <ellipse cx="128" cy="256" rx="6" ry="3.5" fill="#222618" />
        {/* Bare twigs poking out */}
        <path d="M130 252 Q128 247 126 245" fill="none" stroke="#2a2820" strokeWidth="0.5" />
        <path d="M140 251 Q142 246 143 244" fill="none" stroke="#2a2820" strokeWidth="0.4" />
        <path d="M150 253 Q154 248 155 246" fill="none" stroke="#2a2820" strokeWidth="0.4" />
      </g>

      {/* Bush cluster 2 — near right tower base */}
      <g opacity="0.35">
        <ellipse cx="700" cy="254" rx="9" ry="4.5" fill="#1e2218" />
        <ellipse cx="712" cy="255" rx="7" ry="3.5" fill="#1a2015" />
        {/* Dead bramble */}
        <path d="M695 252 Q692 248 690 246" fill="none" stroke="#2a2820" strokeWidth="0.4" />
        <path d="M706 251 Q708 247 710 245" fill="none" stroke="#2a2820" strokeWidth="0.4" />
      </g>

      {/* Bush cluster 3 — along wall base, left side */}
      <g opacity="0.3">
        <ellipse cx="80" cy="253" rx="12" ry="4" fill="#1e2218" />
        <ellipse cx="95" cy="254" rx="7" ry="3" fill="#1a2015" />
        <path d="M75 251 Q72 247 70 244" fill="none" stroke="#2a2820" strokeWidth="0.4" />
      </g>

      {/* Dead grass tufts — scattered around the ground */}
      <g opacity="0.2">
        {/* Tuft 1 */}
        <path d="M180 260 Q178 254 176 250" fill="none" stroke="#3a3828" strokeWidth="0.8" />
        <path d="M180 260 Q182 255 184 252" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M180 260 Q180 254 180 249" fill="none" stroke="#3a3828" strokeWidth="0.6" />
        {/* Tuft 2 */}
        <path d="M550 262 Q548 256 546 253" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M550 262 Q552 257 554 254" fill="none" stroke="#3a3828" strokeWidth="0.6" />
        {/* Tuft 3 */}
        <path d="M310 268 Q308 263 306 260" fill="none" stroke="#3a3828" strokeWidth="0.6" />
        <path d="M310 268 Q312 264 314 261" fill="none" stroke="#3a3828" strokeWidth="0.6" />
        {/* Tuft 4 — near road */}
        <path d="M440 270 Q438 265 436 262" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M440 270 Q442 266 444 263" fill="none" stroke="#3a3828" strokeWidth="0.6" />
        {/* Tuft 5 — far right */}
        <path d="M720 258 Q718 253 716 250" fill="none" stroke="#3a3828" strokeWidth="0.6" />
        <path d="M720 258 Q722 254 724 251" fill="none" stroke="#3a3828" strokeWidth="0.5" />
      </g>

      {/* === NEW: SUPPLY WAGON — near the French soldiers on left === */}
      <g>
        {/* Wagon body */}
        <rect x="100" y="278" width="50" height="18" fill="url(#ch12_wagonWood)" opacity="0.7" rx="1" />
        {/* Wagon side planks */}
        <line x1="100" y1="284" x2="150" y2="284" stroke="#2a2015" strokeWidth="0.6" opacity="0.4" />
        <line x1="100" y1="290" x2="150" y2="290" stroke="#2a2015" strokeWidth="0.6" opacity="0.4" />
        {/* Canvas cover — arched tarp over provisions */}
        <path d="M98 278 Q110 265 125 262 Q140 265 152 278" fill="url(#ch12_wagonCanvas)" opacity="0.6" />
        <path d="M98 278 Q110 265 125 262 Q140 265 152 278" fill="none" stroke="#35332a" strokeWidth="0.5" opacity="0.4" />
        {/* Canvas rope ties */}
        <line x1="108" y1="272" x2="108" y2="278" stroke="#3a3528" strokeWidth="0.5" opacity="0.35" />
        <line x1="125" y1="262" x2="125" y2="278" stroke="#3a3528" strokeWidth="0.5" opacity="0.3" />
        <line x1="142" y1="272" x2="142" y2="278" stroke="#3a3528" strokeWidth="0.5" opacity="0.35" />
        {/* Wagon tongue / shaft — extends forward */}
        <line x1="100" y1="288" x2="80" y2="294" stroke="#2a2018" strokeWidth="2" opacity="0.5" />
        <line x1="100" y1="292" x2="82" y2="297" stroke="#2a2018" strokeWidth="1.5" opacity="0.45" />
        {/* Left wheel */}
        <circle cx="108" cy="298" r="8" fill="none" stroke="#2a2018" strokeWidth="2" opacity="0.6" />
        <circle cx="108" cy="298" r="2" fill="#2a2018" opacity="0.5" />
        {/* Wheel spokes */}
        <line x1="108" y1="290" x2="108" y2="306" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="100" y1="298" x2="116" y2="298" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="102" y1="292" x2="114" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        <line x1="114" y1="292" x2="102" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        {/* Right wheel */}
        <circle cx="142" cy="298" r="8" fill="none" stroke="#2a2018" strokeWidth="2" opacity="0.6" />
        <circle cx="142" cy="298" r="2" fill="#2a2018" opacity="0.5" />
        <line x1="142" y1="290" x2="142" y2="306" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="134" y1="298" x2="150" y2="298" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="136" y1="292" x2="148" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        <line x1="148" y1="292" x2="136" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        {/* Provisions peeking out — sacks */}
        <ellipse cx="115" cy="277" rx="6" ry="3" fill="#3a3528" opacity="0.35" />
        <ellipse cx="130" cy="276" rx="5" ry="3.5" fill="#35302a" opacity="0.3" />
        {/* Ground shadow under wagon */}
        <ellipse cx="125" cy="306" rx="30" ry="4" fill="#0a0808" opacity="0.15" />

        {/* NEW v3: Draft horse — hitched to wagon shaft */}
        {/* Horse body — sturdy draft horse, dark brown */}
        <path d="M60 278 Q68 272 76 274 Q82 276 85 280 L86 290 Q84 294 80 296 L74 296 Q70 294 66 296 L62 296 Q58 294 56 290 Q54 284 56 278 Z"
          fill="#1e1a15" opacity="0.7" />
        {/* Horse legs */}
        <line x1="62" y1="296" x2="60" y2="310" stroke="#1e1a15" strokeWidth="1.8" opacity="0.6" />
        <line x1="66" y1="296" x2="65" y2="310" stroke="#1e1a15" strokeWidth="1.8" opacity="0.6" />
        <line x1="76" y1="296" x2="77" y2="310" stroke="#1e1a15" strokeWidth="1.8" opacity="0.6" />
        <line x1="80" y1="296" x2="82" y2="310" stroke="#1e1a15" strokeWidth="1.8" opacity="0.6" />
        {/* Horse head/neck — head lowered, resting */}
        <path d="M85 280 Q92 274 96 270 Q98 268 96 272 Q94 276 90 280"
          fill="none" stroke="#1e1a15" strokeWidth="2.5" opacity="0.7" />
        {/* Horse ear */}
        <path d="M96 268 Q97 265 96 267" fill="none" stroke="#1e1a15" strokeWidth="1" opacity="0.6" />
        {/* Horse tail */}
        <path d="M56 278 Q50 280 48 284" fill="none" stroke="#1e1a15" strokeWidth="1.2" opacity="0.5" />
        {/* Harness lines connecting to wagon shaft */}
        <line x1="82" y1="288" x2="100" y2="292" stroke="#2a2218" strokeWidth="0.8" opacity="0.4" />
        <line x1="76" y1="290" x2="100" y2="294" stroke="#2a2218" strokeWidth="0.8" opacity="0.4" />
        {/* Horse breath — cold air */}
        <ellipse cx="100" cy="268" rx="4" ry="2" fill="#6a7580" filter="url(#ch12_breathBlur)" opacity="0.05"
          style={{ animation: 'ch12_breathPulse1 4s ease-out infinite', animationDelay: '1s' }} />
        {/* Shadow beneath horse */}
        <ellipse cx="70" cy="312" rx="16" ry="3" fill="#0a0808" opacity="0.12" />
      </g>

      {/* === NEW v2: ABANDONED AUSTRIAN CANNON — being wheeled away as spoils === */}
      <g opacity="0.6">
        {/* Cannon carriage / trail — wooden frame */}
        <path d="M60 340 L90 330 L92 326 L62 336 Z" fill="#2a2218" />
        {/* Carriage side brace */}
        <line x1="72" y1="338" x2="72" y2="330" stroke="#2a2218" strokeWidth="1.5" />
        <line x1="82" y1="335" x2="82" y2="328" stroke="#2a2218" strokeWidth="1.5" />
        {/* Barrel — dark iron tube, angled slightly up */}
        <path d="M88 328 Q95 325 108 322 Q112 321 114 322 Q112 323 108 324 Q95 327 88 330 Z"
          fill="url(#ch12_cannonMetal)" />
        {/* Barrel muzzle ring */}
        <ellipse cx="114" cy="322" rx="1.5" ry="2" fill="#32323a" opacity="0.6" />
        {/* Trunnion — barrel mount point */}
        <circle cx="92" cy="327" r="2" fill="#2a2a30" />

        {/* NEW v4: Frost on cannon metal — ice crystals on iron barrel */}
        <line x1="90" y1="328" x2="105" y2="323" stroke="#a0b8d0" strokeWidth="0.4" opacity="0.08" />
        <circle cx="94" cy="327" r="1" fill="#a0b8d0" opacity="0.05" />
        <circle cx="102" cy="324" r="0.8" fill="#a0b8d0" opacity="0.06" />
        {/* Left wheel */}
        <circle cx="78" cy="340" r="7" fill="none" stroke="#2a2018" strokeWidth="2" />
        <circle cx="78" cy="340" r="1.8" fill="#2a2018" opacity="0.6" />
        <line x1="78" y1="333" x2="78" y2="347" stroke="#2a2018" strokeWidth="0.7" opacity="0.4" />
        <line x1="71" y1="340" x2="85" y2="340" stroke="#2a2018" strokeWidth="0.7" opacity="0.4" />
        {/* Right wheel (partially hidden) */}
        <circle cx="88" cy="338" r="7" fill="none" stroke="#2a2018" strokeWidth="1.8" opacity="0.5" />
        <circle cx="88" cy="338" r="1.8" fill="#2a2018" opacity="0.4" />

        {/* French soldier wheeling it — pulling the trail */}
        <path d="M52 336 Q50 326 52 320 Q53 316 55 320 L57 334 Q56 340 55 346 L52 346 Z"
          fill="#15120e" />
        <circle cx="53" cy="316" r="3.5" fill="#15120e" />
        {/* Shako */}
        <rect x="51" y="310" width="4.5" height="4" fill="#15120e" rx="0.3" />
        {/* Arms reaching back to trail */}
        <line x1="56" y1="324" x2="62" y2="336" stroke="#15120e" strokeWidth="1.5" opacity="0.6" />

        {/* Second soldier pushing from behind */}
        <path d="M96 332 Q94 322 96 316 Q97 312 99 316 L101 330 Q100 336 99 342 L96 342 Z"
          fill="#15120e" opacity="0.55" />
        <circle cx="97" cy="312" r="3.2" fill="#15120e" opacity="0.55" />
        {/* Arms pushing cannon */}
        <line x1="95" y1="320" x2="90" y2="328" stroke="#15120e" strokeWidth="1.2" opacity="0.45" />

        {/* Shadow beneath cannon */}
        <ellipse cx="80" cy="347" rx="22" ry="3" fill="#0a0808" opacity="0.12" />
      </g>

      {/* === FRENCH SOLDIERS — worn but proud === */}

      {/* Soldier 1 — standing at attention, near left */}
      <path d="M210 240 Q208 226 210 218 Q212 212 214 218 L216 240 Q215 250 214 258 L210 258 Z"
        fill="#15120e" opacity="0.85" />
      <circle cx="212" cy="212" r="5" fill="#15120e" opacity="0.85" />
      {/* Shako silhouette */}
      <rect x="209" y="204" width="6" height="5" fill="#15120e" opacity="0.8" rx="0.5" />
      {/* Musket upright */}
      <line x1="218" y1="210" x2="220" y2="260" stroke="#15120e" strokeWidth="1.5" opacity="0.6" />
      {/* Bayonet */}
      <line x1="218" y1="210" x2="217" y2="203" stroke="#4a4a50" strokeWidth="0.8" opacity="0.4" />

      {/* Soldier 2 — standing, slightly turned */}
      <path d="M235 242 Q233 230 235 222 Q237 216 239 222 L241 242 Q240 252 239 260 L235 260 Z"
        fill="#15120e" opacity="0.8" />
      <circle cx="237" cy="216" r="4.8" fill="#15120e" opacity="0.8" />
      <rect x="234" y="208" width="6" height="5" fill="#15120e" opacity="0.75" rx="0.5" />

      {/* Soldier 3 — leaning on musket, fatigued */}
      <path d="M260 244 Q257 232 258 224 Q260 218 262 224 L264 242 Q263 250 262 260 L260 260 Z"
        fill="#15120e" opacity="0.78" />
      <circle cx="261" cy="218" r="4.5" fill="#15120e" opacity="0.78" />
      {/* Musket used as crutch — angled */}
      <line x1="256" y1="220" x2="252" y2="262" stroke="#15120e" strokeWidth="1.5" opacity="0.55" />

      {/* Soldier 4 — seated on ground, resting */}
      <path d="M555 268 Q553 258 555 250 Q557 258 559 268 Z" fill="#15120e" opacity="0.72" />
      <circle cx="556" cy="247" r="4.2" fill="#15120e" opacity="0.72" />
      {/* Outstretched legs */}
      <path d="M553 268 Q548 275 543 278" fill="none" stroke="#15120e" strokeWidth="2" opacity="0.5" />
      <path d="M557 268 Q562 275 567 276" fill="none" stroke="#15120e" strokeWidth="2" opacity="0.5" />

      {/* Soldier 5 — standing right side */}
      <path d="M580 240 Q578 228 580 220 Q582 214 584 220 L586 240 Q585 250 584 258 L580 258 Z"
        fill="#15120e" opacity="0.75" />
      <circle cx="582" cy="214" r="4.5" fill="#15120e" opacity="0.75" />
      <line x1="588" y1="212" x2="590" y2="260" stroke="#15120e" strokeWidth="1.3" opacity="0.5" />

      {/* Soldier 6 — standing, arms crossed */}
      <path d="M605 242 Q603 230 605 222 Q607 216 609 222 L611 242 Q610 250 609 258 L605 258 Z"
        fill="#15120e" opacity="0.73" />
      <circle cx="607" cy="216" r="4.3" fill="#15120e" opacity="0.73" />
      {/* Crossed arms suggestion */}
      <path d="M602 232 Q607 230 612 232" fill="none" stroke="#15120e" strokeWidth="2" opacity="0.45" />

      {/* Soldier 7 — foreground left, larger (closer to viewer) */}
      <path d="M170 270 Q167 252 170 240 Q173 232 176 240 L179 270 Q178 282 176 292 L170 292 Z"
        fill="#12100c" opacity="0.85" />
      <circle cx="173" cy="232" r="6" fill="#12100c" opacity="0.85" />
      <rect x="169" y="222" width="7" height="6" fill="#12100c" opacity="0.8" rx="0.5" />
      <line x1="181" y1="230" x2="184" y2="295" stroke="#12100c" strokeWidth="1.8" opacity="0.6" />

      {/* Soldier 8 — foreground right, back to viewer */}
      <path d="M630 272 Q627 254 630 244 Q633 236 636 244 L639 272 Q638 284 636 294 L630 294 Z"
        fill="#12100c" opacity="0.82" />
      <circle cx="633" cy="236" r="5.5" fill="#12100c" opacity="0.82" />
      <rect x="630" y="227" width="6" height="6" fill="#12100c" opacity="0.78" rx="0.5" />

      {/* === DRUMMER BOY — small figure with drum === */}
      <path d="M290 248 Q288 238 290 232 Q291 228 293 232 L295 248 Q294 255 293 260 L290 260 Z"
        fill="#15120e" opacity="0.78" />
      <circle cx="292" cy="228" r="3.8" fill="#15120e" opacity="0.78" />
      {/* Drum — cylindrical shape at side */}
      <ellipse cx="298" cy="242" rx="5" ry="4" fill="#3a2a1a" opacity="0.5" />
      <ellipse cx="298" cy="240" rx="5" ry="3" fill="#4a3a28" opacity="0.45" />
      {/* Drumstick */}
      <line x1="296" y1="235" x2="302" y2="240" stroke="#4a4038" strokeWidth="0.8" opacity="0.4" />

      {/* === NEW v2: STACKED DRUMS — military drums stacked near French line === */}
      <g opacity="0.55">
        {/* Bottom drum — lying on its side */}
        <ellipse cx="248" cy="272" rx="7" ry="5" fill="#3a2a1a" />
        <ellipse cx="242" cy="272" rx="2" ry="4.5" fill="#4a3a28" opacity="0.6" />
        {/* Drum shell detail — rope tension lines */}
        <line x1="244" y1="268" x2="252" y2="268" stroke="#2a2015" strokeWidth="0.4" opacity="0.5" />
        <line x1="244" y1="276" x2="252" y2="276" stroke="#2a2015" strokeWidth="0.4" opacity="0.5" />
        {/* V-rope pattern across shell */}
        <path d="M244 268 L248 272 L244 276" fill="none" stroke="#322818" strokeWidth="0.4" opacity="0.4" />
        <path d="M248 268 L252 272 L248 276" fill="none" stroke="#322818" strokeWidth="0.4" opacity="0.4" />

        {/* Second drum — stacked on top, slightly tilted */}
        <ellipse cx="250" cy="264" rx="6.5" ry="4.5" fill="#382818" />
        <ellipse cx="244" cy="264" rx="1.8" ry="4" fill="#483828" opacity="0.55" />
        <line x1="246" y1="260" x2="254" y2="260" stroke="#2a2015" strokeWidth="0.4" opacity="0.45" />
        <line x1="246" y1="268" x2="254" y2="268" stroke="#2a2015" strokeWidth="0.4" opacity="0.45" />

        {/* Third drum — upright, leaning against the pile */}
        <ellipse cx="258" cy="268" rx="5" ry="6.5" fill="#3a2a1a" />
        <ellipse cx="258" cy="262" rx="4.5" ry="2" fill="#4a3a28" opacity="0.55" />
        {/* Drumhead circle pattern */}
        <circle cx="258" cy="262" r="3" fill="none" stroke="#2a2015" strokeWidth="0.3" opacity="0.4" />

        {/* Crossed drumsticks on top */}
        <line x1="244" y1="258" x2="260" y2="264" stroke="#4a4038" strokeWidth="0.8" />
        <line x1="260" y1="258" x2="246" y2="264" stroke="#4a4038" strokeWidth="0.8" />

        {/* Shadow beneath drum stack */}
        <ellipse cx="252" cy="277" rx="14" ry="3" fill="#0a0808" opacity="0.12" />
      </g>

      {/* === NEW v2: MAP / TREATY TABLE — near the sword surrender officers === */}
      <g opacity="0.55">
        {/* Table — small field table with X-legs */}
        <rect x="510" y="248" width="28" height="2" fill="url(#ch12_tableTop)" />
        {/* Table legs — X-frame */}
        <line x1="513" y1="250" x2="517" y2="262" stroke="#2e2820" strokeWidth="1.2" />
        <line x1="517" y1="250" x2="513" y2="262" stroke="#2e2820" strokeWidth="1.2" />
        <line x1="535" y1="250" x2="531" y2="262" stroke="#2e2820" strokeWidth="1.2" />
        <line x1="531" y1="250" x2="535" y2="262" stroke="#2e2820" strokeWidth="1.2" />

        {/* Papers / documents on table */}
        <rect x="512" y="245" width="14" height="10" fill="#5a584e" opacity="0.5" rx="0.5" />
        <rect x="514" y="244" width="12" height="8" fill="#6a685e" opacity="0.4" rx="0.5" />
        {/* Second document — slightly angled */}
        <rect x="524" y="246" width="10" height="7" fill="#5a5850" opacity="0.45" rx="0.3"
          transform="rotate(-5 529 249)" />

        {/* Ink lines on top document — text suggestion */}
        <line x1="516" y1="246" x2="524" y2="246" stroke="#2a2820" strokeWidth="0.3" opacity="0.4" />
        <line x1="516" y1="248" x2="522" y2="248" stroke="#2a2820" strokeWidth="0.3" opacity="0.35" />
        <line x1="516" y1="250" x2="523" y2="250" stroke="#2a2820" strokeWidth="0.3" opacity="0.3" />

        {/* Quill pen lying on table */}
        <line x1="528" y1="244" x2="540" y2="240" stroke="#3a3530" strokeWidth="0.6" />
        <path d="M540 240 Q541 239 540 238" fill="none" stroke="#3a3530" strokeWidth="0.4" />

        {/* Inkwell — small dark circle */}
        <circle cx="527" cy="247" r="1.5" fill="#1a1815" opacity="0.5" />

        {/* Shadow beneath table */}
        <ellipse cx="524" cy="263" rx="16" ry="2.5" fill="#0a0808" opacity="0.1" />
      </g>

      {/* === NEW: DOG — small shape near the French line === */}
      <g opacity="0.6">
        {/* Dog body — small scrappy camp dog trotting alongside soldiers */}
        <path d="M302 275 Q308 272 314 274 Q316 275 315 278 L304 278 Q302 277 302 275 Z"
          fill="#1e1a15" />
        {/* Head */}
        <ellipse cx="316" cy="273" rx="3" ry="2.5" fill="#1e1a15" />
        {/* Ear */}
        <path d="M317 271 Q319 269 318 272" fill="#1e1a15" />
        {/* Snout */}
        <ellipse cx="319" cy="274" rx="1.5" ry="1" fill="#252018" />
        {/* Front legs */}
        <line x1="313" y1="278" x2="312" y2="284" stroke="#1e1a15" strokeWidth="1" />
        <line x1="315" y1="278" x2="316" y2="284" stroke="#1e1a15" strokeWidth="1" />
        {/* Back legs */}
        <line x1="304" y1="278" x2="303" y2="284" stroke="#1e1a15" strokeWidth="1" />
        <line x1="306" y1="278" x2="307" y2="284" stroke="#1e1a15" strokeWidth="1" />
        {/* Tail — up and slightly curled */}
        <path d="M302 275 Q298 271 299 268" fill="none" stroke="#1e1a15" strokeWidth="0.8" />
      </g>

      {/* === NEW v3: SCATTERED STRAW — near wagon and road areas === */}
      <g opacity="0.15">
        {/* Straw near wagon */}
        <line x1="90" y1="308" x2="96" y2="305" stroke="#4a4228" strokeWidth="0.6" />
        <line x1="93" y1="310" x2="100" y2="307" stroke="#4a4228" strokeWidth="0.5" />
        <line x1="85" y1="312" x2="92" y2="310" stroke="#4a4228" strokeWidth="0.6" />
        <line x1="155" y1="302" x2="162" y2="300" stroke="#4a4228" strokeWidth="0.5" />
        <line x1="158" y1="305" x2="165" y2="302" stroke="#4a4228" strokeWidth="0.5" />
        {/* Straw near road */}
        <line x1="360" y1="300" x2="367" y2="298" stroke="#4a4228" strokeWidth="0.5" />
        <line x1="435" y1="295" x2="440" y2="292" stroke="#4a4228" strokeWidth="0.5" />
        <line x1="432" y1="298" x2="438" y2="296" stroke="#4a4228" strokeWidth="0.4" />
        {/* Straw near barrels */}
        <line x1="320" y1="290" x2="327" y2="288" stroke="#4a4228" strokeWidth="0.5" />
        <line x1="345" y1="285" x2="352" y2="283" stroke="#4a4228" strokeWidth="0.5" />
      </g>

      {/* === NEW v3: BROKEN CART WHEEL — debris on right side of road === */}
      <g opacity="0.4">
        {/* Broken wheel — half buried, leaning against nothing */}
        <path d="M565 290 A12 12 0 0 1 565 266" fill="none" stroke="#2a2018" strokeWidth="2" />
        {/* Hub remnant */}
        <circle cx="565" cy="278" r="2.5" fill="#2a2018" opacity="0.6" />
        {/* Remaining spokes — only 3 left */}
        <line x1="565" y1="278" x2="565" y2="266" stroke="#2a2018" strokeWidth="0.8" />
        <line x1="565" y1="278" x2="556" y2="272" stroke="#2a2018" strokeWidth="0.8" />
        <line x1="565" y1="278" x2="558" y2="288" stroke="#2a2018" strokeWidth="0.7" />
        {/* Broken spoke fragment on ground */}
        <line x1="570" y1="290" x2="578" y2="288" stroke="#2a2018" strokeWidth="0.6" opacity="0.5" />
        {/* Shadow */}
        <ellipse cx="564" cy="292" rx="8" ry="2" fill="#0a0808" opacity="0.1" />
      </g>

      {/* NEW v4: Additional siege debris — broken ladder, spent cannonballs, rampart fragments */}
      <g opacity="0.35">
        {/* Broken scaling ladder — discarded near wall */}
        <line x1="520" y1="280" x2="516" y2="250" stroke="#2a2218" strokeWidth="2" />
        <line x1="524" y1="280" x2="520" y2="250" stroke="#2a2218" strokeWidth="2" />
        {/* Rungs — only 3 remaining */}
        <line x1="516" y1="268" x2="524" y2="268" stroke="#2a2218" strokeWidth="0.8" />
        <line x1="517" y1="258" x2="523" y2="258" stroke="#2a2218" strokeWidth="0.8" />
        <line x1="518" y1="274" x2="522" y2="274" stroke="#2a2218" strokeWidth="0.8" />
        {/* Broken section */}
        <line x1="520" y1="250" x2="515" y2="245" stroke="#2a2218" strokeWidth="1.2" opacity="0.5" />

        {/* Spent cannonballs — scattered on ground */}
        <circle cx="280" cy="300" r="3.5" fill="#2a2a2e" opacity="0.7" />
        <circle cx="290" cy="305" r="3" fill="#2a2a2e" opacity="0.6" />
        <circle cx="540" cy="310" r="3.2" fill="#2a2a2e" opacity="0.65" />
        {/* Shadows beneath cannonballs */}
        <ellipse cx="280" cy="303" rx="4" ry="1" fill="#0a0808" opacity="0.08" />
        <ellipse cx="290" cy="307" rx="3.5" ry="0.8" fill="#0a0808" opacity="0.08" />
        <ellipse cx="540" cy="312" rx="3.5" ry="0.9" fill="#0a0808" opacity="0.08" />

        {/* Rampart stone fragment — large broken block */}
        <path d="M500 332 L515 328 L516 336 L502 340 Z" fill="#3a3530" />
        <line x1="507" y1="332" x2="508" y2="338" stroke="#2e2a25" strokeWidth="0.4" opacity="0.3" />
        <ellipse cx="508" cy="341" rx="10" ry="2" fill="#0a0808" opacity="0.1" />

        {/* Discarded Austrian knapsack */}
        <ellipse cx="385" cy="305" rx="5" ry="4" fill="#4a4540" opacity="0.5" />
        <rect x="382" y="303" width="6" height="3" fill="#3a3835" opacity="0.4" />
        <line x1="385" y1="303" x2="385" y2="298" stroke="#3a3530" strokeWidth="0.6" opacity="0.4" />
      </g>

      {/* === NEW v3: SUPPLY CRATES — stacked near French position, right side === */}
      <g opacity="0.5">
        {/* Crate 1 — bottom */}
        <rect x="590" y="268" width="14" height="10" fill="#2e2618" rx="0.5" />
        <line x1="597" y1="268" x2="597" y2="278" stroke="#252015" strokeWidth="0.5" opacity="0.4" />
        <line x1="590" y1="273" x2="604" y2="273" stroke="#252015" strokeWidth="0.5" opacity="0.4" />
        {/* Crate 2 — stacked on top, offset */}
        <rect x="592" y="259" width="12" height="9" fill="#302818" rx="0.5" />
        <line x1="598" y1="259" x2="598" y2="268" stroke="#252015" strokeWidth="0.5" opacity="0.35" />
        <line x1="592" y1="264" x2="604" y2="264" stroke="#252015" strokeWidth="0.5" opacity="0.35" />
        {/* Crate 3 — beside, slightly smaller */}
        <rect x="604" y="270" width="10" height="8" fill="#2a2215" rx="0.5" />
        <line x1="604" y1="274" x2="614" y2="274" stroke="#252015" strokeWidth="0.4" opacity="0.35" />
        {/* Shadow beneath crates */}
        <ellipse cx="600" cy="280" rx="14" ry="2.5" fill="#0a0808" opacity="0.1" />
      </g>

      {/* === OFFICER ON HORSEBACK — silhouette, behind soldiers === */}
      {/* Horse body */}
      <path d="M490 220 Q500 215 510 218 Q520 220 525 225 L528 240 Q525 248 520 250 L515 250 Q510 248 505 250 L500 250 Q495 248 490 250 L488 245 Q485 235 488 225 Z"
        fill="#12100c" opacity="0.6" />
      {/* Horse legs */}
      <line x1="493" y1="250" x2="491" y2="265" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      <line x1="500" y1="250" x2="498" y2="264" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      <line x1="515" y1="250" x2="517" y2="265" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      <line x1="522" y1="250" x2="524" y2="264" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      {/* Horse head/neck */}
      <path d="M525 225 Q535 215 540 210 Q542 208 540 212 Q538 216 535 220"
        fill="none" stroke="#12100c" strokeWidth="2.5" opacity="0.6" />
      {/* Horse tail */}
      <path d="M488 225 Q482 228 478 232" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.45" />
      {/* Rider — officer */}
      <path d="M505 220 Q503 208 505 200 Q507 195 509 200 L511 218"
        fill="#12100c" opacity="0.6" />
      <circle cx="507" cy="195" r="4.5" fill="#12100c" opacity="0.6" />
      {/* Bicorne hat silhouette */}
      <path d="M501 193 Q507 189 513 193" fill="none" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      {/* Raised arm / sword */}
      <line x1="510" y1="205" x2="518" y2="195" stroke="#12100c" strokeWidth="1.2" opacity="0.5" />
      <line x1="518" y1="195" x2="520" y2="188" stroke="#5a5a5a" strokeWidth="0.8" opacity="0.35" />

      {/* === NEW v2: CAVALRY PATROL — 2-3 mounted soldiers in the distance, keeping order === */}
      <g opacity="0.35">
        {/* Cavalry rider 1 — distant right, near wall */}
        {/* Horse body — small at distance */}
        <path d="M690 240 Q695 238 700 239 Q704 240 706 243 L707 248 Q705 250 703 250 L695 250 Q692 250 690 248 Q689 245 690 240 Z"
          fill="#15120e" />
        {/* Horse legs */}
        <line x1="693" y1="250" x2="692" y2="257" stroke="#15120e" strokeWidth="1" />
        <line x1="696" y1="250" x2="695" y2="257" stroke="#15120e" strokeWidth="1" />
        <line x1="702" y1="250" x2="703" y2="257" stroke="#15120e" strokeWidth="1" />
        <line x1="705" y1="250" x2="706" y2="257" stroke="#15120e" strokeWidth="1" />
        {/* Horse head */}
        <path d="M706 243 Q710 240 712 238" fill="none" stroke="#15120e" strokeWidth="1.2" />
        {/* Rider */}
        <path d="M697 240 Q696 234 697 230" fill="none" stroke="#15120e" strokeWidth="2" />
        <circle cx="697" cy="228" r="2.5" fill="#15120e" />
        {/* Helmet/shako */}
        <rect x="696" y="224" width="3" height="3" fill="#15120e" rx="0.3" />

        {/* Cavalry rider 2 — distant, slightly left of rider 1 */}
        <path d="M670 243 Q675 241 680 242 Q684 243 685 246 L686 250 Q684 252 682 252 L674 252 Q672 252 670 250 Q669 248 670 243 Z"
          fill="#15120e" />
        <line x1="673" y1="252" x2="672" y2="258" stroke="#15120e" strokeWidth="1" />
        <line x1="676" y1="252" x2="675" y2="258" stroke="#15120e" strokeWidth="1" />
        <line x1="681" y1="252" x2="682" y2="258" stroke="#15120e" strokeWidth="1" />
        <line x1="684" y1="252" x2="685" y2="258" stroke="#15120e" strokeWidth="1" />
        <path d="M685 246 Q689 243 691 241" fill="none" stroke="#15120e" strokeWidth="1.1" />
        <path d="M677 243 Q676 237 677 233" fill="none" stroke="#15120e" strokeWidth="1.8" />
        <circle cx="677" cy="231" r="2.3" fill="#15120e" />
        <rect x="676" y="227" width="2.5" height="2.5" fill="#15120e" rx="0.3" />

        {/* Cavalry rider 3 — furthest, near wall edge */}
        <path d="M715 242 Q718 241 722 242 Q724 243 725 245 L725 248 Q724 250 722 250 L718 250 Q716 250 715 248 Q714 246 715 242 Z"
          fill="#15120e" />
        <line x1="717" y1="250" x2="716" y2="255" stroke="#15120e" strokeWidth="0.8" />
        <line x1="722" y1="250" x2="723" y2="255" stroke="#15120e" strokeWidth="0.8" />
        <path d="M725 245 Q727 243 728 241" fill="none" stroke="#15120e" strokeWidth="0.9" />
        <path d="M720 242 Q719 238 720 234" fill="none" stroke="#15120e" strokeWidth="1.5" />
        <circle cx="720" cy="232" r="2" fill="#15120e" />
      </g>

      {/* === FRENCH TRICOLOR FLAG — detailed === */}
      <line x1="242" y1="214" x2="242" y2="172" stroke="#2a2520" strokeWidth="2" />
      {/* Flag pole finial */}
      <circle cx="242" cy="171" r="2" fill="#5a5550" opacity="0.5" />
      {/* Blue stripe */}
      <path d="M242 174 Q250 176 255 174 Q258 178 260 182 Q255 184 248 182 Q242 186 242 186 Z"
        fill="url(#ch12_flagBlue)" opacity="0.55" />
      {/* White stripe */}
      <path d="M255 174 Q260 176 265 174 Q268 178 270 182 Q265 184 258 182 Q255 184 255 184 Z"
        fill="#7a7a78" opacity="0.4" />
      {/* Red stripe */}
      <path d="M265 174 Q272 176 278 175 Q280 179 282 183 Q276 185 270 183 Q265 184 265 184 Z"
        fill="url(#ch12_flagRed)" opacity="0.5" />
      {/* Flag ripple shadow */}
      <path d="M248 178 Q255 177 262 179 Q270 178 278 179" fill="none" stroke="#000" strokeWidth="0.3" opacity="0.15" />

      {/* === NEW v5: TATTERED REGIMENTAL FLAGS === */}

      {/* French Eagle Standard — battle-worn, carried by grenadier near Soldier 2 */}
      <g opacity="0.65">
        {/* Standard pole — tall, with golden eagle at top */}
        <line x1="230" y1="215" x2="230" y2="168" stroke="#2a2520" strokeWidth="1.8" />
        {/* Golden eagle finial — simplified, iconic shape */}
        <path d="M226 168 Q230 162 234 168 L232 170 Q230 167 228 170 Z" fill="url(#ch12_eagleGold)" />
        {/* Eagle wings spread */}
        <path d="M226 168 Q222 165 220 166" fill="none" stroke="#5a4a28" strokeWidth="0.8" />
        <path d="M234 168 Q238 165 240 166" fill="none" stroke="#5a4a28" strokeWidth="0.8" />
        {/* Regimental pennant — blue with gold fringe, tattered */}
        <path d="M230 172 Q237 170 242 173 Q240 176 237 178 Q235 175 232 180 Q230 177 230 177 Z"
          fill="#1a2a55" opacity="0.5" />
        {/* Torn edges — battle damage */}
        <path d="M242 173 L244 172 L243 175" fill="none" stroke="#1a2a55" strokeWidth="0.4" opacity="0.3" />
        <path d="M237 178 L239 179 L238 181" fill="none" stroke="#1a2a55" strokeWidth="0.3" opacity="0.25" />
        {/* Gold fringe remnants — hanging threads */}
        <line x1="233" y1="180" x2="233" y2="183" stroke="#5a4a28" strokeWidth="0.3" opacity="0.3" />
        <line x1="235" y1="179" x2="235" y2="182" stroke="#5a4a28" strokeWidth="0.3" opacity="0.25" />
        <line x1="237" y1="178" x2="237" y2="181" stroke="#5a4a28" strokeWidth="0.3" opacity="0.25" />
        {/* Battle honor text suggestion — a faded band */}
        <line x1="231" y1="175" x2="240" y2="173" stroke="#3a3a65" strokeWidth="0.4" opacity="0.2" />
      </g>

      {/* Torn Austrian Leibfahne — captured, dragged on ground behind prisoner column */}
      <g opacity="0.4">
        {/* Broken pole — half the standard, trailing */}
        <line x1="410" y1="304" x2="425" y2="294" stroke="#3a3225" strokeWidth="1.5" />
        {/* Torn flag fabric — once-white Leibfahne with imperial eagle, now shredded */}
        <path d="M420 296 Q427 293 432 296 Q430 300 425 302 Q422 299 418 303 Z"
          fill="url(#ch12_tornFlagAustria)" />
        {/* Torn hanging strips — dangling fabric shreds */}
        <path d="M432 296 L435 295 L434 298" fill="none" stroke="#5a5848" strokeWidth="0.5" />
        <path d="M425 302 L427 304 L425 305" fill="none" stroke="#5a5848" strokeWidth="0.4" />
        <path d="M418 303 L416 305 L418 306" fill="none" stroke="#5a5848" strokeWidth="0.4" />
        {/* Faded imperial eagle trace — barely visible double-headed eagle */}
        <path d="M424 297 Q426 296 428 297 Q426 298 424 297" fill="#4a4838" opacity="0.2" />
        {/* Mud stains on fabric */}
        <ellipse cx="426" cy="299" rx="2" ry="1" fill="#2a2518" opacity="0.15" />
        {/* Boot print on trailing edge */}
        <ellipse cx="420" cy="302" rx="1.5" ry="1" fill="#1a1815" opacity="0.1" />
      </g>

      {/* === NEW v5: ADDITIONAL FRENCH SOLDIERS — wounded and watching === */}

      {/* Wounded French soldier — sitting against wall base, bandaged arm */}
      <g opacity="0.7">
        {/* Body — seated, leaning back */}
        <path d="M190 255 Q188 245 190 240 Q192 250 194 255 Z" fill="#15120e" />
        <circle cx="191" cy="237" r="3.8" fill="#15120e" />
        {/* Shako slightly askew */}
        <rect x="189" y="231" width="5" height="4" fill="#15120e" rx="0.3" />
        {/* Outstretched legs */}
        <path d="M188 255 Q185 260 180 264" fill="none" stroke="#15120e" strokeWidth="1.8" opacity="0.6" />
        <path d="M193 255 Q196 260 200 263" fill="none" stroke="#15120e" strokeWidth="1.8" opacity="0.6" />
        {/* Bandaged arm — white cloth wrapping on left arm, held across body */}
        <path d="M189 243 Q185 247 183 245" fill="none" stroke="#6a6a65" strokeWidth="1.5" opacity="0.5" />
        {/* Bandage detail — wrapping lines */}
        <line x1="186" y1="244" x2="187" y2="246" stroke="#5a5a55" strokeWidth="0.4" opacity="0.3" />
        <line x1="184" y1="245" x2="185" y2="247" stroke="#5a5a55" strokeWidth="0.4" opacity="0.3" />
        {/* Musket laid beside him */}
        <line x1="196" y1="242" x2="206" y2="262" stroke="#2a2520" strokeWidth="1.2" opacity="0.4" />
        {/* Shadow */}
        <ellipse cx="191" cy="265" rx="10" ry="2" fill="#0a0808" opacity="0.08" />
      </g>

      {/* French sergeant — standing near road, arm pointing at prisoners, directing */}
      <g opacity="0.75">
        {/* Body — upright, commanding posture */}
        <path d="M450 342 Q448 328 450 318 Q452 312 454 318 L456 340 Q455 348 454 356 L450 356 Z"
          fill="#12100c" />
        <circle cx="452" cy="312" r="5" fill="#12100c" />
        {/* Shako with plume hint */}
        <rect x="449" y="304" width="6" height="5.5" fill="#12100c" rx="0.4" />
        <line x1="455" y1="304" x2="456" y2="300" stroke="#4a2020" strokeWidth="0.8" opacity="0.3" />
        {/* Extended arm — pointing toward gate/prisoners */}
        <line x1="449" y1="322" x2="436" y2="316" stroke="#12100c" strokeWidth="1.5" opacity="0.6" />
        {/* Sword at side — officer's sabre */}
        <line x1="457" y1="325" x2="460" y2="350" stroke="#4a4a52" strokeWidth="0.8" opacity="0.35" />
        {/* Sergeant's chevrons suggestion — stripe on sleeve */}
        <path d="M453 326 L455 328 L453 330" fill="none" stroke="#4a4530" strokeWidth="0.5" opacity="0.25" />
        {/* Shadow */}
        <ellipse cx="453" cy="357" rx="6" ry="2" fill="#0a0808" opacity="0.1" />
      </g>

      {/* French soldier warming hands — standing near right, rubbing palms */}
      <g opacity="0.7">
        <path d="M645 340 Q643 328 645 320 Q647 314 649 320 L651 338 Q650 346 649 354 L645 354 Z"
          fill="#15120e" />
        <circle cx="647" cy="314" r="4.5" fill="#15120e" />
        <rect x="644" y="307" width="5.5" height="5" fill="#15120e" rx="0.3" />
        {/* Hands together in front — rubbing for warmth */}
        <ellipse cx="648" cy="328" rx="3" ry="2" fill="#15120e" opacity="0.6" />
        {/* Musket slung across back — diagonal */}
        <line x1="643" y1="316" x2="654" y2="348" stroke="#2a2520" strokeWidth="1.2" opacity="0.4" />
        {/* Breath in cold */}
        <ellipse cx="653" cy="311" rx="3.5" ry="1.5" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 4.2s ease-out infinite', animationDelay: '2.8s' }} />
        <ellipse cx="453" cy="309" rx="3.5" ry="1.8" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 3.8s ease-out infinite', animationDelay: '1.2s' }} />
        {/* Shadow */}
        <ellipse cx="647" cy="355" rx="6" ry="1.8" fill="#0a0808" opacity="0.1" />
      </g>

      {/* === NEW v5: FOOTPRINT TRAILS IN MUD/SNOW === */}
      <g opacity="0.06">
        {/* Boot prints from gate toward viewer — Austrian prisoners' path */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const px = 395 + (i % 2) * 8 + i * 1.5;
          const py = 260 + i * 10;
          const angle = -5 + (i % 3) * 3;
          return (
            <g key={`bootAus${i}`} transform={`rotate(${angle} ${px} ${py})`}>
              {/* Boot sole impression — elongated oval */}
              <ellipse cx={px} cy={py} rx={2} ry={3.5} fill="#1a1815" />
              {/* Heel mark */}
              <ellipse cx={px} cy={py + 3} rx={1.5} ry={1.2} fill="#181512" />
            </g>
          );
        })}
        {/* French patrol boot prints — heavier, from the side */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const px = 440 + i * 12;
          const py = 275 + i * 5 + (i % 2) * 3;
          return (
            <g key={`bootFr${i}`}>
              <ellipse cx={px} cy={py} rx={2.2} ry={3.8} fill="#1a1815" />
              <ellipse cx={px} cy={py + 3.2} rx={1.6} ry={1.3} fill="#181512" />
            </g>
          );
        })}
      </g>

      {/* === NEW v5: COLLAPSED GABION BASKET — siege fortification debris === */}
      <g opacity="0.4">
        {/* Gabion — cylindrical woven basket, collapsed and spilling earth */}
        <ellipse cx="550" cy="278" rx="8" ry="6" fill="url(#ch12_gabion)" />
        {/* Woven wicker texture — horizontal bands */}
        <ellipse cx="550" cy="278" rx="8" ry="6" fill="none" stroke="#3a3225" strokeWidth="0.6" />
        <path d="M542 276 Q546 274 550 276 Q554 274 558 276" fill="none" stroke="#2a2418" strokeWidth="0.4" />
        <path d="M542 280 Q546 278 550 280 Q554 278 558 280" fill="none" stroke="#2a2418" strokeWidth="0.4" />
        {/* Spilled earth — dark soil tumbling from the opened end */}
        <ellipse cx="556" cy="282" rx="5" ry="3" fill="#1e1a14" opacity="0.5" />
        <ellipse cx="544" cy="283" rx="4" ry="2.5" fill="#1e1a14" opacity="0.4" />
        {/* Shadow */}
        <ellipse cx="550" cy="284" rx="10" ry="2" fill="#0a0808" opacity="0.08" />
      </g>

      {/* === NEW v5: SCATTERED PLAYING CARDS — near resting Soldier 4 === */}
      <g opacity="0.3">
        {/* Card 1 — face down */}
        <rect x="542" y="272" width="4" height="5.5" fill="#5a5850" rx="0.3" transform="rotate(-15 544 275)" />
        <rect x="542.3" y="272.3" width="3.4" height="4.9" fill="#484540" rx="0.2" transform="rotate(-15 544 275)" />
        {/* Card 2 — face up, a faint suit pip */}
        <rect x="548" y="274" width="4" height="5.5" fill="#5a5850" rx="0.3" transform="rotate(8 550 277)" />
        <circle cx="550" cy="277" r="0.6" fill="#6a2020" opacity="0.3" transform="rotate(8 550 277)" />
        {/* Card 3 — scattered */}
        <rect x="536" y="275" width="4" height="5.5" fill="#5a5850" rx="0.3" transform="rotate(-35 538 278)" />
      </g>

      {/* === NEW v5: FROZEN WATER BUCKET — near wagon area === */}
      <g opacity="0.5">
        {/* Bucket — wooden, overturned, frozen water spilled */}
        <path d="M162 305 L165 295 L175 295 L178 305 Z" fill="#2a2218" />
        {/* Iron bands */}
        <line x1="163" y1="298" x2="177" y2="298" stroke="#3a3838" strokeWidth="0.5" opacity="0.4" />
        <line x1="164" y1="303" x2="176" y2="303" stroke="#3a3838" strokeWidth="0.5" opacity="0.4" />
        {/* Handle — arched wire */}
        <path d="M165 295 Q170 290 175 295" fill="none" stroke="#3a3838" strokeWidth="0.6" opacity="0.4" />
        {/* Frozen water puddle spilling from bucket */}
        <ellipse cx="170" cy="308" rx="10" ry="3" fill="#3a4858" opacity="0.1" />
        {/* Ice surface glint */}
        <line x1="165" y1="307" x2="175" y2="307" stroke="#a0b0c8" strokeWidth="0.3" opacity="0.08" />
      </g>

      {/* === NEW v5: ADDITIONAL BARE TREE with crow's nest === */}
      {/* Tree 5 — between gate and right tower, medium size, with abandoned nest */}
      <g>
        <path d="M570 252 Q572 228 573 205 Q574 192 575 185" fill="none" stroke="#2a2822" strokeWidth="2.2" opacity="0.55" />
        <path d="M575 185 Q580 172 583 176" fill="none" stroke="#2a2822" strokeWidth="1.1" opacity="0.55" />
        <path d="M575 185 Q568 174 565 178" fill="none" stroke="#2a2822" strokeWidth="1" opacity="0.55" />
        <path d="M575 185 Q578 174 581 168 Q583 163 585 166" fill="none" stroke="#2a2822" strokeWidth="0.7" opacity="0.5" />
        <path d="M573 205 Q566 196 563 200" fill="none" stroke="#2a2822" strokeWidth="0.8" opacity="0.5" />
        <path d="M573 205 Q578 198 582 194" fill="none" stroke="#2a2822" strokeWidth="0.7" opacity="0.5" />
        <path d="M572 225 Q567 218 564 222" fill="none" stroke="#2a2822" strokeWidth="0.7" opacity="0.45" />
        {/* Root spread */}
        <path d="M569 252 Q564 254 560 253" fill="none" stroke="#2a2822" strokeWidth="1.2" opacity="0.35" />
        <path d="M574 252 Q578 254 582 253" fill="none" stroke="#2a2822" strokeWidth="1" opacity="0.3" />
        {/* Frost on branches */}
        <g opacity="0.12">
          <path d="M575 185 Q580 172 583 176" fill="none" stroke="#a0b8d0" strokeWidth="0.5" />
          <path d="M575 185 Q568 174 565 178" fill="none" stroke="#a0b8d0" strokeWidth="0.4" />
        </g>
        {/* Crow's nest — bundle of twigs in upper fork */}
        <g opacity="0.4">
          <ellipse cx="576" cy="183" rx="5" ry="3" fill="#1e1a15" />
          {/* Nest twigs sticking out */}
          <path d="M572 182 Q570 180 568 179" fill="none" stroke="#2a2518" strokeWidth="0.5" />
          <path d="M580 182 Q582 180 584 179" fill="none" stroke="#2a2518" strokeWidth="0.5" />
          <path d="M574 181 Q573 178 572 176" fill="none" stroke="#2a2518" strokeWidth="0.4" />
          <path d="M578 181 Q579 178 580 176" fill="none" stroke="#2a2518" strokeWidth="0.4" />
        </g>
      </g>

      {/* === NEW v5: ENHANCED GROUND-LEVEL MIST WISPS === */}
      <g>
        {/* Wispy mist bank 1 — near left tree base, clinging to ground */}
        <ellipse cx="140" cy="256" rx="50" ry="5" fill="#3a4858" filter="url(#ch12_mistWisp)"
          style={{ animation: 'ch12_mistDrift 35s ease-in-out infinite' }} />
        {/* Wispy mist bank 2 — mid-ground, near barrels */}
        <ellipse cx="340" cy="280" rx="60" ry="6" fill="#3a4858" filter="url(#ch12_mistWisp)"
          style={{ animation: 'ch12_mistDrift 40s ease-in-out infinite', animationDelay: '8s' }} />
        {/* Wispy mist bank 3 — right of road */}
        <ellipse cx="600" cy="272" rx="55" ry="5" fill="#3a4858" filter="url(#ch12_mistWisp)"
          style={{ animation: 'ch12_mistDrift 38s ease-in-out infinite', animationDelay: '15s' }} />
        {/* Wispy mist bank 4 — foreground, near viewer */}
        <ellipse cx="400" cy="350" rx="80" ry="8" fill="#3a4858" filter="url(#ch12_mistWisp)"
          style={{ animation: 'ch12_mistDrift 50s ease-in-out infinite', animationDelay: '5s' }} />
        {/* Thin mist tendrils curling around cannon wheels */}
        <ellipse cx="80" cy="345" rx="25" ry="4" fill="#3a4858" filter="url(#ch12_mistWisp)"
          style={{ animation: 'ch12_mistDrift 30s ease-in-out infinite', animationDelay: '12s' }} />
      </g>

      {/* === NEW v5: ADDITIONAL FOREGROUND RUBBLE DETAIL === */}
      <g opacity="0.3">
        {/* Broken masonry chunk — near road, fallen from wall */}
        <path d="M440 332 L450 328 L453 334 L444 338 Z" fill="#3a3530" />
        <line x1="446" y1="330" x2="448" y2="336" stroke="#2e2a25" strokeWidth="0.4" />
        {/* Smaller stone fragments */}
        <ellipse cx="448" cy="340" rx="2" ry="1.5" fill="#35302a" />
        <ellipse cx="438" cy="336" rx="1.5" ry="1" fill="#35302a" />
        {/* Shattered tile piece */}
        <path d="M460 345 L464 342 L466 346 L462 348 Z" fill="#3a3028" opacity="0.6" />
        {/* Rusty iron fragment — from fortress hardware */}
        <line x1="425" y1="342" x2="432" y2="340" stroke="#3a3535" strokeWidth="1" opacity="0.4" />
      </g>

      {/* === SNOW / FROST PARTICLES === */}
      {/* Scattered white dots — falling snow and frost motes */}
      {[
        [80, 60], [150, 30], [220, 80], [310, 45], [400, 25], [480, 70],
        [560, 40], [640, 55], [720, 35], [45, 120], [180, 100], [350, 90],
        [520, 110], [670, 95], [760, 130], [100, 160], [270, 140], [430, 155],
        [590, 145], [700, 170], [130, 200], [300, 180], [470, 195], [620, 185],
        [50, 260], [200, 280], [340, 270], [500, 290], [650, 275], [750, 260],
        [120, 310], [280, 330], [440, 315], [600, 340], [730, 320],
        [90, 355], [250, 370], [400, 360], [550, 375], [690, 365],
      ].map(([x, y], i) => (
        <circle key={`snow${i}`} cx={x} cy={y} r={0.6 + (i % 3) * 0.3}
          fill="#c0c8d0" opacity={0.08 + (i % 4) * 0.02} filter="url(#ch12_snowGlow)" />
      ))}

      {/* Larger frost motes — fewer, brighter */}
      {[
        [190, 50], [420, 38], [640, 65], [100, 130], [530, 120], [360, 200],
      ].map(([x, y], i) => (
        <circle key={`frost${i}`} cx={x} cy={y} r={1 + (i % 2) * 0.4}
          fill="#d0d8e0" opacity={0.06 + (i % 3) * 0.015} filter="url(#ch12_snowGlow)" />
      ))}

      {/* NEW: Animated snow flurry — drifting snowflakes with movement */}
      {[
        { x: 120, y: 40, dur: '6s', r: 1.2, cls: 'ch12_snowDrift1' },
        { x: 280, y: 20, dur: '7s', r: 1.0, cls: 'ch12_snowDrift2' },
        { x: 450, y: 50, dur: '8s', r: 1.3, cls: 'ch12_snowDrift3' },
        { x: 600, y: 30, dur: '6.5s', r: 1.1, cls: 'ch12_snowDrift1' },
        { x: 200, y: 70, dur: '7.5s', r: 0.9, cls: 'ch12_snowDrift2' },
        { x: 500, y: 15, dur: '9s', r: 1.4, cls: 'ch12_snowDrift3' },
        { x: 700, y: 45, dur: '6s', r: 1.0, cls: 'ch12_snowDrift1' },
        { x: 350, y: 60, dur: '8s', r: 1.2, cls: 'ch12_snowDrift2' },
        { x: 50, y: 35, dur: '7s', r: 1.1, cls: 'ch12_snowDrift3' },
        { x: 660, y: 10, dur: '8.5s', r: 1.3, cls: 'ch12_snowDrift1' },
        { x: 160, y: 90, dur: '7.5s', r: 0.8, cls: 'ch12_snowDrift2' },
        { x: 540, y: 75, dur: '9s', r: 1.0, cls: 'ch12_snowDrift3' },
      ].map((flake, i) => (
        <circle
          key={`flurry${i}`}
          cx={flake.x}
          cy={flake.y}
          r={flake.r}
          fill="#d0d8e8"
          opacity="0.12"
          style={{
            animation: `${flake.cls} ${flake.dur} ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* === NEW v3: FOREGROUND WEEDS AND DEAD GRASS — along bottom edge === */}
      <g opacity="0.2">
        {/* Left edge — dead winter grass clumps */}
        <path d="M10 395 Q8 382 5 375" fill="none" stroke="#3a3828" strokeWidth="1" />
        <path d="M10 395 Q12 384 14 378" fill="none" stroke="#3a3828" strokeWidth="0.8" />
        <path d="M10 395 Q10 385 10 376" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M25 398 Q23 386 20 380" fill="none" stroke="#3a3828" strokeWidth="0.9" />
        <path d="M25 398 Q27 388 30 382" fill="none" stroke="#3a3828" strokeWidth="0.8" />

        {/* Center-left */}
        <path d="M200 400 Q198 390 195 385" fill="none" stroke="#3a3828" strokeWidth="0.8" />
        <path d="M200 400 Q202 392 205 387" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M230 398 Q228 388 226 383" fill="none" stroke="#3a3828" strokeWidth="0.8" />

        {/* Center — near road edge */}
        <path d="M350 400 Q348 392 345 387" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M350 400 Q352 393 354 389" fill="none" stroke="#3a3828" strokeWidth="0.6" />

        {/* Right of road */}
        <path d="M455 400 Q453 391 450 386" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M455 400 Q457 392 460 388" fill="none" stroke="#3a3828" strokeWidth="0.7" />

        {/* Far right */}
        <path d="M600 398 Q598 388 596 383" fill="none" stroke="#3a3828" strokeWidth="0.8" />
        <path d="M600 398 Q602 390 604 385" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M700 400 Q698 392 695 387" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M700 400 Q702 393 705 389" fill="none" stroke="#3a3828" strokeWidth="0.6" />

        {/* Far left edge */}
        <path d="M770 396 Q768 386 765 380" fill="none" stroke="#3a3828" strokeWidth="0.8" />
        <path d="M770 396 Q772 388 775 383" fill="none" stroke="#3a3828" strokeWidth="0.7" />
        <path d="M790 400 Q788 392 786 388" fill="none" stroke="#3a3828" strokeWidth="0.6" />
      </g>

      {/* === NEW v3: ENHANCED FIGURE SHADOWS — beneath all standing soldiers === */}
      <g>
        {/* Shadow under Soldier 1 */}
        <ellipse cx="212" cy="259" rx="6" ry="2" fill="#0a0808" opacity="0.12" />
        {/* Shadow under Soldier 2 */}
        <ellipse cx="237" cy="261" rx="5.5" ry="1.8" fill="#0a0808" opacity="0.11" />
        {/* Shadow under Soldier 3 */}
        <ellipse cx="261" cy="261" rx="6" ry="1.8" fill="#0a0808" opacity="0.1" />
        {/* Shadow under Soldier 5 */}
        <ellipse cx="582" cy="259" rx="5.5" ry="1.8" fill="#0a0808" opacity="0.1" />
        {/* Shadow under Soldier 6 */}
        <ellipse cx="607" cy="259" rx="5.5" ry="1.8" fill="#0a0808" opacity="0.1" />
        {/* Shadow under Soldier 7 (foreground) — larger */}
        <ellipse cx="174" cy="293" rx="8" ry="2.5" fill="#0a0808" opacity="0.14" />
        {/* Shadow under Soldier 8 (foreground) — larger */}
        <ellipse cx="634" cy="295" rx="8" ry="2.5" fill="#0a0808" opacity="0.13" />
        {/* Shadow under Drummer Boy */}
        <ellipse cx="292" cy="261" rx="6" ry="1.8" fill="#0a0808" opacity="0.1" />
        {/* Shadow under dog */}
        <ellipse cx="310" cy="285" rx="8" ry="1.5" fill="#0a0808" opacity="0.08" />
        {/* Shadow under officer's horse */}
        <ellipse cx="510" cy="266" rx="20" ry="3" fill="#0a0808" opacity="0.12" />
        {/* Shadow under Austrian prisoner column */}
        <ellipse cx="400" cy="320" rx="18" ry="3" fill="#0a0808" opacity="0.08" />
      </g>

      {/* === ATMOSPHERIC OVERLAYS === */}

      {/* Low ground fog / mist */}
      <ellipse cx="200" cy="258" rx="150" ry="12" fill="#3a4048" opacity="0.06" />
      <ellipse cx="550" cy="260" rx="180" ry="14" fill="#3a4048" opacity="0.05" />
      <ellipse cx="400" cy="265" rx="120" ry="10" fill="#3a4048" opacity="0.04" />

      {/* NEW v3: Additional mist layers — morning fog rising from moat and ground */}
      <ellipse cx="100" cy="262" rx="100" ry="8" fill="#3a4550" opacity="0.04" />
      <ellipse cx="700" cy="260" rx="120" ry="10" fill="#3a4550" opacity="0.04" />
      <ellipse cx="350" cy="255" rx="160" ry="8" fill="#3a4550" opacity="0.03" />
      {/* Moat mist — hanging over the ditch */}
      <ellipse cx="200" cy="250" rx="140" ry="6" fill="#3a4858" opacity="0.05" />
      <ellipse cx="500" cy="252" rx="120" ry="5" fill="#3a4858" opacity="0.04" />
      <ellipse cx="650" cy="251" rx="80" ry="4" fill="#3a4858" opacity="0.04" />

      {/* NEW v4: Volumetric fog layers — thick atmospheric haze at mid-ground */}
      <rect x="0" y="240" width="800" height="30" fill="url(#ch12_volumetricFog)"
        style={{ animation: 'ch12_fogDrift 45s linear infinite' }} />
      <rect x="0" y="260" width="800" height="25" fill="url(#ch12_volumetricFog)" opacity="0.7"
        style={{ animation: 'ch12_fogDrift 55s linear infinite', animationDelay: '10s' }} />
      {/* Animated drifting fog banks */}
      <ellipse cx="250" cy="268" rx="140" ry="10" fill="#3a4858" opacity="0.05"
        style={{ animation: 'ch12_fogDrift 60s ease-in-out infinite' }} />
      <ellipse cx="600" cy="270" rx="160" ry="12" fill="#3a4858" opacity="0.04"
        style={{ animation: 'ch12_fogDrift 50s ease-in-out infinite', animationDelay: '20s' }} />
      {/* Rising mist from moat — thin wisps */}
      <ellipse cx="300" cy="253" rx="70" ry="5" fill="#3a4858" opacity="0.06" />
      <ellipse cx="480" cy="254" rx="60" ry="4" fill="#3a4858" opacity="0.05" />

      {/* Breath / smoke wisps near soldiers (original) */}
      <ellipse cx="220" cy="210" rx="8" ry="3" fill="#5a6068" opacity="0.06" />
      <ellipse cx="570" cy="245" rx="6" ry="2.5" fill="#5a6068" opacity="0.05" />

      {/* NEW: Animated breath vapor — visible in cold air from closest soldiers */}
      {/* Breath from Soldier 7 (foreground left, closest) */}
      <g>
        <ellipse cx="180" cy="228" rx="6" ry="3" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 3.5s ease-out infinite' }} />
        <ellipse cx="182" cy="226" rx="4" ry="2" fill="#7a8590" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 3.5s ease-out infinite', animationDelay: '0.3s' }} />
      </g>
      {/* Breath from Soldier 8 (foreground right) */}
      <g>
        <ellipse cx="640" cy="232" rx="5" ry="2.5" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 4s ease-out infinite', animationDelay: '1.5s' }} />
        <ellipse cx="638" cy="230" rx="3.5" ry="1.8" fill="#7a8590" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 4s ease-out infinite', animationDelay: '1.8s' }} />
      </g>
      {/* Breath from Soldier 1 */}
      <g>
        <ellipse cx="218" cy="209" rx="4" ry="2" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 4.5s ease-out infinite', animationDelay: '0.8s' }} />
      </g>
      {/* Breath from Soldier 5 (right standing) */}
      <g>
        <ellipse cx="588" cy="211" rx="4" ry="2" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 4s ease-out infinite', animationDelay: '2.2s' }} />
      </g>
      {/* Breath from horse */}
      <g>
        <ellipse cx="544" cy="208" rx="5" ry="2.5" fill="#5a6570" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 3s ease-out infinite', animationDelay: '0.5s' }} />
      </g>

      {/* Cold blue atmospheric wash */}
      <rect x="0" y="0" width="800" height="400" fill="#2a3545" opacity="0.04" />

      {/* NEW v3: Warm light touch on upper portion — faint morning glow where clouds thin */}
      <rect x="250" y="0" width="300" height="80" fill="#5a5040" opacity="0.02" />

      {/* NEW v4: Atmospheric perspective — subtle blue-grey gradient on distant elements */}
      <rect x="0" y="100" width="800" height="150" fill="#3a4552" opacity="0.02" />
      {/* Enhanced depth haze on mid-ground */}
      <rect x="0" y="200" width="800" height="60" fill="#3a4550" opacity="0.03" />

      {/* NEW v3: Distant birds — tiny V shapes in the sky, winter birds */}
      <g opacity="0.12">
        <path d="M250 22 L253 19 L256 22" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
        <path d="M264 18 L267 15 L270 18" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
        <path d="M257 25 L260 22 L263 25" fill="none" stroke="#3a3a3a" strokeWidth="0.4" />
        <path d="M540 28 L543 25 L546 28" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
        <path d="M548 24 L551 21 L554 24" fill="none" stroke="#3a3a3a" strokeWidth="0.4" />

        {/* NEW v4: More distant birds — larger flock */}
        <path d="M340 32 L343 29 L346 32" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
        <path d="M352 28 L355 25 L358 28" fill="none" stroke="#3a3a3a" strokeWidth="0.4" />
        <path d="M420 36 L423 33 L426 36" fill="none" stroke="#3a3a3a" strokeWidth="0.5" />
        <path d="M590 26 L593 23 L596 26" fill="none" stroke="#3a3a3a" strokeWidth="0.4" />
      </g>

      {/* NEW v3: Foreground dust/frost particles close to camera — slightly larger, more visible */}
      <circle cx="50" cy="370" r="1.2" fill="#a0a8b0" opacity="0.04" filter="url(#ch12_snowGlow)" />
      <circle cx="200" cy="380" r="1.5" fill="#a0a8b0" opacity="0.03" filter="url(#ch12_snowGlow)" />
      <circle cx="380" cy="385" r="1.3" fill="#a0a8b0" opacity="0.04" filter="url(#ch12_snowGlow)" />
      <circle cx="560" cy="375" r="1.4" fill="#a0a8b0" opacity="0.03" filter="url(#ch12_snowGlow)" />
      <circle cx="730" cy="382" r="1.2" fill="#a0a8b0" opacity="0.04" filter="url(#ch12_snowGlow)" />

      {/* Bottom darkness — frozen ground fade */}
      <rect x="0" y="360" width="800" height="40" fill="#0a0a0c" opacity="0.35" />
      <rect x="0" y="385" width="800" height="15" fill="#0a0a0c" opacity="0.25" />

      {/* Radial vignette — final overlay */}
      <rect x="0" y="0" width="800" height="400" fill="url(#ch12_vignette)" />
    </svg>
  );
}
