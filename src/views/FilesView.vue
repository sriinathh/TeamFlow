<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/ui/Avatar.vue'
import TfButton from '../components/ui/TfButton.vue'
import { formatRelative } from '../utils'

const ws = useWorkspaceStore()
const auth = useAuthStore()
const toast = useToastStore()

const activeFolder = ref('All')
const folders = computed(() => {
  const set = new Set(ws.workspaceFiles.map(f => f.folder))
  return ['All', ...Array.from(set)]
})

const filteredFiles = computed(() =>
  activeFolder.value === 'All' ? ws.workspaceFiles : ws.workspaceFiles.filter(f => f.folder === activeFolder.value)
)

const fileIcons: Record<string, { icon: string; color: string }> = {
  image: { icon: 'M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21', color: '#ec4899' },
  pdf: { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6', color: '#ef4444' },
  doc: { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6', color: '#3b82f6' },
  spreadsheet: { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8 M12 13v4', color: '#10b981' },
  other: { icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7', color: '#94a3b8' },
}

function uploadFile() { toast.info('File upload is ready to integrate with Cloudinary') }
</script>

<template>
  <div class="files-page">
    <div class="page-header">
      <div>
        <h1>Files</h1>
        <p class="page-subtitle">{{ ws.workspaceFiles.length }} files · {{ folders.length - 1 }} folders</p>
      </div>
      <TfButton @click="uploadFile">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Upload File
      </TfButton>
    </div>

    <div class="files-layout">
      <div class="folders-sidebar">
        <h3>Folders</h3>
        <button v-for="f in folders" :key="f" class="folder-item" :class="{ active: f === activeFolder }" @click="activeFolder = f">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          {{ f }}
          <span class="folder-count">{{ f === 'All' ? ws.workspaceFiles.length : ws.workspaceFiles.filter(file => file.folder === f).length }}</span>
        </button>
      </div>

      <div class="files-grid">
        <div v-for="file in filteredFiles" :key="file.id" class="file-card card card-hover">
          <div class="fc-icon" :style="{ background: (fileIcons[file.type]?.color || '#94a3b8') + '22', color: fileIcons[file.type]?.color || '#94a3b8' }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="fileIcons[file.type]?.icon || fileIcons.other.icon" /></svg>
          </div>
          <div class="fc-info">
            <span class="fc-name">{{ file.name }}</span>
            <span class="fc-meta">{{ file.size }} · {{ file.folder }}</span>
          </div>
          <div class="fc-footer">
            <div class="fc-author">
              <Avatar :user-id="file.uploadedBy" size="xs" />
              <span>{{ auth.getUserById(file.uploadedBy)?.name?.split(' ')[0] }}</span>
            </div>
            <span class="fc-date">{{ formatRelative(file.uploadedAt) }}</span>
          </div>
        </div>
        <div v-if="filteredFiles.length === 0" class="empty-state">No files in this folder</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
.files-layout { display: flex; gap: 24px; }
.folders-sidebar { width: 200px; flex-shrink: 0; }
.folders-sidebar h3 { font-size: 0.85rem; margin-bottom: 12px; color: var(--text-muted); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.04em; }
.folder-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 12px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-secondary); transition: all 0.1s; text-align: left; }
.folder-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.folder-item.active { background: var(--brand-50); color: var(--brand-600); font-weight: 600; }
.folder-count { margin-left: auto; font-size: 0.72rem; color: var(--text-muted); }
.files-grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.file-card { padding: 20px; }
.fc-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
.fc-info { margin-bottom: 14px; }
.fc-name { font-size: 0.88rem; font-weight: 600; display: block; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fc-meta { font-size: 0.76rem; color: var(--text-muted); }
.fc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-color); }
.fc-author { display: flex; align-items: center; gap: 6px; font-size: 0.76rem; color: var(--text-muted); }
.fc-date { font-size: 0.74rem; color: var(--text-muted); }
.empty-state { grid-column: 1 / -1; padding: 60px; text-align: center; color: var(--text-muted); }
@media (max-width: 900px) { .files-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .files-layout { flex-direction: column; } .files-grid { grid-template-columns: 1fr; } .folders-sidebar { width: 100%; } .folder-item { display: inline-flex; margin-right: 8px; } }
</style>
