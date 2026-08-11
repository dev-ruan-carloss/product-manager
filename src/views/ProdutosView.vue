<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import ProductSearch from '@/components/products/ProductSearch.vue'
import { useProductListControls } from '@/composables/useProductListControls'
import { useProductsCatalog } from '@/composables/useProductsCatalog'
import { useFavoritesStore } from '@/stores/favoritesStore'

const favoritesStore = useFavoritesStore()
const { products, categories, isLoading, hasError, loadCatalog } = useProductsCatalog()

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

function toggleFavorite(productId: number): void {
  if (favoritesStore.isFavorite(productId)) {
    favoritesStore.removeFavorite(productId)
    return
  }

  favoritesStore.addFavorite(productId)
}

function isFavorite(productId: number): boolean {
  return favoritesStore.isFavorite(productId)
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
    <div class="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
      <ProductFilters
        v-model:search="searchInput"
        v-model:selected-category="selectedCategory"
        v-model:sort-order="sortOrder"
        :categories="categories"
        :products="products"
      />

      <section class="min-w-0 space-y-5" aria-label="Catálogo de produtos">
        <div class="hidden lg:block">
          <ProductSearch v-model="searchInput" input-id="product-search-desktop" />
        </div>

        <LoadingState v-if="isLoading" />

        <ErrorState v-else-if="hasError" @retry="loadCatalog" />

        <EmptyState
          v-else-if="totalProducts === 0"
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
