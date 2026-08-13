import type { AppError } from '@/types/api'

export interface ErrorLogContext {
  operation?: string
  route?: string
  source?: string
}

function safeSummary(error: AppError, context?: ErrorLogContext) {
  return {
    kind: error.kind,
    status: error.status,
    code: error.code,
    operation: context?.operation,
    route: context?.route,
    source: context?.source,
    timestamp: new Date().toISOString(),
    env: import.meta.env.MODE,
  }
}

/**
 * Log estruturado e seguro: sem tokens, payloads ou headers.
 * Em desenvolvimento, inclui a mensagem técnica para diagnóstico.
 */
export function logAppError(error: AppError, context?: ErrorLogContext): void {
  const summary = safeSummary(error, context)

  if (import.meta.env.DEV) {
    console.error('[AppError]', summary, error.message)
    return
  }

  console.error('[AppError]', summary)
}

/**
 * Normaliza e registra erros inesperados de runtime (Vue / window).
 */
export function logUnexpectedError(error: unknown, context?: ErrorLogContext): void {
  if (isAppErrorLike(error)) {
    logAppError(error, context)
    return
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unexpected runtime error'

  const summary = {
    kind: 'unexpected' as const,
    operation: context?.operation,
    route: context?.route,
    source: context?.source,
    timestamp: new Date().toISOString(),
    env: import.meta.env.MODE,
  }

  if (import.meta.env.DEV) {
    console.error('[UnexpectedError]', summary, message, error)
    return
  }

  console.error('[UnexpectedError]', summary)
}

function isAppErrorLike(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    'message' in error &&
    'retryable' in error
  )
}
