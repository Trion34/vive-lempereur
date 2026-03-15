import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',
  plugins: [react()],
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
    },
  },
});
