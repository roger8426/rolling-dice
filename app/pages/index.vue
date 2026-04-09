<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: sans-serif;
      gap: 12px;
    "
  >
    <h1 style="font-size: 2rem; font-weight: bold">Rolling Dice</h1>
    <p style="color: #6b7280">系統正常運作中，等待重新設計。</p>
    <span style="font-size: 0.75rem; color: #9ca3af">{{ new Date().toLocaleString('zh-TW') }}</span>
    <Button>test</Button>
  </div>
</template>

<script setup>
import { Button } from '@ui'
</script>
