import React from 'react';
import type { Expression, CharPosition, VNCharacter } from '../../types/vnTypes';
import { EXPRESSION_COLORS } from '../../types/vnTypes';

/** Skin tone for portraits */
const SKIN = '#D4B896';
const SKIN_SHADOW = '#B89870';
const HAIR_MEDIUM = '#6B4E35';
const UNIFORM_BLUE = '#1E3A5C';
const UNIFORM_BLUE_LIGHT = '#2A4A6E';
const UNIFORM_RED = '#8B2020';
const UNIFORM_WHITE = '#E8E0D0';

export function CharacterPortrait({ character, expression, speaking, position }: {
  character: VNCharacter;
  expression: Expression;
  speaking: boolean;
  position: CharPosition;
}) {
  if (position === 'off') return null;

  const exprColor = EXPRESSION_COLORS[expression];
  const posClass = `vn-portrait vn-portrait-${position}${speaking ? ' vn-speaking' : ''}`;

  // === Image portrait mode ===
  // When portraitAssetPath is set, render <img> instead of procedural SVG.
  // Expected: {portraitAssetPath}/{expression}.png (e.g., /assets/portraits/pierre/neutral.png)
  if (character.portraitAssetPath) {
    const imgSrc = `${character.portraitAssetPath}/${expression}.png`;
    return (
      <div className={posClass} style={{
          '--portrait-color': character.color,
          '--portrait-glow': `${character.color}26`,
          '--portrait-glow-soft': `${character.color}0D`,
        } as React.CSSProperties}>
        <div className="vn-portrait-frame vn-portrait-frame-img" style={{
            borderColor: speaking ? character.color : undefined,
          }}
          title={`${character.name} — ${expression}`}>
          <img
            src={imgSrc}
            alt={`${character.name} — ${expression}`}
            className="vn-portrait-img"
            draggable={false}
          />
        </div>
        <span className="vn-portrait-name" style={{ color: character.color }}>{character.name}</span>
        {expression !== character.defaultExpression && (
          <span className="vn-expression-badge" style={{ color: exprColor }}>{expression}</span>
        )}
      </div>
    );
  }

  // === Procedural SVG portrait mode (fallback) ===
  const isOfficer = character.rank === 'Captain';
  const isNCO = character.rank === 'Sergeant';

  // Stagger blink timing per character so they don't blink in sync
  const blinkDur = 3.5 + (character.id.charCodeAt(0) % 5) * 0.4; // 3.5–5.1s range

  // Per-character appearance traits
  const charTraits = {
    pierre: { hair: '#2A1A0A', eyeColor: '#4A6070', jawWidth: 28, headRy: 32, hasScar: true, hasMustache: true, stubble: true },
    jb: { hair: '#7A5A30', eyeColor: '#5A7040', jawWidth: 24, headRy: 30, hasScar: false, hasMustache: false, stubble: false },
    felix: { hair: '#B8862D', eyeColor: '#6A5030', jawWidth: 26, headRy: 31, hasScar: false, hasMustache: false, stubble: false },
    morin: { hair: '#5A5A5A', eyeColor: '#4A4040', jawWidth: 30, headRy: 33, hasScar: false, hasMustache: true, stubble: true },
    leclerc: { hair: '#1A1008', eyeColor: '#3A3020', jawWidth: 27, headRy: 31, hasScar: false, hasMustache: true, stubble: false },
    duval: { hair: '#4A3020', eyeColor: '#5A4030', jawWidth: 30, headRy: 34, hasScar: true, hasMustache: true, stubble: true },
  } as Record<string, { hair: string; eyeColor: string; jawWidth: number; headRy: number; hasScar: boolean; hasMustache: boolean; stubble: boolean }>;
  const traits = charTraits[character.id] ?? { hair: HAIR_MEDIUM, eyeColor: '#5A4030', jawWidth: 27, headRy: 32, hasScar: false, hasMustache: false, stubble: false };
  const hairColor = traits.hair;

  return (
    <div className={posClass} style={{
        '--portrait-color': character.color,
        '--portrait-glow': `${character.color}26`,
        '--portrait-glow-soft': `${character.color}0D`,
      } as React.CSSProperties}>
      <div className="vn-portrait-frame" style={{
          borderColor: speaking ? character.color : undefined,
        }}
        title={`${character.name} — ${expression}`}>
        <svg viewBox="0 0 160 220" className="vn-portrait-svg">
          <defs>
            <linearGradient id={`bg_${character.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(30,25,20,0.9)" />
              <stop offset="100%" stopColor="rgba(15,12,8,0.95)" />
            </linearGradient>
            <radialGradient id={`skin_${character.id}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor={SKIN} />
              <stop offset="100%" stopColor={SKIN_SHADOW} />
            </radialGradient>
            <linearGradient id={`uniform_${character.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isOfficer ? '#2A4A6E' : UNIFORM_BLUE} />
              <stop offset="100%" stopColor={isOfficer ? '#1A3A5A' : '#152A40'} />
            </linearGradient>
          </defs>

          {/* Background fill */}
          <rect width="160" height="220" fill={`url(#bg_${character.id})`} />

          {/* Uniform body — French revolutionary military coat */}
          <path d="M30 220 L30 155 Q30 130 50 120 L80 112 L110 120 Q130 130 130 155 L130 220 Z"
            fill={`url(#uniform_${character.id})`} />

          {/* Coat lapels (red for line infantry) */}
          <path d="M60 120 L80 112 L80 165 L55 155 Z" fill={UNIFORM_RED} opacity="0.8" />
          <path d="M100 120 L80 112 L80 165 L105 155 Z" fill={UNIFORM_RED} opacity="0.8" />

          {/* Waistcoat (white) */}
          <path d="M65 150 L80 145 L95 150 L95 220 L65 220 Z" fill={UNIFORM_WHITE} opacity="0.15" />

          {/* Turnback cuffs */}
          <rect x="28" y="185" width="18" height="12" rx="2" fill={UNIFORM_RED} opacity="0.6" />
          <rect x="114" y="185" width="18" height="12" rx="2" fill={UNIFORM_RED} opacity="0.6" />

          {/* Brass buttons */}
          {[130, 140, 150, 160, 170, 180].map((y) => (
            <circle key={`btn_${y}`} cx="80" cy={y} r="2" fill="#C4A035" opacity="0.7" />
          ))}

          {/* Epaulettes */}
          <ellipse cx="48" cy="122" rx="12" ry="5" fill={isOfficer ? '#D4AF37' : isNCO ? '#C4956A' : UNIFORM_BLUE_LIGHT}
            stroke={isOfficer ? '#A88920' : 'none'} strokeWidth="0.5" />
          <ellipse cx="112" cy="122" rx="12" ry="5" fill={isOfficer ? '#D4AF37' : isNCO ? '#C4956A' : UNIFORM_BLUE_LIGHT}
            stroke={isOfficer ? '#A88920' : 'none'} strokeWidth="0.5" />

          {/* Epaulette fringe for officers */}
          {isOfficer && <>
            {[38,42,46,50,54,58].map((x) => (
              <line key={`efl_${x}`} x1={x} y1="126" x2={x-2} y2="132" stroke="#D4AF37" strokeWidth="0.8" />
            ))}
            {[102,106,110,114,118,122].map((x) => (
              <line key={`efr_${x}`} x1={x} y1="126" x2={x+2} y2="132" stroke="#D4AF37" strokeWidth="0.8" />
            ))}
          </>}

          {/* NCO rank chevrons */}
          {isNCO && <>
            <path d="M38 145 L48 138 L58 145" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
            <path d="M38 150 L48 143 L58 150" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          </>}

          {/* Neck / collar */}
          <rect x="62" y="105" width="36" height="10" rx="3" fill={UNIFORM_BLUE} stroke="#C4956A" strokeWidth="0.5" />

          {/* Neck skin */}
          <rect x="70" y="96" width="20" height="14" rx="4" fill={`url(#skin_${character.id})`} />

          {/* Head — shape varies per character */}
          <ellipse cx="80" cy="70" rx={traits.jawWidth} ry={traits.headRy} fill={`url(#skin_${character.id})`} />

          {/* Jaw definition */}
          <path d={`M${80-traits.jawWidth+3} 78 Q${80-traits.jawWidth+8} 98 80 100 Q${80+traits.jawWidth-8} 98 ${80+traits.jawWidth-3} 78`}
            fill={SKIN_SHADOW} opacity="0.3" />

          {/* Stubble/5 o'clock shadow */}
          {traits.stubble && <ellipse cx="80" cy="88" rx="18" ry="12" fill={hairColor} opacity="0.08" />}

          {/* Hair — thicker, more volume, shape varies */}
          {!isOfficer && <>
            <path d={`M${80-traits.jawWidth-2} 58 Q${80-traits.jawWidth} 30 80 ${25 - (traits.headRy > 32 ? 3 : 0)} Q${80+traits.jawWidth} 30 ${80+traits.jawWidth+2} 58 L${80+traits.jawWidth-3} 52 Q${80+traits.jawWidth-8} 36 80 ${32 - (traits.headRy > 32 ? 3 : 0)} Q${80-traits.jawWidth+8} 36 ${80-traits.jawWidth+3} 52 Z`}
              fill={hairColor} />
            {/* Hair texture lines */}
            <path d={`M${80-traits.jawWidth+5} 40 Q75 32 80 ${28 - (traits.headRy > 32 ? 2 : 0)}`} fill="none" stroke={hairColor} strokeWidth="2" opacity="0.5" />
            <path d={`M${80+traits.jawWidth-5} 40 Q85 32 80 ${28 - (traits.headRy > 32 ? 2 : 0)}`} fill="none" stroke={hairColor} strokeWidth="2" opacity="0.5" />
          </>}
          {/* Sideburns — thicker for older/rougher characters */}
          <rect x={80 - traits.jawWidth - 2} y="55" width={traits.stubble ? 7 : 5} height={traits.hasMustache ? 22 : 16} rx="2" fill={hairColor} opacity={traits.stubble ? 0.85 : 0.6} />
          <rect x={80 + traits.jawWidth - (traits.stubble ? 5 : 3)} y="55" width={traits.stubble ? 7 : 5} height={traits.hasMustache ? 22 : 16} rx="2" fill={hairColor} opacity={traits.stubble ? 0.85 : 0.6} />

          {/* Nose */}
          <path d="M80 62 L78 78 Q80 81 82 78 L80 62" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.5" />

          {/* Eyes */}
          <g>
            {/* Eye whites */}
            <ellipse cx="68" cy="65" rx="7" ry="4.5" fill="#F0EDE5" />
            <ellipse cx="92" cy="65" rx="7" ry="4.5" fill="#F0EDE5" />
            {/* Irises */}
            <circle cx={expression === 'afraid' ? 66 : 68} cy="65" r="3.5" fill={traits.eyeColor} />
            <circle cx={expression === 'afraid' ? 94 : 92} cy="65" r="3.5" fill={traits.eyeColor} />
            {/* Pupils */}
            <circle cx={expression === 'afraid' ? 66 : 68} cy="65" r="1.8" fill="#1A1A1A" />
            <circle cx={expression === 'afraid' ? 94 : 92} cy="65" r="1.8" fill="#1A1A1A" />
            {/* Eye highlights */}
            <circle cx={expression === 'afraid' ? 67 : 69} cy="64" r="1" fill="white" opacity="0.7" />
            <circle cx={expression === 'afraid' ? 95 : 93} cy="64" r="1" fill="white" opacity="0.7" />
            {/* Upper eyelids */}
            <path d="M61 63 Q68 58 75 63" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" />
            <path d="M85 63 Q92 58 99 63" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" />
            {/* Blink overlay — skin-colored lids that periodically close */}
            <ellipse cx="68" cy="64" rx="8" ry="0" fill={SKIN_SHADOW}>
              <animate attributeName="ry" values="0;0;0;5;0;0;0" keyTimes="0;0.92;0.94;0.96;0.98;0.99;1" dur={`${blinkDur}s`} repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="92" cy="64" rx="8" ry="0" fill={SKIN_SHADOW}>
              <animate attributeName="ry" values="0;0;0;5;0;0;0" keyTimes="0;0.92;0.94;0.96;0.98;0.99;1" dur={`${blinkDur}s`} repeatCount="indefinite" />
            </ellipse>
          </g>

          {/* Expression-dependent eyebrows */}
          {expression === 'angry' && <>
            <path d="M59 55 L73 52" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M87 52 L101 55" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          </>}
          {expression === 'surprised' && <>
            <path d="M60 53 Q68 48 75 53" fill="none" stroke={hairColor} strokeWidth="2" />
            <path d="M85 53 Q92 48 100 53" fill="none" stroke={hairColor} strokeWidth="2" />
          </>}
          {expression === 'sad' && <>
            <path d="M60 54 Q66 57 74 55" fill="none" stroke={hairColor} strokeWidth="2" />
            <path d="M86 55 Q94 57 100 54" fill="none" stroke={hairColor} strokeWidth="2" />
          </>}
          {expression === 'afraid' && <>
            <path d="M60 53 Q66 56 74 54" fill="none" stroke={hairColor} strokeWidth="1.5" />
            <path d="M86 54 Q94 56 100 53" fill="none" stroke={hairColor} strokeWidth="1.5" />
          </>}
          {(expression === 'neutral' || expression === 'bitter' || expression === 'thoughtful') && <>
            <line x1="60" y1="56" x2="74" y2="55" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
            <line x1="86" y1="55" x2="100" y2="56" stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
          </>}
          {(expression === 'happy' || expression === 'determined') && <>
            <path d="M60 56 Q67 53 74 55" fill="none" stroke={hairColor} strokeWidth="2" />
            <path d="M86 55 Q93 53 100 56" fill="none" stroke={hairColor} strokeWidth="2" />
          </>}

          {/* Expression-dependent mouth */}
          {speaking ? (
            /* Speaking mouth — subtle jaw movement animation */
            <g>
              <ellipse cx="80" cy="86" rx="6" ry="2" fill="#8B5A3A" opacity="0.3" stroke={SKIN_SHADOW} strokeWidth="1">
                <animate attributeName="ry" values="2;3.5;1.5;3;2" dur="0.6s" repeatCount="indefinite" />
              </ellipse>
            </g>
          ) : (
            /* Static mouth based on expression */
            <>
              {expression === 'happy' && <path d="M70 84 Q80 92 90 84" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
              {expression === 'angry' && <path d="M70 86 L90 86" stroke={SKIN_SHADOW} strokeWidth="2" />}
              {expression === 'sad' && <path d="M70 88 Q80 82 90 88" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
              {expression === 'surprised' && <ellipse cx="80" cy="87" rx="6" ry="5" fill="#8B5A3A" opacity="0.4" stroke={SKIN_SHADOW} strokeWidth="1" />}
              {expression === 'neutral' && <line x1="72" y1="86" x2="88" y2="86" stroke={SKIN_SHADOW} strokeWidth="1.2" />}
              {expression === 'determined' && <path d="M70 84 L80 86 L90 84" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
              {expression === 'afraid' && <path d="M72 86 Q80 83 88 86" fill="none" stroke={SKIN_SHADOW} strokeWidth="1" opacity="0.8" />}
              {expression === 'bitter' && <path d="M71 85 Q80 83 89 86" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.5" />}
              {expression === 'thoughtful' && <path d="M72 85 L80 86 L88 84" fill="none" stroke={SKIN_SHADOW} strokeWidth="1.2" />}
            </>
          )}

          {/* Mustache — thick, visible */}
          {traits.hasMustache && <>
            <path d="M68 82 Q72 79 80 80 Q88 79 92 82 Q88 84 80 83 Q72 84 68 82 Z" fill={hairColor} opacity="0.55" />
            <path d="M70 81 Q75 79 80 80 Q85 79 90 81" fill="none" stroke={hairColor} strokeWidth="1.8" opacity="0.7" />
          </>}

          {/* Chin stubble / 5 o'clock shadow for rough characters */}
          {traits.stubble && <>
            {[74,77,80,83,86].map((x) => [82,85,88].map((y) => (
              <circle key={`stb_${x}_${y}`} cx={x + (y%2)*0.5} cy={y + (x%3)*0.3} r="0.4" fill={hairColor} opacity="0.15" />
            ))).flat()}
          </>}

          {/* Scar — more visible diagonal across left cheek */}
          {traits.hasScar && <>
            <path d="M58 68 L67 84" fill="none" stroke="rgba(200,150,130,0.45)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M59 69 L68 85" fill="none" stroke="rgba(160,120,100,0.2)" strokeWidth="0.8" strokeLinecap="round" />
          </>}

          {/* Bicorn hat for officers */}
          {isOfficer && <>
            <path d="M45 45 Q50 20 80 15 Q110 20 115 45 L105 40 Q95 28 80 25 Q65 28 55 40 Z"
              fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="0.5" />
            <path d="M55 40 L80 38 L105 40" fill="none" stroke="#D4AF37" strokeWidth="1" />
            {/* Cockade */}
            <circle cx="80" cy="33" r="4" fill="#1E3A5C" stroke="#D4AF37" strokeWidth="0.8" />
            <circle cx="80" cy="33" r="2" fill={UNIFORM_RED} />
          </>}

          {/* Ear details */}
          <ellipse cx={80 - traits.jawWidth} cy="70" rx="4" ry="6" fill={SKIN_SHADOW} opacity="0.4" />
          <ellipse cx={80 + traits.jawWidth} cy="70" rx="4" ry="6" fill={SKIN_SHADOW} opacity="0.4" />

          {/* Collar crossbelt / sash for NCOs */}
          {isNCO && <path d="M50 130 L110 155 L112 150 L52 125 Z" fill={UNIFORM_RED} opacity="0.3" />}

          {/* Speaking indicator glow */}
          {speaking && <rect width="160" height="220" fill="none" stroke={character.color} strokeWidth="0" opacity="0" />}
        </svg>
      </div>
      <span className="vn-portrait-name" style={{ color: character.color }}>{character.name}</span>
      {expression !== character.defaultExpression && (
        <span className="vn-expression-badge" style={{ color: exprColor }}>{expression}</span>
      )}
    </div>
  );
}
