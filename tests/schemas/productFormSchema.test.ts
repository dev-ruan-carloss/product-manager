import { describe, expect, it } from 'vitest'

import { productFormSchema } from '@/schemas/productFormSchema'

describe('productFormSchema', () => {
  const validPayload = {
    title: 'Camiseta Slim Fit',
    price: 29.9,
    description: 'Descrição do produto',
    category: "men's clothing",
    image: 'https://example.com/image.jpg',
  }

  it('aceita um payload válido', async () => {
    await expect(productFormSchema.validate(validPayload)).resolves.toMatchObject({
      title: 'Camiseta Slim Fit',
      price: 29.9,
      category: "men's clothing",
    })
  })

  it('exige título após trim', async () => {
    await expect(productFormSchema.validate({ ...validPayload, title: '   ' })).rejects.toThrow()
  })

  it('rejeita preço menor ou igual a zero', async () => {
    await expect(productFormSchema.validate({ ...validPayload, price: 0 })).rejects.toThrow(
      /maior que zero/i,
    )
  })

  it('rejeita URL de imagem inválida', async () => {
    await expect(
      productFormSchema.validate({ ...validPayload, image: 'nao-e-url' }),
    ).rejects.toThrow(/URL/i)
  })

  it('exige categoria', async () => {
    await expect(
      productFormSchema.validate({ ...validPayload, category: null }),
    ).rejects.toThrow(/categoria/i)
  })
})
