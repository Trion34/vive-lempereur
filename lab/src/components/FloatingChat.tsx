import { useEffect, useRef, useState, useCallback } from 'react';
import { useLabStore } from '../stores/labStore';
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
/*  FloatingChat — persistent drawer available across all Lab tools    */
/* ------------------------------------------------------------------ */

export function FloatingChat() {
  const chatOpen = useLabStore((s) => s.chatOpen);
  const toggleChat = useLabStore((s) => s.toggleChat);

  const {
    threads, activeThreadId, activeThread,
    sending, sendingStatus, sendError,
    loadThreads, createThread, switchThread, deleteThread,
    updateThreadSettings, sendMessage, saveImageToGallery,
  } = useThreadStore();

  const { geminiApiKey, modelId, stylePresetId, aspectRatio, negativePrompt, loadAssets } = useAssetStudioStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _customPresets = useAssetStudioStore(s => s.customPresets);
  const allPresets = useAssetStudioStore.getState().allPresets();
  const presetsRef = useRef(allPresets);
  presetsRef.current = allPresets;

  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [saveNotice, setSaveNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadsLoaded = useRef(false);

  // Load threads on first open
  useEffect(() => {
    if (chatOpen && !threadsLoaded.current) {
      threadsLoaded.current = true;
      loadThreads();
    }
  }, [chatOpen, loadThreads]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages.length, sending]);

  // Focus input when panel opens or thread changes
  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen, activeThreadId]);

  // Clear save notice after timeout
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
    const files = attachedFiles.length > 0 ? [...attachedFiles] : undefined;
    setInput('');
    setAttachedFiles([]);
    await sendMessage(text, action, geminiApiKey, presetsRef.current, files);
  }, [input, sending, sendMessage, geminiApiKey, attachedFiles]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend('generate');
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend('chat');
    }
  }, [handleSend]);

  const handleAttachFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 0) setAttachedFiles(prev => [...prev, ...imageFiles]);
  }, []);

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveToGallery = useCallback(async (messageId: string, imageIndex: number) => {
    setSavingImage(true);
    setSaveNotice(null);
    try {
      const result = await saveImageToGallery(messageId, imageIndex);
      if (!result) {
        setSaveNotice({ type: 'error', text: 'Failed to load the thread image.' });
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
        text: err instanceof Error ? err.message : 'Failed to save image',
      });
    } finally {
      setSavingImage(false);
    }
  }, [saveImageToGallery, activeThread, loadAssets]);

  const handleDeleteThread = useCallback(async () => {
    if (!activeThreadId) return;
    await deleteThread(activeThreadId);
    setConfirmDelete(false);
  }, [activeThreadId, deleteThread]);

  // Thread settings values
  const threadModelId = activeThread?.modelId || modelId;
  const threadStyleId = activeThread?.stylePresetId || stylePresetId;
  const threadAspect = activeThread?.aspectRatio || aspectRatio;

  return (
    <>
      {/* Toggle button */}
      <button
        className={`fc-toggle${chatOpen ? ' open' : ''}`}
        onClick={toggleChat}
        title="Chat (Ctrl+Shift+C)"
      >
        {chatOpen ? '\u2715' : '\uD83D\uDCAC'}
      </button>

      {/* Panel */}
      {chatOpen && (
        <div className="fc-panel">
          {/* Header */}
          <div className="fc-header">
            <select
              className="fc-thread-select"
              value={activeThreadId || ''}
              onChange={(e) => {
                if (e.target.value) switchThread(e.target.value);
              }}
            >
              <option value="" disabled>Select thread...</option>
              {threads.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.messageCount})</option>
              ))}
            </select>
            <button className="fc-header-btn" onClick={handleNewThread} title="New thread">+</button>
            <button
              className="fc-header-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Thread settings"
            >
              {showSettings ? '\u25B2' : '\u2699'}
            </button>
            {activeThread && !confirmDelete && (
              <button
                className="fc-header-btn"
                onClick={() => setConfirmDelete(true)}
                title="Delete thread"
              >
                {'\uD83D\uDDD1'}
              </button>
            )}
            {confirmDelete && (
              <span className="fc-delete-confirm">
                Delete?
                <button className="fc-delete-yes" onClick={handleDeleteThread}>Yes</button>
                <button onClick={() => setConfirmDelete(false)}>No</button>
              </span>
            )}
          </div>

          {/* Settings row */}
          {showSettings && activeThread && (
            <div className="fc-settings">
              <select
                value={threadModelId}
                onChange={(e) => updateThreadSettings({ modelId: e.target.value })}
              >
                {GEMINI_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
              <select
                value={threadStyleId}
                onChange={(e) => updateThreadSettings({ stylePresetId: e.target.value })}
              >
                {allPresets.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <select
                value={threadAspect}
                onChange={(e) => updateThreadSettings({ aspectRatio: e.target.value })}
              >
                {ASPECT_RATIOS.map(ar => (
                  <option key={ar.id} value={ar.id}>{ar.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Messages */}
          <div className="fc-messages">
            {!activeThread ? (
              <div className="fc-no-thread">
                <p>Start a thread to chat with the AI while working in any Lab tool.</p>
                <button className="fc-btn fc-btn-primary" onClick={handleNewThread} style={{ marginTop: '0.5rem' }}>
                  + New Thread
                </button>
              </div>
            ) : activeThread.messages.length === 0 ? (
              <div className="fc-empty">
                New thread. Describe what you're working on.<br />
                <strong>Enter</strong> to discuss, <strong>Ctrl+Enter</strong> to generate an image.
              </div>
            ) : (
              activeThread.messages.map(msg => (
                <FloatingMessageBubble
                  key={msg.id}
                  message={msg}
                  threadId={activeThread.id}
                  onSaveImage={handleSaveToGallery}
                  savingImage={savingImage}
                />
              ))
            )}
            {sending && (
              <div className="as-chat-bubble model">
                <div className="as-chat-bubble-role">Studio AI</div>
                <div className="as-chat-thinking">
                  <div className="as-spinner" style={{ width: 18, height: 18 }} />
                  <span>{sendingStatus}</span>
                </div>
              </div>
            )}
            {sendError && (
              <div className="as-error" style={{ margin: '0.4rem 0', fontSize: '0.8rem' }}>{sendError}</div>
            )}
            {saveNotice && (
              <div
                className={saveNotice.type === 'error' ? 'as-error' : 'si-copy-msg'}
                style={{ margin: '0.4rem 0', fontSize: '0.8rem' }}
              >
                {saveNotice.text}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          {activeThread && (
            <div
              className="fc-input-area"
              onDrop={(e) => { e.preventDefault(); handleAttachFiles(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
            >
              {attachedFiles.length > 0 && (
                <div className="fc-attachments">
                  {attachedFiles.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="fc-attachment-thumb">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                      <button
                        className="fc-attachment-remove"
                        onClick={() => handleRemoveAttachment(i)}
                      >
                        {'\u2715'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={inputRef}
                className="fc-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to explore..."
                rows={2}
                disabled={sending}
              />
              <div className="fc-input-actions">
                <span className="fc-shortcuts">
                  <button
                    className="fc-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach images"
                  >
                    {'\uD83D\uDCCE'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => { handleAttachFiles(e.target.files); e.target.value = ''; }}
                  />
                  Enter: Discuss &middot; Ctrl+Enter: Image
                </span>
                <div className="fc-buttons">
                  <button
                    className="fc-btn"
                    onClick={() => handleSend('chat')}
                    disabled={sending || !input.trim()}
                  >
                    Discuss
                  </button>
                  <button
                    className="fc-btn fc-btn-primary"
                    onClick={() => handleSend('generate')}
                    disabled={sending || !input.trim()}
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingMessageBubble — compact version of ChatTab's bubble       */
/* ------------------------------------------------------------------ */

function FloatingMessageBubble({
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
        {isUser ? 'You' : 'Studio AI'}
        {isUser && message.action && (
          <span className={`as-chat-action-badge ${message.action}`}>
            {message.action === 'generate' ? 'Image' : 'Discuss'}
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
                  Save
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
