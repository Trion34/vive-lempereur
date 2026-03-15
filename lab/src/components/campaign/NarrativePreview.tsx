import React, { useState } from 'react';

interface NarrativePreviewProps {
  chunks: string[];
  splashText?: string;
  compact?: boolean;
}

export function NarrativePreview({ chunks, splashText, compact }: NarrativePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (chunks.length === 0 && !splashText) {
    return <div className="cn-preview cn-preview-empty">No narrative text yet</div>;
  }

  const total = chunks.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < total - 1;

  return (
    <div className={`cn-preview${compact ? ' cn-preview-compact' : ''}`}>
      {splashText && (
        <div className="cn-splash">{splashText}</div>
      )}
      {total > 0 && (
        <>
          <div className="cn-chunk" key={currentIndex}>
            {chunks[currentIndex]}
          </div>
          <div className="cn-nav">
            <button
              className="cn-nav-btn"
              disabled={!hasPrev}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              &larr; Prev
            </button>
            <span className="cn-counter">
              {currentIndex + 1} / {total}
            </span>
            <button
              className="cn-nav-btn"
              disabled={!hasNext}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
