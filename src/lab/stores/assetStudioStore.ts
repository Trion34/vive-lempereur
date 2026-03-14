import { create } from 'zustand';
import {
  generateImage,
  buildFullPrompt,
  AVAILABLE_MODELS,
  STYLE_PRESETS,
  type ReplicateModel,
  type StylePreset,
} from '../services/replicateApi';
import {
  saveAsset,
  getAllAssets,
  deleteAsset as dbDeleteAsset,
  toggleFavorite as dbToggleFavorite,
  updateAssetTags as dbUpdateTags,
  updateAssetNotes as dbUpdateNotes,
  fetchImageAsBlob,
  getAllCharacters,
  saveCharacter,
  deleteCharacter as dbDeleteCharacter,
  type AssetRecord,
  type CharacterRecord,
} from '../services/assetDb';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AssetStudioTab = 'generate' | 'gallery' | 'characters' | 'settings';

interface GenerationResult {
  urls: string[];
  prompt: string;
  fullPrompt: string;
  modelId: string;
  stylePresetId: string;
  aspectRatio: string;
}

interface AssetStudioState {
  // Navigation
  tab: AssetStudioTab;
  setTab: (tab: AssetStudioTab) => void;

  // Settings
  apiKey: string;
  setApiKey: (key: string) => void;
  defaultModelId: string;
  setDefaultModelId: (id: string) => void;

  // Generation
  prompt: string;
  setPrompt: (p: string) => void;
  stylePresetId: string;
  setStylePresetId: (id: string) => void;
  modelId: string;
  setModelId: (id: string) => void;
  aspectRatio: string;
  setAspectRatio: (ar: string) => void;
  generating: boolean;
  generationStatus: string;
  generationError: string | null;
  currentResult: GenerationResult | null;
  generate: () => Promise<void>;

  // Save
  saveCurrentImage: (index: number, tags: string[], characterId: string | null, notes: string) => Promise<void>;

  // Gallery
  assets: AssetRecord[];
  galleryFilter: 'all' | 'favorites';
  galleryTagFilter: string;
  galleryCharacterFilter: string | null;
  setGalleryFilter: (f: 'all' | 'favorites') => void;
  setGalleryTagFilter: (tag: string) => void;
  setGalleryCharacterFilter: (id: string | null) => void;
  loadAssets: () => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateTags: (id: string, tags: string[]) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;

  // Characters
  characters: CharacterRecord[];
  loadCharacters: () => Promise<void>;
  addCharacter: (char: CharacterRecord) => Promise<void>;
  removeCharacter: (id: string) => Promise<void>;
  updateCharacter: (char: CharacterRecord) => Promise<void>;

  // Selected asset detail
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
}

/* ------------------------------------------------------------------ */
/*  localStorage keys                                                  */
/* ------------------------------------------------------------------ */

const LS_API_KEY = 'asset_studio_replicate_key';
const LS_DEFAULT_MODEL = 'asset_studio_default_model';

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useAssetStudioStore = create<AssetStudioState>((set, get) => ({
  // Navigation
  tab: 'generate',
  setTab: (tab) => set({ tab }),

  // Settings
  apiKey: localStorage.getItem(LS_API_KEY) || '',
  setApiKey: (key) => {
    localStorage.setItem(LS_API_KEY, key);
    set({ apiKey: key });
  },
  defaultModelId: localStorage.getItem(LS_DEFAULT_MODEL) || 'flux-schnell',
  setDefaultModelId: (id) => {
    localStorage.setItem(LS_DEFAULT_MODEL, id);
    set({ defaultModelId: id, modelId: id });
  },

  // Generation
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  stylePresetId: 'napoleonic',
  setStylePresetId: (stylePresetId) => set({ stylePresetId }),
  modelId: localStorage.getItem(LS_DEFAULT_MODEL) || 'flux-schnell',
  setModelId: (modelId) => set({ modelId }),
  aspectRatio: '1:1',
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  generating: false,
  generationStatus: '',
  generationError: null,
  currentResult: null,

  generate: async () => {
    const { apiKey, prompt, stylePresetId, modelId, aspectRatio } = get();
    if (!apiKey) {
      set({ generationError: 'No API key set. Go to Settings tab.' });
      return;
    }
    if (!prompt.trim()) {
      set({ generationError: 'Enter a prompt first.' });
      return;
    }

    const model = AVAILABLE_MODELS.find((m) => m.id === modelId) as ReplicateModel;
    const preset = STYLE_PRESETS.find((p) => p.id === stylePresetId) as StylePreset;
    const fullPrompt = buildFullPrompt(prompt.trim(), preset);

    set({
      generating: true,
      generationStatus: 'Starting...',
      generationError: null,
      currentResult: null,
    });

    try {
      const urls = await generateImage(
        apiKey,
        model,
        fullPrompt,
        aspectRatio,
        (status) => set({ generationStatus: status === 'processing' ? 'Generating...' : status }),
      );

      set({
        generating: false,
        generationStatus: 'Done!',
        currentResult: {
          urls,
          prompt: prompt.trim(),
          fullPrompt,
          modelId,
          stylePresetId,
          aspectRatio,
        },
      });
    } catch (err) {
      set({
        generating: false,
        generationStatus: '',
        generationError: err instanceof Error ? err.message : 'Generation failed',
      });
    }
  },

  // Save
  saveCurrentImage: async (index, tags, characterId, notes) => {
    const { currentResult } = get();
    if (!currentResult) return;

    const url = currentResult.urls[index];
    let imageBlob: Blob | null = null;
    try {
      imageBlob = await fetchImageAsBlob(url);
    } catch {
      // Store URL only if blob fetch fails
    }

    const asset: AssetRecord = {
      id: crypto.randomUUID(),
      prompt: currentResult.prompt,
      fullPrompt: currentResult.fullPrompt,
      stylePresetId: currentResult.stylePresetId,
      modelId: currentResult.modelId,
      aspectRatio: currentResult.aspectRatio,
      imageUrl: url,
      imageBlob,
      tags,
      characterId,
      createdAt: Date.now(),
      favorite: false,
      notes,
    };

    await saveAsset(asset);
    await get().loadAssets();
  },

  // Gallery
  assets: [],
  galleryFilter: 'all',
  galleryTagFilter: '',
  galleryCharacterFilter: null,
  setGalleryFilter: (galleryFilter) => set({ galleryFilter }),
  setGalleryTagFilter: (galleryTagFilter) => set({ galleryTagFilter }),
  setGalleryCharacterFilter: (galleryCharacterFilter) => set({ galleryCharacterFilter }),

  loadAssets: async () => {
    const assets = await getAllAssets();
    set({ assets });
  },

  deleteAsset: async (id) => {
    await dbDeleteAsset(id);
    const { selectedAssetId } = get();
    if (selectedAssetId === id) set({ selectedAssetId: null });
    await get().loadAssets();
  },

  toggleFavorite: async (id) => {
    await dbToggleFavorite(id);
    await get().loadAssets();
  },

  updateTags: async (id, tags) => {
    await dbUpdateTags(id, tags);
    await get().loadAssets();
  },

  updateNotes: async (id, notes) => {
    await dbUpdateNotes(id, notes);
    await get().loadAssets();
  },

  // Characters
  characters: [],
  loadCharacters: async () => {
    const characters = await getAllCharacters();
    set({ characters });
  },

  addCharacter: async (char) => {
    await saveCharacter(char);
    await get().loadCharacters();
  },

  removeCharacter: async (id) => {
    await dbDeleteCharacter(id);
    await get().loadCharacters();
  },

  updateCharacter: async (char) => {
    await saveCharacter(char);
    await get().loadCharacters();
  },

  // Selected
  selectedAssetId: null,
  setSelectedAssetId: (selectedAssetId) => set({ selectedAssetId }),
}));
