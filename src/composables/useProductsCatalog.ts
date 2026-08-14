import { computed, onMounted, ref } from 'vue'

import { isAppError, toAppError } from '@/config/api'
import { resetCustomCategoriesState, useCustomCategories } from '@/composables/useCustomCategories'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { Category } from '@/types/category'
import type { Product } from '@/types/product'
import { mergeCategories } from '@/utils/customCategory'

/**
 * Estado compartilhado do catálogo na sessão.
 * GET /products é a fonte inicial; respostas de POST/PUT overlayam esse estado
 * porque a FakeStoreAPI não persiste escritas em GETs posteriores.
 */
const products = ref<Product[]>([])
const apiCategories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref<AppError | null>(null)
const hasLoaded = ref(false)
const localMutations = ref<Record<number, Product>>({})

const { customCategories } = useCustomCategories()
const categories = computed(() => mergeCategories(apiCategories.value, customCategories.value))

let inFlight: Promise<void> | null = null

export interface UseProductsCatalogOptions {
  /** Quando false, apenas lê/atualiza o estado compartilhado sem GET automático. */
  autoLoad?: boolean
}

function mergeRemoteWithMutations(remote: Product[]): Product[] {
  const mutations = localMutations.value
  const merged = remote.map((product) => mutations[product.id] ?? product)
  const remoteIds = new Set(remote.map((product) => product.id))

  for (const product of Object.values(mutations)) {
    if (!remoteIds.has(product.id)) {
      merged.push(product)
    }
  }

  return merged
}

function upsertProduct(next: Product): void {
  localMutations.value = { ...localMutations.value, [next.id]: next }

  const index = products.value.findIndex((product) => product.id === next.id)

  if (index === -1) {
    products.value = [...products.value, next]
    return
  }

  const copy = [...products.value]
  copy[index] = next
  products.value = copy
}

async function loadCatalog(): Promise<void> {
  if (inFlight !== null) {
    return inFlight
  }

  inFlight = (async () => {
    isLoading.value = true
    error.value = null

    try {
      const [loadedProducts, loadedCategories] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ])

      products.value = mergeRemoteWithMutations(loadedProducts)
      apiCategories.value = loadedCategories
      hasLoaded.value = true
    } catch (caught: unknown) {
      error.value = isAppError(caught) ? caught : toAppError(caught)
      products.value = []
      apiCategories.value = []
    } finally {
      isLoading.value = false
    }
  })()

  try {
    await inFlight
  } finally {
    inFlight = null
  }
}

function addCreatedProduct(product: Product): void {
  upsertProduct(product)
}

function replaceProduct(incoming: Product, previous?: Product | null): void {
  const existing =
    previous ??
    localMutations.value[incoming.id] ??
    products.value.find((product) => product.id === incoming.id)

  upsertProduct({
    ...incoming,
    rating: existing?.rating ?? incoming.rating,
  })
}

function getCatalogProduct(id: number): Product | undefined {
  return localMutations.value[id] ?? products.value.find((product) => product.id === id)
}

/** Reinicia o estado da sessão — uso exclusivo da suíte de testes. */
export function resetProductsCatalogState(): void {
  products.value = []
  apiCategories.value = []
  isLoading.value = false
  error.value = null
  hasLoaded.value = false
  localMutations.value = {}
  inFlight = null
  resetCustomCategoriesState()
}

export function useProductsCatalog(options: UseProductsCatalogOptions = {}) {
  const autoLoad = options.autoLoad ?? true
  const hasError = computed(() => error.value !== null)

  if (autoLoad) {
    onMounted(() => {
      if (!hasLoaded.value) {
        void loadCatalog()
      }
    })
  }

  return {
    products,
    categories,
    isLoading,
    error,
    hasError,
    hasLoaded,
    loadCatalog,
    addCreatedProduct,
    replaceProduct,
    getCatalogProduct,
  }
}
