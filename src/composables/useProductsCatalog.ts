import { onMounted, ref } from 'vue'

import { productService } from '@/services/productService'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'

export function useProductsCatalog() {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)

  async function loadCatalog(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      const [loadedProducts, loadedCategories] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])

      products.value = loadedProducts
      categories.value = loadedCategories
    } catch {
      hasError.value = true
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
    hasError,
    loadCatalog,
  }
}
