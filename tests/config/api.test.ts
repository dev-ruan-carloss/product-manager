import axios, { AxiosError } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { isAppError, toAppError } from '@/config/api'
import type { AppError } from '@/types/api'

function axiosError(options: {
  message?: string
  code?: string
  status?: number
  data?: unknown
}): AxiosError {
  const error = new AxiosError(options.message ?? 'Request failed')
  error.code = options.code

  if (options.status !== undefined) {
    error.response = {
      status: options.status,
      statusText: 'Error',
      data: options.data ?? {},
      headers: {},
      config: error.config ?? { headers: new axios.AxiosHeaders() },
    }
  }

  return error
}

describe('toAppError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('classifica erro de rede sem resposta', () => {
    const result = toAppError(axiosError({ message: 'Network Error', code: 'ERR_NETWORK' }))

    expect(result.kind).toBe('network')
    expect(result.retryable).toBe(true)
    expect(result.status).toBeUndefined()
  })

  it('classifica timeout por código Axios', () => {
    const result = toAppError(
      axiosError({ message: 'timeout of 15000ms exceeded', code: 'ECONNABORTED' }),
    )

    expect(result.kind).toBe('timeout')
    expect(result.retryable).toBe(true)
  })

  it('classifica 404 como notFound', () => {
    const result = toAppError(axiosError({ status: 404, message: 'Not Found' }))

    expect(result.kind).toBe('notFound')
    expect(result.status).toBe(404)
    expect(result.retryable).toBe(false)
  })

  it('classifica 500/503 como server', () => {
    expect(toAppError(axiosError({ status: 500 })).kind).toBe('server')
    expect(toAppError(axiosError({ status: 503 })).kind).toBe('server')
    expect(toAppError(axiosError({ status: 503 })).retryable).toBe(true)
  })

  it('classifica 400/422 como validation e extrai fieldErrors', () => {
    const result = toAppError(
      axiosError({
        status: 422,
        data: { errors: { title: 'Required', price: ['Invalid'] } },
      }),
    )

    expect(result.kind).toBe('validation')
    expect(result.fieldErrors).toEqual({ title: 'Required', price: 'Invalid' })
  })

  it('classifica 401/403 como auth e 429 como rateLimit', () => {
    expect(toAppError(axiosError({ status: 401 })).kind).toBe('auth')
    expect(toAppError(axiosError({ status: 403 })).kind).toBe('auth')
    expect(toAppError(axiosError({ status: 429 })).kind).toBe('rateLimit')
  })

  it('classifica erro inesperado genérico', () => {
    const result = toAppError(new Error('boom'))

    expect(result.kind).toBe('unexpected')
    expect(result.message).toBe('boom')
    expect(result.retryable).toBe(false)
  })

  it('preserva AppError já normalizado', () => {
    const existing: AppError = {
      kind: 'server',
      message: 'already',
      status: 502,
      retryable: true,
    }

    expect(toAppError(existing)).toBe(existing)
    expect(isAppError(existing)).toBe(true)
    expect(isAppError({ message: 'x' })).toBe(false)
  })
})
