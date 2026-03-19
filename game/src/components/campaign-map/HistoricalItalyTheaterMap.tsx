import React, { useId } from 'react';
import {
  HISTORICAL_ITALY_COAST_PATHS,
  HISTORICAL_ITALY_LAKE_PATHS,
  HISTORICAL_ITALY_LAND_PATHS,
  HISTORICAL_ITALY_RIVER_PATHS,
  HISTORICAL_ITALY_THEATER_BOUNDS,
  HISTORICAL_ITALY_THEATER_PROJECTION,
  HISTORICAL_ITALY_THEATER_VIEWBOX,
} from './historicalItalyTheaterData';
import { HISTORICAL_ITALY_POLITICAL_OVERLAYS } from './historicalItalyPoliticalData';

type GeoPoint = {
  lat: number;
  lon: number;
};

type WaterLabel = {
  label: string;
  point: GeoPoint;
  angle?: number;
  className?: string;
  anchor?: 'start' | 'middle' | 'end';
};

type TheaterPlace = GeoPoint & {
  id: string;
  label: string;
  tier: 'capital' | 'major' | 'campaign';
  labelOffset: { x: number; y: number };
  anchor?: 'start' | 'middle' | 'end';
};

type TerrainWash = {
  id: string;
  className: string;
  points: GeoPoint[];
};

const PLACE_TIER_ORDER: Record<TheaterPlace['tier'], number> = {
  campaign: 0,
  major: 1,
  capital: 2,
};

function project(point: GeoPoint) {
  const { width, height, pad } = HISTORICAL_ITALY_THEATER_PROJECTION;
  const x =
    pad +
    ((point.lon - HISTORICAL_ITALY_THEATER_BOUNDS.west) /
      (HISTORICAL_ITALY_THEATER_BOUNDS.east - HISTORICAL_ITALY_THEATER_BOUNDS.west)) *
      width;
  const y =
    pad +
    ((HISTORICAL_ITALY_THEATER_BOUNDS.north - point.lat) /
      (HISTORICAL_ITALY_THEATER_BOUNDS.north - HISTORICAL_ITALY_THEATER_BOUNDS.south)) *
      height;
  return { x, y };
}

function linePath(points: GeoPoint[]) {
  return points
    .map((point, index) => {
      const { x, y } = project(point);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function areaPath(points: GeoPoint[]) {
  return `${linePath(points)} Z`;
}

function projectGeoPathData(pathData: string) {
  const tokens = pathData.match(/[MLZ]|-?\d+(?:\.\d+)?/g);
  if (!tokens) {
    return pathData;
  }

  const projected: string[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];
    if (token === 'M' || token === 'L' || token === 'Z') {
      projected.push(token);
      index += 1;
      continue;
    }

    const lon = Number(token);
    const latToken = tokens[index + 1];
    if (Number.isNaN(lon) || latToken == null) {
      projected.push(token);
      index += 1;
      continue;
    }

    const lat = Number(latToken);
    if (Number.isNaN(lat)) {
      projected.push(token);
      index += 1;
      continue;
    }

    const { x, y } = project({ lon, lat });
    projected.push(x.toFixed(1), y.toFixed(1));
    index += 2;
  }

  return projected.join(' ');
}

const WATER_LABELS: WaterLabel[] = [
  {
    label: 'Ligurian Sea',
    point: { lon: 8.2, lat: 43.0 },
    angle: -7,
    className: 'theater-map__water-label theater-map__water-label--sea',
  },
  {
    label: 'Adriatic Sea',
    point: { lon: 14.55, lat: 44.55 },
    angle: 18,
    className: 'theater-map__water-label theater-map__water-label--sea',
  },
  {
    label: 'Lake Geneva',
    point: { lon: 6.62, lat: 46.45 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--lake',
  },
  {
    label: 'Lake Garda',
    point: { lon: 10.72, lat: 45.73 },
    angle: -16,
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--lake',
  },
  {
    label: 'Lake Maggiore',
    point: { lon: 8.63, lat: 45.93 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--lake',
  },
  {
    label: 'Lake Como',
    point: { lon: 9.28, lat: 46.0 },
    angle: -34,
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--lake',
  },
  {
    label: 'Lake Iseo',
    point: { lon: 10.02, lat: 45.75 },
    angle: -24,
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--lake',
  },
  {
    label: 'Rhone',
    point: { lon: 4.88, lat: 45.66 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -64,
  },
  {
    label: 'Po',
    point: { lon: 9.98, lat: 45.06 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
  },
  {
    label: 'Adige',
    point: { lon: 11.08, lat: 45.77 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -58,
  },
  {
    label: 'Adda',
    point: { lon: 9.63, lat: 45.38 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -64,
  },
  {
    label: 'Oglio',
    point: { lon: 10.16, lat: 45.36 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -68,
  },
  {
    label: 'Tanaro',
    point: { lon: 8.05, lat: 44.74 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -20,
  },
  {
    label: 'Trebbia',
    point: { lon: 9.55, lat: 44.78 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -18,
  },
  {
    label: 'Taro',
    point: { lon: 10.12, lat: 44.82 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -28,
  },
  {
    label: 'Secchia',
    point: { lon: 10.77, lat: 44.88 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -74,
  },
  {
    label: 'Brenta',
    point: { lon: 11.82, lat: 45.88 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -42,
  },
  {
    label: 'Piave',
    point: { lon: 12.62, lat: 46.08 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    angle: -52,
  },
  {
    label: 'Danube',
    point: { lon: 15.86, lat: 48.02 },
    className: 'theater-map__water-label theater-map__water-label--small theater-map__water-label--river',
    anchor: 'end',
  },
];

const TERRAIN_WASHES: TerrainWash[] = [
  {
    id: 'alps-west',
    className: 'theater-map__terrain-wash theater-map__terrain-wash--alps',
    points: [
      { lon: 4.7, lat: 46.9 },
      { lon: 5.8, lat: 47.6 },
      { lon: 7.6, lat: 47.6 },
      { lon: 9.8, lat: 47.1 },
      { lon: 10.5, lat: 46.5 },
      { lon: 10.2, lat: 45.95 },
      { lon: 8.6, lat: 45.8 },
      { lon: 7.0, lat: 45.92 },
      { lon: 5.4, lat: 46.14 },
    ],
  },
  {
    id: 'alps-east',
    className: 'theater-map__terrain-wash theater-map__terrain-wash--alps',
    points: [
      { lon: 10.1, lat: 47.25 },
      { lon: 11.6, lat: 47.5 },
      { lon: 13.6, lat: 47.28 },
      { lon: 15.2, lat: 46.72 },
      { lon: 15.55, lat: 46.2 },
      { lon: 14.2, lat: 45.82 },
      { lon: 12.3, lat: 45.7 },
      { lon: 10.8, lat: 45.92 },
      { lon: 10.15, lat: 46.45 },
    ],
  },
  {
    id: 'apennines',
    className: 'theater-map__terrain-wash theater-map__terrain-wash--apennines',
    points: [
      { lon: 7.35, lat: 44.58 },
      { lon: 8.32, lat: 44.82 },
      { lon: 9.6, lat: 44.86 },
      { lon: 10.88, lat: 44.7 },
      { lon: 12.18, lat: 44.36 },
      { lon: 12.98, lat: 43.78 },
      { lon: 12.2, lat: 43.18 },
      { lon: 10.78, lat: 43.28 },
      { lon: 9.18, lat: 43.44 },
      { lon: 8.08, lat: 43.84 },
    ],
  },
];

const MAJOR_RIVERS = new Set(['Rhone', 'Po', 'Adige', 'Danube']);
const SECONDARY_RIVERS = new Set([
  'Inn',
  'Ticino',
  'Mincio',
  'Durance',
  'Dora Baltea',
  'Adda',
  'Oglio',
  'Tanaro',
  'Sesia',
  'Trebbia',
  'Taro',
  'Secchia',
  'Brenta',
  'Piave',
]);
const PERIPHERAL_RIVERS = new Set(['Seine', 'Mur', 'Drau']);

const ADDITIONAL_RIVER_PATHS: Array<{ name: string; points: GeoPoint[] }> = [
  {
    name: 'Adda',
    points: [
      { lon: 9.26, lat: 46.02 },
      { lon: 9.43, lat: 45.83 },
      { lon: 9.56, lat: 45.61 },
      { lon: 9.57, lat: 45.44 },
      { lon: 9.51, lat: 45.28 },
      { lon: 9.59, lat: 45.16 },
      { lon: 9.84, lat: 45.03 },
    ],
  },
  {
    name: 'Oglio',
    points: [
      { lon: 10.08, lat: 45.81 },
      { lon: 10.08, lat: 45.63 },
      { lon: 10.1, lat: 45.43 },
      { lon: 10.12, lat: 45.25 },
      { lon: 10.2, lat: 45.1 },
      { lon: 10.39, lat: 44.99 },
    ],
  },
  {
    name: 'Tanaro',
    points: [
      { lon: 7.55, lat: 44.39 },
      { lon: 7.84, lat: 44.59 },
      { lon: 8.07, lat: 44.77 },
      { lon: 8.2, lat: 44.9 },
      { lon: 8.37, lat: 44.88 },
      { lon: 8.58, lat: 44.83 },
      { lon: 8.73, lat: 45.01 },
    ],
  },
  {
    name: 'Sesia',
    points: [
      { lon: 8.23, lat: 45.89 },
      { lon: 8.2, lat: 45.72 },
      { lon: 8.18, lat: 45.5 },
      { lon: 8.22, lat: 45.27 },
      { lon: 8.31, lat: 45.04 },
    ],
  },
  {
    name: 'Trebbia',
    points: [
      { lon: 9.31, lat: 44.65 },
      { lon: 9.42, lat: 44.74 },
      { lon: 9.57, lat: 44.8 },
      { lon: 9.69, lat: 44.86 },
    ],
  },
  {
    name: 'Taro',
    points: [
      { lon: 9.89, lat: 44.56 },
      { lon: 9.98, lat: 44.68 },
      { lon: 10.08, lat: 44.8 },
      { lon: 10.22, lat: 44.92 },
    ],
  },
  {
    name: 'Secchia',
    points: [
      { lon: 10.67, lat: 44.33 },
      { lon: 10.7, lat: 44.49 },
      { lon: 10.72, lat: 44.67 },
      { lon: 10.75, lat: 44.87 },
      { lon: 10.8, lat: 45.09 },
    ],
  },
  {
    name: 'Brenta',
    points: [
      { lon: 11.67, lat: 46.1 },
      { lon: 11.72, lat: 45.95 },
      { lon: 11.77, lat: 45.79 },
      { lon: 11.78, lat: 45.64 },
      { lon: 11.72, lat: 45.51 },
      { lon: 11.84, lat: 45.42 },
    ],
  },
  {
    name: 'Piave',
    points: [
      { lon: 12.33, lat: 46.34 },
      { lon: 12.4, lat: 46.18 },
      { lon: 12.37, lat: 45.98 },
      { lon: 12.4, lat: 45.78 },
      { lon: 12.5, lat: 45.63 },
      { lon: 12.63, lat: 45.5 },
    ],
  },
];

function riverClassName(name: string, extraClassName?: string) {
  const classes = ['theater-map__river'];
  if (MAJOR_RIVERS.has(name)) {
    classes.push('theater-map__river--major');
  } else if (SECONDARY_RIVERS.has(name)) {
    classes.push('theater-map__river--secondary');
  } else {
    classes.push('theater-map__river--minor');
  }

  if (PERIPHERAL_RIVERS.has(name)) {
    classes.push('theater-map__river--peripheral');
  }

  if (extraClassName) {
    classes.push(extraClassName);
  }

  return classes.join(' ');
}

const POLITICAL_LABEL_LINES: Record<string, string[]> = {
  'french-republic': ['French', 'Republic'],
  'swiss-confederation': ['Swiss', 'Confederation'],
  grisons: ['Grisons'],
  'swabian-states': ['Swabian', 'States'],
  'electorate-of-bavaria': ['Bavaria'],
  'county-of-tyrol': ['Tyrol'],
  'archbishopric-of-salzburg': ['Archbishopric', 'of Salzburg'],
  'bishopric-of-trent': ['Bishopric', 'of Trent'],
  'piedmont-sardinia': ['Kingdom of', 'Sardinia'],
  'republic-of-genoa': ['Republic of', 'Genoa'],
  'austrian-lombardy': ['Duchy of', 'Milan'],
  'duchy-of-parma': ['Duchy of', 'Parma'],
  'duchy-of-modena': ['Duchy of', 'Modena'],
  'duchy-of-massa-carrara': ['Massa and', 'Carrara'],
  'republic-of-lucca': ['Republic of', 'Lucca'],
  'grand-duchy-of-tuscany': ['Grand Duchy', 'of Tuscany'],
  'papal-states': ['Papal', 'States'],
  'republic-of-venice': ['Venetian', 'Republic'],
  'habsburg-lands': ['Austrian', 'Monarchy'],
};

const HIDDEN_POLITICAL_LABELS = new Set([
  'swiss-confederation',
  'grisons',
  'swabian-states',
  'county-of-tyrol',
  'archbishopric-of-salzburg',
  'bishopric-of-trent',
  'republic-of-genoa',
  'duchy-of-parma',
  'duchy-of-modena',
  'duchy-of-massa-carrara',
  'republic-of-lucca',
  'mantua-enclave',
  'grand-duchy-of-tuscany',
  'republic-of-venice',
]);

const HIDDEN_PLACE_LABELS = new Set([
  'asti',
  'cherasco',
  'reggio-emilia',
  'vicenza',
  'treviso',
  'rovigo',
  'forli',
  'rimini',
  'massa',
  'livorno',
]);

const POLITICAL_LABEL_LAYOUTS: Record<
  string,
  {
    dx?: number;
    dy?: number;
    lineHeight?: number;
    variant?: 'major-power' | 'regional-power' | 'minor-state';
  }
> = {
  'french-republic': { dx: -18, dy: 6, lineHeight: 17, variant: 'major-power' },
  'swiss-confederation': { dx: 10, dy: -10, lineHeight: 15, variant: 'minor-state' },
  'swabian-states': { dx: -8, dy: -2, lineHeight: 13, variant: 'minor-state' },
  'electorate-of-bavaria': { dx: 14, dy: -8, lineHeight: 15, variant: 'regional-power' },
  'county-of-tyrol': { dx: 12, dy: 6, lineHeight: 14, variant: 'minor-state' },
  'archbishopric-of-salzburg': { dx: 18, dy: -2, lineHeight: 12, variant: 'minor-state' },
  'piedmont-sardinia': { dx: -10, dy: 24, lineHeight: 14, variant: 'regional-power' },
  'austrian-lombardy': { dx: 2, dy: 10, lineHeight: 12, variant: 'regional-power' },
  'grand-duchy-of-tuscany': { dx: 16, dy: 10, lineHeight: 14, variant: 'minor-state' },
  'papal-states': { dx: 30, dy: 10, lineHeight: 14, variant: 'minor-state' },
  'republic-of-venice': { dx: 58, dy: -16, lineHeight: 13, variant: 'minor-state' },
  'habsburg-lands': { dx: 26, dy: -10, lineHeight: 18, variant: 'major-power' },
};

const OVERLAY_VISUAL_VARIANTS: Record<string, 'major-power' | 'regional-power' | 'minor-state'> = {
  'french-republic': 'major-power',
  'austrian-lombardy': 'regional-power',
  'mantua-enclave': 'minor-state',
  'habsburg-lands': 'major-power',
  'swabian-states': 'minor-state',
  'electorate-of-bavaria': 'regional-power',
  'county-of-tyrol': 'regional-power',
  'piedmont-sardinia': 'regional-power',
  'republic-of-venice': 'regional-power',
  'swiss-confederation': 'minor-state',
  'archbishopric-of-salzburg': 'minor-state',
  'bishopric-of-trent': 'minor-state',
  grisons: 'minor-state',
  'republic-of-genoa': 'minor-state',
  'duchy-of-parma': 'minor-state',
  'duchy-of-modena': 'minor-state',
  'duchy-of-massa-carrara': 'minor-state',
  'republic-of-lucca': 'minor-state',
  'grand-duchy-of-tuscany': 'minor-state',
  'papal-states': 'minor-state',
};

const OVERLAY_DRAW_ORDER: Record<string, number> = {
  'french-republic': 0,
  'habsburg-lands': 0,
  'swiss-confederation': 1,
  grisons: 2,
  'swabian-states': 3,
  'electorate-of-bavaria': 4,
  'county-of-tyrol': 5,
  'archbishopric-of-salzburg': 6,
  'bishopric-of-trent': 7,
  'piedmont-sardinia': 8,
  'republic-of-genoa': 8,
  'austrian-lombardy': 9,
  'mantua-enclave': 10,
  'duchy-of-parma': 11,
  'duchy-of-modena': 11,
  'duchy-of-massa-carrara': 11,
  'republic-of-lucca': 11,
  'grand-duchy-of-tuscany': 11,
  'papal-states': 11,
  'republic-of-venice': 12,
};

const THEATER_PLACES: TheaterPlace[] = [
  {
    id: 'paris',
    label: 'Paris',
    tier: 'capital',
    lat: 48.8534951,
    lon: 2.3483915,
    labelOffset: { x: 0, y: -18 },
    anchor: 'middle',
  },
  {
    id: 'lyon',
    label: 'Lyon',
    tier: 'major',
    lat: 45.7578137,
    lon: 4.8320114,
    labelOffset: { x: 0, y: -16 },
    anchor: 'middle',
  },
  {
    id: 'marseille',
    label: 'Marseille',
    tier: 'major',
    lat: 43.2961743,
    lon: 5.3699525,
    labelOffset: { x: 0, y: -18 },
    anchor: 'middle',
  },
  {
    id: 'geneva',
    label: 'Geneva',
    tier: 'major',
    lat: 46.2017559,
    lon: 6.1466014,
    labelOffset: { x: -14, y: -16 },
    anchor: 'end',
  },
  {
    id: 'bern',
    label: 'Bern',
    tier: 'capital',
    lat: 46.9484742,
    lon: 7.4521749,
    labelOffset: { x: 0, y: -18 },
    anchor: 'middle',
  },
  {
    id: 'zurich',
    label: 'Zurich',
    tier: 'major',
    lat: 47.3744489,
    lon: 8.5410422,
    labelOffset: { x: 12, y: -16 },
  },
  {
    id: 'munich',
    label: 'Munich',
    tier: 'major',
    lat: 48.1371079,
    lon: 11.5753822,
    labelOffset: { x: 0, y: -18 },
    anchor: 'middle',
  },
  {
    id: 'vienna',
    label: 'Vienna',
    tier: 'capital',
    lat: 48.2083537,
    lon: 16.3725042,
    labelOffset: { x: -10, y: -18 },
    anchor: 'end',
  },
  {
    id: 'graz',
    label: 'Graz',
    tier: 'major',
    lat: 47.0708678,
    lon: 15.4382786,
    labelOffset: { x: 0, y: -16 },
    anchor: 'middle',
  },
  {
    id: 'turin',
    label: 'Turin',
    tier: 'capital',
    lat: 45.0677551,
    lon: 7.6824892,
    labelOffset: { x: -14, y: -18 },
    anchor: 'end',
  },
  {
    id: 'genoa',
    label: 'Genoa',
    tier: 'capital',
    lat: 44.40726,
    lon: 8.9338624,
    labelOffset: { x: 18, y: -10 },
  },
  {
    id: 'nice',
    label: 'Nice',
    tier: 'campaign',
    lat: 43.7009358,
    lon: 7.2683912,
    labelOffset: { x: 0, y: -16 },
    anchor: 'middle',
  },
  {
    id: 'savona',
    label: 'Savona',
    tier: 'campaign',
    lat: 44.2334238,
    lon: 8.2525727,
    labelOffset: { x: -10, y: -12 },
    anchor: 'end',
  },
  {
    id: 'sanremo',
    label: 'San Remo',
    tier: 'campaign',
    lat: 43.8171468,
    lon: 7.7778266,
    labelOffset: { x: -10, y: 12 },
    anchor: 'end',
  },
  {
    id: 'imperia',
    label: 'Imperia',
    tier: 'campaign',
    lat: 43.8871086,
    lon: 8.0300283,
    labelOffset: { x: -12, y: -10 },
    anchor: 'end',
  },
  {
    id: 'cuneo',
    label: 'Cuneo',
    tier: 'campaign',
    lat: 44.3844766,
    lon: 7.5426711,
    labelOffset: { x: -10, y: -12 },
    anchor: 'end',
  },
  {
    id: 'mondovi',
    label: 'Mondovi',
    tier: 'campaign',
    lat: 44.3962276,
    lon: 7.8174257,
    labelOffset: { x: 14, y: 8 },
  },
  {
    id: 'asti',
    label: 'Asti',
    tier: 'campaign',
    lat: 44.9009879,
    lon: 8.2064315,
    labelOffset: { x: -10, y: -12 },
    anchor: 'end',
  },
  {
    id: 'cherasco',
    label: 'Cherasco',
    tier: 'campaign',
    lat: 44.6522191,
    lon: 7.8580149,
    labelOffset: { x: 14, y: -10 },
  },
  {
    id: 'alessandria',
    label: 'Alessandria',
    tier: 'campaign',
    lat: 44.8349534,
    lon: 8.7450304,
    labelOffset: { x: -16, y: 10 },
    anchor: 'end',
  },
  {
    id: 'milan',
    label: 'Milan',
    tier: 'major',
    lat: 45.4641943,
    lon: 9.1896346,
    labelOffset: { x: -18, y: -20 },
    anchor: 'end',
  },
  {
    id: 'pavia',
    label: 'Pavia',
    tier: 'campaign',
    lat: 45.1847248,
    lon: 9.1582069,
    labelOffset: { x: -14, y: 12 },
    anchor: 'end',
  },
  {
    id: 'como',
    label: 'Como',
    tier: 'campaign',
    lat: 45.8080597,
    lon: 9.0851765,
    labelOffset: { x: 0, y: -16 },
    anchor: 'middle',
  },
  {
    id: 'bergamo',
    label: 'Bergamo',
    tier: 'campaign',
    lat: 45.7566557,
    lon: 9.7542192,
    labelOffset: { x: 12, y: -14 },
  },
  {
    id: 'brescia',
    label: 'Brescia',
    tier: 'campaign',
    lat: 45.5415526,
    lon: 10.2118019,
    labelOffset: { x: 14, y: -8 },
  },
  {
    id: 'cremona',
    label: 'Cremona',
    tier: 'campaign',
    lat: 45.1333678,
    lon: 10.0226559,
    labelOffset: { x: 18, y: 12 },
  },
  {
    id: 'piacenza',
    label: 'Piacenza',
    tier: 'campaign',
    lat: 44.8476352,
    lon: 9.6665313,
    labelOffset: { x: 16, y: 8 },
  },
  {
    id: 'parma',
    label: 'Parma',
    tier: 'campaign',
    lat: 44.801485,
    lon: 10.3279036,
    labelOffset: { x: 16, y: 18 },
  },
  {
    id: 'modena',
    label: 'Modena',
    tier: 'campaign',
    lat: 44.5384728,
    lon: 10.9359609,
    labelOffset: { x: -12, y: 16 },
    anchor: 'end',
  },
  {
    id: 'bologna',
    label: 'Bologna',
    tier: 'major',
    lat: 44.4938203,
    lon: 11.3426327,
    labelOffset: { x: 18, y: 14 },
  },
  {
    id: 'reggio-emilia',
    label: 'Reggio',
    tier: 'campaign',
    lat: 44.6989932,
    lon: 10.6296859,
    labelOffset: { x: 16, y: 12 },
  },
  {
    id: 'ferrara',
    label: 'Ferrara',
    tier: 'campaign',
    lat: 44.8354035,
    lon: 11.619787,
    labelOffset: { x: 16, y: 10 },
  },
  {
    id: 'forli',
    label: 'Forli',
    tier: 'campaign',
    lat: 44.2227398,
    lon: 12.0407312,
    labelOffset: { x: 16, y: 10 },
  },
  {
    id: 'rimini',
    label: 'Rimini',
    tier: 'campaign',
    lat: 44.0576432,
    lon: 12.5653382,
    labelOffset: { x: 16, y: 10 },
  },
  {
    id: 'mantua',
    label: 'Mantua',
    tier: 'campaign',
    lat: 45.1692628,
    lon: 10.6708365,
    labelOffset: { x: 18, y: 16 },
  },
  {
    id: 'verona',
    label: 'Verona',
    tier: 'campaign',
    lat: 45.4424977,
    lon: 10.9857377,
    labelOffset: { x: -14, y: -12 },
    anchor: 'end',
  },
  {
    id: 'vicenza',
    label: 'Vicenza',
    tier: 'campaign',
    lat: 45.5454787,
    lon: 11.5354214,
    labelOffset: { x: 16, y: -10 },
  },
  {
    id: 'trent',
    label: 'Trent',
    tier: 'campaign',
    lat: 46.0664228,
    lon: 11.1257601,
    labelOffset: { x: 14, y: -16 },
  },
  {
    id: 'innsbruck',
    label: 'Innsbruck',
    tier: 'major',
    lat: 47.2654296,
    lon: 11.3927685,
    labelOffset: { x: 0, y: -18 },
    anchor: 'middle',
  },
  {
    id: 'padua',
    label: 'Padua',
    tier: 'campaign',
    lat: 45.4077172,
    lon: 11.8734455,
    labelOffset: { x: 14, y: -14 },
  },
  {
    id: 'treviso',
    label: 'Treviso',
    tier: 'campaign',
    lat: 45.6668893,
    lon: 12.2430437,
    labelOffset: { x: 14, y: -12 },
  },
  {
    id: 'venice',
    label: 'Venice',
    tier: 'capital',
    lat: 45.4371908,
    lon: 12.3345898,
    labelOffset: { x: 14, y: 18 },
  },
  {
    id: 'rovigo',
    label: 'Rovigo',
    tier: 'campaign',
    lat: 45.0703398,
    lon: 11.7901384,
    labelOffset: { x: 14, y: 12 },
  },
  {
    id: 'udine',
    label: 'Udine',
    tier: 'campaign',
    lat: 46.0634632,
    lon: 13.2358377,
    labelOffset: { x: 14, y: -14 },
  },
  {
    id: 'trieste',
    label: 'Trieste',
    tier: 'major',
    lat: 45.6496485,
    lon: 13.7772781,
    labelOffset: { x: 16, y: 12 },
  },
  {
    id: 'leoben',
    label: 'Leoben',
    tier: 'campaign',
    lat: 47.3805128,
    lon: 15.0947756,
    labelOffset: { x: 14, y: -12 },
  },
  {
    id: 'florence',
    label: 'Florence',
    tier: 'major',
    lat: 43.7697955,
    lon: 11.2556404,
    labelOffset: { x: 18, y: -12 },
  },
  {
    id: 'massa',
    label: 'Massa',
    tier: 'campaign',
    lat: 44.0353933,
    lon: 10.1393531,
    labelOffset: { x: 16, y: -10 },
  },
  {
    id: 'lucca',
    label: 'Lucca',
    tier: 'campaign',
    lat: 43.8429193,
    lon: 10.5026977,
    labelOffset: { x: 16, y: 8 },
  },
  {
    id: 'pisa',
    label: 'Pisa',
    tier: 'campaign',
    lat: 43.7159395,
    lon: 10.4018624,
    labelOffset: { x: -10, y: 16 },
    anchor: 'end',
  },
  {
    id: 'livorno',
    label: 'Livorno',
    tier: 'campaign',
    lat: 43.548473,
    lon: 10.3105674,
    labelOffset: { x: 0, y: 16 },
    anchor: 'middle',
  },
  {
    id: 'rome',
    label: 'Rome',
    tier: 'capital',
    lat: 41.8933203,
    lon: 12.4829321,
    labelOffset: { x: 18, y: -32 },
  },
];

function placeMarker(place: TheaterPlace, x: number, y: number) {
  if (place.tier === 'capital') {
    return (
      <>
        <circle cx={x} cy={y} r={7.2} className="theater-map__marker-ring theater-map__marker-ring--capital" />
        <circle cx={x} cy={y} r={3.35} className="theater-map__marker-core theater-map__marker-core--capital" />
      </>
    );
  }

  if (place.tier === 'major') {
    return (
      <>
        <circle cx={x} cy={y} r={4.7} className="theater-map__marker-ring theater-map__marker-ring--major" />
        <circle cx={x} cy={y} r={2.05} className="theater-map__marker-core theater-map__marker-core--major" />
      </>
    );
  }

  return <circle cx={x} cy={y} r={2.35} className="theater-map__marker-core theater-map__marker-core--campaign" />;
}

export interface HistoricalItalyTheaterMapProps {
  showPoliticalOverlay?: boolean;
}

function overlayFill(theme: string, uniqueId: string) {
  const gradientByTheme: Record<string, string> = {
    'french-republic': 'french-overlay',
    'swiss-confederation': 'swiss-overlay',
    grisons: 'grisons-overlay',
    swabia: 'swabia-overlay',
    bavaria: 'bavaria-overlay',
    tyrol: 'tyrol-overlay',
    salzburg: 'salzburg-overlay',
    trent: 'trent-overlay',
    'piedmont-sardinia': 'sardinia-overlay',
    genoa: 'genoa-overlay',
    'austrian-lombardy': 'lombardy-overlay',
    parma: 'parma-overlay',
    modena: 'modena-overlay',
    'massa-carrara': 'massa-overlay',
    lucca: 'lucca-overlay',
    tuscany: 'tuscany-overlay',
    'papal-states': 'papal-overlay',
    venice: 'venice-overlay',
    'habsburg-lands': 'habsburg-overlay',
  };

  const gradient = gradientByTheme[theme];
  return gradient ? `url(#theater-map-${gradient}-${uniqueId})` : undefined;
}

export function HistoricalItalyTheaterMap({
  showPoliticalOverlay = true,
}: HistoricalItalyTheaterMapProps) {
  const uniqueId = useId().replace(/:/g, '-');
  const frameClipId = `theater-map-frame-${uniqueId}`;
  const landClipId = `theater-map-land-${uniqueId}`;
  const frameX = 38;
  const frameY = 38;
  const frameWidth = HISTORICAL_ITALY_THEATER_VIEWBOX.width - 76;
  const frameHeight = HISTORICAL_ITALY_THEATER_VIEWBOX.height - 76;
  const frameRadius = 28;
  const frameCenterX = frameX + frameWidth / 2;
  const frameCenterY = frameY + frameHeight / 2;
  const contentTransform =
    `translate(${frameCenterX.toFixed(1)} ${frameCenterY.toFixed(1)}) ` +
    `scale(0.972) translate(-${frameCenterX.toFixed(1)} -${frameCenterY.toFixed(1)})`;
  const mapTitle = showPoliticalOverlay
    ? 'Political theater map of Italy and the Army of Italy campaign corridor, 1796'
    : 'Army of Italy base map, 1796 to 1797';
  const mapDescription = showPoliticalOverlay
    ? "A historical theater map showing the principal states around Napoleon's first Italian campaign, with the city network from Paris to Vienna."
    : 'A static theater map centered on the Army of Italy campaign corridor, showing the wider city network from Paris to Vienna.';
  const sortedPlaces = [...THEATER_PLACES].sort(
    (left, right) => PLACE_TIER_ORDER[left.tier] - PLACE_TIER_ORDER[right.tier],
  );
  const sortedPoliticalOverlays = [...HISTORICAL_ITALY_POLITICAL_OVERLAYS].sort(
    (left, right) =>
      (OVERLAY_DRAW_ORDER[left.id] ?? 100) - (OVERLAY_DRAW_ORDER[right.id] ?? 100),
  );
  const lakePaths = HISTORICAL_ITALY_LAKE_PATHS.filter((d) => !d.includes('NaN'));

  return (
    <svg
      className="theater-map"
      viewBox={`0 0 ${HISTORICAL_ITALY_THEATER_VIEWBOX.width} ${HISTORICAL_ITALY_THEATER_VIEWBOX.height}`}
      role="img"
      aria-label="Base theater map of Napoleon's first Italian campaign"
    >
      <title>{mapTitle}</title>
      <desc>{mapDescription}</desc>

      <defs>
        <linearGradient id={`theater-map-paper-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4ead0" />
          <stop offset="46%" stopColor="#deca9c" />
          <stop offset="100%" stopColor="#ab7e52" />
        </linearGradient>
        <linearGradient id={`theater-map-land-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eadcbc" />
          <stop offset="56%" stopColor="#d1bd95" />
          <stop offset="100%" stopColor="#b1895e" />
        </linearGradient>
        <radialGradient id={`theater-map-sea-${uniqueId}`} cx="48%" cy="54%" r="80%">
          <stop offset="0%" stopColor="#b3bbb8" />
          <stop offset="54%" stopColor="#74868c" />
          <stop offset="100%" stopColor="#495d67" />
        </radialGradient>
        <linearGradient id={`theater-map-land-wash-${uniqueId}`} x1="12%" y1="6%" x2="88%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 247, 228, 0.34)" />
          <stop offset="46%" stopColor="rgba(240, 228, 198, 0.12)" />
          <stop offset="100%" stopColor="rgba(150, 112, 68, 0.1)" />
        </linearGradient>
        <linearGradient id={`theater-map-overlay-veil-${uniqueId}`} x1="10%" y1="4%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="rgba(248, 238, 214, 0.12)" />
          <stop offset="42%" stopColor="rgba(225, 207, 171, 0.04)" />
          <stop offset="100%" stopColor="rgba(142, 107, 73, 0.08)" />
        </linearGradient>
        <radialGradient id={`theater-map-patina-${uniqueId}`} cx="50%" cy="46%" r="82%">
          <stop offset="0%" stopColor="rgba(255, 249, 236, 0.12)" />
          <stop offset="60%" stopColor="rgba(185, 146, 94, 0.03)" />
          <stop offset="100%" stopColor="rgba(73, 50, 29, 0.18)" />
        </radialGradient>
        <linearGradient id={`theater-map-french-overlay-${uniqueId}`} x1="10%" y1="6%" x2="76%" y2="92%">
          <stop offset="0%" stopColor="#8798c2" />
          <stop offset="42%" stopColor="#5d719a" />
          <stop offset="100%" stopColor="#374861" />
        </linearGradient>
        <linearGradient id={`theater-map-swiss-overlay-${uniqueId}`} x1="14%" y1="10%" x2="86%" y2="92%">
          <stop offset="0%" stopColor="#dad2bb" />
          <stop offset="50%" stopColor="#c3b695" />
          <stop offset="100%" stopColor="#9f8d6c" />
        </linearGradient>
        <linearGradient id={`theater-map-grisons-overlay-${uniqueId}`} x1="16%" y1="12%" x2="84%" y2="88%">
          <stop offset="0%" stopColor="#c8ccc8" />
          <stop offset="54%" stopColor="#aeb3af" />
          <stop offset="100%" stopColor="#848a86" />
        </linearGradient>
        <linearGradient id={`theater-map-swabia-overlay-${uniqueId}`} x1="10%" y1="10%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#d5c5a2" />
          <stop offset="54%" stopColor="#b79f77" />
          <stop offset="100%" stopColor="#816744" />
        </linearGradient>
        <linearGradient id={`theater-map-bavaria-overlay-${uniqueId}`} x1="10%" y1="8%" x2="86%" y2="92%">
          <stop offset="0%" stopColor="#d0b37f" />
          <stop offset="52%" stopColor="#ab8849" />
          <stop offset="100%" stopColor="#6f532c" />
        </linearGradient>
        <linearGradient id={`theater-map-tyrol-overlay-${uniqueId}`} x1="12%" y1="10%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#cbc6b8" />
          <stop offset="54%" stopColor="#ada593" />
          <stop offset="100%" stopColor="#766f60" />
        </linearGradient>
        <linearGradient id={`theater-map-salzburg-overlay-${uniqueId}`} x1="14%" y1="8%" x2="88%" y2="90%">
          <stop offset="0%" stopColor="#dfd4b1" />
          <stop offset="56%" stopColor="#c5b17c" />
          <stop offset="100%" stopColor="#887145" />
        </linearGradient>
        <linearGradient id={`theater-map-trent-overlay-${uniqueId}`} x1="22%" y1="8%" x2="82%" y2="94%">
          <stop offset="0%" stopColor="#eee7d8" />
          <stop offset="58%" stopColor="#d7cebc" />
          <stop offset="100%" stopColor="#aa9d84" />
        </linearGradient>
        <linearGradient id={`theater-map-sardinia-overlay-${uniqueId}`} x1="12%" y1="10%" x2="88%" y2="88%">
          <stop offset="0%" stopColor="#d3be83" />
          <stop offset="48%" stopColor="#b18b47" />
          <stop offset="100%" stopColor="#6d512a" />
        </linearGradient>
        <linearGradient id={`theater-map-genoa-overlay-${uniqueId}`} x1="18%" y1="12%" x2="84%" y2="92%">
          <stop offset="0%" stopColor="#9faea0" />
          <stop offset="56%" stopColor="#75877b" />
          <stop offset="100%" stopColor="#55675e" />
        </linearGradient>
        <linearGradient id={`theater-map-lombardy-overlay-${uniqueId}`} x1="18%" y1="8%" x2="86%" y2="96%">
          <stop offset="0%" stopColor="#f7f2e8" />
          <stop offset="56%" stopColor="#e8dfcf" />
          <stop offset="100%" stopColor="#d0c5b6" />
        </linearGradient>
        <linearGradient id={`theater-map-parma-overlay-${uniqueId}`} x1="18%" y1="10%" x2="86%" y2="92%">
          <stop offset="0%" stopColor="#d8c89f" />
          <stop offset="54%" stopColor="#bca66f" />
          <stop offset="100%" stopColor="#8a7243" />
        </linearGradient>
        <linearGradient id={`theater-map-modena-overlay-${uniqueId}`} x1="18%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#d1a271" />
          <stop offset="54%" stopColor="#b37a48" />
          <stop offset="100%" stopColor="#724c28" />
        </linearGradient>
        <linearGradient id={`theater-map-massa-overlay-${uniqueId}`} x1="20%" y1="10%" x2="84%" y2="92%">
          <stop offset="0%" stopColor="#d0c6b4" />
          <stop offset="54%" stopColor="#b4aa95" />
          <stop offset="100%" stopColor="#877b67" />
        </linearGradient>
        <linearGradient id={`theater-map-lucca-overlay-${uniqueId}`} x1="16%" y1="14%" x2="84%" y2="88%">
          <stop offset="0%" stopColor="#dab983" />
          <stop offset="54%" stopColor="#c19256" />
          <stop offset="100%" stopColor="#815a2f" />
        </linearGradient>
        <linearGradient id={`theater-map-tuscany-overlay-${uniqueId}`} x1="16%" y1="8%" x2="86%" y2="94%">
          <stop offset="0%" stopColor="#d5ab84" />
          <stop offset="54%" stopColor="#ba7f56" />
          <stop offset="100%" stopColor="#7c4d31" />
        </linearGradient>
        <linearGradient id={`theater-map-papal-overlay-${uniqueId}`} x1="14%" y1="10%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#cca087" />
          <stop offset="54%" stopColor="#aa715c" />
          <stop offset="100%" stopColor="#71473b" />
        </linearGradient>
        <linearGradient id={`theater-map-venice-overlay-${uniqueId}`} x1="18%" y1="8%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#a9b6ae" />
          <stop offset="52%" stopColor="#80968b" />
          <stop offset="100%" stopColor="#5c7367" />
        </linearGradient>
        <linearGradient id={`theater-map-habsburg-overlay-${uniqueId}`} x1="12%" y1="6%" x2="88%" y2="92%">
          <stop offset="0%" stopColor="#fbf8f2" />
          <stop offset="52%" stopColor="#eee6da" />
          <stop offset="100%" stopColor="#d5cbbd" />
        </linearGradient>
        <radialGradient id={`theater-map-frame-shade-${uniqueId}`} cx="50%" cy="50%" r="78%">
          <stop offset="0%" stopColor="rgba(124, 90, 54, 0)" />
          <stop offset="72%" stopColor="rgba(117, 83, 49, 0.04)" />
          <stop offset="100%" stopColor="rgba(74, 50, 28, 0.3)" />
        </radialGradient>
        <filter id={`theater-map-shadow-${uniqueId}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="rgba(31, 21, 12, 0.24)" />
        </filter>
        <clipPath id={frameClipId}>
          <rect
            x={frameX}
            y={frameY}
            width={frameWidth}
            height={frameHeight}
            rx={frameRadius}
          />
        </clipPath>
        <clipPath id={landClipId} clipPathUnits="userSpaceOnUse">
          {HISTORICAL_ITALY_LAND_PATHS.map((d, index) => (
            <path key={`land-clip-${index}`} d={d} />
          ))}
        </clipPath>
      </defs>

      <rect
        x={20}
        y={20}
        width={HISTORICAL_ITALY_THEATER_VIEWBOX.width - 40}
        height={HISTORICAL_ITALY_THEATER_VIEWBOX.height - 40}
        rx={34}
        className="theater-map__mat"
      />

      <g filter={`url(#theater-map-shadow-${uniqueId})`}>
        <rect
          x={frameX}
          y={frameY}
          width={frameWidth}
          height={frameHeight}
          rx={frameRadius}
          fill={`url(#theater-map-paper-${uniqueId})`}
        />
      </g>

      <g clipPath={`url(#${frameClipId})`}>
        <rect
          x={frameX}
          y={frameY}
          width={frameWidth}
          height={frameHeight}
          fill={`url(#theater-map-sea-${uniqueId})`}
        />
        <rect
          x={frameX}
          y={frameY}
          width={frameWidth}
          height={frameHeight}
          className="theater-map__patina"
          fill={`url(#theater-map-patina-${uniqueId})`}
        />

        <g transform={contentTransform}>
          <g className="theater-map__shore-shelf">
            {HISTORICAL_ITALY_COAST_PATHS.map((d, index) => (
              <path key={`shelf-${index}`} d={d} />
            ))}
          </g>

          <g className="theater-map__land">
            {HISTORICAL_ITALY_LAND_PATHS.map((d, index) => (
              <path key={`land-${index}`} d={d} fill={`url(#theater-map-land-${uniqueId})`} />
            ))}
          </g>

          <g className="theater-map__land-wash">
            {HISTORICAL_ITALY_LAND_PATHS.map((d, index) => (
              <path key={`land-wash-${index}`} d={d} fill={`url(#theater-map-land-wash-${uniqueId})`} />
            ))}
          </g>

          <g className="theater-map__terrain">
            {TERRAIN_WASHES.map((wash) => (
              <path key={wash.id} d={areaPath(wash.points)} className={wash.className} />
            ))}
          </g>

          {showPoliticalOverlay && (
            <g className="theater-map__political-overlays" clipPath={`url(#${landClipId})`}>
              {sortedPoliticalOverlays.map((overlay) => {
                const { x, y } = project(overlay.labelPoint);
                const layout = POLITICAL_LABEL_LAYOUTS[overlay.id];
                const labelX = x + (layout?.dx ?? 0);
                const labelYBase = y + (layout?.dy ?? 0);
                const transform = overlay.labelAngle
                  ? `rotate(${overlay.labelAngle} ${labelX.toFixed(1)} ${labelYBase.toFixed(1)})`
                  : undefined;
                const lines = POLITICAL_LABEL_LINES[overlay.id] ?? [overlay.label];
                const lineHeight = layout?.lineHeight ?? 18;
                const labelY = labelYBase - ((lines.length - 1) * lineHeight) / 2;
                const showLabel = !HIDDEN_POLITICAL_LABELS.has(overlay.id);
                const variantClass = layout?.variant ? ` theater-map__political-label--${layout.variant}` : '';
                const overlayVariant = OVERLAY_VISUAL_VARIANTS[overlay.id] ?? 'minor-state';
                const fill = overlayFill(overlay.theme, uniqueId);

                return (
                  <g key={overlay.id}>
                    {overlay.paths.map((d, index) => (
                      <path
                        key={`${overlay.id}-path-${index}`}
                        d={projectGeoPathData(d)}
                        className={`theater-map__political-overlay theater-map__political-overlay--${overlay.theme} theater-map__political-overlay--${overlayVariant}`}
                        style={fill ? { fill } : undefined}
                        fillRule="evenodd"
                      />
                    ))}
                    {showLabel && (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        transform={transform}
                        className={`theater-map__political-label theater-map__political-label--${overlay.theme}${variantClass}`}
                      >
                        {lines.map((line, index) => (
                          <tspan
                            key={`${overlay.id}-label-${index}`}
                            x={labelX}
                            dy={index === 0 ? 0 : lineHeight}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          <g className="theater-map__overlay-veil">
            {HISTORICAL_ITALY_LAND_PATHS.map((d, index) => (
              <path key={`overlay-veil-${index}`} d={d} fill={`url(#theater-map-overlay-veil-${uniqueId})`} />
            ))}
          </g>

          <g className="theater-map__shore-shadow">
            {HISTORICAL_ITALY_COAST_PATHS.map((d, index) => (
              <path key={`shore-shadow-${index}`} d={d} />
            ))}
          </g>

          <g className="theater-map__coast">
            {HISTORICAL_ITALY_COAST_PATHS.map((d, index) => (
              <path key={`coast-${index}`} d={d} />
            ))}
          </g>

          <g className="theater-map__rivers">
            {HISTORICAL_ITALY_RIVER_PATHS.map((river, index) => (
              <path key={`river-${index}`} d={river.d} className={riverClassName(river.name)} />
            ))}
            {ADDITIONAL_RIVER_PATHS.map((river) => (
              <path key={`extra-river-${river.name}`} d={linePath(river.points)} className={riverClassName(river.name)} />
            ))}
            <path
              d={linePath([
                { lon: 11.75, lat: 46.05 },
                { lon: 11.73, lat: 45.84 },
                { lon: 11.7, lat: 45.67 },
                { lon: 11.62, lat: 45.46 },
              ])}
              className={riverClassName('Adige', 'theater-map__river--branch')}
            />
            <path
              d={linePath([
                { lon: 12.72, lat: 46.44 },
                { lon: 12.78, lat: 46.22 },
                { lon: 12.88, lat: 46.02 },
                { lon: 13.08, lat: 45.68 },
              ])}
              className={riverClassName('Drau', 'theater-map__river--branch theater-map__river--peripheral')}
            />
            {lakePaths.map((d, index) => (
              <path key={`lake-${index}`} d={d} className="theater-map__lake" />
            ))}
          </g>

          <g className="theater-map__water-labels">
            {WATER_LABELS.map((label) => {
              const { x, y } = project(label.point);
              const transform = label.angle ? `rotate(${label.angle} ${x.toFixed(1)} ${y.toFixed(1)})` : undefined;
              return (
                <text
                  key={label.label}
                  x={x}
                  y={y}
                  textAnchor={label.anchor ?? 'middle'}
                  transform={transform}
                  className={label.className ?? 'theater-map__water-label'}
                >
                  {label.label}
                </text>
              );
            })}
          </g>

          <g className="theater-map__places">
            {sortedPlaces.map((place) => {
              const { x, y } = project(place);
              return (
                <g key={place.id}>
                  <g className={`theater-map__marker theater-map__marker--${place.tier}`}>
                    {placeMarker(place, x, y)}
                  </g>
                  {!HIDDEN_PLACE_LABELS.has(place.id) && (
                    <text
                      x={x + place.labelOffset.x}
                      y={y + place.labelOffset.y}
                      textAnchor={place.anchor ?? 'start'}
                      className={`theater-map__place-label theater-map__place-label--${place.tier}`}
                    >
                      {place.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>

        <rect
          x={frameX}
          y={frameY}
          width={frameWidth}
          height={frameHeight}
          className="theater-map__frame-shade"
          fill={`url(#theater-map-frame-shade-${uniqueId})`}
        />
      </g>

      <rect
        x={frameX}
        y={frameY}
        width={frameWidth}
        height={frameHeight}
        rx={frameRadius}
        className="theater-map__border"
      />
      <rect
        x={50}
        y={50}
        width={frameWidth - 24}
        height={frameHeight - 24}
        rx={20}
        className="theater-map__border theater-map__border--inner"
      />
    </svg>
  );
}
