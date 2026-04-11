<template>
  <div class="my-6 flex items-center justify-between gap-4">
    <div class="flex items-center gap-2">
      <button
        v-if="showBack"
        class="rounded p-1 text-content-muted transition-colors hover:text-content"
        aria-label="返回上一頁"
        @click="handleBack"
      >
        <Icon name="chevron-left" :size="20" />
      </button>
      <h2 class="font-display text-lg font-bold text-content sm:text-xl">{{ title }}</h2>
    </div>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@ui'
import type { PageHeaderProps } from './types'

const props = withDefaults(defineProps<PageHeaderProps>(), {
  showBack: false,
})

const route = useRoute()

function handleBack() {
  if (props.backTo) {
    navigateTo(props.backTo)
    return
  }
  const parentPath = route.path.replace(/\/[^/]+$/, '') || '/'
  navigateTo(parentPath)
}
</script>
