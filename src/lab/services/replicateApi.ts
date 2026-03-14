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
  supportsSeed: boolean;
  supportsGuidance: boolean;
  supportsSteps: boolean;
  supportsPromptUpsampling: boolean;
  defaults: Record<string, unknown>;
  guidanceRange?: [number, number];
  stepsRange?: [number, number];
}

export const AVAILABLE_MODELS: ReplicateModel[] = [
  {
    id: 'flux-schnell',
    label: 'Flux Schnell (Fast)',
    owner: 'black-forest-labs',
    name: 'flux-schnell',
    supportsAspectRatio: true,
    supportsSeed: true,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: false,
    defaults: { num_outputs: 1, output_format: 'png' },
  },
  {
    id: 'flux-1.1-pro',
    label: 'Flux 1.1 Pro (Quality)',
    owner: 'black-forest-labs',
    name: 'flux-1.1-pro',
    supportsAspectRatio: true,
    supportsSeed: true,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: true,
    defaults: { output_format: 'png' },
  },
  {
    id: 'flux-dev',
    label: 'Flux Dev (Balanced)',
    owner: 'black-forest-labs',
    name: 'flux-dev',
    supportsAspectRatio: true,
    supportsSeed: true,
    supportsGuidance: true,
    supportsSteps: true,
    supportsPromptUpsampling: false,
    defaults: { num_outputs: 1, num_inference_steps: 28, guidance: 3.5, output_format: 'png' },
    guidanceRange: [1, 20],
    stepsRange: [1, 50],
  },
  // Google NanoBanana models (via Replicate)
  {
    id: 'nano-banana-pro',
    label: 'NanoBanana Pro (Best Quality)',
    owner: 'google',
    name: 'nano-banana-pro',
    supportsAspectRatio: true,
    supportsSeed: false,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: false,
    defaults: { output_format: 'png' },
  },
  {
    id: 'nano-banana-2',
    label: 'NanoBanana 2 (Fast + Quality)',
    owner: 'google',
    name: 'nano-banana-2',
    supportsAspectRatio: true,
    supportsSeed: false,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: false,
    defaults: { output_format: 'png' },
  },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 (Square)' },
  { id: '3:4', label: '3:4 (Portrait)' },
  { id: '4:3', label: '4:3 (Landscape)' },
  { id: '4:5', label: '4:5' },
  { id: '5:4', label: '5:4' },
  { id: '9:16', label: '9:16 (Tall)' },
  { id: '16:9', label: '16:9 (Wide)' },
  { id: '21:9', label: '21:9 (Ultrawide)' },
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
  isBuiltIn: boolean;
}

export const BUILT_IN_PRESETS: StylePreset[] = [
  {
    id: 'none',
    label: 'None',
    prefix: '',
    suffix: '',
    isBuiltIn: true,
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    prefix: 'Watercolor illustration, ',
    suffix: ', soft edges, muted earth tones, subtle brush strokes visible, warm parchment palette',
    isBuiltIn: true,
  },
  {
    id: 'oil-portrait',
    label: 'Oil Portrait',
    prefix: 'Classical oil painting portrait, ',
    suffix: ', rich chiaroscuro lighting, deep shadows, warm candle-lit tones, 18th century style, masterful brushwork',
    isBuiltIn: true,
  },
  {
    id: 'ink-wash',
    label: 'Ink & Wash',
    prefix: 'Pen and ink drawing with watercolor wash, ',
    suffix: ', fine line work, sepia and ochre tones, historical illustration style, crosshatching details',
    isBuiltIn: true,
  },
  {
    id: 'game-art',
    label: 'Game Art',
    prefix: 'Digital game character art, ',
    suffix: ', clean lines, vibrant but aged colors, semi-realistic style, character sheet quality',
    isBuiltIn: true,
  },
  {
    id: 'napoleonic',
    label: 'Napoleonic Era',
    prefix: 'Historical illustration from the Napoleonic era, ',
    suffix: ', period-accurate French military uniforms 1796, Italian Campaign, detailed military uniform and equipment, natural lighting',
    isBuiltIn: true,
  },
  {
    id: 'engraving',
    label: 'Period Engraving',
    prefix: 'Detailed historical engraving, ',
    suffix: ', fine line engraving style, cross-hatching, copper plate print quality, 18th century illustration',
    isBuiltIn: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Advanced generation params                                         */
/* ------------------------------------------------------------------ */

export interface AdvancedParams {
  seed?: number;
  guidance?: number;
  num_inference_steps?: number;
  prompt_upsampling?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Prompt building                                                    */
/* ------------------------------------------------------------------ */

export function buildFullPrompt(
  userPrompt: string,
  preset: StylePreset,
  negativePrompt?: string,
): string {
  let result = userPrompt;
  if (preset.id !== 'none') {
    result = `${preset.prefix}${userPrompt}${preset.suffix}`;
  }
  if (negativePrompt?.trim()) {
    result += `. Avoid: ${negativePrompt.trim()}`;
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

export interface GenerationOutput {
  urls: string[];
  seed?: number;
}

export async function generateImage(
  apiKey: string,
  model: ReplicateModel,
  prompt: string,
  aspectRatio: string,
  advanced: AdvancedParams = {},
  onProgress?: (status: string) => void,
): Promise<GenerationOutput> {
  onProgress?.('starting');

  const input: Record<string, unknown> = {
    prompt,
    ...model.defaults,
  };

  if (model.supportsAspectRatio) input.aspect_ratio = aspectRatio;
  if (model.supportsSeed && advanced.seed != null) input.seed = advanced.seed;
  if (model.supportsGuidance && advanced.guidance != null) input.guidance = advanced.guidance;
  if (model.supportsSteps && advanced.num_inference_steps != null) input.num_inference_steps = advanced.num_inference_steps;
  if (model.supportsPromptUpsampling && advanced.prompt_upsampling != null) input.prompt_upsampling = advanced.prompt_upsampling;

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
    throw new Error(err.detail || err.title || `Replicate API error: ${res.status}`);
  }

  const data = await res.json();

  // If Prefer: wait returned the completed result
  if (data.status === 'succeeded' && data.output) {
    const urls = Array.isArray(data.output) ? data.output : [data.output];
    return { urls, seed: data.input?.seed as number | undefined };
  }

  // Otherwise poll
  onProgress?.('processing');
  const result = await pollPrediction(apiKey, data.id, onProgress);
  if (!result.output) throw new Error('No output from prediction');
  const urls = Array.isArray(result.output) ? result.output : [result.output];
  return { urls, seed: result.input?.seed as number | undefined };
}

interface PredictionResult {
  id: string;
  status: string;
  output?: string | string[];
  input?: Record<string, unknown>;
  error?: string;
}

async function pollPrediction(
  apiKey: string,
  predictionId: string,
  onProgress?: (status: string) => void,
): Promise<PredictionResult> {
  const maxAttempts = 120;
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

    onProgress?.(data.status === 'processing' ? 'Generating...' : data.status);
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Generation timed out after 2 minutes');
}

/**
 * Test that an API key is valid.
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
