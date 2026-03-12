import React from 'react';

/**
 * Ch.4 — Lodi, river bank (Po)
 * Dusk. Wide river, pontoon bridge in distance, artillery silhouettes,
 * evening sky reflected in water. Mood: Anticipation, esprit de corps.
 */
export function Ch4LodiScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Dusk sky — deep purple-orange */}
        <linearGradient id="ch4_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12101a" />
          <stop offset="35%" stopColor="#251a2a" />
          <stop offset="60%" stopColor="#4a3040" />
          <stop offset="80%" stopColor="#7a4a3a" />
          <stop offset="95%" stopColor="#a06838" />
          <stop offset="100%" stopColor="#b87a40" />
        </linearGradient>
        {/* River water */}
        <linearGradient id="ch4_water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3540" />
          <stop offset="30%" stopColor="#352a35" />
          <stop offset="70%" stopColor="#2a2530" />
          <stop offset="100%" stopColor="#201a25" />
        </linearGradient>
        {/* Sky reflection in water */}
        <linearGradient id="ch4_reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a3a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8a5a3a" stopOpacity="0" />
        </linearGradient>
        {/* Bank ground */}
        <linearGradient id="ch4_bank" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2518" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Fire glow */}
        <radialGradient id="ch4_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c08040" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c08040" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch4_sky)" />

      {/* Clouds catching sunset */}
      <ellipse cx="300" cy="55" rx="120" ry="8" fill="#5a3a35" opacity="0.25" />
      <ellipse cx="550" cy="40" rx="90" ry="6" fill="#6a4540" opacity="0.2" />
      <ellipse cx="150" cy="70" rx="80" ry="5" fill="#5a3a35" opacity="0.15" />

      {/* Far bank — flat Italian plain */}
      <path d="M0 160 Q200 155 400 158 Q600 155 800 160 L800 185 L0 185 Z"
        fill="#2a2520" opacity="0.7" />
      {/* Buildings on far bank */}
      <rect x="300" y="150" width="5" height="8" fill="#3a3530" opacity="0.5" />
      <rect x="310" y="152" width="4" height="6" fill="#3a3530" opacity="0.5" />
      <rect x="320" y="148" width="3" height="10" fill="#3a3530" opacity="0.5" />

      {/* Pontoon bridge — distant */}
      <path d="M280 168 Q340 165 400 166 Q460 165 520 168"
        fill="none" stroke="#4a4538" strokeWidth="1.5" opacity="0.5" />
      {/* Bridge supports */}
      <line x1="300" y1="168" x2="300" y2="175" stroke="#4a4538" strokeWidth="0.8" opacity="0.4" />
      <line x1="340" y1="167" x2="340" y2="175" stroke="#4a4538" strokeWidth="0.8" opacity="0.4" />
      <line x1="380" y1="166" x2="380" y2="175" stroke="#4a4538" strokeWidth="0.8" opacity="0.4" />
      <line x1="420" y1="166" x2="420" y2="175" stroke="#4a4538" strokeWidth="0.8" opacity="0.4" />
      <line x1="460" y1="167" x2="460" y2="175" stroke="#4a4538" strokeWidth="0.8" opacity="0.4" />
      <line x1="500" y1="168" x2="500" y2="175" stroke="#4a4538" strokeWidth="0.8" opacity="0.4" />

      {/* Wide river */}
      <rect x="0" y="175" width="800" height="100" fill="url(#ch4_water)" />
      {/* Sky reflection band */}
      <rect x="0" y="175" width="800" height="40" fill="url(#ch4_reflect)" />

      {/* Water ripples */}
      <path d="M0 195 Q40 193 80 195 Q120 197 160 195 Q200 193 240 195"
        fill="none" stroke="#5a4a50" strokeWidth="0.5" opacity="0.3" />
      <path d="M300 210 Q350 208 400 210 Q450 212 500 210 Q550 208 600 210"
        fill="none" stroke="#4a4045" strokeWidth="0.5" opacity="0.25" />
      <path d="M500 225 Q540 223 580 225 Q620 227 660 225 Q700 223 740 225"
        fill="none" stroke="#3a3540" strokeWidth="0.5" opacity="0.2" />

      {/* Shimmer reflection */}
      <ellipse cx="400" cy="190" rx="40" ry="2" fill="#8a6a4a" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.15" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="rx" values="40;45;40" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="200" rx="30" ry="1.5" fill="#7a5a3a" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.05;0.1" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Near bank */}
      <path d="M0 275 Q150 268 300 272 Q500 265 700 270 Q750 273 800 268 L800 400 L0 400 Z"
        fill="url(#ch4_bank)" />

      {/* Artillery silhouettes — 2 cannons */}
      {/* Cannon 1 */}
      <path d="M500 275 L530 270 L535 272 L505 278 Z" fill="#15120e" opacity="0.85" />
      <circle cx="510" cy="280" r="5" fill="#15120e" opacity="0.85" />
      <circle cx="525" cy="278" r="5" fill="#15120e" opacity="0.85" />
      {/* Cannon 2 */}
      <path d="M570 272 L600 267 L605 269 L575 275 Z" fill="#15120e" opacity="0.8" />
      <circle cx="580" cy="278" r="5" fill="#15120e" opacity="0.8" />
      <circle cx="595" cy="276" r="5" fill="#15120e" opacity="0.8" />

      {/* Ammo crates */}
      <rect x="545" y="276" width="10" height="8" fill="#1a1510" opacity="0.7" />
      <rect x="548" y="273" width="10" height="8" fill="#1a1510" opacity="0.7" />

      {/* Soldiers — gathered, confident postures */}
      {/* Standing group */}
      <path d="M200 260 Q198 248 200 240 Q202 235 204 240 L206 260 Z" fill="#12100c" opacity="0.8" />
      <circle cx="202" cy="235" r="4.5" fill="#12100c" opacity="0.8" />
      <path d="M215 260 Q213 250 215 242 Q217 237 219 242 L221 260 Z" fill="#12100c" opacity="0.8" />
      <circle cx="217" cy="237" r="4.5" fill="#12100c" opacity="0.8" />
      <path d="M230 262 Q228 250 230 243 Q232 238 234 243 L236 262 Z" fill="#12100c" opacity="0.75" />
      <circle cx="232" cy="238" r="4" fill="#12100c" opacity="0.75" />

      {/* Campfire */}
      <ellipse cx="300" cy="300" rx="30" ry="8" fill="url(#ch4_fireGlow)">
        <animate attributeName="rx" values="30;34;30" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M297 298 Q300 285 303 298" fill="#d09050" opacity="0.6">
        <animate attributeName="d" values="M297 298 Q300 285 303 298;M297 298 Q301 283 303 298;M297 298 Q300 285 303 298" dur="0.6s" repeatCount="indefinite" />
      </path>
      <circle cx="299" cy="283" r="0.7" fill="#e0b070" opacity="0.5">
        <animate attributeName="cy" values="283;265;250" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.2;0" dur="2.2s" repeatCount="indefinite" />
      </circle>

      {/* More soldiers around fire */}
      <path d="M285 292 Q283 282 286 277 Q289 282 287 292 Z" fill="#12100c" opacity="0.7" />
      <path d="M315 292 Q313 284 316 279 Q319 284 317 292 Z" fill="#12100c" opacity="0.7" />

      {/* Musket stack — tripod */}
      <line x1="350" y1="260" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      <line x1="358" y1="260" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />
      <line x1="354" y1="258" x2="355" y2="290" stroke="#2a2520" strokeWidth="1.5" />

      {/* Foreground reeds/grass */}
      <path d="M0 360 Q5 345 10 360" fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.3" />
      <path d="M15 365 Q20 348 25 365" fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.3" />
      <path d="M780 358 Q785 340 790 358" fill="none" stroke="#2a3520" strokeWidth="1" opacity="0.3" />

      {/* Dark vignette */}
      <rect x="0" y="370" width="800" height="30" fill="#0a0808" opacity="0.5" />
    </svg>
  );
}
