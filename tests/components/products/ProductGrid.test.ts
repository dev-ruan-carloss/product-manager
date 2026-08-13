import { describe, expect, it } from 'vitest'

import ProductCard from '@/components/products/ProductCard.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import { makeProduct } from '../../helpers/makeProduct'
import { mountWithApp } from '../../helpers/mountComponent'

const products = [
  makeProduct({ id: 1, title: 'Alpha' }),
  makeProduct({ id: 2, title: 'Beta', category: 'jewelery' }),
  makeProduct({ id: 3, title: 'Gamma', category: "men's clothing" }),
]

describe('ProductGrid', () => {
  it('renderiza a quantidade correta de produtos como listitems', async () => {
    const { wrapper } = await mountWithApp(ProductGrid, {
      props: {
        products,
        isFavorite: () => false,
      },
    })

    const list = wrapper.get('[role="list"][aria-label="Lista de produtos"]')
    expect(list.findAll('[role="listitem"]')).toHaveLength(3)
    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(3)
  })

  it('passa produtos e estado de favorito para os cards', async () => {
    const { wrapper } = await mountWithApp(ProductGrid, {
      props: {
        products,
        isFavorite: (id: number) => id === 2,
      },
    })

    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards[0].props('product')).toEqual(products[0])
    expect(cards[0].props('favorited')).toBe(false)
    expect(cards[1].props('favorited')).toBe(true)
  })

  it('repassa toggleFavorite dos cards', async () => {
    const { wrapper } = await mountWithApp(ProductGrid, {
      props: {
        products,
        isFavorite: () => false,
      },
    })

    await wrapper.findAllComponents(ProductCard)[0].vm.$emit('toggleFavorite', 1)
    expect(wrapper.emitted('toggleFavorite')).toEqual([[1]])
  })

  it('renderiza lista vazia sem cards', async () => {
    const { wrapper } = await mountWithApp(ProductGrid, {
      props: {
        products: [],
        isFavorite: () => false,
      },
    })

    expect(wrapper.findAllComponents(ProductCard)).toHaveLength(0)
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(0)
  })
})
