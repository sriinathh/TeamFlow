<script setup lang="ts">
import { computed } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import Avatar from '../components/ui/Avatar.vue'
import { formatRelative } from '../utils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const ws = useWorkspaceStore()
const auth = useAuthStore()
const theme = useThemeStore()

const totalUsers = auth.allUsers.length
const totalWorkspaces = ws.workspaces.length
const totalProjects = ws.projects.length

const chartTextColor = computed(() => theme.isDark ? '#94a3b8' : '#475569')
const chartGridColor = computed(() => theme.isDark ? '#232a3a' : '#e2e8f0')

const growthData = computed(() => ({
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
  datasets: [{
    label: 'Users', data: [120, 180, 240, 320, 410, 520, 680, 850, 1020],
    borderColor: '#3b82f6', backgroundColor: (ctx: any) => {
      const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
      g.addColorStop(0, 'rgba(59,130,246,0.2)'); g.addColorStop(1, 'rgba(59,130,246,0)')
      return g
    }, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#3b82f6',
  }],
  datasets2: {
    label: 'Workspaces', data: [20, 35, 50, 68, 85, 110, 140, 170, 210],
    borderColor: '#8b5cf6', borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 3,
  },
}))

const engagementData = computed(() => ({
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
  datasets: [{
    label: 'Daily Active Users', data: [80, 120, 160, 220, 280, 360, 480, 600, 720],
    backgroundColor: '#6366f1', borderRadius: 6, barThickness: 24,
  }],
}))

const planDistData = computed(() => ({
  labels: ['Free', 'Pro', 'Enterprise'],
  datasets: [{ data: [620, 320, 80], backgroundColor: ['#94a3b8', '#3b82f6', '#8b5cf6'], borderWidth: 0 }],
}))

const chartOptions = computed(() => ({
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { x: { ticks: { color: chartTextColor.value }, grid: { display: false } }, y: { ticks: { color: chartTextColor.value }, grid: { color: chartGridColor.value }, beginAtZero: true } },
}))

const doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom' as const, labels: { color: chartTextColor.value, padding: 16, usePointStyle: true, pointStyle: 'circle' as const } } } }

const stats = computed(() => [
  { label: 'Total Users', value: totalUsers, sub: '+12% this month', icon: 'user', color: '#3b82f6' },
  { label: 'Workspaces', value: totalWorkspaces, sub: '+2 new', icon: 'ws', color: '#8b5cf6' },
  { label: 'Projects', value: totalProjects, sub: '5 active', icon: 'project', color: '#10b981' },
  { label: 'Storage Used', value: '4.2 GB', sub: 'of 50 GB', icon: 'storage', color: '#f59e0b' },
])

const iconPaths: Record<string, string> = {
  user: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  ws: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  project: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  storage: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p class="page-subtitle">Platform overview and system analytics</p>
      </div>
    </div>

    <div class="stat-cards">
      <div v-for="s in stats" :key="s.label" class="stat-card card card-hover">
        <div class="sc-icon" :style="{ background: s.color + '22', color: s.color }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="iconPaths[s.icon]" /></svg>
        </div>
        <div class="sc-info"><span class="sc-value">{{ s.value }}</span><span class="sc-label">{{ s.label }}</span><span class="sc-sub">{{ s.sub }}</span></div>
      </div>
    </div>

    <div class="charts-row">
      <div class="card chart-card lg">
        <div class="card-header"><h3>Platform Growth</h3><span class="chart-badge">+18% MoM</span></div>
        <div class="chart-wrap"><Line :data="growthData" :options="chartOptions" /></div>
      </div>
      <div class="card chart-card">
        <div class="card-header"><h3>Plan Distribution</h3></div>
        <div class="chart-wrap doughnut"><Doughnut :data="planDistData" :options="doughnutOptions" /></div>
      </div>
    </div>

    <div class="charts-row">
      <div class="card chart-card">
        <div class="card-header"><h3>User Engagement</h3></div>
        <div class="chart-wrap"><Bar :data="engagementData" :options="chartOptions" /></div>
      </div>
      <div class="card list-card">
        <div class="card-header"><h3>Recent Activity</h3></div>
        <div class="activity-list">
          <div class="activity-item" v-for="t in ws.workspaceTasks.slice(0, 6)" :key="t.id">
            <Avatar :user-id="t.assigneeId || 'u1'" size="xs" />
            <div class="ai-body">
              <span class="ai-text"><strong>{{ auth.getUserById(t.assigneeId || 'u1')?.name }}</strong> updated task <strong>{{ t.title }}</strong></span>
              <span class="ai-time">{{ formatRelative(t.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card user-table-card">
      <div class="card-header"><h3>All Users</h3></div>
      <table class="user-table">
        <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Title</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="u in auth.allUsers" :key="u.id">
            <td><div class="ut-user"><Avatar :initials="u.avatar" size="xs" /> {{ u.name }}</div></td>
            <td class="ut-email">{{ u.email }}</td>
            <td><span class="ut-role" :class="u.role">{{ u.role }}</span></td>
            <td>{{ u.title }}</td>
            <td><span class="ut-status" :class="{ online: u.online, offline: !u.online }">{{ u.online ? 'Online' : 'Offline' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
.stat-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
.stat-card { padding: 20px; display: flex; align-items: flex-start; gap: 16px; }
.sc-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sc-info { display: flex; flex-direction: column; }
.sc-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em; }
.sc-label { font-size: 0.82rem; color: var(--text-muted); }
.sc-sub { font-size: 0.72rem; color: var(--success-500); margin-top: 2px; }
.charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
.chart-card { padding: 24px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-header h3 { font-size: 1rem; }
.chart-badge { font-size: 0.72rem; color: var(--success-500); font-weight: 600; background: var(--success-50); padding: 3px 10px; border-radius: 20px; }
.chart-wrap { height: 240px; }
.chart-wrap.doughnut { display: flex; align-items: center; justify-content: center; }
.list-card { padding: 24px; }
.activity-list { display: flex; flex-direction: column; gap: 14px; }
.activity-item { display: flex; gap: 10px; align-items: flex-start; }
.ai-body { flex: 1; }
.ai-text { font-size: 0.82rem; color: var(--text-secondary); display: block; line-height: 1.5; }
.ai-text strong { color: var(--text-primary); }
.ai-time { font-size: 0.72rem; color: var(--text-muted); }
.user-table-card { padding: 0; overflow-x: auto; }
.user-table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 14px 24px; font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
td { padding: 14px 24px; border-bottom: 1px solid var(--border-color); font-size: 0.85rem; }
tr:hover td { background: var(--bg-hover); }
.ut-user { display: flex; align-items: center; gap: 8px; font-weight: 500; }
.ut-email { color: var(--text-muted); }
.ut-role { font-size: 0.72rem; font-weight: 600; text-transform: capitalize; padding: 3px 10px; border-radius: 20px; background: var(--bg-surface-2); }
.ut-role.owner { color: var(--warning-500); background: var(--warning-50); }
.ut-role.admin { color: var(--brand-500); background: var(--brand-50); }
.ut-role.guest { color: var(--text-muted); }
.ut-status { font-size: 0.76rem; font-weight: 600; }
.ut-status.online { color: var(--success-500); }
.ut-status.offline { color: var(--text-muted); }
@media (max-width: 1100px) { .stat-cards { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
</style>
