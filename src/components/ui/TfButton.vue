<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, `btn-${size}`, { 'btn-block': block, 'btn-loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  border: 1px solid transparent;
  cursor: pointer;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-sm { padding: 6px 14px; font-size: 0.8rem; }
.btn-md { padding: 10px 20px; }
.btn-lg { padding: 14px 28px; font-size: 1rem; }
.btn-block { width: 100%; }

.btn-primary {
  background: var(--gradient-brand);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}
.btn-primary:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-surface-2);
  color: var(--text-primary);
  border-color: var(--border-color);
}
.btn-secondary:hover:not(:disabled) { background: var(--bg-hover); }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover:not(:disabled) { background: var(--bg-hover); color: var(--text-primary); }

.btn-outline {
  background: transparent;
  color: var(--brand-600);
  border-color: var(--brand-500);
}
.btn-outline:hover:not(:disabled) { background: var(--brand-50); }

.btn-danger {
  background: var(--error-500);
  color: white;
}
.btn-danger:hover:not(:disabled) { background: var(--error-600); }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
</style>
