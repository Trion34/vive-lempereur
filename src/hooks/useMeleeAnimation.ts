import { useCallback, useRef } from 'react';
import type { RoundAction, CombatantSnapshot, BattleState } from '../types';
import { MeleeActionId } from '../types';
import {
  playHitSound,
  playMissSound,
  playBlockSound,
  playMusketShotSound,
  playRicochetSound,
} from '../audio';

// Sub-modules
import { wait, ACTION_DISPLAY_NAMES } from './animation/constants';
import {
  getArtWrap,
  spawnFloatingText,
  spawnSlash,
  spawnCenterText,
  spawnCenterActionText,
  injectStatus,
} from './animation/effects';
import { updateMetersFromSnapshot, refreshCardFromState } from './animation/meters';
import { findSkirmishCard, spawnNewArrival, spawnNewAllyArrival } from './animation/cardSpawn';
import { showMeleeReloadAnimation } from './animation/reload';

function inferTargetSide(
  entry: RoundAction,
  preRoundSnapshot: Map<string, { snap: CombatantSnapshot; side: string }>,
): string {
  if (entry.actorSide === 'player' || entry.actorSide === 'ally') return 'enemy';
  const preSnap = preRoundSnapshot.get(entry.targetName);
  return preSnap?.side || 'player';
}

// ============================================================
// The main animation hook — orchestration only
// ============================================================

export function useMeleeAnimation() {
  const animatingRef = useRef(false);

  const animateSkirmishRound = useCallback(async (
    roundLog: RoundAction[],
    preRoundSnapshot: Map<string, { snap: CombatantSnapshot; side: string }>,
    battleState: BattleState,
  ) => {
    const field = document.getElementById('skirmish-field');
    if (!field) return;

    const ms = battleState.meleeState;
    if (!ms) return;

    animatingRef.current = true;

    // Clear guarding icons from all cards at the start of a new round
    // (these are imperatively injected by injectStatus, not React-managed)
    field.querySelectorAll('.opp-status-tag.guarding').forEach((el) => el.remove());

    // Strip ALL transitions from fill bars BEFORE reset
    const allFills = field.querySelectorAll('.skirmish-hud-fill') as NodeListOf<HTMLElement>;
    for (const fill of allFills) fill.style.transition = 'none';

    // Set all meters to pre-round state before animation begins
    for (const [name, { snap, side }] of preRoundSnapshot) {
      updateMetersFromSnapshot(name, side, snap);
    }
    // Force reflow, then enable smooth transitions
    void field.offsetHeight;
    for (const fill of allFills) fill.style.transition = 'width 0.4s ease';

    for (const entry of roundLog) {
      const eventType = entry.eventType || 'action';

      // ---- ARRIVAL ----
      if (eventType === 'arrival') {
        if (entry.actorSide === 'enemy') {
          await spawnNewArrival(entry.actorName, 'enemy', ms, entry.actorAfter);
        } else if (entry.actorSide === 'ally') {
          await spawnNewAllyArrival(entry.actorName, ms, entry.narrative, entry.actorAfter);
        }
        continue;
      }

      // ---- DEFEAT ----
      if (eventType === 'defeat') {
        const card = findSkirmishCard(entry.actorName, entry.actorSide);
        if (card) {
          if (entry.narrative) {
            spawnCenterText(field, entry.narrative.toUpperCase(), 'center-text-miss');
            await wait(800);
          }
          card.classList.add('enemy-departing');
          await wait(1000);
          // Don't call card.remove() — let React unmount the component on next render.
          // The CSS animation (enemy-depart) already hides it with opacity:0 + forwards.
        }
        continue;
      }

      // ---- NORMAL ACTION ----
      field
        .querySelectorAll('.skirmish-glow-attacker, .skirmish-glow-target, .skirmish-surge')
        .forEach((el) =>
          el.classList.remove('skirmish-glow-attacker', 'skirmish-glow-target', 'skirmish-surge'),
        );

      let actorCard = findSkirmishCard(entry.actorName, entry.actorSide);
      if (!actorCard && entry.actorSide === 'enemy') {
        actorCard = await spawnNewArrival(entry.actorName, 'enemy', ms, entry.actorAfter);
      }

      const targetSide = entry.targetSide || inferTargetSide(entry, preRoundSnapshot);
      let targetCard = findSkirmishCard(entry.targetName, targetSide);
      if (!targetCard && targetSide === 'enemy') {
        targetCard = await spawnNewArrival(entry.targetName, 'enemy', ms, entry.targetAfter);
      }

      const isAttack =
        entry.action !== MeleeActionId.Guard &&
        entry.action !== MeleeActionId.Respite &&
        entry.action !== MeleeActionId.Reload &&
        entry.action !== MeleeActionId.SecondWind &&
        entry.action !== MeleeActionId.UseCanteen;

      // DELIBERATION
      await wait(500);

      if (!isAttack) {
        const actorShort = entry.actorName.split(' \u2014 ')[0];
        let label = 'guards';
        if (entry.action === MeleeActionId.Respite) label = 'catches breath';
        if (entry.action === MeleeActionId.Reload) label = 'reloads';
        if (entry.action === MeleeActionId.SecondWind) label = 'finds second wind';
        if (entry.action === MeleeActionId.UseCanteen) label = 'drinks from canteen';
        if (entry.action === MeleeActionId.Guard) {
          playBlockSound();
          if (actorCard) injectStatus(actorCard, 'guarding', 'Guarding \u2014 Braced for the next attack');
        }
        if (actorCard) actorCard.classList.add('skirmish-glow-attacker');
        spawnCenterText(field, `${actorShort} ${label}`, 'center-text-neutral');
        await wait(1000);

        if (entry.action === MeleeActionId.Respite) {
          spawnCenterText(field, 'CATCH BREATH', 'center-text-hit');
        } else if (entry.action === MeleeActionId.SecondWind) {
          if (entry.hit) {
            spawnCenterText(field, 'SECOND WIND \u2014 SUCCESS', 'center-text-hit');
          } else {
            spawnCenterText(field, 'SECOND WIND \u2014 FAILED', 'center-text-miss');
          }
        } else if (entry.action === MeleeActionId.UseCanteen) {
          spawnCenterText(field, 'DRINK CANTEEN', 'center-text-hit');
          if (actorCard && entry.damage > 0) {
            spawnFloatingText(getArtWrap(actorCard), `+${Math.round(entry.damage)} HP`, 'float-heal');
          }
        }
        if (
          entry.action === MeleeActionId.Respite ||
          entry.action === MeleeActionId.SecondWind ||
          entry.action === MeleeActionId.UseCanteen
        ) {
          await wait(1200);
        }

        if (entry.actorAfter) {
          updateMetersFromSnapshot(entry.actorName, entry.actorSide, entry.actorAfter);
        }

        if (actorCard) actorCard.classList.remove('skirmish-glow-attacker');
        await wait(400);
        continue;
      }

      // === GLOW PHASE ===
      if (actorCard) {
        actorCard.classList.add('skirmish-glow-attacker');
        void actorCard.offsetWidth;
        actorCard.classList.add('skirmish-surge');
      }
      if (targetCard) targetCard.classList.add('skirmish-glow-target');
      const actionName = ACTION_DISPLAY_NAMES[entry.action] || entry.action;
      const bodyPartLabel = entry.bodyPart ? entry.bodyPart : '';
      spawnCenterActionText(field, actionName, bodyPartLabel);
      await wait(1200);

      // === RESULT PHASE ===
      if (entry.hit) {
        spawnCenterText(field, 'HIT', 'center-text-hit');
        if (entry.action === MeleeActionId.Shoot) playMusketShotSound();
        else playHitSound();
        if (entry.damage > 0 && targetCard) {
          const targetArt = getArtWrap(targetCard);
          spawnSlash(targetArt);
          spawnFloatingText(targetArt, `-${Math.round(entry.damage)}`, 'float-damage');
        }
        if (entry.special && targetCard) {
          const special = entry.special.toUpperCase();
          if (special.includes('STUN'))
            injectStatus(targetCard, 'stunned', 'Stunned \u2014 Cannot act this turn');
          if (special.includes('ARM'))
            injectStatus(targetCard, 'arm-injured', 'Arm Injured \u2014 Hit chance reduced');
          if (special.includes('LEG'))
            injectStatus(targetCard, 'leg-injured', 'Leg Injured \u2014 Stamina costs increased');
          const statusText = entry.special.trim().replace('.', '').replace('!', '').toUpperCase();
          setTimeout(() => {
            if (targetCard)
              spawnFloatingText(
                getArtWrap(targetCard),
                statusText,
                statusText === 'KILLED' ? 'float-defeated' : 'float-status',
              );
          }, 500);
        }
      } else if (entry.blocked) {
        spawnCenterText(field, 'BLOCKED', 'center-text-block');
        playBlockSound();
        if (targetCard) spawnFloatingText(getArtWrap(targetCard), 'BLOCKED', 'float-block');
      } else {
        spawnCenterText(field, 'MISS', 'center-text-miss');
        if (entry.action === MeleeActionId.Shoot) playRicochetSound();
        else playMissSound();
      }
      await wait(1200);

      if (entry.targetAfter) {
        updateMetersFromSnapshot(entry.targetName, targetSide, entry.targetAfter);
      }
      if (entry.actorAfter) {
        updateMetersFromSnapshot(entry.actorName, entry.actorSide, entry.actorAfter);
      }

      // Legacy death departure
      if (
        entry.targetKilled &&
        targetCard &&
        !roundLog.some((e) => e.eventType === 'defeat' && e.actorName === entry.targetName)
      ) {
        targetCard.classList.add('enemy-departing');
        await wait(1000);
        // Don't call targetCard.remove() — let React unmount the component on next render.
        // The CSS animation (enemy-depart) already hides it with opacity:0 + forwards.
      }

      // Clear
      if (actorCard) actorCard.classList.remove('skirmish-glow-attacker', 'skirmish-surge');
      if (targetCard) targetCard.classList.remove('skirmish-glow-target');
      await wait(600);
    }

    // Final sync: strip transitions and refresh all live combatants
    const syncField = document.getElementById('skirmish-field');
    if (syncField) {
      const syncFills = syncField.querySelectorAll('.skirmish-hud-fill') as NodeListOf<HTMLElement>;
      for (const fill of syncFills) fill.style.transition = 'none';
    }
    if (ms) {
      refreshCardFromState(battleState.player.name, 'player', battleState);
      for (const ally of ms.allies) {
        if (ally.alive && ally.health > 0) refreshCardFromState(ally.name, 'ally', battleState);
      }
      for (const idx of ms.activeEnemies) {
        const opp = ms.opponents[idx];
        if (opp.health > 0) refreshCardFromState(opp.name, 'enemy', battleState);
      }
    }

    animatingRef.current = false;
  }, []);

  const animateReload = useCallback(async (isSecondHalf: boolean) => {
    await showMeleeReloadAnimation(isSecondHalf);
  }, []);

  const floatPlayerDeltas = useCallback((
    playerName: string,
    moraleDelta: number,
    staminaDelta: number,
  ) => {
    const playerSprite = findSkirmishCard(playerName, 'player');
    if (!playerSprite) return;
    const playerArt = getArtWrap(playerSprite);

    if (moraleDelta !== 0) {
      const cls = moraleDelta > 0 ? 'float-morale-gain' : 'float-morale-loss';
      const text = moraleDelta > 0 ? `+${moraleDelta} MR` : `${moraleDelta} MR`;
      spawnFloatingText(playerArt, text, cls);
    }
    if (staminaDelta !== 0) {
      setTimeout(
        () => {
          const text = staminaDelta > 0 ? `+${staminaDelta} ST` : `${staminaDelta} ST`;
          spawnFloatingText(playerArt, text, 'float-stamina-change');
        },
        moraleDelta !== 0 ? 300 : 0,
      );
    }
  }, []);

  return {
    animateSkirmishRound,
    animateReload,
    floatPlayerDeltas,
    animatingRef,
  };
}
