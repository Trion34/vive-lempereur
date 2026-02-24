import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import type { BattleState } from '../../types';

interface PanoramaProps {
  battleState: BattleState;
}

export interface PanoramaHandle {
  flashBlock: (target: 'french' | 'austrian', flashCls: string) => void;
}

export const Panorama = forwardRef<PanoramaHandle, PanoramaProps>(
  function Panorama({ battleState }, ref) {
    const austrianBlockRef = useRef<HTMLDivElement>(null);
    const frenchBlockRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      flashBlock(target: 'french' | 'austrian', flashCls: string) {
        const el = target === 'french' ? frenchBlockRef.current : austrianBlockRef.current;
        if (el) {
          el.classList.add(flashCls);
          setTimeout(() => el.classList.remove(flashCls), 300);
        }
      },
    }));

    const { enemy, line, scriptedVolley, drillStep } = battleState;
    const range = enemy.range;

    // Gap calculation: 50px at 25 paces, 230px at 120 paces
    const basis = Math.round(50 + ((range - 25) / (120 - 25)) * (230 - 50));
    const gapBasis = Math.max(50, Math.min(230, basis));

    // French block classes
    const frenchIntegrityClass =
      line.lineIntegrity < 40
        ? 'integrity-broken'
        : line.lineIntegrity < 70
          ? 'integrity-damaged'
          : '';
    const frenchMoraleClass = `morale-${line.lineMorale}`;

    // Austrian block classes
    const austrianIntegrityClass =
      enemy.lineIntegrity < 40
        ? 'integrity-broken'
        : enemy.lineIntegrity < 70
          ? 'integrity-damaged'
          : '';
    const austrianMoraleClass = `morale-${enemy.morale}`;

    return (
      <div
        className="battle-panorama"
        id="panorama"
        data-volley={String(scriptedVolley)}
        data-drill={drillStep}
      >
        <div
          className={`strength-block block-french ${frenchIntegrityClass} ${frenchMoraleClass}`.trim()}
          id="block-french"
          ref={frenchBlockRef}
        >
          <div className="block-label">14e Demi-Brigade</div>
          <div
            className="block-fill"
            id="french-fill"
            style={{
              width: `${line.lineIntegrity}%`,
              opacity: 0.3 + (line.lineIntegrity / 100) * 0.7,
            }}
          />
        </div>

        <div className="pano-gap" id="pano-gap" style={{ flexBasis: `${gapBasis}px` }}>
          <div className="pano-range">
            <span className="pano-range-val" id="pano-range-val">{Math.round(range)}</span>
            <span className="pano-range-unit">paces</span>
          </div>
          <div id="volley-streaks" />
        </div>

        <div
          className={`strength-block block-austrian ${austrianIntegrityClass} ${austrianMoraleClass}`.trim()}
          id="block-austrian"
          ref={austrianBlockRef}
        >
          <div className="block-label">Austrian Column</div>
          <div
            className="block-fill"
            id="austrian-fill"
            style={{
              width: `${enemy.strength}%`,
              opacity: 0.3 + (enemy.strength / 100) * 0.7,
            }}
          />
        </div>
      </div>
    );
  },
);
