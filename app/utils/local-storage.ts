const logger = createLogger('[LocalStorage]')

export const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  const storedValue = localStorage.getItem(key)
  if (storedValue === null) return null

  try {
    return JSON.parse(storedValue) as T
  } catch (error) {
    logger.error(`Error parsing localStorage key "${key}":`, error)
    return null
  }
}

export const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    logger.error(`Error setting localStorage key "${key}":`, error)
  }
}

export const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    logger.error(`Error removing localStorage key "${key}":`, error)
  }
}
