import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Publicado como project page em https://<usuario>.github.io/app-colmeia/ —
// o workflow de deploy (.github/workflows/deploy-pages.yml) passa GITHUB_PAGES=true;
// localmente e no build do Base44 continua servindo a partir da raiz.
const base = process.env.GITHUB_PAGES === 'true' ? '/app-colmeia/' : '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      includeAssets: ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Colmeia — Ecossistema de Comunidades',
        short_name: 'Colmeia',
        description: 'Pequenas missões. Grandes conexões.',
        lang: 'pt-BR',
        start_url: base,
        scope: base,
        display: 'standalone',
        theme_color: '#e76b37',
        background_color: '#fff9a6',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // Never cache API calls to the Base44 backend — login, entities, etc. must stay live.
        navigateFallbackDenylist: [/^\/api\//],
        // Sem isso, um Service Worker antigo só é substituído quando todas as abas
        // fecham — o site parece "não atualizar" mesmo após um deploy correto.
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ]
});
