import React, { useState, useMemo } from 'react';
import { CampSceneArt } from '../../components/camp/CampSceneArt';
import { VoltriSceneArt } from '../../components/camp/VoltriSceneArt';
import {
  Ch1NiceScene, Ch2MontenotteScene, Ch3MondoviScene,
  Ch4LodiScene, Ch5MilanScene, Ch6MantuaSiegeScene,
  Ch7CastiglioneScene, Ch8BassanoScene, Ch9CaldieroScene,
  Ch10ArcoleScene, Ch12MantuaFallScene, Ch13ViennaMarchScene,
} from '../../components/camp/scenes';

/* ------------------------------------------------------------------ */
/*  Scene Registry                                                     */
/* ------------------------------------------------------------------ */

interface SceneEntry {
  id: string;
  label: string;
  chapter: number | null;
  description: string;
  component: React.ComponentType | null;
  status: 'done' | 'wip' | 'todo';
}

const SCENES: SceneEntry[] = [
  { id: 'rivoli', label: 'Rivoli Camp', chapter: 11, description: 'Night mountain camp — stars, crescent moon, campfire with soldiers', component: CampSceneArt, status: 'done' },
  { id: 'voltri', label: 'Voltri Sunrise', chapter: 1, description: 'Dawn hillside — sunrise over Ligurian coast, dying embers, olive trees', component: VoltriSceneArt, status: 'done' },
  { id: 'nice', label: 'Army of Italy', chapter: 1, description: 'Nice coastal garrison — ragged camp, broken shoes, Mediterranean, grey skies', component: Ch1NiceScene, status: 'wip' },
  { id: 'montenotte', label: 'Montenotte', chapter: 2, description: 'Mountain ravine — night, rain/fog, steep ravines, small fires', component: Ch2MontenotteScene, status: 'wip' },
  { id: 'mondovi', label: 'Mondovì', chapter: 3, description: 'Piedmont plain — warm evening, plunder, farmland, distant village', component: Ch3MondoviScene, status: 'wip' },
  { id: 'lodi', label: 'Lodi', chapter: 4, description: 'River bank — dusk, pontoon bridge, artillery silhouettes', component: Ch4LodiScene, status: 'wip' },
  { id: 'milan', label: 'Milan', chapter: 5, description: 'Urban garrison — Italian architecture, piazza camp, lamplight', component: Ch5MilanScene, status: 'wip' },
  { id: 'mantua-siege', label: 'Mantua Siege', chapter: 6, description: 'Marshland — midday haze, fortress in heat, malarial atmosphere', component: Ch6MantuaSiegeScene, status: 'wip' },
  { id: 'castiglione', label: 'Castiglione', chapter: 7, description: 'Lake Garda hillside — hot twilight, exhaustion, smoke', component: Ch7CastiglioneScene, status: 'wip' },
  { id: 'bassano', label: 'Bassano', chapter: 8, description: 'Brenta valley — autumn dusk, mountain river, autumn foliage', component: Ch8BassanoScene, status: 'wip' },
  { id: 'caldiero', label: 'Caldiero', chapter: 9, description: 'Muddy field — rain, grey daylight, tattered uniforms, despair', component: Ch9CaldieroScene, status: 'wip' },
  { id: 'arcole', label: 'Arcole', chapter: 10, description: 'Marsh/causeway — November dawn, frost, thin ice, pale cold light', component: Ch10ArcoleScene, status: 'wip' },
  { id: 'mantua-fall', label: 'Fall of Mantua', chapter: 12, description: 'Fortress walls — surrendering column, winter morning, worn victors', component: Ch12MantuaFallScene, status: 'wip' },
  { id: 'vienna-march', label: 'March on Vienna', chapter: 13, description: 'Alpine road — spring dawn, mountain pass, spring flowers, hope', component: Ch13ViennaMarchScene, status: 'wip' },
];

/* ------------------------------------------------------------------ */
/*  Zoom / background controls                                         */
/* ------------------------------------------------------------------ */

type BgMode = 'dark' | 'game' | 'white';
const bgColors: Record<BgMode, string> = {
  dark: '#0a0908',
  game: '#0f0d0a',
  white: '#f4e8c1',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ArtLabPage() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [bgMode, setBgMode] = useState<BgMode>('dark');
  const [filterCategory, setFilterCategory] = useState<'all' | 'done' | 'wip' | 'todo'>('all');
  const [showGrid, setShowGrid] = useState(false);

  const filteredScenes = useMemo(
    () => filterCategory === 'all' ? SCENES : SCENES.filter((s) => s.status === filterCategory),
    [filterCategory],
  );

  const activeScene = SCENES.find((s) => s.id === selectedScene);
  const SceneComponent = activeScene?.component ?? null;

  /* Gallery mode --------------------------------------------------- */
  if (!selectedScene) {
    return (
      <div className="art-lab">
        <div className="art-lab-toolbar">
          <span className="art-lab-toolbar-label">Filter:</span>
          {(['all', 'done', 'wip', 'todo'] as const).map((f) => (
            <button
              key={f}
              className={`art-lab-filter-btn${filterCategory === f ? ' active' : ''}`}
              onClick={() => setFilterCategory(f)}
            >
              {f === 'all' ? 'All' : f === 'done' ? 'Complete' : f === 'wip' ? 'In Progress' : 'Todo'}
            </button>
          ))}
          <span className="art-lab-count">{filteredScenes.length} scenes</span>
        </div>

        <div className="art-lab-gallery">
          {filteredScenes.map((scene) => (
            <button
              key={scene.id}
              className="art-lab-card"
              onClick={() => scene.component && setSelectedScene(scene.id)}
              style={{ opacity: scene.component ? 1 : 0.5 }}
            >
              <div className="art-lab-card-preview" style={{ background: bgColors.dark }}>
                {scene.component ? (
                  <div className="art-lab-card-svg">
                    <scene.component />
                  </div>
                ) : (
                  <div className="art-lab-card-placeholder">
                    <span>No SVG yet</span>
                  </div>
                )}
              </div>
              <div className="art-lab-card-info">
                <span className="art-lab-card-title">
                  {scene.chapter != null && <span className="art-lab-card-ch">Ch.{scene.chapter}</span>}
                  {scene.label}
                </span>
                <span className={`art-lab-card-status art-lab-status-${scene.status}`}>
                  {scene.status === 'done' ? 'Complete' : scene.status === 'wip' ? 'WIP' : 'Todo'}
                </span>
              </div>
              <p className="art-lab-card-desc">{scene.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* Detail / preview mode ------------------------------------------ */
  return (
    <div className="art-lab">
      <div className="art-lab-toolbar">
        <button className="art-lab-back" onClick={() => setSelectedScene(null)}>&larr; Gallery</button>
        <span className="art-lab-toolbar-divider" />
        <span className="art-lab-scene-title">
          {activeScene?.chapter != null && `Ch.${activeScene.chapter} — `}{activeScene?.label}
        </span>
        <span className="art-lab-toolbar-divider" />

        {/* Zoom */}
        <span className="art-lab-toolbar-label">Zoom:</span>
        <input
          type="range"
          min={25}
          max={200}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="art-lab-slider"
        />
        <span className="art-lab-zoom-val">{zoom}%</span>
        <button className="art-lab-small-btn" onClick={() => setZoom(100)}>Reset</button>

        <span className="art-lab-toolbar-divider" />

        {/* Background */}
        <span className="art-lab-toolbar-label">BG:</span>
        {(['dark', 'game', 'white'] as const).map((bg) => (
          <button
            key={bg}
            className={`art-lab-filter-btn${bgMode === bg ? ' active' : ''}`}
            onClick={() => setBgMode(bg)}
          >
            {bg}
          </button>
        ))}

        <span className="art-lab-toolbar-divider" />

        {/* Grid overlay */}
        <label className="art-lab-toggle">
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
          Grid
        </label>
      </div>

      <div className="art-lab-preview-area" style={{ background: bgColors[bgMode] }}>
        <div
          className="art-lab-preview-frame"
          style={{ width: `${zoom * 8}px`, maxWidth: '100%' }}
        >
          {SceneComponent && <SceneComponent />}
          {showGrid && <GridOverlay />}
        </div>
        <div className="art-lab-preview-info">
          <p>{activeScene?.description}</p>
          <p className="art-lab-preview-dims">800 &times; 400 viewBox &middot; preserveAspectRatio=&quot;xMidYMid slice&quot;</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid overlay for composition alignment                             */
/* ------------------------------------------------------------------ */

function GridOverlay() {
  return (
    <svg
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Rule of thirds */}
      <line x1="267" y1="0" x2="267" y2="400" stroke="rgba(184,150,62,0.3)" strokeWidth="1" />
      <line x1="533" y1="0" x2="533" y2="400" stroke="rgba(184,150,62,0.3)" strokeWidth="1" />
      <line x1="0" y1="133" x2="800" y2="133" stroke="rgba(184,150,62,0.3)" strokeWidth="1" />
      <line x1="0" y1="267" x2="800" y2="267" stroke="rgba(184,150,62,0.3)" strokeWidth="1" />
      {/* Center crosshair */}
      <line x1="400" y1="190" x2="400" y2="210" stroke="rgba(184,150,62,0.5)" strokeWidth="1" />
      <line x1="390" y1="200" x2="410" y2="200" stroke="rgba(184,150,62,0.5)" strokeWidth="1" />
      {/* Golden ratio approximate */}
      <line x1="306" y1="0" x2="306" y2="400" stroke="rgba(200,80,80,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="494" y1="0" x2="494" y2="400" stroke="rgba(200,80,80,0.15)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}
