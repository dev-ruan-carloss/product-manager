import { describe, expect, it } from 'vitest'

import { i18n } from '@/i18n'
import { productFormSchema } from '@/schemas/productFormSchema'
import { isAllowedHttpUrl, MAX_HTTP_URL_LENGTH, toSafeHttpUrl } from '@/utils/httpUrl'

describe('toSafeHttpUrl', () => {
  it('aceita URLs HTTP e HTTPS legítimas', () => {
    expect(toSafeHttpUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg')
    expect(toSafeHttpUrl('http://example.com/image.jpg')).toBe('http://example.com/image.jpg')
    expect(toSafeHttpUrl('  https://example.com/image.jpg  ')).toBe('https://example.com/image.jpg')
  })

  it('rejeita protocolos perigosos ou desnecessários', () => {
    expect(toSafeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(toSafeHttpUrl('JAVASCRIPT:alert(1)')).toBeNull()
    expect(toSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeNull()
    expect(toSafeHttpUrl('data:image/png;base64,abc')).toBeNull()
    expect(toSafeHttpUrl('vbscript:msgbox(1)')).toBeNull()
    expect(toSafeHttpUrl('file:///etc/passwd')).toBeNull()
    expect(toSafeHttpUrl('ftp://example.com/image.jpg')).toBeNull()
  })

  it('rejeita vazia, inválida, com espaços internos ou malformada', () => {
    expect(toSafeHttpUrl('')).toBeNull()
    expect(toSafeHttpUrl('   ')).toBeNull()
    expect(toSafeHttpUrl(null)).toBeNull()
    expect(toSafeHttpUrl(undefined)).toBeNull()
    expect(toSafeHttpUrl(123)).toBeNull()
    expect(toSafeHttpUrl('nao-e-url')).toBeNull()
    expect(toSafeHttpUrl('https://example.com/foo bar.jpg')).toBeNull()
    expect(toSafeHttpUrl('https://')).toBeNull()
    expect(toSafeHttpUrl('//example.com/image.jpg')).toBeNull()
  })

  it('rejeita URL acima do comprimento máximo', () => {
    expect(toSafeHttpUrl(`https://example.com/${'a'.repeat(MAX_HTTP_URL_LENGTH)}`)).toBeNull()
  })

  it('isAllowedHttpUrl acompanha toSafeHttpUrl', () => {
    expect(isAllowedHttpUrl('https://example.com/image.jpg')).toBe(true)
    expect(isAllowedHttpUrl('javascript:alert(1)')).toBe(false)
  })
})

describe('productFormSchema — URL da imagem', () => {
  const validPayload = {
    title: 'Camiseta Slim Fit',
    price: 29.9,
    description: 'Descrição do produto',
    category: "men's clothing",
    image: 'https://example.com/image.jpg',
  }

  it('rejeita javascript:, data: e vbscript: no campo de imagem', async () => {
    i18n.global.locale.value = 'pt-BR'
    const message = String(i18n.global.t('validation.imageUrl'))

    await expect(
      productFormSchema.validate({ ...validPayload, image: 'javascript:alert(1)' }),
    ).rejects.toThrow(message)
    await expect(
      productFormSchema.validate({
        ...validPayload,
        image: 'data:text/html,<script>alert(1)</script>',
      }),
    ).rejects.toThrow(message)
    await expect(
      productFormSchema.validate({ ...validPayload, image: 'vbscript:msgbox(1)' }),
    ).rejects.toThrow(message)
  })

  it('aceita HTTP e HTTPS no campo de imagem', async () => {
    await expect(
      productFormSchema.validate({ ...validPayload, image: 'http://example.com/image.jpg' }),
    ).resolves.toMatchObject({ image: 'http://example.com/image.jpg' })
    await expect(productFormSchema.validate(validPayload)).resolves.toMatchObject({
      image: validPayload.image,
    })
  })
})
