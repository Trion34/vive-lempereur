import { useState, useCallback } from 'react';

/** Returns a stable callback that forces a re-render when called. */
export function useForceRender(): () => void {
  const [, setTick] = useState(0);
  return useCallback(() => setTick((t) => t + 1), []);
}
