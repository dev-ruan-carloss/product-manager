import { computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useProductsCatalog } from '@/composables/useProductsCatalog'
import { useFavoritesStore } from '@/stores/favoritesStore'

function syncResolvedFavorites(): void {
  const favoritesStore = useFavoritesStore()
  const { products, hasLoaded, hasError } = useProductsCatalog({ autoLoad: false })

  if (!hasLoaded.value || hasError.value) {
    return
  }

  favoritesStore.syncWithAvailableProductIds(products.value.map((product) => product.id))
}

/**
 * Carrega o catálogo quando há IDs persistidos ainda não cruzados com produtos.
 * Deve rodar no shell da aplicação para o contador do Header não ficar defasado.
 */
export async function hydrateFavoritesFromCatalog(): Promise<void> {
  const favoritesStore = useFavoritesStore()

  if (!favoritesStore.needsCatalogSync) {
    return
  }

  const { loadCatalog } = useProductsCatalog({ autoLoad: false })
  await loadCatalog()
  syncResolvedFavorites()
}

/**
 * Resolve IDs favoritos em produtos a partir do catálogo da sessão.
 * A store permanece a fonte de verdade dos IDs; objetos completos não são persistidos.
 * IDs lidos do localStorage só entram no contador após cruzamento com o catálogo.
 */
export function useFavoriteProducts() {
  const favoritesStore = useFavoritesStore()
  const { favoriteProductIds, favoritesCount, needsCatalogSync } = storeToRefs(favoritesStore)

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
    if (catalogLoading.value || hasError.value || !hasLoaded.value || needsCatalogSync.value) {
      return 0
    }

    return Math.max(0, favoritesCount.value - favoriteProducts.value.length)
  })

  const isLoading = computed(() => {
    if (hasError.value) {
      return false
    }

    if (needsCatalogSync.value) {
      return !hasLoaded.value
    }

    return favoriteProductIds.value.length > 0 && catalogLoading.value && !hasLoaded.value
  })

  const isEmpty = computed(
    () =>
      !isLoading.value &&
      !hasError.value &&
      !needsCatalogSync.value &&
      favoritesCount.value === 0,
  )

  async function loadFavoriteProducts(): Promise<void> {
    if (favoriteProductIds.value.length === 0 && !needsCatalogSync.value) {
      return
    }

    await loadCatalog()
    syncResolvedFavorites()
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
    [favoriteProductIds, needsCatalogSync],
    () => {
      if (hasLoaded.value) {
        if (needsCatalogSync.value) {
          syncResolvedFavorites()
        }
        return
      }

      if (favoriteProductIds.value.length === 0 && !needsCatalogSync.value) {
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
