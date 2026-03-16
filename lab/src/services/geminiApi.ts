/**
 * Google Gemini API client for NanoBanana image generation.
 * Calls go through the Vite dev proxy (/api/gemini → generativelanguage.googleapis.com).
 */

const API_BASE = '/api/gemini';
const REQUEST_TIMEOUT_MS = 120_000; // 2 minutes

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

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }>;
}

export interface ChatResponse {
  text: string;
  images: Array<{ blob: Blob; url: string; mimeType: string }>;
}

interface GeminiResponsePart {
  text?: string;
  inlineData?: {
    data?: string;
    mimeType?: string;
  };
  inline_data?: {
    data?: string;
    mime_type?: string;
  };
}

interface GeminiImagePayload {
  data: string;
  mimeType: string;
}

function getImagePayload(part: GeminiResponsePart): GeminiImagePayload | null {
  if (part.inlineData?.data) {
    return {
      data: part.inlineData.data,
      mimeType: part.inlineData.mimeType || 'image/png',
    };
  }

  if (part.inline_data?.data) {
    return {
      data: part.inline_data.data,
      mimeType: part.inline_data.mime_type || 'image/png',
    };
  }

  return null;
}

export async function blobToBase64(blob: Blob): Promise<string> {
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(
      `${API_BASE}/v1beta/models/${model.geminiModelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
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
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out — Gemini took too long to respond');
    }
    throw err;
  }
  clearTimeout(timeout);

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

  const responseParts: GeminiResponsePart[] = candidate.content?.parts || [];
  // Gemini returns camelCase (inlineData) not snake_case (inline_data)
  const imageParts = responseParts.filter(
    (part) => part.inlineData || part.inline_data,
  );

  if (imageParts.length === 0) {
    const firstTextPart = responseParts.find((part): part is GeminiResponsePart & { text: string } => typeof part.text === 'string');
    if (firstTextPart) {
      throw new Error(`Model returned text instead of image: "${firstTextPart.text.slice(0, 200)}"`);
    }
    console.error('[Asset Studio] Unexpected Gemini response:', JSON.stringify(data, null, 2).slice(0, 1000));
    throw new Error('No image in response — check browser console for details');
  }

  const urls: string[] = [];
  const blobs: Blob[] = [];

  for (const part of imageParts) {
    const imageData = getImagePayload(part);
    if (!imageData) continue;
    const binaryString = atob(imageData.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: imageData.mimeType });
    blobs.push(blob);
    urls.push(URL.createObjectURL(blob));
  }

  return { urls, blobs };
}

/* ------------------------------------------------------------------ */
/*  Shared response parsing                                            */
/* ------------------------------------------------------------------ */

function parseResponseParts(parts: GeminiResponsePart[]): { text: string; images: Array<{ blob: Blob; url: string; mimeType: string }> } {
  let text = '';
  const images: Array<{ blob: Blob; url: string; mimeType: string }> = [];

  for (const part of parts) {
    if (part.text) {
      text += (text ? '\n' : '') + part.text;
    }
    const imageData = getImagePayload(part);
    if (!imageData) continue;
    const binaryString = atob(imageData.data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: imageData.mimeType });
    images.push({ blob, url: URL.createObjectURL(blob), mimeType: imageData.mimeType });
  }
  return { text, images };
}

/* ------------------------------------------------------------------ */
/*  Multi-turn chat                                                    */
/* ------------------------------------------------------------------ */

/**
 * Send a multi-turn conversation to Gemini.
 * `action` controls responseModalities: 'chat' = TEXT only, 'generate' = TEXT + IMAGE.
 */
export async function chatWithGemini(
  apiKey: string,
  model: GeminiModel,
  contents: ChatMessage[],
  action: 'chat' | 'generate',
  aspectRatio: string,
  onProgress?: (status: string) => void,
): Promise<ChatResponse> {
  onProgress?.(action === 'generate' ? 'Generating image...' : 'Thinking...');

  const responseModalities = action === 'generate' ? ['TEXT', 'IMAGE'] : ['TEXT'];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(
      `${API_BASE}/v1beta/models/${model.geminiModelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents,
          generationConfig: {
            responseModalities,
            ...(action === 'generate' ? { imageConfig: { aspectRatio } } : {}),
          },
        }),
      },
    );
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out — Gemini took too long to respond');
    }
    throw err;
  }
  clearTimeout(timeout);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || err.error?.status || `Gemini API error: ${res.status}`);
  }

  onProgress?.('Processing response...');
  const data = await res.json();

  if (!data.candidates?.length) {
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Prompt blocked: ${data.promptFeedback.blockReason}`);
    }
    throw new Error('No response — try a different message');
  }

  const candidate = data.candidates[0];
  if (candidate.finishReason && candidate.finishReason !== 'STOP') {
    throw new Error(`Generation stopped: ${candidate.finishReason}`);
  }

  const responseParts = candidate.content?.parts || [];
  return parseResponseParts(responseParts);
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
