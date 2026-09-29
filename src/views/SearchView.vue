<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { statusLabels, priorityColors } from '../utils'

const ws = useWorkspaceStore()
const auth = useAuthStore()
const router = useRouter()

const query = ref('')
const activeTab = ref<'all' | 'tasks' | 'projects' | 'members' | 'messages' | 'documents'>('all')

const results = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return { tasks: [], projects: [], members: [], documents: [] }
  return {
    tasks: ws.workspaceTasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 8),
    projects: ws.workspaceProjects.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)).slice(0, 5),
    members: auth.allUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 6),
    documents: ws.workspaceNotes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).slice(0, 5),
  }
})

const totalResults = computed(() => Object.values(results.value).reduce((sum, arr) => sum + arr.length, 0))

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'projects', label: 'Projects' },
  { key: 'members', label: 'Members' },
  { key: 'documents', label: 'Documents' },
] as const
</script>

<template>
  <div class="search-page">
    <div class="search-header">
      <div class="search-input-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="query" type="text" placeholder="Search tasks, projects, members, documents..." autofocus />
      </div>
    </div>

    <div v-if="query" class="search-tabs">
      <button v-for="tab in tabs" :key="tab.key" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="query && totalResults > 0" class="search-results">
      <div v-if="activeTab === 'all' || activeTab === 'tasks'" v-show="results.tasks.length" class="result-section">
        <h3>Tasks ({{ results.tasks.length }})</h3>
        <div v-for="t in results.tasks" :key="t.id" class="result-item card" @click="router.push('/app/projects/' + t.projectId)">
          <span class="ri-priority" :style="{ background: priorityColors[t.priority] }" />
          <div class="ri-body">
            <span class="ri-title">{{ t.title }}</span>
            <span class="ri-meta">{{ ws.getProjectById(t.projectId)?.name }} · {{ statusLabels[t.status] }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'all' || activeTab === 'projects'" v-show="results.projects.length" class="result-section">
        <h3>Projects ({{ results.projects.length }})</h3>
        <div v-for="p in results.projects" :key="p.id" class="result-item card" @click="router.push('/app/projects/' + p.id)">
          <div class="ri-icon" :style="{ background: p.color + '22', color: p.color }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="ri-body">
            <span class="ri-title">{{ p.name }}</span>
            <span class="ri-meta">{{ p.description }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'all' || activeTab === 'members'" v-show="results.members.length" class="result-section">
        <h3>Members ({{ results.members.length }})</h3>
        <div v-for="m in results.members" :key="m.id" class="result-item card">
          <div class="ri-avatar" :style="{ background: 'var(--gradient-brand)' }">{{ m.avatar }}</div>
          <div class="ri-body">
            <span class="ri-title">{{ m.name }}</span>
            <span class="ri-meta">{{ m.title }} · {{ m.email }}</span>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'all' || activeTab === 'documents'" v-show="results.documents.length" class="result-section">
        <h3>Documents ({{ results.documents.length }})</h3>
        <div v-for="d in results.documents" :key="d.id" class="result-item card" @click="router.push('/app/notes/' + d.id)">
          <div class="ri-icon" style="background: var(--brand-50); color: var(--brand-600);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="ri-body">
            <span class="ri-title">{{ d.title }}</span>
            <span class="ri-meta">{{ d.content.replace(/[#*\-[\]]/g, '').slice(0, 80) }}...</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="query && totalResults === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <h3>No results found</h3>
      <p>Try searching for a task, project, member, or document.</p>
    </div>

    <div v-else class="search-empty">
      <h3>Search across your workspace</h3>
      <p>Find tasks, projects, team members, and documents — all in one place.</p>
    </div>
  </div>
</template>

<style scoped>
.search-header { margin-bottom: 24px; }
.search-input-wrap { display: flex; align-items: center; gap: 12px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 14px 20px; max-width: 640px; }
.search-input-wrap:focus-within { border-color: var(--brand-500); box-shadow: var(--shadow-glow); }
.search-input-wrap input { flex: 1; border: none; outline: none; background: none; color: var(--text-primary); font-size: 1rem; }
.search-input-wrap input::placeholder { color: var(--text-muted); }
.search-tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); }
.search-tabs button { padding: 10px 18px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); border-bottom: 2px solid transparent; transition: all 0.15s; }
.search-tabs button.active { color: var(--brand-600); border-bottom-color: var(--brand-500); }
.search-tabs button:hover { color: var(--text-primary); }
.search-results { display: flex; flex-direction: column; gap: 28px; }
.result-section h3 { font-size: 0.9rem; margin-bottom: 12px; color: var(--text-muted); }
.result-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; margin-bottom: 8px; }
.result-item:hover { box-shadow: var(--shadow-sm); }
.ri-priority { width: 4px; height: 20px; border-radius: 2px; flex-shrink: 0; }
.ri-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ri-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
.ri-body { display: flex; flex-direction: column; }
.ri-title { font-size: 0.88rem; font-weight: 500; }
.ri-meta { font-size: 0.78rem; color: var(--text-muted); }
.empty-state, .search-empty { text-align: center; padding: 80px 20px; color: var(--text-muted); }
.empty-state svg { margin-bottom: 16px; opacity: 0.3; }
.empty-state h3, .search-empty h3 { margin-bottom: 8px; color: var(--text-secondary); }
</style>
