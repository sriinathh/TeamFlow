<script setup lang="ts">
import { useWorkspaceStore } from '../stores/workspace'
import { useRouter } from 'vue-router'
import { formatRelative } from '../utils'

const ws = useWorkspaceStore()
const router = useRouter()

const notifIcons: Record<string, { icon: string; color: string }> = {
  'task-assigned': { icon: 'M20 6L9 17l-5-5', color: '#3b82f6' },
  'new-message': { icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', color: '#8b5cf6' },
  'deadline': { icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2', color: '#f59e0b' },
  'meeting-reminder': { icon: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z', color: '#10b981' },
  'file-upload': { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12', color: '#ec4899' },
  'comment': { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', color: '#06b6d4' },
  'mention': { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', color: '#f59e0b' },
}
</script>

<template>
  <div class="notifications-page">
    <div class="page-header">
      <div>
        <h1>Notifications</h1>
        <p class="page-subtitle">{{ ws.unreadNotifications }} unread</p>
      </div>
      <button v-if="ws.unreadNotifications > 0" class="mark-all" @click="ws.markAllNotificationsRead()">Mark all as read</button>
    </div>

    <div class="notif-list">
      <div v-for="n in ws.notifications" :key="n.id" class="notif-row card" :class="{ unread: !n.read }" @click="n.link && router.push(n.link); ws.markNotificationRead(n.id)">
        <div class="nr-icon" :style="{ background: (notifIcons[n.type]?.color || '#3b82f6') + '22', color: notifIcons[n.type]?.color || '#3b82f6' }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="notifIcons[n.type]?.icon || notifIcons['task-assigned'].icon" /></svg>
        </div>
        <div class="nr-body">
          <div class="nr-top">
            <span class="nr-title">{{ n.title }}</span>
            <span v-if="!n.read" class="nr-dot" />
          </div>
          <p class="nr-text">{{ n.body }}</p>
          <span class="nr-time">{{ formatRelative(n.createdAt) }}</span>
        </div>
      </div>
      <div v-if="ws.notifications.length === 0" class="empty-state">No notifications</div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
.mark-all { padding: 8px 16px; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 600; color: var(--brand-500); border: 1px solid var(--brand-400); }
.mark-all:hover { background: var(--brand-50); }
.notif-list { display: flex; flex-direction: column; gap: 10px; max-width: 720px; }
.notif-row { display: flex; gap: 14px; padding: 16px 20px; cursor: pointer; transition: all 0.15s; }
.notif-row.unread { border-color: var(--brand-300); background: var(--brand-50); }
.notif-row:hover { box-shadow: var(--shadow-sm); }
.nr-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nr-body { flex: 1; min-width: 0; }
.nr-top { display: flex; align-items: center; gap: 8px; }
.nr-title { font-size: 0.88rem; font-weight: 600; }
.nr-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--brand-500); }
.nr-text { font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px; line-height: 1.5; }
.nr-time { font-size: 0.72rem; color: var(--text-muted); margin-top: 6px; display: block; }
.empty-state { text-align: center; padding: 60px; color: var(--text-muted); }
</style>
