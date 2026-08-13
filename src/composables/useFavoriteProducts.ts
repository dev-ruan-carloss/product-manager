import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { isAppError, toAppError } from '@/config/api'
import { productService } from '@/services/productService'
import { useFavoritesStore } from '@/stores/favoritesStore'
import type { AppError } from '@/types/api'
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
  const error = ref<AppError | null>(null)
  const hasLoadedCatalog = ref(false)
  const hasError = computed(() => error.value !== null)

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
      error.value = null
      hasLoadedCatalog.value = true
      return
    }

    isLoading.value = true
    error.value = null

    try {
      catalogProducts.value = await productService.getProducts()
      hasLoadedCatalog.value = true
    } catch (caught: unknown) {
      error.value = isAppError(caught) ? caught : toAppError(caught)
      catalogProducts.value = []
      hasLoadedCatalog.value = false
    } finally {
      isLoading.value = false
    }
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
    (ids, previousIds = []) => {
      if (ids.length === 0) {
        catalogProducts.value = []
        error.value = null
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
    error,
    hasError,
    isEmpty,
    isFavorite,
    toggleFavorite,
    loadFavoriteProducts,
  }
}
