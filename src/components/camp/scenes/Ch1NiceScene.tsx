import React from 'react';

/**
 * Ch.1 — Army of Italy, Nice coastal garrison (March 1796)
 * Overcast dusk. Ragged camp near Mediterranean coast. Broken shoes, tattered
 * uniforms, thin blankets, barely-alive campfires. The army hasn't been paid
 * in months, hasn't eaten properly in weeks. Grey skies, cold wind off the sea.
 * Nice's old city walls visible in the distance.
 * Mood: Bleak, hungry, restless — but a spark of defiance.
 */
export function Ch1NiceScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Overcast dusk sky — grey-purple with thin warm band at horizon */}
        <linearGradient id="ch1_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2530" />
          <stop offset="25%" stopColor="#353040" />
          <stop offset="50%" stopColor="#3a3540" />
          <stop offset="70%" stopColor="#504a55" />
          <stop offset="85%" stopColor="#6a5a50" />
          <stop offset="95%" stopColor="#7a6548" />
          <stop offset="100%" stopColor="#8a6a4a" />
        </linearGradient>
        {/* Sea — cold grey-blue */}
        <linearGradient id="ch1_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5565" />
          <stop offset="40%" stopColor="#405060" />
          <stop offset="70%" stopColor="#3a4555" />
          <stop offset="100%" stopColor="#2a3545" />
        </linearGradient>
        {/* Sea reflection of horizon */}
        <linearGradient id="ch1_seaReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a6550" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7a6550" stopOpacity="0" />
        </linearGradient>
        {/* Ground — dusty brown-grey */}
        <linearGradient id="ch1_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="50%" stopColor="#332e28" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        {/* Dim fire glow */}
        <radialGradient id="ch1_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0.35" />
          <stop offset="40%" stopColor="#a06030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Distant fire 2 glow */}
        <radialGradient id="ch1_distFire" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* City walls */}
        <linearGradient id="ch1_walls" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5050" />
          <stop offset="100%" stopColor="#403838" />
        </linearGradient>
        {/* Mist band */}
        <linearGradient id="ch1_mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5560" stopOpacity="0" />
          <stop offset="50%" stopColor="#5a5560" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a5560" stopOpacity="0" />
        </linearGradient>
        {/* Coastal mist */}
        <linearGradient id="ch1_coastMist" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4a55" stopOpacity="0" />
          <stop offset="30%" stopColor="#4a4a55" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#4a4a55" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#4a4a55" stopOpacity="0" />
        </linearGradient>
        {/* Vignette */}
        <radialGradient id="ch1_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </radialGradient>
        {/* Wind-blown smoke pattern */}
        <linearGradient id="ch1_windSmoke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a6560" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#6a6560" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#6a6560" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch1_sky)" />

      {/* Heavy cloud layer — overcast, wind-driven */}
      <ellipse cx="200" cy="50" rx="250" ry="18" fill="#3a3545" opacity="0.35" />
      <ellipse cx="500" cy="35" rx="200" ry="14" fill="#353040" opacity="0.3" />
      <ellipse cx="700" cy="65" rx="180" ry="12" fill="#3a3545" opacity="0.25" />
      <ellipse cx="100" cy="85" rx="170" ry="13" fill="#353040" opacity="0.25" />
      <ellipse cx="400" cy="70" rx="220" ry="10" fill="#3a3545" opacity="0.2" />
      {/* Lower thin clouds */}
      <ellipse cx="300" cy="105" rx="160" ry="8" fill="#454050" opacity="0.15" />
      <ellipse cx="650" cy="95" rx="120" ry="7" fill="#454050" opacity="0.12" />
      {/* Wind-torn cloud wisps */}
      <ellipse cx="150" cy="115" rx="80" ry="4" fill="#454050" opacity="0.1">
        <animate attributeName="cx" values="150;170;150" dur="20s" repeatCount="indefinite" />
      </ellipse>

      {/* === DISTANT NICE — city walls and buildings === */}
      {/* Main city wall silhouette */}
      <path d="M580 180 L580 158 L600 158 L600 148 L605 142 L610 148 L610 158 L640 158 L640 152 L645 147 L650 152 L650 158 L680 158 L680 165 L710 165 L710 155 L718 148 L726 155 L726 165 L760 165 L760 180"
        fill="url(#ch1_walls)" opacity="0.55" />
      {/* Building rooftops behind wall */}
      <rect x="595" y="135" width="20" height="23" fill="#4a4540" opacity="0.3" />
      <path d="M593 135 L605 125 L617 135" fill="#504a45" opacity="0.3" />
      <rect x="665" y="140" width="15" height="18" fill="#4a4540" opacity="0.25" />
      <path d="M663 140 L672 132 L682 140" fill="#504a45" opacity="0.25" />
      {/* More distant buildings */}
      <rect x="720" y="148" width="12" height="17" fill="#454040" opacity="0.2" />
      <path d="M718 148 L726 140 L734 148" fill="#4a4540" opacity="0.2" />
      {/* Church bell tower */}
      <rect x="640" y="120" width="10" height="38" fill="#504a45" opacity="0.35" />
      <path d="M638 120 L645 112 L652 120" fill="#5a5550" opacity="0.35" />
      <line x1="645" y1="112" x2="645" y2="107" stroke="#5a5550" strokeWidth="1" opacity="0.3" />
      {/* Tiny warm window glows in city */}
      <rect x="600" y="148" width="2" height="3" fill="#a08050" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.1;0.2" dur="4s" repeatCount="indefinite" />
      </rect>
      <rect x="643" y="128" width="2" height="3" fill="#a08050" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="670" y="148" width="2" height="3" fill="#a08050" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.08;0.18" dur="3.5s" repeatCount="indefinite" />
      </rect>
      <rect x="715" y="156" width="2" height="3" fill="#a08050" opacity="0.12" />
      <rect x="725" y="155" width="2" height="3" fill="#a08050" opacity="0.1" />

      {/* === MEDITERRANEAN SEA === */}
      <rect x="0" y="175" width="800" height="55" fill="url(#ch1_sea)" />
      {/* Horizon reflection band */}
      <rect x="0" y="175" width="800" height="15" fill="url(#ch1_seaReflect)" />

      {/* Wave lines — multiple for depth */}
      <path d="M0 185 Q40 183 80 185 Q120 187 160 185 Q200 183 240 185 Q280 187 320 185 Q360 183 400 185 Q440 187 480 185 Q520 183 560 185 Q600 187 640 185 Q680 183 720 185 Q760 187 800 185"
        fill="none" stroke="#5a6575" strokeWidth="0.5" opacity="0.35" />
      <path d="M0 195 Q50 193 100 195 Q150 197 200 195 Q250 193 300 195 Q350 197 400 195 Q450 193 500 195 Q550 197 600 195 Q650 193 700 195 Q750 197 800 195"
        fill="none" stroke="#4a5565" strokeWidth="0.5" opacity="0.3" />
      <path d="M0 205 Q60 203 120 205 Q180 207 240 205 Q300 203 360 205 Q420 207 480 205 Q540 203 600 205 Q660 207 720 205 Q780 203 800 205"
        fill="none" stroke="#3a4555" strokeWidth="0.5" opacity="0.25" />
      <path d="M0 215 Q70 213 140 215 Q210 217 280 215 Q350 213 420 215 Q490 217 560 215 Q630 213 700 215 Q770 217 800 215"
        fill="none" stroke="#3a4050" strokeWidth="0.5" opacity="0.2" />

      {/* Water shimmer spots */}
      <ellipse cx="250" cy="190" rx="25" ry="1" fill="#6a6a70" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.08;0.2" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="450" cy="198" rx="35" ry="1.2" fill="#6a6a70" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="600" cy="202" rx="20" ry="1" fill="#6a6a70" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="150" cy="208" rx="28" ry="1" fill="#5a5a65" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Distant ship silhouette on the Mediterranean */}
      <path d="M120 182 Q126 179 132 182 L130 183 L122 183 Z" fill="#3a4050" opacity="0.18" />
      <line x1="126" y1="182" x2="126" y2="175" stroke="#3a4050" strokeWidth="0.5" opacity="0.15" />
      <path d="M126 175 Q130 177 132 180" fill="none" stroke="#3a4050" strokeWidth="0.3" opacity="0.12" />

      {/* Sea birds — distant */}
      <path d="M420 140 Q425 136 430 140 Q435 136 440 140" fill="none" stroke="#4a4a55" strokeWidth="0.6" opacity="0.2" />
      <path d="M460 148 Q464 145 468 148 Q472 145 476 148" fill="none" stroke="#4a4a55" strokeWidth="0.5" opacity="0.15" />
      <path d="M380 155 Q383 152 386 155 Q389 152 392 155" fill="none" stroke="#4a4a55" strokeWidth="0.4" opacity="0.12" />

      {/* === COASTAL HILL / CAMP GROUND === */}
      <path d="M0 230 Q80 222 160 226 Q280 235 400 228 Q480 224 560 228 Q640 222 720 230 Q760 235 800 228 L800 400 L0 400 Z"
        fill="url(#ch1_ground)" />

      {/* Rocky coastal terrain detail */}
      <path d="M0 230 Q20 228 40 231 Q60 229 80 232 Q100 228 130 233 Q160 230 190 234"
        fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.35" />
      <path d="M300 230 Q330 227 360 232 Q390 228 420 233 Q450 230 480 231"
        fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.3" />
      {/* Small rock outcrops */}
      <path d="M60 232 Q65 228 72 230 Q78 228 82 232" fill="#3a3530" opacity="0.4" />
      <path d="M500 228 Q508 224 515 227 Q522 225 528 229" fill="#3a3530" opacity="0.35" />

      {/* === OLIVE TREE — Mediterranean vegetation === */}
      <path d="M80 232 Q82 210 84 192 Q85 178 86 168" fill="none" stroke="#3a3528" strokeWidth="2.5" />
      <path d="M86 168 Q92 155 95 165" fill="none" stroke="#3a3528" strokeWidth="1.2" />
      <path d="M86 168 Q78 158 76 166" fill="none" stroke="#3a3528" strokeWidth="1" />
      <path d="M84 180 Q78 172 76 178" fill="none" stroke="#3a3528" strokeWidth="0.8" />
      <path d="M84 180 Q90 174 92 180" fill="none" stroke="#3a3528" strokeWidth="0.7" />
      {/* Sparse olive leaves — dark green-grey, wind-tossed */}
      <ellipse cx="95" cy="160" rx="8" ry="5" fill="#2a3520" opacity="0.35" />
      <ellipse cx="76" cy="162" rx="7" ry="4" fill="#283020" opacity="0.3" />
      <ellipse cx="88" cy="172" rx="6" ry="4" fill="#2a3520" opacity="0.25" />
      <ellipse cx="78" cy="175" rx="5" ry="3" fill="#283020" opacity="0.2" />

      {/* Scrubby coastal plants */}
      <path d="M120 238 Q122 232 125 235 Q128 230 130 237" fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.3" />
      <path d="M560 232 Q562 226 565 230 Q568 225 570 232" fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.25" />
      <path d="M680 235 Q682 230 685 233 Q688 228 690 235" fill="none" stroke="#3a4530" strokeWidth="0.8" opacity="0.25" />
      <path d="M360 236 Q362 230 365 234 Q368 229 370 236" fill="none" stroke="#3a4530" strokeWidth="0.6" opacity="0.2" />

      {/* === CAMP AREA — ragged, miserable === */}

      {/* Shelter 1 — leaning canvas, wind-worn */}
      <path d="M140 285 L175 258 L210 285" fill="none" stroke="#5a5045" strokeWidth="1.5" />
      <path d="M145 285 L175 260 L205 285" fill="#3a3530" opacity="0.5" />
      {/* Canvas patches — multiple */}
      <path d="M155 275 L160 268 L168 276" fill="#3a3530" opacity="0.3" />
      <path d="M182 272 L188 265 L195 275" fill="#3a3530" opacity="0.25" />
      {/* Pole */}
      <line x1="175" y1="258" x2="175" y2="285" stroke="#4a4540" strokeWidth="1" opacity="0.4" />
      {/* Wind flapping canvas edge */}
      <path d="M210 285 Q215 282 218 285" fill="none" stroke="#5a5045" strokeWidth="0.8" opacity="0.3">
        <animate attributeName="d" values="M210 285 Q215 282 218 285;M210 285 Q215 280 220 284;M210 285 Q215 282 218 285" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Blanket roll near tent */}
      <ellipse cx="225" cy="290" rx="14" ry="4.5" fill="#4a4540" opacity="0.55" />
      <path d="M212 290 Q218 288 225 290 Q232 288 238 290" fill="none" stroke="#504a45" strokeWidth="0.5" opacity="0.3" />

      {/* Shelter 2 — half-collapsed */}
      <path d="M370 280 L400 258 L430 280" fill="none" stroke="#504a45" strokeWidth="1.2" />
      <path d="M375 280 L400 260 L425 280" fill="#353025" opacity="0.45" />
      {/* Collapsed side */}
      <path d="M425 280 L440 275" fill="none" stroke="#504a45" strokeWidth="1" opacity="0.3" />

      {/* Shelter 3 — tiny, just a propped blanket */}
      <path d="M600 282 L615 270 L630 284" fill="#3a3528" opacity="0.35" />

      {/* === TATTERED FLAG — Republic still lives === */}
      <line x1="260" y1="248" x2="260" y2="222" stroke="#4a4540" strokeWidth="1.5" opacity="0.5" />
      <path d="M260 222 Q268 220 275 224 Q268 228 260 226" fill="#3a3545" opacity="0.35">
        <animate attributeName="d" values="M260 222 Q268 220 275 224 Q268 228 260 226;M260 222 Q270 219 278 223 Q270 227 260 226;M260 222 Q268 220 275 224 Q268 228 260 226" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Faded, torn — hint of tricolor */}
      <line x1="262" y1="223" x2="270" y2="222" stroke="#3a3545" strokeWidth="0.5" opacity="0.2" />

      {/* === BROKEN EQUIPMENT — the army hasn't been supplied === */}
      {/* Muskets leaning together */}
      <line x1="280" y1="248" x2="288" y2="292" stroke="#5a5550" strokeWidth="1.5" />
      <line x1="285" y1="248" x2="293" y2="292" stroke="#4a4540" strokeWidth="1.2" />
      <line x1="290" y1="250" x2="285" y2="292" stroke="#4a4540" strokeWidth="1" />

      {/* Broken cart wheel */}
      <circle cx="530" cy="285" r="12" fill="none" stroke="#3a3528" strokeWidth="1.5" opacity="0.5" />
      <line x1="530" y1="273" x2="530" y2="297" stroke="#3a3528" strokeWidth="0.8" opacity="0.4" />
      <line x1="518" y1="285" x2="542" y2="285" stroke="#3a3528" strokeWidth="0.8" opacity="0.4" />
      <path d="M530 285 L538 278" fill="none" stroke="#3a3528" strokeWidth="0.8" opacity="0.3" />

      {/* Broken shoe — the famous lack of shoes */}
      <path d="M310 298 Q316 294 322 298 L324 302 L308 302 Z" fill="#3a3025" opacity="0.55" />
      {/* Second broken shoe */}
      <path d="M458 300 Q464 296 468 300 L470 303 L456 303 Z" fill="#3a3025" opacity="0.45" />

      {/* Canteen */}
      <circle cx="340" cy="296" r="4.5" fill="none" stroke="#5a5045" strokeWidth="1" opacity="0.45" />
      <line x1="340" y1="291" x2="342" y2="288" stroke="#5a5045" strokeWidth="0.8" opacity="0.3" />

      {/* Torn knapsack */}
      <path d="M470 290 Q478 285 486 290 Q488 296 480 300 Q472 296 470 290" fill="#3a3525" opacity="0.4" />
      <path d="M475 288 L480 284" fill="none" stroke="#3a3525" strokeWidth="0.8" opacity="0.3" />

      {/* Empty barrel — rations gone */}
      <ellipse cx="550" cy="262" rx="7" ry="5" fill="none" stroke="#3a3528" strokeWidth="1" opacity="0.35" />
      <path d="M543 260 L543 270 Q550 272 557 270 L557 260" fill="none" stroke="#3a3528" strokeWidth="0.8" opacity="0.3" />

      {/* Drum — beaten and worn */}
      <ellipse cx="420" cy="290" rx="8" ry="5" fill="#3a3025" opacity="0.4" />
      <rect x="412" y="286" width="16" height="8" rx="2" fill="#3a3025" opacity="0.35" />
      <line x1="412" y1="288" x2="428" y2="288" stroke="#4a4035" strokeWidth="0.5" opacity="0.2" />

      {/* === CAMPFIRE 1 — barely alive === */}
      <ellipse cx="300" cy="312" rx="22" ry="5" fill="url(#ch1_fireGlow)">
        <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Stone ring */}
      <circle cx="283" cy="312" r="3" fill="#4a4540" />
      <circle cx="290" cy="316" r="2.5" fill="#454035" />
      <circle cx="298" cy="318" r="2.8" fill="#4a4540" />
      <circle cx="306" cy="316" r="2.5" fill="#454035" />
      <circle cx="313" cy="313" r="3" fill="#4a4540" />
      <circle cx="316" cy="308" r="2.5" fill="#454035" />
      <circle cx="287" cy="308" r="2.5" fill="#4a4540" />
      {/* Charred logs */}
      <line x1="290" y1="311" x2="310" y2="313" stroke="#2a2520" strokeWidth="2" />
      <line x1="295" y1="314" x2="308" y2="310" stroke="#2a2520" strokeWidth="1.5" />
      {/* Tiny dying embers */}
      <circle cx="298" cy="310" r="1.5" fill="#c07040" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="303" cy="309" r="1" fill="#d08050" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="295" cy="312" r="0.8" fill="#b06030" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* Thin wispy smoke — blown sideways by coastal wind */}
      <path d="M300 306 Q298 292 303 278 Q308 262 318 248" fill="none" stroke="#6a6560" strokeWidth="0.8" opacity="0.18">
        <animate attributeName="d" values="M300 306 Q298 292 303 278 Q308 262 318 248;M300 306 Q303 292 308 278 Q316 262 326 248;M300 306 Q298 292 303 278 Q308 262 318 248" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M302 305 Q304 295 310 280 Q318 268 328 255" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M302 305 Q304 295 310 280 Q318 268 328 255;M302 305 Q306 295 314 280 Q324 268 336 255;M302 305 Q304 295 310 280 Q318 268 328 255" dur="7s" repeatCount="indefinite" />
      </path>

      {/* === CAMPFIRE 2 — distant, smaller === */}
      <ellipse cx="650" cy="305" rx="15" ry="3" fill="url(#ch1_distFire)">
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="650" cy="304" r="1" fill="#c07040" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* === SOLDIER SILHOUETTES === */}
      {/* Soldier 1 — sitting, hugging knees at fire 1, shivering */}
      <path d="M268 296 Q266 280 270 270 Q273 264 276 270 Q280 280 278 296 L280 300 Q275 304 270 300 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="273" cy="262" r="4.5" fill="#1a1815" opacity="0.8" />

      {/* Soldier 2 — sitting cross-legged at fire 1, head bowed */}
      <path d="M318 296 Q316 282 320 272 Q323 266 326 272 Q330 282 328 296 Q326 302 323 304 Q320 302 318 296 Z"
        fill="#1a1815" opacity="0.8" />
      <circle cx="323" cy="264" r="4" fill="#1a1815" opacity="0.8" />

      {/* Soldier 3 — lying down near tent 1, exhausted */}
      <path d="M235 308 Q242 305 262 307 Q268 310 262 313 Q242 316 235 313 Q231 310 235 308 Z"
        fill="#1a1815" opacity="0.55" />
      <circle cx="232" cy="308" r="3.5" fill="#1a1815" opacity="0.5" />

      {/* Soldier 4 — standing alone, looking at sea, arms crossed */}
      <path d="M490 252 Q488 242 490 232 Q492 226 494 232 L496 252 L500 290 L497 293 L493 293 L490 290 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="492" cy="224" r="5" fill="#1a1815" opacity="0.7" />
      {/* Arms crossed — cold */}
      <path d="M487 248 Q485 245 486 242" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />
      <path d="M497 248 Q499 245 498 242" fill="none" stroke="#1a1815" strokeWidth="2" opacity="0.5" />

      {/* Soldier 5 — hunched near shelter 2, eating from bowl */}
      <path d="M445 288 Q443 278 446 272 Q449 267 452 272 Q455 278 453 288 Z"
        fill="#1a1815" opacity="0.65" />
      <circle cx="449" cy="265" r="4" fill="#1a1815" opacity="0.65" />
      {/* Bowl in hands */}
      <ellipse cx="452" cy="278" rx="3" ry="1.5" fill="#2a2520" opacity="0.3" />

      {/* Soldier 6 — at distant fire 2, barely visible */}
      <path d="M640 298 Q638 290 640 285 Q642 290 644 298 Z" fill="#1a1815" opacity="0.5" />
      <circle cx="641" cy="283" r="3" fill="#1a1815" opacity="0.5" />
      <path d="M660 296 Q658 288 660 283 Q662 288 664 296 Z" fill="#1a1815" opacity="0.45" />
      <circle cx="661" cy="281" r="3" fill="#1a1815" opacity="0.45" />

      {/* Soldier 7 — on the ground near olive tree, sleeping/sick */}
      <path d="M95 240 Q105 237 118 240 Q122 243 116 245 Q105 247 95 245 Q91 243 95 240 Z"
        fill="#1a1815" opacity="0.45" />
      <circle cx="92" cy="240" r="3" fill="#1a1815" opacity="0.4" />

      {/* Soldier 8 — sitting against rock, bandaged leg */}
      <path d="M510 272 Q508 264 510 258 Q512 264 514 272 Z" fill="#1a1815" opacity="0.6" />
      <circle cx="511" cy="256" r="3.5" fill="#1a1815" opacity="0.6" />
      {/* Bandaged leg stretched out */}
      <path d="M508 270 Q512 274 518 278 Q522 280 526 280" fill="none" stroke="#4a4545" strokeWidth="1.2" opacity="0.3" />

      {/* === FOREGROUND === */}
      {/* Rocky foreground — closer, darker */}
      <path d="M0 355 Q15 345 35 350 Q55 346 80 352 Q100 344 130 350 Q160 348 190 354 Q210 350 230 355 L230 400 L0 400 Z"
        fill="#222018" />
      <path d="M580 358 Q610 348 640 352 Q670 346 700 350 Q730 344 760 352 Q780 350 800 354 L800 400 L580 400 Z"
        fill="#201a15" />

      {/* Foreground rock detail */}
      <path d="M40 350 Q50 345 60 348" fill="#2a2520" opacity="0.5" />
      <path d="M650 350 Q665 344 680 348" fill="#252018" opacity="0.5" />

      {/* Foreground scrub */}
      <path d="M20 358 Q22 350 25 355 Q28 348 30 358" fill="none" stroke="#2a3520" strokeWidth="0.8" opacity="0.25" />
      <path d="M750 355 Q752 347 755 352 Q758 345 760 355" fill="none" stroke="#2a3520" strokeWidth="0.8" opacity="0.25" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Coastal mist band */}
      <rect x="0" y="218" width="800" height="25" fill="url(#ch1_mist)" />
      {/* Subtle upper mist */}
      <rect x="0" y="170" width="800" height="15" fill="url(#ch1_coastMist)" />
      {/* Wind-blown ground mist */}
      <ellipse cx="350" cy="320" rx="100" ry="8" fill="#4a4a55" opacity="0.04">
        <animate attributeName="cx" values="350;380;350" dur="15s" repeatCount="indefinite" />
      </ellipse>

      {/* Vignette — slightly heavier than average */}
      <rect width="800" height="400" fill="url(#ch1_vignette)" />

      {/* Bottom darkening */}
      <rect x="0" y="355" width="800" height="45" fill="#1a1510" opacity="0.35" />
    </svg>
  );
}
