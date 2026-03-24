import React from 'react';
import type { SceneMood } from '../../types/vnTypes';

/** SVG atmospheric background art for each mood */
export function MoodBackground({ mood }: { mood: SceneMood }) {
  return (
    <div className="vn-bg-scene">
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Night sky gradient */}
          <linearGradient id="vn_sky" x1="0" y1="0" x2="0" y2="1">
            {mood === 'night_camp' && <>
              <stop offset="0%" stopColor="#05080F" />
              <stop offset="40%" stopColor="#0E1525" />
              <stop offset="100%" stopColor="#1A1510" />
            </>}
            {mood === 'dawn' && <>
              <stop offset="0%" stopColor="#1A1520" />
              <stop offset="30%" stopColor="#2E2540" />
              <stop offset="60%" stopColor="#6A4A50" />
              <stop offset="100%" stopColor="#A87060" />
            </>}
            {mood === 'battlefield' && <>
              <stop offset="0%" stopColor="#2A2520" />
              <stop offset="40%" stopColor="#3A3020" />
              <stop offset="100%" stopColor="#4A4030" />
            </>}
            {mood === 'march' && <>
              <stop offset="0%" stopColor="#2A3A58" />
              <stop offset="40%" stopColor="#4A5A68" />
              <stop offset="70%" stopColor="#6A6050" />
              <stop offset="100%" stopColor="#8A7A50" />
            </>}
            {mood === 'interior' && <>
              <stop offset="0%" stopColor="#1A1510" />
              <stop offset="50%" stopColor="#252015" />
              <stop offset="100%" stopColor="#1A1510" />
            </>}
            {mood === 'ridge' && <>
              <stop offset="0%" stopColor="#0F1520" />
              <stop offset="50%" stopColor="#1A2535" />
              <stop offset="100%" stopColor="#253040" />
            </>}
            {mood === 'gorge' && <>
              <stop offset="0%" stopColor="#08080F" />
              <stop offset="40%" stopColor="#101018" />
              <stop offset="100%" stopColor="#151520" />
            </>}
          </linearGradient>
          <radialGradient id="vn_fire_glow" cx="50%" cy="85%" r="30%">
            <stop offset="0%" stopColor="rgba(255,150,50,0.12)" />
            <stop offset="100%" stopColor="rgba(255,150,50,0)" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="800" height="500" fill="url(#vn_sky)" />

        {/* Night camp scene */}
        {mood === 'night_camp' && <>
          {/* Stars */}
          {[
            [80,30],[150,55],[250,20],[320,65],[400,15],[480,40],[560,25],[650,50],[720,35],
            [120,80],[200,45],[370,75],[520,60],[600,30],[680,80],[770,45],[50,60],[440,50],
          ].map(([x,y], i) => (
            <circle key={`s${i}`} cx={x} cy={y} r={i % 5 === 0 ? 1.5 : 0.8} fill="white"
              opacity={0.3 + (i % 4) * 0.15}>
              <animate attributeName="opacity" values={`${0.3 + (i%4)*0.15};${0.6 + (i%3)*0.1};${0.3 + (i%4)*0.15}`}
                dur={`${3 + i % 4}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Mountains silhouette */}
          <path d="M0 250 L80 180 L160 220 L240 150 L350 190 L450 140 L520 185 L600 160 L680 200 L750 170 L800 210 L800 500 L0 500 Z"
            fill="#0A0E15" opacity="0.9" />
          <path d="M0 280 L120 240 L200 260 L300 220 L400 250 L500 215 L580 240 L700 230 L800 260 L800 500 L0 500 Z"
            fill="#0F1520" opacity="0.8" />

          {/* Ground — with texture variation */}
          <rect x="0" y="350" width="800" height="150" fill="#15120E" />
          <rect x="0" y="350" width="800" height="3" fill="#1A1510" opacity="0.6" />
          {/* Ground texture patches — earth, gravel, grass tufts */}
          {[60,180,300,500,650,750].map((x, i) => (
            <ellipse key={`gt${i}`} cx={x} cy={365+i*4} rx={30+i*5} ry={2+i*0.5}
              fill={`rgba(${20+i*3},${18+i*2},${12+i},${0.15+i*0.02})`} />
          ))}
          {/* Grass tufts */}
          {[70,200,450,620,740].map((x, i) => (
            <path key={`gf${i}`} d={`M${x} ${360+i*3} Q${x+2} ${353+i*3} ${x+4} ${360+i*3}`}
              fill="none" stroke="rgba(30,35,15,0.2)" strokeWidth="0.5" />
          ))}

          {/* Campfire glow on ground */}
          <ellipse cx="400" cy="430" rx="120" ry="20" fill="rgba(255,120,30,0.04)" />
          {/* Campfire glow */}
          <circle cx="400" cy="420" r="100" fill="url(#vn_fire_glow)" />
          <circle cx="400" cy="420" r="50" fill="rgba(255,120,30,0.06)">
            <animate attributeName="r" values="48;52;48" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Campfire */}
          <path d="M385 420 L390 400 L395 415 L400 390 L405 415 L410 395 L415 420 Z" fill="#D4600A" opacity="0.8">
            <animate attributeName="d"
              values="M385 420 L390 400 L395 415 L400 390 L405 415 L410 395 L415 420 Z;M385 420 L392 395 L396 412 L400 385 L404 412 L408 398 L415 420 Z;M385 420 L390 400 L395 415 L400 390 L405 415 L410 395 L415 420 Z"
              dur="0.8s" repeatCount="indefinite" />
          </path>
          <path d="M388 420 L393 408 L398 418 L400 395 L402 418 L407 405 L412 420 Z" fill="#FF9020" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.8;0.6" dur="0.6s" repeatCount="indefinite" />
          </path>
          {/* Fire pit stones */}
          {[0,1,2,3,4,5,6,7].map((i) => {
            const angle = (i / 8) * Math.PI * 2;
            const cx = 400 + Math.cos(angle) * 18;
            const cy = 425 + Math.sin(angle) * 6;
            return <ellipse key={`fp${i}`} cx={cx} cy={cy} rx="4" ry="2.5"
              fill="#2A2218" stroke="#1A1510" strokeWidth="0.3" />;
          })}

          {/* Logs */}
          <line x1="380" y1="425" x2="420" y2="422" stroke="#3A2A15" strokeWidth="4" strokeLinecap="round" />
          <line x1="382" y1="428" x2="418" y2="430" stroke="#3A2A15" strokeWidth="3.5" strokeLinecap="round" />

          {/* Sparks */}
          {[1,2,3,4,5].map((i) => (
            <circle key={`sp${i}`} cx={395 + i * 3} cy={400 - i * 15} r="0.8" fill="#FFB040" opacity="0.6">
              <animate attributeName="cy" values={`${400 - i*15};${370 - i*20};${400 - i*15}`}
                dur={`${1.5 + i*0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur={`${1.5 + i*0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Floating embers — drift upward from campfire */}
          {[1,2,3,4,5,6,7,8,9,10].map((i) => {
            const startX = 388 + i * 4 + (i % 3) * 6;
            const startY = 395 - i * 5;
            const endY = 200 - i * 15;
            const drift = (i % 2 ? 1 : -1) * (10 + i * 5);
            const dur = 3 + i * 0.7;
            return (
              <circle key={`emb${i}`} cx={startX} cy={startY} r={0.6 + (i % 3) * 0.3} fill="#FFB040">
                <animate attributeName="cy" values={`${startY};${endY}`}
                  dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${startX};${startX + drift};${startX + drift * 0.5}`}
                  dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.7;0"
                  dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Distant campfires */}
          {[150, 300, 550, 680].map((x, i) => (
            <g key={`cf${i}`}>
              <circle cx={x} cy={310 + i * 8} r="3" fill="#FF8020" opacity="0.15">
                <animate attributeName="opacity" values="0.15;0.25;0.15" dur={`${2 + i}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={310 + i * 8} r="8" fill="rgba(255,120,30,0.04)" />
            </g>
          ))}

          {/* Stacked muskets (arms rack) */}
          <g opacity="0.4">
            <line x1="460" y1="420" x2="465" y2="370" stroke="#2A2015" strokeWidth="2" />
            <line x1="468" y1="420" x2="470" y2="370" stroke="#2A2015" strokeWidth="2" />
            <line x1="476" y1="420" x2="473" y2="370" stroke="#2A2015" strokeWidth="2" />
            {/* Crossbar */}
            <line x1="463" y1="385" x2="475" y2="385" stroke="#2A2015" strokeWidth="1" />
          </g>

          {/* Distant seated soldier silhouettes around other campfire */}
          {/* Figure near left distant campfire */}
          <g opacity="0.2">
            <circle cx="155" cy="303" r="2.5" fill="#0A0A0A" />
            <path d="M155 305 L155 315 L152 325 M155 315 L158 325" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Figure near right distant campfire */}
          <g opacity="0.2">
            <circle cx="685" cy="326" r="2.5" fill="#0A0A0A" />
            <path d="M685 328 L685 338 L682 348 M685 338 L688 348" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Tent silhouettes — more detailed */}
          <path d="M100 370 L130 340 L160 370 Z" fill="#0A0A0A" opacity="0.5" />
          <path d="M600 365 L640 330 L680 365 Z" fill="#0A0A0A" opacity="0.5" />
          {/* Tent guy ropes */}
          <line x1="130" y1="340" x2="170" y2="370" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />
          <line x1="130" y1="340" x2="90" y2="370" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />
          <line x1="640" y1="330" x2="690" y2="365" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />
          <line x1="640" y1="330" x2="590" y2="365" stroke="rgba(10,10,10,0.15)" strokeWidth="0.3" />

          {/* Low mist near ground */}
          <ellipse cx="200" cy="375" rx="120" ry="8" fill="rgba(150,130,100,0.03)">
            <animate attributeName="rx" values="120;140;120" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="550" cy="370" rx="100" ry="6" fill="rgba(150,130,100,0.025)">
            <animate attributeName="rx" values="100;115;100" dur="10s" repeatCount="indefinite" />
          </ellipse>
        </>}

        {/* Dawn scene — camp at first light */}
        {mood === 'dawn' && <>
          {/* Dawn horizon glow — rich sunrise colors */}
          <ellipse cx="400" cy="280" rx="500" ry="120" fill="rgba(200,120,80,0.1)" />
          <ellipse cx="400" cy="290" rx="350" ry="50" fill="rgba(255,180,120,0.08)" />
          <ellipse cx="400" cy="300" rx="200" ry="25" fill="rgba(255,200,140,0.06)" />

          {/* Fading stars */}
          {[100,250,500,650,750].map((x, i) => (
            <circle key={`ds${i}`} cx={x} cy={40+i*15} r="0.7" fill="white" opacity={0.1 - i*0.015} />
          ))}

          {/* Wispy dawn clouds — more layers */}
          <ellipse cx="150" cy="100" rx="130" ry="15" fill="rgba(200,130,90,0.07)" />
          <ellipse cx="350" cy="70" rx="90" ry="12" fill="rgba(200,130,90,0.05)" />
          <ellipse cx="550" cy="90" rx="100" ry="16" fill="rgba(200,130,90,0.06)" />
          <ellipse cx="700" cy="130" rx="80" ry="12" fill="rgba(200,130,90,0.04)" />
          {/* Cloud highlights */}
          <ellipse cx="180" cy="98" rx="60" ry="6" fill="rgba(255,180,120,0.04)" />
          <ellipse cx="560" cy="88" rx="50" ry="5" fill="rgba(255,180,120,0.03)" />

          {/* Mountain silhouettes — layered */}
          <path d="M0 260 L80 200 L160 230 L250 170 L350 200 L450 150 L550 180 L650 160 L750 190 L800 220 L800 500 L0 500 Z"
            fill="#18132A" opacity="0.6" />
          <path d="M0 290 L100 240 L200 265 L300 220 L400 250 L500 210 L600 240 L700 225 L800 260 L800 500 L0 500 Z"
            fill="#1A1520" opacity="0.7" />

          {/* Ground — camp clearing */}
          <rect x="0" y="350" width="800" height="150" fill="#2A2015" />
          <rect x="0" y="350" width="800" height="5" fill="rgba(200,160,120,0.04)" />

          {/* Tent rows — more detail */}
          {[50, 150, 250, 450, 550, 700].map((x, i) => (
            <g key={`t${i}`}>
              <path d={`M${x} 375 L${x+20} 348 L${x+40} 375 Z`} fill="#1A1510" opacity="0.45" />
              {/* Tent entrance flap */}
              <path d={`M${x+15} 375 L${x+20} 358 L${x+25} 375 Z`} fill="#15120E" opacity="0.3" />
            </g>
          ))}

          {/* Campfire embers — early morning remnants */}
          {[120, 350, 620].map((x, i) => (
            <g key={`de${i}`}>
              <circle cx={x} cy={380 + i*3} r="5" fill="rgba(255,100,30,0.04)" />
              <circle cx={x} cy={380 + i*3} r="2" fill="rgba(255,80,20,0.06)">
                <animate attributeName="opacity" values="0.06;0.1;0.06" dur={`${3+i}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Morning mist — thicker, layered */}
          <rect x="0" y="330" width="800" height="40" fill="rgba(200,180,160,0.06)" />
          <rect x="0" y="345" width="800" height="25" fill="rgba(200,180,160,0.05)" />
          <ellipse cx="300" cy="340" rx="200" ry="15" fill="rgba(200,180,160,0.04)" />
          <ellipse cx="600" cy="345" rx="150" ry="12" fill="rgba(200,180,160,0.03)" />

          {/* Distant figure silhouette — sentry */}
          <line x1="680" y1="345" x2="680" y2="325" stroke="#1A1520" strokeWidth="2.5" />
          <circle cx="680" cy="323" r="3" fill="#1A1520" />
          {/* Musket */}
          <line x1="682" y1="340" x2="685" y2="318" stroke="#1A1520" strokeWidth="1" />

          {/* Drummer boy silhouette — smaller figure */}
          <line x1="320" y1="360" x2="320" y2="345" stroke="#1A1520" strokeWidth="2" />
          <circle cx="320" cy="343" r="2.5" fill="#1A1520" />
          {/* Drum */}
          <ellipse cx="323" cy="354" rx="4" ry="3" fill="#1A1520" opacity="0.7" />

          {/* Morning birds in flight */}
          {[200,280,340,420,550].map((x, i) => (
            <path key={`bird${i}`}
              d={`M${x} ${60+i*12} Q${x+3} ${56+i*12} ${x+6} ${60+i*12} Q${x+9} ${56+i*12} ${x+12} ${60+i*12}`}
              fill="none" stroke="#1A1520" strokeWidth="0.6" opacity={0.3 - i*0.04} />
          ))}

          {/* Smoke rising from campfire remnants */}
          {[120, 350, 620].map((x, i) => (
            <path key={`ds${i}`}
              d={`M${x} ${375+i*3} Q${x+5} ${360+i*3} ${x-3} ${345+i*3}`}
              fill="none" stroke="rgba(200,180,160,0.04)" strokeWidth="2" strokeLinecap="round">
              <animate attributeName="d"
                values={`M${x} ${375+i*3} Q${x+5} ${360+i*3} ${x-3} ${345+i*3};M${x} ${375+i*3} Q${x-5} ${358+i*3} ${x+3} ${342+i*3};M${x} ${375+i*3} Q${x+5} ${360+i*3} ${x-3} ${345+i*3}`}
                dur={`${4+i}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Sun rays breaking over mountain — golden shafts of light */}
          <line x1="420" y1="165" x2="300" y2="380" stroke="rgba(255,200,120,0.015)" strokeWidth="35" />
          <line x1="400" y1="155" x2="200" y2="370" stroke="rgba(255,200,120,0.012)" strokeWidth="25" />
          <line x1="440" y1="160" x2="550" y2="380" stroke="rgba(255,200,120,0.01)" strokeWidth="30" />
          <line x1="460" y1="170" x2="650" y2="375" stroke="rgba(255,200,120,0.008)" strokeWidth="20" />

          {/* Dew drops on tent canvas — sparkling */}
          {[55,75,155,175,255,275,455,475,555,575,705,725].map((x, i) => (
            <circle key={`dew${i}`} cx={x} cy={352 + (i%3)*2} r="0.5" fill="rgba(255,230,180,0.08)">
              <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2+i*0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Flag/standard at camp center */}
          <line x1="400" y1="375" x2="400" y2="320" stroke="#2A2015" strokeWidth="1.5" />
          <path d="M400 320 L425 325 Q422 330 425 336 L400 332 Z" fill="rgba(30,50,120,0.2)">
            <animate attributeName="d"
              values="M400 320 L425 325 Q422 330 425 336 L400 332 Z;M400 320 L423 326 Q420 331 424 335 L400 332 Z;M400 320 L425 325 Q422 330 425 336 L400 332 Z"
              dur="3s" repeatCount="indefinite" />
          </path>
        </>}

        {/* Battlefield scene — aftermath of a charge */}
        {mood === 'battlefield' && <>
          {/* Smoke haze layers — organic shapes */}
          <rect x="0" y="0" width="800" height="500" fill="rgba(150,130,100,0.04)" />
          <path d="M50 180 Q120 150 200 170 Q280 130 350 160 Q380 200 320 220 Q250 250 150 230 Q80 210 50 180 Z"
            fill="rgba(150,130,100,0.05)" />
          <path d="M450 130 Q530 100 620 120 Q700 90 760 130 Q740 170 650 180 Q560 200 480 170 Q440 160 450 130 Z"
            fill="rgba(150,130,100,0.04)" />
          <path d="M200 280 Q350 250 500 270 Q600 300 700 280 Q680 320 550 310 Q400 330 250 310 Q180 300 200 280 Z"
            fill="rgba(150,130,100,0.035)" />

          {/* Distant tree line */}
          <path d="M0 240 L40 220 L80 230 L120 215 L160 225 L200 210 L250 220 L300 205 L350 218 L400 208 L450 220 L500 212 L550 225 L600 215 L650 228 L700 218 L750 230 L800 220 L800 280 L0 280 Z"
            fill="#1A1810" opacity="0.5" />

          {/* Hills */}
          <path d="M0 300 Q200 250 400 280 Q600 310 800 270 L800 500 L0 500 Z" fill="#2A2520" />
          <path d="M0 350 Q200 320 400 340 Q600 360 800 330 L800 500 L0 500 Z" fill="#30281E" />

          {/* Cannon smoke puffs — organic drifting clouds */}
          {[150, 350, 550, 700].map((x, i) => {
            const y = 250 + i * 15;
            const rx = 50 + i * 10;
            const ry = 18 + i * 5;
            return (
              <g key={`sm${i}`}>
                <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="rgba(180,170,150,0.04)">
                  <animate attributeName="rx" values={`${rx};${rx+15};${rx}`}
                    dur={`${4+i}s`} repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${x};${x+15};${x}`}
                    dur={`${6+i*2}s`} repeatCount="indefinite" />
                </ellipse>
                {/* Wispy tendril */}
                <ellipse cx={x+rx*0.6} cy={y-ry*0.4} rx={rx*0.3} ry={ry*0.5}
                  fill="rgba(180,170,150,0.025)">
                  <animate attributeName="cx" values={`${x+rx*0.6};${x+rx*0.8};${x+rx*0.6}`}
                    dur={`${5+i}s`} repeatCount="indefinite" />
                </ellipse>
              </g>
            );
          })}

          {/* Bridge structure (Lodi context) — enhanced */}
          {/* Bridge deck with plank texture */}
          <rect x="300" y="365" width="200" height="8" fill="#3A3020" stroke="#2A2015" strokeWidth="0.5" />
          {/* Plank lines */}
          {[310,325,340,355,370,385,400,415,430,445,460,475,490].map((x, i) => (
            <line key={`plk${i}`} x1={x} y1="365" x2={x} y2="373"
              stroke="rgba(20,15,10,0.3)" strokeWidth="0.3" />
          ))}
          {/* Bridge railing posts */}
          <rect x="310" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="340" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="380" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="420" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="460" y="373" width="6" height="15" fill="#2A2015" />
          <rect x="490" y="373" width="6" height="15" fill="#2A2015" />
          {/* Railing top */}
          <line x1="310" y1="387" x2="496" y2="387" stroke="#2A2015" strokeWidth="1.5" />

          {/* Fallen soldier silhouettes */}
          {/* Soldier lying on bridge */}
          <ellipse cx="340" cy="362" rx="8" ry="3" fill="rgba(20,15,10,0.25)" />
          <circle cx="332" cy="361" r="2.5" fill="rgba(20,15,10,0.2)" />
          {/* Soldier on ground near bridge */}
          <ellipse cx="270" cy="380" rx="10" ry="3" fill="rgba(25,20,15,0.2)" />
          <circle cx="260" cy="379" r="2.5" fill="rgba(25,20,15,0.18)" />
          {/* Soldier on far side */}
          <ellipse cx="530" cy="375" rx="9" ry="3" fill="rgba(25,20,15,0.18)" />
          <circle cx="539" cy="374" r="2.5" fill="rgba(25,20,15,0.15)" />

          {/* River under bridge */}
          <path d="M280 395 Q400 385 520 395 L520 420 Q400 410 280 420 Z" fill="rgba(30,40,50,0.25)" />
          <path d="M290 400 Q400 392 510 402" fill="none" stroke="rgba(60,80,100,0.1)" strokeWidth="0.5">
            <animate attributeName="d" values="M290 400 Q400 392 510 402;M290 402 Q400 394 510 400;M290 400 Q400 392 510 402"
              dur="4s" repeatCount="indefinite" />
          </path>

          {/* Fallen equipment — scattered debris */}
          {/* Musket */}
          <line x1="180" y1="375" x2="220" y2="360" stroke="#3A3020" strokeWidth="2" strokeLinecap="round" />
          {/* Shako hat */}
          <ellipse cx="550" cy="370" rx="8" ry="4" fill="#1A1A1A" />
          <rect x="545" y="360" width="10" height="10" rx="1" fill="#1A1A1A" />
          {/* Cartridge box */}
          <rect x="650" y="372" width="10" height="7" rx="1" fill="#2A2015" />

          {/* Tattered flag */}
          <line x1="250" y1="380" x2="250" y2="330" stroke="#3A3020" strokeWidth="2" />
          <path d="M250 330 L280 335 Q275 342 280 348 L250 345 Z" fill="rgba(30,50,100,0.3)" />
          <path d="M255 332 L270 335 Q268 340 270 345 L255 343 Z" fill="rgba(180,30,30,0.15)" />

          {/* Ground texture — churned earth */}
          {[100,200,350,500,600,720].map((x, i) => (
            <ellipse key={`bt${i}`} cx={x} cy={385 + (i%3)*5} rx={20+i*3} ry={3} fill="rgba(60,50,35,0.15)" />
          ))}

          {/* Embers / distant fires */}
          {[120, 380, 680].map((x, i) => (
            <circle key={`bf${i}`} cx={x} cy={260 + i*15} r="2" fill="rgba(255,100,30,0.1)">
              <animate attributeName="opacity" values="0.1;0.2;0.1" dur={`${3+i}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Distant cannon flash — periodic */}
          <circle cx="720" cy="230" r="6" fill="rgba(255,200,100,0.0)">
            <animate attributeName="fill" values="rgba(255,200,100,0);rgba(255,200,100,0.15);rgba(255,200,100,0)" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle cx="720" cy="230" r="15" fill="rgba(255,200,100,0.0)">
            <animate attributeName="fill" values="rgba(255,200,100,0);rgba(255,200,100,0.04);rgba(255,200,100,0)" dur="5s" repeatCount="indefinite" />
          </circle>

          {/* Drifting smoke layer across bottom */}
          <path d="M0 390 Q100 380 200 385 Q350 395 500 388 Q650 380 800 390 L800 400 L0 400 Z"
            fill="rgba(150,140,120,0.04)">
            <animate attributeName="d"
              values="M0 390 Q100 380 200 385 Q350 395 500 388 Q650 380 800 390 L800 400 L0 400 Z;M0 388 Q100 382 200 387 Q350 393 500 386 Q650 382 800 392 L800 400 L0 400 Z;M0 390 Q100 380 200 385 Q350 395 500 388 Q650 380 800 390 L800 400 L0 400 Z"
              dur="6s" repeatCount="indefinite" />
          </path>
        </>}

        {/* March scene — army descending from Alps into Italy */}
        {mood === 'march' && <>
          {/* Warm haze layer — Italian spring warmth */}
          <rect x="0" y="200" width="800" height="300" fill="rgba(180,160,100,0.04)" />
          {/* Golden light from below — valley warmth rising */}
          <rect x="0" y="350" width="800" height="150" fill="rgba(200,170,80,0.03)" />

          {/* Road — perspective */}
          <path d="M320 500 L380 320 L395 220 L400 150 L405 220 L420 320 L480 500 Z" fill="rgba(150,130,100,0.07)" />
          {/* Road edge lines */}
          <path d="M320 500 L380 320 L395 220" fill="none" stroke="rgba(150,130,100,0.05)" strokeWidth="0.5" />
          <path d="M480 500 L420 320 L405 220" fill="none" stroke="rgba(150,130,100,0.05)" strokeWidth="0.5" />

          {/* Distant Alps — snow-capped, warm haze */}
          <path d="M0 230 L80 140 L160 190 L250 100 L350 150 L450 80 L550 130 L650 100 L750 140 L800 170 L800 500 L0 500 Z"
            fill="#2A3548" opacity="0.6" />
          {/* Atmospheric haze on mountains — warm distant glow */}
          <path d="M0 230 L80 140 L160 190 L250 100 L350 150 L450 80 L550 130 L650 100 L750 140 L800 170 L800 280 L0 280 Z"
            fill="rgba(140,120,90,0.08)" />
          {/* Snow caps — brighter */}
          <path d="M240 108 L250 100 L260 112" fill="none" stroke="rgba(220,225,240,0.3)" strokeWidth="3" strokeLinecap="round" />
          <path d="M440 88 L450 80 L460 92" fill="none" stroke="rgba(220,225,240,0.3)" strokeWidth="3" strokeLinecap="round" />
          <path d="M640 108 L650 100 L660 112" fill="none" stroke="rgba(220,225,240,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Additional peak — behind left mountains */}
          <path d="M70 148 L80 140 L90 150" fill="none" stroke="rgba(220,225,240,0.15)" strokeWidth="2" strokeLinecap="round" />

          {/* Mid-range foothills with trees — warmer green tone */}
          <path d="M0 290 L100 260 L200 275 L350 250 L500 265 L650 255 L800 275 L800 500 L0 500 Z"
            fill="#253830" opacity="0.75" />

          {/* Distant column of soldiers on road (tiny dots) */}
          {[200,210,222,235,248,260,275,290,308,325].map((y, i) => (
            <circle key={`sol${i}`} cx={400 + (i%2 ? 3 : -3)} cy={y} r={0.8 - i*0.03} fill="rgba(50,60,70,0.3)" />
          ))}

          {/* Mule train / supply wagons on road — closer, more visible */}
          {[340,360,380].map((y, i) => (
            <g key={`mule${i}`}>
              {/* Pack mule body */}
              <ellipse cx={400 + (i%2 ? 6 : -4)} cy={y} rx={4+i} ry={2+i*0.5} fill="rgba(60,50,40,0.25)" />
              {/* Mule legs */}
              <line x1={397+(i%2?6:-4)} y1={y+2+i*0.5} x2={396+(i%2?6:-4)} y2={y+5+i} stroke="rgba(60,50,40,0.15)" strokeWidth="0.5" />
              <line x1={403+(i%2?6:-4)} y1={y+2+i*0.5} x2={404+(i%2?6:-4)} y2={y+5+i} stroke="rgba(60,50,40,0.15)" strokeWidth="0.5" />
              {/* Pack on back */}
              <rect x={397+(i%2?6:-4)} y={y-3-i*0.5} width={6+i} height={3+i*0.3} rx="1" fill="rgba(80,60,40,0.15)" />
            </g>
          ))}

          {/* Road wheel ruts — perspective lines */}
          <path d="M390 500 L398 350 L399 280" fill="none" stroke="rgba(120,100,70,0.04)" strokeWidth="0.5" />
          <path d="M410 500 L402 350 L401 280" fill="none" stroke="rgba(120,100,70,0.04)" strokeWidth="0.5" />

          {/* Guidon flag carried by lead column */}
          <line x1="400" y1="192" x2="400" y2="180" stroke="rgba(50,60,70,0.3)" strokeWidth="0.5" />
          <path d="M400 180 L406 182 L400 184 Z" fill="rgba(30,50,100,0.2)" />

          {/* Near-range landscape — green Italian foothills */}
          <path d="M0 340 L150 325 L300 335 L450 320 L600 330 L750 322 L800 335 L800 500 L0 500 Z"
            fill="#253828" />

          {/* Trees on hillside — greener */}
          {[80,160,280,550,650,730].map((x, i) => {
            const h = 14 + (i%3) * 6;
            return <path key={`mt${i}`} d={`M${x} ${330 - i*2} L${x-3} ${330 - i*2} L${x} ${330 - i*2 - h} L${x+3} ${330 - i*2} Z`}
              fill="rgba(20,40,25,0.5)" />;
          })}

          {/* Ground with green (approaching Italy) */}
          <rect x="0" y="370" width="800" height="130" fill="#2A3828" />
          <rect x="0" y="370" width="800" height="130" fill="rgba(60,80,40,0.06)" />

          {/* Grass tufts — more visible */}
          {[50,120,190,280,360,440,520,600,680,750].map((x, i) => (
            <path key={`gr${i}`} d={`M${x} ${385+i*1.5} Q${x+3} ${374+i*1.5} ${x+6} ${385+i*1.5}`}
              fill="none" stroke="rgba(70,100,50,0.12)" strokeWidth="1.2" />
          ))}

          {/* Dust kicked up by marching column */}
          <ellipse cx="400" cy="420" rx="60" ry="12" fill="rgba(150,130,100,0.04)">
            <animate attributeName="rx" values="60;75;60" dur="6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="400" cy="350" rx="30" ry="6" fill="rgba(150,130,100,0.025)">
            <animate attributeName="rx" values="30;38;30" dur="8s" repeatCount="indefinite" />
          </ellipse>

          {/* Stone wall along road — low fieldstone */}
          <path d="M250 365 L260 363 L275 364 L288 362 L300 365 L312 363 L325 365"
            fill="none" stroke="rgba(100,90,75,0.15)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M480 365 L495 363 L510 365 L525 362 L540 364 L555 365"
            fill="none" stroke="rgba(100,90,75,0.12)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Italian cypress trees (tall, narrow) — approaching Italy */}
          {[180,260,340,420,500,580,660,740].map((x, i) => {
            const h = 30 + (i%3) * 12;
            const baseY = 332 - i * 1.5;
            return <g key={`cyp${i}`} opacity={0.4 + i * 0.04}>
              <line x1={x} y1={baseY} x2={x} y2={baseY - h} stroke="#1A3020" strokeWidth="1.5" />
              <ellipse cx={x} cy={baseY - h * 0.5} rx="3.5" ry={h * 0.45} fill="#1A3020" />
            </g>;
          })}

          {/* Wildflowers near road — Italian spring color bursts */}
          {[120,200,280,330,370,440,470,520,600,700].map((x, i) => (
            <g key={`wf${i}`}>
              <circle cx={x + (i%2 ? 15 : -10)} cy={378 + i * 1.5} r={1.2}
                fill={i % 4 === 0 ? 'rgba(220,60,60,0.2)' : i % 4 === 1 ? 'rgba(220,200,40,0.18)' : i % 4 === 2 ? 'rgba(150,80,200,0.15)' : 'rgba(240,180,80,0.18)'} />
              {/* Second petal offset */}
              <circle cx={x + (i%2 ? 18 : -7)} cy={376 + i * 1.5} r={0.8}
                fill={i % 3 === 0 ? 'rgba(240,200,60,0.15)' : 'rgba(200,80,100,0.12)'} />
            </g>
          ))}

          {/* Soaring birds — eagles circling above mountains */}
          {[180,420,620].map((x, i) => (
            <g key={`bird${i}`}>
              <path d={`M${x-4} ${120+i*15} Q${x-2} ${117+i*15} ${x} ${119+i*15} Q${x+2} ${117+i*15} ${x+4} ${120+i*15}`}
                fill="none" stroke="rgba(40,50,60,0.2)" strokeWidth="0.8" />
              <animateTransform attributeName="transform" type="translate"
                values={`0,0;${10+i*5},${-3+i};${-5+i*3},${2};0,0`}
                dur={`${8+i*3}s`} repeatCount="indefinite" />
            </g>
          ))}

          {/* Sun — warm golden glow on horizon */}
          <circle cx="600" cy="120" r="60" fill="rgba(220,180,80,0.04)" />
          <circle cx="600" cy="120" r="35" fill="rgba(240,200,100,0.06)" />
          <circle cx="600" cy="120" r="15" fill="rgba(255,220,120,0.1)" />
          {/* Sun rays — subtle radial */}
          {[0,40,80,120,160,200,240,280,320].map((angle, i) => {
            const rad = angle * Math.PI / 180;
            const x2 = 600 + Math.cos(rad) * (90 + i*8);
            const y2 = 120 + Math.sin(rad) * (70 + i*6);
            return <line key={`ray${i}`} x1="600" y1="120" x2={x2} y2={y2}
              stroke="rgba(240,200,100,0.015)" strokeWidth={1.5} />;
          })}

          {/* Cloud wisps — warmer */}
          <ellipse cx="200" cy="80" rx="100" ry="15" fill="rgba(180,170,140,0.04)" />
          <ellipse cx="450" cy="60" rx="80" ry="12" fill="rgba(180,170,140,0.035)" />
          <ellipse cx="700" cy="100" rx="60" ry="10" fill="rgba(180,170,140,0.03)" />

          {/* Distant haze — warm Italian valley */}
          <path d="M0 290 Q200 280 400 285 Q600 280 800 290" fill="none"
            stroke="rgba(180,160,100,0.06)" strokeWidth="10">
            <animate attributeName="d" values="M0 290 Q200 280 400 285 Q600 280 800 290;M0 292 Q200 278 400 283 Q600 282 800 292;M0 290 Q200 280 400 285 Q600 280 800 290"
              dur="12s" repeatCount="indefinite" />
          </path>
          {/* Second haze layer — deeper into the valley */}
          <path d="M0 310 Q200 305 400 308 Q600 302 800 310" fill="none"
            stroke="rgba(200,180,120,0.04)" strokeWidth="12">
            <animate attributeName="d" values="M0 310 Q200 305 400 308 Q600 302 800 310;M0 312 Q200 302 400 306 Q600 304 800 312;M0 310 Q200 305 400 308 Q600 302 800 310"
              dur="15s" repeatCount="indefinite" />
          </path>

          {/* Village in the distance — church steeple and rooftops */}
          <rect x="300" y="272" width="8" height="12" fill="rgba(80,60,40,0.08)" />
          <path d="M300 272 L304 264 L308 272" fill="rgba(80,60,40,0.06)" />
          {/* Village rooftops */}
          {[285,295,310,320].map((x, i) => (
            <rect key={`vr${i}`} x={x} y={276+i} width={6+i} height={5+i*0.5} fill="rgba(80,60,40,0.05)" />
          ))}
        </>}

        {/* Interior scene */}
        {mood === 'interior' && <>
          {/* Wooden walls with grain */}
          <rect x="0" y="0" width="800" height="500" fill="#1A1510" />
          {[0, 100, 200, 300, 400, 500, 600, 700].map((x) => (
            <line key={`w${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#15120E" strokeWidth="1" opacity="0.4" />
          ))}
          {/* Horizontal wood grain lines */}
          {[120, 190, 250, 320].map((y, i) => (
            <line key={`wg${i}`} x1="0" y1={y} x2="800" y2={y + (i%2 ? 2 : -1)} stroke="#18140F" strokeWidth="0.5" opacity="0.3" />
          ))}

          {/* Wooden beam ceiling */}
          <rect x="0" y="0" width="800" height="80" fill="#15120E" />
          <line x1="0" y1="80" x2="800" y2="80" stroke="#201A12" strokeWidth="3" />
          <line x1="0" y1="78" x2="800" y2="78" stroke="#2A2218" strokeWidth="1" />
          {/* Ceiling beam crosspieces */}
          {[200, 400, 600].map((x) => (
            <rect key={`cb${x}`} x={x-4} y="0" width="8" height="82" fill="#18140E" stroke="#201A12" strokeWidth="0.5" />
          ))}

          {/* Lantern glow — warm, centered */}
          <radialGradient id="vn_lantern" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255,200,100,0.1)" />
            <stop offset="50%" stopColor="rgba(255,180,80,0.04)" />
            <stop offset="100%" stopColor="rgba(255,200,100,0)" />
          </radialGradient>
          <rect x="0" y="0" width="800" height="500" fill="url(#vn_lantern)" />

          {/* Hanging lantern fixture */}
          <line x1="400" y1="80" x2="400" y2="110" stroke="#3A3020" strokeWidth="1.5" />
          <rect x="390" y="110" width="20" height="25" rx="3" fill="#2A2015" stroke="#3A3020" strokeWidth="0.5" />
          <rect x="393" y="113" width="14" height="18" rx="2" fill="rgba(255,180,80,0.15)" />
          <circle cx="400" cy="122" r="4" fill="rgba(255,180,80,0.25)">
            <animate attributeName="opacity" values="0.25;0.35;0.25" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Window — small, shuttered, faint light */}
          <rect x="620" y="140" width="80" height="100" rx="2" fill="#0E0C08" stroke="#252015" strokeWidth="2" />
          <line x1="660" y1="140" x2="660" y2="240" stroke="#252015" strokeWidth="1.5" />
          <line x1="620" y1="190" x2="700" y2="190" stroke="#252015" strokeWidth="1.5" />
          {/* Faint moonlight through gaps */}
          <rect x="622" y="142" width="36" height="46" fill="rgba(100,120,160,0.03)" />
          <rect x="662" y="142" width="36" height="46" fill="rgba(100,120,160,0.03)" />

          {/* Map on wall */}
          <rect x="120" y="130" width="80" height="60" rx="1" fill="#2A2518" stroke="#3A3020" strokeWidth="0.8" />
          <rect x="125" y="135" width="70" height="50" fill="#252018" />
          {/* Map lines */}
          <path d="M135 155 Q150 148 165 155 Q175 160 185 152" fill="none" stroke="rgba(150,130,80,0.15)" strokeWidth="0.5" />
          <path d="M130 165 L190 165" fill="none" stroke="rgba(150,130,80,0.1)" strokeWidth="0.3" />
          <circle cx="160" cy="158" r="2" fill="rgba(180,50,30,0.15)" />

          {/* Floor boards */}
          <rect x="0" y="400" width="800" height="100" fill="#15120A" />
          {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
            <line key={`f${x}`} x1={x} y1="400" x2={x} y2="500" stroke="#1A1510" strokeWidth="0.5" opacity="0.5" />
          ))}
          {/* Floor board horizontal grain */}
          {[420, 445, 470].map((y, i) => (
            <line key={`fg${i}`} x1="0" y1={y} x2="800" y2={y} stroke="#18140E" strokeWidth="0.3" opacity="0.2" />
          ))}

          {/* Muskets leaning against wall */}
          <line x1="80" y1="400" x2="70" y2="250" stroke="#2A2218" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="400" x2="82" y2="255" stroke="#2A2218" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="400" x2="94" y2="260" stroke="#2A2218" strokeWidth="3" strokeLinecap="round" />
          {/* Bayonets */}
          <line x1="70" y1="250" x2="68" y2="235" stroke="#5A5A5A" strokeWidth="1" />
          <line x1="82" y1="255" x2="80" y2="240" stroke="#5A5A5A" strokeWidth="1" />
          <line x1="94" y1="260" x2="92" y2="245" stroke="#5A5A5A" strokeWidth="1" />

          {/* Barrel in corner */}
          <ellipse cx="720" cy="380" rx="25" ry="10" fill="#2A2015" />
          <rect x="695" y="380" width="50" height="40" rx="3" fill="#2A2015" stroke="#352A1A" strokeWidth="0.5" />
          <ellipse cx="720" cy="420" rx="25" ry="10" fill="#2A2015" stroke="#352A1A" strokeWidth="0.5" />
          {/* Barrel bands */}
          <line x1="695" y1="393" x2="745" y2="393" stroke="#3A3020" strokeWidth="1" />
          <line x1="695" y1="407" x2="745" y2="407" stroke="#3A3020" strokeWidth="1" />

          {/* Stool */}
          <rect x="570" y="390" width="30" height="5" rx="1" fill="#2A2015" />
          <line x1="575" y1="395" x2="573" y2="420" stroke="#2A2015" strokeWidth="2" />
          <line x1="595" y1="395" x2="597" y2="420" stroke="#2A2015" strokeWidth="2" />

          {/* Corner shadows — vignette effect */}
          <rect x="0" y="0" width="150" height="500" fill="rgba(0,0,0,0.08)" />
          <rect x="650" y="0" width="150" height="500" fill="rgba(0,0,0,0.08)" />

          {/* Wall stain marks / damp patches */}
          <ellipse cx="350" cy="200" rx="25" ry="35" fill="rgba(15,12,8,0.08)" />
          <ellipse cx="520" cy="280" rx="18" ry="25" fill="rgba(15,12,8,0.06)" />

          {/* Small table — wooden surface */}
          <rect x="350" y="360" width="100" height="5" rx="1" fill="#2A2218" stroke="#352A1A" strokeWidth="0.5" />
          {/* Table legs */}
          <line x1="360" y1="365" x2="355" y2="400" stroke="#2A2218" strokeWidth="2.5" />
          <line x1="440" y1="365" x2="445" y2="400" stroke="#2A2218" strokeWidth="2.5" />
          {/* Items on table — tin cup, candle */}
          <rect x="385" y="352" width="8" height="8" rx="1" fill="#3A3025" />
          <ellipse cx="389" cy="352" rx="5" ry="2" fill="#3A3025" />
          <line x1="420" y1="360" x2="420" y2="345" stroke="#C0B080" strokeWidth="2" />
          <circle cx="420" cy="343" r="2" fill="rgba(255,200,100,0.2)">
            <animate attributeName="opacity" values="0.2;0.3;0.2" dur="2.5s" repeatCount="indefinite" />
          </circle>

          {/* Wall sconce — oil lamp on bracket */}
          <g opacity="0.8">
            <line x1="250" y1="190" x2="250" y2="185" stroke="#3A3020" strokeWidth="1.5" />
            <rect x="244" y="185" width="12" height="3" rx="1" fill="#3A3020" />
            <path d="M246 185 L248 175 L252 175 L254 185" fill="rgba(255,180,80,0.12)" />
            <circle cx="250" cy="177" r="2" fill="rgba(255,180,80,0.2)">
              <animate attributeName="opacity" values="0.2;0.3;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* Sconce light cone on wall */}
            <path d="M250 175 L220 140 L280 140 Z" fill="rgba(255,180,80,0.015)" />
          </g>

          {/* Dust motes in lantern light */}
          {[1,2,3,4,5,6].map((i) => (
            <circle key={`dm${i}`} cx={350 + i*20} cy={150 + i*30} r="0.8" fill="rgba(255,200,100,0.06)">
              <animate attributeName="cy" values={`${150+i*30};${140+i*30};${150+i*30}`}
                dur={`${4+i}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Rat silhouette near floor — scurrying in the dark */}
          <g opacity="0.1">
            <ellipse cx="50" cy="410" rx="5" ry="2.5" fill="#0A0808" />
            <circle cx="44" cy="408" r="1.5" fill="#0A0808" />
            <path d="M55 410 Q65 407 75 410" fill="none" stroke="#0A0808" strokeWidth="0.5" />
          </g>

          {/* Cobweb in corner */}
          <path d="M0 82 Q20 90 40 82" fill="none" stroke="rgba(200,200,200,0.03)" strokeWidth="0.3" />
          <path d="M0 82 Q15 100 20 120" fill="none" stroke="rgba(200,200,200,0.025)" strokeWidth="0.3" />
          <path d="M0 82 Q25 95 40 82 Q30 100 20 120" fill="rgba(200,200,200,0.008)" />
        </>}

        {/* Ridge scene — Alpine mountain pass */}
        {mood === 'ridge' && <>
          {/* Star field — more stars for altitude */}
          {[50,150,250,350,450,550,650,750,100,300,500,700,40,180,320,480,620,760].map((x, i) => (
            <circle key={`rs${i}`} cx={x} cy={15+i*4} r={i % 6 === 0 ? 1.2 : 0.7} fill="white" opacity={0.15 + (i%4)*0.1}>
              {i % 5 === 0 && <animate attributeName="opacity" values={`${0.15+(i%4)*0.1};${0.4+(i%3)*0.1};${0.15+(i%4)*0.1}`}
                dur={`${3+i%3}s`} repeatCount="indefinite" />}
            </circle>
          ))}

          {/* Distant snow-capped peaks */}
          <path d="M0 180 L80 100 L160 150 L250 80 L350 130 L450 70 L550 120 L650 90 L750 110 L800 140 L800 500 L0 500 Z"
            fill="#0A1020" opacity="0.95" />
          {/* Snow caps */}
          <path d="M240 85 L250 80 L260 88" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M440 75 L450 70 L460 78" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="3" strokeLinecap="round" />
          <path d="M640 95 L650 90 L660 97" fill="none" stroke="rgba(200,210,230,0.2)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Mid-range ridges */}
          <path d="M0 280 L100 240 L250 270 L350 230 L500 260 L650 240 L800 270 L800 500 L0 500 Z"
            fill="#121E2E" opacity="0.85" />

          {/* Near ridge with tree silhouettes */}
          <path d="M0 340 L80 310 L200 330 L320 300 L480 325 L600 305 L720 320 L800 310 L800 500 L0 500 Z"
            fill="#1A2838" />

          {/* Pine tree silhouettes on ridgeline */}
          {[60,130,180,260,340,380,500,560,620,700,760].map((x, i) => {
            const h = 18 + (i % 3) * 8;
            const baseY = 308 + (x < 300 ? (x/300)*30 : x > 500 ? ((800-x)/300)*15 : 15);
            return <path key={`tree${i}`} d={`M${x} ${baseY} L${x-4-i%2*2} ${baseY} L${x} ${baseY-h} L${x+4+i%2*2} ${baseY} Z`}
              fill="#0A1520" opacity={0.7 + (i%3)*0.1} />;
          })}

          {/* Ground plateau with texture */}
          <rect x="0" y="360" width="800" height="140" fill="#1A2535" />
          {/* Rocky ground texture */}
          {[40,120,220,350,480,580,700].map((x, i) => (
            <ellipse key={`rg${i}`} cx={x} cy={375+i*3} rx={15+i*3} ry={3+i} fill="rgba(30,40,55,0.4)" />
          ))}

          {/* Wind lines — more visible */}
          {[1,2,3,4,5].map((i) => (
            <line key={`wl${i}`} x1={80*i} y1={180+i*25} x2={80*i+60+i*10} y2={175+i*25}
              stroke="rgba(200,220,255,0.04)" strokeWidth="0.8" strokeLinecap="round">
              <animate attributeName="x1" values={`${80*i};${80*i+20};${80*i}`} dur={`${4+i}s`} repeatCount="indefinite" />
            </line>
          ))}

          {/* Moon — crescent with detail */}
          <circle cx="680" cy="60" r="30" fill="rgba(180,200,230,0.03)" />
          <circle cx="680" cy="60" r="18" fill="rgba(200,215,240,0.06)" />
          <circle cx="680" cy="60" r="10" fill="rgba(220,230,245,0.1)" />
          <circle cx="684" cy="57" r="9" fill="#060A14" />{/* Crescent mask */}
          {/* Moon surface hints */}
          <circle cx="676" cy="62" r="1.5" fill="rgba(200,215,240,0.04)" />
          <circle cx="679" cy="55" r="1" fill="rgba(200,215,240,0.03)" />

          {/* Moonbeam rays — diagonal shafts of light */}
          <line x1="680" y1="75" x2="600" y2="350" stroke="rgba(180,200,230,0.015)" strokeWidth="30" />
          <line x1="680" y1="75" x2="500" y2="400" stroke="rgba(180,200,230,0.012)" strokeWidth="25" />
          <line x1="680" y1="75" x2="720" y2="380" stroke="rgba(180,200,230,0.01)" strokeWidth="20" />

          {/* Valley mist between ridges */}
          <ellipse cx="200" cy="275" rx="120" ry="15" fill="rgba(150,170,200,0.04)">
            <animate attributeName="rx" values="120;130;120" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="500" cy="265" rx="100" ry="12" fill="rgba(150,170,200,0.035)">
            <animate attributeName="rx" values="100;115;100" dur="10s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="700" cy="270" rx="80" ry="10" fill="rgba(150,170,200,0.03)">
            <animate attributeName="rx" values="80;90;80" dur="7s" repeatCount="indefinite" />
          </ellipse>

          {/* Falling snow — gentle flakes */}
          {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => {
            const sx = 40 + i * 62 + (i % 3) * 15;
            const sy = -10 - i * 8;
            const drift = (i % 2 ? 1 : -1) * (15 + i * 3);
            const dur = 8 + i * 1.2;
            const r = 0.6 + (i % 4) * 0.3;
            return (
              <circle key={`snow${i}`} cx={sx} cy={sy} r={r} fill="rgba(220,230,245,0.15)">
                <animate attributeName="cy" values={`${sy};${500}`} dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${sx};${sx+drift};${sx+drift*0.3}`} dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.2;0.15;0" dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Frost patches on ground — more visible */}
          {[60,140,220,320,420,530,640,720].map((x, i) => (
            <ellipse key={`frost${i}`} cx={x} cy={368+i*3} rx={18+i*4} ry={2+i*0.8}
              fill="rgba(200,220,240,0.04)" />
          ))}

          {/* Ice crystals on rocks */}
          {[100,250,450,600,720].map((x, i) => (
            <g key={`ice${i}`}>
              <line x1={x} y1={370+i*3} x2={x+3} y2={366+i*3} stroke="rgba(200,220,255,0.06)" strokeWidth="0.5" />
              <line x1={x+2} y1={371+i*3} x2={x+6} y2={368+i*3} stroke="rgba(200,220,255,0.05)" strokeWidth="0.5" />
              <circle cx={x+4} cy={366+i*3} r="0.5" fill="rgba(220,230,255,0.08)" />
            </g>
          ))}

          {/* Path/trail on ground */}
          <path d="M350 500 L370 400 L380 380 L400 370 L430 375 L500 500" fill="rgba(25,35,50,0.3)" />
          {/* Footprints on path — longer trail */}
          {[370,378,386,394,402,410,418,426,434].map((x, i) => (
            <ellipse key={`fp${i}`} cx={x + (i%2)*3} cy={382+i*3.5} rx="2" ry="1"
              fill="rgba(15,25,40,0.2)" transform={`rotate(${10-i*4} ${x} ${382+i*3.5})`} />
          ))}

          {/* Breath mist — cold air visible near portrait level */}
          <ellipse cx="150" cy="380" rx="25" ry="8" fill="rgba(180,200,230,0.03)">
            <animate attributeName="rx" values="25;30;25" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.03;0.05;0.03" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="650" cy="380" rx="20" ry="6" fill="rgba(180,200,230,0.025)">
            <animate attributeName="rx" values="20;26;20" dur="5s" repeatCount="indefinite" />
          </ellipse>

          {/* Distant campfire glow on the path ahead */}
          <circle cx="398" cy="210" r="8" fill="rgba(255,150,50,0.03)" />
          <circle cx="398" cy="210" r="3" fill="rgba(255,180,80,0.06)">
            <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
          </circle>
        </>}

        {/* Gorge scene — narrow ravine with cliff walls */}
        {mood === 'gorge' && <>
          {/* Narrow sky strip visible between cliffs — with faint stars */}
          <rect x="150" y="0" width="500" height="150" fill="rgba(15,20,35,0.3)" />
          {[200,280,350,420,500,580].map((x, i) => (
            <circle key={`gstar${i}`} cx={x} cy={20+i*12} r={i%3===0 ? 1 : 0.6} fill="white" opacity={0.08+i*0.02}>
              <animate attributeName="opacity" values={`${0.08+i*0.02};${0.15+i*0.02};${0.08+i*0.02}`}
                dur={`${3+i}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Left cliff wall — jagged, textured */}
          <path d="M0 0 L0 500 L120 500 L100 420 L130 350 L90 280 L140 220 L80 160 L120 100 L70 50 L50 0 Z"
            fill="#0E0E18" />
          {/* Left cliff secondary depth layer */}
          <path d="M50 0 L40 80 L80 160 L55 220 L95 300 L60 350 L90 420 L80 500 L120 500 L100 420 L130 350 L90 280 L140 220 L80 160 L120 100 L70 50 L50 0 Z"
            fill="#12121E" opacity="0.7" />
          {/* Left cliff texture — cracks and ledges */}
          <line x1="30" y1="80" x2="90" y2="120" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          <line x1="20" y1="180" x2="100" y2="200" stroke="rgba(25,25,40,0.5)" strokeWidth="0.8" />
          <line x1="40" y1="300" x2="110" y2="320" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          <line x1="10" y1="380" x2="80" y2="400" stroke="rgba(25,25,40,0.5)" strokeWidth="0.8" />
          {/* Left cliff deeper cracks */}
          <path d="M60 140 Q70 155 55 175" fill="none" stroke="rgba(8,8,15,0.5)" strokeWidth="0.6" />
          <path d="M45 260 Q55 280 40 310" fill="none" stroke="rgba(8,8,15,0.4)" strokeWidth="0.5" />
          <path d="M80 350 Q90 370 75 390" fill="none" stroke="rgba(8,8,15,0.45)" strokeWidth="0.6" />
          {/* Left cliff moss patches */}
          <ellipse cx="60" cy="250" rx="15" ry="8" fill="rgba(30,50,30,0.15)" />
          <ellipse cx="40" cy="350" rx="10" ry="5" fill="rgba(30,50,30,0.12)" />
          <ellipse cx="80" cy="180" rx="8" ry="4" fill="rgba(25,45,25,0.1)" />
          {/* Left cliff icicles (high altitude gorge) */}
          {[100,115,125,108].map((x, i) => (
            <path key={`licl${i}`} d={`M${x} ${160+i*35} L${x+1} ${170+i*35+i*3} L${x-1} ${170+i*35+i*3} Z`}
              fill="rgba(160,180,220,0.08)" />
          ))}

          {/* Right cliff wall — jagged, textured */}
          <path d="M800 0 L800 500 L680 500 L700 420 L670 340 L710 270 L660 200 L720 140 L680 80 L730 30 L750 0 Z"
            fill="#0E0E18" />
          {/* Right cliff secondary depth layer */}
          <path d="M750 0 L760 80 L720 140 L745 200 L705 270 L740 340 L720 420 L730 500 L680 500 L700 420 L670 340 L710 270 L660 200 L720 140 L680 80 L730 30 L750 0 Z"
            fill="#12121E" opacity="0.7" />
          {/* Right cliff texture */}
          <line x1="770" y1="100" x2="710" y2="130" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          <line x1="780" y1="220" x2="700" y2="240" stroke="rgba(25,25,40,0.5)" strokeWidth="0.8" />
          <line x1="760" y1="340" x2="690" y2="360" stroke="rgba(25,25,40,0.6)" strokeWidth="1" />
          {/* Right cliff deeper cracks */}
          <path d="M740 120 Q730 140 745 165" fill="none" stroke="rgba(8,8,15,0.5)" strokeWidth="0.6" />
          <path d="M720 280 Q710 300 725 325" fill="none" stroke="rgba(8,8,15,0.4)" strokeWidth="0.5" />
          {/* Right cliff moss */}
          <ellipse cx="730" cy="280" rx="12" ry="6" fill="rgba(30,50,30,0.12)" />
          <ellipse cx="710" cy="180" rx="8" ry="5" fill="rgba(25,45,25,0.09)" />
          {/* Right cliff icicles */}
          {[690,700,685,695].map((x, i) => (
            <path key={`ricl${i}`} d={`M${x} ${140+i*40} L${x+1} ${152+i*40+i*2} L${x-1} ${152+i*40+i*2} Z`}
              fill="rgba(160,180,220,0.07)" />
          ))}

          {/* Overhanging rock shelves */}
          <path d="M120 180 L180 175 L170 185 L120 185 Z" fill="#0A0A15" opacity="0.6" />
          <path d="M680 250 L620 245 L630 258 L680 258 Z" fill="#0A0A15" opacity="0.6" />
          {/* Deeper overhangs with shadow */}
          <path d="M130 120 L190 115 L185 128 L130 125 Z" fill="#08080F" opacity="0.5" />
          <path d="M670 320 L610 315 L618 330 L670 328 Z" fill="#08080F" opacity="0.5" />

          {/* Gorge floor — uneven terrain */}
          <path d="M0 380 L120 375 L200 385 L350 378 L500 382 L650 376 L680 380 L800 378 L800 500 L0 500 Z"
            fill="#08080E" />
          {/* Floor texture — darker crevice lines */}
          <path d="M150 385 Q250 390 350 383 Q450 388 550 380" fill="none" stroke="rgba(5,5,10,0.3)" strokeWidth="0.5" />
          <path d="M200 395 Q350 400 500 393" fill="none" stroke="rgba(5,5,10,0.25)" strokeWidth="0.4" />

          {/* Scattered rocks on floor */}
          {[150,220,310,400,490,560,640].map((x, i) => (
            <ellipse key={`rk${i}`} cx={x} cy={388+i*2+(i%2)*5} rx={8+i*2} ry={4+i} fill={`rgba(${25+i*3},${25+i*2},${35+i*2},0.4)`} />
          ))}

          {/* Fallen boulders with highlights */}
          <ellipse cx="280" cy="395" rx="20" ry="10" fill="rgba(30,30,40,0.5)" />
          <ellipse cx="275" cy="392" rx="12" ry="5" fill="rgba(40,40,55,0.15)" />
          <ellipse cx="520" cy="390" rx="15" ry="8" fill="rgba(35,35,45,0.4)" />
          <ellipse cx="516" cy="387" rx="9" ry="4" fill="rgba(45,45,60,0.12)" />

          {/* Rubble/scree at base of cliffs */}
          {[130,140,150,160,670,680,690,700].map((x, i) => (
            <ellipse key={`scree${i}`} cx={x} cy={382+i%3*3} rx={3+i%2*2} ry={2+i%2}
              fill={`rgba(20,20,30,${0.25+i*0.03})`} />
          ))}

          {/* Water/stream — visible with animation */}
          <path d="M250 480 Q300 468 350 473 Q400 480 450 470 Q500 465 550 472 Q600 478 650 468"
            fill="none" stroke="rgba(100,120,180,0.12)" strokeWidth="3" strokeLinecap="round">
            <animate attributeName="d"
              values="M250 480 Q300 468 350 473 Q400 480 450 470 Q500 465 550 472 Q600 478 650 468;M250 478 Q300 470 350 475 Q400 478 450 468 Q500 467 550 474 Q600 476 650 470;M250 480 Q300 468 350 473 Q400 480 450 470 Q500 465 550 472 Q600 478 650 468"
              dur="4s" repeatCount="indefinite" />
          </path>
          {/* Secondary stream — thinner, offset */}
          <path d="M280 488 Q350 478 420 482 Q490 475 560 480"
            fill="none" stroke="rgba(80,100,160,0.06)" strokeWidth="1.5" strokeLinecap="round">
            <animate attributeName="d"
              values="M280 488 Q350 478 420 482 Q490 475 560 480;M280 486 Q350 480 420 484 Q490 477 560 478;M280 488 Q350 478 420 482 Q490 475 560 480"
              dur="5s" repeatCount="indefinite" />
          </path>
          {/* Water shimmer highlights */}
          {[300,380,450,530,350,420].map((x, i) => (
            <circle key={`ws${i}`} cx={x} cy={472+i*2} r={i<4 ? 1 : 0.6} fill="rgba(150,170,220,0.08)">
              <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${2+i*0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Muzzle flash / smoke from above (suggesting Grenzer fire) */}
          <circle cx="160" cy="150" r="4" fill="rgba(255,200,100,0.04)">
            <animate attributeName="opacity" values="0.04;0.12;0.04" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="150" r="12" fill="rgba(255,200,100,0)">
            <animate attributeName="opacity" values="0;0.03;0" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="120" r="3" fill="rgba(255,200,100,0.03)">
            <animate attributeName="opacity" values="0.03;0.1;0.03" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="650" cy="120" r="10" fill="rgba(255,200,100,0)">
            <animate attributeName="opacity" values="0;0.025;0" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Muzzle flash from higher up on left cliff */}
          <circle cx="110" cy="90" r="3" fill="rgba(255,200,100,0.02)">
            <animate attributeName="opacity" values="0.02;0.08;0.02" dur="5.5s" repeatCount="indefinite" />
          </circle>

          {/* Smoke wisps drifting through gorge */}
          {[1,2,3,4].map((i) => {
            const startX = 180 + i * 110;
            const y = 330 + i * 12;
            return (
              <ellipse key={`smk${i}`} cx={startX} cy={y} rx={30+i*10} ry={5+i*2}
                fill="rgba(100,110,140,0.03)">
                <animate attributeName="cx" values={`${startX};${startX+40};${startX}`}
                  dur={`${6+i*2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.03;0.06;0.03"
                  dur={`${6+i*2}s`} repeatCount="indefinite" />
              </ellipse>
            );
          })}

          {/* Falling rock debris — small particles drifting down */}
          {[1,2,3,4,5].map((i) => {
            const x = 130 + (i % 2 === 0 ? i * 15 : 530 + i * 20);
            const startY = 50 + i * 40;
            const dur = 4 + i * 1.5;
            return (
              <circle key={`debris${i}`} cx={x} cy={startY} r={0.8 + (i%2)*0.4}
                fill="rgba(50,50,65,0.3)">
                <animate attributeName="cy" values={`${startY};${startY+120}`}
                  dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.15;0"
                  dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Water drips from cliff walls — more drips */}
          {[1,2,3,4,5,6].map((i) => {
            const x = i <= 3 ? 90 + i * 18 : 675 + (i-3) * 15;
            const startY = 120 + i * 45;
            return (
              <circle key={`drip${i}`} cx={x} cy={startY} r="0.8"
                fill="rgba(130,150,200,0.15)">
                <animate attributeName="cy" values={`${startY};${startY+90}`}
                  dur={`${2+i*0.4}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.08;0"
                  dur={`${2+i*0.4}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Light shaft from narrow sky — with dust particles */}
          <polygon points="350,0 450,0 500,380 300,380"
            fill="rgba(180,200,230,0.01)" />
          <polygon points="370,0 430,0 460,380 340,380"
            fill="rgba(180,200,230,0.008)" />
          {/* Dust motes in light shaft */}
          {[1,2,3,4,5,6,7,8].map((i) => {
            const x = 350 + (i%5)*20;
            const y = 40 + i*35;
            const drift = (i%2 ? 5 : -5);
            return (
              <circle key={`ldust${i}`} cx={x} cy={y} r={0.5+(i%3)*0.2}
                fill="rgba(180,200,230,0.05)">
                <animate attributeName="cy" values={`${y};${y+25};${y}`}
                  dur={`${5+i}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${x};${x+drift};${x}`}
                  dur={`${7+i}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Mineral veins on cliff walls — more extensive */}
          <path d="M40 120 Q55 140 45 170 Q60 190 50 220"
            fill="none" stroke="rgba(60,50,40,0.15)" strokeWidth="0.5" />
          <path d="M25 280 Q40 300 30 330"
            fill="none" stroke="rgba(60,50,40,0.1)" strokeWidth="0.4" />
          <path d="M760 160 Q745 185 755 210 Q740 235 750 260"
            fill="none" stroke="rgba(60,50,40,0.12)" strokeWidth="0.5" />
          <path d="M770 310 Q755 335 765 360"
            fill="none" stroke="rgba(60,50,40,0.1)" strokeWidth="0.4" />
          {/* Quartz-like bright veins */}
          <path d="M70 200 Q80 210 75 225"
            fill="none" stroke="rgba(200,200,220,0.04)" strokeWidth="0.3" />
          <path d="M730 230 Q720 245 725 260"
            fill="none" stroke="rgba(200,200,220,0.035)" strokeWidth="0.3" />

          {/* Echo rings — faint concentric semicircles suggesting reverberation */}
          {[1,2,3].map((i) => (
            <path key={`echo${i}`} d={`M${400-40*i} 360 A${40*i} ${20*i} 0 0 1 ${400+40*i} 360`}
              fill="none" stroke="rgba(100,110,140,0.015)" strokeWidth="0.5">
              <animate attributeName="opacity" values="0.015;0.03;0.015"
                dur={`${4+i*2}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Fog layers — multi-depth */}
          <ellipse cx="400" cy="365" rx="200" ry="10" fill="rgba(100,110,140,0.04)">
            <animate attributeName="rx" values="200;220;200" dur="9s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="350" cy="375" rx="150" ry="8" fill="rgba(100,110,140,0.03)">
            <animate attributeName="rx" values="150;170;150" dur="7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="450" cy="355" rx="120" ry="6" fill="rgba(100,110,140,0.025)">
            <animate attributeName="rx" values="120;140;120" dur="11s" repeatCount="indefinite" />
          </ellipse>

          {/* Hanging roots/vines from cliff edges */}
          {[
            { x: 125, y: 100, h: 35 }, { x: 135, y: 160, h: 28 },
            { x: 110, y: 240, h: 40 }, { x: 145, y: 310, h: 22 },
            { x: 675, y: 130, h: 32 }, { x: 665, y: 210, h: 38 },
            { x: 690, y: 290, h: 25 }, { x: 660, y: 350, h: 30 },
          ].map((v, i) => (
            <path key={`vine${i}`}
              d={`M${v.x} ${v.y} Q${v.x + (i%2 ? 4 : -4)} ${v.y + v.h * 0.5} ${v.x + (i%2 ? 2 : -2)} ${v.y + v.h}`}
              fill="none" stroke="rgba(25,40,20,0.2)" strokeWidth={0.6 + (i%3)*0.2} strokeLinecap="round">
              <animate attributeName="d"
                values={`M${v.x} ${v.y} Q${v.x + (i%2 ? 4 : -4)} ${v.y + v.h * 0.5} ${v.x + (i%2 ? 2 : -2)} ${v.y + v.h};M${v.x} ${v.y} Q${v.x + (i%2 ? 6 : -6)} ${v.y + v.h * 0.5} ${v.x + (i%2 ? 3 : -3)} ${v.y + v.h};M${v.x} ${v.y} Q${v.x + (i%2 ? 4 : -4)} ${v.y + v.h * 0.5} ${v.x + (i%2 ? 2 : -2)} ${v.y + v.h}`}
                dur={`${8 + i * 2}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Torch glow on gorge floor — distant soldiers' light */}
          <radialGradient id="vn_gorge_torch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,160,60,0.06)" />
            <stop offset="60%" stopColor="rgba(255,120,40,0.02)" />
            <stop offset="100%" stopColor="rgba(255,100,30,0)" />
          </radialGradient>
          <circle cx="400" cy="395" r="60" fill="url(#vn_gorge_torch)">
            <animate attributeName="r" values="60;65;58;60" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Torch flame */}
          <ellipse cx="400" cy="375" rx="2" ry="4" fill="rgba(255,180,80,0.12)">
            <animate attributeName="ry" values="4;5;3;4" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.12;0.18;0.1;0.12" dur="1.2s" repeatCount="indefinite" />
          </ellipse>
          {/* Torch stick */}
          <line x1="400" y1="378" x2="400" y2="395" stroke="rgba(60,40,20,0.3)" strokeWidth="1.5" />

          {/* Danger atmosphere — subtle red tint on lower rocks (blood/fire) */}
          <rect x="150" y="370" width="500" height="130" fill="rgba(120,30,20,0.015)" />

          {/* Distant soldier silhouettes in gorge (column formation) */}
          {[240, 270, 300, 330, 360].map((x, i) => (
            <g key={`sol${i}`} opacity={0.06 + i * 0.01}>
              <rect x={x} y={385 - i * 2} width={3} height={8} fill="rgba(20,20,30,1)" rx="0.5" />
              <circle cx={x + 1.5} cy={383 - i * 2} r={1.5} fill="rgba(20,20,30,1)" />
            </g>
          ))}

          {/* Water reflection on wet rocks — animated shimmer */}
          {[170, 250, 350, 450, 550, 630].map((x, i) => (
            <ellipse key={`wref${i}`} cx={x} cy={388 + i%3 * 4} rx={6 + i*2} ry={1.5}
              fill="rgba(100,120,180,0.03)">
              <animate attributeName="opacity" values="0.03;0.07;0.03"
                dur={`${3 + i * 0.8}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
        </>}
      </svg>
    </div>
  );
}
