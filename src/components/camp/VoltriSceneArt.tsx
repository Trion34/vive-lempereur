/**
 * SVG camp scene art -- Voltri sunrise overlook.
 * Hillside above the town looking down at the Ligurian coast, April 1796.
 * Dawn breaking, dying campfire embers, town below with lit windows.
 */
export function VoltriSceneArt() {
  return (
    <div className="camp-scene-art" id="camp-scene-art">
      <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
<defs>
    {/* SKY GRADIENT: deep navy upper-left to golden sunrise lower-right */}
    <linearGradient id="vtC_sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#0e1228"/>
      <stop offset="25%" stopColor="#1a2248"/>
      <stop offset="45%" stopColor="#3a2855"/>
      <stop offset="65%" stopColor="#6a3840"/>
      <stop offset="82%" stopColor="#b85a3a"/>
      <stop offset="100%" stopColor="#e8a050"/>
    </linearGradient>

    {/* HORIZON GLOW: warm golden band */}
    <linearGradient id="vtC_horizonGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#8a4535" stopOpacity="0.6"/>
      <stop offset="30%" stopColor="#d4783a" stopOpacity="0.85"/>
      <stop offset="55%" stopColor="#f0b050" stopOpacity="1"/>
      <stop offset="80%" stopColor="#e89040" stopOpacity="0.9"/>
      <stop offset="100%" stopColor="#c06838" stopOpacity="0.5"/>
    </linearGradient>

    {/* SEA BASE */}
    <linearGradient id="vtC_sea" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stopColor="#1a2040"/>
      <stop offset="35%" stopColor="#2a3050"/>
      <stop offset="55%" stopColor="#3a3848"/>
      <stop offset="75%" stopColor="#5a4838"/>
      <stop offset="100%" stopColor="#8a6030"/>
    </linearGradient>

    {/* SEA REFLECTION: golden sunrise path on water */}
    <radialGradient id="vtC_seaReflection" cx="0.65" cy="0.1" r="0.5" fx="0.65" fy="0.1">
      <stop offset="0%" stopColor="#f0b858" stopOpacity="0.6"/>
      <stop offset="40%" stopColor="#c08030" stopOpacity="0.3"/>
      <stop offset="100%" stopColor="#3a3848" stopOpacity="0"/>
    </radialGradient>

    {/* SUNRISE RADIAL GLOW from right horizon */}
    <radialGradient id="vtC_sunriseGlow" cx="0.78" cy="0.4" r="0.55" fx="0.78" fy="0.4">
      <stop offset="0%" stopColor="#f0c060" stopOpacity="0.35"/>
      <stop offset="30%" stopColor="#d08040" stopOpacity="0.2"/>
      <stop offset="60%" stopColor="#804030" stopOpacity="0.1"/>
      <stop offset="100%" stopColor="#0e1228" stopOpacity="0"/>
    </radialGradient>

    {/* HEADLAND GRADIENTS */}
    <linearGradient id="vtC_headland1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1a1828"/>
      <stop offset="100%" stopColor="#141420"/>
    </linearGradient>
    <linearGradient id="vtC_headland2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1e1c30"/>
      <stop offset="100%" stopColor="#141420"/>
    </linearGradient>

    {/* ROOF TERRACOTTA */}
    <linearGradient id="vtC_roof" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#4a2828"/>
      <stop offset="100%" stopColor="#6a3830"/>
    </linearGradient>

    {/* ROOF TERRACOTTA - SUNRISE CATCHING */}
    <linearGradient id="vtC_roofLit" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#5a3030"/>
      <stop offset="100%" stopColor="#8a5038"/>
    </linearGradient>

    {/* FOREGROUND GROUND */}
    <linearGradient id="vtC_ground" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#0e1018"/>
      <stop offset="60%" stopColor="#1a1820"/>
      <stop offset="100%" stopColor="#2a2420"/>
    </linearGradient>

    {/* SLOPE */}
    <linearGradient id="vtC_slope" x1="0" y1="0" x2="1" y2="0.5">
      <stop offset="0%" stopColor="#1a1820"/>
      <stop offset="100%" stopColor="#2a2425"/>
    </linearGradient>

    {/* EMBER GLOW */}
    <radialGradient id="vtC_emberGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#e07828" stopOpacity="0.4"/>
      <stop offset="40%" stopColor="#a04818" stopOpacity="0.2"/>
      <stop offset="100%" stopColor="#401808" stopOpacity="0"/>
    </radialGradient>

    {/* EMBER CORE */}
    <radialGradient id="vtC_emberCore" cx="0.5" cy="0.6" r="0.45">
      <stop offset="0%" stopColor="#f0a040"/>
      <stop offset="50%" stopColor="#d06020"/>
      <stop offset="100%" stopColor="#601808"/>
    </radialGradient>

    {/* WINDOW GLOW */}
    <radialGradient id="vtC_windowGlow" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stopColor="#f0c878" stopOpacity="0.6"/>
      <stop offset="100%" stopColor="#f0c878" stopOpacity="0"/>
    </radialGradient>

    {/* MORNING MIST */}
    <linearGradient id="vtC_mist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8890a0" stopOpacity="0.12"/>
      <stop offset="100%" stopColor="#8890a0" stopOpacity="0"/>
    </linearGradient>

    {/* VIGNETTE */}
    <radialGradient id="vtC_vignette" cx="0.65" cy="0.45" r="0.7">
      <stop offset="0%" stopColor="#000000" stopOpacity="0"/>
      <stop offset="60%" stopColor="#000000" stopOpacity="0"/>
      <stop offset="100%" stopColor="#000000" stopOpacity="0.4"/>
    </radialGradient>

    {/* TREE FOLIAGE */}
    <radialGradient id="vtC_foliage" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#1a2818"/>
      <stop offset="100%" stopColor="#0e1a10"/>
    </radialGradient>

    {/* TREE FOLIAGE - SUNRISE EDGE */}
    <radialGradient id="vtC_foliageLit" cx="0.8" cy="0.4" r="0.5">
      <stop offset="0%" stopColor="#3a4828"/>
      <stop offset="60%" stopColor="#2a3820"/>
      <stop offset="100%" stopColor="#1a2818"/>
    </radialGradient>

    {/* HIGH CLOUD */}
    <linearGradient id="vtC_cloud" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#c08060" stopOpacity="0"/>
      <stop offset="30%" stopColor="#d09060" stopOpacity="0.15"/>
      <stop offset="70%" stopColor="#e0a070" stopOpacity="0.2"/>
      <stop offset="100%" stopColor="#c08060" stopOpacity="0"/>
    </linearGradient>

    {/* GROUND MIST */}
    <linearGradient id="vtC_groundMist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#a0a8b8" stopOpacity="0.06"/>
      <stop offset="100%" stopColor="#a0a8b8" stopOpacity="0"/>
    </linearGradient>

    {/* DISTANT MOUNTAIN */}
    <linearGradient id="vtC_mountain" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1e1a30"/>
      <stop offset="100%" stopColor="#141020"/>
    </linearGradient>

    {/* CAMPFIRE WARM GLOW (for ground lighting) */}
    <radialGradient id="vtC_fireWarm" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#e08030" stopOpacity="0.08"/>
      <stop offset="50%" stopColor="#a05018" stopOpacity="0.04"/>
      <stop offset="100%" stopColor="#401808" stopOpacity="0"/>
    </radialGradient>

    {/* TENT CANVAS */}
    <linearGradient id="vtC_canvas" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2a2838"/>
      <stop offset="100%" stopColor="#1e1c28"/>
    </linearGradient>

    {/* SUNRISE BAND (narrow warm band at horizon) */}
    <linearGradient id="vtC_sunriseBand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f0c060" stopOpacity="0.5"/>
      <stop offset="50%" stopColor="#e8a050" stopOpacity="0.3"/>
      <stop offset="100%" stopColor="#c08040" stopOpacity="0"/>
    </linearGradient>

    {/* DEEP SEA (for far water) */}
    <linearGradient id="vtC_deepSea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1a2040"/>
      <stop offset="100%" stopColor="#0e1428"/>
    </linearGradient>

    {/* SMOKE GRADIENT */}
    <linearGradient id="vtC_smoke" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="#888888" stopOpacity="0.08"/>
      <stop offset="100%" stopColor="#888888" stopOpacity="0"/>
    </linearGradient>

    {/* DARK FOLIAGE (for cypress deep shadow) */}
    <radialGradient id="vtC_darkFoliage" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stopColor="#0e1610"/>
      <stop offset="100%" stopColor="#080e08"/>
    </radialGradient>

    {/* Filter for soft glow */}
    <filter id="vtC_softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
    </filter>
    <filter id="vtC_gentleBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
    </filter>
    <filter id="vtC_tinyBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.8"/>
    </filter>
  </defs>

  {/* ========================================= */}
  {/* LAYER 1: SKY                              */}
  {/* ========================================= */}
  <rect x="0" y="0" width="800" height="170" fill="url(#vtC_sky)"/>

  {/* Fading stars - upper-left quadrant only */}
  <circle cx="45" cy="22" r="1" fill="#c8c8d0" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.2;0.35" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="120" cy="38" r="0.8" fill="#c0c0d0" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.12;0.25" dur="5.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="78" cy="65" r="0.7" fill="#b8b8c8" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="200" cy="18" r="0.9" fill="#c8c8d8" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.15;0.3" dur="4.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="160" cy="55" r="0.6" fill="#b0b0c0" opacity="0.18">
    <animate attributeName="opacity" values="0.18;0.06;0.18" dur="7s" repeatCount="indefinite"/>
  </circle>

  {/* High clouds catching pink/gold light */}
  <ellipse cx="500" cy="60" rx="120" ry="3" fill="url(#vtC_cloud)" opacity="0.5"/>
  <ellipse cx="580" cy="75" rx="90" ry="2.5" fill="url(#vtC_cloud)" opacity="0.4"/>
  <ellipse cx="650" cy="50" rx="70" ry="2" fill="url(#vtC_cloud)" opacity="0.35"/>
  <ellipse cx="420" cy="85" rx="100" ry="2" fill="url(#vtC_cloud)" opacity="0.3"/>
  <ellipse cx="700" cy="90" rx="60" ry="2.5" fill="url(#vtC_cloud)" opacity="0.45"/>
  <ellipse cx="550" cy="100" rx="80" ry="1.8" fill="url(#vtC_cloud)" opacity="0.25"/>

  {/* ========================================= */}
  {/* LAYER 2: HORIZON GLOW                     */}
  {/* ========================================= */}
  <rect x="0" y="150" width="800" height="25" fill="url(#vtC_horizonGlow)" opacity="0.9"/>

  {/* Bright sun glow at horizon (right of center) */}
  <ellipse cx="620" cy="162" rx="80" ry="14" fill="#f0c060" opacity="0.25" filter="url(#vtC_softGlow)">
    <animate attributeName="opacity" values="0.25;0.3;0.25" dur="3s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="620" cy="162" rx="40" ry="8" fill="#f8d878" opacity="0.4" filter="url(#vtC_softGlow)">
    <animate attributeName="opacity" values="0.4;0.5;0.4" dur="2.5s" repeatCount="indefinite"/>
  </ellipse>
  {/* Sun disc peeking above horizon */}
  <circle cx="620" cy="164" r="6" fill="#f8e0a0" opacity="0.7" filter="url(#vtC_gentleBlur)">
    <animate attributeName="opacity" values="0.7;0.85;0.7" dur="3.5s" repeatCount="indefinite"/>
  </circle>

  {/* ========================================= */}
  {/* LAYER 3: SEA                              */}
  {/* ========================================= */}
  <rect x="0" y="168" width="800" height="45" fill="url(#vtC_sea)"/>
  {/* Golden reflection path on water */}
  <rect x="0" y="168" width="800" height="45" fill="url(#vtC_seaReflection)"/>

  {/* Wave lines */}
  <path d="M0,178 Q100,176 200,178 Q300,180 400,178 Q500,176 600,177 Q700,179 800,177" stroke="#5a5848" strokeWidth="0.4" fill="none" opacity="0.3"/>
  <path d="M0,185 Q150,183 300,185 Q450,187 600,184 Q700,186 800,185" stroke="#4a4838" strokeWidth="0.3" fill="none" opacity="0.25"/>
  <path d="M0,192 Q120,190 250,192 Q380,194 500,191 Q650,193 800,192" stroke="#3a3830" strokeWidth="0.3" fill="none" opacity="0.2"/>
  <path d="M0,200 Q200,198 400,200 Q600,202 800,199" stroke="#2a2828" strokeWidth="0.25" fill="none" opacity="0.15"/>

  {/* Shimmer ellipses on water */}
  <ellipse cx="600" cy="174" rx="12" ry="1.2" fill="#f0c060" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="12;14;12" dur="2s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="630" cy="180" rx="8" ry="0.8" fill="#e0a850" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="8;10;8" dur="2.5s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="580" cy="178" rx="15" ry="1" fill="#d8a048" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="650" cy="186" rx="10" ry="0.7" fill="#c09040" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="560" cy="184" rx="18" ry="1.1" fill="#d09848" opacity="0.12">
    <animate attributeName="opacity" values="0.12;0.04;0.12" dur="3.5s" repeatCount="indefinite"/>
  </ellipse>

  {/* ========================================= */}
  {/* LAYER 4: DISTANT HEADLANDS                */}
  {/* ========================================= */}
  <path d="M0,210 Q30,195 80,192 Q120,190 160,195 Q200,200 240,205 L240,215 L0,215 Z" fill="url(#vtC_headland1)" opacity="0.9"/>
  <path d="M560,210 Q600,196 640,193 Q680,190 720,192 Q760,195 800,200 L800,215 L560,215 Z" fill="url(#vtC_headland2)" opacity="0.95"/>
  {/* Warm edge-light on right headland */}
  <path d="M700,193 Q730,192 760,195 Q780,197 800,200 L800,198 Q770,194 740,192 Q720,191 700,193 Z" fill="#4a3028" opacity="0.4"/>

  {/* ========================================= */}
  {/* LAYER 5: TOWN OF VOLTRI                   */}
  {/* ========================================= */}

  {/* Town base / ground plane */}
  <rect x="120" y="280" width="520" height="30" fill="#1a1820" opacity="0.8"/>
  {/* Morning mist at base of buildings */}
  <rect x="100" y="295" width="560" height="18" fill="url(#vtC_mist)" opacity="0.8"/>

  {/* === BUILDING CLUSTER 1 (far left) === */}
  {/* Building 1A: tall narrow house */}
  <rect x="140" y="240" width="28" height="60" fill="#3a3540"/>
  <rect x="160" y="240" width="8" height="60" fill="#4a4248" opacity="0.5"/>
  <polygon points="136,240 154,228 172,240" fill="url(#vtC_roof)"/>
  <polygon points="154,228 172,240 168,240" fill="url(#vtC_roofLit)" opacity="0.6"/>
  <rect x="147" y="250" width="5" height="6" fill="#1a1420"/>
  <rect x="147" y="262" width="5" height="6" fill="#1a1420"/>
  <rect x="158" y="250" width="5" height="6" fill="#e8b848" opacity="0.7">
    <animate attributeName="opacity" values="0.7;0.55;0.7" dur="3s" repeatCount="indefinite"/>
  </rect>
  <circle cx="160" cy="253" r="6" fill="url(#vtC_windowGlow)" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.25;0.4" dur="3s" repeatCount="indefinite"/>
  </circle>
  <rect x="158" y="262" width="5" height="6" fill="#1a1420"/>

  {/* Building 1B: shorter wide house */}
  <rect x="170" y="258" width="35" height="42" fill="#3e3840"/>
  <rect x="195" y="258" width="10" height="42" fill="#4e4540" opacity="0.4"/>
  <polygon points="167,258 187,246 210,258" fill="url(#vtC_roof)"/>
  <polygon points="187,246 210,258 205,258" fill="url(#vtC_roofLit)" opacity="0.5"/>
  <rect x="177" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="186" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="177" y="280" width="5" height="6" fill="#1a1420"/>
  <rect x="186" y="280" width="5" height="6" fill="#e0b040" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="4s" repeatCount="indefinite"/>
  </rect>
  <circle cx="189" cy="283" r="5" fill="url(#vtC_windowGlow)" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.18;0.3" dur="4s" repeatCount="indefinite"/>
  </circle>

  {/* Dark alley 1 */}
  <rect x="206" y="255" width="6" height="45" fill="#0a0a12" opacity="0.8"/>

  {/* === BUILDING CLUSTER 2 (center-left) === */}
  <rect x="212" y="250" width="30" height="50" fill="#38343e"/>
  <rect x="234" y="250" width="8" height="50" fill="#484040" opacity="0.4"/>
  <polygon points="209,250 227,237 245,250" fill="url(#vtC_roof)"/>
  <polygon points="227,237 245,250 240,250" fill="url(#vtC_roofLit)" opacity="0.5"/>
  <rect x="218" y="258" width="5" height="6" fill="#1a1420"/>
  <rect x="228" y="258" width="5" height="6" fill="#1a1420"/>
  <rect x="218" y="270" width="5" height="6" fill="#1a1420"/>
  <rect x="228" y="270" width="5" height="6" fill="#1a1420"/>
  <rect x="222" y="285" width="8" height="15" fill="#1e1820" rx="1"/>

  {/* Building 2B: tall narrow */}
  <rect x="244" y="242" width="24" height="58" fill="#3c3640"/>
  <rect x="260" y="242" width="8" height="58" fill="#4c4440" opacity="0.4"/>
  <polygon points="241,242 256,230 271,242" fill="url(#vtC_roofLit)"/>
  <rect x="250" y="252" width="4" height="5" fill="#d8a840" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.4;0.6" dur="3.5s" repeatCount="indefinite"/>
  </rect>
  <circle cx="252" cy="254" r="5" fill="url(#vtC_windowGlow)" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.2;0.35" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <rect x="250" y="264" width="4" height="5" fill="#1a1420"/>
  <rect x="250" y="276" width="4" height="5" fill="#1a1420"/>

  {/* Dark alley 2 */}
  <rect x="269" y="248" width="5" height="52" fill="#08080e" opacity="0.85"/>

  {/* === BELL TOWER / CHURCH === */}
  <rect x="274" y="248" width="45" height="52" fill="#3a3540"/>
  <rect x="308" y="248" width="11" height="52" fill="#4a4240" opacity="0.45"/>
  <polygon points="271,248 296,234 322,248" fill="url(#vtC_roof)"/>
  <polygon points="296,234 322,248 316,248" fill="url(#vtC_roofLit)" opacity="0.6"/>

  {/* Bell tower */}
  <rect x="288" y="215" width="16" height="33" fill="#353040"/>
  <rect x="298" y="215" width="6" height="33" fill="#454040" opacity="0.5"/>
  <polygon points="286,215 296,200 306,215" fill="#3a2828"/>
  <polygon points="296,200 306,215 302,215" fill="#5a3830" opacity="0.5"/>
  {/* Cross */}
  <line x1="296" y1="194" x2="296" y2="200" stroke="#2a2430" strokeWidth="1.2"/>
  <line x1="293" y1="196" x2="299" y2="196" stroke="#2a2430" strokeWidth="1"/>
  {/* Cross warm edge-light */}
  <line x1="297" y1="194" x2="297" y2="200" stroke="#5a4838" strokeWidth="0.5" opacity="0.5"/>
  <line x1="296" y1="196" x2="299" y2="196" stroke="#5a4838" strokeWidth="0.4" opacity="0.5"/>
  {/* Bell opening */}
  <rect x="292" y="222" width="8" height="10" fill="#0e0e18" rx="4" ry="4"/>
  <rect x="293" y="236" width="6" height="7" fill="#0e0e18"/>
  {/* Church windows */}
  <rect x="282" y="260" width="6" height="10" fill="#1a1420" rx="0" ry="3"/>
  <rect x="292" y="260" width="6" height="10" fill="#1a1420" rx="0" ry="3"/>
  <rect x="302" y="260" width="6" height="10" fill="#1a1420" rx="0" ry="3"/>
  <rect x="290" y="282" width="12" height="18" fill="#141018" rx="6" ry="6"/>

  {/* Dark alley 3 */}
  <rect x="320" y="252" width="6" height="48" fill="#0a0a12" opacity="0.8"/>

  {/* === BUILDING CLUSTER 3 (center-right) === */}
  <rect x="326" y="255" width="32" height="45" fill="#3b3540"/>
  <rect x="350" y="255" width="8" height="45" fill="#4b4340" opacity="0.4"/>
  <polygon points="323,255 342,243 361,255" fill="url(#vtC_roof)"/>
  <polygon points="342,243 361,255 356,255" fill="url(#vtC_roofLit)" opacity="0.55"/>
  <rect x="332" y="264" width="5" height="6" fill="#1a1420"/>
  <rect x="342" y="264" width="5" height="6" fill="#1a1420"/>
  <rect x="332" y="276" width="5" height="6" fill="#1a1420"/>
  <rect x="342" y="276" width="5" height="6" fill="#e0b040" opacity="0.55">
    <animate attributeName="opacity" values="0.55;0.38;0.55" dur="4.2s" repeatCount="indefinite"/>
  </rect>
  <circle cx="345" cy="279" r="5" fill="url(#vtC_windowGlow)" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.18;0.3" dur="4.2s" repeatCount="indefinite"/>
  </circle>

  {/* Building 3B: tall */}
  <rect x="360" y="243" width="26" height="57" fill="#3e3842"/>
  <rect x="378" y="243" width="8" height="57" fill="#4e4842" opacity="0.45"/>
  <polygon points="357,243 373,232 389,243" fill="url(#vtC_roofLit)"/>
  <rect x="367" y="252" width="4" height="5" fill="#1a1420"/>
  <rect x="367" y="264" width="4" height="5" fill="#1a1420"/>
  <rect x="367" y="276" width="4" height="5" fill="#1a1420"/>
  <rect x="376" y="252" width="4" height="5" fill="#1a1420"/>
  <rect x="376" y="264" width="4" height="5" fill="#d0a040" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.32;0.5" dur="5s" repeatCount="indefinite"/>
  </rect>
  <circle cx="378" cy="266" r="4.5" fill="url(#vtC_windowGlow)" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.12;0.25" dur="5s" repeatCount="indefinite"/>
  </circle>
  <rect x="376" y="276" width="4" height="5" fill="#1a1420"/>

  {/* Building 3C: short wide */}
  <rect x="388" y="268" width="38" height="32" fill="#3a3440"/>
  <rect x="416" y="268" width="10" height="32" fill="#4a4240" opacity="0.4"/>
  <polygon points="385,268 407,258 429,268" fill="url(#vtC_roof)"/>
  <polygon points="407,258 429,268 424,268" fill="url(#vtC_roofLit)" opacity="0.5"/>
  <rect x="395" y="276" width="5" height="5" fill="#1a1420"/>
  <rect x="405" y="276" width="5" height="5" fill="#1a1420"/>
  <rect x="415" y="276" width="5" height="5" fill="#1a1420"/>
  <rect x="393" y="276" width="2" height="5" fill="#2a2430"/>
  <rect x="412" y="276" width="2" height="5" fill="#2a2430"/>
  <rect x="403" y="288" width="7" height="12" fill="#181420" rx="1"/>

  {/* === BUILDING CLUSTER 4 (right side) === */}
  <rect x="427" y="260" width="5" height="40" fill="#08080e" opacity="0.75"/>

  <rect x="432" y="252" width="30" height="48" fill="#3c3640"/>
  <rect x="454" y="252" width="8" height="48" fill="#504840" opacity="0.45"/>
  <polygon points="429,252 447,240 465,252" fill="url(#vtC_roof)"/>
  <polygon points="447,240 465,252 460,252" fill="url(#vtC_roofLit)" opacity="0.6"/>
  <rect x="438" y="260" width="5" height="6" fill="#1a1420"/>
  <rect x="448" y="260" width="5" height="6" fill="#1a1420"/>
  <rect x="438" y="272" width="5" height="6" fill="#1a1420"/>
  <rect x="448" y="272" width="5" height="6" fill="#d8a840" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="3.8s" repeatCount="indefinite"/>
  </rect>
  <circle cx="450" cy="275" r="5" fill="url(#vtC_windowGlow)" opacity="0.28">
    <animate attributeName="opacity" values="0.28;0.15;0.28" dur="3.8s" repeatCount="indefinite"/>
  </circle>

  {/* Building 4B */}
  <rect x="464" y="262" width="28" height="38" fill="#3a3540"/>
  <rect x="484" y="262" width="8" height="38" fill="#4e4640" opacity="0.45"/>
  <polygon points="461,262 478,252 495,262" fill="url(#vtC_roofLit)"/>
  <rect x="470" y="270" width="4" height="5" fill="#1a1420"/>
  <rect x="480" y="270" width="4" height="5" fill="#1a1420"/>
  <rect x="470" y="282" width="4" height="5" fill="#1a1420"/>
  <rect x="480" y="282" width="4" height="5" fill="#1a1420"/>

  {/* Building 4C: waterfront tall */}
  <rect x="496" y="248" width="32" height="52" fill="#3e3842"/>
  <rect x="518" y="248" width="10" height="52" fill="#504a42" opacity="0.5"/>
  <polygon points="493,248 512,236 534,248" fill="url(#vtC_roof)"/>
  <polygon points="512,236 534,248 528,248" fill="url(#vtC_roofLit)" opacity="0.55"/>
  <rect x="502" y="256" width="5" height="6" fill="#1a1420"/>
  <rect x="512" y="256" width="5" height="6" fill="#1a1420"/>
  <rect x="502" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="512" y="268" width="5" height="6" fill="#1a1420"/>
  <rect x="502" y="280" width="5" height="6" fill="#1a1420"/>
  <rect x="512" y="280" width="5" height="6" fill="#1a1420"/>
  <rect x="506" y="286" width="8" height="14" fill="#141018" rx="1"/>

  {/* === SCATTERED BUILDINGS (edges) === */}
  <rect x="110" y="270" width="26" height="30" fill="#343040"/>
  <polygon points="107,270 123,260 139,270" fill="url(#vtC_roof)"/>
  <rect x="117" y="278" width="4" height="5" fill="#1a1420"/>
  <rect x="125" y="278" width="4" height="5" fill="#1a1420"/>

  <rect x="535" y="266" width="24" height="34" fill="#3c3840"/>
  <rect x="551" y="266" width="8" height="34" fill="#4c4640" opacity="0.4"/>
  <polygon points="532,266 547,256 562,266" fill="url(#vtC_roofLit)"/>
  <rect x="540" y="274" width="4" height="5" fill="#1a1420"/>
  <rect x="550" y="274" width="4" height="5" fill="#1a1420"/>

  <rect x="560" y="278" width="18" height="22" fill="#343040"/>
  <polygon points="558,278 569,270 580,278" fill="#3a2828"/>

  {/* ========================================= */}
  {/* LAYER 6: TRANSITIONAL SLOPE               */}
  {/* ========================================= */}
  <path d="M0,300 Q100,295 200,298 Q350,290 500,295 Q650,292 800,298 L800,335 Q650,328 500,332 Q350,325 200,330 Q100,328 0,332 Z" fill="url(#vtC_slope)"/>

  {/* Stone retaining wall */}
  <path d="M80,305 L180,300 L280,303 L380,298 L480,301 L580,297 L650,302" stroke="#2a2630" strokeWidth="3" fill="none" opacity="0.6"/>
  <path d="M80,308 L180,303 L280,306 L380,301 L480,304 L580,300 L650,305" stroke="#222030" strokeWidth="2" fill="none" opacity="0.4"/>
  {/* Stone texture */}
  <line x1="130" y1="300" x2="130" y2="306" stroke="#1e1a28" strokeWidth="0.8" opacity="0.5"/>
  <line x1="180" y1="300" x2="180" y2="305" stroke="#1e1a28" strokeWidth="0.8" opacity="0.5"/>
  <line x1="230" y1="302" x2="230" y2="307" stroke="#1e1a28" strokeWidth="0.8" opacity="0.5"/>
  <line x1="330" y1="299" x2="330" y2="304" stroke="#1e1a28" strokeWidth="0.8" opacity="0.5"/>
  <line x1="430" y1="300" x2="430" y2="305" stroke="#1e1a28" strokeWidth="0.8" opacity="0.5"/>
  <line x1="530" y1="298" x2="530" y2="303" stroke="#1e1a28" strokeWidth="0.8" opacity="0.5"/>

  {/* Mediterranean scrub */}
  <ellipse cx="100" cy="310" rx="12" ry="5" fill="#1a2218" opacity="0.6"/>
  <ellipse cx="250" cy="305" rx="10" ry="4" fill="#182018" opacity="0.5"/>
  <ellipse cx="400" cy="308" rx="14" ry="5" fill="#1a2218" opacity="0.55"/>
  <ellipse cx="550" cy="303" rx="11" ry="4" fill="#202818" opacity="0.5"/>
  <ellipse cx="700" cy="306" rx="8" ry="3" fill="#1a2218" opacity="0.45"/>

  {/* Morning dew highlights */}
  <circle cx="95" cy="308" r="0.5" fill="#c0c8d0" opacity="0.15"/>
  <circle cx="108" cy="309" r="0.4" fill="#c0c8d0" opacity="0.12"/>
  <circle cx="248" cy="303" r="0.5" fill="#c0c8d0" opacity="0.12"/>
  <circle cx="398" cy="306" r="0.5" fill="#c0c8d0" opacity="0.15"/>
  <circle cx="547" cy="301" r="0.4" fill="#c0c8d0" opacity="0.12"/>

  {/* ========================================= */}
  {/* LAYER 7: FOREGROUND HILLSIDE              */}
  {/* ========================================= */}
  <path d="M0,325 Q80,320 160,328 Q300,318 400,322 Q500,316 600,320 Q700,315 800,322 L800,400 L0,400 Z" fill="url(#vtC_ground)"/>
  {/* Warm sunrise light on right side */}
  <path d="M500,318 Q600,315 700,318 Q750,316 800,320 L800,400 L500,400 Z" fill="#2a2420" opacity="0.3"/>

  {/* Path suggestion leading down */}
  <path d="M350,325 Q340,335 345,350 Q350,365 360,380 Q365,390 370,400" stroke="#2a2630" strokeWidth="4" fill="none" opacity="0.25"/>
  <path d="M350,325 Q340,335 345,350 Q350,365 360,380 Q365,390 370,400" stroke="#222030" strokeWidth="2" fill="none" opacity="0.15"/>

  {/* Rocky outcrops */}
  <path d="M50,355 Q55,345 65,348 Q72,340 80,345 Q85,350 80,358 Q70,362 55,360 Z" fill="#2a2630" opacity="0.7"/>
  <path d="M52,356 Q58,348 68,350 Q74,344 78,348" stroke="#353040" strokeWidth="0.5" fill="none" opacity="0.4"/>
  <path d="M480,340 Q485,332 495,335 Q502,330 510,334 Q514,340 508,345 Q498,348 485,346 Z" fill="#2a2630" opacity="0.65"/>
  <path d="M520,355 Q525,348 530,350 Q535,346 540,350 Q542,356 535,358 Q528,360 522,358 Z" fill="#282430" opacity="0.6"/>
  <path d="M730,338 Q738,328 750,332 Q758,326 766,330 Q772,338 764,344 Q750,348 735,344 Z" fill="#302828" opacity="0.6"/>

  {/* Wild herbs and grasses */}
  <path d="M30,365 Q32,355 34,365" stroke="#1e2a18" strokeWidth="1" fill="none" opacity="0.5"/>
  <path d="M32,365 Q35,352 38,365" stroke="#1a2618" strokeWidth="0.8" fill="none" opacity="0.45"/>
  <path d="M34,365 Q37,356 40,365" stroke="#1e2a18" strokeWidth="0.7" fill="none" opacity="0.4"/>
  <path d="M150,345 Q152,335 154,345" stroke="#1e2a18" strokeWidth="1" fill="none" opacity="0.5"/>
  <path d="M152,345 Q155,332 158,345" stroke="#1a2618" strokeWidth="0.8" fill="none" opacity="0.45"/>
  <path d="M440,335 Q442,325 444,335" stroke="#1e2a18" strokeWidth="1" fill="none" opacity="0.5"/>
  <path d="M442,335 Q445,323 448,335" stroke="#1a2618" strokeWidth="0.8" fill="none" opacity="0.45"/>
  <path d="M600,330 Q602,320 604,330" stroke="#222e1a" strokeWidth="1" fill="none" opacity="0.5"/>
  <path d="M602,330 Q605,318 608,330" stroke="#1e2a18" strokeWidth="0.8" fill="none" opacity="0.45"/>
  <path d="M760,340 Q762,330 764,340" stroke="#242e1c" strokeWidth="1" fill="none" opacity="0.5"/>
  <path d="M762,340 Q764,328 766,340" stroke="#202a1a" strokeWidth="0.8" fill="none" opacity="0.45"/>

  {/* Herb clusters */}
  <ellipse cx="100" cy="370" rx="8" ry="4" fill="#1a2418" opacity="0.4"/>
  <ellipse cx="310" cy="350" rx="6" ry="3" fill="#182218" opacity="0.35"/>
  <ellipse cx="620" cy="345" rx="7" ry="3" fill="#1e2818" opacity="0.4"/>

  {/* === OLIVE TREE 1 (left, shadowed) === */}
  <path d="M180,380 Q178,360 175,350 Q172,340 170,332 Q168,326 172,322" stroke="#2a2420" strokeWidth="4" fill="none"/>
  <path d="M175,350 Q180,344 185,340" stroke="#2a2420" strokeWidth="2.5" fill="none"/>
  <path d="M172,342 Q168,336 164,332" stroke="#2a2420" strokeWidth="2" fill="none"/>
  <path d="M178,370 Q176,365 177,360" stroke="#342e28" strokeWidth="1" fill="none" opacity="0.4"/>
  <path d="M176,355 Q174,350 175,345" stroke="#342e28" strokeWidth="0.8" fill="none" opacity="0.3"/>
  <ellipse cx="170" cy="318" rx="18" ry="12" fill="url(#vtC_foliage)"/>
  <ellipse cx="158" cy="326" rx="14" ry="10" fill="url(#vtC_foliage)"/>
  <ellipse cx="182" cy="325" rx="12" ry="9" fill="url(#vtC_foliage)"/>
  <ellipse cx="186" cy="335" rx="10" ry="7" fill="#0e1a10" opacity="0.7"/>
  <ellipse cx="162" cy="316" rx="10" ry="7" fill="#121e12" opacity="0.6"/>

  {/* === OLIVE TREE 2 (right, catching sunrise edge-light) === */}
  <path d="M620,385 Q618,365 615,355 Q612,345 610,335 Q608,328 612,324" stroke="#2a2420" strokeWidth="4.5" fill="none"/>
  <path d="M615,355 Q620,347 626,342" stroke="#2a2420" strokeWidth="2.5" fill="none"/>
  <path d="M612,345 Q607,338 604,332" stroke="#2a2420" strokeWidth="2.5" fill="none"/>
  <path d="M610,338 Q614,332 618,328" stroke="#2a2420" strokeWidth="2" fill="none"/>
  {/* Warm edge-light on right side of trunk */}
  <path d="M620,385 Q618,365 615,355 Q612,345 610,335" stroke="#3a3028" strokeWidth="1" fill="none" opacity="0.35"/>
  <path d="M618,375 Q616,368 617,362" stroke="#342e28" strokeWidth="1" fill="none" opacity="0.4"/>
  <ellipse cx="610" cy="318" rx="20" ry="14" fill="url(#vtC_foliage)"/>
  <ellipse cx="596" cy="326" rx="16" ry="11" fill="url(#vtC_foliage)"/>
  <ellipse cx="624" cy="324" rx="14" ry="10" fill="url(#vtC_foliageLit)"/>
  <ellipse cx="630" cy="336" rx="12" ry="8" fill="url(#vtC_foliageLit)" opacity="0.8"/>
  <ellipse cx="600" cy="316" rx="12" ry="8" fill="#121e12" opacity="0.6"/>
  <ellipse cx="632" cy="320" rx="8" ry="5" fill="#2a3820" opacity="0.5"/>

  {/* ========================================= */}
  {/* LAYER 8: CAMPFIRE (dying embers)          */}
  {/* ========================================= */}
  {/* Ground glow (dim) */}
  <ellipse cx="680" cy="350" rx="35" ry="12" fill="url(#vtC_emberGlow)" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="3s" repeatCount="indefinite"/>
  </ellipse>

  {/* Stone ring */}
  <ellipse cx="680" cy="350" rx="18" ry="7" fill="none" stroke="#3a3438" strokeWidth="3"/>
  <circle cx="664" cy="349" r="3" fill="#3a3438"/>
  <circle cx="670" cy="344" r="2.8" fill="#383238"/>
  <circle cx="678" cy="343" r="3" fill="#3c3640"/>
  <circle cx="686" cy="344" r="2.5" fill="#383238"/>
  <circle cx="692" cy="347" r="3" fill="#3a3438"/>
  <circle cx="695" cy="352" r="2.8" fill="#383238"/>
  <circle cx="690" cy="356" r="2.5" fill="#3a3438"/>
  <circle cx="682" cy="357" r="3" fill="#3c3640"/>
  <circle cx="674" cy="357" r="2.8" fill="#383238"/>
  <circle cx="666" cy="354" r="2.5" fill="#3a3438"/>

  {/* Charred logs */}
  <line x1="670" y1="352" x2="690" y2="347" stroke="#1a1410" strokeWidth="3" strokeLinecap="round"/>
  <line x1="675" y1="346" x2="688" y2="354" stroke="#1a1410" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="672" y1="349" x2="685" y2="349" stroke="#181210" strokeWidth="2" strokeLinecap="round"/>

  {/* Ember glow */}
  <ellipse cx="680" cy="349" rx="8" ry="3" fill="url(#vtC_emberCore)" opacity="0.6">
    <animate attributeName="opacity" values="0.6;0.35;0.55;0.4;0.6" dur="4s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="676" cy="348" r="1" fill="#e08030" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.2;0.45;0.15;0.5" dur="3.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="683" cy="350" r="0.8" fill="#d07028" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.15;0.35;0.1;0.4" dur="3.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="679" cy="347" r="1.2" fill="#e89040" opacity="0.45">
    <animate attributeName="opacity" values="0.45;0.2;0.4;0.15;0.45" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="685" cy="348" r="0.7" fill="#c06020" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.1;0.3;0.1;0.35" dur="4.5s" repeatCount="indefinite"/>
  </circle>

  {/* Thin smoke wisp */}
  <path d="M680,344 Q678,334 681,322 Q684,310 679,298 Q676,286 680,274" stroke="#888888" strokeWidth="1.5" fill="none" opacity="0.08" strokeLinecap="round">
    <animate attributeName="d" values="M680,344 Q678,334 681,322 Q684,310 679,298 Q676,286 680,274;M680,344 Q682,332 679,320 Q676,308 681,296 Q684,284 680,272;M680,344 Q678,334 681,322 Q684,310 679,298 Q676,286 680,274" dur="6s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.08;0.12;0.06;0.1;0.08" dur="5s" repeatCount="indefinite"/>
  </path>
  <path d="M680,340 Q677,328 682,316 Q685,304 680,292" stroke="#999999" strokeWidth="0.8" fill="none" opacity="0.05" strokeLinecap="round">
    <animate attributeName="d" values="M680,340 Q677,328 682,316 Q685,304 680,292;M680,340 Q683,326 680,314 Q677,302 682,290;M680,340 Q677,328 682,316 Q685,304 680,292" dur="7s" repeatCount="indefinite"/>
  </path>

  {/* ========================================= */}
  {/* LAYER 8B: ADDITIONAL SKY DETAIL           */}
  {/* ========================================= */}

  {/* Additional fading stars - scattered across upper sky */}
  <circle cx="30" cy="12" r="0.6" fill="#b8b8c8" opacity="0.22">
    <animate attributeName="opacity" values="0.22;0.1;0.22" dur="5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="95" cy="8" r="0.9" fill="#c8c8d8" opacity="0.28">
    <animate attributeName="opacity" values="0.28;0.14;0.28" dur="4.3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="142" cy="28" r="0.5" fill="#b0b0c0" opacity="0.16">
    <animate attributeName="opacity" values="0.16;0.06;0.16" dur="6.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="55" cy="48" r="0.7" fill="#c0c0d0" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="5.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="230" cy="10" r="0.8" fill="#c8c8d0" opacity="0.24">
    <animate attributeName="opacity" values="0.24;0.1;0.24" dur="4.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="18" cy="42" r="0.5" fill="#b8b8c0" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="7.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="105" cy="15" r="0.6" fill="#c0c0d8" opacity="0.18">
    <animate attributeName="opacity" values="0.18;0.06;0.18" dur="5.4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="175" cy="5" r="0.7" fill="#c8c8d0" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.08;0.2" dur="6.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="260" cy="25" r="0.4" fill="#b0b0c0" opacity="0.13">
    <animate attributeName="opacity" values="0.13;0.04;0.13" dur="7.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="10" cy="70" r="0.5" fill="#a8a8b8" opacity="0.12">
    <animate attributeName="opacity" values="0.12;0.04;0.12" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="70" cy="35" r="0.8" fill="#c0c0d0" opacity="0.19">
    <animate attributeName="opacity" values="0.19;0.07;0.19" dur="5.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="195" cy="42" r="0.55" fill="#b8b8c8" opacity="0.14">
    <animate attributeName="opacity" values="0.14;0.05;0.14" dur="6.8s" repeatCount="indefinite"/>
  </circle>

  {/* Crepuscular sun rays fanning from horizon */}
  <polygon points="620,162 560,0 580,0" fill="#f0c060" opacity="0.04">
    <animate attributeName="opacity" values="0.04;0.06;0.04" dur="4s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 620,0 650,0" fill="#f0c060" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0.07;0.05" dur="3.5s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 690,0 720,0" fill="#e8b050" opacity="0.035">
    <animate attributeName="opacity" values="0.035;0.055;0.035" dur="4.5s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 480,0 510,0" fill="#e0a848" opacity="0.03">
    <animate attributeName="opacity" values="0.03;0.05;0.03" dur="5s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 750,0 780,0" fill="#d8a040" opacity="0.025">
    <animate attributeName="opacity" values="0.025;0.04;0.025" dur="4.2s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 540,40 560,40" fill="#f0c060" opacity="0.03">
    <animate attributeName="opacity" values="0.03;0.05;0.03" dur="3.8s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 670,20 695,20" fill="#e8b050" opacity="0.03">
    <animate attributeName="opacity" values="0.03;0.05;0.03" dur="4.8s" repeatCount="indefinite"/>
  </polygon>
  <polygon points="620,162 400,0 430,0" fill="#d09840" opacity="0.02">
    <animate attributeName="opacity" values="0.02;0.035;0.02" dur="5.5s" repeatCount="indefinite"/>
  </polygon>

  {/* Additional cloud layers — cirrus wisps */}
  <path d="M320,35 Q360,33 400,35 Q430,34 460,36" stroke="#d09060" strokeWidth="0.8" fill="none" opacity="0.12"/>
  <path d="M380,42 Q420,40 470,42 Q500,41 530,43" stroke="#c08858" strokeWidth="0.6" fill="none" opacity="0.1"/>
  <path d="M480,28 Q520,26 560,28 Q590,27 620,29" stroke="#d09060" strokeWidth="0.7" fill="none" opacity="0.11"/>
  <path d="M550,55 Q580,53 620,55 Q650,54 680,56" stroke="#c08050" strokeWidth="0.5" fill="none" opacity="0.08"/>
  <path d="M440,68 Q470,66 510,68 Q540,67 570,69" stroke="#c88858" strokeWidth="0.6" fill="none" opacity="0.09"/>
  <path d="M620,38 Q660,36 700,38 Q730,37 760,39" stroke="#d09060" strokeWidth="0.7" fill="none" opacity="0.1"/>
  <path d="M350,48 Q380,46 420,48 Q445,47 470,49" stroke="#c08050" strokeWidth="0.5" fill="none" opacity="0.08"/>

  {/* Pink-lit cumulus banks near horizon */}
  <ellipse cx="480" cy="110" rx="45" ry="6" fill="#8a5040" opacity="0.12"/>
  <ellipse cx="480" cy="108" rx="40" ry="5" fill="#b06848" opacity="0.08"/>
  <ellipse cx="560" cy="115" rx="35" ry="5" fill="#8a5040" opacity="0.1"/>
  <ellipse cx="560" cy="113" rx="30" ry="4" fill="#b86848" opacity="0.07"/>
  <ellipse cx="660" cy="105" rx="50" ry="7" fill="#905040" opacity="0.13"/>
  <ellipse cx="660" cy="103" rx="45" ry="5.5" fill="#b87050" opacity="0.09"/>
  <ellipse cx="350" cy="120" rx="40" ry="5" fill="#7a4838" opacity="0.08"/>
  <ellipse cx="740" cy="112" rx="35" ry="5" fill="#905040" opacity="0.1"/>
  <ellipse cx="740" cy="110" rx="30" ry="4" fill="#b06848" opacity="0.07"/>

  {/* ========================================= */}
  {/* LAYER 8C: ENHANCED SEA DETAIL             */}
  {/* ========================================= */}

  {/* Additional wave lines with varying depth */}
  <path d="M0,172 Q80,170 160,172 Q240,174 320,171 Q400,173 480,171 Q560,173 640,171 Q720,173 800,172" stroke="#6a5848" strokeWidth="0.3" fill="none" opacity="0.2"/>
  <path d="M0,175 Q60,173 120,175 Q200,177 280,174 Q360,176 440,174 Q520,176 600,175 Q680,177 760,175 L800,176" stroke="#5a5040" strokeWidth="0.35" fill="none" opacity="0.22"/>
  <path d="M0,188 Q100,186 200,188 Q280,190 360,187 Q440,189 520,187 Q600,189 680,187 Q760,189 800,188" stroke="#4a4230" strokeWidth="0.3" fill="none" opacity="0.18"/>
  <path d="M0,195 Q140,193 280,195 Q420,197 560,194 Q700,196 800,195" stroke="#3a3828" strokeWidth="0.25" fill="none" opacity="0.14"/>
  <path d="M0,204 Q180,202 360,204 Q540,206 720,203 L800,204" stroke="#2a2820" strokeWidth="0.2" fill="none" opacity="0.1"/>

  {/* Rocky shore detail along coastline */}
  <path d="M120,208 Q125,205 135,207 Q140,204 148,206 Q155,203 162,206 Q168,208 175,210" fill="#1a1828" opacity="0.8"/>
  <path d="M530,206 Q538,203 545,205 Q552,202 558,204 Q565,202 572,205 Q578,207 585,209" fill="#1e1c30" opacity="0.75"/>
  <path d="M240,209 Q245,207 252,208 Q258,206 264,208 L268,210" fill="#1a1828" opacity="0.7"/>
  <path d="M172,209 Q178,207 185,208 Q192,206 200,209" fill="#1c1a2a" opacity="0.65"/>

  {/* Foam/surf along the rocky shore */}
  <path d="M125,207 Q130,206 138,207 Q145,205 152,207 Q160,205 168,208" stroke="#6a6870" strokeWidth="0.5" fill="none" opacity="0.15"/>
  <path d="M535,205 Q542,204 548,205 Q555,203 562,205 Q568,203 575,206" stroke="#6a6870" strokeWidth="0.5" fill="none" opacity="0.13"/>
  <path d="M245,208 Q250,207 256,208 Q262,206 268,209" stroke="#6a6870" strokeWidth="0.4" fill="none" opacity="0.12"/>

  {/* Distant ships on the sea */}
  {/* Merchant vessel 1 — far right */}
  <path d="M720,182 L722,182 L724,180 L726,182 L728,182" stroke="#2a2830" strokeWidth="0.8" fill="none" opacity="0.35"/>
  <line x1="724" y1="180" x2="724" y2="175" stroke="#2a2830" strokeWidth="0.5" opacity="0.3"/>
  <path d="M722,176 Q724,175 726,176" stroke="#3a3038" strokeWidth="0.4" fill="none" opacity="0.25"/>
  <path d="M723,178 Q724,177 725,178" stroke="#3a3038" strokeWidth="0.3" fill="none" opacity="0.2"/>

  {/* Merchant vessel 2 — center-left */}
  <path d="M380,186 L383,186 L386,184 L389,186 L392,186" stroke="#2a2830" strokeWidth="0.7" fill="none" opacity="0.28"/>
  <line x1="386" y1="184" x2="386" y2="179" stroke="#2a2830" strokeWidth="0.4" opacity="0.25"/>
  <path d="M384,180 Q386,179 388,180" stroke="#3a3038" strokeWidth="0.35" fill="none" opacity="0.2"/>

  {/* Warship silhouette — far left */}
  <path d="M280,190 L284,190 L287,188 L290,186 L294,188 L297,190 L300,190" stroke="#1e1c28" strokeWidth="0.9" fill="none" opacity="0.22"/>
  <line x1="290" y1="186" x2="290" y2="180" stroke="#1e1c28" strokeWidth="0.5" opacity="0.2"/>
  <line x1="287" y1="188" x2="287" y2="183" stroke="#1e1c28" strokeWidth="0.4" opacity="0.18"/>
  <line x1="294" y1="188" x2="294" y2="183" stroke="#1e1c28" strokeWidth="0.4" opacity="0.18"/>
  <path d="M288,182 Q290,181 292,182" stroke="#2a2430" strokeWidth="0.3" fill="none" opacity="0.15"/>

  {/* Additional shimmer spots on water */}
  <ellipse cx="540" cy="176" rx="10" ry="0.9" fill="#e0a848" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.06;0.15" dur="3.2s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="660" cy="182" rx="7" ry="0.6" fill="#d09840" opacity="0.12">
    <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2.6s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="610" cy="190" rx="14" ry="1" fill="#c89038" opacity="0.1">
    <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="570" cy="186" rx="9" ry="0.7" fill="#d0a040" opacity="0.1">
    <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.9s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="640" cy="194" rx="12" ry="0.8" fill="#b88830" opacity="0.08">
    <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3.5s" repeatCount="indefinite"/>
  </ellipse>

  {/* ========================================= */}
  {/* LAYER 8D: TERRACED HILLSIDE DETAIL        */}
  {/* ========================================= */}

  {/* Terraced vineyard walls descending the slope */}
  <path d="M0,228 Q50,224 100,226 Q150,222 200,225 Q250,221 300,224" stroke="#2a2430" strokeWidth="1.5" fill="none" opacity="0.4"/>
  <path d="M0,240 Q60,236 120,238 Q180,234 240,237 Q300,233 360,236" stroke="#282230" strokeWidth="1.2" fill="none" opacity="0.35"/>
  <path d="M0,252 Q70,248 140,250 Q210,246 280,249 Q350,245 420,248" stroke="#262030" strokeWidth="1" fill="none" opacity="0.3"/>
  <path d="M0,265 Q80,261 160,263 Q240,259 320,262 Q400,258 480,261" stroke="#242030" strokeWidth="0.8" fill="none" opacity="0.25"/>

  {/* Right-side terraces (sunlit) */}
  <path d="M500,225 Q550,222 600,224 Q650,220 700,223 Q750,219 800,222" stroke="#3a3030" strokeWidth="1.5" fill="none" opacity="0.4"/>
  <path d="M480,237 Q530,234 580,236 Q630,232 680,235 Q730,231 780,234 L800,235" stroke="#383030" strokeWidth="1.2" fill="none" opacity="0.35"/>
  <path d="M460,249 Q510,246 560,248 Q610,244 660,247 Q710,243 760,246 L800,247" stroke="#342c30" strokeWidth="1" fill="none" opacity="0.3"/>
  <path d="M440,262 Q490,259 540,261 Q590,257 640,260 Q690,256 740,259 L800,260" stroke="#302a30" strokeWidth="0.8" fill="none" opacity="0.25"/>

  {/* Vineyard vegetation on terraces */}
  <ellipse cx="60" cy="232" rx="8" ry="3" fill="#141c14" opacity="0.3"/>
  <ellipse cx="110" cy="228" rx="10" ry="3.5" fill="#161e14" opacity="0.28"/>
  <ellipse cx="170" cy="230" rx="7" ry="2.5" fill="#141c14" opacity="0.25"/>
  <ellipse cx="220" cy="226" rx="9" ry="3" fill="#151d14" opacity="0.27"/>
  <ellipse cx="280" cy="228" rx="8" ry="3" fill="#141c14" opacity="0.22"/>
  <ellipse cx="50" cy="244" rx="7" ry="2.5" fill="#131b12" opacity="0.25"/>
  <ellipse cx="120" cy="240" rx="9" ry="3" fill="#151d14" opacity="0.23"/>
  <ellipse cx="190" cy="238" rx="8" ry="3" fill="#141c14" opacity="0.22"/>
  <ellipse cx="260" cy="236" rx="10" ry="3.5" fill="#161e14" opacity="0.24"/>
  <ellipse cx="340" cy="240" rx="7" ry="2.5" fill="#141c14" opacity="0.2"/>

  {/* Sunlit vineyard rows (right side) */}
  <ellipse cx="520" cy="228" rx="9" ry="3" fill="#1a2418" opacity="0.3"/>
  <ellipse cx="580" cy="225" rx="11" ry="3.5" fill="#1c2618" opacity="0.32"/>
  <ellipse cx="640" cy="227" rx="8" ry="3" fill="#1a2418" opacity="0.28"/>
  <ellipse cx="700" cy="224" rx="10" ry="3" fill="#1e2818" opacity="0.3"/>
  <ellipse cx="760" cy="222" rx="7" ry="2.5" fill="#1a2418" opacity="0.25"/>
  <ellipse cx="500" cy="241" rx="8" ry="2.5" fill="#182216" opacity="0.25"/>
  <ellipse cx="560" cy="238" rx="10" ry="3" fill="#1a2418" opacity="0.27"/>
  <ellipse cx="630" cy="236" rx="9" ry="3" fill="#1c2618" opacity="0.28"/>
  <ellipse cx="690" cy="234" rx="8" ry="2.5" fill="#1a2418" opacity="0.24"/>
  <ellipse cx="750" cy="232" rx="10" ry="3" fill="#1e2818" opacity="0.26"/>

  {/* Stone wall details — mortar lines */}
  <line x1="50" y1="228" x2="50" y2="232" stroke="#1e1a28" strokeWidth="0.5" opacity="0.3"/>
  <line x1="100" y1="226" x2="100" y2="230" stroke="#1e1a28" strokeWidth="0.5" opacity="0.3"/>
  <line x1="150" y1="224" x2="150" y2="228" stroke="#1e1a28" strokeWidth="0.5" opacity="0.3"/>
  <line x1="200" y1="225" x2="200" y2="229" stroke="#1e1a28" strokeWidth="0.5" opacity="0.3"/>
  <line x1="250" y1="223" x2="250" y2="227" stroke="#1e1a28" strokeWidth="0.5" opacity="0.3"/>
  <line x1="550" y1="224" x2="550" y2="228" stroke="#2a2430" strokeWidth="0.5" opacity="0.3"/>
  <line x1="600" y1="224" x2="600" y2="228" stroke="#2a2430" strokeWidth="0.5" opacity="0.3"/>
  <line x1="650" y1="222" x2="650" y2="226" stroke="#2a2430" strokeWidth="0.5" opacity="0.3"/>
  <line x1="700" y1="223" x2="700" y2="227" stroke="#2a2430" strokeWidth="0.5" opacity="0.3"/>
  <line x1="750" y1="221" x2="750" y2="225" stroke="#2a2430" strokeWidth="0.5" opacity="0.3"/>

  {/* ========================================= */}
  {/* LAYER 8E: CYPRESS TREES ON RIDGELINE      */}
  {/* ========================================= */}

  {/* Cypress 1 — far left ridgeline, dark silhouette */}
  <path d="M25,322 L25,285 Q25,275 24,270 Q23,265 25,260 Q27,265 26,270 Q25,275 25,285 Z" fill="#0e1612" opacity="0.8"/>
  <ellipse cx="25" cy="262" rx="4" ry="10" fill="#0e1612" opacity="0.75"/>
  <ellipse cx="25" cy="270" rx="5" ry="12" fill="#101814" opacity="0.7"/>
  <ellipse cx="25" cy="280" rx="4.5" ry="10" fill="#0e1612" opacity="0.65"/>
  <ellipse cx="25" cy="290" rx="3.5" ry="8" fill="#101814" opacity="0.6"/>

  {/* Cypress 2 — near left, taller */}
  <path d="M70,318 L70,272 Q70,260 69,252 Q68,245 70,238 Q72,245 71,252 Q70,260 70,272 Z" fill="#0e1612" opacity="0.85"/>
  <ellipse cx="70" cy="240" rx="4.5" ry="12" fill="#0e1612" opacity="0.8"/>
  <ellipse cx="70" cy="250" rx="5.5" ry="14" fill="#101814" opacity="0.75"/>
  <ellipse cx="70" cy="262" rx="5" ry="12" fill="#0e1612" opacity="0.7"/>
  <ellipse cx="70" cy="274" rx="4.5" ry="10" fill="#101814" opacity="0.65"/>
  <ellipse cx="70" cy="285" rx="3.5" ry="8" fill="#0e1612" opacity="0.55"/>

  {/* Cypress 3 — right side, catching warm light */}
  <path d="M740,328 L740,280 Q740,268 739,260 Q738,252 740,245 Q742,252 741,260 Q740,268 740,280 Z" fill="#121a14" opacity="0.8"/>
  <ellipse cx="740" cy="248" rx="4.5" ry="11" fill="#121a14" opacity="0.75"/>
  <ellipse cx="740" cy="258" rx="5.5" ry="13" fill="#141c16" opacity="0.7"/>
  <ellipse cx="740" cy="270" rx="5" ry="12" fill="#121a14" opacity="0.65"/>
  <ellipse cx="740" cy="282" rx="4" ry="9" fill="#141c16" opacity="0.55"/>
  {/* Warm edge on right side */}
  <ellipse cx="742" cy="258" rx="2.5" ry="13" fill="#1e2818" opacity="0.3"/>
  <ellipse cx="742" cy="270" rx="2" ry="12" fill="#1e2818" opacity="0.25"/>

  {/* Cypress 4 — far right */}
  <path d="M780,330 L780,290 Q780,278 779,272 Q778,266 780,260 Q782,266 781,272 Q780,278 780,290 Z" fill="#121a14" opacity="0.75"/>
  <ellipse cx="780" cy="262" rx="4" ry="10" fill="#121a14" opacity="0.7"/>
  <ellipse cx="780" cy="272" rx="5" ry="12" fill="#141c16" opacity="0.65"/>
  <ellipse cx="780" cy="284" rx="4" ry="9" fill="#121a14" opacity="0.55"/>
  {/* Warm edge */}
  <ellipse cx="782" cy="272" rx="2" ry="12" fill="#1e2818" opacity="0.25"/>

  {/* Cypress 5 — mid-left group */}
  <path d="M110,325 L110,288 Q110,278 109,272 Q108,266 110,260 Q112,266 111,272 Q110,278 110,288 Z" fill="#0e1612" opacity="0.7"/>
  <ellipse cx="110" cy="262" rx="4" ry="10" fill="#0e1612" opacity="0.65"/>
  <ellipse cx="110" cy="272" rx="5" ry="12" fill="#101814" opacity="0.6"/>
  <ellipse cx="110" cy="283" rx="4" ry="9" fill="#0e1612" opacity="0.5"/>

  {/* ========================================= */}
  {/* LAYER 8F: ADDITIONAL OLIVE TREES          */}
  {/* ========================================= */}

  {/* Olive tree 3 — left foreground, gnarled */}
  <path d="M90,390 Q88,375 85,365 Q83,358 80,350 Q78,345 82,340" stroke="#2a2420" strokeWidth="3.5" fill="none"/>
  <path d="M85,365 Q90,358 95,354" stroke="#2a2420" strokeWidth="2" fill="none"/>
  <path d="M82,355 Q77,348 74,344" stroke="#2a2420" strokeWidth="2" fill="none"/>
  <path d="M80,350 Q76,346 78,340" stroke="#342e28" strokeWidth="0.8" fill="none" opacity="0.3"/>
  <ellipse cx="80" cy="336" rx="16" ry="10" fill="url(#vtC_foliage)"/>
  <ellipse cx="68" cy="342" rx="12" ry="8" fill="url(#vtC_foliage)"/>
  <ellipse cx="92" cy="340" rx="11" ry="7" fill="url(#vtC_foliage)"/>
  <ellipse cx="96" cy="350" rx="9" ry="6" fill="#0e1a10" opacity="0.65"/>
  <ellipse cx="72" cy="334" rx="8" ry="6" fill="#121e12" opacity="0.5"/>

  {/* Olive tree 4 — center, near path */}
  <path d="M380,388 Q378,370 376,362 Q374,354 373,348 Q372,342 375,336" stroke="#2a2420" strokeWidth="3.5" fill="none"/>
  <path d="M376,362 Q380,356 384,352" stroke="#2a2420" strokeWidth="2" fill="none"/>
  <path d="M374,354 Q370,348 367,344" stroke="#2a2420" strokeWidth="1.8" fill="none"/>
  <ellipse cx="374" cy="332" rx="15" ry="10" fill="url(#vtC_foliage)"/>
  <ellipse cx="362" cy="338" rx="12" ry="8" fill="url(#vtC_foliage)"/>
  <ellipse cx="384" cy="336" rx="11" ry="8" fill="url(#vtC_foliage)"/>
  <ellipse cx="388" cy="346" rx="9" ry="6" fill="#0e1a10" opacity="0.6"/>
  <ellipse cx="366" cy="330" rx="8" ry="5" fill="#121e12" opacity="0.5"/>

  {/* Olive tree 5 — right foreground, large, well-lit */}
  <path d="M710,395 Q708,378 706,368 Q704,358 702,350 Q700,343 704,337" stroke="#2a2420" strokeWidth="4" fill="none"/>
  <path d="M706,368 Q712,360 718,354" stroke="#2a2420" strokeWidth="2.5" fill="none"/>
  <path d="M704,358 Q698,350 694,344" stroke="#2a2420" strokeWidth="2.5" fill="none"/>
  {/* Warm edge-light on trunk */}
  <path d="M710,395 Q708,378 706,368 Q704,358 702,350" stroke="#3a3028" strokeWidth="1" fill="none" opacity="0.35"/>
  <ellipse cx="702" cy="332" rx="18" ry="12" fill="url(#vtC_foliage)"/>
  <ellipse cx="688" cy="340" rx="14" ry="10" fill="url(#vtC_foliage)"/>
  <ellipse cx="716" cy="338" rx="13" ry="9" fill="url(#vtC_foliageLit)"/>
  <ellipse cx="722" cy="348" rx="11" ry="7" fill="url(#vtC_foliageLit)" opacity="0.75"/>
  <ellipse cx="692" cy="330" rx="10" ry="7" fill="#121e12" opacity="0.55"/>
  <ellipse cx="724" cy="334" rx="7" ry="5" fill="#2a3820" opacity="0.45"/>

  {/* ========================================= */}
  {/* LAYER 8G: WILD HERBS & GROUND FLORA       */}
  {/* ========================================= */}

  {/* Rosemary bushes — aromatic Mediterranean scrub */}
  <ellipse cx="40" cy="375" rx="10" ry="4" fill="#1a2218" opacity="0.45"/>
  <path d="M35,374 Q37,368 39,374" stroke="#1e2a18" strokeWidth="0.7" fill="none" opacity="0.35"/>
  <path d="M38,374 Q40,367 42,374" stroke="#1a2618" strokeWidth="0.6" fill="none" opacity="0.3"/>
  <path d="M41,374 Q43,369 45,374" stroke="#1e2a18" strokeWidth="0.7" fill="none" opacity="0.35"/>

  <ellipse cx="260" cy="348" rx="8" ry="3.5" fill="#182218" opacity="0.4"/>
  <path d="M256,347 Q258,341 260,347" stroke="#1e2a18" strokeWidth="0.6" fill="none" opacity="0.3"/>
  <path d="M259,347 Q261,340 263,347" stroke="#1a2618" strokeWidth="0.5" fill="none" opacity="0.28"/>

  <ellipse cx="550" cy="340" rx="9" ry="3.5" fill="#1a2418" opacity="0.42"/>
  <path d="M546,339 Q548,333 550,339" stroke="#222e1a" strokeWidth="0.7" fill="none" opacity="0.35"/>
  <path d="M549,339 Q551,332 553,339" stroke="#1e2a18" strokeWidth="0.6" fill="none" opacity="0.3"/>
  <path d="M552,339 Q554,334 556,339" stroke="#222e1a" strokeWidth="0.6" fill="none" opacity="0.3"/>

  {/* Thyme patches — low-growing ground cover */}
  <ellipse cx="130" cy="358" rx="6" ry="2" fill="#1a2018" opacity="0.3"/>
  <ellipse cx="220" cy="355" rx="5" ry="1.8" fill="#182018" opacity="0.28"/>
  <ellipse cx="340" cy="342" rx="7" ry="2.5" fill="#1a2218" opacity="0.32"/>
  <ellipse cx="460" cy="338" rx="5.5" ry="2" fill="#1c2218" opacity="0.28"/>
  <ellipse cx="580" cy="335" rx="6" ry="2.2" fill="#1e2418" opacity="0.3"/>
  <ellipse cx="660" cy="340" rx="5" ry="1.8" fill="#1c2218" opacity="0.28"/>

  {/* Additional grass tufts */}
  <path d="M200,355 Q202,345 204,355" stroke="#1e2a18" strokeWidth="0.8" fill="none" opacity="0.4"/>
  <path d="M202,355 Q205,343 208,355" stroke="#1a2618" strokeWidth="0.6" fill="none" opacity="0.35"/>
  <path d="M290,345 Q292,336 294,345" stroke="#1e2a18" strokeWidth="0.8" fill="none" opacity="0.4"/>
  <path d="M292,345 Q295,334 298,345" stroke="#1a2618" strokeWidth="0.6" fill="none" opacity="0.35"/>
  <path d="M420,335 Q422,326 424,335" stroke="#1e2a18" strokeWidth="0.8" fill="none" opacity="0.4"/>
  <path d="M422,335 Q425,324 428,335" stroke="#1a2618" strokeWidth="0.6" fill="none" opacity="0.35"/>
  <path d="M560,332 Q562,323 564,332" stroke="#222e1a" strokeWidth="0.8" fill="none" opacity="0.4"/>
  <path d="M562,332 Q565,321 568,332" stroke="#1e2a18" strokeWidth="0.6" fill="none" opacity="0.35"/>
  <path d="M650,338 Q652,328 654,338" stroke="#222e1a" strokeWidth="0.8" fill="none" opacity="0.4"/>
  <path d="M652,338 Q655,327 658,338" stroke="#1e2a18" strokeWidth="0.6" fill="none" opacity="0.35"/>

  {/* Small flowering herbs — tiny white/yellow dots */}
  <circle cx="42" cy="372" r="0.6" fill="#e0d8b0" opacity="0.18"/>
  <circle cx="45" cy="373" r="0.5" fill="#e0d8b0" opacity="0.15"/>
  <circle cx="262" cy="346" r="0.5" fill="#e0d8b0" opacity="0.14"/>
  <circle cx="265" cy="347" r="0.4" fill="#d8d0a8" opacity="0.12"/>
  <circle cx="552" cy="338" r="0.5" fill="#e0d8b0" opacity="0.15"/>
  <circle cx="555" cy="339" r="0.4" fill="#d8d0a8" opacity="0.12"/>
  <circle cx="342" cy="340" r="0.5" fill="#e0d8b0" opacity="0.13"/>
  <circle cx="462" cy="336" r="0.4" fill="#e0d8b0" opacity="0.12"/>

  {/* Additional rocky ground detail */}
  <path d="M160,365 Q165,358 172,360 Q178,356 184,360 Q186,365 180,368 Q170,370 162,367 Z" fill="#2a2630" opacity="0.5"/>
  <path d="M320,350 Q325,344 332,346 Q337,342 342,345 Q344,350 338,353 Q330,355 322,352 Z" fill="#282430" opacity="0.45"/>
  <path d="M450,340 Q454,334 460,336 Q465,332 470,335 Q472,340 466,343 Q458,345 452,342 Z" fill="#2a2630" opacity="0.45"/>
  <path d="M580,338 Q584,332 590,334 Q594,330 598,333 Q600,338 594,341 Q588,343 582,340 Z" fill="#2c2830" opacity="0.4"/>

  {/* Loose pebbles and stones */}
  <circle cx="135" cy="362" r="1.2" fill="#2a2630" opacity="0.35"/>
  <circle cx="138" cy="364" r="0.8" fill="#282430" opacity="0.3"/>
  <circle cx="245" cy="352" r="1" fill="#282430" opacity="0.32"/>
  <circle cx="248" cy="354" r="0.7" fill="#2a2630" opacity="0.28"/>
  <circle cx="410" cy="340" r="1.1" fill="#2a2630" opacity="0.3"/>
  <circle cx="413" cy="342" r="0.8" fill="#282430" opacity="0.25"/>
  <circle cx="535" cy="338" r="0.9" fill="#2a2630" opacity="0.28"/>
  <circle cx="538" cy="340" r="0.6" fill="#282430" opacity="0.25"/>
  <circle cx="670" cy="342" r="1" fill="#2c2830" opacity="0.3"/>
  <circle cx="673" cy="344" r="0.7" fill="#2a2630" opacity="0.25"/>

  {/* ========================================= */}
  {/* LAYER 8H: MILITARY CAMP — CAMPFIRES       */}
  {/* ========================================= */}

  {/* === CAMPFIRE 2 (left foreground) === */}
  {/* Ground glow */}
  <ellipse cx="240" cy="370" rx="28" ry="10" fill="url(#vtC_emberGlow)" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.28;0.4" dur="3.5s" repeatCount="indefinite"/>
  </ellipse>
  {/* Stone ring */}
  <ellipse cx="240" cy="370" rx="14" ry="5.5" fill="none" stroke="#3a3438" strokeWidth="2.5"/>
  <circle cx="228" cy="369" r="2.5" fill="#3a3438"/>
  <circle cx="233" cy="365" r="2.2" fill="#383238"/>
  <circle cx="239" cy="364" r="2.5" fill="#3c3640"/>
  <circle cx="245" cy="365" r="2" fill="#383238"/>
  <circle cx="250" cy="368" r="2.5" fill="#3a3438"/>
  <circle cx="252" cy="372" r="2.2" fill="#383238"/>
  <circle cx="248" cy="376" r="2" fill="#3a3438"/>
  <circle cx="241" cy="377" r="2.5" fill="#3c3640"/>
  <circle cx="234" cy="376" r="2.2" fill="#383238"/>
  <circle cx="229" cy="373" r="2" fill="#3a3438"/>
  {/* Charred logs */}
  <line x1="232" y1="372" x2="248" y2="368" stroke="#1a1410" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="236" y1="366" x2="246" y2="374" stroke="#1a1410" strokeWidth="2" strokeLinecap="round"/>
  {/* Ember glow */}
  <ellipse cx="240" cy="370" rx="6" ry="2.5" fill="url(#vtC_emberCore)" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.3;0.45;0.25;0.5" dur="4.5s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="237" cy="369" r="0.8" fill="#e08030" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.15;0.35;0.1;0.4" dur="3.4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="243" cy="371" r="0.7" fill="#d07028" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.1;0.3;0.08;0.35" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="240" cy="368" r="1" fill="#e89040" opacity="0.38">
    <animate attributeName="opacity" values="0.38;0.15;0.33;0.1;0.38" dur="3s" repeatCount="indefinite"/>
  </circle>
  {/* Smoke wisp */}
  <path d="M240,365 Q238,355 241,343 Q244,331 239,319" stroke="#888888" strokeWidth="1.2" fill="none" opacity="0.06" strokeLinecap="round">
    <animate attributeName="d" values="M240,365 Q238,355 241,343 Q244,331 239,319;M240,365 Q242,353 239,341 Q236,329 241,317;M240,365 Q238,355 241,343 Q244,331 239,319" dur="7s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.06;0.09;0.04;0.08;0.06" dur="5.5s" repeatCount="indefinite"/>
  </path>

  {/* === CAMPFIRE 3 (center-right, near bivouacs) === */}
  {/* Ground glow */}
  <ellipse cx="470" cy="358" rx="25" ry="9" fill="url(#vtC_emberGlow)" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.22;0.35" dur="4s" repeatCount="indefinite"/>
  </ellipse>
  {/* Stone ring */}
  <ellipse cx="470" cy="358" rx="12" ry="5" fill="none" stroke="#3a3438" strokeWidth="2"/>
  <circle cx="460" cy="357" r="2.2" fill="#3a3438"/>
  <circle cx="464" cy="354" r="2" fill="#383238"/>
  <circle cx="470" cy="353" r="2.2" fill="#3c3640"/>
  <circle cx="476" cy="354" r="2" fill="#383238"/>
  <circle cx="480" cy="357" r="2.2" fill="#3a3438"/>
  <circle cx="479" cy="362" r="2" fill="#383238"/>
  <circle cx="474" cy="364" r="2.2" fill="#3a3438"/>
  <circle cx="468" cy="364" r="2" fill="#3c3640"/>
  <circle cx="462" cy="362" r="2" fill="#383238"/>
  {/* Charred logs */}
  <line x1="464" y1="360" x2="477" y2="356" stroke="#1a1410" strokeWidth="2.2" strokeLinecap="round"/>
  <line x1="467" y1="355" x2="475" y2="361" stroke="#1a1410" strokeWidth="1.8" strokeLinecap="round"/>
  {/* Ember glow */}
  <ellipse cx="470" cy="358" rx="5" ry="2" fill="url(#vtC_emberCore)" opacity="0.45">
    <animate attributeName="opacity" values="0.45;0.25;0.4;0.2;0.45" dur="5s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="468" cy="357" r="0.7" fill="#e08030" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.12;0.3;0.08;0.35" dur="3.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="473" cy="359" r="0.6" fill="#d07028" opacity="0.3">
    <animate attributeName="opacity" values="0.3;0.1;0.25;0.07;0.3" dur="4.2s" repeatCount="indefinite"/>
  </circle>
  {/* Smoke wisp */}
  <path d="M470,353 Q468,343 471,331 Q474,319 469,307" stroke="#888888" strokeWidth="1" fill="none" opacity="0.05" strokeLinecap="round">
    <animate attributeName="d" values="M470,353 Q468,343 471,331 Q474,319 469,307;M470,353 Q472,341 469,329 Q466,317 471,305;M470,353 Q468,343 471,331 Q474,319 469,307" dur="8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.05;0.08;0.03;0.07;0.05" dur="6s" repeatCount="indefinite"/>
  </path>

  {/* === CAMPFIRE 4 (far background, on slope) === */}
  <ellipse cx="350" cy="328" rx="15" ry="5" fill="url(#vtC_emberGlow)" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.12;0.2" dur="4.5s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="350" cy="328" rx="4" ry="1.5" fill="url(#vtC_emberCore)" opacity="0.25">
    <animate attributeName="opacity" values="0.25;0.12;0.2;0.1;0.25" dur="5.5s" repeatCount="indefinite"/>
  </ellipse>
  <path d="M350,326 Q348,318 351,308 Q354,298 349,288" stroke="#888888" strokeWidth="0.7" fill="none" opacity="0.04" strokeLinecap="round">
    <animate attributeName="d" values="M350,326 Q348,318 351,308 Q354,298 349,288;M350,326 Q352,316 349,306 Q346,296 351,286;M350,326 Q348,318 351,308 Q354,298 349,288" dur="9s" repeatCount="indefinite"/>
  </path>

  {/* ========================================= */}
  {/* LAYER 8I: STACKED MUSKET PYRAMIDS         */}
  {/* ========================================= */}

  {/* Musket pyramid 1 — near campfire 2 (left) */}
  <line x1="210" y1="378" x2="215" y2="355" stroke="#2a2420" strokeWidth="1.2"/>
  <line x1="220" y1="378" x2="215" y2="355" stroke="#2a2420" strokeWidth="1.2"/>
  <line x1="215" y1="378" x2="215" y2="355" stroke="#282220" strokeWidth="1"/>
  <circle cx="215" cy="354" r="1.2" fill="#3a3438" opacity="0.6"/>
  {/* Bayonet glints */}
  <line x1="215" y1="355" x2="214" y2="350" stroke="#6a6870" strokeWidth="0.4" opacity="0.25"/>
  <line x1="215" y1="355" x2="216" y2="350" stroke="#6a6870" strokeWidth="0.4" opacity="0.2"/>

  {/* Musket pyramid 2 — near campfire 1 (original, right) */}
  <line x1="650" y1="362" x2="655" y2="340" stroke="#2a2420" strokeWidth="1.2"/>
  <line x1="660" y1="362" x2="655" y2="340" stroke="#2a2420" strokeWidth="1.2"/>
  <line x1="655" y1="362" x2="655" y2="340" stroke="#282220" strokeWidth="1"/>
  <circle cx="655" cy="339" r="1.2" fill="#3a3438" opacity="0.6"/>
  <line x1="655" y1="340" x2="654" y2="335" stroke="#6a6870" strokeWidth="0.4" opacity="0.25"/>
  <line x1="655" y1="340" x2="656" y2="335" stroke="#6a6870" strokeWidth="0.4" opacity="0.2"/>

  {/* Musket pyramid 3 — near campfire 3 (center) */}
  <line x1="490" y1="367" x2="495" y2="346" stroke="#2a2420" strokeWidth="1.2"/>
  <line x1="500" y1="367" x2="495" y2="346" stroke="#2a2420" strokeWidth="1.2"/>
  <line x1="495" y1="367" x2="495" y2="346" stroke="#282220" strokeWidth="1"/>
  <circle cx="495" cy="345" r="1.2" fill="#3a3438" opacity="0.6"/>
  <line x1="495" y1="346" x2="494" y2="341" stroke="#6a6870" strokeWidth="0.4" opacity="0.25"/>
  <line x1="495" y1="346" x2="496" y2="341" stroke="#6a6870" strokeWidth="0.4" opacity="0.2"/>

  {/* Musket pyramid 4 — background */}
  <line x1="330" y1="342" x2="334" y2="325" stroke="#2a2420" strokeWidth="1"/>
  <line x1="338" y1="342" x2="334" y2="325" stroke="#2a2420" strokeWidth="1"/>
  <line x1="334" y1="342" x2="334" y2="325" stroke="#282220" strokeWidth="0.8"/>
  <circle cx="334" cy="324" r="1" fill="#3a3438" opacity="0.5"/>

  {/* ========================================= */}
  {/* LAYER 8J: SLEEPING SOLDIERS / BIVOUACS    */}
  {/* ========================================= */}

  {/* === Bivouac group 1 — near campfire 2 (left) === */}
  {/* Soldier 1: lying on side, wrapped in blanket */}
  <ellipse cx="260" cy="378" rx="12" ry="4" fill="#1e1c28" opacity="0.7"/>
  <path d="M250,380 Q252,374 260,373 Q268,374 270,380" fill="#2a2840" opacity="0.6"/>
  <circle cx="252" cy="375" r="2.5" fill="#2a2430" opacity="0.55"/>
  {/* Pack next to soldier */}
  <rect x="272" y="374" width="6" height="5" fill="#2a2420" rx="1" opacity="0.5"/>

  {/* Soldier 2: sleeping on back, blanket pulled up */}
  <ellipse cx="225" cy="384" rx="11" ry="3.5" fill="#1e1c28" opacity="0.65"/>
  <path d="M215,386 Q218,380 225,379 Q232,380 235,386" fill="#28283e" opacity="0.55"/>
  <circle cx="217" cy="381" r="2.2" fill="#2a2430" opacity="0.5"/>

  {/* Soldier 3: curled up, feet toward fire */}
  <ellipse cx="248" cy="385" rx="10" ry="3" fill="#1e1c28" opacity="0.6"/>
  <path d="M240,387 Q243,382 248,381 Q253,382 256,387" fill="#2a2640" opacity="0.5"/>
  <circle cx="255" cy="383" r="2" fill="#2a2430" opacity="0.5"/>

  {/* === Bivouac group 2 — near campfire 3 (center-right) === */}
  {/* Soldier 4: lying on stomach */}
  <ellipse cx="455" cy="368" rx="11" ry="3.5" fill="#1e1c28" opacity="0.65"/>
  <path d="M445,370 Q448,364 455,363 Q462,364 465,370" fill="#282840" opacity="0.55"/>
  <circle cx="447" cy="365" r="2.3" fill="#2a2430" opacity="0.5"/>
  {/* Cartridge box next to soldier */}
  <rect x="466" y="365" width="4" height="3.5" fill="#1a1820" rx="0.5" opacity="0.5"/>

  {/* Soldier 5: on side, facing campfire */}
  <ellipse cx="485" cy="372" rx="10" ry="3" fill="#1e1c28" opacity="0.6"/>
  <path d="M477,374 Q479,368 485,367 Q491,368 493,374" fill="#2a2840" opacity="0.5"/>
  <circle cx="478" cy="369" r="2" fill="#2a2430" opacity="0.5"/>

  {/* === Bivouac group 3 — near original campfire (right) === */}
  {/* Soldier 6: on side */}
  <ellipse cx="698" cy="360" rx="11" ry="3.5" fill="#1e1c28" opacity="0.65"/>
  <path d="M688,362 Q691,356 698,355 Q705,356 708,362" fill="#282640" opacity="0.55"/>
  <circle cx="690" cy="357" r="2.3" fill="#2a2430" opacity="0.5"/>

  {/* Soldier 7: curled up */}
  <ellipse cx="665" cy="365" rx="9" ry="3" fill="#1e1c28" opacity="0.6"/>
  <path d="M657,367 Q660,362 665,361 Q670,362 673,367" fill="#2a2840" opacity="0.5"/>
  <circle cx="672" cy="363" r="2" fill="#2a2430" opacity="0.5"/>

  {/* === Drummer boy curled in blanket (near campfire 3) === */}
  <ellipse cx="448" cy="375" rx="7" ry="2.8" fill="#1e1c28" opacity="0.6"/>
  <path d="M442,377 Q444,372 448,371 Q452,372 454,377" fill="#2a2840" opacity="0.5"/>
  <circle cx="443" cy="373" r="1.8" fill="#2a2430" opacity="0.5"/>
  {/* Small drum beside him */}
  <ellipse cx="456" cy="374" rx="3" ry="2" fill="#3a2828" opacity="0.5"/>
  <ellipse cx="456" cy="374" rx="3" ry="1" fill="#4a3830" opacity="0.35"/>

  {/* ========================================= */}
  {/* LAYER 8K: SUPPLY WAGON                    */}
  {/* ========================================= */}

  {/* Supply wagon — background left area */}
  {/* Wagon body */}
  <rect x="130" y="340" width="32" height="14" fill="#2a2220" rx="1" opacity="0.6"/>
  <rect x="130" y="340" width="32" height="3" fill="#322a22" opacity="0.4"/>
  {/* Wagon sides (raised) */}
  <line x1="130" y1="340" x2="130" y2="335" stroke="#2a2220" strokeWidth="1.5" opacity="0.5"/>
  <line x1="162" y1="340" x2="162" y2="335" stroke="#2a2220" strokeWidth="1.5" opacity="0.5"/>
  <line x1="130" y1="335" x2="162" y2="335" stroke="#2a2220" strokeWidth="1" opacity="0.4"/>
  <line x1="146" y1="340" x2="146" y2="335" stroke="#2a2220" strokeWidth="0.8" opacity="0.35"/>
  {/* Wheels */}
  <circle cx="138" cy="356" r="5" fill="none" stroke="#2a2420" strokeWidth="1.5" opacity="0.55"/>
  <circle cx="138" cy="356" r="0.8" fill="#2a2420" opacity="0.5"/>
  <line x1="138" y1="351" x2="138" y2="361" stroke="#2a2420" strokeWidth="0.5" opacity="0.35"/>
  <line x1="133" y1="356" x2="143" y2="356" stroke="#2a2420" strokeWidth="0.5" opacity="0.35"/>
  <circle cx="154" cy="356" r="5" fill="none" stroke="#2a2420" strokeWidth="1.5" opacity="0.55"/>
  <circle cx="154" cy="356" r="0.8" fill="#2a2420" opacity="0.5"/>
  <line x1="154" y1="351" x2="154" y2="361" stroke="#2a2420" strokeWidth="0.5" opacity="0.35"/>
  <line x1="149" y1="356" x2="159" y2="356" stroke="#2a2420" strokeWidth="0.5" opacity="0.35"/>
  {/* Wagon tongue/shaft */}
  <line x1="130" y1="348" x2="118" y2="352" stroke="#2a2220" strokeWidth="1.2" opacity="0.45"/>
  <line x1="130" y1="350" x2="118" y2="354" stroke="#2a2220" strokeWidth="1" opacity="0.4"/>
  {/* Cargo shapes in wagon */}
  <rect x="133" y="337" width="8" height="3" fill="#242020" rx="0.5" opacity="0.4"/>
  <rect x="143" y="336" width="10" height="4" fill="#222020" rx="0.5" opacity="0.35"/>
  <rect x="155" y="337" width="5" height="3" fill="#242020" rx="0.5" opacity="0.3"/>

  {/* ========================================= */}
  {/* LAYER 8L: TETHERED HORSES/MULES           */}
  {/* ========================================= */}

  {/* Mule 1 — near wagon, standing */}
  {/* Body */}
  <ellipse cx="115" cy="350" rx="8" ry="5" fill="#1e1c20" opacity="0.55"/>
  {/* Legs */}
  <line x1="109" y1="354" x2="108" y2="362" stroke="#1e1c20" strokeWidth="1.2" opacity="0.5"/>
  <line x1="112" y1="355" x2="111" y2="363" stroke="#1e1c20" strokeWidth="1" opacity="0.45"/>
  <line x1="118" y1="355" x2="119" y2="363" stroke="#1e1c20" strokeWidth="1" opacity="0.45"/>
  <line x1="121" y1="354" x2="122" y2="362" stroke="#1e1c20" strokeWidth="1.2" opacity="0.5"/>
  {/* Head/neck */}
  <path d="M108,350 Q105,346 103,342 Q101,340 103,338" fill="none" stroke="#1e1c20" strokeWidth="1.5" opacity="0.5"/>
  <circle cx="103" cy="338" r="2" fill="#1e1c20" opacity="0.5"/>
  {/* Ear */}
  <line x1="103" y1="338" x2="102" y2="334" stroke="#1e1c20" strokeWidth="0.8" opacity="0.4"/>
  {/* Tether line */}
  <path d="M103,339 Q98,342 95,340 Q90,338 86,340" stroke="#2a2630" strokeWidth="0.5" fill="none" opacity="0.3"/>

  {/* Mule 2 — slightly further, head down (grazing/resting) */}
  <ellipse cx="95" cy="355" rx="7" ry="4.5" fill="#1c1a1e" opacity="0.5"/>
  <line x1="90" y1="359" x2="89" y2="366" stroke="#1c1a1e" strokeWidth="1" opacity="0.45"/>
  <line x1="93" y1="360" x2="92" y2="367" stroke="#1c1a1e" strokeWidth="0.8" opacity="0.4"/>
  <line x1="97" y1="360" x2="98" y2="367" stroke="#1c1a1e" strokeWidth="0.8" opacity="0.4"/>
  <line x1="100" y1="359" x2="101" y2="366" stroke="#1c1a1e" strokeWidth="1" opacity="0.45"/>
  <path d="M89,355 Q86,358 84,360 Q82,362 84,364" fill="none" stroke="#1c1a1e" strokeWidth="1.2" opacity="0.45"/>
  <circle cx="84" cy="364" r="1.8" fill="#1c1a1e" opacity="0.45"/>

  {/* ========================================= */}
  {/* LAYER 8M: HUMAN FIGURES                   */}
  {/* ========================================= */}

  {/* === Sentry on watch (standing, right side, silhouetted against dawn) === */}
  {/* Body */}
  <rect x="760" y="340" width="5" height="16" fill="#1a1820" opacity="0.7"/>
  {/* Legs */}
  <line x1="761" y1="356" x2="760" y2="366" stroke="#1a1820" strokeWidth="1.8" opacity="0.65"/>
  <line x1="764" y1="356" x2="765" y2="366" stroke="#1a1820" strokeWidth="1.8" opacity="0.65"/>
  {/* Head */}
  <circle cx="762" cy="338" r="2.5" fill="#1a1820" opacity="0.7"/>
  {/* Shako hat */}
  <rect x="759" y="333" width="6" height="5" fill="#1a1820" rx="1" opacity="0.7"/>
  <rect x="758" y="338" width="8" height="1" fill="#1a1820" opacity="0.6"/>
  {/* Musket (held upright) */}
  <line x1="768" y1="340" x2="769" y2="326" stroke="#2a2420" strokeWidth="1" opacity="0.6"/>
  {/* Bayonet */}
  <line x1="769" y1="326" x2="769" y2="320" stroke="#6a6870" strokeWidth="0.5" opacity="0.3"/>
  {/* Warm dawn edge-light on right side */}
  <line x1="765" y1="340" x2="765" y2="356" stroke="#3a3028" strokeWidth="0.5" opacity="0.25"/>

  {/* === Soldier stretching/yawning (near campfire 2) === */}
  {/* Body */}
  <rect x="275" y="362" width="5" height="14" fill="#1e1c28" opacity="0.6"/>
  {/* Legs */}
  <line x1="276" y1="376" x2="275" y2="385" stroke="#1e1c28" strokeWidth="1.5" opacity="0.55"/>
  <line x1="279" y1="376" x2="280" y2="385" stroke="#1e1c28" strokeWidth="1.5" opacity="0.55"/>
  {/* Head */}
  <circle cx="277" cy="360" r="2.2" fill="#1e1c28" opacity="0.6"/>
  {/* Arms raised (stretching) */}
  <path d="M275,365 Q270,358 268,352" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.5"/>
  <path d="M280,365 Q285,358 287,352" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.5"/>

  {/* === Cook starting morning fire (near campfire 4, background) === */}
  {/* Crouching figure */}
  <path d="M355,328 Q358,322 360,326 Q362,330 360,334" fill="#1e1c28" opacity="0.45"/>
  <circle cx="358" cy="320" r="2" fill="#1e1c28" opacity="0.45"/>
  {/* Arms extended toward fire */}
  <path d="M356,325 Q352,328 350,328" stroke="#1e1c28" strokeWidth="1" fill="none" opacity="0.4"/>

  {/* === Officer with telescope (left, looking seaward) === */}
  {/* Standing figure, slightly taller */}
  <rect x="185" y="340" width="5" height="16" fill="#1e1c28" opacity="0.6"/>
  <line x1="186" y1="356" x2="185" y2="366" stroke="#1e1c28" strokeWidth="1.5" opacity="0.55"/>
  <line x1="189" y1="356" x2="190" y2="366" stroke="#1e1c28" strokeWidth="1.5" opacity="0.55"/>
  <circle cx="187" cy="338" r="2.3" fill="#1e1c28" opacity="0.6"/>
  {/* Bicorn hat silhouette */}
  <path d="M183,337 Q187,335 191,337" stroke="#1e1c28" strokeWidth="1.5" fill="none" opacity="0.6"/>
  <path d="M183,337 Q182,336 183,335" stroke="#1e1c28" strokeWidth="1" fill="none" opacity="0.5"/>
  <path d="M191,337 Q192,336 191,335" stroke="#1e1c28" strokeWidth="1" fill="none" opacity="0.5"/>
  {/* Telescope held to eye */}
  <line x1="190" y1="340" x2="200" y2="336" stroke="#2a2420" strokeWidth="1" opacity="0.5"/>
  {/* Telescope glint */}
  <circle cx="200" cy="336" r="0.8" fill="#c0b890" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.1;0.2" dur="3s" repeatCount="indefinite"/>
  </circle>

  {/* === Soldier sitting up, stirring awake (near bivouac group 2) === */}
  {/* Seated torso */}
  <path d="M505,362 Q507,356 508,360 Q510,364 508,368" fill="#1e1c28" opacity="0.55"/>
  <circle cx="507" cy="354" r="2" fill="#1e1c28" opacity="0.55"/>
  {/* Legs extended */}
  <line x1="505" y1="368" x2="498" y2="374" stroke="#1e1c28" strokeWidth="1.3" fill="none" opacity="0.45"/>
  <line x1="508" y1="368" x2="515" y2="374" stroke="#1e1c28" strokeWidth="1.3" fill="none" opacity="0.45"/>
  {/* Hand rubbing face */}
  <path d="M509,358 Q512,355 513,354" stroke="#1e1c28" strokeWidth="0.8" fill="none" opacity="0.4"/>

  {/* ========================================= */}
  {/* LAYER 8N: EQUIPMENT DETAIL                */}
  {/* ========================================= */}

  {/* Canteens hanging from wagon */}
  <circle cx="135" cy="354" r="2" fill="none" stroke="#2a2620" strokeWidth="0.8" opacity="0.35"/>
  <circle cx="141" cy="353" r="1.8" fill="none" stroke="#2a2620" strokeWidth="0.7" opacity="0.3"/>

  {/* Packs and cartridge boxes scattered near bivouacs */}
  <rect x="283" y="380" width="5" height="4" fill="#2a2420" rx="0.5" opacity="0.4"/>
  <rect x="218" y="386" width="6" height="5" fill="#1e1c20" rx="0.5" opacity="0.35"/>
  <rect x="500" y="370" width="5" height="4" fill="#2a2420" rx="0.5" opacity="0.4"/>
  <rect x="660" y="370" width="5" height="3.5" fill="#2a2420" rx="0.5" opacity="0.35"/>

  {/* Rolled blankets/greatcoats near bivouacs */}
  <ellipse cx="235" cy="390" rx="5" ry="2" fill="#1e1c28" opacity="0.35"/>
  <ellipse cx="475" cy="378" rx="4.5" ry="1.8" fill="#1e1c28" opacity="0.3"/>
  <ellipse cx="705" cy="368" rx="5" ry="2" fill="#1e1c28" opacity="0.35"/>

  {/* Haversacks */}
  <path d="M263,382 Q265,379 268,382" fill="#2a2420" opacity="0.35"/>
  <path d="M493,374 Q495,371 498,374" fill="#2a2420" opacity="0.3"/>

  {/* Water bucket near cook */}
  <path d="M342,332 Q344,328 348,328 Q350,328 352,332" fill="#1e1c28" opacity="0.35"/>
  <line x1="344" y1="326" x2="350" y2="326" stroke="#3a3438" strokeWidth="0.5" opacity="0.25"/>

  {/* ========================================= */}
  {/* LAYER 8O: VALLEY MIST DETAIL              */}
  {/* ========================================= */}

  {/* Thick valley mist pooling between terrain features */}
  <ellipse cx="200" cy="310" rx="60" ry="8" fill="#8890a0" opacity="0.06">
    <animate attributeName="opacity" values="0.06;0.08;0.06" dur="8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="400" cy="305" rx="70" ry="7" fill="#8890a0" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0.07;0.05" dur="10s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="600" cy="308" rx="55" ry="6" fill="#9098a8" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0.07;0.05" dur="9s" repeatCount="indefinite"/>
  </ellipse>

  {/* Mist tendrils snaking through olive groves */}
  <path d="M50,340 Q100,336 150,340 Q200,344 250,338 Q300,342 350,340" stroke="#8890a0" strokeWidth="5" fill="none" opacity="0.04" strokeLinecap="round">
    <animate attributeName="opacity" values="0.04;0.06;0.04" dur="12s" repeatCount="indefinite"/>
  </path>
  <path d="M400,335 Q450,331 500,335 Q550,339 600,333 Q650,337 700,335" stroke="#8890a0" strokeWidth="4" fill="none" opacity="0.035" strokeLinecap="round">
    <animate attributeName="opacity" values="0.035;0.055;0.035" dur="11s" repeatCount="indefinite"/>
  </path>

  {/* Low mist around campfires (slightly warm tinted from embers) */}
  <ellipse cx="680" cy="360" rx="30" ry="5" fill="#908880" opacity="0.04">
    <animate attributeName="opacity" values="0.04;0.06;0.04" dur="7s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="240" cy="380" rx="25" ry="4" fill="#908880" opacity="0.035">
    <animate attributeName="opacity" values="0.035;0.055;0.035" dur="8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="470" cy="368" rx="22" ry="4" fill="#908880" opacity="0.03">
    <animate attributeName="opacity" values="0.03;0.05;0.03" dur="9s" repeatCount="indefinite"/>
  </ellipse>

  {/* ========================================= */}
  {/* LAYER 8P: ENHANCED TOWN DETAILS           */}
  {/* ========================================= */}

  {/* Chimney smoke from town buildings */}
  <path d="M155,228 Q153,218 156,208 Q158,198 154,188" stroke="#686878" strokeWidth="0.8" fill="none" opacity="0.06" strokeLinecap="round">
    <animate attributeName="d" values="M155,228 Q153,218 156,208 Q158,198 154,188;M155,228 Q157,216 154,206 Q152,196 156,186;M155,228 Q153,218 156,208 Q158,198 154,188" dur="8s" repeatCount="indefinite"/>
  </path>
  <path d="M260,230 Q258,220 261,210 Q264,200 260,190" stroke="#686878" strokeWidth="0.7" fill="none" opacity="0.05" strokeLinecap="round">
    <animate attributeName="d" values="M260,230 Q258,220 261,210 Q264,200 260,190;M260,230 Q262,218 259,208 Q256,198 261,188;M260,230 Q258,220 261,210 Q264,200 260,190" dur="9s" repeatCount="indefinite"/>
  </path>
  <path d="M450,240 Q448,230 451,220 Q454,210 450,200" stroke="#686878" strokeWidth="0.7" fill="none" opacity="0.05" strokeLinecap="round">
    <animate attributeName="d" values="M450,240 Q448,230 451,220 Q454,210 450,200;M450,240 Q452,228 449,218 Q446,208 451,198;M450,240 Q448,230 451,220 Q454,210 450,200" dur="10s" repeatCount="indefinite"/>
  </path>

  {/* Washing lines between buildings */}
  <path d="M208,262 Q216,260 225,262" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.2"/>
  <rect x="212" y="261" width="2" height="3" fill="#3a3438" opacity="0.15"/>
  <rect x="218" y="261" width="2" height="3" fill="#3a3438" opacity="0.15"/>

  {/* Street lamp (unlit) */}
  <line x1="320" y1="270" x2="320" y2="255" stroke="#2a2430" strokeWidth="0.8" opacity="0.3"/>
  <ellipse cx="320" cy="254" rx="2" ry="1.5" fill="#2a2430" opacity="0.25"/>

  {/* Cobblestone suggestions in alleys */}
  <circle cx="208" cy="290" r="0.8" fill="#1e1a28" opacity="0.2"/>
  <circle cx="210" cy="292" r="0.7" fill="#1e1a28" opacity="0.18"/>
  <circle cx="207" cy="293" r="0.6" fill="#1e1a28" opacity="0.16"/>
  <circle cx="322" cy="288" r="0.8" fill="#1e1a28" opacity="0.2"/>
  <circle cx="324" cy="290" r="0.7" fill="#1e1a28" opacity="0.18"/>
  <circle cx="321" cy="291" r="0.6" fill="#1e1a28" opacity="0.16"/>
  <circle cx="429" cy="290" r="0.7" fill="#1e1a28" opacity="0.18"/>
  <circle cx="431" cy="292" r="0.6" fill="#1e1a28" opacity="0.16"/>

  {/* Building shadow detail (cast shadows between structures) */}
  <polygon points="168,258 182,258 182,300 168,300" fill="#0a0a12" opacity="0.15"/>
  <polygon points="268,248 272,248 272,300 268,300" fill="#0a0a12" opacity="0.2"/>
  <polygon points="387,268 392,268 392,300 387,300" fill="#0a0a12" opacity="0.15"/>
  <polygon points="462,252 466,252 466,300 462,300" fill="#0a0a12" opacity="0.18"/>

  {/* Shutters on some windows */}
  <line x1="146" y1="250" x2="146" y2="256" stroke="#2a2430" strokeWidth="0.6" opacity="0.3"/>
  <line x1="153" y1="250" x2="153" y2="256" stroke="#2a2430" strokeWidth="0.6" opacity="0.3"/>
  <line x1="331" y1="264" x2="331" y2="270" stroke="#2a2430" strokeWidth="0.6" opacity="0.3"/>
  <line x1="348" y1="264" x2="348" y2="270" stroke="#2a2430" strokeWidth="0.6" opacity="0.3"/>
  <line x1="501" y1="256" x2="501" y2="262" stroke="#2a2430" strokeWidth="0.6" opacity="0.3"/>
  <line x1="518" y1="256" x2="518" y2="262" stroke="#2a2430" strokeWidth="0.6" opacity="0.3"/>

  {/* Balcony railings on some buildings */}
  <line x1="175" y1="268" x2="200" y2="268" stroke="#2a2430" strokeWidth="0.5" opacity="0.25"/>
  <line x1="178" y1="268" x2="178" y2="270" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="182" y1="268" x2="182" y2="270" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="186" y1="268" x2="186" y2="270" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="190" y1="268" x2="190" y2="270" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="194" y1="268" x2="194" y2="270" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="198" y1="268" x2="198" y2="270" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>

  <line x1="435" y1="260" x2="458" y2="260" stroke="#2a2430" strokeWidth="0.5" opacity="0.25"/>
  <line x1="438" y1="260" x2="438" y2="262" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="442" y1="260" x2="442" y2="262" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="446" y1="260" x2="446" y2="262" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="450" y1="260" x2="450" y2="262" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>
  <line x1="454" y1="260" x2="454" y2="262" stroke="#2a2430" strokeWidth="0.3" opacity="0.2"/>

  {/* ========================================= */}
  {/* LAYER 8Q: ADDITIONAL HEADLAND DETAIL      */}
  {/* ========================================= */}

  {/* Left headland — rocky texture and vegetation */}
  <path d="M30,198 Q40,195 50,196 Q60,193 70,195 Q80,192 90,194" stroke="#1a1828" strokeWidth="0.5" fill="none" opacity="0.35"/>
  <path d="M50,200 Q60,197 70,198 Q80,195 90,197 Q100,194 110,196" stroke="#181628" strokeWidth="0.4" fill="none" opacity="0.3"/>
  <ellipse cx="50" cy="200" rx="6" ry="3" fill="#121820" opacity="0.3"/>
  <ellipse cx="90" cy="197" rx="8" ry="3" fill="#141a22" opacity="0.25"/>
  <ellipse cx="130" cy="200" rx="5" ry="2.5" fill="#121820" opacity="0.2"/>

  {/* Right headland — more detail, warm edge light */}
  <path d="M600,204 Q620,200 640,202 Q660,198 680,200 Q700,196 720,198" stroke="#1e1c30" strokeWidth="0.5" fill="none" opacity="0.35"/>
  <path d="M640,206 Q660,202 680,204 Q700,200 720,202 Q740,198 760,200" stroke="#1c1a2e" strokeWidth="0.4" fill="none" opacity="0.3"/>
  <ellipse cx="640" cy="204" rx="7" ry="3" fill="#161c28" opacity="0.25"/>
  <ellipse cx="700" cy="201" rx="9" ry="3.5" fill="#181e2a" opacity="0.28"/>
  <ellipse cx="760" cy="198" rx="6" ry="2.5" fill="#161c28" opacity="0.22"/>
  {/* Warm edge on headland ridge */}
  <path d="M640,194 Q660,191 680,192 Q700,190 720,192 Q740,194 760,196" stroke="#3a2828" strokeWidth="0.6" fill="none" opacity="0.2"/>

  {/* Small fishing village lights on far headland */}
  <rect x="680" y="198" width="2" height="2" fill="#d8a840" opacity="0.2">
    <animate attributeName="opacity" values="0.2;0.12;0.2" dur="4s" repeatCount="indefinite"/>
  </rect>
  <rect x="690" y="197" width="2" height="2" fill="#e0b040" opacity="0.18">
    <animate attributeName="opacity" values="0.18;0.1;0.18" dur="5s" repeatCount="indefinite"/>
  </rect>
  <rect x="695" y="198" width="1.5" height="1.5" fill="#d0a038" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.08;0.15" dur="4.5s" repeatCount="indefinite"/>
  </rect>

  {/* ========================================= */}
  {/* LAYER 8R: FOREGROUND TEXTURE DETAIL       */}
  {/* ========================================= */}

  {/* Worn dirt patches on foreground ground */}
  <ellipse cx="300" cy="365" rx="15" ry="4" fill="#1e1a20" opacity="0.2"/>
  <ellipse cx="500" cy="355" rx="12" ry="3.5" fill="#201c22" opacity="0.18"/>
  <ellipse cx="640" cy="350" rx="14" ry="3.5" fill="#221e24" opacity="0.18"/>

  {/* Dried mud cracks on path */}
  <path d="M345,352 Q348,348 352,352" stroke="#1a1820" strokeWidth="0.3" fill="none" opacity="0.15"/>
  <path d="M350,350 Q352,346 355,350" stroke="#1a1820" strokeWidth="0.3" fill="none" opacity="0.12"/>
  <path d="M355,354 Q358,350 362,354" stroke="#1a1820" strokeWidth="0.3" fill="none" opacity="0.12"/>
  <path d="M348,358 Q350,354 354,358" stroke="#1a1820" strokeWidth="0.3" fill="none" opacity="0.1"/>
  <path d="M360,360 Q362,356 365,360" stroke="#1a1820" strokeWidth="0.3" fill="none" opacity="0.1"/>

  {/* Lichen on rocks */}
  <circle cx="57" cy="350" r="1.5" fill="#2a3020" opacity="0.2"/>
  <circle cx="62" cy="348" r="1" fill="#283020" opacity="0.15"/>
  <circle cx="487" cy="338" r="1.2" fill="#2a3020" opacity="0.18"/>
  <circle cx="492" cy="336" r="0.8" fill="#283020" opacity="0.14"/>
  <circle cx="525" cy="352" r="1" fill="#2a3020" opacity="0.16"/>
  <circle cx="735" cy="335" r="1.3" fill="#2a3020" opacity="0.18"/>

  {/* Fallen leaves under olive trees */}
  <circle cx="165" cy="332" r="0.6" fill="#2a2418" opacity="0.2"/>
  <circle cx="172" cy="335" r="0.5" fill="#282218" opacity="0.18"/>
  <circle cx="168" cy="338" r="0.4" fill="#2a2418" opacity="0.15"/>
  <circle cx="177" cy="334" r="0.5" fill="#282218" opacity="0.16"/>
  <circle cx="163" cy="337" r="0.4" fill="#2a2418" opacity="0.14"/>
  <circle cx="608" cy="330" r="0.6" fill="#2a2418" opacity="0.2"/>
  <circle cx="615" cy="333" r="0.5" fill="#282218" opacity="0.18"/>
  <circle cx="612" cy="336" r="0.4" fill="#2a2418" opacity="0.15"/>
  <circle cx="620" cy="332" r="0.5" fill="#282218" opacity="0.16"/>
  <circle cx="605" cy="335" r="0.4" fill="#2a2418" opacity="0.14"/>
  <circle cx="625" cy="334" r="0.5" fill="#282218" opacity="0.16"/>

  {/* Root systems visible at olive tree bases */}
  <path d="M180,380 Q185,382 192,381" stroke="#2a2420" strokeWidth="1" fill="none" opacity="0.25"/>
  <path d="M180,380 Q175,383 170,382" stroke="#2a2420" strokeWidth="0.8" fill="none" opacity="0.2"/>
  <path d="M620,385 Q625,387 632,386" stroke="#2a2420" strokeWidth="1" fill="none" opacity="0.25"/>
  <path d="M620,385 Q615,388 610,387" stroke="#2a2420" strokeWidth="0.8" fill="none" opacity="0.2"/>

  {/* Additional ground-level stone detail */}
  <path d="M370,372 Q375,368 380,370 Q384,366 388,369 Q391,373 386,376 Q378,378 372,374 Z" fill="#2a2630" opacity="0.35"/>
  <path d="M570,345 Q574,340 578,342 Q582,338 586,341 Q588,345 584,348 Q578,350 572,347 Z" fill="#282430" opacity="0.3"/>
  <path d="M100,388 Q104,383 108,385 Q112,381 116,384 Q118,388 114,391 Q108,393 102,390 Z" fill="#2a2630" opacity="0.3"/>
  <path d="M650,355 Q653,350 657,352 Q660,348 664,351 Q666,355 662,358 Q656,360 652,357 Z" fill="#2c2830" opacity="0.3"/>

  {/* Ant trail detail (subtle dark line) */}
  <path d="M370,375 Q380,373 390,375 Q400,377 410,374 Q420,376 430,374" stroke="#181620" strokeWidth="0.3" fill="none" opacity="0.08"/>

  {/* ========================================= */}
  {/* LAYER 8S: ADDITIONAL STONE WALLS & PATHS  */}
  {/* ========================================= */}

  {/* Foreground stone wall — low, partially collapsed */}
  <path d="M0,382 Q30,380 60,382 Q90,378 120,380 Q150,376 180,379 Q210,375 240,378" stroke="#2a2630" strokeWidth="2.5" fill="none" opacity="0.35"/>
  <path d="M0,385 Q30,383 60,385 Q90,381 120,383 Q150,379 180,382 Q210,378 240,381" stroke="#222030" strokeWidth="1.5" fill="none" opacity="0.25"/>
  {/* Wall stone detail */}
  <line x1="30" y1="380" x2="30" y2="385" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>
  <line x1="60" y1="382" x2="60" y2="387" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>
  <line x1="90" y1="378" x2="90" y2="383" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>
  <line x1="120" y1="380" x2="120" y2="385" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>
  <line x1="150" y1="377" x2="150" y2="382" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>
  <line x1="180" y1="379" x2="180" y2="384" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>
  <line x1="210" y1="376" x2="210" y2="381" stroke="#1e1a28" strokeWidth="0.6" opacity="0.25"/>

  {/* Collapsed section */}
  <circle cx="195" cy="380" r="2" fill="#2a2630" opacity="0.3"/>
  <circle cx="200" cy="382" r="1.8" fill="#282430" opacity="0.28"/>
  <circle cx="205" cy="381" r="1.5" fill="#2a2630" opacity="0.25"/>
  <circle cx="202" cy="384" r="1.2" fill="#282430" opacity="0.22"/>

  {/* Goat trail winding through scrub */}
  <path d="M600,340 Q590,345 585,352 Q580,360 576,370 Q572,380 570,390 Q568,395 567,400" stroke="#222028" strokeWidth="2.5" fill="none" opacity="0.15"/>
  <path d="M600,340 Q590,345 585,352 Q580,360 576,370 Q572,380 570,390 Q568,395 567,400" stroke="#1e1c26" strokeWidth="1.5" fill="none" opacity="0.1"/>

  {/* ========================================= */}
  {/* LAYER 8T: DISTANT LANDSCAPE FEATURES      */}
  {/* ========================================= */}

  {/* Distant mountain range behind headlands */}
  <path d="M0,165 Q30,155 60,160 Q90,148 120,152 Q150,145 180,150 Q210,142 240,147 Q270,140 300,145 Q330,138 360,142" fill="#1a1830" opacity="0.2"/>
  <path d="M440,142 Q470,138 500,142 Q530,135 560,140 Q590,133 620,138 Q650,132 680,136 Q710,130 740,135 Q770,128 800,132 L800,165 Q770,160 740,163 Q710,157 680,160 Q650,155 620,158 Q590,152 560,156 Q530,150 500,154 Q470,148 440,152 L440,142 Z" fill="#1a1830" opacity="0.2"/>

  {/* Snow caps on highest peaks (distant Alps) */}
  <path d="M520,136 Q530,132 540,136" fill="#3a3848" opacity="0.15"/>
  <path d="M590,134 Q600,130 610,134" fill="#3a3848" opacity="0.12"/>
  <path d="M680,132 Q690,128 700,132" fill="#3a3848" opacity="0.12"/>
  <path d="M170,146 Q180,142 190,146" fill="#3a3848" opacity="0.1"/>

  {/* Distant watchtower on left headland */}
  <rect x="75" y="188" width="4" height="8" fill="#181628" opacity="0.35"/>
  <rect x="74" y="188" width="6" height="2" fill="#1a1828" opacity="0.3"/>

  {/* Distant watchtower on right headland */}
  <rect x="720" y="189" width="4" height="7" fill="#1e1c30" opacity="0.35"/>
  <rect x="719" y="189" width="6" height="2" fill="#201e32" opacity="0.3"/>

  {/* ========================================= */}
  {/* LAYER 8U: BIRDS AND WILDLIFE              */}
  {/* ========================================= */}

  {/* Seagulls wheeling over the coast */}
  <path d="M500,155 Q503,152 506,155" stroke="#6a6878" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M510,148 Q513,145 516,148" stroke="#6a6878" strokeWidth="0.5" fill="none" opacity="0.18"/>
  <path d="M490,162 Q492,160 494,162" stroke="#5a5868" strokeWidth="0.4" fill="none" opacity="0.15"/>
  <path d="M480,158 Q482,156 484,158" stroke="#5a5868" strokeWidth="0.4" fill="none" opacity="0.14"/>

  {/* Bird in flight — closer, near olive tree */}
  <path d="M590,295 Q594,290 598,295" stroke="#2a2830" strokeWidth="0.8" fill="none" opacity="0.25"/>
  <path d="M595,300 Q598,296 601,300" stroke="#2a2830" strokeWidth="0.6" fill="none" opacity="0.2"/>

  {/* Distant birds over sea */}
  <path d="M350,172 Q352,170 354,172" stroke="#3a3840" strokeWidth="0.3" fill="none" opacity="0.12"/>
  <path d="M360,175 Q362,173 364,175" stroke="#3a3840" strokeWidth="0.3" fill="none" opacity="0.1"/>
  <path d="M340,168 Q342,166 344,168" stroke="#3a3840" strokeWidth="0.3" fill="none" opacity="0.1"/>

  {/* ========================================= */}
  {/* LAYER 8V: ADDITIONAL CAMPFIRE DETAIL      */}
  {/* ========================================= */}

  {/* Ash rings around campfires */}
  <ellipse cx="680" cy="350" rx="22" ry="8" fill="#1a1818" opacity="0.15"/>
  <ellipse cx="240" cy="370" rx="18" ry="7" fill="#1a1818" opacity="0.12"/>
  <ellipse cx="470" cy="358" rx="16" ry="6" fill="#1a1818" opacity="0.1"/>

  {/* Scattered kindling near fires */}
  <line x1="658" y1="355" x2="662" y2="358" stroke="#1a1410" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
  <line x1="696" y1="348" x2="700" y2="352" stroke="#1a1410" strokeWidth="0.7" strokeLinecap="round" opacity="0.25"/>
  <line x1="695" y1="356" x2="698" y2="354" stroke="#181210" strokeWidth="0.6" strokeLinecap="round" opacity="0.2"/>
  <line x1="226" y1="374" x2="230" y2="377" stroke="#1a1410" strokeWidth="0.7" strokeLinecap="round" opacity="0.25"/>
  <line x1="252" y1="368" x2="256" y2="370" stroke="#1a1410" strokeWidth="0.6" strokeLinecap="round" opacity="0.2"/>
  <line x1="459" y1="361" x2="462" y2="364" stroke="#1a1410" strokeWidth="0.6" strokeLinecap="round" opacity="0.2"/>
  <line x1="479" y1="356" x2="483" y2="358" stroke="#1a1410" strokeWidth="0.6" strokeLinecap="round" opacity="0.2"/>

  {/* Additional ember sparks — tiny dots near fires */}
  <circle cx="682" cy="342" r="0.4" fill="#e08030" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0;0.15" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="342;338;342" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="678" cy="340" r="0.3" fill="#d07028" opacity="0.12">
    <animate attributeName="opacity" values="0.12;0;0.12" dur="2.5s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="340;335;340" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="685" cy="344" r="0.35" fill="#e89040" opacity="0.1">
    <animate attributeName="opacity" values="0.1;0;0.1" dur="1.8s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="344;339;344" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="242" cy="363" r="0.3" fill="#e08030" opacity="0.1">
    <animate attributeName="opacity" values="0.1;0;0.1" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="363;358;363" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="238" cy="365" r="0.25" fill="#d07028" opacity="0.08">
    <animate attributeName="opacity" values="0.08;0;0.08" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="365;360;365" dur="2.8s" repeatCount="indefinite"/>
  </circle>

  {/* ========================================= */}
  {/* LAYER 8W: TENT / CANVAS SHELTER DETAIL    */}
  {/* ========================================= */}

  {/* Simple canvas lean-to shelters near bivouacs */}
  {/* Shelter 1 — near left bivouac */}
  <path d="M205,370 L215,360 L225,370" fill="#1e1c28" opacity="0.4"/>
  <line x1="215" y1="360" x2="215" y2="370" stroke="#2a2840" strokeWidth="0.5" opacity="0.3"/>
  <line x1="205" y1="370" x2="225" y2="370" stroke="#1a1828" strokeWidth="0.5" opacity="0.3"/>

  {/* Shelter 2 — near center bivouac */}
  <path d="M440,362 L450,353 L460,362" fill="#1e1c28" opacity="0.4"/>
  <line x1="450" y1="353" x2="450" y2="362" stroke="#2a2840" strokeWidth="0.5" opacity="0.3"/>
  <line x1="440" y1="362" x2="460" y2="362" stroke="#1a1828" strokeWidth="0.5" opacity="0.3"/>

  {/* Officer's tent — slightly larger, near telescope officer */}
  <path d="M168,355 L182,342 L196,355" fill="#1e1c28" opacity="0.45"/>
  <line x1="182" y1="342" x2="182" y2="355" stroke="#2a2840" strokeWidth="0.6" opacity="0.35"/>
  <line x1="168" y1="355" x2="196" y2="355" stroke="#1a1828" strokeWidth="0.6" opacity="0.3"/>
  {/* Tent flap */}
  <path d="M178,355 Q180,350 182,355" fill="#141220" opacity="0.3"/>
  {/* Tent pole sticking out */}
  <line x1="182" y1="342" x2="182" y2="338" stroke="#2a2420" strokeWidth="0.8" opacity="0.35"/>

  {/* ========================================= */}
  {/* LAYER 8X: FLAG / STANDARD                 */}
  {/* ========================================= */}

  {/* Regimental standard near officer's tent */}
  <line x1="198" y1="358" x2="198" y2="330" stroke="#2a2420" strokeWidth="1" opacity="0.5"/>
  {/* Tricolor flag (dark, pre-dawn colors) */}
  <path d="M198,330 Q200,328 204,330 Q206,332 204,334 Q202,336 198,334 Z" fill="#1a1838" opacity="0.35"/>
  <path d="M198,330 L198,334 L200,332 Z" fill="#181838" opacity="0.3"/>
  <path d="M202,330 L204,334 L202,334 Z" fill="#381820" opacity="0.3"/>
  {/* Flag tip/finial */}
  <circle cx="198" cy="329" r="1" fill="#c0a040" opacity="0.2"/>

  {/* ========================================= */}
  {/* LAYER 8Y: ADDITIONAL HUMAN FIGURES        */}
  {/* ========================================= */}

  {/* === Two soldiers sitting together, talking quietly === */}
  {/* Soldier A — seated, leaning back */}
  <path d="M300,370 Q302,364 304,368 Q306,372 304,378" fill="#1e1c28" opacity="0.5"/>
  <circle cx="302" cy="362" r="2" fill="#1e1c28" opacity="0.5"/>
  <line x1="300" y1="378" x2="294" y2="384" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.4"/>
  <line x1="304" y1="378" x2="310" y2="384" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.4"/>

  {/* Soldier B — seated, hunched forward */}
  <path d="M316,372 Q318,366 320,370 Q322,374 320,380" fill="#1e1c28" opacity="0.5"/>
  <circle cx="318" cy="364" r="2" fill="#1e1c28" opacity="0.5"/>
  <line x1="316" y1="380" x2="312" y2="386" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.4"/>
  <line x1="320" y1="380" x2="324" y2="386" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.4"/>
  {/* Arm resting on knee */}
  <path d="M317,370 Q314,372 312,374" stroke="#1e1c28" strokeWidth="0.8" fill="none" opacity="0.35"/>

  {/* === Soldier walking back from latrine area, background === */}
  <rect x="420" y="326" width="3.5" height="11" fill="#1e1c28" opacity="0.4"/>
  <circle cx="421" cy="324" r="1.8" fill="#1e1c28" opacity="0.4"/>
  <line x1="420" y1="337" x2="419" y2="344" stroke="#1e1c28" strokeWidth="1" opacity="0.35"/>
  <line x1="423" y1="337" x2="424" y2="344" stroke="#1e1c28" strokeWidth="1" opacity="0.35"/>

  {/* === Soldier propped against rock, dozing === */}
  <path d="M530,350 Q532,344 534,348 Q536,352 533,357" fill="#1e1c28" opacity="0.5"/>
  <circle cx="532" cy="342" r="2" fill="#1e1c28" opacity="0.5"/>
  <line x1="530" y1="357" x2="525" y2="362" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.4"/>
  <line x1="534" y1="357" x2="538" y2="362" stroke="#1e1c28" strokeWidth="1.2" fill="none" opacity="0.4"/>
  {/* Musket across lap */}
  <line x1="525" y1="350" x2="540" y2="348" stroke="#2a2420" strokeWidth="0.8" opacity="0.35"/>

  {/* === Pair of soldiers sharing a blanket near fire 1 === */}
  <ellipse cx="668" cy="370" rx="14" ry="4" fill="#1e1c28" opacity="0.55"/>
  <path d="M656,372 Q660,366 668,365 Q676,366 680,372" fill="#282840" opacity="0.45"/>
  <circle cx="658" cy="367" r="2" fill="#2a2430" opacity="0.45"/>
  <circle cx="678" cy="367" r="2" fill="#2a2430" opacity="0.45"/>

  {/* ========================================= */}
  {/* LAYER 8Z: ADDITIONAL EQUIPMENT SCATTER    */}
  {/* ========================================= */}

  {/* Cooking pot near cook's fire (campfire 4) */}
  <ellipse cx="346" cy="330" rx="3" ry="1.5" fill="#1a1820" opacity="0.4"/>
  <path d="M343,330 Q343,327 346,327 Q349,327 349,330" fill="none" stroke="#2a2430" strokeWidth="0.6" opacity="0.35"/>
  {/* Pot handle */}
  <path d="M344,327 Q346,324 348,327" stroke="#3a3438" strokeWidth="0.4" fill="none" opacity="0.3"/>

  {/* Stacked firewood near cook's area */}
  <line x1="362" y1="332" x2="368" y2="332" stroke="#2a2220" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
  <line x1="363" y1="330" x2="367" y2="330" stroke="#282020" strokeWidth="1.2" strokeLinecap="round" opacity="0.3"/>
  <line x1="364" y1="328" x2="366" y2="328" stroke="#2a2220" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>

  {/* Canteen on ground near bivouac 1 */}
  <ellipse cx="270" cy="383" rx="2" ry="1.5" fill="#2a2620" opacity="0.3"/>
  <path d="M268,383 Q270,381 272,383" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.2"/>

  {/* Scattered cartridge papers near musket pyramids */}
  <rect x="212" y="376" width="2" height="1.5" fill="#2a2830" opacity="0.15" transform="rotate(15 213 377)"/>
  <rect x="216" y="378" width="1.5" height="1" fill="#282630" opacity="0.12" transform="rotate(-10 217 378)"/>
  <rect x="652" y="360" width="2" height="1.5" fill="#2a2830" opacity="0.15" transform="rotate(20 653 361)"/>
  <rect x="658" y="362" width="1.5" height="1" fill="#282630" opacity="0.12" transform="rotate(-5 659 363)"/>
  <rect x="492" y="364" width="2" height="1.5" fill="#2a2830" opacity="0.13" transform="rotate(8 493 365)"/>

  {/* Tin cup near fire */}
  <ellipse cx="686" cy="356" rx="1.5" ry="1" fill="#3a3438" opacity="0.25"/>

  {/* Boots next to sleeping soldier */}
  <rect x="268" y="381" width="2" height="3" fill="#1a1420" rx="0.5" opacity="0.3"/>
  <rect x="272" y="381" width="2" height="3" fill="#1a1420" rx="0.5" opacity="0.28"/>

  {/* Rolled greatcoat being used as pillow */}
  <ellipse cx="447" cy="371" rx="3.5" ry="1.5" fill="#2a2840" opacity="0.35"/>
  <ellipse cx="693" cy="357" rx="3.5" ry="1.5" fill="#2a2840" opacity="0.3"/>

  {/* Kepis/shakos left on ground */}
  <ellipse cx="258" cy="380" rx="2" ry="1" fill="#1a1828" opacity="0.3"/>
  <rect x="256" y="378" width="4" height="2" fill="#1e1c28" rx="0.5" opacity="0.25"/>
  <ellipse cx="488" cy="370" rx="2" ry="1" fill="#1a1828" opacity="0.28"/>
  <rect x="486" y="368" width="4" height="2" fill="#1e1c28" rx="0.5" opacity="0.23"/>

  {/* ========================================= */}
  {/* LAYER 8AA: ENHANCED TRANSITION SLOPE      */}
  {/* ========================================= */}

  {/* Additional Mediterranean scrub on transition */}
  <ellipse cx="160" cy="308" rx="9" ry="3.5" fill="#1a2218" opacity="0.5"/>
  <ellipse cx="320" cy="302" rx="11" ry="4" fill="#182018" opacity="0.45"/>
  <ellipse cx="460" cy="305" rx="10" ry="3.5" fill="#1a2218" opacity="0.48"/>
  <ellipse cx="620" cy="300" rx="12" ry="4" fill="#1e2818" opacity="0.45"/>

  {/* Wild rosemary blooming — tiny purple/white hints */}
  <circle cx="162" cy="306" r="0.5" fill="#7a6888" opacity="0.12"/>
  <circle cx="165" cy="307" r="0.4" fill="#7a6888" opacity="0.1"/>
  <circle cx="322" cy="300" r="0.5" fill="#7a6888" opacity="0.1"/>
  <circle cx="325" cy="301" r="0.4" fill="#7a6888" opacity="0.08"/>
  <circle cx="462" cy="303" r="0.5" fill="#7a6888" opacity="0.1"/>

  {/* Terraced vine detail — individual vine shapes */}
  <path d="M530,227 Q532,223 534,227" stroke="#1a2218" strokeWidth="0.5" fill="none" opacity="0.2"/>
  <path d="M535,227 Q537,222 539,227" stroke="#182018" strokeWidth="0.5" fill="none" opacity="0.18"/>
  <path d="M545,225 Q547,221 549,225" stroke="#1a2218" strokeWidth="0.5" fill="none" opacity="0.2"/>
  <path d="M570,224 Q572,220 574,224" stroke="#1c2618" strokeWidth="0.5" fill="none" opacity="0.2"/>
  <path d="M580,224 Q582,219 584,224" stroke="#1a2218" strokeWidth="0.5" fill="none" opacity="0.18"/>
  <path d="M590,223 Q592,218 594,223" stroke="#1c2618" strokeWidth="0.5" fill="none" opacity="0.2"/>

  {/* Stone wall cap detail */}
  <path d="M82,304 Q84,302 88,304 Q90,302 94,304" stroke="#2a2630" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M180,299 Q182,297 186,299 Q188,297 192,299" stroke="#2a2630" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M280,302 Q282,300 286,302 Q288,300 292,302" stroke="#2a2630" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M380,297 Q382,295 386,297 Q388,295 392,297" stroke="#2a2630" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M480,300 Q482,298 486,300 Q488,298 492,300" stroke="#2a2630" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M580,296 Q582,294 586,296 Q588,294 592,296" stroke="#2a2630" strokeWidth="0.6" fill="none" opacity="0.2"/>

  {/* ========================================= */}
  {/* LAYER 8AB: DAWN SKY ENHANCEMENT           */}
  {/* ========================================= */}

  {/* Subtle aurora-like band (very faint, upper sky) */}
  <path d="M0,20 Q100,15 200,22 Q300,18 400,24 Q500,16 600,20 Q700,14 800,18" stroke="#2a3048" strokeWidth="2" fill="none" opacity="0.06"/>
  <path d="M0,30 Q100,25 200,32 Q300,28 400,34 Q500,26 600,30 Q700,24 800,28" stroke="#283048" strokeWidth="1.5" fill="none" opacity="0.04"/>

  {/* Venus (morning star) — bright point in eastern sky */}
  <circle cx="520" cy="45" r="1.2" fill="#f0e8c0" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.25;0.35" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="520" cy="45" r="3" fill="#f0e8c0" opacity="0.06" filter="url(#vtC_tinyBlur)"/>

  {/* Horizon color band — narrow warm strip right at sea/sky boundary */}
  <rect x="0" y="162" width="800" height="8" fill="url(#vtC_sunriseBand)" opacity="0.3"/>

  {/* ========================================= */}
  {/* LAYER 8AC: DAPPLED LIGHT ON FOREGROUND    */}
  {/* ========================================= */}

  {/* Warm dawn light patches on right side of scene */}
  <ellipse cx="650" cy="345" rx="8" ry="4" fill="#3a2820" opacity="0.08"/>
  <ellipse cx="700" cy="340" rx="10" ry="5" fill="#382620" opacity="0.07"/>
  <ellipse cx="750" cy="335" rx="9" ry="4" fill="#3a2820" opacity="0.06"/>
  <ellipse cx="720" cy="360" rx="12" ry="5" fill="#382620" opacity="0.06"/>
  <ellipse cx="680" cy="355" rx="8" ry="3.5" fill="#3a2820" opacity="0.05"/>
  <ellipse cx="760" cy="350" rx="7" ry="3.5" fill="#382620" opacity="0.05"/>

  {/* Cool shadow patches on left side */}
  <ellipse cx="50" cy="360" rx="10" ry="4" fill="#0e1028" opacity="0.06"/>
  <ellipse cx="100" cy="365" rx="12" ry="5" fill="#0e1028" opacity="0.05"/>
  <ellipse cx="150" cy="360" rx="8" ry="3.5" fill="#0e1028" opacity="0.05"/>

  {/* Olive tree cast shadows on ground */}
  <ellipse cx="190" cy="345" rx="20" ry="4" fill="#0a0e14" opacity="0.08" transform="rotate(-15 190 345)"/>
  <ellipse cx="630" cy="340" rx="22" ry="4.5" fill="#0a0e14" opacity="0.06" transform="rotate(-10 630 340)"/>
  <ellipse cx="90" cy="358" rx="16" ry="3.5" fill="#0a0e14" opacity="0.06" transform="rotate(-20 90 358)"/>
  <ellipse cx="385" cy="352" rx="15" ry="3" fill="#0a0e14" opacity="0.05" transform="rotate(-12 385 352)"/>
  <ellipse cx="715" cy="360" rx="18" ry="4" fill="#0a0e14" opacity="0.05" transform="rotate(-8 715 360)"/>

  {/* ========================================= */}
  {/* LAYER 8AD: ADDITIONAL TOWN ROOF DETAIL    */}
  {/* ========================================= */}

  {/* Roof tile texture lines on major buildings */}
  {/* Building cluster 1 roofs */}
  <line x1="140" y1="234" x2="168" y2="234" stroke="#3a2828" strokeWidth="0.3" opacity="0.2"/>
  <line x1="142" y1="236" x2="166" y2="236" stroke="#3a2828" strokeWidth="0.3" opacity="0.18"/>
  <line x1="144" y1="238" x2="164" y2="238" stroke="#3a2828" strokeWidth="0.3" opacity="0.15"/>

  {/* Church roof tiles */}
  <line x1="275" y1="242" x2="318" y2="242" stroke="#3a2828" strokeWidth="0.3" opacity="0.2"/>
  <line x1="277" y1="244" x2="316" y2="244" stroke="#3a2828" strokeWidth="0.3" opacity="0.18"/>
  <line x1="279" y1="246" x2="314" y2="246" stroke="#3a2828" strokeWidth="0.3" opacity="0.15"/>

  {/* Building cluster 3 roofs */}
  <line x1="327" y1="249" x2="357" y2="249" stroke="#3a2828" strokeWidth="0.3" opacity="0.2"/>
  <line x1="329" y1="251" x2="355" y2="251" stroke="#3a2828" strokeWidth="0.3" opacity="0.18"/>
  <line x1="331" y1="253" x2="353" y2="253" stroke="#3a2828" strokeWidth="0.3" opacity="0.15"/>

  {/* Building cluster 4 roofs */}
  <line x1="433" y1="246" x2="461" y2="246" stroke="#3a2828" strokeWidth="0.3" opacity="0.2"/>
  <line x1="435" y1="248" x2="459" y2="248" stroke="#3a2828" strokeWidth="0.3" opacity="0.18"/>
  <line x1="437" y1="250" x2="457" y2="250" stroke="#3a2828" strokeWidth="0.3" opacity="0.15"/>

  {/* Waterfront building roof */}
  <line x1="497" y1="242" x2="530" y2="242" stroke="#3a2828" strokeWidth="0.3" opacity="0.2"/>
  <line x1="499" y1="244" x2="528" y2="244" stroke="#3a2828" strokeWidth="0.3" opacity="0.18"/>
  <line x1="501" y1="246" x2="526" y2="246" stroke="#3a2828" strokeWidth="0.3" opacity="0.15"/>

  {/* ========================================= */}
  {/* LAYER 8AE: FIRELIGHT ON NEARBY OBJECTS    */}
  {/* ========================================= */}

  {/* Warm glow from campfire 1 on nearby elements */}
  <ellipse cx="680" cy="350" rx="40" ry="15" fill="url(#vtC_fireWarm)" opacity="0.5">
    <animate attributeName="opacity" values="0.5;0.35;0.5" dur="3s" repeatCount="indefinite"/>
  </ellipse>

  {/* Warm glow from campfire 2 */}
  <ellipse cx="240" cy="370" rx="35" ry="12" fill="url(#vtC_fireWarm)" opacity="0.4">
    <animate attributeName="opacity" values="0.4;0.28;0.4" dur="3.5s" repeatCount="indefinite"/>
  </ellipse>

  {/* Warm glow from campfire 3 */}
  <ellipse cx="470" cy="358" rx="30" ry="10" fill="url(#vtC_fireWarm)" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.22;0.35" dur="4s" repeatCount="indefinite"/>
  </ellipse>

  {/* Warm ember reflection on sleeping soldiers' blankets */}
  <ellipse cx="260" cy="378" rx="8" ry="3" fill="#e08030" opacity="0.02">
    <animate attributeName="opacity" values="0.02;0.04;0.02" dur="3s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="698" cy="360" rx="8" ry="3" fill="#e08030" opacity="0.02">
    <animate attributeName="opacity" values="0.02;0.04;0.02" dur="3.5s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="485" cy="372" rx="7" ry="2.5" fill="#e08030" opacity="0.015">
    <animate attributeName="opacity" values="0.015;0.03;0.015" dur="4s" repeatCount="indefinite"/>
  </ellipse>

  {/* ========================================= */}
  {/* LAYER 8AF: FOREGROUND WEEDS & EDGE DETAIL */}
  {/* ========================================= */}

  {/* Tall grass at very bottom of scene (overlapping frame edge) */}
  <path d="M0,395 Q3,380 5,395" stroke="#1e2a18" strokeWidth="1.2" fill="none" opacity="0.4"/>
  <path d="M3,395 Q7,378 10,395" stroke="#1a2618" strokeWidth="1" fill="none" opacity="0.35"/>
  <path d="M8,395 Q12,382 15,395" stroke="#1e2a18" strokeWidth="1.1" fill="none" opacity="0.38"/>
  <path d="M14,395 Q17,383 20,395" stroke="#1a2618" strokeWidth="0.9" fill="none" opacity="0.32"/>
  <path d="M22,398 Q25,386 28,398" stroke="#1e2a18" strokeWidth="1" fill="none" opacity="0.35"/>
  <path d="M30,396 Q33,384 36,396" stroke="#1a2618" strokeWidth="0.9" fill="none" opacity="0.3"/>

  {/* Right foreground edge grasses */}
  <path d="M780,398 Q783,384 786,398" stroke="#222e1a" strokeWidth="1.2" fill="none" opacity="0.4"/>
  <path d="M786,396 Q789,382 792,396" stroke="#1e2a18" strokeWidth="1" fill="none" opacity="0.35"/>
  <path d="M792,397 Q795,385 798,397" stroke="#222e1a" strokeWidth="1.1" fill="none" opacity="0.38"/>

  {/* Bottom-edge ground texture */}
  <path d="M0,398 Q50,396 100,398 Q150,395 200,397 Q250,394 300,396 Q350,393 400,395 Q450,393 500,395 Q550,392 600,394 Q650,392 700,394 Q750,391 800,393" stroke="#1a1820" strokeWidth="1.5" fill="none" opacity="0.15"/>
  <path d="M0,400 Q100,397 200,400 Q300,396 400,398 Q500,396 600,398 Q700,395 800,397" stroke="#161420" strokeWidth="1" fill="none" opacity="0.1"/>

  {/* Dandelion seed heads (silhouetted against dawn) */}
  <line x1="45" y1="385" x2="45" y2="370" stroke="#1e2a18" strokeWidth="0.4" opacity="0.2"/>
  <circle cx="45" cy="369" r="1.5" fill="none" stroke="#3a3840" strokeWidth="0.2" opacity="0.15"/>
  <line x1="45" y1="369" x2="44" y2="367" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>
  <line x1="45" y1="369" x2="46" y2="367" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>
  <line x1="45" y1="369" x2="43" y2="369" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>
  <line x1="45" y1="369" x2="47" y2="369" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>

  <line x1="680" y1="375" x2="680" y2="362" stroke="#222e1a" strokeWidth="0.4" opacity="0.2"/>
  <circle cx="680" cy="361" r="1.5" fill="none" stroke="#3a3840" strokeWidth="0.2" opacity="0.15"/>
  <line x1="680" y1="361" x2="679" y2="359" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>
  <line x1="680" y1="361" x2="681" y2="359" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>
  <line x1="680" y1="361" x2="678" y2="361" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>
  <line x1="680" y1="361" x2="682" y2="361" stroke="#3a3840" strokeWidth="0.15" opacity="0.1"/>

  {/* ========================================= */}
  {/* LAYER 8AG: COAST ROAD & BRIDGE            */}
  {/* ========================================= */}

  {/* Coast road winding below town */}
  <path d="M0,212 Q60,210 120,212 Q180,214 240,211 Q300,209 360,212 Q420,214 480,211 Q540,209 600,212 Q660,214 720,211 Q760,209 800,212" stroke="#2a2830" strokeWidth="2" fill="none" opacity="0.2"/>
  <path d="M0,214 Q60,212 120,214 Q180,216 240,213 Q300,211 360,214 Q420,216 480,213 Q540,211 600,214 Q660,216 720,213 Q760,211 800,214" stroke="#222030" strokeWidth="1.2" fill="none" opacity="0.15"/>

  {/* Small stone bridge over stream */}
  <path d="M390,212 Q395,208 400,205 Q405,208 410,212" fill="#2a2430" opacity="0.3"/>
  <path d="M393,211 Q400,207 407,211" fill="none" stroke="#222030" strokeWidth="0.5" opacity="0.2"/>
  {/* Bridge arch */}
  <path d="M395,212 Q400,216 405,212" fill="none" stroke="#181628" strokeWidth="0.6" opacity="0.2"/>
  {/* Stream/creek under bridge */}
  <path d="M398,215 Q400,218 402,215 Q404,220 406,216" stroke="#2a3040" strokeWidth="0.4" fill="none" opacity="0.12"/>

  {/* ========================================= */}
  {/* LAYER 8AH: FINAL DETAIL TOUCHES           */}
  {/* ========================================= */}

  {/* Dewdrops on foreground grass */}
  <circle cx="34" cy="364" r="0.3" fill="#c8d0e0" opacity="0.12"/>
  <circle cx="153" cy="344" r="0.3" fill="#c8d0e0" opacity="0.1"/>
  <circle cx="293" cy="344" r="0.3" fill="#c8d0e0" opacity="0.1"/>
  <circle cx="423" cy="334" r="0.3" fill="#c8d0e0" opacity="0.1"/>
  <circle cx="563" cy="331" r="0.3" fill="#c8d0e0" opacity="0.1"/>
  <circle cx="603" cy="329" r="0.3" fill="#c8d0e0" opacity="0.1"/>
  <circle cx="653" cy="337" r="0.3" fill="#c8d0e0" opacity="0.1"/>
  <circle cx="763" cy="339" r="0.3" fill="#c8d0e0" opacity="0.1"/>

  {/* Spider web between grasses (tiny, barely visible) */}
  <path d="M32,360 Q35,358 38,360" stroke="#c0c8d0" strokeWidth="0.15" fill="none" opacity="0.06"/>
  <path d="M34,358 Q35,360 36,358" stroke="#c0c8d0" strokeWidth="0.15" fill="none" opacity="0.05"/>

  {/* Faint path worn by soldiers to campfire */}
  <path d="M270,380 Q266,378 260,376 Q254,374 248,374 Q242,374 240,375" stroke="#1e1a20" strokeWidth="3" fill="none" opacity="0.08"/>
  <path d="M498,368 Q492,366 486,364 Q480,362 476,362 Q472,362 470,363" stroke="#1e1a20" strokeWidth="3" fill="none" opacity="0.07"/>
  <path d="M700,365 Q696,362 690,360 Q684,358 680,358 Q676,358 674,359" stroke="#1e1a20" strokeWidth="3" fill="none" opacity="0.08"/>

  {/* Subtle ground color variation */}
  <ellipse cx="350" cy="380" rx="25" ry="8" fill="#1e1820" opacity="0.06"/>
  <ellipse cx="550" cy="370" rx="20" ry="7" fill="#201c22" opacity="0.05"/>
  <ellipse cx="150" cy="375" rx="22" ry="7" fill="#1c1820" opacity="0.05"/>

  {/* Stone cairn (trail marker) on slope */}
  <circle cx="600" cy="320" r="2" fill="#2a2630" opacity="0.35"/>
  <circle cx="600" cy="318" r="1.5" fill="#282430" opacity="0.3"/>
  <circle cx="600" cy="316" r="1" fill="#2a2630" opacity="0.25"/>

  {/* Butterfly silhouette (early riser) near flowers */}
  <path d="M268,344 Q270,342 272,344 Q270,346 268,344 Z" fill="#2a2830" opacity="0.08"/>
  <path d="M272,344 Q274,342 276,344 Q274,346 272,344 Z" fill="#2a2830" opacity="0.08"/>

  {/* ========================================= */}
  {/* LAYER 8AI: ADDITIONAL SMOKE & ATMOSPHERE  */}
  {/* ========================================= */}

  {/* Multiple thin smoke columns from town chimneys */}
  <path d="M188,246 Q186,236 189,226 Q192,216 188,206" stroke="#686878" strokeWidth="0.5" fill="none" opacity="0.04" strokeLinecap="round">
    <animate attributeName="d" values="M188,246 Q186,236 189,226 Q192,216 188,206;M188,246 Q190,234 187,224 Q184,214 189,204;M188,246 Q186,236 189,226 Q192,216 188,206" dur="10s" repeatCount="indefinite"/>
  </path>
  <path d="M340,243 Q338,233 341,223 Q344,213 340,203" stroke="#686878" strokeWidth="0.5" fill="none" opacity="0.04" strokeLinecap="round">
    <animate attributeName="d" values="M340,243 Q338,233 341,223 Q344,213 340,203;M340,243 Q342,231 339,221 Q336,211 341,201;M340,243 Q338,233 341,223 Q344,213 340,203" dur="11s" repeatCount="indefinite"/>
  </path>
  <path d="M510,236 Q508,226 511,216 Q514,206 510,196" stroke="#686878" strokeWidth="0.5" fill="none" opacity="0.035" strokeLinecap="round">
    <animate attributeName="d" values="M510,236 Q508,226 511,216 Q514,206 510,196;M510,236 Q512,224 509,214 Q506,204 511,194;M510,236 Q508,226 511,216 Q514,206 510,196" dur="12s" repeatCount="indefinite"/>
  </path>

  {/* Heat haze above campfires (subtle distortion suggestion) */}
  <path d="M676,330 Q680,328 684,330 Q688,332 692,330" stroke="#888888" strokeWidth="0.3" fill="none" opacity="0.03">
    <animate attributeName="d" values="M676,330 Q680,328 684,330 Q688,332 692,330;M676,330 Q680,332 684,330 Q688,328 692,330;M676,330 Q680,328 684,330 Q688,332 692,330" dur="4s" repeatCount="indefinite"/>
  </path>
  <path d="M236,350 Q240,348 244,350 Q248,352 252,350" stroke="#888888" strokeWidth="0.3" fill="none" opacity="0.025">
    <animate attributeName="d" values="M236,350 Q240,348 244,350 Q248,352 252,350;M236,350 Q240,352 244,350 Q248,348 252,350;M236,350 Q240,348 244,350 Q248,352 252,350" dur="4.5s" repeatCount="indefinite"/>
  </path>
  <path d="M466,338 Q470,336 474,338 Q478,340 482,338" stroke="#888888" strokeWidth="0.25" fill="none" opacity="0.02">
    <animate attributeName="d" values="M466,338 Q470,336 474,338 Q478,340 482,338;M466,338 Q470,340 474,338 Q478,336 482,338;M466,338 Q470,336 474,338 Q478,340 482,338" dur="5s" repeatCount="indefinite"/>
  </path>

  {/* ========================================= */}
  {/* LAYER 8AJ: SEA DETAIL — FISHING BOATS     */}
  {/* ========================================= */}

  {/* Small fishing boat beached on left shore */}
  <path d="M150,210 Q155,207 162,207 Q168,207 172,210" fill="#1e1c28" opacity="0.3"/>
  <line x1="161" y1="207" x2="161" y2="200" stroke="#2a2430" strokeWidth="0.4" opacity="0.2"/>

  {/* Fishing boat at right shore */}
  <path d="M545,208 Q550,205 557,205 Q563,205 567,208" fill="#1e1c28" opacity="0.28"/>
  <line x1="556" y1="205" x2="556" y2="198" stroke="#2a2430" strokeWidth="0.4" opacity="0.18"/>

  {/* Fishing nets draped on shore rocks */}
  <path d="M126,208 Q130,206 134,208 Q138,210 142,208" stroke="#3a3840" strokeWidth="0.3" fill="none" opacity="0.1"/>
  <path d="M128,210 Q132,208 136,210 Q140,212 144,210" stroke="#3a3840" strokeWidth="0.3" fill="none" opacity="0.08"/>

  {/* Buoy floating in harbor */}
  <circle cx="450" cy="190" r="1" fill="#4a2828" opacity="0.15"/>
  <line x1="450" y1="191" x2="450" y2="195" stroke="#2a2830" strokeWidth="0.3" opacity="0.1"/>

  {/* ========================================= */}
  {/* LAYER 8AK: WALL INSCRIPTIONS & GRAFFITI   */}
  {/* ========================================= */}

  {/* Faint carved cross on church wall */}
  <line x1="280" y1="275" x2="280" y2="279" stroke="#2a2430" strokeWidth="0.4" opacity="0.12"/>
  <line x1="278" y1="277" x2="282" y2="277" stroke="#2a2430" strokeWidth="0.4" opacity="0.12"/>

  {/* Year carved on building */}
  <text x="350" y="292" fill="#2a2430" opacity="0.08" style={{fontSize: '3px', fontFamily: 'serif'}}>1788</text>

  {/* ========================================= */}
  {/* LAYER 8AL: HARBOR & DOCK DETAIL           */}
  {/* ========================================= */}

  {/* Wooden dock/pier extending into water near town */}
  <path d="M430,210 L430,200 L440,200 L440,210" fill="none" stroke="#2a2430" strokeWidth="0.8" opacity="0.2"/>
  <line x1="430" y1="202" x2="440" y2="202" stroke="#2a2430" strokeWidth="0.6" opacity="0.18"/>
  <line x1="430" y1="205" x2="440" y2="205" stroke="#2a2430" strokeWidth="0.6" opacity="0.16"/>
  <line x1="430" y1="208" x2="440" y2="208" stroke="#2a2430" strokeWidth="0.6" opacity="0.14"/>
  {/* Dock pilings */}
  <line x1="432" y1="210" x2="432" y2="214" stroke="#1e1c28" strokeWidth="0.5" opacity="0.15"/>
  <line x1="435" y1="210" x2="435" y2="214" stroke="#1e1c28" strokeWidth="0.5" opacity="0.15"/>
  <line x1="438" y1="210" x2="438" y2="214" stroke="#1e1c28" strokeWidth="0.5" opacity="0.15"/>

  {/* Mooring posts on shore */}
  <line x1="420" y1="210" x2="420" y2="205" stroke="#2a2430" strokeWidth="0.8" opacity="0.2"/>
  <circle cx="420" cy="205" r="0.8" fill="#2a2430" opacity="0.18"/>
  <line x1="445" y1="210" x2="445" y2="205" stroke="#2a2430" strokeWidth="0.8" opacity="0.2"/>
  <circle cx="445" cy="205" r="0.8" fill="#2a2430" opacity="0.18"/>

  {/* Rope connecting mooring to boat */}
  <path d="M420,206 Q425,204 430,206" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.12"/>

  {/* ========================================= */}
  {/* LAYER 8AM: ADDITIONAL BACKGROUND SOLDIERS */}
  {/* ========================================= */}

  {/* Distant figures on hillside — early risers */}
  {/* Figure pair walking along terrace path */}
  <rect x="550" y="310" width="2" height="6" fill="#1e1c28" opacity="0.25"/>
  <circle cx="551" cy="309" r="1" fill="#1e1c28" opacity="0.25"/>
  <rect x="558" y="311" width="2" height="6" fill="#1e1c28" opacity="0.22"/>
  <circle cx="559" cy="310" r="1" fill="#1e1c28" opacity="0.22"/>

  {/* Figure near background campfire */}
  <rect x="345" y="320" width="2.5" height="7" fill="#1e1c28" opacity="0.3"/>
  <circle cx="346" cy="318" r="1.2" fill="#1e1c28" opacity="0.3"/>

  {/* Two figures carrying water from stream */}
  <rect x="400" y="312" width="2" height="6" fill="#1e1c28" opacity="0.25"/>
  <circle cx="401" cy="311" r="1" fill="#1e1c28" opacity="0.25"/>
  {/* Water bucket suggestion */}
  <path d="M403,316 Q404,315 405,316" stroke="#2a2830" strokeWidth="0.3" fill="none" opacity="0.15"/>
  <rect x="408" y="313" width="2" height="6" fill="#1e1c28" opacity="0.22"/>
  <circle cx="409" cy="312" r="1" fill="#1e1c28" opacity="0.22"/>

  {/* Soldier at campfire 4 warming hands (more detail) */}
  <path d="M353,326 Q350,330 348,330" stroke="#1e1c28" strokeWidth="0.6" fill="none" opacity="0.3"/>

  {/* ========================================= */}
  {/* LAYER 8AN: ADDITIONAL OLIVE TREE DETAIL   */}
  {/* ========================================= */}

  {/* Olive tree bark texture — gnarled lines */}
  {/* Tree 1 (left) bark detail */}
  <path d="M177,375 Q176,370 177,365" stroke="#342e28" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M179,380 Q178,373 179,368" stroke="#302a24" strokeWidth="0.5" fill="none" opacity="0.18"/>
  <path d="M175,368 Q174,363 175,358" stroke="#342e28" strokeWidth="0.5" fill="none" opacity="0.16"/>

  {/* Tree 2 (right) bark detail */}
  <path d="M617,380 Q616,373 617,368" stroke="#342e28" strokeWidth="0.6" fill="none" opacity="0.2"/>
  <path d="M619,385 Q618,378 619,372" stroke="#302a24" strokeWidth="0.5" fill="none" opacity="0.18"/>
  <path d="M614,370 Q613,365 614,360" stroke="#342e28" strokeWidth="0.5" fill="none" opacity="0.16"/>

  {/* Olive fruit suggestions (very small dark spots) */}
  <circle cx="168" cy="320" r="0.6" fill="#0e1610" opacity="0.25"/>
  <circle cx="173" cy="318" r="0.5" fill="#101812" opacity="0.22"/>
  <circle cx="178" cy="322" r="0.6" fill="#0e1610" opacity="0.2"/>
  <circle cx="160" cy="324" r="0.5" fill="#101812" opacity="0.2"/>
  <circle cx="185" cy="328" r="0.5" fill="#0e1610" opacity="0.18"/>

  <circle cx="608" cy="320" r="0.6" fill="#0e1610" opacity="0.25"/>
  <circle cx="615" cy="316" r="0.5" fill="#101812" opacity="0.22"/>
  <circle cx="620" cy="322" r="0.6" fill="#0e1610" opacity="0.2"/>
  <circle cx="600" cy="324" r="0.5" fill="#101812" opacity="0.2"/>
  <circle cx="628" cy="326" r="0.5" fill="#0e1610" opacity="0.18"/>
  <circle cx="625" cy="320" r="0.5" fill="#101812" opacity="0.18"/>

  {/* Silver-green foliage highlights (characteristic olive color) */}
  <ellipse cx="164" cy="322" rx="4" ry="2.5" fill="#2a3828" opacity="0.15"/>
  <ellipse cx="178" cy="318" rx="3.5" ry="2" fill="#283628" opacity="0.12"/>
  <ellipse cx="186" cy="330" rx="3" ry="2" fill="#2a3828" opacity="0.1"/>

  <ellipse cx="604" cy="320" rx="4" ry="2.5" fill="#2a3828" opacity="0.15"/>
  <ellipse cx="618" cy="316" rx="3.5" ry="2" fill="#283628" opacity="0.12"/>
  <ellipse cx="628" cy="330" rx="3" ry="2" fill="#2a3828" opacity="0.1"/>
  <ellipse cx="632" cy="322" rx="3.5" ry="2" fill="#303e28" opacity="0.12"/>

  {/* ========================================= */}
  {/* LAYER 8AO: TERRAIN EROSION DETAIL         */}
  {/* ========================================= */}

  {/* Erosion gullies on hillside */}
  <path d="M80,335 Q85,345 88,360 Q90,375 92,390" stroke="#161420" strokeWidth="1.5" fill="none" opacity="0.08"/>
  <path d="M480,330 Q484,342 486,355 Q488,368 490,380" stroke="#181620" strokeWidth="1.2" fill="none" opacity="0.07"/>
  <path d="M650,328 Q653,338 655,350 Q657,362 660,375" stroke="#181620" strokeWidth="1.2" fill="none" opacity="0.06"/>

  {/* Exposed rock strata on slope cuts */}
  <path d="M82,305 Q86,304 90,305 Q94,306 98,305" stroke="#322e38" strokeWidth="0.5" fill="none" opacity="0.15"/>
  <path d="M83,307 Q87,306 91,307 Q95,308 99,307" stroke="#302c36" strokeWidth="0.4" fill="none" opacity="0.12"/>
  <path d="M480,301 Q484,300 488,301 Q492,302 496,301" stroke="#322e38" strokeWidth="0.5" fill="none" opacity="0.15"/>
  <path d="M481,303 Q485,302 489,303 Q493,304 497,303" stroke="#302c36" strokeWidth="0.4" fill="none" opacity="0.12"/>

  {/* ========================================= */}
  {/* LAYER 8AP: CYPRESS TREE REFINEMENT        */}
  {/* ========================================= */}

  {/* Additional foliage layers on cypress trees */}
  {/* Cypress 1 refinement */}
  <ellipse cx="25" cy="275" rx="3.5" ry="8" fill="url(#vtC_darkFoliage)" opacity="0.5"/>
  <ellipse cx="25" cy="285" rx="3" ry="7" fill="url(#vtC_darkFoliage)" opacity="0.45"/>

  {/* Cypress 2 refinement */}
  <ellipse cx="70" cy="255" rx="4" ry="10" fill="url(#vtC_darkFoliage)" opacity="0.55"/>
  <ellipse cx="70" cy="268" rx="3.5" ry="9" fill="url(#vtC_darkFoliage)" opacity="0.5"/>

  {/* Cypress 3 refinement — warm edge highlights */}
  <ellipse cx="742" cy="252" rx="2" ry="10" fill="#1e2818" opacity="0.2"/>
  <ellipse cx="742" cy="265" rx="1.8" ry="9" fill="#1e2818" opacity="0.18"/>
  <ellipse cx="742" cy="278" rx="1.5" ry="7" fill="#1e2818" opacity="0.15"/>

  {/* Cypress tree bases — ground integration */}
  <ellipse cx="25" cy="322" rx="4" ry="1.5" fill="#0e1612" opacity="0.3"/>
  <ellipse cx="70" cy="318" rx="4.5" ry="1.5" fill="#0e1612" opacity="0.3"/>
  <ellipse cx="110" cy="325" rx="4" ry="1.5" fill="#0e1612" opacity="0.25"/>
  <ellipse cx="740" cy="328" rx="4.5" ry="1.5" fill="#121a14" opacity="0.3"/>
  <ellipse cx="780" cy="330" rx="4" ry="1.5" fill="#121a14" opacity="0.25"/>

  {/* ========================================= */}
  {/* LAYER 8AQ: FOREGROUND CAMPSITE TEXTURES   */}
  {/* ========================================= */}

  {/* Trampled ground near campfires (darker, worn) */}
  <ellipse cx="680" cy="350" rx="25" ry="10" fill="#141218" opacity="0.08"/>
  <ellipse cx="240" cy="370" rx="22" ry="9" fill="#141218" opacity="0.07"/>
  <ellipse cx="470" cy="358" rx="20" ry="8" fill="#141218" opacity="0.06"/>

  {/* Boot prints suggestion (subtle texture) */}
  <ellipse cx="670" cy="358" rx="1.5" ry="0.8" fill="#181620" opacity="0.06"/>
  <ellipse cx="674" cy="356" rx="1.5" ry="0.8" fill="#181620" opacity="0.05" transform="rotate(15 674 356)"/>
  <ellipse cx="678" cy="358" rx="1.5" ry="0.8" fill="#181620" opacity="0.06" transform="rotate(-10 678 358)"/>
  <ellipse cx="235" cy="376" rx="1.5" ry="0.8" fill="#181620" opacity="0.05"/>
  <ellipse cx="245" cy="374" rx="1.5" ry="0.8" fill="#181620" opacity="0.05" transform="rotate(20 245 374)"/>
  <ellipse cx="465" cy="364" rx="1.5" ry="0.8" fill="#181620" opacity="0.04"/>
  <ellipse cx="475" cy="362" rx="1.5" ry="0.8" fill="#181620" opacity="0.04" transform="rotate(5 475 362)"/>

  {/* Soot/char marks on ground near fires */}
  <ellipse cx="680" cy="348" rx="10" ry="4" fill="#0a0808" opacity="0.06"/>
  <ellipse cx="240" cy="368" rx="8" ry="3.5" fill="#0a0808" opacity="0.05"/>
  <ellipse cx="470" cy="356" rx="7" ry="3" fill="#0a0808" opacity="0.04"/>

  {/* ========================================= */}
  {/* LAYER 8AR: ADDITIONAL CLOUD DETAIL        */}
  {/* ========================================= */}

  {/* Thicker cumulus forming at horizon (backlit by sunrise) */}
  <ellipse cx="620" cy="140" rx="40" ry="8" fill="#5a3838" opacity="0.12"/>
  <ellipse cx="620" cy="138" rx="35" ry="6" fill="#6a4440" opacity="0.08"/>
  <ellipse cx="620" cy="136" rx="28" ry="4" fill="#8a5848" opacity="0.06"/>

  {/* Cloud shadows on sea */}
  <ellipse cx="400" cy="185" rx="30" ry="3" fill="#1a2040" opacity="0.04"/>
  <ellipse cx="300" cy="192" rx="25" ry="2.5" fill="#1a2040" opacity="0.03"/>
  <ellipse cx="500" cy="188" rx="20" ry="2" fill="#1a2040" opacity="0.03"/>

  {/* Higher altitude clouds — mare's tails */}
  <path d="M200,18 Q230,16 260,18 Q285,17 310,19" stroke="#b08060" strokeWidth="0.4" fill="none" opacity="0.06"/>
  <path d="M280,12 Q310,10 340,12 Q365,11 390,13" stroke="#b08060" strokeWidth="0.35" fill="none" opacity="0.05"/>
  <path d="M350,22 Q380,20 410,22 Q440,21 470,23" stroke="#b08060" strokeWidth="0.4" fill="none" opacity="0.05"/>

  {/* ========================================= */}
  {/* LAYER 8AS: WATER SURFACE TEXTURE          */}
  {/* ========================================= */}

  {/* Subtle water ripple pattern */}
  <path d="M0,180 Q20,179 40,180 Q60,181 80,180 Q100,179 120,180 Q140,181 160,180 Q180,179 200,180" stroke="#4a4838" strokeWidth="0.2" fill="none" opacity="0.1"/>
  <path d="M200,180 Q220,179 240,180 Q260,181 280,180 Q300,179 320,180 Q340,181 360,180 Q380,179 400,180" stroke="#4a4838" strokeWidth="0.2" fill="none" opacity="0.1"/>
  <path d="M400,180 Q420,179 440,180 Q460,181 480,180 Q500,179 520,180 Q540,181 560,180 Q580,179 600,180" stroke="#5a4838" strokeWidth="0.2" fill="none" opacity="0.12"/>
  <path d="M600,180 Q620,179 640,180 Q660,181 680,180 Q700,179 720,180 Q740,181 760,180 Q780,179 800,180" stroke="#5a4838" strokeWidth="0.2" fill="none" opacity="0.12"/>

  <path d="M0,190 Q30,189 60,190 Q90,191 120,190 Q150,189 180,190 Q210,191 240,190" stroke="#3a3830" strokeWidth="0.15" fill="none" opacity="0.08"/>
  <path d="M240,190 Q270,189 300,190 Q330,191 360,190 Q390,189 420,190 Q450,191 480,190" stroke="#3a3830" strokeWidth="0.15" fill="none" opacity="0.08"/>
  <path d="M480,190 Q510,189 540,190 Q570,191 600,190 Q630,189 660,190 Q690,191 720,190 Q750,189 780,190 L800,190" stroke="#4a3830" strokeWidth="0.18" fill="none" opacity="0.1"/>

  {/* Reflection of sunrise glow broken by waves */}
  <ellipse cx="600" cy="172" rx="5" ry="0.5" fill="#f0c060" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.08;0.15" dur="1.5s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="615" cy="175" rx="4" ry="0.4" fill="#e8b050" opacity="0.12">
    <animate attributeName="opacity" values="0.12;0.06;0.12" dur="1.8s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="635" cy="178" rx="6" ry="0.5" fill="#e0a848" opacity="0.1">
    <animate attributeName="opacity" values="0.1;0.04;0.1" dur="2.2s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="595" cy="180" rx="4.5" ry="0.4" fill="#d8a040" opacity="0.08">
    <animate attributeName="opacity" values="0.08;0.03;0.08" dur="2s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="650" cy="182" rx="5.5" ry="0.5" fill="#d09838" opacity="0.07">
    <animate attributeName="opacity" values="0.07;0.02;0.07" dur="2.5s" repeatCount="indefinite"/>
  </ellipse>

  {/* ========================================= */}
  {/* LAYER 8AT: ADDITIONAL EQUIPMENT & CAMP    */}
  {/* ========================================= */}

  {/* Powder keg near musket pyramid 2 */}
  <ellipse cx="645" cy="360" rx="3" ry="2.5" fill="#2a2220" opacity="0.35"/>
  <ellipse cx="645" cy="359" rx="3" ry="1" fill="#322a22" opacity="0.25"/>

  {/* Rope coils near wagon */}
  <circle cx="165" cy="348" r="2" fill="none" stroke="#2a2620" strokeWidth="0.6" opacity="0.2"/>
  <circle cx="165" cy="348" r="1.2" fill="none" stroke="#282420" strokeWidth="0.5" opacity="0.15"/>

  {/* Shovel leaning against stone wall */}
  <line x1="288" y1="310" x2="286" y2="330" stroke="#2a2420" strokeWidth="0.8" opacity="0.25"/>
  <path d="M284,330 Q286,334 288,330" fill="#3a3438" opacity="0.2"/>

  {/* Lantern (unlit) hung on tree branch */}
  <rect x="165" y="326" width="2" height="3" fill="#3a3438" opacity="0.2"/>
  <path d="M165,326 Q166,324 167,326" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.15"/>

  {/* Picket stakes for horse tether line */}
  <line x1="86" y1="345" x2="86" y2="338" stroke="#2a2420" strokeWidth="0.6" opacity="0.3"/>
  <line x1="96" y1="347" x2="96" y2="340" stroke="#2a2420" strokeWidth="0.6" opacity="0.3"/>
  <line x1="106" y1="346" x2="106" y2="339" stroke="#2a2420" strokeWidth="0.6" opacity="0.3"/>
  {/* Tether line between stakes */}
  <path d="M86,340 Q91,342 96,340 Q101,342 106,340" stroke="#2a2630" strokeWidth="0.4" fill="none" opacity="0.2"/>

  {/* Hay pile near mules */}
  <ellipse cx="108" cy="360" rx="5" ry="2.5" fill="#2a2818" opacity="0.25"/>
  <path d="M104,359 Q106,356 108,359" stroke="#3a3820" strokeWidth="0.4" fill="none" opacity="0.15"/>
  <path d="M107,359 Q109,355 111,359" stroke="#3a3820" strokeWidth="0.4" fill="none" opacity="0.15"/>

  {/* ========================================= */}
  {/* LAYER 8AU: FINAL REFINEMENT DETAILS       */}
  {/* ========================================= */}

  {/* Subtle ground undulation texture across foreground */}
  <path d="M0,350 Q40,347 80,350 Q120,353 160,349 Q200,352 240,348 Q280,351 320,347 Q360,350 400,346 Q440,349 480,345 Q520,348 560,344 Q600,347 640,343 Q680,346 720,342 Q760,345 800,341" stroke="#1a1820" strokeWidth="0.5" fill="none" opacity="0.06"/>
  <path d="M0,360 Q50,357 100,360 Q150,363 200,359 Q250,362 300,358 Q350,361 400,357 Q450,360 500,356 Q550,359 600,355 Q650,358 700,354 Q750,357 800,353" stroke="#1c1a22" strokeWidth="0.5" fill="none" opacity="0.05"/>
  <path d="M0,370 Q60,367 120,370 Q180,373 240,369 Q300,372 360,368 Q420,371 480,367 Q540,370 600,366 Q660,369 720,365 Q780,368 800,365" stroke="#1a1820" strokeWidth="0.5" fill="none" opacity="0.04"/>

  {/* Subtle dry grass color variation */}
  <ellipse cx="150" cy="348" rx="12" ry="3" fill="#2a2618" opacity="0.04"/>
  <ellipse cx="320" cy="342" rx="10" ry="2.5" fill="#282418" opacity="0.04"/>
  <ellipse cx="500" cy="338" rx="11" ry="3" fill="#2a2618" opacity="0.035"/>
  <ellipse cx="680" cy="342" rx="10" ry="2.5" fill="#2c2818" opacity="0.035"/>

  {/* Moonlight remnant (left sky) — very faint disc */}
  <circle cx="40" cy="25" r="4" fill="#c8c8d8" opacity="0.04"/>
  <circle cx="40" cy="25" r="2.5" fill="#d0d0e0" opacity="0.06"/>

  {/* Faint horizon line definition */}
  <line x1="0" y1="168" x2="800" y2="168" stroke="#3a2828" strokeWidth="0.5" opacity="0.1"/>

  {/* Atmospheric depth — warm/cool divide */}
  <path d="M0,210 Q200,208 400,210 Q600,208 800,210" stroke="#2a2030" strokeWidth="0.8" fill="none" opacity="0.06"/>

  {/* Gentle slope highlight on right where dawn catches */}
  <path d="M600,320 Q650,316 700,318 Q750,314 800,316" stroke="#3a2820" strokeWidth="1" fill="none" opacity="0.06"/>
  <path d="M600,330 Q650,326 700,328 Q750,324 800,326" stroke="#382620" strokeWidth="0.8" fill="none" opacity="0.05"/>

  {/* Final detail: light catching on tent canvas */}
  <path d="M182,342 L196,355" stroke="#3a3028" strokeWidth="0.3" fill="none" opacity="0.08"/>
  <path d="M450,353 L460,362" stroke="#3a3028" strokeWidth="0.3" fill="none" opacity="0.06"/>

  {/* ========================================= */}
  {/* LAYER 8AV: TOWN WATERFRONT DETAIL         */}
  {/* ========================================= */}

  {/* Seawall along waterfront buildings */}
  <path d="M120,210 Q200,208 280,210 Q360,208 440,210 Q520,208 560,210" stroke="#1e1c28" strokeWidth="1.5" fill="none" opacity="0.3"/>
  <path d="M120,212 Q200,210 280,212 Q360,210 440,212 Q520,210 560,212" stroke="#181628" strokeWidth="1" fill="none" opacity="0.2"/>

  {/* Steps from seawall down to water */}
  <line x1="260" y1="210" x2="265" y2="210" stroke="#1e1c28" strokeWidth="0.8" opacity="0.2"/>
  <line x1="259" y1="212" x2="266" y2="212" stroke="#1e1c28" strokeWidth="0.6" opacity="0.15"/>
  <line x1="258" y1="214" x2="267" y2="214" stroke="#1e1c28" strokeWidth="0.6" opacity="0.12"/>

  <line x1="460" y1="210" x2="465" y2="210" stroke="#1e1c28" strokeWidth="0.8" opacity="0.2"/>
  <line x1="459" y1="212" x2="466" y2="212" stroke="#1e1c28" strokeWidth="0.6" opacity="0.15"/>
  <line x1="458" y1="214" x2="467" y2="214" stroke="#1e1c28" strokeWidth="0.6" opacity="0.12"/>

  {/* Waterfront bollards */}
  <circle cx="200" cy="210" r="1" fill="#2a2430" opacity="0.2"/>
  <circle cx="340" cy="210" r="1" fill="#2a2430" opacity="0.2"/>
  <circle cx="500" cy="210" r="1" fill="#2a2430" opacity="0.2"/>

  {/* Low tide waterline marks on seawall */}
  <path d="M130,212 Q160,213 190,212 Q220,213 250,212" stroke="#2a3040" strokeWidth="0.3" fill="none" opacity="0.1"/>
  <path d="M350,212 Q380,213 410,212 Q440,213 470,212" stroke="#2a3040" strokeWidth="0.3" fill="none" opacity="0.1"/>

  {/* ========================================= */}
  {/* LAYER 8AW: BUILDING ARCHITECTURAL DETAIL  */}
  {/* ========================================= */}

  {/* Downspouts/gutters on buildings */}
  <line x1="168" y1="240" x2="168" y2="300" stroke="#2a2430" strokeWidth="0.4" opacity="0.15"/>
  <line x1="242" y1="250" x2="242" y2="300" stroke="#2a2430" strokeWidth="0.4" opacity="0.15"/>
  <line x1="358" y1="255" x2="358" y2="300" stroke="#2a2430" strokeWidth="0.4" opacity="0.15"/>
  <line x1="462" y1="252" x2="462" y2="300" stroke="#2a2430" strokeWidth="0.4" opacity="0.15"/>
  <line x1="528" y1="248" x2="528" y2="300" stroke="#2a2430" strokeWidth="0.4" opacity="0.15"/>

  {/* Chimney pots on buildings */}
  <rect x="153" y="226" width="3" height="4" fill="#3a2828" opacity="0.3"/>
  <rect x="255" y="228" width="3" height="4" fill="#3a2828" opacity="0.28"/>
  <rect x="371" y="230" width="3" height="4" fill="#3a2828" opacity="0.28"/>
  <rect x="447" y="238" width="3" height="4" fill="#3a2828" opacity="0.3"/>
  <rect x="511" y="234" width="3" height="4" fill="#3a2828" opacity="0.28"/>

  {/* Window boxes/flower boxes on some windows */}
  <rect x="186" y="274" width="7" height="1.5" fill="#1a2018" opacity="0.2"/>
  <rect x="342" y="270" width="7" height="1.5" fill="#1a2018" opacity="0.18"/>
  <rect x="448" y="266" width="7" height="1.5" fill="#1a2018" opacity="0.18"/>

  {/* Staircase suggestion on building facade */}
  <line x1="504" y1="286" x2="504" y2="300" stroke="#2a2430" strokeWidth="0.3" opacity="0.12"/>
  <line x1="504" y1="288" x2="508" y2="288" stroke="#2a2430" strokeWidth="0.3" opacity="0.1"/>
  <line x1="504" y1="291" x2="508" y2="291" stroke="#2a2430" strokeWidth="0.3" opacity="0.1"/>
  <line x1="504" y1="294" x2="508" y2="294" stroke="#2a2430" strokeWidth="0.3" opacity="0.1"/>
  <line x1="504" y1="297" x2="508" y2="297" stroke="#2a2430" strokeWidth="0.3" opacity="0.1"/>

  {/* ========================================= */}
  {/* LAYER 8AX: ADDITIONAL STAR CONSTELLATIONS */}
  {/* ========================================= */}

  {/* Orion's Belt — recognizable pattern in western sky */}
  <circle cx="85" cy="45" r="0.7" fill="#c0c0d0" opacity="0.17">
    <animate attributeName="opacity" values="0.17;0.08;0.17" dur="5.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="92" cy="43" r="0.7" fill="#c0c0d0" opacity="0.16">
    <animate attributeName="opacity" values="0.16;0.07;0.16" dur="5.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="99" cy="41" r="0.7" fill="#c0c0d0" opacity="0.15">
    <animate attributeName="opacity" values="0.15;0.06;0.15" dur="6s" repeatCount="indefinite"/>
  </circle>

  {/* Betelgeuse (red tint) */}
  <circle cx="78" cy="34" r="0.8" fill="#d0a8a0" opacity="0.14">
    <animate attributeName="opacity" values="0.14;0.06;0.14" dur="5s" repeatCount="indefinite"/>
  </circle>

  {/* Rigel (blue-white) */}
  <circle cx="102" cy="56" r="0.8" fill="#b0b8d0" opacity="0.13">
    <animate attributeName="opacity" values="0.13;0.05;0.13" dur="5.3s" repeatCount="indefinite"/>
  </circle>

  {/* Scattered dim stars filling upper-left */}
  <circle cx="15" cy="18" r="0.4" fill="#a0a0b0" opacity="0.1">
    <animate attributeName="opacity" values="0.1;0.04;0.1" dur="7s" repeatCount="indefinite"/>
  </circle>
  <circle cx="135" cy="12" r="0.4" fill="#a0a0b0" opacity="0.09">
    <animate attributeName="opacity" values="0.09;0.03;0.09" dur="7.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="210" cy="30" r="0.4" fill="#a0a0b0" opacity="0.08">
    <animate attributeName="opacity" values="0.08;0.02;0.08" dur="8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="250" cy="15" r="0.4" fill="#a0a0b0" opacity="0.08">
    <animate attributeName="opacity" values="0.08;0.03;0.08" dur="7.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="48" cy="58" r="0.35" fill="#9898a8" opacity="0.07">
    <animate attributeName="opacity" values="0.07;0.02;0.07" dur="8.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="115" cy="50" r="0.35" fill="#9898a8" opacity="0.07">
    <animate attributeName="opacity" values="0.07;0.02;0.07" dur="9s" repeatCount="indefinite"/>
  </circle>
  <circle cx="165" cy="32" r="0.3" fill="#9898a8" opacity="0.06">
    <animate attributeName="opacity" values="0.06;0.02;0.06" dur="8.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="280" cy="8" r="0.35" fill="#a0a0b0" opacity="0.07">
    <animate attributeName="opacity" values="0.07;0.02;0.07" dur="7.8s" repeatCount="indefinite"/>
  </circle>

  {/* ========================================= */}
  {/* LAYER 8AY: ENHANCED ROCK FACE DETAIL      */}
  {/* ========================================= */}

  {/* Large rock outcrop detail — right foreground */}
  <path d="M730,338 Q735,332 742,334" stroke="#3a3438" strokeWidth="0.4" fill="none" opacity="0.2"/>
  <path d="M735,340 Q740,336 746,338" stroke="#363038" strokeWidth="0.3" fill="none" opacity="0.15"/>
  <path d="M740,344 Q744,340 750,342" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.15"/>

  {/* Left rock outcrop — layered detail */}
  <path d="M52,354 Q56,350 60,352" stroke="#3a3438" strokeWidth="0.4" fill="none" opacity="0.2"/>
  <path d="M54,356 Q58,352 62,354" stroke="#363038" strokeWidth="0.3" fill="none" opacity="0.15"/>
  <path d="M56,358 Q60,355 64,357" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.15"/>

  {/* Center rock cluster refinement */}
  <path d="M482,338 Q486,334 490,336" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.18"/>
  <path d="M484,340 Q488,337 492,339" stroke="#363038" strokeWidth="0.3" fill="none" opacity="0.14"/>
  <path d="M522,354 Q525,350 528,352" stroke="#3a3438" strokeWidth="0.3" fill="none" opacity="0.16"/>
  <path d="M524,356 Q527,353 530,355" stroke="#363038" strokeWidth="0.25" fill="none" opacity="0.12"/>

  {/* Quartz veins in rocks (very subtle white lines) */}
  <line x1="55" y1="352" x2="65" y2="350" stroke="#5a5860" strokeWidth="0.2" opacity="0.06"/>
  <line x1="485" y1="336" x2="494" y2="338" stroke="#5a5860" strokeWidth="0.2" opacity="0.05"/>
  <line x1="735" y1="334" x2="745" y2="336" stroke="#5a5860" strokeWidth="0.2" opacity="0.05"/>

  {/* ========================================= */}
  {/* LAYER 8AZ: FINAL VEGETATION TOUCHES       */}
  {/* ========================================= */}

  {/* Moss on north side of rocks */}
  <ellipse cx="54" cy="356" rx="3" ry="1.5" fill="#1a2818" opacity="0.12"/>
  <ellipse cx="484" cy="340" rx="2.5" ry="1.2" fill="#182618" opacity="0.1"/>
  <ellipse cx="524" cy="356" rx="2" ry="1" fill="#1a2818" opacity="0.1"/>
  <ellipse cx="735" cy="342" rx="2.5" ry="1.2" fill="#1c2818" opacity="0.1"/>

  {/* Fern frond near shaded rock (left) */}
  <path d="M48,358 Q46,354 44,350" stroke="#1a2818" strokeWidth="0.6" fill="none" opacity="0.15"/>
  <path d="M46,354 Q44,352 42,354" stroke="#1a2818" strokeWidth="0.3" fill="none" opacity="0.1"/>
  <path d="M47,356 Q45,354 43,356" stroke="#1a2818" strokeWidth="0.3" fill="none" opacity="0.1"/>

  {/* Dry autumn leaf caught in grass */}
  <ellipse cx="310" cy="348" rx="1.5" ry="0.8" fill="#3a2818" opacity="0.08" transform="rotate(30 310 348)"/>
  <ellipse cx="580" cy="340" rx="1.5" ry="0.8" fill="#382618" opacity="0.07" transform="rotate(-20 580 340)"/>
  <ellipse cx="440" cy="337" rx="1.2" ry="0.6" fill="#3a2818" opacity="0.06" transform="rotate(15 440 337)"/>

  {/* Grass seed heads silhouetted against sky */}
  <line x1="745" y1="330" x2="745" y2="320" stroke="#1e2818" strokeWidth="0.3" opacity="0.15"/>
  <circle cx="745" cy="319" r="0.8" fill="#1e2818" opacity="0.1"/>
  <line x1="750" y1="332" x2="750" y2="323" stroke="#1e2818" strokeWidth="0.3" opacity="0.12"/>
  <circle cx="750" cy="322" r="0.7" fill="#1e2818" opacity="0.08"/>

  {/* Clover patch in foreground */}
  <circle cx="400" cy="375" r="1" fill="#1a2218" opacity="0.1"/>
  <circle cx="402" cy="374" r="1" fill="#182018" opacity="0.09"/>
  <circle cx="401" cy="376" r="1" fill="#1a2218" opacity="0.09"/>
  <circle cx="399" cy="374" r="0.8" fill="#182018" opacity="0.08"/>

  {/* Additional ground scrub along slope transition */}
  <ellipse cx="180" cy="310" rx="8" ry="3" fill="#1a2218" opacity="0.35"/>
  <ellipse cx="350" cy="306" rx="9" ry="3.5" fill="#182018" opacity="0.32"/>
  <ellipse cx="520" cy="303" rx="10" ry="3.5" fill="#1a2418" opacity="0.33"/>
  <ellipse cx="680" cy="300" rx="8" ry="3" fill="#1e2818" opacity="0.3"/>

  {/* ========================================= */}
  {/* LAYER 8BA: FINAL ATMOSPHERE & LIGHT       */}
  {/* ========================================= */}

  {/* Warm glow rim on right-side elements (sunrise catching) */}
  {/* Sentry warm rim */}
  <line x1="765" y1="333" x2="765" y2="366" stroke="#4a3828" strokeWidth="0.3" opacity="0.15"/>

  {/* Officer tent warm rim */}
  <path d="M196,355 L182,342" stroke="#3a3028" strokeWidth="0.4" fill="none" opacity="0.06"/>

  {/* Right headland warm rim enhancement */}
  <path d="M700,192 Q720,190 740,192 Q760,194 780,197" stroke="#4a3028" strokeWidth="0.4" fill="none" opacity="0.12"/>

  {/* Atmosphere: warm color bleeding into sky from sunrise point */}
  <ellipse cx="620" cy="160" rx="100" ry="20" fill="#e8a050" opacity="0.03" filter="url(#vtC_softGlow)"/>

  {/* Cool ambient fill in shadows (left side of scene) */}
  <ellipse cx="100" cy="350" rx="80" ry="30" fill="#1a2040" opacity="0.02"/>

  {/* Warm ambient fill on ground (right side) */}
  <ellipse cx="700" cy="350" rx="80" ry="30" fill="#3a2420" opacity="0.02"/>

  {/* Final sparkle — morning dew catching first light */}
  <circle cx="750" cy="332" r="0.4" fill="#f0d878" opacity="0.08">
    <animate attributeName="opacity" values="0.08;0.03;0.08" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="720" cy="338" r="0.3" fill="#f0d878" opacity="0.06">
    <animate attributeName="opacity" values="0.06;0.02;0.06" dur="2.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="765" cy="345" r="0.3" fill="#f0d878" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0.02;0.05" dur="3s" repeatCount="indefinite"/>
  </circle>

  {/* Light catching on bayonet tips */}
  <circle cx="214" cy="350" r="0.5" fill="#e0c880" opacity="0.06">
    <animate attributeName="opacity" values="0.06;0.02;0.06" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="654" cy="335" r="0.5" fill="#e0c880" opacity="0.06">
    <animate attributeName="opacity" values="0.06;0.02;0.06" dur="2.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="494" cy="341" r="0.5" fill="#e0c880" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0.02;0.05" dur="2.5s" repeatCount="indefinite"/>
  </circle>

  {/* ========================================= */}
  {/* LAYER 8BB: PATH & ROAD NETWORK DETAIL     */}
  {/* ========================================= */}

  {/* Mule path winding from camp down to town */}
  <path d="M140,358 Q160,352 180,348 Q200,344 220,340 Q240,336 260,332 Q280,328 300,324 Q320,320 340,318" stroke="#1e1a24" strokeWidth="2" fill="none" opacity="0.08"/>
  <path d="M140,358 Q160,352 180,348 Q200,344 220,340 Q240,336 260,332 Q280,328 300,324 Q320,320 340,318" stroke="#181624" strokeWidth="1" fill="none" opacity="0.05"/>

  {/* Secondary path branching to right campfires */}
  <path d="M340,318 Q380,322 420,328 Q460,334 500,340 Q540,346 580,350 Q620,354 660,356" stroke="#1e1a24" strokeWidth="1.5" fill="none" opacity="0.06"/>

  {/* Cart track ruts on main path */}
  <path d="M142,356 Q162,350 182,346 Q202,342 222,338" stroke="#181620" strokeWidth="0.5" fill="none" opacity="0.04"/>
  <path d="M144,360 Q164,354 184,350 Q204,346 224,342" stroke="#181620" strokeWidth="0.5" fill="none" opacity="0.04"/>

  {/* ========================================= */}
  {/* LAYER 8BC: DISTANT TOWN GARDEN DETAIL     */}
  {/* ========================================= */}

  {/* Garden walls behind buildings */}
  <path d="M580,280 Q590,278 600,280" stroke="#2a2430" strokeWidth="0.6" fill="none" opacity="0.15"/>
  <path d="M130,285 Q140,283 150,285" stroke="#2a2430" strokeWidth="0.6" fill="none" opacity="0.15"/>

  {/* Fruit trees in town gardens (small rounded shapes) */}
  <circle cx="590" cy="278" r="3" fill="#141c14" opacity="0.2"/>
  <circle cx="140" cy="283" r="3" fill="#121a12" opacity="0.18"/>
  <circle cx="580" cy="276" r="2.5" fill="#161e16" opacity="0.15"/>

  {/* Vegetable plot suggestions */}
  <rect x="585" y="280" width="8" height="4" fill="#141c14" opacity="0.08"/>
  <line x1="587" y1="280" x2="587" y2="284" stroke="#1a2218" strokeWidth="0.2" opacity="0.06"/>
  <line x1="589" y1="280" x2="589" y2="284" stroke="#1a2218" strokeWidth="0.2" opacity="0.06"/>
  <line x1="591" y1="280" x2="591" y2="284" stroke="#1a2218" strokeWidth="0.2" opacity="0.06"/>

  {/* ========================================= */}
  {/* LAYER 8BD: FOREGROUND INSECT DETAIL       */}
  {/* ========================================= */}

  {/* Fireflies near camp (barely visible warm dots) */}
  <circle cx="250" cy="362" r="0.4" fill="#e0c060" opacity="0.06">
    <animate attributeName="opacity" values="0.06;0;0.06" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="478" cy="350" r="0.35" fill="#e0c060" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0;0.05" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="688" cy="342" r="0.35" fill="#e0c060" opacity="0.05">
    <animate attributeName="opacity" values="0.05;0;0.05" dur="4s" repeatCount="indefinite"/>
  </circle>

  {/* ========================================= */}
  {/* LAYER 8BE: ADDITIONAL FOREGROUND STONES   */}
  {/* ========================================= */}

  {/* Larger weathered stones in immediate foreground */}
  <path d="M20,392 Q25,386 32,388 Q38,384 44,388 Q48,392 42,396 Q32,398 22,395 Z" fill="#2a2630" opacity="0.3"/>
  <path d="M22,393 Q26,388 34,390 Q40,387 44,390" stroke="#353040" strokeWidth="0.4" fill="none" opacity="0.15"/>

  <path d="M770,388 Q774,382 780,384 Q786,380 792,384 Q795,388 790,392 Q782,394 772,391 Z" fill="#2c2830" opacity="0.28"/>
  <path d="M772,389 Q776,384 782,386 Q788,383 792,386" stroke="#363240" strokeWidth="0.4" fill="none" opacity="0.13"/>

  {/* Small loose stones on path */}
  <circle cx="348" cy="352" r="0.8" fill="#2a2630" opacity="0.15"/>
  <circle cx="355" cy="350" r="0.6" fill="#282430" opacity="0.12"/>
  <circle cx="350" cy="355" r="0.5" fill="#2a2630" opacity="0.1"/>
  <circle cx="600" cy="345" r="0.7" fill="#2a2630" opacity="0.14"/>
  <circle cx="605" cy="343" r="0.5" fill="#282430" opacity="0.11"/>

  {/* ========================================= */}
  {/* LAYER 8BF: ATMOSPHERE — FINAL DEPTH       */}
  {/* ========================================= */}

  {/* Aerial perspective — very subtle blue haze on distant elements */}
  <rect x="0" y="160" width="800" height="60" fill="#1a2040" opacity="0.015"/>

  {/* Warm atmosphere band near ground level */}
  <rect x="0" y="320" width="800" height="40" fill="#2a1c18" opacity="0.01"/>

  {/* Final subtle sea mist along coastline */}
  <path d="M0,208 Q100,206 200,208 Q300,206 400,208 Q500,206 600,208 Q700,206 800,208" stroke="#8890a0" strokeWidth="2" fill="none" opacity="0.03"/>

  {/* ========================================= */}
  {/* LAYER 9: ATMOSPHERIC OVERLAYS             */}
  {/* ========================================= */}
  {/* Sunrise atmospheric glow */}
  <rect x="0" y="0" width="800" height="400" fill="url(#vtC_sunriseGlow)"/>

  {/* Additional warm sunrise wash on right third */}
  <rect x="500" y="0" width="300" height="400" fill="#e8a050" opacity="0.02"/>

  {/* Cool pre-dawn wash on left third */}
  <rect x="0" y="0" width="300" height="400" fill="#1a2040" opacity="0.02"/>

  {/* Ground-level morning mist bands */}
  <rect x="0" y="360" width="800" height="15" fill="url(#vtC_groundMist)" opacity="0.6"/>
  <rect x="0" y="370" width="800" height="12" fill="url(#vtC_groundMist)" opacity="0.4"/>
  <rect x="0" y="380" width="800" height="10" fill="url(#vtC_groundMist)" opacity="0.25"/>
  <rect x="100" y="300" width="500" height="10" fill="url(#vtC_mist)" opacity="0.5"/>

  {/* Valley mist between town and hillside */}
  <rect x="50" y="290" width="600" height="15" fill="url(#vtC_mist)" opacity="0.3"/>
  <ellipse cx="400" cy="295" rx="250" ry="8" fill="#8890a0" opacity="0.04"/>

  {/* Edge vignette */}
  <rect x="0" y="0" width="800" height="400" fill="url(#vtC_vignette)"/>

  {/* Warm tint lower-right */}
  <rect x="400" y="200" width="400" height="200" fill="#e8a050" opacity="0.03"/>

  {/* Final color grading — subtle blue-orange split tone */}
  <rect x="0" y="0" width="400" height="200" fill="#1a2848" opacity="0.015"/>
  <rect x="400" y="200" width="400" height="200" fill="#483018" opacity="0.015"/>

      </svg>
    </div>
  );
}
