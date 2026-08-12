import { describe, expect, it } from 'vitest'

import { formatPrice } from '@/utils/formatPrice'

describe('formatPrice', () => {
  it('formata valores em BRL', () => {
    expect(formatPrice(109.95)).toMatch(/109[,.]95/)
    expect(formatPrice(0)).toMatch(/0[,.]00/)
  })
})
