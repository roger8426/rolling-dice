export interface INamespacedLogger {
  log(...args: unknown[]): void
  info(...args: unknown[]): void
  warn(...args: unknown[]): void
  error(...args: unknown[]): void
  debug(...args: unknown[]): void
}

let debugEnabled = true

export function setDebugEnabled(enabled: boolean): void {
  debugEnabled = enabled
}

export function createLogger(namespace: string = '[App]'): INamespacedLogger {
  return {
    log(...args: unknown[]) {
      if (!import.meta.env.DEV) return
      console.log(`${namespace}[LOG]`, ...args)
    },
    info(...args: unknown[]) {
      if (!import.meta.env.DEV) return
      console.info(`${namespace}[INFO]`, ...args)
    },
    warn(...args: unknown[]) {
      if (!import.meta.env.DEV) return
      console.warn(`${namespace}[WARN]`, ...args)
    },
    error(...args: unknown[]) {
      console.error(`${namespace}[ERROR]`, ...args)
    },
    debug(...args: unknown[]) {
      if (!import.meta.env.DEV) return
      if (!debugEnabled) return
      console.debug(`${namespace}[DEBUG]`, ...args)
    },
  }
}
