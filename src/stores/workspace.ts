import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Workspace, Project, Task, Channel, Message, Meeting, Note, NoteFile, Notification, TaskStatus } from '../types'
import { workspaces as seedWorkspaces, projects as seedProjects, tasks as seedTasks, channels as seedChannels, messages as seedMessages, meetings as seedMeetings, notes as seedNotes, files as seedFiles, notifications as seedNotifs } from '../data/mock'

export const useWorkspaceStore = defineStore('workspace', () => {
  const workspaces = ref<Workspace[]>(seedWorkspaces)
  const currentWorkspaceId = ref<string>('w1')
  const projects = ref<Project[]>(seedProjects)
  const tasks = ref<Task[]>(seedTasks)
  const channels = ref<Channel[]>(seedChannels)
  const messages = ref<Message[]>(seedMessages)
  const meetings = ref<Meeting[]>(seedMeetings)
  const notes = ref<Note[]>(seedNotes)
  const files = ref<NoteFile[]>(seedFiles)
  const notifications = ref<Notification[]>(seedNotifs)

  const currentWorkspace = computed(() => workspaces.value.find((w) => w.id === currentWorkspaceId.value)!)

  const workspaceProjects = computed(() =>
    projects.value.filter((p) => p.workspaceId === currentWorkspaceId.value)
  )

  const workspaceTasks = computed(() => {
    const pids = new Set(workspaceProjects.value.map((p) => p.id))
    return tasks.value.filter((t) => pids.has(t.projectId))
  })

  const workspaceChannels = computed(() =>
    channels.value.filter((c) => c.workspaceId === currentWorkspaceId.value)
  )

  const workspaceMeetings = computed(() =>
    meetings.value.filter((m) => m.workspaceId === currentWorkspaceId.value)
  )

  const workspaceNotes = computed(() =>
    notes.value.filter((n) => n.workspaceId === currentWorkspaceId.value)
  )

  const workspaceFiles = computed(() =>
    files.value.filter((f) => f.workspaceId === currentWorkspaceId.value)
  )

  const unreadNotifications = computed(() => notifications.value.filter((n) => !n.read).length)

  function setWorkspace(id: string) {
    currentWorkspaceId.value = id
  }

  function getProjectById(id: string) {
    return projects.value.find((p) => p.id === id)
  }

  function getTasksByProject(projectId: string) {
    return tasks.value.filter((t) => t.projectId === projectId)
  }

  function getChannelMessages(channelId: string) {
    return messages.value.filter((m) => m.channelId === channelId)
  }

  function getTaskById(id: string) {
    return tasks.value.find((t) => t.id === id)
  }

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) task.status = status
  }

  function updateTask(taskId: string, updates: Partial<Task>) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (task) Object.assign(task, updates)
  }

  function addTask(task: Partial<Task> & { projectId: string; title: string }) {
    const newTask: Task = {
      id: 't-' + Date.now(),
      projectId: task.projectId,
      title: task.title,
      description: task.description || '',
      assigneeId: task.assigneeId || null,
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      labels: task.labels || [],
      subtasks: task.subtasks || [],
      comments: task.comments || [],
      attachments: task.attachments || [],
      activity: task.activity || [],
      timeEstimate: task.timeEstimate || 0,
      createdAt: new Date().toISOString().split('T')[0],
      order: tasks.value.filter((t) => t.projectId === task.projectId).length,
    }
    tasks.value.push(newTask)
    return newTask
  }

  function addProject(project: Partial<Project> & { name: string }) {
    const newProject: Project = {
      id: 'p-' + Date.now(),
      workspaceId: currentWorkspaceId.value,
      name: project.name,
      description: project.description || '',
      color: project.color || '#3b82f6',
      icon: project.icon || 'folder',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      deadline: project.deadline || '',
      members: project.members || [],
      progress: 0,
      labels: project.labels || [],
      milestones: project.milestones || [],
      createdAt: new Date().toISOString().split('T')[0],
    }
    projects.value.push(newProject)
    return newProject
  }

  function addMessage(channelId: string, userId: string, text: string) {
    const msg: Message = {
      id: 'msg-' + Date.now(),
      channelId,
      userId,
      text,
      createdAt: new Date().toISOString(),
      edited: false,
      reactions: {},
      threadReplies: [],
    }
    messages.value.push(msg)
    return msg
  }

  function toggleReaction(messageId: string, emoji: string, userId: string) {
    const msg = messages.value.find((m) => m.id === messageId)
    if (!msg) return
    if (!msg.reactions[emoji]) msg.reactions[emoji] = []
    const idx = msg.reactions[emoji].indexOf(userId)
    if (idx >= 0) msg.reactions[emoji].splice(idx, 1)
    else msg.reactions[emoji].push(userId)
    if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji]
  }

  function addNotification(n: Partial<Notification> & { title: string; body: string; type: Notification['type'] }) {
    const notif: Notification = {
      id: 'nt-' + Date.now(),
      type: n.type,
      title: n.title,
      body: n.body,
      read: false,
      createdAt: new Date().toISOString(),
      link: n.link,
    }
    notifications.value.unshift(notif)
  }

  function markNotificationRead(id: string) {
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.read = true
  }

  function markAllNotificationsRead() {
    notifications.value.forEach((n) => (n.read = true))
  }

  function addMeeting(m: Partial<Meeting> & { title: string; date: string; time: string }) {
    const meeting: Meeting = {
      id: 'mt-' + Date.now(),
      workspaceId: currentWorkspaceId.value,
      title: m.title,
      description: m.description || '',
      date: m.date,
      time: m.time,
      duration: m.duration || 30,
      platform: m.platform || 'google-meet',
      link: m.link || 'https://meet.google.com/new',
      attendees: m.attendees || [],
      notes: m.notes || '',
      status: 'upcoming',
    }
    meetings.value.push(meeting)
    return meeting
  }

  function addNote(n: Partial<Note> & { title: string; content: string; authorId: string }) {
    const note: Note = {
      id: 'n-' + Date.now(),
      workspaceId: currentWorkspaceId.value,
      title: n.title,
      content: n.content,
      authorId: n.authorId,
      lastEdited: new Date().toISOString().split('T')[0],
      sharedWith: n.sharedWith || [],
      versions: [],
    }
    notes.value.push(note)
    return note
  }

  function updateNote(id: string, updates: Partial<Note>) {
    const note = notes.value.find((n) => n.id === id)
    if (note) {
      Object.assign(note, updates)
      note.lastEdited = new Date().toISOString().split('T')[0]
    }
  }

  return {
    workspaces, currentWorkspaceId, currentWorkspace,
    projects, tasks, channels, messages, meetings, notes, files, notifications,
    workspaceProjects, workspaceTasks, workspaceChannels, workspaceMeetings, workspaceNotes, workspaceFiles,
    unreadNotifications,
    setWorkspace, getProjectById, getTasksByProject, getChannelMessages, getTaskById,
    updateTaskStatus, updateTask, addTask, addProject,
    addMessage, toggleReaction, addNotification, markNotificationRead, markAllNotificationsRead,
    addMeeting, addNote, updateNote,
  }
})
