import { ref } from 'vue'

import type { Category } from '@/types/category'
import {
  mergeCategories,
  parseStoredCustomCategories,
  validateNewCategory,
  type CustomCategoryValidationResult,
} from '@/utils/customCategory'

/** Chave centralizada para persistência das categorias criadas pelo usuário. */
export const CUSTOM_CATEGORIES_STORAGE_KEY = 'product-management:custom-categories'

const customCategories = ref<Category[]>(loadCustomCategories())

function loadCustomCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY)

    if (raw === null) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    return parseStoredCustomCategories(parsed)
  } catch {
    return []
  }
}

function persistCustomCategories(categories: readonly Category[]): void {
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
  } catch {
    // A sessão permanece; F5 pode perder esta inclusão se o storage falhar.
  }
}

function addCustomCategory(
  rawName: string,
  extraExisting: readonly Category[] = [],
): CustomCategoryValidationResult {
  const existing = mergeCategories(extraExisting, customCategories.value)
  const result = validateNewCategory(rawName, existing)

  if (!result.ok) {
    return result
  }

  customCategories.value = [...customCategories.value, result.category]
  persistCustomCategories(customCategories.value)
  return result
}

/** Recarrega do localStorage — uso exclusivo da suíte de testes. */
export function hydrateCustomCategoriesFromStorage(): void {
  customCategories.value = loadCustomCategories()
}

/** Reinicia o estado da sessão — uso exclusivo da suíte de testes. */
export function resetCustomCategoriesState(): void {
  customCategories.value = []

  try {
    localStorage.removeItem(CUSTOM_CATEGORIES_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function useCustomCategories() {
  return {
    customCategories,
    addCustomCategory,
  }
}
