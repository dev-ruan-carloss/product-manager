import { defineComponent } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSaveProductRating } from '@/composables/useSaveProductRating'
import { RATINGS_STORAGE_KEY, useRatingsStore } from '@/stores/ratingsStore'
import { mountWithApp } from '../helpers/mountComponent'

describe('useSaveProductRating', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  async function mountSaver() {
    let saveRating!: ReturnType<typeof useSaveProductRating>['saveRating']

    const Host = defineComponent({
      setup() {
        saveRating = useSaveProductRating().saveRating
        return () => null
      },
    })

    const mounted = await mountWithApp(Host)
    return { ...mounted, saveRating }
  }

  it('salva a primeira avaliação e persiste no localStorage', async () => {
    const { saveRating, pinia, wrapper } = await mountSaver()

    expect(saveRating(7, 5)).toBe(true)
    expect(useRatingsStore(pinia).getRating(7)).toBe(5)
    expect(JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) ?? '{}')).toEqual({ '7': 5 })
    wrapper.unmount()
  })

  it('altera avaliação existente sem criar outro registro', async () => {
    const { saveRating, pinia, wrapper } = await mountSaver()

    saveRating(7, 4)
    saveRating(7, 5)

    expect(useRatingsStore(pinia).getRating(7)).toBe(5)
    expect(Object.keys(useRatingsStore(pinia).ratings)).toHaveLength(1)
    wrapper.unmount()
  })

  it('retorna false e não persiste quando o armazenamento falha', async () => {
    const { saveRating, pinia, wrapper } = await mountSaver()
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(saveRating(7, 5)).toBe(false)
    expect(useRatingsStore(pinia).hasRating(7)).toBe(false)

    setItem.mockRestore()
    wrapper.unmount()
  })
})
