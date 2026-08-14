import { describe, expect, it } from 'vitest'

import en from '@/i18n/locales/en'
import es from '@/i18n/locales/es'
import ptBR from '@/i18n/locales/pt-BR'

const requiredValidationKeys = [
  'titleRequired',
  'titleInvalid',
  'titleMax',
  'priceType',
  'priceRequired',
  'pricePositive',
  'priceNegative',
  'priceMax',
  'priceDecimals',
  'descriptionRequired',
  'descriptionMax',
  'categoryRequired',
  'categoryInvalid',
  'imageRequired',
  'imageUrl',
] as const

describe('i18n validation catalog', () => {
  it('expõe as mesmas chaves validation.* em pt-BR, es e en', () => {
    for (const key of requiredValidationKeys) {
      expect(ptBR.validation[key].length).toBeGreaterThan(0)
      expect(es.validation[key].length).toBeGreaterThan(0)
      expect(en.validation[key].length).toBeGreaterThan(0)
    }
  })

  it('interpola o limite máximo nas mensagens específicas', () => {
    expect(ptBR.validation.titleMax).toContain('{max}')
    expect(ptBR.validation.descriptionMax).toContain('{max}')
    expect(ptBR.validation.priceMax).toContain('{max}')
    expect(en.validation.titleMax).toContain('{max}')
    expect(es.validation.titleMax).toContain('{max}')
  })
})
