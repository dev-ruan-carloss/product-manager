import type { AppError } from '@/types/api'
import type { Product, ProductRating } from '@/types/product'

const EMPTY_RATING: ProductRating = { rate: 0, count: 0 }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isValidRating(value: unknown): value is ProductRating {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.rate === 'number' &&
    Number.isFinite(value.rate) &&
    typeof value.count === 'number' &&
    Number.isFinite(value.count)
  )
}

function hasProductCoreFields(data: unknown): data is Record<string, unknown> & {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
} {
  if (!isRecord(data)) {
    return false
  }

  return (
    typeof data.id === 'number' &&
    Number.isInteger(data.id) &&
    data.id > 0 &&
    typeof data.title === 'string' &&
    typeof data.price === 'number' &&
    Number.isFinite(data.price) &&
    typeof data.description === 'string' &&
    typeof data.category === 'string' &&
    typeof data.image === 'string'
  )
}

/** Produto completo do contrato GET (inclui `rating`). */
export function isValidProduct(data: unknown): data is Product {
  return hasProductCoreFields(data) && isValidRating(data.rating)
}

/**
 * Normaliza a resposta de POST/PUT para `Product`.
 * A FakeStoreAPI frequentemente omite `rating` nas escritas; nesse caso usa o fallback.
 * Retorna `null` quando a estrutura mínima é incompatível — não deve entrar no estado.
 */
export function toProduct(
  data: unknown,
  fallbackRating: ProductRating = EMPTY_RATING,
): Product | null {
  if (!hasProductCoreFields(data)) {
    return null
  }

  return {
    id: data.id,
    title: data.title,
    price: data.price,
    description: data.description,
    category: data.category,
    image: data.image,
    rating: isValidRating(data.rating) ? data.rating : fallbackRating,
  }
}

export function invalidProductResponseError(): AppError {
  return {
    kind: 'unexpected',
    message: 'Invalid product structure in API response.',
    retryable: false,
  }
}
