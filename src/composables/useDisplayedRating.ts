import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { storeToRefs } from 'pinia'

import { useRatingsStore } from '@/stores/ratingsStore'
import type { Product, ProductRating, UserRatingValue } from '@/types/product'
import { resolveDisplayedRating } from '@/utils/resolveDisplayedRating'

/**
 * Resolve a avaliação exibida a partir do rating original do produto e da
 * avaliação local do usuário. Usado no catálogo e nos detalhes — sem duplicar
 * o cálculo nos componentes e sem mutar o `Product` da API.
 */
export function useDisplayedRating(product: MaybeRefOrGetter<Product>) {
  const ratingsStore = useRatingsStore()
  const { ratings } = storeToRefs(ratingsStore)

  const userRating = computed<UserRatingValue | undefined>(() => {
    const productId = Number(toValue(product).id)
    return ratings.value[productId]
  })

  const hasUserRating = computed(() => userRating.value !== undefined)

  const displayedRating = computed<ProductRating>(() =>
    resolveDisplayedRating(toValue(product).rating, userRating.value),
  )

  return {
    displayedRating,
    userRating,
    hasUserRating,
  }
}
