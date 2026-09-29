<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useWorkspaceStore } from '../stores/workspace'
import { useAuthStore } from '../stores/auth'
import Avatar from '../components/ui/Avatar.vue'
import { formatTime } from '../utils'

const ws = useWorkspaceStore()
const auth = useAuthStore()

const activeChannelId = ref(ws.workspaceChannels[0]?.id || 'ch1')
const activeChannel = computed(() => ws.workspaceChannels.find(c => c.id === activeChannelId.value))
const messages = computed(() => ws.getChannelMessages(activeChannelId.value))
const messageText = ref('')
const typing = ref(false)
const showEmojiPicker = ref<string | null>(null)
const messagesEnd = ref<HTMLElement | null>(null)

const emojis = ['👍', '🎉', '🔥', '👀', '💯', '✅', '❤️', '😂', '🚀', '📌', '🎨', '🍕']

function scrollToBottom() {
  nextTick(() => messagesEnd.value?.scrollIntoView({ behavior: 'smooth' }))
}

watch(activeChannelId, scrollToBottom)
watch(messages, scrollToBottom, { deep: true })

function sendMessage() {
  if (!messageText.value.trim()) return
  ws.addMessage(activeChannelId.value, auth.currentUser!.id, messageText.value)
  messageText.value = ''
  typing.value = false
  scrollToBottom()
}

function toggleReaction(messageId: string, emoji: string) {
  ws.toggleReaction(messageId, emoji, auth.currentUser!.id)
}

function addReaction(messageId: string, emoji: string) {
  ws.toggleReaction(messageId, emoji, auth.currentUser!.id)
  showEmojiPicker.value = null
}

function onInput() {
  typing.value = true
  setTimeout(() => { typing.value = false }, 2000)
}

const onlineMembers = computed(() =>
  auth.allUsers.filter(u => activeChannel.value?.members.includes(u.id) && u.online)
)
</script>

<template>
  <div class="chat-page">
    <!-- Channels sidebar -->
    <div class="chat-sidebar">
      <div class="cs-header">
        <h3>Channels</h3>
        <button class="cs-add" title="New channel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div class="cs-list">
        <button v-for="ch in ws.workspaceChannels" :key="ch.id" class="cs-item" :class="{ active: ch.id === activeChannelId }" @click="activeChannelId = ch.id">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path v-if="ch.isPrivate" d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4"/><path v-else d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span class="cs-name">{{ ch.name }}</span>
          <span v-if="ch.unread > 0" class="cs-unread">{{ ch.unread }}</span>
        </button>
      </div>
      <div class="cs-section">
        <h4>Direct Messages</h4>
        <div class="dm-list">
          <button v-for="u in onlineMembers.slice(0, 5)" :key="u.id" class="dm-item">
            <Avatar :user-id="u.id" size="xs" showStatus :online="u.online" />
            <span class="dm-name">{{ u.name }}</span>
            <span v-if="u.online" class="dm-online" />
          </button>
        </div>
      </div>
    </div>

    <!-- Chat area -->
    <div class="chat-main">
      <div class="chat-header">
        <div class="ch-info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <div>
            <h3>{{ activeChannel?.name }}</h3>
            <span class="ch-desc">{{ activeChannel?.description }}</span>
          </div>
        </div>
        <div class="ch-members">
          <Avatar v-for="mid in activeChannel?.members.slice(0, 4)" :key="mid" :user-id="mid" size="xs" />
          <span v-if="activeChannel && activeChannel.members.length > 4" class="ch-count">+{{ activeChannel.members.length - 4 }}</span>
        </div>
      </div>

      <div class="chat-messages">
        <div v-for="(msg, i) in messages" :key="msg.id" class="msg-group">
          <div v-if="i === 0 || messages[i-1].userId !== msg.userId" class="msg-author-row">
            <Avatar :user-id="msg.userId" size="sm" />
            <span class="msg-author">{{ auth.getUserById(msg.userId)?.name }}</span>
            <span class="msg-time">{{ formatTime(msg.createdAt) }}</span>
          </div>
          <div class="msg-content" :class="{ grouped: i > 0 && messages[i-1].userId === msg.userId }">
            <p class="msg-text">{{ msg.text }}</p>
            <div v-if="msg.reactions && Object.keys(msg.reactions).length > 0" class="msg-reactions">
              <button v-for="(users, emoji) in msg.reactions" :key="emoji" class="reaction-pill" :class="{ mine: users.includes(auth.currentUser!.id) }" @click="toggleReaction(msg.id, emoji as string)">
                <span>{{ emoji }}</span>
                <span class="rx-count">{{ users.length }}</span>
              </button>
              <button class="add-reaction" @click="showEmojiPicker = showEmojiPicker === msg.id ? null : msg.id">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </button>
              <div v-if="showEmojiPicker === msg.id" class="emoji-picker">
                <button v-for="e in emojis" :key="e" @click="addReaction(msg.id, e)">{{ e }}</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="typing" class="typing-indicator">
          <span class="dot" /><span class="dot" /><span class="dot" />
        </div>
        <div ref="messagesEnd" />
      </div>

      <div class="chat-input-area">
        <div class="chat-input-wrap">
          <button class="input-icon" title="Attach file">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <input v-model="messageText" type="text" placeholder="Message #{{ activeChannel?.name }}" @keyup.enter="sendMessage" @input="onInput" />
          <button class="input-icon" title="Emoji">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </button>
          <button class="send-btn" @click="sendMessage" :disabled="!messageText.trim()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page { display: flex; height: calc(100vh - var(--topbar-h) - 64px); gap: 0; margin: -32px -32px 0; }

.chat-sidebar { width: 240px; border-right: 1px solid var(--border-color); background: var(--bg-surface); display: flex; flex-direction: column; flex-shrink: 0; }
.cs-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 16px 12px; }
.cs-header h3 { font-size: 0.9rem; }
.cs-add { color: var(--text-muted); display: flex; padding: 4px; border-radius: 6px; }
.cs-add:hover { background: var(--bg-hover); color: var(--text-primary); }
.cs-list { flex: 1; overflow-y: auto; padding: 0 8px; }
.cs-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 0.85rem; transition: background 0.1s; text-align: left; }
.cs-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.cs-item.active { background: var(--brand-50); color: var(--brand-600); }
.cs-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cs-unread { background: var(--brand-500); color: white; font-size: 0.65rem; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.cs-section { padding: 16px; border-top: 1px solid var(--border-color); }
.cs-section h4 { font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; }
.dm-list { display: flex; flex-direction: column; gap: 4px; }
.dm-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: var(--radius-sm); width: 100%; font-size: 0.82rem; color: var(--text-secondary); }
.dm-item:hover { background: var(--bg-hover); }
.dm-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.chat-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.chat-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--border-color); background: var(--bg-surface); }
.ch-info { display: flex; align-items: center; gap: 10px; }
.ch-info h3 { font-size: 1rem; }
.ch-desc { font-size: 0.78rem; color: var(--text-muted); }
.ch-members { display: flex; align-items: center; }
.ch-count { font-size: 0.72rem; color: var(--text-muted); margin-left: 4px; }

.chat-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 4px; }
.msg-group { margin-bottom: 16px; }
.msg-author-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.msg-author { font-size: 0.85rem; font-weight: 700; }
.msg-time { font-size: 0.72rem; color: var(--text-muted); }
.msg-content.grouped { padding-left: 46px; }
.msg-text { font-size: 0.88rem; line-height: 1.5; color: var(--text-primary); }
.msg-reactions { display: flex; align-items: center; gap: 4px; margin-top: 6px; flex-wrap: wrap; position: relative; }
.reaction-pill { display: flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 12px; background: var(--bg-surface-2); border: 1px solid var(--border-color); font-size: 0.78rem; transition: all 0.15s; }
.reaction-pill.mine { background: var(--brand-50); border-color: var(--brand-400); }
.reaction-pill:hover { transform: scale(1.05); }
.rx-count { font-weight: 600; font-size: 0.72rem; }
.add-reaction { padding: 2px 6px; border-radius: 12px; color: var(--text-muted); display: flex; align-items: center; }
.add-reaction:hover { background: var(--bg-hover); color: var(--text-primary); }
.emoji-picker { position: absolute; top: 100%; left: 0; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 8px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; box-shadow: var(--shadow-lg); z-index: var(--z-dropdown); }
.emoji-picker button { font-size: 1.1rem; padding: 4px; border-radius: 4px; }
.emoji-picker button:hover { background: var(--bg-hover); }

.typing-indicator { display: flex; gap: 4px; padding: 8px 0; }
.typing-indicator .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: bounce 1.4s infinite ease-in-out both; }
.typing-indicator .dot:nth-child(2) { animation-delay: 0.15s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }

.chat-input-area { padding: 16px 24px; border-top: 1px solid var(--border-color); background: var(--bg-surface); }
.chat-input-wrap { display: flex; align-items: center; gap: 8px; background: var(--bg-surface-2); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 4px 8px; }
.chat-input-wrap:focus-within { border-color: var(--brand-500); }
.input-icon { color: var(--text-muted); display: flex; padding: 6px; border-radius: 6px; }
.input-icon:hover { color: var(--text-primary); background: var(--bg-hover); }
.chat-input-wrap input { flex: 1; border: none; outline: none; background: none; color: var(--text-primary); font-size: 0.88rem; padding: 8px 0; }
.chat-input-wrap input::placeholder { color: var(--text-muted); }
.send-btn { width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--gradient-brand); color: white; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.send-btn:disabled { opacity: 0.4; }
.send-btn:not(:disabled):hover { transform: scale(1.05); }

@media (max-width: 700px) {
  .chat-sidebar { display: none; }
}
</style>
