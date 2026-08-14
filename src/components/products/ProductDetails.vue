<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import StarFillIcon from '@primevue/icons/starfill'

import FavoriteButton from '@/components/FavoriteButton.vue'
import ProductImageZoom from '@/components/products/ProductImageZoom.vue'
import ProductRatingDialog from '@/components/products/ProductRatingDialog.vue'
import { useDisplayedRating } from '@/composables/useDisplayedRating'
import { useSaveProductRating } from '@/composables/useSaveProductRating'
import type { Product, UserRatingValue } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import { toSafeHttpUrl } from '@/utils/httpUrl'
import { getLocalizedCategory } from '@/utils/localizeCategory'

const props = defineProps<{
  product: Product
  favorited: boolean
}>()

const emit = defineEmits<{
  toggleFavorite: []
}>()

const { t, locale } = useI18n()
const imageFailed = ref(false)
const ratingDialogOpen = ref(false)
const imageSrc = computed(() => toSafeHttpUrl(props.product.image))

const { displayedRating, hasUserRating, userRating } = useDisplayedRating(() => props.product)
const { saveRating } = useSaveProductRating()

const imageAlt = computed(() => props.product.title)

const categoryLabel = computed(() => {
  void locale.value
  return getLocalizedCategory(props.product.category)
})

const ratingLabel = computed(() =>
  t('product.ratingLabel', {
    rate: displayedRating.value.rate.toFixed(1),
    count: displayedRating.value.count,
  }),
)

const favoriteActionLabel = computed(() =>
  props.favorited ? t('favorites.remove') : t('favorites.add'),
)

const ratingActionLabel = computed(() =>
  hasUserRating.value ? t('rating.change') : t('rating.add'),
)

const ratingCountLabel = computed(() =>
  displayedRating.value.count === 1 ? t('product.ratingOne') : t('product.ratingMany'),
)

function onImageError(): void {
  imageFailed.value = true
}

function openRatingDialog(): void {
  ratingDialogOpen.value = true
}

function onConfirmRating(rating: UserRatingValue): void {
  if (saveRating(props.product.id, rating)) {
    ratingDialogOpen.value = false
  }
}
</script>

<template>
  <article
    class="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950"
    :aria-labelledby="`product-title-${product.id}`"
  >
    <div class="grid min-w-0 gap-0 lg:grid-cols-2">
      <div
        class="relative min-w-0 border-b border-slate-100 bg-white p-3 sm:p-6 lg:border-b-0 lg:border-r lg:p-8 dark:border-slate-800 dark:bg-slate-800 lg:dark:border-r-slate-800"
      >
        <div class="absolute right-2 top-2 z-10 sm:right-5 sm:top-5">
          <FavoriteButton :favorited="favorited" @toggle="emit('toggleFavorite')" />
        </div>

        <div class="flex items-center justify-center py-4 sm:py-6 lg:py-8">
          <ProductImageZoom
            v-if="!imageFailed && imageSrc"
            :src="imageSrc"
            :alt="imageAlt"
            @error="onImageError"
          />
          <div
            v-else
            class="flex h-40 w-full max-w-sm items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400 sm:h-56 dark:bg-slate-700 dark:text-slate-400"
            role="img"
            :aria-label="imageAlt"
          >
            {{ t('product.imageUnavailable') }}
          </div>
        </div>
      </div>

      <div class="flex min-w-0 flex-col gap-3 p-3 sm:gap-5 sm:p-6 lg:p-8">
        <div class="flex flex-wrap items-start gap-2 sm:gap-3">
          <span
            class="inline-flex max-w-full break-words rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
          >
            {{ categoryLabel }}
          </span>

          <span
            v-if="favorited"
            class="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
          >
            <svg
              class="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
              />
            </svg>
            {{ t('favorites.favorited') }}
          </span>
        </div>

        <div class="min-w-0 space-y-3">
          <h1
            :id="`product-title-${product.id}`"
            class="break-words text-xl font-semibold leading-tight text-slate-900 sm:text-3xl dark:text-slate-100"
          >
            {{ product.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-x-1.5 gap-y-1" :aria-label="ratingLabel">
            <StarFillIcon class="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ displayedRating.rate.toFixed(1) }}</span>
            <span class="text-sm text-slate-500 dark:text-slate-400">
              ({{ displayedRating.count }} {{ ratingCountLabel }})
            </span>
          </div>

          <p class="break-words text-3xl font-bold tracking-tight text-violet-700 dark:text-violet-300">
            {{ formatPrice(product.price, locale) }}
          </p>
        </div>

        <section class="min-w-0 space-y-2 border-t border-slate-100 pt-5 dark:border-slate-800" aria-labelledby="product-description-heading">
          <h2 id="product-description-heading" class="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {{ t('product.description') }}
          </h2>
          <p class="break-words text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            {{ product.description }}
          </p>
        </section>

        <div class="mt-auto flex flex-row flex-wrap items-center gap-2 border-t border-slate-100 pt-4 sm:gap-3 sm:pt-5 dark:border-slate-800">
          <button
            type="button"
            class="inline-flex min-h-11 max-w-full grow shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:px-4"
            :class="
              favorited
                ? 'border border-violet-300 bg-white text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:bg-slate-950 dark:text-violet-300 dark:hover:bg-violet-950/40'
                : 'bg-violet-600 text-white hover:bg-violet-700'
            "
            :aria-pressed="favorited"
            @click="emit('toggleFavorite')"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              :fill="favorited ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"
              />
            </svg>
            <span class="text-center">{{ favoriteActionLabel }}</span>
          </button>

          <button
            type="button"
            class="inline-flex min-h-11 max-w-full grow shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 sm:px-4"
            :class="
              hasUserRating
                ? 'border-amber-300 bg-white text-amber-800 hover:bg-amber-50 dark:border-amber-700 dark:bg-slate-950 dark:text-amber-300 dark:hover:bg-amber-950/40'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
            "
            aria-haspopup="dialog"
            :aria-expanded="ratingDialogOpen"
            :aria-label="ratingActionLabel"
            @click="openRatingDialog"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              :fill="hasUserRating ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3.2 14.4 8l5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.8 9.6 8 12 3.2Z"
              />
            </svg>
            <span class="text-center">{{ ratingActionLabel }}</span>
          </button>

          <RouterLink
            :to="{ name: 'produto-editar', params: { id: product.id } }"
            class="inline-flex min-h-11 max-w-full grow shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
              />
            </svg>
            {{ t('product.edit') }}
          </RouterLink>
        </div>
      </div>
    </div>

    <ProductRatingDialog
      v-model:visible="ratingDialogOpen"
      :initial-rating="userRating"
      @confirm="onConfirmRating"
    />
  </article>
</template>
