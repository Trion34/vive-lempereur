import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import { CampActivities } from '../components/camp/CampActivities';
import { CampActionPanel } from '../components/camp/CampActionPanel';
import { CampSceneArt } from '../components/camp/CampSceneArt';
import { VoltriSceneArt } from '../components/camp/VoltriSceneArt';
import { useCinematic } from '../hooks/useCinematic';
import { useCampQuips } from '../hooks/useCampQuips';
import { SplashOverlay } from '../components/overlays/SplashOverlay';
import { CinematicOverlay } from '../components/overlays/CinematicOverlay';
import { CharacterPanel } from '../components/overlays/CharacterPanel';
import { InventoryPanel } from '../components/overlays/InventoryPanel';
import { CampaignMapPanel } from '../components/campaign-map/CampaignMapPanel';
import { CampActivityId } from '../types';
import {
  advanceCampTurn,
  resolveCampEvent as resolveCampEventAction,
  isCampComplete,
  triggerForcedEvent,
  triggerForcedVnEvent,
  resolveVnSceneResult,
  clearPendingEvent,
  hasPendingScene,
} from '../core/camp';
import { buildCampEventFromDeclarative } from '../core/campEventInterpreter';
import { getCampActivityList } from '../core/campActivities';
import { saveGame } from '../core/persistence';
import { getCampaignDef } from '../data/campaigns/registry';
import { getCurrentNode } from '../core/campaign';
import type { CampConfig } from '../data/campaigns/types';
import { VNOverlay } from '../components/overlays/VNOverlay';
import type { VNScene } from '../types/vnTypes';
import type { VNSceneResult } from '../core/vnSceneInterpreter';

// â”€â”€ Constants â”€â”€

const MASCOT_IMAGES = [
  '/assets/mascot.png',
  '/assets/mascot-2.png',
  '/assets/mascot-3.png',
  '/assets/mascot-4.png',
  '/assets/mascot-5.png',
];

// â”€â”€ Reputation helpers â”€â”€

function repToLabel(rep: number): string {
  return rep > 70 ? 'Respected' : rep >= 40 ? 'Neutral' : 'Distrusted';
}

// â”€â”€ Main Component â”€â”€

export function CampPage() {
  const gameState = useGameStore((s) => s.gameState);
  const setGameState = useGameStore((s) => s.setGameState);

  const campActionCategory = useUiStore((s) => s.campActionCategory);
  const processing = useUiStore((s) => s.processing);

  const setCampActionCategory = useUiStore((s) => s.setCampActionCategory);
  const setCampActionResult = useUiStore((s) => s.setCampActionResult);
  const setCampActionSub = useUiStore((s) => s.setCampActionSub);
  const setProcessing = useUiStore((s) => s.setProcessing);

  const [activeOverlay, setActiveOverlay] = useState<'character' | 'inventory' | null>(null);
  const [campLogOpen, setCampLogOpen] = useState(false);
  const [campaignMapOpen, setCampaignMapOpen] = useState(false);
  const [vnEndCardScene, setVnEndCardScene] = useState<VNScene | null>(null);

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
  // â”€â”€ Camp config lookup â”€â”€

  const campConfig = useMemo((): CampConfig | null => {
    if (!gameState?.campaign) return null;
    try {
      const def = getCampaignDef(gameState.campaign.campaignId);
      const node = getCurrentNode(gameState.campaign, def);
      if (!node || node.type !== 'camp') return null;
      return def.camps[node.campId] ?? null;
    } catch { return null; }
  }, [gameState?.campaign?.campaignId, gameState?.campaign?.sequenceIndex]);

  // â”€â”€ Config-driven forced events â”€â”€

  // Unified "VN flow active" signal — stays true through end card dismissal
  const vnFlowActive = !!camp?.pendingVnScene || !!vnEndCardScene;
  const hasPending = !!camp?.pendingEvent || vnFlowActive;

  useEffect(() => {
    if (!camp || !campConfig || !gameState) return;
    if (hasPending) return;
    if (cinematic.cinematicConfig || cinematic.splashText) return;

    for (const fe of campConfig.forcedEvents) {
      if (camp.actionsRemaining <= fe.triggerAt && !camp.triggeredEvents.includes(fe.id)) {
        // Skip events whose condition is not met
        if (fe.condition && !fe.condition(camp, gameState.player)) {
          camp.triggeredEvents.push(fe.id); // mark as handled so we don't re-check
          continue;
        }
        if (fe.kind === 'vn') {
          triggerForcedVnEvent(camp, fe.scene, fe.id, fe.title);
          saveGame(gameState);
          forceUpdate();
          return;
        }
        const event = fe.kind === 'declarative'
          ? buildCampEventFromDeclarative(fe.event, gameState.player)
          : fe.getEvent(camp, gameState.player);
        triggerForcedEvent(camp, event, fe.id);
        saveGame(gameState);
        forceUpdate();
        return;
      }
    }
  }, [camp?.actionsRemaining, hasPending, campConfig, gameState]);

  // â”€â”€ Pending event rendering (via cinematic overlay) â”€â”€

  useEffect(() => {
    if (!camp?.pendingEvent) return;
    if (cinematic.cinematicConfig || cinematic.splashText) return;

    const event = camp.pendingEvent;
    const chunks = event.narrative.split('\n\n').filter((p) => p.trim());
    const choices = event.choices.map((c) => ({
      id: c.id,
      label: c.label,
      desc: c.description,
      locked: c.locked,
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
    if (result.sousChange && result.sousChange !== 0) {
      const sign = result.sousChange > 0 ? '+' : '';
      changes.push(`sous: ${sign}${result.sousChange}`);
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

  // â”€â”€ Camp quips â”€â”€
  useCampQuips();

  // â”€â”€ Escape key closes action panel â”€â”€

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (campaignMapOpen) {
          setCampaignMapOpen(false);
        } else if (activeOverlay !== null) {
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
  }, [
    campActionCategory,
    activeOverlay,
    campaignMapOpen,
    setCampActionCategory,
    setCampActionResult,
    setCampActionSub,
  ]);

  // â”€â”€ Click outside closes action panel â”€â”€

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (campActionCategory === null) return;
      if (campaignMapOpen) return;
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
  }, [campActionCategory, campaignMapOpen, setCampActionCategory, setCampActionResult, setCampActionSub]);

  // â”€â”€ Mascot click â”€â”€

  const handleMascotClick = useCallback(() => {
    mascotIdxRef.current = (mascotIdxRef.current + 1) % MASCOT_IMAGES.length;
    setMascotSrc(MASCOT_IMAGES[mascotIdxRef.current]);
  }, []);

  // â”€â”€ Scroll narrative to bottom â”€â”€

  useEffect(() => {
    if (!narrativeRef.current || !camp) return;
    const container = narrativeRef.current;
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [camp?.log.length]);

  // â”€â”€ Activity handler â”€â”€

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
    if (result.sousChange && result.sousChange !== 0) {
      const sign = result.sousChange > 0 ? '+' : '';
      changes.push(`sous: ${sign}${result.sousChange}`);
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

  // â”€â”€ Category selection handler â”€â”€

  const handleSelectCategory = useCallback((id: CampActivityId | null) => {
    setCampActionCategory(id);
    setCampActionResult(null);
    setCampActionSub(null);
  }, [setCampActionCategory, setCampActionResult, setCampActionSub]);

  // â”€â”€ March handler (unified) â”€â”€

  const handleMarch = useCallback(() => {
    if (!gameState) return;
    useGameStore.getState().advanceToNext();
  }, [gameState]);

  // â”€â”€ Guard: no data â”€â”€

  if (!gameState || !camp || !player || !npcs) return null;

  // â”€â”€ Determine what's visible â”€â”€

  const campComplete = isCampComplete(camp);
  const hasPendingEvent = hasPending;
  const activities = getCampActivityList(player, camp);

  const spent = camp.actionsTotal - camp.actionsRemaining;
  const timePct = Math.min(100, (spent / camp.actionsTotal) * 100);

  const healthPct = Math.round(player.health);
  const staminaPct = Math.round(player.stamina);
  const moralePct = Math.round(player.morale);

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
          {campConfig?.id === 'voltri-garrison' ? <VoltriSceneArt /> : <CampSceneArt />}

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

          <h3>Campaign</h3>
          <div className="camp-map-summary">
            <button
              type="button"
              className="camp-map-launch"
              onClick={() => setCampaignMapOpen(true)}
            >
              Open Campaign Map
            </button>
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

          {/* Mascot â€” fills space below log */}
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

      {campaignMapOpen && (
        <CampaignMapPanel
          onClose={() => setCampaignMapOpen(false)}
        />
      )}

      {/* Cinematic overlays */}
      {cinematic.splashText && <SplashOverlay text={cinematic.splashText} onProceed={cinematic.handleSplashProceed} />}
      {cinematic.cinematicConfig && <CinematicOverlay ref={cinematic.cinematicRef} config={cinematic.cinematicConfig} />}

      {/* VN scene overlay — shown for kind:'vn' camp events */}
      {(camp.pendingVnScene || vnEndCardScene) && gameState && (
        <VNOverlay
          scene={(camp.pendingVnScene?.scene ?? vnEndCardScene)!}
          gameContext={{
            player: gameState.player,
            npcs: gameState.npcs,
            campFlags: camp.flags,
          }}
          onSceneResult={(result: VNSceneResult) => {
            setVnEndCardScene(camp.pendingVnScene!.scene); // keep overlay mounted during end card
            resolveVnSceneResult(gameState, result);        // applies effects + clears pendingVnScene
            saveGame(gameState);                            // crash-safe: no pending + effects committed
          }}
          onEnd={() => {
            setVnEndCardScene(null);                        // unmount overlay
            forceUpdate();
          }}
        />
      )}
    </div>
  );
}

