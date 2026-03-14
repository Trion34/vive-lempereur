import { create } from 'zustand';
import {
  generateImage,
  buildFullPrompt,
  AVAILABLE_MODELS,
  BUILT_IN_PRESETS,
  type ReplicateModel,
  type StylePreset,
  type AdvancedParams,
} from '../services/replicateApi';
import {
  saveAsset,
  getAllAssets,
  deleteAsset as dbDeleteAsset,
  toggleFavorite as dbToggleFavorite,
  updateAssetTags as dbUpdateTags,
  updateAssetNotes as dbUpdateNotes,
  fetchImageAsBlob,
  downloadImage,
  getAllCharacters,
  saveCharacter,
  deleteCharacter as dbDeleteCharacter,
  getAllPresets,
  savePreset as dbSavePreset,
  deletePreset as dbDeletePreset,
  type AssetRecord,
  type CharacterRecord,
  type CustomPresetRecord,
} from '../services/assetDb';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AssetStudioTab = 'generate' | 'gallery' | 'characters' | 'settings';

export interface GenerationHistoryItem {
  id: string;
  urls: string[];
  prompt: string;
  fullPrompt: string;
  modelId: string;
  stylePresetId: string;
  aspectRatio: string;
  seed: number | null;
  timestamp: number;
  saved: boolean;
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

  // Generation — prompt & config
  prompt: string;
  setPrompt: (p: string) => void;
  negativePrompt: string;
  setNegativePrompt: (p: string) => void;
  stylePresetId: string;
  setStylePresetId: (id: string) => void;
  modelId: string;
  setModelId: (id: string) => void;
  aspectRatio: string;
  setAspectRatio: (ar: string) => void;
  activeCharacterId: string | null;
  setActiveCharacterId: (id: string | null) => void;

  // Generation — advanced params
  seed: string; // string for input binding; '' = random
  setSeed: (s: string) => void;
  guidance: number;
  setGuidance: (g: number) => void;
  inferenceSteps: number;
  setInferenceSteps: (n: number) => void;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;

  // Generation — state
  generating: boolean;
  generationStatus: string;
  generationError: string | null;
  currentResult: GenerationHistoryItem | null;
  generationHistory: GenerationHistoryItem[];
  generate: () => Promise<void>;
  selectHistoryItem: (id: string) => void;

  // Save
  saveCurrentImage: (index: number, tags: string[], characterId: string | null, notes: string) => Promise<void>;
  markHistoryItemSaved: (id: string) => void;

  // Load prompt from asset / character
  loadPromptFromAsset: (asset: AssetRecord) => void;
  generateFromCharacter: (charId: string) => void;

  // Download
  downloadCurrentImage: () => Promise<void>;
  downloadAsset: (asset: AssetRecord) => Promise<void>;

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

  // Gallery — comparison
  comparisonIds: string[];
  toggleComparison: (id: string) => void;
  clearComparison: () => void;

  // Characters
  characters: CharacterRecord[];
  loadCharacters: () => Promise<void>;
  addCharacter: (char: CharacterRecord) => Promise<void>;
  removeCharacter: (id: string) => Promise<void>;
  updateCharacter: (char: CharacterRecord) => Promise<void>;

  // Custom presets
  customPresets: CustomPresetRecord[];
  loadPresets: () => Promise<void>;
  addPreset: (preset: CustomPresetRecord) => Promise<void>;
  removePreset: (id: string) => Promise<void>;
  allPresets: () => StylePreset[];

  // Selected asset detail
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
}

/* ------------------------------------------------------------------ */
/*  localStorage keys                                                  */
/* ------------------------------------------------------------------ */

const LS_API_KEY = 'asset_studio_replicate_key';
const LS_DEFAULT_MODEL = 'asset_studio_default_model';
const MAX_HISTORY = 20;

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

  // Generation — prompt & config
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  negativePrompt: '',
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  stylePresetId: 'napoleonic',
  setStylePresetId: (stylePresetId) => set({ stylePresetId }),
  modelId: localStorage.getItem(LS_DEFAULT_MODEL) || 'flux-schnell',
  setModelId: (modelId) => set({ modelId }),
  aspectRatio: '1:1',
  setAspectRatio: (aspectRatio) => set({ aspectRatio }),
  activeCharacterId: null,
  setActiveCharacterId: (activeCharacterId) => set({ activeCharacterId }),

  // Generation — advanced
  seed: '',
  setSeed: (seed) => set({ seed }),
  guidance: 3.5,
  setGuidance: (guidance) => set({ guidance }),
  inferenceSteps: 28,
  setInferenceSteps: (inferenceSteps) => set({ inferenceSteps }),
  showAdvanced: false,
  setShowAdvanced: (showAdvanced) => set({ showAdvanced }),

  // Generation — state
  generating: false,
  generationStatus: '',
  generationError: null,
  currentResult: null,
  generationHistory: [],

  generate: async () => {
    const {
      apiKey, prompt, negativePrompt, stylePresetId, modelId, aspectRatio,
      seed, guidance, inferenceSteps,
    } = get();

    if (!apiKey) {
      set({ generationError: 'No API key set. Go to Settings tab.' });
      return;
    }
    if (!prompt.trim()) {
      set({ generationError: 'Enter a prompt first.' });
      return;
    }

    const model = AVAILABLE_MODELS.find((m) => m.id === modelId)!;
    const allPresets = get().allPresets();
    const preset = allPresets.find((p) => p.id === stylePresetId) || allPresets[0];
    const fullPrompt = buildFullPrompt(prompt.trim(), preset, negativePrompt);

    const advanced: AdvancedParams = {};
    if (seed.trim()) advanced.seed = parseInt(seed, 10);
    if (model.supportsGuidance) advanced.guidance = guidance;
    if (model.supportsSteps) advanced.num_inference_steps = inferenceSteps;

    set({
      generating: true,
      generationStatus: 'Starting...',
      generationError: null,
      currentResult: null,
    });

    try {
      const output = await generateImage(
        apiKey, model, fullPrompt, aspectRatio, advanced,
        (status) => set({ generationStatus: status === 'processing' ? 'Generating...' : status }),
      );

      const historyItem: GenerationHistoryItem = {
        id: crypto.randomUUID(),
        urls: output.urls,
        prompt: prompt.trim(),
        fullPrompt,
        modelId,
        stylePresetId,
        aspectRatio,
        seed: output.seed ?? null,
        timestamp: Date.now(),
        saved: false,
      };

      const history = [historyItem, ...get().generationHistory].slice(0, MAX_HISTORY);

      set({
        generating: false,
        generationStatus: 'Done!',
        currentResult: historyItem,
        generationHistory: history,
      });
    } catch (err) {
      set({
        generating: false,
        generationStatus: '',
        generationError: err instanceof Error ? err.message : 'Generation failed',
      });
    }
  },

  selectHistoryItem: (id) => {
    const item = get().generationHistory.find((h) => h.id === id);
    if (item) set({ currentResult: item });
  },

  // Save
  saveCurrentImage: async (index, tags, characterId, notes) => {
    const { currentResult, activeCharacterId } = get();
    if (!currentResult) return;

    const url = currentResult.urls[index];
    let imageBlob: Blob | null = null;
    try {
      imageBlob = await fetchImageAsBlob(url);
    } catch { /* URL-only fallback */ }

    const asset: AssetRecord = {
      id: crypto.randomUUID(),
      prompt: currentResult.prompt,
      fullPrompt: currentResult.fullPrompt,
      negativePrompt: '',
      stylePresetId: currentResult.stylePresetId,
      modelId: currentResult.modelId,
      aspectRatio: currentResult.aspectRatio,
      seed: currentResult.seed,
      imageUrl: url,
      imageBlob,
      tags,
      characterId: characterId || activeCharacterId,
      createdAt: Date.now(),
      favorite: false,
      notes,
    };

    await saveAsset(asset);
    get().markHistoryItemSaved(currentResult.id);
    await get().loadAssets();
  },

  markHistoryItemSaved: (id) => {
    set({
      generationHistory: get().generationHistory.map((h) =>
        h.id === id ? { ...h, saved: true } : h,
      ),
    });
  },

  // Load prompt from asset / character
  loadPromptFromAsset: (asset) => {
    set({
      tab: 'generate',
      prompt: asset.prompt,
      stylePresetId: asset.stylePresetId,
      modelId: asset.modelId,
      aspectRatio: asset.aspectRatio,
      seed: asset.seed != null ? String(asset.seed) : '',
      activeCharacterId: asset.characterId,
    });
  },

  generateFromCharacter: (charId) => {
    const char = get().characters.find((c) => c.id === charId);
    if (!char) return;
    set({
      tab: 'generate',
      prompt: char.promptTemplate || char.description,
      activeCharacterId: charId,
    });
  },

  // Download
  downloadCurrentImage: async () => {
    const { currentResult } = get();
    if (!currentResult?.urls[0]) return;
    const name = `asset-${currentResult.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    await downloadImage(currentResult.urls[0], name);
  },

  downloadAsset: async (asset) => {
    const source = asset.imageBlob || asset.imageUrl;
    const name = `asset-${asset.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    await downloadImage(source, name);
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
    const { selectedAssetId, comparisonIds } = get();
    if (selectedAssetId === id) set({ selectedAssetId: null });
    set({ comparisonIds: comparisonIds.filter((cid) => cid !== id) });
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

  // Comparison
  comparisonIds: [],
  toggleComparison: (id) => {
    const { comparisonIds } = get();
    if (comparisonIds.includes(id)) {
      set({ comparisonIds: comparisonIds.filter((cid) => cid !== id) });
    } else {
      set({ comparisonIds: [...comparisonIds, id] });
    }
  },
  clearComparison: () => set({ comparisonIds: [] }),

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

  // Custom presets
  customPresets: [],
  loadPresets: async () => {
    const customPresets = await getAllPresets();
    set({ customPresets });
  },

  addPreset: async (preset) => {
    await dbSavePreset(preset);
    await get().loadPresets();
  },

  removePreset: async (id) => {
    await dbDeletePreset(id);
    // Reset selection if deleted preset was active
    if (get().stylePresetId === id) set({ stylePresetId: 'none' });
    await get().loadPresets();
  },

  allPresets: () => {
    const custom: StylePreset[] = get().customPresets.map((p) => ({
      id: p.id,
      label: p.label,
      prefix: p.prefix,
      suffix: p.suffix,
      isBuiltIn: false,
    }));
    return [...BUILT_IN_PRESETS, ...custom];
  },

  // Selected
  selectedAssetId: null,
  setSelectedAssetId: (selectedAssetId) => set({ selectedAssetId }),
}));
