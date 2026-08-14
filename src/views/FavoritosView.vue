<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import { useErrorPresentation } from '@/composables/useErrorPresentation'
import { useFavoriteProducts } from '@/composables/useFavoriteProducts'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const {
  favoriteProducts,
  favoritesCount,
  unavailableFavoritesCount,
  isLoading,
  error,
  hasError,
  isEmpty,
  isFavorite,
  toggleFavorite: toggleFavoriteId,
  loadFavoriteProducts,
} = useFavoriteProducts()

const { presentation } = useErrorPresentation(error, 'favorites')

function toggleFavorite(productId: number): void {
  const succeeded = toggleFavoriteId(productId)

  if (!succeeded) {
    toast.add({
      severity: 'error',
      summary: t('toast.error'),
      detail: t('errors.favoriteToggle'),
      life: 4000,
    })
  }
}

function goToCatalog(): void {
  void router.push({ name: 'produtos' })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-2.5 py-3 sm:px-6 sm:py-6 lg:py-8">
    <nav class="mb-3 text-sm text-slate-400 dark:text-slate-500" :aria-label="t('favorites.breadcrumb')">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li>
          <RouterLink
            to="/produtos"
            class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
          >
            {{ t('favorites.home') }}
          </RouterLink>
        </li>
        <li aria-hidden="true">/</li>
        <li class="text-slate-500 dark:text-slate-400" aria-current="page">{{ t('nav.favorites') }}</li>
      </ol>
    </nav>

    <header class="mb-3 min-w-0 space-y-1 sm:mb-6">
      <h1 class="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
        {{ t('favorites.title') }}
      </h1>
      <p class="text-sm text-slate-500 sm:text-base dark:text-slate-400">
        {{ t('favorites.subtitle') }}
      </p>
    </header>

    <section class="min-w-0 space-y-3 sm:space-y-5" :aria-label="t('favorites.sectionAria')">
      <div
        v-if="!isLoading && !isEmpty && !hasError"
        class="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 shadow-sm sm:gap-3 sm:px-4 sm:py-3 dark:border-slate-700 dark:bg-slate-950"
      >
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"
          aria-hidden="true"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path
              d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
            />
          </svg>
        </span>
        <p class="min-w-0 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">
          <span class="tabular-nums">{{ favoritesCount }}</span>
          {{ favoritesCount === 1 ? t('favorites.countOne') : t('favorites.countMany') }}
        </p>
      </div>

      <LoadingState
        v-if="isLoading"
        :title="t('favorites.loadingTitle')"
        :description="t('favorites.loadingDescription')"
        :rows="Math.min(Math.max(favoritesCount, 1), 8)"
      />

      <ErrorState
        v-else-if="hasError && presentation"
        :title="presentation.title"
        :description="presentation.description"
        :action-label="presentation.actionLabel"
        :show-action="presentation.showPrimaryAction"
        @retry="loadFavoriteProducts"
      />

      <EmptyState
        v-else-if="isEmpty"
        :title="t('favorites.emptyTitle')"
        :description="t('favorites.emptyDescription')"
        :action-label="t('favorites.emptyAction')"
        @action="goToCatalog"
      />

      <EmptyState
        v-else-if="favoriteProducts.length === 0"
        :title="t('favorites.unavailableTitle')"
        :description="t('favorites.unavailableDescription')"
        :action-label="t('favorites.emptyAction')"
        @action="goToCatalog"
      />

      <template v-else>
        <ProductGrid
          :products="favoriteProducts"
          :is-favorite="isFavorite"
          @toggle-favorite="toggleFavorite"
        />

        <p
          v-if="unavailableFavoritesCount > 0"
          class="break-words rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800 sm:px-4 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
          role="status"
        >
          {{ unavailableFavoritesCount }}
          {{
            unavailableFavoritesCount === 1
              ? t('favorites.unavailableOne')
              : t('favorites.unavailableMany')
          }}
        </p>
      </template>
    </section>
  </div>
</template>
