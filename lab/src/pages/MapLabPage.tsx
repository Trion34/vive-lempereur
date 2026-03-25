import React from 'react';
import { HistoricalItalyTheaterMap } from '../../../game/src/components/campaign-map/HistoricalItalyTheaterMap';

export function MapLabPage() {
  return (
    <div className="map-lab">
      <div className="map-lab__viewport">
        <div className="campaign-map-panel__map">
          <HistoricalItalyTheaterMap />
        </div>
      </div>
    </div>
  );
}
