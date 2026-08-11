import { computed, ref, watch, type Ref } from 'vue'

import { useDebouncedRef } from '@/composables/useDebouncedRef'
import {
  ALL_CATEGORIES,
  DEFAULT_ITEMS_PER_PAGE,
  type CategoryFilter,
  type PriceSortOrder,
} from '@/types/catalog'
import type { Product } from '@/types/product'

function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase()
}

export function useProductListControls(products: Ref<readonly Product[]>) {
  const searchInput = ref('')
  const debouncedSearchInput = useDebouncedRef(searchInput, 300)
  const selectedCategory = ref<CategoryFilter>(ALL_CATEGORIES)
  const sortOrder = ref<PriceSortOrder>('asc')
  const currentPage = ref(1)
  const itemsPerPage = ref(DEFAULT_ITEMS_PER_PAGE)

  const filteredProducts = computed(() => {
    const term = normalizeSearchTerm(debouncedSearchInput.value)
    const category = selectedCategory.value

    const filtered = products.value.filter((product) => {
      const matchesSearch = term.length === 0 || product.title.toLowerCase().includes(term)
      const matchesCategory = category === ALL_CATEGORIES || product.category === category
      return matchesSearch && matchesCategory
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder.value === 'asc') {
        return a.price - b.price
      }

      return b.price - a.price
    })

    return sorted
  })

  const totalProducts = computed(() => filteredProducts.value.length)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalProducts.value / itemsPerPage.value)),
  )

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredProducts.value.slice(start, start + itemsPerPage.value)
  })

  const rangeStart = computed(() => {
    if (totalProducts.value === 0) {
      return 0
    }

    return (currentPage.value - 1) * itemsPerPage.value + 1
  })

  const rangeEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage.value, totalProducts.value),
  )

  watch([debouncedSearchInput, selectedCategory, sortOrder, itemsPerPage], () => {
    currentPage.value = 1
  })

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) {
      currentPage.value = pages
    }
  })

  function clearFilters(): void {
    searchInput.value = ''
    selectedCategory.value = ALL_CATEGORIES
    sortOrder.value = 'asc'
    currentPage.value = 1
  }

  function setPage(page: number): void {
    const nextPage = Math.min(Math.max(page, 1), totalPages.value)
    currentPage.value = nextPage
  }

  return {
    searchInput,
    selectedCategory,
    sortOrder,
    currentPage,
    itemsPerPage,
    filteredProducts,
    paginatedProducts,
    totalProducts,
    totalPages,
    rangeStart,
    rangeEnd,
    clearFilters,
    setPage,
  }
}
