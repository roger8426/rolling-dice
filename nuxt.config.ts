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
  },

  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  alias: {
    '@ui': fileURLToPath(new URL('./packages/ui', import.meta.url)),
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
