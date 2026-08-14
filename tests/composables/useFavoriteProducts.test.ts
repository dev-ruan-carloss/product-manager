import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    getCategories: vi.fn(),
  },
}))

import { useFavoriteProducts } from '@/composables/useFavoriteProducts'
import { resetProductsCatalogState, useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import { FAVORITES_STORAGE_KEY, useFavoritesStore } from '@/stores/favoritesStore'
import { makeProduct } from '../helpers/makeProduct'

async function mountFavorites() {
  let api!: ReturnType<typeof useFavoriteProducts>

  const Host = defineComponent({
    setup() {
      api = useFavoriteProducts()
      return () => null
    },
  })

  const wrapper = mount(Host)
  await flushPromises()
  return { api, wrapper }
}

describe('useFavoriteProducts', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    resetProductsCatalogState()
    vi.clearAllMocks()
  })

  afterEach(() => {
    resetProductsCatalogState()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('resolve favoritos pelo ID e reflete UPDATE do catálogo da sessão', async () => {
    const original = makeProduct({ id: 1, title: 'Original', price: 7.95 })
    vi.mocked(productService.getProducts).mockResolvedValue([original])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1]))

    const { api, wrapper } = await mountFavorites()
    const catalog = useProductsCatalog({ autoLoad: false })

    expect(api.favoriteProducts.value[0]?.price).toBe(7.95)

    catalog.replaceProduct(makeProduct({ id: 1, title: 'Atualizado', price: 15.9 }), original)
    await flushPromises()

    expect(api.favoriteProducts.value).toHaveLength(1)
    expect(api.favoriteProducts.value[0]?.price).toBe(15.9)
    expect(api.favoriteProducts.value[0]?.title).toBe('Atualizado')
    expect(useFavoritesStore().isFavorite(1)).toBe(true)
    wrapper.unmount()
  })
})
