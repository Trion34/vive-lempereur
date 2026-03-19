import React, { useEffect, useState } from 'react';
import { ItalianCampaignMap } from './ItalianCampaignMap';
import {
  ITALIAN_CAMPAIGN_CHAPTERS,
  getItalianCampaignChapter,
  type ItalianCampaignChapterId,
} from './italianCampaignMapData';

export interface CampaignMapPanelProps {
  initialChapterId: ItalianCampaignChapterId;
  mode?: 'overlay' | 'page';
  presentation?: 'chapter' | 'overview';
  onClose?: () => void;
}

export function CampaignMapPanel({
  initialChapterId,
  mode = 'overlay',
  presentation = 'chapter',
  onClose,
}: CampaignMapPanelProps) {
  const [selectedChapterId, setSelectedChapterId] =
    useState<ItalianCampaignChapterId>(initialChapterId);

  useEffect(() => {
    setSelectedChapterId(initialChapterId);
  }, [initialChapterId]);

  const selectedIndex = Math.max(
    0,
    ITALIAN_CAMPAIGN_CHAPTERS.findIndex((chapter) => chapter.id === selectedChapterId),
  );
  const selectedChapter = getItalianCampaignChapter(selectedChapterId);
  const hasPrevious = selectedIndex > 0;
  const hasNext = selectedIndex < ITALIAN_CAMPAIGN_CHAPTERS.length - 1;
  const isOverview = presentation === 'overview';

  const content = (
    <div
      className={[
        'campaign-map-panel',
        `campaign-map-panel--${mode}`,
        `campaign-map-panel--${presentation}`,
      ].join(' ')}
    >
      <div className="campaign-map-panel__header">
        <div>
          <div className="campaign-map-panel__eyebrow">
            {isOverview ? 'Army of Italy' : 'Campaign Orientation'}
          </div>
          <h2 className="campaign-map-panel__title">
            {isOverview
              ? 'Theatre of Operations, Spring 1796'
              : "Napoleon's First Italian Campaign"}
          </h2>
          <p className="campaign-map-panel__subtitle">
            {isOverview
              ? 'A static historical theater map of the whole Army of Italy front: southern France, Piedmont, Austrian Lombardy, the Venetian mainland, Tyrol, and the Austrian approaches.'
              : 'A historically grounded operations map for camp reference and chapter-intro orientation.'}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            className="campaign-map-panel__close"
            onClick={onClose}
            aria-label="Close campaign map"
          >
            x
          </button>
        )}
      </div>

      <div
        className={[
          'campaign-map-panel__body',
          isOverview ? 'campaign-map-panel__body--overview' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="campaign-map-panel__map">
          <ItalianCampaignMap
            key={selectedChapterId}
            activeChapterId={selectedChapterId}
            animate={!isOverview}
            showRoutes={!isOverview}
            showFocus={!isOverview}
            showAllPlaces={isOverview}
            highlightedPlaceIds={isOverview ? [] : undefined}
            badge={
              isOverview
                ? {
                    kicker: 'ARMY OF ITALY',
                    title: 'Theatre of Operations, 1796',
                    meta: 'French Riviera / Northern Italy / Tyrol / Austrian approaches',
                  }
                : undefined
            }
          />
        </div>

        {isOverview ? (
          <div className="campaign-map-panel__overview-notes">
            <div className="campaign-map-panel__section">
              <div className="campaign-map-panel__section-title">Political Landscape</div>
              <p className="campaign-map-panel__chapter-summary">
                This map shows the opening Army of Italy theater before the campaign logic is
                overlaid on it: the French Republic on the Riviera, the Kingdom of
                Sardinia-Piedmont to the west of Lombardy, Austrian Lombardy around Milan and
                Mantua, the Venetian Republic east of Verona, Tyrol above Trent, and the road
                into Inner Austria beyond Tarvis and Leoben.
              </p>
            </div>
            <div className="campaign-map-panel__section">
              <div className="campaign-map-panel__section-title">Key Terrain</div>
              <p className="campaign-map-panel__chapter-summary">
                The Ligurian coast road, the Savona-Montenotte gap, the Piedmont plain, the Po
                crossings, the Adige corridor, and the Alpine approaches through Tyrol and
                Tarvis are the key geographic structures that govern the whole campaign.
              </p>
            </div>
          </div>
        ) : (
          <aside className="campaign-map-panel__sidebar">
            <div className="campaign-map-panel__chapter-card">
              <div className="campaign-map-panel__chapter-kicker">
                Chapter {selectedChapter.number} of {ITALIAN_CAMPAIGN_CHAPTERS.length}
              </div>
              <h3 className="campaign-map-panel__chapter-title">{selectedChapter.title}</h3>
              <div className="campaign-map-panel__chapter-meta">
                {selectedChapter.dateRange} / {selectedChapter.theater}
              </div>
              <p className="campaign-map-panel__chapter-summary">{selectedChapter.summary}</p>
            </div>

            <div className="campaign-map-panel__section">
              <div className="campaign-map-panel__section-title">Key Sites</div>
              <ul className="campaign-map-panel__site-list">
                {selectedChapter.keySites.map((site) => (
                  <li key={site}>{site}</li>
                ))}
              </ul>
            </div>

            <div className="campaign-map-panel__section">
              <div className="campaign-map-panel__section-title">Legend</div>
              <div className="campaign-map-panel__legend">
                <div className="campaign-map-panel__legend-row">
                  <span className="campaign-map-panel__legend-chip campaign-map-panel__legend-chip--route" />
                  French operational advance
                </div>
                <div className="campaign-map-panel__legend-row">
                  <span className="campaign-map-panel__legend-chip campaign-map-panel__legend-chip--focus" />
                  Current chapter theater
                </div>
                <div className="campaign-map-panel__legend-row">
                  <span className="campaign-map-panel__legend-chip campaign-map-panel__legend-chip--battle" />
                  Battle
                </div>
                <div className="campaign-map-panel__legend-row">
                  <span className="campaign-map-panel__legend-chip campaign-map-panel__legend-chip--city" />
                  City or operational objective
                </div>
                <div className="campaign-map-panel__legend-row">
                  <span className="campaign-map-panel__legend-chip campaign-map-panel__legend-chip--siege" />
                  Siege objective
                </div>
              </div>
            </div>

            <div className="campaign-map-panel__note">
              Historical note: the final operational endpoint shown here is Leoben in April 1797.
              Campo Formio appears as the later diplomatic epilogue, not the military climax.
            </div>
          </aside>
        )}
      </div>

      {!isOverview && (
        <div className="campaign-map-panel__footer">
          <div className="campaign-map-panel__nav">
            <button
              type="button"
              className="campaign-map-panel__nav-btn"
              onClick={() =>
                hasPrevious &&
                setSelectedChapterId(ITALIAN_CAMPAIGN_CHAPTERS[selectedIndex - 1].id)
              }
              disabled={!hasPrevious}
            >
              Previous
            </button>
            <button
              type="button"
              className="campaign-map-panel__nav-btn"
              onClick={() =>
                hasNext && setSelectedChapterId(ITALIAN_CAMPAIGN_CHAPTERS[selectedIndex + 1].id)
              }
              disabled={!hasNext}
            >
              Next
            </button>
          </div>

          <div
            className="campaign-map-panel__chapter-strip"
            role="tablist"
            aria-label="Campaign chapters"
          >
            {ITALIAN_CAMPAIGN_CHAPTERS.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                role="tab"
                aria-selected={chapter.id === selectedChapterId}
                className={[
                  'campaign-map-panel__chapter-tab',
                  chapter.id === selectedChapterId ? 'is-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedChapterId(chapter.id)}
              >
                <span className="campaign-map-panel__chapter-number">{chapter.number}</span>
                <span className="campaign-map-panel__chapter-name">{chapter.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (mode === 'page') {
    return <div className="campaign-map-preview-page">{content}</div>;
  }

  return (
    <div className="campaign-map-overlay" onClick={onClose}>
      <div
        className="campaign-map-overlay__panel"
        onClick={(event) => event.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
}


