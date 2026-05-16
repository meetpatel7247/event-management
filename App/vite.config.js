import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Use root base path for GitHub User Pages
  plugins: [react()],
  resolve: {
    alias: {
      'use-sync-external-store/with-selector': 'use-sync-external-store/shim/with-selector.js'
    }
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
