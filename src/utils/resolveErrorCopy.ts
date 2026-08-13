import type { AppError, AppErrorKind, ErrorUiContext } from '@/types/api'

export interface ErrorCopyKeys {
  titleKey: string
  descriptionKey: string
  actionKey: string
  secondaryActionKey?: string
  showPrimaryAction: boolean
}

const KIND_TITLE_KEY: Record<AppErrorKind, string> = {
  network: 'errors.network',
  timeout: 'errors.timeout',
  server: 'errors.server',
  notFound: 'errors.notFound',
  validation: 'errors.validation',
  auth: 'errors.auth',
  conflict: 'errors.conflict',
  rateLimit: 'errors.rateLimit',
  unexpected: 'errors.unexpected',
}

const KIND_ACTION_KEY: Record<AppErrorKind, string> = {
  network: 'errors.networkAction',
  timeout: 'errors.timeoutAction',
  server: 'errors.serverAction',
  notFound: 'errors.notFoundAction',
  validation: 'errors.validationAction',
  auth: 'errors.authAction',
  conflict: 'errors.conflictAction',
  rateLimit: 'errors.rateLimitAction',
  unexpected: 'errors.unexpectedAction',
}

const CONTEXT_TITLE_KEY: Partial<Record<ErrorUiContext, string>> = {
  catalog: 'error.productsTitle',
  product: 'product.errorTitle',
  favorites: 'favorites.errorTitle',
  formSave: 'errors.formSave',
  categories: 'form.categoriesLoadError',
  favoriteToggle: 'errors.favoriteToggle',
  page: 'errors.pageTitle',
}

/**
 * Resolve chaves i18n a partir do erro normalizado e do contexto de UI.
 * A View/componente traduz com `t()` — sem strings fixas no código.
 */
export function resolveErrorCopy(error: AppError, context: ErrorUiContext): ErrorCopyKeys {
  if (context === 'formSave') {
    return {
      titleKey: 'errors.formSave',
      descriptionKey: KIND_ACTION_KEY[error.kind],
      actionKey: 'errors.retry',
      showPrimaryAction: false,
    }
  }

  if (context === 'favoriteToggle' || context === 'categories') {
    return {
      titleKey: CONTEXT_TITLE_KEY[context] ?? KIND_TITLE_KEY[error.kind],
      descriptionKey: KIND_ACTION_KEY[error.kind],
      actionKey: 'errors.retry',
      showPrimaryAction: false,
    }
  }

  if (context === 'page') {
    return {
      titleKey: 'errors.pageTitle',
      descriptionKey: 'errors.pageDescription',
      actionKey: 'errors.retry',
      secondaryActionKey: 'errors.backHome',
      showPrimaryAction: true,
    }
  }

  const titleKey = CONTEXT_TITLE_KEY[context] ?? KIND_TITLE_KEY[error.kind]
  const descriptionKey = KIND_ACTION_KEY[error.kind]

  const showPrimaryAction =
    context === 'catalog' ||
    context === 'product' ||
    context === 'favorites' ||
    error.retryable

  const copy: ErrorCopyKeys = {
    titleKey,
    descriptionKey,
    actionKey: 'errors.retry',
    showPrimaryAction,
  }

  if (error.kind === 'notFound' || error.kind === 'auth') {
    copy.secondaryActionKey = 'errors.backToCatalog'
  }

  return copy
}

/** Junta mensagem de validação geral com detalhes de campo seguros (apenas texto). */
export function formatFieldErrorHint(fieldErrors: Record<string, string> | undefined): string | null {
  if (!fieldErrors) {
    return null
  }

  const messages = Object.values(fieldErrors)
    .map((value) => value.trim())
    .filter((value) => value.length > 0 && value.length < 200)

  if (messages.length === 0) {
    return null
  }

  return messages.slice(0, 5).join(' ')
}
