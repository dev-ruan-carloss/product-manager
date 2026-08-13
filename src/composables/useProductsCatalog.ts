import { computed, onMounted, ref } from 'vue'

import { isAppError, toAppError } from '@/config/api'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'

export function useProductsCatalog() {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)
  const hasError = computed(() => error.value !== null)

  async function loadCatalog(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const [loadedProducts, loadedCategories] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])

      products.value = loadedProducts
      categories.value = loadedCategories
    } catch (caught: unknown) {
      error.value = isAppError(caught) ? caught : toAppError(caught)
      products.value = []
      categories.value = []
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    void loadCatalog()
  })

  return {
    products,
    categories,
    isLoading,
    error,
    hasError,
    loadCatalog,
  }
}
