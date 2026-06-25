// ============================================
// Portfolio OS 2026 — Vite Configuration
// (Modified to trigger Vite restart and Tailwind JIT generation)
// ============================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,

    // Proxy API requests to the backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      clientPort: 5173,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion'],
          state: ['zustand'],
          monaco: ['@monaco-editor/react']
        }
      }
    }
  }
});
