import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { CampaignChapter, ChapterNode } from '../../stores/campaignEditorStore';
import { nodeTypeLabel, nodeTypeColor } from '../../stores/campaignEditorStore';
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

        {/* Camp: show config summary */}
        {node.type === 'camp' && Object.keys(node.details).length > 0 && (
          <div className="cp-slide-meta">
            {Object.entries(node.details).map(([k, v]) => (
              <span key={k}>{k}: <strong>{String(v)}</strong></span>
            ))}
          </div>
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
