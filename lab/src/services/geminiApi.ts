/**
 * Google Gemini API client for NanoBanana image generation.
 * Calls go through the Vite dev proxy (/api/gemini → generativelanguage.googleapis.com).
 */

const API_BASE = '/api/gemini';

/* ------------------------------------------------------------------ */
/*  Model definitions                                                  */
/* ------------------------------------------------------------------ */

export interface GeminiModel {
  id: string;
  label: string;
  geminiModelId: string;
  backend: 'gemini';
  supportsAspectRatio: boolean;
  supportsSeed: false;
  supportsGuidance: false;
  supportsSteps: false;
  supportsPromptUpsampling: false;
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: 'gemini-nano-banana-pro',
    label: 'NanoBanana Pro (Gemini Direct)',
    geminiModelId: 'gemini-3-pro-image-preview',
    backend: 'gemini',
    supportsAspectRatio: true,
    supportsSeed: false,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: false,
  },
  {
    id: 'gemini-nano-banana-2',
    label: 'NanoBanana 2 (Gemini Direct)',
    geminiModelId: 'gemini-3.1-flash-image-preview',
    backend: 'gemini',
    supportsAspectRatio: true,
    supportsSeed: false,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: false,
  },
  {
    id: 'gemini-nano-banana',
    label: 'NanoBanana (Gemini Direct)',
    geminiModelId: 'gemini-2.5-flash-image',
    backend: 'gemini',
    supportsAspectRatio: true,
    supportsSeed: false,
    supportsGuidance: false,
    supportsSteps: false,
    supportsPromptUpsampling: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Generation                                                         */
/* ------------------------------------------------------------------ */

export interface GeminiGenerationOutput {
  urls: string[];       // blob URLs from base64 data
  blobs: Blob[];        // raw blobs for saving
}

export async function generateImageGemini(
  apiKey: string,
  model: GeminiModel,
  prompt: string,
  aspectRatio: string,
  onProgress?: (status: string) => void,
): Promise<GeminiGenerationOutput> {
  onProgress?.('Sending to Gemini...');

  const res = await fetch(
    `${API_BASE}/v1beta/models/${model.geminiModelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio,
          },
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err.error?.message || err.error?.status || `Gemini API error: ${res.status}`;
    throw new Error(message);
  }

  onProgress?.('Processing response...');

  const data = await res.json();

  if (!data.candidates || data.candidates.length === 0) {
    // Check for prompt feedback (safety blocks)
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
    }
    throw new Error('No image generated — try a different prompt');
  }

  const candidate = data.candidates[0];
  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`Generation stopped: ${candidate.finishReason}`);
  }

  const parts = candidate.content?.parts || [];
  const imageParts = parts.filter(
    (p: { inline_data?: { mime_type: string; data: string } }) => p.inline_data,
  );

  if (imageParts.length === 0) {
    // Might have returned text instead of image
    const textParts = parts.filter((p: { text?: string }) => p.text);
    if (textParts.length > 0) {
      throw new Error(`Model returned text instead of image: "${textParts[0].text.slice(0, 100)}..."`);
    }
    throw new Error('No image in response — try a different prompt');
  }

  const urls: string[] = [];
  const blobs: Blob[] = [];

  for (const part of imageParts) {
    const { mime_type, data: base64Data } = part.inline_data;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime_type });
    blobs.push(blob);
    urls.push(URL.createObjectURL(blob));
  }

  return { urls, blobs };
}

/**
 * Test that a Gemini API key is valid.
 */
export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE}/v1beta/models?key=${apiKey}`,
    );
    return res.ok;
  } catch {
    return false;
  }
}
