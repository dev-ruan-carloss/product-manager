import { beforeEach, describe, expect, it } from 'vitest'

import AppHeader from '@/components/AppHeader.vue'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { mountWithApp } from '../helpers/mountComponent'

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza a marca e o link home com aria-label', async () => {
    const { wrapper } = await mountWithApp(AppHeader)

    expect(wrapper.text()).toContain('Product Management')
    const brand = wrapper.get('a[aria-label="Product Management — ir para produtos"]')
    expect(brand.attributes('href')).toBe('/produtos')
    const logo = brand.get('img')
    expect(logo.attributes('src')).toMatch(/image\/svg\+xml|logo-product-manager/)
  })

  it('renderiza navegação principal com Produtos, Favoritos e Novo Produto', async () => {
    const { wrapper } = await mountWithApp(AppHeader)

    const nav = wrapper.get('nav[aria-label="Principal"]')
    expect(nav.text()).toContain('Produtos')
    expect(nav.text()).toContain('Favoritos')
    expect(nav.text()).toContain('Novo Produto')
    expect(nav.find('a[href="/produtos"]').exists()).toBe(true)
    expect(nav.find('a[href="/favoritos"]').exists()).toBe(true)
    expect(nav.find('a[href="/produtos/novo"]').exists()).toBe(true)
  })

  it('marca Produtos como página atual na rota produtos', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { route: '/produtos' })

    const productsLink = wrapper
      .findAll('nav a')
      .find((link) => link.text() === 'Produtos')
    expect(productsLink?.attributes('aria-current')).toBe('page')
  })

  it('marca Favoritos como página atual na rota favoritos', async () => {
    const { wrapper } = await mountWithApp(AppHeader, { route: '/favoritos' })

    const favoritesLink = wrapper.get('a[href="/favoritos"]')
    expect(favoritesLink.attributes('aria-current')).toBe('page')
  })

  it('exibe contador de favoritos e aria-label com count', async () => {
    const { wrapper, pinia } = await mountWithApp(AppHeader)
    const favoritesStore = useFavoritesStore(pinia)
    favoritesStore.addFavorite(1)
    favoritesStore.addFavorite(2)
    await wrapper.vm.$nextTick()

    const favoritesLink = wrapper.get('a[href="/favoritos"]')
    expect(favoritesLink.attributes('aria-label')).toBe('Favoritos (2)')
    expect(favoritesLink.text()).toContain('2')
  })

  it('associa o contador ao texto Favoritos dentro da área clicável', async () => {
    const { wrapper, pinia } = await mountWithApp(AppHeader)
    useFavoritesStore(pinia).addFavorite(7)
    await wrapper.vm.$nextTick()

    const favoritesLink = wrapper.get('a[href="/favoritos"]')
    const badge = favoritesLink.get('[data-testid="favorites-count"]')
    const icon = favoritesLink.get('[data-testid="favorites-icon"]')
    const label = favoritesLink.findAll('span').find((el) => el.text() === 'Favoritos')

    expect(badge.text()).toBe('1')
    expect(favoritesLink.element.contains(badge.element)).toBe(true)
    expect(icon.element.contains(badge.element)).toBe(false)
    expect(label).toBeDefined()

    const linkHtml = favoritesLink.html()
    expect(linkHtml.indexOf('Favoritos')).toBeLessThan(linkHtml.indexOf('favorites-count'))
    expect(badge.classes().some((c) => c.startsWith('absolute') || c.includes('right-'))).toBe(
      false,
    )
  })

  it('capaz o contador visual em 99+', async () => {
    const { wrapper, pinia } = await mountWithApp(AppHeader)
    const favoritesStore = useFavoritesStore(pinia)
    for (let id = 1; id <= 100; id += 1) {
      favoritesStore.addFavorite(id)
    }
    await wrapper.vm.$nextTick()

    expect(wrapper.get('a[href="/favoritos"]').text()).toContain('99+')
  })
})
