import React, { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useCinematic } from '../hooks/useCinematic';
import { SplashOverlay } from '../components/overlays/SplashOverlay';
import { CinematicOverlay } from '../components/overlays/CinematicOverlay';
import { getCurrentNode } from '../core/campaign';
import { getCampaignDef } from '../data/campaigns/registry';

export function InterludePage() {
  const gameState = useGameStore((s) => s.gameState);
  const cinematic = useCinematic();

  const campaign = gameState?.campaign;
  const campaignDef = campaign ? getCampaignDef(campaign.campaignId) : null;

  // Look up the interlude from the current node
  const interlude = (() => {
    if (!campaign || !campaignDef) return null;
    const node = getCurrentNode(campaign, campaignDef);
    if (!node || node.type !== 'interlude') return null;
    return campaignDef.interludes[node.interludeId] ?? null;
  })();

  // Launch splash + cinematic on mount
  useEffect(() => {
    if (!interlude) return;

    cinematic.launchSplash(interlude.splashText, () => ({
      chunks: interlude.narrative,
      onComplete: () => {
        cinematic.destroyCinematic();
      },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  const handleContinue = () => {
    useGameStore.getState().advanceToNext();
  };

  return (
    <>
      <div className="interlude-page">
        <div className="interlude-content">
          {!cinematic.splashText && !cinematic.cinematicConfig && (
            <>
              <h2 className="interlude-title">
                {interlude?.splashText ?? 'The Campaign Continues'}
              </h2>
              <button className="btn-restart" onClick={handleContinue}>
                Continue
              </button>
            </>
          )}
        </div>
      </div>

      {cinematic.splashText && (
        <SplashOverlay text={cinematic.splashText} onProceed={cinematic.handleSplashProceed} />
      )}
      {cinematic.cinematicConfig && (
        <CinematicOverlay ref={cinematic.cinematicRef} config={cinematic.cinematicConfig} />
      )}
    </>
  );
}
