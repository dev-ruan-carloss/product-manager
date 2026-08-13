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

import { useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import { makeProduct } from '../helpers/makeProduct'

async function mountCatalog() {
  let api!: ReturnType<typeof useProductsCatalog>

  const Host = defineComponent({
    setup() {
      api = useProductsCatalog()
      return () => null
    },
  })

  const wrapper = mount(Host)
  await flushPromises()
  return { api, wrapper }
}

describe('useProductsCatalog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
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
})
