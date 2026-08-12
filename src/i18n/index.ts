import { createI18n } from 'vue-i18n'

import { resolveStoredLocale, toHtmlLang } from '@/types/locale'

import en from './locales/en'
import es from './locales/es'
import ptBR from './locales/pt-BR'

const initialLocale = resolveStoredLocale()

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    'pt-BR': ptBR,
    es,
    en,
  },
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = toHtmlLang(initialLocale)
}

export default i18n
