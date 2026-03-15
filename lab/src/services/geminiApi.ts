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

async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function generateImageGemini(
  apiKey: string,
  model: GeminiModel,
  prompt: string,
  aspectRatio: string,
  referenceImages?: Blob[],
  onProgress?: (status: string) => void,
): Promise<GeminiGenerationOutput> {
  onProgress?.('Sending to Gemini...');

  const requestParts: Array<{text: string} | {inline_data: {mime_type: string; data: string}}> = [];

  // Add reference images first
  if (referenceImages && referenceImages.length > 0) {
    for (const blob of referenceImages) {
      const base64 = await blobToBase64(blob);
      requestParts.push({ inline_data: { mime_type: blob.type || 'image/png', data: base64 } });
    }
  }

  // Add text prompt last
  requestParts.push({ text: prompt });

  const res = await fetch(
    `${API_BASE}/v1beta/models/${model.geminiModelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: requestParts,
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseParts: any[] = candidate.content?.parts || [];
  // Gemini returns camelCase (inlineData) not snake_case (inline_data)
  const imageParts = responseParts.filter(
    (p: any) => p.inlineData || p.inline_data,
  );

  if (imageParts.length === 0) {
    const textParts = responseParts.filter((p: { text?: string }) => p.text);
    if (textParts.length > 0) {
      throw new Error(`Model returned text instead of image: "${textParts[0].text.slice(0, 200)}"`);
    }
    console.error('[Asset Studio] Unexpected Gemini response:', JSON.stringify(data, null, 2).slice(0, 1000));
    throw new Error('No image in response — check browser console for details');
  }

  const urls: string[] = [];
  const blobs: Blob[] = [];

  for (const part of imageParts) {
    // Handle both camelCase (inlineData/mimeType) and snake_case (inline_data/mime_type)
    const imageData = part.inlineData || part.inline_data;
    const mimeType = imageData.mimeType || imageData.mime_type || 'image/png';
    const base64Data = imageData.data;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
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
