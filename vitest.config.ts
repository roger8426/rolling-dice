import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['app/tests/**/*.spec.ts'],
    exclude: ['packages/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{ts,vue}'],
      exclude: ['app/tests/**', 'app/**/*.d.ts', 'app/types/**', 'app/assets/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@ui': fileURLToPath(new URL('./packages/ui', import.meta.url)),
    },
  },
})
