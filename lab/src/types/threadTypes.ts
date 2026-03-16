/**
 * Data model for conversational threads in Asset Studio Chat.
 */

export interface ThreadImage {
  filename: string;            // e.g. "img-3-0.png"
  mimeType: string;
  blobUrl?: string;            // runtime only, not persisted
}

export interface ThreadMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  images: ThreadImage[];       // filenames referencing thread directory
  action?: 'chat' | 'generate'; // user messages only
  timestamp: number;
}

export interface ConversationThread {
  id: string;
  name: string;                // auto-generated from first message, editable
  modelId: string;
  stylePresetId: string;
  aspectRatio: string;
  negativePrompt: string;
  messages: ThreadMessage[];
  createdAt: number;
  updatedAt: number;
}

/** Thread metadata for listing (no full messages). */
export interface ThreadSummary {
  id: string;
  name: string;
  modelId: string;
  stylePresetId: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}
