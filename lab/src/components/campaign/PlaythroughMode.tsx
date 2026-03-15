import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { CampaignChapter, ChapterNode, CampEventData } from '../../stores/campaignEditorStore';
import { useCampaignEditorStore, nodeTypeLabel, nodeTypeColor } from '../../stores/campaignEditorStore';
import { NarrativePreview } from './NarrativePreview';

interface FlatNode {
  node: ChapterNode;
  chapter: CampaignChapter;
}

interface PlaythroughModeProps {
  chapters: CampaignChapter[];
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>;
  onExit: () => void;
}

export function PlaythroughMode({ chapters, interludeNarratives, onExit }: PlaythroughModeProps) {
  const campEvents = useCampaignEditorStore((s) => s.campEvents);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatNodes: FlatNode[] = useMemo(() => {
    return chapters.flatMap((ch) =>
      ch.nodes.map((node) => ({ node, chapter: ch })),
    );
  }, [chapters]);

  const total = flatNodes.length;
  const current = flatNodes[currentIndex];

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, onExit]);

  if (!current) {
    return (
      <div className="cp-container">
        <p>No nodes to display.</p>
        <button className="cp-nav-btn" onClick={onExit}>Exit</button>
      </div>
    );
  }

  const { node, chapter } = current;
  const narrativeData = node.type === 'interlude' ? interludeNarratives[node.id] : undefined;

  return (
    <div className="cp-container">
      <button className="cp-exit-btn" onClick={onExit}>Exit Playthrough</button>

      <div className="cp-progress">
        Node {currentIndex + 1} of {total} &mdash; Ch.{chapter.number}: {chapter.title}
      </div>

      <div className="cp-slide" key={node.id}>
        <div className="cp-slide-type" style={{ color: nodeTypeColor[node.type] }}>
          {nodeTypeLabel[node.type]}
        </div>
        <h2 className="cp-slide-title">{node.label}</h2>

        {/* Interlude: show narrative preview if data exists */}
        {node.type === 'interlude' && narrativeData && narrativeData.chunks.length > 0 ? (
          <NarrativePreview
            chunks={narrativeData.chunks}
            splashText={narrativeData.splashText}
          />
        ) : (
          <p className="cp-slide-desc">{node.description}</p>
        )}

        {/* Camp: show config summary + events */}
        {node.type === 'camp' && (
          <>
            {Object.keys(node.details).length > 0 && (
              <div className="cp-slide-meta">
                {Object.entries(node.details).filter(([k]) => k !== 'openingNarrative').map(([k, v]) => (
                  <span key={k}>{k}: <strong>{String(v)}</strong></span>
                ))}
              </div>
            )}
            {(() => {
              const evtData: CampEventData | undefined = campEvents[node.id];
              if (!evtData) return null;
              const forcedCount = evtData.forcedEvents.length;
              const randomCount = evtData.randomEvents.length;
              if (forcedCount === 0 && randomCount === 0) return null;
              return (
                <div className="cp-slide-events">
                  <span className="cp-slide-events-summary">
                    {forcedCount} forced, {randomCount} random event{randomCount !== 1 ? 's' : ''}
                  </span>
                  {evtData.forcedEvents.length > 0 && (
                    <div className="cp-slide-events-list">
                      {evtData.forcedEvents.map((evt) => (
                        <div key={evt.id} className="cp-slide-event-item">
                          <span className="cp-slide-event-title">{evt.title}</span>
                          <span className="cp-slide-event-meta">@{evt.triggerAt} remaining | {evt.category}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {evtData.randomEvents.length > 0 && (
                    <div className="cp-slide-events-list">
                      {evtData.randomEvents.map((evt) => (
                        <div key={evt.id} className="cp-slide-event-item">
                          <span className="cp-slide-event-title">{evt.title}</span>
                          <span className="cp-slide-event-meta">weight: {evt.weight} | {evt.category}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        )}

        {/* Battle: show parameters */}
        {node.type === 'battle' && Object.keys(node.details).length > 0 && (
          <div className="cp-slide-meta">
            {Object.entries(node.details).map(([k, v]) => (
              <span key={k}>{k}: <strong>{String(v)}</strong></span>
            ))}
          </div>
        )}
      </div>

      <div className="cp-nav">
        <button className="cp-nav-btn" disabled={currentIndex === 0} onClick={goPrev}>
          &larr; Previous
        </button>
        <button className="cp-nav-btn" disabled={currentIndex === total - 1} onClick={goNext}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
