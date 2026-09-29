<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/ui/Avatar.vue'
import PriorityBadge from '../components/ui/PriorityBadge.vue'
import LabelTag from '../components/ui/LabelTag.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import TfButton from '../components/ui/TfButton.vue'
import { formatDate, daysUntil, statusColors, statusLabels, kanbanColumns, priorityColors } from '../utils'
import type { TaskStatus, Priority } from '../types'

const route = useRoute()
const router = useRouter()
const ws = useWorkspaceStore()
const auth = useAuthStore()
const toast = useToastStore()

const projectId = computed(() => route.params.id as string)
const project = computed(() => ws.getProjectById(projectId.value))
const tasks = computed(() => ws.getTasksByProject(projectId.value))

const draggedTaskId = ref<string | null>(null)
const dragOverStatus = ref<TaskStatus | null>(null)
const showTaskModal = ref(false)
const showTaskDetail = ref(false)
const selectedTaskId = ref<string | null>(null)

const selectedTask = computed(() => selectedTaskId.value ? ws.getTaskById(selectedTaskId.value) : null)

const newTask = ref({ title: '', priority: 'medium' as Priority, status: 'todo' as TaskStatus, assigneeId: '' })

function createTask() {
  if (!newTask.value.title) { toast.error('Task title is required'); return }
  ws.addTask({ projectId: projectId.value, title: newTask.value.title, priority: newTask.value.priority, status: newTask.value.status, assigneeId: newTask.value.assigneeId || null })
  toast.success('Task created!')
  newTask.value = { title: '', priority: 'medium', status: 'todo', assigneeId: '' }
  showTaskModal.value = false
}

function onDragStart(e: DragEvent, taskId: string) { draggedTaskId.value = taskId; e.dataTransfer?.setData('text/plain', taskId) }
function onDragOver(e: DragEvent, status: TaskStatus) { e.preventDefault(); dragOverStatus.value = status }
function onDrop(e: DragEvent, status: TaskStatus) {
  e.preventDefault()
  const taskId = draggedTaskId.value || e.dataTransfer?.getData('text/plain')
  if (taskId) { ws.updateTaskStatus(taskId, status); toast.success(`Moved to ${statusLabels[status]}`) }
  draggedTaskId.value = null; dragOverStatus.value = null
}

function openTaskDetail(taskId: string) { selectedTaskId.value = taskId; showTaskDetail.value = true }
function closeTaskDetail() { showTaskDetail.value = false; selectedTaskId.value = null }

function toggleSubtask(taskId: string, subtaskId: string) {
  const task = ws.getTaskById(taskId)
  if (!task) return
  const sub = task.subtasks.find(s => s.id === subtaskId)
  if (sub) sub.done = !sub.done
}

function addComment() {
  if (!commentText.value.trim() || !selectedTask.value) return
  selectedTask.value.comments.push({
    id: 'c-' + Date.now(),
    userId: auth.currentUser!.id,
    text: commentText.value,
    createdAt: new Date().toISOString(),
    reactions: {},
  })
  commentText.value = ''
  toast.success('Comment added')
}

const commentText = ref('')
const newSubtaskText = ref('')

function addSubtask() {
  if (!newSubtaskText.value.trim() || !selectedTask.value) return
  selectedTask.value.subtasks.push({ id: 's-' + Date.now(), title: newSubtaskText.value, done: false })
  newSubtaskText.value = ''
}

const projectStats = computed(() => ({
  total: tasks.value.length,
  done: tasks.value.filter(t => t.status === 'done').length,
  inProgress: tasks.value.filter(t => t.status === 'in-progress').length,
  overdue: tasks.value.filter(t => daysUntil(t.dueDate) < 0 && t.status !== 'done').length,
}))

function tasksByStatus(status: TaskStatus) { return tasks.value.filter(t => t.status === status) }
</script>

<template>
  <div class="project-detail" v-if="project">
    <!-- Project header -->
    <div class="pd-header">
      <div class="pd-header-left">
        <button class="back-btn" @click="router.push('/app/projects')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="pd-icon" :style="{ background: project.color + '22', color: project.color }">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <h1>{{ project.name }}</h1>
          <p>{{ project.description }}</p>
        </div>
      </div>
      <TfButton @click="showTaskModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Task
      </TfButton>
    </div>

    <!-- Stats -->
    <div class="pd-stats">
      <div class="pd-stat"><span class="pd-stat-value">{{ projectStats.total }}</span><span class="pd-stat-label">Total Tasks</span></div>
      <div class="pd-stat"><span class="pd-stat-value">{{ projectStats.done }}</span><span class="pd-stat-label">Completed</span></div>
      <div class="pd-stat"><span class="pd-stat-value">{{ projectStats.inProgress }}</span><span class="pd-stat-label">In Progress</span></div>
      <div class="pd-stat"><span class="pd-stat-value" :class="{ overdue: projectStats.overdue > 0 }">{{ projectStats.overdue }}</span><span class="pd-stat-label">Overdue</span></div>
    </div>

    <!-- Milestones -->
    <div v-if="project.milestones.length" class="milestones card">
      <h3>Milestones</h3>
      <div class="ms-list">
        <div v-for="m in project.milestones" :key="m.id" class="ms-item">
          <div class="ms-check" :class="{ done: m.done }">
            <svg v-if="m.done" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="ms-title" :class="{ done: m.done }">{{ m.title }}</span>
          <span class="ms-date">{{ formatDate(m.date) }}</span>
        </div>
      </div>
    </div>

    <!-- Kanban -->
    <div class="kanban-board">
      <div v-for="col in kanbanColumns" :key="col" class="kanban-col" :class="{ 'drag-over': dragOverStatus === col }" @dragover="onDragOver($event, col)" @drop="onDrop($event, col)">
        <div class="kanban-col-header">
          <span class="col-dot" :style="{ background: statusColors[col] }" />
          <span class="col-name">{{ statusLabels[col] }}</span>
          <span class="col-count">{{ tasksByStatus(col).length }}</span>
        </div>
        <div class="kanban-cards">
          <div v-for="task in tasksByStatus(col)" :key="task.id" class="kanban-card" draggable="true" @dragstart="onDragStart($event, task.id)" @click="openTaskDetail(task.id)">
            <div class="kc-top">
              <span class="kc-priority" :style="{ background: priorityColors[task.priority] }" />
              <PriorityBadge :priority="task.priority" />
            </div>
            <p class="kc-title">{{ task.title }}</p>
            <div v-if="task.labels.length" class="kc-labels">
              <LabelTag v-for="l in task.labels.slice(0, 3)" :key="l" :label="l" />
            </div>
            <div class="kc-footer">
              <div class="kc-subtasks" v-if="task.subtasks.length">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                {{ task.subtasks.filter(s => s.done).length }}/{{ task.subtasks.length }}
              </div>
              <span class="kc-due" :class="{ overdue: daysUntil(task.dueDate) < 0 }">{{ formatDate(task.dueDate) }}</span>
              <Avatar v-if="task.assigneeId" :user-id="task.assigneeId" size="xs" />
            </div>
          </div>
          <div v-if="tasksByStatus(col).length === 0" class="kanban-empty">No tasks</div>
        </div>
      </div>
    </div>

    <!-- Create task modal -->
    <BaseModal v-model="showTaskModal" title="Create New Task" width="480px">
      <div class="form">
        <div class="field">
          <label>Task Title</label>
          <input v-model="newTask.title" type="text" placeholder="e.g. Design the login page" @keyup.enter="createTask" />
        </div>
        <div class="form-row">
          <div class="field">
            <label>Priority</label>
            <select v-model="newTask.priority" class="field-select">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
          </div>
          <div class="field">
            <label>Status</label>
            <select v-model="newTask.status" class="field-select">
              <option v-for="col in kanbanColumns" :key="col" :value="col">{{ statusLabels[col] }}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Assignee</label>
          <select v-model="newTask.assigneeId" class="field-select">
            <option value="">Unassigned</option>
            <option v-for="u in auth.allUsers" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </div>
      </div>
      <template #footer>
        <TfButton variant="ghost" @click="showTaskModal = false">Cancel</TfButton>
        <TfButton @click="createTask">Create Task</TfButton>
      </template>
    </BaseModal>

    <!-- Task detail drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showTaskDetail && selectedTask" class="drawer-overlay" @click.self="closeTaskDetail">
          <Transition name="slide" appear>
            <div v-if="showTaskDetail" class="task-drawer">
              <div class="drawer-header">
                <div class="dh-top">
                  <span class="status-pill" :style="{ background: statusColors[selectedTask.status] + '22', color: statusColors[selectedTask.status] }">{{ statusLabels[selectedTask.status] }}</span>
                  <PriorityBadge :priority="selectedTask.priority" size="md" />
                </div>
                <h2>{{ selectedTask.title }}</h2>
                <p class="dh-desc">{{ selectedTask.description }}</p>
                <button class="drawer-close" @click="closeTaskDetail">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div class="drawer-body">
                <!-- Meta -->
                <div class="detail-meta">
                  <div class="meta-item">
                    <span class="meta-label">Assignee</span>
                    <div class="meta-value"><Avatar v-if="selectedTask.assigneeId" :user-id="selectedTask.assigneeId" size="xs" />{{ selectedTask.assigneeId ? auth.getUserById(selectedTask.assigneeId)?.name : 'Unassigned' }}</div>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Due Date</span>
                    <span class="meta-value" :class="{ overdue: daysUntil(selectedTask.dueDate) < 0 }">{{ formatDate(selectedTask.dueDate) }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Time Estimate</span>
                    <span class="meta-value">{{ selectedTask.timeEstimate }}h</span>
                  </div>
                </div>

                <!-- Labels -->
                <div v-if="selectedTask.labels.length" class="detail-section">
                  <h4>Labels</h4>
                  <div class="labels-row"><LabelTag v-for="l in selectedTask.labels" :key="l" :label="l" /></div>
                </div>

                <!-- Subtasks -->
                <div class="detail-section">
                  <h4>Subtasks ({{ selectedTask.subtasks.filter(s => s.done).length }}/{{ selectedTask.subtasks.length }})</h4>
                  <div class="subtask-list">
                    <label v-for="sub in selectedTask.subtasks" :key="sub.id" class="subtask-item">
                      <input type="checkbox" :checked="sub.done" @change="toggleSubtask(selectedTask.id, sub.id)" />
                      <span :class="{ done: sub.done }">{{ sub.title }}</span>
                    </label>
                  </div>
                  <div class="add-subtask">
                    <input v-model="newSubtaskText" type="text" placeholder="Add subtask..." @keyup.enter="addSubtask" />
                    <button @click="addSubtask">Add</button>
                  </div>
                </div>

                <!-- Comments -->
                <div class="detail-section">
                  <h4>Comments ({{ selectedTask.comments.length }})</h4>
                  <div class="comment-list">
                    <div v-for="c in selectedTask.comments" :key="c.id" class="comment-item">
                      <Avatar :user-id="c.userId" size="sm" />
                      <div class="comment-body">
                        <div class="comment-header">
                          <span class="comment-author">{{ auth.getUserById(c.userId)?.name }}</span>
                          <span class="comment-time">{{ formatDate(c.createdAt) }}</span>
                        </div>
                        <p>{{ c.text }}</p>
                      </div>
                    </div>
                    <div v-if="selectedTask.comments.length === 0" class="empty-mini">No comments yet</div>
                  </div>
                  <div class="add-comment">
                    <Avatar :initials="auth.initials" size="sm" />
                    <input v-model="commentText" type="text" placeholder="Write a comment..." @keyup.enter="addComment" />
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
  <div v-else class="not-found">
    <h2>Project not found</h2>
    <TfButton @click="router.push('/app/projects')">Back to Projects</TfButton>
  </div>
</template>

<style scoped>
.pd-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 16px; }
.pd-header-left { display: flex; align-items: flex-start; gap: 14px; }
.back-btn { width: 36px; height: 36px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: 1px solid var(--border-color); flex-shrink: 0; }
.back-btn:hover { background: var(--bg-hover); }
.pd-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pd-header h1 { font-size: 1.4rem; margin-bottom: 4px; }
.pd-header p { font-size: 0.88rem; color: var(--text-secondary); }

.pd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.pd-stat { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px 20px; display: flex; flex-direction: column; }
.pd-stat-value { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
.pd-stat-value.overdue { color: var(--error-500); }
.pd-stat-label { font-size: 0.78rem; color: var(--text-muted); }

.milestones { padding: 20px 24px; margin-bottom: 24px; }
.milestones h3 { font-size: 0.95rem; margin-bottom: 16px; }
.ms-list { display: flex; gap: 24px; flex-wrap: wrap; }
.ms-item { display: flex; align-items: center; gap: 10px; }
.ms-check { width: 20px; height: 20px; border-radius: 6px; border: 2px solid var(--border-strong); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ms-check.done { background: var(--success-500); border-color: var(--success-500); }
.ms-title.done { text-decoration: line-through; color: var(--text-muted); }
.ms-title { font-size: 0.85rem; font-weight: 500; }
.ms-date { font-size: 0.75rem; color: var(--text-muted); }

/* Kanban */
.kanban-board { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.kanban-col { background: var(--bg-surface-2); border-radius: var(--radius-lg); padding: 14px; border: 1px solid var(--border-color); min-height: 200px; transition: border-color 0.15s; }
.kanban-col.drag-over { border-color: var(--brand-400); background: var(--brand-50); }
.kanban-col-header { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding: 0 4px; }
.col-dot { width: 8px; height: 8px; border-radius: 50%; }
.col-name { font-size: 0.82rem; font-weight: 700; flex: 1; }
.col-count { font-size: 0.72rem; color: var(--text-muted); background: var(--bg-surface); padding: 1px 8px; border-radius: 10px; }
.kanban-cards { display: flex; flex-direction: column; gap: 10px; }
.kanban-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; cursor: pointer; transition: all 0.15s; }
.kanban-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.kc-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.kc-priority { width: 4px; height: 14px; border-radius: 2px; }
.kc-title { font-size: 0.85rem; font-weight: 500; margin-bottom: 10px; line-height: 1.4; }
.kc-labels { display: flex; gap: 4px; margin-bottom: 10px; flex-wrap: wrap; }
.kc-footer { display: flex; align-items: center; gap: 8px; }
.kc-subtasks { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: var(--text-muted); }
.kc-due { font-size: 0.7rem; color: var(--text-muted); margin-left: auto; }
.kc-due.overdue { color: var(--error-500); }
.kanban-empty { text-align: center; padding: 24px 0; color: var(--text-muted); font-size: 0.78rem; }

/* Drawer */
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: var(--z-modal); display: flex; justify-content: flex-end; }
.task-drawer { width: 100%; max-width: 480px; background: var(--bg-surface); border-left: 1px solid var(--border-color); overflow-y: auto; animation: slideInRight 0.25s ease both; }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
.drawer-header { padding: 24px; border-bottom: 1px solid var(--border-color); position: relative; }
.dh-top { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.drawer-header h2 { font-size: 1.3rem; margin-bottom: 8px; padding-right: 30px; }
.dh-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; }
.drawer-close { position: absolute; top: 24px; right: 24px; color: var(--text-muted); display: flex; }
.drawer-close:hover { color: var(--text-primary); }
.status-pill { font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; }

.drawer-body { padding: 24px; }
.detail-meta { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
.meta-item { display: flex; justify-content: space-between; align-items: center; }
.meta-label { font-size: 0.8rem; color: var(--text-muted); }
.meta-value { font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.meta-value.overdue { color: var(--error-500); }

.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 0.85rem; margin-bottom: 12px; }
.labels-row { display: flex; gap: 6px; flex-wrap: wrap; }

.subtask-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.subtask-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; cursor: pointer; }
.subtask-item input { accent-color: var(--brand-500); }
.subtask-item span.done { text-decoration: line-through; color: var(--text-muted); }
.add-subtask { display: flex; gap: 8px; }
.add-subtask input { flex: 1; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-surface-2); font-size: 0.82rem; outline: none; }
.add-subtask input:focus { border-color: var(--brand-500); }
.add-subtask button { padding: 8px 16px; border-radius: var(--radius-sm); background: var(--brand-500); color: white; font-size: 0.8rem; font-weight: 600; }

.comment-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
.comment-item { display: flex; gap: 12px; }
.comment-body { flex: 1; }
.comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.comment-author { font-size: 0.82rem; font-weight: 600; }
.comment-time { font-size: 0.72rem; color: var(--text-muted); }
.comment-body p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
.empty-mini { font-size: 0.82rem; color: var(--text-muted); text-align: center; padding: 16px; }
.add-comment { display: flex; gap: 10px; align-items: center; }
.add-comment input { flex: 1; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-2); font-size: 0.85rem; outline: none; }
.add-comment input:focus { border-color: var(--brand-500); }

.form .field { margin-bottom: 18px; }
.form-row { display: flex; gap: 12px; }
.form-row .field { flex: 1; }
.field label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; }
.field input, .field textarea, .field-select { width: 100%; padding: 11px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-2); color: var(--text-primary); outline: none; }
.field input:focus, .field-select:focus { border-color: var(--brand-500); }
.field input::placeholder { color: var(--text-muted); }

.not-found { text-align: center; padding: 80px 20px; }
.not-found h2 { margin-bottom: 16px; }

@media (max-width: 1100px) { .kanban-board { grid-template-columns: repeat(3, 1fr); } .pd-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 700px) { .kanban-board { grid-template-columns: 1fr; } .ms-list { flex-direction: column; gap: 12px; } }
</style>
