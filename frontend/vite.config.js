import { defineConfig } from 'vite';
import { resolve } from 'path'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'frontend',
  build: {
    outDir: '../backend/public',
  },
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    },
  }
});
