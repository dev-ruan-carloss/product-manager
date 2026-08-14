import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'

import FavoriteButton from '@/components/FavoriteButton.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductDetails from '@/components/products/ProductDetails.vue'
import { i18n } from '@/i18n'
import { useRatingsStore } from '@/stores/ratingsStore'
import { formatPrice } from '@/utils/formatPrice'
import { makeProduct } from '../../helpers/makeProduct'
import { mountWithApp } from '../../helpers/mountComponent'

const product = makeProduct({
  id: 19,
  title: "Opna Women's Short Sleeve Moisture",
  price: 7.95,
  category: "women's clothing",
  image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png',
  rating: { rate: 4.5, count: 146 },
  description: 'A short sleeve moisture product',
})

function normalizeSpaces(value: string): string {
  return value.replace(/\u00a0|\u202f/g, ' ')
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('renderiza título, preço, categoria e avaliação', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    expect(wrapper.text()).toContain(product.title)
    expect(wrapper.text()).toContain(formatPrice(product.price))
    expect(wrapper.text()).toContain('Moda feminina')
    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('(146)')
  })

  it('expõe imagem do produto e navegação para detalhes', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe(product.image)
    expect(img.attributes('alt')).toBe('')
    expect(wrapper.get(`a[href="/produtos/${product.id}"]`).exists()).toBe(true)
  })

  it('expõe aria-label de avaliação', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    expect(
      wrapper.get('[aria-label="Avaliação 4.5 de 5, com 146 avaliações"]').exists(),
    ).toBe(true)
  })

  it('passa estado favorito ao FavoriteButton', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: true },
    })

    const favorite = wrapper.getComponent(FavoriteButton)
    expect(favorite.props('favorited')).toBe(true)
    expect(favorite.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('emite toggleFavorite com o id do produto', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    await wrapper.getComponent(FavoriteButton).get('button').trigger('click')
    expect(wrapper.emitted('toggleFavorite')).toEqual([[product.id]])
  })

  it('exibe fallback quando a imagem falha', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    await wrapper.get('img').trigger('error')
    expect(wrapper.text()).toContain('Imagem indisponível')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('atualiza o preço formatado ao trocar o locale', async () => {
    const { wrapper } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(product.price, 'pt-BR')),
    )

    i18n.global.locale.value = 'en'
    await nextTick()
    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(product.price, 'en')),
    )

    i18n.global.locale.value = 'es'
    await nextTick()
    expect(normalizeSpaces(wrapper.text())).toContain(
      normalizeSpaces(formatPrice(product.price, 'es')),
    )

    expect(product.price).toBe(7.95)
  })

  it('reflete a avaliação local no card sem alterar o produto original', async () => {
    const originalRating = { ...product.rating }
    const { wrapper, pinia } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })

    useRatingsStore(pinia).setRating(product.id, 5)
    await nextTick()

    expect(wrapper.text()).toContain('4.5')
    expect(wrapper.text()).toContain('(147)')
    expect(
      wrapper.get('[aria-label="Avaliação 4.5 de 5, com 147 avaliações"]').exists(),
    ).toBe(true)
    expect(product.rating).toEqual(originalRating)
  })

  it('atualiza o card ao alterar a avaliação sem incrementar o count de novo', async () => {
    const { wrapper, pinia } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })
    const store = useRatingsStore(pinia)

    store.setRating(product.id, 5)
    await nextTick()
    expect(wrapper.text()).toContain('(147)')

    store.setRating(product.id, 1)
    await nextTick()
    expect(wrapper.text()).toContain('(147)')
    expect(wrapper.text()).not.toContain('(148)')
  })

  it('mantém a mesma avaliação calculada que ProductDetails', async () => {
    const { wrapper: cardWrapper, pinia } = await mountWithApp(ProductCard, {
      props: { product, favorited: false },
    })
    useRatingsStore(pinia).setRating(product.id, 5)

    const { wrapper: detailsWrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
      pinia,
    })
    await nextTick()

    expect(cardWrapper.text()).toContain('4.5')
    expect(cardWrapper.text()).toContain('(147)')
    expect(detailsWrapper.text()).toContain('4.5')
    expect(detailsWrapper.text()).toContain('147')
  })
})
