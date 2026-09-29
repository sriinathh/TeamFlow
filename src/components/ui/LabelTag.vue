<script setup lang="ts">
defineProps<{ label: string; color?: string }>()
</script>

<template>
  <span class="label-tag" :style="color ? { background: color + '22', color, borderColor: color + '44' } : {}">
    {{ label }}
  </span>
</template>

<style scoped>
.label-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: var(--bg-surface-2);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}
</style>
