<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/ui/Avatar.vue'
import BaseModal from '../components/ui/BaseModal.vue'
import TfButton from '../components/ui/TfButton.vue'
import type { Meeting } from '../types'

const ws = useWorkspaceStore()
const auth = useAuthStore()
const toast = useToastStore()

const showCreateModal = ref(false)
const newMeeting = ref({ title: '', description: '', date: '', time: '10:00', duration: 30, platform: 'google-meet' as 'google-meet' | 'zoom', attendees: [] as string[] })

const upcomingMeetings = computed(() => ws.workspaceMeetings.filter(m => m.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date)))
const pastMeetings = computed(() => ws.workspaceMeetings.filter(m => m.status !== 'upcoming').sort((a, b) => b.date.localeCompare(a.date)))

function createMeeting() {
  if (!newMeeting.value.title || !newMeeting.value.date) { toast.error('Title and date are required'); return }
  ws.addMeeting(newMeeting.value)
  toast.success('Meeting scheduled!')
  newMeeting.value = { title: '', description: '', date: '', time: '10:00', duration: 30, platform: 'google-meet', attendees: [] }
  showCreateModal.value = false
}

function joinMeeting(m: Meeting) {
  toast.info(`Joining "${m.title}"...`)
  window.open(m.link, '_blank')
}

function toggleAttendee(id: string) {
  const idx = newMeeting.value.attendees.indexOf(id)
  if (idx >= 0) newMeeting.value.attendees.splice(idx, 1)
  else newMeeting.value.attendees.push(id)
}
</script>

<template>
  <div class="meetings-page">
    <div class="page-header">
      <div>
        <h1>Meetings</h1>
        <p class="page-subtitle">{{ upcomingMeetings.length }} upcoming meetings</p>
      </div>
      <TfButton @click="showCreateModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Schedule Meeting
      </TfButton>
    </div>

    <!-- Upcoming -->
    <h2 class="section-title">Upcoming</h2>
    <div class="meetings-grid">
      <div v-for="m in upcomingMeetings" :key="m.id" class="meeting-card card card-hover">
        <div class="mc-date" :class="m.platform">
          <span class="mc-day">{{ new Date(m.date).getDate() }}</span>
          <span class="mc-month">{{ new Date(m.date).toLocaleDateString('en', { month: 'short' }) }}</span>
        </div>
        <div class="mc-body">
          <h3>{{ m.title }}</h3>
          <p class="mc-desc">{{ m.description }}</p>
          <div class="mc-meta">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {{ m.time }} · {{ m.duration }}min</span>
            <span class="mc-platform">
              <svg v-if="m.platform === 'google-meet'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              {{ m.platform === 'google-meet' ? 'Google Meet' : 'Zoom' }}
            </span>
          </div>
          <div class="mc-footer">
            <div class="mc-attendees">
              <Avatar v-for="aid in m.attendees.slice(0, 4)" :key="aid" :user-id="aid" size="xs" />
              <span v-if="m.attendees.length > 4" class="mc-extra">+{{ m.attendees.length - 4 }}</span>
            </div>
            <TfButton size="sm" @click="joinMeeting(m)">Join</TfButton>
          </div>
        </div>
      </div>
      <div v-if="upcomingMeetings.length === 0" class="empty-state card">No upcoming meetings</div>
    </div>

    <!-- Past -->
    <h2 class="section-title" style="margin-top: 40px;">Past Meetings</h2>
    <div class="meetings-grid">
      <div v-for="m in pastMeetings" :key="m.id" class="meeting-card card past">
        <div class="mc-date">
          <span class="mc-day">{{ new Date(m.date).getDate() }}</span>
          <span class="mc-month">{{ new Date(m.date).toLocaleDateString('en', { month: 'short' }) }}</span>
        </div>
        <div class="mc-body">
          <h3>{{ m.title }}</h3>
          <p class="mc-desc">{{ m.description }}</p>
          <div v-if="m.notes" class="mc-notes">
            <strong>Notes:</strong> {{ m.notes }}
          </div>
          <div class="mc-footer">
            <div class="mc-attendees">
              <Avatar v-for="aid in m.attendees.slice(0, 4)" :key="aid" :user-id="aid" size="xs" />
            </div>
            <span class="mc-status completed">Completed</span>
          </div>
        </div>
      </div>
      <div v-if="pastMeetings.length === 0" class="empty-state card">No past meetings</div>
    </div>

    <BaseModal v-model="showCreateModal" title="Schedule New Meeting" width="480px">
      <div class="form">
        <div class="field"><label>Meeting Title</label><input v-model="newMeeting.title" type="text" placeholder="e.g. Weekly Standup" /></div>
        <div class="field"><label>Description</label><textarea v-model="newMeeting.description" rows="2" placeholder="Meeting agenda..." /></div>
        <div class="form-row">
          <div class="field"><label>Date</label><input v-model="newMeeting.date" type="date" /></div>
          <div class="field"><label>Time</label><input v-model="newMeeting.time" type="time" /></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Duration (min)</label><input v-model.number="newMeeting.duration" type="number" min="15" step="15" /></div>
          <div class="field"><label>Platform</label><select v-model="newMeeting.platform" class="field-select"><option value="google-meet">Google Meet</option><option value="zoom">Zoom</option></select></div>
        </div>
        <div class="field"><label>Attendees</label>
          <div class="attendee-picker">
            <button v-for="u in auth.allUsers" :key="u.id" class="attendee-chip" :class="{ selected: newMeeting.attendees.includes(u.id) }" @click="toggleAttendee(u.id)">
              <Avatar :initials="u.avatar" size="xs" /> {{ u.name }}
            </button>
          </div>
        </div>
      </div>
      <template #footer>
        <TfButton variant="ghost" @click="showCreateModal = false">Cancel</TfButton>
        <TfButton @click="createMeeting">Schedule</TfButton>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; margin-bottom: 4px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
.section-title { font-size: 1.1rem; margin-bottom: 16px; }
.meetings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.meeting-card { display: flex; gap: 16px; padding: 20px; }
.meeting-card.past { opacity: 0.75; }
.mc-date { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: var(--radius-md); background: var(--brand-50); color: var(--brand-600); flex-shrink: 0; }
.mc-day { font-size: 1.3rem; font-weight: 800; line-height: 1; }
.mc-month { font-size: 0.68rem; text-transform: uppercase; font-weight: 600; }
.mc-body { flex: 1; min-width: 0; }
.mc-body h3 { font-size: 1rem; margin-bottom: 4px; }
.mc-desc { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px; }
.mc-meta { display: flex; gap: 16px; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 12px; }
.mc-meta span { display: flex; align-items: center; gap: 4px; }
.mc-notes { font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-surface-2); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 12px; line-height: 1.5; }
.mc-footer { display: flex; justify-content: space-between; align-items: center; }
.mc-attendees { display: flex; align-items: center; }
.mc-extra { font-size: 0.72rem; color: var(--text-muted); margin-left: 4px; }
.mc-status.completed { font-size: 0.72rem; color: var(--success-500); font-weight: 600; }
.empty-state { padding: 40px; text-align: center; color: var(--text-muted); }
.form .field { margin-bottom: 16px; }
.form-row { display: flex; gap: 12px; }
.form-row .field { flex: 1; }
.field label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; }
.field input, .field textarea, .field-select { width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-2); color: var(--text-primary); outline: none; }
.field input:focus, .field-select:focus { border-color: var(--brand-500); }
.attendee-picker { display: flex; flex-wrap: wrap; gap: 6px; }
.attendee-chip { display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 5px; border-radius: 20px; border: 1px solid var(--border-color); font-size: 0.78rem; color: var(--text-secondary); transition: all 0.15s; }
.attendee-chip.selected { background: var(--brand-50); border-color: var(--brand-400); color: var(--brand-600); }
@media (max-width: 700px) { .meetings-grid { grid-template-columns: 1fr; } }
</style>
