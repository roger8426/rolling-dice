import { nextTick, reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// mockRoute 必須為 reactive，Vue 的 watch() 才能偵測到 fullPath 的變更
const mockRoute = reactive({ fullPath: '/initial' })

async function getComposable() {
  const { useNavigation, navItems } = await import('~/composables/useNavigation')
  return { useNavigation, navItems }
}

beforeEach(() => {
  vi.resetModules()
  // useNavigation.ts 透過 Nuxt auto-import 使用 useRoute（globalThis），
  // 不是直接 import from 'vue-router'，所以需要用 vi.stubGlobal 而非 vi.mock
  vi.stubGlobal('useRoute', () => mockRoute)
  mockRoute.fullPath = '/initial'
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('navItems', () => {
  it('應包含 3 個導航項目', async () => {
    const { navItems } = await getComposable()
    expect(navItems).toHaveLength(3)
  })

  it('第一個項目應指向 /character', async () => {
    const { navItems } = await getComposable()
    expect(navItems[0]!.to).toBe('/character')
  })
})

describe('useNavigation — 初始狀態', () => {
  it('isNavOpen 初始值應為 false', async () => {
    const { useNavigation } = await getComposable()
    const { isNavOpen } = useNavigation()
    expect(isNavOpen.value).toBe(false)
  })
})

describe('useNavigation — openNav / closeNav', () => {
  it('openNav() 應將 isNavOpen 設為 true', async () => {
    const { useNavigation } = await getComposable()
    const { isNavOpen, openNav } = useNavigation()
    openNav()
    expect(isNavOpen.value).toBe(true)
  })

  it('closeNav() 應將 isNavOpen 設為 false', async () => {
    const { useNavigation } = await getComposable()
    const { isNavOpen, openNav, closeNav } = useNavigation()
    openNav()
    closeNav()
    expect(isNavOpen.value).toBe(false)
  })
})

describe('useNavigation — toggleNav', () => {
  it('toggleNav() 應反轉 isNavOpen 狀態（false → true）', async () => {
    const { useNavigation } = await getComposable()
    const { isNavOpen, toggleNav } = useNavigation()
    toggleNav()
    expect(isNavOpen.value).toBe(true)
  })

  it('toggleNav() 連續呼叫兩次應回到原始狀態', async () => {
    const { useNavigation } = await getComposable()
    const { isNavOpen, toggleNav } = useNavigation()
    toggleNav()
    toggleNav()
    expect(isNavOpen.value).toBe(false)
  })
})

describe('useNavigation — route 變更自動關閉', () => {
  it('route.fullPath 變更後 isNavOpen 應自動變為 false', async () => {
    const { useNavigation } = await getComposable()
    const { isNavOpen, openNav } = useNavigation()

    openNav()
    expect(isNavOpen.value).toBe(true)

    mockRoute.fullPath = '/character'
    await nextTick()

    expect(isNavOpen.value).toBe(false)
  })
})
