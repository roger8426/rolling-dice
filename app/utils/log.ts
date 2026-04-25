export interface NamespacedLogger {
  log(...args: unknown[]): void
  info(...args: unknown[]): void
  warn(...args: unknown[]): void
  error(...args: unknown[]): void
  debug(...args: unknown[]): void
}

export function createLogger(namespace: string = '[App]'): NamespacedLogger {
  return {
    log(...args: unknown[]) {
      if (!import.meta.dev) return
      console.log(`${namespace}[LOG]`, ...args)
    },
    info(...args: unknown[]) {
      if (!import.meta.dev) return
      console.info(`${namespace}[INFO]`, ...args)
    },
    warn(...args: unknown[]) {
      if (!import.meta.dev) return
      console.warn(`${namespace}[WARN]`, ...args)
    },
    error(...args: unknown[]) {
      console.error(`${namespace}[ERROR]`, ...args)
    },
    debug(...args: unknown[]) {
      if (!import.meta.dev) return
      console.debug(`${namespace}[DEBUG]`, ...args)
    },
  }
}
