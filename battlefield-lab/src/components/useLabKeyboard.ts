import { useEffect } from 'react';
import type { RendererHandle } from '../renderers/types';
import { useLabStore } from '../store/labStore';
import { startAutoPlay, stopAutoPlay } from '../store/autoPlay';
import { SCENARIO_IDS } from '../store/scenarios';

export function useLabKeyboard(rendererRef: React.RefObject<RendererHandle | null>) {
  const loadScenario = useLabStore.getState().loadScenario;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      const store = useLabStore.getState();

      switch (e.code) {
        case 'Space': {
          e.preventDefault();
          if (store.isRunning) {
            stopAutoPlay();
          } else {
            startAutoPlay(rendererRef);
          }
          break;
        }
        case 'KeyR': {
          e.preventDefault();
          stopAutoPlay();
          store.reset();
          break;
        }
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6': {
          const idx = parseInt(e.code.replace('Digit', '')) - 1;
          if (idx < SCENARIO_IDS.length) {
            e.preventDefault();
            stopAutoPlay();
            loadScenario(SCENARIO_IDS[idx]);
          }
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rendererRef, loadScenario]);
}
