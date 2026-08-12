import { effectScope, nextTick, ref, type EffectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductListControls } from '@/composables/useProductListControls'
import type { Product } from '@/types/product'

function makeProduct(partial: Partial<Product> & Pick<Product, 'id' | 'title'>): Product {
  return {
    price: 10,
    description: 'desc',
    category: 'electronics',
    image: 'https://example.com/a.jpg',
    rating: { rate: 3, count: 10 },
    ...partial,
  }
}

const catalog: Product[] = [
  makeProduct({
    id: 1,
    title: 'Banana Case',
    price: 30,
    category: 'electronics',
    rating: { rate: 4.5, count: 100 },
  }),
  makeProduct({
    id: 2,
    title: 'apple Watch',
    price: 10,
    category: "men's clothing",
    rating: { rate: 4.5, count: 50 },
  }),
  makeProduct({
    id: 3,
    title: 'Zebra Bag',
    price: 20,
    category: 'electronics',
    rating: { rate: 2.1, count: 8 },
  }),
]

describe('useProductListControls', () => {
  let scope: EffectScope

  beforeEach(() => {
    vi.useFakeTimers()
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    vi.useRealTimers()
  })

  function createControls(products = catalog) {
    return scope.run(() => useProductListControls(ref(products)))!
  }

  async function flushDebounce(ms = 300): Promise<void> {
    await nextTick()
    vi.advanceTimersByTime(ms)
    await nextTick()
  }

  it('filtra por busca case-insensitive com trim e debounce', async () => {
    const controls = createControls()

    controls.searchInput.value = '  APPLE  '
    await nextTick()
    expect(controls.filteredProducts.value).toHaveLength(3)

    await flushDebounce()
    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([2])
  })

  it('busca pelo título original da API', async () => {
    const controls = createControls([
      makeProduct({ id: 1, title: "Opna Women's Short Sleeve Moisture" }),
      makeProduct({ id: 2, title: 'Watch' }),
    ])

    controls.searchInput.value = 'opna'
    await flushDebounce()
    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([1])
  })

  it('filtra por categoria e combina com busca', async () => {
    const controls = createControls()

    controls.selectedCategory.value = 'electronics'
    controls.searchInput.value = 'bag'
    await flushDebounce()

    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([3])
  })

  it('ordena por nome A–Z e Z–A usando product.title', () => {
    const controls = createControls()

    controls.sortOrder.value = 'name-asc'
    expect(controls.filteredProducts.value.map((item) => item.title)).toEqual([
      'apple Watch',
      'Banana Case',
      'Zebra Bag',
    ])

    controls.sortOrder.value = 'name-desc'
    expect(controls.filteredProducts.value.map((item) => item.title)).toEqual([
      'Zebra Bag',
      'Banana Case',
      'apple Watch',
    ])
  })

  it('ordena por preço crescente e decrescente', () => {
    const controls = createControls()

    controls.sortOrder.value = 'price-asc'
    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([2, 3, 1])

    controls.sortOrder.value = 'price-desc'
    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([1, 3, 2])
  })

  it('ordena por avaliação usando rate e depois count', () => {
    const controls = createControls()

    controls.sortOrder.value = 'rating-desc'
    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([1, 2, 3])

    controls.sortOrder.value = 'rating-asc'
    expect(controls.filteredProducts.value.map((item) => item.id)).toEqual([3, 2, 1])
  })

  it('pagina resultados e reseta para página 1 ao alterar filtros', async () => {
    const products = Array.from({ length: 20 }, (_, index) =>
      makeProduct({
        id: index + 1,
        title: `Produto ${index + 1}`,
        price: index + 1,
      }),
    )
    const controls = createControls(products)

    controls.itemsPerPage.value = 8
    controls.setPage(3)
    expect(controls.currentPage.value).toBe(3)
    expect(controls.paginatedProducts.value).toHaveLength(4)

    controls.selectedCategory.value = 'electronics'
    await nextTick()
    expect(controls.currentPage.value).toBe(1)
  })

  it('volta para página 1 ao limpar a busca', async () => {
    const controls = createControls()

    controls.itemsPerPage.value = 1
    controls.setPage(2)
    expect(controls.currentPage.value).toBe(2)

    controls.searchInput.value = 'banana'
    await flushDebounce()
    expect(controls.currentPage.value).toBe(1)

    controls.searchInput.value = ''
    await nextTick()
    expect(controls.currentPage.value).toBe(1)
    expect(controls.filteredProducts.value).toHaveLength(3)
  })
})
