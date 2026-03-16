import { useEffect, useRef, useState, useCallback } from 'react';
import { useThreadStore } from '../stores/threadStore';
import { useAssetStudioStore } from '../stores/assetStudioStore';
import { GEMINI_MODELS } from '../services/geminiApi';
import { ASPECT_RATIOS } from '../services/replicateApi';
import { threadImageUrl } from '../services/threadDb';
import {
  saveAsset,
  saveAssetToFilesystem,
  type AssetRecord,
} from '../services/assetDb';
import type { ThreadMessage } from '../types/threadTypes';

/* ------------------------------------------------------------------ */
/*  ChatTab — main export                                              */
/* ------------------------------------------------------------------ */

export function ChatTab() {
  const {
    threads, activeThreadId, activeThread,
    sending, sendingStatus, sendError,
    loadThreads, createThread, switchThread, renameThread, deleteThread,
    updateThreadSettings, sendMessage, saveImageToGallery,
  } = useThreadStore();

  const { geminiApiKey, modelId, stylePresetId, aspectRatio, negativePrompt, loadAssets } = useAssetStudioStore();
  const allPresets = useAssetStudioStore(s => s.allPresets());
  // Stable ref for presets so handleSend doesn't re-create on every render
  const presetsRef = useRef(allPresets);
  presetsRef.current = allPresets;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [saveNotice, setSaveNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load threads on mount
  useEffect(() => { loadThreads(); }, [loadThreads]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages.length, sending]);

  // Focus input when thread changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeThreadId]);

  useEffect(() => {
    if (!saveNotice) return undefined;
    const timeout = window.setTimeout(() => setSaveNotice(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [saveNotice]);

  const handleNewThread = useCallback(async () => {
    await createThread(modelId, stylePresetId, aspectRatio, negativePrompt);
  }, [createThread, modelId, stylePresetId, aspectRatio, negativePrompt]);

  const handleSend = useCallback(async (action: 'chat' | 'generate') => {
    if (!input.trim() || sending) return;
    const text = input;
    setInput('');
    await sendMessage(text, action, geminiApiKey, presetsRef.current);
  }, [input, sending, sendMessage, geminiApiKey]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSend('chat');
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend('generate');
    }
  }, [handleSend]);

  const handleStartRename = (id: string, name: string) => {
    setEditingName(id);
    setEditNameValue(name);
  };

  const handleFinishRename = async () => {
    if (editingName && editNameValue.trim()) {
      await renameThread(editingName, editNameValue.trim());
    }
    setEditingName(null);
  };

  const handleSaveToGallery = useCallback(async (messageId: string, imageIndex: number) => {
    setSavingImage(true);
    setSaveNotice(null);
    try {
      const result = await saveImageToGallery(messageId, imageIndex);
      if (!result) {
        setSaveNotice({ type: 'error', text: 'Failed to load the thread image for gallery save.' });
        return;
      }

      const blobUrl = URL.createObjectURL(result.blob);
      const asset: AssetRecord = {
        id: crypto.randomUUID(),
        prompt: result.prompt,
        fullPrompt: result.prompt,
        negativePrompt: '',
        stylePresetId: result.stylePresetId,
        modelId: result.modelId,
        aspectRatio: result.aspectRatio,
        seed: null,
        imageUrl: blobUrl,
        imageBlob: result.blob,
        tags: [],
        characterId: null,
        createdAt: Date.now(),
        favorite: false,
        notes: `From thread: ${activeThread?.name || 'Unknown'}`,
        trashedAt: null,
      };
      await saveAssetToFilesystem(asset);
      await saveAsset(asset);
      URL.revokeObjectURL(blobUrl);
      await loadAssets();
      setSaveNotice({ type: 'success', text: 'Saved to gallery.' });
    } catch (err) {
      setSaveNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save image to gallery',
      });
    } finally {
      setSavingImage(false);
    }
  }, [saveImageToGallery, activeThread, loadAssets]);

  // Thread sidebar settings
  const sidebarModelId = activeThread?.modelId || modelId;
  const sidebarStyleId = activeThread?.stylePresetId || stylePresetId;
  const sidebarAspect = activeThread?.aspectRatio || aspectRatio;

  return (
    <div className="as-chat-layout">
      {/* Sidebar toggle */}
      <button
        className="as-chat-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {sidebarOpen ? '\u25C0' : '\u25B6'}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="as-chat-sidebar">
          <button className="as-btn as-btn-primary as-chat-new-btn" onClick={handleNewThread}>
            + New Thread
          </button>

          <div className="as-chat-thread-list">
            {threads.map(t => (
              <div
                key={t.id}
                className={`as-chat-thread-item${t.id === activeThreadId ? ' active' : ''}`}
                onClick={() => switchThread(t.id)}
              >
                {editingName === t.id ? (
                  <input
                    className="as-input as-chat-rename-input"
                    value={editNameValue}
                    onChange={e => setEditNameValue(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={e => { if (e.key === 'Enter') handleFinishRename(); }}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span className="as-chat-thread-name">{t.name}</span>
                )}
                <span className="as-chat-thread-count">{t.messageCount} msgs</span>
                <div className="as-chat-thread-actions">
                  <button
                    className="as-btn-sm"
                    onClick={e => { e.stopPropagation(); handleStartRename(t.id, t.name); }}
                    title="Rename"
                  >
                    \u270E
                  </button>
                  {confirmDelete === t.id ? (
                    <>
                      <button
                        className="as-btn-sm as-btn-danger-sm"
                        onClick={e => { e.stopPropagation(); deleteThread(t.id); setConfirmDelete(null); }}
                      >
                        Yes
                      </button>
                      <button
                        className="as-btn-sm"
                        onClick={e => { e.stopPropagation(); setConfirmDelete(null); }}
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      className="as-btn-sm as-btn-danger-sm"
                      onClick={e => { e.stopPropagation(); setConfirmDelete(t.id); }}
                      title="Delete"
                    >
                      \u2715
                    </button>
                  )}
                </div>
              </div>
            ))}
            {threads.length === 0 && (
              <div className="as-chat-no-threads">No threads yet</div>
            )}
          </div>

          {/* Thread settings — editable when a thread is active */}
          <div className="as-chat-sidebar-settings">
            <label className="as-label-sm">Model</label>
            <select
              className="as-select"
              value={sidebarModelId}
              disabled={!activeThread}
              onChange={e => activeThread && updateThreadSettings({ modelId: e.target.value })}
            >
              {GEMINI_MODELS.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>

            <label className="as-label-sm">Style</label>
            <select
              className="as-select"
              value={sidebarStyleId}
              disabled={!activeThread}
              onChange={e => activeThread && updateThreadSettings({ stylePresetId: e.target.value })}
            >
              {allPresets.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            <label className="as-label-sm">Aspect</label>
            <select
              className="as-select"
              value={sidebarAspect}
              disabled={!activeThread}
              onChange={e => activeThread && updateThreadSettings({ aspectRatio: e.target.value })}
            >
              {ASPECT_RATIOS.map(ar => (
                <option key={ar.id} value={ar.id}>{ar.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="as-chat-main">
        {!activeThread ? (
          <div className="as-placeholder">
            <div className="as-placeholder-icon">\uD83D\uDCAC</div>
            <div className="as-placeholder-title">NanoBanana Chat</div>
            <p>Create a new thread to start a conversation. Discuss character designs, iterate on ideas, then generate when ready.</p>
            <button className="as-btn as-btn-primary" onClick={handleNewThread} style={{ marginTop: '1rem' }}>
              + New Thread
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="as-chat-messages">
              {activeThread.messages.length === 0 && (
                <div className="as-chat-empty">
                  Send a message to start the conversation. Use <strong>Chat</strong> for text-only discussion, or <strong>Generate</strong> when you want an image.
                </div>
              )}
              {activeThread.messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  threadId={activeThread.id}
                  onSaveImage={handleSaveToGallery}
                  savingImage={savingImage}
                />
              ))}
              {sending && (
                <div className="as-chat-bubble model">
                  <div className="as-chat-bubble-role">NanoBanana</div>
                  <div className="as-chat-thinking">
                    <div className="as-spinner" style={{ width: 20, height: 20 }} />
                    <span>{sendingStatus}</span>
                  </div>
                </div>
              )}
              {sendError && (
                <div className="as-error" style={{ margin: '0.5rem 0' }}>{sendError}</div>
              )}
              {saveNotice && (
                <div
                  className={saveNotice.type === 'error' ? 'as-error' : 'si-copy-msg'}
                  style={{ margin: '0.5rem 0' }}
                >
                  {saveNotice.text}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="as-chat-input-area">
              <textarea
                ref={inputRef}
                className="as-textarea as-chat-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={3}
                disabled={sending}
              />
              <div className="as-chat-input-actions">
                <span className="as-chat-shortcuts">Shift+Enter: Chat &middot; Ctrl+Enter: Generate</span>
                <div className="as-chat-buttons">
                  <button
                    className="as-btn as-chat-btn-chat"
                    onClick={() => handleSend('chat')}
                    disabled={sending || !input.trim()}
                  >
                    Chat
                  </button>
                  <button
                    className="as-btn as-btn-primary as-chat-btn-gen"
                    onClick={() => handleSend('generate')}
                    disabled={sending || !input.trim()}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MessageBubble                                                      */
/* ------------------------------------------------------------------ */

function MessageBubble({
  message,
  threadId,
  onSaveImage,
  savingImage,
}: {
  message: ThreadMessage;
  threadId: string;
  onSaveImage: (messageId: string, imageIndex: number) => void;
  savingImage: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`as-chat-bubble ${isUser ? 'user' : 'model'}`}>
      <div className="as-chat-bubble-role">
        {isUser ? 'You' : 'NanoBanana'}
        {isUser && message.action && (
          <span className={`as-chat-action-badge ${message.action}`}>
            {message.action === 'generate' ? 'Generate' : 'Chat'}
          </span>
        )}
      </div>
      <div className="as-chat-bubble-text">{message.text}</div>
      {message.images.length > 0 && (
        <div className="as-chat-images">
          {message.images.map((img, i) => (
            <div key={img.filename} className="as-chat-image-wrap">
              <img
                src={img.blobUrl || threadImageUrl(threadId, img.filename)}
                alt={`Generated ${i + 1}`}
                className="as-chat-image"
              />
              {!isUser && (
                <button
                  className="as-btn-sm as-chat-save-btn"
                  onClick={() => onSaveImage(message.id, i)}
                  disabled={savingImage}
                  title="Save to Gallery"
                >
                  Save to Gallery
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
