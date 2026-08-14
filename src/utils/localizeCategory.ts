import { i18n } from '@/i18n'
import en from '@/i18n/locales/en'
import es from '@/i18n/locales/es'
import ptBR from '@/i18n/locales/pt-BR'

type CategoryMessageKey = keyof typeof ptBR.categories

/**
 * Mapeia o valor original da FakeStoreAPI para a chave i18n de categoria.
 * O valor da API nunca é alterado — apenas a apresentação.
 */
export const CATEGORY_I18N_KEYS: Readonly<Record<string, CategoryMessageKey>> = {
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

/**
 * Rótulos de apresentação conhecidos (pt-BR, en, es) de uma categoria da API.
 * Usado para evitar duplicar `electronics` como "Eletrônicos" / "Electronics".
 * Categorias customizadas não entram neste mapa — permanecem como dados.
 */
export function getCategoryPresentationAliases(category: string): string[] {
  const messageKey = CATEGORY_I18N_KEYS[category]
  if (!messageKey) {
    return []
  }

  const labels = [ptBR.categories[messageKey], en.categories[messageKey], es.categories[messageKey]]

  return labels.filter((label) => label.length > 0)
}
