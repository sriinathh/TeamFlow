<script setup lang="ts">
import { computed } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import Avatar from '../components/ui/Avatar.vue'
import PriorityBadge from '../components/ui/PriorityBadge.vue'
import { formatDate, daysUntil, statusColors } from '../utils'
import { useRouter } from 'vue-router'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const ws = useWorkspaceStore()
const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

const myTasks = computed(() =>
  ws.workspaceTasks.filter((t) => t.assigneeId === auth.currentUser?.id)
)

const upcomingMeetings = computed(() =>
  ws.workspaceMeetings.filter((m) => m.status === 'upcoming').slice(0, 3)
)

const activeProjects = computed(() =>
  ws.workspaceProjects.filter((p) => p.status === 'active')
)

const completedTasks = computed(() =>
  ws.workspaceTasks.filter((t) => t.status === 'done').length
)
const pendingTasks = computed(() =>
  ws.workspaceTasks.filter((t) => t.status !== 'done').length
)

const chartTextColor = computed(() => theme.isDark ? '#94a3b8' : '#475569')
const chartGridColor = computed(() => theme.isDark ? '#232a3a' : '#e2e8f0')

const productivityData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Tasks Completed',
    data: [5, 8, 6, 10, 9, 3, 4],
    borderColor: '#3b82f6',
    backgroundColor: (ctx: any) => {
      const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(59,130,246,0.2)')
      gradient.addColorStop(1, 'rgba(59,130,246,0)')
      return gradient
    },
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#3b82f6',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
  }],
}))

const taskDistData = computed(() => ({
  labels: ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'],
  datasets: [{
    data: [
      ws.workspaceTasks.filter(t => t.status === 'backlog').length,
      ws.workspaceTasks.filter(t => t.status === 'todo').length,
      ws.workspaceTasks.filter(t => t.status === 'in-progress').length,
      ws.workspaceTasks.filter(t => t.status === 'review').length,
      ws.workspaceTasks.filter(t => t.status === 'done').length,
    ],
    backgroundColor: ['#94a3b8', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'],
    borderWidth: 0,
  }],
}))

const weeklyHoursData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Hours',
    data: [7.5, 8, 6.5, 8.5, 7, 2, 1],
    backgroundColor: '#6366f1',
    borderRadius: 6,
    barThickness: 28,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: chartTextColor.value }, grid: { display: false } },
    y: { ticks: { color: chartTextColor.value }, grid: { color: chartGridColor.value }, beginAtZero: true },
  },
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: { legend: { position: 'bottom' as const, labels: { color: chartTextColor.value, padding: 16, usePointStyle: true, pointStyle: 'circle' as const } } },
}

const cards = computed(() => [
  { label: 'My Tasks', value: myTasks.value.length, icon: 'check', color: 'var(--brand-500)', bg: 'var(--brand-50)' },
  { label: 'Today\'s Meetings', value: upcomingMeetings.value.length, icon: 'video', color: 'var(--accent-500)', bg: 'var(--brand-50)' },
  { label: 'Completed', value: completedTasks.value, icon: 'trophy', color: 'var(--success-500)', bg: 'var(--success-50)' },
  { label: 'Pending', value: pendingTasks.value, icon: 'clock', color: 'var(--warning-500)', bg: 'var(--warning-50)' },
])

const iconPaths: Record<string, string> = {
  check: 'M20 6L9 17l-5-5',
  video: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z',
  trophy: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
}
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1>Welcome back, {{ auth.currentUser?.name?.split(' ')[0] }}</h1>
        <p class="page-subtitle">Here's what's happening in {{ ws.currentWorkspace?.name }} today.</p>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stat-cards">
      <div v-for="card in cards" :key="card.label" class="stat-card-mini card card-hover">
        <div class="sc-icon" :style="{ background: card.bg, color: card.color }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="iconPaths[card.icon]" /></svg>
        </div>
        <div class="sc-info">
          <span class="sc-value">{{ card.value }}</span>
          <span class="sc-label">{{ card.label }}</span>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="charts-row">
      <div class="card chart-card lg">
        <div class="card-header">
          <h3>Weekly Productivity</h3>
          <span class="chart-badge">+12% vs last week</span>
        </div>
        <div class="chart-wrap">
          <Line :data="productivityData" :options="chartOptions" />
        </div>
      </div>
      <div class="card chart-card">
        <div class="card-header"><h3>Task Distribution</h3></div>
        <div class="chart-wrap doughnut">
          <Doughnut :data="taskDistData" :options="doughnutOptions" />
        </div>
      </div>
    </div>

    <div class="charts-row">
      <div class="card chart-card">
        <div class="card-header"><h3>Time Tracking (Hours)</h3></div>
        <div class="chart-wrap">
          <Bar :data="weeklyHoursData" :options="chartOptions" />
        </div>
      </div>

      <!-- My Tasks -->
      <div class="card list-card">
        <div class="card-header">
          <h3>My Tasks</h3>
          <button class="view-all" @click="router.push('/app/projects')">View all</button>
        </div>
        <div class="task-list">
          <div v-for="task in myTasks.slice(0, 5)" :key="task.id" class="task-row" @click="router.push('/app/projects/' + task.projectId)">
            <span class="task-status-dot" :style="{ background: statusColors[task.status] }" />
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-meta">{{ ws.getProjectById(task.projectId)?.name }}</span>
            </div>
            <PriorityBadge :priority="task.priority" />
            <span class="task-due" :class="{ overdue: daysUntil(task.dueDate) < 0 }">{{ formatDate(task.dueDate) }}</span>
          </div>
          <div v-if="myTasks.length === 0" class="empty-state">No tasks assigned to you</div>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="charts-row">
      <!-- Active Projects -->
      <div class="card list-card">
        <div class="card-header">
          <h3>Active Projects</h3>
          <button class="view-all" @click="router.push('/app/projects')">View all</button>
        </div>
        <div class="project-list">
          <div v-for="p in activeProjects" :key="p.id" class="project-row" @click="router.push('/app/projects/' + p.id)">
            <div class="project-icon" :style="{ background: p.color + '22', color: p.color }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
            </div>
            <div class="project-info">
              <span class="project-name">{{ p.name }}</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: p.progress + '%', background: p.color }" />
              </div>
            </div>
            <span class="progress-text">{{ p.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Meetings -->
      <div class="card list-card">
        <div class="card-header">
          <h3>Upcoming Meetings</h3>
          <button class="view-all" @click="router.push('/app/meetings')">View all</button>
        </div>
        <div class="meeting-list">
          <div v-for="m in upcomingMeetings" :key="m.id" class="meeting-row">
            <div class="meeting-date">
              <span class="md-day">{{ new Date(m.date).getDate() }}</span>
              <span class="md-month">{{ new Date(m.date).toLocaleDateString('en', { month: 'short' }) }}</span>
            </div>
            <div class="meeting-info">
              <span class="meeting-title">{{ m.title }}</span>
              <span class="meeting-time">{{ m.time }} · {{ m.duration }}min</span>
            </div>
            <div class="meeting-attendees">
              <Avatar v-for="aid in m.attendees.slice(0, 3)" :key="aid" :user-id="aid" size="xs" />
              <span v-if="m.attendees.length > 3" class="extra-count">+{{ m.attendees.length - 3 }}</span>
            </div>
          </div>
          <div v-if="upcomingMeetings.length === 0" class="empty-state">No upcoming meetings</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }

.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.stat-card-mini { padding: 20px; display: flex; align-items: center; gap: 16px; }
.sc-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sc-info { display: flex; flex-direction: column; }
.sc-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
.sc-label { font-size: 0.82rem; color: var(--text-muted); }

.charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
.chart-card { padding: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-header h3 { font-size: 1rem; }
.chart-badge { font-size: 0.72rem; color: var(--success-500); font-weight: 600; background: var(--success-50); padding: 3px 10px; border-radius: 20px; }
.chart-wrap { height: 240px; }
.chart-wrap.doughnut { height: 240px; display: flex; align-items: center; justify-content: center; }

.list-card { padding: 24px; }
.view-all { font-size: 0.78rem; color: var(--brand-500); font-weight: 600; }

.task-list { display: flex; flex-direction: column; gap: 2px; }
.task-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.1s; }
.task-row:hover { background: var(--bg-hover); margin: 0 -12px; padding: 12px; border-radius: var(--radius-sm); }
.task-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.task-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.task-title { font-size: 0.85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-meta { font-size: 0.72rem; color: var(--text-muted); }
.task-due { font-size: 0.76rem; color: var(--text-muted); white-space: nowrap; }
.task-due.overdue { color: var(--error-500); }

.project-list { display: flex; flex-direction: column; gap: 16px; }
.project-row { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.project-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.project-info { flex: 1; min-width: 0; }
.project-name { font-size: 0.85rem; font-weight: 500; display: block; margin-bottom: 6px; }
.progress-bar { height: 6px; background: var(--bg-surface-2); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.progress-text { font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }

.meeting-list { display: flex; flex-direction: column; gap: 12px; }
.meeting-row { display: flex; align-items: center; gap: 14px; }
.meeting-date { display: flex; flex-direction: column; align-items: center; width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--bg-surface-2); justify-content: center; flex-shrink: 0; }
.md-day { font-size: 1.1rem; font-weight: 700; line-height: 1; }
.md-month { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; }
.meeting-info { flex: 1; min-width: 0; }
.meeting-title { font-size: 0.85rem; font-weight: 500; display: block; }
.meeting-time { font-size: 0.74rem; color: var(--text-muted); }
.meeting-attendees { display: flex; align-items: center; }
.extra-count { font-size: 0.72rem; color: var(--text-muted); margin-left: 4px; }

.empty-state { text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem; }

@media (max-width: 1100px) {
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stat-cards { grid-template-columns: 1fr; }
}
</style>
