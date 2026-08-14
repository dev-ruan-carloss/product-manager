import { flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() }),
}))

vi.mock('@/services/productService', () => ({
  productService: {
    getCategories: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
    getProducts: vi.fn(),
    createProduct: vi.fn(),
  },
}))

import ProductForm from '@/components/products/ProductForm.vue'
import { useProductDetails } from '@/composables/useProductDetails'
import { resetProductsCatalogState, useProductsCatalog } from '@/composables/useProductsCatalog'
import { productService } from '@/services/productService'
import type { AppError } from '@/types/api'
import type { ProductCreatePayload } from '@/types/product'
import ProdutoEditarView from '@/views/ProdutoEditarView.vue'
import { makeProduct } from '../helpers/makeProduct'
import { mountWithApp } from '../helpers/mountComponent'

const original = makeProduct({
  id: 1,
  title: 'Original',
  price: 7.95,
  rating: { rate: 4.5, count: 80 },
})

const payload: ProductCreatePayload = {
  title: original.title,
  price: 15.9,
  description: original.description,
  category: original.category,
  image: original.image,
}

describe('ProdutoEditarView', () => {
  beforeEach(() => {
    resetProductsCatalogState()
    vi.mocked(productService.getCategories).mockResolvedValue(['electronics'])
    vi.mocked(productService.getProductById).mockResolvedValue(original)
  })

  afterEach(() => {
    resetProductsCatalogState()
  })

  it('carrega o produto existente, executa PUT e substitui o estado do catálogo', async () => {
    vi.mocked(productService.updateProduct).mockResolvedValueOnce(
      makeProduct({ ...original, price: 15.9, rating: { rate: 0, count: 0 } }),
    )

    const { wrapper, router } = await mountWithApp(ProdutoEditarView, {
      route: '/produtos/1/editar',
    })
    await flushPromises()

    const form = wrapper.getComponent(ProductForm)
    expect(form.props('initialValues')?.price).toBe(7.95)

    await form.vm.$emit('submit', payload)
    await flushPromises()

    expect(productService.updateProduct).toHaveBeenCalledWith(1, payload)
    expect(typeof payload.price).toBe('number')

    const catalog = useProductsCatalog({ autoLoad: false })
    expect(catalog.getCatalogProduct(1)?.price).toBe(15.9)
    expect(catalog.getCatalogProduct(1)?.rating).toEqual({ rate: 4.5, count: 80 })
    expect(router.currentRoute.value.name).toBe('produtos')
    wrapper.unmount()
  })

  it('mantém o preço atualizado no catálogo e nos detalhes mesmo se o GET posterior voltar o valor antigo', async () => {
    vi.mocked(productService.updateProduct).mockResolvedValueOnce(
      makeProduct({ ...original, price: 15.9, rating: { rate: 0, count: 0 } }),
    )
    vi.mocked(productService.getProducts).mockResolvedValue([original])
    vi.mocked(productService.getProductById).mockResolvedValue(original)

    const { wrapper } = await mountWithApp(ProdutoEditarView, {
      route: '/produtos/1/editar',
    })
    await flushPromises()

    await wrapper.getComponent(ProductForm).vm.$emit('submit', payload)
    await flushPromises()

    const catalog = useProductsCatalog({ autoLoad: false })
    await catalog.loadCatalog()
    await flushPromises()

    expect(catalog.getCatalogProduct(1)?.price).toBe(15.9)

    const details = useProductDetails(ref(1))
    await flushPromises()
    expect(details.product.value?.price).toBe(15.9)
    wrapper.unmount()
  })

  it('em erro permanece no formulário e não aplica a alteração no catálogo', async () => {
    const serverError: AppError = {
      kind: 'server',
      message: 'Server Error',
      status: 500,
      retryable: true,
    }
    vi.mocked(productService.updateProduct).mockRejectedValueOnce(serverError)

    const { wrapper, router } = await mountWithApp(ProdutoEditarView, {
      route: '/produtos/1/editar',
    })
    await flushPromises()

    await wrapper.getComponent(ProductForm).vm.$emit('submit', payload)
    await flushPromises()

    const catalog = useProductsCatalog({ autoLoad: false })
    expect(catalog.getCatalogProduct(1)).toBeUndefined()
    expect(router.currentRoute.value.name).toBe('produto-editar')
    expect(wrapper.getComponent(ProductForm).props('submitError')).toBeTruthy()
    wrapper.unmount()
  })
})
