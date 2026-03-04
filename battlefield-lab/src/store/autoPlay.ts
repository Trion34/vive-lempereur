import {
  resolveCommand,
  resolvePresent,
  resolveFire,
  resolveEndure,
  resolveLoad,
  chooseAustrianOrder,
  chooseFrenchAutoOrder,
} from '../engagement';
import type { EngagementState, Order, VolleyTier } from '../engagement';
import type { RendererHandle } from '../renderers/types';
import { useLabStore } from './labStore';

function wait(ms: number, speedMultiplier: number) {
  return new Promise<void>((r) => setTimeout(r, ms / Math.max(0.1, speedMultiplier)));
}

const TIER_RANK: Record<VolleyTier, number> = { devastating: 3, effective: 2, ragged: 1, ineffective: 0 };

/** Pick the most common tier across all 3 pairs; break ties toward the more notable one. */
function dominantTier(tiers: (VolleyTier | undefined)[]): VolleyTier | null {
  const counts = new Map<VolleyTier, number>();
  for (const t of tiers) {
    if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  if (counts.size === 0) return null;

  let best: VolleyTier | null = null;
  let bestCount = 0;
  for (const [tier, count] of counts) {
    if (count > bestCount || (count === bestCount && best !== null && TIER_RANK[tier] > TIER_RANK[best])) {
      best = tier;
      bestCount = count;
    }
  }
  return best;
}

function ordinalSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

let stopFlag = false;

export function stopAutoPlay() {
  stopFlag = true;
}

/** Fire one side's companies one at a time, fading each label after it fires. */
async function fireStaggered(
  renderer: RendererHandle,
  side: 'french' | 'austrian',
  orders: [Order, Order, Order],
  statuses: [string, string, string],
  speed: number,
): Promise<void> {
  const PAUSE_BETWEEN = 450;

  for (let i = 0; i < 3; i++) {
    if (stopFlag) break;
    // Skip destroyed/routing companies entirely
    if (statuses[i] === 'routing' || statuses[i] === 'destroyed') {
      renderer.hideOrderLabel(side, i);
      continue;
    }
    // HOLD companies don't fire — just fade the label
    if (orders[i] === 'hold_fire') {
      renderer.hideOrderLabel(side, i);
      continue;
    }
    // Charge: play charge animation instead of volley
    if (orders[i] === 'charge') {
      await renderer.playCharge(side, i);
      renderer.hideOrderLabel(side, i);
      if (i < 2) await wait(PAUSE_BETWEEN, speed);
      continue;
    }
    // Fire this company
    await renderer.playVolley(side, i);
    renderer.hideOrderLabel(side, i);
    // Pause between companies (shorter after the last one)
    if (i < 2) await wait(PAUSE_BETWEEN, speed);
  }
}

export async function startAutoPlay(rendererRef: React.RefObject<RendererHandle | null>) {
  const store = useLabStore.getState();

  if (store.isRunning) {
    stopAutoPlay();
    return;
  }

  stopFlag = false;
  useLabStore.setState({ isRunning: true });

  // Deep-copy current engagement to preserve scenario overrides
  const currentEng = useLabStore.getState().engagement;
  const eng: EngagementState = {
    ...currentEng,
    french: currentEng.french.map(f => ({ ...f })) as EngagementState['french'],
    austrian: currentEng.austrian.map(f => ({ ...f })) as EngagementState['austrian'],
    phase: 'ready',
    volleyCount: 0,
    winner: null,
    volleyStepData: null,
    drillStep: null,
  };
  eng.autoPlay = true;

  useLabStore.setState({ engagement: { ...eng } });

  const speed = () => useLabStore.getState().visualParams.animationSpeed;

  while (eng.phase !== 'ended') {
    if (stopFlag) break;

    // AI assigns orders for both sides
    for (let i = 0; i < 3; i++) {
      if (eng.french[i].status === 'active') {
        eng.french[i].order = chooseFrenchAutoOrder(eng.french[i], i, eng);
      }
      if (eng.austrian[i].status === 'active') {
        eng.austrian[i].order = chooseAustrianOrder(eng.austrian[i], i, eng);
      }
    }

    const frenchOrders: [Order, Order, Order] = [
      eng.french[0].order, eng.french[1].order, eng.french[2].order,
    ];
    const austrianOrders: [Order, Order, Order] = [
      eng.austrian[0].order, eng.austrian[1].order, eng.austrian[2].order,
    ];
    const frenchStatuses: [string, string, string] = [
      eng.french[0].status, eng.french[1].status, eng.french[2].status,
    ];
    const austrianStatuses: [string, string, string] = [
      eng.austrian[0].status, eng.austrian[1].status, eng.austrian[2].status,
    ];

    // Step through drill cadence with visual updates
    resolveCommand(eng);
    useLabStore.setState({ engagement: { ...eng } });
    await wait(250, speed());
    if (stopFlag) break;

    resolvePresent(eng);
    useLabStore.setState({ engagement: { ...eng } });
    await wait(200, speed());
    if (stopFlag) break;

    resolveFire(eng);
    useLabStore.setState({ engagement: { ...eng } });

    // French turn: show French labels, fire, hide
    rendererRef.current?.showOrderLabels('french', frenchOrders);
    if (rendererRef.current) {
      await fireStaggered(rendererRef.current, 'french', frenchOrders, frenchStatuses, speed());
    }
    await wait(600, speed());
    if (stopFlag) break;

    // Austrian turn: show Austrian labels, fire, hide
    rendererRef.current?.showOrderLabels('austrian', austrianOrders);
    if (rendererRef.current) {
      await fireStaggered(rendererRef.current, 'austrian', austrianOrders, austrianStatuses, speed());
    }
    await wait(500, speed());
    if (stopFlag) break;

    resolveEndure(eng);
    useLabStore.setState({ engagement: { ...eng } });
    await wait(350, speed());
    if (stopFlag) break;

    const result = resolveLoad(eng);
    useLabStore.setState({ engagement: { ...eng } });

    // Log volley result with tier info (skip pure reload volleys)
    const frDmg = result.pairs.reduce((s, p) => s + p.frenchDamage, 0);
    const atDmg = result.pairs.reduce((s, p) => s + p.austrianDamage, 0);
    if (frDmg > 0 || atDmg > 0) {
      const frTier = dominantTier(result.pairs.map(p => p.frenchRoll?.tier));
      const atTier = dominantTier(result.pairs.map(p => p.austrianRoll?.tier));
      useLabStore.getState().addVolleyLog(
        `V${eng.volleyCount}: FR -${Math.round(frDmg)}%${frTier ? ` (${frTier})` : ''} / AT -${Math.round(atDmg)}%${atTier ? ` (${atTier})` : ''}`,
      );
    }

    // Log charge results
    for (const pair of result.pairs) {
      if (pair.meleeResult) {
        const m = pair.meleeResult;
        const tier = m.margin >= 40 ? 'DECISIVE' : m.margin >= 15 ? 'CLEAR' : 'NARROW';
        const chargerLabel = m.chargerSide === 'french' ? 'FR' : 'AT';
        const victorLabel = m.victorSide === 'french' ? 'FR' : 'AT';
        useLabStore.getState().addVolleyLog(
          `V${eng.volleyCount}: ${chargerLabel} ${pair.pairIndex + 1}${ordinalSuffix(pair.pairIndex + 1)} CHARGES → ${victorLabel} ${tier} VICTORY (margin +${Math.round(m.margin)})`,
        );
      }
    }

    await wait(400, speed());
  }

  useLabStore.setState({ engagement: { ...eng }, isRunning: false });
}

export async function executeManualVolley(
  rendererRef: React.RefObject<RendererHandle | null>,
) {
  stopFlag = false;
  const { engagement, frenchOrders, visualParams } = useLabStore.getState();
  if (engagement.phase === 'ended') return;

  const eng: EngagementState = {
    ...engagement,
    french: engagement.french.map(f => ({ ...f })) as EngagementState['french'],
    austrian: engagement.austrian.map(f => ({ ...f })) as EngagementState['austrian'],
  };

  // Assign French orders from UI
  for (let i = 0; i < 3; i++) {
    if (eng.french[i].status === 'active') {
      eng.french[i].order = frenchOrders[i];
    }
  }

  // Assign Austrian orders from AI
  for (let i = 0; i < 3; i++) {
    if (eng.austrian[i].status === 'active') {
      eng.austrian[i].order = chooseAustrianOrder(eng.austrian[i], i, eng);
    }
  }

  const austrianOrders: [Order, Order, Order] = [
    eng.austrian[0].order, eng.austrian[1].order, eng.austrian[2].order,
  ];
  const frenchStatuses: [string, string, string] = [
    eng.french[0].status, eng.french[1].status, eng.french[2].status,
  ];
  const austrianStatuses: [string, string, string] = [
    eng.austrian[0].status, eng.austrian[1].status, eng.austrian[2].status,
  ];

  // Resolve all steps
  resolveCommand(eng);
  resolvePresent(eng);
  resolveFire(eng);

  useLabStore.setState({ engagement: { ...eng } });

  const speed = visualParams.animationSpeed;

  // French turn: show French labels, fire, hide
  rendererRef.current?.showOrderLabels('french', frenchOrders as [Order, Order, Order]);
  if (rendererRef.current) {
    await fireStaggered(rendererRef.current, 'french', frenchOrders as [Order, Order, Order], frenchStatuses, speed);
  }
  await wait(400, speed);

  // Austrian turn: show Austrian labels, fire, hide
  rendererRef.current?.showOrderLabels('austrian', austrianOrders);
  if (rendererRef.current) {
    await fireStaggered(rendererRef.current, 'austrian', austrianOrders, austrianStatuses, speed);
  }
  await wait(300, speed);

  resolveEndure(eng);
  const result = resolveLoad(eng);

  // Log with tier info (skip pure reload volleys)
  const frDmg = result.pairs.reduce((s, p) => s + p.frenchDamage, 0);
  const atDmg = result.pairs.reduce((s, p) => s + p.austrianDamage, 0);
  if (frDmg > 0 || atDmg > 0) {
    const frTier = dominantTier(result.pairs.map(p => p.frenchRoll?.tier));
    const atTier = dominantTier(result.pairs.map(p => p.austrianRoll?.tier));
    useLabStore.getState().addVolleyLog(
      `V${eng.volleyCount}: FR -${Math.round(frDmg)}%${frTier ? ` (${frTier})` : ''} / AT -${Math.round(atDmg)}%${atTier ? ` (${atTier})` : ''}`,
    );
  }

  // Log charge results
  for (const pair of result.pairs) {
    if (pair.meleeResult) {
      const m = pair.meleeResult;
      const tier = m.margin >= 40 ? 'DECISIVE' : m.margin >= 15 ? 'CLEAR' : 'NARROW';
      const chargerLabel = m.chargerSide === 'french' ? 'FR' : 'AT';
      const victorLabel = m.victorSide === 'french' ? 'FR' : 'AT';
      useLabStore.getState().addVolleyLog(
        `V${eng.volleyCount}: ${chargerLabel} ${pair.pairIndex + 1}${ordinalSuffix(pair.pairIndex + 1)} CHARGES → ${victorLabel} ${tier} VICTORY (margin +${Math.round(m.margin)})`,
      );
    }
  }

  useLabStore.setState({ engagement: { ...eng } });
}
