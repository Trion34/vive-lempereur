import historicalItalyPoliticalOverlays from './historicalItalyPoliticalOverlays.json';
import historicalItalyWiderPoliticalOverlays from './historicalItalyWiderPoliticalOverlays.json';

type ItalianStateOverlayId =
  | 'piedmont-sardinia'
  | 'republic-of-genoa'
  | 'austrian-lombardy'
  | 'grisons'
  | 'republic-of-venice'
  | 'mantua-enclave'
  | 'duchy-of-parma'
  | 'duchy-of-modena'
  | 'duchy-of-massa-carrara'
  | 'republic-of-lucca'
  | 'grand-duchy-of-tuscany'
  | 'papal-states';

type WiderTheaterOverlayId =
  | 'swabian-states'
  | 'electorate-of-bavaria'
  | 'county-of-tyrol'
  | 'archbishopric-of-salzburg'
  | 'bishopric-of-trent';

type GeoJsonPosition = [number, number];
type GeoJsonPolygon = GeoJsonPosition[][];
type GeoJsonMultiPolygon = GeoJsonPosition[][][];

type ImportedItalianStateGeometry =
  | {
      type: 'Polygon';
      coordinates: GeoJsonPolygon;
    }
  | {
      type: 'MultiPolygon';
      coordinates: GeoJsonMultiPolygon;
    };

type ImportedOverlayFeature<TId extends string> = {
  properties: {
    id: TId;
  };
  geometry: ImportedItalianStateGeometry;
};

function ringToPath(ring: GeoJsonPosition[]) {
  return ring
    .map(([lon, lat], index) => `${index === 0 ? 'M' : 'L'} ${lon.toFixed(3)} ${lat.toFixed(3)}`)
    .join(' ')
    .concat(' Z');
}

function geometryToPaths(geometry: ImportedItalianStateGeometry) {
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates.map(ringToPath).join(' ')];
  }

  return geometry.coordinates.map((polygon) => polygon.map(ringToPath).join(' '));
}

const HISTORICAL_ITALY_IMPORTED_STATE_PATHS = Object.fromEntries(
  (historicalItalyPoliticalOverlays.features as unknown as ImportedOverlayFeature<ItalianStateOverlayId>[]).map((feature) => [
    feature.properties.id,
    geometryToPaths(feature.geometry),
  ])
) as Record<ItalianStateOverlayId, string[]>;

const HISTORICAL_ITALY_WIDER_OVERLAY_PATHS = Object.fromEntries(
  (
    historicalItalyWiderPoliticalOverlays.features as unknown as ImportedOverlayFeature<WiderTheaterOverlayId>[]
  ).map((feature) => [feature.properties.id, geometryToPaths(feature.geometry)])
) as Record<WiderTheaterOverlayId, string[]>;

// Modern province dissolves get most Italian state lines close quickly, but the
// Venetian Crema district needs a manual correction to match the 1796 frontier.
const CREMA_DISTRICT_PATH =
  'M 9.410 45.548 L 9.585 45.566 L 9.775 45.540 L 9.910 45.460 L 9.908 45.318 L 9.828 45.242 L 9.676 45.206 L 9.506 45.230 L 9.414 45.324 L 9.394 45.448 L 9.410 45.548 Z';

// The Alpine frontier is the weakest fit for modern administrative dissolves, so
// the Tridentine corridor uses a small hand-corrected period-map-inspired path.
const BISHOPRIC_OF_TRENT_HISTORICAL_PATHS = [
  'M 10.640 45.694 L 10.814 45.930 L 10.910 46.174 L 11.056 46.392 L 11.268 46.442 L 11.404 46.320 L 11.448 46.064 L 11.438 45.834 L 11.308 45.668 L 11.066 45.626 L 10.824 45.640 L 10.640 45.694 Z',
];

export type PoliticalLabelPoint = {
  lon: number;
  lat: number;
};

export type HistoricalItalyPoliticalOverlay = {
  id: string;
  theme: string;
  label: string;
  labelPoint: PoliticalLabelPoint;
  labelAngle?: number;
  paths: string[];
};

export const HISTORICAL_ITALY_POLITICAL_OVERLAYS: HistoricalItalyPoliticalOverlay[] = [
  {
    id: 'french-republic',
    theme: 'french-republic',
    label: "French Republic",
    labelPoint: {
      lon: 4.7,
      lat: 46.65
    },
    labelAngle: -18,
    paths: [
      "M 9.5 42.8 L 9.5 43.0 L 9.3 42.9 L 9.3 42.8 L 9.1 42.7 L 9.0 42.7 L 8.7 42.5 L 8.6 42.2 L 8.7 42.1 L 8.6 42.0 L 8.7 41.9 L 8.7 41.8 L 8.9 41.7 L 8.8 41.6 L 8.9 41.5 L 9.2 41.4 L 9.4 41.7 L 9.4 41.9 L 9.6 42.1 L 9.5 42.6 L 9.5 42.7 L 9.5 42.8 Z",
      "M 7.6 47.6 L 7.5 47.7 L 7.6 47.9 L 7.6 48.1 L 7.7 48.3 L 7.8 48.6 L 8.1 48.9 L 8.1 49.0 L 7.6 49.1 L 7.5 49.2 L 7.0 49.1 L 6.9 49.2 L 6.7 49.2 L 6.5 49.4 L 6.4 49.5 L 6.0 49.5 L 1.8 49.5 L 1.8 42.5 L 2.0 42.4 L 2.2 42.4 L 2.6 42.3 L 3.0 42.5 L 3.2 42.5 L 3.1 42.6 L 3.1 42.9 L 3.3 43.2 L 3.8 43.5 L 3.9 43.6 L 4.1 43.6 L 4.2 43.5 L 4.6 43.4 L 4.8 43.4 L 5.1 43.4 L 5.1 43.3 L 5.3 43.3 L 5.4 43.2 L 5.7 43.2 L 5.8 43.1 L 6.1 43.1 L 6.5 43.2 L 6.7 43.3 L 6.7 43.4 L 6.9 43.4 L 7.2 43.7 L 7.5 43.8 L 7.5 43.9 L 7.7 44.0 L 7.6 44.2 L 7.3 44.1 L 7.3 44.1 L 7.2 44.2 L 7.2 44.2 L 7.2 44.2 L 7.1 44.2 L 7.1 44.2 L 7.1 44.2 L 7.1 44.2 L 7.1 44.2 L 7.0 44.3 L 6.9 44.4 L 6.9 44.4 L 6.9 44.5 L 6.9 44.5 L 7.0 44.7 L 7.0 44.7 L 7.0 44.7 L 7.0 44.7 L 7.0 44.8 L 7.0 44.8 L 6.9 44.9 L 6.8 44.9 L 6.8 44.9 L 6.8 44.9 L 6.8 44.9 L 6.8 44.9 L 6.7 45.0 L 6.7 45.0 L 6.6 45.1 L 6.6 45.1 L 6.7 45.1 L 6.7 45.1 L 6.7 45.1 L 6.7 45.1 L 6.8 45.1 L 6.8 45.1 L 6.9 45.2 L 6.9 45.2 L 7.0 45.2 L 7.0 45.2 L 7.0 45.2 L 7.0 45.2 L 7.2 45.4 L 7.1 45.5 L 7.0 45.5 L 7.0 45.5 L 7.0 45.5 L 7.0 45.5 L 7.0 45.5 L 6.8 45.7 L 6.8 45.8 L 6.9 45.8 L 6.9 45.8 L 6.9 45.8 L 7.0 45.9 L 6.8 46.2 L 6.8 46.3 L 6.8 46.4 L 6.4 46.4 L 6.2 46.3 L 6.3 46.3 L 6.1 46.1 L 6.1 46.4 L 6.2 46.6 L 6.4 46.8 L 6.5 46.9 L 6.6 47.0 L 7.0 47.3 L 6.9 47.4 L 7.1 47.5 L 7.2 47.4 L 7.4 47.5 L 7.6 47.6 Z"
    ]
  },
  {
    id: 'swiss-confederation',
    theme: 'swiss-confederation',
    label: "Swiss Confederation",
    labelPoint: {
      lon: 7.8,
      lat: 46.8
    },
    labelAngle: -8,
    paths: [
      "M 9.5 47.5 L 9.2 47.7 L 8.9 47.7 L 8.6 47.8 L 8.4 47.7 L 8.4 47.6 L 8.2 47.6 L 7.9 47.6 L 7.6 47.6 L 7.4 47.5 L 7.2 47.4 L 7.1 47.5 L 6.9 47.4 L 7.0 47.3 L 6.6 47.0 L 6.5 46.9 L 6.4 46.8 L 6.2 46.6 L 6.1 46.4 L 6.1 46.1 L 6.3 46.3 L 6.2 46.3 L 6.4 46.4 L 6.8 46.4 L 6.8 46.3 L 6.8 46.2 L 7.0 45.9 L 7.0 45.9 L 7.1 45.9 L 7.3 45.9 L 7.3 45.9 L 7.5 46.0 L 7.6 46.0 L 7.6 46.0 L 7.7 45.9 L 7.7 45.9 L 7.8 45.9 L 7.9 46.0 L 8.0 46.0 L 8.0 46.1 L 8.1 46.1 L 8.1 46.3 L 8.1 46.3 L 8.1 46.3 L 8.2 46.3 L 8.3 46.4 L 8.4 46.3 L 8.4 46.3 L 8.5 46.3 L 8.5 46.2 L 8.5 46.2 L 8.5 46.2 L 8.6 46.1 L 8.6 46.1 L 8.7 46.1 L 8.8 46.0 L 8.8 46.0 L 8.9 45.9 L 8.9 45.8 L 9.0 45.8 L 9.0 45.8 L 9.0 45.8 L 9.0 45.9 L 9.0 45.9 L 9.0 46.0 L 9.0 46.0 L 9.0 46.0 L 9.0 46.1 L 9.1 46.1 L 9.1 46.1 L 9.3 46.3 L 9.3 46.4 L 9.3 46.5 L 9.3 46.5 L 9.4 46.5 L 9.4 46.5 L 9.4 46.5 L 9.4 46.5 L 9.5 46.4 L 9.5 46.4 L 9.6 46.3 L 9.7 46.3 L 9.8 46.3 L 9.8 46.4 L 9.9 46.4 L 9.9 46.4 L 10.0 46.3 L 10.0 46.3 L 10.1 46.2 L 10.1 46.3 L 10.1 46.4 L 10.1 46.4 L 10.1 46.4 L 10.1 46.4 L 10.1 46.4 L 10.1 46.4 L 10.0 46.5 L 10.0 46.5 L 10.0 46.5 L 10.1 46.5 L 10.1 46.5 L 10.1 46.6 L 10.1 46.6 L 10.2 46.6 L 10.2 46.6 L 10.3 46.6 L 10.3 46.6 L 10.3 46.5 L 10.4 46.5 L 10.4 46.5 L 10.4 46.5 L 10.4 46.6 L 10.4 46.7 L 10.4 46.7 L 10.4 46.7 L 10.4 46.8 L 10.4 46.8 L 10.5 46.9 L 10.3 47.0 L 10.2 46.9 L 10.0 46.9 L 9.8 47.0 L 9.6 47.1 L 9.5 47.1 L 9.5 47.3 L 9.6 47.5 L 9.5 47.5 Z"
    ]
  },
  {
    id: 'grisons',
    theme: 'grisons',
    label: 'Grisons',
    labelPoint: {
      lon: 9.55,
      lat: 46.35
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['grisons']
  },
  {
    id: 'swabian-states',
    theme: 'swabia',
    label: 'Swabian States',
    labelPoint: {
      lon: 8.55,
      lat: 48.2
    },
    labelAngle: -14,
    paths: HISTORICAL_ITALY_WIDER_OVERLAY_PATHS['swabian-states']
  },
  {
    id: 'electorate-of-bavaria',
    theme: 'bavaria',
    label: 'Electorate of Bavaria',
    labelPoint: {
      lon: 11.35,
      lat: 48.27
    },
    labelAngle: 12,
    paths: HISTORICAL_ITALY_WIDER_OVERLAY_PATHS['electorate-of-bavaria']
  },
  {
    id: 'county-of-tyrol',
    theme: 'tyrol',
    label: 'County of Tyrol',
    labelPoint: {
      lon: 11.15,
      lat: 46.95
    },
    labelAngle: 18,
    paths: HISTORICAL_ITALY_WIDER_OVERLAY_PATHS['county-of-tyrol']
  },
  {
    id: 'archbishopric-of-salzburg',
    theme: 'salzburg',
    label: 'Archbishopric of Salzburg',
    labelPoint: {
      lon: 13.05,
      lat: 47.46
    },
    labelAngle: 22,
    paths: HISTORICAL_ITALY_WIDER_OVERLAY_PATHS['archbishopric-of-salzburg']
  },
  {
    id: 'bishopric-of-trent',
    theme: 'trent',
    label: 'Bishopric of Trent',
    labelPoint: {
      lon: 11.12,
      lat: 46.12
    },
    labelAngle: -66,
    paths: BISHOPRIC_OF_TRENT_HISTORICAL_PATHS
  },
  {
    id: 'piedmont-sardinia',
    theme: 'piedmont-sardinia',
    label: 'Kingdom of Sardinia',
    labelPoint: {
      lon: 7.5,
      lat: 45.05
    },
    labelAngle: -18,
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['piedmont-sardinia']
  },
  {
    id: 'republic-of-genoa',
    theme: 'genoa',
    label: "Republic of Genoa",
    labelPoint: {
      lon: 8.95,
      lat: 44.34
    },
    labelAngle: 8,
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['republic-of-genoa']
  },
  {
    id: 'austrian-lombardy',
    theme: 'austrian-lombardy',
    label: "Duchy of Milan",
    labelPoint: {
      lon: 9.52,
      lat: 45.37
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['austrian-lombardy']
  },
  {
    id: 'mantua-enclave',
    theme: 'austrian-lombardy',
    label: "Mantua",
    labelPoint: {
      lon: 10.75,
      lat: 45.16
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['mantua-enclave']
  },
  {
    id: 'duchy-of-parma',
    theme: 'parma',
    label: "Duchy of Parma",
    labelPoint: {
      lon: 10,
      lat: 44.95
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['duchy-of-parma']
  },
  {
    id: 'duchy-of-modena',
    theme: 'modena',
    label: "Duchy of Modena",
    labelPoint: {
      lon: 10.72,
      lat: 44.73
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['duchy-of-modena']
  },
  {
    id: 'duchy-of-massa-carrara',
    theme: 'massa-carrara',
    label: "Duchy of Massa and Carrara",
    labelPoint: {
      lon: 10.11,
      lat: 44.06
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['duchy-of-massa-carrara']
  },
  {
    id: 'republic-of-lucca',
    theme: 'lucca',
    label: "Republic of Lucca",
    labelPoint: {
      lon: 10.47,
      lat: 43.87
    },
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['republic-of-lucca']
  },
  {
    id: 'grand-duchy-of-tuscany',
    theme: 'tuscany',
    label: "Grand Duchy of Tuscany",
    labelPoint: {
      lon: 10.75,
      lat: 43.35
    },
    labelAngle: -16,
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['grand-duchy-of-tuscany']
  },
  {
    id: 'papal-states',
    theme: 'papal-states',
    label: "Papal States",
    labelPoint: {
      lon: 12.05,
      lat: 42.9
    },
    labelAngle: 10,
    paths: HISTORICAL_ITALY_IMPORTED_STATE_PATHS['papal-states']
  },
  {
    id: 'republic-of-venice',
    theme: 'venice',
    label: "Republic of Venice",
    labelPoint: {
      lon: 12.2,
      lat: 45.55
    },
    labelAngle: 20,
    paths: [...HISTORICAL_ITALY_IMPORTED_STATE_PATHS['republic-of-venice'], CREMA_DISTRICT_PATH]
  },
  {
    id: 'habsburg-lands',
    theme: 'habsburg-lands',
    label: "Habsburg Lands",
    labelPoint: {
      lon: 13.9,
      lat: 47.35
    },
    labelAngle: 18,
    paths: [
      "M 9.5 47.3 L 9.6 47.1 L 9.8 47.0 L 10.0 46.9 L 10.2 46.9 L 10.3 47.0 L 10.5 46.9 L 10.5 46.9 L 10.5 46.9 L 10.6 46.9 L 10.7 46.8 L 10.8 46.8 L 10.8 46.8 L 10.8 46.8 L 10.9 46.8 L 10.9 46.8 L 11.0 46.8 L 11.1 46.9 L 11.1 46.9 L 11.2 46.9 L 11.2 47.0 L 11.3 47.0 L 11.4 47.0 L 11.4 47.0 L 11.5 47.0 L 11.6 47.0 L 11.7 47.0 L 11.8 47.0 L 11.8 47.0 L 11.9 47.0 L 11.9 47.0 L 11.9 47.0 L 12.0 47.0 L 12.0 47.1 L 12.1 47.1 L 12.1 47.1 L 12.2 47.0 L 12.1 47.0 L 12.1 47.0 L 12.1 47.0 L 12.2 46.9 L 12.2 46.9 L 12.2 46.9 L 12.2 46.9 L 12.3 46.8 L 12.3 46.8 L 12.5 46.7 L 12.5 46.7 L 12.6 46.7 L 12.7 46.6 L 12.7 46.6 L 12.8 46.6 L 12.9 46.6 L 12.9 46.6 L 13.0 46.6 L 13.2 46.6 L 13.2 46.6 L 13.2 46.6 L 13.3 46.6 L 13.5 46.6 L 13.5 46.5 L 13.6 46.5 L 13.6 46.5 L 13.7 46.5 L 13.7 46.5 L 13.7 46.5 L 13.6 46.4 L 13.6 46.4 L 13.5 46.4 L 13.4 46.3 L 13.4 46.3 L 13.4 46.3 L 13.4 46.2 L 13.4 46.2 L 13.6 46.2 L 13.6 46.2 L 13.5 46.1 L 13.5 46.0 L 13.5 46.0 L 13.5 46.0 L 13.5 46.0 L 13.6 46.0 L 13.6 45.9 L 13.6 45.8 L 13.6 45.8 L 13.6 45.8 L 13.8 45.7 L 13.8 45.6 L 13.6 45.5 L 13.9 45.4 L 14.1 45.5 L 14.4 45.5 L 14.5 45.6 L 14.7 45.5 L 15.1 45.5 L 15.3 45.5 L 15.3 45.7 L 15.6 45.8 L 15.7 46.0 L 15.6 46.2 L 16.2 46.4 L 16.2 46.5 L 16.4 46.6 L 16.3 46.9 L 16.1 46.9 L 16.3 47.0 L 16.5 47.0 L 16.5 47.1 L 16.4 47.2 L 16.4 47.4 L 16.6 47.4 L 16.6 47.6 L 16.4 47.7 L 16.6 47.7 L 16.7 47.7 L 17.1 47.7 L 17.0 47.8 L 17.1 48.0 L 17.0 48.2 L 16.9 48.4 L 17.0 48.6 L 16.9 48.7 L 16.5 48.8 L 16.4 48.7 L 16.1 48.8 L 15.8 48.9 L 15.7 48.9 L 15.3 49.0 L 15.0 49.0 L 14.9 48.8 L 14.8 48.8 L 14.7 48.6 L 14.5 48.6 L 14.4 48.6 L 14.0 48.6 L 14.0 48.7 L 13.8 48.8 L 13.8 48.6 L 13.7 48.5 L 13.5 48.6 L 13.4 48.4 L 12.8 48.2 L 12.8 48.1 L 13.0 47.9 L 12.9 47.7 L 13.0 47.7 L 13.0 47.5 L 12.8 47.6 L 12.7 47.7 L 12.5 47.6 L 12.2 47.7 L 12.2 47.6 L 11.7 47.6 L 11.4 47.5 L 11.3 47.4 L 11.0 47.4 L 10.9 47.5 L 10.4 47.5 L 10.3 47.3 L 10.1 47.4 L 10.0 47.5 L 9.7 47.6 L 9.5 47.5 L 9.6 47.5 L 9.5 47.3 Z",
      "M 10.6 46.4 L 10.5 46.3 L 10.6 46.2 L 10.5 46.0 L 10.6 45.8 L 10.8 45.8 L 10.9 45.7 L 11.1 45.7 L 11.3 45.9 L 11.5 46.0 L 11.7 46.0 L 11.7 46.1 L 11.9 46.1 L 11.8 46.3 L 11.8 46.5 L 12.1 46.6 L 12.4 46.6 L 12.5 46.7 L 12.5 46.7 L 12.3 46.8 L 12.3 46.8 L 12.2 46.9 L 12.2 46.9 L 12.2 46.9 L 12.2 46.9 L 12.1 47.0 L 12.1 47.0 L 12.1 47.0 L 12.2 47.0 L 12.1 47.1 L 12.1 47.1 L 12.0 47.1 L 12.0 47.0 L 11.9 47.0 L 11.9 47.0 L 11.9 47.0 L 11.8 47.0 L 11.8 47.0 L 11.7 47.0 L 11.6 47.0 L 11.5 47.0 L 11.4 47.0 L 11.4 47.0 L 11.3 47.0 L 11.2 47.0 L 11.2 46.9 L 11.1 46.9 L 11.1 46.9 L 11.0 46.8 L 10.9 46.8 L 10.9 46.8 L 10.8 46.8 L 10.8 46.8 L 10.8 46.8 L 10.7 46.8 L 10.6 46.9 L 10.5 46.9 L 10.5 46.9 L 10.4 46.8 L 10.4 46.8 L 10.4 46.7 L 10.4 46.7 L 10.4 46.7 L 10.4 46.6 L 10.5 46.5 L 10.6 46.4 Z",
      "M 13.5 46.1 L 13.4 45.9 L 13.4 45.8 L 13.2 45.7 L 13.4 45.7 L 13.5 45.8 L 13.6 45.8 L 13.7 45.7 L 13.7 45.7 L 13.7 45.7 L 13.8 45.6 L 13.8 45.6 L 13.8 45.6 L 13.8 45.6 L 13.8 45.6 L 13.8 45.6 L 13.8 45.6 L 13.9 45.6 L 13.6 45.8 L 13.6 45.8 L 13.6 45.8 L 13.6 45.8 L 13.6 45.9 L 13.6 46.0 L 13.5 46.0 L 13.5 46.0 L 13.5 46.0 L 13.5 46.0 L 13.5 46.1 Z"
    ]
  }
] as const;
