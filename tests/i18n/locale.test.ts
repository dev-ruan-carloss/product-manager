import { beforeEach, describe, expect, it } from 'vitest'

import {
  DEFAULT_LOCALE,
  isAppLocale,
  LOCALE_STORAGE_KEY,
  resolveStoredLocale,
} from '@/types/locale'

describe('locale types', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('define pt-BR como idioma padrão', () => {
    expect(DEFAULT_LOCALE).toBe('pt-BR')
  })

  it('valida idiomas suportados', () => {
    expect(isAppLocale('pt-BR')).toBe(true)
    expect(isAppLocale('es')).toBe(true)
    expect(isAppLocale('en')).toBe(true)
    expect(isAppLocale('fr')).toBe(false)
    expect(isAppLocale(null)).toBe(false)
  })

  it('resolve pt-BR quando não há preferência salva', () => {
    expect(resolveStoredLocale()).toBe('pt-BR')
  })

  it('restaura idioma válido salvo no localStorage', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'es')
    expect(resolveStoredLocale()).toBe('es')

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(resolveStoredLocale()).toBe('en')
  })

  it('faz fallback para pt-BR quando a preferência é inválida', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr-FR')
    expect(resolveStoredLocale()).toBe('pt-BR')
  })
})
