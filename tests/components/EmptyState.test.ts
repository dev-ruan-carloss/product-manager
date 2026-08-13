import { describe, expect, it } from 'vitest'

import EmptyState from '@/components/EmptyState.vue'
import { mountWithApp } from '../helpers/mountComponent'

describe('EmptyState', () => {
  it('renderiza título e descrição padrão com role="status"', async () => {
    const { wrapper } = await mountWithApp(EmptyState, {
      props: { showAction: true },
    })

    const root = wrapper.get('[role="status"]')
    expect(root.text()).toContain('Nenhum produto encontrado.')
    expect(root.text()).toContain('Tente alterar sua busca ou os filtros.')
  })

  it('emite action ao clicar no botão', async () => {
    const { wrapper } = await mountWithApp(EmptyState, {
      props: { showAction: true },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
    expect(wrapper.get('button').text()).toBe('Limpar filtros')
  })

  it('aceita título, descrição e label customizados', async () => {
    const { wrapper } = await mountWithApp(EmptyState, {
      props: {
        title: 'Lista vazia',
        description: 'Sem itens',
        actionLabel: 'Recarregar',
        showAction: true,
      },
    })

    expect(wrapper.text()).toContain('Lista vazia')
    expect(wrapper.text()).toContain('Sem itens')
    expect(wrapper.get('button').text()).toBe('Recarregar')
  })

  it('omite o botão quando showAction é false', async () => {
    const { wrapper } = await mountWithApp(EmptyState, {
      props: { showAction: false },
    })

    expect(wrapper.find('button').exists()).toBe(false)
  })
})
