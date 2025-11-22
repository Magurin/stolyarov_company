import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative base so built assets use relative paths. This is more
  // resilient for GitHub Pages (project pages or custom domains).
  base: './',
  build: { outDir: 'docs' },
  plugins: [react()],
})
