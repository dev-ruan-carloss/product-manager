import { describe, expect, it } from 'vitest'

import ErrorState from '@/components/ErrorState.vue'
import { mountWithApp } from '../helpers/mountComponent'

describe('ErrorState', () => {
  it('renderiza mensagem padrão com role="alert"', async () => {
    const { wrapper } = await mountWithApp(ErrorState)

    const root = wrapper.get('[role="alert"]')
    expect(root.text()).toContain('Não foi possível carregar os produtos.')
    expect(root.text()).toContain('Verifique sua conexão e tente novamente.')
  })

  it('emite retry ao clicar no botão', async () => {
    const { wrapper } = await mountWithApp(ErrorState)

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
    expect(wrapper.get('button').text()).toBe('Tentar novamente')
  })

  it('aceita título, descrição e label customizados', async () => {
    const { wrapper } = await mountWithApp(ErrorState, {
      props: {
        title: 'Falha',
        description: 'Algo deu errado',
        actionLabel: 'Retry',
      },
    })

    expect(wrapper.text()).toContain('Falha')
    expect(wrapper.text()).toContain('Algo deu errado')
    expect(wrapper.get('button').text()).toBe('Retry')
  })
})
