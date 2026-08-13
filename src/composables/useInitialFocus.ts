import { nextTick, onMounted, type MaybeRefOrGetter, toValue } from 'vue'

function isVisible(element: HTMLElement): boolean {
  if (!element.isConnected) {
    return false
  }

  let current: Element | null = element
  while (current instanceof HTMLElement) {
    if (current.hasAttribute('hidden')) {
      return false
    }

    const style = window.getComputedStyle(current)
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false
    }

    current = current.parentElement
  }

  return true
}

function hasUserFocus(): boolean {
  const active = document.activeElement
  if (!(active instanceof HTMLElement) || active === document.body || active === document.documentElement) {
    return false
  }

  const tag = active.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    tag === 'BUTTON' ||
    tag === 'A' ||
    active.isContentEditable ||
    active.tabIndex >= 0
  )
}

function resolveFocusTarget(target: HTMLElement | string | null | undefined): HTMLElement | null {
  if (target == null) {
    return null
  }

  if (typeof target === 'string') {
    const byId = document.getElementById(target)
    return byId instanceof HTMLElement ? byId : null
  }

  return target
}

/**
 * Foca o campo principal após a montagem, sem roubar foco já escolhido pelo usuário
 * e sem focar elementos ocultos (ex.: busca mobile vs desktop).
 */
export function useInitialFocus(
  target: MaybeRefOrGetter<HTMLElement | string | null | undefined>,
  options?: {
    enabled?: MaybeRefOrGetter<boolean>
  },
): void {
  onMounted(() => {
    void nextTick(() => {
      if (toValue(options?.enabled) === false) {
        return
      }

      if (hasUserFocus()) {
        return
      }

      const element = resolveFocusTarget(toValue(target))
      if (!element || !isVisible(element)) {
        return
      }

      element.focus()
    })
  })
}
