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

        {/* === NEAR HILLS === */}
        <path d="M0,285 L50,260 L100,272 L150,245 L200,265 L260,238 L310,258 L360,232 L410,252 L450,238 L500,258 L550,235 L600,252 L650,230 L700,250 L750,242 L800,258 L800,400 L0,400 Z" fill="#0a0e18" />

        {/* === PINE TREE SILHOUETTES — conifers on near hill ridge === */}
        {/* Pine 1 — left side */}
        <g transform="translate(85,255)" fill="#070b14" opacity="0.9">
          <path d="M0,-28 L-5,-16 L-3,-17 L-7,-6 L-4,-8 L-9,0 L9,0 L4,-8 L7,-6 L3,-17 L5,-16 Z" />
          <rect x="-1.5" y="0" width="3" height="5" />
        </g>
        {/* Pine 2 — left-center, smaller */}
        <g transform="translate(155,240)" fill="#070b14" opacity="0.85">
          <path d="M0,-22 L-4,-13 L-2.5,-14 L-6,-4 L-3,-6 L-7,0 L7,0 L3,-6 L6,-4 L2.5,-14 L4,-13 Z" />
          <rect x="-1" y="0" width="2.5" height="4" />
        </g>
        {/* Pine 3 — right side, taller */}
        <g transform="translate(730,238)" fill="#070b14" opacity="0.9">
          <path d="M0,-32 L-6,-18 L-3.5,-20 L-8,-7 L-4.5,-9 L-10,0 L10,0 L4.5,-9 L8,-7 L3.5,-20 L6,-18 Z" />
          <rect x="-1.5" y="0" width="3" height="6" />
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

        {/* === COLD VIGNETTE === */}
        <rect width="800" height="400" fill="url(#csVignette)" />
      </svg>
    </div>
  );
}
