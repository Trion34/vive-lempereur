import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import type { RendererHandle, RendererProps } from '../renderers/types';
import { getRenderer, getAllRenderers } from '../renderers/registry';
import { useLabStore } from '../store/labStore';

interface ComparisonViewProps {
  engagement: RendererProps['engagement'];
  formations: RendererProps['formations'];
  playerFormationIndex: RendererProps['playerFormationIndex'];
}

/** Broadcasts imperative calls to all renderer refs */
export const ComparisonView = forwardRef<RendererHandle, ComparisonViewProps>(
  function ComparisonView({ engagement, formations, playerFormationIndex }, ref) {
    const activeRenderers = useLabStore((s) => s.activeRenderers);
    const visualParams = useLabStore((s) => s.visualParams);
    const setActiveRenderers = useLabStore((s) => s.setActiveRenderers);

    // We support 2-4 comparison slots
    const slots = activeRenderers.slice(0, 4);
    const refs = useRef<(RendererHandle | null)[]>([]);

    // Broadcast handle: calls all renderer refs
    useImperativeHandle(ref, () => ({
      async playVolley(direction, index) {
        await Promise.all(
          refs.current.filter(Boolean).map(r => r!.playVolley(direction, index))
        );
      },
      async playCharge(side, index) {
        await Promise.all(
          refs.current.filter(Boolean).map(r => r!.playCharge(side, index))
        );
      },
      async advanceAustrians(range) {
        await Promise.all(
          refs.current.filter(Boolean).map(r => r!.advanceAustrians(range))
        );
      },
      clearSmoke() {
        refs.current.filter(Boolean).forEach(r => r!.clearSmoke());
      },
      showOrderLabels(side, orders) {
        refs.current.filter(Boolean).forEach(r => r!.showOrderLabels(side, orders));
      },
      hideOrderLabels(side) {
        refs.current.filter(Boolean).forEach(r => r!.hideOrderLabels(side));
      },
      hideOrderLabel(side, index) {
        refs.current.filter(Boolean).forEach(r => r!.hideOrderLabel(side, index));
      },
    }));

    const allRenderers = getAllRenderers();

    const updateSlot = (slotIndex: number, rendererId: string) => {
      const next = [...activeRenderers];
      next[slotIndex] = rendererId;
      setActiveRenderers(next);
    };

    return (
      <div className="lab-comparison-grid">
        {slots.map((rendererId, i) => {
          const plugin = getRenderer(rendererId);
          if (!plugin) return null;
          const Component = plugin.Component;

          return (
            <div key={`comp-${i}`} className="lab-comparison-slot">
              <div className="lab-comparison-slot-header">
                <span className="lab-comparison-slot-label">{plugin.label}</span>
                <select
                  value={rendererId}
                  onChange={(e) => updateSlot(i, e.target.value)}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    color: '#ccc',
                    fontSize: '9px',
                    fontFamily: 'inherit',
                    padding: '2px 4px',
                    borderRadius: '2px',
                  }}
                >
                  {allRenderers.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="lab-comparison-slot-viewport">
                <Component
                  ref={(handle: RendererHandle | null) => { refs.current[i] = handle; }}
                  engagement={engagement}
                  formations={formations}
                  playerFormationIndex={playerFormationIndex}
                  visualParams={visualParams}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
