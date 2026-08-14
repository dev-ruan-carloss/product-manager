import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useProductsCatalog } from '@/composables/useProductsCatalog'
import { useFavoritesStore } from '@/stores/favoritesStore'

/**
 * Resolve IDs favoritos em produtos a partir do catálogo da sessão.
 * A store permanece a fonte de verdade dos IDs; objetos completos não são persistidos.
 */
export function useFavoriteProducts() {
  const favoritesStore = useFavoritesStore()
  const { favoriteProductIds, favoritesCount } = storeToRefs(favoritesStore)

  const {
    isLoading: catalogLoading,
    error,
    hasError,
    hasLoaded,
    loadCatalog,
    getCatalogProduct,
  } = useProductsCatalog({ autoLoad: false })

  const favoriteProducts = computed(() =>
    favoriteProductIds.value.flatMap((id) => {
      const product = getCatalogProduct(id)
      return product !== undefined ? [product] : []
    }),
  )

  const unavailableFavoritesCount = computed(() => {
    if (catalogLoading.value || hasError.value || !hasLoaded.value) {
      return 0
    }

    return Math.max(0, favoritesCount.value - favoriteProducts.value.length)
  })

  const isLoading = computed(
    () => favoriteProductIds.value.length > 0 && catalogLoading.value && !hasLoaded.value,
  )

  const isEmpty = computed(
    () => !isLoading.value && !hasError.value && favoritesCount.value === 0,
  )

  async function loadFavoriteProducts(): Promise<void> {
    if (favoriteProductIds.value.length === 0) {
      return
    }

    await loadCatalog()
  }

  function isFavorite(productId: number): boolean {
    return favoritesStore.isFavorite(productId)
  }

  /** Retorna false quando a persistência falha — o estado não muda silenciosamente. */
  function toggleFavorite(productId: number): boolean {
    if (favoritesStore.isFavorite(productId)) {
      return favoritesStore.removeFavorite(productId)
    }

    return favoritesStore.addFavorite(productId)
  }

  onMounted(() => {
    void loadFavoriteProducts()
  })

  watch(
    favoriteProductIds,
    (ids) => {
      if (ids.length === 0 || hasLoaded.value) {
        return
      }

      void loadFavoriteProducts()
    },
    { deep: true },
  )

  return {
    favoriteProducts,
    favoritesCount,
    unavailableFavoritesCount,
    isLoading,
    error,
    hasError,
    isEmpty,
    isFavorite,
    toggleFavorite,
    loadFavoriteProducts,
  }
}
