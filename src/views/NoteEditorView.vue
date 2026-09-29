<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import TfButton from '../components/ui/TfButton.vue'
import Avatar from '../components/ui/Avatar.vue'
import { formatRelative } from '../utils'

const route = useRoute()
const router = useRouter()
const ws = useWorkspaceStore()
const auth = useAuthStore()
const toast = useToastStore()

const noteId = computed(() => route.params.id as string)
const note = computed(() => ws.workspaceNotes.find(n => n.id === noteId.value))

const isEditing = ref(false)
const editTitle = ref('')
const editContent = ref('')

function startEditing() {
  if (!note.value) return
  editTitle.value = note.value.title
  editContent.value = note.value.content
  isEditing.value = true
}

function saveNote() {
  if (!note.value) return
  ws.updateNote(note.value.id, { title: editTitle.value, content: editContent.value })
  isEditing.value = false
  toast.success('Note saved!')
}

function discardEdit() { isEditing.value = false }
</script>

<template>
  <div class="note-editor-page" v-if="note">
    <div class="ne-header">
      <button class="back-btn" @click="router.push('/app/notes')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="ne-meta">
        <Avatar :user-id="note.authorId" size="xs" />
        <span class="ne-author">{{ auth.getUserById(note.authorId)?.name }}</span>
        <span class="ne-edited">Last edited {{ formatRelative(note.lastEdited) }}</span>
      </div>
      <div class="ne-actions">
        <TfButton v-if="!isEditing" variant="secondary" size="sm" @click="startEditing">Edit</TfButton>
        <template v-if="isEditing">
          <TfButton variant="ghost" size="sm" @click="discardEdit">Cancel</TfButton>
          <TfButton size="sm" @click="saveNote">Save</TfButton>
        </template>
      </div>
    </div>

    <div class="ne-content">
      <input v-if="isEditing" v-model="editTitle" class="ne-title-input" />
      <h1 v-else class="ne-title">{{ note.title }}</h1>

      <div v-if="isEditing" class="ne-editor">
        <textarea v-model="editContent" class="ne-textarea" placeholder="Start writing..."></textarea>
      </div>
      <div v-else class="ne-rendered" v-html="note.content.replace(/\n/g, '<br>')"></div>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Note not found</h2>
    <TfButton @click="router.push('/app/notes')">Back to Notes</TfButton>
  </div>
</template>

<style scoped>
.note-editor-page { max-width: 760px; margin: 0 auto; }
.ne-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
.back-btn { width: 36px; height: 36px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: 1px solid var(--border-color); }
.back-btn:hover { background: var(--bg-hover); }
.ne-meta { flex: 1; display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-muted); }
.ne-author { font-weight: 600; color: var(--text-secondary); }
.ne-actions { display: flex; gap: 8px; }
.ne-content { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 40px; min-height: 500px; }
.ne-title { font-size: 1.8rem; margin-bottom: 24px; line-height: 1.3; }
.ne-title-input { width: 100%; border: none; outline: none; font-size: 1.8rem; font-weight: 700; background: none; color: var(--text-primary); margin-bottom: 24px; font-family: inherit; }
.ne-title-input::placeholder { color: var(--text-muted); }
.ne-rendered { font-size: 0.95rem; line-height: 1.7; color: var(--text-primary); }
.ne-textarea { width: 100%; min-height: 400px; border: none; outline: none; background: none; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.7; resize: vertical; }
.not-found { text-align: center; padding: 80px 20px; }
.not-found h2 { margin-bottom: 16px; }
@media (max-width: 600px) { .ne-content { padding: 20px; } }
</style>
