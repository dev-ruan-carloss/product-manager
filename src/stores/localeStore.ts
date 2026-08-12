import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { i18n } from '@/i18n'
import {
  isAppLocale,
  LOCALE_STORAGE_KEY,
  resolveStoredLocale,
  toHtmlLang,
  type AppLocale,
} from '@/types/locale'

function persistLocale(locale: AppLocale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

function applyLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale

  if (typeof document !== 'undefined') {
    document.documentElement.lang = toHtmlLang(locale)
  }
}

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<AppLocale>(resolveStoredLocale())

  applyLocale(locale.value)

  const isPortuguese = computed(() => locale.value === 'pt-BR')

  function setLocale(nextLocale: AppLocale): void {
    if (!isAppLocale(nextLocale)) {
      return
    }

    locale.value = nextLocale
    persistLocale(nextLocale)
    applyLocale(nextLocale)
  }

  return {
    locale,
    isPortuguese,
    setLocale,
  }
})
