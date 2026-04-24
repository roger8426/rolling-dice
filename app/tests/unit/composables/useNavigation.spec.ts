import { createPinia, setActivePinia } from 'pinia'
import { nextTick, reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { navItems, useNavigationStore } from '~/stores/navigation'

// mockRoute 必須為 reactive，Vue 的 watch() 才能偵測到 path 的變更
const mockRoute = reactive({ path: '/initial' })

beforeEach(() => {
  setActivePinia(createPinia())
  // useNavigationStore 透過 Nuxt auto-import 使用 useRoute（globalThis），
  // 不是直接 import from 'vue-router'，所以需要用 vi.stubGlobal 而非 vi.mock
  vi.stubGlobal('useRoute', () => mockRoute)
  mockRoute.path = '/initial'
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('navItems', () => {
  it('應包含 3 個導航項目', () => {
    expect(navItems).toHaveLength(3)
  })

  it('第一個項目應指向 /character', () => {
    expect(navItems[0]!.to).toBe('/character')
  })
})

describe('useNavigationStore — 初始狀態', () => {
  it('isNavOpen 初始值應為 false', () => {
    const store = useNavigationStore()
    expect(store.isNavOpen).toBe(false)
  })
})

describe('useNavigationStore — openNav / closeNav', () => {
  it('openNav() 應將 isNavOpen 設為 true', () => {
    const store = useNavigationStore()
    store.openNav()
    expect(store.isNavOpen).toBe(true)
  })

  it('closeNav() 應將 isNavOpen 設為 false', () => {
    const store = useNavigationStore()
    store.openNav()
    store.closeNav()
    expect(store.isNavOpen).toBe(false)
  })
})

describe('useNavigationStore — toggleNav', () => {
  it('toggleNav() 應反轉 isNavOpen 狀態（false → true）', () => {
    const store = useNavigationStore()
    store.toggleNav()
    expect(store.isNavOpen).toBe(true)
  })

  it('toggleNav() 連續呼叫兩次應回到原始狀態', () => {
    const store = useNavigationStore()
    store.toggleNav()
    store.toggleNav()
    expect(store.isNavOpen).toBe(false)
  })
})

describe('useNavigationStore — route 變更自動關閉', () => {
  it('route.path 變更後 isNavOpen 應自動變為 false', async () => {
    const store = useNavigationStore()

    store.openNav()
    expect(store.isNavOpen).toBe(true)

    mockRoute.path = '/character'
    await nextTick()

    expect(store.isNavOpen).toBe(false)
  })
})
