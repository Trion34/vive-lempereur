import React, { useState } from 'react';
import { ChapterMapSVG } from '../components/maps/ChapterMapSVG';
import {
  ITALIAN_CAMPAIGN_CHAPTERS,
  type ItalianCampaignChapterId,
} from '../../../game/src/components/campaign-map/italianCampaignMapData';

export function MapLabPage() {
  const [selectedChapter, setSelectedChapter] = useState<ItalianCampaignChapterId>('ch1');
  const chapter = ITALIAN_CAMPAIGN_CHAPTERS.find((c) => c.id === selectedChapter) ?? ITALIAN_CAMPAIGN_CHAPTERS[0];

  return (
    <div className="map-lab">
      <div className="map-lab__toolbar">
        <div className="map-lab__toolbar-group">
          <label className="map-lab__label">Chapter</label>
          <select
            className="map-lab__select"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value as ItalianCampaignChapterId)}
          >
            {ITALIAN_CAMPAIGN_CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.number}. {ch.title} — {ch.dateRange}
              </option>
            ))}
          </select>
        </div>

        <div className="map-lab__toolbar-group map-lab__chapter-strip">
          {ITALIAN_CAMPAIGN_CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              className={`map-lab__chapter-btn ${ch.id === selectedChapter ? 'is-active' : ''}`}
              onClick={() => setSelectedChapter(ch.id)}
              title={`${ch.title} — ${ch.dateRange}`}
            >
              {ch.number}
            </button>
          ))}
        </div>
      </div>

      <div className="map-lab__info-bar">
        <span className="map-lab__info-title">
          Ch. {chapter.number}: {chapter.title}
        </span>
        <span className="map-lab__info-date">{chapter.dateRange}</span>
        <span className="map-lab__info-theater">{chapter.theater}</span>
        <span className="map-lab__info-summary">{chapter.summary}</span>
      </div>

      <div className="map-lab__viewport">
        <ChapterMapSVG chapterId={selectedChapter} />
      </div>
    </div>
  );
}
