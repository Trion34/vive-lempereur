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
 *
 * Enhanced v2: Comprehensive visual expansion to match other scene files.
 * Added: Dawn sky detail (clouds, additional stars, twinkling effects, Venus morning star,
 * sun pillar, atmospheric refraction bands, cold blue wash on western sky, cirrus wisps).
 * Adige river gorge (valley floor, river with ice, valley mist, cliff edge with snow cornices).
 * Austrian forces (3 marching columns with individual soldiers, mounted officers, Habsburg flags,
 * 2 Austrian batteries with flashes, formation dust, musket volley flash ripples).
 * French battle lines (2 formations with individual soldiers, bayonets with dawn glint,
 * breath vapor, volley smoke band). Staff officers flanking Napoleon (2 mounted, 1 aide).
 * Additional artillery (3rd cannon with crew, gabion earthworks, powder kegs, frost on barrels).
 * Expanded camp (7 tents + officer's tent with stovepipe, 5 campfires, horse lines, drummer boy,
 * ammunition wagon with draft horse, pack mule, supply train, cooking pot, lantern, drums,
 * regimental eagle, dispatch case, rope coils, scattered straw, charred wood).
 * Vegetation (4 snow-laden pines, 4 bare deciduous trees with frost/icicles/snow on branches,
 * frosted bushes, dead grass tufts, mountain tree line detail, distant Alpine village).
 * Soldiers (sentry at cliff edge, officer reading dispatch, cavalry patrol, walking soldiers,
 * sitting/eating soldier, kneeling/cleaning soldier, foreground crouching soldier with detail,
 * prone soldier at cliff edge, soldiers carrying firewood). Casualties (wounded against rock,
 * dead soldier face-down, wounded being helped to walk, stretcher bearers, field cemetery crosses).
 * Atmospheric (8 falling snowflakes, 2 blowing snow layers, crows circling + perched on tree,
 * smoke columns rising from valley, campfire smoke wisps and embers, battlefield haze bands,
 * ground shadow from clouds, snow whirl, snow cornices, frost crystal patterns on rocks).
 * Foreground detail (multiple boot track trails, cannon wheel ruts, frozen puddles, scattered
 * equipment, spent cartridge paper, pebble scatter, sastrugi wind ridges, exposed frozen earth,
 * ground contour lines, icicles on rocks, additional rocks with snow caps).
 * Atmospheric overlays (cold blue wash, warm dawn tint, powder smoke haze, top/bottom darkening).
 *
 * Enhanced v3: Additional visual depth and historical painting quality.
 * Dawn sky: lavender transition band, deep rose atmospheric refraction, faint aurora suggestion,
 * zodiacal light, turquoise upper-atmosphere band, lenticular cloud, altocumulus patch,
 * heavy dawn-lit cloud bank, mare's tail wisps.
 * Mountains: couloirs (snow gullies), glacial cirque, rock strata lines, corniche overhangs,
 * bergschrund crevasses, spindrift plume animating off peak.
 * Napoleon vignette: brass telescope with lens glint, horse tack detail (saddle, bridle, reins,
 * stirrups, shabraque, mane), gold epaulettes with red sash, map table with parchment/weights/
 * lantern, second aide-de-camp at attention.
 * Military: 4th cannon with crew/frost/limber, artillery limber with horse team pole, 3rd French
 * reserve formation, supply depot (stacked crates, barrel), French volley flash ripple animation,
 * 6th campfire with soldiers, soldiers carrying barrel, lookout on rock.
 * Winter: frost crystal pattern overlay, 8 snow sparkle animations, icicles on tents/cannons/wagon,
 * frozen puddle dawn reflections, tent guy ropes with frost, additional wheel/caisson tracks.
 * Foreground: distant Alpine hut on slope.
 * New gradients/filters: aurora, rose band, lavender sky, telescope brass, parchment, leather,
 * gold trim, glacier blue, lantern warm, iron tire, volley flash, couloir, sparkle, distant blur,
 * frost crystal pattern.
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
        {/* Adige river gorge — deep blue-green valley water */}
        <linearGradient id="ch11_adigeWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4858" />
          <stop offset="40%" stopColor="#2a3848" />
          <stop offset="100%" stopColor="#1a2838" />
        </linearGradient>
        {/* Valley floor — dark terrain below plateau */}
        <linearGradient id="ch11_valleyFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3040" />
          <stop offset="50%" stopColor="#222838" />
          <stop offset="100%" stopColor="#1a2030" />
        </linearGradient>
        {/* Valley mist — thick fog filling the gorge */}
        <linearGradient id="ch11_valleyMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8090" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#6a7080" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#5a6070" stopOpacity="0.08" />
        </linearGradient>
        {/* Austrian white uniforms — distant column */}
        <linearGradient id="ch11_austrianWhite" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8a80" />
          <stop offset="100%" stopColor="#6a6a60" />
        </linearGradient>
        {/* Austrian flag — Habsburg double eagle standard */}
        <linearGradient id="ch11_austrianFlag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8c838" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#c8b828" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b8a820" stopOpacity="0.4" />
        </linearGradient>
        {/* French blue coat — dark blue of line infantry */}
        <linearGradient id="ch11_frenchBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2848" />
          <stop offset="100%" stopColor="#121838" />
        </linearGradient>
        {/* Plateau edge — rocky cliff face */}
        <linearGradient id="ch11_cliffFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4848" />
          <stop offset="30%" stopColor="#3a3838" />
          <stop offset="70%" stopColor="#2a2828" />
          <stop offset="100%" stopColor="#1a1818" />
        </linearGradient>
        {/* Musket volley smoke — thin line from formation */}
        <linearGradient id="ch11_volleySmoke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a0a8b0" stopOpacity="0" />
          <stop offset="30%" stopColor="#a0a8b0" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#a0a8b0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a0a8b0" stopOpacity="0" />
        </linearGradient>
        {/* Bare tree trunk — dark brown, leafless winter */}
        <linearGradient id="ch11_bareTrunk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3028" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>
        {/* Frozen earth — exposed ground through snow */}
        <linearGradient id="ch11_frozenEarth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4840" />
          <stop offset="100%" stopColor="#3a3830" />
        </linearGradient>
        {/* Cannon smoke column — thick rising plume */}
        <linearGradient id="ch11_smokeColumn" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8a9098" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#7a8088" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#6a7078" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#5a6068" stopOpacity="0" />
        </linearGradient>
        {/* Warm firelight on snow — orange tint on nearby ground */}
        <radialGradient id="ch11_fireOnSnow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#a06830" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#805020" stopOpacity="0" />
        </radialGradient>
        {/* Horse blanket — dark wool */}
        <linearGradient id="ch11_horseBlanket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2838" />
          <stop offset="100%" stopColor="#1a1828" />
        </linearGradient>
        {/* Staff officer cloak — dark grey-blue */}
        <linearGradient id="ch11_officerCloak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3040" />
          <stop offset="100%" stopColor="#1a2030" />
        </linearGradient>
        {/* Cloud dark underside */}
        <radialGradient id="ch11_cloudDark" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#28303c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#28303c" stopOpacity="0" />
        </radialGradient>
        {/* Cloud lit from dawn below */}
        <radialGradient id="ch11_cloudLit" cx="0.5" cy="0.8" r="0.6">
          <stop offset="0%" stopColor="#a07040" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#806030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#604820" stopOpacity="0.05" />
        </radialGradient>
        {/* Icicle shimmer */}
        <linearGradient id="ch11_icicle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8d8e8" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#a8b8c8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8898a8" stopOpacity="0.2" />
        </linearGradient>
        {/* Powder keg wood */}
        <linearGradient id="ch11_kegWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3020" />
          <stop offset="100%" stopColor="#2a2015" />
        </linearGradient>
        {/* Frost on metal — icy sheen on cannon barrels */}
        <linearGradient id="ch11_frostMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b8c8d8" stopOpacity="0" />
          <stop offset="50%" stopColor="#b8c8d8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#b8c8d8" stopOpacity="0" />
        </linearGradient>
        {/* Gabion basket — woven wicker filled with earth */}
        <linearGradient id="ch11_gabion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4030" />
          <stop offset="100%" stopColor="#3a3020" />
        </linearGradient>
        {/* Dawn cold tint — blue wash on western sky */}
        <linearGradient id="ch11_coldWash" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2040" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#1a2040" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#1a2040" stopOpacity="0" />
        </linearGradient>
        {/* Smoke blur filter */}
        <filter id="ch11_smokeBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        {/* Distant formation haze */}
        <linearGradient id="ch11_formationHaze" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#6a7080" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#5a6070" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#5a6070" stopOpacity="0" />
        </linearGradient>
        {/* Snowy ground shadow — blue-purple undertone */}
        <linearGradient id="ch11_snowGroundShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4058" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2a3048" stopOpacity="0.08" />
        </linearGradient>
        {/* ===== ENHANCED v3 GRADIENTS ===== */}
        {/* Aurora suggestion — faint green-blue band in northern sky */}
        <linearGradient id="ch11_aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a5040" stopOpacity="0" />
          <stop offset="15%" stopColor="#2a6050" stopOpacity="0.04" />
          <stop offset="35%" stopColor="#306848" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#285838" stopOpacity="0.04" />
          <stop offset="70%" stopColor="#306050" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#2a5040" stopOpacity="0" />
        </linearGradient>
        {/* Deep rose dawn band — lower atmosphere refraction */}
        <linearGradient id="ch11_roseBand" x1="0.2" y1="0" x2="0.8" y2="0">
          <stop offset="0%" stopColor="#6a2838" stopOpacity="0" />
          <stop offset="25%" stopColor="#8a3848" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#a04858" stopOpacity="0.08" />
          <stop offset="75%" stopColor="#8a3848" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#6a2838" stopOpacity="0" />
        </linearGradient>
        {/* Lavender dawn layer — purple transition between night and warm horizon */}
        <linearGradient id="ch11_lavenderSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1838" stopOpacity="0" />
          <stop offset="40%" stopColor="#4a2858" stopOpacity="0.05" />
          <stop offset="70%" stopColor="#5a3060" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#4a2848" stopOpacity="0" />
        </linearGradient>
        {/* Telescope brass — glinting metal */}
        <linearGradient id="ch11_telescope" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a7030" />
          <stop offset="30%" stopColor="#a88838" />
          <stop offset="60%" stopColor="#c8a048" />
          <stop offset="100%" stopColor="#8a7030" />
        </linearGradient>
        {/* Map/parchment surface — warm cream */}
        <radialGradient id="ch11_parchment" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d8c8a0" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#c0b088" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a89870" stopOpacity="0.3" />
        </radialGradient>
        {/* Horse leather tack — saddle/bridle brown */}
        <linearGradient id="ch11_leather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3020" />
          <stop offset="100%" stopColor="#2a1810" />
        </linearGradient>
        {/* Gold trim — officer epaulettes, eagle details */}
        <linearGradient id="ch11_goldTrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a08028" />
          <stop offset="50%" stopColor="#d0a840" />
          <stop offset="100%" stopColor="#a08028" />
        </linearGradient>
        {/* Glacier blue — exposed ice in mountain crevasses */}
        <linearGradient id="ch11_glacierBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6888a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#486888" stopOpacity="0.2" />
        </linearGradient>
        {/* Warm lantern glow — for map table */}
        <radialGradient id="ch11_lanternWarm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d8a050" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#c08838" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a07028" stopOpacity="0" />
        </radialGradient>
        {/* Cannon wheel iron tire — dark iron rim */}
        <linearGradient id="ch11_ironTire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        {/* Musket volley flash — bright ripple from French line firing */}
        <radialGradient id="ch11_volleyFlash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f0c860" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#d8a848" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b08830" stopOpacity="0" />
        </radialGradient>
        {/* Mountain couloir shadow — deep crevice darkness */}
        <linearGradient id="ch11_couloir" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1828" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0a0818" stopOpacity="0.6" />
        </linearGradient>
        {/* Snow crystal sparkle — individual ice crystal catch of dawn */}
        <radialGradient id="ch11_sparkle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f8f0e0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e8e0d0" stopOpacity="0" />
        </radialGradient>
        {/* Soft blur for distant elements */}
        <filter id="ch11_distantBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        {/* Frost texture — fine crystalline pattern on surfaces */}
        <pattern id="ch11_frostCrystal" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M8 0 L8 16" stroke="#c8d8e8" strokeWidth="0.15" opacity="0.08" />
          <path d="M0 8 L16 8" stroke="#c8d8e8" strokeWidth="0.15" opacity="0.08" />
          <path d="M0 0 L16 16" stroke="#c8d8e8" strokeWidth="0.1" opacity="0.06" />
          <path d="M16 0 L0 16" stroke="#c8d8e8" strokeWidth="0.1" opacity="0.06" />
          <path d="M4 0 L4 16" stroke="#d0e0f0" strokeWidth="0.08" opacity="0.04" />
          <path d="M12 0 L12 16" stroke="#d0e0f0" strokeWidth="0.08" opacity="0.04" />
        </pattern>
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
      {/* Additional faint stars — scattered across western sky */}
      <circle cx="55" cy="58" r="0.6" fill="#c8d0e0" opacity="0.45" />
      <circle cx="145" cy="32" r="0.5" fill="#c0c8d8" opacity="0.38" />
      <circle cx="265" cy="42" r="0.4" fill="#b8c0d0" opacity="0.28" />
      <circle cx="195" cy="62" r="0.7" fill="#c8d0e0" opacity="0.35" />
      <circle cx="105" cy="18" r="0.9" fill="#d0d8e8" opacity="0.5" />
      <circle cx="330" cy="55" r="0.3" fill="#b0b8c8" opacity="0.18" />
      <circle cx="15" cy="42" r="0.7" fill="#c8d0e0" opacity="0.42" />
      <circle cx="240" cy="25" r="0.55" fill="#c0c8d8" opacity="0.32" />
      {/* Twinkling star effect — subtle brightness pulse */}
      <circle cx="45" cy="22" r="1.2" fill="#e0e8f0" opacity="0">
        <animate attributeName="opacity" values="0;0.3;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="15" r="1.0" fill="#e0e8f0" opacity="0">
        <animate attributeName="opacity" values="0;0.25;0" dur="5s" repeatCount="indefinite" begin="1.5s" />
      </circle>
      <circle cx="70" cy="48" r="1.1" fill="#e0e8f0" opacity="0">
        <animate attributeName="opacity" values="0;0.2;0" dur="6s" repeatCount="indefinite" begin="3s" />
      </circle>

      {/* Cold blue wash on western sky — contrast with warm dawn */}
      <rect x="0" y="0" width="400" height="200" fill="url(#ch11_coldWash)" />

      {/* ===== ENHANCED SKY LAYERS — additional dawn color bands ===== */}
      {/* Lavender transition band — purple zone between night blue and warm horizon */}
      <rect x="0" y="100" width="800" height="90" fill="url(#ch11_lavenderSky)" />
      {/* Deep rose band — atmospheric refraction near horizon */}
      <rect x="0" y="175" width="800" height="40" fill="url(#ch11_roseBand)" />
      {/* Faint aurora suggestion — rare but possible at Alpine latitudes in winter */}
      <rect x="0" y="10" width="800" height="60" fill="url(#ch11_aurora)">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="20s" repeatCount="indefinite" />
      </rect>
      {/* Zodiacal light — faint triangular glow extending from dawn point */}
      <polygon points="580,205 560,120 640,120 660,205" fill="#d8a060" opacity="0.015" />
      {/* Upper atmosphere color band — deep turquoise at the night/dawn boundary */}
      <rect x="300" y="80" width="500" height="30" fill="#185058" opacity="0.03" />

      {/* ===== WINTER CLOUDS — dark masses catching dawn light from below ===== */}
      {/* Large cloud bank — center-left, dark top, warm-lit underside */}
      <g>
        <ellipse cx="280" cy="55" rx="80" ry="25" fill="url(#ch11_cloudDark)" />
        <ellipse cx="275" cy="62" rx="70" ry="16" fill="url(#ch11_cloudLit)" />
        <ellipse cx="260" cy="48" rx="40" ry="16" fill="#28303c" opacity="0.2" />
        <ellipse cx="300" cy="52" rx="35" ry="14" fill="#28303c" opacity="0.15" />
        <ellipse cx="275" cy="72" rx="50" ry="5" fill="#a07040" opacity="0.06" />
      </g>
      {/* Smaller cloud — far right, catching more dawn light */}
      <g>
        <ellipse cx="680" cy="45" rx="50" ry="18" fill="url(#ch11_cloudDark)" />
        <ellipse cx="685" cy="52" rx="42" ry="12" fill="url(#ch11_cloudLit)" />
        <ellipse cx="670" cy="38" rx="28" ry="12" fill="#28303c" opacity="0.18" />
        <ellipse cx="685" cy="58" rx="30" ry="4" fill="#c08848" opacity="0.08" />
      </g>
      {/* Wispy cloud — far left */}
      <ellipse cx="60" cy="68" rx="35" ry="10" fill="url(#ch11_cloudDark)" />
      <ellipse cx="65" cy="73" rx="28" ry="6" fill="url(#ch11_cloudLit)" />
      {/* High thin cirrus — streaked across mid-sky */}
      <path d="M150 28 Q220 24 300 30 Q380 26 460 32" fill="none" stroke="#3a4050" strokeWidth="1.2" opacity="0.15" />
      <path d="M400 18 Q480 14 560 20 Q640 16 720 22" fill="none" stroke="#3a4050" strokeWidth="0.8" opacity="0.12" />
      <path d="M500 32 Q560 28 620 34 Q680 30 740 36" fill="none" stroke="#4a4840" strokeWidth="0.6" opacity="0.1" />
      {/* Fractus clouds — ragged low wisps drifting */}
      <ellipse cx="450" cy="95" rx="35" ry="5" fill="#3a4050" opacity="0.08">
        <animate attributeName="cx" values="450;462;450" dur="22s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="160" cy="88" rx="25" ry="4" fill="#2a3040" opacity="0.06">
        <animate attributeName="cx" values="160;170;160" dur="18s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ADDITIONAL CLOUD FORMATIONS — lenticular and altocumulus ===== */}
      {/* Lenticular cloud — characteristic of mountain regions, lens-shaped */}
      <g opacity="0.12">
        <ellipse cx="550" cy="72" rx="45" ry="8" fill="#38404c" />
        <ellipse cx="550" cy="76" rx="38" ry="4" fill="#906840" opacity="0.2" />
        <ellipse cx="550" cy="68" rx="30" ry="5" fill="#303844" />
      </g>
      {/* Altocumulus patch — small cotton-ball clouds in mid-sky */}
      <g opacity="0.08">
        <ellipse cx="120" cy="50" rx="12" ry="6" fill="#2a3040" />
        <ellipse cx="140" cy="48" rx="10" ry="5" fill="#2a3040" />
        <ellipse cx="155" cy="52" rx="11" ry="5" fill="#28303c" />
        <ellipse cx="130" cy="55" rx="9" ry="4" fill="#a07040" opacity="0.25" />
        <ellipse cx="148" cy="56" rx="8" ry="3.5" fill="#a07040" opacity="0.2" />
      </g>
      {/* Heavy cloud bank on far right — catching strongest dawn light */}
      <g>
        <ellipse cx="760" cy="58" rx="55" ry="20" fill="url(#ch11_cloudDark)" opacity="0.9" />
        <ellipse cx="762" cy="65" rx="48" ry="14" fill="url(#ch11_cloudLit)" opacity="0.9" />
        <ellipse cx="750" cy="50" rx="30" ry="12" fill="#28303c" opacity="0.2" />
        {/* Bright golden underside from dawn — closest to sunrise */}
        <ellipse cx="760" cy="72" rx="40" ry="5" fill="#c08848" opacity="0.1" />
      </g>
      {/* Wispy mare's tail high in sky */}
      <path d="M80 18 Q120 15 160 20 Q190 17 220 22" fill="none" stroke="#3a4050" strokeWidth="0.5" opacity="0.08" />
      <path d="M620 12 Q660 8 700 14 Q730 10 760 16" fill="none" stroke="#4a4840" strokeWidth="0.6" opacity="0.07" />

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
      {/* Fifth sunbeam — far right, thin */}
      <polygon
        points="700,220 710,120 725,120 715,220"
        fill="url(#ch11_sunbeam)"
        opacity="0.25"
      />
      {/* Sixth sunbeam — far left, very faint */}
      <polygon
        points="350,220 352,160 368,160 366,220"
        fill="url(#ch11_sunbeam)"
        opacity="0.15"
      />

      {/* ===== DAWN HORIZON DETAIL — sun about to crest ===== */}
      {/* Bright orange-white crescent — sun's upper limb just appearing */}
      <ellipse cx="640" cy="208" rx="15" ry="4" fill="#f0c878" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.12;0.2" dur="6s" repeatCount="indefinite" />
      </ellipse>
      {/* Sun pillar — vertical column of light above the rising sun */}
      <rect x="635" y="170" width="10" height="35" fill="#d8a060" opacity="0.04" rx="3">
        <animate attributeName="opacity" values="0.04;0.06;0.04" dur="7s" repeatCount="indefinite" />
      </rect>
      {/* Atmospheric refraction bands near horizon */}
      <rect x="400" y="200" width="400" height="3" fill="#e0a860" opacity="0.06" />
      <rect x="450" y="195" width="350" height="2" fill="#d89050" opacity="0.04" />

      {/* ===== MORNING PLANET — Venus as the "morning star" ===== */}
      <circle cx="520" cy="38" r="1.5" fill="#e8e0d0" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="8s" repeatCount="indefinite" />
      </circle>

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

      {/* Mountain ridgeline detail — rock texture on near mountains */}
      <g opacity="0.4">
        {/* Crag detail on left near peak */}
        <path d="M65 224 Q70 220 75 222" fill="none" stroke="#6a7080" strokeWidth="0.5" />
        <path d="M72 221 L74 218 L76 222" fill="none" stroke="#6a7080" strokeWidth="0.4" />
        {/* Rock face on center peak */}
        <path d="M235 218 Q240 215 245 217" fill="none" stroke="#6a7080" strokeWidth="0.5" />
        <path d="M320 242 Q325 238 330 241" fill="none" stroke="#5a6070" strokeWidth="0.4" />
        {/* Sharp crag on right peak */}
        <path d="M415 212 Q420 210 425 213" fill="none" stroke="#6a7080" strokeWidth="0.5" />
        <path d="M418 210 L420 207 L422 211" fill="#7a8090" opacity="0.3" />
      </g>

      {/* Avalanche chute — snow slide scar on mountain face */}
      <g opacity="0.25">
        <path d="M250 220 Q255 235 260 250 Q258 258 262 268"
          fill="none" stroke="#b8c0c8" strokeWidth="2" strokeLinecap="round" />
        <path d="M252 222 Q256 237 258 252"
          fill="none" stroke="#9aa0a8" strokeWidth="1" />
      </g>

      {/* Mountain shadow — dark face away from dawn */}
      <g opacity="0.15">
        <path d="M0 260 L70 220 L150 245 L0 260 Z" fill="#1a1828" />
        <path d="M150 245 L240 215 L320 240 L150 260 Z" fill="#1a1828" />
      </g>

      {/* ===== ENHANCED MOUNTAIN DETAIL — couloirs, glacial features, rock strata ===== */}
      {/* Couloir (snow gully) on prominent peak */}
      <g opacity="0.2">
        <path d="M422 212 Q424 225 420 240 Q422 252 418 262"
          fill="none" stroke="#c0c8d0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M424 215 Q425 228 423 242"
          fill="none" stroke="#a0a8b0" strokeWidth="0.8" />
      </g>
      {/* Glacial cirque — bowl-shaped depression on mountain face */}
      <g opacity="0.18">
        <path d="M150 245 Q160 250 170 245 Q165 255 155 255 Q150 252 150 245 Z"
          fill="#6888a8" opacity="0.3" />
        <ellipse cx="160" cy="250" rx="8" ry="3" fill="#8898a8" opacity="0.15" />
      </g>
      {/* Rock strata lines — visible geological layers on cliff faces */}
      <g opacity="0.12">
        <path d="M55 225 Q65 222 75 226" fill="none" stroke="#5a6070" strokeWidth="0.4" />
        <path d="M58 230 Q68 227 78 231" fill="none" stroke="#5a6070" strokeWidth="0.3" />
        <path d="M230 220 Q240 217 250 221" fill="none" stroke="#5a6070" strokeWidth="0.4" />
        <path d="M233 225 Q243 222 253 226" fill="none" stroke="#5a6070" strokeWidth="0.3" />
        <path d="M405 214 Q415 211 425 215" fill="none" stroke="#5a6070" strokeWidth="0.4" />
      </g>
      {/* Corniche (snow cornice) overhangs on ridgeline */}
      <g opacity="0.25">
        <path d="M68 220 Q72 218 75 221 Q73 223 69 222 Z" fill="#d0d8e0" />
        <path d="M238 215 Q242 213 246 216 Q244 218 240 217 Z" fill="#d0d8e0" />
        <path d="M418 210 Q422 208 426 211 Q424 213 420 212 Z" fill="#d0d8e0" />
        <path d="M598 225 Q602 223 606 226 Q604 228 600 227 Z" fill="#d8dce4" />
      </g>
      {/* Bergschrund — crevasse where glacier pulls away from mountain */}
      <g opacity="0.15">
        <path d="M520 238 Q525 240 530 238" fill="none" stroke="#2a3040" strokeWidth="0.6" />
        <path d="M600 228 Q605 230 610 228" fill="none" stroke="#2a3040" strokeWidth="0.5" />
      </g>
      {/* Windblown snow plume from peak — spindrift */}
      <g opacity="0.12">
        <path d="M420 210 Q430 206 445 208 Q458 210 470 206"
          fill="none" stroke="#c8d0d8" strokeWidth="1.2" strokeLinecap="round">
          <animate attributeName="d"
            values="M420 210 Q430 206 445 208 Q458 210 470 206;
                    M420 210 Q432 204 448 207 Q462 208 475 204;
                    M420 210 Q430 206 445 208 Q458 210 470 206"
            dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.12;0.06;0.12" dur="8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Small mountain pines — tree line detail on distant slopes */}
      <g opacity="0.3">
        <polygon points="165 240 163 248 167 248" fill="#1a2818" />
        <polygon points="172 238 170 246 174 246" fill="#1a2818" />
        <polygon points="178 242 176 249 180 249" fill="#1a2818" />
        <polygon points="430 218 428 225 432 225" fill="#1a2818" />
        <polygon points="438 220 436 227 440 227" fill="#1a2818" />
        <polygon points="550 232 548 239 552 239" fill="#1a2818" />
        <polygon points="556 234 554 240 558 240" fill="#1a2818" />
      </g>

      {/* Dawn mist band at mountain base — alpine fog where peaks meet plateau */}
      <rect x="0" y="255" width="800" height="35" fill="url(#ch11_mountainMist)" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.7;0.9" dur="15s" repeatCount="indefinite" />
      </rect>

      {/* Valley mist — low-lying fog */}
      <rect x="0" y="240" width="800" height="60" fill="url(#ch11_mist)" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.6;0.8" dur="12s" repeatCount="indefinite" />
      </rect>

      {/* ===== ADIGE RIVER GORGE — visible in the valley below the plateau ===== */}
      {/* Valley floor — dark terrain between mountains and plateau edge */}
      <path
        d="M 0,270 Q 100,265 200,268 Q 300,272 400,267 Q 500,263 600,268 Q 700,272 800,268 L 800,285 L 0,285 Z"
        fill="url(#ch11_valleyFloor)"
        opacity="0.7"
      />
      {/* Adige river — snaking through the gorge, partially frozen */}
      <path
        d="M 0,275 Q 80,272 160,276 Q 240,280 320,274 Q 400,270 480,276 Q 560,280 640,274 Q 720,270 800,275"
        fill="none"
        stroke="url(#ch11_adigeWater)"
        strokeWidth="6"
        opacity="0.5"
      />
      {/* Ice on river surface — partial frozen sheen */}
      <path
        d="M 40,275 Q 80,273 120,276"
        fill="none" stroke="#8898a8" strokeWidth="3" opacity="0.15"
      />
      <path
        d="M 280,275 Q 320,273 360,276"
        fill="none" stroke="#8898a8" strokeWidth="2.5" opacity="0.12"
      />
      <path
        d="M 520,276 Q 560,274 600,277"
        fill="none" stroke="#8898a8" strokeWidth="2" opacity="0.1"
      />
      {/* Valley mist filling the gorge — thick fog layer */}
      <path
        d="M 0,268 Q 200,262 400,266 Q 600,270 800,265 L 800,280 L 0,280 Z"
        fill="url(#ch11_valleyMist)"
        opacity="0.6"
      >
        <animate attributeName="opacity" values="0.6;0.4;0.6" dur="18s" repeatCount="indefinite" />
      </path>

      {/* ===== AUSTRIAN COLUMNS — advancing through valley gorges ===== */}
      {/* Distant Austrian column left — white-coated figures in marching formation */}
      <g opacity="0.4">
        {/* Column body — mass of tiny white figures */}
        <rect x="120" y="261" width="40" height="3" fill="url(#ch11_austrianWhite)" rx="1" />
        <rect x="115" y="264" width="45" height="3" fill="url(#ch11_austrianWhite)" rx="1" opacity="0.8" />
        <rect x="110" y="267" width="50" height="3" fill="url(#ch11_austrianWhite)" rx="1" opacity="0.6" />
        {/* Individual soldiers visible at front */}
        <ellipse cx="118" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="122" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="126" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="130" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="134" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="138" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="142" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="146" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="150" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        <ellipse cx="154" cy="260" rx="1" ry="2.5" fill="#8a8a80" />
        {/* Austrian flag in column */}
        <rect x="136" y="254" width="1" height="6" fill="#3a3028" opacity="0.6" />
        <rect x="137" y="254" width="5" height="3" fill="url(#ch11_austrianFlag)" opacity="0.5">
          <animate attributeName="width" values="5;6;5" dur="3s" repeatCount="indefinite" />
        </rect>
        {/* Dust/snow kicked up by marching */}
        <ellipse cx="140" cy="270" rx="25" ry="4" fill="url(#ch11_formationHaze)" />
      </g>

      {/* Distant Austrian column center — larger, closer */}
      <g opacity="0.45">
        <rect x="340" y="258" width="50" height="3" fill="url(#ch11_austrianWhite)" rx="1" />
        <rect x="335" y="261" width="55" height="3" fill="url(#ch11_austrianWhite)" rx="1" opacity="0.8" />
        <rect x="330" y="264" width="60" height="3" fill="url(#ch11_austrianWhite)" rx="1" opacity="0.6" />
        {/* Individual soldiers at front of column */}
        <ellipse cx="342" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="347" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="352" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="357" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="362" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="367" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="372" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="377" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="382" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        <ellipse cx="387" cy="257" rx="1.2" ry="2.8" fill="#8a8a80" />
        {/* Mounted officer at head of column */}
        <ellipse cx="338" cy="256" rx="3" ry="2" fill="#6a6a60" />
        <ellipse cx="338" cy="254" rx="1" ry="2.5" fill="#7a7a70" />
        <circle cx="338" cy="252" r="1" fill="#8a8a80" />
        {/* Austrian flags */}
        <rect x="365" y="250" width="1" height="7" fill="#3a3028" opacity="0.6" />
        <rect x="366" y="250" width="6" height="4" fill="url(#ch11_austrianFlag)" opacity="0.5">
          <animate attributeName="width" values="6;7;6" dur="3.5s" repeatCount="indefinite" />
        </rect>
        {/* Formation dust */}
        <ellipse cx="365" cy="268" rx="30" ry="5" fill="url(#ch11_formationHaze)" />
      </g>

      {/* Distant Austrian column right */}
      <g opacity="0.35">
        <rect x="580" y="260" width="35" height="2.5" fill="url(#ch11_austrianWhite)" rx="1" />
        <rect x="575" y="262.5" width="40" height="2.5" fill="url(#ch11_austrianWhite)" rx="1" opacity="0.7" />
        <rect x="570" y="265" width="45" height="2.5" fill="url(#ch11_austrianWhite)" rx="1" opacity="0.5" />
        {/* Soldiers at front */}
        <ellipse cx="582" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="586" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="590" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="594" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="598" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="602" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="606" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        <ellipse cx="610" cy="259" rx="0.8" ry="2" fill="#7a7a70" />
        {/* Formation haze */}
        <ellipse cx="595" cy="268" rx="22" ry="4" fill="url(#ch11_formationHaze)" />
      </g>

      {/* ===== DISTANT AUSTRIAN ARTILLERY — in the valley ===== */}
      {/* Austrian battery left — cannon flash and smoke */}
      <g opacity="0.5">
        <rect x="160" y="265" width="6" height="2" fill="#3a3a38" />
        <rect x="175" y="265" width="6" height="2" fill="#3a3a38" />
        {/* Muzzle flash */}
        <ellipse cx="166" cy="264" rx="4" ry="3" fill="url(#ch11_cannonFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite" begin="2s" />
        </ellipse>
      </g>
      {/* Austrian battery right */}
      <g opacity="0.4">
        <rect x="620" y="263" width="5" height="2" fill="#3a3a38" />
        <rect x="632" y="263" width="5" height="2" fill="#3a3a38" />
        <ellipse cx="637" cy="262" rx="3.5" ry="2.5" fill="url(#ch11_cannonFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="6s" repeatCount="indefinite" begin="0.5s" />
        </ellipse>
      </g>

      {/* ===== PLATEAU EDGE — cliff face where ground drops to valley ===== */}
      {/* Rocky cliff edge — the drop-off from the Rivoli plateau */}
      <path
        d="M 0,278 Q 60,275 120,280 Q 180,276 240,280 Q 300,274 360,278 Q 420,276 480,280 Q 540,275 600,279 Q 660,276 720,280 Q 760,277 800,280 L 800,290 L 0,290 Z"
        fill="url(#ch11_cliffFace)"
        opacity="0.8"
      />
      {/* Cliff texture — rocky ledges */}
      <path d="M 80,282 L 120,280 L 160,283" fill="none" stroke="#4a4848" strokeWidth="0.5" opacity="0.3" />
      <path d="M 250,280 L 290,278 L 330,281" fill="none" stroke="#4a4848" strokeWidth="0.5" opacity="0.25" />
      <path d="M 450,281 L 490,279 L 530,282" fill="none" stroke="#4a4848" strokeWidth="0.5" opacity="0.3" />
      <path d="M 620,280 L 660,278 L 700,281" fill="none" stroke="#4a4848" strokeWidth="0.5" opacity="0.25" />
      {/* Snow on cliff edges */}
      <path
        d="M 0,278 Q 60,275 120,280 Q 180,276 240,280 Q 300,274 360,278 Q 420,276 480,280 Q 540,275 600,279 Q 660,276 720,280 Q 760,277 800,280"
        fill="none" stroke="#b8c0c8" strokeWidth="1.5" opacity="0.3"
      />

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

      {/* Additional distant pines on ridge — scattered silhouettes */}
      <polygon points="355,252 353,260 357,260" fill="url(#ch11_pine)" opacity="0.4" />
      <polygon points="355,258 352,264 358,264" fill="url(#ch11_pine)" opacity="0.4" />
      <polygon points="510,248 508,258 512,258" fill="url(#ch11_pine)" opacity="0.45" />
      <polygon points="510,255 507,263 513,263" fill="url(#ch11_pine)" opacity="0.45" />
      <polygon points="580,252 578,260 582,260" fill="url(#ch11_pine)" opacity="0.35" />

      {/* ===== ADDITIONAL PINE TREES — mid-ground left cluster ===== */}
      {/* Pine 3 — smaller, slightly behind left tree */}
      <polygon points="185,288 181,305 189,305" fill="url(#ch11_pine)" opacity="0.7" />
      <polygon points="185,300 180,312 190,312" fill="url(#ch11_pine)" opacity="0.7" />
      <polygon points="185,310 178,322 192,322" fill="url(#ch11_pine)" opacity="0.7" />
      <rect x="183" y="322" width="4" height="12" fill="#2a2018" />
      <polygon points="185,288 183,290 187,290" fill="#c8d0d8" opacity="0.6" />
      <ellipse cx="181" cy="305" rx="6" ry="2.5" fill="#b8c0c8" opacity="0.5" />

      {/* Pine 4 — right of right cluster, taller */}
      <polygon points="635,275 630,300 640,300" fill="url(#ch11_pine)" opacity="0.75" />
      <polygon points="635,292 628,312 642,312" fill="url(#ch11_pine)" opacity="0.75" />
      <polygon points="635,305 625,325 645,325" fill="url(#ch11_pine)" opacity="0.75" />
      <rect x="633" y="325" width="4" height="14" fill="#2a2018" />
      <polygon points="635,275 632,278 638,278" fill="#c8d0d8" opacity="0.65" />
      <ellipse cx="630" cy="300" rx="7" ry="2.5" fill="#b8c0c8" opacity="0.55" />
      <ellipse cx="640" cy="300" rx="6" ry="2.5" fill="#b8c0c8" opacity="0.55" />

      {/* ===== BARE DECIDUOUS TREES — winter-stripped, skeletal ===== */}
      {/* Bare tree 1 — left side, near artillery */}
      <g opacity="0.65">
        <line x1="230" y1="330" x2="230" y2="292" stroke="url(#ch11_bareTrunk)" strokeWidth="3" />
        {/* Main branches */}
        <path d="M230 295 Q225 288 218 282" fill="none" stroke="#3a3028" strokeWidth="1.5" />
        <path d="M230 298 Q236 290 244 286" fill="none" stroke="#3a3028" strokeWidth="1.5" />
        <path d="M230 305 Q223 298 216 295" fill="none" stroke="#3a3028" strokeWidth="1.2" />
        <path d="M230 308 Q238 300 245 298" fill="none" stroke="#3a3028" strokeWidth="1.2" />
        {/* Smaller twigs */}
        <path d="M218 282 Q214 278 210 276" fill="none" stroke="#3a3028" strokeWidth="0.6" />
        <path d="M218 282 Q216 279 218 275" fill="none" stroke="#3a3028" strokeWidth="0.5" />
        <path d="M244 286 Q248 282 252 281" fill="none" stroke="#3a3028" strokeWidth="0.6" />
        <path d="M244 286 Q246 282 244 278" fill="none" stroke="#3a3028" strokeWidth="0.5" />
        <path d="M216 295 Q212 292 208 292" fill="none" stroke="#2a2018" strokeWidth="0.4" />
        <path d="M245 298 Q250 295 254 296" fill="none" stroke="#2a2018" strokeWidth="0.4" />
        {/* Frost on branches — white-blue rime */}
        <path d="M218 282 Q225 288 230 295" fill="none" stroke="#b8c8d8" strokeWidth="0.4" opacity="0.25" />
        <path d="M244 286 Q236 290 230 298" fill="none" stroke="#b8c8d8" strokeWidth="0.4" opacity="0.2" />
        {/* Snow resting on branch forks */}
        <ellipse cx="218" cy="282" rx="3" ry="1.5" fill="#c8d0d8" opacity="0.45" />
        <ellipse cx="244" cy="286" rx="3" ry="1.5" fill="#c8d0d8" opacity="0.4" />
        <ellipse cx="230" cy="295" rx="2.5" ry="1" fill="#c8d0d8" opacity="0.35" />
      </g>

      {/* Bare tree 2 — right side, near camp */}
      <g opacity="0.6">
        <line x1="560" y1="335" x2="560" y2="298" stroke="url(#ch11_bareTrunk)" strokeWidth="2.5" />
        <path d="M560 300 Q554 293 548 288" fill="none" stroke="#3a3028" strokeWidth="1.3" />
        <path d="M560 303 Q567 296 574 292" fill="none" stroke="#3a3028" strokeWidth="1.3" />
        <path d="M560 310 Q553 304 546 302" fill="none" stroke="#3a3028" strokeWidth="1" />
        <path d="M560 312 Q568 306 575 304" fill="none" stroke="#3a3028" strokeWidth="1" />
        {/* Twigs */}
        <path d="M548 288 Q544 284 540 283" fill="none" stroke="#3a3028" strokeWidth="0.5" />
        <path d="M548 288 Q546 285 548 282" fill="none" stroke="#3a3028" strokeWidth="0.4" />
        <path d="M574 292 Q578 288 582 287" fill="none" stroke="#3a3028" strokeWidth="0.5" />
        <path d="M574 292 Q576 288 574 285" fill="none" stroke="#3a3028" strokeWidth="0.4" />
        {/* Frost and snow */}
        <ellipse cx="548" cy="288" rx="2.5" ry="1.2" fill="#c8d0d8" opacity="0.4" />
        <ellipse cx="574" cy="292" rx="2.5" ry="1.2" fill="#c8d0d8" opacity="0.35" />
      </g>

      {/* Bare tree 3 — foreground left, larger and more detailed */}
      <g opacity="0.7">
        <line x1="60" y1="395" x2="58" y2="340" stroke="url(#ch11_bareTrunk)" strokeWidth="4" />
        <path d="M58 345 Q48 335 38 328" fill="none" stroke="#3a3028" strokeWidth="2" />
        <path d="M58 348 Q68 338 78 332" fill="none" stroke="#3a3028" strokeWidth="2" />
        <path d="M58 358 Q50 350 42 348" fill="none" stroke="#3a3028" strokeWidth="1.5" />
        <path d="M58 360 Q66 352 74 350" fill="none" stroke="#3a3028" strokeWidth="1.5" />
        {/* Twigs */}
        <path d="M38 328 Q32 324 26 322" fill="none" stroke="#3a3028" strokeWidth="0.8" />
        <path d="M38 328 Q36 322 38 318" fill="none" stroke="#3a3028" strokeWidth="0.6" />
        <path d="M78 332 Q84 328 90 327" fill="none" stroke="#3a3028" strokeWidth="0.8" />
        <path d="M78 332 Q80 326 78 322" fill="none" stroke="#3a3028" strokeWidth="0.6" />
        <path d="M42 348 Q36 344 30 344" fill="none" stroke="#2a2018" strokeWidth="0.5" />
        <path d="M74 350 Q80 346 86 346" fill="none" stroke="#2a2018" strokeWidth="0.5" />
        {/* Snow on branches */}
        <ellipse cx="38" cy="328" rx="4" ry="2" fill="#c8d0d8" opacity="0.5" />
        <ellipse cx="78" cy="332" rx="3.5" ry="1.8" fill="#c8d0d8" opacity="0.45" />
        <ellipse cx="58" cy="345" rx="3" ry="1.2" fill="#c8d0d8" opacity="0.4" />
        {/* Icicles hanging from branches */}
        <line x1="36" y1="329" x2="36" y2="334" stroke="url(#ch11_icicle)" strokeWidth="0.6" />
        <line x1="40" y1="329" x2="40" y2="333" stroke="url(#ch11_icicle)" strokeWidth="0.5" />
        <line x1="76" y1="333" x2="76" y2="337" stroke="url(#ch11_icicle)" strokeWidth="0.5" />
        <line x1="80" y1="333" x2="80" y2="336" stroke="url(#ch11_icicle)" strokeWidth="0.4" />
      </g>

      {/* Bare tree 4 — background center, small silhouette */}
      <g opacity="0.4">
        <line x1="440" y1="290" x2="440" y2="272" stroke="#2a2018" strokeWidth="1.5" />
        <path d="M440 274 Q436 268 432 265" fill="none" stroke="#2a2018" strokeWidth="0.8" />
        <path d="M440 276 Q444 270 448 267" fill="none" stroke="#2a2018" strokeWidth="0.8" />
        <path d="M432 265 Q430 262 428 261" fill="none" stroke="#2a2018" strokeWidth="0.4" />
        <path d="M448 267 Q450 264 452 263" fill="none" stroke="#2a2018" strokeWidth="0.4" />
        <ellipse cx="432" cy="265" rx="2" ry="1" fill="#c8d0d8" opacity="0.3" />
      </g>

      {/* ===== FROSTED BUSHES AND SCRUB — winter vegetation ===== */}
      {/* Frost-covered bush 1 — near left rocks */}
      <g opacity="0.5">
        <ellipse cx="85" cy="328" rx="10" ry="6" fill="#2a3020" />
        <ellipse cx="85" cy="326" rx="8" ry="3" fill="#b8c8d0" opacity="0.3" />
        <path d="M80 324 Q78 320 80 316" fill="none" stroke="#2a3020" strokeWidth="0.5" />
        <path d="M88 322 Q90 318 88 314" fill="none" stroke="#2a3020" strokeWidth="0.5" />
      </g>
      {/* Frost-covered bush 2 — near right rocks */}
      <g opacity="0.5">
        <ellipse cx="660" cy="325" rx="12" ry="7" fill="#2a3020" />
        <ellipse cx="660" cy="322" rx="10" ry="3.5" fill="#b8c8d0" opacity="0.3" />
      </g>
      {/* Dead grass tufts poking through snow */}
      <g opacity="0.3">
        <path d="M300 335 Q301 328 302 322" fill="none" stroke="#4a4830" strokeWidth="0.6" />
        <path d="M303 336 Q305 330 306 324" fill="none" stroke="#4a4830" strokeWidth="0.5" />
        <path d="M298 336 Q296 330 297 325" fill="none" stroke="#4a4830" strokeWidth="0.5" />
      </g>
      <g opacity="0.25">
        <path d="M470 338 Q471 332 472 326" fill="none" stroke="#4a4830" strokeWidth="0.5" />
        <path d="M473 339 Q475 333 474 328" fill="none" stroke="#4a4830" strokeWidth="0.4" />
        <path d="M468 339 Q466 334 467 329" fill="none" stroke="#4a4830" strokeWidth="0.4" />
      </g>
      <g opacity="0.2">
        <path d="M580 336 Q581 330 582 325" fill="none" stroke="#4a4830" strokeWidth="0.5" />
        <path d="M583 337 Q584 331 583 326" fill="none" stroke="#4a4830" strokeWidth="0.4" />
      </g>

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
      <ellipse cx="182" cy="293" rx="3" ry="2" fill="url(#ch11_breath)">
        <animate attributeName="opacity" values="0;0.15;0" dur="5s" repeatCount="indefinite" begin="1.5s" />
      </ellipse>
      <ellipse cx="207" cy="296" rx="3" ry="2" fill="url(#ch11_breath)">
        <animate attributeName="opacity" values="0.15;0;0.15" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
      </ellipse>

      {/* Frost on cannon barrels — icy sheen in the cold */}
      <rect x="160" y="286" width="28" height="2" fill="url(#ch11_frostMetal)" opacity="0.4" />
      <rect x="195" y="291" width="26" height="2" fill="url(#ch11_frostMetal)" opacity="0.35" />

      {/* ===== CANNON 3 — right side battery ===== */}
      <ellipse cx="700" cy="298" rx="12" ry="6" fill="url(#ch11_woodCarriage)" />
      <rect x="700" y="293" width="26" height="4" fill="url(#ch11_cannonBarrel)" />
      <circle cx="693" cy="300" r="4" fill="#3a3a38" />
      <circle cx="707" cy="300" r="4" fill="#3a3a38" />
      {/* Cannon 3 flash */}
      <ellipse cx="726" cy="294" rx="7" ry="5" fill="url(#ch11_cannonFlash)" opacity="0">
        <animate attributeName="opacity" values="0;0.8;0" dur="4.5s" repeatCount="indefinite" begin="1.5s" />
      </ellipse>
      {/* Cannon 3 smoke cloud */}
      <ellipse cx="715" cy="286" rx="35" ry="18" fill="url(#ch11_smoke)" opacity="0.6">
        <animate attributeName="ry" values="18;25;18" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.35;0.6" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke wisp from cannon 3 — drifting right */}
      <path
        d="M 730,288 Q 745,278 760,280 Q 775,283 790,275"
        fill="none" stroke="#a8a098" strokeWidth="3.5" opacity="0.15" strokeLinecap="round"
      >
        <animate attributeName="d"
          values="M 730,288 Q 745,278 760,280 Q 775,283 790,275;
                  M 730,288 Q 748,274 765,276 Q 780,280 800,270;
                  M 730,288 Q 745,278 760,280 Q 775,283 790,275"
          dur="11s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="11s" repeatCount="indefinite" />
      </path>
      {/* Cannon 3 crew */}
      <ellipse cx="710" cy="302" rx="3" ry="8" fill="#2a2a28" opacity="0.7" />
      <circle cx="710" cy="299" r="2.5" fill="#3a3a38" opacity="0.7" />
      <ellipse cx="720" cy="304" rx="3" ry="8" fill="#2a2a28" opacity="0.7" />
      <circle cx="720" cy="301" r="2.5" fill="#3a3a38" opacity="0.7" />
      <ellipse cx="695" cy="303" rx="3" ry="8" fill="#2a2a28" opacity="0.65" />
      <circle cx="695" cy="300" r="2.5" fill="#3a3a38" opacity="0.65" />
      {/* Breath from cannon 3 crew */}
      <ellipse cx="712" cy="298" rx="3" ry="2" fill="url(#ch11_breath)">
        <animate attributeName="opacity" values="0.18;0;0.18" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
      </ellipse>

      {/* ===== GABION EARTHWORKS — defensive positions ===== */}
      {/* Gabion baskets near left battery — wicker and earth fortification */}
      <g opacity="0.6">
        <ellipse cx="140" cy="288" rx="6" ry="5" fill="url(#ch11_gabion)" />
        <ellipse cx="150" cy="287" rx="5" ry="4.5" fill="url(#ch11_gabion)" />
        <ellipse cx="145" cy="290" rx="7" ry="5" fill="url(#ch11_gabion)" />
        {/* Wicker texture lines */}
        <path d="M135 286 Q140 284 145 286" fill="none" stroke="#5a5040" strokeWidth="0.3" opacity="0.4" />
        <path d="M145 285 Q150 283 155 285" fill="none" stroke="#5a5040" strokeWidth="0.3" opacity="0.35" />
        {/* Snow on top */}
        <ellipse cx="140" cy="284" rx="5" ry="1.5" fill="#b8c0c8" opacity="0.4" />
        <ellipse cx="150" cy="283" rx="4" ry="1.5" fill="#b8c0c8" opacity="0.35" />
      </g>
      {/* Gabion baskets near right battery */}
      <g opacity="0.55">
        <ellipse cx="690" cy="295" rx="5" ry="4.5" fill="url(#ch11_gabion)" />
        <ellipse cx="680" cy="296" rx="6" ry="5" fill="url(#ch11_gabion)" />
        <ellipse cx="685" cy="298" rx="6" ry="4.5" fill="url(#ch11_gabion)" />
        <ellipse cx="690" cy="291" rx="4" ry="1.5" fill="#b8c0c8" opacity="0.35" />
      </g>

      {/* ===== POWDER KEGS — stacked near batteries ===== */}
      <g opacity="0.55">
        <ellipse cx="150" cy="298" rx="4" ry="3" fill="url(#ch11_kegWood)" />
        <ellipse cx="157" cy="297" rx="3.5" ry="2.8" fill="url(#ch11_kegWood)" />
        <ellipse cx="153" cy="296" rx="2.5" ry="2" fill="url(#ch11_kegWood)" />
        <ellipse cx="150" cy="295" rx="3" ry="1" fill="#b8c0c8" opacity="0.3" />
      </g>

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

      {/* Soldiers around fire 3 */}
      <ellipse cx="625" cy="322" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="625" cy="319" r="2" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="635" cy="324" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="635" cy="321" r="2" fill="#3a3a40" opacity="0.8" />
      <ellipse cx="630" cy="326" rx="3" ry="7" fill="#2a2a30" opacity="0.8" />
      <circle cx="630" cy="323" r="2" fill="#3a3a40" opacity="0.8" />

      {/* Firelight on surrounding snow */}
      <ellipse cx="135" cy="310" rx="30" ry="15" fill="url(#ch11_fireOnSnow)" />
      <ellipse cx="380" cy="325" rx="35" ry="18" fill="url(#ch11_fireOnSnow)" />
      <ellipse cx="630" cy="322" rx="32" ry="16" fill="url(#ch11_fireOnSnow)" />

      {/* Campfire smoke wisps — thin trails rising in cold air */}
      <path d="M135 298 Q132 285 136 272 Q133 262 137 252"
        fill="none" stroke="#8a9098" strokeWidth="1.5" opacity="0.1" strokeLinecap="round">
        <animate attributeName="d"
          values="M135 298 Q132 285 136 272 Q133 262 137 252;
                  M135 298 Q138 283 134 270 Q137 258 133 248;
                  M135 298 Q132 285 136 272 Q133 262 137 252"
          dur="12s" repeatCount="indefinite" />
      </path>
      <path d="M380 312 Q377 298 381 284 Q378 274 382 264"
        fill="none" stroke="#8a9098" strokeWidth="1.5" opacity="0.1" strokeLinecap="round">
        <animate attributeName="d"
          values="M380 312 Q377 298 381 284 Q378 274 382 264;
                  M380 312 Q383 296 379 282 Q382 270 378 260;
                  M380 312 Q377 298 381 284 Q378 274 382 264"
          dur="14s" repeatCount="indefinite" />
      </path>
      <path d="M630 310 Q627 296 631 282 Q628 272 632 262"
        fill="none" stroke="#8a9098" strokeWidth="1.2" opacity="0.08" strokeLinecap="round">
        <animate attributeName="d"
          values="M630 310 Q627 296 631 282 Q628 272 632 262;
                  M630 310 Q633 294 629 280 Q632 268 628 258;
                  M630 310 Q627 296 631 282 Q628 272 632 262"
          dur="13s" repeatCount="indefinite" />
      </path>

      {/* Rising embers from campfires — tiny orange sparks */}
      <circle cx="135" cy="300" r="0.7" fill="#d09040" opacity="0.35">
        <animate attributeName="cy" values="300;260;220" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cx" values="135;138;133" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.5;0" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="315" r="0.8" fill="#c08035" opacity="0.3">
        <animate attributeName="cy" values="315;275;235" dur="9s" repeatCount="indefinite" />
        <animate attributeName="cx" values="380;377;382" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.45;0" dur="9s" repeatCount="indefinite" />
      </circle>
      <circle cx="382" cy="318" r="0.6" fill="#d09040" opacity="0.25">
        <animate attributeName="cy" values="318;280;240" dur="8s" repeatCount="indefinite" begin="2s" />
        <animate attributeName="cx" values="382;385;380" dur="8s" repeatCount="indefinite" begin="2s" />
        <animate attributeName="opacity" values="0;0.4;0" dur="8s" repeatCount="indefinite" begin="2s" />
      </circle>
      <circle cx="630" cy="312" r="0.7" fill="#d09040" opacity="0.3">
        <animate attributeName="cy" values="312;272;232" dur="8.5s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="cx" values="630;633;628" dur="8.5s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.3;0.4;0" dur="8.5s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* ===== FIRE 4 — small fire far left, distant ===== */}
      <ellipse cx="50" cy="335" rx="16" ry="10" fill="url(#ch11_fireGlow)" opacity="0.6" />
      <ellipse cx="50" cy="335" rx="3" ry="1.5" fill="#d88838" opacity="0.7">
        <animate attributeName="ry" values="1.5;2.5;1.5" dur="1.7s" repeatCount="indefinite" />
      </ellipse>
      {/* Soldiers at fire 4 — tiny silhouettes */}
      <ellipse cx="45" cy="338" rx="2" ry="5" fill="#2a2a30" opacity="0.6" />
      <circle cx="45" cy="336" r="1.5" fill="#3a3a40" opacity="0.6" />
      <ellipse cx="55" cy="340" rx="2" ry="5" fill="#2a2a30" opacity="0.6" />
      <circle cx="55" cy="338" r="1.5" fill="#3a3a40" opacity="0.6" />

      {/* ===== FIRE 5 — far right background ===== */}
      <ellipse cx="750" cy="330" rx="18" ry="12" fill="url(#ch11_fireGlow)" opacity="0.55" />
      <ellipse cx="750" cy="330" rx="4" ry="2" fill="#d88838" opacity="0.7">
        <animate attributeName="ry" values="2;3;2" dur="1.4s" repeatCount="indefinite" />
      </ellipse>
      {/* Soldiers at fire 5 */}
      <ellipse cx="745" cy="334" rx="2" ry="5.5" fill="#2a2a30" opacity="0.6" />
      <circle cx="745" cy="332" r="1.5" fill="#3a3a40" opacity="0.6" />
      <ellipse cx="755" cy="336" rx="2" ry="5.5" fill="#2a2a30" opacity="0.6" />
      <circle cx="755" cy="334" r="1.5" fill="#3a3a40" opacity="0.6" />

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

      {/* Tent 4 — near tent 1 */}
      <polygon points="265,320 253,333 277,333" fill="url(#ch11_tent)" opacity="0.75" />
      <polygon points="265,320 253,333 265,333" fill="url(#ch11_snowShadow)" opacity="0.25" />
      <ellipse cx="265" cy="317" rx="9" ry="2.5" fill="#b8c0c8" opacity="0.5" />

      {/* Tent 5 — farther back, partially obscured */}
      <polygon points="305,312 295,323 315,323" fill="url(#ch11_tent)" opacity="0.6" />
      <ellipse cx="305" cy="310" rx="8" ry="2" fill="#b8c0c8" opacity="0.4" />

      {/* Tent 6 — right side cluster */}
      <polygon points="545,322 534,336 556,336" fill="url(#ch11_tent)" opacity="0.75" />
      <polygon points="545,322 534,336 545,336" fill="url(#ch11_snowShadow)" opacity="0.25" />
      <ellipse cx="545" cy="319" rx="9" ry="2.5" fill="#b8c0c8" opacity="0.5" />

      {/* Tent 7 — far left small */}
      <polygon points="70,328 60,340 80,340" fill="url(#ch11_tent)" opacity="0.5" />
      <ellipse cx="70" cy="326" rx="7" ry="2" fill="#b8c0c8" opacity="0.35" />

      {/* Officer's larger tent — center, with stovepipe chimney */}
      <g opacity="0.7">
        <polygon points="340,308 322,326 358,326" fill="url(#ch11_tent)" />
        <polygon points="340,308 322,326 340,326" fill="url(#ch11_snowShadow)" opacity="0.3" />
        <ellipse cx="340" cy="305" rx="14" ry="3.5" fill="#b8c0c8" opacity="0.55" />
        {/* Stovepipe */}
        <rect x="345" y="303" width="2" height="8" fill="#3a3838" />
        {/* Thin smoke from stovepipe */}
        <path d="M346 303 Q344 296 347 290 Q344 284 348 278"
          fill="none" stroke="#8a9098" strokeWidth="1" opacity="0.12" strokeLinecap="round">
          <animate attributeName="d"
            values="M346 303 Q344 296 347 290 Q344 284 348 278;
                    M346 303 Q348 294 345 288 Q348 280 344 274;
                    M346 303 Q344 296 347 290 Q344 284 348 278"
            dur="10s" repeatCount="indefinite" />
        </path>
      </g>

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

      {/* ===== AMMUNITION WAGON — horse-drawn supply cart ===== */}
      <g opacity="0.65">
        {/* Wagon body */}
        <rect x="470" y="322" width="22" height="10" fill="url(#ch11_woodCarriage)" rx="1" />
        {/* Canvas cover */}
        <path d="M470 322 Q481 316 492 322" fill="url(#ch11_tent)" opacity="0.7" />
        {/* Wheels */}
        <circle cx="474" cy="334" r="5" fill="none" stroke="url(#ch11_woodCarriage)" strokeWidth="1.5" />
        <circle cx="488" cy="334" r="5" fill="none" stroke="url(#ch11_woodCarriage)" strokeWidth="1.5" />
        <circle cx="474" cy="334" r="1.5" fill="#3a3028" />
        <circle cx="488" cy="334" r="1.5" fill="#3a3028" />
        {/* Spokes */}
        <line x1="474" y1="329" x2="474" y2="339" stroke="#3a3028" strokeWidth="0.6" />
        <line x1="469" y1="334" x2="479" y2="334" stroke="#3a3028" strokeWidth="0.6" />
        <line x1="488" y1="329" x2="488" y2="339" stroke="#3a3028" strokeWidth="0.6" />
        <line x1="483" y1="334" x2="493" y2="334" stroke="#3a3028" strokeWidth="0.6" />
        {/* Shaft to horse */}
        <line x1="470" y1="327" x2="458" y2="326" stroke="#3a3028" strokeWidth="1.5" />
        {/* Draft horse silhouette */}
        <ellipse cx="452" cy="324" rx="8" ry="5" fill="#1a1818" opacity="0.7" />
        <ellipse cx="447" cy="322" rx="4" ry="4" fill="#1a1818" opacity="0.7" />
        <rect x="449" y="326" width="2" height="6" fill="#141414" opacity="0.7" rx="0.5" />
        <rect x="454" y="326" width="2" height="6" fill="#141414" opacity="0.7" rx="0.5" />
        {/* Snow on wagon */}
        <ellipse cx="481" cy="318" rx="10" ry="2" fill="#b8c0c8" opacity="0.4" />
      </g>

      {/* ===== ADDITIONAL EQUIPMENT SCATTERED IN SNOW ===== */}
      {/* Dropped cartridge box */}
      <rect x="355" y="334" width="5" height="3.5" fill="#2a2018" opacity="0.5" rx="0.5" />
      {/* Discarded shako */}
      <path d="M420 342 Q423 338 428 339 Q430 342 428 344 Z" fill="#1a1a28" opacity="0.4" />
      {/* Canteen */}
      <circle cx="468" cy="340" r="3" fill="#3a3838" opacity="0.4" />
      <line x1="468" y1="337" x2="470" y2="334" stroke="#3a3028" strokeWidth="0.5" opacity="0.3" />
      {/* Bayonet stuck in snow */}
      <line x1="502" y1="328" x2="504" y2="340" stroke="#4a4a48" strokeWidth="1" opacity="0.45" />
      <line x1="501" y1="328" x2="505" y2="328" stroke="#4a4a48" strokeWidth="0.6" opacity="0.4" />
      {/* Frozen blanket roll */}
      <ellipse cx="540" cy="338" rx="6" ry="2.5" fill="#3a3830" opacity="0.4" />
      {/* Discarded sapper's axe */}
      <g opacity="0.35">
        <line x1="600" y1="333" x2="612" y2="340" stroke="#3a3028" strokeWidth="1.2" />
        <path d="M600 332 Q597 330 598 327 Q600 326 602 328 Z" fill="#4a4a48" />
      </g>

      {/* ===== FRENCH BATTLE LINE — soldiers in formation on the plateau ===== */}
      {/* Line of soldiers — mid-ground, facing toward Austrian valley positions */}
      <g opacity="0.65">
        {/* Row of standing soldiers — blue coats barely visible in dawn light */}
        <ellipse cx="260" cy="296" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="260" cy="293" r="2" fill="#3a3a40" />
        <ellipse cx="268" cy="297" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="268" cy="294" r="2" fill="#3a3a40" />
        <ellipse cx="276" cy="296" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="276" cy="293" r="2" fill="#3a3a40" />
        <ellipse cx="284" cy="297" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="284" cy="294" r="2" fill="#3a3a40" />
        <ellipse cx="292" cy="296" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="292" cy="293" r="2" fill="#3a3a40" />
        <ellipse cx="300" cy="297" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="300" cy="294" r="2" fill="#3a3a40" />
        <ellipse cx="308" cy="296" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="308" cy="293" r="2" fill="#3a3a40" />
        <ellipse cx="316" cy="297" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="316" cy="294" r="2" fill="#3a3a40" />
        {/* Musket bayonets — glinting in dawn */}
        <line x1="260" y1="290" x2="258" y2="280" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="268" y1="291" x2="266" y2="281" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="276" y1="290" x2="274" y2="280" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="284" y1="291" x2="282" y2="281" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="292" y1="290" x2="290" y2="280" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="300" y1="291" x2="298" y2="281" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="308" y1="290" x2="306" y2="280" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        <line x1="316" y1="291" x2="314" y2="281" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        {/* Bayonet glint — dawn light catching steel */}
        <circle cx="258" cy="280" r="0.5" fill="#c8b890" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="290" cy="280" r="0.5" fill="#c8b890" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.08;0.25" dur="5s" repeatCount="indefinite" begin="1s" />
        </circle>
        {/* Breath vapor from soldiers — visible in cold */}
        <ellipse cx="262" cy="292" rx="2.5" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="286" cy="293" rx="2.5" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0;0.12;0" dur="4s" repeatCount="indefinite" begin="1.2s" />
        </ellipse>
        <ellipse cx="310" cy="292" rx="2.5" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.1;0;0.1" dur="4.5s" repeatCount="indefinite" begin="2s" />
        </ellipse>
      </g>

      {/* Second French formation — further right */}
      <g opacity="0.55">
        <ellipse cx="480" cy="298" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="480" cy="295" r="2" fill="#3a3a40" />
        <ellipse cx="488" cy="299" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="488" cy="296" r="2" fill="#3a3a40" />
        <ellipse cx="496" cy="298" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="496" cy="295" r="2" fill="#3a3a40" />
        <ellipse cx="504" cy="299" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="504" cy="296" r="2" fill="#3a3a40" />
        <ellipse cx="512" cy="298" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="512" cy="295" r="2" fill="#3a3a40" />
        {/* Bayonets */}
        <line x1="480" y1="292" x2="478" y2="282" stroke="#6a6a68" strokeWidth="0.6" opacity="0.45" />
        <line x1="488" y1="293" x2="486" y2="283" stroke="#6a6a68" strokeWidth="0.6" opacity="0.45" />
        <line x1="496" y1="292" x2="494" y2="282" stroke="#6a6a68" strokeWidth="0.6" opacity="0.45" />
        <line x1="504" y1="293" x2="502" y2="283" stroke="#6a6a68" strokeWidth="0.6" opacity="0.45" />
        <line x1="512" y1="292" x2="510" y2="282" stroke="#6a6a68" strokeWidth="0.6" opacity="0.45" />
        {/* Volley smoke band — just fired */}
        <rect x="470" y="286" width="50" height="8" fill="url(#ch11_volleySmoke)" opacity="0.4">
          <animate attributeName="y" values="286;280;286" dur="10s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur="10s" repeatCount="indefinite" />
        </rect>
      </g>

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

      {/* ===== STAFF OFFICERS — mounted, flanking Napoleon ===== */}
      {/* Officer 1 — left of Napoleon, slightly behind */}
      <g opacity="0.75">
        <ellipse cx="390" cy="310" rx="12" ry="8" fill="#1a1818" />
        <ellipse cx="398" cy="308" rx="5" ry="5" fill="#1a1818" />
        <rect x="383" y="312" width="2" height="8" fill="#141414" rx="0.5" />
        <rect x="389" y="312" width="2" height="8" fill="#141414" rx="0.5" />
        <rect x="395" y="312" width="2" height="7" fill="#141414" rx="0.5" />
        <rect x="400" y="312" width="2" height="7" fill="#141414" rx="0.5" />
        {/* Officer torso + head */}
        <ellipse cx="393" cy="302" rx="4" ry="8" fill="url(#ch11_officerCloak)" />
        <circle cx="393" cy="298" r="2.8" fill="#1a2030" />
        {/* Bicorne hat */}
        <ellipse cx="393" cy="296" rx="5" ry="1.8" fill="#0a0a14" />
        {/* Horse breath */}
        <ellipse cx="400" cy="307" rx="3.5" ry="2" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" begin="1s" />
        </ellipse>
      </g>

      {/* Officer 2 — right of Napoleon */}
      <g opacity="0.7">
        <ellipse cx="445" cy="312" rx="11" ry="7" fill="#1a1818" />
        <ellipse cx="452" cy="310" rx="5" ry="5" fill="#1a1818" />
        <rect x="439" y="314" width="2" height="7" fill="#141414" rx="0.5" />
        <rect x="444" y="314" width="2" height="7" fill="#141414" rx="0.5" />
        <rect x="450" y="314" width="2" height="7" fill="#141414" rx="0.5" />
        <rect x="455" y="314" width="2" height="7" fill="#141414" rx="0.5" />
        <ellipse cx="448" cy="304" rx="4" ry="8" fill="url(#ch11_officerCloak)" />
        <circle cx="448" cy="300" r="2.8" fill="#1a2030" />
        <ellipse cx="448" cy="298" rx="5" ry="1.8" fill="#0a0a14" />
        {/* Horse tail */}
        <path d="M434 310 Q430 313 428 316" fill="none" stroke="#1a1818" strokeWidth="1.8" opacity="0.7" />
      </g>

      {/* Aide-de-camp — on foot, standing near Napoleon with dispatch */}
      <g opacity="0.7">
        <ellipse cx="430" cy="314" rx="3" ry="8" fill="url(#ch11_frenchBlue)" />
        <circle cx="430" cy="310" r="2.5" fill="#3a3a40" />
        {/* Dispatch paper in hand */}
        <rect x="433" y="313" width="3" height="2" fill="#d8d0c0" opacity="0.5" />
        {/* Breath */}
        <ellipse cx="432" cy="309" rx="2.5" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.15;0;0.15" dur="3.8s" repeatCount="indefinite" begin="0.5s" />
        </ellipse>
      </g>

      {/* ===== ENHANCED NAPOLEON VIGNETTE — telescope, map table, horse details ===== */}
      {/* Napoleon's telescope — extended, catching dawn light */}
      <g opacity="0.85">
        <line x1="420" y1="293" x2="436" y2="288" stroke="url(#ch11_telescope)" strokeWidth="1.5" />
        {/* Lens glint — catching the sunrise */}
        <circle cx="436" cy="288" r="1.2" fill="#e8d090" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.15;0.4" dur="5s" repeatCount="indefinite" />
        </circle>
        {/* Telescope tube sections visible */}
        <circle cx="428" cy="290.5" r="0.8" fill="#a88838" opacity="0.4" />
      </g>

      {/* Napoleon's horse — enhanced tack detail */}
      <g opacity="0.85">
        {/* Saddle — visible on horse's back */}
        <path d="M408 298 Q412 294 418 296 Q420 298 416 300 Z" fill="url(#ch11_leather)" opacity="0.7" />
        {/* Bridle — on horse's head */}
        <path d="M436 294 Q438 296 440 295" fill="none" stroke="#4a3020" strokeWidth="0.6" opacity="0.5" />
        <path d="M438 293 Q440 295 442 294" fill="none" stroke="#4a3020" strokeWidth="0.5" opacity="0.4" />
        {/* Reins — from bridle to rider's hand */}
        <path d="M437 295 Q428 296 416 296" fill="none" stroke="#4a3020" strokeWidth="0.5" opacity="0.45" />
        {/* Gold stirrup — glinting */}
        <ellipse cx="410" cy="310" rx="1.5" ry="2" fill="url(#ch11_goldTrim)" opacity="0.3" />
        <ellipse cx="422" cy="310" rx="1.5" ry="2" fill="url(#ch11_goldTrim)" opacity="0.25" />
        {/* Horse blanket detail — decorative shabraque under saddle */}
        <path d="M404 302 Q412 306 420 302" fill="none" stroke="#a82020" strokeWidth="1.2" opacity="0.35" />
        {/* Horse mane detail */}
        <path d="M430 298 Q432 296 434 294 Q433 296 435 295" fill="none" stroke="#1a1818" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Napoleon's gold epaulettes — catching dawn light */}
      <g opacity="0.5">
        <ellipse cx="413" cy="291" rx="1.5" ry="1" fill="url(#ch11_goldTrim)" />
        <ellipse cx="419" cy="291" rx="1.5" ry="1" fill="url(#ch11_goldTrim)" />
        {/* Sash — red across chest */}
        <line x1="414" y1="290" x2="418" y2="296" stroke="#8a2020" strokeWidth="0.6" opacity="0.4" />
      </g>

      {/* Map table — field desk near Napoleon's position */}
      <g opacity="0.6">
        {/* Table legs — simple trestle */}
        <line x1="398" y1="320" x2="396" y2="326" stroke="#3a3028" strokeWidth="1" />
        <line x1="408" y1="320" x2="410" y2="326" stroke="#3a3028" strokeWidth="1" />
        {/* Table top — board */}
        <rect x="395" y="318" width="16" height="2.5" fill="url(#ch11_woodCarriage)" rx="0.5" />
        {/* Map spread on table — parchment with markings */}
        <rect x="396" y="317" width="14" height="3" fill="url(#ch11_parchment)" rx="0.3" />
        {/* Map markings — tiny lines representing terrain */}
        <path d="M398 318 Q402 317 406 318.5" fill="none" stroke="#3a2818" strokeWidth="0.2" opacity="0.3" />
        <path d="M399 319 Q403 318 408 319" fill="none" stroke="#3a2818" strokeWidth="0.15" opacity="0.25" />
        {/* Map weights — small rocks holding corners */}
        <circle cx="397" cy="318" r="0.8" fill="#4a4848" opacity="0.4" />
        <circle cx="409" cy="318" r="0.7" fill="#4a4848" opacity="0.35" />
        {/* Lantern on map table — warm glow illuminating */}
        <ellipse cx="403" cy="316" rx="8" ry="5" fill="url(#ch11_lanternWarm)" opacity="0.5" />
        <rect x="401" y="315" width="3" height="3" fill="#4a4838" opacity="0.4" rx="0.3" />
        <rect x="401.5" y="316" width="2" height="1.5" fill="#d8a050" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1.5s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* Second aide — standing at attention behind Napoleon */}
      <g opacity="0.6">
        <ellipse cx="420" cy="320" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="420" cy="317" r="2" fill="#3a3a40" />
        {/* Shako */}
        <rect x="418" y="314" width="4" height="2" fill="#1a1a28" rx="0.3" />
        {/* Musket at shoulder */}
        <line x1="423" y1="314" x2="424" y2="306" stroke="#4a4a48" strokeWidth="0.8" opacity="0.5" />
        {/* Breath */}
        <ellipse cx="422" cy="316" rx="2" ry="1.2" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.12;0;0.12" dur="4.2s" repeatCount="indefinite" begin="2s" />
        </ellipse>
      </g>

      {/* Second French flag — with the right formation */}
      <rect x="518" y="272" width="2" height="30" fill="#3a3028" opacity="0.7" />
      <path
        d="M 520,274 Q 533,276 546,274 L 546,286 Q 533,288 520,286 Z"
        fill="url(#ch11_tricolor)"
        opacity="0.8"
      >
        <animate attributeName="d"
          values="M 520,274 Q 533,276 546,274 L 546,286 Q 533,288 520,286 Z;
                  M 520,274 Q 533,272 546,274 L 546,286 Q 533,284 520,286 Z;
                  M 520,274 Q 533,276 546,274 L 546,286 Q 533,288 520,286 Z"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* ===== FOURTH CANNON — forward position, angled toward valley ===== */}
      <g opacity="0.7">
        <ellipse cx="320" cy="294" rx="10" ry="5" fill="url(#ch11_woodCarriage)" />
        <rect x="320" y="289" width="22" height="3.5" fill="url(#ch11_cannonBarrel)" />
        <circle cx="314" cy="296" r="3.5" fill="#3a3a38" />
        <circle cx="326" cy="296" r="3.5" fill="#3a3a38" />
        {/* Iron tire on wheels */}
        <circle cx="314" cy="296" r="3.5" fill="none" stroke="url(#ch11_ironTire)" strokeWidth="0.5" />
        <circle cx="326" cy="296" r="3.5" fill="none" stroke="url(#ch11_ironTire)" strokeWidth="0.5" />
        {/* Cannon flash — just fired */}
        <ellipse cx="342" cy="290" rx="6" ry="5" fill="url(#ch11_cannonFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.7;0" dur="5.5s" repeatCount="indefinite" begin="3s" />
        </ellipse>
        {/* Smoke from muzzle */}
        <ellipse cx="335" cy="284" rx="25" ry="14" fill="url(#ch11_smoke)" opacity="0.5">
          <animate attributeName="ry" values="14;20;14" dur="7s" repeatCount="indefinite" begin="3s" />
          <animate attributeName="opacity" values="0.5;0.25;0.5" dur="7s" repeatCount="indefinite" begin="3s" />
        </ellipse>
        {/* Gun crew */}
        <ellipse cx="310" cy="298" rx="2.5" ry="7" fill="#2a2a28" opacity="0.65" />
        <circle cx="310" cy="295" r="2" fill="#3a3a38" opacity="0.65" />
        <ellipse cx="330" cy="300" rx="2.5" ry="7" fill="#2a2a28" opacity="0.65" />
        <circle cx="330" cy="297" r="2" fill="#3a3a38" opacity="0.65" />
        {/* Frost on barrel */}
        <rect x="320" y="289.5" width="22" height="1.5" fill="url(#ch11_frostMetal)" opacity="0.3" />
      </g>

      {/* ===== ARTILLERY LIMBER — parked behind cannon, with horse team ===== */}
      <g opacity="0.55">
        {/* Limber chest — ammunition box on wheels */}
        <rect x="280" y="308" width="14" height="7" fill="url(#ch11_woodCarriage)" rx="1" />
        <circle cx="282" cy="318" r="4" fill="none" stroke="url(#ch11_woodCarriage)" strokeWidth="1.2" />
        <circle cx="292" cy="318" r="4" fill="none" stroke="url(#ch11_woodCarriage)" strokeWidth="1.2" />
        <circle cx="282" cy="318" r="1.2" fill="#3a3028" />
        <circle cx="292" cy="318" r="1.2" fill="#3a3028" />
        {/* Pole to gun */}
        <line x1="294" y1="312" x2="312" y2="296" stroke="#3a3028" strokeWidth="1.2" opacity="0.5" />
        {/* Snow on limber top */}
        <ellipse cx="287" cy="306" rx="8" ry="1.5" fill="#b8c0c8" opacity="0.35" />
      </g>

      {/* ===== THIRD FRENCH FORMATION — reserve line, further back ===== */}
      <g opacity="0.45">
        {/* Soldiers in looser formation — reserves waiting */}
        <ellipse cx="345" cy="302" rx="2" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="345" cy="299" r="1.8" fill="#3a3a40" />
        <ellipse cx="352" cy="303" rx="2" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="352" cy="300" r="1.8" fill="#3a3a40" />
        <ellipse cx="359" cy="302" rx="2" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="359" cy="299" r="1.8" fill="#3a3a40" />
        <ellipse cx="366" cy="303" rx="2" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="366" cy="300" r="1.8" fill="#3a3a40" />
        <ellipse cx="373" cy="302" rx="2" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="373" cy="299" r="1.8" fill="#3a3a40" />
        {/* Bayonets — at rest, more vertical */}
        <line x1="345" y1="296" x2="345" y2="287" stroke="#6a6a68" strokeWidth="0.5" opacity="0.35" />
        <line x1="352" y1="297" x2="352" y2="288" stroke="#6a6a68" strokeWidth="0.5" opacity="0.35" />
        <line x1="359" y1="296" x2="359" y2="287" stroke="#6a6a68" strokeWidth="0.5" opacity="0.35" />
        <line x1="366" y1="297" x2="366" y2="288" stroke="#6a6a68" strokeWidth="0.5" opacity="0.35" />
        <line x1="373" y1="296" x2="373" y2="287" stroke="#6a6a68" strokeWidth="0.5" opacity="0.35" />
        {/* Collective breath haze */}
        <ellipse cx="359" cy="298" rx="15" ry="3" fill="url(#ch11_breath)" opacity="0.05">
          <animate attributeName="opacity" values="0.05;0.02;0.05" dur="5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== SUPPLY DEPOT — stacked crates and barrels near center ===== */}
      <g opacity="0.5">
        {/* Stacked ammunition crates */}
        <rect x="458" y="330" width="8" height="5" fill="url(#ch11_woodCarriage)" rx="0.5" />
        <rect x="458" y="325" width="8" height="5" fill="url(#ch11_woodCarriage)" rx="0.5" />
        <rect x="467" y="328" width="8" height="7" fill="url(#ch11_woodCarriage)" rx="0.5" />
        {/* Barrel — water or powder */}
        <ellipse cx="480" cy="332" rx="4" ry="5" fill="#3a3020" />
        <ellipse cx="480" cy="328" rx="4" ry="2" fill="#4a4030" />
        {/* Hoops on barrel */}
        <ellipse cx="480" cy="330" rx="4.2" ry="0.6" fill="none" stroke="#5a5040" strokeWidth="0.4" />
        <ellipse cx="480" cy="334" rx="4.2" ry="0.6" fill="none" stroke="#5a5040" strokeWidth="0.4" />
        {/* Snow on top */}
        <ellipse cx="462" cy="323" rx="5" ry="1.5" fill="#b8c0c8" opacity="0.3" />
        <ellipse cx="480" cy="327" rx="3.5" ry="1" fill="#b8c0c8" opacity="0.25" />
      </g>

      {/* ===== FRENCH VOLLEY — formation 1 just fired ===== */}
      <g opacity="0.35">
        {/* Flash ripple along formation 1 */}
        <ellipse cx="270" cy="294" rx="3" ry="2" fill="url(#ch11_volleyFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" begin="10s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="278" cy="295" rx="3" ry="2" fill="url(#ch11_volleyFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" begin="10.05s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="286" cy="294" rx="3" ry="2" fill="url(#ch11_volleyFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" begin="10.1s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="294" cy="295" rx="3" ry="2" fill="url(#ch11_volleyFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" begin="10.15s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="302" cy="294" rx="3" ry="2" fill="url(#ch11_volleyFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" begin="10.2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="310" cy="295" rx="3" ry="2" fill="url(#ch11_volleyFlash)" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.4s" begin="10.25s" repeatCount="indefinite" />
        </ellipse>
      </g>

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

      {/* Wounded soldier sitting against rock — holding side */}
      <g opacity="0.6">
        <ellipse cx="115" cy="325" rx="3.5" ry="8" fill="url(#ch11_frenchBlue)" />
        <circle cx="115" cy="321" r="2.5" fill="#3a3a40" />
        {/* Arm clutching wound */}
        <path d="M112 323 Q110 326 108 328" fill="none" stroke="#1a2848" strokeWidth="1.5" />
        {/* Blood stain in snow beneath */}
        <ellipse cx="112" cy="332" rx="5" ry="3" fill="url(#ch11_blood)" opacity="0.5" />
      </g>

      {/* Dead soldier — face-down in the snow */}
      <g opacity="0.45">
        <path d="M340 340 Q348 337 360 340 Q368 342 372 340" fill="none" stroke="#1a2848" strokeWidth="3.5" />
        <circle cx="337" cy="341" r="2.5" fill="#3a3a40" />
        {/* Arms spread */}
        <path d="M345 338 Q340 336 336 338" fill="none" stroke="#1a2848" strokeWidth="1.5" opacity="0.5" />
        <path d="M355 338 Q360 336 364 338" fill="none" stroke="#1a2848" strokeWidth="1.5" opacity="0.5" />
        {/* Musket dropped nearby */}
        <line x1="348" y1="344" x2="368" y2="346" stroke="#3a3a38" strokeWidth="1.2" opacity="0.4" />
      </g>

      {/* Wounded being helped to walk — two soldiers supporting a third */}
      <g opacity="0.55">
        {/* Left helper */}
        <ellipse cx="582" cy="318" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="582" cy="315" r="2" fill="#3a3a40" />
        {/* Wounded center — sagging between helpers */}
        <ellipse cx="590" cy="320" rx="2.5" ry="8" fill="url(#ch11_frenchBlue)" />
        <circle cx="590" cy="316" r="2" fill="#3a3a40" />
        {/* Right helper */}
        <ellipse cx="598" cy="318" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="598" cy="315" r="2" fill="#3a3a40" />
        {/* Supporting arms */}
        <path d="M584 317 Q587 318 589 319" fill="none" stroke="#1a2848" strokeWidth="1" opacity="0.4" />
        <path d="M596 317 Q593 318 591 319" fill="none" stroke="#1a2848" strokeWidth="1" opacity="0.4" />
        {/* Blood trail in snow */}
        <ellipse cx="586" cy="328" rx="3" ry="2" fill="url(#ch11_blood)" opacity="0.35" />
        <ellipse cx="592" cy="330" rx="2.5" ry="1.5" fill="url(#ch11_blood)" opacity="0.3" />
      </g>

      {/* === DISTANT AUSTRIAN POSITIONS === */}
      {/* Enemy gun flash — valley below, multiple positions */}
      <ellipse cx="280" cy="255" rx="6" ry="4" fill="url(#ch11_distFlash)" opacity="0.7">
        <animate attributeName="opacity" values="0;0.7;0" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="540" cy="258" rx="5" ry="3" fill="url(#ch11_distFlash)" opacity="0.6">
        <animate attributeName="opacity" values="0;0.6;0" dur="5s" repeatCount="indefinite" begin="1s" />
      </ellipse>
      {/* Additional gun flashes */}
      <ellipse cx="180" cy="268" rx="4" ry="3" fill="url(#ch11_distFlash)" opacity="0.5">
        <animate attributeName="opacity" values="0;0.5;0" dur="6s" repeatCount="indefinite" begin="2.5s" />
      </ellipse>
      <ellipse cx="420" cy="260" rx="5" ry="3.5" fill="url(#ch11_distFlash)" opacity="0.55">
        <animate attributeName="opacity" values="0;0.55;0" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
      </ellipse>
      <ellipse cx="680" cy="262" rx="4" ry="2.5" fill="url(#ch11_distFlash)" opacity="0.4">
        <animate attributeName="opacity" values="0;0.4;0" dur="5.5s" repeatCount="indefinite" begin="3s" />
      </ellipse>

      {/* Distant smoke from Austrian batteries — more positions */}
      <ellipse cx="290" cy="250" rx="20" ry="10" fill="url(#ch11_smoke)" opacity="0.3">
        <animate attributeName="ry" values="10;14;10" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="550" cy="253" rx="18" ry="9" fill="url(#ch11_smoke)" opacity="0.25">
        <animate attributeName="ry" values="9;13;9" dur="12s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="190" cy="264" rx="15" ry="7" fill="url(#ch11_smoke)" opacity="0.2">
        <animate attributeName="ry" values="7;10;7" dur="11s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="430" cy="256" rx="16" ry="8" fill="url(#ch11_smoke)" opacity="0.22">
        <animate attributeName="ry" values="8;12;8" dur="13s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="690" cy="258" rx="14" ry="6" fill="url(#ch11_smoke)" opacity="0.18">
        <animate attributeName="ry" values="6;9;6" dur="11s" repeatCount="indefinite" />
      </ellipse>

      {/* Smoke columns rising from valley — thick plumes from battle below */}
      <path d="M280 250 Q275 230 280 210 Q275 195 280 180"
        fill="none" stroke="#7a8088" strokeWidth="3" opacity="0.08" strokeLinecap="round">
        <animate attributeName="d"
          values="M280 250 Q275 230 280 210 Q275 195 280 180;
                  M280 250 Q285 228 278 208 Q283 192 278 178;
                  M280 250 Q275 230 280 210 Q275 195 280 180"
          dur="16s" repeatCount="indefinite" />
      </path>
      <path d="M540 253 Q535 235 540 218 Q535 205 540 190"
        fill="none" stroke="#7a8088" strokeWidth="2.5" opacity="0.06" strokeLinecap="round">
        <animate attributeName="d"
          values="M540 253 Q535 235 540 218 Q535 205 540 190;
                  M540 253 Q545 233 538 216 Q543 202 538 188;
                  M540 253 Q535 235 540 218 Q535 205 540 190"
          dur="18s" repeatCount="indefinite" />
      </path>
      <path d="M430 256 Q425 240 430 225 Q427 215 430 205"
        fill="none" stroke="#7a8088" strokeWidth="2" opacity="0.05" strokeLinecap="round">
        <animate attributeName="d"
          values="M430 256 Q425 240 430 225 Q427 215 430 205;
                  M430 256 Q435 238 428 223 Q433 212 428 202;
                  M430 256 Q425 240 430 225 Q427 215 430 205"
          dur="14s" repeatCount="indefinite" />
      </path>

      {/* ===== DRUMMER BOY — near center flag, beating to arms ===== */}
      <g opacity="0.65">
        <ellipse cx="405" cy="316" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="405" cy="313" r="2" fill="#3a3a40" />
        {/* Drum — slung at waist */}
        <ellipse cx="408" cy="318" rx="3.5" ry="2.5" fill="#c0a878" opacity="0.5" />
        <ellipse cx="408" cy="318" rx="3.5" ry="2.5" fill="none" stroke="#3a3028" strokeWidth="0.4" opacity="0.5" />
        {/* Drumstick arm motion */}
        <line x1="407" y1="315" x2="412" y2="317" stroke="#3a3a40" strokeWidth="0.6" opacity="0.5">
          <animate attributeName="y2" values="317;315;317" dur="0.8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* ===== HORSE LINES — tethered horses in background ===== */}
      <g opacity="0.5">
        {/* Rope line between posts */}
        <line x1="320" y1="332" x2="360" y2="330" stroke="#3a3028" strokeWidth="0.6" />
        {/* Horse 1 */}
        <ellipse cx="328" cy="328" rx="6" ry="4" fill="#1a1818" />
        <ellipse cx="324" cy="326" rx="3" ry="3" fill="#1a1818" />
        <rect x="326" y="330" width="1.5" height="5" fill="#141414" rx="0.5" />
        <rect x="330" y="330" width="1.5" height="5" fill="#141414" rx="0.5" />
        {/* Horse blanket */}
        <ellipse cx="328" cy="327" rx="5" ry="3" fill="url(#ch11_horseBlanket)" opacity="0.6" />
        {/* Horse 2 */}
        <ellipse cx="345" cy="327" rx="6" ry="4" fill="#222018" />
        <ellipse cx="341" cy="325" rx="3" ry="3" fill="#222018" />
        <rect x="343" y="329" width="1.5" height="5" fill="#1a1810" rx="0.5" />
        <rect x="347" y="329" width="1.5" height="5" fill="#1a1810" rx="0.5" />
        <ellipse cx="345" cy="326" rx="5" ry="3" fill="url(#ch11_horseBlanket)" opacity="0.5" />
        {/* Horse breath */}
        <ellipse cx="322" cy="325" rx="3" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.15;0;0.15" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="339" cy="324" rx="3" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0;0.12;0" dur="5s" repeatCount="indefinite" begin="1.5s" />
        </ellipse>
      </g>

      {/* ===== SENTRY — standing guard at plateau edge ===== */}
      <g opacity="0.7">
        <ellipse cx="360" cy="288" rx="2.5" ry="8" fill="url(#ch11_frenchBlue)" />
        <circle cx="360" cy="284" r="2.5" fill="#3a3a40" />
        {/* Shako */}
        <rect x="357" y="281" width="6" height="2.5" fill="#1a1a28" rx="0.5" />
        {/* Musket held upright */}
        <line x1="363" y1="282" x2="363" y2="270" stroke="#4a4a48" strokeWidth="1" opacity="0.6" />
        {/* Bayonet */}
        <line x1="363" y1="270" x2="363" y2="265" stroke="#6a6a68" strokeWidth="0.5" opacity="0.5" />
        {/* Breath */}
        <ellipse cx="362" cy="283" rx="3" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.2;0;0.2" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Long dawn shadow stretching left */}
        <ellipse cx="355" cy="296" rx="8" ry="2" fill="url(#ch11_snowGroundShadow)" opacity="0.3" />
      </g>

      {/* ===== OFFICER ON FOOT — reading dispatch by firelight ===== */}
      <g opacity="0.65">
        <ellipse cx="370" cy="326" rx="3" ry="8" fill="url(#ch11_officerCloak)" />
        <circle cx="370" cy="322" r="2.5" fill="#2a3040" />
        {/* Bicorne */}
        <ellipse cx="370" cy="320" rx="5" ry="1.5" fill="#0a0a14" />
        {/* Paper held up — catching firelight */}
        <rect x="373" y="323" width="4" height="3" fill="#d8d0c0" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.25;0.35" dur="1.8s" repeatCount="indefinite" />
        </rect>
        {/* Warm fire glow on face */}
        <ellipse cx="371" cy="322" rx="1.5" ry="2" fill="rgba(200,120,60,0.08)" />
      </g>

      {/* ===== SUPPLY TRAIN — additional wagons and mules in background ===== */}
      {/* Pack mule — carrying ammunition boxes */}
      <g opacity="0.45">
        <ellipse cx="240" cy="335" rx="6" ry="4" fill="#3a3830" />
        <ellipse cx="236" cy="333" rx="3" ry="3.5" fill="#3a3830" />
        <rect x="238" y="337" width="1.5" height="5" fill="#2a2820" rx="0.5" />
        <rect x="242" y="337" width="1.5" height="5" fill="#2a2820" rx="0.5" />
        {/* Pack boxes on sides */}
        <rect x="237" y="331" width="6" height="4" fill="url(#ch11_woodCarriage)" opacity="0.6" />
        {/* Muleteer */}
        <ellipse cx="230" cy="338" rx="2" ry="6" fill="#2a2a30" opacity="0.6" />
        <circle cx="230" cy="336" r="1.5" fill="#3a3a40" opacity="0.6" />
      </g>

      {/* ===== SIGNAL FLAG — semaphore communication ===== */}
      <g opacity="0.5">
        <rect x="650" y="285" width="1.5" height="20" fill="#3a3028" />
        {/* Small signal flag — being waved */}
        <rect x="651.5" y="286" width="6" height="4" fill="#a82020" opacity="0.6">
          <animate attributeName="width" values="6;7;6" dur="2s" repeatCount="indefinite" />
        </rect>
        {/* Signalman */}
        <ellipse cx="650" cy="308" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" opacity="0.6" />
        <circle cx="650" cy="305" r="2" fill="#3a3a40" opacity="0.6" />
      </g>

      {/* ===== ADDITIONAL ROCKY OUTCROPS — mid-ground terrain detail ===== */}
      {/* Boulder cluster center-left */}
      <ellipse cx="260" cy="310" rx="18" ry="12" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" opacity="0.5" />
      <ellipse cx="265" cy="306" rx="12" ry="3" fill="#b8c0c8" opacity="0.3" />
      {/* Small embedded rocks — scattered */}
      <ellipse cx="410" cy="340" rx="8" ry="5" fill="url(#ch11_rock)" opacity="0.35" />
      <ellipse cx="550" cy="342" rx="6" ry="4" fill="url(#ch11_rock)" opacity="0.3" />
      <ellipse cx="330" cy="345" rx="7" ry="4.5" fill="url(#ch11_rock)" opacity="0.3" />

      {/* ===== ADDITIONAL FROZEN STREAM DETAILS ===== */}
      {/* Ice crack patterns on the frozen stream */}
      <g opacity="0.15">
        <path d="M200 337 Q210 335 220 337" fill="none" stroke="#c8d0d8" strokeWidth="0.3" />
        <path d="M210 336 Q215 338 220 336" fill="none" stroke="#c8d0d8" strokeWidth="0.25" />
        <path d="M400 340 Q410 338 420 340" fill="none" stroke="#c8d0d8" strokeWidth="0.3" />
        <path d="M600 343 Q610 341 620 343" fill="none" stroke="#c8d0d8" strokeWidth="0.25" />
      </g>
      {/* Snow bridges over stream */}
      <ellipse cx="250" cy="337" rx="15" ry="4" fill="url(#ch11_snowDrift)" opacity="0.4" />
      <ellipse cx="500" cy="341" rx="12" ry="3.5" fill="url(#ch11_snowDrift)" opacity="0.35" />

      {/* ===== DISTANT FRENCH CAVALRY — patrol on left flank ===== */}
      <g opacity="0.4">
        {/* Rider 1 */}
        <ellipse cx="35" cy="298" rx="7" ry="4.5" fill="#1a1818" />
        <ellipse cx="30" cy="296" rx="3" ry="3.5" fill="#1a1818" />
        <ellipse cx="35" cy="292" rx="2.5" ry="5" fill="url(#ch11_frenchBlue)" />
        <circle cx="35" cy="290" r="2" fill="#3a3a40" />
        <rect x="33" y="300" width="1.5" height="5" fill="#141414" rx="0.5" />
        <rect x="37" y="300" width="1.5" height="5" fill="#141414" rx="0.5" />
        {/* Sabre raised */}
        <line x1="37" y1="289" x2="40" y2="282" stroke="#6a6a68" strokeWidth="0.6" opacity="0.4" />
        {/* Rider 2 */}
        <ellipse cx="55" cy="300" rx="7" ry="4.5" fill="#1a1818" />
        <ellipse cx="50" cy="298" rx="3" ry="3.5" fill="#1a1818" />
        <ellipse cx="55" cy="294" rx="2.5" ry="5" fill="url(#ch11_frenchBlue)" />
        <circle cx="55" cy="292" r="2" fill="#3a3a40" />
        <rect x="53" y="302" width="1.5" height="5" fill="#141414" rx="0.5" />
        <rect x="57" y="302" width="1.5" height="5" fill="#141414" rx="0.5" />
        {/* Horse breath */}
        <ellipse cx="28" cy="295" rx="3" ry="1.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.12;0;0.12" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== WALKING SOLDIERS — individual figures moving across the plateau ===== */}
      {/* Soldier carrying firewood */}
      <g opacity="0.55">
        <ellipse cx="435" cy="328" rx="3" ry="8" fill="url(#ch11_frenchBlue)" />
        <circle cx="435" cy="324" r="2.5" fill="#3a3a40" />
        {/* Bundle of sticks on shoulder */}
        <line x1="432" y1="323" x2="440" y2="320" stroke="#3a3028" strokeWidth="1.5" opacity="0.5" />
        <line x1="440" y1="320" x2="445" y2="318" stroke="#3a3028" strokeWidth="1" opacity="0.4" />
        <line x1="440" y1="320" x2="444" y2="322" stroke="#3a3028" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Soldier kneeling — cleaning musket */}
      <g opacity="0.55">
        <ellipse cx="580" cy="332" rx="3" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="580" cy="329" r="2" fill="#3a3a40" />
        {/* Musket laid across knees */}
        <line x1="575" y1="334" x2="592" y2="332" stroke="#4a4a48" strokeWidth="1" opacity="0.5" />
        {/* Cleaning rod */}
        <line x1="586" y1="330" x2="595" y2="328" stroke="#5a5a58" strokeWidth="0.4" opacity="0.3" />
      </g>

      {/* Soldier sitting on rock — eating rations */}
      <g opacity="0.5">
        <ellipse cx="130" cy="338" rx="3" ry="6" fill="url(#ch11_frenchBlue)" />
        <circle cx="130" cy="335" r="2" fill="#3a3a40" />
        {/* Hand to mouth */}
        <path d="M132 336 Q134 335 135 334" fill="none" stroke="#3a3a40" strokeWidth="0.8" opacity="0.4" />
        {/* Shako set beside him */}
        <path d="M124 340 Q126 337 129 338 Q131 340 129 341 Z" fill="#1a1a28" opacity="0.35" />
      </g>

      {/* ===== FIELD CEMETERY CROSSES — somber reminder of cost ===== */}
      <g opacity="0.35">
        {/* Cross 1 */}
        <line x1="100" y1="345" x2="100" y2="335" stroke="#3a3028" strokeWidth="1.2" />
        <line x1="96" y1="338" x2="104" y2="338" stroke="#3a3028" strokeWidth="1" />
        {/* Cross 2 */}
        <line x1="108" y1="347" x2="108" y2="337" stroke="#3a3028" strokeWidth="1.2" />
        <line x1="104" y1="340" x2="112" y2="340" stroke="#3a3028" strokeWidth="1" />
        {/* Cross 3 */}
        <line x1="116" y1="346" x2="116" y2="336" stroke="#3a3028" strokeWidth="1" />
        <line x1="113" y1="339" x2="119" y2="339" stroke="#3a3028" strokeWidth="0.8" />
        {/* Snow on cross tops */}
        <ellipse cx="100" cy="335" rx="2" ry="0.8" fill="#c8d0d8" opacity="0.4" />
        <ellipse cx="108" cy="337" rx="2" ry="0.8" fill="#c8d0d8" opacity="0.35" />
        {/* Disturbed snow around graves */}
        <ellipse cx="104" cy="350" rx="20" ry="4" fill="url(#ch11_frozenEarth)" opacity="0.1" />
      </g>

      {/* ===== CROWS — scavengers circling in dawn sky ===== */}
      {/* Crow 1 — large, slow circle */}
      <g opacity="0.35">
        <path d="M350 140 Q354 137 358 140 Q362 137 366 140" fill="none" stroke="#1a1818" strokeWidth="1.2" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 358 160;360 358 160" dur="25s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Crow 2 — smaller, tighter circle */}
      <g opacity="0.28">
        <path d="M480 120 Q483 118 486 120 Q489 118 492 120" fill="none" stroke="#1a1818" strokeWidth="1" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="360 486 140;0 486 140" dur="20s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Crow 3 — distant drifting */}
      <g opacity="0.2">
        <path d="M240 100 Q242 98 244 100 Q246 98 248 100" fill="none" stroke="#1a1818" strokeWidth="0.8" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 0;30 5;60 -3;90 8" dur="22s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Crow on bare tree — perched, watching */}
      <g opacity="0.45">
        <ellipse cx="230" cy="292" rx="2" ry="1.5" fill="#1a1818" />
        <circle cx="228" cy="291" r="1" fill="#1a1818" />
        {/* Beak */}
        <line x1="227" y1="291" x2="225" y2="291.5" stroke="#3a3028" strokeWidth="0.5" />
      </g>

      {/* ===== ADDITIONAL SMOKE WISPS — battlefield haze drifting across plateau ===== */}
      {/* Heavy smoke bank rolling from valley — caught in mountain thermals */}
      <ellipse cx="350" cy="260" rx="80" ry="10" fill="#8a9098" opacity="0.025">
        <animate attributeName="cx" values="350;380;350" dur="24s" repeatCount="indefinite" />
        <animate attributeName="rx" values="80;100;80" dur="24s" repeatCount="indefinite" />
      </ellipse>
      {/* Thin wispy smoke crossing mid-ground */}
      <path d="M100 290 Q200 285 300 290 Q400 285 500 290"
        fill="none" stroke="#8a9098" strokeWidth="1.5" opacity="0.025">
        <animate attributeName="d"
          values="M100 290 Q200 285 300 290 Q400 285 500 290;
                  M100 290 Q200 292 300 288 Q400 292 500 290;
                  M100 290 Q200 285 300 290 Q400 285 500 290"
          dur="20s" repeatCount="indefinite" />
      </path>

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

      {/* Second layer of blowing snow — different speed, direction */}
      <rect x="0" y="0" width="800" height="400" fill="url(#ch11_windSnow)" opacity="0.15">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="40 10"
          dur="12s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Individual large snowflakes — foreground, falling slowly */}
      <circle cx="50" cy="100" r="1" fill="#e0e8f0" opacity="0.2">
        <animate attributeName="cy" values="100;400" dur="15s" repeatCount="indefinite" />
        <animate attributeName="cx" values="50;80" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.3;0.1" dur="15s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="50" r="0.8" fill="#d8e0e8" opacity="0.15">
        <animate attributeName="cy" values="50;400" dur="18s" repeatCount="indefinite" />
        <animate attributeName="cx" values="200;230" dur="18s" repeatCount="indefinite" />
      </circle>
      <circle cx="400" cy="30" r="1.2" fill="#e0e8f0" opacity="0.18">
        <animate attributeName="cy" values="30;400" dur="16s" repeatCount="indefinite" begin="3s" />
        <animate attributeName="cx" values="400;430" dur="16s" repeatCount="indefinite" begin="3s" />
      </circle>
      <circle cx="600" cy="80" r="0.9" fill="#d8e0e8" opacity="0.15">
        <animate attributeName="cy" values="80;400" dur="14s" repeatCount="indefinite" begin="5s" />
        <animate attributeName="cx" values="600;625" dur="14s" repeatCount="indefinite" begin="5s" />
      </circle>
      <circle cx="750" cy="120" r="1" fill="#e0e8f0" opacity="0.12">
        <animate attributeName="cy" values="120;400" dur="17s" repeatCount="indefinite" begin="2s" />
        <animate attributeName="cx" values="750;775" dur="17s" repeatCount="indefinite" begin="2s" />
      </circle>
      <circle cx="300" cy="150" r="0.7" fill="#d8e0e8" opacity="0.1">
        <animate attributeName="cy" values="150;400" dur="20s" repeatCount="indefinite" begin="7s" />
        <animate attributeName="cx" values="300;320" dur="20s" repeatCount="indefinite" begin="7s" />
      </circle>
      <circle cx="520" cy="60" r="1.1" fill="#e0e8f0" opacity="0.15">
        <animate attributeName="cy" values="60;400" dur="19s" repeatCount="indefinite" begin="4s" />
        <animate attributeName="cx" values="520;548" dur="19s" repeatCount="indefinite" begin="4s" />
      </circle>
      <circle cx="150" cy="180" r="0.8" fill="#d8e0e8" opacity="0.12">
        <animate attributeName="cy" values="180;400" dur="13s" repeatCount="indefinite" begin="6s" />
        <animate attributeName="cx" values="150;168" dur="13s" repeatCount="indefinite" begin="6s" />
      </circle>

      {/* Atmospheric haze — distance */}
      <rect x="0" y="200" width="800" height="100" fill="url(#ch11_haze)" opacity="0.6" />

      {/* === FOREGROUND ELEMENTS === */}
      {/* Boot tracks in snow — foreground, multiple trails */}
      <ellipse cx="100" cy="360" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="115" cy="365" rx="7" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="130" cy="362" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="145" cy="367" rx="7" ry="3.5" fill="url(#ch11_tracks)" opacity="0.35" />
      <ellipse cx="160" cy="364" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.35" />
      <ellipse cx="500" cy="368" rx="9" ry="5" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="518" cy="372" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="535" cy="370" rx="9" ry="5" fill="url(#ch11_tracks)" opacity="0.4" />
      <ellipse cx="552" cy="374" rx="8" ry="4" fill="url(#ch11_tracks)" opacity="0.35" />
      {/* Cannon wheel ruts in snow — deeper tracks */}
      <path d="M200 355 Q250 358 300 354 Q350 357 400 355"
        fill="none" stroke="url(#ch11_tracks)" strokeWidth="3" opacity="0.25" />
      <path d="M200 360 Q250 363 300 359 Q350 362 400 360"
        fill="none" stroke="url(#ch11_tracks)" strokeWidth="3" opacity="0.25" />
      {/* Individual boot impressions — close foreground */}
      <g opacity="0.3">
        <ellipse cx="310" cy="365" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="320" cy="368" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="330" cy="366" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="340" cy="369" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="350" cy="367" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="360" cy="370" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="370" cy="368" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="380" cy="371" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="390" cy="369" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
        <ellipse cx="400" cy="372" rx="2.5" ry="1.5" fill="url(#ch11_tracks)" />
      </g>

      {/* Foreground snow drift — large accumulation */}
      <ellipse cx="700" cy="380" rx="120" ry="30" fill="url(#ch11_groundSnow)" opacity="0.9" />
      <ellipse cx="700" cy="375" rx="100" ry="15" fill="url(#ch11_snowDrift)" opacity="0.6" />

      {/* Foreground snow drift — left side */}
      <ellipse cx="150" cy="385" rx="80" ry="25" fill="url(#ch11_groundSnow)" opacity="0.85" />
      <ellipse cx="150" cy="380" rx="65" ry="12" fill="url(#ch11_snowDrift)" opacity="0.5" />

      {/* Foreground rock — partially covered */}
      <ellipse cx="80" cy="375" rx="35" ry="25" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" opacity="0.9" />
      <ellipse cx="80" cy="368" rx="30" ry="8" fill="#b8c0c8" opacity="0.7" />

      {/* Additional foreground rock — right */}
      <ellipse cx="760" cy="385" rx="30" ry="20" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" opacity="0.8" />
      <ellipse cx="760" cy="378" rx="25" ry="6" fill="#b8c0c8" opacity="0.6" />
      {/* Icicles hanging from rock edge */}
      <line x1="748" y1="370" x2="748" y2="377" stroke="url(#ch11_icicle)" strokeWidth="0.8" />
      <line x1="752" y1="369" x2="752" y2="378" stroke="url(#ch11_icicle)" strokeWidth="0.7" />
      <line x1="756" y1="370" x2="756" y2="376" stroke="url(#ch11_icicle)" strokeWidth="0.6" />

      {/* Foreground rock — center */}
      <ellipse cx="420" cy="382" rx="22" ry="15" fill="url(#ch11_rock)" filter="url(#ch11_rockTexture)" opacity="0.75" />
      <ellipse cx="420" cy="377" rx="18" ry="5" fill="#b8c0c8" opacity="0.5" />

      {/* ===== FOREGROUND SOLDIER — closer, more detailed ===== */}
      {/* Soldier crouching at foreground, looking toward the valley */}
      <g opacity="0.8">
        <ellipse cx="180" cy="360" rx="4" ry="10" fill="url(#ch11_frenchBlue)" />
        <circle cx="180" cy="355" r="3.5" fill="#3a3a40" />
        {/* Shako hat */}
        <rect x="177" y="351" width="6" height="3" fill="#1a1a28" rx="0.5" />
        <ellipse cx="180" cy="351" rx="3.5" ry="1" fill="#1a1a28" />
        {/* Crossbelt — white */}
        <line x1="177" y1="356" x2="183" y2="365" stroke="#8a8a80" strokeWidth="0.6" opacity="0.4" />
        <line x1="183" y1="356" x2="177" y2="365" stroke="#8a8a80" strokeWidth="0.6" opacity="0.4" />
        {/* Musket held across body */}
        <line x1="175" y1="358" x2="190" y2="352" stroke="#4a4a48" strokeWidth="1.2" opacity="0.6" />
        {/* Bayonet */}
        <line x1="190" y1="352" x2="194" y2="349" stroke="#6a6a68" strokeWidth="0.6" opacity="0.5" />
        {/* Breath vapor */}
        <ellipse cx="183" cy="354" rx="3.5" ry="2" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* Dawn light catching face */}
        <ellipse cx="182" cy="355" rx="1.5" ry="2" fill="rgba(200,140,80,0.06)" />
      </g>

      {/* ===== FOREGROUND DEAD VEGETATION — dried stalks poking through snow ===== */}
      <g opacity="0.25">
        <path d="M650 365 Q651 358 653 350" fill="none" stroke="#5a5838" strokeWidth="0.7" />
        <path d="M654 366 Q656 360 657 352" fill="none" stroke="#5a5838" strokeWidth="0.6" />
        <path d="M648 367 Q646 360 647 353" fill="none" stroke="#5a5838" strokeWidth="0.6" />
      </g>
      <g opacity="0.2">
        <path d="M280 372 Q282 366 283 360" fill="none" stroke="#5a5838" strokeWidth="0.5" />
        <path d="M284 373 Q285 367 284 361" fill="none" stroke="#5a5838" strokeWidth="0.5" />
      </g>

      {/* ===== FOREGROUND SOLDIER 2 — sitting, warming hands toward viewer ===== */}
      <g opacity="0.75">
        <ellipse cx="650" cy="365" rx="4" ry="10" fill="url(#ch11_frenchBlue)" />
        <circle cx="650" cy="360" r="3.5" fill="#3a3a40" />
        {/* Shako */}
        <rect x="647" y="356" width="6" height="3" fill="#1a1a28" rx="0.5" />
        {/* Arms extended toward viewer — cupping hands */}
        <path d="M646 363 Q644 366 642 368" fill="none" stroke="url(#ch11_frenchBlue)" strokeWidth="1.5" />
        <path d="M654 363 Q656 366 658 368" fill="none" stroke="url(#ch11_frenchBlue)" strokeWidth="1.5" />
        {/* Musket propped against nearby rock */}
        <line x1="660" y1="355" x2="662" y2="375" stroke="#4a4a48" strokeWidth="1.2" opacity="0.5" />
        {/* Breath */}
        <ellipse cx="652" cy="359" rx="4" ry="2.5" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="rx" values="4;5.5;4" dur="3.2s" repeatCount="indefinite" />
        </ellipse>
        {/* Knapsack on ground beside */}
        <ellipse cx="642" cy="372" rx="4" ry="3" fill="#2a2830" opacity="0.5" />
      </g>

      {/* ===== FOREGROUND SOLDIER 3 — lying prone, looking over plateau edge ===== */}
      <g opacity="0.7">
        <path d="M480 368 Q492 365 504 368 Q510 370 514 368" fill="none" stroke="url(#ch11_frenchBlue)" strokeWidth="3.5" />
        <circle cx="516" cy="366" r="3" fill="#3a3a40" />
        {/* Musket extended forward */}
        <line x1="518" y1="366" x2="530" y2="364" stroke="#4a4a48" strokeWidth="1.2" opacity="0.5" />
        {/* Bayonet */}
        <line x1="530" y1="364" x2="534" y2="363" stroke="#6a6a68" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* ===== DETAIL: WATER BUCKET WITH ICE ===== */}
      <g opacity="0.45">
        <ellipse cx="395" cy="335" rx="3.5" ry="2.5" fill="#3a3838" />
        <ellipse cx="395" cy="334" rx="3" ry="2" fill="#5a6878" opacity="0.4" />
        {/* Handle */}
        <path d="M392 333 Q395 330 398 333" fill="none" stroke="#3a3838" strokeWidth="0.5" />
        {/* Ice forming on surface */}
        <ellipse cx="395" cy="334" rx="2.5" ry="1.5" fill="#b8c8d8" opacity="0.2" />
      </g>

      {/* ===== DETAIL: COOKING POT ON FIRE 2 ===== */}
      <g opacity="0.5">
        {/* Iron pot — hung over fire on tripod */}
        <line x1="376" y1="312" x2="380" y2="318" stroke="#3a3838" strokeWidth="0.6" />
        <line x1="384" y1="312" x2="380" y2="318" stroke="#3a3838" strokeWidth="0.6" />
        <line x1="380" y1="312" x2="380" y2="316" stroke="#3a3838" strokeWidth="0.5" />
        <ellipse cx="380" cy="317" rx="3.5" ry="2" fill="#2a2a28" />
        {/* Steam from pot */}
        <path d="M380 315 Q378 310 380 306" fill="none" stroke="#a8b0b8" strokeWidth="0.6" opacity="0.12">
          <animate attributeName="d"
            values="M380 315 Q378 310 380 306;M380 315 Q382 309 380 304;M380 315 Q378 310 380 306"
            dur="4s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ===== DETAIL: REGIMENTAL EAGLE — near officer's tent ===== */}
      <g opacity="0.6">
        {/* Pole */}
        <rect x="348" y="296" width="1.5" height="18" fill="#3a3028" />
        {/* Eagle ornament on top — golden glint */}
        <path d="M347 296 Q349 293 351 296" fill="#c8a838" opacity="0.5" />
        <circle cx="349" cy="294" r="1" fill="#d0b040" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.25;0.4" dur="5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ===== FROZEN PUDDLES — ice patches on the ground ===== */}
      <ellipse cx="330" cy="356" rx="12" ry="4" fill="#5a6878" opacity="0.2" />
      <ellipse cx="330" cy="355" rx="10" ry="2.5" fill="#8898a8" opacity="0.1" />
      <ellipse cx="580" cy="360" rx="10" ry="3.5" fill="#5a6878" opacity="0.18" />
      <ellipse cx="580" cy="359" rx="8" ry="2" fill="#8898a8" opacity="0.08" />

      {/* ===== SPENT CARTRIDGE PAPER — litter from musket fire ===== */}
      <g opacity="0.15">
        <rect x="270" y="305" width="2" height="1.5" fill="#d0c8b8" rx="0.3" />
        <rect x="280" y="307" width="1.8" height="1.3" fill="#c8c0b0" rx="0.3" />
        <rect x="295" y="304" width="2" height="1.5" fill="#d0c8b8" rx="0.3" />
        <rect x="490" y="306" width="1.8" height="1.3" fill="#c8c0b0" rx="0.3" />
        <rect x="500" y="308" width="2" height="1.5" fill="#d0c8b8" rx="0.3" />
      </g>

      {/* ===== SHADOW DETAIL — objects casting blue-tinted shadows on snow ===== */}
      {/* Napoleon's group shadow */}
      <ellipse cx="420" cy="322" rx="25" ry="5" fill="url(#ch11_snowGroundShadow)" opacity="0.5" />
      {/* Pine tree shadows — long dawn shadows stretching left */}
      <ellipse cx="190" cy="332" rx="20" ry="4" fill="url(#ch11_snowGroundShadow)" opacity="0.3" />
      <ellipse cx="600" cy="338" rx="22" ry="4" fill="url(#ch11_snowGroundShadow)" opacity="0.3" />
      {/* Rock shadows */}
      <ellipse cx="130" cy="330" rx="35" ry="5" fill="url(#ch11_snowGroundShadow)" opacity="0.25" />
      <ellipse cx="690" cy="328" rx="40" ry="5" fill="url(#ch11_snowGroundShadow)" opacity="0.25" />

      {/* ===== FOREGROUND DETAIL: TRAMPLED CAMPFIRE AREA ===== */}
      {/* Charred wood pieces near fire 2 — scattered remains */}
      <g opacity="0.25">
        <line x1="372" y1="330" x2="378" y2="332" stroke="#1a1810" strokeWidth="1.5" />
        <line x1="382" y1="331" x2="388" y2="330" stroke="#1a1810" strokeWidth="1.2" />
        <line x1="375" y1="334" x2="380" y2="336" stroke="#1a1810" strokeWidth="1" />
      </g>
      {/* Ash circle around fire 2 — grey stain in snow */}
      <ellipse cx="380" cy="328" rx="14" ry="6" fill="#4a4a48" opacity="0.06" />

      {/* ===== SCATTERED STRAW — bedding material around tents ===== */}
      <g opacity="0.12">
        <line x1="248" y1="330" x2="253" y2="332" stroke="#6a6040" strokeWidth="0.5" />
        <line x1="250" y1="332" x2="255" y2="331" stroke="#6a6040" strokeWidth="0.4" />
        <line x1="245" y1="331" x2="250" y2="333" stroke="#6a6040" strokeWidth="0.4" />
        <line x1="282" y1="332" x2="287" y2="334" stroke="#6a6040" strokeWidth="0.5" />
        <line x1="284" y1="334" x2="289" y2="333" stroke="#6a6040" strokeWidth="0.4" />
        <line x1="518" y1="335" x2="523" y2="337" stroke="#6a6040" strokeWidth="0.4" />
        <line x1="520" y1="337" x2="525" y2="336" stroke="#6a6040" strokeWidth="0.4" />
      </g>

      {/* ===== PEBBLE AND STONE SCATTER — ground texture ===== */}
      <g opacity="0.2">
        <ellipse cx="300" cy="350" rx="1.5" ry="0.8" fill="#4a4840" />
        <ellipse cx="305" cy="352" rx="1.2" ry="0.6" fill="#4a4840" />
        <ellipse cx="310" cy="349" rx="1.8" ry="0.9" fill="#4a4840" />
        <ellipse cx="450" cy="353" rx="1.3" ry="0.7" fill="#4a4840" />
        <ellipse cx="455" cy="355" rx="1.5" ry="0.8" fill="#4a4840" />
        <ellipse cx="600" cy="352" rx="1.2" ry="0.6" fill="#4a4840" />
        <ellipse cx="605" cy="354" rx="1.6" ry="0.8" fill="#4a4840" />
        <ellipse cx="350" cy="363" rx="2" ry="1" fill="#4a4840" />
        <ellipse cx="420" cy="360" rx="1.5" ry="0.8" fill="#4a4840" />
        <ellipse cx="550" cy="358" rx="1.8" ry="0.9" fill="#4a4840" />
        <ellipse cx="700" cy="365" rx="1.3" ry="0.7" fill="#4a4840" />
      </g>

      {/* ===== ROPE COILS — near supply area ===== */}
      <g opacity="0.35">
        <ellipse cx="320" cy="336" rx="3.5" ry="2.5" fill="none" stroke="#4a4030" strokeWidth="0.8" />
        <ellipse cx="320" cy="336" rx="2" ry="1.5" fill="none" stroke="#4a4030" strokeWidth="0.6" />
      </g>

      {/* ===== LANTERN ON POLE — near officer's tent, faint glow ===== */}
      <g opacity="0.5">
        <line x1="355" y1="302" x2="355" y2="312" stroke="#3a3028" strokeWidth="1" />
        {/* Lantern box */}
        <rect x="352" y="302" width="5" height="4" fill="#4a4838" rx="0.5" />
        {/* Faint warm glow */}
        <ellipse cx="355" cy="304" rx="8" ry="6" fill="#c08040" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.03;0.06" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* Candle flicker inside */}
        <rect x="354" y="303" width="1.5" height="2" fill="#d8a050" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="1.2s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* ===== ADDITIONAL BREATH VAPOR — cold air effects ===== */}
      {/* Collective breath haze from soldier group around fire 1 */}
      <ellipse cx="135" cy="303" rx="8" ry="4" fill="url(#ch11_breath)" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.03;0.08" dur="6s" repeatCount="indefinite" />
      </ellipse>
      {/* Collective breath from fire 2 group */}
      <ellipse cx="380" cy="318" rx="10" ry="5" fill="url(#ch11_breath)" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="7s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ADDITIONAL FOREGROUND DEAD GRASS ===== */}
      <g opacity="0.18">
        <path d="M420 375 Q421 368 423 362" fill="none" stroke="#5a5838" strokeWidth="0.6" />
        <path d="M424 376 Q425 370 424 364" fill="none" stroke="#5a5838" strokeWidth="0.5" />
        <path d="M418 377 Q416 370 417 365" fill="none" stroke="#5a5838" strokeWidth="0.5" />
      </g>
      <g opacity="0.15">
        <path d="M720 372 Q721 366 723 360" fill="none" stroke="#5a5838" strokeWidth="0.5" />
        <path d="M724 373 Q725 367 724 362" fill="none" stroke="#5a5838" strokeWidth="0.4" />
      </g>

      {/* ===== ADDITIONAL CAMP DETAILS ===== */}
      {/* Stacked drums — near officer's tent */}
      <g opacity="0.4">
        <ellipse cx="330" cy="330" rx="3" ry="2" fill="#c0a878" />
        <rect x="327" y="328" width="6" height="4" fill="#b09868" stroke="#3a3028" strokeWidth="0.3" rx="0.5" />
        <ellipse cx="330" cy="328" rx="3" ry="1.5" fill="#c0a878" opacity="0.6" />
        {/* Drumsticks crossed on top */}
        <line x1="328" y1="327" x2="332" y2="329" stroke="#3a3028" strokeWidth="0.4" />
        <line x1="332" y1="327" x2="328" y2="329" stroke="#3a3028" strokeWidth="0.4" />
      </g>

      {/* Map/dispatch case — near reading officer */}
      <g opacity="0.35">
        <rect x="365" y="332" width="8" height="2.5" fill="#3a2818" rx="0.5" />
        {/* Paper edge visible */}
        <rect x="366" y="332" width="6" height="0.5" fill="#d0c8b8" opacity="0.4" />
      </g>

      {/* ===== GROUND CONTOUR LINES — subtle terrain undulation ===== */}
      <path d="M0 340 Q80 335 160 342 Q240 348 320 338 Q400 332 480 340 Q560 346 640 336 Q720 330 800 338"
        fill="none" stroke="#7a8898" strokeWidth="0.3" opacity="0.06" />
      <path d="M0 355 Q100 350 200 358 Q300 365 400 352 Q500 345 600 355 Q700 362 800 350"
        fill="none" stroke="#7a8898" strokeWidth="0.3" opacity="0.04" />

      {/* ===== SNOW TEXTURE DETAIL — ground level nuance ===== */}
      {/* Wind-carved ridges in snow — sastrugi */}
      <path d="M0 350 Q40 348 80 351 Q120 348 160 350 Q200 347 240 350"
        fill="none" stroke="#a8b0b8" strokeWidth="0.4" opacity="0.12" />
      <path d="M250 355 Q290 352 330 355 Q370 352 410 355 Q450 352 490 355"
        fill="none" stroke="#a8b0b8" strokeWidth="0.4" opacity="0.1" />
      <path d="M500 358 Q540 355 580 358 Q620 355 660 358 Q700 355 740 358"
        fill="none" stroke="#a8b0b8" strokeWidth="0.4" opacity="0.1" />
      {/* Exposed frozen earth patches — where wind has blown snow thin */}
      <ellipse cx="250" cy="342" rx="15" ry="5" fill="url(#ch11_frozenEarth)" opacity="0.15" />
      <ellipse cx="460" cy="348" rx="12" ry="4" fill="url(#ch11_frozenEarth)" opacity="0.12" />
      <ellipse cx="620" cy="345" rx="10" ry="3.5" fill="url(#ch11_frozenEarth)" opacity="0.1" />

      {/* ===== ADDITIONAL FOREGROUND ROCKS AND SNOW ===== */}
      {/* Small embedded stones — close foreground */}
      <g opacity="0.35">
        <path d="M200 380 Q205 376 212 378 Q216 380 212 383 L203 382 Z"
          fill="url(#ch11_rock)" />
        <ellipse cx="206" cy="377" rx="4" ry="1.5" fill="#b8c0c8" opacity="0.3" />
      </g>
      <g opacity="0.3">
        <path d="M540 378 Q545 374 550 376 Q553 379 550 381 L542 380 Z"
          fill="url(#ch11_rock)" />
        <ellipse cx="546" cy="375" rx="3.5" ry="1.2" fill="#b8c0c8" opacity="0.25" />
      </g>

      {/* ===== WIND EFFECT ON FLAG AND CAMP ===== */}
      {/* Canvas tent flaps — showing wind direction */}
      <path d="M265 330 Q268 328 270 330" fill="none" stroke="url(#ch11_tent)" strokeWidth="0.5" opacity="0.4">
        <animate attributeName="d"
          values="M265 330 Q268 328 270 330;M265 330 Q268 326 270 330;M265 330 Q268 328 270 330"
          dur="4s" repeatCount="indefinite" />
      </path>

      {/* ===== DISTANT MOUNTAIN VILLAGE — tiny buildings visible on slope ===== */}
      <g opacity="0.2">
        {/* Tiny stone buildings — Alpine settlement */}
        <rect x="390" y="232" width="4" height="3" fill="#4a5060" />
        <path d="M389 232 L392 229 L395 232 Z" fill="#3a4050" />
        <rect x="396" y="233" width="3" height="2.5" fill="#4a5060" opacity="0.8" />
        <path d="M395 233 L397.5 231 L400 233 Z" fill="#3a4050" opacity="0.7" />
        <rect x="401" y="234" width="3.5" height="2" fill="#4a5060" opacity="0.6" />
        {/* Church with small steeple */}
        <rect x="385" y="231" width="4" height="4" fill="#4a5060" opacity="0.9" />
        <rect x="386" y="227" width="2" height="4" fill="#4a5060" opacity="0.8" />
        <path d="M386 227 L387 225 L388 227 Z" fill="#4a5060" opacity="0.7" />
        {/* Tiny windows — warm light */}
        <rect x="386" y="233" width="0.8" height="0.6" fill="#c08040" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.08;0.15" dur="4s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* ===== DISTANT SMOKE SIGNALS — Austrian positions communicating ===== */}
      <g opacity="0.15">
        <path d="M150 258 Q148 248 150 238"
          fill="none" stroke="#7a8088" strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="d"
            values="M150 258 Q148 248 150 238;M150 258 Q152 246 148 236;M150 258 Q148 248 150 238"
            dur="10s" repeatCount="indefinite" />
        </path>
        <path d="M660 260 Q658 250 660 240"
          fill="none" stroke="#7a8088" strokeWidth="1.2" strokeLinecap="round">
          <animate attributeName="d"
            values="M660 260 Q658 250 660 240;M660 260 Q662 248 658 238;M660 260 Q658 250 660 240"
            dur="12s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ===== GROUND SHADOW FROM CLOUDS — moving shadow patches ===== */}
      <ellipse cx="300" cy="320" rx="50" ry="15" fill="#2a3040" opacity="0.03">
        <animate attributeName="cx" values="300;350;300" dur="30s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="600" cy="340" rx="40" ry="12" fill="#2a3040" opacity="0.025">
        <animate attributeName="cx" values="600;640;600" dur="25s" repeatCount="indefinite" />
      </ellipse>

      {/* ===== ADDITIONAL SNOW DETAILS — wind patterns and accumulation ===== */}
      {/* Cornices on cliff edge — overhanging snow */}
      <g opacity="0.3">
        <path d="M100 278 Q110 275 120 278 Q115 280 105 280 Z" fill="#c8d0d8" />
        <path d="M300 276 Q310 273 320 276 Q315 278 305 278 Z" fill="#c8d0d8" />
        <path d="M500 278 Q510 275 520 278 Q515 280 505 280 Z" fill="#c8d0d8" />
        <path d="M680 277 Q690 274 700 277 Q695 279 685 279 Z" fill="#c8d0d8" />
      </g>

      {/* Snow whirl — small vortex catching dawn light */}
      <g opacity="0.08">
        <ellipse cx="500" cy="340" rx="6" ry="3" fill="#c8d0d8">
          <animate attributeName="rx" values="6;10;6" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.15;0.08" dur="5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* ===== FROST CRYSTAL PATTERNS — on nearby rock surfaces ===== */}
      <g opacity="0.12">
        {/* Fern-like frost on foreground rock */}
        <path d="M75 370 Q78 366 82 368 Q85 364 88 367" fill="none" stroke="#c8d8e8" strokeWidth="0.3" />
        <path d="M82 368 Q80 365 82 362" fill="none" stroke="#c8d8e8" strokeWidth="0.25" />
        <path d="M82 368 Q84 365 82 362" fill="none" stroke="#c8d8e8" strokeWidth="0.25" />
        {/* Frost on right rock */}
        <path d="M755 380 Q758 376 762 378 Q765 374 768 377" fill="none" stroke="#c8d8e8" strokeWidth="0.3" />
        <path d="M762 378 Q760 375 762 372" fill="none" stroke="#c8d8e8" strokeWidth="0.25" />
      </g>

      {/* ===== ENHANCED WINTER ATMOSPHERE — ice crystals, frost patterns, snow texture ===== */}
      {/* Frost crystal pattern overlay on foreground ground */}
      <rect x="0" y="340" width="800" height="60" fill="url(#ch11_frostCrystal)" opacity="0.5" />

      {/* Snow sparkle — individual ice crystals catching dawn light */}
      <g opacity="0.4">
        <circle cx="350" cy="345" r="0.6" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="480" cy="350" r="0.5" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0;0.35;0" dur="4s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle cx="220" cy="355" r="0.7" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0.3;0;0.3" dur="3.5s" repeatCount="indefinite" begin="2s" />
        </circle>
        <circle cx="600" cy="348" r="0.5" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0;0.4;0" dur="5s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <circle cx="150" cy="362" r="0.6" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0.35;0;0.35" dur="4.5s" repeatCount="indefinite" begin="1.5s" />
        </circle>
        <circle cx="720" cy="360" r="0.5" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0;0.3;0" dur="3.2s" repeatCount="indefinite" begin="3s" />
        </circle>
        <circle cx="430" cy="358" r="0.4" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0.25;0;0.25" dur="4.8s" repeatCount="indefinite" begin="2.5s" />
        </circle>
        <circle cx="560" cy="355" r="0.6" fill="url(#ch11_sparkle)">
          <animate attributeName="opacity" values="0;0.35;0" dur="3.8s" repeatCount="indefinite" begin="4s" />
        </circle>
      </g>

      {/* ===== ICICLES ON EQUIPMENT AND STRUCTURES ===== */}
      {/* Icicles hanging from tent 1 edge */}
      <g opacity="0.35">
        <line x1="238" y1="330" x2="238" y2="334" stroke="url(#ch11_icicle)" strokeWidth="0.5" />
        <line x1="242" y1="330" x2="242" y2="335" stroke="url(#ch11_icicle)" strokeWidth="0.6" />
        <line x1="246" y1="330" x2="246" y2="333" stroke="url(#ch11_icicle)" strokeWidth="0.4" />
        <line x1="258" y1="330" x2="258" y2="334" stroke="url(#ch11_icicle)" strokeWidth="0.5" />
        <line x1="262" y1="330" x2="262" y2="333" stroke="url(#ch11_icicle)" strokeWidth="0.4" />
      </g>
      {/* Icicles on cannon 1 carriage */}
      <g opacity="0.25">
        <line x1="155" y1="292" x2="155" y2="295" stroke="url(#ch11_icicle)" strokeWidth="0.4" />
        <line x1="165" y1="292" x2="165" y2="296" stroke="url(#ch11_icicle)" strokeWidth="0.5" />
      </g>
      {/* Icicles on wagon wheel */}
      <g opacity="0.2">
        <line x1="474" y1="339" x2="474" y2="342" stroke="url(#ch11_icicle)" strokeWidth="0.4" />
        <line x1="488" y1="339" x2="488" y2="341" stroke="url(#ch11_icicle)" strokeWidth="0.3" />
      </g>

      {/* ===== FROZEN PUDDLE REFLECTIONS — dawn sky reflected in ice ===== */}
      <g opacity="0.1">
        {/* Reflection of dawn in larger puddle */}
        <ellipse cx="330" cy="355" rx="8" ry="2" fill="#c08050" />
        {/* Reflection in right puddle */}
        <ellipse cx="580" cy="359" rx="6" ry="1.5" fill="#b07040" />
      </g>

      {/* ===== ADDITIONAL TIRE/WHEEL TRACKS — artillery movement evidence ===== */}
      {/* Deep ruts from cannon being repositioned during night */}
      <path d="M600 358 Q620 355 640 360 Q660 363 680 358"
        fill="none" stroke="url(#ch11_tracks)" strokeWidth="2.5" opacity="0.18" />
      <path d="M600 362 Q620 359 640 364 Q660 367 680 362"
        fill="none" stroke="url(#ch11_tracks)" strokeWidth="2.5" opacity="0.18" />
      {/* Dragged caisson tracks — wider, deeper */}
      <path d="M150 360 Q170 356 190 362 Q210 368 230 360"
        fill="none" stroke="url(#ch11_tracks)" strokeWidth="3.5" opacity="0.15" />
      <path d="M150 365 Q170 361 190 367 Q210 373 230 365"
        fill="none" stroke="url(#ch11_tracks)" strokeWidth="3.5" opacity="0.15" />

      {/* ===== ADDITIONAL SOLDIERS IN FOREGROUND — more life and movement ===== */}
      {/* Two soldiers walking together — carrying a barrel between them */}
      <g opacity="0.55">
        <ellipse cx="340" cy="355" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="340" cy="352" r="2" fill="#3a3a40" />
        <ellipse cx="355" cy="356" rx="2.5" ry="7" fill="url(#ch11_frenchBlue)" />
        <circle cx="355" cy="353" r="2" fill="#3a3a40" />
        {/* Pole between them with barrel hanging */}
        <line x1="340" y1="354" x2="355" y2="355" stroke="#3a3028" strokeWidth="1" opacity="0.5" />
        <ellipse cx="348" cy="356" rx="3" ry="2" fill="#3a3020" opacity="0.4" />
        {/* Breath */}
        <ellipse cx="342" cy="351" rx="2" ry="1.2" fill="url(#ch11_breath)">
          <animate attributeName="opacity" values="0.12;0;0.12" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* Soldier on lookout — standing on rock, hand shading eyes */}
      <g opacity="0.6">
        <ellipse cx="680" cy="310" rx="3" ry="9" fill="url(#ch11_frenchBlue)" />
        <circle cx="680" cy="305" r="2.5" fill="#3a3a40" />
        {/* Shako */}
        <rect x="677" y="302" width="6" height="2.5" fill="#1a1a28" rx="0.5" />
        {/* Hand raised to forehead — shading eyes looking at dawn */}
        <path d="M682 305 Q685 303 687 304" fill="none" stroke="#3a3a40" strokeWidth="1" opacity="0.5" />
        {/* Standing on elevated rock */}
        <ellipse cx="680" cy="318" rx="8" ry="4" fill="url(#ch11_rock)" opacity="0.4" />
        {/* Dawn silhouette rim */}
        <ellipse cx="680" cy="310" rx="3.5" ry="10" fill="none" stroke="rgba(200,120,60,0.08)" strokeWidth="1" />
      </g>

      {/* ===== CAMPFIRE 6 — very small, distant right background ===== */}
      <g opacity="0.4">
        <ellipse cx="770" cy="310" rx="12" ry="8" fill="url(#ch11_fireGlow)" />
        <ellipse cx="770" cy="310" rx="3" ry="1.5" fill="#d88838" opacity="0.6">
          <animate attributeName="ry" values="1.5;2.5;1.5" dur="1.3s" repeatCount="indefinite" />
        </ellipse>
        {/* Tiny figures — 2 soldiers */}
        <ellipse cx="766" cy="314" rx="1.5" ry="4" fill="#2a2a30" />
        <circle cx="766" cy="312" r="1" fill="#3a3a40" />
        <ellipse cx="774" cy="315" rx="1.5" ry="4" fill="#2a2a30" />
        <circle cx="774" cy="313" r="1" fill="#3a3a40" />
      </g>

      {/* ===== DISTANT ALPINE HUT — small stone shelter visible on slope ===== */}
      <g opacity="0.15">
        <rect x="580" y="242" width="5" height="3.5" fill="#4a5060" />
        <path d="M579 242 L582.5 239 L586 242 Z" fill="#3a4050" />
        {/* Snow on roof */}
        <path d="M579 242 L582.5 240 L586 242 Z" fill="#c8d0d8" opacity="0.4" />
      </g>

      {/* ===== TENT GUY ROPES — visible in foreground tents ===== */}
      <g opacity="0.2">
        {/* Guy ropes for tent 1 with frost */}
        <line x1="235" y1="330" x2="225" y2="334" stroke="#6a6860" strokeWidth="0.3" />
        <line x1="265" y1="330" x2="275" y2="334" stroke="#6a6860" strokeWidth="0.3" />
        {/* Frost on ropes — white specks */}
        <circle cx="230" cy="332" r="0.3" fill="#c8d0d8" />
        <circle cx="270" cy="332" r="0.3" fill="#c8d0d8" />
      </g>

      {/* ===== ATMOSPHERIC OVERLAYS ===== */}
      {/* Cold blue-grey atmospheric wash — winter mountain air */}
      <rect width="800" height="400" fill="#1a2040" opacity="0.03" />

      {/* Warm dawn tint on lower scene — light reflecting from east */}
      <rect x="400" y="250" width="400" height="150" fill="#c08050" opacity="0.02" />

      {/* Powder smoke haze — hanging over the battlefield */}
      <rect x="0" y="240" width="800" height="80" fill="#7a8088" opacity="0.02">
        <animate attributeName="opacity" values="0.02;0.035;0.02" dur="15s" repeatCount="indefinite" />
      </rect>

      {/* Bottom darkening — ground fades to deep shadow */}
      <rect x="0" y="370" width="800" height="30" fill="#0a0a12" opacity="0.4" />
      <rect x="0" y="385" width="800" height="15" fill="#060610" opacity="0.3" />

      {/* Top darkening — deep night sky fading */}
      <rect x="0" y="0" width="800" height="20" fill="#08081a" opacity="0.3" />
      <rect x="0" y="0" width="800" height="8" fill="#040410" opacity="0.2" />

      {/* ===== DISTANT MUSKET VOLLEYS — flickering along Austrian line ===== */}
      {/* Musket flash ripple — Austrian column firing */}
      <g opacity="0.3">
        <circle cx="125" cy="261" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" begin="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="130" cy="261" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" begin="4.05s" repeatCount="indefinite" />
        </circle>
        <circle cx="135" cy="261" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" begin="4.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="261" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" begin="4.15s" repeatCount="indefinite" />
        </circle>
        <circle cx="145" cy="261" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" begin="4.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="261" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0" dur="0.3s" begin="4.25s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Second volley — center Austrian column */}
      <g opacity="0.25">
        <circle cx="345" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7.05s" repeatCount="indefinite" />
        </circle>
        <circle cx="355" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="360" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7.15s" repeatCount="indefinite" />
        </circle>
        <circle cx="365" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="370" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7.25s" repeatCount="indefinite" />
        </circle>
        <circle cx="375" cy="258" r="0.8" fill="#e8a850" opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="0.3s" begin="7.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ===== FAINT SOUND VISUALIZATION — distant cannon rumble ===== */}
      {/* Concentric rings from distant cannon — like ripples */}
      <circle cx="280" cy="255" r="5" fill="none" stroke="#a8b0b8" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="5;25;45" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.02;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="540" cy="258" r="5" fill="none" stroke="#a8b0b8" strokeWidth="0.3" opacity="0">
        <animate attributeName="r" values="5;25;45" dur="5s" repeatCount="indefinite" begin="1s" />
        <animate attributeName="opacity" values="0.05;0.015;0" dur="5s" repeatCount="indefinite" begin="1s" />
      </circle>

      {/* === VIGNETTE === */}
      <rect width="800" height="400" fill="url(#ch11_vignette)" />
    </svg>
  );
}
