<script setup lang="ts">
import type { Priority } from '../../types'
import { priorityColors, priorityBg } from '../../utils'

defineProps<{ priority: Priority; size?: 'sm' | 'md' }>()
</script>

<template>
  <span class="priority-badge" :class="`size-${size || 'sm'}`" :style="{ color: priorityColors[priority], background: priorityBg[priority] }">
    <span class="dot" :style="{ background: priorityColors[priority] }" />
    {{ priority }}
  </span>
</template>

<style scoped>
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: capitalize;
  font-weight: 600;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.7rem;
}
.size-md { padding: 5px 12px; font-size: 0.8rem; }
.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
</style>
