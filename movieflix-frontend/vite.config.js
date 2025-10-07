import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Ensure _redirects file is copied to build output
    rollupOptions: {
      output: {
        // This ensures static files in public/ are copied
      }
    }
  }
})

