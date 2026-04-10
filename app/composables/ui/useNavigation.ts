import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { NavItem } from './types'

export const navItems: NavItem[] = [
  { label: '角色卡', to: '/character', icon: 'profile' },
  { label: 'DM 相關', to: '/dm', icon: 'dice' },
  { label: '其他工具', to: '/tools', icon: 'tool' },
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
