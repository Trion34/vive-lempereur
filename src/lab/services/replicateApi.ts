/**
 * Replicate API client for image generation.
 * Calls go through the Vite dev proxy (/api/replicate → api.replicate.com).
 */

const API_BASE = '/api/replicate';

/* ------------------------------------------------------------------ */
/*  Model definitions                                                  */
/* ------------------------------------------------------------------ */

export interface ReplicateModel {
  id: string;
  label: string;
  owner: string;
  name: string;
  supportsAspectRatio: boolean;
  defaults: Record<string, unknown>;
}

export const AVAILABLE_MODELS: ReplicateModel[] = [
  {
    id: 'flux-schnell',
    label: 'Flux Schnell (Fast)',
    owner: 'black-forest-labs',
    name: 'flux-schnell',
    supportsAspectRatio: true,
    defaults: { num_outputs: 1, output_format: 'png' },
  },
  {
    id: 'flux-1.1-pro',
    label: 'Flux 1.1 Pro (Quality)',
    owner: 'black-forest-labs',
    name: 'flux-1.1-pro',
    supportsAspectRatio: true,
    defaults: { output_format: 'png' },
  },
  {
    id: 'flux-dev',
    label: 'Flux Dev (Balanced)',
    owner: 'black-forest-labs',
    name: 'flux-dev',
    supportsAspectRatio: true,
    defaults: { num_outputs: 1, num_inference_steps: 28, guidance_scale: 3.5, output_format: 'png' },
  },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 (Square)' },
  { id: '3:4', label: '3:4 (Portrait)' },
  { id: '4:3', label: '4:3 (Landscape)' },
  { id: '9:16', label: '9:16 (Tall)' },
  { id: '16:9', label: '16:9 (Wide)' },
  { id: '2:3', label: '2:3' },
  { id: '3:2', label: '3:2' },
] as const;

/* ------------------------------------------------------------------ */
/*  Style presets                                                      */
/* ------------------------------------------------------------------ */

export interface StylePreset {
  id: string;
  label: string;
  prefix: string;
  suffix: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'none',
    label: 'None',
    prefix: '',
    suffix: '',
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    prefix: 'Watercolor illustration, ',
    suffix: ', soft edges, muted earth tones, subtle brush strokes visible, warm parchment palette',
  },
  {
    id: 'oil-portrait',
    label: 'Oil Portrait',
    prefix: 'Classical oil painting portrait, ',
    suffix: ', rich chiaroscuro lighting, deep shadows, warm candle-lit tones, 18th century style, masterful brushwork',
  },
  {
    id: 'ink-wash',
    label: 'Ink & Wash',
    prefix: 'Pen and ink drawing with watercolor wash, ',
    suffix: ', fine line work, sepia and ochre tones, historical illustration style, crosshatching details',
  },
  {
    id: 'game-art',
    label: 'Game Art',
    prefix: 'Digital game character art, ',
    suffix: ', clean lines, vibrant but aged colors, semi-realistic style, character sheet quality',
  },
  {
    id: 'napoleonic',
    label: 'Napoleonic Era',
    prefix: 'Historical illustration from the Napoleonic era, ',
    suffix: ', period-accurate French military uniforms 1796, Italian Campaign, detailed military uniform and equipment, natural lighting',
  },
  {
    id: 'engraving',
    label: 'Period Engraving',
    prefix: 'Detailed historical engraving, ',
    suffix: ', fine line engraving style, cross-hatching, copper plate print quality, 18th century illustration',
  },
];

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

export function buildFullPrompt(
  userPrompt: string,
  preset: StylePreset,
): string {
  if (preset.id === 'none') return userPrompt;
  return `${preset.prefix}${userPrompt}${preset.suffix}`;
}

export async function createPrediction(
  apiKey: string,
  model: ReplicateModel,
  prompt: string,
  aspectRatio: string,
): Promise<{ id: string; urls: { get: string } }> {
  const input: Record<string, unknown> = {
    prompt,
    ...model.defaults,
  };
  if (model.supportsAspectRatio) {
    input.aspect_ratio = aspectRatio;
  }

  const res = await fetch(
    `${API_BASE}/v1/models/${model.owner}/${model.name}/predictions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({ input }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.detail || err.title || `Replicate API error: ${res.status}`,
    );
  }
  return res.json();
}

export interface PredictionResult {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  logs?: string;
}

export async function pollPrediction(
  apiKey: string,
  predictionId: string,
  onProgress?: (status: string) => void,
): Promise<PredictionResult> {
  const maxAttempts = 120; // 2 minutes max
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });

    if (!res.ok) throw new Error(`Poll error: ${res.status}`);

    const data: PredictionResult = await res.json();

    if (data.status === 'succeeded') return data;
    if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(data.error || `Prediction ${data.status}`);
    }

    onProgress?.(data.status);
    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error('Generation timed out after 2 minutes');
}

/**
 * Convenience: create + poll in one call.
 * Uses the `Prefer: wait` header so Replicate holds the connection
 * until completion (up to 60s). Falls back to polling if needed.
 */
export async function generateImage(
  apiKey: string,
  model: ReplicateModel,
  prompt: string,
  aspectRatio: string,
  onProgress?: (status: string) => void,
): Promise<string[]> {
  onProgress?.('starting');

  const prediction = await createPrediction(apiKey, model, prompt, aspectRatio);

  // The `Prefer: wait` header may return the result immediately
  const data = prediction as unknown as PredictionResult;
  if (data.status === 'succeeded' && data.output) {
    const output = Array.isArray(data.output) ? data.output : [data.output];
    return output;
  }

  // Otherwise poll
  onProgress?.('processing');
  const result = await pollPrediction(apiKey, prediction.id, onProgress);
  if (!result.output) throw new Error('No output from prediction');
  return Array.isArray(result.output) ? result.output : [result.output];
}

/**
 * Test that an API key is valid by listing models.
 */
export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/v1/models/black-forest-labs/flux-schnell`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
