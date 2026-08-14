import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RATINGS_STORAGE_KEY, useRatingsStore } from '@/stores/ratingsStore'
import type { UserRatingValue } from '@/types/product'

describe('useRatingsStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('inicia vazia quando não há persistência', () => {
    const store = useRatingsStore()

    expect(store.ratings).toEqual({})
    expect(store.getRating(1)).toBeUndefined()
    expect(store.hasRating(1)).toBe(false)
  })

  it('adiciona avaliação vinculada ao ID e persiste somente o mapa id → estrelas', () => {
    const store = useRatingsStore()

    expect(store.setRating(7, 5)).toBe(true)
    expect(store.getRating(7)).toBe(5)
    expect(store.hasRating(7)).toBe(true)
    expect(store.hasRating(3)).toBe(false)
    expect(JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) ?? '{}')).toEqual({ '7': 5 })
  })

  it('altera a avaliação existente sem criar outra entrada', () => {
    const store = useRatingsStore()

    store.setRating(7, 4)
    store.setRating(7, 5)

    expect(store.getRating(7)).toBe(5)
    expect(Object.keys(store.ratings)).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) ?? '{}')).toEqual({ '7': 5 })
  })

  it('mantém avaliações de IDs diferentes isoladas', () => {
    const store = useRatingsStore()

    store.setRating(1, 2)
    store.setRating(2, 5)

    expect(store.getRating(1)).toBe(2)
    expect(store.getRating(2)).toBe(5)
    expect(store.getRating(99)).toBeUndefined()
  })

  it('rejeita ID inválido e valor fora de 1–5', () => {
    const store = useRatingsStore()

    expect(store.setRating(0, 5)).toBe(false)
    expect(store.setRating(-1, 3)).toBe(false)
    expect(store.setRating(1.5, 3)).toBe(false)
    expect(store.setRating(1, 0 as unknown as UserRatingValue)).toBe(false)
    expect(store.setRating(1, 6 as unknown as UserRatingValue)).toBe(false)
    expect(store.ratings).toEqual({})
    expect(localStorage.getItem(RATINGS_STORAGE_KEY)).toBeNull()
  })

  it('restaura avaliações válidas e ignora conteúdo inválido do localStorage', () => {
    localStorage.setItem(
      RATINGS_STORAGE_KEY,
      JSON.stringify({
        '7': 5,
        x: 4,
        '2.5': 3,
        '0': 2,
        '-3': 1,
        '8': '5',
        '9': 6,
        '10': 1,
      }),
    )
    setActivePinia(createPinia())

    const store = useRatingsStore()
    expect(store.ratings).toEqual({ 7: 5, 10: 1 })
    expect(store.getRating(7)).toBe(5)
    expect(store.getRating(10)).toBe(1)
  })

  it('recupera avaliações após recriação do estado', () => {
    const first = useRatingsStore()
    first.setRating(4, 3)

    setActivePinia(createPinia())
    const second = useRatingsStore()

    expect(second.getRating(4)).toBe(3)
    expect(second.hasRating(4)).toBe(true)
  })

  it('ignora JSON inválido e arrays no localStorage', () => {
    localStorage.setItem(RATINGS_STORAGE_KEY, '{not-json')
    setActivePinia(createPinia())
    expect(useRatingsStore().ratings).toEqual({})

    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify([1, 2, 3]))
    setActivePinia(createPinia())
    expect(useRatingsStore().ratings).toEqual({})
  })

  it('reverte estado e retorna false quando a persistência falha', () => {
    const store = useRatingsStore()
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(store.setRating(5, 4)).toBe(false)
    expect(store.hasRating(5)).toBe(false)
    expect(store.ratings).toEqual({})

    setItem.mockRestore()
  })
})
