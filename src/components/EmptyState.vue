<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionLabel?: string
    showAction?: boolean
  }>(),
  {
    title: 'Nenhum produto encontrado.',
    description: 'Tente alterar sua busca ou os filtros.',
    actionLabel: 'Limpar filtros',
    showAction: true,
  },
)

defineEmits<{
  action: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-3 py-8 text-center sm:px-6 sm:py-12 dark:border-slate-600 dark:bg-slate-950"
  >
    <div
      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
      aria-hidden="true"
    >
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="11" cy="11" r="7" />
        <path stroke-linecap="round" d="m20 20-3-3" />
      </svg>
    </div>
    <h2 class="break-words text-lg font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
    <p class="mt-2 max-w-md break-words text-sm text-slate-500 dark:text-slate-400">{{ description }}</p>
    <button
      v-if="showAction"
      type="button"
      class="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
