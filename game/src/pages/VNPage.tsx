import React, { Suspense, lazy } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getCurrentNode } from '../core/campaign';
import { getCampaignDef } from '../data/campaigns/registry';

const VNRenderer = lazy(() =>
  import('../components/vn/VNRenderer').then((m) => ({ default: m.VNRenderer })),
);

export default function VNPage() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState) return null;

  const campaign = gameState.campaign;
  const campaignDef = getCampaignDef(campaign.campaignId);
  const node = getCurrentNode(campaign, campaignDef);

  // Look up VN scene from campaign definition
  const scene = (node && node.type === 'vn' && campaignDef.vnScenes)
    ? campaignDef.vnScenes[node.sceneId] ?? null
    : null;

  const handleEnd = () => {
    useGameStore.getState().advanceToNext();
  };

  if (!scene) {
    return (
      <div className="vn-page" style={{ padding: '2rem', color: '#eee' }}>
        <p>VN scene not found. <button onClick={handleEnd}>Continue</button></p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div style={{ color: '#eee', padding: '2rem' }}>Loading scene...</div>}>
      <VNRenderer scene={scene} onEnd={handleEnd} />
    </Suspense>
  );
}
