import { computed, ref, watch, type Ref } from 'vue'

import { isAppError, toAppError } from '@/config/api'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { Product } from '@/types/product'

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
  const error = ref<AppError | null>(null)
  const notFound = ref(false)
  const hasError = computed(() => error.value !== null)

  async function loadProduct(): Promise<void> {
    if (productId.value === null) {
      product.value = null
      isLoading.value = false
      error.value = null
      notFound.value = true
      return
    }

    isLoading.value = true
    error.value = null
    notFound.value = false
    product.value = null

    try {
      const data: unknown = await productService.getProductById(productId.value)

      if (!isValidProduct(data)) {
        notFound.value = true
        return
      }

      product.value = data
    } catch (caught: unknown) {
      product.value = null
      const appError = isAppError(caught) ? caught : toAppError(caught)

      if (appError.kind === 'notFound' || appError.status === 404) {
        notFound.value = true
        return
      }

      error.value = appError
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
    error,
    hasError,
    notFound,
    loadProduct,
  }
}
