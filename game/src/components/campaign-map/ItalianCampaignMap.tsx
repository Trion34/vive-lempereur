import React, { useId, useMemo } from 'react';
import {
  ITALIAN_CAMPAIGN_BOUNDS,
  ITALIAN_CAMPAIGN_CHAPTERS,
  ITALIAN_CAMPAIGN_PLACES,
  ITALIAN_CAMPAIGN_TERRAIN,
  type CampaignMapGeoPoint,
  type ItalianCampaignChapterId,
  type ItalianCampaignPlace,
} from './italianCampaignMapData';

const VIEWBOX_WIDTH = 1120;
const VIEWBOX_HEIGHT = 760;
const PAD_X = 82;
const PAD_Y = 64;

type ProjectedPoint = CampaignMapGeoPoint & { x: number; y: number };
type ProjectedPlace = ItalianCampaignPlace & { x: number; y: number };

function project(point: CampaignMapGeoPoint): ProjectedPoint {
  const usableWidth = VIEWBOX_WIDTH - PAD_X * 2;
  const usableHeight = VIEWBOX_HEIGHT - PAD_Y * 2;
  const x =
    PAD_X +
    ((point.lon - ITALIAN_CAMPAIGN_BOUNDS.west) /
      (ITALIAN_CAMPAIGN_BOUNDS.east - ITALIAN_CAMPAIGN_BOUNDS.west)) *
      usableWidth;
  const y =
    PAD_Y +
    ((ITALIAN_CAMPAIGN_BOUNDS.north - point.lat) /
      (ITALIAN_CAMPAIGN_BOUNDS.north - ITALIAN_CAMPAIGN_BOUNDS.south)) *
      usableHeight;
  return { ...point, x, y };
}

function pathFromPoints(points: ProjectedPoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    path += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
  }

  const penultimate = points[points.length - 2];
  const last = points[points.length - 1];
  path += ` Q ${penultimate.x} ${penultimate.y} ${last.x} ${last.y}`;
  return path;
}

function polygonFromPoints(points: ProjectedPoint[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function computeFocusEllipse(points: ProjectedPoint[]) {
  if (points.length === 0) {
    return { cx: VIEWBOX_WIDTH / 2, cy: VIEWBOX_HEIGHT / 2, rx: 120, ry: 90 };
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    rx: Math.max(90, (maxX - minX) / 2 + 68),
    ry: Math.max(72, (maxY - minY) / 2 + 54),
  };
}

function markerPathForPlace(place: ProjectedPlace): React.ReactNode {
  switch (place.kind) {
    case 'battle':
      return (
        <path
          d={`M ${place.x} ${place.y - 8} L ${place.x + 8} ${place.y} L ${place.x} ${place.y + 8} L ${place.x - 8} ${place.y} Z`}
        />
      );
    case 'siege':
      return (
        <rect
          x={place.x - 7}
          y={place.y - 7}
          width={14}
          height={14}
          rx={2}
          ry={2}
        />
      );
    case 'treaty':
      return (
        <path
          d={`M ${place.x - 8} ${place.y - 3} L ${place.x - 2} ${place.y - 9} L ${place.x + 8} ${place.y + 1} L ${place.x + 2} ${place.y + 7} Z`}
        />
      );
    case 'city':
    default:
      return <circle cx={place.x} cy={place.y} r={6.5} />;
  }
}

export interface ItalianCampaignMapProps {
  activeChapterId?: ItalianCampaignChapterId;
  animate?: boolean;
  showRoutes?: boolean;
  showFocus?: boolean;
  showAllPlaces?: boolean;
  highlightedPlaceIds?: string[];
  badge?: {
    kicker: string;
    title: string;
    meta: string;
  } | null;
}

export function ItalianCampaignMap({
  activeChapterId = 'ch1',
  animate = true,
  showRoutes = true,
  showFocus = true,
  showAllPlaces = false,
  highlightedPlaceIds,
  badge,
}: ItalianCampaignMapProps) {
  const uniqueId = useId().replace(/:/g, '-');

  const projectedPlaces = useMemo<ProjectedPlace[]>(
    () => ITALIAN_CAMPAIGN_PLACES.map((place) => ({ ...place, ...project(place) })),
    [],
  );

  const projectedById = useMemo(
    () => new Map(projectedPlaces.map((place) => [place.id, place])),
    [projectedPlaces],
  );

  const activeIndex = Math.max(
    0,
    ITALIAN_CAMPAIGN_CHAPTERS.findIndex((chapter) => chapter.id === activeChapterId),
  );
  const activeChapter = ITALIAN_CAMPAIGN_CHAPTERS[activeIndex];
  const activePlaceIds = highlightedPlaceIds ?? activeChapter.route;

  const visitedPlaceIds = useMemo(() => {
    const ids = new Set<string>();
    for (const chapter of ITALIAN_CAMPAIGN_CHAPTERS.slice(0, activeIndex + 1)) {
      for (const placeId of chapter.route) ids.add(placeId);
    }
    return ids;
  }, [activeIndex]);

  const activeFocusPoints = activePlaceIds
    .map((placeId) => projectedById.get(placeId))
    .filter((place): place is ProjectedPlace => Boolean(place));
  const focusEllipse = computeFocusEllipse(activeFocusPoints);
  const badgeText =
    badge === null
      ? null
      : (badge ?? {
          kicker: 'CAMPAIGN THEATER',
          title: 'Army of Italy, 1796-1797',
          meta: 'Southern France / Northern Italy / Inner Austria',
        });

  const terrain = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(ITALIAN_CAMPAIGN_TERRAIN).map(([key, value]) => [
          key,
          value.map((point) => project(point)),
        ]),
      ) as Record<keyof typeof ITALIAN_CAMPAIGN_TERRAIN, ProjectedPoint[]>,
    [],
  );

  return (
    <svg
      className="campaign-map__svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label="Map of Napoleon's first Italian campaign"
    >
      <defs>
        <linearGradient id={`campaign-map-paper-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d2417" />
          <stop offset="48%" stopColor="#17130e" />
          <stop offset="100%" stopColor="#120f0b" />
        </linearGradient>
        <linearGradient id={`campaign-map-sea-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#234c63" />
          <stop offset="100%" stopColor="#0e2231" />
        </linearGradient>
        <linearGradient id={`campaign-map-land-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b3324" />
          <stop offset="45%" stopColor="#2a2218" />
          <stop offset="100%" stopColor="#201910" />
        </linearGradient>
        <radialGradient id={`campaign-map-focus-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(242, 191, 93, 0.48)" />
          <stop offset="60%" stopColor="rgba(242, 191, 93, 0.15)" />
          <stop offset="100%" stopColor="rgba(242, 191, 93, 0)" />
        </radialGradient>
        <filter id={`campaign-map-glow-${uniqueId}`}>
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id={`campaign-map-arrow-${uniqueId}`}
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#efc36e" />
        </marker>
      </defs>

      <rect
        x={28}
        y={24}
        width={VIEWBOX_WIDTH - 56}
        height={VIEWBOX_HEIGHT - 48}
        rx={26}
        className="campaign-map__frame"
      />

      <rect
        x={42}
        y={38}
        width={VIEWBOX_WIDTH - 84}
        height={VIEWBOX_HEIGHT - 76}
        rx={20}
        fill={`url(#campaign-map-paper-${uniqueId})`}
      />

      <polygon
        className="campaign-map__sea"
        points={polygonFromPoints(terrain.ligurianSea)}
        fill={`url(#campaign-map-sea-${uniqueId})`}
      />
      <polygon
        className="campaign-map__sea"
        points={polygonFromPoints(terrain.upperAdriatic)}
        fill={`url(#campaign-map-sea-${uniqueId})`}
      />

      <rect
        x={62}
        y={58}
        width={VIEWBOX_WIDTH - 124}
        height={VIEWBOX_HEIGHT - 116}
        rx={16}
        fill={`url(#campaign-map-land-${uniqueId})`}
      />

      {showFocus && (
        <ellipse
          cx={focusEllipse.cx}
          cy={focusEllipse.cy}
          rx={focusEllipse.rx}
          ry={focusEllipse.ry}
          fill={`url(#campaign-map-focus-${uniqueId})`}
          className={
            animate ? 'campaign-map__focus campaign-map__focus--animated' : 'campaign-map__focus'
          }
        />
      )}

      {Array.from({ length: 7 }).map((_, index) => {
        const y = 110 + index * 84;
        const wobble = index % 2 === 0 ? 18 : -18;
        return (
          <path
            key={`contour-${index}`}
            className="campaign-map__contour"
            d={`M 96 ${y} C 270 ${y + wobble}, 525 ${y - wobble}, 708 ${y + wobble / 2} S 987 ${y - wobble}, 1024 ${y + 6}`}
          />
        );
      })}

      <path
        className="campaign-map__mountains campaign-map__mountains--major"
        d={pathFromPoints(terrain.alps)}
      />
      <path
        className="campaign-map__mountains campaign-map__mountains--minor"
        d={pathFromPoints(terrain.apennines)}
      />

      <polygon
        className="campaign-map__marsh"
        points={polygonFromPoints(terrain.arcoleMarsh)}
      />

      <path className="campaign-map__river campaign-map__river--major" d={pathFromPoints(terrain.poRiver)} />
      <path className="campaign-map__river campaign-map__river--major" d={pathFromPoints(terrain.adigeRiver)} />
      <path className="campaign-map__river" d={pathFromPoints(terrain.brentaRiver)} />
      <path className="campaign-map__river" d={pathFromPoints(terrain.tagliamentoRiver)} />
      <polygon className="campaign-map__lake" points={polygonFromPoints(terrain.lakeGarda)} />

      <text x={94} y={118} className="campaign-map__region campaign-map__region--west">
        FRENCH REPUBLIC
      </text>
      <text x={236} y={172} className="campaign-map__region campaign-map__region--minor">
        SWITZERLAND
      </text>
      <text x={184} y={250} className="campaign-map__region">
        KINGDOM OF SARDINIA
      </text>
      <text x={440} y={300} className="campaign-map__region">
        AUSTRIAN LOMBARDY
      </text>
      <text x={706} y={236} className="campaign-map__region campaign-map__region--minor">
        VENETIAN REPUBLIC
      </text>
      <text x={666} y={118} className="campaign-map__region campaign-map__region--minor">
        TYROL
      </text>
      <text x={892} y={124} className="campaign-map__region campaign-map__region--east">
        INNER AUSTRIA
      </text>
      <text x={914} y={386} className="campaign-map__region campaign-map__region--minor">
        ADRIATIC SEA
      </text>

      <text x={168} y={648} className="campaign-map__water-label">
        Ligurian Sea
      </text>
      <text x={546} y={432} className="campaign-map__water-label">
        Po
      </text>
      <text x={746} y={334} className="campaign-map__water-label">
        Adige
      </text>
      <text x={816} y={308} className="campaign-map__water-label">
        Brenta
      </text>
      <text x={968} y={252} className="campaign-map__water-label">
        Tagliamento
      </text>
      <text x={632} y={254} className="campaign-map__water-label">
        Lake Garda
      </text>

      {showRoutes &&
        ITALIAN_CAMPAIGN_CHAPTERS.map((chapter, index) => {
          const points = chapter.route
            .map((placeId) => projectedById.get(placeId))
            .filter((point): point is ProjectedPlace => Boolean(point));
          const state =
            index < activeIndex ? 'past' : index === activeIndex ? 'active' : 'future';
          const chapterPath = pathFromPoints(points);
          return (
            <g key={chapter.id}>
              <path
                d={chapterPath}
                className={`campaign-map__route campaign-map__route--base campaign-map__route--${state}`}
              />
              <path
                d={chapterPath}
                pathLength={1}
                markerEnd={
                  state === 'active' ? `url(#campaign-map-arrow-${uniqueId})` : undefined
                }
                className={[
                  'campaign-map__route',
                  `campaign-map__route--${state}`,
                  `campaign-map__route--${chapter.routeStyle ?? 'advance'}`,
                  state === 'active' && animate ? 'campaign-map__route--animated' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </g>
          );
        })}

      {projectedPlaces.map((place) => {
        const isVisited = showAllPlaces || place.context ? true : visitedPlaceIds.has(place.id);
        const isActive = activePlaceIds.includes(place.id);
        const showLabel = showAllPlaces || place.alwaysLabel || isVisited || isActive;
        const offsetX = place.labelOffset?.x ?? 10;
        const offsetY = place.labelOffset?.y ?? -12;
        const anchor = place.labelAnchor ?? 'start';
        const markerClass = [
          'campaign-map__marker',
          `campaign-map__marker--${place.kind}`,
          place.context ? 'campaign-map__marker--context' : '',
          isVisited ? 'campaign-map__marker--visited' : 'campaign-map__marker--future',
          isActive ? 'campaign-map__marker--active' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <g key={place.id}>
            {isActive && showFocus && (
              <circle
                cx={place.x}
                cy={place.y}
                r={18}
                className={
                  animate ? 'campaign-map__marker-pulse campaign-map__marker-pulse--animated' : 'campaign-map__marker-pulse'
                }
                filter={`url(#campaign-map-glow-${uniqueId})`}
              />
            )}
            <g className={markerClass}>{markerPathForPlace(place)}</g>
            {showLabel && (
              <text
                x={place.x + offsetX}
                y={place.y + offsetY}
                textAnchor={anchor}
                className={[
                  'campaign-map__label',
                  place.alwaysLabel ? 'campaign-map__label--major' : '',
                  place.context ? 'campaign-map__label--context' : '',
                  isActive ? 'campaign-map__label--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {place.shortLabel ?? place.label}
              </text>
            )}
          </g>
        );
      })}

      {badgeText && (
        <g className="campaign-map__badge">
          <rect x={86} y={80} width={340} height={102} rx={18} />
          <text x={112} y={116} className="campaign-map__badge-kicker">
            {badgeText.kicker}
          </text>
          <text x={112} y={146} className="campaign-map__badge-title">
            {badgeText.title}
          </text>
          <text x={112} y={168} className="campaign-map__badge-meta">
            {badgeText.meta}
          </text>
        </g>
      )}
    </svg>
  );
}

