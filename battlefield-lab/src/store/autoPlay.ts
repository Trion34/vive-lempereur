import {
  createEngagement,
  resolveCommand,
  resolvePresent,
  resolveFire,
  resolveEndure,
  resolveLoad,
  chooseAustrianOrder,
  chooseFrenchAutoOrder,
} from '../engagement';
import type { EngagementState, Order } from '../engagement';
import type { RendererHandle } from '../renderers/types';
import { useLabStore } from './labStore';

function wait(ms: number, speedMultiplier: number) {
  return new Promise<void>((r) => setTimeout(r, ms / Math.max(0.1, speedMultiplier)));
}

let stopFlag = false;

export function stopAutoPlay() {
  stopFlag = true;
}

export async function startAutoPlay(rendererRef: React.RefObject<RendererHandle | null>) {
  const store = useLabStore.getState();

  if (store.isRunning) {
    stopAutoPlay();
    return;
  }

  stopFlag = false;
  useLabStore.setState({ isRunning: true });

  // Read fresh state for setup
  const { frenchFormations, austrianFormations } = useLabStore.getState();
  const currentEng = useLabStore.getState().engagement;

  const eng = createEngagement(currentEng.range);
  eng.austrianDoctrine = currentEng.austrianDoctrine;
  eng.autoPlay = true;
  eng.french.forEach((f, i) => { f.formation = frenchFormations[i]; });
  eng.austrian.forEach((f, i) => { f.formation = austrianFormations[i]; });

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

    // Show order labels above all formations
    rendererRef.current?.showOrderLabels('french', [
      eng.french[0].order, eng.french[1].order, eng.french[2].order,
    ] as [Order, Order, Order]);
    rendererRef.current?.showOrderLabels('austrian', [
      eng.austrian[0].order, eng.austrian[1].order, eng.austrian[2].order,
    ] as [Order, Order, Order]);

    // Step through drill cadence with visual updates
    resolveCommand(eng);
    useLabStore.setState({ engagement: { ...eng } });
    await wait(100, speed());
    if (stopFlag) break;

    resolvePresent(eng);
    useLabStore.setState({ engagement: { ...eng } });
    await wait(100, speed());
    if (stopFlag) break;

    resolveFire(eng);
    useLabStore.setState({ engagement: { ...eng } });

    // Animate French volley
    await rendererRef.current?.playVolley('french');
    rendererRef.current?.hideOrderLabels('french');
    await wait(400, speed());
    if (stopFlag) break;

    // Animate Austrian volley
    await rendererRef.current?.playVolley('austrian');
    rendererRef.current?.hideOrderLabels('austrian');
    await wait(300, speed());
    if (stopFlag) break;

    resolveEndure(eng);
    useLabStore.setState({ engagement: { ...eng } });
    await wait(200, speed());
    if (stopFlag) break;

    const result = resolveLoad(eng);
    useLabStore.setState({ engagement: { ...eng } });

    // Log volley result
    const frDmg = result.pairs.reduce((s, p) => s + p.frenchDamage, 0);
    const atDmg = result.pairs.reduce((s, p) => s + p.austrianDamage, 0);
    useLabStore.getState().addVolleyLog(
      `V${eng.volleyCount}: FR -${Math.round(frDmg)}% / AT -${Math.round(atDmg)}%`,
    );

    await wait(300, speed());
  }

  useLabStore.setState({ engagement: { ...eng }, isRunning: false });
}

export async function executeManualVolley(
  rendererRef: React.RefObject<RendererHandle | null>,
) {
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

  // Show order labels above all formations
  rendererRef.current?.showOrderLabels('french', frenchOrders as [Order, Order, Order]);
  rendererRef.current?.showOrderLabels('austrian', [
    eng.austrian[0].order, eng.austrian[1].order, eng.austrian[2].order,
  ] as [Order, Order, Order]);

  // Resolve all steps
  resolveCommand(eng);
  resolvePresent(eng);
  resolveFire(eng);

  useLabStore.setState({ engagement: { ...eng } });

  const speed = visualParams.animationSpeed;

  // Animate
  await rendererRef.current?.playVolley('french');
  rendererRef.current?.hideOrderLabels('french');
  await wait(400, speed);
  await rendererRef.current?.playVolley('austrian');
  rendererRef.current?.hideOrderLabels('austrian');
  await wait(300, speed);

  resolveEndure(eng);
  const result = resolveLoad(eng);

  // Reload muskets for next volley
  for (const side of [eng.french, eng.austrian]) {
    for (const f of side) {
      if (f.status === 'active' && !f.musketLoaded) {
        f.musketLoaded = true;
      }
    }
  }

  // Log
  const frDmg = result.pairs.reduce((s, p) => s + p.frenchDamage, 0);
  const atDmg = result.pairs.reduce((s, p) => s + p.austrianDamage, 0);
  useLabStore.getState().addVolleyLog(
    `V${eng.volleyCount}: FR -${Math.round(frDmg)}% / AT -${Math.round(atDmg)}%`,
  );

  useLabStore.setState({ engagement: { ...eng } });
}
