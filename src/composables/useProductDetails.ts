import { ref, watch, type Ref } from 'vue'

import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { Product } from '@/types/product'

function isAppError(error: unknown): error is AppError {
  return typeof error === 'object' && error !== null && 'message' in error
}

function isValidProduct(data: unknown): data is Product {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const candidate = data as Partial<Product>

  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.description === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.image === 'string' &&
    typeof candidate.rating === 'object' &&
    candidate.rating !== null &&
    typeof candidate.rating.rate === 'number' &&
    typeof candidate.rating.count === 'number'
  )
}

export function useProductDetails(productId: Ref<number | null>) {
  const product = ref<Product | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)
  const notFound = ref(false)

  async function loadProduct(): Promise<void> {
    if (productId.value === null) {
      product.value = null
      isLoading.value = false
      hasError.value = false
      notFound.value = true
      return
    }

    isLoading.value = true
    hasError.value = false
    notFound.value = false
    product.value = null

    try {
      const data: unknown = await productService.getProductById(productId.value)

      if (!isValidProduct(data)) {
        notFound.value = true
        return
      }

      product.value = data
    } catch (error: unknown) {
      product.value = null

      if (isAppError(error) && error.status === 404) {
        notFound.value = true
        return
      }

      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  watch(
    productId,
    () => {
      void loadProduct()
    },
    { immediate: true },
  )

  return {
    product,
    isLoading,
    hasError,
    notFound,
    loadProduct,
  }
}
