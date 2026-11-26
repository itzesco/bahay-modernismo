import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' lets the built site work from any folder or sub-path
// (Vercel, Netlify, GitHub Pages, or a plain static server).
export default defineConfig({
  plugins: [react()],
  base: './',
})
