import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/** Chave centralizada para persistência dos IDs favoritos no localStorage. */
export const FAVORITES_STORAGE_KEY = 'product-management:favorites'

function parseFavoriteIds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return []
  }

  const uniqueIds = new Set<number>()

  for (const item of value) {
    if (typeof item === 'number' && Number.isInteger(item)) {
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

  function addFavorite(productId: number): void {
    if (favoriteProductIds.value.includes(productId)) {
      return
    }

    favoriteProductIds.value.push(productId)
    persistFavoriteIds(favoriteProductIds.value)
  }

  function removeFavorite(productId: number): void {
    favoriteProductIds.value = favoriteProductIds.value.filter((id) => id !== productId)
    persistFavoriteIds(favoriteProductIds.value)
  }

  return {
    favoriteProductIds,
    favoritesCount,
    isFavorite,
    addFavorite,
    removeFavorite,
  }
})
