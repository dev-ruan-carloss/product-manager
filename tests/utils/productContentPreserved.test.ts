import { beforeEach, describe, expect, it } from 'vitest'

import { i18n } from '@/i18n'
import type { Product } from '@/types/product'
import type { AppLocale } from '@/types/locale'
import { getLocalizedCategory } from '@/utils/localizeCategory'

/**
 * Regra arquitetural: conteúdo dinâmico da FakeStoreAPI (title/description)
 * permanece no idioma original. Apenas categorias conhecidas são localizadas.
 */
function presentProduct(product: Product, locale: AppLocale) {
  i18n.global.locale.value = locale

  return {
    title: product.title,
    description: product.description,
    category: product.category,
    categoryLabel: getLocalizedCategory(product.category),
  }
}

const opnaProduct: Product = {
  id: 19,
  title: "Opna Women's Short Sleeve Moisture",
  price: 7.95,
  description:
    '100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimming fit, keeps you stylish and cool all summer long.',
  category: "women's clothing",
  image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg',
  rating: { rate: 4.7, count: 130 },
}

describe('conteúdo dinâmico de produtos (sem tradução automática)', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'pt-BR'
  })

  it('em pt-BR preserva title e description originais e localiza apenas a categoria', () => {
    const presented = presentProduct(opnaProduct, 'pt-BR')

    expect(presented.title).toBe("Opna Women's Short Sleeve Moisture")
    expect(presented.description).toBe(opnaProduct.description)
    expect(presented.category).toBe("women's clothing")
    expect(presented.categoryLabel).toBe('Moda feminina')
  })

  it('troca de idioma não altera title nem description', () => {
    const inPt = presentProduct(opnaProduct, 'pt-BR')
    const inEs = presentProduct(opnaProduct, 'es')
    const inEn = presentProduct(opnaProduct, 'en')

    expect(inPt.title).toBe(opnaProduct.title)
    expect(inEs.title).toBe(opnaProduct.title)
    expect(inEn.title).toBe(opnaProduct.title)

    expect(inPt.description).toBe(opnaProduct.description)
    expect(inEs.description).toBe(opnaProduct.description)
    expect(inEn.description).toBe(opnaProduct.description)

    expect(inPt.categoryLabel).toBe('Moda feminina')
    expect(inEs.categoryLabel).toBe('Ropa de mujer')
    expect(inEn.categoryLabel).toBe("Women's clothing")
  })
})
