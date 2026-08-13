/**
 * Categorias de erro da aplicação — usadas para UI e diagnóstico,
 * sem expor detalhes técnicos ao usuário final.
 */
export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'server'
  | 'notFound'
  | 'validation'
  | 'auth'
  | 'conflict'
  | 'rateLimit'
  | 'unexpected'

/**
 * Erro normalizado da aplicação.
 * `message` é técnico (logs/dev); a UI usa `kind` + i18n.
 */
export interface AppError {
  kind: AppErrorKind
  message: string
  code?: string
  status?: number
  /** Indica se retry automático de leitura é razoável; escritas nunca devem auto-repetir. */
  retryable: boolean
  /** Detalhes de campo quando a API retorna erros de validação estruturados. */
  fieldErrors?: Record<string, string>
}

export type ErrorUiContext =
  | 'catalog'
  | 'product'
  | 'favorites'
  | 'formSave'
  | 'categories'
  | 'favoriteToggle'
  | 'page'
