import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import { API } from '../shared/constants'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    // proxy: {
    //   '/api': {
    //     target: API.BASE_URL,
    //     changeOrigin: true,
    //     secure: false,
    //   }
    // }
  },
  build: {
    outDir: 'dist',
    // sourcemap: true
  },
})