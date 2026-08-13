import { describe, expect, it } from 'vitest'

import FavoriteButton from '@/components/FavoriteButton.vue'
import ProductDetails from '@/components/products/ProductDetails.vue'
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

describe('ProductDetails', () => {
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
})
