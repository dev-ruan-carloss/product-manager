import { createPinia, setActivePinia } from 'pinia'
import { computed, effectScope, ref, type EffectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useDisplayedRating } from '@/composables/useDisplayedRating'
import { RATINGS_STORAGE_KEY, useRatingsStore } from '@/stores/ratingsStore'
import { makeProduct } from '../helpers/makeProduct'

describe('useDisplayedRating', () => {
  let scope: EffectScope

  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    localStorage.clear()
  })

  it('exibe o rating da API quando não há avaliação local', () => {
    const product = makeProduct({ id: 7, rating: { rate: 4.2, count: 10 } })
    const api = scope.run(() => useDisplayedRating(product))!

    expect(api.hasUserRating.value).toBe(false)
    expect(api.userRating.value).toBeUndefined()
    expect(api.displayedRating.value).toEqual({ rate: 4.2, count: 10 })
  })

  it('recalcula média e count ao adicionar avaliação e ao alterar', () => {
    const product = makeProduct({ id: 7, rating: { rate: 4.2, count: 10 } })
    const api = scope.run(() => useDisplayedRating(product))!
    const store = useRatingsStore()

    store.setRating(7, 5)
    expect(api.hasUserRating.value).toBe(true)
    expect(api.displayedRating.value.count).toBe(11)
    expect(api.displayedRating.value.rate.toFixed(1)).toBe('4.3')

    store.setRating(7, 3)
    expect(api.displayedRating.value.count).toBe(11)
    expect(api.displayedRating.value.rate).toBeCloseTo((4.2 * 10 + 3) / 11, 10)
  })

  it('não mistura avaliações de IDs diferentes', () => {
    const product = makeProduct({ id: 7, rating: { rate: 4.2, count: 10 } })
    const api = scope.run(() => useDisplayedRating(product))!
    const store = useRatingsStore()

    store.setRating(99, 5)
    expect(api.hasUserRating.value).toBe(false)
    expect(api.displayedRating.value).toEqual({ rate: 4.2, count: 10 })
  })

  it('recupera avaliação persistida ao recriar o estado', () => {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify({ '7': 5 }))
    setActivePinia(createPinia())

    const product = makeProduct({ id: 7, rating: { rate: 4.2, count: 10 } })
    const restored = effectScope()
    const api = restored.run(() => useDisplayedRating(product))!

    expect(api.hasUserRating.value).toBe(true)
    expect(api.userRating.value).toBe(5)
    expect(api.displayedRating.value.count).toBe(11)
    restored.stop()
  })

  it('acompanha troca do produto reativo', () => {
    const productA = makeProduct({ id: 1, rating: { rate: 4, count: 2 } })
    const productB = makeProduct({ id: 2, rating: { rate: 1, count: 1 } })
    const current = ref(productA)
    const api = scope.run(() => useDisplayedRating(current))!
    const store = useRatingsStore()

    store.setRating(1, 5)
    store.setRating(2, 1)

    expect(api.displayedRating.value.count).toBe(3)

    current.value = productB
    expect(api.userRating.value).toBe(1)
    expect(api.displayedRating.value.count).toBe(2)
  })

  it('não altera o rating original do produto', () => {
    const product = makeProduct({ id: 7, rating: { rate: 4.2, count: 10 } })
    scope.run(() => useDisplayedRating(product))
    useRatingsStore().setRating(7, 5)

    expect(product.rating).toEqual({ rate: 4.2, count: 10 })
  })

  it('aceita getter computado do produto', () => {
    const product = makeProduct({ id: 3, rating: { rate: 2, count: 4 } })
    const source = computed(() => product)
    const api = scope.run(() => useDisplayedRating(source))!

    useRatingsStore().setRating(3, 4)
    expect(api.displayedRating.value.count).toBe(5)
  })
})
