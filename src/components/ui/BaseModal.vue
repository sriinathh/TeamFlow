<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  width?: string
}>(), { width: '500px' })

const emit = defineEmits<{ 'update:modelValue': [value: boolean]; close: [] }>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <Transition name="modal" appear>
          <div v-if="modelValue" class="modal" :style="{ maxWidth: width }">
            <div v-if="title || $slots.header" class="modal-header">
              <slot name="header">
                <h3>{{ title }}</h3>
              </slot>
              <button class="modal-close" @click="close" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  width: 100%;
  box-shadow: var(--shadow-lg);
  max-height: 85vh;
  overflow-y: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
}
.modal-header h3 { font-size: 1.25rem; }
.modal-close {
  width: 32px; height: 32px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
.modal-body { padding: 24px; }
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  display: flex; justify-content: flex-end; gap: 12px;
}
</style>
