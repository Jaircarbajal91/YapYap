import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// define config to proxy requests to backend
const proxy = {
  '/': {
    target: 'http://localhost:8000/',
    changeOrigin: true,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy } // define proxy in server config
})
