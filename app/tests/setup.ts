/**
 * Vitest global setup — 補齊 Nuxt auto-imports 在測試環境中不存在的函式。
 *
 * 執行順序說明：
 * 1. 先建立 localStorage mock（同步）— pinia 載入時 @vue/devtools-kit 頂層程式碼會
 *    存取 localStorage，必須在此之前準備好，否則 jsdom 拋 SecurityError。
 * 2. log utils 動態 import — local-storage.ts 頂層呼叫 createLogger，需先掛到 globalThis。
 * 3. local-storage 動態 import — 此時 createLogger 已存在。
 * 4. pinia 動態 import — 此時 localStorage mock 已就緒。
 */

// Vue 靜態 import 安全（不存取 localStorage）
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { beforeEach } from 'vitest'

// Step 1: localStorage mock（同步，必須早於所有會觸發 devtools-kit 的 import）
const _localStore = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => _localStore.get(key) ?? null,
    setItem: (key: string, value: string) => {
      _localStore.set(key, String(value))
    },
    removeItem: (key: string) => {
      _localStore.delete(key)
    },
    clear: () => {
      _localStore.clear()
    },
    get length() {
      return _localStore.size
    },
    key: (index: number) => [..._localStore.keys()][index] ?? null,
  },
  writable: true,
  configurable: true,
})

// Step 2: log utils（local-storage.ts 模組頂層會呼叫 createLogger）
const { createLogger, setDebugEnabled } = await import('~/utils/log')
Object.assign(globalThis, { createLogger, setDebugEnabled })

// Step 3: local-storage（此時 createLogger 已掛上 globalThis）
const { getLocalStorage, setLocalStorage, removeLocalStorage } =
  await import('~/utils/local-storage')

// Step 4: pinia（此時 localStorage mock 已就緒）
const { defineStore, setActivePinia } = await import('pinia')

// Step 5: 掛上所有 Nuxt auto-imports
Object.assign(globalThis, {
  ref,
  computed,
  watch,
  nextTick,
  reactive,
  defineStore,
  setActivePinia,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  // 預設 useRoute mock，個別 spec 可用 vi.stubGlobal('useRoute', ...) 覆寫
  useRoute: () => reactive({ fullPath: '/' }),
})

// 每次測試前清除 localStorage，防止跨 spec 狀態污染
beforeEach(() => {
  localStorage.clear()
})
