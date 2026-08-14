import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, nextTick } from 'vue'
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

async function mountFavorites(options: { flush?: boolean } = {}) {
  let api!: ReturnType<typeof useFavoriteProducts>

  const Host = defineComponent({
    setup() {
      api = useFavoriteProducts()
      return () => null
    },
  })

  const wrapper = mount(Host)

  if (options.flush !== false) {
    await flushPromises()
  } else {
    await nextTick()
  }

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

  it('resolve favorito válido após reload quando o produto existe no catálogo', async () => {
    const existing = makeProduct({ id: 1, title: 'Produto da API' })
    vi.mocked(productService.getProducts).mockResolvedValue([existing])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1]))

    const { api, wrapper } = await mountFavorites()

    expect(api.favoriteProducts.value).toHaveLength(1)
    expect(api.favoriteProducts.value[0]?.id).toBe(1)
    expect(api.favoritesCount.value).toBe(1)
    expect(api.isEmpty.value).toBe(false)
    expect(api.hasError.value).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([1])
    wrapper.unmount()
  })

  it('invalida favorito órfão após reload quando o produto não existe no catálogo', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct({ id: 1 })])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([21]))

    const { api, wrapper } = await mountFavorites()

    expect(api.favoriteProducts.value).toEqual([])
    expect(api.favoritesCount.value).toBe(0)
    expect(api.isEmpty.value).toBe(true)
    expect(api.hasError.value).toBe(false)
    expect(useFavoritesStore().isFavorite(21)).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([])
    wrapper.unmount()
  })

  it('mantém favoritos válidos e descarta órfãos em uma lista mista', async () => {
    const first = makeProduct({ id: 1, title: 'Um' })
    const second = makeProduct({ id: 7, title: 'Sete' })
    vi.mocked(productService.getProducts).mockResolvedValue([first, second])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 7, 999]))

    const { api, wrapper } = await mountFavorites()

    expect(api.favoriteProducts.value.map((product) => product.id)).toEqual([1, 7])
    expect(api.favoritesCount.value).toBe(2)
    expect(useFavoritesStore().isFavorite(999)).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([1, 7])
    wrapper.unmount()
  })

  it('resolve produto criado e favoritado na mesma sessão', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct({ id: 1 })])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    const { api, wrapper } = await mountFavorites()
    const catalog = useProductsCatalog({ autoLoad: false })
    const created = makeProduct({
      id: 21,
      title: 'Criado na sessão',
      rating: { rate: 0, count: 0 },
    })

    catalog.addCreatedProduct(created)
    expect(useFavoritesStore().addFavorite(21)).toBe(true)
    await flushPromises()

    expect(api.favoriteProducts.value).toHaveLength(1)
    expect(api.favoriteProducts.value[0]?.title).toBe('Criado na sessão')
    expect(api.favoritesCount.value).toBe(1)
    expect(api.isEmpty.value).toBe(false)
    wrapper.unmount()
  })

  it('invalida favorito de produto criado que não persiste no GET após reload', async () => {
    const created = makeProduct({
      id: 21,
      title: 'Criado na sessão',
      rating: { rate: 0, count: 0 },
    })
    const catalog = useProductsCatalog({ autoLoad: false })
    catalog.addCreatedProduct(created)
    expect(useFavoritesStore().addFavorite(21)).toBe(true)
    expect(useFavoritesStore().favoritesCount).toBe(1)

    resetProductsCatalogState()
    setActivePinia(createPinia())
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct({ id: 1 })])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    const { api, wrapper } = await mountFavorites()

    expect(api.favoriteProducts.value).toEqual([])
    expect(api.favoritesCount.value).toBe(0)
    expect(api.isEmpty.value).toBe(true)
    expect(api.hasError.value).toBe(false)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([])
    wrapper.unmount()
  })

  it('permanece seguro com valores inválidos no localStorage', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct({ id: 1 })])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([-3, '1', null, {}, [], 0, 2.5, 1, 1]),
    )

    const { api, wrapper } = await mountFavorites()

    expect(api.favoriteProducts.value.map((product) => product.id)).toEqual([1])
    expect(api.favoritesCount.value).toBe(1)
    expect(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]')).toEqual([1])
    wrapper.unmount()
  })

  it('não antecipa o contador enquanto o catálogo ainda não resolveu os IDs', async () => {
    let resolveProducts!: (value: ReturnType<typeof makeProduct>[]) => void
    vi.mocked(productService.getProducts).mockReturnValue(
      new Promise((resolve) => {
        resolveProducts = resolve
      }),
    )
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([21]))

    const { api, wrapper } = await mountFavorites({ flush: false })

    expect(api.isLoading.value).toBe(true)
    expect(api.favoritesCount.value).toBe(0)
    expect(api.favoriteProducts.value).toEqual([])
    expect(api.isEmpty.value).toBe(false)
    expect(api.hasError.value).toBe(false)

    resolveProducts([makeProduct({ id: 1 })])
    await flushPromises()

    expect(api.isLoading.value).toBe(false)
    expect(api.favoritesCount.value).toBe(0)
    expect(api.isEmpty.value).toBe(true)
    wrapper.unmount()
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
