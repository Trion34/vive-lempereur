import type {
  BattleState,
  Action,
} from '../../types';
import {
  MilitaryRank,
  DrillStep,
  LineActionId,
} from '../../types';
import { getBattleConfig } from '../../data/battles/registry';

// ============================================================
// SCRIPTED AVAILABLE ACTIONS — delegates to BattleConfig
// ============================================================

/**
 * Returns available actions for the current battle state.
 * Delegates to the battle config's getAvailableActions callback.
 * If no config or callback, returns [].
 */
export function getScriptedAvailableActions(state: BattleState): Action[] {
  try {
    const config = getBattleConfig(state.configId);
    return config.getAvailableActions?.(state) ?? [];
  } catch {
    return [];
  }
}

// ============================================================
// RANK HIERARCHY
// ============================================================

const RANK_ORDER: MilitaryRank[] = [
  MilitaryRank.Private,
  MilitaryRank.Corporal,
  MilitaryRank.Sergeant,
  MilitaryRank.Lieutenant,
  MilitaryRank.Captain,
];

/** True if `playerRank` is at or above `required` in the hierarchy. */
export function hasMinRank(playerRank: MilitaryRank, required: MilitaryRank): boolean {
  return RANK_ORDER.indexOf(playerRank) >= RANK_ORDER.indexOf(required);
}

// ============================================================
// LINE ACTION DEFINITIONS
// ============================================================

export interface LineAction {
  id: LineActionId;
  label: string;
  description: string;
}

function la(id: LineActionId, label: string, description: string): LineAction {
  return { id, label, description };
}

// ============================================================
// AVAILABLE LINE ACTIONS — rank-based agency
// ============================================================

/**
 * Returns available line actions for the current drill step and player rank.
 * Private always returns [] (auto-play only). Part 3 (gorge) uses a separate system.
 */
export function getAvailableLineActions(state: BattleState, step: DrillStep): LineAction[] {
  const rank = state.playerRank;
  if (!hasMinRank(rank, MilitaryRank.Corporal)) return [];
  if (state.ext.battlePart === 3) return [];

  const actions: LineAction[] = [];
  const rs = state.rankState;

  switch (step) {
    case DrillStep.Present: {
      // Sergeant: fire direction
      if (hasMinRank(rank, MilitaryRank.Sergeant)) {
        actions.push(la(LineActionId.ConcentrateFire, 'Concentrate Fire', '+30% damage, -2 integrity'));
        actions.push(la(LineActionId.SpreadFire, 'Spread Fire', 'Standard fire across the line'));
        if (!rs.heldVolleyBonus) {
          actions.push(la(LineActionId.HoldFire, 'Hold Fire', 'Skip fire, +50% next volley'));
        }
      }
      // Lieutenant: movement
      if (hasMinRank(rank, MilitaryRank.Lieutenant)) {
        actions.push(la(LineActionId.Advance, 'Advance', 'Close distance, better accuracy'));
        actions.push(la(LineActionId.HoldPosition, 'Hold Position', 'Standard range'));
        actions.push(la(LineActionId.FallBack, 'Fall Back', 'Open distance, less return fire'));
      }
      // Captain: hold...hold...fire
      if (hasMinRank(rank, MilitaryRank.Captain)) {
        actions.push(la(LineActionId.HoldHoldFire, 'Hold... Hold... Fire!', 'Delay for bonus, risk return fire'));
      }
      break;
    }

    case DrillStep.Fire: {
      // Corporal: personal fire choices
      if (hasMinRank(rank, MilitaryRank.Corporal)) {
        actions.push(la(LineActionId.AimedShot, 'Aimed Shot', 'Enhanced accuracy, miss penalty'));
        actions.push(la(LineActionId.FireWithVolley, 'Fire with Volley', 'Standard volley fire'));
      }
      // Captain: fire doctrine
      if (hasMinRank(rank, MilitaryRank.Captain)) {
        actions.push(la(LineActionId.FireByRank, 'Fire by Rank', 'Two half-volleys'));
        actions.push(la(LineActionId.FireAtWill, 'Fire at Will', '+30% damage, -5 integrity'));
        actions.push(la(LineActionId.StandardVolley, 'Standard Volley', 'Ordered volley fire'));
      }
      break;
    }

    case DrillStep.Endure: {
      // Corporal: personal endure
      if (hasMinRank(rank, MilitaryRank.Corporal)) {
        actions.push(la(LineActionId.SteadyYourFile, 'Steady Your File', 'Charisma check, boost neighbours'));
        actions.push(la(LineActionId.KeepHeadDown, 'Keep Head Down', 'Standard endure'));
      }
      // Sergeant: close ranks
      if (hasMinRank(rank, MilitaryRank.Sergeant)) {
        actions.push(la(LineActionId.CloseRanks, 'Close Ranks', 'Halve integrity loss'));
      }
      // Lieutenant: refuse flank (conditional)
      if (hasMinRank(rank, MilitaryRank.Lieutenant)) {
        if (state.line.lineIntegrity < 60 && !rs.refuseFlankUsed) {
          actions.push(la(LineActionId.RefuseFlank, 'Refuse the Flank', '-15% return fire for 2 volleys'));
        }
      }
      // Captain: drum control
      if (hasMinRank(rank, MilitaryRank.Captain)) {
        if (state.line.drumsPlaying) {
          actions.push(la(LineActionId.SilenceDrums, 'Silence the Drums', 'Protect the drummers'));
        } else {
          actions.push(la(LineActionId.OrderDrums, 'Order the Drums', '+5 integrity, +2 morale'));
        }
      }
      break;
    }

    case DrillStep.Load: {
      // Sergeant: double time
      if (hasMinRank(rank, MilitaryRank.Sergeant)) {
        actions.push(la(LineActionId.DoubleTime, 'Double Time', 'Guaranteed load, costs stamina'));
      }
      // Captain: strategic
      if (hasMinRank(rank, MilitaryRank.Captain)) {
        if (!rs.fixedBayonetsEarly) {
          actions.push(la(LineActionId.FixBayonetsEarly, 'Fix Bayonets Early', 'Bonus to first melee round'));
        }
        if (rs.requestSupportCooldown <= 0) {
          actions.push(la(LineActionId.RequestSupport, 'Request Support', '+5 integrity, 3-volley cooldown'));
        }
      }
      break;
    }
  }

  return actions;
}
