import { beforeEach, describe, expect, it } from 'vitest'

import AppFooter from '@/components/AppFooter.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LocaleSelector from '@/components/LocaleSelector.vue'
import { THEME_STORAGE_KEY } from '@/types/theme'
import { mountWithApp } from '../helpers/mountComponent'

describe('AppFooter', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renderiza identidade do projeto e copyright', async () => {
    const { wrapper } = await mountWithApp(AppFooter)

    expect(wrapper.text()).toContain('Product Management')
    expect(wrapper.text()).toContain('Catálogo de produtos • Favoritos • Gerenciamento')
    expect(wrapper.text()).toContain('© 2026 Product Management')
  })

  it('renderiza links de navegação do rodapé', async () => {
    const { wrapper } = await mountWithApp(AppFooter)

    const nav = wrapper.get('nav[aria-label="Rodapé"]')
    expect(nav.get('a[href="/produtos"]').text()).toContain('Produtos')
    expect(nav.get('a[href="/favoritos"]').text()).toContain('Favoritos')
    expect(nav.get('a[href="/produtos/novo"]').text()).toContain('Novo produto')
  })

  it('inclui LocaleSelector e ThemeToggle no grupo de preferências', async () => {
    const { wrapper } = await mountWithApp(AppFooter)

    const prefs = wrapper.get('[role="group"][aria-label="Preferências da aplicação"]')
    expect(prefs.findComponent(LocaleSelector).exists()).toBe(true)
    expect(prefs.findComponent(ThemeToggle).exists()).toBe(true)
  })

  it('marca o link de produtos com aria-current na rota produtos', async () => {
    const { wrapper } = await mountWithApp(AppFooter, { route: '/produtos' })

    const productsLink = wrapper.get('nav[aria-label="Rodapé"] a[href="/produtos"]')
    expect(productsLink.attributes('aria-current')).toBe('page')
  })

  it('permite interação do ThemeToggle no footer', async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const { wrapper } = await mountWithApp(AppFooter)

    const toggle = wrapper.getComponent(ThemeToggle)
    await toggle.get('button').trigger('click')
    expect(toggle.get('button').attributes('aria-pressed')).toBe('true')
  })
})
