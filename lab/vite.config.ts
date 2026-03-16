import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createLabFilesystemPlugins } from '../build/labFilesystemPlugins';

export default defineConfig({
  root: '.',
  plugins: [react(), ...createLabFilesystemPlugins(__dirname)],
  publicDir: resolve(__dirname, '../public'),
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react-vendor';
          if (id.includes('/zustand/')) return 'state-vendor';
          return 'vendor';
        },
      },
    },
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
