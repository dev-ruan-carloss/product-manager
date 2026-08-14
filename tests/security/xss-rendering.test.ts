import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'

import ProductCard from '@/components/products/ProductCard.vue'
import ProductDetails from '@/components/products/ProductDetails.vue'
import ProductForm from '@/components/products/ProductForm.vue'
import ProductImageZoom from '@/components/products/ProductImageZoom.vue'
import { resetCustomCategoriesState } from '@/composables/useCustomCategories'
import type { ProductFormData } from '@/types/productForm'
import { makeProduct } from '../helpers/makeProduct'
import { mountWithApp } from '../helpers/mountComponent'

const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
] as const

function assertRenderedAsText(
  wrapper: { find: (selector: string) => { exists: () => boolean }; text: () => string },
  payload: string,
): void {
  expect(wrapper.text()).toContain(payload)
  expect(wrapper.find('script').exists()).toBe(false)
  expect(wrapper.find('[onerror]').exists()).toBe(false)
  expect(wrapper.find('[onload]').exists()).toBe(false)
}

describe('XSS — renderização de conteúdo externo', () => {
  beforeEach(() => {
    resetCustomCategoriesState()
    localStorage.clear()
  })

  it.each(XSS_PAYLOADS)('trata %s como texto no card e nos detalhes', async (payload) => {
    const product = makeProduct({
      title: payload,
      description: payload,
      category: payload.slice(0, 50),
    })

    const card = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })
    assertRenderedAsText(card.wrapper, payload)
    card.wrapper.unmount()

    const details = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })
    assertRenderedAsText(details.wrapper, payload)
    details.wrapper.unmount()
  })

  it('não usa URL javascript: ou data: como src da imagem no card', async () => {
    const product = makeProduct({ image: 'javascript:alert(1)' })
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Imagem indisponível')
  })

  it('não usa URL data: como src da imagem nos detalhes', async () => {
    const product = makeProduct({ image: 'data:text/html,<script>alert(1)</script>' })
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Imagem indisponível')
  })

  it('ProductImageZoom não renderiza src com protocolo bloqueado', async () => {
    const { wrapper } = await mountWithApp(ProductImageZoom, {
      props: { src: 'javascript:alert(1)', alt: 'xss' },
    })

    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('cadastro trata payload XSS como texto e rejeita imagem javascript:', async () => {
    const initialValues: ProductFormData = {
      title: '<script>alert(1)</script>',
      price: 10,
      description: '<img src=x onerror=alert(1)>',
      category: 'electronics',
      image: 'javascript:alert(1)',
    }

    const { wrapper } = await mountWithApp(ProductForm, {
      props: { categories: ['electronics'], initialValues },
    })
    await nextTick()

    expect(wrapper.text()).toContain('<script>alert(1)</script>')
    expect((wrapper.get('#product-description').element as HTMLTextAreaElement).value).toBe(
      '<img src=x onerror=alert(1)>',
    )
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('[onerror]').exists()).toBe(false)
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
