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

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('lista produtos via GET /products', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [{ id: 1 }] })

    const result = await productService.getProducts()

    expect(api.get).toHaveBeenCalledWith('/products')
    expect(result).toEqual([{ id: 1 }])
  })

  it('busca categorias via GET /products/categories', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: ['electronics'] })

    const result = await productService.getCategories()

    expect(api.get).toHaveBeenCalledWith('/products/categories')
    expect(result).toEqual(['electronics'])
  })

  it('busca produto por ID via GET /products/:id', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 7 } })

    const result = await productService.getProductById(7)

    expect(api.get).toHaveBeenCalledWith('/products/7')
    expect(result).toEqual({ id: 7 })
  })

  it('cria produto via POST /products e normaliza a resposta para Product', async () => {
    const payload = {
      title: 'Novo',
      price: 15.9,
      description: 'desc',
      category: 'electronics',
      image: 'https://example.com/a.jpg',
    }
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: 21, ...payload } })

    const result = await productService.createProduct(payload)

    expect(api.post).toHaveBeenCalledWith('/products', payload)
    expect(result).toEqual({
      id: 21,
      ...payload,
      rating: { rate: 0, count: 0 },
    })
    expect(typeof result.price).toBe('number')
  })

  it('atualiza produto via PUT /products/:id e normaliza a resposta para Product', async () => {
    const payload = {
      title: 'Editado',
      price: 15.9,
      description: 'desc',
      category: 'electronics',
      image: 'https://example.com/a.jpg',
    }
    vi.mocked(api.put).mockResolvedValueOnce({ data: { id: 1, ...payload } })

    const result = await productService.updateProduct(1, payload)

    expect(api.put).toHaveBeenCalledWith('/products/1', payload)
    expect(result.id).toBe(1)
    expect(result.price).toBe(15.9)
    expect(typeof result.price).toBe('number')
  })

  it('não trata resposta inválida de POST como sucesso', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({ data: { title: 'sem id' } })

    await expect(
      productService.createProduct({
        title: 'Novo',
        price: 10,
        description: 'desc',
        category: 'electronics',
        image: 'https://example.com/a.jpg',
      }),
    ).rejects.toMatchObject({ kind: 'unexpected', retryable: false })
  })

  it('não trata resposta inválida de PUT como sucesso', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: { price: 'R$ 15,90' } })

    await expect(
      productService.updateProduct(1, {
        title: 'Editado',
        price: 15.9,
        description: 'desc',
        category: 'electronics',
        image: 'https://example.com/a.jpg',
      }),
    ).rejects.toMatchObject({ kind: 'unexpected', retryable: false })
  })
})
