/**
 * IndexedDB storage for Asset Studio.
 * Stores generated images and character definitions locally.
 */

const DB_NAME = 'asset_studio';
const DB_VERSION = 1;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AssetRecord {
  id: string;
  prompt: string;
  fullPrompt: string;
  stylePresetId: string;
  modelId: string;
  aspectRatio: string;
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

/* ------------------------------------------------------------------ */
/*  Database connection                                                */
/* ------------------------------------------------------------------ */

let dbInstance: IDBDatabase | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('assets')) {
        const store = db.createObjectStore('assets', { keyPath: 'id' });
        store.createIndex('characterId', 'characterId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('favorite', 'favorite', { unique: false });
      }
      if (!db.objectStoreNames.contains('characters')) {
        db.createObjectStore('characters', { keyPath: 'id' });
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
/*  Image blob utilities                                               */
/* ------------------------------------------------------------------ */

/**
 * Fetch an image URL and return a Blob for local storage.
 * Tries direct fetch first, falls back to canvas extraction.
 */
export async function fetchImageAsBlob(url: string): Promise<Blob> {
  // Try direct fetch (works if CDN has CORS headers)
  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.blob();
    }
  } catch {
    // CORS blocked — fall through to canvas approach
  }

  // Fallback: load via <img> + canvas
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
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/png',
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for blob conversion'));
    img.src = url;
  });
}

/**
 * Create an object URL from a stored blob, or return the original URL.
 */
export function getDisplayUrl(asset: AssetRecord): string {
  if (asset.imageBlob) {
    return URL.createObjectURL(asset.imageBlob);
  }
  return asset.imageUrl;
}
