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
  <div role="status" aria-live="polite" aria-busy="true" class="space-y-4">
    <p class="sr-only">{{ title }}. {{ description }}</p>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="index in rows"
        :key="index"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
      >
        <Skeleton width="100%" height="12rem" class="mb-4" />
        <Skeleton width="85%" height="1rem" class="mb-2" />
        <Skeleton width="35%" height="1rem" class="mb-2" />
        <Skeleton width="50%" height="0.75rem" class="mb-3" />
        <Skeleton width="40%" height="0.75rem" />
      </div>
    </div>
  </div>
</template>
