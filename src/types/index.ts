export type Role = 'owner' | 'admin' | 'member' | 'guest'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: Role
  online: boolean
  title: string
}

export interface Workspace {
  id: string
  name: string
  logo: string
  banner: string
  description: string
  members: WorkspaceMember[]
  createdAt: string
}

export interface WorkspaceMember {
  userId: string
  role: Role
  joinedAt: string
}

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Project {
  id: string
  workspaceId: string
  name: string
  description: string
  color: string
  icon: string
  status: ProjectStatus
  priority: Priority
  deadline: string
  members: string[]
  progress: number
  labels: string[]
  milestones: Milestone[]
  createdAt: string
}

export interface Milestone {
  id: string
  title: string
  date: string
  done: boolean
}

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  assigneeId: string | null
  dueDate: string
  priority: Priority
  status: TaskStatus
  labels: string[]
  subtasks: Subtask[]
  comments: Comment[]
  attachments: Attachment[]
  activity: ActivityEntry[]
  timeEstimate: number
  createdAt: string
  order: number
}

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Comment {
  id: string
  userId: string
  text: string
  createdAt: string
  reactions: Record<string, string[]>
}

export interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size: string
}

export interface ActivityEntry {
  id: string
  userId: string
  action: string
  target: string
  createdAt: string
}

export interface Channel {
  id: string
  workspaceId: string
  name: string
  description: string
  isPrivate: boolean
  members: string[]
  unread: number
}

export interface Message {
  id: string
  channelId: string
  userId: string
  text: string
  createdAt: string
  edited: boolean
  reactions: Record<string, string[]>
  threadReplies: Message[]
}

export interface DirectMessage {
  id: string
  userId: string
  messages: Message[]
}

export interface Meeting {
  id: string
  workspaceId: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  platform: 'google-meet' | 'zoom'
  link: string
  attendees: string[]
  notes: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

export interface Note {
  id: string
  workspaceId: string
  title: string
  content: string
  authorId: string
  lastEdited: string
  sharedWith: string[]
  versions: { id: string; content: string; editedAt: string; editedBy: string }[]
}

export interface NoteFile {
  id: string
  workspaceId: string
  name: string
  type: 'image' | 'pdf' | 'doc' | 'spreadsheet' | 'other'
  url: string
  size: string
  folder: string
  uploadedBy: string
  uploadedAt: string
}

export interface Notification {
  id: string
  type: 'task-assigned' | 'new-message' | 'deadline' | 'meeting-reminder' | 'file-upload' | 'comment' | 'mention'
  title: string
  body: string
  read: boolean
  createdAt: string
  link?: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'task' | 'meeting' | 'milestone'
  color: string
}
