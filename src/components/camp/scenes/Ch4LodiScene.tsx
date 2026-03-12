import React from 'react';

/**
 * Ch.4 — Lodi, river bank (Adda, not Po)
 * Dusk after the famous bridge charge. Wide river, pontoon bridge in distance,
 * artillery silhouettes, evening sky reflected in water.
 * Mood: Triumphant esprit de corps — "Le Petit Caporal" was born here.
 */
export function Ch4LodiScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Dusk sky — deep purple-orange */}
        <linearGradient id="ch4_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12101a" />
          <stop offset="25%" stopColor="#1e1525" />
          <stop offset="45%" stopColor="#351e30" />
          <stop offset="60%" stopColor="#4a3040" />
          <stop offset="75%" stopColor="#6a4038" />
          <stop offset="88%" stopColor="#8a5538" />
          <stop offset="95%" stopColor="#a06838" />
          <stop offset="100%" stopColor="#b87a40" />
        </linearGradient>
        {/* River water — dark, reflective */}
        <linearGradient id="ch4_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3540" />
          <stop offset="20%" stopColor="#352a38" />
          <stop offset="50%" stopColor="#2a2530" />
          <stop offset="80%" stopColor="#251e2a" />
          <stop offset="100%" stopColor="#201a25" />
        </linearGradient>
        {/* Sky reflection in water — warm horizon band (stronger for sunset) */}
        <linearGradient id="ch4_reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0.3" />
          <stop offset="25%" stopColor="#8a5a3a" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#7a4a30" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#7a4a30" stopOpacity="0" />
        </linearGradient>
        {/* Bank ground */}
        <linearGradient id="ch4_bank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2518" />
          <stop offset="50%" stopColor="#222015" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Fire glow — larger for celebration */}
        <radialGradient id="ch4_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d09050" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#c08040" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#a06830" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a06830" stopOpacity="0" />
        </radialGradient>
        {/* Distant fire 2 */}
        <radialGradient id="ch4_fire2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
        {/* Sunset glow on horizon */}
        <radialGradient id="ch4_sunGlow" cx="0.5" cy="0.62" r="0.35">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b87a40" stopOpacity="0" />
        </radialGradient>
        {/* Warm sunset shimmer on water */}
        <linearGradient id="ch4_warmShimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b87a40" stopOpacity="0" />
          <stop offset="30%" stopColor="#c08848" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#d09858" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#c08848" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#b87a40" stopOpacity="0" />
        </linearGradient>
        {/* Powder smoke gradient */}
        <radialGradient id="ch4_smoke" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#685850" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#584840" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#584840" stopOpacity="0" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id="ch4_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch4_sky)" />
      <rect width="800" height="400" fill="url(#ch4_sunGlow)" />

      {/* Stars appearing */}
      <circle cx="120" cy="25" r="0.8" fill="#c0b898" opacity="0.4" />
      <circle cx="280" cy="18" r="0.6" fill="#c0b898" opacity="0.3" />
      <circle cx="680" cy="30" r="0.7" fill="#c0b898" opacity="0.35" />
      <circle cx="450" cy="12" r="0.5" fill="#c0b898" opacity="0.25" />

      {/* === BIRDS — swallows silhouetted against dusk === */}
      <g opacity="0.45">
        {/* Bird 1 — swooping left */}
        <path d="M520 45 Q514 42 506 38 Q514 41 520 45 Q526 41 534 38 Q526 42 520 45" fill="#1a1520" opacity="0.7">
          <animateTransform attributeName="transform" type="translate" values="0,0;-12,-3;-20,0;-12,3;0,0" dur="6s" repeatCount="indefinite" />
        </path>
        {/* Bird 2 — higher, gliding */}
        <path d="M380 28 Q374 25 366 22 Q374 24 380 28 Q386 24 394 22 Q386 25 380 28" fill="#1a1520" opacity="0.6">
          <animateTransform attributeName="transform" type="translate" values="0,0;8,-2;16,0;8,2;0,0" dur="7.5s" repeatCount="indefinite" />
        </path>
        {/* Bird 3 — lower, darting */}
        <path d="M620 60 Q616 58 610 55 Q616 57 620 60 Q624 57 630 55 Q624 58 620 60" fill="#1a1520" opacity="0.55">
          <animateTransform attributeName="transform" type="translate" values="0,0;-6,2;-14,0;-6,-2;0,0" dur="5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Clouds catching last sunset light */}
      <ellipse cx="250" cy="50" rx="140" ry="9" fill="#5a3538" opacity="0.3" />
      <ellipse cx="500" cy="38" rx="110" ry="7" fill="#6a4540" opacity="0.25" />
      <ellipse cx="680" cy="55" rx="90" ry="6" fill="#5a3535" opacity="0.2" />
      <ellipse cx="130" cy="68" rx="100" ry="5" fill="#5a3538" opacity="0.15" />
      <ellipse cx="400" cy="65" rx="130" ry="6" fill="#4a3035" opacity="0.12" />

      {/* === POWDER SMOKE — lingering over the river from the battle === */}
      <ellipse cx="320" cy="145" rx="80" ry="18" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;15,-2;30,0;15,2;0,0" dur="12s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="480" cy="150" rx="60" ry="14" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;10,-1;20,0;10,1;0,0" dur="15s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="180" cy="155" rx="50" ry="12" fill="url(#ch4_smoke)">
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;16,-1;8,0;0,0" dur="18s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.35;0.7" dur="11s" repeatCount="indefinite" />
      </ellipse>

      {/* === FAR BANK — flat Lombardy plain === */}
      <path d="M0 158 Q200 153 400 156 Q600 153 800 158 L800 178 L0 178 Z"
        fill="#252018" opacity="0.65" />

      {/* Town of Lodi — distant buildings */}
      <rect x="250" y="142" width="7" height="14" fill="#3a3530" opacity="0.45" />
      <path d="M248 142 L253 136 L259 142" fill="#403a35" opacity="0.4" />
      <rect x="262" y="145" width="5" height="11" fill="#3a3530" opacity="0.45" />
      <rect x="272" y="140" width="6" height="16" fill="#3a3530" opacity="0.45" />
      <path d="M270 140 L275 132 L280 140" fill="#403a35" opacity="0.4" />
      <rect x="284" y="143" width="4" height="13" fill="#3a3530" opacity="0.4" />
      <rect x="295" y="146" width="5" height="10" fill="#3a3530" opacity="0.4" />
      {/* Church tower */}
      <rect x="305" y="128" width="5" height="28" fill="#3a3530" opacity="0.5" />
      <path d="M303 128 L307 120 L312 128" fill="#403a35" opacity="0.45" />
      <line x1="307" y1="120" x2="307" y2="115" stroke="#403a35" strokeWidth="0.8" opacity="0.4" />
      {/* Town window glows */}
      <rect x="254" y="148" width="2" height="2" fill="#a08050" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="276" y="146" width="2" height="2" fill="#a08050" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="307" y="138" width="2" height="2" fill="#a08050" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.08;0.18" dur="3.5s" repeatCount="indefinite" />
      </rect>

      {/* === PONTOON BRIDGE — the famous bridge of Lodi === */}
      <path d="M260 166 Q320 163 380 164 Q440 163 500 164 Q540 165 560 166"
        fill="none" stroke="#4a4538" strokeWidth="2" opacity="0.45" />
      {/* Bridge supports — pontoon boats */}
      {[280, 310, 340, 370, 400, 430, 460, 490, 530].map((x) => (
        <React.Fragment key={`br${x}`}>
          <line x1={x} y1={164 + (Math.abs(x - 400) / 200)} x2={x} y2={172} stroke="#4a4538" strokeWidth="0.7" opacity="0.35" />
          <ellipse cx={x} cy={173} rx={4} ry={1.5} fill="#3a3528" opacity="0.25" />
        </React.Fragment>
      ))}
      {/* Bridge railing hints */}
      <path d="M270 163 Q320 160 380 161 Q440 160 500 161 Q540 162 555 163"
        fill="none" stroke="#504a3a" strokeWidth="0.5" opacity="0.25" />

      {/* === WIDE RIVER === */}
      <rect x="0" y="173" width="800" height="105" fill="url(#ch4_water)" />
      {/* Sky reflection band */}
      <rect x="0" y="173" width="800" height="50" fill="url(#ch4_reflect)" />

      {/* Sunset warm shimmer band on water */}
      <rect x="0" y="176" width="800" height="20" fill="url(#ch4_warmShimmer)">
        <animate attributeName="opacity" values="1;0.5;1" dur="4s" repeatCount="indefinite" />
      </rect>

      {/* Water ripples — animated horizontal flow */}
      <g>
        <path d="M0 188 Q40 186 80 188 Q120 190 160 188 Q200 186 240 188 Q280 190 320 188 Q360 186 400 188 Q440 190 480 188 Q520 186 560 188 Q600 190 640 188 Q680 186 720 188 Q760 190 800 188"
          fill="none" stroke="#5a4a50" strokeWidth="0.5" opacity="0.28">
          <animateTransform attributeName="transform" type="translate" values="0,0;-20,0;0,0" dur="6s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 202 Q50 200 100 202 Q150 204 200 202 Q250 200 300 202 Q350 204 400 202 Q450 200 500 202 Q550 204 600 202 Q650 200 700 202 Q750 204 800 202"
          fill="none" stroke="#4a3a45" strokeWidth="0.5" opacity="0.22">
          <animateTransform attributeName="transform" type="translate" values="0,0;16,0;0,0" dur="7s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 218 Q60 216 120 218 Q180 220 240 218 Q300 216 360 218 Q420 220 480 218 Q540 216 600 218 Q660 220 720 218 Q780 216 800 218"
          fill="none" stroke="#3a3040" strokeWidth="0.5" opacity="0.18">
          <animateTransform attributeName="transform" type="translate" values="0,0;-14,0;0,0" dur="8s" repeatCount="indefinite" />
        </path>
      </g>
      <g>
        <path d="M0 235 Q70 233 140 235 Q210 237 280 235 Q350 233 420 235 Q490 237 560 235 Q630 233 700 235 Q770 237 800 235"
          fill="none" stroke="#302a38" strokeWidth="0.5" opacity="0.12">
          <animateTransform attributeName="transform" type="translate" values="0,0;12,0;0,0" dur="9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Shimmer reflections — stronger sunset warmth */}
      <ellipse cx="350" cy="185" rx="50" ry="3" fill="#b87a40" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="50;58;50" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="192" rx="35" ry="2" fill="#a06a3a" opacity="0.14">
        <animate attributeName="opacity" values="0.14;0.04;0.14" dur="3s" repeatCount="indefinite" />
        <animate attributeName="rx" values="35;42;35" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="200" cy="208" rx="25" ry="1.5" fill="#7a5a3a" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="650" cy="195" rx="35" ry="1.5" fill="#9a6a3a" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.03;0.12" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="rx" values="35;40;35" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Central golden streak — sunset path on water */}
      <ellipse cx="400" cy="180" rx="70" ry="2.5" fill="#c09050" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.05;0.12" dur="3.2s" repeatCount="indefinite" />
        <animate attributeName="rx" values="70;80;70" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* === NEAR BANK === */}
      <path d="M0 278 Q120 270 250 274 Q400 265 550 270 Q680 265 800 272 L800 400 L0 400 Z"
        fill="url(#ch4_bank)" />

      {/* Bank edge detail */}
      <path d="M0 278 Q30 275 60 279 Q90 276 120 280 Q150 274 180 278"
        fill="none" stroke="#352e20" strokeWidth="0.8" opacity="0.3" />

      {/* === EQUIPMENT — drum, knapsacks, canteen, captured standard === */}
      {/* Drum on its side */}
      <ellipse cx="155" cy="298" rx="7" ry="5" fill="#2a2218" opacity="0.65" />
      <path d="M148 298 Q148 292 155 292 Q162 292 162 298" fill="#302818" opacity="0.55" />
      <line x1="150" y1="293" x2="150" y2="298" stroke="#3a3020" strokeWidth="0.5" opacity="0.4" />
      <line x1="155" y1="292" x2="155" y2="298" stroke="#3a3020" strokeWidth="0.5" opacity="0.4" />
      <line x1="160" y1="293" x2="160" y2="298" stroke="#3a3020" strokeWidth="0.5" opacity="0.4" />

      {/* Knapsacks — piled near campfire */}
      <path d="M260 296 Q258 288 264 286 Q270 288 268 296 Z" fill="#1e1a12" opacity="0.6" />
      <path d="M268 294 Q266 287 272 285 Q278 287 276 294 Z" fill="#201c14" opacity="0.55" />

      {/* Water canteen */}
      <ellipse cx="340" cy="298" rx="4" ry="3.5" fill="#2a2418" opacity="0.55" />
      <line x1="340" y1="295" x2="342" y2="290" stroke="#3a3020" strokeWidth="0.6" opacity="0.4" />

      {/* Captured Austrian standard — broken pole, draped cloth */}
      <line x1="380" y1="300" x2="374" y2="268" stroke="#3a3520" strokeWidth="1.5" opacity="0.65" />
      <path d="M374 268 Q378 270 382 268 Q384 274 380 278 Q376 276 374 268" fill="#3a2820" opacity="0.5" />
      {/* Eagle finial hint */}
      <path d="M372 268 Q374 264 376 268" fill="#4a4030" opacity="0.4" />

      {/* === ARTILLERY BATTERY — 3 cannons === */}
      {/* Cannon 1 — largest, closest */}
      <path d="M490 278 L525 272 L530 275 L495 282 Z" fill="#12100c" opacity="0.85" />
      <circle cx="500" cy="284" r="6" fill="#12100c" opacity="0.85" />
      <circle cx="518" cy="282" r="6" fill="#12100c" opacity="0.85" />
      {/* Barrel detail */}
      <line x1="525" y1="272" x2="535" y2="270" stroke="#1a1510" strokeWidth="2" opacity="0.7" />

      {/* Cannon 2 */}
      <path d="M560 275 L590 270 L595 272 L565 278 Z" fill="#12100c" opacity="0.8" />
      <circle cx="570" cy="280" r="5.5" fill="#12100c" opacity="0.8" />
      <circle cx="585" cy="278" r="5.5" fill="#12100c" opacity="0.8" />

      {/* Cannon 3 — further back */}
      <path d="M625 272 L650 268 L654 270 L629 275 Z" fill="#12100c" opacity="0.7" />
      <circle cx="632" cy="277" r="5" fill="#12100c" opacity="0.7" />
      <circle cx="645" cy="276" r="5" fill="#12100c" opacity="0.7" />

      {/* Ammo crates and supplies */}
      <rect x="540" y="278" width="12" height="9" fill="#1a1510" opacity="0.65" />
      <rect x="544" y="274" width="12" height="9" fill="#1a1510" opacity="0.65" />
      <rect x="600" y="276" width="10" height="8" fill="#1a1510" opacity="0.6" />
      {/* Barrel */}
      <ellipse cx="615" cy="280" rx="5" ry="4" fill="#1a1510" opacity="0.5" />

      {/* Artillery crew silhouettes */}
      <path d="M535 268 Q533 258 535 252 Q537 248 539 252 L541 268 Z" fill="#12100c" opacity="0.75" />
      <circle cx="537" cy="248" r="4" fill="#12100c" opacity="0.75" />
      <path d="M553 270 Q551 262 553 256 Q555 262 557 270 Z" fill="#12100c" opacity="0.7" />

      {/* === STANDING SOLDIER GROUP — esprit de corps === */}
      {/* Three soldiers talking confidently */}
      <path d="M190 262 Q188 250 190 242 Q192 236 194 242 L196 262 Q195 270 194 275 L190 275 Z" fill="#12100c" opacity="0.8" />
      <circle cx="192" cy="236" r="5" fill="#12100c" opacity="0.8" />
      <path d="M208 260 Q206 250 208 242 Q210 236 212 242 L214 260 Q213 268 212 275 L208 275 Z" fill="#12100c" opacity="0.8" />
      <circle cx="210" cy="236" r="5" fill="#12100c" opacity="0.8" />
      <path d="M225 264 Q223 252 225 244 Q227 239 229 244 L231 264 Z" fill="#12100c" opacity="0.75" />
      <circle cx="227" cy="239" r="4.5" fill="#12100c" opacity="0.75" />
      {/* Gesturing arm — animated, retelling the charge */}
      <path d="M196 248 Q200 244 205 246" fill="none" stroke="#12100c" strokeWidth="2" opacity="0.5">
        <animate attributeName="d" values="M196 248 Q200 244 205 246;M196 248 Q202 240 208 242;M196 248 Q200 244 205 246" dur="2s" repeatCount="indefinite" />
      </path>

      {/* === NEW SOLDIER — excitedly gesturing (retelling the bridge charge) === */}
      <path d="M240 264 Q238 254 240 246 Q242 240 244 246 L246 264 Q245 270 244 275 L240 275 Z" fill="#12100c" opacity="0.78" />
      <circle cx="242" cy="240" r="4.5" fill="#12100c" opacity="0.78" />
      {/* Both arms raised, animated — emphatic storytelling */}
      <path d="M236 252 Q230 244 226 240" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M236 252 Q230 244 226 240;M236 252 Q228 242 224 236;M236 252 Q230 244 226 240" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M248 252 Q254 244 258 240" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.5">
        <animate attributeName="d" values="M248 252 Q254 244 258 240;M248 252 Q256 242 260 236;M248 252 Q254 244 258 240" dur="1.8s" repeatCount="indefinite" />
      </path>

      {/* === NEW SOLDIER — lying relaxed on the ground === */}
      <path d="M325 300 Q340 296 355 298 Q360 298 365 300" fill="#12100c" opacity="0.65" />
      {/* Head (propped up slightly) */}
      <circle cx="325" cy="297" r="4" fill="#12100c" opacity="0.65" />
      {/* Arm behind head */}
      <path d="M328 298 Q324 294 320 296" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.45" />

      {/* === NEW SOLDIER — cleaning musket near fire 2 === */}
      <path d="M140 304 Q138 294 140 286 Q142 280 144 286 L146 304 Z" fill="#12100c" opacity="0.65" />
      <circle cx="142" cy="280" r="3.5" fill="#12100c" opacity="0.65" />
      {/* Musket across lap — diagonal */}
      <line x1="134" y1="298" x2="156" y2="292" stroke="#2a2520" strokeWidth="1.2" opacity="0.5" />
      {/* Cleaning arm motion */}
      <path d="M144 290 Q148 288 152 290" fill="none" stroke="#12100c" strokeWidth="1.2" opacity="0.4">
        <animate attributeName="d" values="M144 290 Q148 288 152 290;M144 290 Q149 286 154 288;M144 290 Q148 288 152 290" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* === CAMPFIRE 1 — large celebration fire === */}
      <ellipse cx="300" cy="302" rx="38" ry="12" fill="url(#ch4_fireGlow)">
        <animate attributeName="rx" values="38;44;38" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire flames — multiple layers for bigger celebration fire */}
      <path d="M293 300 Q296 280 300 300" fill="#c07838" opacity="0.7">
        <animate attributeName="d" values="M293 300 Q296 280 300 300;M293 300 Q297 278 300 300;M293 300 Q296 280 300 300" dur="0.4s" repeatCount="indefinite" />
      </path>
      <path d="M298 300 Q301 284 304 300" fill="#d09050" opacity="0.65">
        <animate attributeName="d" values="M298 300 Q301 284 304 300;M298 300 Q302 282 304 300;M298 300 Q301 284 304 300" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M296 300 Q299 288 302 300" fill="#e0a860" opacity="0.5">
        <animate attributeName="d" values="M296 300 Q299 288 302 300;M296 300 Q300 286 302 300;M296 300 Q299 288 302 300" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M300 300 Q302 292 304 300" fill="#f0c080" opacity="0.35">
        <animate attributeName="d" values="M300 300 Q302 292 304 300;M300 300 Q303 290 304 300;M300 300 Q302 292 304 300" dur="0.35s" repeatCount="indefinite" />
      </path>
      {/* Outer side flames */}
      <path d="M288 300 Q290 290 294 300" fill="#a06030" opacity="0.4">
        <animate attributeName="d" values="M288 300 Q290 290 294 300;M288 300 Q291 288 294 300;M288 300 Q290 290 294 300" dur="0.55s" repeatCount="indefinite" />
      </path>
      <path d="M304 300 Q308 289 310 300" fill="#a06030" opacity="0.4">
        <animate attributeName="d" values="M304 300 Q308 289 310 300;M304 300 Q309 287 310 300;M304 300 Q308 289 310 300" dur="0.65s" repeatCount="indefinite" />
      </path>
      {/* Sparks */}
      <circle cx="299" cy="284" r="0.7" fill="#e0b070" opacity="0.5">
        <animate attributeName="cy" values="284;266;250" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="303" cy="280" r="0.5" fill="#d0a060" opacity="0.4">
        <animate attributeName="cy" values="280;260;244" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="296" cy="286" r="0.6" fill="#e0c080" opacity="0.45">
        <animate attributeName="cy" values="286;270;254" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0.1;0" dur="3s" repeatCount="indefinite" />
        <animate attributeName="cx" values="296;292;290" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Soldiers around campfire */}
      <path d="M282 294 Q280 284 283 278 Q286 284 284 294 Z" fill="#12100c" opacity="0.7" />
      <circle cx="283" cy="275" r="3.5" fill="#12100c" opacity="0.7" />
      <path d="M318 294 Q316 286 319 280 Q322 286 320 294 Z" fill="#12100c" opacity="0.7" />
      <circle cx="319" cy="277" r="3.5" fill="#12100c" opacity="0.7" />

      {/* === CAMPFIRE 2 — further left === */}
      <ellipse cx="120" cy="310" rx="22" ry="6" fill="url(#ch4_fire2)">
        <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Fire 2 flames — slightly bigger */}
      <path d="M117 309 Q120 298 123 309" fill="#d09050" opacity="0.45">
        <animate attributeName="d" values="M117 309 Q120 298 123 309;M117 309 Q121 296 123 309;M117 309 Q120 298 123 309" dur="0.6s" repeatCount="indefinite" />
      </path>
      <path d="M119 309 Q121 302 123 309" fill="#e0a860" opacity="0.3">
        <animate attributeName="d" values="M119 309 Q121 302 123 309;M119 309 Q122 300 123 309;M119 309 Q121 302 123 309" dur="0.45s" repeatCount="indefinite" />
      </path>
      {/* Soldiers at fire 2 */}
      <path d="M108 304 Q106 296 108 290 Q110 296 112 304 Z" fill="#12100c" opacity="0.6" />
      <path d="M132 302 Q130 294 132 288 Q134 294 136 302 Z" fill="#12100c" opacity="0.6" />

      {/* === HORSE SILHOUETTE — cavalry horse tied to post, right side === */}
      {/* Post */}
      <line x1="690" y1="258" x2="690" y2="282" stroke="#2a2518" strokeWidth="2" opacity="0.6" />
      {/* Rope from post to horse */}
      <path d="M690 264 Q700 266 710 264" fill="none" stroke="#3a3520" strokeWidth="0.8" opacity="0.4" />
      {/* Horse body */}
      <path d="M710 264 Q722 258 738 260 Q748 258 755 262 Q758 266 755 272 Q748 278 735 280 Q722 282 712 278 Q706 274 710 264 Z" fill="#12100c" opacity="0.7" />
      {/* Horse neck and head */}
      <path d="M710 264 Q706 254 704 248 Q703 244 706 242 Q710 240 712 244 Q714 248 712 256 Q711 260 710 264" fill="#12100c" opacity="0.7" />
      {/* Ear */}
      <path d="M706 242 Q705 238 708 240" fill="#12100c" opacity="0.6" />
      {/* Legs */}
      <line x1="720" y1="280" x2="718" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.65" />
      <line x1="740" y1="280" x2="742" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.65" />
      <line x1="728" y1="282" x2="726" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.6" />
      <line x1="748" y1="278" x2="750" y2="296" stroke="#12100c" strokeWidth="2" opacity="0.6" />
      {/* Tail — slight sway */}
      <path d="M755 268 Q762 274 758 284" fill="none" stroke="#12100c" strokeWidth="1.8" opacity="0.55">
        <animate attributeName="d" values="M755 268 Q762 274 758 284;M755 268 Q764 272 760 282;M755 268 Q762 274 758 284" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Musket stacks — tripods */}
      <line x1="350" y1="258" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      <line x1="358" y1="258" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      <line x1="354" y1="256" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      {/* Second tripod */}
      <line x1="420" y1="262" x2="424" y2="288" stroke="#2a2520" strokeWidth="1.2" opacity="0.7" />
      <line x1="428" y1="262" x2="424" y2="288" stroke="#2a2520" strokeWidth="1.2" opacity="0.7" />

      {/* === FOREGROUND === */}
      {/* River bank vegetation — reeds */}
      <line x1="5" y1="278" x2="7" y2="258" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="280" x2="13" y2="262" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="18" y1="279" x2="19" y2="260" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />
      <line x1="780" y1="275" x2="782" y2="255" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="788" y1="276" x2="790" y2="258" stroke="#2a3520" strokeWidth="0.8" opacity="0.3" />
      <line x1="795" y1="275" x2="796" y2="257" stroke="#2a3520" strokeWidth="0.7" opacity="0.25" />

      {/* Foreground rocks */}
      <path d="M0 368 Q20 358 45 362 Q65 356 90 362 L90 400 L0 400 Z" fill="#1a1510" />
      <path d="M720 365 Q740 355 770 360 Q790 355 800 362 L800 400 L720 400 Z" fill="#181510" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      <rect width="800" height="400" fill="url(#ch4_vignette)" />
      <rect x="0" y="375" width="800" height="25" fill="#0a0808" opacity="0.4" />
    </svg>
  );
}
