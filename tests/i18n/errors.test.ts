import { describe, expect, it } from 'vitest'

import en from '@/i18n/locales/en'
import es from '@/i18n/locales/es'
import ptBR from '@/i18n/locales/pt-BR'

const requiredErrorKeys = [
  'network',
  'timeout',
  'server',
  'notFound',
  'validation',
  'auth',
  'rateLimit',
  'unexpected',
  'retry',
  'favoriteToggle',
  'formSave',
  'pageTitle',
] as const

describe('i18n errors catalog', () => {
  it('expõe as mesmas chaves errors.* em pt-BR, es e en', () => {
    for (const key of requiredErrorKeys) {
      expect(ptBR.errors[key].length).toBeGreaterThan(0)
      expect(es.errors[key].length).toBeGreaterThan(0)
      expect(en.errors[key].length).toBeGreaterThan(0)
    }
  })

  it('diferencia empty de error no catálogo', () => {
    expect(ptBR.empty.productsTitle).not.toBe(ptBR.error.productsTitle)
    expect(ptBR.empty.searchTitle).toContain('{query}')
  })
})
