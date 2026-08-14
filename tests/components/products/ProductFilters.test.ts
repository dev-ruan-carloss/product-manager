import { describe, expect, it } from 'vitest'

import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductSearch from '@/components/products/ProductSearch.vue'
import ProductSort from '@/components/products/ProductSort.vue'
import { ALL_CATEGORIES, DEFAULT_SORT_ORDER } from '@/types/catalog'
import { makeProduct } from '../../helpers/makeProduct'
import { mountWithApp } from '../../helpers/mountComponent'

const products = [
  makeProduct({ id: 1, title: 'Phone', category: 'electronics' }),
  makeProduct({ id: 2, title: 'Ring', category: 'jewelery' }),
  makeProduct({ id: 3, title: 'Cable', category: 'electronics' }),
]

const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"]

describe('ProductFilters', () => {
  it('renderiza título, filtros e contadores de categoria', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories,
        products,
      },
    })

    expect(wrapper.get('aside').attributes('aria-label')).toBe('Filtros de produtos')
    expect(wrapper.text()).toContain('Produtos')
    expect(wrapper.text()).toContain('Encontre e gerencie seus produtos')
    expect(wrapper.text()).toContain('Todas')
    expect(wrapper.get('[aria-label="3 produtos"]').text()).toBe('3')
    expect(wrapper.get('[aria-label="2 produtos"]').text()).toBe('2')
  })

  it('marca a categoria selecionada com aria-pressed', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: 'electronics',
        sortOrder: DEFAULT_SORT_ORDER,
        categories,
        products,
      },
    })

    const electronicsButton = wrapper
      .findAll('button[aria-pressed]')
      .find((btn) => btn.text().includes('Eletrônicos'))
    expect(electronicsButton?.attributes('aria-pressed')).toBe('true')
  })

  it('emite update:selectedCategory ao escolher categoria', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories,
        products,
      },
    })

    const jeweleryButton = wrapper
      .findAll('button[aria-pressed]')
      .find((btn) => btn.text().includes('Joias'))
    await jeweleryButton!.trigger('click')

    expect(wrapper.emitted('update:selectedCategory')).toEqual([['jewelery']])
  })

  it('inclui categoria customizada no filtro com contador correto', async () => {
    const customProducts = [
      ...products,
      makeProduct({ id: 4, title: 'Tênis de corrida', category: 'Esportes' }),
    ]

    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories: [...categories, 'Esportes'],
        products: customProducts,
      },
    })

    expect(wrapper.text()).toContain('Esportes')
    expect(wrapper.get('[aria-label="1 produtos"]').text()).toBe('1')

    const sportsButton = wrapper
      .findAll('button[aria-pressed]')
      .find((btn) => btn.text().includes('Esportes'))
    await sportsButton!.trigger('click')
    expect(wrapper.emitted('update:selectedCategory')).toEqual([['Esportes']])
  })

  it('repassa busca e ordenação dos filhos', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: 'bag',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories,
        products,
      },
    })

    const search = wrapper.getComponent(ProductSearch)
    expect(search.props()).toMatchObject({ modelValue: 'bag' })
    await search.vm.$emit('update:modelValue', 'watch')
    expect(wrapper.emitted('update:search')).toEqual([['watch']])

    const sorts = wrapper.findAllComponents(ProductSort)
    await sorts[0].vm.$emit('update:modelValue', 'name-desc')
    expect(wrapper.emitted('update:sortOrder')).toEqual([['name-desc']])
  })

  it('funciona sem categorias com contador total zero', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories: [],
        products: [],
      },
    })

    expect(wrapper.get('[aria-label="0 produtos"]').text()).toBe('0')
    expect(wrapper.findAll('button[aria-pressed]').length).toBeGreaterThanOrEqual(1)
  })

  it('omite categorias sem produtos do filtro, inclusive customizadas vazias', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories: ['electronics', "women's clothing", 'teste'],
        products: [
          makeProduct({ id: 1, title: 'Produto A', category: "women's clothing" }),
          makeProduct({ id: 2, title: 'Produto B', category: 'electronics' }),
          makeProduct({ id: 3, title: 'Produto C', category: "women's clothing" }),
        ],
      },
    })

    const categoryButtons = wrapper.findAll('button[aria-pressed]')
    const labels = categoryButtons.map((button) => button.text())

    expect(labels.some((label) => label.includes('Eletrônicos'))).toBe(true)
    expect(labels.some((label) => label.includes('Moda feminina'))).toBe(true)
    expect(labels.some((label) => label.includes('teste'))).toBe(false)
    expect(wrapper.text()).not.toContain('teste')
  })

  it('passa a exibir a categoria quando um produto passa a utilizá-la', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories: ['electronics', 'teste'],
        products: [makeProduct({ id: 1, title: 'Produto B', category: 'electronics' })],
      },
    })

    expect(wrapper.text()).not.toContain('teste')

    await wrapper.setProps({
      products: [
        makeProduct({ id: 1, title: 'Produto B', category: 'electronics' }),
        makeProduct({ id: 2, title: 'Produto teste', category: 'teste' }),
      ],
    })

    const testeButton = wrapper
      .findAll('button[aria-pressed]')
      .find((button) => button.text().includes('teste'))

    expect(testeButton).toBeDefined()
    expect(testeButton?.text()).toContain('1')
  })

  it('remove a categoria do filtro quando o último produto deixa de usá-la', async () => {
    const { wrapper } = await mountWithApp(ProductFilters, {
      props: {
        search: '',
        selectedCategory: ALL_CATEGORIES,
        sortOrder: DEFAULT_SORT_ORDER,
        categories: ['electronics', 'teste'],
        products: [
          makeProduct({ id: 1, title: 'Produto A', category: 'teste' }),
          makeProduct({ id: 2, title: 'Produto B', category: 'electronics' }),
        ],
      },
    })

    expect(
      wrapper.findAll('button[aria-pressed]').some((button) => button.text().includes('teste')),
    ).toBe(true)

    await wrapper.setProps({
      products: [makeProduct({ id: 1, title: 'Produto A', category: 'electronics' })],
    })

    expect(
      wrapper.findAll('button[aria-pressed]').some((button) => button.text().includes('teste')),
    ).toBe(false)
    expect(wrapper.text()).not.toContain('teste')
    expect(
      wrapper
        .findAll('button[aria-pressed]')
        .some((button) => button.text().includes('Eletrônicos')),
    ).toBe(true)
  })
})
