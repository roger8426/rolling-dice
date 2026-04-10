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

const isNavOpen = ref(false)

function toggleNav() {
  isNavOpen.value = !isNavOpen.value
}

function openNav() {
  isNavOpen.value = true
}

function closeNav() {
  isNavOpen.value = false
}

export function useNavigation() {
  const route = useRoute()

  watch(
    () => route.fullPath,
    () => {
      closeNav()
    },
  )

  return {
    navItems,
    isNavOpen,
    openNav,
    toggleNav,
    closeNav,
  }
}
