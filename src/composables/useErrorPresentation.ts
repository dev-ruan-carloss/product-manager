import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

import type { AppError, ErrorUiContext } from '@/types/api'
import { formatFieldErrorHint, resolveErrorCopy } from '@/utils/resolveErrorCopy'

/**
 * Traduz um AppError normalizado para copy de UI no contexto informado.
 */
export function useErrorPresentation(
  error: MaybeRefOrGetter<AppError | null | undefined>,
  context: MaybeRefOrGetter<ErrorUiContext>,
) {
  const { t } = useI18n()

  const presentation = computed(() => {
    const currentError = toValue(error)
    const currentContext = toValue(context)

    if (!currentError) {
      return null
    }

    const keys = resolveErrorCopy(currentError, currentContext)
    const fieldHint = formatFieldErrorHint(currentError.fieldErrors)

    let description = t(keys.descriptionKey)
    if (fieldHint && currentError.kind === 'validation') {
      description = `${t(keys.descriptionKey)} ${fieldHint}`
    }

    return {
      title: t(keys.titleKey),
      description,
      actionLabel: t(keys.actionKey),
      secondaryActionLabel: keys.secondaryActionKey ? t(keys.secondaryActionKey) : undefined,
      showPrimaryAction: keys.showPrimaryAction,
      kind: currentError.kind,
      retryable: currentError.retryable,
    }
  })

  return { presentation }
}

/** Mensagem curta para Toast / alerta inline de ação. */
export function useActionErrorMessage() {
  const { t } = useI18n()

  function messageFor(error: AppError, context: ErrorUiContext): string {
    const keys = resolveErrorCopy(error, context)
    return t(keys.titleKey)
  }

  return { messageFor }
}
