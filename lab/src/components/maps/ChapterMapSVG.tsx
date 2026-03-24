import React, { useMemo } from 'react';
import type { ItalianCampaignChapterId } from '../../../../game/src/components/campaign-map/italianCampaignMapData';
import {
  ITALIAN_CAMPAIGN_PLACES,
  ITALIAN_CAMPAIGN_CHAPTERS,
  ITALIAN_CAMPAIGN_BOUNDS,
  ITALIAN_CAMPAIGN_TERRAIN,
} from '../../../../game/src/components/campaign-map/italianCampaignMapData';
import { CHAPTER_OVERLAYS } from './chapterMapData';

// ============================================================
// PROJECTION
// ============================================================

const SVG_W = 1120;
const SVG_H = 760;
const PAD_X = 60;
const PAD_Y = 48;
const USABLE_W = SVG_W - PAD_X * 2;
const USABLE_H = SVG_H - PAD_Y * 2;

function project(lat: number, lon: number): { x: number; y: number } {
  const x = PAD_X + ((lon - ITALIAN_CAMPAIGN_BOUNDS.west) / (ITALIAN_CAMPAIGN_BOUNDS.east - ITALIAN_CAMPAIGN_BOUNDS.west)) * USABLE_W;
  const y = PAD_Y + ((ITALIAN_CAMPAIGN_BOUNDS.north - lat) / (ITALIAN_CAMPAIGN_BOUNDS.north - ITALIAN_CAMPAIGN_BOUNDS.south)) * USABLE_H;
  return { x, y };
}

function smoothPath(points: ReadonlyArray<{ lat: number; lon: number }>, closed = false): string {
  if (points.length < 2) return '';
  const pts = points.map((p) => project(p.lat, p.lon));
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[Math.min(pts.length - 1, i + 1)];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  if (closed) d += ' Z';
  return d;
}

function polyStr(points: ReadonlyArray<{ lat: number; lon: number }>): string {
  return points.map((p) => { const { x, y } = project(p.lat, p.lon); return `${x},${y}`; }).join(' ');
}

// ============================================================
// TERRITORY COLORS — muted earth tones for parchment aesthetic
// ============================================================

const T_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  'french':           { fill: 'rgba(62, 78, 118, 0.42)', stroke: 'rgba(62, 78, 118, 0.55)', label: 'French Republic' },
  'french-occupied':  { fill: 'rgba(72, 88, 128, 0.25)', stroke: 'rgba(72, 88, 128, 0.38)', label: 'French-Occupied' },
  'austrian':         { fill: 'rgba(195, 185, 170, 0.32)', stroke: 'rgba(160, 145, 125, 0.45)', label: 'Austrian Monarchy' },
  'austrian-lombardy':{ fill: 'rgba(195, 185, 170, 0.25)', stroke: 'rgba(160, 145, 125, 0.38)', label: 'Austrian Lombardy' },
  'piedmont':         { fill: 'rgba(165, 138, 62, 0.30)', stroke: 'rgba(145, 118, 52, 0.42)', label: 'Kingdom of Sardinia' },
  'piedmont-neutral': { fill: 'rgba(135, 125, 95, 0.18)', stroke: 'rgba(125, 115, 85, 0.30)', label: 'Sardinia (Neutral)' },
  'venice':           { fill: 'rgba(95, 125, 118, 0.25)', stroke: 'rgba(85, 115, 108, 0.38)', label: 'Republic of Venice' },
  'genoa':            { fill: 'rgba(130, 112, 88, 0.22)', stroke: 'rgba(120, 102, 78, 0.35)', label: 'Republic of Genoa' },
  'papal':            { fill: 'rgba(168, 142, 108, 0.20)', stroke: 'rgba(148, 122, 88, 0.33)', label: 'Papal States' },
  'cisalpine':        { fill: 'rgba(62, 108, 78, 0.25)', stroke: 'rgba(52, 98, 68, 0.38)', label: 'Cisalpine Republic' },
  'cispadane':        { fill: 'rgba(78, 118, 72, 0.20)', stroke: 'rgba(68, 108, 62, 0.33)', label: 'Cispadane Rep.' },
  'swiss':            { fill: 'rgba(148, 140, 128, 0.18)', stroke: 'rgba(138, 130, 118, 0.30)', label: 'Swiss Confederation' },
  'tyrol':            { fill: 'rgba(180, 172, 158, 0.20)', stroke: 'rgba(150, 142, 128, 0.33)', label: 'Tyrol' },
};

const ARMY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  french:      { bg: '#3A4E78', border: '#2A3E68', text: '#8898C8' },
  austrian:    { bg: '#D8D0C0', border: '#A89878', text: '#8B8070' },
  piedmontese: { bg: '#B8A040', border: '#988030', text: '#D0B860' },
};

// ============================================================
// COMPONENT
// ============================================================

interface Props {
  chapterId: ItalianCampaignChapterId;
}

export function ChapterMapSVG({ chapterId }: Props) {
  const chapter = useMemo(
    () => ITALIAN_CAMPAIGN_CHAPTERS.find((c) => c.id === chapterId) ?? ITALIAN_CAMPAIGN_CHAPTERS[0],
    [chapterId],
  );
  const overlay = CHAPTER_OVERLAYS[chapterId];

  const routePath = useMemo(() => {
    const rp = chapter.route
      .map((id) => ITALIAN_CAMPAIGN_PLACES.find((p) => p.id === id))
      .filter(Boolean) as typeof ITALIAN_CAMPAIGN_PLACES;
    if (rp.length < 2) return '';
    const pts = rp.map((p) => project(p.lat, p.lon));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [chapter]);

  const visiblePlaces = useMemo(() => {
    return ITALIAN_CAMPAIGN_PLACES.filter(
      (p) => p.chapterIds.includes(chapterId) || p.context || p.alwaysLabel,
    );
  }, [chapterId]);

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} xmlns="http://www.w3.org/2000/svg" className="chapter-map-svg">
      <defs>
        {/* Parchment background */}
        <radialGradient id={`bg-${chapterId}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#2a2218" />
          <stop offset="60%" stopColor="#1e1912" />
          <stop offset="100%" stopColor="#13100c" />
        </radialGradient>
        {/* Land texture */}
        <radialGradient id={`land-${chapterId}`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="rgba(60, 50, 35, 0.35)" />
          <stop offset="100%" stopColor="rgba(40, 32, 22, 0.15)" />
        </radialGradient>
        {/* Sea */}
        <linearGradient id={`sea-${chapterId}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#172e3d" />
          <stop offset="100%" stopColor="#0c1a25" />
        </linearGradient>
        {/* Route glow */}
        <filter id={`rglow-${chapterId}`}>
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Text shadow */}
        <filter id={`tshadow-${chapterId}`}>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.7" />
        </filter>
        {/* Mountain texture pattern */}
        <pattern id={`mtn-${chapterId}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="8" x2="4" y2="0" stroke="rgba(140,120,90,0.08)" strokeWidth="0.5" />
          <line x1="4" y1="8" x2="8" y2="0" stroke="rgba(140,120,90,0.06)" strokeWidth="0.5" />
        </pattern>
        {/* Frame gradient */}
        <linearGradient id={`frame-${chapterId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(196, 160, 82, 0.35)" />
          <stop offset="50%" stopColor="rgba(140, 110, 60, 0.2)" />
          <stop offset="100%" stopColor="rgba(196, 160, 82, 0.35)" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <rect width={SVG_W} height={SVG_H} fill={`url(#bg-${chapterId})`} />

      {/* Decorative frame */}
      <rect x="6" y="6" width={SVG_W - 12} height={SVG_H - 12} fill="none" stroke={`url(#frame-${chapterId})`} strokeWidth="1.5" rx="4" />
      <rect x="10" y="10" width={SVG_W - 20} height={SVG_H - 20} fill="none" stroke="rgba(140, 110, 60, 0.12)" strokeWidth="0.5" rx="2" />

      {/* Land base (subtle warm fill for non-sea areas) */}
      <rect x={PAD_X} y={PAD_Y} width={USABLE_W} height={USABLE_H} fill={`url(#land-${chapterId})`} />

      {/* Seas */}
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.ligurianSea)} fill={`url(#sea-${chapterId})`} opacity="0.9" />
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.upperAdriatic)} fill={`url(#sea-${chapterId})`} opacity="0.9" />

      {/* Sea labels */}
      {(() => {
        const lig = project(43.6, 7.6);
        const adr = project(44.2, 14.8);
        return (
          <>
            <text x={lig.x} y={lig.y} fill="rgba(120, 170, 195, 0.30)" fontSize="15" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" letterSpacing="8">Ligurian Sea</text>
            <text x={adr.x} y={adr.y} fill="rgba(120, 170, 195, 0.30)" fontSize="15" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" letterSpacing="8" transform={`rotate(-30, ${adr.x}, ${adr.y})`}>Adriatic Sea</text>
          </>
        );
      })()}

      {/* Mountains — Alps (subtle hatched ridge) */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(140, 120, 90, 0.12)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(120, 100, 75, 0.10)" strokeWidth="18" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(100, 85, 65, 0.15)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 6" />

      {/* Mountains — Apennines */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(120, 100, 75, 0.10)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(100, 85, 65, 0.08)" strokeWidth="12" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(90, 75, 58, 0.12)" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 5" />

      {/* Mountain labels */}
      {(() => {
        const alps = project(47.2, 9.0);
        const apen = project(44.7, 9.5);
        return (
          <>
            <text x={alps.x} y={alps.y} fill="rgba(160, 140, 110, 0.20)" fontSize="10" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" letterSpacing="6">A L P S</text>
            <text x={apen.x} y={apen.y} fill="rgba(140, 120, 95, 0.15)" fontSize="8" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" letterSpacing="4" transform={`rotate(-20, ${apen.x}, ${apen.y})`}>Apennines</text>
          </>
        );
      })()}

      {/* Lake Garda */}
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.lakeGarda)} fill="rgba(70, 100, 110, 0.45)" stroke="rgba(60, 85, 95, 0.3)" strokeWidth="0.5" />
      {(() => { const g = project(45.55, 10.68); return <text x={g.x} y={g.y} fill="rgba(100, 150, 170, 0.25)" fontSize="6" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle">L. Garda</text>; })()}

      {/* Rivers */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.poRiver)} fill="none" stroke="rgba(60, 85, 95, 0.40)" strokeWidth="2.2" strokeLinecap="round" />
      {(() => { const po = project(45.02, 8.8); return <text x={po.x} y={po.y - 6} fill="rgba(90, 130, 145, 0.25)" fontSize="7" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle">Po</text>; })()}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.adigeRiver)} fill="none" stroke="rgba(60, 85, 95, 0.35)" strokeWidth="1.8" strokeLinecap="round" />
      {(() => { const ad = project(45.65, 10.9); return <text x={ad.x} y={ad.y + 10} fill="rgba(90, 130, 145, 0.20)" fontSize="6" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" transform={`rotate(-60, ${ad.x}, ${ad.y + 10})`}>Adige</text>; })()}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.brentaRiver)} fill="none" stroke="rgba(60, 85, 95, 0.28)" strokeWidth="1.2" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.tagliamentoRiver)} fill="none" stroke="rgba(60, 85, 95, 0.28)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Arcole marsh */}
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.arcoleMarsh)} fill="rgba(70, 100, 88, 0.12)" stroke="rgba(70, 100, 88, 0.08)" strokeWidth="0.5" strokeDasharray="2 3" />

      {/* Territory overlays */}
      {overlay?.territories.map((t, i) => {
        const colors = T_COLORS[t.colorKey] ?? T_COLORS.french;
        return (
          <g key={`t-${i}`}>
            {t.bounds.map((bound, bi) => (
              <path
                key={`tb-${bi}`}
                d={smoothPath(bound, true)}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            ))}
            {t.labelPos && (
              <text
                x={project(t.labelPos.lat, t.labelPos.lon).x}
                y={project(t.labelPos.lat, t.labelPos.lon).y}
                fill="rgba(210, 200, 180, 0.25)"
                fontSize="10"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontVariant="small-caps"
                textAnchor="middle"
                letterSpacing="2.5"
              >
                {t.label || colors.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Route */}
      {routePath && (
        <>
          <path d={routePath} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={routePath} fill="none" stroke="#CD824D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter={`url(#rglow-${chapterId})`} strokeDasharray={chapter.routeStyle === 'diplomacy' ? '8 4' : 'none'} />
          {(() => {
            const last = ITALIAN_CAMPAIGN_PLACES.find((p) => p.id === chapter.route[chapter.route.length - 1]);
            if (!last) return null;
            const { x, y } = project(last.lat, last.lon);
            return (
              <>
                <circle cx={x} cy={y} r="6" fill="none" stroke="#CD824D" strokeWidth="1.5" opacity="0.6" />
                <circle cx={x} cy={y} r="3" fill="#CD824D" opacity="0.8" />
              </>
            );
          })()}
        </>
      )}

      {/* Army markers */}
      {overlay?.armies.map((army, i) => {
        const { x, y } = project(army.lat, army.lon);
        const c = ARMY_COLORS[army.faction] ?? ARMY_COLORS.french;
        const sz = army.size === 'large' ? 11 : 8;
        const lx = army.labelSide === 'left' ? -(sz + 5) : (sz + 5);
        const anch = army.labelSide === 'left' ? 'end' as const : 'start' as const;
        return (
          <g key={`a-${i}`} filter={`url(#tshadow-${chapterId})`}>
            {/* Unit marker — rectangular standard */}
            <rect x={x - sz} y={y - sz * 0.7} width={sz * 2} height={sz * 1.4} rx="1.5" fill={c.bg} stroke={c.border} strokeWidth="1.2" opacity="0.9" />
            {/* NATO-style X for infantry */}
            <line x1={x - sz + 3} y1={y - sz * 0.7 + 2} x2={x + sz - 3} y2={y + sz * 0.7 - 2} stroke={army.faction === 'austrian' ? 'rgba(80,70,55,0.4)' : 'rgba(255,255,255,0.3)'} strokeWidth="0.8" />
            <line x1={x + sz - 3} y1={y - sz * 0.7 + 2} x2={x - sz + 3} y2={y + sz * 0.7 - 2} stroke={army.faction === 'austrian' ? 'rgba(80,70,55,0.4)' : 'rgba(255,255,255,0.3)'} strokeWidth="0.8" />
            {/* Label */}
            <text x={x + lx} y={y + 3} fill={c.text} fontSize={army.size === 'large' ? '9' : '8'} fontFamily="'Courier New', monospace" textAnchor={anch} fontWeight="bold">{army.label}</text>
            {army.commander && (
              <text x={x + lx} y={y + 14} fill="rgba(190, 180, 160, 0.45)" fontSize="7" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor={anch}>{army.commander}</text>
            )}
          </g>
        );
      })}

      {/* Place markers */}
      {visiblePlaces.map((place) => {
        const { x, y } = project(place.lat, place.lon);
        const active = place.chapterIds.includes(chapterId);
        const op = active ? 1 : 0.3;
        const lc = active ? '#EFE3BD' : 'rgba(190, 180, 160, 0.40)';
        const off = place.labelOffset ?? { x: 0, y: -12 };
        const anch = place.labelAnchor ?? 'middle';
        return (
          <g key={place.id} opacity={op}>
            {place.kind === 'battle' ? (
              <path d={`M ${x} ${y - 5.5} L ${x + 5.5} ${y} L ${x} ${y + 5.5} L ${x - 5.5} ${y} Z`} fill="#B85D3F" stroke="rgba(0,0,0,0.5)" strokeWidth="0.7" />
            ) : place.kind === 'siege' ? (
              <rect x={x - 4.5} y={y - 4.5} width="9" height="9" rx="1.5" fill="#9098A8" stroke="rgba(0,0,0,0.4)" strokeWidth="0.7" />
            ) : place.kind === 'treaty' ? (
              <>
                <circle cx={x} cy={y} r="5" fill="none" stroke="#7AB5D0" strokeWidth="1.2" />
                <circle cx={x} cy={y} r="2" fill="#7AB5D0" />
              </>
            ) : (
              <circle cx={x} cy={y} r="3.5" fill="#C4A870" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
            )}
            {(place.alwaysLabel || active) && (
              <text x={x + off.x} y={y + off.y} fill={lc} fontSize={active ? '10.5' : '8.5'} fontFamily="'Courier New', monospace" textAnchor={anch} fontWeight={active ? 'bold' : 'normal'} filter={active ? `url(#tshadow-${chapterId})` : undefined}>
                {place.shortLabel ?? place.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Title card — top left */}
      <rect x="16" y="16" width="220" height="72" rx="3" fill="rgba(10, 8, 6, 0.6)" stroke="rgba(140, 110, 60, 0.2)" strokeWidth="0.5" />
      <text x="28" y="36" fill="#C49A3A" fontSize="10" fontFamily="'Courier New', monospace" fontWeight="bold" letterSpacing="3">CHAPTER {chapter.number}</text>
      <text x="28" y="56" fill="#EFE3BD" fontSize="17" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="bold">{chapter.title}</text>
      <text x="28" y="72" fill="rgba(190, 180, 160, 0.55)" fontSize="10" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic">{chapter.dateRange} — {chapter.theater}</text>

      {/* Legend — bottom right */}
      {(() => {
        const hasPiedmont = overlay?.armies.some((a) => a.faction === 'piedmontese');
        const legendH = hasPiedmont ? 92 : 78;
        const fs = "rgba(190, 180, 160, 0.45)";
        const ff = "'Courier New', monospace";
        let row = 0;
        const r = (dy: number) => { row++; return dy; };
        return (
          <>
            <rect x={SVG_W - 155} y={SVG_H - legendH - 14} width="140" height={legendH} rx="3" fill="rgba(10, 8, 6, 0.5)" stroke="rgba(140, 110, 60, 0.15)" strokeWidth="0.5" />
            <g transform={`translate(${SVG_W - 145}, ${SVG_H - legendH - 2})`}>
              <text x="0" y="0" fill="rgba(190, 180, 160, 0.4)" fontSize="7" fontFamily={ff} letterSpacing="1.5">LEGEND</text>
              <path d="M 4 13 L 8 9 L 12 13 L 8 17 Z" fill="#B85D3F" stroke="rgba(0,0,0,0.4)" strokeWidth="0.5" />
              <text x="20" y="16" fill={fs} fontSize="7.5" fontFamily={ff}>Battle</text>
              <circle cx="8" cy="28" r="3" fill="#C4A870" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
              <text x="20" y="31" fill={fs} fontSize="7.5" fontFamily={ff}>City</text>
              <rect x="3" y="39" width="10" height="8" rx="1" fill="#3A4E78" stroke="#2A3E68" strokeWidth="0.6" />
              <text x="20" y="46" fill={fs} fontSize="7.5" fontFamily={ff}>French Army</text>
              <rect x="3" y="53" width="10" height="8" rx="1" fill="#D8D0C0" stroke="#A89878" strokeWidth="0.6" />
              <text x="20" y="60" fill={fs} fontSize="7.5" fontFamily={ff}>Austrian Army</text>
              {hasPiedmont && (
                <>
                  <rect x="3" y="67" width="10" height="8" rx="1" fill="#B8A040" stroke="#988030" strokeWidth="0.6" />
                  <text x="20" y="74" fill={fs} fontSize="7.5" fontFamily={ff}>Piedmontese</text>
                </>
              )}
            </g>
          </>
        );
      })()}
    </svg>
  );
}
