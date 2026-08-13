import { describe, expect, it } from 'vitest'

import type { AppError } from '@/types/api'
import { formatFieldErrorHint, resolveErrorCopy } from '@/utils/resolveErrorCopy'

function error(partial: Partial<AppError> & Pick<AppError, 'kind'>): AppError {
  return {
    message: 'tech',
    retryable: partial.retryable ?? false,
    ...partial,
  }
}

describe('resolveErrorCopy', () => {
  it('usa título contextual do catálogo e ação por kind', () => {
    const copy = resolveErrorCopy(error({ kind: 'network', retryable: true }), 'catalog')

    expect(copy.titleKey).toBe('error.productsTitle')
    expect(copy.descriptionKey).toBe('errors.networkAction')
    expect(copy.showPrimaryAction).toBe(true)
  })

  it('diferencia 404/notFound com ação secundária para o catálogo', () => {
    const copy = resolveErrorCopy(error({ kind: 'notFound', status: 404 }), 'product')

    expect(copy.titleKey).toBe('product.errorTitle')
    expect(copy.descriptionKey).toBe('errors.notFoundAction')
    expect(copy.secondaryActionKey).toBe('errors.backToCatalog')
  })

  it('não oferece retry automático visual para erro de formulário', () => {
    const copy = resolveErrorCopy(error({ kind: 'server', retryable: true }), 'formSave')

    expect(copy.titleKey).toBe('errors.formSave')
    expect(copy.showPrimaryAction).toBe(false)
  })

  it('formata fieldErrors de forma segura', () => {
    expect(formatFieldErrorHint({ title: 'Required', price: '  ' })).toBe('Required')
    expect(formatFieldErrorHint(undefined)).toBeNull()
  })
})
