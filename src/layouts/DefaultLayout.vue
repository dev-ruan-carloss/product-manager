<script setup lang="ts">
import Toast from 'primevue/toast'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <Toast position="top-right" />
  </div>
</template>
