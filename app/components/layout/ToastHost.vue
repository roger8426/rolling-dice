<template>
  <Toast
    v-for="item in items"
    :key="item.id"
    :model-value="true"
    :x="item.x"
    :y="item.y"
    :duration="item.duration"
    :bg-color="variantBgColor(item.variant)"
    text-color="white"
    @update:model-value="(open: boolean) => !open && remove(item.id)"
  >
    {{ item.message }}
  </Toast>
</template>

<script setup lang="ts">
import { Toast } from '@ui'
import type { ToastVariant } from '~/composables/ui/useToast'

const { items, remove } = useToast()

const variantBgColor = (variant: ToastVariant): string => {
  if (variant === 'error') return 'var(--color-danger)'
  if (variant === 'success') return 'var(--color-success)'
  return 'var(--color-primary)'
}
</script>
