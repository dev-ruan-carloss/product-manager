<script setup lang="ts">
defineProps<{
  favorited: boolean
  disabled?: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm outline-none transition hover:bg-white hover:text-violet-600 focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-violet-400"
    :class="favorited ? 'text-violet-600 dark:text-violet-400' : ''"
    :aria-pressed="favorited"
    :aria-label="favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
    :disabled="disabled"
    @click.stop="$emit('toggle')"
  >
    <svg
      class="h-5 w-5"
      viewBox="0 0 24 24"
      :fill="favorited ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
      />
    </svg>
  </button>
</template>
