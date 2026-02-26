import { CampActivityResult, CampLogEntry, CampState, PlayerCharacter } from '../types';
import { rollD100, rollStat, Difficulty } from './stats';

// === Types ===

export type PasseDixStake = 'low' | 'medium' | 'high';
export type PasseDixBet = 'passe' | 'manque';

interface PasseDixRoll {
  dice: [number, number, number];
  total: number;
  isPasse: boolean; // total > 10
}

interface PasseDixResult {
  roll: PasseDixRoll;
  won: boolean;
  cheatingDetected: boolean;
  stake: PasseDixStake;
  bet: PasseDixBet;
}

// === Stake Payouts ===

interface StakeConfig {
  repWin: number;
  repLose: number;
  moraleWin: number;
  moraleLose: number;
  label: string;
}

export const STAKE_CONFIG: Record<PasseDixStake, StakeConfig> = {
  low: { repWin: 1, repLose: 0, moraleWin: 2, moraleLose: -1, label: 'Cautious' },
  medium: { repWin: 3, repLose: -1, moraleWin: 4, moraleLose: -2, label: 'Fair' },
  high: { repWin: 5, repLose: -3, moraleWin: 6, moraleLose: -4, label: 'Reckless' },
};

// === Core Logic ===

/** Roll a single d6 (1-6) */
function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/** Roll three dice and determine if passe (>10) or manque (<=10) */
export function rollPasseDix(): PasseDixRoll {
  const dice: [number, number, number] = [rollD6(), rollD6(), rollD6()];
  const total = dice[0] + dice[1] + dice[2];
  return { dice, total, isPasse: total > 10 };
}

/** Resolve a full Passe-dix round with narratives and camp effects */
export function resolvePasseDix(
  player: PlayerCharacter,
  camp: CampState,
  stake: PasseDixStake,
  bet: PasseDixBet,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const roll = rollPasseDix();
  const stakeConfig = STAKE_CONFIG[stake];

  const won = bet === 'passe' ? roll.isPasse : !roll.isPasse;

  // Awareness check for cheating detection on loss
  const cheatingDetected = !won && rollStat(player.awareness, 0, Difficulty.Hard).success;

  // Build narrative
  const diceStr = `${roll.dice[0]}, ${roll.dice[1]}, ${roll.dice[2]}`;
  const totalWord = roll.isPasse ? 'Passe' : 'Manque';

  if (won) {
    const winNarratives = [
      `The dice tumble across the drumhead. ${diceStr} \u2014 ${roll.total}. "${totalWord}!" The men groan and pay up. You pocket your winnings with a grin.`,
      `Three dice clatter on the packed earth. ${diceStr} \u2014 ${roll.total}. "${totalWord}!" You called it. The pot is yours.`,
      `The firelight catches the ivory as they roll. ${diceStr} \u2014 ${roll.total}. "${totalWord}!" A cheer goes up from your corner of the fire.`,
    ];
    log.push({
      day: camp.day,
      type: 'activity',
      text: winNarratives[Math.floor(Math.random() * winNarratives.length)],
    });
    log.push({ day: camp.day, type: 'result', text: 'Won the pot. The men remember a winner.' });

    return {
      log,
      statChanges: { soldierRep: stakeConfig.repWin },
      staminaChange: -5,
      moraleChange: stakeConfig.moraleWin,
    };
  }

  // Lost — but check for cheating
  if (cheatingDetected) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: `The dice roll: ${diceStr} \u2014 ${roll.total}. "${totalWord}." You're about to pay when you notice the corporal's thumb. Weighted dice. "I see your game, Corporal." The table goes quiet. You take back your stake.`,
    });
    log.push({ day: camp.day, type: 'result', text: 'Cheating detected. You walk away with your dignity.' });

    return {
      log,
      statChanges: { soldierRep: 1 },
      staminaChange: -5,
      moraleChange: 1,
    };
  }

  // Straight loss
  const loseNarratives = [
    `The dice tumble: ${diceStr} \u2014 ${roll.total}. "${totalWord}." Not your call. You push your coins across the drumhead.`,
    `Three dice, three traitors. ${diceStr} \u2014 ${roll.total}. "${totalWord}." The pot goes the other way. A bad night.`,
    `The dice land: ${diceStr} \u2014 ${roll.total}. "${totalWord}." You pay up. The fire seems colder now.`,
  ];
  log.push({
    day: camp.day,
    type: 'activity',
    text: loseNarratives[Math.floor(Math.random() * loseNarratives.length)],
  });
  log.push({ day: camp.day, type: 'result', text: 'Lost the pot. A bitter evening.' });

  return {
    log,
    statChanges: stakeConfig.repLose !== 0 ? { soldierRep: stakeConfig.repLose } : {},
    staminaChange: -5,
    moraleChange: stakeConfig.moraleLose,
  };
}
