import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLabStore } from '../stores/labStore';

/* ------------------------------------------------------------------ */
/*  Camp Activity Data (mirrors src/core/campActivities.ts)            */
/* ------------------------------------------------------------------ */

interface ActivityDef {
  id: string;
  name: string;
  category: 'rest' | 'exercise' | 'arms' | 'duties' | 'socialize';
  description: string;
  staminaCost: number;
  statsAffected: string[];
  repRequirement?: { field: string; min: number };
}

const ACTIVITIES: ActivityDef[] = [
  // Rest
  { id: 'lay_about', name: 'Lay About', category: 'rest', description: 'Rest and recover stamina. +15 stamina, +5 morale.', staminaCost: 0, statsAffected: ['stamina', 'morale'] },
  { id: 'bathe', name: 'Bathe', category: 'rest', description: 'Clean up at the stream. +10 morale, +5 health. 3-action cooldown.', staminaCost: 0, statsAffected: ['morale', 'health'] },
  { id: 'pray', name: 'Pray', category: 'rest', description: 'Find solace in prayer. +8 morale. Once per camp.', staminaCost: 0, statsAffected: ['morale'] },

  // Exercise
  { id: 'haul', name: 'Haul', category: 'exercise', description: 'Drag supplies and fortifications. Trains Strength + Endurance.', staminaCost: 10, statsAffected: ['strength', 'endurance'] },
  { id: 'wrestle', name: 'Wrestle', category: 'exercise', description: 'Grapple with a comrade. Trains Strength + Constitution.', staminaCost: 10, statsAffected: ['strength', 'constitution'] },
  { id: 'run', name: 'Run', category: 'exercise', description: 'Run the camp perimeter. Trains Endurance + Constitution.', staminaCost: 10, statsAffected: ['endurance', 'constitution'] },

  // Arms Training
  { id: 'solo_musketry', name: 'Solo Musketry', category: 'arms', description: 'Practice loading and firing alone. Musketry cap 50.', staminaCost: 10, statsAffected: ['musketry'] },
  { id: 'solo_elan', name: 'Solo Élan', category: 'arms', description: 'Practice bayonet drill alone. Élan cap 50.', staminaCost: 10, statsAffected: ['elan'] },
  { id: 'comrades_musketry', name: 'Comrades Musketry', category: 'arms', description: 'Train with fellow soldiers. Cap 70. Requires soldierRep ≥20.', staminaCost: 10, statsAffected: ['musketry'], repRequirement: { field: 'soldierRep', min: 20 } },
  { id: 'comrades_elan', name: 'Comrades Élan', category: 'arms', description: 'Train bayonet with comrades. Cap 70. Requires soldierRep ≥20.', staminaCost: 10, statsAffected: ['elan'], repRequirement: { field: 'soldierRep', min: 20 } },
  { id: 'officers_musketry', name: 'Officers Musketry', category: 'arms', description: 'Officers oversee drill. Cap 85. Requires officerRep ≥50.', staminaCost: 10, statsAffected: ['musketry'], repRequirement: { field: 'officerRep', min: 50 } },
  { id: 'officers_elan', name: 'Officers Élan', category: 'arms', description: 'Officers oversee bayonet drill. Cap 85. Requires officerRep ≥50.', staminaCost: 10, statsAffected: ['elan'], repRequirement: { field: 'officerRep', min: 50 } },

  // Duties
  { id: 'forage', name: 'Forage', category: 'duties', description: 'Search for food and supplies. Awareness check. +soldierRep, +health on success.', staminaCost: 10, statsAffected: ['health', 'soldierRep'] },
  { id: 'check_equipment', name: 'Check Equipment', category: 'duties', description: 'Inspect and repair your kit. Improves musket/uniform condition.', staminaCost: 5, statsAffected: ['equipment'] },
  { id: 'volunteer', name: 'Volunteer for Duty', category: 'duties', description: 'Take on an extra assignment. Random task.', staminaCost: 15, statsAffected: ['officerRep'] },
  { id: 'tend_wounded', name: 'Tend Wounded', category: 'duties', description: 'Help the surgeon. Requires Medicine attribute.', staminaCost: 10, statsAffected: ['health', 'officerRep'] },

  // Socialize
  { id: 'socialize_npc', name: 'Talk to Comrade', category: 'socialize', description: 'Sit with an NPC. Shows their socialize narrative. No action cost.', staminaCost: 0, statsAffected: ['relationship'] },
  { id: 'write_letter', name: 'Write a Letter', category: 'socialize', description: 'Write home. Requires Literate attribute.', staminaCost: 0, statsAffected: ['morale'] },
];

/* ------------------------------------------------------------------ */
/*  Reputation Gate Data                                               */
/* ------------------------------------------------------------------ */

interface RepGate {
  field: string;
  threshold: number;
  label: string;
  unlocks: string;
}

const REP_GATES: RepGate[] = [
  { field: 'soldierRep', threshold: 0, label: 'Soldier Rep 0+', unlocks: 'Solo Arms Training (cap 50)' },
  { field: 'soldierRep', threshold: 20, label: 'Soldier Rep 20+', unlocks: 'Comrades Arms Training (cap 70)' },
  { field: 'soldierRep', threshold: 40, label: 'Soldier Rep 40+', unlocks: 'Neutral standing with soldiers' },
  { field: 'soldierRep', threshold: 70, label: 'Soldier Rep 70+', unlocks: 'Respected by soldiers' },
  { field: 'officerRep', threshold: 50, label: 'Officer Rep 50+', unlocks: 'Officers Arms Training (cap 85)' },
  { field: 'officerRep', threshold: 70, label: 'Officer Rep 70+', unlocks: 'Respected by officers' },
  { field: 'napoleonRep', threshold: 10, label: 'Napoleon Rep 10+', unlocks: 'Napoleon knows you exist' },
];

/* ------------------------------------------------------------------ */
/*  Camp Event Data                                                    */
/* ------------------------------------------------------------------ */

interface CampEventDef {
  id: string;
  title: string;
  type: 'forced' | 'random';
  trigger: string;
  camp: string;
  description: string;
}

const CAMP_EVENTS: CampEventDef[] = [
  { id: 'campfires', title: 'Campfires', type: 'forced', trigger: '6 actions remaining', camp: 'Rivoli', description: 'Soldiers gather around campfires. Stories, songs, and camaraderie.' },
  { id: 'briefing', title: "Officer's Briefing", type: 'forced', trigger: '4 actions remaining', camp: 'Rivoli', description: 'The officers brief the men on tomorrow\'s battle plan.' },
  { id: 'night_before', title: 'The Night Before', type: 'forced', trigger: '2 actions remaining', camp: 'Rivoli', description: 'A quiet moment before battle. Reflection and dread.' },
  { id: 'bonaparte', title: 'Bonaparte Arrives', type: 'forced', trigger: '1 action remaining', camp: 'Rivoli', description: 'Napoleon himself rides through the camp.' },
  { id: 'pierre_story', title: "Pierre's Story", type: 'random', trigger: '40% chance', camp: 'Rivoli', description: 'Pierre shares a story from Arcole.' },
  { id: 'short_rations', title: 'Short Rations', type: 'random', trigger: '40% chance', camp: 'Rivoli', description: 'Rations are cut short. The men grumble.' },
  { id: 'jb_fear', title: "JB's Fear", type: 'random', trigger: '40% chance', camp: 'Rivoli', description: 'Jean-Baptiste confides his fear of battle.' },
];

/* ------------------------------------------------------------------ */
/*  Stat Check Simulator                                               */
/* ------------------------------------------------------------------ */

function StatCheckSimulator() {
  const [stat, setStat] = useState(40);
  const [difficulty, setDifficulty] = useState(50);
  const [rolls, setRolls] = useState<boolean[]>([]);

  const runRolls = useCallback((count: number) => {
    const results: boolean[] = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      results.push(roll < stat + (stat - difficulty) * 0.5);
    }
    setRolls((prev) => [...prev, ...results]);
  }, [stat, difficulty]);

  const successRate = useMemo(() => {
    if (rolls.length === 0) return 0;
    return (rolls.filter(Boolean).length / rolls.length) * 100;
  }, [rolls]);

  return (
    <div className="cl-sim">
      <h3 className="cl-section-title">Stat Check Simulator</h3>
      <div className="cl-sim-controls">
        <label className="cl-sim-field">
          <span>Stat Value</span>
          <input type="range" min={0} max={100} value={stat} onChange={(e) => { setStat(Number(e.target.value)); setRolls([]); }} />
          <span className="cl-sim-val">{stat}</span>
        </label>
        <label className="cl-sim-field">
          <span>Difficulty</span>
          <input type="range" min={0} max={100} value={difficulty} onChange={(e) => { setDifficulty(Number(e.target.value)); setRolls([]); }} />
          <span className="cl-sim-val">{difficulty}</span>
        </label>
        <div className="cl-sim-buttons">
          <button className="art-lab-filter-btn" onClick={() => runRolls(10)}>Roll 10</button>
          <button className="art-lab-filter-btn" onClick={() => runRolls(100)}>Roll 100</button>
          <button className="art-lab-filter-btn" onClick={() => runRolls(1000)}>Roll 1000</button>
          <button className="art-lab-small-btn" onClick={() => setRolls([])}>Clear</button>
        </div>
      </div>
      {rolls.length > 0 && (
        <div className="cl-sim-results">
          <div className="cl-sim-bar">
            <div className="cl-sim-bar-fill" style={{ width: `${successRate}%` }} />
          </div>
          <span className="cl-sim-rate">
            {rolls.filter(Boolean).length}/{rolls.length} passed ({successRate.toFixed(1)}%)
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type CampTab = 'activities' | 'events' | 'reputation' | 'simulator';

export function CampLabPage() {
  const [tab, setTab] = useState<CampTab>('activities');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [configSummary, setConfigSummary] = useState<string | null>(null);
  const { launchConfig, clearLaunchConfig } = useLabStore();

  useEffect(() => {
    if (launchConfig?.sourceNodeId) {
      // Apply cross-launch config
      const parts: string[] = [];
      if (launchConfig.actions != null) parts.push(`Actions: ${launchConfig.actions}`);
      if (launchConfig.weather != null) parts.push(`Weather: ${launchConfig.weather}`);
      if (launchConfig.supply != null) parts.push(`Supply: ${launchConfig.supply}`);
      if (parts.length > 0) setConfigSummary(parts.join(' | '));
      // Switch to events tab if launched from campaign editor camp node
      setTab('events');
      clearLaunchConfig();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredActivities = useMemo(
    () => categoryFilter === 'all' ? ACTIVITIES : ACTIVITIES.filter((a) => a.category === categoryFilter),
    [categoryFilter],
  );

  return (
    <div className="cl-page">
      <div className="art-lab-toolbar">
        {(['activities', 'events', 'reputation', 'simulator'] as CampTab[]).map((t) => (
          <button
            key={t}
            className={`art-lab-filter-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'activities' ? 'Activities' : t === 'events' ? 'Events' : t === 'reputation' ? 'Rep Gates' : 'Stat Sim'}
          </button>
        ))}
        {configSummary && (
          <>
            <span className="art-lab-toolbar-divider" />
            <span className="art-lab-count">{configSummary}</span>
          </>
        )}
      </div>

      <div className="cl-content">
        {tab === 'activities' && (
          <div className="cl-activities">
            <div className="cl-activity-filter">
              {['all', 'rest', 'exercise', 'arms', 'duties', 'socialize'].map((cat) => (
                <button
                  key={cat}
                  className={`art-lab-filter-btn${categoryFilter === cat ? ' active' : ''}`}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
              <span className="art-lab-count">{filteredActivities.length} activities</span>
            </div>
            <div className="cl-activity-grid">
              {filteredActivities.map((act) => (
                <div key={act.id} className="cl-activity-card">
                  <div className="cl-activity-header">
                    <span className="cl-activity-name">{act.name}</span>
                    <span className={`cl-activity-cat cl-cat-${act.category}`}>{act.category}</span>
                  </div>
                  <p className="cl-activity-desc">{act.description}</p>
                  <div className="cl-activity-meta">
                    {act.staminaCost > 0 && <span className="cl-activity-cost">-{act.staminaCost} stamina</span>}
                    {act.statsAffected.length > 0 && (
                      <span className="cl-activity-stats">{act.statsAffected.join(', ')}</span>
                    )}
                    {act.repRequirement && (
                      <span className="cl-activity-req">Requires {act.repRequirement.field} ≥{act.repRequirement.min}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'events' && (
          <div className="cl-events">
            <div className="cl-event-grid">
              {CAMP_EVENTS.map((evt) => (
                <div key={evt.id} className="cl-event-card">
                  <div className="cl-event-header">
                    <span className="cl-event-name">{evt.title}</span>
                    <span className={`cl-event-type cl-event-${evt.type}`}>{evt.type}</span>
                  </div>
                  <p className="cl-event-desc">{evt.description}</p>
                  <div className="cl-event-meta">
                    <span className="cl-event-trigger">{evt.trigger}</span>
                    <span className="cl-event-camp">{evt.camp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'reputation' && (
          <div className="cl-reputation">
            <div className="cl-rep-grid">
              {REP_GATES.map((gate, i) => (
                <div key={i} className="cl-rep-card">
                  <div className="cl-rep-header">
                    <span className="cl-rep-field">{gate.field}</span>
                    <span className="cl-rep-threshold">≥ {gate.threshold}</span>
                  </div>
                  <p className="cl-rep-unlocks">{gate.unlocks}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'simulator' && <StatCheckSimulator />}
      </div>
    </div>
  );
}
