import { i18n } from '@/i18n'

/**
 * Mapeia o valor original da FakeStoreAPI para a chave i18n de categoria.
 * O valor da API nunca é alterado — apenas a apresentação.
 */
export const CATEGORY_I18N_KEYS: Readonly<Record<string, string>> = {
  "men's clothing": 'mensClothing',
  "women's clothing": 'womensClothing',
  jewelery: 'jewelery',
  electronics: 'electronics',
}

/**
 * Retorna o rótulo localizado de uma categoria da FakeStoreAPI.
 * Preserva o valor original quando não há tradução conhecida.
 */
export function getLocalizedCategory(category: string): string {
  if (typeof category !== 'string' || category.length === 0) {
    return typeof category === 'string' ? category : ''
  }

  const messageKey = CATEGORY_I18N_KEYS[category]
  if (!messageKey) {
    return category
  }

  const path = `categories.${messageKey}`
  if (!i18n.global.te(path)) {
    return category
  }

  const translated = i18n.global.t(path)
  return typeof translated === 'string' && translated.length > 0 ? translated : category
}
