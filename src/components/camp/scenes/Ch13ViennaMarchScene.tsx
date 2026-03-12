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

      {/* === ALPINE PEAKS — LEFT MASSIF === */}
      {/* Far left peak — towering, shadowed */}
      <path d="M0 90 Q30 40 70 60 Q110 20 150 55 Q180 70 200 100 L200 240 L0 240 Z"
        fill="url(#ch13_rock)" opacity="0.85" />
      {/* Snow on left peak ridgeline */}
      <path d="M108 22 Q115 15 125 22 Q135 30 145 38 Q150 42 155 55 Q145 35 130 26 Q120 20 108 22 Z"
        fill="url(#ch13_snowShade)" opacity="0.6" />
      <path d="M28 42 Q35 32 45 38 Q55 44 65 55 Q55 42 42 35 Q35 34 28 42 Z"
        fill="url(#ch13_snowShade)" opacity="0.5" />

      {/* Mid-left peak — closer, dawn-lit edge */}
      <path d="M120 130 Q160 70 210 95 Q240 80 270 110 Q290 130 310 160 L310 260 L120 260 Z"
        fill="url(#ch13_rockLit)" opacity="0.75" />
      {/* Snow cap on mid-left */}
      <path d="M158 72 Q168 60 178 68 Q190 76 200 85 Q210 78 220 95 Q200 80 185 72 Q172 66 158 72 Z"
        fill="url(#ch13_snowLit)" opacity="0.5" />
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

      {/* Mid-right peak — dawn-lit */}
      <path d="M500 165 Q540 90 580 115 Q620 80 660 110 Q690 130 700 160 L700 260 L500 260 Z"
        fill="url(#ch13_rockLit)" opacity="0.7" />
      {/* Snow cap on mid-right */}
      <path d="M538 92 Q548 78 560 88 Q572 95 580 105 Q585 98 595 115 Q580 100 565 90 Q552 84 538 92 Z"
        fill="url(#ch13_snowLit)" opacity="0.55" />
      {/* Crevasse detail */}
      <path d="M570 115 Q575 130 572 150" fill="none" stroke="#1a1a20" strokeWidth="0.7" opacity="0.25" />
      <path d="M620 120 Q628 138 625 158" fill="none" stroke="#1a1a20" strokeWidth="0.5" opacity="0.2" />

      {/* === MOUNTAIN GAP — the pass, with dawn light beyond === */}
      {/* Green valley visible through the gap */}
      <path d="M310 160 Q350 140 400 135 Q450 140 500 165 L500 220 L310 220 Z"
        fill="url(#ch13_meadow)" opacity="0.35" />
      {/* Distant rolling hills through the gap */}
      <path d="M320 170 Q360 162 400 158 Q440 162 480 170 L480 195 L320 195 Z"
        fill="#2a4520" opacity="0.2" />

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

      {/* Treeline transition — scattered smaller pines at higher elevation */}
      <path d="M230 145 L226 158 L234 158 Z" fill="url(#ch13_pine)" opacity="0.35" />
      <path d="M255 150 L251 162 L259 162 Z" fill="url(#ch13_pine)" opacity="0.3" />
      <path d="M550 148 L546 160 L554 160 Z" fill="url(#ch13_pine)" opacity="0.3" />
      <path d="M530 155 L526 166 L534 166 Z" fill="url(#ch13_pine)" opacity="0.28" />

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

      {/* Soldiers near the flag bearer */}
      <path d="M414 224 Q412 216 414 210 Q416 205 418 210 L420 224 Z"
        fill="#151510" opacity="0.6" />
      <circle cx="416" cy="205" r="3.2" fill="#151510" opacity="0.6" />
      {/* Musket on shoulder */}
      <line x1="420" y1="206" x2="424" y2="192" stroke="#151510" strokeWidth="0.8" opacity="0.4" />

      <path d="M432 222 Q430 214 432 208 Q434 203 436 208 L438 222 Z"
        fill="#151510" opacity="0.58" />
      <circle cx="434" cy="203" r="3" fill="#151510" opacity="0.58" />

      {/* Main group — closer, more detailed */}
      {/* Soldier 1 — striding forward */}
      <path d="M385 278 Q383 268 385 260 Q387 254 389 260 L391 278 Q390 286 389 292 L385 292 Z"
        fill="#151510" opacity="0.75" />
      <circle cx="387" cy="254" r="4.5" fill="#151510" opacity="0.75" />
      {/* Pack on back */}
      <rect x="389" y="260" width="5" height="6" rx="1" fill="#1a1a18" opacity="0.5" />
      {/* Musket */}
      <line x1="381" y1="256" x2="378" y2="292" stroke="#151510" strokeWidth="1" opacity="0.5" />

      {/* Soldier 2 */}
      <path d="M398 272 Q396 262 398 254 Q400 249 402 254 L404 272 Q403 280 402 286 L398 286 Z"
        fill="#151510" opacity="0.72" />
      <circle cx="400" cy="249" r="4.2" fill="#151510" opacity="0.72" />
      <line x1="405" y1="250" x2="408" y2="236" stroke="#151510" strokeWidth="0.8" opacity="0.45" />
      <rect x="402" y="254" width="4" height="5" rx="1" fill="#1a1a18" opacity="0.45" />

      {/* Soldiers further back along the road */}
      <path d="M370 310 Q368 302 370 296 Q372 291 374 296 L376 310 Z"
        fill="#151510" opacity="0.65" />
      <circle cx="372" cy="291" r="3.8" fill="#151510" opacity="0.65" />

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
