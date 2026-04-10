import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export interface NavItem {
  label: string
  to: string
}

export const navItems: NavItem[] = [
  { label: '首頁', to: '/' },
  { label: '角色', to: '/character' },
]

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

export function useNavigation() {
  const route = useRoute()

  watch(
    () => route.fullPath,
    () => {
      closeMobileMenu()
    },
  )

  return {
    navItems,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  }
}
