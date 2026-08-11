import { computed, ref, watch, type Ref } from 'vue'

import { useDebouncedRef } from '@/composables/useDebouncedRef'
import {
  ALL_CATEGORIES,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_SORT_ORDER,
  type CatalogSortOrder,
  type CategoryFilter,
} from '@/types/catalog'
import type { Product } from '@/types/product'

const titleCollator = new Intl.Collator('pt', { sensitivity: 'base' })

function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Ordenação por avaliação:
 * 1) prioridade: `rating.rate` (nota real em estrelas);
 * 2) empate de nota: `rating.count` (pessoas que avaliaram).
 */
function compareByRating(a: Product, b: Product, direction: 'asc' | 'desc'): number {
  const rateDiff = a.rating.rate - b.rating.rate
  if (rateDiff !== 0) {
    return direction === 'asc' ? rateDiff : -rateDiff
  }

  const countDiff = a.rating.count - b.rating.count
  return direction === 'asc' ? countDiff : -countDiff
}

function compareProducts(a: Product, b: Product, sortOrder: CatalogSortOrder): number {
  switch (sortOrder) {
    case 'price-asc':
      return a.price - b.price
    case 'price-desc':
      return b.price - a.price
    case 'name-asc':
      return titleCollator.compare(a.title, b.title)
    case 'name-desc':
      return titleCollator.compare(b.title, a.title)
    case 'rating-asc':
      return compareByRating(a, b, 'asc')
    case 'rating-desc':
      return compareByRating(a, b, 'desc')
  }
}

export function useProductListControls(products: Ref<readonly Product[]>) {
  const searchInput = ref('')
  const debouncedSearchInput = useDebouncedRef(searchInput, 300)
  const selectedCategory = ref<CategoryFilter>(ALL_CATEGORIES)
  const sortOrder = ref<CatalogSortOrder>(DEFAULT_SORT_ORDER)
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

    return [...filtered].sort((a, b) => compareProducts(a, b, sortOrder.value))
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
    sortOrder.value = DEFAULT_SORT_ORDER
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
