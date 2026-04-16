<template>
  <Input class="bg-canvas-inset rounded-md" :border-color="borderColor" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { Input } from '@ui'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    borderColor?: string
  }>(),
  {
    borderColor: 'var(--color-primary)',
  },
)
</script>
