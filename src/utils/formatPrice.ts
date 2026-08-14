import { i18n } from '@/i18n'
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from '@/types/locale'

/** Moeda associada a cada idioma suportado pela aplicação. */
export const CURRENCY_BY_LOCALE: Readonly<Record<AppLocale, string>> = {
  'pt-BR': 'BRL',
  en: 'USD',
  es: 'EUR',
}

export type CurrencyAffixPosition = 'prefix' | 'suffix'

export type CurrencyAffix = {
  symbol: string
  position: CurrencyAffixPosition
}

/** Resolve um locale da aplicação a partir de um valor arbitrário. */
export function resolvePriceLocale(locale?: string): AppLocale {
  return isAppLocale(locale) ? locale : DEFAULT_LOCALE
}

/** Retorna o código ISO 4217 da moeda para o locale informado. */
export function getCurrencyForLocale(locale?: string): string {
  return CURRENCY_BY_LOCALE[resolvePriceLocale(locale)]
}

/**
 * Símbolo e posição da moeda para o locale (prefixo/sufixo).
 * Usado na apresentação do input — o símbolo fica fora do valor editável.
 */
export function getCurrencyAffix(locale?: string): CurrencyAffix {
  const resolved = resolvePriceLocale(locale ?? String(i18n.global.locale.value))
  const parts = new Intl.NumberFormat(resolved, {
    style: 'currency',
    currency: CURRENCY_BY_LOCALE[resolved],
  }).formatToParts(0)

  const currencyIndex = parts.findIndex((part) => part.type === 'currency')
  const integerIndex = parts.findIndex((part) => part.type === 'integer')
  const symbol = parts[currencyIndex]?.value ?? CURRENCY_BY_LOCALE[resolved]
  const position: CurrencyAffixPosition =
    currencyIndex >= 0 && integerIndex >= 0 && currencyIndex > integerIndex
      ? 'suffix'
      : 'prefix'

  return { symbol, position }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getLocaleNumberSeparators(locale: AppLocale): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
  return {
    group: parts.find((part) => part.type === 'group')?.value ?? '',
    decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.',
  }
}

/**
 * Formata o número para o input (separadores do locale, sem símbolo de moeda).
 */
export function formatPriceInput(value: number, locale?: string): string {
  const resolved = resolvePriceLocale(locale ?? String(i18n.global.locale.value))

  return new Intl.NumberFormat(resolved, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value)
}

/**
 * Converte o texto digitado no input de preço em número.
 * Ignora símbolo de moeda e separadores do locale; retorna `undefined` se vazio/inválido.
 */
export function parsePriceInput(text: string, locale?: string): number | undefined {
  const resolved = resolvePriceLocale(locale ?? String(i18n.global.locale.value))
  const trimmed = text.trim()
  if (!trimmed) {
    return undefined
  }

  const { group, decimal } = getLocaleNumberSeparators(resolved)
  const { symbol } = getCurrencyAffix(resolved)

  let normalized = trimmed
  if (symbol) {
    normalized = normalized.split(symbol).join('')
  }

  normalized = normalized.replace(/[^\d.,\s-]/g, '').replace(/\s/g, '')

  if (group) {
    normalized = normalized.replace(new RegExp(escapeRegExp(group), 'g'), '')
  }

  if (decimal !== '.') {
    const decimalIndex = normalized.lastIndexOf(decimal)
    if (decimalIndex >= 0) {
      normalized =
        `${normalized.slice(0, decimalIndex).replace(/[.,]/g, '')}.` +
        normalized.slice(decimalIndex + decimal.length).replace(/[.,]/g, '')
    } else {
      normalized = normalized.replace(/[.,]/g, '')
    }
  } else {
    const dotIndex = normalized.lastIndexOf('.')
    if (dotIndex >= 0) {
      normalized =
        `${normalized.slice(0, dotIndex).replace(/\./g, '')}.` +
        normalized.slice(dotIndex + 1).replace(/\./g, '')
    }
  }

  if (!normalized || normalized === '-' || normalized === '.') {
    return undefined
  }

  const value = Number(normalized)
  return Number.isFinite(value) ? value : undefined
}

export type PriceInputLimits = {
  max: number
  fractionDigits: number
}

/**
 * Restrição de entrada do preço (UX). Não substitui a validação Yup.
 * Considera o valor numérico, não símbolos de moeda nem separadores.
 */
export function isAllowedPriceInput(
  text: string,
  locale: string | undefined,
  limits: PriceInputLimits,
): boolean {
  const resolved = resolvePriceLocale(locale)
  const trimmed = text.trim()
  if (!trimmed) {
    return true
  }

  const { decimal } = getLocaleNumberSeparators(resolved)
  const { symbol } = getCurrencyAffix(resolved)

  let body = trimmed
  if (symbol) {
    body = body.split(symbol).join('')
  }
  body = body.replace(/\s/g, '')

  if (body.includes('-')) {
    return false
  }

  if (decimal) {
    const decimalIndex = body.lastIndexOf(decimal)
    if (decimalIndex >= 0) {
      const fraction = body.slice(decimalIndex + decimal.length).replace(/\D/g, '')
      if (fraction.length > limits.fractionDigits) {
        return false
      }
    }
  }

  const parsed = parsePriceInput(text, resolved)
  if (parsed === undefined) {
    const digits = body.replace(/\D/g, '')
    return digits.length === 0 && Boolean(decimal && body.includes(decimal))
  }

  return parsed >= 0 && parsed <= limits.max
}

/**
 * Formata um preço numérico para exibição no locale atual (ou informado).
 * Apenas apresentação — o valor do produto permanece `number`.
 */
export function formatPrice(value: number, locale?: string): string {
  const resolved = resolvePriceLocale(locale ?? String(i18n.global.locale.value))

  return new Intl.NumberFormat(resolved, {
    style: 'currency',
    currency: CURRENCY_BY_LOCALE[resolved],
    useGrouping: true,
  }).format(value)
}
