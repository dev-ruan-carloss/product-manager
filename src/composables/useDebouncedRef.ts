import { onScopeDispose, ref, watch, type Ref } from 'vue'

/**
 * Espelha um ref com atraso, evitando reprocessar a cada alteração imediata.
 * Valores vazios (após trim, quando string) sincronizam imediatamente.
 */
export function useDebouncedRef<T>(source: Ref<T>, delayMs = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }

    const shouldSyncImmediately = typeof value === 'string' && value.trim().length === 0

    if (shouldSyncImmediately) {
      debounced.value = value
      return
    }

    timer = setTimeout(() => {
      debounced.value = value
      timer = undefined
    }, delayMs)
  })

  onScopeDispose(() => {
    if (timer !== undefined) {
      clearTimeout(timer)
    }
  })

  return debounced
}
