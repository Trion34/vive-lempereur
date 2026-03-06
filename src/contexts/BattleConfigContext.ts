import { createContext, useContext } from 'react';
import type { BattleConfig } from '../data/battles/types';

const BattleConfigContext = createContext<BattleConfig | null>(null);

export const BattleConfigProvider = BattleConfigContext.Provider;

export function useBattleConfig(): BattleConfig | null {
  return useContext(BattleConfigContext);
}
