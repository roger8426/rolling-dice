<script setup lang="ts">
const error = useError()

const message = computed(() => {
  switch (error.value?.status) {
    case 404:
      return '找不到此頁面'
    case 403:
      return '你沒有權限存取此頁面'
    default:
      return '發生了一點問題，請稍後再試'
  }
})

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-sans">
    <p class="text-6xl font-bold text-gray-300">{{ error?.status ?? 500 }}</p>
    <h1 class="text-xl font-semibold text-gray-700">{{ message }}</h1>
    <button
      type="button"
      class="mt-2 rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
      @click="handleClear"
    >
      回到首頁
    </button>
  </main>
</template>
