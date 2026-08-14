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
  const favoriteProductIds = ref<number[]>(loadFavoriteIds())

  const favoritesCount = computed(() => favoriteProductIds.value.length)

  function isFavorite(productId: number): boolean {
    return favoriteProductIds.value.includes(productId)
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

    const previous = [...favoriteProductIds.value]
    favoriteProductIds.value.push(productId)

    try {
      persistFavoriteIds(favoriteProductIds.value)
      return true
    } catch {
      favoriteProductIds.value = previous
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

    if (!favoriteProductIds.value.includes(productId)) {
      return true
    }

    const previous = [...favoriteProductIds.value]
    favoriteProductIds.value = favoriteProductIds.value.filter((id) => id !== productId)

    try {
      persistFavoriteIds(favoriteProductIds.value)
      return true
    } catch {
      favoriteProductIds.value = previous
      return false
    }
  }

  return {
    favoriteProductIds,
    favoritesCount,
    isFavorite,
    addFavorite,
    removeFavorite,
  }
})
