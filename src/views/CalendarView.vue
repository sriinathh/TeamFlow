<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkspaceStore } from '../stores/workspace'
import { statusColors } from '../utils'

const ws = useWorkspaceStore()
const router = useRouter()

const currentMonth = ref(new Date())
type CalView = 'month' | 'week' | 'day'
const viewMode = ref<CalView>('month')

const events = computed(() => {
  const evts: { id: string; title: string; date: string; type: string; color: string }[] = []
  ws.workspaceTasks.forEach(t => {
    if (t.dueDate) evts.push({ id: t.id, title: t.title, date: t.dueDate, type: 'task', color: statusColors[t.status] })
  })
  ws.workspaceMeetings.forEach(m => {
    evts.push({ id: m.id, title: m.title, date: m.date, type: 'meeting', color: '#8b5cf6' })
  })
  ws.workspaceProjects.forEach(p => {
    p.milestones.forEach(ms => {
      evts.push({ id: ms.id, title: ms.title, date: ms.date, type: 'milestone', color: '#f59e0b' })
    })
  })
  return evts
})

const eventsByDate = computed(() => {
  const map: Record<string, typeof events.value> = {}
  events.value.forEach(e => {
    if (!map[e.date]) map[e.date] = []
    map[e.date].push(e)
  })
  return map
})

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

const today = new Date().toISOString().split('T')[0]
function prevMonth() { currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1) }
function nextMonth() { currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1) }
function goToday() { currentMonth.value = new Date() }
</script>

<template>
  <div class="calendar-page">
    <div class="page-header">
      <h1>Calendar</h1>
    </div>

    <div class="card calendar-card">
      <div class="cal-header">
        <h2>{{ currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' }) }}</h2>
        <div class="cal-controls">
          <div class="view-toggle">
            <button :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">Month</button>
            <button :class="{ active: viewMode === 'week' }" @click="viewMode = 'week'">Week</button>
            <button :class="{ active: viewMode === 'day' }" @click="viewMode = 'day'">Day</button>
          </div>
          <button class="cal-today" @click="goToday">Today</button>
          <div class="cal-nav">
            <button @click="prevMonth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>
            <button @click="nextMonth"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>

      <div class="cal-legend">
        <span><span class="legend-dot" style="background: #3b82f6" /> Task</span>
        <span><span class="legend-dot" style="background: #8b5cf6" /> Meeting</span>
        <span><span class="legend-dot" style="background: #f59e0b" /> Milestone</span>
      </div>

      <div class="cal-weekdays">
        <span v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">{{ d }}</span>
      </div>

      <div class="cal-grid">
        <div v-for="day in calendarGrid" :key="day.date" class="cal-cell" :class="{ disabled: !day.current, today: day.date === today }">
          <span class="cell-day">{{ day.day }}</span>
          <div class="cell-events">
            <div v-for="e in (eventsByDate[day.date] || [])" :key="e.id" class="cell-event" :style="{ borderLeftColor: e.color, background: e.color + '15', color: e.color }" @click="e.type === 'task' ? router.push('/app/projects') : e.type === 'meeting' ? router.push('/app/meetings') : router.push('/app/projects')">
              <span class="ce-type">{{ e.type === 'task' ? 'T' : e.type === 'meeting' ? 'M' : '★' }}</span>
              {{ e.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 1.6rem; }
.calendar-card { padding: 24px; }
.cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.cal-header h2 { font-size: 1.2rem; }
.cal-controls { display: flex; align-items: center; gap: 10px; }
.view-toggle { display: flex; gap: 2px; background: var(--bg-surface-2); padding: 3px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); }
.view-toggle button { padding: 5px 14px; border-radius: 5px; font-size: 0.78rem; font-weight: 500; color: var(--text-secondary); }
.view-toggle button.active { background: var(--bg-surface); color: var(--brand-600); box-shadow: var(--shadow-sm); }
.cal-today { padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 600; color: var(--brand-500); border: 1px solid var(--brand-400); }
.cal-today:hover { background: var(--brand-50); }
.cal-nav { display: flex; gap: 4px; }
.cal-nav button { width: 30px; height: 30px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border: 1px solid var(--border-color); }
.cal-nav button:hover { background: var(--bg-hover); }
.cal-legend { display: flex; gap: 20px; margin-bottom: 16px; font-size: 0.78rem; color: var(--text-muted); }
.legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
.cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 8px; }
.cal-weekdays span { text-align: center; font-size: 0.74rem; font-weight: 700; color: var(--text-muted); padding: 8px 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-cell { min-height: 110px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 6px; background: var(--bg-surface); }
.cal-cell.disabled { opacity: 0.35; }
.cal-cell.today { border-color: var(--brand-500); background: var(--brand-50); }
.cell-day { font-size: 0.78rem; font-weight: 600; display: block; margin-bottom: 4px; }
.cell-events { display: flex; flex-direction: column; gap: 3px; }
.cell-event { font-size: 0.68rem; padding: 3px 6px; border-radius: 4px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border-left: 3px solid; }
.ce-type { font-weight: 700; margin-right: 4px; }
@media (max-width: 700px) { .cal-cell { min-height: 80px; } .cell-event { font-size: 0.62rem; } }
</style>
