import { effectScope, nextTick, ref, type EffectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedRef } from '@/composables/useDebouncedRef'

describe('useDebouncedRef', () => {
  let scope: EffectScope

  beforeEach(() => {
    vi.useFakeTimers()
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    vi.useRealTimers()
  })

  it('aplica debounce em valores não vazios', async () => {
    const source = ref('a')
    const debounced = scope.run(() => useDebouncedRef(source, 300))!

    source.value = 'abc'
    await nextTick()
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(299)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(1)
    expect(debounced.value).toBe('abc')
  })

  it('sincroniza imediatamente ao limpar a busca', async () => {
    const source = ref('produto')
    const debounced = scope.run(() => useDebouncedRef(source, 300))!

    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe('produto')

    source.value = '   '
    await nextTick()
    expect(debounced.value).toBe('   ')
  })
})
