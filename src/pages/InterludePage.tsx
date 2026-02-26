import React, { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useCinematic } from '../hooks/useCinematic';
import { SplashOverlay } from '../components/overlays/SplashOverlay';
import { CinematicOverlay } from '../components/overlays/CinematicOverlay';
import { getCurrentInterlude } from '../core/campaign';
import { getCampaignDef } from '../data/campaigns/registry';
import { getCurrentBattleEntry } from '../core/campaign';

export function InterludePage() {
  const gameState = useGameStore((s) => s.gameState);
  const cinematic = useCinematic();

  const campaign = gameState?.campaign;
  const campaignDef = campaign ? getCampaignDef(campaign.campaignId) : null;

  // Look up the interlude from the *previous* battle to the current one
  // (battleIndex was already advanced in transitionToInterlude)
  const interlude = campaign && campaignDef
    ? (() => {
        const prevIndex = campaign.battleIndex - 1;
        if (prevIndex < 0) return null;
        const prevBattle = campaignDef.battles[prevIndex];
        const currentBattle = campaignDef.battles[campaign.battleIndex];
        if (!prevBattle || !currentBattle) return null;
        const key = `${prevBattle.battleId}-${currentBattle.battleId}`;
        return campaignDef.interludes[key] ?? null;
      })()
    : null;

  const nextBattleEntry = campaign && campaignDef
    ? getCurrentBattleEntry(campaign, campaignDef)
    : null;

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
    // Check if next battle is implemented
    if (nextBattleEntry && !nextBattleEntry.implemented) {
      // Skip to campaign complete with "coming soon" message
      useGameStore.getState().continueToNextBattle();
    } else {
      useGameStore.getState().continueToNextBattle();
    }
  };

  return (
    <>
      <div className="interlude-page">
        <div className="interlude-content">
          {!cinematic.splashText && !cinematic.cinematicConfig && (
            <>
              <h2 className="interlude-title">
                {nextBattleEntry?.title ?? 'The Campaign Continues'}
              </h2>
              <p className="interlude-subtitle">
                {nextBattleEntry?.subtitle ?? ''}
              </p>
              {nextBattleEntry && !nextBattleEntry.implemented && (
                <p className="interlude-coming-soon">
                  This battle has not yet been implemented. More battles coming soon!
                </p>
              )}
              <button className="btn-restart" onClick={handleContinue}>
                {nextBattleEntry?.implemented ? 'Continue' : 'Complete Campaign'}
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
