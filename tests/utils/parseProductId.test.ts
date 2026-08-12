import { describe, expect, it } from 'vitest'

import { parseProductId } from '@/utils/parseProductId'

describe('parseProductId', () => {
  it('aceita IDs inteiros positivos', () => {
    expect(parseProductId('1')).toBe(1)
    expect(parseProductId('42')).toBe(42)
  })

  it('rejeita valores inválidos', () => {
    expect(parseProductId(undefined)).toBeNull()
    expect(parseProductId('')).toBeNull()
    expect(parseProductId('abc')).toBeNull()
    expect(parseProductId('1.5')).toBeNull()
    expect(parseProductId('0')).toBeNull()
    expect(parseProductId('-3')).toBeNull()
    expect(parseProductId(['1', '2'])).toBe(1)
  })
})
