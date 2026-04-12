import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ['pinia'],
        },
      },
    },
    server: {
      deps: {
        inline: ['pinia'],
      },
    },
    setupFiles: ['./app/tests/setup.ts'],
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
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@ui': fileURLToPath(new URL('./packages/ui', import.meta.url)),
      '@vue/devtools-api': fileURLToPath(
        new URL('./app/tests/__mocks__/@vue/devtools-api.ts', import.meta.url),
      ),
    },
  },
})
