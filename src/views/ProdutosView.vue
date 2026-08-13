<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import ProductSearch from '@/components/products/ProductSearch.vue'
import { useErrorPresentation } from '@/composables/useErrorPresentation'
import { useFavoriteToggle } from '@/composables/useFavoriteToggle'
import { useProductListControls } from '@/composables/useProductListControls'
import { useProductsCatalog } from '@/composables/useProductsCatalog'

const { t } = useI18n()
const { products, categories, isLoading, error, hasError, loadCatalog } = useProductsCatalog()
const { presentation } = useErrorPresentation(error, 'catalog')
const { isFavorite, toggleFavorite } = useFavoriteToggle()

const {
  searchInput,
  selectedCategory,
  sortOrder,
  currentPage,
  itemsPerPage,
  paginatedProducts,
  totalProducts,
  rangeStart,
  rangeEnd,
  clearFilters,
  setPage,
} = useProductListControls(products)

const emptyTitle = computed(() => {
  const query = searchInput.value.trim()
  if (query.length > 0) {
    return t('empty.searchTitle', { query })
  }
  return t('empty.productsTitle')
})

const emptyDescription = computed(() => {
  const query = searchInput.value.trim()
  if (query.length > 0) {
    return t('empty.searchDescription')
  }
  return t('empty.productsDescription')
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-2.5 py-3 sm:px-6 sm:py-6 lg:py-8">
    <div class="grid min-w-0 gap-3 sm:gap-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <ProductFilters
        v-model:search="searchInput"
        v-model:selected-category="selectedCategory"
        v-model:sort-order="sortOrder"
        :categories="categories"
        :products="products"
      />

      <section class="min-w-0 space-y-3 sm:space-y-5" :aria-label="t('catalog.ariaLabel')">
        <div class="hidden min-w-0 lg:block">
          <ProductSearch v-model="searchInput" input-id="product-search-desktop" autofocus />
        </div>

        <LoadingState v-if="isLoading" />

        <ErrorState
          v-else-if="hasError && presentation"
          :title="presentation.title"
          :description="presentation.description"
          :action-label="presentation.actionLabel"
          :show-action="presentation.showPrimaryAction"
          @retry="loadCatalog"
        />

        <EmptyState
          v-else-if="totalProducts === 0"
          :title="emptyTitle"
          :description="emptyDescription"
          @action="clearFilters"
        />

        <template v-else>
          <ProductGrid
            :products="paginatedProducts"
            :is-favorite="isFavorite"
            @toggle-favorite="toggleFavorite"
          />

          <ProductPagination
            :current-page="currentPage"
            :items-per-page="itemsPerPage"
            :total-products="totalProducts"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            @update:current-page="setPage"
            @update:items-per-page="itemsPerPage = $event"
          />
        </template>
      </section>
    </div>
  </div>
</template>
