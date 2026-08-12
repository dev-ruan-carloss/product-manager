<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

const sortOptions = computed(() => [
  { label: t('catalog.sortPriceAsc'), value: 'price-asc' as const },
  { label: t('catalog.sortPriceDesc'), value: 'price-desc' as const },
  { label: t('catalog.sortNameAsc'), value: 'name-asc' as const },
  { label: t('catalog.sortNameDesc'), value: 'name-desc' as const },
  { label: t('catalog.sortRatingDesc'), value: 'rating-desc' as const },
  { label: t('catalog.sortRatingAsc'), value: 'rating-asc' as const },
])
</script>

<template>
  <div v-if="variant === 'select'" class="min-w-0 space-y-1.5">
    <label
      class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
      :for="inputId ?? 'product-sort'"
    >
      {{ t('catalog.sort') }}
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

  <section v-else class="min-w-0 space-y-3" aria-labelledby="sort-heading">
    <h2 id="sort-heading" class="text-sm font-semibold text-slate-900 dark:text-slate-100">
      {{ t('catalog.sort') }}
    </h2>
    <div class="space-y-3" role="radiogroup" aria-labelledby="sort-heading">
      <label
        v-for="option in sortOptions"
        :key="option.value"
        class="flex min-w-0 cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200"
      >
        <RadioButton
          :input-id="`sort-${option.value}`"
          name="catalog-sort"
          :value="option.value"
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
        <span class="min-w-0 break-words">{{ option.label }}</span>
      </label>
    </div>
  </section>
</template>
