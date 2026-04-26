import { createLogger } from '~/utils/log'

/** window/document thin wrapper：非 client 環境記錄 error 並回傳 null / no-op。 */

const logger = createLogger('[window]')

export function getScrollY(): number | null {
  if (!import.meta.client) {
    logger.error('getScrollY called outside client context')
    return null
  }
  return window.scrollY
}

export function getInnerHeight(): number | null {
  if (!import.meta.client) {
    logger.error('getInnerHeight called outside client context')
    return null
  }
  return window.innerHeight
}

export function getScrollHeight(): number | null {
  if (!import.meta.client) {
    logger.error('getScrollHeight called outside client context')
    return null
  }
  return document.documentElement.scrollHeight
}

export function scrollTo(x: number, y: number): void {
  if (!import.meta.client) {
    logger.error('scrollTo called outside client context')
    return
  }
  window.scrollTo(x, y)
}
