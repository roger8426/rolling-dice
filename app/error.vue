<script setup lang="ts">
import error404 from '~/assets/images/error/404.png'
import errorDefault from '~/assets/images/error/default.png'

const error = useError()

const errorStatus = computed(() => {
  switch (error.value?.status) {
    case 404:
      return {
        title: '星界放逐！',
        message: '你誤入在浩瀚的星界，儘速返回！',
        url: error404,
      }
    default:
      return {
        title: '紅龍襲擊！',
        message: '未知錯誤，請儘速撤離！',
        url: errorDefault,
      }
  }
})

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main
    class="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-sans bg-canvas"
  >
    <p class="text-5xl text-danger">{{ errorStatus.title }}</p>
    <img :src="errorStatus.url" alt="dragon" class="w-160" />
    <p class="text-center text-lg text-warning">{{ errorStatus.message }}</p>
    <button
      type="button"
      class="mt-2 rounded-md bg-info px-4 py-2 text-sm text-content hover:bg-info-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
      @click="handleClear"
    >
      撤離
    </button>
  </main>
</template>
