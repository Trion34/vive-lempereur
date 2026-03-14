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
