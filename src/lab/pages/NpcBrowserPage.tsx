import React, { useState, useMemo } from 'react';
import { NPCRole, MilitaryRank } from '../../types';

/* ------------------------------------------------------------------ */
/*  NPC data — pulled from src/data/campaigns/italy/index.ts           */
/* ------------------------------------------------------------------ */

interface NpcTemplate {
  id: string;
  name: string;
  role: NPCRole;
  rank: MilitaryRank;
  personality: string;
  socializeNarrative?: string;
  baseStats: {
    valor: number;
    morale: number;
    maxMorale: number;
    relationship: number;
  };
  source: 'voltri' | 'rivoli' | 'replacement';
  battlesAppearsIn: string[];
}

const ALL_NPCS: NpcTemplate[] = [
  // Voltri garrison
  {
    id: 'morin', name: 'Sergeant Morin', role: NPCRole.NCO, rank: MilitaryRank.Sergeant,
    personality: 'The section sergent. Practical, tired, fair. Keeps the men together.',
    socializeNarrative: 'Sergeant Morin shares his pipe and stares at the sea. "I was at Valmy," he says. "The Revolution\'s first battle. We stood in the rain and the Prussians turned back. I thought the war was over." He laughs, short and bitter.',
    baseStats: { valor: 60, morale: 90, maxMorale: 100, relationship: 30 },
    source: 'voltri', battlesAppearsIn: ['Voltri'],
  },
  {
    id: 'vidal', name: 'Lieutenant Vidal', role: NPCRole.Officer, rank: MilitaryRank.Lieutenant,
    personality: 'Company officer. Ambitious but distant. Thinks about promotion, not his men.',
    socializeNarrative: 'Lieutenant Vidal is studying a map by candlelight. He acknowledges you with a nod but doesn\'t look up. "The passes," he mutters. "If they come through the passes..." He trails off. You leave him to his thoughts.',
    baseStats: { valor: 45, morale: 80, maxMorale: 100, relationship: 20 },
    source: 'voltri', battlesAppearsIn: ['Voltri'],
  },
  {
    id: 'felix', name: 'Felix Martel', role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    personality: 'A former traveling musician turned soldier. Quick with cards and quicker with excuses.',
    socializeNarrative: 'Felix produces a battered deck of cards from nowhere. "I\'ll teach you a trick," he says, shuffling one-handed. "Not a card trick — a life trick. Always look like you belong, and never be the last one to leave." He grins. "Works in the army. Worked better in the theatre."',
    baseStats: { valor: 30, morale: 75, maxMorale: 85, relationship: 10 },
    source: 'voltri', battlesAppearsIn: ['Voltri'],
  },
  // Rivoli
  {
    id: 'pierre', name: 'Pierre', role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    personality: 'A veteran of Arcole and Lodi. Quiet, steady, unshakeable.',
    socializeNarrative: 'Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that\'s a speech.',
    baseStats: { valor: 55, morale: 90, maxMorale: 100, relationship: 60 },
    source: 'rivoli', battlesAppearsIn: ['Rivoli'],
  },
  {
    id: 'jean-baptiste', name: 'Jean-Baptiste', role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    personality: 'A young conscript from a bakery in Lyon. Nervous but loyal.',
    socializeNarrative: 'Jean-Baptiste talks rapidly about home \u2014 the bakery, the river, his sister\'s cat. You listen. Sometimes listening is enough.',
    baseStats: { valor: 20, morale: 70, maxMorale: 85, relationship: 40 },
    source: 'rivoli', battlesAppearsIn: ['Rivoli'],
  },
  {
    id: 'duval', name: 'Sergeant Duval', role: NPCRole.NCO, rank: MilitaryRank.Sergeant,
    personality: 'A grizzled NCO who has seen too many campaigns. Fair but demanding.',
    socializeNarrative: 'Sergeant Duval grumbles about the rations, the officers, the war. But there\'s a grudging warmth underneath. "At least you\'re not useless," he says.',
    baseStats: { valor: 65, morale: 95, maxMorale: 100, relationship: 20 },
    source: 'rivoli', battlesAppearsIn: ['Rivoli'],
  },
  {
    id: 'leclerc', name: 'Captain Leclerc', role: NPCRole.Officer, rank: MilitaryRank.Captain,
    personality: 'An ambitious officer who dreams of glory. Charismatic but self-serving.',
    socializeNarrative: 'Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We\'ll make captain yet," he says. He means himself, but includes you in the dream.',
    baseStats: { valor: 60, morale: 90, maxMorale: 100, relationship: 30 },
    source: 'rivoli', battlesAppearsIn: ['Rivoli'],
  },
  // Replacement pool
  {
    id: 'girard', name: 'Girard', role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    personality: 'A quiet conscript from Lyon, steady under fire but slow to warm to strangers.',
    baseStats: { valor: 30, morale: 70, maxMorale: 100, relationship: 20 },
    source: 'replacement', battlesAppearsIn: [],
  },
  {
    id: 'moreau', name: 'Moreau', role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    personality: 'A former seminary student who found his calling with a musket. Pious and brave.',
    baseStats: { valor: 35, morale: 80, maxMorale: 100, relationship: 30 },
    source: 'replacement', battlesAppearsIn: [],
  },
  {
    id: 'thibault', name: 'Thibault', role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    personality: 'A wiry Gascon with a sharp tongue and sharper bayonet. Fiercely loyal once trust is earned.',
    baseStats: { valor: 45, morale: 75, maxMorale: 100, relationship: 10 },
    source: 'replacement', battlesAppearsIn: [],
  },
  {
    id: 'renard', name: 'Sergeant Renard', role: NPCRole.NCO, rank: MilitaryRank.Sergeant,
    personality: 'An old campaigner from the Rhine army. Fair-minded but expects discipline.',
    baseStats: { valor: 55, morale: 90, maxMorale: 100, relationship: 25 },
    source: 'replacement', battlesAppearsIn: [],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const roleLabel: Record<NPCRole, string> = {
  [NPCRole.Neighbour]: 'Neighbour',
  [NPCRole.Officer]: 'Officer',
  [NPCRole.NCO]: 'NCO',
};

const rankLabel: Record<MilitaryRank, string> = {
  [MilitaryRank.Private]: 'Private',
  [MilitaryRank.Corporal]: 'Corporal',
  [MilitaryRank.Sergeant]: 'Sergeant',
  [MilitaryRank.Lieutenant]: 'Lieutenant',
  [MilitaryRank.Captain]: 'Captain',
};

const sourceLabel: Record<string, string> = {
  voltri: 'Voltri Garrison',
  rivoli: 'Rivoli / 14th Demi-Brigade',
  replacement: 'Replacement Pool',
};

type FilterSource = 'all' | 'voltri' | 'rivoli' | 'replacement';
type FilterRole = 'all' | NPCRole;

/* ------------------------------------------------------------------ */
/*  Stat bar component                                                 */
/* ------------------------------------------------------------------ */

function StatBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="npc-stat-bar">
      <span className="npc-stat-label">{label}</span>
      <div className="npc-stat-track">
        <div className="npc-stat-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="npc-stat-val">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function NpcBrowserPage() {
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [filterRole, setFilterRole] = useState<FilterRole>('all');

  const filteredNpcs = useMemo(() => {
    return ALL_NPCS.filter((npc) => {
      if (filterSource !== 'all' && npc.source !== filterSource) return false;
      if (filterRole !== 'all' && npc.role !== filterRole) return false;
      return true;
    });
  }, [filterSource, filterRole]);

  const active = ALL_NPCS.find((n) => n.id === selectedNpc);

  return (
    <div className="npc-browser">
      {/* Toolbar */}
      <div className="art-lab-toolbar">
        <span className="art-lab-toolbar-label">Source:</span>
        {(['all', 'voltri', 'rivoli', 'replacement'] as FilterSource[]).map((f) => (
          <button
            key={f}
            className={`art-lab-filter-btn${filterSource === f ? ' active' : ''}`}
            onClick={() => setFilterSource(f)}
          >
            {f === 'all' ? 'All' : sourceLabel[f]}
          </button>
        ))}
        <span className="art-lab-toolbar-divider" />
        <span className="art-lab-toolbar-label">Role:</span>
        <button
          className={`art-lab-filter-btn${filterRole === 'all' ? ' active' : ''}`}
          onClick={() => setFilterRole('all')}
        >All</button>
        {([NPCRole.Neighbour, NPCRole.NCO, NPCRole.Officer] as NPCRole[]).map((r) => (
          <button
            key={r}
            className={`art-lab-filter-btn${filterRole === r ? ' active' : ''}`}
            onClick={() => setFilterRole(r)}
          >
            {roleLabel[r]}
          </button>
        ))}
        <span className="art-lab-count">{filteredNpcs.length} NPCs</span>
      </div>

      <div className="npc-layout">
        {/* Gallery grid */}
        <div className="npc-gallery">
          {filteredNpcs.map((npc) => (
            <button
              key={npc.id}
              className={`npc-card${selectedNpc === npc.id ? ' active' : ''}`}
              onClick={() => setSelectedNpc(npc.id)}
            >
              <div className="npc-card-portrait">
                <span className="npc-card-portrait-icon">
                  {npc.role === NPCRole.Officer ? '\u2606' : npc.role === NPCRole.NCO ? '\u2740' : '\u2022'}
                </span>
              </div>
              <div className="npc-card-info">
                <span className="npc-card-name">{npc.name}</span>
                <span className="npc-card-rank">{rankLabel[npc.rank]}</span>
                <span className="npc-card-role">{roleLabel[npc.role]}</span>
              </div>
              <span className={`npc-card-source npc-source-${npc.source}`}>
                {npc.source === 'replacement' ? 'Reserve' : npc.source}
              </span>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="npc-detail">
          {active ? (
            <>
              <div className="npc-detail-header">
                <div className="npc-detail-portrait">
                  <span className="npc-detail-portrait-icon">
                    {active.role === NPCRole.Officer ? '\u2606' : active.role === NPCRole.NCO ? '\u2740' : '\u2022'}
                  </span>
                </div>
                <div>
                  <h2 className="npc-detail-name">{active.name}</h2>
                  <p className="npc-detail-rank">
                    {rankLabel[active.rank]} &middot; {roleLabel[active.role]} &middot; {sourceLabel[active.source]}
                  </p>
                </div>
              </div>

              <div className="npc-detail-section">
                <h3 className="npc-detail-section-title">Personality</h3>
                <p className="npc-detail-text">{active.personality}</p>
              </div>

              {active.socializeNarrative && (
                <div className="npc-detail-section">
                  <h3 className="npc-detail-section-title">Socialize Dialogue</h3>
                  <p className="npc-detail-narrative">{active.socializeNarrative}</p>
                </div>
              )}

              <div className="npc-detail-section">
                <h3 className="npc-detail-section-title">Base Stats</h3>
                <div className="npc-detail-stats">
                  <StatBar label="Valor" value={active.baseStats.valor} color="var(--accent-gold)" />
                  <StatBar label="Morale" value={active.baseStats.morale} color="var(--morale-high)" />
                  <StatBar label="Max Morale" value={active.baseStats.maxMorale} color="var(--morale-mid)" />
                  <StatBar label="Relationship" value={active.baseStats.relationship} color="var(--stamina-high)" />
                </div>
              </div>

              {active.battlesAppearsIn.length > 0 && (
                <div className="npc-detail-section">
                  <h3 className="npc-detail-section-title">Appears In</h3>
                  <div className="npc-detail-tags">
                    {active.battlesAppearsIn.map((b) => (
                      <span key={b} className="npc-detail-tag">{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="si-empty">Select an NPC to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
