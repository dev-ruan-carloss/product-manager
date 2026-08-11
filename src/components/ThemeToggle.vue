<script setup lang="ts">
import { computed } from 'vue'

import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

const ariaLabel = computed(() =>
  themeStore.isDark ? 'Ativar modo claro' : 'Ativar modo escuro',
)

const title = computed(() => (themeStore.isDark ? 'Modo claro' : 'Modo escuro'))
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-violet-500 sm:h-10 sm:w-10 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    :aria-label="ariaLabel"
    :aria-pressed="themeStore.isDark"
    :title="title"
    @click="themeStore.toggleTheme()"
  >
    <!-- Sol: visível no Dark Mode (ação = ir para Light) -->
    <svg
      v-if="themeStore.isDark"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        stroke-linecap="round"
        d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"
      />
    </svg>
    <!-- Lua: visível no Light Mode (ação = ir para Dark) -->
    <svg
      v-else
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"
      />
    </svg>
  </button>
</template>
