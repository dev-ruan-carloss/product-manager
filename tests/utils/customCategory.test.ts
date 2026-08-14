import { beforeEach, describe, expect, it } from 'vitest'

import {
  CUSTOM_CATEGORIES_STORAGE_KEY,
  hydrateCustomCategoriesFromStorage,
  resetCustomCategoriesState,
  useCustomCategories,
} from '@/composables/useCustomCategories'
import { PRODUCT_CATEGORY_MAX_LENGTH } from '@/schemas/productFormLimits'
import {
  findCanonicalCategory,
  mergeCategories,
  parseStoredCustomCategories,
  validateNewCategory,
} from '@/utils/customCategory'

describe('customCategory', () => {
  it('aplica trim e rejeita vazio ou somente espaços', () => {
    expect(validateNewCategory('', [])).toEqual({ ok: false, reason: 'empty' })
    expect(validateNewCategory('   ', [])).toEqual({ ok: false, reason: 'empty' })
    expect(validateNewCategory('\n\t', [])).toEqual({ ok: false, reason: 'empty' })
  })

  it('aceita categoria válida com trim preservando o casing informado', () => {
    expect(validateNewCategory('  Esportes  ', [])).toEqual({ ok: true, category: 'Esportes' })
  })

  it('rejeita acima do limite máximo', () => {
    const tooLong = 'A'.repeat(PRODUCT_CATEGORY_MAX_LENGTH + 1)
    expect(validateNewCategory(tooLong, [])).toEqual({ ok: false, reason: 'tooLong' })
    expect(validateNewCategory('A'.repeat(PRODUCT_CATEGORY_MAX_LENGTH), []).ok).toBe(true)
  })

  it('detecta duplicata por espaços e diferença de caixa', () => {
    expect(validateNewCategory('  Eletrônicos  ', ['Eletrônicos'])).toMatchObject({
      ok: false,
      reason: 'duplicate',
      existing: 'Eletrônicos',
    })
    expect(validateNewCategory('eletrônicos', ['Eletrônicos'])).toMatchObject({
      ok: false,
      reason: 'duplicate',
      existing: 'Eletrônicos',
    })
  })

  it('trata rótulo localizado da API como a categoria original', () => {
    expect(findCanonicalCategory('Eletrônicos', ['electronics'])).toBe('electronics')
    expect(findCanonicalCategory('Electronics', ['electronics'])).toBe('electronics')
    expect(findCanonicalCategory('Electrónica', ['electronics'])).toBe('electronics')
    expect(validateNewCategory('Eletrônicos', ['electronics'])).toMatchObject({
      ok: false,
      reason: 'duplicate',
      existing: 'electronics',
    })
  })

  it('une API e custom sem duplicar', () => {
    expect(
      mergeCategories(['electronics', 'jewelery'], ['Esportes', 'electronics', '  ESPORTES  ']),
    ).toEqual(['electronics', 'jewelery', 'Esportes'])
  })

  it('ignora conteúdo inválido do localStorage', () => {
    expect(parseStoredCustomCategories(null)).toEqual([])
    expect(parseStoredCustomCategories('Esportes')).toEqual([])
    expect(parseStoredCustomCategories([1, {}, 'Esportes', '  ', 'esportes'])).toEqual(['Esportes'])
  })
})

describe('useCustomCategories', () => {
  beforeEach(() => {
    resetCustomCategoriesState()
    localStorage.clear()
  })

  it('adiciona categoria válida e persiste no localStorage', () => {
    const { addCustomCategory, customCategories } = useCustomCategories()

    expect(addCustomCategory('Esportes', ['electronics'])).toEqual({
      ok: true,
      category: 'Esportes',
    })
    expect(customCategories.value).toEqual(['Esportes'])
    expect(JSON.parse(localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY) ?? '[]')).toEqual([
      'Esportes',
    ])
  })

  it('recupera categorias após recriação do estado', () => {
    const first = useCustomCategories()
    first.addCustomCategory('Esportes')
    const stored = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY)

    resetCustomCategoriesState()
    expect(useCustomCategories().customCategories.value).toEqual([])

    localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, stored ?? '[]')
    hydrateCustomCategoriesFromStorage()
    expect(useCustomCategories().customCategories.value).toEqual(['Esportes'])
  })

  it('rejeita duplicata já persistida', () => {
    const { addCustomCategory } = useCustomCategories()
    addCustomCategory('Esportes')
    expect(addCustomCategory('  esportes  ')).toMatchObject({ ok: false, reason: 'duplicate' })
  })

  it('não altera categorias oficiais da API', () => {
    const { addCustomCategory, customCategories } = useCustomCategories()
    expect(addCustomCategory('electronics', ['electronics'])).toMatchObject({
      ok: false,
      reason: 'duplicate',
      existing: 'electronics',
    })
    expect(customCategories.value).toEqual([])
  })

  it('lida com JSON inválido no localStorage', () => {
    localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, '{not-json')
    hydrateCustomCategoriesFromStorage()
    expect(useCustomCategories().customCategories.value).toEqual([])
  })
})
