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
        {/* Dusk sky — deep purple-orange, more dramatic */}
        <linearGradient id="ch4_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0814" />
          <stop offset="15%" stopColor="#14102a" />
          <stop offset="30%" stopColor="#261838" />
          <stop offset="45%" stopColor="#4a2040" />
          <stop offset="55%" stopColor="#6a2838" />
          <stop offset="65%" stopColor="#8a3530" />
          <stop offset="75%" stopColor="#b04828" />
          <stop offset="85%" stopColor="#d06830" />
          <stop offset="92%" stopColor="#e08838" />
          <stop offset="100%" stopColor="#f0a040" />
        </linearGradient>
        {/* River water — dark, reflective with warm sunset tones */}
        <linearGradient id="ch4_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3540" />
          <stop offset="15%" stopColor="#3a2a38" />
          <stop offset="40%" stopColor="#2e2230" />
          <stop offset="70%" stopColor="#251e2a" />
          <stop offset="100%" stopColor="#1a1520" />
        </linearGradient>
        {/* Sky reflection in water — warm horizon band (stronger for sunset) */}
        <linearGradient id="ch4_reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0a040" stopOpacity="0.45" />
          <stop offset="15%" stopColor="#d07830" stopOpacity="0.3" />
          <stop offset="35%" stopColor="#8a5a3a" stopOpacity="0.15" />
          <stop offset="60%" stopColor="#7a4a30" stopOpacity="0.06" />
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
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.7" />
          <stop offset="25%" stopColor="#d09040" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#b07030" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a06830" stopOpacity="0" />
        </radialGradient>
        {/* Distant fire 2 */}
        <radialGradient id="ch4_fire2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Sunset glow on horizon */}
        <radialGradient id="ch4_sunGlow" cx="0.5" cy="0.62" r="0.4">
          <stop offset="0%" stopColor="#f0a040" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#d07830" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b87a40" stopOpacity="0" />
        </radialGradient>
        {/* Warm sunset shimmer on water */}
        <linearGradient id="ch4_warmShimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0" />
          <stop offset="25%" stopColor="#d09050" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#e0a860" stopOpacity="0.3" />
          <stop offset="75%" stopColor="#d09050" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#b87a40" stopOpacity="0" />
        </linearGradient>
        {/* Powder smoke gradient */}
        <radialGradient id="ch4_smoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#8a7868" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#706058" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#584840" stopOpacity="0" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id="ch4_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
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
          <stop offset="0%" stopColor="#908070" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#706058" stopOpacity="0.15" />
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
          <stop offset="0%" stopColor="#a05030" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#c06838" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8a4028" stopOpacity="0.2" />
        </linearGradient>
        {/* Cloud rim-lighting from below */}
        <linearGradient id="ch4_cloudRim" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.45" />
          <stop offset="35%" stopColor="#c08040" stopOpacity="0.25" />
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
          <stop offset="0%" stopColor="#8a8078" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#706860" stopOpacity="0.08" />
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
        {/* Fire reflection in river — animated orange shimmer */}
        <linearGradient id="ch4_fireReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#a06830" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a06830" stopOpacity="0" />
        </linearGradient>
        {/* Lantern glow — warm point light */}
        <radialGradient id="ch4_lanternGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0b060" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#c09040" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#a07030" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a07030" stopOpacity="0" />
        </radialGradient>
        {/* Churned earth gradient */}
        <linearGradient id="ch4_churnedEarth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2215" />
          <stop offset="50%" stopColor="#1e1a10" />
          <stop offset="100%" stopColor="#15120c" />
        </linearGradient>
        {/* Stone block pattern fill for bridge */}
        <linearGradient id="ch4_stoneBlock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#504838" />
          <stop offset="100%" stopColor="#403828" />
        </linearGradient>

        {/* === ADDITIONAL DETAIL GRADIENTS === */}
        {/* River mist — translucent ground-level haze */}
        <linearGradient id="ch4_riverMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a7a70" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#706058" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#706058" stopOpacity="0" />
        </linearGradient>
        {/* Sunset ray — diagonal beam of warm light through clouds */}
        <linearGradient id="ch4_sunRay" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#d09050" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#c09050" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c09050" stopOpacity="0" />
        </linearGradient>
        {/* Moss on rocks — damp green-brown */}
        <radialGradient id="ch4_moss" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#2a3520" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a3520" stopOpacity="0" />
        </radialGradient>
        {/* Dust haze — warm particulate in air near ground */}
        <radialGradient id="ch4_dustHaze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7a6850" stopOpacity="0.06" />
          <stop offset="60%" stopColor="#6a5840" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#6a5840" stopOpacity="0" />
        </radialGradient>
        {/* Puddle reflection — wet ground near river */}
        <radialGradient id="ch4_puddle" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#4a3540" stopOpacity="0.2" />
          <stop offset="60%" stopColor="#3a2a35" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3a2a35" stopOpacity="0" />
        </radialGradient>
        {/* Shadow cast from figures — elongated dusk shadow */}
        <linearGradient id="ch4_figureShadow" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#0a0808" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0a0808" stopOpacity="0" />
        </linearGradient>
        {/* Pebble ground texture */}
        <radialGradient id="ch4_pebbleGround" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1e1a12" stopOpacity="0.2" />
          <stop offset="80%" stopColor="#1e1a12" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1e1a12" stopOpacity="0" />
        </radialGradient>
        {/* Bridge reflection in water */}
        <linearGradient id="ch4_bridgeReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3528" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#2a2518" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#2a2518" stopOpacity="0" />
        </linearGradient>

        {/* === ENHANCED DETAIL GRADIENTS === */}
        {/* Wood plank grain texture — dark lines on warm brown */}
        <linearGradient id="ch4_woodGrain" x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0%" stopColor="#3a3020" stopOpacity="0.15" />
          <stop offset="20%" stopColor="#2a2518" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#3a3020" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#2a2518" stopOpacity="0.05" />
          <stop offset="80%" stopColor="#3a3020" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#2a2518" stopOpacity="0.06" />
        </linearGradient>
        {/* Deep water — dark undulating current below surface */}
        <linearGradient id="ch4_deepCurrent" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#1e1a25" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#2a2535" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1e1a25" stopOpacity="0.06" />
        </linearGradient>
        {/* Cannon blast soot — very dark, concentrated impact */}
        <radialGradient id="ch4_blastSoot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0a0604" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#1a1008" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1a1008" stopOpacity="0" />
        </radialGradient>
        {/* Distant burning glow — far bank fires */}
        <radialGradient id="ch4_distantBurn" cx="0.5" cy="0.8" r="0.5">
          <stop offset="0%" stopColor="#c06030" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#a04820" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a04820" stopOpacity="0" />
        </radialGradient>
        {/* Water reed reflection — dark vertical blur */}
        <linearGradient id="ch4_reedReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2018" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#1a2018" stopOpacity="0" />
        </linearGradient>
        {/* Smoldering debris glow — orange-red hot spots */}
        <radialGradient id="ch4_smolder" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b05020" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#903818" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#903818" stopOpacity="0" />
        </radialGradient>
        {/* Muzzle flash — bright white-yellow cannon blast */}
        <radialGradient id="ch4_muzzleFlash" cx="0.3" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.9" />
          <stop offset="20%" stopColor="#f0d080" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#e0a040" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </radialGradient>
        {/* Bridge plank fill — visible warm brown for bridge surface */}
        <linearGradient id="ch4_bridgeDeck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a4a30" />
          <stop offset="50%" stopColor="#4a3a25" />
          <stop offset="100%" stopColor="#3a3018" />
        </linearGradient>
        {/* Charging soldier silhouette fill */}
        <linearGradient id="ch4_soldierCharge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1510" />
          <stop offset="100%" stopColor="#0e0c08" />
        </linearGradient>
        {/* Cannon blast shockwave — concentric ring of compressed air */}
        <radialGradient id="ch4_blastWave" cx="0.3" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#e0c080" stopOpacity="0" />
          <stop offset="40%" stopColor="#d0a050" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#c08838" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a06828" stopOpacity="0" />
        </radialGradient>
        {/* Pontoon hull shadow — underwater darkening beneath pontoons */}
        <linearGradient id="ch4_pontoonShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1520" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#12101a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#12101a" stopOpacity="0" />
        </linearGradient>
        {/* River foam — white-ish turbulence at bridge supports */}
        <radialGradient id="ch4_foam" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#8a8078" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#706860" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#706860" stopOpacity="0" />
        </radialGradient>
        {/* Sunset water column — vertical reflection of the setting sun */}
        <linearGradient id="ch4_sunColumn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0a040" stopOpacity="0.2" />
          <stop offset="20%" stopColor="#d09038" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#b07830" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#905828" stopOpacity="0" />
        </linearGradient>
        {/* Iron chain links — dark metallic gradient */}
        <linearGradient id="ch4_chainMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4540" />
          <stop offset="50%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        {/* Deep crimson glow — blood on bridge stones */}
        <radialGradient id="ch4_bloodStain" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3a1010" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#2a0c0c" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2a0c0c" stopOpacity="0" />
        </radialGradient>
        {/* Smoke pillar — rising thick cannon smoke */}
        <linearGradient id="ch4_smokePillar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#706058" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#605048" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#504038" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch4_sky)" />
      <rect width="800" height="400" fill="url(#ch4_sunGlow)" />

      {/* Stars appearing */}
      <circle cx="120" cy="25" r="1" fill="#e0d8c0" opacity="0.55" />
      <circle cx="280" cy="18" r="0.8" fill="#e0d8c0" opacity="0.45" />
      <circle cx="680" cy="30" r="0.9" fill="#e0d8c0" opacity="0.5" />
      <circle cx="450" cy="12" r="0.7" fill="#e0d8c0" opacity="0.4" />
      <circle cx="50" cy="15" r="0.6" fill="#d0c8a0" opacity="0.35" />
      <circle cx="750" cy="20" r="0.7" fill="#d0c8a0" opacity="0.4" />

      {/* === EVENING STAR — bright Venus appearing in darkening sky === */}
      <circle cx="580" cy="22" r="2.2" fill="#f0e8d0" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.6;0.85" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Star cross-rays */}
      <line x1="580" y1="15" x2="580" y2="29" stroke="#f0e8d0" strokeWidth="0.5" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.2;0.45" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="573" y1="22" x2="587" y2="22" stroke="#f0e8d0" strokeWidth="0.5" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.2;0.45" dur="3s" repeatCount="indefinite" />
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

      {/* === ADDITIONAL STARS — as dusk deepens, more become visible === */}
      <circle cx="340" cy="10" r="0.6" fill="#d0c8a0" opacity="0.3" />
      <circle cx="580" cy="8" r="0.5" fill="#d0c8a0" opacity="0.25" />
      <circle cx="720" cy="15" r="0.7" fill="#e0d8c0" opacity="0.35" />
      <circle cx="200" cy="28" r="0.5" fill="#d0c8a0" opacity="0.28" />
      <circle cx="480" cy="22" r="0.6" fill="#d0c8a0" opacity="0.32" />
      <circle cx="90" cy="35" r="0.5" fill="#d0c8a0" opacity="0.22" />
      <circle cx="640" cy="10" r="0.4" fill="#d0c8a0" opacity="0.2" />
      <circle cx="370" cy="16" r="0.55" fill="#e0d8c0" opacity="0.28" />
      {/* Dim constellation pattern — Ursa Major low on horizon */}
      <circle cx="700" cy="12" r="0.6" fill="#d0c8a0" opacity="0.3" />
      <circle cx="708" cy="16" r="0.55" fill="#d0c8a0" opacity="0.28" />
      <circle cx="716" cy="14" r="0.5" fill="#d0c8a0" opacity="0.25" />
      <circle cx="724" cy="18" r="0.55" fill="#d0c8a0" opacity="0.27" />
      {/* Faint star cluster — low in the purple */}
      <circle cx="50" cy="22" r="0.3" fill="#c0b890" opacity="0.18" />
      <circle cx="54" cy="20" r="0.3" fill="#c0b890" opacity="0.16" />
      <circle cx="52" cy="24" r="0.25" fill="#c0b890" opacity="0.14" />

      {/* === HORIZON GLOW GRADIENT BAND — warm light trapped between sky and clouds === */}
      <ellipse cx="400" cy="80" rx="380" ry="10" fill="#6a3530" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="8s" repeatCount="indefinite" />
      </ellipse>

      {/* Clouds catching last sunset light — more vivid */}
      <ellipse cx="250" cy="50" rx="140" ry="10" fill="#6a3538" opacity="0.4" />
      <ellipse cx="500" cy="38" rx="110" ry="8" fill="#7a4a40" opacity="0.35" />
      <ellipse cx="680" cy="55" rx="90" ry="7" fill="#6a3535" opacity="0.3" />
      <ellipse cx="130" cy="68" rx="100" ry="6" fill="#6a3538" opacity="0.25" />
      <ellipse cx="400" cy="65" rx="130" ry="7" fill="#5a3035" opacity="0.2" />

      {/* === SUNSET CLOUDS — dramatic formations with warm colors === */}
      {/* Large stratocumulus bank — rim-lit from below */}
      <ellipse cx="350" cy="72" rx="180" ry="14" fill="url(#ch4_sunsetCloud)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.6;0.8" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="350" cy="78" rx="160" ry="7" fill="url(#ch4_cloudRim)" opacity="0.75" />
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

      {/* === ADDITIONAL ATMOSPHERIC CLOUDS — catching the last warm light === */}
      {/* High mare's tail — feathery streaks across the darkening upper sky */}
      <path d="M30 18 Q80 14 140 20 Q180 16 220 22" fill="none" stroke="#5a3535" strokeWidth="0.8" opacity="0.14">
        <animateTransform attributeName="transform" type="translate" values="0,0;4,0;0,0" dur="22s" repeatCount="indefinite" />
      </path>
      <path d="M600 14 Q660 10 720 16 Q760 12 790 18" fill="none" stroke="#5a3535" strokeWidth="0.7" opacity="0.12">
        <animateTransform attributeName="transform" type="translate" values="0,0;-3,0;0,0" dur="19s" repeatCount="indefinite" />
      </path>
      {/* Warm-bellied cumulus — glowing orange underneath from sunset */}
      <ellipse cx="650" cy="42" rx="55" ry="10" fill="#4a2e30" opacity="0.22" />
      <ellipse cx="650" cy="46" rx="45" ry="5" fill="#8a5535" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.12;0.18" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Thin veil cloud — wide, barely visible, across mid-sky */}
      <path d="M0 58 Q150 52 300 56 Q450 50 600 54 Q700 50 800 55"
        fill="none" stroke="#4a3030" strokeWidth="3" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,0;0,0" dur="30s" repeatCount="indefinite" />
      </path>
      {/* Darkening cloud mass — upper left, night creeping in */}
      <ellipse cx="80" cy="35" rx="70" ry="12" fill="#1e1525" opacity="0.2" />
      {/* Small puff catching golden rim light — center right */}
      <ellipse cx="520" cy="62" rx="30" ry="6" fill="#4a3030" opacity="0.18" />
      <path d="M495 66 Q510 62 540 64" fill="none" stroke="#a06838" strokeWidth="0.6" opacity="0.15" />

      {/* === SUNSET RAYS — crepuscular beams breaking through cloud gaps === */}
      {/* Ray 1 — broad beam from center-left gap, angled down to river */}
      <polygon points="320,68 280,180 340,180" fill="url(#ch4_sunRay)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="6s" repeatCount="indefinite" />
      </polygon>
      {/* Ray 2 — narrower beam from right cloud gap */}
      <polygon points="580,55 560,170 590,170" fill="url(#ch4_sunRay)" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.2;0.35" dur="8s" repeatCount="indefinite" />
      </polygon>
      {/* Ray 3 — wide faint beam from left */}
      <polygon points="140,48 90,178 180,178" fill="url(#ch4_sunRay)" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.12;0.25" dur="10s" repeatCount="indefinite" />
      </polygon>
      {/* Ray 4 — thin beam catching dust particles */}
      <polygon points="460,52 440,160 470,160" fill="url(#ch4_sunRay)" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="7s" repeatCount="indefinite" />
      </polygon>
      {/* Ray 5 — broad golden ray from far left, illuminating bridge approach */}
      <polygon points="80,55 40,176 120,176" fill="url(#ch4_sunRay)" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="9s" repeatCount="indefinite" />
      </polygon>
      {/* Ray 6 — narrow intense beam hitting the river surface, creating bright patch */}
      <polygon points="680,48 665,175 695,175" fill="url(#ch4_sunRay)" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.08;0.22" dur="11s" repeatCount="indefinite" />
      </polygon>
      {/* Horizon glow band — concentrated orange at the sky/far-bank boundary */}
      <ellipse cx="400" cy="156" rx="400" ry="8" fill="#d08838" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* === DUST MOTES — tiny particles visible in sunset rays === */}
      <circle cx="310" cy="110" r="0.4" fill="#c0a870" opacity="0.25">
        <animate attributeName="cy" values="110;105;110" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="310;314;310" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="320" cy="130" r="0.3" fill="#c0a870" opacity="0.2">
        <animate attributeName="cy" values="130;126;130" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="320;323;320" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="295" cy="120" r="0.35" fill="#c0a870" opacity="0.18">
        <animate attributeName="cy" values="120;116;120" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="295;298;295" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="570" cy="100" r="0.3" fill="#c0a870" opacity="0.2">
        <animate attributeName="cy" values="100;96;100" dur="4.2s" repeatCount="indefinite" />
        <animate attributeName="cx" values="570;573;570" dur="5.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="95" r="0.35" fill="#c0a870" opacity="0.15">
        <animate attributeName="cy" values="95;90;95" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="450;454;450" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="330" cy="145" r="0.25" fill="#c0a870" opacity="0.22">
        <animate attributeName="cy" values="145;140;145" dur="3.8s" repeatCount="indefinite" />
      </circle>

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
        fill="#252018" opacity="0.8" />

      {/* === FAR BANK TREES — scattered poplars along the Lombardy plain === */}
      {/* Lombardy poplar 1 — tall, narrow, characteristic shape */}
      <path d="M155 154 Q155 140 155 130 Q153 128 155 125 Q157 128 155 130" fill="#1a1810" opacity="0.35" />
      <path d="M153 146 Q155 132 157 146 Q155 150 153 146 Z" fill="#1e2018" opacity="0.28" />
      {/* Lombardy poplar 2 — slightly shorter */}
      <path d="M340 153 Q340 142 340 134 Q338 132 340 130 Q342 132 340 134" fill="#1a1810" opacity="0.3" />
      <path d="M338 148 Q340 136 342 148 Q340 152 338 148 Z" fill="#1e2018" opacity="0.25" />
      {/* Lombardy poplar 3 — leaning slightly right, wind-shaped */}
      <path d="M385 155 Q386 144 387 136 Q385 134 387 131 Q389 134 387 136" fill="#1a1810" opacity="0.28" />
      <path d="M384 150 Q387 138 389 150 Q387 153 384 150 Z" fill="#1e2018" opacity="0.22" />
      {/* Low bushes on far bank — dark scrub */}
      <ellipse cx="200" cy="158" rx="12" ry="3" fill="#1a2018" opacity="0.2" />
      <ellipse cx="325" cy="157" rx="8" ry="2.5" fill="#1a2018" opacity="0.18" />
      <ellipse cx="360" cy="158" rx="10" ry="3" fill="#1a2018" opacity="0.16" />
      {/* Distant hedgerow — line of bushes along field boundary */}
      <path d="M400 154 Q420 152 450 154 Q470 152 500 155 Q520 153 540 155"
        fill="#1a1e15" opacity="0.15" />

      {/* Town of Lodi — distant buildings, more prominent */}
      <rect x="250" y="142" width="7" height="14" fill="#4a4038" opacity="0.6" />
      <path d="M248 142 L253 136 L259 142" fill="#504540" opacity="0.55" />
      <rect x="262" y="145" width="5" height="11" fill="#4a4038" opacity="0.6" />
      <rect x="272" y="140" width="6" height="16" fill="#4a4038" opacity="0.6" />
      <path d="M270 140 L275 132 L280 140" fill="#504540" opacity="0.55" />
      <rect x="284" y="143" width="4" height="13" fill="#4a4038" opacity="0.55" />
      <rect x="295" y="146" width="5" height="10" fill="#4a4038" opacity="0.55" />
      {/* Church tower */}
      <rect x="305" y="128" width="5" height="28" fill="#4a4038" opacity="0.65" />
      <path d="M303 128 L307 120 L312 128" fill="#504540" opacity="0.6" />
      <line x1="307" y1="120" x2="307" y2="115" stroke="#504540" strokeWidth="0.8" opacity="0.5" />

      {/* === EXPANDED TOWN OF LODI — more buildings, architectural detail === */}
      {/* Palazzo with arched windows — larger building to left of church */}
      <rect x="232" y="138" width="14" height="18" fill="#484038" opacity="0.6" />
      <path d="M230 138 L239 130 L248 138" fill="#504540" opacity="0.55" />
      {/* Arched windows — 3 across upper floor */}
      <path d="M234 142 Q235 140 236 142" fill="none" stroke="#a08050" strokeWidth="0.4" opacity="0.12" />
      <path d="M238 142 Q239 140 240 142" fill="none" stroke="#a08050" strokeWidth="0.4" opacity="0.1" />
      <path d="M242 142 Q243 140 244 142" fill="none" stroke="#a08050" strokeWidth="0.4" opacity="0.12" />
      {/* Ground floor doorway */}
      <rect x="237" y="150" width="3" height="6" fill="#2a2218" opacity="0.3" />
      {/* Smaller dwelling — right of church */}
      <rect x="316" y="144" width="8" height="12" fill="#4a4038" opacity="0.55" />
      <path d="M314 144 L320 138 L326 144" fill="#504540" opacity="0.5" />
      {/* Chimney — smoking faintly */}
      <rect x="322" y="136" width="2" height="4" fill="#484038" opacity="0.45" />
      <path d="M323 136 Q322 132 324 128 Q326 124 323 120" fill="none" stroke="#5a4a40" strokeWidth="0.6" opacity="0.04">
        <animateTransform attributeName="transform" type="translate" values="0,0;2,-1;0,0" dur="8s" repeatCount="indefinite" />
      </path>
      {/* Row of houses — stepped roofline behind main buildings */}
      <rect x="258" y="144" width="4" height="12" fill="#444038" opacity="0.5" />
      <rect x="263" y="142" width="5" height="14" fill="#3e3830" opacity="0.48" />
      <rect x="269" y="145" width="4" height="11" fill="#444038" opacity="0.5" />
      {/* Bridge gate tower — fortified entrance on the far bank side */}
      <rect x="240" y="140" width="6" height="16" fill="#4a4238" opacity="0.58" />
      <path d="M240 140 L243 134 L246 140" fill="#504840" opacity="0.5" />
      {/* Small crenellations on gate tower */}
      <rect x="240" y="139" width="1.5" height="2" fill="#504840" opacity="0.4" />
      <rect x="243" y="139" width="1.5" height="2" fill="#504840" opacity="0.4" />
      {/* Town wall fragment — low wall connecting buildings */}
      <path d="M246 152 Q250 151 254 152 Q258 151 262 152" fill="none" stroke="#4a4038" strokeWidth="1.5" opacity="0.35" />
      {/* Balcony on palazzo — wrought iron railings */}
      <line x1="233" y1="146" x2="247" y2="146" stroke="#3a3530" strokeWidth="0.5" opacity="0.2" />
      {/* Church cross atop spire */}
      <line x1="305" y1="115" x2="309" y2="115" stroke="#6a6050" strokeWidth="0.6" opacity="0.35" />
      <line x1="307" y1="113" x2="307" y2="117" stroke="#6a6050" strokeWidth="0.6" opacity="0.35" />
      {/* Rose window on church front */}
      <circle cx="307" cy="135" r="1.8" fill="none" stroke="#5a5040" strokeWidth="0.4" opacity="0.2" />
      {/* Church entrance arch */}
      <path d="M305 148 Q307 144 309 148" fill="none" stroke="#3a3020" strokeWidth="0.6" opacity="0.25" />
      {/* Bell tower window openings — dark arched voids */}
      <path d="M306 130 Q307 128 308 130" fill="#2a2218" opacity="0.3" />
      <path d="M306 134 Q307 132 308 134" fill="#2a2218" opacity="0.25" />
      {/* Distant warehouse / granary — long low building right of town */}
      <rect x="330" y="148" width="16" height="8" fill="#3e3830" opacity="0.45" />
      <path d="M328 148 L338 142 L348 148" fill="#444038" opacity="0.4" />
      {/* Large door opening on warehouse */}
      <rect x="335" y="151" width="4" height="5" fill="#1e1810" opacity="0.25" />
      {/* Stone bridge abutment — where the bridge meets the far bank */}
      <path d="M248 156 Q255 154 262 156 L262 164 Q255 162 248 164 Z" fill="#484038" opacity="0.45" />
      <path d="M248 158 Q255 156 262 158" fill="none" stroke="#3a3428" strokeWidth="0.3" opacity="0.2" />
      <path d="M248 160 Q255 158 262 160" fill="none" stroke="#3a3428" strokeWidth="0.3" opacity="0.18" />
      <path d="M248 162 Q255 160 262 162" fill="none" stroke="#3a3428" strokeWidth="0.3" opacity="0.16" />
      {/* Cypress tree — classic Italian silhouette by the church */}
      <path d="M314 155 Q314 145 314 138 Q312 136 314 132 Q316 136 314 138" fill="#1a1810" opacity="0.32" />
      <path d="M313 150 Q314 140 315 150 Q314 154 313 150 Z" fill="#1a2018" opacity="0.25" />
      {/* Second cypress — left of town */}
      <path d="M228 155 Q228 148 228 142 Q226 140 228 138 Q230 140 228 142" fill="#1a1810" opacity="0.28" />
      <path d="M227 152 Q228 144 229 152 Q228 155 227 152 Z" fill="#1a2018" opacity="0.22" />
      {/* Town lantern — faint light on a post near the gate */}
      <line x1="248" y1="148" x2="248" y2="156" stroke="#3a3020" strokeWidth="0.6" opacity="0.25" />
      <circle cx="248" cy="148" r="1" fill="#c09040" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.05;0.1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* === DISTANT SOLDIERS ON FAR BANK — second celebrating group === */}
      {/* Small cluster near the town, celebrating by a distant fire */}
      {/* Distant fire glow */}
      <ellipse cx="220" cy="156" rx="8" ry="2.5" fill="#c08040" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Distant fire flame — tiny */}
      <path d="M219 155 Q220 151 221 155" fill="#d09050" opacity="0.18">
        <animate attributeName="d" values="M219 155 Q220 151 221 155;M219 155 Q220 150 221 155;M219 155 Q220 151 221 155" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Distant soldiers — very small silhouettes, 5 figures */}
      <path d="M210 155 Q209 152 210 150 Q211 152 212 155 Z" fill="#1a1510" opacity="0.35" />
      <circle cx="210" cy="149.5" r="1.2" fill="#1a1510" opacity="0.35" />
      <path d="M215 154 Q214 151 215 149 Q216 151 217 154 Z" fill="#1a1510" opacity="0.32" />
      <circle cx="215" cy="148.5" r="1.1" fill="#1a1510" opacity="0.32" />
      <path d="M225 155 Q224 152 225 150 Q226 152 227 155 Z" fill="#1a1510" opacity="0.33" />
      <circle cx="225" cy="149.5" r="1.1" fill="#1a1510" opacity="0.33" />
      <path d="M230 154 Q229 151 230 149 Q231 151 232 154 Z" fill="#1a1510" opacity="0.3" />
      <circle cx="230" cy="148.5" r="1" fill="#1a1510" opacity="0.3" />
      {/* One with arm raised — celebrating */}
      <path d="M222 155 Q221 152 222 149 Q223 152 224 155 Z" fill="#1a1510" opacity="0.35" />
      <circle cx="222" cy="148.5" r="1.2" fill="#1a1510" opacity="0.35" />
      <path d="M223 151 Q225 148 226 146" fill="none" stroke="#1a1510" strokeWidth="0.5" opacity="0.25">
        <animate attributeName="d" values="M223 151 Q225 148 226 146;M223 151 Q225 147 227 145;M223 151 Q225 148 226 146" dur="2s" repeatCount="indefinite" />
      </path>

      {/* === MOUNTED OFFICER ON FAR BANK — Napoleon? riding across in the distance === */}
      {/* Horse body — small, distant silhouette */}
      <path d="M180 153 Q185 150 192 151 Q196 150 198 152 Q200 154 198 156 Q192 158 186 158 Q180 158 178 156 Q177 154 180 153 Z" fill="#1a1510" opacity="0.4" />
      {/* Horse legs — short strokes */}
      <line x1="183" y1="158" x2="182" y2="162" stroke="#1a1510" strokeWidth="0.7" opacity="0.35" />
      <line x1="189" y1="158" x2="190" y2="162" stroke="#1a1510" strokeWidth="0.7" opacity="0.35" />
      <line x1="194" y1="157" x2="195" y2="161" stroke="#1a1510" strokeWidth="0.7" opacity="0.3" />
      {/* Rider — upright figure on horse */}
      <path d="M188 152 Q187 147 188 143 Q189 147 190 152 Z" fill="#1a1510" opacity="0.4" />
      <circle cx="188" cy="142" r="1.8" fill="#1a1510" opacity="0.4" />
      {/* Bicorne hat — distinctive Napoleon silhouette */}
      <path d="M185 142 Q186 140 188 139 Q190 140 191 142 Q188 141 185 142" fill="#1a1510" opacity="0.35" />
      {/* Horse neck */}
      <path d="M180 153 Q178 148 177 145 Q176 143 178 142 Q180 141 181 143" fill="#1a1510" opacity="0.38" />
      {/* Horse tail */}
      <path d="M198 154 Q202 156 200 160" fill="none" stroke="#1a1510" strokeWidth="0.7" opacity="0.3" />
      {/* Slow riding animation — gentle bob */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;4,0;6,0" dur="12s" repeatCount="indefinite" />
      </g>

      {/* === DISTANT FIRES — buildings burning in town outskirts after the battle === */}
      {/* Burning structure 1 — left of town, roofline glow */}
      <ellipse cx="238" cy="148" rx="8" ry="4" fill="url(#ch4_distantBurn)">
        <animate attributeName="opacity" values="1;0.5;1" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Flame flicker — tiny orange tongue above roofline */}
      <path d="M236 148 Q237 143 238 148" fill="#d07030" opacity="0.25">
        <animate attributeName="d" values="M236 148 Q237 143 238 148;M236 148 Q238 140 239 148;M236 148 Q237 143 238 148" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M239 148 Q240 144 241 148" fill="#e08840" opacity="0.2">
        <animate attributeName="d" values="M239 148 Q240 144 241 148;M239 148 Q241 141 242 148;M239 148 Q240 144 241 148" dur="0.5s" repeatCount="indefinite" />
      </path>
      {/* Burning structure 2 — right of town, smaller */}
      <ellipse cx="320" cy="146" rx="5" ry="3" fill="url(#ch4_distantBurn)">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <path d="M319 146 Q320 142 321 146" fill="#d07030" opacity="0.18">
        <animate attributeName="d" values="M319 146 Q320 142 321 146;M319 146 Q320 139 321 146;M319 146 Q320 142 321 146" dur="0.7s" repeatCount="indefinite" />
      </path>
      {/* Smoke columns rising from distant fires — thin vertical wisps */}
      <path d="M237 145 Q236 138 238 130 Q240 124 237 118" fill="none" stroke="#5a4a40" strokeWidth="1.5" opacity="0.08">
        <animateTransform attributeName="transform" type="translate" values="0,0;3,-2;0,0" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M320 143 Q319 136 321 128 Q323 122 320 116" fill="none" stroke="#5a4a40" strokeWidth="1" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;2,-1;0,0" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="7s" repeatCount="indefinite" />
      </path>

      {/* === FAR BANK FIELD DETAILS — Italian countryside beyond the river === */}
      {/* Stone wall — low fieldstone boundary along road */}
      <path d="M400 155 Q430 154 460 155 Q490 154 520 155" fill="none" stroke="#3a3428" strokeWidth="1" opacity="0.15" />
      {/* Wall stones — individual blocks visible */}
      {[405, 415, 425, 435, 445, 455, 465, 475, 485, 495, 505, 515].map((x, i) => (
        <rect key={`wall${i}`} x={x} y={154} width={5} height={2.5} rx={0.3}
          fill="#3a3428" opacity={0.1 + (i % 3) * 0.02} />
      ))}
      {/* Dirt road — track running along the far bank */}
      <path d="M160 158 Q220 156 280 158 Q340 156 400 158 Q460 156 520 158 Q580 156 640 158"
        fill="none" stroke="#2a2518" strokeWidth="2" opacity="0.08" />
      {/* Road ruts visible */}
      <path d="M200 157 Q260 155 320 157 Q380 155 440 157" fill="none" stroke="#221e15" strokeWidth="0.5" opacity="0.06" />
      {/* Vineyard rows — distant angled lines (Lombardy agriculture) */}
      <g opacity="0.06">
        <line x1="420" y1="152" x2="440" y2="148" stroke="#1a2018" strokeWidth="0.5" />
        <line x1="430" y1="152" x2="450" y2="148" stroke="#1a2018" strokeWidth="0.5" />
        <line x1="440" y1="152" x2="460" y2="148" stroke="#1a2018" strokeWidth="0.5" />
        <line x1="450" y1="152" x2="470" y2="148" stroke="#1a2018" strokeWidth="0.5" />
      </g>
      {/* Haystacks — small rounded shapes in a field */}
      <ellipse cx="480" cy="153" rx="4" ry="2.5" fill="#2a2518" opacity="0.12" />
      <ellipse cx="490" cy="154" rx="3.5" ry="2" fill="#2a2518" opacity="0.1" />
      {/* Farmhouse — small distant building beyond the town */}
      <rect x="428" y="148" width="5" height="6" fill="#3a3428" opacity="0.25" />
      <path d="M427 148 L430 144 L434 148" fill="#3e3830" opacity="0.2" />
      {/* Additional Lombardy poplars — extending the tree line */}
      <path d="M200 155 Q200 146 200 140 Q198 138 200 136 Q202 138 200 140" fill="#1a1810" opacity="0.25" />
      <path d="M199 150 Q200 142 201 150 Q200 154 199 150 Z" fill="#1e2018" opacity="0.2" />
      <path d="M480 154 Q480 146 480 140 Q478 138 480 136 Q482 138 480 140" fill="#1a1810" opacity="0.22" />
      <path d="M479 150 Q480 142 481 150 Q480 154 479 150 Z" fill="#1e2018" opacity="0.18" />
      <path d="M560 155 Q560 148 560 142 Q558 140 560 138 Q562 140 560 142" fill="#1a1810" opacity="0.2" />
      <path d="M559 152 Q560 144 561 152 Q560 155 559 152 Z" fill="#1e2018" opacity="0.16" />
      {/* Willow tree — drooping branches near water, far bank */}
      <path d="M130 157 Q130 148 130 142" fill="none" stroke="#1a1810" strokeWidth="1.2" opacity="0.22" />
      <path d="M128 145 Q124 150 120 156" fill="none" stroke="#1a2018" strokeWidth="0.6" opacity="0.12" />
      <path d="M130 144 Q126 152 122 158" fill="none" stroke="#1a2018" strokeWidth="0.5" opacity="0.1" />
      <path d="M132 145 Q136 152 138 158" fill="none" stroke="#1a2018" strokeWidth="0.6" opacity="0.12" />
      <path d="M130 143 Q134 150 136 156" fill="none" stroke="#1a2018" strokeWidth="0.5" opacity="0.1" />

      {/* === AUSTRIAN ABANDONED CANNONS — on the far bank, overrun during the charge === */}
      {/* Abandoned cannon 1 — knocked sideways, crew fled */}
      <path d="M350 155 L365 153 L366 155 L351 157 Z" fill="#2a2420" opacity="0.35" />
      <circle cx="354" cy="158" r="3" fill="#2a2420" opacity="0.35" />
      <circle cx="362" cy="157" r="3" fill="#2a2420" opacity="0.35" />
      {/* Barrel pointing upward at odd angle — gun was hit */}
      <path d="M366 153 L372 150 L373 151 L367 155 Z" fill="#2a2218" opacity="0.3" />
      {/* Abandoned cannon 2 — further left, limbered with dead horse nearby */}
      <path d="M150 155 L162 153 L163 155 L151 157 Z" fill="#2a2420" opacity="0.3" />
      <circle cx="154" cy="158" r="2.5" fill="#2a2420" opacity="0.3" />
      {/* Dead horse shape — dark lump near abandoned gun */}
      <path d="M140 156 Q145 152 152 154 Q148 158 142 158 Z" fill="#1a1510" opacity="0.25" />

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
      {/* Bridge deck — solid visible surface */}
      <path d="M255 167 Q320 162 380 163 Q440 162 500 163 Q540 164 565 167 L565 170 Q540 167 500 166 Q440 165 380 166 Q320 165 255 170 Z"
        fill="url(#ch4_bridgeDeck)" opacity="0.75" />
      {/* Bridge deck top edge — highlight */}
      <path d="M258 167 Q320 162 380 163 Q440 162 500 163 Q540 164 562 167"
        fill="none" stroke="#6a5a40" strokeWidth="1.5" opacity="0.6" />
      {/* Bridge deck bottom edge — shadow */}
      <path d="M258 170 Q320 165 380 166 Q440 165 500 166 Q540 167 562 170"
        fill="none" stroke="#2a2018" strokeWidth="1" opacity="0.5" />
      {/* Bridge supports — pontoon boats (larger, more visible) */}
      {[280, 310, 340, 370, 400, 430, 460, 490, 530].map((x) => (
        <React.Fragment key={`br${x}`}>
          {/* Vertical timber support */}
          <line x1={x} y1={165 + (Math.abs(x - 400) / 200)} x2={x} y2={173} stroke="#5a5038" strokeWidth="1.5" opacity="0.55" />
          {/* Diagonal bracing timber */}
          <line x1={x - 4} y1={166 + (Math.abs(x - 400) / 200)} x2={x} y2={173} stroke="#4a4030" strokeWidth="0.8" opacity="0.3" />
          <line x1={x + 4} y1={166 + (Math.abs(x - 400) / 200)} x2={x} y2={173} stroke="#4a4030" strokeWidth="0.8" opacity="0.3" />
          {/* Pontoon boat hull — flat-bottomed river boat */}
          <path d={`M${x - 7} ${173} Q${x - 6} ${170} ${x} ${169.5} Q${x + 6} ${170} ${x + 7} ${173} Q${x + 4} ${176.5} ${x - 4} ${176.5} Z`}
            fill="#3a3020" opacity="0.5" />
          {/* Hull planking detail — horizontal strakes */}
          <path d={`M${x - 5} ${172} Q${x} ${171} ${x + 5} ${172}`}
            fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.25" />
          <path d={`M${x - 6} ${174} Q${x} ${173} ${x + 6} ${174}`}
            fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.2" />
          {/* Pontoon waterline — wet mark */}
          <path d={`M${x - 5} ${174} Q${x} ${172.5} ${x + 5} ${174}`}
            fill="none" stroke="#4a4030" strokeWidth="0.6" opacity="0.35" />
          {/* Water lapping at hull — small animated ripple */}
          <path d={`M${x - 6} ${174.5} Q${x - 3} ${173.5} ${x} ${174.5}`}
            fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.12">
            <animate attributeName="opacity" values="0.12;0.05;0.12" dur={`${2 + (x % 3)}s`} repeatCount="indefinite" />
          </path>
          {/* Iron ring on hull — mooring point */}
          <circle cx={x - 5} cy={172} r="0.6" fill="none" stroke="#4a4540" strokeWidth="0.4" opacity="0.2" />
        </React.Fragment>
      ))}
      {/* Bridge railing — left side, more prominent */}
      <path d="M265 161 Q320 157 380 158 Q440 157 500 158 Q540 159 558 162"
        fill="none" stroke="#6a5a40" strokeWidth="1.2" opacity="0.5" />
      {/* Bridge railing — right/lower side */}
      <path d="M265 172 Q320 168 380 169 Q440 168 500 169 Q540 170 558 172"
        fill="none" stroke="#4a3a28" strokeWidth="0.8" opacity="0.35" />

      {/* === DETAILED BRIDGE STONEWORK — individual blocks visible on parapet === */}
      {/* Parapet stone blocks — left section */}
      {[272, 280, 288, 296, 304, 312, 320, 328].map((x, i) => (
        <rect key={`stL${i}`} x={x} y={159} width={7} height={3} rx={0.3} fill="#5a5038" opacity={0.4} stroke="#4a4030" strokeWidth={0.4} />
      ))}
      {/* Parapet stone blocks — center section */}
      {[338, 346, 354, 362, 370, 378, 386, 394, 402, 410].map((x, i) => (
        <rect key={`stC${i}`} x={x} y={158.5} width={7} height={3} rx={0.3} fill="#5a5038" opacity={0.38} stroke="#4a4030" strokeWidth={0.4} />
      ))}
      {/* Parapet stone blocks — right section */}
      {[420, 428, 436, 444, 452, 460, 468, 476, 484, 492, 500, 508].map((x, i) => (
        <rect key={`stR${i}`} x={x} y={159} width={7} height={3} rx={0.3} fill="#5a5038" opacity={0.4} stroke="#4a4030" strokeWidth={0.4} />
      ))}
      {/* Arch keystones — visible at bridge arch crowns between supports */}
      {/* Keystone 1 — between supports at ~340 */}
      <path d="M336 170 L338 166 L342 166 L344 170 Z" fill="#504838" opacity="0.25" />
      <line x1="340" y1="166" x2="340" y2="170" stroke="#3a3428" strokeWidth="0.3" opacity="0.2" />
      {/* Keystone 2 — center arch */}
      <path d="M396 169 L398 165 L402 165 L404 169 Z" fill="#504838" opacity="0.28" />
      <line x1="400" y1="165" x2="400" y2="169" stroke="#3a3428" strokeWidth="0.3" opacity="0.22" />
      {/* Keystone 3 — right arch */}
      <path d="M456 170 L458 166 L462 166 L464 170 Z" fill="#504838" opacity="0.25" />
      <line x1="460" y1="166" x2="460" y2="170" stroke="#3a3428" strokeWidth="0.3" opacity="0.2" />
      {/* Arch voussoir stones — radiating blocks around each keystone */}
      {/* Left arch voussoirs */}
      <path d="M330 172 L333 168 L336 170 L334 173 Z" fill="#484030" opacity="0.18" />
      <path d="M344 170 L347 168 L349 172 L346 173 Z" fill="#484030" opacity="0.18" />
      {/* Center arch voussoirs */}
      <path d="M390 171 L393 167 L396 169 L394 172 Z" fill="#484030" opacity="0.2" />
      <path d="M404 169 L407 167 L409 171 L406 172 Z" fill="#484030" opacity="0.2" />
      {/* Right arch voussoirs */}
      <path d="M450 172 L453 168 L456 170 L454 173 Z" fill="#484030" opacity="0.18" />
      <path d="M464 170 L467 168 L469 172 L466 173 Z" fill="#484030" opacity="0.18" />

      {/* === IRON CHAIN LINKS — hanging between bridge supports, period authentic === */}
      {[295, 355, 415, 475].map((x) => (
        <React.Fragment key={`chain${x}`}>
          {/* Catenary chain — sagging between pylons */}
          <path d={`M${x - 15} ${172} Q${x} ${178} ${x + 15} ${172}`}
            fill="none" stroke="#3a3530" strokeWidth="0.8" opacity="0.3" />
          {/* Chain link detail dots — iron links catching firelight */}
          <circle cx={x - 8} cy={174} r="0.5" fill="#4a4540" opacity="0.25" />
          <circle cx={x} cy={176} r="0.5" fill="#4a4540" opacity="0.25" />
          <circle cx={x + 8} cy={174} r="0.5" fill="#4a4540" opacity="0.25" />
        </React.Fragment>
      ))}

      {/* === ROPE LASHINGS ON PONTOONS — securing the bridge together === */}
      {/* Rope ties between pontoons — visible cordage holding the structure */}
      {[295, 325, 355, 385, 415, 445, 475, 505].map((x) => (
        <React.Fragment key={`rope${x}`}>
          {/* Horizontal rope between pontoons */}
          <path d={`M${x - 8} ${174} Q${x} ${173} ${x + 8} ${174}`}
            fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.2" />
          {/* Rope wrapping around support post */}
          <path d={`M${x - 1} ${168} Q${x + 1} ${170} ${x - 1} ${172}`}
            fill="none" stroke="#3a3520" strokeWidth="0.4" opacity="0.15" />
          {/* Loose rope end dangling */}
          <path d={`M${x + 6} ${174} Q${x + 7} ${176} ${x + 5} ${178}`}
            fill="none" stroke="#3a3520" strokeWidth="0.3" opacity="0.1" />
        </React.Fragment>
      ))}
      {/* Anchor chain — heavy chain from near bank tethering the bridge */}
      <path d="M258 170 Q250 178 240 188 Q232 200 228 210" fill="none" stroke="#3a3530" strokeWidth="1.2" opacity="0.2" />
      {/* Chain link details */}
      <circle cx="250" cy="178" r="0.8" fill="#4a4540" opacity="0.15" />
      <circle cx="240" cy="188" r="0.8" fill="#4a4540" opacity="0.12" />
      <circle cx="232" cy="200" r="0.8" fill="#4a4540" opacity="0.1" />
      {/* Far bank anchor chain */}
      <path d="M562 170 Q568 178 576 188 Q582 200 586 210" fill="none" stroke="#3a3530" strokeWidth="1.2" opacity="0.18" />
      <circle cx="568" cy="178" r="0.8" fill="#4a4540" opacity="0.14" />
      <circle cx="576" cy="188" r="0.8" fill="#4a4540" opacity="0.11" />
      {/* Cross-bracing timbers visible underneath bridge — X-pattern */}
      {[300, 350, 400, 450, 500].map((x) => (
        <React.Fragment key={`xbrace${x}`}>
          <line x1={x - 10} y1={167} x2={x + 10} y2={174} stroke="#4a4030" strokeWidth="0.5" opacity="0.15" />
          <line x1={x + 10} y1={167} x2={x - 10} y2={174} stroke="#4a4030" strokeWidth="0.5" opacity="0.15" />
        </React.Fragment>
      ))}
      {/* Bridge approach ramp — near bank side, planked incline */}
      <path d="M248 170 Q240 178 228 186 Q220 192 216 196" fill="none" stroke="#4a3a28" strokeWidth="1.5" opacity="0.3" />
      <path d="M252 172 Q244 180 232 188 Q224 194 220 198" fill="none" stroke="#5a4a38" strokeWidth="1" opacity="0.2" />
      {/* Ramp planking lines */}
      <line x1="244" y1="176" x2="248" y2="172" stroke="#3a3020" strokeWidth="0.3" opacity="0.1" />
      <line x1="240" y1="180" x2="244" y2="176" stroke="#3a3020" strokeWidth="0.3" opacity="0.1" />
      <line x1="236" y1="184" x2="240" y2="180" stroke="#3a3020" strokeWidth="0.3" opacity="0.1" />
      {/* Far bank approach ramp */}
      <path d="M566 170 Q574 178 584 186 Q590 190 594 194" fill="none" stroke="#4a3a28" strokeWidth="1.5" opacity="0.25" />
      <path d="M562 172 Q570 180 580 188 Q586 192 590 196" fill="none" stroke="#5a4a38" strokeWidth="1" opacity="0.18" />

      {/* === STONE BALUSTRADE POSTS — along the bridge === */}
      {[285, 315, 345, 375, 405, 435, 465, 495, 525].map((x) => (
        <React.Fragment key={`bal${x}`}>
          {/* Post base */}
          <rect x={x - 1.5} y={158} width={3} height={6} fill="#5a5040" opacity="0.55" />
          {/* Post cap — rounded top */}
          <circle cx={x} cy={157.5} r={2} fill="#686050" opacity="0.5" />
          {/* Post highlight */}
          <line x1={x - 0.5} y1={158.5} x2={x - 0.5} y2={163} stroke="#7a7060" strokeWidth="0.4" opacity="0.25" />
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

      {/* === WOOD PLANK TEXTURE — individual boards visible on bridge deck === */}
      {/* Longitudinal plank lines across the bridge deck */}
      {[270, 278, 286, 294, 302, 310, 318, 326, 334, 342, 350, 358, 366, 374, 382, 390, 398, 406, 414, 422, 430, 438, 446, 454, 462, 470, 478, 486, 494, 502, 510, 518, 526, 534, 542, 550].map((x, i) => (
        <line key={`plank${i}`} x1={x} y1={163.5 + (Math.abs(x - 400) / 250)} x2={x + 6} y2={163.5 + (Math.abs(x + 6 - 400) / 250)}
          stroke="#2a2015" strokeWidth="0.3" opacity={0.08 + (i % 3) * 0.02} />
      ))}
      {/* Cross-plank joints — perpendicular nail lines */}
      {[290, 320, 350, 380, 410, 440, 470, 500, 530].map((x, i) => (
        <line key={`joint${i}`} x1={x} y1={162.5} x2={x} y2={165.5} stroke="#1e1a10" strokeWidth="0.25" opacity={0.06 + (i % 2) * 0.03} />
      ))}
      {/* Wood grain texture overlay — subtle horizontal fiber lines */}
      <rect x="270" y="163" width="280" height="3" fill="url(#ch4_woodGrain)" opacity="0.4" />
      {/* Warped and raised plank — buckled from cannon impact */}
      <path d="M395 163 Q398 161 401 163" fill="none" stroke="#3a3020" strokeWidth="0.5" opacity="0.15" />
      <path d="M397 162 L399 160 L401 162" fill="#3a3020" opacity="0.06" />
      {/* Splintered plank edge — torn wood fibers at damage point */}
      <path d="M418 163 Q419 161 420 163" fill="none" stroke="#3a3020" strokeWidth="0.4" opacity="0.12" />
      <path d="M416 164 Q417 162 418 164 Q418.5 161.5 419 164" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.1" />
      {/* Nail heads — periodic dark dots along plank edges */}
      {[282, 310, 338, 366, 394, 422, 450, 478, 506, 534].map((x, i) => (
        <circle key={`nail${i}`} cx={x} cy={164 + (Math.abs(x - 400) / 300)} r="0.4" fill="#12100a" opacity={0.1 + (i % 2) * 0.04} />
      ))}

      {/* === ADDITIONAL RAILING DAMAGE — battle-torn balustrade === */}
      {/* Shattered railing section — gap at 440-455 where cannon ball passed through */}
      <line x1="440" y1="160" x2="443" y2="155" stroke="#504838" strokeWidth="0.7" opacity="0.22" />
      <line x1="445" y1="160" x2="444" y2="153" stroke="#504838" strokeWidth="0.5" opacity="0.18" />
      <line x1="450" y1="160" x2="453" y2="156" stroke="#504838" strokeWidth="0.6" opacity="0.2" />
      {/* Fallen stone block from railing — on bridge deck */}
      <rect x="441" y="164" width="3.5" height="2" rx="0.3" fill="#484030" opacity="0.22" transform="rotate(12 443 165)" />
      <rect x="447" y="165" width="2.5" height="1.8" rx="0.2" fill="#484030" opacity="0.18" transform="rotate(-8 448 166)" />
      {/* Railing chips and cracks at other sections */}
      <path d="M310 160 Q311 158 313 160" fill="none" stroke="#3a3428" strokeWidth="0.4" opacity="0.12" />
      <path d="M502 159 Q503 157 505 159" fill="none" stroke="#3a3428" strokeWidth="0.4" opacity="0.1" />

      {/* === CANNON IMPACT CRATERS — large blasts that cratered the bridge deck === */}
      {/* Major impact — center bridge, cannon ball punched through surface layer */}
      <ellipse cx="388" cy="164" rx="5" ry="2.5" fill="url(#ch4_blastSoot)" />
      <ellipse cx="388" cy="164" rx="3" ry="1.5" fill="#0e0804" opacity="0.15" />
      {/* Radiating crack lines from major impact */}
      <line x1="384" y1="163" x2="380" y2="162" stroke="#1a1008" strokeWidth="0.3" opacity="0.12" />
      <line x1="392" y1="163" x2="396" y2="162" stroke="#1a1008" strokeWidth="0.3" opacity="0.12" />
      <line x1="387" y1="166" x2="385" y2="168" stroke="#1a1008" strokeWidth="0.3" opacity="0.1" />
      <line x1="390" y1="166" x2="393" y2="168" stroke="#1a1008" strokeWidth="0.3" opacity="0.1" />
      {/* Secondary impact — right side */}
      <ellipse cx="505" cy="164" rx="3.5" ry="2" fill="url(#ch4_blastSoot)" />
      <line x1="502" y1="163" x2="499" y2="162" stroke="#1a1008" strokeWidth="0.25" opacity="0.1" />
      <line x1="508" y1="163" x2="511" y2="162" stroke="#1a1008" strokeWidth="0.25" opacity="0.1" />
      {/* Smoldering debris on bridge — still hot from the battle */}
      <ellipse cx="362" cy="164" rx="2" ry="1" fill="url(#ch4_smolder)">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="428" cy="164" rx="1.5" ry="0.8" fill="url(#ch4_smolder)">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === BLOOD STAINS ON BRIDGE — dark crimson smears from the carnage === */}
      {/* Large blood pool — center bridge where fighting was thickest */}
      <ellipse cx="395" cy="164" rx="6" ry="2" fill="url(#ch4_bloodStain)" />
      {/* Smaller blood splash — near fallen body */}
      <ellipse cx="370" cy="163" rx="3.5" ry="1.5" fill="url(#ch4_bloodStain)" />
      {/* Blood trail — dragged toward railing */}
      <path d="M440 163 Q442 164 445 163" fill="none" stroke="#3a1010" strokeWidth="0.6" opacity="0.1" />
      {/* Spatter marks — individual droplets */}
      <circle cx="415" cy="163" r="0.6" fill="#2a0c0c" opacity="0.1" />
      <circle cx="418" cy="164" r="0.4" fill="#2a0c0c" opacity="0.08" />
      <circle cx="360" cy="164" r="0.5" fill="#2a0c0c" opacity="0.09" />

      {/* === BRIDGE DEBRIS — scattered from the charge === */}
      {/* Stone chips and rubble on bridge deck */}
      <circle cx="355" cy="165" r="0.6" fill="#484030" opacity="0.15" />
      <circle cx="358" cy="164" r="0.4" fill="#484030" opacity="0.12" />
      <circle cx="410" cy="165" r="0.5" fill="#484030" opacity="0.14" />
      <circle cx="413" cy="164" r="0.7" fill="#484030" opacity="0.11" />
      <circle cx="455" cy="165" r="0.5" fill="#484030" opacity="0.13" />
      {/* Broken musket fragment on bridge */}
      <line x1="372" y1="164" x2="378" y2="163" stroke="#2a2518" strokeWidth="0.7" opacity="0.15" />
      {/* Second broken musket — stock and bent barrel */}
      <line x1="425" y1="164" x2="434" y2="163" stroke="#2a2518" strokeWidth="0.8" opacity="0.14" />
      <line x1="434" y1="163" x2="436" y2="162" stroke="#4a4030" strokeWidth="0.5" opacity="0.1" />
      {/* Splinter of wood — thrown up from plank */}
      <line x1="400" y1="163" x2="402" y2="160" stroke="#3a3020" strokeWidth="0.35" opacity="0.12" />
      <line x1="403" y1="164" x2="404" y2="161" stroke="#3a3020" strokeWidth="0.3" opacity="0.1" />
      {/* Dropped cartridge box — small dark rectangle */}
      <rect x="388" y="164" width="3" height="2" rx="0.3" fill="#1a1510" opacity="0.2" transform="rotate(18 389 165)" />
      {/* Bayonet stuck in bridge planking */}
      <line x1="452" y1="165" x2="451" y2="160" stroke="#5a5040" strokeWidth="0.7" opacity="0.2" />
      <line x1="451" y1="160" x2="449" y2="158" stroke="#5a5040" strokeWidth="0.4" opacity="0.15" />

      {/* === CHARGING SOLDIERS ON BRIDGE — the famous charge across Lodi bridge === */}
      {/* Grenadier 1 — leading the charge, sword raised high, running left-to-right */}
      <path d="M340 155 Q338 148 340 142 Q342 136 344 142 L346 155 Z" fill="#0e0c08" opacity="0.85" />
      <circle cx="342" cy="136" r="3.5" fill="#0e0c08" opacity="0.85" />
      {/* Bearskin cap — tall grenadier hat silhouette */}
      <path d="M339 136 Q340 128 342 126 Q344 128 345 136" fill="#0e0c08" opacity="0.75" />
      {/* Sword arm raised */}
      <path d="M346 144 Q352 136 356 130" fill="none" stroke="#0e0c08" strokeWidth="1.8" opacity="0.7" />
      {/* Sword blade */}
      <line x1="356" y1="130" x2="360" y2="122" stroke="#6a6050" strokeWidth="0.8" opacity="0.5" />
      {/* Running legs */}
      <line x1="340" y1="155" x2="336" y2="165" stroke="#0e0c08" strokeWidth="1.5" opacity="0.7" />
      <line x1="344" y1="155" x2="350" y2="164" stroke="#0e0c08" strokeWidth="1.5" opacity="0.7" />

      {/* Grenadier 2 — just behind, bayonet forward */}
      <path d="M320 156 Q318 149 320 143 Q322 138 324 143 L326 156 Z" fill="#0e0c08" opacity="0.8" />
      <circle cx="322" cy="138" r="3.2" fill="#0e0c08" opacity="0.8" />
      {/* Shako hat */}
      <path d="M320 138 Q321 132 322 130 Q323 132 324 138" fill="#0e0c08" opacity="0.7" />
      {/* Bayonet thrust forward */}
      <path d="M326 146 Q332 144 340 142" fill="none" stroke="#0e0c08" strokeWidth="1.5" opacity="0.65" />
      <line x1="340" y1="142" x2="348" y2="140" stroke="#5a5040" strokeWidth="0.7" opacity="0.45" />
      {/* Legs */}
      <line x1="320" y1="156" x2="316" y2="166" stroke="#0e0c08" strokeWidth="1.4" opacity="0.65" />
      <line x1="324" y1="156" x2="330" y2="165" stroke="#0e0c08" strokeWidth="1.4" opacity="0.65" />

      {/* Soldier 3 — mid-bridge, crouching and firing */}
      <path d="M380 158 Q378 152 380 148 Q382 144 384 148 L386 158 Z" fill="#0e0c08" opacity="0.75" />
      <circle cx="382" cy="144" r="3" fill="#0e0c08" opacity="0.75" />
      {/* Musket aimed forward */}
      <path d="M386 150 Q394 148 406 146" fill="none" stroke="#0e0c08" strokeWidth="1.2" opacity="0.6" />
      <line x1="406" y1="146" x2="416" y2="145" stroke="#4a4030" strokeWidth="0.8" opacity="0.4" />

      {/* Soldier 4 — further back, running with musket */}
      <path d="M300 157 Q298 151 300 145 Q302 140 304 145 L306 157 Z" fill="#0e0c08" opacity="0.72" />
      <circle cx="302" cy="140" r="2.8" fill="#0e0c08" opacity="0.72" />
      {/* Musket carried at port */}
      <path d="M298 148 Q292 142 288 136" fill="none" stroke="#0e0c08" strokeWidth="1.2" opacity="0.55" />
      <line x1="300" y1="157" x2="296" y2="167" stroke="#0e0c08" strokeWidth="1.3" opacity="0.6" />
      <line x1="304" y1="157" x2="310" y2="166" stroke="#0e0c08" strokeWidth="1.3" opacity="0.6" />

      {/* Soldier 5 — on the far side approaching Austrian end */}
      <path d="M460 157 Q458 151 460 146 Q462 141 464 146 L466 157 Z" fill="#0e0c08" opacity="0.7" />
      <circle cx="462" cy="141" r="2.8" fill="#0e0c08" opacity="0.7" />
      {/* Bayonet forward */}
      <path d="M466 149 Q472 147 480 146" fill="none" stroke="#0e0c08" strokeWidth="1.2" opacity="0.55" />
      <line x1="460" y1="157" x2="456" y2="166" stroke="#0e0c08" strokeWidth="1.3" opacity="0.55" />
      <line x1="464" y1="157" x2="470" y2="165" stroke="#0e0c08" strokeWidth="1.3" opacity="0.55" />

      {/* Soldier 6 — flag bearer on the bridge */}
      <path d="M358 156 Q356 149 358 143 Q360 137 362 143 L364 156 Z" fill="#0e0c08" opacity="0.8" />
      <circle cx="360" cy="137" r="3" fill="#0e0c08" opacity="0.8" />
      {/* Flag pole — tall, carried upright */}
      <line x1="362" y1="140" x2="362" y2="110" stroke="#3a3020" strokeWidth="1.5" opacity="0.7" />
      {/* Tricolour flag — simplified, fluttering */}
      <path d="M362 112 Q370 110 376 114 Q374 118 370 120 Q366 118 362 120 Z" fill="#1a2a5a" opacity="0.55">
        <animate attributeName="d" values="M362 112 Q370 110 376 114 Q374 118 370 120 Q366 118 362 120 Z;M362 112 Q372 108 378 112 Q376 116 372 118 Q368 116 362 120 Z;M362 112 Q370 110 376 114 Q374 118 370 120 Q366 118 362 120 Z" dur="2s" repeatCount="indefinite" />
      </path>
      {/* White stripe */}
      <path d="M362 115 Q370 113 376 117" fill="none" stroke="#8a8878" strokeWidth="1.5" opacity="0.4">
        <animate attributeName="d" values="M362 115 Q370 113 376 117;M362 115 Q372 111 378 115;M362 115 Q370 113 376 117" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Red stripe hint */}
      <path d="M362 118 Q370 116 376 120" fill="none" stroke="#6a2020" strokeWidth="1.2" opacity="0.4">
        <animate attributeName="d" values="M362 118 Q370 116 376 120;M362 118 Q372 114 378 118;M362 118 Q370 116 376 120" dur="2s" repeatCount="indefinite" />
      </path>
      <line x1="358" y1="156" x2="354" y2="166" stroke="#0e0c08" strokeWidth="1.3" opacity="0.65" />
      <line x1="362" y1="156" x2="368" y2="165" stroke="#0e0c08" strokeWidth="1.3" opacity="0.65" />

      {/* Soldier 7 — fallen/kneeling near center, hit but still firing */}
      <path d="M410 160 Q408 156 410 152 Q412 149 414 152 L416 160 Z" fill="#0e0c08" opacity="0.65" />
      <circle cx="412" cy="149" r="2.5" fill="#0e0c08" opacity="0.65" />
      <path d="M416 155 Q420 153 426 152" fill="none" stroke="#0e0c08" strokeWidth="1" opacity="0.5" />

      {/* === ADDITIONAL BRIDGE SOLDIERS — more figures in the historic charge === */}
      {/* Soldier 10 — drummer beating the charge, near center of bridge */}
      <path d="M395 156 Q393 149 395 143 Q397 137 399 143 L401 156 Z" fill="#0e0c08" opacity="0.72" />
      <circle cx="397" cy="137" r="3" fill="#0e0c08" opacity="0.72" />
      {/* Drum slung at side */}
      <ellipse cx="399" cy="148" rx="3.5" ry="2.5" fill="#1a1510" opacity="0.5" />
      {/* Drumstick arm motion */}
      <path d="M401 146 Q405 142 408 140" fill="none" stroke="#0e0c08" strokeWidth="1" opacity="0.45">
        <animate attributeName="d" values="M401 146 Q405 142 408 140;M401 146 Q406 140 410 138;M401 146 Q405 142 408 140" dur="0.4s" repeatCount="indefinite" />
      </path>
      {/* Legs running */}
      <line x1="395" y1="156" x2="391" y2="165" stroke="#0e0c08" strokeWidth="1.2" opacity="0.55" />
      <line x1="399" y1="156" x2="405" y2="164" stroke="#0e0c08" strokeWidth="1.2" opacity="0.55" />

      {/* Soldier 11 — carrying wounded comrade, near the French side */}
      <path d="M290 162 Q288 155 290 149 Q292 144 294 149 L296 162 Z" fill="#0e0c08" opacity="0.68" />
      <circle cx="292" cy="144" r="2.8" fill="#0e0c08" opacity="0.68" />
      {/* Wounded man draped over shoulder */}
      <path d="M286 150 Q290 146 296 148 Q300 146 304 150" fill="#0e0c08" opacity="0.5" />
      <circle cx="304" cy="148" r="2" fill="#0e0c08" opacity="0.45" />
      {/* Legs staggering under weight */}
      <line x1="290" y1="162" x2="286" y2="172" stroke="#0e0c08" strokeWidth="1.3" opacity="0.5" />
      <line x1="294" y1="162" x2="298" y2="171" stroke="#0e0c08" strokeWidth="1.3" opacity="0.5" />

      {/* Soldier 12 — falling backward, hit by Austrian fire */}
      <path d="M485 158 Q483 152 485 148 Q487 144 489 148 L491 158 Z" fill="#0e0c08" opacity="0.6" />
      <circle cx="487" cy="144" r="2.5" fill="#0e0c08" opacity="0.6" />
      {/* Arms flung back — impact pose */}
      <path d="M483 150 Q478 146 474 148" fill="none" stroke="#0e0c08" strokeWidth="1.2" opacity="0.4" />
      <path d="M491 150 Q496 146 500 148" fill="none" stroke="#0e0c08" strokeWidth="1.2" opacity="0.4" />
      {/* Musket falling from hands */}
      <line x1="478" y1="150" x2="470" y2="156" stroke="#3a3020" strokeWidth="0.8" opacity="0.3" />

      {/* === FLEEING AUSTRIANS — near far bank side of bridge === */}
      {/* Austrian 1 — running away, white coat visible, musket dropped */}
      <path d="M530 156 Q528 150 530 145 Q532 140 534 145 L536 156 Z" fill="#2a2820" opacity="0.6" />
      <circle cx="532" cy="140" r="2.5" fill="#2a2820" opacity="0.6" />
      {/* White coat hint */}
      <path d="M530 148 Q532 146 534 148" fill="#5a5848" opacity="0.25" />
      <line x1="530" y1="156" x2="526" y2="166" stroke="#2a2820" strokeWidth="1.2" opacity="0.45" />
      <line x1="534" y1="156" x2="540" y2="165" stroke="#2a2820" strokeWidth="1.2" opacity="0.45" />

      {/* Austrian 2 — stumbling, looking back in terror */}
      <path d="M548 155 Q546 149 548 144 Q550 139 552 144 L554 155 Z" fill="#2a2820" opacity="0.55" />
      <circle cx="550" cy="139" r="2.3" fill="#2a2820" opacity="0.55" />
      {/* Head turned back */}
      <path d="M548 140 Q546 138 545 140" fill="#2a2820" opacity="0.4" />
      <line x1="548" y1="155" x2="544" y2="165" stroke="#2a2820" strokeWidth="1.1" opacity="0.4" />
      <line x1="552" y1="155" x2="558" y2="164" stroke="#2a2820" strokeWidth="1.1" opacity="0.4" />

      {/* === SOLDIERS APPROACHING BRIDGE — near bank side === */}
      {/* Column of soldiers rushing toward the bridge approach */}
      <path d="M270 162 Q268 156 270 150 Q272 145 274 150 L276 162 Z" fill="#0e0c08" opacity="0.7" />
      <circle cx="272" cy="145" r="2.6" fill="#0e0c08" opacity="0.7" />
      <line x1="270" y1="162" x2="266" y2="172" stroke="#0e0c08" strokeWidth="1.2" opacity="0.55" />
      <line x1="274" y1="162" x2="280" y2="171" stroke="#0e0c08" strokeWidth="1.2" opacity="0.55" />

      <path d="M282 161 Q280 156 282 151 Q284 146 286 151 L288 161 Z" fill="#0e0c08" opacity="0.65" />
      <circle cx="284" cy="146" r="2.4" fill="#0e0c08" opacity="0.65" />

      {/* Soldier 8 — officer urging men forward, sabre pointing at bridge */}
      <path d="M260 163 Q258 157 260 151 Q262 146 264 151 L266 163 Z" fill="#0e0c08" opacity="0.72" />
      <circle cx="262" cy="146" r="2.8" fill="#0e0c08" opacity="0.72" />
      {/* Bicorne hat — officer */}
      <path d="M259 146 Q260 143 262 142 Q264 143 265 146 Q262 145 259 146" fill="#0e0c08" opacity="0.6" />
      {/* Sabre extended forward toward bridge */}
      <path d="M266 153 Q272 150 280 148" fill="none" stroke="#0e0c08" strokeWidth="1.5" opacity="0.55" />
      <line x1="280" y1="148" x2="288" y2="146" stroke="#6a6050" strokeWidth="0.8" opacity="0.4" />

      {/* Soldier 9 — running in a crouch, near left bridge approach */}
      <path d="M248 164 Q246 159 248 155 Q250 151 252 155 L254 164 Z" fill="#0e0c08" opacity="0.62" />
      <circle cx="250" cy="151" r="2.3" fill="#0e0c08" opacity="0.62" />
      <line x1="248" y1="164" x2="244" y2="173" stroke="#0e0c08" strokeWidth="1.1" opacity="0.48" />
      <line x1="252" y1="164" x2="258" y2="172" stroke="#0e0c08" strokeWidth="1.1" opacity="0.48" />

      {/* === SCATTERED BODIES ON BRIDGE — fallen during the charge === */}
      {/* Body 1 — dark shape sprawled across bridge deck */}
      <path d="M365 163 Q370 161 378 162 Q382 162 384 164" fill="#0e0c08" opacity="0.6" />
      <circle cx="364" cy="163" r="2.2" fill="#0e0c08" opacity="0.55" />
      {/* Body 2 — slumped against railing */}
      <path d="M440 162 Q444 160 448 161 Q450 163 448 164" fill="#0e0c08" opacity="0.55" />
      <circle cx="439" cy="161" r="2" fill="#0e0c08" opacity="0.5" />
      {/* Body 3 — French soldier face-down near center, musket beneath */}
      <path d="M395 165 Q402 163 410 164 Q415 164 418 166" fill="#0e0c08" opacity="0.5" />
      <circle cx="394" cy="165" r="2" fill="#0e0c08" opacity="0.45" />
      <line x1="398" y1="166" x2="420" y2="164" stroke="#2a2518" strokeWidth="0.8" opacity="0.25" />
      {/* Body 4 — Austrian fallen at far bridge approach */}
      <path d="M555 162 Q560 160 568 161 Q572 162 574 164" fill="#2a2420" opacity="0.4" />
      <circle cx="554" cy="162" r="1.8" fill="#2a2420" opacity="0.35" />
      {/* White coat visible */}
      <path d="M558 161 Q564 159 570 161" fill="#4a4840" opacity="0.15" />

      {/* === DEAD AUSTRIAN SOLDIERS — fallen near Austrian side of bridge === */}
      {/* Austrian casualty 1 — sprawled face-down on far bank near bridge approach */}
      <path d="M540 160 Q548 157 558 158 Q564 158 568 161" fill="#2a2420" opacity="0.55" />
      <circle cx="538" cy="160" r="2.4" fill="#2a2420" opacity="0.5" />
      {/* White coat hint (Austrian uniform) */}
      <path d="M544 158 Q550 156 558 157" fill="#5a5850" opacity="0.3" />
      {/* Dropped musket beside him */}
      <line x1="542" y1="162" x2="570" y2="160" stroke="#3a3020" strokeWidth="1" opacity="0.35" />

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

      {/* Sunset warm shimmer band on water — broader, more vivid */}
      <rect x="0" y="174" width="800" height="28" fill="url(#ch4_warmShimmer)">
        <animate attributeName="opacity" values="1;0.6;1" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Secondary shimmer layer — golden path of light on water */}
      <ellipse cx="400" cy="178" rx="200" ry="4" fill="#e0a040" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.04;0.1" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="200;220;200" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* Water ripples — animated horizontal flow, more visible */}
      <g>
        <path d="M0 188 Q40 186 80 188 Q120 190 160 188 Q200 186 240 188 Q280 190 320 188 Q360 186 400 188 Q440 190 480 188 Q520 186 560 188 Q600 190 640 188 Q680 186 720 188 Q760 190 800 188"
          fill="none" stroke="#6a5a58" strokeWidth="0.6" opacity="0.35">
          <animateTransform attributeName="transform" type="translate" values="0,0;-20,0;0,0" dur="6s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 202 Q50 200 100 202 Q150 204 200 202 Q250 200 300 202 Q350 204 400 202 Q450 200 500 202 Q550 204 600 202 Q650 200 700 202 Q750 204 800 202"
          fill="none" stroke="#5a4a52" strokeWidth="0.6" opacity="0.3">
          <animateTransform attributeName="transform" type="translate" values="0,0;16,0;0,0" dur="7s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 218 Q60 216 120 218 Q180 220 240 218 Q300 216 360 218 Q420 220 480 218 Q540 216 600 218 Q660 220 720 218 Q780 216 800 218"
          fill="none" stroke="#4a3a48" strokeWidth="0.5" opacity="0.25">
          <animateTransform attributeName="transform" type="translate" values="0,0;-14,0;0,0" dur="8s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 235 Q70 233 140 235 Q210 237 280 235 Q350 233 420 235 Q490 237 560 235 Q630 233 700 235 Q770 237 800 235"
          fill="none" stroke="#3a3040" strokeWidth="0.5" opacity="0.18">
          <animateTransform attributeName="transform" type="translate" values="0,0;12,0;0,0" dur="9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === SUNSET LIGHT COLUMN ON WATER — golden path of reflected sun === */}
      <ellipse cx="400" cy="190" rx="40" ry="30" fill="url(#ch4_sunColumn)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="40;50;40" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Sun column shimmer fragments — broken by waves */}
      <ellipse cx="395" cy="186" rx="8" ry="1.2" fill="#e0a848" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="8;12;8" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="408" cy="198" rx="10" ry="1" fill="#d09840" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="10;14;10" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="392" cy="210" rx="6" ry="0.8" fill="#c08838" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === BRIDGE REFLECTION IN WATER — dark wavering shape below bridge === */}
      <path d="M265 178 Q330 175 400 176 Q460 175 535 178 Q545 179 555 180 L555 198 Q460 195 400 196 Q330 195 265 198 Z"
        fill="url(#ch4_bridgeReflect)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.35;0.6" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Bridge deck reflection — darker band */}
      <path d="M270 180 Q400 176 530 180 L530 186 Q400 182 270 186 Z"
        fill="#2a2518" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Support pillar reflections — wavering dark verticals */}
      {[290, 340, 400, 460, 520].map((x) => (
        <React.Fragment key={`brRef${x}`}>
          <line x1={x} y1={180} x2={x + 1} y2={198} stroke="#2a2518" strokeWidth="1.8" opacity="0.12">
            <animate attributeName="x2" values={`${x + 1};${x + 3};${x + 1}`} dur="3s" repeatCount="indefinite" />
          </line>
          {/* Pontoon hull shadow beneath water */}
          <ellipse cx={x} cy={180} rx={8} ry={3} fill="url(#ch4_pontoonShadow)" opacity="0.5">
            <animate attributeName="rx" values="8;10;8" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </React.Fragment>
      ))}

      {/* === FOAM AND TURBULENCE AT BRIDGE SUPPORTS — water forced around pylons === */}
      {[310, 370, 430, 490].map((x) => (
        <React.Fragment key={`foam${x}`}>
          {/* V-shaped wake behind support */}
          <path d={`M${x} ${176} Q${x - 4} ${180} ${x - 8} ${184}`} fill="none" stroke="#5a5450" strokeWidth="0.4" opacity="0.08">
            <animate attributeName="opacity" values="0.08;0.14;0.08" dur="2.5s" repeatCount="indefinite" />
          </path>
          <path d={`M${x} ${176} Q${x + 4} ${180} ${x + 8} ${184}`} fill="none" stroke="#5a5450" strokeWidth="0.4" opacity="0.08">
            <animate attributeName="opacity" values="0.08;0.14;0.08" dur="2.5s" repeatCount="indefinite" />
          </path>
          {/* Foam patch — churning water */}
          <ellipse cx={x} cy={178} rx={5} ry={1.5} fill="url(#ch4_foam)">
            <animate attributeName="rx" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </React.Fragment>
      ))}

      {/* === RIVER SURFACE TEXTURE — small cross-hatched wavelets === */}
      <path d="M50 185 Q55 184 60 185" fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.12" />
      <path d="M120 192 Q126 191 132 192" fill="none" stroke="#4a3a48" strokeWidth="0.3" opacity="0.1" />
      <path d="M250 198 Q256 197 262 198" fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.1" />
      <path d="M680 190 Q686 189 692 190" fill="none" stroke="#4a3a48" strokeWidth="0.3" opacity="0.12" />
      <path d="M560 205 Q566 204 572 205" fill="none" stroke="#4a3a48" strokeWidth="0.3" opacity="0.08" />
      <path d="M380 212 Q387 211 394 212" fill="none" stroke="#4a3a48" strokeWidth="0.3" opacity="0.08" />
      <path d="M700 220 Q706 219 712 220" fill="none" stroke="#3a3040" strokeWidth="0.3" opacity="0.07" />

      {/* === ADDITIONAL CURRENT LINES — more river detail === */}
      <path d="M0 195 Q45 193 90 195 Q135 197 180 195 Q225 193 270 195 Q315 197 360 195 Q405 193 450 195 Q495 197 540 195 Q585 193 630 195 Q675 197 720 195 Q765 193 800 195"
        fill="none" stroke="#4a3a48" strokeWidth="0.4" opacity="0.15">
        <animateTransform attributeName="transform" type="translate" values="0,0;-18,0;0,0" dur="7.5s" repeatCount="indefinite" />
      </path>
      <path d="M0 225 Q55 223 110 225 Q165 227 220 225 Q275 223 330 225 Q385 227 440 225 Q495 223 550 225 Q605 227 660 225 Q715 223 770 225 Q790 227 800 225"
        fill="none" stroke="#352a38" strokeWidth="0.4" opacity="0.1">
        <animateTransform attributeName="transform" type="translate" values="0,0;16,0;0,0" dur="10s" repeatCount="indefinite" />
      </path>
      <path d="M0 245 Q80 243 160 245 Q240 247 320 245 Q400 243 480 245 Q560 247 640 245 Q720 243 800 245"
        fill="none" stroke="#2a2535" strokeWidth="0.3" opacity="0.08">
        <animateTransform attributeName="transform" type="translate" values="0,0;-10,0;0,0" dur="11s" repeatCount="indefinite" />
      </path>

      {/* === DEEP WATER CURRENTS — darker undulating bands beneath the surface === */}
      <path d="M0 210 Q80 206 160 210 Q240 214 320 210 Q400 206 480 210 Q560 214 640 210 Q720 206 800 210"
        fill="none" stroke="#1e1828" strokeWidth="2" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;-22,0;0,0" dur="9s" repeatCount="indefinite" />
      </path>
      <path d="M0 230 Q100 226 200 230 Q300 234 400 230 Q500 226 600 230 Q700 234 800 230"
        fill="none" stroke="#1a1525" strokeWidth="1.5" opacity="0.05">
        <animateTransform attributeName="transform" type="translate" values="0,0;18,0;0,0" dur="11s" repeatCount="indefinite" />
      </path>

      {/* === CANNON FLASH REFLECTIONS IN WATER — bright orange flickers on river surface === */}
      {/* Reflection of cannon 1 muzzle flash */}
      <ellipse cx="548" cy="195" rx="15" ry="3" fill="#e0a040" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.01;0.06" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="15;22;15" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Reflection of cannon 2 flash — offset timing */}
      <ellipse cx="614" cy="200" rx="12" ry="2.5" fill="#e0a040" opacity="0.04">
        <animate attributeName="opacity" values="0.01;0.04;0.01" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="12;18;12" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Reflection of cannon 3 flash */}
      <ellipse cx="670" cy="198" rx="8" ry="2" fill="#d09040" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.005;0.03" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* === FLOATING DEBRIS IN CURRENT — battle material carried downstream === */}
      {/* Musket carried downstream — long dark shape */}
      <line x1="280" y1="205" x2="290" y2="204" stroke="#2a2518" strokeWidth="1" opacity="0.15">
        <animateTransform attributeName="transform" type="translate" values="0,0;-40,2;-80,4" dur="25s" repeatCount="indefinite" />
      </line>
      {/* Cartridge paper — white scrap floating */}
      <rect x="450" y="218" width="2" height="1.5" rx="0.3" fill="#5a5848" opacity="0.12" transform="rotate(35 451 219)">
        <animateTransform attributeName="transform" type="translate" values="0,0;-22,1;-44,2" dur="20s" repeatCount="indefinite" />
      </rect>

      {/* === WATER SURFACE REFLECTIONS — broken mirror-like patches of sky color === */}
      {/* Warm sky reflection fragments — scattered across water */}
      <ellipse cx="180" cy="188" rx="12" ry="1.5" fill="#6a4838" opacity="0.04">
        <animate attributeName="rx" values="12;15;12" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="560" cy="196" rx="15" ry="1.2" fill="#7a5838" opacity="0.05">
        <animate attributeName="rx" values="15;18;15" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.09;0.05" dur="3.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="680" cy="202" rx="10" ry="1" fill="#6a4838" opacity="0.04">
        <animate attributeName="rx" values="10;13;10" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Cool deep-purple reflection fragments — from darkening sky above */}
      <ellipse cx="100" cy="220" rx="18" ry="1.5" fill="#251e30" opacity="0.05">
        <animate attributeName="rx" values="18;22;18" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="400" cy="235" rx="20" ry="1" fill="#201a28" opacity="0.04">
        <animate attributeName="rx" values="20;24;20" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {/* === RIPPLE RINGS — concentric circles from disturbances in the water === */}
      {/* Ripple from debris falling into water */}
      <circle cx="350" cy="195" r="4" fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="r" values="2;8;14" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.06;0" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="195" r="2" fill="none" stroke="#5a4a50" strokeWidth="0.25" opacity="0.06">
        <animate attributeName="r" values="1;6;12" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.04;0" dur="6s" repeatCount="indefinite" />
      </circle>
      {/* Ripple from drip off bridge */}
      <circle cx="430" cy="180" r="2" fill="none" stroke="#4a3a48" strokeWidth="0.25" opacity="0.06">
        <animate attributeName="r" values="1;5;9" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.03;0" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Gentle ripple — far bank, slow expanding */}
      <circle cx="200" cy="182" r="3" fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.05">
        <animate attributeName="r" values="2;7;12" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.03;0" dur="8s" repeatCount="indefinite" />
      </circle>

      {/* === REED AND BANK REFLECTIONS IN WATER — dark vertical blurs near banks === */}
      {/* Left bank reed reflections — wavering dark strokes below waterline */}
      <line x1="8" y1="278" x2="6" y2="290" stroke="#1a2018" strokeWidth="0.6" opacity="0.06">
        <animate attributeName="x2" values="6;9;6" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1="14" y1="280" x2="12" y2="292" stroke="#1a2018" strokeWidth="0.5" opacity="0.05">
        <animate attributeName="x2" values="12;15;12" dur="3.5s" repeatCount="indefinite" />
      </line>
      <line x1="20" y1="279" x2="18" y2="290" stroke="#1a2018" strokeWidth="0.5" opacity="0.05">
        <animate attributeName="x2" values="18;21;18" dur="2.8s" repeatCount="indefinite" />
      </line>
      {/* Right bank reed reflections */}
      <line x1="782" y1="275" x2="780" y2="286" stroke="#1a2018" strokeWidth="0.6" opacity="0.06">
        <animate attributeName="x2" values="780;783;780" dur="3.2s" repeatCount="indefinite" />
      </line>
      <line x1="790" y1="276" x2="788" y2="288" stroke="#1a2018" strokeWidth="0.5" opacity="0.05">
        <animate attributeName="x2" values="788;791;788" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Bank silhouette reflection — dark horizontal blur at waterline */}
      <path d="M0 278 Q40 280 80 278 Q120 280 160 278" fill="none" stroke="#1e1a12" strokeWidth="1.5" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M640 270 Q680 272 720 270 Q760 272 800 270" fill="none" stroke="#1e1a12" strokeWidth="1.5" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="4.5s" repeatCount="indefinite" />
      </path>

      {/* === FLOATING DEBRIS — small objects carried by current === */}
      {/* Wooden plank — battle debris */}
      <rect x="340" y="210" width="8" height="2" rx="0.5" fill="#2a2518" opacity="0.2" transform="rotate(12 344 211)">
        <animateTransform attributeName="transform" type="translate" values="0,0;-30,0;-60,0" dur="18s" repeatCount="indefinite" />
      </rect>
      {/* Small branch */}
      <path d="M520 228 Q524 227 530 228 Q532 226 534 227" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.18">
        <animateTransform attributeName="transform" type="translate" values="0,0;-25,0;-50,0" dur="22s" repeatCount="indefinite" />
      </path>
      {/* Floating hat — shako lost during the charge */}
      <ellipse cx="440" cy="200" rx="3" ry="1.2" fill="#1a1510" opacity="0.2">
        <animateTransform attributeName="transform" type="translate" values="0,0;-18,1;-36,0" dur="16s" repeatCount="indefinite" />
      </ellipse>
      {/* Small leafy branch */}
      <path d="M160 235 Q164 234 168 235" fill="none" stroke="#2a3520" strokeWidth="0.6" opacity="0.14">
        <animateTransform attributeName="transform" type="translate" values="0,0;-20,0;-40,0" dur="20s" repeatCount="indefinite" />
      </path>

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
      <ellipse cx="350" cy="185" rx="50" ry="3" fill="#d09050" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="50;58;50" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="192" rx="35" ry="2" fill="#c07a40" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.06;0.2" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="35;42;35" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="200" cy="208" rx="25" ry="1.5" fill="#9a6a3a" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="195" rx="35" ry="1.5" fill="#b07a40" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="35;40;35" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Central golden streak — sunset path on water */}
      <ellipse cx="400" cy="180" rx="70" ry="3" fill="#d09850" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="70;82;70" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* === BROKEN SUNSET REFLECTIONS — fragmented mirror-like glints scattered across surface === */}
      {/* Bright glint 1 — sharp highlight where wavelet angles catch sunset perfectly */}
      <ellipse cx="320" cy="182" rx="3" ry="0.6" fill="#f0b860" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.04;0.18" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="3;5;3" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Bright glint 2 */}
      <ellipse cx="480" cy="186" rx="2.5" ry="0.5" fill="#e0a850" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.02;0.15" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="2.5;4;2.5" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Bright glint 3 — near bridge reflection */}
      <ellipse cx="380" cy="179" rx="4" ry="0.8" fill="#f0c068" opacity="0.14">
        <animate attributeName="opacity" values="0.14;0.02;0.14" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="4;6;4" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Warm color band — wider sunset reflection in middle distance */}
      <ellipse cx="350" cy="220" rx="60" ry="2" fill="#8a5530" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="60;70;60" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Purple-blue sky reflection — darker water in the far portions */}
      <ellipse cx="150" cy="240" rx="50" ry="3" fill="#201830" opacity="0.05">
        <animate attributeName="rx" values="50;58;50" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="235" rx="45" ry="2.5" fill="#1e1528" opacity="0.04">
        <animate attributeName="rx" values="45;52;45" dur="7s" repeatCount="indefinite" />
      </ellipse>

      {/* === FLOWING WATER ANIMATION — secondary wave patterns moving downstream === */}
      {/* Quick surface ripple — faster flow near center of river */}
      <path d="M0 193 Q30 191 60 193 Q90 195 120 193 Q150 191 180 193 Q210 195 240 193 Q270 191 300 193 Q330 195 360 193 Q390 191 420 193 Q450 195 480 193 Q510 191 540 193 Q570 195 600 193 Q630 191 660 193 Q690 195 720 193 Q750 191 780 193"
        fill="none" stroke="#5a4a55" strokeWidth="0.3" opacity="0.1">
        <animateTransform attributeName="transform" type="translate" values="0,0;-30,0;-60,0;-30,0;0,0" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Slow deep current — broader, slower movement below */}
      <path d="M0 240 Q60 237 120 240 Q180 243 240 240 Q300 237 360 240 Q420 243 480 240 Q540 237 600 240 Q660 243 720 240 Q780 237 800 240"
        fill="none" stroke="#2a2535" strokeWidth="0.6" opacity="0.04">
        <animateTransform attributeName="transform" type="translate" values="0,0;14,0;0,0" dur="12s" repeatCount="indefinite" />
      </path>
      {/* Turbulent patch near bridge pylons — faster, choppier water */}
      <g opacity="0.06">
        <path d="M290 182 Q295 180 300 182 Q305 184 310 182" fill="none" stroke="#5a4a50" strokeWidth="0.4">
          <animateTransform attributeName="transform" type="translate" values="0,0;-8,0;-16,0;-8,0;0,0" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M450 183 Q455 181 460 183 Q465 185 470 183" fill="none" stroke="#5a4a50" strokeWidth="0.4">
          <animateTransform attributeName="transform" type="translate" values="0,0;-6,0;-12,0;-6,0;0,0" dur="3.2s" repeatCount="indefinite" />
        </path>
      </g>
      {/* V-wake from bridge support — water splitting around obstacle */}
      <path d="M340 176 Q345 178 340 180" fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.09;0.05" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M340 176 Q335 178 340 180" fill="none" stroke="#5a4a50" strokeWidth="0.3" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.09;0.05" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M400 175 Q405 177 400 179" fill="none" stroke="#4a3a48" strokeWidth="0.3" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M400 175 Q395 177 400 179" fill="none" stroke="#4a3a48" strokeWidth="0.3" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* === SUBMERGED DEBRIS — dark shapes visible beneath the water surface === */}
      {/* Sunken cart wheel — partially visible in shallow water near bridge */}
      <ellipse cx="320" cy="195" rx="6" ry="3" fill="#1a1520" opacity="0.06" />
      <path d="M316 195 Q320 192 324 195 Q320 198 316 195" fill="none" stroke="#1e1a25" strokeWidth="0.4" opacity="0.04" />
      {/* Submerged timber — dark shape drifting below surface */}
      <path d="M530 215 Q540 213 555 214" fill="none" stroke="#1a1520" strokeWidth="1.5" opacity="0.04" />
      {/* Cannon ball on riverbed — dark spot visible in shallow water */}
      <circle cx="360" cy="185" r="2" fill="#12101a" opacity="0.04" />
      <circle cx="480" cy="200" r="1.5" fill="#12101a" opacity="0.03" />
      {/* Drowned equipment outline — pack or knapsack */}
      <path d="M415 208 Q420 204 425 208 Q420 212 415 208" fill="#1a1520" opacity="0.03" />

      {/* === WATER SURFACE MICRO-TEXTURE — tiny wavelets catching ambient light === */}
      {/* Near-bank shallow water — lighter, showing riverbed through */}
      <path d="M30 268 Q45 266 60 268 Q75 270 90 268" fill="none" stroke="#5a4a50" strokeWidth="0.25" opacity="0.06" />
      <path d="M120 264 Q135 262 150 264 Q165 266 180 264" fill="none" stroke="#4a3a48" strokeWidth="0.25" opacity="0.05" />
      <path d="M640 262 Q655 260 670 262 Q685 264 700 262" fill="none" stroke="#5a4a50" strokeWidth="0.25" opacity="0.06" />
      {/* Mid-river chop — small irregular wavelets from wind */}
      <path d="M200 210 Q204 209 208 210" fill="none" stroke="#4a3a48" strokeWidth="0.2" opacity="0.06" />
      <path d="M340 220 Q344 219 348 220" fill="none" stroke="#4a3a48" strokeWidth="0.2" opacity="0.05" />
      <path d="M600 215 Q604 214 608 215" fill="none" stroke="#4a3a48" strokeWidth="0.2" opacity="0.06" />
      <path d="M150 230 Q154 229 158 230" fill="none" stroke="#3a3040" strokeWidth="0.2" opacity="0.04" />
      <path d="M500 225 Q504 224 508 225" fill="none" stroke="#3a3040" strokeWidth="0.2" opacity="0.05" />
      <path d="M720 208 Q724 207 728 208" fill="none" stroke="#4a3a48" strokeWidth="0.2" opacity="0.05" />
      {/* Wind-driven ripple trains — parallel short strokes */}
      {[185, 198, 212, 228, 242].map((y, i) => (
        <g key={`windRip${i}`} opacity={0.04 + (i % 2) * 0.02}>
          <path d={`M${100 + i * 120} ${y} Q${104 + i * 120} ${y - 1} ${108 + i * 120} ${y}`} fill="none" stroke="#5a4a50" strokeWidth="0.2" />
          <path d={`M${115 + i * 120} ${y + 1} Q${119 + i * 120} ${y} ${123 + i * 120} ${y + 1}`} fill="none" stroke="#5a4a50" strokeWidth="0.2" />
          <path d={`M${130 + i * 120} ${y} Q${134 + i * 120} ${y - 1} ${138 + i * 120} ${y}`} fill="none" stroke="#5a4a50" strokeWidth="0.2" />
        </g>
      ))}

      {/* === RIVER COLOR DEPTH BANDS — darker water in mid-channel, lighter at edges === */}
      {/* Deep channel center — darker band running with current */}
      <ellipse cx="400" cy="215" rx="180" ry="12" fill="#15101e" opacity="0.04" />
      {/* Shallow shelf near left bank — slightly lighter */}
      <path d="M0 260 Q60 256 120 260 Q180 256 200 260" fill="#3a3040" opacity="0.03" />
      {/* Shallow shelf near right bank */}
      <path d="M620 258 Q680 254 740 258 Q770 256 800 260" fill="#3a3040" opacity="0.03" />

      {/* === FIRE REFLECTIONS IN RIVER — animated orange shimmer from celebration fires === */}
      {/* Main fire reflection — from campfire 1 at x=300, reflecting below bank */}
      <ellipse cx="300" cy="260" rx="20" ry="6" fill="#c08040" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.03;0.08" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="20;26;20" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="300" cy="252" rx="14" ry="3" fill="#d09050" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="14;18;14" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire reflection streaks — elongated shimmer lines on water surface */}
      <path d="M285 248 Q295 246 310 248" fill="none" stroke="#c08040" strokeWidth="0.6" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="1.6s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0;3,0;0,0" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M290 255 Q300 253 315 255" fill="none" stroke="#d09050" strokeWidth="0.5" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="2s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="translate" values="0,0;-2,0;0,0" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Fire 2 reflection — from campfire 2 at x=120 */}
      <ellipse cx="120" cy="262" rx="12" ry="4" fill="#c08040" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.02;0.05" dur="2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="12;16;12" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      <path d="M110 258 Q118 256 128 258" fill="none" stroke="#d09050" strokeWidth="0.4" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="1.8s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL FLOATING DEBRIS — battle detritus in the current === */}
      {/* Torn cartridge paper — white speck on dark water */}
      <rect x="300" y="225" width="1.5" height="1" rx="0.2" fill="#5a5848" opacity="0.1" transform="rotate(15 301 226)">
        <animateTransform attributeName="transform" type="translate" values="0,0;-15,0;-30,0" dur="18s" repeatCount="indefinite" />
      </rect>
      {/* Piece of rope — dark curve floating */}
      <path d="M220 212 Q226 210 232 213" fill="none" stroke="#2a2518" strokeWidth="0.5" opacity="0.12">
        <animateTransform attributeName="transform" type="translate" values="0,0;-20,1;-40,0" dur="22s" repeatCount="indefinite" />
      </path>
      {/* Wooden debris — bridge fragment */}
      <rect x="480" y="195" width="5" height="1.5" rx="0.3" fill="#2a2518" opacity="0.15" transform="rotate(-8 483 196)">
        <animateTransform attributeName="transform" type="translate" values="0,0;-25,0;-50,0" dur="20s" repeatCount="indefinite" />
      </rect>
      {/* Cloth fragment — uniform piece caught in current */}
      <path d="M600 230 Q604 228 608 231" fill="#1a1830" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;-18,0;-36,0" dur="16s" repeatCount="indefinite" />
      </path>

      {/* === WATER TEMPERATURE COLORS — warmer near fires, cooler in open water === */}
      {/* Warm water patch below main fire reflection */}
      <ellipse cx="300" cy="256" rx="25" ry="4" fill="#3a2a28" opacity="0.03" />
      {/* Cool water — deep blue-purple in shadowed areas */}
      <ellipse cx="100" cy="230" rx="35" ry="6" fill="#181525" opacity="0.04" />
      <ellipse cx="700" cy="225" rx="30" ry="5" fill="#181525" opacity="0.03" />

      {/* === MOONRISE HINT — faint glow on eastern horizon (left side) === */}
      <ellipse cx="50" cy="60" rx="30" ry="25" fill="#2a2540" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.02;0.04" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Moon reflection attempt in water — very faint silver column */}
      <ellipse cx="50" cy="220" rx="8" ry="20" fill="#2a2540" opacity="0.015" />

      {/* === RIVER MIST — low-lying evening vapor over the water surface === */}
      {/* Mist bank 1 — wide, hugging surface near far bank */}
      <ellipse cx="300" cy="178" rx="120" ry="6" fill="url(#ch4_riverMist)" opacity="0.7">
        <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.4;0.7" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Mist bank 2 — thinner wisp mid-river */}
      <ellipse cx="550" cy="210" rx="80" ry="4" fill="url(#ch4_riverMist)" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0;-10,0;0,0" dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.25;0.5" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Mist bank 3 — near bank approach, where water meets shore */}
      <ellipse cx="150" cy="260" rx="60" ry="5" fill="url(#ch4_riverMist)" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="16s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Mist wisps — thinner, higher tendrils curling up from water */}
      <path d="M200 252 Q220 248 240 252" fill="none" stroke="#8a7a70" strokeWidth="1.5" opacity="0.05">
        <animateTransform attributeName="transform" type="translate" values="0,0;6,-2;0,0" dur="12s" repeatCount="indefinite" />
      </path>
      <path d="M500 240 Q520 236 540 240" fill="none" stroke="#8a7a70" strokeWidth="1.2" opacity="0.04">
        <animateTransform attributeName="transform" type="translate" values="0,0;-5,-1;0,0" dur="14s" repeatCount="indefinite" />
      </path>

      {/* === NEAR BANK === */}
      <path d="M0 278 Q120 270 250 274 Q400 265 550 270 Q680 265 800 272 L800 400 L0 400 Z"
        fill="url(#ch4_bank)" />

      {/* Bank edge detail */}
      <path d="M0 278 Q30 275 60 279 Q90 276 120 280 Q150 274 180 278"
        fill="none" stroke="#352e20" strokeWidth="0.8" opacity="0.3" />
      {/* Extended bank edge detail — right side */}
      <path d="M180 278 Q220 272 260 276 Q300 270 340 274 Q380 269 420 273"
        fill="none" stroke="#352e20" strokeWidth="0.8" opacity="0.25" />
      <path d="M420 273 Q480 268 540 272 Q600 266 660 270 Q720 264 780 270"
        fill="none" stroke="#352e20" strokeWidth="0.7" opacity="0.2" />

      {/* === NEAR BANK TERRAIN TEXTURE — rocks, pebbles, earth variation === */}
      {/* Scattered rocks along the bank edge */}
      <path d="M45 284 Q48 280 54 281 Q58 284 55 287 Q49 288 45 284 Z" fill="#2a2518" opacity="0.45" />
      <path d="M52 282 Q55 280 57 282" fill="none" stroke="#1a1810" strokeWidth="0.4" opacity="0.25" />
      <path d="M88 280 Q92 277 97 278 Q100 281 97 283 Q91 284 88 280 Z" fill="#282218" opacity="0.4" />
      <path d="M160 282 Q164 278 170 280 Q172 283 169 286 Q163 286 160 282 Z" fill="#2a2418" opacity="0.35" />
      {/* Moss on river-edge rocks */}
      <ellipse cx="48" cy="284" rx="4" ry="2" fill="url(#ch4_moss)" />
      <ellipse cx="94" cy="280" rx="3" ry="1.5" fill="url(#ch4_moss)" />

      {/* Pebble scatters — small stones embedded in the bank */}
      <circle cx="70" cy="286" r="1" fill="#2a2418" opacity="0.2" />
      <circle cx="74" cy="288" r="0.7" fill="#282218" opacity="0.18" />
      <circle cx="78" cy="285" r="0.8" fill="#2a2418" opacity="0.15" />
      <circle cx="110" cy="282" r="1.1" fill="#282218" opacity="0.2" />
      <circle cx="115" cy="284" r="0.6" fill="#2a2418" opacity="0.15" />
      <circle cx="240" cy="278" r="0.9" fill="#282218" opacity="0.18" />
      <circle cx="245" cy="280" r="0.7" fill="#2a2418" opacity="0.15" />
      <circle cx="370" cy="276" r="1" fill="#282218" opacity="0.16" />
      <circle cx="376" cy="278" r="0.6" fill="#2a2418" opacity="0.14" />
      <circle cx="500" cy="274" r="0.8" fill="#282218" opacity="0.18" />
      <circle cx="504" cy="276" r="1.1" fill="#2a2418" opacity="0.15" />
      <circle cx="660" cy="272" r="0.9" fill="#282218" opacity="0.17" />
      <circle cx="665" cy="274" r="0.7" fill="#2a2418" opacity="0.14" />

      {/* Larger embedded rocks — partially buried in the riverbank */}
      <path d="M320 280 Q325 276 332 278 Q336 280 334 284 Q328 286 322 284 Q319 282 320 280 Z" fill="#252018" opacity="0.35" />
      <path d="M324 278 Q328 276 332 278" fill="none" stroke="#1e1a12" strokeWidth="0.5" opacity="0.2" />
      <path d="M470 276 Q476 272 482 274 Q486 278 482 280 Q476 282 472 280 Q468 278 470 276 Z" fill="#252018" opacity="0.3" />

      {/* Earth cracks — dried mud near the waterline */}
      <path d="M60 290 Q65 288 68 290" fill="none" stroke="#1e1a10" strokeWidth="0.4" opacity="0.12" />
      <path d="M63 287 Q64 290 66 291" fill="none" stroke="#1e1a10" strokeWidth="0.3" opacity="0.1" />
      <path d="M130 286 Q135 284 138 286 Q140 288 137 289" fill="none" stroke="#1e1a10" strokeWidth="0.4" opacity="0.1" />
      <path d="M450 282 Q456 280 460 282" fill="none" stroke="#1e1a10" strokeWidth="0.3" opacity="0.1" />

      {/* Puddles — shallow water pooling in boot-churned earth */}
      <ellipse cx="555" cy="282" rx="6" ry="2" fill="url(#ch4_puddle)" />
      <ellipse cx="600" cy="280" rx="5" ry="1.5" fill="url(#ch4_puddle)" />
      {/* Puddle reflection of sky — tiny warm glint */}
      <ellipse cx="555" cy="281" rx="3" ry="0.8" fill="#6a4838" opacity="0.06" />
      <ellipse cx="600" cy="279" rx="2.5" ry="0.6" fill="#6a4838" opacity="0.05" />

      {/* Ground color variation patches — different soil tones */}
      <ellipse cx="80" cy="320" rx="30" ry="12" fill="#221e12" opacity="0.12" />
      <ellipse cx="200" cy="310" rx="25" ry="10" fill="#1e1a0e" opacity="0.1" />
      <ellipse cx="440" cy="305" rx="35" ry="14" fill="#201c10" opacity="0.08" />
      <ellipse cx="650" cy="300" rx="28" ry="10" fill="#1e1a0e" opacity="0.1" />

      {/* === SCATTERED BATTLEFIELD DEBRIS ON NEAR BANK === */}
      {/* Dropped cartridge papers — small white scraps on ground */}
      <rect x="280" y="310" width="2" height="1.5" rx="0.2" fill="#4a4840" opacity="0.15" transform="rotate(25 281 311)" />
      <rect x="290" y="308" width="1.8" height="1.3" rx="0.2" fill="#4a4840" opacity="0.12" transform="rotate(-15 291 309)" />
      <rect x="335" y="306" width="2" height="1.5" rx="0.2" fill="#4a4840" opacity="0.13" transform="rotate(40 336 307)" />
      <rect x="520" y="284" width="2.2" height="1.5" rx="0.2" fill="#4a4840" opacity="0.1" transform="rotate(10 521 285)" />
      <rect x="610" y="280" width="1.8" height="1.2" rx="0.2" fill="#4a4840" opacity="0.12" transform="rotate(-30 611 281)" />

      {/* Scattered musket balls / grapeshot on ground */}
      <circle cx="295" cy="312" r="0.6" fill="#3a3530" opacity="0.2" />
      <circle cx="298" cy="314" r="0.5" fill="#3a3530" opacity="0.18" />
      <circle cx="560" cy="286" r="0.5" fill="#3a3530" opacity="0.15" />
      <circle cx="630" cy="278" r="0.6" fill="#3a3530" opacity="0.16" />

      {/* Broken ramrod — thin stick on ground near bridge approach */}
      <line x1="530" y1="280" x2="548" y2="276" stroke="#3a3020" strokeWidth="0.6" opacity="0.2" />
      <line x1="548" y1="276" x2="550" y2="277" stroke="#3a3020" strokeWidth="0.5" opacity="0.15" />

      {/* Powder horn — dropped near campfire area */}
      <path d="M355 302 Q360 300 364 302 Q366 304 362 306 Q358 305 355 302 Z" fill="#2a2218" opacity="0.35" />
      <path d="M355 302 Q354 301 355 300" fill="none" stroke="#2a2218" strokeWidth="0.5" opacity="0.25" />

      {/* Coiled rope — near the artillery position */}
      <ellipse cx="510" cy="286" rx="4" ry="3" fill="none" stroke="#2a2518" strokeWidth="1" opacity="0.25" />
      <ellipse cx="510" cy="286" rx="2.5" ry="1.8" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.2" />

      {/* Canteen strap draped over a rock */}
      <path d="M320 282 Q324 278 330 280 Q334 276 336 278" fill="none" stroke="#2a2418" strokeWidth="0.6" opacity="0.2" />

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

      {/* === TROPHY PILE — captured Austrian drums, standards, and equipment === */}
      {/* Pile base — heap of captured equipment */}
      <path d="M220 296 Q230 288 248 290 Q260 288 268 296 Q258 300 238 300 Z" fill="#1e1a12" opacity="0.5" />
      {/* Captured Austrian drum 1 — large, on its side */}
      <ellipse cx="232" cy="294" rx="8" ry="6" fill="#2a2218" opacity="0.6" />
      <path d="M224 294 Q224 288 232 288 Q240 288 240 294" fill="#322818" opacity="0.5" />
      {/* Drum rope tensioners — white cord detail */}
      <line x1="226" y1="289" x2="226" y2="294" stroke="#5a5548" strokeWidth="0.4" opacity="0.3" />
      <line x1="232" y1="288" x2="232" y2="294" stroke="#5a5548" strokeWidth="0.4" opacity="0.3" />
      <line x1="238" y1="289" x2="238" y2="294" stroke="#5a5548" strokeWidth="0.4" opacity="0.3" />
      {/* Austrian eagle badge on drum face */}
      <path d="M230 291 Q232 289 234 291 Q232 293 230 291" fill="#4a4030" opacity="0.25" />
      {/* Captured Austrian drum 2 — smaller, tilted atop */}
      <ellipse cx="246" cy="290" rx="5" ry="4" fill="#282018" opacity="0.55" />
      <path d="M241 290 Q241 286 246 286 Q251 286 251 290" fill="#302818" opacity="0.45" />
      {/* Captured standard — pole broken, flag crumpled over the pile */}
      <line x1="236" y1="296" x2="250" y2="278" stroke="#3a3020" strokeWidth="1.5" opacity="0.5" />
      <path d="M246 278 Q252 280 256 276 Q258 282 254 286 Q250 284 246 278" fill="#5a2020" opacity="0.35" />
      {/* Gold eagle finial — broken at top of captured standard */}
      <path d="M250 276 Q252 272 254 276" fill="#6a5a30" opacity="0.3" />
      {/* Piled shakos — Austrian helmets */}
      <ellipse cx="256" cy="294" rx="4" ry="2" fill="#1a1510" opacity="0.4" />
      <ellipse cx="260" cy="292" rx="3.5" ry="1.8" fill="#1e1812" opacity="0.35" />
      {/* White crossbelt straps draped over pile */}
      <path d="M228 292 Q238 288 252 290" fill="none" stroke="#5a5548" strokeWidth="0.5" opacity="0.2" />
      <path d="M240 296 Q250 292 262 294" fill="none" stroke="#5a5548" strokeWidth="0.4" opacity="0.18" />
      {/* Cartridge box */}
      <rect x="254" y="296" width="5" height="4" rx="0.5" fill="#1a1510" opacity="0.4" />

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
      <path d="M490 278 L525 272 L530 275 L495 282 Z" fill="#0e0c08" opacity="0.9" />
      <circle cx="500" cy="284" r="6.5" fill="#0e0c08" opacity="0.9" />
      <circle cx="518" cy="282" r="6.5" fill="#0e0c08" opacity="0.9" />
      {/* Barrel — thicker, more visible */}
      <path d="M525 271 L540 268 L541 271 L526 274 Z" fill="#1a1510" opacity="0.85" />
      {/* Muzzle opening */}
      <circle cx="541" cy="269.5" r="1.5" fill="#0a0808" opacity="0.8" />
      {/* MUZZLE FLASH — cannon 1 firing! */}
      <ellipse cx="548" cy="268" rx="12" ry="6" fill="url(#ch4_muzzleFlash)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="12;16;12" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Flash bright core */}
      <circle cx="544" cy="268" r="3" fill="#fff8e0" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.05;0.35" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Flash illumination on ground nearby */}
      <ellipse cx="535" cy="280" rx="20" ry="8" fill="#e0a040" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.01;0.06" dur="3s" repeatCount="indefinite" />
      </ellipse>

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

      {/* === BLAST WAVE RINGS — shockwave from cannon 1 === */}
      <ellipse cx="548" cy="268" rx="20" ry="8" fill="url(#ch4_blastWave)" opacity="0.5">
        <animate attributeName="rx" values="12;35;50" dur="3s" repeatCount="indefinite" />
        <animate attributeName="ry" values="6;14;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.15;0" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Blast wave ring — cannon 2 offset */}
      <ellipse cx="614" cy="267" rx="16" ry="6" fill="url(#ch4_blastWave)" opacity="0.35">
        <animate attributeName="rx" values="10;30;45" dur="4s" repeatCount="indefinite" />
        <animate attributeName="ry" values="5;12;18" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.35;0" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* === RISING SMOKE PILLARS — thick columns from fired cannons === */}
      {/* Pillar from cannon 1 — dense, rising and spreading */}
      <path d="M542 264 Q538 248 540 230 Q544 212 536 195 Q530 185 538 175"
        fill="none" stroke="#706058" strokeWidth="6" opacity="0.07" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,-5;20,0;10,5;0,0" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.03;0.07" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Pillar from cannon 2 — thinner, faster rising */}
      <path d="M610 262 Q608 245 612 228 Q616 210 608 195"
        fill="none" stroke="#706058" strokeWidth="4" opacity="0.05" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,-4;0,0" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.02;0.05" dur="7s" repeatCount="indefinite" />
      </path>

      {/* === CANNON RECOIL DUST — kicked up from ground on each firing === */}
      <ellipse cx="500" cy="286" rx="8" ry="3" fill="#5a4a38" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.12;0.06" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="8;14;8" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="570" cy="282" rx="7" ry="2.5" fill="#5a4a38" opacity="0.05">
        <animate attributeName="opacity" values="0.01;0.1;0.01" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="7;12;7" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Cannon 2 */}
      <path d="M560 275 L590 270 L595 272 L565 278 Z" fill="#0e0c08" opacity="0.85" />
      <circle cx="570" cy="280" r="5.5" fill="#0e0c08" opacity="0.85" />
      <circle cx="585" cy="278" r="5.5" fill="#0e0c08" opacity="0.85" />
      {/* Barrel extension */}
      <path d="M595 270 L608 267 L609 269 L596 272 Z" fill="#1a1510" opacity="0.8" />
      {/* MUZZLE FLASH — cannon 2, offset timing */}
      <ellipse cx="614" cy="267" rx="10" ry="5" fill="url(#ch4_muzzleFlash)" opacity="0.45">
        <animate attributeName="opacity" values="0.1;0.45;0.1" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="10;14;10" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="610" cy="267" r="2.5" fill="#fff8e0" opacity="0.25">
        <animate attributeName="opacity" values="0.05;0.25;0.05" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Cannon 3 — further back */}
      <path d="M625 272 L650 268 L654 270 L629 275 Z" fill="#0e0c08" opacity="0.8" />
      <circle cx="632" cy="277" r="5" fill="#0e0c08" opacity="0.8" />
      <circle cx="645" cy="276" r="5" fill="#0e0c08" opacity="0.8" />
      {/* Barrel extension */}
      <path d="M654 268 L665 266 L666 268 L655 270 Z" fill="#1a1510" opacity="0.75" />
      {/* MUZZLE FLASH — cannon 3, different timing */}
      <ellipse cx="670" cy="266" rx="8" ry="4" fill="url(#ch4_muzzleFlash)" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.05;0.35" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="667" cy="266" r="2" fill="#f0d080" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.03;0.2" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Ammo crates and supplies */}
      <rect x="540" y="278" width="12" height="9" fill="#1a1510" opacity="0.65" />
      <rect x="544" y="274" width="12" height="9" fill="#1a1510" opacity="0.65" />
      {/* Stenciled marking on crate */}
      <path d="M546 277 Q549 276 552 277" fill="none" stroke="#3a3528" strokeWidth="0.5" opacity="0.2" />
      <rect x="600" y="276" width="10" height="8" fill="#1a1510" opacity="0.6" />
      {/* Barrel — water/powder */}
      <ellipse cx="615" cy="280" rx="5" ry="4" fill="#1a1510" opacity="0.5" />
      {/* Barrel hoops */}
      <path d="M610 279 Q615 277 620 279" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      <path d="M610 281 Q615 283 620 281" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      {/* Limber — two-wheeled cart for moving cannon, unhitched nearby */}
      <path d="M645 286 Q650 284 660 284 Q665 286 660 288 Q650 288 645 286 Z" fill="#1a1510" opacity="0.5" />
      <circle cx="648" cy="290" r="4" fill="#12100c" opacity="0.45" />
      <circle cx="658" cy="290" r="4" fill="#12100c" opacity="0.45" />
      {/* Limber wheels — spoked */}
      <line x1="648" y1="286" x2="648" y2="294" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      <line x1="644" y1="290" x2="652" y2="290" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      <line x1="658" y1="286" x2="658" y2="294" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      <line x1="654" y1="290" x2="662" y2="290" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      {/* Stacked cannonballs — pyramid of iron shot */}
      <circle cx="556" cy="280" r="1.8" fill="#12100c" opacity="0.55" />
      <circle cx="560" cy="280" r="1.8" fill="#12100c" opacity="0.55" />
      <circle cx="558" cy="278" r="1.8" fill="#12100c" opacity="0.55" />
      {/* Sponge bucket — wooden bucket with water for cooling barrel */}
      <path d="M530 280 Q528 276 530 274 Q534 276 532 280 Z" fill="#2a2518" opacity="0.35" />
      {/* Sponge rod leaning against crate */}
      <line x1="538" y1="278" x2="536" y2="262" stroke="#3a3020" strokeWidth="1" opacity="0.4" />

      {/* Artillery crew silhouettes — more figures, more visible */}
      {/* Artilleryman 1 — ramming/loading */}
      <path d="M535 268 Q533 256 535 250 Q537 244 539 250 L541 268 Z" fill="#0e0c08" opacity="0.85" />
      <circle cx="537" cy="244" r="4.5" fill="#0e0c08" opacity="0.85" />
      {/* Ramrod extended forward */}
      <line x1="541" y1="256" x2="552" y2="254" stroke="#0e0c08" strokeWidth="1" opacity="0.6" />
      {/* Artilleryman 2 — standing with linstock */}
      <path d="M553 270 Q551 260 553 254 Q555 248 557 254 L559 270 Z" fill="#0e0c08" opacity="0.8" />
      <circle cx="555" cy="248" r="4" fill="#0e0c08" opacity="0.8" />
      {/* Linstock (lit slow-match pole) */}
      <line x1="559" y1="254" x2="562" y2="238" stroke="#3a3020" strokeWidth="1" opacity="0.6" />
      {/* Glowing slow-match tip */}
      <circle cx="562" cy="237" r="1.5" fill="#e08030" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.25;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Artilleryman 3 — carrying cannonball */}
      <path d="M618 268 Q616 260 618 254 Q620 250 622 254 L624 268 Z" fill="#0e0c08" opacity="0.75" />
      <circle cx="620" cy="250" r="3.5" fill="#0e0c08" opacity="0.75" />
      {/* Arms holding ball */}
      <path d="M616 258 Q614 262 612 264" fill="none" stroke="#0e0c08" strokeWidth="1.5" opacity="0.55" />
      <circle cx="612" cy="264" r="2" fill="#12100c" opacity="0.5" />

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

      {/* === DANCING SOLDIER — jig near the fire, arms swinging === */}
      <path d="M310 290 Q308 280 310 272 Q312 266 314 272 L316 290 Z" fill="#12100c" opacity="0.72" />
      <circle cx="312" cy="266" r="4" fill="#12100c" opacity="0.72" />
      {/* Left arm swinging out */}
      <path d="M308 276 Q302 270 298 268" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M308 276 Q302 270 298 268;M308 276 Q300 274 296 276;M308 276 Q302 270 298 268" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Right arm swinging out */}
      <path d="M316 276 Q322 270 326 268" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M316 276 Q322 270 326 268;M316 276 Q324 274 328 276;M316 276 Q322 270 326 268" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Left leg kicking */}
      <path d="M310 290 Q306 296 304 302" fill="none" stroke="#12100c" strokeWidth="2" opacity="0.5">
        <animate attributeName="d" values="M310 290 Q306 296 304 302;M310 290 Q304 294 300 298;M310 290 Q306 296 304 302" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Right leg planted */}
      <line x1="316" y1="290" x2="318" y2="304" stroke="#12100c" strokeWidth="2" opacity="0.5" />
      {/* Body bobbing animation */}
      <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="0.4s" repeatCount="indefinite" />

      {/* === FIFE PLAYER — seated, playing a fife near the celebration === */}
      <path d="M340 296 Q338 288 340 280 Q342 274 344 280 L346 296 Z" fill="#12100c" opacity="0.68" />
      <circle cx="342" cy="274" r="3.8" fill="#12100c" opacity="0.68" />
      {/* Arms forward — holding fife to mouth */}
      <path d="M344 280 Q350 278 356 280" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.45" />
      <path d="M340 280 Q346 276 352 278" fill="none" stroke="#12100c" strokeWidth="1.3" opacity="0.4" />
      {/* Fife — small horizontal tube at mouth level */}
      <line x1="346" y1="276" x2="364" y2="278" stroke="#4a4030" strokeWidth="1" opacity="0.4" />
      {/* Fingers on fife — tiny dots */}
      <circle cx="350" cy="277" r="0.5" fill="#12100c" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.2;0.35" dur="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="354" cy="277.5" r="0.5" fill="#12100c" opacity="0.35">
        <animate attributeName="opacity" values="0.2;0.35;0.2" dur="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="358" cy="278" r="0.5" fill="#12100c" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.2;0.35" dur="0.5s" repeatCount="indefinite" />
      </circle>

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

      {/* === FIELD HOSPITAL TENT — wounded being tended after the charge === */}
      {/* Tent structure — canvas A-frame, period campaign tent */}
      <path d="M40 298 L55 272 L70 298 Z" fill="#2a2418" opacity="0.55" />
      {/* Tent front opening — dark interior visible */}
      <path d="M45 298 L55 278 L65 298 Z" fill="#1a1510" opacity="0.4" />
      {/* Tent ridge pole */}
      <line x1="55" y1="272" x2="55" y2="298" stroke="#3a3020" strokeWidth="0.6" opacity="0.3" />
      {/* Canvas folds — wrinkle lines on tent surface */}
      <path d="M47 290 Q50 284 55 276" fill="none" stroke="#201c14" strokeWidth="0.4" opacity="0.2" />
      <path d="M63 290 Q60 284 55 276" fill="none" stroke="#201c14" strokeWidth="0.4" opacity="0.2" />
      {/* Guy ropes — tent secured to ground */}
      <line x1="40" y1="298" x2="32" y2="306" stroke="#3a3520" strokeWidth="0.4" opacity="0.2" />
      <line x1="70" y1="298" x2="78" y2="306" stroke="#3a3520" strokeWidth="0.4" opacity="0.2" />
      {/* Peg stakes — small angled lines */}
      <line x1="32" y1="306" x2="30" y2="310" stroke="#3a3020" strokeWidth="0.5" opacity="0.15" />
      <line x1="78" y1="306" x2="80" y2="310" stroke="#3a3020" strokeWidth="0.5" opacity="0.15" />
      {/* Wounded soldier being helped inside — two figures at entrance */}
      <path d="M48 292 Q46 286 48 282 Q50 278 52 282 L54 292 Z" fill="#12100c" opacity="0.5" />
      <circle cx="50" cy="278" r="2.5" fill="#12100c" opacity="0.5" />
      {/* Helper supporting wounded man */}
      <path d="M56 292 Q54 286 56 280 Q58 276 60 280 L62 292 Z" fill="#12100c" opacity="0.45" />
      <circle cx="58" cy="276" r="2.5" fill="#12100c" opacity="0.45" />
      {/* Supporting arm */}
      <path d="M54 284 Q52 284 50 286" fill="none" stroke="#12100c" strokeWidth="1" opacity="0.3" />
      {/* Lantern at tent entrance — warm glow */}
      <rect x="42" y="294" width="2" height="3" fill="#2a2418" opacity="0.35" />
      <circle cx="43" cy="293" r="1" fill="#d0a050" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="43" cy="296" rx="6" ry="4" fill="#c08040" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.02;0.04" dur="1.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === SECOND TENT — further back, officers' quarters === */}
      <path d="M680 305 L700 275 L720 305 Z" fill="#2a2418" opacity="0.5" />
      <path d="M686 305 L700 280 L714 305 Z" fill="#1a1510" opacity="0.35" />
      <line x1="700" y1="275" x2="700" y2="305" stroke="#3a3020" strokeWidth="0.6" opacity="0.25" />
      {/* Tent flap — partially open, caught by breeze */}
      <path d="M700 280 Q705 284 708 292" fill="none" stroke="#2a2418" strokeWidth="1.5" opacity="0.25" />
      {/* Small pennant on ridge pole */}
      <path d="M700 275 Q704 273 706 276" fill="#1a1830" opacity="0.3">
        <animate attributeName="d" values="M700 275 Q704 273 706 276;M700 275 Q705 272 707 275;M700 275 Q704 273 706 276" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Guy ropes */}
      <line x1="680" y1="305" x2="672" y2="312" stroke="#3a3520" strokeWidth="0.4" opacity="0.18" />
      <line x1="720" y1="305" x2="728" y2="312" stroke="#3a3520" strokeWidth="0.4" opacity="0.18" />

      {/* === SUPPLY WAGON — parked near artillery, unhitched === */}
      {/* Wagon bed — rectangular, wooden sides */}
      <path d="M640 300 Q645 296 670 296 Q680 296 685 300 Q678 304 648 304 Z" fill="#1e1a12" opacity="0.55" />
      {/* Wagon side planking */}
      <path d="M645 296 Q645 290 645 286 L670 286 Q670 290 670 296" fill="#221e14" opacity="0.45" />
      {/* Plank lines on wagon sides */}
      <line x1="645" y1="289" x2="670" y2="289" stroke="#1a1610" strokeWidth="0.3" opacity="0.2" />
      <line x1="645" y1="292" x2="670" y2="292" stroke="#1a1610" strokeWidth="0.3" opacity="0.2" />
      {/* Wagon wheels — larger, spoked */}
      <circle cx="650" cy="306" r="5.5" fill="none" stroke="#1a1510" strokeWidth="1.5" opacity="0.5" />
      <circle cx="674" cy="306" r="5.5" fill="none" stroke="#1a1510" strokeWidth="1.5" opacity="0.5" />
      {/* Wheel spokes */}
      <line x1="650" y1="300" x2="650" y2="312" stroke="#1a1510" strokeWidth="0.5" opacity="0.3" />
      <line x1="644" y1="306" x2="656" y2="306" stroke="#1a1510" strokeWidth="0.5" opacity="0.3" />
      <line x1="646" y1="302" x2="654" y2="310" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      <line x1="654" y1="302" x2="646" y2="310" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      <line x1="674" y1="300" x2="674" y2="312" stroke="#1a1510" strokeWidth="0.5" opacity="0.3" />
      <line x1="668" y1="306" x2="680" y2="306" stroke="#1a1510" strokeWidth="0.5" opacity="0.3" />
      <line x1="670" y1="302" x2="678" y2="310" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      <line x1="678" y1="302" x2="670" y2="310" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      {/* Wheel hubs */}
      <circle cx="650" cy="306" r="1.5" fill="#1a1510" opacity="0.4" />
      <circle cx="674" cy="306" r="1.5" fill="#1a1510" opacity="0.4" />
      {/* Wagon tongue — hitching pole extended forward */}
      <line x1="645" y1="298" x2="632" y2="304" stroke="#221e14" strokeWidth="1.2" opacity="0.35" />
      {/* Cargo visible — sacks, barrels loaded in wagon */}
      <ellipse cx="652" cy="290" rx="4" ry="3" fill="#1e1a12" opacity="0.4" />
      <ellipse cx="660" cy="288" rx="3" ry="2.5" fill="#201c14" opacity="0.35" />
      <path d="M664 292 Q666 288 668 292 Q666 294 664 292" fill="#1a1510" opacity="0.3" />
      {/* Canvas tarp partially covering cargo */}
      <path d="M648 286 Q658 282 670 286" fill="none" stroke="#2a2418" strokeWidth="1.5" opacity="0.25" />

      {/* === WOUNDED SOLDIER — sitting against wagon wheel, bandaged === */}
      <path d="M636 300 Q634 294 636 288 Q638 284 640 288 L642 300 Z" fill="#12100c" opacity="0.55" />
      <circle cx="638" cy="284" r="3" fill="#12100c" opacity="0.55" />
      {/* Bandage on head — lighter strip visible */}
      <path d="M636 283 Q638 281 640 283" fill="#4a4840" opacity="0.2" />
      {/* Arm in sling — crude bandage */}
      <path d="M636 290 Q632 292 630 296" fill="none" stroke="#12100c" strokeWidth="1.2" opacity="0.35" />
      <path d="M632 292 Q634 295 636 294" fill="none" stroke="#4a4840" strokeWidth="0.8" opacity="0.15" />
      {/* Canteen beside him */}
      <ellipse cx="630" cy="302" rx="2.5" ry="2" fill="#2a2418" opacity="0.35" />

      {/* === SURGEON'S TABLE — crude plank on barrels near hospital tent === */}
      {/* Two barrel supports */}
      <ellipse cx="28" cy="310" rx="3.5" ry="3" fill="#1e1a12" opacity="0.4" />
      <ellipse cx="16" cy="310" rx="3.5" ry="3" fill="#1e1a12" opacity="0.4" />
      {/* Plank across barrels */}
      <rect x="12" y="307" width="20" height="1.5" fill="#2a2518" opacity="0.35" />
      {/* Instruments — dark shapes on the plank */}
      <line x1="16" y1="307" x2="22" y2="307" stroke="#3a3530" strokeWidth="0.4" opacity="0.2" />
      <circle cx="26" cy="307" r="0.8" fill="#2a2218" opacity="0.2" />
      {/* Blood-stained cloth — dark rag nearby */}
      <path d="M30 308 Q33 306 35 309 Q32 311 30 308" fill="#2a1210" opacity="0.15" />

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

      {/* === LANTERN ON POLE — hung near the main celebration fire === */}
      {/* Pole — tall, driven into the ground */}
      <line x1="270" y1="258" x2="270" y2="300" stroke="#3a3020" strokeWidth="1.5" opacity="0.6" />
      {/* Cross-arm at top for hanging lantern */}
      <line x1="266" y1="260" x2="276" y2="258" stroke="#3a3020" strokeWidth="1" opacity="0.5" />
      {/* Lantern body — small rectangle with glass panes */}
      <rect x="272" y="260" width="5" height="7" rx="0.5" fill="#2a2418" opacity="0.55" />
      {/* Lantern glass — warm glow visible */}
      <rect x="273" y="261" width="3" height="5" rx="0.3" fill="#d0a050" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="1.2s" repeatCount="indefinite" />
      </rect>
      {/* Lantern flame — tiny inside glow */}
      <path d="M274 264 Q275 261 276 264" fill="#e0c070" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="0.7s" repeatCount="indefinite" />
      </path>
      {/* Lantern hook/chain from cross-arm */}
      <path d="M275 258 Q275 259 274 260" fill="none" stroke="#4a4030" strokeWidth="0.5" opacity="0.4" />
      {/* Lantern glow — warm light pool */}
      <ellipse cx="275" cy="270" rx="18" ry="12" fill="url(#ch4_lanternGlow)">
        <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Lantern cap/top */}
      <path d="M272 260 Q274.5 257 277 260" fill="#2a2418" opacity="0.5" />

      {/* Soldiers around campfire */}
      <path d="M282 294 Q280 284 283 278 Q286 284 284 294 Z" fill="#12100c" opacity="0.7" />
      <circle cx="283" cy="275" r="3.5" fill="#12100c" opacity="0.7" />
      {/* Soldier gesturing at fire — pointing at flames */}
      <path d="M284 280 Q288 278 292 280" fill="none" stroke="#12100c" strokeWidth="1.3" opacity="0.4" />
      <path d="M318 294 Q316 286 319 280 Q322 286 320 294 Z" fill="#12100c" opacity="0.7" />
      <circle cx="319" cy="277" r="3.5" fill="#12100c" opacity="0.7" />
      {/* Soldier leaning forward, warming hands */}
      <path d="M316 282 Q312 286 308 288" fill="none" stroke="#12100c" strokeWidth="1.3" opacity="0.4" />
      <path d="M322 282 Q326 286 330 288" fill="none" stroke="#12100c" strokeWidth="1.3" opacity="0.4" />

      {/* === FIRE-LIT FACES — warm highlights on soldiers nearest to campfire 1 === */}
      {/* Warm highlight on left soldier's face */}
      <circle cx="284" cy="275" r="3.5" fill="#a06830" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.02;0.04" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Warm highlight on right soldier */}
      <circle cx="318" cy="277" r="3.5" fill="#a06830" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.015;0.03" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Fire illumination on dancing soldier */}
      <circle cx="312" cy="270" r="6" fill="#c08040" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.015;0.03" dur="1s" repeatCount="indefinite" />
      </circle>

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
      {/* Third tripod — further right, near artillery */}
      <line x1="480" y1="266" x2="484" y2="290" stroke="#2a2520" strokeWidth="1.2" opacity="0.65" />
      <line x1="488" y1="266" x2="484" y2="290" stroke="#2a2520" strokeWidth="1.2" opacity="0.65" />
      <line x1="484" y1="264" x2="484" y2="290" stroke="#2a2520" strokeWidth="1.2" opacity="0.65" />
      {/* Fourth tripod — far left, near campfire 2 */}
      <line x1="96" y1="290" x2="100" y2="314" stroke="#2a2520" strokeWidth="1" opacity="0.5" />
      <line x1="104" y1="290" x2="100" y2="314" stroke="#2a2520" strokeWidth="1" opacity="0.5" />
      <line x1="100" y1="288" x2="100" y2="314" stroke="#2a2520" strokeWidth="1" opacity="0.5" />
      {/* Fifth tripod — between celebration groups */}
      <line x1="450" y1="268" x2="454" y2="292" stroke="#2a2520" strokeWidth="1.1" opacity="0.6" />
      <line x1="458" y1="268" x2="454" y2="292" stroke="#2a2520" strokeWidth="1.1" opacity="0.6" />

      {/* === DRUMMER BOY — young, sitting on a barrel, drumsticks idle === */}
      {/* Barrel seat */}
      <ellipse cx="375" cy="296" rx="4" ry="3" fill="#1e1a12" opacity="0.5" />
      {/* Sitting body — smaller, younger */}
      <path d="M374 296 Q372 290 374 284 Q376 280 378 284 L380 296 Z" fill="#12100c" opacity="0.6" />
      <circle cx="376" cy="280" r="3.2" fill="#12100c" opacity="0.6" />
      {/* Drum on ground beside him */}
      <ellipse cx="368" cy="300" rx="4" ry="3" fill="#2a2218" opacity="0.5" />
      <path d="M364 300 Q364 297 368 297 Q372 297 372 300" fill="#302818" opacity="0.4" />
      {/* Drumstick in hand, dangling */}
      <line x1="378" y1="288" x2="384" y2="296" stroke="#3a3020" strokeWidth="0.6" opacity="0.3" />
      {/* Second drumstick on ground */}
      <line x1="370" y1="304" x2="382" y2="302" stroke="#3a3020" strokeWidth="0.5" opacity="0.25" />

      {/* === PRAYER SOLDIER — kneeling, hat off, head bowed === */}
      <path d="M748 298 Q746 290 748 284 Q750 280 752 284 L754 290 Q753 294 752 298" fill="#12100c" opacity="0.55" />
      <circle cx="750" cy="280" r="3.5" fill="#12100c" opacity="0.55" />
      {/* Head bowed forward */}
      <path d="M748 281 Q746 282 745 284" fill="#12100c" opacity="0.4" />
      {/* Kneeling leg */}
      <path d="M748 298 Q746 302 744 306" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.35" />
      <path d="M752 298 Q754 304 756 306" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.35" />
      {/* Hat on ground beside him */}
      <ellipse cx="756" cy="300" rx="3" ry="1.5" fill="#1a1510" opacity="0.35" />
      {/* Musket propped beside him */}
      <line x1="743" y1="276" x2="745" y2="302" stroke="#2a2520" strokeWidth="1" opacity="0.4" />

      {/* === STACKED CANNON TOOLS — organized near the battery === */}
      {/* Worm (corkscrew-shaped cleaning tool) leaning on crate */}
      <line x1="542" y1="262" x2="540" y2="278" stroke="#3a3020" strokeWidth="0.8" opacity="0.3" />
      {/* Handspike — long lever for aiming cannon */}
      <line x1="625" y1="260" x2="622" y2="278" stroke="#3a3020" strokeWidth="1.2" opacity="0.35" />
      {/* Trail spade — small shovel for trail adjustments */}
      <path d="M630 276 Q632 272 634 276 Q632 278 630 276" fill="#3a3530" opacity="0.25" />
      <line x1="632" y1="276" x2="634" y2="260" stroke="#3a3020" strokeWidth="0.7" opacity="0.3" />

      {/* === HORSE TROUGH — stone water basin near tethered horse === */}
      <path d="M682 286 Q686 282 694 282 Q698 282 702 286 Q698 288 690 288 Q684 288 682 286 Z" fill="#2a2518" opacity="0.4" />
      {/* Water in trough — dark reflective surface */}
      <ellipse cx="692" cy="284" rx="5" ry="1.5" fill="#1e1a25" opacity="0.2" />
      {/* Trough stone texture */}
      <path d="M684 284 Q690 282 696 284" fill="none" stroke="#1e1a12" strokeWidth="0.3" opacity="0.15" />

      {/* === FOREGROUND === */}
      {/* River bank vegetation — reeds */}
      <line x1="5" y1="278" x2="7" y2="258" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="280" x2="13" y2="262" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="18" y1="279" x2="19" y2="260" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />
      <line x1="780" y1="275" x2="782" y2="255" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="788" y1="276" x2="790" y2="258" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="795" y1="275" x2="796" y2="257" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />

      {/* === RIVERBANK REEDS — dense clusters growing where water meets shore === */}
      {/* Left bank reed cluster — thick stand near waterline */}
      <line x1="35" y1="278" x2="33" y2="254" stroke="#2a3520" strokeWidth="0.9" opacity="0.28" />
      <line x1="38" y1="279" x2="40" y2="256" stroke="#283018" strokeWidth="0.7" opacity="0.24" />
      <line x1="42" y1="278" x2="41" y2="252" stroke="#2a3520" strokeWidth="0.8" opacity="0.22" />
      <line x1="46" y1="279" x2="44" y2="258" stroke="#283018" strokeWidth="0.7" opacity="0.2" />
      {/* Reed seed heads — fuzzy tops */}
      <ellipse cx="33" cy="253" rx="0.8" ry="2" fill="#3a3520" opacity="0.15" />
      <ellipse cx="41" cy="251" rx="0.7" ry="1.8" fill="#3a3520" opacity="0.13" />
      {/* Reed leaf blades — arching out from stems */}
      <path d="M35 264 Q30 260 26 262" fill="none" stroke="#2a3520" strokeWidth="0.5" opacity="0.12" />
      <path d="M42 266 Q48 262 52 264" fill="none" stroke="#283018" strokeWidth="0.5" opacity="0.1" />
      {/* Gentle sway animation for reed cluster */}
      <g opacity="0.2">
        <line x1="55" y1="279" x2="54" y2="260" stroke="#2a3520" strokeWidth="0.6">
          <animate attributeName="x2" values="54;56;54" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="58" y1="278" x2="57" y2="262" stroke="#283018" strokeWidth="0.5">
          <animate attributeName="x2" values="57;59;57" dur="3.5s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Center-left bank reeds — sparse cluster near rocks */}
      <line x1="160" y1="276" x2="158" y2="254" stroke="#2a3520" strokeWidth="0.8" opacity="0.2" />
      <line x1="164" y1="275" x2="166" y2="252" stroke="#283018" strokeWidth="0.7" opacity="0.18" />
      <line x1="168" y1="276" x2="167" y2="256" stroke="#2a3520" strokeWidth="0.6" opacity="0.16" />
      <ellipse cx="158" cy="253" rx="0.7" ry="1.8" fill="#3a3520" opacity="0.12" />

      {/* Right bank reed cluster — taller, denser */}
      <line x1="750" y1="272" x2="748" y2="248" stroke="#2a3520" strokeWidth="0.9" opacity="0.26" />
      <line x1="754" y1="273" x2="756" y2="250" stroke="#283018" strokeWidth="0.8" opacity="0.22" />
      <line x1="758" y1="272" x2="757" y2="246" stroke="#2a3520" strokeWidth="0.7" opacity="0.2" />
      <line x1="762" y1="273" x2="760" y2="252" stroke="#283018" strokeWidth="0.6" opacity="0.18" />
      <ellipse cx="748" cy="247" rx="0.8" ry="2" fill="#3a3520" opacity="0.14" />
      <ellipse cx="757" cy="245" rx="0.7" ry="1.8" fill="#3a3520" opacity="0.12" />
      {/* Right bank reed sway */}
      <g opacity="0.18">
        <line x1="745" y1="273" x2="743" y2="254" stroke="#2a3520" strokeWidth="0.7">
          <animate attributeName="x2" values="743;746;743" dur="3.8s" repeatCount="indefinite" />
        </line>
        <line x1="766" y1="272" x2="765" y2="256" stroke="#283018" strokeWidth="0.6">
          <animate attributeName="x2" values="765;768;765" dur="4.2s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Mid-bank sparse reeds — isolated clumps breaking out of the water */}
      <line x1="340" y1="272" x2="339" y2="260" stroke="#2a3520" strokeWidth="0.5" opacity="0.12" />
      <line x1="343" y1="273" x2="344" y2="262" stroke="#283018" strokeWidth="0.4" opacity="0.1" />
      <line x1="580" y1="270" x2="579" y2="258" stroke="#2a3520" strokeWidth="0.5" opacity="0.1" />
      <line x1="583" y1="271" x2="584" y2="260" stroke="#283018" strokeWidth="0.4" opacity="0.08" />

      {/* === FOREGROUND GRASS AND WEEDS — growing from the riverbank === */}
      {/* Grass tufts — near-bank left side */}
      <path d="M30 276 Q32 268 34 260" fill="none" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />
      <path d="M34 277 Q35 270 33 262" fill="none" stroke="#283018" strokeWidth="0.6" opacity="0.22" />
      <path d="M38 278 Q40 270 42 264" fill="none" stroke="#2a3520" strokeWidth="0.7" opacity="0.2" />
      {/* Grass cluster — center left bank edge */}
      <path d="M120 274 Q122 264 120 256" fill="none" stroke="#2a3520" strokeWidth="0.8" opacity="0.22" />
      <path d="M124 275 Q126 266 128 258" fill="none" stroke="#283018" strokeWidth="0.7" opacity="0.2" />
      <path d="M128 274 Q127 265 130 258" fill="none" stroke="#2a3520" strokeWidth="0.6" opacity="0.18" />
      {/* Weedy plants — taller, wider leaves */}
      <path d="M50 278 Q48 270 50 260 Q52 256 54 262 Q56 270 54 278" fill="#2a3520" opacity="0.15" />
      <path d="M52 274 Q55 266 58 260" fill="none" stroke="#2a3520" strokeWidth="0.6" opacity="0.2" />
      {/* Right bank grass */}
      <path d="M760 272 Q762 264 760 256" fill="none" stroke="#2a3520" strokeWidth="0.8" opacity="0.25" />
      <path d="M764 273 Q766 264 768 258" fill="none" stroke="#283018" strokeWidth="0.7" opacity="0.22" />
      <path d="M768 272 Q767 263 770 256" fill="none" stroke="#2a3520" strokeWidth="0.7" opacity="0.2" />
      {/* Scattered short grass along bank edge */}
      <path d="M180 276 Q181 272 180 268" fill="none" stroke="#2a3520" strokeWidth="0.5" opacity="0.18" />
      <path d="M184 275 Q185 270 184 266" fill="none" stroke="#283018" strokeWidth="0.5" opacity="0.15" />
      <path d="M400 270 Q401 266 400 262" fill="none" stroke="#2a3520" strokeWidth="0.5" opacity="0.16" />
      <path d="M404 271 Q405 267 406 263" fill="none" stroke="#283018" strokeWidth="0.5" opacity="0.14" />
      {/* Bank-edge weed — drooping toward water */}
      <path d="M650 270 Q648 264 644 260 Q642 258 641 260" fill="none" stroke="#2a3520" strokeWidth="0.7" opacity="0.2" />
      <path d="M654 271 Q652 265 650 262" fill="none" stroke="#283018" strokeWidth="0.6" opacity="0.18" />

      {/* === WILDFLOWERS AND VARIED VEGETATION — period-accurate riverside plants === */}
      {/* Bulrush / cattail cluster — left bank, taller reeds with seed heads */}
      <line x1="25" y1="278" x2="24" y2="248" stroke="#2a3018" strokeWidth="1" opacity="0.22" />
      <ellipse cx="24" cy="248" rx="1.2" ry="3" fill="#2a2218" opacity="0.2" />
      <line x1="30" y1="279" x2="28" y2="250" stroke="#2a3018" strokeWidth="0.9" opacity="0.2" />
      <ellipse cx="28" cy="250" rx="1" ry="2.5" fill="#2a2218" opacity="0.18" />
      {/* Bulrush cluster — right bank */}
      <line x1="770" y1="273" x2="772" y2="244" stroke="#2a3018" strokeWidth="1" opacity="0.22" />
      <ellipse cx="772" cy="244" rx="1.2" ry="3" fill="#2a2218" opacity="0.2" />
      <line x1="775" y1="274" x2="776" y2="246" stroke="#2a3018" strokeWidth="0.9" opacity="0.2" />
      <ellipse cx="776" cy="246" rx="1" ry="2.5" fill="#2a2218" opacity="0.18" />

      {/* Low scrub bushes — dark silhouettes on near bank */}
      <path d="M640 270 Q644 264 650 266 Q656 262 662 266 Q666 270 660 272 Q652 274 644 272 Z"
        fill="#1a2018" opacity="0.2" />
      <path d="M60 282 Q66 276 74 278 Q80 274 86 278 Q88 282 82 284 Q72 286 64 284 Z"
        fill="#1a2018" opacity="0.18" />

      {/* Small wild herbs — low ground cover between grass tufts */}
      <path d="M140 278 Q142 274 144 278" fill="#283518" opacity="0.12" />
      <path d="M146 280 Q148 276 150 280" fill="#283518" opacity="0.1" />
      <path d="M380 272 Q382 268 384 272" fill="#283518" opacity="0.1" />
      <path d="M386 274 Q387 270 389 274" fill="#283518" opacity="0.08" />
      <path d="M680 270 Q682 266 684 270" fill="#283518" opacity="0.1" />

      {/* Dead/brown grass patches — trampled by soldiers */}
      <ellipse cx="300" cy="290" rx="12" ry="3" fill="#221e10" opacity="0.08" />
      <ellipse cx="550" cy="278" rx="15" ry="3" fill="#221e10" opacity="0.1" />

      {/* === WILDFLOWER DETAIL — small blossoms catching last light === */}
      {/* Wild chamomile — tiny white-yellow dots among grass */}
      <circle cx="65" cy="280" r="0.5" fill="#4a4838" opacity="0.1" />
      <circle cx="68" cy="278" r="0.4" fill="#4a4838" opacity="0.08" />
      <circle cx="128" cy="274" r="0.5" fill="#4a4838" opacity="0.09" />
      <circle cx="170" cy="278" r="0.4" fill="#4a4838" opacity="0.08" />
      {/* Red poppies — tiny crimson dots (Italian countryside) */}
      <circle cx="400" cy="272" r="0.5" fill="#4a2020" opacity="0.08" />
      <circle cx="404" cy="274" r="0.4" fill="#4a2020" opacity="0.06" />
      <circle cx="660" cy="270" r="0.5" fill="#4a2020" opacity="0.07" />
      {/* Dandelion seed head — white puff catching breeze */}
      <circle cx="200" cy="274" r="1.2" fill="#4a4840" opacity="0.06" />
      <circle cx="202" cy="273" r="0.3" fill="#5a5850" opacity="0.04" />
      <circle cx="198" cy="273" r="0.3" fill="#5a5850" opacity="0.04" />
      <circle cx="200" cy="271" r="0.3" fill="#5a5850" opacity="0.04" />
      <circle cx="200" cy="275" r="0.3" fill="#5a5850" opacity="0.04" />

      {/* === INSECT SILHOUETTES — midges and mosquitoes over the river at dusk === */}
      {/* Tiny midge cloud — near left bank reeds */}
      <g opacity="0.06">
        <circle cx="42" cy="268" r="0.25" fill="#1a1510">
          <animate attributeName="cy" values="268;266;268" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="cx" values="42;44;42" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="45" cy="270" r="0.2" fill="#1a1510">
          <animate attributeName="cy" values="270;268;270" dur="1s" repeatCount="indefinite" />
          <animate attributeName="cx" values="45;43;45" dur="1.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="266" r="0.3" fill="#1a1510">
          <animate attributeName="cy" values="266;264;266" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="cx" values="40;42;40" dur="1.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="48" cy="269" r="0.2" fill="#1a1510">
          <animate attributeName="cy" values="269;267;269" dur="0.9s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Midge cloud near right bank */}
      <g opacity="0.05">
        <circle cx="762" cy="264" r="0.25" fill="#1a1510">
          <animate attributeName="cy" values="264;262;264" dur="1.1s" repeatCount="indefinite" />
          <animate attributeName="cx" values="762;764;762" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="765" cy="266" r="0.2" fill="#1a1510">
          <animate attributeName="cy" values="266;264;266" dur="1.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="760" cy="262" r="0.2" fill="#1a1510">
          <animate attributeName="cy" values="262;260;262" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === BAT SILHOUETTES — emerging from church tower at dusk === */}
      <path d="M310 108 Q306 106 302 104 Q306 105 310 108 Q314 105 318 104 Q314 106 310 108" fill="#1a1520" opacity="0.2">
        <animateTransform attributeName="transform" type="translate" values="0,0;-15,8;-30,16;-45,24" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.15;0.1;0" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M312 112 Q308 110 304 108 Q308 109 312 112 Q316 109 320 108 Q316 110 312 112" fill="#1a1520" opacity="0.15">
        <animateTransform attributeName="transform" type="translate" values="0,0;12,6;24,12;36,18" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.1;0.05;0" dur="9s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL GROUND TEXTURE — varied terrain on near bank === */}
      {/* Ant mound — small raised earth mound */}
      <ellipse cx="410" cy="290" rx="3" ry="1.5" fill="#252018" opacity="0.1" />
      {/* Dried puddle ring — salt/mineral deposit from evaporated water */}
      <ellipse cx="480" cy="286" rx="5" ry="2" fill="none" stroke="#2a2518" strokeWidth="0.3" opacity="0.06" />
      {/* Embedded stone cluster — partially exposed fieldstones */}
      <path d="M340 290 Q344 286 348 290 Q350 292 346 294 Q342 294 340 290 Z" fill="#2a2518" opacity="0.15" />
      <path d="M346 288 Q350 284 354 288 Q352 292 348 290 Z" fill="#282218" opacity="0.12" />
      {/* Sandy depression — slight color variation */}
      <ellipse cx="600" cy="292" rx="12" ry="4" fill="#2a2518" opacity="0.05" />

      {/* === LONG SHADOWS — cast by figures and objects in low dusk light === */}
      {/* Shadow from trophy pole — long, stretching right */}
      <path d="M200 298 Q220 296 260 292 Q280 290 300 290" fill="url(#ch4_figureShadow)" opacity="0.25" />
      {/* Shadow from musket tripod */}
      <path d="M355 290 Q365 288 380 286 Q390 285 400 286" fill="url(#ch4_figureShadow)" opacity="0.18" />
      {/* Shadow from standing soldier group */}
      <path d="M194 275 Q210 272 240 270 Q260 268 280 268" fill="url(#ch4_figureShadow)" opacity="0.2" />
      {/* Shadow from horse — large, elongated */}
      <path d="M735 296 Q750 294 770 292 Q790 290 800 290" fill="url(#ch4_figureShadow)" opacity="0.15" />
      {/* Shadow from cannon battery */}
      <path d="M530 282 Q545 280 565 278 Q580 276 600 276" fill="url(#ch4_figureShadow)" opacity="0.2" />

      {/* === DUST HAZE — warm airborne particles near ground level === */}
      <ellipse cx="400" cy="280" rx="120" ry="15" fill="url(#ch4_dustHaze)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.35;0.6" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="150" cy="290" rx="80" ry="12" fill="url(#ch4_dustHaze)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="680" cy="278" rx="70" ry="10" fill="url(#ch4_dustHaze)" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.18;0.35" dur="9s" repeatCount="indefinite" />
      </ellipse>

      {/* === BOOT PRINTS AND CHURNED EARTH — near bridge approach === */}
      {/* Churned mud area — where soldiers crossed and gathered */}
      <path d="M540 274 Q560 268 590 270 Q620 266 640 272 Q630 278 600 276 Q570 280 540 274 Z"
        fill="url(#ch4_churnedEarth)" opacity="0.35" />
      {/* Individual boot prints — impressed into soft ground */}
      <ellipse cx="550" cy="276" rx="2.5" ry="1.2" fill="#15120c" opacity="0.2" transform="rotate(-15 550 276)" />
      <ellipse cx="558" cy="274" rx="2.5" ry="1.2" fill="#15120c" opacity="0.18" transform="rotate(-5 558 274)" />
      <ellipse cx="566" cy="277" rx="2.5" ry="1.2" fill="#15120c" opacity="0.22" transform="rotate(-20 566 277)" />
      <ellipse cx="574" cy="273" rx="2.5" ry="1.2" fill="#15120c" opacity="0.19" transform="rotate(8 574 273)" />
      <ellipse cx="582" cy="276" rx="2.5" ry="1.2" fill="#15120c" opacity="0.2" transform="rotate(-12 582 276)" />
      <ellipse cx="590" cy="272" rx="2.5" ry="1.2" fill="#15120c" opacity="0.17" transform="rotate(5 590 272)" />
      <ellipse cx="598" cy="275" rx="2.5" ry="1.2" fill="#15120c" opacity="0.2" transform="rotate(-25 598 275)" />
      <ellipse cx="606" cy="271" rx="2.5" ry="1.2" fill="#15120c" opacity="0.18" transform="rotate(15 606 271)" />
      <ellipse cx="614" cy="274" rx="2.5" ry="1.2" fill="#15120c" opacity="0.21" transform="rotate(-8 614 274)" />
      <ellipse cx="622" cy="270" rx="2.5" ry="1.2" fill="#15120c" opacity="0.16" transform="rotate(0 622 270)" />
      {/* Rut marks — wheel or cannon dragged through */}
      <path d="M545 278 Q570 272 600 274 Q625 270 645 272" fill="none" stroke="#12100a" strokeWidth="1" opacity="0.12" />
      <path d="M548 280 Q572 274 602 276 Q628 272 648 274" fill="none" stroke="#12100a" strokeWidth="0.8" opacity="0.1" />
      {/* Disturbed earth patches — clods and scuffs */}
      <ellipse cx="560" cy="280" rx="4" ry="2" fill="#1e1a12" opacity="0.15" />
      <ellipse cx="585" cy="278" rx="5" ry="2.5" fill="#1e1a12" opacity="0.12" />
      <ellipse cx="615" cy="276" rx="4" ry="2" fill="#1e1a12" opacity="0.14" />

      {/* === WATER'S EDGE DETAILS — where river meets near bank === */}
      {/* Wet sand band — darker, reflective strip at waterline */}
      <path d="M0 276 Q80 270 160 274 Q240 268 320 272 Q400 266 480 270 Q560 264 640 268 Q720 262 800 270 L800 278 Q720 268 640 274 Q560 270 480 276 Q400 272 320 278 Q240 274 160 280 Q80 276 0 282 Z"
        fill="#1e1a14" opacity="0.2" />
      {/* Waterline foam — thin white-ish line where water laps shore */}
      <path d="M0 278 Q30 274 60 278 Q90 274 120 278 Q150 272 180 276 Q210 272 240 276 Q270 270 300 274"
        fill="none" stroke="#5a5450" strokeWidth="0.5" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M300 274 Q330 270 360 274 Q390 268 420 272 Q450 266 480 270 Q510 266 540 270 Q570 264 600 268"
        fill="none" stroke="#5a5450" strokeWidth="0.5" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.09;0.05" dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M600 268 Q630 264 660 268 Q690 262 720 266 Q750 260 780 264 Q790 262 800 266"
        fill="none" stroke="#5a5450" strokeWidth="0.5" opacity="0.05">
        <animate attributeName="opacity" values="0.05;0.08;0.05" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Wet pebbles at waterline — slightly reflective */}
      {[40, 85, 130, 210, 280, 360, 440, 510, 590, 670, 730].map((x, i) => (
        <React.Fragment key={`wetPeb${i}`}>
          <circle cx={x} cy={275 + (Math.sin(x * 0.05) * 4)} r={0.8 + (i % 3) * 0.3}
            fill="#2a2518" opacity={0.12 + (i % 2) * 0.04} />
          <circle cx={x + 3} cy={276 + (Math.sin(x * 0.05) * 4)} r={0.5 + (i % 2) * 0.2}
            fill="#282218" opacity={0.1 + (i % 3) * 0.03} />
        </React.Fragment>
      ))}
      {/* Driftwood at waterline — small debris washed up */}
      <path d="M190 276 Q195 274 202 276" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.15" />
      <path d="M430 270 Q434 268 440 270" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.12" />
      <path d="M710 264 Q714 262 720 264 Q722 263 724 264" fill="none" stroke="#2a2518" strokeWidth="0.7" opacity="0.14" />

      {/* === SCATTERED COOKING EQUIPMENT — soldiers' meal remnants === */}
      {/* Iron cooking pot near fire 1 — overturned */}
      <ellipse cx="280" cy="308" rx="4" ry="2.5" fill="#1a1510" opacity="0.45" />
      <path d="M276 308 Q280 304 284 308" fill="#201c14" opacity="0.35" />
      {/* Pot handle */}
      <path d="M278 306 Q280 302 282 306" fill="none" stroke="#2a2518" strokeWidth="0.5" opacity="0.25" />
      {/* Tin cup — small cylinder */}
      <path d="M340 304 Q338 302 340 300 Q342 302 344 304 Z" fill="#2a2518" opacity="0.3" />
      {/* Bread — small round loaf near cards */}
      <ellipse cx="412" cy="300" rx="2.5" ry="2" fill="#2a2218" opacity="0.3" />
      <path d="M410 299 Q412 298 414 299" fill="none" stroke="#1e1a10" strokeWidth="0.3" opacity="0.15" />
      {/* Wine bottle on its side */}
      <path d="M360 298 Q366 296 372 298" fill="none" stroke="#1a1510" strokeWidth="1.2" opacity="0.3" />
      <circle cx="360" cy="298" r="1.2" fill="#1a1510" opacity="0.25" />

      {/* === ADDITIONAL SOLDIERS VIGNETTES — various activities on near bank === */}
      {/* Soldier bandaging comrade's arm — seated pair near fire 2 */}
      <path d="M100 306 Q98 298 100 292 Q102 288 104 292 L106 306 Z" fill="#12100c" opacity="0.55" />
      <circle cx="102" cy="288" r="3" fill="#12100c" opacity="0.55" />
      <path d="M106 294 Q110 296 114 294" fill="none" stroke="#12100c" strokeWidth="1.2" opacity="0.35" />
      {/* Comrade — sitting, arm extended for bandaging */}
      <path d="M116 304 Q114 296 116 290 Q118 286 120 290 L122 304 Z" fill="#12100c" opacity="0.5" />
      <circle cx="118" cy="286" r="3" fill="#12100c" opacity="0.5" />
      <path d="M114 290 Q110 292 108 296" fill="none" stroke="#12100c" strokeWidth="1.2" opacity="0.3" />
      {/* Bandage strip visible — lighter line */}
      <path d="M109 294 Q111 293 112 295" fill="none" stroke="#5a5548" strokeWidth="0.5" opacity="0.15" />

      {/* Soldier standing at river's edge — looking out over water, contemplative === */}
      <path d="M430 268 Q428 258 430 250 Q432 244 434 250 L436 268 Z" fill="#12100c" opacity="0.65" />
      <circle cx="432" cy="244" r="4" fill="#12100c" opacity="0.65" />
      {/* Shako hat */}
      <path d="M430 244 Q431 240 432 238 Q433 240 434 244" fill="#12100c" opacity="0.55" />
      {/* Arms folded across chest */}
      <path d="M428 252 Q432 254 436 252" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.4" />
      {/* Long shadow cast toward river */}
      <path d="M432 268 Q440 264 454 260 Q462 258 470 258" fill="url(#ch4_figureShadow)" opacity="0.12" />

      {/* Soldier kneeling by water — washing face or filling canteen === */}
      <path d="M550 270 Q548 264 550 258 Q552 254 554 258 L556 266 Q555 268 554 270" fill="#12100c" opacity="0.55" />
      <circle cx="552" cy="254" r="3.2" fill="#12100c" opacity="0.55" />
      {/* Arm reaching down toward water */}
      <path d="M548 260 Q544 266 540 272" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.35" />
      {/* Water splash at hand — tiny ripple */}
      <ellipse cx="540" cy="273" rx="2" ry="0.6" fill="none" stroke="#5a5450" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="rx" values="1;3;1" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* === DOG — regimental mascot, sitting near campfire === */}
      {/* Body — small dark silhouette */}
      <path d="M350 300 Q356 296 362 298 Q365 300 364 304 Q358 306 352 304 Q349 302 350 300 Z" fill="#1a1510" opacity="0.5" />
      {/* Head — small, alert, looking toward celebration */}
      <path d="M350 300 Q348 296 346 294 Q345 292 348 291 Q350 290 352 292 Q354 294 352 298" fill="#1a1510" opacity="0.5" />
      {/* Ear — one erect */}
      <path d="M349 292 Q348 288 350 290" fill="#1a1510" opacity="0.4" />
      {/* Tail — wagging */}
      <path d="M364 302 Q368 300 370 298" fill="none" stroke="#1a1510" strokeWidth="0.8" opacity="0.35">
        <animate attributeName="d" values="M364 302 Q368 300 370 298;M364 302 Q368 298 372 296;M364 302 Q368 300 370 298" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Legs — short */}
      <line x1="354" y1="304" x2="352" y2="310" stroke="#1a1510" strokeWidth="0.8" opacity="0.35" />
      <line x1="360" y1="304" x2="362" y2="310" stroke="#1a1510" strokeWidth="0.8" opacity="0.35" />

      {/* Foreground rocks */}
      <path d="M0 368 Q20 358 45 362 Q65 356 90 362 L90 400 L0 400 Z" fill="#1a1510" />
      <path d="M720 365 Q740 355 770 360 Q790 355 800 362 L800 400 L720 400 Z" fill="#181510" />

      {/* === FOREGROUND ROCK DETAIL — cracks, moss, texture === */}
      {/* Left rock - crack lines */}
      <path d="M20 365 Q30 360 40 364" fill="none" stroke="#12100a" strokeWidth="0.5" opacity="0.25" />
      <path d="M35 358 Q38 364 42 370" fill="none" stroke="#12100a" strokeWidth="0.4" opacity="0.2" />
      <path d="M55 360 Q60 365 58 372" fill="none" stroke="#12100a" strokeWidth="0.4" opacity="0.18" />
      {/* Left rock - lighter surface highlights */}
      <path d="M10 370 Q20 362 35 365" fill="none" stroke="#2a2518" strokeWidth="0.8" opacity="0.15" />
      <path d="M50 358 Q60 355 75 360" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.12" />
      {/* Left rock - moss patches */}
      <ellipse cx="25" cy="370" rx="5" ry="3" fill="url(#ch4_moss)" opacity="0.8" />
      <ellipse cx="65" cy="362" rx="4" ry="2" fill="url(#ch4_moss)" opacity="0.6" />
      {/* Right rock - crack lines */}
      <path d="M740 362 Q750 358 760 362" fill="none" stroke="#12100a" strokeWidth="0.5" opacity="0.25" />
      <path d="M755 356 Q758 362 762 370" fill="none" stroke="#12100a" strokeWidth="0.4" opacity="0.2" />
      <path d="M775 358 Q778 364 776 372" fill="none" stroke="#12100a" strokeWidth="0.4" opacity="0.18" />
      {/* Right rock - lighter surface */}
      <path d="M730 368 Q745 360 760 363" fill="none" stroke="#2a2518" strokeWidth="0.7" opacity="0.15" />
      {/* Right rock - moss */}
      <ellipse cx="748" cy="365" rx="4" ry="2.5" fill="url(#ch4_moss)" opacity="0.7" />

      {/* === ADDITIONAL FOREGROUND ROCKS — smaller scattered stones === */}
      {/* Medium rock — center-left foreground */}
      <path d="M140 370 Q148 364 158 366 Q164 370 160 375 Q150 378 142 374 Z" fill="#1e1a12" opacity="0.5" />
      <path d="M145 367 Q150 365 155 367" fill="none" stroke="#141008" strokeWidth="0.4" opacity="0.2" />
      {/* Small rock near center */}
      <path d="M350 372 Q356 368 362 370 Q365 374 360 376 Q354 377 350 372 Z" fill="#1e1a12" opacity="0.4" />
      {/* Rock cluster — right center */}
      <path d="M560 368 Q566 362 574 364 Q578 368 575 372 Q568 374 562 370 Z" fill="#1c1810" opacity="0.45" />
      <path d="M572 370 Q576 366 580 368 Q582 372 578 374 Z" fill="#1e1a12" opacity="0.35" />

      {/* === FOREGROUND GRASS CLUMPS — closer, more detailed === */}
      {/* Thick grass tuft — left foreground rock edge */}
      <path d="M85 362 Q87 350 89 342" fill="none" stroke="#2a3520" strokeWidth="0.9" opacity="0.3" />
      <path d="M88 363 Q86 352 84 344" fill="none" stroke="#283018" strokeWidth="0.8" opacity="0.25" />
      <path d="M91 362 Q93 352 95 346" fill="none" stroke="#2a3520" strokeWidth="0.7" opacity="0.22" />
      {/* Grass between foreground rocks */}
      <path d="M100 370 Q102 362 104 356" fill="none" stroke="#2a3520" strokeWidth="0.6" opacity="0.2" />
      <path d="M104 372 Q103 364 101 358" fill="none" stroke="#283018" strokeWidth="0.6" opacity="0.18" />
      {/* Right foreground grass */}
      <path d="M718 366 Q716 356 714 348" fill="none" stroke="#2a3520" strokeWidth="0.9" opacity="0.3" />
      <path d="M714 368 Q716 358 718 350" fill="none" stroke="#283018" strokeWidth="0.8" opacity="0.25" />
      <path d="M710 370 Q708 360 706 352" fill="none" stroke="#2a3520" strokeWidth="0.7" opacity="0.2" />

      {/* === FOREGROUND CART TRACK RUTS — deeply scored in soft ground === */}
      {/* Left rut — deep groove from heavy traffic */}
      <path d="M0 380 Q50 374 120 378 Q180 372 240 376 Q280 372 320 374"
        fill="none" stroke="#15120c" strokeWidth="1.2" opacity="0.1" />
      <path d="M0 384 Q50 378 120 382 Q180 376 240 380 Q280 376 320 378"
        fill="none" stroke="#15120c" strokeWidth="1" opacity="0.08" />
      {/* Right rut — parallel track */}
      <path d="M0 388 Q50 382 120 386 Q180 380 240 384 Q280 380 320 382"
        fill="none" stroke="#15120c" strokeWidth="1" opacity="0.08" />

      {/* === SCATTERED EQUIPMENT — detritus of a victorious army === */}
      {/* Discarded crossbelt — white strap on ground */}
      <path d="M180 310 Q188 308 196 310 Q200 312 196 314" fill="none" stroke="#4a4840" strokeWidth="0.6" opacity="0.12" />
      {/* Torn uniform scrap — blue cloth caught on a stick */}
      <path d="M460 290 Q464 286 466 290 Q464 294 460 290" fill="#1a1830" opacity="0.1" />
      {/* Bent bayonet — iron glint in firelight */}
      <path d="M380 296 Q383 292 386 290 Q384 288 382 290" fill="none" stroke="#4a4540" strokeWidth="0.5" opacity="0.18" />
      {/* Shako on ground — fallen off a tired soldier */}
      <ellipse cx="248" cy="282" rx="3" ry="1.8" fill="#1a1510" opacity="0.35" />
      <rect x="246" y="280" width="4" height="3" rx="0.5" fill="#1e1812" opacity="0.3" />
      {/* Cockade on shako */}
      <circle cx="248" cy="280" r="0.8" fill="#2a2040" opacity="0.15" />
      {/* Spilled powder from broken cartridge */}
      <ellipse cx="500" cy="290" rx="3" ry="1.5" fill="#0e0c08" opacity="0.08" />
      {/* Loose ball from cartridge */}
      <circle cx="504" cy="292" r="0.5" fill="#2a2520" opacity="0.15" />

      {/* === GROUND TEXTURE ENRICHMENT — varied soil and terrain across near bank === */}
      {/* Sandy patch — lighter colored area near water */}
      <ellipse cx="300" cy="286" rx="20" ry="6" fill="#2a2518" opacity="0.06" />
      {/* Gravel strip — denser small stones near bridge approach */}
      {[540, 546, 552, 558, 564, 570, 576, 582, 588, 594, 600, 606, 612, 618].map((x, i) => (
        <circle key={`grav${i}`} cx={x + (i % 3)} cy={280 - Math.abs(x - 574) / 12}
          r={0.4 + (i % 3) * 0.15} fill="#282218" opacity={0.08 + (i % 2) * 0.03} />
      ))}
      {/* Trampled grass — flattened area where soldiers gathered */}
      <path d="M260 290 Q280 286 310 288 Q340 286 360 290"
        fill="#201c10" opacity="0.06" />
      {/* Exposed tree roots — gnarled, near riverbank */}
      <path d="M140 280 Q145 278 150 282 Q155 280 158 284" fill="none" stroke="#221e12" strokeWidth="0.8" opacity="0.15" />
      <path d="M142 282 Q148 284 152 280" fill="none" stroke="#221e12" strokeWidth="0.6" opacity="0.12" />

      {/* === ADDITIONAL PERIOD DETAILS === */}
      {/* Spent cannonball — half-buried in the mud near bank */}
      <circle cx="520" cy="278" r="2.5" fill="#1a1510" opacity="0.3" />
      <path d="M518 279 Q520 277 522 279" fill="none" stroke="#282218" strokeWidth="0.4" opacity="0.2" />

      {/* Torn fabric scrap — uniform remnant caught on a rock */}
      <path d="M325 283 Q328 280 332 282 Q330 286 326 285 Z" fill="#1a1830" opacity="0.12" />

      {/* Small campfire ring stones — around fire 2 */}
      <circle cx="108" cy="312" r="1.5" fill="#2a2418" opacity="0.25" />
      <circle cx="112" cy="314" r="1.2" fill="#282218" opacity="0.22" />
      <circle cx="128" cy="314" r="1.3" fill="#2a2418" opacity="0.25" />
      <circle cx="132" cy="312" r="1.5" fill="#282218" opacity="0.22" />

      {/* Wheel tracks — from cannon being repositioned on the bank */}
      <path d="M490 290 Q520 285 560 282 Q600 278 640 276" fill="none" stroke="#15120c" strokeWidth="1.2" opacity="0.1" />
      <path d="M492 294 Q522 289 562 286 Q602 282 642 280" fill="none" stroke="#15120c" strokeWidth="1" opacity="0.08" />

      {/* === ADDITIONAL BATTLE SMOKE LAYERS — heavy residual haze from the fighting === */}
      {/* High drifting smoke — large translucent cloud over the whole river scene */}
      <ellipse cx="350" cy="130" rx="220" ry="35" fill="#605850" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;30,0;0,0" dur="25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="15s" repeatCount="indefinite" />
      </ellipse>
      {/* Low rolling smoke bank — thick, hugging the water near the bridge */}
      <ellipse cx="420" cy="172" rx="120" ry="10" fill="#706860" opacity="0.08">
        <animateTransform attributeName="transform" type="translate" values="0,0;20,-1;40,0;20,1;0,0" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Wispy smoke tendril — curling upward from bridge */}
      <path d="M380 162 Q375 150 380 140 Q385 130 378 120" fill="none" stroke="#706860" strokeWidth="2.5" opacity="0.08">
        <animateTransform attributeName="transform" type="translate" values="0,0;5,-3;0,0" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M450 162 Q448 148 452 138 Q456 128 450 118" fill="none" stroke="#706860" strokeWidth="2" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;4,-2;0,0" dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="9s" repeatCount="indefinite" />
      </path>
      {/* Smoke from artillery on near bank — rising column */}
      <path d="M540 260 Q535 240 540 220 Q548 200 535 180" fill="none" stroke="#807068" strokeWidth="4" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,-4;0,0" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="7s" repeatCount="indefinite" />
      </path>
      {/* Distant smoke pall — very wide, across far horizon */}
      <ellipse cx="400" cy="100" rx="300" ry="25" fill="#504840" opacity="0.04">
        <animateTransform attributeName="transform" type="translate" values="0,0;15,0;0,0" dur="30s" repeatCount="indefinite" />
      </ellipse>

      {/* === FIREFLY SPARKLES — bioluminescent dots appearing at dusk === */}
      <circle cx="100" cy="295" r="0.6" fill="#a0c050" opacity="0">
        <animate attributeName="opacity" values="0;0.15;0;0;0.12;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="285" r="0.5" fill="#a0c050" opacity="0">
        <animate attributeName="opacity" values="0;0;0.12;0;0;0.1" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="660" cy="276" r="0.5" fill="#a0c050" opacity="0">
        <animate attributeName="opacity" values="0;0.1;0;0.12;0;0" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="300" r="0.6" fill="#a0c050" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0.14;0;0" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="282" r="0.5" fill="#a0c050" opacity="0">
        <animate attributeName="opacity" values="0.1;0;0;0;0.12;0" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="750" cy="290" r="0.5" fill="#a0c050" opacity="0">
        <animate attributeName="opacity" values="0;0.08;0;0;0;0.1" dur="5.5s" repeatCount="indefinite" />
      </circle>

      {/* === CANNON SMOKE PERSISTENCE — thicker clouds that linger over the battery === */}
      {/* Dense residual cloud near cannon 1 */}
      <ellipse cx="530" cy="260" rx="35" ry="12" fill="#706860" opacity="0.05">
        <animateTransform attributeName="transform" type="translate" values="0,0;12,-3;24,0;12,3;0,0" dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.05;0.02;0.05" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke wisps curling from cannon barrels — lingering after shot */}
      <path d="M544 268 Q548 262 546 256 Q544 250 548 244" fill="none" stroke="#706860" strokeWidth="1.5" opacity="0.04">
        <animateTransform attributeName="transform" type="translate" values="0,0;4,-2;0,0" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M612 266 Q616 260 614 254 Q612 248 616 242" fill="none" stroke="#706860" strokeWidth="1.2" opacity="0.03">
        <animateTransform attributeName="transform" type="translate" values="0,0;3,-2;0,0" dur="7s" repeatCount="indefinite" />
      </path>

      {/* === GUNPOWDER HAZE OVER BRIDGE — dense sulphurous cloud from musket volleys === */}
      {/* Rolling musket smoke along bridge length — denser than cannon smoke */}
      <ellipse cx="380" cy="155" rx="100" ry="12" fill="#706860" opacity="0.07">
        <animateTransform attributeName="transform" type="translate" values="0,0;25,-2;50,0;25,2;0,0" dur="16s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.03;0.07" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Thick smoke bank at far end of bridge — where Austrian defense collapsed */}
      <ellipse cx="540" cy="158" rx="50" ry="10" fill="#807068" opacity="0.06">
        <animateTransform attributeName="transform" type="translate" values="0,0;12,-1;24,0;12,1;0,0" dur="13s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="8s" repeatCount="indefinite" />
      </ellipse>

      {/* === DISTANT CAMPFIRES ON FAR BANK — French forces bivouacking after victory === */}
      {/* Campfire glow — left of town, larger encampment */}
      <ellipse cx="170" cy="156" rx="5" ry="2" fill="#c08040" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M169 155 Q170 152 171 155" fill="#d09050" opacity="0.1">
        <animate attributeName="d" values="M169 155 Q170 152 171 155;M169 155 Q170 150 171 155;M169 155 Q170 152 171 155" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Another distant fire — right side */}
      <ellipse cx="540" cy="156" rx="4" ry="1.5" fill="#c08040" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      <path d="M539 155 Q540 153 541 155" fill="#d09050" opacity="0.08">
        <animate attributeName="d" values="M539 155 Q540 153 541 155;M539 155 Q540 151 541 155;M539 155 Q540 153 541 155" dur="0.55s" repeatCount="indefinite" />
      </path>
      {/* Firelight reflecting on nearby building wall */}
      <rect x="250" y="146" width="2" height="3" fill="#a08050" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="1.8s" repeatCount="indefinite" />
      </rect>

      {/* === AUSTRIAN RETREAT PATH — trampled field leading away from bridge === */}
      {/* Disturbed earth — where Austrian troops fled */}
      <path d="M560 158 Q580 155 610 156 Q640 154 670 156 Q700 154 740 156"
        fill="none" stroke="#2a2518" strokeWidth="1.5" opacity="0.06" />
      {/* Scattered equipment along retreat path */}
      <ellipse cx="600" cy="156" rx="1.5" ry="0.8" fill="#2a2218" opacity="0.12" />
      <ellipse cx="630" cy="155" rx="1" ry="0.6" fill="#2a2218" opacity="0.1" />
      <rect x="660" y="155" width="2" height="1.2" fill="#4a4840" opacity="0.06" transform="rotate(20 661 156)" />
      {/* Dropped Austrian musket — small stick on ground */}
      <line x1="580" y1="157" x2="590" y2="156" stroke="#2a2518" strokeWidth="0.5" opacity="0.1" />

      {/* === DISTANT BURNING BUILDINGS — more fires on the far bank outskirts === */}
      {/* Burning farmstead — further right, beyond the town */}
      <ellipse cx="450" cy="152" rx="6" ry="3" fill="url(#ch4_distantBurn)">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      <path d="M449 152 Q450 147 451 152" fill="#d07030" opacity="0.15">
        <animate attributeName="d" values="M449 152 Q450 147 451 152;M449 152 Q450 145 451 152;M449 152 Q450 147 451 152" dur="0.65s" repeatCount="indefinite" />
      </path>
      {/* Smoke from burning farmstead — thin grey wisp rising */}
      <path d="M450 149 Q449 142 451 135 Q453 128 450 122" fill="none" stroke="#5a4a40" strokeWidth="1" opacity="0.05">
        <animateTransform attributeName="transform" type="translate" values="0,0;3,-2;0,0" dur="10s" repeatCount="indefinite" />
      </path>
      {/* Burning hay rick — small intense glow right of town */}
      <ellipse cx="345" cy="154" rx="3" ry="2" fill="#c06030" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="1.8s" repeatCount="indefinite" />
      </ellipse>

      {/* === AMMUNITION CAISSON — near the battery, reinforcing artillery presence === */}
      {/* Caisson body — heavier than supply wagon */}
      <path d="M495 296 Q500 292 520 292 Q528 292 532 296 Q525 300 502 300 Z" fill="#1a1510" opacity="0.5" />
      {/* Caisson lid — hinged open showing ammunition */}
      <path d="M500 292 Q510 286 520 292" fill="#201c14" opacity="0.35" />
      {/* Visible cannonballs inside */}
      <circle cx="505" cy="294" r="1.5" fill="#12100c" opacity="0.35" />
      <circle cx="509" cy="294" r="1.5" fill="#12100c" opacity="0.35" />
      <circle cx="513" cy="294" r="1.5" fill="#12100c" opacity="0.35" />
      <circle cx="507" cy="292" r="1.5" fill="#12100c" opacity="0.35" />
      <circle cx="511" cy="292" r="1.5" fill="#12100c" opacity="0.35" />
      {/* Caisson wheels */}
      <circle cx="502" cy="302" r="4.5" fill="none" stroke="#1a1510" strokeWidth="1.2" opacity="0.45" />
      <circle cx="524" cy="302" r="4.5" fill="none" stroke="#1a1510" strokeWidth="1.2" opacity="0.45" />
      {/* Wheel spokes */}
      <line x1="502" y1="298" x2="502" y2="306" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      <line x1="498" y1="302" x2="506" y2="302" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      <line x1="524" y1="298" x2="524" y2="306" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />
      <line x1="520" y1="302" x2="528" y2="302" stroke="#1a1510" strokeWidth="0.4" opacity="0.25" />

      {/* === CAMPFIRE 3 — small cooking fire near artillery battery === */}
      <ellipse cx="490" cy="298" rx="12" ry="4" fill="url(#ch4_fire2)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Small flames */}
      <path d="M488 297 Q490 291 492 297" fill="#c07838" opacity="0.35">
        <animate attributeName="d" values="M488 297 Q490 291 492 297;M488 297 Q491 289 492 297;M488 297 Q490 291 492 297" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M490 297 Q491 293 493 297" fill="#d09050" opacity="0.25">
        <animate attributeName="d" values="M490 297 Q491 293 493 297;M490 297 Q492 291 493 297;M490 297 Q491 293 493 297" dur="0.4s" repeatCount="indefinite" />
      </path>
      {/* Sparks from cooking fire */}
      <circle cx="491" cy="292" r="0.3" fill="#e0b060" opacity="0.35">
        <animate attributeName="cy" values="292;280;270" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.1;0" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Fire reflection on nearby cannon wheel */}
      <ellipse cx="500" cy="284" rx="4" ry="2" fill="#c08040" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="1.8s" repeatCount="indefinite" />
      </ellipse>

      {/* === OVERALL WARM LIGHT EFFECTS — fire illumination on nearby surfaces === */}
      {/* Fire 1 illumination cone — warm light on ground and nearby figures */}
      <ellipse cx="300" cy="296" rx="50" ry="25" fill="#c08040" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.02;0.04" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire 2 illumination cone */}
      <ellipse cx="120" cy="305" rx="30" ry="18" fill="#c08040" opacity="0.03">
        <animate attributeName="opacity" values="0.03;0.015;0.03" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Cannon flash illumination on ground — periodic bright pulse */}
      <ellipse cx="540" cy="278" rx="30" ry="10" fill="#e0a040" opacity="0.02">
        <animate attributeName="opacity" values="0.02;0.05;0.02" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === GROUND-LEVEL FOG WISPS — evening mist creeping across the bank === */}
      <ellipse cx="200" cy="320" rx="60" ry="8" fill="#504840" opacity="0.03">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,0;0,0" dur="15s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="310" rx="80" ry="6" fill="#504840" opacity="0.025">
        <animateTransform attributeName="transform" type="translate" values="0,0;-8,0;0,0" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="700" cy="315" rx="50" ry="7" fill="#504840" opacity="0.02">
        <animateTransform attributeName="transform" type="translate" values="0,0;6,0;0,0" dur="12s" repeatCount="indefinite" />
      </ellipse>

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Warm color wash — overall sunset warmth across the scene */}
      <rect width="800" height="250" fill="#8a5538" opacity="0.04" />

      {/* Horizon glow intensifier — stronger warm band at water/sky boundary */}
      <rect x="0" y="140" width="800" height="45" fill="#c07838" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="6s" repeatCount="indefinite" />
      </rect>

      {/* Cool shadow overlay on far bank — evening shadow creeping in */}
      <rect x="0" y="158" width="800" height="20" fill="#12101a" opacity="0.08" />

      {/* === FINAL ATMOSPHERIC PARTICLES — drifting in the dusk air === */}
      {/* Firefly / ember drifting high — very faint */}
      <circle cx="250" cy="260" r="0.5" fill="#d0a050" opacity="0.2">
        <animate attributeName="cy" values="260;254;260" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="270" r="0.4" fill="#d0a050" opacity="0.15">
        <animate attributeName="cy" values="270;264;270" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.04;0.15" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="265" r="0.45" fill="#d0a050" opacity="0.18">
        <animate attributeName="cy" values="265;258;265" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0.05;0.18" dur="3.5s" repeatCount="indefinite" />
      </circle>

      <rect width="800" height="400" fill="url(#ch4_vignette)" />
      <rect x="0" y="375" width="800" height="25" fill="#0a0808" opacity="0.4" />

      {/* === FINAL GRAIN TEXTURE — subtle noise to unify the scene === */}
      {/* Fine grain dots scattered across the image — simulated film grain */}
      <g opacity="0.04">
        {[...Array(40)].map((_, i) => {
          const gx = (i * 197 + 31) % 800;
          const gy = (i * 131 + 47) % 400;
          const gr = 0.3 + ((i * 73) % 10) / 20;
          return <circle key={`grain${i}`} cx={gx} cy={gy} r={gr} fill="#8a7a70" />;
        })}
      </g>
    </svg>
  );
}
