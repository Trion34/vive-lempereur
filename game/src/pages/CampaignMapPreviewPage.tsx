import React from 'react';
import { HistoricalItalyTheaterMap } from '../components/campaign-map/HistoricalItalyTheaterMap';

export function CampaignMapPreviewPage() {
  return (
    <div className="historical-theater-page">
      <div className="historical-theater-page__frame">
        <HistoricalItalyTheaterMap />
      </div>
    </div>
  );
}
