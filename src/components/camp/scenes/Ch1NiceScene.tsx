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
        {/* Muddy path fill — darker, wetter brown */}
        <linearGradient id="ch1_mudPath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2418" />
          <stop offset="100%" stopColor="#252018" />
        </linearGradient>
        {/* Signal fire glow — distant beacon */}
        <radialGradient id="ch1_signalGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a06030" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a06030" stopOpacity="0" />
        </radialGradient>
        {/* Rowboat wood */}
        <linearGradient id="ch1_boatWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3025" />
          <stop offset="100%" stopColor="#2a2018" />
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

      {/* Additional heavy cloud masses — thick overcast layer */}
      <ellipse cx="50" cy="42" rx="130" ry="16" fill="#302a38" opacity="0.3" />
      <ellipse cx="600" cy="48" rx="170" ry="13" fill="#332e3a" opacity="0.28">
        <animate attributeName="cx" values="600;615;600" dur="25s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="350" cy="28" rx="190" ry="20" fill="#2e2835" opacity="0.32" />
      {/* Low bruised cloud near horizon */}
      <ellipse cx="450" cy="118" rx="140" ry="9" fill="#403a48" opacity="0.14">
        <animate attributeName="cx" values="450;465;450" dur="18s" repeatCount="indefinite" />
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

      {/* === DISTANT SIGNAL FIRE — beacon on hilltop behind the city === */}
      {/* Hill silhouette behind city */}
      <path d="M740 165 Q755 142 770 138 Q785 142 800 160" fill="#3a3535" opacity="0.3" />
      {/* Signal fire platform — stone cairn */}
      <path d="M766 140 L770 134 L774 140" fill="#4a4545" opacity="0.25" />
      {/* Signal fire glow */}
      <ellipse cx="770" cy="132" rx="6" ry="4" fill="url(#ch1_signalGlow)">
        <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Flame */}
      <path d="M769 134 Q770 128 771 134" fill="#c08040" opacity="0.35">
        <animate attributeName="d" values="M769 134 Q770 128 771 134;M768 134 Q770 126 772 134;M769 134 Q770 128 771 134" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Thin smoke rising from signal fire */}
      <path d="M770 128 Q768 120 772 112" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M770 128 Q768 120 772 112;M770 128 Q772 120 776 112;M770 128 Q768 120 772 112" dur="5s" repeatCount="indefinite" />
      </path>

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

      {/* === ROWBOAT — pulled up on shore, listing to one side === */}
      {/* Boat hull — beached, tilted */}
      <path d="M25 236 Q30 232 55 230 Q70 232 75 236 Q55 240 35 240 Z" fill="url(#ch1_boatWood)" opacity="0.5" />
      {/* Boat gunwale edge */}
      <path d="M28 235 Q42 231 58 230 Q68 232 73 235" fill="none" stroke="#4a3a28" strokeWidth="0.8" opacity="0.4" />
      {/* Plank lines */}
      <path d="M32 236 Q45 233 60 232" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.25" />
      <path d="M30 238 Q48 235 65 234" fill="none" stroke="#2a2018" strokeWidth="0.3" opacity="0.2" />
      {/* Oar — resting against the hull */}
      <line x1="62" y1="228" x2="80" y2="220" stroke="#3a3028" strokeWidth="1" opacity="0.35" />
      <ellipse cx="80" cy="219" rx="3" ry="1.5" fill="#3a3028" opacity="0.3" transform="rotate(-25 80 219)" />
      {/* Anchor — small iron anchor on ground beside boat */}
      <path d="M18 240 L18 248 Q14 250 12 248 Q10 246 14 244 L18 244" fill="none" stroke="#3a3a3a" strokeWidth="1" opacity="0.35" />
      <line x1="18" y1="240" x2="18" y2="236" stroke="#3a3a3a" strokeWidth="0.8" opacity="0.3" />
      <path d="M16 236 L18 234 L20 236" fill="none" stroke="#3a3a3a" strokeWidth="0.8" opacity="0.3" />
      {/* Anchor ring */}
      <circle cx="18" cy="234" r="1.2" fill="none" stroke="#3a3a3a" strokeWidth="0.5" opacity="0.25" />
      {/* Frayed rope coiled near anchor */}
      <path d="M22 242 Q25 240 26 243 Q28 241 27 244 Q25 246 23 244" fill="none" stroke="#4a4035" strokeWidth="0.6" opacity="0.25" />

      {/* === FISHING NET — draped over rocks, soldiers supplementing rations === */}
      {/* Net draped between rock outcrops */}
      <path d="M55 232 Q62 236 72 234 Q80 236 88 233" fill="none" stroke="#5a5545" strokeWidth="0.5" opacity="0.3" />
      {/* Net mesh — horizontal strands sagging */}
      <path d="M58 234 Q65 238 72 236 Q80 238 86 235" fill="none" stroke="#5a5545" strokeWidth="0.4" opacity="0.22" />
      <path d="M60 236 Q67 240 74 238 Q82 240 84 237" fill="none" stroke="#5a5545" strokeWidth="0.4" opacity="0.18" />
      {/* Net mesh — vertical connecting strands */}
      <line x1="60" y1="232" x2="62" y2="237" stroke="#5a5545" strokeWidth="0.3" opacity="0.2" />
      <line x1="66" y1="233" x2="67" y2="239" stroke="#5a5545" strokeWidth="0.3" opacity="0.18" />
      <line x1="72" y1="234" x2="74" y2="239" stroke="#5a5545" strokeWidth="0.3" opacity="0.2" />
      <line x1="78" y1="235" x2="80" y2="239" stroke="#5a5545" strokeWidth="0.3" opacity="0.18" />
      <line x1="84" y1="233" x2="84" y2="237" stroke="#5a5545" strokeWidth="0.3" opacity="0.16" />
      {/* Net weight — small stone tied to edge */}
      <circle cx="58" cy="238" r="1.2" fill="#3a3530" opacity="0.3" />
      <circle cx="86" cy="237" r="1" fill="#3a3530" opacity="0.25" />

      {/* === WIND-BLOWN GRASS — animated tufts bending in coastal wind === */}
      {/* Grass tuft 1 — near shore */}
      <g opacity="0.3">
        <path d="M140 234 Q142 226 145 228" fill="none" stroke="#3a4528" strokeWidth="0.6">
          <animate attributeName="d" values="M140 234 Q142 226 145 228;M140 234 Q143 226 147 229;M140 234 Q142 226 145 228" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M142 234 Q143 228 146 230" fill="none" stroke="#354020" strokeWidth="0.5">
          <animate attributeName="d" values="M142 234 Q143 228 146 230;M142 234 Q144 228 148 231;M142 234 Q143 228 146 230" dur="3.2s" repeatCount="indefinite" />
        </path>
        <path d="M138 234 Q140 227 143 229" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M138 234 Q140 227 143 229;M138 234 Q141 227 145 230;M138 234 Q140 227 143 229" dur="2.8s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 2 — mid ground */}
      <g opacity="0.25">
        <path d="M350 234 Q352 226 355 228" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M350 234 Q352 226 355 228;M350 234 Q353 226 357 229;M350 234 Q352 226 355 228" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M348 234 Q350 228 353 230" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M348 234 Q350 228 353 230;M348 234 Q351 228 355 231;M348 234 Q350 228 353 230" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 3 — right side */}
      <g opacity="0.25">
        <path d="M580 230 Q582 222 585 224" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M580 230 Q582 222 585 224;M580 230 Q583 222 587 225;M580 230 Q582 222 585 224" dur="2.6s" repeatCount="indefinite" />
        </path>
        <path d="M582 230 Q583 224 586 226" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M582 230 Q583 224 586 226;M582 230 Q584 224 588 227;M582 230 Q583 224 586 226" dur="3.1s" repeatCount="indefinite" />
        </path>
        <path d="M578 230 Q580 224 583 226" fill="none" stroke="#3a4528" strokeWidth="0.4">
          <animate attributeName="d" values="M578 230 Q580 224 583 226;M578 230 Q581 224 585 227;M578 230 Q580 224 583 226" dur="2.9s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 4 — foreground left */}
      <g opacity="0.28">
        <path d="M200 236 Q202 228 205 230" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M200 236 Q202 228 205 230;M200 236 Q203 228 207 231;M200 236 Q202 228 205 230" dur="3.4s" repeatCount="indefinite" />
        </path>
        <path d="M198 236 Q200 230 203 232" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M198 236 Q200 230 203 232;M198 236 Q201 230 205 233;M198 236 Q200 230 203 232" dur="3.7s" repeatCount="indefinite" />
        </path>
      </g>
      {/* Grass tuft 5 — near camp path */}
      <g opacity="0.22">
        <path d="M450 232 Q452 224 455 226" fill="none" stroke="#3a4528" strokeWidth="0.5">
          <animate attributeName="d" values="M450 232 Q452 224 455 226;M450 232 Q453 224 457 227;M450 232 Q452 224 455 226" dur="2.7s" repeatCount="indefinite" />
        </path>
        <path d="M448 232 Q450 226 453 228" fill="none" stroke="#354020" strokeWidth="0.4">
          <animate attributeName="d" values="M448 232 Q450 226 453 228;M448 232 Q451 226 455 229;M448 232 Q450 226 453 228" dur="3.3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === MUDDY PATH — worn track connecting shelters and fires === */}
      {/* Main path — darker muddy strip winding through camp */}
      <path d="M130 290 Q175 288 220 292 Q260 300 300 308 Q340 312 400 305 Q460 296 520 290 Q570 286 620 290 Q660 296 700 300"
        fill="none" stroke="url(#ch1_mudPath)" strokeWidth="10" opacity="0.35" strokeLinecap="round" />
      {/* Path edges — worn dirt lines */}
      <path d="M130 286 Q175 284 220 288 Q260 296 300 304 Q340 308 400 301 Q460 292 520 286 Q570 282 620 286 Q660 292 700 296"
        fill="none" stroke="#2a2218" strokeWidth="0.6" opacity="0.25" />
      <path d="M130 294 Q175 292 220 296 Q260 304 300 312 Q340 316 400 309 Q460 300 520 294 Q570 290 620 294 Q660 300 700 304"
        fill="none" stroke="#2a2218" strokeWidth="0.6" opacity="0.25" />
      {/* Ruts — thin dark lines in the mud from boots and cart wheels */}
      <path d="M145 289 Q180 287 210 291 Q245 298 280 305"
        fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.2" />
      <path d="M320 310 Q360 308 400 303 Q440 298 480 293"
        fill="none" stroke="#1a1810" strokeWidth="0.5" opacity="0.2" />
      {/* Puddle in a rut */}
      <ellipse cx="250" cy="296" rx="6" ry="2" fill="#3a4555" opacity="0.15" />
      <ellipse cx="480" cy="292" rx="5" ry="1.5" fill="#3a4555" opacity="0.12" />

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

      {/* === GRAFFITI ON ROCK — "VIVE LA REPUBLIQUE" scratched into stone === */}
      {/* Large flat rock face near camp */}
      <path d="M495 228 Q508 222 525 226 Q530 230 520 234 Q510 236 498 233 Z" fill="#3a3530" opacity="0.5" />
      {/* Scratched text — faint, rough, revolutionary */}
      <text x="500" y="230" fontFamily="serif" fontSize="3.5" fill="#5a5550" opacity="0.3"
        letterSpacing="0.5" transform="rotate(-3 510 230)">VIVE LA REPUBLIQUE</text>
      {/* Scratch marks around the text — soldiers idle carving */}
      <line x1="498" y1="232" x2="524" y2="231" stroke="#4a4540" strokeWidth="0.2" opacity="0.2" />
      <line x1="500" y1="227" x2="522" y2="226" stroke="#4a4540" strokeWidth="0.2" opacity="0.15" />

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

      {/* Scattered straw near shelter 1 sleeping area */}
      <line x1="215" y1="296" x2="222" y2="294" stroke="#5a5535" strokeWidth="0.5" opacity="0.25" />
      <line x1="218" y1="298" x2="226" y2="297" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />
      <line x1="230" y1="293" x2="237" y2="292" stroke="#5a5535" strokeWidth="0.5" opacity="0.22" />
      <line x1="220" y1="300" x2="228" y2="299" stroke="#504a30" strokeWidth="0.4" opacity="0.18" />
      <line x1="234" y1="296" x2="240" y2="294" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />

      {/* Shelter 2 — half-collapsed */}
      <path d="M370 280 L400 258 L430 280" fill="none" stroke="#504a45" strokeWidth="1.2" />
      <path d="M375 280 L400 260 L425 280" fill="#353025" opacity="0.45" />
      {/* Collapsed side */}
      <path d="M425 280 L440 275" fill="none" stroke="#504a45" strokeWidth="1" opacity="0.3" />

      {/* Scattered straw near shelter 2 */}
      <line x1="432" y1="282" x2="440" y2="280" stroke="#5a5535" strokeWidth="0.5" opacity="0.22" />
      <line x1="435" y1="284" x2="442" y2="283" stroke="#504a30" strokeWidth="0.4" opacity="0.18" />
      <line x1="380" y1="284" x2="388" y2="283" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />

      {/* Shelter 3 — tiny, just a propped blanket */}
      <path d="M600 282 L615 270 L630 284" fill="#3a3528" opacity="0.35" />

      {/* Scattered straw near shelter 3 */}
      <line x1="595" y1="286" x2="603" y2="285" stroke="#5a5535" strokeWidth="0.4" opacity="0.2" />
      <line x1="625" y1="287" x2="633" y2="286" stroke="#504a30" strokeWidth="0.4" opacity="0.18" />
      <line x1="610" y1="289" x2="618" y2="288" stroke="#5a5535" strokeWidth="0.5" opacity="0.2" />

      {/* === LAUNDRY LINE — tattered shirts and trousers drying between poles === */}
      {/* Laundry poles — rough sticks stuck in the ground */}
      <line x1="440" y1="275" x2="440" y2="255" stroke="#4a4035" strokeWidth="1.2" opacity="0.45" />
      <line x1="520" y1="273" x2="520" y2="255" stroke="#4a4035" strokeWidth="1.2" opacity="0.45" />
      {/* Sagging rope line */}
      <path d="M440 256 Q480 262 520 256" fill="none" stroke="#4a4540" strokeWidth="0.5" opacity="0.35">
        <animate attributeName="d" values="M440 256 Q480 262 520 256;M440 256 Q480 264 520 256;M440 256 Q480 262 520 256" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Tattered shirt — large, patched, swaying */}
      <path d="M455 257 L454 269 L463 269 L463 257" fill="#4a4540" opacity="0.3">
        <animate attributeName="d" values="M455 257 L454 269 L463 269 L463 257;M455 258 L453 270 L462 270 L463 258;M455 257 L454 269 L463 269 L463 257" dur="4.2s" repeatCount="indefinite" />
      </path>
      {/* Patch on shirt */}
      <rect x="457" y="262" width="3" height="3" fill="#3a3528" opacity="0.2">
        <animate attributeName="x" values="457;456;457" dur="4.2s" repeatCount="indefinite" />
      </rect>
      {/* Tattered trousers — hanging by waist */}
      <path d="M475 258 L474 272 L477 272 L478 264 L479 272 L482 272 L482 258" fill="#3a3530" opacity="0.28">
        <animate attributeName="d" values="M475 258 L474 272 L477 272 L478 264 L479 272 L482 272 L482 258;M475 259 L473 273 L476 273 L477 265 L478 273 L481 273 L482 259;M475 258 L474 272 L477 272 L478 264 L479 272 L482 272 L482 258" dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* Small rag — just a strip of cloth */}
      <path d="M498 258 L497 264 L502 264 L503 258" fill="#504a40" opacity="0.22">
        <animate attributeName="d" values="M498 258 L497 264 L502 264 L503 258;M498 259 L496 265 L501 265 L503 259;M498 258 L497 264 L502 264 L503 258" dur="3.6s" repeatCount="indefinite" />
      </path>

      {/* === CLOTHESLINE — tattered clothes drying between two stakes === */}
      {/* Stakes */}
      <line x1="155" y1="250" x2="155" y2="238" stroke="#4a4035" strokeWidth="1.2" opacity="0.5" />
      <line x1="230" y1="252" x2="230" y2="240" stroke="#4a4035" strokeWidth="1.2" opacity="0.5" />
      {/* Rope — slight sag */}
      <path d="M155 239 Q192 243 230 241" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.4">
        <animate attributeName="d" values="M155 239 Q192 243 230 241;M155 239 Q192 245 230 241;M155 239 Q192 243 230 241" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Tattered shirt — patched, swaying */}
      <path d="M170 240 L170 251 L178 251 L178 240" fill="#4a4540" opacity="0.35">
        <animate attributeName="d" values="M170 240 L170 251 L178 251 L178 240;M170 241 L169 252 L177 252 L178 241;M170 240 L170 251 L178 251 L178 240" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Patch on shirt */}
      <rect x="172" y="244" width="3" height="3" fill="#3a3528" opacity="0.25">
        <animate attributeName="x" values="172;171;172" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Tattered breeches — small rectangle */}
      <path d="M190 241 L189 249 L197 249 L197 241" fill="#3a3530" opacity="0.3">
        <animate attributeName="d" values="M190 241 L189 249 L197 249 L197 241;M190 242 L188 250 L196 250 L197 242;M190 241 L189 249 L197 249 L197 241" dur="4.5s" repeatCount="indefinite" />
      </path>
      {/* Torn cloth scrap */}
      <path d="M210 241 L209 247 L214 248 L215 241" fill="#504a40" opacity="0.25">
        <animate attributeName="d" values="M210 241 L209 247 L214 248 L215 241;M210 242 L208 248 L213 249 L215 242;M210 241 L209 247 L214 248 L215 241" dur="3.8s" repeatCount="indefinite" />
      </path>

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

      {/* === RATS — scurrying near the barrel area === */}
      {/* Rat 1 — still, nose toward barrel */}
      <path d="M560 271 Q563 269 566 270 Q567 271 566 272 L560 272 Z" fill="#2a2520" opacity="0.4" />
      <line x1="560" y1="271" x2="557" y2="270" stroke="#2a2520" strokeWidth="0.4" opacity="0.3" />
      {/* Rat 2 — animated scurry near food scraps */}
      <g opacity="0.35">
        <path d="M542 276 Q545 274 548 275 Q549 276 548 277 L542 277 Z" fill="#252018">
          <animate attributeName="d" values="M542 276 Q545 274 548 275 Q549 276 548 277 L542 277 Z;M548 276 Q551 274 554 275 Q555 276 554 277 L548 277 Z;M554 274 Q557 272 560 273 Q561 274 560 275 L554 275 Z;M554 274 Q557 272 560 273 Q561 274 560 275 L554 275 Z;M548 276 Q551 274 554 275 Q555 276 554 277 L548 277 Z;M542 276 Q545 274 548 275 Q549 276 548 277 L542 277 Z" dur="8s" repeatCount="indefinite" />
        </path>
        {/* Tail */}
        <line x1="542" y1="277" x2="539" y2="276" stroke="#252018" strokeWidth="0.3">
          <animate attributeName="x1" values="542;548;554;554;548;542" dur="8s" repeatCount="indefinite" />
          <animate attributeName="x2" values="539;545;551;551;545;539" dur="8s" repeatCount="indefinite" />
        </line>
      </g>

      {/* === WATER BUCKET — near fire 1 === */}
      {/* Bucket body */}
      <path d="M330 308 L328 318 Q332 320 338 320 Q344 320 346 318 L344 308 Z" fill="#3a3528" opacity="0.5" />
      {/* Bucket rim */}
      <ellipse cx="337" cy="308" rx="7" ry="2.5" fill="none" stroke="#4a4035" strokeWidth="0.8" opacity="0.45" />
      {/* Bucket handle */}
      <path d="M330 308 Q337 302 344 308" fill="none" stroke="#4a4035" strokeWidth="0.6" opacity="0.35" />
      {/* Ladle — resting across the bucket */}
      <line x1="329" y1="306" x2="348" y2="310" stroke="#5a5550" strokeWidth="0.8" opacity="0.4" />
      <circle cx="348" cy="310" r="2" fill="none" stroke="#5a5550" strokeWidth="0.5" opacity="0.3" />

      {/* === PLAYING CARDS — soldiers gambling on the ground === */}
      {/* Card cluster between shelter 2 and fire area */}
      <rect x="388" y="292" width="4" height="5.5" rx="0.5" fill="#b0a890" opacity="0.3" transform="rotate(-8 390 294)" />
      <rect x="393" y="291" width="4" height="5.5" rx="0.5" fill="#a8a080" opacity="0.28" transform="rotate(12 395 294)" />
      <rect x="390" y="294" width="4" height="5.5" rx="0.5" fill="#b5ad90" opacity="0.25" transform="rotate(-22 392 297)" />
      <rect x="396" y="294" width="4" height="5.5" rx="0.5" fill="#a0987a" opacity="0.22" transform="rotate(5 398 297)" />
      {/* Tiny card markings */}
      <circle cx="390" cy="294" r="0.5" fill="#3a3025" opacity="0.2" />
      <circle cx="396" cy="293" r="0.5" fill="#3a3025" opacity="0.18" />

      {/* === TORN LETTER — discarded near sleeping soldier === */}
      {/* Folded/crumpled paper shape */}
      <path d="M108 244 L116 243 L117 250 L110 251 Z" fill="#b0a880" opacity="0.2" />
      <path d="M116 243 L118 244 L119 250 L117 250 Z" fill="#a09870" opacity="0.15" />
      {/* Faint writing lines */}
      <line x1="110" y1="246" x2="115" y2="245" stroke="#5a5040" strokeWidth="0.3" opacity="0.15" />
      <line x1="110" y1="248" x2="114" y2="247" stroke="#5a5040" strokeWidth="0.3" opacity="0.12" />

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

      {/* === COOKING FIRE TRIPOD — blackened pot hung over fire 1 === */}
      {/* Three sticks forming a tripod over the fire */}
      <line x1="292" y1="318" x2="300" y2="294" stroke="#2a2018" strokeWidth="1" opacity="0.5" />
      <line x1="310" y1="318" x2="300" y2="294" stroke="#2a2018" strokeWidth="1" opacity="0.5" />
      <line x1="298" y1="308" x2="300" y2="294" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
      {/* Rope/hook hanging from apex */}
      <line x1="300" y1="294" x2="300" y2="302" stroke="#3a3530" strokeWidth="0.5" opacity="0.4" />
      {/* Blackened pot — small, dented iron pot */}
      <path d="M294 302 Q294 306 297 308 Q300 309 303 308 Q306 306 306 302 Z" fill="#1a1a1a" opacity="0.55" />
      {/* Pot rim */}
      <ellipse cx="300" cy="302" rx="6" ry="2" fill="none" stroke="#2a2a2a" strokeWidth="0.6" opacity="0.45" />
      {/* Pot handle */}
      <path d="M295 302 Q300 299 305 302" fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.35" />
      {/* Steam wisps from pot */}
      <path d="M298 300 Q297 296 299 292" fill="none" stroke="#6a6560" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="d" values="M298 300 Q297 296 299 292;M298 300 Q299 296 301 292;M298 300 Q297 296 299 292" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M302 300 Q303 296 301 292" fill="none" stroke="#6a6560" strokeWidth="0.3" opacity="0.08">
        <animate attributeName="d" values="M302 300 Q303 296 301 292;M302 300 Q304 296 303 292;M302 300 Q303 296 301 292" dur="5s" repeatCount="indefinite" />
      </path>

      {/* === CAMP DOG — curled up near fire 1 warmth === */}
      {/* Body — small, bony camp mutt */}
      <path d="M320 322 Q326 318 332 320 Q336 322 334 326 Q328 328 322 326 Q318 324 320 322 Z" fill="#2a2520" opacity="0.5" />
      {/* Head tucked in */}
      <ellipse cx="320" cy="322" rx="3" ry="2.5" fill="#2a2520" opacity="0.5" />
      {/* Ear */}
      <path d="M318 320 L316 318 L319 320" fill="#2a2520" opacity="0.4" />
      {/* Tail curled around body */}
      <path d="M334 324 Q338 322 337 326" fill="none" stroke="#2a2520" strokeWidth="0.8" opacity="0.35" />
      {/* Breathing animation — subtle rise */}
      <ellipse cx="327" cy="322" rx="5" ry="3" fill="#2a2520" opacity="0.15">
        <animate attributeName="ry" values="3;3.5;3" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === STRAY CAT — silhouette near the cooking fire warmth === */}
      {/* Cat body — sitting upright, alert, near the warmth */}
      <path d="M280 320 Q282 314 284 308 Q286 314 288 320 Q284 322 280 320 Z" fill="#1a1815" opacity="0.5" />
      {/* Cat head */}
      <ellipse cx="284" cy="306" rx="2.5" ry="2" fill="#1a1815" opacity="0.5" />
      {/* Pointed ears */}
      <path d="M282 304 L281 301 L283 303" fill="#1a1815" opacity="0.45" />
      <path d="M285 304 L287 301 L286 303" fill="#1a1815" opacity="0.45" />
      {/* Tail curled around body */}
      <path d="M288 319 Q292 316 294 318 Q292 320 290 320" fill="none" stroke="#1a1815" strokeWidth="0.8" opacity="0.4" />
      {/* Tiny eye gleam from firelight */}
      <circle cx="283" cy="306" r="0.4" fill="#c08040" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
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

      {/* === SMOKE FROM CAMPFIRE 2 — thin wispy column === */}
      <path d="M650 302 Q648 290 652 278 Q655 268 662 258" fill="none" stroke="#6a6560" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="d" values="M650 302 Q648 290 652 278 Q655 268 662 258;M650 302 Q652 290 656 278 Q662 268 670 258;M650 302 Q648 290 652 278 Q655 268 662 258" dur="8s" repeatCount="indefinite" />
      </path>
      <path d="M651 300 Q653 292 657 282 Q662 274 668 265" fill="none" stroke="#5a5855" strokeWidth="0.3" opacity="0.06">
        <animate attributeName="d" values="M651 300 Q653 292 657 282 Q662 274 668 265;M651 300 Q655 292 660 282 Q668 274 676 265;M651 300 Q653 292 657 282 Q662 274 668 265" dur="9s" repeatCount="indefinite" />
      </path>

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

      {/* === MORE SLEEPING SOLDIERS — exhaustion everywhere === */}
      {/* Sleeping soldier 9 — curled on ground near shelter 2 */}
      <path d="M355 290 Q362 286 372 288 Q378 291 372 294 Q362 296 355 294 Q351 292 355 290 Z"
        fill="#1a1815" opacity="0.45" />
      <circle cx="353" cy="290" r="3" fill="#1a1815" opacity="0.4" />
      {/* Thin blanket over him */}
      <path d="M357 289 Q364 286 374 288 Q379 291 373 293" fill="#3a3530" opacity="0.2" />

      {/* Sleeping soldier 10 — sprawled near path, face down */}
      <path d="M560 298 Q568 295 578 297 Q582 300 576 303 Q568 305 560 302 Q556 300 560 298 Z"
        fill="#1a1815" opacity="0.4" />
      <circle cx="558" cy="299" r="2.8" fill="#1a1815" opacity="0.35" />
      {/* Arm stretched out */}
      <path d="M576 300 Q580 298 584 300" fill="none" stroke="#1a1815" strokeWidth="1" opacity="0.25" />

      {/* Sleeping soldier 11 — propped against broken cart wheel */}
      <path d="M540 280 Q538 274 540 268 Q542 274 544 280 Z" fill="#1a1815" opacity="0.45" />
      <circle cx="541" cy="266" r="3" fill="#1a1815" opacity="0.4" />
      {/* Head lolled to one side */}
      <path d="M540 268 Q537 266 536 268" fill="none" stroke="#1a1815" strokeWidth="1" opacity="0.3" />

      {/* === FOREGROUND === */}
      {/* Rocky foreground — closer, darker */}
      <path d="M0 355 Q15 345 35 350 Q55 346 80 352 Q100 344 130 350 Q160 348 190 354 Q210 350 230 355 L230 400 L0 400 Z"
        fill="#222018" />
      <path d="M580 358 Q610 348 640 352 Q670 346 700 350 Q730 344 760 352 Q780 350 800 354 L800 400 L580 400 Z"
        fill="#201a15" />

      {/* Foreground rock detail */}
      <path d="M40 350 Q50 345 60 348" fill="#2a2520" opacity="0.5" />
      <path d="M650 350 Q665 344 680 348" fill="#252018" opacity="0.5" />

      {/* Additional coastal rocks — more foreground detail */}
      <path d="M15 360 Q22 354 30 357 Q36 354 42 360" fill="#282218" opacity="0.55" />
      <path d="M90 352 Q98 346 108 350 Q114 347 120 353" fill="#252018" opacity="0.45" />
      <path d="M170 355 Q178 350 186 352" fill="#2a2520" opacity="0.4" />
      {/* Right-side coastal rocks */}
      <path d="M600 360 Q612 352 624 356 Q632 352 640 358" fill="#222018" opacity="0.5" />
      <path d="M700 352 Q710 346 722 350 Q730 347 738 353" fill="#252018" opacity="0.45" />
      <path d="M760 356 Q770 350 782 354" fill="#201a15" opacity="0.4" />

      {/* === SEASHELLS — tiny scattered Mediterranean shells on foreground rocks === */}
      {/* Spiral shell — left rocks */}
      <path d="M48 354 Q50 352 52 354 Q50 356 48 354" fill="#6a6560" opacity="0.15" />
      <path d="M49 354 Q50 353 51 354" fill="none" stroke="#7a7570" strokeWidth="0.2" opacity="0.12" />
      {/* Bivalve shell — open */}
      <path d="M105 351 Q108 349 111 351 Q108 352 105 351" fill="#7a7060" opacity="0.12" />
      {/* Tiny limpet shells */}
      <ellipse cx="72" cy="356" rx="1.2" ry="0.6" fill="#6a6055" opacity="0.14" />
      <ellipse cx="160" cy="354" rx="1" ry="0.5" fill="#706558" opacity="0.12" />
      <ellipse cx="185" cy="356" rx="0.8" ry="0.4" fill="#6a6055" opacity="0.1" />
      {/* Right-side shells */}
      <path d="M618 356 Q620 354 622 356 Q620 358 618 356" fill="#6a6560" opacity="0.12" />
      <ellipse cx="660" cy="352" rx="1" ry="0.5" fill="#706558" opacity="0.12" />
      <path d="M710 351 Q713 349 716 351 Q713 352 710 351" fill="#7a7060" opacity="0.1" />
      <ellipse cx="740" cy="354" rx="1.2" ry="0.6" fill="#6a6055" opacity="0.11" />
      {/* Scattered small shell fragments */}
      <circle cx="35" cy="358" r="0.6" fill="#706558" opacity="0.1" />
      <circle cx="125" cy="352" r="0.5" fill="#6a6055" opacity="0.1" />
      <circle cx="690" cy="354" r="0.5" fill="#706558" opacity="0.09" />

      {/* Sea spray dots — white specks against the rocks */}
      <circle cx="20" cy="358" r="0.6" fill="#8a8a90" opacity="0.12" />
      <circle cx="35" cy="356" r="0.4" fill="#9a9a9a" opacity="0.1" />
      <circle cx="100" cy="350" r="0.5" fill="#8a8a90" opacity="0.1" />
      <circle cx="610" cy="356" r="0.5" fill="#8a8a90" opacity="0.12" />
      <circle cx="625" cy="354" r="0.4" fill="#9a9a9a" opacity="0.08" />
      <circle cx="715" cy="350" r="0.6" fill="#8a8a90" opacity="0.1" />
      <circle cx="770" cy="354" r="0.4" fill="#9a9a9a" opacity="0.08" />
      {/* Animated spray — intermittent splash */}
      <circle cx="45" cy="354" r="0.5" fill="#aaaaaa" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.18;0.08;0.04;0.08" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="630" cy="352" r="0.5" fill="#aaaaaa" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.15;0.06;0.03;0.06" dur="6s" repeatCount="indefinite" />
      </circle>

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
