import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin, ViteDevServer } from 'vite';

const SAFE_ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
const SAFE_FILENAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function isSafeId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_ID_RE.test(value);
}

function isSafeFilename(value: unknown): value is string {
  return typeof value === 'string'
    && SAFE_FILENAME_RE.test(value)
    && value !== '.'
    && value !== '..';
}

function resolveWithinDir(rootDir: string, ...segments: string[]): string | null {
  const target = path.resolve(rootDir, ...segments);
  const relative = path.relative(rootDir, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return target;
}

function withJsonBody(
  req: IncomingMessage,
  res: ServerResponse,
  handler: (body: unknown) => void,
): void {
  let body = '';
  req.on('data', (chunk: Buffer | string) => {
    body += typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
  });
  req.on('end', () => {
    try {
      handler(JSON.parse(body));
    } catch (err) {
      if (err instanceof SyntaxError) {
        sendJson(res, 400, { error: 'Invalid JSON body' });
        return;
      }
      sendJson(res, 500, { error: String(err) });
    }
  });
}

function assetGalleryPlugin(galleryDir: string): Plugin {
  return {
    name: 'asset-gallery',
    configureServer(server: ViteDevServer) {
      fs.mkdirSync(galleryDir, { recursive: true });

      server.middlewares.use('/api/gallery', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }
        if (req.originalUrl && req.originalUrl !== '/api/gallery' && req.originalUrl !== '/api/gallery/') {
          next(); return;
        }

        try {
          const files = fs.readdirSync(galleryDir).filter((file) => file.endsWith('.json'));
          const assets = files.map((file) => {
            const raw = fs.readFileSync(path.join(galleryDir, file), 'utf-8');
            return JSON.parse(raw);
          });
          assets.sort((a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt);
          sendJson(res, 200, assets);
        } catch (err) {
          sendJson(res, 500, { error: String(err) });
        }
      });

      server.middlewares.use('/api/gallery/save', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        withJsonBody(req, res, (body) => {
          const { metadata, imageBase64, mimeType } = body as {
            metadata?: Record<string, unknown>;
            imageBase64?: string;
            mimeType?: string;
          };

          if (!metadata || typeof metadata !== 'object') {
            sendJson(res, 400, { error: 'Missing metadata' });
            return;
          }

          const id = isSafeId(metadata.id) ? metadata.id : null;
          if (!id) {
            sendJson(res, 400, { error: 'Invalid asset id' });
            return;
          }

          const ext = mimeType?.includes('jpeg') || mimeType?.includes('jpg') ? 'jpg' : 'png';
          const imagePath = resolveWithinDir(galleryDir, `${id}.${ext}`);
          const jsonPath = resolveWithinDir(galleryDir, `${id}.json`);
          if (!imagePath || !jsonPath) {
            sendJson(res, 400, { error: 'Invalid asset path' });
            return;
          }

          if (imageBase64) {
            fs.writeFileSync(imagePath, Buffer.from(imageBase64, 'base64'));
          }

          if ('imageFile' in metadata && metadata.imageFile != null && !isSafeFilename(metadata.imageFile)) {
            sendJson(res, 400, { error: 'Invalid image filename' });
            return;
          }

          if (!metadata.imageFile) {
            metadata.imageFile = `${id}.${ext}`;
          }

          fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));
          sendJson(res, 200, { ok: true, id });
        });
      });

      server.middlewares.use('/api/gallery/delete', (req, res, next) => {
        if (req.method !== 'DELETE' && req.method !== 'POST') { next(); return; }

        withJsonBody(req, res, (body) => {
          const rawId = (body as { id?: unknown })?.id;
          const id = isSafeId(rawId) ? rawId : null;
          if (!id) {
            sendJson(res, 400, { error: 'Invalid asset id' });
            return;
          }

          for (const ext of ['png', 'jpg']) {
            const imagePath = resolveWithinDir(galleryDir, `${id}.${ext}`);
            if (imagePath && fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }

          const jsonPath = resolveWithinDir(galleryDir, `${id}.json`);
          if (jsonPath && fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
          }

          sendJson(res, 200, { ok: true });
        });
      });

      server.middlewares.use('/api/gallery/image', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }

        const filename = req.url?.replace(/^\//, '') || '';
        if (!isSafeFilename(filename)) {
          sendJson(res, 400, { error: 'Invalid filename' });
          return;
        }

        const filePath = resolveWithinDir(galleryDir, filename);
        if (!filePath || !fs.existsSync(filePath)) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
        res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'max-age=3600' });
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

function readThreadSummaries(threadsDir: string): Array<{
  id: string;
  name: string;
  modelId: string;
  stylePresetId: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}> {
  const dirs = fs.readdirSync(threadsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const summaries = [];

  for (const dir of dirs) {
    const jsonPath = path.join(threadsDir, dir.name, 'thread.json');
    if (!fs.existsSync(jsonPath)) continue;

    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    summaries.push({
      id: raw.id,
      name: raw.name,
      modelId: raw.modelId,
      stylePresetId: raw.stylePresetId,
      messageCount: raw.messages?.length || 0,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  summaries.sort((a, b) => b.updatedAt - a.updatedAt);
  return summaries;
}

function threadPlugin(threadsDir: string): Plugin {
  return {
    name: 'thread-filesystem',
    configureServer(server: ViteDevServer) {
      fs.mkdirSync(threadsDir, { recursive: true });

      server.middlewares.use('/api/threads', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }

        const url = req.originalUrl || req.url || '';
        if (url !== '/api/threads' && url !== '/api/threads/') { next(); return; }

        try {
          sendJson(res, 200, readThreadSummaries(threadsDir));
        } catch (err) {
          sendJson(res, 500, { error: String(err) });
        }
      });

      server.middlewares.use('/api/threads/', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }

        const url = req.url || '';
        const match = url.match(/^\/([a-zA-Z0-9._-]+)\/?$/);
        if (!match) { next(); return; }

        const id = match[1];
        if (!isSafeId(id)) {
          sendJson(res, 400, { error: 'Invalid thread id' });
          return;
        }

        const jsonPath = resolveWithinDir(threadsDir, id, 'thread.json');
        if (!jsonPath || !fs.existsSync(jsonPath)) {
          sendJson(res, 404, { error: 'Thread not found' });
          return;
        }

        try {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(fs.readFileSync(jsonPath, 'utf-8'));
        } catch (err) {
          sendJson(res, 500, { error: String(err) });
        }
      });

      server.middlewares.use('/api/threads/save', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        withJsonBody(req, res, (body) => {
          const thread = body as Record<string, unknown> | null;
          if (!thread || typeof thread !== 'object' || !isSafeId(thread.id)) {
            sendJson(res, 400, { error: 'Invalid thread id' });
            return;
          }

          const dir = resolveWithinDir(threadsDir, thread.id);
          if (!dir) {
            sendJson(res, 400, { error: 'Invalid thread path' });
            return;
          }

          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'thread.json'), JSON.stringify(thread, null, 2));
          sendJson(res, 200, { ok: true });
        });
      });

      server.middlewares.use('/api/threads/save-image', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        withJsonBody(req, res, (body) => {
          const parsed = body as {
            threadId?: unknown;
            filename?: unknown;
            imageBase64?: unknown;
            mimeType?: string;
          };

          if (!isSafeId(parsed.threadId)) {
            sendJson(res, 400, { error: 'Invalid thread id' });
            return;
          }

          if (parsed.filename != null && !isSafeFilename(parsed.filename)) {
            sendJson(res, 400, { error: 'Invalid filename' });
            return;
          }

          if (typeof parsed.imageBase64 !== 'string' || parsed.imageBase64.length === 0) {
            sendJson(res, 400, { error: 'Missing image data' });
            return;
          }

          const dir = resolveWithinDir(threadsDir, parsed.threadId);
          if (!dir) {
            sendJson(res, 400, { error: 'Invalid thread path' });
            return;
          }

          fs.mkdirSync(dir, { recursive: true });
          const ext = parsed.mimeType?.includes('jpeg') || parsed.mimeType?.includes('jpg') ? 'jpg' : 'png';
          const finalName = parsed.filename || `img-${Date.now()}.${ext}`;
          const imagePath = resolveWithinDir(dir, finalName);
          if (!imagePath) {
            sendJson(res, 400, { error: 'Invalid image path' });
            return;
          }

          fs.writeFileSync(imagePath, Buffer.from(parsed.imageBase64, 'base64'));
          sendJson(res, 200, { ok: true, filename: finalName });
        });
      });

      server.middlewares.use('/api/threads/delete', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        withJsonBody(req, res, (body) => {
          const rawId = (body as { id?: unknown })?.id;
          const id = isSafeId(rawId) ? rawId : null;
          if (!id) {
            sendJson(res, 400, { error: 'Invalid thread id' });
            return;
          }

          const dir = resolveWithinDir(threadsDir, id);
          if (!dir) {
            sendJson(res, 400, { error: 'Invalid thread path' });
            return;
          }

          if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
          }

          sendJson(res, 200, { ok: true });
        });
      });

      server.middlewares.use('/api/threads/image', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }

        const url = req.url || '';
        const match = url.match(/^\/([a-zA-Z0-9._-]+)\/(.+)$/);
        if (!match) { next(); return; }

        const [, threadId, filename] = match;
        if (!isSafeId(threadId)) {
          sendJson(res, 400, { error: 'Invalid thread id' });
          return;
        }
        if (!isSafeFilename(filename)) {
          sendJson(res, 400, { error: 'Invalid filename' });
          return;
        }

        const filePath = resolveWithinDir(threadsDir, threadId, filename);
        if (!filePath || !fs.existsSync(filePath)) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
        res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'max-age=3600' });
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

export function createLabFilesystemPlugins(rootDir: string): Plugin[] {
  return [
    assetGalleryPlugin(path.resolve(rootDir, 'gallery/assets')),
    threadPlugin(path.resolve(rootDir, 'gallery/threads')),
  ];
}
