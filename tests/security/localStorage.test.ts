import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import ProductCard from '@/components/products/ProductCard.vue'
import {
  CUSTOM_CATEGORIES_STORAGE_KEY,
  hydrateCustomCategoriesFromStorage,
  resetCustomCategoriesState,
  useCustomCategories,
} from '@/composables/useCustomCategories'
import { PRODUCT_CATEGORY_MAX_LENGTH } from '@/schemas/productFormLimits'
import { FAVORITES_STORAGE_KEY, useFavoritesStore } from '@/stores/favoritesStore'
import { RATINGS_STORAGE_KEY, useRatingsStore } from '@/stores/ratingsStore'
import { parseStoredCustomCategories } from '@/utils/customCategory'
import { makeProduct } from '../helpers/makeProduct'
import { mountWithApp } from '../helpers/mountComponent'

describe('localStorage tratado como fonte não confiável', () => {
  beforeEach(() => {
    localStorage.clear()
    resetCustomCategoriesState()
    setActivePinia(createPinia())
  })

  it('ignora IDs inválidos, zero e negativos nos favoritos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 0, -3, 2.5, '7', null, 4]))
    setActivePinia(createPinia())

    const store = useFavoritesStore()
    expect(store.favoriteProductIds).toEqual([])
    expect(store.favoritesCount).toBe(0)
    expect(store.addFavorite(0)).toBe(false)
    expect(store.addFavorite(-1)).toBe(false)

    store.syncWithAvailableProductIds([1, 4])
    expect(store.favoriteProductIds).toEqual([1, 4])
    expect(store.favoritesCount).toBe(2)
  })

  it('ignora avaliações fora de 1–5 e chaves que não são IDs', () => {
    localStorage.setItem(
      RATINGS_STORAGE_KEY,
      JSON.stringify({
        '1': 5,
        '0': 4,
        abc: 3,
        '2': 9,
        '3': '<script>alert(1)</script>',
      }),
    )
    setActivePinia(createPinia())

    const store = useRatingsStore()
    expect(store.getRating(1)).toBe(5)
    expect(store.getRating(0)).toBeUndefined()
    expect(store.getRating(2)).toBeUndefined()
    expect(store.getRating(3)).toBeUndefined()
  })

  it('valida categorias persistidas e renderiza payload XSS como texto', async () => {
    const xss = '<script>alert(1)</script>'
    const tooLong = 'A'.repeat(PRODUCT_CATEGORY_MAX_LENGTH + 1)

    expect(parseStoredCustomCategories([xss, tooLong, 12, '  Esportes  '])).toEqual([
      xss,
      'Esportes',
    ])

    localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify([xss]))
    hydrateCustomCategoriesFromStorage()
    expect(useCustomCategories().customCategories.value).toEqual([xss])

    const product = makeProduct({ category: xss })
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    expect(wrapper.text()).toContain(xss)
    expect(wrapper.find('script').exists()).toBe(false)
  })
})
