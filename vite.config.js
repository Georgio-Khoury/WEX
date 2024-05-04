import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'https://wex-frontend.onrender.com/',
  server: {
    proxy: {
      "/api": {
        target: "https://wex-1.onrender.com/",
        
        changeOrigin:true,
        secure: true,
          //  target: "http://localhost:3001",
          //  secure:false,
      },
    },
  },
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
