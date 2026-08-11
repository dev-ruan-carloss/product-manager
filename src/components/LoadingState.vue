<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    rows?: number
  }>(),
  {
    title: 'Carregando produtos',
    description: 'Aguarde enquanto buscamos os produtos.',
    rows: 8,
  },
)
</script>

<template>
  <div role="status" aria-live="polite" aria-busy="true" class="min-w-0 space-y-3 sm:space-y-4">
    <p class="sr-only">{{ title }}. {{ description }}</p>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))] gap-3 sm:gap-4">
      <div
        v-for="index in rows"
        :key="index"
        class="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-700 dark:bg-slate-950"
      >
        <Skeleton width="100%" height="7rem" class="mb-3" />
        <Skeleton width="85%" height="1rem" class="mb-2" />
        <Skeleton width="35%" height="1rem" class="mb-2" />
        <Skeleton width="50%" height="0.75rem" class="mb-2" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
    </div>
  </div>
</template>
