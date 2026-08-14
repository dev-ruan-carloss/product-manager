import { beforeEach, describe, expect, it } from 'vitest'

import { i18n } from '@/i18n'
import {
  PRODUCT_PRICE_FRACTION_DIGITS,
  PRODUCT_PRICE_MAX,
} from '@/schemas/productFormLimits'
import {
  CURRENCY_BY_LOCALE,
  formatPrice,
  formatPriceInput,
  getCurrencyAffix,
  getCurrencyForLocale,
  isAllowedPriceInput,
  parsePriceInput,
  resolvePriceLocale,
} from '@/utils/formatPrice'

function normalizeSpaces(value: string): string {
  return value.replace(/\u00a0|\u202f/g, ' ')
}

describe('formatPrice', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'pt-BR'
  })

  it('mapeia moedas por locale', () => {
    expect(CURRENCY_BY_LOCALE['pt-BR']).toBe('BRL')
    expect(CURRENCY_BY_LOCALE.en).toBe('USD')
    expect(CURRENCY_BY_LOCALE.es).toBe('EUR')
    expect(getCurrencyForLocale('pt-BR')).toBe('BRL')
    expect(getCurrencyForLocale('en')).toBe('USD')
    expect(getCurrencyForLocale('es')).toBe('EUR')
    expect(resolvePriceLocale('fr')).toBe('pt-BR')
  })

  it('expõe símbolo e posição da moeda fora do valor numérico', () => {
    expect(getCurrencyAffix('pt-BR')).toEqual({ symbol: 'R$', position: 'prefix' })
    expect(getCurrencyAffix('en')).toEqual({ symbol: '$', position: 'prefix' })
    expect(getCurrencyAffix('es')).toEqual({ symbol: '€', position: 'suffix' })
  })

  it('formata o valor do input sem símbolo de moeda', () => {
    expect(formatPriceInput(7.95, 'pt-BR')).toBe('7,95')
    expect(formatPriceInput(7.95, 'en')).toBe('7.95')
    expect(formatPriceInput(7.95, 'es')).toBe('7,95')
    expect(formatPriceInput(1234.56, 'pt-BR')).toBe('1.234,56')
    expect(formatPriceInput(1234.56, 'en')).toBe('1,234.56')
    expect(formatPriceInput(1234.56, 'es')).toBe('1.234,56')
  })

  it('converte o texto digitado em número sem símbolo de moeda', () => {
    expect(parsePriceInput('7,95', 'pt-BR')).toBe(7.95)
    expect(parsePriceInput('7.95', 'en')).toBe(7.95)
    expect(parsePriceInput('7,95', 'es')).toBe(7.95)
    expect(parsePriceInput('1.234,56', 'pt-BR')).toBe(1234.56)
    expect(parsePriceInput('1,234.56', 'en')).toBe(1234.56)
    expect(parsePriceInput('R$ 7,95', 'pt-BR')).toBe(7.95)
    expect(parsePriceInput('$7.95', 'en')).toBe(7.95)
    expect(parsePriceInput('7,95 €', 'es')).toBe(7.95)
    expect(parsePriceInput('', 'pt-BR')).toBeUndefined()
    expect(parsePriceInput('abc', 'en')).toBeUndefined()
  })

  it('formata PT-BR / BRL', () => {
    expect(normalizeSpaces(formatPrice(1234.56, 'pt-BR'))).toBe('R$ 1.234,56')
    expect(normalizeSpaces(formatPrice(7.95, 'pt-BR'))).toBe('R$ 7,95')
  })

  it('formata EN / USD', () => {
    expect(normalizeSpaces(formatPrice(1234.56, 'en'))).toBe('$1,234.56')
    expect(normalizeSpaces(formatPrice(7.95, 'en'))).toBe('$7.95')
  })

  it('formata ES / EUR', () => {
    expect(normalizeSpaces(formatPrice(1234.56, 'es'))).toBe('1.234,56 €')
    expect(normalizeSpaces(formatPrice(7.95, 'es'))).toBe('7,95 €')
  })

  it('formata valores inteiros, pequenos e zero', () => {
    expect(normalizeSpaces(formatPrice(1000, 'pt-BR'))).toBe('R$ 1.000,00')
    expect(normalizeSpaces(formatPrice(1000, 'en'))).toBe('$1,000.00')
    expect(normalizeSpaces(formatPrice(1000, 'es'))).toBe('1.000,00 €')

    expect(normalizeSpaces(formatPrice(9.9, 'pt-BR'))).toBe('R$ 9,90')
    expect(normalizeSpaces(formatPrice(9.9, 'en'))).toBe('$9.90')
    expect(normalizeSpaces(formatPrice(9.9, 'es'))).toBe('9,90 €')

    expect(normalizeSpaces(formatPrice(0, 'pt-BR'))).toBe('R$ 0,00')
    expect(normalizeSpaces(formatPrice(0, 'en'))).toBe('$0.00')
    expect(normalizeSpaces(formatPrice(0, 'es'))).toBe('0,00 €')
  })

  it('usa o locale atual do i18n quando nenhum locale é informado', () => {
    i18n.global.locale.value = 'en'
    expect(normalizeSpaces(formatPrice(1234.56))).toBe('$1,234.56')

    i18n.global.locale.value = 'es'
    expect(normalizeSpaces(formatPrice(1234.56))).toBe('1.234,56 €')

    i18n.global.locale.value = 'pt-BR'
    expect(normalizeSpaces(formatPrice(1234.56))).toBe('R$ 1.234,56')
  })

  it('não altera o valor numérico — apenas a apresentação', () => {
    const value = 1234.56
    formatPrice(value, 'pt-BR')
    formatPrice(value, 'en')
    formatPrice(value, 'es')
    formatPriceInput(value, 'es')
    expect(value).toBe(1234.56)
  })

  it('restringe o input de preço pelo valor numérico, não pela máscara', () => {
    const limits = { max: PRODUCT_PRICE_MAX, fractionDigits: PRODUCT_PRICE_FRACTION_DIGITS }

    expect(isAllowedPriceInput('', 'pt-BR', limits)).toBe(true)
    expect(isAllowedPriceInput('7,95', 'pt-BR', limits)).toBe(true)
    expect(isAllowedPriceInput('7.95', 'en', limits)).toBe(true)
    expect(isAllowedPriceInput('7,95', 'es', limits)).toBe(true)
    expect(isAllowedPriceInput('1.234,56', 'pt-BR', limits)).toBe(true)
    expect(isAllowedPriceInput('1,234.56', 'en', limits)).toBe(true)
    expect(isAllowedPriceInput(formatPriceInput(PRODUCT_PRICE_MAX, 'pt-BR'), 'pt-BR', limits)).toBe(
      true,
    )
    expect(isAllowedPriceInput('10,99', 'pt-BR', limits)).toBe(true)
    expect(isAllowedPriceInput('10,999', 'pt-BR', limits)).toBe(false)
    expect(isAllowedPriceInput('10.999', 'en', limits)).toBe(false)
    expect(isAllowedPriceInput('10,1234', 'es', limits)).toBe(false)
    expect(isAllowedPriceInput('-1', 'pt-BR', limits)).toBe(false)
    expect(isAllowedPriceInput('1.000.000,00', 'pt-BR', limits)).toBe(false)
    expect(isAllowedPriceInput('abc', 'en', limits)).toBe(false)
    expect(isAllowedPriceInput(',', 'pt-BR', limits)).toBe(true)
  })
})
