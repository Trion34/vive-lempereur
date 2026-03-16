/**
 * IndexedDB storage for Asset Studio.
 * Stores generated images, character definitions, and custom style presets.
 */

const DB_NAME = 'asset_studio';
const DB_VERSION = 2;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AssetRecord {
  id: string;
  prompt: string;
  fullPrompt: string;
  negativePrompt: string;
  stylePresetId: string;
  modelId: string;
  aspectRatio: string;
  seed: number | null;
  imageUrl: string;
  imageBlob: Blob | null;
  tags: string[];
  characterId: string | null;
  createdAt: number;
  favorite: boolean;
  notes: string;
  trashedAt: number | null;
}

export interface CharacterRecord {
  id: string;
  name: string;
  description: string;
  styleNotes: string;
  promptTemplate: string;
  referenceAssetIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CustomPresetRecord {
  id: string;
  label: string;
  prefix: string;
  suffix: string;
  createdAt: number;
}

/* ------------------------------------------------------------------ */
/*  Database connection                                                */
/* ------------------------------------------------------------------ */

let dbInstance: IDBDatabase | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = req.result;
      const oldVersion = event.oldVersion;

      if (oldVersion < 1) {
        const assetStore = db.createObjectStore('assets', { keyPath: 'id' });
        assetStore.createIndex('characterId', 'characterId', { unique: false });
        assetStore.createIndex('createdAt', 'createdAt', { unique: false });
        assetStore.createIndex('favorite', 'favorite', { unique: false });
        db.createObjectStore('characters', { keyPath: 'id' });
      }

      if (oldVersion < 2) {
        db.createObjectStore('presets', { keyPath: 'id' });
      }
    };

    req.onsuccess = () => {
      dbInstance = req.result;
      resolve(dbInstance);
    };

    req.onerror = () => reject(req.error);
  });
}

/* ------------------------------------------------------------------ */
/*  Generic helpers                                                    */
/* ------------------------------------------------------------------ */

function txPromise<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const req = fn(store);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

function getAllFromStore<T>(storeName: string): Promise<T[]> {
  return txPromise(storeName, 'readonly', (s) => s.getAll());
}

/* ------------------------------------------------------------------ */
/*  Asset CRUD                                                         */
/* ------------------------------------------------------------------ */

export async function saveAsset(asset: AssetRecord): Promise<void> {
  await txPromise('assets', 'readwrite', (s) => s.put(asset));
}

export async function getAsset(id: string): Promise<AssetRecord | undefined> {
  return txPromise('assets', 'readonly', (s) => s.get(id));
}

export async function getAllAssets(): Promise<AssetRecord[]> {
  const assets = await getAllFromStore<AssetRecord>('assets');
  return assets.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteAsset(id: string): Promise<void> {
  await txPromise('assets', 'readwrite', (s) => s.delete(id));
}

export async function toggleFavorite(id: string): Promise<void> {
  const asset = await getAsset(id);
  if (asset) {
    asset.favorite = !asset.favorite;
    await saveAsset(asset);
  }
}

export async function updateAssetTags(id: string, tags: string[]): Promise<void> {
  const asset = await getAsset(id);
  if (asset) {
    asset.tags = tags;
    await saveAsset(asset);
  }
}

export async function updateAssetNotes(id: string, notes: string): Promise<void> {
  const asset = await getAsset(id);
  if (asset) {
    asset.notes = notes;
    await saveAsset(asset);
  }
}

export async function trashAsset(id: string): Promise<void> {
  const asset = await getAsset(id);
  if (asset) {
    asset.trashedAt = Date.now();
    await saveAsset(asset);
  }
}

export async function restoreAsset(id: string): Promise<void> {
  const asset = await getAsset(id);
  if (asset) {
    asset.trashedAt = null;
    await saveAsset(asset);
  }
}

export function createAssetFromUpload(blob: Blob, filename: string): AssetRecord {
  return {
    id: crypto.randomUUID(),
    prompt: '',
    fullPrompt: '',
    negativePrompt: '',
    stylePresetId: '',
    modelId: 'upload',
    aspectRatio: '',
    seed: null,
    imageUrl: '',
    imageBlob: blob,
    tags: ['uploaded'],
    characterId: null,
    createdAt: Date.now(),
    favorite: false,
    notes: `Uploaded: ${filename}`,
    trashedAt: null,
  };
}

/* ------------------------------------------------------------------ */
/*  Character CRUD                                                     */
/* ------------------------------------------------------------------ */

export async function saveCharacter(char: CharacterRecord): Promise<void> {
  await txPromise('characters', 'readwrite', (s) => s.put(char));
}

export async function getCharacter(id: string): Promise<CharacterRecord | undefined> {
  return txPromise('characters', 'readonly', (s) => s.get(id));
}

export async function getAllCharacters(): Promise<CharacterRecord[]> {
  const chars = await getAllFromStore<CharacterRecord>('characters');
  return chars.sort((a, b) => a.name.localeCompare(b.name));
}

export async function deleteCharacter(id: string): Promise<void> {
  await txPromise('characters', 'readwrite', (s) => s.delete(id));
}

/* ------------------------------------------------------------------ */
/*  Custom preset CRUD                                                 */
/* ------------------------------------------------------------------ */

export async function savePreset(preset: CustomPresetRecord): Promise<void> {
  await txPromise('presets', 'readwrite', (s) => s.put(preset));
}

export async function getAllPresets(): Promise<CustomPresetRecord[]> {
  const presets = await getAllFromStore<CustomPresetRecord>('presets');
  return presets.sort((a, b) => a.label.localeCompare(b.label));
}

export async function deletePreset(id: string): Promise<void> {
  await txPromise('presets', 'readwrite', (s) => s.delete(id));
}

/* ------------------------------------------------------------------ */
/*  Image blob utilities                                               */
/* ------------------------------------------------------------------ */

export async function fetchImageAsBlob(url: string): Promise<Blob> {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.blob();
  } catch {
    // CORS blocked — fall through to canvas
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
        'image/png',
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export function getDisplayUrl(asset: AssetRecord): string {
  if (asset.imageBlob) return URL.createObjectURL(asset.imageBlob);
  return asset.imageUrl;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.error === 'string' ? body.error : `${fallback} (${res.status})`;
  } catch {
    return `${fallback} (${res.status})`;
  }
}

/**
 * Trigger a file download for an image.
 */
export async function downloadImage(
  urlOrBlob: string | Blob,
  filename: string,
): Promise<void> {
  let blob: Blob;
  if (typeof urlOrBlob === 'string') {
    blob = await fetchImageAsBlob(urlOrBlob);
  } else {
    blob = urlOrBlob;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ------------------------------------------------------------------ */
/*  Filesystem gallery API                                             */
/* ------------------------------------------------------------------ */

export async function saveAssetToFilesystem(asset: AssetRecord): Promise<void> {
  let imageBase64 = '';
  let mimeType = 'image/png';

  if (asset.imageBlob) {
    const buffer = await asset.imageBlob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    imageBase64 = btoa(binary);
    mimeType = asset.imageBlob.type || 'image/png';
  }

  // Build metadata (everything except the blob).
  // If imageUrl is a gallery URL, extract the imageFile name to preserve it.
  const galleryPrefix = '/api/gallery/image/';
  const imageFile = asset.imageUrl.startsWith(galleryPrefix)
    ? asset.imageUrl.slice(galleryPrefix.length)
    : undefined;

  const metadata: Record<string, unknown> = {
    id: asset.id,
    prompt: asset.prompt,
    fullPrompt: asset.fullPrompt,
    negativePrompt: asset.negativePrompt,
    stylePresetId: asset.stylePresetId,
    modelId: asset.modelId,
    aspectRatio: asset.aspectRatio,
    seed: asset.seed,
    imageUrl: asset.imageUrl,
    tags: asset.tags,
    characterId: asset.characterId,
    createdAt: asset.createdAt,
    favorite: asset.favorite,
    notes: asset.notes,
    trashedAt: asset.trashedAt,
    ...(imageFile ? { imageFile } : {}),
  };

  const res = await fetch('/api/gallery/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metadata, imageBase64, mimeType }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to save asset to filesystem'));
}

export async function loadAssetsFromFilesystem(): Promise<AssetRecord[]> {
  const res = await fetch('/api/gallery');
  if (!res.ok) throw new Error(await parseError(res, 'Failed to load gallery assets'));
  const items: Array<Record<string, unknown>> = await res.json();

  // Convert filesystem records to AssetRecords.
  // Don't fetch blobs eagerly — use the served URL for display,
  // only fetch blobs on-demand (save, download, etc.)
  const assets: AssetRecord[] = items.map(item => {
    const imageFile = item.imageFile as string;
    return {
      id: item.id as string,
      prompt: (item.prompt as string) || '',
      fullPrompt: (item.fullPrompt as string) || '',
      negativePrompt: (item.negativePrompt as string) || '',
      stylePresetId: (item.stylePresetId as string) || '',
      modelId: (item.modelId as string) || '',
      aspectRatio: (item.aspectRatio as string) || '1:1',
      seed: item.seed != null ? (item.seed as number) : null,
      imageUrl: imageFile ? `/api/gallery/image/${imageFile}` : (item.imageUrl as string) || '',
      imageBlob: null, // loaded on-demand, not eagerly
      tags: (item.tags as string[]) || [],
      characterId: (item.characterId as string) || null,
      createdAt: (item.createdAt as number) || 0,
      favorite: (item.favorite as boolean) || false,
      notes: (item.notes as string) || '',
      trashedAt: item.trashedAt != null ? (item.trashedAt as number) : null,
    };
  });

  return assets.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteAssetFromFilesystem(id: string): Promise<void> {
  const res = await fetch('/api/gallery/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(await parseError(res, 'Failed to delete asset from filesystem'));
}

export async function trashAssetOnFilesystem(id: string): Promise<void> {
  const assets = await loadAssetsFromFilesystem();
  const asset = assets.find(a => a.id === id);
  if (asset) {
    asset.trashedAt = Date.now();
    await saveAssetToFilesystem(asset);
  }
}

export async function restoreAssetOnFilesystem(id: string): Promise<void> {
  const assets = await loadAssetsFromFilesystem();
  const asset = assets.find(a => a.id === id);
  if (asset) {
    asset.trashedAt = null;
    await saveAssetToFilesystem(asset);
  }
}
