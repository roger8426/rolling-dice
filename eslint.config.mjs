// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default withNuxt(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },
  {
    name: 'app/ignores',
    ignores: ['.nuxt/**', '.output/**', 'packages/**'],
  },
).append(...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'), skipFormatting)
