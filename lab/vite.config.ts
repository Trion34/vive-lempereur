import fs from 'fs';
import path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function assetGalleryPlugin() {
  const galleryDir = path.resolve(__dirname, 'gallery/assets');

  return {
    name: 'asset-gallery',
    configureServer(server: import('vite').ViteDevServer) {
      // Ensure gallery directory exists
      fs.mkdirSync(galleryDir, { recursive: true });

      // GET /api/gallery — list all assets (returns array of metadata)
      server.middlewares.use('/api/gallery', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }
        // Skip sub-paths like /api/gallery/save, /api/gallery/delete, /api/gallery/image
        if (req.originalUrl && req.originalUrl !== '/api/gallery' && req.originalUrl !== '/api/gallery/') {
          next(); return;
        }

        try {
          const files = fs.readdirSync(galleryDir).filter(f => f.endsWith('.json'));
          const assets = files.map(f => {
            const raw = fs.readFileSync(path.join(galleryDir, f), 'utf-8');
            return JSON.parse(raw);
          });
          // Sort by createdAt descending
          assets.sort((a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(assets));
        } catch (err) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: String(err) }));
        }
      });

      // POST /api/gallery/save — save image + metadata
      // Expects JSON body with { metadata: {...}, imageBase64: string, mimeType: string }
      server.middlewares.use('/api/gallery/save', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        let body = '';
        req.on('data', (chunk: string) => { body += chunk; });
        req.on('end', () => {
          try {
            const { metadata, imageBase64, mimeType } = JSON.parse(body);
            const id = metadata.id;
            const ext = mimeType?.includes('jpeg') || mimeType?.includes('jpg') ? 'jpg' : 'png';

            // Save image file
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            fs.writeFileSync(path.join(galleryDir, `${id}.${ext}`), imageBuffer);

            // Save metadata (include the filename)
            metadata.imageFile = `${id}.${ext}`;
            fs.writeFileSync(
              path.join(galleryDir, `${id}.json`),
              JSON.stringify(metadata, null, 2),
            );

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, id }));
          } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      // DELETE /api/gallery/delete — delete asset by id
      // Expects JSON body with { id: string }
      server.middlewares.use('/api/gallery/delete', (req, res, next) => {
        if (req.method !== 'DELETE' && req.method !== 'POST') { next(); return; }

        let body = '';
        req.on('data', (chunk: string) => { body += chunk; });
        req.on('end', () => {
          try {
            const { id } = JSON.parse(body);
            // Remove image files (try both extensions)
            for (const ext of ['png', 'jpg']) {
              const imgPath = path.join(galleryDir, `${id}.${ext}`);
              if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            }
            // Remove metadata
            const jsonPath = path.join(galleryDir, `${id}.json`);
            if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });

      // Serve gallery images as static files
      server.middlewares.use('/api/gallery/image', (req, res, next) => {
        if (req.method !== 'GET') { next(); return; }
        const filename = req.url?.replace(/^\//, '') || '';
        const filePath = path.join(galleryDir, filename);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
          res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'max-age=3600' });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });
    },
  };
}

export default defineConfig({
  root: '.',
  plugins: [react(), assetGalleryPlugin()],
  publicDir: resolve(__dirname, '../public'),
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3002,
    open: false,
    proxy: {
      '/api/replicate': {
        target: 'https://api.replicate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/replicate/, ''),
      },
      '/api/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
      },
    },
  },
});
