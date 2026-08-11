<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionLabel?: string
  }>(),
  {
    title: 'Não foi possível carregar os produtos.',
    description: 'Verifique sua conexão e tente novamente.',
    actionLabel: 'Tentar novamente',
  },
)

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    role="alert"
    class="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"
  >
    <div
      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"
      aria-hidden="true"
    >
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v4m0 4h.01M10.3 4.3 2.8 17.1A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.7-2.9L13.7 4.3a2 2 0 0 0-3.4 0Z"
        />
      </svg>
    </div>
    <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
    <p class="mt-2 max-w-md text-sm text-slate-500">{{ description }}</p>
    <button
      type="button"
      class="mt-6 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white outline-none hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      @click="$emit('retry')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
