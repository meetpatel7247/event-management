import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VERCEL === '1' ? '/' : '/event-management/', // Dynamic base path for Vercel and GitHub Pages
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
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
