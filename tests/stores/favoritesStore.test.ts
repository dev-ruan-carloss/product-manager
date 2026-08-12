import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { FAVORITES_STORAGE_KEY, useFavoritesStore } from '@/stores/favoritesStore'

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('inicia vazia quando não há persistência', () => {
    const store = useFavoritesStore()
    expect(store.favoriteProductIds).toEqual([])
    expect(store.favoritesCount).toBe(0)
  })

  it('adiciona, verifica e remove favoritos persistindo apenas IDs', () => {
    const store = useFavoritesStore()

    store.addFavorite(3)
    store.addFavorite(3)
    store.addFavorite(7)

    expect(store.isFavorite(3)).toBe(true)
    expect(store.isFavorite(7)).toBe(true)
    expect(store.favoritesCount).toBe(2)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([3, 7])

    store.removeFavorite(3)

    expect(store.isFavorite(3)).toBe(false)
    expect(store.favoritesCount).toBe(1)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([7])
  })

  it('restaura IDs válidos e ignora conteúdo inválido do localStorage', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 'x', 2.5, 4, 1]))
    setActivePinia(createPinia())

    const store = useFavoritesStore()
    expect(store.favoriteProductIds).toEqual([1, 4])
    expect(store.favoritesCount).toBe(2)
  })
})
