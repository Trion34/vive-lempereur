import { MeleeActionId } from '../../types';

export function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const ACTION_DISPLAY_NAMES: Record<string, string> = {
  [MeleeActionId.BayonetThrust]: 'BAYONET THRUST',
  [MeleeActionId.AggressiveLunge]: 'LUNGE',
  [MeleeActionId.ButtStrike]: 'BUTT STRIKE',
  [MeleeActionId.Shoot]: 'SHOOT',
  [MeleeActionId.Feint]: 'FEINT',
  [MeleeActionId.Guard]: 'GUARD',
  [MeleeActionId.Respite]: 'CATCH BREATH',
  [MeleeActionId.Reload]: 'RELOADING',
  [MeleeActionId.SecondWind]: 'SECOND WIND',
  [MeleeActionId.UseCanteen]: 'DRINK CANTEEN',
};

export const LOAD_STEP_LABELS = ['Bite cartridge', 'Pour powder', 'Ram ball', 'Prime pan'];
