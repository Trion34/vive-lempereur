import {
  BattleState, BattleEvent, ShockEventType, RecoveryEventType,
} from '../types';

const usedTexts = new Set<string>();

export function resetEventTexts() { usedTexts.clear(); }

function pick(arr: string[]): string {
  const unused = arr.filter(t => !usedTexts.has(t));
  const pool = unused.length > 0 ? unused : arr;
  const choice = pool[Math.floor(Math.random() * pool.length)];
  usedTexts.add(choice);
  return choice;
}

export function generateTurnEvents(state: BattleState): BattleEvent[] {
  const events: BattleEvent[] = [];
  const { enemy, line, turn } = state;
  const intensity = Math.min(1, turn / 20 + (1 - enemy.range / 300) * 0.5);

  if (enemy.artillery && Math.random() < 0.35) {
    events.push({
      type: ShockEventType.ArtilleryBarrage,
      description: pick([
        'A roundshot screams overhead and buries itself in the earth behind you. Dirt rains down.',
        'The ground shakes. A cannon ball bounces through the rear rank.',
        'A shell bursts twenty paces to your left. The smoke smells of iron and something worse.',
        'A canister round rips through the air like a swarm of hornets.',
        'The battery fires again. The ball strikes a tree, which splits and topples.',
        'Grapeshot patters into the ground ahead. Too short. This time.',
        'A solid shot passes close enough to feel the wind of it. Your heart stops, then hammers.',
      ]),
      moraleEffect: -8,
      triggered: true,
    });
  }

  // Bug fix: store targetNeighbour so consequence code kills the right person
  if (Math.random() < intensity * 0.12) {
    const side: 'leftNeighbour' | 'rightNeighbour' = Math.random() > 0.5 ? 'leftNeighbour' : 'rightNeighbour';
    const n = line[side];
    if (n?.alive && !n.routing) {
      const drain = n.relationship > 60 ? -15 : n.relationship > 30 ? -10 : -6;
      events.push({
        type: ShockEventType.NeighbourKilled,
        description: `${n.name} takes a ball in the ${pick(['throat', 'chest', 'face', 'temple'])}. He drops without a sound. The space is suddenly, terribly empty.`,
        moraleEffect: drain,
        triggered: true,
        targetNeighbour: side,
      });
    }
  }

  if (Math.random() < intensity * 0.15) {
    const side: 'leftNeighbour' | 'rightNeighbour' = Math.random() > 0.5 ? 'leftNeighbour' : 'rightNeighbour';
    const n = line[side];
    if (n?.alive && !n.wounded && !n.routing) {
      events.push({
        type: ShockEventType.FriendWounded,
        description: pick([
          `${n.name} cries out — hit in the ${pick(['arm', 'shoulder', 'leg'])}. Blood running freely.`,
          `${n.name} stumbles. A dark stain spreading across his sleeve. He looks at you, bewildered.`,
          `Blood on ${n.name}'s face. A splinter or graze. He wipes it away and raises his musket. Hands shaking.`,
        ]),
        moraleEffect: -4,
        triggered: true,
        targetNeighbour: side,
      });
    }
  }

  if (line.officer.alive && Math.random() < intensity * 0.04) {
    events.push({
      type: ShockEventType.OfficerDown,
      description: pick([
        `${line.officer.rank} ${line.officer.name} pitches forward. The sword clatters from his hand. No one moves to pick it up.`,
        `A shout — ${line.officer.rank} ${line.officer.name} is hit. He sits down carefully, pressing his hand to his side, looking surprised.`,
        `${line.officer.rank} ${line.officer.name} falls mid-sentence, giving an order no one will hear the end of.`,
      ]),
      moraleEffect: -12,
      triggered: true,
    });
  }

  if (enemy.artillery && Math.random() < intensity * 0.06) {
    events.push({
      type: ShockEventType.CannonballLane,
      description: pick([
        'A roundshot comes in low and carves a lane through the file. Three men gone. The sound is indescribable.',
        'A cannon ball takes the legs from two men in the front rank. The rear rank steps over them.',
        'The ball strikes ground, bounces, passes through the rank like a scythe through wheat.',
      ]),
      moraleEffect: -14,
      triggered: true,
    });
  }

  if (enemy.cavalryThreat && Math.random() < 0.08 && turn > 5) {
    events.push({
      type: ShockEventType.CavalryFlank,
      description: pick([
        'Someone screams "CAVALRY!" On the flank — horsemen. Moving fast. The ground trembles.',
        'Hoofbeats. Not single horses — a mass of them. Austrian hussars wheeling toward your flank.',
        'Through the smoke, horsemen at the gallop — Austrian uhlans with their lances. Cavalry on your exposed side.',
      ]),
      moraleEffect: -10,
      triggered: true,
    });
  }

  // === RECOVERY ===
  if (Math.random() < 0.25 && line.lineIntegrity > 50) {
    events.push({
      type: RecoveryEventType.SuccessfulVolley,
      description: pick([
        'The volley strikes home. Their line staggers. They felt that.',
        'Musketry all along the line. The smoke clears — their ranks are thinner.',
        'Your volley rips into them. A cheer from somewhere down the line.',
        'Their front rank folds. The line holds. Your fire is hitting.',
      ]),
      moraleEffect: 4,
      triggered: true,
    });
  }

  if (line.drumsPlaying && Math.random() < 0.2) {
    events.push({
      type: RecoveryEventType.DrumsRally,
      description: pick([
        'The drummer boy beats on. The rhythm steadies something in your chest.',
        'BAM-bam-bam-bam. The drums cut through everything. You load in time with them.',
        'The drums never stop. Through smoke, through screaming — the rhythm. The heartbeat of the line.',
        'You feel the drums in your ribcage. Still here, still here, still here.',
      ]),
      moraleEffect: 3,
      triggered: true,
    });
  }

  if (line.ncoPresent && Math.random() < 0.15) {
    events.push({
      type: RecoveryEventType.NCORally,
      description: pick([
        '"STEADY! Hold the line!" Sergeant Duval walks behind the rank like he\'s on parade.',
        '"Close up! Close the gaps! Show \'em." The sergeant\'s voice is the most solid thing in the world.',
        '"Nobody runs. We hold here or die here. And we are NOT dying today."',
        '"Keep firing. Make them pay for every step." He claps a wavering man on the shoulder.',
        '"I\'ve seen worse at Castiglione. This is nothing. NOTHING. Now load your muskets."',
      ]),
      moraleEffect: 5,
      triggered: true,
    });
  }

  if (Math.random() < 0.08 && enemy.range > 150) {
    events.push({
      type: RecoveryEventType.LullInFire,
      description: pick([
        'A pause in the firing. The smoke drifts. For ten heartbeats, birds. Then it begins again.',
        'A moment of quiet. The guns pause to reload. You breathe. Just breathe.',
        'The wind clears the smoke. For an instant — sky. Blue. Absurdly blue for a day like this.',
      ]),
      moraleEffect: 4,
      triggered: true,
    });
  }

  return events;
}
