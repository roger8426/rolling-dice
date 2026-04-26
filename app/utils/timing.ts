export interface DebouncedFn<Args extends unknown[]> {
  (...args: Args): void
  /** 取消尚未觸發的呼叫 */
  cancel: () => void
  /** 立即以最後一次參數觸發尚未執行的呼叫；無 pending 時為 no-op */
  flush: () => void
}

/**
 * 建立延遲觸發函式；最後一次呼叫後等待 `wait` 毫秒才執行。
 *
 * - 呼叫間隔小於 `wait` 會不斷延後，直到停止輸入後才執行一次
 * - 回傳物件附帶 `cancel()` 可清除尚未觸發的呼叫（用於 unmount 清理）
 * - 回傳物件附帶 `flush()` 可立即執行尚未觸發的呼叫（用於 unmount 時保留最後一次寫入）
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): DebouncedFn<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pendingArgs: Args | null = null

  const debounced = ((...args: Args) => {
    if (timer !== null) clearTimeout(timer)
    pendingArgs = args
    timer = setTimeout(() => {
      timer = null
      const finalArgs = pendingArgs!
      pendingArgs = null
      fn(...finalArgs)
    }, wait)
  }) as DebouncedFn<Args>

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    pendingArgs = null
  }

  debounced.flush = () => {
    if (timer === null) return
    clearTimeout(timer)
    timer = null
    const finalArgs = pendingArgs!
    pendingArgs = null
    fn(...finalArgs)
  }

  return debounced
}

export interface ThrottledFn<Args extends unknown[]> {
  (...args: Args): void
  /** 取消尚未觸發的尾端呼叫 */
  cancel: () => void
}

/**
 * 建立節流函式（leading + trailing）；在 `wait` 毫秒內最多觸發兩次：
 * 第一次呼叫立即執行，後續呼叫暫存為尾端，於時間窗結束時以最後一次參數再執行一次。
 *
 * 回傳物件附帶 `cancel()` 可清除尚未觸發的尾端呼叫（用於 unmount 清理）。
 */
export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): ThrottledFn<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pendingArgs: Args | null = null

  const throttled = ((...args: Args) => {
    if (timer !== null) {
      pendingArgs = args
      return
    }
    fn(...args)
    timer = setTimeout(function tick() {
      if (pendingArgs !== null) {
        const nextArgs = pendingArgs
        pendingArgs = null
        fn(...nextArgs)
        timer = setTimeout(tick, wait)
        return
      }
      timer = null
    }, wait)
  }) as ThrottledFn<Args>

  throttled.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    pendingArgs = null
  }

  return throttled
}
