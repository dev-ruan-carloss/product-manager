import * as yup from 'yup'

import { i18n } from '@/i18n'

function t(key: string): string {
  return String(i18n.global.t(key))
}

/**
 * Schema Yup com mensagens via i18n (avaliadas no momento da validação).
 * Os valores de categoria no formulário permanecem os originais da FakeStoreAPI.
 */
export const productFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required(() => t('validation.titleRequired'))
    .min(1, () => t('validation.titleInvalid')),
  price: yup
    .number()
    .transform((value, originalValue) => {
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return undefined
      }

      return value
    })
    .typeError(() => t('validation.priceType'))
    .required(() => t('validation.priceRequired'))
    .moreThan(0, () => t('validation.pricePositive')),
  description: yup
    .string()
    .trim()
    .required(() => t('validation.descriptionRequired')),
  category: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === null || originalValue === undefined || originalValue === '') {
        return undefined
      }

      return value
    })
    .required(() => t('validation.categoryRequired')),
  image: yup
    .string()
    .trim()
    .required(() => t('validation.imageRequired'))
    .url(() => t('validation.imageUrl')),
})
