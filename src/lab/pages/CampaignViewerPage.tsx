import React, { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Campaign Data (parsed from ITALY-CAMPAIGN.md + src/data/campaigns) */
/* ------------------------------------------------------------------ */

type NodeType = 'interlude' | 'camp' | 'battle';

interface CampaignChapter {
  id: string;
  number: number;
  title: string;
  dateRange: string;
  summary: string;
  keyBattles: string[];
  keyCommanders: { french: string[]; austrian: string[] };
  outcome: string;
  nodes: ChapterNode[];
}

interface ChapterNode {
  type: NodeType;
  id: string;
  label: string;
  description: string;
  details: Record<string, string | number>;
}

const CHAPTERS: CampaignChapter[] = [
  {
    id: 'ch1', number: 1, title: 'Army of Italy',
    dateRange: 'March 1796',
    summary: 'Napoleon takes command of the ragged Army of Italy at Nice. The army is starving, barefoot, and demoralized — but a new era is about to begin.',
    keyBattles: [],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Sérurier'], austrian: ['Beaulieu'] },
    outcome: 'The army musters and prepares to march.',
    nodes: [
      { type: 'interlude', id: 'voltri-prologue', label: 'Voltri Prologue', description: 'Introduction to the Italian Campaign. The player arrives at the Ligurian coast.', details: { beats: 5 } },
      { type: 'camp', id: 'voltri-garrison', label: 'Garrison at Voltri', description: 'Garrison life at the coastal town of Voltri, April 1796.', details: { actions: 12, weather: 'cold', supply: 'scarce' } },
      { type: 'battle', id: 'voltri', label: 'Battle of Voltri', description: 'Austrian attack on the coastal garrison. Tutorial battle.', details: { volleys: 2, parts: 1 } },
    ],
  },
  {
    id: 'ch2', number: 2, title: 'Montenotte',
    dateRange: 'April 1796',
    summary: 'Napoleon strikes at the junction between Austrian and Piedmontese forces, defeating them in detail. The first victory of the campaign.',
    keyBattles: ['Montenotte (12 Apr)', 'Millesimo (13 Apr)', 'Dego (14-15 Apr)'],
    keyCommanders: { french: ['Napoleon', 'La Harpe', 'Augereau', 'Masséna'], austrian: ['Argenteau', 'Beaulieu'] },
    outcome: 'Austrian centre broken. Piedmontese isolated.',
    nodes: [
      { type: 'interlude', id: 'montenotte-prologue', label: 'March into the Mountains', description: 'The army moves north from the coast into the Apennine passes.', details: {} },
      { type: 'camp', id: 'montenotte-camp', label: 'Camp at Montenotte', description: 'Night before the first real battle. Rain, fog, mountain terrain.', details: { actions: 14 } },
      { type: 'battle', id: 'montenotte', label: 'Battle of Montenotte', description: 'Dawn attack through mountain ravines.', details: {} },
    ],
  },
  {
    id: 'ch3', number: 3, title: 'Mondovì',
    dateRange: 'April 1796',
    summary: 'Napoleon turns on Piedmont-Sardinia. The fertile plains offer plunder and relief from starvation, but also moral complications.',
    keyBattles: ['Mondovì (21 Apr)', 'Armistice of Cherasco (28 Apr)'],
    keyCommanders: { french: ['Napoleon', 'Sérurier', 'Augereau'], austrian: [] },
    outcome: 'Piedmont-Sardinia sues for peace. French army fed and re-equipped.',
    nodes: [
      { type: 'camp', id: 'mondovi-camp', label: 'Camp at Mondovì', description: 'Plunder and feasting on the Piedmontese plain.', details: { actions: 14 } },
      { type: 'battle', id: 'mondovi', label: 'Battle of Mondovì', description: 'Attack on the Piedmontese defensive position.', details: {} },
    ],
  },
  {
    id: 'ch4', number: 4, title: 'Lodi',
    dateRange: 'May 1796',
    summary: 'The charge across the bridge at Lodi becomes legendary. Napoleon earns the nickname "le petit caporal" from his men.',
    keyBattles: ['Fombio (8 May)', 'Lodi Bridge (10 May)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Dallemagne', 'Lannes'], austrian: ['Beaulieu', 'Sebottendorf'] },
    outcome: 'Austrian rearguard destroyed. Road to Milan open.',
    nodes: [
      { type: 'interlude', id: 'montenotte-lodi', label: 'March to Lodi', description: 'The army crosses the Po and advances on Milan.', details: { beats: 3 } },
      { type: 'camp', id: 'lodi-camp', label: 'Camp at Lodi', description: 'On the riverbank. The bridge awaits.', details: { actions: 14 } },
      { type: 'battle', id: 'lodi', label: 'Battle of Lodi', description: 'Charge across the bridge under Austrian cannon fire.', details: {} },
    ],
  },
  {
    id: 'ch5', number: 5, title: 'Milan',
    dateRange: 'May-June 1796',
    summary: 'The French occupy Milan. Garrison duty in an Italian city — culture shock, uneasy occupation, political intrigue.',
    keyBattles: [],
    keyCommanders: { french: ['Napoleon', 'Murat'], austrian: [] },
    outcome: 'French consolidate control of Lombardy. Mantua siege begins.',
    nodes: [
      { type: 'camp', id: 'milan-garrison', label: 'Garrison at Milan', description: 'Urban garrison life. Italian architecture, culture, unease.', details: { actions: 16 } },
    ],
  },
  {
    id: 'ch6', number: 6, title: 'Mantua Siege',
    dateRange: 'July-August 1796',
    summary: 'The siege drags on in the malarial marshes. Disease kills more men than the Austrians. Wurmser marches south with a relief army.',
    keyBattles: ['Siege of Mantua (ongoing)', 'Lonato (3 Aug)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Sérurier'], austrian: ['Wurmser'] },
    outcome: 'First relief attempt begins. French must lift siege temporarily.',
    nodes: [
      { type: 'camp', id: 'mantua-siege-camp', label: 'Siege Lines at Mantua', description: 'Malarial marsh, heat, disease, boredom, death.', details: { actions: 14 } },
      { type: 'battle', id: 'mantua-siege', label: 'Defense of the Siege', description: 'Holding the lines against Austrian sorties.', details: {} },
    ],
  },
  {
    id: 'ch7', number: 7, title: 'Castiglione',
    dateRange: 'August 1796',
    summary: "Wurmser's relief army is defeated at Castiglione. A desperate defensive battle in the summer heat near Lake Garda.",
    keyBattles: ['Castiglione (5 Aug)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Marmont'], austrian: ['Wurmser', 'Quasdanovich'] },
    outcome: 'Wurmser retreats. Siege of Mantua resumes.',
    nodes: [
      { type: 'interlude', id: 'lodi-castiglione', label: 'Summer in Lombardy', description: 'March south along Lake Garda in murderous heat.', details: { beats: 3 } },
      { type: 'camp', id: 'castiglione-camp', label: 'Camp at Castiglione', description: 'Lake Garda hillside. Exhausted troops, summer heat.', details: { actions: 14 } },
      { type: 'battle', id: 'castiglione', label: 'Battle of Castiglione', description: "Desperate defense against Wurmser's relief army.", details: {} },
    ],
  },
  {
    id: 'ch8', number: 8, title: 'Bassano',
    dateRange: 'September 1796',
    summary: 'Wurmser thrusts through the Brenta valley. Napoleon races to intercept in the autumn mountains.',
    keyBattles: ['Bassano (8 Sept)', 'Rovereto (4 Sept)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau'], austrian: ['Wurmser'] },
    outcome: 'Wurmser defeated again, retreats into Mantua. Now besieged himself.',
    nodes: [
      { type: 'camp', id: 'bassano-camp', label: 'Camp in the Brenta Valley', description: 'Autumn mountain valley, river below, fast-moving clouds.', details: { actions: 12 } },
      { type: 'battle', id: 'bassano', label: 'Battle of Bassano', description: 'Pursuit through the mountain valley.', details: {} },
    ],
  },
  {
    id: 'ch9', number: 9, title: 'Caldiero',
    dateRange: 'October-November 1796',
    summary: 'A rare French defeat. Alvinczi repulses the attack at Caldiero in the rain and mud. The darkest hour of the campaign.',
    keyBattles: ['Caldiero (12 Nov)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau'], austrian: ['Alvinczi', 'Davidovich'] },
    outcome: 'French retreat. Morale at its lowest.',
    nodes: [
      { type: 'interlude', id: 'castiglione-arcole', label: 'Road to Arcole', description: 'The marshes around Arcole. Narrow causeways swept by grapeshot.', details: { beats: 3 } },
      { type: 'camp', id: 'caldiero-camp', label: 'Camp at Caldiero', description: 'Muddy field. Rain. Tattered uniforms. Despair.', details: { actions: 10 } },
      { type: 'battle', id: 'caldiero', label: 'Battle of Caldiero', description: 'Attack in driving rain. Repulsed.', details: {} },
    ],
  },
  {
    id: 'ch10', number: 10, title: 'Arcole',
    dateRange: 'November 1796',
    summary: "Three days of fighting for the bridge at Arcole. Napoleon personally leads a charge with the flag. Grim determination wins the day.",
    keyBattles: ['Arcole (15-17 Nov)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Lannes'], austrian: ['Alvinczi'] },
    outcome: 'Austrian retreat. French hold northern Italy.',
    nodes: [
      { type: 'camp', id: 'arcole-camp', label: 'Camp at Arcole', description: 'Marsh/causeway. November dawn, frost, thin ice.', details: { actions: 12 } },
      { type: 'battle', id: 'arcole', label: 'Battle of Arcole', description: 'Three days on the bridge. Napoleon charges with the flag.', details: {} },
    ],
  },
  {
    id: 'ch11', number: 11, title: 'Rivoli',
    dateRange: 'January 1797',
    summary: "The decisive battle. Joubert's division holds the plateau above Rivoli against 28,000 Austrians until Masséna arrives.",
    keyBattles: ['Rivoli (14-15 Jan)'],
    keyCommanders: { french: ['Napoleon', 'Joubert', 'Masséna', 'Rey'], austrian: ['Alvinczi', 'Lusignan', 'Lipthay'] },
    outcome: 'Decisive French victory. Austrian army shattered.',
    nodes: [
      { type: 'interlude', id: 'arcole-rivoli', label: 'Winter on the Adige', description: 'Winter settles. Alvinczi marches south with 28,000 men.', details: { beats: 3 } },
      { type: 'interlude', id: 'italy-prologue', label: 'Italy Prologue', description: 'Full campaign recap and setup for Rivoli.', details: { beats: 5 } },
      { type: 'camp', id: 'eve-of-rivoli', label: 'Eve of Rivoli', description: 'Night before the battle on the plateau. 16 actions.', details: { actions: 16, weather: 'cold', supply: 'scarce' } },
      { type: 'battle', id: 'rivoli', label: 'Battle of Rivoli', description: 'The main battle. 3 parts, 11 volleys, multiple melee encounters.', details: { volleys: 11, parts: 3 } },
    ],
  },
  {
    id: 'ch12', number: 12, title: 'Fall of Mantua',
    dateRange: 'February 1797',
    summary: "With Alvinczi defeated, Mantua's garrison finally surrenders. The long siege is over.",
    keyBattles: ['Surrender of Mantua (2 Feb)'],
    keyCommanders: { french: ['Napoleon', 'Sérurier'], austrian: ['Wurmser (surrenders)'] },
    outcome: "Mantua falls. Austria's last foothold in Italy is gone.",
    nodes: [
      { type: 'interlude', id: 'rivoli-mantua', label: 'The Fall of Mantua', description: 'The siege tightens. Wurmser surrenders.', details: { beats: 3 } },
      { type: 'camp', id: 'mantua-fall-camp', label: 'Outside Mantua', description: 'Fortress walls, surrendering column, winter morning.', details: { actions: 8 } },
    ],
  },
  {
    id: 'ch13', number: 13, title: 'March on Vienna',
    dateRange: 'March-April 1797',
    summary: 'Bonaparte marches into Austria itself. The alpine passes open to green valleys and spring. The Treaty of Campo Formio ends the war.',
    keyBattles: ['Tagliamento (16 Mar)', 'Treaty of Campo Formio (17 Oct)'],
    keyCommanders: { french: ['Napoleon'], austrian: ['Archduke Charles'] },
    outcome: 'Austria sues for peace. Italy is French. Napoleon returns a hero.',
    nodes: [
      { type: 'camp', id: 'vienna-march-camp', label: 'Alpine Road', description: 'Mountain pass opening to green valley. Spring flowers. Hope.', details: { actions: 8 } },
    ],
  },
];

const nodeTypeColor: Record<NodeType, string> = {
  interlude: 'var(--stamina-high)',
  camp: 'var(--accent-gold)',
  battle: 'var(--accent-red-bright)',
};

const nodeTypeLabel: Record<NodeType, string> = {
  interlude: 'Interlude',
  camp: 'Camp',
  battle: 'Battle',
};

type ZoomLevel = 'campaign' | 'chapter' | 'node';

export function CampaignViewerPage() {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('campaign');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const chapter = CHAPTERS.find((c) => c.id === selectedChapter);
  const node = chapter?.nodes.find((n) => n.id === selectedNode);

  const handleChapterClick = (chId: string) => {
    setSelectedChapter(chId);
    setSelectedNode(null);
    setZoomLevel('chapter');
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setZoomLevel('node');
  };

  const handleBack = () => {
    if (zoomLevel === 'node') {
      setSelectedNode(null);
      setZoomLevel('chapter');
    } else if (zoomLevel === 'chapter') {
      setSelectedChapter(null);
      setZoomLevel('campaign');
    }
  };

  return (
    <div className="cv-page">
      <div className="art-lab-toolbar">
        <button
          className={`art-lab-filter-btn${zoomLevel === 'campaign' ? ' active' : ''}`}
          onClick={() => { setZoomLevel('campaign'); setSelectedChapter(null); setSelectedNode(null); }}
        >
          Campaign
        </button>
        {chapter && (
          <>
            <span className="cv-breadcrumb-sep">&rsaquo;</span>
            <button
              className={`art-lab-filter-btn${zoomLevel === 'chapter' ? ' active' : ''}`}
              onClick={() => { setZoomLevel('chapter'); setSelectedNode(null); }}
            >
              Ch.{chapter.number}: {chapter.title}
            </button>
          </>
        )}
        {node && (
          <>
            <span className="cv-breadcrumb-sep">&rsaquo;</span>
            <span className="cv-breadcrumb-node">{node.label}</span>
          </>
        )}
        {zoomLevel !== 'campaign' && (
          <>
            <span className="art-lab-toolbar-divider" />
            <button className="art-lab-small-btn" onClick={handleBack}>&larr; Back</button>
          </>
        )}
        <span className="art-lab-count">
          {zoomLevel === 'campaign' ? `${CHAPTERS.length} chapters` :
           zoomLevel === 'chapter' && chapter ? `${chapter.nodes.length} nodes` : ''}
        </span>
      </div>

      <div className="cv-content">
        {/* Campaign level */}
        {zoomLevel === 'campaign' && (
          <div className="cv-campaign">
            <h2 className="cv-campaign-title">The Italian Campaign, 1796&ndash;1797</h2>
            <p className="cv-campaign-subtitle">13 chapters from Nice to Vienna</p>
            <div className="cv-timeline">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  className="cv-chapter-card"
                  onClick={() => handleChapterClick(ch.id)}
                >
                  <div className="cv-chapter-number">Ch.{ch.number}</div>
                  <div className="cv-chapter-info">
                    <span className="cv-chapter-title">{ch.title}</span>
                    <span className="cv-chapter-date">{ch.dateRange}</span>
                    <span className="cv-chapter-summary">{ch.summary.slice(0, 120)}...</span>
                  </div>
                  <div className="cv-chapter-nodes">
                    {ch.nodes.map((n) => (
                      <span
                        key={n.id}
                        className="cv-node-pip"
                        style={{ background: nodeTypeColor[n.type] }}
                        title={`${nodeTypeLabel[n.type]}: ${n.label}`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chapter level */}
        {zoomLevel === 'chapter' && chapter && (
          <div className="cv-chapter-detail">
            <div className="cv-chapter-header">
              <h2 className="cv-chapter-detail-title">Chapter {chapter.number}: {chapter.title}</h2>
              <span className="cv-chapter-detail-date">{chapter.dateRange}</span>
            </div>
            <p className="cv-chapter-detail-summary">{chapter.summary}</p>

            <div className="cv-node-flow">
              {chapter.nodes.map((n, i) => (
                <React.Fragment key={n.id}>
                  <button
                    className="cv-node-card"
                    onClick={() => handleNodeClick(n.id)}
                  >
                    <span className="cv-node-type-badge" style={{ background: nodeTypeColor[n.type] }}>
                      {nodeTypeLabel[n.type]}
                    </span>
                    <span className="cv-node-label">{n.label}</span>
                    <span className="cv-node-desc">{n.description}</span>
                    {Object.keys(n.details).length > 0 && (
                      <div className="cv-node-details">
                        {Object.entries(n.details).map(([k, v]) => (
                          <span key={k} className="cv-node-detail-item">
                            {k}: <strong>{String(v)}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                  {i < chapter.nodes.length - 1 && (
                    <div className="cv-node-arrow">&darr;</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="cv-chapter-meta">
              {chapter.keyBattles.length > 0 && (
                <div className="cv-meta-section">
                  <h3 className="cv-meta-title">Key Battles</h3>
                  <div className="cv-meta-tags">
                    {chapter.keyBattles.map((b) => (
                      <span key={b} className="cv-meta-tag cv-meta-tag-battle">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="cv-meta-section">
                <h3 className="cv-meta-title">Commanders</h3>
                <div className="cv-commanders">
                  {chapter.keyCommanders.french.length > 0 && (
                    <div className="cv-commander-row">
                      <span className="cv-commander-label">French:</span>
                      {chapter.keyCommanders.french.map((c) => (
                        <span key={c} className="cv-meta-tag cv-meta-tag-french">{c}</span>
                      ))}
                    </div>
                  )}
                  {chapter.keyCommanders.austrian.length > 0 && (
                    <div className="cv-commander-row">
                      <span className="cv-commander-label">Austrian:</span>
                      {chapter.keyCommanders.austrian.map((c) => (
                        <span key={c} className="cv-meta-tag cv-meta-tag-austrian">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="cv-meta-section">
                <h3 className="cv-meta-title">Outcome</h3>
                <p className="cv-meta-text">{chapter.outcome}</p>
              </div>
            </div>
          </div>
        )}

        {/* Node level */}
        {zoomLevel === 'node' && node && chapter && (
          <div className="cv-node-detail">
            <div className="cv-node-detail-header">
              <span className="cv-node-type-badge" style={{ background: nodeTypeColor[node.type], fontSize: '0.85rem', padding: '0.2rem 0.8rem' }}>
                {nodeTypeLabel[node.type]}
              </span>
              <h2 className="cv-node-detail-title">{node.label}</h2>
            </div>
            <p className="cv-node-detail-desc">{node.description}</p>

            {Object.keys(node.details).length > 0 && (
              <div className="cv-node-detail-config">
                <h3 className="cv-meta-title">Configuration</h3>
                <div className="cv-node-detail-grid">
                  {Object.entries(node.details).map(([k, v]) => (
                    <div key={k} className="cv-config-item">
                      <span className="cv-config-key">{k}</span>
                      <span className="cv-config-val">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="cv-node-detail-context">
              <h3 className="cv-meta-title">Chapter Context</h3>
              <p className="cv-meta-text">
                Chapter {chapter.number}: {chapter.title} ({chapter.dateRange})
              </p>
              <p className="cv-meta-text">{chapter.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
