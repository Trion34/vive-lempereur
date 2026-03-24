import { useEffect, useRef } from 'react';

const CAMP_QUIPS = [
  '"That girl has been following us since Arcole, I swear it."',
  '"Click on her. I dare you. Dubois did and he got a promotion."',
  '"She knows things. Click and see."',
  '"Pierre says she speaks. You just have to click."',
  '"The girl in the corner \u2014 she said something about courage yesterday."',
  '"Go on, click the girl. What\'s the worst that happens?"',
  '"Leclerc says she\'s good luck. Touch the uniform and find out."',
  '"I clicked her three times. Now I see a different girl entirely."',
  '"They say if you click on her enough, she changes uniforms."',
  '"Jean-Baptiste won\'t shut up about the mascot girl."',
];

const SOLDIER_HEADS = [
  { x: 307, y: 280 },
  { x: 357, y: 278 },
  { x: 443, y: 276 },
  { x: 489, y: 278 },
];

function positionQuipAboveSoldier(el: HTMLElement, soldierIdx: number) {
  const svgEl = document.querySelector('#camp-scene-art svg') as SVGSVGElement | null;
  const parent = document.querySelector('.camp-col-status') as HTMLElement | null;
  if (!svgEl || !parent) return;

  const head = SOLDIER_HEADS[soldierIdx];
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return;

  const pt = svgEl.createSVGPoint();
  pt.x = head.x;
  pt.y = head.y;
  const screenPt = pt.matrixTransform(ctm);

  const parentRect = parent.getBoundingClientRect();
  const relX = screenPt.x - parentRect.left;
  const relY = screenPt.y - parentRect.top;

  const totalZoom = parentRect.width / parent.offsetWidth || 1;

  el.style.left = `${relX / totalZoom}px`;
  el.style.top = `${(relY - 12) / totalZoom}px`;
  el.style.bottom = 'auto';
  el.style.right = 'auto';
}

/**
 * Periodically shows speech-bubble quips above random soldiers in the camp scene.
 * Manages its own timer lifecycle.
 */
export function useCampQuips(): void {
  const quipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let idx = Math.floor(Math.random() * CAMP_QUIPS.length);
    let lastSoldier = -1;

    function showQuip() {
      const el = document.getElementById('camp-quip');
      if (!el) return;

      let soldierIdx: number;
      do {
        soldierIdx = Math.floor(Math.random() * SOLDIER_HEADS.length);
      } while (soldierIdx === lastSoldier && SOLDIER_HEADS.length > 1);
      lastSoldier = soldierIdx;

      el.textContent = CAMP_QUIPS[idx];
      positionQuipAboveSoldier(el, soldierIdx);
      el.classList.add('visible');

      quipTimerRef.current = setTimeout(() => {
        el.classList.remove('visible');
        idx = (idx + 1) % CAMP_QUIPS.length;
        quipTimerRef.current = setTimeout(showQuip, 12000 + Math.random() * 8000);
      }, 5000);
    }

    quipTimerRef.current = setTimeout(showQuip, 6000 + Math.random() * 4000);

    return () => {
      if (quipTimerRef.current !== null) {
        clearTimeout(quipTimerRef.current);
        quipTimerRef.current = null;
      }
      const el = document.getElementById('camp-quip');
      if (el) el.classList.remove('visible');
    };
  }, []);
}
