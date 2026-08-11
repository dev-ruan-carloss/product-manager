<script setup lang="ts">
import { computed } from 'vue'
import Select from 'primevue/select'

import ProductSearch from '@/components/products/ProductSearch.vue'
import ProductSort from '@/components/products/ProductSort.vue'
import type { Category } from '@/types/category'
import { ALL_CATEGORIES, type CatalogSortOrder, type CategoryFilter } from '@/types/catalog'
import type { Product } from '@/types/product'

const props = defineProps<{
  search: string
  selectedCategory: CategoryFilter
  sortOrder: CatalogSortOrder
  categories: Category[]
  products: readonly Product[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:selectedCategory': [value: CategoryFilter]
  'update:sortOrder': [value: CatalogSortOrder]
}>()

const categoryCounts = computed(() => {
  const counts = new Map<string, number>()

  for (const product of props.products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
  }

  return counts
})

const totalCount = computed(() => props.products.length)

const categoryOptions = computed(() => [
  { label: 'Todas as categorias', value: ALL_CATEGORIES },
  ...props.categories.map((category) => ({
    label: category,
    value: category,
  })),
])

function selectCategory(category: CategoryFilter): void {
  emit('update:selectedCategory', category)
}
</script>

<template>
  <aside
    class="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:gap-5 sm:p-5 lg:sticky lg:top-6 lg:self-start dark:border-slate-700 dark:bg-slate-950"
    aria-label="Filtros de produtos"
  >
    <div class="min-w-0">
      <h1 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">Produtos</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Encontre e gerencie seus produtos</p>
    </div>

    <div class="min-w-0 lg:hidden">
      <ProductSearch
        input-id="product-search-mobile"
        :model-value="search"
        @update:model-value="emit('update:search', $event)"
      />
    </div>

    <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:hidden">
      <div class="min-w-0 flex-1 basis-full sm:basis-[calc(50%-0.375rem)]">
        <div class="min-w-0 space-y-1.5">
          <label class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400" for="category-mobile">
            Categoria
          </label>
          <Select
            input-id="category-mobile"
            :model-value="selectedCategory"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            @update:model-value="selectCategory"
          />
        </div>
      </div>

      <div class="min-w-0 flex-1 basis-full sm:basis-[calc(50%-0.375rem)]">
        <ProductSort
          variant="select"
          input-id="sort-mobile"
          :model-value="sortOrder"
          @update:model-value="emit('update:sortOrder', $event)"
        />
      </div>
    </div>

    <section class="hidden min-w-0 space-y-3 lg:block" aria-labelledby="categories-heading">
      <h2 id="categories-heading" class="text-sm font-semibold text-slate-900 dark:text-slate-100">Categorias</h2>
      <ul class="space-y-1">
        <li>
          <button
            type="button"
            class="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500"
            :class="
              selectedCategory === ALL_CATEGORIES
                ? 'bg-violet-50 font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
            "
            :aria-pressed="selectedCategory === ALL_CATEGORIES"
            @click="selectCategory(ALL_CATEGORIES)"
          >
            <span class="min-w-0 break-words">Todas</span>
            <span
              class="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              :aria-label="`${totalCount} produtos`"
            >
              {{ totalCount }}
            </span>
          </button>
        </li>
        <li v-for="category in categories" :key="category">
          <button
            type="button"
            class="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm capitalize outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500"
            :class="
              selectedCategory === category
                ? 'bg-violet-50 font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
            "
            :aria-pressed="selectedCategory === category"
            @click="selectCategory(category)"
          >
            <span class="min-w-0 break-words">{{ category }}</span>
            <span
              class="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              :aria-label="`${categoryCounts.get(category) ?? 0} produtos`"
            >
              {{ categoryCounts.get(category) ?? 0 }}
            </span>
          </button>
        </li>
      </ul>
    </section>

    <div class="hidden min-w-0 lg:block">
      <ProductSort
        variant="radiogroup"
        :model-value="sortOrder"
        @update:model-value="emit('update:sortOrder', $event)"
      />
    </div>
  </aside>
</template>
