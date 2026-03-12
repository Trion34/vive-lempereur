import React from 'react';

/**
 * Ch.5 — Milan, urban garrison (May 1796)
 * Summer night in a grand piazza. The Army of Italy occupies Milan —
 * the first major European capital most of these soldiers have ever seen.
 * Renaissance architecture, warm lamplight, fountain, soldiers sleeping
 * among columns. Mood: Wonder, warmth, the grandeur of conquest.
 */
export function Ch5MilanScene() {
  const leftWindows = [18, 48, 78, 108, 138];
  const rightWindows = [582, 612, 642, 672, 702, 732];
  const rows = [0, 1, 2];
  const stars = [
    { cx: 55, cy: 18, r: 0.7, o: 0.45, d: 4.2 }, { cx: 130, cy: 28, r: 0.9, o: 0.55, d: 3.8 },
    { cx: 210, cy: 12, r: 0.6, o: 0.4, d: 5.0 }, { cx: 280, cy: 38, r: 0.8, o: 0.5, d: 4.5 },
    { cx: 340, cy: 8, r: 0.5, o: 0.35, d: 3.5 }, { cx: 400, cy: 22, r: 1.0, o: 0.6, d: 4.8 },
    { cx: 465, cy: 32, r: 0.6, o: 0.4, d: 5.2 }, { cx: 520, cy: 14, r: 0.8, o: 0.5, d: 3.6 },
    { cx: 590, cy: 40, r: 0.7, o: 0.45, d: 4.0 }, { cx: 650, cy: 10, r: 0.9, o: 0.55, d: 4.3 },
    { cx: 710, cy: 30, r: 0.5, o: 0.35, d: 5.5 }, { cx: 760, cy: 20, r: 0.7, o: 0.4, d: 3.9 },
    { cx: 95, cy: 50, r: 0.4, o: 0.3, d: 4.7 }, { cx: 370, cy: 48, r: 0.5, o: 0.3, d: 5.1 },
    { cx: 490, cy: 5, r: 0.6, o: 0.35, d: 4.4 }, { cx: 175, cy: 55, r: 0.4, o: 0.25, d: 5.3 },
    { cx: 42, cy: 42, r: 0.5, o: 0.32, d: 4.9 }, { cx: 300, cy: 15, r: 0.7, o: 0.42, d: 3.7 },
    { cx: 620, cy: 25, r: 0.55, o: 0.38, d: 5.4 }, { cx: 745, cy: 48, r: 0.45, o: 0.28, d: 4.1 },
  ];
  const laundryItems = [
    { x: 163, sag: 5, w: 0.8, c: '#5a5550' },
    { x: 168, sag: 6, w: 0.9, c: '#6a6055' },
    { x: 173, sag: 4, w: 0.7, c: '#504a45' },
  ];
  const laundryItems2 = [
    { x: 548, sag: 6, w: 0.8, c: '#5a5550' },
    { x: 554, sag: 5, w: 0.7, c: '#6a6055' },
    { x: 560, sag: 5, w: 0.9, c: '#504a45' },
  ];

  return (
    <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ch5_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06081a" />
          <stop offset="15%" stopColor="#0c1028" />
          <stop offset="40%" stopColor="#141830" />
          <stop offset="70%" stopColor="#1c1e38" />
          <stop offset="100%" stopColor="#221e35" />
        </linearGradient>
        <linearGradient id="ch5_bldgLeft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3530" />
          <stop offset="100%" stopColor="#2e2822" />
        </linearGradient>
        <linearGradient id="ch5_bldgRight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#383228" />
          <stop offset="100%" stopColor="#2c2620" />
        </linearGradient>
        <linearGradient id="ch5_bldgCenter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4035" />
          <stop offset="100%" stopColor="#3a3028" />
        </linearGradient>
        <linearGradient id="ch5_ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2520" />
          <stop offset="50%" stopColor="#221e1a" />
          <stop offset="100%" stopColor="#181512" />
        </linearGradient>
        <radialGradient id="ch5_lampGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d4a050" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#c89045" stopOpacity="0.2" />
          <stop offset="70%" stopColor="#b88035" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#b08030" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ch5_lampGlowSmall" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d0a050" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#c09045" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c09045" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ch5_fireGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d08040" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#c07030" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c07030" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ch5_moonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0b888" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#a0a080" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#a0a080" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ch5_waterShimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a4555" stopOpacity="0" />
          <stop offset="50%" stopColor="#506070" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3a4555" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ch5_vignette" cx="0.5" cy="0.5" r="0.7">
          <stop offset="40%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0505" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="ch5_warmOverlay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0a050" stopOpacity="0" />
          <stop offset="60%" stopColor="#c09040" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#c08030" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id="ch5_torchGlow" cx="0.5" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="#d4a050" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#c08535" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b07025" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ch5_cardGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c09050" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#b08040" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a07030" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ch5_warmAir" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#d0a050" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#d0a050" stopOpacity="0" />
        </linearGradient>
        {/* Moon reflection shimmer gradient */}
        <radialGradient id="ch5_moonReflect" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#c0c090" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#a0a070" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a0a070" stopOpacity="0" />
        </radialGradient>
        {/* Iron gate pattern */}
        <pattern id="ch5_ironGatePattern" x="0" y="0" width="8" height="20" patternUnits="userSpaceOnUse">
          <line x1="4" y1="0" x2="4" y2="20" stroke="#3a3530" strokeWidth="0.8" opacity="0.5" />
          <circle cx="4" cy="5" r="1.5" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.4" />
          <circle cx="4" cy="15" r="1.5" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.4" />
          <path d="M0 10 Q4 7 8 10" fill="none" stroke="#3a3530" strokeWidth="0.4" opacity="0.35" />
        </pattern>
      </defs>

      {/* === NIGHT SKY === */}
      <rect width="800" height="400" fill="url(#ch5_sky)" />

      {/* Warm air shimmer — subtle heat rising from the piazza */}
      <rect x="165" y="260" width="393" height="50" fill="url(#ch5_warmAir)">
        <animate attributeName="y" values="260;255;260" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="6s" repeatCount="indefinite" />
      </rect>

      {/* Twinkling stars */}
      {stars.map((s, i) => (
        <circle key={`s${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="#c0b898" opacity={s.o}>
          <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o * 0.7};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Bright planets — Venus low on the horizon */}
      <circle cx="155" cy="62" r="1.2" fill="#d0c890" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.4;0.5" dur="7s" repeatCount="indefinite" />
      </circle>

      {/* Warm crescent moon */}
      <ellipse cx="680" cy="45" rx="40" ry="40" fill="url(#ch5_moonGlow)" />
      <circle cx="680" cy="45" r="12" fill="#c8c090" opacity="0.15" />
      <circle cx="685" cy="43" r="10" fill="#06081a" opacity="0.9" />
      <ellipse cx="680" cy="45" rx="22" ry="22" fill="#c0b888" opacity="0.04" />

      {/* === DISTANT DUOMO SILHOUETTE — Milan Cathedral skyline === */}
      {/* Main dome */}
      <path d="M360 90 Q380 55 400 48 Q420 55 440 90" fill="#161420" opacity="0.8" />
      {/* Lantern and cross atop dome */}
      <rect x="396" y="42" width="8" height="10" fill="#161420" opacity="0.7" />
      <path d="M396 42 L400 35 L404 42" fill="#161420" opacity="0.7" />
      <line x1="400" y1="30" x2="400" y2="36" stroke="#2a2530" strokeWidth="1" opacity="0.6" />
      <line x1="397" y1="33" x2="403" y2="33" stroke="#2a2530" strokeWidth="1" opacity="0.6" />
      {/* Dome ribs */}
      <path d="M375 82 Q388 60 400 50" fill="none" stroke="#1e1a28" strokeWidth="0.5" opacity="0.4" />
      <path d="M425 82 Q412 60 400 50" fill="none" stroke="#1e1a28" strokeWidth="0.5" opacity="0.4" />
      <path d="M385 86 Q393 65 400 52" fill="none" stroke="#1e1a28" strokeWidth="0.4" opacity="0.3" />
      <path d="M415 86 Q407 65 400 52" fill="none" stroke="#1e1a28" strokeWidth="0.4" opacity="0.3" />
      {/* Gothic spires flanking the dome */}
      <path d="M350 90 L352 70 L354 90" fill="#141220" opacity="0.65" />
      <line x1="352" y1="65" x2="352" y2="70" stroke="#1e1a28" strokeWidth="0.6" opacity="0.5" />
      <path d="M446 90 L448 72 L450 90" fill="#141220" opacity="0.65" />
      <line x1="448" y1="67" x2="448" y2="72" stroke="#1e1a28" strokeWidth="0.6" opacity="0.5" />
      {/* Additional spires — the forest of pinnacles */}
      <path d="M362 88 L363.5 76 L365 88" fill="#151320" opacity="0.5" />
      <path d="M435 88 L436.5 77 L438 88" fill="#151320" opacity="0.5" />
      <path d="M344 90 L345 82 L346 90" fill="#131120" opacity="0.45" />
      <path d="M454 90 L455 83 L456 90" fill="#131120" opacity="0.45" />
      {/* Distant rooftop silhouettes flanking */}
      <rect x="320" y="86" width="30" height="8" fill="#141220" opacity="0.5" />
      <rect x="450" y="87" width="25" height="7" fill="#141220" opacity="0.45" />

      {/* === CHURCH BELL SILHOUETTE — visible in a bell tower spire === */}
      {/* Bell arch opening in the leftmost spire */}
      <path d="M349 82 Q352 78 355 82" fill="#0e0c18" opacity="0.6" />
      {/* Bell shape — dark silhouette hanging inside */}
      <path d="M351 79 Q352 77 353 79 L353.5 81 L350.5 81 Z" fill="#1a1828" opacity="0.7" />
      {/* Bell clapper — tiny line */}
      <line x1="352" y1="79.5" x2="352" y2="81" stroke="#1a1828" strokeWidth="0.4" opacity="0.6" />
      {/* Second bell in the right spire */}
      <path d="M447 84 Q449 80 451 84" fill="#0e0c18" opacity="0.55" />
      <path d="M448 81 Q449 79 450 81 L450.3 83 L447.7 83 Z" fill="#1a1828" opacity="0.65" />

      {/* === LEFT PALAZZO === */}
      <rect x="0" y="75" width="165" height="325" fill="url(#ch5_bldgLeft)" />
      {/* Decorative cornice along roofline */}
      <rect x="0" y="72" width="165" height="5" fill="#4a4540" />
      <rect x="0" y="70" width="165" height="2" fill="#554e48" opacity="0.5" />
      {/* Dentil moulding */}
      {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155].map((x) => (
        <rect key={`dL${x}`} x={x} y="68" width="4" height="2" fill="#4a4540" opacity="0.4" />
      ))}
      {/* Triangular pediments */}
      {[20, 55, 90, 125].map((x) => (
        <path key={`fL${x}`} d={`M${x} 72 L${x + 4} 62 L${x + 8} 72`} fill="#4a4540" opacity="0.8" />
      ))}

      {/* === PIGEONS ROOSTING — on left palazzo cornice === */}
      {/* Pigeon 1 — sitting on cornice near pediment */}
      <ellipse cx="42" cy="67" rx="2.5" ry="1.5" fill="#2a2520" opacity="0.55" />
      <circle cx="40.5" cy="65.8" r="1.2" fill="#2a2520" opacity="0.55" />
      <path d="M44 67 L46 66.5 L45 67.5" fill="#2a2520" opacity="0.45" />
      {/* Pigeon 2 — slightly hunched, roosting */}
      <ellipse cx="108" cy="67" rx="2.2" ry="1.4" fill="#282320" opacity="0.5" />
      <circle cx="106.5" cy="65.5" r="1.1" fill="#282320" opacity="0.5" />
      <path d="M110 67 L111.5 66.2 L111 67.3" fill="#282320" opacity="0.4" />
      {/* Pigeon 3 — on right palazzo cornice */}
      <ellipse cx="620" cy="77" rx="2.3" ry="1.5" fill="#2a2520" opacity="0.5" />
      <circle cx="618.5" cy="75.8" r="1.1" fill="#2a2520" opacity="0.5" />
      <path d="M622 77 L623.5 76.5 L623 77.5" fill="#2a2520" opacity="0.4" />
      {/* Pigeon 4 — tucked in near right pediment */}
      <ellipse cx="740" cy="77" rx="2" ry="1.3" fill="#252018" opacity="0.45" />
      <circle cx="738.5" cy="75.8" r="1" fill="#252018" opacity="0.45" />

      {/* Arched windows — 3 rows x 5 columns */}
      {rows.map((row) => (
        <React.Fragment key={`lR${row}`}>
          {leftWindows.map((x) => {
            const y = 105 + row * 65;
            const op = row === 0 && (x === 48 || x === 108) ? 0.3 : row === 1 && x === 78 ? 0.25 : 0.1 + row * 0.03;
            return (
              <React.Fragment key={`lw${row}${x}`}>
                {/* Ornate window frame */}
                <rect x={x - 1} y={y - 1} width="18" height="27" fill="#3a3530" opacity="0.4" rx="1" />
                <rect x={x} y={y} width="16" height="24" fill="#1a1518" rx="2" />
                <path d={`M${x} ${y + 2} Q${x + 8} ${y - 4} ${x + 16} ${y + 2}`} fill="#1a1518" />
                {/* Keystone at arch top */}
                <rect x={x + 6} y={y - 4} width="4" height="4" fill="#4a4540" opacity="0.3" />
                <rect x={x + 2} y={y + 2} width="12" height="20" fill="#c09050" opacity={op} rx="1">
                  <animate attributeName="opacity" values={`${op};${op * 0.4};${op}`} dur={`${3 + (x % 5) + row}s`} repeatCount="indefinite" />
                </rect>
                <line x1={x + 8} y1={y + 2} x2={x + 8} y2={y + 24} stroke="#2a2520" strokeWidth="0.6" opacity="0.5" />
                {/* Horizontal mullion */}
                <line x1={x + 2} y1={y + 13} x2={x + 14} y2={y + 13} stroke="#2a2520" strokeWidth="0.4" opacity="0.35" />
                {/* Window sill */}
                <rect x={x - 1} y={y + 24} width="18" height="2" fill="#4a4540" opacity="0.35" />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      {/* Ornate balcony with iron railing and flower pots */}
      <rect x="10" y="168" width="145" height="3" fill="#5a5045" />
      {/* Iron railing with decorative curls */}
      {[18, 38, 58, 78, 98, 118, 138].map((x) => (
        <React.Fragment key={`bL${x}`}>
          <line x1={x} y1="168" x2={x} y2="162" stroke="#4a4540" strokeWidth="0.8" opacity="0.5" />
          {/* Small scroll ornament between rails */}
          {x < 138 && (
            <path d={`M${x + 3} 165 Q${x + 10} 162 ${x + 17} 165`} fill="none" stroke="#4a4540" strokeWidth="0.4" opacity="0.3" />
          )}
        </React.Fragment>
      ))}
      <line x1="10" y1="162" x2="155" y2="162" stroke="#4a4540" strokeWidth="0.6" opacity="0.5" />
      <rect x="60" y="163" width="8" height="5" fill="#5a3028" opacity="0.5" rx="1" />
      <ellipse cx="64" cy="161" rx="6" ry="3" fill="#2a4020" opacity="0.4" />
      <circle cx="62" cy="160" r="1.2" fill="#c06050" opacity="0.3" />
      <circle cx="66" cy="160" r="1" fill="#c06050" opacity="0.25" />
      {/* Second flower pot */}
      <rect x="110" y="163" width="7" height="5" fill="#5a3028" opacity="0.4" rx="1" />
      <ellipse cx="113.5" cy="161" rx="5" ry="2.5" fill="#2a4020" opacity="0.35" />
      <circle cx="112" cy="160" r="1" fill="#d08050" opacity="0.2" />

      {/* === POTTED PLANTS — terracotta pots on balconies (Mediterranean detail) === */}
      {/* Third flower pot on left balcony — near railing edge */}
      <rect x="28" y="163" width="7" height="5" fill="#6a3828" opacity="0.45" rx="1" />
      <ellipse cx="31.5" cy="161" rx="5" ry="2.8" fill="#2a4520" opacity="0.38" />
      <circle cx="30" cy="160" r="0.9" fill="#e07050" opacity="0.22" />
      <circle cx="33" cy="159.5" r="0.7" fill="#e07050" opacity="0.18" />
      {/* Potted plant on center-right building balcony */}
      <rect x="497" y="155.5" width="6" height="4.5" fill="#6a3828" opacity="0.4" rx="1" />
      <ellipse cx="500" cy="153.5" rx="4.5" ry="2.5" fill="#2a4520" opacity="0.32" />
      <circle cx="499" cy="152.5" r="0.8" fill="#d06050" opacity="0.2" />
      {/* Hanging trailing plant from left palazzo third-row sill */}
      <path d="M50 300 Q48 306 50 312 Q52 316 50 320" fill="none" stroke="#2a4020" strokeWidth="0.6" opacity="0.2" />
      <path d="M53 300 Q55 308 53 314" fill="none" stroke="#2a4020" strokeWidth="0.5" opacity="0.18" />

      {/* === WALL TORCH — left palazzo === */}
      <rect x="155" y="245" width="3" height="12" fill="#3a3028" opacity="0.5" />
      <rect x="153" y="242" width="7" height="4" fill="#4a4038" opacity="0.5" rx="1" />
      <ellipse cx="156.5" cy="240" rx="3" ry="4" fill="#d09030" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.12;0.18;0.2" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="156.5" cy="245" rx="12" ry="10" fill="url(#ch5_torchGlow)">
        <animate attributeName="opacity" values="1;0.7;0.85;1" dur="2.2s" repeatCount="indefinite" />
      </ellipse>

      {/* === RIGHT PALAZZO — with ground-level arcade === */}
      <rect x="560" y="85" width="240" height="315" fill="url(#ch5_bldgRight)" />
      {/* Decorative cornice */}
      <rect x="560" y="82" width="240" height="5" fill="#4a4540" />
      <rect x="560" y="80" width="240" height="2" fill="#504a44" opacity="0.45" />
      {/* Dentil moulding */}
      {[565, 580, 595, 610, 625, 640, 655, 670, 685, 700, 715, 730, 745, 760, 775, 790].map((x) => (
        <rect key={`dR${x}`} x={x} y="78" width="4" height="2" fill="#4a4540" opacity="0.35" />
      ))}
      {[575, 615, 655, 695, 735].map((x) => (
        <path key={`fR${x}`} d={`M${x} 82 L${x + 5} 70 L${x + 10} 82`} fill="#4a4540" opacity="0.7" />
      ))}
      {/* Windows — 3 rows x 6 columns with ornate frames */}
      {rows.map((row) => (
        <React.Fragment key={`rR${row}`}>
          {rightWindows.map((x) => {
            const y = 110 + row * 55;
            const op = row === 0 && x === 642 ? 0.28 : row === 1 && x === 702 ? 0.22 : 0.08 + row * 0.02;
            return (
              <React.Fragment key={`rw${row}${x}`}>
                <rect x={x - 1} y={y - 1} width="16" height="23" fill="#3a3228" opacity="0.35" rx="1" />
                <rect x={x} y={y} width="14" height="20" fill="#1a1518" rx="1" />
                <path d={`M${x} ${y + 2} Q${x + 7} ${y - 3} ${x + 14} ${y + 2}`} fill="#1a1518" />
                <rect x={x + 2} y={y + 2} width="10" height="16" fill="#c09050" opacity={op} rx="1">
                  <animate attributeName="opacity" values={`${op};${op * 0.35};${op}`} dur={`${3.5 + (x % 4) + row * 0.5}s`} repeatCount="indefinite" />
                </rect>
                {/* Sill */}
                <rect x={x - 1} y={y + 20} width="16" height="1.5" fill="#4a4540" opacity="0.3" />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      {/* One window going dark */}
      <rect x="644" y="112" width="10" height="16" fill="#c09050" opacity="0.28" rx="1">
        <animate attributeName="opacity" values="0.28;0.28;0.28;0.05;0.05;0.05" dur="20s" repeatCount="indefinite" />
      </rect>

      {/* === CIVILIAN IN WINDOW — watching soldiers from above === */}
      {/* Upper-right palazzo, second row window */}
      <rect x="704" y="167" width="10" height="14" fill="#c09050" opacity="0.2" rx="1" />
      {/* Small silhouette figure peering out */}
      <circle cx="709" cy="172" r="2" fill="#1a1518" opacity="0.7" />
      <rect x="707" y="174" width="4" height="6" fill="#1a1518" opacity="0.6" />
      {/* Arm resting on sill */}
      <line x1="706" y1="176" x2="704" y2="178" stroke="#1a1518" strokeWidth="1.2" opacity="0.5" />

      {/* === CIVILIAN IN DOORWAY — left palazzo ground level === */}
      {/* Doorway recess */}
      <rect x="85" y="340" width="18" height="40" fill="#151210" opacity="0.8" />
      {/* Figure standing in doorway, partially hidden */}
      <path d="M92 348 Q91 340 92 334 Q93 330 94 334 L95 348 Z" fill="#1a1815" opacity="0.65" />
      <circle cx="93" cy="330" r="3" fill="#1a1815" opacity="0.65" />
      {/* Skirt/dress hem */}
      <path d="M90 348 Q93 350 96 348 L97 360 L89 360 Z" fill="#1a1815" opacity="0.5" />

      {/* === MORE ITALIAN CIVILIANS === */}
      {/* Woman with shawl — standing near left palazzo watching the piazza */}
      <path d="M130 340 Q128 330 130 322 Q132 316 134 322 L136 340 Z" fill="#1a1815" opacity="0.6" />
      <circle cx="132" cy="316" r="3.5" fill="#1a1815" opacity="0.6" />
      {/* Shawl draped over shoulders */}
      <path d="M128 320 Q132 318 136 320 Q138 326 136 330" fill="none" stroke="#2a2520" strokeWidth="1.2" opacity="0.4" />
      <path d="M128 320 Q126 326 128 330" fill="none" stroke="#2a2520" strokeWidth="1.2" opacity="0.4" />
      {/* Skirt flowing down */}
      <path d="M128 340 Q132 342 136 340 L138 360 L126 360 Z" fill="#1a1815" opacity="0.45" />

      {/* Old man with cane — sitting on steps near right arcade */}
      <path d="M655 330 Q653 322 655 316 Q657 312 659 316 L660 328 Z" fill="#181510" opacity="0.6" />
      <circle cx="657" cy="311" r="3.5" fill="#181510" opacity="0.6" />
      {/* Hunched posture — leaning forward */}
      <path d="M655 328 Q658 335 662 340" fill="none" stroke="#181510" strokeWidth="2.5" opacity="0.45" />
      {/* Walking cane propped beside him */}
      <line x1="663" y1="312" x2="668" y2="345" stroke="#2a2520" strokeWidth="1" opacity="0.4" />

      {/* Young boy — near the fountain, watching soldiers in awe */}
      <path d="M342 340 Q341 334 342 330 Q343 327 344 330 L345 340 Z" fill="#151210" opacity="0.6" />
      <circle cx="343" cy="326" r="2.8" fill="#151210" opacity="0.6" />
      {/* Small arm pointing toward the soldiers */}
      <path d="M345 332 Q348 334 350 333" fill="none" stroke="#151210" strokeWidth="1.2" opacity="0.45" />

      {/* === CAT SILHOUETTE on windowsill === */}
      {/* Sitting on left palazzo window sill, row 3 */}
      <ellipse cx="52" cy="232" rx="3.5" ry="2.5" fill="#0e0c0a" opacity="0.7" />
      <circle cx="50" cy="229" r="2.2" fill="#0e0c0a" opacity="0.7" />
      {/* Ears */}
      <path d="M48.5 227 L49.5 225 L50.5 227.5" fill="#0e0c0a" opacity="0.7" />
      <path d="M50 227 L51 224.8 L52 227" fill="#0e0c0a" opacity="0.7" />
      {/* Tail curling up */}
      <path d="M55 232 Q58 230 57 226" fill="none" stroke="#0e0c0a" strokeWidth="1.2" opacity="0.6" />
      {/* Tiny reflected eyes */}
      <circle cx="49.2" cy="228.8" r="0.5" fill="#c0a050" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="51" cy="228.8" r="0.5" fill="#c0a050" opacity="0.25">
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Arcade arches with columns */}
      <rect x="569" y="280" width="5" height="30" fill="#3a3530" opacity="0.6" />
      {[572, 608, 644, 680, 716].map((x) => (
        <React.Fragment key={`ar${x}`}>
          <path d={`M${x} 310 Q${x + 18} 280 ${x + 36} 310`} fill="#12100c" />
          <rect x={x + 34} y="280" width="5" height="30" fill="#3a3530" opacity="0.6" />
          {/* Column capital detail */}
          <rect x={x + 33} y="279" width="7" height="3" fill="#4a4540" opacity="0.3" />
        </React.Fragment>
      ))}
      {/* Wooden shutters on some windows */}
      <line x1="582" y1="112" x2="582" y2="128" stroke="#3a3028" strokeWidth="2" opacity="0.3" />
      <line x1="596" y1="112" x2="596" y2="128" stroke="#3a3028" strokeWidth="2" opacity="0.3" />

      {/* === ORNAMENTAL IRON GATE — near right palazzo ground level === */}
      {/* Gate posts */}
      <rect x="554" y="340" width="3" height="40" fill="#3a3530" opacity="0.55" />
      <rect x="557" y="340" width="24" height="38" fill="url(#ch5_ironGatePattern)" opacity="0.45" />
      <rect x="581" y="340" width="3" height="40" fill="#3a3530" opacity="0.55" />
      {/* Gate top rail */}
      <line x1="554" y1="340" x2="584" y2="340" stroke="#4a4540" strokeWidth="1.2" opacity="0.5" />
      {/* Gate finial — arrow points on top of posts */}
      <path d="M555 340 L555.5 336 L556 340" fill="#4a4540" opacity="0.4" />
      <path d="M582 340 L582.5 336 L583 340" fill="#4a4540" opacity="0.4" />

      {/* === WALL TORCH — right palazzo arcade === */}
      <rect x="562" y="286" width="3" height="10" fill="#3a3028" opacity="0.5" />
      <rect x="560" y="283" width="7" height="4" fill="#4a4038" opacity="0.5" rx="1" />
      <ellipse cx="563.5" cy="281" rx="2.5" ry="3.5" fill="#d09030" opacity="0.18">
        <animate attributeName="opacity" values="0.18;0.1;0.15;0.18" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="563.5" cy="286" rx="10" ry="8" fill="url(#ch5_torchGlow)">
        <animate attributeName="opacity" values="0.8;0.6;0.75;0.8" dur="2.5s" repeatCount="indefinite" />
      </ellipse>

      {/* === CENTER-LEFT BUILDING — grand balcony with French doors === */}
      <rect x="172" y="95" width="135" height="305" fill="url(#ch5_bldgCenter)" />
      <rect x="172" y="92" width="135" height="4" fill="#5a5045" />
      {/* Cornice detail */}
      <rect x="172" y="90" width="135" height="2" fill="#605550" opacity="0.4" />
      <rect x="195" y="140" width="90" height="3" fill="#5a5045" />
      {[200, 215, 230, 245, 260, 275].map((x) => (
        <line key={`bC${x}`} x1={x} y1="140" x2={x} y2="134" stroke="#4a4540" strokeWidth="0.7" opacity="0.5" />
      ))}
      <line x1="195" y1="134" x2="285" y2="134" stroke="#4a4540" strokeWidth="0.5" opacity="0.5" />
      {/* Decorative scroll ornament between railing posts */}
      {[207, 222, 237, 252, 267].map((x) => (
        <path key={`scC${x}`} d={`M${x} 137 Q${x + 5} 135 ${x + 10} 137`} fill="none" stroke="#4a4540" strokeWidth="0.4" opacity="0.25" />
      ))}
      {[202, 232, 262].map((x) => (
        <React.Fragment key={`fd${x}`}>
          <rect x={x} y="108" width="14" height="32" fill="#1a1518" rx="1" />
          <path d={`M${x} 110 Q${x + 7} 104 ${x + 14} 110`} fill="#1a1518" />
          <rect x={x + 2} y={110} width="10" height="28" fill="#c09050" opacity={x === 232 ? 0.3 : 0.12} rx="1">
            <animate attributeName="opacity" values={`${x === 232 ? '0.3;0.15;0.3' : '0.12;0.05;0.12'}`} dur={`${x === 232 ? 3.5 : 4.5}s`} repeatCount="indefinite" />
          </rect>
          <line x1={x + 7} y1={110} x2={x + 7} y2={140} stroke="#2a2520" strokeWidth="0.5" opacity="0.4" />
        </React.Fragment>
      ))}
      {/* Lower windows */}
      {[185, 215, 245, 275].map((x) => (
        <React.Fragment key={`cl${x}`}>
          <rect x={x} y="195" width="12" height="20" fill="#1a1518" rx="1" />
          <rect x={x - 0.5} y="215" width="13" height="1.5" fill="#4a4540" opacity="0.3" />
        </React.Fragment>
      ))}
      {/* Open shutters */}
      <line x1="200" y1="197" x2="200" y2="213" stroke="#3a2820" strokeWidth="2.5" opacity="0.3" />
      <line x1="227" y1="197" x2="227" y2="213" stroke="#3a2820" strokeWidth="2.5" opacity="0.3" />

      {/* === CENTER-RIGHT BUILDING === */}
      <rect x="420" y="105" width="132" height="295" fill="url(#ch5_bldgCenter)" />
      <rect x="420" y="102" width="132" height="4" fill="#5a5045" />
      <rect x="420" y="100" width="132" height="2" fill="#605550" opacity="0.4" />
      {[0, 1].map((row) => (
        <React.Fragment key={`cR${row}`}>
          {[438, 468, 498, 528].map((x) => (
            <React.Fragment key={`cr${row}${x}`}>
              <rect x={x} y={140 + row * 60} width="12" height="20" fill="#1a1518" rx="1" />
              <rect x={x + 2} y={142 + row * 60} width="8" height="16" fill="#c09050" opacity={0.1 + row * 0.04} rx="1">
                <animate attributeName="opacity" values={`${0.1 + row * 0.04};0.04;${0.1 + row * 0.04}`} dur={`${4 + x % 3}s`} repeatCount="indefinite" />
              </rect>
              <rect x={x - 0.5} y={160 + row * 60} width="13" height="1.5" fill="#4a4540" opacity="0.25" />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
      {/* Balcony with flower box */}
      <rect x="460" y="158" width="40" height="2.5" fill="#5a5045" />
      <rect x="465" y="155" width="30" height="4" fill="#5a3028" opacity="0.4" rx="1" />
      <ellipse cx="472" cy="153" rx="5" ry="3" fill="#2a4020" opacity="0.35" />
      <ellipse cx="488" cy="153" rx="5" ry="3" fill="#2a4020" opacity="0.3" />
      <circle cx="470" cy="152" r="1" fill="#d06050" opacity="0.25" />
      <circle cx="487" cy="152" r="1" fill="#d06050" opacity="0.2" />
      {/* Balcony iron railing */}
      {[463, 473, 483, 493].map((x) => (
        <line key={`bCr${x}`} x1={x} y1="158" x2={x} y2="153" stroke="#4a4540" strokeWidth="0.6" opacity="0.35" />
      ))}
      <line x1="460" y1="153" x2="500" y2="153" stroke="#4a4540" strokeWidth="0.5" opacity="0.3" />

      {/* === HANGING LAUNDRY BETWEEN BUILDINGS === */}
      {/* Left gap — soldiers' shirts and rags drying */}
      <line x1="158" y1="180" x2="178" y2="178" stroke="#3a3530" strokeWidth="0.4" opacity="0.3" />
      {laundryItems.map((item, i) => (
        <path key={`ldr1${i}`} d={`M${item.x} ${180 - (item.x - 158) * 0.1} Q${item.x + 2} ${180 - (item.x - 158) * 0.1 + item.sag} ${item.x + 4} ${180 - (item.x - 158) * 0.1}`}
          fill="none" stroke={item.c} strokeWidth={item.w} opacity="0.25">
          <animate attributeName="d"
            values={`M${item.x} ${180 - (item.x - 158) * 0.1} Q${item.x + 2} ${180 - (item.x - 158) * 0.1 + item.sag} ${item.x + 4} ${180 - (item.x - 158) * 0.1};M${item.x} ${180 - (item.x - 158) * 0.1} Q${item.x + 2} ${180 - (item.x - 158) * 0.1 + item.sag + 1} ${item.x + 4} ${180 - (item.x - 158) * 0.1};M${item.x} ${180 - (item.x - 158) * 0.1} Q${item.x + 2} ${180 - (item.x - 158) * 0.1 + item.sag} ${item.x + 4} ${180 - (item.x - 158) * 0.1}`}
            dur={`${4 + i}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Right gap */}
      <line x1="545" y1="165" x2="565" y2="163" stroke="#3a3530" strokeWidth="0.4" opacity="0.3" />
      {laundryItems2.map((item, i) => (
        <path key={`ldr2${i}`} d={`M${item.x} ${165 - (item.x - 545) * 0.1} Q${item.x + 2} ${165 - (item.x - 545) * 0.1 + item.sag} ${item.x + 4} ${165 - (item.x - 545) * 0.1}`}
          fill="none" stroke={item.c} strokeWidth={item.w} opacity="0.22">
          <animate attributeName="d"
            values={`M${item.x} ${165 - (item.x - 545) * 0.1} Q${item.x + 2} ${165 - (item.x - 545) * 0.1 + item.sag} ${item.x + 4} ${165 - (item.x - 545) * 0.1};M${item.x} ${165 - (item.x - 545) * 0.1} Q${item.x + 2} ${165 - (item.x - 545) * 0.1 + item.sag + 1} ${item.x + 4} ${165 - (item.x - 545) * 0.1};M${item.x} ${165 - (item.x - 545) * 0.1} Q${item.x + 2} ${165 - (item.x - 545) * 0.1 + item.sag} ${item.x + 4} ${165 - (item.x - 545) * 0.1}`}
            dur={`${4.5 + i}s`} repeatCount="indefinite" />
        </path>
      ))}

      {/* === WASHING LINE — between center buildings with white cloth === */}
      {/* Line strung between center-left and center-right buildings */}
      <line x1="305" y1="155" x2="422" y2="150" stroke="#3a3530" strokeWidth="0.4" opacity="0.25" />
      {/* White sheets/cloths hanging and swaying */}
      <path d="M320 155 Q322 162 324 155" fill="none" stroke="#8a8578" strokeWidth="0.9" opacity="0.2">
        <animate attributeName="d" values="M320 155 Q322 162 324 155;M320 155 Q322 163 324 155;M320 155 Q322 162 324 155" dur="5s" repeatCount="indefinite" />
      </path>
      <path d="M340 154 Q343 164 346 154" fill="none" stroke="#9a9588" strokeWidth="1" opacity="0.18">
        <animate attributeName="d" values="M340 154 Q343 164 346 154;M340 154 Q343 165 346 154;M340 154 Q343 164 346 154" dur="5.5s" repeatCount="indefinite" />
      </path>
      <path d="M365 153 Q367 160 369 153" fill="none" stroke="#7a7568" strokeWidth="0.8" opacity="0.16">
        <animate attributeName="d" values="M365 153 Q367 160 369 153;M365 153 Q367 161 369 153;M365 153 Q367 160 369 153" dur="4.8s" repeatCount="indefinite" />
      </path>
      <path d="M390 152 Q393 161 396 152" fill="none" stroke="#8a8578" strokeWidth="0.9" opacity="0.17">
        <animate attributeName="d" values="M390 152 Q393 161 396 152;M390 152 Q393 162 396 152;M390 152 Q393 161 396 152" dur="5.3s" repeatCount="indefinite" />
      </path>
      {/* Larger cloth — a bedsheet */}
      <path d="M405 151 Q410 163 415 151" fill="#8a8578" fillOpacity="0.06" stroke="#8a8578" strokeWidth="0.7" opacity="0.15">
        <animate attributeName="d" values="M405 151 Q410 163 415 151;M405 151 Q410 165 415 151;M405 151 Q410 163 415 151" dur="6s" repeatCount="indefinite" />
      </path>

      {/* === PIAZZA GROUND === */}
      <rect x="165" y="310" width="393" height="90" fill="url(#ch5_ground)" />
      {/* Cobblestone texture */}
      {[320, 340, 360, 380].map((y) => (
        <React.Fragment key={`cb${y}`}>
          {[180, 230, 280, 330, 380, 430, 480].map((x) => (
            <path key={`c${y}${x}`} d={`M${x} ${y} Q${x + 18} ${y - 1.5} ${x + 36} ${y}`} fill="none" stroke="#352a25" strokeWidth="0.4" opacity={0.12 + (y - 320) * 0.005} />
          ))}
        </React.Fragment>
      ))}

      {/* === STONE BENCH — near the fountain where soldiers sit === */}
      {/* Bench body — heavy stone slab */}
      <rect x="335" y="354" width="30" height="5" fill="#3a3530" opacity="0.65" rx="1" />
      {/* Bench legs — stone supports */}
      <rect x="337" y="359" width="5" height="6" fill="#353028" opacity="0.6" />
      <rect x="358" y="359" width="5" height="6" fill="#353028" opacity="0.6" />
      {/* Top edge highlight */}
      <line x1="335" y1="354" x2="365" y2="354" stroke="#4a4540" strokeWidth="0.5" opacity="0.3" />
      {/* Soldier sitting on bench — slumped, dozing */}
      <path d="M345 347 Q343 340 345 335 Q347 331 349 335 L350 347 Z" fill="#0a0a08" opacity="0.7" />
      <circle cx="347" cy="330" r="3.8" fill="#0a0a08" opacity="0.7" />
      {/* Head drooped forward — asleep */}
      <path d="M347 333 Q349 336 348 338" fill="none" stroke="#0a0a08" strokeWidth="1.5" opacity="0.5" />

      {/* === CENTRAL FOUNTAIN === */}
      <ellipse cx="380" cy="345" rx="40" ry="12" fill="#2e2a25" />
      <ellipse cx="380" cy="343" rx="38" ry="10" fill="#353028" />
      <ellipse cx="380" cy="340" rx="36" ry="9" fill="none" stroke="#4a4540" strokeWidth="1" opacity="0.5" />
      {/* Water pool */}
      <ellipse cx="380" cy="341" rx="33" ry="7" fill="#1e2a35" opacity="0.6" />
      <ellipse cx="380" cy="341" rx="30" ry="6" fill="url(#ch5_waterShimmer)">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === MOON REFLECTION — shimmering in the fountain water === */}
      <ellipse cx="388" cy="341" rx="5" ry="2" fill="url(#ch5_moonReflect)">
        <animate attributeName="opacity" values="0.6;1;0.5;0.8;0.6" dur="4s" repeatCount="indefinite" />
        <animate attributeName="rx" values="5;6;4;5" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Secondary reflection ripple */}
      <ellipse cx="386" cy="342" rx="3" ry="1" fill="#c0c090" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.12;0.04;0.06" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="386;390;386" dur="5s" repeatCount="indefinite" />
      </ellipse>
      {/* Tiny bright point — direct moon reflection */}
      <circle cx="389" cy="340.5" r="0.8" fill="#d0d0a0" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.2;0.05;0.15;0.1" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Fountain pedestal */}
      <rect x="376" y="318" width="8" height="24" fill="#3a3530" />
      {/* Water overflow — gentle drips down the bowl */}
      <line x1="370" y1="339" x2="369" y2="344" stroke="#3a5565" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1="390" y1="338" x2="391" y2="343" stroke="#3a5565" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="3.2s" repeatCount="indefinite" />
      </line>
      <line x1="355" y1="340" x2="354" y2="345" stroke="#3a5565" strokeWidth="0.4" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.8s" repeatCount="indefinite" />
      </line>
      {/* Subtle water trickle from spout */}
      <path d="M380 316 Q381 320 380 324" fill="none" stroke="#4a6575" strokeWidth="0.6" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.12" dur="1.5s" repeatCount="indefinite" />
      </path>
      {/* Water ripple on surface */}
      <ellipse cx="380" cy="341" rx="8" ry="2" fill="none" stroke="#506878" strokeWidth="0.3" opacity="0.1">
        <animate attributeName="rx" values="5;12;5" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Eagle ornament */}
      <path d="M374 318 Q380 306 386 318" fill="#3a3530" />
      <path d="M377 312 Q380 308 383 312 Q381 310 380 306 Q379 310 377 312" fill="#4a4540" opacity="0.6" />
      <path d="M374 314 Q370 310 368 312" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.4" />
      <path d="M386 314 Q390 310 392 312" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.4" />

      {/* === STREET PERFORMER — violinist near the fountain === */}
      {/* Standing figure with instrument — Italian busker entertaining the soldiers */}
      <path d="M415 330 Q413 318 415 308 Q417 302 419 308 L421 330 Z" fill="#0e0c08" opacity="0.7" />
      <circle cx="417" cy="302" r="4" fill="#0e0c08" opacity="0.7" />
      {/* Wide-brimmed hat */}
      <ellipse cx="417" cy="299" rx="5.5" ry="1.5" fill="#0e0c08" opacity="0.6" />
      {/* Left arm — holding violin up to chin */}
      <path d="M414 312 Q408 310 406 314" fill="none" stroke="#0e0c08" strokeWidth="1.8" opacity="0.55" />
      {/* Violin body — small dark shape tucked under chin */}
      <ellipse cx="407" cy="306" rx="3.5" ry="2" fill="#1a1210" opacity="0.5" transform="rotate(-30 407 306)" />
      <rect x="404" y="303" width="1" height="8" fill="#1a1210" opacity="0.4" transform="rotate(-30 404 307)" />
      {/* Right arm — bow arm extended */}
      <path d="M420 312 Q424 316 428 314" fill="none" stroke="#0e0c08" strokeWidth="1.5" opacity="0.5" />
      {/* Bow — thin line from hand across violin */}
      <line x1="428" y1="314" x2="406" y2="308" stroke="#5a5550" strokeWidth="0.4" opacity="0.3">
        <animate attributeName="y2" values="308;306;310;308" dur="2s" repeatCount="indefinite" />
      </line>
      {/* Legs slightly apart — performer stance */}
      <path d="M415 330 L413 348" fill="none" stroke="#0e0c08" strokeWidth="2.2" opacity="0.55" />
      <path d="M421 330 L423 348" fill="none" stroke="#0e0c08" strokeWidth="2.2" opacity="0.55" />
      {/* Small hat on ground for coins */}
      <ellipse cx="425" cy="348" rx="4" ry="1.5" fill="#1a1510" opacity="0.4" />

      {/* === STREET LAMPS WITH WARM GLOW === */}
      {/* Lamp 1 — left */}
      <line x1="240" y1="230" x2="240" y2="310" stroke="#3a3530" strokeWidth="2.5" />
      {/* Lamp bracket arm */}
      <path d="M240 228 Q245 226 246 230" fill="none" stroke="#3a3530" strokeWidth="1" opacity="0.5" />
      <rect x="234" y="225" width="12" height="8" fill="#3a3530" rx="1" />
      <rect x="236" y="227" width="8" height="4" fill="#c09050" opacity="0.2" rx="1">
        <animate attributeName="opacity" values="0.2;0.12;0.18;0.2" dur="2s" repeatCount="indefinite" />
      </rect>
      {/* Flame inside */}
      <ellipse cx="240" cy="228" rx="2" ry="3" fill="#d0a050" opacity="0.15">
        <animate attributeName="ry" values="3;2.5;3" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="240" cy="235" rx="35" ry="25" fill="url(#ch5_lampGlow)">
        <animate attributeName="opacity" values="1;0.75;0.9;1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Lamp 2 — right */}
      <line x1="500" y1="240" x2="500" y2="310" stroke="#3a3530" strokeWidth="2.5" />
      <path d="M500 238 Q505 236 506 240" fill="none" stroke="#3a3530" strokeWidth="1" opacity="0.5" />
      <rect x="494" y="235" width="12" height="8" fill="#3a3530" rx="1" />
      <rect x="496" y="237" width="8" height="4" fill="#c09050" opacity="0.2" rx="1">
        <animate attributeName="opacity" values="0.2;0.1;0.16;0.2" dur="2.3s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="500" cy="238" rx="2" ry="3" fill="#d0a050" opacity="0.12">
        <animate attributeName="ry" values="3;2;3" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="500" cy="245" rx="30" ry="22" fill="url(#ch5_lampGlow)">
        <animate attributeName="opacity" values="0.9;1;0.7;0.9" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Lamp 3 — near arcade, dimmer */}
      <line x1="570" y1="270" x2="570" y2="310" stroke="#3a3530" strokeWidth="2" />
      <rect x="565" y="266" width="10" height="6" fill="#3a3530" rx="1" />
      <ellipse cx="570" cy="272" rx="20" ry="15" fill="url(#ch5_lampGlowSmall)">
        <animate attributeName="opacity" values="0.8;1;0.85;0.8" dur="2.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Light pools on ground */}
      <ellipse cx="240" cy="320" rx="40" ry="8" fill="#c09050" opacity="0.04" />
      <ellipse cx="500" cy="325" rx="35" ry="7" fill="#c09050" opacity="0.035" />

      {/* === CAMP ELEMENTS === */}
      {/* Stacked muskets — tripod, piazza center-left */}
      <line x1="310" y1="340" x2="315" y2="305" stroke="#1a1815" strokeWidth="1.5" opacity="0.7" />
      <line x1="320" y1="340" x2="315" y2="305" stroke="#1a1815" strokeWidth="1.5" opacity="0.7" />
      <line x1="315" y1="340" x2="315" y2="303" stroke="#1a1815" strokeWidth="1.5" opacity="0.7" />
      <line x1="308" y1="315" x2="322" y2="315" stroke="#1a1815" strokeWidth="0.8" opacity="0.5" />
      {/* Bayonets glinting at top */}
      <line x1="315" y1="303" x2="315" y2="298" stroke="#5a5550" strokeWidth="0.5" opacity="0.3" />
      <line x1="315" y1="305" x2="312" y2="299" stroke="#5a5550" strokeWidth="0.5" opacity="0.25" />
      <line x1="315" y1="305" x2="318" y2="299" stroke="#5a5550" strokeWidth="0.5" opacity="0.25" />

      {/* Second musket tripod — near arcade */}
      <line x1="625" y1="340" x2="629" y2="312" stroke="#1a1815" strokeWidth="1.3" opacity="0.6" />
      <line x1="633" y1="340" x2="629" y2="312" stroke="#1a1815" strokeWidth="1.3" opacity="0.6" />
      <line x1="629" y1="340" x2="629" y2="310" stroke="#1a1815" strokeWidth="1.3" opacity="0.6" />
      <line x1="623" y1="322" x2="635" y2="322" stroke="#1a1815" strokeWidth="0.7" opacity="0.4" />

      {/* === WINE BOTTLES — on the ground near the soldiers === */}
      {/* Bottle 1 — standing, near the card players */}
      <rect x="484" y="338" width="2.5" height="6" fill="#1a2818" opacity="0.5" rx="0.5" />
      <rect x="484.5" y="335" width="1.5" height="3.5" fill="#1a2818" opacity="0.45" rx="0.3" />
      {/* Bottle 2 — tipped on its side, near the brazier */}
      <ellipse cx="455" cy="358" rx="5" ry="1.8" fill="#1a2818" opacity="0.4" transform="rotate(-15 455 358)" />
      <rect x="459" y="356.5" width="3.5" height="1.2" fill="#1a2818" opacity="0.35" transform="rotate(-15 460 357)" />
      {/* Bottle 3 — standing near the sleeping soldier by bedrolls */}
      <rect x="608" y="348" width="2.2" height="5.5" fill="#2a1818" opacity="0.45" rx="0.5" />
      <rect x="608.3" y="345.5" width="1.6" height="3" fill="#2a1818" opacity="0.4" rx="0.3" />

      {/* Bedrolls */}
      <ellipse cx="585" cy="350" rx="14" ry="5" fill="#2a2520" opacity="0.6" />
      <ellipse cx="600" cy="352" rx="12" ry="4" fill="#282218" opacity="0.5" />
      {/* Cooking pot on brazier */}
      <ellipse cx="440" cy="355" rx="8" ry="3" fill="#2a2218" opacity="0.7" />
      <path d="M434 355 Q437 348 440 346 Q443 348 446 355" fill="#252018" opacity="0.6" />
      <ellipse cx="440" cy="353" rx="12" ry="6" fill="url(#ch5_fireGlow)">
        <animate attributeName="rx" values="12;14;12" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <path d="M440 344 Q442 338 440 332" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.15">
        <animate attributeName="d" values="M440 344 Q442 338 440 332;M440 344 Q438 336 441 330;M440 344 Q442 338 440 332" dur="4s" repeatCount="indefinite" />
      </path>

      {/* === SOLDIER SILHOUETTES === */}
      {/* 1 — sleeping against arcade column */}
      <path d="M590 330 Q586 322 588 316 Q590 312 592 316 L594 325 Q596 330 598 338 L590 338 Z" fill="#0a0a08" opacity="0.75" />
      <circle cx="590" cy="311" r="4.5" fill="#0a0a08" opacity="0.75" />
      <path d="M590 338 Q594 345 600 348" fill="none" stroke="#0a0a08" strokeWidth="3" opacity="0.65" />
      {/* 2 — warming hands at brazier */}
      <path d="M430 330 Q428 320 430 312 Q432 307 434 312 L436 330 Z" fill="#0a0a08" opacity="0.8" />
      <circle cx="432" cy="307" r="4.5" fill="#0a0a08" opacity="0.8" />
      <path d="M428 318 Q425 322 423 320" fill="none" stroke="#0a0a08" strokeWidth="2" opacity="0.6" />
      <path d="M436 318 Q438 322 440 320" fill="none" stroke="#0a0a08" strokeWidth="2" opacity="0.6" />
      {/* 3 — sitting on fountain, looking up in awe */}
      <path d="M360 332 Q358 322 360 315 Q362 310 364 315 L366 332 Z" fill="#0a0a08" opacity="0.8" />
      <circle cx="362" cy="310" r="4.5" fill="#0a0a08" opacity="0.8" />
      <path d="M358 325 Q355 328 354 332" fill="none" stroke="#0a0a08" strokeWidth="2" opacity="0.6" />
      {/* Head tilted upward — gazing at architecture */}
      <path d="M360 308 Q361 306 363 307" fill="none" stroke="#0a0a08" strokeWidth="1" opacity="0.5" />
      {/* 4 — sitting on fountain, other side */}
      <path d="M398 332 Q396 324 398 318 Q400 314 402 318 L404 332 Z" fill="#0a0a08" opacity="0.7" />
      <circle cx="400" cy="313" r="4" fill="#0a0a08" opacity="0.7" />
      {/* 5 — standing sentry with musket */}
      <path d="M505 280 Q503 268 505 258 Q507 252 509 258 L511 280 Q510 292 509 305 L505 305 Z" fill="#0a0a08" opacity="0.8" />
      <circle cx="507" cy="252" r="5" fill="#0a0a08" opacity="0.8" />
      <rect x="503" y="244" width="8" height="8" fill="#0a0a08" opacity="0.75" rx="1" />
      <line x1="512" y1="250" x2="514" y2="300" stroke="#0a0a08" strokeWidth="1.5" opacity="0.65" />
      {/* 6 — lying down near bedrolls */}
      <path d="M615 355 Q625 350 640 352 Q648 353 650 355" fill="#0a0a08" opacity="0.5" />
      <circle cx="612" cy="353" r="3.5" fill="#0a0a08" opacity="0.55" />

      {/* 7 — leaning against column, reading a proclamation by lamplight */}
      <path d="M575 296 Q573 286 575 278 Q577 272 579 278 L581 296 Q580 302 579 310 L575 310 Z" fill="#0a0a08" opacity="0.75" />
      <circle cx="577" cy="272" r="4.5" fill="#0a0a08" opacity="0.75" />
      {/* Arms holding paper */}
      <path d="M573 284 Q568 288 566 286" fill="none" stroke="#0a0a08" strokeWidth="1.8" opacity="0.6" />
      {/* Paper/proclamation — small white rectangle */}
      <rect x="563" y="282" width="6" height="8" fill="#c0b898" opacity="0.08" rx="0.5" />

      {/* 8 — feeding a stray cat, crouched down */}
      <path d="M268 348 Q267 340 269 334 Q270 330 272 334 L273 345 Q272 350 271 355 L268 355 Z" fill="#0a0a08" opacity="0.72" />
      <circle cx="270" cy="330" r="4" fill="#0a0a08" opacity="0.72" />
      {/* Outstretched arm toward small animal */}
      <path d="M272 338 Q278 342 282 340" fill="none" stroke="#0a0a08" strokeWidth="1.5" opacity="0.55" />
      {/* Stray dog/cat approaching — small crouching form */}
      <ellipse cx="286" cy="350" rx="4" ry="2.5" fill="#0e0c0a" opacity="0.55" />
      <circle cx="283" cy="348" r="1.8" fill="#0e0c0a" opacity="0.55" />
      <path d="M290 350 Q291 348 290 347" fill="none" stroke="#0e0c0a" strokeWidth="0.8" opacity="0.4" />

      {/* 9 — playing cards by lamplight, hunched over */}
      <path d="M488 328 Q486 320 488 314 Q490 310 492 314 L494 328 Z" fill="#0a0a08" opacity="0.75" />
      <circle cx="490" cy="310" r="4" fill="#0a0a08" opacity="0.75" />
      {/* Second card player facing */}
      <path d="M510 330 Q512 322 510 316 Q508 312 506 316 L504 330 Z" fill="#0a0a08" opacity="0.7" />
      <circle cx="508" cy="312" r="3.8" fill="#0a0a08" opacity="0.7" />
      {/* Cards on ground between them */}
      <rect x="496" y="332" width="4" height="3" fill="#c0b898" opacity="0.06" transform="rotate(-5 498 333)" rx="0.3" />
      <rect x="499" y="331" width="4" height="3" fill="#c0b898" opacity="0.05" transform="rotate(10 501 332)" rx="0.3" />
      {/* Small candle/lamp between card players */}
      <ellipse cx="500" cy="330" rx="8" ry="6" fill="url(#ch5_cardGlow)">
        <animate attributeName="opacity" values="1;0.7;0.85;1" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <rect x="499" y="328" width="2" height="4" fill="#c0a050" opacity="0.12" />

      {/* === ATMOSPHERIC OVERLAYS === */}
      {/* Warm air shimmer — heat from lamps and brazier */}
      <rect x="220" y="300" width="60" height="15" fill="#d0a050" opacity="0.01">
        <animate attributeName="opacity" values="0.01;0.025;0.01" dur="5s" repeatCount="indefinite" />
        <animate attributeName="y" values="300;295;300" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="480" y="305" width="50" height="12" fill="#d0a050" opacity="0.01">
        <animate attributeName="opacity" values="0.01;0.02;0.01" dur="6s" repeatCount="indefinite" />
        <animate attributeName="y" values="305;300;305" dur="6s" repeatCount="indefinite" />
      </rect>

      <rect width="800" height="400" fill="url(#ch5_warmOverlay)" />
      <rect width="800" height="400" fill="url(#ch5_vignette)" />
      <rect x="0" y="378" width="800" height="22" fill="#080508" opacity="0.5" />
      <rect x="0" y="0" width="800" height="15" fill="#04040a" opacity="0.3" />
    </svg>
  );
}
