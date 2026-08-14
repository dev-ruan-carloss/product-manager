import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() }),
}))

vi.mock('@/services/productService', () => ({
  productService: {
    getCategories: vi.fn(),
    createProduct: vi.fn(),
    getProducts: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
  },
}))

import ProductForm from '@/components/products/ProductForm.vue'
import { resetProductsCatalogState, useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { ProductCreatePayload } from '@/types/product'
import ProdutoCriarView from '@/views/ProdutoCriarView.vue'
import { makeProduct } from '../helpers/makeProduct'
import { mountWithApp } from '../helpers/mountComponent'

const payload: ProductCreatePayload = {
  title: 'Produto criado',
  price: 15.9,
  description: 'Descrição do produto criado',
  category: 'electronics',
  image: 'https://example.com/a.jpg',
}

const created = makeProduct({
  id: 21,
  ...payload,
  rating: { rate: 0, count: 0 },
})

describe('ProdutoCriarView', () => {
  beforeEach(() => {
    resetProductsCatalogState()
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
  })

  afterEach(() => {
    resetProductsCatalogState()
  })

  it('executa POST, incorpora o produto no catálogo e navega após sucesso', async () => {
    vi.mocked(productService.createProduct).mockResolvedValueOnce(created)

    const { wrapper, router } = await mountWithApp(ProdutoCriarView, {
      route: '/produtos/novo',
    })
    await flushPromises()

    await wrapper.getComponent(ProductForm).vm.$emit('submit', payload)
    await flushPromises()

    expect(productService.createProduct).toHaveBeenCalledWith(payload)
    expect(typeof payload.price).toBe('number')

    const catalog = useProductsCatalog({ autoLoad: false })
    expect(catalog.getCatalogProduct(21)).toEqual(created)
    expect(catalog.products.value).toContainEqual(created)
    expect(router.currentRoute.value.name).toBe('produtos')
    wrapper.unmount()
  })

  it('mantém o produto criado quando um GET posterior não o inclui', async () => {
    const remote = makeProduct({ id: 1, price: 7.95 })
    vi.mocked(productService.createProduct).mockResolvedValueOnce(created)
    vi.mocked(productService.getProducts).mockResolvedValue([remote])
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])

    const { wrapper } = await mountWithApp(ProdutoCriarView, { route: '/produtos/novo' })
    await flushPromises()

    await wrapper.getComponent(ProductForm).vm.$emit('submit', payload)
    await flushPromises()

    const catalog = useProductsCatalog({ autoLoad: false })
    await catalog.loadCatalog()
    await flushPromises()

    expect(catalog.getCatalogProduct(21)?.title).toBe('Produto criado')
    expect(catalog.getCatalogProduct(1)?.id).toBe(1)
    wrapper.unmount()
  })

  it('em erro permanece no formulário, preserva dados e não atualiza o catálogo', async () => {
    const networkError: AppError = {
      kind: 'network',
      message: 'Network Error',
      retryable: true,
    }
    vi.mocked(productService.createProduct).mockRejectedValueOnce(networkError)

    const { wrapper, router } = await mountWithApp(ProdutoCriarView, {
      route: '/produtos/novo',
    })
    await flushPromises()

    await wrapper.getComponent(ProductForm).vm.$emit('submit', payload)
    await flushPromises()

    const catalog = useProductsCatalog({ autoLoad: false })
    expect(catalog.products.value).toEqual([])
    expect(router.currentRoute.value.name).toBe('produto-criar')
    expect(wrapper.getComponent(ProductForm).props('submitError')).toBeTruthy()
    wrapper.unmount()
  })

  it('indica loading e ignora submit duplicado enquanto o POST está em andamento', async () => {
    let resolveCreate!: (value: typeof created) => void
    vi.mocked(productService.createProduct).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve
        }),
    )

    const { wrapper } = await mountWithApp(ProdutoCriarView, { route: '/produtos/novo' })
    await flushPromises()

    const form = wrapper.getComponent(ProductForm)
    void form.vm.$emit('submit', payload)
    await flushPromises()

    expect(form.props('submitting')).toBe(true)

    void form.vm.$emit('submit', payload)
    await flushPromises()
    expect(productService.createProduct).toHaveBeenCalledTimes(1)

    resolveCreate(created)
    await flushPromises()
    expect(wrapper.getComponent(ProductForm).props('submitting')).toBe(false)
    wrapper.unmount()
  })
})
