import React from 'react';

/**
 * Ch.8 — Bassano, Brenta valley (September 1796)
 * Autumn dusk in a narrow Alpine valley. The army has just chased Wurmser
 * down through the mountain passes — an exhilarating pursuit. Steep peaks
 * on both sides, the Brenta river rushing through with white rapids.
 * Brilliant autumn foliage — oranges, reds, golds against dark stone.
 * A stone bridge crosses the river near a small Alpine village.
 * Soldiers rest along a roadside fire. Mood: Energized but weary.
 *
 * Enhanced: overturned Austrian wagon, mule train, stretcher-bearers,
 * flag bearer, extra leaves, mountain waterfall, circling raptor,
 * stacked muskets, chimney smoke, twilight star, river spray.
 *
 * Enhanced v2: Austrian prisoners, captured supply wagon (detailed),
 * mountain chapel, deer/chamois, more river detail, woodcutter's cabin,
 * stone wall, pine branch framing, firelight on faces, owl silhouette.
 *
 * Enhanced v3: Grape vines (Veneto wine country), second cooking fire with
 * camp pot, horses tethered, captured Austrian cannon, river reflections,
 * surgeon tending wounded, sleeping soldiers, soldier smoking pipe,
 * valley mist, additional stars, terrain rocks, bridge keystone detail,
 * laundry drying, sentry on bridge, dog near fire, more ground texture.
 *
 * Enhanced v4 (detail pass 15): Alpine vegetation (edelweiss, juniper, lichen),
 * granite rock formations with strata lines, whitewater rapids cascade,
 * dusk light shafts through mountain gap, layered mountain haze bands,
 * pontoon footbridge downstream, riverside mill with waterwheel,
 * ammunition caisson with limber, second supply train on road,
 * horse picket line with farrier, Austrian retreat debris field (broken
 * equipment, discarded shakos, torn regimental colours on ground),
 * captured Habsburg eagle standard, river eddy pools, animated mist
 * ribbons drifting through valley, flag ripple on captured colours.
 *
 * Enhanced v5 (atmospheric depth pass): Snow-dusted distant peaks with
 * animated shimmer, mountain crevice shadows and ridgeline detail,
 * multi-layer parallax fog ribbons, animated river current with
 * floating debris (leaves on water), reflected autumn colour on river
 * surface, evening fireflies near riverbank, wind-animated tree crowns
 * and grass, deeper foreground wildflower/mushroom detail, additional
 * falling leaves with tumble rotation, distant thunder-cloud suggestion,
 * warm/cool colour contrast enhancement, ground shadow pools beneath
 * trees, subtle bark texture on trunks, bridge lantern glow.
 */
export function Ch8BassanoScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Autumn dusk sky — rich amber-crimson fading to deep indigo */}
        <linearGradient id="ch8_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141a30" />
          <stop offset="14%" stopColor="#1e2540" />
          <stop offset="28%" stopColor="#2a2838" />
          <stop offset="40%" stopColor="#4a2a35" />
          <stop offset="52%" stopColor="#6a3530" />
          <stop offset="64%" stopColor="#8a4528" />
          <stop offset="76%" stopColor="#a86030" />
          <stop offset="86%" stopColor="#c07838" />
          <stop offset="93%" stopColor="#d08840" />
          <stop offset="100%" stopColor="#d89548" />
        </linearGradient>
        {/* Far mountains — purple-blue with warm reflected light */}
        <linearGradient id="ch8_mtnFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2840" />
          <stop offset="60%" stopColor="#282640" />
          <stop offset="100%" stopColor="#302a3a" />
        </linearGradient>
        {/* Mid mountains — darker with warm top edge */}
        <linearGradient id="ch8_mtnMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#221e30" />
          <stop offset="15%" stopColor="#1a1828" />
          <stop offset="100%" stopColor="#141420" />
        </linearGradient>
        {/* Near mountain walls — darkest, strong silhouette */}
        <linearGradient id="ch8_mtnNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12121c" />
          <stop offset="100%" stopColor="#0e0e14" />
        </linearGradient>
        {/* River water — deeper, with warm dusk reflection */}
        <linearGradient id="ch8_river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2838" />
          <stop offset="20%" stopColor="#223040" />
          <stop offset="40%" stopColor="#2a384a" />
          <stop offset="50%" stopColor="#304555" />
          <stop offset="60%" stopColor="#2a384a" />
          <stop offset="80%" stopColor="#223040" />
          <stop offset="100%" stopColor="#1e2838" />
        </linearGradient>
        {/* River rapids highlight */}
        <linearGradient id="ch8_rapids" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a7a8a" stopOpacity="0" />
          <stop offset="50%" stopColor="#8a9aaa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6a7a8a" stopOpacity="0" />
        </linearGradient>
        {/* Valley floor — autumn ground */}
        <linearGradient id="ch8_valley" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2818" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Road surface */}
        <linearGradient id="ch8_road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#35301e" />
          <stop offset="100%" stopColor="#2a2518" />
        </linearGradient>
        {/* Fire glow — warm, bright campfire */}
        <radialGradient id="ch8_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d89050" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#c08040" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#c08040" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Dusk glow on horizon — intense warm sunset */}
        <radialGradient id="ch8_duskGlow" cx="0.5" cy="0.75" r="0.55">
          <stop offset="0%" stopColor="#c07838" stopOpacity="0.22" />
          <stop offset="35%" stopColor="#a06030" stopOpacity="0.12" />
          <stop offset="70%" stopColor="#8a5028" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#7a4520" stopOpacity="0" />
        </radialGradient>
        {/* Bridge stone */}
        <linearGradient id="ch8_bridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3828" />
          <stop offset="50%" stopColor="#353322" />
          <stop offset="100%" stopColor="#2a2818" />
        </linearGradient>
        {/* Village roof warm */}
        <linearGradient id="ch8_roofWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3020" />
          <stop offset="100%" stopColor="#3a2518" />
        </linearGradient>
        {/* Warm vignette — stronger framing */}
        <radialGradient id="ch8_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="40%" stopColor="#000000" stopOpacity="0" />
          <stop offset="75%" stopColor="#0a0504" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1a0e06" stopOpacity="0.45" />
        </radialGradient>

        {/* === NEW GRADIENTS === */}
        {/* Waterfall shimmer */}
        <linearGradient id="ch8_waterfall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a9aaa" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#9aaabb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8a9aaa" stopOpacity="0.1" />
        </linearGradient>
        {/* Star glow */}
        <radialGradient id="ch8_starGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#ffe8c0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffe8c0" stopOpacity="0" />
        </radialGradient>
        {/* Tricolor flag stripes */}
        <linearGradient id="ch8_tricolor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2a6a" />
          <stop offset="33%" stopColor="#1a2a6a" />
          <stop offset="33%" stopColor="#e8e0d0" />
          <stop offset="66%" stopColor="#e8e0d0" />
          <stop offset="66%" stopColor="#8a2020" />
          <stop offset="100%" stopColor="#8a2020" />
        </linearGradient>

        {/* === ENHANCEMENT v2 GRADIENTS === */}
        {/* Firelight warm highlight for soldier faces — brighter */}
        <radialGradient id="ch8_facelight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a060" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#d09050" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#c08040" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Chapel stone */}
        <linearGradient id="ch8_chapelStone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        {/* Cabin wood */}
        <linearGradient id="ch8_cabinWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2018" />
          <stop offset="100%" stopColor="#1e1810" />
        </linearGradient>
        {/* Pine branch dark green */}
        <linearGradient id="ch8_pineNeedle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e1a0a" />
          <stop offset="100%" stopColor="#1a2a12" />
        </linearGradient>
        {/* Austrian white uniform tint for prisoners */}
        <linearGradient id="ch8_austrianWhite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3835" />
          <stop offset="100%" stopColor="#2a2825" />
        </linearGradient>

        {/* === ENHANCEMENT v3 GRADIENTS === */}
        {/* Second fire glow — smaller cooking fire */}
        <radialGradient id="ch8_fireGlow2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b87030" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#b87030" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#b87030" stopOpacity="0" />
        </radialGradient>
        {/* Grape vine green — Veneto autumn */}
        <linearGradient id="ch8_vineGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4a20" />
          <stop offset="100%" stopColor="#2a3a15" />
        </linearGradient>
        {/* Grape cluster — dark purple */}
        <radialGradient id="ch8_grape" cx="0.4" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#3a2040" />
          <stop offset="100%" stopColor="#2a1530" />
        </radialGradient>
        {/* Horse body — warm brown */}
        <linearGradient id="ch8_horseBrown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2018" />
          <stop offset="100%" stopColor="#1e1812" />
        </linearGradient>
        {/* Cannon bronze */}
        <linearGradient id="ch8_cannonBronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3525" />
          <stop offset="100%" stopColor="#2a2518" />
        </linearGradient>
        {/* River reflection shimmer — brighter for visibility */}
        <linearGradient id="ch8_riverReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a6a80" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#6a7a90" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#5a6a80" stopOpacity="0" />
        </linearGradient>
        {/* Valley mist — more visible, atmospheric */}
        <linearGradient id="ch8_valleyMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a7080" stopOpacity="0" />
          <stop offset="40%" stopColor="#6a7080" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#6a7080" stopOpacity="0" />
        </linearGradient>
        {/* Surgeon bandage white */}
        <linearGradient id="ch8_bandage" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4840" />
          <stop offset="100%" stopColor="#3a3830" />
        </linearGradient>

        {/* === ENHANCEMENT v4 GRADIENTS (detail pass 15) === */}
        {/* Light shaft — vivid golden dusk beam through mountain gap */}
        <linearGradient id="ch8_lightShaft" x1="0.4" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#d0a060" stopOpacity="0.2" />
          <stop offset="35%" stopColor="#c09050" stopOpacity="0.1" />
          <stop offset="70%" stopColor="#b08040" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#a07030" stopOpacity="0" />
        </linearGradient>
        {/* Mountain haze band — blue-grey atmospheric layer */}
        <linearGradient id="ch8_hazeband" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4050" stopOpacity="0" />
          <stop offset="30%" stopColor="#3a4050" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#3a4050" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#3a4050" stopOpacity="0" />
        </linearGradient>
        {/* Pontoon timber — wet dark wood */}
        <linearGradient id="ch8_pontoon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2518" />
          <stop offset="100%" stopColor="#1e1a12" />
        </linearGradient>
        {/* Waterwheel — dark grey iron/wood */}
        <linearGradient id="ch8_waterwheel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#252228" />
          <stop offset="100%" stopColor="#1a1820" />
        </linearGradient>
        {/* Caisson body — military olive-grey */}
        <linearGradient id="ch8_caisson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a20" />
          <stop offset="100%" stopColor="#1e1e18" />
        </linearGradient>
        {/* Austrian colours — white and yellow (tattered) */}
        <linearGradient id="ch8_austrianFlag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4840" />
          <stop offset="50%" stopColor="#4a4535" />
          <stop offset="100%" stopColor="#3a3525" />
        </linearGradient>
        {/* Habsburg eagle gold — tarnished */}
        <radialGradient id="ch8_eagleGold" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#6a5a30" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4a3a20" stopOpacity="0.3" />
        </radialGradient>
        {/* Granite strata — layered rock face */}
        <linearGradient id="ch8_granite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1e28" />
          <stop offset="25%" stopColor="#222232" />
          <stop offset="50%" stopColor="#1a1a25" />
          <stop offset="75%" stopColor="#202030" />
          <stop offset="100%" stopColor="#181820" />
        </linearGradient>
        {/* Lichen yellow-green */}
        <radialGradient id="ch8_lichen" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#4a5a28" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3a4a20" stopOpacity="0.1" />
        </radialGradient>
        {/* Eddy pool — darker water pocket */}
        <radialGradient id="ch8_eddy" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#1a2530" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#253540" stopOpacity="0.1" />
        </radialGradient>
        {/* Mist ribbon — visible valley fog wisps */}
        <linearGradient id="ch8_mistRibbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a8595" stopOpacity="0" />
          <stop offset="25%" stopColor="#7a8595" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#7a8595" stopOpacity="0.12" />
          <stop offset="75%" stopColor="#7a8595" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#7a8595" stopOpacity="0" />
        </linearGradient>

        {/* === ENHANCEMENT v5 GRADIENTS (atmospheric depth pass) === */}
        {/* Snow shimmer on distant peaks — bright white catching dusk */}
        <linearGradient id="ch8_snowPeak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9aa0b0" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#8090a0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#607080" stopOpacity="0.08" />
        </linearGradient>
        {/* Firefly glow — warm amber point */}
        <radialGradient id="ch8_firefly" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a050" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#c09040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#b08030" stopOpacity="0" />
        </radialGradient>
        {/* Deep fog layer — blue-grey atmospheric */}
        <linearGradient id="ch8_deepFog" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4555" stopOpacity="0" />
          <stop offset="20%" stopColor="#3a4555" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#3a4555" stopOpacity="0.06" />
          <stop offset="80%" stopColor="#3a4555" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#3a4555" stopOpacity="0" />
        </linearGradient>
        {/* River autumn reflection — vivid warm tones on water */}
        <linearGradient id="ch8_autumnReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b06030" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#9a4a22" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7a3518" stopOpacity="0" />
        </linearGradient>
        {/* Bridge lantern glow — warm, prominent */}
        <radialGradient id="ch8_lantern" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0b060" stopOpacity="0.65" />
          <stop offset="25%" stopColor="#e0a050" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#d09040" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#b07020" stopOpacity="0" />
        </radialGradient>
        {/* Ground shadow under trees */}
        <radialGradient id="ch8_treeShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0a0808" stopOpacity="0.15" />
          <stop offset="70%" stopColor="#0a0808" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0a0808" stopOpacity="0" />
        </radialGradient>
        {/* Thunder cloud — distant storm suggestion */}
        <linearGradient id="ch8_stormCloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a25" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#1e1e2a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#222235" stopOpacity="0.08" />
        </linearGradient>
        {/* Wildflower warm — late-season alpine */}
        <radialGradient id="ch8_wildflower" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#6a4a50" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5a3a40" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch8_sky)" />
      <rect width="800" height="400" fill="url(#ch8_duskGlow)" />

      {/* === TWILIGHT STAR — first evening star in darkening sky === */}
      <circle cx="180" cy="22" r="6" fill="url(#ch8_starGlow)">
        <animate attributeName="r" values="6;8;6" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="22" r="1" fill="#ffffff" opacity="0.85">
        <animate attributeName="opacity" values="0.85;0.55;0.85" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Four-pointed star rays */}
      <line x1="180" y1="18" x2="180" y2="14" stroke="#ffffff" strokeWidth="0.4" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="180" y1="26" x2="180" y2="30" stroke="#ffffff" strokeWidth="0.4" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="176" y1="22" x2="172" y2="22" stroke="#ffffff" strokeWidth="0.4" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="184" y1="22" x2="188" y2="22" stroke="#ffffff" strokeWidth="0.4" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="2.5s" repeatCount="indefinite" />
      </line>

      {/* === ADDITIONAL STARS — early evening appearing === */}
      <circle cx="95" cy="35" r="0.7" fill="#ffffff" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.2;0.4" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="620" cy="18" r="0.6" fill="#ffffff" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="4.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="12" r="0.8" fill="#ffe8c0" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.15;0.35" dur="3.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="720" cy="28" r="0.5" fill="#ffffff" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="8" r="0.6" fill="#ffffff" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="4.5s" repeatCount="indefinite" />
      </circle>

      {/* Thin dusk clouds */}
      <ellipse cx="180" cy="30" rx="140" ry="7" fill="#3a3040" opacity="0.2">
        <animate attributeName="cx" values="180;200;180" dur="22s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="20" rx="170" ry="6" fill="#3a2a38" opacity="0.18">
        <animate attributeName="cx" values="420;445;420" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="40" rx="110" ry="5" fill="#3a3040" opacity="0.15">
        <animate attributeName="cx" values="650;670;650" dur="18s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="300" cy="55" rx="90" ry="4" fill="#3a2a38" opacity="0.12" />

      {/* === DUSK LIGHT SHAFTS — golden beams through mountain gap === */}
      <polygon points="360,40 420,400 340,400" fill="url(#ch8_lightShaft)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.28;0.4" dur="8s" repeatCount="indefinite" />
      </polygon>
      <polygon points="380,35 460,400 380,400" fill="url(#ch8_lightShaft)" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.18;0.25" dur="10s" repeatCount="indefinite" />
      </polygon>
      <polygon points="340,50 370,400 290,400" fill="url(#ch8_lightShaft)" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.1;0.15" dur="12s" repeatCount="indefinite" />
      </polygon>

      {/* === FAR MOUNTAIN RANGE — distant blue-grey peaks === */}
      <path d="M0 110 Q40 80 90 95 Q130 65 180 85 Q220 55 280 75 Q330 50 380 70 Q420 45 470 65 Q510 40 560 60 Q600 50 650 68 Q700 42 760 65 Q790 55 800 70 L800 150 L0 150 Z"
        fill="url(#ch8_mtnFar)" opacity="0.8" />

      {/* === SNOW-DUSTED DISTANT PEAKS — white caps catching last light === */}
      <path d="M215 58 Q220 54 228 58 Q224 55 215 58 Z" fill="url(#ch8_snowPeak)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.35;0.5" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M326 52 Q330 47 338 52 Q333 49 326 52 Z" fill="url(#ch8_snowPeak)" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.3;0.45" dur="7s" repeatCount="indefinite" />
      </path>
      <path d="M507 42 Q512 37 520 42 Q515 39 507 42 Z" fill="url(#ch8_snowPeak)" opacity="0.55">
        <animate attributeName="opacity" values="0.55;0.38;0.55" dur="5.5s" repeatCount="indefinite" />
      </path>
      <path d="M695 44 Q700 39 708 44 Q703 41 695 44 Z" fill="url(#ch8_snowPeak)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.28;0.4" dur="8s" repeatCount="indefinite" />
      </path>
      {/* Mountain ridgeline detail — crevice shadows on far peaks */}
      <path d="M270 68 Q275 72 280 68" fill="none" stroke="#1a1a28" strokeWidth="0.5" opacity="0.2" />
      <path d="M375 64 Q378 68 382 63" fill="none" stroke="#1a1a28" strokeWidth="0.5" opacity="0.18" />
      <path d="M465 60 Q468 64 472 59" fill="none" stroke="#1a1a28" strokeWidth="0.5" opacity="0.22" />
      <path d="M555 55 Q560 60 565 54" fill="none" stroke="#1a1a28" strokeWidth="0.4" opacity="0.18" />
      <path d="M650 62 Q654 67 658 61" fill="none" stroke="#1a1a28" strokeWidth="0.4" opacity="0.16" />

      {/* === DISTANT STORM CLOUD — far off, suggesting weather beyond the valley === */}
      <ellipse cx="100" cy="50" rx="60" ry="20" fill="url(#ch8_stormCloud)" opacity="0.35">
        <animate attributeName="cx" values="100;115;100" dur="35s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.25;0.35" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Distant lightning flicker — very subtle, very rare */}
      <line x1="108" y1="60" x2="112" y2="72" stroke="#8a8aaa" strokeWidth="0.3" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0.12;0;0;0;0;0;0" dur="18s" repeatCount="indefinite" />
      </line>

      {/* === MOUNTAIN HAZE BANDS — atmospheric layering === */}
      <rect x="0" y="95" width="800" height="20" fill="url(#ch8_hazeband)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.45;0.6" dur="15s" repeatCount="indefinite" />
      </rect>
      <rect x="0" y="120" width="800" height="15" fill="url(#ch8_hazeband)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.3;0.4" dur="18s" repeatCount="indefinite" />
      </rect>
      <rect x="0" y="150" width="800" height="12" fill="url(#ch8_hazeband)" opacity="0.3" />

      {/* === DEER/CHAMOIS — distant silhouette on far slope === */}
      <g opacity="0.22" transform="translate(480, 62)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="4" ry="2" fill="#1e1e2a" />
        {/* Legs */}
        <line x1="-2" y1="2" x2="-2.5" y2="5" stroke="#1e1e2a" strokeWidth="0.5" />
        <line x1="2" y1="2" x2="2.5" y2="5" stroke="#1e1e2a" strokeWidth="0.5" />
        {/* Neck + head */}
        <path d="M-3.5 -1 Q-4.5 -4 -4 -6" fill="none" stroke="#1e1e2a" strokeWidth="0.8" />
        <ellipse cx="-4" cy="-7" rx="1" ry="0.8" fill="#1e1e2a" />
        {/* Small antler prongs */}
        <line x1="-4.5" y1="-8" x2="-5.5" y2="-10" stroke="#1e1e2a" strokeWidth="0.4" />
        <line x1="-3.5" y1="-8" x2="-3" y2="-10.5" stroke="#1e1e2a" strokeWidth="0.4" />
      </g>

      {/* === MID MOUNTAIN LAYER — steeper Alpine forms === */}
      {/* Left mountain wall */}
      <path d="M0 130 Q30 95 70 110 Q100 75 150 100 Q190 65 240 95 Q260 85 270 90 L270 280 L0 280 Z"
        fill="url(#ch8_mtnMid)" opacity="0.9" />
      {/* Right mountain wall */}
      <path d="M540 95 Q580 60 620 80 Q660 50 710 75 Q750 45 800 70 L800 280 L540 280 Z"
        fill="url(#ch8_mtnMid)" opacity="0.9" />

      {/* === MOUNTAIN CHAPEL — tiny Alpine shrine on left slope === */}
      <g opacity="0.55" transform="translate(188, 92)">
        {/* Chapel body — whitewashed stone */}
        <rect x="-5" y="-8" width="10" height="10" fill="url(#ch8_chapelStone)" />
        {/* Steep roof */}
        <path d="M-6 -8 L0 -15 L6 -8 Z" fill="#3a2820" />
        {/* Small cross on top */}
        <line x1="0" y1="-15" x2="0" y2="-18" stroke="#4a4535" strokeWidth="0.6" />
        <line x1="-1.5" y1="-17" x2="1.5" y2="-17" stroke="#4a4535" strokeWidth="0.5" />
        {/* Tiny arched door */}
        <path d="M-1.5 2 L-1.5 -2 Q0 -4 1.5 -2 L1.5 2 Z" fill="#1a1510" opacity="0.6" />
        {/* Window — faint warm glow */}
        <rect x="-3.5" y="-5" width="2" height="2" fill="#8a7040" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.08;0.15" dur="5s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* === MOUNTAIN WATERFALL — thin white streak on right slope === */}
      <path d="M638 72 Q640 90 637 110 Q636 128 638 145"
        fill="none" stroke="url(#ch8_waterfall)" strokeWidth="2.2" strokeLinecap="round" opacity="0.65">
        <animate attributeName="opacity" values="0.65;0.45;0.65" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Waterfall shimmer highlights */}
      <path d="M637 85 Q639 88 638 92"
        fill="none" stroke="#aabbcc" strokeWidth="0.6" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M638 105 Q640 108 637 112"
        fill="none" stroke="#aabbcc" strokeWidth="0.5" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.1s" repeatCount="indefinite" />
      </path>
      <path d="M636 125 Q639 130 637 135"
        fill="none" stroke="#bbccdd" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.08;0.2" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Spray mist at waterfall base */}
      <ellipse cx="638" cy="148" rx="5" ry="3" fill="#8a9aaa" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === NEAR MOUNTAIN SLOPES — steep valley sides === */}
      {/* Left near slope */}
      <path d="M0 155 Q40 120 80 140 Q120 105 170 130 Q200 115 230 130 L230 310 L0 310 Z"
        fill="url(#ch8_mtnNear)" opacity="1" />
      {/* Right near slope */}
      <path d="M580 125 Q620 100 660 120 Q700 90 740 108 Q770 95 800 110 L800 310 L580 310 Z"
        fill="url(#ch8_mtnNear)" opacity="1" />

      {/* === DEEP FOG PARALLAX LAYERS — atmospheric depth between slopes === */}
      <rect x="230" y="140" width="350" height="30" fill="url(#ch8_deepFog)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="20s" repeatCount="indefinite" />
      </rect>
      <rect x="250" y="165" width="300" height="20" fill="url(#ch8_deepFog)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.35;0.5" dur="16s" repeatCount="indefinite" />
      </rect>

      {/* Mountain slope texture — additional crevice and fold detail on near slopes */}
      {/* Left near slope — vertical crevices */}
      <path d="M90 160 Q88 175 92 190" fill="none" stroke="#0e0e18" strokeWidth="0.6" opacity="0.2" />
      <path d="M140 145 Q138 160 142 180" fill="none" stroke="#0e0e18" strokeWidth="0.5" opacity="0.18" />
      <path d="M180 138 Q177 150 180 165" fill="none" stroke="#0e0e18" strokeWidth="0.5" opacity="0.15" />
      {/* Left slope — horizontal ledge shadows */}
      <path d="M20 180 Q60 177 110 182" fill="none" stroke="#0a0a15" strokeWidth="0.8" opacity="0.12" />
      <path d="M60 200 Q100 196 160 202" fill="none" stroke="#0a0a15" strokeWidth="0.7" opacity="0.1" />
      {/* Right near slope — vertical crevices */}
      <path d="M630 140 Q628 155 632 170" fill="none" stroke="#0e0e18" strokeWidth="0.6" opacity="0.18" />
      <path d="M680 128 Q678 142 682 158" fill="none" stroke="#0e0e18" strokeWidth="0.5" opacity="0.16" />
      <path d="M740 118 Q738 130 741 145" fill="none" stroke="#0e0e18" strokeWidth="0.5" opacity="0.14" />
      {/* Right slope — horizontal ledge shadows */}
      <path d="M610 165 Q660 160 720 168" fill="none" stroke="#0a0a15" strokeWidth="0.8" opacity="0.12" />
      <path d="M640 185 Q700 180 770 188" fill="none" stroke="#0a0a15" strokeWidth="0.7" opacity="0.1" />

      {/* === VALLEY MIST — low-hanging wisps in the gorge === */}
      <ellipse cx="400" cy="180" rx="120" ry="12" fill="#7a8595" opacity="0.08">
        <animate attributeName="cx" values="400;420;400" dur="25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.05;0.08" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="320" cy="200" rx="80" ry="8" fill="#7a8595" opacity="0.07">
        <animate attributeName="cx" values="320;340;320" dur="20s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.04;0.07" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="190" rx="60" ry="6" fill="#7a8595" opacity="0.06">
        <animate attributeName="cx" values="500;515;500" dur="18s" repeatCount="indefinite" />
      </ellipse>

      {/* Rock texture lines on left slope */}
      <path d="M50 170 Q70 165 90 172" fill="none" stroke="#222230" strokeWidth="0.6" opacity="0.2" />
      <path d="M30 190 Q60 185 100 192" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.18" />
      <path d="M80 155 Q110 148 140 155" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.15" />

      {/* Rock texture lines on right slope */}
      <path d="M620 145 Q660 138 700 145" fill="none" stroke="#222230" strokeWidth="0.6" opacity="0.2" />
      <path d="M650 165 Q690 158 730 165" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.18" />
      <path d="M600 180 Q630 175 670 182" fill="none" stroke="#222230" strokeWidth="0.5" opacity="0.15" />

      {/* === GRANITE ROCK FORMATIONS — exposed cliff faces === */}
      {/* Left cliff face — layered strata */}
      <g opacity="0.5">
        <path d="M160 145 L175 130 L195 138 L200 155 L165 160 Z" fill="url(#ch8_granite)" />
        {/* Strata lines */}
        <path d="M163 148 Q175 143 192 148" fill="none" stroke="#2a2a35" strokeWidth="0.5" opacity="0.35" />
        <path d="M165 153 Q178 148 195 153" fill="none" stroke="#252530" strokeWidth="0.4" opacity="0.3" />
        <path d="M167 158 Q180 154 198 157" fill="none" stroke="#2a2a35" strokeWidth="0.4" opacity="0.25" />
        {/* Shadow crack */}
        <path d="M178 132 Q180 140 176 150" fill="none" stroke="#12121a" strokeWidth="0.6" opacity="0.3" />
      </g>
      {/* Right cliff face — overhanging ledge */}
      <g opacity="0.45">
        <path d="M620 130 L640 118 L665 125 L660 148 L625 150 Z" fill="url(#ch8_granite)" />
        <path d="M623 133 Q640 128 658 133" fill="none" stroke="#2a2a35" strokeWidth="0.5" opacity="0.3" />
        <path d="M625 140 Q643 135 657 140" fill="none" stroke="#252530" strokeWidth="0.4" opacity="0.25" />
        <path d="M627 146 Q645 142 656 147" fill="none" stroke="#2a2a35" strokeWidth="0.4" opacity="0.2" />
        {/* Overhang shadow underneath */}
        <path d="M625 150 Q642 153 660 148" fill="none" stroke="#0a0a12" strokeWidth="1.5" opacity="0.2" />
      </g>
      {/* Loose boulder on right slope */}
      <ellipse cx="690" cy="152" rx="5" ry="3" fill="#1e1e28" opacity="0.4" />
      <path d="M686 152 Q690 150 694 152" fill="none" stroke="#2a2a35" strokeWidth="0.4" opacity="0.2" />

      {/* === LICHEN PATCHES — yellow-green on rock faces === */}
      <circle cx="172" cy="148" r="3" fill="url(#ch8_lichen)" />
      <circle cx="188" cy="140" r="2" fill="url(#ch8_lichen)" opacity="0.8" />
      <circle cx="635" cy="135" r="2.5" fill="url(#ch8_lichen)" />
      <circle cx="650" cy="142" r="1.8" fill="url(#ch8_lichen)" opacity="0.7" />
      <circle cx="692" cy="150" r="2" fill="url(#ch8_lichen)" opacity="0.6" />

      {/* === ALPINE VEGETATION — juniper bushes and edelweiss === */}
      {/* Juniper bushes on left slope — compact dark green */}
      <ellipse cx="130" cy="165" rx="6" ry="3.5" fill="#1a2812" opacity="0.45" />
      <ellipse cx="155" cy="158" rx="5" ry="3" fill="#1e2a14" opacity="0.4" />
      <ellipse cx="200" cy="142" rx="4" ry="2.5" fill="#1a2812" opacity="0.35" />
      {/* Juniper on right slope */}
      <ellipse cx="640" cy="155" rx="5" ry="3" fill="#1a2812" opacity="0.4" />
      <ellipse cx="710" cy="135" rx="4.5" ry="2.5" fill="#1e2a14" opacity="0.35" />
      {/* Edelweiss cluster on left rock face — tiny white star-flowers */}
      <g opacity="0.3" transform="translate(185, 135)">
        <circle cx="0" cy="0" r="1.2" fill="#4a4a40" />
        <circle cx="0" cy="-1.2" r="0.4" fill="#6a6a58" />
        <circle cx="1" cy="-0.4" r="0.4" fill="#6a6a58" />
        <circle cx="0.6" cy="0.8" r="0.4" fill="#6a6a58" />
        <circle cx="-1" cy="-0.4" r="0.4" fill="#6a6a58" />
        <circle cx="-0.6" cy="0.8" r="0.4" fill="#6a6a58" />
      </g>
      <g opacity="0.25" transform="translate(645, 128)">
        <circle cx="0" cy="0" r="1" fill="#4a4a40" />
        <circle cx="0" cy="-1" r="0.35" fill="#6a6a58" />
        <circle cx="0.9" cy="-0.3" r="0.35" fill="#6a6a58" />
        <circle cx="0.5" cy="0.7" r="0.35" fill="#6a6a58" />
        <circle cx="-0.9" cy="-0.3" r="0.35" fill="#6a6a58" />
        <circle cx="-0.5" cy="0.7" r="0.35" fill="#6a6a58" />
      </g>

      {/* === WOODCUTTER'S CABIN — small timber hut near right treeline === */}
      <g opacity="0.45" transform="translate(612, 148)">
        {/* Cabin body — dark timber */}
        <rect x="-7" y="-6" width="14" height="9" fill="url(#ch8_cabinWood)" />
        {/* Log wall lines */}
        <line x1="-7" y1="-3" x2="7" y2="-3" stroke="#1a1510" strokeWidth="0.4" opacity="0.4" />
        <line x1="-7" y1="0" x2="7" y2="0" stroke="#1a1510" strokeWidth="0.4" opacity="0.35" />
        {/* Steep roof — angled for snow */}
        <path d="M-9 -6 L0 -13 L9 -6 Z" fill="#1e1810" />
        {/* Chimney stub */}
        <rect x="3" y="-14" width="2.5" height="4" fill="#2a2520" />
        {/* Faint chimney smoke */}
        <path d="M4.2 -14 Q3.5 -20 5 -25" fill="none" stroke="#4a4538" strokeWidth="0.8" opacity="0.06">
          <animate attributeName="d" values="M4.2 -14 Q3.5 -20 5 -25;M4.2 -14 Q5.5 -20 3.8 -25;M4.2 -14 Q3.5 -20 5 -25" dur="8s" repeatCount="indefinite" />
        </path>
        {/* Small window */}
        <rect x="-3" y="-4" width="2.5" height="2.5" fill="#1a1510" opacity="0.6" />
        {/* Door */}
        <rect x="1" y="-4" width="3" height="7" fill="#161210" opacity="0.5" />
        {/* Woodpile beside cabin */}
        <ellipse cx="11" cy="1" rx="3" ry="1.5" fill="#2a2015" opacity="0.5" />
        <ellipse cx="11" cy="-1" rx="2.5" ry="1.2" fill="#251c12" opacity="0.4" />
      </g>

      {/* === CONIFERS ON HIGH SLOPES — dark silhouettes === */}
      {/* Left slope conifers */}
      <path d="M55 148 L58 128 L61 148 Z" fill="#141a12" opacity="0.6" />
      <path d="M56 138 L58 120 L60 138 Z" fill="#141a12" opacity="0.55" />
      <path d="M100 140 L103 118 L106 140 Z" fill="#141a12" opacity="0.55" />
      <path d="M101 130 L103 110 L105 130 Z" fill="#141a12" opacity="0.5" />
      <path d="M140 133 L143 115 L146 133 Z" fill="#141a12" opacity="0.5" />
      <path d="M180 125 L182 110 L184 125 Z" fill="#141a12" opacity="0.45" />
      <path d="M210 128 L212 114 L214 128 Z" fill="#141a12" opacity="0.4" />

      {/* Right slope conifers */}
      <path d="M600 135 L603 115 L606 135 Z" fill="#141a12" opacity="0.55" />
      <path d="M601 125 L603 108 L605 125 Z" fill="#141a12" opacity="0.5" />
      <path d="M650 128 L653 108 L656 128 Z" fill="#141a12" opacity="0.5" />
      <path d="M700 120 L702 102 L704 120 Z" fill="#141a12" opacity="0.45" />
      <path d="M740 115 L742 100 L744 115 Z" fill="#141a12" opacity="0.4" />
      <path d="M770 110 L772 98 L774 110 Z" fill="#141a12" opacity="0.35" />

      {/* === OWL SILHOUETTE — perched in the bare tree (right side) === */}
      <g opacity="0.35" transform="translate(553, 225)">
        {/* Body — round, compact owl shape */}
        <ellipse cx="0" cy="0" rx="2.5" ry="3" fill="#121218" />
        {/* Head — slightly wider, with ear tufts */}
        <circle cx="0" cy="-4" r="2.2" fill="#121218" />
        {/* Ear tufts */}
        <path d="M-1.5 -6 L-2.5 -8" stroke="#121218" strokeWidth="0.6" fill="none" />
        <path d="M1.5 -6 L2.5 -8" stroke="#121218" strokeWidth="0.6" fill="none" />
        {/* Eyes — faint amber glint in the dusk */}
        <circle cx="-1" cy="-4.2" r="0.5" fill="#8a7030" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1" cy="-4.2" r="0.5" fill="#8a7030" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="6s" repeatCount="indefinite" />
        </circle>
        {/* Tail feathers */}
        <path d="M0 3 Q-0.5 5 0 6" fill="none" stroke="#121218" strokeWidth="0.8" />
      </g>

      {/* === EAGLE/HAWK — circling high above the valley === */}
      <g opacity="0.35">
        <animateTransform attributeName="transform" type="rotate"
          values="0 400 80;360 400 80" dur="30s" repeatCount="indefinite" />
        {/* Raptor silhouette — wings spread */}
        <g transform="translate(400,55)">
          <path d="M-6,0 Q-3,-2 0,-1 Q3,-2 6,0 Q3,0.5 0,0.5 Q-3,0.5 -6,0 Z"
            fill="#121218" />
          {/* Wing tips angled down slightly */}
          <path d="M-6,0 L-8,1" stroke="#121218" strokeWidth="0.5" fill="none" />
          <path d="M6,0 L8,1" stroke="#121218" strokeWidth="0.5" fill="none" />
        </g>
      </g>

      {/* === AUTUMN TREES ON LOWER SLOPES — vibrant fall colors === */}
      {/* Left slope autumn trees — trunks + foliage */}
      <rect x="78" y="155" width="2" height="15" fill="#2a2015" opacity="0.6" />
      <ellipse cx="79" cy="150" rx="12" ry="9" fill="#b04a18" opacity="0.65" />
      <ellipse cx="82" cy="148" rx="8" ry="6" fill="#c06020" opacity="0.4" />
      <rect x="118" y="148" width="2" height="14" fill="#2a2015" opacity="0.55" />
      <ellipse cx="119" cy="143" rx="10" ry="8" fill="#c07028" opacity="0.6" />
      <ellipse cx="116" cy="141" rx="7" ry="5" fill="#d08830" opacity="0.35" />
      <rect x="158" y="140" width="2" height="12" fill="#2a2015" opacity="0.5" />
      <ellipse cx="159" cy="136" rx="11" ry="7" fill="#9a3a10" opacity="0.6" />
      <ellipse cx="195" cy="130" rx="9" ry="6" fill="#b05520" opacity="0.55" />
      <ellipse cx="145" cy="148" rx="8" ry="6" fill="#7a8028" opacity="0.5" />

      {/* Right slope autumn trees */}
      <rect x="608" y="142" width="2" height="14" fill="#2a2015" opacity="0.6" />
      <ellipse cx="609" cy="137" rx="11" ry="8" fill="#b84518" opacity="0.6" />
      <ellipse cx="612" cy="135" rx="7" ry="5" fill="#d06020" opacity="0.35" />
      <rect x="648" y="135" width="2" height="12" fill="#2a2015" opacity="0.55" />
      <ellipse cx="649" cy="131" rx="10" ry="7" fill="#c06a25" opacity="0.6" />
      <ellipse cx="685" cy="125" rx="9" ry="6" fill="#9a3a10" opacity="0.55" />
      <rect x="718" y="122" width="2" height="10" fill="#2a2015" opacity="0.5" />
      <ellipse cx="719" cy="118" rx="10" ry="7" fill="#c06018" opacity="0.55" />
      <ellipse cx="670" cy="132" rx="7" ry="5" fill="#6a7a20" opacity="0.5" />

      {/* === VALLEY FLOOR === */}
      <path d="M230 240 Q320 230 400 235 Q480 230 580 240 L580 400 L230 400 Z"
        fill="url(#ch8_valley)" />

      {/* === BRENTA RIVER — rushing through valley === */}
      {/* Main river body */}
      <path d="M330 160 Q355 180 375 200 Q400 220 390 242 Q375 265 358 285 Q340 305 348 325 Q358 345 375 365 Q385 380 390 400"
        fill="none" stroke="url(#ch8_river)" strokeWidth="34" strokeLinecap="round" opacity="0.85" />

      {/* River surface — darker center flow */}
      <path d="M338 168 Q360 186 378 205 Q398 224 388 245 Q374 268 357 288 Q342 308 350 328 Q360 348 376 368"
        fill="none" stroke="#1a2535" strokeWidth="12" opacity="0.35" />

      {/* Dusk sky reflection band on river — warm amber stripe */}
      <path d="M336 172 Q358 190 376 208 Q396 226 386 248 Q372 270 356 290 Q340 310 349 330 Q358 350 374 370"
        fill="none" stroke="#8a5530" strokeWidth="4" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="4s" repeatCount="indefinite" />
      </path>

      {/* White rapids / foam streaks — animated, bright */}
      <path d="M345 175 Q355 178 365 175" fill="none" stroke="#8a9aaa" strokeWidth="1.4" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.22;0.4" dur="1.5s" repeatCount="indefinite" />
      </path>
      <path d="M380 210 Q390 213 395 208" fill="none" stroke="#8a9aaa" strokeWidth="1.2" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.18;0.35" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M385 240 Q378 244 372 240" fill="none" stroke="#9aaabb" strokeWidth="1.4" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.18;0.35" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M365 270 Q358 273 350 270" fill="none" stroke="#8a9aaa" strokeWidth="1.2" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="1.6s" repeatCount="indefinite" />
      </path>
      <path d="M345 300 Q352 303 358 300" fill="none" stroke="#9aaabb" strokeWidth="1.4" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.16;0.3" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M355 335 Q362 338 370 335" fill="none" stroke="#8a9aaa" strokeWidth="1.2" opacity="0.28">
        <animate attributeName="opacity" values="0.28;0.14;0.28" dur="1.7s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL RAPIDS — more foam and turbulence === */}
      {/* Wide foam band near bridge pilings */}
      <path d="M350 220 Q360 224 375 220 Q385 224 395 220" fill="none" stroke="#9aaabb" strokeWidth="1.8" opacity="0.32">
        <animate attributeName="opacity" values="0.32;0.18;0.32" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* Churning current below bridge */}
      <path d="M375 245 Q382 248 388 245 Q392 248 398 244" fill="none" stroke="#8a9aaa" strokeWidth="1" opacity="0.28">
        <animate attributeName="opacity" values="0.28;0.14;0.28" dur="1.6s" repeatCount="indefinite" />
      </path>
      {/* Additional foam streaks in fast sections */}
      <path d="M352 185 Q358 187 363 184" fill="none" stroke="#9aaabb" strokeWidth="0.9" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="1.3s" repeatCount="indefinite" />
      </path>
      <path d="M360 290 Q366 293 373 289" fill="none" stroke="#8a9aaa" strokeWidth="1.1" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="1.9s" repeatCount="indefinite" />
      </path>
      <path d="M348 318 Q355 321 362 317" fill="none" stroke="#8a9aaa" strokeWidth="1" opacity="0.22">
        <animate attributeName="opacity" values="0.22;0.08;0.22" dur="2.2s" repeatCount="indefinite" />
      </path>
      {/* Animated V-wake behind river rock */}
      <path d="M362 194 Q366 196 370 194 M362 196 Q366 198 370 196" fill="none" stroke="#5a6a7a" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="1.4s" repeatCount="indefinite" />
      </path>
      {/* Downstream current lines — slow drift animation */}
      <path d="M372 350 Q378 352 384 350" fill="none" stroke="#5a6a7a" strokeWidth="0.6" opacity="0.12">
        <animate attributeName="d" values="M372 350 Q378 352 384 350;M372 352 Q378 354 384 352;M372 350 Q378 352 384 350" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M365 375 Q372 377 380 375" fill="none" stroke="#5a6a7a" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M365 375 Q372 377 380 375;M365 377 Q372 379 380 377;M365 375 Q372 377 380 375" dur="2.8s" repeatCount="indefinite" />
      </path>

      {/* River rocks protruding */}
      <ellipse cx="362" cy="192" rx="4" ry="2.5" fill="#252530" opacity="0.5" />
      <ellipse cx="386" cy="228" rx="3" ry="2" fill="#252530" opacity="0.45" />
      <ellipse cx="368" cy="260" rx="3.5" ry="2" fill="#252530" opacity="0.45" />
      <ellipse cx="345" cy="310" rx="4" ry="2.5" fill="#252530" opacity="0.4" />
      {/* Additional submerged rock */}
      <ellipse cx="378" cy="340" rx="3" ry="1.8" fill="#252530" opacity="0.3" />
      {/* White water around rocks */}
      <path d="M358 192 Q362 189 366 192" fill="none" stroke="#7a8a9a" strokeWidth="0.6" opacity="0.2" />
      <path d="M364 260 Q368 257 372 260" fill="none" stroke="#7a8a9a" strokeWidth="0.6" opacity="0.18" />
      {/* White water around new submerged rock */}
      <path d="M375 340 Q378 337 382 340" fill="none" stroke="#7a8a9a" strokeWidth="0.5" opacity="0.14" />

      {/* === RIVER SPRAY — animated tiny white dots near rapids/rocks === */}
      <circle cx="360" cy="190" r="0.5" fill="#8a9aaa" opacity="0.3">
        <animate attributeName="cy" values="190;187;190" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="365" cy="189" r="0.4" fill="#9aaabb" opacity="0.25">
        <animate attributeName="cy" values="189;186;189" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.08;0.25" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="358" cy="193" r="0.3" fill="#8a9aaa" opacity="0.2">
        <animate attributeName="cx" values="358;356;358" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="0.9s" repeatCount="indefinite" />
      </circle>
      {/* Spray near second rock */}
      <circle cx="384" cy="226" r="0.4" fill="#8a9aaa" opacity="0.25">
        <animate attributeName="cy" values="226;223;226" dur="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.08;0.25" dur="0.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="388" cy="227" r="0.35" fill="#9aaabb" opacity="0.2">
        <animate attributeName="cy" values="227;224;227" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.06;0.2" dur="1.1s" repeatCount="indefinite" />
      </circle>
      {/* Spray near third rock */}
      <circle cx="366" cy="258" r="0.4" fill="#8a9aaa" opacity="0.22">
        <animate attributeName="cy" values="258;255;258" dur="0.85s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.22;0.06;0.22" dur="0.85s" repeatCount="indefinite" />
      </circle>
      <circle cx="370" cy="259" r="0.3" fill="#9aaabb" opacity="0.18">
        <animate attributeName="cx" values="370;372;370" dur="0.95s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.18;0.04;0.18" dur="0.95s" repeatCount="indefinite" />
      </circle>
      {/* Spray near fourth rock */}
      <circle cx="343" cy="308" r="0.5" fill="#8a9aaa" opacity="0.2">
        <animate attributeName="cy" values="308;305;308" dur="0.9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.06;0.2" dur="0.9s" repeatCount="indefinite" />
      </circle>
      <circle cx="347" cy="309" r="0.35" fill="#9aaabb" opacity="0.16">
        <animate attributeName="cy" values="309;306;309" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.16;0.04;0.16" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* Spray near new submerged rock */}
      <circle cx="377" cy="338" r="0.4" fill="#8a9aaa" opacity="0.15">
        <animate attributeName="cy" values="338;335;338" dur="0.95s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.04;0.15" dur="0.95s" repeatCount="indefinite" />
      </circle>

      {/* === RIVER EDDY POOLS — swirling still water behind rocks === */}
      <circle cx="358" cy="198" r="4" fill="url(#ch8_eddy)">
        <animate attributeName="r" values="4;4.5;4" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Eddy spiral lines */}
      <path d="M356 196 Q360 194 362 198 Q360 200 356 199" fill="none" stroke="#3a4a5a" strokeWidth="0.4" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="2.5s" repeatCount="indefinite" />
      </path>
      <circle cx="370" cy="265" r="3.5" fill="url(#ch8_eddy)">
        <animate attributeName="r" values="3.5;4;3.5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <path d="M368 263 Q372 262 373 266 Q371 268 368 266" fill="none" stroke="#3a4a5a" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.04;0.1" dur="2.8s" repeatCount="indefinite" />
      </path>
      {/* Deeper pool below bridge — calmer water */}
      <ellipse cx="380" cy="255" rx="8" ry="4" fill="#1a2530" opacity="0.12" />

      {/* === WHITEWATER CASCADE — turbulent section near bridge pilings === */}
      {/* Cascade foam sheet */}
      <path d="M355 225 Q365 222 375 225 Q380 228 375 232 Q365 235 355 232 Q350 228 355 225 Z"
        fill="#5a6a7a" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* Individual foam bubbles */}
      <circle cx="360" cy="227" r="0.6" fill="#7a8a9a" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="368" cy="224" r="0.5" fill="#8a9aaa" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="372" cy="229" r="0.4" fill="#7a8a9a" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="0.9s" repeatCount="indefinite" />
      </circle>

      {/* Animated water flow lines */}
      <path d="M340 180 Q348 185 340 190" fill="none" stroke="#4a5a6a" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M340 180 Q348 185 340 190;M340 182 Q349 187 340 192;M340 180 Q348 185 340 190" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M380 250 Q372 255 380 260" fill="none" stroke="#4a5a6a" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="d" values="M380 250 Q372 255 380 260;M380 252 Q371 257 380 262;M380 250 Q372 255 380 260" dur="2.2s" repeatCount="indefinite" />
      </path>
      {/* Additional animated flow line — mid-river */}
      <path d="M355 295 Q348 300 356 305" fill="none" stroke="#4a5a6a" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M355 295 Q348 300 356 305;M355 297 Q347 302 356 307;M355 295 Q348 300 356 305" dur="2.4s" repeatCount="indefinite" />
      </path>

      {/* === RIVER REFLECTIONS — bridge and mountain mirrored === */}
      {/* Bridge reflection — blurred, wavering */}
      <path d="M330 250 Q355 258 380 260 Q405 258 420 250"
        fill="none" stroke="#2a2818" strokeWidth="4" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Mountain slope reflection in still water */}
      <path d="M340 310 Q345 318 350 325 Q355 318 360 310"
        fill="#161620" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Fire glow reflected on water surface */}
      <ellipse cx="382" cy="265" rx="10" ry="4" fill="#c08040" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.05;0.1" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="10;13;10" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Star reflected — wobbling point */}
      <circle cx="355" cy="280" r="0.8" fill="#ffffff" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="355;357;355" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* === AUTUMN COLOUR REFLECTIONS ON WATER — vivid warm tones from foliage === */}
      {/* Reflection of left-bank autumn trees */}
      <ellipse cx="345" cy="195" rx="12" ry="5" fill="url(#ch8_autumnReflect)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="12;14;12" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Reflection of right-bank foliage */}
      <ellipse cx="380" cy="235" rx="10" ry="4" fill="url(#ch8_autumnReflect)" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.4;0.7" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Orange-gold shimmer band on calm water stretch */}
      <path d="M350 320 Q358 318 365 320" fill="none" stroke="#a06028" strokeWidth="1.5" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.05;0.12" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Second shimmer band downstream */}
      <path d="M358 345 Q366 343 374 345" fill="none" stroke="#8a5020" strokeWidth="1" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="3.5s" repeatCount="indefinite" />
      </path>
      {/* Dusk sky reflection — pink-amber glow on water */}
      <ellipse cx="365" cy="355" rx="14" ry="4" fill="#8a4a30" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.04;0.08" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* === FLOATING DEBRIS ON RIVER — leaves carried by current === */}
      {/* Leaf floating downstream 1 */}
      <ellipse cx="360" cy="200" rx="1.2" ry="0.5" fill="#7a4020" opacity="0.25">
        <animate attributeName="cy" values="200;250;310;370;400" dur="14s" repeatCount="indefinite" />
        <animate attributeName="cx" values="360;375;370;355;365" dur="14s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.22;0.18;0.12;0.05" dur="14s" repeatCount="indefinite" />
      </ellipse>
      {/* Leaf floating downstream 2 — staggered */}
      <ellipse cx="352" cy="240" rx="1" ry="0.4" fill="#8a5525" opacity="0.2">
        <animate attributeName="cy" values="240;290;340;400" dur="12s" repeatCount="indefinite" />
        <animate attributeName="cx" values="352;365;358;370" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.18;0.12;0.04" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Small twig floating */}
      <line x1="370" y1="280" x2="374" y2="279" stroke="#3a2a15" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="y1" values="280;330;380;400" dur="11s" repeatCount="indefinite" />
        <animate attributeName="y2" values="279;329;379;399" dur="11s" repeatCount="indefinite" />
        <animate attributeName="x1" values="370;365;360;368" dur="11s" repeatCount="indefinite" />
        <animate attributeName="x2" values="374;369;364;372" dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.12;0.08;0.02" dur="11s" repeatCount="indefinite" />
      </line>

      {/* === STONE BRIDGE over the river === */}
      {/* Bridge arch */}
      <path d="M310 240 Q330 225 350 218 Q370 212 390 218 Q410 225 430 240"
        fill="url(#ch8_bridge)" opacity="0.8" />
      {/* Bridge deck */}
      <rect x="308" y="215" width="124" height="6" rx="1" fill="#3a3625" opacity="0.75" />
      {/* Bridge arch opening — water visible below */}
      <path d="M322 240 Q340 228 358 222 Q378 228 395 240"
        fill="#253040" opacity="0.4" />
      {/* Bridge parapet lines */}
      <path d="M310 215 Q370 213 430 215" fill="none" stroke="#4a4535" strokeWidth="0.8" opacity="0.3" />
      <path d="M312 221 Q370 219 428 221" fill="none" stroke="#35301e" strokeWidth="0.5" opacity="0.25" />
      {/* Stone blocks on bridge */}
      <line x1="330" y1="215" x2="330" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />
      <line x1="350" y1="215" x2="350" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />
      <line x1="370" y1="215" x2="370" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />
      <line x1="390" y1="215" x2="390" y2="221" stroke="#35301e" strokeWidth="0.5" opacity="0.2" />

      {/* === BRIDGE KEYSTONE & DETAIL === */}
      {/* Keystone at arch crown */}
      <path d="M356 218 L360 213 L364 218 Z" fill="#4a4530" opacity="0.4" />
      {/* Additional stone block lines on arch face */}
      <path d="M325 235 Q330 232 340 230" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.18" />
      <path d="M395 230 Q405 232 415 235" fill="none" stroke="#2a2518" strokeWidth="0.4" opacity="0.18" />
      {/* Moss on bridge stones */}
      <ellipse cx="338" cy="218" rx="4" ry="1" fill="#2a3a18" opacity="0.15" />
      <ellipse cx="398" cy="219" rx="3" ry="0.8" fill="#2a3a18" opacity="0.12" />
      {/* Bridge parapet capstones */}
      <rect x="318" y="213" width="6" height="2" rx="0.5" fill="#3a3520" opacity="0.3" />
      <rect x="336" y="213" width="6" height="2" rx="0.5" fill="#3a3520" opacity="0.28" />
      <rect x="375" y="213" width="6" height="2" rx="0.5" fill="#3a3520" opacity="0.28" />
      <rect x="398" y="213" width="6" height="2" rx="0.5" fill="#3a3520" opacity="0.3" />

      {/* === BRIDGE LANTERN — warm light hanging from parapet === */}
      <g opacity="0.8" transform="translate(350, 210)">
        {/* Iron bracket */}
        <path d="M0 0 Q-2 -2 -2 -5" fill="none" stroke="#2a2518" strokeWidth="0.6" opacity="0.4" />
        {/* Lantern body — small box */}
        <rect x="-3.5" y="-8" width="3" height="4" rx="0.3" fill="#2a2518" opacity="0.5" />
        {/* Lantern glow */}
        <circle cx="-2" cy="-6" r="6" fill="url(#ch8_lantern)">
          <animate attributeName="r" values="6;7;6" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Flame core */}
        <ellipse cx="-2" cy="-6.5" rx="0.6" ry="1" fill="#e0a050" opacity="0.45">
          <animate attributeName="ry" values="1;1.3;1" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0.3;0.45" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Lantern light on bridge surface */}
        <ellipse cx="-2" cy="2" rx="5" ry="1.5" fill="#c08040" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.03;0.06" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* === SENTRY ON BRIDGE — standing guard === */}
      <g opacity="0.75" transform="translate(370, 200)">
        {/* Body — dark silhouette on bridge */}
        <path d="M-2 0 Q-3 -8 -1 -14 Q1 -8 2 0 Z" fill="#121010" />
        <circle cx="0" cy="-17" r="3" fill="#121010" />
        {/* Musket held across body */}
        <line x1="-4" y1="-10" x2="5" y2="-16" stroke="#121010" strokeWidth="0.8" opacity="0.5" />
        {/* Bayonet glint */}
        <circle cx="5.5" cy="-16.5" r="0.4" fill="#5a5a6a" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === PONTOON FOOTBRIDGE — downstream, improvised military crossing === */}
      <g opacity="0.5" transform="translate(365, 320)">
        {/* Pontoon boats — three flat-bottom boats side by side */}
        <ellipse cx="-8" cy="0" rx="5" ry="1.5" fill="url(#ch8_pontoon)" />
        <ellipse cx="0" cy="0" rx="5" ry="1.5" fill="url(#ch8_pontoon)" />
        <ellipse cx="8" cy="0" rx="5" ry="1.5" fill="url(#ch8_pontoon)" />
        {/* Plank decking across pontoons */}
        <rect x="-14" y="-2" width="28" height="2" rx="0.3" fill="#2a2518" />
        <line x1="-14" y1="-1" x2="14" y2="-1" stroke="#1e1a12" strokeWidth="0.4" opacity="0.3" />
        {/* Side rope rails */}
        <path d="M-14 -3 Q-7 -4.5 0 -3 Q7 -4.5 14 -3" fill="none" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        {/* Rope tie-off posts */}
        <line x1="-14" y1="-3" x2="-14" y2="2" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
        <line x1="14" y1="-3" x2="14" y2="2" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
        {/* Anchor ropes going to riverbank */}
        <path d="M-14 0 L-22 -5" stroke="#2a2015" strokeWidth="0.4" opacity="0.25" />
        <path d="M14 0 L22 -5" stroke="#2a2015" strokeWidth="0.4" opacity="0.25" />
        {/* Water ripple around pontoons */}
        <path d="M-14 2 Q-7 3 0 2 Q7 3 14 2" fill="none" stroke="#5a6a7a" strokeWidth="0.5" opacity="0.12">
          <animate attributeName="d" values="M-14 2 Q-7 3 0 2 Q7 3 14 2;M-14 2 Q-7 4 0 2 Q7 4 14 2;M-14 2 Q-7 3 0 2 Q7 3 14 2" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Soldier crossing — small figure on planks */}
        <path d="M-3 -3 Q-4 -7 -3 -10 Q-2 -7 -1 -3 Z" fill="#121010" opacity="0.5" />
        <circle cx="-2.5" cy="-12" r="1.8" fill="#121010" opacity="0.5" />
      </g>

      {/* === RIVERSIDE MILL — stone building with waterwheel === */}
      <g opacity="0.45" transform="translate(340, 175)">
        {/* Mill body — thick stone walls */}
        <rect x="-8" y="-10" width="16" height="14" fill="#2a2820" />
        {/* Stone texture lines */}
        <line x1="-8" y1="-5" x2="8" y2="-5" stroke="#1e1a15" strokeWidth="0.4" opacity="0.3" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#1e1a15" strokeWidth="0.4" opacity="0.25" />
        {/* Steep roof */}
        <path d="M-10 -10 L0 -18 L10 -10 Z" fill="#1e1810" />
        {/* Small window */}
        <rect x="-3" y="-8" width="2.5" height="2.5" fill="#1a1510" opacity="0.5" />
        {/* Waterwheel — mounted on river side */}
        <g transform="translate(10, 2)">
          <circle cx="0" cy="0" r="6" fill="none" stroke="url(#ch8_waterwheel)" strokeWidth="1.2">
            <animateTransform attributeName="transform" type="rotate"
              values="0 0 0;360 0 0" dur="12s" repeatCount="indefinite" />
          </circle>
          {/* Wheel paddles (spokes with flat ends) */}
          <g>
            <animateTransform attributeName="transform" type="rotate"
              values="0 0 0;360 0 0" dur="12s" repeatCount="indefinite" />
            <line x1="0" y1="-6" x2="0" y2="6" stroke="#252228" strokeWidth="0.6" opacity="0.5" />
            <line x1="-6" y1="0" x2="6" y2="0" stroke="#252228" strokeWidth="0.6" opacity="0.5" />
            <line x1="-4.2" y1="-4.2" x2="4.2" y2="4.2" stroke="#252228" strokeWidth="0.5" opacity="0.4" />
            <line x1="4.2" y1="-4.2" x2="-4.2" y2="4.2" stroke="#252228" strokeWidth="0.5" opacity="0.4" />
            {/* Paddle blades at spoke ends */}
            <rect x="-1" y="-7" width="2" height="2" fill="#252228" opacity="0.5" />
            <rect x="-1" y="5" width="2" height="2" fill="#252228" opacity="0.5" />
            <rect x="-7" y="-1" width="2" height="2" fill="#252228" opacity="0.5" />
            <rect x="5" y="-1" width="2" height="2" fill="#252228" opacity="0.5" />
          </g>
          {/* Axle */}
          <circle cx="0" cy="0" r="1" fill="#252228" opacity="0.6" />
          {/* Water splash around lower paddles */}
          <circle cx="2" cy="5" r="0.5" fill="#7a8a9a" opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.05;0.15" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Mill race — channel leading water to wheel */}
        <path d="M-8 4 Q-4 6 2 4" fill="none" stroke="#253540" strokeWidth="1.5" opacity="0.2" />
      </g>

      {/* === ANIMATED MIST RIBBONS — drifting through the valley gorge === */}
      <ellipse cx="300" cy="185" rx="100" ry="5" fill="url(#ch8_mistRibbon)" opacity="0.7">
        <animate attributeName="cx" values="300;340;300" dur="30s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.4;0.7" dur="30s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="480" cy="170" rx="80" ry="4" fill="url(#ch8_mistRibbon)" opacity="0.5">
        <animate attributeName="cx" values="480;510;480" dur="25s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="25s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="360" cy="210" rx="60" ry="3" fill="url(#ch8_mistRibbon)" opacity="0.4">
        <animate attributeName="cx" values="360;385;360" dur="22s" repeatCount="indefinite" />
      </ellipse>
      {/* Low mist hugging the river surface — visible wisps */}
      <ellipse cx="375" cy="300" rx="45" ry="6" fill="#7a8595" opacity="0.06">
        <animate attributeName="cx" values="375;395;375" dur="20s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.03;0.06" dur="20s" repeatCount="indefinite" />
      </ellipse>
      {/* Additional mist band lower */}
      <ellipse cx="360" cy="340" rx="35" ry="4" fill="#7a8595" opacity="0.04">
        <animate attributeName="cx" values="360;375;360" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.02;0.04" dur="14s" repeatCount="indefinite" />
      </ellipse>

      {/* === MOUNTAIN VILLAGE — far side of river === */}
      {/* Building 1 — larger, central */}
      <rect x="420" y="195" width="18" height="22" fill="#2a2820" opacity="0.6" />
      <path d="M418 195 L429 183 L440 195 Z" fill="url(#ch8_roofWarm)" opacity="0.55" />
      {/* Window glow — warm interior light */}
      <rect x="425" y="203" width="3" height="3" fill="#c09040" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.25;0.4" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Building 2 — smaller, left */}
      <rect x="406" y="200" width="13" height="17" fill="#252318" opacity="0.55" />
      <path d="M404 200 L412 190 L420 200 Z" fill="url(#ch8_roofWarm)" opacity="0.5" />
      {/* Window */}
      <rect x="410" y="206" width="2" height="2.5" fill="#b08838" opacity="0.3" />

      {/* Building 3 — behind, taller */}
      <rect x="438" y="190" width="14" height="27" fill="#222018" opacity="0.5" />
      <path d="M436 190 L445 178 L454 190 Z" fill="#3a2820" opacity="0.45" />

      {/* Building 4 — small outbuilding */}
      <rect x="455" y="205" width="10" height="12" fill="#2a2820" opacity="0.45" />
      <path d="M454 205 L460 198 L466 205 Z" fill="url(#ch8_roofWarm)" opacity="0.4" />

      {/* Village church tower hint */}
      <rect x="443" y="175" width="5" height="15" fill="#252320" opacity="0.4" />
      <path d="M442 175 L445 170 L449 175 Z" fill="#3a2a20" opacity="0.35" />

      {/* === VILLAGE CHIMNEY SMOKE — thin animated columns === */}
      {/* Smoke from Building 1 chimney */}
      <path d="M432 183 Q430 170 434 155" fill="none" stroke="#4a4538" strokeWidth="1.5" opacity="0.07">
        <animate attributeName="d" values="M432 183 Q430 170 434 155;M432 183 Q435 170 432 155;M432 183 Q430 170 434 155" dur="7s" repeatCount="indefinite" />
      </path>
      {/* Smoke from Building 3 chimney */}
      <path d="M447 178 Q445 165 449 148" fill="none" stroke="#4a4538" strokeWidth="1.2" opacity="0.06">
        <animate attributeName="d" values="M447 178 Q445 165 449 148;M447 178 Q450 165 446 148;M447 178 Q445 165 449 148" dur="8s" repeatCount="indefinite" />
      </path>
      {/* Smoke from Building 4 chimney */}
      <path d="M462 198 Q460 188 464 175" fill="none" stroke="#4a4538" strokeWidth="1" opacity="0.05">
        <animate attributeName="d" values="M462 198 Q460 188 464 175;M462 198 Q465 188 461 175;M462 198 Q460 188 464 175" dur="9s" repeatCount="indefinite" />
      </path>

      {/* === ROAD BESIDE THE RIVER === */}
      <path d="M230 295 Q300 288 370 290 Q430 285 500 290 Q550 295 580 300"
        fill="url(#ch8_road)" opacity="0.5" />
      <path d="M230 305 Q300 298 370 300 Q430 295 500 300 Q550 305 580 310"
        fill="url(#ch8_road)" opacity="0.4" />
      {/* Road edges */}
      <path d="M230 295 Q300 288 370 290 Q430 285 500 290 Q550 295 580 300"
        fill="none" stroke="#3a3520" strokeWidth="0.5" opacity="0.2" />

      {/* === STONE WALL — low dry-stone wall along the road === */}
      <g opacity="0.45">
        {/* Wall runs along road edge */}
        <path d="M240 293 Q280 287 330 289 Q370 286 410 288"
          fill="none" stroke="#3a3828" strokeWidth="3" strokeLinecap="round" />
        {/* Individual stone shapes along the wall */}
        <rect x="244" y="291" width="5" height="3" rx="0.5" fill="#353020" opacity="0.6" />
        <rect x="251" y="290.5" width="6" height="3.5" rx="0.5" fill="#3a3525" opacity="0.55" />
        <rect x="259" y="290" width="4.5" height="3" rx="0.5" fill="#302a1e" opacity="0.6" />
        <rect x="265" y="289.5" width="5.5" height="3" rx="0.5" fill="#353020" opacity="0.55" />
        <rect x="272" y="289" width="5" height="3.5" rx="0.5" fill="#3a3525" opacity="0.5" />
        <rect x="279" y="288.5" width="4" height="3" rx="0.5" fill="#302a1e" opacity="0.55" />
        <rect x="330" y="287.5" width="5" height="3" rx="0.5" fill="#353020" opacity="0.5" />
        <rect x="337" y="287" width="6" height="3.5" rx="0.5" fill="#3a3525" opacity="0.45" />
        <rect x="345" y="286.5" width="4.5" height="3" rx="0.5" fill="#302a1e" opacity="0.5" />
        <rect x="370" y="286" width="5" height="3" rx="0.5" fill="#353020" opacity="0.5" />
        <rect x="377" y="286.5" width="5.5" height="3" rx="0.5" fill="#3a3525" opacity="0.45" />
        <rect x="384" y="287" width="4.5" height="3.5" rx="0.5" fill="#302a1e" opacity="0.5" />
        <rect x="391" y="287" width="5" height="3" rx="0.5" fill="#353020" opacity="0.45" />
        <rect x="398" y="287.5" width="6" height="3" rx="0.5" fill="#3a3525" opacity="0.4" />
        {/* Moss hints on some stones */}
        <ellipse cx="253" cy="291" rx="2" ry="0.5" fill="#3a4520" opacity="0.2" />
        <ellipse cx="340" cy="288" rx="1.5" ry="0.4" fill="#3a4520" opacity="0.15" />
        <ellipse cx="395" cy="287.5" rx="2" ry="0.5" fill="#3a4520" opacity="0.18" />
      </g>

      {/* === GRAPE VINE TRELLIS — Veneto wine country === */}
      <g opacity="0.5" transform="translate(245, 260)">
        {/* Trellis posts — weathered wood */}
        <line x1="0" y1="0" x2="0" y2="-18" stroke="#2a2015" strokeWidth="1" />
        <line x1="16" y1="0" x2="16" y2="-18" stroke="#2a2015" strokeWidth="1" />
        <line x1="32" y1="0" x2="32" y2="-18" stroke="#2a2015" strokeWidth="1" />
        {/* Horizontal wire/rope between posts */}
        <line x1="0" y1="-16" x2="32" y2="-16" stroke="#2a2015" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="-10" x2="32" y2="-10" stroke="#2a2015" strokeWidth="0.4" opacity="0.5" />
        {/* Vine stem — twisting along wire */}
        <path d="M2 -15 Q8 -18 14 -15 Q20 -18 26 -15 Q30 -17 32 -16"
          fill="none" stroke="#3a3520" strokeWidth="0.6" />
        {/* Autumn leaves — turning gold/red, vibrant */}
        <ellipse cx="6" cy="-17" rx="3" ry="2" fill="#b06820" opacity="0.7" />
        <ellipse cx="14" cy="-18" rx="2.5" ry="1.8" fill="#a83818" opacity="0.65" />
        <ellipse cx="22" cy="-17" rx="3" ry="2.2" fill="#c07828" opacity="0.6" />
        <ellipse cx="28" cy="-18" rx="2" ry="1.5" fill="#6a3a18" opacity="0.55" />
        {/* Hanging grape clusters */}
        <ellipse cx="8" cy="-13" rx="1.5" ry="2.5" fill="url(#ch8_grape)" opacity="0.7" />
        <circle cx="7.2" cy="-14" r="0.6" fill="#3a2040" opacity="0.5" />
        <circle cx="8.8" cy="-13.5" r="0.5" fill="#3a2040" opacity="0.45" />
        <circle cx="8" cy="-12" r="0.55" fill="#3a2040" opacity="0.5" />
        <ellipse cx="24" cy="-13" rx="1.8" ry="2.8" fill="url(#ch8_grape)" opacity="0.65" />
        <circle cx="23.2" cy="-14" r="0.6" fill="#3a2040" opacity="0.45" />
        <circle cx="24.8" cy="-13" r="0.55" fill="#3a2040" opacity="0.4" />
        <circle cx="24" cy="-11.5" r="0.6" fill="#3a2040" opacity="0.45" />
        {/* Drooping leaf tendril */}
        <path d="M18 -15 Q17 -12 18 -9" fill="none" stroke="#3a3520" strokeWidth="0.3" opacity="0.4" />
        <ellipse cx="18" cy="-9" rx="1.5" ry="1" fill="#5a4020" opacity="0.4" />
      </g>

      {/* === SECOND GRAPE VINE — further along road === */}
      <g opacity="0.4" transform="translate(520, 270)">
        <line x1="0" y1="0" x2="0" y2="-14" stroke="#2a2015" strokeWidth="0.8" />
        <line x1="14" y1="0" x2="14" y2="-14" stroke="#2a2015" strokeWidth="0.8" />
        <line x1="0" y1="-12" x2="14" y2="-12" stroke="#2a2015" strokeWidth="0.4" opacity="0.5" />
        <path d="M2 -12 Q7 -14 12 -12" fill="none" stroke="#3a3520" strokeWidth="0.5" />
        <ellipse cx="5" cy="-13" rx="2.5" ry="1.8" fill="#7a4520" opacity="0.5" />
        <ellipse cx="10" cy="-14" rx="2" ry="1.5" fill="#8a5525" opacity="0.45" />
        <ellipse cx="7" cy="-9" rx="1.2" ry="2" fill="url(#ch8_grape)" opacity="0.55" />
      </g>

      {/* === CAPTURED AUSTRIAN CANNON — trophy near road === */}
      <g opacity="0.6" transform="translate(420, 300)">
        {/* Gun carriage — wooden frame */}
        <path d="M-10 2 L10 2 L8 -2 L-8 -2 Z" fill="#2a2015" />
        {/* Carriage wheels */}
        <circle cx="-8" cy="4" r="3.5" fill="none" stroke="#2a2518" strokeWidth="1" />
        <circle cx="-8" cy="4" r="0.6" fill="#2a2518" />
        <line x1="-8" y1="0.5" x2="-8" y2="7.5" stroke="#2a2518" strokeWidth="0.3" opacity="0.4" />
        <line x1="-11.5" y1="4" x2="-4.5" y2="4" stroke="#2a2518" strokeWidth="0.3" opacity="0.4" />
        <circle cx="8" cy="4" r="3.5" fill="none" stroke="#2a2518" strokeWidth="1" />
        <circle cx="8" cy="4" r="0.6" fill="#2a2518" />
        {/* Cannon barrel — bronze tube */}
        <rect x="-6" y="-4" width="18" height="3" rx="1.5" fill="url(#ch8_cannonBronze)" />
        {/* Barrel highlight */}
        <line x1="-4" y1="-3.5" x2="10" y2="-3.5" stroke="#4a4530" strokeWidth="0.4" opacity="0.3" />
        {/* Muzzle flare ring */}
        <ellipse cx="12" cy="-2.5" rx="1.8" ry="2" fill="none" stroke="#3a3525" strokeWidth="0.5" opacity="0.4" />
        {/* Trail dragging on ground */}
        <line x1="-10" y1="2" x2="-18" y2="5" stroke="#2a2015" strokeWidth="1.5" opacity="0.5" />
        {/* Cannonball stack beside */}
        <circle cx="16" cy="4" r="1.5" fill="#1a1a20" opacity="0.5" />
        <circle cx="19" cy="4" r="1.5" fill="#1a1a20" opacity="0.45" />
        <circle cx="17.5" cy="1.5" r="1.5" fill="#1a1a20" opacity="0.4" />
      </g>

      {/* === AMMUNITION CAISSON — horse-drawn limber on the road === */}
      <g opacity="0.55" transform="translate(530, 295)">
        {/* Limber — two-wheeled front carriage */}
        <rect x="-18" y="-3" width="10" height="5" rx="0.5" fill="url(#ch8_caisson)" />
        <circle cx="-15" cy="4" r="3" fill="none" stroke="#2a2518" strokeWidth="0.8" />
        <circle cx="-15" cy="4" r="0.5" fill="#2a2518" />
        <circle cx="-10" cy="4" r="3" fill="none" stroke="#2a2518" strokeWidth="0.8" />
        <circle cx="-10" cy="4" r="0.5" fill="#2a2518" />
        {/* Connecting pole to caisson */}
        <line x1="-8" y1="0" x2="4" y2="0" stroke="#2a2518" strokeWidth="0.6" opacity="0.5" />
        {/* Caisson body — heavier ammunition chest */}
        <rect x="4" y="-4" width="14" height="6" rx="0.5" fill="url(#ch8_caisson)" />
        {/* Iron banding on chest */}
        <line x1="4" y1="-2" x2="18" y2="-2" stroke="#2a2a28" strokeWidth="0.4" opacity="0.3" />
        <line x1="4" y1="0" x2="18" y2="0" stroke="#2a2a28" strokeWidth="0.4" opacity="0.25" />
        {/* Rear wheels */}
        <circle cx="8" cy="4" r="3.5" fill="none" stroke="#2a2518" strokeWidth="0.9" />
        <circle cx="8" cy="4" r="0.5" fill="#2a2518" />
        <circle cx="15" cy="4" r="3.5" fill="none" stroke="#2a2518" strokeWidth="0.9" />
        <circle cx="15" cy="4" r="0.5" fill="#2a2518" />
        {/* Draft horse silhouette pulling limber */}
        <ellipse cx="-25" cy="-1" rx="6" ry="3.5" fill="#1a1510" opacity="0.7" />
        <line x1="-28" y1="3" x2="-28" y2="9" stroke="#1a1510" strokeWidth="0.8" opacity="0.5" />
        <line x1="-22" y1="3" x2="-22" y2="9" stroke="#1a1510" strokeWidth="0.8" opacity="0.5" />
        <path d="M-30 -2 Q-33 -7 -32 -10" fill="none" stroke="#1a1510" strokeWidth="1.5" />
        <ellipse cx="-32" cy="-11" rx="2" ry="1.3" fill="#1a1510" />
        {/* Harness traces */}
        <path d="M-19 0 Q-18.5 -1 -18 0" fill="none" stroke="#2a2015" strokeWidth="0.4" opacity="0.3" />
        {/* Driver sitting on limber — small figure */}
        <path d="M-15 -4 Q-16 -8 -15 -11 Q-14 -8 -13 -4 Z" fill="#121010" opacity="0.5" />
        <circle cx="-14.5" cy="-13" r="2" fill="#121010" opacity="0.5" />
      </g>

      {/* === SECOND SUPPLY TRAIN — further back on road, receding === */}
      <g opacity="0.35" transform="translate(565, 300)">
        {/* Covered wagon — canvas top */}
        <rect x="-8" y="-4" width="16" height="6" rx="0.5" fill="#2a2518" />
        {/* Canvas cover — arched */}
        <path d="M-8 -4 Q0 -10 8 -4" fill="#2a2820" stroke="#1e1a12" strokeWidth="0.3" />
        {/* Wheels */}
        <circle cx="-6" cy="4" r="2.5" fill="none" stroke="#2a2518" strokeWidth="0.7" />
        <circle cx="6" cy="4" r="2.5" fill="none" stroke="#2a2518" strokeWidth="0.7" />
        {/* Oxen pulling — pair of dark shapes */}
        <ellipse cx="-16" cy="0" rx="4" ry="2.5" fill="#1a1510" opacity="0.6" />
        <ellipse cx="-22" cy="0" rx="4" ry="2.5" fill="#1a1510" opacity="0.5" />
        {/* Yoke */}
        <line x1="-20" y1="-2" x2="-14" y2="-2" stroke="#2a2015" strokeWidth="0.5" opacity="0.3" />
      </g>

      {/* === HORSE PICKET LINE WITH FARRIER — extended military horse area === */}
      <g opacity="0.5" transform="translate(575, 260)">
        {/* Long picket rope between stakes */}
        <path d="M-15 0 Q0 -1.5 15 0 Q25 -1 35 0"
          fill="none" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        {/* Stake posts */}
        <line x1="-15" y1="0" x2="-15" y2="6" stroke="#2a2015" strokeWidth="0.7" opacity="0.35" />
        <line x1="35" y1="0" x2="35" y2="6" stroke="#2a2015" strokeWidth="0.7" opacity="0.35" />
        {/* Horse 3 — standing at line, tail swishing */}
        <ellipse cx="-5" cy="3" rx="5" ry="3" fill="#1e1510" opacity="0.55" />
        <line x1="-8" y1="6" x2="-8" y2="12" stroke="#1e1510" strokeWidth="0.7" opacity="0.4" />
        <line x1="-2" y1="6" x2="-2" y2="12" stroke="#1e1510" strokeWidth="0.7" opacity="0.4" />
        <path d="M-9 1 Q-12 -3 -11 -6" fill="none" stroke="#1e1510" strokeWidth="1.5" />
        <ellipse cx="-11" cy="-7" rx="1.8" ry="1.1" fill="#1e1510" />
        <path d="M1 2 Q3 3 2 6" fill="none" stroke="#1a1510" strokeWidth="0.7" opacity="0.4">
          <animate attributeName="d" values="M1 2 Q3 3 2 6;M1 2 Q4 4 3 7;M1 2 Q3 3 2 6" dur="3.5s" repeatCount="indefinite" />
        </path>
        {/* Horse 4 — lying down, resting */}
        <ellipse cx="15" cy="5" rx="6" ry="2.5" fill="#2a2018" opacity="0.4" />
        <ellipse cx="10" cy="4" rx="2" ry="1.5" fill="#2a2018" opacity="0.4" />
        {/* Farrier — kneeling, working on horse 3's hoof */}
        <path d="M-2 4 Q-3 0 -1 -3 Q0 0 1 4 Z" fill="#121010" opacity="0.45" />
        <circle cx="-0.5" cy="-5" r="1.8" fill="#121010" opacity="0.45" />
        {/* Farrier's anvil */}
        <rect x="4" y="4" width="3" height="2" rx="0.3" fill="#1a1a20" opacity="0.35" />
        {/* Horseshoe on ground */}
        <path d="M6 3 Q6.5 2 7 3" fill="none" stroke="#3a3a30" strokeWidth="0.4" opacity="0.25" />
        {/* Bucket of water */}
        <ellipse cx="8" cy="6" rx="1.5" ry="1" fill="#1a2530" opacity="0.3" />
      </g>

      {/* === AUSTRIAN RETREAT DEBRIS FIELD — scattered equipment along road === */}
      <g opacity="0.45">
        {/* Discarded shako (Austrian helmet) */}
        <g transform="translate(450, 310)">
          <path d="M-2 0 Q-2.5 -3 0 -4 Q2.5 -3 2 0 Z" fill="#2a2825" />
          <rect x="-2.5" y="-1" width="5" height="1" rx="0.3" fill="#2a2520" />
          {/* Shako plate — tiny brass glint */}
          <circle cx="0" cy="-2.5" r="0.5" fill="#4a4020" opacity="0.3" />
        </g>
        {/* Second discarded shako — crushed */}
        <ellipse cx="468" cy="312" rx="2" ry="1" fill="#2a2825" opacity="0.35" />
        {/* Broken musket — snapped stock */}
        <line x1="440" y1="314" x2="455" y2="312" stroke="#1a1815" strokeWidth="0.8" opacity="0.35" />
        <line x1="455" y1="312" x2="458" y2="315" stroke="#1a1815" strokeWidth="0.6" opacity="0.3" />
        {/* Cartridge pouch — dropped leather case */}
        <rect x="462" y="314" width="3" height="2" rx="0.5" fill="#1e1a15" opacity="0.3" />
        {/* Scattered cartridge papers */}
        <rect x="466" y="315" width="1.5" height="1" rx="0.2" fill="#3a3830" opacity="0.2" />
        <rect x="469" y="314" width="1" height="1.2" rx="0.2" fill="#3a3830" opacity="0.18" transform="rotate(15 469 314)" />
        {/* Broken wagon wheel — half-buried in road */}
        <path d="M476 316 Q480 310 484 316" fill="none" stroke="#2a2518" strokeWidth="1" opacity="0.3" />
        <circle cx="480" cy="313" r="0.4" fill="#2a2518" opacity="0.2" />
        {/* Abandoned knapsack */}
        <rect x="340" y="312" width="3.5" height="4" rx="0.5" fill="#2a2520" opacity="0.3" />
        <line x1="340.5" y1="312" x2="341" y2="310" stroke="#2a2015" strokeWidth="0.3" opacity="0.2" />
        {/* Water flask dropped */}
        <ellipse cx="350" cy="314" rx="1.2" ry="1.8" fill="#1e1a15" opacity="0.25" />
      </g>

      {/* === CAPTURED HABSBURG EAGLE STANDARD — trophy of victory === */}
      <g opacity="0.6" transform="translate(435, 275)">
        {/* Standard pole — tall, leaning against tree */}
        <line x1="0" y1="20" x2="-2" y2="-20" stroke="#3a3520" strokeWidth="1.2" />
        {/* Eagle finial — double-headed Habsburg eagle */}
        <g transform="translate(-2, -22)">
          <circle cx="0" cy="0" r="3" fill="url(#ch8_eagleGold)" />
          {/* Eagle body silhouette */}
          <path d="M0 -1 Q-1.5 -3 -3 -2 Q-1.5 -1 0 0 Q1.5 -1 3 -2 Q1.5 -3 0 -1 Z"
            fill="#5a4a28" opacity="0.6" />
          {/* Eagle heads — two, facing opposite */}
          <circle cx="-2" cy="-2.5" r="0.6" fill="#5a4a28" opacity="0.5" />
          <circle cx="2" cy="-2.5" r="0.6" fill="#5a4a28" opacity="0.5" />
          {/* Crown suggestion */}
          <path d="M-0.8 -3.5 L0 -4.5 L0.8 -3.5" fill="#5a4a28" opacity="0.4" />
        </g>
        {/* Tattered Austrian regimental colours hanging from pole */}
        <path d="M-2 -18 Q3 -16 6 -18 Q8 -16 10 -17 L10 -10 Q7 -12 4 -10 Q1 -12 -2 -10 Z"
          fill="url(#ch8_austrianFlag)" opacity="0.45">
          <animate attributeName="d"
            values="M-2 -18 Q3 -16 6 -18 Q8 -16 10 -17 L10 -10 Q7 -12 4 -10 Q1 -12 -2 -10 Z;M-2 -18 Q3 -19 6 -17 Q8 -19 10 -17 L10 -10 Q7 -11 4 -12 Q1 -11 -2 -10 Z;M-2 -18 Q3 -16 6 -18 Q8 -16 10 -17 L10 -10 Q7 -12 4 -10 Q1 -12 -2 -10 Z"
            dur="4s" repeatCount="indefinite" />
        </path>
        {/* Yellow stripe on Austrian flag */}
        <path d="M-1 -16 Q3 -15 6 -16 L6 -13 Q3 -14 -1 -13 Z"
          fill="#4a4020" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.15;0.2" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Torn edge of flag — ragged */}
        <path d="M10 -15 Q11 -14.5 10.5 -14 Q11.5 -13 10 -12.5 Q11 -11.5 10 -10.5"
          fill="none" stroke="url(#ch8_austrianFlag)" strokeWidth="0.4" opacity="0.3" />
      </g>

      {/* === SECOND CAPTURED FLAG — torn Austrian colours on the ground === */}
      <g opacity="0.35" transform="translate(298, 305)">
        {/* Broken flag staff */}
        <line x1="0" y1="0" x2="8" y2="-2" stroke="#3a3520" strokeWidth="0.8" />
        {/* Fabric crumpled on ground */}
        <path d="M8 -2 Q12 -4 14 -1 Q12 1 8 0 Z" fill="url(#ch8_austrianFlag)" opacity="0.5">
          <animate attributeName="d"
            values="M8 -2 Q12 -4 14 -1 Q12 1 8 0 Z;M8 -2 Q12 -3 14 -1.5 Q12 0.5 8 0 Z;M8 -2 Q12 -4 14 -1 Q12 1 8 0 Z"
            dur="5s" repeatCount="indefinite" />
        </path>
        {/* Mud-stained trampled section */}
        <ellipse cx="11" cy="0" rx="3" ry="1" fill="#1a1810" opacity="0.15" />
      </g>

      {/* === TETHERED HORSES — resting near the camp === */}
      <g opacity="0.6" transform="translate(555, 276)">
        {/* Tether line between two trees */}
        <path d="M-12 -5 Q0 -3 12 -5" fill="none" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        {/* Horse 1 — standing, head down grazing */}
        <ellipse cx="-6" cy="0" rx="7" ry="4" fill="url(#ch8_horseBrown)" />
        {/* Legs */}
        <line x1="-10" y1="4" x2="-10" y2="12" stroke="#1e1812" strokeWidth="1" />
        <line x1="-8" y1="4" x2="-8.5" y2="12" stroke="#1e1812" strokeWidth="1" />
        <line x1="-3" y1="4" x2="-3" y2="12" stroke="#1e1812" strokeWidth="1" />
        <line x1="-1" y1="4" x2="-0.5" y2="12" stroke="#1e1812" strokeWidth="1" />
        {/* Neck — curved down to graze */}
        <path d="M-12 -2 Q-16 -6 -18 -2 Q-19 0 -18 2" fill="none" stroke="url(#ch8_horseBrown)" strokeWidth="2.5" />
        {/* Head */}
        <ellipse cx="-18" cy="3" rx="2.5" ry="1.5" fill="#2a2018" />
        {/* Ear */}
        <path d="M-19 1.5 L-19.5 -0.5" stroke="#2a2018" strokeWidth="0.6" fill="none" />
        {/* Tail */}
        <path d="M1 -1 Q4 0 3 3" fill="none" stroke="#1a1510" strokeWidth="1" opacity="0.6">
          <animate attributeName="d" values="M1 -1 Q4 0 3 3;M1 -1 Q5 1 4 4;M1 -1 Q4 0 3 3" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Tether rope from head to line */}
        <path d="M-17 2 Q-16 -2 -12 -5" fill="none" stroke="#2a2015" strokeWidth="0.4" opacity="0.3" />

        {/* Horse 2 — standing, head up alert */}
        <ellipse cx="8" cy="1" rx="6" ry="3.5" fill="#1e1510" />
        <line x1="4" y1="4.5" x2="4" y2="11" stroke="#1e1510" strokeWidth="0.9" />
        <line x1="5.5" y1="4.5" x2="5.5" y2="11" stroke="#1e1510" strokeWidth="0.9" />
        <line x1="11" y1="4.5" x2="11" y2="11" stroke="#1e1510" strokeWidth="0.9" />
        <line x1="12.5" y1="4.5" x2="12.5" y2="11" stroke="#1e1510" strokeWidth="0.9" />
        {/* Neck up — alert */}
        <path d="M3 -1 Q0 -8 2 -12" fill="none" stroke="#1e1510" strokeWidth="2" />
        {/* Head */}
        <ellipse cx="2.5" cy="-13" rx="2" ry="1.3" fill="#1e1510" />
        {/* Ears pricked */}
        <path d="M1.5 -14.5 L1 -16.5" stroke="#1e1510" strokeWidth="0.5" fill="none" />
        <path d="M3.5 -14.5 L4 -16.5" stroke="#1e1510" strokeWidth="0.5" fill="none" />
        {/* Tail hanging */}
        <path d="M14 0 Q16 2 15 5" fill="none" stroke="#1a1510" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* === SECOND COOKING FIRE — smaller, with camp pot === */}
      <g transform="translate(260, 310)">
        {/* Fire glow on ground */}
        <ellipse cx="0" cy="0" rx="20" ry="8" fill="url(#ch8_fireGlow2)">
          <animate attributeName="rx" values="20;23;20" dur="2.8s" repeatCount="indefinite" />
        </ellipse>
        {/* Stone ring around fire */}
        <ellipse cx="0" cy="2" rx="6" ry="2.5" fill="none" stroke="#2a2518" strokeWidth="1" opacity="0.35" />
        {/* Fire flames — smaller but visible */}
        <path d="M-2 0 Q-1 -8 0 0" fill="#d89048" opacity="0.65">
          <animate attributeName="d" values="M-2 0 Q-1 -8 0 0;M-2 0 Q0 -9 0 0;M-2 0 Q-1 -8 0 0" dur="0.45s" repeatCount="indefinite" />
        </path>
        <path d="M1 0 Q2 -6 3 0" fill="#c87830" opacity="0.55">
          <animate attributeName="d" values="M1 0 Q2 -6 3 0;M1 0 Q3 -7 3 0;M1 0 Q2 -6 3 0" dur="0.55s" repeatCount="indefinite" />
        </path>
        <path d="M-1 1 Q0 -4 1 1" fill="#b86828" opacity="0.45">
          <animate attributeName="d" values="M-1 1 Q0 -4 1 1;M-1 1 Q1 -5 1 1;M-1 1 Q0 -4 1 1" dur="0.5s" repeatCount="indefinite" />
        </path>
        {/* Cooking pot — iron, suspended on tripod */}
        {/* Tripod legs */}
        <line x1="-5" y1="2" x2="0" y2="-10" stroke="#1a1510" strokeWidth="0.7" opacity="0.5" />
        <line x1="5" y1="2" x2="0" y2="-10" stroke="#1a1510" strokeWidth="0.7" opacity="0.5" />
        <line x1="0" y1="4" x2="0" y2="-10" stroke="#1a1510" strokeWidth="0.7" opacity="0.45" />
        {/* Pot — hanging from tripod apex */}
        <path d="M-3 -6 Q-3.5 -3 0 -2 Q3.5 -3 3 -6 Z" fill="#1a1a20" opacity="0.6" />
        {/* Steam from pot */}
        <path d="M0 -6 Q-1 -10 1 -14" fill="none" stroke="#5a5a60" strokeWidth="0.6" opacity="0.06">
          <animate attributeName="d" values="M0 -6 Q-1 -10 1 -14;M0 -6 Q1 -10 -1 -14;M0 -6 Q-1 -10 1 -14" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Sparks */}
        <circle cx="-1" cy="-5" r="0.4" fill="#e0a060" opacity="0.35">
          <animate attributeName="cy" values="-5;-18;-28" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.12;0" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Smoke column */}
        <path d="M0 -8 Q-2 -20 1 -32" fill="none" stroke="#5a5040" strokeWidth="1.5" opacity="0.05">
          <animate attributeName="d" values="M0 -8 Q-2 -20 1 -32;M0 -8 Q2 -20 -1 -32;M0 -8 Q-2 -20 1 -32" dur="7s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === CAPTURED AUSTRIAN WAGON — overturned on the road === */}
      {/* Wagon body — on its side, white Austrian supply wagon */}
      <rect x="290" y="288" width="16" height="8" rx="1" fill="#3a3828" opacity="0.6"
        transform="rotate(18 298 292)" />
      {/* Wagon side panel detail */}
      <rect x="292" y="290" width="12" height="4" rx="0.5" fill="#4a4535" opacity="0.35"
        transform="rotate(18 298 292)" />
      {/* Wheels in the air — two circles */}
      <circle cx="293" cy="285" r="4" fill="none" stroke="#2a2518" strokeWidth="1.2" opacity="0.55" />
      <circle cx="293" cy="285" r="0.8" fill="#2a2518" opacity="0.45" />
      {/* Spokes */}
      <line x1="293" y1="281" x2="293" y2="289" stroke="#2a2518" strokeWidth="0.4" opacity="0.35" />
      <line x1="289" y1="285" x2="297" y2="285" stroke="#2a2518" strokeWidth="0.4" opacity="0.35" />
      <circle cx="305" cy="283" r="3.5" fill="none" stroke="#2a2518" strokeWidth="1" opacity="0.5" />
      <circle cx="305" cy="283" r="0.7" fill="#2a2518" opacity="0.4" />
      <line x1="305" y1="280" x2="305" y2="287" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      <line x1="302" y1="283" x2="309" y2="283" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
      {/* Scattered contents — small boxes/sacks */}
      <rect x="310" y="296" width="4" height="3" rx="0.5" fill="#3a3520" opacity="0.35" />
      <ellipse cx="286" cy="298" rx="2.5" ry="1.5" fill="#35301e" opacity="0.3" />

      {/* === CAPTURED SUPPLY WAGON (detailed) — being looted by soldiers === */}
      <g opacity="0.65" transform="translate(480, 282)">
        {/* Wagon bed — upright, Austrian white-grey markings */}
        <rect x="-12" y="-6" width="24" height="10" rx="1" fill="#3a3828" />
        {/* White Austrian cross/marking on side panel */}
        <rect x="-4" y="-4" width="8" height="6" rx="0.5" fill="url(#ch8_austrianWhite)" opacity="0.5" />
        <line x1="0" y1="-3" x2="0" y2="1" stroke="#5a5850" strokeWidth="0.6" opacity="0.4" />
        <line x1="-2" y1="-1" x2="2" y2="-1" stroke="#5a5850" strokeWidth="0.6" opacity="0.4" />
        {/* Side board slats */}
        <line x1="-12" y1="-2" x2="12" y2="-2" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
        <line x1="-12" y1="1" x2="12" y2="1" stroke="#2a2518" strokeWidth="0.4" opacity="0.3" />
        {/* Front wheel */}
        <circle cx="-9" cy="6" r="4.5" fill="none" stroke="#2a2518" strokeWidth="1.2" />
        <circle cx="-9" cy="6" r="0.8" fill="#2a2518" />
        <line x1="-9" y1="1.5" x2="-9" y2="10.5" stroke="#2a2518" strokeWidth="0.4" opacity="0.4" />
        <line x1="-13.5" y1="6" x2="-4.5" y2="6" stroke="#2a2518" strokeWidth="0.4" opacity="0.4" />
        <line x1="-12.2" y1="2.8" x2="-5.8" y2="9.2" stroke="#2a2518" strokeWidth="0.3" opacity="0.3" />
        <line x1="-5.8" y1="2.8" x2="-12.2" y2="9.2" stroke="#2a2518" strokeWidth="0.3" opacity="0.3" />
        {/* Rear wheel */}
        <circle cx="9" cy="6" r="4.5" fill="none" stroke="#2a2518" strokeWidth="1.2" />
        <circle cx="9" cy="6" r="0.8" fill="#2a2518" />
        <line x1="9" y1="1.5" x2="9" y2="10.5" stroke="#2a2518" strokeWidth="0.4" opacity="0.4" />
        <line x1="4.5" y1="6" x2="13.5" y2="6" stroke="#2a2518" strokeWidth="0.4" opacity="0.4" />
        {/* Tongue/shaft extending forward */}
        <line x1="-12" y1="2" x2="-20" y2="5" stroke="#2a2518" strokeWidth="1" opacity="0.5" />
        {/* Scattered loot around wagon — barrels, sacks */}
        <ellipse cx="-16" cy="8" rx="2" ry="3" fill="#35301e" opacity="0.4" />
        <rect x="14" y="2" width="3" height="4" rx="0.5" fill="#3a3520" opacity="0.35" />
        <ellipse cx="16" cy="8" rx="2.5" ry="1.5" fill="#35301e" opacity="0.3" />
        {/* Soldier looting — crouched, rummaging */}
        <path d="M5 -4 Q3 -10 5 -14 Q7 -10 7 -4 Z" fill="#121010" opacity="0.7" />
        <circle cx="5.5" cy="-16" r="2.5" fill="#121010" opacity="0.7" />
        {/* Arm reaching into wagon */}
        <path d="M4 -10 Q1 -8 -1 -6" fill="none" stroke="#121010" strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* === CAPTURED AUSTRIAN MUSKETS — stacked near the road === */}
      {/* Musket stack (tepee / pyramid arrangement) */}
      <line x1="315" y1="296" x2="318" y2="274" stroke="#1a1815" strokeWidth="1" opacity="0.55" />
      <line x1="320" y1="296" x2="317" y2="274" stroke="#1a1815" strokeWidth="1" opacity="0.5" />
      <line x1="313" y1="296" x2="317.5" y2="275" stroke="#1a1815" strokeWidth="0.8" opacity="0.45" />
      <line x1="322" y1="296" x2="318" y2="276" stroke="#1a1815" strokeWidth="0.8" opacity="0.45" />
      {/* Bayonet glints at crossing point */}
      <circle cx="317.5" cy="274" r="0.6" fill="#5a5a6a" opacity="0.3" />

      {/* === MULE TRAIN — 3 mules with packs on the road === */}
      {/* Mule 1 — leading, further along road */}
      <g opacity="0.6">
        {/* Body */}
        <ellipse cx="350" cy="295" rx="5" ry="3" fill="#1a1510" />
        {/* Legs */}
        <line x1="347" y1="298" x2="347" y2="303" stroke="#1a1510" strokeWidth="0.8" />
        <line x1="353" y1="298" x2="353" y2="303" stroke="#1a1510" strokeWidth="0.8" />
        {/* Head/neck */}
        <path d="M345 295 Q343 291 342 289" fill="none" stroke="#1a1510" strokeWidth="1.2" />
        <ellipse cx="341" cy="288" rx="1.5" ry="1.2" fill="#1a1510" />
        {/* Pack on back */}
        <rect x="347" y="290" width="6" height="4" rx="1" fill="#35301e" opacity="0.7" />
      </g>
      {/* Mule 2 — middle */}
      <g opacity="0.55">
        <ellipse cx="337" cy="297" rx="4.5" ry="2.8" fill="#1a1510" />
        <line x1="334" y1="300" x2="334" y2="304" stroke="#1a1510" strokeWidth="0.8" />
        <line x1="340" y1="300" x2="340" y2="304" stroke="#1a1510" strokeWidth="0.8" />
        <path d="M333 297 Q331 293 330 291" fill="none" stroke="#1a1510" strokeWidth="1" />
        <ellipse cx="329" cy="290" rx="1.3" ry="1" fill="#1a1510" />
        <rect x="335" y="292" width="5" height="4" rx="1" fill="#35301e" opacity="0.65" />
      </g>
      {/* Mule 3 — trailing, slightly behind */}
      <g opacity="0.45">
        <ellipse cx="325" cy="299" rx="4" ry="2.5" fill="#1a1510" />
        <line x1="322" y1="301" x2="322" y2="305" stroke="#1a1510" strokeWidth="0.7" />
        <line x1="328" y1="301" x2="328" y2="305" stroke="#1a1510" strokeWidth="0.7" />
        <path d="M321 299 Q319 295 318 293" fill="none" stroke="#1a1510" strokeWidth="0.9" />
        <ellipse cx="317" cy="292" rx="1.2" ry="0.9" fill="#1a1510" />
        <rect x="323" y="295" width="4.5" height="3.5" rx="1" fill="#35301e" opacity="0.6" />
      </g>

      {/* === AUSTRIAN PRISONERS — small group being marched along the road === */}
      <g opacity="0.6">
        {/* French escort soldier (behind, with musket) */}
        <path d="M248 285 Q246 277 248 270 Q250 277 252 285 Z" fill="#121010" />
        <circle cx="249" cy="267" r="3" fill="#121010" />
        {/* Musket pointed at prisoners */}
        <line x1="252" y1="270" x2="262" y2="275" stroke="#121010" strokeWidth="0.8" opacity="0.5" />
        {/* Bayonet glint */}
        <circle cx="263" cy="275.5" r="0.4" fill="#5a5a6a" opacity="0.25" />

        {/* Prisoner 1 — white Austrian coat, head bowed */}
        <path d="M258 286 Q256 278 258 272 Q260 278 262 286 Z" fill="url(#ch8_austrianWhite)" />
        <circle cx="259" cy="269" r="2.8" fill="#2a2825" />
        {/* Hands seem bound in front */}
        <path d="M260 276 Q262 278 260 280" fill="none" stroke="#2a2825" strokeWidth="0.8" opacity="0.5" />

        {/* Prisoner 2 — stumbling, slightly hunched */}
        <path d="M266 287 Q264 279 266 273 Q268 279 270 287 Z" fill="url(#ch8_austrianWhite)" />
        <circle cx="267" cy="270" r="2.6" fill="#2a2825" />
        <path d="M268 277 Q270 279 268 281" fill="none" stroke="#2a2825" strokeWidth="0.8" opacity="0.45" />

        {/* Prisoner 3 — shorter, trailing */}
        <path d="M274 288 Q272 281 274 275 Q276 281 278 288 Z" fill="url(#ch8_austrianWhite)" opacity="0.9" />
        <circle cx="275" cy="272" r="2.5" fill="#2a2825" opacity="0.9" />

        {/* Prisoner 4 — limping behind */}
        <path d="M281 289 Q279 282 281 277 Q283 282 284 289 Z" fill="url(#ch8_austrianWhite)" opacity="0.8" />
        <circle cx="282" cy="274" r="2.4" fill="#2a2825" opacity="0.8" />
        {/* Walking stick / leaning */}
        <line x1="284" y1="280" x2="286" y2="290" stroke="#2a2015" strokeWidth="0.6" opacity="0.4" />

        {/* Front escort soldier */}
        <path d="M240 284 Q238 276 240 269 Q242 276 244 284 Z" fill="#121010" opacity="0.55" />
        <circle cx="241" cy="266" r="2.8" fill="#121010" opacity="0.55" />
        <line x1="243" y1="268" x2="247" y2="260" stroke="#121010" strokeWidth="0.8" opacity="0.4" />
      </g>

      {/* === VALLEY FLOOR AUTUMN TREES === */}
      {/* Ground shadow pool under large tree */}
      <ellipse cx="276" cy="290" rx="18" ry="5" fill="url(#ch8_treeShadow)" />
      {/* Tree near road — large, vibrant */}
      <rect x="275" y="250" width="3" height="38" fill="#2a2015" opacity="0.6" />
      {/* Bark texture on trunk */}
      <path d="M275.5 255 Q276.5 257 275.8 260" fill="none" stroke="#1e1810" strokeWidth="0.4" opacity="0.25" />
      <path d="M276.8 265 Q277.5 268 276.5 272" fill="none" stroke="#1e1810" strokeWidth="0.4" opacity="0.22" />
      <path d="M275.8 275 Q277 278 276 282" fill="none" stroke="#1e1810" strokeWidth="0.3" opacity="0.2" />
      {/* Canopy — gently swaying in wind, vibrant autumn */}
      <ellipse cx="276" cy="242" rx="16" ry="12" fill="#b84820" opacity="0.65">
        <animate attributeName="cx" values="276;278;276" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="270" cy="246" rx="10" ry="8" fill="#d06828" opacity="0.5">
        <animate attributeName="cx" values="270;271;270" dur="5.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="283" cy="245" rx="8" ry="7" fill="#a03a10" opacity="0.55">
        <animate attributeName="cx" values="283;285;283" dur="6.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Ground shadow pool under gold tree */}
      <ellipse cx="506" cy="292" rx="16" ry="4" fill="url(#ch8_treeShadow)" />
      {/* Tree — gold tones */}
      <rect x="505" y="255" width="3" height="35" fill="#2a2015" opacity="0.55" />
      {/* Bark texture */}
      <path d="M505.5 260 Q506.5 263 505.8 267" fill="none" stroke="#1e1810" strokeWidth="0.4" opacity="0.22" />
      <path d="M506.5 272 Q507 275 506 280" fill="none" stroke="#1e1810" strokeWidth="0.3" opacity="0.2" />
      {/* Canopy — gently swaying, rich gold */}
      <ellipse cx="506" cy="248" rx="14" ry="10" fill="#c09030" opacity="0.6">
        <animate attributeName="cx" values="506;508;506" dur="5.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="512" cy="250" rx="9" ry="7" fill="#d8a038" opacity="0.45">
        <animate attributeName="cx" values="512;514;512" dur="6.2s" repeatCount="indefinite" />
      </ellipse>

      {/* Bare tree — lost its leaves */}
      <path d="M545 260 Q546 245 548 230" fill="none" stroke="#2a2015" strokeWidth="2" opacity="0.45" />
      <path d="M548 230 Q552 222 555 228" fill="none" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
      <path d="M548 230 Q544 224 542 228" fill="none" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
      <path d="M547 238 Q543 232 541 236" fill="none" stroke="#2a2015" strokeWidth="0.6" opacity="0.3" />
      <path d="M547 238 Q552 234 554 237" fill="none" stroke="#2a2015" strokeWidth="0.6" opacity="0.3" />

      {/* Small red shrub — deep crimson */}
      <ellipse cx="320" cy="282" rx="8" ry="5" fill="#8a2a10" opacity="0.55" />

      {/* === CAMPFIRE — roadside === */}
      <ellipse cx="430" cy="298" rx="30" ry="10" fill="url(#ch8_fireGlow)">
        <animate attributeName="rx" values="30;34;30" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire flames — bright, vivid */}
      <path d="M426 294 Q428 280 430 294" fill="#e0a050" opacity="0.75">
        <animate attributeName="d" values="M426 294 Q428 280 430 294;M426 294 Q429 278 430 294;M426 294 Q428 280 430 294" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M430 294 Q432 282 434 294" fill="#d08838" opacity="0.65">
        <animate attributeName="d" values="M430 294 Q432 282 434 294;M430 294 Q433 280 434 294;M430 294 Q432 282 434 294" dur="0.4s" repeatCount="indefinite" />
      </path>
      <path d="M428 296 Q430 286 432 296" fill="#c07028" opacity="0.55">
        <animate attributeName="d" values="M428 296 Q430 286 432 296;M428 296 Q431 284 432 296;M428 296 Q430 286 432 296" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Fire core — bright yellow-white */}
      <path d="M428 294 Q429 288 430 294" fill="#f0c878" opacity="0.45">
        <animate attributeName="d" values="M428 294 Q429 288 430 294;M428 294 Q430 286 430 294;M428 294 Q429 288 430 294" dur="0.35s" repeatCount="indefinite" />
      </path>
      {/* Fire sparks — bright embers */}
      <circle cx="429" cy="278" r="0.8" fill="#f0c070" opacity="0.7">
        <animate attributeName="cy" values="278;258;240" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.3;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="432" cy="275" r="0.5" fill="#e0b060" opacity="0.6">
        <animate attributeName="cy" values="275;260;248" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cx" values="432;435;434" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.25;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="427" cy="280" r="0.4" fill="#f0b868" opacity="0.5">
        <animate attributeName="cy" values="280;262;245" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="427;424;426" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.8s" repeatCount="indefinite" />
      </circle>
      {/* Smoke from fire — visible column */}
      <path d="M430 278 Q428 260 432 240" fill="none" stroke="#5a5040" strokeWidth="2.5" opacity="0.12">
        <animate attributeName="d" values="M430 278 Q428 260 432 240;M430 278 Q433 260 430 240;M430 278 Q428 260 432 240" dur="6s" repeatCount="indefinite" />
      </path>

      {/* === FLAG BEARER — tricolor planted near the campfire === */}
      {/* Flagpole */}
      <line x1="440" y1="295" x2="440" y2="258" stroke="#2a2015" strokeWidth="1.2" opacity="0.7" />
      {/* Tricolor flag — blue/white/red, gently waving */}
      <path d="M440 258 Q448 260 452 257 Q456 260 458 258 L458 266 Q454 264 450 267 Q446 264 440 266 Z"
        fill="url(#ch8_tricolor)" opacity="0.7">
        <animate attributeName="d"
          values="M440 258 Q448 260 452 257 Q456 260 458 258 L458 266 Q454 264 450 267 Q446 264 440 266 Z;M440 258 Q447 256 452 259 Q456 256 458 258 L458 266 Q454 268 450 265 Q446 268 440 266 Z;M440 258 Q448 260 452 257 Q456 260 458 258 L458 266 Q454 264 450 267 Q446 264 440 266 Z"
          dur="3s" repeatCount="indefinite" />
      </path>
      {/* Pole finial — small sphere */}
      <circle cx="440" cy="257" r="1" fill="#8a7040" opacity="0.5" />

      {/* === SOLDIERS — resting along the road === */}

      {/* Soldier 1 — sitting by fire, warming hands */}
      <path d="M418 290 Q416 282 418 276 Q420 282 422 290 Z"
        fill="#0e0c08" opacity="0.9" />
      <circle cx="419" cy="272" r="4.5" fill="#0e0c08" opacity="0.9" />
      {/* Extended arms toward fire */}
      <path d="M421 278 Q425 282 428 280" fill="none" stroke="#0e0c08" strokeWidth="1.5" opacity="0.7" />

      {/* === FIRELIGHT ON SOLDIER 1 FACE — warm highlight patch === */}
      <circle cx="421" cy="271" r="3" fill="url(#ch8_facelight)" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.4;0.6" dur="1.5s" repeatCount="indefinite" />
      </circle>

      {/* Soldier 2 — sitting opposite side of fire */}
      <path d="M444 288 Q442 280 444 274 Q446 280 448 288 Z"
        fill="#0e0c08" opacity="0.85" />
      <circle cx="445" cy="270" r="4" fill="#0e0c08" opacity="0.85" />
      {/* Arm resting on knee */}
      <path d="M442 280 Q438 284 436 282" fill="none" stroke="#121010" strokeWidth="1.2" opacity="0.5" />

      {/* === FIRELIGHT ON SOLDIER 2 FACE — warm highlight patch === */}
      <circle cx="443" cy="269" r="2.8" fill="url(#ch8_facelight)" opacity="0.55">
        <animate attributeName="opacity" values="0.55;0.35;0.55" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* Soldier 3 — kneeling by river, drinking */}
      <path d="M360 270 Q358 264 360 258 Q362 264 362 270 Z"
        fill="#121010" opacity="0.75" />
      <circle cx="360" cy="255" r="3.5" fill="#121010" opacity="0.75" />
      {/* Arm reaching down to water */}
      <path d="M362 260 Q366 266 368 272" fill="none" stroke="#121010" strokeWidth="1.5" opacity="0.5" />

      {/* Soldier 4 — sitting, checking boots */}
      <path d="M475 288 Q473 280 475 274 Q477 280 479 288 Z"
        fill="#121010" opacity="0.7" />
      <circle cx="476" cy="270" r="4" fill="#121010" opacity="0.7" />
      {/* Leaning forward, looking at foot */}
      <path d="M477 278 Q480 284 484 288" fill="none" stroke="#121010" strokeWidth="1.2" opacity="0.45" />

      {/* === FIRELIGHT ON SOLDIER 4 FACE — dimmer, further from fire === */}
      <circle cx="474" cy="269" r="2.5" fill="url(#ch8_facelight)" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.2;0.35" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Soldier 5 — standing, looking up the valley (the march continues at dawn) */}
      <path d="M500 268 Q498 258 500 248 Q502 242 504 248 L506 268 Q505 278 504 290 L500 290 Z"
        fill="#0a0808" opacity="0.9" />
      <circle cx="502" cy="242" r="5" fill="#0a0808" opacity="0.9" />
      {/* Musket held upright */}
      <line x1="508" y1="240" x2="510" y2="218" stroke="#0a0808" strokeWidth="1.4" opacity="0.7" />

      {/* === FIRELIGHT ON SOLDIER 5 FACE — faint rim light === */}
      <circle cx="500" cy="241" r="3.2" fill="url(#ch8_facelight)" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* === SOLDIER 6 — sleeping, curled on ground near fire === */}
      <g opacity="0.55" transform="translate(448, 296)">
        {/* Body — lying on side, curled */}
        <ellipse cx="0" cy="0" rx="7" ry="2.5" fill="#121010" />
        {/* Head resting on arm */}
        <circle cx="-7" cy="-1" r="2.8" fill="#121010" />
        {/* Blanket draped over */}
        <path d="M-5 -2 Q0 -4 5 -2 Q6 0 5 2 Q0 3 -5 2 Z" fill="#1a1815" opacity="0.6" />
        {/* Knees drawn up */}
        <ellipse cx="6" cy="1" rx="2" ry="2.5" fill="#121010" opacity="0.8" />
      </g>

      {/* === SOLDIER 7 — smoking pipe, sitting on stone === */}
      <g opacity="0.65" transform="translate(410, 280)">
        {/* Sitting body */}
        <path d="M-2 8 Q-3 2 -1 -4 Q1 2 2 8 Z" fill="#121010" />
        <circle cx="0" cy="-7" r="3.5" fill="#121010" />
        {/* Arm holding pipe to mouth */}
        <path d="M2 -2 Q5 -5 4 -7" fill="none" stroke="#121010" strokeWidth="1.2" opacity="0.5" />
        {/* Pipe stem */}
        <line x1="4" y1="-7" x2="8" y2="-8" stroke="#2a2015" strokeWidth="0.5" opacity="0.4" />
        {/* Pipe bowl */}
        <circle cx="8.5" cy="-8.5" r="1" fill="#2a2015" opacity="0.5" />
        {/* Pipe smoke — tiny wisps */}
        <path d="M9 -9.5 Q8 -13 10 -16" fill="none" stroke="#5a5040" strokeWidth="0.4" opacity="0.06">
          <animate attributeName="d" values="M9 -9.5 Q8 -13 10 -16;M9 -9.5 Q10 -13 8 -16;M9 -9.5 Q8 -13 10 -16" dur="4s" repeatCount="indefinite" />
        </path>
        {/* Stone they sit on */}
        <ellipse cx="0" cy="9" rx="5" ry="2" fill="#2a2518" opacity="0.4" />
        {/* Firelight on face */}
        <circle cx="2" cy="-7.5" r="2.5" fill="url(#ch8_facelight)" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.25;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === SOLDIER 8 — writing letter by firelight === */}
      <g opacity="0.55" transform="translate(460, 282)">
        {/* Sitting cross-legged */}
        <path d="M-2 6 Q-3 0 -1 -5 Q1 0 2 6 Z" fill="#121010" />
        <circle cx="0" cy="-8" r="3.2" fill="#121010" />
        {/* Arms forward, holding paper */}
        <path d="M-1 -2 Q-3 0 -5 -1" fill="none" stroke="#121010" strokeWidth="1" opacity="0.5" />
        <path d="M1 -2 Q3 -1 4 -3" fill="none" stroke="#121010" strokeWidth="1" opacity="0.5" />
        {/* Paper in lap — faint light rectangle */}
        <rect x="-3" y="-1" width="5" height="3.5" rx="0.3" fill="#3a3830" opacity="0.35" />
        {/* Crossed legs */}
        <path d="M-3 6 Q0 4 3 6" fill="none" stroke="#121010" strokeWidth="1.5" opacity="0.5" />
      </g>

      {/* === SURGEON TENDING WOUNDED — medical scene near road === */}
      <g opacity="0.55" transform="translate(510, 298)">
        {/* Wounded soldier — seated on ground, leaning back */}
        <path d="M0 0 Q-2 -6 0 -10 Q2 -6 2 0 Z" fill="#121010" />
        <circle cx="0.5" cy="-13" r="3" fill="#121010" />
        {/* Leg extended */}
        <path d="M-1 0 Q2 3 6 4" fill="none" stroke="#121010" strokeWidth="1.5" opacity="0.5" />
        {/* Bandage on arm — pale strip */}
        <path d="M3 -6 Q5 -7 4 -9" fill="none" stroke="url(#ch8_bandage)" strokeWidth="1.5" opacity="0.6" />

        {/* Surgeon — kneeling beside, working */}
        <path d="M-10 0 Q-12 -5 -10 -9 Q-8 -5 -8 0 Z" fill="#121010" opacity="0.7" />
        <circle cx="-10" cy="-12" r="2.8" fill="#121010" opacity="0.7" />
        {/* Arms reaching toward wounded */}
        <path d="M-8 -6 Q-5 -5 -2 -7" fill="none" stroke="#121010" strokeWidth="1" opacity="0.5" />
        {/* Medical bag on ground */}
        <rect x="-14" y="-1" width="4" height="3" rx="0.5" fill="#1a1510" opacity="0.5" />
        {/* Bandage roll beside bag */}
        <ellipse cx="-15.5" cy="3" rx="1" ry="0.8" fill="#3a3830" opacity="0.4" />
      </g>

      {/* === CAMP DOG — lying near the main fire === */}
      <g opacity="0.5" transform="translate(438, 304)">
        {/* Body — curled, resting */}
        <ellipse cx="0" cy="0" rx="4" ry="2" fill="#1a1510" />
        {/* Head on paws */}
        <ellipse cx="-4" cy="-1" rx="2" ry="1.5" fill="#1a1510" />
        {/* Ear */}
        <path d="M-5.5 -2 L-6 -3.5" stroke="#1a1510" strokeWidth="0.6" fill="none" />
        {/* Tail curled */}
        <path d="M4 -0.5 Q5 -2 4.5 -3" fill="none" stroke="#1a1510" strokeWidth="0.8" opacity="0.6" />
        {/* Eye glint — watching the fire */}
        <circle cx="-5" cy="-1.2" r="0.3" fill="#8a7030" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* === LAUNDRY DRYING — shirts hung on line near camp === */}
      <g opacity="0.35" transform="translate(485, 262)">
        {/* Line strung between sticks */}
        <line x1="-12" y1="0" x2="12" y2="0" stroke="#2a2015" strokeWidth="0.4" />
        <line x1="-12" y1="0" x2="-12" y2="8" stroke="#2a2015" strokeWidth="0.5" />
        <line x1="12" y1="0" x2="12" y2="8" stroke="#2a2015" strokeWidth="0.5" />
        {/* Shirt 1 — hanging, slight sway */}
        <path d="M-8 0 L-8 6 Q-6 7 -4 6 L-4 0" fill="#2a2820" opacity="0.6">
          <animate attributeName="d" values="M-8 0 L-8 6 Q-6 7 -4 6 L-4 0;M-8 0 L-8.5 6 Q-6 7.5 -3.5 6 L-4 0;M-8 0 L-8 6 Q-6 7 -4 6 L-4 0" dur="5s" repeatCount="indefinite" />
        </path>
        {/* Shirt 2 */}
        <path d="M2 0 L2 5 Q4 6 6 5 L6 0" fill="#2a2820" opacity="0.55">
          <animate attributeName="d" values="M2 0 L2 5 Q4 6 6 5 L6 0;M2 0 L1.5 5 Q4 6.5 6.5 5 L6 0;M2 0 L2 5 Q4 6 6 5 L6 0" dur="4.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === WOUNDED BEING CARRIED — stretcher between two soldiers === */}
      {/* Stretcher bearer (front) */}
      <path d="M455 270 Q453 264 455 258 Q457 264 457 270 Z"
        fill="#121010" opacity="0.6" />
      <circle cx="455" cy="255" r="3" fill="#121010" opacity="0.6" />
      {/* Stretcher bearer (rear) */}
      <path d="M474 270 Q472 264 474 258 Q476 264 476 270 Z"
        fill="#121010" opacity="0.55" />
      <circle cx="474" cy="255" r="3" fill="#121010" opacity="0.55" />
      {/* Stretcher poles */}
      <line x1="454" y1="260" x2="475" y2="260" stroke="#2a2015" strokeWidth="0.8" opacity="0.5" />
      <line x1="454" y1="263" x2="475" y2="263" stroke="#2a2015" strokeWidth="0.8" opacity="0.5" />
      {/* Wounded soldier on stretcher — lying flat */}
      <ellipse cx="464" cy="258" rx="6" ry="1.5" fill="#1a1510" opacity="0.5" />
      <circle cx="458" cy="257" r="1.5" fill="#1a1510" opacity="0.5" />

      {/* Distant marching column — implied, fading into dusk */}
      <path d="M530 262 Q528 254 530 248 Q532 254 534 262 Z" fill="#121010" opacity="0.4" />
      <circle cx="531" cy="246" r="2.5" fill="#121010" opacity="0.35" />
      <path d="M545 260 Q543 253 545 248 Q547 253 549 260 Z" fill="#121010" opacity="0.3" />
      <circle cx="546" cy="246" r="2" fill="#121010" opacity="0.25" />
      <path d="M558 258 Q556 252 558 248 Q560 252 562 258 Z" fill="#121010" opacity="0.22" />

      {/* === FALLING LEAVES — drifting in dusk air === */}
      {/* Leaf 1 — bright orange, tumbling */}
      <ellipse cx="310" cy="180" rx="2.2" ry="1.1" fill="#c06020" opacity="0.55" transform="rotate(30 310 180)">
        <animate attributeName="cy" values="180;260;340" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="310;320;315" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.55;0.4;0.1" dur="7s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 2 — crimson red, swaying */}
      <ellipse cx="490" cy="160" rx="1.8" ry="0.9" fill="#a02a10" opacity="0.5" transform="rotate(-20 490 160)">
        <animate attributeName="cy" values="160;240;330" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="490;500;494" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.35;0.08" dur="8s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 3 — bright gold, slow drift */}
      <ellipse cx="400" cy="200" rx="2" ry="1" fill="#d0a038" opacity="0.45" transform="rotate(45 400 200)">
        <animate attributeName="cy" values="200;280;370" dur="9s" repeatCount="indefinite" />
        <animate attributeName="cx" values="400;395;402" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.3;0.04" dur="9s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 4 — rust, from left slope */}
      <ellipse cx="240" cy="150" rx="2" ry="1" fill="#b04818" opacity="0.5" transform="rotate(15 240 150)">
        <animate attributeName="cy" values="150;230;320" dur="8.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="240;255;248" dur="8.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.38;0.08" dur="8.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 5 — amber gold, lazily tumbling */}
      <ellipse cx="460" cy="140" rx="2.2" ry="1.1" fill="#d09828" opacity="0.45" transform="rotate(-35 460 140)">
        <animate attributeName="cy" values="140;220;310" dur="10s" repeatCount="indefinite" />
        <animate attributeName="cx" values="460;468;455" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.32;0.06" dur="10s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 6 — deep crimson, fast descent */}
      <ellipse cx="550" cy="130" rx="1.8" ry="0.8" fill="#a01a08" opacity="0.5" transform="rotate(55 550 130)">
        <animate attributeName="cy" values="130;220;310" dur="6.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="550;545;552" dur="6.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.32;0.06" dur="6.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Leaf 7 — burnt sienna, spiraling */}
      <ellipse cx="370" cy="170" rx="1.8" ry="0.9" fill="#9a3818" opacity="0.45" transform="rotate(-50 370 170)">
        <animate attributeName="cy" values="170;255;340" dur="11s" repeatCount="indefinite" />
        <animate attributeName="cx" values="370;380;365" dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.28;0.04" dur="11s" repeatCount="indefinite" />
      </ellipse>

      {/* === BIRDS — distant, silhouette === */}
      <path d="M520 65 Q524 60 528 65" fill="none" stroke="#1a1a25" strokeWidth="0.8" opacity="0.3">
        <animate attributeName="cx" values="520;530;520" dur="12s" repeatCount="indefinite" />
      </path>
      <path d="M535 60 Q538 56 541 60" fill="none" stroke="#1a1a25" strokeWidth="0.7" opacity="0.25" />
      <path d="M510 70 Q513 66 516 70" fill="none" stroke="#1a1a25" strokeWidth="0.6" opacity="0.2" />

      {/* === FOREGROUND SLOPES — dark framing === */}
      <path d="M0 340 Q60 325 130 335 Q180 330 230 340 L230 400 L0 400 Z"
        fill="#121210" />
      <path d="M580 335 Q640 325 700 332 Q750 328 800 335 L800 400 L580 400 Z"
        fill="#121210" />

      {/* === PINE BRANCH FRAMING — foreground left === */}
      <g opacity="0.55">
        {/* Main branch extending from left edge */}
        <path d="M0 348 Q30 340 65 345 Q80 343 95 348"
          fill="none" stroke="#0e1a0a" strokeWidth="2" />
        {/* Needle clusters along the branch */}
        <path d="M15 344 L8 338 M15 344 L12 336 M15 344 L18 337"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.8" />
        <path d="M30 340 L24 334 M30 340 L28 332 M30 340 L34 334"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.8" />
        <path d="M48 342 L42 336 M48 342 L46 333 M48 342 L52 335"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.8" />
        <path d="M65 344 L59 338 M65 344 L63 335 M65 344 L69 337"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.7" />
        <path d="M82 343 L77 337 M82 343 L80 334 M82 343 L86 336"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.7" />
        {/* Downward needles */}
        <path d="M20 346 L16 352 M20 346 L22 353"
          fill="none" stroke="#0e1a0a" strokeWidth="0.6" />
        <path d="M45 344 L41 350 M45 344 L47 351"
          fill="none" stroke="#0e1a0a" strokeWidth="0.6" />
        <path d="M70 346 L66 352 M70 346 L73 352"
          fill="none" stroke="#0e1a0a" strokeWidth="0.6" />
        {/* Pinecone dangling from branch */}
        <ellipse cx="55" cy="348" rx="2" ry="3" fill="#2a2015" opacity="0.7" />
        {/* Pinecone scale texture */}
        <path d="M54 346 Q55 347 56 346" fill="none" stroke="#1e1810" strokeWidth="0.4" opacity="0.5" />
        <path d="M53.5 348 Q55 349 56.5 348" fill="none" stroke="#1e1810" strokeWidth="0.4" opacity="0.5" />
        <path d="M54 350 Q55 351 56 350" fill="none" stroke="#1e1810" strokeWidth="0.4" opacity="0.5" />
      </g>

      {/* === PINE BRANCH FRAMING — foreground right === */}
      <g opacity="0.5">
        {/* Main branch from right edge */}
        <path d="M800 342 Q775 335 745 338 Q730 336 720 340"
          fill="none" stroke="#0e1a0a" strokeWidth="1.8" />
        {/* Needle clusters */}
        <path d="M780 338 L786 332 M780 338 L783 330 M780 338 L776 331"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.7" />
        <path d="M760 336 L766 330 M760 336 L763 328 M760 336 L756 329"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.7" />
        <path d="M740 337 L746 331 M740 337 L743 329 M740 337 L736 330"
          fill="none" stroke="url(#ch8_pineNeedle)" strokeWidth="0.7" />
        {/* Downward needles */}
        <path d="M770 340 L774 346 M770 340 L766 347"
          fill="none" stroke="#0e1a0a" strokeWidth="0.6" />
        <path d="M748 339 L752 345 M748 339 L744 346"
          fill="none" stroke="#0e1a0a" strokeWidth="0.6" />
      </g>

      {/* Foreground autumn foliage — close, warm, rich */}
      <ellipse cx="50" cy="338" rx="18" ry="10" fill="#8a3818" opacity="0.5" />
      <ellipse cx="55" cy="336" rx="10" ry="6" fill="#b04a10" opacity="0.3" />
      <ellipse cx="120" cy="335" rx="14" ry="8" fill="#9a4420" opacity="0.45" />
      <ellipse cx="125" cy="333" rx="8" ry="5" fill="#c06018" opacity="0.25" />
      <ellipse cx="700" cy="332" rx="16" ry="9" fill="#8a3818" opacity="0.45" />
      <ellipse cx="695" cy="330" rx="9" ry="5" fill="#b04a10" opacity="0.25" />
      <ellipse cx="760" cy="335" rx="12" ry="7" fill="#a05520" opacity="0.4" />

      {/* Foreground grass tufts */}
      <path d="M240 340 Q243 332 246 340" fill="none" stroke="#2a2a15" strokeWidth="0.8" opacity="0.3" />
      <path d="M570 338 Q573 330 576 338" fill="none" stroke="#2a2a15" strokeWidth="0.8" opacity="0.3" />

      {/* === TERRAIN ROCKS & GROUND TEXTURE === */}
      {/* Scattered rocks along road edge */}
      <ellipse cx="335" cy="306" rx="2" ry="1.2" fill="#252520" opacity="0.35" />
      <ellipse cx="455" cy="308" rx="1.8" ry="1" fill="#252520" opacity="0.3" />
      <ellipse cx="390" cy="310" rx="2.5" ry="1.5" fill="#252520" opacity="0.3" />
      <ellipse cx="495" cy="306" rx="1.5" ry="0.8" fill="#252520" opacity="0.28" />
      {/* Mud puddle on road */}
      <ellipse cx="360" cy="302" rx="5" ry="1.5" fill="#1a1810" opacity="0.15" />
      {/* Cart ruts in road */}
      <path d="M280 298 Q340 294 400 296 Q440 293 500 296" fill="none" stroke="#25201a" strokeWidth="0.5" opacity="0.12" />
      <path d="M280 302 Q340 298 400 300 Q440 297 500 300" fill="none" stroke="#25201a" strokeWidth="0.5" opacity="0.1" />
      {/* Dried grass patches */}
      <path d="M300 310 Q303 304 306 310" fill="none" stroke="#3a3520" strokeWidth="0.6" opacity="0.2" />
      <path d="M435 312 Q438 306 441 312" fill="none" stroke="#3a3520" strokeWidth="0.6" opacity="0.2" />
      <path d="M530 304 Q533 298 536 304" fill="none" stroke="#3a3520" strokeWidth="0.6" opacity="0.18" />
      {/* Foreground rock cluster */}
      <ellipse cx="170" cy="348" rx="6" ry="3" fill="#1a1a18" opacity="0.4" />
      <ellipse cx="178" cy="350" rx="4" ry="2.5" fill="#1e1e1a" opacity="0.35" />
      <ellipse cx="640" cy="345" rx="5" ry="2.5" fill="#1a1a18" opacity="0.35" />
      {/* Additional grass tufts */}
      <path d="M150 345 Q153 338 156 345" fill="none" stroke="#2a2a15" strokeWidth="0.7" opacity="0.25" />
      <path d="M660 340 Q663 333 666 340" fill="none" stroke="#2a2a15" strokeWidth="0.7" opacity="0.25" />
      <path d="M380 318 Q382 312 384 318" fill="none" stroke="#2a2a15" strokeWidth="0.5" opacity="0.18" />

      {/* === RIVERSIDE STRUCTURE — stone fishing hut / boathouse === */}
      <g opacity="0.4" transform="translate(395, 278)">
        {/* Stone foundation — half in water */}
        <rect x="-5" y="-4" width="10" height="8" fill="#2a2820" />
        <path d="M-5 2 Q0 4 5 2" fill="#253040" opacity="0.2" />
        {/* Low roof */}
        <path d="M-6 -4 L0 -8 L6 -4 Z" fill="#1e1810" />
        {/* Dark doorway */}
        <rect x="-2" y="-2" width="4" height="6" fill="#0e0e12" opacity="0.5" />
        {/* Mooring post */}
        <line x1="7" y1="-2" x2="7" y2="4" stroke="#2a2015" strokeWidth="0.8" opacity="0.35" />
        {/* Coiled rope on post */}
        <ellipse cx="7" cy="-1" rx="1" ry="0.6" fill="#2a2015" opacity="0.25" />
        {/* Fishing net draped to dry */}
        <path d="M-5 -3 Q-8 -2 -10 -4 Q-8 -6 -5 -5" fill="none" stroke="#2a2820" strokeWidth="0.3" opacity="0.2" />
        <path d="M-7 -3 L-8 -5 M-6 -3.5 L-7 -5" fill="none" stroke="#2a2820" strokeWidth="0.2" opacity="0.15" />
      </g>

      {/* === MOUNTAIN STREAM TRIBUTARY — small cascade entering the Brenta === */}
      <g opacity="0.35">
        {/* Stream path from left slope to river */}
        <path d="M215 175 Q230 185 250 195 Q270 210 290 220 Q310 232 330 240"
          fill="none" stroke="#304050" strokeWidth="2" strokeLinecap="round" />
        {/* Foam at confluence with river */}
        <circle cx="330" cy="240" r="2" fill="#6a7a8a" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.06;0.15" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Small cascade step */}
        <path d="M248 194 Q252 192 255 195" fill="none" stroke="#5a6a7a" strokeWidth="0.5" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1.2s" repeatCount="indefinite" />
        </path>
        {/* Mossy rocks at stream edge */}
        <ellipse cx="240" cy="192" rx="2" ry="1.2" fill="#1a2a15" opacity="0.3" />
        <ellipse cx="260" cy="205" rx="1.8" ry="1" fill="#1e2a18" opacity="0.25" />
      </g>

      {/* === ADDITIONAL FOREGROUND ROCK DETAIL — angular Alpine stones === */}
      <g opacity="0.35">
        {/* Angular rock — left foreground */}
        <polygon points="190,345 198,338 206,342 202,350 192,348" fill="#1a1a20" />
        <line x1="194" y1="343" x2="202" y2="341" stroke="#222230" strokeWidth="0.4" opacity="0.25" />
        {/* Angular rock — right foreground */}
        <polygon points="620,340 628,334 634,339 630,346 622,344" fill="#1a1a20" />
        <line x1="624" y1="338" x2="632" y2="336" stroke="#222230" strokeWidth="0.4" opacity="0.25" />
        {/* Scattered gravel patches */}
        <circle cx="250" cy="345" r="0.6" fill="#1e1e20" opacity="0.3" />
        <circle cx="252" cy="347" r="0.4" fill="#1e1e20" opacity="0.25" />
        <circle cx="254" cy="344" r="0.5" fill="#1e1e20" opacity="0.28" />
        <circle cx="580" cy="342" r="0.5" fill="#1e1e20" opacity="0.25" />
        <circle cx="583" cy="340" r="0.4" fill="#1e1e20" opacity="0.2" />
        <circle cx="582" cy="344" r="0.6" fill="#1e1e20" opacity="0.22" />
      </g>

      {/* === EVENING FIREFLIES — near riverbank, warm amber points === */}
      <circle cx="340" cy="270" r="3" fill="url(#ch8_firefly)">
        <animate attributeName="opacity" values="0;0.5;0.8;0.5;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="340;344;342;338;340" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="270;266;268;272;270" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="355" cy="258" r="2.5" fill="url(#ch8_firefly)">
        <animate attributeName="opacity" values="0.3;0;0;0.6;0.3" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="355;358;356;352;355" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="258;254;257;260;258" dur="6.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="375" cy="290" r="2" fill="url(#ch8_firefly)">
        <animate attributeName="opacity" values="0;0;0.4;0.7;0" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="375;378;376;373;375" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="290;287;289;292;290" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="365" cy="310" r="2.5" fill="url(#ch8_firefly)">
        <animate attributeName="opacity" values="0.5;0;0;0;0.5" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="365;362;367;368;365" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="310;307;312;314;310" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* === WIND-ANIMATED GRASS TUFTS — swaying in valley breeze === */}
      <path d="M260 338 Q263 330 266 338" fill="none" stroke="#2a2a15" strokeWidth="0.8" opacity="0.25">
        <animate attributeName="d" values="M260 338 Q263 330 266 338;M260 338 Q264 329 266 338;M260 338 Q263 330 266 338" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M380 316 Q382 310 384 316" fill="none" stroke="#2a2a15" strokeWidth="0.6" opacity="0.2">
        <animate attributeName="d" values="M380 316 Q382 310 384 316;M380 316 Q383 309 384 316;M380 316 Q382 310 384 316" dur="3.5s" repeatCount="indefinite" />
      </path>
      <path d="M500 310 Q503 303 506 310" fill="none" stroke="#2a2a15" strokeWidth="0.7" opacity="0.22">
        <animate attributeName="d" values="M500 310 Q503 303 506 310;M500 310 Q504 302 506 310;M500 310 Q503 303 506 310" dur="2.8s" repeatCount="indefinite" />
      </path>
      <path d="M440 316 Q442 310 444 316" fill="none" stroke="#2a2a15" strokeWidth="0.6" opacity="0.18">
        <animate attributeName="d" values="M440 316 Q442 310 444 316;M440 316 Q443 309 444 316;M440 316 Q442 310 444 316" dur="4s" repeatCount="indefinite" />
      </path>

      {/* === ADDITIONAL FALLING LEAVES — more variety, staggered timing === */}
      {/* Leaf 8 — copper, rapid tumble */}
      <ellipse cx="290" cy="165" rx="1.6" ry="0.8" fill="#a04818" opacity="0.45" transform="rotate(70 290 165)">
        <animate attributeName="cy" values="165;240;320;400" dur="6s" repeatCount="indefinite" />
        <animate attributeName="cx" values="290;298;292;300" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.35;0.18;0" dur="6s" repeatCount="indefinite" />
      </ellipse>
      {/* Leaf 9 — bright golden, wide sway */}
      <ellipse cx="520" cy="150" rx="2.2" ry="1" fill="#d0a030" opacity="0.42" transform="rotate(-25 520 150)">
        <animate attributeName="cy" values="150;230;320;400" dur="11s" repeatCount="indefinite" />
        <animate attributeName="cx" values="520;510;525;515" dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.42;0.32;0.16;0" dur="11s" repeatCount="indefinite" />
      </ellipse>
      {/* Leaf 10 — deep crimson, slow spiral */}
      <ellipse cx="430" cy="175" rx="1.8" ry="0.9" fill="#8a1a08" opacity="0.45" transform="rotate(60 430 175)">
        <animate attributeName="cy" values="175;255;345;400" dur="12s" repeatCount="indefinite" />
        <animate attributeName="cx" values="430;425;435;428" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.32;0.14;0" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Leaf 11 — burnt sienna, drifting from right slope */}
      <ellipse cx="580" cy="145" rx="2" ry="1" fill="#b84818" opacity="0.45" transform="rotate(-40 580 145)">
        <animate attributeName="cy" values="145;225;310;400" dur="10s" repeatCount="indefinite" />
        <animate attributeName="cx" values="580;572;578;570" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.32;0.14;0" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Leaf 12 — pale gold, fluttering down near fire */}
      <ellipse cx="445" cy="190" rx="1.7" ry="0.8" fill="#d0a040" opacity="0.4" transform="rotate(40 445 190)">
        <animate attributeName="cy" values="190;260;340;400" dur="9s" repeatCount="indefinite" />
        <animate attributeName="cx" values="445;440;448;442" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.3;0.12;0" dur="9s" repeatCount="indefinite" />
      </ellipse>

      {/* === FOREGROUND WILDFLOWERS — late-season alpine blooms === */}
      {/* Purple alpine asters — left foreground */}
      <g opacity="0.35" transform="translate(80, 342)">
        <circle cx="0" cy="0" r="1.5" fill="url(#ch8_wildflower)" />
        <circle cx="0" cy="0" r="0.4" fill="#8a7a40" opacity="0.4" />
        <line x1="0" y1="1.5" x2="0" y2="6" stroke="#2a3a15" strokeWidth="0.4" opacity="0.3" />
      </g>
      <g opacity="0.3" transform="translate(88, 345)">
        <circle cx="0" cy="0" r="1.2" fill="url(#ch8_wildflower)" />
        <circle cx="0" cy="0" r="0.35" fill="#8a7a40" opacity="0.35" />
        <line x1="0" y1="1.2" x2="0" y2="5" stroke="#2a3a15" strokeWidth="0.3" opacity="0.25" />
      </g>
      {/* Right foreground wildflowers */}
      <g opacity="0.3" transform="translate(680, 338)">
        <circle cx="0" cy="0" r="1.3" fill="url(#ch8_wildflower)" />
        <circle cx="0" cy="0" r="0.35" fill="#8a7a40" opacity="0.35" />
        <line x1="0" y1="1.3" x2="0" y2="5.5" stroke="#2a3a15" strokeWidth="0.3" opacity="0.25" />
      </g>
      <g opacity="0.25" transform="translate(690, 340)">
        <circle cx="0" cy="0" r="1" fill="url(#ch8_wildflower)" />
        <circle cx="0" cy="0" r="0.3" fill="#8a7a40" opacity="0.3" />
        <line x1="0" y1="1" x2="0.3" y2="4" stroke="#2a3a15" strokeWidth="0.3" opacity="0.2" />
      </g>

      {/* === FOREGROUND MUSHROOM CLUSTER — autumn detail on left slope === */}
      <g opacity="0.3" transform="translate(135, 348)">
        {/* Cap 1 */}
        <ellipse cx="0" cy="0" rx="2" ry="1" fill="#4a3020" />
        <line x1="0" y1="1" x2="0" y2="3" stroke="#3a2818" strokeWidth="0.5" />
        {/* Cap 2 — smaller */}
        <ellipse cx="3" cy="1" rx="1.5" ry="0.8" fill="#4a3020" opacity="0.8" />
        <line x1="3" y1="1.8" x2="3" y2="3.5" stroke="#3a2818" strokeWidth="0.4" />
        {/* Cap 3 — tiny */}
        <ellipse cx="-1.5" cy="1.5" rx="1" ry="0.5" fill="#4a3020" opacity="0.6" />
        <line x1="-1.5" y1="2" x2="-1.5" y2="3" stroke="#3a2818" strokeWidth="0.3" />
      </g>

      {/* === DUSK SKY COLOUR BAND — warm stripe at horizon behind mountains === */}
      <path d="M270 130 Q350 122 400 125 Q450 122 540 130"
        fill="none" stroke="#a05830" strokeWidth="2.5" opacity="0.15" />
      <path d="M260 125 Q350 115 400 118 Q450 115 550 125"
        fill="none" stroke="#c06828" strokeWidth="1.5" opacity="0.08" />

      {/* === WARM/COOL COLOUR CONTRAST — ambient light layers === */}
      {/* Cool blue wash on upper scene (sky reflected onto landscape) */}
      <rect x="0" y="0" width="800" height="180" fill="#2a3550" opacity="0.04" />
      {/* Warm amber wash on lower scene (fire and dusk) */}
      <rect x="0" y="220" width="800" height="180" fill="#6a4020" opacity="0.04" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Warm dusk tint */}
      <rect width="800" height="400" fill="#5a3820" opacity="0.05" />

      {/* Vignette — warm-toned */}
      <rect width="800" height="400" fill="url(#ch8_vignette)" />

      {/* Top/bottom darkening */}
      <rect x="0" y="0" width="800" height="18" fill="#0e0e15" opacity="0.3" />
      <rect x="0" y="380" width="800" height="20" fill="#0a0808" opacity="0.4" />
    </svg>
  );
}
