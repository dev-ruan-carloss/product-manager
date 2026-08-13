import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/services/productService', () => ({
  productService: {
    getProductById: vi.fn(),
  },
}))

import { useProductDetails } from '@/composables/useProductDetails'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import { makeProduct } from '../helpers/makeProduct'

describe('useProductDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('diferencia produto inexistente (404) de falha de API', async () => {
    const notFound: AppError = {
      kind: 'notFound',
      message: 'Not Found',
      status: 404,
      retryable: false,
    }

    vi.mocked(productService.getProductById).mockRejectedValueOnce(notFound)

    const productId = ref<number | null>(99)
    const details = useProductDetails(productId)
    await flushPromises()

    expect(details.notFound.value).toBe(true)
    expect(details.hasError.value).toBe(false)
    expect(details.product.value).toBeNull()
  })

  it('marca hasError em falha 500 sem tratar como notFound', async () => {
    const serverError: AppError = {
      kind: 'server',
      message: 'Server Error',
      status: 500,
      retryable: true,
    }

    vi.mocked(productService.getProductById).mockRejectedValueOnce(serverError)

    const productId = ref<number | null>(1)
    const details = useProductDetails(productId)
    await flushPromises()

    expect(details.hasError.value).toBe(true)
    expect(details.error.value?.kind).toBe('server')
    expect(details.notFound.value).toBe(false)
  })

  it('carrega produto válido', async () => {
    const product = makeProduct()
    vi.mocked(productService.getProductById).mockResolvedValueOnce(product)

    const productId = ref<number | null>(1)
    const details = useProductDetails(productId)
    await flushPromises()

    expect(details.product.value).toEqual(product)
    expect(details.hasError.value).toBe(false)
    expect(details.notFound.value).toBe(false)
  })
})
