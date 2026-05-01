<template>
  <Input
    class="bg-canvas-inset rounded-md"
    :model-value="modelValue"
    :border-color="borderColor"
    v-bind="$attrs"
    @update:model-value="onInput"
  />
</template>

<script setup lang="ts">
import { Input } from '@ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    borderColor?: string
    trim?: boolean
  }>(),
  {
    modelValue: '',
    borderColor: 'var(--color-primary)',
    trim: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(value: string) {
  if (!props.trim) {
    emit('update:modelValue', value)
    return
  }
  emit('update:modelValue', value.replace(/^\s+/, ''))
}
</script>
