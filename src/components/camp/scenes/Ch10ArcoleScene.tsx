import React from 'react';

/**
 * Ch.10 — Arcole, marsh/causeway
 * November dawn, cold. Flat marshland, narrow causeway into mist,
 * bare willows, frost, thin ice on water, pale cold light.
 * Mood: Grim determination.
 */
export function Ch10ArcoleScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Cold November dawn — pale steely light */}
        <linearGradient id="ch10_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151a22" />
          <stop offset="20%" stopColor="#1a2028" />
          <stop offset="40%" stopColor="#222a35" />
          <stop offset="60%" stopColor="#2a3540" />
          <stop offset="75%" stopColor="#3a4a55" />
          <stop offset="88%" stopColor="#4a5a60" />
          <stop offset="100%" stopColor="#5a6a6a" />
        </linearGradient>
        {/* Marsh water — icy, dark */}
        <linearGradient id="ch10_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3540" />
          <stop offset="30%" stopColor="#283240" />
          <stop offset="60%" stopColor="#253040" />
          <stop offset="100%" stopColor="#202a38" />
        </linearGradient>
        {/* Ice on water */}
        <linearGradient id="ch10_ice" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a5a65" stopOpacity="0" />
          <stop offset="50%" stopColor="#4a5a65" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4a5a65" stopOpacity="0" />
        </linearGradient>
        {/* Causeway stone surface */}
        <linearGradient id="ch10_causeway" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a35" />
          <stop offset="50%" stopColor="#353530" />
          <stop offset="100%" stopColor="#2a2a25" />
        </linearGradient>
        {/* Mist — horizontal band */}
        <linearGradient id="ch10_mist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4550" stopOpacity="0" />
          <stop offset="15%" stopColor="#3a4550" stopOpacity="0.12" />
          <stop offset="40%" stopColor="#3a4550" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#3a4550" stopOpacity="0.3" />
          <stop offset="85%" stopColor="#3a4550" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3a4550" stopOpacity="0" />
        </linearGradient>
        {/* Frost shimmer */}
        <linearGradient id="ch10_frost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a6a70" stopOpacity="0" />
          <stop offset="50%" stopColor="#5a6a70" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#5a6a70" stopOpacity="0" />
        </linearGradient>
        {/* Pale dawn glow — low on horizon */}
        <radialGradient id="ch10_dawnGlow" cx="0.5" cy="0.85" r="0.5">
          <stop offset="0%" stopColor="#5a6a6a" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#4a5a60" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#4a5a60" stopOpacity="0" />
        </radialGradient>
        {/* Distant gun flash */}
        <radialGradient id="ch10_flash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0a070" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c0a070" stopOpacity="0" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id="ch10_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch10_sky)" />
      <rect width="800" height="400" fill="url(#ch10_dawnGlow)" />

      {/* Thin grey cloud bands */}
      <ellipse cx="200" cy="35" rx="200" ry="8" fill="#222a35" opacity="0.3" />
      <ellipse cx="500" cy="25" rx="160" ry="6" fill="#1e2530" opacity="0.25" />
      <ellipse cx="700" cy="45" rx="130" ry="7" fill="#222a35" opacity="0.2" />
      <ellipse cx="350" cy="55" rx="180" ry="5" fill="#1e2530" opacity="0.15" />

      {/* === FLAT MARSHLAND — very flat horizon === */}
      <path d="M0 160 Q200 158 400 160 Q600 158 800 160 L800 400 L0 400 Z"
        fill="url(#ch10_water)" />

      {/* Distant Austrian position — gun smoke/flash hint */}
      <ellipse cx="420" cy="152" rx="30" ry="8" fill="#4a5560" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.2;0.12" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="415" cy="150" rx="12" ry="5" fill="url(#ch10_flash)">
        <animate attributeName="opacity" values="0;0.3;0" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* === ICE PATCHES === */}
      <ellipse cx="150" cy="195" rx="55" ry="10" fill="url(#ch10_ice)" />
      <ellipse cx="300" cy="210" rx="45" ry="8" fill="url(#ch10_ice)" />
      <ellipse cx="500" cy="220" rx="80" ry="12" fill="url(#ch10_ice)" />
      <ellipse cx="700" cy="190" rx="55" ry="9" fill="url(#ch10_ice)" />
      <ellipse cx="80" cy="240" rx="40" ry="6" fill="url(#ch10_ice)" />
      <ellipse cx="620" cy="250" rx="50" ry="7" fill="url(#ch10_ice)" />

      {/* Ice crackle lines */}
      <path d="M130 193 L145 196 L160 192 L175 197 L190 193" fill="none" stroke="#5a6a70" strokeWidth="0.3" opacity="0.2" />
      <path d="M470 218 L490 222 L510 218 L530 221 L550 217" fill="none" stroke="#5a6a70" strokeWidth="0.3" opacity="0.2" />
      <path d="M680 188 L695 192 L710 188 L730 191" fill="none" stroke="#5a6a70" strokeWidth="0.3" opacity="0.15" />
      <path d="M60 238 L75 241 L90 237 L105 240" fill="none" stroke="#5a6a70" strokeWidth="0.3" opacity="0.15" />

      {/* Frost shimmer at horizon */}
      <rect x="0" y="158" width="800" height="8" fill="url(#ch10_frost)" />

      {/* Dead reeds in marsh water */}
      <line x1="180" y1="195" x2="182" y2="178" stroke="#3a3a35" strokeWidth="0.6" opacity="0.25" />
      <line x1="185" y1="197" x2="188" y2="182" stroke="#3a3a35" strokeWidth="0.6" opacity="0.25" />
      <line x1="190" y1="196" x2="191" y2="180" stroke="#3a3a35" strokeWidth="0.5" opacity="0.2" />
      <line x1="550" y1="225" x2="552" y2="210" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <line x1="555" y1="227" x2="558" y2="213" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <line x1="720" y1="193" x2="722" y2="178" stroke="#3a3a35" strokeWidth="0.5" opacity="0.2" />
      <line x1="725" y1="195" x2="727" y2="180" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />
      {/* Reed clumps on left */}
      <line x1="50" y1="230" x2="52" y2="212" stroke="#3a3a35" strokeWidth="0.7" opacity="0.25" />
      <line x1="55" y1="232" x2="58" y2="215" stroke="#3a3a35" strokeWidth="0.6" opacity="0.22" />
      <line x1="60" y1="231" x2="61" y2="214" stroke="#3a3a35" strokeWidth="0.5" opacity="0.2" />

      {/* === BARE WILLOWS === */}
      {/* Willow 1 — left, larger */}
      <path d="M125 205 Q128 175 132 150 Q134 135 135 125" fill="none" stroke="#252525" strokeWidth="2.5" />
      <path d="M135 125 Q140 112 143 120" fill="none" stroke="#252525" strokeWidth="1.2" />
      <path d="M135 125 Q128 115 126 122" fill="none" stroke="#252525" strokeWidth="1" />
      <path d="M133 140 Q126 130 123 136" fill="none" stroke="#252525" strokeWidth="0.8" />
      <path d="M133 140 Q140 132 142 138" fill="none" stroke="#252525" strokeWidth="0.7" />
      {/* Drooping willow branches */}
      <path d="M143 118 Q155 130 162 155 Q165 170 163 185" fill="none" stroke="#252525" strokeWidth="0.5" opacity="0.5" />
      <path d="M140 120 Q150 135 155 160 Q158 175 155 190" fill="none" stroke="#252525" strokeWidth="0.4" opacity="0.45" />
      <path d="M126 118 Q115 130 110 155 Q108 170 110 185" fill="none" stroke="#252525" strokeWidth="0.5" opacity="0.5" />
      <path d="M128 122 Q118 135 115 160 Q113 175 115 188" fill="none" stroke="#252525" strokeWidth="0.4" opacity="0.4" />
      <path d="M136 130 Q148 145 152 170" fill="none" stroke="#252525" strokeWidth="0.3" opacity="0.35" />
      <path d="M132 132 Q120 145 118 168" fill="none" stroke="#252525" strokeWidth="0.3" opacity="0.35" />

      {/* Willow 2 — right */}
      <path d="M650 200 Q653 172 656 148 Q657 138 658 130" fill="none" stroke="#252525" strokeWidth="2" />
      <path d="M658 130 Q663 118 665 128" fill="none" stroke="#252525" strokeWidth="0.9" />
      <path d="M658 130 Q652 120 650 127" fill="none" stroke="#252525" strokeWidth="0.7" />
      <path d="M655 145 Q648 136 646 142" fill="none" stroke="#252525" strokeWidth="0.6" />
      {/* Drooping branches */}
      <path d="M665 125 Q675 138 678 158 Q680 172 677 185" fill="none" stroke="#252525" strokeWidth="0.4" opacity="0.45" />
      <path d="M663 128 Q672 142 675 165" fill="none" stroke="#252525" strokeWidth="0.3" opacity="0.4" />
      <path d="M650 124 Q640 136 637 158 Q635 172 637 182" fill="none" stroke="#252525" strokeWidth="0.4" opacity="0.45" />
      <path d="M652 128 Q642 142 640 162" fill="none" stroke="#252525" strokeWidth="0.3" opacity="0.35" />

      {/* Willow 3 — distant, smaller */}
      <path d="M300 185 Q302 168 304 155" fill="none" stroke="#252530" strokeWidth="1.2" opacity="0.4" />
      <path d="M304 155 Q308 148 309 153" fill="none" stroke="#252530" strokeWidth="0.5" opacity="0.35" />
      <path d="M304 155 Q300 149 299 153" fill="none" stroke="#252530" strokeWidth="0.5" opacity="0.35" />
      <path d="M308 150 Q314 158 316 170" fill="none" stroke="#252530" strokeWidth="0.3" opacity="0.3" />
      <path d="M299 151 Q293 160 291 172" fill="none" stroke="#252530" strokeWidth="0.3" opacity="0.3" />

      {/* === CAUSEWAY — the central dramatic element === */}
      {/* Causeway body — perspective narrowing into distance */}
      <path d="M340 380 L360 380 Q370 340 378 300 Q386 260 392 225 Q398 195 405 170 Q410 155 415 145 L425 145 Q420 155 415 170 Q408 195 402 225 Q396 260 388 300 Q380 340 370 380 Z"
        fill="url(#ch10_causeway)" opacity="0.55" />

      {/* Causeway edge detail — worn stone edges */}
      <path d="M340 380 Q350 340 358 300 Q366 260 372 225 Q378 195 385 170 Q390 155 395 145"
        fill="none" stroke="#3a3a30" strokeWidth="1" opacity="0.3" />
      <path d="M370 380 Q380 340 388 300 Q396 260 402 225 Q408 195 415 170 Q420 155 425 145"
        fill="none" stroke="#3a3a30" strokeWidth="1" opacity="0.3" />

      {/* Stone texture lines across causeway */}
      <path d="M348 360 Q355 358 362 360" fill="none" stroke="#4a4a40" strokeWidth="0.5" opacity="0.25" />
      <path d="M352 340 Q358 338 364 340" fill="none" stroke="#4a4a40" strokeWidth="0.5" opacity="0.25" />
      <path d="M358 315 Q363 313 368 315" fill="none" stroke="#4a4a40" strokeWidth="0.5" opacity="0.22" />
      <path d="M363 290 Q367 288 372 290" fill="none" stroke="#4a4a40" strokeWidth="0.4" opacity="0.2" />
      <path d="M370 265 Q374 263 378 265" fill="none" stroke="#4a4a40" strokeWidth="0.4" opacity="0.18" />
      <path d="M376 240 Q380 238 384 240" fill="none" stroke="#4a4a40" strokeWidth="0.3" opacity="0.15" />
      <path d="M382 215 Q385 213 388 215" fill="none" stroke="#4a4a40" strokeWidth="0.3" opacity="0.12" />

      {/* Causeway parapet — low wall on sides */}
      <path d="M338 380 Q348 338 356 298 Q364 258 370 222 Q376 195 383 168"
        fill="none" stroke="#3a3830" strokeWidth="2" opacity="0.2" />
      <path d="M372 380 Q382 338 390 298 Q398 258 404 222 Q410 195 417 168"
        fill="none" stroke="#3a3830" strokeWidth="2" opacity="0.2" />

      {/* Water lapping against causeway base */}
      <path d="M335 378 Q340 374 345 378" fill="none" stroke="#3a4550" strokeWidth="0.5" opacity="0.15" />
      <path d="M365 378 Q370 374 375 378" fill="none" stroke="#3a4550" strokeWidth="0.5" opacity="0.15" />

      {/* === MIST LAYERS — thickening in distance === */}
      {/* Near mist — thin */}
      <ellipse cx="400" cy="260" rx="300" ry="15" fill="#3a4550" opacity="0.06" />
      {/* Mid mist */}
      <ellipse cx="380" cy="210" rx="320" ry="20" fill="#3a4550" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.16;0.12" dur="10s" repeatCount="indefinite" />
      </ellipse>
      {/* Far mist — thick, obscuring distance */}
      <ellipse cx="400" cy="175" rx="280" ry="22" fill="#3a4550" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.28;0.2" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="420" cy="158" rx="250" ry="18" fill="#3a4550" opacity="0.25">
        <animate attributeName="cx" values="420;440;420" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* Horizon mist band */}
      <rect x="0" y="148" width="800" height="25" fill="url(#ch10_mist)" />

      {/* === SOLDIERS ON CAUSEWAY — advancing into mist === */}

      {/* Lead soldier — flag bearer / officer */}
      <path d="M390 232 Q388 222 390 214 Q392 208 394 214 L396 232 Q395 240 394 248 L390 248 Z"
        fill="#151518" opacity="0.75" />
      <circle cx="392" cy="208" r="5" fill="#151518" opacity="0.75" />
      {/* Flag / standard */}
      <line x1="398" y1="206" x2="398" y2="182" stroke="#252520" strokeWidth="1.5" opacity="0.5" />
      <path d="M398 182 L412 186 L412 196 L398 192" fill="#2a3550" opacity="0.35" />
      {/* Musket */}
      <line x1="386" y1="210" x2="384" y2="248" stroke="#151518" strokeWidth="1" opacity="0.5" />

      {/* Second soldier */}
      <path d="M380 262 Q378 252 380 246 Q382 241 384 246 L386 262 Q385 270 384 278 L380 278 Z"
        fill="#151518" opacity="0.7" />
      <circle cx="382" cy="241" r="4.5" fill="#151518" opacity="0.7" />
      <line x1="388" y1="240" x2="390" y2="278" stroke="#151518" strokeWidth="1" opacity="0.45" />

      {/* Third soldier */}
      <path d="M370 295 Q368 285 370 279 Q372 274 374 279 L376 295 Z"
        fill="#151518" opacity="0.68" />
      <circle cx="372" cy="274" r="4" fill="#151518" opacity="0.68" />

      {/* Fourth soldier — glancing back */}
      <path d="M360 325 Q358 315 360 308 Q362 303 364 308 L366 325 Z"
        fill="#151518" opacity="0.65" />
      <circle cx="362" cy="303" r="4" fill="#151518" opacity="0.65" />

      {/* Fifth soldier — closest, most detailed */}
      <path d="M352 355 Q350 342 352 334 Q354 328 356 334 L358 355 Q357 365 356 372 L352 372 Z"
        fill="#151518" opacity="0.8" />
      <circle cx="354" cy="328" r="5" fill="#151518" opacity="0.8" />
      {/* Musket on shoulder */}
      <line x1="360" y1="326" x2="365" y2="310" stroke="#151518" strokeWidth="1.2" opacity="0.6" />
      {/* Arms */}
      <path d="M349 345 Q347 340 348 336" fill="none" stroke="#151518" strokeWidth="2" opacity="0.5" />

      {/* Column in fog — ghostly shapes dissolving */}
      <path d="M398 202 Q396 195 398 190 Q400 195 402 202 Z" fill="#2a3040" opacity="0.35" />
      <circle cx="399" cy="187" r="2.5" fill="#2a3040" opacity="0.3" />
      <path d="M405 185 Q403 180 405 176 Q407 180 409 185 Z" fill="#2a3040" opacity="0.25" />
      <circle cx="406" cy="174" r="2" fill="#2a3040" opacity="0.2" />
      <path d="M410 172 Q409 168 410 165" fill="none" stroke="#2a3040" strokeWidth="1.5" opacity="0.15" />

      {/* Breath vapor from soldiers */}
      <ellipse cx="397" cy="205" rx="6" ry="2.5" fill="#4a5560" opacity="0.12">
        <animate attributeName="rx" values="6;10;6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="387" cy="238" rx="5" ry="2" fill="#4a5560" opacity="0.1">
        <animate attributeName="rx" values="5;8;5" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="357" cy="325" rx="6" ry="2" fill="#4a5560" opacity="0.12">
        <animate attributeName="rx" values="6;9;6" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2.8s" repeatCount="indefinite" />
      </ellipse>

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Cold frost tint */}
      <rect width="800" height="400" fill="#3a5060" opacity="0.03" />

      {/* Vignette */}
      <rect width="800" height="400" fill="url(#ch10_vignette)" />

      {/* Top/bottom darkening */}
      <rect x="0" y="0" width="800" height="25" fill="#101520" opacity="0.3" />
      <rect x="0" y="380" width="800" height="20" fill="#101520" opacity="0.35" />
    </svg>
  );
}
