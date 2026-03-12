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
      </defs>

      {/* === NIGHT SKY === */}
      <rect width="800" height="400" fill="url(#ch5_sky)" />

      {/* Twinkling stars */}
      {stars.map((s, i) => (
        <circle key={`s${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="#c0b898" opacity={s.o}>
          <animate attributeName="opacity" values={`${s.o};${s.o * 0.4};${s.o}`} dur={`${s.d}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Warm crescent moon */}
      <ellipse cx="680" cy="45" rx="40" ry="40" fill="url(#ch5_moonGlow)" />
      <circle cx="680" cy="45" r="12" fill="#c8c090" opacity="0.15" />
      <circle cx="685" cy="43" r="10" fill="#06081a" opacity="0.9" />
      <ellipse cx="680" cy="45" rx="22" ry="22" fill="#c0b888" opacity="0.04" />

      {/* === DISTANT DUOMO SILHOUETTE === */}
      <path d="M360 90 Q380 55 400 48 Q420 55 440 90" fill="#161420" opacity="0.8" />
      <rect x="396" y="42" width="8" height="10" fill="#161420" opacity="0.7" />
      <path d="M396 42 L400 35 L404 42" fill="#161420" opacity="0.7" />
      <line x1="400" y1="30" x2="400" y2="36" stroke="#2a2530" strokeWidth="1" opacity="0.6" />
      <line x1="397" y1="33" x2="403" y2="33" stroke="#2a2530" strokeWidth="1" opacity="0.6" />
      <path d="M375 82 Q388 60 400 50" fill="none" stroke="#1e1a28" strokeWidth="0.5" opacity="0.4" />
      <path d="M425 82 Q412 60 400 50" fill="none" stroke="#1e1a28" strokeWidth="0.5" opacity="0.4" />

      {/* === LEFT PALAZZO === */}
      <rect x="0" y="75" width="165" height="325" fill="url(#ch5_bldgLeft)" />
      <rect x="0" y="72" width="165" height="5" fill="#4a4540" />
      {[20, 55, 90, 125].map((x) => (
        <path key={`fL${x}`} d={`M${x} 72 L${x + 4} 62 L${x + 8} 72`} fill="#4a4540" opacity="0.8" />
      ))}
      {/* Arched windows — 3 rows x 5 columns */}
      {rows.map((row) => (
        <React.Fragment key={`lR${row}`}>
          {leftWindows.map((x) => {
            const y = 105 + row * 65;
            const op = row === 0 && (x === 48 || x === 108) ? 0.3 : row === 1 && x === 78 ? 0.25 : 0.1 + row * 0.03;
            return (
              <React.Fragment key={`lw${row}${x}`}>
                <rect x={x} y={y} width="16" height="24" fill="#1a1518" rx="2" />
                <path d={`M${x} ${y + 2} Q${x + 8} ${y - 4} ${x + 16} ${y + 2}`} fill="#1a1518" />
                <rect x={x + 2} y={y + 2} width="12" height="20" fill="#c09050" opacity={op} rx="1">
                  <animate attributeName="opacity" values={`${op};${op * 0.4};${op}`} dur={`${3 + (x % 5) + row}s`} repeatCount="indefinite" />
                </rect>
                <line x1={x + 8} y1={y + 2} x2={x + 8} y2={y + 24} stroke="#2a2520" strokeWidth="0.6" opacity="0.5" />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      {/* Ornate balcony with iron railing and flower pots */}
      <rect x="10" y="168" width="145" height="3" fill="#5a5045" />
      {[18, 38, 58, 78, 98, 118, 138].map((x) => (
        <line key={`bL${x}`} x1={x} y1="168" x2={x} y2="162" stroke="#4a4540" strokeWidth="0.8" opacity="0.5" />
      ))}
      <line x1="10" y1="162" x2="155" y2="162" stroke="#4a4540" strokeWidth="0.6" opacity="0.5" />
      <rect x="60" y="163" width="8" height="5" fill="#5a3028" opacity="0.5" rx="1" />
      <ellipse cx="64" cy="161" rx="6" ry="3" fill="#2a4020" opacity="0.4" />
      <circle cx="62" cy="160" r="1.2" fill="#c06050" opacity="0.3" />
      <circle cx="66" cy="160" r="1" fill="#c06050" opacity="0.25" />

      {/* === RIGHT PALAZZO — with ground-level arcade === */}
      <rect x="560" y="85" width="240" height="315" fill="url(#ch5_bldgRight)" />
      <rect x="560" y="82" width="240" height="5" fill="#4a4540" />
      {[575, 615, 655, 695, 735].map((x) => (
        <path key={`fR${x}`} d={`M${x} 82 L${x + 5} 70 L${x + 10} 82`} fill="#4a4540" opacity="0.7" />
      ))}
      {/* Windows — 3 rows x 6 columns */}
      {rows.map((row) => (
        <React.Fragment key={`rR${row}`}>
          {rightWindows.map((x) => {
            const y = 110 + row * 55;
            const op = row === 0 && x === 642 ? 0.28 : row === 1 && x === 702 ? 0.22 : 0.08 + row * 0.02;
            return (
              <React.Fragment key={`rw${row}${x}`}>
                <rect x={x} y={y} width="14" height="20" fill="#1a1518" rx="1" />
                <path d={`M${x} ${y + 2} Q${x + 7} ${y - 3} ${x + 14} ${y + 2}`} fill="#1a1518" />
                <rect x={x + 2} y={y + 2} width="10" height="16" fill="#c09050" opacity={op} rx="1">
                  <animate attributeName="opacity" values={`${op};${op * 0.35};${op}`} dur={`${3.5 + (x % 4) + row * 0.5}s`} repeatCount="indefinite" />
                </rect>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      {/* One window going dark */}
      <rect x="644" y="112" width="10" height="16" fill="#c09050" opacity="0.28" rx="1">
        <animate attributeName="opacity" values="0.28;0.28;0.28;0.05;0.05;0.05" dur="20s" repeatCount="indefinite" />
      </rect>
      {/* Arcade arches with columns */}
      <rect x="569" y="280" width="5" height="30" fill="#3a3530" opacity="0.6" />
      {[572, 608, 644, 680, 716].map((x) => (
        <React.Fragment key={`ar${x}`}>
          <path d={`M${x} 310 Q${x + 18} 280 ${x + 36} 310`} fill="#12100c" />
          <rect x={x + 34} y="280" width="5" height="30" fill="#3a3530" opacity="0.6" />
        </React.Fragment>
      ))}
      {/* Wooden shutters on some windows */}
      <line x1="582" y1="112" x2="582" y2="128" stroke="#3a3028" strokeWidth="2" opacity="0.3" />
      <line x1="596" y1="112" x2="596" y2="128" stroke="#3a3028" strokeWidth="2" opacity="0.3" />

      {/* === CENTER-LEFT BUILDING — grand balcony with French doors === */}
      <rect x="172" y="95" width="135" height="305" fill="url(#ch5_bldgCenter)" />
      <rect x="172" y="92" width="135" height="4" fill="#5a5045" />
      <rect x="195" y="140" width="90" height="3" fill="#5a5045" />
      {[200, 215, 230, 245, 260, 275].map((x) => (
        <line key={`bC${x}`} x1={x} y1="140" x2={x} y2="134" stroke="#4a4540" strokeWidth="0.7" opacity="0.5" />
      ))}
      <line x1="195" y1="134" x2="285" y2="134" stroke="#4a4540" strokeWidth="0.5" opacity="0.5" />
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
        <rect key={`cl${x}`} x={x} y="195" width="12" height="20" fill="#1a1518" rx="1" />
      ))}
      {/* Open shutters */}
      <line x1="200" y1="197" x2="200" y2="213" stroke="#3a2820" strokeWidth="2.5" opacity="0.3" />
      <line x1="227" y1="197" x2="227" y2="213" stroke="#3a2820" strokeWidth="2.5" opacity="0.3" />

      {/* === CENTER-RIGHT BUILDING === */}
      <rect x="420" y="105" width="132" height="295" fill="url(#ch5_bldgCenter)" />
      <rect x="420" y="102" width="132" height="4" fill="#5a5045" />
      {[0, 1].map((row) => (
        <React.Fragment key={`cR${row}`}>
          {[438, 468, 498, 528].map((x) => (
            <React.Fragment key={`cr${row}${x}`}>
              <rect x={x} y={140 + row * 60} width="12" height="20" fill="#1a1518" rx="1" />
              <rect x={x + 2} y={142 + row * 60} width="8" height="16" fill="#c09050" opacity={0.1 + row * 0.04} rx="1">
                <animate attributeName="opacity" values={`${0.1 + row * 0.04};0.04;${0.1 + row * 0.04}`} dur={`${4 + x % 3}s`} repeatCount="indefinite" />
              </rect>
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

      {/* === HANGING LAUNDRY BETWEEN BUILDINGS === */}
      <line x1="158" y1="180" x2="178" y2="178" stroke="#3a3530" strokeWidth="0.4" opacity="0.3" />
      <path d="M162 180 Q164 185 166 180" fill="none" stroke="#5a5550" strokeWidth="0.8" opacity="0.25" />
      <path d="M168 179 Q170 186 173 179" fill="none" stroke="#6a6055" strokeWidth="0.8" opacity="0.25" />
      <line x1="545" y1="165" x2="565" y2="163" stroke="#3a3530" strokeWidth="0.4" opacity="0.3" />
      <path d="M548 165 Q550 172 553 165" fill="none" stroke="#5a5550" strokeWidth="0.8" opacity="0.22" />
      <path d="M556 164 Q558 170 560 164" fill="none" stroke="#6a6055" strokeWidth="0.7" opacity="0.2" />

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

      {/* === CENTRAL FOUNTAIN === */}
      <ellipse cx="380" cy="345" rx="40" ry="12" fill="#2e2a25" />
      <ellipse cx="380" cy="343" rx="38" ry="10" fill="#353028" />
      <ellipse cx="380" cy="340" rx="36" ry="9" fill="none" stroke="#4a4540" strokeWidth="1" opacity="0.5" />
      <ellipse cx="380" cy="341" rx="33" ry="7" fill="#1e2a35" opacity="0.6" />
      <ellipse cx="380" cy="341" rx="30" ry="6" fill="url(#ch5_waterShimmer)">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <rect x="376" y="318" width="8" height="24" fill="#3a3530" />
      {/* Eagle ornament */}
      <path d="M374 318 Q380 306 386 318" fill="#3a3530" />
      <path d="M377 312 Q380 308 383 312 Q381 310 380 306 Q379 310 377 312" fill="#4a4540" opacity="0.6" />
      <path d="M374 314 Q370 310 368 312" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.4" />
      <path d="M386 314 Q390 310 392 312" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.4" />

      {/* === STREET LAMPS WITH WARM GLOW === */}
      {/* Lamp 1 — left */}
      <line x1="240" y1="230" x2="240" y2="310" stroke="#3a3530" strokeWidth="2.5" />
      <rect x="234" y="225" width="12" height="8" fill="#3a3530" rx="1" />
      <rect x="236" y="227" width="8" height="4" fill="#c09050" opacity="0.2" rx="1" />
      <ellipse cx="240" cy="235" rx="35" ry="25" fill="url(#ch5_lampGlow)">
        <animate attributeName="opacity" values="1;0.75;0.9;1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Lamp 2 — right */}
      <line x1="500" y1="240" x2="500" y2="310" stroke="#3a3530" strokeWidth="2.5" />
      <rect x="494" y="235" width="12" height="8" fill="#3a3530" rx="1" />
      <rect x="496" y="237" width="8" height="4" fill="#c09050" opacity="0.2" rx="1" />
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
      {/* Stacked muskets — tripod */}
      <line x1="310" y1="340" x2="315" y2="305" stroke="#1a1815" strokeWidth="1.5" opacity="0.7" />
      <line x1="320" y1="340" x2="315" y2="305" stroke="#1a1815" strokeWidth="1.5" opacity="0.7" />
      <line x1="315" y1="340" x2="315" y2="303" stroke="#1a1815" strokeWidth="1.5" opacity="0.7" />
      <line x1="308" y1="315" x2="322" y2="315" stroke="#1a1815" strokeWidth="0.8" opacity="0.5" />
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

      {/* === ATMOSPHERIC OVERLAYS === */}
      <rect width="800" height="400" fill="url(#ch5_warmOverlay)" />
      <rect width="800" height="400" fill="url(#ch5_vignette)" />
      <rect x="0" y="378" width="800" height="22" fill="#080508" opacity="0.5" />
      <rect x="0" y="0" width="800" height="15" fill="#04040a" opacity="0.3" />
    </svg>
  );
}
