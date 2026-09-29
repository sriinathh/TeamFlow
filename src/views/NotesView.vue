<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/ui/Avatar.vue'
import TfButton from '../components/ui/TfButton.vue'
import { formatRelative } from '../utils'

const ws = useWorkspaceStore()
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const showCreateModal = ref(false)
const newNoteTitle = ref('')

function createNote() {
  if (!newNoteTitle.value) { toast.error('Title is required'); return }
  const note = ws.addNote({ title: newNoteTitle.value, content: '# ' + newNoteTitle.value + '\n\nStart writing...', authorId: auth.currentUser!.id, sharedWith: [] })
  toast.success('Note created!')
  newNoteTitle.value = ''
  showCreateModal.value = false
  router.push('/app/notes/' + note.id)
}
</script>

<template>
  <div class="notes-page">
    <div class="page-header">
      <div>
        <h1>Notes & Wiki</h1>
        <p class="page-subtitle">{{ ws.workspaceNotes.length }} documents in this workspace</p>
      </div>
      <TfButton @click="showCreateModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Note
      </TfButton>
    </div>

    <div class="notes-grid">
      <div v-for="note in ws.workspaceNotes" :key="note.id" class="note-card card card-hover" @click="router.push('/app/notes/' + note.id)">
        <div class="nc-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3>{{ note.title }}</h3>
        <p class="nc-preview">{{ note.content.replace(/[#*\-[\]]/g, '').slice(0, 120) }}...</p>
        <div class="nc-footer">
          <div class="nc-author">
            <Avatar :user-id="note.authorId" size="xs" />
            <span>{{ auth.getUserById(note.authorId)?.name }}</span>
          </div>
          <span class="nc-date">{{ formatRelative(note.lastEdited) }}</span>
        </div>
        <div v-if="note.sharedWith.length" class="nc-shared">
          <span>Shared with {{ note.sharedWith.length }}</span>
          <div class="nc-shared-avatars">
            <Avatar v-for="uid in note.sharedWith.slice(0, 3)" :key="uid" :user-id="uid" size="xs" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="ws.workspaceNotes.length === 0" class="empty-state card">No notes yet. Create your first one!</div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCreateModal" class="quick-modal-overlay" @click.self="showCreateModal = false">
          <div class="quick-modal glass">
            <h3>Create New Note</h3>
            <input v-model="newNoteTitle" type="text" placeholder="Note title..." autofocus @keyup.enter="createNote" />
            <div class="qm-actions">
              <TfButton variant="ghost" @click="showCreateModal = false">Cancel</TfButton>
              <TfButton @click="createNote">Create</TfButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
.notes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.note-card { padding: 24px; cursor: pointer; }
.nc-icon { width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--brand-50); color: var(--brand-600); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.note-card h3 { font-size: 1.05rem; margin-bottom: 8px; }
.nc-preview { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.nc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-color); }
.nc-author { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-secondary); }
.nc-date { font-size: 0.76rem; color: var(--text-muted); }
.nc-shared { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 0.74rem; color: var(--text-muted); }
.nc-shared-avatars { display: flex; }
.empty-state { padding: 60px; text-align: center; color: var(--text-muted); }
.quick-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: var(--z-modal); display: flex; align-items: center; justify-content: center; padding: 20px; }
.quick-modal { width: 100%; max-width: 400px; padding: 28px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-lg); animation: scaleIn 0.15s ease both; }
.quick-modal h3 { margin-bottom: 16px; }
.quick-modal input { width: 100%; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-2); color: var(--text-primary); outline: none; margin-bottom: 20px; }
.quick-modal input:focus { border-color: var(--brand-500); }
.qm-actions { display: flex; justify-content: flex-end; gap: 10px; }
@media (max-width: 900px) { .notes-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .notes-grid { grid-template-columns: 1fr; } }
</style>
