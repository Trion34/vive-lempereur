/**
 * Passe-Dix VN Scene — Felix's dice game at Voltri garrison.
 * Replaces the old imperative gambling event with a character-driven VN scene.
 *
 * Outcomes match the original event:
 *   Join + sous >= 2 + win:  soldierRep +1, morale +3, sous +3, felix +10, gambling_accepted
 *   Join + sous >= 2 + lose: morale -1, sous -2, felix +5, gambling_accepted
 *   Join + sous < 2:         morale -1 (no flag)
 *   Watch:                   morale +1, felix +3, gambling_accepted
 *   Decline:                 (nothing)
 */

import type { VNScene } from '../../../../types/vnTypes';

export const PASSE_DIX_SCENE: VNScene = {
  id: 'voltri_passe_dix',
  title: 'The Passe-Dix Game',
  description: 'Felix Martel runs the table behind the cookfires.',
  mood: 'night_camp',
  cast: ['player', 'felix'],
  startNode: 'intro_1',
  nodes: {
    // === Introduction ===
    intro_1: {
      id: 'intro_1',
      speaker: 'narrator',
      text: 'Evening. A knot of soldiers crowds around a blanket spread in the dirt behind the cookfires. Dice clatter. Coins change hands.',
      positions: { felix: 'center' },
      next: 'intro_2',
    },
    intro_2: {
      id: 'intro_2',
      speaker: 'narrator',
      text: 'In the middle of it all sits a man you\u2019ve seen around camp \u2014 Felix Martel, a former musician with quick hands and a quicker smile. He\u2019s running the table and enjoying every minute.',
      next: 'felix_invite',
    },
    felix_invite: {
      id: 'felix_invite',
      speaker: 'felix',
      expression: 'happy',
      text: '"Room for one more, friend. Two sous to play. The dice don\u2019t care about rank."',
      choices: [
        {
          label: 'Join the game',
          description: 'Sit down, put your money in, roll the dice.',
          nextId: 'join_route',
        },
        {
          label: 'Watch',
          description: 'Stand at the edge. Learn how Felix works before risking your money.',
          nextId: 'watch_1',
        },
        {
          label: 'Decline',
          description: 'Walk away. You didn\u2019t survive this long by gambling.',
          nextId: 'decline_1',
        },
      ],
    },

    // === Join path — routing node (sous check) ===
    join_route: {
      id: 'join_route',
      speaker: 'narrator',
      text: 'You reach for your purse...',
      // Default: fall through to empty_purse. Condition: if sous >= 2, go to dice scene.
      next: 'empty_purse',
      gameConditionNext: [
        { minSous: 2, nextId: 'join_sit' },
      ],
    },

    // === No money path ===
    empty_purse: {
      id: 'empty_purse',
      speaker: 'narrator',
      text: 'You reach for your purse and find it empty.',
      next: 'empty_felix',
      gameEffect: { moraleChange: -1 },
    },
    empty_felix: {
      id: 'empty_felix',
      speaker: 'felix',
      expression: 'neutral',
      text: '"Next time, friend."',
      next: 'empty_end',
    },
    empty_end: {
      id: 'empty_end',
      speaker: 'narrator',
      text: 'The game goes on without you.',
      next: null,
    },

    // === Join + has money path ===
    join_sit: {
      id: 'join_sit',
      speaker: 'narrator',
      text: 'You sit down and put your sous in the pot. Felix grins and hands you the dice.',
      next: 'dice_roll',
    },
    dice_roll: {
      id: 'dice_roll',
      speaker: 'felix',
      expression: 'happy',
      text: '"Let\u2019s see what fortune thinks of you."',
      choices: [
        {
          label: 'Roll the dice',
          description: 'Trust to luck.',
          nextId: 'dice_roll', // placeholder — overridden by gameCheck
          statCheck: 'Luck ~50%',
          gameCheck: {
            stat: 'valor', // Using valor as proxy for "luck" — difficulty makes it ~50/50
            difficulty: 60,
            passNode: 'win_1',
            failNode: 'lose_1',
          },
        },
      ],
    },

    // === Win path ===
    win_1: {
      id: 'win_1',
      speaker: 'narrator',
      text: 'The dice tumble and settle. The crowd leans in. A murmur of approval.',
      next: 'win_2',
    },
    win_2: {
      id: 'win_2',
      speaker: 'narrator',
      text: 'The dice are kind tonight \u2014 or maybe Felix lets you win. You walk away with heavier pockets and a new acquaintance.',
      next: 'win_felix',
      gameEffect: {
        statChanges: { soldierRep: 1 },
        moraleChange: 3,
        sousChange: 3,
        npcRelationshipChanges: [{ npcId: 'felix', delta: 10 }],
        flagChanges: { gambling_accepted: true },
      },
    },
    win_felix: {
      id: 'win_felix',
      speaker: 'felix',
      expression: 'happy',
      text: '"Lucky man. Come back any time."',
      effect: 'flash',
      next: 'converge',
    },

    // === Lose path ===
    lose_1: {
      id: 'lose_1',
      speaker: 'narrator',
      text: 'The dice tumble and settle. Felix already has that look \u2014 the one that says he knew exactly how they\u2019d fall.',
      next: 'lose_2',
    },
    lose_2: {
      id: 'lose_2',
      speaker: 'narrator',
      text: 'You watch your sous disappear. You walk away lighter in the purse but richer in understanding: never trust a musician with dice.',
      next: 'lose_felix',
      gameEffect: {
        moraleChange: -1,
        sousChange: -2,
        npcRelationshipChanges: [{ npcId: 'felix', delta: 5 }],
        flagChanges: { gambling_accepted: true },
      },
    },
    lose_felix: {
      id: 'lose_felix',
      speaker: 'felix',
      expression: 'happy',
      text: '"Better luck next time."',
      next: 'converge',
    },

    // === Watch path ===
    watch_1: {
      id: 'watch_1',
      speaker: 'narrator',
      text: 'You stand at the edge and watch Felix work. He\u2019s good \u2014 quick hands, easy patter, always knows when to let someone win just enough to keep them playing.',
      next: 'watch_2',
    },
    watch_2: {
      id: 'watch_2',
      speaker: 'felix',
      expression: 'thoughtful',
      text: 'He catches your eye once and winks.',
      next: 'watch_end',
      gameEffect: {
        moraleChange: 1,
        npcRelationshipChanges: [{ npcId: 'felix', delta: 3 }],
        flagChanges: { gambling_accepted: true },
      },
    },
    watch_end: {
      id: 'watch_end',
      speaker: 'narrator',
      text: 'You file the observation away for later.',
      next: null,
    },

    // === Decline path ===
    decline_1: {
      id: 'decline_1',
      speaker: 'narrator',
      text: 'You shake your head and walk on.',
      next: 'decline_felix',
    },
    decline_felix: {
      id: 'decline_felix',
      speaker: 'felix',
      expression: 'neutral',
      text: '"Your loss, friend."',
      next: 'decline_end',
    },
    decline_end: {
      id: 'decline_end',
      speaker: 'narrator',
      text: 'The dice rattle behind you as you go.',
      next: null,
    },

    // === Convergence (win/lose paths merge here) ===
    converge: {
      id: 'converge',
      speaker: 'narrator',
      text: 'The game breaks up as the night deepens. Felix pockets his winnings with practiced ease and melts back into the camp.',
      next: null,
    },
  },
};
