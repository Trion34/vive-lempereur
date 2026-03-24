import React, { useMemo } from 'react';
import type { ItalianCampaignChapterId } from '../../../../game/src/components/campaign-map/italianCampaignMapData';
import type { CampaignMapRouteStyle } from '../../../../game/src/components/campaign-map/italianCampaignMapData';
import {
  ITALIAN_CAMPAIGN_PLACES,
  ITALIAN_CAMPAIGN_CHAPTERS,
  ITALIAN_CAMPAIGN_BOUNDS,
  ITALIAN_CAMPAIGN_TERRAIN,
} from '../../../../game/src/components/campaign-map/italianCampaignMapData';
import { CHAPTER_OVERLAYS } from './chapterMapData';
import type { ViewportFocus } from './chapterMapData';

// ============================================================
// PROJECTION
// ============================================================

const SVG_W = 1120;
const SVG_H = 760;
const PAD_X = 60;
const PAD_Y = 48;
const USABLE_W = SVG_W - PAD_X * 2;
const USABLE_H = SVG_H - PAD_Y * 2;

/** Geographic bounds used for projection (west/east/south/north). */
interface ProjectionBounds {
  west: number;
  east: number;
  south: number;
  north: number;
}

function boundsFromFocus(focus: ViewportFocus): ProjectionBounds {
  return { west: focus.lonMin, east: focus.lonMax, south: focus.latMin, north: focus.latMax };
}

const GLOBAL_BOUNDS: ProjectionBounds = {
  west: ITALIAN_CAMPAIGN_BOUNDS.west,
  east: ITALIAN_CAMPAIGN_BOUNDS.east,
  south: ITALIAN_CAMPAIGN_BOUNDS.south,
  north: ITALIAN_CAMPAIGN_BOUNDS.north,
};

function createProjection(bounds: ProjectionBounds) {
  const project = (lat: number, lon: number): { x: number; y: number } => {
    const x = PAD_X + ((lon - bounds.west) / (bounds.east - bounds.west)) * USABLE_W;
    const y = PAD_Y + ((bounds.north - lat) / (bounds.north - bounds.south)) * USABLE_H;
    return { x, y };
  };

  const smoothPath = (points: ReadonlyArray<{ lat: number; lon: number }>, closed = false): string => {
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
  };

  const polyStr = (points: ReadonlyArray<{ lat: number; lon: number }>): string => {
    return points.map((p) => { const { x, y } = project(p.lat, p.lon); return `${x},${y}`; }).join(' ');
  };

  return { project, smoothPath, polyStr };
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
// SIEGE RING VARIANTS
// ============================================================

type SiegeVariant = 'fresh' | 'lifted' | 'restored' | 'complete';

function getSiegeVariant(chapterId: ItalianCampaignChapterId): SiegeVariant {
  switch (chapterId) {
    case 'ch5': return 'fresh';
    case 'ch6': return 'lifted';
    case 'ch7': return 'restored';
    case 'ch8': return 'restored';
    case 'ch12': return 'complete';
    default: return 'fresh';
  }
}

const SIEGE_STYLE: Record<SiegeVariant, {
  innerStroke: string;
  innerDash: string;
  outerStroke: string;
  outerDash: string;
  innerOpacity: number;
  outerOpacity: number;
  batteryFill: string;
  statusLabel: string;
}> = {
  fresh: {
    innerStroke: 'rgba(140, 120, 85, 0.65)',
    innerDash: '3 2',
    outerStroke: 'rgba(58, 78, 120, 0.60)',
    outerDash: '5 3 2 3',
    innerOpacity: 0.8,
    outerOpacity: 0.7,
    batteryFill: 'rgba(58, 78, 120, 0.55)',
    statusLabel: 'Siege Begun',
  },
  lifted: {
    innerStroke: 'rgba(160, 80, 60, 0.50)',
    innerDash: '3 4 1 4',
    outerStroke: 'rgba(160, 80, 60, 0.40)',
    outerDash: '4 6 2 6',
    innerOpacity: 0.5,
    outerOpacity: 0.35,
    batteryFill: 'rgba(160, 80, 60, 0.35)',
    statusLabel: 'Siege Lifted',
  },
  restored: {
    innerStroke: 'rgba(140, 120, 85, 0.60)',
    innerDash: '3 2',
    outerStroke: 'rgba(58, 78, 120, 0.55)',
    outerDash: '5 3 2 3',
    innerOpacity: 0.75,
    outerOpacity: 0.65,
    batteryFill: 'rgba(58, 78, 120, 0.50)',
    statusLabel: 'Siege Restored',
  },
  complete: {
    innerStroke: 'rgba(140, 120, 85, 0.45)',
    innerDash: '2 5 1 5',
    outerStroke: 'rgba(58, 78, 120, 0.50)',
    outerDash: '5 3 2 3',
    innerOpacity: 0.6,
    outerOpacity: 0.6,
    batteryFill: 'rgba(58, 78, 120, 0.45)',
    statusLabel: 'Surrender',
  },
};

function SiegeRings({ x, y, chapterId }: { x: number; y: number; chapterId: ItalianCampaignChapterId }) {
  const variant = getSiegeVariant(chapterId);
  const s = SIEGE_STYLE[variant];
  const innerR = 12;
  const outerR = 20;

  // Battery positions at cardinal points on the outer ring
  const batteries = [
    { cx: x, cy: y - outerR },       // N
    { cx: x + outerR, cy: y },       // E
    { cx: x, cy: y + outerR },       // S
    { cx: x - outerR, cy: y },       // W
  ];

  return (
    <g className="siege-rings">
      {/* Subtle glow behind rings */}
      <circle cx={x} cy={y} r={outerR + 3} fill="none" stroke={s.outerStroke} strokeWidth="6" opacity={s.outerOpacity * 0.15} />

      {/* Inner ring — fortress walls */}
      <circle
        cx={x} cy={y} r={innerR}
        fill="none"
        stroke={s.innerStroke}
        strokeWidth="1.2"
        strokeDasharray={s.innerDash}
        opacity={s.innerOpacity}
      />

      {/* Outer ring — siege lines */}
      <circle
        cx={x} cy={y} r={outerR}
        fill="none"
        stroke={s.outerStroke}
        strokeWidth="1.0"
        strokeDasharray={s.outerDash}
        opacity={s.outerOpacity}
      />

      {/* Battery positions — small marks on outer ring */}
      {variant !== 'lifted' && batteries.map((b, i) => (
        <g key={`bat-${i}`} opacity={s.outerOpacity}>
          {/* X mark for battery */}
          <line x1={b.cx - 2} y1={b.cy - 2} x2={b.cx + 2} y2={b.cy + 2} stroke={s.batteryFill} strokeWidth="0.9" />
          <line x1={b.cx + 2} y1={b.cy - 2} x2={b.cx - 2} y2={b.cy + 2} stroke={s.batteryFill} strokeWidth="0.9" />
        </g>
      ))}
      {/* Lifted variant: scattered dots instead (batteries withdrawn) */}
      {variant === 'lifted' && batteries.map((b, i) => (
        <circle key={`bat-${i}`} cx={b.cx} cy={b.cy} r="1" fill={s.batteryFill} opacity={s.outerOpacity * 0.6} />
      ))}

      {/* Surrender marker for ch12 — white flag on top */}
      {variant === 'complete' && (
        <g opacity="0.7">
          {/* Flagpole */}
          <line x1={x} y1={y - innerR - 2} x2={x} y2={y - innerR - 12} stroke="rgba(180, 170, 150, 0.6)" strokeWidth="0.8" />
          {/* White flag */}
          <path
            d={`M ${x} ${y - innerR - 12} L ${x + 6} ${y - innerR - 10} L ${x} ${y - innerR - 8}`}
            fill="rgba(220, 215, 200, 0.55)"
            stroke="rgba(180, 170, 150, 0.4)"
            strokeWidth="0.4"
          />
        </g>
      )}

      {/* Status label */}
      <text
        x={x}
        y={y + outerR + 11}
        fill={variant === 'lifted' ? 'rgba(180, 100, 80, 0.50)' : 'rgba(180, 175, 160, 0.40)'}
        fontSize="6"
        fontFamily="'Courier New', monospace"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        {s.statusLabel}
      </text>
    </g>
  );
}

// ============================================================
// COMPASS ROSE — 8-point star with fleur-de-lis north pointer
// ============================================================

function CompassRose({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const cardinal = r;
  const ordinal = r * 0.45;
  const inner = r * 0.12;

  // Cardinal tips
  const N = { x: cx, y: cy - cardinal };
  const E = { x: cx + cardinal, y: cy };
  const S = { x: cx, y: cy + cardinal };
  const W = { x: cx - cardinal, y: cy };

  // Ordinal tips
  const d45 = ordinal * Math.SQRT1_2;
  const NE = { x: cx + d45, y: cy - d45 };
  const SE = { x: cx + d45, y: cy + d45 };
  const SW = { x: cx - d45, y: cy + d45 };
  const NW = { x: cx - d45, y: cy - d45 };

  // Inner diamond vertices
  const iN = { x: cx, y: cy - inner };
  const iE = { x: cx + inner, y: cy };
  const iS = { x: cx, y: cy + inner };
  const iW = { x: cx - inner, y: cy };

  const spike = (tip: { x: number; y: number }, left: { x: number; y: number }, right: { x: number; y: number }) =>
    `M ${tip.x} ${tip.y} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`;

  const cardinalFill = 'rgba(160, 130, 70, 0.55)';
  const ordinalFill = 'rgba(140, 115, 65, 0.30)';
  const outline = 'rgba(100, 80, 45, 0.35)';
  const labelFill = 'rgba(200, 175, 120, 0.55)';
  const nFill = 'rgba(200, 160, 70, 0.70)';
  const ff = "'Cormorant Garamond', Georgia, serif";

  // Fleur-de-lis stylised north pointer
  const fleurN = [
    `M ${cx} ${cy - cardinal}`,
    `L ${cx - 3.5} ${cy - cardinal * 0.45}`,
    `Q ${cx - 1.5} ${cy - cardinal * 0.5} ${cx} ${cy - cardinal * 0.35}`,
    `Q ${cx + 1.5} ${cy - cardinal * 0.5} ${cx + 3.5} ${cy - cardinal * 0.45}`,
    'Z',
  ].join(' ');

  return (
    <g className="compass-rose">
      {/* Outer rings */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={outline} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke={outline} strokeWidth="0.3" />

      {/* Cardinal spikes */}
      <path d={spike(E, iN, iS)} fill={cardinalFill} stroke={outline} strokeWidth="0.3" />
      <path d={spike(S, iE, iW)} fill={cardinalFill} stroke={outline} strokeWidth="0.3" />
      <path d={spike(W, iS, iN)} fill={cardinalFill} stroke={outline} strokeWidth="0.3" />
      <path d={spike(N, iW, iE)} fill={cardinalFill} stroke={outline} strokeWidth="0.3" />

      {/* Fleur-de-lis accent on north spike */}
      <path d={fleurN} fill={nFill} stroke={outline} strokeWidth="0.4" />

      {/* Ordinal spikes */}
      <path d={spike(NE, { x: cx + 1.5, y: cy - 1.5 }, { x: cx, y: cy })} fill={ordinalFill} stroke={outline} strokeWidth="0.2" />
      <path d={spike(SE, { x: cx + 1.5, y: cy + 1.5 }, { x: cx, y: cy })} fill={ordinalFill} stroke={outline} strokeWidth="0.2" />
      <path d={spike(SW, { x: cx - 1.5, y: cy + 1.5 }, { x: cx, y: cy })} fill={ordinalFill} stroke={outline} strokeWidth="0.2" />
      <path d={spike(NW, { x: cx - 1.5, y: cy - 1.5 }, { x: cx, y: cy })} fill={ordinalFill} stroke={outline} strokeWidth="0.2" />

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r={2} fill="rgba(140, 115, 65, 0.5)" stroke={outline} strokeWidth="0.4" />

      {/* Cardinal labels */}
      <text x={cx} y={cy - cardinal - 5} fill={nFill} fontSize="9" fontFamily={ff} fontWeight="bold" textAnchor="middle" dominantBaseline="auto">N</text>
      <text x={cx} y={cy + cardinal + 11} fill={labelFill} fontSize="6.5" fontFamily={ff} textAnchor="middle" dominantBaseline="auto">S</text>
      <text x={cx + cardinal + 7} y={cy + 2.5} fill={labelFill} fontSize="6.5" fontFamily={ff} textAnchor="middle" dominantBaseline="auto">E</text>
      <text x={cx - cardinal - 7} y={cy + 2.5} fill={labelFill} fontSize="6.5" fontFamily={ff} textAnchor="middle" dominantBaseline="auto">W</text>
    </g>
  );
}

// ============================================================
// SCALE BAR — adapts to projection viewport
// ============================================================

const KM_PER_DEGREE_LAT = 111;
const KM_PER_LEAGUE = 4.4; // French lieue commune

/** Pick the largest round km value that fits inside the bar. */
function pickScaleKm(kmPerPx: number, maxBarPx: number): number {
  const maxKm = kmPerPx * maxBarPx;
  const candidates = [10, 20, 25, 50, 75, 100, 150, 200, 250, 500];
  for (let i = candidates.length - 1; i >= 0; i--) {
    if (candidates[i] <= maxKm * 0.9) return candidates[i];
  }
  return candidates[0];
}

function ScaleBar({ x, y, bounds }: { x: number; y: number; bounds: ProjectionBounds }) {
  const latSpanKm = (bounds.north - bounds.south) * KM_PER_DEGREE_LAT;
  const kmPerPx = latSpanKm / USABLE_H;

  const maxBarPx = 140;
  const distKm = pickScaleKm(kmPerPx, maxBarPx);
  const barPx = distKm / kmPerPx;
  const leagues = distKm / KM_PER_LEAGUE;

  // Round leagues to nearest 0.5
  const leagueRounded = Math.round(leagues * 2) / 2;
  const leagueStr = leagueRounded % 1 === 0 ? String(leagueRounded) : leagueRounded.toFixed(1);

  const barColor = 'rgba(160, 130, 70, 0.50)';
  const textColor = 'rgba(190, 170, 130, 0.55)';
  const bgColor = 'rgba(10, 8, 6, 0.45)';
  const ff = "'Cormorant Garamond', Georgia, serif";
  const tickH = 5;
  const midPx = barPx / 2;

  return (
    <g className="scale-bar">
      {/* Background panel */}
      <rect x={x - 6} y={y - 18} width={barPx + 30} height={42} rx="2" fill={bgColor} stroke="rgba(140, 110, 60, 0.12)" strokeWidth="0.4" />

      {/* Title */}
      <text x={x} y={y - 6} fill="rgba(160, 140, 110, 0.35)" fontSize="6" fontFamily="'Courier New', monospace" letterSpacing="1.5">SCALE</text>

      {/* Bar — first half filled, second half outline */}
      <rect x={x} y={y} width={midPx} height={3} fill={barColor} />
      <rect x={x + midPx} y={y} width={barPx - midPx} height={3} fill="none" stroke={barColor} strokeWidth="0.5" />

      {/* Tick marks */}
      <line x1={x} y1={y - tickH} x2={x} y2={y + 3} stroke={barColor} strokeWidth="0.7" />
      <line x1={x + midPx} y1={y - 2} x2={x + midPx} y2={y + 3} stroke={barColor} strokeWidth="0.5" />
      <line x1={x + barPx} y1={y - tickH} x2={x + barPx} y2={y + 3} stroke={barColor} strokeWidth="0.7" />

      {/* Kilometre labels */}
      <text x={x} y={y + 13} fill={textColor} fontSize="6.5" fontFamily={ff} textAnchor="start">0</text>
      <text x={x + barPx} y={y + 13} fill={textColor} fontSize="6.5" fontFamily={ff} textAnchor="end">{distKm} km</text>

      {/* League label */}
      <text x={x + barPx} y={y + 21} fill="rgba(170, 150, 110, 0.40)" fontSize="5.5" fontFamily={ff} fontStyle="italic" textAnchor="end">{leagueStr} lieues</text>
    </g>
  );
}

// ============================================================
// MOUNTAIN HACHURES — short perpendicular lines radiating from ridge
// ============================================================

interface HachureLine {
  x1: number; y1: number; x2: number; y2: number;
}

/**
 * Generates hachure lines perpendicular to a mountain ridge spine.
 * Works in geographic coordinates (lat/lon). The caller projects to SVG.
 *
 * @param spine     Array of [lat, lon] control points along the ridge
 * @param density   Approximate spacing in degrees between hachure clusters
 * @param maxLength Maximum hachure length in degrees
 * @param seed      Seed-like offset for deterministic pseudo-random variation
 */
function generateHachures(
  spine: [number, number][],
  density: number,
  maxLength: number,
  seed = 0,
): HachureLine[] {
  const lines: HachureLine[] = [];
  if (spine.length < 2) return lines;

  // Simple deterministic pseudo-random from index
  const rand = (i: number) => {
    const x = Math.sin((i + seed) * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x); // 0..1
  };

  for (let seg = 0; seg < spine.length - 1; seg++) {
    const [lat0, lon0] = spine[seg];
    const [lat1, lon1] = spine[seg + 1];
    const dLat = lat1 - lat0;
    const dLon = lon1 - lon0;
    const segLen = Math.sqrt(dLat * dLat + dLon * dLon);
    if (segLen < 1e-6) continue;

    // Perpendicular direction (rotate 90 degrees)
    const perpLat = -dLon / segLen;
    const perpLon = dLat / segLen;

    // Number of hachure positions along this segment
    const count = Math.max(1, Math.round(segLen / density));

    for (let k = 0; k <= count; k++) {
      const t = count === 0 ? 0.5 : k / count;
      const baseLat = lat0 + dLat * t;
      const baseLon = lon0 + dLon * t;
      const idx = seg * 100 + k;

      // 2-4 hachures on each side
      const nLines = 2 + Math.floor(rand(idx * 3) * 3); // 2, 3, or 4
      for (let h = 0; h < nLines; h++) {
        const lengthFactor = 0.6 + rand(idx * 7 + h * 13) * 0.4; // 0.6-1.0
        const len = maxLength * lengthFactor;
        // Slight lateral offset so hachures fan out
        const spreadT = (h + 0.5) / nLines;          // 0..1
        const lateralShift = (spreadT - 0.5) * density * 0.6;
        const originLat = baseLat + dLat / segLen * lateralShift;
        const originLon = baseLon + dLon / segLen * lateralShift;

        // Line on positive side
        lines.push({
          x1: originLon,
          y1: originLat,
          x2: originLon + perpLon * len,
          y2: originLat + perpLat * len,
        });
        // Line on negative side
        lines.push({
          x1: originLon,
          y1: originLat,
          x2: originLon - perpLon * len,
          y2: originLat - perpLat * len,
        });
      }
    }
  }
  return lines;
}

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

  // Build projection from chapter viewport focus (or fall back to global bounds)
  const projBounds = useMemo(
    () => overlay?.viewportFocus ? boundsFromFocus(overlay.viewportFocus) : GLOBAL_BOUNDS,
    [overlay],
  );
  const { project, smoothPath, polyStr } = useMemo(
    () => createProjection(projBounds),
    [projBounds],
  );

  const routeData = useMemo(() => {
    const rp = chapter.route
      .map((id) => ITALIAN_CAMPAIGN_PLACES.find((p) => p.id === id))
      .filter(Boolean) as typeof ITALIAN_CAMPAIGN_PLACES;
    if (rp.length < 2) return null;
    const pts = rp.map((p) => project(p.lat, p.lon));
    const fullPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    // Build individual segments for intermediate arrowheads
    const segments: string[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      segments.push(`M ${pts[i].x} ${pts[i].y} L ${pts[i + 1].x} ${pts[i + 1].y}`);
    }
    return { fullPath, segments, pointCount: pts.length };
  }, [chapter, project]);

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
        {/* Vignette */}
        <radialGradient id={`vignette-${chapterId}`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="70%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
        </radialGradient>
        {/* Parchment noise texture */}
        <filter id={`noise-${chapterId}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend" />
          <feComponentTransfer in="blend">
            <feFuncA type="linear" slope="0.08" />
          </feComponentTransfer>
        </filter>
        {/* Coastline glow */}
        <filter id={`coast-${chapterId}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        {/* Route arrowheads — advance (default) */}
        <marker id={`arrow-advance-${chapterId}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 0.5 L 7 3 L 0 5.5 L 1.5 3 Z" fill="#CD824D" opacity="0.85" />
        </marker>
        {/* Route arrowheads — pursuit (larger, aggressive) */}
        <marker id={`arrow-pursuit-${chapterId}`} markerWidth="11" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 0.5 L 10 4 L 0 7.5 L 2 4 Z" fill="#CD824D" opacity="0.9" />
        </marker>
        {/* Route arrowheads — counterstroke (same as advance) */}
        <marker id={`arrow-counterstroke-${chapterId}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 0.5 L 7 3 L 0 5.5 L 1.5 3 Z" fill="#CD824D" opacity="0.85" />
        </marker>
        {/* Route arrowheads — diplomacy (smaller, softer) */}
        <marker id={`arrow-diplomacy-${chapterId}`} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 0.5 L 5 2.5 L 0 4.5 L 1 2.5 Z" fill="#CD824D" opacity="0.7" />
        </marker>
      </defs>

      {/* Background fill */}
      <rect width={SVG_W} height={SVG_H} fill={`url(#bg-${chapterId})`} />

      {/* Graduated neatline — period-appropriate thick-thin double border */}
      <rect x="6" y="6" width={SVG_W - 12} height={SVG_H - 12} fill="none" stroke="rgba(120, 100, 70, 0.4)" strokeWidth="2.5" rx="2" />
      <rect x="12" y="12" width={SVG_W - 24} height={SVG_H - 24} fill="none" stroke="rgba(120, 100, 70, 0.3)" strokeWidth="0.5" rx="1" />

      {/* Land base (subtle warm fill for non-sea areas) */}
      <rect x={PAD_X} y={PAD_Y} width={USABLE_W} height={USABLE_H} fill={`url(#land-${chapterId})`} />

      {/* Seas */}
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.ligurianSea)} fill={`url(#sea-${chapterId})`} opacity="0.9" />
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.upperAdriatic)} fill={`url(#sea-${chapterId})`} opacity="0.9" />

      {/* Coastline detail — subtle shore lines */}
      {(() => {
        const ligCoast = ITALIAN_CAMPAIGN_TERRAIN.ligurianSea.slice(0, 6);
        const adriCoast = ITALIAN_CAMPAIGN_TERRAIN.upperAdriatic.slice(0, 4);
        return (
          <>
            <path d={smoothPath(ligCoast)} fill="none" stroke="rgba(90, 140, 160, 0.20)" strokeWidth="1.5" strokeLinecap="round" filter={`url(#coast-${chapterId})`} />
            <path d={smoothPath(ligCoast)} fill="none" stroke="rgba(180, 200, 210, 0.12)" strokeWidth="0.5" strokeLinecap="round" />
            <path d={smoothPath(adriCoast)} fill="none" stroke="rgba(90, 140, 160, 0.18)" strokeWidth="1.5" strokeLinecap="round" filter={`url(#coast-${chapterId})`} />
            <path d={smoothPath(adriCoast)} fill="none" stroke="rgba(180, 200, 210, 0.10)" strokeWidth="0.5" strokeLinecap="round" />
          </>
        );
      })()}

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

      {/* Mountains — Alps (layered altitude bands for depth) */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(110, 95, 70, 0.06)" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(120, 100, 78, 0.08)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(135, 115, 88, 0.10)" strokeWidth="18" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(150, 130, 100, 0.12)" strokeWidth="8" strokeLinecap="round" />
      {/* Ridge line with peaks */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(170, 150, 115, 0.18)" strokeWidth="1.8" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.alps)} fill="none" stroke="rgba(140, 120, 90, 0.10)" strokeWidth="0.5" strokeLinecap="round" strokeDasharray="2 4" />

      {/* Mountains — Apennines (lighter, lower range) */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(100, 85, 65, 0.05)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(110, 92, 72, 0.07)" strokeWidth="18" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(125, 105, 82, 0.10)" strokeWidth="8" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(140, 118, 90, 0.14)" strokeWidth="1.2" strokeLinecap="round" />
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.apennines)} fill="none" stroke="rgba(120, 100, 78, 0.08)" strokeWidth="0.5" strokeDasharray="1.5 3.5" />

      {/* Mountain hachures — Alps (denser, longer) */}
      {(() => {
        const alpsSpine: [number, number][] = ITALIAN_CAMPAIGN_TERRAIN.alps.map(
          (p) => [p.lat, p.lon] as [number, number],
        );
        const alpsHachures = generateHachures(alpsSpine, 0.08, 0.14, 1);
        return (
          <g className="hachures-alps" opacity="1">
            {alpsHachures.map((h, i) => {
              const p1 = project(h.y1, h.x1);
              const p2 = project(h.y2, h.x2);
              return (
                <line
                  key={`ah-${i}`}
                  x1={p1.x} y1={p1.y}
                  x2={p2.x} y2={p2.y}
                  stroke="rgba(140, 120, 90, 0.18)"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      })()}

      {/* Mountain hachures — Apennines (sparser, shorter) */}
      {(() => {
        const apenSpine: [number, number][] = ITALIAN_CAMPAIGN_TERRAIN.apennines.map(
          (p) => [p.lat, p.lon] as [number, number],
        );
        const apenHachures = generateHachures(apenSpine, 0.12, 0.10, 42);
        return (
          <g className="hachures-apennines" opacity="1">
            {apenHachures.map((h, i) => {
              const p1 = project(h.y1, h.x1);
              const p2 = project(h.y2, h.x2);
              return (
                <line
                  key={`aph-${i}`}
                  x1={p1.x} y1={p1.y}
                  x2={p2.x} y2={p2.y}
                  stroke="rgba(140, 120, 90, 0.18)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      })()}

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

      {/* Po Valley lowland fill — subtle green-brown wash */}
      {(() => {
        const poValley = [
          { lat: 45.2, lon: 7.5 }, { lat: 45.15, lon: 8.5 }, { lat: 45.0, lon: 9.5 },
          { lat: 45.0, lon: 10.5 }, { lat: 45.1, lon: 11.5 }, { lat: 45.2, lon: 12.3 },
          { lat: 45.6, lon: 12.3 }, { lat: 45.8, lon: 11.5 }, { lat: 45.6, lon: 10.5 },
          { lat: 45.6, lon: 9.5 }, { lat: 45.5, lon: 8.5 }, { lat: 45.4, lon: 7.5 },
        ];
        return <path d={smoothPath(poValley, true)} fill="rgba(80, 90, 55, 0.06)" stroke="none" />;
      })()}

      {/* Lakes */}
      <polygon points={polyStr(ITALIAN_CAMPAIGN_TERRAIN.lakeGarda)} fill="rgba(55, 85, 95, 0.45)" stroke="rgba(50, 75, 85, 0.25)" strokeWidth="0.5" />
      {(() => { const g = project(45.7, 10.68); return <text x={g.x} y={g.y} fill="rgba(100, 150, 170, 0.22)" fontSize="5.5" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" transform={`rotate(-60, ${g.x}, ${g.y})`}>L. Garda</text>; })()}
      {/* Lake Maggiore */}
      {(() => {
        const mag = [
          { lat: 46.15, lon: 8.60 }, { lat: 46.10, lon: 8.55 }, { lat: 46.00, lon: 8.58 },
          { lat: 45.90, lon: 8.62 }, { lat: 45.82, lon: 8.63 }, { lat: 45.82, lon: 8.68 },
          { lat: 45.90, lon: 8.68 }, { lat: 46.00, lon: 8.65 }, { lat: 46.10, lon: 8.63 },
        ];
        const mp = project(45.95, 8.55);
        return (
          <>
            <polygon points={polyStr(mag)} fill="rgba(55, 85, 95, 0.40)" stroke="rgba(50, 75, 85, 0.2)" strokeWidth="0.4" />
            <text x={mp.x} y={mp.y} fill="rgba(100, 150, 170, 0.18)" fontSize="4.5" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="end">Maggiore</text>
          </>
        );
      })()}
      {/* Lake Como */}
      {(() => {
        const como = [
          { lat: 46.18, lon: 9.25 }, { lat: 46.10, lon: 9.20 }, { lat: 46.00, lon: 9.22 },
          { lat: 45.88, lon: 9.08 }, { lat: 45.82, lon: 9.08 }, { lat: 45.82, lon: 9.15 },
          { lat: 45.90, lon: 9.18 }, { lat: 46.00, lon: 9.28 }, { lat: 46.10, lon: 9.30 },
        ];
        const cp = project(46.0, 9.32);
        return (
          <>
            <polygon points={polyStr(como)} fill="rgba(55, 85, 95, 0.38)" stroke="rgba(50, 75, 85, 0.2)" strokeWidth="0.4" />
            <text x={cp.x} y={cp.y} fill="rgba(100, 150, 170, 0.18)" fontSize="4.5" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="start">Como</text>
          </>
        );
      })()}
      {/* Lake Iseo */}
      {(() => {
        const iseo = [
          { lat: 45.78, lon: 10.05 }, { lat: 45.72, lon: 10.04 }, { lat: 45.68, lon: 10.06 },
          { lat: 45.68, lon: 10.10 }, { lat: 45.72, lon: 10.10 }, { lat: 45.78, lon: 10.09 },
        ];
        return <polygon points={polyStr(iseo)} fill="rgba(55, 85, 95, 0.35)" stroke="none" />;
      })()}

      {/* Rivers */}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.poRiver)} fill="none" stroke="rgba(60, 85, 95, 0.40)" strokeWidth="2.2" strokeLinecap="round" />
      {(() => { const po = project(45.02, 8.8); return <text x={po.x} y={po.y - 6} fill="rgba(90, 130, 145, 0.25)" fontSize="7" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle">Po</text>; })()}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.adigeRiver)} fill="none" stroke="rgba(60, 85, 95, 0.35)" strokeWidth="1.8" strokeLinecap="round" />
      {(() => { const ad = project(45.65, 10.9); return <text x={ad.x} y={ad.y + 10} fill="rgba(90, 130, 145, 0.20)" fontSize="6" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="middle" transform={`rotate(-60, ${ad.x}, ${ad.y + 10})`}>Adige</text>; })()}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.brentaRiver)} fill="none" stroke="rgba(60, 85, 95, 0.28)" strokeWidth="1.2" strokeLinecap="round" />
      {(() => { const br = project(45.82, 11.78); return <text x={br.x + 6} y={br.y} fill="rgba(90, 130, 145, 0.16)" fontSize="5" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="start" transform={`rotate(-70, ${br.x + 6}, ${br.y})`}>Brenta</text>; })()}
      <path d={smoothPath(ITALIAN_CAMPAIGN_TERRAIN.tagliamentoRiver)} fill="none" stroke="rgba(60, 85, 95, 0.28)" strokeWidth="1.2" strokeLinecap="round" />
      {(() => { const tg = project(46.1, 12.82); return <text x={tg.x + 6} y={tg.y} fill="rgba(90, 130, 145, 0.16)" fontSize="5" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" textAnchor="start" transform={`rotate(-55, ${tg.x + 6}, ${tg.y})`}>Tagliamento</text>; })()}

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
      {routeData && (() => {
        const style: CampaignMapRouteStyle = chapter.routeStyle ?? 'advance';
        const isSiege = style === 'siege';
        const isDiplomacy = style === 'diplomacy';
        const dashArray = isDiplomacy ? '8 4' : 'none';
        const markerId = isSiege ? undefined : `url(#arrow-${style}-${chapterId})`;
        // For long routes (3+ waypoints), render segments so arrows appear at intermediate points
        const useSegments = !isSiege && routeData.pointCount >= 3;

        return (
          <>
            {/* Shadow line — always one continuous path */}
            <path d={routeData.fullPath} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {useSegments ? (
              /* Segmented route with arrowheads at each segment end */
              routeData.segments.map((seg, i) => (
                <path
                  key={`route-seg-${i}`}
                  d={seg}
                  fill="none"
                  stroke="#CD824D"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#rglow-${chapterId})`}
                  strokeDasharray={dashArray}
                  markerEnd={markerId}
                />
              ))
            ) : (
              /* Single path — short routes or siege (no arrows) */
              <path
                d={routeData.fullPath}
                fill="none"
                stroke="#CD824D"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#rglow-${chapterId})`}
                strokeDasharray={dashArray}
                markerEnd={markerId}
              />
            )}
            {/* Destination marker */}
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
        );
      })()}

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

      {/* Siege rings (rendered before place markers so markers sit on top) */}
      {visiblePlaces
        .filter((p) => p.kind === 'siege' && p.chapterIds.includes(chapterId))
        .map((place) => {
          const { x, y } = project(place.lat, place.lon);
          return (
            <SiegeRings key={`siege-${place.id}`} x={x} y={y} chapterId={chapterId} />
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
            {place.kind === 'battle' ? (() => {
              const br = place.significance === 'major' ? 7 : place.significance === 'minor' ? 4.5 : 5.5;
              return <path d={`M ${x} ${y - br} L ${x + br} ${y} L ${x} ${y + br} L ${x - br} ${y} Z`} fill="#B85D3F" stroke="rgba(0,0,0,0.5)" strokeWidth="0.7" />;
            })() : place.kind === 'siege' ? (
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

      {/* Compass rose — upper right */}
      <CompassRose cx={SVG_W - 60} cy={100} r={25} />

      {/* Scale bar — lower left */}
      <ScaleBar x={28} y={SVG_H - 38} bounds={projBounds} />

      {/* Vignette overlay */}
      <rect width={SVG_W} height={SVG_H} fill={`url(#vignette-${chapterId})`} pointerEvents="none" />
    </svg>
  );
}
