import { $ } from './dom';

export function renderCampSceneArt() {
  const el = $('camp-scene-art');
  if (el.children.length > 0) return; // already rendered
  el.innerHTML = `
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="csSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#050a18"/>
          <stop offset="40%" stop-color="#0a1228"/>
          <stop offset="100%" stop-color="#101830"/>
        </linearGradient>
        <radialGradient id="csMoonGlow" cx="700" cy="50" r="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#aabbcc" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="csFireGlow" cx="400" cy="340" r="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#b8661a" stop-opacity="0.3"/>
          <stop offset="35%" stop-color="#8b4513" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#050a18" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="csGroundGlow" cx="400" cy="380" r="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2a1508" stop-opacity="1"/>
          <stop offset="50%" stop-color="#12100a" stop-opacity="1"/>
          <stop offset="100%" stop-color="#080c14" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="csMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1a2540" stop-opacity="0"/>
          <stop offset="60%" stop-color="#1a2540" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0e1520" stop-opacity="0.5"/>
        </linearGradient>
        <radialGradient id="csDistFire">
          <stop offset="0%" stop-color="#ffaa33" stop-opacity="0.7"/>
          <stop offset="50%" stop-color="#cc6600" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#cc6600" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="csSmoke">
          <stop offset="0%" stop-color="#555" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#333" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#csSky)"/>
      <circle cx="45" cy="22" r="1.0" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="95" cy="45" r="0.6" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="130" cy="15" r="1.3" fill="#d0c8b8" opacity="0.8"/>
      <circle cx="175" cy="58" r="0.8" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="210" cy="28" r="0.7" fill="#d0c8b8" opacity="0.6"/>
      <circle cx="260" cy="12" r="1.1" fill="#d0c8b8" opacity="0.9"/>
      <circle cx="290" cy="48" r="0.6" fill="#d0c8b8" opacity="0.3"/>
      <circle cx="330" cy="32" r="0.9" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="370" cy="8" r="1.2" fill="#d0c8b8" opacity="0.6"/>
      <circle cx="410" cy="52" r="0.7" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="460" cy="20" r="1.0" fill="#d0c8b8" opacity="0.8"/>
      <circle cx="510" cy="40" r="0.8" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="550" cy="18" r="1.1" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="590" cy="55" r="0.6" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="630" cy="30" r="0.9" fill="#d0c8b8" opacity="0.6"/>
      <circle cx="700" cy="38" r="0.7" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="750" cy="15" r="1.0" fill="#d0c8b8" opacity="0.7"/>
      <circle cx="160" cy="80" r="0.5" fill="#d0c8b8" opacity="0.3"/>
      <circle cx="420" cy="72" r="0.8" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="540" cy="68" r="0.6" fill="#d0c8b8" opacity="0.5"/>
      <circle cx="75" cy="65" r="0.7" fill="#d0c8b8" opacity="0.35"/>
      <circle cx="780" cy="48" r="0.5" fill="#d0c8b8" opacity="0.4"/>
      <circle cx="700" cy="50" r="12" fill="#c8c0a0" opacity="0.9"/>
      <circle cx="706" cy="46" r="10" fill="#050a18"/>
      <circle cx="700" cy="50" r="80" fill="url(#csMoonGlow)"/>
      <path d="M0,200 L40,170 L80,185 L140,140 L180,158 L230,115 L280,145 L320,125 L370,150 L420,105 L470,135 L510,118 L550,145 L600,100 L650,130 L690,115 L730,140 L770,128 L800,150 L800,400 L0,400 Z" fill="#0e1525" opacity="0.7"/>
      <path d="M0,240 L30,215 L70,228 L120,180 L160,205 L200,168 L260,195 L300,158 L350,185 L400,148 L440,172 L490,152 L530,180 L580,142 L630,168 L670,148 L720,175 L760,160 L800,185 L800,400 L0,400 Z" fill="#0c1220" opacity="0.85"/>
      <path d="M228,115 L220,128 L238,128 Z" fill="#2a3050" opacity="0.5"/>
      <path d="M418,105 L410,118 L428,118 Z" fill="#2a3050" opacity="0.5"/>
      <path d="M578,142 L570,155 L588,155 Z" fill="#2a3050" opacity="0.5"/>
      <path d="M298,158 L290,170 L308,170 Z" fill="#2a3050" opacity="0.4"/>
      <path d="M0,285 L50,260 L100,272 L150,245 L200,265 L260,238 L310,258 L360,232 L410,252 L450,238 L500,258 L550,235 L600,252 L650,230 L700,250 L750,242 L800,258 L800,400 L0,400 Z" fill="#0a0e18"/>
      <rect x="0" y="260" width="800" height="80" fill="url(#csMist)"/>
      <circle cx="120" cy="268" r="4" fill="url(#csDistFire)"/><circle cx="120" cy="268" r="1.2" fill="#ffcc44" opacity="0.8"/>
      <circle cx="140" cy="262" r="3" fill="url(#csDistFire)"/><circle cx="140" cy="262" r="0.8" fill="#ffcc44" opacity="0.7"/>
      <circle cx="108" cy="272" r="2.5" fill="url(#csDistFire)"/><circle cx="108" cy="272" r="0.7" fill="#ffaa33" opacity="0.6"/>
      <circle cx="280" cy="252" r="3.5" fill="url(#csDistFire)"/><circle cx="280" cy="252" r="1.0" fill="#ffcc44" opacity="0.8"/>
      <circle cx="300" cy="255" r="3" fill="url(#csDistFire)"/><circle cx="300" cy="255" r="0.8" fill="#ffaa33" opacity="0.7"/>
      <circle cx="520" cy="252" r="3.5" fill="url(#csDistFire)"/><circle cx="520" cy="252" r="1.0" fill="#ffcc44" opacity="0.8"/>
      <circle cx="600" cy="248" r="3.5" fill="url(#csDistFire)"/><circle cx="600" cy="248" r="1.0" fill="#ffcc44" opacity="0.8"/>
      <circle cx="620" cy="244" r="2.5" fill="url(#csDistFire)"/><circle cx="620" cy="244" r="0.7" fill="#ffaa33" opacity="0.6"/>
      <circle cx="720" cy="246" r="3" fill="url(#csDistFire)"/><circle cx="720" cy="246" r="0.9" fill="#ffcc44" opacity="0.7"/>
      <circle cx="200" cy="262" r="2" fill="url(#csDistFire)"/><circle cx="200" cy="262" r="0.6" fill="#ffaa33" opacity="0.5"/>
      <circle cx="430" cy="248" r="2.5" fill="url(#csDistFire)"/><circle cx="430" cy="248" r="0.7" fill="#ffcc44" opacity="0.6"/>
      <circle cx="680" cy="242" r="2" fill="url(#csDistFire)"/><circle cx="680" cy="242" r="0.6" fill="#ffaa33" opacity="0.5"/>
      <circle cx="350" cy="245" r="2" fill="url(#csDistFire)"/><circle cx="350" cy="245" r="0.6" fill="#ffaa33" opacity="0.45"/>
      <circle cx="430" cy="248" r="5" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.3">
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="120" cy="268" r="4" fill="none" stroke="#cc6600" stroke-width="0.5" opacity="0.25">
        <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <path d="M0,310 Q100,295 200,308 Q300,318 400,300 Q500,288 600,302 Q700,315 800,298 L800,400 L0,400 Z" fill="url(#csGroundGlow)"/>
      <rect x="100" y="200" width="600" height="200" fill="url(#csFireGlow)"/>
      <ellipse cx="395" cy="220" rx="25" ry="40" fill="url(#csSmoke)"/>
      <ellipse cx="408" cy="175" rx="18" ry="32" fill="url(#csSmoke)"/>
      <ellipse cx="388" cy="140" rx="14" ry="28" fill="url(#csSmoke)"/>
      <line x1="380" y1="355" x2="420" y2="348" stroke="#2a1a0a" stroke-width="5" stroke-linecap="round"/>
      <line x1="385" y1="348" x2="415" y2="355" stroke="#2a1a0a" stroke-width="4" stroke-linecap="round"/>
      <line x1="390" y1="352" x2="410" y2="352" stroke="#1a1005" stroke-width="4" stroke-linecap="round"/>
      <path d="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z" fill="#dd6611" opacity="0.9">
        <animate attributeName="d" values="M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z;M400,290 Q390,315 383,340 Q392,328 400,316 Q408,328 417,340 Q410,315 400,290Z;M400,295 Q392,318 385,340 Q393,330 400,320 Q407,330 415,340 Q408,318 400,295Z" dur="0.8s" repeatCount="indefinite"/>
      </path>
      <path d="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z" fill="#ee9922" opacity="0.85">
        <animate attributeName="d" values="M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z;M400,301 Q394,320 388,338 Q395,326 400,315 Q405,326 412,338 Q406,320 400,301Z;M400,305 Q395,322 390,338 Q396,328 400,318 Q404,328 410,338 Q405,322 400,305Z" dur="0.6s" repeatCount="indefinite"/>
      </path>
      <path d="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z" fill="#ffcc44" opacity="0.8">
        <animate attributeName="d" values="M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z;M400,309 Q396,324 393,336 Q397,326 400,317 Q403,326 407,336 Q404,324 400,309Z;M400,312 Q397,326 394,336 Q398,328 400,320 Q402,328 406,336 Q403,326 400,312Z" dur="0.5s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="400" cy="350" rx="25" ry="6" fill="#cc5500" opacity="0.4">
        <animate attributeName="rx" values="25;28;25" dur="0.7s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.5;0.4" dur="0.7s" repeatCount="indefinite"/>
      </ellipse>
      <circle cx="395" cy="285" r="1.5" fill="#ffaa22" opacity="0.8">
        <animate attributeName="cy" values="295;255;215" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.5;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="395;390;388" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="405" cy="280" r="1.0" fill="#ff8811" opacity="0.7">
        <animate attributeName="cy" values="290;245;200" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="405;410;415" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="400" cy="287" r="1.2" fill="#ffcc44" opacity="0.6">
        <animate attributeName="cy" values="293;240;185" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.3;0" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="400;397;393" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="398" cy="283" r="0.8" fill="#ff9933" opacity="0.7">
        <animate attributeName="cy" values="291;250;210" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.4;0" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="398;403;408" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <g fill="#0e0e10">
        <path d="M290,362 Q298,354 310,360 Q315,364 320,367 L285,367 Z"/>
        <path d="M292,360 Q290,342 294,327 Q296,318 300,312 L314,312 Q310,318 308,327 Q306,342 308,360 Z"/>
        <path d="M290,357 Q285,362 282,370 L295,367 Z" fill="#0c0c0e"/>
        <path d="M310,357 Q315,362 318,370 L305,367 Z" fill="#0c0c0e"/>
        <line x1="296" y1="317" x2="312" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="312" y1="317" x2="296" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="300" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="302" y="307" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="307" cy="301" rx="8" ry="9"/>
        <path d="M293,298 Q300,290 307,287 Q314,290 321,298 Q314,295 307,294 Q300,295 293,298 Z" fill="#0c0c0e"/>
        <path d="M290,300 Q292,292 298,288 L295,297 Z" fill="#0a0a0c"/>
        <path d="M324,300 Q322,292 316,288 L319,297 Z" fill="#0a0a0c"/>
        <circle cx="307" cy="292" r="2.5" fill="#141418"/>
        <path d="M312,320 Q325,324 340,330 L342,334 Q326,330 312,326 Z"/>
        <path d="M296,320 Q308,326 325,332 L324,336 Q306,330 295,324 Z"/>
        <line x1="280" y1="367" x2="286" y2="270" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="286" y1="274" x2="287" y2="264" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="287" y1="264" x2="288" y2="256" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
      </g>
      <g fill="#0e0e10">
        <path d="M340,364 Q348,356 358,362 Q363,366 365,370 L335,370 Z"/>
        <path d="M342,362 Q340,340 343,327 Q345,318 349,312 L363,312 Q359,318 357,327 Q354,340 356,362 Z"/>
        <path d="M340,360 Q336,365 333,372 L344,368 Z" fill="#0c0c0e"/>
        <line x1="346" y1="317" x2="360" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="360" y1="317" x2="346" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="349" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="352" y="307" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="357" cy="301" rx="8" ry="9"/>
        <path d="M343,298 Q350,290 357,287 Q364,290 371,298 Q364,295 357,294 Q350,295 343,298 Z" fill="#0c0c0e"/>
        <path d="M340,300 Q342,292 348,288 L345,297 Z" fill="#0a0a0c"/>
        <path d="M374,300 Q372,292 366,288 L369,297 Z" fill="#0a0a0c"/>
        <circle cx="357" cy="292" r="2.5" fill="#141418"/>
        <path d="M345,327 Q342,340 340,350 L344,352 Q345,342 347,330 Z"/>
        <path d="M360,327 Q363,340 365,350 L361,352 Q360,342 358,330 Z"/>
      </g>
      <g fill="#0e0e10">
        <path d="M460,364 Q452,356 442,362 Q437,366 435,370 L465,370 Z"/>
        <path d="M458,362 Q460,340 457,325 Q454,316 450,310 L436,312 Q440,318 443,327 Q446,340 444,362 Z"/>
        <path d="M460,360 Q464,365 467,372 L456,368 Z" fill="#0c0c0e"/>
        <line x1="453" y1="317" x2="439" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="439" y1="317" x2="453" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="442" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="443" y="305" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="443" cy="299" rx="8" ry="9"/>
        <path d="M457,296 Q450,288 443,285 Q436,288 429,296 Q436,293 443,292 Q450,293 457,296 Z" fill="#0c0c0e"/>
        <path d="M460,298 Q458,290 452,286 L455,295 Z" fill="#0a0a0c"/>
        <path d="M426,298 Q428,290 434,286 L431,295 Z" fill="#0a0a0c"/>
        <circle cx="443" cy="290" r="2.5" fill="#141418"/>
        <path d="M438,320 Q430,327 425,332 Q422,330 428,322 Q434,316 438,317 Z"/>
        <path d="M450,322 Q455,334 458,347 L454,348 Q452,336 448,325 Z"/>
        <ellipse cx="470" cy="364" rx="6" ry="4" fill="#111114"/>
        <line x1="466" y1="362" x2="474" y2="362" stroke="#1a1a1e" stroke-width="1"/>
      </g>
      <g fill="#0e0e10">
        <path d="M505,364 Q497,356 487,362 Q482,366 480,370 L510,370 Z"/>
        <path d="M503,362 Q505,340 502,327 Q500,318 496,312 L482,312 Q486,318 488,327 Q490,340 488,362 Z"/>
        <path d="M505,360 Q509,365 512,372 L501,368 Z" fill="#0c0c0e"/>
        <path d="M487,360 Q483,365 480,372 L491,368 Z" fill="#0c0c0e"/>
        <line x1="499" y1="317" x2="485" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <line x1="485" y1="317" x2="499" y2="347" stroke="#1a1a1e" stroke-width="2"/>
        <rect x="488" y="344" width="8" height="6" rx="1" fill="#141416"/>
        <rect x="489" y="307" width="5" height="6" fill="#0e0e10"/>
        <ellipse cx="489" cy="301" rx="8" ry="9"/>
        <path d="M503,298 Q496,290 489,287 Q482,290 475,298 Q482,295 489,294 Q496,295 503,298 Z" fill="#0c0c0e"/>
        <path d="M506,300 Q504,292 498,288 L501,297 Z" fill="#0a0a0c"/>
        <path d="M472,300 Q474,292 480,288 L477,297 Z" fill="#0a0a0c"/>
        <circle cx="489" cy="292" r="2.5" fill="#141418"/>
        <path d="M485,320 Q480,327 478,337 L482,338 Q483,328 487,322 Z"/>
        <path d="M498,322 Q502,334 504,347 L500,348 Q499,336 496,325 Z"/>
        <line x1="476" y1="367" x2="473" y2="270" stroke="#111114" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="473" y1="274" x2="472" y2="264" stroke="#1a1a20" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="472" y1="264" x2="471" y2="256" stroke="#22222a" stroke-width="1" stroke-linecap="round"/>
      </g>
      <g stroke="#111114" stroke-width="2.2" stroke-linecap="round" fill="none">
        <line x1="375" y1="370" x2="380" y2="272"/>
        <line x1="383" y1="370" x2="380" y2="272"/>
        <line x1="420" y1="370" x2="418" y2="272"/>
        <line x1="426" y1="370" x2="420" y2="272"/>
      </g>
      <line x1="380" y1="272" x2="381" y2="262" stroke="#22222a" stroke-width="1"/>
      <line x1="418" y1="272" x2="419" y2="262" stroke="#22222a" stroke-width="1"/>
      <circle cx="381" cy="263" r="0.8" fill="#cc8833" opacity="0.3"/>
      <circle cx="419" cy="263" r="0.8" fill="#cc8833" opacity="0.3"/>
      <path d="M0,385 Q100,375 200,382 Q300,388 400,378 Q500,372 600,380 Q700,388 800,376 L800,400 L0,400 Z" fill="#060a10" opacity="0.8"/>
    </svg>
  `;
}
