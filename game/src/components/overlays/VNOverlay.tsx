import React, { Suspense, lazy } from 'react';
import type { VNScene } from '../../types/vnTypes';

const VNRenderer = lazy(() =>
  import('../vn/VNRenderer').then((m) => ({ default: m.VNRenderer })),
);

interface VNOverlayProps {
  scene: VNScene;
  onEnd: () => void;
  onReplay?: () => void;
}

export function VNOverlay({ scene, onEnd, onReplay }: VNOverlayProps) {
  return (
    <div className="vn-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <Suspense fallback={<div style={{ color: '#eee', padding: '2rem' }}>Loading scene...</div>}>
        <VNRenderer scene={scene} onEnd={onEnd} onReplay={onReplay} />
      </Suspense>
    </div>
  );
}
