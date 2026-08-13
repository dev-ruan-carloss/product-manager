<script setup lang="ts">
import Toast from 'primevue/toast'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { useThemeStore } from '@/stores/themeStore'

// Garante aplicação do tema persistido/sistema ao montar o layout.
useThemeStore()
</script>

<template>
  <div
    class="app-shell flex flex-col bg-slate-50 text-slate-900 transition-colors duration-150 dark:bg-slate-900 dark:text-slate-100"
  >
    <AppHeader />
    <main class="min-w-0 flex-1 bg-violet-50 dark:bg-transparent">
      <ErrorBoundary>
        <RouterView />
      </ErrorBoundary>
    </main>
    <AppFooter />
    <Toast position="top-right" />
  </div>
</template>
