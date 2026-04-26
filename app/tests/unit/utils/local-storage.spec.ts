import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '~/utils/local-storage'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('getLocalStorage', () => {
  it('window 不存在時應回傳 null', () => {
    vi.stubGlobal('window', undefined)
    expect(getLocalStorage('key')).toBeNull()
  })

  it('key 不存在時應回傳 null', () => {
    expect(getLocalStorage('non-existent')).toBeNull()
  })

  it('key 存在且值為合法 JSON 時應回傳解析後的值', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Alice' }))
    expect(getLocalStorage<{ name: string }>('user')).toEqual({ name: 'Alice' })
  })

  it('key 存在但值為非法 JSON 時應回傳 null 且不拋出錯誤', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('broken', 'not-json{{{')
    expect(() => getLocalStorage('broken')).not.toThrow()
    expect(getLocalStorage('broken')).toBeNull()
  })

  it('key 存在但值為非法 JSON 時應呼叫 console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('broken', 'not-json{{{')
    getLocalStorage('broken')
    expect(spy).toHaveBeenCalled()
  })
})

describe('setLocalStorage', () => {
  it('window 不存在時應回傳 false 且不寫入任何值', () => {
    vi.stubGlobal('window', undefined)
    expect(setLocalStorage('key', 'value')).toBe(false)
  })

  it('合法物件應寫入後可讀回正確的 JSON 字串，並回傳 true', () => {
    const result = setLocalStorage('config', { theme: 'dark', lang: 'zh-tw' })
    expect(result).toBe(true)
    expect(localStorage.getItem('config')).toBe(JSON.stringify({ theme: 'dark', lang: 'zh-tw' }))
  })

  it('無法序列化的值（循環引用）應回傳 false 且不拋出錯誤', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circular: any = {}
    circular.self = circular
    expect(setLocalStorage('circular', circular)).toBe(false)
  })

  it('無法序列化的值應呼叫 console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circular: any = {}
    circular.self = circular
    setLocalStorage('circular', circular)
    expect(spy).toHaveBeenCalled()
  })
})

describe('removeLocalStorage', () => {
  it('window 不存在時應靜默返回，不拋出錯誤', () => {
    vi.stubGlobal('window', undefined)
    expect(() => removeLocalStorage('key')).not.toThrow()
  })

  it('key 存在時刪除後應無法從 localStorage 讀取', () => {
    localStorage.setItem('to-remove', '"value"')
    removeLocalStorage('to-remove')
    expect(localStorage.getItem('to-remove')).toBeNull()
  })

  it('key 不存在時呼叫應不拋出錯誤', () => {
    expect(() => removeLocalStorage('non-existent')).not.toThrow()
  })

  it('localStorage.removeItem 拋出例外時應不拋出錯誤', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('removeItem failed')
    })
    expect(() => removeLocalStorage('key')).not.toThrow()
  })

  it('localStorage.removeItem 拋出例外時應呼叫 console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('removeItem failed')
    })
    removeLocalStorage('key')
    expect(spy).toHaveBeenCalled()
  })
})
