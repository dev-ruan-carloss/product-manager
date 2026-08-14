import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import ProductSearch from '@/components/products/ProductSearch.vue'
import { mountWithApp } from '../../helpers/mountComponent'

describe('ProductSearch', () => {
  it('renderiza campo type=search com label acessível', async () => {
    const { wrapper } = await mountWithApp(ProductSearch, {
      props: { modelValue: '' },
    })

    expect(wrapper.get('label[for="product-search"]').text()).toBe('Buscar produto')
    const input = wrapper.get('#product-search')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('placeholder')).toBe('Buscar produto...')
  })

  it('respeita o valor inicial', async () => {
    const { wrapper } = await mountWithApp(ProductSearch, {
      props: { modelValue: 'watch' },
    })

    expect((wrapper.get('#product-search').element as HTMLInputElement).value).toBe('watch')
  })

  it('emite update:modelValue ao digitar', async () => {
    const { wrapper } = await mountWithApp(ProductSearch, {
      props: { modelValue: '' },
    })

    const input = wrapper.get('#product-search')
    await input.setValue('bag')
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['bag'])
  })

  it('aceita inputId customizado', async () => {
    const { wrapper } = await mountWithApp(ProductSearch, {
      props: { modelValue: '', inputId: 'product-search-mobile' },
    })

    expect(wrapper.find('label[for="product-search-mobile"]').exists()).toBe(true)
    expect(wrapper.get('#product-search-mobile').attributes('type')).toBe('search')
  })

  it('foca o campo quando autofocus está ativo', async () => {
    const { wrapper } = await mountWithApp(ProductSearch, {
      props: { modelValue: '', autofocus: true },
      attachTo: document.body,
    })

    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('#product-search').element)
    wrapper.unmount()
  })

  it('não foca automaticamente sem a prop autofocus', async () => {
    const { wrapper } = await mountWithApp(ProductSearch, {
      props: { modelValue: '' },
      attachTo: document.body,
    })

    await nextTick()
    await nextTick()

    expect(document.activeElement).not.toBe(wrapper.get('#product-search').element)
    wrapper.unmount()
  })
})
