import type { ItalianCampaignChapterId } from '../../../../game/src/components/campaign-map/italianCampaignMapData';

// ============================================================
// TYPES
// ============================================================

export interface ArmyMarker {
  faction: 'french' | 'austrian' | 'piedmontese';
  label: string;
  commander?: string;
  lat: number;
  lon: number;
  size: 'small' | 'large';
  labelSide: 'left' | 'right';
}

export interface TerritoryOverlay {
  colorKey: string;
  label?: string;
  labelPos?: { lat: number; lon: number };
  /** Array of polygon boundaries (each polygon is an array of geo points) */
  bounds: Array<Array<{ lat: number; lon: number }>>;
}

export interface ChapterOverlay {
  armies: ArmyMarker[];
  territories: TerritoryOverlay[];
  notes?: string;
}

// ============================================================
// SIMPLIFIED TERRITORY POLYGONS
// These are rough political boundaries for overlay visualization.
// Not GIS-precise — stylized for a game map.
// ============================================================

// French Republic (southeast France)
const FRANCE_POLY = [
  { lat: 48.55, lon: 5.0 }, { lat: 48.55, lon: 7.5 }, { lat: 47.5, lon: 7.5 },
  { lat: 46.5, lon: 6.8 }, { lat: 46.2, lon: 6.1 }, { lat: 45.9, lon: 5.8 },
  { lat: 45.2, lon: 6.0 }, { lat: 44.85, lon: 6.3 }, { lat: 44.6, lon: 7.0 },
  { lat: 43.7, lon: 7.3 }, { lat: 43.3, lon: 5.4 }, { lat: 43.5, lon: 5.0 },
];

// Kingdom of Sardinia-Piedmont
const PIEDMONT_POLY = [
  { lat: 46.5, lon: 6.8 }, { lat: 46.4, lon: 7.8 }, { lat: 46.1, lon: 8.2 },
  { lat: 45.9, lon: 8.6 }, { lat: 45.5, lon: 8.8 }, { lat: 45.0, lon: 8.5 },
  { lat: 44.6, lon: 8.0 }, { lat: 44.6, lon: 7.0 }, { lat: 44.85, lon: 6.3 },
  { lat: 45.2, lon: 6.0 }, { lat: 45.9, lon: 5.8 }, { lat: 46.2, lon: 6.1 },
];

// Republic of Genoa
const GENOA_POLY = [
  { lat: 44.6, lon: 7.0 }, { lat: 44.6, lon: 8.0 }, { lat: 44.5, lon: 8.8 },
  { lat: 44.45, lon: 9.4 }, { lat: 44.3, lon: 9.8 }, { lat: 44.1, lon: 9.5 },
  { lat: 43.9, lon: 9.0 }, { lat: 44.0, lon: 8.2 }, { lat: 44.1, lon: 7.5 },
  { lat: 44.3, lon: 7.0 },
];

// Austrian Lombardy (Milan-centered)
const LOMBARDY_POLY = [
  { lat: 46.1, lon: 8.2 }, { lat: 46.5, lon: 9.2 }, { lat: 46.6, lon: 10.0 },
  { lat: 46.3, lon: 10.5 }, { lat: 45.8, lon: 10.5 }, { lat: 45.4, lon: 10.6 },
  { lat: 45.0, lon: 10.6 }, { lat: 44.9, lon: 10.0 }, { lat: 44.8, lon: 9.4 },
  { lat: 45.0, lon: 8.5 }, { lat: 45.5, lon: 8.8 }, { lat: 45.9, lon: 8.6 },
];

// Republic of Venice (mainland)
const VENICE_POLY = [
  { lat: 46.3, lon: 10.5 }, { lat: 46.6, lon: 11.5 }, { lat: 46.6, lon: 12.5 },
  { lat: 46.2, lon: 13.3 }, { lat: 45.7, lon: 13.0 }, { lat: 45.4, lon: 12.3 },
  { lat: 45.0, lon: 11.8 }, { lat: 45.0, lon: 11.0 }, { lat: 45.0, lon: 10.6 },
  { lat: 45.4, lon: 10.6 }, { lat: 45.8, lon: 10.5 },
];

// Tyrol (Austrian, north of Venice/Lombardy)
const TYROL_POLY = [
  { lat: 47.5, lon: 10.0 }, { lat: 47.5, lon: 12.0 }, { lat: 47.0, lon: 12.5 },
  { lat: 46.6, lon: 12.5 }, { lat: 46.6, lon: 11.5 }, { lat: 46.6, lon: 10.0 },
  { lat: 46.3, lon: 10.5 }, { lat: 46.5, lon: 9.2 }, { lat: 47.0, lon: 9.5 },
];

// Austrian core (east of Alps)
const AUSTRIA_POLY = [
  { lat: 48.55, lon: 12.0 }, { lat: 48.55, lon: 16.8 }, { lat: 47.5, lon: 16.8 },
  { lat: 46.8, lon: 16.0 }, { lat: 46.5, lon: 14.5 }, { lat: 46.5, lon: 13.5 },
  { lat: 47.0, lon: 12.5 }, { lat: 47.5, lon: 12.0 },
];

// Papal States (south, mostly off-map but visible edge)
const PAPAL_POLY = [
  { lat: 44.3, lon: 9.8 }, { lat: 44.8, lon: 10.0 }, { lat: 44.9, lon: 10.6 },
  { lat: 44.8, lon: 11.5 }, { lat: 44.5, lon: 12.2 }, { lat: 43.5, lon: 12.2 },
  { lat: 42.8, lon: 12.2 }, { lat: 42.8, lon: 10.4 }, { lat: 43.2, lon: 10.0 },
  { lat: 43.8, lon: 9.6 },
];

// Swiss Confederation
const SWISS_POLY = [
  { lat: 47.5, lon: 7.5 }, { lat: 47.5, lon: 10.0 }, { lat: 47.0, lon: 9.5 },
  { lat: 46.5, lon: 9.2 }, { lat: 46.1, lon: 8.2 }, { lat: 46.4, lon: 7.8 },
  { lat: 46.5, lon: 6.8 },
];

// Duchy of Modena
const MODENA_POLY = [
  { lat: 44.8, lon: 10.0 }, { lat: 44.9, lon: 10.6 }, { lat: 44.8, lon: 11.0 },
  { lat: 44.5, lon: 11.0 }, { lat: 44.3, lon: 10.5 }, { lat: 44.3, lon: 9.8 },
];

// ============================================================
// CHAPTER OVERLAYS
// ============================================================

export const CHAPTER_OVERLAYS: Record<ItalianCampaignChapterId, ChapterOverlay> = {
  // ── Ch 1: Voltri & Opening ──
  ch1: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 } },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'austrian-lombardy', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 } },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      // French
      { faction: 'french', label: 'ARMY OF ITALY', commander: 'Bonaparte', lat: 43.7, lon: 7.3, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 44.2, lon: 8.0, size: 'small', labelSide: 'right' },
      { faction: 'french', label: 'Augereau', lat: 44.1, lon: 7.5, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'La Harpe', lat: 44.3, lon: 8.3, size: 'small', labelSide: 'right' },
      { faction: 'french', label: 'Sérurier', lat: 44.0, lon: 7.0, size: 'small', labelSide: 'left' },
      // Austrian
      { faction: 'austrian', label: 'Beaulieu', commander: 'Austrian Main', lat: 44.9, lon: 8.8, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Argenteau', lat: 44.5, lon: 8.5, size: 'small', labelSide: 'right' },
      // Piedmontese
      { faction: 'piedmontese', label: 'Colli', commander: 'Piedmontese', lat: 44.5, lon: 7.6, size: 'large', labelSide: 'left' },
    ],
  },

  // ── Ch 2: Montenotte ──
  ch2: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 } },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'austrian-lombardy', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 } },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'HQ at Savona', lat: 44.25, lon: 8.25, size: 'large', labelSide: 'right' },
      { faction: 'french', label: 'Masséna', lat: 44.4, lon: 8.4, size: 'small', labelSide: 'right' },
      { faction: 'french', label: 'Augereau', lat: 44.35, lon: 8.1, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'La Harpe', lat: 44.45, lon: 8.5, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Argenteau', commander: 'Retreating', lat: 44.5, lon: 8.6, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Beaulieu', lat: 45.0, lon: 9.0, size: 'large', labelSide: 'right' },
      { faction: 'piedmontese', label: 'Colli', commander: 'Separated', lat: 44.5, lon: 7.5, size: 'large', labelSide: 'left' },
    ],
  },

  // ── Ch 3: Mondovi & Cherasco Armistice ──
  ch3: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 } },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'austrian-lombardy', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 } },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Pursuing Colli', lat: 44.5, lon: 7.8, size: 'large', labelSide: 'right' },
      { faction: 'french', label: 'Augereau', lat: 44.4, lon: 7.7, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Sérurier', lat: 44.3, lon: 7.9, size: 'small', labelSide: 'right' },
      { faction: 'french', label: 'Masséna', commander: 'Screening east', lat: 44.6, lon: 8.5, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Beaulieu', commander: 'Retreating to Milan', lat: 45.2, lon: 9.0, size: 'large', labelSide: 'right' },
      { faction: 'piedmontese', label: 'Colli', commander: 'Defeated at Mondovi', lat: 44.7, lon: 7.5, size: 'large', labelSide: 'left' },
    ],
  },

  // ── Ch 4: Lodi — Piedmont knocked out, crossing the Po ──
  ch4: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (ARMISTICE)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'austrian-lombardy', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 } },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Crossing the Po', lat: 45.1, lon: 9.5, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.0, lon: 9.3, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 44.9, lon: 9.6, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Beaulieu', commander: 'Behind the Adda', lat: 45.3, lon: 9.5, size: 'large', labelSide: 'right' },
    ],
  },

  // ── Ch 5: Milan — French occupy Lombardy, siege of Mantua begins ──
  ch5: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'HQ at Milan', lat: 45.46, lon: 9.2, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Sérurier', commander: 'Besieging Mantua', lat: 45.17, lon: 10.5, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.3, lon: 10.2, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Mantua Garrison', commander: 'Under siege', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Beaulieu', commander: 'Retreating to Tyrol', lat: 46.0, lon: 11.1, size: 'large', labelSide: 'right' },
    ],
  },

  // ── Ch 6: Mantua Siege — Wurmser's first relief attempt ──
  ch6: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'At Mantua siege', lat: 45.3, lon: 10.5, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.5, lon: 10.6, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.2, lon: 10.3, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Wurmser', commander: '25,000 — via Brenner', lat: 46.3, lon: 10.8, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Quasdanovich', commander: 'West of Garda', lat: 45.7, lon: 10.3, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Mantua Garrison', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 7: Castiglione ──
  ch7: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Concentrating', lat: 45.4, lon: 10.4, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.5, lon: 10.5, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.35, lon: 10.3, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Wurmser', commander: 'Defeated — retreating', lat: 45.6, lon: 10.8, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Mantua Garrison', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 8: Bassano — Second relief, Wurmser via Brenta ──
  ch8: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Pursuing via Brenta', lat: 45.8, lon: 11.3, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.9, lon: 11.0, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.7, lon: 11.5, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Wurmser', commander: 'Routed at Bassano', lat: 45.77, lon: 11.7, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Mantua Garrison', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 9: Caldiero — Alvinczi's first attempt ──
  ch9: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'At Verona', lat: 45.44, lon: 10.8, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.5, lon: 10.9, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.3, lon: 10.7, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Alvinczi', commander: '28,000 — from east', lat: 45.5, lon: 11.6, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Davidovich', commander: 'From Tyrol', lat: 46.0, lon: 11.0, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Wurmser', commander: 'Trapped in Mantua', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 10: Arcole ──
  ch10: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Flanking via marshes', lat: 45.38, lon: 11.1, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.4, lon: 11.0, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.35, lon: 11.2, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Alvinczi', commander: 'At Caldiero', lat: 45.42, lon: 11.4, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Wurmser', commander: 'In Mantua', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 11: Rivoli — The decisive battle ──
  ch11: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Joubert', commander: 'Holding the plateau', lat: 45.57, lon: 10.7, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Bonaparte', commander: 'Riding from Verona', lat: 45.44, lon: 10.8, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', commander: 'Marching to Rivoli', lat: 45.44, lon: 10.9, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Alvinczi', commander: '28,000 — from north', lat: 45.8, lon: 10.9, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Provera', commander: 'Toward Mantua', lat: 45.3, lon: 11.2, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Wurmser', commander: 'In Mantua', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 12: Fall of Mantua ──
  ch12: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'french-occupied', bounds: [LOMBARDY_POLY], labelPos: { lat: 45.5, lon: 9.6 }, label: 'FRENCH-OCCUPIED LOMBARDY' },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 } },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Mantua surrenders', lat: 45.3, lon: 10.5, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Sérurier', commander: 'Accepting surrender', lat: 45.17, lon: 10.5, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Wurmser', commander: 'Surrendered — 18,000 POW', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 13: Advance on Austria — Leoben & Campo Formio ──
  ch13: {
    territories: [
      { colorKey: 'french', bounds: [FRANCE_POLY], labelPos: { lat: 46.5, lon: 5.8 } },
      { colorKey: 'piedmont-neutral', bounds: [PIEDMONT_POLY], labelPos: { lat: 45.5, lon: 7.3 }, label: 'SARDINIA (NEUTRAL)' },
      { colorKey: 'genoa', bounds: [GENOA_POLY], labelPos: { lat: 44.3, lon: 8.4 } },
      { colorKey: 'cisalpine', bounds: [LOMBARDY_POLY, MODENA_POLY], labelPos: { lat: 45.5, lon: 9.6 } },
      { colorKey: 'venice', bounds: [VENICE_POLY], labelPos: { lat: 45.7, lon: 11.8 }, label: 'VENICE (COLLAPSING)' },
      { colorKey: 'tyrol', bounds: [TYROL_POLY], labelPos: { lat: 47.0, lon: 11.0 } },
      { colorKey: 'austrian', bounds: [AUSTRIA_POLY], labelPos: { lat: 47.8, lon: 14.5 } },
      { colorKey: 'papal', bounds: [PAPAL_POLY], labelPos: { lat: 43.8, lon: 11.0 } },
      { colorKey: 'swiss', bounds: [SWISS_POLY], labelPos: { lat: 47.0, lon: 8.2 } },
    ],
    armies: [
      { faction: 'french', label: 'Bonaparte', commander: 'Advancing on Vienna', lat: 46.8, lon: 13.8, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', commander: 'Through Tarvis', lat: 46.5, lon: 13.5, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Joubert', commander: 'In Tyrol', lat: 46.5, lon: 11.3, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Archduke Charles', commander: 'Defending approaches', lat: 47.2, lon: 15.0, size: 'large', labelSide: 'right' },
    ],
  },
};
