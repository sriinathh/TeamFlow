import type { Priority, TaskStatus } from '../types'

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatRelative(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateStr)
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function daysUntil(dateStr: string): number {
  const d = new Date(dateStr)
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export const priorityColors: Record<Priority, string> = {
  low: 'var(--success-500)',
  medium: 'var(--brand-500)',
  high: 'var(--warning-500)',
  urgent: 'var(--error-500)',
}

export const priorityBg: Record<Priority, string> = {
  low: 'var(--success-50)',
  medium: 'var(--brand-50)',
  high: 'var(--warning-50)',
  urgent: 'var(--error-50)',
}

export const statusColors: Record<TaskStatus, string> = {
  backlog: '#94a3b8',
  todo: '#3b82f6',
  'in-progress': '#f59e0b',
  review: '#8b5cf6',
  done: '#10b981',
}

export const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
}

export const kanbanColumns: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done']
