<script setup lang="ts">
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'

import type { CatalogSortOrder } from '@/types/catalog'

defineProps<{
  modelValue: CatalogSortOrder
  variant?: 'select' | 'radiogroup'
  inputId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CatalogSortOrder]
}>()

const sortOptions: Array<{ label: string; value: CatalogSortOrder }> = [
  { label: 'Menor preço', value: 'price-asc' },
  { label: 'Maior preço', value: 'price-desc' },
  { label: 'Nome A–Z', value: 'name-asc' },
  { label: 'Nome Z–A', value: 'name-desc' },
  { label: 'Maior avaliação', value: 'rating-desc' },
  { label: 'Menor avaliação', value: 'rating-asc' },
]
</script>

<template>
  <div v-if="variant === 'select'" class="space-y-1.5">
    <label
      class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
      :for="inputId ?? 'product-sort'"
    >
      Ordenação
    </label>
    <Select
      :input-id="inputId ?? 'product-sort'"
      :model-value="modelValue"
      :options="sortOptions"
      option-label="label"
      option-value="value"
      class="w-full"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>

  <section v-else class="space-y-3" aria-labelledby="sort-heading">
    <h2 id="sort-heading" class="text-sm font-semibold text-slate-900 dark:text-slate-100">Ordenação</h2>
    <div class="space-y-3" role="radiogroup" aria-labelledby="sort-heading">
      <label
        v-for="option in sortOptions"
        :key="option.value"
        class="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200"
      >
        <RadioButton
          :input-id="`sort-${option.value}`"
          name="catalog-sort"
          :value="option.value"
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </section>
</template>
