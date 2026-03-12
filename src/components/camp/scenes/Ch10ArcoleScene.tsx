import React from 'react';

/**
 * Ch.10 — Arcole, marsh/causeway
 * November dawn, cold. Flat marshland, narrow causeway into mist,
 * bare willows, frost, thin ice on water, pale cold light.
 * Fallen soldiers in the marsh, equipment on the near bank,
 * Austrian guns firing from multiple positions.
 * Rain drizzle, drifting debris, wading flankers, distant fortification.
 * French cannon battery on near bank, reserves with drummer boy,
 * wounded being dragged back, officers observing, ammunition bearers.
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
        {/* Distant gun flash — left Austrian position */}
        <radialGradient id="ch10_flash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0a070" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c0a070" stopOpacity="0" />
        </radialGradient>
        {/* Second gun flash — right Austrian position */}
        <radialGradient id="ch10_flashRight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a060" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d0a060" stopOpacity="0" />
        </radialGradient>
        {/* Mud bank gradient */}
        <linearGradient id="ch10_mudBank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2820" />
          <stop offset="60%" stopColor="#252318" />
          <stop offset="100%" stopColor="#202015" />
        </linearGradient>
        {/* Tricolor flag stripes */}
        <linearGradient id="ch10_tricolor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2a60" stopOpacity="0.45" />
          <stop offset="33%" stopColor="#1a2a60" stopOpacity="0.45" />
          <stop offset="34%" stopColor="#d0d0c8" stopOpacity="0.35" />
          <stop offset="66%" stopColor="#d0d0c8" stopOpacity="0.35" />
          <stop offset="67%" stopColor="#8a2020" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8a2020" stopOpacity="0.4" />
        </linearGradient>
        {/* Water ripple shimmer */}
        <linearGradient id="ch10_ripple" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2535" stopOpacity="0" />
          <stop offset="50%" stopColor="#1a2535" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a2535" stopOpacity="0" />
        </linearGradient>
        {/* Vignette */}
        <radialGradient id="ch10_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>

        {/* === NEW GRADIENTS === */}
        {/* Musket flash — bright orange for enemy fire */}
        <radialGradient id="ch10_musketFlash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e09030" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#c07020" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c07020" stopOpacity="0" />
        </radialGradient>
        {/* Thick gunpowder smoke */}
        <radialGradient id="ch10_gunSmoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5a5a55" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#4a4a48" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3a3a38" stopOpacity="0" />
        </radialGradient>
        {/* Rain drizzle pattern */}
        <pattern id="ch10_rain" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="5" y1="0" x2="3" y2="12" stroke="#6a7a85" strokeWidth="0.3" opacity="0.12" />
          <line x1="15" y1="4" x2="13" y2="16" stroke="#6a7a85" strokeWidth="0.3" opacity="0.1" />
          <line x1="27" y1="2" x2="25" y2="14" stroke="#6a7a85" strokeWidth="0.3" opacity="0.11" />
          <line x1="35" y1="6" x2="33" y2="18" stroke="#6a7a85" strokeWidth="0.3" opacity="0.09" />
          <line x1="10" y1="20" x2="8" y2="32" stroke="#6a7a85" strokeWidth="0.3" opacity="0.1" />
          <line x1="22" y1="22" x2="20" y2="34" stroke="#6a7a85" strokeWidth="0.3" opacity="0.12" />
          <line x1="32" y1="24" x2="30" y2="36" stroke="#6a7a85" strokeWidth="0.3" opacity="0.08" />
        </pattern>
        {/* Fortification wall gradient */}
        <linearGradient id="ch10_fortWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a38" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a2a28" stopOpacity="0.2" />
        </linearGradient>

        {/* === ENHANCEMENT GRADIENTS === */}
        {/* French cannon battery flash */}
        <radialGradient id="ch10_cannonFlash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e8a040" stopOpacity="0.7" />
          <stop offset="30%" stopColor="#d08030" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c07020" stopOpacity="0" />
        </radialGradient>
        {/* Thick battery smoke */}
        <radialGradient id="ch10_batterySmoke" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#6a6a62" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#5a5a55" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4a4a48" stopOpacity="0" />
        </radialGradient>
        {/* Campfire glow */}
        <radialGradient id="ch10_fireGlow" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="#c07030" stopOpacity="0.2" />
          <stop offset="40%" stopColor="#a05020" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#804020" stopOpacity="0" />
        </radialGradient>
        {/* Heavy foreground rain pattern — thicker strokes */}
        <pattern id="ch10_heavyRain" x="0" y="0" width="30" height="50" patternUnits="userSpaceOnUse">
          <line x1="4" y1="0" x2="1" y2="18" stroke="#7a8a95" strokeWidth="0.5" opacity="0.16" />
          <line x1="12" y1="3" x2="9" y2="21" stroke="#7a8a95" strokeWidth="0.5" opacity="0.14" />
          <line x1="20" y1="1" x2="17" y2="19" stroke="#7a8a95" strokeWidth="0.45" opacity="0.15" />
          <line x1="27" y1="5" x2="24" y2="23" stroke="#7a8a95" strokeWidth="0.5" opacity="0.13" />
          <line x1="8" y1="25" x2="5" y2="43" stroke="#7a8a95" strokeWidth="0.5" opacity="0.15" />
          <line x1="16" y1="28" x2="13" y2="46" stroke="#7a8a95" strokeWidth="0.45" opacity="0.14" />
          <line x1="24" y1="26" x2="21" y2="44" stroke="#7a8a95" strokeWidth="0.5" opacity="0.12" />
        </pattern>
        {/* Marsh bubble gradient */}
        <radialGradient id="ch10_bubble" cx="0.4" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#4a5a65" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3a4a55" stopOpacity="0.05" />
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

      {/* === DARK WATER LINES between ice patches === */}
      <path d="M100 200 Q130 198 160 201 Q190 204 220 200" fill="none" stroke="#151e2a" strokeWidth="0.6" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M450 215 Q480 212 510 216 Q540 220 570 215" fill="none" stroke="#151e2a" strokeWidth="0.5" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.12;0.2" dur="7s" repeatCount="indefinite" />
      </path>
      <path d="M600 235 Q630 232 660 236 Q690 240 720 235" fill="none" stroke="#151e2a" strokeWidth="0.5" opacity="0.18" />
      <path d="M30 260 Q60 257 90 261 Q120 264 150 260" fill="none" stroke="#151e2a" strokeWidth="0.4" opacity="0.15" />

      {/* Subtle water ripple animation — near causeway */}
      <ellipse cx="320" cy="310" rx="15" ry="1.5" fill="url(#ch10_ripple)">
        <animate attributeName="rx" values="15;20;15" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="395" cy="280" rx="12" ry="1" fill="url(#ch10_ripple)">
        <animate attributeName="rx" values="12;17;12" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* === DISTANT AUSTRIAN FORTIFICATION — far end of causeway === */}
      {/* Main earthwork wall — dim in the fog */}
      <path d="M395 148 L445 148 L448 152 L442 153 L398 153 L392 152 Z"
        fill="url(#ch10_fortWall)" />
      {/* Parapet crenellations */}
      <rect x="400" y="145" width="4" height="4" fill="#3a3a38" opacity="0.18" />
      <rect x="408" y="145" width="4" height="4" fill="#3a3a38" opacity="0.16" />
      <rect x="416" y="145" width="4" height="4" fill="#3a3a38" opacity="0.18" />
      <rect x="424" y="145" width="4" height="4" fill="#3a3a38" opacity="0.15" />
      <rect x="432" y="145" width="4" height="4" fill="#3a3a38" opacity="0.17" />
      {/* Sloped embankment below wall */}
      <path d="M390 153 Q420 157 450 153" fill="none" stroke="#2a2a28" strokeWidth="1.5" opacity="0.15" />
      {/* Gabion basket shapes on the wall */}
      <ellipse cx="405" cy="147" rx="3" ry="2" fill="#2a2a25" opacity="0.14" />
      <ellipse cx="430" cy="147" rx="3" ry="2" fill="#2a2a25" opacity="0.12" />

      {/* Distant Austrian position — left gun smoke/flash hint */}
      <ellipse cx="420" cy="152" rx="30" ry="8" fill="#4a5560" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.2;0.12" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="415" cy="150" rx="12" ry="5" fill="url(#ch10_flash)">
        <animate attributeName="opacity" values="0;0.3;0" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* === MUSKET FLASH — bright enemy fire at causeway end === */}
      <ellipse cx="418" cy="148" rx="5" ry="3" fill="url(#ch10_musketFlash)">
        <animate attributeName="opacity" values="0;0;0.7;0.9;0.4;0;0;0;0" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Secondary flash — staggered timing */}
      <ellipse cx="432" cy="149" rx="4" ry="2.5" fill="url(#ch10_musketFlash)">
        <animate attributeName="opacity" values="0;0;0;0;0.6;0.8;0.3;0;0" dur="5.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === SECOND AUSTRIAN GUN FLASH — right side === */}
      <ellipse cx="560" cy="155" rx="25" ry="7" fill="#4a5560" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.18;0.1" dur="6.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="555" cy="153" rx="10" ry="4" fill="url(#ch10_flashRight)">
        <animate attributeName="opacity" values="0;0.25;0;0;0" dur="6.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke drift from right gun */}
      <ellipse cx="565" cy="148" rx="18" ry="5" fill="#4a5060" opacity="0.08">
        <animate attributeName="cx" values="565;580;565" dur="6.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.14;0.08" dur="6.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === THICK GUNPOWDER SMOKE — near causeway end === */}
      {/* Large rolling smoke cloud */}
      <ellipse cx="410" cy="155" rx="35" ry="12" fill="url(#ch10_gunSmoke)">
        <animate attributeName="rx" values="35;42;35" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="155;152;155" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Drifting smoke wisp — left */}
      <ellipse cx="385" cy="150" rx="22" ry="8" fill="#4a4a48" opacity="0.12">
        <animate attributeName="cx" values="385;370;385" dur="9s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.18;0.12" dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Drifting smoke wisp — right */}
      <ellipse cx="445" cy="148" rx="18" ry="6" fill="#4a4a48" opacity="0.1">
        <animate attributeName="cx" values="445;460;445" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.16;0.1" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Low-hanging smoke band across causeway approach */}
      <ellipse cx="400" cy="175" rx="60" ry="10" fill="#4a4a48" opacity="0.08">
        <animate attributeName="rx" values="60;70;60" dur="10s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.12;0.08" dur="10s" repeatCount="indefinite" />
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

      {/* === FALLEN SOLDIERS IN MARSH — casualties from previous attempts === */}
      {/* Body 1 — half-submerged, face down near left of causeway */}
      <ellipse cx="285" cy="270" rx="12" ry="4" fill="#1a1a18" opacity="0.35" />
      <path d="M275 270 Q280 266 288 268 Q295 270 298 274" fill="#1a1a18" opacity="0.3" />
      <circle cx="278" cy="268" r="3" fill="#1a1a18" opacity="0.3" />
      {/* Arm trailing in water */}
      <path d="M296 272 Q302 274 308 276" fill="none" stroke="#1a1a18" strokeWidth="1.5" opacity="0.2" />
      {/* Ripple around the body */}
      <ellipse cx="288" cy="273" rx="18" ry="3" fill="none" stroke="#3a4550" strokeWidth="0.4" opacity="0.1" />

      {/* Body 2 — on right side, partially sunk, shako visible */}
      <path d="M470 260 Q476 255 482 258 Q486 262 480 265 Q474 264 470 260 Z" fill="#1a1a18" opacity="0.3" />
      <circle cx="472" cy="256" r="2.5" fill="#1a1a18" opacity="0.28" />
      {/* Shako hat floating nearby */}
      <ellipse cx="488" cy="258" rx="3" ry="1.5" fill="#1a1a18" opacity="0.25" />
      {/* Dark water around this body */}
      <ellipse cx="478" cy="262" rx="14" ry="2.5" fill="#151e28" opacity="0.12" />

      {/* Body 3 — further away, just a shape and an arm above water */}
      <path d="M440 210 Q445 207 450 209 Q453 212 448 214 Q443 213 440 210 Z" fill="#1a1a18" opacity="0.22" />
      <path d="M450 210 Q455 208 458 210" fill="none" stroke="#1a1a18" strokeWidth="1" opacity="0.15" />

      {/* === ADDITIONAL BODIES IN MARSH — more casualties === */}
      {/* Body 4 — far left, face-up, coat spread in water */}
      <ellipse cx="75" cy="275" rx="10" ry="3.5" fill="#1a1a18" opacity="0.28" />
      <circle cx="70" cy="273" r="2.5" fill="#1a1a18" opacity="0.25" />
      <path d="M80 276 Q87 278 92 280" fill="none" stroke="#1a1a18" strokeWidth="1.2" opacity="0.18" />
      {/* Coat flap spread in the water */}
      <path d="M68 277 Q62 280 58 282 Q55 283 58 285" fill="#1a1a18" opacity="0.15" />
      <ellipse cx="76" cy="278" rx="15" ry="2.5" fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.08" />

      {/* Body 5 — between willows, curled, half-sunk */}
      <path d="M520 245 Q525 240 530 243 Q533 248 527 250 Q522 249 520 245 Z" fill="#1a1a18" opacity="0.25" />
      <circle cx="518" cy="243" r="2" fill="#1a1a18" opacity="0.22" />
      {/* Legs trailing behind */}
      <path d="M530 248 Q535 252 538 256" fill="none" stroke="#1a1a18" strokeWidth="1" opacity="0.15" />
      <ellipse cx="526" cy="248" rx="12" ry="2" fill="#151e28" opacity="0.08" />

      {/* Body 6 — near causeway right, mostly submerged, just shoulders and pack visible */}
      <path d="M410 285 Q415 282 420 284 Q422 287 417 288 Q412 287 410 285 Z" fill="#1a1a18" opacity="0.2" />
      {/* Knapsack bump above waterline */}
      <ellipse cx="416" cy="283" rx="3" ry="2" fill="#1a1a18" opacity="0.22" />

      {/* === NEW FALLEN SOLDIERS — additional casualties on/near causeway === */}
      {/* Body 7 — slumped against causeway parapet, left side */}
      <path d="M345 340 Q348 335 352 337 Q354 342 350 345 Q346 343 345 340 Z" fill="#151518" opacity="0.5" />
      <circle cx="346" cy="337" r="2.5" fill="#151518" opacity="0.45" />
      {/* Arm dangling into the water */}
      <path d="M344 342 Q340 346 337 350" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.35" />
      {/* Blood darkening on causeway stone beneath */}
      <ellipse cx="349" cy="342" rx="5" ry="2" fill="#1a1210" opacity="0.15" />

      {/* Body 8 — face down on causeway, midway, musket under him */}
      <path d="M375 270 Q380 265 385 268 Q388 273 382 276 Q377 274 375 270 Z" fill="#151518" opacity="0.4" />
      <circle cx="375" cy="267" r="2.5" fill="#151518" opacity="0.38" />
      {/* Musket pinned underneath */}
      <line x1="372" y1="274" x2="390" y2="270" stroke="#1a1a18" strokeWidth="0.8" opacity="0.2" />

      {/* Body 9 — rolled into the water from causeway, right side, legs still on stone */}
      <path d="M388 250 Q392 247 395 250 Q396 254 392 256 Q389 254 388 250 Z" fill="#1a1a18" opacity="0.3" />
      <circle cx="387" cy="248" r="2" fill="#1a1a18" opacity="0.28" />
      {/* Legs across causeway edge */}
      <path d="M395 253 Q398 250 400 248" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.25" />
      {/* Water disturbance from recent fall */}
      <ellipse cx="389" cy="254" rx="8" ry="1.5" fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="rx" values="8;12;8" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* Body 10 — in marsh between near bank and causeway, face up */}
      <ellipse cx="310" cy="340" rx="9" ry="3" fill="#1a1a18" opacity="0.32" />
      <circle cx="305" cy="338" r="2.5" fill="#1a1a18" opacity="0.3" />
      {/* Arms spread wide */}
      <path d="M302 340 Q298 342 294 344" fill="none" stroke="#1a1a18" strokeWidth="1" opacity="0.2" />
      <path d="M318 340 Q322 342 326 343" fill="none" stroke="#1a1a18" strokeWidth="1" opacity="0.2" />
      <ellipse cx="310" cy="342" rx="14" ry="2" fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.08" />

      {/* === DRIFTING DEBRIS IN MARSH === */}
      {/* Floating shako hat */}
      <ellipse cx="200" cy="255" rx="3.5" ry="1.5" fill="#1a1a18" opacity="0.3" />
      <rect x="198" y="252" width="4" height="2.5" rx="0.5" fill="#1a1a18" opacity="0.25" />
      <ellipse cx="200" cy="256" rx="5" ry="1" fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="rx" values="5;6;5" dur="5s" repeatCount="indefinite" />
      </ellipse>

      {/* Floating branch with leaves */}
      <path d="M565 270 Q572 269 580 270 Q586 271 590 270" fill="none" stroke="#2a2820" strokeWidth="1" opacity="0.25" />
      <path d="M575 269 Q577 266 579 268" fill="none" stroke="#2a2820" strokeWidth="0.5" opacity="0.18" />
      <path d="M582 270 Q584 267 586 269" fill="none" stroke="#2a2820" strokeWidth="0.5" opacity="0.16" />
      <ellipse cx="577" cy="271" rx="8" ry="1" fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="rx" values="8;10;8" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {/* Floating cartridge pouch */}
      <rect x="155" y="230" width="5" height="3" rx="0.8" fill="#1a1a18" opacity="0.22">
        <animate attributeName="x" values="155;157;155" dur="7s" repeatCount="indefinite" />
      </rect>
      <path d="M155 232 Q153 233 151 232" fill="none" stroke="#1a1a18" strokeWidth="0.5" opacity="0.15" />

      {/* Floating plank / equipment piece */}
      <path d="M680 265 Q688 264 696 265" fill="none" stroke="#2a2820" strokeWidth="1.5" opacity="0.2">
        <animate attributeName="d" values="M680 265 Q688 264 696 265;M681 264 Q689 265 697 264;M680 265 Q688 264 696 265" dur="8s" repeatCount="indefinite" />
      </path>

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

      {/* === MORE MARSH VEGETATION — broken reeds, bent cattails === */}
      {/* Broken reed cluster near right causeway */}
      <line x1="430" y1="245" x2="432" y2="228" stroke="#3a3a35" strokeWidth="0.6" opacity="0.22" />
      <line x1="435" y1="247" x2="438" y2="232" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <line x1="440" y1="246" x2="436" y2="234" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />
      {/* Bent reed — snapped partway */}
      <path d="M437 232 Q440 226 445 230" fill="none" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />

      {/* Dead cattails — left marsh */}
      <line x1="100" y1="215" x2="103" y2="192" stroke="#3a3a35" strokeWidth="0.7" opacity="0.25" />
      <ellipse cx="103" cy="191" rx="1.5" ry="3.5" fill="#2a2a22" opacity="0.25" />
      <line x1="108" y1="218" x2="110" y2="196" stroke="#3a3a35" strokeWidth="0.6" opacity="0.22" />
      <ellipse cx="110" cy="195" rx="1.2" ry="3" fill="#2a2a22" opacity="0.22" />

      {/* Dead cattails — right marsh, some broken */}
      <line x1="600" y1="240" x2="602" y2="220" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <ellipse cx="602" cy="219" rx="1.2" ry="3" fill="#2a2a22" opacity="0.2" />
      <line x1="606" y1="242" x2="604" y2="228" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />
      {/* Broken cattail — snapped, top dangling */}
      <line x1="610" y1="241" x2="612" y2="226" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <path d="M612 226 Q614 224 616 228 Q617 232 615 234" fill="none" stroke="#2a2a22" strokeWidth="0.5" opacity="0.16" />

      {/* Thick reed clump near body 1 */}
      <line x1="270" y1="265" x2="268" y2="248" stroke="#3a3a35" strokeWidth="0.6" opacity="0.22" />
      <line x1="274" y1="266" x2="276" y2="250" stroke="#3a3a35" strokeWidth="0.5" opacity="0.2" />
      <line x1="278" y1="267" x2="277" y2="252" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />

      {/* === ADDITIONAL REED CLUSTERS — more density === */}
      {/* Dense clump — mid-left marsh */}
      <line x1="155" y1="250" x2="153" y2="232" stroke="#3a3a35" strokeWidth="0.7" opacity="0.24" />
      <line x1="159" y1="252" x2="161" y2="235" stroke="#3a3a35" strokeWidth="0.6" opacity="0.22" />
      <line x1="163" y1="251" x2="162" y2="234" stroke="#3a3a35" strokeWidth="0.5" opacity="0.2" />
      <line x1="167" y1="253" x2="169" y2="237" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />
      {/* Cattail tops */}
      <ellipse cx="153" cy="231" rx="1.2" ry="3" fill="#2a2a22" opacity="0.2" />
      <ellipse cx="162" cy="233" rx="1" ry="2.5" fill="#2a2a22" opacity="0.18" />

      {/* Reed patch — right side near body 5 */}
      <line x1="540" y1="250" x2="538" y2="233" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <line x1="544" y1="252" x2="546" y2="236" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <line x1="548" y1="251" x2="547" y2="235" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />

      {/* Reed cluster — far right corner */}
      <line x1="740" y1="210" x2="738" y2="192" stroke="#3a3a35" strokeWidth="0.6" opacity="0.2" />
      <line x1="744" y1="212" x2="746" y2="195" stroke="#3a3a35" strokeWidth="0.6" opacity="0.18" />
      <line x1="748" y1="211" x2="747" y2="194" stroke="#3a3a35" strokeWidth="0.5" opacity="0.16" />
      <ellipse cx="738" cy="191" rx="1.2" ry="3" fill="#2a2a22" opacity="0.16" />

      {/* Scattered reeds near near bank */}
      <line x1="320" y1="290" x2="318" y2="275" stroke="#3a3a35" strokeWidth="0.5" opacity="0.18" />
      <line x1="324" y1="292" x2="326" y2="278" stroke="#3a3a35" strokeWidth="0.5" opacity="0.16" />

      {/* === ENHANCED MARSH DETAIL — cattails, rotting logs, bubbles === */}
      {/* Tall cattails — near bank left, prominent */}
      <line x1="30" y1="295" x2="28" y2="258" stroke="#3a3a35" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="28" cy="257" rx="1.8" ry="4.5" fill="#2a2a22" opacity="0.3" />
      <line x1="36" y1="298" x2="35" y2="264" stroke="#3a3a35" strokeWidth="0.7" opacity="0.28" />
      <ellipse cx="35" cy="263" rx="1.5" ry="4" fill="#2a2a22" opacity="0.26" />
      <line x1="42" y1="296" x2="40" y2="262" stroke="#3a3a35" strokeWidth="0.6" opacity="0.25" />
      <ellipse cx="40" cy="261" rx="1.3" ry="3.5" fill="#2a2a22" opacity="0.24" />

      {/* Cattail cluster — right marsh foreground */}
      <line x1="680" y1="295" x2="678" y2="260" stroke="#3a3a35" strokeWidth="0.8" opacity="0.28" />
      <ellipse cx="678" cy="259" rx="1.6" ry="4" fill="#2a2a22" opacity="0.28" />
      <line x1="686" y1="298" x2="685" y2="266" stroke="#3a3a35" strokeWidth="0.7" opacity="0.25" />
      <ellipse cx="685" cy="265" rx="1.4" ry="3.5" fill="#2a2a22" opacity="0.24" />

      {/* Rotting log — partially submerged, left side */}
      <path d="M115 280 Q130 278 148 280 Q155 282 160 282" fill="none" stroke="#2a2518" strokeWidth="2.5" opacity="0.3" />
      <path d="M115 282 Q130 280 148 282 Q155 284 160 284" fill="none" stroke="#222015" strokeWidth="2" opacity="0.2" />
      {/* Bark texture */}
      <path d="M120 279 Q122 278 124 279" fill="none" stroke="#353020" strokeWidth="0.4" opacity="0.15" />
      <path d="M132 278 Q134 277 136 278" fill="none" stroke="#353020" strokeWidth="0.4" opacity="0.14" />
      <path d="M145 279 Q147 278 149 280" fill="none" stroke="#353020" strokeWidth="0.4" opacity="0.13" />
      {/* Moss/algae on the log */}
      <path d="M125 278 Q130 277 135 278" fill="none" stroke="#2a3020" strokeWidth="1" opacity="0.12" />

      {/* Rotting log — right marsh, broken in two */}
      <path d="M570 290 Q582 288 590 290" fill="none" stroke="#2a2518" strokeWidth="2" opacity="0.25" />
      <path d="M596 289 Q602 287 608 290" fill="none" stroke="#2a2518" strokeWidth="2" opacity="0.22" />
      {/* Water-logged end */}
      <ellipse cx="590" cy="291" rx="3" ry="1.5" fill="#222015" opacity="0.18" />

      {/* Marsh bubbles — stagnant water releasing gas */}
      {/* Bubble cluster 1 — near rotting log */}
      <circle cx="138" cy="283" r="1.2" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;1.2;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.2;0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="142" cy="282" r="0.8" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;0.8;0" dur="4s" begin="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.15;0" dur="4s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="135" cy="284" r="0.6" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;0.6;0" dur="3.5s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.12;0" dur="3.5s" begin="0.8s" repeatCount="indefinite" />
      </circle>

      {/* Bubble cluster 2 — near body 2 */}
      <circle cx="480" cy="264" r="1" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;1;0" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.18;0" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="483" cy="263" r="0.7" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;0.7;0" dur="5s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.14;0" dur="5s" begin="2s" repeatCount="indefinite" />
      </circle>

      {/* Bubble cluster 3 — stagnant patch center */}
      <circle cx="350" cy="315" r="0.9" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;0.9;0" dur="6s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.16;0" dur="6s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="353" cy="316" r="0.5" fill="url(#ch10_bubble)">
        <animate attributeName="r" values="0;0.5;0" dur="4.5s" begin="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.1;0" dur="4.5s" begin="3s" repeatCount="indefinite" />
      </circle>

      {/* Stagnant water scum patches */}
      <ellipse cx="140" cy="285" rx="12" ry="2" fill="#2a3028" opacity="0.08" />
      <ellipse cx="585" cy="292" rx="10" ry="1.5" fill="#2a3028" opacity="0.06" />

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

      {/* === CROW on dead branch — ominous === */}
      {/* Dead tree snag — small, near right willow */}
      <path d="M690 195 Q691 178 692 165" fill="none" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.5" />
      <path d="M692 165 Q696 158 700 162" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.45" />
      <path d="M692 165 Q688 160 686 164" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.4" />
      {/* Crow silhouette — perched on the branch */}
      <path d="M697 157 Q700 154 703 156 Q705 158 703 160 Q700 162 697 160 Z" fill="#0a0a0a" opacity="0.55" />
      <circle cx="703" cy="156" r="1.8" fill="#0a0a0a" opacity="0.55" />
      {/* Beak */}
      <path d="M704.5 155.5 L707 155 L705 156.5" fill="#0a0a0a" opacity="0.5" />
      {/* Tail feathers */}
      <path d="M696 159 Q693 160 691 159" fill="none" stroke="#0a0a0a" strokeWidth="0.8" opacity="0.45" />

      {/* Willow 3 — distant, smaller */}
      <path d="M300 185 Q302 168 304 155" fill="none" stroke="#252530" strokeWidth="1.2" opacity="0.4" />
      <path d="M304 155 Q308 148 309 153" fill="none" stroke="#252530" strokeWidth="0.5" opacity="0.35" />
      <path d="M304 155 Q300 149 299 153" fill="none" stroke="#252530" strokeWidth="0.5" opacity="0.35" />
      <path d="M308 150 Q314 158 316 170" fill="none" stroke="#252530" strokeWidth="0.3" opacity="0.3" />
      <path d="M299 151 Q293 160 291 172" fill="none" stroke="#252530" strokeWidth="0.3" opacity="0.3" />

      {/* === WADING SOLDIER — flanking attempt through the marsh === */}
      {/* Soldier waist-deep in water, right side of causeway */}
      {/* Water disturbance around wading figure */}
      <ellipse cx="450" cy="278" rx="10" ry="2" fill="none" stroke="#3a4550" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="rx" values="10;13;10" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Torso above water */}
      <path d="M447 278 Q446 270 448 264 Q450 260 452 264 L453 272 Q452 276 451 278 Z"
        fill="#151518" opacity="0.6" />
      {/* Head */}
      <circle cx="449" cy="258" r="3.5" fill="#151518" opacity="0.6" />
      {/* Shako */}
      <rect x="447" y="254" width="5" height="2" fill="#151518" opacity="0.5" />
      {/* Musket held above head */}
      <line x1="454" y1="262" x2="460" y2="250" stroke="#151518" strokeWidth="1" opacity="0.45" />
      {/* Arm raised holding musket up */}
      <path d="M453 264 Q456 258 458 254" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      {/* Wake behind the wader */}
      <path d="M445 280 Q440 282 435 281" fill="none" stroke="#3a4550" strokeWidth="0.4" opacity="0.1" />
      <path d="M443 282 Q438 284 432 283" fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.08" />

      {/* === FROZEN MUD BANK — near side where French form up === */}
      <path d="M280 380 Q300 365 340 368 Q345 370 340 380 Z" fill="url(#ch10_mudBank)" opacity="0.6" />
      <path d="M250 400 Q270 378 310 380 Q330 382 340 400 Z" fill="url(#ch10_mudBank)" opacity="0.55" />
      {/* Frozen mud texture */}
      <path d="M290 378 Q295 376 300 378" fill="none" stroke="#353025" strokeWidth="0.4" opacity="0.2" />
      <path d="M275 390 Q282 388 290 390" fill="none" stroke="#353025" strokeWidth="0.4" opacity="0.18" />

      {/* Stacked muskets — tripod stack on the bank */}
      <line x1="295" y1="375" x2="290" y2="348" stroke="#1a1a18" strokeWidth="1.2" opacity="0.5" />
      <line x1="300" y1="375" x2="302" y2="348" stroke="#1a1a18" strokeWidth="1.2" opacity="0.5" />
      <line x1="305" y1="375" x2="296" y2="349" stroke="#1a1a18" strokeWidth="1.2" opacity="0.48" />
      {/* Bayonet tips glint */}
      <line x1="290" y1="348" x2="289" y2="344" stroke="#5a6a70" strokeWidth="0.5" opacity="0.3" />
      <line x1="302" y1="348" x2="303" y2="344" stroke="#5a6a70" strokeWidth="0.5" opacity="0.3" />

      {/* Drum — lying on its side */}
      <ellipse cx="318" cy="378" rx="7" ry="4" fill="#2a2218" opacity="0.45" />
      <path d="M311 378 Q311 373 318 371 Q325 373 325 378" fill="none" stroke="#3a3228" strokeWidth="0.8" opacity="0.35" />
      {/* Drum cords */}
      <path d="M313 375 L315 378 L317 375 L319 378 L321 375 L323 378" fill="none" stroke="#3a3228" strokeWidth="0.4" opacity="0.25" />

      {/* Cartridge box / knapsack */}
      <rect x="280" y="374" width="6" height="4" rx="1" fill="#1a1a18" opacity="0.35" />

      {/* === FRENCH CANNON BATTERY — 2 guns on near bank, right side === */}
      {/* Gun emplacement ground — flattened mud area */}
      <path d="M620 370 Q650 362 700 365 Q720 368 730 380 L620 380 Z" fill="url(#ch10_mudBank)" opacity="0.55" />
      <path d="M615 380 Q640 372 710 375 Q730 378 740 400 L610 400 Z" fill="url(#ch10_mudBank)" opacity="0.5" />

      {/* Cannon 1 — left gun of the pair */}
      {/* Carriage/wheels */}
      <circle cx="645" cy="374" r="5" fill="none" stroke="#1a1a18" strokeWidth="1.5" opacity="0.6" />
      <circle cx="645" cy="374" r="2" fill="#1a1a18" opacity="0.4" />
      <circle cx="655" cy="375" r="4.5" fill="none" stroke="#1a1a18" strokeWidth="1.5" opacity="0.55" />
      <circle cx="655" cy="375" r="1.8" fill="#1a1a18" opacity="0.35" />
      {/* Gun trail — angled back */}
      <path d="M650 374 Q658 380 668 384" fill="none" stroke="#1a1a18" strokeWidth="2.5" opacity="0.55" />
      {/* Barrel — pointing toward causeway end */}
      <line x1="640" y1="370" x2="618" y2="358" stroke="#1a1a18" strokeWidth="3" opacity="0.65" />
      {/* Barrel muzzle */}
      <circle cx="617" cy="357" r="2" fill="#1a1a18" opacity="0.6" />
      {/* Muzzle flash — animated firing */}
      <ellipse cx="612" cy="355" rx="8" ry="5" fill="url(#ch10_cannonFlash)">
        <animate attributeName="opacity" values="0;0;0.8;1;0.5;0;0;0;0;0;0" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Cannon 1 crew — artilleryman with rammer */}
      <path d="M660 368 Q659 360 660 354 Q661 350 663 354 L664 364 Q663 368 662 372 Z"
        fill="#151518" opacity="0.6" />
      <circle cx="661" cy="349" r="3.5" fill="#151518" opacity="0.6" />
      {/* Rammer/sponge staff held upright */}
      <line x1="665" y1="352" x2="667" y2="325" stroke="#1a1a18" strokeWidth="1" opacity="0.45" />
      <ellipse cx="667" cy="324" rx="1.5" ry="2" fill="#2a2a22" opacity="0.35" />

      {/* Cannon 2 — right gun of the pair */}
      {/* Carriage/wheels */}
      <circle cx="698" cy="370" r="5" fill="none" stroke="#1a1a18" strokeWidth="1.5" opacity="0.55" />
      <circle cx="698" cy="370" r="2" fill="#1a1a18" opacity="0.38" />
      <circle cx="708" cy="371" r="4.5" fill="none" stroke="#1a1a18" strokeWidth="1.5" opacity="0.5" />
      <circle cx="708" cy="371" r="1.8" fill="#1a1a18" opacity="0.33" />
      {/* Gun trail */}
      <path d="M703 370 Q712 376 722 380" fill="none" stroke="#1a1a18" strokeWidth="2.5" opacity="0.5" />
      {/* Barrel */}
      <line x1="693" y1="366" x2="672" y2="354" stroke="#1a1a18" strokeWidth="3" opacity="0.6" />
      {/* Barrel muzzle */}
      <circle cx="671" cy="353" r="2" fill="#1a1a18" opacity="0.55" />
      {/* Muzzle flash — offset timing from cannon 1 */}
      <ellipse cx="666" cy="351" rx="8" ry="5" fill="url(#ch10_cannonFlash)">
        <animate attributeName="opacity" values="0;0;0;0;0;0.7;0.9;0.4;0;0;0" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Cannon 2 crew — artilleryman with linstock */}
      <path d="M715 365 Q714 357 715 351 Q716 347 718 351 L719 361 Q718 365 717 369 Z"
        fill="#151518" opacity="0.55" />
      <circle cx="716" cy="346" r="3.5" fill="#151518" opacity="0.55" />
      {/* Linstock — slow match on a pole */}
      <line x1="720" y1="350" x2="722" y2="330" stroke="#1a1a18" strokeWidth="0.8" opacity="0.4" />
      {/* Slow match ember glow */}
      <circle cx="722" cy="329" r="1" fill="#c07030" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.55;0.35" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Powder barrel beside the guns */}
      <ellipse cx="680" cy="378" rx="4" ry="5" fill="#2a2218" opacity="0.45" />
      <path d="M676 378 Q680 374 684 378" fill="none" stroke="#3a3228" strokeWidth="0.6" opacity="0.3" />

      {/* === THICK BATTERY SMOKE — billowing from French cannons === */}
      {/* Large smoke cloud from cannon 1 */}
      <ellipse cx="608" cy="348" rx="28" ry="14" fill="url(#ch10_batterySmoke)">
        <animate attributeName="rx" values="28;38;28" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="348;342;348" dur="7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="7s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke rolling upward from cannon 1 */}
      <ellipse cx="615" cy="335" rx="20" ry="10" fill="#5a5a55" opacity="0.15">
        <animate attributeName="cy" values="335;320;335" dur="8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="20;30;20" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke from cannon 2 */}
      <ellipse cx="660" cy="344" rx="25" ry="12" fill="url(#ch10_batterySmoke)">
        <animate attributeName="rx" values="25;35;25" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="344;338;344" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="8s" repeatCount="indefinite" />
      </ellipse>
      {/* Drifting combined smoke cloud — moving left toward causeway */}
      <ellipse cx="630" cy="330" rx="45" ry="16" fill="#4a4a48" opacity="0.1">
        <animate attributeName="cx" values="630;600;630" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.18;0.1" dur="12s" repeatCount="indefinite" />
        <animate attributeName="rx" values="45;60;45" dur="12s" repeatCount="indefinite" />
      </ellipse>
      {/* High smoke wisps dissipating */}
      <ellipse cx="620" cy="310" rx="35" ry="8" fill="#4a4a48" opacity="0.06">
        <animate attributeName="cx" values="620;580;620" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="15s" repeatCount="indefinite" />
      </ellipse>

      {/* === AMMUNITION BEARERS — 2 soldiers running with boxes toward battery === */}
      {/* Bearer 1 — running, leaning forward, carrying a crate */}
      <path d="M730 360 Q729 352 730 346 Q731 342 733 346 L734 356 Q733 360 732 364 Z"
        fill="#151518" opacity="0.6" />
      <circle cx="731" cy="341" r="3.5" fill="#151518" opacity="0.6" />
      {/* Running legs — stride extended */}
      <path d="M729 364 Q726 370 723 374" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      <path d="M733 364 Q736 368 738 372" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      {/* Ammunition crate on shoulder */}
      <rect x="725" y="340" width="8" height="5" rx="0.5" fill="#2a2218" opacity="0.5" />
      {/* Arms supporting crate */}
      <path d="M728 346 Q727 342 727 340" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.4" />
      <path d="M734 346 Q735 342 735 340" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.4" />

      {/* Bearer 2 — slightly behind, also running with a box */}
      <path d="M748 358 Q747 350 748 344 Q749 340 751 344 L752 354 Q751 358 750 362 Z"
        fill="#151518" opacity="0.55" />
      <circle cx="749" cy="339" r="3.2" fill="#151518" opacity="0.55" />
      {/* Running legs */}
      <path d="M747 362 Q744 367 741 371" fill="none" stroke="#151518" strokeWidth="1.3" opacity="0.35" />
      <path d="M751 362 Q754 366 756 370" fill="none" stroke="#151518" strokeWidth="1.3" opacity="0.35" />
      {/* Ammunition box under arm */}
      <rect x="743" y="346" width="7" height="4.5" rx="0.5" fill="#2a2218" opacity="0.45" />
      <path d="M746 350 Q745 348 744 346" fill="none" stroke="#151518" strokeWidth="1" opacity="0.35" />

      {/* === OFFICER WITH TELESCOPE — observing the advance from near bank === */}
      {/* Standing tall, slightly apart from the waiting soldiers */}
      <path d="M145 355 Q143 342 145 332 Q147 326 149 332 L151 355 Q150 365 149 372 L145 372 Z"
        fill="#151518" opacity="0.7" />
      <circle cx="147" cy="325" r="4.5" fill="#151518" opacity="0.7" />
      {/* Bicorne hat silhouette — distinctive officer headgear */}
      <path d="M142 323 Q144 319 147 318 Q150 319 152 323" fill="#151518" opacity="0.65" />
      <path d="M141 323 L153 323" fill="none" stroke="#151518" strokeWidth="1" opacity="0.6" />
      {/* Telescope — extended, held to eye */}
      <line x1="152" y1="325" x2="170" y2="318" stroke="#1a1a18" strokeWidth="1.5" opacity="0.55" />
      {/* Telescope tube segments */}
      <line x1="158" y1="322" x2="164" y2="320" stroke="#2a2a28" strokeWidth="2" opacity="0.4" />
      {/* Lens glint */}
      <circle cx="170" cy="318" r="1.2" fill="#5a6a70" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.4;0.25" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Other arm behind back — officer posture */}
      <path d="M144 340 Q141 338 140 342 Q139 346 141 348" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.45" />
      {/* Sash across chest hint */}
      <path d="M146 336 Q148 342 149 348" fill="none" stroke="#2a2030" strokeWidth="1" opacity="0.2" />
      {/* Sword scabbard at side */}
      <line x1="143" y1="348" x2="141" y2="370" stroke="#1a1a18" strokeWidth="0.8" opacity="0.35" />

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

      {/* === BODY ON CAUSEWAY — the advance steps over the dead === */}
      <path d="M366 305 Q372 300 378 303 Q382 308 376 312 Q370 310 366 305 Z" fill="#151518" opacity="0.45" />
      <circle cx="366" cy="303" r="2.5" fill="#151518" opacity="0.4" />
      {/* Outflung arm */}
      <path d="M378 308 Q383 310 387 312" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.3" />
      {/* Musket fallen beside */}
      <line x1="363" y1="308" x2="358" y2="318" stroke="#1a1a18" strokeWidth="0.8" opacity="0.25" />

      {/* === WOUNDED BEING DRAGGED — comrade pulling wounded man back from causeway === */}
      {/* The wounded man — limp, dragging feet on causeway */}
      <path d="M348 365 Q350 358 352 354 Q354 358 355 365 Z" fill="#151518" opacity="0.6" />
      <circle cx="351" cy="352" r="3.5" fill="#151518" opacity="0.58" />
      {/* Head lolling to one side */}
      <path d="M349 353 Q347 355 346 354" fill="none" stroke="#151518" strokeWidth="1" opacity="0.35" />
      {/* Dragging legs — limp on the stone */}
      <path d="M349 365 Q346 372 344 378" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      <path d="M354 365 Q355 372 356 377" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      {/* The rescuer — pulling from behind, gripping under arms */}
      <path d="M338 358 Q336 348 338 340 Q340 335 342 340 L343 354 Q342 358 341 362 Z"
        fill="#151518" opacity="0.65" />
      <circle cx="340" cy="334" r="4" fill="#151518" opacity="0.65" />
      {/* Arms reaching forward to grip the wounded man */}
      <path d="M343 344 Q346 348 348 354" fill="none" stroke="#151518" strokeWidth="2" opacity="0.45" />
      <path d="M337 344 Q340 348 342 354" fill="none" stroke="#151518" strokeWidth="2" opacity="0.45" />
      {/* Rescuer leaning back — strain posture */}
      <path d="M337 362 Q334 368 332 374" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      <path d="M342 362 Q343 368 344 374" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />
      {/* Blood trail on causeway behind the wounded */}
      <path d="M353 368 Q355 372 357 376 Q358 378 360 380" fill="none" stroke="#1a1210" strokeWidth="1.5" opacity="0.12" />

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
      {/* Flag / standard — tricolor with wind animation and battle damage */}
      <line x1="398" y1="206" x2="398" y2="182" stroke="#252520" strokeWidth="1.5" opacity="0.5" />
      <path d="M398 182 L412 186 L412 196 L398 192" fill="url(#ch10_tricolor)">
        <animate attributeName="d"
          values="M398 182 L412 186 L412 196 L398 192;M398 182 L413 184 L411 195 L398 192;M398 182 L412 187 L413 196 L398 192;M398 182 L412 186 L412 196 L398 192"
          dur="3s" repeatCount="indefinite" />
      </path>
      {/* === FLAG BATTLE DAMAGE — torn by shot === */}
      {/* Hole 1 — ragged musket ball hole in white stripe */}
      <circle cx="405" cy="189" r="1.2" fill="#2a3540" opacity="0.5">
        <animate attributeName="cx" values="405;406;405.5;405" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Torn edge around hole 1 */}
      <path d="M403.5 188 Q404 187.5 405 188.2 Q406 187.8 406.5 188.5"
        fill="none" stroke="#3a4550" strokeWidth="0.3" opacity="0.35">
        <animate attributeName="d"
          values="M403.5 188 Q404 187.5 405 188.2 Q406 187.8 406.5 188.5;M404 187.8 Q404.5 187.3 405.5 188 Q406.5 187.6 407 188.3;M403.5 188 Q404 187.5 405 188.2 Q406 187.8 406.5 188.5"
          dur="3s" repeatCount="indefinite" />
      </path>
      {/* Hole 2 — larger tear in red stripe */}
      <ellipse cx="409" cy="193" rx="1.5" ry="1" fill="#2a3540" opacity="0.45">
        <animate attributeName="cx" values="409;410;409.5;409" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Ragged tear extending from hole 2 to flag edge */}
      <path d="M410.5 193 Q411.5 193.5 412 194"
        fill="none" stroke="#2a3540" strokeWidth="0.5" opacity="0.4">
        <animate attributeName="d"
          values="M410.5 193 Q411.5 193.5 412 194;M411 192.8 Q412 193.3 412.5 193.8;M410.5 193 Q411.5 193.5 412 194"
          dur="3s" repeatCount="indefinite" />
      </path>
      {/* Hole 3 — small nick in blue stripe */}
      <circle cx="401" cy="186" r="0.8" fill="#2a3540" opacity="0.4">
        <animate attributeName="cx" values="401;401.5;401.2;401" dur="3s" repeatCount="indefinite" />
      </circle>
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

      {/* === SOLDIERS WAITING ON NEAR BANK — steeling themselves === */}
      {/* Kneeling soldier — praying or bracing */}
      <path d="M260 368 Q258 360 260 354 Q262 350 264 354 L265 362 Q264 366 262 370 Z"
        fill="#151518" opacity="0.7" />
      <circle cx="261" cy="349" r="4" fill="#151518" opacity="0.7" />
      {/* Kneeling legs — lower posture */}
      <path d="M258 370 Q256 374 254 376" fill="none" stroke="#151518" strokeWidth="2" opacity="0.45" />
      <path d="M264 370 Q266 374 268 375" fill="none" stroke="#151518" strokeWidth="1.8" opacity="0.4" />

      {/* Standing soldier checking musket */}
      <path d="M240 360 Q238 348 240 340 Q242 334 244 340 L246 360 Q245 368 244 374 L240 374 Z"
        fill="#151518" opacity="0.72" />
      <circle cx="242" cy="334" r="4.5" fill="#151518" opacity="0.72" />
      {/* Musket held diagonal — inspecting */}
      <line x1="248" y1="338" x2="255" y2="318" stroke="#151518" strokeWidth="1.2" opacity="0.5" />
      {/* Other hand on musket */}
      <path d="M238 350 Q235 345 237 340" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.4" />

      {/* Third waiting soldier — standing, arms crossed, head down */}
      <path d="M220 363 Q218 352 220 345 Q222 340 224 345 L225 363 Q224 370 223 376 L220 376 Z"
        fill="#151518" opacity="0.65" />
      <circle cx="222" cy="339" r="4" fill="#151518" opacity="0.65" />
      {/* Arms folded across chest */}
      <path d="M218 352 Q220 350 225 352" fill="none" stroke="#151518" strokeWidth="2" opacity="0.4" />

      {/* === ADDITIONAL WAITING SOLDIERS — more anxious troops on near bank === */}
      {/* Soldier 4 — crouching, gripping musket, looking at the causeway */}
      <path d="M195 372 Q194 364 196 358 Q197 354 199 358 L200 366 Q199 370 198 374 Z"
        fill="#151518" opacity="0.6" />
      <circle cx="197" cy="353" r="3.5" fill="#151518" opacity="0.6" />
      {/* Musket resting across knees */}
      <line x1="192" y1="368" x2="206" y2="365" stroke="#151518" strokeWidth="1" opacity="0.4" />
      {/* Bent legs */}
      <path d="M195 374 Q192 378 190 380" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.35" />
      <path d="M200 374 Q202 378 204 380" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.35" />

      {/* Soldier 5 — standing back, hand over face (fear/dread) */}
      <path d="M175 360 Q173 348 175 340 Q177 335 179 340 L180 355 Q179 362 178 370 L175 370 Z"
        fill="#151518" opacity="0.55" />
      <circle cx="177" cy="334" r="3.8" fill="#151518" opacity="0.55" />
      {/* Hand raised to face */}
      <path d="M179 340 Q181 336 180 333" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.38" />
      {/* Musket slung on back — diagonal */}
      <line x1="173" y1="342" x2="170" y2="322" stroke="#151518" strokeWidth="0.8" opacity="0.35" />

      {/* Soldier 6 — sitting on the bank, head bowed */}
      <path d="M330 382 Q329 376 330 372 Q332 368 334 372 L334 378 Q333 381 332 385 Z"
        fill="#151518" opacity="0.58" />
      <circle cx="331" cy="367" r="3.5" fill="#151518" opacity="0.58" />
      {/* Head tilted down */}
      <path d="M329 368 Q330 371 332 370" fill="none" stroke="#151518" strokeWidth="1" opacity="0.3" />
      {/* Legs stretched out */}
      <path d="M329 385 Q326 388 324 392" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.35" />
      <path d="M334 385 Q336 389 339 392" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.35" />

      {/* === CAMPFIRE BEHIND LINES — reserves warming themselves === */}
      {/* Fire pit — small circle of stones */}
      <ellipse cx="85" cy="382" rx="8" ry="3" fill="#2a2518" opacity="0.4" />
      {/* Stones around fire */}
      <circle cx="78" cy="382" r="1.5" fill="#3a3530" opacity="0.35" />
      <circle cx="82" cy="380" r="1.2" fill="#3a3530" opacity="0.32" />
      <circle cx="88" cy="380" r="1.3" fill="#3a3530" opacity="0.33" />
      <circle cx="92" cy="382" r="1.4" fill="#3a3530" opacity="0.34" />
      {/* Flame shapes — flickering */}
      <path d="M83 380 Q84 374 85 370 Q86 374 87 380" fill="#c07030" opacity="0.3">
        <animate attributeName="d" values="M83 380 Q84 374 85 370 Q86 374 87 380;M83 380 Q85 373 86 369 Q87 373 87 380;M83 380 Q84 375 85 371 Q86 375 87 380" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.4;0.3" dur="0.8s" repeatCount="indefinite" />
      </path>
      <path d="M84 380 Q85 376 86 372 Q87 376 88 380" fill="#e09030" opacity="0.2">
        <animate attributeName="d" values="M84 380 Q85 376 86 372 Q87 376 88 380;M84 380 Q86 375 87 371 Q87 376 88 380;M84 380 Q85 377 86 373 Q87 377 88 380" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.3;0.2" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Ember glow on ground */}
      <ellipse cx="85" cy="383" rx="12" ry="4" fill="url(#ch10_fireGlow)">
        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Smoke rising from fire */}
      <path d="M85 370 Q83 360 85 350" fill="none" stroke="#4a4a48" strokeWidth="1" opacity="0.12">
        <animate attributeName="d" values="M85 370 Q83 360 85 350;M85 370 Q87 358 84 348;M85 370 Q83 360 85 350" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.18;0.12" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Reserve soldier 1 — standing near fire, warming hands */}
      <path d="M72 372 Q71 362 72 355 Q73 350 75 355 L76 368 Q75 372 74 378 Z"
        fill="#151518" opacity="0.55" />
      <circle cx="73" cy="349" r="3.5" fill="#151518" opacity="0.55" />
      {/* Hands extended toward fire */}
      <path d="M76 358 Q79 362 82 364" fill="none" stroke="#151518" strokeWidth="1.5" opacity="0.38" />

      {/* Reserve soldier 2 — crouching near fire */}
      <path d="M96 376 Q95 370 96 366 Q97 363 99 366 L99 372 Q98 376 97 380 Z"
        fill="#151518" opacity="0.5" />
      <circle cx="97" cy="362" r="3" fill="#151518" opacity="0.5" />
      {/* Warming hands */}
      <path d="M95 370 Q92 372 89 374" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.35" />

      {/* === DRUMMER BOY — near the formed-up reserves === */}
      {/* Small figure — shorter than the soldiers */}
      <path d="M110 374 Q109 366 110 360 Q111 356 112 360 L113 370 Q112 374 111 378 Z"
        fill="#151518" opacity="0.6" />
      <circle cx="111" cy="355" r="3" fill="#151518" opacity="0.6" />
      {/* Drum hanging from shoulder strap — at waist height */}
      <ellipse cx="115" cy="370" rx="4" ry="2.5" fill="#2a2218" opacity="0.45" />
      <path d="M111 370 Q115 367 119 370" fill="none" stroke="#3a3228" strokeWidth="0.6" opacity="0.3" />
      {/* Drum strap across chest */}
      <path d="M112 358 Q114 364 115 368" fill="none" stroke="#2a2218" strokeWidth="0.8" opacity="0.3" />
      {/* Drumsticks — one raised, mid-beat */}
      <line x1="113" y1="364" x2="118" y2="358" stroke="#1a1a18" strokeWidth="0.7" opacity="0.45" />
      <line x1="109" y1="365" x2="106" y2="360" stroke="#1a1a18" strokeWidth="0.7" opacity="0.4" />
      {/* Legs */}
      <path d="M110 378 Q108 382 107 386" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.38" />
      <path d="M113 378 Q114 382 115 386" fill="none" stroke="#151518" strokeWidth="1.2" opacity="0.38" />

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
      {/* Breath from waiting soldiers on bank */}
      <ellipse cx="245" cy="332" rx="5" ry="1.8" fill="#4a5560" opacity="0.1">
        <animate attributeName="rx" values="5;8;5" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Breath from new waiting soldiers */}
      <ellipse cx="200" cy="351" rx="4" ry="1.5" fill="#4a5560" opacity="0.08">
        <animate attributeName="rx" values="4;7;4" dur="3.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3.4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="180" cy="332" rx="4" ry="1.5" fill="#4a5560" opacity="0.07">
        <animate attributeName="rx" values="4;6;4" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.07;0.02;0.07" dur="3.6s" repeatCount="indefinite" />
      </ellipse>

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Cold frost tint */}
      <rect width="800" height="400" fill="#3a5060" opacity="0.03" />

      {/* === RAIN / DRIZZLE OVERLAY — November weather === */}
      <rect width="800" height="400" fill="url(#ch10_rain)" opacity="0.7">
        <animate attributeName="y" values="0;-40;0" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Second rain layer — offset for density */}
      <rect x="20" width="800" height="400" fill="url(#ch10_rain)" opacity="0.5">
        <animate attributeName="y" values="-20;-60;-20" dur="1.8s" repeatCount="indefinite" />
      </rect>

      {/* === HEAVY FOREGROUND RAIN — intensifying downpour === */}
      {/* Thick rain layer — closer, larger drops */}
      <rect width="800" height="400" fill="url(#ch10_heavyRain)" opacity="0.6">
        <animate attributeName="y" values="0;-50;0" dur="1.5s" repeatCount="indefinite" />
      </rect>
      {/* Diagonal wind-driven rain streaks — foreground */}
      <rect x="-40" width="880" height="400" fill="url(#ch10_heavyRain)" opacity="0.4" transform="skewX(-5)">
        <animate attributeName="y" values="-10;-60;-10" dur="1.6s" repeatCount="indefinite" />
      </rect>
      {/* Rain splash ripples on water surface — near bank */}
      <circle cx="200" cy="300" r="2" fill="none" stroke="#5a6a75" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="r" values="0;3;0" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0;0.12" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="500" cy="280" r="2" fill="none" stroke="#5a6a75" strokeWidth="0.3" opacity="0.07">
        <animate attributeName="r" values="0;2.5;0" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0;0.1" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="310" r="2" fill="none" stroke="#5a6a75" strokeWidth="0.3" opacity="0.06">
        <animate attributeName="r" values="0;2;0" dur="1.3s" begin="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0;0.08" dur="1.3s" begin="0.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="330" r="2" fill="none" stroke="#5a6a75" strokeWidth="0.3" opacity="0.07">
        <animate attributeName="r" values="0;2.5;0" dur="1.4s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.09;0;0.09" dur="1.4s" begin="0.5s" repeatCount="indefinite" />
      </circle>

      {/* Vignette */}
      <rect width="800" height="400" fill="url(#ch10_vignette)" />

      {/* Top/bottom darkening */}
      <rect x="0" y="0" width="800" height="25" fill="#101520" opacity="0.3" />
      <rect x="0" y="380" width="800" height="20" fill="#101520" opacity="0.35" />
    </svg>
  );
}
