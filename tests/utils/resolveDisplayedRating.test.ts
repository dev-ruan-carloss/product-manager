import { describe, expect, it } from 'vitest'

import { isUserRatingValue } from '@/types/product'
import { resolveDisplayedRating } from '@/utils/resolveDisplayedRating'

describe('resolveDisplayedRating', () => {
  const apiRating = { rate: 4.2, count: 10 }

  it('devolve o rating original quando não há avaliação local', () => {
    expect(resolveDisplayedRating(apiRating, undefined)).toEqual({ rate: 4.2, count: 10 })
  })

  it('incorpora a primeira avaliação incrementando o count e recalculando a média', () => {
    const displayed = resolveDisplayedRating(apiRating, 5)

    expect(displayed.count).toBe(11)
    expect(displayed.rate).toBeCloseTo((4.2 * 10 + 5) / 11, 10)
    expect(displayed.rate.toFixed(1)).toBe('4.3')
  })

  it('aceita avaliação de 1 estrela', () => {
    const displayed = resolveDisplayedRating(apiRating, 1)

    expect(displayed.count).toBe(11)
    expect(displayed.rate).toBeCloseTo((4.2 * 10 + 1) / 11, 10)
  })

  it('aceita avaliação de 5 estrelas', () => {
    const displayed = resolveDisplayedRating(apiRating, 5)

    expect(displayed.count).toBe(11)
    expect(displayed.rate).toBeCloseTo(4.272727, 5)
  })

  it('substitui a avaliação anterior sem incrementar o count novamente', () => {
    const afterFirst = resolveDisplayedRating(apiRating, 4)
    const afterChange = resolveDisplayedRating(apiRating, 5)

    expect(afterFirst.count).toBe(11)
    expect(afterChange.count).toBe(11)
    expect(afterChange.count).toBe(afterFirst.count)
    expect(afterChange.rate).toBeCloseTo((4.2 * 10 + 5) / 11, 10)
    expect(afterChange.rate).not.toBe(afterFirst.rate)
  })

  it('preserva precisão interna e arredonda somente na apresentação', () => {
    const displayed = resolveDisplayedRating(apiRating, 5)

    expect(displayed.rate).not.toBe(4.3)
    expect(displayed.rate).toBeGreaterThan(4.27)
    expect(Number(displayed.rate.toFixed(1))).toBe(4.3)
  })

  it('funciona para produto sem avaliações originais (CREATE na sessão)', () => {
    const displayed = resolveDisplayedRating({ rate: 0, count: 0 }, 5)

    expect(displayed.count).toBe(1)
    expect(displayed.rate).toBe(5)
    expect(displayed.rate.toFixed(1)).toBe('5.0')
  })

  it('não muta o rating original da API', () => {
    const original = { rate: 4.2, count: 10 }
    resolveDisplayedRating(original, 5)

    expect(original).toEqual({ rate: 4.2, count: 10 })
  })
})

describe('isUserRatingValue', () => {
  it('aceita apenas inteiros de 1 a 5', () => {
    expect(isUserRatingValue(1)).toBe(true)
    expect(isUserRatingValue(5)).toBe(true)
    expect(isUserRatingValue(0)).toBe(false)
    expect(isUserRatingValue(6)).toBe(false)
    expect(isUserRatingValue(2.5)).toBe(false)
    expect(isUserRatingValue('5')).toBe(false)
    expect(isUserRatingValue(null)).toBe(false)
  })
})
