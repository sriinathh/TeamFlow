<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useWorkspaceStore } from '../stores/workspace'
import { useThemeStore } from '../stores/theme'
import { useToastStore } from '../stores/toast'
import Avatar from '../components/ui/Avatar.vue'
import TfButton from '../components/ui/TfButton.vue'

const auth = useAuthStore()
const ws = useWorkspaceStore()
const theme = useThemeStore()
const toast = useToastStore()

const activeSection = ref<'profile' | 'workspace' | 'appearance' | 'notifications' | 'security'>('profile')

const sections = [
  { key: 'profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { key: 'workspace', label: 'Workspace', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { key: 'appearance', label: 'Appearance', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { key: 'notifications', label: 'Notifications', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { key: 'security', label: 'Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4' },
] as const

const notifSettings = ref({
  taskAssigned: true, newMessage: true, deadline: true, meetingReminder: true, fileUpload: false, comments: true,
})

function saveSettings() { toast.success('Settings saved!') }
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>Settings</h1>
    </div>

    <div class="settings-layout">
      <div class="settings-nav card">
        <button v-for="s in sections" :key="s.key" class="settings-nav-item" :class="{ active: activeSection === s.key }" @click="activeSection = s.key">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="s.icon" /></svg>
          {{ s.label }}
        </button>
      </div>

      <div class="settings-content">
        <!-- Profile -->
        <div v-if="activeSection === 'profile'" class="card settings-card">
          <h2>Profile</h2>
          <p class="sc-desc">Update your personal information and profile picture.</p>
          <div class="profile-avatar">
            <Avatar :initials="auth.initials" size="xl" />
            <TfButton variant="secondary" size="sm">Change Avatar</TfButton>
          </div>
          <div class="form-grid">
            <div class="field"><label>Full Name</label><input type="text" :value="auth.currentUser?.name" /></div>
            <div class="field"><label>Email</label><input type="email" :value="auth.currentUser?.email" /></div>
            <div class="field"><label>Job Title</label><input type="text" :value="auth.currentUser?.title" /></div>
            <div class="field"><label>Role</label><input type="text" :value="auth.currentUser?.role" disabled /></div>
          </div>
          <TfButton @click="saveSettings">Save Changes</TfButton>
        </div>

        <!-- Workspace -->
        <div v-if="activeSection === 'workspace'" class="card settings-card">
          <h2>Workspace Settings</h2>
          <p class="sc-desc">Manage your workspace details and members.</p>
          <div class="ws-info-block">
            <div class="ws-info-logo" :class="ws.currentWorkspace?.banner">{{ ws.currentWorkspace?.logo }}</div>
            <div>
              <h3>{{ ws.currentWorkspace?.name }}</h3>
              <p>{{ ws.currentWorkspace?.description }}</p>
            </div>
          </div>
          <div class="form-grid">
            <div class="field"><label>Workspace Name</label><input type="text" :value="ws.currentWorkspace?.name" /></div>
            <div class="field"><label>Created</label><input type="text" :value="ws.currentWorkspace?.createdAt" disabled /></div>
          </div>
          <h3 class="members-title">Members ({{ ws.currentWorkspace?.members.length }})</h3>
          <div class="members-list">
            <div v-for="m in ws.currentWorkspace?.members" :key="m.userId" class="member-row">
              <Avatar :user-id="m.userId" size="sm" />
              <div class="mr-info"><span class="mr-name">{{ auth.getUserById(m.userId)?.name }}</span><span class="mr-email">{{ auth.getUserById(m.userId)?.email }}</span></div>
              <span class="mr-role" :class="m.role">{{ m.role }}</span>
            </div>
          </div>
          <TfButton @click="saveSettings">Save Changes</TfButton>
        </div>

        <!-- Appearance -->
        <div v-if="activeSection === 'appearance'" class="card settings-card">
          <h2>Appearance</h2>
          <p class="sc-desc">Customize how TeamFlow looks for you.</p>
          <h3 class="sub-title">Theme</h3>
          <div class="theme-options">
            <button class="theme-option" :class="{ active: theme.mode === 'light' }" @click="theme.set('light')">
              <div class="to-preview light"><div class="to-bar" /><div class="to-content" /></div>
              <span>Light</span>
            </button>
            <button class="theme-option" :class="{ active: theme.mode === 'dark' }" @click="theme.set('dark')">
              <div class="to-preview dark"><div class="to-bar" /><div class="to-content" /></div>
              <span>Dark</span>
            </button>
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeSection === 'notifications'" class="card settings-card">
          <h2>Notifications</h2>
          <p class="sc-desc">Choose what you want to be notified about.</p>
          <div class="notif-settings">
            <label v-for="(val, key) in notifSettings" :key="key" class="notif-setting">
              <div><span class="ns-label">{{ key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()) }}</span></div>
              <div class="toggle" :class="{ on: val }" @click="notifSettings[key as keyof typeof notifSettings] = !val"><span class="toggle-knob" /></div>
            </label>
          </div>
          <TfButton @click="saveSettings">Save Preferences</TfButton>
        </div>

        <!-- Security -->
        <div v-if="activeSection === 'security'" class="card settings-card">
          <h2>Security</h2>
          <p class="sc-desc">Manage your password and security settings.</p>
          <div class="form-grid">
            <div class="field"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
            <div class="field"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
          </div>
          <div class="security-info">
            <div class="si-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success-500)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Two-factor authentication enabled</div>
            <div class="si-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success-500)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> JWT tokens with refresh rotation</div>
            <div class="si-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success-500)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Password hashed with bcrypt</div>
          </div>
          <TfButton @click="saveSettings">Update Password</TfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 28px; }
.page-header h1 { font-size: 1.6rem; }
.settings-layout { display: flex; gap: 24px; align-items: flex-start; }
.settings-nav { padding: 10px; width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; }
.settings-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); text-align: left; transition: all 0.15s; }
.settings-nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.settings-nav-item.active { background: var(--brand-50); color: var(--brand-600); }
.settings-content { flex: 1; min-width: 0; }
.settings-card { padding: 32px; }
.settings-card h2 { font-size: 1.25rem; margin-bottom: 4px; }
.sc-desc { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 24px; }
.profile-avatar { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.field label { display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; }
.field input { width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background: var(--bg-surface-2); color: var(--text-primary); outline: none; }
.field input:focus { border-color: var(--brand-500); }
.field input:disabled { opacity: 0.6; }
.ws-info-block { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 20px; background: var(--bg-surface-2); border-radius: var(--radius-md); }
.ws-info-logo { width: 56px; height: 56px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem; }
.ws-info-logo.gradient-brand { background: var(--gradient-brand); }
.ws-info-logo.gradient-accent { background: var(--gradient-accent); }
.ws-info-block h3 { font-size: 1rem; margin-bottom: 4px; }
.ws-info-block p { font-size: 0.82rem; color: var(--text-muted); }
.members-title { font-size: 0.95rem; margin: 24px 0 12px; }
.members-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.member-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: var(--radius-md); background: var(--bg-surface-2); }
.mr-info { flex: 1; }
.mr-name { font-size: 0.85rem; font-weight: 500; display: block; }
.mr-email { font-size: 0.76rem; color: var(--text-muted); }
.mr-role { font-size: 0.72rem; font-weight: 600; text-transform: capitalize; padding: 3px 10px; border-radius: 20px; background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-color); }
.mr-role.owner { color: var(--warning-500); background: var(--warning-50); border-color: transparent; }
.mr-role.admin { color: var(--brand-500); background: var(--brand-50); border-color: transparent; }
.sub-title { font-size: 0.9rem; margin-bottom: 14px; }
.theme-options { display: flex; gap: 16px; }
.theme-option { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border-radius: var(--radius-lg); border: 2px solid var(--border-color); transition: all 0.15s; }
.theme-option.active { border-color: var(--brand-500); box-shadow: var(--shadow-glow); }
.theme-option span { font-size: 0.85rem; font-weight: 600; }
.to-preview { width: 120px; height: 70px; border-radius: var(--radius-md); overflow: hidden; }
.to-preview.light { background: #f7f8fc; }
.to-preview.dark { background: #0a0c14; }
.to-bar { height: 16px; }
.to-preview.light .to-bar { background: #fff; border-bottom: 1px solid #e2e8f0; }
.to-preview.dark .to-bar { background: #131722; border-bottom: 1px solid #232a3a; }
.to-content { height: 54px; padding: 8px; }
.to-preview.light .to-content { background: #fff; }
.to-preview.dark .to-content { background: #131722; }
.notif-settings { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; }
.notif-setting { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: var(--radius-md); background: var(--bg-surface-2); cursor: pointer; }
.ns-label { font-size: 0.88rem; }
.toggle { width: 40px; height: 22px; border-radius: 11px; background: var(--border-strong); position: relative; transition: background 0.2s; }
.toggle.on { background: var(--brand-500); }
.toggle-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform 0.2s; }
.toggle.on .toggle-knob { transform: translateX(18px); }
.security-info { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.si-item { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text-secondary); }
@media (max-width: 700px) { .settings-layout { flex-direction: column; } .settings-nav { width: 100%; flex-direction: row; overflow-x: auto; } .form-grid { grid-template-columns: 1fr; } }
</style>
