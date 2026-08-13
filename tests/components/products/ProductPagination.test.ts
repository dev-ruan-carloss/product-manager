import { describe, expect, it } from 'vitest'

import ProductPagination from '@/components/products/ProductPagination.vue'
import { mountWithApp } from '../../helpers/mountComponent'

describe('ProductPagination', () => {
  it('não renderiza quando totalProducts é 0', async () => {
    const { wrapper } = await mountWithApp(ProductPagination, {
      props: {
        currentPage: 1,
        itemsPerPage: 12,
        totalProducts: 0,
        rangeStart: 0,
        rangeEnd: 0,
      },
    })

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('mostra o intervalo atual com aria-live', async () => {
    const { wrapper } = await mountWithApp(ProductPagination, {
      props: {
        currentPage: 1,
        itemsPerPage: 12,
        totalProducts: 20,
        rangeStart: 1,
        rangeEnd: 12,
      },
    })

    const nav = wrapper.get('nav[aria-label="Paginação de produtos"]')
    const range = nav.get('[aria-live="polite"]')
    expect(range.text()).toBe('Mostrando 1 a 12 de 20 produtos')
  })

  it('exibe controles de página quando há mais itens que o page size', async () => {
    const { wrapper } = await mountWithApp(ProductPagination, {
      props: {
        currentPage: 1,
        itemsPerPage: 8,
        totalProducts: 24,
        rangeStart: 1,
        rangeEnd: 8,
      },
    })

    expect(wrapper.findComponent({ name: 'Paginator' }).exists()).toBe(true)
  })

  it('omite o Paginator quando todos os itens cabem em uma página', async () => {
    const { wrapper } = await mountWithApp(ProductPagination, {
      props: {
        currentPage: 1,
        itemsPerPage: 12,
        totalProducts: 5,
        rangeStart: 1,
        rangeEnd: 5,
      },
    })

    expect(wrapper.findComponent({ name: 'Paginator' }).exists()).toBe(false)
    expect(wrapper.text()).toContain('Mostrando 1 a 5 de 5 produtos')
  })

  it('emite update:currentPage e update:itemsPerPage a partir do Paginator', async () => {
    const { wrapper } = await mountWithApp(ProductPagination, {
      props: {
        currentPage: 1,
        itemsPerPage: 8,
        totalProducts: 24,
        rangeStart: 1,
        rangeEnd: 8,
      },
    })

    const paginator = wrapper.findComponent({ name: 'Paginator' })
    await paginator.vm.$emit('page', { page: 1, rows: 8, first: 8, pageCount: 3 })

    expect(wrapper.emitted('update:currentPage')).toEqual([[2]])
    expect(wrapper.emitted('update:itemsPerPage')).toEqual([[8]])
  })

  it('emite update:itemsPerPage pelo seletor de itens por página', async () => {
    const { wrapper } = await mountWithApp(ProductPagination, {
      props: {
        currentPage: 1,
        itemsPerPage: 12,
        totalProducts: 30,
        rangeStart: 1,
        rangeEnd: 12,
      },
    })

    expect(wrapper.get('label[for="items-per-page"]').text()).toBe('Itens por página')
    const select = wrapper.findComponent({ name: 'Select' })
    await select.vm.$emit('update:modelValue', 24)
    expect(wrapper.emitted('update:itemsPerPage')).toEqual([[24]])
  })
})
