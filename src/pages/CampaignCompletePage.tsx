import { useGameStore } from '../stores/gameStore';
import { useGloryStore } from '../stores/gloryStore';
import { deleteSave } from '../core/persistence';
import { getCampaignDef } from '../data/campaigns/registry';

export function CampaignCompletePage() {
  const gameState = useGameStore((s) => s.gameState);
  const glory = useGloryStore((s) => s.glory);

  const campaign = gameState?.campaign;
  const campaignDef = campaign ? (() => {
    try { return getCampaignDef(campaign.campaignId); }
    catch { return null; }
  })() : null;

  const hasMoreContent = campaign && campaignDef
    ? campaign.sequenceIndex < campaignDef.sequence.length - 1
    : false;

  return (
    <div className="campaign-complete-page">
      <div className="campaign-complete-content">
        <h1 className="campaign-complete-title">Campaign Complete</h1>
        <h2 className="campaign-complete-subtitle">
          {campaignDef?.title ?? 'The Italian Campaign'}
        </h2>

        <div className="campaign-complete-stats">
          <p>Battles won: {campaign?.battlesCompleted ?? 0}</p>
          <p>Days in campaign: {campaign?.daysInCampaign ?? 0}</p>
          <p>Comrades lost: {campaign?.npcDeaths.length ?? 0}</p>
          <p>Glory earned: {glory}</p>
        </div>

        {hasMoreContent && (
          <p className="campaign-complete-coming-soon">
            More battles are coming in future updates. Your glory endures.
          </p>
        )}

        <div className="campaign-complete-buttons">
          <button
            className="btn-restart"
            onClick={() => {
              deleteSave();
              window.location.reload();
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
