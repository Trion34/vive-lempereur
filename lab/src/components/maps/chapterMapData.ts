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

export interface ViewportFocus {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
}

export interface ChapterOverlay {
  armies: ArmyMarker[];
  territories: TerritoryOverlay[];
  notes?: string;
  viewportFocus?: ViewportFocus;
}

// ============================================================
// TERRITORY POLYGONS — 1796 Italian Campaign
// Historically accurate borders with shared edge coordinates.
// Adjacent territories share identical border points to prevent
// overlaps and gaps. Coordinate system: linear projection,
// lat 42.8–48.55, lon 5.0–16.8.
// ============================================================

// ── Shared border waypoints ──
// France–Switzerland (Jura to Lake Geneva)
const FR_CH_1 = { lat: 48.55, lon: 7.58 }; // Basel area (map top edge)
const FR_CH_2 = { lat: 47.55, lon: 7.58 }; // Basel
const FR_CH_3 = { lat: 47.35, lon: 7.15 }; // Jura crest
const FR_CH_4 = { lat: 46.85, lon: 6.85 }; // Neuchâtel area
const FR_CH_5 = { lat: 46.45, lon: 6.65 }; // Lausanne / Lake Geneva

// France–Piedmont (Alpine crest: Geneva to Mediterranean)
const FR_PI_1 = { lat: 46.45, lon: 6.65 }; // = FR_CH_5 (triple point France/Swiss/Piedmont)
const FR_PI_2 = { lat: 46.05, lon: 6.80 }; // Mont Blanc massif
const FR_PI_3 = { lat: 45.80, lon: 6.85 }; // Little St Bernard
const FR_PI_4 = { lat: 45.45, lon: 6.70 }; // Col du Mont Cenis
const FR_PI_5 = { lat: 45.05, lon: 6.55 }; // Briançon area
const FR_PI_6 = { lat: 44.70, lon: 6.75 }; // Col de Larche
const FR_PI_7 = { lat: 44.35, lon: 7.10 }; // Col de Tende

// France–Genoa border (short coastal segment near Nice)
const FR_GE_1 = { lat: 44.35, lon: 7.10 }; // = FR_PI_7 (triple point France/Piedmont/Genoa)
const FR_GE_2 = { lat: 43.78, lon: 7.50 }; // Nice / Monaco coast

// Piedmont–Switzerland (Simplon, Monte Rosa)
const PI_CH_1 = { lat: 46.45, lon: 6.65 }; // = FR_PI_1 = FR_CH_5
const PI_CH_2 = { lat: 46.25, lon: 7.40 }; // Great St Bernard
const PI_CH_3 = { lat: 46.15, lon: 8.00 }; // Simplon Pass
const PI_CH_4 = { lat: 46.10, lon: 8.50 }; // Near Locarno / Swiss-Piedmont-Lombardy triple

// Piedmont–Lombardy (Ticino river, roughly)
const PI_LO_1 = { lat: 46.10, lon: 8.50 }; // = PI_CH_4 (triple Swiss/Piedmont/Lombardy)
const PI_LO_2 = { lat: 45.65, lon: 8.60 }; // Novara area
const PI_LO_3 = { lat: 45.30, lon: 8.65 }; // Vigevano / Ticino
const PI_LO_4 = { lat: 45.05, lon: 8.70 }; // Tortona area

// Piedmont–Genoa (northern edge of Genoese strip)
const PI_GE_1 = { lat: 44.35, lon: 7.10 }; // = FR_PI_7 = FR_GE_1
const PI_GE_2 = { lat: 44.55, lon: 7.65 }; // Ceva area
const PI_GE_3 = { lat: 44.65, lon: 8.15 }; // Acqui Terme
const PI_GE_4 = { lat: 44.70, lon: 8.60 }; // South of Alessandria
const PI_GE_5 = { lat: 45.05, lon: 8.70 }; // = PI_LO_4 (Piedmont/Genoa/Lombardy triple)

// Genoa–Lombardy (short northern border)
const GE_LO_1 = { lat: 45.05, lon: 8.70 }; // = PI_LO_4 = PI_GE_5
const GE_LO_2 = { lat: 44.85, lon: 9.20 }; // Pavia south / Voghera

// Genoa–Modena/Papal border (eastern end)
const GE_PA_1 = { lat: 44.25, lon: 9.85 }; // La Spezia area (Genoa/Papal triple)

// Genoa coast points
const GE_COAST_1 = { lat: 43.78, lon: 7.50 }; // = FR_GE_2
const GE_COAST_2 = { lat: 43.80, lon: 8.00 }; // Imperia
const GE_COAST_3 = { lat: 44.00, lon: 8.55 }; // Savona
const GE_COAST_4 = { lat: 44.20, lon: 8.95 }; // Genoa city
const GE_COAST_5 = { lat: 44.05, lon: 9.65 }; // Portofino / Chiavari
const GE_COAST_6 = { lat: 44.05, lon: 9.85 }; // La Spezia coast

// Switzerland–Lombardy (southern Swiss border)
const CH_LO_1 = { lat: 46.10, lon: 8.50 }; // = PI_CH_4 = PI_LO_1
const CH_LO_2 = { lat: 46.20, lon: 8.95 }; // Bellinzona / Ticino canton
const CH_LO_3 = { lat: 46.45, lon: 9.40 }; // Splügen Pass area

// Switzerland–Tyrol
const CH_TY_1 = { lat: 46.45, lon: 9.40 }; // = CH_LO_3 (Swiss/Lombardy/Tyrol triple)
const CH_TY_2 = { lat: 46.80, lon: 9.60 }; // Engadin / Graubünden
const CH_TY_3 = { lat: 47.10, lon: 9.85 }; // Arlberg approach

// Switzerland north edge (map boundary)
const CH_N_1 = { lat: 47.80, lon: 9.50 }; // Bodensee (Lake Constance)

// Lombardy–Tyrol
const LO_TY_2 = { lat: 46.50, lon: 9.90 }; // Stelvio approach
const LO_TY_3 = { lat: 46.60, lon: 10.45 }; // Merano area (Lombardy/Tyrol/Venice triple)

// Lombardy–Venice (Mincio / Adige boundary)
const LO_VE_1 = { lat: 46.60, lon: 10.45 }; // = LO_TY_3
const LO_VE_2 = { lat: 46.05, lon: 10.85 }; // South of Adige bend
const LO_VE_3 = { lat: 45.55, lon: 10.85 }; // Peschiera / Garda
const LO_VE_4 = { lat: 45.15, lon: 10.80 }; // Mantua area
const LO_VE_5 = { lat: 45.00, lon: 10.85 }; // Lombardy/Venice/Modena triple (Po)

// Lombardy–Modena (Po river)
const LO_MO_1 = { lat: 45.00, lon: 10.85 }; // = LO_VE_5
const LO_MO_2 = { lat: 44.95, lon: 10.45 }; // Guastalla area
const LO_MO_3 = { lat: 44.90, lon: 10.05 }; // Near Parma (Lombardy/Modena/Genoa triple)

// Lombardy–Genoa/Papal (southern boundary via Po/Parma)
const LO_PA_1 = { lat: 44.90, lon: 10.05 }; // = LO_MO_3
const LO_PA_2 = { lat: 44.85, lon: 9.55 }; // Piacenza

// Tyrol–Venice
const TY_VE_1 = { lat: 46.60, lon: 10.45 }; // = LO_TY_3 = LO_VE_1
const TY_VE_2 = { lat: 46.65, lon: 11.20 }; // Bolzano area
const TY_VE_3 = { lat: 46.70, lon: 11.70 }; // Brenner south
const TY_VE_4 = { lat: 46.70, lon: 12.30 }; // Lienz/Puster valley

// Tyrol–Austria
const TY_AU_1 = { lat: 46.70, lon: 12.30 }; // = TY_VE_4 (Tyrol/Venice/Austria triple)
const TY_AU_2 = { lat: 47.15, lon: 12.10 }; // Inntal
const TY_AU_3 = { lat: 47.40, lon: 11.80 }; // Innsbruck area

// Venice–Austria (Carnic/Julian Alps to coast)
const VE_AU_1 = { lat: 46.70, lon: 12.30 }; // = TY_VE_4 = TY_AU_1
const VE_AU_2 = { lat: 46.55, lon: 13.20 }; // Carnic Alps / Tarvis
const VE_AU_3 = { lat: 46.30, lon: 13.70 }; // Julian Alps / Tolmein
const VE_AU_4 = { lat: 46.05, lon: 13.90 }; // Ljubljana gap
const VE_AU_5 = { lat: 45.65, lon: 14.20 }; // Istria border

// Venice–Papal (Po delta)
const VE_PA_1 = { lat: 45.00, lon: 10.85 }; // = LO_VE_5 = LO_MO_1
const VE_PA_2 = { lat: 44.95, lon: 11.30 }; // Ferrara area
const VE_PA_3 = { lat: 44.85, lon: 11.80 }; // Rovigo / lower Po
const VE_PA_4 = { lat: 44.95, lon: 12.30 }; // Po delta / coast

// Modena–Venice (short eastern border)
const MO_VE_1 = { lat: 45.00, lon: 10.85 }; // = LO_VE_5 = VE_PA_1

// Modena–Papal
const MO_PA_2 = { lat: 44.60, lon: 10.35 }; // Reggio nell'Emilia south
const MO_PA_3 = { lat: 44.50, lon: 10.70 }; // Modena south
const MO_PA_4 = { lat: 44.60, lon: 11.00 }; // Bologna approach

// Modena–Genoa (short western border — Parma area)
const MO_GE_1 = { lat: 44.90, lon: 10.05 }; // = LO_PA_1 = LO_MO_3
const MO_GE_2 = { lat: 44.55, lon: 9.95 }; // Pontremoli area
const MO_GE_3 = { lat: 44.25, lon: 9.85 }; // = GE_PA_1 (triple Genoa/Modena/Papal)

// ── Territory polygons ──

// French Republic (southeast France — visible portion)
const FRANCE_POLY = [
  { lat: 48.55, lon: 5.0 },  // NW corner (map edge)
  FR_CH_1,                    // NE along top to Basel
  FR_CH_2,                    // Basel
  FR_CH_3,                    // Jura
  FR_CH_4,                    // Neuchâtel
  FR_CH_5,                    // Lake Geneva = FR_PI_1
  FR_PI_2,                    // Mont Blanc
  FR_PI_3,                    // Little St Bernard
  FR_PI_4,                    // Mont Cenis
  FR_PI_5,                    // Briançon
  FR_PI_6,                    // Col de Larche
  FR_PI_7,                    // Col de Tende = FR_GE_1
  FR_GE_2,                    // Nice coast
  { lat: 43.50, lon: 6.90 }, // Fréjus
  { lat: 43.30, lon: 6.15 }, // Toulon area
  { lat: 43.25, lon: 5.40 }, // Marseille
  { lat: 43.50, lon: 5.0 },  // SW corner (map edge)
];

// Kingdom of Sardinia-Piedmont
const PIEDMONT_POLY = [
  FR_PI_1,  // Lake Geneva (triple with France/Swiss)
  PI_CH_2,  // Great St Bernard
  PI_CH_3,  // Simplon
  PI_CH_4,  // = PI_LO_1 (triple with Swiss/Lombardy)
  PI_LO_2,  // Novara
  PI_LO_3,  // Vigevano
  PI_LO_4,  // = PI_GE_5 (triple with Lombardy/Genoa)
  PI_GE_4,  // South of Alessandria
  PI_GE_3,  // Acqui Terme
  PI_GE_2,  // Ceva
  PI_GE_1,  // = FR_PI_7 = FR_GE_1 (triple with France/Genoa)
  FR_PI_6,  // Col de Larche
  FR_PI_5,  // Briançon
  FR_PI_4,  // Mont Cenis
  FR_PI_3,  // Little St Bernard
  FR_PI_2,  // Mont Blanc
];

// Republic of Genoa (thin coastal strip)
const GENOA_POLY = [
  FR_GE_1,    // Col de Tende (triple France/Piedmont/Genoa)
  PI_GE_2,    // Ceva
  PI_GE_3,    // Acqui Terme
  PI_GE_4,    // South of Alessandria
  PI_GE_5,    // = GE_LO_1 (triple Piedmont/Genoa/Lombardy)
  GE_LO_2,    // Voghera / south Pavia
  LO_PA_2,    // Piacenza
  LO_PA_1,    // = MO_GE_1 (near Parma)
  MO_GE_2,    // Pontremoli
  MO_GE_3,    // = GE_PA_1 (La Spezia — triple Genoa/Modena/Papal)
  GE_COAST_6, // La Spezia coast
  GE_COAST_5, // Chiavari
  GE_COAST_4, // Genoa city
  GE_COAST_3, // Savona
  GE_COAST_2, // Imperia
  GE_COAST_1, // = FR_GE_2 (Nice coast)
];

// Austrian Lombardy (Duchy of Milan)
const LOMBARDY_POLY = [
  PI_LO_1,  // = CH_LO_1 (triple Swiss/Piedmont/Lombardy)
  CH_LO_2,  // Bellinzona
  CH_LO_3,  // = LO_TY_1 (triple Swiss/Lombardy/Tyrol)
  LO_TY_2,  // Stelvio
  LO_TY_3,  // = LO_VE_1 (triple Lombardy/Tyrol/Venice)
  LO_VE_2,  // Adige bend
  LO_VE_3,  // Peschiera / Garda
  LO_VE_4,  // Mantua
  LO_VE_5,  // = LO_MO_1 (triple Lombardy/Venice/Modena)
  LO_MO_2,  // Guastalla
  LO_MO_3,  // = LO_PA_1 (near Parma)
  LO_PA_2,  // Piacenza
  GE_LO_2,  // Voghera (= LO south-west along Genoa border)
  GE_LO_1,  // = PI_GE_5 = PI_LO_4 (triple Piedmont/Genoa/Lombardy)
  PI_LO_3,  // Vigevano
  PI_LO_2,  // Novara
];

// Republic of Venice (Terraferma + Friuli + Istria + Dalmatia)
const VENICE_POLY = [
  LO_VE_1,                     // = TY_VE_1 (triple Lombardy/Tyrol/Venice)
  TY_VE_2,                     // Bolzano
  TY_VE_3,                     // Brenner south
  TY_VE_4,                     // = VE_AU_1 (triple Tyrol/Venice/Austria)
  VE_AU_2,                     // Carnic Alps / Tarvis
  VE_AU_3,                     // Julian Alps
  VE_AU_4,                     // Ljubljana gap
  VE_AU_5,                     // Istria border
  { lat: 45.65, lon: 16.80 }, // Map east edge (shared with Austria)
  { lat: 42.80, lon: 16.80 }, // SE corner (map edge)
  { lat: 42.80, lon: 12.55 }, // South edge (Adriatic coast, map boundary)
  VE_PA_4,                     // Po delta coast
  VE_PA_3,                     // Rovigo
  VE_PA_2,                     // Ferrara
  VE_PA_1,                     // = LO_VE_5 = MO_VE_1 (triple Lombardy/Venice/Modena)
  LO_VE_4,                     // Mantua
  LO_VE_3,                     // Peschiera
  LO_VE_2,                     // Adige bend
];

// County of Tyrol + Vorarlberg + Bavarian buffer (fills gap between Swiss & Austria)
const TYROL_POLY = [
  CH_TY_1,                      // = LO_TY_1 (triple Swiss/Lombardy/Tyrol)
  CH_TY_2,                      // Engadin
  CH_TY_3,                      // Arlberg
  CH_N_1,                       // Bodensee area
  { lat: 48.55, lon: 9.85 },   // Map top edge west (shared with Swiss)
  { lat: 48.55, lon: 12.30 },  // Map top edge east (shared with Austria)
  TY_AU_3,                      // Innsbruck
  TY_AU_2,                      // Inntal
  TY_AU_1,                      // = TY_VE_4 (triple Tyrol/Venice/Austria)
  TY_VE_3,                      // Brenner south
  TY_VE_2,                      // Bolzano
  TY_VE_1,                      // = LO_VE_1 (triple Lombardy/Tyrol/Venice)
  LO_TY_2,                      // Stelvio
];

// Austrian Hereditary Lands (east of Tyrol — Carinthia, Styria, Croatia etc.)
const AUSTRIA_POLY = [
  { lat: 48.55, lon: 12.30 },  // Map top edge west (shared with Tyrol)
  { lat: 48.55, lon: 16.80 },  // NE corner (map edge)
  { lat: 45.65, lon: 16.80 },  // East edge south (meets Venice at map edge)
  VE_AU_5,                      // Istria border (shared with Venice)
  VE_AU_4,                      // Ljubljana gap
  VE_AU_3,                      // Julian Alps
  VE_AU_2,                      // Tarvis
  VE_AU_1,                      // = TY_AU_1 (triple Tyrol/Venice/Austria)
  TY_AU_2,                      // Inntal
  TY_AU_3,                      // Innsbruck (shared with Tyrol)
];

// Papal States (Romagna + Legations — visible northern portion)
const PAPAL_POLY = [
  GE_PA_1,                     // = MO_GE_3 (La Spezia — triple Genoa/Modena/Papal)
  MO_PA_2,                     // Reggio south
  MO_PA_3,                     // Modena south
  MO_PA_4,                     // Bologna approach
  VE_PA_2,                     // Ferrara
  VE_PA_3,                     // Rovigo
  VE_PA_4,                     // Po delta coast
  { lat: 44.60, lon: 12.55 }, // Rimini coast
  { lat: 44.10, lon: 12.60 }, // Pesaro
  { lat: 43.60, lon: 12.50 }, // Urbino
  { lat: 42.80, lon: 12.55 }, // South edge (shared with Venice at map boundary)
  { lat: 42.80, lon: 10.30 }, // SW corner (map edge, Tyrrhenian coast)
  { lat: 43.30, lon: 10.15 }, // Piombino
  { lat: 43.75, lon: 10.00 }, // Lucca area
  GE_COAST_6,                  // La Spezia coast
];

// Swiss Confederation (extended to map top edge — includes HRE buffer zone)
const SWISS_POLY = [
  FR_CH_1,                     // Basel (map top edge, lon 7.58)
  { lat: 48.55, lon: 9.85 },  // Map top edge (Swiss/Austria boundary)
  CH_N_1,                      // Bodensee
  CH_TY_3,                     // Arlberg / Graubünden north
  CH_TY_2,                     // Engadin
  CH_TY_1,                     // = CH_LO_3 (triple Swiss/Lombardy/Tyrol)
  CH_LO_2,                     // Bellinzona
  CH_LO_1,                     // = PI_CH_4 (triple Swiss/Piedmont/Lombardy)
  PI_CH_3,                     // Simplon
  PI_CH_2,                     // Great St Bernard
  PI_CH_1,                     // = FR_CH_5 (Lake Geneva)
  FR_CH_4,                     // Neuchâtel
  FR_CH_3,                     // Jura
  FR_CH_2,                     // Basel
];

// Duchy of Modena (& Reggio)
const MODENA_POLY = [
  LO_MO_3,  // = MO_GE_1 (west — near Parma)
  LO_MO_2,  // Guastalla
  LO_MO_1,  // = MO_VE_1 (triple Lombardy/Venice/Modena)
  VE_PA_2,  // Ferrara (= MO east border touches Venice/Papal)
  MO_PA_4,  // Bologna approach
  MO_PA_3,  // Modena south
  MO_PA_2,  // Reggio south
  MO_GE_3,  // = GE_PA_1 (La Spezia — triple Genoa/Modena/Papal)
  MO_GE_2,  // Pontremoli
];

// ============================================================
// CHAPTER OVERLAYS
// ============================================================

export const CHAPTER_OVERLAYS: Record<ItalianCampaignChapterId, ChapterOverlay> = {
  // ── Ch 1: Voltri & Opening ──
  ch1: {
    viewportFocus: { latMin: 43.4, latMax: 45.2, lonMin: 6.5, lonMax: 9.5 },
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
      { faction: 'french', label: 'Sérurier', lat: 44.0, lon: 7.3, size: 'small', labelSide: 'left' },
      // Austrian
      { faction: 'austrian', label: 'Beaulieu', commander: 'Austrian Main', lat: 44.9, lon: 8.8, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Argenteau', lat: 44.5, lon: 8.5, size: 'small', labelSide: 'right' },
      // Piedmontese
      { faction: 'piedmontese', label: 'Colli', commander: 'Piedmontese', lat: 44.5, lon: 7.6, size: 'large', labelSide: 'left' },
    ],
  },

  // ── Ch 2: Montenotte ──
  ch2: {
    viewportFocus: { latMin: 43.8, latMax: 45.3, lonMin: 7.5, lonMax: 9.2 },
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
    viewportFocus: { latMin: 43.8, latMax: 45.3, lonMin: 7.0, lonMax: 8.8 },
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
    viewportFocus: { latMin: 44.3, latMax: 46.0, lonMin: 7.5, lonMax: 10.0 },
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
    viewportFocus: { latMin: 44.5, latMax: 46.2, lonMin: 8.5, lonMax: 11.5 },
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
    viewportFocus: { latMin: 44.8, latMax: 46.5, lonMin: 9.8, lonMax: 11.5 },
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
    viewportFocus: { latMin: 44.8, latMax: 46.0, lonMin: 9.8, lonMax: 11.3 },
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
    viewportFocus: { latMin: 44.8, latMax: 46.5, lonMin: 10.0, lonMax: 12.2 },
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
      { faction: 'austrian', label: 'Davidovich', commander: 'Defeated at Rovereto', lat: 45.9, lon: 11.0, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Mantua Garrison', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 9: Caldiero — Alvinczi's first attempt ──
  ch9: {
    viewportFocus: { latMin: 44.8, latMax: 46.0, lonMin: 10.2, lonMax: 11.8 },
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
      { faction: 'french', label: 'Bonaparte', commander: 'At Verona', lat: 45.44, lon: 10.99, size: 'large', labelSide: 'left' },
      { faction: 'french', label: 'Masséna', lat: 45.5, lon: 10.9, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Augereau', lat: 45.3, lon: 10.7, size: 'small', labelSide: 'left' },
      { faction: 'french', label: 'Vaubois', commander: 'Defending Adige valley', lat: 45.7, lon: 10.8, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Alvinczi', commander: '28,000 — from east', lat: 45.5, lon: 11.6, size: 'large', labelSide: 'right' },
      { faction: 'austrian', label: 'Davidovich', commander: 'From Tyrol', lat: 46.0, lon: 11.0, size: 'small', labelSide: 'right' },
      { faction: 'austrian', label: 'Wurmser', commander: 'Trapped in Mantua', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 10: Arcole ──
  ch10: {
    viewportFocus: { latMin: 44.8, latMax: 46.0, lonMin: 10.2, lonMax: 11.8 },
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
    viewportFocus: { latMin: 44.5, latMax: 46.2, lonMin: 10.0, lonMax: 11.5 },
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
    viewportFocus: { latMin: 44.5, latMax: 46.0, lonMin: 9.8, lonMax: 11.5 },
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
      { faction: 'french', label: 'Sérurier', commander: 'Accepting surrender', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'left' },
      { faction: 'austrian', label: 'Wurmser', commander: 'Surrendered — 16,000 POW', lat: 45.17, lon: 10.8, size: 'small', labelSide: 'right' },
    ],
  },

  // ── Ch 13: Advance on Austria — Leoben & Campo Formio ──
  ch13: {
    viewportFocus: { latMin: 44.5, latMax: 48.0, lonMin: 9.5, lonMax: 16.0 },
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
