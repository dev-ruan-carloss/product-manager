import { describe, expect, it } from 'vitest'

import ProductSort from '@/components/products/ProductSort.vue'
import { mountWithApp } from '../../helpers/mountComponent'

describe('ProductSort', () => {
  it('renderiza radiogroup com opções de ordenação', async () => {
    const { wrapper } = await mountWithApp(ProductSort, {
      props: { modelValue: 'price-asc' },
    })

    const group = wrapper.get('[role="radiogroup"]')
    expect(group.attributes('aria-labelledby')).toBe('sort-heading')
    expect(wrapper.text()).toContain('Menor preço')
    expect(wrapper.text()).toContain('Maior avaliação')
  })

  it('emite update:modelValue ao selecionar opção no radiogroup', async () => {
    const { wrapper } = await mountWithApp(ProductSort, {
      props: { modelValue: 'price-asc' },
    })

    const radio = wrapper.findComponent({ name: 'RadioButton' })
    await radio.vm.$emit('update:modelValue', 'name-asc')

    expect(wrapper.emitted('update:modelValue')).toEqual([['name-asc']])
  })

  it('renderiza variante select com label e emite mudança', async () => {
    const { wrapper } = await mountWithApp(ProductSort, {
      props: {
        modelValue: 'price-asc',
        variant: 'select',
        inputId: 'sort-mobile',
      },
    })

    expect(wrapper.get('label[for="sort-mobile"]').text()).toBe('Ordenação')
    const select = wrapper.findComponent({ name: 'Select' })
    await select.vm.$emit('update:modelValue', 'price-desc')
    expect(wrapper.emitted('update:modelValue')).toEqual([['price-desc']])
  })
})
