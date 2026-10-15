import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const page = (file) => fileURLToPath(new URL(file, import.meta.url))

// base './' makes the build work on any GitHub Pages path (user/repo)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Two pages: the full website and the slide presentation
      input: { main: page('./index.html'), slides: page('./slides.html') },
    },
  },
})
