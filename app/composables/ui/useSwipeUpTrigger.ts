import { type Ref, onMounted, onUnmounted, watch } from 'vue'
import { useNavigation } from '~/composables/ui/useNavigation'

const MIN_SWIPE_UP_DELTA = 30
const MIN_SCROLL_BOTTOM_SWIPE_DELTA = 60
const SCROLL_BOTTOM_TOLERANCE = 20

export function useSwipeUpTrigger(elementRef: Ref<HTMLElement | null>) {
  const { isNavOpen, openNav } = useNavigation()

  let touchStartY = 0

  function resetTouch() {
    touchStartY = 0
  }

  function isAtBottom(): boolean {
    const { scrollHeight } = document.documentElement
    return scrollHeight - (window.scrollY + window.innerHeight) <= SCROLL_BOTTOM_TOLERANCE
  }

  function onTouchStart(e: TouchEvent) {
    touchStartY = e.touches[0]?.clientY ?? 0
  }

  function onElementTouchEnd(e: TouchEvent) {
    e.stopPropagation() // 阻止 document handler 重複計算此次觸控

    const endY = e.changedTouches[0]?.clientY ?? touchStartY
    const delta = endY - touchStartY

    if (delta < -MIN_SWIPE_UP_DELTA && !isNavOpen.value) {
      openNav()
      resetTouch()
    }
  }

  function onDocumentTouchEnd(e: TouchEvent) {
    const endY = e.changedTouches[0]?.clientY ?? touchStartY
    const delta = endY - touchStartY

    if (delta < -MIN_SCROLL_BOTTOM_SWIPE_DELTA && isAtBottom() && !isNavOpen.value) {
      openNav()
    }

    resetTouch()
  }

  // 桌面滾輪：已在頁面底部時繼續往下滾觸發 open
  function onWheel(e: WheelEvent) {
    if (e.deltaY > 0 && isAtBottom() && !isNavOpen.value) {
      openNav()
    }
  }

  // Drawer 關閉後清除殘留的 touchStartY，防止非預期觸發
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
