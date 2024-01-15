import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../BACKEND/public',
  }
})
