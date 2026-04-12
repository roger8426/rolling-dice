// Stub out @vue/devtools-api in test environment.
// Pinia imports this at module level; the real implementation transitively
// imports @vue/devtools-kit which accesses localStorage during module
// initialization — before jsdom's URL is configured — causing a SecurityError.
export const setupDevtoolsPlugin = () => {}
