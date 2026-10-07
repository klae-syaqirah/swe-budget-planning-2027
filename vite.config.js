import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' makes the build work on any GitHub Pages path (user/repo)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
