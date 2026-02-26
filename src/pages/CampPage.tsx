import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { CampActivities } from '../components/camp/CampActivities';
import { CampActionPanel } from '../components/camp/CampActionPanel';
import { CampSceneArt } from '../components/camp/CampSceneArt';
import { useCinematic } from '../hooks/useCinematic';
import { SplashOverlay } from '../components/overlays/SplashOverlay';
import { CinematicOverlay } from '../components/overlays/CinematicOverlay';
import { CharacterPanel } from '../components/overlays/CharacterPanel';
import { InventoryPanel } from '../components/overlays/InventoryPanel';
import type { CampState } from '../types';
import { CampActivityId } from '../types';
import {
  advanceCampTurn,
  resolveCampEvent as resolveCampEventAction,
  getCampActivities,
  isCampComplete,
  triggerForcedEvent,
  clearPendingEvent,
} from '../core/camp';
import { saveGame } from '../core/persistence';
import { getCampaignDef } from '../data/campaigns/registry';
import { getCurrentNode } from '../core/campaign';
import type { CampConfig } from '../data/campaigns/types';

// ── Constants ──

const CAMP_QUIPS = [
  '"That girl has been following us since Arcole, I swear it."',
  '"Click on her. I dare you. Dubois did and he got a promotion."',
  '"She knows things. Click and see."',
  '"Pierre says she speaks. You just have to click."',
  '"The girl in the corner \u2014 she said something about courage yesterday."',
  '"Go on, click the girl. What\'s the worst that happens?"',
  '"Leclerc says she\'s good luck. Touch the uniform and find out."',
  '"I clicked her three times. Now I see a different girl entirely."',
  '"They say if you click on her enough, she changes uniforms."',
  '"Jean-Baptiste won\'t shut up about the mascot girl."',
];

const MASCOT_IMAGES = [
  '/assets/mascot.png',
  '/assets/mascot-2.png',
  '/assets/mascot-3.png',
  '/assets/mascot-4.png',
  '/assets/mascot-5.png',
];

const SOLDIER_HEADS = [
  { x: 307, y: 280 },
  { x: 357, y: 278 },
  { x: 443, y: 276 },
  { x: 489, y: 278 },
];

// ── Reputation helpers ──

function repToLabel(rep: number): string {
  return rep > 70 ? 'Respected' : rep >= 40 ? 'Neutral' : 'Distrusted';
}

// ── Quip positioning helper ──

function positionQuipAboveSoldier(el: HTMLElement, soldierIdx: number) {
  const svgEl = document.querySelector('#camp-scene-art svg') as SVGSVGElement | null;
  const parent = document.querySelector('.camp-col-status') as HTMLElement | null;
  if (!svgEl || !parent) return;

  const head = SOLDIER_HEADS[soldierIdx];
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return;

  const pt = svgEl.createSVGPoint();
  pt.x = head.x;
  pt.y = head.y;
  const screenPt = pt.matrixTransform(ctm);

  const parentRect = parent.getBoundingClientRect();
  const relX = screenPt.x - parentRect.left;
  const relY = screenPt.y - parentRect.top;

  // getBoundingClientRect returns zoomed screen coords, but CSS left/top
  // operate in the unzoomed coordinate space inside the zoomed container.
  // Derive the total compound zoom from the parent's screen vs CSS dimensions.
  const totalZoom = parentRect.width / parent.offsetWidth || 1;

  el.style.left = `${relX / totalZoom}px`;
  el.style.top = `${(relY - 12) / totalZoom}px`;
  el.style.bottom = 'auto';
  el.style.right = 'auto';
}

// ── Main Component ──

export function CampPage() {
  const gameState = useGameStore((s) => s.gameState);
  const setGameState = useGameStore((s) => s.setGameState);

  const campActionCategory = useUiStore((s) => s.campActionCategory);
  const campActionResult = useUiStore((s) => s.campActionResult);
  const campLogCount = useUiStore((s) => s.campLogCount);
  const processing = useUiStore((s) => s.processing);

  const setCampActionCategory = useUiStore((s) => s.setCampActionCategory);
  const setCampActionResult = useUiStore((s) => s.setCampActionResult);
  const setCampActionSub = useUiStore((s) => s.setCampActionSub);
  const setProcessing = useUiStore((s) => s.setProcessing);

  const [activeOverlay, setActiveOverlay] = useState<'character' | 'inventory' | null>(null);
  const [campLogOpen, setCampLogOpen] = useState(false);

  const quipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const mascotIdxRef = useRef(0);
  const [mascotSrc, setMascotSrc] = useState(MASCOT_IMAGES[0]);

  const cinematic = useCinematic();

  // Trigger re-render after game state mutations
  const forceUpdate = useCallback(() => {
    if (gameState) {
      setGameState({ ...gameState });
    }
  }, [gameState, setGameState]);

  const camp = gameState?.campState;
  const player = gameState?.player;
  const npcs = gameState?.npcs;

  // ── Camp config lookup ──

  const campConfig = useMemo((): CampConfig | null => {
    if (!gameState?.campaign) return null;
    try {
      const def = getCampaignDef(gameState.campaign.campaignId);
      const node = getCurrentNode(gameState.campaign, def);
      if (!node || node.type !== 'camp') return null;
      return def.camps[node.campId] ?? null;
    } catch { return null; }
  }, [gameState?.campaign?.campaignId, gameState?.campaign?.sequenceIndex]);

  // ── Config-driven forced events ──

  useEffect(() => {
    if (!camp || !campConfig || !gameState) return;
    if (camp.pendingEvent) return;
    if (cinematic.cinematicConfig || cinematic.splashText) return;

    for (const fe of campConfig.forcedEvents) {
      if (camp.actionsRemaining <= fe.triggerAt && !camp.triggeredEvents.includes(fe.id)) {
        const event = fe.getEvent(camp, gameState.player);
        triggerForcedEvent(camp, event, fe.id);
        saveGame(gameState);
        forceUpdate();
        return;
      }
    }
  }, [camp?.actionsRemaining, camp?.pendingEvent, campConfig]);

  // ── Pending event rendering (via cinematic overlay) ──

  useEffect(() => {
    if (!camp?.pendingEvent) return;
    if (cinematic.cinematicConfig || cinematic.splashText) return;

    const event = camp.pendingEvent;
    const chunks = event.narrative.split('\n\n').filter((p) => p.trim());
    const choices = event.choices.map((c) => ({
      id: c.id,
      label: c.label,
      desc: c.description,
    }));

    cinematic.launchSplash('Fate Beckons...', () => ({
      title: event.title.toUpperCase(),
      chunks,
      ...(choices.length > 0
        ? { choices, onChoice: (id: string) => handleCampEventChoice(id) }
        : { onComplete: () => {
            if (camp) clearPendingEvent(camp);
            if (gameState) saveGame(gameState);
            cinematic.destroyCinematic();
            forceUpdate();
          }}),
    }));
  }, [camp?.pendingEvent]);

  function handleCampEventChoice(choiceId: string) {
    if (!gameState) return;

    const result = resolveCampEventAction(gameState, choiceId);
    saveGame(gameState);

    const resultNarrative = result.log
      .filter((e) => e.type === 'event' || e.type === 'result' || e.type === 'narrative')
      .map((e) => e.text)
      .join('\n\n');

    const changes: string[] = [];
    for (const [stat, delta] of Object.entries(result.statChanges)) {
      if (delta && delta !== 0) {
        const sign = delta > 0 ? '+' : '';
        changes.push(`${stat}: ${sign}${delta}`);
      }
    }
    if (result.moraleChange !== 0) {
      const sign = result.moraleChange > 0 ? '+' : '';
      changes.push(`morale: ${sign}${result.moraleChange}`);
    }
    if (result.staminaChange && result.staminaChange !== 0) {
      const sign = result.staminaChange > 0 ? '+' : '';
      changes.push(`stamina: ${sign}${result.staminaChange}`);
    }
    if (result.npcChanges) {
      for (const change of result.npcChanges) {
        const npc = gameState.npcs.find((n) => n.id === change.npcId);
        const name = npc ? npc.name : change.npcId;
        const sign = change.relationship > 0 ? '+' : '';
        changes.push(`${name}: ${sign}${change.relationship}`);
      }
    }

    if (cinematic.cinematicRef.current && resultNarrative.trim()) {
      const resultChunks = resultNarrative.split('\n\n').filter((p) => p.trim());

      cinematic.cinematicRef.current.showResult({
        chunks: resultChunks,
        changes: changes.length > 0 ? changes : undefined,
        rollDisplay: result.rollDisplay,
        onContinue: () => {
          cinematic.destroyCinematic();
          forceUpdate();
        },
      });
    } else {
      cinematic.destroyCinematic();
      forceUpdate();
    }
  }

  // ── Camp quips ──

  useEffect(() => {
    let idx = Math.floor(Math.random() * CAMP_QUIPS.length);
    let lastSoldier = -1;

    function showQuip() {
      const el = document.getElementById('camp-quip');
      if (!el) return;

      let soldierIdx: number;
      do {
        soldierIdx = Math.floor(Math.random() * SOLDIER_HEADS.length);
      } while (soldierIdx === lastSoldier && SOLDIER_HEADS.length > 1);
      lastSoldier = soldierIdx;

      el.textContent = CAMP_QUIPS[idx];
      positionQuipAboveSoldier(el, soldierIdx);
      el.classList.add('visible');

      quipTimerRef.current = setTimeout(() => {
        el.classList.remove('visible');
        idx = (idx + 1) % CAMP_QUIPS.length;
        quipTimerRef.current = setTimeout(showQuip, 12000 + Math.random() * 8000);
      }, 5000);
    }

    quipTimerRef.current = setTimeout(showQuip, 6000 + Math.random() * 4000);

    return () => {
      if (quipTimerRef.current !== null) {
        clearTimeout(quipTimerRef.current);
        quipTimerRef.current = null;
      }
      const el = document.getElementById('camp-quip');
      if (el) el.classList.remove('visible');
    };
  }, []);

  // ── Escape key closes action panel ──

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (activeOverlay !== null) {
          setActiveOverlay(null);
        } else if (campActionCategory !== null) {
          setCampActionCategory(null);
          setCampActionResult(null);
          setCampActionSub(null);
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [campActionCategory, activeOverlay, setCampActionCategory, setCampActionResult, setCampActionSub]);

  // ── Click outside closes action panel ──

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (campActionCategory === null) return;
      if (cinematic.cinematicConfig) return;
      const panel = document.getElementById('camp-action-panel');
      const activitiesCol = document.querySelector('.camp-col-activities');
      const target = e.target as Node;
      if (panel?.contains(target) || activitiesCol?.contains(target)) return;
      const statusCol = document.querySelector('.camp-col-status');
      if (statusCol?.contains(target)) {
        setCampActionCategory(null);
        setCampActionResult(null);
        setCampActionSub(null);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [campActionCategory, setCampActionCategory, setCampActionResult, setCampActionSub]);

  // ── Mascot click ──

  const handleMascotClick = useCallback(() => {
    mascotIdxRef.current = (mascotIdxRef.current + 1) % MASCOT_IMAGES.length;
    setMascotSrc(MASCOT_IMAGES[mascotIdxRef.current]);
  }, []);

  // ── Scroll narrative to bottom ──

  useEffect(() => {
    if (!narrativeRef.current || !camp) return;
    const container = narrativeRef.current;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [camp?.log.length]);

  // ── Activity handler ──

  const handleCampActivity = useCallback((activityId: CampActivityId, subId?: string) => {
    if (processing) return;
    if (!gameState || !gameState.campState) return;

    setProcessing(true);

    const campState = gameState.campState;
    const logBefore = campState.log.length;

    const result = advanceCampTurn(gameState, activityId, subId);
    saveGame(gameState);

    const newEntries = campState.log.slice(logBefore);
    const resultLines = newEntries.filter((e) => e.type === 'result').map((e) => e.text);
    const activityLines = newEntries.filter((e) => e.type === 'activity').map((e) => e.text);

    const changes: string[] = [];
    for (const [stat, delta] of Object.entries(result.statChanges)) {
      if (delta && delta !== 0) {
        const sign = delta > 0 ? '+' : '';
        changes.push(`${stat}: ${sign}${delta}`);
      }
    }
    if (result.moraleChange !== 0) {
      const sign = result.moraleChange > 0 ? '+' : '';
      changes.push(`morale: ${sign}${result.moraleChange}`);
    }
    if (result.staminaChange !== 0) {
      const sign = result.staminaChange > 0 ? '+' : '';
      changes.push(`stamina: ${sign}${result.staminaChange}`);
    }
    if (result.healthChange && result.healthChange !== 0) {
      const sign = result.healthChange > 0 ? '+' : '';
      changes.push(`health: ${sign}${result.healthChange}`);
    }
    if (result.npcChanges) {
      for (const change of result.npcChanges) {
        const npc = gameState.npcs.find((n) => n.id === change.npcId);
        const name = npc ? npc.name : change.npcId;
        const sign = change.relationship > 0 ? '+' : '';
        changes.push(`${name}: ${sign}${change.relationship}`);
      }
    }

    const allText = [...activityLines, ...resultLines].join('\n\n');

    setCampActionResult({ text: allText, changes });
    setProcessing(false);
    forceUpdate();
  }, [gameState, processing, setProcessing, setCampActionResult, forceUpdate]);

  // ── Category selection handler ──

  const handleSelectCategory = useCallback((id: string | null) => {
    setCampActionCategory(id);
    setCampActionResult(null);
    setCampActionSub(null);
  }, [setCampActionCategory, setCampActionResult, setCampActionSub]);

  // ── March handler (unified) ──

  const handleMarch = useCallback(() => {
    if (!gameState) return;
    useGameStore.getState().advanceToNext();
  }, [gameState]);

  // ── Guard: no data ──

  if (!gameState || !camp || !player || !npcs) return null;

  // ── Determine what's visible ──

  const campComplete = isCampComplete(camp);
  const hasPendingEvent = !!camp.pendingEvent;
  const activities = getCampActivities(player, camp);

  const spent = camp.actionsTotal - camp.actionsRemaining;
  const timePct = Math.min(100, (spent / camp.actionsTotal) * 100);

  const healthPct = Math.round(player.health);
  const staminaPct = Math.round(player.stamina);
  const moralePct = Math.round(player.morale);

  const statBars = [
    { label: 'Health', value: healthPct, color: 'var(--health-high)' },
    { label: 'Stamina', value: staminaPct, color: 'var(--stamina-high)' },
    { label: 'Morale', value: moralePct, color: 'var(--morale-high)' },
  ];

  const napoleonLabel = player.napoleonRep < 10 ? 'Unknown' : repToLabel(player.napoleonRep);

  // If camp complete, clear action panel state
  if (campComplete && campActionCategory !== null) {
    // Schedule state update for next tick to avoid updating during render
    setTimeout(() => {
      setCampActionCategory(null);
      setCampActionResult(null);
      setCampActionSub(null);
    }, 0);
  }

  const showActionPanel = !campComplete && !hasPendingEvent && campActionCategory !== null;

  return (
    <div className="camp-container" id="camp-container" style={{ display: 'flex' }}>
      {/* Header */}
      <div className="camp-header">
        <span className="camp-location" id="camp-location">{camp.conditions.location}</span>
        <div className="camp-header-portrait" onClick={() => setActiveOverlay('character')} style={{ cursor: 'pointer' }}>
          <div className="camp-portrait-mini-wrap">
            <div className="camp-portrait-mini" />
            {player.grace > 0 && (
              <span className="grace-badge grace-badge-camp">{'\u{1F33F}'}</span>
            )}
            {player.grace > 1 && (
              <span className="grace-badge grace-badge-camp grace-badge-left">{'\u{1F33F}'}</span>
            )}
          </div>
          <span className="camp-portrait-mini-name">{player.name}</span>
        </div>
        <div className="camp-meter-group">
          <div className="camp-meter-bar">
            <span className="camp-time-label">Health</span>
            <div className="camp-time-track">
              <div className="camp-meter-fill camp-meter-health" style={{ width: `${healthPct}%` }} />
            </div>
            <span className="camp-meter-value">{healthPct}%</span>
          </div>
          <div className="camp-meter-bar">
            <span className="camp-time-label">Stamina</span>
            <div className="camp-time-track">
              <div className="camp-meter-fill camp-meter-stamina" style={{ width: `${staminaPct}%` }} />
            </div>
            <span className="camp-meter-value">{staminaPct}%</span>
          </div>
          <div className="camp-meter-bar">
            <span className="camp-time-label">Morale</span>
            <div className="camp-time-track">
              <div className="camp-meter-fill camp-meter-morale" style={{ width: `${moralePct}%` }} />
            </div>
            <span className="camp-meter-value">{moralePct}%</span>
          </div>
        </div>
        <div className="camp-time-bar">
          <span className="camp-time-label">Time</span>
          <div className="camp-time-track">
            <div className="camp-time-fill" id="camp-time-fill" style={{ width: `${timePct}%` }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="camp-body">
        {/* Left column: activities + opinion */}
        <div className="camp-col-activities camp-column">
          <h3>Activities</h3>
          {!campComplete && !hasPendingEvent && (
            <CampActivities
              activities={activities}
              activeCategory={campActionCategory}
              onSelectCategory={handleSelectCategory}
            />
          )}
          {campComplete && (
            <button
              className="btn-march"
              id="btn-march"
              onClick={handleMarch}
            >
              March On
            </button>
          )}

          {/* Rank + Opinion */}
          <div className="camp-sidebar-rank">
            <span className="status-key">Rank</span>
            <span className="status-val">{player.rank}</span>
          </div>
          <h3>Opinion</h3>
          <div className="camp-npc-list" id="camp-npc-list">
            <div className="status-row">
              <span className="status-key">Soldiers</span>
              <span className="status-val">{repToLabel(player.soldierRep)}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Officers</span>
              <span className="status-val">{repToLabel(player.officerRep)}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Napoleon</span>
              <span className="status-val">{napoleonLabel}</span>
            </div>
          </div>
        </div>

        {/* Center column: status + art */}
        <div className="camp-col-status camp-column">
          {/* SVG backdrop */}
          <CampSceneArt />

          {/* Quip bubble */}
          <div className="camp-quip" id="camp-quip" />


          {/* Floating action panel */}
          {showActionPanel && (
            <CampActionPanel
              categoryId={campActionCategory!}
              onActivity={handleCampActivity}
            />
          )}

          {/* Strain bar (hidden per original code) */}
          <div className="camp-strain-bar" id="camp-strain-bar" style={{ display: 'none' }} />
        </div>

        {/* Right column: conditions + narrative */}
        <div className="camp-col-info camp-column">
          <h3>Conditions</h3>
          <div className="camp-conditions" id="camp-conditions">
            <div className="status-row">
              <span className="status-key">Weather</span>
              <span className="status-val">{camp.conditions.weather}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Supply</span>
              <span className="status-val">{camp.conditions.supplyLevel}</span>
            </div>
            <div className="status-row">
              <span className="status-key">Camp Morale</span>
              <span className="status-val">{camp.conditions.campMorale}</span>
            </div>
          </div>

          <h3
            className="camp-log-toggle"
            onClick={() => setCampLogOpen((o) => !o)}
          >
            <span className={`camp-log-chevron${campLogOpen ? ' open' : ''}`}>&#9656;</span>
            Camp Log
          </h3>
          {campLogOpen && (
            <div className="camp-narrative" id="camp-narrative" ref={narrativeRef}>
              {camp.log.map((entry, i) => (
                <div key={i} className={`camp-log-entry ${entry.type}`}>
                  {entry.text}
                </div>
              ))}
            </div>
          )}

          {/* Mascot — fills space below log */}
          <div className="camp-mascot-wrap">
            <img
              src={mascotSrc}
              alt="Mascot"
              className="camp-mascot"
              onClick={handleMascotClick}
            />
          </div>
        </div>
      </div>

      {/* Character / Inventory overlays */}
      {activeOverlay === 'character' && (
        <CharacterPanel
          player={player}
          battlePlayer={null}
          volleysFired={0}
          visible={true}
          onClose={() => setActiveOverlay(null)}
          onViewInventory={() => setActiveOverlay('inventory')}
        />
      )}
      {activeOverlay === 'inventory' && (
        <InventoryPanel
          player={player}
          battlePlayer={null}
          visible={true}
          onClose={() => setActiveOverlay(null)}
        />
      )}

      {/* Event overlay (hidden -- events use cinematic overlay now) */}
      <div className="camp-event-overlay" id="camp-event-overlay" style={{ display: 'none' }} />

      {/* Cinematic overlays */}
      {cinematic.splashText && <SplashOverlay text={cinematic.splashText} onProceed={cinematic.handleSplashProceed} />}
      {cinematic.cinematicConfig && <CinematicOverlay ref={cinematic.cinematicRef} config={cinematic.cinematicConfig} />}
    </div>
  );
}
