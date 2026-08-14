import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
    expect(store.hasSyncedWithCatalog).toBe(true)
    expect(store.needsCatalogSync).toBe(false)
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

  it('não conta IDs do localStorage até cruzá-los com produtos disponíveis', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 'x', 2.5, 4, 1]))
    setActivePinia(createPinia())

    const store = useFavoritesStore()
    expect(store.favoriteProductIds).toEqual([])
    expect(store.favoritesCount).toBe(0)
    expect(store.hasSyncedWithCatalog).toBe(false)
    expect(store.needsCatalogSync).toBe(true)
    expect(store.isFavorite(1)).toBe(true)
    expect(store.isFavorite(4)).toBe(true)
    expect(store.isFavorite(2)).toBe(false)
  })

  it('mantém somente favoritos resolvíveis e sincroniza o storage', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 7, 999]))
    setActivePinia(createPinia())

    const store = useFavoritesStore()
    store.syncWithAvailableProductIds([1, 7])

    expect(store.favoriteProductIds).toEqual([1, 7])
    expect(store.favoritesCount).toBe(2)
    expect(store.isFavorite(999)).toBe(false)
    expect(store.needsCatalogSync).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([1, 7])
  })

  it('descarta favorito órfão após o cruzamento com o catálogo', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([21]))
    setActivePinia(createPinia())

    const store = useFavoritesStore()
    expect(store.favoritesCount).toBe(0)

    store.syncWithAvailableProductIds([1, 2])

    expect(store.favoriteProductIds).toEqual([])
    expect(store.favoritesCount).toBe(0)
    expect(store.isFavorite(21)).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([])
  })

  it('ignora conteúdo inválido do localStorage sem quebrar o store', () => {
    const invalidValues: unknown[] = [
      '{',
      'null',
      '""',
      '[]',
      '{}',
      JSON.stringify(null),
      JSON.stringify({ id: 1 }),
      JSON.stringify([-1, 0, 2.5, '7', null, undefined, { id: 3 }, [1], true]),
      JSON.stringify([1, 1, 1, 2]),
    ]

    for (const value of invalidValues) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, String(value))
      setActivePinia(createPinia())

      const store = useFavoritesStore()
      expect(store.favoritesCount).toBe(0)
      expect(Array.isArray(store.favoriteProductIds)).toBe(true)
      expect(store.addFavorite(0)).toBe(false)
      expect(store.addFavorite(-1)).toBe(false)
    }
  })

  it('reverte estado e retorna false quando a persistência falha', () => {
    const store = useFavoritesStore()
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(store.addFavorite(5)).toBe(false)
    expect(store.isFavorite(5)).toBe(false)
    expect(store.favoritesCount).toBe(0)

    setItem.mockRestore()
  })
})
