export function getScrollY(): number | null {
  if (!import.meta.client) return null
  return window.scrollY
}

export function getInnerHeight(): number | null {
  if (!import.meta.client) return null
  return window.innerHeight
}

export function getScrollHeight(): number | null {
  if (!import.meta.client) return null
  return document.documentElement.scrollHeight
}

export function scrollTo(x: number, y: number): void {
  if (!import.meta.client) return
  window.scrollTo(x, y)
}
