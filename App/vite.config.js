import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/event-management/',
  plugins: [
    react(),
    {
      name: 'redirect-to-base',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          const [path, query] = url.split('?');
          const queryString = query ? `?${query}` : '';

          // 1. Redirect root '/' to '/event-management/' with query parameters preserved
          if (path === '/') {
            res.writeHead(302, { Location: `/event-management/${queryString}` });
            return res.end();
          }

          // 2. Redirect '/event-management' (missing trailing slash) to '/event-management/' with query parameters preserved
          if (path === '/event-management') {
            res.writeHead(302, { Location: `/event-management/${queryString}` });
            return res.end();
          }

          // 3. SPA redirects for root auth paths without base path
          if (path === '/login' || path === '/register') {
            res.writeHead(302, { Location: `/event-management${path}${queryString}` });
            return res.end();
          }

          next();
        });
      }
    }
  ],
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
