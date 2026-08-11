<script setup lang="ts">
import { computed } from 'vue'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'

import ProductSearch from '@/components/products/ProductSearch.vue'
import type { Category } from '@/types/category'
import { ALL_CATEGORIES, type CategoryFilter, type PriceSortOrder } from '@/types/catalog'
import type { Product } from '@/types/product'

const props = defineProps<{
  search: string
  selectedCategory: CategoryFilter
  sortOrder: PriceSortOrder
  categories: Category[]
  products: readonly Product[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:selectedCategory': [value: CategoryFilter]
  'update:sortOrder': [value: PriceSortOrder]
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

const sortOptions: Array<{ label: string; value: PriceSortOrder }> = [
  { label: 'Menor preço', value: 'asc' },
  { label: 'Maior preço', value: 'desc' },
]

function selectCategory(category: CategoryFilter): void {
  emit('update:selectedCategory', category)
}
</script>

<template>
  <aside
    class="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:self-start"
    aria-label="Filtros de produtos"
  >
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Produtos</h1>
      <p class="mt-1 text-sm text-slate-500">Encontre e gerencie seus produtos</p>
    </div>

    <div class="lg:hidden">
      <ProductSearch
        input-id="product-search-mobile"
        :model-value="search"
        @update:model-value="emit('update:search', $event)"
      />
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:hidden">
      <div class="space-y-1.5">
        <label class="text-xs font-medium uppercase tracking-wide text-slate-500" for="category-mobile">
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

      <div class="space-y-1.5">
        <label class="text-xs font-medium uppercase tracking-wide text-slate-500" for="sort-mobile">
          Ordenação
        </label>
        <Select
          input-id="sort-mobile"
          :model-value="sortOrder"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          @update:model-value="emit('update:sortOrder', $event)"
        />
      </div>
    </div>

    <section class="hidden space-y-3 lg:block" aria-labelledby="categories-heading">
      <h2 id="categories-heading" class="text-sm font-semibold text-slate-900">Categorias</h2>
      <ul class="space-y-1">
        <li>
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500"
            :class="
              selectedCategory === ALL_CATEGORIES
                ? 'bg-violet-50 font-medium text-violet-700'
                : 'text-slate-700 hover:bg-slate-50'
            "
            :aria-pressed="selectedCategory === ALL_CATEGORIES"
            @click="selectCategory(ALL_CATEGORIES)"
          >
            <span>Todas</span>
            <span
              class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              :aria-label="`${totalCount} produtos`"
            >
              {{ totalCount }}
            </span>
          </button>
        </li>
        <li v-for="category in categories" :key="category">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm capitalize outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500"
            :class="
              selectedCategory === category
                ? 'bg-violet-50 font-medium text-violet-700'
                : 'text-slate-700 hover:bg-slate-50'
            "
            :aria-pressed="selectedCategory === category"
            @click="selectCategory(category)"
          >
            <span>{{ category }}</span>
            <span
              class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
              :aria-label="`${categoryCounts.get(category) ?? 0} produtos`"
            >
              {{ categoryCounts.get(category) ?? 0 }}
            </span>
          </button>
        </li>
      </ul>
    </section>

    <section class="hidden space-y-3 lg:block" aria-labelledby="sort-heading">
      <h2 id="sort-heading" class="text-sm font-semibold text-slate-900">Ordenação</h2>
      <div class="space-y-3" role="radiogroup" aria-labelledby="sort-heading">
        <label
          v-for="option in sortOptions"
          :key="option.value"
          class="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700"
        >
          <RadioButton
            :input-id="`sort-${option.value}`"
            name="price-sort"
            :value="option.value"
            :model-value="sortOrder"
            @update:model-value="emit('update:sortOrder', $event)"
          />
          <span>{{ option.label }}</span>
        </label>
      </div>
    </section>
  </aside>
</template>
