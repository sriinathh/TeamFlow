<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/ui/Avatar.vue'
import PriorityBadge from '../components/ui/PriorityBadge.vue'
import LabelTag from '../components/ui/LabelTag.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import TfButton from '../components/ui/TfButton.vue'
import { formatDate, daysUntil, statusColors, statusLabels, kanbanColumns, priorityColors } from '../utils'
import type { TaskStatus, Priority, Task } from '../types'

const ws = useWorkspaceStore()
const toast = useToastStore()
const router = useRouter()

type ViewMode = 'kanban' | 'list' | 'calendar' | 'timeline' | 'table'
const viewMode = ref<ViewMode>('kanban')
const showCreateModal = ref(false)
const selectedStatus = ref<TaskStatus | 'all'>('all')
const selectedPriority = ref<Priority | 'all'>('all')

const newProject = ref({ name: '', description: '', priority: 'medium' as Priority })

const filteredProjects = computed(() => ws.workspaceProjects)

const filteredTasks = computed(() => {
  let tasks = ws.workspaceTasks
  if (selectedStatus.value !== 'all') tasks = tasks.filter(t => t.status === selectedStatus.value)
  if (selectedPriority.value !== 'all') tasks = tasks.filter(t => t.priority === selectedPriority.value)
  return tasks
})

const tasksByStatus = (status: TaskStatus) => filteredTasks.value.filter(t => t.status === status)

function createProject() {
  if (!newProject.value.name) { toast.error('Project name is required'); return }
  const p = ws.addProject({ name: newProject.value.name, description: newProject.value.description, priority: newProject.value.priority })
  toast.success(`Project "${p.name}" created!`)
  newProject.value = { name: '', description: '', priority: 'medium' }
  showCreateModal.value = false
  router.push('/app/projects/' + p.id)
}

// Drag and drop
const draggedTaskId = ref<string | null>(null)
const dragOverStatus = ref<TaskStatus | null>(null)

function onDragStart(e: DragEvent, taskId: string) {
  draggedTaskId.value = taskId
  e.dataTransfer?.setData('text/plain', taskId)
}

function onDragOver(e: DragEvent, status: TaskStatus) {
  e.preventDefault()
  dragOverStatus.value = status
}

function onDrop(e: DragEvent, status: TaskStatus) {
  e.preventDefault()
  const taskId = draggedTaskId.value || e.dataTransfer?.getData('text/plain')
  if (taskId) {
    const task = ws.getTaskById(taskId)
    if (task && task.status !== status) {
      ws.updateTaskStatus(taskId, status)
      toast.success(`Moved to ${statusLabels[status]}`)
    }
  }
  draggedTaskId.value = null
  dragOverStatus.value = null
}

const viewModes: { mode: ViewMode; label: string; icon: string }[] = [
  { mode: 'kanban', label: 'Kanban', icon: 'M3 3h18v18H3z M9 3v18 M15 3v18' },
  { mode: 'list', label: 'List', icon: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01' },
  { mode: 'calendar', label: 'Calendar', icon: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15' },
  { mode: 'timeline', label: 'Timeline', icon: 'M12 2v20 M2 7l10-5 10 5 M2 17l10 5 10-5' },
  { mode: 'table', label: 'Table', icon: 'M3 9h18 M3 15h18 M9 3v18 M15 3v18 M3 3h18v18H3z' },
]

// Calendar view
const calendarDays = computed(() => {
  const tasks = filteredTasks.value
  const byDate: Record<string, Task[]> = {}
  tasks.forEach(t => {
    if (t.dueDate) {
      if (!byDate[t.dueDate]) byDate[t.dueDate] = []
      byDate[t.dueDate].push(t)
    }
  })
  return byDate
})

const currentMonth = ref(new Date())
const calendarGrid = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const days: { date: string; day: number; current: boolean }[] = []
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(year, month, -startWeekday + i + 1)
    days.push({ date: d.toISOString().split('T')[0], day: d.getDate(), current: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i)
    days.push({ date: d.toISOString().split('T')[0], day: i, current: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    days.push({ date: d.toISOString().split('T')[0], day: d.getDate(), current: false })
  }
  return days
})

function prevMonth() { currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1) }
function nextMonth() { currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1) }

const projectColors: Record<string, string> = {
  planning: 'var(--brand-500)', active: 'var(--success-500)', 'on-hold': 'var(--warning-500)', completed: 'var(--text-muted)',
}

function progressPercent(task: Task) {
  const sub = task.subtasks
  if (sub.length === 0) return task.status === 'done' ? 100 : 0
  return Math.round((sub.filter(s => s.done).length / sub.length) * 100)
}
</script>

<template>
  <div class="projects-page">
    <div class="page-header">
      <div>
        <h1>Projects</h1>
        <p class="page-subtitle">{{ filteredProjects.length }} projects in {{ ws.currentWorkspace?.name }}</p>
      </div>
      <TfButton @click="showCreateModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Project
      </TfButton>
    </div>

    <!-- Project cards strip -->
    <div class="project-strip">
      <div v-for="p in filteredProjects" :key="p.id" class="project-strip-card card card-hover" @click="router.push('/app/projects/' + p.id)">
        <div class="psc-top">
          <div class="psc-icon" :style="{ background: p.color + '22', color: p.color }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
          </div>
          <span class="psc-status" :style="{ color: projectColors[p.status], background: projectColors[p.status] + '22' }">{{ p.status }}</span>
        </div>
        <h3 class="psc-name">{{ p.name }}</h3>
        <p class="psc-desc">{{ p.description }}</p>
        <div class="psc-progress">
          <div class="progress-bar"><div class="progress-fill" :style="{ width: p.progress + '%', background: p.color }" /></div>
          <span>{{ p.progress }}%</span>
        </div>
        <div class="psc-footer">
          <div class="psc-members">
            <Avatar v-for="mid in p.members.slice(0, 3)" :key="mid" :user-id="mid" size="xs" />
          </div>
          <span class="psc-deadline">{{ formatDate(p.deadline) }}</span>
        </div>
      </div>
    </div>

    <!-- View toggle and filters -->
    <div class="toolbar">
      <div class="view-toggle">
        <button v-for="vm in viewModes" :key="vm.mode" class="view-btn" :class="{ active: viewMode === vm.mode }" @click="viewMode = vm.mode">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="vm.icon" /></svg>
          <span>{{ vm.label }}</span>
        </button>
      </div>
      <div class="filters">
        <select v-model="selectedStatus" class="filter-select">
          <option value="all">All Status</option>
          <option v-for="col in kanbanColumns" :key="col" :value="col">{{ statusLabels[col] }}</option>
        </select>
        <select v-model="selectedPriority" class="filter-select">
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="kanban-board">
      <div v-for="col in kanbanColumns" :key="col" class="kanban-col" :class="{ 'drag-over': dragOverStatus === col }" @dragover="onDragOver($event, col)" @drop="onDrop($event, col)">
        <div class="kanban-col-header">
          <span class="col-dot" :style="{ background: statusColors[col] }" />
          <span class="col-name">{{ statusLabels[col] }}</span>
          <span class="col-count">{{ tasksByStatus(col).length }}</span>
        </div>
        <div class="kanban-cards">
          <div v-for="task in tasksByStatus(col)" :key="task.id" class="kanban-card" draggable="true" @dragstart="onDragStart($event, task.id)" @click="router.push('/app/projects/' + task.projectId)">
            <div class="kc-top">
              <span class="kc-priority" :style="{ background: priorityColors[task.priority] }" />
              <span class="kc-project">{{ ws.getProjectById(task.projectId)?.name }}</span>
            </div>
            <p class="kc-title">{{ task.title }}</p>
            <div v-if="task.labels.length" class="kc-labels">
              <LabelTag v-for="l in task.labels.slice(0, 2)" :key="l" :label="l" />
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
          <div v-if="tasksByStatus(col).length === 0" class="kanban-empty">Drop tasks here</div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="card list-view">
      <div class="list-header">
        <span class="lh-title">Task</span>
        <span class="lh-project">Project</span>
        <span class="lh-status">Status</span>
        <span class="lh-priority">Priority</span>
        <span class="lh-assignee">Assignee</span>
        <span class="lh-due">Due Date</span>
      </div>
      <div v-for="task in filteredTasks" :key="task.id" class="list-row" @click="router.push('/app/projects/' + task.projectId)">
        <span class="lr-title">
          <span class="status-dot" :style="{ background: statusColors[task.status] }" />
          {{ task.title }}
        </span>
        <span class="lr-project">{{ ws.getProjectById(task.projectId)?.name }}</span>
        <span class="lr-status"><span class="status-pill" :style="{ background: statusColors[task.status] + '22', color: statusColors[task.status] }">{{ statusLabels[task.status] }}</span></span>
        <span class="lr-priority"><PriorityBadge :priority="task.priority" /></span>
        <span class="lr-assignee"><Avatar v-if="task.assigneeId" :user-id="task.assigneeId" size="xs" />{{ task.assigneeId ? ws.getProjectById(task.projectId) && '' : 'Unassigned' }}</span>
        <span class="lr-due" :class="{ overdue: daysUntil(task.dueDate) < 0 }">{{ formatDate(task.dueDate) }}</span>
      </div>
      <div v-if="filteredTasks.length === 0" class="empty-state">No tasks found</div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="card calendar-view">
      <div class="calendar-header">
        <h3>{{ currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' }) }}</h3>
        <div class="cal-nav">
          <button @click="prevMonth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
          <button @click="nextMonth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
        </div>
      </div>
      <div class="cal-weekdays">
        <span v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</span>
      </div>
      <div class="cal-grid">
        <div v-for="day in calendarGrid" :key="day.date" class="cal-day" :class="{ disabled: !day.current, today: day.date === new Date().toISOString().split('T')[0] }">
          <span class="cal-day-num">{{ day.day }}</span>
          <div class="cal-events">
            <div v-for="task in (calendarDays[day.date] || [])" :key="task.id" class="cal-event" :style="{ background: statusColors[task.status] + '22', color: statusColors[task.status], borderLeft: `3px solid ${statusColors[task.status]}` }" @click="router.push('/app/projects/' + task.projectId)">
              {{ task.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline View -->
    <div v-if="viewMode === 'timeline'" class="card timeline-view">
      <div v-for="p in filteredProjects" :key="p.id" class="timeline-row">
        <div class="tl-project">
          <div class="tl-icon" :style="{ background: p.color + '22', color: p.color }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <span class="tl-name">{{ p.name }}</span>
            <span class="tl-dates">{{ formatDate(p.createdAt) }} → {{ formatDate(p.deadline) }}</span>
          </div>
        </div>
        <div class="tl-bar-track">
          <div class="tl-bar" :style="{ width: p.progress + '%', background: p.color }" />
        </div>
        <span class="tl-progress">{{ p.progress }}%</span>
      </div>
      <div v-if="filteredProjects.length === 0" class="empty-state">No projects to display</div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="card table-view">
      <table>
        <thead>
          <tr>
            <th>Task</th><th>Project</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Due Date</th><th>Progress</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id" @click="router.push('/app/projects/' + task.projectId)">
            <td class="tv-task">{{ task.title }}</td>
            <td class="tv-project">{{ ws.getProjectById(task.projectId)?.name }}</td>
            <td><span class="status-pill" :style="{ background: statusColors[task.status] + '22', color: statusColors[task.status] }">{{ statusLabels[task.status] }}</span></td>
            <td><PriorityBadge :priority="task.priority" /></td>
            <td><div class="tv-assignee"><Avatar v-if="task.assigneeId" :user-id="task.assigneeId" size="xs" /></div></td>
            <td :class="{ overdue: daysUntil(task.dueDate) < 0 }">{{ formatDate(task.dueDate) }}</td>
            <td>
              <div class="tv-progress">
                <div class="progress-bar sm"><div class="progress-fill" :style="{ width: progressPercent(task) + '%' }" /></div>
                <span>{{ progressPercent(task) }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredTasks.length === 0" class="empty-state">No tasks found</div>
    </div>

    <!-- Create project modal -->
    <BaseModal v-model="showCreateModal" title="Create New Project" width="480px">
      <div class="form">
        <div class="field">
          <label>Project Name</label>
          <input v-model="newProject.name" type="text" placeholder="e.g. Mobile App Launch" />
        </div>
        <div class="field">
          <label>Description</label>
          <textarea v-model="newProject.description" rows="3" placeholder="Brief project description..." />
        </div>
        <div class="field">
          <label>Priority</label>
          <select v-model="newProject.priority" class="filter-select" style="width: 100%;">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <template #footer>
        <TfButton variant="ghost" @click="showCreateModal = false">Cancel</TfButton>
        <TfButton @click="createProject">Create Project</TfButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }

.project-strip { display: flex; gap: 16px; overflow-x: auto; margin-bottom: 24px; padding-bottom: 8px; }
.project-strip-card { padding: 20px; min-width: 260px; cursor: pointer; flex-shrink: 0; }
.psc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.psc-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.psc-status { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; }
.psc-name { font-size: 1rem; margin-bottom: 6px; }
.psc-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.psc-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.progress-bar { flex: 1; height: 6px; background: var(--bg-surface-2); border-radius: 3px; overflow: hidden; }
.progress-bar.sm { height: 5px; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.psc-progress span { font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); }
.psc-footer { display: flex; justify-content: space-between; align-items: center; }
.psc-members { display: flex; }
.psc-deadline { font-size: 0.72rem; color: var(--text-muted); }

.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.view-toggle { display: flex; gap: 2px; background: var(--bg-surface-2); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-color); }
.view-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); transition: all 0.15s; }
.view-btn.active { background: var(--bg-surface); color: var(--brand-600); box-shadow: var(--shadow-sm); }
.filters { display: flex; gap: 8px; }
.filter-select { padding: 8px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-primary); font-size: 0.82rem; outline: none; }
.filter-select:focus { border-color: var(--brand-500); }

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
.kanban-card:active { cursor: grabbing; }
.kc-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.kc-priority { width: 4px; height: 14px; border-radius: 2px; }
.kc-project { font-size: 0.7rem; color: var(--text-muted); font-weight: 500; }
.kc-title { font-size: 0.85rem; font-weight: 500; margin-bottom: 10px; line-height: 1.4; }
.kc-labels { display: flex; gap: 4px; margin-bottom: 10px; flex-wrap: wrap; }
.kc-footer { display: flex; align-items: center; gap: 8px; }
.kc-subtasks { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: var(--text-muted); }
.kc-due { font-size: 0.7rem; color: var(--text-muted); margin-left: auto; }
.kc-due.overdue { color: var(--error-500); }
.kanban-empty { text-align: center; padding: 24px 0; color: var(--text-muted); font-size: 0.78rem; }

/* List view */
.list-view { padding: 0; overflow: hidden; }
.list-header, .list-row { display: grid; grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr 1fr; padding: 14px 20px; align-items: center; gap: 12px; }
.list-header { border-bottom: 1px solid var(--border-color); font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.04em; }
.list-row { border-bottom: 1px solid var(--border-color); cursor: pointer; font-size: 0.85rem; transition: background 0.1s; }
.list-row:hover { background: var(--bg-hover); }
.lh-title, .lr-title { font-size: 0.85rem; }
.lr-title { display: flex; align-items: center; gap: 8px; font-weight: 500; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lr-project, .lh-project { color: var(--text-muted); font-size: 0.8rem; }
.status-pill { font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.lr-assignee { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted); }
.lr-due, .lh-due { font-size: 0.8rem; color: var(--text-muted); }
.lr-due.overdue { color: var(--error-500); }

/* Calendar */
.calendar-view { padding: 24px; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cal-nav { display: flex; gap: 4px; }
.cal-nav button { width: 32px; height: 32px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: 1px solid var(--border-color); }
.cal-nav button:hover { background: var(--bg-hover); }
.cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8px; }
.cal-weekdays span { text-align: center; font-size: 0.74rem; font-weight: 700; color: var(--text-muted); padding: 8px 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-day { min-height: 100px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 6px; background: var(--bg-surface); }
.cal-day.disabled { opacity: 0.4; }
.cal-day.today { border-color: var(--brand-500); background: var(--brand-50); }
.cal-day-num { font-size: 0.76rem; font-weight: 600; display: block; margin-bottom: 4px; }
.cal-events { display: flex; flex-direction: column; gap: 3px; }
.cal-event { font-size: 0.68rem; padding: 3px 6px; border-radius: 4px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Timeline */
.timeline-view { padding: 24px; }
.timeline-row { display: flex; align-items: center; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border-color); }
.tl-project { display: flex; align-items: center; gap: 10px; width: 220px; flex-shrink: 0; }
.tl-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.tl-name { font-size: 0.85rem; font-weight: 600; display: block; }
.tl-dates { font-size: 0.72rem; color: var(--text-muted); }
.tl-bar-track { flex: 1; height: 10px; background: var(--bg-surface-2); border-radius: 5px; overflow: hidden; }
.tl-bar { height: 100%; border-radius: 5px; transition: width 0.3s; }
.tl-progress { font-size: 0.78rem; font-weight: 600; width: 44px; text-align: right; }

/* Table */
.table-view { padding: 0; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 14px 20px; font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); letter-spacing: 0.04em; }
td { padding: 14px 20px; border-bottom: 1px solid var(--border-color); font-size: 0.85rem; }
tr { cursor: pointer; transition: background 0.1s; }
tr:hover td { background: var(--bg-hover); }
.tv-task { font-weight: 500; }
.tv-project { color: var(--text-muted); font-size: 0.8rem; }
.tv-assignee { display: flex; }
.tv-progress { display: flex; align-items: center; gap: 8px; }
.tv-progress .progress-bar { width: 60px; }
.tv-progress span { font-size: 0.74rem; color: var(--text-muted); }
td.overdue { color: var(--error-500); }

.empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem; }

.form .field { margin-bottom: 18px; }
.field label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; }
.field input, .field textarea { width: 100%; padding: 11px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-2); color: var(--text-primary); outline: none; resize: vertical; }
.field input:focus, .field textarea:focus { border-color: var(--brand-500); }
.field input::placeholder, .field textarea::placeholder { color: var(--text-muted); }

@media (max-width: 1100px) { .kanban-board { grid-template-columns: repeat(3, 1fr); } .cal-day { min-height: 80px; } }
@media (max-width: 700px) {
  .kanban-board { grid-template-columns: 1fr; }
  .view-btn span { display: none; }
  .project-strip-card { min-width: 220px; }
  .list-header, .list-row { grid-template-columns: 2fr 1fr 1fr; }
  .lh-priority, .lr-priority, .lh-assignee, .lr-assignee, .lh-due, .lr-due { display: none; }
}
</style>
