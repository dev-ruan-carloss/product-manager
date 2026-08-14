import { describe, expect, it } from 'vitest'

import {
  invalidProductResponseError,
  isValidProduct,
  isValidRating,
  toProduct,
} from '@/utils/normalizeProduct'
import { makeProduct } from '../helpers/makeProduct'

describe('normalizeProduct', () => {
  it('aceita produto completo do contrato GET', () => {
    const product = makeProduct({ price: 15.9 })

    expect(isValidProduct(product)).toBe(true)
    expect(toProduct(product)).toEqual(product)
  })

  it('normaliza resposta de POST/PUT sem rating usando fallback', () => {
    const payload = {
      id: 21,
      title: 'Novo',
      price: 15.9,
      description: 'desc',
      category: 'electronics',
      image: 'https://example.com/a.jpg',
    }

    const product = toProduct(payload)

    expect(product).toEqual({
      ...payload,
      rating: { rate: 0, count: 0 },
    })
    expect(typeof product?.price).toBe('number')
    expect(product?.price).toBe(15.9)
  })

  it('preserva rating existente quando a escrita omite o campo', () => {
    const previous = makeProduct({ rating: { rate: 4.8, count: 120 } })
    const payload = {
      id: 1,
      title: previous.title,
      price: 15.9,
      description: previous.description,
      category: previous.category,
      image: previous.image,
    }

    expect(toProduct(payload, previous.rating)?.rating).toEqual(previous.rating)
  })

  it('rejeita resposta incompatível e não inventa produto', () => {
    expect(toProduct({ id: 21, title: 'sem preço' })).toBeNull()
    expect(toProduct({ id: '21', title: 'Novo', price: 10 })).toBeNull()
    expect(toProduct({ ...makeProduct(), price: 'R$ 15,90' })).toBeNull()
    expect(isValidProduct({ id: 1, title: 'x' })).toBe(false)
    expect(isValidRating(null)).toBe(false)
  })

  it('expõe erro unexpected sem retry para resposta inválida', () => {
    const error = invalidProductResponseError()

    expect(error.kind).toBe('unexpected')
    expect(error.retryable).toBe(false)
  })
})
