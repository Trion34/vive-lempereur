import React from 'react';

/**
 * Ch.3 — Mondovì, Piedmont plain (April 1796)
 * Warm golden evening after a victorious day of plunder.
 * Rolling farmland, golden wheat, distant village with bell tower,
 * cypress-lined road, Italian farmhouse, campfire feast.
 * The army eats well for the first time — wine, bread, chickens, celebration.
 * Mood: Warm, joyful, relaxed — the first comfort after months of starvation.
 */
export function Ch3MondoviScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Warm golden-amber sunset sky */}
        <linearGradient id="ch3_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e0a18" />
          <stop offset="12%" stopColor="#1e1430" />
          <stop offset="30%" stopColor="#4a2538" />
          <stop offset="50%" stopColor="#8a4535" />
          <stop offset="70%" stopColor="#b86838" />
          <stop offset="85%" stopColor="#d08842" />
          <stop offset="100%" stopColor="#e0b050" />
        </linearGradient>
        {/* Sunset glow — warm radiance on right horizon */}
        <radialGradient id="ch3_sunGlow" cx="0.75" cy="0.58" r="0.35">
          <stop offset="0%" stopColor="#e0b050" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#d09040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </radialGradient>
        {/* Distant mountains — purple haze */}
        <linearGradient id="ch3_mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3550" />
          <stop offset="100%" stopColor="#5a4555" />
        </linearGradient>
        {/* Rolling farmland */}
        <linearGradient id="ch3_field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a7535" />
          <stop offset="50%" stopColor="#4a5528" />
          <stop offset="100%" stopColor="#3a4520" />
        </linearGradient>
        {/* Golden wheat field */}
        <linearGradient id="ch3_wheat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a08530" />
          <stop offset="100%" stopColor="#7a6525" />
        </linearGradient>
        {/* Camp ground — warm earth */}
        <linearGradient id="ch3_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3525" />
          <stop offset="60%" stopColor="#2e2a1c" />
          <stop offset="100%" stopColor="#221e14" />
        </linearGradient>
        {/* Campfire glow */}
        <radialGradient id="ch3_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.6" />
          <stop offset="30%" stopColor="#d09040" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#b07030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06020" stopOpacity="0" />
        </radialGradient>
        {/* Farmhouse window glow */}
        <radialGradient id="ch3_windowGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e0a050" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0" />
        </radialGradient>
        {/* Firefly glow */}
        <radialGradient id="ch3_fireflyGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0d060" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a0b040" stopOpacity="0" />
        </radialGradient>
        {/* Warm vignette — gentle, not dark */}
        <radialGradient id="ch3_vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a0a00" stopOpacity="0.25" />
        </radialGradient>
        {/* Terracotta roof */}
        <linearGradient id="ch3_roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a4a2a" />
          <stop offset="100%" stopColor="#6a3820" />
        </linearGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch3_sky)" />
      <rect width="800" height="400" fill="url(#ch3_sunGlow)" />

      {/* Soft pink-gold clouds */}
      <ellipse cx="180" cy="70" rx="120" ry="12" fill="#8a4545" opacity="0.18" />
      <ellipse cx="350" cy="55" rx="100" ry="10" fill="#a05550" opacity="0.15" />
      <ellipse cx="550" cy="80" rx="140" ry="14" fill="#a05040" opacity="0.2" />
      <ellipse cx="650" cy="60" rx="90" ry="8" fill="#b06050" opacity="0.18" />
      <ellipse cx="300" cy="40" rx="160" ry="5" fill="#60354a" opacity="0.15" />

      {/* Emerging stars */}
      <circle cx="120" cy="18" r="1.2" fill="#d0c898" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="12" r="1" fill="#d0c898" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="22" r="0.8" fill="#d0c898" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="650" cy="15" r="1.1" fill="#d0c898" opacity="0.45">
        <animate attributeName="opacity" values="0.45;0.2;0.45" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="35" r="0.9" fill="#d0c898" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.12;0.3" dur="3.8s" repeatCount="indefinite" />
      </circle>
      {/* Evening star — bright Venus */}
      <circle cx="200" cy="48" r="1.8" fill="#e0d8a8" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.5;0.7" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* === DISTANT ALPS === */}
      <path d="M0 140 Q40 118 100 128 Q150 105 220 118 Q270 100 330 115 Q380 95 440 110 Q490 98 550 112 Q600 92 660 108 Q720 95 780 115 L800 120 L800 170 L0 170 Z"
        fill="url(#ch3_mtn)" opacity="0.55" />
      <path d="M148 107 Q155 100 162 107" fill="#7a6878" opacity="0.25" />
      <path d="M378 97 Q385 90 392 97" fill="#7a6878" opacity="0.25" />
      <path d="M598 94 Q605 87 612 94" fill="#7a6878" opacity="0.2" />

      {/* === DISTANT VILLAGE WITH BELL TOWER === */}
      <rect x="620" y="154" width="10" height="14" fill="#5a4a3a" opacity="0.55" />
      <path d="M618 154 L625 146 L632 154" fill="#6a5a48" opacity="0.55" />
      <rect x="636" y="156" width="8" height="12" fill="#5a4a3a" opacity="0.5" />
      <path d="M634 156 L640 150 L646 156" fill="#6a5a48" opacity="0.5" />
      <rect x="650" y="158" width="7" height="10" fill="#5a4a3a" opacity="0.45" />
      <rect x="662" y="155" width="9" height="13" fill="#5a4a3a" opacity="0.5" />
      <path d="M661 155 L666 148 L672 155" fill="#6a5a48" opacity="0.5" />
      {/* Church bell tower */}
      <rect x="607" y="140" width="6" height="28" fill="#5a4a3a" opacity="0.6" />
      <path d="M605 140 L610 132 L615 140" fill="#6a5a48" opacity="0.6" />
      <line x1="610" y1="132" x2="610" y2="126" stroke="#6a5a48" strokeWidth="0.8" opacity="0.5" />
      <line x1="608" y1="128" x2="612" y2="128" stroke="#6a5a48" strokeWidth="0.6" opacity="0.5" />
      {/* Village window glows */}
      <rect x="623" y="160" width="2" height="2" fill="#d09050" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.18;0.35" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="665" y="160" width="2" height="2" fill="#d09050" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.15;0.3" dur="5s" repeatCount="indefinite" />
      </rect>

      {/* === ROLLING FARMLAND === */}
      <path d="M0 175 Q80 165 180 170 Q300 160 450 168 Q580 158 700 165 Q760 162 800 168 L800 260 L0 260 Z"
        fill="url(#ch3_field)" opacity="0.9" />
      {/* Golden wheat field — foreground left */}
      <path d="M0 210 Q60 200 140 205 Q200 200 260 208 L260 260 L0 260 Z"
        fill="url(#ch3_wheat)" opacity="0.5" />
      {/* Wheat stalks */}
      <path d="M20 215 Q22 210 24 215" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.3" />
      <path d="M60 218 Q62 213 64 218" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.25" />
      <path d="M120 214 Q122 209 124 214" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.28" />
      <path d="M180 212 Q182 207 184 212" fill="none" stroke="#b09530" strokeWidth="0.5" opacity="0.25" />
      {/* Field patchwork boundaries */}
      <path d="M260 170 L260 260" stroke="#556530" strokeWidth="0.6" opacity="0.25" />
      <path d="M450 165 L450 255" stroke="#556530" strokeWidth="0.6" opacity="0.2" />
      {/* Crop row lines */}
      <path d="M280 190 Q330 186 380 190" fill="none" stroke="#506035" strokeWidth="0.5" opacity="0.2" />
      <path d="M280 200 Q330 196 380 200" fill="none" stroke="#506035" strokeWidth="0.5" opacity="0.2" />
      <path d="M470 188 Q520 184 570 188" fill="none" stroke="#506035" strokeWidth="0.5" opacity="0.18" />

      {/* === CYPRESS TREES LINING ROAD === */}
      <path d="M140 262 Q143 225 145 185 Q147 225 150 262" fill="#1a2818" opacity="0.6" />
      <path d="M142 245 Q144 210 145 178 Q146 210 148 245" fill="#152215" opacity="0.5" />
      <path d="M185 258 Q187 228 189 195 Q191 228 193 258" fill="#1a2818" opacity="0.55" />
      <path d="M187 248 Q188 218 189 190 Q190 218 191 248" fill="#152215" opacity="0.45" />
      <path d="M530 256 Q532 226 534 193 Q536 226 538 256" fill="#1a2818" opacity="0.5" />
      <path d="M575 254 Q577 228 578 200 Q579 228 581 254" fill="#1a2818" opacity="0.45" />
      {/* Dirt road winding toward village */}
      <path d="M140 262 Q200 250 300 255 Q400 260 500 252 Q560 248 620 255 Q660 262 700 258"
        fill="none" stroke="#5a5035" strokeWidth="3" opacity="0.2" />

      {/* Olive trees */}
      <line x1="70" y1="252" x2="74" y2="232" stroke="#3a3525" strokeWidth="2" opacity="0.5" />
      <ellipse cx="74" cy="228" rx="10" ry="7" fill="#3a4828" opacity="0.45" />
      <line x1="720" y1="255" x2="722" y2="242" stroke="#3a3525" strokeWidth="2" opacity="0.45" />
      <ellipse cx="722" cy="238" rx="9" ry="6" fill="#3a4828" opacity="0.4" />

      {/* Grape vines — right field */}
      <line x1="700" y1="220" x2="700" y2="210" stroke="#4a3a28" strokeWidth="0.8" opacity="0.3" />
      <line x1="715" y1="218" x2="715" y2="208" stroke="#4a3a28" strokeWidth="0.8" opacity="0.3" />
      <line x1="730" y1="216" x2="730" y2="206" stroke="#4a3a28" strokeWidth="0.8" opacity="0.3" />
      <path d="M700 212 Q707 210 715 211 Q722 209 730 210"
        fill="none" stroke="#3a4828" strokeWidth="0.8" opacity="0.3" />

      {/* === CAMP GROUND === */}
      <path d="M0 260 Q150 252 350 257 Q550 252 800 260 L800 400 L0 400 Z"
        fill="url(#ch3_ground)" />

      {/* === ITALIAN FARMHOUSE === */}
      <rect x="640" y="268" width="50" height="38" fill="#4a4035" />
      <rect x="640" y="268" width="50" height="38" fill="none" stroke="#5a5045" strokeWidth="0.8" />
      <line x1="640" y1="280" x2="690" y2="280" stroke="#555045" strokeWidth="0.3" opacity="0.3" />
      <line x1="640" y1="292" x2="690" y2="292" stroke="#555045" strokeWidth="0.3" opacity="0.3" />
      {/* Terracotta roof */}
      <path d="M635 268 L665 250 L695 268 Z" fill="url(#ch3_roof)" />
      <rect x="675" y="254" width="5" height="10" fill="#4a4035" />
      {/* Windows with warm glow */}
      <rect x="650" y="272" width="8" height="10" fill="#2a2518" />
      <rect x="650" y="272" width="8" height="10" fill="url(#ch3_windowGlow)">
        <animate attributeName="opacity" values="0.8;0.6;0.8" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="672" y="272" width="8" height="10" fill="#2a2518" />
      <rect x="672" y="272" width="8" height="10" fill="url(#ch3_windowGlow)">
        <animate attributeName="opacity" values="0.7;0.5;0.7" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Door with light spill */}
      <rect x="659" y="293" width="7" height="13" fill="#2a2015" />
      <path d="M659 306 L655 316 L670 316 L666 306 Z" fill="#d09040" opacity="0.08" />

      {/* === CAPTURED SUPPLY WAGON === */}
      <rect x="465" y="290" width="40" height="18" fill="#4a3a25" stroke="#5a4a35" strokeWidth="0.8" />
      <line x1="475" y1="290" x2="475" y2="308" stroke="#5a4a35" strokeWidth="0.5" opacity="0.4" />
      <line x1="485" y1="290" x2="485" y2="308" stroke="#5a4a35" strokeWidth="0.5" opacity="0.4" />
      <line x1="495" y1="290" x2="495" y2="308" stroke="#5a4a35" strokeWidth="0.5" opacity="0.4" />
      {/* Wheels with spokes */}
      <circle cx="472" cy="312" r="6" fill="none" stroke="#4a3a28" strokeWidth="1.5" />
      <circle cx="472" cy="312" r="1" fill="#4a3a28" />
      <line x1="472" y1="306" x2="472" y2="318" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="466" y1="312" x2="478" y2="312" stroke="#4a3a28" strokeWidth="0.5" />
      <circle cx="498" cy="312" r="6" fill="none" stroke="#4a3a28" strokeWidth="1.5" />
      <circle cx="498" cy="312" r="1" fill="#4a3a28" />
      <line x1="498" y1="306" x2="498" y2="318" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="492" y1="312" x2="504" y2="312" stroke="#4a3a28" strokeWidth="0.5" />
      <line x1="505" y1="300" x2="525" y2="308" stroke="#4a3a28" strokeWidth="1.2" />

      {/* === PLUNDER — FOOD AND WINE === */}
      {/* Wine barrels */}
      <ellipse cx="230" cy="302" rx="14" ry="9" fill="#4a3528" />
      <ellipse cx="230" cy="302" rx="14" ry="9" fill="none" stroke="#5a4538" strokeWidth="0.8" />
      <line x1="220" y1="302" x2="240" y2="302" stroke="#5a4538" strokeWidth="0.5" />
      <ellipse cx="252" cy="306" rx="12" ry="8" fill="#4a3528" />
      <ellipse cx="252" cy="306" rx="12" ry="8" fill="none" stroke="#5a4538" strokeWidth="0.8" />
      {/* Barrel on side — wine dripping */}
      <ellipse cx="218" cy="312" rx="10" ry="7" fill="#4a3528" opacity="0.8" />
      <line x1="218" y1="316" x2="218" y2="320" stroke="#5a1818" strokeWidth="0.5" opacity="0.3" />
      {/* Grain sacks */}
      <path d="M435 296 Q440 288 450 291 Q454 296 450 303 Q440 306 435 303 Z" fill="#5a5040" opacity="0.6" />
      <path d="M448 300 Q453 293 461 296 Q464 300 461 306 Q453 308 448 305 Z" fill="#555040" opacity="0.55" />
      {/* Bread loaves scattered */}
      <ellipse cx="340" cy="324" rx="5" ry="3" fill="#6a5530" opacity="0.5" />
      <ellipse cx="355" cy="320" rx="4" ry="2.5" fill="#6a5530" opacity="0.45" />
      <ellipse cx="290" cy="322" rx="4" ry="2.5" fill="#6a5530" opacity="0.4" />
      {/* Chickens */}
      <path d="M408 316 Q410 313 413 314 Q415 316 413 318 Q410 319 408 316 Z" fill="#6a5540" opacity="0.4" />
      <circle cx="414" cy="313" r="1" fill="#6a5540" opacity="0.4" />
      <path d="M420 320 Q422 317 425 318 Q427 320 425 322 Q422 323 420 320 Z" fill="#6a5540" opacity="0.35" />

      {/* === CAMPFIRE === */}
      {/* Ground glow */}
      <ellipse cx="340" cy="318" rx="65" ry="22" fill="url(#ch3_fireGlow)">
        <animate attributeName="rx" values="65;72;65" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Stone ring */}
      <ellipse cx="340" cy="318" rx="16" ry="5" fill="none" stroke="#4a4035" strokeWidth="1.5" opacity="0.35" />
      {/* Outer flame */}
      <path d="M334 316 Q337 300 340 290 Q343 300 346 316" fill="#d08040" opacity="0.8">
        <animate attributeName="d" values="M334 316 Q337 300 340 290 Q343 300 346 316;M334 316 Q338 298 340 287 Q342 298 346 316;M334 316 Q337 300 340 290 Q343 300 346 316" dur="0.6s" repeatCount="indefinite" />
      </path>
      {/* Inner flame */}
      <path d="M336 316 Q338 304 340 296 Q342 304 344 316" fill="#e0a050" opacity="0.6">
        <animate attributeName="d" values="M336 316 Q338 304 340 296 Q342 304 344 316;M336 316 Q339 302 340 293 Q341 302 344 316;M336 316 Q338 304 340 296 Q342 304 344 316" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Bright core */}
      <path d="M338 316 Q339 308 340 302 Q341 308 342 316" fill="#f0c060" opacity="0.5">
        <animate attributeName="d" values="M338 316 Q339 308 340 302 Q341 308 342 316;M338 316 Q340 306 340 300 Q341 306 342 316;M338 316 Q339 308 340 302 Q341 308 342 316" dur="0.4s" repeatCount="indefinite" />
      </path>
      {/* Sparks */}
      <circle cx="338" cy="285" r="0.8" fill="#e0b060" opacity="0.6">
        <animate attributeName="cy" values="285;260;235" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="344" cy="280" r="0.6" fill="#d0a050" opacity="0.5">
        <animate attributeName="cy" values="280;252;228" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="288" r="0.5" fill="#e0b070" opacity="0.45">
        <animate attributeName="cy" values="288;268;248" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.15;0" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* === SOLDIERS CELEBRATING — 6 figures === */}
      {/* Soldier 1 — standing, arms raised in triumph */}
      <path d="M305 300 Q302 285 305 274 Q308 268 311 274 L313 300 Q312 308 311 315 L305 315 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="308" cy="265" r="5" fill="#1a1815" opacity="0.8" />
      <path d="M313 275 Q318 262 320 252" fill="none" stroke="#1a1815" strokeWidth="2.2" opacity="0.75" />
      <path d="M305 276 Q300 264 297 255" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.7" />
      <rect x="318" y="246" width="3" height="8" fill="#2a2520" opacity="0.6" rx="1" />

      {/* Soldier 2 — sitting, drinking */}
      <path d="M370 310 Q368 300 370 294 Q372 290 374 294 L375 310 Z"
        fill="#1a1815" opacity="0.75" />
      <circle cx="372" cy="288" r="4.5" fill="#1a1815" opacity="0.75" />
      <path d="M376 292 Q380 288 383 284" fill="none" stroke="#1a1815" strokeWidth="1.8" opacity="0.6" />
      <rect x="382" y="280" width="2.5" height="6" fill="#2a2520" opacity="0.5" rx="0.5" />
      <path d="M370 310 Q375 315 382 318" fill="none" stroke="#1a1815" strokeWidth="2.5" opacity="0.55" />

      {/* Soldier 3 — leaning on barrel */}
      <path d="M238 290 Q236 280 238 274 Q240 270 242 274 L244 290 Z"
        fill="#1a1815" opacity="0.75" />
      <circle cx="240" cy="267" r="4.5" fill="#1a1815" opacity="0.75" />
      <path d="M244 275 Q248 278 252 280" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.55" />

      {/* Soldier 4 — sitting, eating near wagon */}
      <path d="M440 316 Q438 308 440 303 Q442 308 442 316 Z" fill="#1a1815" opacity="0.7" />
      <circle cx="440" cy="300" r="4" fill="#1a1815" opacity="0.7" />
      <path d="M443 303 Q446 300 448 298" fill="none" stroke="#1a1815" strokeWidth="1.5" opacity="0.5" />

      {/* Soldiers 5 and 6 — companions, leaning together */}
      <path d="M273 300 Q271 288 273 280 Q275 276 277 280 L279 300 Q278 306 277 312 L273 312 Z"
        fill="#1a1815" opacity="0.72" />
      <circle cx="275" cy="274" r="4.5" fill="#1a1815" opacity="0.72" />
      <path d="M286 302 Q284 290 286 282 Q288 278 290 282 L292 302 Q291 308 290 314 L286 314 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="288" cy="276" r="4" fill="#1a1815" opacity="0.7" />
      <path d="M279 280 Q282 278 286 280" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />

      {/* === FOREGROUND DETAILS === */}
      {/* Wildflowers */}
      <circle cx="100" cy="345" r="1.2" fill="#a06040" opacity="0.2" />
      <circle cx="180" cy="350" r="1.3" fill="#8a5540" opacity="0.2" />
      <circle cx="550" cy="342" r="1.1" fill="#a06040" opacity="0.18" />
      <circle cx="750" cy="355" r="1.2" fill="#a06040" opacity="0.17" />
      {/* Grass tufts */}
      <path d="M0 368 Q4 360 8 368 Q12 358 16 368 Q20 362 24 368"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.3" />
      <path d="M780 365 Q784 356 788 365 Q792 354 796 365"
        fill="none" stroke="#3a4530" strokeWidth="1" opacity="0.3" />

      {/* === FIREFLIES === */}
      <circle cx="200" cy="290" r="2" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.7;0" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cy" values="290;285;290" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="580" cy="300" r="1.8" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.6;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cx" values="580;585;580" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="130" cy="310" r="1.5" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.5;0" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="310;304;310" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="700" cy="280" r="1.6" fill="url(#ch3_fireflyGlow)">
        <animate attributeName="opacity" values="0;0.55;0" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="700;705;700" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Warm air shimmer above fire */}
      <ellipse cx="340" cy="275" rx="20" ry="8" fill="#d09040" opacity="0.03">
        <animate attributeName="ry" values="8;12;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.03;0.06;0.03" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === ATMOSPHERIC OVERLAYS === */}
      <rect width="800" height="400" fill="#d09040" opacity="0.03" />
      <rect width="800" height="400" fill="url(#ch3_vignette)" />
      <rect x="0" y="378" width="800" height="22" fill="#1a1008" opacity="0.35" />
    </svg>
  );
}
