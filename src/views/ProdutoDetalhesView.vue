<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Skeleton from 'primevue/skeleton'

import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import ProductDetails from '@/components/products/ProductDetails.vue'
import { useProductDetails } from '@/composables/useProductDetails'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { parseProductId } from '@/utils/parseProductId'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const favoritesStore = useFavoritesStore()

const productId = computed(() => parseProductId(route.params.id))

const { product, isLoading, hasError, notFound, loadProduct } = useProductDetails(productId)

const isFavorite = computed(() => {
  if (product.value === null) {
    return false
  }

  return favoritesStore.isFavorite(product.value.id)
})

function toggleFavorite(): void {
  if (product.value === null) {
    return
  }

  if (favoritesStore.isFavorite(product.value.id)) {
    favoritesStore.removeFavorite(product.value.id)
    return
  }

  favoritesStore.addFavorite(product.value.id)
}

function goToCatalog(): void {
  void router.push({ name: 'produtos' })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-2.5 py-3 sm:px-6 sm:py-6 lg:py-8">
    <div class="mb-3 flex min-w-0 flex-wrap items-center gap-2 text-sm sm:mb-6 sm:gap-3">
      <button
        type="button"
        class="inline-flex min-h-10 items-center gap-1.5 rounded-md px-1 py-1 font-medium text-slate-600 outline-none transition hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-slate-300 dark:hover:text-slate-100"
        :aria-label="t('product.backAria')"
        @click="goToCatalog"
      >
        <svg
          class="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
        {{ t('product.back') }}
      </button>

      <nav class="min-w-0 flex-1 text-slate-400 dark:text-slate-500" :aria-label="t('favorites.breadcrumb')">
        <ol class="flex min-w-0 flex-wrap items-center gap-1.5">
          <li>
            <RouterLink
              to="/produtos"
              class="rounded-sm outline-none hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:text-slate-300"
            >
              {{ t('nav.products') }}
            </RouterLink>
          </li>
          <li aria-hidden="true">/</li>
          <li class="min-w-0 break-words text-slate-500 dark:text-slate-400" aria-current="page">
            <template v-if="product">{{ product.title }}</template>
            <template v-else>{{ t('product.details') }}</template>
          </li>
        </ol>
      </nav>
    </div>

    <div
      v-if="isLoading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8 dark:border-slate-700 dark:bg-slate-950"
    >
      <p class="sr-only">{{ t('product.loadingDetails') }}</p>
      <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Skeleton width="100%" height="16rem" class="rounded-xl" />
        <div class="space-y-4">
          <Skeleton width="8rem" height="1.5rem" class="rounded-full" />
          <Skeleton width="90%" height="2rem" />
          <Skeleton width="12rem" height="1.25rem" />
          <Skeleton width="8rem" height="2.5rem" />
          <Skeleton width="100%" height="6rem" />
          <Skeleton width="14rem" height="2.75rem" class="rounded-lg" />
        </div>
      </div>
    </div>

    <ErrorState
      v-else-if="hasError"
      :title="t('product.errorTitle')"
      :description="t('product.errorDescription')"
      @retry="loadProduct"
    />

    <EmptyState
      v-else-if="notFound"
      :title="t('product.notFoundTitle')"
      :description="t('product.notFoundDescription')"
      :action-label="t('product.backToProducts')"
      @action="goToCatalog"
    />

    <ProductDetails
      v-else-if="product"
      :product="product"
      :favorited="isFavorite"
      @toggle-favorite="toggleFavorite"
    />
  </div>
</template>
