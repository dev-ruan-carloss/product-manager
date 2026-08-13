import { beforeEach, describe, expect, it } from 'vitest'

import ThemeToggle from '@/components/ThemeToggle.vue'
import { useThemeStore } from '@/stores/themeStore'
import { THEME_STORAGE_KEY } from '@/types/theme'
import { mountWithApp } from '../helpers/mountComponent'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('inicia em modo claro com aria-pressed false e label de ativar escuro', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const { wrapper } = await mountWithApp(ThemeToggle)

    const button = wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('aria-label')).toBe('Ativar modo escuro')
  })

  it('alterna para dark ao clicar e atualiza aria-pressed', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const { wrapper } = await mountWithApp(ThemeToggle)
    const themeStore = useThemeStore()

    await wrapper.get('button').trigger('click')

    expect(themeStore.isDark).toBe(true)
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Ativar modo claro')
  })

  it('expõe title coerente com o tema atual', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    const { wrapper } = await mountWithApp(ThemeToggle)

    expect(wrapper.get('button').attributes('title')).toBe('Modo claro')
  })
})
