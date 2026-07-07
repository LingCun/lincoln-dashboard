import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Electron 은 file:// 로 dist/index.html 을 로드하므로 상대 경로가 필요하다.
  base: './',
  plugins: [react()],
})
