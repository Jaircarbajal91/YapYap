import { defineConfig } from 'vite';
import { resolve } from 'path'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  mode: 'jit',
  build: {
    outDir: './build',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    },
  },
  // define: {
  //   'process.env': {}
  // }
});
