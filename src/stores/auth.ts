import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { users as seedUsers } from '../data/mock'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  const allUsers = ref<User[]>(seedUsers)

  function login(email: string, _password: string) {
    loading.value = true
    setTimeout(() => {
      const user = allUsers.value.find((u) => u.email === email) || allUsers.value[0]
      currentUser.value = { ...user, online: true }
      isAuthenticated.value = true
      loading.value = false
    }, 600)
  }

  function loginWithProvider(_provider: string) {
    loading.value = true
    setTimeout(() => {
      currentUser.value = { ...allUsers.value[0], online: true }
      isAuthenticated.value = true
      loading.value = false
    }, 600)
  }

  function register(name: string, email: string, _password: string) {
    loading.value = true
    setTimeout(() => {
      const newUser: User = {
        id: 'u-new',
        name,
        email,
        avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
        role: 'owner',
        online: true,
        title: 'New Member',
      }
      allUsers.value.push(newUser)
      currentUser.value = newUser
      isAuthenticated.value = true
      loading.value = false
    }, 600)
  }

  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
  }

  function getUserById(id: string): User | undefined {
    return allUsers.value.find((u) => u.id === id)
  }

  const initials = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.avatar
  })

  return { currentUser, isAuthenticated, loading, allUsers, initials, login, loginWithProvider, register, logout, getUserById }
})
