import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/stolyarov_company/',
  plugins: [react()], 
})