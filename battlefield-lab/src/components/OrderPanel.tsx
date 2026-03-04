import React from 'react';
import { effectiveRange, ORDER_INFO, getValidOrders } from '../engagement';
import type { Order } from '../engagement';
import type { RendererHandle } from '../renderers/types';
import { useLabStore, SLOT_LABELS_FR } from '../store/labStore';
import { executeManualVolley } from '../store/autoPlay';

interface OrderPanelProps {
  rendererRef: React.RefObject<RendererHandle | null>;
}

export function OrderPanel({ rendererRef }: OrderPanelProps) {
  const engagement = useLabStore((s) => s.engagement);
  const isRunning = useLabStore((s) => s.isRunning);
  const frenchOrders = useLabStore((s) => s.frenchOrders);
  const setFrenchOrder = useLabStore((s) => s.setFrenchOrder);

  if (isRunning) return null;

  const battleEnded = engagement.phase === 'ended';

  return (
    <div className="lab-order-panel">
      <h3 className="lab-right-title">French Orders</h3>
      {engagement.french.map((f, i) => {
        const validOrders = getValidOrders(f);
        const eRange = effectiveRange(engagement.range, f.rangeOffset, engagement.austrian[i]?.rangeOffset ?? 0);
        return (
          <div key={`order-${i}`} className="lab-order-row">
            <span className="lab-order-label">{SLOT_LABELS_FR[i]}</span>
            <span className="lab-order-range">{Math.round(eRange)}p</span>
            <div className="lab-order-btns">
              {(['fire', 'hold_fire', 'crossfire', 'advance', 'charge', 'fall_back'] as Order[]).map((ord) => {
                const valid = validOrders.includes(ord);
                const selected = frenchOrders[i] === ord;
                return (
                  <button
                    key={ord}
                    className={`lab-order-btn${selected ? ' selected' : ''}${!valid ? ' disabled' : ''}`}
                    onClick={() => valid && setFrenchOrder(i, ord)}
                    disabled={!valid || f.status !== 'active'}
                    title={ORDER_INFO[ord].description}
                  >
                    {ORDER_INFO[ord].label}
                  </button>
                );
              })}
            </div>
            {f.hasFirstFire && <span className="lab-order-badge first-fire">1st Fire</span>}
            {f.chargeReady && <span className="lab-order-badge charge">CHARGE</span>}
          </div>
        );
      })}
      <button
        className={`lab-btn lab-execute-btn${battleEnded ? ' disabled' : ''}`}
        onClick={() => executeManualVolley(rendererRef)}
        disabled={battleEnded}
      >
        Execute Volley
      </button>
    </div>
  );
}
