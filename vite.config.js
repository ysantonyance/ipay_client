import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss()
  ],
  server: {
    proxy: {
      // Forward /api/* to the ASP.NET backend (launchSettings "https" profile).
      // Going through the proxy avoids CORS and the HTTPS-redirect problem in dev.
      // secure: false accepts the self-signed dev certificate.
      '/api': {
        target: 'https://localhost:7137',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
