import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Важно для Telegram Web App
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-avatar', '@radix-ui/react-progress']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    host: true, // Для разработки в Telegram
    port: 5173,
    cors: true
  },
  preview: {
    host: true,
    port: 4173,
    cors: true
  }
})