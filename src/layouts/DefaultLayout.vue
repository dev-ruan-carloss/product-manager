<script setup lang="ts">
import Toast from 'primevue/toast'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useThemeStore } from '@/stores/themeStore'

// Garante aplicação do tema persistido/sistema ao montar o layout.
useThemeStore()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-150 dark:bg-slate-900 dark:text-slate-100">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <Toast position="top-right" />
  </div>
</template>
