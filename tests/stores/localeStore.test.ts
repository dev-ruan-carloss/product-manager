import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { i18n } from '@/i18n'
import { useLocaleStore } from '@/stores/localeStore'
import { LOCALE_STORAGE_KEY } from '@/types/locale'

describe('localeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    i18n.global.locale.value = 'pt-BR'
    setActivePinia(createPinia())
  })

  it('inicia em pt-BR por padrão', () => {
    const store = useLocaleStore()
    expect(store.locale).toBe('pt-BR')
    expect(i18n.global.locale.value).toBe('pt-BR')
  })

  it('restaura idioma salvo ao iniciar', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    const store = useLocaleStore()
    expect(store.locale).toBe('en')
    expect(i18n.global.locale.value).toBe('en')
  })

  it('ignora preferência inválida e usa pt-BR', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'de')
    const store = useLocaleStore()
    expect(store.locale).toBe('pt-BR')
  })

  it('persiste a troca de idioma', () => {
    const store = useLocaleStore()
    store.setLocale('es')

    expect(store.locale).toBe('es')
    expect(i18n.global.locale.value).toBe('es')
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('es')
  })
})
