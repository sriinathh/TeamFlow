<script setup lang="ts">
withDefaults(defineProps<{ lines?: number }>(), { lines: 3 })
</script>

<template>
  <div class="skeleton-block">
    <div v-for="i in lines" :key="i" class="skeleton" :style="{ width: i === lines ? '60%' : '100%', height: '14px' }" />
  </div>
</template>

<style scoped>
.skeleton-block { display: flex; flex-direction: column; gap: 10px; }
.skeleton {
  background: linear-gradient(90deg, var(--bg-surface-2) 25%, var(--bg-hover) 50%, var(--bg-surface-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
</style>
