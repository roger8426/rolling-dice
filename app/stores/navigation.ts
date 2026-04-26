export const useNavigationStore = defineStore('navigation', () => {
  const route = useRoute()
  const isNavOpen = ref(false)

  watch(
    () => route.path,
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

  return { isNavOpen, toggleNav, openNav, closeNav }
})
