import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : (process.env.NODE_ENV === 'production' ? './' : '/'), // '/' for Vercel, './' for Electron build, '/' for dev server
  build: {
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    hmr: false, // Disable HMR for tunnel compatibility
    strictPort: false,
  },
})

