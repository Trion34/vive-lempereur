import { useState, useRef, useCallback } from 'react';
import type { CinematicConfig, CinematicHandle } from '../components/overlays/CinematicOverlay';

export type { CinematicConfig, CinematicHandle };
export type { CinematicChoice, RollDisplay } from '../components/overlays/CinematicOverlay';

export interface UseCinematicReturn {
  /** Non-null = show SplashOverlay with this text */
  splashText: string | null;
  /** Non-null = show CinematicOverlay with this config */
  cinematicConfig: CinematicConfig | null;
  /** Ref to the CinematicOverlay imperative handle (for showResult) */
  cinematicRef: React.RefObject<CinematicHandle | null>;
  /** Callback for SplashOverlay's onProceed — transitions from splash to cinematic */
  handleSplashProceed: () => void;
  /** Show a splash, then on proceed build a cinematic config */
  launchSplash(text: string, thenShowCinematic: () => CinematicConfig): void;
  /** Show a cinematic directly (no splash) */
  launchCinematic(config: CinematicConfig): void;
  /** Tear down the active cinematic (if any) */
  destroyCinematic(): void;
}

export function useCinematic(): UseCinematicReturn {
  const [splashText, setSplashText] = useState<string | null>(null);
  const [cinematicConfig, setCinematicConfig] = useState<CinematicConfig | null>(null);
  const cinematicRef = useRef<CinematicHandle | null>(null);
  const pendingCinematicFn = useRef<(() => CinematicConfig) | null>(null);

  const launchSplash = useCallback(
    (text: string, thenShowCinematic: () => CinematicConfig) => {
      pendingCinematicFn.current = thenShowCinematic;
      setSplashText(text);
    },
    [],
  );

  const handleSplashProceed = useCallback(() => {
    setSplashText(null);
    if (pendingCinematicFn.current) {
      const config = pendingCinematicFn.current();
      pendingCinematicFn.current = null;
      setCinematicConfig(config);
    }
  }, []);

  const launchCinematic = useCallback((config: CinematicConfig) => {
    setCinematicConfig(config);
  }, []);

  const destroyCinematic = useCallback(() => {
    if (cinematicRef.current) {
      cinematicRef.current.destroy();
      cinematicRef.current = null;
    }
    setCinematicConfig(null);
    setSplashText(null);
    pendingCinematicFn.current = null;
  }, []);

  return {
    splashText,
    cinematicConfig,
    cinematicRef,
    handleSplashProceed,
    launchSplash,
    launchCinematic,
    destroyCinematic,
  };
}
