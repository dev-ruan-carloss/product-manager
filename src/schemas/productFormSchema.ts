import * as yup from 'yup'

import { i18n } from '@/i18n'
import {
  hasAtMostFractionDigits,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_PRICE_FRACTION_DIGITS,
  PRODUCT_PRICE_MAX,
  PRODUCT_TITLE_MAX_LENGTH,
} from '@/schemas/productFormLimits'
import { formatPrice } from '@/utils/formatPrice'

function t(key: string, values?: Record<string, unknown>): string {
  if (values) {
    return String(i18n.global.t(key, values))
  }

  return String(i18n.global.t(key))
}

function isBlankText(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

/**
 * Schema Yup com mensagens via i18n (avaliadas no momento da validação).
 * Os valores de categoria no formulário permanecem os originais da FakeStoreAPI.
 * Compartilhado entre criação e edição — não duplicar regras no ProductForm.
 */
export const productFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required(() => t('validation.titleRequired'))
    .min(1, () => t('validation.titleInvalid'))
    .max(PRODUCT_TITLE_MAX_LENGTH, () =>
      t('validation.titleMax', { max: PRODUCT_TITLE_MAX_LENGTH }),
    ),
  price: yup
    .number()
    .transform((value, originalValue) => {
      if (isBlankText(originalValue)) {
        return undefined
      }

      return value
    })
    .typeError(() => t('validation.priceType'))
    .required(() => t('validation.priceRequired'))
    .test('price-negative', () => t('validation.priceNegative'), (value) => {
      if (value === undefined || value === null) {
        return true
      }

      return value >= 0
    })
    .moreThan(0, () => t('validation.pricePositive'))
    .max(PRODUCT_PRICE_MAX, () =>
      t('validation.priceMax', { max: formatPrice(PRODUCT_PRICE_MAX) }),
    )
    .test('price-decimals', () => t('validation.priceDecimals'), (value) => {
      if (value === undefined || value === null) {
        return true
      }

      return hasAtMostFractionDigits(value, PRODUCT_PRICE_FRACTION_DIGITS)
    }),
  description: yup
    .string()
    .trim()
    .required(() => t('validation.descriptionRequired'))
    .max(PRODUCT_DESCRIPTION_MAX_LENGTH, () =>
      t('validation.descriptionMax', { max: PRODUCT_DESCRIPTION_MAX_LENGTH }),
    ),
  category: yup
    .string()
    .nullable()
    .trim()
    .transform((value, originalValue) => {
      if (isBlankText(originalValue) || (typeof value === 'string' && value.length === 0)) {
        return undefined
      }

      return value
    })
    .required(() => t('validation.categoryRequired'))
    .min(1, () => t('validation.categoryInvalid')),
  image: yup
    .string()
    .trim()
    .required(() => t('validation.imageRequired'))
    .url(() => t('validation.imageUrl')),
})
