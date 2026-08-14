import {
  PRODUCT_CATEGORY_MAX_LENGTH,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_TITLE_MAX_LENGTH,
} from '@/schemas/productFormLimits'
import type { AppError } from '@/types/api'
import type { Category } from '@/types/category'
import { isProductId, type Product, type ProductRating } from '@/types/product'
import { mergeCategories } from '@/utils/customCategory'
import { toSafeHttpUrl } from '@/utils/httpUrl'

const EMPTY_RATING: ProductRating = { rate: 0, count: 0 }
const MIN_RATING_RATE = 0
const MAX_RATING_RATE = 5

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseBoundedString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (trimmed.length === 0 || trimmed.length > maxLength) {
    return null
  }

  return trimmed
}

function parsePrice(value: unknown): number | null {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value <= 0 ||
    value > PRODUCT_PRICE_MAX
  ) {
    return null
  }

  return value
}

export function isValidRating(value: unknown): value is ProductRating {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.rate === 'number' &&
    Number.isFinite(value.rate) &&
    value.rate >= MIN_RATING_RATE &&
    value.rate <= MAX_RATING_RATE &&
    typeof value.count === 'number' &&
    Number.isInteger(value.count) &&
    Number.isSafeInteger(value.count) &&
    value.count >= 0
  )
}

function parseProductCore(data: unknown): Omit<Product, 'rating'> | null {
  if (!isRecord(data)) {
    return null
  }

  const title = parseBoundedString(data.title, PRODUCT_TITLE_MAX_LENGTH)
  const description = parseBoundedString(data.description, PRODUCT_DESCRIPTION_MAX_LENGTH)
  const category = parseBoundedString(data.category, PRODUCT_CATEGORY_MAX_LENGTH)
  const image = toSafeHttpUrl(data.image)
  const price = parsePrice(data.price)

  if (
    !isProductId(data.id) ||
    title === null ||
    description === null ||
    category === null ||
    image === null ||
    price === null
  ) {
    return null
  }

  return {
    id: data.id,
    title,
    price,
    description,
    category,
    image,
  }
}

/** Produto completo do contrato GET (inclui `rating` válido). */
export function isValidProduct(data: unknown): data is Product {
  return parseProductCore(data) !== null && isRecord(data) && isValidRating(data.rating)
}

/**
 * Normaliza a resposta da FakeStoreAPI para o modelo `Product`.
 * POST/PUT podem omitir `rating`; nesse caso usa o fallback.
 * Campos extras são descartados. Retorna `null` quando o contrato mínimo falha.
 */
export function toProduct(
  data: unknown,
  fallbackRating: ProductRating = EMPTY_RATING,
): Product | null {
  const core = parseProductCore(data)

  if (core === null) {
    return null
  }

  const rating =
    isRecord(data) && isValidRating(data.rating)
      ? { rate: data.rating.rate, count: data.rating.count }
      : fallbackRating

  return {
    ...core,
    rating,
  }
}

/**
 * Valida o array de `GET /products`.
 * Itens inválidos são excluídos para não quebrar o catálogo.
 * Retorna `null` quando a raiz não é um array ou nenhum item é utilizável.
 */
export function toProductList(data: unknown): Product[] | null {
  if (!Array.isArray(data)) {
    return null
  }

  const products: Product[] = []

  for (const item of data) {
    if (!isValidProduct(item)) {
      continue
    }

    const product = toProduct(item)

    if (product !== null) {
      products.push(product)
    }
  }

  if (data.length > 0 && products.length === 0) {
    return null
  }

  return products
}

/**
 * Valida `GET /products/categories`.
 * Entradas inválidas são ignoradas; payload irrecuperável retorna `null`.
 */
export function toCategoryList(data: unknown): Category[] | null {
  if (!Array.isArray(data)) {
    return null
  }

  const categories: Category[] = []

  for (const item of data) {
    const category = parseBoundedString(item, PRODUCT_CATEGORY_MAX_LENGTH)

    if (category !== null) {
      categories.push(category)
    }
  }

  const merged = mergeCategories(categories)

  if (data.length > 0 && merged.length === 0) {
    return null
  }

  return merged
}

export function invalidProductResponseError(): AppError {
  return {
    kind: 'unexpected',
    message: 'Invalid product structure in API response.',
    retryable: false,
  }
}
