import { describe, expect, it } from 'vitest'

import FavoriteButton from '@/components/FavoriteButton.vue'
import { mountWithApp } from '../helpers/mountComponent'

describe('FavoriteButton', () => {
  it('renderiza estado não favorito com aria-pressed false e label de adicionar', async () => {
    const { wrapper } = await mountWithApp(FavoriteButton, {
      props: { favorited: false },
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-label')).toBe('Adicionar produto aos favoritos')
  })

  it('renderiza estado favorito com aria-pressed true e label de remover', async () => {
    const { wrapper } = await mountWithApp(FavoriteButton, {
      props: { favorited: true },
    })

    const button = wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('aria-label')).toBe('Remover produto dos favoritos')
  })

  it('emite toggle ao clicar', async () => {
    const { wrapper } = await mountWithApp(FavoriteButton, {
      props: { favorited: false },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('atualiza labels quando a prop favorited muda', async () => {
    const { wrapper } = await mountWithApp(FavoriteButton, {
      props: { favorited: false },
    })

    await wrapper.setProps({ favorited: true })

    const button = wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('aria-label')).toBe('Remover produto dos favoritos')
  })

  it('respeita disabled e não emite toggle', async () => {
    const { wrapper } = await mountWithApp(FavoriteButton, {
      props: { favorited: false, disabled: true },
    })

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    await button.trigger('click')
    expect(wrapper.emitted('toggle')).toBeUndefined()
  })
})
