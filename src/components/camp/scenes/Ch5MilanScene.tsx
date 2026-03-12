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
        {/* Additional street lamp glow — warmer, softer */}
        <radialGradient id="ch5_lampGlowWarm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d8a848" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#c89040" stopOpacity="0.18" />
          <stop offset="65%" stopColor="#b88030" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#a87020" stopOpacity="0" />
        </radialGradient>
        {/* Cobblestone pattern for the piazza floor */}
        <pattern id="ch5_cobblePattern" x="0" y="0" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill="none" />
          <path d="M0 0 L12 0 L12 6 L0 6 Z" fill="none" stroke="#352a22" strokeWidth="0.35" opacity="0.15" />
          <path d="M12 0 L24 0 L24 6 L12 6 Z" fill="none" stroke="#352a22" strokeWidth="0.35" opacity="0.12" />
          <path d="M6 6 L18 6 L18 12 L6 12 Z" fill="none" stroke="#352a22" strokeWidth="0.35" opacity="0.13" />
          <path d="M0 6 L6 6 L6 12 L0 12 Z" fill="none" stroke="#352a22" strokeWidth="0.35" opacity="0.1" />
          <path d="M18 6 L24 6 L24 12 L18 12 Z" fill="none" stroke="#352a22" strokeWidth="0.35" opacity="0.1" />
        </pattern>
        {/* Statue pedestal gradient */}
        <linearGradient id="ch5_statuePedestal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4540" />
          <stop offset="100%" stopColor="#353028" />
        </linearGradient>
        {/* Stone texture pattern — mortar lines and weathering for facades */}
        <pattern id="ch5_stoneTexture" x="0" y="0" width="30" height="16" patternUnits="userSpaceOnUse">
          <rect width="30" height="16" fill="none" />
          <line x1="0" y1="8" x2="30" y2="8" stroke="#2a2520" strokeWidth="0.3" opacity="0.08" />
          <line x1="15" y1="0" x2="15" y2="8" stroke="#2a2520" strokeWidth="0.25" opacity="0.06" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#2a2520" strokeWidth="0.25" opacity="0.05" />
          <line x1="7" y1="8" x2="7" y2="16" stroke="#2a2520" strokeWidth="0.25" opacity="0.06" />
          <line x1="22" y1="8" x2="22" y2="16" stroke="#2a2520" strokeWidth="0.25" opacity="0.05" />
          {/* Tiny weathering marks */}
          <circle cx="5" cy="4" r="0.4" fill="#201a15" opacity="0.06" />
          <circle cx="24" cy="12" r="0.3" fill="#201a15" opacity="0.05" />
        </pattern>
        {/* Light spill gradient — warm light pouring from open doorways */}
        <radialGradient id="ch5_doorLightSpill" cx="0.5" cy="0" r="1">
          <stop offset="0%" stopColor="#d4a050" stopOpacity="0.06" />
          <stop offset="40%" stopColor="#c09040" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#c09040" stopOpacity="0" />
        </radialGradient>
        {/* Puddle reflection gradient */}
        <radialGradient id="ch5_puddleReflect" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#2a3545" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#1e2a38" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#181e28" stopOpacity="0.05" />
        </radialGradient>
        {/* Dust mote glow — tiny bright particles in lamplight */}
        <radialGradient id="ch5_dustGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d8c080" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d8c080" stopOpacity="0" />
        </radialGradient>
        {/* Smoke wisp gradient */}
        <linearGradient id="ch5_smokeWisp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3a3530" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#4a4540" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#4a4540" stopOpacity="0" />
        </linearGradient>
        {/* Captured standard fabric gradient — Austrian white-and-gold */}
        <linearGradient id="ch5_austrianStandard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8e0c0" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#c0a040" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a08030" stopOpacity="0.15" />
        </linearGradient>
        {/* Victory wreath gradient */}
        <radialGradient id="ch5_wreathGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#2a4520" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1e3518" stopOpacity="0.1" />
        </radialGradient>
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
      {/* Stone texture overlay — ashlar masonry pattern */}
      <rect x="0" y="75" width="165" height="325" fill="url(#ch5_stoneTexture)" opacity="0.6" />
      {/* Weathering stains — water damage streaks below windows */}
      <path d="M30 170 Q28 190 30 210" fill="none" stroke="#252018" strokeWidth="1.5" opacity="0.06" />
      <path d="M65 170 Q63 195 65 220" fill="none" stroke="#252018" strokeWidth="1.2" opacity="0.05" />
      <path d="M100 170 Q98 192 100 215" fill="none" stroke="#252018" strokeWidth="1.3" opacity="0.055" />
      {/* Mortar crack — hairline fracture running diagonally */}
      <path d="M120 160 Q118 180 122 200 Q120 210 121 220" fill="none" stroke="#1e1a15" strokeWidth="0.3" opacity="0.08" />
      <path d="M40 250 Q38 265 42 280" fill="none" stroke="#1e1a15" strokeWidth="0.25" opacity="0.07" />
      {/* Corner rustication — carved stone blocks at building edge */}
      {[80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360].map((y) => (
        <rect key={`rustL${y}`} x="160" y={y} width="5" height="18" fill="none" stroke="#3a3530" strokeWidth="0.4" opacity={0.1 + (y > 250 ? 0.02 : 0)} />
      ))}
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

      {/* === IVY ON WALLS — climbing vines on left palazzo facade === */}
      <path d="M10 280 Q8 260 12 240 Q10 225 14 210 Q12 195 16 180" fill="none" stroke="#1e3518" strokeWidth="1.2" opacity="0.3" />
      <path d="M12 260 Q6 255 4 248" fill="none" stroke="#1e3518" strokeWidth="0.8" opacity="0.25" />
      <path d="M14 230 Q8 226 5 220" fill="none" stroke="#1e3518" strokeWidth="0.7" opacity="0.22" />
      <path d="M13 245 Q18 240 20 235" fill="none" stroke="#1e3518" strokeWidth="0.6" opacity="0.2" />
      {/* Ivy leaf clusters — small grouped shapes */}
      {[248, 235, 222, 210, 195, 180].map((y, i) => (
        <React.Fragment key={`ivyL${i}`}>
          <ellipse cx={10 + (i % 2) * 4} cy={y} rx="2.5" ry="1.8" fill="#1e3518" opacity={0.2 - i * 0.015} />
          <ellipse cx={14 - (i % 2) * 3} cy={y + 3} rx="2" ry="1.5" fill="#1e3518" opacity={0.18 - i * 0.012} />
        </React.Fragment>
      ))}
      {/* Ivy on right palazzo wall — near the arcade */}
      <path d="M790 220 Q792 200 788 185 Q790 170 786 158" fill="none" stroke="#1e3518" strokeWidth="1" opacity="0.25" />
      <path d="M788 200 Q794 196 796 190" fill="none" stroke="#1e3518" strokeWidth="0.7" opacity="0.2" />
      <path d="M789 180 Q784 176 782 170" fill="none" stroke="#1e3518" strokeWidth="0.6" opacity="0.18" />
      {[200, 188, 176, 164].map((y, i) => (
        <ellipse key={`ivyR${i}`} cx={789 + (i % 2) * 3} cy={y} rx="2.2" ry="1.6" fill="#1e3518" opacity={0.18 - i * 0.02} />
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
                {/* Glass reflection — moonlight catching on window pane */}
                <path d={`M${x + 2} ${y + 4} L${x + 5} ${y + 4} L${x + 3} ${y + 10} L${x + 1} ${y + 10} Z`}
                  fill="#8090a0" opacity={row === 0 ? 0.04 : 0.02} />
                {/* Drip stain below sill */}
                <path d={`M${x + 6} ${y + 26} Q${x + 5} ${y + 32} ${x + 6} ${y + 38}`}
                  fill="none" stroke="#252018" strokeWidth="0.4" opacity="0.04" />
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

      {/* === BALCONY WITH FIGURE — woman silhouette leaning on railing above === */}
      {/* Balcony ledge on center-right building upper floor */}
      <rect x="435" y="128" width="46" height="2.5" fill="#5a5045" opacity="0.7" />
      {/* Railing posts */}
      {[438, 448, 458, 468, 478].map((x) => (
        <line key={`balFig${x}`} x1={x} y1="128" x2={x} y2="122" stroke="#4a4540" strokeWidth="0.7" opacity="0.4" />
      ))}
      <line x1="435" y1="122" x2="481" y2="122" stroke="#4a4540" strokeWidth="0.5" opacity="0.35" />
      {/* Woman silhouette — leaning forward on railing, looking down at piazza */}
      <circle cx="458" cy="116" r="3" fill="#1a1518" opacity="0.65" />
      {/* Hair flowing down */}
      <path d="M456 117 Q454 120 455 123" fill="none" stroke="#1a1518" strokeWidth="1.2" opacity="0.5" />
      {/* Torso leaning forward over railing */}
      <path d="M456 119 Q457 123 458 126 Q459 123 460 119" fill="#1a1518" opacity="0.55" />
      {/* Arms resting on railing */}
      <path d="M454 122 Q456 124 458 123 Q460 124 462 122" fill="none" stroke="#1a1518" strokeWidth="1.5" opacity="0.5" />
      {/* Shawl draped over shoulders */}
      <path d="M453 119 Q458 118 463 119 Q465 122 463 124" fill="none" stroke="#2a2520" strokeWidth="0.8" opacity="0.3" />

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
      {/* Stone texture overlay */}
      <rect x="560" y="85" width="240" height="315" fill="url(#ch5_stoneTexture)" opacity="0.55" />
      {/* Weathering stains below right palazzo windows */}
      <path d="M600 135 Q598 155 600 175" fill="none" stroke="#221a15" strokeWidth="1.2" opacity="0.05" />
      <path d="M680 135 Q678 158 680 180" fill="none" stroke="#221a15" strokeWidth="1" opacity="0.04" />
      {/* Mortar crack */}
      <path d="M720 150 Q718 168 722 185 Q720 195 721 205" fill="none" stroke="#1e1812" strokeWidth="0.3" opacity="0.07" />
      {/* Corner rustication — left edge of right palazzo */}
      {[90, 110, 130, 150, 170, 190, 210, 230, 250, 270].map((y) => (
        <rect key={`rustR${y}`} x="560" y={y} width="5" height="18" fill="none" stroke="#3a3228" strokeWidth="0.4" opacity="0.08" />
      ))}
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
                {/* Glass reflection — diagonal highlight */}
                <path d={`M${x + 2} ${y + 3} L${x + 4} ${y + 3} L${x + 2} ${y + 8} Z`}
                  fill="#8090a0" opacity={row === 0 ? 0.035 : 0.02} />
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
      {/* Ornate door frame — carved stone architrave */}
      <rect x="83" y="338" width="22" height="2.5" fill="#4a4540" opacity="0.35" />
      <rect x="83" y="338" width="2" height="44" fill="#4a4540" opacity="0.3" />
      <rect x="103" y="338" width="2" height="44" fill="#3a3530" opacity="0.25" />
      {/* Door frame pediment — small triangular crown */}
      <path d="M83 338 L94 330 L105 338" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.25" />
      {/* Keystone at pediment apex */}
      <rect x="92" y="329" width="4" height="4" fill="#4a4540" opacity="0.2" rx="0.5" />
      {/* Warm light spill from doorway onto cobblestones */}
      <ellipse cx="94" cy="380" rx="18" ry="8" fill="url(#ch5_doorLightSpill)" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.3;0.45;0.5" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Door panels — two leaves, one slightly ajar */}
      <rect x="86" y="342" width="8" height="36" fill="#1e1a15" opacity="0.5" />
      <rect x="94" y="342" width="8" height="36" fill="#181510" opacity="0.6" />
      {/* Door knocker — iron ring */}
      <circle cx="93" cy="360" r="1.2" fill="none" stroke="#3a3530" strokeWidth="0.5" opacity="0.2" />
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

      {/* === ARCHWAY — architectural opening between left and center-left buildings === */}
      {/* Dark archway recess */}
      <rect x="165" y="290" width="28" height="55" fill="#0c0a08" opacity="0.85" />
      {/* Arch curve at the top */}
      <path d="M165 295 Q179 275 193 295" fill="#0c0a08" opacity="0.85" />
      {/* Stone arch surround — voussoirs */}
      <path d="M163 298 Q179 272 195 298" fill="none" stroke="#4a4540" strokeWidth="1.5" opacity="0.4" />
      {/* Keystone at arch apex */}
      <rect x="176" y="274" width="5" height="6" fill="#4a4540" opacity="0.35" rx="0.5" />
      {/* Impost blocks — where arch meets wall */}
      <rect x="162" y="295" width="5" height="3" fill="#4a4540" opacity="0.3" />
      <rect x="191" y="295" width="5" height="3" fill="#4a4540" opacity="0.3" />
      {/* Voussoir stones — individual arch stones */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const angle = -90 + i * 25.7;
        const rad = (angle * Math.PI) / 180;
        const cx = 179 + Math.cos(rad) * 14;
        const cy = 286 - Math.sin(rad) * 14;
        return (
          <line key={`vous${i}`} x1={cx - 1} y1={cy} x2={cx + 1} y2={cy}
            stroke="#4a4540" strokeWidth="0.3" opacity="0.15"
            transform={`rotate(${angle + 90} ${cx} ${cy})`} />
        );
      })}
      {/* Depth shadow — suggesting passage beyond */}
      <rect x="168" y="298" width="22" height="47" fill="#08060a" opacity="0.5" />
      {/* Cobblestone visible in archway floor */}
      <rect x="170" y="340" width="18" height="5" fill="url(#ch5_cobblePattern)" opacity="0.15" />
      {/* Distant lamp glow visible deep in the archway */}
      <ellipse cx="179" cy="318" rx="5" ry="8" fill="#c09050" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.06;0.04" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Arcade arches with columns */}
      <rect x="569" y="280" width="5" height="30" fill="#3a3530" opacity="0.6" />
      {/* First column base */}
      <rect x="568" y="307" width="7" height="3" fill="#4a4540" opacity="0.3" />
      {[572, 608, 644, 680, 716].map((x) => (
        <React.Fragment key={`ar${x}`}>
          <path d={`M${x} 310 Q${x + 18} 280 ${x + 36} 310`} fill="#12100c" />
          <rect x={x + 34} y="280" width="5" height="30" fill="#3a3530" opacity="0.6" />
          {/* Column capital detail — Corinthian style */}
          <rect x={x + 33} y="279" width="7" height="3" fill="#4a4540" opacity="0.3" />
          {/* Abacus plate atop capital */}
          <rect x={x + 32} y="278" width="9" height="1.5" fill="#4a4540" opacity="0.2" />
          {/* Column base */}
          <rect x={x + 33} y="307" width="7" height="3" fill="#4a4540" opacity="0.25" />
          {/* Column fluting — vertical lines suggesting carved grooves */}
          <line x1={x + 36} y1="282" x2={x + 36} y2="307" stroke="#3a3028" strokeWidth="0.3" opacity="0.1" />
          <line x1={x + 38} y1="282" x2={x + 38} y2="307" stroke="#3a3028" strokeWidth="0.3" opacity="0.08" />
          {/* Arch keystone */}
          <rect x={x + 16} y={281} width="4" height="4" fill="#4a4540" opacity="0.2" rx="0.5" />
          {/* Arch inner moulding */}
          <path d={`M${x + 2} 308 Q${x + 18} 283 ${x + 34} 308`} fill="none" stroke="#4a4540" strokeWidth="0.4" opacity="0.12" />
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
      {/* Stone texture overlay */}
      <rect x="172" y="95" width="135" height="305" fill="url(#ch5_stoneTexture)" opacity="0.5" />
      {/* Horizontal string course — decorative band between floors */}
      <rect x="172" y="190" width="135" height="1.5" fill="#5a5045" opacity="0.3" />
      <rect x="172" y="260" width="135" height="1.5" fill="#5a5045" opacity="0.25" />
      {/* Pilaster strips — shallow decorative columns flanking the facade */}
      <rect x="172" y="95" width="3" height="215" fill="#4a4035" opacity="0.15" />
      <rect x="304" y="95" width="3" height="215" fill="#3a3028" opacity="0.12" />
      {/* Coat of arms / decorative cartouche above French doors */}
      <ellipse cx="239" cy="100" rx="8" ry="5" fill="none" stroke="#5a5045" strokeWidth="0.6" opacity="0.2" />
      <path d="M233 100 Q239 94 245 100" fill="none" stroke="#5a5045" strokeWidth="0.4" opacity="0.15" />
      <path d="M236 100 L239 96 L242 100" fill="#5a5045" opacity="0.08" />
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
          {/* Door frame surround */}
          <rect x={x - 1} y="107" width="16" height="34" fill="#4a4035" opacity="0.2" rx="0.5" />
          <rect x={x} y="108" width="14" height="32" fill="#1a1518" rx="1" />
          <path d={`M${x} 110 Q${x + 7} 104 ${x + 14} 110`} fill="#1a1518" />
          {/* Keystone above arch */}
          <rect x={x + 5} y="103" width="4" height="3.5" fill="#5a5045" opacity="0.2" rx="0.5" />
          <rect x={x + 2} y={110} width="10" height="28" fill="#c09050" opacity={x === 232 ? 0.3 : 0.12} rx="1">
            <animate attributeName="opacity" values={`${x === 232 ? '0.3;0.15;0.3' : '0.12;0.05;0.12'}`} dur={`${x === 232 ? 3.5 : 4.5}s`} repeatCount="indefinite" />
          </rect>
          <line x1={x + 7} y1={110} x2={x + 7} y2={140} stroke="#2a2520" strokeWidth="0.5" opacity="0.4" />
          {/* Glass reflection on French doors */}
          <path d={`M${x + 2} ${112} L${x + 4} ${112} L${x + 3} ${120} L${x + 1} ${120} Z`}
            fill="#8090a0" opacity={x === 232 ? 0.02 : 0.03} />
          {/* Horizontal glazing bar */}
          <line x1={x + 2} y1={124} x2={x + 12} y2={124} stroke="#2a2520" strokeWidth="0.4" opacity="0.3" />
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
      {/* Stone texture overlay */}
      <rect x="420" y="105" width="132" height="295" fill="url(#ch5_stoneTexture)" opacity="0.5" />
      {/* String courses */}
      <rect x="420" y="195" width="132" height="1.5" fill="#5a5045" opacity="0.25" />
      <rect x="420" y="265" width="132" height="1.5" fill="#5a5045" opacity="0.22" />
      {/* Pilaster strips */}
      <rect x="420" y="105" width="3" height="200" fill="#4a4035" opacity="0.12" />
      <rect x="549" y="105" width="3" height="200" fill="#3a3028" opacity="0.1" />
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

      {/* === COBBLESTONE DETAIL — stone pattern on the piazza floor === */}
      <rect x="165" y="310" width="393" height="90" fill="url(#ch5_cobblePattern)" opacity="0.7" />
      {/* Additional hand-drawn cobblestone lines for depth */}
      {[320, 340, 360, 380].map((y) => (
        <React.Fragment key={`cb${y}`}>
          {[180, 230, 280, 330, 380, 430, 480].map((x) => (
            <path key={`c${y}${x}`} d={`M${x} ${y} Q${x + 18} ${y - 1.5} ${x + 36} ${y}`} fill="none" stroke="#352a25" strokeWidth="0.4" opacity={0.12 + (y - 320) * 0.005} />
          ))}
        </React.Fragment>
      ))}
      {/* Radial cobblestone lines near fountain — fan pattern */}
      {[345, 350, 355, 360, 365, 370].map((angle, i) => {
        const dx = Math.cos((angle - 360) * 0.05) * 50;
        const dy = 10 + i * 3;
        return (
          <path key={`cobRad${i}`} d={`M${340 + i * 12} 355 Q${345 + i * 12 + dx * 0.3} ${358 + dy * 0.2} ${350 + i * 12 + dx * 0.5} 360`}
            fill="none" stroke="#302520" strokeWidth="0.3" opacity={0.08 + i * 0.01} />
        );
      })}
      {/* Worn stone edge lines at ground transitions */}
      <line x1="165" y1="312" x2="558" y2="312" stroke="#3a3028" strokeWidth="0.5" opacity="0.12" />
      <line x1="165" y1="395" x2="558" y2="395" stroke="#1a1510" strokeWidth="0.6" opacity="0.1" />

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

      {/* === CLASSICAL STATUE — on a pedestal in the piazza === */}
      {/* Stone pedestal — rectangular base */}
      <rect x="196" y="328" width="18" height="30" fill="url(#ch5_statuePedestal)" opacity="0.7" />
      {/* Pedestal base — wider bottom step */}
      <rect x="192" y="356" width="26" height="5" fill="#3a3530" opacity="0.6" />
      {/* Pedestal cap — wider top step */}
      <rect x="194" y="325" width="22" height="4" fill="#4a4540" opacity="0.5" />
      {/* Statue figure — classical Roman/Renaissance style */}
      {/* Torso */}
      <path d="M202 290 Q200 300 202 315 Q204 320 208 315 L210 300 Q212 290 210 285 Z" fill="#3a3530" opacity="0.6" />
      {/* Head */}
      <circle cx="206" cy="283" r="4.5" fill="#3a3530" opacity="0.6" />
      {/* Laurel wreath on head */}
      <path d="M202 281 Q206 278 210 281" fill="none" stroke="#4a4540" strokeWidth="0.8" opacity="0.35" />
      {/* Right arm extended — oratorical gesture */}
      <path d="M210 295 Q216 290 220 288 Q222 287 224 288" fill="none" stroke="#3a3530" strokeWidth="2.5" opacity="0.5" />
      {/* Left arm holding scroll/toga */}
      <path d="M202 298 Q198 300 196 305" fill="none" stroke="#3a3530" strokeWidth="2.2" opacity="0.45" />
      {/* Toga drape */}
      <path d="M204 300 Q200 310 202 322" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.3" />
      <path d="M208 300 Q210 312 208 322" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.25" />
      {/* Legs — standing pose */}
      <path d="M203 315 L201 328" fill="none" stroke="#3a3530" strokeWidth="2.8" opacity="0.5" />
      <path d="M209 315 L211 328" fill="none" stroke="#3a3530" strokeWidth="2.8" opacity="0.5" />
      {/* Moonlight highlight on statue edge */}
      <path d="M210 285 L212 300 L211 315" fill="none" stroke="#5a5550" strokeWidth="0.4" opacity="0.15" />

      {/* === CENTRAL FOUNTAIN === */}
      <ellipse cx="380" cy="345" rx="40" ry="12" fill="#2e2a25" />
      <ellipse cx="380" cy="343" rx="38" ry="10" fill="#353028" />
      <ellipse cx="380" cy="340" rx="36" ry="9" fill="none" stroke="#4a4540" strokeWidth="1" opacity="0.5" />
      {/* Water pool */}
      <ellipse cx="380" cy="341" rx="33" ry="7" fill="#1e2a35" opacity="0.6" />
      <ellipse cx="380" cy="341" rx="30" ry="6" fill="url(#ch5_waterShimmer)">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* === FOUNTAIN DETAIL — carved basin figures and more water animation === */}
      {/* Decorative lion heads on basin — left and right */}
      <circle cx="350" cy="342" r="2.5" fill="#3a3530" opacity="0.5" />
      <path d="M348 341 Q350 339 352 341" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.3" />
      <circle cx="410" cy="342" r="2.5" fill="#3a3530" opacity="0.5" />
      <path d="M408 341 Q410 339 412 341" fill="none" stroke="#4a4540" strokeWidth="0.6" opacity="0.3" />
      {/* Water spout from lion mouth — left */}
      <path d="M350 344 Q349 347 350 350" fill="none" stroke="#3a5565" strokeWidth="0.5" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.1;0.12" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Water spout from lion mouth — right */}
      <path d="M410 344 Q411 347 410 350" fill="none" stroke="#3a5565" strokeWidth="0.5" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.05;0.08;0.1" dur="2.3s" repeatCount="indefinite" />
      </path>
      {/* Additional water ripple rings */}
      <ellipse cx="370" cy="341" rx="4" ry="1.2" fill="none" stroke="#506878" strokeWidth="0.25" opacity="0.08">
        <animate attributeName="rx" values="3;7;3" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="3.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="392" cy="342" rx="3" ry="1" fill="none" stroke="#506878" strokeWidth="0.25" opacity="0.06">
        <animate attributeName="rx" values="2;6;2" dur="4.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.06;0.02;0.06" dur="4.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Water cascade shimmer on pedestal */}
      <path d="M378 325 Q377 330 378 336" fill="none" stroke="#4a6575" strokeWidth="0.4" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.14;0.06;0.08" dur="2.2s" repeatCount="indefinite" />
      </path>
      <path d="M382 325 Q383 331 382 336" fill="none" stroke="#4a6575" strokeWidth="0.4" opacity="0.07">
        <animate attributeName="opacity" values="0.07;0.12;0.05;0.07" dur="2.6s" repeatCount="indefinite" />
      </path>
      {/* Basin rim decorative moulding */}
      <ellipse cx="380" cy="345" rx="42" ry="13" fill="none" stroke="#4a4540" strokeWidth="0.5" opacity="0.2" />

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

      {/* === CARRIAGE — parked near center-left building === */}
      {/* Carriage body — dark wooden box */}
      <rect x="202" y="332" width="28" height="18" fill="#1a1510" opacity="0.6" rx="1" />
      {/* Roof — slight curve */}
      <path d="M200 332 Q216 326 232 332" fill="#1a1510" opacity="0.55" />
      {/* Door panel line */}
      <line x1="216" y1="334" x2="216" y2="348" stroke="#2a2520" strokeWidth="0.5" opacity="0.3" />
      {/* Small window on carriage door */}
      <rect x="205" y="335" width="7" height="5" fill="#1e2a35" opacity="0.15" rx="0.5" />
      {/* Front wheel */}
      <circle cx="207" cy="354" r="6" fill="none" stroke="#2a2218" strokeWidth="1.5" opacity="0.55" />
      <circle cx="207" cy="354" r="1" fill="#2a2218" opacity="0.5" />
      {/* Spokes */}
      <line x1="207" y1="348" x2="207" y2="360" stroke="#2a2218" strokeWidth="0.4" opacity="0.35" />
      <line x1="201" y1="354" x2="213" y2="354" stroke="#2a2218" strokeWidth="0.4" opacity="0.35" />
      <line x1="203" y1="350" x2="211" y2="358" stroke="#2a2218" strokeWidth="0.4" opacity="0.3" />
      <line x1="211" y1="350" x2="203" y2="358" stroke="#2a2218" strokeWidth="0.4" opacity="0.3" />
      {/* Rear wheel — slightly larger */}
      <circle cx="227" cy="354" r="7" fill="none" stroke="#2a2218" strokeWidth="1.5" opacity="0.55" />
      <circle cx="227" cy="354" r="1" fill="#2a2218" opacity="0.5" />
      <line x1="227" y1="347" x2="227" y2="361" stroke="#2a2218" strokeWidth="0.4" opacity="0.35" />
      <line x1="220" y1="354" x2="234" y2="354" stroke="#2a2218" strokeWidth="0.4" opacity="0.35" />
      <line x1="222" y1="349" x2="232" y2="359" stroke="#2a2218" strokeWidth="0.4" opacity="0.3" />
      <line x1="232" y1="349" x2="222" y2="359" stroke="#2a2218" strokeWidth="0.4" opacity="0.3" />
      {/* Axle connecting wheels */}
      <line x1="207" y1="354" x2="227" y2="354" stroke="#1a1510" strokeWidth="1" opacity="0.4" />
      {/* Carriage shafts — extending forward, resting on ground */}
      <line x1="200" y1="345" x2="188" y2="352" stroke="#1a1510" strokeWidth="1.2" opacity="0.4" />
      <line x1="200" y1="348" x2="188" y2="355" stroke="#1a1510" strokeWidth="1.2" opacity="0.4" />

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

      {/* === ADDITIONAL STREET LAMP — warm radial glow near center-left === */}
      {/* Lamp 4 — between statue and fountain, shorter decorative post */}
      <line x1="320" y1="270" x2="320" y2="310" stroke="#3a3530" strokeWidth="2" />
      {/* Ornate lamp bracket */}
      <path d="M320 268 Q324 265 326 268" fill="none" stroke="#3a3530" strokeWidth="0.8" opacity="0.5" />
      <path d="M320 268 Q316 265 314 268" fill="none" stroke="#3a3530" strokeWidth="0.8" opacity="0.5" />
      <rect x="314" y="264" width="12" height="7" fill="#3a3530" rx="1" />
      {/* Glass panes — warm amber */}
      <rect x="316" y="266" width="8" height="3.5" fill="#c09050" opacity="0.18" rx="1">
        <animate attributeName="opacity" values="0.18;0.1;0.15;0.18" dur="2.4s" repeatCount="indefinite" />
      </rect>
      {/* Flame */}
      <ellipse cx="320" cy="267" rx="1.8" ry="2.5" fill="#d0a050" opacity="0.13">
        <animate attributeName="ry" values="2.5;2;2.5" dur="1.3s" repeatCount="indefinite" />
      </ellipse>
      {/* Warm radial glow */}
      <ellipse cx="320" cy="274" rx="30" ry="20" fill="url(#ch5_lampGlowWarm)">
        <animate attributeName="opacity" values="0.9;0.7;0.85;0.9" dur="2.6s" repeatCount="indefinite" />
      </ellipse>
      {/* Light pool on ground */}
      <ellipse cx="320" cy="318" rx="32" ry="6" fill="#c09050" opacity="0.03" />

      {/* Light pools on ground from other lamps */}
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

      {/* === DISCARDED NEWSPAPERS/PAMPHLETS — scattered on the ground === */}
      {/* Near the statue base */}
      <rect x="218" y="360" width="5" height="3.5" fill="#c0b898" opacity="0.04" transform="rotate(12 220 361)" rx="0.3" />
      <rect x="224" y="362" width="4.5" height="3" fill="#c0b898" opacity="0.035" transform="rotate(-8 226 363)" rx="0.3" />
      {/* Near the fountain */}
      <rect x="358" y="358" width="4" height="3" fill="#b0a888" opacity="0.04" transform="rotate(20 360 359)" rx="0.3" />
      <rect x="395" y="356" width="5" height="3.5" fill="#c0b898" opacity="0.03" transform="rotate(-15 397 357)" rx="0.3" />
      {/* Near card players */}
      <rect x="494" y="340" width="4.5" height="3" fill="#b0a888" opacity="0.035" transform="rotate(5 496 341)" rx="0.3" />
      {/* Near the brazier — singed edges */}
      <rect x="448" y="362" width="3.5" height="2.5" fill="#8a7858" opacity="0.04" transform="rotate(-25 449 363)" rx="0.3" />
      {/* Near the archway */}
      <rect x="178" y="358" width="4" height="3" fill="#b0a888" opacity="0.03" transform="rotate(30 180 359)" rx="0.3" />
      {/* Larger proclamation — partially unfolded */}
      <rect x="302" y="356" width="7" height="5" fill="#c0b898" opacity="0.045" transform="rotate(-3 305 358)" rx="0.3" />
      <line x1="303" y1="358" x2="308" y2="358" stroke="#8a7858" strokeWidth="0.3" opacity="0.03" />
      <line x1="303" y1="359.5" x2="307" y2="359.5" stroke="#8a7858" strokeWidth="0.3" opacity="0.025" />

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

      {/* === DOG — small dog silhouette near the soldiers === */}
      {/* Scruffy stray dog sitting near the brazier, watching soldiers eat */}
      <ellipse cx="460" cy="360" rx="5" ry="3" fill="#0e0c08" opacity="0.55" />
      {/* Head — alert, ears perked */}
      <circle cx="464" cy="356" r="2.5" fill="#0e0c08" opacity="0.55" />
      {/* Ears — pointed, attentive */}
      <path d="M462.5 354 L463.5 351.5 L464.5 354" fill="#0e0c08" opacity="0.5" />
      <path d="M464.5 354 L465.5 351.5 L466.5 354" fill="#0e0c08" opacity="0.5" />
      {/* Snout — pointed forward toward food */}
      <path d="M466 356 L468.5 355.5 L466 357" fill="#0e0c08" opacity="0.45" />
      {/* Front legs */}
      <line x1="458" y1="362" x2="457" y2="366" stroke="#0e0c08" strokeWidth="1" opacity="0.45" />
      <line x1="460" y1="362" x2="459" y2="366" stroke="#0e0c08" strokeWidth="1" opacity="0.45" />
      {/* Tail — curled up behind */}
      <path d="M455 359 Q452 356 453 353" fill="none" stroke="#0e0c08" strokeWidth="1" opacity="0.4" />
      {/* Tiny eye glint */}
      <circle cx="465" cy="355.5" r="0.4" fill="#c0a050" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* === TRICOLOR BANNERS — hung from balconies and strung across the piazza === */}
      {/* Large banner draped from center-left building balcony */}
      <rect x="220" y="142" width="8" height="22" fill="#1a3a8a" opacity="0.35" />
      <rect x="228" y="142" width="8" height="22" fill="#e8e8e0" opacity="0.25" />
      <rect x="236" y="142" width="8" height="22" fill="#c03020" opacity="0.35" />
      {/* Banner sway animation */}
      <g opacity="0.3">
        <rect x="220" y="142" width="24" height="22" fill="none" stroke="#2a2520" strokeWidth="0.4">
          <animate attributeName="x" values="220;221;220;219;220" dur="6s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Small pennant on left palazzo — blue-white-red */}
      <polygon points="148,95 148,115 138,105" fill="#1a3a8a" opacity="0.3">
        <animate attributeName="points" values="148,95 148,115 138,105;148,95 148,115 136,106;148,95 148,115 138,105" dur="4s" repeatCount="indefinite" />
      </polygon>
      <polygon points="148,100 148,110 140,105" fill="#e8e8e0" opacity="0.2" />
      {/* Banner draped from right palazzo window */}
      <rect x="630" y="130" width="6" height="18" fill="#1a3a8a" opacity="0.3" />
      <rect x="636" y="130" width="6" height="18" fill="#e8e8e0" opacity="0.22" />
      <rect x="642" y="130" width="6" height="18" fill="#c03020" opacity="0.3" />
      {/* Tricolor ribbon strung across piazza — between lamps */}
      <path d="M240 228 Q300 218 320 222 Q360 215 400 220 Q460 212 500 235" fill="none" stroke="#1a3a8a" strokeWidth="1.2" opacity="0.15">
        <animate attributeName="d" values="M240 228 Q300 218 320 222 Q360 215 400 220 Q460 212 500 235;M240 228 Q300 220 320 224 Q360 217 400 222 Q460 214 500 235;M240 228 Q300 218 320 222 Q360 215 400 220 Q460 212 500 235" dur="7s" repeatCount="indefinite" />
      </path>
      <path d="M240 229 Q300 219 320 223 Q360 216 400 221 Q460 213 500 236" fill="none" stroke="#e8e8e0" strokeWidth="1" opacity="0.1">
        <animate attributeName="d" values="M240 229 Q300 219 320 223 Q360 216 400 221 Q460 213 500 236;M240 229 Q300 221 320 225 Q360 218 400 223 Q460 215 500 236;M240 229 Q300 219 320 223 Q360 216 400 221 Q460 213 500 236" dur="7s" repeatCount="indefinite" />
      </path>
      <path d="M240 230 Q300 220 320 224 Q360 217 400 222 Q460 214 500 237" fill="none" stroke="#c03020" strokeWidth="1.2" opacity="0.15">
        <animate attributeName="d" values="M240 230 Q300 220 320 224 Q360 217 400 222 Q460 214 500 237;M240 230 Q300 222 320 226 Q360 219 400 224 Q460 216 500 237;M240 230 Q300 220 320 224 Q360 217 400 222 Q460 214 500 237" dur="7s" repeatCount="indefinite" />
      </path>
      {/* Small pennant flags hanging from the ribbon at intervals */}
      {[280, 330, 380, 440].map((x, i) => (
        <React.Fragment key={`pnnt${i}`}>
          <polygon points={`${x},${218 + i * 0.5} ${x - 3},${228 + i * 0.5} ${x + 3},${228 + i * 0.5}`}
            fill={i % 2 === 0 ? '#1a3a8a' : '#c03020'} opacity="0.18">
            <animate attributeName="points"
              values={`${x},${218 + i * 0.5} ${x - 3},${228 + i * 0.5} ${x + 3},${228 + i * 0.5};${x + 1},${218 + i * 0.5} ${x - 2},${228 + i * 0.5} ${x + 4},${228 + i * 0.5};${x},${218 + i * 0.5} ${x - 3},${228 + i * 0.5} ${x + 3},${228 + i * 0.5}`}
              dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
          </polygon>
        </React.Fragment>
      ))}

      {/* === GARLANDS — floral rope garlands draped between buildings === */}
      {/* Garland between left palazzo and center-left — green leafy swag */}
      <path d="M160 180 Q168 195 178 180" fill="none" stroke="#2a4520" strokeWidth="1.8" opacity="0.25">
        <animate attributeName="d" values="M160 180 Q168 195 178 180;M160 180 Q168 197 178 180;M160 180 Q168 195 178 180" dur="5.5s" repeatCount="indefinite" />
      </path>
      {/* Tiny flower clusters on the garland */}
      <circle cx="164" cy="188" r="1" fill="#d06050" opacity="0.18" />
      <circle cx="170" cy="191" r="0.8" fill="#e0d060" opacity="0.15" />
      <circle cx="175" cy="187" r="0.9" fill="#d06050" opacity="0.16" />
      {/* Garland above arcade entrance — celebratory */}
      <path d="M570 278 Q610 290 650 278" fill="none" stroke="#2a4520" strokeWidth="2" opacity="0.22">
        <animate attributeName="d" values="M570 278 Q610 290 650 278;M570 278 Q610 292 650 278;M570 278 Q610 290 650 278" dur="6s" repeatCount="indefinite" />
      </path>
      <circle cx="590" cy="285" r="1.2" fill="#e0d060" opacity="0.15" />
      <circle cx="610" cy="287" r="1" fill="#d06050" opacity="0.14" />
      <circle cx="630" cy="284" r="1.1" fill="#e0d060" opacity="0.13" />

      {/* === ENHANCED DUOMO SPIRES — more cathedral detail visible in the skyline === */}
      {/* Additional Gothic pinnacles — the famous "forest of spires" */}
      <path d="M340 90 L341.5 78 L343 90" fill="#131120" opacity="0.5" />
      <path d="M457 90 L458.5 80 L460 90" fill="#131120" opacity="0.48" />
      <path d="M335 90 L336 84 L337 90" fill="#121020" opacity="0.4" />
      <path d="M463 90 L464 85 L465 90" fill="#121020" opacity="0.4" />
      {/* Flying buttress hints — arched supports between spires */}
      <path d="M354 88 Q358 82 362 86" fill="none" stroke="#1a1628" strokeWidth="0.4" opacity="0.3" />
      <path d="M438 88 Q434 83 430 87" fill="none" stroke="#1a1628" strokeWidth="0.4" opacity="0.3" />
      {/* Rose window — circular tracery on dome face */}
      <circle cx="400" cy="72" r="5" fill="none" stroke="#1e1a28" strokeWidth="0.5" opacity="0.3" />
      <circle cx="400" cy="72" r="3" fill="none" stroke="#1e1a28" strokeWidth="0.3" opacity="0.2" />
      {/* Tracery spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={`rose${angle}`}
            x1={400 + Math.cos(rad) * 3} y1={72 + Math.sin(rad) * 3}
            x2={400 + Math.cos(rad) * 5} y2={72 + Math.sin(rad) * 5}
            stroke="#1e1a28" strokeWidth="0.3" opacity="0.2" />
        );
      })}
      {/* Faint moonlit glow on tallest spire cross */}
      <circle cx="400" cy="30" r="1.5" fill="#c0b888" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.06" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* === RENAISSANCE ARCHES — decorative arched colonnade on center-left ground floor === */}
      {/* Three arches forming a loggia at ground level */}
      {[185, 220, 255].map((x, i) => (
        <React.Fragment key={`loggia${i}`}>
          <path d={`M${x} 310 Q${x + 15} 290 ${x + 30} 310`} fill="#0e0c08" opacity="0.6" />
          <path d={`M${x - 1} 312 Q${x + 15} 288 ${x + 31} 312`} fill="none" stroke="#4a4540" strokeWidth="1" opacity="0.3" />
          {/* Keystone */}
          <rect x={x + 13} y={289 + i} width="4" height="4" fill="#4a4540" opacity="0.25" rx="0.5" />
          {/* Column between arches */}
          {i < 2 && (
            <React.Fragment>
              <rect x={x + 29} y={295} width="4" height="18" fill="#3a3530" opacity="0.5" />
              <rect x={x + 28} y={293} width="6" height="3" fill="#4a4540" opacity="0.3" />
              <rect x={x + 28} y={310} width="6" height="3" fill="#4a4540" opacity="0.3" />
            </React.Fragment>
          )}
        </React.Fragment>
      ))}

      {/* === MARKET STALL — left side near the archway === */}
      {/* Wooden stall frame — a vendor's booth with awning */}
      <rect x="170" y="330" width="22" height="22" fill="#1a1510" opacity="0.55" />
      {/* Awning — striped canvas, tilted */}
      <path d="M168 330 L194 330 L196 322 L166 322 Z" fill="#3a2018" opacity="0.4" />
      <line x1="172" y1="322" x2="174" y2="330" stroke="#4a3028" strokeWidth="0.5" opacity="0.25" />
      <line x1="180" y1="322" x2="182" y2="330" stroke="#4a3028" strokeWidth="0.5" opacity="0.25" />
      <line x1="188" y1="322" x2="190" y2="330" stroke="#4a3028" strokeWidth="0.5" opacity="0.25" />
      {/* Goods on display — small shapes suggesting wares */}
      <circle cx="176" cy="340" r="2" fill="#c09050" opacity="0.12" />
      <circle cx="182" cy="342" r="1.8" fill="#d08040" opacity="0.1" />
      <rect x="185" y="338" width="4" height="3" fill="#8a7050" opacity="0.1" rx="0.5" />
      {/* Vendor figure — standing behind the stall */}
      <circle cx="180" cy="318" r="3" fill="#0e0c08" opacity="0.55" />
      <path d="M177 321 Q178 328 179 332 L181 332 Q182 328 183 321 Z" fill="#0e0c08" opacity="0.5" />
      {/* Vendor's apron */}
      <path d="M177 325 Q180 327 183 325" fill="none" stroke="#2a2520" strokeWidth="0.8" opacity="0.3" />

      {/* === SECOND MARKET STALL — right side near the arcade === */}
      <rect x="640" y="332" width="20" height="20" fill="#1a1510" opacity="0.5" />
      <path d="M638 332 L662 332 L664 325 L636 325 Z" fill="#2a1818" opacity="0.38" />
      <line x1="644" y1="325" x2="645" y2="332" stroke="#3a2520" strokeWidth="0.5" opacity="0.22" />
      <line x1="652" y1="325" x2="653" y2="332" stroke="#3a2520" strokeWidth="0.5" opacity="0.22" />
      {/* Baskets of fruit */}
      <ellipse cx="646" cy="340" rx="3" ry="2" fill="#6a5030" opacity="0.18" />
      <circle cx="645" cy="339" r="1" fill="#c06030" opacity="0.12" />
      <circle cx="647" cy="338" r="0.8" fill="#d0a030" opacity="0.1" />
      <ellipse cx="655" cy="341" rx="2.5" ry="1.8" fill="#6a5030" opacity="0.15" />

      {/* === SOLDIERS IN PARADE FORMATION — marching through the piazza === */}
      {/* Column of soldiers, three abreast, moving left to right across the piazza */}
      {[0, 1, 2, 3, 4].map((col) => (
        <React.Fragment key={`parade${col}`}>
          {[0, 1, 2].map((row) => {
            const x = 290 + col * 18;
            const y = 365 + row * 6;
            const op = 0.5 - col * 0.06;
            return (
              <React.Fragment key={`pm${col}${row}`}>
                {/* Soldier torso */}
                <path d={`M${x} ${y} Q${x - 1} ${y - 6} ${x} ${y - 10} Q${x + 1} ${y - 13} ${x + 2} ${y - 10} L${x + 3} ${y} Z`}
                  fill="#0a0a08" opacity={op} />
                {/* Head with shako */}
                <circle cx={x + 1} cy={y - 14} r={2.2} fill="#0a0a08" opacity={op} />
                <rect x={x - 0.5} y={y - 18} width={3} height={4} fill="#0a0a08" opacity={op * 0.9} rx="0.5" />
                {/* Musket — vertical, on shoulder */}
                <line x1={x + 3.5} y1={y - 18} x2={x + 3.5} y2={y - 4}
                  stroke="#1a1815" strokeWidth="0.8" opacity={op * 0.8} />
                {/* Bayonet glint */}
                <line x1={x + 3.5} y1={y - 20} x2={x + 3.5} y2={y - 18}
                  stroke="#5a5550" strokeWidth="0.4" opacity={op * 0.4} />
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
      {/* Drummer boy at head of column */}
      <circle cx="280" cy="354" r="2.5" fill="#0a0a08" opacity="0.55" />
      <path d="M278 357 Q279 362 280 367 L282 367 Q283 362 284 357 Z" fill="#0a0a08" opacity="0.5" />
      {/* Drum slung at side */}
      <ellipse cx="276" cy="363" rx="3" ry="2" fill="#3a2818" opacity="0.35" />
      <ellipse cx="276" cy="363" rx="3" ry="2" fill="none" stroke="#4a3828" strokeWidth="0.4" opacity="0.25" />
      {/* Drumstick arms */}
      <path d="M278 360 Q275 362 274 361" fill="none" stroke="#0a0a08" strokeWidth="1" opacity="0.4" />
      <path d="M282 360 Q279 363 278 362" fill="none" stroke="#0a0a08" strokeWidth="1" opacity="0.4" />

      {/* === CHEERING TOWNSPEOPLE — lining the piazza edges === */}
      {/* Group near left building — women and children waving */}
      {/* Woman 1 — arm raised, cheering */}
      <circle cx="162" cy="318" r="3" fill="#151210" opacity="0.6" />
      <path d="M159 321 Q160 328 161 334 L163 334 Q164 328 165 321 Z" fill="#151210" opacity="0.55" />
      {/* Raised arm waving */}
      <path d="M165 324 Q168 318 167 312" fill="none" stroke="#151210" strokeWidth="1.5" opacity="0.45">
        <animate attributeName="d" values="M165 324 Q168 318 167 312;M165 324 Q169 316 168 310;M165 324 Q168 318 167 312" dur="1.8s" repeatCount="indefinite" />
      </path>
      {/* Woman 2 — clapping */}
      <circle cx="152" cy="322" r="2.8" fill="#131010" opacity="0.55" />
      <path d="M149 325 Q150 330 151 336 L153 336 Q154 330 155 325 Z" fill="#131010" opacity="0.5" />
      <path d="M149 328 Q151 326 153 328" fill="none" stroke="#131010" strokeWidth="1.2" opacity="0.4">
        <animate attributeName="d" values="M149 328 Q151 326 153 328;M149 327 Q151 325 153 327;M149 328 Q151 326 153 328" dur="0.8s" repeatCount="indefinite" />
      </path>
      {/* Child on shoulders — waving a small flag */}
      <circle cx="145" cy="316" r="2" fill="#131010" opacity="0.5" />
      <path d="M143 318 Q144 322 145 326 L147 326 Q148 322 149 318 Z" fill="#131010" opacity="0.45" />
      {/* Small tricolor flag */}
      <line x1="147" y1="312" x2="147" y2="318" stroke="#2a2520" strokeWidth="0.5" opacity="0.4" />
      <rect x="147" y="312" width="2" height="1.2" fill="#1a3a8a" opacity="0.3" />
      <rect x="149" y="312" width="2" height="1.2" fill="#e8e8e0" opacity="0.2" />
      <rect x="151" y="312" width="2" height="1.2" fill="#c03020" opacity="0.3" />
      {/* Waving animation on the flag */}
      <line x1="147" y1="312" x2="153" y2="312" stroke="#c03020" strokeWidth="0.4" opacity="0.2">
        <animate attributeName="x2" values="153;154;153;152;153" dur="1.5s" repeatCount="indefinite" />
      </line>

      {/* Group near right side — men cheering */}
      {/* Man 1 — hat raised high */}
      <circle cx="540" cy="320" r="3.2" fill="#121010" opacity="0.6" />
      <path d="M537 323 Q538 330 539 338 L541 338 Q542 330 543 323 Z" fill="#121010" opacity="0.55" />
      {/* Arm with hat raised */}
      <path d="M543 326 Q546 318 545 310" fill="none" stroke="#121010" strokeWidth="1.5" opacity="0.45">
        <animate attributeName="d" values="M543 326 Q546 318 545 310;M543 326 Q547 316 546 308;M543 326 Q546 318 545 310" dur="2.2s" repeatCount="indefinite" />
      </path>
      {/* Hat silhouette at hand */}
      <ellipse cx="545" cy="308" rx="4" ry="1.5" fill="#121010" opacity="0.35">
        <animate attributeName="cy" values="308;306;308" dur="2.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Man 2 — arms wide, shouting */}
      <circle cx="548" cy="324" r="2.8" fill="#101010" opacity="0.52" />
      <path d="M546 327 Q547 332 548 338 L550 338 Q551 332 552 327 Z" fill="#101010" opacity="0.48" />
      <path d="M546 330 Q542 328 540 330" fill="none" stroke="#101010" strokeWidth="1.2" opacity="0.35" />
      <path d="M552 330 Q556 328 558 330" fill="none" stroke="#101010" strokeWidth="1.2" opacity="0.35" />

      {/* Group near fountain — Italian civilians watching the parade */}
      {/* Elderly woman with headscarf */}
      <circle cx="375" cy="328" r="2.5" fill="#0e0c08" opacity="0.55" />
      <path d="M373 330 Q374 336 375 342 L377 342 Q378 336 379 330 Z" fill="#0e0c08" opacity="0.5" />
      {/* Headscarf draped */}
      <path d="M372 327 Q375 325 378 327 Q380 330 378 333" fill="none" stroke="#2a2218" strokeWidth="0.8" opacity="0.3" />
      {/* Young girl — holding flowers */}
      <circle cx="383" cy="332" r="2.2" fill="#0e0c08" opacity="0.5" />
      <path d="M381 334 Q382 338 383 344 L385 344 Q386 338 387 334 Z" fill="#0e0c08" opacity="0.45" />
      {/* Small bouquet in hand */}
      <circle cx="387" cy="336" r="1.5" fill="#d06050" opacity="0.15" />
      <circle cx="388" cy="335" r="1" fill="#e0d060" opacity="0.12" />

      {/* === ITALIAN CIVILIANS IN PERIOD DRESS — along the piazza === */}
      {/* Gentleman in tailcoat and top hat — near right lamppost */}
      <circle cx="515" cy="296" r="3.5" fill="#0a0a08" opacity="0.65" />
      {/* Top hat */}
      <rect x="512.5" y="289" width="5" height="7" fill="#0a0a08" opacity="0.6" rx="0.5" />
      <rect x="511" y="296" width="8" height="1.5" fill="#0a0a08" opacity="0.55" />
      <path d="M512 300 Q513 308 514 316 L516 316 Q517 308 518 300 Z" fill="#0a0a08" opacity="0.6" />
      {/* Tailcoat tails */}
      <path d="M513 316 L512 325" fill="none" stroke="#0a0a08" strokeWidth="1.5" opacity="0.4" />
      <path d="M517 316 L518 325" fill="none" stroke="#0a0a08" strokeWidth="1.5" opacity="0.4" />
      {/* Walking cane */}
      <line x1="520" y1="305" x2="522" y2="328" stroke="#3a3028" strokeWidth="0.8" opacity="0.35" />

      {/* Priest in black cassock — near the statue, observing quietly */}
      <circle cx="230" cy="316" r="3" fill="#0a0808" opacity="0.6" />
      <path d="M227 319 Q228 328 229 340 L231 340 Q232 328 233 319 Z" fill="#0a0808" opacity="0.55" />
      {/* Wide cassock skirt */}
      <path d="M226 340 Q230 342 234 340 L236 358 L224 358 Z" fill="#0a0808" opacity="0.4" />
      {/* Biretta hat */}
      <rect x="228" y="312" width="4" height="3.5" fill="#0a0808" opacity="0.5" rx="0.3" />

      {/* Mother with baby — near the archway watching procession */}
      <circle cx="195" cy="320" r="3" fill="#121010" opacity="0.55" />
      <path d="M192 323 Q193 330 194 338 L196 338 Q197 330 198 323 Z" fill="#121010" opacity="0.5" />
      {/* Baby bundle in arms */}
      <ellipse cx="190" cy="328" rx="2.5" ry="3.5" fill="#1a1815" opacity="0.4" />
      <circle cx="190" cy="326" r="1.5" fill="#1a1815" opacity="0.35" />

      {/* === STREET MUSICIANS — additional performers in the celebration === */}
      {/* Accordion player — seated near the left of the piazza */}
      <circle cx="250" cy="336" r="3.5" fill="#0a0a08" opacity="0.65" />
      <path d="M247 339 Q248 345 249 352 L251 352 Q252 345 253 339 Z" fill="#0a0a08" opacity="0.6" />
      {/* Accordion — bellows shape between hands */}
      <rect x="242" y="342" width="5" height="8" fill="#1a1510" opacity="0.4" rx="0.5" />
      <rect x="254" y="342" width="4" height="7" fill="#1a1510" opacity="0.35" rx="0.5" />
      {/* Bellows in between */}
      <path d="M247 344 L254 344 M247 346 L254 346 M247 348 L254 348" fill="none" stroke="#2a2520" strokeWidth="0.4" opacity="0.25">
        <animate attributeName="d" values="M247 344 L254 344 M247 346 L254 346 M247 348 L254 348;M247 344 L255 344 M247 346 L255 346 M247 348 L255 348;M247 344 L254 344 M247 346 L254 346 M247 348 L254 348" dur="1.6s" repeatCount="indefinite" />
      </path>
      {/* Arms operating the bellows */}
      <path d="M247 341 Q244 343 243 346" fill="none" stroke="#0a0a08" strokeWidth="1.5" opacity="0.5" />
      <path d="M253 341 Q256 343 257 345" fill="none" stroke="#0a0a08" strokeWidth="1.5" opacity="0.5" />

      {/* Tambourine player — dancing near the fountain */}
      <circle cx="395" cy="322" r="3" fill="#0c0a08" opacity="0.6" />
      <path d="M392 325 Q393 330 394 336 L396 336 Q397 330 398 325 Z" fill="#0c0a08" opacity="0.55" />
      {/* Raised arm with tambourine */}
      <path d="M398 327 Q401 320 400 315" fill="none" stroke="#0c0a08" strokeWidth="1.5" opacity="0.45">
        <animate attributeName="d" values="M398 327 Q401 320 400 315;M398 327 Q402 318 401 313;M398 327 Q401 320 400 315" dur="1.2s" repeatCount="indefinite" />
      </path>
      {/* Tambourine — small circle */}
      <circle cx="400" cy="313" r="3" fill="none" stroke="#5a4530" strokeWidth="0.8" opacity="0.3">
        <animate attributeName="cy" values="313;311;313" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* Skirt swirling */}
      <path d="M390 336 Q395 340 400 336 L402 355 L388 355 Z" fill="#0c0a08" opacity="0.4" />

      {/* === FLOWER PETALS — scattered and falling through the air === */}
      {/* Petals thrown by the crowd, drifting down through lamplight */}
      {[
        { cx: 200, cy: 250, r: 1.2, c: '#d06050', d: 8, dx: 15, o: 0.18 },
        { cx: 260, cy: 220, r: 1.0, c: '#e0d060', d: 10, dx: 20, o: 0.15 },
        { cx: 330, cy: 240, r: 1.1, c: '#d06050', d: 9, dx: -12, o: 0.16 },
        { cx: 400, cy: 210, r: 0.9, c: '#e8e0c0', d: 11, dx: 18, o: 0.14 },
        { cx: 450, cy: 260, r: 1.0, c: '#d06050', d: 7, dx: -15, o: 0.17 },
        { cx: 520, cy: 230, r: 1.2, c: '#e0d060', d: 12, dx: 10, o: 0.13 },
        { cx: 300, cy: 270, r: 0.8, c: '#e8e0c0', d: 9.5, dx: -8, o: 0.15 },
        { cx: 480, cy: 200, r: 1.0, c: '#d06050', d: 10.5, dx: 14, o: 0.16 },
        { cx: 350, cy: 190, r: 0.9, c: '#e0d060', d: 8.5, dx: -10, o: 0.14 },
        { cx: 420, cy: 280, r: 1.1, c: '#d06050', d: 11.5, dx: 12, o: 0.17 },
        { cx: 240, cy: 280, r: 0.8, c: '#e8e0c0', d: 7.5, dx: -18, o: 0.12 },
        { cx: 490, cy: 250, r: 1.0, c: '#e0d060', d: 9.2, dx: 16, o: 0.15 },
      ].map((p, i) => (
        <ellipse key={`petal${i}`} cx={p.cx} cy={p.cy} rx={p.r} ry={p.r * 0.6}
          fill={p.c} opacity={p.o} transform={`rotate(${i * 30} ${p.cx} ${p.cy})`}>
          <animate attributeName="cy" values={`${p.cy};${p.cy + 100};${p.cy}`} dur={`${p.d}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${p.cx};${p.cx + p.dx};${p.cx}`} dur={`${p.d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${p.o};${p.o * 0.3};${p.o}`} dur={`${p.d}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* === CONFETTI — small squares and triangles fluttering down === */}
      {[
        { x: 220, y: 180, w: 2, h: 1.5, c: '#1a3a8a', d: 6, rot: 15, o: 0.2 },
        { x: 280, y: 160, w: 1.8, h: 1.2, c: '#c03020', d: 7, rot: -20, o: 0.18 },
        { x: 340, y: 170, w: 2.2, h: 1.4, c: '#e8e0c0', d: 8, rot: 30, o: 0.15 },
        { x: 400, y: 150, w: 1.5, h: 1, c: '#1a3a8a', d: 9, rot: -45, o: 0.17 },
        { x: 460, y: 175, w: 2, h: 1.3, c: '#c03020', d: 6.5, rot: 25, o: 0.19 },
        { x: 510, y: 165, w: 1.6, h: 1.1, c: '#e0d060', d: 7.5, rot: -35, o: 0.16 },
        { x: 250, y: 200, w: 1.8, h: 1.2, c: '#c03020', d: 8.5, rot: 40, o: 0.14 },
        { x: 370, y: 195, w: 2, h: 1.5, c: '#1a3a8a', d: 5.5, rot: -15, o: 0.2 },
        { x: 440, y: 185, w: 1.5, h: 1, c: '#e8e0c0', d: 7.2, rot: 50, o: 0.13 },
        { x: 310, y: 210, w: 2.2, h: 1.4, c: '#e0d060', d: 9.5, rot: -28, o: 0.15 },
        { x: 490, y: 195, w: 1.7, h: 1.1, c: '#1a3a8a', d: 6.8, rot: 18, o: 0.17 },
        { x: 355, y: 145, w: 1.9, h: 1.3, c: '#c03020', d: 8.2, rot: -40, o: 0.16 },
      ].map((c, i) => (
        <rect key={`conf${i}`} x={c.x} y={c.y} width={c.w} height={c.h}
          fill={c.c} opacity={c.o} rx="0.2"
          transform={`rotate(${c.rot} ${c.x + c.w / 2} ${c.y + c.h / 2})`}>
          <animate attributeName="y" values={`${c.y};${c.y + 140};${c.y}`} dur={`${c.d}s`} repeatCount="indefinite" />
          <animate attributeName="x" values={`${c.x};${c.x + (i % 2 === 0 ? 20 : -20)};${c.x}`} dur={`${c.d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${c.o};${c.o * 0.2};${c.o}`} dur={`${c.d}s`} repeatCount="indefinite" />
          <animate attributeName="transform"
            values={`rotate(${c.rot} ${c.x + c.w / 2} ${c.y + c.h / 2});rotate(${c.rot + 180} ${c.x + c.w / 2} ${c.y + c.h / 2 + 70});rotate(${c.rot + 360} ${c.x + c.w / 2} ${c.y + c.h / 2})`}
            dur={`${c.d}s`} repeatCount="indefinite" />
        </rect>
      ))}

      {/* === WAVING FLAGS — held by soldiers and civilians === */}
      {/* Large tricolor flag on a pole — carried by parade standard-bearer */}
      <line x1="285" y1="340" x2="285" y2="290" stroke="#2a2218" strokeWidth="1.5" opacity="0.55" />
      {/* Flag cloth — waving */}
      <path d="M285 290 Q295 287 305 292 L305 305 Q295 300 285 303 Z" fill="#1a3a8a" opacity="0.3">
        <animate attributeName="d" values="M285 290 Q295 287 305 292 L305 305 Q295 300 285 303 Z;M285 290 Q295 285 307 291 L307 304 Q295 298 285 303 Z;M285 290 Q295 287 305 292 L305 305 Q295 300 285 303 Z" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M305 292 Q315 289 325 294 L325 305 Q315 302 305 305 Z" fill="#e8e8e0" opacity="0.2">
        <animate attributeName="d" values="M305 292 Q315 289 325 294 L325 305 Q315 302 305 305 Z;M307 291 Q317 288 327 293 L327 304 Q317 301 307 304 Z;M305 292 Q315 289 325 294 L325 305 Q315 302 305 305 Z" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M325 294 Q335 291 345 296 L345 305 Q335 302 325 305 Z" fill="#c03020" opacity="0.3">
        <animate attributeName="d" values="M325 294 Q335 291 345 296 L345 305 Q335 302 325 305 Z;M327 293 Q337 290 347 295 L347 304 Q337 301 327 304 Z;M325 294 Q335 291 345 296 L345 305 Q335 302 325 305 Z" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Flag pole finial — eagle ornament */}
      <circle cx="285" cy="288" r="2" fill="#c0a050" opacity="0.2" />

      {/* === FOUNTAIN ENHANCED — additional water jets for celebration === */}
      {/* Central water spout — taller during the celebration */}
      <path d="M380 318 Q381 305 380 295" fill="none" stroke="#4a6575" strokeWidth="0.8" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.16;0.08;0.1" dur="2s" repeatCount="indefinite" />
        <animate attributeName="d" values="M380 318 Q381 305 380 295;M380 318 Q379 303 380 293;M380 318 Q381 305 380 295" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Side water arcs — decorative jets */}
      <path d="M368 335 Q365 325 370 320" fill="none" stroke="#4a6575" strokeWidth="0.5" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.14;0.06;0.08" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M392 335 Q395 325 390 320" fill="none" stroke="#4a6575" strokeWidth="0.5" opacity="0.07">
        <animate attributeName="opacity" values="0.07;0.12;0.05;0.07" dur="2.8s" repeatCount="indefinite" />
      </path>
      {/* Water splash droplets at the base of the spout */}
      {[374, 378, 382, 386].map((x, i) => (
        <circle key={`splash${i}`} cx={x} cy={338} r={0.6} fill="#506878" opacity={0.06}>
          <animate attributeName="cy" values="338;335;338" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* === SCATTERED FLOWERS ON THE GROUND — thrown by the crowd === */}
      {/* Rose petals and wildflowers on the cobblestones */}
      <circle cx="310" cy="350" r="1" fill="#c04040" opacity="0.08" />
      <circle cx="325" cy="355" r="0.8" fill="#d06050" opacity="0.07" />
      <circle cx="348" cy="358" r="1.1" fill="#e0d060" opacity="0.06" />
      <circle cx="390" cy="356" r="0.9" fill="#c04040" opacity="0.08" />
      <circle cx="415" cy="352" r="1" fill="#d06050" opacity="0.07" />
      <circle cx="440" cy="362" r="0.8" fill="#e0d060" opacity="0.06" />
      <circle cx="470" cy="355" r="1.1" fill="#c04040" opacity="0.07" />
      <circle cx="500" cy="360" r="0.9" fill="#d06050" opacity="0.06" />
      {/* Small leaf sprigs */}
      <path d="M320 352 Q322 350 324 352" fill="#2a4020" fillOpacity="0.06" stroke="none" />
      <path d="M405 358 Q407 356 409 358" fill="#2a4020" fillOpacity="0.05" stroke="none" />
      <path d="M462 357 Q464 355 466 357" fill="#2a4020" fillOpacity="0.06" stroke="none" />

      {/* === ADDITIONAL BALCONY SPECTATORS — people watching from upper floors === */}
      {/* Woman leaning out of center-left building, throwing flowers */}
      <circle cx="240" cy="108" r="2.5" fill="#1a1518" opacity="0.55" />
      <path d="M238 111 Q239 116 240 120 L242 120 Q243 116 244 111 Z" fill="#1a1518" opacity="0.5" />
      {/* Arm extended outward, tossing */}
      <path d="M244 114 Q248 112 250 114" fill="none" stroke="#1a1518" strokeWidth="1.2" opacity="0.4">
        <animate attributeName="d" values="M244 114 Q248 112 250 114;M244 114 Q249 110 252 112;M244 114 Q248 112 250 114" dur="3s" repeatCount="indefinite" />
      </path>

      {/* Man in right building window — applauding */}
      <circle cx="674" cy="112" r="2.2" fill="#1a1518" opacity="0.5" />
      <rect x="672" y="114" width="4" height="5" fill="#1a1518" opacity="0.45" />
      {/* Clapping hands visible in front */}
      <path d="M671 117 Q673 115 675 117" fill="none" stroke="#1a1518" strokeWidth="0.8" opacity="0.35">
        <animate attributeName="d" values="M671 117 Q673 115 675 117;M671 116 Q673 114 675 116;M671 117 Q673 115 675 117" dur="0.9s" repeatCount="indefinite" />
      </path>

      {/* Children in left palazzo upper window — waving excitedly */}
      <circle cx="82" cy="107" r="1.8" fill="#1a1518" opacity="0.5" />
      <circle cx="87" cy="109" r="1.5" fill="#1a1518" opacity="0.45" />
      {/* Small arm waving */}
      <path d="M84 105 Q85 102 84 100" fill="none" stroke="#1a1518" strokeWidth="0.8" opacity="0.35">
        <animate attributeName="d" values="M84 105 Q85 102 84 100;M84 105 Q86 101 85 99;M84 105 Q85 102 84 100" dur="1.5s" repeatCount="indefinite" />
      </path>

      {/* === DUST MOTES — tiny particles floating in lamplight beams === */}
      {[
        { cx: 238, cy: 228, r: 0.5, d: 7, dy: -8, o: 0.12 },
        { cx: 242, cy: 240, r: 0.4, d: 9, dy: -12, o: 0.1 },
        { cx: 235, cy: 250, r: 0.6, d: 6, dy: -6, o: 0.08 },
        { cx: 244, cy: 235, r: 0.35, d: 8, dy: -10, o: 0.11 },
        { cx: 498, cy: 238, r: 0.5, d: 8, dy: -9, o: 0.1 },
        { cx: 502, cy: 248, r: 0.4, d: 7, dy: -7, o: 0.09 },
        { cx: 496, cy: 255, r: 0.55, d: 10, dy: -11, o: 0.08 },
        { cx: 504, cy: 244, r: 0.3, d: 6.5, dy: -5, o: 0.11 },
        { cx: 318, cy: 270, r: 0.45, d: 9, dy: -8, o: 0.09 },
        { cx: 322, cy: 278, r: 0.5, d: 7.5, dy: -10, o: 0.1 },
        { cx: 316, cy: 265, r: 0.35, d: 8.5, dy: -6, o: 0.08 },
        { cx: 156, cy: 242, r: 0.4, d: 6, dy: -5, o: 0.09 },
        { cx: 564, cy: 284, r: 0.45, d: 7, dy: -7, o: 0.08 },
      ].map((m, i) => (
        <circle key={`dust${i}`} cx={m.cx} cy={m.cy} r={m.r} fill="#d8c080" opacity={m.o}>
          <animate attributeName="cy" values={`${m.cy};${m.cy + m.dy};${m.cy}`} dur={`${m.d}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${m.cx};${m.cx + (i % 2 === 0 ? 3 : -3)};${m.cx}`} dur={`${m.d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${m.o};${m.o * 2};${m.o * 0.5};${m.o}`} dur={`${m.d}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* === BUILDING SHADOWS — cast on the piazza ground from palazzo facades === */}
      {/* Left palazzo shadow — long shadow stretching across cobblestones */}
      <polygon points="165,310 165,400 230,400 195,310" fill="#0a0808" opacity="0.08" />
      {/* Right palazzo shadow — angled from arcade */}
      <polygon points="558,310 558,400 510,400 530,310" fill="#0a0808" opacity="0.07" />
      {/* Statue shadow — long shadow from moonlight */}
      <polygon points="214,356 214,360 260,375 258,370" fill="#0a0808" opacity="0.05" />
      {/* Fountain shadow — diffuse circular shadow */}
      <ellipse cx="395" cy="365" rx="45" ry="6" fill="#0a0808" opacity="0.06" />
      {/* Lamp post shadows — thin diagonal lines */}
      <polygon points="240,310 240,312 265,360 263,360" fill="#0a0808" opacity="0.04" />
      <polygon points="500,310 500,312 520,355 518,355" fill="#0a0808" opacity="0.04" />

      {/* === PUDDLE — rain water collected on uneven cobblestones === */}
      {/* Puddle 1 — near the fountain, reflecting lamplight */}
      <ellipse cx="360" cy="370" rx="12" ry="3" fill="url(#ch5_puddleReflect)" opacity="0.7" />
      {/* Lamp reflection in puddle */}
      <ellipse cx="358" cy="370" rx="2" ry="0.8" fill="#c09050" opacity="0.04">
        <animate attributeName="opacity" values="0.04;0.07;0.04" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Puddle edge highlight */}
      <ellipse cx="360" cy="370" rx="12" ry="3" fill="none" stroke="#3a4555" strokeWidth="0.3" opacity="0.08" />
      {/* Moon reflection in puddle — tiny bright point */}
      <circle cx="364" cy="369.5" r="0.6" fill="#c0c090" opacity="0.06">
        <animate attributeName="opacity" values="0.06;0.1;0.04;0.06" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Puddle 2 — near the left archway */}
      <ellipse cx="185" cy="375" rx="8" ry="2.5" fill="url(#ch5_puddleReflect)" opacity="0.6" />
      <ellipse cx="185" cy="375" rx="8" ry="2.5" fill="none" stroke="#3a4555" strokeWidth="0.25" opacity="0.06" />

      {/* === STREET DEBRIS — straw, broken tile, small objects === */}
      {/* Straw wisps near the carriage */}
      <path d="M195 358 Q198 356 201 358" fill="none" stroke="#8a7550" strokeWidth="0.4" opacity="0.06" />
      <path d="M192 360 Q196 357 199 360" fill="none" stroke="#8a7550" strokeWidth="0.35" opacity="0.05" />
      <path d="M188 362 Q190 359 193 361" fill="none" stroke="#7a6540" strokeWidth="0.3" opacity="0.05" />
      {/* Broken roof tile shards — near left building base */}
      <path d="M172 380 L175 378 L177 381 L174 382 Z" fill="#6a4030" opacity="0.06" />
      <path d="M180 382 L182 380 L183 382 Z" fill="#6a4030" opacity="0.05" />
      {/* Small stone chips near statue pedestal */}
      <circle cx="210" cy="362" r="0.8" fill="#3a3530" opacity="0.08" />
      <circle cx="214" cy="364" r="0.6" fill="#3a3530" opacity="0.07" />
      <circle cx="218" cy="363" r="0.5" fill="#3a3530" opacity="0.06" />
      {/* Barrel hoop — broken metal ring near the market stall */}
      <path d="M168 365 Q172 362 176 365" fill="none" stroke="#3a3028" strokeWidth="0.5" opacity="0.08" />
      {/* Small rope coil near the bedrolls */}
      <ellipse cx="595" cy="362" rx="3" ry="2" fill="none" stroke="#3a3028" strokeWidth="0.6" opacity="0.08" />
      <ellipse cx="595" cy="362" rx="2" ry="1.3" fill="none" stroke="#3a3028" strokeWidth="0.5" opacity="0.06" />

      {/* === TORCH SMOKE WISPS — rising from wall torches === */}
      {/* Smoke from left palazzo torch */}
      <path d="M157 235 Q155 225 158 215 Q156 208 159 200" fill="none" stroke="#4a4540" strokeWidth="1.5" opacity="0.04">
        <animate attributeName="d" values="M157 235 Q155 225 158 215 Q156 208 159 200;M157 235 Q159 223 156 213 Q158 206 155 198;M157 235 Q155 225 158 215 Q156 208 159 200" dur="5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.04;0.06;0.03;0.04" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Smoke from right palazzo torch */}
      <path d="M564 276 Q562 266 565 256 Q563 248 566 240" fill="none" stroke="#4a4540" strokeWidth="1.2" opacity="0.035">
        <animate attributeName="d" values="M564 276 Q562 266 565 256 Q563 248 566 240;M564 276 Q566 264 563 254 Q565 246 562 238;M564 276 Q562 266 565 256 Q563 248 566 240" dur="5.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.035;0.055;0.025;0.035" dur="5.5s" repeatCount="indefinite" />
      </path>

      {/* === VICTORY LAUREL WREATHS — hung on building facades === */}
      {/* Wreath on center-left building — above the French doors */}
      <circle cx="239" cy="93" r="6" fill="url(#ch5_wreathGlow)" opacity="0.8" />
      <circle cx="239" cy="93" r="5.5" fill="none" stroke="#2a4520" strokeWidth="1.2" opacity="0.2" />
      <circle cx="239" cy="93" r="4" fill="none" stroke="#2a4520" strokeWidth="0.8" opacity="0.15" />
      {/* Red ribbon bow at bottom of wreath */}
      <path d="M237 98 Q239 96 241 98 L243 101 L235 101 Z" fill="#c03020" opacity="0.12" />
      {/* Wreath on right palazzo */}
      <circle cx="660" cy="84" r="5" fill="url(#ch5_wreathGlow)" opacity="0.7" />
      <circle cx="660" cy="84" r="4.5" fill="none" stroke="#2a4520" strokeWidth="1" opacity="0.18" />
      <circle cx="660" cy="84" r="3.5" fill="none" stroke="#2a4520" strokeWidth="0.7" opacity="0.12" />
      <path d="M658 88 Q660 86 662 88 L664 91 L656 91 Z" fill="#c03020" opacity="0.1" />
      {/* Small victory wreath on left palazzo near the pigeon */}
      <circle cx="75" cy="73" r="4" fill="url(#ch5_wreathGlow)" opacity="0.6" />
      <circle cx="75" cy="73" r="3.5" fill="none" stroke="#2a4520" strokeWidth="0.8" opacity="0.15" />
      <path d="M73.5 76 Q75 74.5 76.5 76 L78 78 L72 78 Z" fill="#c03020" opacity="0.08" />

      {/* === CAPTURED AUSTRIAN STANDARD — military trophy displayed as conquest symbol === */}
      {/* Pole mounted on center-left building balcony — hung at an angle, downward */}
      <line x1="195" y1="134" x2="185" y2="170" stroke="#3a3028" strokeWidth="1.2" opacity="0.4" />
      {/* Austrian banner — white with black eagle, hung limp as trophy */}
      <path d="M185 145 Q180 148 178 155 L178 165 Q182 162 185 168 Z" fill="url(#ch5_austrianStandard)" opacity="0.6">
        <animate attributeName="d" values="M185 145 Q180 148 178 155 L178 165 Q182 162 185 168 Z;M185 145 Q179 149 177 156 L177 166 Q181 163 185 168 Z;M185 145 Q180 148 178 155 L178 165 Q182 162 185 168 Z" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Black double-headed eagle emblem — simplified silhouette */}
      <path d="M180 155 Q179 153 180 151 Q181 153 182 151 Q183 153 182 155 L181 157 Z" fill="#1a1518" opacity="0.12" />
      {/* Gold fringe at banner bottom */}
      <path d="M178 165 Q180 166 182 165 Q184 166 185 168" fill="none" stroke="#c0a040" strokeWidth="0.5" opacity="0.1" />
      {/* Banner tattered edge — battle damage */}
      <path d="M178 160 Q177 161 178 163" fill="none" stroke="#c0b898" strokeWidth="0.3" opacity="0.08" />

      {/* Second captured standard — near the right arcade, hung from column */}
      <line x1="610" y1="280" x2="605" y2="312" stroke="#3a3028" strokeWidth="1" opacity="0.35" />
      <path d="M605 288 Q600 291 598 297 L598 308 Q602 305 605 310 Z" fill="url(#ch5_austrianStandard)" opacity="0.5">
        <animate attributeName="d" values="M605 288 Q600 291 598 297 L598 308 Q602 305 605 310 Z;M605 288 Q599 292 597 298 L597 309 Q601 306 605 310 Z;M605 288 Q600 291 598 297 L598 308 Q602 305 605 310 Z" dur="5.5s" repeatCount="indefinite" />
      </path>

      {/* === WARM LIGHT SPILL — from windows and doors onto building walls === */}
      {/* Warm rectangle of light below the lit center-left window */}
      <rect x="230" y="140" width="14" height="40" fill="#c09050" opacity="0.015" />
      {/* Light spill on piazza from the loggia arches */}
      <ellipse cx="220" cy="322" rx="20" ry="5" fill="#c09050" opacity="0.02" />
      <ellipse cx="250" cy="320" rx="15" ry="4" fill="#c09050" opacity="0.015" />
      {/* Warm light from arcade openings */}
      {[590, 626, 662, 698].map((x, i) => (
        <ellipse key={`arcL${i}`} cx={x} cy="318" rx="12" ry="4" fill="#c09050" opacity={0.015 - i * 0.002} />
      ))}

      {/* === ENHANCED FLAG POLE EAGLE — glinting finial detail === */}
      {/* Eagle on standard-bearer's flag pole — more detail */}
      <path d="M283 286 Q285 283 287 286 L286 288 L284 288 Z" fill="#c0a050" opacity="0.25" />
      {/* Spread wings */}
      <path d="M283 286 Q280 284 279 286" fill="none" stroke="#c0a050" strokeWidth="0.6" opacity="0.15" />
      <path d="M287 286 Q290 284 291 286" fill="none" stroke="#c0a050" strokeWidth="0.6" opacity="0.15" />
      {/* Glint on eagle — catches lamplight */}
      <circle cx="285" cy="284" r="0.8" fill="#e0c070" opacity="0.08">
        <animate attributeName="opacity" values="0.08;0.18;0.06;0.08" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* === COBBLESTONE INDIVIDUAL DETAIL — hand-placed stones near viewer === */}
      {/* Larger visible cobblestones in foreground — more rounded, with gaps */}
      {[
        { x: 200, y: 385, w: 8, h: 5 }, { x: 210, y: 387, w: 7, h: 4.5 },
        { x: 220, y: 384, w: 9, h: 5.5 }, { x: 232, y: 386, w: 7, h: 5 },
        { x: 242, y: 388, w: 8, h: 4 }, { x: 253, y: 385, w: 7, h: 5 },
        { x: 350, y: 386, w: 8, h: 5 }, { x: 360, y: 384, w: 9, h: 5.5 },
        { x: 372, y: 387, w: 7, h: 4 }, { x: 382, y: 385, w: 8, h: 5 },
        { x: 450, y: 386, w: 7, h: 5 }, { x: 460, y: 388, w: 8, h: 4.5 },
        { x: 470, y: 384, w: 9, h: 5 }, { x: 482, y: 387, w: 7, h: 4 },
      ].map((s, i) => (
        <React.Fragment key={`fgCob${i}`}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="none" stroke="#302520" strokeWidth="0.4" opacity="0.1" rx="1" />
          {/* Top edge highlight — worn smooth */}
          <line x1={s.x + 1} y1={s.y} x2={s.x + s.w - 1} y2={s.y} stroke="#3a3530" strokeWidth="0.3" opacity="0.06" />
        </React.Fragment>
      ))}

      {/* === ADDITIONAL CELEBRATION TORCHES — held by crowd members === */}
      {/* Torch held by man near right side */}
      <line x1="537" y1="310" x2="537" y2="325" stroke="#3a2818" strokeWidth="1" opacity="0.4" />
      <ellipse cx="537" cy="308" rx="2" ry="3.5" fill="#d09030" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.08;0.12;0.15" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="ry" values="3.5;3;3.5" dur="1.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="537" cy="308" rx="1" ry="2" fill="#e0b050" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.05;0.08;0.1" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Torch glow on nearby area */}
      <ellipse cx="537" cy="312" rx="15" ry="10" fill="url(#ch5_torchGlow)" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.3;0.35;0.4" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* Torch near left crowd */}
      <line x1="158" y1="302" x2="158" y2="318" stroke="#3a2818" strokeWidth="0.8" opacity="0.35" />
      <ellipse cx="158" cy="300" rx="1.8" ry="3" fill="#d09030" opacity="0.12">
        <animate attributeName="opacity" values="0.12;0.06;0.1;0.12" dur="1.8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="158" cy="304" rx="12" ry="8" fill="url(#ch5_torchGlow)" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.25;0.3;0.35" dur="2.2s" repeatCount="indefinite" />
      </ellipse>

      {/* === CART — small hand-cart near the right market stall === */}
      {/* Two-wheeled hand cart with produce */}
      <rect x="668" y="345" width="18" height="10" fill="#1e1a15" opacity="0.45" />
      {/* Cart sides — wooden planks */}
      <line x1="668" y1="345" x2="668" y2="340" stroke="#2a2218" strokeWidth="0.8" opacity="0.3" />
      <line x1="686" y1="345" x2="686" y2="340" stroke="#2a2218" strokeWidth="0.8" opacity="0.3" />
      <line x1="668" y1="340" x2="686" y2="340" stroke="#2a2218" strokeWidth="0.6" opacity="0.25" />
      {/* Wheel */}
      <circle cx="672" cy="358" r="4.5" fill="none" stroke="#2a2218" strokeWidth="1" opacity="0.4" />
      <circle cx="672" cy="358" r="0.8" fill="#2a2218" opacity="0.35" />
      <line x1="672" y1="353.5" x2="672" y2="362.5" stroke="#2a2218" strokeWidth="0.3" opacity="0.25" />
      <line x1="667.5" y1="358" x2="676.5" y2="358" stroke="#2a2218" strokeWidth="0.3" opacity="0.25" />
      {/* Second wheel */}
      <circle cx="684" cy="358" r="4.5" fill="none" stroke="#2a2218" strokeWidth="1" opacity="0.4" />
      <circle cx="684" cy="358" r="0.8" fill="#2a2218" opacity="0.35" />
      {/* Handle shaft */}
      <line x1="668" y1="350" x2="660" y2="355" stroke="#2a2218" strokeWidth="1" opacity="0.35" />
      {/* Goods piled in cart — sacks */}
      <ellipse cx="675" cy="343" rx="5" ry="3" fill="#3a3028" opacity="0.25" />
      <ellipse cx="681" cy="344" rx="4" ry="2.5" fill="#3a3028" opacity="0.2" />

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
