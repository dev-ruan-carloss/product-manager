import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { isThemeMode, THEME_STORAGE_KEY, type ThemeMode } from '@/types/theme'

function getSystemTheme(): ThemeMode {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function loadTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)

    if (isThemeMode(raw)) {
      return raw
    }
  } catch {
    // localStorage indisponível ou ilegível — segue para preferência do sistema.
  }

  return getSystemTheme()
}

function persistTheme(theme: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

function applyThemeToDocument(theme: ThemeMode): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeMode>(loadTheme())

  applyThemeToDocument(theme.value)

  const isDark = computed(() => theme.value === 'dark')

  function setTheme(nextTheme: ThemeMode): void {
    theme.value = nextTheme
    persistTheme(nextTheme)
    applyThemeToDocument(nextTheme)
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }
})
