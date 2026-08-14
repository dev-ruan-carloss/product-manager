import { PRODUCT_CATEGORY_MAX_LENGTH } from '@/schemas/productFormLimits'
import type { Category } from '@/types/category'
import { getCategoryPresentationAliases } from '@/utils/localizeCategory'

export type CustomCategoryRejectReason = 'empty' | 'tooLong' | 'duplicate'

export type CustomCategoryValidationResult =
  | { ok: true; category: Category }
  | { ok: false; reason: CustomCategoryRejectReason; existing?: Category }

export function normalizeCategoryName(value: string): string {
  return value.trim()
}

export function categoryIdentityKey(value: string): string {
  return normalizeCategoryName(value).toLowerCase()
}

export function mergeCategories(...lists: readonly (readonly Category[])[]): Category[] {
  const seen = new Set<string>()
  const merged: Category[] = []

  for (const list of lists) {
    for (const item of list) {
      if (typeof item !== 'string') {
        continue
      }

      const key = categoryIdentityKey(item)
      if (key.length === 0 || seen.has(key)) {
        continue
      }

      seen.add(key)
      merged.push(item)
    }
  }

  return merged
}

export function findCanonicalCategory(
  rawName: string,
  existing: readonly Category[],
): Category | undefined {
  const key = categoryIdentityKey(rawName)
  if (key.length === 0) {
    return undefined
  }

  for (const canonical of existing) {
    if (categoryIdentityKey(canonical) === key) {
      return canonical
    }

    const aliases = getCategoryPresentationAliases(canonical)
    if (aliases.some((alias) => categoryIdentityKey(alias) === key)) {
      return canonical
    }
  }

  return undefined
}

export function validateNewCategory(
  rawName: string,
  existing: readonly Category[],
): CustomCategoryValidationResult {
  if (typeof rawName !== 'string' || normalizeCategoryName(rawName).length === 0) {
    return { ok: false, reason: 'empty' }
  }

  const category = normalizeCategoryName(rawName)

  if (category.length > PRODUCT_CATEGORY_MAX_LENGTH) {
    return { ok: false, reason: 'tooLong' }
  }

  const existingMatch = findCanonicalCategory(category, existing)
  if (existingMatch !== undefined) {
    return { ok: false, reason: 'duplicate', existing: existingMatch }
  }

  return { ok: true, category }
}

export function parseStoredCustomCategories(value: unknown): Category[] {
  if (!Array.isArray(value)) {
    return []
  }

  const parsed: Category[] = []

  for (const item of value) {
    if (typeof item !== 'string') {
      continue
    }

    parsed.push(item)
  }

  return mergeCategories(parsed)
}
