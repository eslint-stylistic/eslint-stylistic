<script setup lang="ts">
defineProps<{
  type: 'correct' | 'incorrect'
}>()
</script>

<template>
  <div relative pt-2>
    <slot />
    <div v-if="type === 'incorrect'" absolute left--2 top-1 bg-red:20 text-red px2 py0.5 rounded-lg flex="~ gap-1 items-center">
      <div i-ri-close-line />
      incorrect
    </div>
    <div v-if="type === 'correct'" absolute left--2 top-1 bg-green:20 text-green px2 py0.5 rounded-lg flex="~ gap-1 items-center">
      <div i-ri-check-line />
      correct
    </div>
  </div>
</template>
