import React from 'react';

/**
 * Ch.1 — Army of Italy, Nice coastal garrison
 * Overcast dusk. Ragged camp near coast, broken shoes/gear, thin blankets,
 * Mediterranean in background, grey skies. Mood: Bleak, hungry, restless.
 */
export function Ch1NiceScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Overcast dusk sky — grey-purple with thin warm band at horizon */}
        <linearGradient id="ch1_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2530" />
          <stop offset="40%" stopColor="#3a3540" />
          <stop offset="70%" stopColor="#504a55" />
          <stop offset="90%" stopColor="#6a5a50" />
          <stop offset="100%" stopColor="#8a6a4a" />
        </linearGradient>
        {/* Sea — cold grey-blue */}
        <linearGradient id="ch1_sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5565" />
          <stop offset="60%" stopColor="#3a4555" />
          <stop offset="100%" stopColor="#2a3545" />
        </linearGradient>
        {/* Ground — dusty brown-grey */}
        <linearGradient id="ch1_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>
        {/* Dim fire glow */}
        <radialGradient id="ch1_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#a06030" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* City walls glow */}
        <linearGradient id="ch1_walls" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5050" />
          <stop offset="100%" stopColor="#403838" />
        </linearGradient>
        {/* Mist */}
        <linearGradient id="ch1_mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5560" stopOpacity="0" />
          <stop offset="50%" stopColor="#5a5560" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5a5560" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch1_sky)" />

      {/* Thin cloud layer */}
      <ellipse cx="200" cy="60" rx="220" ry="12" fill="#4a4550" opacity="0.3" />
      <ellipse cx="550" cy="45" rx="180" ry="10" fill="#4a4550" opacity="0.25" />
      <ellipse cx="700" cy="80" rx="140" ry="8" fill="#504a55" opacity="0.2" />
      <ellipse cx="100" cy="100" rx="160" ry="9" fill="#4a4550" opacity="0.15" />

      {/* Distant city walls — Nice */}
      <path d="M620 180 L620 155 L635 155 L635 145 L640 140 L645 145 L645 155 L670 155 L670 168 L700 168 L700 155 L715 150 L730 155 L730 180"
        fill="url(#ch1_walls)" opacity="0.6" />
      <rect x="650" y="158" width="3" height="8" fill="#8a7a60" opacity="0.3" />
      <rect x="685" y="160" width="2" height="6" fill="#8a7a60" opacity="0.25" />

      {/* Mediterranean sea */}
      <rect x="0" y="175" width="800" height="55" fill="url(#ch1_sea)" />
      {/* Wave lines */}
      <path d="M0 190 Q50 188 100 190 Q150 192 200 190 Q250 188 300 190 Q350 192 400 190 Q450 188 500 190 Q550 192 600 190 Q650 188 700 190 Q750 192 800 190"
        fill="none" stroke="#5a6575" strokeWidth="0.5" opacity="0.4" />
      <path d="M0 205 Q60 203 120 205 Q180 207 240 205 Q300 203 360 205 Q420 207 480 205 Q540 203 600 205 Q660 207 720 205 Q780 203 800 205"
        fill="none" stroke="#4a5565" strokeWidth="0.5" opacity="0.3" />
      {/* Water shimmer */}
      <ellipse cx="350" cy="195" rx="30" ry="1" fill="#6a6a70" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="550" cy="200" rx="25" ry="1" fill="#6a6a70" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* Coastal hill / shore line */}
      <path d="M0 230 Q100 220 200 225 Q350 235 500 228 Q600 222 700 230 Q750 235 800 228 L800 400 L0 400 Z"
        fill="url(#ch1_ground)" />

      {/* Rocky coastal terrain detail */}
      <path d="M0 230 Q30 228 60 232 Q90 229 120 233" fill="none" stroke="#4a4540" strokeWidth="1" opacity="0.4" />
      <path d="M350 234 Q380 230 410 235 Q440 232 470 234" fill="none" stroke="#4a4540" strokeWidth="1" opacity="0.3" />

      {/* Scattered camp — thin blankets, ragged shelters */}
      {/* Shelter 1 — leaning canvas */}
      <path d="M150 280 L175 260 L200 280" fill="none" stroke="#5a5045" strokeWidth="1.5" />
      <path d="M155 280 L175 262 L195 280" fill="#3a3530" opacity="0.5" />
      {/* Blanket roll */}
      <ellipse cx="220" cy="290" rx="12" ry="4" fill="#4a4540" opacity="0.6" />

      {/* Shelter 2 — smaller */}
      <path d="M380 275 L400 258 L420 275" fill="none" stroke="#504a45" strokeWidth="1.2" />
      <path d="M384 275 L400 260 L416 275" fill="#353025" opacity="0.5" />

      {/* Broken gear — musket leaning, scattered objects */}
      <line x1="280" y1="250" x2="290" y2="290" stroke="#5a5550" strokeWidth="1.5" />
      <line x1="282" y1="252" x2="292" y2="290" stroke="#4a4540" strokeWidth="1" />
      {/* Broken shoe */}
      <path d="M310 295 Q315 292 320 295 L322 298 L308 298 Z" fill="#3a3025" opacity="0.6" />
      {/* Canteen */}
      <circle cx="340" cy="293" r="4" fill="none" stroke="#5a5045" strokeWidth="1" opacity="0.5" />

      {/* Small fire — barely alive */}
      <ellipse cx="300" cy="310" rx="20" ry="3" fill="#a06030" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Stones around fire */}
      <circle cx="285" cy="310" r="3" fill="#4a4540" />
      <circle cx="295" cy="313" r="2.5" fill="#454035" />
      <circle cx="305" cy="313" r="2.5" fill="#4a4540" />
      <circle cx="315" cy="310" r="3" fill="#454035" />
      {/* Tiny embers */}
      <circle cx="298" cy="309" r="1.5" fill="#c07040" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="303" cy="308" r="1" fill="#d08050" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* Soldier silhouettes — hunched, miserable */}
      {/* Soldier 1 — sitting, hugging knees */}
      <path d="M270 290 Q268 275 272 265 Q275 260 278 265 Q282 275 280 290 L280 295 Q275 298 270 295 Z"
        fill="#1a1815" opacity="0.8" />
      {/* Soldier 2 — sitting cross-legged */}
      <path d="M320 290 Q318 277 322 268 Q325 263 328 268 Q332 277 330 290 Q328 296 325 298 Q322 296 320 290 Z"
        fill="#1a1815" opacity="0.8" />
      {/* Soldier 3 — lying down */}
      <path d="M340 300 Q345 298 370 300 Q375 302 370 304 Q345 306 340 304 Q337 302 340 300 Z"
        fill="#1a1815" opacity="0.6" />
      {/* Soldier 4 — standing, looking at sea */}
      <path d="M490 250 Q488 240 490 230 Q492 225 494 230 L496 250 L500 290 L497 292 L493 292 L490 290 Z"
        fill="#1a1815" opacity="0.7" />
      <circle cx="492" cy="222" r="5" fill="#1a1815" opacity="0.7" />

      {/* Foreground rocks */}
      <path d="M0 350 Q20 340 50 345 Q80 348 100 342 Q130 338 160 345 Q180 350 200 348"
        fill="#2a2520" />
      <path d="M600 355 Q630 345 660 350 Q690 353 720 348 Q750 342 780 350 Q800 355 800 360 L800 400 L600 400 Z"
        fill="#252018" />

      {/* Thin wispy smoke from dying fire */}
      <path d="M300 305 Q298 290 303 275 Q305 260 300 245" fill="none" stroke="#6a6560" strokeWidth="0.8" opacity="0.2">
        <animate attributeName="d" values="M300 305 Q298 290 303 275 Q305 260 300 245;M300 305 Q303 290 298 275 Q296 260 302 245;M300 305 Q298 290 303 275 Q305 260 300 245" dur="6s" repeatCount="indefinite" />
      </path>

      {/* Mist layer */}
      <rect x="0" y="220" width="800" height="40" fill="url(#ch1_mist)" />

      {/* Vignette */}
      <rect width="800" height="400" fill="url(#ch1_sky)" opacity="0.1" />
      <rect x="0" y="350" width="800" height="50" fill="#1a1510" opacity="0.4" />
    </svg>
  );
}
