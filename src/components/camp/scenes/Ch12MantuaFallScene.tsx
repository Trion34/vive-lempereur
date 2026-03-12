import React from 'react';

/**
 * Ch.12 — Fall of Mantua, outside fortress walls
 * Winter morning. Massive fortress walls/gates, surrendering Austrian column,
 * winter bare trees, grey sky, worn but proud French victors, discarded weapons,
 * frost and snow particles. Mood: Somber victory in bitter cold.
 *
 * Enhanced: Austrian prisoner column through gate, musket stack, tricolor on tower,
 * animated snow flurry, breath vapor, supply wagon, frozen puddles, distant prisoners,
 * sentry in tower window, dog following soldiers.
 */
export function Ch12MantuaFallScene() {
  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Winter morning sky — cold grey with thin warm band at horizon */}
        <linearGradient id="ch12_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#151820" />
          <stop offset="25%" stopColor="#1e2430" />
          <stop offset="50%" stopColor="#2a3038" />
          <stop offset="70%" stopColor="#3a4045" />
          <stop offset="85%" stopColor="#4a4e50" />
          <stop offset="93%" stopColor="#5a5550" />
          <stop offset="100%" stopColor="#6a6055" />
        </linearGradient>

        {/* Fortress walls — aged stone */}
        <linearGradient id="ch12_wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#504a42" />
          <stop offset="30%" stopColor="#4a4540" />
          <stop offset="60%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#302a25" />
        </linearGradient>

        {/* Tower gradient — slightly darker stone */}
        <linearGradient id="ch12_tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#454038" />
          <stop offset="50%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2a2520" />
        </linearGradient>

        {/* Ground — frozen earth */}
        <linearGradient id="ch12_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2820" />
          <stop offset="40%" stopColor="#222018" />
          <stop offset="100%" stopColor="#1a1810" />
        </linearGradient>

        {/* Gate interior shadow */}
        <radialGradient id="ch12_gateShadow" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#0a0808" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#15120e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#15120e" stopOpacity="0" />
        </radialGradient>

        {/* Radial vignette — darkens edges */}
        <radialGradient id="ch12_vignette" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>

        {/* Frost shimmer on ground */}
        <linearGradient id="ch12_frost" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8090a0" stopOpacity="0" />
          <stop offset="20%" stopColor="#8090a0" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#a0b0c0" stopOpacity="0.08" />
          <stop offset="80%" stopColor="#8090a0" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#8090a0" stopOpacity="0" />
        </linearGradient>

        {/* Tricolor blue */}
        <linearGradient id="ch12_flagBlue" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#1a2a55" />
          <stop offset="100%" stopColor="#253565" />
        </linearGradient>

        {/* Tricolor red */}
        <linearGradient id="ch12_flagRed" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#6a2020" />
          <stop offset="100%" stopColor="#7a2828" />
        </linearGradient>

        {/* Atmospheric haze over distant wall */}
        <linearGradient id="ch12_haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3038" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a3038" stopOpacity="0" />
        </linearGradient>

        {/* Snow particle filter for subtle shimmer */}
        <filter id="ch12_snowGlow">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>

        {/* NEW: Frozen puddle reflection gradient */}
        <linearGradient id="ch12_iceReflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5565" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#3a4555" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#2a3040" stopOpacity="0.05" />
        </linearGradient>

        {/* NEW: Wagon wood gradient */}
        <linearGradient id="ch12_wagonWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3025" />
          <stop offset="100%" stopColor="#2a2018" />
        </linearGradient>

        {/* NEW: Wagon canvas cover */}
        <linearGradient id="ch12_wagonCanvas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4840" />
          <stop offset="100%" stopColor="#3a3830" />
        </linearGradient>

        {/* NEW: Tower tricolor flag — animated wave */}
        <linearGradient id="ch12_towerFlagBlue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a2a60" />
          <stop offset="100%" stopColor="#253870" />
        </linearGradient>
        <linearGradient id="ch12_towerFlagRed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#702525" />
          <stop offset="100%" stopColor="#803030" />
        </linearGradient>

        {/* NEW: Breath vapor filter — soft blur */}
        <filter id="ch12_breathBlur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        {/* NEW: Snowflake drift animation keyframes via CSS */}
        <style>{`
          @keyframes ch12_snowDrift1 {
            0% { transform: translate(0, 0); opacity: 0.12; }
            25% { transform: translate(3px, 8px); opacity: 0.16; }
            50% { transform: translate(-2px, 18px); opacity: 0.14; }
            75% { transform: translate(4px, 28px); opacity: 0.10; }
            100% { transform: translate(1px, 40px); opacity: 0; }
          }
          @keyframes ch12_snowDrift2 {
            0% { transform: translate(0, 0); opacity: 0.10; }
            25% { transform: translate(-4px, 10px); opacity: 0.15; }
            50% { transform: translate(2px, 22px); opacity: 0.12; }
            75% { transform: translate(-3px, 32px); opacity: 0.08; }
            100% { transform: translate(-1px, 44px); opacity: 0; }
          }
          @keyframes ch12_snowDrift3 {
            0% { transform: translate(0, 0); opacity: 0.14; }
            30% { transform: translate(5px, 12px); opacity: 0.16; }
            60% { transform: translate(-1px, 25px); opacity: 0.11; }
            100% { transform: translate(3px, 42px); opacity: 0; }
          }
          @keyframes ch12_flagWave {
            0% { d: path('M40 26 Q48 24 54 26 Q58 22 62 26 Q66 24 70 26 L70 38 Q66 36 62 38 Q58 34 54 38 Q48 36 40 38 Z'); }
            33% { d: path('M40 26 Q47 22 54 25 Q59 28 63 24 Q67 26 70 26 L70 38 Q67 36 63 38 Q59 34 54 37 Q47 40 40 38 Z'); }
            66% { d: path('M40 26 Q49 28 55 24 Q58 26 63 28 Q67 24 70 26 L70 38 Q67 40 63 36 Q58 38 55 40 Q49 36 40 38 Z'); }
            100% { d: path('M40 26 Q48 24 54 26 Q58 22 62 26 Q66 24 70 26 L70 38 Q66 36 62 38 Q58 34 54 38 Q48 36 40 38 Z'); }
          }
          @keyframes ch12_breathPulse1 {
            0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
            20% { opacity: 0.08; }
            50% { opacity: 0.06; transform: translate(4px, -3px) scale(1); }
            100% { opacity: 0; transform: translate(8px, -6px) scale(1.5); }
          }
          @keyframes ch12_breathPulse2 {
            0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
            25% { opacity: 0.07; }
            60% { opacity: 0.05; transform: translate(-4px, -4px) scale(1.1); }
            100% { opacity: 0; transform: translate(-7px, -7px) scale(1.4); }
          }
        `}</style>
      </defs>

      {/* === SKY === */}
      <rect width="800" height="400" fill="url(#ch12_sky)" />

      {/* Layered winter clouds */}
      <ellipse cx="180" cy="28" rx="160" ry="10" fill="#222830" opacity="0.3" />
      <ellipse cx="420" cy="18" rx="200" ry="8" fill="#1e2428" opacity="0.25" />
      <ellipse cx="600" cy="38" rx="130" ry="7" fill="#252a30" opacity="0.3" />
      <ellipse cx="100" cy="55" rx="110" ry="6" fill="#2a3038" opacity="0.2" />
      <ellipse cx="700" cy="22" rx="90" ry="5" fill="#222830" opacity="0.2" />
      {/* Faint warm band at horizon behind fortress */}
      <rect x="0" y="85" width="800" height="20" fill="#5a5548" opacity="0.1" />

      {/* === FORTRESS ARCHITECTURE === */}

      {/* Distant wall extension — left wing */}
      <rect x="-20" y="115" width="90" height="135" fill="#383328" />
      {/* Distant wall extension — right wing */}
      <rect x="730" y="118" width="90" height="132" fill="#383328" />

      {/* Main wall */}
      <rect x="50" y="100" width="700" height="150" fill="url(#ch12_wall)" />

      {/* Wall texture — horizontal mortar lines */}
      {[112, 125, 138, 150, 162, 174, 186, 198, 210, 222, 236].map((y) => (
        <path key={`h${y}`} d={`M55 ${y} L745 ${y}`} fill="none" stroke="#4a4538" strokeWidth="0.4" opacity="0.18" />
      ))}
      {/* Wall texture — vertical mortar (staggered blocks) */}
      {[90, 135, 180, 225, 270, 315, 360, 460, 505, 550, 595, 640, 685, 730].map((x, i) => (
        <path key={`v${x}`} d={`M${x} ${100 + (i % 2) * 6} L${x} 250`} fill="none" stroke="#4a4538" strokeWidth="0.4" opacity="0.12" />
      ))}

      {/* Wall damage / weathering patches */}
      <rect x="120" y="140" width="25" height="15" fill="#35302a" opacity="0.3" rx="2" />
      <rect x="520" y="165" width="30" height="12" fill="#35302a" opacity="0.25" rx="2" />
      <rect x="620" y="130" width="18" height="18" fill="#2e2a24" opacity="0.2" rx="1" />

      {/* Arrow slits in main wall */}
      <rect x="180" y="150" width="3" height="18" fill="#1a1815" rx="1" />
      <rect x="280" y="148" width="3" height="18" fill="#1a1815" rx="1" />
      <rect x="530" y="150" width="3" height="18" fill="#1a1815" rx="1" />
      <rect x="620" y="147" width="3" height="18" fill="#1a1815" rx="1" />

      {/* Battlements — crenellations */}
      {Array.from({ length: 18 }, (_, i) => (
        <React.Fragment key={`bat${i}`}>
          <rect x={60 + i * 40} y="84" width="20" height="20" fill="#4a4540" />
          {/* Merlon cap */}
          <rect x={59 + i * 40} y="82" width="22" height="3" fill="#504a42" />
        </React.Fragment>
      ))}

      {/* === LEFT TOWER (larger, more detail) === */}
      <rect x="30" y="48" width="65" height="202" fill="url(#ch12_tower)" />
      {/* Tower cap / cornice */}
      <rect x="24" y="42" width="77" height="10" fill="#504a42" />
      <rect x="27" y="40" width="71" height="4" fill="#555048" />
      {/* Tower battlements */}
      <rect x="28" y="30" width="14" height="14" fill="#4a4540" />
      <rect x="52" y="30" width="14" height="14" fill="#4a4540" />
      <rect x="76" y="30" width="14" height="14" fill="#4a4540" />
      {/* Tower window — arched */}
      <path d="M52 80 Q62.5 68 73 80 L73 105 L52 105 Z" fill="#12100c" />
      {/* Window frame */}
      <path d="M52 80 Q62.5 68 73 80" fill="none" stroke="#555048" strokeWidth="1" />
      <line x1="62.5" y1="72" x2="62.5" y2="105" stroke="#3a3530" strokeWidth="0.8" />

      {/* NEW: Sentry silhouette in left tower window */}
      <g opacity="0.35">
        {/* Head */}
        <circle cx="60" cy="86" r="2.5" fill="#1a1815" />
        {/* Shako hint */}
        <rect x="58" y="82" width="4" height="3" fill="#1a1815" rx="0.5" />
        {/* Shoulders/torso visible in window */}
        <path d="M56 89 Q60 87 64 89 L64 96 L56 96 Z" fill="#1a1815" />
        {/* Musket barrel leaning in window */}
        <line x1="64" y1="85" x2="68" y2="78" stroke="#2a2825" strokeWidth="0.8" />
      </g>

      {/* Second window — small */}
      <rect x="55" y="140" width="14" height="10" fill="#12100c" rx="1" />
      {/* Stone texture lines on tower */}
      {[65, 85, 105, 125, 145, 165, 185, 205, 225].map((y) => (
        <line key={`lt${y}`} x1="32" y1={y} x2="93" y2={y} stroke="#4a4538" strokeWidth="0.3" opacity="0.15" />
      ))}

      {/* NEW: French tricolor being raised on the tallest (left) tower */}
      <g>
        {/* Flag pole — on top of left tower */}
        <line x1="55" y1="30" x2="55" y2="12" stroke="#3a3530" strokeWidth="1.5" />
        {/* Pole finial */}
        <circle cx="55" cy="11" r="1.5" fill="#6a6555" opacity="0.6" />
        {/* Animated tricolor — waving flag on tower */}
        {/* Blue band */}
        <path d="M55 13 Q60 11 63 13 Q65 15 66 13 L66 21 Q65 19 63 21 Q60 19 55 21 Z"
          fill="url(#ch12_towerFlagBlue)" opacity="0.65">
          <animate attributeName="d"
            values="M55 13 Q60 11 63 13 Q65 15 66 13 L66 21 Q65 19 63 21 Q60 19 55 21 Z;
                    M55 13 Q59 15 63 12 Q65 14 66 13 L66 21 Q65 23 63 20 Q59 22 55 21 Z;
                    M55 13 Q61 11 64 14 Q65 12 66 13 L66 21 Q65 20 64 22 Q61 19 55 21 Z;
                    M55 13 Q60 11 63 13 Q65 15 66 13 L66 21 Q65 19 63 21 Q60 19 55 21 Z"
            dur="3s" repeatCount="indefinite" />
        </path>
        {/* White band */}
        <path d="M66 13 Q69 11 72 13 Q74 15 75 14 L75 22 Q74 20 72 21 Q69 19 66 21 Z"
          fill="#808078" opacity="0.5">
          <animate attributeName="d"
            values="M66 13 Q69 11 72 13 Q74 15 75 14 L75 22 Q74 20 72 21 Q69 19 66 21 Z;
                    M66 13 Q68 15 71 12 Q73 14 75 14 L75 22 Q73 23 71 20 Q68 22 66 21 Z;
                    M66 13 Q70 12 73 14 Q74 12 75 14 L75 22 Q74 20 73 22 Q70 19 66 21 Z;
                    M66 13 Q69 11 72 13 Q74 15 75 14 L75 22 Q74 20 72 21 Q69 19 66 21 Z"
            dur="3s" repeatCount="indefinite" />
        </path>
        {/* Red band */}
        <path d="M75 14 Q78 12 81 14 Q83 16 85 14 L85 22 Q83 20 81 22 Q78 20 75 22 Z"
          fill="url(#ch12_towerFlagRed)" opacity="0.6">
          <animate attributeName="d"
            values="M75 14 Q78 12 81 14 Q83 16 85 14 L85 22 Q83 20 81 22 Q78 20 75 22 Z;
                    M75 14 Q77 16 80 13 Q82 15 85 14 L85 22 Q82 24 80 21 Q77 23 75 22 Z;
                    M75 14 Q79 13 82 15 Q83 13 85 14 L85 22 Q83 21 82 23 Q79 20 75 22 Z;
                    M75 14 Q78 12 81 14 Q83 16 85 14 L85 22 Q83 20 81 22 Q78 20 75 22 Z"
            dur="3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* === RIGHT TOWER === */}
      <rect x="705" y="52" width="60" height="198" fill="url(#ch12_tower)" />
      <rect x="699" y="46" width="72" height="10" fill="#504a42" />
      <rect x="702" y="44" width="66" height="4" fill="#555048" />
      {/* Tower battlements */}
      <rect x="703" y="34" width="14" height="14" fill="#4a4540" />
      <rect x="725" y="34" width="14" height="14" fill="#4a4540" />
      <rect x="747" y="34" width="14" height="14" fill="#4a4540" />
      {/* Tower window */}
      <path d="M722 84 Q732 72 742 84 L742 108 L722 108 Z" fill="#12100c" />
      <path d="M722 84 Q732 72 742 84" fill="none" stroke="#555048" strokeWidth="1" />
      <line x1="732" y1="76" x2="732" y2="108" stroke="#3a3530" strokeWidth="0.8" />
      <rect x="725" y="144" width="14" height="10" fill="#12100c" rx="1" />
      {[70, 90, 110, 130, 150, 170, 190, 210, 230].map((y) => (
        <line key={`rt${y}`} x1="707" y1={y} x2="763" y2={y} stroke="#4a4538" strokeWidth="0.3" opacity="0.15" />
      ))}

      {/* === MAIN GATE — detailed arch === */}
      {/* Outer arch frame */}
      <path d="M335 250 Q400 178 465 250" fill="#302a25" />
      {/* Inner arch */}
      <path d="M342 250 Q400 185 458 250" fill="#12100c" />
      {/* Arch stones — voussoirs */}
      {Array.from({ length: 9 }, (_, i) => {
        const angle = Math.PI * (i / 8);
        const cx = 400;
        const cy = 215;
        const innerR = 56;
        const outerR = 65;
        const x1 = cx - Math.cos(angle) * innerR;
        const y1 = cy - Math.sin(angle) * innerR + 35;
        const x2 = cx - Math.cos(angle) * outerR;
        const y2 = cy - Math.sin(angle) * outerR + 35;
        return (
          <line key={`arch${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#4a4538" strokeWidth="0.5" opacity="0.25" />
        );
      })}
      {/* Keystone at top of arch */}
      <path d="M396 188 L404 188 L405 195 L395 195 Z" fill="#555048" opacity="0.4" />
      {/* Gate doors — heavy timber, swung open */}
      <path d="M342 250 L348 215 L355 213 L350 250 Z" fill="#2a2218" opacity="0.7" />
      <path d="M458 250 L452 215 L445 213 L450 250 Z" fill="#2a2218" opacity="0.7" />
      {/* Door iron bands */}
      <line x1="344" y1="230" x2="352" y2="228" stroke="#3a3835" strokeWidth="1" opacity="0.4" />
      <line x1="346" y1="242" x2="351" y2="241" stroke="#3a3835" strokeWidth="1" opacity="0.4" />
      <line x1="456" y1="230" x2="448" y2="228" stroke="#3a3835" strokeWidth="1" opacity="0.4" />
      <line x1="454" y1="242" x2="449" y2="241" stroke="#3a3835" strokeWidth="1" opacity="0.4" />

      {/* NEW: Distant Austrian prisoners — deeper inside the gate, barely visible */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const px = 396 + col * 8 - row * 1;
        const py = 232 - row * 8;
        return (
          <React.Fragment key={`dpris${i}`}>
            <circle cx={px} cy={py - 2} r={1.5} fill="#1e1e1c" opacity={0.2 - row * 0.04} />
            <rect x={px - 1} y={py - 1} width={2.5} height={5} fill="#1e1e1c" opacity={0.15 - row * 0.03} rx="0.5" />
          </React.Fragment>
        );
      })}

      {/* Gate shadow interior */}
      <ellipse cx="400" cy="235" rx="40" ry="20" fill="url(#ch12_gateShadow)" />

      {/* Atmospheric haze across upper wall */}
      <rect x="50" y="100" width="700" height="40" fill="url(#ch12_haze)" />

      {/* === GROUND === */}
      <path d="M0 250 Q100 247 200 249 Q300 251 400 250 Q500 248 600 250 Q700 249 800 250 L800 400 L0 400 Z"
        fill="url(#ch12_ground)" />

      {/* Frost shimmer on ground surface */}
      <rect x="0" y="248" width="800" height="6" fill="url(#ch12_frost)" />
      {/* Scattered frost patches */}
      <ellipse cx="130" cy="275" rx="35" ry="3" fill="#8095a5" opacity="0.04" />
      <ellipse cx="320" cy="310" rx="50" ry="4" fill="#8095a5" opacity="0.035" />
      <ellipse cx="580" cy="285" rx="40" ry="3" fill="#8095a5" opacity="0.04" />
      <ellipse cx="700" cy="330" rx="30" ry="2.5" fill="#8095a5" opacity="0.03" />
      <ellipse cx="200" cy="340" rx="45" ry="3" fill="#8095a5" opacity="0.035" />

      {/* Frozen puddle (original) */}
      <ellipse cx="480" cy="295" rx="20" ry="5" fill="#3a4550" opacity="0.12" />
      <ellipse cx="480" cy="294" rx="16" ry="3" fill="#4a5560" opacity="0.06" />

      {/* NEW: Additional frozen puddles reflecting grey sky */}
      {/* Puddle 2 — larger, near center road */}
      <ellipse cx="370" cy="320" rx="28" ry="6" fill="url(#ch12_iceReflect)" />
      <ellipse cx="370" cy="319" rx="22" ry="4" fill="#4a5868" opacity="0.08" />
      {/* Thin crack lines in ice */}
      <line x1="355" y1="320" x2="368" y2="318" stroke="#6a7888" strokeWidth="0.3" opacity="0.1" />
      <line x1="365" y1="322" x2="380" y2="319" stroke="#6a7888" strokeWidth="0.3" opacity="0.08" />

      {/* Puddle 3 — small, near left French soldiers */}
      <ellipse cx="220" cy="290" rx="14" ry="4" fill="url(#ch12_iceReflect)" />
      <ellipse cx="220" cy="289" rx="10" ry="2.5" fill="#4a5565" opacity="0.07" />

      {/* Puddle 4 — near supply wagon area */}
      <ellipse cx="120" cy="330" rx="18" ry="5" fill="url(#ch12_iceReflect)" />
      <ellipse cx="120" cy="329" rx="13" ry="3" fill="#4a5565" opacity="0.06" />
      <line x1="110" y1="330" x2="125" y2="328" stroke="#6a7888" strokeWidth="0.3" opacity="0.09" />

      {/* Puddle 5 — far right */}
      <ellipse cx="680" cy="310" rx="16" ry="4.5" fill="url(#ch12_iceReflect)" />
      <ellipse cx="680" cy="309" rx="12" ry="3" fill="#4a5868" opacity="0.07" />

      {/* Road from gate — worn path */}
      <path d="M365 250 Q372 275 368 300 Q360 335 355 370 Q352 388 350 400"
        fill="none" stroke="#252018" strokeWidth="32" opacity="0.25" />
      <path d="M435 250 Q428 275 432 300 Q440 335 445 370 Q448 388 450 400"
        fill="none" stroke="#252018" strokeWidth="32" opacity="0.25" />
      {/* Road center — trampled earth */}
      <path d="M400 255 Q398 290 400 330 Q402 370 400 400"
        fill="none" stroke="#201a12" strokeWidth="18" opacity="0.15" />

      {/* === NEW: DISCARDED AUSTRIAN MUSKETS — stacked pile by gate === */}
      <g opacity="0.45">
        {/* Stack of muskets leaning against each other near the right side of gate */}
        {/* Musket A — leaning left */}
        <line x1="455" y1="258" x2="465" y2="248" stroke="#3a3225" strokeWidth="2" />
        <circle cx="465" cy="248" r="0.8" fill="#4a4540" opacity="0.6" />
        {/* Musket B — leaning right */}
        <line x1="462" y1="258" x2="453" y2="246" stroke="#3a3225" strokeWidth="2" />
        {/* Musket C — crossing */}
        <line x1="450" y1="260" x2="468" y2="250" stroke="#3a3225" strokeWidth="1.8" />
        {/* Musket D — angled back */}
        <line x1="458" y1="260" x2="460" y2="244" stroke="#3a3225" strokeWidth="1.6" />
        {/* Musket E — resting flat */}
        <line x1="448" y1="260" x2="472" y2="257" stroke="#3a3225" strokeWidth="1.5" />
        {/* Bayonet tips glinting */}
        <circle cx="453" cy="246" r="0.6" fill="#6a6a70" opacity="0.3" />
        <circle cx="460" cy="244" r="0.6" fill="#6a6a70" opacity="0.25" />
        <circle cx="468" cy="250" r="0.5" fill="#6a6a70" opacity="0.2" />
        {/* Base shadow under pile */}
        <ellipse cx="458" cy="261" rx="12" ry="2.5" fill="#0a0808" opacity="0.2" />
      </g>

      {/* === SURRENDERING AUSTRIAN COLUMN — emerging from gate === */}
      {/* White-uniformed figures in pairs, heads bowed */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const baseX = 390 + col * 14 - row * 1;
        const baseY = 254 + row * 14;
        const opacity = 0.55 - row * 0.04;
        const scale = 1 - row * 0.03;
        return (
          <React.Fragment key={`aus${i}`}>
            {/* Body */}
            <path
              d={`M${baseX} ${baseY + 12 * scale} Q${baseX - 1} ${baseY + 4 * scale} ${baseX} ${baseY} Q${baseX + 2} ${baseY + 4 * scale} ${baseX + 4 * scale} ${baseY + 12 * scale} Z`}
              fill="#4a4a48" opacity={opacity}
            />
            {/* Head — bowed */}
            <circle cx={baseX + 1} cy={baseY - 2 * scale} r={2.8 * scale} fill="#4a4a48" opacity={opacity} />
          </React.Fragment>
        );
      })}

      {/* NEW: Austrian prisoner column — 6 hunched figures marching through the gate */}
      {/* These are larger/closer, on the road emerging toward viewer */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const px = 393 + col * 16 + row * 2;
        const py = 278 + row * 18;
        const sc = 1 + row * 0.06;
        const op = 0.6 + row * 0.04;
        return (
          <React.Fragment key={`pris${i}`}>
            {/* Hunched body — white Austrian uniform, dirty/worn */}
            <path
              d={`M${px} ${py + 14 * sc} Q${px - 2} ${py + 5 * sc} ${px - 1} ${py} Q${px + 2} ${py - 1} ${px + 4 * sc} ${py} Q${px + 5 * sc} ${py + 5 * sc} ${px + 4 * sc} ${py + 14 * sc} Z`}
              fill="#555550" opacity={op * 0.7}
            />
            {/* Head — bowed forward (dejected) */}
            <circle cx={px + 2 * sc} cy={py - 3 * sc} r={3 * sc} fill="#484845" opacity={op * 0.7} />
            {/* Hunched shoulders exaggerated */}
            <path
              d={`M${px - 1} ${py + 2} Q${px + 2} ${py - 1} ${px + 5 * sc} ${py + 2}`}
              fill="none" stroke="#4a4a45" strokeWidth={1.2 * sc} opacity={op * 0.4}
            />
          </React.Fragment>
        );
      })}

      {/* Figures still in gate shadow — barely visible */}
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={`gaus${i}`}>
          <circle cx={394 + (i % 2) * 10} cy={248 - Math.floor(i / 2) * 6} r={2}
            fill="#2a2a28" opacity={0.25} />
          <rect x={393 + (i % 2) * 10} y={249 - Math.floor(i / 2) * 6} width={3} height={6}
            fill="#2a2a28" opacity={0.2} />
        </React.Fragment>
      ))}

      {/* === DISCARDED AUSTRIAN WEAPONS ON GROUND === */}
      {/* Musket 1 — dropped near gate */}
      <line x1="360" y1="268" x2="380" y2="274" stroke="#3a3530" strokeWidth="1.5" opacity="0.4" />
      <circle cx="380" cy="274" r="1" fill="#3a3530" opacity="0.3" />
      {/* Musket 2 — angled */}
      <line x1="420" y1="275" x2="445" y2="270" stroke="#3a3530" strokeWidth="1.5" opacity="0.35" />
      {/* Musket 3 — further out */}
      <line x1="370" y1="290" x2="392" y2="288" stroke="#3a3530" strokeWidth="1.2" opacity="0.3" />
      {/* Sword / sabre */}
      <line x1="430" y1="282" x2="442" y2="278" stroke="#5a5855" strokeWidth="1" opacity="0.3" />
      <circle cx="430" cy="282" r="1.5" fill="#5a5855" opacity="0.25" />
      {/* Austrian shako (hat) */}
      <ellipse cx="415" cy="273" rx="4" ry="2.5" fill="#3a3a38" opacity="0.3" />
      <rect x="413" y="269" width="5" height="4" fill="#3a3a38" opacity="0.25" rx="1" />
      {/* Another hat further along */}
      <ellipse cx="385" cy="296" rx="3.5" ry="2" fill="#3a3a38" opacity="0.25" />

      {/* === BARE WINTER TREES === */}

      {/* Tree 1 — left, large */}
      <path d="M140 252 Q142 225 144 195 Q145 180 146 170" fill="none" stroke="#2a2822" strokeWidth="3" />
      <path d="M146 170 Q155 152 160 158" fill="none" stroke="#2a2822" strokeWidth="1.5" />
      <path d="M146 170 Q138 155 135 162" fill="none" stroke="#2a2822" strokeWidth="1.3" />
      <path d="M146 170 Q150 158 153 155 Q156 148 158 150" fill="none" stroke="#2a2822" strokeWidth="1" />
      <path d="M143 195 Q132 182 128 188" fill="none" stroke="#2a2822" strokeWidth="1" />
      <path d="M143 195 Q150 185 155 180 Q158 175 160 177" fill="none" stroke="#2a2822" strokeWidth="0.8" />
      <path d="M142 215 Q134 205 130 210" fill="none" stroke="#2a2822" strokeWidth="0.8" />
      <path d="M142 215 Q148 208 152 205" fill="none" stroke="#2a2822" strokeWidth="0.7" />
      {/* Root spread */}
      <path d="M138 252 Q132 254 128 253" fill="none" stroke="#2a2822" strokeWidth="1.5" opacity="0.5" />
      <path d="M144 252 Q150 254 154 253" fill="none" stroke="#2a2822" strokeWidth="1.2" opacity="0.4" />

      {/* Tree 2 — right side */}
      <path d="M660 250 Q662 222 664 195 Q665 182 666 175" fill="none" stroke="#2a2822" strokeWidth="2.5" />
      <path d="M666 175 Q672 160 676 166" fill="none" stroke="#2a2822" strokeWidth="1.2" />
      <path d="M666 175 Q658 162 655 168" fill="none" stroke="#2a2822" strokeWidth="1.1" />
      <path d="M666 175 Q670 163 673 158" fill="none" stroke="#2a2822" strokeWidth="0.8" />
      <path d="M663 200 Q654 190 650 195" fill="none" stroke="#2a2822" strokeWidth="0.9" />
      <path d="M663 200 Q670 192 674 188" fill="none" stroke="#2a2822" strokeWidth="0.7" />
      <path d="M662 220 Q656 214 652 218" fill="none" stroke="#2a2822" strokeWidth="0.7" />

      {/* Tree 3 — far left, smaller/more distant */}
      <path d="M60 253 Q62 235 63 220" fill="none" stroke="#252320" strokeWidth="1.8" opacity="0.6" />
      <path d="M63 220 Q68 210 70 214" fill="none" stroke="#252320" strokeWidth="0.8" opacity="0.6" />
      <path d="M63 220 Q58 212 56 216" fill="none" stroke="#252320" strokeWidth="0.7" opacity="0.6" />
      <path d="M62 235 Q56 228 54 232" fill="none" stroke="#252320" strokeWidth="0.6" opacity="0.5" />

      {/* Tree 4 — far right, stunted */}
      <path d="M740 252 Q742 238 743 225" fill="none" stroke="#252320" strokeWidth="1.5" opacity="0.55" />
      <path d="M743 225 Q748 218 750 222" fill="none" stroke="#252320" strokeWidth="0.7" opacity="0.55" />
      <path d="M743 225 Q738 219 736 223" fill="none" stroke="#252320" strokeWidth="0.6" opacity="0.5" />

      {/* === NEW: SUPPLY WAGON — near the French soldiers on left === */}
      <g>
        {/* Wagon body */}
        <rect x="100" y="278" width="50" height="18" fill="url(#ch12_wagonWood)" opacity="0.7" rx="1" />
        {/* Wagon side planks */}
        <line x1="100" y1="284" x2="150" y2="284" stroke="#2a2015" strokeWidth="0.6" opacity="0.4" />
        <line x1="100" y1="290" x2="150" y2="290" stroke="#2a2015" strokeWidth="0.6" opacity="0.4" />
        {/* Canvas cover — arched tarp over provisions */}
        <path d="M98 278 Q110 265 125 262 Q140 265 152 278" fill="url(#ch12_wagonCanvas)" opacity="0.6" />
        <path d="M98 278 Q110 265 125 262 Q140 265 152 278" fill="none" stroke="#35332a" strokeWidth="0.5" opacity="0.4" />
        {/* Canvas rope ties */}
        <line x1="108" y1="272" x2="108" y2="278" stroke="#3a3528" strokeWidth="0.5" opacity="0.35" />
        <line x1="125" y1="262" x2="125" y2="278" stroke="#3a3528" strokeWidth="0.5" opacity="0.3" />
        <line x1="142" y1="272" x2="142" y2="278" stroke="#3a3528" strokeWidth="0.5" opacity="0.35" />
        {/* Wagon tongue / shaft — extends forward */}
        <line x1="100" y1="288" x2="80" y2="294" stroke="#2a2018" strokeWidth="2" opacity="0.5" />
        <line x1="100" y1="292" x2="82" y2="297" stroke="#2a2018" strokeWidth="1.5" opacity="0.45" />
        {/* Left wheel */}
        <circle cx="108" cy="298" r="8" fill="none" stroke="#2a2018" strokeWidth="2" opacity="0.6" />
        <circle cx="108" cy="298" r="2" fill="#2a2018" opacity="0.5" />
        {/* Wheel spokes */}
        <line x1="108" y1="290" x2="108" y2="306" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="100" y1="298" x2="116" y2="298" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="102" y1="292" x2="114" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        <line x1="114" y1="292" x2="102" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        {/* Right wheel */}
        <circle cx="142" cy="298" r="8" fill="none" stroke="#2a2018" strokeWidth="2" opacity="0.6" />
        <circle cx="142" cy="298" r="2" fill="#2a2018" opacity="0.5" />
        <line x1="142" y1="290" x2="142" y2="306" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="134" y1="298" x2="150" y2="298" stroke="#2a2018" strokeWidth="0.8" opacity="0.4" />
        <line x1="136" y1="292" x2="148" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        <line x1="148" y1="292" x2="136" y2="304" stroke="#2a2018" strokeWidth="0.6" opacity="0.35" />
        {/* Provisions peeking out — sacks */}
        <ellipse cx="115" cy="277" rx="6" ry="3" fill="#3a3528" opacity="0.35" />
        <ellipse cx="130" cy="276" rx="5" ry="3.5" fill="#35302a" opacity="0.3" />
        {/* Ground shadow under wagon */}
        <ellipse cx="125" cy="306" rx="30" ry="4" fill="#0a0808" opacity="0.15" />
      </g>

      {/* === FRENCH SOLDIERS — worn but proud === */}

      {/* Soldier 1 — standing at attention, near left */}
      <path d="M210 240 Q208 226 210 218 Q212 212 214 218 L216 240 Q215 250 214 258 L210 258 Z"
        fill="#15120e" opacity="0.85" />
      <circle cx="212" cy="212" r="5" fill="#15120e" opacity="0.85" />
      {/* Shako silhouette */}
      <rect x="209" y="204" width="6" height="5" fill="#15120e" opacity="0.8" rx="0.5" />
      {/* Musket upright */}
      <line x1="218" y1="210" x2="220" y2="260" stroke="#15120e" strokeWidth="1.5" opacity="0.6" />
      {/* Bayonet */}
      <line x1="218" y1="210" x2="217" y2="203" stroke="#4a4a50" strokeWidth="0.8" opacity="0.4" />

      {/* Soldier 2 — standing, slightly turned */}
      <path d="M235 242 Q233 230 235 222 Q237 216 239 222 L241 242 Q240 252 239 260 L235 260 Z"
        fill="#15120e" opacity="0.8" />
      <circle cx="237" cy="216" r="4.8" fill="#15120e" opacity="0.8" />
      <rect x="234" y="208" width="6" height="5" fill="#15120e" opacity="0.75" rx="0.5" />

      {/* Soldier 3 — leaning on musket, fatigued */}
      <path d="M260 244 Q257 232 258 224 Q260 218 262 224 L264 242 Q263 250 262 260 L260 260 Z"
        fill="#15120e" opacity="0.78" />
      <circle cx="261" cy="218" r="4.5" fill="#15120e" opacity="0.78" />
      {/* Musket used as crutch — angled */}
      <line x1="256" y1="220" x2="252" y2="262" stroke="#15120e" strokeWidth="1.5" opacity="0.55" />

      {/* Soldier 4 — seated on ground, resting */}
      <path d="M555 268 Q553 258 555 250 Q557 258 559 268 Z" fill="#15120e" opacity="0.72" />
      <circle cx="556" cy="247" r="4.2" fill="#15120e" opacity="0.72" />
      {/* Outstretched legs */}
      <path d="M553 268 Q548 275 543 278" fill="none" stroke="#15120e" strokeWidth="2" opacity="0.5" />
      <path d="M557 268 Q562 275 567 276" fill="none" stroke="#15120e" strokeWidth="2" opacity="0.5" />

      {/* Soldier 5 — standing right side */}
      <path d="M580 240 Q578 228 580 220 Q582 214 584 220 L586 240 Q585 250 584 258 L580 258 Z"
        fill="#15120e" opacity="0.75" />
      <circle cx="582" cy="214" r="4.5" fill="#15120e" opacity="0.75" />
      <line x1="588" y1="212" x2="590" y2="260" stroke="#15120e" strokeWidth="1.3" opacity="0.5" />

      {/* Soldier 6 — standing, arms crossed */}
      <path d="M605 242 Q603 230 605 222 Q607 216 609 222 L611 242 Q610 250 609 258 L605 258 Z"
        fill="#15120e" opacity="0.73" />
      <circle cx="607" cy="216" r="4.3" fill="#15120e" opacity="0.73" />
      {/* Crossed arms suggestion */}
      <path d="M602 232 Q607 230 612 232" fill="none" stroke="#15120e" strokeWidth="2" opacity="0.45" />

      {/* Soldier 7 — foreground left, larger (closer to viewer) */}
      <path d="M170 270 Q167 252 170 240 Q173 232 176 240 L179 270 Q178 282 176 292 L170 292 Z"
        fill="#12100c" opacity="0.85" />
      <circle cx="173" cy="232" r="6" fill="#12100c" opacity="0.85" />
      <rect x="169" y="222" width="7" height="6" fill="#12100c" opacity="0.8" rx="0.5" />
      <line x1="181" y1="230" x2="184" y2="295" stroke="#12100c" strokeWidth="1.8" opacity="0.6" />

      {/* Soldier 8 — foreground right, back to viewer */}
      <path d="M630 272 Q627 254 630 244 Q633 236 636 244 L639 272 Q638 284 636 294 L630 294 Z"
        fill="#12100c" opacity="0.82" />
      <circle cx="633" cy="236" r="5.5" fill="#12100c" opacity="0.82" />
      <rect x="630" y="227" width="6" height="6" fill="#12100c" opacity="0.78" rx="0.5" />

      {/* === DRUMMER BOY — small figure with drum === */}
      <path d="M290 248 Q288 238 290 232 Q291 228 293 232 L295 248 Q294 255 293 260 L290 260 Z"
        fill="#15120e" opacity="0.78" />
      <circle cx="292" cy="228" r="3.8" fill="#15120e" opacity="0.78" />
      {/* Drum — cylindrical shape at side */}
      <ellipse cx="298" cy="242" rx="5" ry="4" fill="#3a2a1a" opacity="0.5" />
      <ellipse cx="298" cy="240" rx="5" ry="3" fill="#4a3a28" opacity="0.45" />
      {/* Drumstick */}
      <line x1="296" y1="235" x2="302" y2="240" stroke="#4a4038" strokeWidth="0.8" opacity="0.4" />

      {/* === NEW: DOG — small shape near the French line === */}
      <g opacity="0.6">
        {/* Dog body — small scrappy camp dog trotting alongside soldiers */}
        <path d="M302 275 Q308 272 314 274 Q316 275 315 278 L304 278 Q302 277 302 275 Z"
          fill="#1e1a15" />
        {/* Head */}
        <ellipse cx="316" cy="273" rx="3" ry="2.5" fill="#1e1a15" />
        {/* Ear */}
        <path d="M317 271 Q319 269 318 272" fill="#1e1a15" />
        {/* Snout */}
        <ellipse cx="319" cy="274" rx="1.5" ry="1" fill="#252018" />
        {/* Front legs */}
        <line x1="313" y1="278" x2="312" y2="284" stroke="#1e1a15" strokeWidth="1" />
        <line x1="315" y1="278" x2="316" y2="284" stroke="#1e1a15" strokeWidth="1" />
        {/* Back legs */}
        <line x1="304" y1="278" x2="303" y2="284" stroke="#1e1a15" strokeWidth="1" />
        <line x1="306" y1="278" x2="307" y2="284" stroke="#1e1a15" strokeWidth="1" />
        {/* Tail — up and slightly curled */}
        <path d="M302 275 Q298 271 299 268" fill="none" stroke="#1e1a15" strokeWidth="0.8" />
      </g>

      {/* === OFFICER ON HORSEBACK — silhouette, behind soldiers === */}
      {/* Horse body */}
      <path d="M490 220 Q500 215 510 218 Q520 220 525 225 L528 240 Q525 248 520 250 L515 250 Q510 248 505 250 L500 250 Q495 248 490 250 L488 245 Q485 235 488 225 Z"
        fill="#12100c" opacity="0.6" />
      {/* Horse legs */}
      <line x1="493" y1="250" x2="491" y2="265" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      <line x1="500" y1="250" x2="498" y2="264" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      <line x1="515" y1="250" x2="517" y2="265" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      <line x1="522" y1="250" x2="524" y2="264" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      {/* Horse head/neck */}
      <path d="M525 225 Q535 215 540 210 Q542 208 540 212 Q538 216 535 220"
        fill="none" stroke="#12100c" strokeWidth="2.5" opacity="0.6" />
      {/* Horse tail */}
      <path d="M488 225 Q482 228 478 232" fill="none" stroke="#12100c" strokeWidth="1.5" opacity="0.45" />
      {/* Rider — officer */}
      <path d="M505 220 Q503 208 505 200 Q507 195 509 200 L511 218"
        fill="#12100c" opacity="0.6" />
      <circle cx="507" cy="195" r="4.5" fill="#12100c" opacity="0.6" />
      {/* Bicorne hat silhouette */}
      <path d="M501 193 Q507 189 513 193" fill="none" stroke="#12100c" strokeWidth="2" opacity="0.55" />
      {/* Raised arm / sword */}
      <line x1="510" y1="205" x2="518" y2="195" stroke="#12100c" strokeWidth="1.2" opacity="0.5" />
      <line x1="518" y1="195" x2="520" y2="188" stroke="#5a5a5a" strokeWidth="0.8" opacity="0.35" />

      {/* === FRENCH TRICOLOR FLAG — detailed === */}
      <line x1="242" y1="214" x2="242" y2="172" stroke="#2a2520" strokeWidth="2" />
      {/* Flag pole finial */}
      <circle cx="242" cy="171" r="2" fill="#5a5550" opacity="0.5" />
      {/* Blue stripe */}
      <path d="M242 174 Q250 176 255 174 Q258 178 260 182 Q255 184 248 182 Q242 186 242 186 Z"
        fill="url(#ch12_flagBlue)" opacity="0.55" />
      {/* White stripe */}
      <path d="M255 174 Q260 176 265 174 Q268 178 270 182 Q265 184 258 182 Q255 184 255 184 Z"
        fill="#7a7a78" opacity="0.4" />
      {/* Red stripe */}
      <path d="M265 174 Q272 176 278 175 Q280 179 282 183 Q276 185 270 183 Q265 184 265 184 Z"
        fill="url(#ch12_flagRed)" opacity="0.5" />
      {/* Flag ripple shadow */}
      <path d="M248 178 Q255 177 262 179 Q270 178 278 179" fill="none" stroke="#000" strokeWidth="0.3" opacity="0.15" />

      {/* === SNOW / FROST PARTICLES === */}
      {/* Scattered white dots — falling snow and frost motes */}
      {[
        [80, 60], [150, 30], [220, 80], [310, 45], [400, 25], [480, 70],
        [560, 40], [640, 55], [720, 35], [45, 120], [180, 100], [350, 90],
        [520, 110], [670, 95], [760, 130], [100, 160], [270, 140], [430, 155],
        [590, 145], [700, 170], [130, 200], [300, 180], [470, 195], [620, 185],
        [50, 260], [200, 280], [340, 270], [500, 290], [650, 275], [750, 260],
        [120, 310], [280, 330], [440, 315], [600, 340], [730, 320],
        [90, 355], [250, 370], [400, 360], [550, 375], [690, 365],
      ].map(([x, y], i) => (
        <circle key={`snow${i}`} cx={x} cy={y} r={0.6 + (i % 3) * 0.3}
          fill="#c0c8d0" opacity={0.08 + (i % 4) * 0.02} filter="url(#ch12_snowGlow)" />
      ))}

      {/* Larger frost motes — fewer, brighter */}
      {[
        [190, 50], [420, 38], [640, 65], [100, 130], [530, 120], [360, 200],
      ].map(([x, y], i) => (
        <circle key={`frost${i}`} cx={x} cy={y} r={1 + (i % 2) * 0.4}
          fill="#d0d8e0" opacity={0.06 + (i % 3) * 0.015} filter="url(#ch12_snowGlow)" />
      ))}

      {/* NEW: Animated snow flurry — drifting snowflakes with movement */}
      {[
        { x: 120, y: 40, dur: '6s', r: 1.2, cls: 'ch12_snowDrift1' },
        { x: 280, y: 20, dur: '7s', r: 1.0, cls: 'ch12_snowDrift2' },
        { x: 450, y: 50, dur: '8s', r: 1.3, cls: 'ch12_snowDrift3' },
        { x: 600, y: 30, dur: '6.5s', r: 1.1, cls: 'ch12_snowDrift1' },
        { x: 200, y: 70, dur: '7.5s', r: 0.9, cls: 'ch12_snowDrift2' },
        { x: 500, y: 15, dur: '9s', r: 1.4, cls: 'ch12_snowDrift3' },
        { x: 700, y: 45, dur: '6s', r: 1.0, cls: 'ch12_snowDrift1' },
        { x: 350, y: 60, dur: '8s', r: 1.2, cls: 'ch12_snowDrift2' },
        { x: 50, y: 35, dur: '7s', r: 1.1, cls: 'ch12_snowDrift3' },
        { x: 660, y: 10, dur: '8.5s', r: 1.3, cls: 'ch12_snowDrift1' },
        { x: 160, y: 90, dur: '7.5s', r: 0.8, cls: 'ch12_snowDrift2' },
        { x: 540, y: 75, dur: '9s', r: 1.0, cls: 'ch12_snowDrift3' },
      ].map((flake, i) => (
        <circle
          key={`flurry${i}`}
          cx={flake.x}
          cy={flake.y}
          r={flake.r}
          fill="#d0d8e8"
          opacity="0.12"
          style={{
            animation: `${flake.cls} ${flake.dur} ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      {/* === ATMOSPHERIC OVERLAYS === */}

      {/* Low ground fog / mist */}
      <ellipse cx="200" cy="258" rx="150" ry="12" fill="#3a4048" opacity="0.06" />
      <ellipse cx="550" cy="260" rx="180" ry="14" fill="#3a4048" opacity="0.05" />
      <ellipse cx="400" cy="265" rx="120" ry="10" fill="#3a4048" opacity="0.04" />

      {/* Breath / smoke wisps near soldiers (original) */}
      <ellipse cx="220" cy="210" rx="8" ry="3" fill="#5a6068" opacity="0.06" />
      <ellipse cx="570" cy="245" rx="6" ry="2.5" fill="#5a6068" opacity="0.05" />

      {/* NEW: Animated breath vapor — visible in cold air from closest soldiers */}
      {/* Breath from Soldier 7 (foreground left, closest) */}
      <g>
        <ellipse cx="180" cy="228" rx="6" ry="3" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 3.5s ease-out infinite' }} />
        <ellipse cx="182" cy="226" rx="4" ry="2" fill="#7a8590" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 3.5s ease-out infinite', animationDelay: '0.3s' }} />
      </g>
      {/* Breath from Soldier 8 (foreground right) */}
      <g>
        <ellipse cx="640" cy="232" rx="5" ry="2.5" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 4s ease-out infinite', animationDelay: '1.5s' }} />
        <ellipse cx="638" cy="230" rx="3.5" ry="1.8" fill="#7a8590" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 4s ease-out infinite', animationDelay: '1.8s' }} />
      </g>
      {/* Breath from Soldier 1 */}
      <g>
        <ellipse cx="218" cy="209" rx="4" ry="2" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 4.5s ease-out infinite', animationDelay: '0.8s' }} />
      </g>
      {/* Breath from Soldier 5 (right standing) */}
      <g>
        <ellipse cx="588" cy="211" rx="4" ry="2" fill="#6a7580" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse2 4s ease-out infinite', animationDelay: '2.2s' }} />
      </g>
      {/* Breath from horse */}
      <g>
        <ellipse cx="544" cy="208" rx="5" ry="2.5" fill="#5a6570" filter="url(#ch12_breathBlur)"
          style={{ animation: 'ch12_breathPulse1 3s ease-out infinite', animationDelay: '0.5s' }} />
      </g>

      {/* Cold blue atmospheric wash */}
      <rect x="0" y="0" width="800" height="400" fill="#2a3545" opacity="0.04" />

      {/* Bottom darkness — frozen ground fade */}
      <rect x="0" y="360" width="800" height="40" fill="#0a0a0c" opacity="0.35" />
      <rect x="0" y="385" width="800" height="15" fill="#0a0a0c" opacity="0.25" />

      {/* Radial vignette — final overlay */}
      <rect x="0" y="0" width="800" height="400" fill="url(#ch12_vignette)" />
    </svg>
  );
}
