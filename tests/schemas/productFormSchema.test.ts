import { beforeEach, describe, expect, it } from 'vitest'

import { i18n } from '@/i18n'
import {
  hasAtMostFractionDigits,
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_PRICE_FRACTION_DIGITS,
  PRODUCT_PRICE_MAX,
  PRODUCT_TITLE_MAX_LENGTH,
} from '@/schemas/productFormLimits'
import { productFormSchema } from '@/schemas/productFormSchema'
import { formatPrice } from '@/utils/formatPrice'

describe('productFormLimits', () => {
  it('define limites alinhados ao domínio e à FakeStoreAPI', () => {
    expect(PRODUCT_TITLE_MAX_LENGTH).toBe(150)
    expect(PRODUCT_DESCRIPTION_MAX_LENGTH).toBe(1000)
    expect(PRODUCT_PRICE_MAX).toBe(999_999.99)
    expect(PRODUCT_PRICE_FRACTION_DIGITS).toBe(2)
    expect(PRODUCT_TITLE_MAX_LENGTH).toBeGreaterThanOrEqual(97)
    expect(PRODUCT_DESCRIPTION_MAX_LENGTH).toBeGreaterThanOrEqual(772)
    expect(PRODUCT_PRICE_MAX).toBeGreaterThanOrEqual(999.99)
  })

  it('aceita até duas casas decimais no valor numérico', () => {
    expect(hasAtMostFractionDigits(10, 2)).toBe(true)
    expect(hasAtMostFractionDigits(10.5, 2)).toBe(true)
    expect(hasAtMostFractionDigits(10.5, 2)).toBe(true)
    expect(hasAtMostFractionDigits(10.5, 2)).toBe(true)
    expect(hasAtMostFractionDigits(109.95, 2)).toBe(true)
    expect(hasAtMostFractionDigits(22.3, 2)).toBe(true)
    expect(hasAtMostFractionDigits(7.95, 2)).toBe(true)
    expect(hasAtMostFractionDigits(10.999, 2)).toBe(false)
    expect(hasAtMostFractionDigits(10.1234, 2)).toBe(false)
    expect(hasAtMostFractionDigits(Number.NaN, 2)).toBe(false)
  })
})

describe('productFormSchema', () => {
  const validPayload = {
    title: 'Camiseta Slim Fit',
    price: 29.9,
    description: 'Descrição do produto',
    category: "men's clothing",
    image: 'https://example.com/image.jpg',
  }

  beforeEach(() => {
    i18n.global.locale.value = 'pt-BR'
  })

  async function messageFor(payload: Record<string, unknown>): Promise<string> {
    try {
      await productFormSchema.validate(payload)
      throw new Error('expected validation to fail')
    } catch (error) {
      return error instanceof Error ? error.message : String(error)
    }
  }

  it('aceita um payload válido e preserva espaços internos do título', async () => {
    await expect(
      productFormSchema.validate({ ...validPayload, title: 'Tênis   esportivo' }),
    ).resolves.toMatchObject({
      title: 'Tênis   esportivo',
      price: 29.9,
      category: "men's clothing",
    })
  })

  it('aplica trim nas pontas sem esvaziar conteúdo válido', async () => {
    await expect(
      productFormSchema.validate({ ...validPayload, title: '  Camiseta Slim Fit  ' }),
    ).resolves.toMatchObject({ title: 'Camiseta Slim Fit' })
  })

  describe('título', () => {
    it('rejeita vazio', async () => {
      expect(await messageFor({ ...validPayload, title: '' })).toBe(
        String(i18n.global.t('validation.titleRequired')),
      )
    })

    it('rejeita somente espaços', async () => {
      await expect(productFormSchema.validate({ ...validPayload, title: '   ' })).rejects.toThrow()
      expect(await messageFor({ ...validPayload, title: '   ' })).toBe(
        String(i18n.global.t('validation.titleRequired')),
      )
    })

    it('aceita valor válido', async () => {
      await expect(productFormSchema.validate(validPayload)).resolves.toMatchObject({
        title: validPayload.title,
      })
    })

    it('aceita exatamente no limite', async () => {
      const title = 'a'.repeat(PRODUCT_TITLE_MAX_LENGTH)
      await expect(productFormSchema.validate({ ...validPayload, title })).resolves.toMatchObject({
        title,
      })
    })

    it('rejeita acima do limite', async () => {
      const title = 'a'.repeat(PRODUCT_TITLE_MAX_LENGTH + 1)
      expect(await messageFor({ ...validPayload, title })).toBe(
        String(i18n.global.t('validation.titleMax', { max: PRODUCT_TITLE_MAX_LENGTH })),
      )
    })
  })

  describe('descrição', () => {
    it('rejeita vazia', async () => {
      expect(await messageFor({ ...validPayload, description: '' })).toBe(
        String(i18n.global.t('validation.descriptionRequired')),
      )
    })

    it('rejeita somente espaços', async () => {
      expect(await messageFor({ ...validPayload, description: '   ' })).toBe(
        String(i18n.global.t('validation.descriptionRequired')),
      )
    })

    it('aceita valor válido', async () => {
      await expect(productFormSchema.validate(validPayload)).resolves.toMatchObject({
        description: validPayload.description,
      })
    })

    it('aceita exatamente no limite', async () => {
      const description = 'd'.repeat(PRODUCT_DESCRIPTION_MAX_LENGTH)
      await expect(
        productFormSchema.validate({ ...validPayload, description }),
      ).resolves.toMatchObject({ description })
    })

    it('rejeita acima do limite', async () => {
      const description = 'd'.repeat(PRODUCT_DESCRIPTION_MAX_LENGTH + 1)
      expect(await messageFor({ ...validPayload, description })).toBe(
        String(
          i18n.global.t('validation.descriptionMax', { max: PRODUCT_DESCRIPTION_MAX_LENGTH }),
        ),
      )
    })
  })

  describe('preço', () => {
    it('rejeita vazio', async () => {
      expect(await messageFor({ ...validPayload, price: undefined })).toBe(
        String(i18n.global.t('validation.priceRequired')),
      )
      expect(await messageFor({ ...validPayload, price: '' })).toBe(
        String(i18n.global.t('validation.priceRequired')),
      )
    })

    it('rejeita zero conforme a regra existente', async () => {
      expect(await messageFor({ ...validPayload, price: 0 })).toBe(
        String(i18n.global.t('validation.pricePositive')),
      )
    })

    it('rejeita valor negativo', async () => {
      expect(await messageFor({ ...validPayload, price: -1 })).toBe(
        String(i18n.global.t('validation.priceNegative')),
      )
    })

    it('rejeita valor inválido', async () => {
      expect(await messageFor({ ...validPayload, price: Number.NaN })).toBe(
        String(i18n.global.t('validation.priceType')),
      )
    })

    it('aceita valor válido, inteiro e com uma ou duas casas', async () => {
      for (const price of [29.9, 10, 10.5, Number('10.50'), 109.95]) {
        await expect(productFormSchema.validate({ ...validPayload, price })).resolves.toMatchObject({
          price,
        })
      }
    })

    it('rejeita três casas decimais independentemente do locale', async () => {
      i18n.global.locale.value = 'en'
      expect(await messageFor({ ...validPayload, price: 10.999 })).toBe(
        String(i18n.global.t('validation.priceDecimals')),
      )

      i18n.global.locale.value = 'es'
      expect(await messageFor({ ...validPayload, price: 10.1234 })).toBe(
        String(i18n.global.t('validation.priceDecimals')),
      )

      i18n.global.locale.value = 'pt-BR'
      expect(await messageFor({ ...validPayload, price: 10.999 })).toBe(
        String(i18n.global.t('validation.priceDecimals')),
      )
    })

    it('aceita o preço máximo e rejeita acima ou muito grande', async () => {
      await expect(
        productFormSchema.validate({ ...validPayload, price: PRODUCT_PRICE_MAX }),
      ).resolves.toMatchObject({ price: PRODUCT_PRICE_MAX })

      expect(await messageFor({ ...validPayload, price: PRODUCT_PRICE_MAX + 0.01 })).toBe(
        String(i18n.global.t('validation.priceMax', { max: formatPrice(PRODUCT_PRICE_MAX) })),
      )
      expect(await messageFor({ ...validPayload, price: 1_000_000 })).toBe(
        String(i18n.global.t('validation.priceMax', { max: formatPrice(PRODUCT_PRICE_MAX) })),
      )
      expect(await messageFor({ ...validPayload, price: 1e21 })).toBe(
        String(i18n.global.t('validation.priceMax', { max: formatPrice(PRODUCT_PRICE_MAX) })),
      )
    })
  })

  describe('categoria', () => {
    it('rejeita vazia, null, undefined e somente espaços', async () => {
      expect(await messageFor({ ...validPayload, category: '' })).toBe(
        String(i18n.global.t('validation.categoryRequired')),
      )
      expect(await messageFor({ ...validPayload, category: null })).toBe(
        String(i18n.global.t('validation.categoryRequired')),
      )
      expect(await messageFor({ ...validPayload, category: undefined })).toBe(
        String(i18n.global.t('validation.categoryRequired')),
      )
      expect(await messageFor({ ...validPayload, category: '   ' })).toBe(
        String(i18n.global.t('validation.categoryRequired')),
      )
    })

    it('aceita categoria válida da FakeStoreAPI', async () => {
      await expect(productFormSchema.validate(validPayload)).resolves.toMatchObject({
        category: "men's clothing",
      })
    })
  })

  describe('imagem', () => {
    it('rejeita vazia e somente espaços', async () => {
      expect(await messageFor({ ...validPayload, image: '' })).toBe(
        String(i18n.global.t('validation.imageRequired')),
      )
      expect(await messageFor({ ...validPayload, image: '   ' })).toBe(
        String(i18n.global.t('validation.imageRequired')),
      )
    })

    it('rejeita URL inválida', async () => {
      expect(await messageFor({ ...validPayload, image: 'nao-e-url' })).toBe(
        String(i18n.global.t('validation.imageUrl')),
      )
    })

    it('aceita URL válida', async () => {
      await expect(productFormSchema.validate(validPayload)).resolves.toMatchObject({
        image: validPayload.image,
      })
    })
  })

  it('resolve mensagens de limite em en e es', async () => {
    i18n.global.locale.value = 'en'
    expect(await messageFor({ ...validPayload, title: 'a'.repeat(PRODUCT_TITLE_MAX_LENGTH + 1) })).toBe(
      'The title must be at most 150 characters.',
    )

    i18n.global.locale.value = 'es'
    expect(
      await messageFor({
        ...validPayload,
        description: 'd'.repeat(PRODUCT_DESCRIPTION_MAX_LENGTH + 1),
      }),
    ).toBe('La descripción debe tener como máximo 1000 caracteres.')
  })
})
