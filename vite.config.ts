import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createLabFilesystemPlugins } from './build/labFilesystemPlugins';

export default defineConfig({
  root: '.',
  appType: 'mpa',
  plugins: [react(), ...createLabFilesystemPlugins(resolve(__dirname, 'lab'))],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        main: resolve(__dirname, 'game/index.html'),
        lab: resolve(__dirname, 'lab/index.html'),
      },
    },
  },
  server: {
    port: 3000,
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
