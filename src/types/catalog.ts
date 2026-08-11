export type PriceSortOrder = 'asc' | 'desc'

/** String vazia representa todas as categorias. */
export type CategoryFilter = string

export const ALL_CATEGORIES: CategoryFilter = ''

export const DEFAULT_ITEMS_PER_PAGE = 12

export const ITEMS_PER_PAGE_OPTIONS = [8, 12, 16, 24] as const
