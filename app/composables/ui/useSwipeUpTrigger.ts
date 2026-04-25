import { type Ref, onMounted, onUnmounted, watch } from 'vue'

interface SwipeUpTriggerOptions {
  /** 命中此 route name 列表時不啟用觸發行為 */
  disabledRouteNames?: readonly string[]
  /** 元素內向上滑動的最小距離 */
  minSwipeUpDelta?: number
  /** 頁面滾到底時向上滑的最小距離 */
  minScrollBottomSwipeDelta?: number
  /** 視為「已滾到底」的容差 */
  scrollBottomTolerance?: number
  /** 視為「畫面底部觸發區」的高度 */
  triggerZoneHeight?: number
}

export function useSwipeUpTrigger(
  elementRef: Ref<HTMLElement | null>,
  options: SwipeUpTriggerOptions = {},
) {
  const {
    disabledRouteNames,
    minSwipeUpDelta = 30,
    minScrollBottomSwipeDelta = 60,
    scrollBottomTolerance = 20,
    triggerZoneHeight = 100,
  } = options

  const route = useRoute()
  const navStore = useNavigationStore()
  const { isNavOpen } = storeToRefs(navStore)
  const { openNav } = navStore

  let touchStartY = 0
  let touchStartX = 0
  let isInTriggerZone = false

  function isDisabled(): boolean {
    return disabledRouteNames?.includes(String(route.name)) ?? false
  }

  function resetTouch() {
    touchStartY = 0
    touchStartX = 0
    isInTriggerZone = false
  }

  function isAtBottom(): boolean {
    const scrollY = getScrollY()
    const innerHeight = getInnerHeight()
    const scrollHeight = getScrollHeight()
    if (scrollY === null || innerHeight === null || scrollHeight === null) return false
    return scrollHeight - (scrollY + innerHeight) <= scrollBottomTolerance
  }

  function onTouchStart(e: TouchEvent) {
    if (isDisabled()) return
    touchStartY = e.touches[0]?.clientY ?? 0
    touchStartX = e.touches[0]?.clientX ?? 0
    const innerHeight = getInnerHeight()
    isInTriggerZone = innerHeight !== null && touchStartY >= innerHeight - triggerZoneHeight
  }

  function onElementTouchEnd(e: TouchEvent) {
    if (isDisabled()) return
    e.stopPropagation() // 阻止 document handler 重複計算此次觸控

    const endY = e.changedTouches[0]?.clientY ?? touchStartY
    const endX = e.changedTouches[0]?.clientX ?? touchStartX
    const delta = endY - touchStartY
    const deltaX = endX - touchStartX

    if (Math.abs(deltaX) > Math.abs(delta)) return

    if (delta < -minSwipeUpDelta && !isNavOpen.value) {
      openNav()
      resetTouch()
    }
  }

  function onDocumentTouchEnd(e: TouchEvent) {
    if (isDisabled()) {
      resetTouch()
      return
    }
    if (!isInTriggerZone) {
      resetTouch()
      return
    }

    const endY = e.changedTouches[0]?.clientY ?? touchStartY
    const endX = e.changedTouches[0]?.clientX ?? touchStartX
    const delta = endY - touchStartY
    const deltaX = endX - touchStartX

    if (Math.abs(deltaX) > Math.abs(delta)) {
      resetTouch()
      return
    }

    if (delta < -minScrollBottomSwipeDelta && isAtBottom() && !isNavOpen.value) {
      openNav()
    }

    resetTouch()
  }

  /** 桌面滾輪：已在頁面底部時繼續往下滾觸發 open */
  function onWheel(e: WheelEvent) {
    if (isDisabled()) return
    const innerHeight = getInnerHeight()
    if (innerHeight === null || e.clientY < innerHeight - triggerZoneHeight) return

    if (e.deltaY > 0 && isAtBottom() && !isNavOpen.value) {
      openNav()
    }
  }

  /** Drawer 關閉後清除殘留的 touchStartY，防止非預期觸發 */
  watch(isNavOpen, (val) => {
    if (!val) resetTouch()
  })

  onMounted(() => {
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onDocumentTouchEnd)
    document.addEventListener('wheel', onWheel, { passive: true })

    const el = elementRef.value
    if (el) {
      el.addEventListener('touchend', onElementTouchEnd)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchend', onDocumentTouchEnd)
    document.removeEventListener('wheel', onWheel)

    const el = elementRef.value
    if (el) {
      el.removeEventListener('touchend', onElementTouchEnd)
    }
  })
}
