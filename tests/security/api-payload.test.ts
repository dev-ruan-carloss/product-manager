import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/config/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  toAppError: (error: unknown) => error,
}))

import api from '@/config/api'
import { productService } from '@/services/productService'
import {
  isValidProduct,
  isValidRating,
  toCategoryList,
  toProduct,
  toProductList,
} from '@/utils/normalizeProduct'
import { makeProduct } from '../helpers/makeProduct'

const validProduct = makeProduct()

describe('Payload da FakeStoreAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('rejeita payloads incompletos, nulos e com tipos incompatíveis', () => {
    expect(toProduct(null)).toBeNull()
    expect(toProduct(undefined)).toBeNull()
    expect(toProduct([])).toBeNull()
    expect(toProduct({ id: 1, title: 'x' })).toBeNull()
    expect(toProduct({ ...validProduct, id: '1' })).toBeNull()
    expect(toProduct({ ...validProduct, title: null })).toBeNull()
    expect(toProduct({ ...validProduct, price: 'R$ 10,00' })).toBeNull()
    expect(toProduct({ ...validProduct, description: 10 })).toBeNull()
    expect(toProduct({ ...validProduct, category: { name: 'electronics' } })).toBeNull()
    expect(isValidProduct({ ...validProduct, rating: null })).toBe(false)
  })

  it('rejeita preço inválido', () => {
    expect(toProduct({ ...validProduct, price: 0 })).toBeNull()
    expect(toProduct({ ...validProduct, price: -1 })).toBeNull()
    expect(toProduct({ ...validProduct, price: Number.NaN })).toBeNull()
    expect(toProduct({ ...validProduct, price: Number.POSITIVE_INFINITY })).toBeNull()
  })

  it('rejeita rating inválido no contrato GET e usa fallback em POST/PUT', () => {
    expect(isValidRating({ rate: 6, count: 1 })).toBe(false)
    expect(isValidRating({ rate: 4, count: -1 })).toBe(false)
    expect(isValidRating({ rate: 4, count: 1.5 })).toBe(false)
    expect(isValidRating(['rate'])).toBe(false)
    expect(isValidProduct({ ...validProduct, rating: { rate: 4 } })).toBe(false)

    const withoutRating = {
      id: 21,
      title: 'Novo',
      price: 15.9,
      description: 'desc',
      category: 'electronics',
      image: 'https://example.com/a.jpg',
    }

    expect(toProduct(withoutRating)?.rating).toEqual({ rate: 0, count: 0 })
    expect(toProduct({ ...withoutRating, rating: { rate: 99, count: -1 } })?.rating).toEqual({
      rate: 0,
      count: 0,
    })
  })

  it('rejeita imagem com protocolo perigoso ou URL inválida', () => {
    expect(toProduct({ ...validProduct, image: 'javascript:alert(1)' })).toBeNull()
    expect(toProduct({ ...validProduct, image: 'data:text/html,xss' })).toBeNull()
    expect(toProduct({ ...validProduct, image: 'vbscript:msgbox(1)' })).toBeNull()
    expect(toProduct({ ...validProduct, image: '' })).toBeNull()
    expect(toProduct({ ...validProduct, image: '   ' })).toBeNull()
    expect(toProduct({ ...validProduct, image: 'nao-e-url' })).toBeNull()
  })

  it('descarta campos inesperados e normaliza strings', () => {
    const product = toProduct({
      ...validProduct,
      title: '  Fjallraven  ',
      extra: '<script>alert(1)</script>',
    })

    expect(product).toMatchObject({
      id: validProduct.id,
      title: 'Fjallraven',
      price: validProduct.price,
      description: validProduct.description,
      category: validProduct.category,
      image: validProduct.image,
      rating: validProduct.rating,
    })
    expect(product).not.toHaveProperty('extra')
  })

  it('exclui itens inválidos da lista e rejeita coleção irrecuperável', () => {
    const valid = makeProduct({ id: 2, title: 'Ok' })

    expect(toProductList([validProduct, { id: 2 }, valid])).toEqual([validProduct, valid])
    expect(toProductList([])).toEqual([])
    expect(toProductList(null)).toBeNull()
    expect(toProductList({ products: [validProduct] })).toBeNull()
    expect(toProductList([{ id: 1 }, { title: 'x' }])).toBeNull()
  })

  it('valida categorias da API e ignora entradas inválidas', () => {
    expect(toCategoryList(['electronics', 1, '', '  jewelery  '])).toEqual([
      'electronics',
      'jewelery',
    ])
    expect(toCategoryList([])).toEqual([])
    expect(toCategoryList(null)).toBeNull()
    expect(toCategoryList([null, 12, {}])).toBeNull()
  })

  it('getProducts rejeita resposta irrecuperável e devolve só produtos válidos', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [{ id: 1 }] })
    await expect(productService.getProducts()).rejects.toMatchObject({
      kind: 'unexpected',
      retryable: false,
    })

    vi.mocked(api.get).mockResolvedValueOnce({
      data: [validProduct, { id: 99, title: 'quebrado' }],
    })
    await expect(productService.getProducts()).resolves.toEqual([validProduct])
  })

  it('getProductById rejeita payload inválido sem quebrar a chamada', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 7 } })

    await expect(productService.getProductById(7)).rejects.toMatchObject({
      kind: 'unexpected',
      retryable: false,
    })
  })

  it('getCategories rejeita raiz inválida', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { categories: ['electronics'] } })

    await expect(productService.getCategories()).rejects.toMatchObject({
      kind: 'unexpected',
      retryable: false,
    })
  })
})
