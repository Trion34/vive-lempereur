import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',
  plugins: [react()],
  publicDir: resolve(__dirname, '../public'),
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3003,
    open: false,
  },
});
