import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(
    (typeof localStorage !== 'undefined' && (localStorage.getItem('tf-theme') as ThemeMode)) || 'dark'
  )

  function apply() {
    document.documentElement.setAttribute('data-theme', mode.value)
    if (typeof localStorage !== 'undefined') localStorage.setItem('tf-theme', mode.value)
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  function set(m: ThemeMode) {
    mode.value = m
  }

  const isDark = computed(() => mode.value === 'dark')

  watch(mode, apply, { immediate: true })

  return { mode, isDark, toggle, set }
})
