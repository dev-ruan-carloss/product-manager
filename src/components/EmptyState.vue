<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  title?: string
  description?: string
  actionLabel?: string
  showAction?: boolean
}>()

defineEmits<{
  action: []
}>()

const { t } = useI18n()

const resolvedTitle = computed(() => props.title ?? t('empty.productsTitle'))
const resolvedDescription = computed(() => props.description ?? t('empty.productsDescription'))
const resolvedActionLabel = computed(() => props.actionLabel ?? t('empty.clearFilters'))
const showActionButton = computed(() => props.showAction !== false)
</script>

<template>
  <div
    role="status"
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
    <h2 class="break-words text-lg font-semibold text-slate-900 dark:text-slate-100">{{ resolvedTitle }}</h2>
    <p class="mt-2 max-w-md break-words text-sm text-slate-500 dark:text-slate-400">{{ resolvedDescription }}</p>
    <button
      v-if="showActionButton"
      type="button"
      class="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
      @click="$emit('action')"
    >
      {{ resolvedActionLabel }}
    </button>
  </div>
</template>
