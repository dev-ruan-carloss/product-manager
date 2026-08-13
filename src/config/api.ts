import axios, { isAxiosError, type AxiosError } from 'axios'

import type { AppError, AppErrorKind } from '@/types/api'
import { logAppError } from '@/utils/logError'

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    'message' in error &&
    'retryable' in error &&
    typeof (error as AppError).kind === 'string' &&
    typeof (error as AppError).message === 'string' &&
    typeof (error as AppError).retryable === 'boolean'
  )
}

function extractFieldErrors(data: unknown): Record<string, string> | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined
  }

  const record = data as Record<string, unknown>
  const source =
    typeof record.errors === 'object' && record.errors !== null
      ? (record.errors as Record<string, unknown>)
      : typeof record.message === 'object' && record.message !== null
        ? (record.message as Record<string, unknown>)
        : null

  if (source === null) {
    return undefined
  }

  const fieldErrors: Record<string, string> = {}

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'string' && value.trim().length > 0) {
      fieldErrors[key] = value.trim()
      continue
    }

    if (Array.isArray(value) && typeof value[0] === 'string') {
      fieldErrors[key] = value[0].trim()
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
}

function classifyHttpStatus(status: number): { kind: AppErrorKind; retryable: boolean } {
  if (status === 400 || status === 422) {
    return { kind: 'validation', retryable: false }
  }

  if (status === 401 || status === 403) {
    return { kind: 'auth', retryable: false }
  }

  if (status === 404) {
    return { kind: 'notFound', retryable: false }
  }

  if (status === 408) {
    return { kind: 'timeout', retryable: true }
  }

  if (status === 409) {
    return { kind: 'conflict', retryable: false }
  }

  if (status === 429) {
    return { kind: 'rateLimit', retryable: true }
  }

  if (status >= 500 && status <= 599) {
    return { kind: 'server', retryable: true }
  }

  return { kind: 'unexpected', retryable: false }
}

function classifyAxiosError(error: AxiosError): AppError {
  const code = error.code
  const status = error.response?.status
  const fieldErrors = extractFieldErrors(error.response?.data)

  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
    return {
      kind: 'timeout',
      message: error.message,
      code,
      status,
      retryable: true,
      fieldErrors,
    }
  }

  if (!error.response) {
    return {
      kind: 'network',
      message: error.message,
      code,
      retryable: true,
    }
  }

  const classified = classifyHttpStatus(error.response.status)

  return {
    kind: classified.kind,
    message: error.message,
    code,
    status: error.response.status,
    retryable: classified.retryable,
    fieldErrors,
  }
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }

  if (isAxiosError(error)) {
    return classifyAxiosError(error)
  }

  if (error instanceof Error) {
    return {
      kind: 'unexpected',
      message: error.message,
      retryable: false,
    }
  }

  return {
    kind: 'unexpected',
    message: 'Unexpected API communication error.',
    retryable: false,
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://fakestoreapi.com',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const appError = toAppError(error)
    logAppError(appError, { source: 'api.interceptor' })
    return Promise.reject(appError)
  },
)

export default api
