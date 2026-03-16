import { create } from 'zustand';
import type { ConversationThread, ThreadMessage, ThreadSummary } from '../types/threadTypes';
import * as threadDb from '../services/threadDb';
import {
  chatWithGemini,
  blobToBase64,
  GEMINI_MODELS,
  type ChatMessage,
  type GeminiModel,
} from '../services/geminiApi';
import { BUILT_IN_PRESETS, type StylePreset } from '../services/replicateApi';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SLIDING_WINDOW = 20;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ThreadStoreState {
  // Thread list
  threads: ThreadSummary[];
  activeThreadId: string | null;
  activeThread: ConversationThread | null;

  // Chat state
  sending: boolean;
  sendingStatus: string;
  sendError: string | null;

  // Actions
  loadThreads: () => Promise<void>;
  createThread: (modelId: string, stylePresetId: string, aspectRatio: string, negativePrompt: string) => Promise<string>;
  switchThread: (id: string) => Promise<void>;
  renameThread: (id: string, name: string) => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  updateThreadSettings: (settings: { modelId?: string; stylePresetId?: string; aspectRatio?: string }) => Promise<void>;
  sendMessage: (
    text: string,
    action: 'chat' | 'generate',
    geminiApiKey: string,
    allPresets: StylePreset[],
  ) => Promise<void>;
  saveImageToGallery: (messageId: string, imageIndex: number) => Promise<{
    blob: Blob; prompt: string; modelId: string; stylePresetId: string; aspectRatio: string;
  } | null>;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function findGeminiModel(id: string): GeminiModel | undefined {
  return GEMINI_MODELS.find(m => m.id === id);
}

function autoName(text: string): string {
  const cleaned = text.replace(/\n/g, ' ').trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.slice(0, 37) + '...';
}

function mergeAdjacentMessages(messages: ThreadMessage[]): ThreadMessage[] {
  const merged: ThreadMessage[] = [];

  for (const msg of messages) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === msg.role) {
      prev.text = prev.text ? `${prev.text}\n\n${msg.text}` : msg.text;
      prev.images = [...prev.images, ...msg.images];
      prev.timestamp = msg.timestamp;
      if (msg.action) prev.action = msg.action;
      continue;
    }

    merged.push({
      ...msg,
      images: [...msg.images],
    });
  }

  return merged;
}

/** Build Gemini contents array from thread messages, applying sliding window. */
function buildContents(
  messages: ThreadMessage[],
  stylePrefix: string,
): ChatMessage[] {
  if (messages.length === 0) return [];

  const normalized = mergeAdjacentMessages(messages);

  // Sliding window: preserve the first turn, then include as much recent context
  // as possible without breaking user/model alternation.
  let windowMessages: ThreadMessage[];
  if (normalized.length > SLIDING_WINDOW) {
    const preserved = normalized.slice(0, Math.min(2, normalized.length));
    const suffixBudget = SLIDING_WINDOW - preserved.length;
    let suffixStart = Math.max(preserved.length, normalized.length - suffixBudget);
    const lastPreservedRole = preserved[preserved.length - 1]?.role;

    while (suffixStart < normalized.length && normalized[suffixStart].role === lastPreservedRole) {
      suffixStart += 1;
    }

    windowMessages = [...preserved, ...normalized.slice(suffixStart)];
  } else {
    windowMessages = normalized;
  }

  // Inject style prefix into the first user message in the window
  let stylePrefixInjected = false;
  const contents: ChatMessage[] = [];

  for (const msg of windowMessages) {
    const parts: ChatMessage['parts'] = [];

    if (!stylePrefixInjected && msg.role === 'user' && stylePrefix) {
      parts.push({ text: stylePrefix + msg.text });
      stylePrefixInjected = true;
    } else {
      parts.push({ text: msg.text });
    }

    contents.push({ role: msg.role, parts });
  }
  return contents;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useThreadStore = create<ThreadStoreState>((set, get) => ({
  threads: [],
  activeThreadId: null,
  activeThread: null,
  sending: false,
  sendingStatus: '',
  sendError: null,

  loadThreads: async () => {
    const threads = await threadDb.listThreads();
    set({ threads });
  },

  createThread: async (modelId, stylePresetId, aspectRatio, negativePrompt) => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const thread: ConversationThread = {
      id,
      name: 'New Thread',
      modelId,
      stylePresetId,
      aspectRatio,
      negativePrompt,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    await threadDb.saveThread(thread);
    await get().loadThreads();
    set({ activeThreadId: id, activeThread: thread });
    return id;
  },

  switchThread: async (id) => {
    if (id === get().activeThreadId) return;
    const thread = await threadDb.loadThread(id);
    set({ activeThreadId: id, activeThread: thread, sendError: null });
  },

  renameThread: async (id, name) => {
    const { activeThread } = get();
    if (!activeThread || activeThread.id !== id) return;
    const updated = { ...activeThread, name, updatedAt: Date.now() };
    await threadDb.saveThread(updated);
    set({ activeThread: updated });
    await get().loadThreads();
  },

  deleteThread: async (id) => {
    await threadDb.deleteThread(id);
    const { activeThreadId } = get();
    if (activeThreadId === id) {
      set({ activeThreadId: null, activeThread: null });
    }
    await get().loadThreads();
  },

  updateThreadSettings: async (settings) => {
    const { activeThread } = get();
    if (!activeThread) return;
    const updated = { ...activeThread, ...settings, updatedAt: Date.now() };
    // Strip blobUrls before saving
    const toSave = {
      ...updated,
      messages: updated.messages.map(m => ({
        ...m,
        images: m.images.map(img => ({ filename: img.filename, mimeType: img.mimeType })),
      })),
    };
    await threadDb.saveThread(toSave);
    set({ activeThread: updated });
    await get().loadThreads();
  },

  sendMessage: async (text, action, geminiApiKey, allPresets) => {
    const { activeThread } = get();
    if (!activeThread) return;
    if (!text.trim()) return;
    if (!geminiApiKey) {
      set({ sendError: 'No Gemini API key set. Go to Settings tab.' });
      return;
    }

    const model = findGeminiModel(activeThread.modelId);
    if (!model) {
      set({ sendError: `Model ${activeThread.modelId} not found` });
      return;
    }

    // Create user message
    const userMsg: ThreadMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: text.trim(),
      images: [],
      action,
      timestamp: Date.now(),
    };

    // Add to thread immediately (optimistic)
    const messagesWithUser = [...activeThread.messages, userMsg];
    const threadWithUser = { ...activeThread, messages: messagesWithUser, updatedAt: Date.now() };
    set({ activeThread: threadWithUser, sending: true, sendingStatus: 'Sending...', sendError: null });

    try {
      // Build style prefix for first message
      const preset = allPresets.find(p => p.id === activeThread.stylePresetId) || BUILT_IN_PRESETS[0];
      const stylePrefix = preset.id !== 'none'
        ? `[Style context — apply to all images in this conversation: ${preset.prefix.trim()}. ${preset.suffix.trim()}]\n\n`
        : '';

      const contents = buildContents(messagesWithUser, stylePrefix);

      const response = await chatWithGemini(
        geminiApiKey,
        model,
        contents,
        action,
        activeThread.aspectRatio,
        (status) => set({ sendingStatus: status }),
      );

      // Build model message
      const modelMsgId = crypto.randomUUID();
      const modelMsg: ThreadMessage = {
        id: modelMsgId,
        role: 'model',
        text: response.text,
        images: [],
        timestamp: Date.now(),
      };

      // Save images to filesystem (use msg ID for stable filenames)
      for (let i = 0; i < response.images.length; i++) {
        const img = response.images[i];
        const ext = img.mimeType.includes('jpeg') || img.mimeType.includes('jpg') ? 'jpg' : 'png';
        const filename = `${modelMsgId.slice(0, 8)}-${i}.${ext}`;
        const base64 = await blobToBase64(img.blob);
        await threadDb.saveThreadImage(activeThread.id, filename, base64, img.mimeType);
        modelMsg.images.push({ filename, mimeType: img.mimeType, blobUrl: img.url });
      }

      // Auto-name thread from first user message
      let threadName = threadWithUser.name;
      if (threadWithUser.messages.length === 1 && threadName === 'New Thread') {
        threadName = autoName(text);
      }

      const finalThread: ConversationThread = {
        ...threadWithUser,
        name: threadName,
        messages: [...messagesWithUser, modelMsg],
        updatedAt: Date.now(),
      };

      // Save thread JSON (without blobUrls)
      const threadToSave = {
        ...finalThread,
        messages: finalThread.messages.map(m => ({
          ...m,
          images: m.images.map(img => ({ filename: img.filename, mimeType: img.mimeType })),
        })),
      };
      await threadDb.saveThread(threadToSave);

      set({ activeThread: finalThread, sending: false, sendingStatus: '' });
      await get().loadThreads();
    } catch (err) {
      // Keep user message in thread but show error
      set({
        sending: false,
        sendingStatus: '',
        sendError: err instanceof Error ? err.message : 'Failed to send message',
      });
      // Save thread with user message (so it persists)
      const threadToSave = {
        ...threadWithUser,
        messages: threadWithUser.messages.map(m => ({
          ...m,
          images: m.images.map(img => ({ filename: img.filename, mimeType: img.mimeType })),
        })),
      };
      try {
        await threadDb.saveThread(threadToSave);
      } catch (saveErr) {
        console.error('[ThreadStore] Failed to persist thread after send error', saveErr);
      } finally {
        try {
          await get().loadThreads();
        } catch (loadErr) {
          console.error('[ThreadStore] Failed to refresh threads after send error', loadErr);
        }
      }
    }
  },

  saveImageToGallery: async (messageId, imageIndex) => {
    const { activeThread } = get();
    if (!activeThread) return null;
    const msg = activeThread.messages.find(m => m.id === messageId);
    if (!msg || !msg.images[imageIndex]) return null;

    const img = msg.images[imageIndex];
    // Fetch the image from the filesystem
    const url = threadDb.threadImageUrl(activeThread.id, img.filename);
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();

    // Find the user prompt that triggered this image
    const msgIdx = activeThread.messages.indexOf(msg);
    let prompt = '';
    for (let i = msgIdx - 1; i >= 0; i--) {
      if (activeThread.messages[i].role === 'user') {
        prompt = activeThread.messages[i].text;
        break;
      }
    }

    return {
      blob,
      prompt,
      modelId: activeThread.modelId,
      stylePresetId: activeThread.stylePresetId,
      aspectRatio: activeThread.aspectRatio,
    };
  },
}));
