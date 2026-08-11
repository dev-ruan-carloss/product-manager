/** Modos de tema suportados pela aplicação. */
export type ThemeMode = 'light' | 'dark'

/** Chave centralizada para persistência do tema no localStorage. */
export const THEME_STORAGE_KEY = 'product-management:theme'

export const THEME_MODES = ['light', 'dark'] as const satisfies readonly ThemeMode[]

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark'
}
