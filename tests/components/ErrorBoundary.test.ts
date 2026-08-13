import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { mountWithApp } from '../helpers/mountComponent'

const BrokenChild = defineComponent({
  name: 'BrokenChild',
  setup() {
    return () => {
      throw new Error('render failure')
    }
  },
})

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mostra recuperação acessível quando o filho falha', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const { wrapper } = await mountWithApp(ErrorBoundary, {
      slots: {
        default: () => h(BrokenChild),
      },
    })

    const alert = wrapper.get('[role="alert"]')
    expect(alert.text()).toContain('Não foi possível carregar esta página.')
    expect(wrapper.text()).toContain('Tentar novamente')
    expect(wrapper.text()).toContain('Voltar para o início')
  })
})
