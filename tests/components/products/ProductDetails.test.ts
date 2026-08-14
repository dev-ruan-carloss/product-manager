import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'

import FavoriteButton from '@/components/FavoriteButton.vue'
import ProductDetails from '@/components/products/ProductDetails.vue'
import ProductRatingDialog from '@/components/products/ProductRatingDialog.vue'
import { i18n } from '@/i18n'
import { RATINGS_STORAGE_KEY, useRatingsStore } from '@/stores/ratingsStore'
import { formatPrice } from '@/utils/formatPrice'
import { makeProduct } from '../../helpers/makeProduct'
import { mountWithApp } from '../../helpers/mountComponent'

const product = makeProduct({
  id: 5,
  title: 'John Hardy Women\'s Legends Naga Gold',
  price: 695,
  category: 'jewelery',
  description: 'From the Legends Collection.',
  image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png',
  rating: { rate: 4.6, count: 400 },
})

const rateableProduct = makeProduct({
  id: 21,
  title: 'Fjallraven Backpack',
  price: 109.95,
  category: "men's clothing",
  description: 'Your perfect pack for everyday use.',
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
  rating: { rate: 4.2, count: 10 },
})

function normalizeSpaces(value: string): string {
  return value.replace(/\u00a0|\u202f/g, ' ')
}

function findRatingButton(wrapper: VueWrapper) {
  return wrapper
    .findAll('button')
    .find((btn) => btn.text().includes('Adicionar avaliação') || btn.text().includes('Alterar avaliação'))
}

describe('ProductDetails', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('renderiza título, descrição, preço, categoria e avaliação', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })

    expect(wrapper.get(`#product-title-${product.id}`).text()).toBe(product.title)
    expect(wrapper.text()).toContain(product.description)
    expect(wrapper.text()).toContain(formatPrice(product.price))
    expect(wrapper.text()).toContain('Joias')
    expect(wrapper.text()).toContain('4.6')
    expect(wrapper.text()).toContain('avaliações')
  })

  it('usa o título como alt da imagem e aria-labelledby no article', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })

    expect(wrapper.get('img').attributes('alt')).toBe(product.title)
    expect(wrapper.get('article').attributes('aria-labelledby')).toBe(
      `product-title-${product.id}`,
    )
  })

  it('mostra badge Favoritado e labels de remoção quando favorited', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: true },
    })

    expect(wrapper.text()).toContain('Favoritado')
    expect(wrapper.getComponent(FavoriteButton).props('favorited')).toBe(true)
    const primaryFavorite = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Remover produto dos favoritos'))
    expect(primaryFavorite?.attributes('aria-pressed')).toBe('true')
  })

  it('emite toggleFavorite pelo FavoriteButton e pelo botão principal', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })

    await wrapper.getComponent(FavoriteButton).get('button').trigger('click')
    const primaryFavorite = wrapper
      .findAll('button')
      .find((btn) => btn.text().includes('Adicionar produto aos favoritos'))
    await primaryFavorite!.trigger('click')

    expect(wrapper.emitted('toggleFavorite')).toHaveLength(2)
  })

  it('oferece link de edição para a rota produto-editar', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })

    const editLink = wrapper.get(`a[href="/produtos/${product.id}/editar"]`)
    expect(editLink.text()).toContain('Editar produto')
  })

  it('expõe seção de descrição com heading acessível', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product, favorited: false },
    })

    const section = wrapper.get('section[aria-labelledby="product-description-heading"]')
    expect(section.get('#product-description-heading').text()).toBe('Descrição')
    expect(section.text()).toContain(product.description)
  })

  it('atualiza o preço formatado ao trocar o locale', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
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

    expect(product.price).toBe(695)
  })

  it('exibe o botão Adicionar avaliação na seção de ações', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product: rateableProduct, favorited: false },
    })

    const ratingButton = findRatingButton(wrapper)
    expect(ratingButton?.text()).toContain('Adicionar avaliação')
    expect(ratingButton?.attributes('aria-haspopup')).toBe('dialog')
    expect(ratingButton?.attributes('aria-expanded')).toBe('false')
    expect(wrapper.getComponent(ProductRatingDialog).props('visible')).toBe(false)
  })

  it('abre o modal de avaliação ao clicar no botão', async () => {
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product: rateableProduct, favorited: false },
    })

    await findRatingButton(wrapper)!.trigger('click')
    expect(wrapper.getComponent(ProductRatingDialog).props('visible')).toBe(true)
    expect(findRatingButton(wrapper)?.attributes('aria-expanded')).toBe('true')
  })

  it('atualiza nota, quantidade e rótulo do botão após confirmar avaliação', async () => {
    const originalRating = { ...rateableProduct.rating }
    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product: rateableProduct, favorited: false },
    })

    expect(wrapper.text()).toContain('4.2')

    await wrapper.getComponent(ProductRatingDialog).vm.$emit('confirm', 5)
    await nextTick()

    expect(wrapper.get('[aria-label="Avaliação 4.3 de 5, com 11 avaliações"]').exists()).toBe(true)
    expect(findRatingButton(wrapper)?.text()).toContain('Alterar avaliação')
    expect(rateableProduct.rating).toEqual(originalRating)
    expect(JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) ?? '{}')).toEqual({ '21': 5 })
  })

  it('substitui avaliação existente sem incrementar o count novamente', async () => {
    const { wrapper, pinia } = await mountWithApp(ProductDetails, {
      props: { product: rateableProduct, favorited: false },
    })
    const store = useRatingsStore(pinia)
    store.setRating(rateableProduct.id, 5)
    await nextTick()

    expect(wrapper.get('[aria-label="Avaliação 4.3 de 5, com 11 avaliações"]').exists()).toBe(true)
    expect(findRatingButton(wrapper)?.text()).toContain('Alterar avaliação')

    await wrapper.getComponent(ProductRatingDialog).vm.$emit('confirm', 3)
    await nextTick()

    expect(wrapper.get('[aria-label="Avaliação 4.1 de 5, com 11 avaliações"]').exists()).toBe(true)
    expect(store.getRating(rateableProduct.id)).toBe(3)
  })

  it('exibe categoria customizada com o mesmo fluxo das categorias da API', async () => {
    const customProduct = makeProduct({
      ...product,
      id: 21,
      category: 'Esportes',
    })

    const { wrapper } = await mountWithApp(ProductDetails, {
      props: { product: customProduct, favorited: false },
    })

    expect(wrapper.text()).toContain('Esportes')
    expect(wrapper.find('a[href="/produtos/21/editar"]').exists()).toBe(true)
  })
})
