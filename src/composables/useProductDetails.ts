import { computed, ref, watch, type Ref } from 'vue'

import { isAppError, toAppError } from '@/config/api'
import { useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { Product } from '@/types/product'
import { invalidProductResponseError, isValidProduct } from '@/utils/normalizeProduct'

export function useProductDetails(productId: Ref<number | null>) {
  const { getCatalogProduct } = useProductsCatalog({ autoLoad: false })

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

    const local = getCatalogProduct(productId.value)

    if (local !== undefined) {
      product.value = local
      isLoading.value = false
      error.value = null
      notFound.value = false
      return
    }

    isLoading.value = true
    error.value = null
    notFound.value = false
    product.value = null

    try {
      const data = await productService.getProductById(productId.value)

      if (!isValidProduct(data)) {
        error.value = invalidProductResponseError()
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
