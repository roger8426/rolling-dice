import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SPA mode — no server required; migrate to SSR/hybrid when backend is ready
  ssr: false,

  // GitHub Pages base URL (set via NUXT_APP_BASE_URL env var in CI)
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: `${process.env.NUXT_APP_BASE_URL ?? '/'}dice-20.png`,
        },
      ],
      title: 'Rolling Dice',
      titleTemplate: '%s | Rolling Dice',
    },
  },

  imports: {
    dirs: ['helpers', 'composables/domain', 'composables/ui'],
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/fonts'],

  fonts: {
    families: [
      { name: 'Inter', weights: [400, 500, 600, 700] },
      { name: 'Noto Sans TC', weights: [400, 500, 700] },
      { name: 'Cinzel', weights: [400, 700] },
    ],
  },

  css: ['~/assets/css/main.css'],

  alias: {
    '@ui': fileURLToPath(new URL('./packages/ui/dist/index.d.ts', import.meta.url)),
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Override the Nuxt directory alias with a specific file entry so Vite's
        '@ui': fileURLToPath(new URL('./packages/ui/dist/index.js', import.meta.url)),
      },
    },
  },
})
