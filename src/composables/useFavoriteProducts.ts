import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { productService } from '@/services/productService'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type { Product } from '@/types/product'

/**
 * Carrega os dados dos produtos favoritados a partir dos IDs da store.
 * A store permanece a fonte de verdade dos IDs; objetos completos não são persistidos.
 */
export function useFavoriteProducts() {
  const favoritesStore = useFavoritesStore()
  const { favoriteProductIds, favoritesCount } = storeToRefs(favoritesStore)

  const catalogProducts = ref<Product[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)
  const hasLoadedCatalog = ref(false)

  const productsById = computed(() => {
    const map = new Map<number, Product>()

    for (const product of catalogProducts.value) {
      map.set(product.id, product)
    }

    return map
  })

  const favoriteProducts = computed(() => {
    const loaded = productsById.value

    return favoriteProductIds.value.flatMap((id) => {
      const product = loaded.get(id)
      return product !== undefined ? [product] : []
    })
  })

  const unavailableFavoritesCount = computed(() => {
    if (isLoading.value || hasError.value || !hasLoadedCatalog.value) {
      return 0
    }

    return Math.max(0, favoritesCount.value - favoriteProducts.value.length)
  })

  const isEmpty = computed(
    () => !isLoading.value && !hasError.value && favoritesCount.value === 0,
  )

  async function loadFavoriteProducts(): Promise<void> {
    if (favoriteProductIds.value.length === 0) {
      catalogProducts.value = []
      isLoading.value = false
      hasError.value = false
      hasLoadedCatalog.value = true
      return
    }

    isLoading.value = true
    hasError.value = false

    try {
      catalogProducts.value = await productService.getProducts()
      hasLoadedCatalog.value = true
    } catch {
      hasError.value = true
      catalogProducts.value = []
      hasLoadedCatalog.value = false
    } finally {
      isLoading.value = false
    }
  }

  function isFavorite(productId: number): boolean {
    return favoritesStore.isFavorite(productId)
  }

  function toggleFavorite(productId: number): void {
    if (favoritesStore.isFavorite(productId)) {
      favoritesStore.removeFavorite(productId)
      return
    }

    favoritesStore.addFavorite(productId)
  }

  onMounted(() => {
    void loadFavoriteProducts()
  })

  watch(
    favoriteProductIds,
    (ids, previousIds = []) => {
      if (ids.length === 0) {
        catalogProducts.value = []
        hasError.value = false
        hasLoadedCatalog.value = true
        return
      }

      const addedIds = ids.filter((id) => !previousIds.includes(id))
      const needsFetch =
        !hasLoadedCatalog.value ||
        addedIds.some((id) => !productsById.value.has(id))

      if (needsFetch) {
        void loadFavoriteProducts()
      }
    },
    { deep: true },
  )

  return {
    favoriteProducts,
    favoritesCount,
    unavailableFavoritesCount,
    isLoading,
    hasError,
    isEmpty,
    isFavorite,
    toggleFavorite,
    loadFavoriteProducts,
  }
}
