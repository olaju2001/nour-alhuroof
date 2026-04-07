import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'audio/**/*.mp3'],
      manifest: {
        name: 'نور الحروف - Nour Al-Huroof',
        short_name: 'نور الحروف',
        description: 'Lerne die arabischen Buchstaben – Learn Arabic Letters',
        theme_color: '#1A6B6B',
        background_color: '#FFF8E7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // Cache all audio and images for offline use
        globPatterns: ['**/*.{js,css,html,png,jpg,mp3,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache' }
          }
        ]
      }
    })
  ]
})
