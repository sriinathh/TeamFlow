<script setup lang="ts">
import { useToastStore } from '../../stores/toast'

const toast = useToastStore()

const icons: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div v-for="t in toast.toasts" :key="t.id" class="toast" :class="`toast-${t.type}`" @click="toast.dismiss(t.id)">
          <span class="toast-icon">{{ icons[t.type] }}</span>
          <span class="toast-msg">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 380px;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  animation: slideUp 0.3s ease both;
}
.toast-icon {
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.75rem;
  color: white; flex-shrink: 0;
}
.toast-success .toast-icon { background: var(--success-500); }
.toast-error .toast-icon { background: var(--error-500); }
.toast-warning .toast-icon { background: var(--warning-500); }
.toast-info .toast-icon { background: var(--brand-500); }
.toast-msg { font-size: 0.875rem; color: var(--text-primary); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
