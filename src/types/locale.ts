/** Idiomas suportados pela aplicação. */
export type AppLocale = 'pt-BR' | 'es' | 'en'

/** Idioma padrão quando não há preferência válida salva. */
export const DEFAULT_LOCALE: AppLocale = 'pt-BR'

/** Chave centralizada para persistência do idioma no localStorage. */
export const LOCALE_STORAGE_KEY = 'product-management:locale'

export const SUPPORTED_LOCALES = ['pt-BR', 'es', 'en'] as const satisfies readonly AppLocale[]

export function isAppLocale(value: unknown): value is AppLocale {
  return value === 'pt-BR' || value === 'es' || value === 'en'
}

/** Lê e valida o idioma persistido; fallback para `pt-BR`. */
export function resolveStoredLocale(): AppLocale {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY)

    if (isAppLocale(raw)) {
      return raw
    }
  } catch {
    // localStorage indisponível — usa o padrão.
  }

  return DEFAULT_LOCALE
}

/** Valor de `lang` no documento HTML para o idioma da aplicação. */
export function toHtmlLang(locale: AppLocale): string {
  return locale
}
