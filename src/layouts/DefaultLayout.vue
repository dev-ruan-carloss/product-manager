<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>
