import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    // Forward API calls to the NUSIS-I2 server so the browser stays same-origin (no CORS setup needed).
    proxy: { '/api': 'http://localhost:3000' },
  },
})
