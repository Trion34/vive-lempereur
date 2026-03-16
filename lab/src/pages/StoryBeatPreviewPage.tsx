import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLabStore } from '../stores/labStore';

/* ------------------------------------------------------------------ */
/*  Story Beat Definitions (static catalogue)                          */
/* ------------------------------------------------------------------ */

interface BeatChoice {
  id: string;
  label: string;
  description: string;
  statCheck?: string;
}

interface StoryBeatDef {
  id: number;
  battle: string;
  title: string;
  narrativePreview: string;
  choices: BeatChoice[];
  sequenceOrder: number;
  phase: string;
}

const RIVOLI_BEATS: StoryBeatDef[] = [
  {
    id: 5, battle: 'Rivoli', title: 'The Wounded Sergeant',
    narrativePreview: 'At fifty paces, the Austrian volley tears through the line. Sergeant Duval — the granite-faced NCO who has held the section together since dawn — takes a ball in the thigh.\n\nHe goes down hard. His spontoon clatters against the stones. The section — your section — is without its NCO.\n\nThe line wavers. Men look to each other. Someone must act.',
    choices: [
      { id: 'take_command', label: "Take the sergeant's place", description: 'Pick up his spontoon. Give orders. [Valor + Charisma check]', statCheck: 'Valor + Charisma' },
      { id: 'rally_the_line', label: 'Rally the men around you', description: "You can't replace Duval. But you can shout. [Charisma check]", statCheck: 'Charisma' },
      { id: 'keep_your_head', label: 'Keep your head down', description: 'Not your job. Not your rank. Survive.' },
    ],
    sequenceOrder: 1, phase: 'Part 1',
  },
  {
    id: 6, battle: 'Rivoli', title: 'Fix Bayonets',
    narrativePreview: 'The last volley tears through the Austrian ranks at twenty-five paces. Point blank. The smoke has barely cleared when the drums change their beat — the pas de charge.\n\nBayonets rasp from scabbards. Steel clicks onto muzzles. Your musket becomes a spear.\n\nCaptain Leclerc\'s voice, one final time: "FOURTEENTH! EN AVANT!"',
    choices: [
      { id: 'fix_bayonets', label: 'Fix bayonets', description: 'Steel on steel.' },
    ],
    sequenceOrder: 2, phase: 'Part 1',
  },
  {
    id: 1, battle: 'Rivoli', title: 'The Battery',
    narrativePreview: 'Through the chaos, you hear it — the Austrians have overrun one of your batteries. French guns turning against French troops.\n\nCaptain Leclerc\'s voice: "FOURTEENTH! Will you let them take your guns?!"\n\nYou catch Pierre\'s eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of valor.',
    choices: [
      { id: 'charge_battery', label: 'Charge the battery', description: "Heed the captain's call. Charge into the teeth of your own guns." },
      { id: 'hold_back', label: 'Hold back', description: "Let braver souls lead. You've done enough." },
    ],
    sequenceOrder: 3, phase: 'Post-Melee',
  },
  {
    id: 2, battle: 'Rivoli', title: "Masséna's Arrival",
    narrativePreview: 'The sound comes from the south — drums. Not Austrian drums. French drums. Masséna\'s division slams into the Austrian flank. For the first time since dawn, the pressure on the 14th eases.\n\nCaptain Leclerc: "Five minutes, Fourteenth. Reform. Reload. This isn\'t over."',
    choices: [
      { id: 'tend_wounds', label: 'Tend your wounds', description: 'Bind your cuts, drink water, catch your breath.' },
      { id: 'check_comrades', label: 'Check on your comrades', description: "Find Pierre and Jean-Baptiste. See who's still standing." },
      { id: 'follow_the_screams', label: 'Follow the screaming', description: 'Someone is hurt. Your feet are already moving. [Intelligence check]', statCheck: 'Intelligence' },
    ],
    sequenceOrder: 4, phase: 'Part 2 Transition',
  },
  {
    id: 3, battle: 'Rivoli', title: 'The Gorge',
    narrativePreview: 'On the ridge above the plateau, a small figure on a grey horse. Bonaparte.\n\nAn aide-de-camp gallops down. The orders carry down the line:\n\n"Every man, every gun to the ridge! The counterattack goes in NOW!"\n\nCaptain Leclerc: "FOURTEENTH! To the ridge! We finish this!"',
    choices: [
      { id: 'accept_order', label: 'To the ridge', description: 'Follow the captain. Follow Bonaparte. One more time.' },
    ],
    sequenceOrder: 5, phase: 'Part 3 Transition',
  },
  {
    id: 4, battle: 'Rivoli', title: 'The Aftermath',
    narrativePreview: 'Victory. The Austrian column is defeated. Leclerc\'s chasseurs sweep into the centre. The rout spreads. Alvinczi joins the race to the rear.\n\nThe Battle of Rivoli is won. The 14th held the plateau through dawn.',
    choices: [
      { id: 'help_wounded', label: 'Help the wounded', description: 'Descend into the gorge. Tend to Austrian wounded. Mercy.' },
      { id: 'find_comrades', label: 'Find your comrades', description: 'Search for Pierre, Jean-Baptiste. See who survived.' },
      { id: 'sit_down', label: 'Sit down', description: 'Your legs stop working. You sit on the ridge and stare.' },
    ],
    sequenceOrder: 6, phase: 'Post-Gorge',
  },
];

const VOLTRI_BEATS: StoryBeatDef[] = [
  {
    id: 10, battle: 'Voltri', title: 'Fix Bayonets',
    narrativePreview: 'The Austrians are done exchanging volleys. A column surges up the slope, bayonets levelled.\n\nSergeant Morin: "FIX BAYONETS!"\n\nSteel rasps from scabbards. They\'re coming up the hill.',
    choices: [
      { id: 'voltri_fix_bayonets', label: 'Fix bayonets', description: "Steel on steel. They're coming up the hill." },
    ],
    sequenceOrder: 1, phase: 'Battle',
  },
  {
    id: 11, battle: 'Voltri', title: 'The Line Breaks',
    narrativePreview: 'A rider gallops up. "Withdrawal order. The whole garrison. Fall back to Savona."\n\nSergeant Morin: "Section! Form on me! We\'re pulling out — NOW!"\n\nThe question is how.',
    choices: [
      { id: 'fall_back', label: 'Fall back with section', description: 'Orderly retreat. Stay with Morin.' },
      { id: 'cover_retreat', label: 'Cover the retreat', description: 'Stay behind and fire. [Valor check]', statCheck: 'Valor' },
    ],
    sequenceOrder: 2, phase: 'Retreat',
  },
  {
    id: 12, battle: 'Voltri', title: 'The Coastal Road',
    narrativePreview: 'Night falls on the Ligurian coast. The column staggers west along the corniche road.\n\nAhead, a soldier has collapsed at the roadside. His pack is still on. He might be sleeping. He might be done.',
    choices: [
      { id: 'help_stragglers', label: 'Help the straggler', description: 'Haul him up. [Constitution check]', statCheck: 'Constitution' },
      { id: 'keep_moving', label: 'Keep moving', description: 'If you stop, you might not start again.' },
    ],
    sequenceOrder: 3, phase: 'Night March',
  },
  {
    id: 13, battle: 'Voltri', title: 'Cavalry Scare',
    narrativePreview: 'A sound in the darkness. Hooves.\n\n"Cavalry. Uhlans." Everyone freezes. The coastal road offers no cover.\n\nSergeant Morin: "Form a group. Stay together. If they charge, present bayonets."',
    choices: [
      { id: 'stand_firm', label: 'Stand firm', description: 'Present your bayonet. [Valor check]', statCheck: 'Valor' },
      { id: 'scatter_and_hide', label: 'Scatter and hide', description: 'Get off the road. Press flat.' },
    ],
    sequenceOrder: 4, phase: 'Night March (column)',
  },
  {
    id: 15, battle: 'Voltri', title: 'The Wounded Soldier',
    narrativePreview: 'After a mile, the straggler collapses again. In the faint starlight, you see it — blood, soaking through his trouser leg. A wound from the hilltop fighting.\n\nThe column is gone. It\'s just you and a bleeding man on a dark coast road.',
    choices: [
      { id: 'tend_wounds_voltri', label: 'Tend his wounds', description: 'Bind the leg, slow the bleeding. [Constitution check]', statCheck: 'Constitution' },
      { id: 'leave_wounded', label: 'Leave him', description: "You can't carry him. Walk away." },
    ],
    sequenceOrder: 5, phase: 'Night March (separation)',
  },
  {
    id: 17, battle: 'Voltri', title: 'Wounded Canteen',
    narrativePreview: 'The soldier is pale. The wound is bound but the march has taken its toll. He needs water.',
    choices: [
      { id: 'share_canteen', label: 'Share your canteen', description: 'Give him water. He needs it more.' },
      { id: 'conserve_supplies', label: 'Conserve supplies', description: 'You might need that water yourself.' },
    ],
    sequenceOrder: 6, phase: 'Night March (separation)',
  },
  {
    id: 16, battle: 'Voltri', title: 'The Homestead',
    narrativePreview: 'You see a light. A glow through shuttered windows, up the hillside. A farmstead. Smoke from a chimney.\n\nThe road stretches on into the darkness. Savona is still miles away.',
    choices: [
      { id: 'approach_homestead', label: 'Approach the farmstead', description: 'Knock on the door. [Charisma check]', statCheck: 'Charisma' },
      { id: 'shelter_in_barn', label: 'Shelter in the barn', description: "Don't bother the family." },
      { id: 'avoid_homestead', label: 'Keep walking', description: "Soldiers aren't welcome at farmsteads." },
    ],
    sequenceOrder: 7, phase: 'Night March (separation)',
  },
  {
    id: 14, battle: 'Voltri', title: 'Dawn at Savona',
    narrativePreview: 'Dawn. The sea is grey. The mountains are grey. Everything is grey.\n\nSavona appears around a headland — walls, towers, the promise of rest.\n\nWhat do you do?',
    choices: [
      { id: 'collapse_and_sleep', label: 'Collapse and sleep', description: 'Find a wall. Sit down. Let the exhaustion take you.' },
      { id: 'find_your_unit', label: 'Find your unit', description: "Report to Sergeant Morin. Account for yourself." },
    ],
    sequenceOrder: 8, phase: 'Epilogue',
  },
];

const ALL_BEATS = [...RIVOLI_BEATS, ...VOLTRI_BEATS];

/* ------------------------------------------------------------------ */
/*  Typewriter animation hook                                          */
/* ------------------------------------------------------------------ */

function useTypewriter(text: string, speed: number = 30): { displayed: string; done: boolean; skip: () => void } {
  const [index, setIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
    setSkipped(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [text]);

  useEffect(() => {
    if (skipped || index >= text.length) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= text.length - 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return text.length;
        }
        return prev + 1;
      });
    }, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, speed, skipped, index]);

  const skip = useCallback(() => {
    setSkipped(true);
    setIndex(text.length);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [text.length]);

  return {
    displayed: skipped ? text : text.slice(0, index + 1),
    done: index >= text.length - 1 || skipped,
    skip,
  };
}

/* ------------------------------------------------------------------ */
/*  Beat card component                                                */
/* ------------------------------------------------------------------ */

function BeatCard({ beat, active, onClick }: { beat: StoryBeatDef; active: boolean; onClick: () => void }) {
  return (
    <button className={`sb-card${active ? ' active' : ''}`} onClick={onClick}>
      <div className="sb-card-header">
        <span className="sb-card-battle">{beat.battle}</span>
        <span className="sb-card-phase">{beat.phase}</span>
      </div>
      <span className="sb-card-title">{beat.title}</span>
      <span className="sb-card-choices">{beat.choices.length} choice{beat.choices.length !== 1 ? 's' : ''}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview pane — cinematic renderer                                  */
/* ------------------------------------------------------------------ */

function PreviewPane({ beat, typeSpeed }: { beat: StoryBeatDef; typeSpeed: number }) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const { displayed, done, skip } = useTypewriter(beat.narrativePreview, typeSpeed);

  useEffect(() => {
    setSelectedChoice(null);
  }, [beat.id]);

  return (
    <div className="sb-preview">
      {/* Parchment header */}
      <div className="sb-preview-header">
        <span className="sb-preview-battle">{beat.battle}</span>
        <span className="sb-preview-title">{beat.title}</span>
        <span className="sb-preview-phase">{beat.phase}</span>
      </div>

      {/* Narrative text area */}
      <div className="sb-preview-narrative" onClick={!done ? skip : undefined}>
        {displayed.split('\n').map((line, i) => (
          <p key={i} className="sb-preview-line">
            {line || '\u00A0'}
          </p>
        ))}
        {!done && <span className="sb-preview-cursor">|</span>}
      </div>

      {/* Choice buttons */}
      {done && (
        <div className="sb-preview-choices">
          {beat.choices.map((choice) => (
            <button
              key={choice.id}
              className={`sb-choice-btn${selectedChoice === choice.id ? ' selected' : ''}`}
              onClick={() => setSelectedChoice(choice.id)}
            >
              <span className="sb-choice-label">{choice.label}</span>
              <span className="sb-choice-desc">{choice.description}</span>
              {choice.statCheck && (
                <span className="sb-choice-check">[{choice.statCheck}]</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected choice info */}
      {selectedChoice && (
        <div className="sb-choice-result">
          <span className="sb-choice-result-text">
            Choice selected: <strong>{beat.choices.find((c) => c.id === selectedChoice)?.label}</strong>
          </span>
          <span className="sb-choice-result-hint">
            In-game, this would resolve the story beat and advance the battle state.
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Branching flow diagram                                             */
/* ------------------------------------------------------------------ */

function BranchingFlow({ beats }: { beats: StoryBeatDef[] }) {
  return (
    <div className="sb-flow">
      <h3 className="cl-section-title">Beat Flow</h3>
      <div className="sb-flow-track">
        {beats.map((beat, i) => (
          <React.Fragment key={beat.id}>
            <div className="sb-flow-node">
              <span className="sb-flow-node-title">{beat.title}</span>
              <span className="sb-flow-node-choices">
                {beat.choices.map((c) => c.label).join(' | ')}
              </span>
            </div>
            {i < beats.length - 1 && <div className="sb-flow-arrow">&darr;</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type FilterBattle = 'all' | 'Rivoli' | 'Voltri';

export function StoryBeatPreviewPage() {
  const [filterBattle, setFilterBattle] = useState<FilterBattle>('all');
  const [selectedBeatId, setSelectedBeatId] = useState<number | null>(null);
  const [typeSpeed, setTypeSpeed] = useState(25);
  const [showFlow, setShowFlow] = useState(false);
  const { launchConfig, clearLaunchConfig } = useLabStore();

  useEffect(() => {
    if (launchConfig?.sourceNodeId) {
      // Apply battle filter from the label if present
      const label = String(launchConfig.label ?? launchConfig.sourceNodeId ?? '').toLowerCase();
      if (label.includes('rivoli')) setFilterBattle('Rivoli');
      else if (label.includes('voltri')) setFilterBattle('Voltri');

      // If a specific beat label matches, select it
      if (launchConfig.label) {
        const match = ALL_BEATS.find((b) => b.title.toLowerCase().includes(String(launchConfig.label).toLowerCase()));
        if (match) setSelectedBeatId(match.id);
      }
      clearLaunchConfig();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const beats = filterBattle === 'all' ? [...ALL_BEATS] : ALL_BEATS.filter((b) => b.battle === filterBattle);
    return beats.sort((a, b) => {
      if (a.battle !== b.battle) return a.battle === 'Rivoli' ? -1 : 1;
      return a.sequenceOrder - b.sequenceOrder;
    });
  }, [filterBattle]);

  useEffect(() => {
    if (filtered.length === 0) {
      if (selectedBeatId !== null) setSelectedBeatId(null);
      return;
    }
    if (selectedBeatId === null || !filtered.some((beat) => beat.id === selectedBeatId)) {
      setSelectedBeatId(filtered[0].id);
    }
  }, [filtered, selectedBeatId]);

  const activeBeat = useMemo(
    () => filtered.find((b) => b.id === selectedBeatId) ?? null,
    [filtered, selectedBeatId],
  );

  const flowBeats = useMemo(() => {
    if (!activeBeat) {
      return [...filtered];
    }
    const sourceBeats = activeBeat.battle === 'Rivoli' ? RIVOLI_BEATS : VOLTRI_BEATS;
    return [...sourceBeats].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }, [activeBeat, filtered]);

  return (
    <div className="sb-page">
      {/* Toolbar */}
      <div className="art-lab-toolbar">
        <span className="art-lab-toolbar-label">Battle:</span>
        {(['all', 'Rivoli', 'Voltri'] as FilterBattle[]).map((f) => (
          <button
            key={f}
            className={`art-lab-filter-btn${filterBattle === f ? ' active' : ''}`}
            onClick={() => setFilterBattle(f)}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
        <span className="art-lab-toolbar-divider" />
        <button
          className={`art-lab-filter-btn${showFlow ? ' active' : ''}`}
          onClick={() => setShowFlow(!showFlow)}
        >
          Beat Flow
        </button>
        <span className="art-lab-toolbar-divider" />
        <span className="art-lab-toolbar-label">Speed:</span>
        <input
          type="range"
          min={5}
          max={80}
          value={typeSpeed}
          onChange={(e) => setTypeSpeed(Number(e.target.value))}
          style={{ width: 80, accentColor: 'var(--accent-gold)' }}
        />
        <span className="art-lab-count" style={{ minWidth: 50 }}>{typeSpeed}ms</span>
        <span className="art-lab-count">{filtered.length} beats</span>
      </div>

      <div className="sb-content">
        {/* Beat gallery */}
        <div className="sb-gallery">
          {filtered.map((beat) => (
            <BeatCard
              key={beat.id}
              beat={beat}
              active={selectedBeatId === beat.id}
              onClick={() => setSelectedBeatId(beat.id)}
            />
          ))}
        </div>

        {/* Preview / Flow */}
        <div className="sb-main">
          {showFlow ? (
            <BranchingFlow beats={flowBeats} />
          ) : activeBeat ? (
            <PreviewPane beat={activeBeat} typeSpeed={typeSpeed} />
          ) : (
            <div className="si-empty">Select a story beat to preview.</div>
          )}
        </div>
      </div>
    </div>
  );
}
