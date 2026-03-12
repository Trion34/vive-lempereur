import React from 'react';

/**
 * Ch.12 — Fall of Mantua, outside fortress walls
 * Winter morning. Fortress walls/gates, distant surrendering column,
 * winter bare trees, grey sky, worn victors. Mood: Somber victory.
 */
export function Ch12MantuaFallScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Winter morning sky — cold grey with thin warm band */}
        <linearGradient id="ch12_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1e25" />
          <stop offset="40%" stopColor="#2a3035" />
          <stop offset="70%" stopColor="#3a4045" />
          <stop offset="90%" stopColor="#4a5050" />
          <stop offset="100%" stopColor="#5a5a55" />
        </linearGradient>
        {/* Fortress walls */}
        <linearGradient id="ch12_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4540" />
          <stop offset="50%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#302a25" />
        </linearGradient>
        {/* Ground */}
        <linearGradient id="ch12_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2820" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>
        {/* Gate shadow */}
        <radialGradient id="ch12_gateShadow" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#15120e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#15120e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="400" fill="url(#ch12_sky)" />

      {/* Thin clouds */}
      <ellipse cx="250" cy="35" rx="150" ry="8" fill="#2a3035" opacity="0.3" />
      <ellipse cx="550" cy="50" rx="120" ry="6" fill="#2a3035" opacity="0.25" />

      {/* === FORTRESS === */}
      {/* Main wall */}
      <rect x="50" y="100" width="700" height="150" fill="url(#ch12_wall)" />

      {/* Wall texture — stone blocks */}
      {[120, 140, 160, 180, 200, 220].map((y) => (
        <path key={y} d={`M60 ${y} L740 ${y}`} fill="none" stroke="#4a4538" strokeWidth="0.5" opacity="0.2" />
      ))}
      {[100, 200, 300, 400, 500, 600, 700].map((x) => (
        <path key={x} d={`M${x} 100 L${x} 250`} fill="none" stroke="#4a4538" strokeWidth="0.5" opacity="0.15" />
      ))}

      {/* Battlements */}
      {Array.from({ length: 18 }, (_, i) => (
        <rect key={i} x={60 + i * 40} y="85" width="20" height="18" fill="#4a4540" />
      ))}

      {/* Tower left */}
      <rect x="50" y="60" width="50" height="190" fill="#3a3530" />
      <rect x="45" y="55" width="60" height="8" fill="#4a4540" />
      {/* Tower window */}
      <path d="M68 90 Q75 80 82 90 L82 110 L68 110 Z" fill="#1a1815" />

      {/* Tower right */}
      <rect x="700" y="65" width="50" height="185" fill="#3a3530" />
      <rect x="695" y="60" width="60" height="8" fill="#4a4540" />
      <path d="M718 95 Q725 85 732 95 L732 115 L718 115 Z" fill="#1a1815" />

      {/* Main gate — arch */}
      <path d="M340 250 Q400 190 460 250" fill="#15120e" />
      <path d="M345 250 Q400 195 455 250" fill="#1a1815" />
      {/* Gate doors — open */}
      <line x1="345" y1="250" x2="355" y2="210" stroke="#2a2520" strokeWidth="3" />
      <line x1="455" y1="250" x2="445" y2="210" stroke="#2a2520" strokeWidth="3" />

      {/* Ground */}
      <path d="M0 250 Q200 248 400 250 Q600 248 800 250 L800 400 L0 400 Z"
        fill="url(#ch12_ground)" />

      {/* Road from gate */}
      <path d="M370 250 Q380 270 375 290 Q365 320 360 350 Q355 380 350 400"
        fill="none" stroke="#252018" strokeWidth="30" opacity="0.3" />
      <path d="M430 250 Q420 270 425 290 Q435 320 440 350 Q445 380 450 400"
        fill="none" stroke="#252018" strokeWidth="30" opacity="0.3" />

      {/* Surrendering column — distant, emerging from gate */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <React.Fragment key={i}>
          <path
            d={`M${395 + (i % 2) * 8} ${255 + i * 12} Q${393 + (i % 2) * 8} ${248 + i * 12} ${395 + (i % 2) * 8} ${243 + i * 12}`}
            fill="none" stroke="#3a3a38" strokeWidth="2" opacity={0.5 - i * 0.04}
          />
          <circle cx={395 + (i % 2) * 8} cy={240 + i * 12} r={2.5 - i * 0.1} fill="#3a3a38" opacity={0.5 - i * 0.04} />
        </React.Fragment>
      ))}

      {/* Bare winter trees */}
      {/* Tree left */}
      <path d="M150 250 Q152 220 155 190" fill="none" stroke="#2a2825" strokeWidth="2" />
      <path d="M155 190 Q162 175 165 182" fill="none" stroke="#2a2825" strokeWidth="1" />
      <path d="M155 190 Q148 178 146 185" fill="none" stroke="#2a2825" strokeWidth="0.8" />
      <path d="M153 210 Q145 200 143 206" fill="none" stroke="#2a2825" strokeWidth="0.7" />

      {/* Tree right */}
      <path d="M650 248 Q652 218 655 190" fill="none" stroke="#2a2825" strokeWidth="1.8" />
      <path d="M655 190 Q660 178 662 185" fill="none" stroke="#2a2825" strokeWidth="0.8" />
      <path d="M655 190 Q648 180 646 186" fill="none" stroke="#2a2825" strokeWidth="0.7" />

      {/* French soldiers — worn victors, standing watch */}
      {/* Soldier 1 — standing */}
      <path d="M250 240 Q248 228 250 220 Q252 215 254 220 L256 240 Q255 248 254 255 L250 255 Z"
        fill="#15120e" opacity="0.8" />
      <circle cx="252" cy="215" r="5" fill="#15120e" opacity="0.8" />
      {/* Musket */}
      <line x1="258" y1="214" x2="260" y2="258" stroke="#15120e" strokeWidth="1.5" opacity="0.6" />

      {/* Soldier 2 */}
      <path d="M270 242 Q268 232 270 224 Q272 219 274 224 L276 242 Q275 250 274 258 L270 258 Z"
        fill="#15120e" opacity="0.75" />
      <circle cx="272" cy="219" r="4.5" fill="#15120e" opacity="0.75" />

      {/* Soldier 3 — seated */}
      <path d="M560 268 Q558 258 560 252 Q562 258 564 268 Z" fill="#15120e" opacity="0.7" />
      <circle cx="561" cy="249" r="4" fill="#15120e" opacity="0.7" />

      {/* Flag — tricolor hint */}
      <line x1="290" y1="210" x2="290" y2="180" stroke="#2a2520" strokeWidth="1.5" />
      <path d="M290 180 L305 183 L305 195 L290 192" fill="#2a3550" opacity="0.4" />

      {/* Ground frost */}
      <rect x="0" y="248" width="800" height="4" fill="#4a5055" opacity="0.06" />

      {/* Vignette */}
      <rect x="0" y="375" width="800" height="25" fill="#0a0a0c" opacity="0.4" />
    </svg>
  );
}
