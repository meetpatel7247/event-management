import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Base path for root domain
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
