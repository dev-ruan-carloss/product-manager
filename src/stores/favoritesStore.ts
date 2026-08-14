import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { isProductId } from '@/types/product'

/** Chave centralizada para persistência dos IDs favoritos no localStorage. */
export const FAVORITES_STORAGE_KEY = 'product-management:favorites'

function parseFavoriteIds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return []
  }

  const uniqueIds = new Set<number>()

  for (const item of value) {
    if (isProductId(item)) {
      uniqueIds.add(item)
    }
  }

  return Array.from(uniqueIds)
}

function loadFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (raw === null) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    return parseFavoriteIds(parsed)
  } catch {
    return []
  }
}

function persistFavoriteIds(ids: readonly number[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
}

export const useFavoritesStore = defineStore('favorites', () => {
  const pendingStorageIds = ref<number[]>(loadFavoriteIds())
  const favoriteProductIds = ref<number[]>([])
  const hasSyncedWithCatalog = ref(pendingStorageIds.value.length === 0)

  const favoritesCount = computed(() => favoriteProductIds.value.length)

  const needsCatalogSync = computed(
    () => !hasSyncedWithCatalog.value && pendingStorageIds.value.length > 0,
  )

  function idsForPersistence(): number[] {
    if (hasSyncedWithCatalog.value) {
      return [...favoriteProductIds.value]
    }

    return parseFavoriteIds([...favoriteProductIds.value, ...pendingStorageIds.value])
  }

  function isFavorite(productId: number): boolean {
    return (
      favoriteProductIds.value.includes(productId) || pendingStorageIds.value.includes(productId)
    )
  }

  /**
   * Adiciona favorito e persiste. Em falha de persistência, reverte o estado
   * e retorna false — a UI deve informar o usuário (Toast contextual).
   */
  function addFavorite(productId: number): boolean {
    if (!isProductId(productId)) {
      return false
    }

    if (favoriteProductIds.value.includes(productId)) {
      return true
    }

    const previousFavorites = [...favoriteProductIds.value]
    const previousPending = [...pendingStorageIds.value]

    pendingStorageIds.value = pendingStorageIds.value.filter((id) => id !== productId)
    favoriteProductIds.value.push(productId)

    try {
      persistFavoriteIds(idsForPersistence())
      return true
    } catch {
      favoriteProductIds.value = previousFavorites
      pendingStorageIds.value = previousPending
      return false
    }
  }

  /**
   * Remove favorito e persiste. Em falha de persistência, reverte o estado
   * e retorna false.
   */
  function removeFavorite(productId: number): boolean {
    if (!isProductId(productId)) {
      return false
    }

    if (!isFavorite(productId)) {
      return true
    }

    const previousFavorites = [...favoriteProductIds.value]
    const previousPending = [...pendingStorageIds.value]

    favoriteProductIds.value = favoriteProductIds.value.filter((id) => id !== productId)
    pendingStorageIds.value = pendingStorageIds.value.filter((id) => id !== productId)

    try {
      persistFavoriteIds(idsForPersistence())
      return true
    } catch {
      favoriteProductIds.value = previousFavorites
      pendingStorageIds.value = previousPending
      return false
    }
  }

  /**
   * Mantém somente IDs que existem na fonte de produtos atual.
   * IDs órfãos são descartados da store e do localStorage.
   */
  function syncWithAvailableProductIds(availableProductIds: readonly number[]): void {
    const available = new Set<number>()

    for (const id of availableProductIds) {
      if (isProductId(id)) {
        available.add(id)
      }
    }

    const next: number[] = []
    const seen = new Set<number>()

    for (const id of [...favoriteProductIds.value, ...pendingStorageIds.value]) {
      if (!isProductId(id) || seen.has(id) || !available.has(id)) {
        continue
      }

      seen.add(id)
      next.push(id)
    }

    favoriteProductIds.value = next
    pendingStorageIds.value = []
    hasSyncedWithCatalog.value = true

    try {
      persistFavoriteIds(next)
    } catch {
      // O estado em memória permanece o conjunto resolvido; o storage será
      // reescrito na próxima persistência bem-sucedida.
    }
  }

  return {
    favoriteProductIds,
    favoritesCount,
    hasSyncedWithCatalog,
    needsCatalogSync,
    isFavorite,
    addFavorite,
    removeFavorite,
    syncWithAvailableProductIds,
  }
})
