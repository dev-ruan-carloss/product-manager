import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

import { useRatingsStore } from '@/stores/ratingsStore'
import { isUserRatingValue, type UserRatingValue } from '@/types/product'

/**
 * Persiste a avaliação local (1–5) com feedback contextual (Toast).
 * Não chama a FakeStoreAPI — a API não possui endpoint de avaliação do usuário.
 */
export function useSaveProductRating() {
  const ratingsStore = useRatingsStore()
  const toast = useToast()
  const { t } = useI18n()

  function saveRating(productId: number, rating: UserRatingValue): boolean {
    if (!isUserRatingValue(rating)) {
      return false
    }

    const isUpdate = ratingsStore.hasRating(productId)
    const succeeded = ratingsStore.setRating(productId, rating)

    if (!succeeded) {
      toast.add({
        severity: 'error',
        summary: t('toast.error'),
        detail: t('errors.ratingSave'),
        life: 4000,
      })
      return false
    }

    toast.add({
      severity: 'success',
      summary: t('toast.success'),
      detail: isUpdate ? t('toast.ratingUpdateSuccess') : t('toast.ratingSuccess'),
      life: 4000,
    })

    return true
  }

  return {
    saveRating,
  }
}
