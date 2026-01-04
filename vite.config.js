import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Compression Gzip pour des fichiers plus légers
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Compression Brotli (encore plus efficace)
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  // IMPORTANT: Remplace 'abdjad' par le nom de ton repo GitHub
  base: '/abdjad/',
  build: {
    // Optimisations de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Code splitting pour un chargement plus rapide
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Taille des chunks
    chunkSizeWarningLimit: 500,
    // Assets inlining pour réduire les requêtes HTTP
    assetsInlineLimit: 4096,
  },
  // Optimisation du dev server
  server: {
    open: true,
  },
})
