<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const props = withDefaults(defineProps<{
  userId?: string
  name?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showStatus?: boolean
  online?: boolean
}>(), {
  size: 'md',
  showStatus: false,
})

const auth = useAuthStore()

const sizes: Record<string, string> = {
  xs: '20px', sm: '28px', md: '36px', lg: '48px', xl: '72px',
}

const label = props.initials || (props.name ? props.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : (props.userId ? auth.getUserById(props.userId)?.avatar ?? '?' : '?'))
const onlineStatus = props.online ?? (props.userId ? auth.getUserById(props.userId)?.online ?? false : false)

const colors = [
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
]
const colorIdx = (label.charCodeAt(0) || 0) % colors.length
</script>

<template>
  <div class="avatar-wrapper" :style="{ '--avatar-size': sizes[size] }">
    <div class="avatar" :style="{ background: colors[colorIdx] }">
      {{ label }}
    </div>
    <span v-if="showStatus" class="status-dot" :class="{ online: onlineStatus, offline: !onlineStatus }" />
  </div>
</template>

<style scoped>
.avatar-wrapper {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}
.avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: calc(var(--avatar-size) * 0.38);
  font-weight: 700;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(var(--avatar-size) * 0.28);
  height: calc(var(--avatar-size) * 0.28);
  border-radius: 50%;
  border: 2px solid var(--bg-surface);
}
.status-dot.online { background: #10b981; }
.status-dot.offline { background: #94a3b8; }
</style>
