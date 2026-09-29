<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useWorkspaceStore } from '../stores/workspace'
import Avatar from '../components/ui/Avatar.vue'
import ThemeToggle from '../components/ui/ThemeToggle.vue'

const auth = useAuthStore()
const ws = useWorkspaceStore()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const wsMenuOpen = ref(false)
const notifOpen = ref(false)

const navItems = [
  { name: 'Dashboard', icon: 'home', path: '/app/dashboard' },
  { name: 'Projects', icon: 'folder', path: '/app/projects' },
  { name: 'Chat', icon: 'message', path: '/app/chat', badge: 7 },
  { name: 'Meetings', icon: 'video', path: '/app/meetings' },
  { name: 'Notes', icon: 'file-text', path: '/app/notes' },
  { name: 'Files', icon: 'paperclip', path: '/app/files' },
  { name: 'Calendar', icon: 'calendar', path: '/app/calendar' },
]

const bottomNav = [
  { name: 'Settings', icon: 'settings', path: '/app/settings' },
  { name: 'Admin', icon: 'shield', path: '/app/admin' },
]

const currentPath = computed(() => route.path)

function navigate(path: string) {
  router.push(path)
  sidebarOpen.value = false
}

function logout() {
  auth.logout()
  router.push('/')
}

const icons: Record<string, string> = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  message: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  video: 'M23 7l-7 5 7 5V7z M1 5h15v14H1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  paperclip: 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48',
  calendar: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  search: 'M11 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  chevron: 'M6 9l6 6 6-6',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  plus: 'M12 5v14 M5 12h14',
  check: 'M20 6L9 17l-5-5',
}

function iconPath(name: string) { return icons[name] || icons.folder }
</script>

<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo" @click="navigate('/')">
          <div class="logo-mark">T</div>
          <span class="logo-text">TeamFlow</span>
        </div>
      </div>

      <!-- Workspace selector -->
      <div class="ws-selector" @click="wsMenuOpen = !wsMenuOpen">
        <div class="ws-current">
          <div class="ws-logo" :class="ws.currentWorkspace?.banner">{{ ws.currentWorkspace?.logo }}</div>
          <div class="ws-info">
            <span class="ws-name">{{ ws.currentWorkspace?.name }}</span>
            <span class="ws-role">{{ auth.currentUser?.role }}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-chevron" :class="{ rotated: wsMenuOpen }"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <Transition name="fade">
          <div v-if="wsMenuOpen" class="ws-dropdown">
            <div v-for="w in ws.workspaces" :key="w.id" class="ws-option" :class="{ active: w.id === ws.currentWorkspaceId }" @click.stop="ws.setWorkspace(w.id); wsMenuOpen = false">
              <div class="ws-logo sm" :class="w.banner">{{ w.logo }}</div>
              <span>{{ w.name }}</span>
            </div>
            <div class="ws-option create" @click.stop="">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>New Workspace</span>
            </div>
          </div>
        </Transition>
      </div>

      <nav class="sidebar-nav">
        <button v-for="item in navItems" :key="item.path" class="nav-item" :class="{ active: currentPath.startsWith(item.path) }" @click="navigate(item.path)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="iconPath(item.icon)" /></svg>
          <span>{{ item.name }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <button v-for="item in bottomNav" :key="item.path" class="nav-item" :class="{ active: currentPath === item.path }" @click="navigate(item.path)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="iconPath(item.icon)" /></svg>
          <span>{{ item.name }}</span>
        </button>
      </div>
    </aside>

    <!-- Backdrop for mobile -->
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false" />

    <!-- Main -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar glass">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <button class="search-trigger" @click="navigate('/app/search')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Search...</span>
          <kbd>⌘K</kbd>
        </button>

        <div class="topbar-right">
          <ThemeToggle />

          <!-- Notifications -->
          <div class="notif-wrap">
            <button class="icon-btn" @click="notifOpen = !notifOpen; ws.markAllNotificationsRead()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span v-if="ws.unreadNotifications > 0" class="notif-dot">{{ ws.unreadNotifications }}</span>
            </button>
            <Transition name="fade">
              <div v-if="notifOpen" class="notif-panel glass">
                <div class="notif-header">
                  <span>Notifications</span>
                  <button class="notif-clear" @click="ws.markAllNotificationsRead()">Mark all read</button>
                </div>
                <div class="notif-list">
                  <div v-for="n in ws.notifications.slice(0, 6)" :key="n.id" class="notif-item" :class="{ unread: !n.read }" @click="navigate(n.link || '/app/notifications'); notifOpen = false">
                    <div class="notif-icon" :class="n.type" />
                    <div class="notif-content">
                      <span class="notif-title">{{ n.title }}</span>
                      <span class="notif-body">{{ n.body }}</span>
                    </div>
                  </div>
                </div>
                <button class="notif-view-all" @click="navigate('/app/notifications'); notifOpen = false">View all notifications</button>
              </div>
            </Transition>
          </div>

          <!-- User menu -->
          <div class="user-wrap">
            <button class="user-trigger" @click="userMenuOpen = !userMenuOpen">
              <Avatar :initials="auth.initials" size="sm" />
            </button>
            <Transition name="fade">
              <div v-if="userMenuOpen" class="user-menu glass">
                <div class="user-menu-header">
                  <Avatar :initials="auth.initials" size="md" />
                  <div>
                    <div class="user-menu-name">{{ auth.currentUser?.name }}</div>
                    <div class="user-menu-email">{{ auth.currentUser?.email }}</div>
                  </div>
                </div>
                <div class="user-menu-items">
                  <button @click="navigate('/app/settings'); userMenuOpen = false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="icons.settings"/></svg> Settings</button>
                  <button @click="navigate('/app/admin'); userMenuOpen = false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="icons.shield"/></svg> Admin Dashboard</button>
                  <div class="divider" />
                  <button class="logout-btn" @click="logout"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path :d="icons.logout"/></svg> Sign Out</button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="page-content">
        <RouterView v-slot="{ Component }">
          <Transition name="slide" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell { display: flex; min-height: 100vh; }

.sidebar {
  width: var(--sidebar-w);
  background: var(--bg-surface);
  border-right: 1px solid var(--border-color);
  display: flex; flex-direction: column;
  position: fixed; top: 0; bottom: 0; left: 0;
  z-index: var(--z-sidebar);
  transition: transform 0.3s ease;
}
.sidebar-header { padding: 20px 20px 16px; }
.logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-mark {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: var(--gradient-brand);
  color: white; font-weight: 800; font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(59,130,246,0.3);
}
.logo-text { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.03em; }

.ws-selector { padding: 0 12px 16px; position: relative; }
.ws-current {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: var(--radius-md);
  cursor: pointer; transition: background 0.15s;
  border: 1px solid var(--border-color);
}
.ws-current:hover { background: var(--bg-hover); }
.ws-logo {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;
}
.ws-logo.sm { width: 24px; height: 24px; font-size: 0.7rem; border-radius: 6px; }
.ws-logo.gradient-brand { background: var(--gradient-brand); }
.ws-logo.gradient-accent { background: var(--gradient-accent); }
.ws-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.ws-name { font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ws-role { font-size: 0.7rem; color: var(--text-muted); text-transform: capitalize; }
.ws-chevron { color: var(--text-muted); transition: transform 0.2s; }
.ws-chevron.rotated { transform: rotate(180deg); }

.ws-dropdown {
  position: absolute; top: 100%; left: 12px; right: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 6px; z-index: var(--z-dropdown);
  animation: scaleIn 0.15s ease both;
  transform-origin: top;
}
.ws-option {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: var(--radius-sm);
  cursor: pointer; font-size: 0.85rem; transition: background 0.15s;
}
.ws-option:hover { background: var(--bg-hover); }
.ws-option.active { background: var(--brand-50); color: var(--brand-600); }
.ws-option.create { color: var(--text-muted); border-top: 1px solid var(--border-color); margin-top: 4px; padding-top: 10px; }

.sidebar-nav { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: var(--radius-md);
  color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;
  transition: all 0.15s ease; text-align: left; width: 100%;
}
.nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-item.active { background: var(--brand-50); color: var(--brand-600); }
.nav-item span:first-of-type { flex: 1; }
.nav-badge {
  background: var(--brand-500); color: white;
  font-size: 0.65rem; font-weight: 700;
  padding: 2px 7px; border-radius: 10px;
}

.sidebar-bottom { padding: 8px 12px 16px; border-top: 1px solid var(--border-color); }

.sidebar-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  z-index: calc(var(--z-sidebar) - 1);
}

.main-area { flex: 1; margin-left: var(--sidebar-w); display: flex; flex-direction: column; min-width: 0; }

.topbar {
  height: var(--topbar-h);
  display: flex; align-items: center; gap: 16px;
  padding: 0 24px;
  position: sticky; top: 0; z-index: var(--z-topbar);
  border-bottom: 1px solid var(--border-color);
}
.menu-toggle { display: none; color: var(--text-primary); }
.search-trigger {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 14px; border-radius: var(--radius-md);
  background: var(--bg-surface-2); border: 1px solid var(--border-color);
  color: var(--text-muted); font-size: 0.85rem;
  min-width: 280px; flex: 0 1 360px;
  transition: border-color 0.15s;
}
.search-trigger:hover { border-color: var(--brand-400); }
.search-trigger kbd {
  margin-left: auto; font-size: 0.7rem; padding: 2px 6px;
  border-radius: 4px; background: var(--bg-surface);
  border: 1px solid var(--border-color); color: var(--text-muted);
  font-family: var(--font-mono);
}

.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; position: relative; }
.icon-btn {
  position: relative; width: 38px; height: 38px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary); border: 1px solid var(--border-color);
  background: var(--bg-surface-2); transition: all 0.15s;
}
.icon-btn:hover { color: var(--text-primary); background: var(--bg-hover); }
.notif-dot {
  position: absolute; top: -4px; right: -4px;
  background: var(--error-500); color: white;
  font-size: 0.6rem; font-weight: 700;
  min-width: 16px; height: 16px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px; border: 2px solid var(--bg-surface);
}

.notif-panel {
  position: absolute; top: 120%; right: 0;
  width: 360px; border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg); z-index: var(--z-dropdown);
  overflow: hidden;
}
.notif-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px; border-bottom: 1px solid var(--border-color);
  font-weight: 600; font-size: 0.9rem;
}
.notif-clear { font-size: 0.75rem; color: var(--brand-500); }
.notif-list { max-height: 320px; overflow-y: auto; }
.notif-item {
  display: flex; gap: 12px; padding: 12px 16px;
  cursor: pointer; border-bottom: 1px solid var(--border-color);
  transition: background 0.1s;
}
.notif-item:hover { background: var(--bg-hover); }
.notif-item.unread { background: var(--brand-50); }
.notif-icon { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; background: var(--brand-500); flex-shrink: 0; }
.notif-content { display: flex; flex-direction: column; gap: 2px; }
.notif-title { font-size: 0.82rem; font-weight: 600; }
.notif-body { font-size: 0.78rem; color: var(--text-muted); }
.notif-view-all { width: 100%; padding: 12px; font-size: 0.8rem; color: var(--brand-500); font-weight: 600; }

.user-trigger { padding: 2px; border-radius: 50%; transition: transform 0.15s; }
.user-trigger:hover { transform: scale(1.05); }
.user-menu {
  position: absolute; top: 120%; right: 0;
  width: 260px; border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg); z-index: var(--z-dropdown);
  overflow: hidden;
}
.user-menu-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px; border-bottom: 1px solid var(--border-color);
}
.user-menu-name { font-weight: 600; font-size: 0.9rem; }
.user-menu-email { font-size: 0.78rem; color: var(--text-muted); }
.user-menu-items { padding: 6px; }
.user-menu-items button {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 10px; border-radius: var(--radius-sm);
  font-size: 0.85rem; color: var(--text-secondary); transition: background 0.1s;
}
.user-menu-items button:hover { background: var(--bg-hover); color: var(--text-primary); }
.user-menu-items .divider { height: 1px; background: var(--border-color); margin: 4px 0; }
.logout-btn { color: var(--error-500) !important; }
.logout-btn:hover { background: var(--error-50) !important; }

.page-content { flex: 1; padding: 32px; min-width: 0; }

@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main-area { margin-left: 0; }
  .menu-toggle { display: flex; }
  .search-trigger { min-width: 0; flex: 1; }
  .search-trigger kbd { display: none; }
  .page-content { padding: 16px; }
}
</style>
