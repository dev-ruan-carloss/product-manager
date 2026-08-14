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

import {
  resetProductsCatalogState,
  useProductsCatalog,
} from '@/composables/useProductsCatalog'
import { useCustomCategories } from '@/composables/useCustomCategories'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import { makeProduct } from '../helpers/makeProduct'

async function mountCatalog(autoLoad = true) {
  let api!: ReturnType<typeof useProductsCatalog>

  const Host = defineComponent({
    setup() {
      api = useProductsCatalog({ autoLoad })
      return () => null
    },
  })

  const wrapper = mount(Host)
  await flushPromises()
  return { api, wrapper }
}

describe('useProductsCatalog', () => {
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

  it('carrega produtos e categorias com sucesso', async () => {
    vi.mocked(productService.getProducts).mockResolvedValueOnce([makeProduct()])
    vi.mocked(productService.getCategories).mockResolvedValueOnce(['electronics'])

    const { api, wrapper } = await mountCatalog()

    expect(api.hasError.value).toBe(false)
    expect(api.products.value).toHaveLength(1)
    expect(api.categories.value).toEqual(['electronics'])
    wrapper.unmount()
  })

  it('expõe erro normalizado sem inventar produtos (Empty ≠ Error)', async () => {
    const networkError: AppError = {
      kind: 'network',
      message: 'Network Error',
      retryable: true,
    }

    vi.mocked(productService.getProducts).mockRejectedValueOnce(networkError)
    vi.mocked(productService.getCategories).mockRejectedValueOnce(networkError)

    const { api, wrapper } = await mountCatalog()

    expect(api.hasError.value).toBe(true)
    expect(api.error.value?.kind).toBe('network')
    expect(api.products.value).toEqual([])
    expect(api.isLoading.value).toBe(false)
    wrapper.unmount()
  })

  it('retry recarrega apenas a operação do catálogo', async () => {
    const serverError: AppError = {
      kind: 'server',
      message: 'Server Error',
      status: 500,
      retryable: true,
    }

    vi.mocked(productService.getProducts)
      .mockRejectedValueOnce(serverError)
      .mockResolvedValueOnce([makeProduct({ id: 2 })])
    vi.mocked(productService.getCategories)
      .mockRejectedValueOnce(serverError)
      .mockResolvedValueOnce(['jewelery'])

    const { api, wrapper } = await mountCatalog()
    expect(api.hasError.value).toBe(true)

    await api.loadCatalog()
    await flushPromises()

    expect(api.hasError.value).toBe(false)
    expect(api.products.value[0]?.id).toBe(2)
    wrapper.unmount()
  })

  it('não dispara novo GET ao remountar o catálogo já carregado', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct()])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    const first = await mountCatalog()
    const second = await mountCatalog()

    expect(productService.getProducts).toHaveBeenCalledTimes(1)
    expect(second.api.products.value).toHaveLength(1)

    first.wrapper.unmount()
    second.wrapper.unmount()
  })

  it('incorpora o produto retornado pelo POST no estado da sessão', async () => {
    const { api, wrapper } = await mountCatalog(false)
    const created = makeProduct({
      id: 21,
      title: 'Produto criado',
      price: 15.9,
      rating: { rate: 0, count: 0 },
    })

    api.addCreatedProduct(created)

    expect(api.getCatalogProduct(21)).toEqual(created)
    expect(api.products.value).toContainEqual(created)
    expect(typeof api.products.value[0]?.price).toBe('number')
    wrapper.unmount()
  })

  it('substitui o produto retornado pelo PUT no estado da sessão', async () => {
    const original = makeProduct({ id: 1, price: 7.95, rating: { rate: 4.5, count: 80 } })
    const { api, wrapper } = await mountCatalog(false)

    api.addCreatedProduct(original)
    api.replaceProduct(
      makeProduct({
        id: 1,
        title: original.title,
        price: 15.9,
        rating: { rate: 0, count: 0 },
      }),
      original,
    )

    expect(api.getCatalogProduct(1)?.price).toBe(15.9)
    expect(api.getCatalogProduct(1)?.rating).toEqual({ rate: 4.5, count: 80 })
    wrapper.unmount()
  })

  it('mantém CREATE/UPDATE locais quando um GET posterior não persiste a alteração', async () => {
    const original = makeProduct({ id: 1, title: 'Original', price: 7.95 })
    const created = makeProduct({
      id: 21,
      title: 'Criado na sessão',
      price: 15.9,
      rating: { rate: 0, count: 0 },
    })

    vi.mocked(productService.getProducts).mockResolvedValue([original])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    const { api, wrapper } = await mountCatalog()

    api.addCreatedProduct(created)
    api.replaceProduct(makeProduct({ id: 1, title: 'Original', price: 15.9 }), original)

    vi.mocked(productService.getProducts).mockResolvedValueOnce([original])
    await api.loadCatalog()
    await flushPromises()

    expect(api.getCatalogProduct(1)?.price).toBe(15.9)
    expect(api.getCatalogProduct(21)?.title).toBe('Criado na sessão')
    expect(api.products.value).toHaveLength(2)
    wrapper.unmount()
  })

  it('une categorias da API com categorias customizadas da sessão', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([makeProduct()])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics', 'jewelery'])

    const { addCustomCategory } = useCustomCategories()
    addCustomCategory('Esportes')

    const { api, wrapper } = await mountCatalog()

    expect(api.categories.value).toEqual(['electronics', 'jewelery', 'Esportes'])
    wrapper.unmount()
  })
})
