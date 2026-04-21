import type { NavItem } from '~/types/layout/navigation'

export const navItems: NavItem[] = [
  { label: '角色卡', to: '/character', icon: 'profile' },
  { label: 'DM 相關', to: '/dm', icon: 'dice' },
  { label: '其他工具', to: '/tools', icon: 'tool' },
]

export const useNavigationStore = defineStore('navigation', () => {
  const route = useRoute()
  const isNavOpen = ref(false)

  watch(
    () => route.fullPath,
    () => {
      isNavOpen.value = false
    },
  )

  function toggleNav() {
    isNavOpen.value = !isNavOpen.value
  }

  function openNav() {
    isNavOpen.value = true
  }

  function closeNav() {
    isNavOpen.value = false
  }

  return { navItems, isNavOpen, toggleNav, openNav, closeNav }
})
