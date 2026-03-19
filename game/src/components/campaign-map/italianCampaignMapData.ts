export type ItalianCampaignChapterId =
  | 'ch1'
  | 'ch2'
  | 'ch3'
  | 'ch4'
  | 'ch5'
  | 'ch6'
  | 'ch7'
  | 'ch8'
  | 'ch9'
  | 'ch10'
  | 'ch11'
  | 'ch12'
  | 'ch13';

export type CampaignMapPlaceKind = 'city' | 'battle' | 'siege' | 'treaty';
export type CampaignMapRouteStyle = 'advance' | 'counterstroke' | 'siege' | 'diplomacy';

export interface CampaignMapGeoPoint {
  lat: number;
  lon: number;
}

export interface ItalianCampaignPlace extends CampaignMapGeoPoint {
  id: string;
  label: string;
  shortLabel?: string;
  kind: CampaignMapPlaceKind;
  context?: boolean;
  alwaysLabel?: boolean;
  chapterIds: ItalianCampaignChapterId[];
  labelOffset?: { x: number; y: number };
  labelAnchor?: 'start' | 'middle' | 'end';
}

export interface ItalianCampaignChapter {
  id: ItalianCampaignChapterId;
  number: number;
  title: string;
  dateRange: string;
  theater: string;
  summary: string;
  keySites: string[];
  route: string[];
  routeStyle?: CampaignMapRouteStyle;
}

// Place coordinates are modern coordinates for the historic towns/positions,
// used only to keep the simplified game-UI map geographically honest.
export const ITALIAN_CAMPAIGN_PLACES: ItalianCampaignPlace[] = [
  {
    id: 'marseille',
    label: 'Marseille',
    kind: 'city',
    context: true,
    lat: 43.2961743,
    lon: 5.3699525,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: -10, y: -18 },
    labelAnchor: 'end',
  },
  {
    id: 'nice',
    label: 'Nice',
    kind: 'city',
    lat: 43.7009358,
    lon: 7.2683912,
    alwaysLabel: true,
    chapterIds: ['ch1'],
    labelOffset: { x: -8, y: -16 },
    labelAnchor: 'end',
  },
  {
    id: 'savona',
    label: 'Savona',
    kind: 'city',
    lat: 44.2334238,
    lon: 8.2525727,
    alwaysLabel: true,
    chapterIds: ['ch1'],
    labelOffset: { x: -6, y: -16 },
    labelAnchor: 'end',
  },
  {
    id: 'voltri',
    label: 'Voltri',
    kind: 'battle',
    lat: 44.4285842,
    lon: 8.7542329,
    alwaysLabel: true,
    chapterIds: ['ch1'],
    labelOffset: { x: 12, y: -12 },
    labelAnchor: 'start',
  },
  {
    id: 'turin',
    label: 'Turin',
    kind: 'city',
    context: true,
    lat: 45.0677551,
    lon: 7.6824892,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: -12, y: -16 },
    labelAnchor: 'end',
  },
  {
    id: 'genoa',
    label: 'Genoa',
    kind: 'city',
    context: true,
    lat: 44.40726,
    lon: 8.9338624,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: 14, y: -16 },
    labelAnchor: 'start',
  },
  {
    id: 'montenotte',
    label: 'Montenotte',
    kind: 'battle',
    lat: 44.3889648,
    lon: 8.4011263,
    chapterIds: ['ch2'],
    labelOffset: { x: 18, y: -24 },
    labelAnchor: 'start',
  },
  {
    id: 'millesimo',
    label: 'Millesimo',
    kind: 'battle',
    lat: 44.367536,
    lon: 8.201746,
    chapterIds: ['ch2'],
    labelOffset: { x: -10, y: 18 },
    labelAnchor: 'end',
  },
  {
    id: 'dego',
    label: 'Dego',
    kind: 'battle',
    lat: 44.443038,
    lon: 8.305947,
    chapterIds: ['ch2'],
    labelOffset: { x: -18, y: -24 },
    labelAnchor: 'end',
  },
  {
    id: 'mondovi',
    label: 'Mondovi',
    kind: 'battle',
    lat: 44.3900282,
    lon: 7.8204718,
    chapterIds: ['ch3'],
    labelOffset: { x: -18, y: 28 },
    labelAnchor: 'end',
  },
  {
    id: 'cherasco',
    label: 'Cherasco',
    kind: 'city',
    lat: 44.6522191,
    lon: 7.8580149,
    chapterIds: ['ch3'],
    labelOffset: { x: 12, y: -14 },
    labelAnchor: 'start',
  },
  {
    id: 'alessandria',
    label: 'Alessandria',
    kind: 'city',
    context: true,
    lat: 44.8349534,
    lon: 8.7450304,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: -10, y: -14 },
    labelAnchor: 'end',
  },
  {
    id: 'piacenza',
    label: 'Piacenza',
    kind: 'city',
    lat: 44.8476352,
    lon: 9.6665313,
    chapterIds: ['ch4'],
    labelOffset: { x: -8, y: -14 },
    labelAnchor: 'end',
  },
  {
    id: 'fombio',
    label: 'Fombio',
    kind: 'battle',
    lat: 45.1366292,
    lon: 9.6844794,
    chapterIds: ['ch4'],
    labelOffset: { x: 12, y: 18 },
    labelAnchor: 'start',
  },
  {
    id: 'lodi',
    label: 'Lodi',
    kind: 'battle',
    lat: 45.2613104,
    lon: 9.4916781,
    alwaysLabel: true,
    chapterIds: ['ch4'],
    labelOffset: { x: -10, y: -18 },
    labelAnchor: 'end',
  },
  {
    id: 'milan',
    label: 'Milan',
    kind: 'city',
    lat: 45.4641943,
    lon: 9.1896346,
    alwaysLabel: true,
    chapterIds: ['ch4', 'ch5'],
    labelOffset: { x: -12, y: -18 },
    labelAnchor: 'end',
  },
  {
    id: 'mantua',
    label: 'Mantua',
    kind: 'siege',
    lat: 45.1692628,
    lon: 10.6708365,
    alwaysLabel: true,
    chapterIds: ['ch5', 'ch6', 'ch7', 'ch12'],
    labelOffset: { x: 12, y: -14 },
    labelAnchor: 'start',
  },
  {
    id: 'lonato',
    label: 'Lonato',
    kind: 'battle',
    lat: 45.4610389,
    lon: 10.4845346,
    chapterIds: ['ch6'],
    labelOffset: { x: -12, y: -14 },
    labelAnchor: 'end',
  },
  {
    id: 'castiglione',
    label: 'Castiglione',
    kind: 'battle',
    lat: 45.3896766,
    lon: 10.4888745,
    alwaysLabel: true,
    chapterIds: ['ch7'],
    labelOffset: { x: -18, y: 28 },
    labelAnchor: 'end',
  },
  {
    id: 'verona',
    label: 'Verona',
    kind: 'city',
    lat: 45.4424977,
    lon: 10.9857377,
    alwaysLabel: true,
    chapterIds: ['ch9', 'ch10', 'ch11'],
    labelOffset: { x: 18, y: -24 },
    labelAnchor: 'start',
  },
  {
    id: 'rovereto',
    label: 'Rovereto',
    kind: 'battle',
    lat: 45.886548,
    lon: 11.0452369,
    chapterIds: ['ch8'],
    labelOffset: { x: -12, y: -16 },
    labelAnchor: 'end',
  },
  {
    id: 'trento',
    label: 'Trent',
    shortLabel: 'Trent',
    kind: 'city',
    context: true,
    lat: 46.0664228,
    lon: 11.1257601,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: 14, y: -16 },
    labelAnchor: 'start',
  },
  {
    id: 'bassano',
    label: 'Bassano',
    kind: 'battle',
    lat: 45.7669109,
    lon: 11.7343469,
    chapterIds: ['ch8'],
    labelOffset: { x: 12, y: -14 },
    labelAnchor: 'start',
  },
  {
    id: 'caldiero',
    label: 'Caldiero',
    kind: 'battle',
    lat: 45.414388,
    lon: 11.177392,
    chapterIds: ['ch9'],
    labelOffset: { x: 24, y: -12 },
    labelAnchor: 'start',
  },
  {
    id: 'arcole',
    label: 'Arcole',
    kind: 'battle',
    lat: 45.3582108,
    lon: 11.2860916,
    alwaysLabel: true,
    chapterIds: ['ch10'],
    labelOffset: { x: 18, y: 26 },
    labelAnchor: 'start',
  },
  {
    id: 'rivoli',
    label: 'Rivoli',
    kind: 'battle',
    lat: 45.5719818,
    lon: 10.8117614,
    alwaysLabel: true,
    chapterIds: ['ch11'],
    labelOffset: { x: 16, y: -26 },
    labelAnchor: 'start',
  },
  {
    id: 'innsbruck',
    label: 'Innsbruck',
    kind: 'city',
    context: true,
    lat: 47.2654296,
    lon: 11.3927685,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: 14, y: -14 },
    labelAnchor: 'start',
  },
  {
    id: 'valvasone',
    label: 'Valvasone',
    kind: 'battle',
    lat: 45.9961488,
    lon: 12.8643951,
    chapterIds: ['ch13'],
    labelOffset: { x: -10, y: -18 },
    labelAnchor: 'end',
  },
  {
    id: 'venice',
    label: 'Venice',
    kind: 'city',
    context: true,
    lat: 45.4371908,
    lon: 12.3345898,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: 16, y: 18 },
    labelAnchor: 'start',
  },
  {
    id: 'udine',
    label: 'Udine',
    kind: 'city',
    context: true,
    lat: 46.0634632,
    lon: 13.2358377,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: 14, y: -16 },
    labelAnchor: 'start',
  },
  {
    id: 'tarvisio',
    label: 'Tarvis',
    shortLabel: 'Tarvis',
    kind: 'battle',
    lat: 46.5052624,
    lon: 13.5783734,
    chapterIds: ['ch13'],
    labelOffset: { x: 12, y: -14 },
    labelAnchor: 'start',
  },
  {
    id: 'trieste',
    label: 'Trieste',
    kind: 'city',
    context: true,
    lat: 45.6496485,
    lon: 13.7772781,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: 14, y: 18 },
    labelAnchor: 'start',
  },
  {
    id: 'leoben',
    label: 'Leoben',
    kind: 'city',
    lat: 47.3805128,
    lon: 15.0947756,
    alwaysLabel: true,
    chapterIds: ['ch13'],
    labelOffset: { x: -12, y: -16 },
    labelAnchor: 'end',
  },
  {
    id: 'vienna',
    label: 'Vienna',
    kind: 'city',
    context: true,
    lat: 48.2083537,
    lon: 16.3725042,
    alwaysLabel: true,
    chapterIds: [],
    labelOffset: { x: -12, y: -16 },
    labelAnchor: 'end',
  },
  {
    id: 'campoformio',
    label: 'Campo Formio',
    kind: 'treaty',
    lat: 46.0195268,
    lon: 13.1601994,
    chapterIds: ['ch13'],
    labelOffset: { x: 14, y: 18 },
    labelAnchor: 'start',
  },
];

export const ITALIAN_CAMPAIGN_CHAPTERS: ItalianCampaignChapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Army of Italy',
    dateRange: 'March-April 1796',
    theater: 'Ligurian Coast',
    summary:
      'Bonaparte takes command at Nice and pushes east along the Riviera. The army is still hungry, barefoot, and pinned between sea and mountains.',
    keySites: ['Nice', 'Savona', 'Voltri'],
    route: ['nice', 'savona', 'voltri'],
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Montenotte',
    dateRange: '12-15 April 1796',
    theater: 'Savona Front',
    summary:
      'The French split the Austrian and Piedmontese armies apart at Montenotte, Millesimo, and Dego, breaking open the first phase of the campaign.',
    keySites: ['Montenotte', 'Millesimo', 'Dego'],
    route: ['voltri', 'montenotte', 'millesimo', 'dego'],
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Mondovi',
    dateRange: '21-28 April 1796',
    theater: 'Piedmont',
    summary:
      'Bonaparte turns hard against Piedmont-Sardinia, wins at Mondovi, and forces the armistice of Cherasco.',
    keySites: ['Mondovi', 'Cherasco'],
    route: ['dego', 'mondovi', 'cherasco'],
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Lodi',
    dateRange: '8-10 May 1796',
    theater: 'Po Valley',
    summary:
      'The army crosses the Po near Piacenza, fights at Fombio, and storms the bridge at Lodi on the road to Milan.',
    keySites: ['Piacenza', 'Fombio', 'Lodi', 'Milan'],
    route: ['cherasco', 'piacenza', 'fombio', 'lodi', 'milan'],
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Milan',
    dateRange: 'May-June 1796',
    theater: 'Lombardy',
    summary:
      'Milan falls and the campaign broadens into occupation, requisition, and the opening investment of Mantua.',
    keySites: ['Milan', 'Mantua'],
    route: ['milan', 'mantua'],
    routeStyle: 'siege',
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Mantua Siege',
    dateRange: 'July-August 1796',
    theater: 'Lake Garda',
    summary:
      'The siege grinds on in the marshes while Wurmser descends to relieve Mantua. The fighting spreads north of the fortress at Lonato.',
    keySites: ['Mantua', 'Lonato'],
    route: ['milan', 'mantua', 'lonato'],
    routeStyle: 'siege',
  },
  {
    id: 'ch7',
    number: 7,
    title: 'Castiglione',
    dateRange: '5 August 1796',
    theater: 'South of Lake Garda',
    summary:
      'Napoleon concentrates quickly and beats Wurmser at Castiglione, preserving the siege and the French hold on Lombardy.',
    keySites: ['Castiglione', 'Mantua'],
    route: ['lonato', 'castiglione', 'mantua'],
    routeStyle: 'counterstroke',
  },
  {
    id: 'ch8',
    number: 8,
    title: 'Bassano',
    dateRange: '4-8 September 1796',
    theater: 'Adige and Brenta',
    summary:
      'The French strike north to Rovereto and then swing east through the Brenta valley to Bassano, driving Wurmser back toward Mantua.',
    keySites: ['Rovereto', 'Bassano'],
    route: ['castiglione', 'rovereto', 'bassano'],
    routeStyle: 'counterstroke',
  },
  {
    id: 'ch9',
    number: 9,
    title: 'Caldiero',
    dateRange: '12 November 1796',
    theater: 'Verona Approaches',
    summary:
      "Alvinczi's advance from the east checks the French at Caldiero in rain and mud, creating the darkest moment of the campaign.",
    keySites: ['Verona', 'Caldiero'],
    route: ['bassano', 'verona', 'caldiero'],
  },
  {
    id: 'ch10',
    number: 10,
    title: 'Arcole',
    dateRange: '15-17 November 1796',
    theater: 'Alpone Marshes',
    summary:
      'Napoleon shifts south from Verona into the marshes and dykes around Arcole, forcing a decision on the lower Adige.',
    keySites: ['Verona', 'Arcole'],
    route: ['verona', 'arcole'],
    routeStyle: 'counterstroke',
  },
  {
    id: 'ch11',
    number: 11,
    title: 'Rivoli',
    dateRange: '14-15 January 1797',
    theater: 'Rivoli Plateau',
    summary:
      "The decisive battle of the campaign. Joubert holds the plateau above the Adige long enough for Napoleon and Massena to shatter Alvinczi's army.",
    keySites: ['Rivoli', 'Verona'],
    route: ['arcole', 'verona', 'rivoli'],
    routeStyle: 'counterstroke',
  },
  {
    id: 'ch12',
    number: 12,
    title: 'Fall of Mantua',
    dateRange: '2 February 1797',
    theater: 'Mantua',
    summary:
      'With the relief army broken at Rivoli, Mantua finally surrenders. The long central objective of the campaign is secured.',
    keySites: ['Rivoli', 'Mantua'],
    route: ['rivoli', 'mantua'],
    routeStyle: 'counterstroke',
  },
  {
    id: 'ch13',
    number: 13,
    title: 'Advance on Austria',
    dateRange: 'March-April 1797',
    theater: 'Tagliamento to Leoben',
    summary:
      'The Army of Italy pushes through Friuli and the Tarvis passes into Austria itself. Leoben marks the military climax; Campo Formio is shown as the later diplomatic epilogue.',
    keySites: ['Valvasone', 'Tarvis', 'Leoben', 'Campo Formio'],
    route: ['mantua', 'valvasone', 'tarvisio', 'leoben', 'campoformio'],
    routeStyle: 'diplomacy',
  },
];

export const ITALIAN_CAMPAIGN_BOUNDS = {
  west: 5.0,
  east: 16.8,
  south: 42.8,
  north: 48.55,
} as const;

export const ITALIAN_CAMPAIGN_TERRAIN = {
  ligurianSea: [
    { lat: 45.1, lon: 5.0 },
    { lat: 44.9, lon: 5.8 },
    { lat: 44.75, lon: 6.8 },
    { lat: 44.58, lon: 7.95 },
    { lat: 44.42, lon: 8.95 },
    { lat: 44.2, lon: 9.65 },
    { lat: 42.8, lon: 10.4 },
    { lat: 42.8, lon: 5.0 },
  ],
  upperAdriatic: [
    { lat: 46.45, lon: 12.55 },
    { lat: 46.2, lon: 13.35 },
    { lat: 45.98, lon: 14.3 },
    { lat: 45.72, lon: 15.4 },
    { lat: 45.2, lon: 16.8 },
    { lat: 42.8, lon: 16.8 },
    { lat: 42.8, lon: 12.2 },
  ],
  lakeGarda: [
    { lat: 46.02, lon: 10.67 },
    { lat: 45.94, lon: 10.61 },
    { lat: 45.79, lon: 10.57 },
    { lat: 45.62, lon: 10.59 },
    { lat: 45.48, lon: 10.62 },
    { lat: 45.42, lon: 10.69 },
    { lat: 45.5, lon: 10.74 },
    { lat: 45.7, lon: 10.73 },
    { lat: 45.88, lon: 10.74 },
    { lat: 45.99, lon: 10.72 },
  ],
  poRiver: [
    { lat: 45.05, lon: 6.1 },
    { lat: 45.02, lon: 7.8 },
    { lat: 45.0, lon: 8.6 },
    { lat: 44.99, lon: 9.3 },
    { lat: 45.01, lon: 10.0 },
    { lat: 45.03, lon: 10.8 },
    { lat: 45.05, lon: 11.6 },
    { lat: 45.07, lon: 12.5 },
    { lat: 45.1, lon: 13.15 },
  ],
  adigeRiver: [
    { lat: 46.38, lon: 11.03 },
    { lat: 46.02, lon: 11.02 },
    { lat: 45.75, lon: 10.95 },
    { lat: 45.58, lon: 10.82 },
    { lat: 45.46, lon: 10.96 },
    { lat: 45.37, lon: 11.18 },
    { lat: 45.3, lon: 11.45 },
  ],
  brentaRiver: [
    { lat: 46.07, lon: 11.79 },
    { lat: 45.95, lon: 11.78 },
    { lat: 45.84, lon: 11.77 },
    { lat: 45.77, lon: 11.73 },
    { lat: 45.68, lon: 11.68 },
  ],
  tagliamentoRiver: [
    { lat: 46.42, lon: 12.7 },
    { lat: 46.23, lon: 12.76 },
    { lat: 46.05, lon: 12.84 },
    { lat: 45.86, lon: 12.96 },
    { lat: 45.66, lon: 13.06 },
  ],
  alps: [
    { lat: 47.9, lon: 5.4 },
    { lat: 47.75, lon: 6.5 },
    { lat: 47.7, lon: 7.5 },
    { lat: 47.68, lon: 8.6 },
    { lat: 47.78, lon: 9.8 },
    { lat: 47.86, lon: 10.9 },
    { lat: 47.8, lon: 12.0 },
    { lat: 47.7, lon: 13.2 },
    { lat: 47.62, lon: 14.4 },
    { lat: 47.58, lon: 15.7 },
    { lat: 47.52, lon: 16.6 },
  ],
  apennines: [
    { lat: 44.95, lon: 6.35 },
    { lat: 44.7, lon: 7.7 },
    { lat: 44.62, lon: 8.25 },
    { lat: 44.66, lon: 8.9 },
    { lat: 44.82, lon: 9.65 },
    { lat: 44.92, lon: 10.35 },
    { lat: 44.98, lon: 11.1 },
  ],
  arcoleMarsh: [
    { lat: 45.43, lon: 11.09 },
    { lat: 45.44, lon: 11.23 },
    { lat: 45.39, lon: 11.36 },
    { lat: 45.3, lon: 11.33 },
    { lat: 45.29, lon: 11.14 },
  ],
} as const;

export function getItalianCampaignChapter(
  chapterId: ItalianCampaignChapterId,
): ItalianCampaignChapter {
  return (
    ITALIAN_CAMPAIGN_CHAPTERS.find((chapter) => chapter.id === chapterId) ??
    ITALIAN_CAMPAIGN_CHAPTERS[0]
  );
}

export function getItalianCampaignChapterFromValue(
  value: string | null | undefined,
): ItalianCampaignChapterId {
  if (!value) return 'ch11';

  const lowered = value.toLowerCase();
  const asNumber = Number.parseInt(lowered, 10);
  if (Number.isFinite(asNumber) && asNumber >= 1 && asNumber <= 13) {
    return `ch${asNumber}` as ItalianCampaignChapterId;
  }

  const byId = ITALIAN_CAMPAIGN_CHAPTERS.find((chapter) => chapter.id === lowered);
  return byId?.id ?? 'ch11';
}

export function inferItalianCampaignChapter(options: {
  battleId?: string | null;
  campId?: string | null;
  location?: string | null;
}): ItalianCampaignChapterId {
  const battleId = options.battleId?.toLowerCase() ?? '';
  const campId = options.campId?.toLowerCase() ?? '';
  const location = options.location?.toLowerCase() ?? '';

  if (campId === 'voltri-garrison' || battleId === 'voltri' || location.includes('voltri')) {
    return 'ch1';
  }
  if (battleId === 'montenotte' || location.includes('montenotte')) return 'ch2';
  if (battleId === 'lodi' || location.includes('lodi')) return 'ch4';
  if (battleId === 'castiglione' || location.includes('castiglione')) return 'ch7';
  if (battleId === 'arcole' || location.includes('arcole')) return 'ch10';
  if (campId === 'after-rivoli' || battleId === 'mantua' || location.includes('mantua')) {
    return 'ch12';
  }
  if (campId === 'eve-of-rivoli' || battleId === 'rivoli' || location.includes('rivoli')) {
    return 'ch11';
  }
  return 'ch1';
}



