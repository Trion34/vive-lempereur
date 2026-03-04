import type { RendererPlugin } from './types';

const renderers = new Map<string, RendererPlugin>();

export function registerRenderer(plugin: RendererPlugin): void {
  renderers.set(plugin.id, plugin);
}

export function getRenderer(id: string): RendererPlugin | undefined {
  return renderers.get(id);
}

export function getAllRenderers(): RendererPlugin[] {
  return Array.from(renderers.values());
}

export function getRenderersForTier(tier: 1 | 2 | 3): RendererPlugin[] {
  return getAllRenderers().filter(r => r.tiers.length === 0 || r.tiers.includes(tier));
}
