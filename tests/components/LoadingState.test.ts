import { describe, expect, it } from 'vitest'

import LoadingState from '@/components/LoadingState.vue'
import { mountWithApp } from '../helpers/mountComponent'

describe('LoadingState', () => {
  it('expõe status acessível com aria-busy e mensagem sr-only', async () => {
    const { wrapper } = await mountWithApp(LoadingState)

    const root = wrapper.get('[role="status"]')
    expect(root.attributes('aria-live')).toBe('polite')
    expect(root.attributes('aria-busy')).toBe('true')
    expect(root.text()).toContain('Carregando produtos')
    expect(root.text()).toContain('Aguarde enquanto buscamos os produtos.')
  })

  it('renderiza 8 skeletons por padrão', async () => {
    const { wrapper } = await mountWithApp(LoadingState)

    expect(wrapper.findAll('.p-skeleton').length).toBeGreaterThanOrEqual(8)
  })

  it('respeita a quantidade de rows', async () => {
    const { wrapper } = await mountWithApp(LoadingState, {
      props: { rows: 3 },
    })

    // Cada row tem 5 Skeleton; validamos a quantidade de cards do grid.
    expect(wrapper.findAll('.grid > div')).toHaveLength(3)
  })
})
