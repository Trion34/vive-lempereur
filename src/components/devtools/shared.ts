import { useGameStore } from '../../stores/gameStore';
import { GamePhase, BattlePhase, DrillStep, MeleeContext, type BattleState } from '../../types';
import { createMeleeState } from '../../core/melee';
import { transitionToCamp, createBattleFromCharacter } from '../../core/gameLoop';
import { getBattleConfig } from '../../data/battles/registry';
import { getScriptedAvailableActions } from '../../core/volleys';
import { RIVOLI_VOLLEY_RANGES } from '../../data/battles/rivoli/volleys';

// ── shared jump helpers used by JumpTab and ActionsTab ──

export function ensureBattle() {
  const gs = useGameStore.getState().gameState!;
  if (gs.phase !== GamePhase.Battle || !gs.battleState) {
    const config = getBattleConfig(gs.campaign.currentBattle);
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs, config.roles, config.init);
    gs.phase = GamePhase.Battle;
    gs.campState = undefined;
  }
  return gs.battleState!;
}

export function commit(gs = useGameStore.getState().gameState!) {
  useGameStore.getState().setGameState({ ...gs });
}

export function jumpToPreBattleCamp() {
  const gs = useGameStore.getState().gameState!;
  // Jump to the eve-of-rivoli camp node (sequence index 1 in Italy campaign)
  gs.campaign = { ...gs.campaign, sequenceIndex: 1 };
  transitionToCamp(gs);
  const camp = gs.campState!;
  camp.log.push({ day: 1, text: '[DEV] Jumped to Pre-Battle Camp', type: 'narrative' });
  commit(gs);
}

export function jumpToVolley(volley: number, part: 1 | 2 | 3 = 1) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.Line;
  bs.scriptedVolley = volley;
  bs.ext.battlePart = part;
  bs.drillStep = DrillStep.Present;
  bs.turn = (volley - 1) * 3 + 1;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = RIVOLI_VOLLEY_RANGES[volley - 1];
  bs.chargeEncounter = 0;

  if (part === 2) {
    bs.ext.batteryCharged = true;
    bs.ext.meleeStage = 2;
    bs.enemy.quality = 'line';
    bs.enemy.morale = 'advancing';
    bs.enemy.strength = 100;
    bs.enemy.lineIntegrity = 100;
    bs.enemy.artillery = true;
    bs.enemy.cavalryThreat = false;
  } else if (part === 3) {
    bs.ext.batteryCharged = true;
    bs.ext.meleeStage = 2;
    bs.ext.wagonDamage = 0;
    bs.ext.gorgeMercyCount = 0;
    bs.ext.gorgeTarget = '';
    bs.enemy = {
      range: 200,
      strength: 100,
      quality: 'column',
      morale: 'trapped',
      lineIntegrity: 100,
      artillery: false,
      cavalryThreat: false,
    };
  }

  bs.availableActions = getScriptedAvailableActions(bs);
  bs.log.push({
    turn: bs.turn,
    text: `[DEV] Jumped to Volley ${volley} (Part ${part})`,
    type: 'narrative',
  });
  commit(gs);
}

export function jumpToCharge(encounter: number) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.StoryBeat;
  bs.chargeEncounter = encounter;
  bs.scriptedVolley = 0;
  bs.battleOver = false;
  bs.outcome = 'pending';

  const encounterLabels: Record<number, string> = {
    1: 'Battery Choice',
    2: "Mass\u00e9na's Arrival",
    3: 'The Gorge',
    4: 'The Aftermath',
    5: 'Wounded Sergeant',
    6: 'Fix Bayonets',
  };

  if (encounter === 5) {
    bs.turn = 7;
    bs.ext.battlePart = 1;
    bs.enemy.range = 50;
    bs.enemy.morale = 'advancing';
    bs.line.ncoPresent = true;
  } else if (encounter === 6) {
    bs.turn = 13;
    bs.ext.battlePart = 1;
    bs.enemy.range = 25;
    bs.enemy.morale = 'charging';
  } else if (encounter === 1) {
    bs.turn = 13;
    bs.enemy.range = 0;
    bs.enemy.morale = 'charging';
    bs.ext.meleeStage = 1;
    bs.ext.battlePart = 1;
  } else if (encounter === 2) {
    bs.turn = 20;
    bs.enemy.range = 100;
    bs.enemy.morale = 'advancing';
    bs.ext.meleeStage = 2;
    bs.ext.battlePart = 1;
    bs.ext.batteryCharged = true;
  } else if (encounter === 3) {
    bs.turn = 30;
    bs.enemy.range = 40;
    bs.enemy.morale = 'wavering';
    bs.ext.meleeStage = 2;
    bs.ext.battlePart = 2;
    bs.ext.batteryCharged = true;
  } else if (encounter === 4) {
    bs.turn = 45;
    bs.ext.battlePart = 3;
    bs.enemy.range = 200;
    bs.enemy.strength = 5;
    bs.enemy.morale = 'trapped';
    bs.enemy.lineIntegrity = 0;
    bs.enemy.artillery = false;
    bs.enemy.cavalryThreat = false;
    bs.ext.meleeStage = 2;
    bs.ext.batteryCharged = true;
    bs.ext.wagonDamage = 50;
    bs.ext.gorgeMercyCount = 1;
  }

  bs.log.push({
    turn: bs.turn,
    text: `[DEV] Jumped to Story Beat (${encounterLabels[encounter] || encounter})`,
    type: 'narrative',
  });
  commit(gs);
}

export function jumpToMelee(context: MeleeContext = MeleeContext.Terrain) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.Melee;
  bs.scriptedVolley = 0;
  bs.chargeEncounter = 0;
  bs.turn = 16;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = 0;
  if (context === 'battery') {
    bs.ext.batteryCharged = true;
    bs.ext.meleeStage = 1;
    bs.ext.battlePart = 1;
  }
  bs.meleeState = createMeleeState(bs, context, context);
  bs.log.push({ turn: bs.turn, text: `[DEV] Jumped to Melee (${context})`, type: 'narrative' });
  commit(gs);
}

export function jumpToCredits() {
  const gs = useGameStore.getState().gameState!;
  if (!gs.battleState) {
    const config = getBattleConfig(gs.campaign.currentBattle);
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs, config.roles, config.init);
    gs.phase = GamePhase.Battle;
  }
  const bs = gs.battleState!;
  bs.battleOver = true;
  bs.outcome = 'gorge_victory';
  bs.ext.battlePart = 3;
  bs.ext.batteryCharged = true;
  bs.ext.wagonDamage = 50;
  bs.ext.gorgeMercyCount = 1;
  commit(gs);
}

export function forceBattleEnd(outcome: BattleState['outcome']) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.battleOver = true;
  bs.outcome = outcome;
  bs.log.push({
    turn: bs.turn,
    text: `[DEV] Forced outcome: ${outcome}`,
    type: 'narrative',
  });
  commit(gs);
}
