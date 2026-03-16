/**
 * Client-side functions wrapping the /api/threads filesystem endpoints.
 * No IndexedDB — threads are filesystem-only.
 */

import type { ConversationThread, ThreadSummary } from '../types/threadTypes';

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.error || fallback;
  } catch {
    return `${fallback} (${res.status})`;
  }
}

/** List all threads (metadata only). */
export async function listThreads(): Promise<ThreadSummary[]> {
  const res = await fetch('/api/threads');
  if (!res.ok) throw new Error(await parseError(res, 'Failed to list threads'));
  return res.json();
}

/** Load a full thread with messages. */
export async function loadThread(id: string): Promise<ConversationThread> {
  const res = await fetch(`/api/threads/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Thread not found — it may have been deleted');
    throw new Error(await parseError(res, 'Failed to load thread'));
  }
  return res.json();
}

/** Save or update a thread. */
export async function saveThread(thread: ConversationThread): Promise<void> {
  const res = await fetch('/api/threads/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(thread),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to save thread'));
}

/** Save an image to a thread's directory. Returns the filename. */
export async function saveThreadImage(
  threadId: string,
  filename: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const res = await fetch('/api/threads/save-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threadId, filename, imageBase64, mimeType }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to save thread image'));
  const data = await res.json();
  return data.filename;
}

/** Delete a thread and all its files. */
export async function deleteThread(id: string): Promise<void> {
  const res = await fetch('/api/threads/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to delete thread'));
}

/** Get the URL for a thread image. */
export function threadImageUrl(threadId: string, filename: string): string {
  return `/api/threads/image/${threadId}/${filename}`;
}
