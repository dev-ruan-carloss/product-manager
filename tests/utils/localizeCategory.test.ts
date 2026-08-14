import { beforeEach, describe, expect, it } from 'vitest'

import { i18n } from '@/i18n'
import { getCategoryPresentationAliases, getLocalizedCategory } from '@/utils/localizeCategory'
import type { AppLocale } from '@/types/locale'

function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale
}

describe('getLocalizedCategory', () => {
  beforeEach(() => {
    setLocale('pt-BR')
  })

  it('traduz categorias conhecidas em pt-BR', () => {
    expect(getLocalizedCategory("men's clothing")).toBe('Moda masculina')
    expect(getLocalizedCategory("women's clothing")).toBe('Moda feminina')
    expect(getLocalizedCategory('jewelery')).toBe('Joias')
    expect(getLocalizedCategory('electronics')).toBe('Eletrônicos')
  })

  it('traduz categorias conhecidas em es', () => {
    setLocale('es')
    expect(getLocalizedCategory("men's clothing")).toBe('Ropa de hombre')
    expect(getLocalizedCategory('jewelery')).toBe('Joyería')
    expect(getLocalizedCategory('electronics')).toBe('Electrónica')
  })

  it('traduz categorias conhecidas em en', () => {
    setLocale('en')
    expect(getLocalizedCategory("men's clothing")).toBe("Men's clothing")
    expect(getLocalizedCategory("women's clothing")).toBe("Women's clothing")
    expect(getLocalizedCategory('electronics')).toBe('Electronics')
  })

  it('faz fallback para o valor original quando a categoria é desconhecida', () => {
    expect(getLocalizedCategory('new-category')).toBe('new-category')
    setLocale('es')
    expect(getLocalizedCategory('new-category')).toBe('new-category')
    setLocale('en')
    expect(getLocalizedCategory('new-category')).toBe('new-category')
  })

  it('preserva string vazia sem retornar undefined/null', () => {
    expect(getLocalizedCategory('')).toBe('')
  })

  it('não altera o valor original da API usado como entrada', () => {
    const original = "men's clothing"
    getLocalizedCategory(original)
    expect(original).toBe("men's clothing")
  })

  it('preserva categoria customizada como dado, sem chave i18n', () => {
    expect(getLocalizedCategory('Esportes')).toBe('Esportes')
    expect(getCategoryPresentationAliases('Esportes')).toEqual([])
    expect(getCategoryPresentationAliases('electronics')).toEqual(
      expect.arrayContaining(['Eletrônicos', 'Electronics', 'Electrónica']),
    )
  })
})
