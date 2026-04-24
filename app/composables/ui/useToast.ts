import { reactive, readonly } from 'vue'
import type { DeepReadonly } from 'vue'
import type { ToastX, ToastY } from '@ui'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  duration: number
  x: ToastX
  y: ToastY
}

export interface ToastOptions {
  /** 自動關閉時間（毫秒）。預設 info/success 3000，error 5000。傳 0 表示不自動關閉。 */
  duration?: number
  x?: ToastX
  y?: ToastY
}

export interface UseToastReturn {
  items: DeepReadonly<ToastItem[]>
  error: (message: string, options?: ToastOptions) => string
  success: (message: string, options?: ToastOptions) => string
  info: (message: string, options?: ToastOptions) => string
  remove: (id: string) => void
  clear: () => void
}

const DEFAULT_DURATION = 3000
const ERROR_DURATION = 5000
const DEFAULT_X: ToastX = 'right'
const DEFAULT_Y: ToastY = 'top'

// 模組層級 singleton：跨 component 呼叫 useToast() 時共享同一份佇列
const items = reactive<ToastItem[]>([])

function push(variant: ToastVariant, message: string, options?: ToastOptions): string {
  const id = crypto.randomUUID()
  items.push({
    id,
    message,
    variant,
    duration: options?.duration ?? (variant === 'error' ? ERROR_DURATION : DEFAULT_DURATION),
    x: options?.x ?? DEFAULT_X,
    y: options?.y ?? DEFAULT_Y,
  })
  return id
}

function remove(id: string): void {
  const index = items.findIndex((it) => it.id === id)
  if (index !== -1) items.splice(index, 1)
}

function clear(): void {
  items.splice(0, items.length)
}

/**
 * 全域通知佇列。呼叫 useToast().error('訊息') 等方法推入通知。
 *
 * error 預設 duration 5000、其餘 3000；可透過 options 覆寫。
 */
export function useToast(): UseToastReturn {
  return {
    items: readonly(items) as DeepReadonly<ToastItem[]>,
    error: (message, options) => push('error', message, options),
    success: (message, options) => push('success', message, options),
    info: (message, options) => push('info', message, options),
    remove,
    clear,
  }
}
