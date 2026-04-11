export function getScrollY(): number | null {
  if (!import.meta.client) return null
  return window.scrollY
}

export function getInnerHeight(): number | null {
  if (!import.meta.client) return null
  return window.innerHeight
}

export function scrollTo(x: number, y: number): void {
  if (!import.meta.client) return
  window.scrollTo(x, y)
}
