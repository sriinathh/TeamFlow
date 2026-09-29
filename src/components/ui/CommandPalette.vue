<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../../stores/workspace'
import { useThemeStore } from '../../stores/theme'

const router = useRouter()
const ws = useWorkspaceStore()
const theme = useThemeStore()

const open = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

interface Command {
  id: string
  label: string
  icon: string
  category: string
  action: () => void
  keywords?: string
}

const allCommands = computed<Command[]>(() => [
  { id: 'dashboard', label: 'Go to Dashboard', icon: 'home', category: 'Navigation', action: () => router.push('/app/dashboard') },
  { id: 'projects', label: 'Go to Projects', icon: 'folder', category: 'Navigation', action: () => router.push('/app/projects') },
  { id: 'chat', label: 'Go to Chat', icon: 'message', category: 'Navigation', action: () => router.push('/app/chat') },
  { id: 'meetings', label: 'Go to Meetings', icon: 'video', category: 'Navigation', action: () => router.push('/app/meetings') },
  { id: 'notes', label: 'Go to Notes', icon: 'file', category: 'Navigation', action: () => router.push('/app/notes') },
  { id: 'files', label: 'Go to Files', icon: 'paperclip', category: 'Navigation', action: () => router.push('/app/files') },
  { id: 'calendar', label: 'Go to Calendar', icon: 'calendar', category: 'Navigation', action: () => router.push('/app/calendar') },
  { id: 'settings', label: 'Go to Settings', icon: 'settings', category: 'Navigation', action: () => router.push('/app/settings') },
  { id: 'admin', label: 'Go to Admin Dashboard', icon: 'shield', category: 'Navigation', action: () => router.push('/app/admin') },
  { id: 'notifications', label: 'View Notifications', icon: 'bell', category: 'Navigation', action: () => router.push('/app/notifications') },
  ...ws.workspaceProjects.map(p => ({
    id: 'project-' + p.id, label: p.name, icon: 'folder', category: 'Projects',
    action: () => router.push('/app/projects/' + p.id), keywords: p.labels.join(' '),
  })),
  ...ws.workspaceTasks.slice(0, 15).map(t => ({
    id: 'task-' + t.id, label: t.title, icon: 'check', category: 'Tasks',
    action: () => router.push('/app/projects/' + t.projectId),
  })),
  { id: 'theme-toggle', label: theme.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: 'sun', category: 'Actions', action: () => theme.toggle() },
])

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return allCommands.value.slice(0, 8)
  return allCommands.value.filter(c =>
    c.label.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    (c.keywords?.toLowerCase().includes(q))
  ).slice(0, 12)
})

watch(filtered, () => { selectedIndex.value = 0 })

function execute(cmd: Command) {
  cmd.action()
  closePalette()
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    open.value ? closePalette() : openPalette()
  }
  if (!open.value) return
  if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex.value = Math.min(selectedIndex.value + 1, filtered.value.length - 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex.value = Math.max(selectedIndex.value - 1, 0) }
  if (e.key === 'Enter') { e.preventDefault(); if (filtered.value[selectedIndex.value]) execute(filtered.value[selectedIndex.value]) }
  if (e.key === 'Escape') closePalette()
}

function openPalette() {
  open.value = true
  query.value = ''
  nextTick(() => inputRef.value?.focus())
}
function closePalette() { open.value = false }

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="palette-overlay" @click.self="closePalette">
        <div class="palette">
          <div class="palette-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref="inputRef" v-model="query" placeholder="Type a command or search..." class="palette-input" />
            <kbd>ESC</kbd>
          </div>
          <div class="palette-results">
            <div v-if="filtered.length === 0" class="palette-empty">No results found</div>
            <template v-for="(cmd, i) in filtered" :key="cmd.id">
              <div v-if="i === 0 || filtered[i-1].category !== cmd.category" class="palette-category">{{ cmd.category }}</div>
              <button class="palette-item" :class="{ active: i === selectedIndex }" @click="execute(cmd)" @mouseenter="selectedIndex = i">
                <span class="palette-item-label">{{ cmd.label }}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
  z-index: var(--z-modal);
  display: flex; align-items: flex-start; justify-content: center;
  padding-top: 15vh;
}
.palette {
  width: 100%; max-width: 560px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: scaleIn 0.15s ease both;
}
.palette-input-wrap {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
}
.palette-input {
  flex: 1; border: none; outline: none; background: none;
  font-size: 1rem; color: var(--text-primary);
}
.palette-input::placeholder { color: var(--text-muted); }
kbd {
  font-size: 0.7rem; padding: 2px 8px;
  border-radius: 4px; background: var(--bg-surface-2);
  color: var(--text-muted); border: 1px solid var(--border-color);
  font-family: var(--font-mono);
}
.palette-results { max-height: 400px; overflow-y: auto; padding: 8px; }
.palette-category {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--text-muted);
  padding: 12px 12px 6px;
}
.palette-item {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 10px 12px;
  border-radius: var(--radius-sm); color: var(--text-primary);
  font-size: 0.875rem; text-align: left;
  transition: background 0.1s ease;
}
.palette-item.active { background: var(--bg-hover); }
.chevron { color: var(--text-muted); opacity: 0; transition: opacity 0.1s; }
.palette-item.active .chevron { opacity: 1; }
.palette-empty { padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.875rem; }
</style>
