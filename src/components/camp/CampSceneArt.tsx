/**
 * SVG camp scene art — Rivoli, night before the battle (14 Jan 1797).
 * Mountain camp at altitude: bitterly cold January night, stars blazing,
 * crescent moon, campfire with soldiers huddled close, snow on peaks,
 * distant campfires of the army across the plateau.
 * Mood: Tense anticipation, cold, camaraderie before battle.
 *
 * Enhanced with: aurora hint, owl silhouette, frost crystals, wolf eyes,
 * more distant fires, cooking pot steam, sentry silhouette, trampled snow,
 * pine tree silhouettes, prayer cross detail.
 *
 * Further enhanced with: mountain peak moonlit glow, ground equipment
 * (cartridge box, tin cup, powder horn), sleeping soldier with blanket,
 * icicles on rock overhang, fox eyes in darkness, additional smoke wisps,
 * bivouac tarp shelter, animated wind pennant on musket, constellation
 * lines (Orion), frost rim on cooking pot.
 *
 * Final pass: second sentry, frost on tent ropes, cannonball stack,
 * snow-dusted ammo boxes, visible soldier breath vapor, boot tracks
 * in snow, frozen water bucket, pine needle clusters, discarded playing
 * card, wind-blown snow particles, camp dog, ice on tent flap,
 * telescope on barrel, distant Austrian campfires on far ridge.
 *
 * Atmosphere pass: Milky Way band, shooting star, snow-laden pine boughs,
 * supply cart with canvas cover, stacked muskets (faisceaux d'armes),
 * French tricolor pennant, regimental drum, hanging lantern with glow,
 * frozen stream/puddle, muddy cart ruts, additional rocky outcrops,
 * blanket rolls near tents, soldier warming hands at second fire pit,
 * distant third sentry pacing, more snow drifts and ground fog layers,
 * campfire light reflections on tent canvas and faces, mountain wind
 * streaks, additional boot prints, hay bale seating, water canteen detail.
 */
export function CampSceneArt() {
  return (
    <div className="camp-scene-art" id="camp-scene-art">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Night sky — deep winter blue */}
          <linearGradient id="csSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030810" />
            <stop offset="30%" stopColor="#081020" />
            <stop offset="60%" stopColor="#0c1828" />
            <stop offset="100%" stopColor="#101830" />
          </linearGradient>
          {/* Moon glow */}
          <radialGradient id="csMoonGlow" cx="700" cy="50" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#aabbcc" stopOpacity="0.18" />
            <stop offset="40%" stopColor="#8899aa" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#050a18" stopOpacity="0" />
          </radialGradient>
          {/* Main campfire glow — warm radius */}
          <radialGradient id="csFireGlow" cx="400" cy="340" r="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b8661a" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#8b4513" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#050a18" stopOpacity="0" />
          </radialGradient>
          {/* Ground glow — fire-lit earth */}
          <radialGradient id="csGroundGlow" cx="400" cy="380" r="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2a1508" stopOpacity="1" />
            <stop offset="50%" stopColor="#12100a" stopOpacity="1" />
            <stop offset="100%" stopColor="#080c14" stopOpacity="1" />
          </radialGradient>
          {/* Mist layer — cold mountain air */}
          <linearGradient id="csMist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2540" stopOpacity="0" />
            <stop offset="60%" stopColor="#1a2540" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0e1520" stopOpacity="0.5" />
          </linearGradient>
          {/* Distant campfire glow */}
          <radialGradient id="csDistFire">
            <stop offset="0%" stopColor="#ffaa33" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#cc6600" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#cc6600" stopOpacity="0" />
          </radialGradient>
          {/* Smoke wisps */}
          <radialGradient id="csSmoke">
            <stop offset="0%" stopColor="#555" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#333" stopOpacity="0" />
          </radialGradient>
          {/* Snow shimmer on peaks */}
          <linearGradient id="csSnow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d0e0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8090a0" stopOpacity="0.15" />
          </linearGradient>
          {/* Cold vignette overlay */}
          <radialGradient id="csVignette" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#020510" stopOpacity="0.55" />
          </radialGradient>
          {/* Breath vapor */}
          <radialGradient id="csBreath">
            <stop offset="0%" stopColor="#8899bb" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#8899bb" stopOpacity="0" />
          </radialGradient>
          {/* Aurora gradient — subtle green-blue-violet band */}
          <linearGradient id="csAurora" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a4a3a" stopOpacity="0">
              <animate attributeName="stopColor" values="#1a4a3a;#2a5a4a;#1a3a4a;#1a4a3a" dur="18s" repeatCount="indefinite" />
            </stop>
            <stop offset="25%" stopColor="#2a6a5a" stopOpacity="0.06">
              <animate attributeName="stopColor" values="#2a6a5a;#3a7a6a;#2a5a6a;#2a6a5a" dur="18s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#2a5a6a" stopOpacity="0.08">
              <animate attributeName="stopColor" values="#2a5a6a;#3a6a7a;#2a6a5a;#2a5a6a" dur="18s" repeatCount="indefinite" />
            </stop>
            <stop offset="75%" stopColor="#3a4a6a" stopOpacity="0.05">
              <animate attributeName="stopColor" values="#3a4a6a;#4a5a7a;#3a5a6a;#3a4a6a" dur="18s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#2a3a5a" stopOpacity="0">
              <animate attributeName="stopColor" values="#2a3a5a;#3a4a6a;#2a4a5a;#2a3a5a" dur="18s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          {/* Cooking pot steam */}
          <radialGradient id="csSteam">
            <stop offset="0%" stopColor="#99aabb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#99aabb" stopOpacity="0" />
          </radialGradient>
          {/* Frost crystal shimmer */}
          <radialGradient id="csFrost">
            <stop offset="0%" stopColor="#c0d8f0" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#a0b8d0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8090a0" stopOpacity="0" />
          </radialGradient>
          {/* Mountain peak moonlit edge glow */}
          <linearGradient id="csPeakGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d8ee" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8090a8" stopOpacity="0" />
          </linearGradient>
          {/* Bivouac tarp gradient — dull canvas */}
          <linearGradient id="csTarp" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#1a1810" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0e0c08" stopOpacity="0.6" />
          </linearGradient>
          {/* Austrian distant fire glow — redder than French fires */}
          <radialGradient id="cs_austrianFire">
            <stop offset="0%" stopColor="#ff6622" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#cc4400" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#cc4400" stopOpacity="0" />
          </radialGradient>
          {/* Snow particle shimmer */}
          <radialGradient id="cs_snowParticle">
            <stop offset="0%" stopColor="#c8d8f0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a0b0c8" stopOpacity="0" />
          </radialGradient>
          {/* Breath vapor — thicker plume for visible exhalation */}
          <radialGradient id="cs_breathPlume">
            <stop offset="0%" stopColor="#99aacc" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#8899bb" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8899bb" stopOpacity="0" />
          </radialGradient>
          {/* Frozen water surface shimmer */}
          <linearGradient id="cs_iceSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#90a8c8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#b0c8e0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#80a0b8" stopOpacity="0.2" />
          </linearGradient>
          {/* Milky Way band — very faint stellar haze */}
          <linearGradient id="cs_milkyWay" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#667788" stopOpacity="0" />
            <stop offset="30%" stopColor="#8899aa" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#99aabb" stopOpacity="0.06" />
            <stop offset="70%" stopColor="#8899aa" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#667788" stopOpacity="0" />
          </linearGradient>
          {/* Lantern glow — warm amber radial */}
          <radialGradient id="cs_lanternGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#cc8833" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#995522" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#664411" stopOpacity="0" />
          </radialGradient>
          {/* Frozen stream shimmer */}
          <linearGradient id="cs_frozenStream" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="#667890" stopOpacity="0.15" />
            <stop offset="30%" stopColor="#8098b0" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#90a8c0" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#8098b0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#667890" stopOpacity="0.15" />
          </linearGradient>
          {/* Cart canvas cover */}
          <linearGradient id="cs_cartCanvas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1810" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0e0c08" stopOpacity="0.5" />
          </linearGradient>
          {/* Ground fog layer */}
          <linearGradient id="cs_groundFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2030" stopOpacity="0" />
            <stop offset="40%" stopColor="#1a2030" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#141c28" stopOpacity="0.15" />
          </linearGradient>
          {/* Firelight reflection on tent canvas */}
          <radialGradient id="cs_tentFirelight" cx="0.3" cy="0.8" r="0.7">
            <stop offset="0%" stopColor="#8b4513" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4a2508" stopOpacity="0" />
          </radialGradient>
          {/* Shooting star trail */}
          <linearGradient id="cs_shootingStar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0d8c8" stopOpacity="0" />
            <stop offset="70%" stopColor="#e0d8c8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* === SKY === */}
        <rect width="800" height="400" fill="url(#csSky)" />

        {/* === NORTHERN LIGHTS HINT — very subtle aurora near mountain peaks === */}
        <rect x="0" y="85" width="800" height="35" fill="url(#csAurora)" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.55;0.35;0.5;0.4" dur="22s" repeatCount="indefinite" />
        </rect>
        {/* Aurora shimmer wisps */}
        <ellipse cx="300" cy="98" rx="120" ry="8" fill="#2a6a5a" opacity="0.04">
          <animate attributeName="rx" values="120;140;120" dur="14s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.04;0.07;0.04" dur="14s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="550" cy="92" rx="90" ry="6" fill="#3a5a7a" opacity="0.03">
          <animate attributeName="rx" values="90;110;90" dur="16s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.03;0.06;0.03" dur="16s" repeatCount="indefinite" />
        </ellipse>

        {/* === MILKY WAY BAND — faint stellar haze across the sky === */}
        <ellipse cx="350" cy="55" rx="380" ry="22" fill="url(#cs_milkyWay)" opacity="0.6" transform="rotate(-8 350 55)">
          <animate attributeName="opacity" values="0.6;0.75;0.6" dur="20s" repeatCount="indefinite" />
        </ellipse>
        {/* Milky Way star clusters — denser faint dots */}
        <circle cx="220" cy="50" r="0.35" fill="#c8d0e0" opacity="0.2" />
        <circle cx="240" cy="48" r="0.3" fill="#c8d0e0" opacity="0.18" />
        <circle cx="280" cy="44" r="0.25" fill="#c8d0e0" opacity="0.15" />
        <circle cx="320" cy="42" r="0.3" fill="#c8d0e0" opacity="0.2" />
        <circle cx="350" cy="40" r="0.35" fill="#c8d0e0" opacity="0.22" />
        <circle cx="380" cy="38" r="0.25" fill="#c8d0e0" opacity="0.16" />
        <circle cx="410" cy="42" r="0.3" fill="#c8d0e0" opacity="0.19" />
        <circle cx="440" cy="46" r="0.25" fill="#c8d0e0" opacity="0.15" />
        <circle cx="470" cy="50" r="0.35" fill="#c8d0e0" opacity="0.2" />
        <circle cx="500" cy="52" r="0.3" fill="#c8d0e0" opacity="0.17" />

        {/* === SHOOTING STAR — brief streak across the sky === */}
        <line x1="520" y1="25" x2="560" y2="40" stroke="url(#cs_shootingStar)" strokeWidth="1.2" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0;0;0;0;0;0;0.8;0;0;0;0;0;0;0;0;0;0;0;0" dur="25s" repeatCount="indefinite" />
          <animate attributeName="x1" values="520;520;520;520;520;520;520;480;520;520;520;520;520;520;520;520;520;520;520;520" dur="25s" repeatCount="indefinite" />
          <animate attributeName="y1" values="25;25;25;25;25;25;25;18;25;25;25;25;25;25;25;25;25;25;25;25" dur="25s" repeatCount="indefinite" />
          <animate attributeName="x2" values="560;560;560;560;560;560;560;530;560;560;560;560;560;560;560;560;560;560;560;560" dur="25s" repeatCount="indefinite" />
          <animate attributeName="y2" values="40;40;40;40;40;40;40;32;40;40;40;40;40;40;40;40;40;40;40;40" dur="25s" repeatCount="indefinite" />
        </line>

        {/* === STARS — twinkling winter sky === */}
        {/* Bright stars with twinkle */}
        <circle cx="45" cy="22" r="1.0" fill="#d0c8b8" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.4;0.7" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="130" cy="15" r="1.3" fill="#d0c8b8" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.5;0.8" dur="4.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="260" cy="12" r="1.1" fill="#e0d8c8" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3.7s" repeatCount="indefinite" />
        </circle>
        <circle cx="370" cy="8" r="1.2" fill="#d0c8b8" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="5.0s" repeatCount="indefinite" />
        </circle>
        <circle cx="460" cy="20" r="1.0" fill="#e0d8c8" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="550" cy="18" r="1.1" fill="#d0c8b8" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="4.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="750" cy="15" r="1.0" fill="#d0c8b8" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.5;0.7" dur="3.0s" repeatCount="indefinite" />
        </circle>
        {/* Dimmer background stars (static) */}
        <circle cx="95" cy="45" r="0.6" fill="#d0c8b8" opacity="0.4" />
        <circle cx="175" cy="58" r="0.8" fill="#d0c8b8" opacity="0.5" />
        <circle cx="210" cy="28" r="0.7" fill="#d0c8b8" opacity="0.6" />
        <circle cx="290" cy="48" r="0.6" fill="#d0c8b8" opacity="0.3" />
        <circle cx="330" cy="32" r="0.9" fill="#d0c8b8" opacity="0.55" />
        <circle cx="410" cy="52" r="0.7" fill="#d0c8b8" opacity="0.45" />
        <circle cx="510" cy="40" r="0.8" fill="#d0c8b8" opacity="0.4" />
        <circle cx="590" cy="55" r="0.6" fill="#d0c8b8" opacity="0.5" />
        <circle cx="630" cy="30" r="0.9" fill="#d0c8b8" opacity="0.6" />
        <circle cx="700" cy="38" r="0.7" fill="#d0c8b8" opacity="0.4" />
        <circle cx="160" cy="80" r="0.5" fill="#d0c8b8" opacity="0.3" />
        <circle cx="420" cy="72" r="0.8" fill="#d0c8b8" opacity="0.35" />
        <circle cx="540" cy="68" r="0.6" fill="#d0c8b8" opacity="0.45" />
        <circle cx="75" cy="65" r="0.7" fill="#d0c8b8" opacity="0.35" />
        <circle cx="780" cy="48" r="0.5" fill="#d0c8b8" opacity="0.4" />
        {/* Extra faint stars for density */}
        <circle cx="30" cy="42" r="0.4" fill="#c0b8a8" opacity="0.25" />
        <circle cx="145" cy="38" r="0.5" fill="#c0b8a8" opacity="0.3" />
        <circle cx="310" cy="18" r="0.4" fill="#c0b8a8" opacity="0.2" />
        <circle cx="480" cy="35" r="0.5" fill="#c0b8a8" opacity="0.25" />
        <circle cx="660" cy="15" r="0.4" fill="#c0b8a8" opacity="0.3" />
        <circle cx="720" cy="60" r="0.5" fill="#c0b8a8" opacity="0.2" />

        {/* === CONSTELLATION LINES — Orion visible in January sky === */}
        {/* Orion's Belt — 3 stars connected with faint lines */}
        <g opacity="0.12" stroke="#8899bb" strokeWidth="0.4" fill="none">
          {/* Belt: three bright stars in a row */}
          <line x1="210" y1="28" x2="260" y2="12" />
          <line x1="260" y1="12" x2="310" y2="18" />
          {/* Shoulders */}
          <line x1="210" y1="28" x2="175" y2="58" />
          <line x1="310" y1="18" x2="330" y2="32" />
          {/* Legs/feet going down */}
          <line x1="175" y1="58" x2="160" y2="80" />
          <line x1="330" y1="32" x2="370" y2="8" />
        </g>
        {/* Brighter dots at Orion vertices for emphasis */}
        <circle cx="260" cy="12" r="1.4" fill="#e8e0d0" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.7;0.5" dur="4.5s" repeatCount="indefinite" />
        </circle>

        {/* === MOON === */}
        <circle cx="700" cy="50" r="12" fill="#c8c0a0" opacity="0.9" />
        <circle cx="706" cy="46" r="10" fill="#050a18" />
        <circle cx="700" cy="50" r="80" fill="url(#csMoonGlow)" />
        {/* Moonlight on clouds — thin wisps */}
        <ellipse cx="660" cy="65" rx="30" ry="3" fill="#667788" opacity="0.08" />
        <ellipse cx="740" cy="72" rx="25" ry="2" fill="#667788" opacity="0.06" />

        {/* === FAR MOUNTAINS — snow-capped Alpine peaks === */}
        <path d="M0,200 L40,170 L80,185 L140,140 L180,158 L230,115 L280,145 L320,125 L370,150 L420,105 L470,135 L510,118 L550,145 L600,100 L650,130 L690,115 L730,140 L770,128 L800,150 L800,400 L0,400 Z" fill="#0e1525" opacity="0.7" />
        {/* Snow caps on far peaks */}
        <path d="M228,115 L220,128 L238,128 Z" fill="url(#csSnow)" />
        <path d="M418,105 L408,120 L430,120 Z" fill="url(#csSnow)" />
        <path d="M598,100 L588,115 L610,115 Z" fill="url(#csSnow)" />
        <path d="M508,118 L500,130 L518,130 Z" fill="url(#csSnow)" opacity="0.7" />
        <path d="M688,115 L680,128 L698,128 Z" fill="url(#csSnow)" opacity="0.6" />

        {/* === DISTANT AUSTRIAN CAMPFIRES — tiny orange dots on the far ridge === */}
        {/* The Austrian army encamped across the Adige valley — visible on the opposite ridge */}
        <circle cx="58" cy="195" r="1.2" fill="url(#cs_austrianFire)">
          <animate attributeName="opacity" values="0.7;0.4;0.7" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="58" cy="195" r="0.4" fill="#ff7733" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="92" cy="184" r="1.0" fill="url(#cs_austrianFire)" />
        <circle cx="92" cy="184" r="0.35" fill="#ff6622" opacity="0.4" />
        <circle cx="155" cy="144" r="1.4" fill="url(#cs_austrianFire)">
          <animate attributeName="opacity" values="0.6;0.35;0.6" dur="4.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="155" cy="144" r="0.45" fill="#ff7733" opacity="0.45" />
        <circle cx="248" cy="122" r="1.0" fill="url(#cs_austrianFire)" />
        <circle cx="248" cy="122" r="0.3" fill="#ff6622" opacity="0.35" />
        <circle cx="335" cy="130" r="1.2" fill="url(#cs_austrianFire)">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="335" cy="130" r="0.4" fill="#ff7733" opacity="0.4" />
        <circle cx="485" cy="130" r="1.0" fill="url(#cs_austrianFire)" />
        <circle cx="485" cy="130" r="0.3" fill="#ff6622" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.2;0.35" dur="2.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="565" cy="140" r="1.3" fill="url(#cs_austrianFire)" />
        <circle cx="565" cy="140" r="0.4" fill="#ff7733" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.25;0.4" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="645" cy="126" r="0.9" fill="url(#cs_austrianFire)" />
        <circle cx="645" cy="126" r="0.3" fill="#ff6622" opacity="0.3" />

        {/* === MOUNTAIN PEAK MOONLIT GLOW — thin bright line on top edges === */}
        {/* Far peaks — moonlight catches the ridgeline from the right (moon at 700,50) */}
        <path
          d="M600,100 L650,130 L690,115 L730,140 L770,128 L800,150"
          fill="none" stroke="#c0d0e8" strokeWidth="0.8" opacity="0.25"
        />
        <path
          d="M510,118 L550,145 L600,100"
          fill="none" stroke="#b0c0d8" strokeWidth="0.6" opacity="0.18"
        />
        {/* Subtle glow strip along peaks nearest the moon */}
        <path
          d="M580,100 L600,100 L650,130 L690,115 L730,140 L770,128 L800,150"
          fill="none" stroke="url(#csPeakGlow)" strokeWidth="1.2" opacity="0.2"
        >
          <animate attributeName="opacity" values="0.2;0.28;0.2" dur="8s" repeatCount="indefinite" />
        </path>
        {/* Fainter glow on left peaks — more distant from moon */}
        <path
          d="M140,140 L180,158 L230,115 L280,145 L320,125 L370,150 L420,105"
          fill="none" stroke="#8090a8" strokeWidth="0.5" opacity="0.1"
        />

        {/* === WOLF EYES — distant glowing pair on far ridge === */}
        <g opacity="0.6">
          <circle cx="165" cy="155" r="0.9" fill="#ccaa33">
            <animate attributeName="opacity" values="0.6;0.8;0.6;0;0;0;0;0;0;0;0.6" dur="12s" repeatCount="indefinite" />
          </circle>
          <circle cx="169" cy="155" r="0.9" fill="#ccaa33">
            <animate attributeName="opacity" values="0.6;0.8;0.6;0;0;0;0;0;0;0;0.6" dur="12s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === MID MOUNTAINS === */}
        <path d="M0,240 L30,215 L70,228 L120,180 L160,205 L200,168 L260,195 L300,158 L350,185 L400,148 L440,172 L490,152 L530,180 L580,142 L630,168 L670,148 L720,175 L760,160 L800,185 L800,400 L0,400 Z" fill="#0c1220" opacity="0.85" />
        {/* Mid snow caps */}
        <path d="M198,168 L190,180 L208,180 Z" fill="url(#csSnow)" opacity="0.6" />
        <path d="M298,158 L290,170 L308,170 Z" fill="url(#csSnow)" opacity="0.5" />
        <path d="M578,142 L570,155 L588,155 Z" fill="url(#csSnow)" opacity="0.5" />

        {/* Mid mountain moonlit edge — closer ridgeline catches moonlight */}
        <path
          d="M580,142 L630,168 L670,148 L720,175 L760,160 L800,185"
          fill="none" stroke="#a0b0c8" strokeWidth="0.6" opacity="0.15"
        />

        {/* === OWL SILHOUETTE — perched on mid-mountain ridge === */}
        <g transform="translate(490,150)" opacity="0.7">
          {/* Body */}
          <ellipse cx="0" cy="0" rx="3" ry="4" fill="#080c16" />
          {/* Head — rotates occasionally */}
          <ellipse cx="0" cy="-5" rx="2.8" ry="2.5" fill="#080c16">
            <animateTransform attributeName="transform" type="rotate" values="0 0 -5;15 0 -5;15 0 -5;0 0 -5;0 0 -5;-10 0 -5;-10 0 -5;0 0 -5;0 0 -5" dur="10s" repeatCount="indefinite" />
          </ellipse>
          {/* Ear tufts */}
          <path d="M-2,-7 L-3,-9 L-1,-7.5 Z" fill="#080c16" />
          <path d="M2,-7 L3,-9 L1,-7.5 Z" fill="#080c16" />
          {/* Eyes — tiny glints */}
          <circle cx="-1" cy="-5.2" r="0.5" fill="#667788" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4;0;0;0.4" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="1" cy="-5.2" r="0.5" fill="#667788" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4;0;0;0.4" dur="6s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === SENTRY SILHOUETTE — standing soldier on mid-hill ridge, distant === */}
        <g transform="translate(648,225)" fill="#080c16" opacity="0.65">
          {/* Legs */}
          <line x1="-2" y1="6" x2="-3" y2="14" stroke="#080c16" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="6" x2="3" y2="14" stroke="#080c16" strokeWidth="1.5" strokeLinecap="round" />
          {/* Body */}
          <rect x="-3" y="-4" width="6" height="11" rx="1" />
          {/* Head */}
          <circle cx="0" cy="-7" r="2.5" />
          {/* Shako hat */}
          <rect x="-2" y="-11" width="4" height="3" rx="0.5" />
          <line x1="-2" y1="-11" x2="2" y2="-11" stroke="#080c16" strokeWidth="0.8" />
          {/* Musket — held upright */}
          <line x1="4" y1="4" x2="5" y2="-14" stroke="#080c16" strokeWidth="1.2" strokeLinecap="round" />
          {/* Bayonet tip glint */}
          <circle cx="5" cy="-14.5" r="0.4" fill="#667788" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === SECOND SENTRY — opposite side, silhouetted against sky on left ridge === */}
        <g transform="translate(142,200)" fill="#080c16" opacity="0.55">
          {/* Legs — slightly wider stance, bracing against wind */}
          <line x1="-2.5" y1="6" x2="-4" y2="15" stroke="#080c16" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="6" x2="4" y2="15" stroke="#080c16" strokeWidth="1.5" strokeLinecap="round" />
          {/* Body */}
          <rect x="-3" y="-4" width="6" height="11" rx="1" />
          {/* Greatcoat flap — blowing in wind */}
          <path d="M3,0 Q6,3 8,7 Q5,5 3,4 Z" fill="#080c16" opacity="0.5">
            <animate
              attributeName="d"
              values="M3,0 Q6,3 8,7 Q5,5 3,4 Z;M3,0 Q7,2 10,5 Q6,4 3,3 Z;M3,0 Q6,3 8,7 Q5,5 3,4 Z"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </path>
          {/* Head */}
          <circle cx="0" cy="-7" r="2.5" />
          {/* Bicorne hat — turned sideways against wind */}
          <path d="M-4,-10 Q0,-12 4,-10 Q2,-9 0,-8.5 Q-2,-9 -4,-10 Z" fill="#080c16" />
          {/* Musket — slung across shoulder */}
          <line x1="-4" y1="2" x2="-6" y2="-16" stroke="#080c16" strokeWidth="1.2" strokeLinecap="round" />
          {/* Bayonet glint */}
          <circle cx="-6" cy="-16.5" r="0.4" fill="#667788" opacity="0.25">
            <animate attributeName="opacity" values="0.25;0.45;0.25" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Breath visible in cold air */}
          <ellipse cx="5" cy="-8" rx="4" ry="2" fill="url(#cs_breathPlume)">
            <animate attributeName="rx" values="4;7;4" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" />
            <animate attributeName="cx" values="5;9;5" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === NEAR HILLS === */}
        <path d="M0,285 L50,260 L100,272 L150,245 L200,265 L260,238 L310,258 L360,232 L410,252 L450,238 L500,258 L550,235 L600,252 L650,230 L700,250 L750,242 L800,258 L800,400 L0,400 Z" fill="#0a0e18" />

        {/* === PINE TREE SILHOUETTES — conifers on near hill ridge === */}
        {/* Pine 1 — left side */}
        <g transform="translate(85,255)" fill="#070b14" opacity="0.9">
          <path d="M0,-28 L-5,-16 L-3,-17 L-7,-6 L-4,-8 L-9,0 L9,0 L4,-8 L7,-6 L3,-17 L5,-16 Z" />
          <rect x="-1.5" y="0" width="3" height="5" />
          {/* Pine needle clusters — small spiky groups on branches */}
          <g fill="#070b14" stroke="#0a1018" strokeWidth="0.3">
            <path d="M-5,-16 L-7,-18 M-5,-16 L-6,-14" />
            <path d="M5,-16 L7,-18 M5,-16 L6,-14" />
            <path d="M-7,-6 L-9,-8 M-7,-6 L-8,-4 M-7,-6 L-10,-6" />
            <path d="M7,-6 L9,-8 M7,-6 L8,-4 M7,-6 L10,-6" />
          </g>
        </g>
        {/* Pine 2 — left-center, smaller */}
        <g transform="translate(155,240)" fill="#070b14" opacity="0.85">
          <path d="M0,-22 L-4,-13 L-2.5,-14 L-6,-4 L-3,-6 L-7,0 L7,0 L3,-6 L6,-4 L2.5,-14 L4,-13 Z" />
          <rect x="-1" y="0" width="2.5" height="4" />
          {/* Needle clusters */}
          <g fill="#070b14" stroke="#0a1018" strokeWidth="0.3">
            <path d="M-4,-13 L-6,-15 M-4,-13 L-5,-11" />
            <path d="M4,-13 L6,-15 M4,-13 L5,-11" />
            <path d="M-6,-4 L-8,-6 M-6,-4 L-8,-3" />
            <path d="M6,-4 L8,-6 M6,-4 L8,-3" />
          </g>
        </g>
        {/* Pine 3 — right side, taller */}
        <g transform="translate(730,238)" fill="#070b14" opacity="0.9">
          <path d="M0,-32 L-6,-18 L-3.5,-20 L-8,-7 L-4.5,-9 L-10,0 L10,0 L4.5,-9 L8,-7 L3.5,-20 L6,-18 Z" />
          <rect x="-1.5" y="0" width="3" height="6" />
          {/* Needle clusters */}
          <g fill="#070b14" stroke="#0a1018" strokeWidth="0.3">
            <path d="M-6,-18 L-8,-20 M-6,-18 L-7,-16" />
            <path d="M6,-18 L8,-20 M6,-18 L7,-16" />
            <path d="M-8,-7 L-10,-9 M-8,-7 L-11,-7 M-8,-7 L-9,-5" />
            <path d="M8,-7 L10,-9 M8,-7 L11,-7 M8,-7 L9,-5" />
            <path d="M-10,0 L-12,-2 M-10,0 L-12,1" />
            <path d="M10,0 L12,-2 M10,0 L12,1" />
          </g>
        </g>

        {/* === ADDITIONAL PINE TREES — more Alpine conifers with snow on boughs === */}
        {/* Pine 4 — far left, small */}
        <g transform="translate(32,272)" fill="#070b14" opacity="0.8">
          <path d="M0,-18 L-4,-10 L-2,-11 L-5,-3 L-3,-5 L-6,0 L6,0 L3,-5 L5,-3 L2,-11 L4,-10 Z" />
          <rect x="-1" y="0" width="2" height="4" />
          {/* Snow on branches */}
          <ellipse cx="-4" cy="-10" rx="3" ry="1" fill="#1a2438" opacity="0.3" />
          <ellipse cx="4" cy="-10" rx="2.5" ry="0.8" fill="#1a2438" opacity="0.25" />
          <ellipse cx="-5" cy="-3" rx="3.5" ry="1.2" fill="#1c2640" opacity="0.25" />
        </g>
        {/* Pine 5 — center-right, medium, with heavy snow */}
        <g transform="translate(590,240)" fill="#070b14" opacity="0.85">
          <path d="M0,-25 L-5,-14 L-2.5,-15 L-7,-5 L-3.5,-7 L-8,0 L8,0 L3.5,-7 L7,-5 L2.5,-15 L5,-14 Z" />
          <rect x="-1.5" y="0" width="3" height="5" />
          {/* Snow loads on each tier of branches */}
          <ellipse cx="-3" cy="-14" rx="3.5" ry="1.2" fill="#1c2640" opacity="0.3" />
          <ellipse cx="3" cy="-14" rx="3" ry="1" fill="#1a2438" opacity="0.25" />
          <ellipse cx="-5" cy="-5" rx="4" ry="1.5" fill="#1c2640" opacity="0.3" />
          <ellipse cx="5" cy="-5" rx="3.5" ry="1.2" fill="#1a2438" opacity="0.25" />
          <ellipse cx="0" cy="-25" rx="1.5" ry="0.5" fill="#222e44" opacity="0.35" />
          {/* Needle clusters */}
          <g stroke="#0a1018" strokeWidth="0.3">
            <path d="M-5,-14 L-7,-16 M-5,-14 L-6,-12" />
            <path d="M5,-14 L7,-16 M5,-14 L6,-12" />
            <path d="M-7,-5 L-9,-7 M-7,-5 L-9,-4" />
            <path d="M7,-5 L9,-7 M7,-5 L9,-4" />
          </g>
        </g>
        {/* Pine 6 — far right cluster, small windswept */}
        <g transform="translate(770,248)" fill="#070b14" opacity="0.75">
          <path d="M0,-20 L-4,-12 L-2,-13 L-5,-4 L-3,-6 L-6,0 L6,0 L3,-6 L5,-4 L2,-13 L4,-12 Z" transform="rotate(5)" />
          <rect x="-1" y="0" width="2" height="3.5" />
          {/* Wind-bent snow patch */}
          <ellipse cx="3" cy="-12" rx="3" ry="0.8" fill="#1a2438" opacity="0.2" />
        </g>

        {/* === ROCKY OUTCROP — foreground right, craggy Alpine rocks === */}
        <g transform="translate(700,320)" opacity="0.75">
          {/* Large boulder */}
          <path d="M0,20 Q-5,10 -2,0 Q3,-5 10,-2 Q18,0 20,8 Q22,15 18,20 Z" fill="#0c1018" />
          {/* Rock face detail — cracks and texture */}
          <line x1="2" y1="2" x2="8" y2="8" stroke="#141c28" strokeWidth="0.4" opacity="0.4" />
          <line x1="12" y1="1" x2="15" y2="10" stroke="#141c28" strokeWidth="0.3" opacity="0.35" />
          <line x1="5" y1="12" x2="14" y2="16" stroke="#0e1420" strokeWidth="0.3" opacity="0.3" />
          {/* Snow cap on top */}
          <ellipse cx="8" cy="-1" rx="8" ry="2" fill="#1a2438" opacity="0.3" />
          {/* Small boulder alongside */}
          <path d="M22,18 Q20,12 24,10 Q28,12 27,18 Z" fill="#0e1420" />
          <ellipse cx="24" cy="10" rx="3" ry="1" fill="#1a2438" opacity="0.2" />
          {/* Moonlight edge highlight on rock face */}
          <path d="M10,-2 Q18,0 20,8" fill="none" stroke="#2a3448" strokeWidth="0.5" opacity="0.2" />
        </g>

        {/* === MIST BAND between hills and ground === */}
        <rect x="0" y="255" width="800" height="85" fill="url(#csMist)" />
        {/* Drifting mist wisps */}
        <ellipse cx="200" cy="270" rx="60" ry="8" fill="#1a2540" opacity="0.12">
          <animate attributeName="cx" values="200;230;200" dur="12s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="550" cy="262" rx="50" ry="6" fill="#1a2540" opacity="0.1">
          <animate attributeName="cx" values="550;520;550" dur="15s" repeatCount="indefinite" />
        </ellipse>

        {/* === DISTANT CAMPFIRES — the army spread across the plateau === */}
        <circle cx="120" cy="268" r="4" fill="url(#csDistFire)" />
        <circle cx="120" cy="268" r="1.2" fill="#ffcc44" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.6;0.8" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="262" r="3" fill="url(#csDistFire)" />
        <circle cx="140" cy="262" r="0.8" fill="#ffcc44" opacity="0.7" />
        <circle cx="108" cy="272" r="2.5" fill="url(#csDistFire)" />
        <circle cx="108" cy="272" r="0.7" fill="#ffaa33" opacity="0.6" />
        <circle cx="280" cy="252" r="3.5" fill="url(#csDistFire)" />
        <circle cx="280" cy="252" r="1.0" fill="#ffcc44" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="255" r="3" fill="url(#csDistFire)" />
        <circle cx="300" cy="255" r="0.8" fill="#ffaa33" opacity="0.7" />
        <circle cx="520" cy="252" r="3.5" fill="url(#csDistFire)" />
        <circle cx="520" cy="252" r="1.0" fill="#ffcc44" opacity="0.8" />
        <circle cx="600" cy="248" r="3.5" fill="url(#csDistFire)" />
        <circle cx="600" cy="248" r="1.0" fill="#ffcc44" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.55;0.8" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="620" cy="244" r="2.5" fill="url(#csDistFire)" />
        <circle cx="620" cy="244" r="0.7" fill="#ffaa33" opacity="0.6" />
        <circle cx="720" cy="246" r="3" fill="url(#csDistFire)" />
        <circle cx="720" cy="246" r="0.9" fill="#ffcc44" opacity="0.7" />
        <circle cx="200" cy="262" r="2" fill="url(#csDistFire)" />
        <circle cx="200" cy="262" r="0.6" fill="#ffaa33" opacity="0.5" />
        <circle cx="430" cy="248" r="2.5" fill="url(#csDistFire)" />
        <circle cx="430" cy="248" r="0.7" fill="#ffcc44" opacity="0.6" />
        <circle cx="680" cy="242" r="2" fill="url(#csDistFire)" />
        <circle cx="680" cy="242" r="0.6" fill="#ffaa33" opacity="0.5" />
        <circle cx="350" cy="245" r="2" fill="url(#csDistFire)" />
        <circle cx="350" cy="245" r="0.6" fill="#ffaa33" opacity="0.45" />

        {/* === MORE DISTANT FIRES — spread further across the plateau === */}
        {/* Far left cluster — beyond the near hills */}
        <circle cx="42" cy="275" r="2.5" fill="url(#csDistFire)" />
        <circle cx="42" cy="275" r="0.7" fill="#ffcc44" opacity="0.55">
          <animate attributeName="opacity" values="0.55;0.35;0.55" dur="2.3s" repeatCount="indefinite" />
        </circle>
        {/* Far plateau — very distant, tiny */}
        <circle cx="475" cy="243" r="1.8" fill="url(#csDistFire)" />
        <circle cx="475" cy="243" r="0.5" fill="#ffaa33" opacity="0.4" />
        {/* Right plateau — isolated fire */}
        <circle cx="760" cy="250" r="2.2" fill="url(#csDistFire)" />
        <circle cx="760" cy="250" r="0.6" fill="#ffcc44" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="2.8s" repeatCount="indefinite" />
        </circle>
        {/* Center-left gap fill */}
        <circle cx="240" cy="258" r="1.8" fill="url(#csDistFire)" />
        <circle cx="240" cy="258" r="0.5" fill="#ffaa33" opacity="0.35" />

        {/* Animated glow rings on select distant fires */}
        <circle cx="430" cy="248" r="5" fill="none" stroke="#cc6600" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="120" cy="268" r="4" fill="none" stroke="#cc6600" strokeWidth="0.5" opacity="0.25">
          <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* === GROUND === */}
        <path d="M0,310 Q100,295 200,308 Q300,318 400,300 Q500,288 600,302 Q700,315 800,298 L800,400 L0,400 Z" fill="url(#csGroundGlow)" />
        <rect x="100" y="200" width="600" height="200" fill="url(#csFireGlow)" />

        {/* Ground texture — rocks and scrub */}
        <ellipse cx="180" cy="365" rx="8" ry="3" fill="#0a0e14" opacity="0.5" />
        <ellipse cx="250" cy="375" rx="6" ry="2" fill="#0c1018" opacity="0.4" />
        <ellipse cx="560" cy="370" rx="7" ry="2.5" fill="#0a0e14" opacity="0.45" />
        <ellipse cx="620" cy="380" rx="5" ry="2" fill="#0c1018" opacity="0.4" />
        <ellipse cx="330" cy="385" rx="10" ry="3" fill="#0a0e14" opacity="0.3" />

        {/* === TRAMPLED SNOW PATCHES — near soldiers' feet === */}
        <ellipse cx="300" cy="368" rx="10" ry="3" fill="#1a2030" opacity="0.25" />
        <ellipse cx="302" cy="369" rx="8" ry="2" fill="#2a3448" opacity="0.15" />
        <ellipse cx="355" cy="371" rx="8" ry="2.5" fill="#1a2030" opacity="0.2" />
        <ellipse cx="450" cy="370" rx="9" ry="2.5" fill="#1a2030" opacity="0.22" />
        <ellipse cx="495" cy="369" rx="10" ry="3" fill="#1a2030" opacity="0.25" />
        <ellipse cx="497" cy="370" rx="7" ry="1.8" fill="#2a3448" opacity="0.15" />
        {/* Larger patch near campfire — packed snow */}
        <ellipse cx="400" cy="360" rx="18" ry="4" fill="#141c28" opacity="0.15" />

        {/* === BOOT TRACKS IN SNOW — footprints leading between tents === */}
        {/* Trail from bivouac tarp (right) toward campfire */}
        <g opacity="0.18" fill="#0a1018">
          <ellipse cx="588" cy="358" rx="2.5" ry="1.2" />
          <ellipse cx="580" cy="356" rx="2.5" ry="1.2" />
          <ellipse cx="571" cy="357" rx="2.5" ry="1.2" />
          <ellipse cx="562" cy="355" rx="2.5" ry="1.2" />
          <ellipse cx="553" cy="356" rx="2.5" ry="1.2" />
          <ellipse cx="544" cy="358" rx="2.5" ry="1.2" />
          <ellipse cx="535" cy="360" rx="2.5" ry="1.2" />
          <ellipse cx="526" cy="359" rx="2.5" ry="1.2" />
          <ellipse cx="517" cy="360" rx="2.5" ry="1.2" />
          <ellipse cx="508" cy="362" rx="2.5" ry="1.2" />
        </g>
        {/* Trail from left side toward campfire */}
        <g opacity="0.15" fill="#0a1018">
          <ellipse cx="220" cy="372" rx="2.2" ry="1.1" />
          <ellipse cx="230" cy="370" rx="2.2" ry="1.1" />
          <ellipse cx="240" cy="371" rx="2.2" ry="1.1" />
          <ellipse cx="250" cy="369" rx="2.2" ry="1.1" />
          <ellipse cx="260" cy="368" rx="2.2" ry="1.1" />
          <ellipse cx="270" cy="367" rx="2.2" ry="1.1" />
        </g>

        {/* === ROCK OVERHANG with ICICLES — foreground left === */}
        <g transform="translate(100,340)">
          {/* Rock overhang */}
          <path d="M-30,10 Q-25,0 -10,-5 Q5,-3 25,2 Q30,6 28,12 L-28,14 Z" fill="#0a0e14" opacity="0.8" />
          <path d="M-28,10 Q-22,2 -8,-3 Q6,-1 22,4 L20,6 Q4,1 -8,-1 Q-20,3 -26,10 Z" fill="#111822" opacity="0.5" />
          {/* Icicles hanging from rock edge */}
          <path d="M-18,8 L-17,18 L-16,8 Z" fill="#a0c0e0" opacity="0.3" />
          <path d="M-12,6 L-11.2,20 L-10.5,6 Z" fill="#b0d0f0" opacity="0.35" />
          <path d="M-5,5 L-4.3,22 L-3.5,5 Z" fill="#c0d8f0" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.55;0.4" dur="6s" repeatCount="indefinite" />
          </path>
          <path d="M2,6 L2.6,17 L3.3,6 Z" fill="#a8c8e0" opacity="0.3" />
          <path d="M8,7 L8.5,15 L9.2,7 Z" fill="#90b0d0" opacity="0.25" />
          <path d="M14,9 L14.4,16 L15,9 Z" fill="#90b0d0" opacity="0.2" />
          {/* Drip highlight on longest icicle */}
          <circle cx="-4.3" cy="21" r="0.6" fill="#d0e8ff" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === BIVOUAC TARP / SHELTER — near right edge === */}
        <g transform="translate(600,340)">
          {/* Tarp — angled canvas sheet propped on a stick */}
          <path d="M0,5 L35,-10 L70,5 Z" fill="url(#csTarp)" />
          {/* Ridge pole / stick */}
          <line x1="35" y1="-10" x2="35" y2="8" stroke="#1a1508" strokeWidth="1.5" strokeLinecap="round" />
          {/* Rope line from tarp to a peg */}
          <line x1="0" y1="5" x2="-8" y2="10" stroke="#1a1810" strokeWidth="0.5" opacity="0.4" />
          <line x1="70" y1="5" x2="78" y2="10" stroke="#1a1810" strokeWidth="0.5" opacity="0.4" />
          {/* Tent pegs */}
          <line x1="-8" y1="10" x2="-6" y2="14" stroke="#2a2010" strokeWidth="0.8" />
          <line x1="78" y1="10" x2="76" y2="14" stroke="#2a2010" strokeWidth="0.8" />
          {/* Shadow underneath */}
          <ellipse cx="35" cy="8" rx="30" ry="4" fill="#040608" opacity="0.4" />
          {/* Canvas texture lines */}
          <line x1="12" y1="0" x2="35" y2="-8" stroke="#222018" strokeWidth="0.3" opacity="0.4" />
          <line x1="58" y1="0" x2="35" y2="-8" stroke="#222018" strokeWidth="0.3" opacity="0.4" />

          {/* === FROST CRYSTALS ON TENT ROPES — small angular shapes === */}
          {/* Left rope frost */}
          <g opacity="0.4">
            <polygon points="-3,7 -4,5.5 -2,6" fill="#c0d8f0" />
            <polygon points="-5,8 -6.5,6.5 -4,7" fill="#b0c8e0" />
            <polygon points="-1,6 -2,4 0,5" fill="#a8c0d8" />
          </g>
          {/* Right rope frost */}
          <g opacity="0.35">
            <polygon points="73,7 71.5,5.5 74,6" fill="#c0d8f0" />
            <polygon points="75,8.5 73.5,7 76,7.5" fill="#b0c8e0" />
            <polygon points="77,9.5 75.5,8 78,8.5" fill="#a8c0d8" />
          </g>

          {/* === ICE CRYSTALS ON TENT FLAP EDGE — frozen condensation === */}
          <g opacity="0.35">
            {/* Along the left edge of tarp */}
            <line x1="3" y1="4" x2="1" y2="2" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="3" y1="4" x2="5" y2="2.5" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="3" y1="4" x2="2" y2="6" stroke="#a8c8e0" strokeWidth="0.3" />
            <circle cx="3" cy="4" r="0.3" fill="#d0e8ff" opacity="0.5" />

            <line x1="8" y1="2.5" x2="6" y2="0.5" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="8" y1="2.5" x2="10" y2="1" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="8" y1="2.5" x2="7" y2="4.5" stroke="#a8c8e0" strokeWidth="0.3" />

            <line x1="14" y1="1" x2="12" y2="-1" stroke="#b0c8e0" strokeWidth="0.3" />
            <line x1="14" y1="1" x2="16" y2="-0.5" stroke="#b0c8e0" strokeWidth="0.3" />
            <circle cx="14" cy="1" r="0.25" fill="#d0e8ff" opacity="0.4" />

            {/* Along the right edge of tarp */}
            <line x1="62" y1="2.5" x2="60" y2="0.5" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="62" y1="2.5" x2="64" y2="1" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="62" y1="2.5" x2="63" y2="4.5" stroke="#a8c8e0" strokeWidth="0.3" />

            <line x1="66" y1="4" x2="64" y2="2" stroke="#c0d8f0" strokeWidth="0.3" />
            <line x1="66" y1="4" x2="68" y2="2.5" stroke="#c0d8f0" strokeWidth="0.3" />
            <circle cx="66" cy="4" r="0.3" fill="#d0e8ff" opacity="0.45">
              <animate attributeName="opacity" values="0.45;0.65;0.45" dur="7s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* === ARTILLERY POSITION — cannonball stack and ammo boxes === */}
        <g transform="translate(200,345)">
          {/* === CANNONBALL STACK — pyramid of iron balls near gun position === */}
          {/* Bottom row — 3 balls */}
          <circle cx="0" cy="10" r="3.5" fill="#0c0e14" />
          <circle cx="7" cy="10" r="3.5" fill="#0e1018" />
          <circle cx="14" cy="10" r="3.5" fill="#0c0e14" />
          {/* Middle row — 2 balls */}
          <circle cx="3.5" cy="5" r="3.5" fill="#101420" />
          <circle cx="10.5" cy="5" r="3.5" fill="#0e1018" />
          {/* Top ball */}
          <circle cx="7" cy="0" r="3.5" fill="#121624" />
          {/* Iron sheen — faint moonlight glint */}
          <circle cx="8.5" cy="-1.5" r="1" fill="#2a3040" opacity="0.35">
            <animate attributeName="opacity" values="0.35;0.5;0.35" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="5" cy="3.5" r="0.6" fill="#1a2030" opacity="0.25" />
          <circle cx="12" cy="3.5" r="0.6" fill="#1a2030" opacity="0.2" />

          {/* === SNOW-DUSTED AMMUNITION BOXES — wooden crates near cannonballs === */}
          {/* Box 1 — larger */}
          <g transform="translate(22,4)">
            <rect x="0" y="0" width="14" height="9" rx="0.5" fill="#0e0c08" opacity="0.75" />
            {/* Lid line */}
            <line x1="0.5" y1="2.5" x2="13.5" y2="2.5" stroke="#1a1810" strokeWidth="0.4" />
            {/* Iron strap */}
            <line x1="7" y1="0" x2="7" y2="9" stroke="#14161c" strokeWidth="0.6" />
            {/* Snow dusting on top */}
            <path d="M0.5,0 Q3,-1.5 7,-1 Q11,-1.5 13.5,0" fill="none" stroke="#2a3448" strokeWidth="1.2" opacity="0.4" />
            <ellipse cx="4" cy="-0.5" rx="2.5" ry="0.8" fill="#1c2438" opacity="0.3" />
            <ellipse cx="10" cy="-0.3" rx="2" ry="0.6" fill="#1c2438" opacity="0.25" />
          </g>
          {/* Box 2 — smaller, stacked at angle */}
          <g transform="translate(26,-2) rotate(-5)">
            <rect x="0" y="0" width="10" height="7" rx="0.5" fill="#100e0a" opacity="0.7" />
            {/* Lid line */}
            <line x1="0.5" y1="2" x2="9.5" y2="2" stroke="#1a1810" strokeWidth="0.3" />
            {/* Snow on top */}
            <ellipse cx="5" cy="0" rx="3.5" ry="0.7" fill="#1c2438" opacity="0.35" />
            <ellipse cx="3" cy="-0.3" rx="1.5" ry="0.5" fill="#222e44" opacity="0.25" />
          </g>
        </g>

        {/* === SMOKE from campfire === */}
        <ellipse cx="395" cy="220" rx="25" ry="40" fill="url(#csSmoke)">
          <animate attributeName="cx" values="395;400;395" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="408" cy="175" rx="18" ry="32" fill="url(#csSmoke)">
          <animate attributeName="cx" values="408;402;408" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="388" cy="140" rx="14" ry="28" fill="url(#csSmoke)">
          <animate attributeName="cx" values="388;394;388" dur="7s" repeatCount="indefinite" />
        </ellipse>

        {/* === ADDITIONAL SMOKE WISPS — thinner branching tendrils === */}
        {/* Left wisp — splits from main column */}
        <ellipse cx="380" cy="195" rx="10" ry="18" fill="url(#csSmoke)">
          <animate attributeName="cx" values="380;372;380" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="9s" repeatCount="indefinite" />
        </ellipse>
        {/* Right wisp — drifts with wind */}
        <ellipse cx="418" cy="160" rx="8" ry="15" fill="url(#csSmoke)">
          <animate attributeName="cx" values="418;428;418" dur="11s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="11s" repeatCount="indefinite" />
        </ellipse>
        {/* High thin wisp — nearly dissipated */}
        <ellipse cx="393" cy="115" rx="10" ry="20" fill="#444" fillOpacity="0.02">
          <animate attributeName="cx" values="393;402;393" dur="10s" repeatCount="indefinite" />
        </ellipse>
        {/* Tendril curling left */}
        <ellipse cx="375" cy="230" rx="7" ry="12" fill="url(#csSmoke)">
          <animate attributeName="cx" values="375;368;375" dur="7.5s" repeatCount="indefinite" />
        </ellipse>

        {/* === CAMPFIRE — logs, flames, glow === */}
        {/* Logs */}
        <line x1="380" y1="355" x2="420" y2="348" stroke="#2a1a0a" strokeWidth="5" strokeLinecap="round" />
        <line x1="385" y1="348" x2="415" y2="355" stroke="#2a1a0a" strokeWidth="4" strokeLinecap="round" />
        <line x1="390" y1="352" x2="410" y2="352" stroke="#1a1005" strokeWidth="4" strokeLinecap="round" />
        {/* Embers at base */}
        <ellipse cx="400" cy="352" rx="12" ry="3" fill="#aa3300" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.7;0.5" dur="1.2s" repeatCount="indefinite" />
        </ellipse>
        {/* Outer flame */}
        <path d="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z" fill="#dd6611" opacity="0.9">
          <animate attributeName="d" values="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z;M400,290 Q390,315 383,340 Q392,328 400,316 Q408,328 417,340 Q410,315 400,290Z;M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z" dur="0.8s" repeatCount="indefinite" />
        </path>
        {/* Mid flame */}
        <path d="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z" fill="#ee9922" opacity="0.85">
          <animate attributeName="d" values="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z;M400,301 Q394,320 388,338 Q395,326 400,315 Q405,326 412,338 Q406,320 400,301Z;M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z" dur="0.6s" repeatCount="indefinite" />
        </path>
        {/* Inner flame */}
        <path d="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z" fill="#ffcc44" opacity="0.8">
          <animate attributeName="d" values="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z;M400,309 Q396,324 393,336 Q397,326 400,317 Q403,326 407,336 Q404,324 400,309Z;M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z" dur="0.5s" repeatCount="indefinite" />
        </path>
        {/* Fire glow on ground */}
        <ellipse cx="400" cy="350" rx="25" ry="6" fill="#cc5500" opacity="0.4">
          <animate attributeName="rx" values="25;28;25" dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.5;0.4" dur="0.7s" repeatCount="indefinite" />
        </ellipse>

        {/* === SPARKS rising from fire === */}
        <circle cx="395" cy="285" r="1.5" fill="#ffaa22" opacity="0.8">
          <animate attributeName="cy" values="295;255;215" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cx" values="395;390;388" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="405" cy="280" r="1.0" fill="#ff8811" opacity="0.7">
          <animate attributeName="cy" values="290;245;200" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.4;0" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="cx" values="405;410;415" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="287" r="1.2" fill="#ffcc44" opacity="0.6">
          <animate attributeName="cy" values="293;240;185" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite" />
          <animate attributeName="cx" values="400;397;393" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="398" cy="283" r="0.8" fill="#ff9933" opacity="0.7">
          <animate attributeName="cy" values="291;250;210" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0.4;0" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="cx" values="398;403;408" dur="1.8s" repeatCount="indefinite" />
        </circle>
        {/* Extra spark — slow drifter */}
        <circle cx="402" cy="290" r="0.6" fill="#ffbb33" opacity="0.5">
          <animate attributeName="cy" values="295;230;165" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.3;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cx" values="402;395;390" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* === SOLDIER 1 — left, with musket, sitting upright === */}
        <g fill="#0e0e10">
          <path d="M290,362 Q298,354 310,360 Q315,364 320,367 L285,367 Z" />
          <path d="M292,360 Q290,342 294,327 Q296,318 300,312 L314,312 Q310,318 308,327 Q306,342 308,360 Z" />
          <path d="M290,357 Q285,362 282,370 L295,367 Z" fill="#0c0c0e" />
          <path d="M310,357 Q315,362 318,370 L305,367 Z" fill="#0c0c0e" />
          <line x1="296" y1="317" x2="312" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <line x1="312" y1="317" x2="296" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <rect x="300" y="344" width="8" height="6" rx="1" fill="#141416" />
          <rect x="302" y="307" width="5" height="6" fill="#0e0e10" />
          <ellipse cx="307" cy="301" rx="8" ry="9" />
          <path d="M293,298 Q300,290 307,287 Q314,290 321,298 Q314,295 307,294 Q300,295 293,298 Z" fill="#0c0c0e" />
          <path d="M290,300 Q292,292 298,288 L295,297 Z" fill="#0a0a0c" />
          <path d="M324,300 Q322,292 316,288 L319,297 Z" fill="#0a0a0c" />
          <circle cx="307" cy="292" r="2.5" fill="#141418" />
          {/* Arms reaching toward fire */}
          <path d="M312,320 Q325,324 340,330 L342,334 Q326,330 312,326 Z" />
          <path d="M296,320 Q308,326 325,332 L324,336 Q306,330 295,324 Z" />
          {/* Musket leaning against shoulder */}
          <line x1="280" y1="367" x2="286" y2="270" stroke="#111114" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="286" y1="274" x2="287" y2="264" stroke="#1a1a20" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="287" y1="264" x2="288" y2="256" stroke="#22222a" strokeWidth="1" strokeLinecap="round" />
          {/* Breath vapor — cold night */}
          <ellipse cx="320" cy="296" rx="6" ry="3" fill="url(#csBreath)">
            <animate attributeName="rx" values="6;9;6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === SOLDIER 2 — left-center, hunched === */}
        <g fill="#0e0e10">
          <path d="M340,364 Q348,356 358,362 Q363,366 365,370 L335,370 Z" />
          <path d="M342,362 Q340,340 343,327 Q345,318 349,312 L363,312 Q359,318 357,327 Q354,340 356,362 Z" />
          <path d="M340,360 Q336,365 333,372 L344,368 Z" fill="#0c0c0e" />
          <line x1="346" y1="317" x2="360" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <line x1="360" y1="317" x2="346" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <rect x="349" y="344" width="8" height="6" rx="1" fill="#141416" />
          <rect x="352" y="307" width="5" height="6" fill="#0e0e10" />
          <ellipse cx="357" cy="301" rx="8" ry="9" />
          <path d="M343,298 Q350,290 357,287 Q364,290 371,298 Q364,295 357,294 Q350,295 343,298 Z" fill="#0c0c0e" />
          <path d="M340,300 Q342,292 348,288 L345,297 Z" fill="#0a0a0c" />
          <path d="M374,300 Q372,292 366,288 L369,297 Z" fill="#0a0a0c" />
          <circle cx="357" cy="292" r="2.5" fill="#141418" />
          {/* Hands between knees — cold */}
          <path d="M345,327 Q342,340 340,350 L344,352 Q345,342 347,330 Z" />
          <path d="M360,327 Q363,340 365,350 L361,352 Q360,342 358,330 Z" />
          {/* Prayer cross — small crucifix dangling from hand */}
          <g transform="translate(342,348)" opacity="0.5">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#3a3020" strokeWidth="0.8" />
            <line x1="-1.5" y1="1.5" x2="1.5" y2="1.5" stroke="#3a3020" strokeWidth="0.8" />
            {/* Faint glint on cross */}
            <circle cx="0" cy="1.5" r="0.4" fill="#887744" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>
          {/* Breath */}
          <ellipse cx="370" cy="296" rx="5" ry="2.5" fill="url(#csBreath)">
            <animate attributeName="rx" values="5;8;5" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;1" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
          {/* === VISIBLE BREATH PLUME — thicker exhalation cloud in freezing air === */}
          <ellipse cx="374" cy="293" rx="8" ry="4" fill="url(#cs_breathPlume)">
            <animate attributeName="rx" values="8;14;8" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="ry" values="4;6;4" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="cx" values="374;382;374" dur="4.5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === SOLDIER 3 — right-center, leaning back === */}
        <g fill="#0e0e10">
          <path d="M460,364 Q452,356 442,362 Q437,366 435,370 L465,370 Z" />
          <path d="M458,362 Q460,340 457,325 Q454,316 450,310 L436,312 Q440,318 443,327 Q446,340 444,362 Z" />
          <path d="M460,360 Q464,365 467,372 L456,368 Z" fill="#0c0c0e" />
          <line x1="453" y1="317" x2="439" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <line x1="439" y1="317" x2="453" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <rect x="442" y="344" width="8" height="6" rx="1" fill="#141416" />
          <rect x="443" y="305" width="5" height="6" fill="#0e0e10" />
          <ellipse cx="443" cy="299" rx="8" ry="9" />
          <path d="M457,296 Q450,288 443,285 Q436,288 429,296 Q436,293 443,292 Q450,293 457,296 Z" fill="#0c0c0e" />
          <path d="M460,298 Q458,290 452,286 L455,295 Z" fill="#0a0a0c" />
          <path d="M426,298 Q428,290 434,286 L431,295 Z" fill="#0a0a0c" />
          <circle cx="443" cy="290" r="2.5" fill="#141418" />
          {/* Arm gesturing */}
          <path d="M438,320 Q430,327 425,332 Q422,330 428,322 Q434,316 438,317 Z" />
          <path d="M450,322 Q455,334 458,347 L454,348 Q452,336 448,325 Z" />
          {/* Canteen on the ground */}
          <ellipse cx="470" cy="364" rx="6" ry="4" fill="#111114" />
          <line x1="466" y1="362" x2="474" y2="362" stroke="#1a1a1e" strokeWidth="1" />
        </g>

        {/* === SOLDIER 4 — right, with musket === */}
        <g fill="#0e0e10">
          <path d="M505,364 Q497,356 487,362 Q482,366 480,370 L510,370 Z" />
          <path d="M503,362 Q505,340 502,327 Q500,318 496,312 L482,312 Q486,318 488,327 Q490,340 488,362 Z" />
          <path d="M505,360 Q509,365 512,372 L501,368 Z" fill="#0c0c0e" />
          <path d="M487,360 Q483,365 480,372 L491,368 Z" fill="#0c0c0e" />
          <line x1="499" y1="317" x2="485" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <line x1="485" y1="317" x2="499" y2="347" stroke="#1a1a1e" strokeWidth="2" />
          <rect x="488" y="344" width="8" height="6" rx="1" fill="#141416" />
          <rect x="489" y="307" width="5" height="6" fill="#0e0e10" />
          <ellipse cx="489" cy="301" rx="8" ry="9" />
          <path d="M503,298 Q496,290 489,287 Q482,290 475,298 Q482,295 489,294 Q496,295 503,298 Z" fill="#0c0c0e" />
          <path d="M506,300 Q504,292 498,288 L501,297 Z" fill="#0a0a0c" />
          <path d="M472,300 Q474,292 480,288 L477,297 Z" fill="#0a0a0c" />
          <circle cx="489" cy="292" r="2.5" fill="#141418" />
          <path d="M485,320 Q480,327 478,337 L482,338 Q483,328 487,322 Z" />
          <path d="M498,322 Q502,334 504,347 L500,348 Q499,336 496,325 Z" />
          <line x1="476" y1="367" x2="473" y2="270" stroke="#111114" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="473" y1="274" x2="472" y2="264" stroke="#1a1a20" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="472" y1="264" x2="471" y2="256" stroke="#22222a" strokeWidth="1" strokeLinecap="round" />
          {/* Breath */}
          <ellipse cx="478" cy="296" rx="5" ry="2.5" fill="url(#csBreath)">
            <animate attributeName="rx" values="5;7;5" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;1" dur="4s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === SOLDIER 5 — SLEEPING, curled on ground near fire === */}
        <g transform="translate(540,358)" opacity="0.85">
          {/* Blanket — draped over curled body */}
          <path d="M0,0 Q5,-10 18,-12 Q30,-10 38,-4 Q40,2 38,8 Q30,12 18,12 Q5,10 0,5 Z" fill="#0c0c10" />
          {/* Blanket texture — worn wool */}
          <path d="M5,-6 Q12,-10 20,-10 Q28,-8 34,-3" fill="none" stroke="#161620" strokeWidth="0.5" opacity="0.6" />
          <path d="M3,-2 Q10,-7 18,-8 Q26,-6 33,-1" fill="none" stroke="#141418" strokeWidth="0.4" opacity="0.5" />
          {/* Head poking out — shako off */}
          <ellipse cx="-2" cy="-2" rx="5" ry="5.5" fill="#0e0e10" />
          {/* Hair — dark */}
          <path d="M-6,-4 Q-4,-8 -1,-8 Q2,-7 3,-4 Q0,-5 -3,-5 Z" fill="#0a0a0c" />
          {/* Knees visible bump through blanket */}
          <ellipse cx="22" cy="-8" rx="5" ry="3" fill="#0e0e12" />
          {/* Boots poking out */}
          <rect x="36" y="2" width="6" height="3" rx="1" fill="#0a0a0c" />
          <rect x="36" y="6" width="6" height="3" rx="1" fill="#0a0a0c" />
          {/* Shako set aside by head */}
          <rect x="-12" y="2" width="5" height="4" rx="0.5" fill="#0c0c0e" />
          {/* Very faint breath */}
          <ellipse cx="-8" cy="-4" rx="3" ry="1.5" fill="url(#csBreath)">
            <animate attributeName="rx" values="3;5;3" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === CAMP DOG — curled up near the warmth of the fire === */}
        <g transform="translate(430,362)" opacity="0.7">
          {/* Body — small dog curled in tight ball for warmth */}
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#0e0c0a" />
          {/* Back curve */}
          <path d="M-6,-3 Q-3,-5 2,-5 Q6,-4 7,-2" fill="none" stroke="#1a1810" strokeWidth="0.6" opacity="0.5" />
          {/* Head — resting on paws */}
          <ellipse cx="-7" cy="1" rx="3.5" ry="3" fill="#100e0c" />
          {/* Muzzle */}
          <ellipse cx="-10" cy="2" rx="2" ry="1.5" fill="#0c0a08" />
          {/* Nose — tiny dark dot */}
          <circle cx="-11.5" cy="1.8" r="0.5" fill="#060604" />
          {/* Ear — flopped over */}
          <path d="M-6,-1 Q-8,-3 -9,-1 Q-8,0 -6,-1 Z" fill="#0a0808" />
          {/* Eye — closed, just a line (sleeping) */}
          <line x1="-8" y1="0.5" x2="-6" y2="0.5" stroke="#1a1810" strokeWidth="0.4" opacity="0.4" />
          {/* Tail curled around body */}
          <path d="M7,-1 Q9,0 8,3 Q6,4 5,3" fill="none" stroke="#100e0c" strokeWidth="1.5" strokeLinecap="round" />
          {/* Paws tucked under chin */}
          <ellipse cx="-9" cy="3" rx="1.5" ry="1" fill="#0e0c0a" />
          {/* Faint warmth glow on dog — reflected firelight */}
          <ellipse cx="-2" cy="-2" rx="5" ry="3" fill="#2a1508" opacity="0.1" />
          {/* Dog breathing — subtle rib motion */}
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke="#1a1810" strokeWidth="0.3" opacity="0.15">
            <animate attributeName="ry" values="5;5.3;5" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === FOX EYES — curious fox watching from darkness beyond firelight === */}
        <g opacity="0.5">
          {/* Pair of amber eyes, low to the ground, slightly behind near hills */}
          <circle cx="748" cy="318" r="0.7" fill="#cc8833">
            <animate attributeName="opacity" values="0;0;0;0.5;0.7;0.7;0.5;0;0;0;0;0;0;0.4;0.6;0.4;0;0" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="752" cy="318" r="0.7" fill="#cc8833">
            <animate attributeName="opacity" values="0;0;0;0.5;0.7;0.7;0.5;0;0;0;0;0;0;0.4;0.6;0.4;0;0" dur="15s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === EQUIPMENT scattered on ground === */}
        {/* Knapsack */}
        <rect x="260" y="360" width="10" height="8" rx="2" fill="#111118" opacity="0.6" />
        <line x1="262" y1="361" x2="262" y2="367" stroke="#1a1a22" strokeWidth="0.5" />
        {/* Bedroll */}
        <ellipse cx="530" cy="368" rx="12" ry="4" fill="#111118" opacity="0.5" />
        {/* Cooking pot near fire */}
        <path d="M425,356 Q430,350 435,356 L433,358 L427,358 Z" fill="#0c0c0e" opacity="0.7" />
        {/* Bread loaf */}
        <ellipse cx="370" cy="362" rx="4" ry="2.5" fill="#1a1510" opacity="0.5" />

        {/* === FROZEN WATER BUCKET — near the fire, ice on top === */}
        <g transform="translate(355,370)">
          {/* Bucket body — wooden staves */}
          <path d="M-5,0 L-4,-8 L4,-8 L5,0 Z" fill="#111114" opacity="0.65" />
          {/* Iron hoop bands */}
          <line x1="-4.5" y1="-2" x2="4.5" y2="-2" stroke="#1a1a20" strokeWidth="0.5" opacity="0.4" />
          <line x1="-4.2" y1="-6" x2="4.2" y2="-6" stroke="#1a1a20" strokeWidth="0.5" opacity="0.4" />
          {/* Bail handle — wire arc */}
          <path d="M-3,-8 Q0,-13 3,-8" fill="none" stroke="#1a1a22" strokeWidth="0.6" opacity="0.4" />
          {/* Frozen ice surface on top */}
          <ellipse cx="0" cy="-8" rx="4" ry="1.5" fill="url(#cs_iceSheen)" opacity="0.6" />
          {/* Ice crack lines */}
          <line x1="-2" y1="-8" x2="1" y2="-7.5" stroke="#d0e8ff" strokeWidth="0.25" opacity="0.35" />
          <line x1="0" y1="-8.5" x2="2" y2="-7.8" stroke="#c0d8f0" strokeWidth="0.2" opacity="0.3" />
          {/* Frost rim around bucket top */}
          <ellipse cx="0" cy="-8" rx="4.5" ry="1.8" fill="none" stroke="#a0c0e0" strokeWidth="0.4" opacity="0.25">
            <animate attributeName="opacity" values="0.25;0.4;0.25" dur="8s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === DISCARDED PLAYING CARD — half-buried in snow === */}
        <g transform="translate(320,378) rotate(-15)" opacity="0.4">
          {/* Card face — off-white, worn */}
          <rect x="0" y="0" width="5" height="7" rx="0.3" fill="#1a1a20" />
          <rect x="0.3" y="0.3" width="4.4" height="6.4" rx="0.2" fill="#222230" />
          {/* Pip — a heart or spade symbol, simplified */}
          <path d="M2.5,2 L2,3 L2.5,2.5 L3,3 Z" fill="#3a1818" opacity="0.6" />
          <path d="M2.5,4 L2,5 L2.5,4.5 L3,5 Z" fill="#3a1818" opacity="0.5" />
          {/* Snow partially covering card */}
          <ellipse cx="1.5" cy="6" rx="2.5" ry="1" fill="#1a2030" opacity="0.35" />
        </g>

        {/* === TELESCOPE/SPYGLASS ON A BARREL — officer's instrument === */}
        <g transform="translate(240,350)">
          {/* Small barrel — upright */}
          <ellipse cx="0" cy="0" rx="6" ry="3" fill="#0e0c0a" opacity="0.6" />
          <rect x="-6" y="0" width="12" height="12" rx="1" fill="#100e0a" opacity="0.55" />
          <ellipse cx="0" cy="12" rx="6" ry="3" fill="#0c0a08" opacity="0.5" />
          {/* Barrel hoops */}
          <line x1="-6" y1="3" x2="6" y2="3" stroke="#1a1810" strokeWidth="0.5" opacity="0.3" />
          <line x1="-6" y1="9" x2="6" y2="9" stroke="#1a1810" strokeWidth="0.5" opacity="0.3" />
          {/* Spyglass resting on top — brass tube */}
          <line x1="-7" y1="-1" x2="8" y2="-2" stroke="#1a1810" strokeWidth="1.8" strokeLinecap="round" />
          {/* Wider eyepiece end */}
          <circle cx="-7" cy="-1" r="1.5" fill="#141210" opacity="0.5" />
          {/* Narrower objective end */}
          <circle cx="8" cy="-2" r="1" fill="#141210" opacity="0.4" />
          {/* Brass glint on spyglass body */}
          <line x1="-2" y1="-1.3" x2="3" y2="-1.7" stroke="#3a3020" strokeWidth="0.4" opacity="0.35">
            <animate attributeName="opacity" values="0.35;0.55;0.35" dur="5s" repeatCount="indefinite" />
          </line>
          {/* Lens reflection — tiny glint */}
          <circle cx="8" cy="-2" r="0.4" fill="#667788" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === FROST RIM ON COOKING POT — freezing condensation ring === */}
        <path d="M425,355.5 Q427,353 430,351 Q433,353 435,355.5" fill="none" stroke="#c0d8f0" strokeWidth="0.6" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.5;0.35" dur="7s" repeatCount="indefinite" />
        </path>
        {/* Frost crystals on pot rim */}
        <circle cx="427" cy="354" r="0.4" fill="#d0e8ff" opacity="0.25" />
        <circle cx="430" cy="352" r="0.3" fill="#d0e8ff" opacity="0.3" />
        <circle cx="433" cy="354" r="0.35" fill="#d0e8ff" opacity="0.25" />

        {/* === MORE GROUND EQUIPMENT — cartridge box, tin cup, powder horn === */}
        {/* Cartridge box — rectangular leather pouch near Soldier 1 */}
        <g transform="translate(275,370)" opacity="0.55">
          <rect x="0" y="0" width="7" height="5" rx="0.5" fill="#111116" />
          {/* Flap */}
          <path d="M0.5,0 L6.5,0 L6.5,2 Q3.5,3 0.5,2 Z" fill="#0e0e12" />
          {/* Strap */}
          <line x1="3.5" y1="0" x2="3.5" y2="-3" stroke="#1a1a1e" strokeWidth="0.5" />
        </g>
        {/* Tin cup — near the cooking pot */}
        <g transform="translate(442,360)" opacity="0.5">
          <path d="M0,0 L1,-5 L7,-5 L8,0 Z" fill="#141418" />
          {/* Handle */}
          <path d="M8,-4 Q11,-3 8,-1" fill="none" stroke="#1a1a20" strokeWidth="0.5" />
          {/* Metal glint */}
          <line x1="2" y1="-4" x2="3" y2="-1" stroke="#2a2a30" strokeWidth="0.3" opacity="0.4" />
        </g>
        {/* Powder horn — curved shape between soldiers */}
        <g transform="translate(455,370)" opacity="0.5">
          <path d="M0,0 Q3,-4 8,-3 Q10,-1 9,1 Q6,3 2,2 Z" fill="#111114" />
          {/* Cork plug */}
          <circle cx="0.5" cy="0.5" r="1" fill="#1a1510" />
          {/* Strap ring */}
          <circle cx="8" cy="-2" r="0.8" fill="none" stroke="#1a1a1e" strokeWidth="0.4" />
        </g>

        {/* === COOKING POT STEAM — thin vapor rising === */}
        <ellipse cx="430" cy="346" rx="3" ry="5" fill="url(#csSteam)">
          <animate attributeName="cy" values="346;338;330" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0" dur="3s" repeatCount="indefinite" />
          <animate attributeName="rx" values="3;4;5" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="432" cy="342" rx="2.5" ry="4" fill="url(#csSteam)">
          <animate attributeName="cy" values="342;332;322" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="rx" values="2.5;3.5;4.5" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="429" cy="340" rx="2" ry="3.5" fill="url(#csSteam)">
          <animate attributeName="cy" values="340;328;316" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.25;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="rx" values="2;3;4" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* === MUSKET TRIPODS === */}
        <g stroke="#111114" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <line x1="375" y1="370" x2="380" y2="272" />
          <line x1="383" y1="370" x2="380" y2="272" />
          <line x1="420" y1="370" x2="418" y2="272" />
          <line x1="426" y1="370" x2="420" y2="272" />
        </g>
        <line x1="380" y1="272" x2="381" y2="262" stroke="#22222a" strokeWidth="1" />
        <line x1="418" y1="272" x2="419" y2="262" stroke="#22222a" strokeWidth="1" />
        {/* Bayonet glint */}
        <circle cx="381" cy="263" r="0.8" fill="#cc8833" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="419" cy="263" r="0.8" fill="#cc8833" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2.3s" repeatCount="indefinite" />
        </circle>

        {/* === WIND PENNANT — cloth strip tied to musket tip, animated by wind === */}
        <g transform="translate(381,262)">
          {/* Small cloth strip fluttering on the right musket tripod bayonet */}
          <path d="M0,0 Q4,-1 8,-2 Q6,0 8,2 Q4,1 0,0 Z" fill="#1a1820" opacity="0.6">
            <animate
              attributeName="d"
              values="M0,0 Q4,-1 8,-2 Q6,0 8,2 Q4,1 0,0 Z;M0,0 Q5,-2 10,-1 Q8,1 10,3 Q5,2 0,0 Z;M0,0 Q4,0 9,-3 Q7,-1 9,1 Q5,0 0,0 Z;M0,0 Q4,-1 8,-2 Q6,0 8,2 Q4,1 0,0 Z"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
          {/* Pennant tip — slightly lighter edge */}
          <circle cx="8" cy="0" r="0.3" fill="#2a2830" opacity="0.3">
            <animate attributeName="cx" values="8;10;9;8" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="cy" values="0;1;-1;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === FROST CRYSTALS — tiny angular ice shapes on foreground rocks === */}
        {/* Crystal 1 — on left rock */}
        <g transform="translate(150,389)" opacity="0.35">
          <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#c0d8f0" strokeWidth="0.4" />
          <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#c0d8f0" strokeWidth="0.4" />
          <line x1="-1.8" y1="-1.8" x2="1.8" y2="1.8" stroke="#a8c8e0" strokeWidth="0.3" />
          <line x1="1.8" y1="-1.8" x2="-1.8" y2="1.8" stroke="#a8c8e0" strokeWidth="0.3" />
          <circle cx="0" cy="0" r="0.5" fill="#d0e8ff" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="5s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Crystal 2 — near center-left rock */}
        <g transform="translate(248,374)" opacity="0.3">
          <line x1="0" y1="-2" x2="0" y2="2" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-2" y1="0" x2="2" y2="0" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-1.4" y1="-1.4" x2="1.4" y2="1.4" stroke="#a8c8e0" strokeWidth="0.25" />
          <line x1="1.4" y1="-1.4" x2="-1.4" y2="1.4" stroke="#a8c8e0" strokeWidth="0.25" />
        </g>
        {/* Crystal 3 — on right rock */}
        <g transform="translate(650,387)" opacity="0.3">
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#c0d8f0" strokeWidth="0.4" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#c0d8f0" strokeWidth="0.4" />
          <line x1="-2" y1="-2" x2="2" y2="2" stroke="#a8c8e0" strokeWidth="0.3" />
          <line x1="2" y1="-2" x2="-2" y2="2" stroke="#a8c8e0" strokeWidth="0.3" />
          <circle cx="0" cy="0" r="0.6" fill="#d0e8ff" opacity="0.35">
            <animate attributeName="opacity" values="0.35;0.6;0.35" dur="6s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Crystal 4 — foreground edge */}
        <g transform="translate(560,370)" opacity="0.25">
          <line x1="0" y1="-2" x2="0" y2="2" stroke="#b0c8e0" strokeWidth="0.3" />
          <line x1="-2" y1="0" x2="2" y2="0" stroke="#b0c8e0" strokeWidth="0.3" />
          <line x1="-1.4" y1="-1.4" x2="1.4" y2="1.4" stroke="#98b0c8" strokeWidth="0.25" />
          <line x1="1.4" y1="-1.4" x2="-1.4" y2="1.4" stroke="#98b0c8" strokeWidth="0.25" />
        </g>
        {/* Crystal 5 — near knapsack */}
        <g transform="translate(272,366)" opacity="0.28">
          <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-1.8" y1="0" x2="1.8" y2="0" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-1.3" y1="-1.3" x2="1.3" y2="1.3" stroke="#a8c8e0" strokeWidth="0.25" />
          <line x1="1.3" y1="-1.3" x2="-1.3" y2="1.3" stroke="#a8c8e0" strokeWidth="0.25" />
        </g>

        {/* === FOREGROUND — dark ground edge === */}
        <path d="M0,385 Q100,375 200,382 Q300,388 400,378 Q500,372 600,380 Q700,388 800,376 L800,400 L0,400 Z" fill="#060a10" opacity="0.8" />
        {/* Frost on foreground stones */}
        <circle cx="150" cy="390" r="2" fill="#2a3040" opacity="0.2" />
        <circle cx="650" cy="388" r="2.5" fill="#2a3040" opacity="0.15" />

        {/* === WIND-BLOWN SNOW PARTICLES — small animated dots drifting across scene === */}
        {/* Layer 1 — foreground, faster, slightly larger */}
        <circle cx="100" cy="320" r="0.8" fill="url(#cs_snowParticle)">
          <animate attributeName="cx" values="100;180;260;340" dur="8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="320;316;322;318" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.5;0.4;0" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="340" r="0.6" fill="url(#cs_snowParticle)">
          <animate attributeName="cx" values="300;370;440;510" dur="9s" repeatCount="indefinite" />
          <animate attributeName="cy" values="340;335;342;338" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.4;0.35;0" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx="500" cy="310" r="0.7" fill="url(#cs_snowParticle)">
          <animate attributeName="cx" values="500;580;660;740" dur="7.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="310;306;312;308" dur="7.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.45;0.4;0" dur="7.5s" repeatCount="indefinite" />
        </circle>
        {/* Layer 2 — mid-ground, slower, smaller */}
        <circle cx="50" cy="280" r="0.5" fill="#c8d8f0" opacity="0.3">
          <animate attributeName="cx" values="50;140;230;320" dur="12s" repeatCount="indefinite" />
          <animate attributeName="cy" values="280;276;282;278" dur="12s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.3;0.25;0" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="290" r="0.4" fill="#c8d8f0" opacity="0.25">
          <animate attributeName="cx" values="250;330;410;490" dur="11s" repeatCount="indefinite" />
          <animate attributeName="cy" values="290;286;292;288" dur="11s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.25;0.2;0" dur="11s" repeatCount="indefinite" />
        </circle>
        <circle cx="450" cy="275" r="0.5" fill="#c8d8f0" opacity="0.3">
          <animate attributeName="cx" values="450;540;630;720" dur="10s" repeatCount="indefinite" />
          <animate attributeName="cy" values="275;271;277;273" dur="10s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.3;0.25;0" dur="10s" repeatCount="indefinite" />
        </circle>
        {/* Layer 3 — high, very faint, tiny */}
        <circle cx="150" cy="250" r="0.3" fill="#b0c0d8" opacity="0.2">
          <animate attributeName="cx" values="150;230;310;390" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cy" values="250;247;252;249" dur="14s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.15;0" dur="14s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="260" r="0.35" fill="#b0c0d8" opacity="0.2">
          <animate attributeName="cx" values="600;680;760;840" dur="13s" repeatCount="indefinite" />
          <animate attributeName="cy" values="260;256;262;258" dur="13s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.15;0" dur="13s" repeatCount="indefinite" />
        </circle>
        {/* Occasional larger flake drifting down */}
        <circle cx="680" cy="300" r="1.0" fill="#c8d8f0" opacity="0.15">
          <animate attributeName="cx" values="680;700;720;740" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="300;330;360;390" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.15;0" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="310" r="0.9" fill="#c8d8f0" opacity="0.12">
          <animate attributeName="cx" values="180;200;220;240" dur="7s" repeatCount="indefinite" />
          <animate attributeName="cy" values="310;340;370;400" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.15;0.12;0" dur="7s" repeatCount="indefinite" />
        </circle>

        {/* === SUPPLY CART — two-wheeled military cart with canvas cover === */}
        <g transform="translate(48,340)" opacity="0.7">
          {/* Cart bed */}
          <rect x="0" y="5" width="50" height="12" rx="1" fill="#0e0c08" />
          {/* Side planks — wood grain lines */}
          <line x1="2" y1="7" x2="48" y2="7" stroke="#1a1810" strokeWidth="0.3" opacity="0.4" />
          <line x1="2" y1="11" x2="48" y2="11" stroke="#1a1810" strokeWidth="0.3" opacity="0.35" />
          <line x1="2" y1="15" x2="48" y2="15" stroke="#1a1810" strokeWidth="0.3" opacity="0.3" />
          {/* Wheel — left */}
          <circle cx="10" cy="20" r="8" fill="none" stroke="#111114" strokeWidth="2" />
          <circle cx="10" cy="20" r="1.5" fill="#0e0e14" />
          {/* Spokes */}
          <line x1="10" y1="12" x2="10" y2="28" stroke="#111114" strokeWidth="0.8" />
          <line x1="2" y1="20" x2="18" y2="20" stroke="#111114" strokeWidth="0.8" />
          <line x1="4" y1="14" x2="16" y2="26" stroke="#111114" strokeWidth="0.7" />
          <line x1="16" y1="14" x2="4" y2="26" stroke="#111114" strokeWidth="0.7" />
          {/* Wheel — right */}
          <circle cx="40" cy="20" r="8" fill="none" stroke="#111114" strokeWidth="2" />
          <circle cx="40" cy="20" r="1.5" fill="#0e0e14" />
          <line x1="40" y1="12" x2="40" y2="28" stroke="#111114" strokeWidth="0.8" />
          <line x1="32" y1="20" x2="48" y2="20" stroke="#111114" strokeWidth="0.8" />
          <line x1="34" y1="14" x2="46" y2="26" stroke="#111114" strokeWidth="0.7" />
          <line x1="46" y1="14" x2="34" y2="26" stroke="#111114" strokeWidth="0.7" />
          {/* Canvas cover over cargo — arched tarp */}
          <path d="M-2,5 Q10,-8 25,-10 Q40,-8 52,5 Z" fill="url(#cs_cartCanvas)" />
          {/* Canvas texture ribs */}
          <path d="M8,1 Q16,-6 25,-7" fill="none" stroke="#222018" strokeWidth="0.3" opacity="0.35" />
          <path d="M42,1 Q34,-6 25,-7" fill="none" stroke="#222018" strokeWidth="0.3" opacity="0.35" />
          {/* Rope tie-down */}
          <line x1="5" y1="3" x2="5" y2="8" stroke="#1a1810" strokeWidth="0.4" opacity="0.35" />
          <line x1="45" y1="3" x2="45" y2="8" stroke="#1a1810" strokeWidth="0.4" opacity="0.35" />
          {/* Snow dusting on canvas top */}
          <ellipse cx="25" cy="-8" rx="12" ry="2" fill="#1a2438" opacity="0.25" />
          <ellipse cx="15" cy="-5" rx="5" ry="1" fill="#1c2640" opacity="0.2" />
          {/* Cart tongue / shaft — extending forward */}
          <line x1="-2" y1="10" x2="-18" y2="14" stroke="#0e0c08" strokeWidth="2" strokeLinecap="round" />
          {/* Mud on wheel rims */}
          <path d="M3,25 Q10,28 17,25" fill="none" stroke="#1a1508" strokeWidth="1" opacity="0.3" />
          <path d="M33,25 Q40,28 47,25" fill="none" stroke="#1a1508" strokeWidth="1" opacity="0.3" />
        </g>

        {/* === CART RUTS IN MUD — tracks from supply cart === */}
        <g opacity="0.12">
          <path d="M56,360 Q80,358 110,362 Q140,365 170,363" fill="none" stroke="#0a0e14" strokeWidth="2" />
          <path d="M86,365 Q110,363 140,367 Q170,370 200,368" fill="none" stroke="#0a0e14" strokeWidth="2" />
        </g>

        {/* === STACKED MUSKETS (FAISCEAUX D'ARMES) — tripod stack, left side === */}
        <g transform="translate(165,340)" opacity="0.65">
          {/* Three muskets leaning together in pyramid */}
          <line x1="0" y1="30" x2="6" y2="-10" stroke="#111114" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="30" x2="6" y2="-10" stroke="#111114" strokeWidth="2" strokeLinecap="round" />
          <line x1="6" y1="30" x2="6" y2="-12" stroke="#111114" strokeWidth="2" strokeLinecap="round" />
          {/* Bayonets at top */}
          <line x1="6" y1="-10" x2="5" y2="-18" stroke="#1a1a22" strokeWidth="1" strokeLinecap="round" />
          <line x1="6" y1="-10" x2="7" y2="-18" stroke="#1a1a22" strokeWidth="1" strokeLinecap="round" />
          <line x1="6" y1="-12" x2="6" y2="-20" stroke="#1a1a22" strokeWidth="1" strokeLinecap="round" />
          {/* Bayonet glints */}
          <circle cx="5" cy="-18" r="0.4" fill="#667788" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="7" cy="-18" r="0.4" fill="#667788" opacity="0.25" />
          <circle cx="6" cy="-20" r="0.4" fill="#667788" opacity="0.3" />
          {/* Sling / strap wrapping */}
          <ellipse cx="6" cy="-5" rx="3" ry="1.5" fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* === REGIMENTAL DRUM — near bivouac tarp === */}
        <g transform="translate(585,360)" opacity="0.6">
          {/* Drum body — cylinder lying on its side */}
          <ellipse cx="0" cy="0" rx="6" ry="8" fill="#0e0c10" />
          {/* Drum head — circular face visible */}
          <ellipse cx="-5" cy="0" rx="4" ry="8" fill="#141218" />
          {/* Rope tension V-pattern */}
          <g stroke="#1a1810" strokeWidth="0.4" opacity="0.35">
            <line x1="-3" y1="-7" x2="3" y2="-4" />
            <line x1="3" y1="-4" x2="-3" y2="-2" />
            <line x1="-3" y1="-2" x2="3" y2="1" />
            <line x1="3" y1="1" x2="-3" y2="3" />
            <line x1="-3" y1="3" x2="3" y2="5" />
            <line x1="3" y1="5" x2="-3" y2="7" />
          </g>
          {/* Drum hoop — top rim */}
          <ellipse cx="-5" cy="0" rx="4.5" ry="8.5" fill="none" stroke="#1a1820" strokeWidth="0.5" opacity="0.3" />
          {/* Drumsticks crossed on top */}
          <line x1="-8" y1="-5" x2="4" y2="3" stroke="#1a1508" strokeWidth="1" strokeLinecap="round" />
          <line x1="-6" y1="4" x2="5" y2="-4" stroke="#1a1508" strokeWidth="1" strokeLinecap="round" />
          {/* Tricolor paint band — blue-white-red, very faint on drum face */}
          <line x1="-8" y1="-1" x2="-8" y2="1" stroke="#1a2040" strokeWidth="1.2" opacity="0.25" />
          <line x1="-8" y1="-0.2" x2="-8" y2="0.2" stroke="#2a2a30" strokeWidth="1.2" opacity="0.2" />
          <line x1="-8" y1="0.8" x2="-8" y2="1.8" stroke="#301818" strokeWidth="1.2" opacity="0.2" />
        </g>

        {/* === FRENCH TRICOLOR PENNANT — small flag on a pole near supply cart === */}
        <g transform="translate(95,316)" opacity="0.55">
          {/* Flag pole */}
          <line x1="0" y1="40" x2="0" y2="0" stroke="#111114" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pennant — small fluttering tricolor */}
          <g>
            {/* Blue stripe */}
            <path d="M0,2 Q4,1 8,3 Q4,5 0,5 Z" fill="#1a2244" opacity="0.5">
              <animate
                attributeName="d"
                values="M0,2 Q4,1 8,3 Q4,5 0,5 Z;M0,2 Q5,0 10,2 Q5,4 0,5 Z;M0,2 Q4,1 8,3 Q4,5 0,5 Z"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            {/* White stripe */}
            <path d="M0,5 Q4,4 8,6 Q4,8 0,8 Z" fill="#2a2a30" opacity="0.45">
              <animate
                attributeName="d"
                values="M0,5 Q4,4 8,6 Q4,8 0,8 Z;M0,5 Q5,3 10,5 Q5,7 0,8 Z;M0,5 Q4,4 8,6 Q4,8 0,8 Z"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            {/* Red stripe */}
            <path d="M0,8 Q4,7 8,9 Q4,11 0,11 Z" fill="#2a1218" opacity="0.45">
              <animate
                attributeName="d"
                values="M0,8 Q4,7 8,9 Q4,11 0,11 Z;M0,8 Q5,6 10,8 Q5,10 0,11 Z;M0,8 Q4,7 8,9 Q4,11 0,11 Z"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          {/* Pole top finial — small ball */}
          <circle cx="0" cy="0" r="1.2" fill="#141418" />
        </g>

        {/* === HANGING LANTERN — suspended from bivouac tarp pole === */}
        <g transform="translate(635,328)">
          {/* Wire hanger from pole */}
          <path d="M0,-2 Q-2,-5 0,-8" fill="none" stroke="#1a1a22" strokeWidth="0.5" opacity="0.4" />
          {/* Lantern body — small rectangular glass */}
          <rect x="-3" y="-2" width="6" height="7" rx="0.5" fill="#0e0c08" opacity="0.5" />
          {/* Glass panels — faint warm glow */}
          <rect x="-2" y="-1" width="4" height="5" rx="0.3" fill="#553311" opacity="0.15" />
          {/* Flame inside */}
          <ellipse cx="0" cy="1" rx="1" ry="1.5" fill="#cc8833" opacity="0.4">
            <animate attributeName="ry" values="1.5;2;1.5" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.5;0.4" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Lantern top cap */}
          <rect x="-3.5" y="-3" width="7" height="1.5" rx="0.5" fill="#111114" opacity="0.5" />
          {/* Warm light pool on ground below lantern */}
          <ellipse cx="0" cy="20" rx="12" ry="4" fill="#8b4513" opacity="0.06">
            <animate attributeName="opacity" values="0.06;0.09;0.06" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Glow halo around lantern */}
          <circle cx="0" cy="1" r="8" fill="url(#cs_lanternGlow)" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.65;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === FROZEN STREAM / PUDDLE — flat ice patch in foreground === */}
        <g transform="translate(130,372)" opacity="0.4">
          {/* Ice surface — irregular frozen puddle shape */}
          <path d="M0,0 Q5,-3 15,-2 Q25,0 30,3 Q28,6 20,7 Q10,8 3,5 Z" fill="url(#cs_frozenStream)" />
          {/* Ice surface shimmer */}
          <path d="M5,0 Q12,-1 20,1" fill="none" stroke="#a0b8d0" strokeWidth="0.3" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="6s" repeatCount="indefinite" />
          </path>
          {/* Crack lines in ice */}
          <line x1="8" y1="1" x2="18" y2="3" stroke="#c0d8f0" strokeWidth="0.2" opacity="0.25" />
          <line x1="12" y1="-1" x2="14" y2="5" stroke="#b0c8e0" strokeWidth="0.2" opacity="0.2" />
          <line x1="22" y1="1" x2="26" y2="4" stroke="#c0d8f0" strokeWidth="0.2" opacity="0.2" />
          {/* Frozen edge rim — white frost border */}
          <path d="M0,0 Q5,-3 15,-2 Q25,0 30,3" fill="none" stroke="#c8d8e8" strokeWidth="0.4" opacity="0.15" />
        </g>

        {/* === SNOW DRIFTS — wind-sculpted snow mounds === */}
        {/* Drift against supply cart */}
        <ellipse cx="48" cy="368" rx="15" ry="3" fill="#141c28" opacity="0.2" />
        <ellipse cx="50" cy="369" rx="10" ry="2" fill="#1a2438" opacity="0.15" />
        {/* Drift against rock outcrop */}
        <ellipse cx="710" cy="345" rx="12" ry="3" fill="#141c28" opacity="0.18" />
        {/* Drift near bivouac tarp */}
        <ellipse cx="675" cy="355" rx="10" ry="2.5" fill="#1a2438" opacity="0.15" />
        {/* Small drifts in open ground */}
        <ellipse cx="480" cy="378" rx="8" ry="2" fill="#141c28" opacity="0.12" />
        <ellipse cx="340" cy="382" rx="6" ry="1.5" fill="#1a2438" opacity="0.1" />

        {/* === BLANKET ROLLS — near bivouac tarp and soldiers === */}
        {/* Roll 1 — near sleeping soldier */}
        <ellipse cx="565" cy="375" rx="8" ry="3" fill="#0e0e14" opacity="0.45" />
        <line x1="557" y1="375" x2="573" y2="375" stroke="#1a1a20" strokeWidth="0.4" opacity="0.3" />
        {/* Roll 2 — near bivouac entrance */}
        <ellipse cx="610" cy="362" rx="6" ry="2.5" fill="#111118" opacity="0.4" />
        {/* Roll 3 — tucked under cart */}
        <ellipse cx="65" cy="370" rx="7" ry="2.5" fill="#0e0e14" opacity="0.35" />

        {/* === HAY BALE — makeshift seating near fire === */}
        <g transform="translate(320,358)" opacity="0.5">
          <rect x="0" y="0" width="14" height="8" rx="1.5" fill="#111108" />
          {/* Hay texture — wispy lines */}
          <line x1="1" y1="2" x2="13" y2="2" stroke="#1a1810" strokeWidth="0.3" opacity="0.4" />
          <line x1="1" y1="4" x2="13" y2="4" stroke="#1a1810" strokeWidth="0.3" opacity="0.35" />
          <line x1="1" y1="6" x2="13" y2="6" stroke="#1a1810" strokeWidth="0.3" opacity="0.3" />
          {/* Binding twine */}
          <line x1="4" y1="0" x2="4" y2="8" stroke="#1a1508" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="0" x2="10" y2="8" stroke="#1a1508" strokeWidth="0.5" opacity="0.3" />
          {/* Snow on top */}
          <ellipse cx="7" cy="0" rx="5" ry="1" fill="#1a2438" opacity="0.2" />
        </g>

        {/* === SECOND FIRE PIT — smaller ember pile to the right, with soldier warming hands === */}
        <g transform="translate(660,360)" opacity="0.55">
          {/* Small log arrangement */}
          <line x1="-6" y1="5" x2="6" y2="2" stroke="#2a1a0a" strokeWidth="3" strokeLinecap="round" />
          <line x1="-4" y1="2" x2="5" y2="5" stroke="#2a1a0a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Embers — lower intensity than main fire */}
          <ellipse cx="0" cy="3" rx="5" ry="2" fill="#882200" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.55;0.4" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Small flame — barely alive */}
          <path d="M0,-2 Q-2,0 -3,3 Q-1,1 0,0 Q1,1 3,3 Q2,0 0,-2 Z" fill="#cc5500" opacity="0.5">
            <animate attributeName="opacity" values="0.5;0.7;0.5" dur="0.9s" repeatCount="indefinite" />
          </path>
          <path d="M0,0 Q-1,1 -1.5,3 Q-0.5,1.5 0,1 Q0.5,1.5 1.5,3 Q1,1 0,0 Z" fill="#ee9922" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.6;0.4" dur="0.7s" repeatCount="indefinite" />
          </path>
          {/* Warm glow on ground */}
          <ellipse cx="0" cy="4" rx="10" ry="3" fill="#8b4513" opacity="0.08">
            <animate attributeName="opacity" values="0.08;0.12;0.08" dur="1s" repeatCount="indefinite" />
          </ellipse>

          {/* Soldier warming hands — sitting hunched over embers */}
          <g transform="translate(-18,-20)" fill="#0c0c10">
            {/* Legs crossed */}
            <path d="M-2,20 Q4,16 8,20 L10,22 L-4,22 Z" />
            {/* Body — hunched forward */}
            <path d="M0,10 Q2,6 4,4 L10,4 Q8,6 6,10 Z" />
            {/* Coat bulk */}
            <rect x="-1" y="8" width="12" height="13" rx="2" />
            {/* Head — looking down at fire */}
            <ellipse cx="5" cy="2" rx="4" ry="4.5" />
            {/* Shako */}
            <rect x="2" y="-3" width="6" height="3.5" rx="0.5" fill="#0a0a0e" />
            {/* Arms extended toward fire — hands reaching out */}
            <path d="M8,10 Q14,12 20,10 L20,12 Q14,14 8,12 Z" />
            <path d="M2,11 Q8,14 16,12" fill="none" stroke="#0e0e14" strokeWidth="1.5" />
            {/* Hands — tiny shapes near fire */}
            <ellipse cx="20" cy="11" rx="2" ry="1.5" fill="#0e0c10" />
            {/* Breath visible */}
            <ellipse cx="12" cy="-1" rx="4" ry="2" fill="url(#cs_breathPlume)">
              <animate attributeName="rx" values="4;7;4" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* === THIRD SENTRY — distant figure pacing on right hillside === */}
        <g transform="translate(760,280)" fill="#080c16" opacity="0.4">
          {/* Walking pose — one leg forward */}
          <line x1="-1" y1="6" x2="-3" y2="14" stroke="#080c16" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="2" y1="6" x2="5" y2="14" stroke="#080c16" strokeWidth="1.2" strokeLinecap="round" />
          {/* Body */}
          <rect x="-2" y="-3" width="5" height="10" rx="1" />
          {/* Head */}
          <circle cx="1" cy="-5.5" r="2" />
          {/* Shako */}
          <rect x="-0.5" y="-8.5" width="3" height="2.5" rx="0.3" />
          {/* Musket across shoulder */}
          <line x1="-3" y1="0" x2="4" y2="-12" stroke="#080c16" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* === CAMPFIRE LIGHT REFLECTIONS — warm glow on nearby surfaces === */}
        {/* Firelight on bivouac tarp canvas */}
        <path d="M600,345 L635,330 L670,345 Z" fill="url(#cs_tentFirelight)" opacity="0.4" />
        {/* Firelight warm tint on nearest soldier faces (Soldier 2 & 3) */}
        <circle cx="357" cy="298" r="4" fill="#8b4513" opacity="0.05" />
        <circle cx="443" cy="296" r="4" fill="#8b4513" opacity="0.04" />
        {/* Warm reflection on cooking pot */}
        <ellipse cx="430" cy="354" rx="3" ry="1.5" fill="#aa5500" opacity="0.06" />
        {/* Firelight glow on hay bale */}
        <rect x="320" y="358" width="14" height="8" rx="1.5" fill="#8b4513" opacity="0.04" />
        {/* Warm glow cast on frozen puddle — fire reflected in ice */}
        <ellipse cx="145" cy="374" rx="8" ry="2" fill="#553311" opacity="0.03" />

        {/* === GROUND FOG LAYER — thin mist clinging to the frozen ground === */}
        <rect x="0" y="360" width="800" height="40" fill="url(#cs_groundFog)" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.65;0.5" dur="15s" repeatCount="indefinite" />
        </rect>
        {/* Fog wisps — small pockets of denser mist */}
        <ellipse cx="150" cy="378" rx="25" ry="4" fill="#1a2030" opacity="0.06">
          <animate attributeName="cx" values="150;165;150" dur="18s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="500" cy="375" rx="30" ry="5" fill="#1a2030" opacity="0.05">
          <animate attributeName="cx" values="500;485;500" dur="20s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="350" cy="380" rx="20" ry="3" fill="#1a2030" opacity="0.04">
          <animate attributeName="cx" values="350;362;350" dur="16s" repeatCount="indefinite" />
        </ellipse>

        {/* === ADDITIONAL BOOT PRINTS — more traffic near supply cart === */}
        <g opacity="0.1" fill="#0a1018">
          <ellipse cx="100" cy="365" rx="2" ry="1" />
          <ellipse cx="108" cy="363" rx="2" ry="1" />
          <ellipse cx="116" cy="364" rx="2" ry="1" />
          <ellipse cx="124" cy="362" rx="2" ry="1" />
          <ellipse cx="132" cy="363" rx="2" ry="1" />
          <ellipse cx="140" cy="365" rx="2" ry="1" />
        </g>

        {/* === MOUNTAIN WIND STREAKS — high atmosphere movement === */}
        <g opacity="0.03">
          <line x1="100" y1="110" x2="200" y2="108" stroke="#667788" strokeWidth="0.8" />
          <line x1="300" y1="95" x2="420" y2="92" stroke="#667788" strokeWidth="0.6" />
          <line x1="550" y1="105" x2="650" y2="102" stroke="#667788" strokeWidth="0.7" />
        </g>

        {/* === WATER CANTEEN — hung on musket stack === */}
        <g transform="translate(375,290)" opacity="0.4">
          {/* Canteen body — round flask */}
          <circle cx="0" cy="0" r="3.5" fill="#111114" />
          {/* Cork/stopper */}
          <circle cx="0" cy="-3.5" r="1" fill="#1a1508" />
          {/* Strap */}
          <line x1="-2" y1="-3" x2="-2" y2="-10" stroke="#1a1810" strokeWidth="0.5" opacity="0.3" />
          {/* Metal glint */}
          <circle cx="1" cy="-1" r="0.5" fill="#2a2a30" opacity="0.2" />
        </g>

        {/* ================================================================ */}
        {/* === NEW DETAIL PASS — TERRAIN & ENVIRONMENT ================= */}
        {/* ================================================================ */}

        {/* === STONE WALL REMNANT — old dry-stone wall used as windbreak, left side === */}
        <g transform="translate(20,355)" opacity="0.6">
          {/* Wall base — stacked stones, partially collapsed */}
          <path d="M0,12 L2,4 L8,3 L14,5 L20,2 L26,4 L32,3 L38,5 L42,4 L45,12 Z" fill="#0c1018" />
          {/* Individual stone outlines */}
          <path d="M2,4 L8,3 L8,7 L2,8 Z" fill="#0e1220" stroke="#141c28" strokeWidth="0.3" />
          <path d="M8,3 L14,5 L14,8 L8,7 Z" fill="#0b0f18" stroke="#141c28" strokeWidth="0.3" />
          <path d="M14,5 L20,2 L20,6 L14,8 Z" fill="#0d1120" stroke="#141c28" strokeWidth="0.3" />
          <path d="M20,2 L26,4 L26,7 L20,6 Z" fill="#0c1018" stroke="#141c28" strokeWidth="0.3" />
          <path d="M26,4 L32,3 L32,7 L26,7 Z" fill="#0e1220" stroke="#141c28" strokeWidth="0.3" />
          <path d="M32,3 L38,5 L38,8 L32,7 Z" fill="#0b0f18" stroke="#141c28" strokeWidth="0.3" />
          <path d="M38,5 L42,4 L42,8 L38,8 Z" fill="#0d1120" stroke="#141c28" strokeWidth="0.3" />
          {/* Second row — tumbled stones */}
          <path d="M5,8 L11,7 L11,11 L5,11 Z" fill="#0e1220" stroke="#141c28" strokeWidth="0.2" />
          <path d="M11,7 L18,8 L18,11 L11,11 Z" fill="#0c1018" stroke="#141c28" strokeWidth="0.2" />
          <path d="M18,8 L24,7 L24,11 L18,11 Z" fill="#0b0f18" stroke="#141c28" strokeWidth="0.2" />
          <path d="M24,7 L30,8 L30,11 L24,11 Z" fill="#0e1220" stroke="#141c28" strokeWidth="0.2" />
          <path d="M30,8 L36,7 L36,11 L30,11 Z" fill="#0d1120" stroke="#141c28" strokeWidth="0.2" />
          {/* Snow settled in cracks between stones */}
          <line x1="8" y1="3.5" x2="8" y2="7" stroke="#1a2438" strokeWidth="0.8" opacity="0.3" />
          <line x1="14" y1="5.5" x2="14" y2="8" stroke="#1a2438" strokeWidth="0.8" opacity="0.25" />
          <line x1="20" y1="2.5" x2="20" y2="6" stroke="#1a2438" strokeWidth="0.8" opacity="0.3" />
          <line x1="26" y1="4.5" x2="26" y2="7" stroke="#1a2438" strokeWidth="0.7" opacity="0.25" />
          <line x1="32" y1="3.5" x2="32" y2="7" stroke="#1a2438" strokeWidth="0.8" opacity="0.3" />
          {/* Snow cap on top of wall */}
          <path d="M2,3 Q10,1 22,1 Q34,2 42,3" fill="none" stroke="#1c2640" strokeWidth="1.5" opacity="0.3" />
          <ellipse cx="12" cy="2" rx="6" ry="1.2" fill="#1a2438" opacity="0.25" />
          <ellipse cx="30" cy="2.5" rx="5" ry="1" fill="#1a2438" opacity="0.2" />
          {/* Fallen stone on ground beside wall */}
          <ellipse cx="48" cy="10" rx="3.5" ry="2.5" fill="#0c1018" />
          <ellipse cx="-3" cy="10" rx="2.5" ry="2" fill="#0e1220" />
        </g>

        {/* === ADDITIONAL ROCKY OUTCROPS — scattered Alpine boulders === */}
        {/* Boulder cluster, center-left foreground */}
        <g transform="translate(290,375)" opacity="0.55">
          <path d="M0,8 Q-2,2 3,-2 Q8,-3 12,-1 Q15,2 14,8 Z" fill="#0b0f18" />
          <path d="M3,-2 Q8,-3 12,-1" fill="none" stroke="#1a2030" strokeWidth="0.4" opacity="0.25" />
          <line x1="4" y1="0" x2="8" y2="5" stroke="#141c28" strokeWidth="0.3" opacity="0.3" />
          {/* Snow on top */}
          <ellipse cx="7" cy="-2" rx="4" ry="1" fill="#1a2438" opacity="0.25" />
        </g>
        {/* Flat rock slab, right-center */}
        <g transform="translate(500,380)" opacity="0.45">
          <path d="M0,3 Q2,-1 10,-2 Q18,0 20,4 Q15,6 8,6 Q2,5 0,3 Z" fill="#0c1018" />
          <line x1="5" y1="0" x2="14" y2="2" stroke="#141c28" strokeWidth="0.3" opacity="0.25" />
          <ellipse cx="10" cy="-1" rx="6" ry="1" fill="#1a2438" opacity="0.2" />
        </g>
        {/* Small boulder near second fire pit */}
        <path d="M680,370 Q682,365 688,364 Q692,366 691,372 Q686,374 680,370 Z" fill="#0c1018" opacity="0.5" />
        <ellipse cx="685" cy="364" rx="3" ry="0.8" fill="#1a2438" opacity="0.2" />

        {/* === DEAD GRASS TUFTS — brown grass poking through snow === */}
        {/* Tuft 1 — near stone wall */}
        <g transform="translate(70,380)" opacity="0.35">
          <line x1="0" y1="0" x2="-2" y2="-6" stroke="#1a1808" strokeWidth="0.5" />
          <line x1="2" y1="0" x2="0" y2="-7" stroke="#1a1808" strokeWidth="0.5" />
          <line x1="4" y1="0" x2="3" y2="-5" stroke="#181608" strokeWidth="0.5" />
          <line x1="1" y1="0" x2="4" y2="-6" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="3" y1="0" x2="5" y2="-4" stroke="#181608" strokeWidth="0.4" />
        </g>
        {/* Tuft 2 — mid-ground near boot tracks */}
        <g transform="translate(270,376)" opacity="0.3">
          <line x1="0" y1="0" x2="-1" y2="-5" stroke="#1a1808" strokeWidth="0.5" />
          <line x1="2" y1="0" x2="1" y2="-6" stroke="#181608" strokeWidth="0.4" />
          <line x1="4" y1="0" x2="5" y2="-5" stroke="#1a1808" strokeWidth="0.5" />
          <line x1="3" y1="0" x2="2" y2="-4" stroke="#181608" strokeWidth="0.4" />
        </g>
        {/* Tuft 3 — right side near boulders */}
        <g transform="translate(700,378)" opacity="0.3">
          <line x1="0" y1="0" x2="-2" y2="-5" stroke="#181608" strokeWidth="0.5" />
          <line x1="2" y1="0" x2="0" y2="-6" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="4" y1="0" x2="6" y2="-5" stroke="#181608" strokeWidth="0.5" />
          <line x1="1" y1="0" x2="3" y2="-4" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="5" y1="0" x2="4" y2="-3" stroke="#181608" strokeWidth="0.4" />
        </g>
        {/* Tuft 4 — foreground edge */}
        <g transform="translate(400,388)" opacity="0.25">
          <line x1="0" y1="0" x2="-1" y2="-4" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="2" y1="0" x2="1" y2="-5" stroke="#181608" strokeWidth="0.4" />
          <line x1="4" y1="0" x2="3" y2="-4" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="6" y1="0" x2="7" y2="-3" stroke="#181608" strokeWidth="0.4" />
        </g>
        {/* Tuft 5 — near cart */}
        <g transform="translate(110,375)" opacity="0.28">
          <line x1="0" y1="0" x2="-1" y2="-5" stroke="#181608" strokeWidth="0.5" />
          <line x1="2" y1="0" x2="3" y2="-6" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="1" y1="0" x2="-1" y2="-4" stroke="#181608" strokeWidth="0.4" />
        </g>
        {/* Tuft 6 — near frozen puddle */}
        <g transform="translate(165,385)" opacity="0.25">
          <line x1="0" y1="0" x2="1" y2="-5" stroke="#1a1808" strokeWidth="0.5" />
          <line x1="3" y1="0" x2="2" y2="-4" stroke="#181608" strokeWidth="0.4" />
          <line x1="5" y1="0" x2="6" y2="-5" stroke="#1a1808" strokeWidth="0.4" />
        </g>

        {/* === FALLEN TREE — windbreak / natural barrier at mid-right === */}
        <g transform="translate(720,358)" opacity="0.55">
          {/* Main trunk — fallen pine */}
          <line x1="0" y1="5" x2="55" y2="0" stroke="#0c0a06" strokeWidth="4" strokeLinecap="round" />
          {/* Bark texture lines */}
          <line x1="5" y1="4" x2="8" y2="4.5" stroke="#181408" strokeWidth="0.3" opacity="0.3" />
          <line x1="15" y1="3" x2="18" y2="3.5" stroke="#181408" strokeWidth="0.3" opacity="0.25" />
          <line x1="25" y1="2.5" x2="28" y2="3" stroke="#181408" strokeWidth="0.3" opacity="0.3" />
          <line x1="35" y1="1.5" x2="38" y2="2" stroke="#181408" strokeWidth="0.3" opacity="0.25" />
          <line x1="45" y1="0.5" x2="48" y2="1" stroke="#181408" strokeWidth="0.3" opacity="0.3" />
          {/* Broken branches */}
          <line x1="10" y1="3.5" x2="8" y2="-2" stroke="#0e0c06" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="2.5" x2="18" y2="-3" stroke="#0e0c06" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="38" y1="1.5" x2="42" y2="-2" stroke="#0e0c06" strokeWidth="1" strokeLinecap="round" />
          {/* Root ball at base */}
          <path d="M-2,3 Q-5,0 -4,-3 Q-2,-5 0,-3 Q2,-4 3,-2 Q2,0 0,3 Z" fill="#0a0806" />
          {/* Snow on trunk */}
          <ellipse cx="15" cy="2" rx="8" ry="1" fill="#1a2438" opacity="0.2" />
          <ellipse cx="35" cy="0.5" rx="6" ry="0.8" fill="#1a2438" opacity="0.18" />
          <ellipse cx="50" cy="-0.5" rx="4" ry="0.7" fill="#1c2640" opacity="0.15" />
        </g>

        {/* === FROZEN PUDDLES — additional ice patches scattered across ground === */}
        {/* Puddle near campfire */}
        <g transform="translate(350,388)" opacity="0.3">
          <path d="M0,0 Q3,-2 8,-1 Q12,1 10,3 Q6,4 2,3 Z" fill="url(#cs_frozenStream)" />
          <line x1="3" y1="0" x2="7" y2="2" stroke="#c0d8f0" strokeWidth="0.15" opacity="0.2" />
        </g>
        {/* Puddle near supply cart */}
        <g transform="translate(80,382)" opacity="0.25">
          <path d="M0,0 Q2,-1 6,-1 Q9,0 8,2 Q5,3 1,2 Z" fill="url(#cs_frozenStream)" />
          <line x1="2" y1="0" x2="5" y2="1" stroke="#b0c8e0" strokeWidth="0.15" opacity="0.2" />
        </g>
        {/* Small ice patch in boot track area */}
        <ellipse cx="545" cy="362" rx="4" ry="1.5" fill="url(#cs_iceSheen)" opacity="0.2" />

        {/* === ADDITIONAL ROCKY TERRAIN — scattered stones on ground === */}
        {/* Small scattered stones near campfire ring */}
        <circle cx="380" cy="360" r="1.5" fill="#0c0e14" opacity="0.4" />
        <circle cx="422" cy="358" r="1.2" fill="#0b0e14" opacity="0.35" />
        <circle cx="410" cy="365" r="1.8" fill="#0c0e14" opacity="0.3" />
        <circle cx="390" cy="366" r="1.3" fill="#0b0e14" opacity="0.35" />
        {/* Fire ring stones — arranged around main campfire */}
        <ellipse cx="385" cy="356" rx="2" ry="1.2" fill="#0e1018" opacity="0.5" />
        <ellipse cx="390" cy="358" rx="1.8" ry="1" fill="#0c0e14" opacity="0.45" />
        <ellipse cx="410" cy="358" rx="1.8" ry="1" fill="#0e1018" opacity="0.45" />
        <ellipse cx="415" cy="356" rx="2" ry="1.2" fill="#0c0e14" opacity="0.5" />
        <ellipse cx="395" cy="360" rx="1.5" ry="0.8" fill="#0e1018" opacity="0.4" />
        <ellipse cx="405" cy="360" rx="1.5" ry="0.8" fill="#0c0e14" opacity="0.4" />

        {/* === MOUNTAIN VALLEY MIST — cold mist pooling in valleys between peaks === */}
        <ellipse cx="160" cy="195" rx="40" ry="6" fill="#1a2540" opacity="0.08">
          <animate attributeName="opacity" values="0.08;0.12;0.08" dur="16s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="360" cy="175" rx="35" ry="5" fill="#1a2540" opacity="0.06">
          <animate attributeName="cx" values="360;370;360" dur="20s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="530" cy="165" rx="30" ry="4" fill="#1a2540" opacity="0.07">
          <animate attributeName="opacity" values="0.07;0.1;0.07" dur="18s" repeatCount="indefinite" />
        </ellipse>

        {/* ================================================================ */}
        {/* === NEW DETAIL PASS 2 — CAMP INFRASTRUCTURE ================= */}
        {/* ================================================================ */}

        {/* === SECOND TENT — A-frame tent behind main group, center-left === */}
        <g transform="translate(260,320)" opacity="0.55">
          {/* Tent canvas — A-frame shape */}
          <path d="M0,20 L20,-5 L40,20 Z" fill="#0e0c08" />
          {/* Ridge line */}
          <line x1="20" y1="-5" x2="20" y2="22" stroke="#1a1508" strokeWidth="0.8" opacity="0.3" />
          {/* Canvas texture — folds */}
          <line x1="5" y1="15" x2="20" y2="-3" stroke="#181408" strokeWidth="0.3" opacity="0.3" />
          <line x1="35" y1="15" x2="20" y2="-3" stroke="#181408" strokeWidth="0.3" opacity="0.25" />
          <line x1="10" y1="10" x2="20" y2="-1" stroke="#161208" strokeWidth="0.2" opacity="0.2" />
          <line x1="30" y1="10" x2="20" y2="-1" stroke="#161208" strokeWidth="0.2" opacity="0.2" />
          {/* Opening / flap — dark interior visible */}
          <path d="M15,20 L20,8 L25,20 Z" fill="#060408" opacity="0.7" />
          {/* Guy ropes */}
          <line x1="0" y1="20" x2="-8" y2="24" stroke="#1a1810" strokeWidth="0.4" opacity="0.3" />
          <line x1="40" y1="20" x2="48" y2="24" stroke="#1a1810" strokeWidth="0.4" opacity="0.3" />
          {/* Rope pegs */}
          <line x1="-8" y1="24" x2="-6" y2="27" stroke="#2a2010" strokeWidth="0.6" />
          <line x1="48" y1="24" x2="46" y2="27" stroke="#2a2010" strokeWidth="0.6" />
          {/* Snow dusting on tent ridge */}
          <ellipse cx="20" cy="-4" rx="8" ry="1" fill="#1a2438" opacity="0.25" />
          {/* Frost on tent surface */}
          <ellipse cx="10" cy="8" rx="4" ry="2" fill="#141c28" opacity="0.08" />
          <ellipse cx="30" cy="8" rx="4" ry="2" fill="#141c28" opacity="0.06" />
          {/* Firelight reflection on canvas */}
          <path d="M25,20 L20,8 L40,20 Z" fill="#8b4513" opacity="0.03" />
        </g>

        {/* === THIRD TENT — officers' tent, slightly larger, far left behind wall === */}
        <g transform="translate(30,325)" opacity="0.45">
          {/* Larger A-frame with different proportions */}
          <path d="M0,22 L25,-8 L50,22 Z" fill="#100e0a" />
          {/* Ridge pole */}
          <line x1="25" y1="-8" x2="25" y2="24" stroke="#1a1508" strokeWidth="1" opacity="0.3" />
          {/* Canvas fold lines */}
          <line x1="8" y1="14" x2="25" y2="-6" stroke="#1a1608" strokeWidth="0.3" opacity="0.25" />
          <line x1="42" y1="14" x2="25" y2="-6" stroke="#1a1608" strokeWidth="0.3" opacity="0.2" />
          <line x1="15" y1="8" x2="25" y2="-4" stroke="#181408" strokeWidth="0.2" opacity="0.2" />
          <line x1="35" y1="8" x2="25" y2="-4" stroke="#181408" strokeWidth="0.2" opacity="0.2" />
          {/* Tent flap — closed */}
          <line x1="20" y1="22" x2="25" y2="10" stroke="#141008" strokeWidth="0.4" opacity="0.3" />
          <line x1="30" y1="22" x2="25" y2="10" stroke="#141008" strokeWidth="0.4" opacity="0.3" />
          {/* Guy ropes to stakes */}
          <line x1="0" y1="22" x2="-6" y2="26" stroke="#1a1810" strokeWidth="0.4" opacity="0.25" />
          <line x1="50" y1="22" x2="56" y2="26" stroke="#1a1810" strokeWidth="0.4" opacity="0.25" />
          {/* Snow on ridge */}
          <ellipse cx="25" cy="-7" rx="10" ry="1.2" fill="#1a2438" opacity="0.25" />
          <ellipse cx="15" cy="-3" rx="4" ry="0.8" fill="#1c2640" opacity="0.18" />
          {/* Faint light from inside — officer with candle */}
          <path d="M20,22 L25,10 L30,22 Z" fill="#553311" opacity="0.04">
            <animate attributeName="opacity" values="0.04;0.06;0.04" dur="3s" repeatCount="indefinite" />
          </path>
        </g>

        {/* === HORSE LINES — tethered mounts behind tents, mid-distance === */}
        <g transform="translate(340,278)" opacity="0.45">
          {/* Tether line between two posts */}
          <line x1="0" y1="0" x2="80" y2="-2" stroke="#1a1810" strokeWidth="0.6" opacity="0.4" />
          {/* Post left */}
          <line x1="0" y1="-5" x2="0" y2="8" stroke="#0e0c06" strokeWidth="1.5" strokeLinecap="round" />
          {/* Post right */}
          <line x1="80" y1="-7" x2="80" y2="6" stroke="#0e0c06" strokeWidth="1.5" strokeLinecap="round" />

          {/* Horse 1 — standing, head down */}
          <g transform="translate(15,-2)">
            {/* Body */}
            <ellipse cx="0" cy="0" rx="8" ry="5" fill="#080a10" />
            {/* Neck */}
            <path d="M-6,-3 Q-10,-8 -8,-13" fill="none" stroke="#080a10" strokeWidth="3" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx="-9" cy="-14" rx="3" ry="2.5" fill="#0a0c12" />
            {/* Muzzle */}
            <ellipse cx="-12" cy="-13" rx="1.5" ry="1.5" fill="#080a10" />
            {/* Ear */}
            <path d="M-8,-16 L-7,-18 L-6,-16" fill="#080a10" />
            {/* Legs */}
            <line x1="-4" y1="4" x2="-5" y2="12" stroke="#080a10" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-2" y1="4" x2="-2" y2="12" stroke="#080a10" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="4" x2="2" y2="12" stroke="#080a10" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="4" x2="6" y2="12" stroke="#080a10" strokeWidth="1.5" strokeLinecap="round" />
            {/* Tail */}
            <path d="M7,0 Q10,2 9,5" fill="none" stroke="#080a10" strokeWidth="1.2" strokeLinecap="round" />
            {/* Tether rope */}
            <path d="M-6,-12 Q-3,-10 0,0" fill="none" stroke="#1a1810" strokeWidth="0.4" opacity="0.3" />
            {/* Breath */}
            <ellipse cx="-15" cy="-14" rx="3" ry="1.5" fill="url(#csBreath)">
              <animate attributeName="rx" values="3;5;3" dur="4.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4.5s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* Horse 2 — standing, alert */}
          <g transform="translate(45,0)">
            {/* Body */}
            <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="#0a0c12" />
            {/* Neck — more upright */}
            <path d="M-5,-3 Q-6,-10 -4,-15" fill="none" stroke="#0a0c12" strokeWidth="2.8" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx="-4" cy="-16" rx="2.5" ry="2" fill="#080a10" />
            {/* Ear */}
            <path d="M-3,-18 L-2,-20 L-1,-18" fill="#080a10" />
            <path d="M-5,-18 L-6,-20 L-4.5,-18" fill="#080a10" />
            {/* Legs */}
            <line x1="-3" y1="4" x2="-4" y2="11" stroke="#0a0c12" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-1" y1="4" x2="-1" y2="11" stroke="#0a0c12" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="3" y1="4" x2="2" y2="11" stroke="#0a0c12" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="5" y1="4" x2="5.5" y2="11" stroke="#0a0c12" strokeWidth="1.4" strokeLinecap="round" />
            {/* Tail — swishing slightly */}
            <path d="M6,-1 Q9,1 8,4 Q7,6 5,7" fill="none" stroke="#0a0c12" strokeWidth="1" strokeLinecap="round">
              <animate attributeName="d" values="M6,-1 Q9,1 8,4 Q7,6 5,7;M6,-1 Q10,0 9,3 Q8,5 7,6;M6,-1 Q9,1 8,4 Q7,6 5,7" dur="4s" repeatCount="indefinite" />
            </path>
            {/* Blanket on back */}
            <ellipse cx="0" cy="-2" rx="5" ry="2.5" fill="#0c0e16" />
            {/* Breath */}
            <ellipse cx="-8" cy="-17" rx="2.5" ry="1.2" fill="url(#csBreath)">
              <animate attributeName="rx" values="2.5;4;2.5" dur="5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0.2;0.5" dur="5s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* Horse 3 — head resting, drowsing */}
          <g transform="translate(68,-1)">
            {/* Body */}
            <ellipse cx="0" cy="0" rx="7" ry="4" fill="#080a10" />
            {/* Neck — drooped */}
            <path d="M-5,-2 Q-8,-5 -10,-8" fill="none" stroke="#080a10" strokeWidth="2.5" strokeLinecap="round" />
            {/* Head — hanging low */}
            <ellipse cx="-11" cy="-9" rx="2.5" ry="2" fill="#0a0c12" />
            {/* Ears — relaxed */}
            <path d="M-10,-11 L-9.5,-12.5 L-9,-11" fill="#0a0c12" />
            {/* Legs */}
            <line x1="-3" y1="3.5" x2="-4" y2="10" stroke="#080a10" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="0" y1="3.5" x2="0" y2="10" stroke="#080a10" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="3" y1="3.5" x2="3" y2="10" stroke="#080a10" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="5" y1="3.5" x2="5.5" y2="10" stroke="#080a10" strokeWidth="1.3" strokeLinecap="round" />
            {/* Tail */}
            <path d="M6,0 Q8,1 7,4" fill="none" stroke="#080a10" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>

        {/* === SUPPLY CRATES — stacked wooden boxes near the main tent === */}
        <g transform="translate(195,352)" opacity="0.55">
          {/* Large crate */}
          <rect x="0" y="0" width="18" height="12" rx="0.5" fill="#0e0c08" />
          <line x1="0" y1="4" x2="18" y2="4" stroke="#1a1810" strokeWidth="0.3" opacity="0.3" />
          <line x1="0" y1="8" x2="18" y2="8" stroke="#1a1810" strokeWidth="0.3" opacity="0.25" />
          <line x1="9" y1="0" x2="9" y2="12" stroke="#141208" strokeWidth="0.5" opacity="0.25" />
          {/* Iron corner brackets */}
          <path d="M0.5,0.5 L3,0.5 M0.5,0.5 L0.5,3" fill="none" stroke="#141820" strokeWidth="0.5" opacity="0.3" />
          <path d="M17.5,0.5 L15,0.5 M17.5,0.5 L17.5,3" fill="none" stroke="#141820" strokeWidth="0.5" opacity="0.3" />
          {/* Stenciled text — barely visible */}
          <rect x="4" y="5" width="10" height="2" rx="0.2" fill="#141210" opacity="0.15" />
          {/* Snow on top */}
          <ellipse cx="9" cy="0" rx="7" ry="1" fill="#1a2438" opacity="0.2" />

          {/* Small crate stacked on top, offset */}
          <g transform="translate(3,-8)">
            <rect x="0" y="0" width="12" height="8" rx="0.5" fill="#100e0a" />
            <line x1="6" y1="0" x2="6" y2="8" stroke="#141208" strokeWidth="0.4" opacity="0.25" />
            <line x1="0" y1="3" x2="12" y2="3" stroke="#1a1810" strokeWidth="0.3" opacity="0.2" />
            {/* Snow */}
            <ellipse cx="6" cy="0" rx="5" ry="0.8" fill="#1a2438" opacity="0.2" />
          </g>

          {/* Third crate on the ground beside */}
          <g transform="translate(20,3)">
            <rect x="0" y="0" width="14" height="9" rx="0.5" fill="#0c0a06" />
            <line x1="7" y1="0" x2="7" y2="9" stroke="#141208" strokeWidth="0.4" opacity="0.2" />
            <line x1="0" y1="3" x2="14" y2="3" stroke="#1a1810" strokeWidth="0.3" opacity="0.2" />
            <line x1="0" y1="6" x2="14" y2="6" stroke="#1a1810" strokeWidth="0.3" opacity="0.18" />
          </g>
        </g>

        {/* === BARREL GROUP — water/wine barrels near supply area === */}
        <g transform="translate(190,370)" opacity="0.5">
          {/* Barrel 1 — lying on side */}
          <ellipse cx="0" cy="0" rx="5" ry="7" fill="#0e0c0a" />
          <ellipse cx="-4" cy="0" rx="3.5" ry="7" fill="#100e0c" />
          {/* Hoops */}
          <ellipse cx="-2" cy="0" rx="4" ry="7.2" fill="none" stroke="#141210" strokeWidth="0.4" opacity="0.3" />
          <ellipse cx="2" cy="0" rx="4.5" ry="7.2" fill="none" stroke="#141210" strokeWidth="0.4" opacity="0.25" />
          {/* Stave lines */}
          <line x1="-4" y1="-5" x2="3" y2="-5" stroke="#181610" strokeWidth="0.3" opacity="0.2" />
          <line x1="-4" y1="0" x2="3" y2="0" stroke="#181610" strokeWidth="0.3" opacity="0.2" />
          <line x1="-4" y1="5" x2="3" y2="5" stroke="#181610" strokeWidth="0.3" opacity="0.2" />

          {/* Barrel 2 — upright, beside first */}
          <g transform="translate(14,0)">
            <ellipse cx="0" cy="-6" rx="5" ry="2.5" fill="#0c0a08" />
            <rect x="-5" y="-6" width="10" height="10" rx="0.5" fill="#0e0c0a" />
            <ellipse cx="0" cy="4" rx="5" ry="2.5" fill="#0a0808" />
            <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#141210" strokeWidth="0.4" opacity="0.25" />
            <line x1="-5" y1="2" x2="5" y2="2" stroke="#141210" strokeWidth="0.4" opacity="0.25" />
            {/* Bung hole */}
            <circle cx="0" cy="-6" r="1" fill="#080606" opacity="0.5" />
            {/* Snow on top */}
            <ellipse cx="0" cy="-7" rx="4" ry="1.5" fill="#1a2438" opacity="0.2" />
          </g>
        </g>

        {/* === AMMUNITION WAGON — larger vehicle with canvas cover, behind main fire === */}
        <g transform="translate(440,305)" opacity="0.45">
          {/* Wagon bed — larger than supply cart */}
          <rect x="0" y="10" width="60" height="15" rx="1" fill="#0e0c08" />
          {/* Side planks */}
          <line x1="2" y1="12" x2="58" y2="12" stroke="#1a1810" strokeWidth="0.3" opacity="0.3" />
          <line x1="2" y1="17" x2="58" y2="17" stroke="#1a1810" strokeWidth="0.3" opacity="0.25" />
          <line x1="2" y1="22" x2="58" y2="22" stroke="#1a1810" strokeWidth="0.3" opacity="0.2" />
          {/* Vertical ribs */}
          <line x1="15" y1="10" x2="15" y2="25" stroke="#141008" strokeWidth="0.5" opacity="0.2" />
          <line x1="30" y1="10" x2="30" y2="25" stroke="#141008" strokeWidth="0.5" opacity="0.2" />
          <line x1="45" y1="10" x2="45" y2="25" stroke="#141008" strokeWidth="0.5" opacity="0.2" />

          {/* Canvas cover — arched, higher than cart */}
          <path d="M-3,10 Q8,-8 30,-12 Q52,-8 63,10 Z" fill="url(#cs_cartCanvas)" />
          {/* Canvas ribs — curved support hoops visible */}
          <path d="M10,5 Q18,-5 30,-8" fill="none" stroke="#222018" strokeWidth="0.4" opacity="0.3" />
          <path d="M50,5 Q42,-5 30,-8" fill="none" stroke="#222018" strokeWidth="0.4" opacity="0.3" />
          <path d="M5,8 Q15,-3 30,-6" fill="none" stroke="#1c1a10" strokeWidth="0.3" opacity="0.2" />
          <path d="M55,8 Q45,-3 30,-6" fill="none" stroke="#1c1a10" strokeWidth="0.3" opacity="0.2" />
          {/* Rope tie-downs */}
          <line x1="8" y1="6" x2="8" y2="12" stroke="#1a1810" strokeWidth="0.4" opacity="0.3" />
          <line x1="52" y1="6" x2="52" y2="12" stroke="#1a1810" strokeWidth="0.4" opacity="0.3" />
          <line x1="20" y1="2" x2="20" y2="12" stroke="#1a1810" strokeWidth="0.3" opacity="0.25" />
          <line x1="40" y1="2" x2="40" y2="12" stroke="#1a1810" strokeWidth="0.3" opacity="0.25" />

          {/* Wheels — larger spoked wheels */}
          {/* Left wheel */}
          <circle cx="12" cy="30" r="10" fill="none" stroke="#111114" strokeWidth="2.2" />
          <circle cx="12" cy="30" r="2" fill="#0e0e14" />
          <line x1="12" y1="20" x2="12" y2="40" stroke="#111114" strokeWidth="0.8" />
          <line x1="2" y1="30" x2="22" y2="30" stroke="#111114" strokeWidth="0.8" />
          <line x1="5" y1="23" x2="19" y2="37" stroke="#111114" strokeWidth="0.7" />
          <line x1="19" y1="23" x2="5" y2="37" stroke="#111114" strokeWidth="0.7" />
          {/* Right wheel */}
          <circle cx="48" cy="30" r="10" fill="none" stroke="#111114" strokeWidth="2.2" />
          <circle cx="48" cy="30" r="2" fill="#0e0e14" />
          <line x1="48" y1="20" x2="48" y2="40" stroke="#111114" strokeWidth="0.8" />
          <line x1="38" y1="30" x2="58" y2="30" stroke="#111114" strokeWidth="0.8" />
          <line x1="41" y1="23" x2="55" y2="37" stroke="#111114" strokeWidth="0.7" />
          <line x1="55" y1="23" x2="41" y2="37" stroke="#111114" strokeWidth="0.7" />

          {/* Snow on canvas */}
          <ellipse cx="30" cy="-10" rx="15" ry="2.5" fill="#1a2438" opacity="0.22" />
          <ellipse cx="18" cy="-5" rx="6" ry="1.2" fill="#1c2640" opacity="0.18" />
          <ellipse cx="42" cy="-5" rx="5" ry="1" fill="#1a2438" opacity="0.15" />

          {/* Mud on wheels */}
          <path d="M5,37 Q12,40 19,37" fill="none" stroke="#1a1508" strokeWidth="1" opacity="0.25" />
          <path d="M41,37 Q48,40 55,37" fill="none" stroke="#1a1508" strokeWidth="1" opacity="0.25" />

          {/* Shadow underneath */}
          <ellipse cx="30" cy="38" rx="28" ry="3" fill="#040608" opacity="0.3" />
        </g>

        {/* === THIRD CAMPFIRE GROUP — smaller fire to the left with soldiers === */}
        <g transform="translate(150,330)" opacity="0.5">
          {/* Small fire pit */}
          <line x1="-4" y1="8" x2="4" y2="5" stroke="#2a1a0a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-2" y1="5" x2="3" y2="8" stroke="#2a1a0a" strokeWidth="2" strokeLinecap="round" />
          {/* Embers */}
          <ellipse cx="0" cy="6" rx="4" ry="1.5" fill="#882200" opacity="0.35">
            <animate attributeName="opacity" values="0.35;0.5;0.35" dur="1.3s" repeatCount="indefinite" />
          </ellipse>
          {/* Small flames */}
          <path d="M0,0 Q-1.5,2 -2,6 Q-0.5,3 0,2 Q0.5,3 2,6 Q1.5,2 0,0 Z" fill="#cc5500" opacity="0.45">
            <animate attributeName="opacity" values="0.45;0.65;0.45" dur="0.8s" repeatCount="indefinite" />
          </path>
          <path d="M0,2 Q-0.8,3 -1,6 Q-0.3,4 0,3 Q0.3,4 1,6 Q0.8,3 0,2 Z" fill="#ee9922" opacity="0.35">
            <animate attributeName="opacity" values="0.35;0.55;0.35" dur="0.6s" repeatCount="indefinite" />
          </path>
          {/* Ground glow */}
          <ellipse cx="0" cy="7" rx="8" ry="3" fill="#8b4513" opacity="0.06">
            <animate attributeName="opacity" values="0.06;0.1;0.06" dur="1s" repeatCount="indefinite" />
          </ellipse>
          {/* Sparks */}
          <circle cx="1" cy="-2" r="0.6" fill="#ffaa22" opacity="0.5">
            <animate attributeName="cy" values="0;-15;-30" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.3;0" dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Soldier A — cleaning musket by firelight */}
          <g transform="translate(-20,-10)" fill="#0c0c10">
            {/* Seated body */}
            <path d="M-2,18 Q4,14 8,18 L10,20 L-4,20 Z" />
            <rect x="-1" y="6" width="10" height="13" rx="2" />
            {/* Head */}
            <ellipse cx="4" cy="3" rx="3.5" ry="4" />
            {/* Shako */}
            <rect x="1.5" y="-2" width="5" height="3" rx="0.5" fill="#0a0a0e" />
            {/* Arms — holding musket horizontally across lap */}
            <path d="M1,12 Q-4,14 -8,13 L-8,14.5 Q-4,15.5 1,13.5 Z" />
            <path d="M8,12 Q12,14 16,13 L16,14.5 Q12,15.5 8,13.5 Z" />
            {/* Musket across lap */}
            <line x1="-10" y1="13.5" x2="18" y2="12" stroke="#111114" strokeWidth="1.8" strokeLinecap="round" />
            {/* Cleaning rod — thin line alongside */}
            <line x1="-8" y1="15" x2="15" y2="14" stroke="#1a1a22" strokeWidth="0.6" strokeLinecap="round" />
            {/* Breath */}
            <ellipse cx="10" cy="1" rx="3" ry="1.5" fill="url(#csBreath)">
              <animate attributeName="rx" values="3;5;3" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="4s" repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* Soldier B — writing letter by firelight */}
          <g transform="translate(15,-8)" fill="#0c0c10">
            {/* Seated body — leaning forward */}
            <path d="M-2,18 Q3,14 7,18 L9,20 L-4,20 Z" />
            <rect x="-1" y="6" width="9" height="13" rx="2" />
            {/* Head — looking down */}
            <ellipse cx="4" cy="4" rx="3.5" ry="3.5" />
            {/* Shako — off, beside him */}
            <rect x="12" y="16" width="4" height="3" rx="0.5" fill="#0c0c0e" opacity="0.4" />
            {/* Hair */}
            <path d="M1,2 Q3,0 5,0 Q7,1 7,3 Q5,1 3,1 Z" fill="#0a0a0c" />
            {/* Arms — one holding paper, one holding quill */}
            <path d="M1,10 Q-3,12 -5,14 L-5,15.5 Q-3,13.5 1,11.5 Z" />
            <path d="M7,10 Q10,11 11,13" fill="none" stroke="#0c0c10" strokeWidth="1.5" />
            {/* Paper sheet — tiny rectangle */}
            <rect x="-6" y="12" width="6" height="4" rx="0.3" fill="#1a1a22" opacity="0.35" />
            {/* Quill — thin diagonal line from hand */}
            <line x1="11" y1="12" x2="13" y2="8" stroke="#1a1810" strokeWidth="0.4" opacity="0.35" />
            {/* Breath */}
            <ellipse cx="9" cy="2" rx="2.5" ry="1.2" fill="url(#csBreath)">
              <animate attributeName="rx" values="2.5;4.5;2.5" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3.5s" repeatCount="indefinite" />
            </ellipse>
          </g>
        </g>

        {/* === NCO DISTRIBUTING RATIONS — standing figure near supply crates === */}
        <g transform="translate(218,330)" fill="#0c0c10" opacity="0.5">
          {/* Standing pose */}
          {/* Legs */}
          <line x1="-2" y1="20" x2="-3" y2="32" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="20" x2="4" y2="32" stroke="#0c0c10" strokeWidth="2" strokeLinecap="round" />
          {/* Body */}
          <rect x="-4" y="8" width="9" height="13" rx="1.5" />
          {/* Head */}
          <ellipse cx="0.5" cy="5" rx="4" ry="4.5" />
          {/* Shako with plume — NCO distinction */}
          <rect x="-2" y="0" width="5" height="3.5" rx="0.5" fill="#0a0a0e" />
          <line x1="-2" y1="0" x2="3" y2="0" stroke="#0c0c10" strokeWidth="0.6" />
          {/* Plume */}
          <path d="M3,0 Q5,-2 4,-4" fill="none" stroke="#1a1018" strokeWidth="0.8" />
          {/* Arms — one holding sack, one extended giving */}
          <path d="M-4,12 Q-8,14 -10,16 L-10,18 Q-8,16 -4,14 Z" />
          <path d="M5,12 Q8,14 10,16 L10,18 Q8,16 5,14 Z" />
          {/* Ration sack in hand */}
          <ellipse cx="-11" cy="17" rx="3" ry="2.5" fill="#111108" opacity="0.5" />
          {/* Breath */}
          <ellipse cx="7" cy="3" rx="3" ry="1.5" fill="url(#cs_breathPlume)">
            <animate attributeName="rx" values="3;5;3" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3.8s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === CARD PLAYERS — two soldiers playing cards near second fire === */}
        <g transform="translate(640,340)" opacity="0.45">
          {/* Player 1 — sitting left */}
          <g fill="#0c0c10">
            <path d="M-12,18 Q-6,14 0,18 L2,20 L-14,20 Z" />
            <rect x="-11" y="6" width="9" height="13" rx="2" />
            <ellipse cx="-6" cy="3" rx="3.5" ry="4" />
            <rect x="-8.5" y="-2" width="5" height="3" rx="0.5" fill="#0a0a0e" />
            {/* Hand with cards */}
            <path d="M-5,12 Q-2,14 0,13" fill="none" stroke="#0c0c10" strokeWidth="1.5" />
            {/* Cards in hand — fanned */}
            <rect x="-2" y="11" width="3" height="4" rx="0.2" fill="#1a1a22" opacity="0.35" transform="rotate(-10 -0.5 13)" />
            <rect x="-1" y="11" width="3" height="4" rx="0.2" fill="#1c1c24" opacity="0.3" transform="rotate(5 0.5 13)" />
          </g>
          {/* Player 2 — sitting right */}
          <g fill="#0c0c10">
            <path d="M8,18 Q14,14 20,18 L22,20 L6,20 Z" />
            <rect x="9" y="6" width="9" height="13" rx="2" />
            <ellipse cx="14" cy="3" rx="3.5" ry="4" />
            <rect x="11.5" y="-2" width="5" height="3" rx="0.5" fill="#0a0a0e" />
            {/* Hand */}
            <path d="M12,12 Q10,14 8,13" fill="none" stroke="#0c0c10" strokeWidth="1.5" />
            {/* Cards */}
            <rect x="6" y="11" width="3" height="4" rx="0.2" fill="#1a1a22" opacity="0.3" transform="rotate(10 7.5 13)" />
          </g>
          {/* Cards on ground between them — makeshift game */}
          <rect x="1" y="17" width="3" height="4" rx="0.2" fill="#1a1a22" opacity="0.25" />
          <rect x="4" y="16.5" width="3" height="4" rx="0.2" fill="#1c1c24" opacity="0.2" transform="rotate(-8 5.5 18.5)" />
          <rect x="2.5" y="15.5" width="3" height="4" rx="0.2" fill="#181820" opacity="0.2" transform="rotate(15 4 17.5)" />
        </g>

        {/* ================================================================ */}
        {/* === NEW DETAIL PASS 3 — SOLDIER ACTIVITIES & ATMOSPHERE ===== */}
        {/* ================================================================ */}

        {/* === SLEEPING SOLDIERS — blanket rolls near tents === */}
        {/* Sleeping soldier near second tent */}
        <g transform="translate(300,342)" opacity="0.5">
          {/* Blanket-wrapped body */}
          <path d="M0,0 Q4,-8 16,-10 Q26,-8 32,-3 Q34,2 32,6 Q24,9 14,9 Q4,7 0,3 Z" fill="#0c0c10" />
          {/* Blanket folds */}
          <path d="M4,-5 Q12,-8 20,-8 Q28,-6 30,-2" fill="none" stroke="#161620" strokeWidth="0.4" opacity="0.5" />
          <path d="M2,0 Q10,-5 18,-6 Q24,-4 30,0" fill="none" stroke="#141418" strokeWidth="0.3" opacity="0.4" />
          {/* Head poking out */}
          <ellipse cx="-2" cy="0" rx="4" ry="4.5" fill="#0e0e10" />
          {/* Hair */}
          <path d="M-5,-2 Q-3,-5 0,-5 Q2,-4 2,-2 Q0,-3 -2,-3 Z" fill="#0a0a0c" />
          {/* Feet under blanket */}
          <rect x="30" y="1" width="5" height="2.5" rx="0.8" fill="#0a0a0c" />
          {/* Breath — slow, sleeping */}
          <ellipse cx="-7" cy="-1" rx="3" ry="1.5" fill="url(#csBreath)">
            <animate attributeName="rx" values="3;5;3" dur="6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="6s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Sleeping soldier near officers' tent */}
        <g transform="translate(75,348)" opacity="0.4">
          {/* Curled up in greatcoat */}
          <path d="M0,0 Q3,-6 12,-8 Q20,-6 24,-2 Q25,2 22,5 Q15,7 8,7 Q2,5 0,2 Z" fill="#0c0c10" />
          {/* Coat texture */}
          <path d="M3,-4 Q10,-7 18,-5" fill="none" stroke="#161620" strokeWidth="0.3" opacity="0.4" />
          {/* Head */}
          <ellipse cx="-1" cy="1" rx="3.5" ry="3.5" fill="#0e0e10" />
          {/* Greatcoat collar turned up */}
          <path d="M1,-1 Q3,-2 4,0" fill="none" stroke="#14141c" strokeWidth="1" opacity="0.4" />
          {/* Faint breath */}
          <ellipse cx="-5" cy="0" rx="2" ry="1" fill="url(#csBreath)">
            <animate attributeName="rx" values="2;3.5;2" dur="5.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="5.5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === SOLDIER CHECKING EQUIPMENT — standing figure near supply crates === */}
        <g transform="translate(235,332)" fill="#0c0c10" opacity="0.45">
          {/* Legs — standing */}
          <line x1="-1" y1="20" x2="-2" y2="30" stroke="#0c0c10" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="3" y1="20" x2="5" y2="30" stroke="#0c0c10" strokeWidth="1.8" strokeLinecap="round" />
          {/* Body — bent slightly, examining something */}
          <rect x="-3" y="8" width="8" height="13" rx="1.5" />
          {/* Head — looking down */}
          <ellipse cx="1" cy="5.5" rx="3.5" ry="4" />
          {/* Shako */}
          <rect x="-1.5" y="1" width="5" height="3" rx="0.5" fill="#0a0a0e" />
          {/* Arms — holding cartridge pouch, examining */}
          <path d="M-3,12 Q-6,15 -8,17 L-7,18.5 Q-5,16.5 -3,13.5 Z" />
          <path d="M5,12 Q7,14 9,15 L9,16.5 Q7,15.5 5,13.5 Z" />
          {/* Cartridge box in hands */}
          <rect x="-9" y="16" width="5" height="3.5" rx="0.3" fill="#111116" opacity="0.4" />
          {/* Flap open */}
          <path d="M-8.5,16 L-4.5,16 L-4.5,14.5 Q-6.5,14 -8.5,14.5 Z" fill="#0e0e12" opacity="0.3" />
          {/* Breath */}
          <ellipse cx="7" cy="4" rx="2.5" ry="1.2" fill="url(#csBreath)">
            <animate attributeName="rx" values="2.5;4;2.5" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === ADDITIONAL STACKED MUSKETS — faisceaux near third campfire === */}
        <g transform="translate(125,330)" opacity="0.5" stroke="#111114" strokeWidth="1.8" strokeLinecap="round" fill="none">
          <line x1="0" y1="22" x2="4" y2="-5" />
          <line x1="8" y1="22" x2="4" y2="-5" />
          <line x1="4" y1="22" x2="4" y2="-7" />
          {/* Bayonets */}
          <line x1="4" y1="-5" x2="3" y2="-12" stroke="#1a1a22" strokeWidth="0.8" />
          <line x1="4" y1="-5" x2="5" y2="-12" stroke="#1a1a22" strokeWidth="0.8" />
          <line x1="4" y1="-7" x2="4" y2="-14" stroke="#1a1a22" strokeWidth="0.8" />
          {/* Bayonet glints */}
          <circle cx="3" cy="-12" r="0.35" fill="#667788" opacity="0.25" />
          <circle cx="5" cy="-12" r="0.35" fill="#667788" opacity="0.2" />
          <circle cx="4" cy="-14" r="0.35" fill="#667788" opacity="0.25">
            <animate attributeName="opacity" values="0.25;0.45;0.25" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === COOKING SETUP NEAR THIRD FIRE — pot on tripod === */}
        <g transform="translate(155,322)" opacity="0.45">
          {/* Tripod legs — three sticks */}
          <line x1="-6" y1="18" x2="0" y2="0" stroke="#0e0c06" strokeWidth="1" strokeLinecap="round" />
          <line x1="6" y1="18" x2="0" y2="0" stroke="#0e0c06" strokeWidth="1" strokeLinecap="round" />
          <line x1="0" y1="18" x2="0" y2="2" stroke="#0e0c06" strokeWidth="1" strokeLinecap="round" />
          {/* Hook chain */}
          <line x1="0" y1="2" x2="0" y2="8" stroke="#141820" strokeWidth="0.4" opacity="0.4" />
          {/* Pot hanging */}
          <path d="M-3,8 Q-4,12 0,14 Q4,12 3,8 Z" fill="#0c0c0e" opacity="0.6" />
          {/* Pot handle / bail */}
          <path d="M-2,8 Q0,6 2,8" fill="none" stroke="#141820" strokeWidth="0.4" opacity="0.35" />
          {/* Steam rising */}
          <ellipse cx="0" cy="4" rx="2" ry="3" fill="url(#csSteam)">
            <animate attributeName="cy" values="6;0;-6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.3;0" dur="3s" repeatCount="indefinite" />
            <animate attributeName="rx" values="2;3;4" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1" cy="2" rx="1.5" ry="2.5" fill="url(#csSteam)">
            <animate attributeName="cy" values="4;-2;-8" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="rx" values="1.5;2.5;3.5" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === LANTERN ON GROUND — near letter-writing soldier === */}
        <g transform="translate(170,335)" opacity="0.4">
          {/* Lantern body */}
          <rect x="-2" y="-1" width="4" height="5" rx="0.3" fill="#0e0c08" />
          {/* Glass panel glow */}
          <rect x="-1.5" y="0" width="3" height="3.5" rx="0.2" fill="#553311" opacity="0.12" />
          {/* Flame inside */}
          <ellipse cx="0" cy="1.5" rx="0.6" ry="1" fill="#cc8833" opacity="0.3">
            <animate attributeName="ry" values="1;1.3;1" dur="1.2s" repeatCount="indefinite" />
          </ellipse>
          {/* Top cap */}
          <rect x="-2.5" y="-2" width="5" height="1.2" rx="0.3" fill="#111114" opacity="0.4" />
          {/* Handle */}
          <path d="M-1.5,-2 Q0,-4 1.5,-2" fill="none" stroke="#1a1a22" strokeWidth="0.3" opacity="0.3" />
          {/* Light pool */}
          <ellipse cx="0" cy="6" rx="6" ry="2" fill="#8b4513" opacity="0.04">
            <animate attributeName="opacity" values="0.04;0.06;0.04" dur="1.5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* === ADDITIONAL STAR CLUSTERS — filling in sparser regions of sky === */}
        {/* Southern sky stars — between mountains and main sky */}
        <circle cx="60" cy="90" r="0.5" fill="#c0b8a8" opacity="0.25" />
        <circle cx="120" cy="75" r="0.6" fill="#d0c8b8" opacity="0.3" />
        <circle cx="190" cy="70" r="0.45" fill="#c0b8a8" opacity="0.22" />
        <circle cx="340" cy="65" r="0.5" fill="#c0b8a8" opacity="0.28" />
        <circle cx="390" cy="58" r="0.55" fill="#d0c8b8" opacity="0.25" />
        <circle cx="490" cy="62" r="0.4" fill="#c0b8a8" opacity="0.2" />
        <circle cx="565" cy="48" r="0.5" fill="#d0c8b8" opacity="0.3" />
        <circle cx="615" cy="42" r="0.45" fill="#c0b8a8" opacity="0.22" />
        <circle cx="670" cy="52" r="0.5" fill="#d0c8b8" opacity="0.25" />
        <circle cx="740" cy="35" r="0.4" fill="#c0b8a8" opacity="0.2" />
        {/* Very faint nebula hint near Orion */}
        <ellipse cx="285" cy="55" rx="12" ry="8" fill="#3a2838" opacity="0.02" />
        {/* Additional twinkling star */}
        <circle cx="680" cy="22" r="0.9" fill="#e0d8c8" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.35;0.6" dur="4.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="55" r="0.8" fill="#d0c8b8" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3.8s" repeatCount="indefinite" />
        </circle>

        {/* === ADDITIONAL CONSTELLATION — Taurus near Orion (January sky) === */}
        <g opacity="0.08" stroke="#8899bb" strokeWidth="0.35" fill="none">
          {/* V-shape of Hyades */}
          <line x1="120" y1="75" x2="145" y2="38" />
          <line x1="120" y1="75" x2="95" y2="45" />
          {/* Extended horn lines */}
          <line x1="145" y1="38" x2="175" y2="58" />
          <line x1="95" y1="45" x2="75" y2="65" />
        </g>
        {/* Aldebaran — bright star in Taurus */}
        <circle cx="120" cy="75" r="1.2" fill="#e8d8c0" opacity="0.45">
          <animate attributeName="opacity" values="0.45;0.6;0.45" dur="4.2s" repeatCount="indefinite" />
        </circle>

        {/* === SNOW ON DISTANT NEAR HILLS — additional snow coverage === */}
        <ellipse cx="260" cy="240" rx="15" ry="2" fill="#1a2438" opacity="0.12" />
        <ellipse cx="450" cy="240" rx="12" ry="1.8" fill="#1a2438" opacity="0.1" />
        <ellipse cx="550" cy="237" rx="10" ry="1.5" fill="#1c2640" opacity="0.1" />
        <ellipse cx="650" cy="232" rx="14" ry="2" fill="#1a2438" opacity="0.12" />

        {/* === MORE SMOKE WISPS — from third campfire and ammunition wagon area === */}
        <ellipse cx="150" cy="300" rx="8" ry="15" fill="url(#csSmoke)">
          <animate attributeName="cx" values="150;144;150" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="153" cy="280" rx="6" ry="12" fill="url(#csSmoke)">
          <animate attributeName="cx" values="153;148;153" dur="10s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="10s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="148" cy="260" rx="5" ry="10" fill="#444" fillOpacity="0.015">
          <animate attributeName="cx" values="148;142;148" dur="12s" repeatCount="indefinite" />
        </ellipse>

        {/* === SECOND FIRE PIT SMOKE — thinner wisps from embers === */}
        <ellipse cx="660" cy="340" rx="4" ry="8" fill="url(#csSmoke)">
          <animate attributeName="cx" values="660;665;660" dur="7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="7s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="662" cy="325" rx="3" ry="6" fill="url(#csSmoke)">
          <animate attributeName="cx" values="662;668;662" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="9s" repeatCount="indefinite" />
        </ellipse>

        {/* === ADDITIONAL BOOT TRACKS — more traffic patterns === */}
        {/* Trail from horse lines toward campfire */}
        <g opacity="0.12" fill="#0a1018">
          <ellipse cx="360" cy="350" rx="2" ry="1" />
          <ellipse cx="368" cy="352" rx="2" ry="1" />
          <ellipse cx="376" cy="351" rx="2" ry="1" />
          <ellipse cx="384" cy="353" rx="2" ry="1" />
          <ellipse cx="392" cy="352" rx="2" ry="1" />
        </g>
        {/* Trail from supply crates to tents */}
        <g opacity="0.1" fill="#0a1018">
          <ellipse cx="210" cy="360" rx="2" ry="1" />
          <ellipse cx="218" cy="358" rx="2" ry="1" />
          <ellipse cx="226" cy="359" rx="2" ry="1" />
          <ellipse cx="234" cy="357" rx="2" ry="1" />
          <ellipse cx="242" cy="358" rx="2" ry="1" />
          <ellipse cx="250" cy="360" rx="2" ry="1" />
          <ellipse cx="258" cy="359" rx="2" ry="1" />
          <ellipse cx="266" cy="361" rx="2" ry="1" />
        </g>
        {/* Scattered footprints near horse lines */}
        <g opacity="0.08" fill="#0a1018">
          <ellipse cx="350" cy="300" rx="1.8" ry="0.9" />
          <ellipse cx="360" cy="298" rx="1.8" ry="0.9" />
          <ellipse cx="370" cy="299" rx="1.8" ry="0.9" />
          <ellipse cx="380" cy="297" rx="1.8" ry="0.9" />
          <ellipse cx="390" cy="298" rx="1.8" ry="0.9" />
        </g>

        {/* === ADDITIONAL SNOW DRIFTS === */}
        {/* Drift against second tent */}
        <ellipse cx="260" cy="342" rx="10" ry="2" fill="#141c28" opacity="0.15" />
        <ellipse cx="300" cy="342" rx="8" ry="1.8" fill="#1a2438" opacity="0.12" />
        {/* Drift near ammunition wagon */}
        <ellipse cx="460" cy="340" rx="12" ry="2.5" fill="#141c28" opacity="0.12" />
        {/* Drift near horse lines posts */}
        <ellipse cx="345" cy="290" rx="6" ry="1.5" fill="#1a2438" opacity="0.1" />
        <ellipse cx="418" cy="288" rx="5" ry="1.2" fill="#1a2438" opacity="0.08" />

        {/* === ADDITIONAL WIND-BLOWN SNOW PARTICLES === */}
        {/* New snow particles at different heights and speeds */}
        <circle cx="40" cy="345" r="0.7" fill="url(#cs_snowParticle)">
          <animate attributeName="cx" values="40;120;200;280" dur="10s" repeatCount="indefinite" />
          <animate attributeName="cy" values="345;342;347;343" dur="10s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.4;0.35;0" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="295" r="0.45" fill="#c8d8f0" opacity="0.2">
          <animate attributeName="cx" values="200;280;360;440" dur="11s" repeatCount="indefinite" />
          <animate attributeName="cy" values="295;292;297;294" dur="11s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.18;0" dur="11s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="330" r="0.55" fill="url(#cs_snowParticle)">
          <animate attributeName="cx" values="350;430;510;590" dur="8.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="330;326;332;328" dur="8.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.35;0.3;0" dur="8.5s" repeatCount="indefinite" />
        </circle>
        {/* Gentle falling flake */}
        <circle cx="420" cy="270" r="0.8" fill="#c8d8f0" opacity="0.12">
          <animate attributeName="cx" values="420;435;450;465" dur="8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="270;310;350;390" dur="8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.18;0.12;0" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="550" cy="280" r="0.7" fill="#c8d8f0" opacity="0.1">
          <animate attributeName="cx" values="550;560;570;580" dur="9s" repeatCount="indefinite" />
          <animate attributeName="cy" values="280;320;360;400" dur="9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.15;0.1;0" dur="9s" repeatCount="indefinite" />
        </circle>

        {/* === ADDITIONAL FROST CRYSTALS — on new elements === */}
        {/* Crystal on stone wall */}
        <g transform="translate(35,360)" opacity="0.25">
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-1" y1="-1" x2="1" y2="1" stroke="#a8c8e0" strokeWidth="0.25" />
          <line x1="1" y1="-1" x2="-1" y2="1" stroke="#a8c8e0" strokeWidth="0.25" />
        </g>
        {/* Crystal near ammunition wagon wheel */}
        <g transform="translate(460,348)" opacity="0.22">
          <line x1="0" y1="-2" x2="0" y2="2" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-2" y1="0" x2="2" y2="0" stroke="#c0d8f0" strokeWidth="0.3" />
          <line x1="-1.4" y1="-1.4" x2="1.4" y2="1.4" stroke="#a8c8e0" strokeWidth="0.25" />
          <line x1="1.4" y1="-1.4" x2="-1.4" y2="1.4" stroke="#a8c8e0" strokeWidth="0.25" />
          <circle cx="0" cy="0" r="0.4" fill="#d0e8ff" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="7s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Crystal on fallen tree */}
        <g transform="translate(745,355)" opacity="0.2">
          <line x1="0" y1="-1.8" x2="0" y2="1.8" stroke="#b0c8e0" strokeWidth="0.25" />
          <line x1="-1.8" y1="0" x2="1.8" y2="0" stroke="#b0c8e0" strokeWidth="0.25" />
          <line x1="-1.2" y1="-1.2" x2="1.2" y2="1.2" stroke="#98b0c8" strokeWidth="0.2" />
          <line x1="1.2" y1="-1.2" x2="-1.2" y2="1.2" stroke="#98b0c8" strokeWidth="0.2" />
        </g>

        {/* === ADDITIONAL DEAD GRASS TUFTS === */}
        {/* Near horse lines */}
        <g transform="translate(365,300)" opacity="0.2">
          <line x1="0" y1="0" x2="-1" y2="-4" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="2" y1="0" x2="1" y2="-5" stroke="#181608" strokeWidth="0.4" />
          <line x1="4" y1="0" x2="5" y2="-4" stroke="#1a1808" strokeWidth="0.4" />
        </g>
        {/* Near ammunition wagon */}
        <g transform="translate(505,345)" opacity="0.22">
          <line x1="0" y1="0" x2="-2" y2="-5" stroke="#181608" strokeWidth="0.4" />
          <line x1="2" y1="0" x2="0" y2="-6" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="4" y1="0" x2="5" y2="-4" stroke="#181608" strokeWidth="0.4" />
          <line x1="1" y1="0" x2="3" y2="-5" stroke="#1a1808" strokeWidth="0.4" />
        </g>
        {/* Near barrels */}
        <g transform="translate(210,385)" opacity="0.2">
          <line x1="0" y1="0" x2="1" y2="-4" stroke="#1a1808" strokeWidth="0.4" />
          <line x1="3" y1="0" x2="2" y2="-5" stroke="#181608" strokeWidth="0.4" />
        </g>

        {/* === MORE FOREGROUND SCATTERED EQUIPMENT === */}
        {/* Tin plate near third campfire */}
        <ellipse cx="145" cy="348" rx="3" ry="1.5" fill="#111118" opacity="0.35" />
        <ellipse cx="145" cy="348" rx="2" ry="1" fill="#141420" opacity="0.2" />
        {/* Wooden spoon */}
        <line x1="148" y1="346" x2="153" y2="343" stroke="#1a1508" strokeWidth="0.6" opacity="0.25" />
        <ellipse cx="153" cy="342.5" rx="1.5" ry="1" fill="#1a1508" opacity="0.2" />
        {/* Haversack near sleeping soldier */}
        <g transform="translate(335,345)" opacity="0.35">
          <path d="M0,0 Q2,-3 6,-3 Q9,-1 8,2 Q5,4 2,3 Z" fill="#111108" />
          <line x1="3" y1="-3" x2="3" y2="-6" stroke="#1a1810" strokeWidth="0.4" opacity="0.3" />
        </g>
        {/* Bayonet scabbard */}
        <g transform="translate(475,372)" opacity="0.3">
          <rect x="0" y="0" width="2" height="10" rx="0.3" fill="#0e0e14" />
          <rect x="-0.5" y="0" width="3" height="1.5" rx="0.2" fill="#141420" />
        </g>

        {/* === FIRELIGHT REFLECTIONS ON NEW ELEMENTS === */}
        {/* Warm glow on second tent canvas */}
        <path d="M265,340 L280,315 L295,340 Z" fill="#8b4513" opacity="0.02" />
        {/* Warm glow on supply crates */}
        <rect x="195" y="352" width="18" height="12" rx="0.5" fill="#8b4513" opacity="0.02" />
        {/* Firelight on horse flanks — very subtle warm tint */}
        <ellipse cx="355" cy="278" rx="6" ry="4" fill="#553311" opacity="0.02" />
        <ellipse cx="385" cy="278" rx="5" ry="3.5" fill="#553311" opacity="0.015" />
        {/* Glow on ammunition wagon canvas */}
        <path d="M437,315 Q460,293 470,293 Q480,293 503,315 Z" fill="#8b4513" opacity="0.02" />
        {/* Third fire glow on nearby soldier faces */}
        <circle cx="135" cy="323" r="3" fill="#8b4513" opacity="0.03" />
        <circle cx="168" cy="325" r="3" fill="#8b4513" opacity="0.025" />

        {/* === MOONLIGHT EDGE HIGHLIGHTS ON NEW ELEMENTS === */}
        {/* Moon-edge on ammunition wagon canvas */}
        <path d="M470,293 Q480,293 503,315" fill="none" stroke="#2a3448" strokeWidth="0.5" opacity="0.1" />
        {/* Moon-edge on horse back */}
        <path d="M352,273 Q356,271 360,273" fill="none" stroke="#2a3448" strokeWidth="0.3" opacity="0.08" />
        <path d="M382,274 Q386,272 390,274" fill="none" stroke="#2a3448" strokeWidth="0.3" opacity="0.07" />
        {/* Moon-edge on second tent ridge */}
        <path d="M280,315 L295,337" fill="none" stroke="#2a3448" strokeWidth="0.4" opacity="0.06" />
        {/* Moon-edge on barrels */}
        <path d="M200,363 Q203,361 207,363" fill="none" stroke="#1a2438" strokeWidth="0.3" opacity="0.08" />

        {/* === ADDITIONAL GROUND FOG WISPS === */}
        <ellipse cx="260" cy="365" rx="20" ry="3" fill="#1a2030" opacity="0.04">
          <animate attributeName="cx" values="260;272;260" dur="17s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="680" cy="372" rx="22" ry="3.5" fill="#1a2030" opacity="0.05">
          <animate attributeName="cx" values="680;668;680" dur="19s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="420" cy="370" rx="18" ry="2.5" fill="#1a2030" opacity="0.03">
          <animate attributeName="cx" values="420;432;420" dur="15s" repeatCount="indefinite" />
        </ellipse>

        {/* ================================================================ */}
        {/* === NEW DETAIL PASS 4 — FINAL ATMOSPHERE & DETAIL =========== */}
        {/* ================================================================ */}

        {/* === SECOND SHOOTING STAR — rarer, different trajectory === */}
        <line x1="120" y1="15" x2="160" y2="30" stroke="url(#cs_shootingStar)" strokeWidth="1" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0.7;0;0;0;0;0;0" dur="35s" repeatCount="indefinite" />
        </line>

        {/* === THIN CLOUD WISPS — high altitude clouds catching moonlight === */}
        <ellipse cx="600" cy="35" rx="50" ry="3" fill="#667788" opacity="0.03">
          <animate attributeName="cx" values="600;620;600" dur="30s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="350" cy="42" rx="40" ry="2.5" fill="#556678" opacity="0.025">
          <animate attributeName="cx" values="350;340;350" dur="25s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="150" cy="48" rx="35" ry="2" fill="#556678" opacity="0.02">
          <animate attributeName="cx" values="150;160;150" dur="28s" repeatCount="indefinite" />
        </ellipse>
        {/* Cloud near moon — slightly illuminated */}
        <ellipse cx="660" cy="58" rx="25" ry="3" fill="#778899" opacity="0.04">
          <animate attributeName="cx" values="660;670;660" dur="22s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.04;0.06;0.04" dur="22s" repeatCount="indefinite" />
        </ellipse>

        {/* === ADDITIONAL PINE TREES — filling gaps in treeline === */}
        {/* Small windswept pine, far left ridge */}
        <g transform="translate(50,263)" fill="#070b14" opacity="0.7">
          <path d="M0,-15 L-3,-8 L-1.5,-9 L-4,-2 L-2,-4 L-5,0 L5,0 L2,-4 L4,-2 L1.5,-9 L3,-8 Z" transform="rotate(8)" />
          <rect x="-0.8" y="0" width="1.8" height="3.5" />
          {/* Snow on branches */}
          <ellipse cx="-3" cy="-8" rx="2.5" ry="0.7" fill="#1a2438" opacity="0.25" />
          <ellipse cx="3" cy="-8" rx="2" ry="0.6" fill="#1a2438" opacity="0.2" />
        </g>
        {/* Pine between existing trees, center */}
        <g transform="translate(350,250)" fill="#070b14" opacity="0.75">
          <path d="M0,-20 L-4,-11 L-2,-12 L-5,-4 L-3,-5.5 L-6,0 L6,0 L3,-5.5 L5,-4 L2,-12 L4,-11 Z" />
          <rect x="-1" y="0" width="2" height="4" />
          {/* Snow */}
          <ellipse cx="-3" cy="-11" rx="3" ry="0.8" fill="#1a2438" opacity="0.22" />
          <ellipse cx="3" cy="-11" rx="2.5" ry="0.7" fill="#1a2438" opacity="0.2" />
          <ellipse cx="0" cy="-20" rx="1.2" ry="0.4" fill="#1c2640" opacity="0.25" />
        </g>
        {/* Small pine cluster, center-right */}
        <g transform="translate(640,240)" fill="#070b14" opacity="0.7">
          <path d="M0,-16 L-3.5,-9 L-1.5,-10 L-4.5,-3 L-2.5,-4.5 L-5.5,0 L5.5,0 L2.5,-4.5 L4.5,-3 L1.5,-10 L3.5,-9 Z" />
          <rect x="-0.8" y="0" width="2" height="3.5" />
          <ellipse cx="-3" cy="-9" rx="2.5" ry="0.7" fill="#1a2438" opacity="0.2" />
          <ellipse cx="3" cy="-9" rx="2" ry="0.6" fill="#1c2640" opacity="0.18" />
        </g>
        {/* Tiny distant pine */}
        <g transform="translate(480,245)" fill="#070b14" opacity="0.6">
          <path d="M0,-12 L-2.5,-6 L-1,-7 L-3,-1 L-1.5,-2.5 L-4,0 L4,0 L1.5,-2.5 L3,-1 L1,-7 L2.5,-6 Z" />
          <rect x="-0.6" y="0" width="1.5" height="2.5" />
        </g>

        {/* === WAGON TONGUE DETAIL — yoke and harness near ammunition wagon === */}
        <g transform="translate(440,330)" opacity="0.35">
          {/* Tongue / shaft extending forward */}
          <line x1="0" y1="0" x2="-20" y2="4" stroke="#0e0c08" strokeWidth="2" strokeLinecap="round" />
          {/* Cross-bar / yoke */}
          <line x1="-18" y1="0" x2="-18" y2="8" stroke="#0e0c08" strokeWidth="1.5" strokeLinecap="round" />
          {/* Traces / chains hanging loose */}
          <path d="M-20,2 Q-24,4 -26,6" fill="none" stroke="#141820" strokeWidth="0.4" opacity="0.3" />
          <path d="M-16,6 Q-20,8 -22,10" fill="none" stroke="#141820" strokeWidth="0.4" opacity="0.3" />
        </g>

        {/* === ADDITIONAL GROUND DETAIL — rocks, debris, combat debris === */}
        {/* Scattered pebbles near main fire */}
        <circle cx="372" cy="368" r="0.8" fill="#0c0e14" opacity="0.3" />
        <circle cx="428" cy="367" r="0.7" fill="#0b0e14" opacity="0.25" />
        <circle cx="395" cy="372" r="0.9" fill="#0c0e14" opacity="0.28" />
        <circle cx="408" cy="370" r="0.6" fill="#0b0e14" opacity="0.25" />
        <circle cx="385" cy="374" r="1.0" fill="#0c0e14" opacity="0.22" />
        {/* Small debris near supply area */}
        <circle cx="200" cy="368" r="0.7" fill="#0c0e14" opacity="0.2" />
        <circle cx="220" cy="372" r="0.8" fill="#0b0e14" opacity="0.22" />
        <circle cx="195" cy="375" r="0.6" fill="#0c0e14" opacity="0.18" />

        {/* === SOLDIER BREATH VAPOR DETAILS — visible exhalation from new soldiers === */}
        {/* Breath from card players */}
        <ellipse cx="636" cy="340" rx="3" ry="1.5" fill="url(#csBreath)">
          <animate attributeName="rx" values="3;5;3" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="3.8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="658" cy="340" rx="3" ry="1.5" fill="url(#csBreath)">
          <animate attributeName="rx" values="3;5;3" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="4.2s" repeatCount="indefinite" />
        </ellipse>
        {/* Breath from equipment-checking soldier */}
        <ellipse cx="242" cy="336" rx="3" ry="1.5" fill="url(#cs_breathPlume)">
          <animate attributeName="rx" values="3;5;3" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* === ADDITIONAL FIRELIGHT GLOW POOLS === */}
        {/* Third fire light pool on ground */}
        <ellipse cx="150" cy="340" rx="20" ry="6" fill="#8b4513" opacity="0.04">
          <animate attributeName="opacity" values="0.04;0.06;0.04" dur="1.3s" repeatCount="indefinite" />
        </ellipse>
        {/* Main fire broader glow reach */}
        <ellipse cx="400" cy="340" rx="60" ry="15" fill="#8b4513" opacity="0.015" />
        {/* Second fire extended glow */}
        <ellipse cx="660" cy="365" rx="18" ry="5" fill="#8b4513" opacity="0.025">
          <animate attributeName="opacity" values="0.025;0.04;0.025" dur="1.2s" repeatCount="indefinite" />
        </ellipse>

        {/* === ICICLE DETAILS — additional ice formations === */}
        {/* Small icicles on fallen tree branches */}
        <g transform="translate(728,355)" opacity="0.25">
          <path d="M0,0 L0.3,3 L0.6,0 Z" fill="#a0c0e0" />
          <path d="M3,0 L3.2,2.5 L3.5,0 Z" fill="#90b0d0" />
        </g>
        {/* Icicles on stone wall */}
        <g transform="translate(28,367)" opacity="0.2">
          <path d="M0,0 L0.3,4 L0.6,0 Z" fill="#a0c0e0" />
          <path d="M4,0 L4.2,3 L4.5,0 Z" fill="#90b0d0" />
          <path d="M8,0 L8.3,5 L8.6,0 Z" fill="#b0d0f0" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.45;0.3" dur="8s" repeatCount="indefinite" />
          </path>
          <path d="M12,0 L12.2,2.5 L12.5,0 Z" fill="#a0c0e0" />
        </g>

        {/* === ADDITIONAL MOUNTAIN RIDGE DETAILS === */}
        {/* Near mountain rocky outcrops — adding texture to mid-hills */}
        <path d="M370,185 Q375,182 380,185" fill="#0e1525" opacity="0.3" />
        <path d="M510,152 Q515,148 520,152" fill="#0c1220" opacity="0.25" />
        {/* Snow patches on mid-mountain slopes */}
        <ellipse cx="220" cy="175" rx="8" ry="2" fill="#1a2438" opacity="0.08" />
        <ellipse cx="450" cy="160" rx="6" ry="1.5" fill="#1a2438" opacity="0.07" />
        <ellipse cx="640" cy="158" rx="7" ry="1.8" fill="#1a2438" opacity="0.08" />

        {/* === DISTANT CAMP DETAIL — very small elements on plateau === */}
        {/* Tiny tent shapes near distant campfires */}
        <polygon points="119,266 121,262 123,266" fill="#0a0e18" opacity="0.2" />
        <polygon points="279,250 281,246 283,250" fill="#0a0e18" opacity="0.18" />
        <polygon points="519,250 521,246 523,250" fill="#0a0e18" opacity="0.15" />
        <polygon points="599,246 601,242 603,246" fill="#0a0e18" opacity="0.18" />
        {/* Tiny dark figures near distant fires */}
        <rect x="115" y="266" width="2" height="3" rx="0.3" fill="#080c16" opacity="0.15" />
        <rect x="125" y="265" width="2" height="3" rx="0.3" fill="#080c16" opacity="0.12" />
        <rect x="277" y="251" width="1.5" height="2.5" rx="0.3" fill="#080c16" opacity="0.12" />
        <rect x="285" y="250" width="1.5" height="2.5" rx="0.3" fill="#080c16" opacity="0.1" />

        {/* === ROPE COIL — near supply crates === */}
        <g transform="translate(218,366)" opacity="0.35">
          {/* Coiled rope — concentric ovals */}
          <ellipse cx="0" cy="0" rx="4" ry="2.5" fill="none" stroke="#1a1810" strokeWidth="0.8" />
          <ellipse cx="0" cy="0" rx="2.5" ry="1.5" fill="none" stroke="#1a1810" strokeWidth="0.7" />
          <ellipse cx="0" cy="0" rx="1" ry="0.6" fill="#1a1810" opacity="0.3" />
          {/* Rope end trailing */}
          <path d="M4,0 Q6,1 8,0" fill="none" stroke="#1a1810" strokeWidth="0.6" opacity="0.3" />
        </g>

        {/* === ADDITIONAL SPARKS FROM THIRD CAMPFIRE === */}
        <circle cx="152" cy="318" r="0.5" fill="#ffaa22" opacity="0.4">
          <animate attributeName="cy" values="322;302;282" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.2;0" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="cx" values="152;148;146" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="148" cy="315" r="0.4" fill="#ff9933" opacity="0.3">
          <animate attributeName="cy" values="320;295;270" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.15;0" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="cx" values="148;150;153" dur="2.8s" repeatCount="indefinite" />
        </circle>

        {/* === ADDITIONAL SPARKS FROM SECOND FIRE === */}
        <circle cx="661" cy="355" r="0.4" fill="#ffaa22" opacity="0.3">
          <animate attributeName="cy" values="355;340;325" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.15;0" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cx" values="661;664;666" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* === FINAL ATMOSPHERE — subtle overall tint layers === */}
        {/* Blue-shift overlay — cold January night color cast */}
        <rect x="0" y="0" width="800" height="400" fill="#0a1028" opacity="0.04" />
        {/* Very faint warm band near ground from all fires combined */}
        <rect x="0" y="300" width="800" height="100" fill="#2a1508" opacity="0.015" />

        {/* === HORSE DUNG / STRAW — realistic ground debris near horse lines === */}
        <ellipse cx="370" cy="295" rx="2" ry="1" fill="#0c0a06" opacity="0.15" />
        <ellipse cx="395" cy="293" rx="1.5" ry="0.8" fill="#0c0a06" opacity="0.12" />
        {/* Scattered hay/straw */}
        <line x1="360" y1="296" x2="363" y2="294" stroke="#1a1808" strokeWidth="0.3" opacity="0.12" />
        <line x1="388" y1="294" x2="391" y2="292" stroke="#1a1808" strokeWidth="0.3" opacity="0.1" />
        <line x1="402" y1="293" x2="404" y2="291" stroke="#181608" strokeWidth="0.3" opacity="0.1" />

        {/* === WATER TROUGH NEAR HORSE LINES === */}
        <g transform="translate(340,292)" opacity="0.3">
          {/* Wooden trough — long narrow box */}
          <rect x="0" y="0" width="20" height="4" rx="0.5" fill="#0e0c08" />
          {/* Sides */}
          <line x1="0" y1="0" x2="0" y2="4" stroke="#141008" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="0" x2="20" y2="4" stroke="#141008" strokeWidth="0.5" opacity="0.3" />
          {/* Frozen water inside */}
          <rect x="1" y="0.5" width="18" height="2" rx="0.3" fill="url(#cs_iceSheen)" opacity="0.4" />
          {/* Ice crack */}
          <line x1="5" y1="1" x2="12" y2="1.5" stroke="#c0d8f0" strokeWidth="0.15" opacity="0.2" />
        </g>

        {/* === SADDLES AND TACK NEAR HORSES === */}
        <g transform="translate(425,285)" opacity="0.3">
          {/* Saddle on fence rail */}
          <path d="M0,0 Q3,-3 6,-2 Q9,0 8,3 Q4,4 0,3 Z" fill="#0e0c0a" />
          {/* Pommel */}
          <ellipse cx="1" cy="0" rx="1.5" ry="2" fill="#100e0c" />
          {/* Cantle */}
          <ellipse cx="7" cy="0" rx="1.5" ry="2" fill="#100e0c" />
          {/* Stirrup hanging */}
          <path d="M2,3 L2,7 Q3,8 4,7 L4,3" fill="none" stroke="#141820" strokeWidth="0.4" opacity="0.3" />
          {/* Girth strap */}
          <line x1="3" y1="3" x2="5" y2="6" stroke="#1a1810" strokeWidth="0.4" opacity="0.25" />
        </g>

        {/* === SNOW ACCUMULATION ON FLAT SURFACES === */}
        {/* Snow on barrel tops near supply area */}
        <ellipse cx="204" cy="363" rx="4.5" ry="1.8" fill="#1a2438" opacity="0.2" />
        {/* Snow on supply crate tops */}
        <ellipse cx="205" cy="351" rx="7" ry="1" fill="#1c2640" opacity="0.18" />
        {/* Snow on hay bale */}
        <ellipse cx="327" cy="357" rx="5.5" ry="0.8" fill="#1a2438" opacity="0.15" />
        {/* Snow on wagon tongue */}
        <ellipse cx="430" cy="330" rx="6" ry="0.6" fill="#1a2438" opacity="0.1" />
        {/* Snow on water trough rim */}
        <ellipse cx="350" cy="291" rx="8" ry="0.6" fill="#1c2640" opacity="0.12" />

        {/* === ADDITIONAL MOUNTAIN WIND STREAKS === */}
        <g opacity="0.025">
          <line x1="50" y1="125" x2="140" y2="123" stroke="#667788" strokeWidth="0.6" />
          <line x1="200" y1="115" x2="310" y2="112" stroke="#667788" strokeWidth="0.5" />
          <line x1="450" y1="108" x2="530" y2="106" stroke="#667788" strokeWidth="0.6" />
          <line x1="650" y1="118" x2="730" y2="115" stroke="#667788" strokeWidth="0.5" />
        </g>

        {/* === FINAL FOREGROUND TEXTURE — edge detail === */}
        {/* More foreground stones */}
        <circle cx="100" cy="392" r="1.8" fill="#0a0e14" opacity="0.2" />
        <circle cx="250" cy="394" r="1.5" fill="#0c1018" opacity="0.18" />
        <circle cx="450" cy="393" r="2" fill="#0a0e14" opacity="0.15" />
        <circle cx="600" cy="391" r="1.8" fill="#0c1018" opacity="0.18" />
        <circle cx="750" cy="393" r="1.5" fill="#0a0e14" opacity="0.15" />
        {/* Frost shimmer on foreground edge */}
        <line x1="0" y1="396" x2="800" y2="396" stroke="#1a2438" strokeWidth="0.5" opacity="0.04" />

        {/* === COLD VIGNETTE === */}
        <rect width="800" height="400" fill="url(#csVignette)" />
      </svg>
    </div>
  );
}
