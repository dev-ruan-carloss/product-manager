import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

import { useFavoritesStore } from '@/stores/favoritesStore'

/**
 * Alterna favorito com feedback contextual (Toast) em caso de falha de persistência.
 * Não interrompe a página inteira — erro isolado da ação.
 */
export function useFavoriteToggle() {
  const favoritesStore = useFavoritesStore()
  const toast = useToast()
  const { t } = useI18n()

  function isFavorite(productId: number): boolean {
    return favoritesStore.isFavorite(productId)
  }

  function toggleFavorite(productId: number): boolean {
    const succeeded = favoritesStore.isFavorite(productId)
      ? favoritesStore.removeFavorite(productId)
      : favoritesStore.addFavorite(productId)

    if (!succeeded) {
      toast.add({
        severity: 'error',
        summary: t('toast.error'),
        detail: t('errors.favoriteToggle'),
        life: 4000,
      })
    }

    return succeeded
  }

  return {
    isFavorite,
    toggleFavorite,
  }
}
